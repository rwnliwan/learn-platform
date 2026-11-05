import type { V2Lesson } from "../lib/types";

// 4 run: val_auc 0.81/0.77/0.86/0.88 — yang terbaik bukan yang train tertinggi.
const FIG_TRACK = `<svg viewBox="0 0 480 250" role="img" aria-label="Train vs validation AUC untuk 4 run eksperimen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="205" x2="460" y2="205"/><line x1="44" y1="155" x2="460" y2="155"/><line x1="44" y1="105" x2="460" y2="105"/><line x1="44" y1="55" x2="460" y2="55"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="209">0,7</text><text x="38" y="159">0,8</text><text x="38" y="109">0,9</text><text x="38" y="59">1,0</text></g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<rect x="70" y="115" width="40" height="90" fill="var(--c4)"/><rect x="115" y="145" width="40" height="60" fill="var(--c1)"/>
<rect x="175" y="55" width="40" height="150" fill="var(--c4)"/><rect x="220" y="175" width="40" height="30" fill="var(--c1)"/>
<rect x="280" y="85" width="40" height="120" fill="var(--c4)"/><rect x="325" y="115" width="40" height="90" fill="var(--c1)"/>
<rect x="385" y="105" width="40" height="100" fill="var(--c4)"/><rect x="430" y="115" width="40" height="90" fill="var(--c1)"/>
</g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="112" y="225">baseline</text><text x="217" y="225">lr_tinggi</text><text x="322" y="225">dalam</text><text x="427" y="225">dalam_lr_kecil</text></g>
<g font-size="11" font-family="var(--font-ui)"><rect x="330" y="20" width="14" height="14" fill="var(--c4)"/><text x="350" y="32" fill="var(--chart-text)">train_auc</text><rect x="330" y="40" width="14" height="14" fill="var(--c1)"/><text x="350" y="52" fill="var(--chart-text)">val_auc</text></g>
<text x="240" y="245" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">train tertinggi (0,99) ≠ terbaik — val tertinggi (0,88) yang menang</text>
</svg>`;

export const mle17: V2Lesson = {
  slug: "mle17-experiment-tracking",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE17 — Experiment Tracking (MLflow/W&B)",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-hilang",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model 91% yang tidak bisa diulang siapa pun",
      prose: [
        "Tiga bulan lalu, Rian melatih model 'terbaik' — AUC 0,91. Hari ini diminta me-reproduce untuk audit. Masalah: hyperparameter ada di sticky note yang hilang, dataset 'final_v2_FINAL.csv' tidak jelas versinya, kode training sudah ditimpa 40 commit. 0,91 tidak bisa dibuktikan, tidak bisa diulang — secara praktis TIDAK PERNAH ADA.",
        "Tim sebelah memakai MLflow: setiap run tercatat — params, metrik, dataset hash, kode versi, artefak model. Audit? Buka run #142, klik 'reproduce' — 0,91 muncul lagi dalam 1 jam. Bedanya bukan kedisiplinan personal — melainkan SISTEM yang membuat kedisiplinan otomatis. Tanpa tracking, ML = ilmu sihir; dengan tracking = ilmu pengetahuan.",
        "Twist-nya: experiment tracking bukan 'dokumentasi tambahan' — ia adalah SATU-SATUNYA cara kerja ML bisa disebut engineering. JD Bali/Indonesia mensyaratkan MLflow eksplisit; frekuensi 0,43 di 21 JD. Lesson ini = hands-on tracking + model registry + membandingkan eksperimen seperti profesional.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan apa yang wajib dilacak tiap run; (2) mengimplementasikan tracker minimal (log, bandingkan, pilih terbaik); (3) membaca perbandingan run untuk memilih model; (4) menjelaskan model registry (staging → production); (5) mendeteksi overfit dari jurang train-val di dashboard.",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · Apa yang dilacak — Langkah 3 · Lab: tracker & perbandingan — Langkah 4 · Registry & lifecycle — Langkah 5 · Peta keputusan — Langkah 6 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Tanpa tracking, hasil ML = sihir. Dengan tracking = engineering.",
    },
    {
      id: "konsep-lacak",
      eyebrow: "Langkah 2 · Apa yang dilacak",
      title: "Lima hal wajib + dua yang sering lupa",
      prose: [
        "Lima wajib tiap run: (1) PARAMETERS — hyperparameter + config (seed!); (2) METRICS — train/val/test, bukan hanya satu; (3) DATA — hash/versi dataset (data berubah = hasil tak sebanding); (4) CODE — commit hash atau snapshot; (5) ARTIFAK — model tersimpan + plot penting. Tanpa satu pun = run tidak reproducible.",
        "Dua yang sering lupa: (6) ENVIRONMENT — versi library, CUDA, OS (0,91 di torch 1.13 bisa jadi 0,89 di 2.0!); (7) DURASI & BIAYA — berapa jam GPU, berapa rupiah (untuk ROI tuning). Tim yang melacak biaya menemukan 30% trial sia-sia — insight yang tak muncul tanpa angka.",
        "Struktur MLflow: experiment (folder proyek) → run (satu eksekusi) → params/metrics/artifacts. W&B menambah: dashboard live, kolaborasi, sweep (tuning terintegrasi). Pilih MLflow bila butuh open-source self-host; W&B bila mau SaaS cepat + visualisasi kaya. Keduanya menyelesaikan masalah yang sama.",
        "Kepribadian tracking: seperti buku lab ilmuwan — bukan 'hasilnya 0,91', melainkan 'pada tanggal X, dengan bahan Y, prosedur Z, hasilnya 0,91, dan bisa diulang'. Sains tanpa buku lab = anekdot.",
        "Naming convention — run yang bisa dicari. 'coba-lagi-3' = sampah. Format: {model}_{data-ver}_{tujuan}_{tanggal} → 'xgb_v2a1_tune-lr_20261013'. Cari 6 bulan kemudian = ketemu. Tanpa konvensi: 200 run 'test', 'test2', 'final', 'final2' — kuburan eksperimen.",
        "Tags & notes — konteks manusia. Tag: 'baseline', 'production-candidate', 'abandoned-alasan'. Notes: 'mencoba lr kecil karena overfit'. 6 bulan kemudian, notes = satu-satunya yang menjelaskan MENGAPA. Angka tanpa cerita = misteri.",
        "Autolog vs manual — dua mode. Autolog (1 baris): params+metrik dasar otomatis — 80% manfaat, 0 usaha. Manual (mlflow.log_param): untuk yang custom (data hash!, biaya). Praktik: autolog selalu + manual untuk 3 hal penting. Jangan pilih salah satu — tumpuk.",
      ],
      formula: String.raw`\text{reproducibility} = f(\text{params}, \text{data}, \text{code}, \text{env})`,
      formulaNote: "Reproducibility = fungsi dari empat input yang SEMUANYA harus tercatat. Hilang satu (misal seed acak tak tercatat) = hasil tak terulang. Contoh: run #142 → params(lr=0,003, depth=8) + data(hash a1b2) + code(commit 9f3c) + env(torch 2.0) = 0,88 kapan pun diulang.",
      figure: {
        svg: FIG_TRACK,
        alt: "Perbandingan train vs validation AUC 4 run.",
        caption: "Empat run: train vs validation.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Tracking = menyimpan model terbaik saja.' Salah. Model terbaik TANPA konteks (params? data apa? kode versi berapa?) = artefak misterius yang tidak bisa dipertanggungjawabkan. Audit/regulator bertanya 'bagaimana model ini dibuat?' — jawabannya ada di run, bukan di file .pkl.",
      },
      reference: "Params, metrics, data hash, code, artefak + env + biaya. Semua, tiap run.",
    },
    {
      id: "lab-tracker",
      eyebrow: "Langkah 3 · Lab tracker",
      title: "Lab: log, bandingkan, pilih yang terbaik",
      prose: [
        "Empat run dengan params dan metrik berbeda. Implementasikan log_run (simpan ke list), best_run (pilih val_auc tertinggi), lalu hitung overfit gap (train − val) run terbaik. Perhatikan: run 'lr_tinggi' punya train TERTINGGI (0,99) tetapi val TERENDAH (0,77) — jebakan klasik!",
        "Coba ubah: tambah run kelima dengan val_auc 0,90 tetapi train 0,99 (gap 0,09) — apakah best_run tetap memilihnya? Seharusnya ya (val tertinggi), TETAPI gap besar = peringatan. Tracker yang baik menampilkan gap, bukan hanya pemenang.",
        "Cara membaca: best = val tertinggi; gap = kejujuran. Interpretasi: 0,88 dengan gap 0,02 = model jujur dan terbaik — inilah yang dipromosikan ke registry.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `log_run` dan `best_run` (val_auc tertinggi)" },
        { id: "t2", text: "Hitung overfit gap run terbaik, `print` ketiganya" },
      ],
      expected: "best=dalam_lr_kecil val_auc=0.88 overfit_gap=0.02",
      note: {
        title: "💡 Intuisi",
        body: "Perhatikan 'lr_tinggi': train 0,99 terlihat MENGGODA di dashboard yang hanya menampilkan train. Inilah mengapa metrik WAJIB berpasangan (train+val) — satu angka = setengah kebenaran. Dashboard yang baik membuat kebohongan sulit.",
      },
      hints: [
        "runs = []; log_run append dict {name, params, metrics}",
        "best_run: max(runs, key=lambda r: r['metrics']['val_auc'])",
        "gap = train_auc - val_auc dari run terbaik",
      ],
      code: {
        starter: `# SEED — jangan ubah
runs = []

# TULIS KODEMU
def log_run(name, params, metrics):
    # TODO t1: simpan dict ke runs
    pass

def best_run(metric="val_auc"):
    # TODO t1: kembalikan run dengan metric tertinggi
    return None

# UJI (jangan ubah)
log_run("baseline", {"lr": 0.01, "depth": 4}, {"val_auc": 0.81, "train_auc": 0.85})
log_run("lr_tinggi", {"lr": 0.1, "depth": 4}, {"val_auc": 0.77, "train_auc": 0.99})
log_run("dalam", {"lr": 0.01, "depth": 8}, {"val_auc": 0.86, "train_auc": 0.92})
log_run("dalam_lr_kecil", {"lr": 0.003, "depth": 8}, {"val_auc": 0.88, "train_auc": 0.90})
b = best_run()
gap = b["metrics"]["train_auc"] - b["metrics"]["val_auc"]
print("best =", b["name"], "val_auc =", b["metrics"]["val_auc"])
print("overfit_gap =", round(gap, 2))
print("n_runs =", len(runs))`,
        lockLines: 2,
        solution: `# SEED — jangan ubah
runs = []

# TULIS KODEMU
def log_run(name, params, metrics):
    runs.append({"name": name, "params": params, "metrics": metrics})

def best_run(metric="val_auc"):
    return max(runs, key=lambda r: r["metrics"][metric])

# UJI (jangan ubah)
log_run("baseline", {"lr": 0.01, "depth": 4}, {"val_auc": 0.81, "train_auc": 0.85})
log_run("lr_tinggi", {"lr": 0.1, "depth": 4}, {"val_auc": 0.77, "train_auc": 0.99})
log_run("dalam", {"lr": 0.01, "depth": 8}, {"val_auc": 0.86, "train_auc": 0.92})
log_run("dalam_lr_kecil", {"lr": 0.003, "depth": 8}, {"val_auc": 0.88, "train_auc": 0.90})
b = best_run()
gap = b["metrics"]["train_auc"] - b["metrics"]["val_auc"]
print("best =", b["name"], "val_auc =", b["metrics"]["val_auc"])
print("overfit_gap =", round(gap, 2))
print("n_runs =", len(runs))`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "best\\s*=\\s*dalam_lr_kecil\\s+val_auc\\s*=\\s*0\\.88", label: "Terbaik = dalam_lr_kecil (0.88)", msg: "Bukan lr_tinggi meski train-nya 0,99." },
          { kind: "stdout_matches", task: "t2", pattern: "overfit_gap\\s*=\\s*0\\.02", label: "Gap = 0.02 (jujur)", msg: "0.90 − 0.88." },
          { kind: "stdout_matches", task: "t2", pattern: "n_runs\\s*=\\s*4", label: "4 run tercatat", msg: "Semua eksperimen terdokumentasi." },
        ],
      },
      reference: "Pilih dari val, curigai gap besar, lacak semua.",
    },
    {
      id: "konsep-registry",
      eyebrow: "Langkah 4 · Registry & lifecycle",
      title: "Dari run ke produksi: model registry",
      prose: [
        "Run terbaik ≠ otomatis produksi. Model registry = etalase resmi: model didaftarkan dengan versi (v1, v2...), stage (staging → production → archived), dan approval. Alur: best run → register v3 → staging (uji di 5% traffic) → production (gantikan v2) → v2 di-archive (bisa rollback!). Tanpa registry: 'model produksi' = file di laptop seseorang.",
        "Challenger vs champion: v3 (challenger) vs v2 (champion) diadu di traffic nyata. Menang → promosi; kalah → arsip. Registry mencatat SIAPA menyetujui promosi dan KAPAN — audit trail untuk regulator.",
        "Lifecycle artefak: tiap versi registry menyimpan model + params + data hash + metrik. Rollback = ganti stage kembali (1 klik, 1 menit). Insiden: v3 ternyata bias → kembalikan v2 dalam 5 menit, investigasi tanpa panik. Tanpa versioning: rollback = cari file lama di Slack.",
        "Kepribadian registry: seperti apotek — obat (model) berlabel jelas, ada tanggal kedaluwarsa (kapan retrain?), resep dokter (approval), dan yang kedaluwarsa ditarik dari rak (archived). Tidak ada obat tanpa label di apotek profesional.",
        "Alias vs stage — dua cara menandai. Stage (staging/production): status lifecycle. Alias ('champion', 'challenger'): peran fungsional. Model bisa ber-stage production + ber-alias challenger (diadu!). Pahami keduanya — MLflow mendukung dua-duanya.",
        "Model signature — kontrak input. Simpan schema input (nama, tipe) di registry; serving menolak input tak sesuai OTOMATIS. Mencegah 80% 'model rusak' yang sebenarnya 'input berubah'. Kontrak = seperti API versioning.",
        "Disaster recovery untuk model — skenario yang jarang dipikir. Registry server down? Backup harian ke S3 (artefak + database). Region cloud mati? Registry multi-region (read replica). Model produksi = aset kritis; perlakukan seperti database produksi: backup, replica, runbook restore. Pernah diuji restore-nya? Jika belum, belum punya backup — baru punya harapan.",
        "Cost attribution per tim — siapa menghabiskan apa. Tag tiap run dengan owner/tim/proyek; dashboard bulanan: 'tim fraud: Rp45 juta GPU, 120 run, 3 model produksi'. Tanpa atribusi: 1 tim boros = semua kena pemotongan. Dengan: percakapan berbasis data. Tracking biaya = bagian tracking eksperimen, bukan 'nanti'.",
      ],
      formula: String.raw`v_{\text{prod}} = \begin{cases} v_{\text{new}} & \text{jika } \Delta\text{metrik} > \tau \text{ dan lolos staging} \\ v_{\text{old}} & \text{sebaliknya} \end{cases}`,
      formulaNote: "v_prod = versi di produksi; Δmetrik = perbaikan vs champion; τ = ambang signifikansi (misal +0,01 AUC); staging = uji 5% traffic. Contoh: v3 Δ=+0,02 > τ=0,01 dan staging OK → promosi. Tanpa ambang: churn versi tanpa nilai.",
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Stage 'staging' sering dilewatkan tim kecil ('langsung produksi saja'). Biaya staging: 1 hari. Biaya bug di produksi 100%: insiden + rollback panik + kepercayaan hilang. Staging = premi asuransi termurah di ML.",
      },
      reference: "Register → staging → production → archive. Rollback 1 menit, bukan 1 hari.",
    },
    {
      id: "registry-lineage-produksi",
      eyebrow: "Langkah 5 · Registry & lineage",
      title: "Dari run ke produksi: lineage yang menyelamatkanmu saat insiden",
      prose: [
        "Bayangkan insiden ini: model skor kredit produksi turun 2% semalam. Tanpa lineage, pertanyaan 'model versi berapa? dilatih dari data apa? kode commit mana?' membutuhkan tiga hari arkeologi — dan jawabannya mungkin 'tidak tahu'. Dengan lineage lengkap, run #142 → data hash a1b2 → commit 9f3c → ketahuan dalam 20 menit: bukan modelnya yang rusak, melainkan pipeline data yang berubah diam-diam. Lineage bukan dokumentasi — ia adalah ASURANSI insiden.",
        "Skema yang benar, dari hulu ke hilir. Experiment = PERTANYAAN ('apakah fitur X membantu?'). Run = SATU UPAYA menjawabnya (params, metrics, tags, timestamp). Artifacts = BUKTI (file model, plot, prediksi sampel). Registered Model = NAMA RESMI ('skor-kredit') — etalase, bukan folder. Version = v1, v2, … IMMUTABLE (tidak pernah diubah setelah dibuat). Stage/Alias = staging, production, archived — penanda mana yang live SEKARANG.",
        "Mengapa version immutable? Karena 'yang di produksi SEKARANG' harus bisa ditunjuk dengan satu nama dan isinya TETAP selamanya. Jika v2 bisa ditimpa diam-diam, audit enam bulan kemudian tidak bisa membuktikan apa yang dulu live. Aturan: version = snapshot beku (model + params + data hash + code commit); yang BERGERAK hanya alias 'production' yang menunjuk ke version.",
        "Tepi-tepi lineage — tiap edge menjawab satu pertanyaan insiden. Data → run: 'data versi apa?' (jawab: hash; idealnya DVC/lakeFS — minimal catat hash + query snapshot). Code → run: 'kode mana?' (commit hash; bukan 'kode di laptop Rian'). Run → version: 'run mana yang dipromosikan?' Approval → version: 'SIAPA menyetujui, kapan, atas dasar apa?' Version → deployment: 'kapan mulai live?' Kelengkapan lineage diukur dengan rumus di bawah — targetnya 1,0, bukan 'kira-kira'.",
        "Disiplin artefak: file model dinamai dengan content-hash (a1b2….pkl), BUKAN 'model_final_v2_FINAL.pkl' — nama yang bisa ditimpa adalah undangan bencana. Artefak besar di blob storage, metadata di tracker. Dan satu artefak yang sering dilupakan: MODEL CARD — satu halaman: tujuan, batasan ('tidak untuk usia di bawah 21'), hasil eval per segmen, risiko yang diketahui. Regulator semakin sering memintanya eksplisit.",
        "Disiplin promosi — melengkapi aturan τ di langkah sebelumnya. Siapa menetapkan τ? Pemilik model + risk, TERTULIS, bukan firasat engineer. Gerbang staging: eval offline lolos + shadow/canary tanpa anomali. Approval TERCATAT: siapa, kapan, mengapa (link ke run + eval). Dan yang paling sering hilang: RENCANA ROLLBACK ditulis SEBELUM promosi — 'jika metrik X turun di atas Y dalam Z jam, kembalikan alias ke v_lama'. Promosi tanpa rollback = terjun tanpa parasut cadangan.",
        "Siklus hidup penuh termasuk PENSIUN. Version yang dikalahkan → archived (tetap ada untuk audit/reproduce, tidak melayani). Kebijakan retensi: regulator keuangan umumnya menuntut 5+ tahun. Penghapusan butuh approval terpisah — 'bersih-bersih disk' yang menghapus v1 = menghancurkan bukti audit.",
        "Jejak audit: setiap perubahan state (register, promote, archive, delete) tercatat dengan aktor + timestamp + alasan. Pertanyaan 'siapa yang mempromosikan v2 ke production bulan lalu?' dijawab dalam 10 detik, bukan 10 hari. Inilah beda tracker mainan dan tracker produksi: yang kedua dirancang untuk ditanyai orang yang tidak percaya padamu.",
        "Empat anti-pattern yang membunuh: (1) tag 'latest' sebagai penanda produksi — berubah tanpa jejak, tidak reproducible; (2) scp manual file model ke server — lineage putus total; (3) registry sebagai tempat sampah file tanpa stage — 40 'kandidat' tanpa tahu mana yang live; (4) model tanpa pemilik — tidak ada yang bertanggung jawab atas τ dan rollback. Jika salah satunya ada di timmu, registry-mu pajangan.",
        "Data versioning yang pragmatis. DVC/lakeFS itu ideal, tetapi 90% tim cukup dengan: catat query SQL + timestamp snapshot + hash (row count + checksum kolom kunci). Untuk CSV: simpan file dengan nama ber-hash di blob storage. Yang penting BUKAN teknologinya, melainkan jawabannya bisa diverifikasi: 'data hash a1b2 = 1.204.551 baris per 1 Okt 2026'. Mulai dari hash hari ini; upgrade ke DVC saat tim di atas 5 orang.",
        "Model card — siapa menulis, kapan. Isi minimum: tujuan penggunaan, batasan eksplisit ('tidak untuk usia di bawah 21'), hasil eval per segmen (bukan cuma agregat), risiko yang diketahui. Ditulis oleh ENGINEER saat register (10 menit, saat konteks masih segar) — bukan oleh compliance saat audit (3 hari, sambil menebak). Jadikan field wajib di registry: tidak ada card = tidak bisa promote ke staging.",
        "Promosi multi-gerbang: dev → staging → production, dengan kriteria BERBEDA tiap gerbang. Dev: run reproducible (C_lineage = 1,0). Staging: eval offline lolos + model card lengkap + approval pemilik. Production: canary tanpa anomali + rencana rollback teruji. Alias ganda membantu: 'champion' untuk yang melayani, 'challenger' untuk kandidat canary — pola yang membuat perbandingan versi menjadi operasi rutin, bukan proyek.",
      ],
      formula: String.raw`C_{lineage} = \frac{|A_{tercatat}|}{|A_{wajib}|}, \quad A_{wajib} = \{\text{params, data, code, env, model, approval}\}`,
      formulaNote: "C = kelengkapan lineage (0–1); A_tercatat = artefak yang benar-benar tercatat untuk versi produksi; A_wajib = enam artefak minimum. Target = 1,0. Contoh: 5/6 = 0,83 — yang hilang (env) = risiko '0,91 tak terulang di torch baru'. Audit yang baik menanyakan yang HILANG, bukan yang ada.",
      tasks: [],
      note: {
        title: "⚠️ Jebakan",
        type: "pitfall",
        body: "Registry tanpa kriteria promosi = kuburan model. 40 versi 'production-candidate', tidak ada yang jelas mana yang live, τ tidak tertulis, approval via chat yang hilang. Stage + alias + τ tertulis + approval tercatat = bukan birokrasi, melainkan satu-satunya cara 10 orang tidak saling menimpa.",
      },
      reference: "Lineage = asuransi insiden: version immutable, alias yang bergerak, enam artefak wajib, approval + rollback tercatat SEBELUM promosi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: tool dan praktik apa?",
      prose: [
        "Skenario 1 — individu/eksperimen cepat → MLflow lokal (1 perintah) atau bahkan CSV. Mulai HARI INI, bukan 'nanti'.",
        "Skenario 2 — tim >3 orang → MLflow server / W&B team. Kolaborasi butuh tempat bersama.",
        "Skenario 3 — regulasi ketat (bank) → MLflow + registry + approval tercatat. Audit = buka run, bukan cari sticky note.",
        "Skenario 4 — tuning masif → W&B Sweeps / Optuna + MLflow. Tracking dan tuning terintegrasi.",
        "Skenario 5 — sudah produksi → registry wajib + monitoring drift (distribusi fitur dan prediksi dipantau berkala; anjlok = investigasi). Tracking tidak berhenti di deploy.",
        "Aturan praktis 10 detik: (1) lacak SEMUA run mulai sekarang. (2) pilih dari val + gap kecil. (3) registry untuk yang ke produksi. (4) biaya ikut dilacak.",
        "Skenario 6 — notebook chaos → MLflow autolog (1 baris: mlflow.sklearn.autolog()). Dari 0 ke 80% tracking dalam 1 menit. Mulai dari sini, sempurnakan nanti.",
        "Skenario 7 — kolaborasi async (tim tersebar) → W&B: komentar di run, share link dashboard. 'Lihat run ini' > 'coba reproduce di laptopmu'. Kolaborasi = artefak bersama, bukan screenshot.",
      ],
      tasks: [],
    },
    {
      id: "minicase-audit",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: audit OJK dan run #142",
      prose: [
        "Bank diaudit OJK: 'buktikan model skor kredit v2 dibuat dengan benar.' Tanpa tracking: 3 orang × 2 pekan mencari artefak (Rp60 juta biaya + risiko denda). Dengan MLflow: buka run #142 — params, data hash, code commit, metrik, approval — 1 jam. Audit lolos.",
        "Angka: 200 run/tahun × 5 menit overhead tracking = 17 jam/tahun ≈ Rp3,5 juta. Satu audit tanpa tracking = Rp60 juta + stres. ROI: 17x — dan itu baru SATU audit. Belum termasuk 'reproduce bug' (2 hari → 1 jam) dan 'bandingkan 50 eksperimen' (mustahil → 5 menit).",
        "Pembahasan: overhead 5 menit/run terasa 'mahal' saat eksperimen — tetapi murah dibanding 2 pekan panik. Manusia buruk menilai risiko jarang-terjadi; sistem yang baik tidak mengandalkan penilaian manusia.",
        "Cara membaca: hitung biaya tracking (kecil, pasti) vs biaya TANPA tracking (besar, probabilistik). Ekspektasi selalu menang untuk tracking.",
        "Interpretasi: tracking = asuransi termurah di ML. Premi 5 menit/run; klaim = audit, reproduce, debug.",
        "Template run card — 1 halaman. Nama | tujuan | params kunci | data hash | val/test | kesimpulan | next step. Tulis SEBELUM run berikutnya (5 menit). 200 run card = buku lab yang bisa dibaca manusia, bukan sekadar database.",
        "Retensi run — jangan simpan selamanya. Kebijakan: run produksi selamanya; run eksperimen 1 tahun; artefak besar (>1GB) 90 hari. Storage 10TB = Rp15 juta/bulan — retensi liar = tagihan liar. Kebijakan tertulis > niat baik.",
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
        "Lacak tiap run: params, metrics (train+val), data hash, code, artefak + env + biaya.",
        "Pilih model dari val tertinggi + gap kecil — train tertinggi sering = overfit.",
        "Registry: staging → production → archived; rollback 1 menit.",
        "Promosi bila Δmetrik > τ dan lolos staging; catat siapa menyetujui.",
        "MLflow (self-host) vs W&B (SaaS) — mulai dari yang paling mudah HARI INI.",
      ],
      next: { label: "MLE18 — ML Systems Design", href: "/v2/learn/mle18-ml-systems-design" },
      quiz: [
        {
          q: "Run A: train 0,99/val 0,77. Run B: train 0,90/val 0,88. Pilih?",
          options: [
            { text: "B — val tertinggi + gap kecil (0,02)", why: "Tepat: A overfit parah (gap 0,22); train tinggi = jebakan.", correct: true },
            { text: "A — train tertinggi", why: "Train 0,99 dengan val 0,77 = hafal, bukan belajar.", correct: false },
            { text: "Rata-rata keduanya", why: "Model tidak bisa dirata-rata begitu saja tanpa ensemble design.", correct: false },
            { text: "Yang tercepat training", why: "Kecepatan training bukan kriteria kualitas model — val_auc yang menentukan.", correct: false },
          ],
        },
        {
          q: "Audit menanyakan 'data apa yang dipakai model v2?' Jawaban dengan tracking?",
          options: [
            { text: "Hash dataset di run registry — 1 menit", why: "Tepat: data hash tercatat tiap run.", correct: true },
            { text: "Cari file final_v2_FINAL.csv", why: "Nama file bukan bukti — bisa diubah isinya.", correct: false },
            { text: "Tanya yang melatih (sudah resign)", why: "Itu masalahnya — pengetahuan di kepala, bukan sistem.", correct: false },
            { text: "Tidak bisa dibuktikan", why: "Bisa — dengan tracking yang benar.", correct: false },
          ],
        },
        {
          q: "Model terbaik langsung ke produksi tanpa staging. Risikonya?",
          options: [
            { text: "Bug 100% traffic — staging menangkapnya di 5%", why: "Tepat: staging = premi asuransi termurah.", correct: true },
            { text: "Tidak ada risiko jika val bagus", why: "Val ≠ produksi (drift, skala, integrasi).", correct: false },
            { text: "Hanya risiko kecil", why: "Insiden produksi = besar: reputasi + rollback panik.", correct: false },
            { text: "Staging memperlambat inovasi", why: "1 hari staging vs 1 pekan insiden — staging lebih cepat.", correct: false },
          ],
        },
        {
          q: "Apa yang dimaksud 'test terkunci' dalam konteks tracking?",
          options: [
            { text: "Test tidak dipakai tuning — sentuh sekali di akhir", why: "Tepat: menjaga vonis final jujur.", correct: true },
            { text: "Test dienkripsi", why: "Bukan soal enkripsi — soal disiplin pakai.", correct: false },
            { text: "Test tidak perlu ada", why: "Test final tetap perlu untuk laporan jujur.", correct: false },
            { text: "Test dipakai tiap trial", why: "Itu = overfitting ke test.", correct: false },
          ],
        },
        {
          q: "Tim 1 orang, eksperimen cepat. Saran tracking?",
          options: [
            { text: "MLflow lokal mulai hari ini — 5 menit/run", why: "Tepat: mulai kecil, konsisten. Nanti tinggal scale.", correct: true },
            { text: "Nanti saja kalau tim besar", why: "'Nanti' = 200 run tak terlacak saat dibutuhkan.", correct: false },
            { text: "Cukup ingat-ingat", why: "Ingatan 3 bulan lalu = sticky note hilang.", correct: false },
            { text: "Screenshot hasil", why: "Screenshot tidak reproducible — tidak ada params/data.", correct: false },
          ],
        },
        {
          q: "Model produksi degradasi 2% semalam. Dengan lineage lengkap, langkah pertama yang benar?",
          options: [
            { text: "Telusuri version produksi → run → data hash + code commit — bedakan masalah data vs model dalam hitungan menit", why: "Tepat: lineage memangkas tiga hari arkeologi menjadi 20 menit diagnosis.", correct: true },
            { text: "Langsung retrain dengan data terbaru", why: "Retrain buta tanpa diagnosis = menutupi akar masalah.", correct: false },
            { text: "Rollback ke versi sebelumnya tanpa investigasi", why: "Rollback boleh darurat, tetapi tanpa lineage kamu tidak tahu APA yang di-rollback.", correct: false },
            { text: "Naikkan threshold approval", why: "Tidak terkait — masalahnya diagnosis, bukan threshold.", correct: false },
          ],
        },
        {
          q: "Mengapa tag 'latest' sebagai penanda produksi adalah anti-pattern?",
          options: [
            { text: "'Latest' berubah tanpa jejak — tidak reproducible, tak bisa diaudit siapa-kapan-apa", why: "Tepat: audit butuh version immutable + alias tercatat; 'latest' = amnesia.", correct: true },
            { text: "Terlalu lambat", why: "Bukan soal kecepatan — soal ketertelusuran.", correct: false },
            { text: "Tidak didukung MLflow", why: "Didukung secara teknis; yang salah adalah praktiknya.", correct: false },
            { text: "Membingungkan pemula", why: "Masalahnya jauh lebih serius: bukti audit yang hilang.", correct: false },
          ],
        },
      ],
    },
  ],
};
