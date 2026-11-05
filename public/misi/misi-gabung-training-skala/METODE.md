# METODE.md — misi-gabung-training-skala

## Pernyataan data

**100% SINTETIS.** Seluruh file di folder ini adalah data fiksi yang dibuat
dengan generator acak (seed 42) untuk keperluan latihan. BUKAN log training
nyata, BUKAN milik perusahaan mana pun, TANPA kredensial/informasi akun.

## Generator

Skrip: `/tmp/cap3-training-gen.py` (seed = 42, `random.Random(42)`).

- `training_log.csv` — 800 baris (100 titik step × 8 worker `w0`–`w7`).
  Kolom: `step`, `worker`, `loss`, `grad_norm`.
  - Baseline loss: `1,1 + 3,5·exp(−step/12000) + noise N(0; 0,02)`
  - Baseline grad_norm: `1,8 + N(0; 0,05)`
  - Sejak step 40000 (divergensi buatan): `loss += 0,15 + 2,2·k`,
    `grad_norm += 0,5 + 1,6·k`, dengan `k = (step−40000)/10000`.
- `comm_overhead.csv` — 800 baris. Kolom: `step`, `worker`, `step_time_s`,
  `comm_overhead_ms`.
  - Worker normal: `step_time 1,42 ± 0,05 dtk`, overhead `12 ± 2 ms`.
  - Worker `w5` (straggler buatan): `step_time 1,68 ± 0,05 dtk`,
    overhead `87 ± 5 ms` — persisten di semua titik.
- `events.csv` — 6 baris preemption/reconnect spot-instance (fiksi).
- `gpu_pricing.csv` — 3 baris harga fiksi (USD/GPU-jam). Run TR-8847
  memakai **spot** $0,96 (kolom `notes`).
- `run_config.csv` — konfigurasi run TR-8847 (fiksi): 8 worker,
  batch per-worker 64 → effective batch 512, base LR 3e-4 @ batch 64,
  klaim dossier batch 64 & LR 6e-4, warmup 2000 step, horizon cosine 200k,
  rencana 50k step, divergensi di step 40000.

## Angka kunci (dihitung dari data hasil generate)

- Rata-rata `step_time_s` keseluruhan: 1.4534 dtk
- Biaya per 1k step (8 GPU A100): on-demand $10.34 · spot $3.10
  (rasio 3.33×)
- Straggler: `w5` (overhead komunikasi rata-rata ≈ 87 ms vs ≈ 12 ms lainnya)
- Divergensi: step pertama dengan rata-rata grad_norm > 2,2 adalah step 40000

## Batas jujur

- Pola divergensi, straggler, dan preemption DIBUAT menyerupai pola nyata
  agar bisa dianalisis — tetapi angkanya bukan dari run sungguhan.
- Harga GPU fiksi (mendekati kisaran pasar 2026, bukan kutipan resmi).
- Aturan "linear scaling" dan model biaya disederhanakan untuk latihan.
