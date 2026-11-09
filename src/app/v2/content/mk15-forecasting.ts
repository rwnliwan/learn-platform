import type { V2Lesson } from "../lib/types";

export const mk15: V2Lesson = {
  slug: "mk15-forecasting",
  track: "Marketing Analytics",
  module: "Forecasting",
  title: "MK15 — Forecasting Demand",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-segarmart",
      eyebrow: "Langkah 1 · Cerita SegarMart",
      title: "Rata-rata 133 untuk sirup yang meledak saat Lebaran",
      prose: [
        "SegarMart meramal demand sirup dengan rata-rata 12 bulan: 133/bulan. Setiap Lebaran demand melonjak ke 500 — dan setiap tahun stockout. Rata-rata menghukum produk musiman: ia meremehkan puncak dan melebihkan lembah.",
        "Forecast yang benar memisahkan pola: tren (tumbuh?), musiman (Lebaran tiap tahun), event (promo), dan noise. Rata-rata mencampur semuanya jadi satu angka yang salah untuk semua keperluan.",
        "Lesson ini: dekomposisi, SES/Holt-Winters, metrik error yang jujur, dan newsvendor untuk keputusan stok.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai rata-rata untuk produk musiman/bertren. Rata-rata hanya valid untuk deret stasioner tanpa pola — yang jarang ada di retail.",
        type: "pitfall",
      },
      reference: "Pisahkan tren + musiman + event + noise. Jangan rata-rata buta.",
    },
    {
      id: "dekomposisi",
      eyebrow: "Langkah 2 · Dekomposisi",
      title: "y = T + S + H + e",
      prose: [
        "Dekomposisi: y = Tren + Musiman + Holiday/event + error. Lebaran bergeser tiap tahun (kalender Hijriah) — dummy \u201Cbulan puasa\u201D kalender Masehi gagal total. Pakai dummy Hijriah atau event window (H−30 s.d. H+7).",
        "Praktik: plot deretnya dulu. Tren naik? Musiman 12-bulanan? Lonjakan di event yang sama tiap tahun? Dekomposisi yang terlihat di plot = dekomposisi yang harus dimodelkan.",
        "Aturan: event yang bisa dijelaskan (Lebaran, 11.11, promo) jangan dibiarkan jadi \u201Cnoise\u201D — keluarkan jadi variabel. Noise = yang tersisa setelah semua pola dijelaskan.",
      ],
      formula: String.raw`y_t = T_t + S_t + H_t + e_t`,
      formulaNote: "Dekomposisi deret waktu: y_t = observasi periode t; T_t = tren (arah jangka panjang); S_t = musiman (pola berulang, mis. Lebaran tahunan); H_t = holiday/event (efek kalender/promosi); e_t = error/noise (sisa yang tak dijelaskan). Aturan: yang bisa dijelaskan (event) dikeluarkan dari noise menjadi variabel.",
      tasks: [],
      reference: "Lebaran = dummy Hijriah, bukan bulan Masehi.",
    },
    {
      id: "ses-lab",
      eyebrow: "Langkah 3 · SES & Holt-Winters & lab",
      title: "Exponential smoothing dari nol",
      prose: [
        "SES: ŷ_{t+1} = α·y_t + (1−α)·ŷ_t. α besar = responsif (ikuti data terakhir); α kecil = halus (percaya histori). Mulai ŷ_1 = y_1.",
        "Holt-Winters menambah tren + musiman. Worked example lesson lama: 6 periode manual → forecast t+7 = 141,1. Intinya sama: bobot eksponensial menurun untuk masa lalu.",
        "Di lab ini kamu mengimplementasikan SES 4 periode. Empat baris kode — dan kamu sudah paham inti semua metode smoothing.",
      ],
      formula: String.raw`\hat{y}_{t+1} = \alpha y_t + (1-\alpha)\hat{y}_t`,
      formulaNote: "SES (simple exponential smoothing): y-hat_{t+1} = forecast periode berikutnya; y_t = aktual terakhir; y-hat_t = forecast periode ini; alpha = bobot masa kini (0-1). Alpha besar (0,9) = responsif mengikuti data terakhir; kecil (0,1) = halus percaya histori. Ekuivalen rata-rata tertimbang eksponensial atas seluruh masa lalu.",
      tasks: [
        { id: "t1", text: "Implementasikan loop SES: `f = alpha*y + (1-alpha)*f`" },
        { id: "t2", text: "Cetak forecast periode berikutnya (`f` terakhir)" },
      ],
      expected: "forecast=128.52",
      hints: [
        "Mulai f = aktual[0], lalu loop untuk y di aktual[1:].",
        "f = alpha * y + (1 - alpha) * f.",
        "Urutan f: 120 → 123 → 123,6 → 128,52.",
      ],
      code: {
        starter: `aktual = [120, 130, 125, 140]\nalpha = 0.3\n\n# TULIS KODEMU: SES, mulai f = aktual pertama\nf = aktual[0]\nfor y in aktual[1:]:\n    f =\n\nprint(f"forecast={f:.2f}")`,
        lockLines: 2,
        solution: `aktual = [120, 130, 125, 140]\nalpha = 0.3\n\n# TULIS KODEMU: SES, mulai f = aktual pertama\nf = aktual[0]\nfor y in aktual[1:]:\n    f = alpha * y + (1 - alpha) * f\n\nprint(f"forecast={f:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "f", value: 128.52, tol: 0.01, label: "`f` seharusnya 128,52", msg: "0,3×140 + 0,7×123,6 = 128,52." },
          { kind: "stdout_matches", task: "t2", pattern: "forecast=128\\.52", label: "`print` menampilkan forecast", msg: "Format: forecast=... dengan 2 desimal." },
        ],
      },
      reference: "α besar = responsif; α kecil = halus.",
    },
    {
      id: "metrik-error",
      eyebrow: "Langkah 4 · Metrik error",
      title: "WAPE 7% dan MAPE yang menipu",
      prose: [
        "WAPE = Σ|error| / Σ|aktual|. Worked: 7% — intuitif: \u201Crata-rata meleset 7% dari total volume\u201D. Ukur juga bias = rata-rata (forecast − aktual): bias positif = over-forecast sistematis (stok menumpuk).",
        "MAPE menipu: error dibagi aktual per periode — satu periode aktual kecil (mis. 2 unit) membuat MAPE meledak walau error absolutnya sepele. Untuk SKU slow-moving, MAPE tidak bisa dipakai.",
        "Aturan: WAPE untuk level agregat, bias untuk deteksi sistematis, dan jangan pernah satu metrik saja. Forecast tanpa ukuran error = ramalan cuaca tanpa payung.",
      ],
      formula: String.raw`\text{WAPE} = \frac{\sum |e_t|}{\sum |y_t|}`,
      formulaNote: "WAPE = weighted absolute percentage error: e_t = error (forecast − aktual) periode t; y_t = aktual. Jumlah error absolut dibagi jumlah aktual = 'rata-rata meleset x% dari total volume'. Robust untuk SKU slow-moving (tidak meledak saat aktual kecil) — tidak seperti MAPE.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengoptimasi MAPE untuk semua SKU. SKU dengan aktual kecil mendominasi MAPE — tim mengorbankan akurasi SKU besar demi memperbaiki MAPE SKU kecil yang tidak material.",
        type: "pitfall",
      },
      reference: "WAPE + bias. MAPE berbahaya untuk slow-mover.",
    },
    {
      id: "hierarki-newsvendor",
      eyebrow: "Langkah 5 · Hierarki & newsvendor",
      title: "Rekonsiliasi dan Q* = 227",
      prose: [
        "Hierarki: forecast nasional harus = jumlah forecast regional = jumlah SKU. Tanpa rekonsiliasi, tiap level punya angka sendiri dan gudang tidak tahu mana yang dipakai. Rekonsiliasi memaksa konsistensi top-down/bottom-up.",
        "Newsvendor: berapa stok optimal untuk produk sekali-pesan? Q* = kuantil Cu/(Cu+Co) dari distribusi demand — Cu = rugi kekurangan (margin hilang), Co = rugi kelebihan (diskon/obral). Dua skenario di lesson ini: Skenario A — service level 90% → Q* = 227; Skenario B (mini-case sirup Lebaran) — Cu Rp8rb vs Co Rp3rb → service level 72,7% → Q* = 460. Angka Q* TIDAK universal — ia mengikuti service level tiap skenario.",
        "Worked (Skenario A — service level 90%): Q* = 227 unit. Intuisinya: jika kekurangan lebih mahal dari kelebihan, stok di atas median — pesan untuk skenario baik, bukan rata-rata.",
      ],
      formula: String.raw`Q^* = F^{-1}\left(\frac{C_u}{C_u + C_o}\right)`,
      formulaNote: "Q* = stok optimal newsvendor: F^{-1} = invers CDF demand (kuantil); C_u = biaya kekurangan per unit (margin yang hilang); C_o = biaya kelebihan per unit (obral/diskon). Rasio C_u/(C_u+C_o) = 'service level' optimal. Jika kekurangan lebih mahal, kuantil > 0,5: stok di atas median.",
      tasks: [],
      reference: "Stok optimal = kuantil, bukan mean. Sesuaikan dengan Cu vs Co.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis cepat",
      title: "Cek intuisimu",
      prose: [
        "Tiga soal cepat.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Sirup: rata-rata 133, Lebaran 500. Apa yang salah dengan forecast rata-rata?",
          options: [
            { text: "Mencampur musiman ke satu angka — stockout tiap puncak", why: "Rata-rata meremehkan puncak dan melebihkan lembah.", correct: true },
            { text: "Rata-ratanya salah hitung", why: "Hitungannya benar; metodenya yang salah untuk data musiman." },
            { text: "Tidak ada — 133 sudah cukup", why: "Stockout tiap tahun bilang sebaliknya." },
          ],
        },
        {
          q: "SKU terjual 2 unit, forecast 4. MAPE = 100%. Masalah?",
          options: [
            { text: "MAPE meledak oleh aktual kecil — pakai WAPE", why: "Error 2 unit tidak material tapi MAPE 100% terlihat bencana.", correct: true },
            { text: "Forecast buruk sekali", why: "Meleset 2 unit pada SKU kecil = bukan bencana." },
            { text: "Hentikan SKU itu", why: "Keputusan bisnis tidak diambil dari satu MAPE." },
          ],
        },
        {
          q: "Forecast = 200, target direksi = 250. Sikap analis?",
          options: [
            { text: "Sampaikan 200 + interval; target ≠ forecast", why: "Forecast = ekspektasi jujur. Target = ambisi. Mencampur keduanya merusak keduanya.", correct: true },
            { text: "Ubah forecast jadi 250", why: "Itu manipulasi (MK18) — dan menghancurkan kegunaan forecast." },
            { text: "Sembunyikan forecast", why: "Menyembunyikan informasi dari pengambil keputusan." },
          ],
        },
      ],
    },
    {
      id: "adv-rekonsiliasi",
      eyebrow: "Langkah 7 · Rekonsiliasi",
      title: "Bottom-up vs top-down: kapan masing-masing menang",
      prose: [
        "Tiga pendekatan rekonsiliasi hierarki. Bottom-up: ramal tiap SKU, jumlahkan ke atas. Menang saat pola tiap SKU berbeda jauh (sirup Lebaran vs teh harian) — agregat tidak bisa menangkapnya. Kalah saat SKU berisik (noise dijumlahkan, bukan dirata-ratakan).",
        "Top-down: ramal nasional, pecah by proporsi historis. Menang saat SKU-SKU mirip dan data SKU tipis — nasional stabil, proporsi sederhana. Kalah saat proporsi bergeser (SKU baru meledak, proporsi lama kadaluarsa).",
        "Praktik modern: middle-out + kombinasi optimal (forecast tiap level, lalu rekonsiliasi terbobot by akurasi historis tiap level). Aturan: level yang paling akurat historisnya diberi bobot terbesar — dan SELALU publikasikan satu angka konsisten per level. Dua angka berbeda untuk satu realitas = gudang menebak.",
      ],
      tasks: [],
      quiz: [
        {
          q: "50 SKU, masing-masing berpola musiman berbeda. Pendekatan?",
          options: [
            { text: "Bottom-up — agregat tidak bisa menangkap pola yang berbeda-beda", why: "Top-down by proporsi gagal saat pola tiap SKU unik.", correct: true },
            { text: "Top-down — lebih sederhana", why: "Sederhana tetapi salah: proporsi rata-rata menghancurkan pola unik." },
            { text: "Tidak perlu hierarki", why: "Gudang butuh angka SKU dan nasional yang konsisten." },
            { text: "Rata-rata keduanya", why: "Tanpa bobot akurasi = mencampur baik dan buruk." },
          ],
        },
        {
          q: "SKU baru 3 bulan, pola belum jelas, tetapi kategori stabil. Pendekatan?",
          options: [
            { text: "Top-down dari kategori — data SKU terlalu tipis untuk bottom-up", why: "Stabilitas kategori + proporsi = estimasi terbaik saat data minim.", correct: true },
            { text: "Bottom-up — detail selalu menang", why: "Detail dari 3 bulan data = noise, bukan pola." },
            { text: "Jangan diramal", why: "Gudang tetap butuh angka; top-down memberi yang terbaik." },
            { text: "Samakan dengan SKU lain", why: "Itu top-down tanpa proporsi — lebih kasar." },
          ],
        },
      ],
      reference: "Pola beda → bottom-up. Data tipis → top-down. Selalu satu angka konsisten.",
    },
    {
      id: "lab-metrik",
      eyebrow: "Langkah 8 · Lab metrik",
      title: "Lab: WAPE vs MAPE vs bias dalam satu hitungan",
      prose: [
        "Data lima periode dengan satu Lebaran (periode 4: aktual 500, forecast 200 — meleset besar). Hitung ketiga metrik dan rasakan: WAPE 33,5% didominasi periode Lebaran; MAPE 17,8% terlihat 'lebih baik' tetapi menutupi bencana; bias −59 = under-forecast sistematis.",
        "Coba: ubah forecast periode 4 menjadi 480. Bagaimana ketiga metrik berubah? (WAPE anjlok, MAPE turun sedikit, bias membaik — metrik mana yang paling jujur tentang perbaikan ini?)",
      ],
      tasks: [
        { id: "t1", text: "Hitung `wape` = sum|e| / sum|aktual|" },
        { id: "t2", text: "Hitung `mape` = rata-rata |e|/aktual dan `bias` = rata-rata (forecast−aktual), cetak" },
      ],
      expected: "wape=0.335 mape=0.178 bias=-59",
      hints: [
        "wape = sum(abs(f-a) for f,a in zip(forecast,aktual)) / sum(aktual).",
        "mape = sum(abs(f-a)/a for f,a in zip(forecast,aktual)) / len(aktual).",
        "bias = sum(f-a for f,a in zip(forecast,aktual)) / len(aktual) = −59.",
      ],
      code: {
        starter: `aktual = [100, 150, 120, 500, 130]
forecast = [110, 140, 130, 200, 125]

# TULIS KODEMU: WAPE, MAPE, bias
wape =
mape =
bias =

print(f"wape={wape:.3f} mape={mape:.3f} bias={bias:.0f}")`,
        lockLines: 2,
        solution: `aktual = [100, 150, 120, 500, 130]
forecast = [110, 140, 130, 200, 125]

# TULIS KODEMU: WAPE, MAPE, bias
wape = sum(abs(f - a) for f, a in zip(forecast, aktual)) / sum(aktual)
mape = sum(abs(f - a) / a for f, a in zip(forecast, aktual)) / len(aktual)
bias = sum(f - a for f, a in zip(forecast, aktual)) / len(aktual)

print(f"wape={wape:.3f} mape={mape:.3f} bias={bias:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "wape", value: 0.335, tol: 0.001, label: "`wape` seharusnya 0,335", msg: "335/1000. Didominasi meleset Lebaran — jujur tentang volume." },
          { kind: "equal", task: "t2", name: "mape", value: 0.178, tol: 0.002, label: "`mape` sekitar 0,178", msg: "Terlihat 'lebih baik' tetapi menutupi bencana periode 4." },
          { kind: "equal", task: "t2", name: "bias", value: -59, tol: 1e-9, label: "`bias` seharusnya −59", msg: "Negatif = under-forecast sistematis. Stokout menunggu." },
          { kind: "stdout_matches", task: "t2", pattern: "bias=-59", label: "`print` menampilkan bias", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "WAPE untuk volume, bias untuk sistematis, MAPE hati-hati.",
    },
    {
      id: "adv-interval",
      eyebrow: "Langkah 9 · Interval",
      title: "Forecast tanpa interval = janji tanpa tanggal",
      prose: [
        "Satu angka forecast (200) tidak bisa dipakai untuk keputusan stok — yang dibutuhkan adalah distribusi: P(demand ≤ 227) = 90%? Interval prediksi 80%: [150, 260]? Newsvendor Q* justru MEMBUTUHKAN distribusi, bukan titik.",
        "Cara praktis: interval dari error historis. Jika error forecast 12 bulan terakhir std dev-nya 40, interval 80% ≈ forecast ± 1,28×40. Sederhana, jujur, dan cukup untuk newsvendor.",
        "Ukur juga coverage: dari 20 forecast terakhir, berapa yang aktualnya masuk interval 80%? Jika hanya 10 (50%), intervalmu terlalu sempit — model terlalu percaya diri. Coverage < nominal = perbaiki, bukan pamer presisi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Interval 80% tetapi coverage aktual 50%. Artinya?",
          options: [
            { text: "Model terlalu percaya diri — interval terlalu sempit, harus dilebarkan", why: "Coverage < nominal = ketidakpastian diremehkan.", correct: true },
            { text: "Bagus — presisi tinggi", why: "Presisi semu; setengah realitas keluar dari interval." },
            { text: "Naikkan ke interval 95%", why: "Mengganti label tanpa memperbaiki lebar = kosmetik." },
            { text: "Tidak masalah", why: "Newsvendor dengan interval salah = stok salah." },
          ],
        },
      ],
      reference: "Sampaikan interval + ukur coverage-nya.",
    },
    {
      id: "intuisi-janji-masa-depan",
      eyebrow: "Langkah 10 · Intuisi",
      title: "Peramal yang baik dibayar untuk kejujuran, bukan ketepatan",
      prose: [
        "Tidak ada forecast yang tepat — hanya ada yang jujur tentang ketidakpastiannya dan yang tidak. Tiga heuristik menuju kejujuran.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: forecast adalah janji tentang masa depan — tulis intervalnya, bukan hanya angkanya",
        body: "Heuristik pertama: pisahkan yang bisa diketahui dari yang tidak. Tren, musiman, dan event (Lebaran, 11.11, promo terjadwal) = bisa diketahui — modelkan eksplisit. Sisanya = noise — jangan pura-pura bisa diramal; ukur lebarnya dan sampaikan sebagai interval. Forecast yang 'tepat' karena menebak noise = kebetulan, bukan skill. Heuristik kedua: metrik mengikuti keputusan. Stok butuh WAPE + bias (volume dan arah salah). Assortment butuh akurasi per SKU. Target sales butuh unbiasedness. Satu metrik untuk semua keputusan = tidak ada keputusan yang terlayani. Pilih metrik dari keputusan yang akan diambil — bukan dari yang paling mudah dihitung. Heuristik ketiga: forecast ≠ target, dan mencampurnya merusak keduanya. Forecast 200 + target 250 = informasi ('butuh usaha ekstra 50'). Forecast yang 'disesuaikan' menjadi 250 = kebohongan yang menghancurkan perencanaan stok, dan target yang diturunkan menjadi 200 = ambisi yang mati. Jaga keduanya tetap terpisah — analis yang membiarkan target menggeser forecast telah berhenti menjadi analis.",
      },
      reference: "Modelkan yang bisa diketahui; metrik mengikuti keputusan; forecast ≠ target.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 11 · Peta keputusan",
      title: "Peta keputusan: forecast yang jujur tentang ketidakpastiannya",
      prose: [
        "Skenario satu — memilih model: dekomposisi dulu (tren + musiman + event). Holt-Winters untuk baseline; event besar seperti Lebaran dimodel terpisah — jangan paksa satu model menelan semuanya.",
        "Skenario dua — kalender Hijriah: pakai dummy H−30 s.d. H+7, bukan bulan Masehi. Event keagamaan tidak peduli Januari–Desember — model yang memakai kalender yang salah menghasilkan bias sistematis tiap tahun.",
        "Skenario tiga — keputusan stok (Skenario B): pakai newsvendor, bukan rata-rata. Cu Rp8rb vs Co Rp3rb → service level 72,7% → Q* = 460, bukan rata-rata 133. Rata-rata adalah jawaban untuk pertanyaan yang tidak ditanyakan.",
        "Skenario empat — hierarki: rekonsiliasi forecast (nasional = jumlah regional). Forecast yang tidak menjumlah adalah dua kebenaran yang saling bertentangan.",
        "Skenario lima — komunikasi forecast: sampaikan interval, bukan titik. Angka 460 dengan rentang P10–P90 380–560 memungkinkan keputusan stok; angka 460 saja membuat orang lupa ketidakpastian.",
        "Aturan praktis 10 detik: dekomposisi ditulis? Event dimodel terpisah? Keputusan stok dari newsvendor? Hierarki terekonsiliasi? Interval dilaporkan?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memesan sebesar rata-rata historis. Rata-rata 133 unit untuk demand Lebaran yang bervariasi 50–5.000 adalah stockout yang direncanakan. Keputusan stok memakai kuantil sesuai biaya over dan under, bukan rata-rata.",
      },
      reference: "Dekomposisi → event terpisah → newsvendor untuk stok → interval, bukan titik.",
    },
    {
      id: "minicase-segarmart2",
      eyebrow: "Langkah 12 · Mini-case",
      title: "SegarMart, bagian 2: Lebaran yang tidak lagi stockout",
      prose: [
        "SegarMart merombak forecast sirup. (1) Dekomposisi: tren + musiman + dummy Hijriah H−30 s.d. H+7 (bukan bulan Masehi). (2) Holt-Winters untuk baseline + event model terpisah. (3) Newsvendor untuk stok Lebaran (Skenario B): Cu = Rp8rb (margin hilang), Co = Rp3rb (obral) → service level 8/11 = 72,7% → Q* = kuantil 72,7% distribusi demand Lebaran = 460 unit (bukan rata-rata 133, bukan puncak 500).",
        "Hasil Lebaran: demand 445 — stok 460 cukup, sisa 15 unit diobral. WAPE tahunan 12% → 7%; bias +8% → +1%. Stockout nol untuk pertama kalinya dalam 5 tahun.",
        "Pertanyaan: (1) Mengapa Q* = 460, bukan 500 (puncak) atau 133 (rata-rata)? (2) Apa peran dummy Hijriah? (3) Metrik apa yang membuktikan perbaikan?",
        "Pembahasan: (1) 460 = kuantil 72,7%: optimal secara ekonomi — 500 = over-stock (Co), 133 = stockout pasti. (2) Lebaran bergeser tiap tahun; dummy Masehi salah menempatkan lonjakan setiap tahun. (3) WAPE 12%→7%, bias +8%→+1%, stockout 5 tahun → 0. Tiga metrik, tiga perbaikan nyata.",
      ],
      tasks: [],
      quiz: [
        {
          q: "SegarMart: Q* = 460 (kuantil 72,7%), bukan 500 (puncak historis). Kenapa benar?",
          options: [
            { text: "Optimal ekonomi: menimbang Cu vs Co — 500 over-stock, 133 stockout pasti", why: "Newsvendor: stok = kuantil, bukan puncak dan bukan rata-rata.", correct: true },
            { text: "460 lebih aman dari 500", why: "'Aman' bukan argumen; 72,7% service level yang argumen." },
            { text: "500 terlalu bulat", why: "Bukan soal angka cantik." },
            { text: "Seharusnya 133", why: "133 = rata-rata buta yang menyebabkan stockout 5 tahun." },
          ],
        },
        {
          q: "Bukti perbaikan forecast yang sah?",
          options: [
            { text: "WAPE 12%→7%, bias +8%→+1%, stockout → 0 — tiga metrik konsisten", why: "Perbaikan multi-metrik + outcome bisnis = bukti, bukan klaim.", correct: true },
            { text: "Modelnya Holt-Winters", why: "Nama model bukan bukti." },
            { text: "Sudah pakai dummy Hijriah", why: "Fitur benar ≠ hasil terbukti; metrik yang membuktikan." },
            { text: "Tim merasa lebih yakin", why: "Perasaan bukan metrik." },
          ],
        },
      ],
      reference: "Stok = kuantil ekonomi; dummy mengikuti kalender yang benar.",
    },
    {
          id: "gap-r9-croston-intermittent",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P9-G1)",
          title: "Croston: forecast untuk demand yang sering nol",
          prose: [
            "Langkah 4 menyebut MAPE menipu untuk slow-mover — tetapi belum memberi METODE untuk demand intermittent (banyak bulan nol, sesekali ada penjualan). SES gagal di sini: ia meramalkan pecahan unit tiap periode dan tidak pernah nol. Metode Croston (1972) memisahkan dua pertanyaan: BERAPA besar saat ada demand, dan SEBERAPA SERING demand muncul. Ukuran rata-rata dibagi interval rata-rata = forecast per periode.",
            "Contoh angka (10 periode, suku cadang slow-moving): demand [0, 0, 5, 0, 0, 0, 3, 0, 0, 2]. Ukuran nonzero: [5, 3, 2] → rata-rata 10/3 ≈ 3,33. Interval antar-demand: 3 periode sampai demand pertama, lalu 4, lalu 3 → rata-rata 10/3 ≈ 3,33. Forecast Croston = 3,33 / 3,33 = 1,00 unit per periode — stok pengaman dihitung dari distribusi ukuran DAN interval, bukan dari rata-rata mentah (yang 1,0 juga di sini, tetapi dengan varians yang salah).",
            "Kapan TIDAK memakai Croston: demand yang mulus (pakai SES/Holt-Winters biasa) dan demand yang sangat jarang (interval > 10 periode — pertimbangkan model Poisson atau kebijakan (s, S) langsung). Dan ingat: forecast 1,00 bukan berarti 'pesan 1 tiap periode' — ia input untuk perhitungan stok pengaman, bukan pesanan.",
          ],
          formula: String.raw`\hat{y} = \frac{\bar{z}}{\bar{p}}`,
          formulaNote: "Croston: forecast = ukuran rata-rata demand nonzero (z̄) dibagi interval rata-rata antar-demand (p̄). Contoh angka: ukuran [5, 3, 2] → 3,33; interval [3, 4, 3] → 3,33; forecast 1,00 unit/periode.",
          tasks: [
            { id: "t1", text: "Hitung `size` (rata-rata nonzero) dan `interval` (rata-rata antar-demand)" },
            { id: "t2", text: "Hitung `forecast` (Croston) dan cetak ketiganya" },
          ],
          expected: "size=3.33 interval=3.33 forecast=1.00",
          hints: [
            "size = jumlah nonzero / banyaknya nonzero.",
            "interval: posisi demand pertama + 1, lalu selisih posisi berurutan.",
          ],
          code: {
            starter: `data = [0, 0, 5, 0, 0, 0, 3, 0, 0, 2]\n\n# TULIS KODEMU: Croston — ukuran & interval antar-demand\nsize = \ninterval = \nforecast = \n\nprint(f"size={size:.2f} interval={interval:.2f} forecast={forecast:.2f}")`,
            lockLines: 3,
            solution: `data = [0, 0, 5, 0, 0, 0, 3, 0, 0, 2]\n\n# TULIS KODEMU: Croston — ukuran & interval antar-demand\nnz = [d for d in data if d > 0]\npos = [i for i, d in enumerate(data) if d > 0]\nintervals = [pos[0] + 1] + [pos[i + 1] - pos[i] for i in range(len(pos) - 1)]\nsize = sum(nz) / len(nz)\ninterval = sum(intervals) / len(intervals)\nforecast = size / interval\n\nprint(f"size={size:.2f} interval={interval:.2f} forecast={forecast:.2f}")`,
            checks: [
              { kind: "equal", task: "t1", name: "size", value: 3.33, tol: 0.01, label: "`size` seharusnya 3,33", msg: "(5+3+2)/3 = 3,33." },
              { kind: "equal", task: "t1", name: "interval", value: 3.33, tol: 0.01, label: "`interval` seharusnya 3,33", msg: "(3+4+3)/3 = 3,33." },
              { kind: "equal", task: "t2", name: "forecast", value: 1.0, tol: 0.01, label: "`forecast` seharusnya 1,00", msg: "3,33/3,33 = 1,00." },
              { kind: "stdout_matches", task: "t2", pattern: "size=3.33\\s+interval=3.33\\s+forecast=1.00", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Demand suku cadang: 9 bulan nol, 1 bulan 10 unit. Apa yang salah bila memakai SES biasa?",
              options: [
                { text: "SES meramalkan pecahan tiap periode dan tidak pernah nol — stok pengaman salah dihitung", why: "Benar: demand intermittent butuh pemisahan ukuran vs frekuensi (Croston).", correct: true },
                { text: "Tidak ada yang salah — SES menangani nol dengan baik", why: "Salah: SES menghaluskan nol menjadi pecahan kecil yang tidak bermakna operasional." },
                { text: "SES akan meramalkan 10 tiap bulan", why: "Salah: SES menghaluskan ke rata-rata kecil, bukan ke puncak." },
              ],
            },
          ],
          reference: "Croston = ukuran rata-rata / interval rata-rata; untuk demand intermittent, bukan demand mulus.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Forecast yang baik = jujur tentang pola dan tentang errornya.",
      ],
      tasks: [],
      summary: [
        "Dekomposisi y = T+S+H+e; Lebaran pakai dummy Hijriah.",
        "SES: ŷ = αy + (1−α)ŷ; Holt-Winters untuk tren+musiman (t+7 = 141,1).",
        "WAPE + bias; MAPE menipu untuk slow-mover.",
        "Rekonsiliasi hierarki; newsvendor Q* = kuantil Cu/(Cu+Co) — Skenario A (90%) = 227, Skenario B (72,7%) = 460.",
        "Forecast ≠ target. Sampaikan interval, bukan satu angka.",
        "Rekonsiliasi: pola beda -> bottom-up; data tipis -> top-down; satu angka konsisten.",
        "Evaluasi: WAPE + bias + coverage interval; MAPE berbahaya untuk slow-mover.",
      ],
      next: { label: "MK16 — Iklan Digital", href: "/v2/learn/mk16-digital-ads" },
      quiz: [
        {
          q: "α = 0,9 vs α = 0,1 dalam SES. Bedanya?",
          options: [
            { text: "0,9 responsif (ikuti data terakhir); 0,1 halus (percaya histori)", why: "α = bobot masa kini. Besar = reaktif, kecil = stabil.", correct: true },
            { text: "Tidak ada beda", why: "Beda besar: 0,9 hampir = naive forecast." },
            { text: "0,1 lebih responsif", why: "Terbalik." },
          ],
        },
        {
          q: "Bias forecast +15% konsisten 6 bulan. Artinya?",
          options: [
            { text: "Over-forecast sistematis — stok menumpuk; perbaiki model/proses", why: "Bias = error yang bisa diprediksi = harus dikoreksi.", correct: true },
            { text: "Normal — forecast memang begitu", why: "Bias sistematis bukan normal; ia sinyal model salah." },
            { text: "Naikkan lagi forecastnya", why: "Memperparah over-forecast." },
          ],
        },
        {
          q: "Cu (rugi kekurangan) jauh > Co (rugi kelebihan). Q* di mana?",
          options: [
            { text: "Di atas median — stok untuk skenario baik", why: "Kuantil Cu/(Cu+Co) > 0,5. Kekurangan lebih mahal → pesan lebih.", correct: true },
            { text: "Tepat di median", why: "Itu kalau Cu = Co." },
            { text: "Di bawah median", why: "Terbalik — itu kalau kelebihan lebih mahal." },
          ],
        },
        {
          q: "Forecast nasional 1.000, jumlah regional 1.200. Masalah?",
          options: [
            { text: "Tidak terrekon siliasi — gudang tidak tahu angka mana yang dipakai", why: "Hierarki harus konsisten. Rekonsiliasi wajib.", correct: true },
            { text: "Normal — beda level beda angka", why: "Tidak normal: satu realitas, satu angka per level yang konsisten." },
            { text: "Pakai yang lebih besar", why: "Memilih tanpa metode = tebak-tebakan." },
          ],
        },
        {
          q: "Holt-Winters manual 6 periode → t+7 = 141,1. Apa gunanya latihan manual ini?",
          options: [
            { text: "Paham mekanisme bobot eksponensial — tidak asal percaya software", why: "Analis yang paham mekanisme bisa diagnose saat hasil aneh.", correct: true },
            { text: "Tidak ada — software lebih cepat", why: "Kecepatan tanpa pemahaman = buta saat error." },
            { text: "Untuk pamer", why: "Bukan." },
          ],
        },
      ],
    },
  ],
};
