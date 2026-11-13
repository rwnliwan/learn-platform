# QA guards — Learn v2

Guard regresi konten lesson. **WAJIB ALL PASS setelah setiap perubahan lesson.**

| Guard | Yang dicek |
|---|---|
| `qa_learn_counts.py` | Konsistensi internal `lessonMeta.json` (jumlah lesson/track, spec vs non-spec). |
| `qa_learn_numbers.py` | Fixture regresi angka yang pernah salah (angka kanonis; tambah fixture baru untuk setiap angka yang dikoreksi). |
| `qa_lab_regression.py` | Eksekusi semua lab Python di lesson (PASS/FAIL/ERROR/SKIP). |
| `qa_lab_expected_check.py` | Field `expected` tiap lab Python WAJIB sama dengan yang ditegaskan check lab yang sama (`equal` + pola literal `stdout_matches`). |
| `qa_lab_starter_compile.py` | Starter lab WAJIB bisa di-compile setelah kekosongan yang dirancang untuk learner diisi (kelas cacat d10 R7: escape literal `\n` di posisi kode selalu FAIL — tidak pernah diperbaiki guard). |
| `qa_r7_recompute.py` | Hitung ulang independen angka-angka kunci ronde 7 dari parameter pertama (Vasicek SD/kuantil, Cornish-Fisher, break-even llmops13, aai11, mk13 all-in, cr13/cr15/cr16, dst.) — fixture angka tanpa recompute tidak membuktikan angkanya benar. |
| `qa_quiz_numeric_keys.py` | Kunci kuis numerik (opsi `correct: true`) WAJIB memuat angka hasil hitung ulang independen. |
| `qa_lesson_rules.py` | Aturan yang dinyatakan lesson WAJIB dipatuhi contohnya sendiri (mis. aai11 "state ≥2×": alert di langkah 5, bukan langkah 4). |
| `qa_r8_recompute.py` | Hitung ulang independen angka-angka kunci ronde 8 (Markov P⁶/stasioner, Binomial banjir, GPD, Beta, Lerner, biaya fr13, kanibalisasi, NPL d9, beta bi13, notasi aai11) — GG-2. |
| `qa_lab_semantic.py` | Eksekusi kode solusi lab + invarian semantik konsep yang diklaim (sampler Beta, pack_context ≤ budget, rank() ties, gap_max, fixture c14) — GG-9. |
| `qa_absolute_claims.py` | Frasa absolut yang sudah dikoreksi (daftar terlarang, tumbuh tiap ronde) + aturan struktural teorema impossibility + sensus frasa absolut — GG-7. |
| `qa_gg17_minus_ascii.py` | GG-17: minus ASCII di awal nilai tampilan — denylist per-file (b19, mle16 SVG/label, d11, a16) + sensus repo-wide (laporan; 682 pra-fix R9, konvensi tak pernah diterapkan repo-wide). |
| `qa_gg18_label_counts.py` | GG-18: label jumlah vs struktur (N pertanyaan campuran di checkpoint, N heuristik vs ordinal, baris isi ⏱ mnt/kuis vs estMinutes/total kuis, peta "Langkah N · Judul", daftar isi). |
| `qa_gg19_svg_geometry.py` | GG-19: figure/SVG vs label/data — fixture geometri 4 figure R9 (aml4 THRESH_SVG, aml5 HIST_SVG, mle16 FIG_TUNING, aai15 FIG_HARD). Cek generik ditarik (false positive pada sumbu terpotong). |
| `qa_gg20_starter_solution.py` | GG-20: starter = solution (repo-wide, 15 instance pra-fix R9) + fixture rule-2 (rr13 `tren`); sapuan luas 155 instance di `gg20_rule2_broad_scan_r9.txt` (backlog triase ronde berikut). |
| `qa_gg21_narrative_derivation.py` | GG-21: angka narasi/mini-case tanpa jejak derivasi — fixture R9 (biz14 Rp348 rb, fr14 +5 investigator/138 gaji/3,6 hari, aai15 Rp82/hari, a19 15/kuartal). Deteksi umum butuh triase manusia. |
| `qa_gg37_review_language.py` | GG-37: bahasa proses review bocor ke learner — pola tak-ambigu (`post-R\d`, `R\d+-fix`) + fragment P10-1. Frasa samar ("lama tidak", "tidak terlacak") sah di domain — masuk prompt review. |
| `qa_r9_recompute.py` | GG-2 (diperkuat: hitung ulang RANTAI dari komponen tertulis, bukan bandingkan dua angka) + GG-3 (prose-vs-lab) + GG-14 (lintas-lesson) — fixture hitung ulang semua angka koreksi R9. |
| `concept_gate.py` | Gerbang konsep pra-deploy (pengganti loop GG-5): klaim teorema/rumus/definisi dari lesson yang BERUBAH saja (git diff) diverifikasi via SATU panggilan DeepSeek murah. Deploy DITOLAK bila ada KONTRADIKSI. |
| `qa_chapters_legacy.py` | chapters.ts tidak boleh kehilangan halaman legacy: semua slug baseline (`qa-learn/legacy_slugs.txt`, 300 slug per 2026-11-12) WAJIB hadir + semua `content/*.md` WAJIB terdaftar + tanpa duplikat. Kelas cacat 12 Nov 2026: regen `build-content.py` memangkas 296→197 dan nyaris 404-kan 103 halaman legacy live. |
| `qa_mlf_deepseek_r1.py` | Kunci 11 kelas kesalahan review DeepSeek M1 (2026-11-12): cek generik repo-wide — formula median paritas-tunggal (F2) + band partisi berlubang (F6); fixture regresi 20 jangkar kalimat perbaikan + 4 rumusan lama yang wajib hilang. Kelas semantik (F1/F5/F7/F9/F10/F11/F3) tidak terkunci penuh oleh guard string — mitigasi: fixture + 11 kelas di prompt concept gate + frasa Brier di denylist `qa_absolute_claims.py`. |
| `qa_deploy_size.py` | Tidak ada file di output build (`.vercel/output/static`) yang >= 25 MiB (batas keras Pages). Kelas cacat 12 Nov 2026: `v2/learn.html` 25,1 MiB karena halaman kurikulum menserialisasi semua lesson ke RSC payload — live sebelumnya sudah 24,85 MiB, 4 lesson MLF mendorongnya lewat. Perbaikan: props kurikulum diringkas ke 5 field (learn.html 26,3 MB → 0,19 MB). Jalankan SETELAH build, SEBELUM deploy. |

Jalankan dari root repo ini:

```sh
python3 qa-learn/qa_learn_counts.py
python3 qa-learn/qa_learn_numbers.py
python3 qa-learn/qa_lab_regression.py
python3 qa-learn/qa_lab_expected_check.py
python3 qa-learn/qa_lab_starter_compile.py
python3 qa-learn/qa_r7_recompute.py
python3 qa-learn/qa_quiz_numeric_keys.py
python3 qa-learn/qa_lesson_rules.py
python3 qa-learn/qa_r8_recompute.py
python3 qa-learn/qa_lab_semantic.py
python3 qa-learn/qa_absolute_claims.py
python3 qa-learn/qa_gg17_minus_ascii.py
python3 qa-learn/qa_gg18_label_counts.py
python3 qa-learn/qa_gg19_svg_geometry.py
python3 qa-learn/qa_gg20_starter_solution.py
python3 qa-learn/qa_gg21_narrative_derivation.py
python3 qa-learn/qa_gg37_review_language.py
python3 qa-learn/qa_r9_recompute.py
python3 qa-learn/qa_chapters_legacy.py
python3 qa-learn/qa_mlf_deepseek_r1.py
# SETELAH build, SEBELUM deploy (batas file Pages 25 MiB):
python3 qa-learn/qa_deploy_size.py
# Gerbang konsep — SEBELUM deploy, atas lesson yang berubah saja:
python3 qa-learn/concept_gate.py [--base HEAD] [--files ...]
```

Exit 0 = PASS. Guard-guard ini membaca konten dari `src/app/v2/content/` dan
`src/app/v2/lib/lessonMeta.json` di repo ini (path absolut ke checkout
`~/workspace/learn-platform`).

Riwayat: dipindah ke repo 2026-11-08 dari `~/workspace/kelontong-review/qa-learn/`
(keputusan Septian: guard WAJIB berversi sebagai backup).
