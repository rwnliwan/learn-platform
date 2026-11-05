# LAPORAN C7 — Bioinformatika + Financial Markets → ADVANCED (2026-10-16)

**Status: SELESAI & terverifikasi independen (koordinator).** Tidak ada deploy. 46 file tersentuh (`bi1`–`bi24`, `e1`–`e22`); tidak ada track lain, tidak ada `rr19`.

Model kerja: 3 worker paralel (A: bi1–bi12, B: bi13–bi24, C: e1–e22), masing-masing dengan brief berisi data gap per file, kalibrasi durasi (target 48–58, buffer ±40%), arah materi advanced, aturan F1/F2 eksplisit, dan kewajiban `tsc --noEmit` di akhir batch sendiri.

## 0. Angka final (verifikasi koordinator — re-bundle registry + skrip audit identik 14 Okt + tsc)

| Metrik | Sebelum | Sesudah |
|---|---|---|
| Bioinformatika: rata-rata | 41,3 | **49,8** |
| Bioinformatika: <45 mnt | 17/24 | **0** (min 48,0 — tidak ada yang mepet; max 58,3) |
| Financial Markets: rata-rata | 44,7 | **52,0** |
| Financial Markets: <45 mnt | 13/22 | **0** (min 48,2; max 63,1) |
| Komponen hilang (kedua track) | semua yang ter-flag | **0** |
| Lesson tanpa note Intuisi | 46/46 | **0** |
| `npx tsc --noEmit` | — | **0 error** |

- **Platform keseluruhan:** lesson <45 mnt **88 → 58** dari 607 (30 lesson terangkat — tepat 17+13, konsisten).
- **F1: 0 temuan** — scan koordinator 5 frasa terlarang atas 46 file (konten baru + lama).
- **F2: 0 pelanggaran tersisa** — scan koordinator atas 46 file (eksklusif `biz*`, track berbeda); 25 perbaikan (16 worker + 9 koordinator) — rincian §4.

## 1. Rincian per file — bi1–bi12 (batch A)

| File | dur → | est | Ditambahkan (advanced) |
|---|---|---|---|
| bi1-biologi-molekuler | 39,5 → **48,5** | 50 | Intuisi + 2 langkah (revisi dogma: splicing 95%/m6A/lncRNA/anotasi; pengecualian: reverse transcription, prion, epigenetik) + formulaNote jarak genetik + 2 quiz |
| bi2-database | 38,3 → **49,1** | 50 | Intuisi + 2 langkah (rilis/versi/koordinat hg19→hg38 + liftover; E-utilities 3/10 req-detik & Ensembl REST + cache/pin) + 3 quiz |
| bi3-format-data | 39,0 → **50,4** | 50 | Intuisi + 2 langkah (SAM FLAG bitwise, MAPQ 0, CIGAR; VCF INFO/FORMAT, `./.`, Ts/Tv ~2,0–2,1) + formulaNote Phred + 3 quiz |
| bi4-command-line | 38,1 → **49,3** | 50 | Intuisi + 2 langkah (`set -euo pipefail`, tulis-tmp-rename, paralel = min(core, RAM/proses); tmux/sbatch, reproduksibilitas Git+env+seed) + 3 quiz |
| bi5-biopython-r | 37,4 → **48,2** | 50 | Intuisi + 2 langkah (SeqIO.parse lazy vs `list()` OOM, SeqIO.index, fread; script idempoten + TSV/Parquet) + 3 quiz |
| bi6-alignment | 39,2 → **50,1** | 50 | Intuisi + 2 langkah (BLOSUM62 vs PAM250, affine gap 11/1; semiglobal, 4 pola tipuan, %id+panjang+E-value) + 3 quiz |
| bi7-filogenetika | 38,6 → **49,2** | 50 | Intuisi + 2 langkah (JC69→GTR+G+I, pilih via BIC; bootstrap vs posterior, long-branch attraction + microsporidia) + 3 quiz |
| bi8-ngs-pipeline | 40,2 → **48,7** | 50 | Intuisi + 2 langkah (GC bias, duplikasi >20%, MultiQC fail-fast; depth 30x/100x/500x, diminishing returns) + 2 quiz |
| bi9-rna-seq | 38,5 → **49,6** | 50 | Intuisi + 2 langkah (RPKM vs TPM vs median-of-ratios; batch ke model, confounded = cacat desain, shrinkage) + 3 quiz |
| bi10-statistik-bioinfo | 38,6 → **49,7** | 50 | Intuisi + 2 langkah (5e-8 = 0,05/1 jt, BH vs Bonferroni, p-hacking; stratifikasi, QQ plot, λ>1,10, 10 PC/LMM) + formulaNote Power + 3 quiz |
| bi11-single-cell | 37,2 → **48,0** | 50 | Intuisi + 2 langkah (doublet ~0,8%/1k sel, SoupX, %MT per jaringan; resolution 0,4–1,2, 3 bukti klaim sel baru) + 3 quiz |
| bi12-genomika-populasi | 39,2 → **48,1** | 50 | Intuisi + 2 langkah (LD r², pruning r²>0,2, tag SNP+imputasi; underrepresentasi Indonesia, PRS portabilitas, etika: Havasupai, Gymrek 2013) + formulaNote HW + 2 quiz |

## 2. Rincian per file — bi13–bi24 (batch B)

| File | dur → | est | Ditambahkan (advanced) |
|---|---|---|---|
| bi13-epigenomik | 38,5 → **48,5** | 50 | Langkah "Kontrol, ambang, dan batch: sisi gelap peak calling" (q-value MACS2, kontrol input ×3 bias, batch+IDR, ChromHMM, FRiP, contoh CTCF) + formulaNote beta/M-value + Intuisi + 2 quiz |
| bi14-metagenomik | 37,9 → **48,5** | 50 | Langkah "De novo vs referensi, kontaminan, dan surveilans" (Kraken2 vs MEGAHIT/MAG/CheckM, kitome+decontam 15–40%, HUMAnN, surveilans AMR Indonesia + dual-use) + Intuisi + 2 quiz |
| bi15-proteomik | 37,2 → **50,6** | 50 | Langkah "FDR dua level, LFQ vs TMT, nilai yang hilang" (FDR PSM vs protein, ratio compression TMT, MNAR vs MAR + aturan imputasi) + Intuisi + 4 quiz |
| bi16-ml-bio | 37,1 → **48,2** | 50 | Langkah "Leakage genomik, homology-aware CV, kotak hitam" (3 wajah leakage, homology-CV, AUC 0,95→0,72, SHAP, checklist 5 pertanyaan) + Intuisi + 3 quiz |
| bi17-reprodusibilitas | 36,3 → **48,4** | 50 | Langkah "Container, versioning data, FAIR" (Snakemake DAG, Docker vs Singularity, DVC, seed, dry-run/lint/CI) + Intuisi + 3 quiz |
| bi18-capstone-de | 46,5 → **58,3** | 60 | Mini-case bernomor "Rp24 juta untuk data yang tak bisa menjawab" (underpowered n=3, batch confounded, power, 4 aturan desain) + Intuisi + 1 quiz |
| bi19-genome-assembly | 47,2 → **48,3** | 50 | Intuisi (N50≠kebenaran, repeat>read, plasmid vs kromosom) — isi sudah advanced |
| bi20-gatk-best-practices | 47,5 → **48,7** | 50 | Intuisi — isi sudah advanced (BQSR, pairHMM, VQSR, joint genotyping) |
| bi21-cancer-genomics | 53,7 → **54,7** | 55 | Intuisi — isi sudah advanced (NMF signature, dN/dS, TMB, clonal evolution) |
| bi22-spatial-transcriptomics | 49,5 → **50,5** | 50 | Intuisi — isi sudah advanced (Visium/HD/Xenium, dekonvolusi, Moran's I) |
| bi23-pharmacogenomics | 50,2 → **51,3** | 50 | Intuisi — isi sudah advanced (star allele/PharmVar, CPIC, phenoconversion, bias ancestri) |
| bi24-alternative-splicing | 46,2 → **49,9** | 50 | Intuisi + 1 quiz kompak (ΔPSI vs kedalaman junction) — isi sudah advanced (PSI, rMATS/long-read) |

## 3. Rincian per file — e1–e22 (batch C)

| File | dur → | est | Ditambahkan (advanced) |
|---|---|---|---|
| e1-struktur-pasar | 42,0 → **53,0** | 50 | Step "Mikrostruktur lanjut" (order book, spread, adverse selection, tick bertingkat IDX, ARA/ARB, biaya implisit) + lab order-book (stdout terverifikasi) + Intuisi |
| e2-instrumen | 49,4 → **50,7** | 50 | Intuisi (senioritas klaim, biaya tak terlihat) |
| e3-tvm | 55,0 → **63,1** | 65 | Mini-case "Lunasi KPR atau beli ORI? Duel Rp500 juta" + Intuisi |
| e4-obligasi | 43,2 → **55,1** | 55 | Step "Kurva SBN, key-rate duration, kupon dipajaki" (twist kurva, PPh 10% → kupon 7% = bersih 6,3%) + rumus ΔP + formulaNote + lab + Intuisi |
| e5-credit-spread | 40,3 → **51,4** | 50 | Step "Membedah spread 180 bps" (EL 18bps vs premi 162bps, CDS, 3 peringatan rating) + formulaNote EL + lab + Intuisi |
| e6-ekuitas | 39,5 → **51,4** | 50 | Step "Rights issue, stock split, harga semu IDX" (TERP 933,33, free float <10%) + rumus + formulaNote + lab + Intuisi |
| e7-return-risiko | 44,2 → **55,5** | 55 | Step "Geometris vs aritmatika: kapan Sharpe berbohong" (volatility drag, drawdown, Volmageddon 2018, Sortino/Calmar) + mini-case "Dana GEBYAR vs TENANG" + formulaNote ×3 + Intuisi |
| e8-markowitz | 38,9 → **49,1** | 50 | Step "Error-maximizer" (Michaud, DeMiguel 1/N 2009, Ledoit-Wolf, Black-Litterman, 3 rem praktis) + lab + Intuisi |
| e9-capm | 40,2 → **52,0** | 50 | Step "Beta yang goyang" (Vasicek, Blume, FF3+Carhart, low-beta anomaly) + formulaNote + lab + Intuisi |
| e10-derivatif | 43,7 → **55,8** | 50 | Step "Margin, basis, lindung nilai tak sempurna" (Metallgesellschaft, basis risk, roll risk) + formulaNote + lab + Intuisi |
| e11-black-scholes | 40,5 → **51,3** | 55 | Step "Senyum volatilitas" (vol skew pasca-1987, 4 asumsi retak, BS sebagai penerjemah harga→IV) + formulaNote greeks + lab + Intuisi |
| e12-fx-suku-bunga | 39,9 → **50,6** | 50 | Step "Carry trade, CIP, transmisi BI rate" (unwind 2008/2020, rantai BI rate lag 3–6 bln) + formulaNote + lab + Intuisi |
| e13-market-risk | 49,6 → **50,6** | 55 | Intuisi (VaR vs ES, backtest sebagai poligraf, stress test) |
| e14-money-market | 47,0 → **48,2** | 50 | formulaNote repo + Intuisi (likuiditas vs solvabilitas) |
| e15-indonesia | 47,3 → **48,3** | 50 | Intuisi (SBN ritel = risk-free Rp, PPh, plafon LPS) |
| e16-efisiensi-pasar | 41,2 → **51,6** | 50 | Step "Batas arbitrase" (anomali, Shleifer-Vishny, short-selling IDX, data snooping) + lab + Intuisi |
| e17-makro-siklus | 40,4 → **50,7** | 50 | Step "Kurva terbalik & indikator" (inversi 10Y–2Y, dasbor 5 indikator Indonesia) + lab + Intuisi; est 45→50 |
| e18-laporan-keuangan | 51,4 → **52,7** | 55 | formulaNote DuPont + Intuisi (laba=opini/kas=fakta) |
| e19-real-estate-reit | 40,9 → **52,6** | 55 | Step "NAV, FFO, membaca REIT" (diskon/premi NAV, FFO/AFFO vs P/E, WALE, leverage, yield spread vs SBN) + rumus + formulaNote + lab + Intuisi (34→194 kata) |
| e20-asuransi-dana-pensiun | 49,4 → **50,2** | 55 | Intuisi (float, combined ratio, funded ratio; 34→176 kata) |
| e21-investment-banking | 49,6 → **50,6** | 55 | Intuisi (underwriting=pindah risiko, rantai makanan ritel) |
| e22-reksa-dana-etf | 49,0 → **50,0** | 55 | Intuisi (TER vs tracking difference, likuiditas ETF) |

- 12 lab baru di batch C: semua solution dieksekusi python3, stdout persis expected (spot-check koordinator: e1 `total_bayar=1819000`, e4 `kupon_bersih=63000`).
- Keputusan sadar: e3 di 63,1 — mini-case WAJIB (+6 mnt model), est 65; bukan penggelembungan.

## 4. Scan F1/F2 eksplisit (koordinator)

- **F1: 0 temuan** — 5 frasa terlarang WORKFLOW.md atas 46 file (konten baru + lama).
- **F2: 0 pelanggaran tersisa** dalam scope C7 (bi1–bi24, e1–e22; file `biz*` = track Business Intelligence berbeda, tidak disentuh).
- **25 perbaikan F2:** worker A 2 (bi1 `(BI2)` → recap database varian; bi6 `(BI7)` → recap filogenetik); worker B 11 (bi18 ×6, bi20 ×3, bi21 ×1, bi24 ×3 — recap RPM/uji-t/BH, pipeline, multiple testing, DE-vs-DS); worker C 3 (e2, e5, e10); koordinator 9 (3 eyebrow "bekal dari lesson lain" → "bekal prasyarat" — pola C5; bi22 "(BI11)" → inline scRNA-seq; bi6 "dari lesson" → "dari lesson ini"; bi20 RNA → recap Split'N'Trim; e12 "(E10)"/"(E7)" → recap forward & bunga riil; e16 "(E15)" → dihapus; e20 "lesson lain" → inline; e8 "(E9)" → recap CAPM; e15 "(E4!)" → recap harga obligasi vs suku bunga).
- Insiden edit koordinator: penggantian e8 sempat memakai escape `\"` di string TS → tsc error; diperbaiki dengan menghilangkan tanda kutip sama sekali. Pelajaran: saat inline-recap di string `"` ber-quote, hindari kutip baru.
- F3: angka konkret Indonesia (Rp24 jt, Rp500 jt, PPh 10%, ARB, SRBI), mode kegagalan (vol smile, Metallgesellschaft, portfolio insurance 1987), aturan keputusan. F4: 12 lab batch C dieksekusi & cocok. F5: prose RAW, KaTeX ikut konvensi file, tanpa entitas HTML. F6: semua aditif.

## 5. Cek tangga beginner→advanced (ujung atas) — verdict koordinator

- **Bioinformatika:** bi18 DIPERKUAT → advanced (mini-proyek DE end-to-end + mini-case desain eksperimen). bi19–bi24 SUDAH advanced (OLC/de Bruijn, BQSR/VQSR, signature NMF, Visium/HD/Xenium, PharmVar/CPIC, rMATS/long-read) → hanya Intuisi. Spot-check isi bi18 (judul langkah: capstone DE mini-proyek + "Rp24 juta untuk data yang tak bisa menjawab") & e19 (NOI/cap rate + mini-case ruko Rp3 miliar) mengonfirmasi level.
- **Financial Markets:** e19 DIPERKUAT → advanced (NAV/FFO/AFFO, WALE, yield spread vs SBN). e20/e21/e22 SUDAH advanced (pooling+float+DB/DC; bookbuilding+greenshoe; TER/tracking difference). e13/e18 SUDAH advanced (VaR/ES/backtest; DuPont/red flags). **Track kini menaiki tangga penuh beginner→advanced**, ujung atas berjiwa institusional Shiller (mikrostruktur IDX, vol smile & 1987, CDS, batas arbitrase, error-maximizer) + konteks Indonesia kuat.
- Track Bioinformatika menaiki tangga penuh beginner→advanced (ujung: capstone DE + cancer genomics + spatial + pharmacogenomics).

## 6. Kendala & catatan

- Worker A: 9/12 file sempat mendarat 45–47,9 di audit pertama → ditutup +1 quiz materi advanced/file (asesmen sah, bukan filler); bi11 47,8 → paragraf penguat hingga 48,0. Putaran audit kedua wajib dalam brief (kalibrasi terbukti).
- Worker B: error TS1117 duplicate `note:` di bi16 (lab sudah punya note "Sering salah") → diperbaiki (Intuisi dipindah ke lab-cv kosong). Pelajaran program C7 diperbarui: cek note per step sebelum menambah (sudah di brief awal, tetap terjadi — verifikasi koordinator menangkapnya via tsc).
- Worker C: duplikat step e1 (import ulang skrip) → terdeteksi via audit, dihapus; bug kutip `""` di e19/e20 → tertangkap tsc.
- estMinutes semua kelipatan 5 mengikuti model (e.g. bi18 75→60, e3 55→65).
- Total platform <45 mnt kini **58/607** (dari 88 sebelum C7). Gelombang berikutnya per peta program: **C8 (Market Risk + Statistika)**, lalu C9 (sapu bersih).
- Tidak ada deploy.
