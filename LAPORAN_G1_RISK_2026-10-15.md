# LAPORAN BANGUN Gelombang 1 — Kelompok RISK (9 lesson)
**Tanggal:** 2026-10-15 · **Koordinator:** subagent G1-RISK · **Sumber kebenaran kandidat:** AUDIT_GAP_SEMUA_TRACK_2026-10-15.md
**Judul/slug:** dikunci dari audit, tidak diubah. **Sentuhan:** 3 builder × 3 lesson, file baru + registrasi track sendiri saja. rr19, registry.ts, file existing tidak disentuh.

## Verifikasi independen parent (07:5x WITA)
- `grep -c "summary:"` = 1 per file (9/9, di langkah checkpoint).
- `export const` + entri reg terverifikasi untuk semua 9 (reg-cr 38, reg-mr 25, reg-fr 45, reg-rr 26).
- `npx tsc --noEmit`: **0 error** dari 9 file + 4 reg file. Error lain (268 total, mis. bcd17, bi21, hd21, llmops14) berasal dari file tim lain yang sedang menulis paralel — bukan buatan kelompok ini, tidak disentuh.
- Import bundle esbuild → node: 9/9 slug terdaftar dengan `l.slug` cocok, jumlah langkah sesuai.

## Hasil per lesson

| Lesson | File | Slug | Langkah | Est. model* | Harness lab | summary | F1 |
|---|---|---|---|---|---|---|---|
| cr32 | cr32-credit-derivatives-cds.ts | `cr32-credit-derivatives-cds` | 10 | 53,2 mnt (55) | 5/5 pass (2 lab) | ✓ 5 butir | 0 |
| cr33 | cr33-basel3-final-output-floor.ts | `cr33-basel3-final-output-floor` | 10 | 52,8 mnt (55) | 4/4 pass (2 lab) | ✓ 5 butir | 0 |
| cr34 | cr34-tkbi-v2-kredit-hijau.ts | `cr34-tkbi-v2-kredit-hijau` | 11 | 54,5 mnt (55) | 4/4 pass (2 lab) | ✓ 5 butir | 0 |
| mr25 | mr25-nmrf-plat-frtb-ima.ts | `mr25-nmrf-plat-frtb-ima` | 10 | 55 mnt | 5/5 pass (2 lab) | ✓ 5 butir | 0 |
| aml20 | aml20-beneficial-ownership-ubo.ts | `aml20-beneficial-ownership-ubo` | 10 | 53 mnt | 6/6 pass (2 lab) | ✓ 5 butir | 0 |
| aml21 | aml21-proliferation-financing.ts | `aml21-proliferation-financing` | 10 | 52 mnt | 6/6 pass (2 lab) | ✓ 5 butir | 0 |
| fr24 | fr24-fraud-loss-reporting-roi.ts | `fr24-fraud-loss-reporting-roi` | 9 | 52,6 mnt (53) | 8/8 pass (2 lab) | ✓ 5 butir | 0 |
| rr25 | rr25-icaap-pilar2.ts | `rr25-icaap-pilar2` | 9 | 52,8 mnt (53) | 7/7 pass (2 lab) | ✓ 5 butir | 0 |
| rr26 | rr26-laporan-kpmm-car.ts | `rr26-laporan-kpmm-car` | 9 | 53,6 mnt (54) | 8/8 pass (2 lab) | ✓ 5 butir | 0 |

*Model est: kata/180 + lab×8 + kuis×2 + chart×2,5 + case×6 + rumus×1.

## Ringkasan bukti per builder
- **Builder A (cr32–34):** harness 13/13 checks pass; tsc bersih; F1 = 0 (5 frasa terlarang + varian lowercase). Satu temuan diperbaiki saat QA (2 SVG cr34 sempat tidak terpasang → dipasang, harness diulang).
- **Builder B (mr25, aml20, aml21):** harness 17/17 checks pass; registrasi diverifikasi via node import; tsc bersih (error pre-existing di file tim lain: aie15/aie16/bcd17/bi21/hd21/llmops14 — tidak disentuh); 2 bug diperbaiki saat QA (typo `],`→`},` aml21, tuple berlebih lab mr25).
- **Builder C (fr24, rr25, rr26):** harness 23/23 checks pass; tsc bersih (error pre-existing 5 file tim lain — tidak disentuh); kepemilikan topik rr26 vs cr4a dinyatakan eksplisit 2× di dalam lesson.

## Catatan sumber (dibuka/diganti — kejujuran metodologi)
- **cr33:** ECB Macroprudential Bulletin Des 2023 (focus01) dibuka penuh (output floor 72,5%, phase-in 5 thn dari 1 Jan 2023, transisi UE s/d 2032). bis.org/bcbs/publ/d592.pdf tidak dibuka → diganti artikel ECB setara, dicatat di lesson.
- **cr34:** siaran pers resmi OJK (ojk.go.id) 25 Feb 2025 terverifikasi via hasil pencarian — TKBI v2 diluncurkan 11 Feb 2025 (v1 Feb 2024 energi saja; v2 +Konstruksi & Real Estate, Transportasi & Penyimpanan, Kehutanan & Sawit AFOLU; merujuk ATSF); angka Rp2.075 T (Des 2024), 26,24% kredit nasional, UMKM 69,01%.
- **cr32:** Hull 6th ed ch.18 (TOC terverifikasi di audit) sebagai referensi konseptual.
- **mr25:** BoE CP9/26 (Juni 2026) dibuka penuh — PLAT 1→3 thn non-binding; RFET 24→16 harga untuk LH>20 hari; NMRF Type 1 (ES + add-on korelasi nol) vs Type 2 (SES penuh). advisers.law EU Regulation 2026/1221 dibuka (relief PLAT 3 thn 2027–2029, ES boleh mingguan).
- **aml20:** openownership.org draft amandemen R.24/INR.24 dibuka (multi-pronged approach, nominee disclosure, bearer shares). GT CTA: threshold 25% + substantial control, BOI ke FinCEN, berlaku 1 Jan 2024 (terverifikasi via hasil pencarian).
- **aml21:** URL audit 404 → URL benar ditemukan via search dan dibuka penuh: expiry UNSCR 2231 → snapback 1737/1747/1803/1835/1929, kewajiban re-screening, freeze tanpa tunda, lapor CNMR/PNMR via GoAML.
- **fr24:** angka LexisNexis True Cost of Fraud 2026 (biaya total >$5 per $1 direct loss) diverifikasi via web search hari ini; kasus "PayKita" fiktif-tapi-plausibel mengikuti pola NusaBank di fr23.
- **rr25:** Pilar 2/SRP diverifikasi via hasil pencarian mengutip teks Basel (4 prinsip SRP, 6 komponen ICAAP); cakupan SREP OJK dari ojk.go.id.
- **rr26:** POJK 11/POJK.03/2016 via ojk.go.id — tangga profil risiko 8%/9–<10%/10–<11%/11–14%, CET1 ≥4,5%, Tier 1 ≥6%, buffer (conservation 2,5%; CCyB 0–2,5%; D-SIB bucket 1–3,5% semua CET1), Tier 2 ≤100% Tier 1. Data nyata: CAR industri 25,48% (BI Mei 2025), BCA 26,6%, BSI 21,39%.

## F2 (rantai) — mitigasi audit diterapkan
cr32→(cr3,cr10,mr14) · cr33→(cr4a) · cr34→(cr28) · mr25→(mr16) · aml20→(aml2) · aml21→(aml4,aml15) · fr24→(fr1,fr14) · rr25→(rr16,rr15) · rr26→(rr16,cr4a; kepemilikan vs cr4a dinyatakan eksplisit). Semua prasyarat = lesson yang sudah ada di 519, diringkas 2–3 kalimat.

## Status: SIAP untuk gerbang deploy parent
9 file + 4 reg file bersih tsc, terdaftar, harness lolos, summary ada, F1 0. Keputusan deploy ada di parent (ACC Septian wajib untuk deploy besar).
