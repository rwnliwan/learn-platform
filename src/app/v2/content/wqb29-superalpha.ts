import type { V2Lesson } from "../lib/types";

const FIG_SHARPE = `<svg viewBox="0 0 600 340" role="img" aria-label="Bar chart Sharpe empat alpha individu versus blend naif dan blend seleksi.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Sharpe: individu vs blend naif vs blend seleksi (12 periode)</text>
<line x1="80" y1="40" x2="80" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<line x1="80" y1="260" x2="580" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="46" y="66" font-size="10" fill="var(--chart-text)">1.0</text>
<text x="46" y="160" font-size="10" fill="var(--chart-text)">0.5</text>
<text x="52" y="254" font-size="10" fill="var(--chart-text)">0</text>
<rect x="100" y="180" width="56" height="80" fill="var(--c1)" opacity="0.85"/>
<text x="128" y="172" font-size="10" fill="var(--chart-text)" text-anchor="middle">0.400</text>
<rect x="180" y="193" width="56" height="67" fill="var(--c1)" opacity="0.85"/>
<text x="208" y="185" font-size="10" fill="var(--chart-text)" text-anchor="middle">0.335</text>
<rect x="260" y="173" width="56" height="87" fill="var(--c1)" opacity="0.85"/>
<text x="288" y="165" font-size="10" fill="var(--chart-text)" text-anchor="middle">0.437</text>
<rect x="340" y="155" width="56" height="105" fill="var(--c1)" opacity="0.85"/>
<text x="368" y="147" font-size="10" fill="var(--chart-text)" text-anchor="middle">0.524</text>
<rect x="420" y="112" width="56" height="148" fill="#d97706" opacity="0.9"/>
<text x="448" y="104" font-size="10" fill="var(--chart-text)" text-anchor="middle">0.740</text>
<rect x="500" y="66" width="56" height="194" fill="#16a34a" opacity="0.9"/>
<text x="528" y="58" font-size="10" fill="var(--chart-text)" text-anchor="middle">0.970</text>
<text x="128" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">A</text>
<text x="208" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">B</text>
<text x="288" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">C</text>
<text x="368" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">D</text>
<text x="448" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">Naif</text>
<text x="528" y="282" font-size="10" fill="var(--chart-text)" text-anchor="middle">Seleksi</text>
<text x="100" y="310" font-size="11" fill="var(--chart-text)">Hijau (seleksi A+C+D) mengalahkan oranye (naif A+B+C+D) dan semua individu.</text>
<line x1="80" y1="155" x2="580" y2="155" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4 4"/>
<text x="584" y="158" font-size="9" fill="var(--chart-text)">0.524</text>
<text x="584" y="170" font-size="9" fill="var(--chart-text)">terbaik</text>
<rect x="100" y="322" width="10" height="10" fill="var(--c1)" opacity="0.85"/>
<text x="116" y="331" font-size="10" fill="var(--chart-text)">Individu</text>
<rect x="190" y="322" width="10" height="10" fill="#d97706" opacity="0.9"/>
<text x="206" y="331" font-size="10" fill="var(--chart-text)">Blend naif (4 alpha)</text>
<rect x="340" y="322" width="10" height="10" fill="#16a34a" opacity="0.9"/>
<text x="356" y="331" font-size="10" fill="var(--chart-text)">Blend seleksi (3 alpha)</text>
</g>
</svg>`;

export const wqb29: V2Lesson = {
  slug: "wqb29-superalpha",
  track: "WorldQuant Brain",
  module: "Riset Kuantitatif",
  title: "WQB29 — SuperAlpha: Blending Banyak Alpha Menjadi Satu Sinyal",
  estMinutes: 62,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua belas alpha lolos, satu SuperAlpha yang mengecewakan",
      prose: [
        "Raka, konsultan riset, akhirnya mengumpulkan sekitar 12 alpha yang masing-masing lolos kriteria submit. Ia membuka fitur SuperAlpha — penggabungan banyak alpha terpilih menjadi satu alpha gabungan — lalu memasukkan semuanya, memberi bobot terbesar pada alpha dengan Sharpe in-sample tertinggi. Ekspektasinya sederhana: dua belas sinyal bagus yang dilebur pasti mengalahkan satu sinyal mana pun.",
        "Hasil simulasinya justru memalukan: SuperAlpha pertamanya berada di bawah komponen terbaiknya sendiri. Autopsinya menemukan dua penyebab. Pertama, empat dari dua belas komponen itu berasal dari keluarga sinyal yang sama dan saling berkorelasi di atas 0,8 — mereka bukan empat taruhan berbeda, melainkan satu taruhan yang dibobot empat kali. Kedua, bobotnya dipilih dari peringkat performa in-sample, periode yang sama yang dipakai untuk menilai — komponen yang kebetulan sedang beruntung di data latih mendapat bobot terbesar, lalu kembali biasa saja sesudahnya.",
        "Kegagalan itu terasa tidak adil di permukaan: tidak ada satu pun komponennya yang buruk. Justru di situlah jebakannya bekerja. Gerbang submit menilai alpha satu per satu, sedangkan SuperAlpha dinilai sebagai satu kesatuan — dua belas nilai lolos individu tidak pernah menjanjikan satu nilai lolos gabungan.",
        "Raka sempat mencoba jalan pintas: menaikkan bobot komponen dengan Sharpe tertinggi sampai 50%. Hasilnya memburuk lagi, karena komponen itu ternyata berkorelasi 0,87 dengan tiga komponen lain — bobot 50% pada dirinya berarti bobot efektif jauh lebih besar pada satu faktor bersama. Ia sedang memusatkan risiko sambil merasa sedang memperkuat sinyal terbaik.",
        "Perbaikan yang akhirnya bekerja tidak dramatis: ia membuang tiga komponen yang redundan, menyisakan sembilan, lalu memakai equal weight. SuperAlpha versi kedua itu mengalahkan komponen terbaiknya dengan selisih yang tidak besar tetapi konsisten — dan untuk pertama kalinya, angka gabungannya bisa dijelaskan baris per baris, bukan diharapkan saja.",
        "Twist-nya: Raka tidak perlu alpha baru. Ia perlu seleksi yang kejam dan bobot yang rendah hati. Lesson ini mengajarkan konsep dan matematika blending SuperAlpha lewat simulasi Python yang bisa diverifikasi angka per angka, agar saat fitur konsultan itu dipakai sungguhan, keputusan seleksi dan bobotnya sudah terlatih. Ini bukan panduan klik platform — tombol dan menu bisa berubah; matematika korelasi tidak.",
        "Prasyarat ringkas: Sharpe adalah rata-rata return dibagi simpangan baku return — imbalan per satuan gejolak. Korelasi Pearson mengukur seberapa searah dua seri bergerak, dari -1 sampai 1. Self-correlation adalah korelasi sebuah alpha terhadap alpha lain yang sudah ada; di Brain, nilai di atas 0,7 diperlakukan sebagai terlalu mirip.",
        "Tidak ada pengetahuan platform yang diasumsikan di lesson ini: semua yang dibutuhkan adalah empat seri return, dua fungsi statistik dasar, dan kesediaan membuang komponen yang disukai bila angkanya berkata ia redundan.",
        "Urutan bacaan lesson mengikuti urutan kerja aslinya: dengarkan kegagalannya, pahami rumusnya, buktikan di lab, baca chart-nya, petakan keputusannya, uji pada kasus, lalu kunci dengan checkpoint.",
      ],
      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "SuperAlpha: portofolio sinyal di dalam satu alpha",
      prose: [
        "SuperAlpha adalah satu alpha gabungan yang return-nya merupakan rata-rata tertimbang dari return komponen-komponennya pada setiap periode. Ia bukan alpha ke-13 yang ajaib — ia portofolio mini yang diperdagangkan sebagai satu sinyal. Konsekuensinya, semua hukum portofolio berlaku penuh: kualitas gabungan ditentukan oleh kualitas komponen DAN korelasi antar mereka, bukan oleh jumlah komponen.",
        "Seleksi komponen adalah keputusan terpenting, mendahului soal bobot. Kriteria yang sehat: tiap komponen lolos gerbang individu (Sharpe, fitness, turnover), self-correlation antar komponen rendah — aturan kerja di lesson ini, komponen baru hanya diterima bila korelasinya < 0,7 terhadap semua komponen yang sudah terpilih — dan komponen datang dari keluarga sinyal berbeda (price-volume, fundamental, analis, sentimen). Dua alpha dari keluarga yang sama adalah tersangka utama korelasi tinggi, sekalipun ekspresi kodenya terlihat berbeda.",
        "Urutan seleksi yang deterministik mencegah keputusan berubah-ubah mengikuti mood: urutkan kandidat dari Sharpe tertinggi, mulai dari yang terkuat, lalu terima kandidat berikutnya hanya bila lolos uji korelasi terhadap semua yang sudah terpilih. Aturan greedy ini persis yang akan dijalankan di lab — tidak ada langkah 'kira-kira cocok', semua bisa diaudit ulang.",
        "Tiga metode bobot yang lazim: equal weight (semua komponen sama besar — baseline yang sulit dikalahkan karena tidak mengklaim tahu apa-apa), performance-based (bobot sebanding performa historis, misalnya Sharpe — intuitif, tetapi memberi porsi terbesar justru pada komponen yang paling mungkin sedang beruntung), dan correlation-aware (komponen yang unik — korelasinya rendah ke yang lain — diberi bobot lebih besar, komponen yang redundan dikecilkan atau dibuang).",
        "Bahaya bersama dua metode terakhir: keduanya diestimasi dari data yang sama yang dipakai menilai hasilnya. Bobot yang diturunkan dari performa in-sample adalah selection overfitting — memilih pemenang setelah melihat hasil lomba, lalu terkejut saat lomba berikutnya dimenangkan orang lain. Karena itu bobot sederhana sering menang di luar sampel: bukan karena equal weight pintar, melainkan karena ia tidak menghafal noise.",
        "Correlation-aware weighting melangkah satu tingkat dari seleksi biner terima-atau-buang: alih-alih menggugurkan komponen redundan sepenuhnya, bobotnya dikecilkan sebanding tumpang tindihnya, sedangkan komponen yang paling unik mendapat bobot lebih besar. Pendekatan ini masuk akal bila komponen redundan masih membawa sedikit informasi unik — tetapi parameter pengecilannya juga diestimasi dari data historis, jadi kerendahan hati yang sama tetap berlaku.",
        "Dua biaya blending yang sering dilupakan: turnover dan kapasitas perhatian. SuperAlpha mewarisi turnover gabungan komponennya — komponen yang sering berputar menaikkan biaya gesek seluruh gabungan, bukan hanya porsinya sendiri. Dan setiap komponen tambahan adalah satu sinyal lagi yang harus dipantau rezimnya; SuperAlpha berisi 20 komponen yang tidak terpantau adalah kotak hitam milik sendiri.",
        "Karena itu urutan kerja yang benar selalu sama: seleksi dulu, bobot kemudian, evaluasi terakhir — dan evaluasi itu idealnya memakai periode yang tidak dipakai memilih komponen maupun bobot. Bila seleksi, bobot, dan penilaian semuanya memakai data yang sama, angka akhirnya adalah nilai ujian yang soalnya sudah dibocorkan ke pesertanya sendiri.",
        "Satu pembeda penting: menggugurkan komponen dari SuperAlpha bukan vonis atas alpha itu. Alpha yang gugur karena berkorelasi 0,86 dengan komponen terpilih tetap bisa menjadi alpha mandiri yang bernilai, atau menjadi inti SuperAlpha lain dengan rekan yang berbeda. Seleksi bersifat relatif terhadap rombongan, bukan absolut terhadap kualitas individu.",
        "Jumlah komponen juga punya titik jenuh. Komponen pertama memberi sinyal, komponen kedua yang asing memberi diversifikasi besar, komponen ketiga dan keempat memberi lebih sedikit, dan setelah rombongan cukup beragam, komponen tambahan yang lolos ambang korelasi pun hanya mengubah hasil di margin. Mengejar jumlah demi jumlah menghabiskan slot seleksi yang seharusnya disimpan untuk keluarga sinyal yang belum terwakili.",
        "Korelasi sendiri tidak diam: dua alpha yang berkorelasi 0,2 di periode tenang bisa berkorelasi 0,7 saat pasar stres, karena keduanya ternyata sama-sama bergantung pada likuiditas atau faktor gaya yang sama. Karena itu seleksi SuperAlpha bukan keputusan sekali seumur hidup — matriks korelasi komponen layak dihitung ulang secara berkala, dan komponen yang berubah menjadi redundan layak digugurkan di tengah jalan.",
        "Ada pula godaan arah sebaliknya: memburu korelasi negatif ekstrem demi varians sekecil mungkin. Pasangan berkorelasi -0,9 memang saling meniadakan gejolak, tetapi sering juga saling meniadakan return — yang tersisa adalah sinyal sangat tenang yang tidak menghasilkan apa-apa. Target seleksi adalah korelasi rendah dengan return yang tetap hidup, bukan korelasi paling negatif yang bisa ditemukan.",
        "Matematikanya ringkas. Return gabungan adalah jumlah tertimbang return komponen; varians gabungan memuat suku silang korelasi — di situlah komponen redundan menghukum SuperAlpha: bobot besar pada dua komponen berkorelasi 0,98 menaikkan varians hampir seperti menggandakan satu posisi, tanpa menggandakan diversifikasi.",
      ],
      formula: String.raw`r_{SA,t} = \sum_{i=1}^{n} w_i r_{i,t} \qquad \sigma_{SA}^2 = \sum_{i=1}^{n} w_i^2 \sigma_i^2 + \sum_{i \ne j} w_i w_j \rho_{ij} \sigma_i \sigma_j \qquad \sum_{i=1}^{n} w_i = 1`,
      formulaNote: "r_SA,t = return SuperAlpha pada periode t; n = jumlah komponen; w_i = bobot alpha ke-i (semua bobot berjumlah 1); r_i,t = return alpha ke-i pada periode t; sigma_SA kuadrat = varians gabungan; sigma_i = volatilitas alpha ke-i; rho_ij = korelasi antara alpha ke-i dan ke-j. Suku kedua adalah pajak redundansi: rho_ij mendekati 1 membuat varians gabungan membengkak, sedangkan rho_ij rendah atau negatif membuatnya menyusut.",
      note: {
        title: "🚨 Miskonsepsi", type: "pitfall",
        body: "“SuperAlpha berisi 12 alpha pasti lebih kuat dari SuperAlpha berisi 3 alpha.” Salah. Menambah komponen yang berkorelasi 0,9 ke komponen yang sudah ada tidak menambah sinyal baru — ia menambah bobot pada risiko lama dan mengencerkan komponen yang benar-benar berbeda. Tiga alpha yang saling asing bisa mengalahkan dua belas alpha yang isinya tiga taruhan berulang.",
      },
      tasks: [],
    },
    {
      id: "lab-superalpha",
      eyebrow: "Langkah 3 · Lab",
      title: "Blend naif melawan blend seleksi: buktikan dengan angka",
      prose: [
        "Data lab: empat seri return alpha, A, B, C, D, masing-masing 12 periode. Tulis dua fungsi tanpa library: pearson(x, y) untuk korelasi dan sharpe(rs) dengan simpangan baku populasi (dibagi n, bukan n-1). Hitung empat Sharpe individu dan enam korelasi berpasangan.",
        "Blend naif: equal weight atas keempat alpha — semua diterima, tanpa pertanyaan. Blend seleksi: terapkan aturan greedy dari konsep — urutkan alpha dari Sharpe tertinggi, terima alpha hanya bila korelasinya < 0,7 terhadap semua alpha yang sudah terpilih, lalu equal weight atas yang terpilih saja. Kerangka seleksi sudah disediakan di starter; tugasmu menghidupkannya lewat dua fungsi itu.",
        "Bandingkan tiga angka: Sharpe komponen terbaik, Sharpe blend naif, Sharpe blend seleksi. Vonisnya SELEKSI MENANG bila blend seleksi mengalahkan keduanya. Perhatikan siapa yang gugur dan kenapa: yang gugur bukan alpha terburuk — ia gugur karena terlalu mirip dengan alpha yang sudah terpilih lebih dulu.",
        "Urutan greedy patut ditelusuri manual sekali: D masuk pertama sebagai yang terkuat (0,524), C lolos karena korelasinya ke D hanya -0,334, A lolos karena korelasinya ke D dan C sama-sama rendah, lalu B menabrak corr(A,B)=0,983. Satu-satunya penolakan di seluruh proses itu cukup untuk mengubah hasil akhir secara material.",
        "Eksperimen setelah vonis tercetak: ubah ambang greedy dari 0,7 menjadi 0,99 di salinan kodemu dan jalankan ulang. B akan ikut terpilih, blend seleksi berubah menjadi blend naif, dan Sharpe-nya jatuh persis ke angka naif. Itulah bukti bahwa ambang korelasi — bukan jumlah alpha — yang menciptakan keunggulan seleksi.",
        "Eksperimen kedua: paksa B menggantikan A di blend seleksi (B+C+D) dan hitung Sharpe-nya. Hasilnya tetap kuat, karena B membawa faktor yang hampir sama dengan A. Pelajarannya bukan 'A istimewa', melainkan 'satu dari pasangan redundan itu cukup' — siapa yang bertahan ditentukan urutan greedy, bukan takdir.",
      ],
      tasks: [
        { id: "t1", text: "Tulis pearson & sharpe; hitung Sharpe individu dan 6 korelasi" },
        { id: "t2", text: "Bentuk blend naif dan blend seleksi greedy; cetak vonisnya" },
      ],
      expected: "Sharpe A=0.400 B=0.335 C=0.437 D=0.524\ncorr(A,B)=0.983 corr(A,C)=-0.202 corr(A,D)=-0.065\ncorr(B,C)=-0.204 corr(B,D)=-0.031 corr(C,D)=-0.334\nblend seleksi: A+C+D (3 alpha)\nSharpe terbaik=0.524 Sharpe naif=0.740 Sharpe seleksi=0.970 -> SELEKSI MENANG",
      note: {
        title: "Sering salah", type: "pitfall",
        body: "“B gugur karena Sharpe-nya paling rendah (0,335).” Bukan itu alasan formalnya. B gugur karena corr(A,B)=0,983 >= 0,7 — seandainya Sharpe B sedikit lebih tinggi dari A, aturan greedy akan menahan B lebih dulu dan A yang gugur. Yang diseleksi keluar adalah redundansi, bukan kelemahan.",
      },
      hints: [
        "pearson: (Σ(x-x̄)(y-ȳ)) / sqrt(Σ(x-x̄)² · Σ(y-ȳ)²). sharpe: mean / simpangan baku populasi.",
        "Urutkan kandidat dari Sharpe tertinggi: D, C, A, lalu B. B adalah satu-satunya yang menabrak korelasi >= 0,7 terhadap yang sudah terpilih (terhadap A).",
      ],
      code: {
        starter: "# Return 12 periode untuk 4 alpha. JANGAN UBAH.\nA = [0.026,0.017,-0.026,0.018,0.028,0.006,0.034,0.005,0.029,-0.034,0.012,-0.013]\nB = [0.015,0.016,-0.023,0.017,0.031,0.003,0.033,0.005,0.027,-0.041,0.014,-0.011]\nC = [0.002,-0.001,-0.007,0.022,0.002,-0.011,-0.017,-0.005,0.02,0.025,0.033,0.018]\nD = [-0.013,0.011,-0.01,-0.011,0.025,0.028,0.024,0.015,0.007,0.015,-0.018,0.038]\n\n# TULIS KODEMU\ndef pearson(x, y):\n    return\ndef sharpe(rs):\n    return\n\nnames = [\"A\",\"B\",\"C\",\"D\"]\nrets = [A,B,C,D]\ns_a, s_b, s_c, s_d = sharpe(A), sharpe(B), sharpe(C), sharpe(D)\ncab = pearson(A, B)\ncac = pearson(A, C)\ncad = pearson(A, D)\ncbc = pearson(B, C)\ncbd = pearson(B, D)\nccd = pearson(C, D)\nprint(f\"Sharpe A={s_a:.3f} B={s_b:.3f} C={s_c:.3f} D={s_d:.3f}\")\nprint(f\"corr(A,B)={cab:.3f} corr(A,C)={cac:.3f} corr(A,D)={cad:.3f}\")\nprint(f\"corr(B,C)={cbc:.3f} corr(B,D)={cbd:.3f} corr(C,D)={ccd:.3f}\")\nsharpes = [s_a, s_b, s_c, s_d]\ncorrs = {(\"A\",\"B\"): cab, (\"A\",\"C\"): cac, (\"A\",\"D\"): cad, (\"B\",\"C\"): cbc, (\"B\",\"D\"): cbd, (\"C\",\"D\"): ccd}\norder = sorted(range(4), key=lambda i: sharpes[i], reverse=True)\nterpilih_idx = []\nfor i in order:\n    ok = True\n    for j in terpilih_idx:\n        key = (names[min(i, j)], names[max(i, j)])\n        if corrs[key] >= 0.7:\n            ok = False\n    if ok:\n        terpilih_idx.append(i)\nterpilih_idx = sorted(terpilih_idx)\nterpilih = \"+\".join(names[i] for i in terpilih_idx)\nk = len(terpilih_idx)\nnaif = [(a+b+c+d)/4 for a, b, c, d in zip(A, B, C, D)]\nsel = [sum(rets[i][t] for i in terpilih_idx)/k for t in range(12)]\ns_naif = sharpe(naif)\ns_sel = sharpe(sel)\ns_best = max(sharpes)\nprint(f\"blend seleksi: {terpilih} ({k} alpha)\")\nmenang = \"SELEKSI MENANG\" if s_sel > s_naif and s_sel > s_best else \"SELEKSI KALAH\"\nprint(f\"Sharpe terbaik={s_best:.3f} Sharpe naif={s_naif:.3f} Sharpe seleksi={s_sel:.3f} -> {menang}\")\n",
        lockLines: 5,
        solution: "# Return 12 periode untuk 4 alpha. JANGAN UBAH.\nA = [0.026,0.017,-0.026,0.018,0.028,0.006,0.034,0.005,0.029,-0.034,0.012,-0.013]\nB = [0.015,0.016,-0.023,0.017,0.031,0.003,0.033,0.005,0.027,-0.041,0.014,-0.011]\nC = [0.002,-0.001,-0.007,0.022,0.002,-0.011,-0.017,-0.005,0.02,0.025,0.033,0.018]\nD = [-0.013,0.011,-0.01,-0.011,0.025,0.028,0.024,0.015,0.007,0.015,-0.018,0.038]\n\n# TULIS KODEMU\ndef pearson(x, y):\n    n = len(x)\n    mx, my = sum(x)/n, sum(y)/n\n    num = sum((a-mx)*(b-my) for a, b in zip(x, y))\n    den = (sum((a-mx)**2 for a in x)*sum((b-my)**2 for b in y))**0.5\n    return num/den if den else 0.0\ndef sharpe(rs):\n    n = len(rs)\n    m = sum(rs)/n\n    v = sum((r-m)**2 for r in rs)/n\n    return m/(v**0.5) if v > 0 else 0.0\n\nnames = [\"A\",\"B\",\"C\",\"D\"]\nrets = [A,B,C,D]\ns_a, s_b, s_c, s_d = sharpe(A), sharpe(B), sharpe(C), sharpe(D)\ncab = pearson(A, B)\ncac = pearson(A, C)\ncad = pearson(A, D)\ncbc = pearson(B, C)\ncbd = pearson(B, D)\nccd = pearson(C, D)\nprint(f\"Sharpe A={s_a:.3f} B={s_b:.3f} C={s_c:.3f} D={s_d:.3f}\")\nprint(f\"corr(A,B)={cab:.3f} corr(A,C)={cac:.3f} corr(A,D)={cad:.3f}\")\nprint(f\"corr(B,C)={cbc:.3f} corr(B,D)={cbd:.3f} corr(C,D)={ccd:.3f}\")\nsharpes = [s_a, s_b, s_c, s_d]\ncorrs = {(\"A\",\"B\"): cab, (\"A\",\"C\"): cac, (\"A\",\"D\"): cad, (\"B\",\"C\"): cbc, (\"B\",\"D\"): cbd, (\"C\",\"D\"): ccd}\norder = sorted(range(4), key=lambda i: sharpes[i], reverse=True)\nterpilih_idx = []\nfor i in order:\n    ok = True\n    for j in terpilih_idx:\n        key = (names[min(i, j)], names[max(i, j)])\n        if corrs[key] >= 0.7:\n            ok = False\n    if ok:\n        terpilih_idx.append(i)\nterpilih_idx = sorted(terpilih_idx)\nterpilih = \"+\".join(names[i] for i in terpilih_idx)\nk = len(terpilih_idx)\nnaif = [(a+b+c+d)/4 for a, b, c, d in zip(A, B, C, D)]\nsel = [sum(rets[i][t] for i in terpilih_idx)/k for t in range(12)]\ns_naif = sharpe(naif)\ns_sel = sharpe(sel)\ns_best = max(sharpes)\nprint(f\"blend seleksi: {terpilih} ({k} alpha)\")\nmenang = \"SELEKSI MENANG\" if s_sel > s_naif and s_sel > s_best else \"SELEKSI KALAH\"\nprint(f\"Sharpe terbaik={s_best:.3f} Sharpe naif={s_naif:.3f} Sharpe seleksi={s_sel:.3f} -> {menang}\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "s_a", value: 0.400, tol: 0.005, label: "`s_a` sekitar 0,400", msg: "Sharpe alpha A." },
          { kind: "equal", task: "t1", name: "s_d", value: 0.524, tol: 0.005, label: "`s_d` sekitar 0,524", msg: "Sharpe alpha D — komponen terkuat." },
          { kind: "equal", task: "t1", name: "cab", value: 0.983, tol: 0.002, label: "`cab` sekitar 0,983", msg: "A dan B hampir identik — redundansi yang harus gugur." },
          { kind: "equal", task: "t1", name: "ccd", value: -0.334, tol: 0.002, label: "`ccd` sekitar -0,334", msg: "C dan D bergerak berlawanan arah — diversifikasi nyata." },
          { kind: "equal", task: "t2", name: "s_naif", value: 0.740, tol: 0.005, label: "`s_naif` sekitar 0,740", msg: "Sharpe blend naif empat alpha." },
          { kind: "equal", task: "t2", name: "s_sel", value: 0.970, tol: 0.005, label: "`s_sel` sekitar 0,970", msg: "Sharpe blend seleksi A+C+D — tertinggi dari semuanya." },
          { kind: "stdout_matches", task: "t2", label: "Blend seleksi = A+C+D", msg: "B gugur oleh aturan korelasi greedy.", pattern: "blend seleksi: A\\+C\\+D \\(3 alpha\\)" },
          { kind: "stdout_matches", task: "t2", label: "Vonis SELEKSI MENANG tercetak", msg: "Seleksi mengalahkan blend naif dan komponen terbaik.", pattern: "Sharpe seleksi=0\\.970 -> SELEKSI MENANG" },
        ],
      },
      reference: "SuperAlpha yang bagus bukan yang paling ramai, tetapi yang paling beragam.",
    },
    {
      id: "chart",
      eyebrow: "Langkah 4 · Chart",
      title: "Membaca hasil blending: membuang satu alpha menaikkan semuanya",
      prose: [
        "Chart batang ini merangkum lab: empat batang biru adalah Sharpe individu, batang oranye adalah blend naif empat alpha, batang hijau adalah blend seleksi tiga alpha.",
        "Cara membaca: sumbu X = sinyal (A, B, C, D, Naif, Seleksi); tinggi batang = Sharpe (mean dibagi simpangan baku populasi, 12 periode); makin tinggi batang, makin besar imbalan per satuan gejolak.",
        "Interpretasi: blending saja sudah mengangkat Sharpe dari 0,524 (terbaik individu) ke 0,740 (naif) — bukti diversifikasi bekerja. Tetapi membuang B, komponen yang berkorelasi 0,983 ke A, mengangkatnya lagi ke 0,970. Kenaikan kedua itu gratis: tidak ada alpha baru, tidak ada data baru — hanya redundansi yang berhenti dibayar dua kali. Ingat skala kejujurannya: angka-angka ini dari data mainan 12 periode, bukan janji performa simulasi resmi.",
        "Perhatikan juga batang B: ia yang terpendek (0,335), tetapi pendeknya bukan alasan ia absen dari batang hijau. Seandainya B berkorelasi rendah ke semua rekannya, ia akan tetap masuk blend seleksi dan ikut mengangkatnya — batang seleksi menghargai perbedaan, bukan tinggi individu.",
        "Selisih naif ke seleksi (0,740 ke 0,970) lebih besar daripada selisih komponen terlemah ke terkuat (0,335 ke 0,524). Dalam blending, keputusan siapa yang dikeluarkan bisa bernilai lebih daripada perbedaan kualitas antar kandidat itu sendiri — fakta yang tidak akan pernah terlihat bila yang dibaca hanya daftar Sharpe individu.",
        "Garis putus-putus di chart menandai level komponen terbaik (0,524). Kedua batang blend melewatinya dengan mudah, tetapi hanya batang hijau yang melewatinya karena alasan yang benar dua kali: diversifikasi dari blending, lalu penghapusan redundansi dari seleksi.",
        "Bila chart semacam ini dibuat untuk SuperAlpha sungguhan, buatlah dari data yang sama sekali tidak dipakai saat memilih komponen. Chart yang digambar dari data seleksi akan selalu terlihat meyakinkan — ia sedang memotret keputusan yang baru saja dibuat di atas data yang sama.",
      ],
      figure: { svg: FIG_SHARPE, alt: "Bar chart Sharpe A 0,400, B 0,335, C 0,437, D 0,524, blend naif 0,740, blend seleksi 0,970", caption: "Blend seleksi A+C+D (0,970) mengalahkan blend naif (0,740) dan semua komponen individu." },
      tasks: [],
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta: merakit SuperAlpha tanpa membayar redundansi",
      prose: [
        "Peta ini dibaca dari atas ke bawah: temukan skenario yang paling mirip dengan daftar kandidatmu, lalu jalankan tindakan di kalimat terakhir skenario itu. Semua skenario mengasumsikan kandidat sudah lolos gerbang individu — SuperAlpha bukan tempat rehabilitasi alpha yang gagal.",
        "Skenario 1 — semua kandidat lolos gerbang individu, korelasi berpasangan < 0,7, keluarga sinyal beragam: gabungkan dengan equal weight. Ini kondisi ideal; jangan rusak dengan optimasi bobot.",
        "Skenario 2 — dua kandidat berkorelasi >= 0,7: simpan yang terpilih lebih dulu oleh urutan greedy (Sharpe lebih tinggi), gugurkan yang lain dari SuperAlpha ini — alpha yang gugur tetap hidup sebagai alpha mandiri, hanya tidak ikut diblend.",
        "Skenario 3 — godaan memberi bobot terbesar pada Sharpe in-sample tertinggi: tahan. Itu selection overfitting. Bila tetap ingin performance-based, pakai peringkat kasar (misalnya bobot bertingkat sederhana) dan terima bahwa sebagian keunggulannya semu.",
        "Skenario 4 — satu keluarga sinyal mendominasi daftar kandidat: batasi perwakilan keluarga itu sebelum blending. SuperAlpha yang isinya 8 varian momentum dan 1 fundamental adalah alpha momentum dengan aksesoris.",
        "Skenario 5 — blend seleksi kalah dari komponen terbaik di data uji: jangan paksa rilis. Artinya komponen-komponen itu tidak saling melengkapi; kembali ke seleksi, bukan menambah jumlah komponen.",
        "Aturan 10 detik: semua komponen lolos individu? Korelasi antar terpilih < 0,7 semua? Keluarga sinyal beragam? Bobot sederhana dan berjumlah 1? Empat ya = blend; satu tidak = perbaiki seleksinya dulu.",
        "Bila dua skenario terasa berlaku sekaligus, dahulukan yang menyangkut korelasi. Masalah bobot bisa diperbaiki dengan menyederhanakannya; masalah redundansi tidak bisa diperbaiki oleh bobot berapa pun, karena bobot hanya mengatur seberapa besar taruhan yang sama diulang.",
        "Catat setiap keputusan gugur beserta angka korelasi yang menyebabkannya. Catatan itu yang membedakan seleksi yang bisa dipertahankan dari seleksi yang sekadar terasa benar — dan yang membuat SuperAlpha berikutnya mulai dari pelajaran, bukan dari nol.",
        "Terakhir, jadwalkan peninjauan ulang: korelasi antar komponen bergerak, keluarga sinyal bertambah, dan komponen yang hari ini unik bisa menjadi redundan setelah alpha baru ditambahkan. Peta ini dipakai setiap kali rombongan berubah, bukan hanya saat SuperAlpha pertama kali dirakit.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Rencana SuperAlpha dengan bobot yang terlalu percaya diri",
      prose: [
        "Seorang konsultan merakit SuperAlpha dari lima kandidat yang semua lolos individu: M1 (Sharpe 1,48), M2 (Sharpe 1,41), F1 (Sharpe 1,32), F2 (Sharpe 1,29), dan S1 (Sharpe 1,26). Korelasi yang terukur: M1-M2 = 0,86; M1-F1 = 0,18; M1-S1 = 0,11; F1-F2 = 0,64; F1-S1 = 0,09; F2-S1 = 0,21; korelasi M2 ke F1, F2, S1 berturut-turut 0,22, 0,19, 0,14. Rencana bobotnya performance-based murni dari Sharpe in-sample: M1 mendapat 30%, M2 28%, sisanya dibagi ke F1, F2, S1.",
        "Satu angka turunan yang belum ia hitung: bobot efektif keluarga. M1 dan M2 sama-sama sinyal momentum dengan korelasi 0,86 — digabung, rencana bobotnya menaruh 58% SuperAlpha pada satu keluarga, sementara tiga keluarga lain berbagi 42% sisanya. Di atas kertas ada lima komponen dari tiga keluarga; dalam risiko efektif, ini SuperAlpha momentum dengan sedikit hiasan.",
        "Ia membela rencananya dengan satu kalimat: 'M1 dan M2 kan Sharpe-nya paling tinggi.' Kalimat itu benar sebagai laporan masa lalu dan lemah sebagai rencana masa depan — Sharpe in-sample keduanya dihitung dari periode yang sama yang kini dipakai untuk membenarkan bobotnya.",
        "Tidak ada komponen bermasalah secara individu di kasus ini. Yang bermasalah murni arsitekturnya: dua komponen hampir kembar diberi mayoritas bobot, dan mayoritas itu dibenarkan oleh metrik yang paling mudah menipu dalam blending.",
        "Pertanyaan 1: dengan aturan greedy ambang 0,7 (urut dari Sharpe tertinggi), komponen mana yang gugur, dan kenapa?",
        "Pertanyaan 2: apa risiko tersembunyi dari rencana bobot 30% + 28% pada M1 dan M2?",
        "Pertanyaan 3: susunan SuperAlpha yang lebih sehat untuk kasus ini seperti apa — komponen dan prinsip bobotnya?",
        "Pembahasan: (1) Urutan greedy: M1 diterima; M2 ditolak karena corr(M1,M2)=0,86 >= 0,7; F1 diterima (0,18 ke M1); F2 diterima karena korelasinya ke yang terpilih 0,64 dan 0,19 — masih < 0,7; S1 diterima (semua korelasinya rendah). Yang gugur hanya M2. (2) Bobot gabungan 58% pada M1+M2 berarti 58% SuperAlpha bertumpu pada satu taruhan yang sama — saat faktor bersama itu terpukul, mayoritas sinyal jatuh bersamaan, dan bobot besarnya dibenarkan oleh Sharpe in-sample yang rawan selection overfitting. (3) SuperAlpha sehat: M1 + F1 + F2 + S1 dengan equal weight (masing-masing 25%) sebagai titik awal — empat taruhan yang benar-benar berbeda, tanpa klaim palsu tentang siapa yang paling hebat.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Refleksi SuperAlpha",
      prose: [
        "Lima pertanyaan — jawab sebagai arsitek blending, bukan kolektor komponen.",
        "Fokuskan ingatan pada tiga angka lab: 0,524 komponen terbaik, 0,740 blend naif, 0,970 blend seleksi. Seluruh argumen lesson ini hidup di jarak antara ketiga angka itu — blending membantu, seleksi membantu lebih banyak, dan keduanya hanya bekerja bila korelasinya jujur diukur.",
        "Satu pengingat penutup: SuperAlpha adalah fitur level konsultan, dan lesson ini melatih penilaian di baliknya lewat simulasi. Kesiapan yang dibangun di sini adalah kesiapan memutuskan — komponen mana yang masuk, mana yang gugur, bobot apa yang berani dipertahankan — bukan hafalan urutan klik.",
      ],
      tasks: [],
      summary: [
        "SuperAlpha adalah portofolio mini dalam satu sinyal: kualitasnya ditentukan komponen DAN korelasi antar mereka.",
        "Return gabungan r = Σ w_i·r_i dengan Σ w_i = 1; varians gabungan memuat pajak redundansi lewat suku korelasi.",
        "Seleksi greedy yang deterministik: urut dari Sharpe tertinggi, terima hanya bila korelasi < 0,7 ke semua yang sudah terpilih.",
        "Di lab, membuang B (corr 0,983 ke A) mengangkat Sharpe dari 0,740 (naif) ke 0,970 (seleksi) — di atas komponen terbaik 0,524.",
        "Bobot dari performa in-sample adalah selection overfitting; equal weight adalah baseline yang sulit dikalahkan di luar sampel.",
        "Komponen yang gugur dari blend tidak mati — ia tetap alpha mandiri; yang dibuang hanya redundansinya.",
      ],
      quiz: [
        {
          q: "SuperAlpha pertama Raka berada di bawah komponen terbaiknya. Dua penyebab yang ditemukan adalah...",
          options: [
            { text: "Komponen saling berkorelasi tinggi dan bobot dipilih dari performa in-sample", why: "Tepat — redundansi menaikkan varians gabungan, dan bobot in-sample menghafal keberuntungan masa lalu.", correct: true },
            { text: "Jumlah komponennya terlalu sedikit, hanya 12", why: "Salah — menambah komponen yang mirip justru memperparah penyebab pertama." },
            { text: "Turnover SuperAlpha pasti meledak", why: "Tidak dinyatakan — masalahnya korelasi dan pemilihan bobot, bukan turnover." },
            { text: "Komponennya belum ada yang lolos submit", why: "Bertentangan dengan cerita — kedua belasnya sudah lolos individu." },
          ],
        },
        {
          q: "Aturan greedy: kandidat X berkorelasi 0,82 terhadap komponen yang sudah terpilih, Sharpe X tinggi. Keputusan?",
          options: [
            { text: "Gugurkan X dari blend ini — ambang 0,7 terlampaui", why: "Tepat — aturan seleksi menilai redundansi, dan 0,82 berarti X membawa risiko yang sudah dimiliki.", correct: true },
            { text: "Terima X dengan bobot kecil sebagai kompromi", why: "Bobot kecil dari risiko yang sama tetap menambah pajak korelasi; aturan greedy sengaja dibuat tegas agar bisa diaudit." },
            { text: "Terima X dan gugurkan komponen lama yang Sharpe-nya lebih rendah", why: "Itu mengganti isi blend mengikuti satu angka — bukan aturan greedy yang mulai dari yang terkuat dan mempertahankan yang sudah lolos uji." },
            { text: "Terima X karena Sharpe tinggi selalu menang", why: "Sharpe individu tidak membayar pajak korelasi — persis jebakan di cerita pembuka." },
          ],
        },
        {
          q: "Kenapa equal weight sering mengalahkan performance-based weight di luar sampel?",
          options: [
            { text: "Performance-based menghafal noise in-sample (selection overfitting); equal weight tidak mengklaim tahu pemenang berikutnya", why: "Tepat — bobot berbasis histori memberi porsi terbesar pada komponen yang paling mungkin sedang beruntung.", correct: true },
            { text: "Karena equal weight selalu menghasilkan Sharpe tertinggi di semua data", why: "Terlalu mutlak — equal weight unggul karena robust, bukan karena selalu optimal." },
            { text: "Karena performance-based dilarang di platform", why: "Tidak ada larangan itu — ini soal validitas statistik, bukan aturan platform." },
            { text: "Karena bobot performance-based sulit dihitung", why: "Menghitungnya mudah; masalahnya adalah estimasinya rapuh, bukan aritmetikanya." },
          ],
        },
        {
          q: "Dua komponen masing-masing berbobot 0,5 dengan korelasi 0,98. Apa kata rumus varians gabungan?",
          options: [
            { text: "Suku silang korelasi membuat varians gabungan hampir seperti satu posisi penuh — diversifikasi nyaris nol", why: "Tepat — rho mendekati 1 menghapus manfaat memiliki dua komponen.", correct: true },
            { text: "Varians gabungan menjadi setengah dari varians individu", why: "Itu hanya terjadi bila korelasinya rendah; pada 0,98 pengurangan risikonya menguap." },
            { text: "Varians gabungan tidak tergantung korelasi", why: "Salah — suku 2·w_i·w_j·rho·sigma_i·sigma_j adalah inti rumus portofolio." },
            { text: "Return gabungan otomatis berlipat dua", why: "Return gabungan adalah rata-rata tertimbang dan bobot berjumlah 1 — tidak ada pelipatan." },
          ],
        },
        {
          q: "Di lab, blend seleksi A+C+D (Sharpe 0,970) mengalahkan blend naif (0,740). Pelajaran yang paling tepat?",
          options: [
            { text: "Membuang satu komponen redundan bisa menaikkan Sharpe lebih besar daripada menambah komponen baru", why: "Tepat — B berkorelasi 0,983 ke A; membuangnya menghilangkan pajak redundansi tanpa kehilangan sinyal unik.", correct: true },
            { text: "Tiga alpha selalu lebih baik dari empat alpha", why: "Salah generalisasi — yang menang adalah seleksinya, bukan angka tiganya; tiga alpha yang mirip tetap buruk." },
            { text: "Alpha B adalah alpha yang buruk dan harus dihapus permanen", why: "B hanya gugur dari blend ini; sebagai alpha mandiri ia tetap sah — yang dibuang redundansinya." },
            { text: "Sharpe 0,970 membuktikan blend ini layak submit", why: "Angka lab berasal dari data mainan 12 periode — ia membuktikan struktur seleksi, bukan kelayakan submit resmi." },
          ],
        },
      ],
      reference: "Arsitek SuperAlpha tidak bertanya berapa banyak alpha yang dimiliki, tetapi berapa banyak taruhan berbeda yang benar-benar ada di dalamnya.",
    },
  ],
};
