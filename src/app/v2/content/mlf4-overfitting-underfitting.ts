import type { V2Lesson } from "../lib/types";

export const mlf4: V2Lesson = {
  slug: "mlf4-overfitting-underfitting",
  track: "Machine Learning Finance",
  module: "Foundations — ML end-to-end in finance",
  title: "MLF4 — Overfitting dan Underfitting: Diagnosis dan Obat",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Model yang sempurna di data latih bisa gagal total di data baru. Lesson ini mengajarkan diagnosisnya: bandingkan skor train dan test, baca learning curve, lalu pilih obat yang tepat — bukan sekadar mengecilkan model.",
        "Tujuan lesson ini:",
        "• Mendiagnosis overfitting dan underfitting dari gap train-test dengan angka nyata.",
        "• Membaca tiga learning curve: underfitting, good fit, overfitting.",
        "• Memilih mitigasi yang tepat: regularisasi, cross-validation, model lebih sederhana, data lebih banyak.",
        "• Menerapkan diagnosis pada angka notebook credit scoring (GBM train vs test).",
        "Isi lesson: cerita model yang hafal masa lalu → diagnosis gap train-test → underfitting → good fit → overfitting → 2 lab → peta keputusan → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan: GBM notebook train ROC-AUC 0,8469 vs test 0,7823 (gap 0,0646); polinomial lab: derajat 1, 3, dan 9 pada data sinus + noise.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Model yang hafal masa lalu, buta pada masa depan",
      prose: [
        "Sebuah desk trading membanggakan model sinyal dengan backtest nyaris sempurna: Sharpe 4,2, win rate 91 persen. Dua bulan live, model itu kehilangan 18 persen. Apa yang terjadi? Model tidak belajar pola pasar — ia menghafal noise masa lalu, termasuk tanggal-tanggal spesifik yang tidak akan terulang.",
        "Cerita yang sama terjadi di credit scoring — hanya lebih halus. Gradient Boosting di notebook mencapai ROC-AUC 0,8469 pada data latih dan 0,7823 pada data test. Gap 0,0646 itu bukan bencana — tapi ia sinyal: sebagian dari 0,8469 adalah hafalan, bukan pemahaman. Model yang sama, diuji pada krisis 2008 dengan data 2005, akan lebih parah lagi.",
        "Lesson ini mengajarkan membedakan hafalan dan pemahaman — dengan satu alat ukur (gap train-test) dan satu gambar (learning curve).",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: skor train tinggi berarti model bagus",
        type: "pitfall",
        body: "Yang benar: skor train hanya mengukur seberapa baik model menghafal data yang sudah dilihatnya. Yang menentukan adalah skor test — data yang belum pernah dilihat. Model dengan train 0,99 dan test 0,79 lebih buruk daripada model dengan train 0,91 dan test 0,88.",
      },
    },
    {
      id: "diagnosis",
      eyebrow: "Langkah 3 · Diagnosis: gap train-test",
      title: "Gap train-test: satu angka untuk mendiagnosis",
      prose: [
        "Diagnosis overfitting dimulai dari satu perbandingan: skor model pada data latih vs data test. Bila keduanya dekat dan tinggi, model belajar pola yang general. Bila train jauh lebih tinggi dari test, model menghafal. Bila keduanya rendah, model belum belajar apa-apa.",
        "Nilai: Gradient Boosting notebook — train ROC-AUC 0,8469, test ROC-AUC 0,7823. Gap = 0,8469 dikurangi 0,7823 = 0,0646. Band acuannya adalah rule of thumb yang dikalibrasi pada gap ROC-AUC (bukan ambang universal): gap di bawah 0,02 sehat; 0,02 sampai 0,05 ringan; 0,05 sampai 0,10 perlu perhatian; di atas 0,10 waspada — model menghafal terlalu banyak. Gap GBM 0,0646 masuk band perlu perhatian: model sedikit overfit, tapi masih layak dipakai dengan monitoring.",
        "Gambar di bawah menunjukkan kedua bar itu beserta gap-nya. Perhatikan: bar train lebih panjang, tapi tidak jauh lebih panjang. Itulah gambaran overfitting perlu perhatian — bukan model yang rusak, melainkan model yang perlu diawasi.",
        "Panel bawah gambar menunjukkan kebalikan dari diagnosis ini: leakage. Bila fitur mengandung informasi masa depan — misal saldo tunggakan setelah tanggal aplikasi — train tampak tinggi DAN test tampak tinggi, dan gap-nya kecil. Diagnosis gap gagal di sini: tidak ada yang terlihat salah, padahal model tidak pernah belajar pola yang bisa dipakai di masa depan. Gap kecil tidak selalu berarti model aman — leakage membuat gap kecil dan skor tinggi secara bersamaan. Satu-satunya pertahanan adalah audit fitur: tiap fitur harus bisa menjawab 'apakah informasi ini tersedia pada saat prediksi dibuat?'",
        "Baik atau buruk: gap 0,0646 baik dalam arti model masih general — test 0,7823 tetap lumayan (band ROC-AUC MLF3: 0,7–0,8 = lumayan; 0,8–0,9 = bagus). Gap yang sama akan buruk bila test-nya sendiri rendah — misal train 0,70 dan test 0,64: gap perlu perhatian, tapi modelnya lemah. Diagnosis selalu dua angka: gap DAN level test.",
        "Mitigasi: bila gap masuk band waspada, pilih dari menu mitigasi di langkah 6 — regularisasi, cross-validation untuk memilih kompleksitas, model lebih sederhana, atau data lebih banyak. Bila gap masuk band perlu perhatian seperti GBM, mitigasi yang proporsional adalah monitoring berkala yang lebih ketat (M7) — dan pertimbangkan regularisasi bila gap membesar; bukan membongkar model.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 360" role="img" aria-label="Dua bar ROC-AUC: train 0,8469, test 0,7823, gap 0,0646; plus panel leakage: fitur masa depan membuat train dan test tampak tinggi, gap kecil, tetapi bocor">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Gap train-test GBM: 0,8469 vs 0,7823</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,70</text>
<line x1="155.5" y1="206" x2="155.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="155.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<line x1="259.0" y1="206" x2="259.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,80</text>
<line x1="362.5" y1="206" x2="362.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="362.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,85</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,90</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">ROC-AUC</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)"></text>
<rect x="52.0" y="64" width="304.1" height="22" fill="var(--c1)"/>
<text x="52" y="57" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">train ROC-AUC 0,8469</text>
<rect x="52.0" y="134" width="170.4" height="22" fill="var(--c4)"/>
<text x="52" y="127" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">test ROC-AUC 0,7823</text>
<line x1="222.4" y1="64" x2="356.1" y2="64" stroke="var(--c2)" stroke-width="3"/>
<text x="289.2" y="56" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">gap 0,0646</text>
<text x="52" y="236" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Band: gap &lt; 0,02 sehat · 0,02–0,05 ringan · 0,05–0,10 perhatian · &gt; 0,10 waspada</text>
<line x1="52" y1="252" x2="466" y2="252" stroke="var(--chart-text)" stroke-width="1"/>
<text x="240.0" y="274" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Panel B — leakage: gap kecil, TAPI BOCOR</text>
<rect x="54" y="286" width="130" height="30" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/><text x="119" y="305" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">FITUR MASA DEPAN</text>
<rect x="200" y="286" width="130" height="30" rx="8" fill="none" stroke="var(--c3)" stroke-width="2"/><text x="265" y="305" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">TRAIN TAMPAK TINGGI</text>
<rect x="346" y="286" width="120" height="30" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/><text x="406" y="305" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">TEST TAMPAK TINGGI</text>
<line x1="184" y1="301" x2="200" y2="301" stroke="var(--chart-text)" stroke-width="1.5"/><polygon points="200,301 192,297 192,305" fill="var(--chart-text)"/>
<line x1="330" y1="301" x2="346" y2="301" stroke="var(--chart-text)" stroke-width="1.5"/><polygon points="346,301 338,297 338,305" fill="var(--chart-text)"/>
<text x="240" y="338" text-anchor="middle" font-size="10.5" fill="var(--text)" font-family="var(--font-ui)">Gap kecil tidak membuktikan model bebas leakage — audit fitur adalah satu-satunya pertahanan.</text>
</svg>`,
        alt: "Dua bar ROC-AUC: train 0,8469, test 0,7823, gap 0,0646; plus panel leakage: fitur masa depan membuat train dan test tampak tinggi, gap kecil, tetapi bocor.",
        caption: "Cara membaca: panjang bar = ROC-AUC; bracket kuning = gap 0,0646. Interpretasi: gap masuk band perlu perhatian (0,05–0,10) — model sedikit overfit, masih layak dipakai dengan monitoring. Panel B: leakage — fitur masa depan membuat train dan test tampak tinggi dengan gap kecil; diagnosis gap tidak bisa mendeteksinya.",
      },
      tasks: [],
      note: {
        title: "Tip: laporkan selalu berpasangan",
        body: "Satu skor tanpa pasangannya tidak bisa didiagnosis. Biasakan menulis train dan test berdampingan — 0,8469 vs 0,7823 — bukan satu angka saja. Kebiasaan ini menangkap overfitting sebelum model dipakai.",
      },
    },
    {
      id: "underfitting",
      eyebrow: "Langkah 4 · Underfitting",
      title: "Underfitting: model yang terlalu sederhana untuk polanya",
      prose: [
        "Underfitting berarti model terlalu sederhana untuk menangkap pola di data — atau fiturnya tidak cukup. Cirinya: skor train dan test sama-sama rendah, dan menambah data tidak membantu karena masalahnya bukan data, melainkan kapasitas model.",
        "Nilai: lab lesson ini memakai data sinus + noise (30 titik latih, 30 titik test). Polinomial derajat 1 — garis lurus — memberi train MSE 0,2276 dan test MSE 0,2435. Keduanya tinggi dan berdekatan: gap hanya 0,0159. Model ini tidak overfit; ia underfit — garis lurus tidak bisa mengikuti lengkung sinus. R²-nya: train 0,563, test 0,539 pada n = 30 — keduanya rendah.",
        "Gambar di bawah menunjukkan learning curve derajat 1: skor train dan test naik sedikit lalu mendatar di sekitar 0,5 sampai 0,6 saat data ditambah dari 10 ke 60. Plateau rendah seperti ini adalah tanda underfitting: data tambahan tidak memperbaiki apa-apa karena modelnya tidak mampu menangkap pola. Kurva ini menggenerate ulang data sinus untuk tiap ukuran n (bukan memakai ulang 30 titik lab); test set kurva adalah 60 titik terpisah — jadi R² di lesson ini berasal dari eksperimen kurva, sementara MSE berasal dari Lab 1 (test set 30 titik).",
        "Baik atau buruk: underfitting buruk bila pola yang dicari jelas ada tapi model tidak menangkapnya — seperti garis lurus untuk sinus. Underfitting bisa diterima sementara sebagai baseline: logistic regression di notebook (ROC-AUC 0,7426) adalah baseline yang lebih sederhana dibandingkan GBM (0,7823) — dan itu disengaja, sebagai pembanding.",
        "Jangan buru-buru menyebut sebuah model 'underfit' hanya karena skornya lebih rendah dari model lain. Cek dulu empat hal: apakah baseline-nya sudah benar (model yang lebih sederhana memang diharapkan kalah, tetapi seberapa jauh?); apakah feature set-nya sama (model yang kalah karena diberi fitur lebih sedikit bukan underfit — ia kekurangan informasi); apakah kebutuhan bisnisnya terpenuhi (LR 0,7426 [notebook] mungkin sudah cukup untuk keputusan yang diambil, dan kesederhanaannya adalah keuntungan); dan apakah hasil validasinya stabil (selisih yang muncul di satu split bisa hilang di split lain). 'Underfit relatif terhadap GBM' adalah deskripsi perbandingan, bukan vonis.",
        "Mitigasi: tambah fitur yang bermakna (misal fitur interaksi atau non-linear), pakai model lebih fleksibel (dari linear ke tree), atau kurangi regularisasi bila terlalu kuat. Jangan tambah data dulu — data tidak menyembuhkan model yang tidak mampu.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Underfitting: train dan test R2 sama-sama rendah sekitar 0,5 dan mendatar">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Learning curve: underfitting (derajat 1)</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">10</text>
<line x1="134.8" y1="206" x2="134.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="134.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">20</text>
<line x1="217.6" y1="206" x2="217.6" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="217.6" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">30</text>
<line x1="341.8" y1="206" x2="341.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="341.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">45</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">60</text>
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
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">ukuran data latih (n)</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">R²</text>
<polyline points="52.0,101.5 134.8,132.8 217.6,106.9 341.8,102.0 466.0,95.1" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="52.0" cy="101.5" r="3.5" fill="var(--c1)"/>
<circle cx="134.8" cy="132.8" r="3.5" fill="var(--c1)"/>
<circle cx="217.6" cy="106.9" r="3.5" fill="var(--c1)"/>
<circle cx="341.8" cy="102.0" r="3.5" fill="var(--c1)"/>
<circle cx="466.0" cy="95.1" r="3.5" fill="var(--c1)"/>
<polyline points="52.0,114.0 134.8,120.6 217.6,111.1 341.8,109.6 466.0,108.7" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<circle cx="52.0" cy="114.0" r="3.5" fill="var(--c4)"/>
<circle cx="134.8" cy="120.6" r="3.5" fill="var(--c4)"/>
<circle cx="217.6" cy="111.1" r="3.5" fill="var(--c4)"/>
<circle cx="341.8" cy="109.6" r="3.5" fill="var(--c4)"/>
<circle cx="466.0" cy="108.7" r="3.5" fill="var(--c4)"/>
<text x="449.4" y="85.1" text-anchor="end" font-size="10" fill="var(--c1)" font-family="var(--font-ui)" font-weight="600">train</text>
<text x="449.4" y="124.7" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">test</text>
</svg>`,
        alt: "Underfitting: train dan test R2 sama-sama rendah sekitar 0,5 dan mendatar.",
        caption: "Cara membaca: sumbu X = ukuran data latih, sumbu Y = R²; biru = train, oranye = test. Interpretasi: kedua kurva rendah dan mendatar — menambah data tidak membantu model yang terlalu sederhana.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: underfitting berarti data kurang",
        type: "pitfall",
        body: "Yang benar: underfitting berarti kapasitas kurang, bukan data kurang. Ciri pembedanya ada di learning curve: bila kedua kurva mendatar di level rendah saat data ditambah, masalahnya kapasitas — tambah fitur atau fleksibilitas, bukan baris data.",
      },
    },
    {
      id: "goodfit",
      eyebrow: "Langkah 5 · Good fit",
      title: "Good fit: kedua kurva konvergen di level tinggi",
      prose: [
        "Good fit berarti model cukup fleksibel untuk menangkap pola, tapi tidak cukup liar untuk menghafal noise. Cirinya: skor train dan test sama-sama tinggi dan konvergen saat data ditambah.",
        "Nilai: polinomial derajat 3 memberi train MSE 0,0170 dan test MSE 0,0223 — keduanya rendah dan berdekatan (gap 0,0053). MSE ini dari Lab 1 (test set 30 titik). R²-nya — train 0,967, test 0,941 pada n = 30 — berasal dari eksperimen learning curve (test set 60 titik terpisah, notebook cell 7): dua eksperimen, jadi MSE dan R² tidak dibandingkan angka-per-angka. Bandingkan dengan derajat 1 (MSE 0,2276 dan 0,2435): derajat 3 memangkas test MSE lebih dari sepuluh kali lipat (0,2435 dibagi 0,0223 sama dengan 10,92). Cross-validation 5-fold mengonfirmasi: CV MSE derajat 3 adalah 0,0250 — terendah di antara derajat 1, 2, 3, 5, dan 9.",
        "Gambar di bawah menunjukkan learning curve derajat 3: train dan test naik lalu konvergen di sekitar 0,94 saat data bertambah. Tidak ada gap yang melebar, tidak ada plateau rendah — inilah bentuk yang dicari.",
        "Baik atau buruk: good fit baik — model siap dipakai, dengan monitoring. Tapi good fit hari ini bukan jaminan besok: bila distribusi data berubah (drift), kurva test akan turun dan gap melebar. Itulah kenapa monitoring (M7) adalah bagian dari workflow, bukan tambahan.",
        "Mitigasi: tidak ada yang perlu diperbaiki — yang perlu dilakukan adalah mengunci konfigurasi ini (derajat, regularisasi, fitur) dan memonitornya. Godaan yang harus dilawan: menaikkan kompleksitas karena train masih bisa naik. Train yang naik tanpa test yang ikut naik adalah awal overfitting.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Good fit: train dan test R2 konvergen tinggi sekitar 0,94">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Learning curve: good fit (derajat 3)</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">10</text>
<line x1="134.8" y1="206" x2="134.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="134.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">20</text>
<line x1="217.6" y1="206" x2="217.6" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="217.6" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">30</text>
<line x1="341.8" y1="206" x2="341.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="341.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">45</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">60</text>
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
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">ukuran data latih (n)</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">R²</text>
<polyline points="52.0,31.9 134.8,34.9 217.6,35.8 341.8,38.1 466.0,38.4" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="52.0" cy="31.9" r="3.5" fill="var(--c1)"/>
<circle cx="134.8" cy="34.9" r="3.5" fill="var(--c1)"/>
<circle cx="217.6" cy="35.8" r="3.5" fill="var(--c1)"/>
<circle cx="341.8" cy="38.1" r="3.5" fill="var(--c1)"/>
<circle cx="466.0" cy="38.4" r="3.5" fill="var(--c1)"/>
<polyline points="52.0,42.7 134.8,41.4 217.6,40.4 341.8,40.6 466.0,41.1" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<circle cx="52.0" cy="42.7" r="3.5" fill="var(--c4)"/>
<circle cx="134.8" cy="41.4" r="3.5" fill="var(--c4)"/>
<circle cx="217.6" cy="40.4" r="3.5" fill="var(--c4)"/>
<circle cx="341.8" cy="40.6" r="3.5" fill="var(--c4)"/>
<circle cx="466.0" cy="41.1" r="3.5" fill="var(--c4)"/>
<text x="449.4" y="28.4" text-anchor="end" font-size="10" fill="var(--c1)" font-family="var(--font-ui)" font-weight="600">train</text>
<text x="449.4" y="57.1" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">test</text>
</svg>`,
        alt: "Good fit: train dan test R2 konvergen tinggi sekitar 0,94.",
        caption: "Cara membaca: sumbu X = ukuran data latih, sumbu Y = R². Interpretasi: kedua kurva konvergen di sekitar 0,94 — model menangkap pola tanpa menghafal noise.",
      },
      tasks: [],
      note: {
        title: "Tip: good fit adalah titik berhenti, bukan titik awal",
        body: "Begitu train dan test konvergen di level tinggi, berhenti menaikkan kompleksitas. Setiap kenaikan kompleksitas setelah titik ini membeli sedikit train dengan harga test — dan harga itu dibayar di produksi.",
      },
    },
    {
      id: "overfitting",
      eyebrow: "Langkah 6 · Overfitting",
      title: "Overfitting: train naik, test jatuh, gap melebar",
      prose: [
        "Overfitting berarti model terlalu fleksibel untuk datanya: ia menghafal noise beserta polanya. Cirinya: skor train terus naik saat kompleksitas naik, skor test naik dulu lalu jatuh, dan gap melebar.",
        "Nilai: polinomial derajat 9 pada data lab memberi train MSE 0,0106 — lebih rendah dari derajat 3 (0,0170) — tapi test MSE 0,0531, lebih dari dua kali lipat derajat 3 (0,0223). MSE ini dari Lab 1 (test set 30 titik). R²-nya — train 0,980 vs test 0,867, gap 0,113 — berasal dari eksperimen learning curve (test set 60 titik terpisah, notebook cell 7): dua eksperimen, jadi MSE dan R² tidak dibandingkan angka-per-angka. Yang membawa kesimpulan overfitting adalah CV: CV MSE derajat 9 adalah 1,4998, hampir 60 kali CV MSE derajat 3 (0,0250). Satu split menyembunyikan sebagian masalah; CV membongkarnya.",
        "Gambar di bawah menunjukkan learning curve derajat 9: train R² mendatar tinggi di sekitar 0,97–0,98, sementara test R² naik dari 0,371 pada n = 20 ke 0,940 pada n = 60 — gap menyusut dari 0,611 ke 0,028 saat data ditambah. Inilah bukti visual bahwa data lebih banyak menyembuhkan overfitting. Kurva dimulai dari n = 20 karena pada n = 10, test R² derajat 9 adalah −1.643,555: sepuluh parameter yang dipasang pada sepuluh titik menghafal total dan hancur di data test — nilainya di luar skala gambar.",
        "Baik atau buruk: overfitting buruk bila test jatuh di bawah kebutuhan bisnis — model menghafal masa lalu dan gagal di masa depan. Overfitting pada level ini (seperti GBM notebook, gap 0,0646) masih bisa diterima dengan monitoring. Yang berbahaya adalah overfitting yang tidak terdiagnosis karena hanya train yang dilaporkan.",
        "Mitigasi: empat obat, dari yang paling murah: (1) regularisasi — penalti pada koefisien besar; di lab, ridge dengan lambda 1,0 menurunkan test MSE derajat 9 dari 0,0531 ke 0,0425 — hemat 20,0 persen. (2) Cross-validation untuk memilih kompleksitas — CV memilih derajat 3, bukan 9. (3) Model lebih sederhana — turunkan derajat. (4) Data lebih banyak — gap menyusut saat n bertambah. Early stopping adalah obat kelima untuk model iteratif.",
        "Obat per model — karena mitigasi yang tepat bergantung pada modelnya. Logistic regression: regularisasi L1/L2 (penalti pada koefisien) dan seleksi fitur. Tree dan gradient boosting: batasi kedalaman (max depth), turunkan learning rate, batasi jumlah estimator, dan early stopping pada validation. Di semua model: kontrol leakage (audit fitur, jangan imputasi/scaling sebelum split) dan validasi temporal (latih masa lalu, uji masa depan). Tuning yang sistematis — memilih nilai-nilai ini dengan prosedur, bukan tebakan — adalah materi M6.",
      ],
      formula: String.raw`\text{ridge: } \min_w \sum (y_i - \hat{y}_i)^2 + \lambda \sum w_j^2`,
      formulaNote: "Ridge menambahkan penalti lambda kali jumlah kuadrat koefisien ke fungsi loss. Lambda besar memaksa koefisien kecil — model lebih halus, kurang menghafal. Lambda = 0 berarti tanpa regularisasi.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Overfitting: train R2 mendatar tinggi sekitar 0,97, test R2 naik dari 0,371 ke 0,940 saat data ditambah; gap menyusut">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Learning curve: overfitting (derajat 9)</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">20</text>
<line x1="155.5" y1="206" x2="155.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="155.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">30</text>
<line x1="310.8" y1="206" x2="310.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="310.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">45</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">60</text>
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
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">ukuran data latih (n)</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">R²</text>
<polyline points="52.0,33.2 155.5,33.5 310.8,36.0 466.0,35.6" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="52.0" cy="33.2" r="3.5" fill="var(--c1)"/>
<circle cx="155.5" cy="33.5" r="3.5" fill="var(--c1)"/>
<circle cx="310.8" cy="36.0" r="3.5" fill="var(--c1)"/>
<circle cx="466.0" cy="35.6" r="3.5" fill="var(--c1)"/>
<polyline points="52.0,140.7 155.5,53.4 310.8,41.8 466.0,40.6" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<circle cx="52.0" cy="140.7" r="3.5" fill="var(--c4)"/>
<circle cx="155.5" cy="53.4" r="3.5" fill="var(--c4)"/>
<circle cx="310.8" cy="41.8" r="3.5" fill="var(--c4)"/>
<circle cx="466.0" cy="40.6" r="3.5" fill="var(--c4)"/>
<text x="449.4" y="25.6" text-anchor="end" font-size="10" fill="var(--c1)" font-family="var(--font-ui)" font-weight="600">train 0,968</text>
<text x="449.4" y="56.6" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">test 0,940 — gap 0,028</text>
<text x="60" y="190" font-size="9.5" fill="var(--text)" font-family="var(--font-ui)">Notebook GBM: train 0,8469 vs test 0,7823 (gap 0,0646)</text>
</svg>`,
        alt: "Overfitting: train R2 mendatar tinggi sekitar 0,97, test R2 naik dari 0,371 ke 0,940 saat data ditambah; gap menyusut dari 0,611 ke 0,028.",
        caption: "Cara membaca: sumbu X = ukuran data latih, sumbu Y = R²; biru = train, oranye = test. Interpretasi: train mendatar di ~0,97 sementara test naik dari 0,371 (n = 20) ke 0,940 (n = 60) — gap menyusut dari 0,611 ke 0,028. Kurva dimulai dari n = 20: pada n = 10 test R² derajat 9 adalah −1.643,555 (di luar skala). Notebook GBM: train 0,8469 vs test 0,7823 (gap 0,0646).",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: overfitting hanya soal model besar",
        type: "pitfall",
        body: "Yang benar: overfitting adalah soal rasio kompleksitas terhadap data. Model kecil pun overfit bila datanya sangat sedikit — polinomial derajat 9 dengan 10 titik latih memberi test R² negatif. Yang menentukan adalah keseimbangan, bukan ukuran absolut.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab: polinomial derajat 1, 3, 9 — lihat kurva U-nya",
      prose: [
        "Fungsi bantu sudah disediakan: polyfit (least squares via normal equations), mse, dan make_data (sinus + noise, seed tetap). Tugasmu: uji tiga derajat dan baca bentuk U pada test MSE — turun dari derajat 1 ke 3, naik lagi ke 9.",
      ],
      tasks: [
        { id: "t1", text: "Ubah daftar derajat menjadi [1, 3, 9]" },
        { id: "t2", text: "Jalankan dan catat train MSE dan test MSE tiap derajat" },
        { id: "t3", text: "Jawab: derajat mana yang underfit, good fit, dan overfit?" },
      ],
      expected: "derajat 1: train MSE=0.2276 test MSE=0.2435\nderajat 3: train MSE=0.0170 test MSE=0.0223\nderajat 9: train MSE=0.0106 test MSE=0.0531",
      hints: [
        "Test MSE membentuk U: tinggi di derajat 1, terendah di 3, naik lagi di 9.",
        "Train MSE turun terus — ia tidak bisa mendiagnosis apa-apa sendirian.",
      ],
      code: {
        starter: `import math, random

def polyfit(xs, ys, deg, lam=0.0):
    # Least squares via normal equations + Gaussian elimination
    m = deg + 1
    A = [[sum(x ** (i + j) for x in xs) for j in range(m)] for i in range(m)]
    b = [sum(y * x ** i for x, y in zip(xs, ys)) for i in range(m)]
    for i in range(m):
        A[i][i] += lam if i > 0 else 0.0
    # solve A w = b
    for col in range(m):
        piv = max(range(col, m), key=lambda r: abs(A[r][col]))
        A[col], A[piv] = A[piv], A[col]
        b[col], b[piv] = b[piv], b[col]
        for r in range(col + 1, m):
            f = A[r][col] / A[col][col]
            for c in range(col, m):
                A[r][c] -= f * A[col][c]
            b[r] -= f * b[col]
    w = [0.0] * m
    for i in range(m - 1, -1, -1):
        w[i] = (b[i] - sum(A[i][j] * w[j] for j in range(i + 1, m))) / A[i][i]
    return w

def polypredict(w, x):
    return sum(c * x ** i for i, c in enumerate(w))

def mse(w, xs, ys):
    return sum((polypredict(w, x) - y) ** 2 for x, y in zip(xs, ys)) / len(xs)

def make_data(n, seed):
    rng = random.Random(seed)
    xs = [rng.uniform(0, 2 * math.pi) for _ in range(n)]
    ys = [math.sin(x) + rng.gauss(0, 0.15) for x in xs]
    return xs, ys

xtr, ytr = make_data(30, 42)
xte, yte = make_data(30, 7)
for deg in [1]:  # TODO: uji derajat 1, 3, dan 9
    w = polyfit(xtr, ytr, deg)
    print(f"derajat {deg}: train MSE={mse(w, xtr, ytr):.4f} test MSE={mse(w, xte, yte):.4f}")`,
        lockLines: 37,
        solution: `import math, random

def polyfit(xs, ys, deg, lam=0.0):
    # Least squares via normal equations + Gaussian elimination
    m = deg + 1
    A = [[sum(x ** (i + j) for x in xs) for j in range(m)] for i in range(m)]
    b = [sum(y * x ** i for x, y in zip(xs, ys)) for i in range(m)]
    for i in range(m):
        A[i][i] += lam if i > 0 else 0.0
    # solve A w = b
    for col in range(m):
        piv = max(range(col, m), key=lambda r: abs(A[r][col]))
        A[col], A[piv] = A[piv], A[col]
        b[col], b[piv] = b[piv], b[col]
        for r in range(col + 1, m):
            f = A[r][col] / A[col][col]
            for c in range(col, m):
                A[r][c] -= f * A[col][c]
            b[r] -= f * b[col]
    w = [0.0] * m
    for i in range(m - 1, -1, -1):
        w[i] = (b[i] - sum(A[i][j] * w[j] for j in range(i + 1, m))) / A[i][i]
    return w

def polypredict(w, x):
    return sum(c * x ** i for i, c in enumerate(w))

def mse(w, xs, ys):
    return sum((polypredict(w, x) - y) ** 2 for x, y in zip(xs, ys)) / len(xs)

def make_data(n, seed):
    rng = random.Random(seed)
    xs = [rng.uniform(0, 2 * math.pi) for _ in range(n)]
    ys = [math.sin(x) + rng.gauss(0, 0.15) for x in xs]
    return xs, ys

xtr, ytr = make_data(30, 42)
xte, yte = make_data(30, 7)
for deg in [1, 3, 9]:
    w = polyfit(xtr, ytr, deg)
    print(f"derajat {deg}: train MSE={mse(w, xtr, ytr):.4f} test MSE={mse(w, xte, yte):.4f}")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "derajat 1: train MSE=0\\.2276 test MSE=0\\.2435", label: "Output menampilkan MSE derajat 1", msg: "Derajat 1: train dan test sama-sama tinggi — underfitting." },
          { kind: "stdout_matches", task: "t2", pattern: "derajat 3: train MSE=0\\.0170 test MSE=0\\.0223", label: "Output menampilkan MSE derajat 3", msg: "Derajat 3: test MSE terendah — good fit." },
          { kind: "stdout_matches", task: "t2", pattern: "derajat 9: train MSE=0\\.0106 test MSE=0\\.0531", label: "Output menampilkan MSE derajat 9", msg: "Derajat 9: train terendah tapi test naik — overfitting." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab: 5-fold CV memilih derajat, ridge menjinakkan derajat 9",
      prose: [
        "Satu split bisa menipu — lab ini mengulang evaluasi lima kali (5-fold CV) untuk tiap derajat, lalu menguji satu obat overfitting: ridge dengan lambda 1,0 pada derajat 9. Perhatikan CV MSE derajat 9: jauh lebih buruk dari test MSE satu splitnya. Itulah kenapa CV dipakai untuk memilih.",
      ],
      tasks: [
        { id: "t1", text: "Jalankan CV dan catat derajat dengan CV MSE terendah" },
        { id: "t2", text: "Tambahkan ridge lam=1.0 pada `w9r`" },
        { id: "t3", text: "Bandingkan test MSE derajat 9 tanpa vs dengan ridge" },
      ],
      expected: "derajat 1: CV MSE=0.2877\nderajat 2: CV MSE=0.2625\nderajat 3: CV MSE=0.0250\nderajat 5: CV MSE=0.0453\nderajat 9: CV MSE=1.4998\nderajat 9 tanpa ridge: test MSE=0.0531\nderajat 9 ridge lam=1: test MSE=0.0425",
      hints: [
        "CV MSE terendah ada di derajat 3 — bukan 9, bukan 1.",
        "Ridge: polyfit(xtr, ytr, 9, lam=1.0) — penalti pada koefisien besar.",
      ],
      code: {
        starter: `import math, random

def polyfit(xs, ys, deg, lam=0.0):
    # Least squares via normal equations + Gaussian elimination
    m = deg + 1
    A = [[sum(x ** (i + j) for x in xs) for j in range(m)] for i in range(m)]
    b = [sum(y * x ** i for x, y in zip(xs, ys)) for i in range(m)]
    for i in range(m):
        A[i][i] += lam if i > 0 else 0.0
    # solve A w = b
    for col in range(m):
        piv = max(range(col, m), key=lambda r: abs(A[r][col]))
        A[col], A[piv] = A[piv], A[col]
        b[col], b[piv] = b[piv], b[col]
        for r in range(col + 1, m):
            f = A[r][col] / A[col][col]
            for c in range(col, m):
                A[r][c] -= f * A[col][c]
            b[r] -= f * b[col]
    w = [0.0] * m
    for i in range(m - 1, -1, -1):
        w[i] = (b[i] - sum(A[i][j] * w[j] for j in range(i + 1, m))) / A[i][i]
    return w

def polypredict(w, x):
    return sum(c * x ** i for i, c in enumerate(w))

def mse(w, xs, ys):
    return sum((polypredict(w, x) - y) ** 2 for x, y in zip(xs, ys)) / len(xs)

def make_data(n, seed):
    rng = random.Random(seed)
    xs = [rng.uniform(0, 2 * math.pi) for _ in range(n)]
    ys = [math.sin(x) + rng.gauss(0, 0.15) for x in xs]
    return xs, ys

xtr, ytr = make_data(30, 42)
xte, yte = make_data(30, 7)
# 5-fold CV untuk tiap derajat
def kfold_cv(xs, ys, deg, k=5, lam=0.0):
    idx = list(range(len(xs)))
    folds = [idx[i::k] for i in range(k)]
    errs = []
    for f in folds:
        te = set(f)
        trx = [x for i, x in enumerate(xs) if i not in te]
        try_ = [y for i, y in enumerate(ys) if i not in te]
        tex = [x for i, x in enumerate(xs) if i in te]
        tey = [y for i, y in enumerate(ys) if i in te]
        w = polyfit(trx, try_, deg, lam)
        errs.append(mse(w, tex, tey))
    return sum(errs) / len(errs)

for deg in [1, 2, 3, 5, 9]:
    print(f"derajat {deg}: CV MSE={kfold_cv(xtr, ytr, deg):.4f}")
w9 = polyfit(xtr, ytr, 9)
w9r = polyfit(xtr, ytr, 9)  # TODO: tambah lam=1.0 (ridge)
print(f"derajat 9 tanpa ridge: test MSE={mse(w9, xte, yte):.4f}")
print(f"derajat 9 ridge lam=1: test MSE={mse(w9r, xte, yte):.4f}")`,
        lockLines: 55,
        solution: `import math, random

def polyfit(xs, ys, deg, lam=0.0):
    # Least squares via normal equations + Gaussian elimination
    m = deg + 1
    A = [[sum(x ** (i + j) for x in xs) for j in range(m)] for i in range(m)]
    b = [sum(y * x ** i for x, y in zip(xs, ys)) for i in range(m)]
    for i in range(m):
        A[i][i] += lam if i > 0 else 0.0
    # solve A w = b
    for col in range(m):
        piv = max(range(col, m), key=lambda r: abs(A[r][col]))
        A[col], A[piv] = A[piv], A[col]
        b[col], b[piv] = b[piv], b[col]
        for r in range(col + 1, m):
            f = A[r][col] / A[col][col]
            for c in range(col, m):
                A[r][c] -= f * A[col][c]
            b[r] -= f * b[col]
    w = [0.0] * m
    for i in range(m - 1, -1, -1):
        w[i] = (b[i] - sum(A[i][j] * w[j] for j in range(i + 1, m))) / A[i][i]
    return w

def polypredict(w, x):
    return sum(c * x ** i for i, c in enumerate(w))

def mse(w, xs, ys):
    return sum((polypredict(w, x) - y) ** 2 for x, y in zip(xs, ys)) / len(xs)

def make_data(n, seed):
    rng = random.Random(seed)
    xs = [rng.uniform(0, 2 * math.pi) for _ in range(n)]
    ys = [math.sin(x) + rng.gauss(0, 0.15) for x in xs]
    return xs, ys

xtr, ytr = make_data(30, 42)
xte, yte = make_data(30, 7)
# 5-fold CV untuk tiap derajat
def kfold_cv(xs, ys, deg, k=5, lam=0.0):
    idx = list(range(len(xs)))
    folds = [idx[i::k] for i in range(k)]
    errs = []
    for f in folds:
        te = set(f)
        trx = [x for i, x in enumerate(xs) if i not in te]
        try_ = [y for i, y in enumerate(ys) if i not in te]
        tex = [x for i, x in enumerate(xs) if i in te]
        tey = [y for i, y in enumerate(ys) if i in te]
        w = polyfit(trx, try_, deg, lam)
        errs.append(mse(w, tex, tey))
    return sum(errs) / len(errs)

for deg in [1, 2, 3, 5, 9]:
    print(f"derajat {deg}: CV MSE={kfold_cv(xtr, ytr, deg):.4f}")
w9 = polyfit(xtr, ytr, 9)
w9r = polyfit(xtr, ytr, 9, lam=1.0)
print(f"derajat 9 tanpa ridge: test MSE={mse(w9, xte, yte):.4f}")
print(f"derajat 9 ridge lam=1: test MSE={mse(w9r, xte, yte):.4f}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "derajat 3: CV MSE=0\\.0250", label: "Output menampilkan CV MSE derajat 3 = 0.0250", msg: "CV memilih derajat 3 — terendah dari kelimanya." },
          { kind: "stdout_matches", task: "t1", pattern: "derajat 9: CV MSE=1\\.4998", label: "Output menampilkan CV MSE derajat 9 = 1.4998", msg: "CV membongkar derajat 9: hampir 60 kali lebih buruk dari derajat 3." },
          { kind: "stdout_matches", task: "t3", pattern: "derajat 9 ridge lam=1: test MSE=0\\.0425", label: "Output menampilkan ridge test MSE 0.0425", msg: "Ridge menurunkan test MSE derajat 9 dari 0,0531 ke 0,0425." },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: dari diagnosis ke obat",
      prose: [
        "Train dan test sama-sama rendah dan mendatar saat data ditambah? Underfitting — tambah fitur atau fleksibilitas, kurangi regularisasi. Jangan tambah data dulu.",
        "Train dan test tinggi dan konvergen? Good fit — kunci konfigurasi, monitor berkala, lawan godaan menaikkan kompleksitas.",
        "Train tinggi, test jatuh, gap melebar? Overfitting — mulai dari yang termurah: regularisasi, lalu cross-validation untuk memilih kompleksitas, lalu model lebih sederhana, lalu data lebih banyak.",
        "Gap kecil tapi test rendah? Modelnya lemah, bukan overfit — kembali ke fitur dan framing masalah.",
        "Gap besar tapi test masih memenuhi kebutuhan bisnis? Overfitting perlu perhatian — pakai dengan monitoring ketat, jadwalkan retraining, dan catat di model card.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: dua model, satu kursi produksi",
      prose: [
        "Tim risiko harus memilih satu model credit scoring untuk produksi. Model A: train ROC-AUC 0,91, test 0,88. Model B: train 0,99, test 0,79. Keduanya dilatih pada data yang sama dan diuji pada test set yang sama.",
        "Diagnosis Model A: gap = 0,91 dikurangi 0,88 = 0,03 — masuk band ringan (0,02 sampai 0,05). Level test 0,88 — bagus (band 0,8 sampai 0,9). Model A general dengan baik.",
        "Diagnosis Model B: gap = 0,99 dikurangi 0,79 = 0,20 — masuk band waspada (di atas 0,10). Level test 0,79 — lumayan, tapi 9 poin di bawah Model A (0,88 dikurangi 0,79 = 0,09). Model B menghafal: train nyaris sempurna, test tertinggal jauh.",
        "Keputusan: kirim Model A ke produksi. Model B tidak dipakai apa adanya — obatnya: regularisasi lebih kuat, cross-validation untuk memilih kompleksitas, atau data lebih banyak. Bila setelah diobati test-nya menyalip 0,88, barulah B dipertimbangkan lagi. Pelajaran mini-case ini: pilih model berdasarkan test, bukan train — dan gap adalah alat diagnosisnya, bukan hiasan laporan.",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab: diagnosis overfitting pada model kredit",
      prose: [
        "Lesson web ini mengajarkan diagnosis dan obatnya. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf4-guided-task.ipynb.",
        "Di notebook itu kamu mendiagnosis overfitting pada model kredit: membandingkan skor train dan test di beberapa kompleksitas, menggambar learning curve sendiri, menjalankan cross-validation, mencoba regularisasi, dan menuliskan keputusan: model mana yang dikirim ke produksi dan kenapa.",
        "Tautan Colab:",
        "Buka di Colab: https://colab.research.google.com/drive/17BciDZh3v1NoDvnqtN2miDRlg5JU7Sq-",
        "Jalur file notebook: colab/mlf4-guided-task.ipynb.",
        "Companion full-code untuk topik yang memetakan ke proyek nyata: notebook credit scoring end-to-end di Colab: https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO — gap train-test GBM 0,8469 vs 0,7823 di lesson ini berasal dari notebook itu.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint: hafalan vs pemahaman",
      prose: [
        "Rangkuman: diagnosis = gap train-test + level test. GBM notebook: gap 0,0646 (perlu perhatian), test 0,7823 (lumayan). Underfitting: kedua skor rendah dan mendatar. Good fit: konvergen tinggi. Overfitting: train naik, test jatuh, gap melebar — CV MSE derajat 9 (1,4998) vs derajat 3 (0,0250). Obat: regularisasi, CV, model sederhana, data lebih banyak.",
      ],
      tasks: [],
      quiz: [
        {
          q: "GBM notebook: train ROC-AUC 0,8469, test 0,7823. Bagaimana diagnosisnya?",
          options: [
            { text: "Overfitting perlu perhatian (gap 0,0646)", why: "Benar: gap 0,8469 − 0,7823 = 0,0646 masuk band perlu perhatian 0,05–0,10; test 0,7823 tetap lumayan.", correct: true },
            { text: "Overfitting berat (gap 0,0646)", why: "Berat adalah di atas 0,10 — 0,0646 belum sampai." },
            { text: "Underfitting (gap 0,0646)", why: "Underfitting cirinya kedua skor rendah — test 0,7823 tidak rendah." },
            { text: "Sehat sempurna (gap 0,0646)", why: "Sehat adalah gap di bawah 0,02 — 0,0646 di atas itu." },
          ],
        },
        {
          q: "Polinomial derajat 1: train MSE 0,2276, test MSE 0,2435. Diagnosisnya?",
          options: [
            { text: "Underfitting — kedua MSE tinggi dan berdekatan", why: "Benar: gap hanya 0,0159 tapi levelnya tinggi — garis lurus tidak menangkap lengkung sinus.", correct: true },
            { text: "Overfitting — test lebih tinggi dari train", why: "Test sedikit lebih tinggi dari train adalah hal biasa; overfitting butuh train jauh lebih baik dari test — model menghafal latih tapi gagal di test." },
            { text: "Good fit — train dan test berdekatan", why: "Berdekatan saja tidak cukup: keduanya harus rendah. 0,2276 dan 0,2435 sama-sama tinggi." },
            { text: "Tidak bisa didiagnosis tanpa R²", why: "MSE saja sudah cukup: kedua MSE tinggi berarti model tidak menangkap pola." },
          ],
        },
        {
          q: "Polinomial derajat 9: train MSE 0,0106, test MSE 0,0531. Apa artinya?",
          options: [
            { text: "Overfitting — test 5 kali train", why: "Benar: 0,0531 dibagi 0,0106 = 5,01 — train jauh lebih baik dari test, dan CV MSE 1,4998 mengonfirmasi.", correct: true },
            { text: "Good fit — train MSE terendah", why: "Train terendah saja bukan good fit; test-nya naik dibanding derajat 3 (0,0223)." },
            { text: "Underfitting — test MSE masih di atas 0,05", why: "Underfitting cirinya kedua skor buruk; train 0,0106 sangat baik — masalahnya gap, bukan kapasitas." },
            { text: "Data kurang — tambah data pasti menyembuhkan", why: "Data membantu, tapi CV MSE 1,4998 menunjukkan kompleksitasnya sendiri yang bermasalah." },
          ],
        },
        {
          q: "CV MSE: derajat 1 = 0,2877; derajat 3 = 0,0250; derajat 9 = 1,4998. Derajat mana yang dipilih CV?",
          options: [
            { text: "Derajat 3 (CV MSE 0,0250)", why: "Benar: CV MSE terendah — hampir 60 kali lebih baik dari derajat 9.", correct: true },
            { text: "Derajat 9 (train MSE terendah)", why: "CV tidak memakai train MSE — ia memakai skor validasi berulang, dan derajat 9 terburuk di sana." },
            { text: "Derajat 1 (paling sederhana)", why: "Paling sederhana bukan berarti terbaik: CV MSE 0,2877 sebelas kali lebih buruk dari derajat 3." },
            { text: "Tidak ada — CV MSE semuanya buruk", why: "0,0250 adalah CV MSE yang baik untuk data ini; derajat 3 jelas pemenangnya." },
          ],
        },
        {
          q: "Ridge lambda 1,0 menurunkan test MSE derajat 9 dari 0,0531 ke 0,0425. Berapa penghematannya?",
          options: [
            { text: "20,0 persen", why: "Benar: (0,0531 − 0,0425) dibagi 0,0531 = 0,1996, sekitar 20,0 persen.", correct: true },
            { text: "10,0 persen", why: "Hitung: selisihnya 0,0106 — itu seperlima dari 0,0531, bukan sepersepuluh." },
            { text: "0,0106 persen", why: "0,0106 adalah selisih absolutnya, bukan persentase — persentasenya 20,0 persen." },
            { text: "Tidak ada penghematan karena test MSE masih di atas derajat 3", why: "Ridge memang tidak mengalahkan derajat 3 (0,0223) — tapi ia memperbaiki derajat 9 sebesar 20,0 persen." },
          ],
        },
        {
          q: "Model overfit terdiagnosis. Manakah yang BUKAN mitigasi overfitting?",
          options: [
            { text: "Menambah data latih", why: "Menambah data adalah mitigasi: gap menyusut saat n bertambah." },
            { text: "Menyederhanakan model", why: "Menyederhanakan model adalah mitigasi: kurangi kapasitas yang menghafal." },
            { text: "Menaikkan kompleksitas model", why: "Benar: menaikkan kompleksitas memperparah overfitting — train naik, test jatuh.", correct: true },
            { text: "Menambah regularisasi", why: "Regularisasi adalah mitigasi: penalti pada koefisien besar." },
          ],
        },
        {
          q: "Gap train-test kecil selalu berarti model aman. Benar atau salah?",
          options: [
            { text: "Salah — leakage membuat gap kecil dan skor tinggi", why: "Benar: bila fitur bocor dari masa depan, train dan test sama-sama tampak tinggi; gap tidak bisa mendeteksi leakage — hanya audit fitur yang bisa.", correct: true },
            { text: "Benar — gap kecil berarti model tidak menghafal", why: "Gap kecil berarti model tidak menghafal data latih — tetapi leakage bukan menghafal; ia bocoran informasi yang membuat kedua skor tampak tinggi." },
            { text: "Salah — gap kecil berarti underfitting", why: "Gap kecil dengan kedua skor tinggi adalah good fit; underfitting cirinya kedua skor rendah." },
            { text: "Benar — asalkan test set-nya besar", why: "Test set besar tidak membantu bila test-nya ikut bocor; leakage merusak train dan test sekaligus." },
          ],
        },
      ],
      summary: [
        "Diagnosis = gap train-test + level test: GBM gap 0,0646 (perlu perhatian).",
        "Underfitting: kedua skor rendah dan mendatar; good fit: konvergen tinggi; overfitting: train naik, test jatuh.",
        "CV memilih derajat 3 (0,0250) atas derajat 9 (1,4998); ridge menghemat 20,0 persen pada derajat 9.",
        "Gap kecil tidak selalu berarti aman — leakage membuat gap kecil dan skor tinggi; audit fitur adalah pertahanannya.",
        "M1 selesai: tiga tipe ML, statistik baca hasil, metrik jujur, diagnosis overfitting — fondasi untuk M2 credit scoring.",
      ],
      next: { label: "Lanjut: MLF-M2.1 — Supervised & Logistic Regression", href: "/v2/learn/mlf-m21-supervised-logistic-regression" },
    },
  ],
};
