# LAPORAN C6 — Portfolio Management (40 lesson) → ADVANCED (2026-10-16)

**Status: SELESAI & terverifikasi independen (koordinator).** Tidak ada deploy. Tepat 40 file `pm-a*/b*/c*/d*.ts` tersentuh; tidak ada track lain (scope check: 37 file pm-* berubah di jendela C6; 3 yang tidak berubah = d7/d8/d9 yang memang tidak perlu diubah — hanya cek tangga).

Model kerja: 4 worker paralel (A: pm-a1..a10, B: pm-b1..b9, C: pm-c1..c11, D: pm-d1..d10), masing-masing dengan brief berisi data gap per file, kalibrasi durasi (target 48–58, buffer ±40%), arah materi advanced berjiwa CFA, aturan F1/F2 eksplisit, dan kewajiban `tsc --noEmit` di akhir batch sendiri.

## 0. Angka final (verifikasi koordinator — re-bundle registry + skrip audit identik 14 Okt + tsc)

| Metrik | Sebelum | Sesudah |
|---|---|---|
| Rata-rata track Portfolio Management | 45,5 | **53,8** |
| Lesson <45 mnt | 24 | **0** (min 48,0 — tidak ada yang mepet; max 64,4) |
| Lesson dengan komponen hilang | 36 | **0** |
| Lesson tanpa note Intuisi | 40 | **0** |
| Rumus tanpa formulaNote | semua yang ter-flag | **0** |
| `npx tsc --noEmit` | — | **0 error** |
| estMinutes | campuran | kelipatan 5 semua (15×50, 19×55, 2×60, 4×65) |

- **Platform keseluruhan:** lesson <45 mnt **112 → 88** dari 607 (24 lesson terangkat — tepat 112−88=24, konsisten).
- Scan F1 (5 frasa terlarang, konten baru + lama di 40 file pm-*): **0 temuan** (verifikasi koordinator).
- Scan F2 (rantai silang): **0 pelanggaran tersisa** (verifikasi koordinator); 16 pelanggaran pre-existing diperbaiki worker dengan recap inline — rincian §4.

## 1. Rincian per file — pm-a* (fondasi CFA)

| File | dur → | est | Ditambahkan (advanced) |
|---|---|---|---|
| pm-a1-ethics | 27,6 → **50,1** | 50 | **+1 LAB** "Soft dollars" (biaya_a=35/biaya_b=10/hemat=25 — dieksekusi python3, 4 check lolos vs stdout asli; spot-check koordinator: stdout persis) + langkah "Dilema Lanjut" (soft dollars, directed brokerage, referral fee, personal trading vs klien, praktik pasar Indonesia, kerangka keputusan 4 langkah, kapan klaim "GIPS compliant" = I(C)) + 4 quiz vignette + Intuisi 184 kata |
| pm-a2-quant-methods | 61,6 → **64,4** | 65 | formulaNote ×4 + Intuisi 162 kata (TWM vs MWM, geometric vs aritmatika, survivorship bias) |
| pm-a3-economics | 61,8 → **64,3** | 65 | formulaNote ×4 + Intuisi 166 kata (priced-in, rantai transmisi Fed→BI, level vs perubahan) |
| pm-a4-financial-statements | 50,5 → **57,7** | 55 | formulaNote ×2 + langkah "Forensik Lanjut" (rasio akrual Sloan + formulaNote, 5 bendera Beneish-style, owner earnings) + 1 quiz + Intuisi 182 kata |
| pm-a5-corporate-issuers | 61,2 → **63,7** | 65 | formulaNote ×4 + Intuisi 174 kata (kas inkremental, diskon governance EM, event risk) |
| pm-a6-equity | 50,8 → **58,1** | 60 | formulaNote ×2 + langkah "Valuasi EM" (CRP Damodaran + formulaNote, illiquidity discount, kapan multiple menipu) + 1 quiz + Intuisi 178 kata |
| pm-a7-fixed-income | 43,1 → **53,2** | 55 | formulaNote ×2 + langkah "Convexity & Spread" (rumus convexity + formulaNote, dekomposisi spread, 3 jebakan yield) + 2 quiz + Intuisi 181 kata |
| pm-a8-derivatives | 61,2 → **63,8** | 65 | formulaNote ×4 + Intuisi 182 kata (uji hedge 10 detik, basis risk, counterparty risk) |
| pm-a9-alternatives | 51,5 → **57,3** | 55 | formulaNote ×2 + langkah "Due Diligence" (fee-drag vs illiquidity premium dengan angka, aturan sizing) + 1 quiz + Intuisi 163 kata |
| pm-a10-portfolio-mgmt | 51,9 → **58,3** | 60 | formulaNote ×3 + langkah "Naik Tangga" (estimation error/error-maximizer, 3 rem praktis, jembatan ke konstruksi portofolio) + 1 quiz + Intuisi 182 kata |

## 2. Rincian per file — pm-b* (tools kuantitatif)

| File | dur → | est | Ditambahkan (advanced) |
|---|---|---|---|
| pm-b1-regresi | 42,8 → **54,2** | 55 | Langkah "Newey-West & faktor kolinear" + **lab VIF** (10,3 vs 2,0) + formulaNote 2/2 + Intuisi 169 kata |
| pm-b2-timeseries | 44,0 → **55,0** | 55 | Langkah "Rezim & volatilitas praktisi" (uji Chow, Markov-switching, EWMA λ=0,94, kapan TIDAK pakai GARCH) + **lab spurious regression** + formulaNote 3/3 + Intuisi 166 kata |
| pm-b3-ml-investasi | 41,9 → **52,7** | 55 | Langkah "Overfit & validasi jujur" (multiple testing, deflated Sharpe, embargo 5 hari, batas ML vs model ekonomi) + **lab leakage** (96,2% vs 54,6%) + formulaNote 1/1 + Intuisi 165 kata |
| pm-b4-valuasi-ekuitas | 52,3 → **55,4** | 55 | Langkah kompak "Normalisasi & country risk" (mid-cycle margin, CRP Damodaran) + formulaNote 4/4 + Intuisi 158 kata |
| pm-b5-fixed-income-lanjut | 43,6 → **54,6** | 55 | Langkah "Key rate duration & spread" + **lab KRD** + formulaNote 3/3 + Intuisi 163 kata (inkonsistensi expected −6,4% vs solusi −6,8% tertangkap & diselaraskan pre-audit) |
| pm-b6-valuasi-derivatif | 51,8 → **56,0** | 55 | Langkah kompak "Paritas & basis risk" (put-call parity + formulaNote baru) + formulaNote 4/4 + Intuisi 151 kata |
| pm-b7-currency | 50,8 → **53,6** | 55 | Langkah kompak "Arbitrase & keputusan hedge" (aturan hedge bila risiko > 3×biaya) + formulaNote 2/2 + Intuisi 155 kata |
| pm-b8-faktor-risiko | 51,8 → **54,6** | 55 | Langkah kompak "Crowding & kematian faktor" (quant meltdown 2007, momentum crash −83%, kill rule) + formulaNote 3/3 + Intuisi 162 kata |
| pm-b9-intercorporate | 42,2 → **52,8** | 55 | Langkah "Pro-forma & jebakan goodwill" + **lab akresi/dilusi** + formulaNote 1/1 + Intuisi 162 kata |

## 3. Rincian per file — pm-c* (inti kurikulum CFA)

| File | dur → | est | Ditambahkan (advanced) |
|---|---|---|---|
| pm-c1-ips | 35,3 → **53,9** | 55 | formulaNote funded ratio + Intuisi 184 kata + 2 langkah (IPS mini dokter 45 thn Rp8M: return objective 7,2%, 5 constraints, 3 mode kegagalan IPS, kapan wajib revisi) + lab required return + 2 quiz |
| pm-c2-capital-market-expectations | 43,9 → **54,3** | 55 | Intuisi 187 kata + 2 langkah (ketidakpastian estimasi: SE/shrinkage/Bayesian blend; obligasi: carry + roll-down − durasi×Δy − expected credit loss, break-even SBN) + formulaNote SE + 2 quiz |
| pm-c3-asset-allocation | 43,4 → **52,5** | 50 | Intuisi 190 kata + 2 langkah (SAA vs TAA vs dinamis; rebalancing pajak-aware; home bias Indonesia, contoh SAA IDR) + 2 quiz |
| pm-c4-portfolio-construction | 41,9 → **52,8** | 50 | Intuisi 164 kata + 2 langkah (Michaud resampling 95/5 vs 55/45; Black-Litterman: intuisi Π/Q/Ω/τ, kendala turnover/ADV/pajak, kill-switch) + formulaNote BL + 2 quiz |
| pm-c5-performance-evaluation | 43,8 → **53,7** | 55 | Intuisi 168 kata + 1 langkah (kapan Sharpe/Sortino/Treynor/IR menipu; alpha Jensen vs multi-faktor; benchmark jujur Indonesia) + formulaNote Brinson + Sharpe/IR + 2 quiz |
| pm-c6-behavioral | 35,2 → **52,8** | 55 | Intuisi 191 kata + 2 langkah (myopic loss aversion Rp25 jt/thn; arsitektur keputusan: pra-komitmen, protokol anti-groupthink) + lab panic tax + 2 quiz |
| pm-c7-fixed-income-portfolio | 30,2 → **50,1** | 50 | Intuisi 180 kata + 3 langkah (key rate duration + twist; risiko reinvestasi + ORI/SBN: PPh 10%; convexity barbell vs bullet) + formulaNote KRD + lab convexity + 2 quiz |
| pm-c8-equity-portfolio | 38,3 → **53,2** | 55 | Intuisi 177 kata + 2 langkah (style drift via regresi Sharpe 1992, completeness fund; tax-aware: tax drag turnover) + lab tax drag + 1 quiz |
| pm-c9-derivatives-overlay | 42,3 → **50,4** | 50 | Intuisi 164 kata + 2 langkah (futures hedging N=V(βt−βa)/Vkontrak, basis/margin/roll risk; 5 pintu overlay merusak, anggaran proteksi ≤1% NAV) + formulaNote N + 1 quiz |
| pm-c10-trading-execution | 40,6 → **50,7** | 50 | Intuisi 176 kata + 2 langkah (Almgren-Chriss frontier; mikrostruktur IDX: lot 100, tick bertingkat, ARB) + formulaNote + 1 quiz |
| pm-c11-ethics-esg | 39,7 → **51,1** | 50 | Intuisi 179 kata + 2 langkah (integrasi vs screening: DCF pajak karbon Rp75rb/ton; dilema fidusia: protokol 3 langkah) + 1 quiz |

## 4. Rincian per file — pm-d* (tools data & risiko portofolio)

| File | dur → | est | Ditambahkan (advanced) |
|---|---|---|---|
| pm-d1-data-harga | 40,3 → **49,0** | 50 | Langkah "Data as-of" (kalender corporate action, vintage data, rights issue bank BUMN 2021) + rumus TERP + formulaNote + Intuisi 199 kata + 2 quiz |
| pm-d2-optimisasi | 41,5 → **50,4** | 50 | Langkah "Kendala praktis" (penalti turnover λ, cardinality, pajak) + rumus penalti + formulaNote + Intuisi + 2 quiz |
| pm-d3-regresi-faktor | 42,5 → **50,7** | 50 | Langkah "Beta stabil" (Vasicek shrinkage, VIF>5, Newey-West) + rumus + formulaNote + Intuisi + 2 quiz |
| pm-d4-backtesting | 40,4 → **48,8** | 50 | Langkah "Biaya Indonesia" (fee 0,15–0,29%, PPh final 0,1%, slippage LQ45 vs lapis-3) + rumus R_net + formulaNote + Intuisi + 2 quiz |
| pm-d5-metrik-kinerja | 42,4 → **50,8** | 50 | Langkah "Kappa & pemilihan metrik" (Kappa_3, Omega, 5 aturan pemilihan, anti metric-shopping) + rumus κ_n + formulaNote + Intuisi + 2 quiz |
| pm-d6-risk-reporting | 39,7 → **50,7** | 50 | Langkah "Laporan klien" (frekuensi per audiens, 4 metrik bahasa manusia, aturan krisis) + rumus IR + formulaNote + Intuisi + 3 quiz — aditif murni, tidak menyentuh/merujuk rr19 |
| pm-d7-factor-investing | 49,0 → 49,0 | 55 | tidak diubah (cek tangga saja) |
| pm-d8-risk-parity-budgeting | 48,0 → 48,0 | 50 | tidak diubah (cek tangga saja) |
| pm-d9-cppi | 49,3 → 49,3 | 50 | tidak diubah (cek tangga saja) |
| pm-d10-rebalancing | 48,6 → 48,6 | 55 | hanya F2 fix (cek tangga saja) |

## 5. Cek tangga beginner→advanced (ujung atas track) — verdict per worker, dibaca koordinator

- **a10 (ujung seri fondasi): SUDAH ADVANCED** — Markowitz, minimum-variance, CAPM/SML, IPS, behavioral + jembatan "Naik Tangga" (estimation error, 3 rem praktis). Tidak perlu pendalaman besar.
- **b4, b6, b8: SUDAH ADVANCED** (sensitivitas terminal + value trap; vol smile + LTCM + model risk; atribusi FF3 + ES) → penguatan kompak 1 langkah masing-masing (CRP Damodaran; put-call parity + basis risk; factor crowding + kill rule). Tanpa penggelembungan.
- **c8–c11: LULUS pre-L2/L3 CFA** — keputusan klien dengan kendala nyata (style drift → completeness fund; futures hedging + 5 pintu overlay merusak; Almgren-Chriss + mikrostruktur IDX; DCF karbon + protokol dilema fidusia).
- **d2: SUDAH ADVANCED** (Michaud, Black-Litterman, DeMiguel 1/N, LTCM + penguatan kendala praktis). **d7–d10: SUDAH ADVANCED** (factor timing vs exposure, crowding; RC_i + regime korelasi; 1987 + gap risk; kalender vs threshold + tax-loss harvesting) — tidak diubah kecuali F2 fix di d10.
- **Track Portfolio Management kini menaiki tangga penuh beginner→advanced** dengan ujung atas setara materi pre-L2/L3 CFA.

## 6. Scan F1/F2 (eksplisit)

- **F1: 0 temuan** — scan koordinator atas 40 file pm-* (5 frasa terlarang WORKFLOW.md; konten baru + lama).
- **F2: 0 pelanggaran tersisa** — scan koordinator: pola "lihat lesson"/"pada lesson"/"seperti dibahas di"/"(PM-[A-D]"/"dibahas di PM"/"dari lesson" → bersih (hanya "di lesson ini" = rujukan diri, diizinkan; field `next:` = navigasi platform, bukan rantai pedagogis).
- **16 perbaikan F2 pre-existing** oleh worker (recap inline 1–2 kalimat, tanpa rujukan): A: a2 "(PM-B1, PM-D3)" → recap regresi/faktor; a6 "(PM-B4)" → definisi FCFE inline; a10 "(PM-A2)" → beta = kemiringan regresi, "dibahas di PM-C5" → t-stat alpha; B: b1 "ridge/lasso (PM-B3)" → recap L2/L1; b7 "(PM-A8)" → recap eksportir lock kurs; C: c3 ×2 ("IPS (PM-C1) → CME (PM-C2)" → recap inline), c4 ×1 (draf sendiri "ingat SE dari lesson CME" → recap rumus SE); D: d2 "(PM-C4)" → alokasi kontribusi risiko; d4 "Survivorship (PM-D1)" → "Survivorship bias:"; d5 "(PM-C6!)" & "(PM-C1!)" dihapus (recap sudah ada), "(PM-D6!)" → recap inline; d6 "(PM-C9!)" → recap collar; d10 "(persis seperti dibedah di lesson risk parity)" → recap kontribusi risiko.
- F3: langkah baru berisi angka Rp konkret, mode kegagalan, aturan keputusan. F4: 10 lab baru/terverifikasi (a1 + b1, b2, b3, b5, b9 + c1, c6, c7, c8) — semua solution dieksekusi python3, checks dari stdout asli (spot-check koordinator: a1 `biaya_a=35  biaya_b=10  hemat=25` persis). F5: prose RAW UTF-8, KaTeX single-backslash dalam `String.raw`, tanpa entitas HTML, tanpa perubahan visual. F6: tidak ada komponen wajib dihapus; semua aditif.

## 7. Verifikasi koordinator (independen)

1. Re-bundle registry (esbuild) + skrip audit identik 14 Okt → angka §0 (bukan klaim worker).
2. `npx tsc --noEmit` = **0 error** seluruh repo.
3. Scan F1/F2 koordinator atas pm-* → 0/0 (di luar rujukan diri).
4. Sampel isi: note Intuisi d1 ("tiga heuristik praktisi" — heuristik asli, bukan ringkasan); quiz a1 (4 opsi × why × 1 correct); lab a1 (struktur + checks + stdout terverifikasi).
5. Cakupan file: 37/40 pm-* berubah di jendela C6 (3 tidak berubah = d7/d8/d9, sesuai rencana); tidak ada file non-pm yang diubah oleh gelombang ini.
6. estMinutes: semua kelipatan 5; selaras dengan durasi audit (tidak ada yang mepet 45 dari bawah: min 48,0).
7. Tidak ada deploy.

## 8. Kendala & catatan

- **Tabrakan tulis konkuren antar worker** (4 worker paralel): worker D menemukan syntax error pre-existing(?) di `pm-c1-ips.ts` (`tasks:` tanpa `[]` + `[],` nyasar) dan `pm-c5-performance-evaluation.ts` (`formulaNote` terjebak dalam array `tasks` + koma hilang) yang memblokir bundle/tsc-nya → diperbaiki minimal-struktural oleh D (isi tidak diubah; audit + tsc kini bersih untuk kedua file). Worker B & C juga sempat melihat error transien di pm-c5 saat worker lain sedang menulis — menunggu tanpa menyentuh, lalu hijau. Pelajaran untuk gelombang berikutnya: sekuenskan batch yang berbagi file, atau kunci per file.
- **Insiden note duplikat (worker C):** script menaruh note Intuisi di step yang sudah punya note "risk" → ter-shadow, audit baca 0 → diperbaiki manual (note dipindah ke step mini-case). Pelajaran: cek step target sebelum tambah note.
- **Variansi gaya kecil:** note Intuisi di seri pm-d* memakai prefix emoji "💡 Intuisi:" (sesuai konvensi WORKFLOW.md "Tips / Intuisi Kunci (💡 boxes)"), seri lain memakai "Intuisi:" polos. Keduanya lolos audit; tidak diubah (konsistensi kosmetik bisa diseragamkan di gelombang akhir bila pemilik mau).
- **Keputusan sadar:** d4 di 48,8 — dalam pita target 48–58, dibiarkan tanpa penggelembungan. hd-style "kompak" berlaku: di bawah 48 tapi ≥45 + sudah advanced → tidak dipaksa.
- Semua quiz baru 4 opsi × `why` × 1 correct; tidak ada `type: "tip"` (pelajaran C5 dipatuhi).
- Sisa platform di bawah standar: **88/607** — gelombang berikutnya per peta: C7 (Bioinformatika + Financial Markets), C8 (Market Risk + Statistika), C9 (sapu bersih).
