import type { V2Lesson } from "../lib/types";

const FIG_BETA = `<svg viewBox="0 0 480 260" role="img" aria-label="Return alpha sebelum dan sesudah dinetralkan terhadap pasar.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Sebelum vs sesudah neutralization</text>
<text x="16" y="52" font-size="11" fill="var(--chart-text)">Sebelum: return alpha mengikuti pasar naik-turun (beta tersamar)</text>
<polyline points="40,90 120,70 200,110 280,60 360,100 440,80" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<text x="16" y="140" font-size="11" fill="var(--chart-text)">Sesudah: pola pasar hilang, tersisa sinyal murni (alpha)</text>
<polyline points="40,180 120,190 200,175 280,195 360,170 440,185" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<text x="16" y="222" font-size="11" fill="var(--chart-text)">Cara membaca: garis merah berayun lebar mengikuti pasar; garis biru datar di sekitar nol.</text>
<text x="16" y="240" font-size="11" fill="var(--chart-text)">Interpretasi: yang dihapus = beta (risiko pasar); yang tersisa = alpha (keahlian).</text>
</g>
</svg>`;

export const wqb8: V2Lesson = {
  slug: "wqb8-neutralization",
  track: "WorldQuant Brain",
  module: "Fondasi: Dari Nol",
  title: "WQB8 — Neutralization: Mengisolasi Sinyal dari Kebisingan Pasar",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Alpha yang ternyata cuma ikut pasar",
      prose: [
        "Sebuah alpha membukukan return 18% setahun dengan Sharpe 1,9. Tim bersorak — sampai seseorang memplot return-nya berdampingan dengan indeks pasar. Garisnya menari beriringan: naik saat pasar naik, jatuh saat pasar jatuh. 'Alpha'-nya tidak memprediksi apa-apa tentang saham individual; ia hanya bertaruh 'pasar akan naik' dengan cara yang rumit.",
        "Uji neutralization dijalankan: return alpha dikurangi komponen pasarnya. Hasilnya: return 2%, Sharpe 0,3. Delapan belas persen itu hampir seluruhnya beta tersamar — risiko pasar yang dibungkus jargon kuantitatif. Alpha yang sebenarnya (keahlian memilih saham) nyaris nol.",
        "Twist-nya: angka 18% dan Sharpe 1,9 BENAR adanya. Yang salah adalah label 'alpha'. Tanpa neutralization, setiap strategi long-only di pasar bullish terlihat jenius — seperti perahu yang dikira melaju padahal airnya yang pasang. Neutralization adalah cara memisahkan perahu dari air pasang.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan beta vs alpha dengan contoh angka; (2) menjelaskan empat level neutralization (market/sector/industry/subindustry); (3) menghitung neutralization sederhana per grup; (4) menjelaskan kenapa pemenang memakai subindustry; (5) menghindari miskonsepsi 'neutralization menghilangkan return'.",
      ],
      tasks: [],
      note: {
        title: "Perahu vs air pasang",
        body: "Beta = return karena pasarnya naik (air pasang mengangkat semua perahu). Alpha = return karena keahlian memilih (perahumu lebih cepat dari arus). Neutralization menyaring air pasang agar yang diukur tinggal kecepatan perahumu.",
      },
      reference: "Tanpa neutralization, pasar bullish membuat semua orang terlihat jenius.",
    },
    {
      id: "beta-alpha",
      eyebrow: "Langkah 2 · Konsep",
      title: "Beta vs alpha: dua sumber return",
      prose: [
        "Setiap return saham = beta + alpha + noise. Beta: bagian yang bergerak bersama pasar (atau sektor/industri). Alpha: bagian yang spesifik pada saham itu — inilah yang ingin diprediksi. Noise: acak, tidak bisa diprediksi siapa pun.",
        "Contoh terperinci. Hari ini indeks naik 2%. Saham A naik 2,5%, saham B naik 1,8%. Beta menjelaskan ~2% dari keduanya (ikut pasar). Sisanya — A: +0,5%, B: −0,2% — adalah alpha + noise: A sedikit mengungguli pasar, B sedikit tertinggal. Alpha yang baik memprediksi selisih +0,5 vs −0,2 ini, BUKAN angka 2% yang milik semua orang.",
        "Kenapa beta harus dibuang? Tiga alasan. Satu: beta bisa dibeli murah lewat indeks — tidak perlu riset alpha untuk dapat return pasar. Dua: beta menambah volatilitas tanpa menambah keahlian — Sharpe tercemar. Tiga: platform menilai keahlian memilih, bukan keberanian bertaruh arah pasar.",
        "Cara membaca figur: garis merah berayun lebar = return sebelum neutralization (penuh beta). Garis biru datar di sekitar nol = sesudahnya (beta tersaring, tersisa alpha murni). Interpretasi: ayunan yang hilang adalah 'keberuntungan pasar'; yang tersisa adalah 'keahlian' — dan keahlian inilah yang diuji.",
      ],
      formula: String.raw`r_i = \beta_i \cdot r_{m} + \alpha_i + \varepsilon_i`,
      formulaNote: "r_i = return saham i, r_m = return pasar, β_i = sensitivitas terhadap pasar, α_i = return spesifik (target prediksi), ε_i = noise acak.",
      figure: {
        svg: FIG_BETA,
        alt: "Garis merah berayun mengikuti pasar vs garis biru datar setelah neutralization.",
        caption: "Yang dihapus = beta (risiko pasar). Yang tersisa = alpha (keahlian).",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Neutralization menghilangkan return, jadi merugikan.” Yang dihilangkan = return pasar (beta) yang bisa dibeli murah via indeks. Yang dipertahankan = alpha murni. Portofolio terneutralisasi + posisi indeks = return semula — tetapi sekarang kamu tahu persis berapa yang berasal dari keahlian.",
      },
      hints: [
        "Beta = ikut-ikutan pasar; alpha = keahlian memilih; noise = acak.",
        "Platform membayar alpha, bukan beta.",
      ],
      reference: "r = beta·pasar + alpha + noise. Target kita hanya alpha.",
    },
    {
      id: "level",
      eyebrow: "Langkah 3 · Konsep",
      title: "Empat level: market ke subindustry",
      prose: [
        "Neutralization bisa dilakukan pada empat level grup. Market: netral terhadap seluruh pasar (buang beta pasar saja). Sector: netral per sektor (teknologi, keuangan, ...) — membuang juga 'angin sektor'. Industry: lebih granular (mis. bukan sekadar 'teknologi', tetapi 'semikonduktor'). Subindustry: paling granular (mis. 'peralatan semikonduktor' vs 'chip memori').",
        "Cara kerja (intuisi): dalam tiap grup, posisi long dan short dibuat seimbang sehingga return grup saling menghapus — yang tersisa hanya perbedaan antar saham DALAM grup yang sama. Contoh: di subindustry 'peralatan semikonduktor' ada 12 saham; alpha long 6 yang diprediksi unggul, short 6 yang diprediksi tertinggal; bila seluruh subindustry naik 3%, kedua kaki ikut naik — selisihnya (alpha) tetap.",
        "Kenapa pemenang memakai subindustry? Karena makin granular grupnya, makin bersih sinyalnya: perbandingan 'apel vs apel'. Lawannya: grup terlalu kecil → sedikit saham per grup → statistik berisik. Subindustry adalah titik temu empiris: cukup granular untuk membuang beta sektoral, cukup besar untuk statistik stabil.",
        "Miskonsepsi kedua: 'makin granular selalu makin baik.' Batasnya: bila grup hanya berisi 2–3 saham, 'netral' menjadi ilusi — tidak ada diversifikasi di dalam grup. Aturan praktis: subindustry adalah default; naik ke industry bila grup terlalu kecil.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Sudah netral market = cukup.” Beta sektoral bisa sama besarnya dengan beta pasar: di tahun booming AI, seluruh sektor teknologi naik 40% — alpha 'teknologi long' tanpa netralisasi sektor = taruhan sektor tersamar, bukan keahlian saham.",
      },
      hints: [
        "Urutan granularitas: market < sector < industry < subindustry.",
        "Default pemenang: subindustry; fallback: industry bila grup kekecilan.",
      ],
      reference: "Subindustry = apel vs apel. Terlalu granular = statistik berisik.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab",
      title: "Netralkan alpha per sektor",
      prose: [
        "Enam saham dari dua sektor (Teknologi, Keuangan) dengan return harian dan sinyal alpha mentah (sebelum netral). Tugasmu: (1) hitung rata-rata sinyal per sektor; (2) kurangkan rata-rata sektor dari tiap sinyal (group demean = neutralization sederhana); (3) verifikasi jumlah sinyal terneutralisasi per sektor = 0 (netral!); (4) bandingkan peringkat saham sebelum vs sesudah — catat yang berubah peringkat.",
        "Eksperimen setelah selesai: apa yang terjadi bila satu sektor hanya berisi 1 saham? (Tambahkan sektor 'Energi' dengan 1 saham dan lihat hasilnya — lalu jelaskan kenapa grup kekecilan berbahaya.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung rata-rata sinyal per sektor" },
        { id: "t2", text: "Netralkan: sinyal - rata-rata sektornya" },
        { id: "t3", text: "Verifikasi jumlah per sektor = 0 & cetak peringkat" },
      ],
      expected: "Teknologi netral: jumlah 0.00\nKeuangan netral: jumlah 0.00\nPeringkat berubah: E vs A",
      note: {
        title: "Intuisi",
        body: "Group demean adalah neutralization versi paling jujur: 'seberapa unggul saham ini dibanding rata-rata tetangganya?' Alpha yang bertahan setelah ini = alpha yang tidak numpang pada kemakmuran sektornya.",
      },
      hints: [
        "mean_tek = rata-rata sinyal 3 saham Teknologi.",
        "netral_i = sinyal_i - mean_sektor_i; jumlahkan per sektor untuk verifikasi.",
      ],
      code: {
        starter: "# (nama, sektor, sinyal_mentah)\n# JANGAN UBAH data.\ndata = [(\"A\", \"Tek\", 0.8), (\"B\", \"Tek\", 0.5), (\"C\", \"Tek\", 0.2),\n        (\"D\", \"Keu\", 1.2), (\"E\", \"Keu\", 0.9), (\"F\", \"Keu\", 0.3)]\n\n# TULIS KODEMU\n# 1. rata-rata sinyal per sektor  2. sinyal - rata-rata sektornya\n# 3. jumlahkan per sektor (harus 0)  4. bandingkan peringkat sebelum/sesudah\n",
        lockLines: 4,
        solution: "# (nama, sektor, sinyal_mentah)\n# JANGAN UBAH data.\ndata = [(\"A\", \"Tek\", 0.8), (\"B\", \"Tek\", 0.5), (\"C\", \"Tek\", 0.2),\n        (\"D\", \"Keu\", 1.2), (\"E\", \"Keu\", 0.9), (\"F\", \"Keu\", 0.3)]\n\n# TULIS KODEMU\ntek = [s for _, g, s in data if g == \"Tek\"]\nkeu = [s for _, g, s in data if g == \"Keu\"]\nm_tek = sum(tek) / len(tek)\nm_keu = sum(keu) / len(keu)\nnetral = {n: round(s - (m_tek if g == \"Tek\" else m_keu), 2) for n, g, s in data}\ns_tek = round(sum(v for (n, g, s), v in zip(data, netral.values()) if g == \"Tek\"), 2)\ns_keu = round(sum(v for (n, g, s), v in zip(data, netral.values()) if g == \"Keu\"), 2)\nprint(f\"Teknologi netral: jumlah {s_tek:.2f}\")\nprint(f\"Keuangan netral: jumlah {s_keu:.2f}\")\nraw = {d[0]: d[2] for d in data}\nsebelum = sorted([n for n, _, _ in data], key=lambda n: -raw[n])\nsesudah = sorted(netral, key=lambda n: -netral[n])\nberubah = [f\"{a} vs {b}\" for a, b in zip(sebelum, sesudah) if a != b]\nprint(f\"Peringkat berubah: {berubah[0] if berubah else 'tidak ada'}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t3", label: "Teknologi netral jumlah 0", msg: "(0,8+0,5+0,2)/3 = 0,5; selisih: 0,3, 0,0, −0,3 → jumlah 0.", pattern: "Teknologi netral: jumlah 0\\.00" },
          { kind: "stdout_matches", task: "t3", label: "Keuangan netral jumlah 0", msg: "(1,2+0,9+0,3)/3 = 0,8; selisih: 0,4, 0,1, −0,5 → jumlah 0.", pattern: "Keuangan netral: jumlah 0\\.00" },
          { kind: "stdout_matches", task: "t3", label: "Peringkat berubah terdeteksi", msg: "Sebelum: D,E,A,B,F,C. Sesudah: D,A,E,B,C,F — E vs A bertukar.", pattern: "Peringkat berubah: E vs A" }
        ],
      },
      reference: "Netral = jumlah nol per grup. Yang tersisa = keunggulan relatif.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Pilih level neutralization",
      prose: [
        "Satu: tidak tahu apa-apa tentang struktur beta → mulai dari subindustry (default pemenang). Dua: grup subindustry rata-rata < 5 saham → turun ke industry. Tiga: sinyal memang TENTANG sektor (mis. rotasi sektor) → netralisasi market saja, jangan bunuh objek risetmu sendiri. Empat: hasil anjlok total setelah netralisasi → sinyalmu = beta tersamar; jangan kejar, ganti ide.",
        "Aturan praktis 10 detik: netralkan se-granular mungkin selama tiap grup masih punya cukup saham untuk statistik. Bila ragu antara dua level, pilih yang lebih granular — beta yang lolos lebih berbahaya daripada noise tambahan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Neutralization yang 'membunuh' alpha-mu sebenarnya menyelamatkanmu: ia memberi tahu SEBELUM submit bahwa idemu = taruhan pasar tersamar. Lebih murah tahu sekarang daripada setelah ditolak.",
      },
      reference: "Default subindustry; grup kekecilan → industry; sinyal sektoral → market saja.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Alpha 18% yang ternyata beta",
      prose: [
        "Data: alpha return 18%, Sharpe 1,9, tanpa neutralization. Setelah netralisasi subindustry: return 2%, Sharpe 0,3. Manajer tim bertanya: 'kita perbaiki atau buang?'",
        "Pertanyaan: keputusanmu? Pembahasan: (1) 16% dari 18% adalah beta — sinyal saham-spesifiknya hanya 2%. (2) Opsi 'tambah leverage agar 2% jadi 18%' = memperbesar noise 9× lipat; Sharpe 0,3 tidak berubah oleh leverage. (3) Keputusan: BUANG sebagai alpha mandiri; pelajarannya: uji neutralization di AWAL riset, bukan di akhir — 3 bulan memoles beta = 3 bulan terbuang. (4) Pengecualian: bila tim memang mencari 'beta pintar' (strategi alokasi), itu produk berbeda dengan metrik berbeda — jangan dicampur.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Beta tersamar adalah risiko model: laporan mengklaim 'alpha 18%' padahal portofolio terekspos penuh ke pasar. Saat pasar jatuh, 'alpha' ini jatuh bersamanya — dan tidak ada yang bisa menjelaskan kenapa 'strategi pintar' ikut ambruk.",
      },
      reference: "Netralisasi di awal riset, bukan di akhir. Beta ≠ alpha.",
    },
    {
      id: "lab-beta",
      eyebrow: "Langkah 7 · Lab",
      title: "Bongkar beta: siapa alpha murni?",
      prose: [
        "Dua strategi, 8 bulan data, plus return pasar. Tugasmu: hitung beta tiap strategi (kovarians dengan pasar dibagi varians pasar), lalu alpha = rata-rata return − beta × rata-rata pasar. Putuskan: mana yang alpha murni — dan mana yang beta tersamar?",
        "Eksperimen setelah selesai: buat strategi C yang return-nya = pasar + 0,5% tiap bulan (beta 1, alpha 0,5%). Berapa beta dan alpha-nya? Apa bedanya dengan strategi B?",
      ],
      tasks: [
        { id: "t1", text: "Tulis `beta(r, mkt)` dan `alpha(r, mkt)`" },
        { id: "t2", text: "Cetak beta & alpha A dan B + verdict" },
      ],
      expected: "A: beta 1.15, alpha 0.22%/bln -> BETA TERSAMAR\nB: beta -0.03, alpha 0.40%/bln -> ALPHA MURNI",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Beta 1,15 berarti strateginya agresif-hebat.” Beta 1,15 berarti strateginya = pasar yang dilebih-lebihkan. Kehebatan yang diklaim (return tinggi) hampir seluruhnya sewa dari pasar — bukan milik strategi.",
      },
      hints: [
        "beta = kovarians(r, mkt) / varians(mkt); pakai statistics.mean/pvariance.",
        "alpha = mean(r) − beta × mean(mkt).",
      ],
      code: {
        starter: "import statistics\n# Return 8 bulan + pasar. JANGAN UBAH.\nmkt = [0.02, -0.01, 0.03, -0.02, 0.01, 0.02, -0.015, 0.025]\nA = [0.025, -0.008, 0.035, -0.015, 0.012, 0.022, -0.012, 0.028]\nB = [0.005, 0.004, -0.002, 0.006, 0.003, 0.007, 0.002, 0.005]\n\n# TULIS KODEMU\ndef beta(r, mkt):\n    return  # kovarians / varians pasar\n\ndef alpha(r, mkt):\n    return  # mean(r) - beta * mean(mkt)\n\nfor nama, r in ((\"A\", A), (\"B\", B)):\n    b, a = beta(r, mkt), alpha(r, mkt)\n    tag = \"ALPHA MURNI\" if abs(b) < 0.3 and a > 0.003 else \"BETA TERSAMAR\"\n    print(f\"{nama}: beta {b:.2f}, alpha {a*100:.2f}%/bln -> {tag}\")\n",
        lockLines: 5,
        solution: "import statistics\n# Return 8 bulan + pasar. JANGAN UBAH.\nmkt = [0.02, -0.01, 0.03, -0.02, 0.01, 0.02, -0.015, 0.025]\nA = [0.025, -0.008, 0.035, -0.015, 0.012, 0.022, -0.012, 0.028]\nB = [0.005, 0.004, -0.002, 0.006, 0.003, 0.007, 0.002, 0.005]\n\n# TULIS KODEMU\ndef beta(r, mkt):\n    mr, mm = statistics.mean(r), statistics.mean(mkt)\n    cov = sum((x - mr) * (y - mm) for x, y in zip(r, mkt)) / (len(r) - 1)\n    return cov / statistics.pvariance(mkt)\n\ndef alpha(r, mkt):\n    return statistics.mean(r) - beta(r, mkt) * statistics.mean(mkt)\n\nfor nama, r in ((\"A\", A), (\"B\", B)):\n    b, a = beta(r, mkt), alpha(r, mkt)\n    tag = \"ALPHA MURNI\" if abs(b) < 0.3 and a > 0.003 else \"BETA TERSAMAR\"\n    print(f\"{nama}: beta {b:.2f}, alpha {a*100:.2f}%/bln -> {tag}\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "fungsi `beta` ada", msg: "Definisikan def beta(r, mkt).", name: "beta" },
          { kind: "stdout_matches", task: "t2", label: "A beta tersamar", msg: "A: beta 1,15 — ikut pasar.", pattern: "A: beta 1\\.15, alpha 0\\.22%/bln -> BETA TERSAMAR" },
          { kind: "stdout_matches", task: "t2", label: "B alpha murni", msg: "B: beta ≈ 0, alpha 0,40%.", pattern: "B: beta -0\\.03, alpha 0\\.40%/bln -> ALPHA MURNI" }
        ],
      },
      reference: "Bongkar dulu betanya, baru nilai alphanya.",
    },
    {
      id: "neut-lanjut",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Biaya netralisasi & kapan ia merugikan",
      prose: [
        "Netralisasi subindustry menghapus lebih dari sekadar 'beta pasar'. Dekomposisi faktor lengkapnya: return saham = jumlah eksposur ke faktor-faktor (pasar, sektor, industri, subindustry, plus style seperti size, value, momentum, volatilitas) + alpha spesifik + noise. Netralisasi di level subindustry menghapus pasar+sektor+industri+subindustry sekaligus — tetapi faktor STYLE sebagian lolos, karena mereka melintasi batas subindustry. Alpha yang 'bersih' setelah netralisasi subindustry masih bisa mengandung taruhan style tersamar: misalnya long saham kecil vs short saham besar di semua subindustry = taruhan size, bukan keahlian memilih. Bersih dari beta sektoral belum tentu bersih dari beta style.",
        "Kapan netralisasi MEMBANTU. Kasus: dua alpha sama-sama diklaim 'keahlian memilih saham'. Alpha A tanpa netralisasi: return 18%, Sharpe 1,9. Alpha B ternetralisasi subindustry: return 9%, Sharpe 1,4. Mana yang menambah nilai ke portofolio yang SUDAH punya eksposur pasar via indeks? A — karena 16% return-nya adalah beta yang sudah dimiliki portofolio (redundan); B — karena 9%-nya murni diversifikasi. Netralisasi membantu bukan dengan menaikkan return, melainkan dengan menjawab pertanyaan yang benar: 'apa yang alpha ini TAMBAHKAN ke apa yang sudah kumiliki?' Tanpa jawaban itu, kamu menumpuk beta yang sama berlapis-lapis dan menyebutnya diversifikasi.",
        "Kapan netralisasi MERUGIKAN — tiga kasus. Satu: sinyalmu MEMANG tentang level yang kamu netralkan. Alpha rotasi sektor ('teknologi akan mengalahkan keuangan kuartal ini') yang dinetralkan di level subindustry: Sharpe 1,7 → 0,2 — sinyalnya terhapus karena sinyalnya ADALAH taruhan sektor. Obatnya: netralkan hanya di level market (biarkan taruhan sektor hidup): Sharpe kembali 1,5. Kaidah: netralkan semua level KECUALI level tempat tesismu tinggal.",
        "Dua: biaya turnover netralisasi. Portofolio netral harus menjaga keseimbangan long-short per grup setiap hari — kaki-kakinya melayang (drift) dan harus diseimbangkan ulang. Ilustrasi: alpha tanpa netralisasi turnover 40%; dengan netralisasi subindustry turnover 55% (+15 poin) — itulah premi menjaga kenetralan. Tiga: biaya kapasitas — kaki short di subindustry kecil sulit dipinjam (borrow cost tinggi), dan grup dengan sedikit saham memaksa konsentrasi posisi. Netralisasi bukan gratis; ia asuransi yang preminya dibayar dalam turnover.",
        "Contoh perhitungan efek pada fitness — kasus rotasi sektor. Opsi market-neutral saja (taruhan sektor dipertahankan): Sharpe 1,5, return 12%, turnover 42% → fitness = 1,5 × √(12/42) = 0,80. Opsi subindustry-neutral (sinyal ikut terhapus): Sharpe 0,2, return 1,5%, turnover 60% → fitness = 0,2 × √(1,5/60) = 0,03. Selisih 0,80 vs 0,03 bukan karena 'netralisasi buruk' — karena levelnya salah untuk tesis ini. Bandingkan dengan kasus stock-picking murni: tanpa netralisasi Sharpe 1,9, return 18%, turnover 45% → fitness 1,20 (beta-driven); ternetralisasi Sharpe 1,5, return 8%, turnover 58% → fitness 0,56. Pelajaran angkanya: fitness 'kotor' 1,20 vs 'bersih' 0,56 — yang kotor MENANG di angka tetapi KALAH di makna: 1,20-nya redundan dengan indeks yang bisa dibeli murah. Keputusan profesional: pilih 0,56 yang aditif, bukan 1,20 yang redundan.",
        "Uji diagnostik tiga langkah sebelum mengunci level netralisasi. Satu: jalankan alpha pada empat level (market/sector/industry/subindustry), catat Sharpe tiap level. Dua: baca pola penurunannya — anjlok TAJAM di satu level = tesismu tinggal di level itu (jangan netralkan di sana atau lebih granular); turun GRADUAL = beta terkupas lapis demi lapis (netralisasi bekerja sebagaimana mestinya). Tiga: untuk level pemenang, verifikasi biayanya — turnover naik berapa? Apakah grup terkecil masih punya cukup saham? Contoh pola sehat: 1,9 → 1,7 → 1,6 → 1,5 (gradual — tesis = stock picking murni). Contoh pola bahaya: 1,7 → 1,6 → 0,3 → 0,2 (tebing di industry — tesis = taruhan industry; netralkan maksimal di sector).",
        "Kebocoran style dengan angka. Setelah netralisasi subindustry, portofolio long-short-mu punya rasio kapitalisasi rata-rata long/short = 0,6 — taruhan size implisit −0,3. Di tahun small-cap underperform 10%, itu drag −3% yang akan kamu salahkan pada 'alpha decay'. Diagnostik: regresikan return terneutralisasi pada faktor size/value/momentum; R² > 0,2 = taruhan style masih hidup. Obatnya: netralkan style secara eksplisit (demean per bucket size) ATAU terima sebagai taruhan sadar dengan ukuran yang dikontrol — yang dilarang hanyalah taruhan yang tidak disadari.",
        "Teknik tingkat lanjut: netralisasi parsial. Alih-alih demean penuh (λ=1), gunakan x_netral = x − λ × rata-rata_grup dengan λ ∈ [0,1]. λ=0,5 mempertahankan separuh eksposur faktor — berguna bila faktornya punya ekspektasi return positif tetapi kamu ingin risikonya dijinakkan. Contoh: sektor teknologi punya drift positif struktural; netralisasi penuh membuang drift itu, λ=0,5 memangkas separuh risikonya sambil mempertahankan separuh drift. Ini dial kontinu antara 'percaya pada faktor' (λ=0) dan 'tidak mau tahu faktor' (λ=1) — dan λ sendiri bisa disapu seperti d pada kurva decay.",
        "Catatan implementasi yang sering terlewat: group_neutralize menetralkan SINYAL, bukan portofolio. Bila volatilitas antar saham dalam grup berbeda jauh, sinyal netral-nol belum tentu dolar-netral — saham bergejolak mendominasi risiko kaki long/short. Praktik profesional: setelah netralisasi sinyal, skala posisi per invers volatilitas (atau terapkan netralisasi pada kontribusi risiko, bukan bobot). Sinyal-netral + bobot-naif = portofolio yang 'netral di kertas, miring di risiko'.",
      ],
      formula: String.raw`r_i = \sum_k \beta_{i,k} \cdot F_k + \alpha_i + \varepsilon_i`,
      formulaNote: "r_i = return saham i; F_k = return faktor ke-k (pasar, sektor, industri, subindustry, style); β_(i,k) = eksposur saham i ke faktor k; α_i = return spesifik (target); ε_i = noise. Netralisasi subindustry meng-nol-kan eksposur ke faktor pasar→subindustry, tetapi faktor style bisa lolos.",
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Netralisasi adalah saringan, bukan nilai. Saringan yang tepat memisahkan emas dari pasir; saringan yang terlalu halus membuang emasnya juga. Level netralisasi = ukuran lubang saringan — sesuaikan dengan ukuran emas yang kamu cari.",
      },
      hints: [
        "Netralkan semua level KECUALI level tempat tesismu tinggal.",
        "Anjlok tajam di satu level = tesis tinggal di sana; turun gradual = beta terkupas normal.",
        "Premi netralisasi: +10–20 poin turnover + borrow cost kaki short.",
      ],
      reference: "Saring beta, jangan saring tesismu. Baca pola penurunannya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan tentang memisahkan perahu dari air pasang.",
      ],
      tasks: [],
      summary: [
        "Return = beta·pasar + alpha + noise; target prediksi hanya alpha.",
        "Neutralization = buat long-short seimbang per grup hingga beta grup = 0.",
        "Level: market < sector < industry < subindustry (default pemenang).",
        "Grup terlalu kecil → statistik berisik; turun satu level.",
        "Alpha yang mati setelah netralisasi = beta tersamar — buang, jangan poles.",
        "Netralisasi menghapus faktor hingga level grupnya; faktor style (size/value/momentum) bisa lolos — waspadai taruhan style tersamar.",
        "Netralkan semua level kecuali level tesis; baca pola penurunan Sharpe antar level (tebing = tesis tinggal di sana).",
      ],
      quiz: [
        {
          q: "Saham naik 2,5% saat indeks naik 2%. Komponen beta-nya ≈ ?",
          options: [
            { text: "2% (ikut pasar); sisanya 0,5% = alpha + noise", why: "Benar — pisahkan dulu yang milik semua orang.", correct: true },
            { text: "2,5% semuanya alpha", why: "Mengabaikan fakta pasarnya sendiri naik 2%." },
            { text: "0% — beta tidak ada", why: "Beta selalu ada selama saham bergerak bersama pasar." }
          ],
        },
        {
          q: "Setelah netralisasi subindustry return 18% → 2%. Kesimpulan?",
          options: [
            { text: "16% adalah beta tersamar; alpha aslinya hanya 2%", why: "Tepat.", correct: true },
            { text: "Netralisasi merusak alpha yang bagus", why: "Yang dirusak = ilusi; alpha murni tetap 2%." },
            { text: "Tambah leverage 9× untuk kembali ke 18%", why: "Leverage memperbesar noise juga; Sharpe 0,3 tetap." }
          ],
        },
        {
          q: "Urutan granularitas yang benar?",
          options: [
            { text: "market < sector < industry < subindustry", why: "Benar.", correct: true },
            { text: "subindustry < industry < sector < market", why: "Terbalik." },
            { text: "Semua sama granularitasnya", why: "Subindustry jauh lebih granular dari market." }
          ],
        },
        {
          q: "Rata-rata subindustry hanya 3 saham. Tindakan?",
          options: [
            { text: "Turun ke industry — grup terlalu kecil untuk statistik stabil", why: "Benar.", correct: true },
            { text: "Tetap subindustry — makin granular makin baik", why: "Mitos granularitas: grup 3 saham = netral ilusi." },
            { text: "Hapus neutralization sekalian", why: "Membuang perlindungan beta seluruhnya." }
          ],
        },
        {
          q: "Kenapa platform menilai alpha terneutralisasi?",
          options: [
            { text: "Beta bisa dibeli murah via indeks — yang dinilai keahlian memilih", why: "Tepat.", correct: true },
            { text: "Agar return terlihat lebih kecil", why: "Bukan soal kosmetik — soal mengukur keahlian murni." },
            { text: "Karena regulator mewajibkan", why: "Tidak ada kaitan regulasi." }
          ],
        },
        {
          q: "Alpha rotasi sektor: subindustry-neutral Sharpe 0,2; market-neutral Sharpe 1,5. Kesimpulan?",
          options: [
            { text: "Tesisnya adalah taruhan sektor — netralkan maksimal di level market", why: "Tepat — netralisasi granular menghapus objek risetnya.", correct: true },
            { text: "Alpha-nya sampah — buang", why: "Salah diagnosis: yang mati adalah sinyal yang DIBUNUH level yang salah, bukan sinyalnya jelek." },
            { text: "Tetap pakai subindustry karena default pemenang", why: "Default bukan dogma — tesis menentukan level." }
          ],
        },
        {
          q: "Setelah netralisasi, fitness 1,20 → 0,56 tetapi alpha menjadi murni stock-picking. Keputusan profesional?",
          options: [
            { text: "Pilih yang 0,56 — aditif terhadap portofolio yang sudah punya eksposur pasar", why: "Benar — 1,20-nya redundan dengan indeks murah.", correct: true },
            { text: "Pilih yang 1,20 — angka lebih besar selalu menang", why: "Angka tanpa makna = beta redundan yang sudah dimiliki." },
            { text: "Naikkan leverage yang 0,56 agar angkanya menyamai 1,20", why: "Leverage tidak mengubah Sharpe maupun sifat redundansi." }
          ],
        }
      ],
      reference: "Netralkan se-granular mungkin; beta tersamar = buang.",
    },
  ],
};
