# PILOT FITUR FLAGSHIP — "Impostor × Guided Project × Data Brain"
Tanggal: 2026-10-14 · Keputusan Septian 23:04 WITA · Status: DIBANGUN & TERVERIFIKASI (belum deploy — deploy terpusat oleh parent)

## Ringkasan
Lesson guided-project utuh **RR19 — Audit Paket Alpha: Misi Auditor & Sang Impostor**: pelajar berperan sebagai auditor risiko yang memeriksa paket 16 hasil simulasi alpha NYATA (snapshot read-only Turso `brain_sims`, 2026-10-14). Tanpa pengumuman, 5 sabotase disuntikkan ke dalam dossier; pelajar menandai anomali per baris, lalu debrief membuka semua suntikan + skor deteksi + penjelasan bahaya di pekerjaan risiko nyata.

## Penempatan
- **Slug:** `rr19-audit-impostor`
- **Track:** Risk Reporting (bukan track kuantitatif baru)
- **Alasan:** (1) proyek audit = pekerjaan inti analis risk reporting — memeriksa paket, QA data, insiden; (2) tidak ada track WorldQuant Brain/kuantitatif di registry v2 (lesson wqb hanya ada di v1 legacy) — membuat track baru untuk satu pilot adalah overkill; (3) prasyarat natural sudah ada di track ini: rr4 (data quality), rr12 (insiden), rr14 (capstone). Lesson ini adalah "capstone 2" yang merangkai ketiganya.
- **Registrasi:** `src/app/v2/lib/reg-rr.ts` (+1 import, +1 entri) → otomatis terbaca `getV2Lessons()` via spread `REG_RR` di `registry.ts` (terverifikasi: track rr kini 19 lesson).

## Dataset snapshot
- 16 sim nyata dari Turso `brain_sims` (read-only; TIDAK ada tulis ke Turso), dibakar statis di lesson (deterministik, bertanggal 2026-10-14).
- Komposisi: 2 tunggu-review (1141, 1132), 4 Wave-2 baru (1151, 1152, 1153, 1161), 4 ditolak sub-universe (795, 1139, 1071, 1108), 3 paper-champion diblokir turnover (1137, 398, 265), 3 viable-terlewat (832, 822, 846).
- Spot-check vs Turso (id, sharpe, fitness): 1141 → (2.96, 1.36) COCOK; 1153 → (2.38, 2.1) COCOK; 822 → (1.52, 1.23) COCOK.

## Suntikan impostor (deterministik, pilot-v1)
| Key | Lokasi | Jenis |
|---|---|---|
| `self-corr-palsu` | baris 5 (sim #1153) | Self-corr dipalsukan 0.28 "LOLOS" padahal catatan verifikasi silang 0.94 "GAGAL" (ambang 0.7) |
| `turnover-mismatch` | baris 1 (sim #1141) | Ringkasan paket tulis turnover 31%, kolom detail 62.97% |
| `label-decay-salah` | baris 7 (sim #1137) | Label "decay 4 (standar)" padahal data decay = 0.0 |
| `duplikat-terselubung` | baris 10 & 14 (sim #1071 × 2) | Sim yang sama muncul 2× dengan nama family sedikit berbeda; paket klaim 16 sim unik dalam 17 baris |
| `klaim-subuniverse-palsu` | baris 8 (sim #795) | Klaim "Lolos sub-universe ✓" padahal sub_universe_sharpe 0.72 < 1.0 |

Tiap suntikan membawa `clue` (petunjuk) + `danger` (kenapa berbahaya di pekerjaan risiko nyata) yang dibuka di debrief.

## Struktur lesson (13 langkah, 60 menit, standar WORKFLOW.md v2.0)
1. cerita — story hook (Jumat 16:40, paket mendarat; twist: paket berbohong)
2. tujuan — 5 tujuan terukur + rute
3. konsep-sharpe — definisi, KaTeX `String.raw`, simbol, kepribadian, miskonsepsi 🚨
4. konsep-fitness — kategori Excellent/Good/Average (kategori riil WQB), miskonsepsi 🚨, tips 💡
5. konsep-selfcorr — ambang 0.7, sub-universe 1.0, miskonsepsi 🚨, tips 💡
6. lab-fitness — Pyodide: fungsi kategori + lolos_antrean (4 checks)
7. peta-keputusan — figur SVG 5 gerbang audit
8. chart — figur SVG scatter Sharpe vs Turnover (16 titik data nyata + garis batas 40%/70% + panduan baca + interpretasi)
9. lab-duplikat — Pyodide: radar duplikat (2 checks)
10. misi — **komponen ImpostorAudit** (dossier interaktif + tandai-anomali + debrief + skor)
11. minicase — skenario CRO + pembahasan
12. kuis — 5 soal × 4 opsi, tiap opsi ada `why`, lulus ≥ 4
13. rangkuman — summary + peringatan impostor

## Hasil verifikasi (wajib — semua dengan bukti)
- `npx tsc --noEmit`: file baru (types.ts, ImpostorAudit.tsx, rr19-audit-impostor.ts, reg-rr.ts, Workspace.tsx) BERSIH — 0 error. (Error yang tersisa hanya pre-existing di `src/app/api/progress/route.ts`, tidak disentuh.)
- Harness `/tmp/verify_impostor.js`: **41/41 PASS** — struktur lesson, 5 soal × 4 opsi + why, checks lab, 4 miskonsepsi, 3 tips, spec 17 baris/16 sim unik/5 suntikan, determinisme, SVG seimbang, KaTeX `String.raw`, prosa RAW.
- Skenario deteksi (fungsi murni `scoreDetection`, terprogram): semua-tertangkap → **5/5**; semua-terlewat → **0/5**; parsial (hanya baris duplikat) → **1/5** dengan key `duplikat-terselubung` benar.
- Render statis `react-dom/server`: 0 error; 17 baris dossier + 17 tombol tandai + tombol debrief ter-render; suntikan TERSEMBUNYI sebelum debrief dibuka (tidak ada "Skor deteksi" di HTML awal).
- Solusi lab dieksekusi dengan Python nyata: lab-fitness → output persis `expected`; lab-duplikat → `Duplikat: [1071]` + `Baris unik: 16 dari 17` persis `expected`.
- Snapshot vs Turso: 3/3 baris COCOK persis (lihat di atas).
- Registrasi: `REG_RR` memuat `rr19-audit-impostor` (19 lesson di track rr).

## File yang dibuat
- `src/app/v2/content/rr19-audit-impostor.ts` — lesson (dataset snapshot + 13 langkah + 2 figur SVG)
- `src/app/v2/components/ImpostorAudit.tsx` — komponen interaktif (dossier + flag + debrief + `scoreDetection` terekspor untuk QA)

## File yang diubah (bukan konten lesson)
- `src/app/v2/lib/types.ts` — tipe `ImpostorClaim/Row/Injection/AuditSpec` + field opsional `impostor?` di `V2Step` (aditif, backward-compatible)
- `src/app/v2/lib/reg-rr.ts` — +1 import, +1 entri registry
- `src/app/v2/learn/[slug]/Workspace.tsx` — render `<ImpostorAudit>` saat `step.impostor` ada; `canNext` mensyaratkan debrief dibuka (checkpoint); state di-reset per langkah

## Catatan untuk iterasi berikut
- Seeded-random DITUNDA ke iterasi berikut (sesuai brief): pilot-v1 deterministik penuh — posisi & isi suntikan tetap per versi, supaya bisa di-QA.
- Belum diuji di browser nyata (tidak ada Playwright/Chromium di VM ini) — disarankan uji on-device + klik manual oleh parent/Septian sebelum deploy: buka lesson, tandai 5 baris, buka debrief, cek skor 5/5; ulangi tanpa menandai, cek 0/5.
- Lab Pyodide memakai runtime Pyodide yang sudah ada (tidak diuji eksekusinya di sini selain solusi Python-nya — pola checks mengikuti rr14 yang sudah live).
