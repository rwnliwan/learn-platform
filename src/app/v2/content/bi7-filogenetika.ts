import type { V2Lesson } from "../lib/types";

export const bi7: V2Lesson = {
  slug: "bi7-filogenetika",
  track: "Bioinformatika",
  module: "Sekuens & Evolusi",
  title: "BI7 · Filogenetika & k-mer: Pohon Kehidupan dari Data",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Virus punya silsilah",
      prose: [
        "Di ruang sidang, jaksa menunjukkan pohon filogenetik: virus HIV terdakwa bersarang di dalam klad virus korban — bukti transmisi yang dipakai di pengadilan nyata. Di sisi lain dunia, pohon SARS-CoV-2 yang diupdate harian melacak varian baru menyebar antar benua.",
        "Pohon filogenetik adalah silsilah yang direkonstruksi dari mutasi: makin mirip sekuens, makin dekat kekerabatan. Twist-nya: pohon di ruang sidang itu kuat bukan karena gambarnya meyakinkan — gambar pohon bisa dibuat untuk data apa pun. Kekuatannya ada pada angka yang menyertainya: bootstrap support dan model evolusi yang tepat. Pohon tanpa ukuran ketidakpastian = opini berbaju sains.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa gambar pohon saja tidak cukup sebagai bukti" },
        { id: "t2", text: "Sebutkan dua angka yang membuat pohon bisa dipercaya" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira pohon filogenetik = kebenaran evolusi yang pasti. Pohon adalah estimasi di bawah model dan data tertentu. Bootstrap di bawah 70 atau metode berbeda → pohon berbeda. Laporkan selalu: metode, model, bootstrap.",
      },
      reference: "Pohon = hipotesis evolusi. Baca klad, panjang cabang, bootstrap, outgroup.",
    },
    {
      id: "baca-pohon",
      eyebrow: "Langkah 2 · Membaca pohon",
      title: "Klad, cabang, bootstrap, outgroup",
      prose: [
        "Daun = sekuens saat ini; node dalam = leluhur; panjang cabang = jarak evolusi (substitusi per situs); klad = kelompok monofiletik (leluhur + semua keturunannya). Contoh: ((A,B),(C,D)) — A dan B bersaudara, C dan D bersaudara.",
        "Panjang cabang BUKAN waktu — ia = laju × waktu. Virus RNA bermutasi ~1.000x lebih cepat dari mamalia; cabang virus yang “panjang” bisa mewakili hitungan bulan. Outgroup (takson jauh) menentukan arah waktu: tanpa akar, tidak tahu mana leluhur mana keturunan.",
        "Bootstrap: bangun ulang pohon dari 1.000 resampling kolom alignment; cabang dengan bootstrap 98 = 98% resampling setuju cabang itu ada. Aturan: >90 percaya; 70–90 tentatif; <70 runtuhkan menjadi politomi. Jangan membuat klaim biologis dari cabang bootstrap 45.",
      ],
      formula: String.raw`d_{JC} = -\frac{3}{4} \ln\left(1 - \frac{4p}{3}\right)`,
      formulaNote: "Koreksi Jukes-Cantor: jarak mentah meremehkan evolusi jauh karena situs bisa bermutasi dua kali tapi terlihat satu beda.",
      tasks: [
        { id: "t1", text: "Pada pohon ((A,B),(C,D)), sebutkan siapa bersaudara dengan siapa" },
        { id: "t2", text: "Klad dengan bootstrap 52: apa yang kamu lakukan?" },
      ],
      reference: "Bootstrap >90 percaya · 70–90 tentatif · <70 runtuhkan.",
    },
    {
      id: "lab-upgma",
      eyebrow: "Langkah 3 · Lab",
      title: "UPGMA dari nol",
      prose: [
        "UPGMA: dari matriks jarak, gabungkan pasangan terdekat berulang, hitung jarak rata-rata ke klaster lain. Cepat, tapi mengasumsikan jam molekuler (laju mutasi sama di semua cabang).",
        "Virus A yang bermutasi 10x lebih cepat dari B akan ditempatkan salah oleh UPGMA (long-branch attraction). NJ tidak mengasumsikan jam → lebih robust; maximum likelihood dengan model laju-bervariasi → terbaik untuk kasus sulit.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi pencarian pasangan terdekat" },
        { id: "t2", text: "Lengkapi update jarak rata-rata ke klaster lain" },
        { id: "t3", text: "Bacalah pohon Newick yang terbentuk" },
      ],
      expected: "Pohon Newick: ((A,B),(C,D));",
      hints: [
        "Pasangan terdekat = min dari semua pasangan (jarak, a, b).",
        "Jarak klaster baru ke k = rata-rata d(a,k) dan d(b,k).",
        "Hapus a dan b dari daftar, tambahkan klaster baru.",
      ],
      code: {
        starter: `jarak = {('A','B'):0.2, ('A','C'):0.6, ('A','D'):0.7,\n         ('B','C'):0.6, ('B','D'):0.7, ('C','D'):0.3}\n\ndef d(x, y):\n    return jarak.get((x,y), jarak.get((y,x), 0))\n\nklaster = ['A','B','C','D']\npohon = {k:k for k in klaster}\nwhile len(klaster) > 1:\n    # TULIS KODEMU: cari pasangan (jarak, a, b) terdekat\n    pas = \n    _, a, b = pas\n    baru = f'({pohon[a]},{pohon[b]})'\n    print(f'gabung {a}+{b} (jarak {pas[0]}) -> {baru}')\n    # TULIS KODEMU: jarak rata-rata klaster baru ke klaster lain\n    for k in klaster:\n        if k not in (a,b):\n            jarak[(baru,k)] = \n    klaster = [k for k in klaster if k not in (a,b)] + [baru]\n    pohon[baru] = baru\nprint(f'Pohon Newick: {baru};')`,
        lockLines: 6,
        solution: `jarak = {('A','B'):0.2, ('A','C'):0.6, ('A','D'):0.7,\n         ('B','C'):0.6, ('B','D'):0.7, ('C','D'):0.3}\n\ndef d(x, y):\n    return jarak.get((x,y), jarak.get((y,x), 0))\n\nklaster = ['A','B','C','D']\npohon = {k:k for k in klaster}\nwhile len(klaster) > 1:\n    # TULIS KODEMU: cari pasangan (jarak, a, b) terdekat\n    pas = min(((d(a,b),a,b) for i,a in enumerate(klaster)\n               for b in klaster[i+1:]))\n    _, a, b = pas\n    baru = f'({pohon[a]},{pohon[b]})'\n    print(f'gabung {a}+{b} (jarak {pas[0]}) -> {baru}')\n    # TULIS KODEMU: jarak rata-rata klaster baru ke klaster lain\n    for k in klaster:\n        if k not in (a,b):\n            jarak[(baru,k)] = (d(a,k)+d(b,k))/2\n    klaster = [k for k in klaster if k not in (a,b)] + [baru]\n    pohon[baru] = baru\nprint(f'Pohon Newick: {baru};')`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "gabung A\\+B \\(jarak 0\\.2\\)", label: "gabungan pertama A+B", msg: "Pasangan terdekat = A,B (jarak 0.2). Cek min() atas semua pasangan." },
          { kind: "stdout_matches", task: "t3", pattern: "Pohon Newick: \\(\\(A,B\\),\\(C,D\\)\\);", label: "pohon Newick benar", msg: "Urutan gabung: A+B, lalu C+D, lalu keduanya. Cek update jarak rata-rata." },
        ],
      },
      reference: "UPGMA = gabung terdekat berulang. Asumsi jam molekuler — waspadai LBA.",
    },
    {
      id: "lab-kmer",
      eyebrow: "Langkah 4 · Lab",
      title: "Jarak k-mer tanpa alignment",
      prose: [
        "k-mer: potongan sekuens panjang k; profil k-mer = vektor hitungan. Jarak Euclidean antar profil ≈ jarak evolusi — tanpa alignment, tanpa DP O(n²).",
        "Untuk jutaan sekuens metagenomik, ini satu-satunya yang praktis (fondasi Kraken, Mash). Kasar ≠ tidak berguna: presisi yang dikorbankan sedikit, kecepatan yang didapat ribuan kali lipat.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `profil_kmer` (hitung tiap kata panjang k)" },
        { id: "t2", text: "Bandingkan jarak A-B, A-C, A-D untuk k=2,3,5" },
      ],
      expected: "d(A,B)=0 · d(A,C) kecil · d(A,D) besar, untuk semua k",
      hints: [
        "Geser jendela: s[i:i+k] untuk i in range(len(s)-k+1).",
        "Gabungkan kunci kedua profil: set(pa) | set(pb).",
        "Jarak = sqrt(jumlah kuadrat selisih hitungan).",
      ],
      code: {
        starter: `import math\n\ndef profil_kmer(s, k):\n    # TULIS KODEMU: dict kata -> hitungan\n    prof = {}\n    for i in range(len(s)-k+1):\n        w = \n        prof[w] = prof.get(w, 0) + 1\n    return prof\n\ndef jarak_kmer(a, b, k):\n    pa, pb = profil_kmer(a,k), profil_kmer(b,k)\n    semua = set(pa) | set(pb)\n    return math.sqrt(sum((pa.get(w,0)-pb.get(w,0))**2 for w in semua))\n\nA = 'ATGCGATCGATCGATCGATCG'\nB = 'ATGCGATCGATCGATCGATCG'\nC = 'ATGCGATCGTTCGATCGATCG'\nD = 'AAAAAAAAAAAAAAAAAAAAA'\nfor k in [2, 3, 5]:\n    print(f'k={k}: d(A,B)={jarak_kmer(A,B,k):.1f} '\n          f'd(A,C)={jarak_kmer(A,C,k):.1f} d(A,D)={jarak_kmer(A,D,k):.1f}')`,
        lockLines: 1,
        solution: `import math\n\ndef profil_kmer(s, k):\n    # TULIS KODEMU: dict kata -> hitungan\n    prof = {}\n    for i in range(len(s)-k+1):\n        w = s[i:i+k]\n        prof[w] = prof.get(w, 0) + 1\n    return prof\n\ndef jarak_kmer(a, b, k):\n    pa, pb = profil_kmer(a,k), profil_kmer(b,k)\n    semua = set(pa) | set(pb)\n    return math.sqrt(sum((pa.get(w,0)-pb.get(w,0))**2 for w in semua))\n\nA = 'ATGCGATCGATCGATCGATCG'\nB = 'ATGCGATCGATCGATCGATCG'\nC = 'ATGCGATCGTTCGATCGATCG'\nD = 'AAAAAAAAAAAAAAAAAAAAA'\nfor k in [2, 3, 5]:\n    print(f'k={k}: d(A,B)={jarak_kmer(A,B,k):.1f} '\n          f'd(A,C)={jarak_kmer(A,C,k):.1f} d(A,D)={jarak_kmer(A,D,k):.1f}')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "k=3: d\\(A,B\\)=0\\.0", label: "d(A,B)=0 untuk k=3", msg: "Sekuens identik → profil sama → jarak 0. Cek slicing s[i:i+k]." },
          { kind: "stdout_matches", task: "t2", pattern: "d\\(A,D\\)=\\d+\\.\\d", label: "d(A,D) besar tercetak", msg: "A vs D (semua-A) harus jauh. Cek penggabungan kunci profil." },
        ],
      },
      reference: "k-mer = kemiripan tanpa alignment. Fondasi Kraken/Mash/assembler.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Wabah di RS: transmisi atau kebetulan?",
      prose: [
        "5 pasien ICU terinfeksi bakteri sama dalam 2 minggu. Manajemen curiga transmisi nosokomial. Sekuensing 5 genom bakteri; pohon menunjukkan 4 genom membentuk klad rapat (beda 2–5 SNP), 1 genom jauh (beda 200 SNP, klad lain). Bootstrap klad-4 = 99.",
        "Interpretasi: 4 kasus = transmisi terkait (klaster klonal; ambang tipikal <10 SNP) — investigasi PPI: tangan petugas, alat, ruangan. 1 kasus = infeksi komunitas kebetulan, bukan bagian wabah.",
        "Tindakan: fokus pada 4 (isolasi kohort, audit kebersihan), bukan lockdown seluruh ICU. Tanpa pohon, kelimanya diperlakukan sama — buang sumber daya + panik. Filogenetika mengubah “5 kasus” menjadi “1 wabah + 1 sporadis”.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa 4 genom = satu wabah dan 1 genom = sporadis" },
        { id: "t2", text: "Tulis tindakan yang berbeda untuk kedua kelompok" },
      ],
      reference: "Ambang klonal tipikal <10 SNP. Pohon = presisi intervensi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Metode apa untuk pertanyaan apa",
      prose: [
        "Eksplorasi cepat atau ribuan sekuens → NJ atau k-mer. Cepat; cukup untuk hipotesis awal. Contoh: clustering 10.000 genom bakteri.",
        "Klaim evolusi untuk publikasi → maximum likelihood + bootstrap. Prinsipil; ketidakpastian terkuantifikasi. Contoh: asal-usul varian virus baru.",
        "Cari domain protein jauh (<30% identitas) → profil HMM (Pfam). HMM menangkap pola posisi-spesifik; BLAST gagal di twilight zone.",
        "Data metagenomik besar (jutaan read) → k-mer classifier (Kraken). Alignment per read mustahil; k-mer praktis.",
        "Aturan 10 detik: baca klad + panjang cabang + bootstrap; outgroup untuk akar; bootstrap <70 = runtuhkan; NJ untuk cepat, ML untuk klaim; k-mer untuk skala; HMM untuk pola jauh.",
      ],
      tasks: [
        { id: "t1", text: "Untuk pohon publikasi asal varian baru, pilih metodenya" },
        { id: "t2", text: "Untuk klasifikasi 10 juta read metagenomik, pilih metodenya" },
      ],
      reference: "NJ cepat · ML untuk klaim · HMM untuk homologi jauh · k-mer untuk skala.",
    },
    {
      id: "adv-model-substitusi",
      eyebrow: "Langkah 7 · Advanced",
      title: "Model substitusi: dari JC69 sampai GTR+G+I",
      prose: [
        "Jarak genetik mentah (proporsi beda) selalu meremehkan evolusi sebenarnya: satu situs bisa bermutasi dua kali tapi terlihat hanya satu beda (atau kembali seperti semula). Model substitusi mengoreksi ini. JC69 (Jukes-Cantor) adalah yang paling sederhana: semua substitusi sama mungkin, frekuensi basa sama — 0 parameter bebas. Di ujung lain ada GTR+G+I: 6 laju substitusi berbeda + frekuensi basa tak seimbang + variasi laju antar situs (Gamma) + proporsi situs invarian — model paling kaya untuk DNA.",
        "Di antaranya ada HKY (membedakan transisi vs transversi + frekuensi basa tak seimbang) — sering cukup untuk data mitokondria atau virus yang kecil. Trade-off-nya klasik: model terlalu sederhana → bias (jarak diremehkan, topologi bisa salah); model terlalu kaya → varians (parameter diestimasi dari data sedikit menjadi noise). Untuk alignment > 1 kb, GTR+G adalah default yang aman; untuk < 500 basa, pertimbangkan model lebih sederhana.",
        "Pemilihan model tidak ditebak — diuji. Tool seperti ModelFinder (di IQ-TREE) atau jModelTest membandingkan puluhan model dengan kriteria informasi (BIC/AIC) dan memilih yang terbaik untuk datamu. Praktik publikasi yang benar: laporkan model terpilih (“GTR+G, dipilih via BIC”) — pohon tanpa model yang dilaporkan tidak bisa direproduksi.",
        "Mode kegagalan: memakai JC69 untuk sekuens dengan bias komposisi ekstrem (mis. genom AT-rich Plasmodium, ~80% AT) — asumsi “frekuensi basa sama” runtuh total dan jarak menjadi sampah. Kenali datamu dulu: cek komposisi basa sebelum memilih model.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan trade-off model terlalu sederhana vs terlalu kaya untuk pohon" },
        { id: "t2", text: "Kenapa JC69 berbahaya untuk genom AT-rich seperti Plasmodium?" },
      ],
      reference: "JC69 = 0 parameter · GTR+G+I = paling kaya · pilih via BIC/AIC · laporkan model di publikasi.",
    },
    {
      id: "adv-bootstrap-lba",
      eyebrow: "Langkah 8 · Advanced",
      title: "Bootstrap vs posterior, dan jebakan long-branch attraction",
      prose: [
        "Dua angka kepercayaan yang berbeda makna. Bootstrap (Felsenstein): resample kolom alignment 100–1.000x, hitung % pohon yang mempertahankan klad — ≥ 70% dianggap dukungan moderat, ≥ 95% kuat. Ia mengukur ketahanan terhadap sampling data. Posterior Bayesian (MrBayes/BEAST): probabilitas klad benar DENGAN ASUMSI model benar — ≥ 0,95 dianggap kuat. Posterior cenderung lebih “percaya diri” daripada bootstrap; keduanya dilaporkan, tidak dicampuraduk.",
        "Long-branch attraction (LBA) adalah artefak paling terkenal: dua garis keturunan yang berevolusi cepat (cabang panjang) dikelompokkan bersama secara artifak — bukan karena berkerabat, melainkan karena keduanya mengakumulasi banyak perubahan acak yang kebetulan sama (homoplasi). Contoh klasik: microsporidia (parasit berevolusi cepat) pernah ditempatkan di dasar eukariota karena LBA; dengan model lebih baik dan takson tambahan, posisinya terkoreksi ke dalam fungi.",
        "Cara mendeteksi dan melawan LBA: (1) tambah takson untuk “memecah” cabang panjang — sampling takson sering lebih manjur daripada menambah gen; (2) pakai model yang mengakomodasi variasi laju (GTR+G, bukan JC69); (3) uji sensitivitas: buang takson cabang-panjang, apakah topologi berubah? Jika ya, curigai artefak. (4) Waspadai klad dengan cabang sangat panjang + bootstrap “kuat” — bootstrap bisa kuat mendukung artefak.",
        "Aturan praktisi: pohon untuk publikasi memakai maximum likelihood (IQ-TREE/RAxML) atau Bayesian dengan model teruji, bootstrap ≥ 100 replikasi, dan outgroup yang tepat untuk rooting. Pohon UPGMA/neighbor-joining cukup untuk eksplorasi cepat — tidak untuk klaim evolusi di naskah.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan mekanisme long-branch attraction dan dua cara melawannya" },
        { id: "t2", text: "Bedakan makna bootstrap 95% vs posterior 0,95" },
      ],
      reference: "Bootstrap = ketahanan sampling · posterior = keyakinan dgn asumsi model · LBA: pecah cabang panjang.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Delapan pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: pohon adalah argumen, bukan gambar",
        body: "Tiga heuristik filogenetika dari praktisi. Pertama, perlakukan setiap pohon sebagai argumen yang bisa diserang: tanya “asumsi apa yang menopang klad ini?” — model substitusi, alignment, sampling takson, dan rooting. Pohon tanpa bootstrap/posterior adalah ilustrasi, bukan bukti. Kedua, ingat asimetri bukti: satu pohon yang baik tidak membuktikan sejarah evolusi, tapi satu artefak (LBA, misalignment, kontaminasi) cukup untuk meruntuhkannya. Alokasikan skeptisismu ke titik-titik rapuh: cabang sangat panjang, klad dengan dukungan 50–70%, dan takson tunggal yang “aneh”. Ketiga, sampling takson mengalahkan data: menambah 10 takson yang memecah cabang panjang sering memperbaiki topologi lebih dramatis daripada menambah 10.000 basa. Sebelum menyalahkan model, tanya apakah takson kuncinya sudah disampling. Keempat — untuk kerja lapangan: untuk pertanyaan “apakah ini satu wabah?”, yang dibutuhkan bukan pohon sempurna melainkan ambang SNP yang dikalibrasi + metadata epidemiologi; filogenetika adalah alat, bukan tujuan.",
      },
      summary: [
        "Pohon = hipotesis evolusi: baca klad, cabang, bootstrap, outgroup.",
        "NJ cepat; ML prinsipil untuk klaim; parsimoni = hemat.",
        "Koreksi jarak (Jukes-Cantor) untuk substitusi ganda.",
        "k-mer: kemiripan tanpa alignment — skala metagenomik.",
        "HMM: pola posisi-spesifik untuk homologi jauh.",
        "Bootstrap <70 = runtuhkan; satu gen ≠ sejarah spesies.",
      ],
      next: { label: "BI8 · Pipeline NGS", href: "/learn/bi8-ngs-pipeline" },
      quiz: [
        {
          q: "Pohon menempatkan dua parasit berevolusi cepat sebagai saudara dengan bootstrap 98%. Kecurigaan utama?",
          options: [
            { text: "Pasti benar — bootstrap 98% sangat kuat", why: "Bootstrap kuat bisa mendukung artefak; ia mengukur ketahanan sampling, bukan kebenaran." },
            { text: "Long-branch attraction: cabang panjang tertarik oleh homoplasi acak", why: "Dua cabang panjang + pengelompokan bersama = pola klasik LBA. Uji: tambah takson pemecah, pakai GTR+G.", correct: true },
            { text: "Outgroup salah pilih", why: "Outgroup memengaruhi rooting, bukan pengelompokan dua cabang panjang bersama." },
            { text: "Alignment terlalu panjang", why: "Panjang alignment bukan penyebab artefak ini." },
          ],
        },
        {
          q: "Untuk publikasi, kamu memilih model substitusi dengan…",
          options: [
            { text: "Selalu GTR+G+I karena paling kaya", why: "Model terkaya belum tentu terbaik — parameter berlebih = varians pada data kecil." },
            { text: "Selalu JC69 karena paling sederhana", why: "Terlalu sederhana untuk data dengan bias komposisi atau laju tak seragam." },
            { text: "Kriteria informasi (BIC/AIC) via ModelFinder/jModelTest pada data sendiri", why: "Pemilihan model berbasis data + dilaporkan di naskah = praktik reproduksibel.", correct: true },
            { text: "Model yang dipakai paper tetangga", why: "Model harus cocok dengan DATAMU, bukan dengan kebiasaan lab sebelah." },
          ],
        },
        {
          q: "Naskah mengklaim sejarah evolusi berdasarkan pohon UPGMA tanpa bootstrap. Kelemahan utamanya?",
          options: [
            { text: "Tidak ada — UPGMA adalah standar publikasi", why: "UPGMA mengasumsikan jam molekuler ketat dan ultrametrik — jarang terpenuhi; bukan standar klaim evolusi." },
            { text: "UPGMA mengasumsikan laju evolusi sama di semua cabang + tanpa ukuran dukungan", why: "Untuk publikasi: maximum likelihood/Bayesian + model teruji (BIC) + bootstrap/posterior.", correct: true },
            { text: "UPGMA terlalu lambat", why: "UPGMA justru cepat — masalahnya asumsi, bukan kecepatan." },
            { text: "UPGMA tidak bisa me-root pohon", why: "Bisa me-root (ultrametrik); masalahnya validitas asumsi dan klaimnya." },
          ],
        },
        {
          q: "Bootstrap 95 pada suatu node artinya…",
          options: [
            { text: "95% mutasi benar", why: "Bootstrap tidak menilai kebenaran tiap mutasi." },
            { text: "95% pohon resampling mendukung klad itu — keyakinan tinggi", why: "Ukuran dukungan, bukan kebenaran mutlak. <70 = jangan percaya kladnya.", correct: true },
            { text: "95 basa mendukung", why: "Bukan hitungan basa; ini proporsi pohon resampling." },
            { text: "Pohon 95% benar", why: "Tidak ada metrik “persen benar” untuk pohon." },
          ],
        },
        {
          q: "UPGMA gagal ketika…",
          options: [
            { text: "Data sedikit", why: "Jumlah data bukan masalah utamanya." },
            { text: "Laju mutasi tidak seragam antar cabang (jam molekuler rusak)", why: "Asumsi jam molekuler. Long-branch attraction menempatkan cabang cepat secara salah. Pakai NJ/ML.", correct: true },
            { text: "Sekuens pendek", why: "Sekuens pendek masalah untuk semua metode, bukan spesifik UPGMA." },
            { text: "Selalu gagal", why: "UPGMA baik-baik saja bila asumsi jam terpenuhi." },
          ],
        },
        {
          q: "Fungsi outgroup dalam pohon?",
          options: [
            { text: "Hiasan", why: "Outgroup punya peran teknis penting." },
            { text: "Mengakar pohon — menentukan arah waktu evolusi", why: "Tanpa akar, tidak tahu mana leluhur mana keturunan.", correct: true },
            { text: "Mempercepat komputasi", why: "Tidak ada efek pada kecepatan." },
            { text: "Tidak ada", why: "Ada: menentukan akar dan arah waktu." },
          ],
        },
        {
          q: "Profil HMM (Pfam) mengalahkan BLAST ketika…",
          options: [
            { text: "Sekuens identik", why: "Untuk identik, BLAST sudah cukup dan lebih cepat." },
            { text: "Homologi jauh (<30% identitas) — pola posisi-spesifik masih terdeteksi", why: "HMM memakai konservasi per posisi, bukan identitas global. Twilight zone = habitat HMM.", correct: true },
            { text: "Tidak pernah", why: "HMM standar untuk anotasi domain jauh." },
            { text: "Database kecil", why: "Ukuran database bukan penentunya." },
          ],
        },
        {
          q: "Transfer gen horizontal pada bakteri menyebabkan…",
          options: [
            { text: "Tidak ada masalah", why: "Ada: sejarah satu gen bisa beda dari sejarah spesies." },
            { text: "Pohon satu gen bisa beda dari sejarah spesies — butuh banyak gen", why: "Gen melompat antar spesies. Phylogenomics (banyak gen) untuk klaim spesies.", correct: true },
            { text: "Pohon selalu benar", why: "Justru menjadi tidak bisa dipercaya untuk klaim spesies." },
            { text: "Mutasi berhenti", why: "Tidak ada hubungan dengan berhentinya mutasi." },
          ],
        },
      ],
    },
  ],
};
