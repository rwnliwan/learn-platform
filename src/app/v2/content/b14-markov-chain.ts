import type { V2Lesson } from "../lib/types";

export const b14: V2Lesson = {
  slug: "b14-markov-chain",
  track: "Probabilitas",
  module: "Proses Stokastik",
  title: "B14. Markov Chain: Masa Depan Hanya Peduli Hari Ini",
  estMinutes: 55,
  steps: [
    {
      id: "sifat-markov",
      eyebrow: "Langkah 1 · Sifat Markov",
      title: "\u201CNasabah ini bulan depan di mana?\u201D",
      prose: [
        "Bank memantau status tiap kredit tiap bulan: Lancar \u2192 Telat \u2192 Macet. Data historis: dari 1.000 yang \u201CTelat 30 hari\u201D bulan ini, 600 kembali lancar, 300 tetap telat, 100 jadi macet bulan depan. \u201CDari 1.000 telat hari ini, berapa yang macet 6 bulan lagi?\u201D \u2014 cukup matriks transisi dipangkatkan 6.",
        "Sifat Markov: P(X_{n+1}=j | X_n=i, sejarah) = P(X_{n+1}=j | X_n=i) = P_ij. \u201CMasa depan hanya peduli hari ini, bukan sejarah.\u201D Matriks transisi P berisi semua P_ij (baris = dari, kolom = ke). Contoh baris Telat: (0,60; 0,30; 0,10).",
        "Markov chain adalah \u201Cpenumpang yang pelupa\u201D \u2014 hanya ingat stasiun saat ini. Cek kewarasan 5 detik: tiap baris jumlah = 1 (dari satu status, pasti ke suatu status). Jika tidak = ada yang salah.",
      ],
      formula: String.raw`P(X_{n+1} = j \mid X_n = i, \ldots) = P(X_{n+1} = j \mid X_n = i) = P_{ij}`,
      formulaNote: "X_n = status di langkah n (misal Lancar/Telat/Macet bulan n); X_{n+1} = status langkah berikutnya; i, j = status asal dan tujuan; P_{ij} = peluang pindah i→j dalam satu langkah — satu angka di matriks transisi. Persamaan ini berkata: peluang besok hanya peduli hari ini — seluruh riwayat sebelum n tidak mengubah angka. Contoh angka: dari 1.000 nasabah Telat 30 hari, 600 kembali lancar, 300 tetap telat, 100 jadi macet → P = 0,6/0,3/0,1 — angka ini artinya nasabah yang telat 5 bulan beruntun lalu punya peluang yang SAMA dengan yang baru telat bulan ini; riwayat panjangnya tidak masuk hitungan. Jika data menunjukkan riwayat berpengaruh, sifat Markov dilanggar dan model ini salah alamat.",
      tasks: [
        { id: "t1", text: "Definisikan matriks `P` 3x3 (Lancar, Telat, Macet)" },
        { id: "t2", text: "Hitung `row_sums` dan pastikan tiap baris = 1" },
      ],
      expected: "row_sums=[1.0, 1.0, 1.0]",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Baris matriks tidak menjumlah ke 1 lalu dipakai untuk forecast. Itu bukan matriks transisi \u2014 ada peluang yang hilang entah ke mana.",
      },
      hints: [
        "P = [[0.95,0.04,0.01],[0.60,0.30,0.10],[0.10,0.20,0.70]].",
        "row_sums = [sum(row) for row in P].",
        "print(f\"row_sums={row_sums}\")",
      ],
      code: {
        starter: `# Status: 0=Lancar, 1=Telat, 2=Macet (baris = dari, kolom = ke)\nP = [[0.95, 0.04, 0.01],\n     [0.60, 0.30, 0.10],\n     [0.10, 0.20, 0.70]]\n\n# TULIS KODEMU: cek tiap baris menjumlah ke 1\nrow_sums = \n\nprint(f"row_sums={row_sums}")`,
        lockLines: 4,
        solution: `# Status: 0=Lancar, 1=Telat, 2=Macet (baris = dari, kolom = ke)\nP = [[0.95, 0.04, 0.01],\n     [0.60, 0.30, 0.10],\n     [0.10, 0.20, 0.70]]\n\n# TULIS KODEMU: cek tiap baris menjumlah ke 1\nrow_sums = [round(sum(row), 9) for row in P]\n\nprint(f"row_sums={row_sums}")`,
        checks: [
          { kind: "equal", task: "t2", name: "row_sums", value: [1.0, 1.0, 1.0], tol: 1e-9, label: "tiap baris = 1,0", msg: "Jumlahkan tiap baris matriks P." },
          { kind: "stdout_matches", task: "t2", pattern: "row_sums=\\[1\\.0, 1\\.0, 1\\.0\\]", label: "`print` menampilkan row_sums", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Baris jumlah = 1. Selalu. Tes 5 detik.",
    },
    {
      id: "pangkat-matriks",
      eyebrow: "Langkah 2 · n langkah",
      title: "P\u00B2 = semua jalur 2-langkah",
      prose: [
        "P(X_n=j | X_0=i) = (P^n)_ij. Contoh: dari Telat, 2 bulan lagi di Macet? (P\u00B2)_Telat\u2192Macet = 0,6\u00D70,01 + 0,3\u00D70,10 + 0,1\u00D70,70 = 0,106. Tiga jalur: Telat\u2192Lancar\u2192Macet (0,006), Telat\u2192Telat\u2192Macet (0,03), Telat\u2192Macet\u2192Macet (0,07).",
        "Distribusi vektor: \u03C0^(n) = \u03C0^(0) P^n. Contoh 6 bulan: awal 1.000 Telat \u2192 \u03C0^(0)=(0,1,0). Baris Telat dari P^6 \u2248 (0,72; 0,13; 0,15) \u2192 prediksi: 720 lancar, 130 telat, 150 macet. Satu perkalian matriks menjawab \u201C6 bulan lagi\u201D!",
        "Inti Chapman-Kolmogorov: (P\u00B2)_ij = \u03A3_k P_ik P_kj \u2014 \u201Csemua jalan dari i ke j via k\u201D.",
      ],
      formula: String.raw`P(X_{n} = j \mid X_0 = i) = (P^n)_{ij} \qquad \pi^{(n)} = \pi^{(0)} P^n`,
      formulaNote: "P^n = matriks transisi dipangkatkan n: entrinya (P^n)_{ij} menjumlahkan peluang SEMUA jalur n-langkah dari i ke j; π^{(0)} = distribusi awal (vektor baris); π^{(n)} = π^{(0)}P^n = distribusi setelah n langkah. Contoh angka: (P²)_{Telat→Macet} = 0,6×0,01 + 0,3×0,10 + 0,1×0,70 = 0,006+0,03+0,07 = 0,106 — angka ini artinya peluang dari Telat menjadi Macet dalam 2 bulan adalah 10,6%, dijumlah dari tiga jalur: via Lancar (0,6%), via Telat (3%), via Macet (7%). Perkalian matriks di sini bukan aljabar abstrak — ia adalah akuntansi semua jalan yang mungkin.",
      tasks: [
        { id: "t1", text: "Tulis fungsi `matmul(A, B)` perkalian matriks 3x3" },
        { id: "t2", text: "Hitung `p2` = P\u00B2 lalu `ans` = P(Telat\u2192Macet, 2 bln)" },
        { id: "t3", text: "Cetak `ans` dengan 3 desimal" },
      ],
      expected: "ans=0.106",
      note: {
        title: "Sering salah",
        body: "\u201CPangkat matriks = pangkatkan tiap elemen.\u201D SALAH! P\u00B2 adalah perkalian matriks (jumlahkan semua jalur 2-langkah), bukan kuadrat per elemen.",
      },
      hints: [
        "matmul: [[sum(A[i][k]*B[k][j] for k in range(3)) ...]].",
        "p2 = matmul(P, P); ans = p2[1][2].",
        "print(f\"ans={ans:.3f}\")",
      ],
      code: {
        starter: `P = [[0.95, 0.04, 0.01],\n     [0.60, 0.30, 0.10],\n     [0.10, 0.20, 0.70]]\n\ndef matmul(A, B):\n    # TULIS KODEMU: perkalian matriks 3x3\n    return \n\np2 = matmul(P, P)\nans = p2[1][2]\nprint(f"ans={ans:.3f}")`,
        lockLines: 4,
        solution: `P = [[0.95, 0.04, 0.01],\n     [0.60, 0.30, 0.10],\n     [0.10, 0.20, 0.70]]\n\ndef matmul(A, B):\n    # TULIS KODEMU: perkalian matriks 3x3\n    return [[sum(A[i][k]*B[k][j] for k in range(3)) for j in range(3)] for i in range(3)]\n\np2 = matmul(P, P)\nans = p2[1][2]\nprint(f"ans={ans:.3f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "matmul", label: "`matmul` terdefinisi", msg: "Tulis fungsi perkalian matriks." },
          { kind: "equal", task: "t2", name: "ans", value: 0.106, tol: 0.001, label: "`ans` seharusnya 0,106", msg: "0,6\u00D70,01 + 0,3\u00D70,10 + 0,1\u00D70,70 = 0,106." },
          { kind: "stdout_matches", task: "t3", pattern: "ans=0\\.106", label: "`print` menampilkan ans", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "P^n = semua jalur n-langkah. Kalikan matriks, jangan kuadratkan elemen.",
    },
    {
      id: "stasioner",
      eyebrow: "Langkah 3 · Distribusi stasioner",
      title: "Takdir jangka panjang portofolio",
      prose: [
        "\u03C0 = \u03C0P, \u03A3\u03C0_i = 1. \u201CDistribusi yang jika dicapai, tetap selamanya.\u201D Untuk rantai irreducible & aperiodik, apa pun awalnya \u2192 konvergen ke \u03C0 (unik!). Selesaikan untuk matriks di atas: \u03C0 \u2248 (0,86; 0,08; 0,06).",
        "Artinya: dalam jangka panjang, portofolio stabil di 86% lancar, 8% telat, 6% macet \u2014 apa pun kondisi awal! \u03C0 adalah \u201Ckomposisi keseimbangan\u201D portofolio. Jika komposisi saat ini jauh dari \u03C0, ia akan \u201Cmelayang\u201D ke sana \u2014 prediksi struktural tanpa perlu forecast ekonomi!",
        "Cara mudah: iterasikan \u03C0^(n+1) = \u03C0^(n) P sampai stabil (50 iterasi cukup). Tidak perlu eigenvector manual.",
      ],
      formula: String.raw`\pi = \pi P, \qquad \sum_i \pi_i = 1`,
      formulaNote: "π (pi) = distribusi stasioner: vektor peluang tiap status; π = πP artinya jika distribusi ini dicapai, satu langkah kemudian tetap sama — titik tetap dari perkalian matriks; Σ π_i = 1 memastikan ia tetap distribusi peluang yang sah. Untuk rantai irreducible dan aperiodik, π unik dan π^{(n)} → π dari awal mana pun. Contoh maknanya: jika π = (0,80; 0,15; 0,05), angka ini artinya dalam jangka panjang 5% portofolio akan macet berapa pun kondisi awalnya — takdir jangka panjang yang ditentukan struktur P, bukan titik berangkat. Pricing jangka panjang dan provisioning memakai π; tetapi ingat: stasioner berarti konsisten, bukan berarti baik.",
      tasks: [
        { id: "t1", text: "Iterasikan `pi = pi @ P` 50x dari awal (0,1,0)" },
        { id: "t2", text: "Cetak `pi` akhir dengan 2 desimal" },
      ],
      expected: "pi\u2248[0.86, 0.08, 0.06]",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Stasioner memberi jangkar prediksi \u2014 tapi jangkarnya hanya sekuat asumsi stasioneritas matriks. Transisi tidak stasioner: saat resesi, P(telat\u2192macet) naik! Praktik benar: matriks bersyarat rezim.",
      },
      hints: [
        "vec_mul(v, M) = [sum(v[i]*M[i][j] ...) ...].",
        "Loop 50x: pi = vec_mul(pi, P).",
        "print hasil 2 desimal.",
      ],
      code: {
        starter: `P = [[0.95, 0.04, 0.01],\n     [0.60, 0.30, 0.10],\n     [0.10, 0.20, 0.70]]\n\ndef vec_mul(v, M):\n    return [sum(v[i]*M[i][j] for i in range(3)) for j in range(3)]\n\npi = [0.0, 1.0, 0.0]\n# TULIS KODEMU: iterasi 50x menuju stasioner\nfor _ in range(50):\n    pi = \n\nprint(f"pi=[{pi[0]:.2f}, {pi[1]:.2f}, {pi[2]:.2f}]")`,
        lockLines: 7,
        solution: `P = [[0.95, 0.04, 0.01],\n     [0.60, 0.30, 0.10],\n     [0.10, 0.20, 0.70]]\n\ndef vec_mul(v, M):\n    return [sum(v[i]*M[i][j] for i in range(3)) for j in range(3)]\n\npi = [0.0, 1.0, 0.0]\n# TULIS KODEMU: iterasi 50x menuju stasioner\nfor _ in range(50):\n    pi = vec_mul(pi, P)\n\nprint(f"pi=[{pi[0]:.2f}, {pi[1]:.2f}, {pi[2]:.2f}]")`,
        checks: [
          { kind: "equal", task: "t1", name: "pi[0]", value: 0.86, tol: 0.02, label: "\u03C0 lancar \u2248 0,86", msg: "Iterasi 50x harus konvergen ke ~0,86." },
          { kind: "equal", task: "t1", name: "pi[2]", value: 0.06, tol: 0.02, label: "\u03C0 macet \u2248 0,06", msg: "Iterasi 50x harus konvergen ke ~0,06." },
          { kind: "stdout_matches", task: "t2", pattern: "pi=\\[0\\.8\\d, 0\\.0\\d, 0\\.0\\d\\]", label: "`print` menampilkan pi", msg: "Cetak dengan format pi=[..., ..., ...]." },
        ],
      },
      reference: "Iterasi \u03C0P sampai stabil. Takdir jangka panjang, jangkar prediksi.",
    },
    {
      id: "roll-rate",
      eyebrow: "Langkah 4 · Roll rate",
      title: "Dari T30 ke macet: rantai perkalian",
      prose: [
        "Roll rate collection: T30 \u2192 T60: 40%; T60 \u2192 T90: 50%; T90 \u2192 Macet: 60%. Dari Rp1 M di T30, berapa ekspektasi yang jadi macet 3 bulan lagi? (Asumsi: yang tidak roll kembali lancar.)",
        "P(T30 \u2192 Macet dalam 3 langkah) = 0,4 \u00D7 0,5 \u00D7 0,6 = 0,12. Ekspektasi macet = Rp1 M \u00D7 0,12 = Rp120 juta. Bandingkan dengan \u201Casumsi roll 100%\u201D: Rp1 M \u2014 estimasi naif 8x lipat terlalu besar. Roll rate = realisme.",
        "Rantai perkalian roll rate = inti provisioning IFRS 9 staging. Tiga angka kecil (0,4; 0,5; 0,6) mengalahkan satu asumsi besar.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p_mac` = P(T30\u2192Macet dalam 3 langkah)" },
        { id: "t2", text: "Hitung `ekspektasi` (rupiah) dari Rp1 M, cetak keduanya" },
      ],
      expected: "p_mac=0.12  ekspektasi=120000000",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Roll rate = inti provisioning IFRS 9. Tanpa rantai ini, cadangan dihitung dari asumsi \u2014 bukan dari perilaku migrasi aktual.",
      },
      hints: [
        "p_mac = 0.4 * 0.5 * 0.6.",
        "ekspektasi = 1_000_000_000 * p_mac.",
        "print(f\"p_mac={p_mac}  ekspektasi={int(ekspektasi)}\")",
      ],
      code: {
        starter: `# Roll rate: T30->T60 40%, T60->T90 50%, T90->Macet 60%\n\n# TULIS KODEMU: peluang 3-langkah dan ekspektasi dari Rp1 M\np_mac = \nekspektasi = \n\nprint(f"p_mac={p_mac}  ekspektasi={int(ekspektasi)}")`,
        lockLines: 1,
        solution: `# Roll rate: T30->T60 40%, T60->T90 50%, T90->Macet 60%\n\n# TULIS KODEMU: peluang 3-langkah dan ekspektasi dari Rp1 M\np_mac = 0.4 * 0.5 * 0.6\nekspektasi = 1_000_000_000 * p_mac\n\nprint(f"p_mac={p_mac}  ekspektasi={int(ekspektasi)}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p_mac", value: 0.12, tol: 1e-9, label: "`p_mac` seharusnya 0,12", msg: "0,4\u00D70,5\u00D70,6 = 0,12." },
          { kind: "equal", task: "t2", name: "ekspektasi", value: 120000000, tol: 1e-9, label: "`ekspektasi` seharusnya 120 jt", msg: "1 M \u00D7 0,12 = 120 juta." },
          { kind: "stdout_matches", task: "t2", pattern: "p_mac=0\\.12\\s+ekspektasi=120000000", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Kalikan sepanjang rantai. Roll rate = realisme vs asumsi.",
    },
    {
      id: "minicase-vintage",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Vintage 2024: kapan macetnya puncak?",
      prose: [
        "Vintage kredit 2024: 5.000 akun, semua \u201CLancar\u201D di bulan 0. Direksi tanya: \u201CKapan jumlah Macet mencapai puncak, dan berapa? Kami siapkan tim collection.\u201D Jalankan proyeksi 12 bulan dari \u03C0 awal [5000,0,0]: Macet naik terus awalnya, mencapai puncak sekitar bulan 18\u201324 (~600\u2013700 akun), lalu melandai menuju stasioner.",
        "Mengapa tidak monoton naik? Karena Macet bukan absorbing di matriks ini (10% kembali lancar/bulan) \u2014 ada arus masuk (dari Telat) dan arus keluar (sembuh). Puncak = saat arus masuk = arus keluar.",
        "Pelajaran modeling: definisi status menentukan dinamika! Jika \u201CMacet\u201D didefinisikan absorbing (write-off), kurvanya monoton naik \u2014 keputusan definisi = keputusan hasil. Selalu tanyakan definisi status sebelum percaya proyeksi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "\u201CMatriks transisi historis bisa dipakai mentah untuk forecast\u201D \u2014 hanya jika dunia stasioner, padahal tidak. Matriks 2019 (tenang) meremehkan transisi buruk saat 2020. Solusi: dua matriks (baseline + stress).",
      },
      quiz: [
        {
          q: "Mengapa jumlah Macet tidak monoton naik di proyeksi vintage?",
          options: [
            { text: "Matriksnya salah", why: "Salah: matriksnya valid \u2014 dinamikanya memang begitu." },
            { text: "Macet bukan absorbing: ada arus masuk (dari Telat) dan arus keluar (sembuh 10%)", why: "Benar: puncak = saat arus masuk = arus keluar.", correct: true },
            { text: "Nasabah baru terus masuk", why: "Salah: vintage tertutup \u2014 tidak ada nasabah baru." },
          ],
        },
        {
          q: "Jika \u201CMacet\u201D didefinisikan absorbing (write-off), kurvanya\u2026",
          options: [
            { text: "Tetap naik-turun", why: "Salah: absorbing = tak bisa keluar." },
            { text: "Monoton naik menuju 100%", why: "Benar: keputusan definisi = keputusan hasil. Tanyakan definisi status dulu!", correct: true },
            { text: "Datar", why: "Salah: arus masuk dari Telat tetap ada." },
          ],
        },
      ],
      reference: "Definisi status menentukan dinamika. Stress matriksnya.",
    },
    {
      id: "markov-quiz",
      eyebrow: "Langkah 6 · Cek cepat",
      title: "Sifat Markov dalam dua soal",
      prose: [
        "Dua pertanyaan untuk mengunci fondasi sebelum checkpoint.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Sifat Markov artinya\u2026",
          options: [
            { text: "Masa depan tergantung seluruh sejarah", why: "Salah: itu kebalikannya." },
            { text: "Masa depan hanya tergantung status kini", why: "Benar: P(X_{n+1}|X_n, sejarah) = P(X_{n+1}|X_n). Pelupa tapi powerful.", correct: true },
            { text: "Tidak ada keacakan", why: "Salah: transisinya tetap acak." },
          ],
        },
        {
          q: "(P\u00B2)_ij dihitung dengan\u2026",
          options: [
            { text: "Kuadrat tiap elemen", why: "Salah: itu bukan perkalian matriks." },
            { text: "Perkalian matriks: \u03A3_k P_ik P_kj (semua jalur 2-langkah)", why: "Benar: Chapman-Kolmogorov \u2014 jumlahkan semua jalan via status antara.", correct: true },
            { text: "P_ij \u00D7 2", why: "Salah: tidak ada dasarnya." },
          ],
        },
      ],
      note: {
        title: "Intuisi: matriks P adalah mesin peramal — pangkatkan untuk melihat masa depan",
        body: "Sifat Markov — masa depan hanya peduli hari ini — terdengar seperti penyederhanaan, tetapi justru itulah kekuatannya: seluruh sejarah portofolio diringkas menjadi matriks P. Praktisi memakainya sebagai mesin peramal dua kecepatan. Untuk horizon pendek, pangkatkan: P² memberi peluang dua langkah ke depan, dan setiap entrinya adalah jumlah semua jalur yang mungkin — roll-rate analysis pada dasarnya adalah perkalian berantai peluang bersyarat. Untuk horizon panjang, cari titik tetapnya: π = πP adalah takdir jangka panjang portofolio, berapa pun kondisi awalnya. Aturan keputusannya: butuh vintage analysis — pakai P^n; butuh steady state untuk pricing — pakai π. Tetapi mesin ini punya syarat operasi: rantai harus stabil. Krisis mengubah P itu sendiri — matriks yang dikalibrasi di tahun tenang meramalkan tahun tenang. Jebakan yang terasa: menganggap stasioner berarti aman. Stasioner hanya berarti perilakunya konsisten, bukan berarti baik — portofolio bisa konvergen ke 15% macet dengan sangat konsisten. Selalu baca π-nya, bukan hanya keberadaannya.",
      },

      reference: "Markov: kini cukup. P^n: semua jalur.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Baca alasan tiap opsi sebelum lanjut ke B15.",
      ],
      tasks: [],
      summary: [
        "Sifat Markov: masa depan | kini \u2014 cukup matriks transisi P (baris jumlah 1).",
        "n langkah: (P^n)_ij via perkalian matriks (semua jalur).",
        "Stasioner: \u03C0 = \u03C0P \u2014 takdir jangka panjang, jangkar prediksi.",
        "Aplikasi: migrasi rating, roll rate; absorbing state untuk default.",
        "Jangan pakai matriks historis mentah \u2014 stress per rezim; jangan kuadratkan elemen (kalikan matriks!).",
      ],
      next: { label: "B15 \u2014 Proses Stokastik", href: "/learn/b15-proses-stokastik" },
      quiz: [
        {
          q: "Distribusi stasioner \u03C0 memenuhi\u2026",
          options: [
            { text: "\u03C0 = P\u03C0", why: "Salah: itu eigenvector kanan \u2014 untuk distribusi baris, yang benar \u03C0=\u03C0P." },
            { text: "\u03C0 = \u03C0P dan \u03A3\u03C0_i=1", why: "Benar: eigenvector kiri eigenvalue 1 \u2014 \u201Ctakdir jangka panjang\u201D.", correct: true },
            { text: "\u03C0 = P\u00B2", why: "Salah: tidak ada hubungannya." },
          ],
        },
        {
          q: "Status Default sebagai absorbing state artinya\u2026",
          options: [
            { text: "Bisa keluar lagi", why: "Salah: itu kebalikannya." },
            { text: "Sekali masuk tak keluar (baris = [0,\u2026,1])", why: "Benar: menyerap. Analisis fokus ke waktu/peluang absorbsi.", correct: true },
            { text: "Tidak pernah dimasuki", why: "Salah: justru pasti dimasuki dari status lain." },
          ],
        },
        {
          q: "Kelemahan memakai matriks historis mentah\u2026",
          options: [
            { text: "Tidak ada", why: "Salah: dunia tidak stasioner." },
            { text: "Transisi tidak stasioner \u2014 krisis mengubahnya; butuh skenario stress", why: "Benar: matriks 2019 \u2260 matriks 2020. Butuh baseline + stress.", correct: true },
            { text: "Terlalu akurat", why: "Salah: masalahnya justru bisa terlalu optimistis." },
          ],
        },
        {
          q: "Cuaca: Cerah\u2192Cerah 0,7/Hujan 0,3; Hujan\u2192Cerah 0,4/Hujan 0,6. Hari ini cerah. Peluang lusa hujan?",
          options: [
            { text: "0,39", why: "Benar: 0,7\u00D70,3 + 0,3\u00D70,6 = 0,21+0,18 = 0,39.", correct: true },
            { text: "0,3", why: "Salah: itu peluang besok hujan, bukan lusa." },
            { text: "0,6", why: "Salah: itu peluang hujan\u2192hujan." },
          ],
        },
        {
          q: "Rantai cuaca di atas dijalankan sangat lama. Proporsi hari hujan?",
          options: [
            { text: "\u224842,9%", why: "Benar: \u03C0H = 3/7 \u2248 42,9% dari \u03C0=\u03C0P.", correct: true },
            { text: "50%", why: "Salah: rantai tidak simetris." },
            { text: "60%", why: "Salah: itu peluang hujan\u2192hujan, bukan stasioner." },
          ],
        },
      ],
    },
  ],
};
