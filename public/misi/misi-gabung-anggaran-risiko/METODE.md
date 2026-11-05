# METODE — Misi Anggaran Risiko: Setiap Basis Poin Punya Pemilik (misi-gabung-anggaran-risiko)

- **Sumber data:** 100% SINTETIS — dibuat khusus untuk misi ini dengan seed 42 (NumPy Generator). Bukan data pasar nyata; kemiripan angka dengan instrumen sungguhan adalah kebetulan.
- **File:** `expected_returns.csv` (aset, expected_return_pct — imbal hasil ekspektasian tahunan, 6 baris), `covariance.csv` (matriks kovarians tahunan 6×6, desimal), `proposal_alokasi.csv` (aset, aset_label, kelompok, bobot_pct, derivatif_notional_pct, budget_risiko_pct — klaim CIO).
- **Aset (6):** saham_as, saham_eropa, obligasi, kredit_ig, kredit_hy, reit. Volatilitas tahunan: 18%, 17%, 5%, 7%, 12%, 20%. Korelasi rezim normal: blok ekuitas 0,65–0,75, blok kredit 0,70, lintas ekuitas–kredit 0,35–0,55, obligasi 0,05–0,25 (matriks PSD, eigenvalue terkecil 0,24).
- **Bobot efektif:** bobot_pct + derivatif_notional_pct (notional long futures/TRS, didanai kas −35% yang tidak tercantum sebagai baris aset). Neto 100%, bruto 170%.
- **Anggaran risiko:** kontribusi risiko % = MCTR_i / vol_portofolio; MCTR_i = w_i × (Σw)_i / σ_p. Budget target: saham_as 20, saham_eropa 15, obligasi 15, kredit_ig 14, kredit_hy 15, reit 21 (jumlah 100). Ambang pelanggaran: deviasi > 1pp.
- **Rezim stres:** korelasi melonjak (blok ekuitas → 0,90–0,92, blok kredit → 0,92, lintas ekuitas–kredit → 0,68–0,82, obligasi → 0,30–0,50). Volatilitas portofolio efektif naik dari 13,91% menjadi 15,84%. Rezim stres SENGAJA tidak dipakai proposal CIO — itu salah satu jebakan misi.
- **Seed:** 42. **Tanggal pembuatan:** 2026-10-15. **Ukuran:** 846 byte (< 5MB).
- **Batas jujur:** seluruh dataset sintetis untuk latihan anggaran risiko; rumus MCTR standar industri; tidak ada rekomendasi investasi.
