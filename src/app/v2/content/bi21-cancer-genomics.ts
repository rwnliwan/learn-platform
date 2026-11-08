import type { V2Lesson } from "../lib/types";

export const bi21: V2Lesson = {
  slug: "bi21-cancer-genomics",
  track: "Bioinformatika",
  module: "Genomik Kanker",
  title: "BI21 · Cancer Genomics: Jejak Mutasi & Tanda Tangan Kanker",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Tumor yang menyimpan buku harian",
      prose: [
        "Mei 2024, sebuah studi mempublikasikan hasil yang membuat para onkolog mengernyit: 962 tumor ginjal (clear cell renal carcinoma), diambil dari pasien di 11 negara, disekuensing seluruh genomnya. Diagnosisnya sama persis. Tapi genomnya bercerita beda-beda.",
        "Tumor dari Rumania dan Serbia dipenuhi satu pola mutasi khas — SBS22, sidik jari asam aristolokat, zat dari obat herbal tradisional yang merusak ginjal. Tumor dari Jepang justru didominasi SBS12 — signature yang sampai hari ini tidak diketahui penyebabnya, muncul di ~70% kasus Jepang. Sementara hanya riwayat merokok, bukan obesitas atau hipertensi, yang berkorelasi dengan signature yang sudah dikenal.",
        "Twist-nya: sel kanker tidak bisa berbohong soal masa lalunya. Setiap paparan — sinar UV, asap rokok, obat herbal — meninggalkan pola mutasi khas di DNA, seperti sidik jari di TKP. Lesson ini mengajarkanmu membaca sidik jari itu: mutational signatures, dan memilah mutasi yang benar-benar menyetir kanker (driver) dari yang sekadar menumpang (passenger).",
        "Dua bekal yang kamu butuhkan sudah kamu kuasai: dari BI8, pipeline NGS memanggil mutasi somatik dengan membandingkan DNA tumor melawan DNA normal pasien yang sama, sehingga mutasi bawaan (germline) tersaring keluar. Dari BI10, menguji ribuan gen sekaligus berarti p-value mentah tidak cukup — koreksi multiple testing (mis. Benjamini-Hochberg) mencegah temuan palsu membanjiri hasil.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa tumor ginjal dari dua negara bisa punya pola mutasi berbeda" },
        { id: "t2", text: "Jelaskan perbedaan mutasi somatik vs germline dalam konteks variant calling" },
      ],
      note: {
        title: "🚨 Mitos: semua mutasi di tumor menyebabkan kanker",
        type: "pitfall",
        body: "Yang benar: mayoritas mutasi di tumor adalah passenger — kerusakan netral yang ikut terbawa saat sel membelah. Dari ribuan mutasi somatik per tumor, biasanya hanya segelintir driver (mis. TP53, KRAS) yang memberi keuntungan selektif. Mengobati passenger = menembak target yang salah.",
      },
      reference: "Mutasi = buku harian paparan. Signature = sidik jarinya; driver vs passenger = siapa sopirnya.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan & peta",
      title: "Yang bisa kamu lakukan setelah lesson ini",
      prose: [
        "1. Menjelaskan konsep mutational signature: katalog 96-kanal, ekstraksi, dan atribusi exposure.",
        "2. Menghitung kemiripan kosinus antara katalog mutasi tumor dan signature referensi COSMIC, lalu menginterpretasikan signature dominan (SBS1, SBS4, SBS7a).",
        "3. Membedakan driver vs passenger memakai logika statistik (bukan sekadar frekuensi).",
        "4. Memilih analisis yang tepat: kapan WGS untuk signature, kapan panel gen cukup, kapan TMB memengaruhi keputusan terapi.",
        "5. Mengkritik klaim 'signature baru' ala SBS12: kapan pola layak disebut penemuan, kapan masih hipotesis.",
        "Peta lesson: (3) Jejak mutasi — anatomi signature · (4) Galeri signature terkenal · (5) Lab: mencocokkan signature dengan kosinus · (6) Driver vs passenger · (7) Lab: uji Fisher untuk gen driver · (8) Peta keputusan · (9) Mini-case: misteri ginjal 11 negara · (10) Checkpoint.",
      ],
      tasks: [
        { id: "t1", text: "Tulis ulang 5 tujuan di atas dengan kata-katamu sendiri" },
      ],
      reference: "5 tujuan: signature → kosinus → driver → pilih analisis → kritik klaim.",
    },
    {
      id: "jejak",
      eyebrow: "Langkah 3 · Konsep inti 1",
      title: "Mutational signature: sidik jari 96-kanal",
      prose: [
        "Definisi. Mutational signature adalah pola distribusi mutasi titik (single-base substitution) pada 96 konteks trinukleotida: 6 kelas substitusi (C>A, C>G, C>T, T>A, T>C, T>G — dihitung dari sisi pirimidin) × 4 basa di 5' × 4 basa di 3'. Satu tumor diringkas jadi satu vektor 96 angka: katalog mutasinya.",
        "Kepribadian. Bayangkan setiap proses mutagenik sebagai 'penulis' dengan gaya tulisan khas: UV selalu salah di huruf yang sama, tembakau punya typo favoritnya sendiri. Signature adalah gaya tulisan itu — diekstrak dari ribuan tumor memakai factorisasi matriks non-negatif (NMF), lalu dikatalogkan COSMIC. Rilis v3.3 (Mei 2022) mencatat 78 signature SBS; situs resmi kini sudah di v3.6 (Mei 2026).",
        "Cara kerja 4 langkah: (1) panggil mutasi somatik (tumor vs normal); (2) klasifikasikan tiap SNV ke 1 dari 96 kanal → katalog M; (3) cocokkan M ke katalog referensi (dekomposisi: M ≈ Σ exposure_k × signature_k); (4) baca exposure dominan sebagai petunjuk etiologi.",
        "Cara membaca chart: sumbu X = 6 kelas substitusi (C>A berarti sitosin berubah jadi adenin, dihitung dua arah untai); tinggi batang = persen mutasi katalog dalam kelas itu. Profil biru meniru SBS7a (UV): C>T menjulang — kerusakan dipirimidin khas sinar matahari. Profil oranye meniru SBS1 (jam penuaan): C>T juga dominan tapi dari deaminasi 5-metilsitosin di CpG.",
        "Interpretasi: dua tumor bisa sama-sama 'banyak C>T' tapi sebabnya berlawanan — muda-terpapar vs tua-alami. Di sinilah 96 kanal (bukan 6 kelas) menjadi penentu: konteks tetangga membedakan UV dari penuaan.",
        "💡 Intuisi kunci: signature tidak membuktikan sebab-akibat pada satu pasien — ia memberi hipotesis etiologi. SBS4 kuat pada perokok bukan vonis bahwa pasien merokok; ia undangan untuk menelusuri riwayat paparan.",
      ],
      formula: String.raw`M \approx \sum_{k} E_k \cdot S_k`,
      formulaNote: "M = katalog mutasi tumor (vektor 96 angka); S_k = signature referensi ke-k (pola 96 angka, jumlah = 1); E_k = exposure — berapa banyak mutasi tumor dijelaskan signature k. Dekomposisi mencari E_k yang membuat rekonstruksi paling mirip M.",
      echart: {
        option: {
          title: { text: "Dua pola signature (profil sintetis, persen per kelas)" },
          tooltip: { trigger: "axis" },
          legend: { data: ["mirip SBS7a (UV)", "mirip SBS1 (jam penuaan)"] },
          xAxis: { type: "category", data: ["C>A", "C>G", "C>T", "T>A", "T>C", "T>G"] },
          yAxis: { type: "value", name: "persen mutasi" },
          series: [
            { name: "mirip SBS7a (UV)", type: "bar", data: [8, 6, 70, 4, 7, 5] },
            { name: "mirip SBS1 (jam penuaan)", type: "bar", data: [8, 5, 60, 7, 12, 8] },
          ],
        },
        caption: "Profil sintetis yang meniru pola COSMIC SBS7a dan SBS1 (bukan data COSMIC asli). Keduanya C>T-dominan — pembedanya ada di konteks trinukleotida.",
      },
      tasks: [
        { id: "t1", text: "Jelaskan kenapa 96 kanal, bukan 6 kelas, yang membedakan UV dari penuaan" },
        { id: "t2", text: "Tuliskan apa arti tiap simbol pada rumus dekomposisi di atas" },
      ],
      note: {
        title: "🚨 Mitos: TMB tinggi = kanker lebih ganas",
        type: "pitfall",
        body: "Yang benar: tumor mutational burden (TMB) tinggi tidak berarti prognosis buruk — justru sebaliknya untuk imunoterapi. Makin banyak mutasi, makin banyak neoantigen asing yang dikenali sistem imun. TMB ≥ 10 mutasi/Mb adalah ambang yang dipakai FDA untuk persetujuan tumor-agnostic pembrolizumab.",
      },
      reference: "Signature = gaya tulisan tiap proses mutagenik. 96 kanal menangkap konteks, 6 kelas tidak.",
    },
    {
      id: "galeri",
      eyebrow: "Langkah 4 · Konsep inti 2",
      title: "Galeri signature: dari jam tubuh hingga obat herbal",
      prose: [
        "SBS1 — Si Jam Tua. C>T di konteks CpG (N[C>T]G), dari deaminasi spontan 5-metilsitosin. Berdetak di semua jaringan, berkorelasi dengan umur pasien. Ada di hampir tiap tumor: latar alami yang harus dikurangi dulu sebelum mencari yang menarik.",
        "SBS4 — Si Perokok. C>A dominan dari hidrokarbon polisiklik tembakau. Ditemukan kuat di kanker paru perokok; pada studi ginjal 11 negara, hanya riwayat merokok — bukan obesitas/hipertensi — yang berasosiasi dengan signature dikenal.",
        "SBS7a — Si Pantai. C>T di dipirimidin (C/T di 5'), dari dimer pirimidin akibat UV, dengan bias untai transkripsi (diperbaiki oleh transcription-coupled repair). Sidik jari melanoma.",
        "SBS2 & SBS13 — Si Enzim Kebablasan. C>T dan C>G dari APOBEC (enzim pertahanan antivirus yang salah sasaran mengedit genom inang). Sering berpasangan di kanker payudara dan kandung kemih.",
        "SBS3 — Si Tukang Las Rusak. Pola campuran dari defisiensi homologous recombination (mutasi BRCA1/BRCA2). Klinis: tumor SBS3-positif kandidat PARP inhibitor (sintetik letal).",
        "SBS6 — Si Proofreader Mogok. Dari defisiensi mismatch repair (MLH1, MSH2, MSH6, PMS2) → microsatellite instability. Klinis: kandidat imunoterapi.",
        "SBS22 — Si Herbalis. T>A khas asam aristolokat. Menonjol di tumor ginjal Rumania & Serbia — menunjuk obat herbal tradisional sebagai paparan yang bisa dicegah.",
        "SBS12 — Si Misteri. Etiologi tidak diketahui, hampir eksklusif di tumor ginjal Jepang (~70% kasus). Signature boleh belum punya nama penyebab — katalog COSMIC jujur menandai 'unknown'.",
        "💡 Intuisi kunci: hafalkan pola pikirnya, bukan nomornya — jam (SBS1) selalu hadir, eksogen (SBS4/SBS7a/SBS22) menunjuk paparan, defisiensi repair (SBS3/SBS6) menunjuk terapi. Nomor boleh dibuka catatannya.",
      ],
      formula: String.raw`\text{TMB} = \frac{N_{\text{mutasi somatik}}}{\text{ukuran wilayah terukur (Mb)}}`,
      formulaNote: "N_mutasi somatik = jumlah SNV + indel somatik; penyebut = luas genom yang disekuensing dengan cakupan cukup (eksom ≈ 30 Mb, genom ≈ 2.800 Mb). Contoh: 300 mutasi / 30 Mb = 10 mut/Mb → tepat di ambang TMB-high. Interpretasi: TMB mengukur 'kebisingan' genom, bukan keganasan.",
      tasks: [
        { id: "t1", text: "Untuk tiap dari 8 signature di atas, tulis satu kalimat: pola + penyebab" },
        { id: "t2", text: "Hitung TMB: 450 mutasi somatik pada panel 1,5 Mb — TMB-high atau bukan?" },
      ],
      note: {
        title: "Intuisi: signature adalah hipotesis paparan, bukan vonis",
        body: "Analis cancer genomics menyimpan lima heuristik. Satu: kurangi latar dulu — SBS1 (penuaan) dan SBS5 (jam misterius) ada di hampir semua tumor; signature yang menarik adalah yang TERSISA setelah latar dikurangi, bukan yang paling tinggi mentah. Dua: signature = petunjuk etiologi, bukan bukti — SBS22 kuat pada pasien Serbia mengarah ke hipotesis asam aristolokat, tetapi butuh kuesioner paparan + validasi eksperimental sebelum menjadi kesimpulan; SBS12 adalah misteri yang jujur, bukan jawaban. Tiga: jangan klaim signature dari panel kecil — dekomposisi 96-kanal butuh ratusan hingga ribuan mutasi (WGS); puluhan mutasi dari panel gen memberi atribusi liar. Empat: frekuensi bukan driver — gen raksasa TTN selalu “teratas” karena targetnya luas, bukan karena menyetir; uji statistik (dN/dS, MutSigCV) dengan koreksi panjang gen dan latar mutasi adalah wasitnya, bukan ranking frekuensi. Lima: TMB-high adalah biomarker PROBABILISTIK — ambang 10 mut/Mb membuka diskusi imunoterapi, bukan menjamin respons; tumor purity rendah dan heterogenitas klonal bisa mengaburkan semuanya. Heuristik gabungannya: setiap klaim genomik kanker harus bisa menjawab — berapa purity tumornya, apa latar yang sudah dikurangi, dan apakah temuannya bertahan di kohort independen.",
      },
      reference: "Jam = SBS1 · eksogen = SBS4/SBS7a/SBS22 · repair rusak = SBS3/SBS6 · misteri = SBS12.",
    },

    {
      id: "lab-tanda",
      eyebrow: "Langkah 5 · Lab 1/2",
      title: "Mencocokkan signature dengan kemiripan kosinus",
      prose: [
        "Praktik inti analisis signature: katalog tumor (96 angka) dibandingkan ke tiap signature referensi memakai kemiripan kosinus — kosinus sudut antara dua vektor. Nilai 1 = pola identik, 0 = tak beririsan. Di studi nyata dipakai dekomposisi NNLS penuh; di sini kamu memakai versi jujur yang lebih sederhana: ranking kosinus.",
        "Data di bawah SINTETIS (pola disederhanakan, bukan profil COSMIC asli): tiga signature referensi + satu katalog 'tumor' berisi 3.000 mutasi yang disampling dari campuran 70% pola-UV + 20% pola-rokok + 10% noise acak — persis cara katalog tumor nyata terbentuk (cacah mutasi, bukan proporsi abstrak). Tugasmu: lengkapi fungsi kosinus, ranking ketiga signature, dan putuskan exposure dominan.",
        "Coba: ubah bobot W_UV 0,70 → 0,40 dan W_ROKOK 0,20 → 0,50 — apakah ranking berbalik? Pada titik berapa keputusan menjadi ambigu (selisih kosinus < 0,05)? Itulah batas di mana analis nyata beralih ke dekomposisi penuh + bootstrap.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `kosinus(a, b)`" },
        { id: "t2", text: "Ranking ketiga signature dan interpretasikan exposure dominan" },
      ],
      expected: "SBS7a-like teratas (kosinus ≈ 0,97), SBS4-like kedua, SBS1-like jauh",
      hints: [
        "kosinus = dot(a,b) / (|a| × |b|); |a| = sqrt(sum(x²)).",
        "dot = sum(x*y for x, y in zip(a, b)).",
        "Ranking: sorted dengan key kosinus, reverse=True.",
      ],
      code: {
        starter: `import math, random\nrandom.seed(7)\n# 96 konteks: (basa5', substitusi, basa3')\nKONTEKS = [(b5, s, b3) for s in ['C>A','C>G','C>T','T>A','T>C','T>G']\n           for b5 in 'ACGT' for b3 in 'ACGT']\n\ndef norm(v):\n    t = sum(v)\n    return [x/t for x in v]\n\n# SIGNATURE REFERENSI SINTETIS (pola disederhanakan, BUKAN profil COSMIC asli)\nREF = {\n    'SBS1-like (jam)': norm([8.0 if (s=='C>T' and b3=='G') else 0.02\n                              for (b5,s,b3) in KONTEKS]),\n    'SBS4-like (rokok)': norm([8.0 if s=='C>A' else 0.02\n                              for (b5,s,b3) in KONTEKS]),\n    'SBS7a-like (UV)': norm([8.0 if (s=='C>T' and b5 in 'CT') else 0.02\n                              for (b5,s,b3) in KONTEKS]),\n}\n# BOBOT CAMPURAN (boleh diubah untuk eksplorasi)\nW_UV, W_ROKOK, W_NOISE, N_MUT = 0.70, 0.20, 0.10, 3000\n# KATALOG TUMOR SINTETIS: sampling 3000 mutasi dari campuran\nmix = [W_UV*a + W_ROKOK*b + W_NOISE/96\n       for a, b in zip(REF['SBS7a-like (UV)'], REF['SBS4-like (rokok)'])]\nsampel = random.choices(range(96), weights=mix, k=N_MUT)\nKATALOG = norm([sampel.count(i) for i in range(96)])\n\ndef kosinus(a, b):\n    # TULIS KODEMU: kembalikan kosinus sudut dua vektor\n    dot = \n    na = \n    nb = \n    return \n\nprint('kemiripan katalog tumor vs referensi:')\nhasil = sorted(((nm, kosinus(KATALOG, sg)) for nm, sg in REF.items()),\n               key=lambda t: t[1], reverse=True)\nfor nm, k in hasil:\n    print(f'  {nm}: {k:.3f}')\nprint('dominan:', hasil[0][0])`,
        lockLines: 28,
        solution: `import math, random\nrandom.seed(7)\n# 96 konteks: (basa5', substitusi, basa3')\nKONTEKS = [(b5, s, b3) for s in ['C>A','C>G','C>T','T>A','T>C','T>G']\n           for b5 in 'ACGT' for b3 in 'ACGT']\n\ndef norm(v):\n    t = sum(v)\n    return [x/t for x in v]\n\n# SIGNATURE REFERENSI SINTETIS (pola disederhanakan, BUKAN profil COSMIC asli)\nREF = {\n    'SBS1-like (jam)': norm([8.0 if (s=='C>T' and b3=='G') else 0.02\n                              for (b5,s,b3) in KONTEKS]),\n    'SBS4-like (rokok)': norm([8.0 if s=='C>A' else 0.02\n                              for (b5,s,b3) in KONTEKS]),\n    'SBS7a-like (UV)': norm([8.0 if (s=='C>T' and b5 in 'CT') else 0.02\n                              for (b5,s,b3) in KONTEKS]),\n}\n# BOBOT CAMPURAN (boleh diubah untuk eksplorasi)\nW_UV, W_ROKOK, W_NOISE, N_MUT = 0.70, 0.20, 0.10, 3000\n# KATALOG TUMOR SINTETIS: sampling 3000 mutasi dari campuran\nmix = [W_UV*a + W_ROKOK*b + W_NOISE/96\n       for a, b in zip(REF['SBS7a-like (UV)'], REF['SBS4-like (rokok)'])]\nsampel = random.choices(range(96), weights=mix, k=N_MUT)\nKATALOG = norm([sampel.count(i) for i in range(96)])\n\ndef kosinus(a, b):\n    # kembalikan kosinus sudut dua vektor\n    dot = sum(x*y for x, y in zip(a, b))\n    na = math.sqrt(sum(x*x for x in a))\n    nb = math.sqrt(sum(x*x for x in b))\n    return dot/(na*nb)\n\nprint('kemiripan katalog tumor vs referensi:')\nhasil = sorted(((nm, kosinus(KATALOG, sg)) for nm, sg in REF.items()),\n               key=lambda t: t[1], reverse=True)\nfor nm, k in hasil:\n    print(f'  {nm}: {k:.3f}')\nprint('dominan:', hasil[0][0])`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "SBS7a-like \\(UV\\): 0\\.9\\d\\d", label: "SBS7a-like teratas ≈0,9+", msg: "Katalog 70% UV harus paling mirip SBS7a-like. Cek dot/(|a|×|b|)." },
          { kind: "stdout_matches", task: "t2", pattern: "dominan: SBS7a-like \\(UV\\)", label: "keputusan: dominan UV", msg: "Ranking harus menempatkan SBS7a-like di puncak." },
        ],
      },
      reference: "Kosinus = kompas pertama signature. Ambigu (< 0,05) → dekomposisi penuh.",
    },
    {
      id: "driver",
      eyebrow: "Langkah 6 · Konsep inti 3",
      title: "Driver vs passenger: siapa menyetir, siapa menumpang",
      prose: [
        "Definisi. Driver = mutasi yang memberi keuntungan selektif pada sel (tumbuh lebih cepat, lolos apoptosis) sehingga mengalami seleksi positif — polanya: lebih sering dari peluang acak, mengelompok di domain fungsional protein, dan berulang lintas pasien. Passenger = mutasi netral yang ikut terbawa; jumlahnya jauh lebih banyak.",
        "Kepribadian. Driver adalah sopir yang membajak mobil; passenger adalah penumpang yang kebetulan naik. Kesalahan klasik analis pemula: mengurutkan gen berdasarkan frekuensi mutasi lalu menyebut teratas sebagai driver. Gen raksasa TTN (titin, gen terpanjang manusia) selalu 'teratas' di banyak kanker — bukan karena menyetir, tapi karena targetnya luas. Reseptor olfaktori (penciuman) juga langganan daftar: penumpang klasik yang tidak diekspresikan di kebanyakan jaringan.",
        "Logika statistiknya (intuisi dN/dS): bandingkan laju mutasi non-sinonim vs sinonim. Gen netral ≈ 1 (acak); driver > 1 (seleksi positif mempertahankan perubahan protein). Praktik modern (MutSigCV, dNdScv) menambahkan koreksi: panjang gen, konteks trinukleotida (signature latar!), dan laju mutasi tiap pasien — karena tumor hipermutasi membuat semua gen terlihat 'sering bermutasi'.",
        "Contoh konkret: di kanker kolorektal, mutasi pada TP53, APC, KRAS, BRAF, dan ATM saja sudah mencakup 97,55% populasi TCGA — segelintir driver menjelaskan hampir semua kasus. Sisanya? Ribuan passenger yang unik per pasien.",
        "Cara membaca chart: sumbu X = gen pada kohort sintetis 200 pasien; tinggi batang = persen pasien dengan mutasi di gen itu. TTN menjulang (35%) bukan karena penting, tapi karena panjang — bandingkan dengan OR2J3 (reseptor olfaktori, 12%): keduanya penumpang meski 'sering'.",
        "Interpretasi: frekuensi mentah menipu; driver dibuktikan oleh seleksi (dN/dS > 1), bukan oleh ranking frekuensi.",
        "💡 Intuisi kunci: passenger bukan sampah — ia arsip evolusi tumor. Filogeni klon tumor direkonstruksi justru dari passenger (mereka netral sehingga menjadi 'jam' pembelahan sel), mirip cara ahli bahasa memakai kata pinjaman untuk melacak migrasi.",
      ],
      echart: {
        option: {
          title: { text: "Frekuensi mutasi per gen (kohort SINTETIS, 200 pasien)" },
          tooltip: { trigger: "axis" },
          xAxis: { type: "category", data: ["TP53", "APC", "KRAS", "TTN", "BRAF", "OR2J3"] },
          yAxis: { type: "value", name: "% pasien bermutasi" },
          series: [
            { type: "bar", data: [62, 58, 45, 35, 18, 12] },
          ],
        },
        caption: "Data sintetis untuk ilustrasi. TTN (gen terpanjang) dan OR2J3 (reseptor olfaktori) adalah penumpang klasik — frekuensi tinggi tidak sama dengan driver.",
      },
      tasks: [
        { id: "t1", text: "Jelaskan kenapa TTN sering muncul di daftar teratas tapi bukan driver" },
        { id: "t2", text: "Jelaskan intuisi dN/dS dalam satu paragraf" },
      ],
      note: {
        title: "🚨 Mitos: mutasi driver = target obat yang pasti",
        type: "pitfall",
        body: "Yang benar: tidak semua driver bisa diobati (druggable). TP53 adalah driver tersering di banyak kanker tapi sampai kini belum ada obat yang langsung menargetkannya — kebanyakan terapi menarget KRAS, EGFR, BRAF, atau jalur downstream. 'Driver' adalah klaim biologi; 'target terapi' adalah klaim farmakologi. Jangan samakan.",
      },
      reference: "Driver = seleksi positif (dN/dS>1). Frekuensi tanpa koreksi = jebakan TTN.",
    },
    {
      id: "lab-driver",
      eyebrow: "Langkah 7 · Lab 2/2",
      title: "Uji Fisher: apakah gen ini driver?",
      prose: [
        "Uji statistik paling jujur untuk pertanyaan 'apakah gen G bermutasi lebih sering dari peluang?': uji eksak Fisher pada tabel 2×2 — baris: gen target vs gen latar; kolom: bermutasi vs tidak. Hipotesis nol: laju mutasi gen target sama dengan latar.",
        "Data SINTETIS: kohort 60 tumor. TP53 bermutasi di 38 tumor; gen latar (rata-rata genomik, dikoreksi panjang) bermutasi di 5 dari 100 'slot gen'. OR2J3 (reseptor olfaktori) bermutasi di 7 tumor — lebih tinggi dari latar, tapi apakah signifikan setelah koreksi?",
        "Kamu mengimplementasikan p-value Fisher satu sisi (enrichment) dari distribusi hipergeometrik: jumlahkan peluang tabel yang sama-ekstrem-atau-lebih dari yang teramati.",
        "Coba: naikkan mutasi OR2J3 jadi 25/60 — pada titik berapa ia 'lolos' p < 0,05? Lalu renungkan: dengan 20.000 gen diuji, berapa false positive yang kamu harapkan tanpa koreksi? (Jawaban: 20.000 × 0,05 = 1.000 — koreksi multiple testing mencegah seribu temuan palsu membanjiri hasil.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `fisher_p(a, b, c, d)` (satu sisi, enrichment)" },
        { id: "t2", text: "Uji TP53 dan OR2J3, lalu putuskan dengan ambang p < 0,05" },
      ],
      expected: "TP53: p sangat kecil (driver) · OR2J3: p > 0,05 (penumpang)",
      hints: [
        "P(X=k) hipergeometrik = C(a+b,k) × C(c+d, a+c-k) / C(n, a+c), n = a+b+c+d.",
        "Jumlahkan untuk k dari a sampai min(a+b, a+c).",
        "math.comb tersedia di Python 3.8+.",
      ],
      code: {
        starter: `import math\n\ndef fisher_p(a, b, c, d):\n    # TULIS KODEMU: p-value Fisher exact satu sisi (enrichment)\n    # tabel: [[a, b], [c, d]]; a = mutasi gen target, c = mutasi latar\n    n = a + b + c + d\n    p = 0.0\n    for k in range(a, min(a+b, a+c) + 1):\n        p += \n    return p\n\n# kohort SINTETIS: 60 tumor; latar: 5 mutasi per 100 slot gen\np_tp53 = fisher_p(38, 22, 5, 95)\np_or = fisher_p(7, 53, 5, 95)\nprint(f'TP53 : p = {p_tp53:.2e} -> {\"DRIVER\" if p_tp53 < 0.05 else \"penumpang\"}')\nprint(f'OR2J3: p = {p_or:.2e} -> {\"DRIVER\" if p_or < 0.05 else \"penumpang\"}')\nprint('catatan: uji 20.000 gen tanpa koreksi -> ~1000 false positive')`,
        lockLines: 8,
        solution: `import math\n\ndef fisher_p(a, b, c, d):\n    # p-value Fisher exact satu sisi (enrichment)\n    # tabel: [[a, b], [c, d]]; a = mutasi gen target, c = mutasi latar\n    n = a + b + c + d\n    p = 0.0\n    for k in range(a, min(a+b, a+c) + 1):\n        p += math.comb(a+b, k) * math.comb(c+d, a+c-k) / math.comb(n, a+c)\n    return p\n\n# kohort SINTETIS: 60 tumor; latar: 5 mutasi per 100 slot gen\np_tp53 = fisher_p(38, 22, 5, 95)\np_or = fisher_p(7, 53, 5, 95)\nprint(f'TP53 : p = {p_tp53:.2e} -> {\"DRIVER\" if p_tp53 < 0.05 else \"penumpang\"}')\nprint(f'OR2J3: p = {p_or:.2e} -> {\"DRIVER\" if p_or < 0.05 else \"penumpang\"}')\nprint('catatan: uji 20.000 gen tanpa koreksi -> ~1000 false positive')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "TP53 : p = \\d\\.\\d\\de-\\d+ -> DRIVER", label: "TP53 terdeteksi driver", msg: "p TP53 harus sangat kecil. Cek rumus hipergeometrik dan rentang k." },
          { kind: "stdout_matches", task: "t2", pattern: "OR2J3: p = \\d\\.\\d\\de-0\\d -> penumpang", label: "OR2J3 bukan driver", msg: "p OR2J3 harus > 0,05 (format e-0x). Cek batas bawah k = a." },
        ],
      },
      reference: "Fisher = 'lebih sering dari peluang?'. Tanpa koreksi multipel, 20.000 gen = 1.000 false positive.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Analisis apa untuk tumor apa",
      prose: [
        "Skenario 1 — Tumor baru dengan WGS tersedia → ekstraksi signature penuh. Alasan: hanya WGS yang memberi ribuan mutasi untuk dekomposisi 96-kanal yang stabil. Contoh nyata: studi ginjal 962 WGS yang menemukan SBS22 di Balkan.",
        "Skenario 2 — Hanya panel gen (mis. 300–500 gen) → fokus TMB + driver panel, JANGAN klaim signature. Alasan: puluhan mutasi tidak cukup untuk memisahkan 78 pola; atribusi akan liar. Contoh: panel FoundationOne melaporkan TMB, bukan SBS7a.",
        "Skenario 3 — SBS3/HRD terdeteksi → pertimbangkan PARP inhibitor. Alasan: sintetik letal — sel yang tidak bisa memperbaiki double-strand break mati saat PARP dihambat. Contoh: olaparib pada kanker ovarium BRCA-mutasi.",
        "Skenario 4 — TMB ≥ 10 mut/Mb → diskusikan imunoterapi dengan onkolog. Alasan: ambang tumor-agnostic FDA untuk pembrolizumab. Contoh: tumor MSI-high/TMB-high merespons checkpoint inhibitor lintas jenis kanker.",
        "Skenario 5 — Signature tak dikenal dominan (ala SBS12 Jepang) → perlakukan sebagai hipotesis, bukan temuan. Alasan: butuh replikasi kohort independen + validasi eksperimental sebelum dikaitkan ke paparan. Contoh: SBS40 dipecah jadi 3 sub-signature sebelum SBS40b dikaitkan ke insidens.",
        "Aturan praktis 10 detik: (1) WGS? → signature. Panel? → TMB + driver. (2) TMB ≥ 10 → imunoterapi. (3) SBS3/SBS6 → PARP/imunoterapi. (4) Frekuensi tinggi ≠ driver — cek dN/dS. (5) Signature asing → hipotesis, bukan vonis.",
      ],
      tasks: [
        { id: "t1", text: "Pasien melanoma, WGS, SBS7a dominan, TMB 25/Mb — analisis & implikasi apa?" },
        { id: "t2", text: "Hanya panel 400 gen, 40 mutasi — bolehkah mengklaim SBS4? Kenapa?" },
      ],
      reference: "WGS → signature · panel → TMB+driver · SBS3/SBS6 & TMB≥10 → terapi · asing → hipotesis.",
    },
    {
      id: "kasus",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Misteri ginjal 11 negara",
      prose: [
        "Kasus (Senkin dkk., Nature 629, 910–918, 2024): 962 clear cell renal carcinoma dari 11 negara (mayoritas Eropa, 4 benua), WGS penuh. Pertanyaan penelitian: kenapa insidens kanker ginjal berbeda antar negara?",
        "Temuan angka: (a) SBS22 (asam aristolokat) menonjol di sampel Rumania & Serbia; (b) SBS12 tak-berpenyebab muncul di ~70% tumor Jepang dan hampir tidak ada di tempat lain; (c) SBS40 dipecah jadi 3 komponen, dan atribusi SBS40b berkorelasi dengan insidens antar negara; (d) dari semua faktor risiko (obesitas, hipertensi, merokok), hanya merokok yang berasosiasi dengan signature yang sudah dikenal.",
        "Pertanyaan 1: Seorang pasien ginjal Serbia menunjukkan SBS22 kuat. Apa hipotesis paparannya dan intervensi pencegahannya? Pertanyaan 2: Bisakah kamu menyimpulkan 'orang Jepang terpapar X' dari SBS12? Apa yang kurang?",
        "Pembahasan 1: hipotesis = paparan asam aristolokat, kemungkinan dari obat herbal tradisional (Aristolochia) — intervensi: regulasi & edukasi herbal, skrining. Ini contoh signature yang menjadi target pencegahan.",
        "Pembahasan 2: tidak bisa — SBS12 etiologinya unknown. Yang kurang: replikasi independen, korelasi dengan kuesioner paparan, dan validasi eksperimental (paparan kandidat ke model sel → cocokkan pola). Sampai itu ada, SBS12 adalah misteri yang jujur, bukan jawaban.",
      ],
      tasks: [
        { id: "t1", text: "Jawab Pertanyaan 1 dengan rantai logika signature → paparan → intervensi" },
        { id: "t2", text: "Sebutkan 3 syarat sebelum SBS12 boleh dikaitkan ke suatu paparan" },
      ],
      reference: "SBS22 Balkan = paparan cegah-able · SBS12 Jepang = misteri jujur · rokok satu-satunya faktor yang cocok.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan penutup. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      summary: [
        "Mutational signature = pola 96-kanal tiap proses mutagenik; dekomposisi M ≈ Σ E_k·S_k.",
        "SBS1 jam penuaan · SBS4 rokok · SBS7a UV · SBS2/13 APOBEC · SBS3 BRCA/HRD · SBS6 MMR · SBS22 herbal · SBS12 misteri.",
        "Kosinus = kompas cepat; selisih < 0,05 → butuh dekomposisi penuh.",
        "Driver = seleksi positif (dN/dS > 1); frekuensi mentah menipu (jebakan TTN).",
        "WGS → signature; panel → TMB + driver; TMB ≥ 10 → imunoterapi; SBS3/SBS6 → terapi target.",
        "Signature asing = hipotesis sampai ada replikasi + validasi eksperimental.",
      ],
      next: { label: "BI22 · Spatial Transcriptomics", href: "/v2/learn/bi22-spatial-transcriptomics" },
      quiz: [
        {
          q: "Dua tumor sama-sama C>T-dominan. Kenapa belum tentu penyebabnya sama?",
          options: [
            { text: "Karena C>T selalu berarti UV", why: "Salah — C>T juga pola SBS1 (penuaan) dan SBS11 (temozolomide)." },
            { text: "Konteks trinukleotida membedakan: UV = C>T di dipirimidin, penuaan = C>T di CpG", why: "96 kanal menangkap konteks tetangga; 6 kelas tidak. Itulah gunanya signature.", correct: true },
            { text: "Karena jumlah mutasinya pasti beda", why: "Jumlah bisa sama; yang beda adalah distribusi konteksnya." },
            { text: "Tidak bisa dibedakan sama sekali", why: "Bisa — justru itulah pekerjaan signature." },
          ],
        },
        {
          q: "Gen TTN bermutasi di 35% tumor kohort. Kesimpulan yang tepat?",
          options: [
            { text: "TTN adalah driver utama", why: "Jebakan frekuensi: TTN gen terpanjang manusia — target besar, bukan seleksi." },
            { text: "TTN kemungkinan passenger; driver dibuktikan seleksi (dN/dS > 1), bukan ranking frekuensi", why: "Frekuensi mentah tanpa koreksi panjang gen = menyesatkan.", correct: true },
            { text: "TTN harus jadi target obat", why: "Driver ≠ druggable; lagipula TTN bukan driver." },
            { text: "Data kohortnya salah", why: "Datanya benar; interpretasinya yang perlu koreksi statistik." },
          ],
        },
        {
          q: "Kapan kamu TIDAK boleh mengklaim signature tertentu?",
          options: [
            { text: "Saat memakai WGS dengan ribuan mutasi", why: "WGS justru kondisi ideal untuk dekomposisi signature." },
            { text: "Saat hanya ada panel 400 gen dengan 40 mutasi — atribusi 78 pola jadi liar", why: "Terlalu sedikit mutasi untuk memisahkan puluhan pola.", correct: true },
            { text: "Saat TMB tinggi", why: "TMB tinggi justru memberi lebih banyak mutasi untuk dianalisis." },
            { text: "Saat signature-nya SBS1", why: "SBS1 mudah dikenali; masalahnya adalah jumlah mutasi, bukan jenisnya." },
          ],
        },
        {
          q: "Tumor menunjukkan SBS3 kuat. Implikasi klinisnya?",
          options: [
            { text: "Beri antibiotik", why: "Tidak ada hubungannya dengan infeksi." },
            { text: "Pertimbangkan PARP inhibitor — defisiensi homologous recombination = sintetik letal", why: "SBS3 menandai tumor BRCA-like; uji HRD + diskusi onkolog.", correct: true },
            { text: "Pasti resisten semua terapi", why: "Sebaliknya: SBS3 membuka opsi terapi target." },
            { text: "Tidak ada implikasi", why: "SBS3 adalah salah satu signature dengan implikasi terapi paling jelas." },
          ],
        },
        {
          q: "SBS12 dominan di tumor pasien Jepang. Sikap ilmiah yang benar?",
          options: [
            { text: "Simpulkan pasien terpapar zat X tertentu", why: "Etiologi SBS12 unknown — menyimpulkan X adalah spekulasi." },
            { text: "Laporkan sebagai signature tak-berpenyebab; butuh replikasi + validasi sebelum dikaitkan ke paparan", why: "Kejujuran katalog COSMIC: 'unknown' adalah jawaban yang valid.", correct: true },
            { text: "Abaikan karena tidak ada di katalog", why: "SBS12 ada di katalog COSMIC — unknown bukan berarti tidak ada." },
            { text: "Samakan dengan SBS22 karena mirip", why: "Pola berbeda, penyebab berbeda; jangan dipaksakan cocok." },
          ],
        },
      ],
    },
  ],
};
