# Sapu Bersih Kontrol Mati — Laporan Final

**Tanggal:** 2026-10-15 (dini hari WITA)
**Perintah:** Septian, 2026-10-14 23:06 WITA — fitur/tombol web yang belum bisa diklik harus diaktifkan & difungsikan.
**Catatan kontinuitas:** Koordinator sebelumnya mati (timeout model, 00:14 WITA) tanpa laporan akhir. Pekerjaan ini melanjutkan dari warisannya: audit file-per-file, verifikasi ulang semua klaim, dan menuntaskan sisa inventarisasi. **Tidak ada deploy** (deploy terpusat oleh parent).

---

## 1. LANGKAH 0 — Audit warisan: SEMUA SELESAI ✓

Enam file warisan pendahulu diperiksa isi & keterhubungannya satu per satu. Semuanya **SELESAI** (logika utuh, terhubung benar, bukan stub):

| File | Status | Bukti keterhubungan |
|---|---|---|
| `src/app/learn/[slug]/CompleteButton.tsx` | SELESAI | Di-render di `src/app/learn/[slug]/page.tsx:46`; toggle → localStorage + POST/DELETE `/api/progress` |
| `src/app/api/progress/route.ts` | SELESAI | GET/POST/DELETE; auth via `SITE_PASSWORD`→cookie `learn_auth`; validasi slug regex; `ensureTable` idempotent |
| `src/app/api/setup/route.ts` | SELESAI | POST saja (GET→405); gate password 401; idempotensi via `setup_log`; DDL per-statement |
| `src/app/v2/pengaturan/page.tsx` + `SettingsClient.tsx` | SELESAI | Tema, cek koneksi → `pullServerProgress()`, unduh JSON, hapus data (dengan `confirm`) |
| `src/app/v2/catatan/page.tsx` + `NotesList.tsx` | SELESAI | Baca `getNotes()` dari localStorage; tiap catatan tertaut ke `/v2/learn/<slug>` |
| `src/app/v2/lib/progress.ts` | SELESAI | `pushDone/pushUndone/pullServerProgress`, activity, notes, export/wipe — dipakai Workspace, Settings, Karier, Review |

Tombol "Tandai Selesai" di workspace v2 (`Workspace.tsx:419-428`) juga sudah terhubung (`toggleComplete` → `pushDone/pushUndone`) — bukan peninggalan mati.

---

## 2. LANGKAH 1 — Inventarisasi kontrol (temuan saya sendiri)

Sapu statis: tidak ada `href="#"`, tidak ada `onClick` kosong, tidak ada penanda TODO/stub di app chrome. Semua tombol `disabled` bersifat kondisional yang sah (batas kuis, lab sedang jalan, petunjuk sudah dibuka).

| # | Kontrol | Lokasi | Status awal | Tindakan | Bukti uji |
|---|---|---|---|---|---|
| 1 | 4 tab dekoratif satu-tab (`script.py`, `Konsol` ×2, `Ringkasan`) | `Workspace.tsx:627,681,740,765` | `<button>` tanpa handler (menyesatkan) | Diubah jadi `<span className="tab">` (tampilan identik, tidak lagi berpura-pura bisa diklik) | esbuild syntax OK; tidak ada perubahan visual |
| 2 | Item nav "Proyek" | `DashboardNav.tsx` (sidenav) | `span.ndis` "Segera hadir" — mati | **Difungsikan**: menjadi `<Link href="/v2/learn/rr19-audit-impostor">` (proyek terpandu pilot impostor, lesson nyata & terdaftar) | HTML produksi: link ada ✓; klik browser → navigasi ke lesson pilot ✓ PASS |
| 3 | Item nav "Dataset" | `DashboardNav.tsx` (sidenav) | `span.ndis` "Segera hadir" — mati | **Dihapus**: tidak ada destinasi jujur (`/v2/lab-demo` menyatakan diri "Demo internal · tidak ditautkan dari navigasi") | HTML produksi: "Dataset" tidak ada ✓; tidak ada lagi "Segera hadir" ✓ |
| 4 | Highlight nav aktif salah | `catatan/page.tsx`, `pengaturan/page.tsx` | `active="kurikulum"` (sorotan salah) | Tipe `active` diperluas + `aria-current` untuk `catatan`/`pengaturan`; kedua page kirim nilai benar | esbuild syntax OK |
| 5 | Tombol tema, sidenav collapse, akordeon track, tombol pengaturan (Terang/Gelap, Cek koneksi, Unduh JSON) | `/v2`, `/v2/learn`, `/v2/pengaturan` | dicurigai mati oleh sapu otomatis | **Diverifikasi HIDUP** — 8/8 asersi browser PASS (lihat §4) | Playwright real-browser, lihat §4 |

Catatan tentang sapu otomatis: script klik-semua menghasilkan 81 "suspect", mayoritas **false positive** dari heuristik penghitung mutasi DOM (mis. toggle tema mengubah atribut `<html>` di luar `document.body` yang diobservasi; tombol akordeon hanya 1 mutasi class). Semua yang substansial diverifikasi manual satu per satu (tabel di atas + §4).

---

## 3. LANGKAH 2 — Tiga utang utama: SEMUA TERBUKTI ✓

Diuji terhadap **server dev terkontrol** (env `DATABASE_URL` + `SITE_PASSWORD` benar) dan **browser nyata (Playwright/Chromium)**.

### (a) "Tandai Selesai" persisten — TERBUKTI end-to-end di browser ✓
Pada `/v2/learn/rr15-risk-appetite` (Chromium nyata, cookie `learn_auth=1`):
- Klik "Tandai lesson selesai" → `aria-pressed: true`, label → "Lesson selesai — klik untuk membatalkan" ✓
- Readback API: `GET /api/progress` → `http200:["rr15-risk-appetite"]` — **tertulis di Neon lewat klik tombol** ✓
- Reload halaman → tetap `aria-pressed: true` (bukti baca-ulang dari server) ✓
- Klik batal → `GET /api/progress` tidak lagi berisi slug ✓ (round trip penuh, baris uji dibersihkan)

### (b) Tulisan Neon umum — TERBUKTI ✓
- `POST /api/progress` → `200 {"ok":true}` (Neon WRITE) ✓
- `GET /api/progress` → berisi slug (Neon READ) ✓
- `DELETE /api/progress?slug=` → `200`, lalu GET tidak berisi (DELETE) ✓
- `POST` slug tidak valid → `400 {"error":"slug tidak valid"}` ✓
- Tanpa cookie saat gate aktif → `401` ✓

### (c) `/api/setup` terkunci & aman — TERBUKTI ✓
- `GET /api/setup` → **405** (tidak ada handler GET; routing menolak, DDL tidak tersentuh) ✓
- `POST /api/setup` tanpa password → **401** ✓
- `POST /api/setup` password salah → **401** ✓
- Pemakaian normal tidak rusak: endpoint hanya hidup untuk POST ber-password; idempotensi via `setup_log` mencegah DDL ganda ✓

> Catatan: sempat teramati `POST /api/setup` → 500 di satu server milik agen lain; pada server terkontrol dengan env benar hasilnya 401 sesuai kode. Disimpulkan noise lingkungan (server tanpa env / sedang restart), bukan cacat kode.

---

## 4. LANGKAH 3 — Verifikasi

### Uji klik browser terarah — 8/8 PASS ✓ (Chromium nyata, server produksi)
- Toggle tema membalik `data-theme` ✓ · Sidenav collapse toggle + persist `localStorage v2:nav` ✓
- Item "Dataset" hilang dari nav ✓ · Link "Proyek" → navigasi ke `/v2/learn/rr19-audit-impostor` ✓
- Akordeon track di Kurikulum membuka & menampilkan link lesson ✓
- Pengaturan: tombol Gelap/Terang ✓ · "Cek koneksi" memperbarui teks status ✓ · "Unduh JSON" memicu download ✓

### Responsif multi-viewport — BERSIH ✓
`document.documentElement.scrollWidth - innerWidth` pada viewport **390px**: `/v2` = 0, `/v2/learn` = 0, `/v2/pengaturan` = 0, `/v2/catatan` = 0, halaman lesson = 0 — **tidak ada page overflow**.
check-responsive menandai `table.tbl` di dashboard (mobile); tabel itu berada dalam `.tblwrap{overflow-x:auto}` — scroll horizontal terkungkung yang disengaja untuk tabel data, bukan cacat.

### Regresi alur utama ✓
Buka lesson → tombol Periksa/lab, kuis, navigasi langkah — tidak ada error halaman pada halaman yang teruji (catatan: halaman lesson di build produksi agen lain tidak terhidrasi, lihat §6).

### `tsc --noEmit` — TIDAK SELESAI (jujur)
Tiga kali OOM-killed di VM bersama (7,7 GB RAM dibagi 4–5 agen yang同时 menjalankan build/dev-server/browser). Pengganti yang dilakukan: **esbuild syntax check PASS** pada keempat file yang saya ubah, dan pola kode yang dipakai identik dengan kode tetangga yang sudah lolos build sebelumnya.

---

## 5. Yang TIDAK selesai (daftar jujur)

1. **`tsc --noEmit` penuh** — OOM-killed 3×; lingkungan tidak memungkinkan saat ini.
2. **check-responsive di `/v2/learn`** — run mati di tengah (OOM); diganti pengukuran `scrollWidth` manual (= 0, bersih).
3. **Uji klik literal tombol "Tandai Selesai" pada build produksi** — build produksi yang tersedia saat itu tidak lengkap (lihat §6); sebagai gantinya e2e penuh dilakukan di dev server terkontrol (§3a) — rantai yang sama persis.
4. **Sapuan klik otomatis 1-per-1 untuk semua 500+ lesson** — tidak feasible; cakupan: app chrome + 1 lesson representatif + pola kode identik di semua lesson.

---

## 6. Temuan untuk parent / tim lain (BUKAN wilayah saya — tidak saya ubah)

1. **BLOCKER BUILD — `src/app/v2/components/TtsButton.tsx:28`**: `Type error: Cannot find name 'SpeechVoice'` menggagalkan `next build` (fase "checking validity of types"). File milik tim upgrade platform. Perlu perbaikan mereka sebelum deploy gabungan bisa jalan.
2. **Build produksi tidak lengkap** (milik agen lain, serve di :3444): direktori `.next/static/chunks/app/v2/learn/[slug]/` KOSONG dan tidak ada `BUILD_ID` — halaman lesson tersaji tanpa JS klien sehingga SEMUA tombol lesson tampak mati. Ini cacat build, bukan cacat kode; sudah di-root-cause, jangan dilaporkan sebagai bug aplikasi.
3. **Lingkungan malam ini tidak stabil untuk QA berat**: 4–5 agen berbagi 7,7 GB RAM tanpa swap; dev server mati OOM/port-conflict berulang; Google Fonts terblokir proxy sandbox (kosmetik di lingkungan uji saja).

---

## 7. File yang saya ubah (hanya wilayah app chrome)

- `src/app/v2/learn/[slug]/Workspace.tsx` — 4 `<button>` tab dekoratif → `<span>` (no. 1)
- `src/app/v2/lib/DashboardNav.tsx` — "Proyek" jadi link pilot; "Dataset" dihapus; `active` + `aria-current` untuk catatan/pengaturan (no. 2, 3, 4)
- `src/app/v2/catatan/page.tsx` — `active="catatan"` (no. 4)
- `src/app/v2/pengaturan/page.tsx` — `active="pengaturan"` (no. 4)

Tidak ada file tim lain yang disentuh. Tidak ada deploy dilakukan.
