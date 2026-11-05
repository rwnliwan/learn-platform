# LAPORAN C9 FINAL — Sapu Bersih (Gelombang C Penutup, 2026-10-16)

**Status: SELESAI & terverifikasi independen (koordinator). Tidak ada deploy.**

Gelombang C9 = 28 lesson terakhir yang di bawah standar, tersebar di 8 track. Model kerja: 5 worker paralel dengan partisi file saling lepas (W1: b18/b19/b20 + aai13/14/15; W2: aie13/15 + mle15–19; W3: dle13/14 + de18–21; W4: dba15–18; W5: wqb6–10). Masing-masing lesson di ujung atas track-nya → diperlakukan sebagai penguatan frontier advanced.

## 0. Angka final (verifikasi koordinator: re-bundle registry + /tmp/audit_depth_20261016.mjs + tsc)

| Metrik | Sebelum C9 | Sesudah C9 |
|---|---|---|
| Lesson <45 mnt platform (607) | 28 | **0** (target) |
| Lesson C9 ≥48 mnt model | — | **28/28** (min 49,7; max 58,7) |
| Lesson C9 tanpa komponen hilang | 28 | **28** |
| Lesson C9 dengan note Intuisi | 17/28 | **28/28** |
| `npx tsc --noEmit` | — | **0 error** |
| Scan F1 (5 frasa terlarang, koordinator, 28 file) | — | **0 temuan** |
| Scan F2 koordinator (28 file): "lihat lesson" | — | 0 hit |
| Scan F2 koordinator: kode slug lesson lain | — | hanya false positive: `(a1b2….pkl)` content-hash placeholder di mle17:174; notasi bounding-box `b0/b1/b2` di lab Python dle13 |

- **Program Gelombang C keseluruhan: 256 lesson <45 → 0/607.** Seluruh 25 track kini 0 di bawah 45 (rata-rata track terendah: Data Management 45,6; tertinggi: Probabilitas 64,5).
- estMinutes diperbarui ke kelipatan 5 mengikuti model akhir (cek via audit; kelipatan-5 non-standar di luar scope dibiarkan sebagai pre-existing).

## 1. Rincian per file

### W1 — Probabilitas (b18/b19/b20: 44,3/43,7/43,5 → 58,7/57,8/57,6; est 60)
- b18: note "Intuisi: lima heuristik laju untuk praktisi kedatangan" (164 kata) + langkah NHPP/thinning/superposisi/simulasi Lewis–Shedler/jebakan estimasi laju non-stasioner + formula thinning + formulaNote + 3 quiz.
- b19: note "Intuisi: membaca sampler seperti mekanik membaca mesin" + langkah ESS (contoh 20.000→1.053)/R-hat/trace-density/warmup/divergensi HMC/acceptance 0,234 + formula ESS + formulaNote + 3 quiz.
- b20: note "Intuisi: lima kebiasaan decoder rezim yang berpengalaman" + langkah forward-backward/Baum-Welch/label switching/Viterbi-vs-smoothing/decoding rezim pasar 250 hari/kegagalan HMM→HSMM + formula γ_t(i) + formulaNote + 3 quiz.
### W1 — Agentic AI Engineer (aai13/14/15: 39,2/39,1/38,9 → 52,7/52,5/52,4; est 55/55/50)
- aai13: langkah MCP produksi — lifecycle 5 tahap, semver+sunset, OAuth scopes per zona, sandboxing, observabilitas RED, prompt injection via deskripsi tool + 4 mitigasi, 4 pola kegagalan nyata + formula error budget + 3 quiz.
- aai14: langkah budget konteks lanjutan — statis vs dinamis, hybrid dense+BM25+RRF + angka recall, context rot/lost-in-the-middle, 4 metrik evaluasi, kurva U terbalik recall-vs-noise + formula utilitas + 3 quiz.
- aai15: langkah evals jujur — golden set 3 lapis+frozen, 4 bias LLM-judge, guardrails 4 lapis+kill switch, red-team+ASR, canary+rollback otomatis, budget latensi/biaya + formula CI + 3 quiz.

### W2 — AI Engineering (aie13/aie15: 39,1/44,6 → 50,0/55,3; est 50/55)
- aie13: langkah "Fusi berbobot, distilasi, kapan RRF gagal" (747 kata: fusi α + normalisasi per-query, LambdaMART, distilasi cross→bi-encoder, nDCG vs MRR vs recall, 3 failure mode drift, anggaran latensi-biaya) + formula nDCG@k + formulaNote + 2 quiz.
- aie15: langkah "Empat cara benchmark sintetis berbohong" (747 kata: bias keluarga model, kalibrasi kesulitan, ilusi cakupan, distribusi, Cohen's kappa, canary+temporal cutoff, AFLite) + formula Q=coverage×agreement×(1−C) + formulaNote + 2 quiz.

### W2 — Machine Learning Engineer (mle15–19: 39,2/38,9/39,2/39,3/39,3 → 50,1/49,8/49,7/50,0/49,7; est 50)
- mle15: langkah "Pipeline anti-leakage" (6 saluran bocor, nested CV, purged/embargoed CV, prospective validation, hierarki baseline) + formula E[test]≤E[val]≤E[train] + 2 quiz.
- mle16: langkah "ASHA: berhenti membuang compute" (successive halving 16×, Hyperband, BOHB, desain search space, tuning-test leakage, seed) + formula jadwal halving + 2 quiz.
- mle17: langkah "Registry & lineage kelas produksi" (version immutable, content-hash artifacts, model card, promosi multi-gerbang, audit) + formula C_lineage + 2 quiz.
- mle18: langkah "Matematika serving" (Little's Law, p50 berbohong, utilisasi target 0,7, batch vs online, cold start GPU, SLO burn rate, prediction cache, load test) + formula L=λW + 2 quiz.
- mle19: langkah "Aksioma Shapley, dua mesin, empat jebakan" (TreeSHAP vs KernelSHAP, observational vs interventional, korelasi/baseline/kausalitas/komputasi) + formula kompleksitas + 2 quiz.
- 3 pelanggaran F2 pre-existing diperbaiki (mle17 "(detail di MLE18)" & "(kembali ke MLE6)", mle18 "(dari MLE6)" → recap/definisi inline).

### W3 — Deep Learning Engineer (dle13/dle14: 39,3/39,1 → 52,7/52,0; est 55/50)
- dle13: langkah "Two-stage vs one-stage" (769 kata: RPN/Faster R-CNN vs YOLO/RetinaNet/FCOS, anchor k-means, Soft-NMS/DIoU-NMS, diagnostik AP50/AP75/APs, aturan FPS-constraint) + rumus mAP@0,5:0,95 + 3 quiz.
- dle14: langkah "Skip connections dalam, loss gabungan, perang melawan batas kabur" (746 kata: UNet++/Attention, gradien Dice vs CE, boundary loss, surface Dice/Hausdorff, patch training, katalog failure modes) + rumus loss gabungan + 3 quiz.
- 3 pelanggaran F2 pre-existing diperbaiki (dle13 "Focal loss (dari DLE14)" → definisi inline; "segmentasi (DLE14)" → recap; dle14 "deteksi (DLE13)" → recap).

### W3 — Data Engineer (de18–21: 42,8/42,2/42,2/42,9 → 54,3/54,0/54,3/54,7; est 55)
- de18: note "Intuisi: state adalah database, bukan cache" (177 kata) + langkah state produksi (remote backend, CI-satu-satunya-applier, plan artifact, pin modul, drift `-detailed-exitcode`, secret plaintext di state, bedah state corrupt) + 2 quiz.
- de19: note "Intuisi: CDC memindahkan kompleksitas, bukan menghilangkannya" (175 kata) + langkah ordering/exactly-once/evolusi skema (garansi per-partisi, uji kill -9, schema registry, watermark, incremental snapshot, transactional outbox, DLQ) + 2 quiz.
- de20: note "Intuisi: akses yang tidak direview = akses yang bocor" (187 kata) + langkah UU PDP 27/2022 praktis (RBAC/ABAC/ReBAC, JIT+expiry, masking, right-to-erasure incl. crypto-shredding, audit pola, playbook insiden kredensial) + 2 quiz.
- de21: note "Intuisi: format tabel = git untuk data, tapi git yang butuh tukang kebun" (187 kata) + langkah operasional format tabel (binpack vs Z-order, CoW/MoR/deletion vectors, partition evolution, optimistic concurrency, time travel+retensi, larangan 3-format) + 2 quiz.

### W4 — Database Administrator (dba15–18: 42,4/43,2/42,5/42,3 → 54,9/55,2/54,4/54,2; est 55)
- dba15: note "Intuisi: migrasi online yang aman terasa membosankan" (177 kata) + langkah "Migrasi Online Lanjutan: pt-osc, gh-ost & backfill bertahap" (777 kata: mekanisme trigger vs binlog-ROW, kapan gagal — FK untuk gh-ost/overhead trigger write-rate tinggi, backfill chunked idempoten + keyset pagination + rem lag replika, lock_wait_timeout/statement_timeout, rollback per fase, matriks keputusan DDL, daftar periksa 5 pertanyaan senior) + formula waktu_backfill + formulaNote + 2 quiz.
- dba16: note "Intuisi: backup adalah klaim, restore adalah bukti" (174 kata) + langkah "Menguji Restore: Tangga Pengujian & Matematika RPO" (733 kata: tangga 4 anak tangga, RPO sebagai pertidaksamaan, archive_command diam-diam 3 hari, chaos drill hypothesis-driven + kriteria abort, failback, laporan drill sebagai mesin anggaran) + formula RPO + formulaNote + 2 quiz.
- dba17: note "Intuisi: kepatuhan = bisa membuktikan, bukan bisa mengklaim" (186 kata) + langkah "UU PDP untuk DBA" (734 kata: UU 27/2022 praktis, hapus=hard delete/anonimisasi irreversibel, lineage ke replika/log, backup vs penghapusan→crypto-erasure, log hash-chained/WORM, breach 3×24 jam + runbook, access review kuartalan, DPIA mini; hedge "bukan nasihat hukum") + formula sizing storage_audit + formulaNote + 2 quiz.
- dba18: note "Intuisi: timeout adalah jaring pengaman, pool hanyalah ember" (183 kata) + langkah "Di Bawah Beban: Little's Law, Timeout & Kegagalan Beruntun" (705 kata: sizing dari λ×W terukur, p95 traffic bursty, antre vs fail-fast + spiral kematian, timeout antrean pooler < timeout aplikasi, 3 timeout Postgres, PgBouncer vs pgpool-II, prepared statement di transaction pooling, hitung end-to-end λ=800/W=60ms) + formula Little's Law + formulaNote + 2 quiz.

### W5 — WorldQuant Brain (wqb6–10: 44,6/44,3/44,1/44,3/44,2 → 55,7/53,5/55,0/53,7/54,1; est 55)
- wqb6: langkah "Kurva decay" (835 kata: sapuan d∈{1,2,4,8,12} dengan angka fitness per family — reversal puncak d=4 F=1,13; fundamental lereng hingga d=12 F=1,44 — ingatan efektif d/2, interaksi delay×decay, pusat massa (d−1)/3 ≈ d/3, konversi d≈1,5×window_SMA, geseran optimum oleh rezim biaya) + rumus fitness + formulaNote + 2 quiz + 2 summary.
- wqb7: langkah "Konstruksi universe & survivorship" (740 kata: rebalancing bulanan, filter ADV/harga ~2800 efektif, ADV vs market impact, survivorship bias 2–4%/thn, generalisasi antar segmen, diagnostik beku-vs-hidup) + 2 quiz + 2 summary.
- wqb8: langkah "Biaya netralisasi" (774 kata: dekomposisi faktor, kebocoran style R²>0,2, tesis=taruhan sektor S 1,7→0,2, premi turnover +15pp, fitness market-neutral F=0,80 vs subindustry F=0,03, netralisasi parsial λ) + rumus faktor + formulaNote + 2 quiz + 2 summary.
- wqb9: langkah "Point-in-time & look-ahead" (775 kata: tanggal pengetahuan vs periode, vintage first-reported vs revised, checklist 5 definisi field, 4 jebakan look-ahead, 3 pola kombinasi field dengan ekspresi FASTEXPR konkret, aturan |ρ|>0,7) + 2 quiz + 2 summary.
- wqb10: langkah "Semantik vektor" (804 kata: 3 arah potong grid, jebakan rank↔ts_mean dengan angka, NaN merambat + ts_backfill, ekspresi `group_neutralize(rank(ts_corr…)×rank(−ts_decay_linear…),subindustry)` dievaluasi angka per angka (A +0,667/B,C −0,333), daftar periksa 5 poin) + 2 quiz + 2 summary.
- 2 pelanggaran F2 pre-existing di wqb10 diperbaiki ("lihat lesson delay & decay", "seperti lab lesson 8" → recap inline). Aturan khusus WQB dipatuhi: tidak ada lesson dihapus; wqb-11 tidak disentuh.

## 2. Ringkasan tangga beginner→advanced (8 track, 1 kalimat bukti per track)
- **Probabilitas:** b20 menutup dengan memilih Viterbi vs smoothing berdasarkan kebutuhan narasi-vs-ketidakpastian dan mendeteksi label switching — keputusan inferensi praktisi, bukan teori rantai Markov.
- **Agentic AI Engineer:** aai13 kini mencakup ancaman frontier (prompt injection via deskripsi tool MCP) dan aai15 menuntut desain golden set sebagai keputusan statistik — materi pertahanan desain di depan tim keamanan.
- **AI Engineering:** aie13 menuntut tuning bobot fusi di validation dan diagnosis tiga arah drift; aie15 melatih skeptisisme metrologis (bias keluarga model, AFLite) — level evaluator senior.
- **Machine Learning Engineer:** mle15–19 mencakup disiplin insiden produksi — prospective validation, ekonomi trial ASHA/BOHB, lineage immutable sebagai asuransi insiden, capacity planning Little's Law, aksioma SHAP — bukan panduan pustaka.
- **Deep Learning Engineer:** dle13 mengajarkan diagnostik AP50-vs-AP75-vs-APs dan aturan "FPS = constraint keras"; dle14 mengajarkan metrik klinis surface Dice/Hausdorff — standar seleksi arsitektur senior.
- **Data Engineer:** de18–21 kini memuat bedah state corrupt, uji ketahanan kill -9, eksekusi teknis hak hapus UU PDP (crypto-shredding), dan ekonomi delete CoW-vs-MoR-vs-deletion-vectors — operasional produksi tingkat senior.
- **Database Administrator:** dba15–18 menutup dengan artefak keputusan eksekusi — daftar periksa go/no-go migrasi, pertidaksamaan RPO dari monitoring, mini-DPIA, sizing pool dari λ×W terukur — masing-masing dengan angka dan contoh kegagalan nyata.
- **WorldQuant Brain:** wqb6–10 kini menuntut pembaca menghitung pusat massa bobot decay (d−1)/3, menyapu netralisasi parsial λ, mendiagnosis kebocoran style via R², dan membedah ekspresi FASTEXPR multi-operator sampai angka long/short per saham — mekanik setingkat praktisi.

## 3. Kendala & insiden
1. **Insiden aie15 0-byte (W2, SUDAH PULIH):** insert run pertama mengandung surrogate-pair emoji menyebabkan UnicodeEncodeError di tengah write() → file ter-truncate 0 byte. Dipulihkan penuh dari `/tmp/v2verify/v2/content/aie15-synthetic-eval-data.ts` (324 baris, valid via esbuild), seluruh penambahan diterapkan ulang atomik (temp + os.replace) + guard surrogate. Kondisi akhir: 8 steps, 7 quiz, 55,3 menit, tsc bersih. Worker W4/W5 melihat file kosong saat bundling bersamaan — mereka menggunakan scoped audit sebagai fallback; verifikasi final koordinator dilakukan setelah semua selesai dan file utuh.
2. **Laporan worker = klaim, diverifikasi independen:** koordinator me-re-bundle registry sendiri, menjalankan audit model identik sendiri, menjalankan tsc sendiri, dan menjalankan scan F1/F2 sendiri atas 28 file — semua angka di dokumen ini dari verifikasi koordinator, bukan dari klaim worker.
3. estMinutes non-kelipatan-5 di luar 28 file scope dibiarkan (pre-existing; beberapa diperbaiki dalam gelombang sebelumnya).
4. Tidak ada deploy.

## 4. Hasil akhir program Gelombang C
- 256 lesson <45 (sensus 14 Okt) → **0/607** (verifikasi 16 Okt, audit model identik).
- estMinutes non-kelipatan-5 di luar scope 28 file dibiarkan (pre-existing).
