# LAPORAN G2/G3 — Finance Team-C (Klaster Portfolio Management, Tier D)
Tanggal: 2026-10-15 · Koordinator: Team-C (subagent) · Parent: koordinator klaster finance/risk

## Daftar slug yang dibangun (4 file BARU)
| # | Slug | Judul | Steps | Quiz | Lab | Myth |
|---|------|-------|-------|------|-----|------|
| 1 | `pm-d7-factor-investing` | D7 — Factor Investing: dari Premia ke Portofolio Nyata | 9 | 5 | 2 | 2 |
| 2 | `pm-d8-risk-parity-budgeting` | D8 — Risk Parity & Risk Budgeting: Alokasi berbasis Risiko, Bukan Modal | 9 | 5 | 2 | 2 |
| 3 | `pm-d9-cppi` | D9 — CPPI & Asuransi Portofolio: Lantai yang Bergerak | 9 | 5 | 2 | 2 |
| 4 | `pm-d10-rebalancing` | D10 — Rebalancing: Kalender, Threshold & Tax-Aware | 9 | 5 | 2 | 2 |

Export const: `pmd7`, `pmd8`, `pmd9`, `pmd10` (meniru pola `pmd1`..`pmd6`).
Registrasi: `src/app/v2/lib/reg-pm2.ts` — tambah 4 import + 4 entry (Tier D pm-d1..d6 memang
terdaftar di reg-pm2, bukan reg-pm1 — diverifikasi via grep sebelum edit).
Tidak menyentuh: registry.ts, Workspace.tsx, reg-pm1.ts, lesson existing mana pun.

## F2 mitigasi (a) — ringkasan prasyarat inline 2–3 kalimat, tanpa "lihat lesson X"
- pm-d7: ringkas pm-a10 (CAPM satu faktor → beta/alpha/SML; factor investing = CAPM N-faktor) +
  pm-b1 (regresi sebagai mesin pengurai eksposur; omitted variable; R² ≠ kausalitas) di langkah 2
  "Modal dasar (ringkas, self-contained)". e9 CAPM TIDAK dirujuk (sudut FM milik Team-B).
- pm-d8: ringkas pm-c4 (risk budgeting/RC_i; optimisasi = error maximizer) + pm-a2
  (σ_p² = w′Σw; korelasi; geometric return) di langkah 2.
- pm-d9: ringkas pm-a8 (protective put = asuransi; premi = biaya; put-call parity) + pm-b6
  (delta hedging; gamma; replikasi gagal saat gap — 1987) di langkah 2. Definisi CPPI
  dikonfirmasi dari sumber primer ifci.ch/00010855.htm: E = m × (V − F), sisanya di aset
  bebas risiko, direvisi seiring perubahan nilai portofolio, tanpa horizon tetap.
- pm-d10: ringkas pm-c3 (SAA/TAA/LDI; rebalancing = contrarian otomatis; drift = risiko
  diam-diam; 60/40 ≈ 88% risiko dari saham) di langkah 2.

## Hasil verifikasi per file
Skrip: `/tmp/qa_g2g3.py` (cek: tasks di semua langkah — 9/9 per file; summary ada;
quiz 5 soal × 4 opsi & tepat 1 correct; frasa F1; pola "lihat lesson X"; compile() solution;
EKSEKUSI solution asli hasil ekstrak dari .ts + uji semua pola `stdout_matches` terhadap
output nyata — 0 pola tak-match di semua file).

| File | tsc error | tasks/step | summary | quiz | F1 | lab compile+run | pola stdout vs output nyata |
|------|-----------|-----------|---------|------|----|-----------------|------------------------------|
| pm-d7-factor-investing | 0 | 9/9 OK | ada (checkpoint) | 5 soal, 4 opsi/1 benar | bersih | 2/2 OK | semua cocok |
| pm-d8-risk-parity-budgeting | 0 | 9/9 OK | ada (checkpoint) | 5 soal, 4 opsi/1 benar | bersih | 2/2 OK | semua cocok |
| pm-d9-cppi | 0 | 9/9 OK | ada (checkpoint) | 5 soal, 4 opsi/1 benar | bersih | 2/2 OK | semua cocok |
| pm-d10-rebalancing | 0 | 9/9 OK | ada (checkpoint) | 5 soal, 4 opsi/1 benar | bersih | 2/2 OK | semua cocok |

- `npx tsc --noEmit`: **0 error di ke-4 file + reg-pm2.ts**. Error pre-existing di file tim lain
  (`b18-poisson-process.ts`, `de20-access-control.ts`, `dm20-reference-data.ts`) — TIDAK disentuh, hanya dicatat.
- Komponen wajib per lesson: R+T+M+D+C+L+Q terpenuhi (cerita+twist, ≥2 myth, 3 tips 💡,
  peta keputusan 4 skenario + aturan 10 detik, mini-case angka konkret + pembahasan,
  lab Pyodide editable + instruksi eksplorasi, chart SVG + "Cara membaca" + "Interpretasi",
  quiz dengan feedback why + score tracking via komponen Quiz).
- Prosa RAW (`<`, `>`, `&` apa adanya); entitas HTML hanya di string const SVG;
  KaTeX selalu `String.raw` backslash tunggal; lab memakai `{var}` polos — patuh pelajaran
  `~/workspace/AGENTS.md` 2026-10-15 (tidak ada `\${` / `${` di ke-4 file, diverifikasi via grep).
- Repo ini BUKAN git repository (`git status` gagal: "not a git repository"). Verifikasi cakupan
  perubahan: aksi tulis/edit saya hanya pada 4 file lesson + `reg-pm2.ts` (+ skrip
  `/tmp/qa_g2g3.py` dan file laporan ini).

## Catatan
1. Angka lab & mini-case dihitung dan dieksekusi lokal SEBELUM ditulis (bukan estimasi):
   HML 0,38%/bln (ann 4,5%, t-stat 0,55 → belum signifikan — intinya: 12 bulan = noise);
   momentum 2009-style: Rp100jt → Rp68,1jt, max DD −47,7%; 60/40 → RC saham 92,4%
   (konsisten dengan pm-c4 "≈92%"); risk parity 24/76 → RC 50/50; lev 1,64x → net 6,7%
   vs 60/40 6,4%; CPPI m=2 vs m=6 → V 95,1 aman vs 85,0 JEBOL (m=6 jebol bahkan sebelum gap);
   drift 5 thn → saham 70,4% vs turnover tahunan 18% vs band 7%; harvesting hemat Rp1jt.
2. pm-d7 lab1: data mainan SENGAJA dibuat premia positif tapi t-stat rendah — mendukung
   narasi "faktor butuh puluhan tahun data"; instruksi eksplorasi mengajak merusak datanya.
3. pm-d9 lab2: fungsi `cppi()` memakai `E = max(0, m×C)` (tanpa short — cash lock-in realistis);
   tanpa clamp, cushion negatif menghasilkan E negatif yang "memulihkan" V secara artifisial
   (bug model yang saya tangkap saat verifikasi run).
4. pm-d8: angka RC 92,4% menggantikan estimasi awal 90% saya — prosa/chart/quiz diselaraskan.
5. Rantai `next`: d7→d8→d9→d10→`/learn/dm1-data-lifecycle` (meniru pola pm-d6 sebagai penutup tier).
6. Pelajaran untuk builder berikutnya: JANGAN hitung ekspektasi lab dengan tangan — selalu
   eksekusi solution hasil ekstrak .ts dulu, baru tulis `expected`/`checks` (4 dari 8 lab saya
   meleset di hitungan tangan awal; pola `stdout_matches` wajib diuji vs stdout nyata).
