# METODE — Misi Tool: Agen yang Membuka Pintu yang Salah (misi-gabung-rag-agen)

- **Sumber data:** SINTETIS — dibuat dengan generator Python (`random.Random(42)`, seed 42). BUKAN data asli, BUKAN log produksi siapa pun, TANPA kredensial/data akun, TANPA PII nyata (nama pelanggan, email, ID order semuanya fiksi). Dinyatakan SINTETIS di briefing misi, di sini, dan di data room.
- **File:**
  - `tool_traces.json` — trace 6 event sesi CS-Agen v2 pada 2026-10-14 09:02–09:03 WITA (user_message, 3 tool_call, 1 thought, 1 complaint). Event `send_email` membawa `gate: "skipped"` dan TIDAK ada event `minta_konfirmasi` sebelumnya — ini fakta yang harus ditemukan pelajar di lab, bukan dinyatakan di briefing.
  - `retrieval_chunks.json` — 8 chunk knowledge base, SEMUA `indexed_at = 2026-10-05T03:00:00+08:00` (refresh terakhir index). Kebijakan refund v4 terbit 2026-10-10 — 5 hari SETELAH refresh — sehingga seluruh chunk kebijakan di index masih versi lama (batas Rp500.000).
  - `kebijakan_refund.json` — dokumen kebijakan v4 (ground truth saat insiden): rusak dalam pengiriman = 100% nilai order, maksimal Rp5.000.000. Contoh: order Rp4.750.000 -> refund benar Rp4.750.000.
  - `tool_schema.json` — skema 5 tool + gate policy (tier write wajib `minta_konfirmasi` bila amount >= 100 ribuan rupiah) + flag audit (`send_email.audit_log = false`). Deskripsi parameter `amount` SENGAJA ambigu ("satuan mengikuti konfigurasi template email") — ini salah satu sabotase yang harus ditemukan di dossier audit.
- **Angka kunci (dihitung di lab, diverifikasi harness):** refund benar = Rp4.750.000; refund terkirim = Rp500.000 (amount=500 x 1000); selisih = Rp4.250.000; umur index saat insiden = 9 hari; chunk basi = 8/8; skor chunk basi tertinggi = 0,91 (chunk_014).
- **Tanggal tangkapan:** 2026-10-15. Total ukuran: 8160 byte (< 5 MB).
- **Batas jujur:** skenario, ambang gerbang (100 ribuan rupiah), dan angka-angka disederhanakan untuk latihan keamanan tool-use — bukan kebijakan perusahaan nyata mana pun.
