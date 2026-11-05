# METODE — Misi Chunking: Dokumen yang Terpotong di Tempat Salah (misi-chunking-buruk)

- **Sumber data:** SINTETIS — dibangkitkan oleh skrip generator (seed 42): 120 chunk dari 30 dokumen fiktif × 3 strategi chunking (`chunks.csv`). Kolom: chunk_id, doc_id, strategi, n_token, rusak_tabel, heading_yatim, kalimat_terpotong, ter_retrieve, relevan.
- **Metode:** n_token ~ Normal(512, 25) untuk "Semantic v2" dan "Fixed-512 + overlap-50", Normal(280, 90) untuk "Struktur-aware". Probabilitas kerusakan boundary (tabel rusak / heading yatim / kalimat terpotong) dan peluang ter-retrieve dibedakan per strategi. "Semantic v2" SENGAJA dibangkitkan identik dengan fixed-512 — itu bahan audit, bukan bug generator.
- **Seed:** 42.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 5218 byte (1 file CSV).
- **Batas jujur:** BUKAN benchmark produksi — tidak ada embedding, chunker, atau retrieval nyata di balik angka-angka ini. Pola kerusakan boundary dan recall adalah properti data sintetis yang dirancang untuk latihan audit dan pengambilan keputusan strategi chunking.
