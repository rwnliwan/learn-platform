import type { V2Lesson } from "../lib/types";

// A/B: champion 12% vs challenger 13% — signifikan di n=12.000, tidak di n=1.200.
const FIG_AB = `<svg viewBox="0 0 480 250" role="img" aria-label="A/B test: signifikan di sampel besar, tidak di sampel kecil.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="205" x2="460" y2="205"/><line x1="44" y1="155" x2="460" y2="155"/><line x1="44" y1="105" x2="460" y2="105"/><line x1="44" y1="55" x2="460" y2="55"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="209">10%</text><text x="38" y="159">12%</text><text x="38" y="109">14%</text><text x="38" y="59">16%</text></g>
<g><rect x="100" y="155" width="70" height="50" fill="var(--c4)"/><rect x="180" y="143" width="70" height="62" fill="var(--c1)"/>
<text x="135" y="145" font-size="11" fill="var(--text)" text-anchor="middle" font-family="var(--font-ui)">12,0%</text><text x="215" y="133" font-size="11" fill="var(--text)" text-anchor="middle" font-family="var(--font-ui)">13,0%</text>
<text x="175" y="225" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-family="var(--font-ui)">n=12.000: p=0,019 ✓</text></g>
<g opacity="0.45"><rect x="300" y="155" width="70" height="50" fill="var(--c4)"/><rect x="380" y="143" width="70" height="62" fill="var(--c1)"/>
<text x="375" y="225" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-family="var(--font-ui)">n=1.200: p=0,46 ✗</text></g>
<text x="240" y="245" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">angka sama, kesimpulan beda — ukuran sampel menentukan</text>
</svg>`;

export const mle18: V2Lesson = {
  slug: "mle18-ml-systems-design",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE18 — ML Systems Design (A/B, Champion/Challenger)",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-launch",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model 89% yang menurunkan revenue 3%",
      prose: [
        "Model baru AUC 0,89 menggantikan model lama 0,86. Launch 100% langsung — tanpa uji. Seminggu kemudian revenue turun 3%. Investigasi: model baru lebih akurat tetapi 2x lebih lambat → 15% pengguna pergi sebelum hasil keluar. Akurasi naik, bisnis turun. Tidak ada yang salah dengan modelnya — yang salah adalah CARA me-launch-nya.",
        "Tim yang benar memakai champion/challenger: model lama (champion) tetap melayani 90% traffic, model baru (challenger) 10%. Dalam 3 hari terlihat: konversi challenger −2% (karena latensi!). Challenger ditolak SEBELUM merusak 100% traffic. 10% traffic tersakiti 3 hari vs 100% tersakiti seminggu — beda Rp2 miliar.",
        "Twist-nya: ML systems design bukan soal model terbaik, melainkan soal EKSPERIMEN teraman: A/B test, canary, skew train-serve, retraining cadence. Tema JD berfrekuensi tertinggi (0,62) yang belum tercakup — sampai lesson ini.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) merancang A/B test untuk model (metrik, sampel, durasi); (2) menghitung z-test proporsi dan membaca p-value; (3) menjelaskan champion/challenger dan canary; (4) mendeteksi train-serve skew; (5) menentukan retraining cadence.",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · A/B test untuk ML — Langkah 3 · Lab: z-test — Langkah 4 · Champion/challenger & skew — Langkah 5 · Peta keputusan — Langkah 6 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Model terbaik ≠ bisnis terbaik. Eksperimen aman > launch berani.",
    },
    {
      id: "konsep-ab",
      eyebrow: "Langkah 2 · A/B test untuk ML",
      title: "A/B test: dari 'kelihatannya naik' menjadi 'terbukti naik'",
      prose: [
        "Anatomi A/B test model: (1) HIPOTESIS — 'challenger menaikkan konversi ≥1%'; (2) METRIK UTAMA — konversi (bisnis!), bukan AUC (teknis); metrik penjaga — latensi, error rate; (3) RANDOMISASI — per user (bukan per request!) agar konsisten; (4) UKURAN SAMPEL — hitung SEBELUM mulai; (5) DURASI — minimal 1-2 siklus mingguan (efek hari kerja vs akhir pekan).",
        "Ukuran sampel — rumus kasarnya: n ≈ 16 × p(1−p) / δ² per grup, dengan p = baseline, δ = efek minimum yang peduli. Contoh: p=0,12, δ=0,01 → n ≈ 16×0,1056/0,0001 ≈ 16.900 per grup. Efek kecil butuh sampel BESAR — inilah mengapa 'coba 3 hari' sering tidak signifikan.",
        "Tiga dosa A/B: (1) PEEKING — intip tiap jam, berhenti saat 'signifikan' (false positive meledak 5% → 30%!); tentukan durasi di awal, patuhi. (2) METRIK SALAH — AUC naik tetapi revenue turun (kasus cerita!). (3) NOVELTY EFFECT — pengguna klik hal baru lalu bosan; butuh 2+ pekan untuk efek stabil.",
        "Kepribadian A/B test: seperti pengadilan — hipotesis = dakwaan, p-value = vonis, peeking = menyuap juri. Vonis sah hanya bila prosedur bersih.",
        "Sequential testing — peeking yang sah. Metode alpha-spending (O'Brien-Fleming): intip tiap hari dengan ambang p yang MENGETAT (0,001 di hari 1 → 0,05 di akhir). Peeking liar = dosa; sequential = ilmu. Jika harus intip: pakai metode ini, bukan insting.",
        "Interference — SUTVA dilanggar. Jika user A (grup kontrol) melihat hasil user B (treatment) — misal driver ojol — efek 'bocor'. Solusi: randomisasi per CLUSTER (kota, bukan user). A/B tanpa SUTVA = vonis palsu. Tanya selalu: 'bisakah grup saling memengaruhi?'",
        "Guardrail metrics — rem otomatis. Definisikan SEBELUM eksperimen: 'hentikan jika error rate >2% atau latensi p99 >5s'. Otomatisasi penghentian = tidak bergantung manusia memantau dashboard 24/7. Eksperimen tanpa guardrail = mobil tanpa rem.",
      ],
      formula: String.raw`z = \frac{\hat{p}_B - \hat{p}_A}{\sqrt{\hat{p}(1-\hat{p})\left(\frac{1}{n_A}+\frac{1}{n_B}\right)}} \qquad n \approx \frac{16\,p(1-p)}{\delta^2}`,
      formulaNote: "z = statistik uji beda proporsi; p̂_A/p̂_B = konversi tiap grup; p̂ = gabungan; n = ukuran sampel per grup; δ = efek minimum yang dipedulikan. Contoh lab: p̂_A=0,12, p̂_B=0,13, n=12.000 → z=2,34, p=0,019 < 0,05 → signifikan. n=1.200 → p=0,46 → belum.",
      figure: {
        svg: FIG_AB,
        alt: "A/B test signifikan di n besar, tidak di n kecil.",
        caption: "Ukuran sampel menentukan vonis.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'p < 0,05 berarti challenger pasti lebih baik.' Salah — p-value = peluang melihat beda sebesar ini JIKA sebenarnya sama. p=0,019 masih berarti 1,9% kemungkinan fluktuasi. Dan signifikansi statistik ≠ signifikansi BISNIS: +0,1% konversi yang signifikan dengan biaya +Rp1 M = keputusan buruk. Baca p-value DAN rupiah.",
      },
      reference: "Hipotesis, metrik bisnis, randomisasi per user, sampel dihitung, durasi dipatuhi.",
    },
    {
      id: "lab-ab",
      eyebrow: "Langkah 3 · Lab z-test",
      title: "Lab: vonis champion vs challenger",
      prose: [
        "Champion: 12.000 tampil, 1.440 konversi (12%). Challenger: 12.000 tampil, 1.560 (13%). Implementasikan z-test dua proporsi: hitung z, p-value (dari distribusi normal), lift relatif. Keputusan: promosikan jika p<0,05 DAN lift>0.",
        "Lalu uji varian underpowered: 1.200 tampil masing-masing (angka proporsi SAMA). Lihat p-value melonjak ke 0,46 — tidak signifikan! Angka sama, vonis beda. Coba ubah: naikkan ke 50.000 — p semakin kecil (bahkan efek kecil jadi 'signifikan' — ingat dosa #2!).",
        "Cara membaca: z=2,34 → p=0,019 → tolak H0. Interpretasi: bukti cukup bahwa challenger lebih baik — DENGAN n ini. Sampel kecil = 'belum terbukti', bukan 'terbukti sama'.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `ab_test`: z, p-value, lift" },
        { id: "t2", text: "Uji n=12.000 dan n=1.200, tentukan keputusan, `print` hasilnya" },
      ],
      expected: "z=2.342 p=0.0192 lift=0.0833 -> promosikan | underpowered p=0.4589 -> tambah sampel",
      note: {
        title: "💡 Intuisi",
        body: "'Belum signifikan' ≠ 'tidak ada beda'. Dengan n=1.200, uji ini tidak PUNYA KUASA mendeteksi +1% — seperti menimbang debu dengan timbangan beras. Kesimpulan benar: 'tambah sampel', bukan 'sama saja'.",
      },
      hints: [
        "p_pool = (conv_a+conv_b)/(n_a+n_b); se = sqrt(p_pool*(1-p_pool)*(1/n_a+1/n_b))",
        "z = (p_b-p_a)/se; p = 2*(1-Phi(|z|)); Phi via math.erf",
        "lift = (p_b-p_a)/p_a",
      ],
      code: {
        starter: `# SEED — jangan ubah
import math

# TULIS KODEMU
def ab_test(n_a, conv_a, n_b, conv_b):
    # TODO t1: p_a, p_b, p_pool, se, z, p_value (via erf), lift
    # kembalikan (z, p_value, lift) dibulatkan
    return 0, 1, 0

# UJI (jangan ubah)
z, p, lift = ab_test(12000, 1440, 12000, 1560)
print("z =", z, "p =", p, "lift =", lift)
print("keputusan =", "promosikan challenger" if p < 0.05 and lift > 0 else "pertahankan champion")
z2, p2, lift2 = ab_test(1200, 144, 1200, 156)
print("underpowered: z =", z2, "p =", p2, "->", "signifikan" if p2 < 0.05 else "belum signifikan, tambah sampel")`,
        lockLines: 2,
        solution: `# SEED — jangan ubah
import math

# TULIS KODEMU
def ab_test(n_a, conv_a, n_b, conv_b):
    p_a, p_b = conv_a / n_a, conv_b / n_b
    p_pool = (conv_a + conv_b) / (n_a + n_b)
    se = math.sqrt(p_pool * (1 - p_pool) * (1/n_a + 1/n_b))
    z = (p_b - p_a) / se
    p_value = 2 * (1 - 0.5 * (1 + math.erf(abs(z) / math.sqrt(2))))
    lift = (p_b - p_a) / p_a
    return round(z, 3), round(p_value, 4), round(lift, 4)

# UJI (jangan ubah)
z, p, lift = ab_test(12000, 1440, 12000, 1560)
print("z =", z, "p =", p, "lift =", lift)
print("keputusan =", "promosikan challenger" if p < 0.05 and lift > 0 else "pertahankan champion")
z2, p2, lift2 = ab_test(1200, 144, 1200, 156)
print("underpowered: z =", z2, "p =", p2, "->", "signifikan" if p2 < 0.05 else "belum signifikan, tambah sampel")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "z\\s*=\\s*2\\.342\\s+p\\s*=\\s*0\\.0192", label: "z=2.342, p=0.0192 (signifikan)", msg: "12% vs 13% di n=12.000." },
          { kind: "stdout_matches", task: "t2", pattern: "keputusan\\s*=\\s*promosikan challenger", label: "Keputusan = promosikan", msg: "p<0,05 dan lift>0." },
          { kind: "stdout_matches", task: "t2", pattern: "underpowered.*p\\s*=\\s*0\\.4589.*tambah sampel", label: "Underpowered: tambah sampel", msg: "Angka sama, kuasa beda." },
        ],
      },
      reference: "'Belum signifikan' = tambah sampel, bukan 'sama saja'.",
    },
    {
      id: "konsep-champion",
      eyebrow: "Langkah 4 · Champion/challenger & skew",
      title: "Champion vs challenger, canary, dan skew",
      prose: [
        "Champion/challenger = A/B test permanen untuk model. Champion melayani 90%, challenger 10% — terus-menerus. Challenger baru datang → gantikan yang lama di 10%. Kelebihan vs A/B sesaat: mendeteksi degradasi LAMBAT (drift) dan membandingkan banyak kandidat sepanjang waktu. Ini 'liga' model, bukan 'pertandingan' sekali.",
        "Canary = versi ekstrem: 1-5% traffic untuk model SANGAT baru/berisiko. 15 menit canary menangkap bug fatal sebelum 100% traffic merasakannya. Urutan launch aman: shadow (0% — hanya catat, tidak layani) → canary 5% → 50% → 100%. Tiap tahap ada kriteria lolos otomatis.",
        "Train-serve skew = model dilatih di dunia A, melayani di dunia B. Tiga sumber: (1) fitur dihitung BEDA (training pakai batch, serving pakai realtime — 'umur akun' beda definisi!); (2) data training basi (6 bulan lalu); (3) feedback loop (model memengaruhi data yang melatihnya). Deteksi: bandingkan distribusi fitur train vs serve (PSI!); bandingkan metrik offline vs online.",
        "Retraining cadence: harian (fraud — pola berubah cepat), mingguan (rekomendasi), bulanan/kuartalan (skor kredit — stabil + regulasi). Aturan: retrain saat metrik online turun >ambang ATAU drift terdeteksi — bukan 'tiap Senin' buta. Cadence = respons terhadap dunia, bukan kalender.",
        "Multi-armed bandit — A/B yang adaptif. Thompson sampling: alokasikan traffic proporsional dengan peluang 'terbaik' — pemenang dapat 90%, pecundang 10% (bukan 50/50 tetap!). Cocok untuk optimasi kontinu (rekomendasi). Beda dari A/B: tidak ada 'akhir' — selalu belajar. Untuk launch model besar: A/B; untuk tuning kontinu: bandit.",
        "Feature flag + model flag — pisahkan. Flag fitur (UI) vs flag model (versi) = bisa uji kombinasi (UI baru + model lama?). Tanpa pemisahan: tidak tahu mana yang menyebabkan perubahan. 2 flag = 4 kombinasi = atribusi bersih.",
        "Rollback otomatis — bukan manual. Kriteria tertulis SEBELUM launch: 'rollback jika konversi −2% selama 1 jam ATAU error >1%'. Otomatisasi via pipeline (bukan 'nanti dilihat'). Insiden 2 pagi tanpa auto-rollback = 6 jam kerusakan vs 5 menit. Tulis kriteria, otomatiskan, tidur nyenyak.",
        "Shadow + champion/challenger — kombinasi. Challenger baru: shadow 3 hari (0 risiko) → 10% challenger (ukur) → 50% → champion baru. Tiap tahap = filter. Total waktu 2 pekan untuk keyakinan 99%. Terburu-buru = mahal; sistematis = murah dalam jangka panjang.",
      ],
      formula: String.raw`\text{skew} = \text{PSI}(\text{fitur}_{\text{train}}, \text{fitur}_{\text{serve}}) > 0{,}25 \Rightarrow \text{investigasi}`,
      formulaNote: "PSI = Population Stability Index, yaitu ukuran seberapa jauh distribusi fitur bergeser (0 = identik); >0,25 = berubah signifikan. Contoh: fitur 'umur_akun' PSI=0,31 → definisi beda antara batch dan realtime → perbaiki pipeline, bukan model.",
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Shadow deployment adalah 'A/B test tanpa risiko': model baru menerima traffic NYATA tetapi jawabannya tidak dipakai — hanya dicatat dan dibandingkan. Bug fatal tertangkap dengan 0% pengguna tersakiti. Murah (compute 2x) untuk ketenangan yang tak ternilai.",
      },
      reference: "Shadow → canary → 50% → 100%. Skew = selidiki pipeline, bukan model.",
    },
    {
      id: "capacity-planning-slo",
      eyebrow: "Langkah 5 · Capacity & SLO",
      title: "Matematika serving: Little's Law, p99, dan biaya per inferensi",
      prose: [
        "Hari launch: traffic 10× estimasi, p99 latensi 8 detik, GPU 100%, autoscaler butuh 5 menit untuk scale-up — sementara pengguna pergi dalam 30 detik. Akar masalahnya bukan modelnya, melainkan kapasitas yang direncanakan dari RATA-RATA. Sistem ML yang serius direncanakan dari matematika antrean, bukan dari harapan. Tiga persamaan di bawah ini menyelamatkan lebih banyak launch daripada semua tuning hyperparameter.",
        "Hukum Little: L = λW. Jumlah request konkuren di sistem = laju kedatangan × latensi rata-rata. Contoh: λ = 50 req/detik, W = 0,2 detik → L = 10 request konkuren. Artinya kamu butuh kapasitas untuk 10 yang bersamaan — bukan 50. Sederhana, tetapi 90% tim tidak menghitungnya dan menebak jumlah replika dari firasat.",
        "Mengapa p50 berbohong. SLO di rata-rata = 'separuh pengguna menderita tidak apa-apa'. Yang dirasakan pengguna dan yang membunuh timeout downstream adalah TAIL: p99, p99.9. Lebih jahat lagi: tail tidak dijumlahkan, ia BERLIPAT — tiga layanan berantai masing-masing p99 = 200ms bisa memberi end-to-end p99 di atas 600ms (probabilitas gabungan). Aturan: SLO selalu di tail; p50 hanya untuk dashboard.",
        "Rumus kapasitas: replika = ceil(λ_puncak × W_p99 / utilisasi_target). Utilisasi target 0,6–0,7 — BUKAN 0,95. Mengapa? Kurva antrean berbentuk tongkat hoki: saat utilisasi menuju 100%, waktu tunggu antrean menuju tak hingga. GPU di 95% = setiap spike kecil menjadi antrean panjang. Contoh: λ=100, W_p99=0,5 detik, target 0,7 → ceil(71,4) = 72 replika. Headroom 30% = harga ketenangan.",
        "Batch vs online — framework keputusan senior. Tanya SATU pertanyaan: 'apakah keputusan butuh fitur dari REQUEST SAAT INI, atau cukup data kemarin?' Fraud real-time = online (ms). Skor churn harian = batch (10–100× lebih murah: GPU dipakai penuh, tanpa server idle). Zona abu-abu: nearline (micro-batch per menit). Kebanyakan tim over-engineering ke online padahal batch cukup — audit ini menghemat 80% tagihan serving.",
        "Autoscaling ML tidak sama dengan autoscaling web. Reaktif (berdasar CPU/GPU) butuh 3–5 menit — spike flash-sale selesai sebelum replika siap. Terjadwal: untuk pola yang diketahui (gajian, jam makan siang). Prediktif: model atas traffic historis. Dan jebakan GPU: cold start (load model 30 detik+) — autoscaler yang mematikan semua saat sepi akan 'berhasil' menghemat lalu gagal total saat spike. Solusi: warm pool minimum.",
        "Bahasa budget: biaya per 1.000 inferensi = (harga GPU/jam × replika) / (throughput × 3600) × 1000. Semua diskusi kapasitas diterjemahkan ke satuan ini — 'tambah 20 replika' menjadi 'tambah Rp X per 1.000 inferensi'. Manajemen tidak berpikir dalam replika; mereka berpikir dalam rupiah per transaksi. Yang bisa menerjemahkan, menang anggarannya.",
        "Contoh ujung-ke-ujung: model fraud λ=200 req/detik, W_p99=0,15 detik (GPU), target 0,7 → replika = ceil(200×0,15/0,7) = 43. Tiap replika 1 GPU @ Rp15 ribu/jam → Rp645 ribu/jam ≈ Rp464 juta/bulan. Alternatif batch: 17 juta request/hari dalam 2 jam batch di 8 GPU = Rp240 ribu/hari ≈ Rp7,2 juta/bulan — 64× lebih murah. Inilah mengapa pertanyaan 'butuh real-time?' bernilai ratusan juta.",
        "SLO dan error budget: availability 99,9% = 43 menit downtime/bulan — itu ANGGARAN, bukan target. Latensi: p99 di bawah 300ms. Freshness: data fitur di bawah 1 jam. Rollback trigger diikat ke BURN RATE error budget, bukan firasat: 'bila 10% budget habis dalam 1 jam → rollback otomatis'. Tanpa trigger kuantitatif, rollback selalu 'nanti dulu' sampai insiden.",
        "Monitoring yang benar: RED (Rate, Errors, Duration) per versi model + USE (Utilization, Saturation, Errors) per pool GPU. Alert di burn rate, bukan angka absolut: 'p99 di atas 300ms selama 5 menit' lebih baik dari 'p99 di atas 300ms' (yang berisik saat spike 10 detik). Dashboard tanpa burn-rate alert = museum angka.",
        "GPU sharing — utilisasi GPU serving model tunggal sering hanya 30% (banyak idle antar request). Solusi: multi-model serving (Triton multi-model, vLLM multi-LoRA) — gabungkan 4–5 model kecil dalam 1 GPU, utilisasi naik ke 70%. Trade-off: noisy neighbor (model A yang spike memperlambat model B) dan blast radius (1 GPU mati = 5 model mati). Untuk model kritis (fraud), isolasi tetap menang; untuk sisanya, sharing = setengah tagihan GPU.",
        "Prediction cache — GPU gratis yang sering dilupakan. Banyak request BERULANG: cek fraud untuk user yang sama 10× sehari, skor kredit yang dihitung ulang tiap login. Cache (Redis) dengan TTL wajar: hit rate 40% = 40% beban GPU hilang. Syarat: invalidasi saat model ganti versi (cache key WAJIB memuat versi model — `pred:v3:user:4521`), dan jangan cache keputusan yang harus fresh (deteksi fraud real-time untuk transaksi baru).",
        "Load test sebelum launch — bukan setelah. Bangkitkan traffic sintetis 2× puncak estimasi, ukur p99 (bukan rata-rata!), dan temukan bottleneck-nya. Pengalaman: bottleneck JARANG di GPU — biasanya di preprocessing CPU (tokenisasi), I/O fitur (feature store lambat), atau serialisasi. Load test 1 hari menemukan ini; launch tanpa load test menemukannya via komplain pengguna.",
      ],
      formula: String.raw`L = \lambda W, \quad \text{replika} = \left\lceil\frac{\lambda \cdot W_{p99}}{\rho_{target}}\right\rceil`,
      formulaNote: "L = request konkuren dalam sistem; λ = laju kedatangan (req/detik); W = latensi rata-rata (detik); W_p99 = latensi tail; ρ_target = utilisasi target (0,6–0,7). Contoh: λ=50, W=0,2 → L=10 konkuren; replika = ceil(50×0,5/0,7) = 36 untuk W_p99=0,5 detik. Headroom 30% menyerap spike tanpa antrean meledak.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Rata-rata latensi 100ms, aman.' p50 = 100ms bisa berarti p99 = 2 detik — dan 1% dari 1 juta request = 10.000 pengguna yang menderita per hari. SLO selalu di tail (p99/p99.9); tail-lah yang memicu timeout berantai di downstream.",
      },
      reference: "Little's Law untuk kapasitas, SLO di tail bukan rata-rata, utilisasi target 0,7, batch bila freshness harian cukup, rollback terikat burn rate.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: strategi launch apa?",
      prose: [
        "Skenario 1 — model baru, risiko rendah → canary 5% 1 hari → 100%. Standar.",
        "Skenario 2 — model baru, risiko tinggi (pembayaran) → shadow 3 hari → canary 5% 3 hari → 50% → 100%. Lambat = aman.",
        "Skenario 3 — banyak kandidat → champion/challenger permanen. Liga, bukan pertandingan.",
        "Skenario 4 — metrik online anjlok tiba-tiba → cek skew DULU (PSI fitur), baru salahkan model.",
        "Skenario 5 — drift lambat → retrain terjadwal + challenger selalu siaga.",
        "Aturan praktis 10 detik: (1) tidak pernah 100% langsung. (2) metrik = bisnis + penjaga. (3) skew sebelum model. (4) rollback <5 menit selalu siap.",
        "Skenario 6 — tidak bisa A/B (regulasi/wilayah) → before-after dengan kontrol sintetik (synthetic control). Tidak sekuat A/B, tetapi lebih baik dari 'launch dan berdoa'.",
        "Skenario 7 — eksperimen berisiko reputasi → user research kualitatif DULU (20 wawancara), baru A/B. Angka tanpa 'mengapa' = buta. Campur metode: kualitatif untuk hipotesis, kuantitatif untuk vonis.",
      ],
      tasks: [],
    },
    {
      id: "minicase-revenue",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: -3% revenue yang dicegah",
      prose: [
        "Model baru: AUC 0,86→0,89 (+0,03!). Launch langsung 100%: revenue −3% = −Rp300 juta/bulan (latensi 2x → 15% pengguna pergi). Dengan canary 5%: dalam 1 hari terlihat konversi −2% di grup canary → rollback 5 menit. Kerugian: 5% × 1 hari × Rp10 juta = Rp500 ribu. Penghematan: Rp300 juta − Rp500 ribu ≈ Rp299,5 juta/bulan.",
        "Biaya canary: infra 2x serving selama 1 hari ≈ Rp2 juta + 1 hari engineer. Total <Rp5 juta untuk menghemat Rp300 juta. ROI: 60x. Dan ini BARU SATU insiden — pola ini berulang tiap kuartal.",
        "Pembahasan: AUC +0,03 terlihat 'wajib launch' — tetapi metrik offline tidak melihat latensi. Metrik penjaga (p99 latensi) menangkapnya. Pelajaran: definisikan metrik penjaga SEBELUM launch, bukan setelah insiden.",
        "Cara membaca: tiap tahap launch (shadow/canary/50%) = filter dengan harga. Total harga filter << harga 1 insiden. Asuransi termurah di ML.",
        "Interpretasi: systems design = memindahkan risiko dari 'sekali besar' menjadi 'sering kecil'. Kecil = terukur, terkendali, bisa rollback.",
        "Playbook insiden canary — 1 halaman. (1) Alert: konversi canary −2% → auto-rollback. (2) Investigasi: cek metrik penjaga (latensi? error?). (3) Postmortem: 5 whys dalam 48 jam. Insiden tanpa playbook = panik; dengan = prosedur.",
        "Komunikasi eksperimen — 1 dashboard. Status (berjalan/selesai), metrik utama + guardrail, keputusan (lanjut/hentikan). Stakeholder melihat SATU layar, bukan 10 notebook. Transparansi = kepercayaan = eksperimen berikutnya disetujui.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "A/B test: hipotesis + metrik bisnis + randomisasi per user + sampel dihitung + durasi dipatuhi.",
        "z-test proporsi; n ≈ 16p(1−p)/δ²; 'belum signifikan' = tambah sampel.",
        "Dosa: peeking, metrik salah (AUC vs revenue), novelty effect.",
        "Champion/challenger permanen; canary 5%; shadow 0% tanpa risiko.",
        "Skew: PSI train vs serve >0,25 → investigasi pipeline; retrain saat drift, bukan kalender.",
      ],
      next: { label: "MLE19 — Interpretability (SHAP)", href: "/v2/learn/mle19-interpretability-shap" },
      quiz: [
        {
          q: "Challenger AUC +0,03 tetapi revenue −3% setelah launch 100%. Kesalahan utama?",
          options: [
            { text: "Launch tanpa canary + metrik salah (AUC bukan revenue)", why: "Tepat: canary menangkap di 5%; metrik penjaga (latensi) menjelaskan.", correct: true },
            { text: "Model kurang akurat", why: "AUC NAIK — akurasi bukan masalahnya.", correct: false },
            { text: "Sampel terlalu besar", why: "Masalahnya bukan ukuran — melainkan tanpa eksperimen.", correct: false },
            { text: "Challenger terlalu cepat", why: "Terbalik: challenger 2x LEBIH LAMBAT.", correct: false },
          ],
        },
        {
          q: "Mengapa randomisasi harus PER USER bukan per request?",
          options: [
            { text: "Konsistensi pengalaman — user tidak boleh melihat dua versi bergantian", why: "Tepat: per request = user bingung + data tercemar.", correct: true },
            { text: "Lebih mudah dihitung", why: "Bukan soal kemudahan — soal validitas.", correct: false },
            { text: "Tidak ada bedanya", why: "Beda besar: inkonsistensi merusak UX dan metrik.", correct: false },
            { text: "Agar sampel lebih kecil", why: "Ukuran sampel tidak berubah oleh unit randomisasi.", correct: false },
          ],
        },
        {
          q: "Intip hasil tiap jam, berhenti saat p<0,05 di jam ke-6. Masalahnya?",
          options: [
            { text: "Peeking — false positive meledak 5%→30%", why: "Tepat: tentukan durasi di awal, patuhi.", correct: true },
            { text: "Tidak ada masalah — efisien", why: "Efisien menuju kesimpulan salah — peeking membuat 'signifikan' tidak berarti.", correct: false },
            { text: "Seharusnya tiap menit", why: "Memperparah peeking — semakin sering intip, semakin besar false positive.", correct: false },
            { text: "p-value tidak relevan", why: "Relevan — tetapi hanya bila prosedur bersih.", correct: false },
          ],
        },
        {
          q: "Metrik online anjlok padahal offline bagus. Langkah pertama?",
          options: [
            { text: "Cek train-serve skew (PSI fitur train vs serve)", why: "Tepat: 80% kasus = pipeline, bukan model.", correct: true },
            { text: "Retrain dengan data lebih banyak", why: "Mengobati gejala — skew tetap ada.", correct: false },
            { text: "Ganti algoritma", why: "Algoritma bukan penyebab skew — skew datang dari pipeline data yang berbeda.", correct: false },
            { text: "Naikkan threshold", why: "Menutupi masalah, bukan menyelesaikan — threshold menyembunyikan skew yang tetap ada.", correct: false },
          ],
        },
        {
          q: "Kapan shadow deployment paling tepat?",
          options: [
            { text: "Model sangat baru/berisiko — 0% pengguna tersakiti", why: "Tepat: catat dan bandingkan tanpa melayani.", correct: true },
            { text: "Model yang sudah pasti bagus", why: "Itu langsung canary — shadow untuk yang belum yakin.", correct: false },
            { text: "Tidak pernah — buang compute", why: "Compute 2x < 1 insiden 100% traffic.", correct: false },
            { text: "Hanya untuk A/B test", why: "Shadow BUKAN A/B — tidak ada pembanding pengguna.", correct: false },
          ],
        },
        {
          q: "λ = 100 req/detik, W_p99 = 0,4 detik, utilisasi target 0,7. Replika minimum?",
          options: [
            { text: "58 — ceil(100 × 0,4 / 0,7) = ceil(57,14)", why: "Tepat: 40/0,7 = 57,14 → 58; memakai p99 dan headroom, bukan rata-rata.", correct: true },
            { text: "40 — 100 × 0,4 saja", why: "Itu utilisasi 100% = antrean meledak saat spike; butuh dibagi 0,7.", correct: false },
            { text: "100 — satu replika per req/detik", why: "Bukan begitu cara kerja konkurensi — Little's Law yang menentukan.", correct: false },
            { text: "29 — memakai W rata-rata 0,2", why: "Rata-rata meremehkan tail; kapasitas direncanakan dari p99.", correct: false },
          ],
        },
        {
          q: "Kapan batch inference mengalahkan online serving?",
          options: [
            { text: "Ketika keputusan tidak butuh fitur request saat itu — freshness harian cukup; 10–100× lebih murah", why: "Tepat: GPU penuh, tanpa server idle; tanya 'butuh data kapan?' dulu.", correct: true },
            { text: "Selalu — batch selalu lebih baik", why: "Fraud real-time butuh ms — batch harian = fraud lolos.", correct: false },
            { text: "Ketika traffic sangat tinggi", why: "Traffic tinggi justru sering butuh online; kriterianya freshness, bukan volume.", correct: false },
            { text: "Tidak pernah — online lebih modern", why: "'Modern' tidak sama dengan tepat; batch adalah pilihan rasional untuk banyak kasus.", correct: false },
          ],
        },
      ],
    },
  ],
};
