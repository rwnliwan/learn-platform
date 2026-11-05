# METODE — Misi Taman A/B: Eksperimen yang Ingin Menang (misi-gabung-uji-ab-jujur)

- **Sumber data:** SINTETIS 100% — dibangkitkan dengan Python (`random.Random(42)`), bukan data pengguna nyata. Dinyatakan SINTETIS di briefing, data room, dan rangkuman misi.
- **Skema:** `assignments.csv` — kolom `user_id,grup,tanggal,konversi,segmen`.
- **Ukuran:** 4.000 baris = 10 hari (2026-06-01 s.d. 2026-06-10) × 400 pengguna/hari (200 grup A/kontrol, 200 grup B/perlakuan). Delapan segmen S1–S8 dengan bobot 0,20/0,18/0,15/0,14/0,12/0,09/0,07/0,05.
- **Pola jebakan yang direkayasa (agar nilai checks misi terpenuhi):**
  1. *Peeking + berhenti dini:* laju konversi B dirancang naik berjenjang (delta hari 1–6: 0 / 0 / 0,008 / 0,025 / 0,040 / 0,100) lalu berbalik (hari 7–10: −0,040 / −0,050 / −0,055 / −0,060) sehingga p-value kumulatif hari 2–5 ≥ 0,05 dan pertama < 0,05 di hari ke-6 (intipan ke-5) — lalu memudar (p full = 0,75).
  2. *Underpowered:* pada titik berhenti (1.200/grup) power untuk efek yang diklaim = 0,64 (< 0,80); butuh 1.752/grup.
  3. *Cherry-pick segmen:* S7 diberi kejutan deterministik +0,125 pada grup B → p mentah 0,0245 (satu-satunya < 0,05), gugur oleh Bonferroni (α = 0,00625).
  4. *Metrik diganti post-hoc:* hanya ada di dossier deck (rencana terdaftar: pendaftaran newsletter → dilaporkan: konversi checkout).
- **Pengurangan noise:** jumlah konversi per sel (hari, grup, segmen) memakai stochastic rounding dari nilai harapan — identitas pengguna yang berkonversi tetap acak. Dua kalibrasi deterministik: (a) pengguna S7-B hari 6–10 disetel agar z segmen = 2,25; (b) pengguna B non-S7 hari ke-6 disetel agar z kumulatif s.d. hari 6 = 2,32. Semua langkah deterministik dari seed 42.
- **Tanggal beku:** 2026-10-15. Ukuran: 108038 byte (< 5 MB).
- **Lisensi:** data sintetis 100% — bebas dipakai untuk pembelajaran, tanpa atribusi wajib.
- **Batas jujur:** angka-angka ini direkayasa untuk mengajarkan pola kegagalan A/B test, bukan perilaku pengguna nyata; efek "hari ke-6" adalah lonjakan transien yang disengaja.
