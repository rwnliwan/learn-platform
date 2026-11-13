# Gap Luna M5 — Machine Learning Finance (13 Nov 2026)

**Analis:** Luna via Kelontong (`gpt-6-luna`), 1 panggilan streaming,
prompt 330.640 B (5 file TS M5 pasca-fix + `m5_canonical.json`).
Mentah: `~/workspace/learn-platform/review/gap_luna_m5_raw.txt` (12.666 B).
**Verifikasi induk:** SEMUA 10 gap diverifikasi ke file TS penuh + grep.
**10/10 BENAR.** Tidak ada satu pun dari 27 temuan DeepSeek M5 yang muncul lagi.
**Catatan coin:** panggilan pertama GAGAL di akhir (helper `--out` ke
direktori `review/` yang belum ada → FileNotFoundError setelah API call
selesai; output hilang). Panggilan diulang setelah `mkdir -p review` dan
berhasil. Pelajaran: selalu `mkdir -p` direktori output SEBELUM panggil
Kelontong dengan `--out` (helper gagal di tahap tulis, setelah coin terpakai).

## Ringkasan

| No. | Severity | Status | Isi |
|---|---|---|---|
| G1 | must-add | HILANG | Transaction cost / bid-ask / slippage / turnover belum masuk objective/constraint yang dihitung |
| G2 | must-add | TIPIS | Prosedur rebalancing belum diajarkan sebagai proses operasional |
| G3 | must-add | HILANG | Robust optimization / uncertainty set belum diajarkan meski dijanjikan |
| G4 | must-add | TIPIS | Validasi numerik input optimasi (PSD, conditioning, singularitas, inversi) belum dipraktikkan |
| G5 | should-add | HILANG | Sensitivity analysis sistematis terhadap input/constraint/hyperparameter belum dibuat |
| G6 | should-add | TIPIS | Sensitivitas Black-Litterman terhadap tau / Omega / confidence view / market proxy belum diajarkan |
| G7 | should-add | TIPIS | Backtesting portfolio hanya satu split OOS; belum ada rolling / walk-forward |
| G8 | should-add | HILANG | Koneksi optimizer → implementasi keputusan (target holdings, trade list, cash residual, feasibility) |
| G9 | nice-to-have | HILANG | Higher-moment / downside-risk optimization belum diperkenalkan |
| G10 | nice-to-have | TIPIS | Constraint realistis (group exposure, minimum holding, lot size, turnover budget) baru disebut |

## Verifikasi induk per gap

### G1 — must-add, HILANG, BENAR
Kutipan terkonfirmasi: M5.2:38 "meja trading membatasi turnover karena
biaya" (motivasi saja); M5.3:232-233 "tidak ada biaya transaksi, tidak ada
bid-ask spread" (dinyatakan sebagai batasan, tanpa formulasi). Grep
`biaya transaksi|transaction cost|bid-ask|slippage`: hanya 1+2+1 kemunculan
naratif. Tidak ada `cost = spread + slippage + commission` di 5 lesson.

### G2 — must-add, TIPIS, BENAR
Kutipan terkonfirmasi: M5.3:232 "tidak ada rebalancing"; M5.5:214
"Turnover: seberapa jauh bobot bergerak bila jendela estimasi digeser?"
(pemeriksaan, bukan prosedur). Grep `rebalancing|rebalance`: 1 hit M5.3 +
1 hit M5.4. Tidak ada lifecycle estimate → optimize → execute → rebalance.

### G3 — must-add, HILANG, BENAR (+ nuansa Chief)
Kutipan terkonfirmasi: M5.2:447 menjanjikan "Di sana kamu akan bertemu
shrinkage, robust optimization..." — tapi grep `robust optimization|
uncertainty set|worst-case`: 1 hit (janji itu sendiri, di M5.2), 0 hit di
M5.3. **Nuansa Chief: ini bukan sekadar HILANG, tapi forward-reference
yang patah** — lesson menjanjikan topik yang tidak pernah datang. Fix
harus juga memperbaiki janji di M5.2:447 bila robust optimization tidak
diajarkan penuh di ronde ini.

### G4 — must-add, TIPIS, BENAR
Kutipan terkonfirmasi: M5.2:116 "mungkin Σ hampir singular" (diagnosis
naratif); kuis Q :484 "Selisih 0,0008 membuktikan Σ hampir singular"
(ditandai salah). Grep eigenvalue/condition number/PSD/`np.linalg.cond`:
0 hit. Tidak ada langkah yang menguji eigenvalue, condition number, atau
kegagalan inversi.

### G5 — should-add, HILANG, BENAR
Grep `sensitivitas|sensitivity`: 1 hit naratif di M5.5. Tidak ada lab yang
mengubah satu input pada satu waktu (rf, target return, kovarians, batas
bobot, shrinkage intensity).

### G6 — should-add, TIPIS, BENAR
Kutipan terkonfirmasi: M5.5:26 "tau 0,05"; :149 "View yang terlalu yakin
(Omega kecil) akan mendominasi posterior"; :153 formulaNote tau = 0,05.
`Omega` 17 kemunculan di M5.5 — semuanya pemakaian satu nilai, bukan
variasi. Tidak ada worked example/lab yang mengubah tau, Omega, confidence,
atau market proxy.

### G7 — should-add, TIPIS, BENAR
Grep `walk-forward|rolling window|expanding window`: **0 hit di 5 lesson**.
Kutipan terkonfirmasi: M5.5:26 "Split out-of-sample: 240 hari pertama
untuk estimasi, 240 hari berikut untuk uji" — satu split, satu rezim
(periode 2 = crash merata).

### G8 — should-add, HILANG, BENAR
Grep `trade list|holdings|lot size`: **0 hit di 5 lesson**. Bobot berhenti
di angka (M5.1 "w_baru = (0,5193; 0,4807)"); checklist M5.5 hanya leverage,
konsentrasi, turnover.

### G9 — nice-to-have, HILANG, BENAR
Grep `semivariance|downside deviation|downside-risk|ES-min`: **0 hit**.
Kutipan terkonfirmasi: M5.3:231 "lengkapi mean-variance dengan ukuran
risiko ekor (VaR/ES, M4.2–M4.3)" — itu referensi, bukan optimasi dengan
ukuran tersebut.

### G10 — nice-to-have, TIPIS, BENAR
Kutipan terkonfirmasi: M5.2:24 "kendala praktis lain: batas bobot,
turnover, sector"; contoh `w_UNVR ≤ 0,50` ada (naratif, 5 kemunculan).
Grep `sector cap|cardinality|minimum holding|group exposure`: **0 hit**.
Tidak ada contoh sector exposure yang dihitung atau constraint diskret.
