# LAPORAN M2 — Grup DATA-ENGINEERING · Track Database Administrator

**Tanggal:** 2026-10-15 · **Builder:** subagent DBA (M2) · **Status:** SELESAI, TIDAK DEPLOY
**File konten:**
- `src/app/v2/content/misi-migrasi-tanpa-downtime.ts` → `export const misiMigrasi`
- `src/app/v2/content/misi-indeks-hantu.ts` → `export const misiIndeksHantu`
- Registrasi: `src/app/v2/lib/reg-misi.ts` (+2 import, +2 entri REG_MISI)

## Ringkasan misi

| # | Slug | Judul | Langkah | Durasi | XP | Const export |
|---|------|-------|---------|--------|----|--------------|
| A | `misi-migrasi-tanpa-downtime` | Misi Migrasi: Pindah Basis Data Tanpa Mati Lampu | 12 | 135 mnt | 500 | `misiMigrasi` |
| B | `misi-indeks-hantu` | Misi Indeks: Query Lambat dan Indeks Hantu | 13 | 150 mnt | 600 | `misiIndeksHantu` |

Track: `Database Administrator`, module: `Misi`, role/client terisi di galeri.

### Misi A (core) — alur 12 langkah
briefing → dataroom → Lab SQL audit integritas (UNION ALL: FK yatim + duplikat PK + NULL terlarang, 7 baris) → strategi migrasi (big-bang vs dual-write vs shadow + peta keputusan + mini-case) → Lab Python verifikasi checksum per batch (129 hilang, 5 rusak, selisih Rp 172.696.727) → checkpoint keputusan → 3 cabang konsekuensi (goto audit) → dossier 14 baris / 4 suntikan → deliverable → debrief+rangkuman (summary 5 poin).

Suntikan dossier A: baris hilang diklaim cocok (baris 2+14) · constraint dimatikan tak dinyalakan (5–6) · enum liar lolos CHECK (8) · checksum palsu atas kolom id saja (9).

### Misi B (edge) — alur 13 langkah
briefing → dataroom → Lab SQL rencana eksekusi (simulasi EXPLAIN, 3 full scan) → Lab SQL indeks hantu (4 indeks, pajak write) → Lab Python model biaya (rasio 40,0×; 7.400 ms → 185 ms; statistik basi 99,52%) → checkpoint keputusan → 3 cabang (goto audit) → dossier 16 baris / 4 suntikan → deliverable → debrief → rangkuman (summary 5 poin).

Suntikan dossier B: indeks LOWER(email) vs query UPPER(email) · statistik basi 9 bulan diklaim akurat · skew staging-vs-produksi (sampel 1%) · cast implisit TEXT↔INTEGER.

## Dataset & lisensi — 100% SINTETIS

Dinyatakan eksplisit di: briefing `datasetNote` (kedua misi), `METODE.md` tiap folder, dan summary terakhir.

| Folder | Isi | Ukuran |
|--------|-----|--------|
| `public/misi/misi-migrasi-tanpa-downtime/` | customers.csv (1.000), orders.csv (5.000+5 duplikat), payments.csv (8.000), orders_target.csv (129 hilang + 5 rusak), METODE.md | 692 KB |
| `public/misi/misi-indeks-hantu/` | query_log.csv (40), indeks.csv (12), statistik_tabel.csv (3), METODE.md | 16 KB |

Generator: `/tmp/build_misi_dba.py` (seed 42, `random.Random(42)`); kotoran D1–D5 / P1–P7 terdokumentasi di METODE.md. Lab sql.js memakai mini-seed inline di file konten (pola sama, skala kecil). Total per misi < 5 MB. **Bukan data nyata** — nama/email/angka fiktif; file B meniru pola EXPLAIN/pg_stat, bukan pengukuran nyata (dinyatakan di lab).

## Hasil verifikasi mandiri

1. **tsc --noEmit:** 0 error pada kedua file misi + reg-misi.ts. (Catatan: 5 error pre-existing di `misi-biaya-inferensi.ts` — file builder lain yang sedang ditulis paralel, BUKAN milik saya; tidak saya sentuh.)
2. **Harness SQL** (`/tmp/harness_misi_dba.py` — ekstrak seedData+solution dari .ts, eksekusi sqlite3 nyata): 3/3 PASS — kolom & expectedRows cocok persis (7, 3, 4 baris).
3. **Harness Python** (ekstrak solution, ganti open_url → path lokal, eksekusi nyata): 10/10 checks PASS —
   A: batch_bermasalah=[B1..B5], baris_hilang=129, baris_rusak=5, selisih_total=172696727;
   B: rasio_perbaikan=40.0, waktu_dengan_indeks_ms=185.0, selisih_pct=99.52, statistik_basi=True.
4. **Struktur** (parser ad-hoc): 12 & 13 langkah; tiap langkah punya id/eyebrow/title/prose/tasks; decision 1×3 opsi (label+rationale+nextStepId+consequenceNote, nextStepId valid); 3 cabang goto:"audit"; dossier 14 & 16 rows, 4+4 injections (rowIds valid, ada title/clue/danger, version/snapshotDate/intro/columns); deliverable template 5 poin + 4 kriteria (bobot total 100, 3 levels tiap kriteria); summary tepat 1 langkah per misi, 5 poin; briefing lengkap + datasetNote SINTETIS; F1 filler bersih.
5. **grep `\${`:** 0 di kedua file. **Prosa RAW** (tanpa entitas HTML). **KaTeX** `String.raw` backslash tunggal (1 formula, misi B).

## Catatan untuk parent/orchestrator

- Struktur mengikuti pola `misi-var-backtest.ts` persis (termasuk cabang berbagi eyebrow "Langkah 7 · Konsekuensi"; misi A menggabung debrief+rangkuman di langkah 12 agar total 12 langkah sesuai spek).
- Lab Python misi A memakai `requires: ["pandas"]` + `open_url` (pola teruji di misi-var); misi B Python murni.
- Perlu verifikasi lanjutan di gerbang parent (di luar wewenang saya): E2E browser runner, gate panel "Poin penting", dan QA on-device Septian. TIDAK ADA DEPLOY dilakukan.
