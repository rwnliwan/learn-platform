# MR3: Value at Risk — Tiga Metode

VaR = kuantil kerugian: '1-a peluang rugi <= VaR'. Tiga metode: Historical Simulation (non-parametrik), Parametrik (z*s*V), Monte Carlo (ribuan skenario + full revaluation). Scaling horizon via akar waktu.

- VaR bukan kerugian maksimal — diam tentang kedalaman ekor
- HS: tanpa asumsi distribusi; buta terhadap yang belum terjadi; ghost effect
- Parametrik: cepat & terdekomposisi; asumsi normal meremehkan fat tail
- Monte Carlo: wajib untuk portofolio non-linear (opsi)
- VaR(T) = VaR(1d)*sqrt(T) hanya sah jika i.i.d.

*(Lesson interaktif lengkap tersedia di halaman /learn/mr3-var.)*
