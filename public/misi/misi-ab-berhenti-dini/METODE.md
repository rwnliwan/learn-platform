# METODE — Misi A/B yang Berhenti Dini (misi-ab-berhenti-dini)

- **Sumber data:** SINTETIS 100% — simulasi Python (seed 42) khusus untuk misi ini. BUKAN hasil eksperimen nyata; tidak ada pengguna atau produk sungguhan di balik angka-angka ini.
- **Lisensi/atribusi:** dataset sintetis dibuat untuk Learn v2; bebas dipakai untuk pembelajaran. Atribusi: Learn v2 — Misi Marketing Analytics.
- **Seri:** 30 eksperimen A/A × 28 hari = 840 baris.
- **Metode:** tiap eksperimen × hari: 1.000 pengunjung per lengan; konversi ~ Binomial(1000; 0,10) di KEDUA lengan — efek sebenarnya = NOL oleh desain, sehingga setiap hasil "signifikan" adalah false positive yang terdokumentasi; kolom n_*/konv_* bersifat kumulatif. Kolom: eksperimen_aa.csv (eksperimen_id,hari,n_kontrol,konv_kontrol,n_varian,konv_varian).
- **Seed:** 42.
- **Tanggal tangkapan:** 2026-10-15. Ukuran: 22764 byte.
- **Batas jujur:** efek nol adalah desain simulasi agar false positive terukur — bukan klaim bahwa eksperimen nyata berperilaku sama; ini satu simulasi, bukan hukum alam. Koreksi Bonferroni yang dipakai di misi ini bersifat konservatif (bisa melewatkan efek kecil yang nyata).
