# MLF2: Membaca Angka — Statistik untuk Hasil Model

## Masalah: Return Rata-rata 4,95% — atau 2,0%?

Return strategi 10 bulan: rata-rata 4,95% per bulan. Datanya: sembilan bulan antara −1% dan 4%, satu bulan 35%. Median — nilai tengah setelah diurutkan — hanya 2,0%. Mean dan median bercerita berbeda; lesson ini mengajarkan membaca bentuk distribusi, base rate, interval, dan korelasi.

---

## 1. Mean vs Median (Distribusi dan Skewness)

Mean = jumlah nilai dibagi n. Median = nilai tengah setelah diurutkan.

**Nilai:** 10 return — mean 0,0495, median 0,0200, sd 0,1012. Selisih 0,0295; rasio mean/median = 0,0495 / 0,0200 = 2,475 (right-skew). Bulan 0,35 menyumbang 0,035 ke mean — lebih dari dua pertiga nilai mean (0,035 dari 0,0495). Simpangan baku di sini adalah population sd (dibagi n, bukan n−1).

**Gambar:** histogram — 9 bulan menumpuk di −0,01 sampai 0,04; 1 bulan di 0,35. Garis mean (0,0495) jatuh di daerah kosong; garis median (0,0200) di tengah bulan biasa.

**Baik/buruk:** mean baik bila simetris tanpa outlier; buruk bila skew. Median baik bila skew; buruk bila yang penting justru ekornya (risk).

**Mitigasi:** laporkan median bersama mean; transformasi log untuk menarik ekor; laporkan kuantil ekor (P95, P99) bila ekornya penting.

**Batas scope:** lesson ini membaca implikasi distribusi terhadap hasil model. Diagnosis distribusi dan transformasi mendalam (QQ plot, skewness/kurtosis, IQR, z-score, log-transform) adalah materi L0.3.

$$\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i \qquad \text{median} = \begin{cases} x_{((n+1)/2)}, & n \text{ ganjil} \\ \frac{x_{(n/2)} + x_{(n/2+1)}}{2}, & n \text{ genap} \end{cases} \text{ (data terurut)}$$

---

## 2. Base Rate dan Bayes (PPV)

PPV = peluang benar-benar fraud bila tes memberi alert. Bergantung base rate, bukan hanya akurasi tes.

**Nilai:** tes sens 0,99, spec 0,99. Prevalensi 1% → PPV 0,5000. Prevalensi 10% → 0,9167. Prevalensi 22,12% (notebook) → 0,9657. Hitungan: 0,99 × 0,01 / (0,99 × 0,01 + 0,01 × 0,99) = 0,0099 / 0,0198 = 0,5000.

**Gambar:** tiga bar PPV — 50,0%, 91,7%, 96,6%. Tes identik, kesimpulan berbeda.

**Baik/buruk:** PPV 0,5000 buruk untuk pemblokiran otomatis; bisa diterima untuk antrean investigasi manusia.

**Mitigasi:** laporkan PPV bersama prevalensi dan biaya tindak lanjut; naikkan threshold atau tambah sinyal kedua bila prevalensi rendah.

**Rantai ke keputusan:** base rate → PD → PD × LGD × EAD = expected loss → bandingkan dengan margin → threshold. Contoh [ilustrasi] MLF1: PD 0,5 → EL Rp2.250.000 vs margin Rp500.000 (tolak); PD 0,1 → EL Rp450.000 vs margin Rp500.000 (setujui bersyarat).

$$P(\text{fraud} \mid \text{alert}) = \frac{\text{sens} \times \text{prev}}{\text{sens} \times \text{prev} + (1-\text{spec}) \times (1-\text{prev})}$$

---

## 3. Interval Kepercayaan (Wilson)

Estimasi titik selalu punya ketidakpastian. CI 95% memberi rentangnya.

**Nilai:** default rate 1.327/6.000 = 0,2212. Wilson 95%: [0,2108, 0,2318] — lebar 0,0210. Dengan n = 100 (22/100): [0,1500, 0,3107] — lebar 0,1607, yaitu 7,65 kali lebih lebar (0,1607 / 0,0210).

**Gambar:** dua interval — n = 6.000 pendek dan tegas; n = 100 panjang dan ragu.

**Baik/buruk:** CI sempit = presisi, keputusan bisa tegas. CI lebar = jujur tentang ketidaktahuan, buruk untuk keputusan yang butuh presisi.

**Mitigasi:** tambah sampel (lebar menyusut sebanding akar n — 4× sampel untuk 2× presisi); bila tidak bisa, buat keputusan yang robust di seluruh rentang interval.

**Teaser:** metrik model punya ketidakpastian yang sama: ROC-AUC GBM 0,7823 [notebook] adalah estimasi dari test set 6.000 nasabah, bukan konstanta populasi; selisih 0,0397 terhadap LR juga punya ketidakpastian. Bootstrap untuk interval metrik dibahas penuh di M9.

---

## 4. Korelasi dan Signifikansi

Korelasi r mengukur gerak bersama (−1 sampai 1). P-value mengukur keterkejutan data bila tidak ada efek.

**Nilai:** limit vs tagihan, 14 nasabah, r = 0,899 — kuat, tapi bukan bukti sebab-akibat (penghasilan bisa menjelaskan keduanya). Korelasi 0,02 dengan n = 30.000: SE ≈ 1/√30.000 = 0,0058; z = 0,02/0,0058 = 3,47; p ≈ 0,0005 — signifikan statistik, remeh secara bisnis.

**Gambar:** scatter limit vs tagihan + garis tren.

**Baik/buruk:** korelasi 0,899 baik sebagai sinyal prediktif, buruk sebagai klaim kausal. P-value kecil baik sebagai bukti ada sesuatu, buruk bila dipakai tanpa effect size.

**Mitigasi:** laporkan effect size bersama p-value; untuk klaim kausal butuh eksperimen atau kontrol perancu.

**Implikasi untuk model:** dua fitur berkorelasi 0,899 hampir membawa informasi yang sama — memasukkan keduanya ke logistic regression membuat koefisien tidak stabil (multicollinearity). Di scorecard M2, fitur redundant disaring sebelum masuk model.

$$r = \frac{\sum (x_i-\bar{x})(y_i-\bar{y})}{\sqrt{\sum (x_i-\bar{x})^2 \sum (y_i-\bar{y})^2}}$$

---

## Lab 1: Mean, Median, Wilson

mean = 0,0495; median = 0,0200; sd = 0,1012. Wilson 95%: [0,2108, 0,2318] (n = 6.000); [0,1500, 0,3107] (n = 100).

## Lab 2: PPV Bayes

PPV: 0,5000 (prev 1%); 0,9167 (10%); 0,9657 (22,12%). Dari 10.000 transaksi: TP = 99, FP = 99, alert benar 50,0%.

## Mini-case: 198 Alert, Separuh Salah

198 alert (99 TP + 99 FP). Blokir otomatis: 99 nasabah legit terblokir. Investigasi Rp50.000/alert: biaya 198 × 50.000 = Rp9.900.000; manfaat 99 × Rp2.000.000 = Rp198.000.000; bersih Rp188.100.000/hari. Keputusan: investigasi, bukan blokir.

## Guided Task di Colab

Notebook: colab/mlf2-guided-task.ipynb — audit statistik portofolio pinjaman dengan checks. Tautan Colab: https://colab.research.google.com/drive/1wePvbiPSYY9NxBEpnN1sygFV9zlJPJiB. Companion: notebook credit scoring (https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO).

## Rangkuman

- Mean vs median: selisih keduanya tes skew termurah.
- PPV ditentukan base rate: 0,5000 pada prevalensi 1%.
- CI menyusut dengan akar n.
- Korelasi bukan sebab-akibat; p kecil bukan berarti penting.
