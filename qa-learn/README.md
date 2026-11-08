# QA guards — Learn v2

Guard regresi konten lesson. **WAJIB ALL PASS setelah setiap perubahan lesson.**

| Guard | Yang dicek |
|---|---|
| `qa_learn_counts.py` | Konsistensi internal `lessonMeta.json` (jumlah lesson/track, spec vs non-spec). |
| `qa_learn_numbers.py` | Fixture regresi angka yang pernah salah (angka kanonis; tambah fixture baru untuk setiap angka yang dikoreksi). |
| `qa_lab_regression.py` | Eksekusi semua lab Python di lesson (PASS/FAIL/ERROR/SKIP). |
| `qa_lab_expected_check.py` | Field `expected` tiap lab Python WAJIB sama dengan yang ditegaskan check lab yang sama (`equal` + pola literal `stdout_matches`). |

Jalankan dari root repo ini:

```sh
python3 qa-learn/qa_learn_counts.py
python3 qa-learn/qa_learn_numbers.py
python3 qa-learn/qa_lab_regression.py
python3 qa-learn/qa_lab_expected_check.py
```

Exit 0 = PASS. Guard-guard ini membaca konten dari `src/app/v2/content/` dan
`src/app/v2/lib/lessonMeta.json` di repo ini (path absolut ke checkout
`~/workspace/learn-platform`).

Riwayat: dipindah ke repo 2026-11-08 dari `~/workspace/kelontong-review/qa-learn/`
(keputusan Septian: guard WAJIB berversi sebagai backup).
