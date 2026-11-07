import type { V2Lesson } from "../lib/types";

export const mle4: V2Lesson = {
  slug: "mle4-evaluasi",
  track: "Machine Learning Engineer",
  module: "Fondasi Produksi",
  title: "MLE4 — Evaluasi di Luar Akurasi",
  estMinutes: 65,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Akurasi adalah metrik yang paling sering dikutip dan paling sering menipu. Lesson ini melengkapimu dengan metrik yang jujur untuk keputusan produksi.",
        "Tujuan lesson ini:",
        "• Menjelaskan accuracy paradox pada data imbalance dengan angka konkret.",
        "• Menghitung precision, recall, F1 dari confusion matrix dari nol.",
        "• Memilih threshold berdasarkan cost, bukan default 0,5.",
        "• Mengukur kalibrasi model dengan Expected Calibration Error (ECE).",
        "• Melakukan slice evaluation: metrik per segmen, bukan cuma global.",
        "• Mengukur ketidakpastian metrik dengan interval kepercayaan (Wilson) dan membandingkan dua model secara berpasangan (McNemar).",
        "Isi lesson: cerita model fraud '99% akurat' yang buta → precision/recall + lab → kalibrasi + lab → interval kepercayaan + uji perbandingan model + lab → slice evaluation → peta keputusan metrik → mini-case cost threshold → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Model 99% akurat yang tidak menangkap satu pun penipu",
      prose: [
        "Sebuah payment gateway membanggakan model fraud dengan akurasi 99,3%. Direksi puas. Tiga bulan kemudian, tim finance bertanya: kenapa kerugian fraud naik 40%?",
        "Twist-nya sederhana sekaligus brutal: hanya 0,7% transaksi yang fraud. Model yang memprediksi 'bukan fraud' untuk SEMUA transaksi otomatis mendapat akurasi 99,3% — sambil membiarkan setiap penipu lolos. Recall-nya: 0%.",
        "Inilah accuracy paradox: pada data imbalance, akurasi didominasi kelas mayoritas dan tidak memberi tahu apa-apa tentang kemampuan model pada kelas yang penting.",
        "Pelajaran MLE: metrik evaluasi harus selaras dengan BIAYA KESALAHAN bisnis. Salah memprediksi fraud (false negative) biayanya jutaan rupiah; salah menandai transaksi legit (false positive) biayanya satu investigasi. Akurasi memperlakukan keduanya sama — bisnis tidak.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'akurasi 99% = model hebat'",
        type: "pitfall",
        body: "Yang benar: bandingkan dengan baseline mayoritas. Jika 99% datamu kelas A, model 'selalu tebak A' juga 99% akurat. Metrik yang jujur untuk imbalance: precision, recall, F1, atau PR-AUC — bukan akurasi.",
      },
    },
    {
      id: "pr",
      eyebrow: "Langkah 3 · Precision, recall, F1",
      title: "Confusion matrix: empat kotak yang bercerita",
      prose: [
        "Confusion matrix membagi prediksi menjadi: TP (benar menangkap), FP (salah tuduh), FN (lolos), TN (benar melepas). Dari sini: precision = TP/(TP+FP) — 'dari yang ditangkap, berapa yang benar-benar fraud?'; recall = TP/(TP+FN) — 'dari semua fraud, berapa yang tertangkap?'.",
        "Tradeoff abadi: menurunkan threshold menangkap lebih banyak fraud (recall naik) tetapi salah tuduh makin banyak (precision turun). Tidak ada threshold yang memaksimalkan keduanya — pilihannya adalah keputusan bisnis.",
        "F1 = 2·precision·recall/(precision+recall) adalah rata-rata harmonik keduanya — berguna sebagai SATU angka ringkas, tetapi jangan biarkan ia menggantikan pemahaman tradeoff.",
        "Lab: dari 2.000 transaksi (5% fraud), model pada threshold 0,5 menghasilkan akurasi 78,4% tetapi precision hanya 14,8% — 'lumayan' yang menipu, lagi.",
        "Memilih threshold — formula keputusan. Threshold optimal = titik di mana (biaya FP × P(FP)) = (biaya FN × P(FN)) marginal. Contoh minicase: FN Rp500rb, FP Rp20rb → rasio 25:1 → threshold RENDAH (tangkap banyak, toleransi salah tuduh). Jika dibalik (FP Rp500rb, FN Rp20rb — misal blokir akun) → threshold TINGGI. Threshold 0,5 default = asumsi biaya 1:1 — yang HAMPIR TIDAK PERNAH benar. “Kenapa 0,5?” — jika tidak bisa jawab dengan biaya, threshold-mu tebak-tebakan.",
      ],
      formula: String.raw`\text{precision} = \frac{TP}{TP+FP} \qquad \text{recall} = \frac{TP}{TP+FN} \qquad F_1 = \frac{2PR}{P+R}`,
      formulaNote: "precision = TP/(TP+FP): “dari yang ditangkap, berapa yang benar-benar fraud” — mengukur KETEPATAN tuduhan. recall = TP/(TP+FN): “dari semua fraud yang ada, berapa yang tertangkap” — mengukur KELENGKAPAN penangkapan. Keduanya 0–1; tidak ada threshold yang memaksimalkan keduanya — pilih berdasarkan biaya FN vs FP (lihat minicase).",
      figure: {
        svg: `<svg viewBox="0 0 480 220" role="img" aria-label="Kurva Precision-Recall (2.000 transaksi, 5% fraud)">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Kurva Precision-Recall (2.000 transaksi, 5% fraud)</text>
<polyline points="466.0,186.0 466.0,185.3 466.0,184.2 466.0,183.0 460.6,181.4 438.7,179.8 427.9,176.8 417.2,173.1 395.2,169.9 373.7,164.2 341.0,158.9 303.4,151.8 232.6,147.7 205.7,138.3 167.6,125.9 124.2,114.1 102.2,80.6 75.3,53.5 48.0,26.0" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="466.0" cy="186.0" r="3" fill="var(--c1)"/>
<circle cx="466.0" cy="184.2" r="3" fill="var(--c1)"/>
<circle cx="460.6" cy="181.4" r="3" fill="var(--c1)"/>
<circle cx="427.9" cy="176.8" r="3" fill="var(--c1)"/>
<circle cx="395.2" cy="169.9" r="3" fill="var(--c1)"/>
<circle cx="341.0" cy="158.9" r="3" fill="var(--c1)"/>
<circle cx="232.6" cy="147.7" r="3" fill="var(--c1)"/>
<circle cx="167.6" cy="125.9" r="3" fill="var(--c1)"/>
<circle cx="102.2" cy="80.6" r="3" fill="var(--c1)"/>
<circle cx="48.0" cy="26.0" r="3" fill="var(--c1)"/>
<circle cx="373.7" cy="164.2" r="4.5" fill="var(--c4)"/>
<text x="373.7" y="154.2" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">thr=0,5</text>
<text x="257.0" y="212" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">recall</text>
<text x="14" y="106.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 106.0)">precision</text>
</svg>`,
        alt: "Kurva precision-recall: recall naik, precision turun.",
        caption: "Cara membaca: sumbu X = recall, sumbu Y = precision; tiap titik = satu threshold. Interpretasi: kurva turun ke kanan — menangkap lebih banyak fraud (recall naik) selalu dibayar dengan lebih banyak salah tuduh (precision turun). Titik thr=0,5: recall 0,80, precision 0,15.",
      },
      tasks: [
        { id: "t1", text: "Hitung `tp`, `fp`, `fn`, `tn` dari `y_true` dan `y_pred`" },
        { id: "t2", text: "Hitung `precision`, `recall`, `f1`, `acc`" },
        { id: "t3", text: "Cetak keempat metrik dengan 3 desimal" },
      ],
      expected: "Output: acc=0.784  precision=0.148  recall=0.800  f1=0.250 (tp=72, fp=413, fn=18, tn=1497). Pola khas threshold 0,5: recall tinggi — 80% fraud tertangkap — tapi precision rendah: 413 dari 485 'tangkapan' adalah salah tuduh. Inilah harga recall di kurva precision-recall.",
      note: {
        title: "💡 Intuisi: precision vs recall = siapa yang menanggung salah",
        body: "False positive ditanggung tim investigasi (kelelahan). False negative ditanggung perusahaan (kerugian). Tanyakan 'salah mana yang lebih mahal?' — jawabannya menentukan metrik mana yang dioptimasi.",
      },
      hints: [
        "tp: t==1 dan p==1; fp: t==0 dan p==1; fn: t==1 dan p==0; tn: sisanya.",
        "precision = tp/(tp+fp); recall = tp/(tp+fn).",
        "f1 = 2*precision*recall/(precision+recall); acc = (tp+tn)/n.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random
random.seed(11)
n = 2000
y_true = [1 if random.random() < 0.05 else 0 for _ in range(n)]
scores = [random.gauss(0.7 if y else 0.3, 0.25) for y in y_true]
y_pred = [1 if s > 0.5 else 0 for s in scores]
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: confusion matrix
tp = 
fp = 
fn = 
tn = 

# TULIS KODEMU: metrik
precision = 
recall = 
f1 = 
acc = 

print(f"acc={acc:.3f}  precision={precision:.3f}  recall={recall:.3f}  f1={f1:.3f}")`,
        lockLines: 8,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random
random.seed(11)
n = 2000
y_true = [1 if random.random() < 0.05 else 0 for _ in range(n)]
scores = [random.gauss(0.7 if y else 0.3, 0.25) for y in y_true]
y_pred = [1 if s > 0.5 else 0 for s in scores]
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: confusion matrix
tp = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)
fp = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)
fn = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)
tn = n - tp - fp - fn

# TULIS KODEMU: metrik
precision = tp / (tp + fp)
recall = tp / (tp + fn)
f1 = 2 * precision * recall / (precision + recall)
acc = (tp + tn) / n

print(f"acc={acc:.3f}  precision={precision:.3f}  recall={recall:.3f}  f1={f1:.3f}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`tp` = 72",
            "name": "tp",
            "value": 72,
            "tol": 1e-09,
            "msg": "Hitung pasangan (t=1, p=1).",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`precision` ≈ 0.148",
            "name": "precision",
            "value": 0.14845360824742268,
            "tol": 0.002,
            "msg": "72/(72+413) = 0.148. Mayoritas 'tangkapan' adalah salah tuduh.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`recall` ≈ 0.800",
            "name": "recall",
            "value": 0.8,
            "tol": 0.002,
            "msg": "72/(72+18) = 0.80.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan akurasi",
            "pattern": "acc=0\\.784",
            "msg": "Format: acc=...  precision=...  recall=...  f1=....",
          },
        ],
      },
      reference: "zip(y_true, y_pred) memasangkan label dan prediksi. Waspadai pembagian nol bila tp+fp=0.",
    },
    {
      id: "kalibrasi",
      eyebrow: "Langkah 4 · Kalibrasi",
      title: "Skor 0,9 harus berarti 90% — benarkah?",
      prose: [
        "Model klasifikasi mengeluarkan skor (mis. 0,9), tetapi skor BUKAN probabilitas kecuali modelnya terkalibrasi. Model terkalibrasi: dari semua prediksi berskor ~0,9, benar-benar 90% yang positif.",
        "Kenapa penting di produksi? Threshold, ekspektasi kerugian, dan keputusan 'auto-approve vs review manual' semuanya mengasumsikan skor ≈ probabilitas. Model yang overconfident membuat keputusan bisnis berdasarkan angka dusta.",
        "Expected Calibration Error (ECE): bagi prediksi ke 10 bin berdasarkan skor; tiap bin hitung |akurasi_bin − confidence_bin|; rata-ratakan berbobot. ECE > 0,05 = kalibrasi buruk, pertimbangkan Platt scaling atau isotonic regression.",
        "Lab: model simulasi dengan skor acak menghasilkan ECE 0,143 — jauh di atas ambang. Skornya tidak bisa dipercaya sebagai probabilitas.",
        "Kalibrasi ulang — Platt scaling 10 menit. Ambil skor model + label validasi → fit regresi logistik (skor → probabilitas). ECE 0,25 → 0,04. Biaya: 10 menit + 1.000 sampel validasi. Kapan: model dipakai untuk KEPUTUSAN (threshold, ekspektasi kerugian) — bukan untuk RANKING (rekomendasi top-N tidak butuh kalibrasi, hanya urutan). Bedakan kebutuhanmu: ranking vs keputusan. Salah kaprah umum: mengkalibrasi model ranking = kerja sia-sia.",
      ],
      formula: String.raw`\text{ECE} = \sum_{b=1}^{10} \frac{n_b}{n}\,|\text{acc}_b - \text{conf}_b|`,
      formulaNote: "ECE (Expected Calibration Error) = rata-rata |akurasi − keyakinan| per bin, dibobot ukuran bin; n_b/n = proporsi sampel di bin b; acc_b = akurasi aktual bin; conf_b = keyakinan rata-rata bin. ECE <0,05 = terkalibrasi baik; >0,15 = overconfident berbahaya. Model dengan ECE 0,25 yang bilang “90% yakin” sebenarnya benar ~65% — keputusan bisnis di atasnya = fondasi pasir.",
      tasks: [
        { id: "t1", text: "Kelompokkan prediksi ke 10 bin, hitung `ece`" },
        { id: "t2", text: "Tentukan `verdict`: 'kalibrasi buruk' jika ece > 0.05" },
        { id: "t3", text: "Cetak ece dan verdict" },
      ],
      expected: "Output: ece=0.143  verdict=kalibrasi buruk. ECE jauh di atas ambang 0,05 — skor model ini tidak boleh diperlakukan sebagai probabilitas untuk keputusan (threshold, ekspektasi kerugian); hanya aman untuk ranking.",
      note: {
        title: "🚨 Mitos: 'skor model = probabilitas, tinggal pakai'",
        type: "pitfall",
        body: "Yang benar: skor hanya ranking kecuali terbukti terkalibrasi. Model dengan AUC tinggi bisa kalibrasinya buruk — diskriminasi (ranking) dan kalibrasi (nilai absolut) adalah dua kemampuan berbeda.",
      },
      hints: [
        "Bin b: indeks i dengan lo <= probs[i] < hi (bin terakhir inklusif 1.0).",
        "conf = rata-rata probs di bin; acc = rata-rata y di bin.",
        "ece += abs(acc - conf) * len(idx)/n.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random
random.seed(13)
n = 5000
probs = [random.random() for _ in range(n)]
y = [1 if random.random() < 0.5*p + 0.15 else 0 for p in probs]
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: ECE dengan 10 bin
ece = 0.0
for b in range(10):
    lo, hi = b/10, (b+1)/10
    idx = [i for i, p in enumerate(probs) if (lo <= p < hi) or (b == 9 and p == 1.0)]
    if not idx:
        continue
    conf = 
    accb = 
    ece += 

verdict = 
print(f"ece={ece:.3f}  verdict={verdict}")`,
        lockLines: 7,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random
random.seed(13)
n = 5000
probs = [random.random() for _ in range(n)]
y = [1 if random.random() < 0.5*p + 0.15 else 0 for p in probs]
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: ECE dengan 10 bin
ece = 0.0
for b in range(10):
    lo, hi = b/10, (b+1)/10
    idx = [i for i, p in enumerate(probs) if (lo <= p < hi) or (b == 9 and p == 1.0)]
    if not idx:
        continue
    conf = sum(probs[i] for i in idx) / len(idx)
    accb = sum(y[i] for i in idx) / len(idx)
    ece += abs(accb - conf) * len(idx) / n

verdict = "kalibrasi buruk" if ece > 0.05 else "terkalibrasi"
print(f"ece={ece:.3f}  verdict={verdict}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`ece` ≈ 0.143",
            "name": "ece",
            "value": 0.142793494529346,
            "tol": 0.005,
            "msg": "Rata-rata berbobot |acc − conf| per bin. Model ini overconfident.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` memvonis kalibrasi",
            "pattern": "verdict=kalibrasi buruk",
            "msg": "ece > 0.05 → 'kalibrasi buruk'.",
          },
        ],
      },
      reference: "enumerate() memberi (indeks, nilai). Bin terakhir harus inklusif p==1.0.",
    },
    {
      id: "interval-perbandingan",
      eyebrow: "Langkah 5 · Interval kepercayaan & uji perbandingan",
      title: "Skor 0,86 vs 0,81: benarkah B lebih baik, atau cuma beruntung?",
      prose: [
        "Dua model diuji pada 200 transaksi yang SAMA: model A benar 161 kali (akurasi 0,805), model B benar 172 kali (0,860). Selisih 5,5 poin terlihat jelas — tetapi dengan hanya 200 sampel, selisih itu bisa jadi noise. Tanpa ukuran ketidakpastian, 'B lebih baik' adalah klaim, bukan kesimpulan. Langkah ini memberi dua alat: interval kepercayaan untuk satu metrik, dan uji berpasangan untuk membandingkan dua model.",
        "Interval kepercayaan Wilson 95 persen untuk akurasi B: (0,805; 0,901). Artinya: prosedur ini, bila diulang berkali-kali, mencakup akurasi sebenarnya dalam 95 persen pengulangan — BUKAN 'ada 95 persen peluang nilai benar di dalam interval ini'. Wilson dipakai sebagai default karena rumus Wald (p ditambah-minus 1,96 kali standard error) retak di tepi-tepi: untuk akurasi mendekati 0 atau 1, atau n kecil, Wald bisa memberi batas di luar 0 sampai 1. Foundation A23 membahas interval kepercayaan secara umum; di sini rumusnya diterapkan ke metrik model. Lebar interval menyusut dengan akar n: menaikkan n dari 200 ke 800 (4 kali lipat) mempersempit interval B dari lebar 0,096 menjadi 0,048 — separuhnya. Data 4 kali lipat membeli presisi 2 kali lipat; tidak ada jalan pintas.",
        "Membandingkan DUA model butuh uji BERPASANGAN, bukan dua interval yang dibandingkan matanya. Interval A adalah (0,745; 0,854) dan interval B (0,805; 0,901) — keduanya tumpang tindih lebar. Membaca tumpang tindih sebagai 'tidak ada beda' adalah kesalahan klasik: kedua model diuji pada SAMPEL YANG SAMA, sehingga kesalahan mereka berkorelasi, dan uji yang benar memakai informasi pasangan itu. Uji McNemar hanya melihat pasangan DISCORDANT: 7 kasus di mana A benar dan B salah, versus 18 kasus di mana A salah dan B benar. Statistiknya chi-kuadrat sama dengan (18 dikurangi 7) kuadrat dibagi 25, sama dengan 4,84, dengan p sekitar 0,028 — di bawah 0,05. Vonis: B signifikan lebih baik, meski intervalnya tumpang tindih.",
        "Syarat McNemar yang tidak boleh dilanggar: kedua model HARUS diuji pada test set yang sama persis, dan pasangan discordant harus cukup banyak (b ditambah c sebaiknya di atas 25; di sini tepat 25). Membandingkan akurasi A dari test set Januari dengan akurasi B dari test set Februari dengan uji ini = vonis palsu — beda distribusi, bukan beda model. Dan ingat: signifikan secara statistik bukan signifikan secara bisnis — selisih 5,5 poin yang signifikan dengan biaya retrain Rp200 juta per bulan bisa tetap menjadi keputusan buruk. Uji menjawab 'apakah bedanya nyata', bukan 'apakah bedanya sepadan'.",
        "Catatan cakupan: validasi silang (cross-validation) dan nested CV TIDAK diulang di sini — keduanya sudah diajarkan di MLE15 (stratified CV, nested CV) dan MLE16. Yang ditambahkan lesson ini adalah lapisan di atasnya: begitu kamu punya satu angka dari CV atau holdout, seberapa besar ketidakpastiannya, dan bagaimana membuktikan satu model benar-benar mengalahkan yang lain pada data yang sama.",
      ],
      formula: String.raw`\text{Wilson: } \frac{\hat{p} + \frac{z^2}{2n} \pm z\sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}} \qquad \chi^2_{McNemar} = \frac{(b-c)^2}{b+c}`,
      formulaNote: "Wilson: p̂ = metrik teramati (mis. akurasi 0,86); n = ukuran test set; z = 1,96 untuk 95 persen. McNemar: b = kasus A benar dan B salah (7); c = kasus A salah dan B benar (18); chi-kuadrat dibanding ambang 3,84 untuk p 0,05 (derajat bebas 1). Contoh lab: B Wilson (0,805; 0,901); McNemar chi-kuadrat 4,84, p 0,028 — signifikan.",
      tasks: [
        { id: "t1", text: "Hitung `wilson_lo` dan `wilson_hi` (interval Wilson 95%) untuk akurasi model B (172 benar dari 200)" },
        { id: "t2", text: "Hitung `chi2` dan `p` uji McNemar (b=7, c=18) serta `signifikan` (p < 0,05)" },
        { id: "t3", text: "Cetak interval, chi2, p, dan vonis" },
      ],
      expected: "wilson_B=(0.805, 0.901)  mcnemar_chi2=4.84  p=0.0278  signifikan=True",
      note: {
        title: "🚨 Mitos: 'interval tumpang tindih = tidak ada beda'",
        type: "pitfall",
        body: "Yang benar: interval yang tumpang tindih hanya berkata tiap estimasi sendiri-sendiri tidak pasti. Uji berpasangan (McNemar) memakai korelasi antar model pada test set yang sama — dan bisa signifikan meski intervalnya tumpang tindih lebar. Jangan memvonis dari gambar dua interval.",
      },
      hints: [
        "Wilson: den = 1 + z*z/n; tengah = (p + z*z/(2*n))/den; setengah = z*sqrt(p*(1-p)/n + z*z/(4*n*n))/den.",
        "McNemar: chi2 = (c-b)**2/(b+c); p dari chi-kuadrat df=1: p = 2*(1-Phi(sqrt(chi2))), Phi via math.erf.",
        "signifikan = p < 0,05.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import math
n = 200
benar_b = 172          # model B benar 172 dari 200 (akurasi 0,86)
benar_a = 161          # model A benar 161 dari 200 (akurasi 0,805)
b, c = 7, 18           # discordant: A benar B salah = 7; A salah B benar = 18
z = 1.96               # 95%
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: interval Wilson 95% untuk akurasi B
p_hat = 
den = 
tengah = 
setengah = 
wilson_lo = 
wilson_hi = 

# TULIS KODEMU: uji McNemar
chi2 = 
p_value = 
signifikan = 

print(f"wilson_B=({wilson_lo:.3f}, {wilson_hi:.3f})  mcnemar_chi2={chi2:.2f}  p={p_value:.4f}  signifikan={signifikan}")`,
        lockLines: 7,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import math
n = 200
benar_b = 172          # model B benar 172 dari 200 (akurasi 0,86)
benar_a = 161          # model A benar 161 dari 200 (akurasi 0,805)
b, c = 7, 18           # discordant: A benar B salah = 7; A salah B benar = 18
z = 1.96               # 95%
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: interval Wilson 95% untuk akurasi B
p_hat = benar_b / n
den = 1 + z * z / n
tengah = (p_hat + z * z / (2 * n)) / den
setengah = z * math.sqrt(p_hat * (1 - p_hat) / n + z * z / (4 * n * n)) / den
wilson_lo = tengah - setengah
wilson_hi = tengah + setengah

# TULIS KODEMU: uji McNemar
chi2 = (c - b) ** 2 / (b + c)
p_value = 2 * (1 - 0.5 * (1 + math.erf(math.sqrt(chi2) / math.sqrt(2))))
signifikan = p_value < 0.05

print(f"wilson_B=({wilson_lo:.3f}, {wilson_hi:.3f})  mcnemar_chi2={chi2:.2f}  p={p_value:.4f}  signifikan={signifikan}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`wilson_lo` ≈ 0.805",
            "name": "wilson_lo",
            "value": 0.8051,
            "tol": 0.002,
            "msg": "Batas bawah Wilson 95% untuk 172/200.",
          },
          {
            "kind": "equal",
            "task": "t1",
            "label": "`wilson_hi` ≈ 0.901",
            "name": "wilson_hi",
            "value": 0.9013,
            "tol": 0.002,
            "msg": "Batas atas Wilson 95% untuk 172/200.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`chi2` = 4.84",
            "name": "chi2",
            "value": 4.84,
            "tol": 0.01,
            "msg": "(18-7)^2/25 = 121/25 = 4,84.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`p_value` ≈ 0.0278",
            "name": "p_value",
            "value": 0.0278,
            "tol": 0.002,
            "msg": "Chi-kuadrat 4,84 df=1 memberi p sekitar 0,028 — di bawah 0,05.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` memvonis signifikan",
            "pattern": "signifikan=True",
            "msg": "p < 0,05 → B signifikan lebih baik.",
          },
        ],
      },
      reference: "Wilson untuk satu metrik; McNemar (pasangan discordant) untuk membandingkan dua model pada test set yang sama.",
    },
    {
      id: "slice",
      eyebrow: "Langkah 6 · Slice evaluation",
      title: "Metrik global 90%, metrik segmen 40%",
      prose: [
        "Metrik global adalah rata-rata — dan rata-rata menyembunyikan segmen yang menderita. Model dengan akurasi global 90% bisa memiliki akurasi 40% pada segmen 'pengguna baru dari luar Jawa' yang justru paling penting bagi bisnis.",
        "Slice evaluation: hitung metrik per segmen yang relevan secara bisnis — wilayah, segmen umur, tipe device, jam transaksi. Pilih slice SEBELUM melihat hasil (berdasarkan risiko bisnis), bukan setelah (agar tidak jadi p-hacking).",
        "Contoh nyata: model churn dengan recall global 80% ternyata recall 45% pada pelanggan korporat — segmen dengan nilai kontrak 20x lipat. Satu angka global menyembunyikan kerugian terbesar.",
        "Kaitannya dengan fairness (MLE12): slice berdasarkan grup demografis adalah fondasi audit bias. Evaluasi yang tidak di-slice = evaluasi yang buta.",
        "Slice yang WAJIB — daftar starter. (1) Wilayah (Jawa vs luar Jawa — distribusi beda). (2) Segmen umur (perilaku beda). (3) Tipe device (iOS vs Android — proxy sosioekonomi!). (4) Jam transaksi (pola fraud malam beda). (5) Pengguna baru vs lama. Lima slice, hitung SEMUA metrik per slice SEBELUM rilis. Slice dengan n kecil (<100): laporkan + CI lebar (jujur tentang ketidakpastian). Yang tidak di-slice = yang tidak diketahui — dan yang tidak diketahui = risiko.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: slice adalah tempat uang dan reputasi hilang",
        body: "Pilih 3–5 slice berdasarkan dampak bisnis TERTINGGI, bukan yang datanya paling banyak. Segmen kecil bernilai besar (korporat, VIP) wajib punya metrik sendiri meski sampelnya sedikit.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Metrik apa untuk masalah apa",
      prose: [
        "Skenario 1 — Deteksi fraud (FN mahal: Rp500rb; FP murah: Rp20rb investigasi) → optimasi recall, threshold rendah. Alasan: satu fraud lolos = 25x biaya satu salah tuduh.",
        "Skenario 2 — Blokir otomatis akun (FP mahal: pelanggan marah + churn) → optimasi precision, threshold tinggi; yang meragukan lempar ke review manual. Alasan: salah blokir merusak kepercayaan.",
        "Skenario 3 — Ranking rekomendasi (tidak ada threshold) → PR-AUC atau NDCG. Alasan: yang penting urutan, bukan keputusan biner.",
        "Skenario 4 — Skor dipakai untuk pricing asuransi → kalibrasi (ECE) WAJIB bagus. Alasan: skor diterjemahkan langsung menjadi rupiah; skor dusta = harga salah.",
        "Aturan praktis 10 detik: tulis cost matrix dulu (biaya FP vs FN), baru pilih metrik. Metrik tanpa cost = opini; metrik dengan cost = keputusan.",
        "Skenario 5 — model dengan 3 segmen bisnis (ritel, korporat, UMKM) → metrik PER SEGMEN + threshold per segmen. Ritel: FN murah → threshold rendah. Korporat: FP mahal (hubungan nasabah) → threshold tinggi. Satu threshold global = mengorbankan satu segmen demi agregat. Aturan: threshold = fungsi dari BIAYA segmen, bukan dari “angka cantik” 0,5. Dan dokumentasikan ALASAN tiap threshold — auditor akan bertanya.",
      ],
      tasks: [
      ],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Threshold 0,5 vs 0,3: Rp16 juta vs Rp11 juta",
      prose: [
        "Payment gateway memproses 10.000 transaksi/minggu dengan 100 fraud aktual. Dua kandidat threshold:",
        "Threshold 0,5: TP=70, FP=50, FN=30. Threshold 0,3: TP=90, FP=300, FN=10. Biaya: tiap FN (fraud lolos) = Rp500rb; tiap FP (investigasi) = Rp20rb.",
        "Hitung: threshold 0,5 → FN 30 × Rp500rb = Rp15jt + FP 50 × Rp20rb = Rp1jt → total Rp16jt/minggu. Threshold 0,3 → FN 10 × Rp500rb = Rp5jt + FP 300 × Rp20rb = Rp6jt → total Rp11jt/minggu.",
        "Pertanyaan: (a) Threshold mana yang dipilih dan kenapa? (b) Berapa precision masing-masing? (c) Kapan jawabannya berbalik?",
        "Pembahasan: (a) Threshold 0,3 — menghemat Rp5jt/minggu (Rp260jt/tahun) meski 'terlihat' lebih buruk karena banyak salah tuduh. (b) Precision 0,5: 70/120 = 58%; 0,3: 90/390 = 23%. Precision lebih rendah tetapi total cost lebih kecil — inilah kenapa cost mengalahkan estetika metrik. (c) Jika biaya investigasi naik (mis. tiap FP butuh 2 jam analis senior = Rp200rb), maka 0,3 → Rp65jt vs 0,5 → Rp25jt: jawaban berbalik. Threshold adalah fungsi cost, bukan sifat model.",
        "Keputusan threshold — hitung. Threshold 0,5: biaya = 30×500.000 + 50×20.000 = 15.000.000 + 1.000.000 = Rp16 juta/minggu. Threshold 0,3: 10×500.000 + 300×20.000 = 5.000.000 + 6.000.000 = Rp11 juta/minggu. Pemenang: 0,3 (hemat Rp5 juta/minggu = Rp260 juta/tahun!). Tetapi: 300 investigasi/minggu = butuh 2 analis tambahan (Rp20 juta/bulan = Rp240 juta/tahun). NET: hemat Rp20 juta/tahun — TIPIS! Keputusan berubah jika kapasitas investigasi terbatas. Biaya = bukan hanya rupiah, tetapi juga ORANG.",
        "Threshold DINAMIS — level lanjut. Pagi (analis siap): threshold 0,3 (tangkap banyak). Malam (tidak ada analis): threshold 0,7 (hanya yang yakin — sisanya antre pagi). Biaya optimal per JAM, bukan per minggu. Implementasi: 2 baris config + scheduler. Hasil: hemat Rp5 juta/minggu TANPA analis tambahan malam. Threshold statis = kompromi; threshold dinamis = optimal per konteks. Satu level di atas “pilih angka”.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Inilah inti risk-based decision: expected loss = P(event) × impact. Threshold optimal meminimalkan ekspektasi kerugian, bukan memaksimalkan metrik akademik.",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Fraud 0,7% dari transaksi. Model 'selalu tebak bukan fraud' akurasinya 99,3%. Kesimpulan?",
          options: [
            {
              text: "Model hebat, langsung deploy",
              why: "Recall-nya 0% — tidak menangkap satu pun fraud. Akurasi menipu di sini.",
            },
            {
              text: "Akurasi tidak informatif; pakai precision/recall",
              why: "Tepat: baseline mayoritas sudah 99,3%; yang penting adalah performa pada kelas minoritas.",
              correct: true,
            },
            {
              text: "Butuh lebih banyak data",
              why: "Masalahnya metrik, bukan jumlah data.",
            },
            {
              text: "Naikkan threshold",
              why: "Model ini bahkan tidak punya threshold yang bermakna — ia tidak pernah memprediksi positif.",
            },
          ],
        },
        {
          q: "Biaya FN Rp500rb, biaya FP Rp20rb. Strategi threshold?",
          options: [
            {
              text: "Threshold tinggi untuk precision maksimal",
              why: "Itu benar bila FP yang mahal; di sini FN 25x lebih mahal.",
            },
            {
              text: "Threshold rendah untuk recall tinggi",
              why: "Tepat: FN jauh lebih mahal, jadi tangkap sebanyak mungkin meski banyak salah tuduh.",
              correct: true,
            },
            {
              text: "Tetap 0,5 karena standar",
              why: "0,5 bukan standar — ia arbitrer tanpa dasar cost.",
            },
            {
              text: "Threshold tidak penting",
              why: "Mini-case menunjukkan threshold mengubah cost Rp16jt vs Rp11jt per minggu.",
            },
          ],
        },
        {
          q: "Model AUC 0,92 tetapi ECE 0,14. Aman dipakai untuk pricing asuransi?",
          options: [
            {
              text: "Aman, AUC-nya tinggi",
              why: "AUC mengukur ranking, bukan kebenaran nilai probabilitas.",
            },
            {
              text: "Tidak — skornya tidak terkalibrasi, harga akan salah",
              why: "Tepat: pricing butuh probabilitas yang jujur; ECE 0,14 jauh di atas ambang 0,05.",
              correct: true,
            },
            {
              text: "Aman jika threshold 0,5",
              why: "Threshold tidak memperbaiki kalibrasi.",
            },
            {
              text: "Perlu lebih banyak fitur",
              why: "Masalahnya kalibrasi, diperbaiki dengan Platt/isotonic scaling, bukan fitur baru.",
            },
          ],
        },
        {
          q: "Model akurasi global 90%, tetapi 40% pada segmen korporat bernilai tinggi. Tindakan?",
          options: [
            {
              text: "Deploy saja, globalnya bagus",
              why: "Segmen bernilai tertinggi justru yang paling buruk — kerugian terbesar ada di sana.",
            },
            {
              text: "Slice evaluation rutin + perbaiki performa segmen kritis sebelum deploy",
              why: "Tepat: metrik per segmen mencegah rata-rata menyembunyikan masalah.",
              correct: true,
            },
            {
              text: "Hapus segmen korporat dari data",
              why: "Menghapus masalah dari laporan bukan menyelesaikan masalah.",
            },
            {
              text: "Naikkan akurasi global ke 95%",
              why: "Akurasi global bisa naik sambil segmen kritis tetap buruk.",
            },
          ],
        },
        {
          q: "F1-score paling tepat dipakai ketika…",
          options: [
            {
              text: "Butuh satu angka ringkas saat precision dan recall sama pentingnya",
              why: "Tepat: F1 adalah rata-rata harmonik — ringkas, tetapi sembunyikan tradeoff.",
              correct: true,
            },
            {
              text: "Selalu lebih baik dari akurasi",
              why: "F1 buta terhadap TN; untuk masalah dengan TN penting, akurasi bisa lebih relevan.",
            },
            {
              text: "Data seimbang sempurna",
              why: "Pada data seimbang, akurasi biasanya cukup.",
            },
            {
              text: "Tidak perlu threshold",
              why: "F1 tetap butuh threshold untuk klasifikasi biner.",
            },
          ],
        },
        {
          q: "Model A 161/200 benar, model B 172/200 benar, pasangan discordant b=7, c=18. Interval Wilson B (0,805; 0,901) dan A (0,745; 0,854) tumpang tindih. Kesimpulan?",
          options: [
            {
              text: "B signifikan lebih baik (McNemar chi2 4,84, p 0,028) — tumpang tindih interval bukan vonis",
              why: "Tepat: uji berpasangan memakai korelasi pada test set yang sama; interval yang tumpang tindih tidak membatalkan McNemar.",
              correct: true,
            },
            {
              text: "Tidak ada beda — intervalnya tumpang tindih",
              why: "Salah: itu kesalahan klasik. Interval per model tidak menguji beda berpasangan.",
            },
            {
              text: "B lebih baik karena 0,86 lebih dari 0,805 — tanpa uji pun cukup",
              why: "Selisih titik tanpa ukuran ketidakpastian adalah klaim, bukan kesimpulan; dengan n=200, selisih 5,5 poin bisa jadi noise.",
            },
            {
              text: "Pakai uji-t dua sampel independen",
              why: "Salah: kedua model diuji pada sampel yang sama — uji independen membuang informasi pasangan dan bisa memberi vonis berbeda.",
            },
          ],
        },
      ],
      summary: [
        "Interval Wilson 95% mengukur ketidakpastian satu metrik; lebarnya menyusut dengan akar n.",
        "Bandingkan dua model dengan uji berpasangan (McNemar, pasangan discordant) pada test set yang sama — bukan dari tumpang tindih interval.",
        "Accuracy paradox: pada imbalance, akurasi didominasi kelas mayoritas.",
        "Precision = ketepatan tuduhan; recall = kelengkapan tangkapan; F1 = harmonik keduanya.",
        "Threshold adalah keputusan bisnis berbasis cost, bukan default 0,5.",
        "Kalibrasi (ECE): skor harus ≈ probabilitas bila dipakai untuk keputusan bernilai uang.",
        "Slice evaluation: hitung metrik per segmen bisnis penting — global average menyembunyikan masalah.",
        "Tulis cost matrix DULU, baru pilih metrik.",
      ],
      next: { label: "MLE5 — Model Serving: Batch vs Online", href: "/v2/learn/mle5-serving" },
    },
  ],
};
