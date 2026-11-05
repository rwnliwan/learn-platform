# LAPORAN C2 — Pendalaman Track Credit Risk (2026-10-16)

**Status: SELESAI & terverifikasi parent.** 38/38 lesson kini ≥45 menit model durasi. Rata-rata track: **43,8 → 49,2**. Tidak ada deploy (sesuai perintah). 29 file `cr*.ts` disentuh; tidak ada file non-CR yang tersentuh.

## Ringkasan angka (audit ulang dari registry, model identik 14 Okt)

| Metrik | Sebelum | Sesudah |
|---|---|---|
| Rata-rata track | 43,8 mnt | **49,2 mnt** |
| Lesson <45 mnt | 28 | **0** |
| Lesson dengan komponen hilang | 28 (intuisi 0; rumus tak berformulaNote 5 file; tanpa mini-case 2 file) | **0** |
| Rentang durasi | 34,1–58,2 | **46,0–60,6** |
| Total platform <45 mnt | 232 | **204** |
| tsc --noEmit (seluruh repo) | — | **0 error** |

Margin: tidak ada lagi yang mepet ke 45 (terendah 46,0). Dua lesson di atas 60: cr25-capstone 60,6 (capstone memang wajib >60) dan cr7a-application-scorecard-1 60,1 (kelebihan 0,1 mnt = noise model, tidak dipangkas).

## Pola kerja
- 3 subagent paralel dengan brief mandiri per file (target kata = (46−durasi)×180 + margin 30%, draft di /tmp + `wc -w`, lalu insert aditif).
- Per file: 1 note "Intuisi:" (150–250 kata, heuristik non-obvious) + 1–3 langkah prose baru (contoh terapan kedua berangka Rp Indonesia: KUR, fintech/pindar, kartu kredit, bank, BPR; kontras salah-vs-benar; mode kegagalan + aturan keputusan; pendalaman sub-topik yang selama ini hanya disebut sekilas).
- Quiz baru hanya bila perlu: 2 quiz baru di cr25 (oksigen vs nutrisi; adverse selection) dan 2 di cr7a (zig-zag WoE; multikolinearitas) — semuanya 4 opsi × `why` spesifik, 1 `correct`.
- formulaNote ditambahkan: cr7a (2 rumus: WoE/IV, regresi logistik), cr6 (roll rate), cr2 (DPD; NPL gross/net/coverage), cr3 (EL), cr4a (RWA; KPMM) — tiap rumus: penjelasan simbol + interpretasi + contoh angka konkret.
- miniCase: cr25 (KMK Rp 20 M untuk bengkel — kebutuhan riil Rp 12,4 M vs minta 20 M) dan cr7a (leakage fintech Rp 50 M — Gini 0,81→0,47). Terdeteksi audit via eyebrow "Mini-case" + angka berangka Rp.
- `estMinutes` → 45 untuk 28 lesson yang diperdalam; cr1 (51,0 + note) → 50. Lesson di atas 45 yang sudah tanpa komponen hilang (cr26–cr34) tidak disentuh.

## Verifikasi parent (bukan klaim worker)
- Re-bundle registry + skrip audit: angka tabel di atas.
- `npx tsc --noEmit` = 0 error (setelah semua batch selesai).
- Scan frasa terlarang F1 di cr*.ts = 0 temuan ("Pada lesson kali ini", "Mari kita mulai pembahasan", "Seperti yang telah dibahas sebelumnya", "Selanjutnya, kita akan melihat", "Penting untuk diingat bahwa").
- Semua 29 file yang disentuh punya note berjudul "Intuisi:" (grep per file); 9 file CR yang tidak disentuh sudah terhitung punya intuisi oleh audit.
- Cakupan file: `find` file yang dimodifikasi di jendela kerja C2 — hanya file cr*.ts (dm*.ts adalah hasil C1; tidak ada file di luar src/app/v2/content yang tersentuh; tidak ada file non-CR/non-DM yang tersentuh).
- Sample kualitas: judul-judul note ("Intuisi: ECL adalah harga, bukan ramalan", "Intuisi: FCF adalah kebenaran, EBITDA adalah pendapat", "Intuisi: undrawn limit adalah opsi jual yang kamu berikan gratis") — heuristik, bukan ringkasan. Struktur quiz baru cr7a terverifikasi (4 opsi × why, 1 correct per item).

## Kendala & temuan selama kerja (diperbaiki worker sendiri)
1. Batch 1: insert memakai anchor `id: "checkpoint"` yang unik per file — tidak ada kerusakan struktur (tsc 0).
2. Batch 2: 5 note awal 123–136 kata (di bawah syarat 150) → diperluas hingga 158–186 kata sebelum insert.
3. Batch 3: (a) duplikasi blok saat swap urutan di cr6 → terdeteksi via grep eyebrow, diperbaiki manual; (b) 4 karakter CJK sempat tertulis di draft cr14a → tertangkap di review draft, diperbaiki sebelum insert; (c) 12 note awal di bawah 150 kata → diperluas hingga 153–190 kata.
4. Perkiraan kata per paragraf worker meleset ~40% pada draft pertama (pengalaman yang sama seperti C1) — diatasi dengan margin +30% dan ekspansi iteratif.

## Berikutnya
- C3 = Fraud & AML (45 lesson, 23 di bawah standar, rata-rata 44,0) — track inti karier.
- Deploy C1+C2 ke live menunggu ACC Septian (deployment batch terakhir tetap 20b17030 — Gelombang A saja).
