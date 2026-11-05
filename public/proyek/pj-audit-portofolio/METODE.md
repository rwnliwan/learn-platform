# METODE — Proyek "Audit Portofolio & Konsentrasi Tersembunyi" (`pj-audit-portofolio`)

## Sumber data

**Data pasar: Kenneth French Data Library** (publik, untuk riset/edukasi).
- Situs resmi: https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ — Kenneth R. French, Dartmouth College.
- File sumber (salinan mentah tersimpan di `~/workspace/portfolio-audit/data/raw/`, diunduh 2026-09-29, SHA-256 tercatat di `DATA_VERSION.md` proyek tersebut; basis data CRSP vintage 202608):
  - `10_Industry_Portfolios.txt` → blok *Average Value Weighted Returns — Monthly* (10 portofolio industri, value-weighted, % per bulan).
  - `F-F_Research_Data_Factors.txt` → faktor bulanan Mkt-RF, SMB, HML, RF (% per bulan).
- Atribusi: data disediakan Kenneth R. French; seluruh angka pasar di proyek ini berasal dari sumber tersebut. French Data Library tersedia gratis untuk tujuan penelitian dan pendidikan — sitasi penuh ada di briefing proyek.
- Slice yang dipakai: **2015-01 s.d. 2024-12** (120 bulan). Missing values (`-99.99`) → NaN (tidak ada yang jatuh di slice ini).

## Konstruksi seri "dana manajer" (SINTETIS, deterministik)

Seri dana BUKAN data nyata — ia dibangun dengan seed tetap agar konsentrasi tersembunyinya terukur persis:

- Bobot (jumlah = 1,000): HiTec 0,45 · Enrgy 0,25 · Manuf 0,06 · NoDur 0,05 · Shops 0,05 · Hlth 0,05 · Telcm 0,04 · Utils 0,03 · Durbl 0,01 · Other 0,01.
- Dua industri teratas = **70%** bobot. HHI(true) = Σw² = **0,2788** → N efektif ≈ **3,6** (dari 10 yang diklaim).
- Noise idiosinkratik: Normal(0; 0,25% per bulan), `numpy.random.default_rng(42)` — mewakili "stock picking" manajer; cukup kecil agar atribusi faktor tetap tajam.
- `imbal_fund_pct = Σ wᵢ · imbal_industriᵢ + noise`, dibulatkan 4 desimal.

Angka kunci yang dihasilkan (menjadi nilai acuan checks di lab):
- Sharpe annualized (excess over RF), 2015–2024: **0,73**
- Sharpe jendela klaim deck (2020–2021): **0,99**
- Maximum drawdown: **−25,85%**
- Regresi excess return ~ Mkt-RF + SMB + HML: R² = **0,93** · alpha = **+0,65%/tahun** (≈ nol) · beta pasar = **1,04**
- Estimasi bobot via OLS (tanpa intercept): HiTec ≈ 0,44 · Enrgy ≈ 0,25 · HHI ≈ 0,27 · N efektif ≈ 3,66
- Korelasi rata-rata antar 10 industri: **0,61**

## Klaim deck manajer (`deck_manajer.csv`) — FIKTIF, untuk latihan audit

Tabel klaim adalah **rekaan pedagogis** (angka-angka yang dilebihkan/dipalsukan manajer fiktif). Lima di antaranya adalah suntikan impostor yang harus ditemukan pelajar:
Sharpe 1,42 (tidak terreplikasi — jendela klaim pun 0,99) · "merata di 10 sektor" (HHI 0,28) · alpha +4,2%/tahun (regresi ≈ 0) · max drawdown −8% (aktual −25,85%) · korelasi antar-sektor 0,32 (aktual 0,61).

## File snapshot

| File | Isi | Ukuran |
|---|---|---|
| `fund.csv` | tanggal (YYYY-MM), imbal_fund_pct | ~1,9 KB |
| `industri.csv` | tanggal + 10 kolom industri (%/bulan) | ~7,5 KB |
| `faktor.csv` | tanggal, mktrf, smb, hml, rf (%/bulan) | ~3,5 KB |
| `deck_manajer.csv` | tabel klaim deck (fiktif) | <1 KB |
| `METODE.md` | file ini | — |

Total < 20 KB (batas 5 MB).

## Kejujuran metodologi

- Portofolio industri French adalah **konstruksi riset** (direkonstitusi tahunan), BUKAN ETF yang bisa dibeli — simulasi ini bukan track record yang bisa dieksekusi.
- Seri dana sintetis; klaim deck fiktif. Yang NYATA: seluruh seri industri & faktor (French) dan semua statistik yang dihitung darinya.
- Repro: jalankan `/tmp/pj_build_final.py` (seed 42) terhadap file mentah di atas → CSV identik.
