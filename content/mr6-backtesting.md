# MR6: Backtesting VaR

Mengadili model dengan data nyata: uji Kupiec (jumlah pelanggaran), uji Christoffersen (pola/independensi), traffic light Basel (hijau/kuning/merah + multiplier modal), P&L attribution (hipotetis vs aktual).

- Ekspektasi: 2.5 pelanggaran/250 hari untuk VaR 99%
- Kupiec: LR ~ chi2(1), tolak jika > 3.84
- Christoffersen: pelanggaran berkelompok = model tidak adaptif
- HPL mengadili model; APL mengadili model + trading
- Backtest hijau = syarat perlu, bukan cukup — butuh stress test + ES

*(Lesson interaktif lengkap tersedia di halaman /learn/mr6-backtesting.)*
