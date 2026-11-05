# METODE — Misi RAG: Jawaban Tanpa Jejak (misi-grounding-rag)

- **Sumber data:** SINTETIS — dibangkitkan oleh skrip generator (seed 42): korpus 20 chunk kebijakan fiktif "PT Cakrawala Fiktif" (`corpus.csv`), 12 query (`queries.csv`), retrieval k=5 (60 baris, `retrieval.csv`), 15 pasangan query–chunk relevan sebagai ground truth (`ground_truth.csv`), 12 jawaban model beserta sitasi (`answers.csv`).
- **Metode:** untuk tiap query, seluruh chunk relevan dimasukkan ke daftar ter-retrieve lalu diacak bersama chunk pengisi hingga 5 (rank acak). Tiga query (Q-02, Q-05, Q-08) diset "bocor" — jawabannya sudah ada di prompt sehingga recall-nya 1,00 by design. Sitasi: tiga query mengutip ID hantu yang tidak ada di korpus (Q-04 → CH-904, Q-09 → CH-917, Q-11 → CH-923); satu query (Q-12) tanpa sitasi sama sekali.
- **Seed:** 42.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 7141 byte (5 file CSV).
- **Batas jujur:** BUKAN data produksi — tidak ada model retrieval atau LLM nyata di balik angka-angka ini. Nilai recall@5 dan grounding rate adalah properti data sintetis yang dirancang untuk latihan audit. Kebocoran prompt, sitasi hantu, dan query training DITANAM SENGAJA sebagai bahan misi audit — jangan dipakai sebagai benchmark metode RAG apapun.
