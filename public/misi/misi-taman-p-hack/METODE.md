# METODE — Misi Taman P-Hack (misi-taman-p-hack)

- **Sumber data:** 100% SINTETIS — dibuat dengan generator Python (`numpy.random.default_rng(42)`, seed 42) khusus untuk misi ini. BUKAN data eksperimen manusia yang sebenarnya; setiap kemiripan dengan studi nyata adalah kebetulan.
- **Lisensi/atribusi:** Data sintetis orisinal untuk misi ini — bebas dipakai. Tidak ada subjek manusia, tidak ada data pribadi.
- **Seri:** 400 partisipan simulasi (id 1–400). Kolom: id, kelompok (kontrol/perlakuan, 200 vs 200, diacak), umur (18-30/31-45/46-60/60+), jenis_kelamin (L/P), domisili (kota/desa), skor_fokus, skor_mood, skor_tidur, skor_stress (masing-masing N(50,10)), waktu_reaksi_ms (N(450,60)).
- **Metode:** Kelompok diacak independen dari semua outcome; semua outcome dibangkitkan sebagai noise murni (independen dari kelompok) — generator MENJAMIN tidak ada efek nyata dalam data ini. Urutan pembangkitan: kelompok → umur → jenis_kelamin → domisili → 5 outcome. Hasil audit misi (80 uji Welch, 1 “temuan” p=0,0457 pada 60+/P/kota × skor_fokus) adalah false positive yang sepenuhnya bisa dijelaskan — dan memang dirancang untuk itu.
- **Seed:** 42 (satu-satunya sumber keacakan; hasil deterministik dan terreplikasi).
- **Tanggal tangkapan:** 2026-10-15. Ukuran: eksperimen_sintetis.csv 20596 byte.
- **Batas jujur:** Karena data sintetis tanpa efek nyata, “temuan signifikan” di misi ini PASTI palsu — pada data nyata, audit yang sama butuh praregistrasi asli dan tidak bisa memastikan temuan itu palsu. Koreksi Bonferroni yang dipakai misi bersifat konservatif; alternatif (Holm, FDR) ada tapi tidak dicakup.
