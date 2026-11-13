# MLF-M3.4: Behavioral Profiling & Peer-Group — Normal Menurut Siapa?

## Masalah: Tagihan 3x Limit — Aneh atau Normal?

Nasabah LIMIT_BAL NT$50.000 punya BILL_AMT1 NT$162.865 — tagihannya 3,26 kali limitnya. Jari sudah di atas tombol «bekukan kartu» — lalu berhenti. Pertanyaan yang benar bukan «berapa besar tagihannya?», melainkan «normal menurut siapa?». Nasabah itu adalah baris UCI idx 13252 [notebook]: UTIL 3,257, z = 6,67 terhadap peer band-nya [50rb,150rb), dan default 0 (LANCAR). Ia membayar NT$5.000 dari tagihannya (PAY_RATIO 0,0307) secara revolving, tanpa satu pun telat di PAY_0..PAY_6. Outlier ekstrem ≠ fraud — peer outlier adalah undangan memeriksa, bukan bukti.

---

## 1. Behavioral Profile

Profil adalah ringkasan kebiasaan nasabah dalam beberapa angka agregat — bukan satu transaksi, melainkan pola. Tiga agregat lesson ini [notebook]: UTIL = BILL_AMT1 / LIMIT_BAL; PAY_RATIO = PAY_AMT1 / BILL_AMT1; BILL_TREND = BILL_AMT1 / rata-rata BILL_AMT1..6. Jangan tertukar dengan V (velocity, M3.3: jumlah bulan membayar) dan R (bill jump, M3.3: penyebut 5 bulan sebelumnya).

**Nilai:** 30.000 nasabah [notebook] — UTIL mean 0,4238, median 0,3140. PAY_RATIO median 0,0611 (mean 1,7761 menyesatkan: segelintir tagihan nyaris nol membuat rasionya meledak — medianlah pusat yang jujur). BILL_TREND mean 1,2586, median 1,0279. PAY_RATIO > 0,9 default 0,1539 (n = 4.140) vs PAY_RATIO < 0,1 default 0,2440 (n = 16.786). UTIL > 1 default 0,3007 (n = 2.115) vs UTIL ≤ 1 default 0,2152. BILL_TREND > 1,5 default 0,1646 vs BILL_TREND < 0,5 default 0,1608 — BILL_TREND sendirian hampir tidak membedakan.

**Baik/buruk:** bagus bila agregatnya stabil (rata-rata 6 bulan) dan definisinya transparan. Buruk bila agregatnya memakai informasi dari masa depan (leakage).

**Mitigasi:** tetapkan jendela observasi sebelum menghitung — di UCI ini profil September 2005 dari April–September 2005, label Oktober 2005 — dan tulis jendelanya di samping angkanya.

---

## 2. Peer Group: Band LIMIT_BAL

Peer group adalah kelompok pembanding yang «sebanding». Di lesson ini: band LIMIT_BAL half-open, tanpa tumpang tindih [notebook] — <50rb; [50rb,150rb); [150rb,300rb); [300rb+). LIMIT_BAL 150.000 masuk [150rb,300rb), bukan [50rb,150rb).

**Nilai [notebook]:** <50rb: n = 4.311, default 0,3607, UTIL mean 0,6426, sd 0,4029. [50rb,150rb): n = 10.979, default 0,2520, UTIL mean 0,5551, sd 0,4048. [150rb,300rb): n = 9.593, default 0,1682, UTIL mean 0,2918, sd 0,3667. [300rb+): n = 5.117, default 0,1368, UTIL mean 0,2049, sd 0,3070. Pola: limit makin besar → default makin rendah DAN utilization makin rendah.

**Gambar:** bar default rate (0,3607 / 0,2520 / 0,1682 / 0,1368) + garis UTIL mean (0,6426 / 0,5551 / 0,2918 / 0,2049) per band — dua penurunan searah, satu cerita segmen.

**Baik/buruk:** bagus bila limit mencerminkan segmen. Buruk bila dicampur aduk: UTIL 0,90 vs peer [300rb+) tampak ekstrem (z = 2,26), vs peer sendiri [50rb,150rb) biasa saja (z = 0,85). Peer group yang salah = perbandingan yang salah.

**Mitigasi:** band eksplisit half-open (tiap nasabah tepat satu band); tiap band cukup besar (terkecil n = 4.311); dokumentasikan definisi peer group di samping hasil.

$$\text{UTIL} = \frac{\text{BILL\_AMT1}}{\text{LIMIT\_BAL}}$$

---

## 3. Z-Score vs Peer

$$z = \frac{x - \text{mean peer}}{\text{sd peer}}, \quad \text{sd} = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n-1}}$$

Z-score mengubah selisih mentah menjadi selisih yang bisa dibandingkan antar band. Sd adalah simpangan baku SAMPEL — pembagi (n−1), bukan n.

**Nilai — contoh hitung eksak [notebook]:** idx 13252, UTIL 3,257, peer [50rb,150rb) mean 0,555, sd 0,405. z = (3,257 − 0,555) / 0,405 = 2,702 / 0,405 = 6,67. Artinya 6,67 simpangan baku di atas rata-rata peer-nya — bukan «6,67 kali lipat».

**Gambar:** diagram z-score — peer mean 0,555, batas +2 sd di 1,365, titik idx 13252 di 3,257 (z = 6,67). Batas bawah −2 sd = −0,255 (di bawah nol — UTIL tidak bisa negatif), jadi flag |z| > 2 praktis hanya terjadi di sisi atas.

**Baik/buruk:** bagus bila peer group besar dan homogen. Buruk bila peer kecil: outlier ikut menggelembungkan sd peer-nya sendiri (Lab 1: z N4 = 1,49 pada peer n = 4 vs 6,53 pada peer band n = 10.979).

**Mitigasi:** hitung mean/sd dari kelompok besar; laporkan mean dan sd peer di samping z-nya.

---

## 4. Flag |z| > 2: Undangan Memeriksa, Bukan Vonis

**Nilai [notebook]:** flag |z| > 2 dalam peer band — n = 788 dari 30.000 (2,63%), default rate 0,2640 vs keseluruhan 0,2212. Flag menaikkan risiko (selisih 0,0428) tapi jauh dari vonis: 73,60% yang di-flag TERNYATA lancar (580 dari 788). Tiga dari empat yang di-flag tidak default.

**Gambar:** saringan, bukan hakim — 30.000 baris menjadi 788 untuk diperiksa manusia; di dalam 788 itu, yang default hanya 208. Contoh paling ekstrem, idx 13252 (z = 6,67), default 0 (LANCAR): ia memakai tagihan 3,26x limitnya, membayar NT$5.000 secara revolving tanpa satu pun telat, dan tetap lancar.

**Baik/buruk:** bagus untuk triage (mengurutkan siapa diperiksa duluan). Buruk sebagai keputusan otomatis (auto-decline, auto-bekukan): 73,60% false alarm dalam arti «di-flag tapi lancar».

**Mitigasi:** jangan flag dari satu fitur saja; bedakan flag «periksa» dari keputusan «tindak»; ukur dan laporkan precision flag sendiri (di sini 0,2640). Ekonomi antrean pemeriksaan adalah M3.5.

---

## 5. Profile Drift

Drift membandingkan nasabah dengan dirinya sendiri di masa lalu. Level menjawab «seberapa jauh dari peer?», drift menjawab «seberapa cepat ia menjauh dari dirinya sendiri?».

**Nilai — kejujuran data [notebook]:** UCI satu snapshot (fitur April–September 2005, label Oktober 2005) — drift antar-periode yang sesungguhnya TIDAK mungkin; yang tersedia adalah perubahan di dalam jendela: rasio BILL_AMT1/BILL_AMT6 > 2 default 0,1568 (n = 5.747) vs < 0,5 default 0,1632 (n = 3.787). Drift sendirian hampir tidak membedakan — ia sinyal penguat, bukan sinyal tunggal.

**Baik/buruk:** bagus bila profil dasarnya stabil dan datanya berderet waktu. Buruk bila profil dasarnya bergejolak (musiman) atau jendelanya tumpang tindih.

**Mitigasi:** tetapkan baseline eksplisit (rata-rata 6 bulan) dan ambang drift sebelum melihat hasil; baca drift bersama level — drift tanpa level tidak tahu arahnya, level tanpa drift tidak tahu kecepatannya.

---

## Lab 1: Peer Mean/Sd + Z-Score (8 Nasabah)

2 peer group kecil: peer A (LIMIT NT$50.000) dan peer B (LIMIT NT$100.000). Peer A: n = 4, mean 1,2250, sd 1,3226 [lab]. Peer B: n = 4, mean 0,3000, sd 0,1080 [lab]. Z: N1 −0,6238; N2 −0,3970; N3 −0,4726; N4 1,4933; N5 −0,9258; N6 0,0000; N7 −0,4629; N8 1,3887 [lab]. N4 (UTIL 3,2000) hanya z = 1,4933 — ia sendiri menggelembungkan sd peer A. N8 (UTIL 0,4500) z = 1,3887 — z mengukur jauhnya dari peer, bukan besarnya angka.

## Lab 2: Flag |z| > 2 dengan Peer Band Besar

8 nasabah yang sama dinilai terhadap peer band kanonis [50rb,150rb) (mean 0,555, sd 0,405, n = 10.979) [lab]. Hanya N4 di-flag (z = 6,5309); default rate yang di-flag 0,0000 vs yang tidak di-flag 0,2857 [lab]. Nasabah yang sama, peer yang berbeda, keputusan yang berbeda — dan n = 8 terlalu kecil untuk menilai kualitas sebuah flag.

## Mini-case: idx 13252 — Dari Flag ke Tindakan

Fakta [notebook]: LIMIT_BAL NT$50.000, BILL_AMT1 NT$162.865, UTIL 3,257, z = 6,67, default 0 (LANCAR). Flag berkata «periksa duluan». Pemeriksaan bertanya: (1) UTIL tinggi ini menetap atau satu bulan saja? (2) Apakah ia membayar (PAY_RATIO, PAY_0..PAY_6)? (3) Apakah profilnya drift? Bila ketiganya menjawab «ia memang begitu dan ia membayar»: tidak ada tindakan, catat sebagai profil ekstrem yang sah. Bila salah satunya menjawab «ini baru dan ia tidak membayar»: eskalasi ke pemeriksa senior — tetap bukan bekukan otomatis.

## Guided Task di Colab

Notebook: colab/mlf-m34-guided-task.ipynb — profiling (UTIL, PAY_RATIO, BILL_TREND), peer band LIMIT_BAL, z-score + flag |z| > 2, contoh idx 13252, dan profile drift di data UCI 30.000 nasabah dengan checks. Tautan Colab: https://colab.research.google.com/drive/1dCk7vX61YHTN21xn14bNofuSgiLvTCNU

## Rangkuman

- Behavioral profile: UTIL, PAY_RATIO, BILL_TREND — median lebih jujur dari mean bila distribusinya miring.
- Peer group = band LIMIT_BAL half-open: limit makin besar → default makin rendah (0,3607 → 0,1368) dan UTIL makin rendah (0,6426 → 0,2049).
- Z-score: z = (x − mean peer) / sd peer, sd sampel (pembagi n−1). Contoh eksak: idx 13252 z = 6,67.
- Flag |z| > 2: n = 788 (2,63%), default 0,2640 vs 0,2212 — tapi 73,60% yang di-flag ternyata lancar: undangan memeriksa, bukan vonis.
- Profile drift: bandingkan nasabah dengan dirinya sendiri; drift sendirian hampir tidak membedakan — ia penguat, bukan sinyal tunggal.
- Lab: peer kecil membuat z N4 hanya 1,49; peer band membuat z N4 6,53 — nasabah yang sama, peer yang berbeda, keputusan yang berbeda.
