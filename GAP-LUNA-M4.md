# Gap Luna M4 — Machine Learning Finance (12 Nov 2026)

**Analis:** Luna via Kelontong (`gpt-6-luna`), 1 panggilan streaming,
prompt 294.823 B (5 file TS M4 + `m4_canonical.json`).
Mentah: `/tmp/gap_m4_luna_raw.txt` (12.205 B).
**Verifikasi induk:** SEMUA 11 gap diverifikasi ke file TS penuh + grep +
angka kanonis. **11/11 BENAR** (dengan 2 nuansa chief, lihat G2 dan G10).
Tidak ada satu pun dari 37 temuan DeepSeek M4 yang muncul lagi.

## Ringkasan

| No. | Severity | Status | Isi |
|---|---|---|---|
| G1 | must-add | TIPIS | Christoffersen: uji independensi exceedance + conditional coverage |
| G2 | must-add | HILANG | Atribusi P&L gabungan delta–gamma–vega–theta–rho |
| G3 | must-add | TIPIS | Alur operasional posisi → P&L → loss → VaR/ES |
| G4 | should-add | TIPIS | Backtest OOS EWMA + GARCH (bukan hanya VaR historis) |
| G5 | should-add | TIPIS | Stress return + stress gabungan (selain stress korelasi) |
| G6 | should-add | TIPIS | Deteksi regime real-time tanpa look-ahead |
| G7 | should-add | TIPIS | Integrasi output M4.2 + M4.3 ke M4.5 (tabel keputusan) |
| G8 | should-add | TIPIS | M4.1 → aturan trading, biaya, evaluasi ekonomi |
| G9 | nice-to-have | TIPIS | Kuantifikasi ketidakpastian + power backtest |
| G10 | nice-to-have | HILANG | Peta koneksi eksplisit ke M5 (optimasi) dan M9 (simulasi) |
| G11 | nice-to-have | TIPIS | Scenario matrix lintas VaR/ES/drawdown/stress |

## Verifikasi induk per gap

### G1 — must-add, TIPIS, BENAR
M4.3:55 menyebut Christoffersen eksplisit sebagai "arah lanjut tanpa
mengajarkannya penuh — karena satu gerbang yang dipahami lebih baik
daripada dua gerbang yang setengah dipahami"; kuis :450 menegaskan
"Kupiec buta terhadap clustering pelanggaran". Yang hilang: rumus +
transition counts (n00/n01/n10/n11) + LR independensi + conditional
coverage + contoh pelanggaran tersebar vs beruntun. Usulan fill: hitung
dari deret exceedance OOS 230 hari (notebook M4.3) — angka WAJIB
dihitung nyata dari data, bukan karangan.

### G2 — must-add, HILANG, BENAR (nuansa chief)
Grep `atribusi|attribution|cross-gamma|delta-gamma` di M4.4: satu-satunya
hit adalah NAMA langkah "delta-gamma", bukan konsepnya. Formula gabungan
ΔV ≈ ΔΔS + ½Γ(ΔS)² + Vega Δσ + ΘΔt + ρΔr tidak ada. Nuansa: langkah
delta-gamma SUDAH menyentuh interaksi delta-gamma (S +1% → $43,17 vs
perkiraan delta $43,16) — jadi bukan 100% satu-input-pada-satu-waktu;
yang hilang adalah atribusi multi-Greek + skenario gabungan. Angka
kanonis untuk skenario S +1%: delta $43,16 vs aktual $43,17.

### G3 — must-add, TIPIS, BENAR
M4.2 formulaNote: "VaR = minus kuantil (1 − alpha) dari distribusi
return R" — definisi ada, TAPI: grep `P&L` di M4.2 = **0 hit**; tidak
ada konvensi loss L = −P&L; tidak ada alur posisi → return portofolio
berbobot → P&L rupiah → loss → kuantil. Konversi Rp memang ada
(VaR95 0,0286 → Rp2.856.323; ES95 0,0445 → Rp4.451.285), tapi prosedur
operasional lengkapnya belum diajarkan. Usulan fill: diagram alur +
checklist implementasi (adjusted close, portfolio value tetap, biaya
transaksi/funding diabaikan, rebalance harian = exposure kembali).

### G4 — should-add, TIPIS, BENAR
M4.3:214: "backtest KEDUANYA dengan Kupiec out-of-sample dari langkah 5"
— perintah ada, hasilnya tidak: angka Kupiec OOS (VaR95 15 vs 11,5;
VaR99 4 vs 2,3) hanya untuk VaR historis rolling 250 hari. EWMA
(VaR95 kondisional 0,0601) dan GARCH (VaR95 0,0334 / VaR99 0,0472)
hanya titik akhir, tanpa jumlah exceedance / Kupiec / clustering.
**PERINGATAN FILL: angka exceedance EWMA/GARCH WAJIB dihitung nyata
dari `data/m4_prices.csv` (skrip deterministik). Bila backtest GARCH
rolling penuh terlalu berat, pakai EWMA penuh + GARCH refit berkala
yang dinyatakan jujur — JANGAN karang angka.**

### G5 — should-add, TIPIS, BENAR
M4.5 mengajarkan correlation stress dan membedakannya dari return
stress (:290, :360, :397 "stress korelasi ≠ stress return"), tapi TIDAK
ada worked example shock return (mis. "semua saham turun 10%" hanya
disebut sebagai contoh pertanyaan) atau skenario gabungan dengan P&L
Rp100 jt. Crash 16 Okt hanya narasi, bukan skenario hitung. Usulan
fill: 3 skenario (return historis / volatilitas / gabungan) + P&L +
VaR/ES + diversification ratio per skenario; angka return tambahan
berlabel [ilustrasi].

### G6 — should-add, TIPIS, BENAR
M4.5 memperingatkan ex-post/look-ahead (:129, :134, :171, :410), tapi
tidak memberi prosedur real-time: threshold persentil dari data
historis yang tersedia saja + keputusan t+1 dari label t. Usulan fill:
timeline data → threshold → label hari ini → posisi/buffer besok +
latihan walk-forward; ambang kanonis 0,3316 sebagai threshold
full-sample DITANDAI look-ahead bila dipakai untuk keputusan historis.

### G7 — should-add, TIPIS, BENAR
M4.5 MERUJUK M4.2 (VaR99 statis 0,0479 di figure :137/:152/:165 dan
:408) dan M4.3 (autokorelasi 0,1043, GARCH :132) — TAPI VaR kondisional
EWMA/GARCH tidak dipakai di hasil regime/stress M4.5 (grep ewma|garch
di M4.5 = 2 hit, hanya rujukan). Tabel keputusan (static vs
conditional vs regime vs stress VaR) tidak ada. Usulan fill: tabel
integrasi + pilihan buffer per kondisi; contoh kegagalan agregasi:
VaR99 high-vol 0,0761 vs statis 0,0479.

### G8 — should-add, TIPIS, BENAR
Grep `trading|biaya transaksi|turnover|P&L|profitable` di M4.1 = 1 hit
(hanya intro "market risk & trading"). Lesson menyimpulkan LR +0,6pp
di atas naive dan memperingatkan akurasi, tapi tidak ada aturan
trading (threshold ≠ 0,50, long vs flat), hit rate, confusion matrix,
turnover, biaya, atau return setelah biaya. Usulan fill: worked example
probabilitas → keputusan + evaluasi ekonomi minimal; nyatakan jujur
bila tanpa simulasi P&L: akurasi saja tidak membuktikan profitable.
Baseline kanonis: RF 0,5250 / LR 0,5688 / naive 0,5625.

### G9 — nice-to-have, TIPIS, BENAR
M4.1:89 "selang ketidakpastian yang lebar" tanpa hitung; M4.3:92 power
VaR99 naratif ("hampir tidak punya kuasa", ekspektasi 2,3 dari 230
hari) tanpa sensitivitas. Usulan fill: interval akurasi 160 hari test
(LR vs naive) + interpretasi exceedance VaR99 2 vs 4 vs 6 dari 230
hari; tekankan "tidak ditolak" ≠ presisi tinggi.

### G10 — nice-to-have, HILANG, BENAR (nuansa chief)
Grep `M5|M9|optimasi` di M4: satu-satunya hit relevan M4.2:207
("Teori Monte Carlo yang penuh ... Itu materi M9"). Tidak ada satupun
penyebutan M5; "optimasi" di M4.3 adalah optimasi numerik MLE GARCH,
bukan optimasi portofolio. Peta transisi (component/marginal VaR →
objective/constraint M5; Monte Carlo/walk-forward/backtesting → M9)
memang HILANG. Usulan fill: peta + tugas integratif (pilih bobot baru
dari marginal/component VaR, validasi OOS + stress korelasi — tanpa
klaim hasil optimasi sebelum M5).

### G11 — nice-to-have, TIPIS, BENAR
Tidak ada scenario matrix (normal / high-vol / low-vol / correlation
stress × VaR95 / VaR99 / ES / maxDD / DR / mitigasi). Rangkuman M4.5
menyebut angka-angka itu tersebar, bukan sebagai matriks dengan
ranking + tindakan. Angka kanonis tersedia: VaR99 statis 0,0479,
high-vol 0,0761, low-vol 0,0456, stress VaR95 0,0431.

## Tugas ronde fill
Isi 11/11 gap (3 must + 5 should + 3 nice). Langkah baru atau perluasan
langkah yang ada; kuis/lab ditambah bila materi baru memerlukannya.
Angka baru WAJIB dari kanonis/notebook/data pin, atau berlabel
[ilustrasi]; G1 + G4 WAJIB hitung nyata dari data (skrip deterministik
disimpan di qa-learn/). Sinkron TS + .md. Update QA (fixture + kelas
concept gate baru bila ada pola baru). Guards + tsc + concept gate
PASS. Lalu deploy M4.
