# METODE — Misi Loop: Agen yang Tak Pernah Berhenti (misi-loop-tak-berujung)

- **Sumber data:** SINTETIS — dibuat dengan generator Python (seed 42) khusus untuk misi ini; BUKAN tagihan provider nyata.
- **File:** `catatan_run.csv` — 12 run agen (kolom: run_id, langkah, token, biaya_aktual_usd, biaya_dilaporkan_usd, state_berulang).
- **Metode:** tarif disederhanakan $2,50 per 1 juta token (input = output); 3 run loop (state_berulang = 1; 168–342 langkah); biaya_aktual_usd = token/1e6 × 2,50; biaya_dilaporkan_usd = (token − token_retry)/1e6 × 2,50 (retry "tidak dihitung"); total aktual $17,51 vs dilaporkan $3,86 → selisih $13,65.
- **Seed:** 42.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 416 byte.
- **Batas jujur:** tarif fiktif dan disederhanakan (provider nyata membedakan tarif input/output dan mengenakan biaya tool eksternal); loop dibuat kentara untuk latihan — loop produksi bisa jauh lebih halus.
