import type { V2Lesson } from "../lib/types";

export const mlfM55: V2Lesson = {
  slug: "mlf-m55-black-litterman-shrinkage",
  track: "Machine Learning Finance",
  module: "Optimization & portfolio construction",
  title: "MLF-M5.5 — Black-Litterman & Shrinkage: Melawan Estimation Error",
  estMinutes: 70,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Modul M5 adalah optimisasi portofolio: dari mean-variance dan efficient frontier, ke risk parity dan kendala, ke optimisasi numerik, ke shrinkage dan evaluasi out-of-sample. Lesson ini adalah penutup modul — dan wadah tema yang mengikat seluruh modul: estimation error, atau yang di literatur disebut optimizer's curse. Optimizer bukan musuh; ia hanya melakukan persis apa yang diminta: memaksimalkan Sharpe atas angka-angka yang kamu berikan. Bila angka-angka itu sebagian besar noise, optimizer akan memaksimalkan noise — dengan penuh keyakinan.",
        "Tujuan lesson ini:",
        "• Menjelaskan optimizer's curse: frontier in-sample vs realisasi out-of-sample, dengan angka OOS nyata dari data pin.",
        "• Menjelaskan mengapa mean return adalah parameter yang paling sulit diestimasi — dengan standard error dan t-statistik nyata.",
        "• Menjelaskan shrinkage dan Ledoit-Wolf: delta shrinkage 0,0955, dan apa yang benar-benar ia perbaiki (vol, bukan return).",
        "• Menjelaskan kendala (long-only, batas bobot) sebagai bentuk regularisasi — kaitannya dengan M5.2.",
        "• Menjelaskan Black-Litterman: prior equilibrium, satu view [ilustrasi], dan posterior — dengan angka lengkapnya.",
        "• Membaca posterior dengan jujur: Sharpe 0,7671 pada statistik posterior vs −0,6178 pada statistik sample.",
        "• Menguji sensitivitas Black-Litterman: tau sendirian tidak mengubah posterior (konvensi He-Litterman) — yang menggerakkannya adalah keyakinan relatif (skala Omega), ukuran view, dan proxy pasar.",
        "• Membangun robust optimization: uncertainty set dari standard error, worst-case return yang membalik peringkat GMV vs equal-weight, dan harga yang dibayar untuk jaminan worst-case.",
        "• Menjalankan walk-forward 6 lipatan sebagai evaluasi kedua di samping split 240/240 — konsistensi, bukan kemenangan sekali-split.",
        "• Menyusun checklist praktis sebelum percaya optimizer apa pun — dan peta 5 lesson modul M5.",
        "• Menjalankan dua lab dari nol: split OOS pada data mainan, dan Ledoit-Wolf + Black-Litterman pada 2 aset.",
        "Isi lesson: optimizer's curse → mengapa mean sulit diestimasi → shrinkage Ledoit-Wolf → kendala sebagai regularisasi → Black-Litterman → membaca posterior dengan jujur → sensitivitas Black-Litterman → robust optimization → walk-forward → checklist → 2 lab → rangkuman modul M5 → jembatan ke M6 dan M7 → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook M5.5 dan file kanonis m5_canonical.json [notebook]: BBCA.JK + KLBF.JK + UNVR.JK, 480 hari return SIMPLE, window unduhan 2024-11-01 sampai 2026-11-12 (480 hari return: 2024-11-04 s.d. 2026-11-11), rf = 0,05. Split out-of-sample: 240 hari pertama untuk estimasi, 240 hari berikut untuk uji. Return tahunan periode 1: BBCA −0,1257, KLBF −0,1006, UNVR +0,4831. Periode 2: BBCA −0,3634, KLBF −0,4134, UNVR −0,3239. Ledoit-Wolf delta shrinkage 0,0955. Black-Litterman: delta (risk-aversion) 2,5, tau 0,05, view [ilustrasi] «BBCA mengungguli KLBF 2pp per tahun», market proxy equal-weight karena data pin tidak memuat market cap — asumsi ini dinyatakan eksplisit di langkah 6.",
      ],
      tasks: [],
    },
    {
      id: "curse",
      eyebrow: "Langkah 2 · Optimizer's curse",
      title: "Optimizer's curse: frontier yang indah, realisasi yang kejam",
      prose: [
        "Bayangkan kamu menjalankan optimizer pada 240 hari pertama. Ia melihat UNVR naik +48,31 persen per tahun dan berkata: taruh semua uang di UNVR. Max-Sharpe in-sample: return 0,4831, vol 0,5667, Sharpe 0,7644 [notebook]. Frontier-nya tampak meyakinkan — portofolio itu duduk di ujung efficient frontier, jauh di atas portofolio lain. Lalu 240 hari berikutnya datang, dan UNVR justru −32,39 persen per tahun. Max-Sharpe OOS: return −0,3239, vol 0,4259, Sharpe −0,8780 [notebook]. Portofolio «optimal» itu kehilangan sepertiga nilainya.",
        "Dan ini bukan cerita tentang satu portofolio yang sial. Lihat tabel lengkapnya [notebook] — in-sample (240 hari pertama) vs out-of-sample (240 hari berikut), rf 0,05:",
        "• Max-Sharpe [0,0,1]: IN return 0,4831 vol 0,5667 Sharpe 0,7644 → OOS return −0,3239 vol 0,4259 Sharpe −0,8780.",
        "• GMV [0,6914; 0,2069; 0,1017]: IN −0,0586 / 0,2624 / −0,4139 → OOS −0,3697 / 0,3372 / −1,2447.",
        "• Risk parity [0,4632; 0,2986; 0,2382]: IN 0,0268 / 0,2812 / −0,0825 → OOS −0,3689 / 0,3160 / −1,3258.",
        "• Equal-weight [1/3; 1/3; 1/3]: IN 0,0856 / 0,3088 / 0,1154 → OOS −0,3669 / 0,3140 / −1,3278.",
        "• GMV-Ledoit-Wolf [0,6282; 0,2409; 0,1308]: IN −0,0400 / 0,2637 / −0,3412 → OOS −0,3703 / 0,3296 / −1,2752.",
        "Gambar di bawah membandingkan return IN vs OOS keempat portofolio pertama. Perhatikan polanya: semua bar IN tersebar dari −0,06 sampai +0,48 — optimizer tampak membedakan portofolio dengan jelas. Semua bar OOS menumpuk di sekitar −0,32 sampai −0,37 — nyaris tidak ada perbedaan. Perbedaan yang dijanjikan frontier lenyap; yang tersisa adalah crash yang menimpa semua orang.",
        "Nilai: periode 2 adalah crash merata — ketiga saham jatuh −32 persen sampai −41 persen per tahun [notebook]. TIDAK ADA portofolio yang menyelamatkan return OOS: semua −32 persen sampai −37 persen. Yang berhasil dikendalikan hanya VOL: GMV OOS 0,3372 vs max-Sharpe OOS 0,4259 — kontrol risiko bekerja, prediksi return gagal. Itulah optimizer's curse dalam bentuknya yang paling jujur: optimizer mengoptimalkan angka estimasi, dan angka estimasi itu salah — bukan karena rumusnya salah, melainkan karena inputnya noise.",
        "Baik atau buruk: optimisasi bagus bila inputnya punya sinyal — ia mengubah keyakinan menjadi bobot dengan cara yang konsisten. Buruk bila inputnya didominasi noise: optimizer justru MEMPERBESAR kesalahan estimasi, karena ia menaruh bobot terbesar pada aset yang estimasinya paling berlebihan (UNVR +48 persen — lihat langkah 3 mengapa angka itu tidak bisa dipercaya).",
        "Mitigasi: jangan pernah menilai portofolio dari statistik in-sample-nya saja. Selalu minta statistik out-of-sample-nya — dan bila OOS tidak ada, anggap janji in-sample sebagai janji yang belum teruji. Itulah mengapa modul ini menutup dengan lesson ini, bukan dengan frontier yang lebih halus.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar return in-sample vs out-of-sample: max-Sharpe +0,4831 vs -0,3239; GMV -0,0586 vs -0,3697; risk parity +0,0268 vs -0,3689; equal-weight +0,0856 vs -0,3669">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Return tahunan: in-sample (240 hari pertama) vs OOS (240 hari berikut)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,40</text>
<line x1="48" y1="166.9" x2="52" y2="166.9" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="169.9" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,20</text>
<line x1="48" y1="127.8" x2="52" y2="127.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="130.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,20</text>
<line x1="48" y1="49.6" x2="52" y2="49.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="52.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,40</text>
<line x1="52" y1="127.8" x2="466" y2="127.8" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="70" y="33.3" width="38" height="94.5" fill="var(--c4)"/>
<text x="89" y="29.3" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+0,48</text>
<rect x="112" y="127.8" width="38" height="63.3" fill="var(--c1)"/>
<text x="131" y="205.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,32</text>
<text x="110" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Max-Sharpe</text>
<rect x="180" y="127.8" width="38" height="11.5" fill="var(--c4)"/>
<rect x="222" y="127.8" width="38" height="72.3" fill="var(--c1)"/>
<text x="241" y="205.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,37</text>
<text x="220" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GMV</text>
<rect x="290" y="122.5" width="38" height="5.3" fill="var(--c4)"/>
<rect x="332" y="127.8" width="38" height="72.1" fill="var(--c1)"/>
<text x="351" y="205.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,37</text>
<text x="330" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Risk parity</text>
<rect x="400" y="111.0" width="38" height="16.8" fill="var(--c4)"/>
<rect x="442" y="127.8" width="38" height="71.7" fill="var(--c1)"/>
<text x="461" y="205.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,37</text>
<text x="440" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Equal-weight</text>
</svg>`,
        alt: "Bar return in-sample vs out-of-sample: max-Sharpe +0,4831 vs −0,3239; GMV −0,0586 vs −0,3697; risk parity +0,0268 vs −0,3689; equal-weight +0,0856 vs −0,3669.",
        caption: "Cara membaca: bar gelap = return in-sample (240 hari pertama), bar terang = return OOS (240 hari berikut) [notebook]. Interpretasi: janji in-sample tersebar lebar (+0,48 sampai −0,06), realisasi OOS menumpuk di −0,32 sampai −0,37 — crash merata, tidak ada portofolio yang selamat.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: portofolio dengan Sharpe in-sample tertinggi adalah portofolio terbaik",
        type: "pitfall",
        body: "Yang benar: max-Sharpe in-sample 0,7644 berubah menjadi Sharpe OOS −0,8780 — justru yang tertinggi (paling tidak negatif) di antara kelimanya, karena return OOS-nya −0,3239 paling ringan; tapi vol OOS-nya 0,4259 adalah yang terburuk. Sharpe in-sample mengukur seberapa baik optimizer menyesuaikan diri dengan masa lalu, bukan seberapa baik portofolio itu di masa depan. Yang membedakan portofolio di OOS di sini bukan return — semuanya −32% sampai −37% — melainkan vol: GMV 0,3372 vs max-Sharpe 0,4259.",
      },
    },
    {
      id: "mean-sulit",
      eyebrow: "Langkah 3 · Mengapa mean sulit diestimasi",
      title: "Mean return: sinyal kecil, noise besar, 240 hari terlalu pendek",
      prose: [
        "Mengapa optimizer begitu mudah tertipu? Karena parameter yang paling ia butuhkan — mean return tiap aset — adalah parameter yang paling sulit diestimasi. Volatilitas dan korelasi bisa diestimasi dengan cukup baik dari 240 hari: keduanya dihitung dari kuadrat dan produk return, yang informasinya terakumulasi cepat. Mean dihitung dari jumlah return — dan return harian didominasi noise: satu hari +5 persen atau −4 persen menggeser rata-rata jauh lebih besar daripada sinyal tahunannya.",
        "Nilai: periode 1 [notebook] — UNVR mean tahunan +0,4831 dengan vol 0,5667. Standard error dari mean tahunan itu adalah 0,5807 — LEBIH BESAR dari estimasinya sendiri. t-statistiknya 0,83: angka +48 persen itu secara statistik tidak bisa dibedakan dari nol. BBCA: mean −0,1257, SE 0,2992, t −0,42. KLBF: mean −0,1006, SE 0,4546, t −0,22. Ketiga mean periode 1 tidak ada satu pun yang signifikan secara statistik — ketiganya konsisten dengan nol. Optimizer yang menaruh 100 persen di UNVR pada dasarnya bertaruh pada angka yang t-statistiknya 0,83.",
        "Rumusnya menjelaskan mengapa menambah data tidak cepat membantu: standard error mean tahunan = vol tahunan × akar(252) / akar(n), dengan n jumlah hari. Vol UNVR 0,5667 berarti SE menyusut sebanding 1 / akar(n) — untuk memangkas SE dari 0,58 menjadi 0,29 (setengahnya) butuh 4 kali data: sekitar 960 hari, hampir 4 tahun. Dan itu pun mengasumsikan mean-nya tidak berubah selama 4 tahun — asumsi yang justru dibantah data ini: mean UNVR berbalik dari +0,4831 menjadi −0,3239 antar periode.",
        "Nilai tambahan: korelasi antar saham NAIK di periode crash — BBCA-KLBF dari 0,2431 (periode 1) menjadi 0,4457 (periode 2), BBCA-UNVR dari 0,2027 menjadi 0,3735, KLBF-UNVR dari 0,2489 menjadi 0,3506 [notebook]. Diversifikasi yang dihitung dari periode 1 melemah tepat saat paling dibutuhkan — diversifikasi menghilang di crash, tema yang sudah kamu lihat di M4.5.",
        "Baik atau buruk: mean sampel bagus sebagai deskripsi masa lalu — ia merangkum apa yang terjadi. Buruk sebagai ramalan: SE-nya bahkan lebih besar dari estimasinya (0,5807 vs 0,4831) pada 240 hari, dan rezim bisa berbalik. Vol dan korelasi jauh lebih stabil antar periode — karena itu metode yang TIDAK memakai mean (GMV, risk parity) lebih bisa diandalkan daripada max-Sharpe, walau keduanya tetap tidak menyelamatkan return di crash ini.",
        "Mitigasi: sebelum percaya mean sampel, hitung SE dan t-statistiknya. Bila t-statistik di bawah 2, perlakukan mean itu sebagai nol — atau shrink ke arah nol / ke arah equilibrium (itulah yang dilakukan Black-Litterman di langkah 6). Dan jangan pernah menaruh 100 persen pada satu angka yang t-statistiknya 0,83.",
      ],
      formula: String.raw`\mathrm{SE}(\hat{\mu}_{ann}) = \sigma_{ann} \cdot \frac{\sqrt{252}}{\sqrt{n}}, \qquad t = \frac{\hat{\mu}_{ann}}{\mathrm{SE}(\hat{\mu}_{ann})}`,
      formulaNote: "Standard error mean return tahunan dan t-statistiknya. n = jumlah hari observasi (di sini 240). UNVR periode 1: mean 0,4831, SE 0,5807, t = 0,83 — tidak signifikan.",
      tasks: [],
      note: {
        title: "Miskonsepsi: 240 hari (satu tahun) sudah cukup untuk mengestimasi return tahunan",
        type: "pitfall",
        body: "Yang benar: dengan vol tahunan 0,5667 (UNVR), SE mean tahunan dari 240 hari adalah 0,5807 — interval ±1 SE saja sudah mencakup −0,10 sampai +1,06. Satu tahun data hampir tidak memberi informasi tentang mean tahunan; ia memberi informasi tentang vol. Itulah mengapa optimizer yang rakus pada mean adalah optimizer yang rakus pada noise.",
      },
    },
    {
      id: "shrinkage",
      eyebrow: "Langkah 4 · Shrinkage",
      title: "Shrinkage: menarik estimasi liar ke arah target yang membosankan",
      prose: [
        "Bila estimasi sampel terlalu berisik, jangan dibuang — ditarik. Shrinkage adalah ide sederhana: gabungkan estimasi sampel dengan sebuah target yang stabil tapi bias, dengan bobot yang dihitung dari data. Estimasi sampel tidak bias tapi variansnya besar; target (misal matriks identitas yang diskalakan, atau matriks diagonal) bias tapi variansnya nol. Kombinasi keduanya — dengan bobot optimal — punya total error (mean squared error) yang LEBIH KECIL daripada keduanya sendirian.",
        "Ledoit-Wolf adalah shrinkage untuk matriks kovarians: kovarians yang di-shrink = (1 − delta) × kovarians sampel + delta × target, dengan delta diestimasi dari data — bukan dipilih sembarangan. Nilai: delta shrinkage = 0,0955 pada window penuh 480 hari [notebook] (implementasi sklearn di notebook memberi 0,0957 — selisih 0,0002 antar varian estimator, kesimpulan sama). Shrinkage-nya KECIL: hanya 9,55 persen bobot pada target. Artinya, data ini berkata bahwa kovarians sampelnya sudah cukup bisa dipercaya — Ledoit-Wolf tidak mengubahnya banyak.",
        "Dan hasilnya memang kecil — dengan jujur harus dikatakan kecil. Full-window [notebook]: GMV biasa bobot [0,5523; 0,2699; 0,1777], return −0,1903, vol 0,2966. GMV-Ledoit-Wolf bobot [0,5185; 0,2852; 0,1963], return −0,1845, vol 0,2969. Bobot bergeser beberapa poin persentase; vol NYARIS SAMA (0,2969 vs 0,2966). Pada split OOS: GMV-LW OOS vol 0,3296 vs GMV OOS 0,3372 — perbaikan 0,0076, kecil tapi searah dengan teori: shrinkage menstabilkan kovarians, dan kovarians yang lebih stabil memberi bobot yang sedikit lebih stabil. Return OOS: GMV-LW −0,3703 vs GMV −0,3697 — TIDAK membaik, bahkan sedikit lebih buruk. Shrinkage membantu vol sedikit; ia tidak menyelamatkan return. JANGAN tulis — di mana pun — klaim «shrinkage memperbaiki return OOS»: data berkata sebaliknya.",
        "Baik atau buruk: shrinkage bagus bila estimasi sampel berisik dan targetnya masuk akal — ia mengurangi varians estimasi tanpa mengorbankan banyak bias. Buruk bila dipakai sebagai jimat: delta 0,0955 yang kecil adalah sinyal bahwa kovarians sampel di sini tidak terlalu bermasalah; memaksa shrinkage besar justru menambah bias tanpa alasan.",
        "Mitigasi: laporkan delta-nya, bukan hanya hasil akhirnya. Delta kecil (0,0955) berarti «sampel sudah cukup baik»; delta besar (mendekati 1) berarti «sampel tidak bisa dipercaya, target mendominasi». Dan ukur perbaikan pada metrik yang shrinkage janjikan — stabilitas vol — bukan pada return, yang bukan urusannya.",
      ],
      formula: String.raw`\hat{\Sigma}_{LW} = (1 - \delta)\,\hat{\Sigma}_{sample} + \delta\,F, \qquad \delta = 0{,}0955 \ \text{[notebook]}`,
      formulaNote: "Ledoit-Wolf: kovarians sampel di-shrink ke arah target F (di sini target diagonal Ledoit-Wolf standar). Delta shrinkage 0,0955 = shrinkage kecil: sampel mendominasi.",
      tasks: [],
    },
    {
      id: "kendala",
      eyebrow: "Langkah 5 · Kendala sebagai regularisasi",
      title: "Kendala: regularisasi yang tidak mengaku bernama regularisasi",
      prose: [
        "Di M5.2 kamu bertemu kendala — long-only (bobot tidak boleh negatif), batas bobot maksimum per aset, batas turnover. Kendala biasanya diajarkan sebagai «aturan bisnis»: manajer dana tidak boleh short, regulator membatasi konsentrasi. Tapi ada pembacaan kedua yang lebih dalam: kendala adalah REGULARISASI. Ia bekerja seperti shrinkage — membatasi seberapa jauh optimizer boleh pergi mengikuti noise.",
        "Bukti paling dramatis ada di file kanonis [notebook]: max-Sharpe TANPA kendala long-only pada window penuh punya bobot [−3154,746; −3786,1043; 6941,8503] — leverage ribuan kali, return 2296,983, vol 3429,6914, Sharpe 0,6697. Angka-angka itu bukan portofolio; itu optimizer yang menemukan arah di ruang bobot di mana noise sampel nyaris sempurna — dan mengikutinya sampai ke ujung. Satu kendala sederhana — bobot tidak boleh negatif, jumlah bobot = 1 — memotong kegilaan itu menjadi [0,0,1]: 100 persen UNVR, Sharpe 0,059. Masih bukan portofolio yang bagus (lihat OOS-nya di langkah 2), tapi setidaknya portofolio yang bisa dipegang.",
        "Nilai: GMV tanpa kendala vs dengan kendala long-only pada window penuh IDENTIK [0,5523; 0,2699; 0,1777] [notebook] — GMV memang tidak butuh short di data ini, jadi kendala tidak mengikatnya. Max-Sharpe-lah yang berubah total. Pelajarannya: kendala mengikat justru pada portofolio yang paling rakus pada mean — dan itulah portofolio yang paling membutuhkan ikatan.",
        "Baik atau buruk: kendala bagus karena ia murah, transparan, dan bekerja tanpa asumsi statistik baru — «tidak boleh short» lebih mudah dijelaskan ke komite investasi daripada «delta shrinkage 0,0955». Buruk bila kendala dipakai membabi buta: batas bobot maksimum 10 persen per aset pada portofolio 3 aset memaksa diversifikasi yang mungkin tidak diinginkan, dan kendala yang terlalu ketat mengubah optimizer menjadi equal-weight yang mahal.",
        "Mitigasi: perlakukan kendala sebagai prior yang eksplisit, bukan sebagai aturan administratif. Tanyakan: «kendala mana yang mengikat, dan apa yang terjadi bila dilonggarkan?» Bila jawabannya adalah bobot melonjak ke ribuan (seperti max-Sharpe tanpa kendala), kendala itu sedang menyelamatkanmu dari noise — catat itu, jangan hapus kendalanya.",
      ],
      tasks: [],
    },
    {
      id: "bl",
      eyebrow: "Langkah 6 · Black-Litterman",
      title: "Black-Litterman: mulai dari equilibrium, bukan dari nol",
      prose: [
        "Black-Litterman menyerang masalah yang sama dari arah berlawanan: bukan «bagaimana memperbaiki estimasi sampel», melainkan «jangan mulai dari estimasi sampel sama sekali». Titik awalnya adalah EQUILIBRIUM: bila pasar sudah efisien, bobot pasar (market portfolio) pastilah optimal — dan dari bobot itu, lewat reverse optimization, kita bisa menyimpulkan return ekspektasi yang DIIMPLIKASIKAN pasar, disebut Pi. Baru setelah itu, view investor — keyakinan yang eksplisit dan terukur — dicampurkan ke Pi lewat rumus Bayes, menghasilkan posterior mean M. Optimizer akhirnya berjalan di atas M, bukan di atas mean sampel.",
        "Asumsi yang wajib dinyatakan — karena data pin tidak memuat market cap, market proxy di sini adalah EQUAL-WEIGHT [1/3; 1/3; 1/3]. Itu asumsi, bukan fakta pasar: bobot pasar yang sebenarnya memakai kapitalisasi, dan hasil Pi bergantung pada proxy ini. Bila kapitalisasi tersedia, pakai itu; di sini equal-weight adalah proxy yang jujur dan dinyatakan.",
        "Nilai [notebook] — delta risk-aversion 2,5, tau 0,05, kovarians sampel window penuh: Pi (equilibrium excess return) = [0,1817; 0,2447; 0,3009]. Perhatikan: Pi semuanya POSITIF dan besar — 18 sampai 30 persen per tahun — karena reverse optimization dari bobot equal-weight dengan delta 2,5 dan vol setinggi ini memang menghasilkan implied return sebesar itu. Itu bukan ramalan; itu «return yang harus diyakini pasar bila equal-weight adalah portofolio optimal».",
        "View-nya [ilustrasi] — WAJIB dilabeli ilustrasi, karena view ini dibuat untuk lesson, bukan dari riset: «BBCA mengungguli KLBF 2pp per tahun», ditulis P = [1, −1, 0], Q = 0,02. Ketidakpastian view (Omega) mengikuti konvensi He-Litterman: Omega = tau × P Sigma P-transpos. Posterior mean M = [0,196; 0,2175; 0,298] [notebook]. Bandingkan dengan Pi: BBCA naik dari 0,1817 menjadi 0,196 (view menaikkan BBCA), KLBF turun dari 0,2447 menjadi 0,2175 (view menurunkan KLBF), UNVR nyaris tidak bergerak 0,3009 menjadi 0,298 — view terutama menggerakkan aset yang disebutnya (efek pada UNVR yang tak-disebut ada lewat kovarians, tapi kecil: −0,0029). Bobot BL (max-Sharpe long-only atas M): [0,4173; 0,2493; 0,3334] [notebook].",
        "Baik atau buruk: Black-Litterman bagus karena ia memaksa investor menyatakan view secara eksplisit — «BBCA mengungguli KLBF 2pp» — lengkap dengan ketidakpastiannya, dan karena prior equilibrium mencegah optimizer lari ke sudut ekstrem. Buruk bila view-nya sendiri adalah noise yang dibungkus rapi: rumus Bayes tidak bisa membedakan view yang beralasan dari tebakan — ia hanya mencampurkannya dengan bobot yang dihitung dari ketidakpastian yang KAMU nyatakan. View yang terlalu yakin (Omega kecil) akan mendominasi posterior, betapapun lemahnya alasannya.",
        "Mitigasi: selalu laporkan Pi, view, dan M berdampingan — seperti di atas — sehingga siapa pun bisa melihat seberapa jauh view menggeser prior. Bila M nyaris sama dengan Pi, view-mu tidak menambah apa-apa; bila M jauh dari Pi, tanyakan apakah keyakinanmu memang sebesar itu. Dan ingat: posterior adalah keyakinan yang diperbarui, bukan ramalan — langkah 7 menunjukkan apa yang terjadi bila posterior dibaca sebagai ramalan.",
      ],
      formula: String.raw`M = \left[(\tau\Sigma)^{-1} + P'\Omega^{-1}P\right]^{-1} \left[(\tau\Sigma)^{-1}\Pi + P'\Omega^{-1}Q\right], \qquad \Pi = \delta\,\Sigma\,w_{mkt}`,
      formulaNote: "Posterior mean Black-Litterman: rata-rata tertimbang presisi antara prior equilibrium Pi dan view Q. Di sini delta (risk-aversion) = 2,5, tau = 0,05, w_mkt = equal-weight (proxy, tanpa market cap di data pin), view [ilustrasi] P = [1, −1, 0], Q = 0,02.",
      tasks: [],
      note: {
        title: "Miskonsepsi: Black-Litterman «memperbaiki» mean sampel",
        type: "pitfall",
        body: "Yang benar: Black-Litterman tidak memperbaiki mean sampel — ia MEMBUANGNYA sebagai titik awal dan menggantinya dengan equilibrium Pi, lalu mencampur view. Mean sampel periode 1 (UNVR +0,4831) tidak muncul di mana pun dalam perhitungan M = [0,196; 0,2175; 0,298]. Kekuatan BL justru di situ: ia tidak membiarkan satu angka sampel yang t-statistiknya 0,83 mendikte portofolio.",
      },
    },
    {
      id: "jujur",
      eyebrow: "Langkah 7 · Membaca posterior dengan jujur",
      title: "Posterior bukan ramalan: Sharpe 0,77 yang berubah menjadi −0,62",
      prose: [
        "Sekarang bagian terpenting lesson ini. Bobot BL [0,4173; 0,2493; 0,3334] dievaluasi dua cara [notebook]:",
        "• Pada statistik POSTERIOR (M sebagai mean, kovarians sampel sebagai vol): return 0,2854, vol 0,3068, Sharpe 0,7671 — return 0,2854 = w·M + rf = 0,2354 + 0,05, karena M adalah excess return.",
        "• Pada statistik SAMPLE (mean sampel window penuh sebagai mean, vol yang sama): return −0,1396, Sharpe −0,6178.",
        "Gambar di bawah menaruh kedua Sharpe itu berdampingan. Satu portofolio, satu vol, dua Sharpe — yang satu menjanjikan 0,77, yang lain −0,62. Selisihnya 1,38 poin Sharpe, dan seluruh selisih itu berasal dari satu pilihan: mean mana yang kamu pakai untuk menilai.",
        "Nilai: Sharpe 0,7671 pada statistik posterior BUKAN hasil investasi — ia adalah konsistensi internal: «bila keyakinan posterior benar, inilah Sharpe-nya». Sharpe −0,6178 pada statistik sample adalah evaluasi yang jujur terhadap realisasi: mean sampel window penuh adalah BBCA −0,2445, KLBF −0,2570, UNVR +0,0796 — dan bobot BL yang menaruh 41,73 persen di BBCA serta 24,93 persen di KLBF menelan dua mean negatif itu. Posterior BUKAN ramalan: ia adalah keyakinan yang diperbarui, dan keyakinan bisa salah — terutama bila prior-nya (Pi 0,18–0,30, semuanya positif besar) dan view-nya ([ilustrasi]) tidak sesuai dengan apa yang kemudian terjadi.",
        "Baik atau buruk: evaluasi pada posterior bagus sebagai CEK KONSISTENSI — ia menjawab «apakah bobot ini masuk akal bila keyakinanku benar?». Buruk bila dibaca sebagai EKSPEKTASI return — ia menjawab pertanyaan yang salah dengan angka yang terlihat meyakinkan. Evaluasi pada statistik sample (atau lebih baik lagi, OOS) adalah yang menguji apakah keyakinan itu benar.",
        "Mitigasi: setiap kali melihat Sharpe dari portofolio BL — atau dari portofolio apa pun yang dibangun dari prior/view — tanyakan SELALU: «Sharpe ini dihitung pada mean yang mana?» Bila jawabannya «pada posterior», mintalah angka keduanya: posterior dan sample (atau OOS). Portofolio yang hanya bagus pada statistiknya sendiri belum membuktikan apa-apa.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar Sharpe BL: pada statistik posterior 0,7671; pada statistik sample -0,6178">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Sharpe portofolio BL: posterior 0,7671 vs sample −0,6178</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,80</text>
<line x1="48" y1="164.6" x2="52" y2="164.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="167.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,40</text>
<line x1="48" y1="123.2" x2="52" y2="123.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="126.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="81.8" x2="52" y2="81.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="84.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,40</text>
<line x1="48" y1="40.4" x2="52" y2="40.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="43.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,80</text>
<line x1="52" y1="123.2" x2="466" y2="123.2" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="120" y="43.8" width="80" height="79.4" fill="var(--c4)"/>
<text x="160" y="39.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7671</text>
<text x="160" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Pada statistik posterior</text>
<rect x="300" y="123.2" width="80" height="63.9" fill="var(--c1)"/>
<text x="340" y="201.1" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,6178</text>
<text x="340" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Pada statistik sample</text>
</svg>`,
        alt: "Bar Sharpe portofolio BL: pada statistik posterior 0,7671; pada statistik sample −0,6178.",
        caption: "Cara membaca: dua bar = Sharpe portofolio BL yang SAMA [0,4173; 0,2493; 0,3334], vol yang sama 0,3068 [notebook]. Interpretasi: 0,7671 adalah konsistensi internal terhadap keyakinan posterior; −0,6178 adalah evaluasi jujur terhadap mean sampel. Posterior bukan ramalan.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: Sharpe posterior 0,77 membuktikan BL bekerja",
        type: "pitfall",
        body: "Yang benar: 0,7671 dihitung dengan mean posterior M itu sendiri — portofolio yang dioptimalkan atas M wajar terlihat bagus bila dinilai dengan M. Itu sirkular. Evaluasi yang tidak sirkular memakai mean sampel (−0,1396, Sharpe −0,6178) atau, lebih baik, data OOS. BL «bekerja» bila view-nya benar — dan view di sini [ilustrasi], bukan ramalan.",
      },
    },
    {
      id: "sensitivitas-bl",
      eyebrow: "Langkah 8 · Sensitivitas Black-Litterman",
      title: "Sensitivitas Black-Litterman: tau tidak menggerakkan apa-apa — Omega dan proxy yang menggerakkan",
      prose: [
        "Di langkah 6, posterior M = [0,196; 0,2175; 0,298] dihitung dengan tau 0,05. Pertanyaan yang wajar: seberapa sensitif M terhadap pilihan tau itu? Jawabannya mengejutkan — dan inilah jebakan yang paling sering menjerat pengguna Black-Litterman: dengan konvensi He-Litterman yang dipakai lesson ini, Omega = tau × PΣP-transpos, tau SENDIRIAN TIDAK mengubah apa-apa. tau 0,01, 0,05, dan 0,20 memberi M yang SAMA PERSIS [0,196; 0,2175; 0,298], bobot yang sama [0,4173; 0,2493; 0,3334], dan Sharpe posterior yang sama 0,7671 [notebook].",
        "Alasannya ada di rumus posterior langkah 6: prior masuk lewat (τΣ)⁻¹ dan view masuk lewat Ω⁻¹ — dan karena Ω = τ·PΣP-transpos, keduanya berskala 1/τ. Naikkan tau 4 kali lipat, kedua suku presisi sama-sama mengecil 4 kali lipat, dan rasio keduanya — yang menentukan M — tidak berubah. τ saling meniadakan. Banyak yang mengira tau adalah «bobot view» — seberapa besar view dipercaya relatif terhadap prior. Di konvensi ini, BUKAN: tau hanya mengatur skala ketidakpastian absolut, dan skala absolut itu tidak memengaruhi rata-rata posterior (ia memengaruhi kovarians posterior, bukan M).",
        "Yang BENAR-BENAR menggerakkan M adalah keyakinan RELATIF — skala Omega terhadap tau·PΣP-transpos. Kalikan Omega dengan 0,5 (lebih yakin pada view): M menjadi [0,2007; 0,2084; 0,2971], bobot [0,4453; 0,2212; 0,3335]. Kalikan Omega dengan 2 (kurang yakin): M [0,1912; 0,2265; 0,2990], bobot [0,3893; 0,2773; 0,3334]. Kalikan dengan 4: M [0,1874; 0,2338; 0,2998], bobot [0,3669; 0,2997; 0,3334] [notebook]. Arahnya masuk akal: semakin yakin pada view «BBCA mengungguli KLBF», semakin jauh BBCA naik dan KLBF turun dari Pi. Perhatikan satu detail: bobot UNVR nyaris tidak bergerak — 0,3334 sampai 0,3335 di semua variasi — karena view hanya menyebut BBCA vs KLBF; aset yang tidak disebut hampir tidak tersentuh.",
        "Ukuran view Q juga menggerakkan M, dengan cara yang sama masuk akalnya. Q = 0,01 (view setengah dari baseline): M [0,1943; 0,2207; 0,2984], bobot [0,4072; 0,2594; 0,3334]. Q = 0,02 (baseline): M [0,196; 0,2175; 0,298]. Q = 0,05 (view lebih agresif): M [0,2011; 0,2076; 0,2970], bobot [0,4477; 0,2189; 0,3335] [notebook]. View yang lebih besar menggeser posterior lebih jauh dari Pi — tapi ingat langkah 7: menggeser posterior lebih jauh bukan berarti lebih benar; itu hanya berarti keyakinanmu lebih kuat.",
        "Dan yang paling menggerakkan M justru bukan view-nya — melainkan proxy pasar yang menentukan Pi. Dengan proxy equal-weight (baseline): Pi [0,1817; 0,2447; 0,3009], M [0,196; 0,2175; 0,298], bobot [0,4173; 0,2493; 0,3334]. Ganti proxy dengan GMV [0,5523; 0,2699; 0,1777] sebagai «pasar»: Pi menjadi [0,2201; 0,2200; 0,2196] — nyaris RATA — karena GMV hampir meminimalkan w'Σw, sehingga implied return dari bobot itu hampir sama untuk ketiga aset; M menjadi [0,2235; 0,2135; 0,2189] dan bobot [0,5722; 0,2497; 0,1782] — nyaris bobot GMV itu sendiri [notebook]. Proxy [0,5; 0,3; 0,2] [ilustrasi]: Pi [0,2110; 0,2304; 0,2320], M [0,2178; 0,2175; 0,2306], bobot [0,5395; 0,2601; 0,2003]. Pesannya: Pi — dan karena itu seluruh jawaban BL — SANGAT sensitif terhadap proxy. Proxy bukan detail teknis; ia adalah asumsi yang menentukan jawaban.",
        "Nilai: sensitivitas ini adalah kabar baik sekaligus buruk. Baik: BL transparan — setiap input (tau, Omega, Q, proxy) punya efek yang bisa dihitung dan dilaporkan, seperti di atas. Buruk: bila satu input yang tidak kamu sadari — proxy equal-weight, karena data pin tidak memuat market cap — ternyata menentukan jawaban, maka «jawaban BL» sebenarnya adalah «jawaban proxy».",
        "Baik atau buruk: analisis sensitivitas bagus bila ia mengubah «parameter yang kupilih» menjadi «parameter yang kuuji» — seperti tabel-tabel di langkah ini. Buruk bila ia dipakai untuk memilih parameter yang memberi jawaban paling menyenangkan (memilih proxy karena bobotnya terlihat bagus adalah cherry-picking dengan rumus).",
        "Mitigasi: setiap kali melaporkan hasil BL, laporkan tabel sensitivitasnya — tau, skala Omega, Q, dan proxy — seperti langkah ini. Bila M bergerak besar saat proxy diganti, akui bahwa jawabanmu adalah jawaban proxy, bukan jawaban pasar.",
      ],
      formula: String.raw`M = \left[(\tau\Sigma)^{-1} + P'\Omega^{-1}P\right]^{-1} \left[(\tau\Sigma)^{-1}\Pi + P'\Omega^{-1}Q\right], \qquad \Omega = \tau\,P\Sigma P'`,
      formulaNote: "Dengan Ω = τ·PΣP' (konvensi He-Litterman), (τΣ)⁻¹ dan Ω⁻¹ sama-sama berskala 1/τ — τ saling meniadakan dan M tidak bergantung pada τ sendirian. Yang menggerakkan M adalah skala RELATIF Ω terhadap τ·PΣP', ukuran Q, dan proxy pasar yang menentukan Π.",
      tasks: [],
      note: {
        title: "Miskonsepsi: tau yang lebih besar berarti view lebih dipercaya",
        type: "pitfall",
        body: "Yang benar: dengan konvensi He-Litterman (Ω = τ·PΣP'), tau 0,01 / 0,05 / 0,20 memberi M yang SAMA PERSIS [0,196; 0,2175; 0,298] — tau saling meniadakan di rumus posterior. Yang mengatur bobot view adalah skala Omega RELATIF terhadap τ·PΣP-transpos: Omega ×0,5 menggeser M ke [0,2007; 0,2084; 0,2971], Omega ×2 ke [0,1912; 0,2265; 0,2990]. Bila kamu memakai konvensi lain (mis. Omega dipilih bebas, bukan τ·PΣP'), tau BISA berpengaruh — jadi selalu nyatakan konvensimu sebelum mengklaim efek tau.",
      },
    },
    {
      id: "robust-optimization",
      eyebrow: "Langkah 9 · Robust optimization",
      title: "Robust optimization: bila mean salah sebesar satu standard error",
      prose: [
        "Inilah topik yang dijanjikan M5.2: robust optimization — optimisasi yang tidak percaya pada satu titik estimasi, melainkan pada satu HIMPUNAN kemungkinan. Ide dasarnya sederhana: daripada mengoptimalkan atas mean sampel μ̂, optimalkan atas kasus TERBURUK dalam suatu uncertainty set di sekitar μ̂. Bila portofolio itu tetap layak pada skenario terburuk yang masuk akal, ia robust — tahan terhadap kesalahan estimasi.",
        "Uncertainty set yang dipakai di sini adalah box: tiap mean bisa meleset sampai satu standard error ke bawah. SE return tahunan (n = 480, SE = vol × √(252/480)): BBCA 0,2499, KLBF 0,3080, UNVR 0,3633 [notebook]. Worst-case μ pada k = 1 (μ − SE): [−0,4944; −0,5650; −0,2837] — perhatikan, SEMUA worst-case mean negatif, karena mean sampelnya sendiri sudah negatif (BBCA −0,2445, KLBF −0,2570) atau kecil (UNVR 0,0796) dibanding SE-nya. Itu bukan pesimisme yang dibuat-buat; itu ukuran ketidakpastian yang dihitung dari data yang sama.",
        "Sekarang nilai keempat portofolio pada worst-case μ itu (k = 1) [notebook]: GMV −0,4760, equal-weight −0,4477, risk parity −0,4579, max-Sharpe −0,2837. Bandingkan dengan nominalnya (GMV −0,1903, EW −0,1406, RP −0,1575, MS 0,0796): GMV yang «terbaik» secara nominal — vol terkecil 0,2966 — menjadi TERBURUK secara worst-case; equal-weight yang «biasa saja» menjadi terbaik kedua. Flip ini sudah terjadi pada k = 0,5 (GMV −0,3332 vs EW −0,2942) dan bertahan pada k = 1,5 (GMV −0,6189 vs EW −0,6012). Pesannya: optimisasi nominal memaksimalkan kesalahan estimasi — robust optimization mengubah PERINGKAT, bukan hanya angkanya. Max-Sharpe tetap «terbaik» worst-case (−0,2837) hanya karena ia 100 persen UNVR, aset yang worst-case-nya paling ringan — bukan karena ia robust secara desain.",
        "Kenapa GMV kalah? Karena GMV mengorbankan return demi vol: ia menaruh bobot terbesar pada BBCA (0,5523), aset yang worst-case-nya −0,4944 — dan hampir tidak peduli bahwa mean BBCA itu sendiri tidak bisa dipercaya (langkah 3: t-statistik −0,42). Worst-case menghukum RETURN, bukan vol — dan GMV adalah portofolio yang paling mengabaikan return. Inilah ironi yang harus diingat: metode yang paling «aman» secara nominal bisa menjadi yang paling rapuh begitu ketidakpastian mean ikut dihitung.",
        "Robust max-Sharpe — memaksimalkan Sharpe atas worst-case μ (k = 1) — memberi bobot yang tetap [0; 0; 1] (100 persen UNVR, aset least-bad) dengan worst-case Sharpe −0,6655 [notebook]. Robust tidak selalu mengubah bobot; ia mengubah KEYAKINAN pada bobot itu. Bobot yang sama, dibaca dengan jujur: Sharpe nominalnya 0,059, worst-case-nya −0,6655 — selisih 0,72 poin Sharpe adalah harga ketidakpastian mean.",
        "Robust GMV dengan lantai worst-case return −0,35 (cari vol minimum dengan syarat worst-case return ≥ −0,35): bobot [0,3147; 0; 0,6853], return nominal −0,0224, vol 0,3880, worst-case tepat −0,3500 [notebook]. KLBF dibuang sepenuhnya — worst-case-nya −0,5650 adalah yang paling buruk — dan bobot pindah ke UNVR (0,6853). Dengan lantai yang lebih longgar, −0,40: bobot [0,4866; 0,0490; 0,4645], return nominal −0,0946, vol 0,3313. Robust optimization «membayar» vol (0,2966 → 0,3880 pada lantai −0,35) untuk jaminan worst-case. Itu harga yang eksplisit — dan justru karena eksplisit, ia bisa dinegosiasikan: seberapa besar jaminan yang kamu mau, seberapa besar vol yang kamu rela bayar?",
        "Nilai: robust optimization bagus karena ia mengubah ketidakpastian yang biasanya disembunyikan (SE mean) menjadi bagian dari masalah optimisasi — lengkap dengan harganya. Buruk bila uncertainty set-nya dipilih sembarangan: k = 1,5 memberi worst-case yang begitu pesimistis (semua mean −0,47 sampai −0,72) sehingga hampir tidak ada portofolio yang layak — robust yang terlalu konservatif sama tidak bergunanya dengan optimisasi yang terlalu percaya diri.",
        "Baik atau buruk: robust optimization bagus sebagai ALAT UJI — ia menunjukkan seberapa rapuh peringkat nominalmu. Buruk bila dibaca sebagai pengganti estimasi yang lebih baik: worst-case bukan ramalan, ia adalah skenario stres; portofolio yang «robust» terhadap box yang salah tetap bisa gagal di dunia nyata.",
        "Mitigasi: laporkan selalu k yang dipakai dan SE-nya, dan tunjukkan bagaimana jawaban berubah dari k = 0,5 ke k = 1,5 — seperti tabel di langkah ini. Bila peringkat berbalik pada k kecil, peringkat nominalmu memang rapuh — dan keputusan yang diambil dari peringkat itu harus ditunda sampai estimasinya membaik.",
      ],
      formula: String.raw`\mathrm{SE}_i = \sigma_i\sqrt{252/n}, \qquad \mu^{wc} = \hat{\mu} - k\cdot\mathrm{SE}, \qquad R^{wc}(w) = w'\mu^{wc}`,
      formulaNote: "Worst-case mean (box uncertainty set): mean sampel dikurangi k × standard error. Di sini n = 480 hari, SE = [0,2499; 0,3080; 0,3633], k = 1 memberi μ_wc = [−0,4944; −0,5650; −0,2837]. Robust GMV = vol minimum dengan syarat R_wc(w) ≥ lantai (lantai −0,35 → w [0,3147; 0; 0,6853]).",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar return nominal vs worst-case (k=1): GMV -0,1903 vs -0,4760; equal-weight -0,1406 vs -0,4477; risk parity -0,1575 vs -0,4579; max-Sharpe +0,0796 vs -0,2837">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Return tahunan: nominal vs worst-case (k = 1)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,50</text>
<line x1="48" y1="176.7" x2="52" y2="176.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="179.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,40</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,30</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,20</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,10</text>
<line x1="48" y1="59.3" x2="52" y2="59.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="62.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<line x1="52" y1="59.3" x2="466" y2="59.3" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="70" y="59.3" width="38" height="55.8" fill="var(--c4)"/>
<text x="89" y="125.2" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,19</text>
<rect x="112" y="59.3" width="38" height="139.6" fill="var(--c1)"/>
<text x="131" y="205.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,48</text>
<text x="110" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">GMV</text>
<rect x="180" y="59.3" width="38" height="41.2" fill="var(--c4)"/>
<text x="199" y="110.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,14</text>
<rect x="222" y="59.3" width="38" height="131.3" fill="var(--c1)"/>
<text x="241" y="200.7" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,45</text>
<text x="220" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Equal-weight</text>
<rect x="290" y="59.3" width="38" height="46.2" fill="var(--c4)"/>
<text x="309" y="115.5" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,16</text>
<rect x="332" y="59.3" width="38" height="134.3" fill="var(--c1)"/>
<text x="351" y="203.7" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,46</text>
<text x="330" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Risk parity</text>
<rect x="400" y="36.0" width="38" height="23.3" fill="var(--c4)"/>
<text x="419" y="32.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+0,08</text>
<rect x="442" y="59.3" width="38" height="83.2" fill="var(--c1)"/>
<text x="461" y="152.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,28</text>
<text x="440" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Max-Sharpe</text>
</svg>`,
        alt: "Bar return nominal vs worst-case (k = 1): GMV −0,1903 vs −0,4760; equal-weight −0,1406 vs −0,4477; risk parity −0,1575 vs −0,4579; max-Sharpe +0,0796 vs −0,2837.",
        caption: "Cara membaca: bar gelap = return nominal (window penuh), bar terang = worst-case return pada μ_wc = μ − SE (k = 1) [notebook]. Interpretasi: GMV yang «terbaik» secara nominal (vol terkecil 0,2966) menjadi TERBURUK secara worst-case (−0,4760); equal-weight yang «biasa saja» menjadi terbaik kedua (−0,4477). Robust optimization mengubah peringkat, bukan hanya angkanya.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: robust optimization selalu mengubah bobot — dan GMV selalu paling aman",
        type: "pitfall",
        body: "Yang benar: robust max-Sharpe tetap [0; 0; 1] — sama dengan max-Sharpe nominal. Yang berubah adalah KEYAKINAN: Sharpe nominal 0,059 vs worst-case −0,6655. Dan GMV — yang vol-nya terkecil (0,2966) — justru TERBURUK secara worst-case (−0,4760 vs EW −0,4477), karena worst-case menghukum return, bukan vol. «Paling aman» tanpa menyebut terhadap apa adalah klaim kosong.",
      },
    },
    {
      id: "walk-forward",
      eyebrow: "Langkah 10 · Walk-forward",
      title: "Walk-forward: enam lipatan, satu rezim — dan mengapa itu tetap lebih baik dari satu split",
      prose: [
        "Split 240/240 di langkah 2 adalah SATU ujian: estimasi dari 240 hari pertama, uji pada 240 hari berikut. Walk-forward mengulang ujian itu enam kali. Desainnya [notebook]: 6 lipatan × 40 hari; train expanding dari 240 hari — lipatan 1: hari 1–240 → test 241–280; lipatan 6: hari 1–440 → test 441–480. Bobot diestimasi ulang tiap lipatan dan dipegang selama 40 hari test. Empat strategi diuji: GMV, max-Sharpe, risk parity, equal-weight. Sebagai pembanding, rolling window 240 hari (train selalu 240 hari terakhir, bukan expanding) juga dihitung — hasilnya nyaris sama, jadi lesson ini memakai expanding sebagai acuan.",
        "Tabel lipatan (expanding, total return per lipatan) [notebook]: lipatan 1 — GMV −0,0363, max-Sharpe +0,0710, risk parity −0,0212, EW −0,0104; lipatan 2 — GMV −0,1650, max-Sharpe −0,2366, risk parity −0,1734, EW −0,1799; lipatan 3 — GMV −0,1068, max-Sharpe −0,1225, risk parity −0,1169, EW −0,1218; lipatan 4 — GMV +0,0611, max-Sharpe +0,0613, risk parity +0,0462, EW +0,0400; lipatan 5 — GMV −0,0215, max-Sharpe −0,0663, risk parity −0,0264, EW −0,0298; lipatan 6 — GMV −0,0984, max-Sharpe −0,0525, risk parity −0,0762, EW −0,0656. Perhatikan lipatan 1: satu-satunya lipatan di mana max-Sharpe MENANG BESAR (+0,0710) — lalu lipatan 2 membalasnya dengan −0,2366, yang terburuk dari semua strategi di semua lipatan. Satu lipatan bisa menyanjung; enam lipatan menelanjangi.",
        "Agregat 240 hari test (expanding) [notebook]: GMV total −0,3272, vol 0,3321, Sharpe −1,2342, maxDD −0,4045, menang vs EW 4/6 lipatan; max-Sharpe total −0,3264, vol 0,4259, Sharpe −0,8780, maxDD −0,4865, 3/6; risk parity total −0,3276, vol 0,3145, Sharpe −1,3231, maxDD −0,4107, 4/6; equal-weight total −0,3279, vol 0,3140, Sharpe −1,3278, maxDD −0,4218. Rolling window: GMV total −0,3192, Sharpe −1,2123; max-Sharpe −0,3264; risk parity −0,3253; equal-weight −0,3279 — nyaris sama dengan expanding, jadi kesimpulan tidak bergantung pada pilihan expanding vs rolling di sini.",
        "JUJUR: walk-forward TIDAK membalikkan vonis split 240/240. Semua strategi total ≈ −0,32 sampai −0,33 — crash merata periode 2 menghantam keenam lipatan tanpa kecuali; yang membedakan hanya vol dan maxDD (GMV maxDD −0,4045 vs max-Sharpe −0,4865). Nilai walk-forward bukan di situ: ia menunjukkan KONSISTENSI — GMV menang vs EW di 4 dari 6 lipatan, risk parity juga 4/6 — bukan kemenangan sekali-split yang bisa jadi kebetulan satu jendela. Dan batasnya harus dinyatakan sama jujurnya: 6 lipatan tetap SATU rezim — semuanya berada di dalam crash yang sama. Walk-forward di sini bukan bukti lintas-rezim; bukti lintas-rezim butuh data dari rezim yang berbeda, dan itu pekerjaan M9.",
        "Nilai: walk-forward bagus karena ia mengubah satu angka OOS menjadi sebuah DISTRIBUSI hasil — enam lipatan, enam return, dan hitungan «menang berapa dari 6» yang jauh lebih sulit dimanipulasi oleh pemilihan jendela daripada satu split. Buruk bila dibaca sebagai bukti yang lebih kuat daripada sebenarnya: lipatan-lipatan yang tumpang tindih (train expanding yang saling memuat) TIDAK independen — 4/6 bukan 4 percobaan independen.",
        "Baik atau buruk: walk-forward bagus sebagai EVALUASI KEDUA di samping split tunggal — ia menjawab «apakah hasil split itu kebetulan jendelanya?». Buruk bila ia dipakai untuk mengklaim «terbukti di 6 lipatan» tanpa menyebut bahwa keenamnya satu rezim — itu satu bukti yang dihitung enam kali, bukan enam bukti.",
        "Mitigasi: laporkan selalu desainnya (expanding vs rolling, ukuran lipatan, berapa kali estimasi ulang) dan agregatnya berdampingan dengan split tunggal — seperti di langkah ini. Dan jangan pernah menukar «konsisten di 6 lipatan» dengan «benar di semua rezim».",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar total return per lipatan GMV vs equal-weight: L1 -0,0363 vs -0,0104; L2 -0,1650 vs -0,1799; L3 -0,1068 vs -0,1218; L4 +0,0611 vs +0,0400; L5 -0,0215 vs -0,0298; L6 -0,0984 vs -0,0656">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Total return per lipatan: GMV vs equal-weight (walk-forward)</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,20</text>
<line x1="48" y1="174.6" x2="52" y2="174.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="177.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,15</text>
<line x1="48" y1="143.1" x2="52" y2="143.1" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="146.1" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,10</text>
<line x1="48" y1="111.7" x2="52" y2="111.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="114.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,05</text>
<line x1="48" y1="80.3" x2="52" y2="80.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="83.3" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="48.9" x2="52" y2="48.9" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="51.9" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,05</text>
<line x1="52" y1="80.3" x2="466" y2="80.3" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="58" y="80.3" width="26" height="22.8" fill="var(--c4)"/>
<text x="71" y="112.1" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,04</text>
<rect x="86" y="80.3" width="26" height="6.5" fill="var(--c1)"/>
<text x="99" y="95.8" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,01</text>
<text x="85" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">L1</text>
<rect x="127" y="80.3" width="26" height="103.7" fill="var(--c4)"/>
<text x="140" y="193.0" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,17</text>
<rect x="155" y="80.3" width="26" height="113.1" fill="var(--c1)"/>
<text x="168" y="202.4" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,18</text>
<text x="154" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">L2</text>
<rect x="196" y="80.3" width="26" height="67.1" fill="var(--c4)"/>
<text x="209" y="156.4" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,11</text>
<rect x="224" y="80.3" width="26" height="76.6" fill="var(--c1)"/>
<text x="237" y="165.9" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,12</text>
<text x="223" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">L3</text>
<rect x="265" y="41.9" width="26" height="38.4" fill="var(--c4)"/>
<text x="278" y="37.9" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+0,06</text>
<rect x="293" y="55.1" width="26" height="25.2" fill="var(--c1)"/>
<text x="306" y="51.1" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">+0,04</text>
<text x="292" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">L4</text>
<rect x="334" y="80.3" width="26" height="13.5" fill="var(--c4)"/>
<text x="347" y="102.8" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,02</text>
<rect x="362" y="80.3" width="26" height="18.7" fill="var(--c1)"/>
<text x="375" y="108.0" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,03</text>
<text x="361" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">L5</text>
<rect x="403" y="80.3" width="26" height="61.9" fill="var(--c4)"/>
<text x="416" y="151.1" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,10</text>
<rect x="431" y="80.3" width="26" height="41.2" fill="var(--c1)"/>
<text x="444" y="130.5" text-anchor="middle" font-size="9" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">−0,07</text>
<text x="430" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">L6</text>
</svg>`,
        alt: "Bar total return per lipatan GMV vs equal-weight: L1 −0,0363 vs −0,0104; L2 −0,1650 vs −0,1799; L3 −0,1068 vs −0,1218; L4 +0,0611 vs +0,0400; L5 −0,0215 vs −0,0298; L6 −0,0984 vs −0,0656.",
        caption: "Cara membaca: bar gelap = GMV, bar terang = equal-weight; tiap pasang = satu lipatan 40 hari, train expanding dari 240 hari [notebook]. Interpretasi: GMV menang vs EW di 4 dari 6 lipatan — tapi total keduanya nyaris sama (GMV −0,3272 vs EW −0,3279) dan semua lipatan berada di dalam crash yang sama. Walk-forward menunjukkan konsistensi, bukan kemenangan.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: menang 4/6 lipatan berarti GMV terbukti lebih baik",
        type: "pitfall",
        body: "Yang benar: lipatan-lipatan expanding tumpang tindih — train lipatan 6 memuat train lipatan 1 — jadi 4/6 bukan 4 percobaan independen. Dan total return GMV −0,3272 vs EW −0,3279 nyaris SAMA: yang berbeda adalah konsistensi per lipatan dan maxDD (GMV −0,4045 vs EW −0,4218), bukan total. Ditambah lagi: keenam lipatan berada di dalam satu crash — walk-forward di sini menguji konsistensi dalam satu rezim, bukan keunggulan lintas-rezim.",
      },
    },
    {
      id: "checklist",
      eyebrow: "Langkah 11 · Checklist praktis",
      title: "Checklist sebelum percaya optimizer",
      prose: [
        "Semua lesson modul ini bermuara ke satu daftar. Sebelum memakai bobot optimizer apa pun — GMV, max-Sharpe, risk parity, BL — jalankan tujuh pemeriksaan ini:",
        "1. Out-of-sample: adakah statistik OOS (bukan hanya in-sample)? Di lesson ini, max-Sharpe IN Sharpe 0,7644 menjadi OOS −0,8780 [notebook]. Tanpa OOS, jangan percaya.",
        "2. Turnover: seberapa jauh bobot bergerak bila jendela estimasi digeser? GMV periode 1 [0,6914; 0,2069; 0,1017] vs GMV window penuh [0,5523; 0,2699; 0,1777] — jarak L1 0,2783 [notebook] (dari bobot tak-bulat; dari bobot yang dibulatkan ke 4 desimal: 0,2781). Bobot yang bergerak 28 persen dari satu jendela ke jendela lain adalah bobot yang tidak stabil — dan setiap pergerakan adalah biaya transaksi.",
        "3. Leverage dan short: adakah bobot negatif atau lebih besar dari 1? Max-Sharpe tanpa kendala mencapai [−3154,746; −3786,1043; 6941,8503] [notebook] — bila optimizer-mu mengeluarkan angka seperti itu, kendala (langkah 5) bukan opsional.",
        "4. Konsentrasi: adakah satu aset di atas 50 persen? Max-Sharpe IN adalah 100 persen UNVR [notebook] — konsentrasi penuh pada satu angka yang t-statistiknya 0,83 (langkah 3).",
        "5. Mean: berapa SE dan t-statistik mean yang dipakai? Ketiga mean periode 1 punya t-statistik −0,42, −0,22, dan 0,83 [notebook] — semuanya tidak signifikan. Bila t di bawah 2, shrink atau buang mean-nya.",
        "6. Vol vs return: apa yang sebenarnya diperbaiki metode ini? Shrinkage memperbaiki vol OOS sedikit (GMV-LW 0,3296 vs GMV 0,3372) dan tidak memperbaiki return [notebook]. Klaim metode harus cocok dengan metrik yang ia perbaiki.",
        "7. Mean penilai: Sharpe dihitung pada mean yang mana? BL 0,7671 pada posterior vs −0,6178 pada sample [notebook]. Bila hanya satu angka yang dilaporkan, tanyakan yang satunya.",
        "Nilai: checklist ini bukan teori — setiap butirnya punya angka dari modul ini. Bawalah daftar ini ke M6 (tuning dan seleksi model) dan M7 (fairness, explainability, monitoring): di sana, pertanyaan yang sama muncul lagi — hanya asetnya yang berubah menjadi model.",
        "Baik atau buruk: checklist bagus karena ia mengubah kecurigaan menjadi prosedur — tujuh pertanyaan yang bisa dijawab ya atau tidak. Buruk bila dibaca sebagai pengganti pemikiran: checklist menangkap kesalahan yang sudah dikenal, bukan kesalahan yang baru. Tetap tanyakan: «apa yang belum saya periksa?»",
        "Mitigasi: jadikan checklist ini gerbang, bukan hiasan. Portofolio yang gagal satu butir bukan otomatis dibuang — tapi kegagalannya harus dicatat, dijelaskan, dan diterima secara sadar, bukan terlewat diam-diam.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 12 · Lab 1",
      title: "Lab: split OOS pada data mainan — pemenang in-sample yang kalah",
      prose: [
        "Sekarang giliranmu mereplikasi cerita lesson ini pada data yang bisa dihitung dengan tangan. Tiga aset A, B, C; 6 hari periode 1, 6 hari periode 2. Return harian sudah ditulis eksplisit.",
        "Hasilnya [lab]: periode 1 — mean harian A 0,0117, B 0,0050, C 0,0250; vol harian A 0,0232, B 0,0187, C 0,0243; Sharpe harian (rf harian 0,05/252) A 0,4950, B 0,2567, C 1,0211. Pemenang in-sample adalah C — mean tertinggi DAN Sharpe tertinggi. Portofolio max-Sharpe long-only periode 1 menaruh segalanya di C. Periode 2 — mean harian A −0,0250, B −0,0217, C −0,0250. C yang dijanjikan +0,0250 per hari justru −0,0250 per hari. Equal-weight periode 2: −0,0239 per hari — sedikit LEBIH BAIK daripada C (−0,0250). Total 6 hari: C −0,15, equal-weight −0,1433.",
        "Bacaan yang jujur: lab mainan ini mengulang pola data nyata dalam skala kecil — pemenang in-sample berbalik OOS, dan diversifikasi naif (equal-weight) mengalahkan konsentrasi pada pemenang. Satu nuansa penting dari data nyata: di sana max-Sharpe OOS return −0,3239 justru sedikit LEBIH BAIK daripada equal-weight OOS −0,3669, dan Sharpe OOS-nya −0,8780 lebih baik daripada equal-weight −1,3278. Jadi equal-weight tidak selalu menang OOS — yang selalu kalah adalah JANJINYA: max-Sharpe dijanjikan +48 persen dan Sharpe 0,76, realisasinya −32 persen dan Sharpe −0,88. Pelajarannya bukan «equal-weight selalu menang», melainkan «janji in-sample tidak bisa dipercaya» — dan di crash merata, perbedaan antar portofolio mengecil sampai nyaris hilang.",
        "Bandingkan dengan notebook: pola yang sama — UNVR +0,4831 menjadi −0,3239 — dengan taruhan yang jauh lebih besar.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi mean_harian dan vol_harian periode 1 (vol = sample stdev, ddof=1) untuk A, B, C" },
        { id: "t2", text: "Lengkapi sharpe_harian tiap aset (rf harian = 0,05/252) dan tentukan pemenang in-sample" },
        { id: "t3", text: "Hitung mean harian periode 2 tiap aset dan equal-weight, lalu bandingkan pemenang in-sample dengan equal-weight OOS" },
      ],
      expected: "periode 1 — mean harian: A 0.0117, B 0.0050, C 0.0250\nperiode 1 — vol harian: A 0.0232, B 0.0187, C 0.0243\nperiode 1 — Sharpe harian: A 0.4950, B 0.2567, C 1.0211\npemenang in-sample: C\nperiode 2 — mean harian: A -0.0250, B -0.0217, C -0.0250\nperiode 2 — equal-weight mean harian: -0.0239\ntotal 6 hari periode 2: C -0.1500, equal-weight -0.1433",
      hints: [
        "Gunakan statistics.mean dan statistics.stdev (stdev memakai ddof=1 secara default) — jangan hitung manual.",
        "Sharpe harian = (mean harian − rf harian) / vol harian, dengan rf harian = 0,05/252.",
        "Equal-weight mean harian = rata-rata dari ketiga mean harian.",
      ],
      code: {
        starter: `import statistics as st

# Return harian 3 aset: 6 hari periode 1 (estimasi), 6 hari periode 2 (uji)
p1 = {"A": [0.02, -0.01, 0.03, 0.01, -0.02, 0.04],
      "B": [0.01, 0.02, -0.01, 0.03, 0.00, -0.02],
      "C": [-0.02, 0.03, 0.04, 0.05, 0.02, 0.03]}
p2 = {"A": [-0.03, -0.02, -0.04, -0.01, -0.02, -0.03],
      "B": [-0.02, -0.03, -0.01, -0.04, -0.02, -0.01],
      "C": [-0.04, -0.02, -0.03, -0.02, -0.01, -0.03]}
RF_D = 0.05 / 252  # rf harian

mean1 = {}
vol1 = {}
sharpe1 = {}
for k in ["A", "B", "C"]:
    mean1[k] = 0  # TODO: mean harian periode 1 (statistics.mean)
    vol1[k] = 0  # TODO: vol harian periode 1 (statistics.stdev)
    sharpe1[k] = 0  # TODO: Sharpe harian = (mean - RF_D) / vol
winner = max(sharpe1, key=sharpe1.get)
print(f"periode 1 — mean harian: A {mean1['A']:.4f}, B {mean1['B']:.4f}, C {mean1['C']:.4f}")
print(f"periode 1 — vol harian: A {vol1['A']:.4f}, B {vol1['B']:.4f}, C {vol1['C']:.4f}")
print(f"periode 1 — Sharpe harian: A {sharpe1['A']:.4f}, B {sharpe1['B']:.4f}, C {sharpe1['C']:.4f}")
print(f"pemenang in-sample: {winner}")
mean2 = {}
for k in ["A", "B", "C"]:
    mean2[k] = 0  # TODO: mean harian periode 2 (statistics.mean)
ew2 = sum(mean2.values()) / 3
print(f"periode 2 — mean harian: A {mean2['A']:.4f}, B {mean2['B']:.4f}, C {mean2['C']:.4f}")
print(f"periode 2 — equal-weight mean harian: {ew2:.4f}")
print(f"total 6 hari periode 2: C {sum(p2['C']):.4f}, equal-weight {sum(sum(v) for v in p2.values()) / 3:.4f}")`,
        lockLines: 11,
        solution: `import statistics as st

# Return harian 3 aset: 6 hari periode 1 (estimasi), 6 hari periode 2 (uji)
p1 = {"A": [0.02, -0.01, 0.03, 0.01, -0.02, 0.04],
      "B": [0.01, 0.02, -0.01, 0.03, 0.00, -0.02],
      "C": [-0.02, 0.03, 0.04, 0.05, 0.02, 0.03]}
p2 = {"A": [-0.03, -0.02, -0.04, -0.01, -0.02, -0.03],
      "B": [-0.02, -0.03, -0.01, -0.04, -0.02, -0.01],
      "C": [-0.04, -0.02, -0.03, -0.02, -0.01, -0.03]}
RF_D = 0.05 / 252  # rf harian

mean1 = {}
vol1 = {}
sharpe1 = {}
for k in ["A", "B", "C"]:
    mean1[k] = st.mean(p1[k])
    vol1[k] = st.stdev(p1[k])
    sharpe1[k] = (mean1[k] - RF_D) / vol1[k]
winner = max(sharpe1, key=sharpe1.get)
print(f"periode 1 — mean harian: A {mean1['A']:.4f}, B {mean1['B']:.4f}, C {mean1['C']:.4f}")
print(f"periode 1 — vol harian: A {vol1['A']:.4f}, B {vol1['B']:.4f}, C {vol1['C']:.4f}")
print(f"periode 1 — Sharpe harian: A {sharpe1['A']:.4f}, B {sharpe1['B']:.4f}, C {sharpe1['C']:.4f}")
print(f"pemenang in-sample: {winner}")
mean2 = {}
for k in ["A", "B", "C"]:
    mean2[k] = st.mean(p2[k])
ew2 = sum(mean2.values()) / 3
print(f"periode 2 — mean harian: A {mean2['A']:.4f}, B {mean2['B']:.4f}, C {mean2['C']:.4f}")
print(f"periode 2 — equal-weight mean harian: {ew2:.4f}")
print(f"total 6 hari periode 2: C {sum(p2['C']):.4f}, equal-weight {sum(sum(v) for v in p2.values()) / 3:.4f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "winner", value: "C", label: "`winner` seharusnya 'C'", msg: "Pemenang in-sample adalah C — mean tertinggi (0,0250) dan Sharpe tertinggi (1,0211)." },
          { kind: "stdout_matches", task: "t3", pattern: "periode 2 — equal-weight mean harian: -0\\.0239", label: "Output menampilkan equal-weight periode 2 −0,0239", msg: "Equal-weight periode 2: mean harian −0,0239 — sedikit lebih baik dari C (−0,0250)." },
          { kind: "stdout_matches", task: "t2", pattern: "Sharpe harian: A 0\\.4950, B 0\\.2567, C 1\\.0211", label: "Output menampilkan Sharpe harian 0,4950 / 0,2567 / 1,0211", msg: "Sharpe harian periode 1: A 0,4950, B 0,2567, C 1,0211." },
          { kind: "stdout_matches", task: "t3", pattern: "total 6 hari periode 2: C -0\\.1500, equal-weight -0\\.1433", label: "Output menampilkan total 6 hari C −0,1500 vs equal-weight −0,1433", msg: "Total 6 hari periode 2: C −0,1500, equal-weight −0,1433." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 13 · Lab 2",
      title: "Lab: Ledoit-Wolf dan Black-Litterman pada 2 aset",
      prose: [
        "Lab kedua menerapkan dua obat estimation error pada 2 aset — semuanya dengan rumus 2×2 yang bisa dihitung tangan. Kovarians sampel S = [[0,04; 0,01], [0,01; 0,09]] [ilustrasi]. Target shrinkage: matriks diagonal dengan varians rata-rata 0,065 di diagonal, nol di luar diagonal. Delta shrinkage 0,20 [ilustrasi].",
        "Hasilnya [lab]: GMV dari kovarians sampel: bobot aset 1 = 0,7273. Kovarians Ledoit-Wolf: [[0,045; 0,008], [0,008; 0,085]]; GMV-LW: bobot aset 1 = 0,6754 — shrinkage menarik bobot ke arah 0,5 (target diagonal yang simetris tidak membedakan kedua aset, jadi bobot menyusut ke tengah). Varians portofolio diukur pada kovarians sampel: GMV 0,0318 vs GMV-LW 0,0321 — GMV-LW sedikit LEBIH BURUK in-sample, seperti yang diharapkan: shrinkage mengorbankan fit in-sample demi stabilitas. Keuntungannya baru terlihat bila kovarians sampel berubah di periode berikut — persis seperti GMV-LW OOS vol 0,3296 vs GMV 0,3372 pada data nyata [notebook].",
        "Lalu Black-Litterman [ilustrasi]. Prior Pi = [0,06; 0,04], tau = 0,05, kovarians = kovarians Ledoit-Wolf di atas. View: «aset 1 mengungguli aset 2 sebesar 5pp» — P = [1, −1], Q = 0,05. Perhatikan: prior sendiri mengimplikasikan selisih 0,06 − 0,04 = 0,02; view 0,05 LEBIH AGRESIF dari prior, jadi posterior harus bergeser ke arah view. Omega = tau × P Sigma P-transpos = 0,0057. Posterior mean M = [0,0649; 0,0299] [lab]: aset 1 naik dari 0,06 menjadi 0,0649, aset 2 turun dari 0,04 menjadi 0,0299 — keduanya bergerak ke arah view, tapi tidak sampai ke view penuh (selisih posterior 0,035, di antara prior 0,02 dan view 0,05). Bobot max-Sharpe long-only (rf diabaikan — rf = 0 untuk ilustrasi ini, rumus tertutup dinormalisasi): prior [0,7836; 0,2164], BL [0,8647; 0,1353] — view menggeser 8 poin persentase bobot ke aset 1.",
        "Bacaan yang jujur: lab ini menunjukkan MEKANISME-nya, bukan bukti keunggulannya. Shrinkage dan BL adalah cara yang disiplin untuk menyatakan «saya tidak percaya estimasi sampel sepenuhnya» — hasilnya hanya sebaik prior, target, dan view yang kamu pilih. Di data nyata, view lesson ini [ilustrasi] dan prior equal-weight menghasilkan Sharpe posterior 0,7671 yang berubah menjadi −0,6178 pada statistik sample (langkah 7). Mekanisme yang benar tidak menyelamatkan keyakinan yang salah.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi kovarians Ledoit-Wolf (delta 0,20 [ilustrasi]) dan bobot GMV sampel vs GMV-LW (rumus tertutup 2 aset)" },
        { id: "t2", text: "Lengkapi posterior mean Black-Litterman (tau 0,05, view Q = 0,05 [ilustrasi], Omega = tau × P Sigma P-transpos)" },
        { id: "t3", text: "Hitung bobot max-Sharpe long-only dari prior dan dari posterior (rumus tertutup: Sigma-inverse kali mean, lalu normalisasi)" },
      ],
      expected: "kovarians Ledoit-Wolf: [[0.0450, 0.0080], [0.0080, 0.0850]]\nGMV sampel: w1 = 0.7273\nGMV-LW: w1 = 0.6754\nvarians (pada kovarians sampel): GMV 0.0318, GMV-LW 0.0321\nOmega = 0.0057\nposterior mean: [0.0649, 0.0299]\nbobot max-Sharpe prior: [0.7836, 0.2164]\nbobot max-Sharpe BL: [0.8647, 0.1353]",
      hints: [
        "GMV 2 aset (rumus tertutup): w1 = (var2 − cov) / (var1 + var2 − 2×cov).",
        "Invers matriks 2×2 [[a, b], [b, d]] = 1/(a×d − b×b) × [[d, −b], [−b, a]].",
        "P Sigma P-transpos untuk P = [1, −1] adalah var1 − 2×cov + var2. Posterior 2 aset bisa dihitung lewat rumus presisi: gabungkan inv(tau×Sigma) dengan P-transpos × (1/Omega) × P.",
        "Bobot max-Sharpe long-only 2 aset (bila keduanya positif): w sebanding Sigma-inverse × mean, lalu bagi dengan jumlahnya agar total 1.",
      ],
      code: {
        starter: `# 2 aset [ilustrasi]: kovarians sampel, target shrinkage, prior, dan satu view
S = [[0.04, 0.01], [0.01, 0.09]]       # kovarians sampel
T = [[0.065, 0.0], [0.0, 0.065]]       # target: diagonal, varians rata-rata
DELTA = 0.20                            # delta shrinkage [ilustrasi]

def gmv2(M):
    return (M[1][1] - M[0][1]) / (M[0][0] + M[1][1] - 2 * M[0][1])

def port_var(w1, M):
    return w1 * w1 * M[0][0] + 2 * w1 * (1 - w1) * M[0][1] + (1 - w1) * (1 - w1) * M[1][1]

def inv2(M):
    det = M[0][0] * M[1][1] - M[0][1] * M[1][0]
    return [[M[1][1] / det, -M[0][1] / det], [-M[1][0] / det, M[0][0] / det]]

def matvec(M, v):
    return [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]]

Slw = [[0.0, 0.0], [0.0, 0.0]]         # TODO: (1 - DELTA) * S + DELTA * T
w_gmv = gmv2(S)
w_lw = gmv2(Slw)
print(f"kovarians Ledoit-Wolf: [[{Slw[0][0]:.4f}, {Slw[0][1]:.4f}], [{Slw[1][0]:.4f}, {Slw[1][1]:.4f}]]")
print(f"GMV sampel: w1 = {w_gmv:.4f}")
print(f"GMV-LW: w1 = {w_lw:.4f}")
print(f"varians (pada kovarians sampel): GMV {port_var(w_gmv, S):.4f}, GMV-LW {port_var(w_lw, S):.4f}")

# Black-Litterman [ilustrasi]: prior Pi, tau, view P = [1, -1], Q = 0.05
Pi = [0.06, 0.04]
TAU = 0.05
Q = 0.05
Sig = Slw  # kovarians yang dipakai BL = kovarians Ledoit-Wolf
psp = Sig[0][0] - 2 * Sig[0][1] + Sig[1][1]  # P Sigma P-transpos
Omega = TAU * psp
tauSig = [[TAU * x for x in row] for row in Sig]
inv_tauSig = inv2(tauSig)
# TODO: matriks presisi posterior A = inv(tauSig) + P-transpos (1/Omega) P
#       dan vektor b = inv(tauSig) Pi + P-transpos (1/Omega) Q; Mpost = inv(A) b
A = [[0.0, 0.0], [0.0, 0.0]]
b = [0.0, 0.0]
Mpost = matvec(inv2(A), b)
print(f"Omega = {Omega:.4f}")
print(f"posterior mean: [{Mpost[0]:.4f}, {Mpost[1]:.4f}]")

def max_sharpe_w(Mu):
    v = matvec(inv2(Sig), Mu)
    s = v[0] + v[1]
    return [v[0] / s, v[1] / s]

w_prior = max_sharpe_w(Pi)
w_bl = max_sharpe_w(Mpost)
print(f"bobot max-Sharpe prior: [{w_prior[0]:.4f}, {w_prior[1]:.4f}]")
print(f"bobot max-Sharpe BL: [{w_bl[0]:.4f}, {w_bl[1]:.4f}]")`,
        lockLines: 18,
        solution: `# 2 aset [ilustrasi]: kovarians sampel, target shrinkage, prior, dan satu view
S = [[0.04, 0.01], [0.01, 0.09]]       # kovarians sampel
T = [[0.065, 0.0], [0.0, 0.065]]       # target: diagonal, varians rata-rata
DELTA = 0.20                            # delta shrinkage [ilustrasi]
Slw = [[(1 - DELTA) * S[i][j] + DELTA * T[i][j] for j in range(2)] for i in range(2)]

def gmv2(M):
    return (M[1][1] - M[0][1]) / (M[0][0] + M[1][1] - 2 * M[0][1])

def port_var(w1, M):
    return w1 * w1 * M[0][0] + 2 * w1 * (1 - w1) * M[0][1] + (1 - w1) * (1 - w1) * M[1][1]

w_gmv = gmv2(S)
w_lw = gmv2(Slw)
print(f"kovarians Ledoit-Wolf: [[{Slw[0][0]:.4f}, {Slw[0][1]:.4f}], [{Slw[1][0]:.4f}, {Slw[1][1]:.4f}]]")
print(f"GMV sampel: w1 = {w_gmv:.4f}")
print(f"GMV-LW: w1 = {w_lw:.4f}")
print(f"varians (pada kovarians sampel): GMV {port_var(w_gmv, S):.4f}, GMV-LW {port_var(w_lw, S):.4f}")

def inv2(M):
    det = M[0][0] * M[1][1] - M[0][1] * M[1][0]
    return [[M[1][1] / det, -M[0][1] / det], [-M[1][0] / det, M[0][0] / det]]

def matvec(M, v):
    return [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]]

# Black-Litterman [ilustrasi]: prior Pi, tau, view P = [1, -1], Q = 0.05
Pi = [0.06, 0.04]
TAU = 0.05
Q = 0.05
Sig = Slw  # kovarians yang dipakai BL = kovarians Ledoit-Wolf
psp = Sig[0][0] - 2 * Sig[0][1] + Sig[1][1]  # P Sigma P-transpos
Omega = TAU * psp
tauSig = [[TAU * x for x in row] for row in Sig]
inv_tauSig = inv2(tauSig)
A = [[inv_tauSig[0][0] + 1 / Omega, inv_tauSig[0][1] - 1 / Omega],
     [inv_tauSig[1][0] - 1 / Omega, inv_tauSig[1][1] + 1 / Omega]]
b = [inv_tauSig[0][0] * Pi[0] + inv_tauSig[0][1] * Pi[1] + Q / Omega,
     inv_tauSig[1][0] * Pi[0] + inv_tauSig[1][1] * Pi[1] - Q / Omega]
Mpost = matvec(inv2(A), b)
print(f"Omega = {Omega:.4f}")
print(f"posterior mean: [{Mpost[0]:.4f}, {Mpost[1]:.4f}]")

def max_sharpe_w(Mu):
    v = matvec(inv2(Sig), Mu)
    s = v[0] + v[1]
    return [v[0] / s, v[1] / s]

w_prior = max_sharpe_w(Pi)
w_bl = max_sharpe_w(Mpost)
print(f"bobot max-Sharpe prior: [{w_prior[0]:.4f}, {w_prior[1]:.4f}]")
print(f"bobot max-Sharpe BL: [{w_bl[0]:.4f}, {w_bl[1]:.4f}]")`,
        checks: [
          { kind: "equal", task: "t1", name: "w_lw", value: 0.675438596491228, label: "`w_lw` seharusnya 0,6754", msg: "GMV-Ledoit-Wolf: bobot aset 1 = 0,6754 — ditarik ke arah 0,5 dari GMV sampel 0,7273." },
          { kind: "stdout_matches", task: "t2", pattern: "posterior mean: \\[0\\.0649, 0\\.0299\\]", label: "Output menampilkan posterior mean [0,0649; 0,0299]", msg: "Posterior mean: [0,0649; 0,0299] — selisih 0,035, di antara prior 0,02 dan view 0,05." },
          { kind: "stdout_matches", task: "t1", pattern: "GMV sampel: w1 = 0\\.7273", label: "Output menampilkan GMV sampel w1 0,7273", msg: "GMV dari kovarians sampel: bobot aset 1 = 0,7273." },
          { kind: "stdout_matches", task: "t3", pattern: "bobot max-Sharpe BL: \\[0\\.8647, 0\\.1353\\]", label: "Output menampilkan bobot BL [0,8647; 0,1353]", msg: "Bobot max-Sharpe BL: [0,8647; 0,1353] vs prior [0,7836; 0,2164]." },
        ],
      },
    },
    {
      id: "peta-modul",
      eyebrow: "Langkah 14 · Rangkuman modul M5",
      title: "Peta modul M5: lima lesson, satu tema",
      prose: [
        "Modul M5 — Optimization dan portfolio construction — terdiri dari lima lesson. Inilah petanya, dengan angka kunci tiap lesson [notebook]:",
        "• M5.1 — Mean-variance dan efficient frontier: GMV window penuh [0,5523; 0,2699; 0,1777], return −0,1903, vol 0,2966; max-Sharpe long-only [0,0,1] (100 persen UNVR), return 0,0796, vol 0,5014, Sharpe 0,059; frontier 8 titik dari GMV sampai UNVR penuh.",
        "• M5.2 — Risk parity dan kendala: risk parity [0,398; 0,3212; 0,2808] dengan kontribusi risiko sama [1/3; 1/3; 1/3], return −0,1575, vol 0,3037; kendala long-only yang mengubah max-Sharpe tanpa kendala [−3154,746; −3786,1043; 6941,8503] menjadi [0,0,1].",
        "• M5.3 — Optimisasi numerik: gradient descent pada fungsi mangkuk — sensitivitas terhadap learning rate, dan satu langkah gradien yang menurunkan varians dari 0,1005 menjadi 0,0994 dengan bobot [0,5193; 0,4807] [notebook].",
        "• M5.4 — Shrinkage dan evaluasi out-of-sample: Ledoit-Wolf delta 0,0955; GMV-LW [0,5185; 0,2852; 0,1963]; split OOS 240/240 dengan tabel lengkap di langkah 2 lesson ini.",
        "• M5.5 — Lesson ini: Black-Litterman dan penutup — Pi [0,1817; 0,2447; 0,3009], posterior M [0,196; 0,2175; 0,298], bobot BL [0,4173; 0,2493; 0,3334], Sharpe posterior 0,7671 vs sample −0,6178 — plus sensitivitas BL (tau tidak mengubah M; Omega dan proxy yang menggerakkan), robust optimization (worst-case GMV −0,4760), dan walk-forward 6 lipatan (GMV total −0,3272, 4/6 vs EW).",
        "Satu tema mengikat kelimanya: estimation error. M5.1 menunjukkan apa yang dioptimalkan; M5.2 menunjukkan kendala yang menahannya; M5.3 menunjukkan cara menghitungnya; M5.4 menunjukkan cara mengukur kegagalannya di luar sampel; M5.5 menunjukkan cara memasukkan keyakinan tanpa menipu diri sendiri. Bila kamu hanya mengingat satu kalimat dari modul ini, ingatlah ini: optimizer memaksimalkan angka yang kamu berikan — dan sebagian besar angka itu adalah noise.",
        "Nilai: modul ini memakai SATU dataset yang sama dari awal sampai akhir — BBCA, KLBF, UNVR, 480 hari — sehingga angka-angka antar lesson bisa dibandingkan langsung. GMV yang sama muncul di M5.1, M5.4, dan M5.5; max-Sharpe yang sama muncul di M5.1, M5.2, dan M5.5. Konsistensi itu disengaja: ia memungkinkanmu melihat bagaimana SATU portofolio dinilai berbeda oleh metrik yang berbeda — in-sample vs OOS, posterior vs sample.",
        "Baik atau buruk: satu dataset bagus untuk perbandingan yang adil — semua metode diuji pada medan yang sama. Buruk bila dibaca sebagai bukti umum: semua kesimpulan modul ini datang dari 3 saham dan 480 hari yang mencakup satu crash merata. Metode yang «menang» di sini belum tentu menang di dataset lain — dan itulah mengapa M9 (backtesting dan validasi) ada.",
        "Mitigasi: bila memakai metode modul ini di dataset lain, ulangi SELURUH rantai — estimasi, shrinkage, kendala, OOS — jangan hanya menyalin bobotnya. Bobot [0,4173; 0,2493; 0,3334] adalah jawaban untuk dataset ini, bukan jawaban umum.",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 15 · Guided task di Colab",
      title: "Guided task di Colab: Black-Litterman & shrinkage di data nyata",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat pada data mainan. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m55-guided-task.ipynb.",
        "Di notebook itu kamu memuat harga BBCA, KLBF, UNVR yang sesungguhnya (window 2024-11-01 sampai 2026-11-12; file pin diunduh 2026-11-12), membangun return SIMPLE 480 hari, mereplikasi split OOS 240/240 lengkap (max-Sharpe IN 0,4831/0,5667/0,7644 → OOS −0,3239/0,4259/−0,8780; GMV, risk parity, equal-weight, GMV-LW), menghitung Ledoit-Wolf (delta 0,0955) dan Black-Litterman (Pi [0,1817; 0,2447; 0,3009], posterior M [0,196; 0,2175; 0,298], bobot [0,4173; 0,2493; 0,3334], Sharpe posterior 0,7671 vs sample −0,6178) — lengkap dengan checks yang menegaskan tiap langkah, termasuk t-statistik mean periode 1 (UNVR 0,83) dan korelasi yang naik di periode crash.",
        "Tautan Colab: https://colab.research.google.com/drive/1dbuYEjcTChCwzxTi-qs5VFYa8vQE2vKe",
        "Jalur file notebook: colab/mlf-m55-guided-task.ipynb.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 16 · Checkpoint",
      title: "Checkpoint: melawan estimation error",
      prose: [
        "Rangkuman: optimizer's curse — max-Sharpe in-sample return 0,4831 dan Sharpe 0,7644 menjadi OOS −0,3239 dan −0,8780 [notebook]; semua portofolio OOS −0,32 sampai −0,37 karena periode 2 adalah crash merata, dan yang berhasil dikendalikan hanya vol (GMV OOS 0,3372 vs max-Sharpe 0,4259). Mean return sulit diestimasi: UNVR +0,4831 punya SE 0,5807 dan t-statistik 0,83 — tidak bisa dibedakan dari nol. Shrinkage Ledoit-Wolf delta 0,0955 (kecil) menggeser GMV [0,5523; 0,2699; 0,1777] menjadi GMV-LW [0,5185; 0,2852; 0,1963] dan memperbaiki vol OOS sedikit (0,3296 vs 0,3372) tanpa memperbaiki return. Kendala long-only adalah regularisasi: ia memotong max-Sharpe tanpa kendala [−3154,746; −3786,1043; 6941,8503] menjadi [0,0,1]. Black-Litterman: Pi [0,1817; 0,2447; 0,3009], view [ilustrasi] BBCA mengungguli KLBF 2pp, posterior M [0,196; 0,2175; 0,298], bobot [0,4173; 0,2493; 0,3334] — Sharpe 0,7671 pada statistik posterior vs −0,6178 pada statistik sample: posterior bukan ramalan. Sensitivitas BL: tau 0,01 / 0,05 / 0,20 memberi M yang sama persis [0,196; 0,2175; 0,298] (tau saling meniadakan di konvensi He-Litterman); yang menggerakkan M adalah skala Omega (×0,5 → [0,2007; 0,2084; 0,2971]) dan proxy pasar (GMV sebagai proxy → Pi nyaris rata [0,2201; 0,2200; 0,2196]). Robust optimization: worst-case GMV −0,4760 menjadi terburuk dari keempat portofolio, di bawah EW −0,4477 — peringkat berbalik; robust GMV lantai −0,35 membuang KLBF (w [0,3147; 0; 0,6853]) dengan vol 0,3880. Walk-forward 6 lipatan: GMV total −0,3272 dan menang 4/6 lipatan vs EW — konsistensi, bukan kemenangan sekali-split, dan tetap satu rezim. Checklist tujuh butir (langkah 11) adalah gerbang sebelum percaya optimizer apa pun. Lab: pemenang in-sample C (+0,0250/hari) menjadi −0,0250/hari OOS; GMV-LW 2 aset 0,6754 vs GMV 0,7273; posterior mean mainan [0,0649; 0,0299] dan bobot BL [0,8647; 0,1353].",
        "Jembatan ke depan: M6 (tuning dan seleksi model) mengajukan pertanyaan yang sama pada model machine learning — seberapa jauh hiperparameter boleh mengikuti noise train, dan bagaimana memilih model tanpa tertipu skor in-sample. M7 (fairness, explainability, monitoring) bertanya siapa yang dirugikan bila model salah, dan bagaimana tahu bila model yang sudah deploy mulai memburuk. M9 (simulation, backtesting, dan validation) adalah tempat seluruh rantai modul ini diuji secara formal — backtest yang jujur, dengan semua jebakan yang kamu pelajari di M4.5, M5.4, dan lesson ini. Estimation error tidak hilang di modul-modul itu; ia hanya berganti nama.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Max-Sharpe in-sample: return 0,4831, Sharpe 0,7644. OOS: return −0,3239, Sharpe −0,8780. Apa kesimpulan yang paling tepat?",
          options: [
            { text: "Optimizer bekerja — Sharpe in-sample 0,7644 membuktikannya", why: "Sharpe in-sample mengukur seberapa baik optimizer menyesuaikan diri dengan masa lalu; OOS-nya −0,8780 — janji itu tidak bertahan." },
            { text: "Optimizer's curse: optimizer memaksimalkan estimasi (UNVR +48%) yang ternyata noise — realisasi OOS berbalik total", why: "Benar: max-Sharpe 100% UNVR atas dasar +0,4831 periode 1, lalu UNVR −0,3239 di periode 2. Optimizer memaksimalkan angka yang salah.", correct: true },
            { text: "Data OOS-nya yang salah — in-sample selalu lebih bisa dipercaya", why: "Terbalik: OOS adalah ujian yang jujur (data masa depan yang belum dilihat saat estimasi); in-sample-lah yang optimistis." },
            { text: "Semua portofolio gagal total sehingga optimisasi tidak ada gunanya", why: "Terlalu jauh: kontrol risiko bekerja — GMV OOS vol 0,3372 vs max-Sharpe 0,4259. Yang gagal adalah prediksi return, bukan seluruh optimisasi." },
          ],
        },
        {
          q: "UNVR periode 1: mean tahunan +0,4831, SE 0,5807, t-statistik 0,83. Apa artinya?",
          options: [
            { text: "UNVR terbukti naik 48% per tahun — angka yang solid", why: "SE 0,5807 lebih besar dari estimasinya sendiri; t 0,83 berarti angka itu tidak bisa dibedakan dari nol secara statistik." },
            { text: "Mean +48% tidak signifikan: SE-nya lebih besar dari estimasi, t 0,83 — konsisten dengan nol", why: "Benar: dengan vol 0,5667 dan 240 hari, SE mean tahunan 0,5807 — interval ±1 SE mencakup −0,10 sampai +1,06. Bertaruh 100% pada angka ini adalah bertaruh pada noise.", correct: true },
            { text: "240 hari sudah cukup — SE akan mengecil bila memakai return log", why: "Jenis return bukan masalahnya; SE menyusut sebanding 1/akar(n) — memangkas SE menjadi setengah butuh 4 kali data, sekitar 960 hari." },
            { text: "t 0,83 berarti ada 83% peluang UNVR naik", why: "t-statistik bukan probabilitas — ia mengukur seberapa jauh estimasi dari nol dalam satuan SE. t 0,83 berarti estimasi kurang dari 1 SE dari nol." },
          ],
        },
        {
          q: "Ledoit-Wolf delta 0,0955; GMV-LW OOS vol 0,3296 vs GMV 0,3372; return OOS −0,3703 vs −0,3697. Apa yang benar tentang shrinkage di sini?",
          options: [
            { text: "Shrinkage memperbaiki return OOS secara jelas", why: "Return OOS GMV-LW −0,3703 justru sedikit LEBIH BURUK dari GMV −0,3697. Data berkata sebaliknya." },
            { text: "Shrinkage membantu vol sedikit (0,3296 vs 0,3372) tapi tidak menyelamatkan return — delta kecil berarti sampel sudah cukup bisa dipercaya", why: "Benar: delta 0,0955 kecil, perbaikan vol 0,0076, return tidak membaik. Shrinkage menstabilkan kovarians; ia bukan ramalan return.", correct: true },
            { text: "Delta 0,0955 berarti 95,5% bobot pada target", why: "Terbalik: delta adalah bobot TARGET — hanya 9,55% pada target, 90,45% tetap pada kovarians sampel." },
            { text: "Shrinkage tidak berguna karena delta-nya kecil", why: "Delta kecil adalah HASIL estimasi, bukan kegagalan — ia berkata kovarians sampel di sini tidak terlalu bermasalah. Memaksa shrinkage besar justru menambah bias." },
          ],
        },
        {
          q: "Max-Sharpe tanpa kendala long-only: bobot [−3154,746; −3786,1043; 6941,8503]. Dengan kendala long-only: [0,0,1]. Apa pelajarannya?",
          options: [
            { text: "Kendala hanya soal kepatuhan administratif", why: "Kendala mengubah bobot ribuan kali leverage menjadi portofolio yang bisa dipegang — itu regularisasi, bukan administrasi." },
            { text: "Kendala long-only adalah regularisasi: ia memotong wilayah bobot tempat optimizer mengejar noise sampai ekstrem", why: "Benar: tanpa kendala, optimizer menemukan arah noise yang nyaris sempurna dan mengikutinya sampai ribuan kali leverage. Kendala membatasi seberapa jauh optimizer boleh pergi.", correct: true },
            { text: "Bobot ribuan itu benar — Sharpe tanpa kendala 0,6697 lebih tinggi dari 0,059", why: "Sharpe 0,6697 itu in-sample, atas leverage ribuan kali — tidak bisa dipegang dan tidak akan bertahan OOS. Sharpe in-sample bukan bukti." },
            { text: "GMV juga berubah total karena kendala long-only", why: "GMV tanpa kendala dan dengan kendala IDENTIK [0,5523; 0,2699; 0,1777] — GMV tidak butuh short di data ini, jadi kendala tidak mengikatnya." },
          ],
        },
        {
          q: "Black-Litterman: Pi = [0,1817; 0,2447; 0,3009], view [ilustrasi] BBCA mengungguli KLBF 2pp, posterior M = [0,196; 0,2175; 0,298]. Apa yang dilakukan view itu?",
          options: [
            { text: "View menaikkan BBCA (0,1817 → 0,196) dan menurunkan KLBF (0,2447 → 0,2175); UNVR nyaris tidak bergerak", why: "Benar: view terutama menggerakkan aset yang disebutnya — BBCA naik 0,0143, KLBF turun 0,0272; UNVR yang tidak disebut hanya bergeser 0,3009 → 0,298 (−0,0029) karena view merambat lewat kovarians. Efek pada aset tak-disebut ada, tapi kecil di sini.", correct: true },
            { text: "View memperbaiki mean sampel UNVR +0,4831", why: "Mean sampel tidak muncul di perhitungan BL sama sekali — BL membuang mean sampel dan mulai dari equilibrium Pi." },
            { text: "Posterior M adalah ramalan return tahun depan", why: "M adalah keyakinan yang diperbarui (prior + view), bukan ramalan — langkah 7 menunjukkan Sharpe atas M (0,7671) vs atas mean sampel (−0,6178)." },
            { text: "Pi dihitung dari mean sampel periode 1", why: "Pi dihitung lewat reverse optimization dari bobot pasar (di sini proxy equal-weight) dengan delta 2,5 — bukan dari mean sampel." },
          ],
        },
        {
          q: "Portofolio BL yang sama: Sharpe 0,7671 pada statistik posterior, −0,6178 pada statistik sample. Apa bacaan yang paling jujur?",
          options: [
            { text: "BL bekerja — Sharpe 0,7671 membuktikannya", why: "0,7671 dihitung dengan mean posterior M itu sendiri — portofolio yang dioptimalkan atas M wajar terlihat bagus bila dinilai dengan M. Itu sirkular." },
            { text: "Posterior bukan ramalan: 0,7671 adalah konsistensi internal terhadap keyakinan sendiri; −0,6178 adalah evaluasi jujur terhadap mean sampel", why: "Benar: selisih 1,38 poin Sharpe berasal dari satu pilihan — mean mana yang dipakai menilai. Evaluasi yang tidak sirkular memakai mean sampel atau data OOS.", correct: true },
            { text: "Vol 0,3068 yang menyebabkan perbedaan Sharpe", why: "Vol-nya SAMA (0,3068) di kedua perhitungan — seluruh selisih berasal dari mean: return posterior 0,2854 vs return sample −0,1396." },
            { text: "Sharpe sample −0,6178 salah hitung karena bobot BL positif semua", why: "Tidak ada yang salah hitung: bobot BL [0,4173; 0,2493; 0,3334] atas mean sampel BBCA −0,2445 dan KLBF −0,2570 memang memberi return −0,1396 dan Sharpe −0,6178." },
          ],
        },
        {
          q: "Periode 2 adalah crash merata: BBCA −0,3634, KLBF −0,4134, UNVR −0,3239. Semua portofolio OOS −0,32 sampai −0,37. Apa yang BENAR-BENAR bisa dikendalikan di sini?",
          options: [
            { text: "Return — pilih portofolio yang tepat dan return OOS membaik", why: "Semua portofolio OOS menumpuk di −0,32 sampai −0,37 — tidak ada yang menyelamatkan return di crash merata ini." },
            { text: "Vol — GMV OOS 0,3372 vs max-Sharpe 0,4259; kontrol risiko bekerja, prediksi return gagal", why: "Benar: perbedaan antar portofolio di OOS ada pada vol, bukan return. Itulah yang dikendalikan optimisasi di sini — dan batasnya.", correct: true },
            { text: "Korelasi — diversifikasi melindungi penuh saat crash", why: "Korelasi justru NAIK di periode 2 (BBCA-KLBF 0,2431 → 0,4457) — diversifikasi melemah tepat saat paling dibutuhkan." },
            { text: "Tidak ada yang bisa dikendalikan — optimisasi sia-sia", why: "Terlalu jauh: vol OOS berbeda nyata antar portofolio (0,3140–0,4259). Optimisasi mengendalikan risiko, bukan return — dan itu tetap berharga." },
          ],
        },
        {
          q: "Menurut checklist langkah 11, mana yang PALING lengkap sebagai gerbang sebelum memakai bobot optimizer?",
          options: [
            { text: "Sharpe in-sample di atas 0,7 sudah cukup", why: "Max-Sharpe IN Sharpe 0,7644 menjadi OOS −0,8780 — Sharpe in-sample saja tidak pernah cukup." },
            { text: "OOS + turnover + leverage/konsentrasi + SE mean + metrik yang cocok + mean penilai", why: "Benar: ketujuh butir checklist — OOS, turnover (GMV L1 0,2783), leverage (max-Sharpe tanpa kendala ribuan), konsentrasi (100% UNVR), SE/t mean (t 0,83), vol-vs-return, dan mean penilai (posterior vs sample).", correct: true },
            { text: "Backtest yang panjang — makin panjang makin baik", why: "Backtest panjang membantu, tapi tanpa split OOS, tanpa cek turnover dan leverage, ia bisa sama menipunya dengan in-sample — lihat M9 untuk backtest yang jujur." },
            { text: "Persetujuan komite investasi", why: "Persetujuan manusia penting, tapi bukan pengganti pemeriksaan statistik — komite yang sama bisa menyetujui Sharpe in-sample 0,7644 tanpa melihat OOS-nya." },
          ],
        },
        {
          q: "Black-Litterman (konvensi He-Litterman, Omega = tau × PΣP-transpos): tau 0,01 vs 0,20 memberi posterior M [0,196; 0,2175; 0,298] yang sama persis. Kenapa?",
          options: [
            { text: "M tetap [0,196; 0,2175; 0,298] — tau saling meniadakan: (τΣ)⁻¹ dan Ω⁻¹ sama-sama berskala 1/τ", why: "Benar: karena Ω = τ·PΣP', kedua suku presisi sama-sama berskala 1/τ, jadi rasionya — yang menentukan M — tidak berubah. Tau mengatur skala ketidakpastian absolut (kovarians posterior), bukan rata-ratanya.", correct: true },
            { text: "Karena tau 0,01 dan 0,20 sama-sama kecil sehingga efeknya tidak terlihat", why: "Bukan soal kecil: M-nya SAMA PERSIS sampai 4 desimal, bukan kira-kira sama — itu pembatalan eksak, bukan efek yang terlalu kecil untuk dilihat." },
            { text: "Karena view [ilustrasi] terlalu lemah untuk menggeser posterior", why: "View-nya menggeser: Pi [0,1817; 0,2447; 0,3009] menjadi M [0,196; 0,2175; 0,298]. Yang tidak mengubah M adalah tau — bukan view." },
            { text: "Karena Omega ×0,5 dan ×2 juga memberi M yang sama", why: "Salah: Omega ×0,5 memberi M [0,2007; 0,2084; 0,2971] dan Omega ×2 memberi [0,1912; 0,2265; 0,2990] — skala Omega RELATIF-lah yang menggerakkan M, bukan tau sendirian." },
          ],
        },
        {
          q: "Worst-case return (k = 1): GMV −0,4760, equal-weight −0,4477, risk parity −0,4579, max-Sharpe −0,2837 — padahal nominalnya GMV −0,1903 dan vol GMV 0,2966 yang terkecil. Kenapa GMV kalah dari EW pada worst-case?",
          options: [
            { text: "GMV mengorbankan return untuk vol — worst-case menghukum return; robust GMV lantai −0,35 membuang KLBF (w [0,3147; 0; 0,6853])", why: "Benar: GMV menaruh bobot terbesar pada BBCA (0,5523) yang worst-case-nya −0,4944 dan hampir tidak peduli mean. Worst-case return = w'μ_wc menghukum return, bukan vol — metode paling «aman» nominal menjadi paling rapuh begitu ketidakpastian mean dihitung. Robust GMV lantai −0,35 membuang KLBF (worst-case −0,5650) dan membayar vol 0,2966 → 0,3880.", correct: true },
            { text: "Karena vol GMV lebih besar dari EW pada worst-case", why: "Vol tidak masuk perhitungan worst-case return — R_wc = w'μ_wc hanya memakai mean worst-case. Vol GMV 0,2966 tetap terkecil; yang menghukum GMV adalah return worst-case-nya." },
            { text: "Karena GMV memakai mean sampel sedangkan EW tidak", why: "Keduanya dinilai pada μ_wc yang SAMA [−0,4944; −0,5650; −0,2837]. Bedanya adalah bobot: GMV menaruh 0,5523 di BBCA, EW hanya 1/3." },
            { text: "Karena robust max-Sharpe mengubah bobot menjadi [0; 0; 1]", why: "Robust max-Sharpe memang [0; 0; 1] — tapi itu SAMA dengan max-Sharpe nominal. Robust tidak selalu mengubah bobot; di sini ia mengubah keyakinan (Sharpe nominal 0,059 vs worst-case −0,6655)." },
          ],
        },
        {
          q: "Walk-forward 6 lipatan (expanding): GMV total −0,3272, menang vs EW 4/6 lipatan; split tunggal 240/240: GMV OOS −0,3697 vs EW −0,3669. Kenapa walk-forward lebih dipercaya — dan apa batasnya?",
          options: [
            { text: "Walk-forward menguji konsistensi: GMV total −0,3272 dan menang 4/6 lipatan vs EW — bukan kemenangan sekali-split; tapi 6 lipatan tetap satu rezim crash", why: "Benar: satu split bisa jadi kebetulan satu jendela; enam lipatan memberi distribusi hasil dan hitungan 4/6. Batasnya: lipatan tumpang tindih (tidak independen) dan semuanya di dalam crash yang sama — bukan bukti lintas-rezim; total return GMV −0,3272 vs EW −0,3279 nyaris sama.", correct: true },
            { text: "Karena walk-forward membalikkan vonis split — GMV terbukti menang total", why: "Salah: walk-forward TIDAK membalikkan vonis — semua strategi total ≈ −0,32 sampai −0,33. Yang berbeda hanya vol/maxDD (GMV −0,4045 vs max-Sharpe −0,4865), bukan total return." },
            { text: "Karena 6 lipatan berarti 6 rezim berbeda sehingga hasilnya lintas-rezim", why: "Salah: keenam lipatan berada di dalam periode 2 yang sama — satu crash merata. Bukti lintas-rezim butuh data dari rezim berbeda (pekerjaan M9)." },
            { text: "Karena rolling window memberi hasil yang jauh lebih baik dari expanding", why: "Salah: rolling nyaris sama — GMV total −0,3192 vs expanding −0,3272, Sharpe −1,2123 vs −1,2342. Kesimpulan tidak bergantung pada pilihan expanding vs rolling di sini." },
          ],
        },
      ],
      summary: [
        "Optimizer's curse: max-Sharpe IN return 0,4831 / Sharpe 0,7644 → OOS −0,3239 / −0,8780 [notebook]; semua portofolio OOS −0,32 sampai −0,37 — crash merata, tidak ada yang menyelamatkan return.",
        "Mean sulit diestimasi: UNVR periode 1 +0,4831 dengan SE 0,5807, t 0,83 — tidak bisa dibedakan dari nol; BBCA t −0,42, KLBF t −0,22 [notebook].",
        "Shrinkage Ledoit-Wolf delta 0,0955 (kecil): GMV [0,5523; 0,2699; 0,1777] → GMV-LW [0,5185; 0,2852; 0,1963]; vol OOS 0,3296 vs 0,3372 (membantu sedikit), return OOS −0,3703 vs −0,3697 (tidak membaik).",
        "Kendala = regularisasi: max-Sharpe tanpa kendala [−3154,746; −3786,1043; 6941,8503] → long-only [0,0,1]; GMV tidak berubah [0,5523; 0,2699; 0,1777].",
        "Black-Litterman: Pi [0,1817; 0,2447; 0,3009], view [ilustrasi] BBCA mengungguli KLBF 2pp, posterior M [0,196; 0,2175; 0,298], bobot BL [0,4173; 0,2493; 0,3334] (delta risk-aversion 2,5, tau 0,05, market proxy equal-weight).",
        "Posterior bukan ramalan: Sharpe BL 0,7671 pada statistik posterior vs −0,6178 pada statistik sample (return 0,2854 vs −0,1396, vol 0,3068; return posterior 0,2854 = w·M + rf = 0,2354 + 0,05, karena M adalah excess return).",
        "Sensitivitas BL: tau 0,01 / 0,05 / 0,20 memberi M yang sama persis [0,196; 0,2175; 0,298] (tau saling meniadakan di konvensi He-Litterman); Omega ×0,5 → M [0,2007; 0,2084; 0,2971]; proxy GMV → Pi nyaris rata [0,2201; 0,2200; 0,2196].",
        "Robust optimization: worst-case μ (k = 1) [−0,4944; −0,5650; −0,2837]; worst-case GMV −0,4760 (terburuk) vs EW −0,4477 — peringkat berbalik; robust GMV lantai −0,35: w [0,3147; 0; 0,6853], vol 0,3880.",
        "Walk-forward 6 lipatan: GMV total −0,3272, menang 4/6 vs EW; semua strategi ≈ −0,32 sampai −0,33 — TIDAK membalikkan vonis split 240/240; 6 lipatan tetap satu rezim.",
        "Checklist 7 butir: OOS, turnover (GMV L1 0,2783), leverage, konsentrasi, SE/t mean, vol-vs-return, mean penilai.",
        "Lab: pemenang in-sample C +0,0250/hari → OOS −0,0250/hari, equal-weight OOS −0,0239; GMV-LW 2 aset 0,6754 vs GMV 0,7273; posterior mainan [0,0649; 0,0299], bobot BL [0,8647; 0,1353].",
        "Korelasi naik di crash: BBCA-KLBF 0,2431 → 0,4457 — diversifikasi melemah saat paling dibutuhkan.",
        "Jembatan: M6 tuning & seleksi model, M7 fairness/explainability/monitoring, M9 backtesting & validasi — estimation error berganti nama, tidak hilang.",
      ],
      next: { label: "Lanjut: MLF-M6.1 — Hyperparameter Tuning", href: "/v2/learn/mlf-m61-hyperparameter-tuning" },
    },
  ],
};
