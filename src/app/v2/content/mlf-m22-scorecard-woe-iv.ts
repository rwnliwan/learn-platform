import type { V2Lesson } from "../lib/types";

export const mlfM22: V2Lesson = {
  slug: "mlf-m22-scorecard-woe-iv",
  track: "Machine Learning Finance",
  module: "Supervised — credit scoring",
  title: "MLF-M2.2 — Scorecard, WoE & IV: Model yang Bisa Dijumlahkan Tangan",
  estMinutes: 60,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Logistic regression di M2.1 sudah mengeluarkan probabilitas — tapi bank tidak bisa menyuruh nasabah membaca koefisien. Bank butuh scorecard: angka tunggal yang bisa dijumlahkan tangan, dijelaskan ke nasabah («skor Anda 444 karena Anda telat 2 bulan»), dan dipertahankan ke regulator.",
        "Tujuan lesson ini:",
        "• Menjelaskan binning: mengubah fitur mentah menjadi bin yang bermakna bisnis.",
        "• Menghitung Weight of Evidence (WoE) dan Information Value (IV) dari tabel counts — dengan angka UCI yang sesungguhnya.",
        "• Membaca band IV yang kontinu dan tahu kapan IV tinggi adalah alarm, bukan prestasi.",
        "• Membangun scorecard: poin = 20 × WoE, skor = 500 + jumlah poin — lalu memvalidasi kalibrasi per band skor.",
        "• Menjalankan dua lab: WoE/IV dari tabel counts, dan scorecard tiga pelamar.",
        "Isi lesson: cerita scorecard → binning → WoE & IV → scorecard → kalibrasi band → 2 lab → peta keputusan → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari dataset UCI 30.000 nasabah [notebook]: PAY_0 IV 0,8761, PAY_DELAY_COUNT IV 0,8618, LIMIT_BAL IV 0,1567. Scorecard tiga fitur mencapai korelasi skor-default −0,4204.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Nasabah bertanya «kenapa skor saya 444?» — dan bank harus bisa menjawab",
      prose: [
        "Seorang nasabah ditolak kreditnya. Ia datang ke cabang dan bertanya: «Kenapa saya ditolak?» Bank yang memakai GBM mentah hanya bisa menjawab: «Model berkata begitu.» Bank yang memakai scorecard bisa menjawab: «Skor Anda 444. Anda kehilangan 41 poin karena telat 2 bulan di September, 10 poin karena limit di bawah Rp50 ribu, dan 5 poin karena usia di bawah 25 tahun. Perbaiki ketiganya, skor Anda naik.»",
        "Itulah gunanya scorecard: ia mengubah model menjadi bahasa yang bisa dinegosiasikan. Skor bukan sekadar angka — ia adalah alasan yang bisa diaudit, diperdebatkan, dan diperbaiki. Regulator menyukainya karena tiap poin bisa dilacak ke bin dan WoE-nya; nasabah menyukainya karena penolakan punya alasan; analis menyukainya karena skor bisa dihitung tanpa komputer.",
        "Nilai: scorecard tiga fitur yang dibangun di lesson ini — PAY_0, LIMIT_BAL, AGE — memisahkan default rate 0,6993 pada band skor di bawah 460 dari 0,0892 pada band 520 ke atas [notebook]. Delapan kali lipat perbedaan risiko, dari tiga fitur dan satu penjumlahan.",
        "Baik atau buruk: scorecard bagus bila keputusannya harus dijelaskan dan dipertahankan — kredit ritel, kartu kredit, KPR. Buruk bila hubungannya kompleks dan non-linear: scorecard memaksa tiap fitur menjadi bin dan tiap bin menjadi satu angka — interaksi antar fitur hilang.",
        "Mitigasi: pakai scorecard sebagai lapisan keputusan (yang dilihat nasabah dan regulator), sementara model kompleks seperti GBM tetap berjalan di belakang sebagai pembanding dan pemantau. Bila keduanya jauh berbeda, selidiki — jangan sembunyikan.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: scorecard adalah model yang ketinggalan zaman",
        type: "pitfall",
        body: "Yang benar: scorecard adalah logistic regression yang diterjemahkan ke poin — bukan model yang berbeda. Dalam konstruksi WoE murni di lesson ini, tiap poin adalah 20 × WoE — ini setara dengan LR yang koefisiennya 1 untuk tiap fitur dan offset-nya sudah masuk ke skor dasar 500. Pada scorecard yang diturunkan langsung dari koefisien LR, tiap poin memakai koefisiennya sendiri, bukan 20 × WoE mentah — jadi 20 × WoE adalah konvensi konstruksi ini, bukan rumus umum. Scorecard tidak menggantikan LR; ia menyajikannya dalam bahasa manusia.",
      },
    },
    {
      id: "binning",
      eyebrow: "Langkah 3 · Binning",
      title: "Binning: potong fitur menjadi kelompok yang bermakna",
      prose: [
        "Langkah pertama scorecard adalah binning: mengubah fitur mentah menjadi kelompok (bin). PAY_0 sudah diskret — nilainya −2 sampai 8 — jadi bin-nya natural: satu bin per nilai, dengan nilai ≥ 4 digabung menjadi «4+» karena masing-masing terlalu sedikit (141 nasabah gabungan). LIMIT_BAL kontinu, jadi dipotong manual: ≤50 ribu, >50–100 ribu, >100–200 ribu, >200–300 ribu, >300–500 ribu, >500 ribu.",
        "Nilai: bin LIMIT_BAL menunjukkan pola monoton yang indah [notebook] — default rate turun dari 0,3179 (limit ≤50 ribu) ke 0,1117 (limit 500 ribu ke atas), dan WoE-nya naik dari −0,4951 ke 0,8153. Monoton berarti bin-nya wajar: makin besar limit, makin kecil risiko — tanpa lompatan aneh di tengah.",
        "Tidak semua fitur semulus itu. AGE punya WoE −0,2467 (≤25), 0,1386 (26–35), 0,0165 (36–45), −0,1670 (46–60), −0,2558 (>60) [notebook] — bentuk U terbalik: usia tengah paling aman, usia muda dan tua lebih berisiko. Binning yang baik tidak memaksakan monoton; ia menunjukkan apa adanya — lalu analis memutuskan apakah polanya masuk akal bisnis atau sekadar noise.",
        "Satu jebakan binning wajib diingat: EDUCATION kode 0 — hanya 14 baris, dan 0 default [notebook]. WoE bin ini tak terdefinisi: rumusnya membagi dengan porsi default, dan porsi default-nya nol. Solusinya: gabungkan bin kecil itu ke bin tetangga sebelum menghitung WoE — jangan pernah membiarkan bin dengan nol default atau nol lancar masuk perhitungan.",
        "Baik atau buruk: binning bagus bila bin-nya punya n yang cukup (ratusan, bukan belasan) dan polanya stabil antar periode. Buruk bila bin dibuat terlalu halus — 20 bin dari 30.000 nasabah berarti tiap bin hanya 1.500 orang, dan WoE-nya mulai goyah oleh noise.",
        "Mitigasi: aturan praktis — tiap bin minimal 5 persen populasi atau minimal 100 default, mana yang lebih besar; gabungkan bin tetangga bila WoE-nya hampir sama; dan selalu tampilkan n per bin di samping WoE, supaya pembaca tahu seberapa bisa dipercaya angka itu.",
      ],
      tasks: [],
    },
    {
      id: "woe-iv",
      eyebrow: "Langkah 4 · WoE & IV",
      title: "Weight of Evidence dan Information Value: seberapa kuat satu fitur membedakan?",
      prose: [
        "Weight of Evidence (WoE) mengukur satu bin: seberapa jauh bin ini dari rata-rata populasi, dalam skala log. Rumusnya: WoE = ln(porsi lancar di bin dibagi porsi default di bin). Bin dengan WoE positif berisi lebih banyak lancar daripada default — relatif terhadap populasi. Bin dengan WoE negatif sebaliknya.",
        "Nilai: tabel PAY_0 [notebook] — bin −2: WoE 0,6221; −1: 0,3428; 0: 0,6591; 1: −0,5931; 2: −2,0654; 3: −2,3991; 4+: −1,7961. Perhatikan lompatannya: dari 0 (0,6591) ke 1 (−0,5931) — satu bulan telat membalik tanda WoE. Dan bin 3 (−2,3991) adalah yang paling negatif: tiga dari empat nasabah di bin ini default (0,7578).",
        "Information Value (IV) menjumlahkan kekuatan semua bin menjadi satu angka per fitur: IV = jumlah (porsi lancar − porsi default) × WoE di tiap bin. PAY_0 IV 0,8761; PAY_DELAY_COUNT 0,8618; LIMIT_BAL 0,1567; EDUCATION 0,0373 (setelah kode 0 digabung ke «Lainnya» bersama kode 4, 5, 6); AGE 0,0213; SEX 0,0092; MARRIAGE 0,0072 [notebook].",
        "Band IV-nya — dibuat kontinu, tanpa lubang: IV < 0,02 tidak prediktif; 0,02 ≤ IV < 0,1 lemah; 0,1 ≤ IV < 0,3 sedang; 0,3 ≤ IV < 0,5 kuat; IV ≥ 0,5 curigai. SEX 0,0092 dan MARRIAGE 0,0072 masuk «tidak prediktif» — jangan buang waktu memasukkan keduanya ke scorecard. LIMIT_BAL 0,1567 «sedang». PAY_0 dan PAY_DELAY_COUNT ≥ 0,5: «curigai».",
        "Gambar di bawah adalah WoE per bin PAY_0: hijau ke kanan berarti lebih lancar, merah ke kiri berarti lebih default. Bin 0 adalah yang paling hijau (0,6591) — nasabah yang membayar tepat waktu adalah yang paling aman; bin 3 yang paling merah (−2,3991).",
        "«Curigai» bukan berarti «buang». Band itu berkata: periksa dulu — apakah IV setinggi ini karena leakage (fitur memakai info masa depan) atau karena sinyalnya memang sekuat itu? Di sini jawabannya sahih: PAY_0 teramati September 2005, default diamati Oktober 2005 — bukan info masa depan, melainkan riwayat yang memang memprediksi masa depan. Selidiki dulu, baru putuskan — itulah yang diajarkan band «curigai».",
        "Baik atau buruk: IV bagus untuk menyaring fitur sebelum melatih — cepat, tanpa model, dan bisa dibandingkan antar fitur. Buruk bila dipakai sendirian: IV tidak melihat interaksi (dua fitur lemah bisa kuat bersama) dan tidak melihat korelasi (PAY_0 dan PAY_DELAY_COUNT mengukur hal yang hampir sama — IV keduanya tinggi, tapi memasukkan keduanya berarti menghitung sinyal yang sama dua kali).",
        "Mitigasi: pakai IV untuk menyaring, lalu periksa korelasi antar fitur yang lolos — bila dua fitur berkorelasi di atas 0,8, pilih satu. Dan selalu hitung IV pada data latih saja, lalu verifikasi stabilitasnya pada data validasi: IV yang jatuh separuh di data baru adalah sinyal binning yang overfit.",
      ],
      formula: String.raw`WoE = \ln\frac{\% \text{lancar di bin}}{\% \text{default di bin}}, \quad IV = \sum (\% \text{lancar} - \% \text{default}) \times WoE`,
      formulaNote: "WoE mengukur satu bin; IV menjumlahkan semua bin menjadi kekuatan satu fitur. Tanda WoE menunjukkan arah: positif = lebih lancar, negatif = lebih default.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar horizontal WoE per bin PAY_0: bin 0 paling positif 0,6591, bin 3 paling negatif -2,3991">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Weight of Evidence per bin PAY_0</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="259.0" y1="30" x2="259.0" y2="206" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−2,5</text>
<line x1="93.4" y1="206" x2="93.4" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="93.4" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−2</text>
<line x1="176.2" y1="206" x2="176.2" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="176.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−1</text>
<line x1="259.0" y1="206" x2="259.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="341.8" y1="206" x2="341.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="341.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<line x1="424.6" y1="206" x2="424.6" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="424.6" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<rect x="259.0" y="35.0" width="51.5" height="15.1" fill="var(--c3)"/>
<text x="316.5" y="46.6" text-anchor="start" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,6221</text>
<text x="44" y="46.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−2</text>
<rect x="259.0" y="60.2" width="28.4" height="15.1" fill="var(--c3)"/>
<text x="293.4" y="71.7" text-anchor="start" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3428</text>
<text x="44" y="71.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−1</text>
<rect x="259.0" y="85.3" width="54.6" height="15.1" fill="var(--c3)"/>
<text x="319.6" y="96.9" text-anchor="start" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,6591</text>
<text x="44" y="96.9" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<rect x="209.9" y="110.5" width="49.1" height="15.1" fill="var(--c4)"/>
<text x="203.9" y="122.0" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">-0,5931</text>
<text x="44" y="122.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<rect x="88.0" y="135.6" width="171.0" height="15.1" fill="var(--c4)"/>
<text x="82.0" y="147.1" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">-2,0654</text>
<text x="44" y="147.1" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<rect x="60.4" y="160.7" width="198.6" height="15.1" fill="var(--c4)"/>
<text x="54.4" y="172.3" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">-2,3991</text>
<text x="44" y="172.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3</text>
<rect x="110.3" y="185.9" width="148.7" height="15.1" fill="var(--c4)"/>
<text x="104.3" y="197.4" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">-1,7961</text>
<text x="44" y="197.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4+</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">WoE (positif = lebih banyak lancar dari default)</text>
</svg>`,
        alt: "Bar horizontal WoE per bin PAY_0: bin 0 paling positif 0,6591, bin 3 paling negatif -2,3991.",
        caption: "Cara membaca: bar ke kanan (hijau) = bin lebih lancar dari rata-rata; ke kiri (merah) = lebih default. Interpretasi: bin 0 paling aman (0,6591), bin 3 paling berisiko (−2,3991); satu bulan telat membalik tanda WoE.",
      },
      tasks: [],
    },
    {
      id: "scorecard",
      eyebrow: "Langkah 5 · Scorecard",
      title: "Dari WoE ke poin: skor = 500 + jumlah poin",
      prose: [
        "Scorecard mengubah WoE menjadi poin yang bisa dijumlahkan: poin = round(20 × WoE), dan skor = 500 + jumlah poin semua fitur. Angka 20 adalah faktor skala (PDO implisit ≈ 13,9 poin per doubling odds) dan 500 adalah skor dasar — konvensi yang membuat skor berada di rentang ratusan, mudah dibaca manusia.",
        "Nilai: tabel poin PAY_0 [notebook] — −2: +12, −1: +7, 0: +13, 1: −12, 2: −41, 3: −48, 4+: −36. LIMIT_BAL — ≤50 ribu: −10, >50–100 ribu: −4, >100–200 ribu: +3, >200–300 ribu: +8, >300–500 ribu: +12, >500 ribu: +16. AGE — ≤25: −5, 26–35: +3, 36–45: 0, 46–60: −3, >60: −5.",
        "Tiga pelamar, tiga skor [notebook]. A (PAY_0 = 0, LIMIT 200–300 ribu, AGE 26–35): 500 + 13 + 8 + 3 = 524. B (PAY_0 = 2, LIMIT ≤50 ribu, AGE ≤25): 500 − 41 − 10 − 5 = 444. C (PAY_0 = −1, LIMIT 300–500 ribu, AGE 36–45): 500 + 7 + 12 + 0 = 519. Selisih A dan B: 80 poin — seluruhnya bisa dijelaskan, poin per poin.",
        "Perhatikan bin 4+ (−36) yang «lebih baik» dari bin 3 (−48): skornya naik meski telatnya lebih lama. Itu bukan kesalahan — itu noise dari n kecil (141 nasabah) dan quirk data: nasabah 4+ bulan telat di September adalah sisa populasi yang belum default sampai Oktober. Scorecard yang jujur menampilkan anomali ini apa adanya; analis yang jujur mencatatnya, bukan menyembunyikannya dengan memaksakan monoton.",
        "Baik atau buruk: scorecard bagus bila skornya dipakai konsisten — threshold yang sama, band yang sama, di semua cabang. Buruk bila poinnya diubah diam-diam tanpa recalibration: menggeser satu poin tanpa menghitung ulang WoE merusak kalibrasi seluruh skor.",
        "Mitigasi: kunci tabel poin ke versi data dan tanggal — «scorecard v1, data Sep 2005» — dan hitung ulang (recalibrate) tiap kali populasi berubah. Skor yang tidak pernah di-recalibrate akan melenceng diam-diam seiring waktu.",
        "Skor sudah di tangan — sekarang ubah menjadi alasan. Reason code adalah 2–4 kontribusi poin TERENDAH seorang pelamar: itulah alasan penolakannya, dalam bahasa yang bisa dibaca nasabah. Pelamar B (skor 444): PAY_0 = 2 → −41 poin, limit ≤50 ribu → −10 poin, usia ≤25 → −5 poin. Tiga reason code-nya: «Telat 2 bulan (PAY_0 = 2)», «Limit di bawah Rp50 ribu», «Usia di bawah 25 tahun». Perhatikan: reason code diambil dari kontribusi poin INDIVIDU ini — bukan dari fitur terpenting secara global. PAY_0 memang fitur terkuat di populasi (IV 0,8761), tapi untuk pelamar lain yang PAY_0-nya 0, alasan penolakannya bisa jadi limit dan usianya.",
        "Counterfactual adalah langkah berikutnya: «apa yang harus berubah agar skor naik?» Hitung dengan mengganti poin bin lama dengan poin bin baru [notebook]. PAY_0 2 → 0: −41 menjadi +13, selisih +54 poin — skor 444 → 498. Limit ≤50 ribu → 200–300 ribu: −10 menjadi +8, selisih +18 poin. Usia ≤25 → 26–35: −5 menjadi +3, selisih +8 poin. Ketiganya diperbaiki: 444 → 524. Tapi bedakan counterfactual yang valid dari yang tidak: PAY_0 BISA diperbaiki — bayar tepat waktu bulan depan, dan bin-nya berubah. Limit BISA diajukan naik — keputusannya di bank, tapi usahanya di nasabah. Usia TIDAK bisa diubah — ia berubah sendiri seiring waktu, jadi «tunggu sampai 26 tahun» bukan saran perbaikan, melainkan penundaan. Counterfactual yang baik adalah yang actionable: perubahan yang bisa dilakukan nasabah, dengan besaran poin yang eksplisit.",
        "Konstruksi standar scorecard — yang dipakai bank, bukan hanya konstruksi pedagogis lesson ini. Rumusnya: skor = offset + factor × ln(odds good/bad), dengan factor = PDO / ln(2) dan offset = base score − factor × ln(base odds). PDO (points to double the odds) adalah berapa poin yang ditambahkan saat odds good/bad naik dua kali lipat. Dengan PDO = 20, base score 600 pada base odds 50:1 (good:bad): factor = 20 / ln(2) = 28,8539; offset = 600 − 28,8539 × ln(50) = 487,1229 [notebook]. Perhatikan arah odds-nya: odds di sini adalah good/bad — makin besar odds, makin AMAN nasabah, makin tinggi skornya. Bila odds dibalik (bad/good), tandanya ikut terbalik.",
        "Contoh kerja dari rumus standar itu: PD 0,05 → odds good/bad 19,00 → skor 572. PD 0,10 → odds 9,00 → skor 551. PD 0,20 → odds 4,00 → skor 527. Dan sifat PDO-nya: odds naik 2× → skor naik tepat 20 poin — dari PD 0,10 (odds 9) ke PD ≈ 0,0526 (odds 18), skor naik 551 → 571. Bandingkan dengan konstruksi pedagogis lesson ini (skor = 500 + 20 × WoE): di sana WoE = 0 berarti odds 1:1 dan skor 500; WoE = 0,6931 (odds 2:1) berarti skor 500 + 20 × 0,6931 = 513,9. Keduanya konsisten — konstruksi WoE murni adalah kasus khusus scorecard standar dengan koefisien 1 per fitur dan offset yang sudah masuk ke skor dasar 500. Pada scorecard yang diturunkan langsung dari koefisien LR, tiap fitur memakai koefisiennya sendiri — bukan 20 × WoE mentah. Ini BUKAN duplikat koreksi istilah PDO di review (yang memperbaiki penyebutan «20 = PDO» menjadi «PDO implisit ≈ 13,9»): itu soal istilah; ini soal konstruksi standar yang belum pernah diajarkan.",
      ],
      formula: String.raw`\text{skor} = \text{offset} + \text{factor} \times \ln(\text{odds good/bad}), \quad \text{factor} = \frac{PDO}{\ln 2}`,
      formulaNote: "Scorecard standar: offset dan factor diturunkan dari base score, base odds, dan PDO. PDO = 20 berarti odds good/bad naik dua kali lipat menaikkan skor 20 poin. Konstruksi pedagogis lesson ini (500 + 20 × WoE) adalah kasus khususnya.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Waterfall skor B dari 500 ke 444 dan konversi PD ke skor: 0,05 menjadi 572; 0,10 menjadi 551; 0,20 menjadi 527">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Waterfall skor B &amp; konversi PD → skor (standar)</text>
<text x="120" y="34" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Waterfall skor B (500 → 444)</text>
<rect x="52" y="52" width="58" height="28" rx="6" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="81" y="70" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">500</text>
<text x="81" y="94" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">dasar</text>
<line x1="110" y1="66" x2="150" y2="66" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="150,66 142,61 142,71" fill="var(--chart-text)"/>
<text x="130" y="44" text-anchor="middle" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">−41</text>
<rect x="152" y="52" width="58" height="28" rx="6" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="181" y="70" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">459</text>
<text x="181" y="94" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">PAY_0=2</text>
<line x1="210" y1="66" x2="250" y2="66" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="250,66 242,61 242,71" fill="var(--chart-text)"/>
<text x="230" y="44" text-anchor="middle" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">−10</text>
<rect x="252" y="52" width="58" height="28" rx="6" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="281" y="70" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">449</text>
<text x="281" y="94" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">limit ≤50rb</text>
<line x1="310" y1="66" x2="350" y2="66" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="350,66 342,61 342,71" fill="var(--chart-text)"/>
<text x="330" y="44" text-anchor="middle" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">−5</text>
<rect x="352" y="52" width="58" height="28" rx="6" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="381" y="70" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">444</text>
<text x="381" y="94" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">usia ≤25</text>
<text x="240" y="120" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Konversi PD → skor (PDO=20, base 600 @ 50:1)</text>
<line x1="52" y1="140" x2="52" y2="220" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="220" x2="466" y2="220" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="220.0" x2="52" y2="220.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="223.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">520</text>
<line x1="48" y1="193.3" x2="52" y2="193.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="196.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">540</text>
<line x1="48" y1="166.7" x2="52" y2="166.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="169.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">560</text>
<line x1="48" y1="140.0" x2="52" y2="140.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="143.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">580</text>
<line x1="52.0" y1="220" x2="52.0" y2="224" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="234" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="134.8" y1="220" x2="134.8" y2="224" stroke="var(--chart-text)" stroke-width="1"/>
<text x="134.8" y="234" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,05</text>
<line x1="217.6" y1="220" x2="217.6" y2="224" stroke="var(--chart-text)" stroke-width="1"/>
<text x="217.6" y="234" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<line x1="300.4" y1="220" x2="300.4" y2="224" stroke="var(--chart-text)" stroke-width="1"/>
<text x="300.4" y="234" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,15</text>
<line x1="383.2" y1="220" x2="383.2" y2="224" stroke="var(--chart-text)" stroke-width="1"/>
<text x="383.2" y="234" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,20</text>
<line x1="466.0" y1="220" x2="466.0" y2="224" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="234" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<polyline points="134.8,150.7 217.6,178.7 383.2,210.7" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="134.8" cy="150.7" r="5" fill="var(--c2)"/>
<text x="134.8" y="142.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,05 → 572</text>
<circle cx="217.6" cy="178.7" r="5" fill="var(--c2)"/>
<text x="217.6" y="170.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,10 → 551</text>
<circle cx="383.2" cy="210.7" r="5" fill="var(--c2)"/>
<text x="383.2" y="202.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,20 → 527</text>
<text x="462" y="148" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">odds 2× → +20 poin (PDO)</text>
</svg>`,
        alt: "Waterfall skor B dari 500 ke 444 dan konversi PD ke skor: 0,05 menjadi 572; 0,10 menjadi 551; 0,20 menjadi 527.",
        caption: "Cara membaca: panel atas = skor B berkurang poin per poin (500 − 41 − 10 − 5 = 444); panel bawah = skor standar dari PD (PDO 20, base 600 @ 50:1). Interpretasi: reason code adalah 2–4 poin terendah; counterfactual PAY_0 2→0 menaikkan skor +54 (444 → 498); odds naik 2× menaikkan skor 20 poin.",
      },
      tasks: [],
    },
    {
      id: "kalibrasi-band",
      eyebrow: "Langkah 6 · Kalibrasi band skor",
      title: "Apakah skor tinggi benar-benar lebih aman? Uji per band",
      prose: [
        "Scorecard yang baik harus monoton: makin tinggi skor, makin rendah default rate. Uji itu dilakukan per band — bukan per nasabah — dengan menghitung default rate tiap band skor pada data yang sama.",
        "Nilai: empat band skor [notebook] — di bawah 460: default rate 0,6993 (n = 2.205); 460–499: 0,3511 (n = 6.263); 500–519: 0,1508 (n = 15.834); 520 ke atas: 0,0892 (n = 5.698). Monoton sempurna: tiap naik band, default rate turun — dari hampir 70 persen ke di bawah 9 persen. Korelasi skor-default −0,4204: skor naik, default turun.",
        "Gambar di bawah menunjukkan dua hal yang sama-sama soal kepercayaan pada angka. Kiri: approval rate per grup SEX pada threshold 0,10 — perempuan sedikit lebih sering disetujui. Kanan: interval Wilson untuk empat estimasi dengan n yang berbeda — dari yang hampir tidak berarti (n = 2) sampai yang solid (n = 2.205). Band skornya sendiri tetap monoton seperti di paragraf «Nilai» — angka-angka band (0,6993, 0,3511, 0,1508, 0,0892) sudah tercantum di sana beserta n tiap band.",
        "Baik atau buruk: band skor bagus bila monoton DAN tiap band punya n yang cukup untuk dipercaya — band 520+ dengan n = 5.698 dan default rate 0,0892 adalah estimasi yang solid. Buruk bila band tidak monoton: band yang lebih tinggi tapi default rate-nya lebih besar berarti tabel poinnya salah — biasanya satu bin WoE-nya terbalik karena n kecil.",
        "Mitigasi: bila band tidak monoton, jangan paksa dengan menggabungkan band secara buta — kembali ke tabel WoE dan cari bin penyebabnya (biasanya bin kecil atau bin dengan WoE yang melompat). Dan selalu uji monoton pada data validasi, bukan hanya data latih: scorecard yang monoton di latih tapi tidak di validasi adalah scorecard yang overfit.",
        "Audit fairness — scorecard yang monoton secara keseluruhan belum tentu adil per kelompok. Audit dasarnya menghitung, per grup, pada test set dengan GBM terkalibrasi dan threshold 0,10 [notebook]: approval rate (berapa persen yang disetujui), bad rate approved (dari yang disetujui, berapa persen yang default), false-positive rate dan false-negative rate, mean PD dan calibration gap, serta mean score. Definisinya wajib eksplisit: FP (false positive) = nasabah LANCAR yang ditolak — PD ≥ threshold padahal tidak default; FN (false negative) = nasabah DEFAULT yang lolos — PD < threshold padahal default. Tanpa definisi ini, angka FPR/FNR tidak bisa dibaca.",
        "Nilai: SEX = 1 (laki-laki), n = 2.402 [notebook] — default rate 0,2336, approval 0,2614, bad rate approved 0,0669, mean PD 0,2313, calibration gap −0,0022, FPR 0,6817, FNR 0,0749, FP (lancar ditolak) 1.255, FN (default lolos) 42, mean score 503,4. SEX = 2 (perempuan), n = 3.598 — default 0,2129, approval 0,3007, bad rate 0,0665, mean PD 0,2153, calibration gap +0,0024, FPR 0,6434, FNR 0,0940, FP 1.822, FN 72, mean score 504,4. AIR (adverse impact ratio, approval perempuan dibagi laki-laki) = 1,1502. Pada data penuh: default SEX = 1 adalah 0,2417 vs SEX = 2 adalah 0,2078; mean score penuh 502,9 vs 504,7.",
        "Baca audit itu dengan benar. Approval perempuan lebih tinggi (0,3007 vs 0,2614) — tapi bad rate approved-nya hampir sama (0,0665 vs 0,0669): yang disetujui dari kedua grup sama-sama berisiko rendah. FPR laki-laki lebih tinggi (0,6817 vs 0,6434) — nasabah lancar laki-laki lebih sering ditolak — sementara FNR perempuan lebih tinggi (0,0940 vs 0,0749) — nasabah default perempuan lebih sering lolos. Kalibrasi per grup nyaris sempurna (gap −0,0022 dan +0,0024): model tidak melebih-lebihkan atau meremehkan satu grup secara sistematis. Dan pertanyaan kuncinya: «Mengapa IV SEX rendah (0,0092) tidak membuktikan model fair?» Karena IV hanya mengukur seberapa kuat SEX memprediksi default sebagai SATU fitur — bukan apakah KEPUTUSAN model adil antar grup. Model bisa tidak memakai SEX sama sekali dan tetap bias lewat proxy: AGE, LIMIT_BAL, atau perilaku pembayaran yang berkorelasi dengan SEX. Menghapus SEX dari fitur belum tentu menghapus bias — ia hanya menyembunyikan jalurnya. Perbedaan base rate (default 0,2417 vs 0,2078) juga membuat tidak semua metrik parity bisa dipenuhi sekaligus: bila base rate berbeda, approval yang sama berarti bad rate yang berbeda, atau sebaliknya.",
        "Mitigasi fairness: review fitur proxy (fitur apa yang berkorelasi kuat dengan grup yang dilindungi?), review threshold dan policy per grup, review reason code untuk nasabah yang ditolak dari tiap grup, dan dokumentasikan justifikasi bisnis dan regulator untuk tiap perbedaan yang dipertahankan. Audit mendalam — termasuk mitigasi yang mengubah model — adalah modul M7; di sini audit dasarnya: ukur, laporkan, dan jangan menyimpulkan fair hanya dari satu angka.",
        "Ketidakpastian band kecil — angka tanpa interval adalah setengah kebenaran. Interval Wilson 95% untuk proporsi binomial: pusatnya (p + z²/2n) / (1 + z²/n), lebarnya z × √(p(1−p)/n + z²/4n²) / (1 + z²/n), dengan z = 1,96. Empat contoh [notebook]: default rate 1,0000 dari n = 2 → [0,3424; 1,0000], lebar 0,6576 — «100 persen» dari dua orang hampir tidak berarti apa-apa. Default rate 0,6993 dari n = 2.205 (band skor di bawah 460, 1.542 default) → [0,6798; 0,7181], lebar 0,0383 — estimasi yang solid. Kohort 4+ 92/129 (0,7132) → [0,6299; 0,7842], lebar 0,1543 — rate-nya tinggi, tapi ketidakpastiannya empat kali band <460. Roll-rate bucket 1: 34/34 (1,0000) → [0,8985; 1,0000], lebar 0,1015 — «pasti bertahan» dari 34 transisi masih menyisakan 10 persen kemungkinan sebaliknya.",
        "Aturannya: laporkan interval di samping rate — terutama untuk band, kohort, dan baris roll-rate dengan n kecil. Ambang «n ≥ 100» adalah rule of thumb, bukan pengganti interval: n = 129 saja masih memberi lebar 0,1543. Logika yang sama dipakai di M2.4 untuk vintage dan roll-rate: kohort 4+ (n = 129) dan baris bucket 1 (n = 34) dibaca dengan intervalnya, bukan dengan rate-nya saja.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Kiri: approval rate SEX=1 sebesar 0,2614 dan SEX=2 sebesar 0,3007. Kanan: interval Wilson 95 persen untuk empat estimasi">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Fairness per grup &amp; ketidakpastian band kecil (Wilson 95%)</text>
<text x="140" y="36" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Approval rate per grup (threshold 0,10)</text>
<line x1="60" y1="56" x2="60" y2="196" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="60" y1="196" x2="230" y2="196" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="56" y1="196.0" x2="60" y2="196.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52" y="199.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="56" y1="156.0" x2="60" y2="156.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52" y="159.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,1</text>
<line x1="56" y1="116.0" x2="60" y2="116.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52" y="119.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="56" y1="76.0" x2="60" y2="76.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52" y="79.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,3</text>
<rect x="85" y="91.4" width="45" height="104.6" fill="var(--c1)"/>
<text x="107.5" y="85.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,2614</text>
<text x="107.5" y="210" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">SEX=1</text>
<text x="107.5" y="224" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">bad 0,0669</text>
<rect x="165" y="75.7" width="45" height="120.3" fill="var(--c2)"/>
<text x="187.5" y="69.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3007</text>
<text x="187.5" y="210" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">SEX=2</text>
<text x="187.5" y="224" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">bad 0,0665</text>
<text x="360" y="36" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Wilson 95%: rate vs n</text>
<line x1="260" y1="56" x2="260" y2="196" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="260" y1="196" x2="466" y2="196" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="256" y1="196.0" x2="260" y2="196.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="252" y="199.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="256" y1="126.0" x2="260" y2="126.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="252" y="129.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="256" y1="56.0" x2="260" y2="56.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="252" y="59.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<line x1="290" y1="56.0" x2="290" y2="148.1" stroke="var(--c4)" stroke-width="2"/>
<line x1="282" y1="56.0" x2="298" y2="56.0" stroke="var(--c4)" stroke-width="2"/>
<line x1="282" y1="148.1" x2="298" y2="148.1" stroke="var(--c4)" stroke-width="2"/>
<circle cx="290" cy="56.0" r="4" fill="var(--c4)"/>
<text x="290" y="49.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1,0000</text>
<text x="290" y="210" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n=2</text>
<line x1="330" y1="95.5" x2="330" y2="100.8" stroke="var(--c1)" stroke-width="2"/>
<line x1="322" y1="95.5" x2="338" y2="95.5" stroke="var(--c1)" stroke-width="2"/>
<line x1="322" y1="100.8" x2="338" y2="100.8" stroke="var(--c1)" stroke-width="2"/>
<circle cx="330" cy="98.1" r="4" fill="var(--c1)"/>
<text x="330" y="88.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,6993</text>
<text x="330" y="210" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n=2.205</text>
<line x1="370" y1="86.2" x2="370" y2="107.8" stroke="var(--c1)" stroke-width="2"/>
<line x1="362" y1="86.2" x2="378" y2="86.2" stroke="var(--c1)" stroke-width="2"/>
<line x1="362" y1="107.8" x2="378" y2="107.8" stroke="var(--c1)" stroke-width="2"/>
<circle cx="370" cy="96.2" r="4" fill="var(--c1)"/>
<text x="370" y="79.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7132</text>
<text x="370" y="210" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n=129</text>
<line x1="410" y1="56.0" x2="410" y2="70.2" stroke="var(--c4)" stroke-width="2"/>
<line x1="402" y1="56.0" x2="418" y2="56.0" stroke="var(--c4)" stroke-width="2"/>
<line x1="402" y1="70.2" x2="418" y2="70.2" stroke="var(--c4)" stroke-width="2"/>
<circle cx="410" cy="56.0" r="4" fill="var(--c4)"/>
<text x="410" y="49.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1,0000</text>
<text x="410" y="210" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n=34</text>
<text x="360" y="228" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">lebar CI: 0,6576 · 0,0383 · 0,1543 · 0,1015</text>
</svg>`,
        alt: "Kiri: approval rate SEX=1 sebesar 0,2614 dan SEX=2 sebesar 0,3007. Kanan: interval Wilson 95 persen untuk empat estimasi.",
        caption: "Cara membaca: kiri = approval rate per grup pada threshold 0,10 (bad rate approved di bawah tiap bar); kanan = titik estimasi dengan garis interval Wilson 95% — makin pendek garisnya, makin bisa dipercaya angkanya. Interpretasi: approval perempuan lebih tinggi (AIR 1,1502) tapi bad rate approved hampir sama (0,0669 vs 0,0665); dan «100%» dari n = 2 punya interval selebar 0,6576 — hampir tidak berarti apa-apa.",
      },
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab: WoE dan IV dari tabel counts PAY_0",
      prose: [
        "Sekarang giliranmu menghitung WoE dan IV dari tabel counts yang sesungguhnya — angka yang sama dengan yang dipakai lesson ini, langsung dari dataset UCI 30.000 nasabah.",
        "Tabelnya: tiap bin PAY_0 dengan jumlah nasabah lancar dan default. Total lancar 23.364, total default 6.636. Rumusnya sudah di langkah 4: WoE = ln(porsi lancar / porsi default), kontribusi IV = (porsi lancar − porsi default) × WoE.",
        "Perhatikan bin 2: WoE −2,0654 dengan kontribusi IV 0,5012 — lebih dari separuh total IV 0,8761 [lab] datang dari satu bin ini. Itulah kenapa PAY_0 begitu kuat: satu bin — telat 2 bulan — sudah memisahkan sebagian besar sinyal.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi rumus WoE = ln(pg / pb)" },
        { id: "t2", text: "Lengkapi kontribusi IV tiap bin = (pg - pb) * woe" },
        { id: "t3", text: "Jalankan dan baca IV total, lalu tentukan band IV PAY_0" },
      ],
      expected: "bin -2: WoE=0.6221 IV=0.0295\nbin -1: WoE=0.3428 IV=0.0201\nbin 0: WoE=0.6591 IV=0.1749\nbin 1: WoE=-0.5931 IV=0.0501\nbin 2: WoE=-2.0654 IV=0.5012\nbin 3: WoE=-2.3991 IV=0.0802\nbin 4+: WoE=-1.7961 IV=0.0201\nIV total: 0.8761",
      hints: [
        "pg = jumlah lancar bin dibagi total lancar; pb = jumlah default bin dibagi total default.",
        "math.log adalah log natural (ln) — itulah yang dipakai WoE.",
      ],
      code: {
        starter: `import math

# Tabel counts PAY_0 (dataset UCI 30.000 nasabah): (bin, n_lancar, n_default)
bins = [("-2", 2394, 365), ("-1", 4732, 954), ("0", 12849, 1888),
        ("1", 2436, 1252), ("2", 823, 1844), ("3", 78, 244), ("4+", 52, 89)]
tot_g = sum(g for _, g, _ in bins)
tot_b = sum(b for _, _, b in bins)
iv = 0.0
for name, g, b in bins:
    pg = g / tot_g
    pb = b / tot_b
    woe = 0.0  # TODO: WoE = ln(pg / pb)
    ivb = 0.0  # TODO: kontribusi IV bin = (pg - pb) * woe
    iv += ivb
    print(f"bin {name}: WoE={woe:.4f} IV={ivb:.4f}")
print(f"IV total: {iv:.4f}")`,
        lockLines: 7,
        solution: `import math

# Tabel counts PAY_0 (dataset UCI 30.000 nasabah): (bin, n_lancar, n_default)
bins = [("-2", 2394, 365), ("-1", 4732, 954), ("0", 12849, 1888),
        ("1", 2436, 1252), ("2", 823, 1844), ("3", 78, 244), ("4+", 52, 89)]
tot_g = sum(g for _, g, _ in bins)
tot_b = sum(b for _, _, b in bins)
iv = 0.0
for name, g, b in bins:
    pg = g / tot_g
    pb = b / tot_b
    woe = math.log(pg / pb)
    ivb = (pg - pb) * woe
    iv += ivb
    print(f"bin {name}: WoE={woe:.4f} IV={ivb:.4f}")
print(f"IV total: {iv:.4f}")`,
        checks: [
          { kind: "equal", task: "t3", name: "iv", value: 0.8761, tol: 0.0001, label: "`iv` seharusnya 0,8761", msg: "IV PAY_0 = 0,8761 — masuk band IV ≥ 0,5: curigai, lalu selidiki (di sini sahih, bukan leakage)." },
          { kind: "stdout_matches", task: "t3", pattern: "IV total: 0\\.8761", label: "Output menampilkan IV total 0,8761", msg: "Format: IV total: {iv:.4f}." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab: scorecard tiga pelamar",
      prose: [
        "Lab kedua mengubah tabel poin menjadi skor. Tiga pelamar, tiga fitur, satu penjumlahan — dan band yang menentukan nasib masing-masing.",
        "Tabel poinnya sudah diberikan (poin = round(20 × WoE)). Tugasmu: jumlahkan poin tiap pelamar, tambahkan skor dasar 500, lalu petakan ke band skor.",
        "Hasilnya: A 524 (band 520+), B 444 (band di bawah 460), C 519 (band 500–519) [lab]. Dengan band default rate dari langkah 6, kamu sudah bisa memberi tiap pelamar satu angka risiko: A 0,0892, B 0,6993, C 0,1508. Itulah scorecard bekerja — dari tiga angka mentah menjadi satu keputusan.",
        "Tiga tugas tambahan memakai skor yang sama untuk tiga keterampilan baru: tugas 4 menghitung audit fairness per grup SEX dari counts test set (approval, bad rate approved, FPR, FNR, lalu AIR); tugas 5 mengubah poin pelamar B menjadi top-3 reason codes dan satu counterfactual PAY_0 2→0; tugas 6 mengonversi tiga PD menjadi skor standar (PDO 20, base 600 @ 50:1) dengan rumus offset + factor × ln(odds).",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi perhitungan skor = 500 + jumlah poin" },
        { id: "t2", text: "Jalankan dan baca skor + band ketiga pelamar" },
        { id: "t3", text: "Cocokkan band tiap pelamar dengan default rate band-nya" },
        { id: "t4", text: "Hitung approval rate, bad rate approved, FPR, dan FNR per grup SEX dari counts test set, lalu AIR-nya" },
        { id: "t5", text: "Buat top-3 reason codes pelamar B dan satu counterfactual PAY_0 2→0" },
        { id: "t6", text: "Konversi tiga PD (0,05; 0,10; 0,20) menjadi skor standar (PDO 20, base 600 @ 50:1)" },
      ],
      expected: "pelamar A: skor=524 band=520+\npelamar B: skor=444 band=<460\npelamar C: skor=519 band=500-519\nSEX=1: approval=0.2614 bad_rate=0.0669 FPR=0.6817 FNR=0.0749\nSEX=2: approval=0.3007 bad_rate=0.0665 FPR=0.6434 FNR=0.0940\nAIR (approval perempuan/laki-laki): 1.1502\nskor B: 444\nreason codes (top-3): PAY_0=2 (-41), limit<=50rb (-10), age<=25 (-5)\ncounterfactual PAY_0 2->0: +54 poin -> skor 498\nketiganya diperbaiki: skor 524\nfactor: 28.8539\noffset: 487.1229\nPD=0.05 odds=19.00 skor=572\nPD=0.10 odds=9.00 skor=551\nPD=0.20 odds=4.00 skor=527",
      hints: [
        "Poin PAY_0 ada di dict pts_pay0; poin limit dan usia dari fungsi pts_lim dan pts_age.",
        "Band: di bawah 460 → <460; 460–499 → 460-499; 500–519 → 500-519; 520 ke atas → 520+.",
      ],
      code: {
        starter: `# Tabel poin (poin = round(20 x WoE), skor = 500 + jumlah poin)
pts_pay0 = {-2: 12, -1: 7, 0: 13, 1: -12, 2: -41, 3: -48, 4: -36}

def pts_lim(lim):
    if lim <= 50000:
        return -10
    if lim <= 100000:
        return -4
    if lim <= 200000:
        return 3
    if lim <= 300000:
        return 8
    if lim <= 500000:
        return 12
    return 16

def pts_age(age):
    if age <= 25:
        return -5
    if age <= 35:
        return 3
    if age <= 45:
        return 0
    if age <= 60:
        return -3
    return -5

def band(s):
    if s < 460:
        return "<460"
    if s < 500:
        return "460-499"
    if s < 520:
        return "500-519"
    return "520+"

# (PAY_0, LIMIT_BAL, AGE)
applicants = [("A", 0, 250000, 30), ("B", 2, 40000, 24), ("C", -1, 400000, 40)]
scores = []
for name, pay0, lim, age in applicants:
    s = 500  # TODO: tambah poin PAY_0, LIMIT_BAL, dan AGE
    scores.append(s)
    print(f"pelamar {name}: skor={s} band={band(s)}")

# --- Tugas 4: fairness audit per grup (G4) ---
# Counts test set, GBM terkalibrasi, threshold 0,10 [notebook]:
# (n, TP, FP, TN, FN). Definisi: FP = lancar ditolak; FN = default lolos.
fair = {"SEX=1": (2402, 519, 1255, 586, 42), "SEX=2": (3598, 694, 1822, 1010, 72)}
appr = {}
for g, (n, tp, fp, tn, fn) in fair.items():
    a = 0.0  # TODO: approval = (TN + FN) / n
    br = 0.0  # TODO: bad rate approved = FN / (TN + FN)
    fpr = 0.0  # TODO: FPR = FP / (FP + TN)
    fnr = 0.0  # TODO: FNR = FN / (FN + TP)
    appr[g] = a
    print(f"{g}: approval={a:.4f} bad_rate={br:.4f} FPR={fpr:.4f} FNR={fnr:.4f}")
air = 0.0  # TODO: AIR = approval SEX=2 / approval SEX=1
print(f"AIR (approval perempuan/laki-laki): {air:.4f}")

# --- Tugas 5: reason codes + counterfactual pelamar B (G5) ---
pts_B = {"PAY_0=2": -41, "limit<=50rb": -10, "age<=25": -5}
score_B = 500 + sum(pts_B.values())
reasons = []  # TODO: top-3 reason codes = pasangan (fitur, poin) terurut dari poin terendah
cf_pay0 = 0  # TODO: PAY_0 2->0: poin baru +13 dikurangi poin lama -41
score_cf = score_B + cf_pay0
score_all = 0  # TODO: ketiganya diperbaiki: skor B + 54 (PAY_0) + 18 (limit) + 8 (usia)
print(f"skor B: {score_B}")
print("reason codes (top-3): " + ", ".join(f"{k} ({v})" for k, v in reasons))
print(f"counterfactual PAY_0 2->0: +{cf_pay0} poin -> skor {score_cf}")
print(f"ketiganya diperbaiki: skor {score_all}")

# --- Tugas 6: konversi PD -> skor standar (G7) ---
import math
PDO = 20
BASE_SCORE = 600
BASE_ODDS = 50  # good:bad
factor = 0.0  # TODO: factor = PDO / ln(2)
offset = 0.0  # TODO: offset = BASE_SCORE - factor * ln(BASE_ODDS)
print(f"factor: {factor:.4f}")
print(f"offset: {offset:.4f}")
scores_std = []
for pd in (0.05, 0.10, 0.20):
    odds = (1 - pd) / pd
    s = 0  # TODO: skor = offset + factor * ln(odds)
    scores_std.append(round(s))
    print(f"PD={pd:.2f} odds={odds:.2f} skor={round(s)}")`,
        lockLines: 33,
        solution: `# Tabel poin (poin = round(20 x WoE), skor = 500 + jumlah poin)
pts_pay0 = {-2: 12, -1: 7, 0: 13, 1: -12, 2: -41, 3: -48, 4: -36}

def pts_lim(lim):
    if lim <= 50000:
        return -10
    if lim <= 100000:
        return -4
    if lim <= 200000:
        return 3
    if lim <= 300000:
        return 8
    if lim <= 500000:
        return 12
    return 16

def pts_age(age):
    if age <= 25:
        return -5
    if age <= 35:
        return 3
    if age <= 45:
        return 0
    if age <= 60:
        return -3
    return -5

def band(s):
    if s < 460:
        return "<460"
    if s < 500:
        return "460-499"
    if s < 520:
        return "500-519"
    return "520+"

# (PAY_0, LIMIT_BAL, AGE)
applicants = [("A", 0, 250000, 30), ("B", 2, 40000, 24), ("C", -1, 400000, 40)]
scores = []
for name, pay0, lim, age in applicants:
    s = 500 + pts_pay0[pay0] + pts_lim(lim) + pts_age(age)
    scores.append(s)
    print(f"pelamar {name}: skor={s} band={band(s)}")

# --- Tugas 4: fairness audit per grup (G4) ---
# Counts test set, GBM terkalibrasi, threshold 0,10 [notebook]:
# (n, TP, FP, TN, FN). Definisi: FP = lancar ditolak; FN = default lolos.
fair = {"SEX=1": (2402, 519, 1255, 586, 42), "SEX=2": (3598, 694, 1822, 1010, 72)}
appr = {}
for g, (n, tp, fp, tn, fn) in fair.items():
    a = (tn + fn) / n
    br = fn / (tn + fn)
    fpr = fp / (fp + tn)
    fnr = fn / (fn + tp)
    appr[g] = a
    print(f"{g}: approval={a:.4f} bad_rate={br:.4f} FPR={fpr:.4f} FNR={fnr:.4f}")
air = appr["SEX=2"] / appr["SEX=1"]
print(f"AIR (approval perempuan/laki-laki): {air:.4f}")

# --- Tugas 5: reason codes + counterfactual pelamar B (G5) ---
pts_B = {"PAY_0=2": -41, "limit<=50rb": -10, "age<=25": -5}
score_B = 500 + sum(pts_B.values())
reasons = sorted(pts_B.items(), key=lambda kv: kv[1])
cf_pay0 = 13 - pts_B["PAY_0=2"]
score_cf = score_B + cf_pay0
score_all = score_B + cf_pay0 + (8 - pts_B["limit<=50rb"]) + (3 - pts_B["age<=25"])
print(f"skor B: {score_B}")
print("reason codes (top-3): " + ", ".join(f"{k} ({v})" for k, v in reasons))
print(f"counterfactual PAY_0 2->0: +{cf_pay0} poin -> skor {score_cf}")
print(f"ketiganya diperbaiki: skor {score_all}")

# --- Tugas 6: konversi PD -> skor standar (G7) ---
import math
PDO = 20
BASE_SCORE = 600
BASE_ODDS = 50  # good:bad
factor = PDO / math.log(2)
offset = BASE_SCORE - factor * math.log(BASE_ODDS)
print(f"factor: {factor:.4f}")
print(f"offset: {offset:.4f}")
scores_std = []
for pd in (0.05, 0.10, 0.20):
    odds = (1 - pd) / pd
    s = offset + factor * math.log(odds)
    scores_std.append(round(s))
    print(f"PD={pd:.2f} odds={odds:.2f} skor={round(s)}")`,
        checks: [
          { kind: "equal", task: "t2", name: "scores", value: [524, 444, 519], label: "`scores` seharusnya [524, 444, 519]", msg: "A = 500 + 13 + 8 + 3; B = 500 − 41 − 10 − 5; C = 500 + 7 + 12 + 0." },
          { kind: "stdout_matches", task: "t2", pattern: "pelamar A: skor=524 band=520\\+", label: "Output menampilkan skor A 524 band 520+", msg: "Format: pelamar {name}: skor={s} band={band(s)}." },
          { kind: "equal", task: "t4", name: "air", value: 1.1502, tol: 0.0001, label: "`air` seharusnya 1,1502", msg: "Approval SEX=2 (0,3007) dibagi SEX=1 (0,2614) = 1,1502 — hitung dari counts, bukan dari rate yang sudah dibulatkan." },
          { kind: "equal", task: "t5", name: "score_B", value: 444, label: "`score_B` seharusnya 444", msg: "500 − 41 − 10 − 5 = 444." },
          { kind: "equal", task: "t5", name: "score_cf", value: 498, label: "`score_cf` seharusnya 498", msg: "PAY_0 2→0 menaikkan skor +54: 444 + 54 = 498." },
          { kind: "equal", task: "t5", name: "score_all", value: 524, label: "`score_all` seharusnya 524", msg: "444 + 54 + 18 + 8 = 524 — sama dengan skor pelamar A." },
          { kind: "equal", task: "t6", name: "scores_std", value: [572, 551, 527], label: "`scores_std` seharusnya [572, 551, 527]", msg: "PD 0,05 → 572; PD 0,10 → 551; PD 0,20 → 527 (PDO 20, base 600 @ 50:1)." },
          { kind: "stdout_matches", task: "t6", pattern: "PD=0\\.10 odds=9\\.00 skor=551", label: "Output menampilkan PD 0,10 menjadi skor 551", msg: "Format: PD={pd:.2f} odds={odds:.2f} skor={round(s)}." },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: kapan scorecard, kapan model mentah?",
      prose: [
        "Keputusan harus dijelaskan ke nasabah dan regulator? Scorecard — tiap poin bisa dilacak ke bin dan WoE-nya.",
        "Fitur baru yang belum punya bin? Jangan paksakan ke scorecard — latih dulu model mentahnya (LR/GBM), ukur IV-nya, baru buat bin setelah polanya stabil.",
        "IV fitur di bawah 0,02? Jangan masukkan ke scorecard — ia tidak prediktif, hanya menambah noise dan kerumitan.",
        "IV fitur ≥ 0,5? Jangan langsung buang — selidiki dulu: leakage atau sinyal yang memang kuat? PAY_0 (0,8761) lolos penyelidikan; fitur yang memakai info masa depan tidak.",
        "Band skor tidak monoton di validasi? Kembali ke tabel WoE — cari bin kecil atau bin yang WoE-nya melompat, perbaiki bin-nya, hitung ulang.",
        "Peta M2.3 — apa yang menanti. Kalibrasi dan threshold bisnis: probabilitas yang jujur (reliability diagram, Brier), confusion matrix pada threshold 0,10, dan tabel kebijakan yang mengubah threshold menjadi profit. Peta konsep saja — pengajaran penuhnya di lesson berikut.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: tiga pelamar, satu scorecard",
      prose: [
        "Tiga pelamar dari Lab 2 — A (524), B (444), C (519) — sekarang menjadi keputusan. Band default rate dari langkah 6 [notebook]: 520+ → 0,0892; 500–519 → 0,1508; di bawah 460 → 0,6993.",
        "A: skor 524, band 520+, default rate band 0,0892. Keputusan: setujui — risikonya di bawah 1 dari 10. B: skor 444, band di bawah 460, default rate band 0,6993. Keputusan: tolak — 7 dari 10 nasabah di band ini default; menyetujui B berarti menerima risiko yang hampir pasti merugi.",
        "C: skor 519, band 500–519, default rate band 0,1508. Keputusan: setujui bersyarat — risikonya 1,5 dari 10, di tengah. Syaratnya bisa berupa limit lebih kecil, agunan, atau monitoring lebih ketat. Inilah gunanya band: bukan hanya «ya/tidak», melainkan «ya, dengan syarat apa».",
        "Perhatikan apa yang TIDAK dilakukan scorecard: ia tidak memakai PD individu tiap pelamar — ia memakai default rate band-nya. Itu penyederhanaan yang disengaja: skor individu diterjemahkan ke risiko kelompok, dan keputusan diambil pada level kelompok. Ketepatannya lebih kasar dari LR — tapi penjelasannya jauh lebih mudah.",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab: WoE, IV, dan scorecard di data UCI",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m22-guided-task.ipynb.",
        "Di notebook itu kamu menghitung WoE dan IV semua fitur dari dataset UCI 30.000 nasabah (bukan dari tabel yang sudah jadi), membangun scorecard tiga fitur, memvalidasi monotonitas band skor, dan membandingkan IV tiap fitur dengan band yang kontinu — lengkap dengan checks yang menegaskan tiap langkah.",
        "Tautan Colab:",
        "Buka di Colab: https://colab.research.google.com/drive/1pTgaTvxQETcZTDibwzffmjzDNbrsaSii",
        "Jalur file notebook: colab/mlf-m22-guided-task.ipynb.",
        "Companion full-code untuk topik yang memetakan ke proyek nyata: notebook credit scoring end-to-end di Colab: https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO — di sana scorecard dan reason codes dipakai menjelaskan penolakan tiap nasabah.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint: model yang bisa dijumlahkan tangan",
      prose: [
        "Rangkuman: binning mengubah fitur menjadi kelompok; WoE mengukur tiap bin, IV mengukur tiap fitur; band IV kontinu dari «tidak prediktif» sampai «curigai». Scorecard: poin = 20 × WoE, skor = 500 + jumlah poin. Tiga pelamar: A 524, B 444, C 519 — dan band skornya monoton: 0,6993, 0,3511, 0,1508, 0,0892.",
      ],
      tasks: [],
      quiz: [
        {
          q: "WoE sebuah bin bernilai positif. Apa artinya?",
          options: [
            { text: "Bin itu berisi lebih banyak default daripada lancar", why: "Itu WoE negatif — porsi default lebih besar dari porsi lancar." },
            { text: "Bin itu berisi lebih banyak lancar daripada default, relatif terhadap populasi", why: "Benar: WoE = ln(porsi lancar / porsi default) — positif berarti porsi lancarnya lebih besar.", correct: true },
            { text: "Bin itu tidak prediktif", why: "WoE jauh dari nol justru menandakan bin yang prediktif; WoE dekat nol yang tidak prediktif." },
            { text: "Bin itu pasti mengandung leakage", why: "WoE positif saja bukan bukti leakage — leakage dinilai dari IV yang sangat tinggi plus asal fiturnya." },
          ],
        },
        {
          q: "PAY_0 IV 0,8761. Masuk band apa, dan apa tindakannya?",
          options: [
            { text: "Kuat — langsung pakai tanpa periksa", why: "0,8761 ≥ 0,5 — bandnya bukan «kuat» (0,3 ≤ IV < 0,5), melainkan «curigai»." },
            { text: "Curigai — selidiki dulu, lalu putuskan", why: "Benar: band IV ≥ 0,5 berkata «curigai». Di sini penyelidikan lolos — PAY_0 Sep 2005 memprediksi default Okt 2005, bukan info masa depan.", correct: true },
            { text: "Lemah — jangan dipakai", why: "0,8761 adalah IV tertinggi di lesson ini — jauh dari lemah." },
            { text: "Tidak prediktif — buang", why: "Tidak prediktif adalah band di bawah 0,02; 0,8761 adalah kebalikannya." },
          ],
        },
        {
          q: "Berapa poin scorecard untuk PAY_0 = 2?",
          options: [
            { text: "+13", why: "Itu poin PAY_0 = 0." },
            { text: "−12", why: "Itu poin PAY_0 = 1." },
            { text: "−41", why: "Benar: round(20 × −2,0654) = −41.", correct: true },
            { text: "−48", why: "Itu poin PAY_0 = 3." },
          ],
        },
        {
          q: "Pelamar A (PAY_0 = 0, LIMIT 200–300 ribu, AGE 26–35) mendapat skor berapa?",
          options: [
            { text: "444", why: "Itu skor pelamar B." },
            { text: "519", why: "Itu skor pelamar C." },
            { text: "524", why: "Benar: 500 + 13 + 8 + 3 = 524 — band 520+.", correct: true },
            { text: "500", why: "Itu skor dasar sebelum poin ditambahkan." },
          ],
        },
        {
          q: "EDUCATION kode 0: 14 baris, 0 default. Apa yang harus dilakukan sebelum menghitung WoE?",
          options: [
            { text: "Hitung saja — WoE-nya nol", why: "WoE-nya tak terdefinisi: porsi default nol membuat ln tak terhingga." },
            { text: "Gabungkan bin itu ke bin tetangga", why: "Benar: bin dengan nol default (atau nol lancar) harus digabung dulu — WoE tidak bisa dihitung dari pembagian dengan nol.", correct: true },
            { text: "Hapus 14 baris itu dari dataset", why: "Menghapus data karena tidak nyaman adalah manipulasi — gabungkan binnya, jangan buang barisnya." },
            { text: "Beri WoE 0 secara manual", why: "WoE 0 berarti bin itu netral — padahal 14 baris tanpa default belum membuktikan apa-apa." },
          ],
        },
        {
          q: "IV SEX 0,0092. Apa kesimpulannya?",
          options: [
            { text: "Kuat — wajib masuk scorecard", why: "0,0092 jauh di bawah ambang kuat (0,3)." },
            { text: "Sedang — boleh dipertimbangkan", why: "Sedang adalah 0,1 ≤ IV < 0,3; 0,0092 jauh di bawah itu." },
            { text: "Di bawah 0,02 — tidak prediktif", why: "Benar: 0,0092 masuk band «tidak prediktif» — jangan masukkan SEX ke scorecard.", correct: true },
            { text: "Curigai — periksa leakage", why: "Curigai adalah band 0,5 ke atas; 0,0092 adalah ujung sebaliknya." },
          ],
        },
        {
          q: "Kontribusi IV bin PAY_0 = 2 adalah 0,5012; IV total PAY_0 0,8761. Berapa persen IV total yang berasal dari bin ini?",
          options: [
            { text: "5,7 persen", why: "Itu 0,0501/0,8761 — kontribusi bin 1, bukan bin 2." },
            { text: "57,2 persen", why: "Benar: 0,5012 / 0,8761 = 0,572 — lebih dari separuh kekuatan PAY_0 datang dari satu bin: telat 2 bulan.", correct: true },
            { text: "87,6 persen", why: "Itu IV totalnya sendiri (0,8761), bukan proporsi bin 2." },
            { text: "50,1 persen", why: "0,5012 adalah kontribusi IV-nya, bukan persennya — persennya 0,5012/0,8761." },
          ],
        },
        {
          q: "PAY_0 dan PAY_DELAY_COUNT masing-masing IV di atas 0,8. Mengapa keduanya tidak otomatis dimasukkan bersama ke scorecard?",
          options: [
            { text: "Karena IV-nya terlalu tinggi — keduanya pasti leakage", why: "IV ≥ 0,5 berarti «curigai, selidiki dulu» — dan di sini keduanya lolos penyelidikan (bukan leakage)." },
            { text: "Karena keduanya mengukur keterlambatan yang sama — memasukkan keduanya berarti double-counting", why: "Benar: PAY_0 dan PAY_DELAY_COUNT mengukur hal yang hampir sama; IV tidak melihat korelasi antar fitur — memasukkan keduanya menggandakan sinyal yang sama.", correct: true },
            { text: "Karena scorecard hanya boleh memakai satu fitur", why: "Scorecard lesson ini memakai tiga fitur (PAY_0, LIMIT_BAL, AGE) — bukan satu." },
            { text: "Karena IV keduanya bila dijumlah melebihi 1", why: "IV boleh melebihi 1 — tidak ada batas atas seperti itu; masalahnya korelasi, bukan jumlahnya." },
          ],
        },
      ],
      summary: [
        "Binning: tiap bin butuh n cukup; bin dengan nol default/lancar digabung dulu.",
        "WoE = ln(porsi lancar / porsi default); IV menjumlahkan semua bin satu fitur.",
        "Band IV kontinu: IV < 0,02 tidak prediktif; 0,02 ≤ IV < 0,1 lemah; 0,1 ≤ IV < 0,3 sedang; 0,3 ≤ IV < 0,5 kuat; IV ≥ 0,5 curigai.",
        "Scorecard: poin = round(20 × WoE), skor = 500 + jumlah poin; A 524, B 444, C 519.",
        "Band skor monoton: 0,6993 → 0,3511 → 0,1508 → 0,0892; korelasi skor-default −0,4204.",
        "Scorecard standar: skor = offset + factor × ln(odds good/bad); PDO 20, base 600 @ 50:1 → factor 28,8539, offset 487,1229.",
        "Reason codes = 2–4 poin terendah; counterfactual PAY_0 2→0 menaikkan skor B +54 (444 → 498).",
        "Fairness audit per grup: approval SEX=2 0,3007 vs SEX=1 0,2614 (AIR 1,1502), bad rate approved hampir sama; IV SEX rendah tidak membuktikan fair.",
        "Wilson 95%: rate dari n kecil punya interval lebar — 1,0000 dari n = 2 berarti [0,3424; 1,0000].",
      ],
      next: { label: "Lanjut: MLF-M2.3 — PD, LGD, EAD & Expected Loss", href: "/v2/learn/mlf-m23-pd-lgd-ead-expected-loss" },
    },
  ],
};
