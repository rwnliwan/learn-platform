# FR8: Unsupervised — Menangkap Penipu yang Belum Punya Nama

## Mengapa Ini Penting?

Fitur 'Patungan Online' DanaKita diserang pola yang belum pernah ada — model supervised skor 0,12 ('normal'). Isolation Forest 20 baris yang dipasang 'sementara' menangkapnya di minggu ke-2.

---

## Tujuan Pembelajaran

- Menjelaskan 4 situasi tepat untuk unsupervised
- Ide inti Isolation Forest + parameter contamination
- Ide inti LOF untuk data multi-densitas
- Ide inti autoencoder + syarat data bersih

---

## Konsep Kunci

- Supervised = 'seperti fraud yang pernah kulihat?'; unsupervised = 'seperti apapun yang pernah kulihat?'
- IF: s(x) = 2^(-E[h(x)]/c(n)); contamination = asumsi bisnis penentu ambang
- Autoencoder: e(x) = ||x - x_hat||^2 — wajib latih pada data bersih
- Unsupervised = mesin kandidat, bukan vonis; output terbaik = rule/fitur baru

---

## Catatan

Versi ringkas. Versi interaktif lengkap (lab, chart, quiz, mini-case) tersedia di halaman lesson.
