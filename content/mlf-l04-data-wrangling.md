# L0.4: Data Wrangling — dari Raw ke Analysis-Ready

## Masalah: Dua File yang Belum Bisa Bicara

Analis punya dua file. File pertama: 6 pelamar dengan nama, income, pendidikan, dan status pernikahan. File kedua: 6 riwayat pembayaran dengan 6 kolom bulan (BILL_AMT1 sampai BILL_AMT6) — satu baris per nasabah, satu kolom per bulan. Status pernikahan berkode 1, 2, 3 dan pendidikan 1 sampai 4 — angka yang tampak seperti bilangan, tapi sebenarnya label. Tidak satu pun file itu bisa langsung dimodelkan.

---

## 1. Reshape

Reshape mengubah bentuk tabel tanpa mengubah isinya: wide menjadi long, atau sebaliknya. Kuncinya adalah menghitung baris sebelum dan sesudah.

**Nilai:** 3 nasabah × 6 bulan menjadi 18 baris [lab] — tiap nasabah-bulan menjadi satu baris (nasabah, bulan, tagihan). 30.000 × 6 = 180.000 baris bila di-melt [ilustrasi]; notebook ini sendiri tetap wide dan mengagregasi kolomnya (cell 13).

**Gambar:** kiri tabel wide 3 baris × 6 kolom bulan; kanan tabel long 18 baris × 3 kolom. Tidak ada nilai yang berubah — hanya susunannya.

**Baik/buruk:** wide baik untuk dibaca dan dilaporkan. Wide kurang cocok bila yang dibutuhkan adalah operasi per-waktu (agregasi runtun, lag, model deret waktu); untuk model tabular, wide sah dan justru yang dipakai notebook ini — long dipakai untuk menurunkan agregat seperti PAY_MEAN. Long baik untuk agregasi dan model deret waktu. Long buruk untuk dibaca manusia.

**Mitigasi:** verifikasi hitungan baris sesudah reshape (3 × 6 sama dengan 18; 30.000 × 6 sama dengan 180.000) dan periksa total tagihan sebelum dan sesudah sama.

$$\text{baris long} = n_{\text{nasabah}} \times n_{\text{bulan}}$$

---

## 2. Join

Join menggabungkan dua tabel berdasarkan kunci yang sama. Tiga jenis join mengubah jumlah baris dengan cara yang berbeda.

**Nilai:** Tabel A (pelamar) id 1 sampai 6 — 6 baris [lab]. Tabel B (pembayaran) id 2 sampai 7 — 6 baris [lab]. Inner join: id 2, 3, 4, 5, 6 — 5 baris. Left join: 6 baris — id 1 tanpa pembayaran, kolomnya NaN. Full outer join: id 1 sampai 7 — 7 baris.

**Gambar:** inner memotong yang tidak berpasangan; left mempertahankan A sepenuhnya; outer mempertahankan semuanya.

**Baik/buruk:** inner baik bila hanya peduli nasabah yang lengkap datanya — tapi diam-diam membuang id 1. Left baik bila tabel A adalah populasi analisis — NaN di id 1 adalah informasi. Full outer baik untuk audit. Outer buruk untuk modelling langsung.

**Mitigasi:** sebelum join, cek kunci di kedua tabel — apakah ada duplikat kunci? Satu id yang muncul dua kali di tabel B akan menggandakan baris A-nya (fan-out, bukan cartesian product). Cek tipe kunci: id string "001" tidak sama dengan integer 1. Setelah join, verifikasi hitungan baris: inner 5, left 6, outer 7.

Kardinalitas adalah deklarasi sebelum join, bukan penemuan sesudahnya. Empat relasi yang mungkin: one-to-one (satu nasabah, satu profil), one-to-many (satu nasabah, banyak riwayat pembayaran), many-to-one (banyak riwayat, satu nasabah), dan many-to-many (banyak nasabah, banyak produk — butuh tabel jembatan). Sebelum join, nyatakan relasi yang diharapkan — di sini: satu nasabah → banyak riwayat (one-to-many) — lalu cek keunikan kunci di kedua tabel: id di A unik (6 id berbeda), id di H tidak unik (id 2 muncul 3 kali, id 3 muncul 2 kali). Bila relasi yang diharapkan one-to-one tapi kuncinya tidak unik, ada yang salah di data — jangan join dulu. Sesudah join, hitung perubahan baris: A 6 baris join H 8 baris riwayat menjadi 8 baris — satu baris per (nasabah, riwayat), bukan per nasabah. Bila grain yang dibutuhkan adalah satu baris per nasabah, agregasi kembali: rata-rata pembayaran per nasabah — id 2: 150,0; id 3: 210,0; id 4: 100,0; id 5: 300,0; id 6: 250,0 [lab] — 5 baris, id 1 hilang karena inner (tidak punya riwayat). Grain adalah kontrak: tiap join harus bisa menjawab "satu baris mewakili apa?" — bila jawabannya berubah tanpa disadari, analisis sesudahnya salah grain.

---

## 3. Encoding

Model tidak membaca label — ia membaca angka. Salah encoding berarti model belajar urutan yang tidak ada.

**Nilai:** MARRIAGE 3 kategori (1 menikah, 2 lajang, 3 lainnya) — one-hot menghasilkan 3 kolom baru (atau 2 bila drop first, untuk menghindari dummy trap) [lab]. EDUCATION 4 kategori (1 graduate, 2 university, 3 high school, 4 others) — 1 sampai 3 berurutan (graduate lebih tinggi dari university), jadi ordinal boleh dipakai untuk 1–3, dengan catatan jarak antar-jenjang diasumsikan sama dan arah kode harus didokumentasikan; kategori 4 = others sebaiknya dipisah (indikator sendiri atau "unknown"), bukan diberi peringkat 4.

**Gambar:** MARRIAGE → 3 kolom biner; EDUCATION → 1 kolom ordinal 1–3 + indikator untuk 4 (others).

**Baik/buruk:** one-hot baik untuk kategori nominal tanpa urutan. One-hot buruk bila kategorinya ratusan. Ordinal baik bila urutannya bermakna. Ordinal buruk bila urutannya tidak ada — memberi kode 1, 2, 3 pada tiga kota berarti model mengira kota 3 "lebih besar" dari kota 1.

**Mitigasi:** tanyakan "apakah urutannya bermakna?" Bila ya, ordinal. Bila tidak, one-hot. Bila kategorinya terlalu banyak, kelompokkan dulu yang jarang baru one-hot. Dokumentasikan kamusnya.

$$\text{one-hot: } k \text{ kategori} \rightarrow k \text{ kolom (atau } k-1 \text{ bila drop first)}$$

---

## 4. Checklist Analysis-Ready

Lima menit yang menghemat lima jam debugging:

- **Tipe:** tiap kolom bertipe yang benar? Income yang masih string berarti L0.1 belum selesai.
- **Satuan:** semua uang dalam satuan yang sama?
- **Rentang:** tiap kolom di dalam rentang yang masuk akal (PAY −2 sampai 8, EDUCATION 1 sampai 4, MARRIAGE 1 sampai 3)?
- **Konsistensi:** jumlah baris cocok dengan hitungan reshape dan join? Total tagihan sebelum dan sesudah reshape sama?
- **Jejak:** tiap keputusan cleaning, imputasi, dan encoding tercatat?

**Nilai:** notebook credit scoring cell 13 — PAY_MEAN, PAY_MAX, PAY_DELAY_COUNT, UTILIZATION (BILL_AMT1 dibagi LIMIT_BAL), PAY_RATIO, BILL_MEAN, PAY_AMT_MEAN, BILL_TREND. Itu wrangling yang sebenarnya: bukan sekadar membersihkan, melainkan membentuk fitur yang dipakai model.

---

## Lab

**Lab 1 — Hitung baris tiga join.** Tiga tugas, termasuk menyatakan relasi yang diharapkan (satu nasabah → banyak riwayat), join A dengan riwayat H, dan agregasi kembali ke satu baris per nasabah. Hasil: inner 5 baris (ids 2, 3, 4, 5, 6), left 6 baris (id 1 tanpa pembayaran), outer 7 baris (ids 1, 2, 3, 4, 5, 6, 7), join A dengan H 8 baris (6 → 8), agregasi kembali 5 baris (satu per nasabah id 2–6), rata-rata id 2: 150,0; id 3: 210,0; id 4: 100,0; id 5: 300,0; id 6: 250,0.

**Lab 2 — Reshape wide ke long dan one-hot.** Hasil: baris long 18, total tagihan long 3.990, kolom one-hot MARRIAGE 3, MARRIAGE=1 ada 2, MARRIAGE=2 ada 3, MARRIAGE=3 ada 1.

---

## Peta Keputusan

- Bentuk: wide untuk dibaca manusia; long untuk model dan agregasi. Hitungan baris sesudah reshape harus cocok.
- Gabung: hanya yang lengkap — inner. Semua pelamar — left. Audit — full outer. Cek kunci dulu: duplikat dan tipe kunci.
- Arti: urutan bermakna — ordinal (EDUCATION 1–3; 4 = others dipisah). Tidak — one-hot (MARRIAGE, kota). Kategori terlalu banyak — kelompokkan yang jarang dulu.
- Checklist akhir: tipe benar, satuan sama, rentang masuk akal, jumlah baris cocok, tiap keputusan tercatat.

Koneksi ke modul berikutnya: wrangling adalah fondasi feature table — di M1, tabel analysis-ready dari lesson ini adalah input langsung pipeline ML (MLF1: framing → data → fitur); di M2, PAY_MEAN, PAY_DELAY_COUNT, dan BILL_MEAN dari cell 13 menjadi fitur scorecard, dan grain satu-baris-per-nasabah adalah syarat agar target (default) punya tepat satu baris per nasabah; di M3, join dengan data jaringan (graph) menambah fitur relasi; di M9, backtesting dan walk-forward bergantung pada time structure yang benar — grain waktu yang salah membuat backtest bocor. Peta lengkap L0 → M1–M9 ada di L0.5.

---

## Mini-case: Fitur Baru Notebook Credit Scoring

Cell 13 notebook: dari 6 kolom PAY mentah dibuat PAY_MEAN, PAY_MAX, dan PAY_DELAY_COUNT; dari BILL_AMT1 dan LIMIT_BAL dibuat UTILIZATION (BILL_AMT1 dibagi LIMIT_BAL); ditambah PAY_RATIO, BILL_MEAN, PAY_AMT_MEAN, dan BILL_TREND. UTILIZATION bisa negatif bila BILL_AMT1 negatif (saldo kredit), jadi namanya menyesatkan bila tidak dijelaskan. PAY_DELAY_COUNT merangkum 6 kolom menjadi satu angka yang lebih stabil dan lebih mudah dibaca model daripada 6 kolom yang berkorelasi satu sama lain. Notebook tidak menggabungkan tabel lain (datanya satu tabel) — bila menggabungkan data aplikasi dengan data pembayaran, kuncinya adalah ID nasabah, dan cek pertama adalah duplikat kunci di kedua tabel.

Gambar tiga tahap yang sama dari sisi grain: transaction-level (satu baris = satu transaksi; key-nya (nasabah, tanggal); belum ada agregasi) → customer-month (satu baris = satu nasabah-bulan; key-nya (nasabah, bulan); agregasi sum/mean per bulan) → customer-level feature table (satu baris = satu nasabah; key-nya nasabah; agregasi PAY_MEAN, PAY_DELAY_COUNT, BILL_MEAN dari cell 13). Dan satu aturan yang mengikat ketiganya: target (default Oktober 2005) TIDAK BOLEH dipakai sebagai fitur di tahap mana pun — ia baru dipakai sebagai label saat training. Memakai target untuk membentuk fitur adalah leakage (L0.2): fitur yang mengandung jawaban. PAY_MEAN merangkum 6 kolom PAY menjadi satu angka; PAY_DELAY_COUNT menghitung bulan terlambat; BILL_MEAN merangkum 6 kolom tagihan — ketiganya dihitung dari kolom mentah sebelum Oktober 2005, tanpa menyentuh kolom target.

---

## Guided Task di Colab

Wrangling 60 pengajuan sintetis (seed 42): reshape 60 × 6 sama dengan 360 baris, join dengan satu id yang sengaja tidak punya pasangan (left vs inner), encoding MARRIAGE (one-hot) dan EDUCATION (ordinal).

Buka di Colab: https://colab.research.google.com/drive/14oNQnlZMo8HHynKs2r-Bh8klXm2hv62N
