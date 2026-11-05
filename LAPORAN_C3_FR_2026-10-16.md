# LAPORAN C3 — Pendalaman Track Fraud & AML Analytics (2026-10-16)

**Status: SELESAI & terverifikasi parent.** 23/23 lesson `fr*` yang di bawah standar kini ≥45 menit model durasi. Tidak ada deploy (sesuai perintah). 23 file `fr*.ts` disentuh; tidak ada file lain yang tersentuh (aml*/dm*/cr*/rr* utuh, fr24 utuh).

## Ringkasan angka (audit ulang dari registry, model identik 14 Okt — diverifikasi parent sendiri)

| Metrik | Sebelum | Sesudah |
|---|---|---|
| Rata-rata track "Fraud & AML Analytics" | 44,0 mnt | **52,1 mnt** |
| Lesson <45 mnt | 23 | **0** |
| Lesson dengan komponen hilang | 23 (intuisi 0 di 23/23; tanpa mini-case 10 file; tanpa lab 1 file) | **0** |
| Rentang durasi (fr*) | 14,5–42,5 | **47,1–63,7** |
| Total platform <45 mnt | 204 | **181** (dari 256 sebelum Gelombang C) |
| tsc --noEmit (seluruh repo) | — | **0 error** |

Catatan: 22 lesson `aml*` dalam track yang sama sudah di atas standar sejak awal (48,5–57,3) dan tidak disentuh. Margin C3 lebih sehat dari C1 (min 45,2) — terendah fr* kini 47,1.

## Pola kerja
- 3 subagent paralel: Batch A (8 file tertipis: fr23, fr19, fr21, fr17, fr18, fr13, fr22, fr20), Batch B (8: fr15, fr9, fr14, fr12, fr16, fr8, fr5, fr11), Batch C (7: fr10, fr3, fr6, fr7, fr1, fr4, fr2).
- Per file: 1 note "Intuisi: …" (150–250 kata, heuristik investigator) + 1–3 langkah prose baru aditif sebelum step `checkpoint` + mini-case (id `minicase2`, eyebrow "Langkah N · Mini-case", wajib angka Rp konkret) untuk 10 file yang kekurangan + 1 lab Python baru di fr23 (lab: 0 → 1). Quiz baru tidak ditambah (semua sudah 4–5; "hanya bila perlu").
- Konten: pola fraud nyata Indonesia (mule account, structuring/smurfing, account takeover, first-party fraud, modus e-wallet & pindar, BI-FAST, PPATK/STR/LTKT); biaya false positive/negative dalam Rp; aturan keputusan investigator; contoh kasus NusaBank, TokoMaju, PayKu, KreditGo, KiranaBank.
- `estMinutes` diperbarui ke kelipatan 5 terdekat dari estimasi model (45–70).

## Rincian per file (durasi model sebelum → sesudah, komponen ditambah)

| File | Sebelum | Sesudah* | Ditambahkan |
|---|---|---|---|
| fr23-regulasi-indonesia | 14,5 | ~63,7 (est 70) | 4 prose + 2 mini-case + 1 lab + intuisi |
| fr19-nlp-phishing | 21,3 | ~54,7 (est 55) | 3 prose + 1 mini-case + intuisi |
| fr21-sql-fraud | 28,5 | ~53,8 (est 55) | 3 prose + 1 mini-case + intuisi |
| fr17-explainability | 28,9 | ~54,6 (est 55) | 3 prose + 1 mini-case + intuisi |
| fr18-mlops | 29,7 | ~52,8 (est 55) | 2 prose + 1 mini-case + intuisi |
| fr13-realtime | 29,9 | ~51,9 (est 50) | 2 prose + 1 mini-case + intuisi |
| fr22-chargeback | 30,1 | ~52,9 (est 55) | 2 prose + 1 mini-case + intuisi |
| fr20-capstone | 32,0 | ~53,2 (est 55) | 2 prose + 1 mini-case capstone + intuisi |
| fr15-aml | 32,3 | ~56,2 (est 55) | 2 prose + 1 mini-case + intuisi |
| fr9-evaluasi | 35,0 | ~55,9 (est 55) | 2 prose + 1 mini-case + intuisi |
| fr14-case-management | 36,0 | ~48,3 (est 50) | 2 prose + intuisi |
| fr12-graph-analytics | 38,9 | ~48,5 (est 50) | 1 prose + intuisi |
| fr16-anomali-time-series | 39,0 | ~48,3 (est 50) | 1 prose + intuisi |
| fr8-unsupervised | 40,5 | ~47,8 (est 50) | 1 prose + intuisi |
| fr5-rule-based | 40,8 | ~47,9 (est 50) | 1 prose + intuisi |
| fr11-threshold | 40,9 | ~47,6 (est 50) | 1 prose + intuisi |
| fr10-drift | 41,4 | ~47,5 (est 50) | 2 prose + intuisi |
| fr3-data-fraud | 41,6 | ~47,8 (est 50) | 2 prose + intuisi |
| fr6-feature-engineering | 41,9 | ~47,6 (est 50) | 2 prose + intuisi |
| fr7-supervised-ml | 42,0 | ~47,6 (est 50) | 2 prose + intuisi |
| fr1-lanskap-fraud | 42,1 | ~47,3 (est 45) | 2 prose + intuisi |
| fr4-label-fraud | 42,3 | ~47,7 (est 50) | 2 prose + intuisi |
| fr2-fraud-vs-aml | 42,5 | ~48,0 (est 50) | 2 prose + intuisi |

*Estimasi model = baseline parent + kata/180 + lab×8 + mini-case×6 (angka audit final per lesson tercetak di tabel ringkasan di atas: min 47,1).

## Verifikasi parent (bukan klaim worker)
1. Re-bundle registry (`esbuild registry.ts`) + skrip audit identik → tabel di atas. Fraud & AML: 0 lesson <45, 0 komponen hilang; total platform <45: 204 → 181.
2. `npx tsc --noEmit` = 0 error (seluruh repo).
3. Scan 5 frasa terlarang F1 di fr*.ts = 0 temuan.
4. `title: "Intuisi` tepat 1 per file di 23/23 file.
5. Cakupan file: hanya 23 fr*.ts yang berubah di jendela kerja C3 (cek mtime; tidak ada cr*/aml*/dm*/rr* yang tersentuh; fr24 utuh).
6. Lab fr23 dieksekusi dari registry yang ter-bundle: solution berjalan deterministik di python3, stdout memuat ke-4 pattern checks persis (total Rp650 jt; K4 Rp200 jt; K5 Rp300 jt pagu), tanpa korupsi `${`.
7. Tidak ada duplikat step id (cek t1/t2 adalah task id lab yang memang berulang per lab — konvensi lama).
8. Sampel kualitas: note fr19 "Intuisi: Triase bukan tentang menangkap semua — tentang memilih apa yang boleh lolos" (expected loss, ekonomi kapasitas, audit 5% sebagai jaring pengaman); mini-case fr15 (Rp4,8 M / 6 mule / 40 menit / deadline 2 jam, urutan freeze + EV vs tunggu 1 jam). Substantif, bukan filler.

## Kendala & temuan (diperbaiki)
- Batch A: note fr23/fr21 sempat <150 kata → diperluas; slip edit tool menduplikat `},` di draft fr19 → terdeteksi via cek brace, diperbaiki sebelum insert; fr13 estMinutes dikoreksi 55→50 (kelipatan 5 terdekat dari 51,9).
- Batch B: fr14 ternyata tidak punya mini-case (koreksi asumsi brief) → tetap dapat 2 langkah prose + note, tanpa mini-case baru; fr9 memakai KaTeX `String.raw` sesuai konvensi file.
- Batch C: note fr3 sempat 145 kata → diperbaiki; target kata tercapai 76–90% di batch A (terendah fr13/fr18) — semua tetap lolos gate dengan margin aman (fr13 ~51,9).

## Berikutnya
- Gelombang C selesai untuk 3 track tertipis (DM → CR → FR&AML). Sisa platform di bawah standar: 181/607 lesson di track-track lain.
- Deploy C1+C2+C3 ke live menunggu ACC Septian (deployment terakhir di live tetap 20b17030 — Gelombang A saja).
