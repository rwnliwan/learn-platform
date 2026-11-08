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
```

Exit 0 = PASS. Guard-guard ini membaca konten dari `src/app/v2/content/` dan
`src/app/v2/lib/lessonMeta.json` di repo ini (path absolut ke checkout
`~/workspace/learn-platform`).

Riwayat: dipindah ke repo 2026-11-08 dari `~/workspace/kelontong-review/qa-learn/`
(keputusan Septian: guard WAJIB berversi sebagai backup).
