import type { V2Lesson } from "../lib/types";

export const mlfL05: V2Lesson = {
  slug: "mlf-l05-ab-testing",
  track: "Machine Learning Finance",
  module: "Data Foundations — prasyarat M1",
  title: "L0.5 — A/B Testing: dari Hipotesis ke Keputusan",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "L0.1 sampai L0.4 menyiapkan data. Lesson ini menyiapkan keputusan: bagaimana tahu apakah perubahanmu benar-benar bekerja, atau hanya kebetulan yang tampak meyakinkan.",
        "Tujuan lesson ini:",
        "• Merumuskan hipotesis nol dan alternatif, lalu membaca p-value dengan benar — termasuk apa yang BUKAN arti p-value.",
        "• Memakai interval kepercayaan untuk menilai BESAR efek, bukan hanya ada-tidaknya.",
        "• Menghitung power dan ukuran sampel SEBELUM eksperimen — bukan sesudah kecewa.",
        "• Mengenali dua jebakan yang paling mahal: peeking dan multiple testing.",
        "• Memeriksa desain eksperimen sebelum membaca hasil: randomisasi, unit eksperimen, keseimbangan kovariat, dan SRM.",
        "Isi lesson: cerita skor baru yang 'naik' → hipotesis dan p-value → signifikansi dan interval kepercayaan → power dan ukuran sampel → peeking dan multiple testing → 2 lab → peta keputusan → mini-case bisnis → guided task di Colab → checkpoint.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Approval naik 12 persen ke 14,5 persen — nyata atau kebetulan?",
      prose: [
        "Tim kredit meluncurkan skor baru. Setelah 1.000 penawaran di kelompok lama (A) dan 1.000 di kelompok baru (B), approval rate naik dari 12,0 persen menjadi 14,5 persen — selisih 2,5 poin. Tim bersorak: skor baru bekerja. Lalu seseorang bertanya: 'Dengan 1.000 penawaran per kelompok, seberapa yakin kita bahwa selisih 2,5 poin ini bukan kebetulan?'",
        "Pertanyaan itu adalah seluruh isi lesson ini. Selisih 2,5 poin terasa besar — tapi pada 1.000 penawaran, goyangan acak antar kelompok bisa mencapai angka yang sama. A/B testing adalah cara menjawab pertanyaan itu dengan angka, bukan dengan sorakan.",
        "Di akhir lesson, kamu akan tahu: p-value-nya 0,0992 (tidak signifikan pada 0,05), interval kepercayaannya mencakup nol, power-nya hanya 38 persen, dan ukuran sampel yang dibutuhkan untuk jawaban yang meyakinkan adalah 2.884 per kelompok. Skor baru itu mungkin bekerja — tapi eksperimen ini belum membuktikannya.",
      ],
      tasks: [],
      note: {
        title: "Tip: laporkan efek + CI, bukan hanya p",
        body: "Satu angka p-value tidak bercerita tentang besar efek. 'Selisih 2,5 poin, 95% CI (−0,47 poin, 5,47 poin), p = 0,0992' bercerita lengkap: efeknya mungkin 5,47 poin, mungkin nol, mungkin negatif kecil. Selalu laporkan ketiganya: estimasi, interval, dan p-value.",
      },
    },
    {
      id: "hipotesis",
      eyebrow: "Langkah 3 · Hipotesis dan p-value",
      title: "Hipotesis dan p-value: apa yang sebenarnya diuji",
      prose: [
        "A/B testing dimulai sebelum data dikumpulkan: rumuskan hipotesis nol (H0: tidak ada beda antara A dan B) dan hipotesis alternatif (H1: ada beda). Lalu kumpulkan data, hitung statistik uji, dan tanyakan: bila H0 benar, seberapa aneh data yang saya lihat? Jawaban atas pertanyaan itu adalah p-value.",
        "Nilai: A: 120 dari 1.000 disetujui (12,0 persen); B: 145 dari 1.000 (14,5 persen); selisih 0,0250 (2,5 poin) [lab]. Proporsi gabungan (pooled) 0,1325; standard error 0,015162; z sama dengan 1,6489; p-value dua sisi 0,0992. Dengan alpha 0,05 yang didaftarkan sebelum eksperimen: 0,0992 lebih besar dari 0,05 — gagal tolak H0. Hasilnya tidak signifikan.",
        "Gambar di bawah menunjukkan kurva H0: z hitung 1,65 jatuh SEBELUM batas kritis 1,96 — di daerah 'gagal tolak'. Area di luar plus-minus 1,65 adalah p-value 0,0992: peluang melihat selisih sebesar ini (atau lebih besar) bila H0 benar.",
        "Baik atau buruk: p-value baik bila dibaca sebagai apa adanya — peluang data se-ekstrem ini bila H0 benar. P-value buruk bila dibaca sebagai 'peluang H0 benar' (itu bukan artinya) atau 'peluang efeknya nyata' (juga bukan). P-value 0,0992 berarti: bila skor baru TIDAK berbeda, selisih 2,5 poin seperti ini akan muncul sekitar 10 persen dari waktu — cukup sering untuk tidak menyimpulkan apa-apa.",
        "Mitigasi: daftarkan alpha SEBELUM melihat data (0,05 adalah konvensi, bukan hukum — yang penting ia ditetapkan dulu). Jangan ubah alpha sesudah melihat p-value. Dan jangan pernah menulis 'p = 0,0992 berarti tidak ada efek' — yang benar adalah 'tidak cukup bukti untuk menyatakan ada efek'.",
        "Satu hal yang membuat p-value di atas bermakna: randomisasi. Eksperimen ini mengacak 2.000 penawaran ke A (1.000) dan B (1.000) — tiap penawaran punya peluang 50 persen masuk A atau B. Unit eksperimennya adalah satu penawaran — bukan satu nasabah (bila satu nasabah mengajukan berkali-kali, penawarannya berkorelasi dan unit yang benar adalah nasabah, bukan penawaran). Sebelum membaca hasil, jalankan checklist pra-analisis: (1) randomisasi benar — penugasan memang acak, bukan berdasarkan urutan datang atau cabang; (2) keseimbangan kovariat — A dan B mirip dalam income, keterlambatan, dan wilayah (bila tidak mirip, randomisasinya gagal atau sampelnya terlalu kecil); (3) tidak ada kebocoran antar-kelompok — satu nasabah tidak boleh muncul di A dan B sekaligus, dan kelompok B tidak boleh 'belajar' dari kelompok A; (4) cek SRM (sample ratio mismatch) — perbandingan jumlah yang masuk A vs B harus sesuai rasio yang dirancang (di sini 1.000 vs 1.000). Bila salah satu gagal, p-value sesudahnya tidak bisa dipercaya — desain yang rusak tidak bisa diperbaiki oleh statistik.",
      ],
      formula: String.raw`z = \frac{\hat{p}_B - \hat{p}_A}{\sqrt{\bar{p}(1-\bar{p})\left(\frac{1}{n_A} + \frac{1}{n_B}\right)}}`,
      formulaNote: "Statistik uji z untuk dua proporsi: selisih dibagi standard error-nya. p-bar adalah proporsi gabungan (pooled) kedua kelompok: (120 + 145) dibagi 2.000 sama dengan 0,1325.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Kurva H0: z hitung 1,65 jatuh sebelum batas kritis 1,96">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Kurva H0: z hitung vs batas kritis</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<polyline points="52.0,205.7 81.6,204.3 111.1,199.3 140.7,185.5 161.4,167.1 199.9,114.1 229.4,72.2 259.0,54.4 288.6,72.2 318.1,114.1 356.6,167.1 374.9,183.8 377.3,185.5 406.9,199.3 436.4,204.3 466.0,205.7" fill="none" stroke="var(--c1)" stroke-width="2"/>
<line x1="356.6" y1="167.1" x2="356.6" y2="206" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="356.6" y="160" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">z hitung 1,65</text>
<line x1="374.9" y1="183.8" x2="374.9" y2="206" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="374.9" y="176" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">kritis 1,96</text>
<line x1="161.4" y1="167.1" x2="161.4" y2="206" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="161.4" y="160" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−1,96</text>
<text x="259.0" y="222" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">z hitung 1,65 &lt; 1,96 — gagal tolak H0 · p = 0,0992</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">area di luar ±1,65 adalah p-value (9,92%)</text>
</svg>`,
        alt: "Kurva H0: z hitung 1,65 jatuh sebelum batas kritis 1,96.",
        caption: "Cara membaca: kurva adalah distribusi z bila H0 benar; garis putus-putus adalah z hitung (1,65) dan batas kritis (±1,96). Interpretasi: z hitung belum melewati batas — gagal tolak H0 pada alpha 0,05.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: p-value adalah peluang H0 benar",
        type: "pitfall",
        body: "Yang benar: p-value adalah P(data se-ekstrem ini | H0 benar) — peluang data, dengan asumsi H0 benar. Bukan P(H0 benar | data). Membalik keduanya adalah kesalahan yang paling umum dalam statistik — dan yang paling mahal, karena ia mengubah 'tidak cukup bukti' menjadi 'terbukti tidak ada efek'.",
      },
    },
    {
      id: "signifikansi",
      eyebrow: "Langkah 4 · Signifikansi dan interval kepercayaan",
      title: "Signifikansi dan CI: sebesar apa efeknya?",
      prose: [
        "Signifikansi menjawab 'apakah efeknya nyata?' Interval kepercayaan (CI) menjawab 'sebesar apa efeknya?' — dan pertanyaan kedua sering lebih penting untuk keputusan bisnis.",
        "Nilai: selisih 0,0250 dengan 95% CI (−0,0047, 0,0547) [lab] — intervalnya mencakup 0, yang konsisten dengan p sama dengan 0,0992 (tidak signifikan). Bacaan CI-nya: efek sebenarnya bisa 5,47 poin (bagus sekali), bisa 0 (tidak ada), bisa −0,47 poin (sedikit merugikan). Interval yang lebar ini adalah cerminan ukuran sampel: 1.000 per kelompok belum cukup untuk mempersempitnya. CI di sini memakai SE pooled yang sama dengan uji-z; konvensi umum memakai SE unpooled — bedanya di sini tidak terlihat setelah pembulatan.",
        "Baik atau buruk: CI yang sempit dan tidak mencakup 0 baik — efeknya nyata DAN besarnya diketahui. CI yang lebar dan mencakup 0 buruk untuk keputusan — ia tidak membuktikan 'tidak ada efek', ia membuktikan 'kita belum tahu'. Kesalahan paling umum: membaca 'tidak signifikan' sebagai 'tidak ada efek'. Yang benar: 'tidak signifikan' berarti data ini tidak cukup untuk membedakan efek dari nol.",
        "Mitigasi: selalu laporkan CI bersama p-value. Bila CI mencakup 0 tapi batas atasnya besar (5,47 poin di sini), jangan buang ide itu — tambah sampel. Bila CI sempit dan mencakup 0 (misal −0,001 sampai 0,002), barulah kamu boleh berkata efeknya praktis nol.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: tidak signifikan berarti tidak ada efek",
        type: "pitfall",
        body: "Yang benar: 'tidak signifikan' berarti 'data ini tidak cukup untuk membedakan efek dari nol' — bukan 'efeknya nol'. Dengan CI (−0,0047, 0,0547), efek 5,47 poin masih mungkin. Membuang skor baru berdasarkan eksperimen ini sama salahnya dengan meluncurkannya.",
      },
    },
    {
      id: "power",
      eyebrow: "Langkah 5 · Power dan ukuran sampel",
      title: "Power: hitung sampel SEBELUM eksperimen",
      prose: [
        "Power adalah peluang eksperimenmu mendeteksi efek bila efek itu memang ada. Eksperimen dengan power rendah adalah undian yang mahal: bila ia gagal menemukan efek, kamu tidak tahu apakah efeknya tidak ada atau eksperimenmu yang buta.",
        "Nilai: dengan n sama dengan 1.000 per kelompok dan efek sebenarnya 2,5 poin, power-nya 0,378 (38 persen) [lab] — bila skor baru benar-benar menaikkan approval 2,5 poin, eksperimen ini hanya punya peluang 38 persen untuk mendeteksinya. Band power-nya kontinu: di bawah 80 persen lemah; 80 persen ke atas memadai. Rinciannya: 50 sampai di bawah 80 persen lemah; di bawah 50 persen sangat lemah — eksperimen ini sangat lemah. Ukuran sampel untuk power 80 persen: 2.884 per kelompok [lab] — hampir tiga kali lipat dari yang dipakai. Dengan z dibulatkan (1,96 dan 0,84) hasilnya 2.884; dengan kuantil eksak 2.887 — bedanya tidak material.",
        "Gambar di bawah membandingkan keduanya: batang pertama power 38 persen (n sama dengan 1.000), batang kedua 80 persen (n sama dengan 2.884) dengan garis target 80 persen.",
        "Baik atau buruk: power 80 persen ke atas baik — itu standar yang dipakai sebelum eksperimen. Power 38 persen buruk bila disadari sesudahnya — eksperimen sudah jalan, uang sudah keluar, dan hasilnya tidak bisa menjawab pertanyaan. Power buruk bila dihitung sesudah melihat hasil (post-hoc power) — itu hanya transformasi p-value, bukan informasi baru.",
        "Mitigasi: hitung ukuran sampel SEBELUM eksperimen — dari efek terkecil yang penting secara bisnis (di sini 2,5 poin), alpha (0,05), dan power target (80 persen). Bila sampel yang dibutuhkan tidak terjangkau, ubah desainnya: efek yang lebih besar, metrik yang lebih sensitif, atau durasi yang lebih panjang — jangan jalankan eksperimen yang sudah diketahui buta.",
      ],
      formula: String.raw`n = \frac{2\bar{p}(1-\bar{p})(z_{1-\alpha/2} + z_{1-\beta})^2}{\delta^2}`,
      formulaNote: "Ukuran sampel per kelompok (pendekatan normal): p-bar adalah proporsi gabungan (0,1325); z 1,96 untuk alpha 0,05; z 0,84 untuk power 80 persen; delta adalah efek yang ingin dideteksi (0,0250). Hasilnya 2.884 per kelompok.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Dua batang power: n 1000 memberi 38 persen, n 2884 memberi 80 persen">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Power: n = 1.000 vs n = 2.884 per kelompok</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="44" y="173.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">20</text>
<text x="44" y="138.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">40</text>
<text x="44" y="103.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">60</text>
<text x="44" y="68.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">80</text>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">100</text>
<line x1="52" y1="65.2" x2="466" y2="65.2" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="462" y="58" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">target 80%</text>
<rect x="98.6" y="139.1" width="113.9" height="66.9" fill="var(--c4)"/>
<text x="155.5" y="133.1" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">38%</text>
<text x="155.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n = 1.000</text>
<rect x="305.6" y="65.2" width="113.9" height="140.8" fill="var(--c1)"/>
<text x="362.5" y="59.2" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">80%</text>
<text x="362.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n = 2.884</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">power (%) — efek 2,5 poin, alpha 0,05</text>
</svg>`,
        alt: "Dua batang power: n 1000 memberi 38 persen, n 2884 memberi 80 persen.",
        caption: "Cara membaca: tinggi bar = power dalam persen; garis putus-putus adalah target 80 persen. Interpretasi: dengan 1.000 per kelompok, eksperimen ini hanya punya peluang 38 persen mendeteksi efek 2,5 poin — sangat lemah.",
      },
      tasks: [],
      note: {
        title: "Tip: hitung n sebelum eksperimen",
        body: "Rumus ukuran sampel butuh tiga input: efek terkecil yang penting secara bisnis, alpha, dan power target. Tiga input itu adalah keputusan bisnis, bukan angka statistik — 2,5 poin penting karena bernilai Rp125 juta per 10.000 penawaran (lihat mini-case).",
      },
    },
    {
      id: "peeking",
      eyebrow: "Langkah 6 · Peeking dan multiple testing",
      title: "Peeking dan multiple testing: dua cara merusak alpha",
      prose: [
        "Alpha 0,05 berarti: bila H0 benar, peluang satu uji menghasilkan false positive adalah 5 persen. Tapi bila kamu menguji berkali-kali — mengintip hasil tiap hari, atau menguji 5 metrik sekaligus — peluang false positive-nya bukan lagi 5 persen.",
        "Nilai: simulasi A/A [lab] — kedua kelompok sama-sama 12 persen (tidak ada efek), 2.000 simulasi, seed 7. Satu cek di akhir: false positive 0,049 (sesuai alpha 0,05). Mengintip 5 kali (pada n kumulatif 200, 400, 600, 800, 1.000 per kelompok) dan berhenti begitu ada yang signifikan: false positive 0,145 — hampir tiga kali lipat alpha. Untuk 5 uji yang BERBEDA dan independen tanpa koreksi, peluang family-wise error-nya 1 dikurangi 0,95 pangkat 5 sama dengan 0,2262 (22,6 persen) — lebih besar dari 0,145, karena intipan-intipan peeking memakai data yang sama (berkorelasi), sedangkan 5 uji independen tidak. Koreksi Bonferroni untuk 5 uji: alpha per uji sama dengan 0,05 dibagi 5 sama dengan 0,01.",
        "Baik atau buruk: satu cek di akhir dengan alpha yang didaftarkan baik — false positive-nya 5 persen seperti yang dijanjikan. Peeking buruk — ia mengubah 5 persen menjadi 14,5 persen tanpa mengubah apa pun kecuali frekuensi melihat. Menguji 5 metrik dan melaporkan yang signifikan saja buruk — 22,6 persen peluang salah satu 'signifikan' padahal tidak ada efek.",
        "Mitigasi: tiga cara. Pertama, daftarkan satu cek di akhir dan patuhi — jangan intip. Kedua, bila harus mengintip, pakai metode sequential (alpha spending) yang membagi alpha antar intipan. Ketiga, bila menguji banyak metrik, koreksi: Bonferroni (alpha dibagi jumlah uji) untuk yang sederhana, Holm untuk yang sedikit lebih kuat. Dan laporkan SEMUA uji yang dilakukan — bukan hanya yang signifikan.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab 1 — Uji z dua proporsi dan CI",
      prose: [
        "Kerjakan uji A/B pada data cerita: A 120 dari 1.000, B 145 dari 1.000. Hitung proporsi tiap kelompok, selisihnya, standard error (pooled), z, p-value dua sisi, dan 95% CI selisihnya — lalu simpulkan pada alpha 0,05.",
        "Empat tugas: hitung proporsi dan selisih; hitung SE pooled dan z; hitung p-value (dari erf) dan CI, lalu simpulkan pada alpha 0,05; dan cek SRM [ilustrasi] pada penugasan 1.060 vs 940 — apakah randomisasinya bermasalah?",
      ],
      tasks: [
        { id: "t1", text: "Hitung p_A, p_B, selisih, dan proporsi gabungan (pooled)." },
        { id: "t2", text: "Hitung SE pooled dan z — lalu p-value dua sisi (1 − erf(|z| / akar 2))." },
        { id: "t3", text: "Hitung 95% CI selisih (selisih ± 1,96 × SE) dan simpulkan pada alpha 0,05." },
        { id: "t4", text: "Cek SRM [ilustrasi]: penugasan yang dirancang 1.000 vs 1.000, yang masuk A 1.060 dan B 940 — hitung z dan p-value SRM-nya, lalu simpulkan: apakah randomisasinya bermasalah?" },
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Randomisasi: 2000 penawaran diacak ke A 1000 dan B 1000; unit eksperimen satu penawaran">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Randomisasi: 2.000 penawaran → A 1.000 dan B 1.000</text>
<rect x="140" y="34" width="200" height="28" fill="var(--c1)"/>
<text x="240.0" y="52" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">populasi — 2.000 penawaran</text>
<line x1="240" y1="62" x2="130" y2="84" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="240" y1="62" x2="350" y2="84" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="60" y="84" width="140" height="40" fill="var(--c1)"/>
<text x="130.0" y="101" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">A (lama)</text>
<text x="130.0" y="117" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1.000 penawaran</text>
<rect x="280" y="84" width="140" height="40" fill="var(--c2)"/>
<text x="350.0" y="101" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">B (baru)</text>
<text x="350.0" y="117" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1.000 penawaran</text>
<text x="240.0" y="150" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">unit eksperimen: satu penawaran — tiap penawaran punya peluang 50% masuk A atau B</text>
<text x="240.0" y="176" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">checklist pra-analisis: randomisasi benar · kovariat seimbang · tanpa kebocoran antar-kelompok</text>
<text x="240.0" y="192" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">· cek SRM (sample ratio mismatch) sebelum membaca hasil</text>
<text x="240.0" y="218" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">bila satu nasabah mengajukan berkali-kali, unit yang benar adalah nasabah, bukan penawaran</text>
</svg>`,
        alt: "Randomisasi: 2000 penawaran diacak ke A 1000 dan B 1000; unit eksperimen satu penawaran.",
        caption: "Cara membaca: populasi diacak menjadi dua kelompok yang sama besar; tiap penawaran punya peluang 50 persen masuk A atau B. Interpretasi: randomisasi yang benar membuat A dan B sebanding — dan checklist pra-analisis (termasuk SRM) memastikan randomisasi itu benar-benar terjadi.",
      },
      expected: "p_A: 0.1200\np_B: 0.1450\nselisih: 0.0250\nSE: 0.0152\nz: 1.6489\np-value: 0.0992\nCI bawah: -0.0047\nCI atas: 0.0547\nkesimpulan: tidak signifikan pada alpha 0,05\nSRM z: 2.68\nSRM p: 0.0073",
      code: {
        starter: `import math
# A/B test: kelompok lama (A) vs skor baru (B).
n_a, x_a = 1000, 120
n_b, x_b = 1000, 145
p_a = 0.0  # TODO: proporsi A
p_b = 0.0  # TODO: proporsi B
diff = 0.0  # TODO: selisih p_B - p_A
p_pool = 0.0  # TODO: proporsi gabungan (x_a + x_b) / (n_a + n_b)
se = 0.0  # TODO: SE pooled = akar(p_pool * (1 - p_pool) * (1/n_a + 1/n_b))
z = 0.0  # TODO: z = diff / se
p = 0.0  # TODO: p-value dua sisi = 1 - erf(|z| / akar(2))
ci_lo = 0.0  # TODO: diff - 1,96 * se
ci_hi = 0.0  # TODO: diff + 1,96 * se
kesimpulan = "TODO"  # TODO: "tidak signifikan pada alpha 0,05" atau "signifikan pada alpha 0,05"
print(f"p_A: {p_a:.4f}")
print(f"p_B: {p_b:.4f}")
print(f"selisih: {diff:.4f}")
print(f"SE: {se:.4f}")
print(f"z: {z:.4f}")
print(f"p-value: {p:.4f}")
print(f"CI bawah: {ci_lo:.4f}")
print(f"CI atas: {ci_hi:.4f}")
print(f"kesimpulan: {kesimpulan}")
# SRM [ilustrasi]: penugasan yang dirancang 1.000 vs 1.000.
n_a_srm = 1060  # jumlah yang masuk A
n_b_srm = 940  # jumlah yang masuk B
z_srm = 0.0  # TODO: z SRM = (p_A - 0,5) / SE0, SE0 = akar(0,25 / (n_a + n_b))
p_srm = 0.0  # TODO: p-value dua sisi dari z SRM
print(f"SRM z: {z_srm:.2f}")
print(f"SRM p: {p_srm:.4f}")`,
        lockLines: 4,
        solution: `import math
# A/B test: kelompok lama (A) vs skor baru (B).
n_a, x_a = 1000, 120
n_b, x_b = 1000, 145
p_a = x_a / n_a
p_b = x_b / n_b
diff = p_b - p_a
p_pool = (x_a + x_b) / (n_a + n_b)
se = math.sqrt(p_pool * (1 - p_pool) * (1 / n_a + 1 / n_b))
z = diff / se
p = 1 - math.erf(abs(z) / math.sqrt(2))
ci_lo = diff - 1.96 * se
ci_hi = diff + 1.96 * se
if p < 0.05:
    kesimpulan = "signifikan pada alpha 0,05"
else:
    kesimpulan = "tidak signifikan pada alpha 0,05"
n_a_srm = 1060
n_b_srm = 940
n_srm = n_a_srm + n_b_srm
p_a_srm = n_a_srm / n_srm
se0_srm = math.sqrt(0.25 / n_srm)
z_srm = (p_a_srm - 0.5) / se0_srm
p_srm = 1 - math.erf(abs(z_srm) / math.sqrt(2))
print(f"p_A: {p_a:.4f}")
print(f"p_B: {p_b:.4f}")
print(f"selisih: {diff:.4f}")
print(f"SE: {se:.4f}")
print(f"z: {z:.4f}")
print(f"p-value: {p:.4f}")
print(f"CI bawah: {ci_lo:.4f}")
print(f"CI atas: {ci_hi:.4f}")
print(f"kesimpulan: {kesimpulan}")
print(f"SRM z: {z_srm:.2f}")
print(f"SRM p: {p_srm:.4f}")`,
        checks: [
          { kind: "equal", task: "p_A = 0,1200", value: 0.12, tol: 0.0001, name: "p_a", label: "`p_a` seharusnya 0.12", msg: "p_A = 0,1200" },
          { kind: "equal", task: "p_B = 0,1450", value: 0.145, tol: 0.0001, name: "p_b", label: "`p_b` seharusnya 0.145", msg: "p_B = 0,1450" },
          { kind: "equal", task: "selisih = 0,0250", value: 0.025, tol: 0.0001, name: "diff", label: "`diff` seharusnya 0.025", msg: "selisih = 0,0250" },
          { kind: "equal", task: "SE = 0,0152", value: 0.0152, tol: 0.0001, name: "se", label: "`se` seharusnya 0.0152", msg: "SE = 0,0152" },
          { kind: "equal", task: "z = 1,6489", value: 1.6489, tol: 0.0001, name: "z", label: "`z` seharusnya 1.6489", msg: "z = 1,6489" },
          { kind: "equal", task: "p-value = 0,0992", value: 0.0992, tol: 0.0001, name: "p", label: "`p` seharusnya 0.0992", msg: "p-value = 0,0992" },
          { kind: "equal", task: "CI bawah = −0,0047", value: -0.0047, tol: 0.0001, name: "ci_lo", label: "`ci_lo` seharusnya -0.0047", msg: "CI bawah = −0,0047" },
          { kind: "equal", task: "CI atas = 0,0547", value: 0.0547, tol: 0.0001, name: "ci_hi", label: "`ci_hi` seharusnya 0.0547", msg: "CI atas = 0,0547" },
          { kind: "equal", task: "SRM z = 2,68", value: 2.68, tol: 0.01, name: "z_srm", label: "`z_srm` seharusnya 2.68", msg: "SRM z = 2,68" },
          { kind: "equal", task: "SRM p = 0,0073", value: 0.0073, tol: 0.0001, name: "p_srm", label: "`p_srm` seharusnya 0.0073", msg: "SRM p = 0,0073" },
          { kind: "stdout_matches", task: "laporan lab lengkap tercetak", pattern: "p_A: 0.1200\\np_B: 0.1450\\nselisih: 0.0250\\nSE: 0.0152\\nz: 1.6489\\np-value: 0.0992\\nCI bawah: -0.0047\\nCI atas: 0.0547\\nkesimpulan: tidak signifikan pada alpha 0,05\\nSRM z: 2.68\\nSRM p: 0.0073", label: "Output menampilkan p_A: 0.1200", msg: "Bandingkan tiap baris output dengan expected di atas." },
        ],
      },
      hints: [
        "SE pooled memakai proporsi gabungan: akar(0,1325 × 0,8675 × (1/1000 + 1/1000)).",
        "P-value dua sisi dari z: 1 − erf(|z| / akar(2)) — math.erf tersedia.",
        "CI 95%: selisih ± 1,96 × SE.",
        "SRM: SE0 = akar(0,25 / 2.000) = 0,01118; z = (0,530 − 0,5) / 0,01118 = 2,68; p = 0,0073 — di bawah 0,05: randomisasi bermasalah, selidiki sebelum membaca hasil.",
      ],
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab 2 — Power, ukuran sampel, dan Bonferroni",
      prose: [
        "Kerjakan perencanaan eksperimen: hitung power eksperimen yang sudah jalan (n sama dengan 1.000 per kelompok), ukuran sampel untuk power 80 persen, family-wise error rate 5 uji tanpa koreksi, dan alpha Bonferroni-nya.",
        "Tiga tugas: hitung power dengan pendekatan normal (fungsi Phi disediakan); hitung n per grup untuk power 80 persen; hitung FWER 5 uji dan alpha Bonferroni.",
      ],
      tasks: [
        { id: "t1", text: "Hitung power: peluang mendeteksi efek 2,5 poin dengan n 1.000 per kelompok." },
        { id: "t2", text: "Hitung n per grup untuk power 80 persen (bulatkan ke atas)." },
        { id: "t3", text: "Hitung FWER 5 uji tanpa koreksi dan alpha Bonferroni per uji." },
      ],
      expected: "power: 0.378\nn per grup untuk power 80%: 2884\nFWER 5 uji: 0.226\nalpha Bonferroni 5 uji: 0.010",
      code: {
        starter: `import math
# Perencanaan: p1 = 0,12 (A), p2 = 0,145 (B), n = 1000 per kelompok.
p1, p2, n = 0.12, 0.145, 1000
delta = p2 - p1
p_bar = (p1 + p2) / 2
def phi(x):
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))
se_alt = 0.0  # TODO: SE di bawah alternatif = akar(p1*(1-p1)/n + p2*(1-p2)/n)
power = 0.0  # TODO: Phi(delta/se_alt - 1,96) + Phi(-delta/se_alt - 1,96)
n_req = 0  # TODO: ceil(2 * p_bar * (1 - p_bar) * (1,96 + 0,84)^2 / delta^2)
fwer = 0.0  # TODO: 1 - 0,95^5
alpha_bonf = 0.0  # TODO: 0,05 / 5
print(f"power: {power:.3f}")
print(f"n per grup untuk power 80%: {n_req}")
print(f"FWER 5 uji: {fwer:.3f}")
print(f"alpha Bonferroni 5 uji: {alpha_bonf:.3f}")`,
        lockLines: 7,
        solution: `import math
# Perencanaan: p1 = 0,12 (A), p2 = 0,145 (B), n = 1000 per kelompok.
p1, p2, n = 0.12, 0.145, 1000
delta = p2 - p1
p_bar = (p1 + p2) / 2
def phi(x):
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))
se_alt = math.sqrt(p1 * (1 - p1) / n + p2 * (1 - p2) / n)
power = phi(delta / se_alt - 1.96) + phi(-delta / se_alt - 1.96)
n_req = math.ceil(2 * p_bar * (1 - p_bar) * (1.96 + 0.84) ** 2 / delta ** 2)
fwer = 1 - 0.95 ** 5
alpha_bonf = 0.05 / 5
print(f"power: {power:.3f}")
print(f"n per grup untuk power 80%: {n_req}")
print(f"FWER 5 uji: {fwer:.3f}")
print(f"alpha Bonferroni 5 uji: {alpha_bonf:.3f}")`,
        checks: [
          { kind: "equal", task: "power = 0,378", value: 0.378, tol: 0.001, name: "power", label: "`power` seharusnya 0.378", msg: "power = 0,378" },
          { kind: "equal", task: "n per grup = 2884", value: 2884, name: "n_req", label: "`n_req` seharusnya 2884", msg: "n per grup = 2884" },
          { kind: "equal", task: "FWER 5 uji = 0,226", value: 0.226, tol: 0.001, name: "fwer", label: "`fwer` seharusnya 0.226", msg: "FWER 5 uji = 0,226" },
          { kind: "equal", task: "alpha Bonferroni = 0,010", value: 0.01, tol: 0.001, name: "alpha_bonf", label: "`alpha_bonf` seharusnya 0.01", msg: "alpha Bonferroni = 0,010" },
          { kind: "stdout_matches", task: "laporan lab lengkap tercetak", pattern: "power: 0.378\\nn per grup untuk power 80%: 2884\\nFWER 5 uji: 0.226\\nalpha Bonferroni 5 uji: 0.010", label: "Output menampilkan power: 0.378", msg: "Bandingkan tiap baris output dengan expected di atas." },
        ],
      },
      hints: [
        "Power pendekatan normal: Phi(delta/SE − 1,96) + Phi(−delta/SE − 1,96) — suku kedua hampir nol di sini.",
        "Rumus n: 2 × p-bar × (1 − p-bar) × (1,96 + 0,84) pangkat 2, dibagi delta pangkat 2 — lalu ceil.",
        "FWER: 1 − 0,95 pangkat 5. Bonferroni: 0,05 dibagi 5.",
      ],
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan A/B testing",
      prose: [
        "Empat pertanyaan berurutan — dari sebelum eksperimen sampai sesudahnya:",
        "• Sebelum: daftarkan hipotesis, alpha (0,05), metrik utama (satu), dan ukuran sampel dari power 80 persen; acak penugasannya dan rencanakan cek SRM serta keseimbangan kovariat. Bila sampel tidak terjangkau, ubah desain — jangan jalankan eksperimen buta.",
        "• Selama: jangan intip. Satu cek di akhir. Bila harus intip, pakai alpha spending.",
        "• Sesudah: baca ketiganya — estimasi efek (2,5 poin), CI (−0,0047, 0,0547), dan p-value (0,0992). Bila CI mencakup 0 dan batas atasnya besar, tambah sampel — jangan buang ide dan jangan luncurkan.",
        "• Banyak uji: laporkan SEMUA uji yang dilakukan. Koreksi Bonferroni (alpha dibagi jumlah uji) bila melaporkan banyak metrik.",
        "• Peta pemilihan uji — outcome-nya apa? Biner (disetujui/tidak): perbandingan proporsi (uji-z dua proporsi, lesson ini). Kontinu (income, tagihan): perbandingan mean — atau alternatif robust (median, Mann-Whitney) bila distribusinya miring (L0.3). Count/rate (jumlah klaim per bulan): metode count-rate — bukan uji proporsi, karena penyebutnya waktu, bukan orang. Observasi berulang level user (satu nasabah banyak transaksi): agregasi ke level user, atau pakai unit yang tepat — jangan perlakukan 10 transaksi satu nasabah sebagai 10 observasi independen. Dan aturan yang mengikat semuanya: unit inferensi harus sama dengan unit randomisasi — bila yang diacak adalah penawaran, yang diuji adalah penawaran; bila yang diacak adalah nasabah, yang diuji adalah nasabah. Teori formal tiap uji (asumsi, derivasi, uji nonparametrik lengkap) adalah materi Track A — di sini cukup peta pemilihannya.",
        "Dan satu aturan yang mengikat semuanya: keputusan bisnis memakai efek dan CI, bukan p-value saja. 'Tidak signifikan' bukan vonis mati — ia adalah perintah untuk mengumpulkan lebih banyak bukti.",
        "Peta L0 → M1–M9 — tiap lesson L0 adalah fondasi satu bagian pipeline ML. Cleaning (L0.1) → input validation, data preparation, reproducibility: tanpa audit cleaning, tidak ada yang bisa direproduksi. Missing/imputasi (L0.2) → preprocessing dan sensitivity analysis: pilihan imputasi diuji di M6, indikator missing diaudit di M7. Distribusi/outlier (L0.3) → feature diagnosis dan pilihan transform/robust-summary: fitur yang tidak dipahami bentuknya tidak bisa dimodelkan dengan benar. Wrangling (L0.4) → feature table, agregasi, join, time structure: satu baris per nasabah adalah grain yang dipakai seluruh modul M2–M9. A/B testing (L0.5) → evaluasi eksperimental perubahan kebijakan/model: tiap perubahan model di M6–M8 yang memengaruhi keputusan bisnis diuji seperti eksperimen di lesson ini. Motivasi: M2 memakai fondasi ini untuk credit scoring (PD/LGD/EAD, scorecard, reject inference); M3 untuk fraud (unsupervised, network analysis, alert triage); M4 untuk market risk (VaR, GARCH, regime); M5–M6 untuk optimasi dan tuning; M7 untuk fairness dan monitoring; M8 untuk model risk dan deployment; M9 untuk simulasi dan validasi. L0 tidak mengajarkan materi modul-modul itu — ia memastikan kamu tidak membangunnya di atas data yang belum diperiksa.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case — Keputusan bisnis Rp125 juta",
      prose: [
        "Kembali ke cerita: selisih 2,5 poin, tidak signifikan (p sama dengan 0,0992), CI (−0,0047, 0,0547). Sekarang terjemahkan ke rupiah [ilustrasi]: lift 2,5 poin dikali 10.000 penawaran sama dengan 250 pinjaman tambahan; dikali margin Rp500.000 sama dengan Rp125.000.000. Tapi CI-nya dalam pinjaman adalah (−47, 547) — dalam rupiah (−Rp23.500.000, Rp273.500.000). Efek sebenarnya bisa Rp273,5 juta keuntungan, bisa Rp23,5 juta kerugian.",
        "Keputusan yang benar: JANGAN luncurkan berdasarkan point estimate Rp125 juta — intervalnya mencakup kerugian. Dan JANGAN buang skor baru itu — batas atas Rp273,5 juta terlalu besar untuk diabaikan. Keputusan yang benar adalah perpanjang eksperimen sampai n sama dengan 2.884 per kelompok, lalu putuskan dengan CI yang sudah menyempit.",
        "Perhatikan apa yang dilakukan mini-case ini: ia memakai CI, bukan p-value, untuk keputusan. P-value hanya berkata 'belum cukup bukti'. CI berkata 'berapa besar taruhannya' — dan taruhan Rp273,5 juta vs Rp23,5 juta adalah informasi yang cukup untuk memutuskan 'lanjutkan eksperimen', bukan 'luncurkan' atau 'buang'.",
        "Tabel keputusan 4 sel — signifikansi × makna bisnis: (1) signifikan + bermakna bisnis → luncurkan; (2) signifikan tapi terlalu kecil → jangan luncurkan — contoh [ilustrasi]: selisih 0,3 poin dengan CI (0,001, 0,005) — signifikan (CI tidak mencakup 0), tapi hanya 30 pinjaman tambahan dari 10.000 penawaran × Rp500.000 = Rp15 juta — lebih kecil dari biaya peluncuran; (3) tidak signifikan tapi CI mencakup upside besar → perpanjang eksperimen — mini-case ini: CI −0,0047 sampai 0,0547 berarti −47 sampai 547 pinjaman, yaitu −Rp23,5 juta sampai Rp273,5 juta — batas atasnya terlalu besar untuk dibuang; (4) CI mencakup downside material → jangan luncurkan, atau perpanjang dengan guardrail — contoh [ilustrasi]: selisih −0,5 poin dengan CI (−0,030, 0,020) — downside-nya −0,030 × 10.000 × Rp500.000 = −Rp150 juta. Yang menentukan bukan p-value-nya — melainkan CI dalam rupiah dan biaya keputusannya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung: CI selisih (−0,0047, 0,0547) dikali 10.000 penawaran dikali Rp500.000 — berapa interval rupiahnya?" },
        { id: "t2", text: "Jelaskan kenapa keputusan yang benar adalah 'perpanjang eksperimen', bukan 'luncurkan' atau 'buang'." },
      ],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab — Simulasi A/A dan perencanaan",
      prose: [
        "Di Colab, kamu menjalankan simulasi A/A sendiri: 2.000 simulasi, seed 7, dua kelompok yang sama-sama 12 persen — sekali-cek vs peeking 5 kali — dan membuktikan sendiri bahwa false positive naik dari 0,049 menjadi 0,145. Lalu kamu merencanakan eksperimen berikutnya: dari efek 2,5 poin, hitung n untuk power 80 persen, dan tulis rencana pendaftarannya (hipotesis, alpha, metrik utama, satu cek di akhir).",
        "Notebook ini juga meminta refleksi: berapa biaya peeking dalam rupiah, bila keputusan yang salah meluncurkan skor yang sebenarnya tidak bekerja?",
        "Gambar di bawah adalah peta notebook-nya: Cell 8–9 memakai L0.3 (diagnosis distribusi dan hubungan dengan target — default rate per kelompok PAY_0, korelasi 0,325 dan −0,154); Cell 10 memakai L0.1 (audit cleaning — 0 kosong, 0 duplikat, EDUCATION 345, MARRIAGE 54) dengan L0.2 untuk missing-nya (di sini 0, jadi tidak ada imputasi); Cell 13 memakai L0.4 (feature wrangling — PAY_MEAN, PAY_DELAY_COUNT, UTILIZATION, BILL_MEAN); modelling memakai preprocessing dari L0.2 + L0.4 dan evaluasi dari M1 — dengan fondasi statistik dari L0.5 (p-value, CI, power) di belakangnya. Tugasmu di bawah: label tiap cell dengan lesson L0-nya.",
        "Buka di Colab: https://colab.research.google.com/drive/1ASxxN8guueV1o3vHb6KHQhuM5QXLK4wD",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 300" role="img" aria-label="Peta notebook: cell 8-9 ke L0.3, cell 10 ke L0.1, cell 13 ke L0.4, modelling ke preprocessing dan evaluasi">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Peta notebook: cell mana memakai lesson L0 yang mana</text>
<rect x="60" y="34" width="360" height="40" fill="var(--c1)"/>
<text x="240.0" y="51" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Cell 8–9 → L0.3 diagnosis distribusi + hubungan target</text>
<text x="240.0" y="67" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">default rate per kelompok PAY_0 · korelasi 0,325 dan −0,154</text>
<line x1="240" y1="74" x2="240" y2="88" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="236,88 244,88 240,94" fill="var(--chart-text)"/>
<rect x="60" y="94" width="360" height="40" fill="var(--c2)"/>
<text x="240.0" y="111" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Cell 10 → L0.1 audit cleaning (+ L0.2 missing)</text>
<text x="240.0" y="127" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0 kosong · 0 duplikat · EDUCATION 345 · MARRIAGE 54</text>
<line x1="240" y1="134" x2="240" y2="148" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="236,148 244,148 240,154" fill="var(--chart-text)"/>
<rect x="60" y="154" width="360" height="40" fill="var(--c1)"/>
<text x="240.0" y="171" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Cell 13 → L0.4 feature wrangling</text>
<text x="240.0" y="187" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">PAY_MEAN · PAY_DELAY_COUNT · UTILIZATION · BILL_MEAN</text>
<line x1="240" y1="194" x2="240" y2="208" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="236,208 244,208 240,214" fill="var(--chart-text)"/>
<rect x="60" y="214" width="360" height="40" fill="var(--c4)"/>
<text x="240.0" y="231" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Modelling → preprocessing [L0.2 + L0.4] + evaluasi [M1, fondasi L0.5]</text>
<text x="240.0" y="247" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">imputasi, scaling, lalu evaluasi model</text>
<text x="240.0" y="280" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Satu baris = satu cell notebook; panah = urutan kerja di notebook.</text>
</svg>`,
        alt: "Peta notebook: cell 8-9 ke L0.3, cell 10 ke L0.1, cell 13 ke L0.4, modelling ke preprocessing dan evaluasi.",
        caption: "Cara membaca: tiap kotak satu cell (atau tahap) notebook dengan lesson L0 yang dipakainya. Interpretasi: notebook credit scoring adalah L0 yang dijalankan berurutan — modelling tidak punya satu lesson L0, ia memakai semuanya (M1).",
      },
      tasks: [
        { id: "t1", text: "Label tiap cell notebook (8, 9, 10, 13, modelling) dengan lesson L0-nya — cell 8–9 → L0.3, cell 10 → L0.1 (+L0.2), cell 13 → L0.4, modelling → L0.2+L0.4+M1." },
        { id: "t2", text: "Cell mana yang tidak punya padanan satu lesson L0? (Modelling/evaluasi — itu M1; fondasi statistiknya L0.5.)" },
      ],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint — 8 soal",
      prose: [
        "Delapan soal menutup lesson ini — dan menutup L0. Bila ada yang salah, kembali ke langkah yang dirujuk di 'why' — jawabannya ada di angka eksperimen, bukan di hafalan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "A 12,0 persen vs B 14,5 persen, p sama dengan 0,0992, alpha 0,05. Kesimpulan?",
          options: [
            { text: "B lebih baik — 14,5 persen lebih besar dari 12,0 persen", why: "Salah: selisihnya belum melewati uji — p 0,0992 di atas 0,05.", correct: false },
            { text: "Gagal tolak H0 — tidak signifikan pada alpha 0,05", why: "Benar: 0,0992 lebih besar dari 0,05 — belum cukup bukti bahwa B berbeda.", correct: true },
            { text: "Tidak ada efek — skor baru sama dengan yang lama", why: "Salah: 'tidak signifikan' bukan 'tidak ada efek' — CI-nya masih mencakup 5,47 poin.", correct: false },
            { text: "H0 terbukti benar", why: "Salah: uji hipotesis tidak pernah membuktikan H0 benar — ia hanya gagal menolaknya.", correct: false },
          ],
        },
        {
          q: "95% CI selisih (−0,0047, 0,0547). Artinya?",
          options: [
            { text: "Efeknya pasti 2,5 poin", why: "Salah: 2,5 poin adalah estimasi titik — intervalnya jauh lebih lebar.", correct: false },
            { text: "Efek sebenarnya bisa nol, bisa 5,47 poin, bisa −0,47 poin", why: "Benar: interval mencakup 0 dan kedua sisi — itulah arti CI yang lebar.", correct: true },
            { text: "95 persen data berada di interval ini", why: "Salah: CI adalah interval untuk parameter, bukan untuk data.", correct: false },
            { text: "Peluang efeknya nol adalah 95 persen", why: "Salah: CI bukan pernyataan peluang tentang parameter.", correct: false },
          ],
        },
        {
          q: "Power eksperimen ini 38 persen. Artinya?",
          options: [
            { text: "Peluang H0 benar adalah 38 persen", why: "Salah: power bukan peluang H0 benar.", correct: false },
            { text: "Bila efek 2,5 poin memang ada, hanya 38 persen peluang eksperimen ini mendeteksinya", why: "Benar: power adalah peluang mendeteksi efek yang memang ada — 38 persen berarti sangat lemah.", correct: true },
            { text: "38 persen data mendukung B", why: "Salah: power bukan porsi data.", correct: false },
            { text: "Eksperimen ini 38 persen selesai", why: "Salah: power tidak ada hubungannya dengan progres pengumpulan data.", correct: false },
          ],
        },
        {
          q: "Ukuran sampel per kelompok untuk power 80 persen (efek 2,5 poin, alpha 0,05)?",
          options: [
            { text: "1.000", why: "Salah: 1.000 hanya memberi power 38 persen.", correct: false },
            { text: "2.884", why: "Benar: hampir tiga kali lipat dari yang dipakai.", correct: true },
            { text: "2.000", why: "Salah: 2.000 masih di bawah 2.884 — power-nya belum 80 persen.", correct: false },
            { text: "10.000", why: "Salah: 10.000 jauh di atas yang dibutuhkan untuk efek ini.", correct: false },
          ],
        },
        {
          q: "Simulasi A/A: sekali-cek false positive 0,049; peeking 5 kali menjadi 0,145. Kenapa naik?",
          options: [
            { text: "Karena sampelnya bertambah tiap intipan", why: "Salah: sampel bertambah kumulatif — yang menaikkan false positive adalah banyaknya kesempatan untuk 'menang'.", correct: false },
            { text: "Karena tiap intipan adalah uji baru — peluang salah satu signifikan naik", why: "Benar: 5 intipan pada data kumulatif yang sama memberi peluang gabungan sekitar 14,5 persen (simulasi) — lebih kecil dari 22,6 persen untuk 5 uji independen, karena intipan-intipan itu berkorelasi.", correct: true },
            { text: "Karena seed simulasinya 7", why: "Salah: seed hanya menentukan angka acak — fenomenanya tidak bergantung pada seed.", correct: false },
            { text: "Karena kelompok A dan B berbeda", why: "Salah: dalam simulasi A/A kedua kelompok sama-sama 12 persen — tidak ada beda.", correct: false },
          ],
        },
        {
          q: "5 uji tanpa koreksi, alpha 0,05 tiap uji. Family-wise error rate-nya?",
          options: [
            { text: "5 persen", why: "Salah: 5 persen adalah per uji — bukan gabungan 5 uji.", correct: false },
            { text: "22,6 persen (1 − 0,95 pangkat 5)", why: "Benar: peluang setidaknya satu false positive dari 5 uji.", correct: true },
            { text: "25 persen (5 × 5 persen)", why: "Salah: 25 persen adalah aproksimasi kasar — hitungan tepatnya 22,6 persen.", correct: false },
            { text: "1 persen", why: "Salah: 1 persen adalah alpha Bonferroni per uji (0,05 dibagi 5) — bukan FWER tanpa koreksi.", correct: false },
          ],
        },
        {
          q: "Mini-case: selisih 2,5 poin, p 0,0992, CI (−0,0047, 0,0547) — dalam rupiah (−Rp23,5 jt, Rp273,5 jt) per 10.000 penawaran. Keputusan bisnis yang benar?",
          options: [
            { text: "Perpanjang eksperimen sampai n 2.884 per kelompok — jangan luncurkan, jangan buang", why: "Benar: CI mencakup kerugian (−Rp23,5 jt) jadi tidak boleh luncurkan; batas atas Rp273,5 jt terlalu besar untuk dibuang. Satu-satunya keputusan yang konsisten dengan CI adalah mengumpulkan lebih banyak bukti.", correct: true },
            { text: "Luncurkan — point estimate-nya Rp125 jt keuntungan", why: "Salah: point estimate bukan keputusan — CI-nya mencakup kerugian Rp23,5 jt.", correct: false },
            { text: "Buang skor baru — tidak signifikan berarti tidak bekerja", why: "Salah: 'tidak signifikan' bukan 'tidak ada efek' — batas atas Rp273,5 jt masih mungkin.", correct: false },
            { text: "Tunggu sampai p < 0,05 tanpa menambah sampel", why: "Salah: p tidak akan turun sendiri tanpa data baru — menunggu tanpa menambah sampel tidak mengubah apa pun.", correct: false },
          ],
        },
        {
          q: "Tim menguji 5 metrik sekaligus tanpa koreksi. Satu metrik 'signifikan' pada p 0,03. Alpha Bonferroni per uji 0,01. Apa keputusan yang benar?",
          options: [
            { text: "Jangan luncurkan berdasarkan metrik itu — p 0,03 di atas alpha Bonferroni 0,01; perlakukan sebagai sinyal untuk eksperimen lanjutan", why: "Benar: dengan 5 uji, alpha per uji adalah 0,05/5 = 0,01 — p 0,03 tidak melewatinya. Bonferroni adalah keputusan (alpha sebagai aksi), bukan sekadar angka FWER 0,2262.", correct: true },
            { text: "Luncurkan — p 0,03 di bawah 0,05", why: "Salah: 0,05 adalah alpha untuk SATU uji — dengan 5 uji tanpa koreksi, peluang false positive gabungannya 22,6 persen.", correct: false },
            { text: "Buang metrik itu — p 0,03 berarti tidak ada efek", why: "Salah: p 0,03 masih sinyal yang menarik — hanya belum cukup kuat setelah koreksi; eksperimen lanjutan, bukan pembuangan.", correct: false },
            { text: "Hitung ulang FWER-nya (0,2262) dan laporkan itu", why: "Salah: FWER 0,2262 adalah diagnosis masalahnya, bukan keputusannya — keputusannya adalah memakai alpha 0,01 sebagai ambang aksi.", correct: false },
          ],
        },
      ],
      summary: [
        "P-value adalah P(data se-ekstrem ini | H0 benar) — bukan peluang H0 benar.",
        "A 12,0 persen vs B 14,5 persen: z 1,6489, p 0,0992 — gagal tolak H0 pada alpha 0,05.",
        "95% CI (−0,0047, 0,0547) mencakup 0 — efek bisa 5,47 poin, bisa nol, bisa negatif kecil.",
        "Power 38 persen (sangat lemah); n untuk power 80 persen adalah 2.884 per kelompok.",
        "Peeking 5 kali: false positive 0,049 menjadi 0,145. 5 uji tanpa koreksi: FWER 22,6 persen; Bonferroni alpha 0,01.",
        "Keputusan bisnis memakai efek dan CI, bukan p-value saja — perpanjang eksperimen, jangan luncurkan atau buang.",
        "Desain dulu, statistik kemudian — randomisasi, unit eksperimen, keseimbangan kovariat, dan SRM menentukan apakah p-value bisa dipercaya (SRM [ilustrasi]: 1.060 vs 940, z 2,68, p 0,0073 — randomisasi bermasalah).",
        "Keputusan bisnis memakai CI dalam rupiah, bukan p-value — 4 sel: luncurkan / jangan luncurkan / perpanjang / perpanjang dengan guardrail.",
      ],
      next: { label: "Lanjut ke MLF1 — Tiga Tipe, Satu Alur", href: "/v2/learn/mlf1-tiga-tipe-satu-alur" },
    },
  ],
};
