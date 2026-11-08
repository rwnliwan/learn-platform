import type { V2Lesson } from "../lib/types";

export const bi13: V2Lesson = {
  slug: "bi13-epigenomik",
  track: "Bioinformatika",
  module: "Epigenomik",
  title: "BI13 · Epigenomik: ChIP-seq & Metilasi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Kembar identik, nasib beda",
      prose: [
        "Kembar identik: DNA 100% sama. Di usia 50, satu kena diabetes, satunya tidak. Sekuensing genom keduanya: tidak ada perbedaan menjelaskan. Metilasi DNA: pola berbeda di ratusan gen metabolik — pengalaman hidup (diet, stres, rokok) menulis catatan di atas genom.",
        "Epigenetika adalah “tinta stabilo” genom: tanpa mengubah huruf DNA, ia menandai bagian mana yang dibaca. Twist-nya: tinta ini bisa ditulis ulang — lewat diet, olahraga, bahkan obat (inhibitor HDAC untuk kanker). Ia jembatan antara takdir genetik dan intervensi.",
        "Tapi ada jebakan: korelasi metilasi-penyakit belum tentu sebab-akibat — perbedaan komposisi tipe sel antar sampel bisa menciptakan sinyal palsu yang terlihat meyakinkan. Di epigenomik, harapan dan artefak hidup berdampingan.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa kembar identik bisa beda nasib penyakit" },
        { id: "t2", text: "Sebutkan satu confounder klasik studi metilasi" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira epigenetik = urutan DNA yang diwariskan berubah. Epigenetik tidak mengubah urutan DNA — ia mengubah PEMBACAAN. Dan sebagian besar tanda di-reset tiap generasi. Klaim “trauma diwariskan via epigenetik” pada manusia sangat dilebih-lebihkan media.",
      },
      reference: "Epigenetika = pembacaan, bukan urutan. Waspadai confounder komposisi sel.",
    },
    {
      id: "lapisan",
      eyebrow: "Langkah 2 · Tiga lapisan",
      title: "Metilasi, histon, aksesibilitas",
      prose: [
        "Metilasi DNA (5mC di CpG): umumnya menekan — promoter termetilasi = gen mati. Modifikasi histon: H3K4me3 = promoter aktif; H3K27ac = enhancer aktif; H3K27me3 = represif. Kombinasi H3K4me3 + H3K27me3 (bivalen) = “siap tapi ditahan” — khas gen perkembangan sel punca. Aksesibilitas: kromatin terbuka = mesin transkripsi bisa masuk.",
        "Kanker membajak sistem ini: promoter gen supresor tumor hipermetilasi → gen mati tanpa mutasi DNA. Contoh: promoter MLH1 (gen repair DNA) beta 0,1 di normal vs 0,85 di tumor — hipermetilasi → gen dibungkam → kanker kolorektal, tanpa satu pun mutasi.",
        "Analoginya: genom adalah partitur musik yang sama untuk semua sel; epigenetika adalah coretan konduktor — “bagian ini keras (aktif), ini diam (represif)”. Sel hati dan sel otak memainkan lagu berbeda dari partitur yang sama.",
      ],
      tasks: [
        { id: "t1", text: "Pasangkan tanda dengan artinya: H3K4me3, H3K27ac, H3K27me3, bivalen" },
        { id: "t2", text: "Jelaskan mekanisme kanker via metilasi MLH1" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira metilasi selalu mematikan gen. Metilasi PROMOTER umumnya represif, tapi metilasi BADAN GEN justru berkorelasi dengan transkripsi aktif! Konteks (di mana) menentukan arti — jangan generalisasi satu arah.",
      },
      reference: "H3K4me3/H3K27ac = aktif · H3K27me3 = represif · bivalen = poised.",
    },
    {
      id: "lab-peak",
      eyebrow: "Langkah 3 · Lab",
      title: "Panggil peak ChIP-seq (uji Poisson)",
      prose: [
        "ChIP-seq: antibodi menarik protein-DNA → sekuensing → peak = lokasi ikatan. ATAC-seq: transposase menandai kromatin TERBUKA — peta aksesibilitas tanpa antibodi.",
        "Di lab ini kamu mensimulasikan logika MACS2 versi mini: uji tiap jendela dengan Poisson terhadap latar kontrol, dengan koreksi Bonferroni untuk 14 jendela. Peak calling = uji statistik tiap jendela vs kontrol, bukan sekadar “lihat yang tinggi”.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi p-value Poisson (1 − CDF)" },
        { id: "t2", text: "Tandai jendela PEAK dengan ambang 0.01/14" },
      ],
      expected: "jendela 3, 4, 5, 8, 11 = PEAK",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjalankan ChIP-seq tanpa kontrol input lalu memanggil peak. Kontrol membedakan ikatan sejati dari bias (GC, keterbacaan). ChIP tanpa input = foto tanpa pembanding — tidak valid.",
      },
      hints: [
        "P(X ≥ k) = 1 − jumlah P(X=i) untuk i < k.",
        "P(X=i) Poisson = e^-λ · λ^i / i!.",
        "Ambang = 0.01 / jumlah jendela.",
      ],
      code: {
        starter: `import math\nlatar = 5\nchip = [4, 6, 5, 45, 60, 52, 6, 5, 20, 4, 5, 48, 7, 5]\n\ndef p_poisson(k, lam):\n    # TULIS KODEMU: P(X >= k) untuk Poisson(lam)\n    return \n\nprint('jendela: chip-count -> p-value')\nfor i, k in enumerate(chip):\n    p = p_poisson(k, latar)\n    tanda = ' PEAK' if p < 0.01/len(chip) else ''\n    print(f'  {i:>2}: {k:>3} -> p={p:.1e}{tanda}')`,
        lockLines: 2,
        solution: `import math\nlatar = 5\nchip = [4, 6, 5, 45, 60, 52, 6, 5, 20, 4, 5, 48, 7, 5]\n\ndef p_poisson(k, lam):\n    # TULIS KODEMU: P(X >= k) untuk Poisson(lam)\n    return 1 - sum(math.exp(-lam)*lam**i/math.factorial(i) for i in range(k))\n\nprint('jendela: chip-count -> p-value')\nfor i, k in enumerate(chip):\n    p = p_poisson(k, latar)\n    tanda = ' PEAK' if p < 0.01/len(chip) else ''\n    print(f'  {i:>2}: {k:>3} -> p={p:.1e}{tanda}')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "3: +45 -> p=\\S+ PEAK", label: "jendela 3 = PEAK", msg: "Count 45 vs latar 5 → p sangat kecil → PEAK. Cek rumus 1 − CDF Poisson." },
          { kind: "stdout_matches", task: "t2", pattern: "8: +20 -> p=\\S+ PEAK", label: "jendela 8 juga PEAK", msg: "Count 20 vs latar 5: p≈3.5e-7 < 0.01/14. Jangan abaikan sinyal sedang — uji yang memutuskan." },
        ],
      },
      reference: "Peak = uji statistik vs kontrol (MACS2). Selalu pakai kontrol input.",
    },
    {
      id: "lab-dmr",
      eyebrow: "Langkah 4 · Lab",
      title: "Beta vs M-value dan uji DMR",
      prose: [
        "Bisulfite sequencing: C tak termetilasi → U (dibaca T); C termetilasi tetap C. Beta value = M/(M+U+offset): termometer metilasi 0–1 yang manusiawi. Tapi beta heteroskedastik (variansi tergantung mean) — untuk statistik pakai M-value = log2(beta/(1−beta)).",
        "Aturannya: analisis dengan M-value, presentasikan dengan beta. Statistik butuh homoskedastisitas; manusia butuh interpretabilitas.",
      ],
      formula: String.raw`\beta = \frac{M}{M + U + \alpha} \qquad M_{val} = \log_2\frac{\beta}{1-\beta}`,
      formulaNote: "M = hitungan read termetilasi; U = hitungan read tak termetilasi; α (offset, mis. 100) = pseudocount agar beta stabil saat cakupan rendah. Beta = proporsi metilasi 0–1 (skala manusiawi); M_val = transformasi logit basis-2 dari beta (skala statistik). Contoh: M=850, U=150, α=100 → beta = 850/1100 = 0,7727 ≈ 0,77 — INI beta ber-offset, BUKAN proporsi mentah (proporsi sebenarnya 850/1000 = 0,85). M_val = log2(0,77/0,23) ≈ 1,74. Interpretasi: beta menjawab “berapa persen termetilasi” — cocok untuk gambar; M-value adalah transformasi logit (ukuran efek log-odds) — BUKAN 'berapa kuat buktinya'; kekuatan bukti diukur p-value/interval — cocok untuk tabel uji. Praktiknya: laporkan beta di visual, uji hipotesis dengan M-value.",
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `beta` dan `mval`" },
        { id: "t2", text: "Hitung delta-beta dan uji-t pada M-value" },
      ],
      expected: "delta-beta ~0.68 · t-stat besar → KANDIDAT DMR (bukan vonis: butuh p-value, df, koreksi multiple testing, replikasi region — satu lokus, 5 vs 5, tidak cukup)",
      hints: [
        "beta = m/(m+u+100).",
        "mval = log2(beta/(1-beta)) — pakai math.log2.",
        "Uji-t = selisih mean / SE gabungan.",
      ],
      code: {
        starter: `import math, statistics as st\nnormal = [(100,900),(120,880),(90,910),(110,890),(105,895)]\ntumor  = [(850,150),(880,120),(820,180),(860,140),(870,130)]\n\ndef beta(mu):\n    m, u = mu\n    return  # TULIS KODEMU\n\ndef mval(mu):\n    b = beta(mu)\n    return  # TULIS KODEMU\n\nbn, bt = [beta(x) for x in normal], [beta(x) for x in tumor]\nmn, mt = [mval(x) for x in normal], [mval(x) for x in tumor]\nprint(f'beta : normal={st.mean(bn):.2f} tumor={st.mean(bt):.2f} '\n      f'delta={st.mean(bt)-st.mean(bn):.2f}')\nprint(f'M-val: normal={st.mean(mn):.1f} tumor={st.mean(mt):.1f}')\nva, vb = st.variance(mn), st.variance(mt)\nse = (va/len(mn)+vb/len(mt))**0.5\nt = (st.mean(mt)-st.mean(mn))/se\nprint(f't-stat (M-value) = {t:.1f} -> KANDIDAT DMR (butuh p-value + koreksi + replikasi region!)')`,
        lockLines: 3,
        solution: `import math, statistics as st\nnormal = [(100,900),(120,880),(90,910),(110,890),(105,895)]\ntumor  = [(850,150),(880,120),(820,180),(860,140),(870,130)]\n\ndef beta(mu):\n    m, u = mu\n    return m/(m+u+100)\n\ndef mval(mu):\n    b = beta(mu)\n    return math.log2(b/(1-b))\n\nbn, bt = [beta(x) for x in normal], [beta(x) for x in tumor]\nmn, mt = [mval(x) for x in normal], [mval(x) for x in tumor]\nprint(f'beta : normal={st.mean(bn):.2f} tumor={st.mean(bt):.2f} '\n      f'delta={st.mean(bt)-st.mean(bn):.2f}')\nprint(f'M-val: normal={st.mean(mn):.1f} tumor={st.mean(mt):.1f}')\nva, vb = st.variance(mn), st.variance(mt)\nse = (va/len(mn)+vb/len(mt))**0.5\nt = (st.mean(mt)-st.mean(mn))/se\nprint(f't-stat (M-value) = {t:.1f} -> KANDIDAT DMR (butuh p-value + koreksi + replikasi region!)')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "delta=0\\.68", label: "delta-beta = 0.68", msg: "Beta normal ~0.10, tumor ~0.78. Cek beta = m/(m+u+100)." },
          { kind: "stdout_matches", task: "t2", pattern: "t-stat \\(M-value\\) = \\d+\\.\\d", label: "t-stat tercetak", msg: "Uji-t pada M-value (bukan beta) — itu praktik yang benar." },
        ],
      },
      note: {
        title: "Intuisi: baca metilasi seperti detektif, bukan seperti termometer",
        body: "Praktisi epigenomik menyimpan lima heuristik yang tidak tertulis di manual tool. Satu: setiap kali melihat klaim metilasi, tanyakan dulu “di mana?” — metilasi promoter umumnya represif, tetapi metilasi badan gen justru berkorelasi dengan transkripsi aktif. Tanpa konteks lokasi, angka beta tidak punya arti. Dua: beta untuk mata, M-value untuk uji — mencampuradukkan keduanya adalah cara tercepat menghasilkan p-value yang terlihat meyakinkan tetapi salah secara statistik. Tiga: ChIP-seq tanpa kontrol input tidak valid, titik. Region dengan copy-number amplification atau GC ekstrem akan terlihat sebagai “peak” palsu; kontrol input adalah satu-satunya pembanding yang jujur. Empat: confounder nomor satu studi metilasi adalah komposisi tipe sel — darah pasien vs kontrol yang beda proporsi neutrofilnya akan menghasilkan “DMR penyakit” yang sebenarnya DMR sel darah. Selalu koreksi atau estimasi komposisi sel sebelum percaya. Lima: korelasi metilasi-penyakit bukan sebab-akibat sampai ada intervensi — mengubah metilasi (mis. inhibitor DNMT) lalu melihat fenotip berubah adalah uji kausalitasnya, bukan p-value yang lebih kecil. Heuristik gabungannya: angka epigenetik yang bagus selalu datang berpasangan dengan kontrol yang tepat — input untuk ChIP, komposisi sel untuk metilasi, replikat untuk keduanya.",
      },
      reference: "Beta untuk presentasi, M-value untuk statistik. Bisulfite: C→U bila tak termetilasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: desain dan kontrol apa di epigenomik?",
      prose: [
        "Lima skenario yang dihadapi bioinformatikawan:",
        "Skenario 1 — Memetakan metilasi genome-wide dengan budget terbatas. → Array metilasi. Alasan: murah, reprodusibel, cukup untuk CpG yang sudah teranotasi. Contoh nyata: EWAS 1.000 sampel memakai array, bukan WGBS.",
        "Skenario 2 — Butuh resolusi per-basa atau region baru. → WGBS (whole-genome bisulfite). Alasan: cara paling komprehensif untuk melihat setiap CpG termasuk yang tak ada di array (nanopore direct detection juga membaca metilasi per-basa). Contoh nyata: DMR di enhancer yang tidak tercover array.",
        "Skenario 3 — ChIP-seq tanpa kontrol input karena “hemat”. → Jangan. Alasan: input mengoreksi bias GC, mappability, dan latar kromatin — tanpanya, peak = campuran sinyal dan bias. Contoh nyata: “3.000 enhancer baru” yang sebagian besar noise latar.",
        "Skenario 4 — Memilih mark histon. → Dari pertanyaan: H3K4me3 = promoter aktif, H3K27ac = enhancer aktif, H3K27me3 = represif. Alasan: tiap mark menjawab pertanyaan regulasi yang berbeda. Contoh nyata: bivalen H3K4me3+H3K27me3 menandai gen “siap tapi ditahan” di stem cell.",
        "Skenario 5 — Mendefinisikan DMR. → Uji statistik + beda beta yang bermakna biologis, bukan salah satunya. Alasan: signifikan tanpa efek = noise ber-n besar; efek tanpa uji = anekdot. Contoh nyata: beta 0,1 vs 0,85 di promoter MLH1 — besar DAN signifikan.",
        "Aturan praktis 10 detik: tanpa input = tanpa peak yang bisa dipercaya; mark dipilih dari pertanyaan, bukan sebaliknya."
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memanggil peak dengan parameter default lalu mengklaim ribuan enhancer baru — tanpa input, tanpa replikasi biologis, dan tanpa validasi, sebagian besar “temuan” adalah topografi bias sekuensing, bukan biologi.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Biomarker metilasi “95% akurat”",
      prose: [
        "Startup klaim tes darah metilasi deteksi 10 kanker dengan akurasi 95%. Kamu diminta review teknis. Temuan: validasi hanya di satu populasi (Eropa); tidak ada validasi prospektif; panel 100 CpG dipilih dari data yang sama (overfitting!); tidak dilaporkan PPV pada prevalensi populasi umum.",
        "Akurasi 95% di case-control terseleksi ≠ berguna klinis. Overfitting: seleksi fitur + evaluasi di data sama = optimis. Prevalensi: kanker 0,5% populasi → spesifisitas 95% = PPV hanya ~9% (dengan sensitivitas 100% dan prevalensi 0,5%: ≈9,1%; bila sens 95%, ≈8,7% — selalu tanyakan sensitivitasnya). 91% positif = false alarm. Tanpa validasi prospektif multi-populasi, klaim tidak berdiri.",
        "Rekomendasi: minta validasi independen + laporkan PPV/NPV pada prevalensi nyata. Biomarker epigenetik itu menjanjikan (ctDNA metilasi nyata dipakai!), tapi saring sebelum percaya.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa akurasi 95% bisa berarti PPV hanya ~9%" },
        { id: "t2", text: "Sebutkan tiga cacat validasi pada klaim ini" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tes skrining dengan PPV 9% = 91% hasil positif adalah alarm palsu — biaya tindak lanjut, kecemasan pasien, dan risiko hukum. Di risiko produk kesehatan, matematika Bayes pada prevalensi nyata adalah uji kelayakan yang tidak bisa dinegosiasi.",
      },
      reference: "Akurasi ≠ utilitas. Laporkan PPV/NPV pada prevalensi nyata.",
    },
    {
      id: "kontrol-input",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Kontrol, ambang, dan batch: sisi gelap peak calling",
      prose: [
        "MACS2 memanggil peak dengan membangun model pergeseran tag di sekitar summit, lalu menguji tiap kandidat terhadap latar memakai Poisson atau binomial lokal. Tetapi parameter yang paling menentukan nasib analisismu bukan algoritmanya — melainkan ambang q-value. Ambang ketat (q < 0,01): presisi tinggi, peak yang lolos LEBIH MUNGKIN nyata (q-value mengontrol FDR, bukan menjamin tiap peak nyata), tetapi enhancer lemah dan faktor transkripsi yang berikatan transient hilang dari daftar. Ambang longgar (q < 0,1): recall tinggi, tetapi daftar dipenuhi noise yang akan menghantuimu di analisis motif berikutnya. Tidak ada ambang yang “benar” — ada ambang yang sesuai pertanyaan: untuk motif discovery yang butuh kepastian, pilih ketat; untuk eksplorasi enhancer kandidat yang akan divalidasi eksperimental, pilih longgar dengan saringan lanjutan.",
        "Kontrol input adalah pasangan wajib ChIP yang paling sering dihemat — dan penghematan paling mahal. Input = DNA yang difragmentasi dan disekuensing TANPA immunoprecipitation. Ia mengoreksi tiga bias sistematis: kandungan GC (region GC-tinggi teramplifikasi lebih baik saat library prep), keterbacaan (repeat sulit dipetakan), dan copy number (region teramplifikasi di genom kanker terlihat “diikat” padahal hanya banyak salinannya). Tanpa input, peak di region teramplifikasi 8 salinan akan lolos uji Poisson dengan p-value fantastis — artefak yang terlihat seperti biologi terbaikmu. Aturan praktis: sekuensing input dengan kedalaman setara ChIP (standar ENCODE: minimal 20 juta read untuk faktor transkripsi), dan jangan pernah membandingkan peak antar-kondisi bila satu kondisi tidak punya input.",
        "Musuh yang lebih licin dari bias teknis adalah batch effect: lot antibodi berbeda, tanggal library prep berbeda, operator berbeda. Antibodi ChIP terkenal temperamental — lot baru bisa punya afinitas berbeda, dan “peak yang hilang” di satu batch mungkin hanya antibodi yang sedang buruk harinya. Desain yang benar: acak urutan pemrosesan sampel antar-kondisi — jangan proses semua kontrol hari Senin dan semua perlakuan hari Jumat. Untuk replikat biologis, pakai IDR (Irreproducible Discovery Rate): panggil peak di tiap replikat secara independen, lalu pertahankan hanya peak yang konsisten antar-replikat (IDR < 0,05). Peak yang hanya muncul di satu replikat — seberapa signifikan pun p-value-nya — adalah kandidat buang, bukan kandidat publikasi.",
        "Terakhir, baca tanda histon seperti membaca kalimat, bukan kata. H3K4me3 menandai promoter aktif; H3K4me1 menandai enhancer (poised maupun aktif); H3K27ac membedakan enhancer AKTIF dari yang hanya siap; H3K27me3 menandai represi Polycomb; H3K36me3 menandai badan gen yang sedang ditranskripsi. Kombinasinya yang bercerita: H3K4me1 + H3K27ac = enhancer aktif; H3K4me1 tanpa H3K27ac = enhancer poised (siap, belum menyala); H3K4me3 + H3K27me3 = promoter bivalen (khas sel punca). Tool seperti ChromHMM memformalkan ini: ia memsegmentasi genom menjadi state kromatin (model ENCODE 15-state) dari kombinasi tanda — “promoter aktif”, “enhancer kuat”, “heterokromatin” — sehingga kamu menganalisis 15 label biologis, bukan ribuan peak mentah. Aturan interpretasi: satu tanda = petunjuk; kombinasi tanda = kalimat; perubahan kombinasi antar-kondisi = cerita regulasinya.",
        "Angka QC yang memisahkan ChIP-seq bagus dari yang gagal: FRiP (fraction of reads in peaks) — untuk faktor transkripsi, FRiP di atas 1% menandakan enrichment nyata; di bawah itu antibodimu kemungkinan tidak menarik apa-apa. NSC/RSC (strand cross-correlation): RSC di atas 0,8 = ChIP berhasil; di bawah 0,8 = curigai. Standar ENCODE: dua replikat biologis independen, dan peak yang dilaporkan adalah yang lolos IDR di keduanya. ChIP-seq satu replikat tanpa IDR = anekdot, bukan data.",
        "Contoh kerja: kamu memanggil peak CTCF dengan MACS2 pada q < 0,05 → 40.000 peak, FRiP 8% — enrichment bagus. Replikat kedua: 38.000 peak. IDR di bawah 0,05 menyisakan 31.000 peak konsisten — 9.000 peak dibuang sebagai irreproducible. Dari 31.000 itu, 60% bertumpang tindih dengan motif CTCF kanonik (validasi motif = cek kewarasan independen). Bila kamu melewatkan IDR dan memakai gabungan kedua daftar, sepertiga daftarmu adalah noise yang akan meracuni analisis motif dan GO enrichment berikutnya. Pelajaran yang dibayar mahal oleh banyak lab: daftar peak yang panjang bukan prestasi — daftar peak yang reproducible adalah.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan trade-off ambang q-value MACS2 yang ketat vs longgar" },
        { id: "t2", text: "Sebutkan tiga bias yang dikoreksi oleh kontrol input" },
      ],
      quiz: [
        {
          q: "FRiP 0,3% pada ChIP-seq faktor transkripsi. Kesimpulan yang tepat?",
          options: [
            { text: "Enrichment bagus, lanjutkan analisis motif", why: "FRiP di bawah 1% untuk TF = enrichment buruk, bukan bagus." },
            { text: "Antibodi kemungkinan gagal — jangan analisis motif, perbaiki eksperimennya", why: "Tidak ada enrichment = tidak ada sinyal untuk dianalisis; motif dari noise = fiksi.", correct: true },
            { text: "Tambah kedalaman sekuensing lalu panggil ulang", why: "Masalahnya bukan kedalaman — tidak ada molekul target yang tertarik sejak awal." },
            { text: "Normalisasi terhadap input akan memperbaikinya", why: "Input mengoreksi bias latar, bukan menyelamatkan enrichment yang tidak ada." },
          ],
        },
        {
          q: "Peak kuat muncul di region teramplifikasi (8 salinan) pada sampel kanker tanpa kontrol input. Tindakan yang benar?",
          options: [
            { text: "Laporkan sebagai temuan ikatan", why: "Tanpa input, amplifikasi copy number terlihat persis seperti peak — klaim ini tidak berdasar." },
            { text: "Langsung buang — pasti artefak", why: "Belum tentu artefak; butuh kontrol input untuk memutuskan secara adil." },
            { text: "Sekuensing input, lalu uji ulang peak terhadap latar lokal", why: "Hanya latar yang benar yang bisa memisahkan ikatan sejati dari efek dosis salinan.", correct: true },
            { text: "Naikkan stringency q-value sampai peak-nya hilang", why: "Artefak CNV lolos q-value berapa pun — masalahnya di latar, bukan di ambang." },
          ],
        },
      ],
      reference: "Peak = uji vs latar. Input + IDR + FRiP = tiga penjaga kualitas ChIP-seq.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      summary: [
        "Tiga lapisan: metilasi, histon, aksesibilitas = tinta stabilo genom.",
        "Kode histon: H3K4me3/H3K27ac aktif; H3K27me3 represif; bivalen = poised.",
        "ChIP-seq (spesifik, butuh antibodi + kontrol) vs ATAC-seq (umum, mudah).",
        "Peak calling = uji statistik vs kontrol (MACS2).",
        "Metilasi: bisulfite; beta untuk presentasi, M-value untuk statistik.",
        "DMR: region beda metilasi — biomarker kanker potensial.",
      ],
      next: { label: "BI14 · Metagenomik", href: "/v2/learn/bi14-metagenomik" },
      quiz: [
        {
          q: "Promoter gen supresor tumor yang hipermetilasi mengakibatkan…",
          options: [
            { text: "Gen aktif", why: "Hipermetilasi promoter justru membungkam gen." },
            { text: "Gen dibungkam tanpa mutasi DNA — mekanisme kanker", why: "Kanker via epigenetik, bukan genetik. Target obat demethylating!", correct: true },
            { text: "Tidak ada efek", why: "Pembungkaman supresor tumor = efek besar." },
            { text: "Mutasi DNA", why: "Tidak ada perubahan urutan DNA di sini." },
          ],
        },
        {
          q: "Kombinasi H3K4me3 + H3K27me3 (bivalen) artinya…",
          options: [
            { text: "Aktif penuh", why: "H3K27me3 adalah sinyal represif; tidak mungkin aktif penuh." },
            { text: "Poised: siap tapi ditahan — khas gen perkembangan sel punca", why: "Dua sinyal berlawanan = ditahan dalam kesiapan, bukan mati total.", correct: true },
            { text: "Rusak", why: "Bukan kerusakan; ini status regulasi yang disengaja." },
            { text: "Tidak mungkin", why: "Sangat mungkin dan umum di sel punca." },
          ],
        },
        {
          q: "Untuk UJI STATISTIK metilasi sebaiknya pakai…",
          options: [
            { text: "Beta value", why: "Beta heteroskedastik — melanggar asumsi uji." },
            { text: "M-value (homoskedastik); beta untuk presentasi", why: "Statistik valid + presentasi manusiawi = dua metrik.", correct: true },
            { text: "Count mentah", why: "Count mentah belum dinormalisasi menjadi proporsi." },
            { text: "p-value saja", why: "p-value adalah hasil uji, bukan input." },
          ],
        },
        {
          q: "Bisulfite sequencing membaca metilasi karena…",
          options: [
            { text: "Menghancurkan DNA", why: "DNA tetap utuh; yang berubah adalah basa tertentu." },
            { text: "C tak termetilasi → U (dibaca T); C termetilasi tetap C", why: "Konversi kimia yang membedakan status metilasi per basa.", correct: true },
            { text: "Menambah metilasi", why: "Bisulfite tidak menambah metilasi." },
            { text: "Menghapus metilasi", why: "Ia mengubah C tak termetilasi, bukan menghapus metilasi." },
          ],
        },
        {
          q: "Peak ChIP-seq tanpa kontrol input…",
          options: [
            { text: "Tetap valid", why: "Tanpa kontrol, bias teknis tak terbedakan dari ikatan." },
            { text: "Tidak valid — tak bisa bedakan ikatan dari bias teknis", why: "Kontrol = pembeda sinyal vs bias. Tanpa itu, peak = tebakan.", correct: true },
            { text: "Lebih baik", why: "Kontrol tidak pernah memperburuk; ia memvalidasi." },
            { text: "Wajib dipublikasi", why: "Reviewer justru menolak ChIP tanpa kontrol." },
          ],
        },
      ],
    },
  ],
};
