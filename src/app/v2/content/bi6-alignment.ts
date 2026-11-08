import type { V2Lesson } from "../lib/types";

export const bi6: V2Lesson = {
  slug: "bi6-alignment",
  track: "Bioinformatika",
  module: "Sekuens & Evolusi",
  title: "BI6 · Alignment & BLAST: Menyelaraskan Sekuens",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Satu huruf yang menyelamatkan",
      prose: [
        "2019: sekuens virus misterius dari Wuhan di-upload ke database. Dalam hitungan jam, alignment menunjukkan ia 96% mirip virus kelelawar — bukan flu biasa. Satu alignment mengubah respons dunia. Tanpa algoritma penyelarasan sekuens, genom hanyalah huruf acak.",
        "Alignment adalah operasi paling fundamental bioinformatika: membandingkan dua sekuens huruf-per-huruf untuk menemukan kemiripan dan perbedaan. Lesson ini membedah mesinnya — dari dynamic programming klasik sampai BLAST.",
        "Twist-nya: angka “96% mirip” nyaris tidak berarti tanpa statistik di belakangnya — yang membedakan temuan nyata dari kebetulan adalah E-value, bukan persen identitas. Dan alignment “terbaik secara matematis” belum tentu benar secara biologi: skor BLOSUM dan gap penalty adalah asumsi evolusi yang disamarkan sebagai angka.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa “96% mirip” saja tidak cukup sebagai bukti" },
        { id: "t2", text: "Sebutkan dua asumsi yang tersembunyi di dalam skor alignment" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira persen identitas tinggi pasti berarti fungsi sama. Di bawah ~30% (twilight zone) fungsi tidak bisa disimpulkan; paralog yang sangat mirip pun bisa beda fungsi. Cek coverage, domain konservatif, dan bukti eksperimental.",
      },
      reference: "Alignment = hipotesis kemiripan tercepat; validasi = kewajiban.",
    },
    {
      id: "global-lokal",
      eyebrow: "Langkah 2 · Global vs lokal",
      title: "Needleman-Wunsch vs Smith-Waterman",
      prose: [
        "Global (Needleman-Wunsch): selaraskan SELURUH sekuens ujung-ke-ujung — untuk dua sekuens seukuran yang homolog. Lokal (Smith-Waterman): cari segmen PALING MIRIP, abaikan sisa — untuk mencari domain atau motif di tengah sekuens panjang.",
        "Keduanya memakai dynamic programming: isi matriks skor dengan rekurens, lalu traceback. Smith-Waterman menambah opsi keempat: 0 (mulai baru → lokal).",
      ],
      formula: String.raw`F(i,j) = \max\begin{cases} F(i-1,j-1) + s(x_i, y_j) \ F(i-1,j) - d \ F(i,j-1) - d \end{cases}`,
      formulaNote: "Rekurens Needleman-Wunsch: diagonal = sejajarkan dua huruf; atas/kiri = buka gap.",
      tasks: [
        { id: "t1", text: "Untuk gen insulin manusia vs tikus (seukuran, homolog), pilih algoritmanya" },
        { id: "t2", text: "Untuk mencari domain kinase dalam protein besar, pilih algoritmanya" },
      ],
      reference: "Global = ujung-ke-ujung · lokal = segmen terbaik. Keduanya DP + traceback.",
    },
    {
      id: "lab-nw",
      eyebrow: "Langkah 3 · Lab",
      title: "Needleman-Wunsch dari nol",
      prose: [
        "Implementasi NW lengkap: isi matriks DP lalu traceback. Verifikasi contoh dari lesson ini: ACGT vs AGT dengan match +2, mismatch −1, gap −2 — skornya harus 4, dengan gap di huruf C.",
        "Perhatikan logika traceback: di tiap sel, pilih jalur yang konsisten dengan rekurens (diagonal, atas, atau kiri).",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi pengisian matriks `F` dengan rekurens" },
        { id: "t2", text: "Lengkapi traceback untuk membangun alignment" },
        { id: "t3", text: "Verifikasi skor = 4" },
      ],
      expected: "skor = 4 · ACGT / A-GT",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira alignment terbaik = kebenaran evolusi. Alignment optimal menurut SKOR, bukan menurut sejarah — skor tergantung matriks dan gap penalty yang kamu pilih. Untuk klaim evolusi butuh analisis filogenetik dengan model substitusi eksplisit, bukan sekadar skor alignment.",
      },
      hints: [
        "F[i][j] = max(diagonal + s, atas + gap, kiri + gap).",
        "s = match jika huruf sama, else mismatch.",
        "Traceback: bandingkan F[i][j] dengan tiap opsi untuk tahu jalur mana.",
      ],
      code: {
        starter: `def needleman_wunsch(x, y, match=2, mismatch=-1, gap=-2):\n    n, m = len(x), len(y)\n    F = [[0]*(m+1) for _ in range(n+1)]\n    for i in range(1, n+1): F[i][0] = i*gap\n    for j in range(1, m+1): F[0][j] = j*gap\n    for i in range(1, n+1):\n        for j in range(1, m+1):\n            s =  # TULIS KODEMU: match atau mismatch?\n            F[i][j] =  # TULIS KODEMU: rekurens max\n    ax, ay, i, j = [], [], n, m\n    while i > 0 or j > 0:\n        s = match if (i>0 and j>0 and x[i-1]==y[j-1]) else mismatch\n        if i>0 and j>0 and F[i][j] == F[i-1][j-1]+s:\n            ax.append(x[i-1]); ay.append(y[j-1]); i-=1; j-=1\n        elif i>0 and F[i][j] == F[i-1][j]+gap:\n            ax.append(x[i-1]); ay.append('-'); i-=1\n        else:\n            ax.append('-'); ay.append(y[j-1]); j-=1\n    return F[n][m], ''.join(ax[::-1]), ''.join(ay[::-1])\n\nskor, a1, a2 = needleman_wunsch('ACGT', 'AGT')\nprint(f'skor = {skor} (harus 4)')\nprint(a1)\nprint(a2)`,
        lockLines: 1,
        solution: `def needleman_wunsch(x, y, match=2, mismatch=-1, gap=-2):\n    n, m = len(x), len(y)\n    F = [[0]*(m+1) for _ in range(n+1)]\n    for i in range(1, n+1): F[i][0] = i*gap\n    for j in range(1, m+1): F[0][j] = j*gap\n    for i in range(1, n+1):\n        for j in range(1, m+1):\n            s = match if x[i-1] == y[j-1] else mismatch\n            F[i][j] = max(F[i-1][j-1]+s, F[i-1][j]+gap, F[i][j-1]+gap)\n    ax, ay, i, j = [], [], n, m\n    while i > 0 or j > 0:\n        s = match if (i>0 and j>0 and x[i-1]==y[j-1]) else mismatch\n        if i>0 and j>0 and F[i][j] == F[i-1][j-1]+s:\n            ax.append(x[i-1]); ay.append(y[j-1]); i-=1; j-=1\n        elif i>0 and F[i][j] == F[i-1][j]+gap:\n            ax.append(x[i-1]); ay.append('-'); i-=1\n        else:\n            ax.append('-'); ay.append(y[j-1]); j-=1\n    return F[n][m], ''.join(ax[::-1]), ''.join(ay[::-1])\n\nskor, a1, a2 = needleman_wunsch('ACGT', 'AGT')\nprint(f'skor = {skor} (harus 4)')\nprint(a1)\nprint(a2)`,
        checks: [
          { kind: "equal", task: "t3", name: "skor", value: 4, label: "`skor` = 4", msg: "ACGT vs AGT: 3 match (+6) + 1 gap (−2) = 4. Cek rekurens max dari tiga opsi." },
          { kind: "stdout_matches", task: "t2", pattern: "A-GT", label: "alignment memuat gap di C", msg: "Traceback harus menaruh '-' di posisi C: baris kedua A-GT." },
        ],
      },
      reference: "DP: isi matriks dengan max(diagonal, atas, kiri). Traceback dari kanan-bawah.",
    },
    {
      id: "lab-blosum",
      eyebrow: "Langkah 4 · Lab",
      title: "Efek matriks skor: BLOSUM vs seragam",
      prose: [
        "BLOSUM62 memberi skor substitusi dari data evolusi nyata: L↔I = +2 (keduanya hidrofobik — substitusi wajar), L↔P = −3 (sifat beda jauh — dihukum). Skema seragam memberi −1 untuk semua mismatch: buta kimia.",
        "Bandingkan skor alignment dua pasangan sekuens protein pendek dengan kedua skema, dan lihat substitusi konservatif dihargai.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `skor` untuk tiga kasus" },
        { id: "t2", text: "Bandingkan skor seragam vs BLOSUM untuk kedua pasangan" },
      ],
      expected: "MLI vs MII: seragam=7, BLOSUM=10 · MLI vs MPI: seragam=7, BLOSUM=5",
      hints: [
        "Jika a == b: kembalikan 4.",
        "Jika matriks diberikan: matriks.get((a,b), -2).",
        "Tanpa matriks: kembalikan -1 (seragam).",
      ],
      code: {
        starter: `blosum_mini = {('L','I'): 2, ('I','L'): 2, ('L','P'): -3, ('P','L'): -3}\n\ndef skor(a, b, matriks=None):\n    # TULIS KODEMU: 4 jika sama; matriks.get jika ada; -1 jika seragam\n    return \n\ndef skor_alignment(s1, s2, matriks=None):\n    return sum(skor(a, b, matriks) for a, b in zip(s1, s2))\n\ns1, s2 = 'MLI', 'MII'\ns3 = 'MPI'\nprint(f'MLI vs MII: seragam={skor_alignment(s1,s2)}, BLOSUM={skor_alignment(s1,s2,blosum_mini)}')\nprint(f'MLI vs MPI: seragam={skor_alignment(s1,s3)}, BLOSUM={skor_alignment(s1,s3,blosum_mini)}')`,
        lockLines: 1,
        solution: `blosum_mini = {('L','I'): 2, ('I','L'): 2, ('L','P'): -3, ('P','L'): -3}\n\ndef skor(a, b, matriks=None):\n    # TULIS KODEMU: 4 jika sama; matriks.get jika ada; -1 jika seragam\n    if a == b:\n        return 4\n    if matriks:\n        return matriks.get((a, b), -2)\n    return -1\n\ndef skor_alignment(s1, s2, matriks=None):\n    return sum(skor(a, b, matriks) for a, b in zip(s1, s2))\n\ns1, s2 = 'MLI', 'MII'\ns3 = 'MPI'\nprint(f'MLI vs MII: seragam={skor_alignment(s1,s2)}, BLOSUM={skor_alignment(s1,s2,blosum_mini)}')\nprint(f'MLI vs MPI: seragam={skor_alignment(s1,s3)}, BLOSUM={skor_alignment(s1,s3,blosum_mini)}')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "MLI vs MII: seragam=7, BLOSUM=10", label: "skor MLI vs MII benar", msg: "Seragam: 4+4+(−1)=7. BLOSUM: 4+4+2=10." },
          { kind: "stdout_matches", task: "t2", pattern: "MLI vs MPI: seragam=7, BLOSUM=5", label: "skor MLI vs MPI benar", msg: "Seragam: 4+4+(−1)=7. BLOSUM: 4+4+(−3)=5." },
        ],
      },
      reference: "BLOSUM = pengetahuan kimia dari evolusi. Tidak semua mismatch sama.",
    },
    {
      id: "blast",
      eyebrow: "Langkah 5 · BLAST",
      title: "E-value: kapan “mirip” berarti sesuatu",
      prose: [
        "BLAST mencari sekuens mirip di database raksasa via seed-and-extend: cocokkan kata pendek, perluas yang menjanjikan. Heuristik ini ~100x lebih cepat dari Smith-Waterman — dengan mengorbankan jaminan optimalitas.",
        "E-value = jumlah hit sebaik ini yang diharapkan secara acak. E=1e-50: mustahil kebetulan → homologi nyata. E=5: bisa kebetulan — abaikan. E-value tergantung ukuran database: database 10x lipat → E 10x besar untuk hit yang sama. Jangan bandingkan E-value lintas database.",
        "Selalu baca tiga angka: identitas, query coverage, dan E-value. Hit 100% identik tapi coverage 15% = domain kecil, bukan gen sama. Contoh jebakan: query gen resistensi 900 basa; hit A 99% identitas tapi alignment 45 basa (E=0,4) vs hit B 78% identitas alignment 870 basa (E=1e-120). Profesional memilih B.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa BLAST 100x lebih cepat dari Smith-Waterman" },
        { id: "t2", text: "Dari contoh hit A vs hit B, pilih yang benar dan alasannya" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira E-value kecil selalu berarti penting secara biologis. E-value mengukur signifikansi statistik, bukan biologis. Hit E=1e-100 tapi hanya 20 basa bisa jadi repeat/artefak. Lihat juga identitas, coverage, dan konteks.",
      },
      reference: "BLAST = seed-and-extend. E kecil + coverage penuh = percaya.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Gen resistensi yang “ditemukan”",
      prose: [
        "RS menemukan bakteri resisten. Sekuensing satu gen → BLAST → hit 99% identitas ke gen resistensi, E=1e-120. Tim menyimpulkan bakteri ini resisten via gen X dan mengganti antibiotik.",
        "Reviewer bertanya: (1) coverage query berapa? bila hanya 30%, itu domain umum bukan gen utuh. (2) Apakah gen X fungsional atau pseudogen — cek frameshift/stop prematur. (3) Apakah fenotipe resistensi diuji di lab (MIC)? Genotipe tanpa fenotipe = prediksi.",
        "Kesimpulan yang benar: “kandidat gen X terdeteksi; butuh uji MIC + cek integritas ORF sebelum ganti terapi.” BLAST memberi hipotesis tercepat di dunia — tapi hipotesis tetap harus diuji.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga pertanyaan reviewer dan kenapa masing-masing penting" },
        { id: "t2", text: "Tulis kesimpulan yang tepat untuk tim RS" },
      ],
      reference: "Kemiripan = hipotesis tercepat; validasi = kewajiban.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Algoritma apa untuk ukuran apa",
      prose: [
        "Dua sekuens seukuran dan homolog → Needleman-Wunsch. Optimal global; sederhana.",
        "Cari motif/domain dalam sekuens panjang → Smith-Waterman (lokal). Global akan memaksa alignment sampah di ujung.",
        "Cari di database raksasa → BLAST. Heuristik seed-and-extend: cepat dengan sensitivitas cukup.",
        "Banyak sekuens, lihat konservasi → MSA (MAFFT/MUSCLE). Kolom konservatif = posisi fungsional; input filogenetika.",
        "Aturan 10 detik: global untuk seukuran; lokal untuk motif; BLOSUM untuk protein; E-value kecil + coverage penuh = percaya; kemiripan = hipotesis, bukan vonis fungsi.",
      ],
      tasks: [
        { id: "t1", text: "Untuk identifikasi sekuens virus misterius dari database, pilih algoritmanya" },
        { id: "t2", text: "Untuk melihat posisi konservatif 50 sekuens spike, pilih algoritmanya" },
      ],
      reference: "2 sekuens → NW/SW · database raksasa → BLAST · banyak sekuens → MSA.",
    },
    {
      id: "adv-matriks-gap",
      eyebrow: "Langkah 8 · Advanced",
      title: "Skor adalah asumsi: matriks substitusi dan gap penalty",
      prose: [
        "Tidak ada “skor alignment yang benar” — yang ada hanya skor yang konsisten dengan asumsimu tentang evolusi. Matriks BLOSUM62 (default BLAST protein) diturunkan dari blok alignment protein yang ~62% identik: ia memberi skor positif untuk substitusi yang sering terjadi di alam (mis. I↔V, sesama hidrofobik) dan negatif untuk yang jarang. PAM250 sebaliknya dimodelkan untuk jarak evolusi jauh. Memakai BLOSUM62 untuk protein sangat jauh (atau sangat dekat) adalah memakai penggaris yang salah: sensitivitas turun, homologi terlewat.",
        "Gap penalty pun asumsi biologi: secara default BLAST memakai affine gap penalty — mahal untuk MEMBUKA gap (open ~11) tapi murah untuk MEMPERPANJANG (extend ~1). Ini mencerminkan biologi: satu delesi 10 basa (satu peristiwa) jauh lebih mungkin daripada 10 delesi 1 basa (sepuluh peristiwa). Menaikkan gap open menghasilkan alignment dengan sedikit gap panjang; menurunkannya menghasilkan banyak gap pendek. Dua analis dengan penalty berbeda bisa mendapat “alignment optimal” yang berbeda dari sekuens yang sama — dan keduanya benar menurut skornya masing-masing.",
        "Trade-off praktis: untuk sekuens dekat (mis. varian antar individu), penalty default bekerja baik. Untuk homologi jauh (twilight zone, < 25% identitas), turunkan ekspektasi: coba matriks untuk jarak jauh (PAM250/BLOSUM45), longgarkan gap penalty, dan selalu validasi dengan struktur atau fungsi — bukan dengan skor semata.",
        "Aturan keputusan: mulai dari default (BLOSUM62, gap 11/1), ubah hanya bila ada alasan biologi, dan laporkan parameter yang dipakai. “Alignment terbaik” tanpa menyebut matriks dan gap penalty adalah klaim yang tidak bisa direproduksi.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa gap open mahal + extend murah mencerminkan biologi delesi" },
        { id: "t2", text: "Untuk homologi jauh (<25% identitas), matriks dan strategi apa yang dicoba?" },
      ],
      reference: "BLOSUM62 = jarak sedang · affine gap: open mahal, extend murah · laporkan parameter selalu.",
    },
    {
      id: "adv-tipuan-alignment",
      eyebrow: "Langkah 9 · Advanced",
      title: "Semiglobal vs lokal, dan kapan alignment menipu",
      prose: [
        "Global (Needleman-Wunsch) memaksa seluruh sekuens sejajar; lokal (Smith-Waterman) mencari sub-sekuens paling mirip. Di antaranya ada semiglobal: ujung sekuens boleh “menggantung” tanpa penalti — tepat untuk overlap assembly (dua read yang tumpang tindih sebagian) dan untuk read mapping di mana read lebih pendek dari referensi. Memakai global untuk mencari domain kinase 200 aa di dalam protein 2.000 aa adalah kesalahan kategori: jawabannya tenggelam dalam penalti gap raksasa.",
        "Alignment menipu dalam empat pola klasik. Pertama, daerah low-complexity (poly-A, repeat): skor tinggi tanpa makna biologi — BLAST punya filter (DUST/SEG) yang default-nya AKTIF dengan alasan ini. Kedua, komposisi bias: dua protein kaya prolin terlihat “mirip” karena alfabetnya menyempit. Ketiga, paralog vs ortholog: kemiripan sekuens tidak menjamin fungsi sama — duplikasi gen lalu divergensi fungsi adalah hal biasa. Keempat, %identitas tanpa E-value: “96% mirip” pada alignment 25 basa tidak berarti apa-apa (E-value besar), sementara 30% pada 300 basa bisa sangat signifikan.",
        "Heuristik vs eksak adalah trade-off kecepatan-ketepatan: BLAST ~100x lebih cepat dari Smith-Waterman karena ia tidak memeriksa semua kemungkinan — ia mencari seed (kata pendek, default 11 basa / 3 aa) lalu memperluas. Konsekuensinya: homologi jauh tanpa seed yang cocok akan terlewat. Untuk kasus kritis (satu gen kandidat penyakit), pertimbangkan Smith-Waterman eksak atau HMMER (profile HMM) sebagai verifikasi.",
        "Aturan praktisi: klaim homologi selalu ditemani tiga angka — %identitas, panjang alignment, dan E-value. Satu angka saja adalah anekdot, bukan bukti.",
      ],
      tasks: [
        { id: "t1", text: "Untuk mencari domain 200 aa dalam protein 2.000 aa, pilih global/lokal/semiglobal dan alasannya" },
        { id: "t2", text: "Sebutkan tiga angka wajib saat mengklaim homologi dan kenapa %identitas saja tidak cukup" },
      ],
      reference: "Semiglobal untuk overlap/read · waspadai low-complexity & paralog · klaim = %id + panjang + E-value.",
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
        title: "Intuisi: alignment adalah hipotesis, bukan foto",
        body: "Tiga heuristik yang membedakan pengguna alignment dari ahlinya. Pertama, selalu tanya “hipotesis evolusi apa yang dikodekan skor ini?” sebelum percaya hasilnya: matriks dan gap penalty adalah asumsi tentang seberapa mahal mutasi dan delesi — ganti asumsi, ganti jawaban. Analis yang tidak bisa menyebut parameternya sedang melaporkan angka tanpa konteks. Kedua, bedakan kemiripan dari kekerabatan: alignment mengukur kemiripan (similarity); kekerabatan (homology) adalah klaim sejarah yang butuh bukti tambahan — E-value signifikan, panjang alignment memadai, dan ideally dukungan filogenetik. Kemiripan tinggi pada daerah repetitif adalah kemiripan tanpa kekerabatan. Ketiga, curigai hasil yang terlalu rapi: alignment sempurna 100% pada data biologis yang bising (atau sebaliknya, alignment yang “menemukan” homologi di setiap query) lebih sering menandakan parameter atau filter yang salah daripada penemuan besar. Kalibrasi dengan kontrol negatif — jalankan query acak (shuffled) dan lihat skor latarnya.",
      },
      summary: [
        "Global (NW): ujung-ke-ujung; lokal (SW): segmen terbaik; keduanya DP + traceback.",
        "BLOSUM: skor dari evolusi nyata; tidak semua mismatch sama.",
        "Gap affine: buka mahal, perpanjang murah.",
        "BLAST: seed-and-extend; E-value = hit acak yang diharapkan.",
        "Cek identitas + coverage + konteks sebelum vonis.",
        "MSA: kolom konservatif = posisi fungsional.",
      ],
      next: { label: "BI7 · Filogenetika & k-mer", href: "/v2/learn/bi7-filogenetika" },
      quiz: [
        {
          q: "Dua analis mengalignment sekuens yang sama dan mendapat “alignment optimal” yang berbeda. Penjelasan paling mungkin?",
          options: [
            { text: "Salah satunya salah hitung", why: "Belum tentu: “optimal” selalu relatif terhadap skor yang dipakai." },
            { text: "Mereka memakai matriks substitusi/gap penalty berbeda", why: "Skor = asumsi. Beda parameter → beda optimum. Keduanya bisa benar menurut skornya.", correct: true },
            { text: "Dynamic programming bersifat acak", why: "DP deterministik; yang bervariasi adalah parameter inputnya." },
            { text: "Sekuensnya terlalu pendek untuk dialignment", why: "Panjang bukan penyebab dua optimum berbeda dari input sama." },
          ],
        },
        {
          q: "BLAST melaporkan hit “96% identik” sepanjang 25 basa dengan E-value 2,3. Kesimpulan?",
          options: [
            { text: "Homologi kuat — 96% sangat tinggi", why: "%identitas tanpa konteks panjang dan E-value menyesatkan." },
            { text: "Tidak signifikan — alignment pendek dengan E-value > 1 bisa terjadi kebetulan", why: "E-value 2,3 berarti ~2 hit sebaik ini diharapkan kebetulan. Klaim butuh %id + panjang + E-value.", correct: true },
            { text: "Harus diulang dengan BLOSUM45", why: "Matriks bukan masalah utama; signifikansi statistiknyalah yang runtuh." },
            { text: "Pasti low-complexity", why: "Mungkin, tapi kesimpulan yang tepat adalah soal signifikansi, bukan tebakan penyebab." },
          ],
        },
        {
          q: "Untuk delesi 10 basa, analis A memakai gap open 11/extend 1, analis B memakai open 5/extend 5. Mana yang lebih mencerminkan biologi?",
          options: [
            { text: "B — gap murah memberi alignment lebih rapat", why: "Rapat ≠ biologis; open 5/extend 5 menyamakan 10 delesi 1-basa dengan 1 delesi 10-basa." },
            { text: "A — satu peristiwa delesi 10 basa jauh lebih mungkin daripada sepuluh peristiwa 1 basa", why: "Affine gap (open mahal, extend murah) mengodekan asumsi biologi indel.", correct: true },
            { text: "Sama saja — skor hanya angka", why: "Skor adalah asumsi; asumsi berbeda = jawaban berbeda = interpretasi berbeda." },
            { text: "Tergantung panjang sekuens", why: "Panjang bukan penentu; model peristiwa mutasilah yang menentukan." },
          ],
        },
        {
          q: "Kapan pakai Smith-Waterman (lokal) bukan Needleman-Wunsch?",
          options: [
            { text: "Selalu", why: "Lokal salah untuk sekuens seukuran yang homolog penuh." },
            { text: "Mencari segmen mirip (domain/motif) dalam sekuens panjang yang berbeda", why: "Lokal mengabaikan sisa sekuens. Global memaksa ujung-ke-ujung — buruk untuk fragmen.", correct: true },
            { text: "Tidak pernah", why: "Lokal adalah alat standar untuk pencarian motif." },
            { text: "Hanya untuk DNA", why: "Berlaku untuk protein juga." },
          ],
        },
        {
          q: "BLOSUM62 memberi L↔I skor +2 karena…",
          options: [
            { text: "Kebetulan", why: "Skor BLOSUM diturunkan dari data alignment nyata." },
            { text: "Keduanya hidrofobik — substitusi konservatif yang sering terjadi di alam", why: "Matriks dari data evolusi nyata. Tidak semua mismatch sama — kimia menentukan.", correct: true },
            { text: "Hurufnya mirip", why: "Kemiripan huruf tidak ada hubungannya dengan kimia asam amino." },
            { text: "Selalu positif", why: "Banyak pasangan justru negatif, mis. L↔P = −3." },
          ],
        },
        {
          q: "E-value = 1e-50 vs E-value = 3. Yang dipercaya?",
          options: [
            { text: "E=3", why: "E=3 berarti harapkan 3 hit kebetulan — itu noise." },
            { text: "E=1e-50 (mustahil kebetulan)", why: "E = hit acak yang diharapkan. 1e-50 = praktis mustahil acak → homologi nyata.", correct: true },
            { text: "Sama saja", why: "Berbeda 50 orde magnitude — tidak sama." },
            { text: "Tidak ada", why: "E=1e-50 adalah bukti homologi yang kuat." },
          ],
        },
        {
          q: "Hit BLAST 100% identitas tapi query coverage 15%. Interpretasi?",
          options: [
            { text: "Gen sama persis", why: "Hanya 15% query yang cocok — bukan gen utuh." },
            { text: "Hanya domain kecil yang cocok — bukan bukti gen sama; cek coverage", why: "Coverage sama pentingnya dengan identitas. Domain umum ada di ratusan protein berbeda.", correct: true },
            { text: "Pasti fungsional", why: "Fungsi butuh bukti eksperimental, bukan sekadar hit parsial." },
            { text: "Abaikan E-value", why: "E-value tetap relevan untuk menilai signifikansi." },
          ],
        },
        {
          q: "Dalam rekurens DP, opsi F(i-1,j) − d artinya…",
          options: [
            { text: "Match", why: "Match adalah opsi diagonal F(i-1,j-1) + s." },
            { text: "Buka/perpanjang gap (huruf x[i] tidak punya pasangan)", why: "Gerakan vertikal = gap di sekuens y. Tiga opsi = diagonal, atas, kiri.", correct: true },
            { text: "Selesai", why: "Selesai adalah kondisi batas, bukan opsi rekurens." },
            { text: "Mismatch", why: "Mismatch juga lewat diagonal, dengan skor substitusi negatif." },
          ],
        },
      ],
    },
  ],
};
