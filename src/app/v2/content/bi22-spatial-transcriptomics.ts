import type { V2Lesson } from "../lib/types";

export const bi22: V2Lesson = {
  slug: "bi22-spatial-transcriptomics",
  track: "Bioinformatika",
  module: "Omics Spasial",
  title: "BI22 · Spatial Transcriptomics: Di Mana Gen Bicara",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Dua pasien, sel T yang sama, nasib berbeda",
      prose: [
        "Dua pasien melanoma, profil sel imunnya identik di atas kertas: keduanya punya sel T sitotoksik di tumor. Keduanya diberi imunoterapi yang sama. Pasien A sembuh total; pasien B tidak merespons sama sekali.",
        "Patolog menatap ulang slide-nya — kali ini bukan menghitung sel, tapi melihat POSISInya. Pada pasien A, sel T berada DI DALAM sarang tumor (inflamed). Pada pasien B, sel T menumpuk di tepi, terhalang stroma, tak pernah menyentuh sel kanker (excluded). Sel yang sama, alamat berbeda, nasib berbeda.",
        "Twist-nya: RNA-seq bulk maupun single-cell akan melaporkan kedua pasien sebagai 'punya sel T' — perbedaannya tidak terlihat tanpa peta. Lesson ini tentang teknologi yang mengembalikan alamat ke data ekspresi: spatial transcriptomics. Di mana gen bicara ternyata sama pentingnya dengan apa yang ia katakan.",
        "Bekal dari BI11 (single-cell): scRNA-seq melarutkan jaringan menjadi sup sel — kamu dapat sensus tipe sel (QC, clustering, marker) tapi kehilangan alamat tiap sel. Spatial transcriptomics adalah jawabannya: ekspresi gen + koordinat. Lesson ini tidak mengulang clustering single-cell; fokusnya pada apa yang hanya bisa dijawab dengan peta.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa dua pasien dengan sel T yang sama bisa berbeda respons" },
        { id: "t2", text: "Jelaskan informasi apa yang hilang saat jaringan dilarutkan untuk scRNA-seq" },
      ],
      note: {
        title: "🚨 Mitos: peta spasial hanya 'single-cell yang lebih bagus'",
        type: "pitfall",
        body: "Yang benar: keduanya menjawab pertanyaan berbeda. Single-cell unggul menemukan tipe sel langka (0,1%) lewat sensus puluhan ribu sel; spasial unggul menjawab 'siapa bertetangga dengan siapa'. Sampel dengan 5.000 spot Visium tidak menggantikan 50.000 sel scRNA-seq — justru keduanya diintegrasikan (dekonvolusi).",
      },
      reference: "Alamat menentukan fungsi. Daftar = siapa ada; peta = siapa di mana.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan & peta",
      title: "Yang bisa kamu lakukan setelah lesson ini",
      prose: [
        "1. Membandingkan tiga platform spasial (Visium, Visium HD, Xenium) dari sisi resolusi, cakupan gen, dan kapan memakai masing-masing.",
        "2. Menjelaskan alur analisis spasial: dekonvolusi spot, domain spasial, niche, dan interaksi ligand-reseptor.",
        "3. Menghitung dan menginterpretasikan Moran's I untuk menguji apakah suatu gen berpola spasial atau acak.",
        "4. Memutuskan kapan memakai spasial vs single-cell vs bulk memakai peta keputusan.",
        "5. Mengkritik klaim 'interaksi sel' dari data spasial: kolokalisasi ≠ kausalitas.",
        "Peta lesson: (3) Teknologi: tiga generasi peta · (4) Analisis: dari spot ke niche · (5) Lab 1: Moran's I dari nol · (6) Lab 2: dekonvolusi spot · (7) Peta keputusan · (8) Mini-case: siapa mengusir sel T? · (9) Checkpoint.",
      ],
      tasks: [
        { id: "t1", text: "Tulis ulang 5 tujuan di atas dengan kata-katamu sendiri" },
      ],
      reference: "5 tujuan: bandingkan platform → alur analisis → Moran's I → pilih teknologi → kritik klaim.",
    },
    {
      id: "teknologi",
      eyebrow: "Langkah 3 · Konsep inti 1",
      title: "Tiga generasi peta: satelit, drone, detektif",
      prose: [
        "Visium — Si Satelit. Slide dengan area tangkap 6,5 × 6,5 mm berisi ~5.000 spot berdiameter 55 µm (jarak pusat-ke-pusat 100 µm). Tiap spot menangkap mRNA seluruh transkriptom dari 1–10 sel di atasnya, lengkap dengan barcode spasial; hasilnya ditumpangkan ke citra H&E. Kekuatan: peta genom-wide tanpa target pradefinisi. Batas: satu spot = beberapa sel tercampur.",
        "Visium HD — Si Drone. Generasi berikutnya: grid kontinu bin 2 µm dengan ~11 juta fitur per area — resolusi skala sel tunggal untuk seluruh transkriptom, kompatibel FFPE. Kekuatan: peta genom-wide setajam histologi. Batas: data raksasa, biaya dan komputasi naik kelas.",
        "Xenium — Si Detektif. In situ imaging: transkrip dideteksi langsung di jaringan pada resolusi subselular, hingga 5.000 gen (panel Prime 5K, diluncurkan Juni 2024, bisa dikustom +100 gen) plus protein multipleks. Kekuatan: alamat presisi tiap molekul — ideal untuk validasi dan interaksi ligand-reseptor. Batas: targeted — gen di luar panel tidak terlihat.",
        "Kepribadian tiap generasi: satelit memotret kota dari angkasa (pola besar, murah per area), drone terbang rendah (detail jalan), detektif menginterogasi tiap rumah (presisi alamat, tapi hanya daftar pertanyaan yang dibawa). Analis yang baik memilih berdasarkan pertanyaan, bukan berdasarkan yang paling canggih.",
        "Cara membaca chart: sumbu X = tiga platform; sumbu Y logaritmik = jumlah unit pengukuran per area tangkap (~5.000 spot Visium, ~11 juta fitur Visium HD, 5.000 gen Xenium). Perhatikan: satuannya beda (spot vs fitur vs gen) — chart ini membandingkan SKALA, bukan kualitas.",
        "Interpretasi: Visium HD melompat 3 orde magnitude dari Visium dalam kerapatan spasial; Xenium bermain di dimensi lain (ketepatan molekul, bukan kerapatan). Tidak ada pemenang mutlak — ada alat yang tepat untuk pertanyaan yang tepat.",
        "💡 Intuisi kunci: resolusi spasial dan pleksitas (jumlah gen) adalah dua sumbu yang berbeda. Visium HD menang di keduanya untuk transkriptom; Xenium menang di presisi alamat untuk gen target. Jangan tertukar saat membaca brosur vendor.",
      ],
      echart: {
        option: {
          title: { text: "Skala pengukuran per area tangkap (sumbu Y log)" },
          tooltip: { trigger: "axis" },
          xAxis: { type: "category", data: ["Visium\n(~5.000 spot)", "Visium HD\n(~11 jt fitur)", "Xenium\n(5.000 gen)"] },
          yAxis: { type: "log", name: "unit/area" },
          series: [
            { type: "bar", data: [5000, 11000000, 5000] },
          ],
        },
        caption: "Angka dari dokumentasi 10x Genomics (lembar produk Visium, pengumuman Visium HD, panel Xenium Prime 5K). Satuan berbeda antar platform — bandingkan skala, bukan kualitas.",
      },
      tasks: [
        { id: "t1", text: "Untuk validasi lokasi satu gen kandidat obat: pilih platform dan jelaskan alasannya" },
        { id: "t2", text: "Jelaskan kenapa satu spot Visium bukan satu sel" },
      ],
      note: {
        title: "🚨 Mitos: makin tinggi resolusi selalu lebih baik",
        type: "pitfall",
        body: "Yang benar: resolusi tinggi tanpa pertanyaan yang tepat = data mahal tanpa jawaban. Untuk memetakan zona tumor vs stroma, Visium 55 µm sudah cukup; Xenium untuk itu adalah pemborosan. Resolusi adalah biaya — belanjakan hanya untuk pertanyaan yang membutuhkannya.",
      },
      reference: "Visium = peta genom-wide 55 µm · HD = 2 µm · Xenium = subselular, 5.000 gen target.",
    },
    {
      id: "analisis",
      eyebrow: "Langkah 4 · Konsep inti 2",
      title: "Dari spot ke niche: alur analisis spasial",
      prose: [
        "Langkah 1 — Dekonvolusi spot. Karena satu spot Visium berisi 1–10 sel, ekspresinya adalah campuran. Dengan referensi scRNA-seq (profil tiap tipe sel), tiap spot diurai: y_spot = Σ (proporsi_tipe × profil_tipe). Inilah jembatan BI11 → BI22: sensus single-cell memberi kamus, peta spasial memberi kalimat.",
        "Langkah 2 — Domain spasial. Clustering yang sadar tetangga: spot dikelompokkan bukan hanya dari kemiripan ekspresi, tapi juga kedekatan posisi (dua spot mirip tapi berjauhan boleh jadi domain berbeda — mis. dua fokus tumor terpisah).",
        "Langkah 3 — Niche & ketetanggaan. Uji: tipe sel apa yang bertetangga lebih sering dari acak? Niche = lingkungan mikro berulang (mis. 'niche perivaskular': endotel + perisit + makrofag). Statistiknya membandingkan pasangan bertetangga observasi vs ekspektasi acak.",
        "Langkah 4 — Ligand-reseptor spasial. Kandidat interaksi sel-sel: ligand diekspresikan di spot A DAN reseptornya di spot tetangga B. Kuncinya adalah DAN spasial — ko-ekspresi dalam satu spot tercampur tidak cukup membuktikan interaksi.",
        "💡 Intuisi kunci: setiap langkah menambah satu syarat ketat. Dekonvolusi butuh referensi yang cocok (jaringan & kondisi sama); niche butuh definisi tetangga yang biologis (jarak difusi sinyal, bukan piksel); ligand-reseptor butuh validasi (ko-lokalisasi ≠ kausalitas — butuh eksperimen follow-up).",
      ],
      formula: String.raw`I = \frac{N}{W} \cdot \frac{\sum_i \sum_j w_{ij}(x_i - \bar{x})(x_j - \bar{x})}{\sum_i (x_i - \bar{x})^2}`,
      formulaNote: "Moran's I: N = jumlah spot; w_ij = 1 bila spot i dan j bertetangga (0 bila tidak); W = jumlah semua bobot; x_i = ekspresi gen di spot i. I ≈ +1: pola mengelompok kuat (hotspot); I ≈ 0: acak; I ≈ −1: pola papan catur (tetangga selalu beda — jarang di biologi).",
      tasks: [
        { id: "t1", text: "Jelaskan kenapa dekonvolusi butuh referensi scRNA-seq dari jaringan yang sama" },
        { id: "t2", text: "Bedakan bukti 'ligand-reseptor berinteraksi' vs 'ligand-reseptor berkolokalisasi'" },
      ],
      note: {
        title: "Intuisi: peta yang bagus menjawab “di mana”, bukan sekadar “apa”",
        body: "Analis spasial menyimpan lima heuristik. Satu: kolokalisasi bukan kausalitas — ligand di spot A dan reseptor di spot tetangga B adalah KANDIDAT interaksi, bukan bukti; bukti butuh validasi ortogonal (Xenium resolusi subselular, atau eksperimen fungsional). Dua: satu spot Visium = 1–10 sel tercampur — dekonvolusi hanya sebagus referensi scRNA-seq-nya; referensi dari jaringan atau kondisi yang salah memberi proporsi yang salah dengan percaya diri. Tiga: pilih platform dari PERTANYAAN, bukan dari kecanggihan — zona tumor vs stroma cukup Visium; batas invasi setajam sel butuh Visium HD; validasi 50 gen kandidat butuh Xenium; tipe sel langka 0,1% tetap butuh scRNA-seq. Empat: definisi “tetangga” harus biologis, bukan piksel — jarak difusi sinyal (puluhan mikrometer) lebih bermakna daripada kedekatan grid; niche yang didefinisikan asal memberi hasil asal. Lima: gen dengan Moran's I tinggi tetapi diekspresikan di 3 spot dari 5.000 adalah pola yang rapuh — selalu cek prevalensi sebelum merayakan hotspot. Heuristik gabungannya: analisis spasial yang baik bergerak dari peta ke mekanisme — dekonvolusi memberi siapa-di-mana, niche memberi konteksnya, dan hanya eksperimen yang memberi sebabnya.",
      },
      reference: "Dekonvolusi → domain → niche → ligand-reseptor. Tiap langkah = satu syarat ketat baru.",
    },

    {
      id: "lab-spasial",
      eyebrow: "Langkah 5 · Lab",
      title: "Moran's I dari nol: berpola atau acak?",
      prose: [
        "Pertanyaan paling dasar analisis spasial: apakah ekspresi gen ini membentuk POLA di jaringan, atau tersebar acak? Moran's I menjawabnya dalam satu angka: bandingkan tiap spot dengan tetangganya — bila tetangga cenderung mirip, I positif besar.",
        "Jaringan SINTETIS 15×15 spot: GenA punya hotspot di tengah (meniru gen yang aktif di niche tertentu) + noise; GenB murni acak (meniru housekeeping yang tersebar). Lengkapi fungsi `moran` dengan bobot 4-tetangga, lalu putuskan.",
        "Coba: naikkan noise GenA dari 1,0 → 3,0 (random.gauss(0, 3)) — pada titik berapa I jatuh di bawah 0,5? Itulah batas deteksi pola: sinyal spasial yang tenggelam dalam noise teknis tidak bisa diselamatkan statistik.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `moran(x, n)` (bobot 4-tetangga)" },
        { id: "t2", text: "Bandingkan GenA vs GenB dan interpretasikan polanya" },
      ],
      expected: "GenA: I ≈ +0,78 (pola kuat) · GenB: I ≈ −0,07 (acak)",
      hints: [
        "m = sum(x)/len(x); W = jumlah pasangan bertetangga.",
        "num += (x[idx]-m)*(x[nidx]-m) untuk tiap tetangga; W += 1.",
        "den = sum((v-m)**2 for v in x); I = (N/W) × num/den.",
      ],
      code: {
        starter: `import math, random\nrandom.seed(22)\nN = 15\n# JARINGAN SINTETIS 15x15 spot\ngenA = []  # hotspot di tengah + noise\nfor i in range(N):\n    for j in range(N):\n        d2 = (i-7)**2 + (j-7)**2\n        genA.append(10*math.exp(-d2/8) + random.gauss(0, 1))\ngenB = [random.gauss(5, 1) for _ in range(N*N)]  # acak murni\n\ndef moran(x, n):\n    # TULIS KODEMU: Moran's I dengan bobot 4-tetangga\n    m = \n    num = 0.0\n    W = 0\n    for i in range(n):\n        for j in range(n):\n            idx = i*n + j\n            for di, dj in ((1,0),(-1,0),(0,1),(0,-1)):\n                ni, nj = i+di, j+dj\n                if 0 <= ni < n and 0 <= nj < n:\n                    nidx = ni*n + nj\n                    num += \n                    W += 1\n    den = \n    return \n\nprint(f'GenA (hotspot): I = {moran(genA, N):+.3f}')\nprint(f'GenB (acak)   : I = {moran(genB, N):+.3f}')\nprint('I>0.5 = berpola kuat · |I|<0.1 = acak')`,
        lockLines: 12,
        solution: `import math, random\nrandom.seed(22)\nN = 15\n# JARINGAN SINTETIS 15x15 spot\ngenA = []  # hotspot di tengah + noise\nfor i in range(N):\n    for j in range(N):\n        d2 = (i-7)**2 + (j-7)**2\n        genA.append(10*math.exp(-d2/8) + random.gauss(0, 1))\ngenB = [random.gauss(5, 1) for _ in range(N*N)]  # acak murni\n\ndef moran(x, n):\n    # Moran's I dengan bobot 4-tetangga\n    m = sum(x)/len(x)\n    num = 0.0\n    W = 0\n    for i in range(n):\n        for j in range(n):\n            idx = i*n + j\n            for di, dj in ((1,0),(-1,0),(0,1),(0,-1)):\n                ni, nj = i+di, j+dj\n                if 0 <= ni < n and 0 <= nj < n:\n                    nidx = ni*n + nj\n                    num += (x[idx]-m)*(x[nidx]-m)\n                    W += 1\n    den = sum((v-m)**2 for v in x)\n    return (len(x)/W) * num/den\n\nprint(f'GenA (hotspot): I = {moran(genA, N):+.3f}')\nprint(f'GenB (acak)   : I = {moran(genB, N):+.3f}')\nprint('I>0.5 = berpola kuat · |I|<0.1 = acak')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "GenA \\(hotspot\\): I = \\+0\\.7\\d", label: "GenA berpola kuat (I≈+0,78)", msg: "I GenA harus ≈ +0,78. Cek num, W, den, dan faktor N/W." },
          { kind: "stdout_matches", task: "t2", pattern: "GenB \\(acak\\)\\s+: I = -0\\.06\\d", label: "GenB acak (I≈0)", msg: "I GenB harus ≈ 0. Cek rata-rata m dan tetangga 4-arah." },
        ],
      },
      echart: {
        option: {
          title: { text: "Peta ekspresi GenA (data SINTETIS, 15×15 spot)" },
          tooltip: {},
          xAxis: { type: "category", data: ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14"] },
          yAxis: { type: "category", data: ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14"] },
          visualMap: { min: -2, max: 10, calculable: true, orient: "horizontal", left: "center" },
          series: [
            { type: "heatmap", data: [[0, 14, 0.53], [1, 14, -0.14], [2, 14, 3.59], [3, 14, 0.54], [4, 14, 0.21], [5, 14, 0.48], [6, 14, -0.52], [7, 14, -0.73], [8, 14, 0.58], [9, 14, -0.45], [10, 14, 0.86], [11, 14, -0.22], [12, 14, -1.87], [13, 14, -1.38], [14, 14, -0.90], [0, 13, -2.08], [1, 13, -0.08], [2, 13, -0.30], [3, 13, 1.00], [4, 13, -0.87], [5, 13, -0.17], [6, 13, 0.70], [7, 13, 0.89], [8, 13, -0.97], [9, 13, 1.66], [10, 13, -0.62], [11, 13, 1.27], [12, 13, -0.31], [13, 13, -0.44], [14, 13, -1.30], [0, 12, -0.13], [1, 12, 2.51], [2, 12, -0.65], [3, 12, 1.67], [4, 12, 1.53], [5, 12, -0.14], [6, 12, 1.56], [7, 12, 1.89], [8, 12, 0.07], [9, 12, -0.29], [10, 12, 1.32], [11, 12, 0.43], [12, 12, 2.25], [13, 12, 0.46], [14, 12, -1.21], [0, 11, -0.04], [1, 11, -1.22], [2, 11, 0.85], [3, 11, 0.92], [4, 11, 0.01], [5, 11, -0.11], [6, 11, 2.14], [7, 11, 0.96], [8, 11, 2.48], [9, 11, -0.21], [10, 11, 0.15], [11, 11, -0.39], [12, 11, -1.03], [13, 11, 2.87], [14, 11, 1.77], [0, 10, -0.65], [1, 10, 0.87], [2, 10, -1.74], [3, 10, 1.76], [4, 10, 2.20], [5, 10, 1.61], [6, 10, 2.50], [7, 10, 3.51], [8, 10, 3.35], [9, 10, 1.59], [10, 10, 0.17], [11, 10, 0.17], [12, 10, -0.30], [13, 10, 0.86], [14, 10, 0.11], [0, 9, 0.27], [1, 9, -1.67], [2, 9, -0.13], [3, 9, 0.42], [4, 9, 1.43], [5, 9, 3.57], [6, 9, 5.05], [7, 9, 4.48], [8, 9, 6.35], [9, 9, 4.66], [10, 9, 1.44], [11, 9, 1.49], [12, 9, -0.70], [13, 9, -1.24], [14, 9, -0.19], [0, 8, 1.67], [1, 8, 0.01], [2, 8, -1.20], [3, 8, 1.47], [4, 8, 2.28], [5, 8, 4.62], [6, 8, 8.18], [7, 8, 7.02], [8, 8, 5.93], [9, 8, 3.85], [10, 8, 4.03], [11, 8, 1.33], [12, 8, -0.22], [13, 8, -0.58], [14, 8, 0.75], [0, 7, 1.37], [1, 7, -0.61], [2, 7, 0.76], [3, 7, 3.88], [4, 7, 3.93], [5, 7, 5.76], [6, 7, 9.23], [7, 7, 10.16], [8, 7, 9.58], [9, 7, 6.49], [10, 7, 2.78], [11, 7, 1.28], [12, 7, 0.89], [13, 7, -0.56], [14, 7, 0.15], [0, 6, -0.89], [1, 6, 1.45], [2, 6, 2.08], [3, 6, 0.33], [4, 6, 3.81], [5, 6, 5.58], [6, 6, 7.94], [7, 6, 8.61], [8, 6, 8.12], [9, 6, 6.46], [10, 6, 1.63], [11, 6, 2.32], [12, 6, 0.17], [13, 6, -1.00], [14, 6, 0.02], [0, 5, 0.74], [1, 5, 0.03], [2, 5, 0.63], [3, 5, 0.52], [4, 5, 1.46], [5, 5, 4.79], [6, 5, 4.43], [7, 5, 7.17], [8, 5, 5.76], [9, 5, 3.45], [10, 5, 1.79], [11, 5, 0.58], [12, 5, 0.29], [13, 5, 0.08], [14, 5, -0.08], [0, 4, -1.96], [1, 4, -2.11], [2, 4, 0.56], [3, 4, -0.16], [4, 4, 0.52], [5, 4, 1.85], [6, 4, 1.77], [7, 4, 4.92], [8, 4, 2.92], [9, 4, 1.85], [10, 4, 0.01], [11, 4, 1.42], [12, 4, 0.96], [13, 4, 1.64], [14, 4, 1.00], [0, 3, -0.79], [1, 3, -1.24], [2, 3, 1.54], [3, 3, -0.46], [4, 3, 0.39], [5, 3, 0.72], [6, 3, 1.77], [7, 3, 1.99], [8, 3, 0.18], [9, 3, 0.21], [10, 3, -1.30], [11, 3, 0.82], [12, 3, -0.05], [13, 3, -1.67], [14, 3, 1.14], [0, 2, 0.07], [1, 2, -0.98], [2, 2, -0.35], [3, 2, -0.49], [4, 2, 0.31], [5, 2, 0.54], [6, 2, -0.15], [7, 2, 0.94], [8, 2, -2.24], [9, 2, -0.03], [10, 2, 0.87], [11, 2, 1.11], [12, 2, 0.91], [13, 2, -1.01], [14, 2, -1.68], [0, 1, -0.29], [1, 1, 2.41], [2, 1, 0.34], [3, 1, -0.69], [4, 1, -1.63], [5, 1, 0.27], [6, 1, -0.31], [7, 1, 0.68], [8, 1, 0.35], [9, 1, -2.29], [10, 1, -0.03], [11, 1, 0.88], [12, 1, -0.55], [13, 1, -1.18], [14, 1, -1.14], [0, 0, -1.31], [1, 0, 2.31], [2, 0, 1.51], [3, 0, -0.57], [4, 0, 1.47], [5, 0, -1.03], [6, 0, -0.49], [7, 0, -0.70], [8, 0, -0.13], [9, 0, 0.74], [10, 0, 2.14], [11, 0, 0.81], [12, 0, -0.06], [13, 0, 0.21], [14, 0, -0.19]], label: { show: false } },
          ],
        },
        caption: "Data sintetis: hotspot gaussian di tengah + noise. Cara membaca: warna = level ekspresi per spot (kuning terang = tinggi). Interpretasi: pola mengelompok di tengah — inilah yang diukur Moran's I (+0,78).",
      },
      reference: "Moran's I = 'apakah tetangga mirip?'. I>0,5 pola kuat; |I|<0,1 acak.",
    },
    {
      id: "lab-dekonvolusi",
      eyebrow: "Langkah 6 · Lab 2/2",
      title: "Dekonvolusi spot: siapa di dalam?",
      prose: [
        "Satu spot Visium = 1–10 sel tercampur. Dekonvolusi mengurai campuran memakai profil referensi scRNA-seq: ekspresi spot = jumlah proporsi tiap tipe × profilnya. Untuk 2 tipe sel dan 2 gen, ini aljabar SMA: selesaikan proporsi dari gen pertama, validasi dengan gen kedua.",
        "Data SINTETIS: profil referensi tumor [10, 1] dan imun [1, 8] (genA, genB); satu spot teramati [6,4, 3,8]. Lengkapi `dekonvolusi_2tipe`, lalu cek residual gen kedua: residual ≈ 0 berarti dua tipe cukup menjelaskan spot; residual besar berarti ada tipe ketiga yang tak dikenal.",
        "Coba: ubah SPOT jadi [5,0, 5,0] — proporsi dan residualnya jadi berapa? Interpretasikan: spot seperti apa yang menghasilkan residual besar, dan apa tindak lanjutnya di analisis nyata?",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `dekonvolusi_2tipe` (selesaikan p1 dari gen pertama)" },
        { id: "t2", text: "Validasi via gen kedua; interpretasikan residual" },
      ],
      expected: "tumor 0,60 / imun 0,40 · residual genB ≈ 0,00",
      hints: [
        "spot[0] = p1*mu1[0] + (1-p1)*mu2[0] → p1 = (spot[0]-mu2[0])/(mu1[0]-mu2[0]).",
        "rek2 = p1*mu1[1] + p2*mu2[1]; residual = |rek2 - spot[1]|.",
        "p2 = 1 - p1.",
      ],
      code: {
        starter: `# PROFIL REFERENSI SINTETIS (dari scRNA-seq): [genA, genB]\nMU = {'tumor': [10.0, 1.0], 'imun': [1.0, 8.0]}\nSPOT = [6.4, 3.8]  # satu spot Visium teramati (SINTETIS)\n\ndef dekonvolusi_2tipe(spot, mu1, mu2):\n    # TULIS KODEMU: kembalikan (p1, p2)\n    p1 = \n    return p1, 1-p1\n\np1, p2 = dekonvolusi_2tipe(SPOT, MU['tumor'], MU['imun'])\nrek2 = p1*MU['tumor'][1] + p2*MU['imun'][1]\nprint(f'proporsi tumor: {p1:.2f}, imun: {p2:.2f}')\nprint(f'rekonstruksi genB: {rek2:.2f} (observasi {SPOT[1]}) -> residual {abs(rek2-SPOT[1]):.2f}')\nprint('residual ~0 = 2 tipe cukup; residual besar = ada tipe tak dikenal')`,
        lockLines: 5,
        solution: `# PROFIL REFERENSI SINTETIS (dari scRNA-seq): [genA, genB]\nMU = {'tumor': [10.0, 1.0], 'imun': [1.0, 8.0]}\nSPOT = [6.4, 3.8]  # satu spot Visium teramati (SINTETIS)\n\ndef dekonvolusi_2tipe(spot, mu1, mu2):\n    # kembalikan (p1, p2)\n    p1 = (spot[0]-mu2[0])/(mu1[0]-mu2[0])\n    return p1, 1-p1\n\np1, p2 = dekonvolusi_2tipe(SPOT, MU['tumor'], MU['imun'])\nrek2 = p1*MU['tumor'][1] + p2*MU['imun'][1]\nprint(f'proporsi tumor: {p1:.2f}, imun: {p2:.2f}')\nprint(f'rekonstruksi genB: {rek2:.2f} (observasi {SPOT[1]}) -> residual {abs(rek2-SPOT[1]):.2f}')\nprint('residual ~0 = 2 tipe cukup; residual besar = ada tipe tak dikenal')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "proporsi tumor: 0\\.60, imun: 0\\.40", label: "proporsi 60/40", msg: "p1 = (6.4-1)/(10-1) = 0.60. Cek rumus dari gen pertama." },
          { kind: "stdout_matches", task: "t2", pattern: "residual 0\\.00", label: "residual ≈ 0", msg: "rek2 harus 3.80 → residual 0.00. Cek p2 = 1-p1." },
        ],
      },
      reference: "Dekonvolusi = uraikan campuran dengan kamus referensi. Residual = kejujuran model.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Teknologi apa untuk pertanyaan apa",
      prose: [
        "Skenario 1 — Butuh peta zona tumor vs stroma seluruh transkriptom, budget terbatas → Visium. Alasan: 5.000 spot genom-wide cukup memisahkan zona besar; biaya per area paling efisien.",
        "Skenario 2 — Butuh batas invasi setajam sel tunggal (tepi tumor, lapisan korteks) → Visium HD. Alasan: bin 2 µm memisahkan sel yang berdesakan; Visium 55 µm akan mengaburkan batas.",
        "Skenario 3 — Validasi lokasi 50 gen kandidat obat + protein di tingkat subselular → Xenium. Alasan: presisi molekul + multipleks protein; targeted tidak masalah karena gen sudah dipilih.",
        "Skenario 4 — Cari tipe sel langka 0,1% tanpa peduli posisi → scRNA-seq (RNA sel tunggal yang menyensus puluhan ribu sel tanpa informasi posisi), bukan spasial. Alasan: sensus puluhan ribu sel mengalahkan 5.000 spot untuk kelangkaan.",
        "Skenario 5 — Punya data Visium DAN scRNA-seq → dekonvolusi: uraikan tiap spot memakai referensi single-cell. Alasan: sensus memberi kamus tipe sel, peta memberi alamat — kombinasi keduanya adalah analisis spasial terbaik.",
        "Aturan praktis 10 detik: (1) Pertanyaanmu soal POSISI? Tidak → jangan pakai spasial. (2) Butuh genom-wide atau gen target? (3) Resolusi yang dibutuhkan: zona (Visium) / sel (HD) / molekul (Xenium). (4) Selalu siapkan referensi scRNA-seq untuk dekonvolusi.",
      ],
      tasks: [
        { id: "t1", text: "Studi: batas invasi tumor otak per lapisan sel — pilih teknologi & jelaskan" },
        { id: "t2", text: "Studi: atlas tumor payudara seluruh transkriptom per zona — pilih & jelaskan" },
      ],
      reference: "Zona→Visium · sel→HD · molekul target→Xenium · langka→scRNA-seq · punya dua-duanya→dekonvolusi.",
    },
    {
      id: "kasus",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Siapa mengusir sel T?",
      prose: [
        "Kasus (angka SINTETIS, pola realistis): satu slide Visium tumor melanoma, 4.800 spot lolos QC. Anotasi domain: 1.500 spot zona tumor, 1.200 spot stroma margin, sisanya jaringan normal. Signature sel T (CD3D/CD8A tinggi): 600 spot tumor positif (40%) vs 1.020 spot margin positif (85%).",
        "Pertanyaan 1: hitung odds ratio keberadaan sel T di tumor vs margin, dan interpretasikan. Pertanyaan 2: fenotipe apa ini (inflamed/excluded/desert) dan implikasinya untuk anti-PD1 tunggal? Pertanyaan 3: rancang validasi Xenium satu paragraf.",
        "Pembahasan 1: OR = (600/900) / (1.020/180) = 0,667 / 5,667 ≈ 0,12 — sel T ~8× lebih jarang di dalam tumor dibanding margin. Bukan tidak ada sel T; mereka terhalang di perbatasan.",
        "Pembahasan 2: fenotipe excluded — anti-PD1 tunggal kemungkinan gagal karena sel T tak mencapai target; pertimbangkan kombinasi penarget stroma (mis. anti-TGF-β / anti-fibrosis) dalam trial. Inilah keputusan yang tidak bisa diambil dari data bulk.",
        "Pembahasan 3: validasi Xenium — panel imunologi + penanda stroma (kolagen, αSMA) pada irisan berurutan; ukur jarak tiap transkrip CD8A ke batas tumor; bila median jarak > 100 µm di margin, konfirmasi fisik penghalang. Kolokalisasi mendukung, bukan membuktikan, kausalitas.",
      ],
      tasks: [
        { id: "t1", text: "Hitung ulang odds ratio dengan angka di atas dan interpretasikan" },
        { id: "t2", text: "Tulis rancangan validasi Xenium dalam 3 kalimat" },
      ],
      reference: "OR ≈ 0,12 → excluded. Sel T ada tapi terhalang; validasi = ukur jarak ke batas tumor.",
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
        "Spasial = ekspresi + koordinat; menjawab 'siapa bertetangga dengan siapa'.",
        "Visium: 5.000 spot × 55 µm, genom-wide · HD: bin 2 µm · Xenium: subselular, 5.000 gen target.",
        "Alur: dekonvolusi (butuh referensi scRNA-seq) → domain → niche → ligand-reseptor.",
        "Moran's I: +1 mengelompok, 0 acak; I > 0,5 = pola kuat.",
        "Pilih teknologi dari pertanyaan, bukan dari kecanggihan: zona/sel/molekul.",
        "Kolokalisasi ≠ kausalitas — klaim interaksi butuh validasi fungsional.",
      ],
      next: { label: "BI23 · Pharmacogenomics", href: "/v2/learn/bi23-pharmacogenomics" },
      quiz: [
        {
          q: "Satu spot Visium berisi…",
          options: [
            { text: "Tepat satu sel", why: "Salah — spot 55 µm menampung 1–10 sel tergantung jaringan." },
            { text: "1–10 sel tercampur — perlu dekonvolusi untuk resolusi tipe sel", why: "Inilah kenapa referensi scRNA-seq dibutuhkan.", correct: true },
            { text: "Seluruh jaringan", why: "Satu spot hanya sebagian kecil area 6,5×6,5 mm." },
            { text: "Tidak ada sel, hanya RNA bebas", why: "Spot menangkap mRNA dari sel di atasnya, bukan RNA bebas." },
          ],
        },
        {
          q: "Kapan Xenium dipilih atas Visium?",
          options: [
            { text: "Untuk peta genom-wide murah", why: "Itu keunggulan Visium, bukan Xenium." },
            { text: "Untuk lokalisasi subselular gen-gen target dan validasi presisi", why: "Detektif > satelit untuk alamat molekul. Ingat: gen di luar panel tak terlihat.", correct: true },
            { text: "Untuk menemukan tipe sel baru", why: "Penemuan butuh genom-wide + sensus besar — ranah scRNA-seq/Visium." },
            { text: "Selalu — resolusi tertinggi selalu menang", why: "Mitos langkah 3: resolusi = biaya; belanjakan sesuai pertanyaan." },
          ],
        },
        {
          q: "Moran's I = +0,8 untuk gen X artinya…",
          options: [
            { text: "Gen X tidak diekspresikan", why: "I mengukur pola, bukan level — gen acak pun bisa terekspresi tinggi." },
            { text: "Ekspresi gen X mengelompok kuat secara spasial (hotspot)", why: "Tetangga mirip tetangga — pola niche, bukan acak.", correct: true },
            { text: "Gen X menyebabkan kanker", why: "Pola spasial ≠ kausalitas penyakit." },
            { text: "Data rusak", why: "I tinggi adalah sinyal biologis yang valid, bukan artefak." },
          ],
        },
        {
          q: "Dekonvolusi spot Visium membutuhkan…",
          options: [
            { text: "Tidak butuh apa-apa", why: "Tanpa referensi, campuran 1–10 sel tak terurai." },
            { text: "Referensi scRNA-seq dari jaringan & kondisi yang sama", why: "Kamus tipe sel harus cocok — referensi otak untuk tumor usus = salah kaprah.", correct: true },
            { text: "Hanya citra H&E", why: "H&E memberi morfologi, bukan profil ekspresi per tipe sel." },
            { text: "Referensi dari spesies lain", why: "Profil sel antar-spesies berbeda; dekonvolusi butuh referensi sepadan." },
          ],
        },
        {
          q: "Ligand terdeteksi di spot A, reseptornya di spot tetangga B. Kesimpulan tepat?",
          options: [
            { text: "Terbukti sel A memberi sinyal ke sel B", why: "Kolokalisasi adalah kandidat, bukan bukti — butuh validasi fungsional." },
            { text: "Kandidat interaksi yang menarik — perlu validasi (eksperimen/inhibisi)", why: "Spasial memberi hipotesis terbaik; kausalitas tetap butuh uji.", correct: true },
            { text: "Tidak berarti apa-apa", why: "Berarti banyak: pasangan ligand-reseptor bertetangga jauh lebih informatif dari ko-ekspresi bulk." },
            { text: "Pasti artefak teknis", why: "Bukan artefak — ini sinyal yang memang dicari, hanya belum final." },
          ],
        },
      ],
    },
  ],
};
