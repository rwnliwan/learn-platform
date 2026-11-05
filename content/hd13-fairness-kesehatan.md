# HD13: Fairness di Kesehatan: Ketika AI Memihak

## Tujuan
- Menjelaskan 4 sumber bias AI kesehatan (data, label, representasi, deployment) dengan contoh nyata.
- Menghitung disparitas metrik antar grup (TPR, PPV, kalibrasi) dari output model.
- Menjelaskan mengapa metrik fairness bisa saling bertentangan (impossibility).
- Merancang strategi mitigasi per tahap (pre/in/post-processing) + explainability untuk klinisi.

## Ringkasan
- Empat pintu bias: data, label, representasi, deployment — audit berurutan.
- Kasus klasik: proksi label (biaya ≠ kebutuhan) membawa sejarah ke model.
- Metrik: parity, equalized odds, kalibrasi per grup — tak bisa semua (impossibility).
- Ukur per grup; agregat menyembunyikan disparitas.
- Mitigasi: pre (label/data) > in (constraint) > post (threshold).
- SHAP untuk transparansi & contestability, bukan sertifikat adil.
- “Buta” ≠ adil. Dimensi lokal (wilayah, kelas faskes) wajib diaudit.
- Trade-off akurasi-fairness sering kecil — jangan jadikan alasan menunda.
