# A1.1: Tipe Data & Skala Pengukuran

## Mengapa Ini Penting?

Setiap analisis dimulai dari pertanyaan sederhana: **data ini sebenarnya apa?**

Bayangkan kamu analis risiko di bank. Kamu dapat dua kolom:
- `pendapatan_bulanan`: 8500000, 12000000, 6700000...
- `rating_kredit`: "A", "B", "C", "D"...

Kelihatannya sepele. Tapi kalau kamu perlakukan `rating_kredit` seperti angka (A=1, B=2, lalu dihitung rata-ratanya = 2.3), kamu baru saja membuat kesalahan fatal. Rating "B" bukan dua kali lebih baik dari rating "D". Angka 2.3 tidak punya arti.

Lesson ini memastikan kamu tidak pernah membuat kesalahan itu.

---

## 1. Empat Skala Pengukuran

Psikolog Stanley Stevens (1946) mengklasifikasikan data ke dalam empat skala. Ini bukan teori akademis belaka — skala menentukan **operasi matematika apa yang valid**.

### Nominal: Kategori Tanpa Urutan

Data nominal hanya label. Tidak ada "lebih besar" atau "lebih kecil".

**Contoh:**
- Jenis kelamin: Laki-laki / Perempuan
- Status perkawinan: Belum kawin / Kawin / Cerai
- Kode cabang bank: JKT-01, SBY-02, MDN-03

**Operasi valid:** = , ≠ (sama atau beda saja)
**Operasi TIDAK valid:** +, -, ×, ÷, rata-rata, urutan

> **Jebakan umum:** Kode pos "10110" dan "20112" — terlihat seperti angka, tapi ini nominal. Rata-rata kode pos tidak bermakna.

### Ordinal: Kategori Berurutan, Jarak Tidak Pasti

Data ordinal punya urutan, tapi jarak antar level tidak diketahui sama.

**Contoh:**
- Rating kredit: AAA > AA > A > BBB > BB...
- Tingkat kepuasan: Sangat puas > Puas > Netral > Tidak puas
- Level pendidikan: SD < SMP < SMA < S1 < S2

**Operasi valid:** = , ≠ , < , > (perbandingan urutan)
**Operasi TIDAK valid:** + , - , rata-rata aritmatika

**Mengapa rata-rata rating berbahaya?**

Misal tiga nasabah: rating A, B, C. Kalau A=1, B=2, C=3, rata-rata = 2 (="B"). Tapi apakah jarak A→B sama dengan B→C? Dalam dunia nyata, lompatan dari A ke B (masih investment grade) jauh lebih kecil daripada B ke C (jatuh ke junk). Rata-rata menyembunyikan ini.

> **Aturan praktis:** Untuk ordinal, gunakan **median** atau **modus**, bukan mean.

### Interval: Urutan + Jarak Sama, Nol Bukan Absolut

Skala interval punya jarak yang bermakna, tapi titik nol-nya arbitrer (bukan "tidak ada").

**Contoh:**
- Suhu Celsius: 20°C ke 30°C = 10 derajat, sama dengan 30°C ke 40°C
- Skor IQ: selisih 10 poin sama di mana pun
- Tahun kalender: 2020 ke 2025 = 5 tahun

**Operasi valid:** + , - (selisih bermakna)
**Operasi TIDAK valid:** × , ÷ (rasio tidak bermakna)

**Mengapa?** 40°C BUKAN "dua kali lebih panas" dari 20°C. Nol Celsius bukan berarti "tidak ada suhu" — itu titik beku air yang dipilih manusia. Dalam Kelvin (nol absolut), rasio baru bermakna.

### Rasio: Interval + Nol Absolut

Skala rasio punya semua sifat interval, plus nol yang berarti "tidak ada sama sekali".

**Contoh:**
- Pendapatan: Rp 0 = tidak ada pendapatan
- Jumlah transaksi: 0 = tidak ada transaksi
- Durasi: 0 detik = tidak ada waktu
- Saldo rekening: Rp 0 = kosong

**Operasi valid:** Semua (+, -, ×, ÷)

Rp 10 juta memang dua kali Rp 5 juta. Ini valid karena Rp 0 berarti benar-benar nol.

---

## 2. Tabel Ringkasan

| Skala | Urutan | Jarak Sama | Nol Absolut | Contoh | Ukuran Tepat |
|-------|--------|------------|-------------|--------|--------------|
| Nominal | ❌ | ❌ | ❌ | Jenis kelamin, kode cabang | Modus |
| Ordinal | ✅ | ❌ | ❌ | Rating kredit, kepuasan | Median, modus |
| Interval | ✅ | ✅ | ❌ | Suhu °C, skor IQ | Mean, SD |
| Rasio | ✅ | ✅ | ✅ | Pendapatan, jumlah | Mean, SD, rasio |

---

## 3. Grain Data: Satu Baris = Apa?

**Grain** adalah level detail dari satu baris data. Ini pertanyaan paling penting sebelum analisis: *satu baris mewakili apa?*

**Contoh tabel transaksi:**

| Baris | tanggal | nasabah_id | jumlah |
|-------|---------|------------|--------|
| 1 | 2026-10-01 | N001 | 500000 |
| 2 | 2026-10-01 | N001 | 250000 |
| 3 | 2026-10-02 | N002 | 1000000 |

**Grain:** satu baris = satu transaksi.

**Mengapa ini penting?**

Jika kamu hitung `COUNT(*)` = 3, itu artinya 3 transaksi, BUKAN 3 nasabah (hanya ada 2 nasabah unik: N001, N002). Salah memahami grain → salah menghitung → salah keputusan.

**Grain yang umum:**
- Satu baris = satu transaksi (data transaksional)
- Satu baris = satu nasabah per bulan (data snapshot bulanan)
- Satu baris = satu pengajuan kredit (data aplikasi)

> **Aturan emas:** Selalu dokumentasikan grain di awal. Tulis satu kalimat: "Satu baris = ___." Kalau tidak bisa jawab, jangan lanjutkan analisis.

---

## 4. Latihan

### Quiz 1
Kolom `kode_pos` berisi "10110", "20112", "30114". Skala apa ini?

A. Ordinal — karena angkanya berurutan
B. Nominal — karena hanya label wilayah
C. Interval — karena selisihnya bermakna
D. Rasio — karena bisa dihitung rata-rata

<details>
<summary>Klik untuk jawaban</summary>

**B. Nominal.** Kode pos hanya label wilayah. "20112" tidak "lebih besar" dari "10110" dalam arti bermakna. Rata-rata kode pos tidak ada artinya.

Jebakan: jangan tertipu karena terlihat seperti angka!
</details>

### Quiz 2
Bank mencatat `dpd` (days past due): 0, 15, 30, 90. Skala apa?

A. Nominal
B. Ordinal
C. Interval
D. Rasio

<details>
<summary>Klik untuk jawaban</summary>

**D. Rasio.** DPD = 0 berarti tidak menunggak sama sekali (nol absolut). DPD 60 memang dua kali DPD 30. Semua operasi matematika valid.
</details>

### Quiz 3
Tabel memiliki 10.000 baris dengan kolom `bulan` dan `nasabah_id`. Setiap kombinasi bulan+nasabah muncul tepat sekali. Apa grain-nya?

A. Satu baris = satu transaksi
B. Satu baris = satu nasabah per bulan
C. Satu baris = satu bulan
D. Tidak bisa ditentukan

<details>
<summary>Klik untuk jawaban</summary>

**B. Satu baris = satu nasabah per bulan.** Ini pola snapshot bulanan — setiap nasabah punya satu baris per bulan. COUNT(*) = jumlah snapshot, bukan jumlah nasabah unik atau transaksi.
</details>

---

## 5. Kesimpulan

1. **Kenali skala sebelum hitung.** Nominal → jangan dirata-rata. Ordinal → pakai median.
2. **Waspadai angka yang bukan angka.** Kode, ID, dan label berkedok numerik adalah nominal.
3. **Tentukan grain di awal.** Satu baris = apa? Tulis, jangan diasumsikan.

**Next:** A1.2 — Ukuran Pemusatan (mean, median, modus, dan kawan-kawannya)
