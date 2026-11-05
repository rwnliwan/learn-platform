# MR15: Model Stokastik

Mesin penghasil masa depan: GBM (saham), Vasicek/CIR/Hull-White (suku bunga, mean-reverting), GARCH(1,1) (volatilitas berkelompok).

- GBM: positif, tidak mean-reverting; ada volatility drag 0.5*s^2
- Vasicek bisa negatif; CIR non-negatif; Hull-White pas kurva kini (pricing)
- GARCH: s2_t = w + a*r2_{t-1} + b*s2_{t-1}; a+b ~ 0.95-0.99
- EWMA = GARCH khusus (w=0, a+b=1)
- Pilih model dari properti yang dibutuhkan, bukan popularitas

*(Lesson interaktif lengkap tersedia di halaman /learn/mr15-model-stokastik.)*
