# LAPORAN G1 — 3 Lesson Track Blockchain Data Scientist
**Tanggal:** 2026-10-15 · **Pembangun:** subagent G1 · **Standar:** WORKFLOW.md v2.0 (13 komponen)

## Ringkasan
3 lesson baru dibangun, didaftarkan di `src/app/v2/lib/reg-bcd.ts`, dan lolos semua gerbang verifikasi:
| Lesson | Slug | File | estMinutes |
|---|---|---|---|
| BCD16 | `bcd16-stablecoin-analytics` | `src/app/v2/content/bcd16-stablecoin-analytics.ts` | 49 |
| BCD17 | `bcd17-concentrated-liquidity` | `src/app/v2/content/bcd17-concentrated-liquidity.ts` | 49 |
| BCD19 | `bcd19-l2-blobs` | `src/app/v2/content/bcd19-l2-blobs.ts` | 48 |

Hanya 4 file yang disentuh: 3 file lesson baru + `reg-bcd.ts`. `registry.ts`, `Workspace.tsx`, dan file lain TIDAK disentuh.

---

## BCD16 — Stablecoin Analytics: Mengukur Kapan 'Stabil' Goyah
- **Judul terkunci:** "Stablecoin Analytics: Mengukur Kapan 'Stabil' Goyah" ✓
- **8 langkah:** cerita (tiga harga USDC malam SVB) → 3 metrik depeg → mint/redeem flows → lab detektor depeg → DEX vs oracle → peta keputusan 5 skenario → mini-case malam SVB → checkpoint.
- **Estimasi 49 mnt** = 3477 kata/180 (19,3) + lab 1×8 + kuis 6×2 + chart 1×2,5 + case 1×6 + rumus 1×1 = **48,8**.
- **Lab Pyodide:** deteksi event depeg dari 48 harga/jam sintetis (berlabel SINTETIS) + net redeem kumulatif. Output: `n_event: 1 | event jam 21-26: durasi=6 jam, kedalaman=-3.10% | net_redeem_event: -1431.5 $jt`. **PASS 4/4 checks di Pyodide headless nyata** (npm `pyodide@0.27.5`, `loadPyodide`, `runPythonAsync`).
- **Kuis:** 6 soal × 4 opsi, tiap opsi ada `why` spesifik, tepat 1 `correct: true` per soal.
- **Miskonsepsi:** 2 (`type: "pitfall"`); **Tips:** 4 (💡); **Chart:** 1 SVG + "Cara membaca" + "Interpretasi"; **Rumus:** 1 (`String.raw`, backslash tunggal).
- **`summary:` = 1 occurrence, 6 butir** ✓ · **tsc: 0 error** ✓ · **F1 filler: 0** ✓
- **Angka dari sumber yang dibuka:** riset S&P Global via Cointelegraph (2023-09-12): USDC < $0,90 selama 23 menit, DAI 20 menit; USDT < $0,95 hanya 1 menit; BUSD tak pernah < $0,975 (Jun 2021–Jun 2023); USDC $0,87 Mar 2023; Circle $3,3M dari $40M cadangan di SVB; MakerDAO 3,1M USDC menopang DAI. Semua angka lain = sintetis berlabel jelas.
- **Batas rantai mr21/aml18 — DINYATAKAN TIDAK DILANGGAR:** lesson ini PENGUKURAN ON-CHAIN SAJA (deviasi/durasi/kedalaman depeg, net mint/redeem flow, spread DEX vs oracle). Yang **TIDAK dibahas**: VaR, hedging, limit eksposur, konstruksi portofolio (wilayah mr21); penegakan hukum, tipologi pencucian uang, sanksi (wilayah aml18). Satu-satunya kalimat yang menyentuh batas ("keputusan lindung nilai… di luar cakupan") dipakai sebagai penanda batas eksplisit, lalu framing dikembalikan ke pengukuran. Mini-case "malam SVB" hanya meminta klasifikasi metrik + desain dashboard, tanpa rekomendasi trading/hedging.

## BCD17 — Concentrated Liquidity & Hooks: Anatomi LP Modern
- **Judul terkunci:** "Concentrated Liquidity & Hooks: Anatomi LP Modern" ✓
- **8 langkah:** cerita dua LP (Rina vs Dimas) → tick & range → duel fee vs IL → lab simulator posisi → hooks v4 → peta keputusan 5 skenario → mini-case sempit vs lebar ($50k, angka terhitung) → checkpoint.
- **Estimasi 49 mnt** = 3315 kata/180 (18,4) + 8 + 12 + 2,5 + 6 + 2 = **48,9**.
- **Lab Pyodide:** tick math (`p=1.0001^tick`, tick 80068 ↔ $3000) + komposisi posisi konsentrat [2700,3300] di $3000 vs $3450 + IL vs HODL + banding IL v2. Output: `IL v3: -4.49% | IL v2: -0.24%` (amplifikasi ~19x), `net setelah fee $1200: -1379.3 USDC`. **PASS 4/4 checks di Pyodide headless nyata.**
- **Kuis:** 6 × 4 opsi + `why` spesifik ✓ · **Miskonsepsi:** 2 · **Tips:** 4 · **Chart:** 1 SVG + panduan baca · **Rumus:** 2 (`String.raw`).
- **`summary:` = 1, 6 butir** ✓ · **tsc: 0 error** ✓ (1 bug `${FEE:.0f}` → interpolasi TS ditemukan & diperbaiki saat tsc; pola `${` kini 0 di semua file) · **F1: 0** ✓
- **Sumber dibuka:** dokumentasi resmi Uniswap — `developers.uniswap.org/docs/protocols/v4/concepts/hooks` (10 titik siklus hidup: before/after Initialize, AddLiquidity, RemoveLiquidity, Swap, Donate; izin di-encode di bit alamat via CREATE2/HookMiner; hook bagian dari PoolKey = permanen; hooks opsional, tanpa hook = perilaku v3) dan repo resmi `uniswap/docs` `content/protocols/overview.mdx` (singleton PoolManager, flash accounting). Tick math & fee tier (0,01%/0,05%/0,30%/1%) terkonfirmasi lintas sumber; angka efisiensi "4000x" disajikan sebagai batas teoritis + caveat eksplisit.
- **Tidak tumpang tindih bcd4:** bcd4 = x·y=k dasar; bcd17 mulai dari tick/range/virtual-reserves/IL-teramplifikasi/hooks (NOL di bcd4). Prasyarat bcd4 diringkas 2 kalimat (F2).

## BCD19 — L2 & Blob Analytics: Ekonomi Data di Balik Rollup
- **Judul terkunci:** "L2 & Blob Analytics: Ekonomi Data di Balik Rollup" ✓
- **8 langkah:** cerita truk kontainer → anatomi blob → pasar fee blob → lab simulator fee → ekonomi data rollup → peta keputusan 5 skenario → mini-case audit NusantaraChain → checkpoint.
- **Estimasi 48 mnt** = 3096 kata/180 (17,2) + 8 + 12 + 2,5 + 6 + 2 = **47,7**.
- **Lab Pyodide:** implementasi `fake_exponential` persis spesifikasi EIP-4844 + simulasi 34 blok (tenang→kongesti 24 blok→sepi). Output: `puncak: 16 wei di blok 28 | fee_2blob_puncak: 0.004194304 gwei` — mengajarkan hysteresis. **PASS 2/2 checks di Pyodide headless nyata.**
- **Kuis:** 6 × 4 opsi + `why` ✓ · **Miskonsepsi:** 2 · **Tips:** 4 · **Chart:** 1 SVG (34 bar + kurva fee) + panduan baca · **Rumus:** 2 (`String.raw`).
- **`summary:` = 1, 6 butir** ✓ · **tsc: 0 error** ✓ · **F1: 0** ✓
- **Sumber dibuka & klaim terverifikasi:** `eips.ethereum.org/EIPS/eip-4844` (tipe-3 `0x03`; 4096×32 byte = ~128 KiB/blob; target ~0,375 MB/blok, maks ~0,75 MB; target 3/maks 6 blob; `TARGET_BLOB_GAS_PER_BLOCK` 393216; pasar fee terpisah EIP-1559-style; `BLOBHASH` 0x49; precompile 0x0A 50.000 gas; blob tak bisa diakses EVM; `MIN_EPOCHS_FOR_BLOB_SIDECARS_REQUESTS` 4096 ≈ 18 hari) dan `status.network/blog/what-is-ethereum-dencun-upgrade-layer-2-fees` (Dencun **13 Maret 2024** = Cancun+Deneb; fee L2 turun 90–98%: Optimism ~$0,50→~$0,01, Arbitrum ~$0,30→~$0,01, Base ~$0,25→~$0,005, zkSync ~$0,20→~$0,01).
- **Klaim yang dibatasi/diturunkan:** Pectra/EIP-7691 (target 3→6, maks 6→9) dicantumkan HANYA dengan atribusi ke sumber sekunder terbuka (status.network) + catatan "verifikasi ke spesifikasi EIP untuk keputusan penting"; klaim detail Fusaka **dihilangkan** — hanya disebut sebagai roadmap (PeerDAS) per sumber yang sama, tanpa angka/tanggal. Prasyarat bcd2/bcd14 diringkas 3 kalimat (F2).

## Sumber yang benar-benar dibuka (URL verbatim)
1. https://cointelegraph.com/news/usdc-dai-depegged-more-than-usdt-sp-global-research (bcd16)
2. https://eips.ethereum.org/EIPS/eip-4844 (bcd19)
3. https://status.network/blog/what-is-ethereum-dencun-upgrade-layer-2-fees (bcd19)
4. https://developers.uniswap.org/docs/protocols/v4/concepts/hooks (bcd17)
5. https://github.com/uniswap/docs/blob/HEAD/content/protocols/overview.mdx (bcd17)

## Bukti grep (ringkas)
- `grep -c 'summary:'` → 1 per file (bcd16/bcd17/bcd19); tiap summary 6 butir (batas 4–6) ✓
- Frasa filler F1 ("Pada lesson kali ini", "Seperti yang telah dibahas sebelumnya", "Mari kita mulai pembahasan", "Selanjutnya, kita akan melihat", "Penting untuk diingat bahwa") → **0** di semua file ✓
- `npx tsc --noEmit` → **0 error** di `bcd16*`, `bcd17*`, `bcd19*`, `reg-bcd.ts` ✓ (error di file track lain = pre-existing, bukan dari G1)
- Entitas HTML (`&amp;`/`&lt;`/`&gt;`) di prosa → 0 (prosa RAW sesuai aturan v2 2026-10-14) ✓
- KaTeX: semua `formula: String.raw` backslash tunggal; tidak ada command tanpa backslash ✓
- `lockLines` = jumlah baris starter persis (15/7/5) — diverifikasi via decode runtime ✓

## Catatan insiden
- Saat verifikasi bcd19, file harness `/tmp/pyodide-test/verify_labs.mjs` milik sesi ini tertimpa oleh proses lain di VM (direktori `/tmp` dipakai bersama agen paralel). Mitigasi: harness ditulis ulang ke path unik `/tmp/pyodide-test/g1_verify.mjs`; ketiga lab diuji ulang dari nol di path unik — hasil di atas berasal dari run ulang tersebut.
- Data non-S&P/non-EIP/non-Uniswap/non-Dencun di semua lab & contoh = **sintetis dan berlabel eksplisit** ("DATA SINTETIS") di starter code dan prosa.
