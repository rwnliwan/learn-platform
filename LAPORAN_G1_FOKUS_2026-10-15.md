# LAPORAN G1 FOKUS — 10 Lesson Wave 1 (HD × 4, BI × 3, BCD × 3)

**Tanggal:** 2026-10-15 · **Koordinator:** subagent parent (verifikasi mandiri, bukan hanya klaim tim)
**Slug dikunci dari:** `AUDIT_GAP_SEMUA_TRACK_2026-10-15.md` · **Laporan tim:** `LAPORAN_G1_HD_2026-10-15.md`, `LAPORAN_G1_BI_2026-10-15.md`, `LAPORAN_G1_BCD_2026-10-15.md`

## 1. Ringkasan per lesson (terverifikasi parent)

| Slug | File | Steps | Est | Harness | summary | tsc | F1 |
|---|---|---|---|---|---|---|---|
| hd21-farmakovigilans | `content/hd21-farmakovigilans.ts` | 15 | 52,9 → 60 | 6/6 PASS (PRR 15,00; ROR 15,89; χ² 633,0) | ✓ | 0 | 0 |
| hd24-mendelian-randomization | `content/hd24-mendelian-randomization.ts` | 15 | 51,6 → 60 | 5/5 PASS (Wald, IVW 0,51, MR-Egger) | ✓ | 0 | 0 |
| hd25-kesetaraan-kesehatan | `content/hd25-kesetaraan-kesehatan.ts` | 14 | 47,6 → 60 | 6/6 PASS (C −0,167; RR 2,53) | ✓ | 0 | 0 |
| hd26-rwe-regulator | `content/hd26-rwe-regulator.ts` | 14 | 48,0 → 60 | 5/5 PASS (RR MH 1,25) | ✓ | 0 | 0 |
| bi21-cancer-genomics | `content/bi21-cancer-genomics.ts` | 27 | 55,9 → 60 | PASS (kosinus 0,970; Fisher TP53 p=5,58e-16) | ✓ | 0 | 0 |
| bi22-spatial-transcriptomics | `content/bi22-spatial-transcriptomics.ts` | 24 | 50,6 → 60 | PASS (Moran's I +0,780/−0,067; dekonvolusi 0,60/0,40) | ✓ | 0 | 0 |
| bi23-pharmacogenomics | `content/bi23-pharmacogenomics.ts` | 28 | 52,5 → 60 | PASS (star-allele matcher; activity score) | ✓ | 0 | 0 |
| bcd16-stablecoin-analytics | `content/bcd16-stablecoin-analytics.ts` | 11 | 48,8 → 60 | 4/4 PASS Pyodide nyata | ✓ | 0 | 0 |
| bcd17-concentrated-liquidity | `content/bcd17-concentrated-liquidity.ts` | 11 | 48,9 → 60 | 4/4 PASS (tick 80068↔$3000; IL −4,49%) | ✓ | 0 | 0 |
| bcd19-l2-blobs | `content/bcd19-l2-blobs.ts` | 11 | 47,7 → 60 | 2/2 PASS (fake_exponential persis EIP-4844) | ✓ | 0 | 0 |

Estimasi per model WORKFLOW: kata/180 + lab×8 + kuis×2 + chart×2,5 + case×6 + rumus×1. Semua ≥ 45 mnt.

## 2. Verifikasi parent (bukti, bukan klaim tim)

- **File ada 10/10**, slug/track/module benar (HD: "Health Data Science", BI: "Bioinformatika", BCD: "Blockchain Data Scientist").
- **`npx tsc --noEmit`**: 0 error di 10 file + 3 registry. Satu-satunya error repo = `wqb22–wqb25` (tim gelombang lain, properti 'tasks' missing — bukan lingkup G1, tidak disentuh).
- **`grep 'summary:'`** = 1 per file; posisi di langkah akhir (tail) semua 10 ✓.
- **Scan F1** (5 frasa filler) = 0 di 10 file ✓.
- **Prosa RAW**: 0 entitas `&lt;/&gt;/&amp;` di 10 file; KaTeX `String.raw` backslash tunggal (tidak ada backslash-ganda) ✓.
- **Registrasi**: hanya `reg-hd.ts` (+4), `reg-bi.ts` (+3), `reg-bcd.ts` (+3). `registry.ts`, `Workspace.tsx`, lesson existing, rr19 tidak disentuh ✓.
- **bcd16 boundary RISIKO RANTAI**: parent grep — tidak ada pembahasan VaR/hedging/eksposur (mr21) atau penegakan/tipologi/sanksi (aml18); murni pengukuran on-chain sesuai mitigasi audit ✓.
- **lockLines** HD/BCD/BI terverifikasi runtime; tiap kuis tepat 1 `correct:true` (BI, dicek tim); quiz feedback `why` spesifik (20–24 hit per file).

## 3. Kejujuran bukti (sesuai instruksi parent)

- Tim HD: tingkat underreporting RS Indonesia TIDAK dikutip angkanya (BPOM menyatakan tidak ada angka pasti); semua data lab/chart sintetis berlabel eksplisit; angka SATUSEHAT (42.337 fasyankes) dari media, bukan kemkes.go.id langsung.
- Tim BI: klaim "COSMIC v3.3 = 78 SBS signatures" diturunkan (file data tidak terbuka langsung; rantai bukti v3.2=72 + suplemen; dicatat di lesson); resolusi Xenium dalam µm tidak dikarang; CPIC guideline = **29** (dihitung manual dari cpicpgx.org yang dibuka); mini-case berlabel SINTETIS/ilustrasi.
- Tim BCD: Pectra/EIP-7691 hanya dengan atribusi sekunder + catatan verifikasi; klaim detail Fusaka dihilangkan (hanya roadmap/PeerDAS); angka non-sumber di lab = sintetis berlabel eksplisit; tanggal Dencun 13 Mar 2024 terverifikasi.

## 4. Bug diperbaiki selama bangun

- hd21: backtick nyasar di template literal (ditangkap tsc).
- bcd17: `${FEE:.0f}` = interpolasi TS dalam f-string Python (tsc TS1005) — diperbaiki; `${` kini 0 di semua file.
- bi21: cosine 0,52→0,97 (sampling multinomial); OR2J3 9→7 mutasi agar jadi penumpang; premature `];};`; regex GenB.
- BI: lab Fisher mengunci baris `p +=` yang harus diisi — diperbaiki; tiap lab editable mulai `# TULIS KODEMU`.

## 5. Status & langkah berikutnya

10/10 lesson G1 FOKUS selesai dibangun + terverifikasi parent. **Belum di-deploy** — menunggu gerbang parent untuk gelombang lain + ACC Septian sebelum deploy gabungan (aturan berdiri). Total lesson repo sekarang 529 (519 + 10) setelah deploy.
