# Catatan Review Claude — Learn Platform (2026-10-13)

Sumber: `~/workspace/user/files/penilaian-course-platform.md`
Status: 7 poin TERVERIFIKASI akurat (cek kode langsung). Sisanya kurang tepat / butuh konteks.

**JANGAN kerjakan sekarang.** Prioritas saat ini: auth → Neon wiring → QA browser A1.
Catatan ini untuk polish UI/UX setelah fondasi backend beres.

---

## 1. Hapus "Selamat Datang" dari daftar materi
- Chapter `hello` ("Selamat Datang") ikut ter-list di landing page.
- Solusi: exclude slug `hello` dari `getChapters()` atau beri flag `hidden`.
- File: `src/lib/chapters.ts`, `src/app/page.tsx`

## 2. Kartu materi tidak informatif
- Saat ini: cuma judul + "Baca →".
- Tambahkan: estimasi waktu baca, level (Pemula/Menengah), status (belum/selesai).
- File: `src/app/page.tsx`

## 3. Progress tracking belum ada
- Belum ada sama sekali. Neon tabel `progress` sudah siap, tinggal wiring.
- Scope: tandai selesai per materi → centang di kartu → bar progress per modul.
- Setelah auth beres.

## 4. Daftar datar tanpa pengelompokan modul
- Saat ini: list A1.1–A1.9 tanpa header modul.
- Tambahkan: header "A1 · Statistika Deskriptif (9 materi)" + roadmap modul lain ("Segera hadir").
- File: `src/app/page.tsx`

## 5. Tidak ada titik masuk yang jelas
- Tambahkan tombol "Mulai dari A1.1" / "Lanjutkan belajar" di atas daftar.
- File: `src/app/page.tsx`

## 6. TOC sticky + progress bar baca belum ada
- Sudah dicatat sebagai known limitation.
- Scope: sidebar TOC sticky di desktop + progress bar tipis di atas halaman.
- File: lesson page template.

## 7. Kuis belum ada skor global
- Quiz per-soal sudah ada feedback (hijau/merah + penjelasan).
- Belum ada: skor akhir, retry, simpan hasil → terhubung ke status "selesai".
- Setelah auth + Neon wiring.

---

## Yang TIDAK usah diikuti dari review Claude
- Skor 8/10 visual, 9/10 pedagogi — terlalu murah hati, belum QA browser.
- "Kerjakan prioritas 1-4 dalam satu sore" — mengabaikan backend belum beres.
- Toggle dark mode "tidak terlihat" — kemungkinan screenshot lama, perlu verifikasi visual dulu.
