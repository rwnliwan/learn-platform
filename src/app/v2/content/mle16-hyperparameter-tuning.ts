import type { V2Lesson } from "../lib/types";

// Grid (9 titik, terbaik −0,46) vs random (12 titik, terbaik −0,11): random menang.
const FIG_TUNING = `<svg viewBox="0 0 480 250" role="img" aria-label="Grid vs random search: random menemukan lebih baik.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="209" x2="460" y2="209"/><line x1="44" y1="179" x2="460" y2="179"/><line x1="44" y1="149" x2="460" y2="149"/><line x1="44" y1="119" x2="460" y2="119"/><line x1="44" y1="89" x2="460" y2="89"/><line x1="44" y1="59" x2="460" y2="59"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="209">−0,5</text><text x="38" y="179">−0,4</text><text x="38" y="149">−0,3</text><text x="38" y="119">−0,2</text><text x="38" y="89">−0,1</text><text x="38" y="59">0</text></g>
<g fill="var(--c4)" opacity="0.8"><circle cx="120" cy="197" r="4"/><circle cx="200" cy="199" r="4"/><circle cx="280" cy="201" r="4"/><circle cx="120" cy="203" r="4"/><circle cx="200" cy="205" r="4"/><circle cx="280" cy="204" r="4"/><circle cx="120" cy="209" r="4"/><circle cx="200" cy="208" r="4"/><circle cx="280" cy="207" r="4"/></g>
<g fill="var(--c1)"><circle cx="340" cy="140" r="4"/><circle cx="380" cy="110" r="4"/><circle cx="420" cy="160" r="4"/><circle cx="350" cy="175" r="4"/><circle cx="400" cy="92" r="5" stroke="var(--text)" stroke-width="2"/><circle cx="370" cy="185" r="4"/><circle cx="410" cy="120" r="4"/><circle cx="330" cy="150" r="4"/><circle cx="390" cy="130" r="4"/><circle cx="415" cy="195" r="4"/><circle cx="345" cy="205" r="4"/><circle cx="405" cy="170" r="4"/></g>
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle"><text x="200" y="227">grid 3×3 (terbaik −0,46)</text><text x="380" y="227">random 12 (terbaik −0,11)</text></g>
<text x="240" y="245" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">optimum di lr=0,03: grid melewatkannya, random menemukannya</text>
</svg>`;

export const mle16: V2Lesson = {
  slug: "mle16-hyperparameter-tuning",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE16 — Hyperparameter Tuning (Optuna)",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-kebetulan",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model 'terbaik' yang ternyata kebetulan",
      prose: [
        "Tim mengklaim modelnya 'terbaik' dengan akurasi 91% — dari SATU kombinasi hyperparameter yang dicoba pertama kali dan kebetulan bagus. Tiga bulan kemudian, data bergeser sedikit, akurasi jatuh ke 82%. Tidak ada catatan hyperparameter apa yang dipakai, tidak ada pencarian sistematis — 'terbaik' = kebetulan yang tidak bisa diulang.",
        "Tim lain memakai Optuna: 100 trial terdokumentasi, search space terdefinisi, best params tersimpan. Saat data bergeser, mereka menjalankan ulang pencarian dalam 1 hari dan kembali ke 90%. Bedanya bukan model — melainkan DISIPLIN pencarian. Tanpa tuning sistematis, 'model bagus' = lotre.",
        "Twist-nya: hyperparameter tuning bukan soal menemukan angka ajaib, melainkan soal MEMBUKTIKAN bahwa angkamu bukan kebetulan. Checklist evaluasi talent 2026 memasukkannya; JD memintanya eksplisit. Lesson ini = strategi pencarian + Optuna + jebakan overfitting ke validation.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membedakan parameter vs hyperparameter; (2) membandingkan grid, random, dan Bayesian search; (3) merancang search space yang masuk akal; (4) menjelaskan cara kerja Optuna (TPE + pruning); (5) menghindari overfitting ke validation set.",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · Tiga strategi pencarian — Langkah 3 · Lab: grid vs random — Langkah 4 · Optuna & jebakan — Langkah 5 · Multi-fidelity & budget — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Tuning = membuktikan angkamu bukan kebetulan. Dokumentasi = buktinya.",
    },
    {
      id: "konsep-strategi",
      eyebrow: "Langkah 2 · Tiga strategi",
      title: "Grid, random, Bayesian: dari bodoh ke pintar",
      prose: [
        "Grid search: coba SEMUA kombinasi (3 lr × 3 depth = 9). Kelebihan: sederhana, lengkap. Kelemahan: boros — 9 trial tetapi hanya 3 nilai lr yang BERBEDA (depth bervariasi sia-sia jika depth tidak penting!). Untuk d hyperparameter @ n nilai: n^d trial — eksplosi kombinatorial. Grid = keledai yang rajin.",
        "Random search: ambil acak dari distribusi. Kelebihan: 12 trial = 12 nilai lr BERBEDA (vs grid 9 trial = 3 nilai!). Jika hanya 2 dari 5 hyperparameter yang penting, random mengeksplorasi yang penting 12x vs grid 3x. Studi klasik (Bergstra 2012): random mengalahkan grid hampir selalu. Random = keledai yang beruntung.",
        "Bayesian optimization (Optuna): belajar dari trial sebelumnya — bangun model pengganti (surrogate) dari 'hyperparameter → skor', lalu pilih titik berikutnya yang menjanjikan (exploration vs exploitation). TPE (Tree-structured Parzen Estimator) = algoritma default Optuna: memodelkan distribusi 'bagus' vs 'jelek' secara terpisah. Pruning: hentikan trial yang jelas buruk di tengah jalan (hemat 50%+ compute).",
        "Angka lab: optimum lr=0,03. Grid {0,001; 0,01; 0,1} MELEWATKANNYA (terbaik 0,01 → skor −0,46). Random 12 titik menemukan 0,0176 → skor −0,11 (4x lebih baik!). Pelajaran: grid = presisi palsu; yang penting BUKAN kerapian grid, melainkan cakupan ruang.",
        "Kepribadian ketiganya: grid = petani mencangkul seluruh sawah (termasuk yang tandus); random = menyebar benih angin (menemukan tanah subur); Bayesian = petani yang mencatat panen tahun lalu. Semua bisa berhasil — tetapi biayanya beda 10x.",
        "Successive halving — turnamen bracket. 81 konfigurasi × 1 epoch → 27 terbaik × 3 epoch → 9 × 9 epoch → 3 × 27 → 1 juara. Total = 81×1 + 27×3 + 9×9 + 3×27 + 1×81 = 405 epoch-unit vs grid penuh 81×81 = 6.561 (16,2× hemat). Hyperband = beberapa bracket sekaligus. Untuk deep learning mahal: wajib.",
      ],
      formula: String.raw`x_{t+1} = \arg\max_x \text{EI}(x) \qquad \text{EI}(x) = \mathbb{E}[\max(0, f(x) - f^*)]`,
      formulaNote: "x_{t+1} = titik berikutnya yang dicoba; EI = Expected Improvement (seberapa besar ekspektasi perbaikan atas skor terbaik saat ini f*); f(x) = prediksi surrogate. Intuisi: pilih titik dengan 'harapan untung' terbesar — seimbang antara yang menjanjikan (exploit) dan yang belum dijelajahi (explore).",
      figure: {
        svg: FIG_TUNING,
        alt: "Grid vs random search: random menemukan titik lebih baik.",
        caption: "Grid 3×3 vs random 12 titik.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Semakin banyak trial semakin baik, tanpa batas.' Salah — setiap trial yang dievaluasi di validation set adalah 'pandangan' ke kunci jawaban. 1.000 trial = memilih yang kebetulan cocok dengan validation (overfitting ke validation!). Gejala: val naik terus, test stagnan/turun. Obat: pisahkan test set yang TIDAK PERNAH dipakai tuning; batasi trial sesuai budget.",
      },
      reference: "Grid rajin, random beruntung, Bayesian belajar. Semua butuh validation yang jujur.",
    },
    {
      id: "lab-search",
      eyebrow: "Langkah 3 · Lab search",
      title: "Lab: grid melewatkan, random menemukan",
      prose: [
        "Objective tiruan dengan optimum di lr=0,03, depth=6 (+ noise kecil). Grid: 3 lr × 3 depth = 9 trial. Random: 12 titik (lr log-uniform 0,001–0,1, depth 2–10). Bandingkan skor terbaik — dan perhatikan lr terbaik masing-masing.",
        "Coba ubah: naikkan grid ke 5×5=25 trial — apakah mengalahkan random 12? (Sering TIDAK, jika 0,03 tetap terlewat!) Lalu naikkan random ke 50 — lihat konsistensinya. Pelajaran: trial BANYAK tidak mengalahkan trial CERDAS.",
        "Cara membaca: skor negatif (semakin dekat 0 semakin baik). Interpretasi: −0,11 vs −0,46 = random 4x lebih dekat ke optimum dengan trial sebanding.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `grid_best` (skor, lr, depth) dari 9 kombinasi" },
        { id: "t2", text: "Hitung `rand_best` dari 12 titik acak, bandingkan, `print` keduanya" },
      ],
      expected: "grid_best=(-0.4598, 0.01, 6)  rand_best=(-0.1087, 0.0176, 6)",
      requires: ["numpy"],
      note: {
        title: "💡 Intuisi",
        body: "Grid 0,01 vs optimum 0,03 — beda 3x lipat, tetapi grid 'tidak tahu' ada yang terlewat. Inilah bahaya presisi palsu: grid terlihat sistematis padahal buta. Random tidak lebih pintar — ia hanya tidak buta di tempat yang sama.",
      },
      hints: [
        "grid: itertools.product(lrs, depths), ambil max dari (objective(lr,d), lr, d)",
        "random: 10**uniform(-3,-1,12) untuk lr; integers(2,11,12) untuk depth",
        "objective memakai log10(lr) — skala log untuk learning rate!",
      ],
      code: {
        starter: `# SEED — jangan ubah
import numpy as np, itertools, math
rng = np.random.default_rng(7)
def objective(lr, depth):
    return (-((math.log10(lr) - math.log10(0.03))**2) * 2
            - ((depth - 6)**2) * 0.05 + rng.normal(0, 0.01))

# TULIS KODEMU
lrs = [0.001, 0.01, 0.1]
depths = [3, 6, 9]
# TODO t1: grid_best = max((objective(lr,d), lr, d) untuk semua kombinasi)
grid_best = None

# TODO t2: 12 titik acak (lr log-uniform, depth 2-10) -> rand_best
rand_best = None

# UJI (jangan ubah)
print("grid_best =", tuple(round(x, 4) for x in grid_best))
print("rand_best =", tuple(round(x, 4) for x in rand_best))`,
        lockLines: 8,
        solution: `# SEED — jangan ubah
import numpy as np, itertools, math
rng = np.random.default_rng(7)
def objective(lr, depth):
    return (-((math.log10(lr) - math.log10(0.03))**2) * 2
            - ((depth - 6)**2) * 0.05 + rng.normal(0, 0.01))

# TULIS KODEMU
lrs = [0.001, 0.01, 0.1]
depths = [3, 6, 9]
grid_best = max(((objective(lr, d), lr, d) for lr, d in itertools.product(lrs, depths)))
rlrs = 10 ** rng.uniform(-3, -1, 12)
rdeps = rng.integers(2, 11, 12)
rand_best = max(((objective(lr, int(d)), lr, int(d)) for lr, d in zip(rlrs, rdeps)))

# UJI (jangan ubah)
print("grid_best =", tuple(round(x, 4) for x in grid_best))
print("rand_best =", tuple(round(x, 4) for x in rand_best))`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "grid_best\\s*=\\s*\\(-0\\.4598, 0\\.01, 6\\)", label: "Grid terbaik = (−0,4598, 0,01, 6)", msg: "Grid melewatkan 0,03." },
          { kind: "stdout_matches", task: "t2", pattern: "rand_best\\s*=\\s*\\(-0\\.1087, 0\\.0176, 6\\)", label: "Random terbaik = (−0,1087, 0,0176, 6)", msg: "Random 4x lebih baik." },
        ],
      },
      reference: "Skala log untuk lr! Grid = presisi palsu; random = cakupan jujur.",
    },
    {
      id: "konsep-optuna",
      eyebrow: "Langkah 4 · Optuna & jebakan",
      title: "Optuna: TPE + pruning + dashboard",
      prose: [
        "Cara kerja Optuna dalam 3 kalimat: (1) kamu definisikan objective(trial) dengan trial.suggest_float('lr', 1e-4, 1e-1, log=True); (2) Optuna memilih titik via TPE — memodelkan trial 'bagus' (top 20%) vs 'jelek' secara terpisah, pilih yang rasio bagus/jelek tertinggi; (3) pruning menghentikan trial buruk di tengah (MedianPruner: jika di bawah median trial lain di epoch yang sama → stop).",
        "Pruning = penghemat 50%+: trial dengan lr=0,5 divergen di epoch 3 → jangan tunggu epoch 100. Syarat: laporkan skor intermediate via trial.report(). Tanpa report: tidak ada pruning = Bayesian tanpa rem.",
        "Jebakan 1 — overfitting ke validation: 200 trial memilih 'kebetulan terbaik' validation. Obat: test set terkunci (sentuh SEKALI di akhir) + nested CV untuk klaim serius. Jebakan 2 — search space salah: lr [0,1; 1,0] tidak mengandung 0,03 → Optuna 'terbaik' di 0,1 = terbaik dari yang salah. Luaskan dulu (log scale lebar), sempitkan kemudian.",
        "Jebakan 3 — tuning di data bocor: scaling/fitur dihitung dari SEMUA data (termasuk test) → skor validasi menipu. Obat: pipeline yang fit HANYA di train fold. Jebakan klasik yang meruntuhkan 30% 'hasil bagus' di kompetisi.",
        "Kepribadian Optuna: seperti perekrut cerdas — mewawancarai kandidat yang menjanjikan lebih dalam (exploit), tetap memberi kesempatan pada yang belum dikenal (explore), dan menghentikan wawancara yang jelas gagal di menit ke-5 (pruning).",
        "Multivariate TPE — korelasi antar hyperparameter. lr dan batch_size berinteraksi (lr besar butuh batch besar!). TPE standar mengasumsikan independen; multivariate=True memodelkan korelasi — +10-20% efisiensi untuk kasus berinteraksi (perkiraan praktik — bergantung pada seberapa kuat interaksi dan dataset; bukan angka universal). Nyalakan bila hyperparameter 'bercakap'.",
        "Study storage — jangan hilang. SQLite untuk lokal, PostgreSQL untuk tim. Dashboard Optuna: buka di browser, lihat contour plot (lr vs depth) — 'lembah' optimum terlihat visual. Trial tanpa database = hilang saat laptop mati.",
        "Warm start — jangan dari nol. Punya hasil tuning model serupa? Masukkan sebagai trial awal (enqueue_trial) — Optuna mulai dari yang menjanjikan, bukan acak. 20 trial warm = 50 trial cold. Pengetahuan lama = modal.",
      ],
      formula: String.raw`\text{hemat}_{\text{prune}} = 1 - \frac{\sum \text{epoch aktual}}{\sum \text{epoch penuh}}`,
      formulaNote: "Hemat pruning = proporsi compute yang dihemat; epoch aktual = epoch yang dijalankan sebelum diprune; epoch penuh = epoch maksimal. Contoh: 100 trial × 100 epoch, 60 diprune di epoch 20 → hemat = 1 − (60×20+40×100)/(100×100) = 48%.",
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Aturan praktis budget: 10× jumlah hyperparameter = trial minimum yang masuk akal (5 hyperparameter → 50 trial). Di bawah itu = lotre; di atas 200 = waspadai overfitting validation. Budget = 50-100 trial untuk kebanyakan kasus.",
      },
      reference: "TPE memilih, pruning menghentikan, test terkunci memvonis. Search space = setengah kemenangan.",
    },
    {
      id: "multi-fidelity-asha",
      eyebrow: "Langkah 5 · Multi-fidelity & budget",
      title: "ASHA: berhenti membuang compute ke trial yang sudah jelas kalah",
      prose: [
        "Kelemahan tersembunyi semua strategi di langkah sebelumnya: setiap trial dievaluasi dengan BUDGET PENUH. Seperti mewawancarai 100 kandidat masing-masing 8 jam — 90 di antaranya jelas tidak cocok di 15 menit pertama. Multi-fidelity = wawancara bertingkat: saring murah di awal, investasikan waktu hanya ke yang bertahan. Ini bukan optimasi kecil — ini pengali 5–10× jumlah trial dalam budget yang sama.",
        "Successive halving — algoritmanya elegan. Mulai n trial dengan budget kecil r (misal 81 trial × 1 epoch), pertahankan 1/η terbaik (η=3 → 27 trial), lipatgandakan budget (×3 epoch), ulangi sampai satu juara (27×3 → 9×9 → 3×27 → 1×81). Total biaya ≈ 5× SATU trial penuh untuk menjelajahi 81 konfigurasi (rumus di bawah). Bandingkan: 81 trial penuh = 81× biaya. Penghematan 16× untuk informasi yang hampir sama.",
        "Syaratnya: kurva belajar harus INFORMATIF di awal — peringkat trial di epoch kecil berkorelasi dengan peringkat di epoch penuh. Untuk learning rate yang divergen di epoch 3, ini jelas benar. Tetapi ada jebakan: konfigurasi 'slow starter' (lr kecil + warmup panjang) terlihat buruk di awal padahal juara di akhir. Obat: jangan agresif di rung pertama (η=3, bukan 4), dan pastikan budget minimum r cukup untuk melewati fase warmup.",
        "ASHA (Asynchronous Successive Halving) — versi yang dipakai di produksi. Successive halving sinkron menunggu trial TERLAMBAT di tiap rung sebelum promosi — dengan 8 worker, 7 menganggur menunggu 1 straggler. ASHA mempromosikan segera setelah cukup hasil terkumpul, tanpa menunggu. Hasil: utilisasi worker ~100%, wall-clock 2–3× lebih cepat (perkiraan praktik untuk 8 worker dengan straggler; tanpa straggler, keuntungannya kecil). Jika kamu paralel, tidak ada alasan memakai yang sinkron.",
        "Hyperband — lindung nilai atas agresivitas. Seberapa agresif pruning yang tepat? Tidak ada yang tahu sebelum mencoba. Hyperband menjalankan beberapa 'bracket' dengan agresivitas berbeda (satu bracket mulai 81 trial×1 epoch, bracket lain 27 trial×3 epoch, dst.) lalu mengambil yang terbaik lintas bracket. Pakai bila kurva belajarmu belum dikenal; bila sudah dikenal, satu bracket successive halving yang ditala cukup.",
        "Desain search space adalah keterampilan senior yang sesungguhnya — lebih menentukan dari pilihan optimizer. Tiga prinsip: (1) skala LOG untuk lr, regularisasi, dan apapun yang rentang efeknya orde-magnitudo (0,001 vs 0,01 beda dunia; 0,051 vs 0,061 tidak); (2) ruang BERSYARAT — jangan tuning max_depth bila n_estimators kecil (interaksi!); (3) temukan 2–3 hyperparameter yang penting via ablation cepat, lalu FOKUSKAN budget ke sana (pelajaran langkah 2: sebagian besar hyperparameter tidak penting).",
        "Aturan budget: total = trial × biaya_per_trial. Dengan multi-fidelity, 'trial' yang dihitung adalah trial EFEKTIF. Contoh: 50 GPU-jam, tiap trial penuh 1 jam. Tanpa ASHA: 50 trial. Dengan ASHA (16× hemat): 500–800 trial efektif dieksplorasi. Keputusan senior: dalam budget tetap, selalu pilih eksplorasi LEBIH BANYAK dengan fidelity adaptif daripada SEDIKIT trial penuh — kecuali tiap trial semurah 1 menit (maka langsung random/BO penuh).",
        "Jebakan tuning-test leakage, versi mendalam. Setiap kali kamu memilih 'terbaik' berdasar skor validation, sedikit informasi validation bocor ke keputusanmu. Setelah 200 trial, validation terbaik = optimistis 2–5 poin (kurva overfitting-validasi). Gejala di mini-case: val naik 0,02, test naik 0,015 — selisih 0,005 masih sehat; bila test STAGNAN sementara val naik terus = validasi sudah menjadi 'test kedua'. Obat: test TERKUNCI, sentuh sekali; laporkan gap val–test sebagai metrik kejujuran.",
        "Variansi seed — angka yang dilupakan. Konfigurasi sama, 5 seed berbeda → std 0,008. 'Kemenangan' +0,005 di bawah noise = bukan kemenangan. Senior melaporkan mean ± std lintas seed (minimal 3), bukan best-of-5. Dan reproduksibilitas: seed python, numpy, torch, dan data-loader workers; flag deterministik; catat environment (skor 0,91 di torch 1.13 bisa jadi 0,89 di 2.0 bila versi library tak tercatat).",
        "BOHB — perkawinan Bayesian Optimization dan Hyperband. ASHA memilih trial berikutnya secara acak; BOHB menggantinya dengan surrogate model (seperti TPE) yang belajar dari trial-trial sebelumnya di tiap bracket. Hasil: 2–3× lebih efisien dari Hyperband murni saat search space besar dan kurva belajar berisik (perkiraan praktik — bergantung pada search space dan noise kurva; ukur di workload-mu sendiri). Kapan memakai? Bila kamu sudah di Optuna, `TPESampler` + `HyperbandPruner` = BOHB gratis. Bila search space kecil (di bawah 4 HP), ASHA acak sudah cukup — BO tidak banyak membantu.",
        "Pruning yang salah = membuang juara. Keputusan prune berdasar SATU seed = noise: trial bagus yang kebetulan dapat seed jelek terlihat buruk di epoch awal. Praktik aman: bandingkan median lintas 2–3 seed untuk keputusan prune (biaya 2–3× di rung awal, tetapi jauh lebih murah dari kehilangan konfigurasi terbaik), atau terima risiko dan catat asumsi. Jangan pernah prune di epoch 1–2 — bahkan konfigurasi terbaik pun terlihat acak di sana.",
        "Sesuaikan senjata dengan biaya trial. Deep learning (jam per trial) → multi-fidelity WAJIB, ASHA/BOHB, pruning agresif. Gradient boosting (menit per trial) → random search 100–200 + early stopping sederhana sering mengalahkan BO yang canggih — overhead surrogate tidak terbayar. Model linear (detik) → grid penuh saja. Senior tidak memakai palu yang sama untuk paku dan baut.",
      ],
      formula: String.raw`n_k = n/\eta^k, \quad r_k = r\cdot\eta^k, \quad B_{total} \approx (s_{max}+1)\cdot n \cdot r`,
      formulaNote: "n_k = trial yang bertahan di rung k; r_k = budget per trial di rung k; n = trial awal; r = budget minimum (epoch); η = faktor reduksi (3–4); s_max = jumlah rung; B_total = total biaya ≈ (rung)×n×r — JAUH di bawah n×R (semua penuh). Contoh: n=81, r=1, η=3 → B ≈ 5×81 = 405 epoch-unit vs 81×81 = 6561 (16× hemat).",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Semakin banyak trial semakin baik.' Tanpa multi-fidelity, 500 trial penuh = 500× biaya untuk informasi yang 80%-nya sudah terlihat di 10% budget pertama. ASHA memberi 500 trial eksplorasi seharga ~50 trial penuh. Yang mahal bukan trialnya — melainkan trial yang diteruskan padahal sudah jelas kalah.",
      },
      reference: "Multi-fidelity = saring murah, invest ke pemenang. ASHA untuk paralel, Hyperband bila kurva tak dikenal. Waspadai overfitting-validasi dan noise seed.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: strategi apa, berapa trial?",
      prose: [
        "Skenario 1 — <3 hyperparameter, murah → grid kecil OK. 2-3 dimensi masih terjangkau.",
        "Skenario 2 — 3-10 hyperparameter → random 50-100 atau Optuna TPE. Standar industri.",
        "Skenario 3 — training mahal (jam/hari per trial) → Optuna + pruning agresif. Tiap trial = uang.",
        "Skenario 4 — butuh hasil BESOK → random 20 trial + intuisi. Lebih baik dari grid 100 yang tak selesai.",
        "Skenario 5 — klaim 'SOTA'/publikasi → nested CV + test terkunci. Bukti, bukan janji.",
        "Aturan praktis 10 detik: (1) skala log untuk lr/reg. (2) 10× hyperparameter = trial. (3) prune selalu. (4) test sentuh sekali.",
        "Skenario 6 — deep learning (mahal) → Bayesian + successive halving + pruning. Tiap trial = jam GPU = uang.",
        "Skenario 7 — 2 hyperparameter saja → grid kecil atau manual. Jangan Optuna untuk 2 dimensi (overkill!).",
      ],
      tasks: [],
    },
    {
      id: "minicase-tuning",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 100 trial, Rp50 juta, 2% AUC",
      prose: [
        "Bank tuning XGBoost: 6 hyperparameter, tiap trial 30 menit (CV 5-fold). Grid 4^6 = 4.096 trial = 85 hari — mustahil. Optuna 100 trial = 50 jam ≈ 2 hari di 1 mesin (Rp50 ribu/jam = Rp2,5 juta). Hasil: AUC 0,86 → 0,88 (+0,02).",
        "Nilai: 0,02 AUC × Rp200 juta/0,01 = Rp400 juta/tahun. Biaya: Rp2,5 juta compute + 2 hari engineer. ROI: 160x. Tetapi: validasi NAIK 0,02, test NAIK 0,015 — selisih 0,005 = overfitting validation ringan (masih OK). Jika test TURUN: rollback ke default — tuning yang jujur berani bilang 'tidak ada perbaikan'.",
        "Pembahasan: 100 trial dipilih karena 10×6 hyperparameter ≈ 60, dibulatkan ke 100 dengan pruning. Tanpa pruning: 100×30 menit penuh. Dengan (40% diprune di 1/3 jalan): hemat ~25% ≈ Rp600 ribu. Kecil — tetapi kebiasaan yang benar.",
        "Cara membaca: bandingkan BIAYA tuning (Rp2,5 juta) vs NILAI perbaikan (Rp400 juta/tahun) vs RISIKO overfitting (test terkunci). Tiga angka = keputusan lengkap.",
        "Interpretasi: tuning = investasi dengan ROI terukur. Yang tidak terukur ('coba-coba') = bukan tuning, melainkan hobi.",
        "Dokumentasi tuning — 1 halaman. Search space, trial terbaik + 3 runner-up, kurva optimasi, keputusan final + alasan. 6 bulan kemudian: 'mengapa lr 0,03?' → jawab 1 menit, bukan 'lupa'. Tuning tanpa dokumentasi = lotre yang menang sekali.",
      ],
      tasks: [],
    },
    {
          id: "gap-r9-parameter-hyperparameter",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P6-G5)",
          title: "Parameter vs hyperparameter: siapa yang belajar?",
          prose: [
            "Langkah 2 memakai istilah “hyperparameter” sejak awal — tetapi lesson ini belum pernah mendefinisikan bedanya dengan “parameter”. Parameter adalah yang DIPELAJARI model dari data: bobot (weights) dan bias neural network, koefisien regresi. Hyperparameter adalah yang DITETAPKAN manusia SEBELUM training: learning rate, jumlah layer, batch size, jumlah epoch, kekuatan regularisasi. Tuning (lesson ini) hanya mengoptimasi hyperparameter; training mengoptimasi parameter.",
            "Mengapa bedanya penting? Karena keduanya dioptimasi dengan CARA berbeda dan pada DATA berbeda: parameter dioptimasi oleh gradient descent pada training set; hyperparameter dioptimasi oleh grid/random/Optuna pada validation set. Mencampur keduanya — mis. memilih learning rate berdasarkan training loss — adalah overfitting ke training set. Dan “hyperparameter” bukan “parameter yang lebih tinggi” — ia adalah KEPUTUSAN DESAIN, bukan hasil belajar.",
            "Contoh angka (5 item): bobot (parameter), learning rate (hyperparameter), bias (parameter), jumlah layer (hyperparameter), batch size (hyperparameter) → 2 parameter, 3 hyperparameter. Aturan jempol: bila nilainya berubah SELAMA training oleh algoritma = parameter; bila nilainya kamu tetapkan SEBELUM training dan tidak berubah selama training = hyperparameter.",
          ],
          formula: String.raw`\text{parameter: dipelajari dari data} \qquad \text{hyperparameter: ditetapkan sebelum training}`,
          formulaNote: "Parameter = dipelajari model (bobot, bias, koefisien). Hyperparameter = ditetapkan manusia sebelum training (lr, n_layer, batch size, epoch). Contoh: bobot/bias = parameter (2); lr/n_layer/batch = hyperparameter (3).",
          tasks: [
            { id: "t1", text: "Hitung `param` dan `hyper` dari 5 item (is_hyper True/False)" },
            { id: "t2", text: "Cetak keduanya" },
          ],
          expected: "param=2 hyper=3",
          hints: [
            "param = jumlah item dengan is_hyper False.",
            "hyper = jumlah item dengan is_hyper True.",
          ],
          code: {
            starter: `# (nama, is_hyperparameter)\nitems = [("bobot", False), ("lr", True), ("bias", False), ("n_layer", True), ("batch", True)]\n\n# TULIS KODEMU: hitung parameter vs hyperparameter\nparam = \nhyper = \n\nprint(f"param={param} hyper={hyper}")`,
            lockLines: 4,
            solution: `# (nama, is_hyperparameter)\nitems = [("bobot", False), ("lr", True), ("bias", False), ("n_layer", True), ("batch", True)]\n\n# TULIS KODEMU: hitung parameter vs hyperparameter\nparam = sum(1 for _, h in items if not h)\nhyper = sum(1 for _, h in items if h)\n\nprint(f"param={param} hyper={hyper}")`,
            checks: [
              { kind: "equal", task: "t1", name: "param", value: 2, label: "`param` seharusnya 2", msg: "Bobot dan bias dipelajari dari data." },
              { kind: "equal", task: "t1", name: "hyper", value: 3, label: "`hyper` seharusnya 3", msg: "lr, n_layer, batch ditetapkan sebelum training." },
              { kind: "stdout_matches", task: "t2", pattern: "param=2\\s+hyper=3", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Mana yang hyperparameter?",
              options: [
                { text: "Learning rate — ditetapkan sebelum training, tidak berubah selama training", why: "Benar: hyperparameter adalah keputusan desain sebelum training.", correct: true },
                { text: "Bobot layer pertama — ditetapkan sebelum training", why: "Salah: bobot diinisialisasi sebelum training tetapi DIPELAJARI (berubah) selama training — ia parameter." },
                { text: "Loss training — ditetapkan sebelum training", why: "Salah: loss adalah hasil yang diukur, bukan keputusan desain." },
              ],
            },
          ],
          reference: "Parameter dipelajari (bobot/bias); hyperparameter ditetapkan (lr/layer/batch/epoch).",
        },
    {
          id: "gap-r9-optuna-pruning",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P6-G6)",
          title: "Optuna & pruning: suggest, report, MedianPruner",
          prose: [
            "Langkah 4 menyebut Optuna dan ASHA — tetapi lesson ini belum pernah menunjukkan API-nya. Tiga potong kodenya: `trial.suggest_float('lr', 1e-4, 1e-1, log=True)` (minta Optuna mengusulkan lr dari ruang log-uniform), `trial.report(nilai, step)` (laporkan metrik intermediate tiap epoch agar pruner bisa menilai), dan `MedianPruner` (hentikan trial yang nilainya di bawah MEDIAN trial-trial sebelumnya pada step yang sama — trial yang tertinggal dari median kemungkinan besar tidak akan menang).",
            "Contoh angka (2 trial, 10 epoch): Trial A melaporkan [0,50; 0,60; 0,70; …] (membaik); Trial B [0,50; 0,45; 0,40; …] (memburuk). Di step 2, median nilai = median(0,60; 0,45) = 0,525 — B (0,45) di bawah median → PRUNE di epoch 3. Tanpa pruning: 2 × 10 = 20 epoch. Dengan pruning: 10 + 3 = 13 epoch — hemat 7 epoch (35%) untuk 2 trial; untuk 200 trial, penghematannya mendominasi budget.",
            "Aturan praktis: pruning hanya aman bila metrik intermediate PREDIKTIF terhadap hasil akhir (kurva belajar yang monoton naik). Bila kurva berisik atau “late bloomer” (lambat di awal, melesat di akhir — umum di lr kecil), MedianPruner yang agresif membunuh juara masa depan. Mitigasi: `n_startup_trials` (jangan prune sebelum cukup trial selesai) dan `n_warmup_steps` (jangan prune di epoch-epoch awal).",
          ],
          formula: String.raw`\text{prune jika nilai} < \text{median nilai trial lain di step yang sama}`,
          formulaNote: "Optuna: suggest_float (usulkan dari ruang), trial.report (lapor intermediate), MedianPruner (hentikan bila di bawah median). Contoh angka: A membaik, B memburuk → B di-prune epoch 3; 20 → 13 epoch, hemat 7 (35%).",
          tasks: [
            { id: "t1", text: "Hitung `tanpa` (2 trial × 10 epoch) dan `dengan` (10 + 3 epoch)" },
            { id: "t2", text: "Hitung `hemat` dan cetak ketiganya" },
          ],
          expected: "tanpa=20 dengan=13 hemat=7",
          hints: [
            "tanpa = 2 × 10.",
            "dengan = 10 (trial A penuh) + 3 (trial B di-prune).",
          ],
          code: {
            starter: `# trial A penuh 10 epoch; trial B di-prune di epoch 3\nepoch_penuh, epoch_prune = 10, 3\n\n# TULIS KODEMU: epoch tanpa vs dengan pruning\ntanpa = \ndengan = \nhemat = \n\nprint(f"tanpa={tanpa} dengan={dengan} hemat={hemat}")`,
            lockLines: 4,
            solution: `# trial A penuh 10 epoch; trial B di-prune di epoch 3\nepoch_penuh, epoch_prune = 10, 3\n\n# TULIS KODEMU: epoch tanpa vs dengan pruning\ntanpa = 2 * epoch_penuh\ndengan = epoch_penuh + epoch_prune\nhemat = tanpa - dengan\n\nprint(f"tanpa={tanpa} dengan={dengan} hemat={hemat}")`,
            checks: [
              { kind: "equal", task: "t1", name: "tanpa", value: 20, label: "`tanpa` seharusnya 20", msg: "2 × 10 = 20." },
              { kind: "equal", task: "t1", name: "dengan", value: 13, label: "`dengan` seharusnya 13", msg: "10 + 3 = 13." },
              { kind: "equal", task: "t2", name: "hemat", value: 7, label: "`hemat` seharusnya 7", msg: "20 − 13 = 7 (35%)." },
              { kind: "stdout_matches", task: "t2", pattern: "tanpa=20\\s+dengan=13\\s+hemat=7", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Kapan MedianPruner BERBAHAYA?",
              options: [
                { text: "Kurva belajar late bloomer — trial lambat di awal tetapi melesat di akhir", why: "Benar: pruner membunuh juara masa depan; mitigasi dengan n_warmup_steps / n_startup_trials.", correct: true },
                { text: "Trial sudah berjalan 90% epoch", why: "Salah: di akhir, pruning hampir tidak menghemat apa pun — tetapi juga tidak berbahaya." },
                { text: "Semua trial nilainya sama", why: "Salah: bila semua sama, median = nilai semua trial — tidak ada yang di bawah median." },
              ],
            },
          ],
          reference: "suggest_float + trial.report + MedianPruner; prune bila < median; waspadai late bloomer.",
        },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Parameter dipelajari; hyperparameter dipilih — butuh strategi pencarian, bukan kebetulan.",
        "Grid boros (n^d, presisi palsu); random efisien (cakupan jujur); Bayesian/Optuna belajar (TPE + pruning).",
        "Skala LOG untuk learning rate; 10× hyperparameter = trial minimum.",
        "Pruning hemat 50%+: laporkan intermediate, hentikan yang di bawah median.",
        "Jebakan: overfitting validation (test terkunci!), search space salah, data bocor.",
      ],
      next: { label: "MLE17 — Experiment Tracking", href: "/v2/learn/mle17-experiment-tracking" },
      quiz: [
        {
          q: "Grid {0,001; 0,01; 0,1} melewatkan optimum 0,03. Pelajarannya?",
          options: [
            { text: "Grid punya presisi palsu — terlihat sistematis padahal buta", why: "Tepat: kerapian grid ≠ cakupan ruang.", correct: true },
            { text: "Grid selalu gagal", why: "Grid bisa berhasil bila grid mengandung optimum — masalahnya tidak ada jaminan.", correct: false },
            { text: "0,03 bukan optimum", why: "Lab membuktikan 0,0176 (dekat 0,03) jauh lebih baik.", correct: false },
            { text: "Random selalu menemukan optimum", why: "Random juga bisa gagal — hanya peluangnya lebih baik.", correct: false },
          ],
        },
        {
          q: "Mengapa learning rate memakai skala LOG?",
          options: [
            { text: "Efek lr multiplikatif — 0,001→0,01 sama pentingnya dengan 0,01→0,1", why: "Tepat: skala linear menumpuk di ujung besar, melewatkan orde kecil.", correct: true },
            { text: "Agar terlihat canggih", why: "Bukan kosmetik — ini soal cakupan ruang yang benar.", correct: false },
            { text: "Optuna mewajibkan", why: "Ini praktik umum, bukan kewajiban tool.", correct: false },
            { text: "Tidak ada bedanya", why: "Beda besar: linear [0,001; 0,1] = 90% titik di >0,01.", correct: false },
          ],
        },
        {
          q: "200 trial, validation naik terus, test turun. Diagnosis?",
          options: [
            { text: "Overfitting ke validation — kunci test, kurangi trial", why: "Tepat: memilih 'kebetulan terbaik' dari 200 pandangan ke kunci.", correct: true },
            { text: "Kurang trial", why: "Terbalik: terlalu BANYAK pandangan ke validation.", correct: false },
            { text: "Model kurang kompleks", why: "Gejala bukan bias — ini variance di level tuning.", correct: false },
            { text: "Normal", why: "Test turun = sinyal bahaya, bukan normal.", correct: false },
          ],
        },
        {
          q: "Trial divergen di epoch 3 dari 100. Tindakan Optuna yang benar?",
          options: [
            { text: "Prune — hentikan, hemat 97 epoch", why: "Tepat: MedianPruner untuk yang di bawah median.", correct: true },
            { text: "Lanjutkan sampai 100", why: "Membuang 97 epoch untuk yang jelas gagal.", correct: false },
            { text: "Ulangi dari epoch 0", why: "Mengulang yang gagal dengan setting sama = gila.", correct: false },
            { text: "Naikkan learning rate", why: "Divergen = lr TERLALU tinggi; menaikkan memperparah.", correct: false },
          ],
        },
        {
          q: "Kapan test set boleh dipakai dalam tuning?",
          options: [
            { text: "Sekali, di akhir, untuk vonis final", why: "Tepat: test terkunci — sentuh sekali, lalu selesai.", correct: true },
            { text: "Tiap 10 trial untuk cek progres", why: "Itu = tuning ke test = overfitting.", correct: false },
            { text: "Boleh, asal tidak sering", why: "'Tidak sering' tetap bocor — sekali bocor, vonis batal.", correct: false },
            { text: "Tidak pernah sama sekali", why: "Di akhir untuk laporan final = boleh dan perlu.", correct: false },
          ],
        },
        {
          q: "Successive halving: 81 trial, η=3, budget penuh 81 epoch. Total biaya vs semua trial penuh?",
          options: [
            { text: "Sekitar 405 epoch-unit (5× satu trial penuh) vs 6561 — hemat ~16×", why: "Tepat: 81×1 + 27×3 + 9×9 + 3×27 + 1×81 = 405; informasi peringkat hampir sama.", correct: true },
            { text: "Sama saja — 81 trial tetap 81 trial", why: "Keliru: sebagian besar trial berhenti di budget kecil; hanya juara yang mahal.", correct: false },
            { text: "Lebih mahal karena overhead", why: "Overhead penjadwalan kecil dibanding 16× penghematan compute.", correct: false },
            { text: "Tidak bisa dihitung", why: "Bisa — rumus B_total di atas memberi estimasi pasti.", correct: false },
          ],
        },
        {
          q: "Kamu menjalankan Optuna 200 trial; 50 trial pertama menemukan lr=0,03 (terbaik), 150 trial berikutnya tidak ada yang mengalahkannya. Langkah selanjutnya yang paling tepat?",
          options: [
            { text: "Berhenti / alihkan budget — ruang di sekitar lr=0,03 sudah jenuh; persempit ruang ke sekitar 0,03 atau tambah dimensi baru", why: "Tepat: 150 trial tanpa perbaikan = search space jenuh; tambah trial acak di ruang yang sama hanya membakar budget.", correct: true },
            { text: "Tambah 200 trial lagi di ruang yang sama", why: "Salah: ruang yang sama sudah dijelajahi 150 trial tanpa perbaikan — itu definisi jenuh.", correct: false },
            { text: "Naikkan lr ke 0,3 dan ulangi dari nol", why: "Salah: lr=0,03 adalah yang TERBAIK sejauh ini — membuangnya tanpa alasan bukan strategi.", correct: false },
            { text: "Ganti ke grid search penuh di ruang yang sama", why: "Salah: grid di ruang yang sudah jenuh sama borosnya dengan random — masalahnya ruangnya, bukan metodenya.", correct: false },
          ],
        },
      ],
    },
  ],
};
