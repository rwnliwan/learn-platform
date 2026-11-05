import type { V2Lesson } from "../lib/types";

const MLOPS13_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Waktu menemukan kembali eksperimen terbaik: 940 menit tanpa tracking vs 5 menit dengan tracking."><text x="142" y="76.5" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Tanpa tracking</text><rect x="150" y="63.5" width="314.0" height="18" rx="3" fill="var(--c4)"/><text x="470.0" y="76.5" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">940 mnt (15,7 jam)</text><text x="142" y="161.5" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Dengan tracking</text><rect x="150" y="148.5" width="1.7" height="18" rx="3" fill="var(--c1)"/><text x="157.7" y="161.5" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">5 mnt</text></svg>`;

export const mlops13: V2Lesson = {
  slug: "mlops13-experiment-tracking",
  track: "MLOps",
  module: "Fondasi Operasi",
  title: "MLOps13 — Experiment Tracking & DVC",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model terbaik yang tidak bisa diulang",
      prose: [
        "April 2026. Dimas, ML engineer di KreditKu, menatap spreadsheet-nya dengan bangga: 47 eksperimen dalam 3 minggu, AUC terbaik 0,912 — calon pengganti champion yang stagnan di 0,905. Direksi menyetujui deploy. Lalu pertanyaan sederhana muncul: `eksperimen nomor berapa yang 0,912?` Dimas menggulir spreadsheet... baris 23 kosong (lupa diisi, `nanti dilengkapi`). Baris 31 tertulis `lr=0.05, batch=64` — tapi notebook-nya ada 3 versi file dengan nama `final_fix2.ipynb`, `final_fix2_beneran.ipynb`, `final_fix2_beneran_FINAL.ipynb`. Dan datanya? `train_v3.csv`... atau `train_v3_clean.csv`? Tidak ada yang tahu pasti.",
        "Twist-nya: dari 47 eksperimen, yang HILANG justru satu-satunya yang penting — yang terbaik. 46 eksperimen gagal terdokumentasi rapi (tidak ada yang peduli), 1 eksperimen sukses tidak terlacak (semua orang peduli). Dimas menghabiskan 2 minggu mencoba mereproduksi 0,912 — tidak pernah dapat. Hasil terbaik yang bisa diulang: 0,903, di BAWAH champion. Deploy dibatalkan. Tiga minggu kerja = nol.",
        "Masalahnya bukan Dimas malas mencatat. Masalahnya: mencatat MANUAL tidak berskala. Eksperimen ke-5 masih rajin; eksperimen ke-47 (`coba lr 0.03 jam 11 malam`) tidak. Solusinya bukan disiplin — melainkan SISTEM yang mencatat otomatis: setiap run menyimpan params, metrics, code version, dan data version TANPA diminta. Itulah experiment tracking. Dan untuk datanya: DVC.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa spreadsheet/notebook naming tidak bisa menggantikan experiment tracking; (2) merancang skema tracking (params, metrics, artifacts, data hash) untuk satu proyek; (3) menghitung penghematan storage DVC dari deduplikasi; (4) memilih antara MLflow, W&B, dan spreadsheet berdasarkan kebutuhan tim; (5) menghubungkan run tracking ke model registry (MLOps4).",
        "Daftar isi: 1) Cerita Dimas · 2) Run tracking: buku lab digital · 3) DVC: versioning data · 4) Lab: mini experiment tracker · 5) Biaya eksperimen yang hilang · 6) Peta keputusan: tool apa untuk siapa · 7) Mini-case: Rp18,7 juta yang menguap · 8) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Cukup catat di spreadsheet, yang penting disiplin`",
        type: "pitfall",
        body: "Disiplin mencatat manual bertahan sampai eksperimen ke-5. Eksperimen ke-47 selalu `nanti dilengkapi`. Sistem yang baik tidak bergantung pada disiplin manusia — ia mencatat otomatis setiap run. Spreadsheet = buku lab yang halamannya bisa sobek; tracking = buku lab yang menulis sendiri.",
      },
      reference: "Yang hilang selalu yang terbaik. Tracking otomatis > disiplin manual.",
    },
    {
      id: "run-tracking",
      eyebrow: "Langkah 2 · Konsep",
      title: "Run tracking: buku lab yang menulis sendiri",
      prose: [
        "Setiap eksperimen (RUN) terdiri dari EMPAT hal yang wajib tercatat: (1) PARAMS — hyperparameter (lr, batch, depth) + konfigurasi; (2) METRICS — hasil (AUC, loss) per epoch/checkpoint; (3) ARTIFACTS — model tersimpan, plot, confusion matrix; (4) CODE+DATA VERSION — commit hash + data hash (DVC). Empat ini = `sidik jari` eksperimen. Tanpa SATU saja, run tidak bisa direproduksi — seperti resep tanpa takaran tepung.",
        "Cara kerja MLflow (open-source, self-host): di awal script, `mlflow.start_run()`; tiap hyperparameter `mlflow.log_param(`lr`, 0.05)`; tiap metrik `mlflow.log_metric(`auc`, 0.912)`; akhir `mlflow.log_artifact(`model.pkl`)`. Empat baris kode = run tercatat selamanya dengan ID unik, timestamp, dan bisa di-query (`tampilkan semua run dengan auc > 0.90, urutkan`). Dimas yang memakai ini: `best_run = query(auc max)` → r5 → `reproduce(r5)` → params + data_hash + code commit — 5 menit, bukan 2 minggu.",
        "W&B (Weights & Biases, hosted) menambah: grafik real-time (loss curve live saat training!), kolaborasi (tim melihat run satu sama lain), dan `sweep` (hyperparameter search otomatis dengan tracking bawaan). Harganya: data eksperimenmu ada di server mereka (pertimbangkan untuk data sensitif perbankan!) + biaya langganan tim. MLflow: gratis, datamu di servermu, tapi kamu yang mengurus server + tidak ada sweep semewah W&B. Tidak ada yang selalu menang — ada yang cocok untuk konteksmu (lihat peta keputusan).",
        "Hubungan ke registry (MLOps4): tracking menjawab `eksperimen mana yang terbaik?`, registry menjawab `model mana yang live?`. Alurnya: 47 run di tracking → 1 run terbaik → daftarkan ke REGISTRY sebagai v2.4-staging → gerbang promosi → production. Tanpa tracking, registry diisi dari `feeling` (`kayaknya yang ini bagus`). Tanpa registry, tracking terbaik pun tidak bisa deploy dengan aman. Keduanya adalah rantai yang sama: tracking = hulu (eksperimen), registry = hilir (produksi).",
        "Yang sering dilupakan: track juga yang GAGAL. Run dengan AUC 0,71 (`lr terlalu besar, divergen`) SAMA BERHARGANYA dengan yang 0,912 — ia mencegah orang berikutnya mencoba lr yang sama. Tim tanpa tracking mengulangi kegagalan yang sama 3x (3 engineer, 3 bulan berbeda). Dengan tracking: query `lr > 0.08` → semua divergen — 5 detik, bukan 3 bulan. Kegagalan yang tercatat = pengetahuan; yang tidak = biaya berulang.",
        "Aturan praktis 10 detik: sebelum menjalankan eksperimen APAPUN (termasuk `coba-coba 5 menit`), pastikan 4 baris tracking aktif. Biaya: 30 detik setup sekali. Manfaat: tidak pernah lagi kehilangan `yang terbaik`. Dimas versi baru: 47 run, best = r5, reproduce 5 menit, deploy tepat waktu. Bedanya bukan skill — melainkan 4 baris kode.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: tracking = asuransi untuk keberuntungan",
        body: "Eksperimen terbaik sering datang dari `coba-coba jam 11 malam` — keberuntungan yang tidak direncanakan. Tanpa tracking, keberuntungan = tidak bisa diulang = tidak ada nilainya. Dengan tracking, setiap keberuntungan otomatis terdokumentasi. Tracking bukan untuk yang disiplin; ia untuk menangkap keberuntungan.",
      },
      reference: "4 hal per run: params, metrics, artifacts, code+data version. Track yang gagal juga.",
    },
    {
      id: "dvc",
      eyebrow: "Langkah 3 · Konsep",
      title: "DVC: versioning untuk data (git tidak cukup)",
      prose: [
        "Git menolak file besar (`train.csv` 8GB tidak bisa di-push). Solusi lama: `train_v3.csv`, `train_v3_clean.csv`, `train_v3_clean_FINAL.csv` — kekacauan Dimas. DVC (Data Version Control) menyelesaikan dengan elegan: file besar disimpan di STORAGE terpisah (S3/lokal), git hanya menyimpan FILE KECIL berisi hash (`train.csv.dvc` → `md5: a1b2c3...`). `git checkout` + `dvc pull` = data versi yang tepat untuk commit itu. Data berversion seperti kode — tanpa membebani git.",
        "Cara kerja 1 menit: `dvc init` → `dvc add train.csv` (membuat `train.csv.dvc` berisi hash) → `git add train.csv.dvc` + commit. Kolega: `git pull` + `dvc pull` = dapat data yang PERSIS sama (hash diverifikasi!). Ubah data → hash berubah → DVC tahu. Inilah `data_hash: a1b2` di lab lesson ini — sidik jari data yang membuat run bisa direproduksi.",
        "Matematika penghematan (deduplikasi): 47 eksperimen × data 8GB = 376GB jika tiap eksperimen menyimpan salinan. Tapi 40 eksperimen memakai data IDENTIK (hash sama!) — DVC menyimpan SATU salinan + 47 pointer kecil. Storage = 8GB × (varian unik: 3) = 24GB, bukan 376GB. Hemat 94%! Rumusnya: storage_dvc = Σ ukuran blob UNIK. Makin banyak eksperimen berbagi data (pola umum!), makin besar hematnya.",
        "Contoh biaya nyata: S3 376GB × Rp300/GB/bulan = Rp113rb/bulan vs 24GB = Rp7.200/bulan. Kecil? Kalikan 10 proyek × 12 bulan × 5 tahun data menumpuk tanpa dedup = Rp68 juta vs Rp4,3 juta. Dan ini BELUM termasuk biaya TERBESAR: waktu engineer mencari `data yang mana?` (lihat langkah 5). DVC murah dalam uang; MAHAL harganya jika tidak dipakai (dalam waktu).",
        "DVC juga mem-versioning PIPELINE (`dvc.yaml`): `data mentah → clean.py → train.csv → train.py → model.pkl`. Ubah `clean.py` → `dvc repro` menjalankan ulang HANYA tahap yang terdampak (seperti make!). Tanpa ini: `saya ubah sedikit cleaning, harus run ulang semua?` = tebak-tebakan. Dengan ini: DVC tahu persis. Pipeline yang reproducible = pipeline yang berani diubah.",
        "Jebakan DVC: (1) lupa `dvc push` — hash ter-commit di git tapi file tidak ada di storage = kolega `dvc pull` gagal (solusi: CI check `dvc status`); (2) data sensitif di storage publik — DVC tidak mengenkripsi otomatis! (solusi: storage privat + enkripsi); (3) `.dvc` tidak di-commit (`git add` lupa) = versioning ilusi. Tiga jebakan, tiga solusi satu baris. Murah.",
      ],
      formula: String.raw`S_{dvc} = \sum \text{ukuran blob unik} \ll n \times \text{ukuran data}`,
      formulaNote: "S_dvc = storage dengan DVC (hanya blob unik yang disimpan); n = jumlah eksperimen; ukuran data = per eksperimen. Jika 40 dari 47 eksperimen berbagi data identik: 24GB, bukan 376GB (hemat 94%). Makin banyak berbagi, makin hemat.",
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Data tidak perlu di-version, yang penting kodenya`",
        type: "pitfall",
        body: "Model = kode + data + params. Versioning kode saja = resep tanpa memastikan tepungnya sama. `train_v3_clean_FINAL.csv` bukan versioning — itu arkeologi. DVC: 1 menit setup, hash otomatis, `dvc pull` = data yang persis sama. Yang benar: versioning ketiganya, atau tidak ada yang bisa direproduksi.",
      },
      reference: "Git untuk kode, DVC untuk data. Hash = sidik jari. `dvc repro` = make untuk ML.",
    },
    {
      id: "lab-tracking",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: mini experiment tracker",
      prose: [
        "Kita replika inti MLflow dalam 20 baris: database 8 run (params + metrics + data_hash). Tugasmu: implementasikan `best_run` (cari AUC tertinggi), `reproduce` (kembalikan params + data_hash untuk reproduksi), dan `count_by_data` (hitung run per versi data).",
        "Cara membaca output: tiga baris = (1) run terbaik, (2) resep reproduksinya, (3) distribusi versi data. Interpretasi: jika `best_run` memakai data_hash minoritas (cuma 1 run!) — waspadalah: kemenangannya mungkin karena DATA berbeda, bukan params lebih baik (bandingkan apel vs apel!).",
        "Coba eksplorasi: ubah metrik ke yang lain, atau cari run terbaik KEDUA. Pertanyaan: run r5 vs r7 (keduanya 0,912!) — mana yang dipilih? (Jawaban: r5, data_hash mayoritas `a1b2` = 6 run vs r7 `e5f6` = 1 run. Kemenangan di data yang lebih umum = lebih bisa dipercaya.)",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `best_run(metric)` — kembalikan id dengan metrik tertinggi" },
        { id: "t2", text: "Implementasikan `reproduce(run_id)` — kembalikan params + data_hash" },
        { id: "t3", text: "Implementasikan `count_by_data()` — hitung run per data_hash, lalu jalankan" },
      ],
      expected: "best_run: r5 · reproduce r5: lr=0.05, batch=64 · count_by_data: a1b2=6",
      note: {
        title: "💡 Intuisi: tie-break by data",
        body: "r5 dan r7 SAMA-SAMA 0,912. Pemenangnya bukan yang `duluan` — melainkan yang datanya lebih umum (a1b2: 6 run vs e5f6: 1 run). Kemenangan di data mayoritas = bukti lebih kuat. Tracker yang baik tidak hanya menjawab `mana terbaik?` tapi `apakah perbandingannya adil?`.",
      },
      hints: [
        "best_run: max(runs_db, key=lambda r: r[`metrics`][metric])[`id`].",
        "reproduce: cari dengan next(x for x in runs_db if x[`id`] == run_id), kembalikan params + data_hash.",
        "count_by_data: collections.Counter(r[`data_hash`] for r in runs_db).",
      ],
      code: {
        starter: `runs_db = [\n    {\"id\": \"r1\", \"params\": {\"lr\": 0.01, \"batch\": 32, \"depth\": 6}, \"metrics\": {\"auc\": 0.871}, \"data_hash\": \"a1b2\"},\n    {\"id\": \"r2\", \"params\": {\"lr\": 0.05, \"batch\": 32, \"depth\": 6}, \"metrics\": {\"auc\": 0.893}, \"data_hash\": \"a1b2\"},\n    {\"id\": \"r3\", \"params\": {\"lr\": 0.05, \"batch\": 64, \"depth\": 8}, \"metrics\": {\"auc\": 0.901}, \"data_hash\": \"a1b2\"},\n    {\"id\": \"r4\", \"params\": {\"lr\": 0.10, \"batch\": 64, \"depth\": 8}, \"metrics\": {\"auc\": 0.884}, \"data_hash\": \"c3d4\"},\n    {\"id\": \"r5\", \"params\": {\"lr\": 0.05, \"batch\": 64, \"depth\": 10}, \"metrics\": {\"auc\": 0.912}, \"data_hash\": \"a1b2\"},\n    {\"id\": \"r6\", \"params\": {\"lr\": 0.03, \"batch\": 128, \"depth\": 10}, \"metrics\": {\"auc\": 0.908}, \"data_hash\": \"a1b2\"},\n    {\"id\": \"r7\", \"params\": {\"lr\": 0.05, \"batch\": 64, \"depth\": 10}, \"metrics\": {\"auc\": 0.912}, \"data_hash\": \"e5f6\"},\n    {\"id\": \"r8\", \"params\": {\"lr\": 0.02, \"batch\": 64, \"depth\": 12}, \"metrics\": {\"auc\": 0.895}, \"data_hash\": \"a1b2\"},\n]\n\n# TULIS KODEMU\ndef best_run(metric=\"auc\"):\n    \n\ndef reproduce(run_id):\n    \n\ndef count_by_data():\n    \n\nprint(\"best_run:\", best_run())\nprint(\"reproduce r5:\", reproduce(\"r5\"))\nprint(\"count_by_data:\", count_by_data())\nprint(\"n_runs:\", len(runs_db))`,
        lockLines: 12,
        solution: `runs_db = [\n    {\"id\": \"r1\", \"params\": {\"lr\": 0.01, \"batch\": 32, \"depth\": 6}, \"metrics\": {\"auc\": 0.871}, \"data_hash\": \"a1b2\"},\n    {\"id\": \"r2\", \"params\": {\"lr\": 0.05, \"batch\": 32, \"depth\": 6}, \"metrics\": {\"auc\": 0.893}, \"data_hash\": \"a1b2\"},\n    {\"id\": \"r3\", \"params\": {\"lr\": 0.05, \"batch\": 64, \"depth\": 8}, \"metrics\": {\"auc\": 0.901}, \"data_hash\": \"a1b2\"},\n    {\"id\": \"r4\", \"params\": {\"lr\": 0.10, \"batch\": 64, \"depth\": 8}, \"metrics\": {\"auc\": 0.884}, \"data_hash\": \"c3d4\"},\n    {\"id\": \"r5\", \"params\": {\"lr\": 0.05, \"batch\": 64, \"depth\": 10}, \"metrics\": {\"auc\": 0.912}, \"data_hash\": \"a1b2\"},\n    {\"id\": \"r6\", \"params\": {\"lr\": 0.03, \"batch\": 128, \"depth\": 10}, \"metrics\": {\"auc\": 0.908}, \"data_hash\": \"a1b2\"},\n    {\"id\": \"r7\", \"params\": {\"lr\": 0.05, \"batch\": 64, \"depth\": 10}, \"metrics\": {\"auc\": 0.912}, \"data_hash\": \"e5f6\"},\n    {\"id\": \"r8\", \"params\": {\"lr\": 0.02, \"batch\": 64, \"depth\": 12}, \"metrics\": {\"auc\": 0.895}, \"data_hash\": \"a1b2\"},\n]\n\n# TULIS KODEMU\ndef best_run(metric=\"auc\"):\n    return max(runs_db, key=lambda r: r[\"metrics\"][metric])[\"id\"]\n\ndef reproduce(run_id):\n    r = next(x for x in runs_db if x[\"id\"] == run_id)\n    return {\"params\": r[\"params\"], \"data_hash\": r[\"data_hash\"]}\n\ndef count_by_data():\n    from collections import Counter\n    return dict(Counter(r[\"data_hash\"] for r in runs_db))\n\nprint(\"best_run:\", best_run())\nprint(\"reproduce r5:\", reproduce(\"r5\"))\nprint(\"count_by_data:\", count_by_data())\nprint(\"n_runs:\", len(runs_db))`,
        checks: [
          { kind: "defined", task: "t1", label: "`best_run()` terdefinisi", msg: "Implementasikan fungsi best_run(metric).", name: "best_run" },
          { kind: "stdout_matches", task: "t3", label: "best_run: r5", msg: "Output harus menunjukkan best_run: r5.", pattern: "best_run: r5" },
          { kind: "stdout_matches", task: "t3", label: "a1b2 = 6 run", msg: "count_by_data harus menunjukkan a1b2: 6.", pattern: "'a1b2': 6" },
          { kind: "stdout_matches", task: "t3", label: "n_runs: 8", msg: "Total 8 run di database.", pattern: "n_runs: 8" },
        ],
      },
      reference: "max() dengan key = inti query tracking. Tie-break: pilih data mayoritas.",
    },
    {
      id: "biaya-hilang",
      eyebrow: "Langkah 5 · Pendalaman",
      title: "Biaya eksperimen yang hilang: 15,7 jam vs 5 menit",
      prose: [
        "Hitung biaya Dimas TANPA tracking: 47 eksperimen × 20 menit mencari (`notebook yang mana? data yang mana?`) = 940 menit = 15,7 jam. Gaji Dimas Rp150rb/jam → Rp2,36 juta. Plus 2 minggu reproduksi gagal (80 jam × Rp150rb = Rp12 juta). Plus deploy tertunda 1 bulan (model 0,912 vs 0,903: selisih 0,009 AUC × 10.000 keputusan/hari × Rp150rb × 0,5% ≈ Rp4,3 juta). Total: Rp18,7 juta. DENGAN tracking (MLflow, 4 baris kode, 30 detik setup): 47 run tercatat otomatis; best_run query 5 menit; reproduce 5 menit. Biaya: Rp25rb (10 menit). Rasio: 748:1.",
        "Rumus kasarnya: T_cari = n_eksperimen × t_cari. Tanpa tracking, t_cari ≈ 20 menit dan TUMBUH (makin banyak eksperimen, makin sulit). Dengan tracking, t_cari ≈ 0 (query). Break-even: jika kamu menjalankan > 3 eksperimen per proyek, tracking SELALU layak. Tiga! Bukan tiga ratus. Alasan `proyek kecil, tidak butuh tracking` = alasan yang salah secara matematis untuk hampir semua proyek.",
        "Biaya TERSEMBUNYI yang lebih besar: keputusan berdasarkan `feeling`. Tanpa tracking, `model terbaik` dipilih dari ingatan (`kayaknya yang lr 0.05 bagus`) — dan ingatan salah 30% waktu (r5 vs r7: ingatan bilang r7, data bilang r5 lebih terpercaya!). Model yang `terasa terbaik` tapi sebenarnya kedua terbaik = deploy suboptimal permanen. Kerugian: selisih AUC × volume × waktu live. Untuk model KreditKu: 0,003 AUC × 2 tahun = Rp50+ juta. Tracking bukan cuma hemat waktu — ia mencegah keputusan salah yang mahal.",
        "Skala tim: 5 engineer × 47 eksperimen = 235 run/bulan. Tanpa tracking: 235 × 20 menit = 78 jam/bulan = 0,5 FTE HANYA untuk mencari! Dengan tracking: ~0. Setengah karyawan yang digaji untuk menjadi `pustakawan eksperimen` vs nol. Inilah mengapa JD mensyaratkan MLflow (gap analysis!): perusahaan membayar mahal untuk kekacauan yang sebenarnya gratis dicegah.",
      ],
      formula: String.raw`T_{cari} = n \times t_{cari} \quad ; \quad \text{tanpa tracking: } t_{cari} \approx 20 \text{ mnt (tumbuh)}`,
      formulaNote: "T_cari = total waktu mencari eksperimen; n = jumlah eksperimen; t_cari = waktu per pencarian. Tanpa tracking t_cari tumbuh dengan n (makin banyak, makin sulit); dengan tracking t_cari ≈ 0 (query). Break-even: n > 3.",
      figure: {
        svg: MLOPS13_SVG,
        alt: "Diagram batang: 940 menit tanpa tracking vs 5 menit dengan tracking.",
        caption: "Cara membaca: tinggi batang = waktu menemukan kembali eksperimen terbaik dari 47 run (menit). Interpretasi: 940 menit (15,7 jam) vs 5 menit = rasio 188:1. Dan 940 menit BELUM termasuk 2 minggu reproduksi gagal (Rp12 juta). 4 baris kode tracking = premi termurah di MLOps.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: break-even di 3 eksperimen",
        body: "Bukan 300, bukan 30 — TIGA. Jika proyekmu punya > 3 eksperimen (hampir semua!), tracking sudah layak secara matematis. `Proyek kecil` bukan alasan; ia justru alasan TERBAIK (setup 30 detik, manfaat selamanya). Yang mahal bukan tracking-nya — melainkan keyakinan bahwa kamu akan ingat semuanya.",
      },
      reference: "T_cari tumbuh tanpa tracking. Keputusan dari ingatan salah 30% waktu.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "MLflow, W&B, atau spreadsheet?",
      prose: [
        "**Skenario 1 — Solo/2 orang, data tidak sensitif, budget nol.** → MLflow lokal (1 perintah `mlflow ui`). 30 detik setup, gratis, cukup. Jangan W&B (overkill + data di cloud).",
        "**Skenario 2 — Tim 5+, butuh kolaborasi + sweep otomatis.** → W&B. Grafik real-time + perbandingan antar engineer + hyperparameter sweep bawaan. Bayar langganannya dari penghematan 0,5 FTE.",
        "**Skenario 3 — Bank/fintech, data sensitif (UU PDP).** → MLflow self-hosted di VPC sendiri. W&B hanya jika enterprise tier dengan data residency jelas. Jangan versi cloud publik untuk data nasabah.",
        "**Skenario 4 — Eksperimen < 3, proyek sekali pakai.** → Spreadsheet BOLEH (satu-satunya kasus!). Tapi tetap: 4 kolom wajib (params, metrics, code commit, data hash). Jika tumbuh > 3 → migrasi ke MLflow HARI ITU JUGA.",
        "Aturan praktis 10 detik: `data sensitif?` → MLflow self-host. `Tim besar + butuh sweep?` → W&B. `Selain itu` → MLflow lokal. `Semua jawaban tidak` (proyek sekali pakai) → spreadsheet dengan 4 kolom. Tidak ada skenario di mana `tidak mencatat sama sekali` adalah jawaban.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: pilih yang paling mungkin DIPAKAI",
        body: "Tool tracking terbaik = yang tim benar-benar pakai. MLflow canggih yang tidak di-setup = kalah dari spreadsheet yang diisi. Mulai dari yang termudah (MLflow lokal, 30 detik), naik kelas saat butuh. Adopsi > kecanggihan.",
      },
      reference: "Sensitif → self-host. Kolaborasi+sweep → W&B. Default → MLflow lokal.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Rp18,7 juta yang menguap",
      prose: [
        "Audit 3 bulan tim Dimas (5 engineer, tanpa tracking): 235 run/bulan × 20 menit cari = 78 jam/bulan × Rp150rb = Rp11,7 juta/bulan WAKTU TERBUANG. Satu insiden `model terbaik hilang` per kuartal: 80 jam reproduksi (Rp12 juta) + deploy tertunda (Rp4,3 juta). Total kuartal: Rp35,1jt + Rp16,3jt = Rp51,4 juta/kuartal = Rp205,6 juta/tahun.",
        "Biaya solusi: setup MLflow 1 hari (Rp1,2 juta) + training tim 2 jam (Rp1,5 juta) + server Rp500rb/bulan = Rp8,7 juta/tahun. ROI: 205,6/8,7 = 23,6x. Payback: 15 hari.",
        "**Pertanyaan:** (1) Komponen biaya mana yang terbesar — dan mengapa ia tidak terlihat di laporan? (2) Mengapa `disiplin mencatat` bukan solusi? (3) Hitung break-even untuk tim 2 orang dengan 20 run/bulan.",
        "**Pembahasan:** (1) Waktu mencari (Rp11,7jt/bulan) — tidak terlihat karena tersebar sebagai `15 menit di sana-sini`, tidak pernah muncul sebagai line item. Biaya tersebar = biaya tak terlihat = biaya tak diperbaiki. (2) Disiplin gagal di eksperimen ke-47 (kelelahan); sistem otomatis tidak lelah. (3) 20 × 20 mnt = 6,7 jam × Rp150rb = Rp1 juta/bulan vs setup Rp2,7jt sekali + Rp500rb/bulan → break-even bulan ke-4. Tetap layak!",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dalam risk reporting, biaya tersebar yang tak terlihat (15 menit di sana-sini) adalah kategori paling berbahaya — ia tidak pernah masuk laporan sehingga tidak pernah diperbaiki. Selalu agregatkan: 20 menit × 235 = 78 jam. Angka agregat mengubah `sepele` menjadi `Rp11,7 juta/bulan`.",
      },
      reference: "Rp205,6 jt/tahun vs Rp8,7 jt/tahun. ROI 23,6x. Biaya tersebar = tak terlihat = tak diperbaiki.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Dimas kehilangan eksperimen terbaik (0,912) dari 47 run. Akar masalahnya?",
          options: [
            { text: "Dimas kurang disiplin mencatat", why: "Disiplin manual gagal di eksperimen ke-47 (kelelahan). Akar masalahnya SISTEM: tidak ada pencatatan otomatis. Menyalahkan orang = memperbaiki gejala." },
            { text: "Tidak ada experiment tracking otomatis; pencatatan manual tidak berskala", why: "Tepat. 4 baris MLflow (30 detik) akan menyimpan params+metrics+code+data_hash otomatis untuk SEMUA run termasuk `coba-coba jam 11 malam`.", correct: true },
            { text: "47 eksperimen terlalu banyak", why: "47 eksperimen = normal untuk tuning. Yang tidak normal: tidak ada sistem untuk mengelolanya." },
            { text: "AUC 0,912 terlalu tinggi sehingga mencurigakan", why: "0,912 valid (r5/r7 konsisten). Masalahnya bukan angkanya, melainkan tidak bisa mereproduksinya." },
          ],
        },
        {
          q: "Empat hal yang wajib tercatat per run?",
          options: [
            { text: "Params, metrics, artifacts, code+data version", why: "Tepat. Keempatnya = sidik jari eksperimen. Tanpa satu pun (mis. data_hash), run tidak reproducible.", correct: true },
            { text: "Params dan metrics saja cukup", why: "Tanpa code+data version: `params sama, hasil beda` = misteri. Tanpa artifacts: tidak ada yang bisa di-deploy." },
            { text: "Yang penting model.pkl-nya tersimpan", why: "model.pkl tanpa params/data = artefak tanpa resep. Tidak bisa diperbaiki, tidak bisa dijelaskan ke auditor." },
            { text: "Screenshot grafik loss", why: "Screenshot tidak bisa di-query (`tampilkan run dengan auc > 0.90`) dan tidak menyimpan params. Cantik tapi tidak berguna." },
          ],
        },
        {
          q: "40 dari 47 eksperimen memakai data identik 8GB. Storage tanpa vs dengan DVC?",
          options: [
            { text: "376GB vs 376GB — DVC tidak menghemat storage", why: "Salah: DVC menyimpan SATU salinan per blob unik + pointer. 3 varian unik × 8GB = 24GB." },
            { text: "376GB vs 24GB (hemat 94%) karena deduplikasi blob unik", why: "Tepat. S_dvc = Σ blob unik. Makin banyak eksperimen berbagi data, makin besar hematnya.", correct: true },
            { text: "376GB vs 0GB — DVC menghapus data", why: "DVC tidak menghapus; ia mendeduplikasi. Data tetap ada (24GB), hanya tidak diduplikasi 47x." },
            { text: "Tidak bisa dihitung tanpa tahu isi data", why: "Bisa: yang dihitung blob UNIK by hash, bukan isi. Hash sama = blob sama = satu salinan." },
          ],
        },
        {
          q: "r5 dan r7 sama-sama AUC 0,912. r5 data_hash `a1b2` (6 run), r7 `e5f6` (1 run). Pilih?",
          options: [
            { text: "r7 — yang terakhir biasanya paling baru", why: "`Terakhir` ≠ `terbaik`. Urutan run tidak berkorelasi dengan kualitas." },
            { text: "r5 — kemenangan di data mayoritas lebih terpercaya", why: "Tepat. 6 run di a1b2 = bukti lebih kuat dari 1 run di e5f6. Bandingkan apel vs apel.", correct: true },
            { text: "Acak saja — sama saja 0,912", why: "Tidak sama: r7 mungkin menang karena DATA berbeda (lebih mudah), bukan params lebih baik. Acak = mengabaikan informasi." },
            { text: "Rata-ratakan params keduanya", why: "Merata-ratakan hyperparameter tidak bermakna (lr 0,05 & 0,05 = 0,05, tapi depth 10 & 10... untuk kasus beda params bisa menghasilkan konfigurasi yang tidak pernah diuji)." },
          ],
        },
        {
          q: "Bank dengan data nasabah sensitif (UU PDP). Pilihan tracking TEPAT?",
          options: [
            { text: "W&B cloud publik — paling canggih", why: "Data eksperimen (bisa mengandung info sensitif) di server pihak ketiga = risiko kepatuhan UU PDP. Kecanggihan tidak mengalahkan regulasi." },
            { text: "MLflow self-hosted di VPC sendiri", why: "Tepat. Gratis + data tetap di infrastruktur sendiri + memenuhi data residency. W&B hanya jika enterprise tier dengan jaminan residency.", correct: true },
            { text: "Spreadsheet bersama — sederhana", why: "Spreadsheet tidak berskala (lihat Dimas) DAN tidak aman untuk data sensitif (akses tak terkontrol)." },
            { text: "Tidak usah tracking — bank tidak butuh eksperimen", why: "Bank justru paling butuh (audit!): regulator bisa bertanya `model ini dari eksperimen mana, data apa?` setiap saat." },
          ],
        },
        {
          q: "Tim 2 orang, 20 run/bulan, mengklaim `terlalu kecil untuk tracking`. Tanggapan TEPAT?",
          options: [
            { text: "Benar — tracking untuk tim besar saja", why: "Hitungan: 20 × 20 mnt = Rp1jt/bulan terbuang vs setup Rp2,7jt + Rp500rb/bulan → break-even bulan ke-4. Tetap layak!" },
            { text: "Tetap pasang: break-even 3 eksperimen; bulan ke-4 sudah balik modal", why: "Tepat. `Terlalu kecil` adalah ilusi — 20 run/bulan = 240/tahun, dan satu `model terbaik hilang` = Rp16,3 juta. Asuransi Rp500rb/bulan.", correct: true },
            { text: "Tunggu sampai 100 run/bulan baru pasang", why: "Menunggu = menabung kerugian Rp1jt/bulan + risiko insiden. Break-even tidak butuh 100." },
            { text: "Satu orang saja yang tracking, satunya tidak perlu", why: "Setengah tracking = setengah kekacauan. Run yang tidak ter-track = run yang akan hilang saat dibutuhkan." },
          ],
        },
      ],
      summary: [
        "Empat hal wajib per run: params, metrics, artifacts, code+data version — tanpa satu pun, tidak reproducible.",
        "MLflow (self-host, gratis) vs W&B (hosted, kolaborasi+sweep) — pilih by sensitivitas data dan ukuran tim.",
        "DVC: git untuk kode, DVC untuk data; hash = sidik jari; dedup hemat 94% storage.",
        "Break-even tracking: > 3 eksperimen. Biaya tanpa tracking: Rp205,6 jt/tahun untuk tim 5 orang.",
        "Tracking → registry: hulu (eksperimen) ke hilir (produksi). Track yang gagal juga.",
        "Tie-break: kemenangan di data mayoritas lebih terpercaya dari di data minoritas.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};
