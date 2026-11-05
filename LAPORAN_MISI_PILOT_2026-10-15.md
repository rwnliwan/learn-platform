# LAPORAN PILOT MISI — 3 Misi Pertama Learn v2

**Tanggal:** 2026-10-15 · **Status:** SELESAI DIBANGUN + terverifikasi (gerbang parent menyusul)
**Dokumen desain:** `DESAIN_PROYEK_TERPADU_V2_2026-10-15.md` · `DATASET_PUBLIK_PROYEK_2026-10-15.md` · `RENCANA_MISI_75_2026-10-15.md`

---

## 1. Arsitektur yang dipilih + alasan

### 1.1 `V2Mission extends V2Lesson` — Workspace dipakai ulang tanpa fork
Tipe baru di `src/app/v2/lib/types.ts`: `V2Mission` = `V2Lesson` + `role`, `client`, `xp`, `module: "Misi"`.
Step mendapat 5 field opsional aditif: `briefing`, `decision`, `deliverable`, `auditDossier`, plus `goto` (override langkah-berikutnya untuk langkah cabang).
**Alasan:** Workspace lesson sudah menangani lab Pyodide/SQL, kuis, ECharts, HintLadder, TTS, FSRS, gamifikasi, dan panel "Poin penting". Forking = duplikasi 1.000+ baris yang akan drift. Semua perubahan Workspace murni kondisional aditif (`{step.decision && ...}`) — lesson existing tidak tersentuh perilakunya (regresi E2E: fr6 render normal).

### 1.2 Registry misi TERPISAH (penyimpangan sadar dari desain §2.2)
Desain mengusulkan `REG_MISI` di-spread ke `REGISTRY` lesson. Saya TIDAK melakukannya:
`src/app/v2/lib/missions.ts` + `reg-misi.ts` berdiri sendiri; `/v2/misi` + `/v2/misi/[slug]` punya registry sendiri.
**Alasan:** menyebarkan misi ke registry lesson akan mengubah hitungan dashboard ("Total 550 lesson" yang baru saja diverifikasi live) dan mencampuri route `/v2/learn`. Misi adalah fitur berbeda (proyek 90–150 mnt, bukan lesson 45–60 mnt). Keputusan ini aditif murni dan reversibel bila Septian memutuskan lain.

### 1.3 Komponen baru (4 file, `ImpostorAudit.tsx` milik rr19 TIDAK diubah)
- `MissionBriefing.tsx` — peran/klien/cerita/tujuan/ringkasan prasyarat (F2)/catatan dataset.
- `DecisionCheckpoint.tsx` — pilihan final (disimpan localStorage), konsekuensi terungkap setelah memilih, opsi terkunci.
- `DeliverablePanel.tsx` — draf textarea + self-check rubrik; gate: draf ≥50 karakter + semua kriteria dicentang.
- `MissionAuditDossier.tsx` — dossier tabel generik (kolom bebas); memakai ulang fungsi murni `scoreDetection` dari `ImpostorAudit` (import, bukan modifikasi).
- Gate di Workspace: decision → pilihan tercatat; deliverable → selesai; auditDossier → debrief dibuka. "Lanjut" mengikuti `nextStepId` opsi (label tombol berubah "Ikuti keputusanmu"); langkah cabang kembali via `goto` ("Kembali ke misi").

### 1.4 Progres: pola existing dipakai ulang apa adanya
`v2:done:misi-<slug>` + `/api/progress` (sama seperti lesson) — tidak ada skema DB baru, tidak ada API baru. Slug misi berprefix `misi-` agar tak bertabrakan.

### 1.5 Nav "Misi" TIDAK ditambahkan ke Sidenav
Sesuai desain §6.1 (menunggu ACC Septian). Galeri `/v2/misi` dapat dijangkau via URL langsung; sementara dikelompokkan di bawah nav Kurikulum.

### 1.6 Dataset: snapshot nyata di `public/misi/<slug>/`, lab memuat via `open_url`
Skrip build: `misi-data/build_snapshots.py` (seed 42, METODE.md per misi). Lab Pyodide memuat CSV via `pyodide.http.open_url` (path relatif same-origin).

---

## 2. Status 3 misi pilot

| Misi | Slug | Langkah | Lab | Dossier | Status |
|------|------|---------|-----|---------|--------|
| DBD: Laporan Surveilans yang (Tidak) Jujur | `misi-dbd-surveilans` | 12 | Pyodide EDA + SQL dedup | 20 baris, 4 sabotase | ✅ konten + data + verifikasi |
| Investigasi: Jejak Dana Peretasan | `misi-jejak-dana-blockchain` | 12 | Pyodide mixing + SQL join OFAC | 18 wallet, 3 sabotase | ✅ konten + data + verifikasi |
| Lab: Sampel yang Tertukar | `misi-lab-sampel-tertukar` | 12 | Pyodide QC + korelasi duplikat | 16 sampel, 3 sabotase | ✅ konten + data + verifikasi |

Semua: estMinutes 90–150, XP 500–600, summary wajib (panel "Poin penting" terisi sejak langkah 1 — terverifikasi browser), rubrik bobot total 100, 3 box miskonsepsi, F1 nol temuan, F2 (semua `nextStepId`/`goto` valid, prereqSummary di briefing).

---

## 3. Hasil verifikasi

- **tsc --noEmit:** bersih (0 error).
- **next build (produksi):** sukses; route `/v2/misi` + 3 runner ter-prerender.
- **Harness lab Python** (`/tmp/harness_misi.py`): 4 lab Pyodide — solusi dieksekusi nyata vs CSV asli, semua checks lolos (16/16). 2 lab SQL — seed + solusi via sqlite3 cocok expectedRows/expectedColumns.
- **E2E Playwright** (`/tmp/e2e_misi.py`): **25/25 lolos** — galeri, briefing, drawer 12 langkah, keputusan (3 opsi → cabang benar → kembali), dossier (skor 1/4 & 0/4 sesuai skenario), deliverable (gate draf+rubrik), debrief, rangkuman, 2 misi lain render, regresi lesson fr6 + dashboard.
- **Skor impostor:** pola rr19 (5/5 & 0/5) direplikasi — dossier DBD memberi 1/4 bila hanya duplikat ditandai, 0/4 bila tak menandai.
- **Responsive 390px:** galeri + runner + tabel dossier tanpa overflow halaman.
- **Panel "Poin penting":** terisi di langkah 1 misi (aturan patch 2026-10-15 terpenuhi).

---

## 4. Temuan jujur saat build (data mengalahkan narasi)

1. **OpenDengue: TIDAK ADA kadens mingguan untuk Indonesia** (hanya Month/Year). Misi DBD memakai laporan **bulanan** 2020–2023 — dinyatakan eksplisit di briefing + METODE.md. Bonus: data memuat **38 provinsi** (4 provinsi baru Papua sejak 2022), bukan 34.
2. **BitcoinHeist: fitur perilaku BISU.** Median `mixing_rounds` ransomware (6,0) vs white (8,0) — praktis identik. Narasi misi ditulis ulang secara jujur: Lab 1 justru membuktikan klaim "bersih berdasarkan perilaku" tidak berfondasi; yang membedakan adalah **label riset + join OFAC**. 67 alamat cocok-OFAC ditemukan di dataset (oversampling terdokumentasi di METODE.md).
3. **SEQC:** grup sampel A–F (bukan hanya A/B); misi memakai A/B × 4 replika = 16 sampel. Injeksi J3 awalnya hanya diterapkan di matriks subset (bug) — diperbaiki: diterapkan di matriks full agar `samples_audit.csv` konsisten (median library BGI 19,9 jt vs MAY 89,4 jt).
4. **Bug solusi lab-qc** (`kolom_duplikat` mengembalikan MAY_A_R1, bukan MAY_B_R3 — operator `~` salah) — ditangkap harness, diperbaiki, terverifikasi.

## 5. Yang perlu gerbang parent

1. **Lab Pyodide/SQL di browser REAL dengan akses CDN** — sandbox saya tidak bisa egress ke cdn.jsdelivr.net (Chromium `ERR_TUNNEL_CONNECTION_FAILED`; curl OK). Logika lab terverifikasi via harness, tapi eksekusi `open_url` di worker Pyodide **belum teruji di browser**. Ini satu-satunya risiko teknis terbuka.
2. E2E + FSRS + responsive ala gerbang lesson.
3. Keputusan Septian: item nav "Misi" di Sidenav (tambah/tidak).
4. Deploy gelombang misi — perlu ACC Septian (aturan berdiri).

## 6. File yang dibuat/diubah

**Baru:** `src/app/v2/lib/reg-misi.ts`, `src/app/v2/lib/missions.ts`, `src/app/v2/misi/page.tsx`, `src/app/v2/misi/MissionGallery.tsx`, `src/app/v2/misi/[slug]/page.tsx`, `src/app/v2/components/MissionBriefing.tsx`, `DecisionCheckpoint.tsx`, `DeliverablePanel.tsx`, `MissionAuditDossier.tsx`, `src/app/v2/content/misi-*.ts` (3), `misi-data/build_snapshots.py`, `public/misi/<3 slug>/` (CSV + METODE.md, total 4,9 MB).
**Diubah (aditif):** `src/app/v2/lib/types.ts` (tipe misi), `src/app/v2/learn/[slug]/Workspace.tsx` (render + gate + navigasi cabang misi).
**Tidak diubah:** `ImpostorAudit.tsx`, `registry.ts` (lesson), `rr19-audit-impostor.ts`, Sidenav, Progress Hub.
