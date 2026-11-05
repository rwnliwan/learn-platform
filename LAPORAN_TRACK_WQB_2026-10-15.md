# LAPORAN PEMBANGUNAN TRACK BARU — "WorldQuant Brain" (Learn v2)

**Tanggal:** 2026-10-15 (WITA) · **Perintah:** Septian, 2026-10-14 23:05 WITA
**Prefix terpilih:** `wqb` (terverifikasi tidak bertabrakan dengan prefix v2 yang ada; tidak ada slug mengandung 'audit')

## Ringkasan eksekutif

Track baru **WorldQuant Brain** selesai dibangun: **21 lesson** dalam 3 busur, dari nol mutlak (pelajar yang belum paham Sharpe ratio) sampai strategi riset alpha aktual tim (materi 2026-10-14). Semua lesson memenuhi standar WORKFLOW.md v2.0 (≥45 menit model terukur, story hook, ≥2 miskonsepsi, ≥2 tips, lab Pyodide runnable, figure SVG, decision map, mini-case, kuis 4–6, Plotly+KaTeX). File hanya di `src/app/v2/content/wqb*.ts` + `src/app/v2/lib/reg-wqb.ts` + wiring `registry.ts`. Tidak ada lesson/track lain, komponen UI, atau file pilot yang disentuh. **Tidak deploy** (terpusat oleh parent).

## Daftar lesson per busur (slug + judul + durasi model)

### BUSUR 1 — Fondasi: Dari Nol (10 lesson)
| # | Slug | Judul | Durasi |
|---|------|-------|--------|
| 1 | wqb1-apa-itu-alpha | WQB1 — Apa Itu Alpha & Anatomi Satu Simulasi | 50,2 mnt |
| 2 | wqb2-returns-volatilitas | WQB2 — Returns & Volatilitas: Bahasa Dasar Pasar | 47,6 mnt |
| 3 | wqb3-sharpe-ratio | WQB3 — Sharpe Ratio dari Nol (dan Kenapa 1,25) | 50,0 mnt |
| 4 | wqb4-fitness-drawdown | WQB4 — Fitness, Drawdown & Konsistensi | 51,4 mnt |
| 5 | wqb5-turnover | WQB5 — Turnover: Biaya Tersembunyi yang Membunuh Alpha | 50,0 mnt |
| 6 | wqb6-delay-decay | WQB6 — Delay & Decay: Waktu Meluruhkan Sinyal | 45,2 mnt |
| 7 | wqb7-universe-region | WQB7 — Universe & Region: Di Mana Alpha Boleh Hidup | 45,0 mnt |
| 8 | wqb8-neutralization | WQB8 — Neutralization: Mengisolasi Sinyal dari Kebisingan Pasar | 45,0 mnt |
| 9 | wqb9-data-fields | WQB9 — Data Fields: Bahan Baku Alpha & Field yang Mati | 45,1 mnt |
| 10 | wqb10-fastexpr | WQB10 — FASTEXPR & Operator Inti: Menulis Alpha Pertamamu | 45,2 mnt |

### BUSUR 2 — Praktik & Diagnosis (5 lesson)
| # | Slug | Judul | Durasi |
|---|------|-------|--------|
| 11 | wqb11-membaca-hasil | WQB11 — Membaca Hasil Simulasi & IS Checks | 49,3 mnt |
| 12 | wqb12-sub-universe | WQB12 — Sub-Universe Sharpe: Ujian Ketat Kandidat Kuat | 49,9 mnt |
| 13 | wqb13-self-correlation | WQB13 — Self-Correlation: Gerbang Submit yang Sebenarnya | 50,3 mnt |
| 14 | wqb14-overfitting | WQB14 — Overfitting & Plafon Satu Family | 51,7 mnt |
| 15 | wqb15-korelasi-klaster | WQB15 — Korelasi Antar-Alpha: Berpikir Klaster, Bukan Baris | 50,4 mnt |

### BUSUR 3 — Strategi Riset Alpha (6 lesson, materi praktik nyata 2026-10-14)
| # | Slug | Judul | Durasi |
|---|------|-------|--------|
| 16 | wqb16-decay-sensitivity | WQB16 — Decay Sensitivity: Eksperimen yang Mengubah Peta | 51,9 mnt |
| 17 | wqb17-merancang-wave | WQB17 — Merancang Wave: Kolam Puncak, Kolam Lebar, Kolam Penyelamatan | 50,8 mnt |
| 18 | wqb18-ml-predictor | WQB18 — ML Predictor: Mesin Penilai Kandidat | 51,3 mnt |
| 19 | wqb19-triage-berlapis | WQB19 — Triage Berlapis: Dari 600 Kandidat ke Antrean Submit | 48,9 mnt |
| 20 | wqb20-strategi-cadangan | WQB20 — Strategi Cadangan Era Research Consultant | 46,3 mnt |
| 21 | wqb21-capstone | WQB21 — Capstone: Membaca Satu Paket Wave & Memutuskan | 47,0 mnt |

**Total materi: ±1.022 menit (±17 jam).** Tiap lesson: 2 lab Pyodide + 5 soal kuis ber-feedback (total 42 lab, 105 soal).

## Hasil verifikasi

| Verifikasi | Hasil |
|---|---|
| Kedalaman (model kata/180 + lab×8 + kuis×2 + chart×2,5 + case×6 + rumus×1) | **21/21 ≥ 45 menit** (rentang 45,0–51,9) |
| tsc --noEmit (scoped: 21 file konten + reg-wqb.ts) | **exit 0, 0 error** |
| tsc --noEmit full-project | masih berjalan saat laporan ditulis (mesin overload); file baru sudah bersih via scoped check |
| Harness Pyodide (node + pyodide 0.26.4): semua `code.solution` dijalankan, checks `stdout_matches` vs stdout nyata | **42/42 lab PASS** |
| KaTeX: 25 blok `String.raw` → `renderToString` | **25/25 OK**, 0 kasus backslash-ganda-sebelum-huruf |
| SVG: 30 figure — keseimbangan tag, entitas valid, tidak ada `<>&` mentah | **30/30 OK** |
| Shape test (esbuild bundle): slug/track/steps/lab/quiz | **21 lesson OK**; 21 quiz step, 105 soal, tiap soal tepat 1 jawaban benar |
| Render sweep lesson baru | tercakup via shape test + tsc; sweep render penuh di browser menunggu QA parent |
| Escaping v2 | prosa RAW `<>&`; entitas hanya di string const SVG; KaTeX `String.raw` satu backslash; pola `stdout_matches` untuk titik literal ditulis `\\.` |

## Bug lab yang ditemukan & diperbaiki (bukti baca-balik)

Harness menemukan 7 klaim angka yang salah di lab wqb11–wqb14 (ditulis sub-pekerja sebelum compaction; klaim ≠ output nyata). Semua diperbaiki agar `expected`/checks/prosa = output solusi yang sebenarnya:

1. **wqb11 lab-sharpe:** klaim Sharpe 1,59/DD 6,1% → aktual **2,21/6,7%** (seed 7). `expected`, 2 pola check, note, dan contoh fraksi diperbarui.
2. **wqb12 lab-hitung:** klaim nilai teoretis (2,21/1,87/1,68/0,58/1,49) ≠ sampel seed 21 (ASI −1,16!). Seed diganti **21 → 626** → sampel aktual **[2,23/2,17/1,59/0,58/2,19]**, ASI tetap 0,58 = minimum (cerita "mata rantai terlemah" utuh). `expected` + rata-rata di note (1,57 → 1,75) diperbarui.
3. **wqb13 lab-matriks:** klaim k3 [0,83/0,21] → aktual **[0,96/0,06]**. `expected`, prosa, dan pola check (`0\.8\d` → `0\.9\d`) diperbarui.
4. **wqb14 lab-snooping:** klaim Sharpe 1,62 → aktual **2,84** (lebih dramatis; prosa "bisa 1,5+" → "menembus 2,8"). `expected` + pola diperbarui.
5. **wqb14 lab-plafon:** klaim slope 0,0004 → aktual **0,0000** (deret alternasi = slope nol persis). `expected`, pola, `equal` check (value 0,0), note, dan 1 soal kuis diperbarui.

Perbaikan lab dari sesi sebelumnya (wqb5–wqb10, wqb20, wqb21) sudah lolos harness ulang tanpa perubahan.

## Total akhir

- **Track ke-25** di Learn v2 ("WorldQuant Brain", 21 lesson).
- Total lesson v2 terhitung: **515 lesson** dalam **25 track** (termasuk WQB).
- Wiring: `src/app/v2/lib/reg-wqb.ts` (baru) + `...REG_WQB` di `src/app/v2/lib/registry.ts`.

## Catatan & tindak lanjut untuk parent

1. **Jangan deploy** — sesuai perintah, deploy terpusat oleh parent.
2. Full-project `tsc --noEmit` masih berjalan (load mesin ekstrem); scoped check file baru bersih. Bila parent butuh konfirmasi penuh, jalankan ulang saat load turun.
3. Render sweep visual penuh (browser) belum dilakukan — disarankan ikut QA browser parent sebelum pengumuman ke Septian.
4. Aturan Septian: lapor total track & lesson yang di-upgrade ke CLAUDE.md + workflow 4 versi — belum dikerjakan (di luar batas file task ini).
5. Pelajaran tooling: di `muse.exec`, backslash di-un-escape sekali oleh transport (tulis skrip Python via `muse.write` ke /tmp lalu jalankan — heredoc inline merusak string TS).
