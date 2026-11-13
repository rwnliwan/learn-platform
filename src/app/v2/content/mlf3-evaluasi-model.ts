import type { V2Lesson } from "../lib/types";

export const mlf3: V2Lesson = {
  slug: "mlf3-evaluasi-model",
  track: "Machine Learning Finance",
  module: "Foundations — ML end-to-end in finance",
  title: "MLF3 — Evaluasi Model: Metrik yang Jujur",
  estMinutes: 60,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Akurasi adalah metrik yang paling sering dikutip dan paling sering menipu. Lesson ini melengkapimu dengan metrik yang jujur: precision, recall, F1, ROC-AUC, PR-AUC, Brier, dan cross-validation — semuanya dibaca dengan angka notebook credit scoring.",
        "Tujuan lesson ini:",
        "• Menjelaskan accuracy paradox pada data imbalance dengan angka konkret.",
        "• Menghitung precision, recall, F1 dari confusion matrix dari nol.",
        "• Membaca ROC-AUC dengan band acuannya dan PR-AUC relatif terhadap base rate.",
        "• Mengukur kalibrasi dengan Brier score dan memilih threshold berdasarkan biaya.",
        "• Memakai cross-validation agar satu split tidak menipu.",
        "Isi lesson: cerita model 99 persen akurat yang buta → confusion matrix → ROC-AUC → PR-AUC → kalibrasi → cross-validation → 2 lab → peta keputusan → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan: test set 6.000 nasabah, 1.327 default (base rate 0,2212); LR ROC-AUC 0,7426 dan PR-AUC 0,5049; GBM ROC-AUC 0,7823 dan PR-AUC 0,5597; Brier LR 0,1427 vs GBM 0,1342; threshold operasional 0,10.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Model 77,88 persen akurat yang tidak menangkap satu pun default",
      prose: [
        "Sebuah bank membanggakan model credit scoring dengan akurasi 77,88 persen. Direksi puas. Tiga bulan kemudian, kerugian kredit naik — dan seseorang memeriksa: model itu memprediksi tidak default untuk semua orang. Akurasinya 4.673 dibagi 6.000, yaitu 0,7788 — persis porsi nasabah lancar. Recall-nya: 0 persen. Tidak satu pun dari 1.327 nasabah default tertangkap.",
        "Inilah accuracy paradox: pada data imbalance, akurasi didominasi kelas mayoritas dan tidak memberi tahu apa-apa tentang kemampuan model pada kelas yang penting. Gambar di bawah membandingkan dua bar: model selalu-tidak-default dengan akurasi 77,88 persen dan recall 0 persen, melawan GBM pada threshold 0,5 dengan akurasi 82,88 persen dan recall 52,75 persen. Akurasinya hanya beda 5 poin — recall-nya beda 52,75 poin. Metrik yang jujur adalah yang menunjukkan perbedaan itu.",
        "Pelajaran lesson ini: metrik evaluasi harus selaras dengan biaya kesalahan bisnis. Salah melepas nasabah default (false negative) biayanya puluhan juta; salah menolak nasabah bagus (false positive) biayanya margin yang hilang. Akurasi memperlakukan keduanya sama — bisnis tidak.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Dua bar akurasi: model selalu-tidak-default 77,88% recall 0; GBM 82,88% recall 52,75%">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Akurasi menipu: 77,88% tanpa menangkap satu pun default</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="155.5" y1="206" x2="155.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="155.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Selalu 'tidak default'</text>
<line x1="362.5" y1="206" x2="362.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="362.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GBM (thr 0,5)</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">50%</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">100%</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">model</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">akurasi</text>
<rect x="103.8" y="68.9" width="103.5" height="137.1" fill="var(--c1)"/>
<text x="155.5" y="62.9" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">acc 77.88%</text>
<text x="155.5" y="198.0" text-anchor="middle" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">recall 0.00%</text>
<rect x="310.8" y="60.1" width="103.5" height="145.9" fill="var(--c1)"/>
<text x="362.5" y="54.1" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">acc 82.88%</text>
<text x="362.5" y="198.0" text-anchor="middle" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">recall 52.75%</text>
</svg>`,
        alt: "Dua bar akurasi: model selalu-tidak-default 77,88% recall 0; GBM 82,88% recall 52,75%.",
        caption: "Cara membaca: tinggi bar = akurasi; label merah = recall. Interpretasi: akurasi kedua model hanya beda 5 poin, tapi recall beda 52,75 poin — akurasi menyembunyikan kebutaan model pertama.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: akurasi tinggi berarti model hebat",
        type: "pitfall",
        body: "Yang benar: bandingkan dengan baseline mayoritas. Jika 77,88 persen datamu kelas lancar, model selalu tebak lancar juga 77,88 persen akurat. Metrik yang jujur untuk imbalance: precision, recall, F1, atau PR-AUC — bukan akurasi.",
      },
    },
    {
      id: "confusion",
      eyebrow: "Langkah 3 · Precision, recall, F1",
      title: "Confusion matrix: empat kotak yang bercerita",
      prose: [
        "Confusion matrix membagi prediksi menjadi empat: TP (benar menangkap default), FP (salah tuduh nasabah bagus), FN (default lolos), TN (benar melepas nasabah lancar). Dari sini: precision = TP dibagi (TP + FP) — dari yang ditangkap, berapa yang benar-benar default. Recall = TP dibagi (TP + FN) — dari semua default, berapa yang tertangkap.",
        "Nilai: pada 6.000 nasabah dengan threshold 0,5 — TP 700, FP 400, FN 627, TN 4.273. Precision = 700 dibagi 1.100 = 0,6364. Recall = 700 dibagi 1.327 = 0,5275. F1 = 2 × 0,6364 × 0,5275 dibagi (0,6364 + 0,5275) = 0,5768. Pada threshold 0,10 — TP 1.080, FP 1.420, FN 247, TN 3.253 — precision turun ke 1.080 dibagi 2.500 = 0,4320, recall naik ke 1.080 dibagi 1.327 = 0,8139, F1 = 0,5644. Akurasi turun dari 0,8288 ke 0,7222 — tapi recall naik 28,64 poin. Itulah tradeoff-nya.",
        "Dari skor ke keputusan [mini-case]: model mengeluarkan skor, skor dikalibrasi menjadi probabilitas, probabilitas dibandingkan dengan threshold, dan threshold menghasilkan keputusan approve, review, atau reject. Tabelnya dari confusion matrix di atas: threshold 0,5 — disetujui 4.900 nasabah (TN 4.273 + FN 627), approval rate 4.900 dibagi 6.000 = 81,7 persen; ditolak 1.100 (TP 700 + FP 400), 18,3 persen. Threshold 0,10 — disetujui 3.500 (TN 3.253 + FN 247), approval rate 58,3 persen; ditolak 2.500 (TP 1.080 + FP 1.420), 41,7 persen. Menurunkan threshold menolak 1.400 nasabah tambahan — dan di situlah kebijakan masuk: threshold bukan angka 'benar' universal; ia pilihan risk appetite yang dituangkan dalam policy rule (skor di bawah threshold ditolak, di atasnya disetujui, di antaranya masuk review manual). Model tidak otomatis menghasilkan keputusan.",
        "Gambar di bawah menunjukkan tradeoff itu: saat threshold turun dari 0,5 ke 0,10, garis precision turun dari 0,64 ke 0,43 sementara garis recall naik dari 0,53 ke 0,81. Tidak ada threshold yang memaksimalkan keduanya — pilihannya adalah keputusan bisnis, bukan keputusan statistik.",
        "Baik atau buruk: precision 0,6364 baik bila salah tuduh mahal — misal penolakan merusak hubungan nasabah. Recall 0,5275 buruk bila default yang lolos mahal — separuh default tidak tertangkap. Tidak ada pasangan precision-recall yang baik secara absolut; yang baik adalah pasangan yang cocok dengan biaya FN vs FP bisnismu.",
        "Mitigasi: jangan pilih threshold 0,5 karena default. Hitung biaya: di lab lesson ini, FN seharga NT$45.000 (LGD 45 persen × limit 100.000) dan FP seharga NT$5.000 (margin hilang). Threshold 0,10 menghemat biaya 39,7 persen [mini-case] dibanding 0,5 — perhitungannya ada di lab pertama.",
      ],
      formula: String.raw`\text{precision} = \frac{TP}{TP+FP} \qquad \text{recall} = \frac{TP}{TP+FN} \qquad F_1 = \frac{2PR}{P+R}`,
      formulaNote: "Precision mengukur ketepatan tuduhan; recall mengukur kelengkapan penangkapan; F1 adalah rata-rata harmonik keduanya. Ketiganya 0 sampai 1.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Dua garis: precision 0,64 ke 0,43 dan recall 0,53 ke 0,81 saat threshold 0,5 ke 0,10">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tradeoff threshold: precision turun, recall naik</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="134.8" y1="206" x2="134.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="134.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<line x1="217.6" y1="206" x2="217.6" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="217.6" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,20</text>
<line x1="300.4" y1="206" x2="300.4" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="300.4" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,30</text>
<line x1="383.2" y1="206" x2="383.2" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="383.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,40</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">threshold</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">skor</text>
<polyline points="466.0,94.0 134.8,130.0" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="466.0" cy="94.0" r="4" fill="var(--c1)"/>
<circle cx="134.8" cy="130.0" r="4" fill="var(--c1)"/>
<polyline points="466.0,113.2 134.8,62.8" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<circle cx="466.0" cy="113.2" r="4" fill="var(--c4)"/>
<circle cx="134.8" cy="62.8" r="4" fill="var(--c4)"/>
<text x="140.8" y="122.0" font-size="10" fill="var(--c1)" font-family="var(--font-ui)" font-weight="600">precision 0,43</text>
<text x="140.8" y="76.8" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">recall 0,81</text>
<text x="460.0" y="86.0" text-anchor="end" font-size="10" fill="var(--c1)" font-family="var(--font-ui)" font-weight="600">precision 0,64</text>
<text x="460.0" y="127.2" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">recall 0,53</text>
</svg>`,
        alt: "Dua garis: precision 0,64 ke 0,43 dan recall 0,53 ke 0,81 saat threshold 0,5 ke 0,10.",
        caption: "Cara membaca: sumbu X = threshold, sumbu Y = skor. Interpretasi: menurunkan threshold menaikkan recall dan menurunkan precision — tradeoff yang tidak bisa dihindari, hanya bisa dipilih.",
      },
      tasks: [],
      note: {
        title: "Ringkas dari MLE4: precision, recall, F1",
        body: "Konsep ini sudah diajarkan mendalam di MLE4. Di sini cukup ingat: precision = ketepatan tuduhan, recall = kelengkapan penangkapan, F1 = ringkasan keduanya. Fokus baru lesson ini: ROC-AUC bands, PR-AUC vs base rate, Brier, dan cross-validation.",
      },
    },
    {
      id: "roc",
      eyebrow: "Langkah 4 · ROC-AUC",
      title: "ROC-AUC: seberapa baik model mengurutkan",
      prose: [
        "Kurva ROC memplot true positive rate melawan false positive rate di semua threshold. ROC-AUC adalah luas di bawah kurva itu — peluang model memberi skor lebih tinggi ke satu contoh positif acak dibanding satu contoh negatif acak. Kelebihannya: tidak tergantung satu threshold.",
        "Nilai: pada test set notebook, Logistic Regression ROC-AUC 0,7426 dan Gradient Boosting 0,7823. Band acuannya: 0,5 sama dengan tebak acak; 0,7 sampai 0,8 lumayan; 0,8 sampai 0,9 bagus; di atas 0,9 curigai leakage atau target yang bocor ke fitur. Menurut band generik, GBM 0,7823 berarti lumayan — selisih 0,0177 di bawah ambang bagus 0,8. Pada lab kedua lesson ini, 10 skor contoh memberi ROC-AUC 0,8333 — bagus untuk contoh kecil itu.",
        "Dua peringatan sebelum memakai band di atas. Pertama, band ini heuristik untuk konteks ini — bukan standar universal: kualitas AUC yang 'cukup' bergantung pada use case, horizon, biaya keputusan, populasi, dan stabilitasnya. Band yang sama bisa berarti 'siap pakai' di satu bank dan 'belum cukup' di bank lain. Kedua, ROC-AUC mengukur ranking — seberapa baik model mengurutkan — bukan kualitas probabilitas. Model bisa punya ROC-AUC tinggi tetapi probabilitasnya tidak terkalibrasi: urutannya benar, angkanya tidak bisa dipercaya untuk expected loss. Untuk probabilitas, ukurannya Brier dan reliability diagram di langkah 6.",
        "Gambar di bawah menunjukkan kurva ROC dari 10 skor lab: kurva naik cepat di kiri — model menangkap separuh positif sebelum false positive rate melewati 0,17 — lalu mendatar. Luas di bawahnya 0,8333, jauh di atas diagonal acak 0,5.",
        "Baik atau buruk: untuk credit scoring dengan fitur standar, angka ini dapat diterima — cukup untuk dipakai dengan threshold yang tepat. ROC-AUC 0,5 buruk: model tidak lebih baik dari koin. ROC-AUC di atas 0,9 patut dicurigai: periksa apakah ada fitur yang mengandung informasi masa depan (leakage).",
        "Mitigasi: bila ROC-AUC rendah, tambah fitur yang bermakna bisnis atau coba model yang lebih fleksibel — LR 0,7426 ke GBM 0,7823 adalah contohnya. Bila ROC-AUC mencurigakan tingginya, audit fitur satu per satu: apakah ada yang baru diketahui setelah kejadian default?",
      ],
      formula: String.raw`\text{ROC-AUC} = P(\text{skor}^+ > \text{skor}^-)`,
      formulaNote: "ROC-AUC = peluang skor satu contoh positif acak lebih tinggi dari skor satu contoh negatif acak. Dihitung dari nol dengan metode Mann-Whitney di lab kedua.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Kurva ROC di atas diagonal acak; AUC 0,8333">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Kurva ROC: model 10 skor (AUC 0,8333)</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="155.5" y1="206" x2="155.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="155.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="259.0" y1="206" x2="259.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="362.5" y1="206" x2="362.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="362.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">false positive rate</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">true positive rate (recall)</text>
<line x1="52.0" y1="206.0" x2="466.0" y2="30.0" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4,3"/>
<polyline points="52.0,206.0 52.0,162.0 52.0,118.0 121.0,118.0 121.0,74.0 190.0,74.0 259.0,74.0 259.0,30.0 328.0,30.0 397.0,30.0 466.0,30.0" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="52.0" cy="206.0" r="3" fill="var(--c1)"/>
<circle cx="52.0" cy="162.0" r="3" fill="var(--c1)"/>
<circle cx="52.0" cy="118.0" r="3" fill="var(--c1)"/>
<circle cx="121.0" cy="118.0" r="3" fill="var(--c1)"/>
<circle cx="121.0" cy="74.0" r="3" fill="var(--c1)"/>
<circle cx="190.0" cy="74.0" r="3" fill="var(--c1)"/>
<circle cx="259.0" cy="74.0" r="3" fill="var(--c1)"/>
<circle cx="259.0" cy="30.0" r="3" fill="var(--c1)"/>
<circle cx="328.0" cy="30.0" r="3" fill="var(--c1)"/>
<circle cx="397.0" cy="30.0" r="3" fill="var(--c1)"/>
<circle cx="466.0" cy="30.0" r="3" fill="var(--c1)"/>
<text x="279.7" y="156.7" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">AUC = 0,8333</text>
<text x="308.7" y="174.3" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">diagonal = tebak acak (AUC 0,5)</text>
</svg>`,
        alt: "Kurva ROC di atas diagonal acak; AUC 0,8333.",
        caption: "Cara membaca: sumbu X = false positive rate, sumbu Y = true positive rate; tiap titik = satu threshold. Interpretasi: kurva jauh di atas diagonal — AUC 0,8333 berarti model mengurutkan dengan baik.",
      },
      tasks: [],
      note: {
        title: "Tip: ROC-AUC bagus belum tentu cukup",
        body: "ROC-AUC mengukur ranking di semua threshold — tapi bisnis hanya memakai satu threshold. Model dengan ROC-AUC tinggi tetap bisa buruk pada threshold yang dipakai. Selalu periksa juga precision dan recall pada threshold operasionalmu.",
      },
    },
    {
      id: "prauc",
      eyebrow: "Langkah 5 · PR-AUC",
      title: "PR-AUC: dibaca relatif terhadap base rate",
      prose: [
        "Kurva precision-recall memplot precision melawan recall di semua threshold. PR-AUC adalah luas di bawahnya. Bedanya dengan ROC-AUC: PR-AUC sensitif terhadap imbalance — dan baseline-nya bukan 0,5, melainkan base rate.",
        "Nilai: Gradient Boosting PR-AUC 0,5597 dengan base rate 0,2212. Rasio 0,5597 dibagi 0,2212 sama dengan 2,53 — model memberi precision-recall 2,53 kali lebih baik dari baseline acak yang sekadar menebak sesuai base rate. Logistic Regression PR-AUC 0,5049, rasionya 0,5049 dibagi 0,2212 sama dengan 2,28. Keduanya jauh di atas base rate — model belajar sinyal nyata, bukan sekadar menebak.",
        "Imbalance, kalibrasi, dan threshold adalah tiga hal berbeda yang sering dicampur. Class imbalance (base rate 0,2212 [notebook]) adalah sifat data — dan PR-AUC sudah menanganinya dengan membandingkan terhadap base rate. Probability calibration adalah sifat skor — apakah 0,8 berarti peluang 80 persen — dan itu urusan Brier di langkah 6. Resampling, class weight, dan threshold adjustment adalah tiga cara berbeda menangani imbalance: resampling mengubah komposisi data latih, class weight mengubah bobot loss, threshold adjustment mengubah titik keputusan tanpa menyentuh model. Ketiganya mengubah tradeoff FN/FP, tetapi tidak satu pun memperbaiki kalibrasi secara otomatis. M2 membandingkan ketiganya pada LR, tree, dan GBM.",
        "Gambar di bawah menunjukkan kurva PR dari 10 skor lab, dengan garis base rate 0,40 (4 dari 10 contoh lab positif). Kurva berada di atas garis base rate di hampir semua recall — itulah yang dicari. Bila kurva menempel garis base rate, model tidak belajar apa-apa.",
        "Baik atau buruk: PR-AUC 0,5597 baik bila dibaca relatif terhadap base rate 0,2212 — 2,53 kali baseline. PR-AUC yang sama (0,5597) akan buruk bila base rate-nya 0,5 — hanya 1,12 kali baseline. Angka PR-AUC tanpa base rate tidak bercerita; selalu laporkan keduanya.",
        "Mitigasi: bila PR-AUC mendekati base rate, model tidak menemukan sinyal — kembali ke fitur dan data, bukan ke tuning. Bila PR-AUC bagus tapi precision pada threshold operasional rendah, naikkan threshold atau tambah biaya FP dalam pemilihan threshold.",
      ],
      formula: String.raw`\text{baseline PR-AUC} = \text{base rate} = \frac{\text{positif}}{\text{total}}`,
      formulaNote: "Model acak yang menebak sesuai base rate punya PR-AUC sama dengan base rate. PR-AUC model harus dibandingkan dengan angka ini, bukan dengan 0,5.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Kurva PR dengan garis base rate 0,40">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Kurva Precision-Recall: base rate 0,40</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="155.5" y1="206" x2="155.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="155.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="259.0" y1="206" x2="259.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="362.5" y1="206" x2="362.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="362.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">recall</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">precision</text>
<line x1="52.0" y1="135.6" x2="466.0" y2="135.6" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="4,3"/>
<text x="457.7" y="129.6" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">base rate 0,40</text>
<polyline points="155.5,30.0 259.0,30.0 259.0,88.7 362.5,74.0 362.5,100.4 362.5,118.0 466.0,105.4 466.0,118.0 466.0,127.8 466.0,135.6" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="155.5" cy="30.0" r="3" fill="var(--c1)"/>
<circle cx="259.0" cy="30.0" r="3" fill="var(--c1)"/>
<circle cx="259.0" cy="88.7" r="3" fill="var(--c1)"/>
<circle cx="362.5" cy="74.0" r="3" fill="var(--c1)"/>
<circle cx="362.5" cy="100.4" r="3" fill="var(--c1)"/>
<circle cx="362.5" cy="118.0" r="3" fill="var(--c1)"/>
<circle cx="466.0" cy="105.4" r="3" fill="var(--c1)"/>
<circle cx="466.0" cy="118.0" r="3" fill="var(--c1)"/>
<circle cx="466.0" cy="127.8" r="3" fill="var(--c1)"/>
<circle cx="466.0" cy="135.6" r="3" fill="var(--c1)"/>
</svg>`,
        alt: "Kurva PR dengan garis base rate 0,40.",
        caption: "Cara membaca: sumbu X = recall, sumbu Y = precision; garis putus-putus = base rate 0,40. Interpretasi: kurva di atas garis base rate — model lebih baik dari tebak acak di hampir semua recall.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: PR-AUC 0,56 berarti model jelek",
        type: "pitfall",
        body: "Yang benar: 0,5597 harus dibaca relatif terhadap base rate 0,2212. Rasio 2,53 kali baseline adalah sinyal yang kuat. PR-AUC 0,9 pada data seimbang biasa saja; PR-AUC 0,56 pada base rate 0,22 adalah pencapaian.",
      },
    },
    {
      id: "kalibrasi",
      eyebrow: "Langkah 6 · Kalibrasi dan Brier",
      title: "Kalibrasi: apakah skor 0,8 berarti peluang 80 persen?",
      prose: [
        "Model klasifikasi mengeluarkan skor — tapi apakah skor 0,8 berarti peluang default 80 persen? Belum tentu. Kalibrasi mengukur kejujuran probabilitas: dari semua nasabah berskor sekitar 0,8, berapa persen yang benar-benar default? Brier score mengukurnya dalam satu angka: rata-rata kuadrat selisih skor dan label.",
        "Nilai: pada 10 skor lab, Brier = 0,1802 — dihitung sebagai rata-rata (skor dikurangi label) kuadrat. Pada notebook, Brier Logistic Regression 0,1427 dan Gradient Boosting 0,1342 — GBM lebih rendah 0,0085, jadi skor probabilitasnya lebih baik secara keseluruhan. Brier rendah saja belum membuktikan kalibrasi; cek reliability diagram. GBM terkalibrasi memberi Brier 0,1345, praktis sama dengan GBM mentah 0,1342 — kalibrasi hampir tidak mengubah Brier, konsisten dengan model yang sudah cukup terkalibrasi.",
        "Brier mencampur dua hal: discrimination (seberapa baik skor memisahkan default dan lancar — mirip ROC-AUC) dan calibration (seberapa dapat dipercaya angkanya — reliability). Brier rendah bisa datang dari salah satunya; karena itu Brier 0,1342 vs 0,1427 [notebook] berarti GBM lebih baik secara keseluruhan, tetapi belum tentu lebih terkalibrasi. Brier juga bergantung pada prevalensi — jangan membandingkan Brier lintas populasi dengan base rate berbeda. Untuk PD dan expected loss, yang dibutuhkan adalah calibration: PD yang dipakai di PD × LGD × EAD harus probabilitas yang dapat dipercaya, bukan sekadar ranking yang bagus.",
        "Gambar di bawah menunjukkan kalibrasi 10 skor lab dalam 4 bin: prediksi rata-rata 0,150 vs kejadian 0,000; 0,383 vs 0,333; 0,575 vs 0,500; 0,850 vs 0,667. Titik-titiknya dekat diagonal — model kecil ini cukup terkalibrasi, dengan bin tertinggi sedikit overconfident (memprediksi 0,850 tapi kejadiannya 0,667).",
        "Baca bin tertinggi itu pelan-pelan: model memprediksi peluang default rata-rata 0,850 untuk 3 nasabah di bin itu, tetapi yang benar-benar default hanya 2 dari 3 — observed 0,667. Model overpredict: ia mengira risikonya lebih besar dari kenyataan. Bila PD seperti ini dipakai di PD × LGD × EAD, expected loss ikut membengkak dan bank menolak nasabah yang sebenarnya layak. Sebaliknya, bin yang underpredict membuat bank meremehkan kerugian. Itulah kenapa kalibrasi dicek SEBELUM probabilitas dipakai untuk keputusan uang — bukan sesudah.",
        "Baik atau buruk: Brier rendah baik — mendukung kualitas probabilistik, tetapi kalibrasi harus dicek dengan reliability diagram/ECE; kalibrasi dulu sebelum dipakai untuk expected loss. Brier tinggi buruk — skor menyesatkan perhitungan biaya. Bin yang jauh dari diagonal menunjukkan arah kesalahan: di atas diagonal berarti underconfident, di bawah berarti overconfident.",
        "Mitigasi: bila kalibrasi buruk, kalibrasikan dengan Platt scaling atau isotonic regression pada data validasi — bukan data latih. Di notebook, GBM terkalibrasi dipilih sebagai model rekomendasi justru karena probabilitasnya bisa dipercaya untuk threshold berbasis biaya.",
        "Kartu perbandingan — tiga model, empat metrik [notebook]. Logistic Regression: ROC-AUC 0,7426, PR-AUC 0,5049, Brier 0,1427. Gradient Boosting: ROC-AUC 0,7823, PR-AUC 0,5597, Brier 0,1342. GBM terkalibrasi: ROC-AUC 0,7816, PR-AUC 0,5558, Brier 0,1345. Tiga pertanyaan untuk membacanya: model mana ranking-nya terbaik? GBM (ROC-AUC 0,7823). Model mana skor probabilitasnya terbaik secara keseluruhan? GBM mentah (Brier 0,1342, sedikit di bawah GBM terkalibrasi 0,1345). Kenapa kalibrasi hampir tidak mengubah apa pun di sini? Karena GBM sudah cukup terkalibrasi — Brier hanya berubah 0,0003. Jawaban yang sama tidak berlaku bila model awalnya miscalibrated.",
      ],
      formula: String.raw`\text{Brier} = \frac{1}{n}\sum_{i=1}^{n} (p_i - y_i)^2`,
      formulaNote: "Brier score: rata-rata kuadrat selisih antara probabilitas prediksi p dan label y (0 atau 1). Makin kecil makin baik; 0 berarti sempurna.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Empat bin: prediksi rata-rata vs observed rate, dekat diagonal = terkalibrasi">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Kalibrasi: prediksi vs kejadian nyata</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="155.5" y1="206" x2="155.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="155.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="259.0" y1="206" x2="259.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="362.5" y1="206" x2="362.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="362.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">probabilitas prediksi (rata-rata bin)</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">observed default rate</text>
<line x1="52.0" y1="206.0" x2="466.0" y2="30.0" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4,3"/>
<circle cx="114.1" cy="206.0" r="5" fill="var(--c1)"/>
<circle cx="210.6" cy="147.4" r="5" fill="var(--c1)"/>
<circle cx="290.0" cy="118.0" r="5" fill="var(--c1)"/>
<circle cx="403.9" cy="88.6" r="5" fill="var(--c1)"/>
<text x="279.7" y="56.4" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">diagonal = kalibrasi sempurna</text>
</svg>`,
        alt: "Empat bin: prediksi rata-rata vs observed rate, dekat diagonal = terkalibrasi.",
        caption: "Cara membaca: sumbu X = probabilitas prediksi rata-rata per bin, sumbu Y = kejadian nyata; diagonal = kalibrasi sempurna. Interpretasi: titik-titik dekat diagonal — bin tertinggi sedikit overconfident.",
      },
      tasks: [],
      note: {
        title: "Ringkas dari MLE4: kalibrasi ECE",
        body: "MLE4 sudah mengajarkan Expected Calibration Error. Brier di sini adalah sepupunya: satu angka yang menggabungkan kalibrasi dan ketajaman. Fokus baru: memakai kalibrasi untuk threshold berbasis biaya.",
      },
    },
    {
      id: "cv",
      eyebrow: "Langkah 7 · Cross-validation",
      title: "Cross-validation: jangan percaya satu split",
      prose: [
        "Satu split train-test adalah satu undian. Bila split-nya kebetulan mudah, skor terlihat bagus; bila sulit, terlihat buruk. Cross-validation mengulang undian itu: bagi data menjadi k fold, tiap fold sekali menjadi test, lalu rata-ratakan skornya.",
        "Nilai: notebook memakai satu split — 24.000 nasabah latih (30.000 dikurangi 6.000) dan 6.000 test. Itu cukup untuk perbandingan kasar LR vs GBM, tapi satu split tidak memberi tahu seberapa stabil selisih 0,0397 itu. Dengan 5-fold cross-validation, tiap nasabah menjadi test tepat satu kali, dan kita mendapat lima skor — bukan satu — sehingga bisa melihat variasinya.",
        "Satu peringatan untuk data berwaktu: CV acak mengacak baris, sehingga masa depan bisa masuk ke fold latih dan mengajari model — CV mengintip masa depan. Test set notebook 6.000 dari 30.000 [notebook] tidak menjamin validitas temporal: satu split acak tetap satu split acak. Panel bawah gambar menunjukkan cara yang benar: latih di awal, validasi di tengah, uji di akhir.",
        "Satu peringatan lagi: metrik agregat menyembunyikan perbedaan antarsegmen. ROC-AUC 0,7823 [notebook] adalah rata-rata seluruh populasi — performa bisa jauh lebih buruk pada satu segmen, satu cohort, atau satu vintage (bulan origination) tertentu. Vintage analysis di M2 memeriksa stabilitas per cohort; evaluasi per segmen dan per waktu dibahas di M7. Bila model dipakai untuk semua nasabah, metriknya harus dilaporkan per segmen — bukan hanya satu angka global.",
        "Gambar di bawah menunjukkan 5-fold: lima baris, tiap baris satu fold menjadi test (oranye) dan empat fold lainnya train (biru). Tidak ada data yang terbuang: semua baris dipakai sebagai test tepat sekali.",
        "Baik atau buruk: CV baik bila fold-nya mewakili populasi — dan di finance, itu berarti fold harus menghormati waktu: data masa depan tidak boleh bocor ke fold latih. CV acak (random split) buruk untuk data time-series: ia membiarkan model mengintip masa depan.",
        "Mitigasi: untuk data berwaktu, pakai time-based split atau walk-forward validation — latih di masa lalu, uji di masa depan. CR46 memakai walk-forward untuk credit scoring; di lesson ini cukup ingat aturannya: jangan biarkan masa depan masuk ke data latih.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 350" role="img" aria-label="Lima baris: tiap fold satu segmen test, sisanya train; plus tiga segmen berwaktu: train awal, validation tengah, test akhir">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Cross-validation 5-fold: tiap baris jadi test sekali</text>

<rect x="54.0" y="42" width="78.8" height="22" fill="var(--c4)" opacity="0.9"/>
<text x="93.4" y="57" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">test</text>
<rect x="136.8" y="42" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="176.2" y="57" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="219.6" y="42" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="259.0" y="57" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="302.4" y="42" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="341.8" y="57" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="385.2" y="42" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="424.6" y="57" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<text x="44" y="57" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">fold 1</text>
<rect x="54.0" y="74" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="93.4" y="89" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="136.8" y="74" width="78.8" height="22" fill="var(--c4)" opacity="0.9"/>
<text x="176.2" y="89" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">test</text>
<rect x="219.6" y="74" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="259.0" y="89" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="302.4" y="74" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="341.8" y="89" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="385.2" y="74" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="424.6" y="89" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<text x="44" y="89" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">fold 2</text>
<rect x="54.0" y="106" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="93.4" y="121" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="136.8" y="106" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="176.2" y="121" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="219.6" y="106" width="78.8" height="22" fill="var(--c4)" opacity="0.9"/>
<text x="259.0" y="121" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">test</text>
<rect x="302.4" y="106" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="341.8" y="121" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="385.2" y="106" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="424.6" y="121" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<text x="44" y="121" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">fold 3</text>
<rect x="54.0" y="138" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="93.4" y="153" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="136.8" y="138" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="176.2" y="153" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="219.6" y="138" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="259.0" y="153" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="302.4" y="138" width="78.8" height="22" fill="var(--c4)" opacity="0.9"/>
<text x="341.8" y="153" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">test</text>
<rect x="385.2" y="138" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="424.6" y="153" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<text x="44" y="153" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">fold 4</text>
<rect x="54.0" y="170" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="93.4" y="185" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="136.8" y="170" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="176.2" y="185" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="219.6" y="170" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="259.0" y="185" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="302.4" y="170" width="78.8" height="22" fill="var(--c1)" opacity="0.55"/>
<text x="341.8" y="185" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">train</text>
<rect x="385.2" y="170" width="78.8" height="22" fill="var(--c4)" opacity="0.9"/>
<text x="424.6" y="185" text-anchor="middle" font-size="10" fill="#ffffff" font-family="var(--font-ui)">test</text>
<text x="44" y="185" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">fold 5</text>
<line x1="52" y1="212" x2="466" y2="212" stroke="var(--chart-text)" stroke-width="1"/>
<text x="240.0" y="234" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Untuk data berwaktu: latih masa lalu, uji masa depan</text>
<rect x="54" y="246" width="132" height="36" rx="8" fill="var(--c1)" opacity="0.55"/><text x="120" y="268" text-anchor="middle" font-size="11" fill="#ffffff" font-family="var(--font-ui)" font-weight="600">TRAIN — AWAL</text>
<rect x="190" y="246" width="132" height="36" rx="8" fill="var(--c3)" opacity="0.85"/><text x="256" y="268" text-anchor="middle" font-size="11" fill="#ffffff" font-family="var(--font-ui)" font-weight="600">VALIDATION — BERIKUT</text>
<rect x="326" y="246" width="132" height="36" rx="8" fill="var(--c4)" opacity="0.9"/><text x="392" y="268" text-anchor="middle" font-size="11" fill="#ffffff" font-family="var(--font-ui)" font-weight="600">TEST — AKHIR</text>
<text x="240" y="302" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)">CV acak mengintip masa depan — fold masa depan mengajari train.</text>
<text x="240" y="320" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)">Test set notebook 6.000 dari 30.000 tidak menjamin validitas temporal.</text>
</svg>`,
        alt: "Lima baris: tiap fold satu segmen test, sisanya train; plus tiga segmen berwaktu: train awal, validation tengah, test akhir.",
        caption: "Cara membaca: tiap baris satu fold; segmen oranye = test, biru = train. Interpretasi: semua data menjadi test tepat sekali — lima skor, bukan satu undian. Panel bawah: untuk data berwaktu, latih di awal, validasi di tengah, uji di akhir — CV acak membiarkan masa depan masuk ke fold latih.",
      },
      tasks: [],
      note: {
        title: "Tip: CV untuk memilih, test untuk melaporkan",
        body: "Pakai cross-validation untuk memilih model dan threshold. Lalu laporkan skor akhir SEKALI pada test set yang tidak pernah dipakai memilih apa pun. Bila test set dipakai berulang untuk memilih, ia bukan test set lagi — ia menjadi validation set kedua.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 8 · Lab 1",
      title: "Lab: metrik dan biaya dari confusion matrix",
      prose: [
        "Dua threshold, satu confusion matrix tiap threshold. Hitung precision, recall, F1, dan biaya bisnisnya — lalu jawab: threshold mana yang lebih murah, dan kenapa akurasi menjawab sebaliknya?",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `prec`, `rec`, dan `f1` di fungsi `metrics`" },
        { id: "t2", text: "Lengkapi `cost`: FN × NT$45.000 + FP × NT$5.000" },
        { id: "t3", text: "Jalankan dan bandingkan biaya threshold 0,5 vs 0,10" },
      ],
      expected: "threshold 0,5: acc=0.8288 prec=0.6364 rec=0.5275 F1=0.5768 biaya=NT$30,215,000\nthreshold 0,10: acc=0.7222 prec=0.4320 rec=0.8139 F1=0.5644 biaya=NT$18,215,000\nbaseline mayoritas (selalu 'tidak default'): 0.7788\nhemat biaya thr 0,10 vs 0,5: 39.7%",
      hints: [
        "precision = TP / (TP + FP); recall = TP / (TP + FN).",
        "Biaya: FN seharga 45.000, FP seharga 5.000 — FN sembilan kali lebih mahal dari FP.",
      ],
      code: {
        starter: `# 6000 nasabah, 1327 default (22,12%). Dua threshold, biaya:
# FN (default lolos) = NT$45.000 (LGD 45% x limit 100.000)
# FP (nasabah bagus ditolak) = NT$5.000 (margin hilang)
def metrics(tp, fp, fn, tn):
    n = tp + fp + fn + tn
    acc = (tp + tn) / n
    prec = 0.5  # TODO: TP / (TP + FP)
    rec = 0.5  # TODO: TP / (TP + FN)
    f1 = 2 * prec * rec / (prec + rec)
    cost = 0  # TODO: FN * 45000 + FP * 5000
    return acc, prec, rec, f1, cost

for name, (tp, fp, fn, tn) in {
    "threshold 0,5": (700, 400, 627, 4273),
    "threshold 0,10": (1080, 1420, 247, 3253),
}.items():
    acc, prec, rec, f1, cost = metrics(tp, fp, fn, tn)
    print(f"{name}: acc={acc:.4f} prec={prec:.4f} rec={rec:.4f} F1={f1:.4f} biaya=NT$" + f"{cost:,}")
print(f"baseline mayoritas (selalu 'tidak default'): {4673 / 6000:.4f}")
c05 = 627 * 45000 + 400 * 5000
c010 = 247 * 45000 + 1420 * 5000
print(f"hemat biaya thr 0,10 vs 0,5: {(c05 - c010) / c05 * 100:.1f}%")`,
        lockLines: 6,
        solution: `# 6000 nasabah, 1327 default (22,12%). Dua threshold, biaya:
# FN (default lolos) = NT$45.000 (LGD 45% x limit 100.000)
# FP (nasabah bagus ditolak) = NT$5.000 (margin hilang)
def metrics(tp, fp, fn, tn):
    n = tp + fp + fn + tn
    acc = (tp + tn) / n
    prec = tp / (tp + fp)
    rec = tp / (tp + fn)
    f1 = 2 * prec * rec / (prec + rec)
    cost = fn * 45000 + fp * 5000
    return acc, prec, rec, f1, cost

for name, (tp, fp, fn, tn) in {
    "threshold 0,5": (700, 400, 627, 4273),
    "threshold 0,10": (1080, 1420, 247, 3253),
}.items():
    acc, prec, rec, f1, cost = metrics(tp, fp, fn, tn)
    print(f"{name}: acc={acc:.4f} prec={prec:.4f} rec={rec:.4f} F1={f1:.4f} biaya=NT$" + f"{cost:,}")
print(f"baseline mayoritas (selalu 'tidak default'): {4673 / 6000:.4f}")
c05 = 627 * 45000 + 400 * 5000
c010 = 247 * 45000 + 1420 * 5000
print(f"hemat biaya thr 0,10 vs 0,5: {(c05 - c010) / c05 * 100:.1f}%")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "threshold 0,5: acc=0\\.8288 prec=0\\.6364 rec=0\\.5275 F1=0\\.5768", label: "Output menampilkan metrik threshold 0,5", msg: "Cek rumus precision, recall, F1." },
          { kind: "stdout_matches", task: "t1", pattern: "threshold 0,10: acc=0\\.7222 prec=0\\.4320 rec=0\\.8139 F1=0\\.5644", label: "Output menampilkan metrik threshold 0,10", msg: "Recall naik, precision turun — tradeoff yang diharapkan." },
          { kind: "stdout_matches", task: "t3", pattern: "hemat biaya thr 0,10 vs 0,5: 39\\.7%", label: "Output menampilkan hemat biaya 39.7%", msg: "Biaya 0,5 = NT$30.215.000; biaya 0,10 = NT$18.215.000." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 9 · Lab 2",
      title: "Lab: ROC-AUC dan Brier dari nol",
      prose: [
        "Tanpa library ML: hitung ROC-AUC dengan metode Mann-Whitney — peluang skor positif acak mengalahkan skor negatif acak — dan Brier score sebagai rata-rata kuadrat selisih skor dan label. Lalu bangun titik-titik kurva ROC dan PR serta bin kalibrasinya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi hitungan `wins` (Mann-Whitney) untuk ROC-AUC" },
        { id: "t2", text: "Lengkapi `brier`: rata-rata (skor - label) kuadrat" },
        { id: "t3", text: "Jalankan dan baca titik kurva ROC, PR, dan bin kalibrasi" },
      ],
      expected: "ROC-AUC=0.8333\nBrier=0.1802\nROC pts: [(0.0, 0.0), (0.0, 0.25), (0.0, 0.5), (0.1667, 0.5), (0.1667, 0.75), (0.3333, 0.75), (0.5, 0.75), (0.5, 1.0), (0.6667, 1.0), (0.8333, 1.0), (1.0, 1.0), (1.0, 1.0)]\nPR pts: [(0.25, 1.0), (0.5, 1.0), (0.5, 0.6667), (0.75, 0.75), (0.75, 0.6), (0.75, 0.5), (1.0, 0.5714), (1.0, 0.5), (1.0, 0.4444), (1.0, 0.4)]\nbin mean_pred=0.150 observed=0.000 n=2\nbin mean_pred=0.383 observed=0.333 n=3\nbin mean_pred=0.575 observed=0.500 n=2\nbin mean_pred=0.850 observed=0.667 n=3",
      hints: [
        "wins = jumlah pasangan (positif, negatif) dengan skor positif lebih besar — tambah 0,5 bila seri.",
        "Brier = jumlah (s - y) kuadrat untuk semua contoh, dibagi banyaknya contoh.",
      ],
      code: {
        starter: `scores = [0.92, 0.85, 0.78, 0.60, 0.55, 0.45, 0.40, 0.30, 0.20, 0.10]
labels = [1, 1, 0, 1, 0, 0, 1, 0, 0, 0]

# ROC-AUC via Mann-Whitney: P(skor positif > skor negatif)
pos = [s for s, y in zip(scores, labels) if y == 1]
neg = [s for s, y in zip(scores, labels) if y == 0]
wins = 0.0  # TODO: hitung pasangan menang (seri = 0,5)
auc = wins / (len(pos) * len(neg))
print(f"ROC-AUC={auc:.4f}")

# Brier score: rata-rata (skor - label)^2
brier = 0.0  # TODO: rata-rata kuadrat selisih skor dan label
print(f"Brier={brier:.4f}")

# Kurva ROC: titik (FPR, TPR) tiap threshold
pts = []
for t in [1.0, 0.92, 0.85, 0.78, 0.60, 0.55, 0.45, 0.40, 0.30, 0.20, 0.10, 0.0]:
    tp = sum(1 for s, y in zip(scores, labels) if s >= t and y == 1)
    fp = sum(1 for s, y in zip(scores, labels) if s >= t and y == 0)
    fn = sum(1 for s, y in zip(scores, labels) if s < t and y == 1)
    tn = sum(1 for s, y in zip(scores, labels) if s < t and y == 0)
    pts.append((round(fp / (fp + tn), 4) if fp + tn else 0.0,
                round(tp / (tp + fn), 4) if tp + fn else 0.0))
print("ROC pts:", pts)
# Kurva PR: titik (recall, precision) tiap threshold
pr = []
for t in [0.92, 0.85, 0.78, 0.60, 0.55, 0.45, 0.40, 0.30, 0.20, 0.10]:
    tp = sum(1 for s, y in zip(scores, labels) if s >= t and y == 1)
    fp = sum(1 for s, y in zip(scores, labels) if s >= t and y == 0)
    fn = sum(1 for s, y in zip(scores, labels) if s < t and y == 1)
    pr.append((round(tp / (tp + fn), 4) if tp + fn else 0.0,
               round(tp / (tp + fp), 4) if tp + fp else 0.0))
print("PR pts:", pr)
# Kalibrasi: 4 bin
order = sorted(zip(scores, labels))
bins = [order[0:2], order[2:5], order[5:7], order[7:10]]
for b in bins:
    mp = sum(s for s, _ in b) / len(b)
    mo = sum(y for _, y in b) / len(b)
    print(f"bin mean_pred={mp:.3f} observed={mo:.3f} n={len(b)}")`,
        lockLines: 6,
        solution: `scores = [0.92, 0.85, 0.78, 0.60, 0.55, 0.45, 0.40, 0.30, 0.20, 0.10]
labels = [1, 1, 0, 1, 0, 0, 1, 0, 0, 0]

# ROC-AUC via Mann-Whitney: P(skor positif > skor negatif)
pos = [s for s, y in zip(scores, labels) if y == 1]
neg = [s for s, y in zip(scores, labels) if y == 0]
wins = sum(1 if a > b else 0.5 if a == b else 0 for a in pos for b in neg)
auc = wins / (len(pos) * len(neg))
print(f"ROC-AUC={auc:.4f}")

# Brier score: rata-rata (skor - label)^2
brier = sum((s - y) ** 2 for s, y in zip(scores, labels)) / len(scores)
print(f"Brier={brier:.4f}")

# Kurva ROC: titik (FPR, TPR) tiap threshold
pts = []
for t in [1.0, 0.92, 0.85, 0.78, 0.60, 0.55, 0.45, 0.40, 0.30, 0.20, 0.10, 0.0]:
    tp = sum(1 for s, y in zip(scores, labels) if s >= t and y == 1)
    fp = sum(1 for s, y in zip(scores, labels) if s >= t and y == 0)
    fn = sum(1 for s, y in zip(scores, labels) if s < t and y == 1)
    tn = sum(1 for s, y in zip(scores, labels) if s < t and y == 0)
    pts.append((round(fp / (fp + tn), 4) if fp + tn else 0.0,
                round(tp / (tp + fn), 4) if tp + fn else 0.0))
print("ROC pts:", pts)
# Kurva PR: titik (recall, precision) tiap threshold
pr = []
for t in [0.92, 0.85, 0.78, 0.60, 0.55, 0.45, 0.40, 0.30, 0.20, 0.10]:
    tp = sum(1 for s, y in zip(scores, labels) if s >= t and y == 1)
    fp = sum(1 for s, y in zip(scores, labels) if s >= t and y == 0)
    fn = sum(1 for s, y in zip(scores, labels) if s < t and y == 1)
    pr.append((round(tp / (tp + fn), 4) if tp + fn else 0.0,
               round(tp / (tp + fp), 4) if tp + fp else 0.0))
print("PR pts:", pr)
# Kalibrasi: 4 bin
order = sorted(zip(scores, labels))
bins = [order[0:2], order[2:5], order[5:7], order[7:10]]
for b in bins:
    mp = sum(s for s, _ in b) / len(b)
    mo = sum(y for _, y in b) / len(b)
    print(f"bin mean_pred={mp:.3f} observed={mo:.3f} n={len(b)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "auc", value: 0.8333, tol: 1e-4, label: "`auc` seharusnya 0.8333", msg: "20 dari 24 pasangan positif-negatif dimenangkan skor positif." },
          { kind: "equal", task: "t2", name: "brier", value: 0.1802, tol: 1e-4, label: "`brier` seharusnya 0.1802", msg: "Jumlah kuadrat selisih 1,8023 dibagi 10." },
          { kind: "stdout_matches", task: "t1", pattern: "ROC-AUC=0\\.8333", label: "Output menampilkan ROC-AUC 0.8333", msg: "Cek hitungan wins Mann-Whitney." },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: metrik apa untuk masalah apa?",
      prose: [
        "Data seimbang dan biaya salah sama? Akurasi boleh dipakai — tapi tetap laporkan baseline mayoritas.",
        "Data imbalance dan yang penting adalah menangkap kelas langka? Precision, recall, F1 — dan PR-AUC dibaca relatif terhadap base rate.",
        "Mau membandingkan model tanpa terikat satu threshold? ROC-AUC untuk ranking umum; PR-AUC bila kelas positif langka.",
        "Probabilitas dipakai untuk menghitung expected loss? Cek kalibrasi dulu — Brier dan kurva kalibrasi — sebelum percaya skornya.",
        "Satu split memberi angka yang mencurigakan bagus? Ulangi dengan cross-validation; bila datanya berwaktu, pakai time-based split.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 11 · Mini-case",
      title: "Mini-case: threshold 0,5 atau 0,10 — putuskan dengan biaya",
      prose: [
        "Bank memakai model yang sama seperti lab 1: 6.000 nasabah, 1.327 default. Biaya FN NT$45.000, biaya FP NT$5.000. Pada threshold 0,5: FN 627 dan FP 400 — biaya = 627 × 45.000 + 400 × 5.000 = 28.215.000 + 2.000.000 = NT$30.215.000. Pada threshold 0,10: FN 247 dan FP 1.420 — biaya = 247 × 45.000 + 1.420 × 5.000 = 11.115.000 + 7.100.000 = NT$18.215.000. Penghematan = (30.215.000 − 18.215.000) dibagi 30.215.000 = 39,7 persen [mini-case]. Angka ini berbeda dari 45,2 persen vs threshold 0,5 dan 59,8 persen vs approve-all di notebook [notebook] — mini-case ini memakai limit flat NT$100.000 untuk semua nasabah, sementara notebook memakai limit masing-masing nasabah (LIMIT_BAL). Keduanya sah untuk tujuannya; jangan dicampur.",
        "Reason code — penjelasan untuk tiap penolakan. Bila seorang nasabah ditolak, bank harus bisa menjawab 'kenapa saya ditolak?' dengan tiga alasan utama dalam bahasa awam — misal 'keterlambatan pembayaran bulan lalu', 'utilisasi limit yang hampir penuh', 'tagihan naik tiga bulan berturut-turut'. Alasan itu berasal dari kontribusi fitur model (di M7: SHAP), tetapi keputusannya tetap bisa diaudit tanpa SHAP: koefisien logistic regression atau gain fitur GBM sudah memberi tiga alasan teratas. Reason code bukan hiasan — ia syarat audit dan syarat kepercayaan nasabah.",
        "Perhatikan yang terjadi di balik penghematan itu: akurasi TURUN dari 0,8288 ke 0,7222 — model yang lebih murah justru terlihat lebih buruk bila hanya dilihat dari akurasi. Precision turun dari 0,6364 ke 0,4320 karena 1.020 nasabah bagus tambahan ditolak. Tapi recall naik dari 0,5275 ke 0,8139: 380 default tambahan tertangkap (1.080 dikurangi 700). Karena satu FN sembilan kali lebih mahal dari satu FP (45.000 dibagi 5.000), tradeoff ini menguntungkan.",
        "Notebook credit scoring melaporkan hasil yang searah pada data penuh 30.000 nasabah: threshold 0,10 menghemat biaya 45,2 persen [notebook] dibanding 0,5, dan 59,8 persen [notebook] dibanding menyetujui semua orang. Angka pastinya berbeda karena asumsi biayanya berbeda (limit flat vs limit per nasabah) — arahnya sama: threshold murah adalah threshold yang menghargai biaya FN yang besar.",
        "Keputusan: pakai threshold 0,10 — dengan catatan 1.420 nasabah bagus yang ditolak mendapat adverse-action reason codes (M2 dan M7) supaya penolakan bisa dijelaskan, bukan sekadar ditolak.",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 12 · Guided task di Colab",
      title: "Guided task di Colab: evaluasi penuh model credit scoring",
      prose: [
        "Lesson web ini mengajarkan metrik dan cara membacanya. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf3-guided-task.ipynb.",
        "Di notebook itu kamu mengevaluasi penuh sebuah model credit scoring: membangun confusion matrix dari prediksi, menghitung precision, recall, F1, ROC-AUC, PR-AUC, dan Brier, membandingkan dua threshold dengan biaya bisnis, dan menuliskan rekomendasi threshold beserta alasannya.",
        "Tautan Colab:",
        "Buka di Colab: https://colab.research.google.com/drive/1KctExa3rR5fM-9U-i4yx7XMxQs9qBUt3",
        "Jalur file notebook: colab/mlf3-guided-task.ipynb.",
        "Companion full-code untuk topik yang memetakan ke proyek nyata: notebook credit scoring end-to-end di Colab: https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO — ROC-AUC 0,7823, PR-AUC 0,5597, dan threshold 0,10 di lesson ini berasal dari notebook itu.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 13 · Checkpoint",
      title: "Checkpoint: metrik yang jujur",
      prose: [
        "Rangkuman: akurasi menipu pada imbalance — baseline mayoritas 0,7788. Precision-recall adalah tradeoff yang dipilih dari biaya. ROC-AUC GBM 0,7823 lumayan; PR-AUC 0,5597 adalah 2,53 kali base rate 0,2212. Brier GBM 0,1342 lebih baik dari LR 0,1427. Satu split adalah satu undian — cross-validation memberi lima skor.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Model selalu memprediksi tidak default pada 6.000 nasabah (1.327 default). Berapa akurasinya?",
          options: [
            { text: "0,7788", why: "Benar: 4.673 nasabah lancar dibagi 6.000 = 0,7788 — dan recall-nya 0.", correct: true },
            { text: "0,2212", why: "Itu base rate default-nya, bukan akurasi model ini." },
            { text: "1,0000", why: "Model ini salah pada semua 1.327 default — jauh dari sempurna." },
            { text: "0,0000", why: "Model ini benar pada 4.673 nasabah lancar — akurasinya bukan nol." },
          ],
        },
        {
          q: "Threshold 0,5 memberi precision 0,6364 dan recall 0,5275; threshold 0,10 memberi precision 0,4320 dan recall 0,8139. Threshold mana yang menangkap lebih banyak default?",
          options: [
            { text: "Threshold 0,10 (recall 0,8139)", why: "Benar: recall 0,8139 berarti 1.080 dari 1.327 default tertangkap — 380 lebih banyak dari threshold 0,5.", correct: true },
            { text: "Threshold 0,5 (recall 0,5275)", why: "Recall 0,5275 lebih rendah: hanya 700 dari 1.327 default tertangkap." },
            { text: "Keduanya sama karena F1-nya mirip", why: "F1 memang mirip (0,5768 vs 0,5644), tapi recall-nya berbeda jauh — F1 menyembunyikan tradeoff ini." },
            { text: "Tidak bisa dibandingkan tanpa ROC-AUC", why: "Recall pada tiap threshold bisa dibandingkan langsung; ROC-AUC adalah ukuran di semua threshold." },
          ],
        },
        {
          q: "Gradient Boosting ROC-AUC 0,7823. Bagaimana membacanya dengan band acuan?",
          options: [
            { text: "Bagus (0,8–0,9)", why: "0,7823 masih di bawah 0,8 — belum masuk band bagus." },
            { text: "Lumayan, mendekati bagus (0,7–0,8)", why: "Benar: 0,7823 berada di band 0,7–0,8, hanya 0,0177 di bawah ambang bagus.", correct: true },
            { text: "Sama dengan tebak acak", why: "Tebak acak adalah 0,5 — 0,7823 jauh di atasnya." },
            { text: "Mencurigakan, kemungkinan leakage", why: "Leakage dicurigai di atas 0,9 — 0,7823 tidak mencurigakan." },
          ],
        },
        {
          q: "GBM PR-AUC 0,5597 dengan base rate 0,2212. Apa artinya?",
          options: [
            { text: "Model 2,53 kali lebih baik dari baseline acak", why: "Benar: 0,5597 dibagi 0,2212 = 2,53 — model belajar sinyal nyata.", correct: true },
            { text: "Model hanya sedikit di atas tebak acak 0,5", why: "Baseline PR-AUC bukan 0,5 — melainkan base rate 0,2212." },
            { text: "Model jelek karena PR-AUC di bawah 0,6", why: "PR-AUC harus dibaca relatif terhadap base rate, bukan ambang absolut." },
            { text: "Model sempurna karena PR-AUC di atas base rate", why: "Di atas base rate berarti belajar sinyal — bukan sempurna; sempurna adalah 1,0." },
          ],
        },
        {
          q: "Brier score Logistic Regression 0,1427 dan Gradient Boosting 0,1342. Mana yang skor probabilitasnya lebih baik?",
          options: [
            { text: "Gradient Boosting, karena Brier lebih kecil", why: "Benar: Brier makin kecil makin baik — selisihnya 0,0085. Ingat: Brier rendah mendukung kualitas probabilistik, tetapi kalibrasi tetap harus dicek dengan reliability diagram.", correct: true },
            { text: "Logistic Regression, karena Brier lebih besar", why: "Kebalik: Brier mengukur kuadrat kesalahan — besar berarti buruk." },
            { text: "Keduanya sama karena selisihnya kecil", why: "Selisih 0,0085 memang kecil, tapi arahnya jelas: Brier GBM lebih rendah." },
            { text: "Tidak bisa dibandingkan tanpa kurva kalibrasi", why: "Kurva kalibrasi memberi detail, dan Brier sendiri sudah bisa dibandingkan untuk kualitas probabilistik — kecil lebih baik. Untuk klaim 'terkalibrasi', cek reliability diagram." },
          ],
        },
        {
          q: "Kenapa cross-validation lebih dipercaya daripada satu split train-test?",
          options: [
            { text: "Karena memakai lebih banyak data latih", why: "Tiap fold justru memakai lebih sedikit data latih (4 dari 5 fold) — bukan itu alasannya." },
            { text: "Karena satu split adalah satu undian; CV merata-ratakan lima skor", why: "Benar: tiap baris menjadi test tepat sekali, sehingga skor tidak tergantung keberuntungan satu split.", correct: true },
            { text: "Karena CV menghilangkan overfitting", why: "CV mendeteksi overfitting, bukan menghilangkannya — mitigasinya terpisah." },
            { text: "Karena CV selalu memberi skor lebih tinggi", why: "CV memberi skor yang lebih jujur — bisa lebih rendah dari satu split yang kebetulan mudah." },
          ],
        },
        {
          q: "Model dapat memiliki ROC-AUC tinggi tetapi probabilitasnya tidak terkalibrasi. Benar atau salah?",
          options: [
            { text: "Benar — ROC-AUC mengukur ranking, bukan kalibrasi", why: "Benar: urutan nasabah bisa tepat sementara angkanya tidak bisa dipercaya untuk expected loss; kalibrasi dicek terpisah dengan Brier dan reliability diagram.", correct: true },
            { text: "Salah — AUC tinggi selalu berarti probabilitasnya terkalibrasi", why: "Ranking dan kalibrasi adalah dua hal berbeda; AUC tinggi tidak menjamin angka probabilitasnya dapat dipercaya." },
            { text: "Salah — kalibrasi dan ranking adalah hal yang sama", why: "Keduanya berbeda: ranking soal urutan, kalibrasi soal apakah angka 0,8 benar-benar berarti peluang 80 persen." },
            { text: "Benar — karena Brier rendah otomatis mengikuti AUC tinggi", why: "Brier tidak otomatis mengikuti AUC: Brier mencampur discrimination dan calibration, dan model dengan AUC tinggi bisa punya Brier buruk bila probabilitasnya miscalibrated." },
          ],
        },
      ],
      summary: [
        "Accuracy paradox: model selalu-tidak-default 0,7788 akurat dengan recall 0.",
        "Precision-recall adalah tradeoff biaya: threshold 0,10 hemat biaya 39,7 persen [mini-case] vs 0,5.",
        "ROC-AUC GBM 0,7823 (lumayan); PR-AUC 0,5597 = 2,53 kali base rate 0,2212.",
        "Brier GBM 0,1342 vs LR 0,1427; cross-validation: lima skor, bukan satu undian.",
        "ROC-AUC mengukur ranking, bukan kalibrasi — probabilitas untuk expected loss dicek dengan reliability diagram.",
      ],
      next: { label: "Lanjut: MLF4 — Overfitting dan Underfitting", href: "/v2/learn/mlf4-overfitting-underfitting" },
    },
  ],
};
