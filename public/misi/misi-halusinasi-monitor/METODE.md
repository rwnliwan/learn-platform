# METODE — Misi Halusinasi: Klaim yang Tak Bisa Diverifikasi (misi-halusinasi-monitor)

- **Sumber data:** SINTETIS — dibuat khusus untuk misi ini dengan generator Python (`numpy.random.default_rng`, seed 42). BUKAN hasil evaluasi asisten nyata; semua pasangan QA, skor grounding, dan sitasi adalah ilustrasi yang dirancang agar konsisten secara internal.
- **File:** `jawaban_audit.csv` — 500 baris pasangan tanya-jawab: `id, pertanyaan, kategori, jawaban, sitasi, skor_grounding, didukung, sitasi_tepat`.
- **Distribusi (seed 42):** `didukung` Bernoulli(0,91); `skor_grounding` normal terpotong (mean 0,90 bila didukung / 0,38 bila tidak); `sitasi_tepat` Bernoulli (0,94 bila didukung / 0,30 bila tidak). Pertanyaan/jawaban dari templat tetap per kategori (produk, dokumen, kebijakan, teknis).
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 50046 byte.
- **Batas jujur:** data sintetis — klaim "100% grounded", keempat sabotase laporan (sitasi salah passage, eval bocor ke prompt, ambang diturunkan, sampel gagal dihapus), dan model "asisten-v3" adalah skenario latihan yang disengaja, bukan temuan audit terhadap produk nyata mana pun.
