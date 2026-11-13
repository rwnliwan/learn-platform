# PROSE REVIEW FILL M8 — Laporan Chief (verifikasi induk)

**Tanggal:** 13 Nov 2026 ~21:30 WITA. Model: `deepseek-v4.1-flash` via Kelontong (1 panggilan, prompt `review-prompts/prose_review_m8_fill_prompt.txt` 143.547 B — 15 blok konten baru fill + kanonik 13 kunci). Mentah: `review/prose_review_m8_fill_raw.txt`.

**Latar:** koordinator fill menandai bahwa ekstraktor `concept_gate.py` TIDAK PERNAH membaca prose langkah (`prose:` array) — gate PASS 67 OK hampir tidak mencakup prose baru fill. Keputusan Chief: prose baru diverifikasi Chief sendiri + 1 panggilan prose-review DeepSeek sebelum deploy. (Percobaan pertama terinterupsi restart VM 32 detik setelah start, output 0 byte — di-re-run penuh, exit 0.)

## Hasil: 2 MUST, 2/2 TERVERIFIKASI BENAR + DIPERBAIKI

### F1 — MUST (BENAR)
- **Klaim fill:** CI selisih bad rate [−1,26; +3,35] "MENDEKATI ambang MERAH 3,0" / "«hampir MERAH»" (prose M8.1:190, caption figure :234, kuis Q :734).
- **Verifikasi Chief:** batas atas 3,35 > 3,0 (band MERAH > 3,0 pp) — interval itu MELINTASI/MENCUP MERAH, bukan sekadar mendekati. Lebih parah: distraktor kuis (:736) why-nya mengklaim "batas atas CI 3,35 belum tentu melewati ambang MERAH" — SALAH aritmetika (3,35 > 3,0 jelas).
- **Fix:** 4 situs TS (:190, :234, :734, :736) + 1 situs .md (:97) — "mendekati/hampir MERAH" → "melintasi/mencakup MERAH"; distraktor why ditulis ulang (alasan MERAH salah = verdict ikut ESTIMASI TITIK 1,06 → KUNING, bukan karena CI tak melintasi 3,0). Fixture must-not baru: "mendekati ambang MERAH" (M8.1).
- **Kelas baru untuk QA:** batas atas CI yang melewati ambang ≠ "mendekati ambang" — bila batas CI melewati ambang, tulis "melintasi/mencakup".

### F2 — MUST (BENAR)
- **Klaim fill:** mini-case decision protocol M8.5 — hadir 2 anggota + ketua; 1 anggota = model owner → recusal → pemilih sah tinggal 1 anggota + ketua = 2 suara; tapi "suara akhirnya 2–2" (dari suara tertulis 2 anggota tak hadir — yang aturannya sendiri bilang TIDAK DIHITUNG).
- **Verifikasi Chief:** aritmetika mustahil (2 pemilih sah tidak bisa menghasilkan 2–2); suara tertulis dipakai untuk menghasilkan seri yang aturannya sendiri melarang dihitung.
- **Fix:** TS :205 + .md :117 — suara sah 1–1 (1 anggota + ketua) → seri → eskalasi; tiga kesalahan dirumuskan ulang (tanpa kuorum, tanpa recusal, keputusan dipaksakan padahal suara seri dan ruangan tidak sah).
- **Kelas baru untuk QA:** aritmetika suara/kuorum dalam mini-case WAJIB konsisten dengan aturan yang sama — hitung pemilih sah setelah recusal SEBELUM menulis hasil suara.

## Tidak ada kontradiksi lain
Reviewer: "Tidak ada kontradiksi lain yang ditemukan." Verifikasi Chief atas prose baru (G1 CI semua cocok hitung ulang; G9 margin 3,9×/12,78×/2,47× cocok; G10 29 < 30 menit; G8 n=26 [ilustrasi]; G11/G12/G13/G14 konsisten) — tidak ada temuan tambahan.

## Verifikasi pasca-fix (Chief)
- Residual "mendekati ambang MERAH" / "2–2" = 0 di TS + .md.
- Guards: numbers PASS, counts PASS, quiz_keys ALL PASS (145), lab_regression PASS=1981 FAIL=0, tsc exit 0.
- **M8 SIAP DEPLOY (976 lesson).**
