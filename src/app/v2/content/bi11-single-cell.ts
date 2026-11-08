import type { V2Lesson } from "../lib/types";

export const bi11: V2Lesson = {
  slug: "bi11-single-cell",
  track: "Bioinformatika",
  module: "Omics Lanjutan",
  title: "BI11 · Single-Cell RNA-seq: Seurat, UMAP & Trajectory",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Smoothie vs buah potong",
      prose: [
        "Bulk RNA-seq seperti membuat smoothie dari sekeranjang buah lalu menebak komposisinya dari rasa. Single-cell seperti memotong tiap buah dan mencicipi satu per satu: “oh, ada 3 apel, 2 jeruk, dan 1 buah aneh yang belum pernah kulihat!”",
        "Buah aneh itu = tipe sel langka yang tak terlihat di bulk — mis. sel punca kanker 0,1% yang menyebabkan kekambuhan. Menemukannya mengubah protokol terapi.",
        "Twist-nya: single-cell punya cara menipu yang baru. Dropout — gen yang tidak terdeteksi padahal aktif — membuat nol di matriks ≠ nol di sel. Bulk menyembunyikan lewat rata-rata; single-cell bisa menipu lewat ketidakhadiran palsu. Teknologi yang membuka heterogenitas menuntut skeptisisme yang juga baru.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa sel 0,1% tak terlihat di bulk RNA-seq" },
        { id: "t2", text: "Jelaskan apa itu dropout dan kenapa menipu" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira klaster = tipe sel yang pasti. Klaster adalah hasil algoritma + parameter (resolusi!). Ia bisa = tipe sel, state sel, batch, atau doublet. Anotasi butuh marker + referensi + validasi.",
      },
      reference: "scRNA-seq = heterogenitas per sel. Nol di matriks ≠ nol di sel (dropout).",
    },
    {
      id: "lab-qc",
      eyebrow: "Langkah 2 · Lab",
      title: "QC sel: buang 30% sampah itu normal",
      prose: [
        "Tiap barcode = satu sel (harusnya). QC menyaring: droplet kosong (nFeature rendah), sel mati/stres (%MT tinggi — mitokondria bocor), doublet (2 sel 1 droplet — nFeature ganda).",
        "Filter tipikal: nFeature 200–2500, %MT < 10%. Dari 10.000 barcode → ~7.000 sel bersih. 30% sampah dibuang SEBELUM analisis — normal!",
      ],
      tasks: [
        { id: "t1", text: "Terapkan filter QC: 200 ≤ nFeature ≤ 2500 dan %MT < 10" },
        { id: "t2", text: "Hitung dan cetak yang lolos vs terbuang" },
      ],
      expected: "total 3000 · lolos ~70% · terbuang ~30%",
      hints: [
        "Filter: [s for s in sel if 200 <= s[0] <= 2500 and s[2] < 10].",
        "s[0] = nFeature, s[2] = %MT.",
        "Persentase = lolos/total dengan format :.0%.",
      ],
      code: {
        starter: `import random\nrandom.seed(2024)\nsel = []\nfor i in range(3000):\n    r = random.random()\n    if r < 0.15:\n        nf, nc, mt = random.randint(20,150), random.randint(50,400), random.uniform(0,5)\n    elif r < 0.25:\n        nf, nc, mt = random.randint(300,800), random.randint(500,2000), random.uniform(15,40)\n    elif r < 0.30:\n        nf, nc, mt = random.randint(3000,6000), random.randint(8000,20000), random.uniform(2,8)\n    else:\n        nf, nc, mt = random.randint(500,2200), random.randint(1500,7000), random.uniform(1,9)\n    sel.append((nf, nc, mt))\n\n# TULIS KODEMU: filter QC\nlolos = \nprint(f'total barcode : {len(sel)}')\nprint(f'lolos QC      : {len(lolos)} ({len(lolos)/len(sel):.0%})')\nprint(f'terbuang      : {len(sel)-len(lolos)} (kosong/mati/doublet)')`,
        lockLines: 12,
        solution: `import random\nrandom.seed(2024)\nsel = []\nfor i in range(3000):\n    r = random.random()\n    if r < 0.15:\n        nf, nc, mt = random.randint(20,150), random.randint(50,400), random.uniform(0,5)\n    elif r < 0.25:\n        nf, nc, mt = random.randint(300,800), random.randint(500,2000), random.uniform(15,40)\n    elif r < 0.30:\n        nf, nc, mt = random.randint(3000,6000), random.randint(8000,20000), random.uniform(2,8)\n    else:\n        nf, nc, mt = random.randint(500,2200), random.randint(1500,7000), random.uniform(1,9)\n    sel.append((nf, nc, mt))\n\n# TULIS KODEMU: filter QC\nlolos = [s for s in sel if 200 <= s[0] <= 2500 and s[2] < 10]\nprint(f'total barcode : {len(sel)}')\nprint(f'lolos QC      : {len(lolos)} ({len(lolos)/len(sel):.0%})')\nprint(f'terbuang      : {len(sel)-len(lolos)} (kosong/mati/doublet)')`,
        checks: [
          { kind: "defined", task: "t1", name: "lolos", label: "`lolos` terdefinisi", msg: "Buat list lolos dengan filter nFeature dan %MT." },
          { kind: "stdout_matches", task: "t2", pattern: "lolos QC\\s+: 2\\d{3}", label: "~2.100 sel lolos", msg: "Dengan seed 2024, sekitar 70% lolos. Cek ambang 200–2500 dan %MT<10." },
          { kind: "stdout_matches", task: "t2", pattern: "terbuang\\s+: \\d+ \\(kosong/mati/doublet\\)", label: "ringkasan terbuang tercetak", msg: "Cetak jumlah terbuang dengan format seperti contoh." },
        ],
      },
      reference: "QC: nFeature 200–2500, %MT<10, doublet via DoubletFinder/scrublet.",
    },
    {
      id: "lab-kmeans",
      eyebrow: "Langkah 3 · Lab",
      title: "Clustering k-means dari nol",
      prose: [
        "Simulasi 3 tipe sel lewat 2 gen marker (CD3D, CD79A). Jalankan k-means k=3 dari nol: tetapkan ke centroid terdekat, hitung ulang centroid, ulangi.",
        "Lalu evaluasi: apakah klaster = tipe asli? Klaster ~ tipe asli bila marker kuat. Anotasi = beri nama berdasarkan marker dominan.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi langkah penetapan ke centroid terdekat" },
        { id: "t2", text: "Lengkapi update centroid" },
        { id: "t3", text: "Evaluasi komposisi tiap klaster" },
      ],
      expected: "klaster 0 ~ T · klaster 1 ~ B · klaster 2 ~ Mono",
      hints: [
        "Jarak kuadrat: (x-cx)**2 + (y-cy)**2; pilih j minimum.",
        "Centroid baru = rata-rata x dan y anggota klaster.",
        "Ulangi 20 iterasi agar konvergen.",
      ],
      code: {
        starter: `import random, statistics as st\nrandom.seed(11)\ntipe = {'T': (10, 1), 'B': (1, 10), 'Mono': (4, 4)}\ndata = []\nfor t, (m1, m2) in tipe.items():\n    for _ in range(100):\n        data.append((t, random.gauss(m1,1.5), random.gauss(m2,1.5)))\ncent = [(12,1),(1,12),(4,4)]\nfor _ in range(20):\n    kl = [[] for _ in range(3)]\n    for t,x,y in data:\n        # TULIS KODEMU: indeks centroid terdekat\n        j = \n        kl[j].append((t,x,y))\n    # TULIS KODEMU: centroid baru = rata-rata anggota\n    cent = \nprint('klaster -> komposisi tipe asli:')\nfor j, c in enumerate(kl):\n    hit = {}\n    for t,_,_ in c: hit[t] = hit.get(t,0)+1\n    print(f'  klaster {j}: {hit}')`,
        lockLines: 8,
        solution: `import random, statistics as st\nrandom.seed(11)\ntipe = {'T': (10, 1), 'B': (1, 10), 'Mono': (4, 4)}\ndata = []\nfor t, (m1, m2) in tipe.items():\n    for _ in range(100):\n        data.append((t, random.gauss(m1,1.5), random.gauss(m2,1.5)))\ncent = [(12,1),(1,12),(4,4)]\nfor _ in range(20):\n    kl = [[] for _ in range(3)]\n    for t,x,y in data:\n        # TULIS KODEMU: indeks centroid terdekat\n        j = min(range(3), key=lambda j: (x-cent[j][0])**2+(y-cent[j][1])**2)\n        kl[j].append((t,x,y))\n    # TULIS KODEMU: centroid baru = rata-rata anggota\n    cent = [(st.mean(p[1] for p in c), st.mean(p[2] for p in c)) for c in kl]\nprint('klaster -> komposisi tipe asli:')\nfor j, c in enumerate(kl):\n    hit = {}\n    for t,_,_ in c: hit[t] = hit.get(t,0)+1\n    print(f'  klaster {j}: {hit}')`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "klaster 0: \\{'T': \\d+", label: "klaster 0 didominasi T", msg: "Dengan marker kuat, klaster 0 harus mayoritas sel T." },
          { kind: "stdout_matches", task: "t3", pattern: "klaster 1: \\{'B': \\d+", label: "klaster 1 didominasi B", msg: "Klaster 1 harus mayoritas sel B." },
        ],
      },
      reference: "k-means: tetapkan → hitung ulang → ulangi. Anotasi via marker dominan.",
    },
    {
      id: "alur",
      eyebrow: "Langkah 4 · Alur analisis",
      title: "HVG → PCA → klaster → UMAP → anotasi",
      prose: [
        "Alur standar Seurat/Scanpy: pilih ~2.000 gen paling variabel (HVG, buang noise) → PCA (50 komponen) → graf tetangga → clustering Louvain/Leiden → visualisasi UMAP → anotasi klaster via gen marker (CD3D+ = T cell, CD79A+ = B cell, CD14+ = monosit). Validasi dengan referensi (Azimuth/SingleR) + literatur.",
        "Resolusi clustering adalah parameter, bukan kebenaran: naikkan hingga tiap klaster punya marker biologis yang jelas; berhenti sebelum menjadi noise. Klaster kecil (0,5%) bisa jadi doublet atau tipe langka — investigasi, jangan langsung buang atau langsung klaim “novel”.",
        "Arah baru: trajectory/pseudotime (Monocle, Slingshot) mengurutkan sel sepanjang diferensiasi dari snapshot statis — tapi pseudotime = inferensi, bukan jam; butuh validasi (RNA velocity, eksperimen). Spatial transcriptomics menambah POSISI: ekspresi gen + peta jaringan.",
      ],
      tasks: [
        { id: "t1", text: "Urutkan 6 tahap alur standar scRNA-seq" },
        { id: "t2", text: "Jelaskan kenapa pseudotime bukan waktu nyata" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira UMAP yang bagus = analisis yang benar. UMAP cantik bisa menutupi QC buruk — doublet jadi “klaster novel”! Urutan: QC ketat → analisis → UMAP sebagai visualisasi, bukan validasi. Jangan tune parameter demi UMAP indah.",
      },
      reference: "QC → HVG → PCA → klaster → UMAP → anotasi marker. Resolusi = parameter.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: parameter dan klaim apa di scRNA-seq?",
      prose: [
        "Lima skenario yang dihadapi bioinformatikawan:",
        "Skenario 1 — Menentukan filter QC sel. → 200 ≤ nFeature ≤ 2500 dan %MT < 10 — lalu sesuaikan per jaringan. Alasan: doublet punya nFeature tinggi, sel sekarat %MT tinggi; tapi kardiomiosit sehat pun %MT tinggi. Contoh nyata: filter buta membuang separuh neuron yang valid.",
        "Skenario 2 — Memilih resolusi clustering. → Naikkan sampai tiap klaster punya marker biologis jelas; berhenti sebelum menjadi noise. Alasan: resolusi adalah parameter, bukan kebenaran. Contoh nyata: 12 klaster dengan marker vs 30 klaster tanpa cerita.",
        "Skenario 3 — Klaster kecil 0,5% tanpa marker jelas. → Curigai doublet dulu sebelum klaim tipe sel langka. Alasan: doublet dua tipe sel meniru “tipe baru” dengan sempurna. Contoh nyata: “progenitor hibrida” yang runtuh setelah skor doublet.",
        "Skenario 4 — Sel mengekspresikan marker T-cell DAN B-cell sekaligus. → Curigai doublet DULU; verifikasi dengan skor doublet (Scrublet/DoubletFinder) + nFeature; hapus HANYA bila bukti mendukung. Alasan: satu sel sejati jarang mengekspresikan program dua lineage penuh — TAPI marker ganda saja BUKAN diagnosis: bisa juga sel stres, artefak ambient RNA, atau subpopulasi langka yang sebenarnya. “Diagnosis: doublet” tanpa skor doublet = tebakan. Contoh nyata: klaster “ganda” yang hilang setelah filtering doublet — dan sebaliknya, klaster ganda yang BERTAHAN setelah skor doublet rendah dan butuh validasi eksperimental.",
        "Skenario 5 — Mengklaim urutan diferensiasi dari pseudotime. → Sajikan sebagai urutan, bukan waktu nyata; validasi dengan eksperimen. Alasan: pseudotime mengurutkan kemiripan transkripsional, bukan jam biologis. Contoh nyata: trajectory yang “terbalik” setelah validasi lineage tracing.",
        "Aturan praktis 10 detik: QC dulu, klaster secukupnya, klaster kecil = curigai doublet, UMAP untuk melihat bukan untuk mengukur."
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengumumkan “tipe sel baru” dari satu klaster tanpa validasi marker independen — doublet dan artefak batch adalah penjelasan default yang harus digugurkan dulu dengan tiga bukti: marker, replikasi, dan biologi.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "“Tipe sel baru” yang ternyata doublet",
      prose: [
        "Paper mengklaim tipe sel imun BARU dari scRNA-seq: klaster kecil (1%) mengekspresikan marker T cell DAN B cell bersamaan. Media heboh. Kamu diminta replikasi.",
        "Cekmu: nFeature klaster itu 2x median; tidak ada validasi doublet; tidak ada konfirmasi eksperimental (FACS/RNA-FISH). Putusan: kemungkinan besar doublet T+B (marker ganda + nFeature tinggi = tanda klasik), bukan biologi baru.",
        "Bukti yang dibutuhkan untuk klaim “novel”: skor doublet rendah via 2 metode independen; replikasi di dataset independen; validasi eksperimental (FACS + qPCR, atau spatial). Klaster kecil + marker ganda = doublet sampai terbukti bukan. Klaim luar biasa butuh bukti luar biasa.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan dua tanda doublet pada kasus ini" },
        { id: "t2", text: "Sebutkan tiga bukti yang dibutuhkan untuk klaim tipe sel baru" },
      ],
      reference: "Doublet = marker ganda + nFeature tinggi. Validasi: 2 metode + independen + eksperimental.",
    },
    {
      id: "adv-qc-sel",
      eyebrow: "Langkah 7 · Advanced",
      title: "QC sel: doublet, ambient RNA, dan mitokondria",
      prose: [
        "Tiga artefak yang merusak analisis single-cell bila lolos QC. Pertama, doublet: dua sel masuk ke satu droplet dan terbaca sebagai satu “sel” hibrida. Laju doublet naik dengan throughput — sekitar 0,8% per 1.000 sel yang ditargetkan (platform 10x: ~8% pada 10.000 sel). Doublet meniru “tipe sel baru” atau “transisi”: klaster kecil yang mengekspresikan marker dua lineage sekaligus adalah tersangka utama. Deteksinya: Scrublet/DoubletFinder mensimulasikan doublet artifisial dan menandai sel yang mirip dengannya.",
        "Kedua, ambient RNA (“soup”): RNA bebas dari sel yang pecah mengontaminasi semua droplet — gen yang sangat terekspresi di satu tipe sel bocor ke semua sel. Efeknya: marker tampak “sedikit terekspresi di mana-mana”, mengaburkan batas klaster. Koreksinya: SoupX/decontX mengestimasi profil soup dari droplet kosong dan mengurangkannya. Waspadai sampel dengan viabilitas rendah (< 80%): soup-nya tebal.",
        "Ketiga, %MT (persen read mitokondria): sel sekarat/stressed bocor sitoplasma tapi mitokondria tertinggal — %MT tinggi menandai sel rusak. Ambang standar 10% adalah titik awal, bukan hukum: kardiomiosit dan hepatosit sehat memang bermitokondria tinggi (bisa 20–30%), sementara neuron sensitif. Aturan: tetapkan ambang per jaringan berdasarkan distribusi datamu (median + 3×MAD), bukan angka impor dari tutorial.",
        "Urutan QC yang benar: filter sel kosong/rusak → deteksi doublet → koreksi ambient → baru clustering. Membalik urutan (clustering dulu, QC kemudian) berarti artefak sudah membentuk klaster “palsu” yang analis terlanjur beri nama dan interpretasi. Biaya memperbaiki klaster palsu di tahap naskah — re-analisis, re-anotasi, re-plot — berkali-kali lipat dibanding menangkapnya di QC; pipeline profesional selalu punya checkpoint QC berambang eksplisit sebelum satu pun klaster diberi nama.",
      ],
      tasks: [
        { id: "t1", text: "Klaster kecil mengekspresikan marker T-cell DAN B-cell sekaligus. Diagnosis dan verifikasinya?" },
        { id: "t2", text: "Jelaskan kenapa ambang %MT 10% tidak boleh dipakai buta untuk semua jaringan" },
      ],
      reference: "Doublet ~0,8%/1k sel · soup dari sel pecah · %MT per jaringan · QC sebelum clustering.",
    },
    {
      id: "adv-klaster-anotasi",
      eyebrow: "Langkah 8 · Advanced",
      title: "Resolusi clustering dan anotasi yang tidak mengarang",
      prose: [
        "Parameter resolution (Louvain/Leiden) mengontrol kehalusan klaster: sebagai TITIK AWAL yang umum dipakai, 0,4–0,6 sering memberi klaster kasar setingkat tipe sel mayor dan 0,8–1,2 memecah lebih halus — TAPI rentang ini BUKAN level biologis: angka yang sama bisa memberi hasil berbeda di dataset lain (tergantung jumlah sel, kedalaman sekuensing, dan struktur biologinya). Tidak ada resolution yang “benar” — yang ada hanyalah yang didukung marker. Overclustering (resolution terlalu tinggi) memecah satu tipe sel menjadi 5 klaster tanpa perbedaan marker yang meyakinkan; underclustering menggabungkan subtipe fungsional berbeda. Praktik yang benar: coba 2–3 resolution, lalu pilih yang tiap klasternya punya marker gen yang jelas dan konsisten.",
        "Anotasi tipe sel adalah klaim yang butuh bukti berlapis: (1) marker gen kanonis dari literatur (CD3D untuk T-cell, MS4A1/CD20 untuk B-cell) yang terekspresi spesifik di klaster; (2) anotasi otomatis (CellTypist, SingleR) sebagai pembanding independen — bila manual dan otomatis sepakat, keyakinan naik; (3) validasi ortogonal untuk klaim baru (imunofluoresens, FACS, atau literatur). Klaster tanpa marker yang meyakinkan bukan “tipe sel baru” — ia artefak, doublet yang lolos, atau batch.",
        "Dua jebakan visualisasi: jarak antar-klaster di UMAP tidak bermakna kuantitatif (UMAP mengorbankan jarak global demi struktur lokal) — jangan klaim “klaster A lebih mirip B daripada C” dari posisi gambar. Dan pseudotime/trajectory (Monocle, scVelo) mengurutkan sel sepanjang gradien transkripsi — ia BUKAN waktu nyata tanpa validasi eksperimental (pulse-chase, lineage tracing).",
        "Aturan keputusan: klaim tipe sel baru butuh tiga hal — marker spesifik, replikasi di sampel independen, dan validasi ortogonal. Dua dari tiga = hipotesis menarik. Satu dari tiga = jangan dipublikasikan.",
      ],
      tasks: [
        { id: "t1", text: "Resolution 1,5 menghasilkan 22 klaster tanpa marker jelas. Diagnosis dan perbaikannya?" },
        { id: "t2", text: "Sebutkan tiga bukti yang dibutuhkan sebelum mengklaim tipe sel baru" },
      ],
      reference: "Resolution = titik awal 0,4–1,2 (bukan level biologis) · marker kanonis + anotasi otomatis · UMAP ≠ jarak · pseudotime ≠ waktu.",
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
        title: "Intuisi: sel tunggal = mikroskop yang berisik",
        body: "Tiga heuristik analis single-cell. Pertama, ingat resolusinya: satu sel hanya menangkap 10–20% molekul mRNA-nya (dropout) — nol di matriks bukan berarti gen mati, melainkan gen tak tertangkap. Bedakan “tidak terekspresi” dari “tidak terdeteksi” sebelum membuat klaim biologi; gen yang penting bisa dropout di 80% selnya. Kedua, artefak dulu, biologi kemudian: setiap klaster “menarik” harus lolos interogasi — doublet? batch? soup? %MT? Klaster yang hanya muncul di satu batch BELUM tentu penemuan — ia BISA efek batch yang diberi nama, tapi bisa juga subpopulasi nyata yang kebetulan hanya ada di sampel itu; verifikasi dulu (apakah ia hilang setelah integrasi batch? adakah di sampel independen? punya marker?) sebelum klaim ke arah mana pun. Ketiga, anotasi adalah argumen multi-bukti: marker kanonis + anotator otomatis + (untuk klaim baru) validasi ortogonal. Satu bukti = hipotesis; tiga bukti = temuan. Keempat — nasihat dari lapangan: untuk naskah, simpan objek Seurat/AnnData berversi + seed + versi paket; reviewer single-cell adalah spesies yang teliti dan akan meminta reproduksi.",
      },
      summary: [
        "scRNA-seq = heterogenitas per sel; bulk = rata-rata.",
        "QC: nFeature, nCount, %MT, doublet — buang 30% sampah itu normal.",
        "Alur: HVG → PCA → Louvain/Leiden → UMAP → anotasi marker.",
        "Klaster = hipotesis; anotasi butuh marker + referensi + validasi.",
        "Trajectory: urutan diferensiasi (inferensi!); RNA velocity: arah.",
        "Waspadai doublet menyamar sebagai “tipe sel baru”.",
      ],
      next: { label: "BI12 · Genetika Populasi", href: "/v2/learn/bi12-genomika-populasi" },
      quiz: [
        {
          q: "Eksperimen menargetkan 10.000 sel (10x). Estimasi doublet dan implikasinya?",
          options: [
            { text: "~0,1% — bisa diabaikan", why: "Terlalu optimis 80x lipat; doublet naik dengan throughput." },
            { text: "~8% — wajib dideteksi (Scrublet/DoubletFinder) sebelum interpretasi klaster", why: "~0,8% per 1.000 sel → ~8% pada 10k. Klaster “hibrida” kecil adalah tersangka doublet.", correct: true },
            { text: "~50% — teknologi tidak bisa dipakai", why: "Berlebihan; doublet terkendali dengan deteksi dan filter." },
            { text: "0% — microfluidics sempurna", why: "Tidak ada sistem yang sempurna; doublet adalah fisika droplet." },
          ],
        },
        {
          q: "Klaster “baru” hanya muncul di satu dari empat batch dan tanpa marker kanonis yang meyakinkan. Kesimpulan?",
          options: [
            { text: "Tipe sel baru — segera publikasi", why: "Satu batch + tanpa marker = pola klasik artefak, bukan penemuan." },
            { text: "Kemungkinan artefak batch/doublet — verifikasi sebelum klaim", why: "Uji: apakah ia doublet? hilang setelah integrasi batch? ada di sampel independen?", correct: true },
            { text: "Pasti doublet — langsung buang", why: "Mungkin doublet, mungkin batch — diagnosis butuh pemeriksaan, bukan tebakan." },
            { text: "Naikkan resolution agar terpecah lebih halus", why: "Resolution lebih tinggi pada artefak hanya menghasilkan artefak yang lebih halus." },
          ],
        },
        {
          q: "Sampel kardiomiosit menunjukkan %MT 25% pada sebagian besar sel. Tindakan QC?",
          options: [
            { text: "Buang semua sel di atas 10% — ambang universal", why: "10% bukan hukum universal; kardiomiosit sehat memang bermitokondria tinggi (20–30%)." },
            { text: "Jangan buang buta — tetapkan ambang per jaringan dari distribusi data", why: "Gunakan median + 3×MAD per dataset; ambang impor tutorial bisa membuang sel sehat.", correct: true },
            { text: "%MT tidak penting untuk QC", why: "%MT adalah penanda utama sel rusak/stressed — mengabaikannya berbahaya." },
            { text: "Naikkan resolution clustering untuk mengompensasi", why: "Clustering tidak memperbaiki QC yang salah; artefak hanya menjadi klaster artefak." },
          ],
        },
        {
          q: "Keunggulan single-cell atas bulk RNA-seq?",
          options: [
            { text: "Lebih murah", why: "Single-cell justru lebih mahal per sampel." },
            { text: "Melihat heterogenitas & tipe sel langka yang diratakan bulk", why: "Smoothie vs buah potong. Sel 0,1% tak terlihat di bulk.", correct: true },
            { text: "Lebih mudah", why: "Analisisnya lebih kompleks: QC, doublet, dropout." },
            { text: "Tidak ada", why: "Ada: resolusi sel tunggal membuka biologi yang tersembunyi." },
          ],
        },
        {
          q: "%MT tinggi pada suatu barcode menandakan…",
          options: [
            { text: "Sel sehat", why: "Sel sehat mempertahankan RNA sitoplasma; %MT-nya rendah." },
            { text: "Kemungkinan sel mati/stres — TAPI jangan buang buta: cek jaringannya dulu", why: "QC klasik: sel sekarat bocor sitoplasma, mitokondria tertinggal → %MT naik. Tapi kardiomiosit/hepatosit SEHAT bisa 20–30% — buang buta = membuang sel sehat. Tetapkan ambang per jaringan dari distribusi data.", correct: true },
            { text: "Sel membelah", why: "Pembelahan tidak ditandai %MT tinggi." },
            { text: "Doublet pasti", why: "Doublet ditandai nFeature tinggi + marker ganda, bukan %MT." },
          ],
        },
        {
          q: "Doublet adalah…",
          options: [
            { text: "Sel ganda DNA", why: "Bukan soal ploidi; ini soal droplet." },
            { text: "Dua sel dalam satu droplet — terlihat sebagai “tipe” palsu bermarker ganda", why: "Tanda = nFeature tinggi + marker dua tipe. Deteksi via DoubletFinder/scrublet.", correct: true },
            { text: "Sel mati", why: "Sel mati ditandai %MT tinggi." },
            { text: "Batch effect", why: "Batch effect soal teknis antar-sampel, bukan droplet." },
          ],
        },
        {
          q: "Pseudotime mengukur…",
          options: [
            { text: "Waktu nyata", why: "Tidak ada jam dalam snapshot; ini urutan kemiripan." },
            { text: "Urutan inferensi sepanjang proses biologis — bukan jam; butuh validasi", why: "Dari kemiripan snapshot. Arah + validasi (RNA velocity/eksperimen) wajib.", correct: true },
            { text: "Umur sel", why: "Umur kronologis sel tidak terukur dari transkriptom snapshot." },
            { text: "Kecepatan diferensiasi", why: "Pseudotime tidak memberi laju; hanya urutan." },
          ],
        },
        {
          q: "Kapan spatial transcriptomics dipilih?",
          options: [
            { text: "Selalu", why: "Mahal dan kompleks; hanya bila posisi relevan." },
            { text: "Ketika POSISI sel menentukan fungsi (mikroenvironment tumor, otak)", why: "Peta, bukan daftar. T cell excluded vs inflamed = prediksi imunoterapi.", correct: true },
            { text: "Tidak pernah", why: "Ia skill terpanas di lowongan 2026 untuk pertanyaan spasial." },
            { text: "Hanya untuk bakteri", why: "Justru paling kuat untuk jaringan kompleks (tumor, otak)." },
          ],
        },
      ],
    },
  ],
};
