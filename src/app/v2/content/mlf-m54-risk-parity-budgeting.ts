import type { V2Lesson } from "../lib/types";

export const mlfM54: V2Lesson = {
  slug: "mlf-m54-risk-parity-budgeting",
  track: "Machine Learning Finance",
  module: "Optimization & portfolio construction",
  title: "MLF-M5.4 — Risk Parity & Risk Budgeting: Membagi Risiko, Bukan Modal",
  estMinutes: 60,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Modul M5 adalah optimasi & konstruksi portofolio: dari frontier efisien (M5.1), gradient descent (M5.2), dan regularisasi kovarians (M5.3), kita sampai di pertanyaan yang lebih jujur: optimasi yang meminimalkan volatilitas atau memaksimalkan Sharpe itu mengoptimalkan ANGKA — tapi apakah ia membagi RISIKO dengan adil? Lesson ini menjawabnya dengan risk parity: portofolio yang membagi kontribusi risiko sama rata, bukan modal sama rata.",
        "Tujuan lesson ini:",
        "• Membedakan alokasi MODAL dan alokasi RISIKO — dan kenapa bobot sama tidak berarti risiko sama.",
        "• Menghitung marginal contribution dan risk contribution tiap aset: RC_i = w_i (Σw)_i / σ_p, dengan teorema Euler Σ RC_i = σ_p.",
        "• Menjelaskan equal risk contribution (ERC): tiap aset menyumbang tepat 1/n dari risiko portofolio.",
        "• Menghitung portofolio risk parity dari data pin: bobot [0,398; 0,3212; 0,2808], RC shares persis 1/3 tiap aset, return −0,1575, vol 0,3037, Sharpe −0,6833.",
        "• Membandingkan empat portofolio (GMV, risk parity, equal-weight, max-Sharpe) pada return, vol, Sharpe, dan RC shares-nya — risk parity duduk di tengah.",
        "• Menjelaskan risk budgeting: target RC yang TIDAK sama, contoh target [0,5; 0,3; 0,2] [ilustrasi].",
        "• Menjembatani M4.4: component VaR sebagai risk budgeting dengan VaR — UNVR penyumbang terbesar (share 0,4098) meski bobot sama.",
        "• Menilai kapan risk parity menang dan kapan kalah: leverage, bull market, dan konsentrasi risiko tersembunyi.",
        "• Menjalankan dua lab dari nol: optimasi ERC dengan SLSQP, dan tabel perbandingan empat portofolio beserta RC-nya.",
        "Isi lesson: cerita investor yang membagi modal sama rata → marginal & risk contribution → equal risk contribution → hitung risk parity dari data pin → bandingkan 4 portofolio → risk budgeting → jembatan M4.4 (component VaR) → kapan risk parity menang/kalah → 2 lab → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari data pin M5: BBCA.JK + KLBF.JK + UNVR.JK, 481 harga penutupan 2024-11-01 sampai 2026-11-11 (file pin diunduh 2026-11-12), 480 return harian SIMPLE (2024-11-04 s.d. 2026-11-11), rf = 0,05. Return tahunan: BBCA −0,2445, KLBF −0,2570, UNVR 0,0796; vol tahunan: BBCA 0,3449, KLBF 0,4251, UNVR 0,5014; korelasi: BBCA–KLBF 0,3488, BBCA–UNVR 0,2774, KLBF–UNVR 0,2897. Catatan basis: semua angka vol/Sharpe/RP di lesson ini memakai SIMPLE return — berbeda basis dengan VaR95 parametrik M4.4 (0,0324) yang memakai LOG return; keduanya dilabeli di langkah 8, jangan dicampur.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Membagi modal sama rata — lalu kaget melihat risikonya",
      prose: [
        "Bayangkan kamu mengelola dana Rp100 juta di tiga saham: BBCA, KLBF, UNVR. Supaya «adil», kamu bagi modal sama rata: Rp33,3 juta tiap saham — portofolio equal-weight. Di kepalamu, risikonya terbagi rata juga: sepertiga-sepertiga-sepertiga. Masuk akal, kan? Modal sama, risiko sama.",
        "Salah. Risiko tidak mengikuti modal — risiko mengikuti VOLATILITAS dan KORELASI. UNVR punya vol tahunan 0,5014, jauh di atas BBCA 0,3449. Satu rupiah di UNVR «bergerak» lebih kasar daripada satu rupiah di BBCA. Hasilnya [notebook]: pada portofolio equal-weight, kontribusi risiko (risk contribution share) BBCA hanya 0,2499, KLBF 0,3364, dan UNVR 0,4137. UNVR — dengan modal yang sama persis — menyumbang 41,37 persen dari seluruh risiko portofolio, sementara BBCA hanya 24,99 persen. «Adil» di modal ternyata timpang di risiko.",
        "Nilai: equal-weight [notebook] — return −0,1406, vol 0,3114, Sharpe −0,6122, RC shares [0,2499; 0,3364; 0,4137]. Baca angka itu sebagai alamat risiko: dari setiap 100 rupiah risiko portofolio, Rp41,37 berasal dari UNVR, Rp33,64 dari KLBF, Rp24,99 dari BBCA. Portofoliomu bukan «sepertiga-sepertiga-sepertiga» — ia adalah portofolio yang 41 persen risikonya adalah UNVR.",
        "Baik atau buruk: equal-weight bagus karena sederhana, tanpa estimasi, dan tanpa optimasi yang rapuh — ia tidak pernah «salah hitung» karena ia tidak menghitung apa-apa. Buruk bila dibaca sebagai diversifikasi yang seimbang: ia menyeimbangkan MODAL, bukan RISIKO — dan di data ini, ketidakseimbangannya besar (0,2499 vs 0,4137, selisih 16,4 poin persentase).",
        "Mitigasi: sebelum menyebut sebuah portofolio «terdiversifikasi», hitung RC shares-nya (langkah 3). Bila satu aset menyumbang lebih dari separuh risiko, portofoliomu sebenarnya adalah taruhan pada aset itu — berapa pun bobot modalnya.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: bobot sama berarti risiko sama",
        type: "pitfall",
        body: "Yang benar: pada equal-weight BBCA/KLBF/UNVR, RC shares-nya [0,2499; 0,3364; 0,4137] — UNVR menyumbang 41,37% risiko dengan bobot yang sama persis (1/3). Bobot mengatur modal; volatilitas dan korelasi mengatur risiko. Keduanya hanya sama bila semua aset punya vol dan korelasi yang sama — di data nyata, hampir tidak pernah.",
      },
    },
    {
      id: "marginal",
      eyebrow: "Langkah 3 · Marginal & risk contribution",
      title: "Marginal contribution: berapa risiko yang ditambah satu rupiah lagi",
      prose: [
        "Untuk membagi risiko, kita harus bisa MENGUKURNYA per aset. Ada dua ukuran yang berpasangan. Pertama, marginal contribution (MC): turunan volatilitas portofolio terhadap bobot aset i — berapa banyak vol portofolio naik bila kamu menambah sedikit bobot aset i. Rumusnya MC_i = (Σw)_i / σ_p, dengan Σ matriks kovarians dan σ_p vol portofolio. Kedua, risk contribution (RC): MC_i dikali bobotnya sendiri — RC_i = w_i · MC_i = w_i (Σw)_i / σ_p. RC_i adalah «jatah risiko» aset i di dalam σ_p.",
        "Teorema Euler menjamin jumlahnya menutup: Σ_i RC_i = σ_p. Volatilitas portofolio bisa dipecah habis menjadi kontribusi tiap aset — tidak ada sisa, tidak ada yang hilang. Itulah yang membuat risk budgeting mungkin: kamu bisa menargetkan jatah risiko tiap aset, karena jatah-jatah itu dijumlahkan menjadi totalnya.",
        "Nilai — contoh hitung pada portofolio equal-weight [notebook]: σ_p = 0,3114. Marginal contribution: BBCA 0,2334, KLBF 0,3143, UNVR 0,3865. Artinya, menambah bobot UNVR menaikkan vol portofolio paling banyak per satu satuan bobot — UNVR adalah aset yang paling «mahal» dari sisi risiko. Risk contribution: BBCA 0,0778, KLBF 0,1048, UNVR 0,1288 — jumlahnya 0,3114 = σ_p (Euler menutup). Dalam share: 0,2499 / 0,3364 / 0,4137.",
        "Cara membaca MC: MC UNVR 0,3865 berarti bila bobot UNVR naik 0,01 (1 poin persentase, dengan bobot lain TETAP (ceteris paribus)), vol portofolio naik kira-kira 0,01 × 0,3865 ≈ 0,0039 — hampir dua kali lipat efek yang sama pada BBCA (0,01 × 0,2334 ≈ 0,0023). Aset yang sama bobotnya bisa punya «harga risiko» yang sangat berbeda.",
        "Baik atau buruk: dekomposisi RC bagus karena ia mengubah vol — satu angka yang kabur — menjadi alamat: aset mana yang menyumbang berapa. Buruk bila dibaca sebagai «risiko aset itu sendiri»: RC UNVR 0,1288 bukan vol UNVR (0,5014) — ia adalah kontribusi UNVR SETELAH diversifikasi dan korelasi dengan dua aset lain. RC adalah milik portofolio, bukan milik aset.",
        "Mitigasi: laporkan RC shares (RC_i / σ_p) berdampingan dengan bobot, setiap kali kamu melaporkan portofolio. Dua portofolio dengan bobot yang sama persis bisa punya RC yang berbeda bila kovariansnya berubah — dan RC-lah yang berkata «siapa yang sebenarnya menggerakkan risikomu» saat pasar bergejolak.",
      ],
      formula: String.raw`RC_i = \frac{w_i (\Sigma w)_i}{\sigma_p} \quad \text{dan} \quad \sum_i RC_i = \sigma_p`,
      formulaNote: "RC_i = risk contribution aset i (dalam satuan vol); MC_i = (Σw)_i / σ_p adalah marginal contribution-nya; RC_i = w_i · MC_i. Share-nya: RC_i / σ_p, dan jumlah share = 1. Euler: vol portofolio terpecah habis menjadi kontribusi tiap aset.",
      tasks: [],
    },
    {
      id: "erc",
      eyebrow: "Langkah 4 · Equal risk contribution",
      title: "Equal risk contribution: tiap aset menyumbang tepat 1/n risiko",
      prose: [
        "Risk parity adalah jawaban atas pertanyaan langkah 2: bila equal-weight timpang di risiko, portofolio apa yang SEIMBANG di risiko? Jawabannya: equal risk contribution (ERC) — portofolio yang tiap asetnya menyumbang tepat 1/n dari total risiko. Dengan 3 aset, tiap aset menyumbang tepat 1/3: RC shares [0,3333; 0,3333; 0,3333]. Tidak ada aset yang mendominasi risiko, tidak ada aset yang jadi penumpang.",
        "Kondisinya sederhana ditulis, tidak sepele dicari: RC_1 = RC_2 = … = RC_n = σ_p / n. Bobotnya TIDAK sama — justru bobotlah yang menyesuaikan diri sampai RC-nya sama. Aset bervol rendah harus diberi bobot LEBIH BESAR agar kontribusi risikonya bisa menyamai aset bervol tinggi. Itulah kenapa, di data ini, BBCA — vol terendah (0,3449) — mendapat bobot TERBESAR (0,398), sementara UNVR — vol tertinggi (0,5014) — mendapat bobot TERKECIL (0,2808). Rumus kasarnya: bobot berbanding terbalik dengan vol — tapi korelasi (0,3488 / 0,2774 / 0,2897) menggesernya dari rumus kasar itu, sehingga bobot pastinya hanya bisa dicari lewat optimasi (langkah 5 dan lab 1).",
        "Nilai: ERC adalah SATU titik — bukan keluarga portofolio. Syaratnya n − 1 persamaan (RC_1 = RC_2, RC_2 = RC_3, …) untuk n bobot yang jumlahnya 1: dengan kovarians definit positif dan long-only, solusinya unik. Tidak ada «ERC yang lebih ERC» — begitu RC shares-nya 1/3 semua, kamu sudah sampai.",
        "Baik atau buruk: ERC bagus bila kamu tidak percaya pada perkiraan return — ia tidak memakai μ sama sekali, hanya kovarians. Di data ini, itu berarti ia tidak perlu percaya bahwa UNVR akan terus naik (+0,0796) sementara BBCA/KLBF jatuh (−0,2445 / −0,2570). Buruk bila return memang bisa diperkirakan: ERC mengabaikan informasi return sepenuhnya, sehingga ia tidak akan pernah «mengejar» aset yang return-nya tinggi — ia sengaja buta terhadap return.",
        "Mitigasi: jangan pakai ERC sebagai pengganti pandangan return — pakai sebagai jangkar. Bila pandanganmu kuat (misal UNVR memang lebih baik), risk budgeting (langkah 7) membiarkanmu menargetkan RC yang tidak sama — ERC adalah kasus khususnya, bukan satu-satunya jawaban.",
      ],
      formula: String.raw`RC_1 = RC_2 = \dots = RC_n = \frac{\sigma_p}{n}`,
      formulaNote: "Kondisi equal risk contribution: tiap aset menyumbang 1/n dari vol portofolio. Bobot w dicari lewat optimasi (lab 1) — bukan dari rumus tertutup, karena korelasi antar-aset menggeser bobot dari sekadar 1/vol.",
      tasks: [],
      note: {
        title: "Miskonsepsi: risk parity berarti bobotnya sama rata",
        type: "pitfall",
        body: "Yang benar: bobot risk parity di data ini [0,398; 0,3212; 0,2808] — TIDAK sama rata. Yang sama rata adalah KONTRIBUSI RISIKO-nya (1/3 tiap aset). Menyamakan bobot (equal-weight) justru menghasilkan RC yang timpang [0,2499; 0,3364; 0,4137]. «Parity» di risk parity adalah parity RISIKO, bukan parity MODAL.",
      },
    },
    {
      id: "hitung",
      eyebrow: "Langkah 5 · Hitung risk parity dari data pin",
      title: "Risk parity di data pin: bobot [0,398; 0,3212; 0,2808], RC persis 1/3",
      prose: [
        "Sekarang hitung. Optimasi ERC pada kovarians tahunan data pin (SIMPLE return, 480 hari) dengan SLSQP — meminimalkan jumlah kuadrat selisih tiap RC dari rata-ratanya, long-only, bobot jumlah 1 — menghasilkan bobot risk parity [0,398; 0,3212; 0,2808] [notebook]. BBCA 0,398 (terbesar — vol terendah), KLBF 0,3212, UNVR 0,2808 (terkecil — vol tertinggi). Dan RC shares-nya: [0,3333; 0,3333; 0,3333] — persis sepertiga tiap aset, sampai 4 desimal.",
        "Nilai [notebook]: return −0,1575, vol 0,3037, Sharpe −0,6833 (rf = 0,05). Perhatikan: return-nya negatif — risk parity tidak menjanjikan return positif; ia menjanjikan KESEIMBANGAN risiko. Di periode ini dua dari tiga saham jatuh dalam (BBCA −0,2445, KLBF −0,2570), jadi portofolio apa pun yang memegang keduanya akan negatif — yang membedakan portofolio hanyalah SEBERAPA negatif dan SEBERAPA berisiko.",
        "Gambar di bawah membandingkan bobot dan RC share tiap aset pada portofolio risk parity. Garis putus-putus menandai RC = 1/3. Perhatikan: bar bobotnya bertingkat (0,398 → 0,3212 → 0,2808), sementara bar RC-nya rata — itulah gambar dari definisi ERC: bobot menyesuaikan, risiko menyamaratakan.",
        "Baik atau buruk: risk parity bagus sebagai portofolio «tanpa pandangan» — ia tidak bertaruh pada satu saham pun, dan RC yang seimbang berarti tidak ada satu aset yang bisa menghancurkan portofolio sendirian. Buruk bila dibaca sebagai «aman»: vol 0,3037 masih tinggi — ini portofolio saham murni, bukan portofolio rendah-risiko. Menyeimbangkan risiko TIDAK SAMA dengan menghilangkan risiko.",
        "Mitigasi: bila vol 0,3037 terlalu tinggi untuk toleransimu, jawabannya bukan «cari ERC yang lebih aman» — tidak ada. Jawabannya adalah mencampur aset BEBAS RISIKO (kas) atau aset berkorelasi rendah — risk parity mengatur pembagian risiko ANTAR aset berisiko, bukan total risiko portofolio.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar bobot vs RC share risk parity: bobot BBCA 0,398 KLBF 0,3212 UNVR 0,2808; RC share ketiganya 0,3333">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Risk parity: bobot berbeda, risk contribution sama (1/3)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="170.8" x2="52" y2="170.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="173.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,1</text>
<line x1="48" y1="135.6" x2="52" y2="135.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="138.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="100.4" x2="52" y2="100.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="103.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,3</text>
<line x1="48" y1="65.2" x2="52" y2="65.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="68.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="52" y1="88.7" x2="466" y2="88.7" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="58" y="82.0" text-anchor="start" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">RC = 1/3</text>
<rect x="85" y="65.9" width="45" height="140.1" fill="var(--c1)"/>
<text x="107.5" y="61.9" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,398</text>
<rect x="135" y="88.7" width="45" height="117.3" fill="var(--c2)"/>
<text x="157.5" y="84.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3333</text>
<text x="130" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">BBCA</text>
<rect x="215" y="92.9" width="45" height="113.1" fill="var(--c1)"/>
<text x="237.5" y="87.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3212</text>
<rect x="265" y="88.7" width="45" height="117.3" fill="var(--c2)"/>
<text x="287.5" y="84.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3333</text>
<text x="260" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">KLBF</text>
<rect x="345" y="107.2" width="45" height="98.8" fill="var(--c1)"/>
<text x="367.5" y="103.2" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,2808</text>
<rect x="395" y="88.7" width="45" height="117.3" fill="var(--c2)"/>
<text x="417.5" y="84.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3333</text>
<text x="390" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">UNVR</text>
</svg>`,
        alt: "Bar bobot vs RC share risk parity: bobot BBCA 0,398, KLBF 0,3212, UNVR 0,2808; RC share ketiganya 0,3333.",
        caption: "Cara membaca: tiap pasangan bar = satu aset; bar pertama (gelap) = bobot, bar kedua (terang) = RC share [notebook]; garis putus-putus = RC 1/3. Interpretasi: bobot bertingkat mengikuti kebalikan vol (BBCA terbesar), RC-nya rata persis — itulah equal risk contribution.",
      },
      tasks: [],
    },
    {
      id: "banding",
      eyebrow: "Langkah 6 · Empat portofolio berdampingan",
      title: "GMV, risk parity, equal-weight, max-Sharpe: empat jawaban, empat pembagian risiko",
      prose: [
        "Satu data, empat portofolio — dan masing-masing mengoptimalkan hal yang berbeda. GMV (global minimum variance) meminimalkan vol; max-Sharpe memaksimalkan Sharpe; equal-weight menyamakan modal; risk parity menyamakan kontribusi risiko. Tabelnya [notebook]:",
        "GMV — bobot [0,5523; 0,2699; 0,1777], return −0,1903, vol 0,2966, Sharpe −0,81, RC shares [0,5526; 0,27; 0,1774]. Vol TERENDAH dari keempatnya — tapi lihat RC-nya: BBCA menyumbang 55,26 persen risiko. GMV menekan vol dengan cara menumpuk pada aset bervol rendah (BBCA 0,5523) — dan tumpukan itu berarti risikonya ikut menumpuk di BBCA.",
        "Risk parity — bobot [0,398; 0,3212; 0,2808], return −0,1575, vol 0,3037, Sharpe −0,6833, RC shares [0,3333; 0,3333; 0,3333]. Vol-nya 0,3037 — hanya 0,0071 di atas GMV (0,2966) dan 0,0077 di bawah equal-weight (0,3114). Ia membayar «premi» vol yang kecil (0,0071 vs GMV) untuk keseimbangan risiko yang sempurna.",
        "Equal-weight — bobot [1/3; 1/3; 1/3], return −0,1406, vol 0,3114, Sharpe −0,6122, RC shares [0,2499; 0,3364; 0,4137]. Return TERTINGGI di antara ketiganya yang long-only dan terdiversifikasi — tapi RC-nya justru timpang: UNVR 41,37 persen (bahkan GMV lebih timpang, 55,26% di BBCA).",
        "Max-Sharpe — bobot [0; 0; 1], return 0,0796, vol 0,5014, Sharpe 0,059, RC shares [0; 0; 1]. Satu-satunya yang return-nya positif dan Sharpe-nya positif — karena ia menaruh SEMUA modal di UNVR, satu-satunya saham yang naik. Dan RC-nya [0; 0; 1]: 100 persen risiko di satu aset. Itu bukan portofolio — itu taruhan satu saham yang dibungkus rumus optimasi.",
        "Gambar di bawah membandingkan volatilitas keempatnya. Perhatikan: risk parity duduk di tengah — di antara GMV (terendah) dan equal-weight — sementara max-Sharpe jauh di atas semuanya (0,5014). Vol yang rendah saja tidak membuktikan portofolio yang baik: GMV paling rendah vol-nya tapi tetap menyimpan konsentrasi 55,26% di BBCA (Max-Sharpe bahkan 100% di UNVR).",
        "Baik atau buruk: perbandingan ini bagus karena ia memaksa satu pertanyaan jujur — «apa yang kamu optimalkan?» — sebelum melihat angka. Buruk bila dibaca sebagai ranking: tidak ada yang «menang» mutlak; GMV menang di vol, max-Sharpe menang di return/Sharpe, risk parity menang di keseimbangan, equal-weight menang di kesederhanaan. Pemenangnya tergantung pada apa yang kamu pedulikan.",
        "Mitigasi: laporkan SELALU keempat kolom — return, vol, Sharpe, DAN RC shares — saat membandingkan portofolio. Tanpa kolom RC, GMV terlihat «terbaik» (vol terendah) dan max-Sharpe terlihat «terbaik» (Sharpe tertinggi) — padahal keduanya menyembunyikan konsentrasi risiko yang ekstrem.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar volatilitas tahunan: GMV 0,2966; risk parity 0,3037; equal-weight 0,3114; max-Sharpe 0,5014">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Volatilitas tahunan: risk parity 0,3037 — di antara GMV dan equal-weight</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="174.0" x2="52" y2="174.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="177.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,1</text>
<line x1="48" y1="142.0" x2="52" y2="142.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="145.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="110.0" x2="52" y2="110.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="113.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,3</text>
<line x1="48" y1="78.0" x2="52" y2="78.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="81.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="46.0" x2="52" y2="46.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="49.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<rect x="85" y="111.1" width="55" height="94.9" fill="var(--c1)"/>
<text x="112.5" y="107.1" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,2966</text>
<text x="112.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GMV</text>
<rect x="180" y="108.8" width="55" height="97.2" fill="var(--c4)"/>
<text x="207.5" y="104.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3037</text>
<text x="207.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Risk parity</text>
<rect x="275" y="106.3" width="55" height="99.7" fill="var(--c1)"/>
<text x="302.5" y="102.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3114</text>
<text x="302.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Equal-weight</text>
<rect x="370" y="45.5" width="55" height="160.5" fill="var(--c2)"/>
<text x="397.5" y="41.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5014</text>
<text x="397.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Max-Sharpe</text>
</svg>`,
        alt: "Bar volatilitas tahunan: GMV 0,2966; risk parity 0,3037; equal-weight 0,3114; max-Sharpe 0,5014.",
        caption: "Cara membaca: tiap bar = vol tahunan satu portofolio [notebook]; risk parity (0,3037, ditandai) duduk di antara GMV (0,2966) dan equal-weight (0,3114), jauh di bawah max-Sharpe (0,5014). Interpretasi: vol rendah saja tidak membuktikan portofolio baik — GMV paling rendah vol-nya tapi RC-nya tetap terkonsentrasi di satu aset (BBCA 0,5526; Max-Sharpe bahkan 100% di UNVR).",
      },
      tasks: [],
    },
    {
      id: "budgeting",
      eyebrow: "Langkah 7 · Risk budgeting",
      title: "Risk budgeting: target RC tidak harus sama — kamu yang menentukan jatahnya",
      prose: [
        "ERC menyamakan jatah risiko. Risk budgeting menggeneralisasi: kamu MENENTUKAN jatahnya. Misal kamu percaya BBCA adalah jangkar portofolio — paling stabil, paling likuid — dan kamu mau ia menanggung separuh risiko, KLBF 30 persen, UNVR 20 persen. Target RC shares: [0,5; 0,3; 0,2]. Pertanyaannya sama seperti ERC — bobot berapa yang menghasilkan jatah itu? — hanya targetnya yang berubah.",
        "Contoh [ilustrasi] — target RC [0,5; 0,3; 0,2] pada kovarians data pin: bobot hasil optimasi [0,5157; 0,2910; 0,1932], RC shares persis [0,5; 0,3; 0,2], return −0,1855, vol 0,2970, Sharpe −0,7931. Perhatikan dua hal. Pertama, target RC BUKAN bobot: target BBCA 0,5 menghasilkan bobot 0,5157 — dekat tapi tidak sama, karena korelasi menggesernya (BBCA berkorelasi 0,3488 dengan KLBF dan 0,2774 dengan UNVR, jadi sebagian «risiko BBCA» sebenarnya datang dari bergerak bersama yang lain). Kedua, vol-nya 0,2970 — nyaris sama dengan GMV (0,2966), hanya 0,0004 di atasnya — dan return-nya −0,1855, lebih rendah dari risk parity (−0,1575): menaikkan jatah risiko BBCA berarti menaikkan bobot saham yang return-nya −0,2445.",
        "Nilai: risk budgeting adalah kerangka, bukan satu portofolio. ERC adalah kasus khususnya (target 1/n). GMV dan max-Sharpe juga bisa DIBACA sebagai risk budgeting — hanya saja target RC-nya tidak dipilih, melainkan HASIL dari optimasi lain: GMV «menargetkan» RC [0,5526; 0,27; 0,1774] tanpa pernah meniatkannya; max-Sharpe «menargetkan» [0; 0; 1]. Membaca portofolio apa pun lewat RC shares-nya adalah cara tercepat untuk tahu apa yang sebenarnya ia pertaruhkan.",
        "Baik atau buruk: risk budgeting bagus karena ia memisahkan DUA keputusan yang sering tercampur: «berapa risiko yang boleh ditanggung tiap aset?» (keputusan kebijakan, bisa ditulis di IPS) dan «bobot berapa yang mewujudkannya?» (keputusan optimasi). Buruk bila targetnya ditetapkan tanpa alasan: target [0,5; 0,3; 0,2] yang dipilih «karena terasa bagus» sama arbitrernya dengan bobot [0,5; 0,3; 0,2] yang dipilih «karena terasa bagus» — bedanya hanya pada apa yang diarbitrerkan.",
        "Mitigasi: tulis target RC beserta ALASANNYA (misal: «BBCA 50% karena ia jangkar likuiditas; UNVR 20% karena vol-nya tertinggi») dan tinjau berkala — kovarians berubah, jadi bobot yang mewujudkan target yang sama ikut berubah. Risk budgeting bukan sekali hitung lalu lupa; ia adalah kebijakan yang di-rebalance.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: target risk budget sama dengan bobot",
        type: "pitfall",
        body: "Yang benar: target RC BBCA 0,5 [ilustrasi] menghasilkan bobot 0,5157 — bukan 0,5. Target RC adalah jatah RISIKO, bukan jatah MODAL; bobot yang mewujudkannya selalu digeser oleh korelasi. Bila korelasinya nol dan semua vol sama, bobotnya mengikuti akar target (w_i ∝ √r_i) — untuk target [0,5; 0,3; 0,2] bobotnya [0,4154; 0,3218; 0,2628], bukan [0,5; 0,3; 0,2]. Hanya untuk target SAMA RATA bobot dan target berimpit (keduanya 1/3). Di data nyata, korelasi menggesernya lebih jauh.",
      },
    },
    {
      id: "jembatan",
      eyebrow: "Langkah 8 · Jembatan M4.4",
      title: "Component VaR: risk budgeting dengan VaR, bukan dengan vol",
      prose: [
        "Semua yang kita hitung sejauh ini memakai VOLATILITAS sebagai ukuran risiko. Tapi risk budgeting tidak terikat pada vol — ia bekerja pada ukuran risiko APA PUN yang bisa dipecah dengan teorema Euler. Di M4.4 kamu sudah bertemu salah satunya: component VaR. Sekarang kita membacanya sebagai risk budgeting.",
        "Nilai [notebook, M4.4]: portofolio equal-weight, VaR95 parametrik 0,0324 — component VaR BBCA 0,0082, KLBF 0,0109, UNVR 0,0133; jumlahnya 0,0324 (Euler menutup). Share-nya: BBCA 0,2532, KLBF 0,3370, UNVR 0,4098 (dihitung dari komponen tak-dibulatkan — membagi komponen bulat 0,0082/0,0109/0,0133 langsung memberi 0,2531/0,3364/0,4105). Marginal VaR: BBCA 0,0246, KLBF 0,0328, UNVR 0,0398. Bacaan yang sama seperti langkah 2, dengan ukuran risiko yang berbeda: UNVR penyumbang risiko terbesar (40,98%) meski bobotnya sama (1/3) — karena vol-nya tertinggi. Dua ukuran risiko yang berbeda (vol dan VaR) sepakat tentang siapa penyumbang terbesarnya.",
        "LABELI BASISNYA — ini penting dan sering dilanggar: VaR95 0,0324 di M4.4 dihitung dari LOG return (VaR = 1,6449 × vol harian log return), sedangkan semua vol/Sharpe/RC di lesson ini dihitung dari SIMPLE return tahunan. Keduanya benar, keduanya mengukur hal yang sama secara konseptual, tapi ANGKA-nya tidak bisa dibandingkan langsung: 0,0324 adalah VaR HARIAN (satu hari, log return), 0,3037 adalah vol TAHUNAN (simple return). Membandingkan «VaR 0,0324 lebih kecil dari vol 0,3037» adalah membandingkan apel harian dengan jeruk tahunan.",
        "Kenapa dua ukuran ini bisa sepakat? Karena VaR parametrik pada dasarnya adalah vol yang dikali konstanta (1,6449) — urutan penyumbangnya mengikuti urutan marginal contribution-nya, yang mengikuti vol dan korelasi. Bila ukuran risikonya berubah (misal Expected Shortfall, yang memberi bobot lebih pada ekor), urutannya BISA berubah — dan itulah gunanya mengulang budgeting pada beberapa ukuran risiko: portofolio yang seimbang di vol belum tentu seimbang di ekor.",
        "Baik atau buruk: component VaR bagus karena ia berbicara dalam bahasa yang dipahami manajemen risiko — «berapa rupiah yang dipertaruhkan tiap aset pada hari buruk» — bukan dalam bahasa vol yang abstrak. Buruk bila dibaca sebagai «risiko total»: VaR95 hanya memotong di persentil 95 — ia tidak berkata apa-apa tentang seberapa buruk hari-hari di luar 5 persen itu (itu tugas Expected Shortfall, M4.2).",
        "Mitigasi: jalankan budgeting pada DUA ukuran risiko — vol (untuk hari biasa) dan VaR/ES (untuk hari buruk) — dan laporkan keduanya dengan basisnya masing-masing (log vs simple, harian vs tahunan). Bila keduanya sepakat (seperti di sini: UNVR terbesar di keduanya), keyakinanmu bertambah; bila bertentangan, kamu baru menemukan sesuatu.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: VaR 0,0324 «lebih kecil» dari vol 0,3037, jadi VaR meremehkan risiko",
        type: "pitfall",
        body: "Yang benar: 0,0324 adalah VaR95 HARIAN dari LOG return; 0,3037 adalah vol TAHUNAN dari SIMPLE return. Keduanya tidak berada pada skala yang sama — VaR harian 0,0324 setara dengan vol harian kira-kira 0,0197, dan vol tahunan 0,3037 setara dengan vol harian kira-kira 0,0191. Setelah disamakan skalanya, keduanya bercerita sama. Selalu samakan basis (log vs simple) dan horizon (harian vs tahunan) sebelum membandingkan dua angka risiko.",
      },
    },
    {
      id: "menang-kalah",
      eyebrow: "Langkah 9 · Kapan menang, kapan kalah",
      title: "Kapan risk parity menang — dan kapan ia kalah telak",
      prose: [
        "Risk parity terdengar seperti jawaban final: seimbang, tanpa pandangan, tanpa taruhan tunggal. Tapi ia punya tiga kelemahan yang harus kamu ketahui SEBELUM memakainya — ketiganya terlihat di data pin ini.",
        "Pertama, LEVERAGE. Risk parity klasik (di dana nyata) sering memakai leverage: karena aset bervol rendah (obligasi) diberi bobot besar, return-nya rendah, jadi manajer meminjam untuk menaikkan return ke target. Leverage mengubah segalanya: ia melipatgandakan kerugian di hari buruk dan menimbulkan risiko pendanaan (margin call). Di lesson ini kita memakai risk parity TANPA leverage (bobot jumlah 1) — return-nya −0,1575, apa adanya. Bila seseorang menunjukkan risk parity «ber-return tinggi», tanyakan dulu berapa leverage-nya.",
        "Kedua, BULL MARKET TERKONSENTRASI. Di periode ini, UNVR satu-satunya saham yang naik (+0,0796) — dan max-Sharpe yang menaruh segalanya di UNVR menghasilkan +0,0796, sementara risk parity −0,1575 dan equal-weight −0,1406. Bila satu aset mendominasi return pasar, portofolio yang menyeimbangkan risiko PASTI tertinggal dari portofolio yang terkonsentrasi di aset itu. Risk parity membeli asuransi terhadap «aku salah pilih aset» — dan premi asuransi itu dibayar dalam return yang tertinggal saat satu aset melesat.",
        "Ketiga, KONSENTRASI RISIKO TERSEMBUNYI. RC shares yang seimbang [1/3, 1/3, 1/3] mengukur risiko lewat kovarians HISTORIS — dan kovarians itu mengasumsikan korelasi 0,28–0,35 yang stabil. Di hari krisis (ingat M4.5: 16 Oktober 2026, semua jatuh bersamaan), korelasi melonjak mendekati 1 — dan ketiga aset yang «seimbang» itu jatuh bersamaan. Risk parity menyeimbangkan risiko IDIOSINKRATIK antar-aset; ia tidak melindungi dari risiko SISTEMATIS yang menghantam semuanya sekaligus. Tiga saham IDX yang berbeda sektor pun tetap saham Indonesia — «diversifikasi» di dalamnya punya batas.",
        "Nilai: bandingkan return-nya [notebook] — max-Sharpe +0,0796, equal-weight −0,1406, risk parity −0,1575, GMV −0,1903. Urutan return ini BUKAN urutan «kualitas»: ia adalah urutan «seberapa banyak UNVR yang dipegang» (max-Sharpe 100%, equal-weight 33%, risk parity 28%, GMV 18%). Di periode di mana UNVR satu-satunya yang naik, return portofolio hampir sepenuhnya ditentukan oleh bobot UNVR — dan risk parity, dengan bobot UNVR terkecil kedua (0,2808), membayarnya.",
        "Baik atau buruk: risk parity bagus sebagai JANGKAR — portofolio yang kamu pegang saat kamu tidak tahu apa-apa dan tidak mau bertaruh. Buruk sebagai JANJI — ia tidak menjanjikan return, tidak menjanjikan vol rendah, dan tidak melindungi dari krisis sistematis. Yang ia janjikan hanyalah satu hal: tidak ada satu aset pun yang mendominasi risikomu.",
        "Mitigasi: pakai risk parity sebagai inti (core) portofolio, bukan keseluruhannya — dan tentukan total risiko lewat alokasi ke kas/aset bebas risiko, bukan lewat leverage. Uji ketahanannya dengan stress korelasi (M4.5: korelasi → 0,95, vol naik +33%) SEBELUM percaya pada RC shares yang seimbang.",
      ],
      tasks: [],
      note: {
        title: "Jebakan: «risiko sama» ≠ «return sama»",
        type: "pitfall",
        body: "Yang benar: risk parity menyeimbangkan KONTRIBUSI RISIKO (RC shares 1/3 tiap aset) — ia tidak berkata apa-apa tentang return. Buktinya [notebook]: risk parity return −0,1575, LEBIH RENDAH dari equal-weight −0,1406, padahal risikonya lebih seimbang. RC yang sama tidak menjamin return yang sama — return ditentukan oleh μ tiap aset dan bobotnya, sementara RC ditentukan oleh Σ dan bobotnya. Dua rumus yang berbeda, dua jawaban yang berbeda.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 10 · Lab 1",
      title: "Lab: optimasi ERC dengan SLSQP dari data pin",
      prose: [
        "Sekarang giliranmu menghitung risk parity. Datanya sudah disiapkan: matriks kovarians tahunan (SIMPLE return, 480 hari, data pin) dan return tahunan tiap aset — keduanya [notebook]. Tugasmu: lengkapi fungsi risk_contrib (RC_i = w_i · (Σw)_i — TAK-TERNORMALISASI, tanpa dibagi σ_p; share = RC/vol²) dan erc_objective (jumlah kuadrat selisih tiap RC dari rata-rata RC), lalu SLSQP mencari bobot yang meminimalkan objektif itu — long-only, bobot jumlah 1.",
        "Hasilnya [lab]: bobot risk parity [0,3981; 0,3212; 0,2808], RC shares [0,3333; 0,3333; 0,3333], return −0,1575, vol 0,3037, Sharpe −0,6833 — sama dengan angka kanonis di langkah 5 (bobot BBCA tercetak 0,3981 di lab ini karena presisi penuh; nilai kanonis membulatkannya menjadi 0,398).",
        "Perhatikan `options={\"ftol\": 1e-12, \"maxiter\": 1000}` pada minimize — toleransi default SLSQP terlalu longgar untuk soal ini: tanpa ftol yang ketat, optimizer berhenti di [0,4006; 0,3224; 0,2770] dengan RC shares [0,3370; 0,3358; 0,3273] — dekat tapi TIDAK sama dengan 1/3. Pelajaran yang lebih umum: solusi optimasi hanya setepat toleransi yang kamu minta; bila targetmu adalah persamaan (RC sama persis), minta toleransi yang sesuai — dan selalu PERIKSA RC shares hasil optimasi, jangan percaya bobotnya saja.",
        "Coba: ubah `ftol` kembali ke default (hapus options) dan lihat seberapa jauh RC shares bergeser dari 1/3. Lalu ubah tebakan awal dari [1/3, 1/3, 1/3] menjadi [0,8; 0,1; 0,1] — apakah SLSQP sampai di bobot yang sama? (Seharusnya ya: ERC long-only solusinya unik.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi risk_contrib (TAK-TERNORMALISASI — tanpa /σ_p): RC_i = w_i * (Sigma w)_i" },
        { id: "t2", text: "Lengkapi erc_objective: jumlah kuadrat selisih tiap RC dari rata-rata RC" },
        { id: "t3", text: "Jalankan dan bandingkan bobot + RC shares dengan angka kanonis (bobot [0,398; 0,3212; 0,2808], RC 1/3 tiap aset)" },
      ],
      requires: ["numpy", "scipy"],
      expected: "bobot risk parity: [0.3981, 0.3212, 0.2808]\nRC shares: [0.3333, 0.3333, 0.3333]\nreturn: -0.1575 vol: 0.3037 Sharpe: -0.6833",
      hints: [
        "Risk contribution: (COV @ w) adalah vektor (Σw); kalikan unsur-demi-unsur dengan w — di numpy, w * (COV @ w).",
        "Objektif ERC: jumlahkan (rc - rc.mean()) ** 2 — nol hanya bila semua RC sama besar.",
        "Jangan ubah options ftol: tanpa ftol 1e-12, SLSQP berhenti di [0,4006; 0,3224; 0,2770] dan RC shares-nya meleset dari 1/3.",
      ],
      code: {
        starter: `import numpy as np
from scipy.optimize import minimize

# Matriks kovarians tahunan (SIMPLE return, 480 hari, data pin) — [notebook]
COV = np.array([
    [0.118956, 0.051145, 0.047974],
    [0.051145, 0.180734, 0.061751],
    [0.047974, 0.061751, 0.251375],
])
MU = np.array([-0.24453, -0.25698, 0.07960])  # return tahunan [notebook]
RF = 0.05

def risk_contrib(w):
    # TODO: RC_i = w_i * (Sigma w)_i  (TAK-TERNORMALISASI: tanpa /sigma_p; share = rc/vol^2)
    return np.zeros(3)

def erc_objective(w):
    rc = risk_contrib(w)
    # TODO: jumlah kuadrat selisih tiap RC dari rata-rata RC
    return 0.0

cons = {"type": "eq", "fun": lambda w: np.sum(w) - 1}
res = minimize(erc_objective, [1 / 3, 1 / 3, 1 / 3], method="SLSQP",
               bounds=[(0, 1)] * 3, constraints=cons,
               options={"ftol": 1e-12, "maxiter": 1000})
w_rp = res.x
vol = float(np.sqrt(w_rp @ COV @ w_rp))
rc = risk_contrib(w_rp)
shares = rc / (vol ** 2)
ret = float(w_rp @ MU)
sharpe = (ret - RF) / vol
print(f"bobot risk parity: [{w_rp[0]:.4f}, {w_rp[1]:.4f}, {w_rp[2]:.4f}]")
print(f"RC shares: [{shares[0]:.4f}, {shares[1]:.4f}, {shares[2]:.4f}]")
print(f"return: {ret:.4f} vol: {vol:.4f} Sharpe: {sharpe:.4f}")`,
        lockLines: 13,
        solution: `import numpy as np
from scipy.optimize import minimize

# Matriks kovarians tahunan (SIMPLE return, 480 hari, data pin) — [notebook]
COV = np.array([
    [0.118956, 0.051145, 0.047974],
    [0.051145, 0.180734, 0.061751],
    [0.047974, 0.061751, 0.251375],
])
MU = np.array([-0.24453, -0.25698, 0.07960])  # return tahunan [notebook]
RF = 0.05

def risk_contrib(w):
    return w * (COV @ w)

def erc_objective(w):
    rc = risk_contrib(w)
    return float(np.sum((rc - rc.mean()) ** 2))

cons = {"type": "eq", "fun": lambda w: np.sum(w) - 1}
res = minimize(erc_objective, [1 / 3, 1 / 3, 1 / 3], method="SLSQP",
               bounds=[(0, 1)] * 3, constraints=cons,
               options={"ftol": 1e-12, "maxiter": 1000})
w_rp = res.x
vol = float(np.sqrt(w_rp @ COV @ w_rp))
rc = risk_contrib(w_rp)
shares = rc / (vol ** 2)
ret = float(w_rp @ MU)
sharpe = (ret - RF) / vol
print(f"bobot risk parity: [{w_rp[0]:.4f}, {w_rp[1]:.4f}, {w_rp[2]:.4f}]")
print(f"RC shares: [{shares[0]:.4f}, {shares[1]:.4f}, {shares[2]:.4f}]")
print(f"return: {ret:.4f} vol: {vol:.4f} Sharpe: {sharpe:.4f}")`,
        checks: [
          { kind: "equal", task: "t3", name: "w_rp", value: [0.398, 0.3212, 0.2808], tol: 0.001, label: "`w_rp` seharusnya mendekati [0,398; 0,3212; 0,2808]", msg: "Bobot risk parity kanonis: BBCA 0,398, KLBF 0,3212, UNVR 0,2808." },
          { kind: "equal", task: "t3", name: "shares", value: [0.3333, 0.3333, 0.3333], tol: 0.002, label: "`shares` seharusnya [0,3333; 0,3333; 0,3333]", msg: "RC shares persis 1/3 tiap aset — equal risk contribution tercapai." },
          { kind: "stdout_matches", task: "t3", pattern: "bobot risk parity: \\[0\\.3981, 0\\.3212, 0\\.2808\\]", label: "Output menampilkan bobot risk parity [0,3981; 0,3212; 0,2808]", msg: "Format: bobot risk parity: [0.3981, 0.3212, 0.2808]." },
          { kind: "stdout_matches", task: "t3", pattern: "return: -0\\.1575 vol: 0\\.3037 Sharpe: -0\\.6833", label: "Output menampilkan return −0,1575 vol 0,3037 Sharpe −0,6833", msg: "Format: return: -0.1575 vol: 0.3037 Sharpe: -0.6833." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 11 · Lab 2",
      title: "Lab: tabel perbandingan 4 portofolio + risk contribution-nya",
      prose: [
        "Lab kedua membangun tabel langkah 6 dari nol. Bobot keempat portofolio sudah ditulis eksplisit (kanonis [notebook]) — tugasmu hanya satu: lengkapi RC shares di dalam fungsi stats(), lalu baca tabelnya.",
        "Hasilnya [lab]: GMV ret=−0,1903 vol=0,2966 Sharpe=−0,8100 RC=[0,5526; 0,2700; 0,1774]; Risk parity ret=−0,1575 vol=0,3037 Sharpe=−0,6832 RC=[0,3333; 0,3334; 0,3334]; Equal-weight ret=−0,1406 vol=0,3114 Sharpe=−0,6122 RC=[0,2499; 0,3364; 0,4137]; Max-Sharpe ret=0,0796 vol=0,5014 Sharpe=0,0590 RC=[0,0000; 0,0000; 1,0000].",
        "Dua catatan tentang angka lab ini. Pertama, Sharpe risk parity tercetak −0,6832 — bukan −0,6833 seperti nilai kanonis — karena bobot dan MU di lab dibulatkan ke 4 desimal; nilai kanonis presisi penuhnya −0,6833 [notebook]. Selisih 0,0001 ini adalah harga pembulatan literal, bukan kesalahan hitung — dan justru pelajaran: angka yang kamu baca selalu setepat inputnya. Kedua, RC max-Sharpe tercetak [0,0000; 0,0000; 1,0000]: 100 persen risiko di UNVR — tabel ini membuat «taruhan satu saham» itu terlihat hitam di atas putih.",
        "Bacaan yang jujur: tidak ada baris tabel yang «menang» di semua kolom. GMV menang di vol (0,2966) tapi kalah di return (−0,1903) dan konsentrasi RC (BBCA 0,5526). Max-Sharpe menang di return (+0,0796) tapi kalah telak di vol (0,5014) dan konsentrasi (RC 1,0000 di UNVR). Risk parity tidak menang di kolom mana pun — dan justru itu poinnya: ia adalah satu-satunya baris yang TIDAK kalah telak di kolom mana pun.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi RC shares di stats(): shares = w * (Sigma w) / vol^2" },
        { id: "t2", text: "Bandingkan vol keempat portofolio — apakah risk parity (0,3037) duduk di antara GMV (0,2966) dan equal-weight (0,3114)?" },
        { id: "t3", text: "Bandingkan RC shares — mana yang seimbang (1/3 semua), mana yang terkonsentrasi di satu aset?" },
      ],
      requires: ["numpy"],
      expected: "GMV: ret=-0.1903 vol=0.2966 Sharpe=-0.8100 RC=[0.5526, 0.2700, 0.1774]\nRisk parity: ret=-0.1575 vol=0.3037 Sharpe=-0.6832 RC=[0.3333, 0.3334, 0.3334]\nEqual-weight: ret=-0.1406 vol=0.3114 Sharpe=-0.6122 RC=[0.2499, 0.3364, 0.4137]\nMax-Sharpe: ret=0.0796 vol=0.5014 Sharpe=0.0590 RC=[0.0000, 0.0000, 1.0000]",
      hints: [
        "RC shares = risk contribution dibagi vol kuadrat: shares = w * (COV @ w) / vol ** 2 — jumlahnya harus 1.",
        "Cek GMV dulu: RC-nya harus [0,5526; 0,2700; 0,1774] — bila BBCA-mu bukan 0,5526, periksa rumus shares.",
        "Sharpe risk parity di lab ini −0,6832 (kanonis presisi penuh −0,6833) — selisih 0,0001 dari pembulatan literal, bukan kesalahan.",
      ],
      code: {
        starter: `import numpy as np

# Kovarians tahunan + return tahunan (SIMPLE return, data pin) — [notebook]
COV = np.array([
    [0.118956, 0.051145, 0.047974],
    [0.051145, 0.180734, 0.061751],
    [0.047974, 0.061751, 0.251375],
])
MU = np.array([-0.24453, -0.25698, 0.07960])
RF = 0.05

# Bobot kanonis keempat portofolio [notebook]
W = {
    "GMV": [0.5523, 0.2699, 0.1777],
    "Risk parity": [0.398, 0.3212, 0.2808],
    "Equal-weight": [1 / 3, 1 / 3, 1 / 3],
    "Max-Sharpe": [0.0, 0.0, 1.0],
}

def stats(w):
    w = np.array(w, dtype=float)
    ret = float(w @ MU)
    vol = float(np.sqrt(w @ COV @ w))
    sharpe = (ret - RF) / vol
    # TODO: RC shares tiap aset = w_i (Sigma w)_i / vol^2
    shares = np.zeros(3)
    return ret, vol, sharpe, shares

rows = {}
for name, w in W.items():
    ret, vol, sharpe, shares = stats(w)
    rows[name] = (ret, vol, sharpe, shares)
    print(f"{name}: ret={ret:.4f} vol={vol:.4f} Sharpe={sharpe:.4f} RC=[{shares[0]:.4f}, {shares[1]:.4f}, {shares[2]:.4f}]")
rp_shares = rows["Risk parity"][3]
ew_shares = rows["Equal-weight"][3]
gmv_vol = rows["GMV"][1]`,
        lockLines: 24,
        solution: `import numpy as np

# Kovarians tahunan + return tahunan (SIMPLE return, data pin) — [notebook]
COV = np.array([
    [0.118956, 0.051145, 0.047974],
    [0.051145, 0.180734, 0.061751],
    [0.047974, 0.061751, 0.251375],
])
MU = np.array([-0.24453, -0.25698, 0.07960])
RF = 0.05

# Bobot kanonis keempat portofolio [notebook]
W = {
    "GMV": [0.5523, 0.2699, 0.1777],
    "Risk parity": [0.398, 0.3212, 0.2808],
    "Equal-weight": [1 / 3, 1 / 3, 1 / 3],
    "Max-Sharpe": [0.0, 0.0, 1.0],
}

def stats(w):
    w = np.array(w, dtype=float)
    ret = float(w @ MU)
    vol = float(np.sqrt(w @ COV @ w))
    sharpe = (ret - RF) / vol
    shares = w * (COV @ w) / vol ** 2
    return ret, vol, sharpe, shares

rows = {}
for name, w in W.items():
    ret, vol, sharpe, shares = stats(w)
    rows[name] = (ret, vol, sharpe, shares)
    print(f"{name}: ret={ret:.4f} vol={vol:.4f} Sharpe={sharpe:.4f} RC=[{shares[0]:.4f}, {shares[1]:.4f}, {shares[2]:.4f}]")
rp_shares = rows["Risk parity"][3]
ew_shares = rows["Equal-weight"][3]
gmv_vol = rows["GMV"][1]`,
        checks: [
          { kind: "equal", task: "t3", name: "rp_shares", value: [0.3333, 0.3333, 0.3333], tol: 0.002, label: "`rp_shares` seharusnya [0,3333; 0,3333; 0,3333]", msg: "RC shares risk parity: 1/3 tiap aset — seimbang." },
          { kind: "equal", task: "t3", name: "ew_shares", value: [0.2499, 0.3364, 0.4137], tol: 0.002, label: "`ew_shares` seharusnya [0,2499; 0,3364; 0,4137]", msg: "RC shares equal-weight: UNVR 0,4137 terbesar meski bobot sama." },
          { kind: "stdout_matches", task: "t2", pattern: "GMV: ret=-0\\.1903 vol=0\\.2966 Sharpe=-0\\.8100", label: "Output menampilkan baris GMV (ret −0,1903 vol 0,2966)", msg: "Format: GMV: ret=-0.1903 vol=0.2966 Sharpe=-0.8100." },
          { kind: "stdout_matches", task: "t2", pattern: "Max-Sharpe: ret=0\\.0796 vol=0\\.5014 Sharpe=0\\.0590", label: "Output menampilkan baris Max-Sharpe (ret 0,0796 vol 0,5014)", msg: "Format: Max-Sharpe: ret=0.0796 vol=0.5014 Sharpe=0.0590." },
        ],
      },
    },
    {
      id: "colab",
      eyebrow: "Langkah 12 · Guided task di Colab",
      title: "Guided task di Colab: risk parity & risk budgeting di data nyata",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat pada matriks kovarians yang sudah dihitung. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m54-guided-task.ipynb.",
        "Di notebook itu kamu memuat harga BBCA, KLBF, dan UNVR yang sesungguhnya (window 2024-11-01 sampai 2026-11-11; file pin diunduh 2026-11-12), menghitung SIMPLE return 480 hari dan kovarians tahunannya, menghitung marginal & risk contribution portofolio equal-weight (MC 0,2334 / 0,3143 / 0,3865; RC shares 0,2499 / 0,3364 / 0,4137), mengoptimasi ERC dengan SLSQP (bobot [0,398; 0,3212; 0,2808], RC shares persis 1/3, return −0,1575, vol 0,3037, Sharpe −0,6833), membangun tabel perbandingan empat portofolio (GMV, risk parity, equal-weight, max-Sharpe), menyelesaikan risk budgeting target [0,5; 0,3; 0,2] [ilustrasi] (bobot [0,5157; 0,2910; 0,1932]), dan mereplikasi jembatan M4.4 — component VaR dari LOG return (VaR95 0,0324; component 0,0082 / 0,0109 / 0,0133; shares 0,2532 / 0,3370 / 0,4098) — lengkap dengan checks yang menegaskan tiap langkah.",
        "Tautan Colab: https://colab.research.google.com/drive/14clsBe3zFiIRGt5ukTqUpRfgC9sLt7dL",
        "Jalur file notebook: colab/mlf-m54-guided-task.ipynb.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 13 · Checkpoint",
      title: "Checkpoint: bagi risikonya — baru bicara return-nya",
      prose: [
        "Rangkuman: alokasi modal ≠ alokasi risiko — equal-weight [notebook] punya RC shares [0,2499; 0,3364; 0,4137], UNVR 41,37% risiko dengan bobot yang sama (1/3). Risk contribution RC_i = w_i (Σw)_i / σ_p, dan teorema Euler menjamin Σ RC_i = σ_p. Pada equal-weight: MC 0,2334 / 0,3143 / 0,3865, RC 0,0778 / 0,1048 / 0,1288 (jumlah 0,3114 = σ_p). Equal risk contribution: RC shares [1/3; 1/3; 1/3] — bobotnya TIDAK sama rata, justru bobot menyesuaikan sampai RC-nya sama. Risk parity dari data pin [notebook]: bobot [0,398; 0,3212; 0,2808], RC shares persis 1/3 tiap aset, return −0,1575, vol 0,3037, Sharpe −0,6833. Empat portofolio [notebook]: GMV vol terendah 0,2966 tapi RC BBCA 0,5526; risk parity vol 0,3037 di tengah; equal-weight vol 0,3114, RC UNVR 0,4137; max-Sharpe [0; 0; 1] return +0,0796, vol 0,5014, RC [0; 0; 1] — taruhan satu saham. Risk budgeting [ilustrasi]: target RC [0,5; 0,3; 0,2] → bobot [0,5157; 0,2910; 0,1932] — target RC bukan bobot. Jembatan M4.4 [notebook]: component VaR (LOG return) VaR95 0,0324 — BBCA 0,0082 / KLBF 0,0109 / UNVR 0,0133, shares 0,2532 / 0,3370 / 0,4098 — UNVR penyumbang terbesar meski bobot sama; basis LOG return (VaR) vs SIMPLE return (vol) jangan dicampur. Risk parity kalah saat leverage dipakai, saat bull market terkonsentrasi (max-Sharpe +0,0796 vs RP −0,1575), dan saat korelasi melonjak di krisis — RC seimbang tidak melindungi dari risiko sistematis. Dan jebakan yang paling penting: «risiko sama» ≠ «return sama» — RP return −0,1575 lebih rendah dari EW −0,1406 meski risikonya lebih seimbang.",
        "Jembatan ke M5.5: risk parity menyeimbangkan risiko TANPA memakai perkiraan return sama sekali — ia sengaja buta terhadap μ. M5.5 membalik arahnya: bagaimana bila kamu PUNYA pandangan tentang return — dan mau memasukkannya ke optimasi secara eksplisit, tanpa membiarkan optimasi menaruh segalanya di satu aset seperti max-Sharpe di lesson ini?",
      ],
      tasks: [],
      quiz: [
        {
          q: "Portofolio risk parity dari data pin punya RC shares berapa?",
          options: [
            { text: "[0,398; 0,3212; 0,2808] — sama dengan bobotnya", why: "Itu BOBOT-nya, bukan RC shares-nya. Bobot dan RC shares adalah dua hal yang berbeda — justru poin lesson ini." },
            { text: "[0,3333; 0,3333; 0,3333] — persis sepertiga tiap aset", why: "Benar: equal risk contribution berarti tiap aset menyumbang tepat 1/3 dari risiko portofolio.", correct: true },
            { text: "[0,2499; 0,3364; 0,4137] — UNVR paling besar", why: "Itu RC shares EQUAL-WEIGHT, bukan risk parity — UNVR 0,4137 justru menunjukkan equal-weight timpang di risiko." },
            { text: "[0; 0; 1] — semua risiko di satu aset", why: "Itu RC shares MAX-SHARPE (semua di UNVR) — kebalikan dari risk parity." },
          ],
        },
        {
          q: "Mengapa BBCA mendapat bobot risk parity TERBESAR (0,398)?",
          options: [
            { text: "Karena return BBCA tertinggi", why: "Return BBCA justru −0,2445 — kedua terendah. Risk parity tidak memakai return sama sekali." },
            { text: "Karena vol BBCA terendah (0,3449) — aset bervol rendah butuh bobot lebih besar agar kontribusi risikonya menyamai aset bervol tinggi", why: "Benar: bobot berbanding (kasar) terbalik dengan vol — BBCA 0,3449 → 0,398; UNVR 0,5014 → 0,2808.", correct: true },
            { text: "Karena BBCA paling likuid di antara ketiganya", why: "Likuiditas tidak masuk rumus ERC — yang masuk hanya kovarians (vol dan korelasi)." },
            { text: "Karena korelasi BBCA dengan yang lain tertinggi", why: "Korelasi BBCA–KLBF 0,3488 memang tertinggi, tapi itu menggeser bobot dari rumus kasar 1/vol — bukan alasan bobotnya terbesar." },
          ],
        },
        {
          q: "Equal-weight: bobot [1/3; 1/3; 1/3], RC shares [0,2499; 0,3364; 0,4137]. Apa kesimpulan yang paling tepat?",
          options: [
            { text: "Portofolio ini terdiversifikasi sempurna karena bobotnya sama rata", why: "Bobot sama ≠ risiko sama — RC-nya timpang: UNVR 0,4137 vs BBCA 0,2499, selisih 16,4pp." },
            { text: "Bobot sama tidak berarti risiko sama: UNVR menyumbang 41,37% risiko dengan modal yang sama — karena vol-nya tertinggi (0,5014)", why: "Benar: risiko mengikuti vol dan korelasi, bukan modal. UNVR dengan bobot 1/3 menyumbang 41,37% risiko.", correct: true },
            { text: "RC shares harusnya [1/3; 1/3; 1/3] — angkanya salah hitung", why: "Tidak ada yang salah hitung: RC shares equal-weight memang [0,2499; 0,3364; 0,4137] — yang «salah» adalah asumsi bahwa bobot sama memberi RC sama." },
            { text: "UNVR harus dikurangi bobotnya sampai RC-nya 0,2499 seperti BBCA", why: "Menyamakan RC ke 0,2499 bukan target apa-apa — target ERC adalah 1/3 semua, dan itu dicapai risk parity, bukan dengan mengutak-atik equal-weight." },
          ],
        },
        {
          q: "GMV punya vol TERENDAH (0,2966) — tapi RC shares-nya [0,5526; 0,27; 0,1774]. Apa yang benar tentang GMV?",
          options: [
            { text: "GMV adalah portofolio terbaik karena vol-nya terendah", why: "Vol terendah bukan segalanya: 55,26% risikonya ada di BBCA — GMV menekan vol dengan menumpuk pada aset bervol rendah." },
            { text: "GMV meminimalkan vol, bukan menyeimbangkan risiko — 55,26% risikonya terkonsentrasi di BBCA", why: "Benar: GMV mengoptimalkan vol, dan hasilnya menumpuk bobot (0,5523) sekaligus risiko (0,5526) di BBCA.", correct: true },
            { text: "GMV dan risk parity adalah portofolio yang sama", why: "Berbeda: GMV vol 0,2966 RC [0,5526; 0,27; 0,1774]; risk parity vol 0,3037 RC [1/3; 1/3; 1/3]." },
            { text: "GMV seharusnya punya RC 1/3 karena bobotnya paling optimal", why: "Tidak ada yang «seharusnya»: GMV tidak menargetkan RC sama — RC-nya adalah hasil sampingan dari minimisasi vol." },
          ],
        },
        {
          q: "Max-Sharpe: bobot [0; 0; 1], RC shares [0; 0; 1], return +0,0796, vol 0,5014. Apa bacaan yang paling tepat?",
          options: [
            { text: "Max-Sharpe adalah portofolio terbaik — return positif, Sharpe positif (0,059)", why: "Return/Sharpe tertinggi di sini datang dari menaruh 100% modal di UNVR — RC [0; 0; 1] berarti 100% risiko di satu aset. Itu taruhan satu saham, bukan portofolio." },
            { text: "Max-Sharpe menaruh semua risiko di UNVR (RC 1,0000) — ia memenangkan return periode ini karena UNVR satu-satunya saham yang naik", why: "Benar: return +0,0796 = return UNVR itu sendiri; bila UNVR jatuh, portofolio ini jatuh penuh — tidak ada diversifikasi sama sekali.", correct: true },
            { text: "RC [0; 0; 1] membuktikan UNVR aset yang paling aman", why: "Terbalik: UNVR vol-nya TERTINGGI (0,5014) — RC 1,0000 berarti seluruh risiko portofolio adalah risiko UNVR." },
            { text: "Max-Sharpe seharusnya dilarang karena bobotnya mengandung nol", why: "Bobot nol bukan kesalahan — ia adalah hasil optimasi long-only yang sah. Masalahnya bukan nolnya, melainkan konsentrasinya." },
          ],
        },
        {
          q: "Jembatan M4.4: component VaR equal-weight — VaR95 0,0324, component BBCA 0,0082 / KLBF 0,0109 / UNVR 0,0133, shares 0,2532 / 0,3370 / 0,4098. Apa yang harus dilabeli saat membandingkannya dengan angka lesson ini?",
          options: [
            { text: "Tidak ada — VaR dan vol adalah ukuran yang sama", why: "Berbeda: VaR95 0,0324 dihitung dari LOG return (harian), sedangkan vol 0,3037 dari SIMPLE return (tahunan) — basis dan horizonnya berbeda." },
            { text: "Basisnya: VaR M4.4 dari LOG return, vol M5 dari SIMPLE return — dan horizonnya: VaR harian vs vol tahunan; keduanya sepakat UNVR penyumbang terbesar", why: "Benar: 0,0324 adalah VaR95 harian (log return); 0,3037 adalah vol tahunan (simple return). Setelah disamakan skalanya keduanya bercerita sama — UNVR terbesar.", correct: true },
            { text: "VaR 0,0324 membuktikan risiko portofolio hanya 0,0324 — jauh lebih kecil dari vol 0,3037", why: "Salah membandingkan: 0,0324 harian vs 0,3037 tahunan — setelah disamakan ke harian, keduanya sekitar 0,019. Bukan VaR yang «lebih kecil»." },
            { text: "Component VaR tidak bisa dijumlahkan — jumlah 0,0324 itu kebetulan", why: "Bukan kebetulan: teorema Euler menjamin jumlah component VaR = VaR portofolio — 0,0082 + 0,0109 + 0,0133 = 0,0324 persis." },
          ],
        },
        {
          q: "Risk budgeting [ilustrasi]: target RC [0,5; 0,3; 0,2] menghasilkan bobot [0,5157; 0,2910; 0,1932]. Apa pelajarannya?",
          options: [
            { text: "Target RC sama dengan bobot — 0,5 berarti bobot 0,5", why: "Tidak: target BBCA 0,5 menghasilkan bobot 0,5157 — dekat tapi tidak sama, karena korelasi menggesernya." },
            { text: "Target RC adalah jatah RISIKO, bukan jatah modal — bobot yang mewujudkannya digeser korelasi (0,5 → 0,5157)", why: "Benar: bobot 0,5157 ≠ target 0,5; korelasi BBCA dengan KLBF (0,3488) dan UNVR (0,2774) membuat sebagian risiko BBCA datang dari bergerak bersama.", correct: true },
            { text: "Bobot [0,5157; 0,2910; 0,1932] adalah angka kanonis risk budgeting", why: "Bukan kanonis: target [0,5; 0,3; 0,2] adalah contoh [ilustrasi] — bobotnya dihitung dari kovarians data pin untuk target itu, tapi targetnya sendiri adalah pilihan, bukan angka kanonis." },
            { text: "Risk budgeting hanya bisa menargetkan RC yang sama rata (1/3)", why: "Terbalik: menargetkan 1/3 semua adalah ERC — kasus khusus risk budgeting. Risk budgeting justru membebaskan targetnya tidak sama." },
          ],
        },
        {
          q: "Risk parity return −0,1575 — LEBIH RENDAH dari equal-weight −0,1406 — padahal RC-nya lebih seimbang. Dan max-Sharpe +0,0796. Apa pelajarannya?",
          options: [
            { text: "Risk parity gagal — portofolio yang baik harus mengalahkan equal-weight di return", why: "Risk parity tidak pernah menjanjikan return tertinggi — ia menjanjikan keseimbangan risiko. Return ditentukan μ dan bobot, RC ditentukan Σ dan bobot — dua rumus berbeda." },
            { text: "«Risiko sama» ≠ «return sama»: RC yang seimbang tidak menjamin return yang sama — di periode ini return ditentukan bobot UNVR, dan RP memegang UNVR paling sedikit kedua (0,2808)", why: "Benar: return portofolio di periode ini hampir sepenuhnya mengikuti bobot UNVR (satu-satunya saham naik) — RP 0,2808, EW 1/3, MS 1,0 — dan urutan return mengikuti urutan itu.", correct: true },
            { text: "Equal-weight lebih baik dari risk parity dalam segala hal", why: "Tidak: EW menang di return periode ini (−0,1406 vs −0,1575) tapi kalah di keseimbangan risiko (RC UNVR 0,4137 vs 1/3) dan vol (0,3114 vs 0,3037)." },
            { text: "Max-Sharpe membuktikan konsentrasi di satu aset adalah strategi yang benar", why: "Max-Sharpe menang di periode ini KARENA UNVR naik — bila UNVR jatuh, ia jatuh penuh (RC 1,0000). Satu periode bukan bukti strategi." },
          ],
        },
      ],
      summary: [
        "Alokasi modal ≠ alokasi risiko: equal-weight [notebook] RC shares [0,2499; 0,3364; 0,4137] — UNVR 41,37% risiko dengan bobot 1/3.",
        "Risk contribution RC_i = w_i (Σw)_i / σ_p; teorema Euler: Σ RC_i = σ_p. Equal-weight: MC 0,2334 / 0,3143 / 0,3865, RC 0,0778 / 0,1048 / 0,1288 (jumlah 0,3114 = σ_p).",
        "Equal risk contribution: RC shares [1/3; 1/3; 1/3] — bobot TIDAK sama rata, bobotlah yang menyesuaikan sampai RC-nya sama.",
        "Risk parity dari data pin [notebook]: bobot [0,398; 0,3212; 0,2808], RC shares persis 1/3 tiap aset, return −0,1575, vol 0,3037, Sharpe −0,6833.",
        "Empat portofolio [notebook]: GMV vol 0,2966 tapi RC BBCA 0,5526; risk parity vol 0,3037 di tengah; equal-weight vol 0,3114 RC UNVR 0,4137; max-Sharpe [0; 0; 1] return +0,0796 vol 0,5014 RC [0; 0; 1].",
        "Risk budgeting [ilustrasi]: target RC [0,5; 0,3; 0,2] → bobot [0,5157; 0,2910; 0,1932] — target RC bukan bobot.",
        "Jembatan M4.4 [notebook]: component VaR (LOG return) VaR95 0,0324 — BBCA 0,0082 / KLBF 0,0109 / UNVR 0,0133, shares 0,2532 / 0,3370 / 0,4098; basis LOG vs SIMPLE jangan dicampur.",
        "Risk parity kalah saat leverage dipakai, saat bull market terkonsentrasi (max-Sharpe +0,0796 vs RP −0,1575), dan saat korelasi melonjak di krisis; «risiko sama» ≠ «return sama».",
        "Lab: optimasi ERC dengan SLSQP — bobot [0,3981; 0,3212; 0,2808], RC 1/3 semua (ftol 1e-12 wajib — default berhenti di [0,4006; 0,3224; 0,2770]); tabel 4 portofolio — GMV RC BBCA 0,5526, RP 1/3 semua, EW UNVR 0,4137, max-Sharpe RC [0; 0; 1].",
      ],
      next: { label: "Lanjut: MLF-M5.5 — Black-Litterman & Shrinkage", href: "/v2/learn/mlf-m55-black-litterman-shrinkage" },
    },
  ],
};
