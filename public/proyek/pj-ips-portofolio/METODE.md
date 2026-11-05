# METODE — Proyek #5: Konstruksi Portofolio Berbasis IPS (gaya CFA)

Data 100% SINTETIS untuk proyek ini (generator: `scripts/gen_ips_data.py`,
`numpy.random.default_rng(42)` — deterministik). Bukan data pasar nyata;
klien, perusahaan, dan angka kasus fiktif. Parameter return diset menyerupai
orde-besaran aset Indonesia (SBN, deposito, pasar uang, LQ45, emas) tetapi
BUKAN klaim historis. Lisensi: data sintetis orisinal untuk proyek ini.

## File
- `return_bulanan.csv` — 180 baris (2011-01 s.d. 2025-12), kolom:
  `tanggal (YYYY-MM), sbn, deposito, pasar_uang, lq45, emas` (return RIIL bulanan, desimal).
- `atribusi.csv` — data atribusi Brinson Q1 2026, kolom:
  `kelas, w_portfolio, w_benchmark, r_portfolio, r_benchmark` (desimal, kuartalan).
- `klien.json` — angka kasus klien (PV, tabungan, horizon, target, pajak, batas IPS).

## Metode generasi
Return bulanan dibangkitkan dari distribusi normal multivariat dengan mean/vol
tahunan target dan matriks korelasi target, lalu tiap aset DIRESCALAKAN agar
mean dan vol SAMPEL-nya persis sama dengan target (korelasi sampel ≈ target).
Ini membuat capital market expectations (CME) ground truth eksak dan bisa
dihitung ulang dari file. Deretnya riil (sudah disesuaikan inflasi) — jadi
semua target return di proyek ini dinyatakan dalam istilah riil.

## Ground truth (dari harness, seed 42)

### 1. Capital market expectations — return riil tahunan (dari dataset)
| Aset | Expected return | Volatilitas |
|---|---|---|
| sbn | 3,50% | 2,00% |
| deposito | 1,50% | 0,80% |
| pasar_uang | 2,20% | 1,00% |
| lq45 | 7,50% | 18,00% |
| emas | 3,00% | 15,00% |

### 2. Return objective IPS
Kasus: PV Rp 8.000 jt, tabungan Rp 250 jt/thn, horizon 15 thn,
target FV Rp 20.000 jt (pensiun 16.000 + pendidikan 2.000 + waris 2.000).
Persamaan: PV(1+r)^15 + PMT·[((1+r)^15−1)/r] = 20.000
→ **r\* = 4,2358% riil** (dibulatkan 4,24%).

### 3. Kandidat Strategic Asset Allocation (bobot SBN/deposito/pasar_uang/LQ45/emas)
| Kandidat | Bobot | Exp. return | Vol | After-tax | Ekuitas≤40% | Likuid≥15% | Return≥r\* |
|---|---|---|---|---|---|---|---|
| A Konservatif | 45/15/10/25/5 | 4,045% | 4,71% | 3,80% | ✓ | ✓ | ✗ |
| B Seimbang | 35/10/10/35/10 | 4,520% | 6,61% | 4,32% | ✓ | ✓ | ✓ |
| C Agresif | 20/5/5/55/15 | 5,460% | 10,28% | 5,35% | ✗ | ✗ | ✓ |

**SAA terpilih = B (Seimbang)** — satu-satunya yang lolos SEMUA kendala IPS.
Pajak: PPh final obligasi/SBN 10%, deposito & pasar uang 20%; LQ45 & emas
dianggap bersih (biaya transaksi dibahas terpisah sebagai slippage).
After-tax B (4,32%) vs r\* (4,24%): pajak menipis margin hingga 0,08pp —
pelajaran intinya.

### 4. Atribusi Brinson Q1 2026 (ground truth exact)
Benchmark 2,235% | Portofolio 2,500% | Excess **+0,265%** =
allocation **+0,285%** + selection **+0,040%** + interaction **−0,060%**.

### 5. Pelanggaran konsultan impostor (ground truth eksplisit)
Usulan "konsultan": 85% satu saham (BBCA), 10% dua saham lain, 5% deposito;
janji return 12%/thn; klaim "tetap likuid", "sudah termasuk pajak",
"stop-loss 10% menggantikan diversifikasi".
- **I1 — Konsentrasi**: single-name 85% vs batas IPS 10% (8,5× lipat).
- **I2 — Janji return**: 12% vs CME LQ45 dari dataset 7,50% riil; jendela 3 tahun cherry-picked.
- **I3 — Likuiditas**: 5% × Rp 8.000 jt = Rp 400 jt < kebutuhan Rp 1.100 jt
  (darurat 300 jt + ekspansi klinik 800 jt dalam 18 bulan).
- **I4 — Pajak**: proyeksi pre-tax; after-tax riil usulan ≈ 11,3% pun tetap
  melanggar I1–I3 — pajak bukan masalah utamanya.
- **I5 — Kerangka risiko**: stop-loss bukan pengganti diversifikasi;
  tidak ada skema rebalancing, tidak ada kriteria bunuh.

## Kejujuran metodologis
1. Return "riil" dan parameternya adalah pilihan desain, bukan fakta pasar.
2. Pajak disederhanakan (PPh final per ketentuan saat proyek ditulis).
3. Optimasi SAA di proyek ini = evaluasi kandidat diskrit + cek kendala,
   bukan mean-variance optimizer kontinu — disengaja agar bisa dihitung tangan.
4. Angka atribusi "planted" agar tiap komponen Brinson terlihat terpisah.
