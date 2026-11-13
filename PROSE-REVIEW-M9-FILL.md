# Prose Review Fill M9 — Laporan Verifikasi Chief (Koordinator)

**Tanggal:** 14 Nov 2026 ~00:40 WITA (panggilan DeepSeek 13 Nov 16:39 WITA)
**Ruang lingkup:** konten fill M9 baru saja (10 gap Luna G1–G10: M9.1 langkah 13 + Lab 3 + 1 kuis; M9.2 langkah 13 + 1 kuis; M9.3 langkah 13 + 1 kuis; M9.4 langkah 13 + 1 kuis; M9.5 langkah 13–18 + 5 kuis; + 2 titik pasca-gate: note margin call berantai M9.2, why kuis Basel M9.3).
**Metode:** 1 panggilan `deepseek-v4.1-flash` atas prompt 123.251 B (kanonik M9 PENUH 18 kunci + appendix cross-ref M4/M5/M6/M7/M8 + 18 blok baru). Concept gate TIDAK membaca prose langkah, jadi review ini satu-satunya penutup prose fill — pola yang sama dengan prose review fill M8 (2 MUST, 2/2 BENAR).

## Ringkasan verifikasi

| Tingkat | DeepSeek | Terverifikasi BENAR | Noise |
|---------|----------|--------------------|-------|
| MUST | 0 | 0 | 0 |
| SHOULD | 0 | 0 | 0 |
| NIT | 2 | **1** | **1** |
| **Total** | **2** | **1** | **1** |

**Vonis: 1 temuan BENAR (NIT) + 1 noise. TIDAK ADA MUST/SHOULD.** Fill M9 secara prose bersih — jauh lebih bersih dari fill M8 (2 MUST). Satu-satunya yang perlu diperbaiki adalah klausa basis pembulatan pada formula rasio severity (kelas yang sama dengan temuan fix-round M9.1:102 / M9.4 "+9,8%").

## Temuan BENAR

### F1 — NIT — M9.3 `kedalaman-exceedance` (langkah 13, G3)

- **Konten baru:** formula `rasio severity = 0,0440/0,0394 = 1,1163` (TS `mlf-m93-backtesting-walk-forward.ts:511`) + formulaNote (:512): "Rata-rata kerugian 0,0440, rata-rata prakiraan ES 0,0394, rasio 1,1163 [turunan]".
- **Bukti (hitung ulang Chief dari data, loader persis kanonik, n=480):** mean kerugian exceedance eksak = 0,04402593; mean prakiraan ES eksak = 0,03943858; rasio eksak = 1,11631631 → **1,1163 (kanonik `m9_es_severity.severity_ratio_vs_forecast` BENAR)**. TETAPI dari operan tampil: 0,0440/0,0394 = 1,11675127 → **1,1168**, bukan 1,1163 (selisih 0,0005). Pembelajar yang membagi angka tampil mendapat desimal ke-4 yang berbeda — persamaan seperti tertulis tidak menutup.
- **Kelas:** basis pembulatan tak-bulat tidak dinyatakan (sama dengan temuan fix-round M9.1:102 "0,0903 dari VaR tak-bulat" dan M9.4 "+9,8% dari nilai tak-bulat" — keduanya diperbaiki dengan klausa tak-bulat + label [turunan]).
- **Perbaikan yang disarankan (TS + .md bila ada):** formula menjadi `= 0,0440/0,0394 ≈ 1,1163 (dari nilai tak-bulat)` ATAU tampilkan operan tak-bulat; tambahkan klausa yang sama di formulaNote :512. Prose :504 ("rasio severity 1,1163") dan kuis why :614/:617 TIDAK perlu diubah (nilainya benar; hanya persamaan formula yang butuh klausa basis). Pernyataan "sekitar 12%" / "11,6%" TIDAK terdampak (1,1163→11,63%; 1,1168→11,68% — keduanya ≈12%/11,6–11,7%). Mirror `.md` (`content/mlf-m93-backtesting-walk-forward.md:161,180`) HANYA memuat nilai rasio (tanpa persamaan pembagian) — tidak perlu diubah.
- **Dampak:** NIT murni penyajian; tidak ada angka kanonik yang salah, tidak ada verdict yang berubah.

## Noise (tidak diperbaiki)

### F2 — NIT (noise) — M9.2 summary, "maxDD GSPC −0,1890"

- **Klaim reviewer:** `GSPC −0,1890` (maxDD) "tidak ada di kanonik maupun appendix [M4.5] yang diberikan" — reviewer sendiri ragu ("kemungkinan ada di modul M4.5 di luar kutipan appendix; perlu konfirmasi").
- **Bukti:** `qa-learn/m4_canonical.json` → `mdd_GSPC = -0.189` → **−0,1890 persis seperti tertulis**. Nilai ADA di kanonik sumber M4.5; yang tidak ada hanyalah baris itu di appendix prompt saya (appendix hanya mencantumkan maxDD BBCA/KLBF/UNVR/PORT). Temuan ini artefak kelalaian appendix prompt, BUKAN kesalahan lesson.
- **Catatan tambahan:** baris yang di-flag (`mlf-m92-scenario-stress-testing.ts:484` summary, juga :96 prose dan :588) adalah konten build M9 pra-fill, BUKAN konten fill — ia ikut terbaca karena summary melekat pada checkpoint step yang diekstrak. Nilainya konsisten di ketiga situs + kanonik.
- **Keputusan: NOISE — jangan diubah apa pun.**

## Cakupan yang eksplisit diverifikasi reviewer (dan lolos)

Reviewer memeriksa kelas-kelas rawan satu per satu dan menyatakan semuanya konsisten — Chief mengonfirmasi dari disk bahwa kelas-kelas itu memang tercakup prompt:
- Label mesin P&L: gesekan = [ilustrasi], kerugian pasar = [kanonis] — sesuai `m9_pl_engine`.
- p Kupiec 0,3079 pada kuis Basel dinyatakan eksplisit milik 4/230 VaR99 rolling, BUKAN 3/230 Basel (titik pasca-gate — benar).
- CI block "MENCANGKUP" param 0,0328, CI iid "di LUAR" — tidak ada frasa "mendekati ambang".
- "mean ± sd" hanya muncul sebagai larangan (step 12 M9.5).
- Dekomposisi P&L menutup (14.864.812+200.000+32.877+2.000.000 = 17.097.689) dan margin call menutup (200.000.000−133.333.333 = 66.666.667).
- "250 hari" Basel dinyatakan hari perdagangan.
- Reviewer juga memverifikasi ulang (catatan positif, Chief cek silang): rentang 7 generator 0,0197 ✓; "73%" ✓; "43%" EWMA ✓; half-life GARCH ≈2 hari / EWMA ≈11 hari ✓; selisih FHS 0,0016/0,0032 ✓; share P&L 1,35%/0,22%/13,45% + total 1,57%/15,02% ✓; margin call −33,33%/−66,67% ✓; severity 7/15=46,7%, 3/15=20%, 0,1398/0,0440=3,18×, tanpa hari 212 → 0,0372 ✓; nested 6,25× dan 2,56% ✓; √(0,0026²+0,0004²)=0,0026 ✓; blok 5/10/20 lebar +10,4%/+11,1%/+22,6% ✓; 48 jendela/2,4 dan ~22 jendela/1,1 ✓; grid LGD/margin ~15× ✓.

## Catatan verifikasi Chief (bukan temuan)

- Hint Lab 3 M9.1 menulis "1,6449 × 0,0280 + 0,000558 ≈ 0,0467" padahal aritmetika operan tampil = 0,0466152 → 0,0466. BUKAN temuan: prose langkah yang sama sudah menyatakan eksplisit "0,0466 dari σ tampil; 0,0467 dari σ tak-bulat 0,028038 — selisih 0,0001 murni pembulatan", expected lab = 0,0466, check = 0,0467 (tol 0,0005) — tidak ada kontradiksi yang dihadapi pembelajar. Reviewer (yang memeriksa kelas ini) tidak mem-flag-nya. Dicatat di sini agar tidak dianggap terlewat.
- Pelajaran proses (untuk prompt berikutnya): appendix cross-ref WAJIB memuat SEMUA angka M4.5 yang dikutip blok, termasuk maxDD GSPC — F2 lahir dari appendix yang tidak lengkap, bukan dari lesson. Tren klaim "tidak tertelusur" yang salah: 9/77 (review M8) → 1/38 (review M9) → 1 dari 2 temuan di ronde ini (F2) — dan klaim itu ternyata ada di kanonik.

## File

- Prompt: `review-prompts/prose_review_m9_fill_prompt.txt` (123.251 B, 18 blok)
- Output DeepSeek: `review/prose_review_m9_fill.txt` (3.228 B, exit 0, 1 panggilan, tanpa re-run)
- Laporan ini: `PROSE-REVIEW-M9-FILL.md`

## Yang TIDAK dilakukan (sesuai brief)

Tidak ada edit lesson/guard/kanonik, tidak ada deploy/push/commit. Perbaikan F1 diserahkan ke koordinator fix M9 (Chief).
