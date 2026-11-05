# FR18: MLOps — Dari Notebook ke Benteng Produksi

## Mengapa Ini Penting?

Model PR-AUC 0,91 deploy Jumat sore; Senin pagi 3.000 alert/jam. Root cause: fitur dihitung beda di notebook vs produksi. Tak ada yang salah dengan modelnya — tak ada yang mengujinya di kondisi produksi.

---

## Tujuan Pembelajaran

- Jurang notebook-produksi (4 penyebab)
- Tangga deployment: shadow -> canary -> produksi
- A/B test dalam net rupiah
- Monitoring 4 lapis + retraining disiplin

---

## Konsep Kunci

- Validasi menguji model; shadow menguji SISTEM — 2 minggu shadow < 1 hari chaos
- A/B: net rupiah + guardrail; randomisasi benar; durasi cukup
- Monitor hulu-ke-hilir: data -> model -> bisnis -> feedback
- Retrain: terjadwal + terpicu, data matang, time split, versioning, rollback siap

---

## Catatan

Versi ringkas. Versi interaktif lengkap (lab, chart, quiz, mini-case) tersedia di halaman lesson.
