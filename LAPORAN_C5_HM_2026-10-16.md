# LAPORAN C5 — Health Data Science + Marketing Analytics → ADVANCED (2026-10-16)

**Status: SELESAI & terverifikasi independen (koordinator).** Tidak ada deploy. 48 file `hd*.ts` + `mk*.ts` tersentuh; tidak ada track lain.

## 0. Angka final (verifikasi koordinator — re-bundle registry + skrip audit identik 14 Okt)

| Metrik | Health Data Science | Marketing Analytics |
|---|---|---|
| Rata-rata track | 35,7 → **51,9** | 35,7 → **57,6** |
| Lesson <45 mnt | 19 → **0** | 21 → **0** |
| Rentang durasi | 21,3–51,2 → **46,3–65,8** | 30,0–49,3 → **49,8–65,9** |
| Lesson dgn komponen hilang | 26 → **0** | 21 → **0** |
| `tsc --noEmit` | **0 error** | **0 error** |

- **Platform keseluruhan:** lesson <45 mnt **152 → 112** dari 607 (40 lesson terangkat: 19 HD + 21 MK).
- Note "Intuisi:" tepat 1 per file di 48/48 file (grep terverifikasi).

## 1. Rincian per lesson — Health Data Science (sebelum → sesudah; est kelipatan 5)

| File | → | est | Komponen + materi advanced ditambahkan |
|---|---|---|---|
| hd19-pelaporan-klinis | 21,3 → ~58,9 | 60 | 2 lab (lie factor; tulis-ulang klaim dengan CI) + mini-case DBD Rp2,4 M + langkah advanced (anatomi klaim tahan audit: outcome switching, HARKing, hierarki 1-3-10) + 3 quiz + rumus lie factor + formulaNote + Intuisi 163 kata |
| hd2-standar | 22,3 → ~50,0 | 50 | lab (audit upcoding via rasio klaim/resep) + mini-case migrasi ICD-10→ICD-11 Rp1,8 M + langkah advanced (postcoordination ICD-11, profil FHIR SATUSEHAT, code drift) + 3 quiz + rumus + formulaNote + Intuisi |
| hd18-privasi-etika | 24,8 → ~48,9 | 50 | lab (k-anonymity runtuh oleh 1 outlier) + mini-case riset sekunder 2,1 jt record Rp450 jt + langkah advanced (consent tiers, secondary use UU PDP, data fiduciary) + 2 quiz + Intuisi |
| hd6-survival | 26,0 → ~54,9 | 55 | lab (simulasi immortal time bias 0,180 → +0,003) + mini-case obat jantung Rp1,2 jt/bln + langkah advanced (extended Cox X(t), format start-stop, 3 perbaikan immortal time) + 3 quiz + formulaNote KM + Cox + Intuisi |
| hd20-capstone-readmission | 26,2 → ~65,9 | 65 | 2 lab (net benefit 2 threshold; deteksi drift kalibrasi) + mini-case pitch Rp850 jt + 2 langkah advanced (kalibrasi, decision curve; monitoring, ambang rollback, performative prediction) + 4 quiz + Intuisi |
| hd13-fairness-kesehatan | 27,2 → ~49,8 | 50 | lab (gap TPR 3 grup incl. irisan 37,5%) + langkah advanced (intersectionality, minimax, pipeline audit 5 tahap, konteks PBI) + 4 quiz + rumus Gap_TPR + formulaNote + Intuisi |
| hd12-prediksi-klinis | 27,8 → ~49,3 | 50 | mini-case skor sepsis Rp2,1 M + langkah advanced (dekomposisi Murphy Brier, proper scoring rule, urutan validasi) + 4 quiz + formulaNote Brier + Intuisi |
| hd8-missing-data | 28,0 → ~51,2 | 50 | lab (tipping point δ*=−2,5) + langkah advanced (delta-adjustment, selection model, pattern-mixture, paradata) + 4 quiz + formulaNote Rubin + Intuisi |
| hd1-sistem-kesehatan | 29,5 → ~48,8 | 50 | lab (linkage rate EHR↔klaim) + langkah advanced (deterministic vs Fellegi-Sunter, 3 dimensi surveilans Kemenkes, MPI) + 3 quiz + formulaNote + Intuisi; +2 opsi quiz lama (3→4 opsi) oleh koordinator |
| hd9-uji-diagnostik | 29,7 → ~50,6 | 50 | lab (rantai 2 tes HIV 0,1%→4,7%→96,1%) + langkah advanced (verification bias, spectrum bias, latent class, tes berurutan) + 3 quiz + formulaNote PPV/odds + Intuisi |
| hd7-longitudinal | 30,1 → ~51,2 | 50 | lab (within +3,18 vs between −1,94) + langkah advanced (AR(1)/QIC, time-varying confounding, dropout informatif) + 3 quiz + formulaNote AR(1)/n_eff + Intuisi |
| hd10-kausal-observasional | 30,2 → ~52,1 | 50 | lab (DiD efek JKN −8 poin + uji pra-tren) + langkah advanced (staggered DiD, IV 3 syarat, konteks stunting/posyandu) + 3 quiz + rumus DiD + Wald IV + formulaNote + Intuisi |
| hd15-imaging-medis | 32,5 → **~52** | 50 | mini-case tender AI radiologi Rp3,2 M + langkah advanced (validasi eksternal, MRMC, selective prediction) + 3 quiz + Intuisi; **intervensi koordinator**: audit menandai 43,8 (estimasi worker 49,9 meleset) → +1 langkah advanced "Domain shift antar-RS & evaluasi federasi" (acquisition/population/label shift, UU PDP, pilot rollout, ambang rollback per fasilitas) + 2 quiz → kini lolos |
| hd5-uji-klinis | 32,9 → ~56,4 | 55 | lab (simulasi 5 intipan, inflasi alpha 4,9×) + mini-case DSMB + langkah advanced (interim & O'Brien-Fleming; desain adaptif vs p-hacking/HARKing) + formulaNote + Intuisi |
| hd16-surveilans-wabah | 39,3 → ~53,5 | 55 | lab CUSUM (alarm minggu 14) + langkah advanced (CUSUM/EWMA, nowcasting, evaluasi kelengkapan/timeliness/PPV) + formulaNote Rt + Intuisi |
| hd17-ekonomi-kesehatan | 40,5 → ~53,7 | 55 | lab PSA Monte Carlo (prob 0,861) + langkah advanced (CEAC, EVPI, threshold BPJS) + formulaNote QALY/ICER + Intuisi |
| hd14-nlp-klinis | 41,0 → ~54,6 | 55 | lab (strict 0,500 vs lenient 0,750) + langkah advanced (F1 entity-level, Cohen's kappa, taksonomi error) + Intuisi |
| hd4-desain-studi | 41,3 → ~48,7 | 50 | langkah advanced (DAG, backdoor, collider/Berkson, E-value) + 2 quiz baru + Intuisi |
| hd11-wrangling-ehr | 41,3 → ~55,6 | 55 | lab linkage (3,10/19,69/9,83) + langkah advanced (entity resolution, Fellegi-Sunter, golden record) + Intuisi |
| hd25-kesetaraan-kesehatan | 45,2 → 46,2 | 45 | note Intuisi saja — sudah advanced (concentration index, Kakwani, SDOH) |
| hd26-rwe-regulator | 45,5 → 46,5 | 45 | note Intuisi saja — sudah advanced (target trial emulation, Mantel-Haenszel) |
| hd23-pemetaan-penyakit-geospasial | 47,8 → 48,8 | 50 | note Intuisi (MAUP) — sudah advanced (SMR, EB shrinkage, BYM2) |
| hd22-surveilans-air-limbah | 48,3 → 49,1 | 50 | note Intuisi — sudah advanced (normalisasi PMMoV, lead-lag 3–7 hari) |
| hd24-mendelian-randomization | 49,0 → 49,9 | 50 | note Intuisi — sudah advanced (Wald, IVW, MR-Egger, InSIDE, F>10) |
| hd21-farmakovigilans | 49,7 → ~52,6 | 55 | langkah advanced BCPNN/IC (masking, vigiMatch, triage 5 faktor) + Intuisi — *penguatan ujung advanced* |
| hd3-epidemiologi | 51,2 → ~56,3 | 55 | langkah advanced (P≈I×D̄, SMR tak langsung, lead-time/length bias) + formulaNote 2/2 rumus lama + Intuisi |

Catatan: hd25 (46,2) & hd26 (46,5) di bawah target 48 tapi di atas lantai keras 45 dan sudah advanced → dibiarkan kompak, tanpa penggelembungan (keputusan sadar).

## 2. Rincian per lesson — Marketing Analytics (sebelum → sesudah)

| File | → | est | Komponen + materi advanced ditambahkan |
|---|---|---|---|
| mk1-funnel-aarrr | 33,4 → ~55,8 | 55 | formulaNote×3 + Intuisi + adv (cohort-mix trap, leverage-vs-quality) + mini-case ArusPay + 5 quiz |
| mk2-tracking | 30,5 → ~52,6 | 55 | formulaNote + Intuisi + adv (modeled measurement, dedup math) + mini-case KopiKenangan + 4 quiz |
| mk3-deskriptif | 30,2 → ~52,0 | 50 | formulaNote + Intuisi + adv (survivorship bias, metric contract) + mini-case WarungSehat + 4 quiz |
| mk4-segmentasi | 31,3 → ~52,9 | 55 | formulaNote×2 + Intuisi + adv (stabilitas/Jaccard, feature-from-action) + mini-case DanaKu + 4 quiz |
| mk5-clv | 39,7 → ~61,7 | 60 | formulaNote×2 + Intuisi + adv (5 asumsi BG/NBD, batas model) + mini-case SinarMart + 4 quiz |
| mk6-churn | 37,3 → ~55,9 | 55 | formulaNote×2 + Intuisi + adv (definisi churn jujur, label leakage) + LAB (X-day churn) + 3 quiz |
| mk7-propensity | 31,9 → ~59,2 | 60 | formulaNote×3 + Intuisi + adv (overlap/positivity, doubly robust) + LAB (IPW vs naive: 0,222→0,100) + 4 quiz |
| mk8-rekomendasi | 38,9 → ~59,9 | 60 | formulaNote×2 + Intuisi + adv (offline-vs-online eval, exploration) + mini-case BacaTerus-2 + 4 quiz |
| mk9-eksperimen | 32,6 → ~62,3 | 60 | formulaNote×4 + Intuisi + adv (sequential testing/alpha spending, guardrail) + LAB (simulasi peeking) + 4 quiz |
| mk10-incrementality | 29,5 → ~59,4 | 60 | formulaNote + Intuisi + adv (geo power/MDE, holdout) + LAB (geo MDE) + 4 quiz |
| mk11-uplift | 29,9 → ~56,5 | 55 | formulaNote + Intuisi + adv (uplift vs response, Qini) + LAB (Qini/depth) + 4 quiz |
| mk12-attribution | 29,4 → ~52,7 | 55 | formulaNote (Shapley) + Intuisi + adv (multi-touch vs last-click, 3 jebakan) + mini-case GadgetKu-2 + 4 quiz |
| mk13-mmm | 30,7 → ~60,2 | 60 | formulaNote×2 + Intuisi + adv (kalibrasi eksperimen, estimasi lambda, adstock/saturasi) + LAB (alokasi marginal) + 4 quiz |
| mk14-pricing | 30,4 → ~60,0 | 60 | formulaNote×2 + Intuisi + adv (A/B pricing, matriks substitusi) + LAB (net promo/kanibalisasi) + 4 quiz |
| mk15-forecasting | 32,6 → ~61,6 | 60 | formulaNote×4 + Intuisi + adv (rekonsiliasi hierarki, prediction interval) + LAB (WAPE/MAPE/bias) + 4 quiz |
| mk16-digital-ads | 30,4 → ~51,5 | 50 | formulaNote×2 + Intuisi + adv (auction pacing, walled garden) + mini-case SepatuLari-2 + 4 quiz |
| mk17-text-analytics | 31,8 → ~52,9 | 55 | formulaNote + Intuisi + adv (bias seleksi review, closing-the-loop) + mini-case AntarCepat-2 + 4 quiz |
| mk18-etika | 24,9 → ~52,6 | 55 | formulaNote (DI ratio) + Intuisi + adv (cookie-deprecation, privacy-preserving measurement) + mini-case PinjamBaik-2 + 5 quiz |
| mk19-capstone | 34,5 → ~64,5 | 65 | formulaNote + Intuisi + adv (Fase 0 audit data, 5 jebakan capstone) + mini-case end-to-end MajuMart + rubrik 5 dimensi + 9 quiz |
| mk20-ga4 | 47,4 → 48,5 | 50 | note Intuisi saja — sudah advanced (DebugView, BigQuery UNNEST, DDA, SKAdNetwork) |
| mk21-server-side | 41,2 → 47,9 | 50 | Intuisi + adv kompak (kegagalan sunyi: event_id, timestamp MP, SPOF) + 2 quiz — *penguatan ujung advanced* |
| mk22-cdp | 40,7 → 47,4 | 50 | Intuisi + adv kompak (CDP composable, reverse ETL) + 2 quiz — *penguatan ujung advanced* |

Catatan: mk21 (47,9) & mk22 (47,4) di bawah target 48 tapi di atas lantai 45, dibiarkan kompak tanpa penggelembungan (selisih <110 kata, dalam noise model).

## 3. Cek tangga beginner→advanced (ujung atas tiap track)

- **Health DS**: ujung atas (hd21–hd26, hd3) dinilai satu per satu — hd25/hd26/hd23/hd22/hd24 sudah advanced (hanya intuisi); hd21 diperkuat kompak (BCPNN/masking/triage); hd3 (fondasi intermediate) diberi langkah advanced kompak.
- **Marketing**: mk20-ga4 sudah advanced (hanya intuisi); mk21/mk22 penguatan ujung kompak. Track mencapai advanced lewat mk5/mk7/mk9/mk10/mk11/mk13/mk15 (topik frontier: BG/NBD, doubly robust, sequential testing, geo-experiment, uplift, MMM, hierarki forecast).

## 4. Scan anti-pattern F1–F6 (eksplisit)

- **F1 (5 frasa terlarang WORKFLOW.md): 0 temuan** di 48 file hd*+mk* (konten baru maupun lama).
- **F2 (aturan rantai): 0 pelanggaran tersisa.** Pola dicek: "di lesson"/"pada lesson"/"lihat lesson"/"seperti dibahas di"/"pada bab"/"seperti yang telah dibahas" → hanya 12 hit "di lesson ini" (rujukan diri sendiri, diizinkan). **Intervensi koordinator**: 8 pointer silang pre-existing diganti recap inline 1–2 kalimat (hd19: "lihat HD12"/"lihat HD11"/"lihat HD8"/"HD10" → recap TRIPOD, fenotipe, MCAR/MAR/MNAR, DiD; hd5 "(lihat HD3)" → definisi NNT; hd4 "dari lesson lama" → "Contoh angkanya"; hd11 "(lihat HD2)" → recap upcoding/rule-out; mk21 "(lesson GA4)" → definisi duplikasi event). 5 eyebrow "bekal dari lesson lain" → "bekal prasyarat" (isinya memang sudah self-contained).
- **F3:** langkah baru berisi angka Rp konkret, mode kegagalan, aturan keputusan — bukan definisi kamus.
- **F4:** lab baru runnable + editable dengan checks bermakna (spot-check koordinator: hd6 immortal-time → `efek_naif=0.180 efek_landmark=+0.003` persis pola checks; mk7 IPW → `naive=0.222 ipw=0.100` persis expected); quiz baru 4 opsi × `why` × 1 correct; hd1: 2 quiz lama 3-opsi dilengkapi jadi 4 opsi.
- **F5:** prose RAW tanpa entitas HTML; KaTeX single-backslash dalam String.raw; tanpa perubahan visual.
- **F6:** tidak ada komponen wajib yang dihapus; semua tambahan aditif.

## 5. Verifikasi koordinator (independen)

1. Re-bundle registry (esbuild) + skrip audit identik 14 Okt → angka §0.
2. `npx tsc --noEmit` = **0 error** (semula 13 file hd* memakai `type: "tip"` yang tidak ada di tipe note — diperbaiki massal ke konvensi C4 tanpa `type`).
3. Scan F1/F2 koordinator atas hd*+mk* → 0/0 di luar rujukan diri.
4. Sampel isi: hd6 (heuristik 3 poin longitudinal — within-between, spaghetti plot), hd19 (anatomi klaim tahan audit), mk13 (kalibrasi MMM dengan eksperimen), mk7 (doubly robust).
5. Cakupan file: hanya 48 file hd*/mk* yang berubah di jendela C5 (cek mtime; file non-hd/mk bertimestamp hari ini milik gelombang sebelumnya).
6. Tidak ada deploy.

## 6. Kendala & catatan

- Estimasi kata worker meleset hingga ±40% (pola C1–C4); satu kasus nyata: hd15 (estimasi 49,9 → audit 43,8) → intervensi koordinator menambah langkah advanced, kini lolos.
- `type: "tip"` bukan tipe valid untuk note — worker hanya menjalankan esbuild (tidak typecheck). Mulai C6: wajibkan worker menjalankan `npx tsc --noEmit` di akhir batch mereka.
- Angka "sebelum" tiap lesson memakai baseline audit pra-C5; angka "sesudah" worker memakai model yang sama dengan hitungan kata konsisten.
- Sisa platform di bawah standar: **112/607** — berikutnya per peta: C6 (Portfolio Management), C7 (Bioinformatika + Financial Markets), C8 (Market Risk + Statistika), C9 (sapu bersih).
