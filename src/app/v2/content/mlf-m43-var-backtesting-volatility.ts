import type { V2Lesson } from "../lib/types";

export const mlfM43: V2Lesson = {
  slug: "mlf-m43-var-backtesting-volatility",
  track: "Machine Learning Finance",
  module: "Market risk — backtesting & volatilitas",
  title: "MLF-M4.3 — Backtesting VaR & Volatilitas: Apakah VaR-mu Jujur?",
  estMinutes: 60,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Lesson ini menjawab satu pertanyaan yang menentukan apakah seorang risk manager bisa dipercaya: ketika model VaR-mu bilang «risiko hari ini sekian», apakah kenyataan setuju? VaR yang tidak pernah diuji kebenarannya bukan alat ukur — ia hanya opini yang dicetak rapi.",
        "Tujuan lesson ini:",
        "• Menjelaskan backtesting VaR: membandingkan pelanggaran (exceedance) yang teramati dengan yang diharapkan, lalu menguji selisihnya dengan uji Kupiec.",
        "• Menjelaskan jebakan in-sample: VaR historis yang dihitung dari data yang sama dengan data ujinya SELALU lolos — dan kenapa itu bukan bukti apa-apa.",
        "• Menjalankan backtesting out-of-sample yang jujur: VaR rolling 250 hari, 1-day-ahead, pada 230 hari uji — untuk VaR95 dan VaR99.",
        "• Menjalankan uji Christoffersen: apakah pelanggaran beruntun — transisi n00/n01/n10/n11, LR independensi dan conditional coverage — pada deret exceedance OOS yang sama.",
        "• Membacktest VaR kondisional EWMA dan GARCH out-of-sample pada 230 hari yang sama — frekuensi, Kupiec, dan Christoffersen — dan membaca apa yang masih gagal meski frekuensinya lolos.",
        "• Membaca zona Basel (traffic light) pada 250 hari terakhir: 3 pelanggaran VaR99 berarti GREEN.",
        "• Menjelaskan volatility clustering: autokorelasi squared return, EWMA (λ = 0,94), dan GARCH(1,1) dengan MLE manual — karena paket `arch` tidak tersedia, dan itu justru alasan yang bagus untuk memahami mesinnya.",
        "• Membandingkan VaR kondisional vs tak-kondisional: saat volatilitas sedang tinggi, VaR statis meremehkan risiko tepat ketika risiko itu paling penting.",
        "• Menjalankan dua lab dari nol: uji Kupiec pada 100 hari mainan, dan EWMA pada 6 return mainan — tanpa library, hanya Python standar.",
        "Isi lesson: cerita VaR yang lolos di atas kertas → uji Kupiec → jebakan in-sample → backtesting out-of-sample + zona Basel → uji Christoffersen → volatility clustering → EWMA → GARCH(1,1) → EWMA vs GARCH → backtest EWMA/GARCH → 2 lab → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook M4.3: portofolio equal-weight BBCA, KLBF, UNVR (rebalance harian, dalam Rp), 480 hari perdagangan 2024-11-04 sampai 2026-11-11 [notebook] (dari 481 baris harga 2024-11-01 sampai 2026-11-11; data diunduh dengan batas akhir 2026-11-12 yang eksklusif). ^GSPC dipakai sebagai benchmark dalam USD — efek kurs diabaikan, dan itu dinyatakan sebagai caveat, bukan disembunyikan. Kupiec in-sample: n = 480, pelanggaran 24, ekspektasi 24,0, LR = 0,0000, p = 1,0000 [notebook]. Kupiec out-of-sample (rolling 250 hari, 230 hari uji): VaR95 pelanggaran 15 vs ekspektasi 11,5 (LR = 1,0275, p = 0,3108), VaR99 pelanggaran 4 vs ekspektasi 2,3 (LR = 1,0398, p = 0,3079) [notebook]. Zona Basel 99% pada 250 hari terakhir: 3 pelanggaran → GREEN [notebook]. Christoffersen VaR95 OOS: LR independensi 6,6456 (p = 0,0099), LR conditional coverage 7,7056 (p = 0,0212) — TOLAK [notebook]. Backtest OOS EWMA/GARCH (230 hari): EWMA VaR95 12 pelanggaran (LR = 0,0226, p = 0,8806), GARCH VaR95 13 (LR = 0,1980, p = 0,6564), GARCH VaR99 3 (LR = 0,1964, p = 0,6577) [notebook].",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "VaR yang lolos di atas kertas — lalu Oktober 2026 datang",
      prose: [
        "Bayangkan kamu risk manager sebuah portofolio saham Indonesia: BBCA, KLBF, UNVR, bobot sama, rebalance harian. Setiap pagi kamu melaporkan satu angka ke direksi: VaR95 satu hari — «dengan keyakinan 95 persen, kerugian besok tidak akan melebihi sekian». Selama hampir dua tahun angka itu terlihat masuk akal. Lalu Oktober 2026 datang: pasar jatuh, volatilitas meledak, dan kerugian yang «seharusnya» terjadi sekali dalam 20 hari tiba-tiba datang beruntun.",
        "Nilai: pada 480 hari perdagangan 2024-11-04 sampai 2026-11-11, portofolio equal-weight ini punya volatilitas harian 0,0196 (tahunan 0,3114) dan return tahunan −0,1406 [notebook]. VaR95 historisnya 0,0286 — artinya, pada hari biasa, kerugian 1 hari yang melebihi 2,86 persen dari nilai portofolio diharapkan terjadi sekitar 1 dari 20 hari. Di atas Rp100 juta, itu Rp2.856.323 (dihitung dari VaR tak-dibulatkan 0,028563 — memakai 0,0286 yang dibulatkan hasilnya Rp2.860.000). Tapi angka itu adalah rata-rata atas dua tahun — dan dua tahun itu tidak homogen: ada masa tenang dan ada masa badai.",
        "Baik atau buruk: VaR bagus sebagai BAHASA bersama — satu angka yang bisa dibandingkan antar hari, antar portofolio, antar bank. Buruk bila dibaca sebagai jaminan: VaR95 TIDAK berkata «kerugian maksimum 2,86 persen» — ia berkata «5 persen hari akan lebih buruk dari ini, dan seberapa buruknya tidak dikatakan VaR». Dan buruk bila VaR-nya statis sementara volatilitasnya bergerak: volatilitas BBCA yang diukur EWMA pada hari terakhir mencapai 0,0366 per hari (tahunan 0,5804) — hampir dua kali rata-rata EWMA-nya 0,0200 [notebook]. VaR yang dihitung dari rata-rata dua tahun meremehkan risiko tepat di hari-hari ketika risiko itu paling besar. Catatan pembulatan: angka tahunan 0,3114 dan 0,5804 dihitung dari daily tak-dibulatkan (0,019617 × √252 = 0,3114; 0,036561 × √252 = 0,5804) — mengalikan daily yang dibulatkan tidak persis sama.",
        "Mitigasi: jangan pernah menerima VaR tanpa backtesting — dan jangan pernah menerima backtesting tanpa tahu apakah ia in-sample atau out-of-sample. Itulah isi lesson ini: cara menguji VaR dengan jujur, dan cara membuat VaR yang mengikuti volatilitas saat ini, bukan volatilitas rata-rata dua tahun lalu.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: VaR95 berarti kerugian tidak akan melebihi angka itu",
        type: "pitfall",
        body: "Yang benar: VaR95 adalah kuantil — 5 persen hari DIHARAPKAN lebih buruk dari VaR. Bila dalam 100 hari tidak ada satu pun pelanggaran, itu bukan bukti VaR-mu bagus; itu justru patut dicurigai — mungkin VaR-mu terlalu konservatif, atau (lebih sering) ujinya in-sample dan hasilnya sudah diatur oleh konstruksinya sendiri. Pelanggaran 0 dari 100 hari pada VaR95 juga sebuah sinyal, bukan sebuah prestasi.",
      },
    },
    {
      id: "kupiec",
      eyebrow: "Langkah 3 · Uji Kupiec",
      title: "Kupiec: likelihood-ratio test untuk frekuensi pelanggaran",
      prose: [
        "Backtesting VaR paling sederhana bertanya satu hal: apakah pelanggaran terjadi sesering yang dijanjikan VaR? VaR95 menjanjikan pelanggaran pada 5 persen hari (p = 0,05). Bila dari n hari kamu mengamati x pelanggaran, maka frekuensi teramati adalah x/n. Uji Kupiec (1995) membandingkan dua penjelasan atas data itu: penjelasan H0 — pelanggaran terjadi dengan probabilitas p yang dijanjikan — melawan penjelasan H1 — pelanggaran terjadi dengan probabilitas x/n yang teramati. Statistik ujinya adalah likelihood ratio (LR) di antara keduanya.",
        "Nilai: rumus LR Kupiec memakai dua likelihood binomial — satu dengan p yang dijanjikan, satu dengan p yang teramati. Bila x sama dengan ekspektasi n×p, kedua likelihood sama dan LR = 0 — tidak ada bukti melawan H0. Bila x jauh dari ekspektasi, LR membesar. Di bawah H0, LR menyebar kira-kira seperti chi-square dengan 1 derajat kebebasan, sehingga p-value = P(chi2(1) ≥ LR). Aturan keputusan yang dipakai di lesson ini: tolak H0 (VaR tidak jujur) bila p < 0,05; bila p ≥ 0,05, H0 TIDAK ditolak — yang berarti «tidak ada bukti VaR-mu bohong», bukan «terbukti VaR-mu benar».",
        "Gambar dan angka konkretnya ada di langkah 4 dan 5 — di sana kamu akan melihat LR = 0,0000 dengan p = 1,0000 (in-sample, jebakan) dan LR ≈ 1,03 dengan p ≈ 0,31 (out-of-sample, lolos dengan jujur). Dua hasil yang sama-sama «tidak ditolak» dengan arti yang sangat berbeda.",
        "Baik atau buruk: Kupiec bagus karena sederhana, punya rumus tertutup, dan langsung menjawab pertanyaan yang paling mendasar — «apakah frekuensinya benar?». Buruk karena ia HANYA menguji frekuensi, bukan independensi: pelanggaran yang datang beruntun lima hari berturut-turut (clustering) bisa lolos Kupiec selama jumlah totalnya tepat. Pelanggaran beruntun adalah sinyal bahwa model VaR-mu tidak bereaksi terhadap volatilitas — dan Kupiec tidak akan memberitahumu.",
        "Mitigasi: pakai Kupiec sebagai gerbang pertama, bukan gerbang terakhir. Langkah lanjutnya bernama uji Christoffersen: ia menambahkan uji independensi (apakah pelanggaran hari ini bergantung pada pelanggaran kemarin) di samping uji frekuensi Kupiec. Langkah 6 mengajarkannya penuh: uji Christoffersen menambahkan uji independensi (apakah pelanggaran hari ini bergantung pada pelanggaran kemarin) di samping uji frekuensi Kupiec.",
      ],
      formula: String.raw`LR_{POF} = -2\ln\left[(1-p)^{n-x} p^{x}\right] + 2\ln\left[\left(1-\frac{x}{n}\right)^{n-x} \left(\frac{x}{n}\right)^{x}\right]`,
      formulaNote: "Statistik LR Kupiec (proportion of failures): n = jumlah hari, x = jumlah pelanggaran, p = probabilitas pelanggaran yang dijanjikan VaR (0,05 untuk VaR95). Di bawah H0, LR ~ chi2(1); p-value = P(chi2(1) ≥ LR). Tolak H0 bila p < 0,05.",
      tasks: [],
      note: {
        title: "Miskonsepsi: p-value besar berarti VaR terbukti benar",
        type: "pitfall",
        body: "Yang benar: p = 0,31 berarti «data ini masih masuk akal bila VaR-mu jujur» — bukan «VaR-mu terbukti jujur». Uji statistik tidak pernah membuktikan H0; ia hanya gagal menolaknya. Dan p = 1,0000 (seperti di langkah 4) bukan bukti terkuat — justru sebaliknya, ia adalah tanda bahwa ujinya tidak menguji apa-apa.",
      },
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 4 · Jebakan in-sample",
      title: "Kupiec in-sample: VaR historis SELALU lolos — dan itu bukan bukti",
      prose: [
        "Sekarang jebakannya. Ambil seluruh 480 hari portofolio, hitung VaR95 historis dari data itu sendiri — kuantil 5 persen dari 480 return — lalu uji VaR itu pada 480 hari YANG SAMA. Hasilnya terlihat sempurna: n = 480, pelanggaran 24, ekspektasi 24,0, LR = 0,0000, p = 1,0000 [notebook]. Nol koma nol. p-value satu koma nol nol nol nol. Seolah VaR-mu adalah model paling jujur yang pernah ada.",
        "Nilai: pelanggaran 24 dari 480 hari sama persis dengan ekspektasi 480 × 0,05 = 24,0 [notebook]. Itu BUKAN kebetulan yang beruntung — itu konstruksi. VaR historis didefinisikan sebagai kuantil 5 persen dari data itu sendiri, sehingga BY DEFINITION sekitar 5 persen observasi berada di bawahnya. Menguji VaR historis pada data yang sama dengan data pembentuknya sama seperti menguji kunci pada pintu yang kuncinya dibuat dari pintu itu: pasti cocok, dan tidak membuktikan apa-apa tentang pintu lain.",
        "Baik atau buruk: backtesting in-sample bagus untuk SATU hal — memeriksa apakah kode hitungmu benar (bila in-sample saja gagal, ada bug). Buruk sebagai bukti validitas model: ia tidak menguji kemampuan model memprediksi hari yang BELUM dilihat. VaR yang «lolos» in-sample lalu dipakai untuk modal, limit, atau laporan regulator adalah VaR yang belum pernah diuji — hanya belum pernah gagal di cermin.",
        "Mitigasi: aturan keras — VaR HARUS diuji out-of-sample: hitung VaR dari jendela masa lalu, uji pada hari BERIKUTNYA yang tidak ikut menghitung VaR itu, geser jendela maju satu hari, ulangi. Itulah yang dilakukan langkah 5: rolling 250 hari, 1-day-ahead, 230 hari uji. Dan bila seseorang menunjukkan hasil backtesting yang «sempurna» (p = 1,0000), pertanyaan pertamamu bukan «bagaimana caranya?» melainkan «apakah ini in-sample?».",
      ],
      tasks: [],
      note: {
        title: "Jebakan metodologi: p = 1,0000 adalah alarm, bukan piala",
        type: "pitfall",
        body: "p-value 1,0000 berarti data cocok SEMPURNA dengan H0 — dalam data riil yang berisik, kesempurnaan seperti itu hampir tidak pernah terjadi secara alami. Bila kamu melihatnya, curigai konstruksi ujinya dulu: apakah VaR dihitung dari data yang sama dengan data ujinya? Di lesson ini jawabannya ya — dan itulah pelajaran yang disengaja.",
      },
    },
    {
      id: "oos",
      eyebrow: "Langkah 5 · Backtesting out-of-sample + zona Basel",
      title: "Kupiec out-of-sample: rolling 250 hari, 230 hari uji — dan zona Basel",
      prose: [
        "Ini backtesting yang jujur. Prosedurnya: untuk tiap hari ke-t dari hari ke-251 sampai ke-480, hitung VaR historis dari 250 hari SEBELUMNYA, lalu periksa apakah return hari ke-t menembus VaR itu. VaR hari ini tidak pernah «melihat» return hari ini. Total 230 hari uji — dan setiap harinya adalah ujian yang belum pernah dilihat model.",
        "Nilai: VaR95 — pelanggaran 15 dari 230 hari, ekspektasi 11,5, LR = 1,0275, p = 0,3108 → H0 TIDAK ditolak [notebook]. VaR99 — pelanggaran 4 dari 230 hari, ekspektasi 2,3, LR = 1,0398, p = 0,3079 → H0 TIDAK ditolak [notebook]. Dua-duanya lolos — tapi perhatikan bedanya dengan langkah 4: di sini «tidak ditolak» berarti sesuatu, karena uji ini BISA saja gagal. Pelanggaran 15 vs ekspektasi 11,5 memang di atas harapan, tapi tidak cukup jauh untuk menolak pada taraf 5 persen; begitu pula 4 vs 2,3. Model ini jujur dalam batas yang bisa diuji 230 hari — dan 230 hari memang tidak banyak: dengan ekspektasi hanya 2,3 pelanggaran pada VaR99, satu pelanggaran ekstra sudah menggerakkan LR cukup besar.",
        "Gambar di bawah membandingkan pelanggaran teramati dengan ekspektasi untuk kedua tingkat keyakinan. Baca dengan benar: batang pelanggaran yang sedikit lebih tinggi dari batang ekspektasi adalah hal yang wajar — yang dicari bukan kesamaan sempurna, melainkan selisih yang masih masuk akal secara statistik.",
        "Zona Basel: regulator memakai aturan yang lebih kasar tapi lebih tegas — traffic light pada VaR99 selama 250 hari terakhir. Hitung pelanggaran VaR99 (VaR dihitung dari data SEBELUM jendela 250 hari itu) pada 250 hari terakhir: 3 pelanggaran → GREEN [notebook]. Ambangnya: 0–4 hijau (model diterima), 5–9 kuning (model dipertanyakan, ada penalti modal), ≥10 merah (model ditolak). Tiga pelanggaran berada di zona hijau dengan nyaman — tapi ingat, zona Basel menguji frekuensi juga, dan sama butanya dengan Kupiec terhadap clustering — dan langkah 6 menguji persis kebutaan itu.",
        "Baik atau buruk: backtesting rolling bagus karena ia meniru cara model dipakai di produksi — setiap hari VaR dihitung dari masa lalu, diuji pada hari yang baru. Buruk bila jendela uji terlalu pendek: 230 hari hanya memberi ekspektasi 2,3 pelanggaran pada VaR99, sehingga uji VaR99 hampir tidak punya kuasa (power) — ia hampir selalu «tidak menolak», bahkan untuk model yang buruk. Itulah sebabnya regulator memakai 250 hari dan zona, bukan semata p-value.",
        "Mitigasi: laporkan SELALU tiga angka berdampingan — jumlah pelanggaran, ekspektasi, dan p-value — plus panjang jendela uji. «p = 0,31» tanpa «n = 230» adalah angka tanpa konteks: p yang sama pada n = 2.300 akan jauh lebih meyakinkan. Dan jalankan backtesting pada DUA tingkat keyakinan (95 dan 99) — model yang lolos di 95 tapi gagal di 99 memberitahumu bahwa ekornya yang bermasalah, bukan badannya.",
        "Tips: bila kamu menguji VaR di tempat kerja, mulai dari prosedur rolling ini — bukan dari in-sample. Satu skrip yang menghitung VaR dari jendela 250 hari dan menggesernya maju satu hari demi satu hari adalah fondasi seluruh risk reporting yang jujur.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar pelanggaran teramati vs ekspektasi: VaR95 teramati 15 vs ekspektasi 11,5; VaR99 teramati 4 vs ekspektasi 2,3; 230 hari uji">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Kupiec out-of-sample: pelanggaran vs ekspektasi (230 hari uji)</text>
<text x="240.0" y="32" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">batang gelap = teramati · batang terang = ekspektasi (n × p)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="151.0" x2="52" y2="151.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="154.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">5</text>
<line x1="48" y1="96.0" x2="52" y2="96.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="99.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">10</text>
<line x1="48" y1="41.0" x2="52" y2="41.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="44.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">15</text>
<rect x="110" y="41.0" width="70" height="165.0" fill="var(--c4)"/>
<text x="145" y="37.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">15</text>
<rect x="190" y="79.5" width="70" height="126.5" fill="var(--c1)"/>
<text x="225" y="75.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">11,5</text>
<rect x="300" y="162.0" width="70" height="44.0" fill="var(--c4)"/>
<text x="335" y="158.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">4</text>
<rect x="380" y="180.7" width="70" height="25.3" fill="var(--c1)"/>
<text x="415" y="176.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2,3</text>
<text x="180" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">VaR95 · p = 0,3108</text>
<text x="370" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">VaR99 · p = 0,3079</text>
</svg>`,
        alt: "Bar pelanggaran teramati vs ekspektasi: VaR95 teramati 15 vs ekspektasi 11,5; VaR99 teramati 4 vs ekspektasi 2,3; 230 hari uji.",
        caption: "Cara membaca: tiap pasang batang = satu tingkat keyakinan; batang gelap = pelanggaran teramati, batang terang = ekspektasi (230 × p). Interpretasi: pelanggaran di atas ekspektasi pada keduanya (15 vs 11,5; 4 vs 2,3), tapi selisihnya tidak cukup besar untuk menolak — p ≈ 0,31 pada keduanya, H0 tidak ditolak.",
      },
      tasks: [],
    },
    {
      id: "christoffersen",
      eyebrow: "Langkah 6 · Uji Christoffersen",
      title: "Christoffersen: Kupiec lolos, tapi pelanggaran datang beruntun",
      prose: [
        "Kupiec langkah 5 bilang VaR95 historis «lolos»: 15 pelanggaran vs ekspektasi 11,5, p = 0,3108. Tapi lihat TANGGAL pelanggarannya: 26–28 Januari 2026 — TIGA hari beruntun. Lalu 2 dan 4 Maret, 23–24 April, 3 dan 5 Juni, 16 dan 19 Oktober — pelanggaran datang berpasangan, bergerombol di sekitar guncangan. Kupiec tidak melihat ini: ia hanya menghitung jumlah total, bukan urutannya. Lima belas pelanggaran yang tersebar merata dan lima belas pelanggaran yang datang beruntun mendapat nilai Kupiec yang SAMA — padahal bagi risk manager keduanya sangat berbeda: yang beruntun berarti modelmu tidak bereaksi ketika volatilitas meledak, dan kerugian besarmu datang bertubi-tubi.",
        "Nilai: uji Christoffersen (1998) mengubah deret pelanggaran menjadi deret 0/1 — 0 = hari tenang (tidak ada pelanggaran), 1 = pelanggaran — lalu menghitung transisi antar hari yang berurutan. Dari 230 hari uji ada 229 transisi [notebook]: n00 = 203 (tenang setelah tenang), n01 = 11 (pelanggaran setelah tenang), n10 = 11 (tenang setelah pelanggaran), n11 = 4 (pelanggaran setelah pelanggaran). Dua peluang bersyaratnya: π01 = n01 / (n00 + n01) = 11 / 214 = 0,0514 — peluang pelanggaran setelah hari tenang, 5,14 persen, nyaris sama dengan 5 persen yang dijanjikan VaR95. Dan π11 = n11 / (n10 + n11) = 4 / 15 = 0,2667 — peluang pelanggaran setelah pelanggaran: 26,67 persen, LIMA KALI LEBIH BESAR. Setelah satu pelanggaran, pelanggaran berikutnya jauh lebih mungkin — itulah definisi operasional clustering.",
        "Contoh tandingannya: bila 15 pelanggaran tersebar merata — kira-kira satu tiap 15 hari, selisih antar pelanggaran sekitar 15 hari — maka π11 akan mendekati π01, sekitar 0,05, dan uji independensi tidak menolak apa-apa. Yang terjadi di sini justru sebaliknya: selisih antar pelanggaran berurutan adalah 1, 1, 21, 2, 3, 9, 18, 1, 20, 2, 2, 92, 1, 8 hari [notebook] — delapan dari empat belas selisih hanya 1–3 hari. Daftar tanggalnya: 26–28 Jan 2026 (tiga beruntun), 2 Mar, 4 Mar, 9 Mar, 27 Mar, 23–24 Apr, 29 Mei, 3 Jun, 5 Jun, 16 Okt, 19 Okt, 29 Okt [notebook]. Tiga pelanggaran Januari itu saja — 26, 27, 28 — menyumbang 2 dari 4 transisi n11. Clustering di sini bukan abstraksi statistik; ia adalah tiga hari beruntun di mana portofolio menembus VaR tiga kali berturut-turut.",
        "Hasil: statistik LR independensi = 6,6456, p = 0,0099 → TOLAK independensi [notebook]. Uji conditional coverage menggabungkan frekuensi dan independensi — LR_cc = LR_uc + LR_ind = 7,7056, p = 0,0212 → TOLAK [notebook]. (Komponen frekuensinya di sini LR_uc = 1,0601, p = 0,3032 — sedikit berbeda dari Kupiec langkah 5, LR = 1,0275, p = 0,3108, karena Christoffersen menghitung 229 transisi, bukan 230 hari; kesimpulannya sama: frekuensinya tidak bermasalah.) Jadi vonis lengkap atas VaR95 historis rolling: frekuensinya lolos, TAPI modelnya gagal — pelanggaran bergerombol. Kupiec saja akan membiarkan model ini lewat; Christoffersen menangkapnya.",
        "VaR99 memberi kontras yang jujur: n00 = 222, n01 = 3, n10 = 3, n11 = 1; π01 = 0,0133, π11 = 0,2500; LR independensi = 3,9457, p = 0,0470; LR conditional coverage = 5,0006, p = 0,0821 → TIDAK ditolak [notebook]. Tapi baca caveat-nya sebelum lega: n11 = 1 — seluruh «bukti» clustering di VaR99 adalah SATU pasangan beruntun, 26–27 Januari. Satu pasangan itu menggerakkan LR_ind sampai nyaris menolak (p = 0,0470); bila pasangan itu tidak ada, tidak ada apa-apa. Dengan hanya 4 pelanggaran dari 230 hari, uji ini rapuh: «tidak ditolak» di VaR99 berarti «data terlalu sedikit untuk menuduh», bukan «terbukti independen».",
        "Sensitivitas Kupiec VaR99 (n = 230, ekspektasi 2,3): bila pelanggaran x = 2, LR = 0,0413, p = 0,8389; x = 4 (yang teramati), LR = 1,0398, p = 0,3079; x = 6, LR = 4,1667, p = 0,0412 — TOLAK [notebook]. Dua pelanggaran ekstra membalik keputusan: dari «tidak ada bukti» menjadi «tolak». Bandingkan VaR95 (ekspektasi 11,5): x = 11 → p = 0,8789; x = 15 (teramati) → p = 0,3108; x = 19 → p = 0,0372 (tolak). Polanya sama, tapi VaR99 jauh lebih sensitif karena ekspektasinya kecil: tiap pelanggaran ekstra adalah lompatan besar secara relatif. Pelajaran G9: «tidak ditolak» pada VaR99 dengan n = 230 hampir tidak memberi informasi — ia kompatibel dengan model yang jujur MAUPUN model yang pelanggarannya 2,6 kali ekspektasi (x = 6). Bila kamu butuh vonis yang tegas atas ekor 99 persen, butuh jendela uji yang jauh lebih panjang — atau terima bahwa backtesting VaR99 adalah alarm kasar, bukan vonis akhir.",
        "Baik atau buruk: Christoffersen bagus karena ia menguji DUA hal sekaligus — frekuensi (lewat LR_uc) dan independensi (lewat LR_ind) — dan menggabungkannya dalam LR_cc dengan 2 derajat kebebasan. Buruk karena ia tetap butuh data yang cukup: pada VaR99, n11 = 1 membuat uji independensi bergantung pada satu pasangan hari — rapuh, dan p-value-nya tidak boleh dibaca sebagai kepastian. Dan seperti Kupiec, ia menguji pelanggaran sebagai 0/1: BESARNYA kerugian di hari pelanggaran tidak masuk hitungan — untuk itu ada uji besaran (magnitude) dan backtest ES, di luar lesson ini.",
        "Mitigasi: jalankan Christoffersen berdampingan dengan Kupiec pada SETIAP backtest — Kupiec untuk «apakah jumlahnya benar», Christoffersen untuk «apakah urutannya acak». Bila LR_ind menolak (p < 0,05) sementara Kupiec lolos, jangan menaikkan level VaR secara membabi buta: masalahnya bukan levelnya, melainkan modelnya yang tidak mengikuti volatilitas — pindah ke VaR kondisional (EWMA/GARCH, langkah 8–11) dan uji lagi. Bila LR_cc tidak menolak pada VaR99, tulis caveat-nya eksplisit di laporan: «n = 230, ekspektasi 2,3, kuasa rendah — dua pelanggaran ekstra akan membalik keputusan».",
      ],
      formula: String.raw`LR_{ind} = -2\ln\left[(1-\pi)^{n_{00}+n_{10}} \pi^{n_{01}+n_{11}}\right] + 2\ln\left[(1-\pi_{01})^{n_{00}} \pi_{01}^{n_{01}} (1-\pi_{11})^{n_{10}} \pi_{11}^{n_{11}}\right]`,
      formulaNote: "LR independensi Christoffersen: π = (n01+n11)/(n00+n01+n10+n11) = peluang pelanggaran tak-bersyarat; π01 = n01/(n00+n01) = peluang pelanggaran setelah hari tenang; π11 = n11/(n10+n11) = peluang pelanggaran setelah pelanggaran. Di bawah H0 (independen), LR_ind ~ chi2(1). Conditional coverage: LR_cc = LR_uc + LR_ind ~ chi2(2) — LR_uc adalah komponen frekuensi Kupiec pada 229 transisi. Tolak bila p < 0,05.",
      tasks: [],
      quiz: [
        {
          q: "Deret exceedance VaR95 OOS: π01 = 0,0514, π11 = 0,2667. Apa arti kedua angka itu?",
          options: [
            { text: "Setelah hari tenang, peluang pelanggaran besok 5,14 persen; setelah pelanggaran, peluangnya 26,67 persen — pelanggaran bergerombol, independensi ditolak (p = 0,0099)", why: "Benar: π01 = 11/214 dan π11 = 4/15 — peluang pelanggaran lima kali lebih besar setelah pelanggaran daripada setelah hari tenang. Itulah clustering, dan LR_ind = 6,6456 (p = 0,0099) menolak independensi.", correct: true },
            { text: "π11 lima kali π01 berarti VaR terlalu konservatif — level VaR harus diturunkan", why: "Terbalik: π11 yang besar berarti pelanggaran datang beruntun karena model tidak mengikuti volatilitas — masalahnya model, bukan level yang terlalu konservatif." },
            { text: "π01 ≈ 0,05 berarti model lolos sepenuhnya — tidak ada yang perlu diperbaiki", why: "π01 hanya separuh cerita: ia bilang frekuensi setelah hari tenang benar, tapi π11 = 0,2667 bilang urutannya tidak acak — dan conditional coverage menolak (p = 0,0212)." },
            { text: "n11 = 4 terlalu kecil sehingga uji ini tidak berarti apa-apa", why: "Empat transisi beruntun dari 229 transisi sudah cukup memberi LR_ind = 6,6456, p = 0,0099 — kecil tapi signifikan. Yang rapuh adalah VaR99 dengan n11 = 1, bukan VaR95." },
          ],
        },
        {
          q: "Kupiec VaR95 tidak menolak (p = 0,3108) tapi Christoffersen conditional coverage menolak (p = 0,0212). Apa vonis yang benar?",
          options: [
            { text: "VaR terbukti benar karena Kupiec lolos — Christoffersen pasti salah hitung", why: "Kedua uji menguji hal berbeda: Kupiec hanya frekuensi, Christoffersen frekuensi + independensi. Tidak ada yang salah hitung — LR_cc = 7,7056 dihitung dari transisi yang sama." },
            { text: "Frekuensi pelanggaran benar, tapi pelanggaran bergerombol — VaR gagal conditional coverage; perbaiki modelnya (VaR kondisional), bukan sekadar menaikkan level VaR", why: "Benar: LR_uc = 1,0601 (p = 0,3032) bilang frekuensi oke, LR_ind = 6,6456 (p = 0,0099) bilang urutannya tidak acak. Masalahnya model yang diam saat volatilitas bergerak.", correct: true },
            { text: "Naikkan level VaR95 sampai tidak ada lagi pelanggaran beruntun", why: "Menaikkan level menutupi gejala, bukan menyembuhkan penyebab: model statis tetap tidak mengikuti volatilitas, dan pelanggaran akan tetap bergerombol di level baru." },
            { text: "Kedua uji bertentangan, jadi abaikan keduanya dan pakai zona Basel saja", why: "Uji-uji itu tidak bertentangan — mereka menjawab pertanyaan berbeda. Zona Basel pun hanya menguji frekuensi dan sama butanya terhadap clustering." },
          ],
        },
      ],
    },
    {
      id: "clustering",
      eyebrow: "Langkah 7 · Volatility clustering",
      title: "Volatility clustering: hari buruk datang bergerombol",
      prose: [
        "Ada satu fakta tentang return saham yang merusak hampir semua model VaR statis: volatilitas bergerombol. Hari dengan pergerakan besar cenderung diikuti hari dengan pergerakan besar — dan hari tenang diikuti hari tenang. Dalam bahasa statistik: squared return (kuadrat return, proksi volatilitas harian) ber-autokorelasi positif pada lag pendek.",
        "Nilai: autokorelasi squared return portofolio (log return) lag 1 = 0,1043, lag 5 = −0,0094, lag 10 = −0,0099 [notebook]. Baca: guncangan volatilitas kemarin masih terasa hari ini (0,1043 — positif dan jelas), tapi lima hari kemudian jejaknya sudah hilang (−0,0094 — praktis nol), begitu pula sepuluh hari kemudian (−0,0099). Klastering ada, tapi ingatannya pendek: pasar «ingat» guncangan volatilitas selama beberapa hari, bukan beberapa bulan.",
        "Gambar di bawah menunjukkan ketiga autokorelasi itu terhadap garis nol. Lag 1 menjulang positif; lag 5 dan lag 10 menempel di garis nol (sedikit negatif — noise di sekitar nol, bukan anti-klastering yang bermakna).",
        "Baik atau buruk: klastering bagus untuk model yang mengikutinya — bila volatilitas kemarin tinggi, volatilitas hari ini kemungkinan besar tinggi juga, sehingga VaR hari ini SEHARUSNYA lebih besar dari VaR rata-rata. Buruk untuk model yang mengabaikannya: VaR tak-kondisional memakai satu angka volatilitas untuk semua hari — terlalu besar di masa tenang (modal menganggur) dan terlalu kecil di masa badai (tepat ketika kerugian besar datang). Dan inilah alasan pelanggaran VaR beruntun: bukan karena modelnya «sial», melainkan karena volatilitasnya memang bergerombol sementara VaR-nya diam.",
        "Mitigasi: begitu klastering terdeteksi (lag 1 positif), VaR harus dibuat KONDIONAL — mengikuti volatilitas saat ini. Dua cara paling umum: EWMA (langkah 8) dan GARCH (langkah 9). Keduanya menjawab pertanyaan yang sama — «seberapa besar volatilitas HARI INI?» — dengan mesin yang berbeda.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar autokorelasi squared return portofolio: lag 1 0,1043; lag 5 -0,0094; lag 10 -0,0099">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Autokorelasi squared return portofolio — klastering di lag pendek</text>
<line x1="52" y1="40" x2="52" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="200" x2="466" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="182.2" x2="52" y2="182.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="185.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,02</text>
<line x1="48" y1="164.4" x2="52" y2="164.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="167.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="120.0" x2="52" y2="120.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="123.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,05</text>
<line x1="48" y1="75.6" x2="52" y2="75.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="78.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<line x1="52" y1="164.4" x2="466" y2="164.4" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="462" y="158.4" text-anchor="end" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">nol</text>
<rect x="100" y="71.7" width="80" height="92.7" fill="var(--c4)"/>
<text x="140" y="67.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,1043</text>
<rect x="230" y="164.4" width="80" height="8.4" fill="var(--c1)"/>
<text x="270" y="184.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,0094</text>
<rect x="360" y="164.4" width="80" height="8.8" fill="var(--c1)"/>
<text x="400" y="185.2" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,0099</text>
<text x="140" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">lag 1</text>
<text x="270" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">lag 5</text>
<text x="400" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">lag 10</text>
</svg>`,
        alt: "Bar autokorelasi squared return portofolio: lag 1 0,1043; lag 5 −0,0094; lag 10 −0,0099.",
        caption: "Cara membaca: tiap bar = autokorelasi squared return (log return portofolio) pada satu lag; garis putus-putus = nol. Interpretasi: lag 1 positif jelas (0,1043) — volatilitas bergerombol; lag 5 dan lag 10 praktis nol — ingatan klastering hanya beberapa hari.",
      },
      tasks: [],
    },
    {
      id: "ewma",
      eyebrow: "Langkah 8 · EWMA",
      title: "EWMA (λ = 0,94): volatilitas yang mengikuti hari ini",
      prose: [
        "EWMA (Exponentially Weighted Moving Average) adalah cara paling sederhana membuat volatilitas kondisional: varians hari ini adalah rata-rata tertimbang dari varians kemarin dan kuadrat return kemarin — dengan bobot λ = 0,94 untuk masa lalu dan 1 − λ = 0,06 untuk return terbaru. Bobot lama meluruh secara eksponensial: return 10 hari lalu hanya berbobot 0,06 × 0,94^9 ≈ 0,034, return 50 hari lalu praktis hilang. Inilah yang dipakai RiskMetrics (J.P. Morgan, 1994) — dan masih dipakai karena sederhana dan sulit dikalahkan pada horizon 1 hari.",
        "Nilai: EWMA (λ = 0,94) pada log return BBCA — volatilitas terakhir 0,0366 per hari, setara 0,5804 tahunan; rata-rata EWMA sepanjang sampel 0,0200 [notebook]. Volatilitas saat ini hampir DUA KALI rata-ratanya — pasar BBCA pada 11 November 2026 masih panas pasca-crash Oktober 2026. VaR95 kondisional-EWMA untuk BBCA: 0,0601 — bandingkan dengan VaR95 parametrik tak-kondisional 0,0372 [notebook]. VaR kondisional 62 persen LEBIH BESAR dari VaR statis. Itulah harga dari memakai rata-rata dua tahun di tengah badai: kamu meremehkan risiko sebesar 0,0229 (2,29 poin persen) tepat di hari ketika kerugian besar paling mungkin datang.",
        "Baik atau buruk: EWMA bagus karena hanya punya satu parameter (λ), tidak butuh optimasi numerik, dan bereaksi cepat terhadap guncangan — satu return besar langsung menaikkan varians besok sebesar 6 persen dari kuadratnya. Buruk karena ia TIDAK punya mean-reversion: tidak ada «volatilitas jangka panjang» yang ditarik kembali — setelah guncangan, EWMA meluruh perlahan dengan laju λ, tanpa pernah kembali ke suatu level tertentu. Dan karena persistensinya 1 (α + β = 1 — lihat langkah 10), guncangan secara teori tidak pernah hilang sepenuhnya.",
        "Mitigasi: pakai EWMA untuk VaR 1 hari ke depan — di situlah ia paling kuat. Untuk horizon lebih panjang, atau bila kamu butuh level volatilitas jangka panjang yang eksplisit, pindah ke GARCH. Dan catat asumsi yang dipakai di sini: VaR kondisional dihitung dengan asumsi normal dan mean nol (VaR95 = 1,6449 × vol kondisional) — ekor gemuk (fat tail) tidak ditangkap, jadi angka 0,0601 pun masih bisa meremehkan ekor yang sebenarnya.",
      ],
      formula: String.raw`\sigma_t^2 = \lambda \sigma_{t-1}^2 + (1-\lambda) r_{t-1}^2`,
      formulaNote: "Rekursi EWMA: λ = 0,94 (RiskMetrics). Varians hari ini = 94 persen varians kemarin + 6 persen kuadrat return kemarin. Volatilitas = akar varians. VaR95 kondisional (normal, mean 0) = 1,6449 × σ_t.",
      tasks: [],
      note: {
        title: "Miskonsepsi: λ yang lebih besar berarti bereaksi lebih cepat",
        type: "pitfall",
        body: "Yang benar: λ yang lebih besar berarti bobot masa lalu LEBIH besar — model lebih lambat bereaksi (lebih halus). λ = 0,94 bereaksi lebih lambat daripada λ = 0,90, tapi lebih stabil. Bila kamu ingin VaR yang cepat mengejar guncangan, TURUNKAN λ — dengan harga volatilitas VaR-mu sendiri yang lebih berisik.",
      },
    },
    {
      id: "garch",
      eyebrow: "Langkah 9 · GARCH(1,1)",
      title: "GARCH(1,1): EWMA yang belajar dari data — MLE manual dengan scipy",
      prose: [
        "GARCH(1,1) menulis varians kondisional sebagai kombinasi tiga hal: sebuah konstanta ω, reaksi terhadap guncangan kemarin (α × kuadrat return kemarin), dan ingatan terhadap varians kemarin (β × varians kemarin). Beda dengan EWMA: bobotnya tidak ditetapkan (λ = 0,94 dari buku), melainkan DIESTIMASI dari data dengan maximum likelihood (MLE) — mencari ω, α, β yang membuat return yang teramati paling mungkin terjadi, dengan asumsi return bersyarat normal dengan varians itu.",
        "Nilai: GARCH(1,1) manual MLE pada log return BBCA (scipy, tanpa paket `arch` — paket itu tidak terpasang di VM dan tidak bisa di-install bersih, jadi likelihood-nya ditulis eksplisit) — ω = 0,000075, α = 0,2113, β = 0,6489, persistensi α + β = 0,8602 [notebook]. Volatilitas jangka panjang (long-run) 0,0231, volatilitas kondisional terakhir 0,0225, forecast volatilitas 1 hari 0,0203, volatilitas tak-kondisional 0,0218 [notebook]. VaR95 kondisional 1 hari 0,0334 dan VaR99 0,0472 [notebook]. GARCH portofolio: α = 0,1094, β = 0,5833, forecast volatilitas 0,0184 [notebook] — portofolio bereaksi lebih pelan terhadap guncangan (α lebih kecil) daripada BBCA sendiri, sesuai sifat diversifikasi.",
        "Persistensi 0,8602 berarti guncangan volatilitas meluruh lambat: half-life = ln(0,5) / ln(0,8602) ≈ 4,6 hari. Artinya, separuh dari sebuah guncangan volatilitas masih terasa sekitar 4–5 hari kemudian. Bandingkan dengan EWMA (persistensi 1,0 — guncangan tidak pernah meluruh sepenuhnya) dan dengan klastering di langkah 7 (autokorelasi lag 5 sudah nol): GARCH bilang ingatannya sekitar 4–5 hari — konsisten dengan autokorelasi yang menghilang di lag 5.",
        "Baik atau buruk: GARCH bagus karena punya mean-reversion eksplisit — volatilitas ditarik kembali ke long-run variance ω / (1 − α − β) = 5,33e-4, yang setara long-run vol 0,0231. Tapi perhatikan: forecast 1 hari (0,0203) justru berada DI BAWAH volatilitas terakhir (0,0225) DAN di bawah level jangka panjang (0,0231) — cerita mean-reversion «forecast ditarik naik menuju 0,0231» dibantah angka ini. Penyebabnya: return terakhir kecil, sehingga suku α·r²_t yang masuk ke forecast nyaris nol dan forecast jatuh di bawah kedua level itu. Buruk karena estimasinya butuh optimasi numerik yang bisa gagal konvergen, sensitif terhadap nilai awal, dan asumsi normal bersyaratnya tetap meremehkan ekor gemuk. Dan seperti semua model volatilitas, GARCH memprediksi BESARNYA pergerakan, bukan ARAHNYA — ia tidak tahu apakah besok naik atau turun.",
        "Mitigasi: jalankan MLE dari beberapa nilai awal yang berbeda dan ambil likelihood terbaik (notebook memakai 3 start) — optimasi yang hanya dicoba sekali bisa terjebak di optimum lokal. Selalu laporkan persistensi α + β berdampingan dengan α dan β: α besar + β kecil berarti «kagetan» (bereaksi kuat, lupa cepat); α kecil + β besar berarti «pelupa lambat» (bereaksi pelan, ingat lama). Di sini BBCA: α 0,2113, β 0,6489 — bereaksi cukup kuat DAN ingat cukup lama.",
      ],
      formula: String.raw`\sigma_t^2 = \omega + \alpha r_{t-1}^2 + \beta \sigma_{t-1}^2`,
      formulaNote: "GARCH(1,1): ω = konstanta, α = reaksi terhadap guncangan kemarin, β = ingatan varians kemarin. Persistensi = α + β (di sini 0,8602). Long-run variance = ω / (1 − α − β). Diestimasi dengan MLE (scipy L-BFGS-B, 3 nilai awal) — tanpa paket arch.",
      tasks: [],
      note: {
        title: "Risiko nyata: MLE GARCH bisa gagal diam-diam",
        type: "risk",
        body: "Optimasi numerik tidak memberi tahu bila ia berhenti di optimum lokal — ia hanya memberi angka. Tanda bahayanya: α + β ≥ 1 (varians tidak stasioner), ω ≤ 0, atau hasil yang berubah drastis bila nilai awal diubah. Notebook M4.3 memakai 3 nilai awal dan mengambil likelihood terbaik; bila ketiganya memberi jawaban berbeda jauh, jangan percaya satu pun — periksa datanya dulu.",
      },
    },
    {
      id: "ewma-vs-garch",
      eyebrow: "Langkah 10 · EWMA vs GARCH",
      title: "EWMA vs GARCH: satu keluarga, dan VaR kondisional vs tak-kondisional",
      prose: [
        "EWMA dan GARCH bukan dua dunia yang berbeda — EWMA ADALAH GARCH dengan parameter yang ditetapkan, bukan diestimasi: ω = 0, α = 1 − λ = 0,06, β = λ = 0,94. Masukkan ketiganya ke rumus GARCH dan kamu mendapatkan persis rekursi EWMA. Perbedaannya: GARCH membiarkan data memilih α dan β-nya sendiri (BBCA: α = 0,2113, β = 0,6489), sementara EWMA mematoknya (α = 0,06, β = 0,94). Data BBCA bilang: guncangan kemarin lebih penting daripada yang dipatok EWMA (0,2113 vs 0,06), dan ingatan varians lebih pendek (0,6489 vs 0,94).",
        "Nilai: perbandingan VaR95 BBCA dalam satu gambar — VaR95 kondisional-EWMA 0,0601, VaR95 parametrik tak-kondisional 0,0372, VaR95 kondisional-GARCH 0,0334, VaR99 kondisional-GARCH 0,0472 [notebook]. Perhatikan dua hal. Pertama, EWMA memberi VaR95 yang jauh lebih besar daripada GARCH (0,0601 vs 0,0334) — karena EWMA memakai volatilitas TERAKHIR (0,0366, pasca-crash) sebagai titik awal, sementara GARCH memakai forecast 1 hari (0,0203) yang turun karena return terakhir kecil (suku α·r²_t kecil) — bukan karena ditarik menuju level jangka panjang 0,0231; forecast ini justru sudah berada di bawah level itu. Keduanya «kondisional», tapi kondisional pada hal yang berbeda: EWMA pada volatilitas hari ini, GARCH pada forecast besok. Kedua, VaR95 tak-kondisional (0,0372) berada di antara keduanya — ia tidak salah besar di hari biasa, tapi ia salah di hari yang penting: saat volatilitas sedang tinggi, ia meremehkan risiko; saat volatilitas sedang rendah, ia memboroskan modal.",
        "Baik atau buruk: VaR kondisional bagus karena ia menjawab pertanyaan yang benar — «berapa risiko BESOK, given hari ini?» — bukan «berapa risiko rata-rata?». Buruk bila dipakai tanpa memahami horizonnya: EWMA 0,0601 adalah VaR untuk hari ini dengan vol hari ini; GARCH 0,0334 adalah VaR untuk besok dengan forecast besok. Membandingkan keduanya tanpa menyebut tanggalnya adalah membandingkan apel dengan jeruk.",
        "Mitigasi: aturan praktis — untuk limit harian dan laporan risiko harian, pakai VaR kondisional (EWMA atau GARCH 1-hari). Untuk modal dan stress test, pakai VaR tak-kondisional ATAU VaR kondisional pada skenario volatilitas stress (langkah ini disambung M4.5). Dan backtest KEDUANYA dengan Kupiec out-of-sample sudah dijalankan — hasilnya di langkah 11: EWMA dan GARCH memperbaiki frekuensi, tapi keduanya MASIH gagal uji independensi Christoffersen. VaR kondisional yang tidak di-backtest sama tidak terujinya dengan VaR statis.",
        "Tips: bila kamu hanya boleh mengingat satu hubungan dari lesson ini, ingat ini — EWMA = GARCH(ω = 0, α = 1 − λ, β = λ). Setiap kali seseorang bilang «kami pakai EWMA, bukan GARCH», kamu tahu persis asumsi apa yang mereka buat tanpa mereka sadari: mereka mematok reaksi terhadap guncangan di 0,06 dan ingatan di 0,94, tanpa pernah bertanya apakah data setuju.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar VaR BBCA: EWMA VaR95 0,0601; parametrik tak-kondisional VaR95 0,0372; GARCH VaR95 0,0334; GARCH VaR99 0,0472">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">VaR BBCA: kondisional vs tak-kondisional (fraksi nilai)</text>
<text x="240.0" y="32" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">EWMA memakai vol terakhir 0,0366 · GARCH memakai forecast 1 hari 0,0203</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="155.7" x2="52" y2="155.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="158.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,02</text>
<line x1="48" y1="105.4" x2="52" y2="105.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="108.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,04</text>
<line x1="48" y1="55.1" x2="52" y2="55.1" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="58.1" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,06</text>
<rect x="70" y="54.9" width="60" height="151.1" fill="var(--c4)"/>
<text x="100" y="50.9" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0601</text>
<rect x="170" y="112.5" width="60" height="93.5" fill="var(--c1)"/>
<text x="200" y="108.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0372</text>
<rect x="270" y="122.0" width="60" height="84.0" fill="var(--c2)"/>
<text x="300" y="118.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0334</text>
<rect x="370" y="87.3" width="60" height="118.7" fill="var(--c1)"/>
<text x="400" y="83.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0472</text>
<text x="100" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">EWMA VaR95</text>
<text x="200" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Param VaR95</text>
<text x="300" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GARCH VaR95</text>
<text x="400" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GARCH VaR99</text>
</svg>`,
        alt: "Bar VaR BBCA: EWMA VaR95 0,0601; parametrik tak-kondisional VaR95 0,0372; GARCH VaR95 0,0334; GARCH VaR99 0,0472.",
        caption: "Cara membaca: tiap bar = VaR 1 hari BBCA sebagai fraksi nilai posisi; EWMA dan GARCH adalah VaR kondisional, Param adalah VaR tak-kondisional. Interpretasi: saat vol sedang tinggi (0,0366 vs rata-rata 0,0200), VaR kondisional-EWMA (0,0601) jauh di atas VaR statis (0,0372) — VaR statis meremehkan risiko tepat saat paling penting.",
      },
      tasks: [],
    },
    {
      id: "backtest-ewma-garch",
      eyebrow: "Langkah 11 · Backtest EWMA + GARCH",
      title: "Backtest EWMA + GARCH: frekuensi membaik, clustering tetap hidup",
      prose: [
        "Langkah 10 diakhiri dengan perintah: backtest KEDUANYA dengan Kupiec out-of-sample. Ini hasilnya — VaR kondisional EWMA dan GARCH diuji pada jendela yang SAMA dengan VaR historis langkah 5: log return portofolio, hari 251–480, 230 hari uji. Perbandingan yang adil: model yang sama, hari yang sama, hanya mesin VaR-nya yang berbeda.",
        "Nilai — metode, dinyatakan jujur: EWMA λ = 0,94, varians awal = varians 250 log return pertama, VaR95 = 1,6449 × σ dan VaR99 = 2,3263 × σ [notebook]. GARCH direfit tiap 20 hari pada 250 log return terakhir — 12 refit selama jendela uji — dan antar refit parameternya tetap, varians difilter maju dengan return terealisasi [notebook]. Parameter GARCH-nya BERGERAK selama periode: α dari 0,1087 (refit 25 Nov 2025) ke 0,333 (refit 1 Okt 2026), β dari 0,7919 ke 0,4264 — model «belajar» bahwa pasar makin reaktif: guncangan kemarin makin penting, ingatan varians makin pendek. Itu bukan parameter yang «salah» di awal — itu model yang menyesuaikan diri dengan rezim yang berubah, dan refit berkala adalah caranya.",
        "Nilai — hasil: VaR95 — historis 15/230 (LR = 1,0275, p = 0,3108), EWMA 12/230 (ekspektasi 11,5; LR = 0,0226, p = 0,8806 — frekuensi TERBAIK dari ketiganya), GARCH 13/230 (LR = 0,1980, p = 0,6564) [notebook]. VaR99 — historis 4/230 (LR = 1,0398, p = 0,3079), EWMA 5/230 (LR = 2,3974, p = 0,1215), GARCH 3/230 (LR = 0,1964, p = 0,6577 — ekor-99 TERBAIK) [notebook]. Dibaca dengan benar: SEMUA model lolos Kupiec pada kedua level — frekuensi bukan lagi pembeda. Yang membedakan adalah DI MANA mereka menang: EWMA paling jujur di 95, GARCH paling jujur di 99. Dan ingat paragraf sensitivitas langkah 6: pada VaR99, selisih 5 vs 3 pelanggaran adalah selisih p = 0,1215 vs 0,6577 — dengan ekspektasi hanya 2,3, peringkat «terbaik» di ekor-99 ini rapuh; dua pelanggaran ekstra membalik vonis.",
        "Tapi frekuensi bukan vonis terakhir — Christoffersen langkah 6: EWMA VaR95 — n00 = 208, n01 = 9, n10 = 9, n11 = 3; π01 = 0,0415, π11 = 0,2500; LR_ind = 5,7259, p = 0,0167 → MASIH menolak independensi [notebook]. GARCH VaR95 — n00 = 206, n01 = 10, n10 = 10, n11 = 3; π01 = 0,0463, π11 = 0,2308; LR_ind = 4,8068, p = 0,0283 → MASIH menolak [notebook]. VaR kondisional memperbaiki frekuensi, tapi TIDAK menyembuhkan clustering: pelanggaran masih bergerombol — 26–28 Januari menembus ketiga model sekaligus. Pelajaran yang tidak nyaman: EWMA dan GARCH mengikuti volatilitas, tapi guncangan besar tetap datang lebih cepat daripada model mana pun bisa bereaksi.",
        "Cerita 16 Oktober 2026: return log portofolio hari itu −0,1506 — kerugian 15 persen dalam sehari [notebook]. VaR95 hari itu: historis rolling 0,0286, EWMA 0,0169, GARCH 0,0228 [notebook]. Baca baik-baik: VaR KONDISIONAL berada DI BAWAH VaR statis pada hari crash itu sendiri — EWMA hanya 0,0169, hampir separuh VaR historis. Mengapa? Karena sebelum 16 Oktober pasar sedang TENANG — volatilitas kondisional kemarin rendah, sehingga VaR hari ini rendah. VaR kondisional bereaksi SETELAH guncangan, bukan sebelum: ia baru membesar pada 17 Oktober dan hari-hari sesudahnya. Buktinya: VaR95 maksimum selama jendela uji — EWMA 0,0664 pada 21 Okt 2026, GARCH 0,1439 pada 19 Okt 2026 [notebook]. GARCH melonjak sampai 14,39 persen dari nilai portofolio — overshoot pasca-crash, karena α-nya sudah naik ke 0,333: model yang baru saja «belajar» bereaksi kuat, bereaksi sangat kuat. EWMA yang lebih kalem hanya sampai 0,0664.",
        "VaR hari terakhir (11 Nov 2026): EWMA VaR95 0,0490, GARCH 0,0315; VaR99: EWMA 0,0694, GARCH 0,0446 [notebook]. Di hari terakhir, EWMA lebih konservatif daripada GARCH — kebalikan dari perbandingan BBCA di langkah 10, di mana EWMA 0,0601 vs GARCH 0,0334 — karena di sini yang dibandingkan adalah VaR PORTOFOLIO pada tanggal yang sama, dan GARCH portofolio sudah «mendingin» setelah refit 29 Oktober sementara EWMA masih membawa ingatan crash Oktober dengan bobot λ = 0,94. Jangan hafalkan «EWMA selalu lebih besar» — hafalkan mekanismenya: EWMA membawa kemarin, GARCH membawa forecast besok.",
        "Baik atau buruk: VaR kondisional bagus untuk LIMIT HARIAN — ia menyesuaikan dengan cuaca hari ini, dan frekuensinya terbukti paling jujur (EWMA p = 0,8806 di VaR95; GARCH p = 0,6577 di VaR99). Buruk sebagai PERINGATAN DINI: pada hari crash itu sendiri ia justru paling kecil — jangan pernah memakai VaR kondisional sebagai alarm «besok akan crash». Dan buruk bila dipakai mentah-mentah pasca-crash: GARCH 0,1439 sebagai limit harian berarti menahan 14,39 persen modal untuk satu hari — benar secara statistik, melumpuhkan secara bisnis bila dipertahankan berminggu-minggu.",
        "Mitigasi — keputusan praktis: untuk limit harian, pakai VaR kondisional — EWMA bila yang dijaga adalah frekuensi VaR95, GARCH bila yang dijaga adalah ekor-99. Eskalasi bila VaR95 kondisional melebihi 2× VaR statis (pasar sedang tidak normal — naikkan buffer atau turunkan eksposur), atau setelah klaster pelanggaran — dua pelanggaran dalam tiga hari berarti modelmu sedang tertinggal dari pasar, dan itu panggilan untuk meninjau ulang, bukan untuk menunggu pelanggaran ketiga. Dan selalu laporkan pasangan angkanya: Kupiec untuk frekuensi, Christoffersen untuk independensi — satu saja tidak cukup, seperti dibuktikan langkah 6.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Backtest OOS 230 hari, VaR95: historis 15 pelanggaran (p = 0,3108), EWMA 12 (p = 0,8806), GARCH 13 (p = 0,6564). Mana yang frekuensinya terbaik, dan apakah itu berarti EWMA «terbukti benar»?",
          options: [
            { text: "EWMA — p = 0,8806, paling dekat dengan ekspektasi 11,5. Tapi tidak terbukti benar: Christoffersen EWMA masih menolak independensi (p = 0,0167) — pelanggaran tetap bergerombol", why: "Benar: 12 pelanggaran nyaris sama dengan ekspektasi 11,5 (LR = 0,0226) — frekuensi terbaik. Tapi π11 EWMA = 0,2500 dan LR_ind = 5,7259 (p = 0,0167) bilang clustering-nya masih hidup.", correct: true },
            { text: "GARCH — karena α-nya «belajar» dari 0,1087 ke 0,333 selama periode", why: "α yang bergerak adalah soal adaptasi model, bukan soal frekuensi: GARCH 13 pelanggaran (p = 0,6564) kalah dari EWMA 12 (p = 0,8806) pada VaR95." },
            { text: "Historis — karena 15 pelanggaran paling dekat dengan ekspektasi 11,5", why: "15 lebih jauh dari 11,5 daripada 12 (EWMA) maupun 13 (GARCH) — historis justru frekuensi terburuk dari ketiganya pada VaR95." },
            { text: "EWMA terbukti benar — p = 0,8806 berarti keyakinan 88,06 persen bahwa VaR benar", why: "p-value bukan probabilitas H0 benar — 0,8806 hanya berarti data ini sangat masuk akal bila EWMA jujur, dan uji independensi tetap menolaknya." },
          ],
        },
        {
          q: "16 Okt 2026: return log portofolio −0,1506; VaR95 EWMA 0,0169, GARCH 0,0228, historis 0,0286. Apa pelajaran utamanya?",
          options: [
            { text: "VaR kondisional bereaksi SETELAH guncangan, bukan sebelum — pada hari crash itu sendiri ia justru paling kecil, karena volatilitas kemarin sedang rendah. Ia bukan alarm dini", why: "Benar: sebelum 16 Oktober pasar tenang, jadi VaR kondisional hari itu rendah (EWMA 0,0169). Ia baru membesar sesudahnya — VaR95 maks GARCH 0,1439 baru tercapai 19 Oktober.", correct: true },
            { text: "EWMA rusak — VaR-nya seharusnya paling besar tepat saat crash", why: "EWMA tidak rusak: ia menghitung varians dari return KEMARIN, dan kemarin pasar tenang. VaR kondisional tidak bisa tahu crash hari ini akan datang." },
            { text: "GARCH memprediksi crash karena VaR-nya 0,0228 — lebih besar dari EWMA", why: "0,0228 tetap jauh di bawah kerugian aktual 0,1506 — GARCH juga tertembus hari itu. Lebih besar dari EWMA bukan berarti memprediksi." },
            { text: "VaR statis selalu lebih baik — pakai 0,0286 untuk semua hari", why: "0,0286 juga tertembus 0,1506 — dan secara keseluruhan VaR statis frekuensinya terburuk (15 vs 11,5) serta gagal conditional coverage (p = 0,0212)." },
          ],
        },
      ],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 12 · Lab 1",
      title: "Lab: uji Kupiec dari nol pada 100 hari mainan",
      prose: [
        "Sekarang giliranmu menghitung uji Kupiec. Datanya mainan dan deterministik: 100 hari, 9 pelanggaran VaR95 pada hari ke-3, 11, 18, 27, 34, 52, 63, 79, dan 94. Ekspektasi pada p = 0,05 adalah 5,0 pelanggaran — teramati 9, hampir dua kali lipat. Apakah itu cukup untuk menolak VaR-nya?",
        "Tugasmu: lengkapi statistik LR Kupiec dari rumusnya, lalu hitung p-value chi-square 1 derajat kebebasan TANPA scipy — lab Pyodide di lesson ini memakai pure Python stdlib saja. Triknya: untuk 1 df, p-value = erfc(√(LR/2)), dengan math.erfc. Itu bukan sulap — itu identitas distribusi chi-square 1 df dengan distribusi normal standar.",
        "Hasilnya: LR = 2,7510, p-value = 0,0972 [lab]. Keputusan: TIDAK ditolak pada taraf 5 persen — 9 pelanggaran dari 100 hari memang di atas ekspektasi 5,0, tapi tidak cukup jauh untuk menyatakan VaR-nya bohong. Bandingkan dengan notebook: di sana 15 dari 230 hari (ekspektasi 11,5) memberi p = 0,3108 — pola yang sama, «di atas ekspektasi tapi belum cukup bukti». Lab kecil menunjukkan mekaniknya; notebook menunjukkan realitanya — dan keduanya mengajarkan hal yang sama: «lebih banyak dari ekspektasi» belum tentu «ditolak».",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi statistik LR Kupiec dari rumus likelihood-ratio (dua log-likelihood binomial)" },
        { id: "t2", text: "Lengkapi p-value chi2(1) via math.erfc: p = erfc(sqrt(LR / 2))" },
        { id: "t3", text: "Jalankan dan baca keputusan pada taraf 5 persen" },
      ],
      expected: "n=100 exceed=9 expected=5.0\nLR=2.7510\np-value=0.0972\nKeputusan: TIDAK ditolak",
      hints: [
        "LR = -2*log((1-p)**(n-x) * p**x) + 2*log((1-phat)**(n-x) * phat**x), dengan phat = x / n.",
        "p-value chi2(1): math.erfc(math.sqrt(LR / 2)) — tanpa scipy, hanya math.",
        "Keputusan: tolak H0 bila p-value < 0,05; di sini 0,0972 ≥ 0,05, jadi TIDAK ditolak.",
      ],
      code: {
        starter: `import math

# Uji Kupiec pada 100 hari: hari-hari ketika return portofolio menembus VaR95
# (9 pelanggaran dari 100 hari; ekspektasi 5,0 pada p = 0,05)
violations = [3, 11, 18, 27, 34, 52, 63, 79, 94]  # hari ke- (1..100)
n = 100
p = 0.05
x = len(violations)
phat = x / n

# TODO: statistik LR Kupiec
LR = 0.0  # TODO: -2*log(...) + 2*log(...)
p_value = 0.0  # TODO: p-value chi2(1) via math.erfc: erfc(sqrt(LR/2))

print(f"n={n} exceed={x} expected={n * p:.1f}")
print(f"LR={LR:.4f}")
print(f"p-value={p_value:.4f}")
print("Keputusan: TIDAK ditolak" if p_value >= 0.05 else "Keputusan: ditolak")`,
        lockLines: 10,
        solution: `import math

# Uji Kupiec pada 100 hari: hari-hari ketika return portofolio menembus VaR95
# (9 pelanggaran dari 100 hari; ekspektasi 5,0 pada p = 0,05)
violations = [3, 11, 18, 27, 34, 52, 63, 79, 94]  # hari ke- (1..100)
n = 100
p = 0.05
x = len(violations)
phat = x / n

# TODO: statistik LR Kupiec
LR = -2 * math.log((1 - p) ** (n - x) * p ** x) + 2 * math.log((1 - phat) ** (n - x) * phat ** x)
p_value = math.erfc(math.sqrt(LR / 2))

print(f"n={n} exceed={x} expected={n * p:.1f}")
print(f"LR={LR:.4f}")
print(f"p-value={p_value:.4f}")
print("Keputusan: TIDAK ditolak" if p_value >= 0.05 else "Keputusan: ditolak")`,
        checks: [
          { kind: "equal", task: "t3", name: "x", value: 9, label: "`x` seharusnya 9", msg: "Sembilan pelanggaran dari daftar hari yang diberikan." },
          { kind: "stdout_matches", task: "t1", pattern: "LR=2\\.7510", label: "Output menampilkan LR = 2.7510", msg: "Statistik LR Kupiec: 2,7510 — dari rumus likelihood-ratio dua binomial." },
          { kind: "stdout_matches", task: "t2", pattern: "p-value=0\\.0972", label: "Output menampilkan p-value = 0.0972", msg: "p-value chi2(1) via erfc: 0,0972 — di atas 0,05." },
          { kind: "stdout_matches", task: "t3", pattern: "Keputusan: TIDAK ditolak", label: "Output menampilkan keputusan TIDAK ditolak", msg: "9 pelanggaran vs ekspektasi 5,0 belum cukup bukti untuk menolak VaR pada taraf 5 persen." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 13 · Lab 2",
      title: "Lab: EWMA dari nol pada 6 return mainan",
      prose: [
        "Lab kedua adalah EWMA dari nol — rekursi yang sama dengan langkah 8, pada data mainan 6 hari: return +0,010, −0,020, +0,015, −0,005, +0,030, −0,010, dengan λ = 0,94 dan varians awal 0,0004 (vol awal 0,0200).",
        "Perhatikan apa yang terjadi pada hari ke-5: return +0,030 — yang terbesar dalam deret — menaikkan vol dari 0,0188 ke 0,0196. Kenaikannya kecil (0,0008) karena bobot return terbaru hanya 1 − λ = 0,06: 0,06 × 0,030² = 0,000054 ditambahkan ke varians, sementara 94 persen varians lama dipertahankan. Itulah karakter EWMA: ia bereaksi, tapi tidak panik — dan itulah mengapa λ = 0,94 dipilih RiskMetrics: cukup cepat untuk mengikuti badai, cukup lambat untuk tidak berisik.",
        "Hasilnya: vol akhir 0,0192 [lab] — sedikit di bawah vol awal 0,0200, karena deret mainan ini relatif tenang kecuali satu hari +0,030. Bandingkan dengan notebook: di sana vol EWMA BBCA terakhir 0,0366 — hampir dua kali rata-ratanya — karena data nyatanya baru saja melewati crash Oktober 2026. Mekaniknya sama; yang berbeda hanya cuacanya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi rekursi EWMA: var = lam * var + (1 - lam) * r * r" },
        { id: "t2", text: "Jalankan 6 hari dan baca vol tiap hari + vol akhir" },
      ],
      expected: "hari 0: vol=0.0200\nhari 1: r=+0.010 vol=0.0195\nhari 2: r=-0.020 vol=0.0196\nhari 3: r=+0.015 vol=0.0193\nhari 4: r=-0.005 vol=0.0188\nhari 5: r=+0.030 vol=0.0196\nhari 6: r=-0.010 vol=0.0192\nvol akhir: 0.0192",
      hints: [
        "Rekursi: var = lam * var + (1 - lam) * r * r — varians kemarin berbobot 0,94, kuadrat return terbaru berbobot 0,06.",
        "Volatilitas = akar varians: var ** 0.5 — format 4 desimal seperti contoh.",
        "Hari ke-5 (+0,030) menaikkan vol dari 0,0188 ke 0,0196 — cek angkamu di sana.",
      ],
      code: {
        starter: `# Return harian mainan (6 hari) + EWMA lambda = 0,94
returns = [0.01, -0.02, 0.015, -0.005, 0.03, -0.01]
lam = 0.94
var = 0.0004  # varians awal: vol awal 0,0200
print(f"hari 0: vol={var ** 0.5:.4f}")
for i, r in enumerate(returns, start=1):
    var = 0.0  # TODO: lam * var + (1 - lam) * r * r
    print(f"hari {i}: r={r:+.3f} vol={var ** 0.5:.4f}")
print(f"vol akhir: {var ** 0.5:.4f}")`,
        lockLines: 6,
        solution: `# Return harian mainan (6 hari) + EWMA lambda = 0,94
returns = [0.01, -0.02, 0.015, -0.005, 0.03, -0.01]
lam = 0.94
var = 0.0004  # varians awal: vol awal 0,0200
print(f"hari 0: vol={var ** 0.5:.4f}")
for i, r in enumerate(returns, start=1):
    var = lam * var + (1 - lam) * r * r
    print(f"hari {i}: r={r:+.3f} vol={var ** 0.5:.4f}")
print(f"vol akhir: {var ** 0.5:.4f}")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "hari 5: r=\\+0\\.030 vol=0\\.0196", label: "Output menampilkan hari 5 vol = 0.0196", msg: "Return +0,030 menaikkan vol dari 0,0188 ke 0,0196 — reaksi EWMA terhadap guncangan." },
          { kind: "stdout_matches", task: "t2", pattern: "hari 6: r=-0\\.010 vol=0\\.0192", label: "Output menampilkan hari 6 vol = 0.0192", msg: "Hari terakhir: vol 0,0192." },
          { kind: "stdout_matches", task: "t2", pattern: "vol akhir: 0\\.0192", label: "Output menampilkan vol akhir 0.0192", msg: "Vol akhir: 0,0192 — sedikit di bawah vol awal 0,0200." },
        ],
      },
    },
    {
      id: "colab",
      eyebrow: "Langkah 14 · Guided task di Colab",
      title: "Guided task di Colab: Kupiec, EWMA, dan GARCH di data BBCA/KLBF/UNVR",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat pada 100 hari dan 6 return mainan. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m43-guided-task.ipynb.",
        "Di notebook itu kamu memuat harga BBCA, KLBF, UNVR, dan ^GSPC (window 2024-11-01 sampai 2026-11-12 — 481 baris harga, yang menghasilkan 480 return sampai 2026-11-11 — yfinance, dengan fallback ke file data/m4_prices.csv bila download gagal), membangun portofolio equal-weight, mereplikasi Kupiec in-sample (n = 480, pelanggaran 24, LR = 0,0000, p = 1,0000 — jebakan yang kamu pelajari di langkah 4), Kupiec out-of-sample rolling 250 hari (VaR95: 15 vs 11,5, p = 0,3108; VaR99: 4 vs 2,3, p = 0,3079), zona Basel (3 pelanggaran → GREEN), autokorelasi squared return (lag 1 0,1043), EWMA BBCA (vol terakhir 0,0366, VaR95 kondisional 0,0601), dan GARCH(1,1) manual MLE dengan scipy (α = 0,2113, β = 0,6489, persistensi 0,8602, forecast vol 0,0203, VaR95 kondisional 0,0334) — lengkap dengan checks yang menegaskan tiap langkah.",
        "Tautan Colab:",
        "https://colab.research.google.com/drive/1kWn66EK-dFYQJRoeo2hmnP9WAv7X5MQL",
        "Jalur file notebook: colab/mlf-m43-guided-task.ipynb.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 15 · Checkpoint",
      title: "Checkpoint: VaR yang jujur adalah VaR yang diuji di luar sampel",
      prose: [
        "Rangkuman: Kupiec menguji frekuensi pelanggaran dengan likelihood ratio — tolak bila p < 0,05, dan ingat ia hanya menguji frekuensi, bukan independensi (langkah 6: Christoffersen — dan VaR95 historis justru GAGAL di sana, LR_cc = 7,7056, p = 0,0212). Kupiec in-sample pada VaR historis memberi LR = 0,0000, p = 1,0000 — bukan bukti, melainkan jebakan konstruksi. Kupiec out-of-sample (rolling 250 hari, 230 hari uji) memberi VaR95: 15 vs 11,5 (p = 0,3108) dan VaR99: 4 vs 2,3 (p = 0,3079) — keduanya tidak ditolak, dan kali ini artinya sesuatu. Zona Basel 99% pada 250 hari terakhir: 3 pelanggaran → GREEN. Volatilitas bergerombol di lag pendek (autokorelasi squared return lag 1 0,1043, lag 5 −0,0094, lag 10 −0,0099). EWMA BBCA (λ = 0,94): vol terakhir 0,0366 (tahunan 0,5804) vs rata-rata 0,0200 — VaR95 kondisional 0,0601 vs tak-kondisional 0,0372. GARCH(1,1) manual MLE BBCA: ω = 0,000075, α = 0,2113, β = 0,6489, persistensi 0,8602 (half-life ≈ 4,6 hari), forecast vol 0,0203, VaR95 kondisional 0,0334. EWMA = GARCH dengan ω = 0, α = 1 − λ, β = λ. Backtest EWMA/GARCH OOS (langkah 11): EWMA VaR95 12/230 (p = 0,8806, frekuensi terbaik), GARCH VaR99 3/230 (p = 0,6577, ekor-99 terbaik) — tapi Christoffersen MASIH menolak independensi untuk keduanya (EWMA p = 0,0167; GARCH p = 0,0283). 16 Okt 2026: return log −0,1506 menembus semua VaR — VaR kondisional justru di bawah VaR statis pada hari crash itu sendiri (EWMA 0,0169 vs historis 0,0286). Sensitivitas Kupiec VaR99: x = 6 dari 230 hari sudah menolak (p = 0,0412) — dua pelanggaran ekstra membalik vonis.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Kupiec in-sample memberi LR = 0,0000 dan p = 1,0000. Apa arti yang paling tepat?",
          options: [
            { text: "VaR terbukti sempurna — model paling jujur yang pernah ada", why: "p = 1,0000 bukan bukti kesempurnaan — dalam data riil yang berisik, kesempurnaan seperti itu hampir tidak pernah terjadi secara alami." },
            { text: "Hasilnya jebakan konstruksi: VaR historis dihitung dari data yang sama dengan data ujinya, jadi pelanggaran pasti ≈ ekspektasi", why: "Benar: VaR historis adalah kuantil 5 persen dari data itu sendiri — by definition sekitar 5 persen observasi berada di bawahnya, sehingga LR = 0 dan p = 1,0000 tanpa menguji apa-apa.", correct: true },
            { text: "Uji Kupiec gagal karena n = 480 terlalu kecil", why: "n = 480 cukup besar — masalahnya bukan ukuran sampel, melainkan VaR dan data uji yang sama." },
            { text: "VaR95 historis memang selalu tepat 24 pelanggaran dari 480 hari", why: "24 dari 480 adalah hasil definisi kuantil pada sampel ini — pada sampel lain jumlahnya akan berbeda, dan tetap tidak membuktikan apa-apa." },
          ],
        },
        {
          q: "Kupiec out-of-sample VaR95: 15 pelanggaran dari 230 hari, ekspektasi 11,5, p = 0,3108. Apa keputusannya?",
          options: [
            { text: "Tolak H0 — VaR tidak jujur karena pelanggaran di atas ekspektasi", why: "Di atas ekspektasi saja belum cukup — p = 0,3108 berarti selisih sebesar ini masih masuk akal bila VaR jujur." },
            { text: "Tidak ditolak — tidak ada bukti cukup bahwa VaR bohong, pada taraf 5 persen", why: "Benar: p = 0,3108 ≥ 0,05, jadi H0 tidak ditolak. «Tidak ditolak» berarti tidak ada bukti melawan, bukan terbukti benar.", correct: true },
            { text: "VaR terbukti benar dengan keyakinan 69,08 persen", why: "p-value bukan probabilitas H0 benar — 1 − p bukan keyakinan bahwa VaR benar." },
            { text: "Uji tidak valid karena 230 hari terlalu pendek untuk VaR95", why: "230 hari memberi ekspektasi 11,5 pelanggaran — cukup untuk uji VaR95; yang lemah kuasanya adalah uji VaR99 (ekspektasi 2,3)." },
          ],
        },
        {
          q: "Zona Basel 99% pada 250 hari terakhir: 3 pelanggaran. Zona apa, dan apa artinya?",
          options: [
            { text: "GREEN — 0–4 pelanggaran, model diterima", why: "Benar: 3 pelanggaran masuk zona hijau (0–4); model diterima tanpa penalti modal tambahan.", correct: true },
            { text: "YELLOW — 5–9 pelanggaran, model dipertanyakan", why: "Kuning butuh 5–9 pelanggaran; 3 masih di bawah ambang itu." },
            { text: "RED — ≥10 pelanggaran, model ditolak", why: "Merah butuh ≥10 pelanggaran; 3 jauh di bawah itu." },
            { text: "Tidak ada zona — Basel hanya memakai p-value Kupiec", why: "Basel memakai traffic light berdasarkan JUMLAH pelanggaran 250 hari — aturan yang terpisah dari p-value Kupiec." },
          ],
        },
        {
          q: "Autokorelasi squared return portofolio: lag 1 0,1043, lag 5 −0,0094, lag 10 −0,0099. Apa bacaan yang paling tepat?",
          options: [
            { text: "Tidak ada volatility clustering sama sekali", why: "Lag 1 positif 0,1043 menunjukkan klastering — hari bervolatilitas tinggi cenderung diikuti hari bervolatilitas tinggi." },
            { text: "Klastering ada di lag pendek dan menghilang di lag panjang — ingatan volatilitas hanya beberapa hari", why: "Benar: lag 1 jelas positif (0,1043), lag 5 dan lag 10 praktis nol — pasar «ingat» guncangan volatilitas selama beberapa hari, bukan beberapa bulan.", correct: true },
            { text: "Volatilitas anti-klastering: hari buruk diikuti hari tenang", why: "Anti-klastering butuh autokorelasi negatif yang besar; lag 5 dan 10 hanya −0,009 — noise di sekitar nol." },
            { text: "Klastering permanen — guncangan volatilitas tidak pernah hilang", why: "Klastering permanen butuh autokorelasi yang tetap positif di lag panjang; di sini lag 5 sudah nol." },
          ],
        },
        {
          q: "EWMA BBCA (λ = 0,94): vol terakhir 0,0366, rata-rata 0,0200; VaR95 kondisional-EWMA 0,0601 vs parametrik tak-kondisional 0,0372. Apa pelajaran utamanya?",
          options: [
            { text: "VaR kondisional selalu lebih besar dari VaR tak-kondisional", why: "Tidak selalu — bila vol saat ini DI BAWAH rata-rata, VaR kondisional justru lebih kecil." },
            { text: "Saat vol sedang tinggi, VaR statis meremehkan risiko tepat ketika risiko paling penting — di sini selisihnya 0,0229", why: "Benar: vol terakhir (0,0366) hampir dua kali rata-rata (0,0200) pasca-crash Oktober 2026, sehingga VaR kondisional 0,0601 jauh di atas VaR statis 0,0372.", correct: true },
            { text: "EWMA salah karena vol terakhirnya terlalu tinggi", why: "Vol terakhir 0,0366 adalah hasil rekursi dari data — bukan kesalahan; ia mencerminkan pasar yang memang masih panas." },
            { text: "VaR95 tak-kondisional 0,0372 sudah cukup karena memakai 480 hari data", why: "480 hari justru masalahnya: rata-rata dua tahun menenggelamkan kondisi hari ini — VaR statis tidak tahu bahwa sekarang sedang badai." },
          ],
        },
        {
          q: "GARCH(1,1) BBCA: α = 0,2113, β = 0,6489, persistensi 0,8602. Berapa half-life guncangan volatilitas, dan apa artinya?",
          options: [
            { text: "≈ 4,6 hari — separuh guncangan volatilitas masih terasa sekitar 4–5 hari kemudian", why: "Benar: ln(0,5)/ln(0,8602) ≈ 4,6 hari — guncangan meluruh lambat, konsisten dengan autokorelasi yang menghilang di lag 5.", correct: true },
            { text: "≈ 0,86 hari — guncangan hilang dalam sehari", why: "0,8602 adalah persistensi, bukan half-life — half-life dihitung dari ln(0,5)/ln(persistensi)." },
            { text: "≈ 86 hari — guncangan bertahan satu kuartal", why: "Persistensi 0,86 meluruh jauh lebih cepat dari itu — half-life-nya 4,6 hari, bukan 86." },
            { text: "Tidak terhingga — persistensi di bawah 1 berarti guncangan tidak pernah hilang", why: "Persistensi di bawah 1 berarti guncangan MELURUH (stasioner); yang tidak pernah hilang adalah persistensi = 1 (seperti EWMA)." },
          ],
        },
        {
          q: "Bagaimana hubungan EWMA (λ = 0,94) dengan GARCH(1,1)?",
          options: [
            { text: "EWMA = GARCH dengan ω = 0, α = 1 − λ = 0,06, β = λ = 0,94", why: "Benar: masukkan parameter itu ke rumus GARCH dan kamu mendapat persis rekursi EWMA — EWMA adalah GARCH yang parameternya dipatok, bukan diestimasi.", correct: true },
            { text: "EWMA = GARCH dengan ω = 1, α = λ, β = 1 − λ", why: "Terbalik: ω EWMA adalah 0 (tanpa mean-reversion), α = 1 − λ, β = λ." },
            { text: "Keduanya tidak berhubungan — EWMA memakai return, GARCH memakai squared return", why: "Keduanya memakai squared return dalam rekursi varians — EWMA adalah kasus khusus GARCH." },
            { text: "GARCH adalah EWMA dengan λ yang diestimasi dari data", why: "GARCH mengestimasi α DAN β secara terpisah (di sini 0,2113 dan 0,6489) — bukan satu λ; EWMA mematok α + β = 1." },
          ],
        },
        {
          q: "Mengapa Kupiec saja tidak cukup — apa yang tidak diujinya?",
          options: [
            { text: "Kupiec tidak menguji frekuensi pelanggaran — hanya jumlah totalnya", why: "Frekuensi dan jumlah total adalah hal yang sama di sini (x/n vs n) — Kupiec justru menguji itu." },
            { text: "Kupiec hanya menguji frekuensi, bukan independensi — pelanggaran beruntun lima hari berturut-turut bisa lolos selama jumlah totalnya tepat", why: "Benar: Kupiec buta terhadap clustering pelanggaran. Langkah 6 mengajarkan uji Christoffersen, yang menambahkan uji independensi di samping uji frekuensi.", correct: true },
            { text: "Kupiec tidak bisa dipakai pada VaR99 — hanya VaR95", why: "Kupiec dipakai pada keduanya di lesson ini (VaR99: 4 vs 2,3, p = 0,3079) — hanya kuasanya yang lebih lemah karena ekspektasi pelanggarannya kecil." },
            { text: "Kupiec membutuhkan asumsi return berdistribusi normal", why: "Kupiec adalah uji binomial atas pelanggaran — ia tidak mengasumsikan normalitas return." },
          ],
        },
      ],
      summary: [
        "Kupiec menguji frekuensi pelanggaran dengan likelihood ratio: LR = 0 bila pelanggaran sama dengan ekspektasi; tolak H0 bila p < 0,05 — dan ia hanya menguji frekuensi, bukan independensi (langkah 6: Christoffersen).",
        "Kupiec in-sample: n = 480, pelanggaran 24, ekspektasi 24,0, LR = 0,0000, p = 1,0000 — jebakan konstruksi, bukan bukti: VaR historis dihitung dari data yang sama dengan data ujinya.",
        "Kupiec out-of-sample (rolling 250 hari, 230 hari uji): VaR95 pelanggaran 15 vs 11,5 (LR = 1,0275, p = 0,3108), VaR99 pelanggaran 4 vs 2,3 (LR = 1,0398, p = 0,3079) — keduanya tidak ditolak, dan kali ini artinya sesuatu.",
        "Zona Basel 99% pada 250 hari terakhir: 3 pelanggaran → GREEN (0–4 hijau, 5–9 kuning, ≥10 merah).",
        "Christoffersen VaR95 OOS: n00 = 203, n01 = 11, n10 = 11, n11 = 4; π01 = 0,0514 vs π11 = 0,2667 — LR independensi 6,6456 (p = 0,0099), LR conditional coverage 7,7056 (p = 0,0212): TOLAK. Kupiec lolos, model tetap gagal karena pelanggaran bergerombol. VaR99: LR_cc = 5,0006 (p = 0,0821) tidak ditolak — tapi n11 = 1, rapuh.",
        "Sensitivitas Kupiec VaR99 (n = 230, ekspektasi 2,3): x = 2 → p = 0,8389; x = 4 → p = 0,3079; x = 6 → p = 0,0412 (TOLAK) — dua pelanggaran ekstra membalik keputusan; «tidak ditolak» pada VaR99 adalah vonis yang lemah.",
        "Volatility clustering: autokorelasi squared return lag 1 0,1043, lag 5 −0,0094, lag 10 −0,0099 — klastering ada di lag pendek, menghilang di lag panjang.",
        "EWMA BBCA (λ = 0,94): vol terakhir 0,0366 (tahunan 0,5804) vs rata-rata 0,0200 — VaR95 kondisional 0,0601 vs tak-kondisional 0,0372: VaR statis meremehkan risiko saat vol sedang tinggi.",
        "GARCH(1,1) manual MLE BBCA: ω = 0,000075, α = 0,2113, β = 0,6489, persistensi 0,8602 (half-life ≈ 4,6 hari), long-run vol 0,0231, forecast vol 1 hari 0,0203, VaR95 kondisional 0,0334, VaR99 0,0472.",
        "EWMA = GARCH dengan ω = 0, α = 1 − λ, β = λ.",
        "Backtest EWMA/GARCH OOS (230 hari, log return portofolio): EWMA VaR95 12/230 (p = 0,8806, frekuensi terbaik), GARCH VaR95 13/230 (p = 0,6564), GARCH VaR99 3/230 (p = 0,6577, ekor-99 terbaik). Christoffersen MASIH menolak independensi: EWMA p = 0,0167, GARCH p = 0,0283. 16 Okt 2026: return log −0,1506; VaR95 EWMA 0,0169, GARCH 0,0228, historis 0,0286 — VaR kondisional bereaksi setelah guncangan, bukan sebelum. VaR95 maks OOS: EWMA 0,0664 (21 Okt), GARCH 0,1439 (19 Okt). Limit harian: pakai VaR kondisional; eskalasi bila >2× statis atau setelah klaster pelanggaran.",
        "Lab: Kupiec 100 hari (LR = 2,7510, p = 0,0972, TIDAK ditolak); EWMA 6 hari (vol akhir 0,0192).",
      ],
      next: { label: "Lanjut: MLF-M4.4 — Greeks & Dekomposisi Risiko", href: "/v2/learn/mlf-m44-greeks-risk-decomposition" },
    },
  ],
};

