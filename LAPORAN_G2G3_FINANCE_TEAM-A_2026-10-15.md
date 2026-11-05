# LAPORAN G2 — Finance Team A (koordinator klaster finance/risk)
Tanggal: 2026-10-15 · Builder: subagent finance-team-A

## Slug yang dibangun (4 file BARU, tidak menyentuh lesson existing)

| Slug | File | Track/Module | Langkah | Quiz | Lab |
|---|---|---|---|---|---|
| mr26-tail-risk-hedging | `src/app/v2/content/mr26-tail-risk-hedging.ts` | Market Risk / Derivatif, FX & Komoditas | 10 | 5 soal × 4 opsi | 2 |
| mk20-ga4 | `src/app/v2/content/mk20-ga4.ts` | Marketing Analytics / Tracking & Data | 9 | 5 soal × 4 opsi | 2 |
| mk21-server-side | `src/app/v2/content/mk21-server-side.ts` | Marketing Analytics / Tracking & Data | 10 | 5 soal × 4 opsi | 1 |
| mk22-cdp | `src/app/v2/content/mk22-cdp.ts` | Marketing Analytics / Tracking & Data | 9 | 5 soal × 4 opsi | 1 |

Registrasi: `src/app/v2/lib/reg-mr.ts` (+import & entry mr26), `src/app/v2/lib/reg-mk.ts` (+import & entry mk20–22).
Tidak menyentuh: registry.ts, Workspace.tsx, reg file lain, lesson existing mana pun.
(Catatan: repo ini bukan git repository — verifikasi "tidak ada file lain diubah" dilakukan via daftar file + mtime; hanya 6 file di atas yang tersentuh.)

## Mitigasi F2 yang diterapkan di dalam lesson
- **mr26**: ringkasan mr11 (opsi put = asuransi dengan deductible) + mr5 (ES vs VaR) ditulis 2–3 kalimat di cerita pembuka; tidak ada referensi kode lesson mana pun.
- **mk20**: mandiri (tidak butuh prasyarat).
- **mk21**: memuat ringkasan model event GA4 2–3 kalimat di cerita pembuka (memenuhi syarat urutan mengikat walau mk20 dibangun bersamaan); `next` → mk22.
- **mk22**: ringkasan segmentasi mk4 (RFM) 2–3 kalimat di cerita pembuka; TIDAK membahas two-tower/ML engineering (wilayah mle20) — hanya sudut bisnis/identity.

## Hasil verifikasi per file

### `npx tsc --noEmit`
- Error di file milik Team A: **0**.
- Error pre-existing file tim lain (TIDAK disentuh): 6 baris, semua di `src/app/v2/content/dm20-reference-data.ts` baris 122 (TS1005). Dicatat, tidak diperbaiki.

### Skrip verifikasi Python (`/tmp/verify_g2.py`) — SEMUA LOLOS
- Setiap langkah punya properti `tasks` (kosong = `tasks: []`): OK di 38 langkah.
- `summary` ada di langkah checkpoint tiap lesson: OK (4/4).
- Frasa terlarang F1 (5 pola WORKFLOW.md): tidak ditemukan di file mana pun.
- Setiap quiz: ≥4 opsi (tepat 4) dengan tepat 1 `correct: true`: OK (20 soal total).
- Setiap solusi lab Python lolos `compile()`: OK.
- `estMinutes` 45–60: mr26=55, mk20=50, mk21=55, mk22=50.

### Eksekusi solusi lab (output aktual vs `expected`)
Awalnya 5 dari 6 lab MISMATCH (angka `expected` hasil hitung manual keliru) — diperbaiki agar `expected` = output aktual deterministik (seed tetap):
- mr26 lab1 (drag vs crash): akhir 192 vs 168, drawdown -36% vs -30% ✔
- mr26 lab2 (VaR vs ES + jump): jurang ES−VaR 3,58% (ber-jump) vs 0,27% (normal) ✔ — angka di prosa/quiz/summary diselaraskan.
- mk20 lab1 (agregat event): conv_rate 33,33% (4 sesi beli / 12 sesi) ✔
- mk20 lab2 (BigQuery dedup): revenue=1250000 duplikat=1 ✔ (sudah benar dari awal)
- mk21 lab1 (dedup event_id): unik=979 uplift=57,9% ✔ — prosa diselaraskan (±980, ~60% overcount tanpa dedup).
- mk22 lab1 (identity resolution): 9 baris → 4 profil, hemat Rp250rb ✔ — prosa diselaraskan.
Setelah perbaikan: **6/6 MATCH**.

## Kelengkapan pedagogi (R+T+M+D+C+L+Q per lesson)
- T (story hook + twist): 4/4 ✔ · M (myth box 🚨, 2+ per lesson, inline prose): 4/4 ✔ · D (peta keputusan 5 skenario + aturan 10 detik): 4/4 ✔
- C (mini-case angka konkret + pembahasan): 4/4 ✔ · L (lab Pyodide runnable+editable + instruksi eksplorasi): 4/4 ✔ · Q (≥4 soal, why spesifik): 4/4 ✔
- R (formula KaTeX String.raw + penjelasan per simbol via formulaNote): mr26, mk21, mk22 ✔ (mk20 memakai 1 formula engagement rate) · Chart SVG + "Cara membaca" + "Interpretasi" di caption: 4/4 ✔
- Prosa RAW (tanpa entitas HTML di luar SVG): ✔ · Istilah teknis Inggris, narasi Indonesia: ✔

## Catatan / kegagalan
- Tidak ada kegagalan yang tersisa. Satu temuan proses: angka `expected` lab tidak boleh ditulis dari perkiraan — selalu jalankan solusi dulu, lalu tulis `expected` dari output aktual (pelajaran untuk batch berikutnya).
- Browser test (KaTeX render, quiz klik, lab Pyodide, chart, mobile) BELUM dilakukan — di luar wewenang subagent ini (tidak ada akses live browser); diserahkan ke tahap QA parent.
