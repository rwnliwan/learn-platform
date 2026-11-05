import type { V2Lesson } from "../lib/types";

const FIG_DECAY = `<svg viewBox="0 0 480 260" role="img" aria-label="Bobot sinyal pada decay 2 vs decay 8.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Bobot sinyal: decay 2 vs decay 8</text>
<text x="16" y="48" font-size="11" fill="var(--chart-text)">d = 2 (percaya hanya yang segar)</text>
<polyline points="60,60 120,100 180,140 240,180 300,220" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<text x="16" y="248" font-size="11" fill="var(--chart-text)">d = 8 (sabar pada sinyal lama)</text>
<polyline points="60,60 140,76 220,92 300,108 380,124" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<text x="392" y="64" font-size="11" fill="var(--chart-text)">hari 0</text>
<text x="300" y="238" font-size="11" fill="var(--chart-text)">hari 4</text>
<text x="16" y="152" font-size="11" fill="var(--chart-text)">Cara membaca: sumbu X = umur sinyal (hari), Y = bobot (bawah = kecil).</text>
<text x="16" y="170" font-size="11" fill="var(--chart-text)">Interpretasi: decay 2 membunuh sinyal umur 4 hari; decay 8 masih menghargainya.</text>
</g>
</svg>`;

export const wqb6: V2Lesson = {
  slug: "wqb6-delay-decay",
  track: "WorldQuant Brain",
  module: "Fondasi: Dari Nol",
  title: "WQB6 — Delay & Decay: Waktu Meluruhkan Sinyal",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Sinyal yang kemarin benar, hari ini basi",
      prose: [
        "Seorang peneliti menemukan pola cantik: saham yang turun tajam kemarin pagi cenderung memantul sore ini. Backtest tanpa delay: Sharpe 3,1 — nyaris sempurna. Ia berlari ke meja senior dengan senyum lebar. Senior itu hanya bertanya satu kalimat: 'Kamu mengeksekusinya kapan?'",
        "Diam. Di dunia nyata, data kemarin pagi baru bisa ditindaklanjuti hari ini — itulah delay. Dan pantulan kemarin pagi, dieksekusi hari ini, sudah basi separuh — itulah decay. Setelah delay 1 hari diterapkan, Sharpe 3,1 itu runtuh menjadi 0,4. Bukan karena sinyalnya bohong; karena sinyalnya kedaluwarsa sebelum bisa dibeli.",
        "Twist-nya: backtest tanpa delay BUKAN salah hitung — ia menjawab pertanyaan yang salah ('bagaimana jika saya bisa trading kemarin?'). Delay dan decay memaksa pertanyaan yang benar: 'berapa nilai sinyal ini SETELAH saya telat satu hari, dan seberapa cepat ia membusuk?' Lesson ini tentang dua jam pasir itu.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan delay D1 dan kenapa ia wajib; (2) menghitung bobot decay linear langkah demi langkah; (3) membedakan kapan decay kecil vs besar yang tepat; (4) menjelaskan hubungan decay dengan turnover; (5) membaca parameter decay sebuah alpha dan memprediksi perilakunya.",
      ],
      tasks: [],
      note: {
        title: "Dua jam pasir",
        body: "Delay = keterlambatan yang tak terhindarkan (kamu selalu telat satu hari). Decay = pembusukan nilai sinyal seiring umur. Alpha yang hebat adalah yang masih berharga setelah melewati keduanya.",
      },
      reference: "Backtest tanpa delay menjawab pertanyaan yang salah.",
    },
    {
      id: "delay",
      eyebrow: "Langkah 2 · Konsep",
      title: "Delay: kamu selalu telat satu hari",
      prose: [
        "Delay = jeda antara data yang dipakai sinyal dan eksekusi yang diizinkan. Delay 1 (D1) berarti: sinyal dihitung dari data penutupan kemarin, posisi baru dieksekusi hari ini. Ini bukan pilihan — ini cerminan realitas: kamu tidak bisa trading berdasarkan harga yang belum terjadi.",
        "Contoh konkret. Sinyal 'beli saham yang naik 5% kemarin'. Tanpa delay, backtest membeli pada harga pembukaan kemarin — mustahil, karena sinyalnya baru diketahui setelah penutupan. Dengan delay 1, backtest membeli hari ini — dan harga sudah bergerak semalam. Selisih 'mustahil vs realistis' inilah yang delay tangkap.",
        "Kepribadian delay: ia seperti wasit yang meniup peluit start satu detik setelah aba-aba — semua peserta (alpha) diperlakukan sama, jadi perbandingannya adil. Alpha yang hanya hidup tanpa delay = atlet yang hanya menang bila start duluan.",
        "Miskonsepsi klasik: 'delay 1 membuat semua strategi mean-reversion mati.' Yang benar: delay 1 membunuh strategi yang MENGANDALKAN eksekusi instan (arbitrase mikro), tetapi strategi reversal 1–5 hari justru dirancang untuk delay ini — pantulannya memang terjadi beberapa hari setelah sinyal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Backtest saya Sharpe 3 tanpa delay — tinggal dikurangi sedikit untuk realitas.” Bukan 'sedikit': contoh di cerita menunjukkan 3,1 → 0,4. Delay bukan pajak kecil; ia bisa menjadi perbedaan antara sinyal dan ilusi.",
      },
      hints: [
        "Selalu baca hasil simulasi dengan delay yang SAMA — membandingkan delay 0 vs delay 1 = membandingkan fiksi vs nonfiksi.",
        "Standar tim: delay 1 untuk semua riset USA.",
      ],
      reference: "Delay 1 = sinyal kemarin, eksekusi hari ini. Tanpa delay = fiksi.",
    },
    {
      id: "decay",
      eyebrow: "Langkah 3 · Konsep",
      title: "Decay: seberapa cepat sinyal membusuk",
      prose: [
        "Decay = kecepatan bobot sinyal meluruh seiring umur data. Decay linear (ts_decay_linear): bobot turun garis lurus dari 1 (data terbaru) hingga 0 pada umur = d hari. Rumus bobot untuk data berumur t hari dengan parameter d: w = maks(0, 1 − t/d).",
        "Contoh terperinci (d = 4). Data umur 0 hari (hari ini): w = 1 − 0/4 = 1,00. Umur 1: 1 − 1/4 = 0,75. Umur 2: 0,50. Umur 3: 0,25. Umur 4: 0,00 — sinyal empat hari lalu dianggap sampah total. Dengan d = 8, data umur 4 masih berbobot 1 − 4/8 = 0,50 — setengah dihargai.",
        "Cara membaca figur: dua garis = bobot vs umur sinyal untuk d=2 (curam, merah) dan d=8 (landai, biru). Interpretasi: d=2 hanya percaya data 0–1 hari (sinyal cepat, gelisah, turnover tinggi); d=8 sabar pada data lama (sinyal lambat, tenang, turnover rendah). Inilah hubungan decay–turnover: decay besar ≈ smoothing ≈ turnover kecil.",
        "Intuisi memilih d: sinyal reversal 1–5 hari → d kecil (2–4) karena pantulan memang cepat basi. Sinyal fundamental (rasio keuangan kuartalan) → d besar (8+) karena angka kuartalan relevan berbulan-bulan. Memakai d=2 untuk sinyal fundamental = membuang informasi yang masih segar; memakai d=8 untuk sinyal mikro = memercayai mayat.",
      ],
      formula: String.raw`w(t) = \max\left(0,\, 1 - \frac{t}{d}\right)`,
      formulaNote: "w(t) = bobot data berumur t hari, d = parameter decay. t = 0 → bobot 1 (penuh); t ≥ d → bobot 0 (diabaikan). Linear: turun sama besar tiap hari.",
      figure: {
        svg: FIG_DECAY,
        alt: "Dua garis bobot decay: d=2 curam, d=8 landai.",
        caption: "Decay kecil = hanya percaya yang segar. Decay besar = sabar pada yang lama.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Decay lebih besar selalu lebih aman.” Decay besar pada sinyal cepat = kamu trading berdasarkan kabar basi dengan keyakinan setengah hati — return-nya hancur walau turnover-nya cantik. Decay harus JODOH dengan kecepatan sinyal, bukan sebesar-besarnya.",
      },
      hints: [
        "d kecil (2–4): sinyal cepat, turnover tinggi, cocok untuk reversal harian.",
        "d besar (6–8): sinyal lambat, turnover rendah, cocok untuk fundamental.",
      ],
      reference: "w(t) = maks(0, 1 − t/d). Decay = jodoh kecepatan sinyal.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab",
      title: "Bobot decay & efeknya pada turnover",
      prose: [
        "Hitung bobot decay linear untuk d = 2, 4, 8 pada umur 0–8 hari, lalu jawab: berapa umur maksimum yang masih 'dipercaya setengah' (bobot ≥ 0,5) untuk tiap d? Angka ini adalah 'rentang ingatan' alpha — di luar itu sinyal dianggap terlalu basi untuk diandalkan.",
        "Eksperimen setelah selesai: coba d = 1 dan d = 12. Pada d = 1, berapa umur maksimum yang masih punya bobot? Pada d = 12, apakah sinyal umur 8 masih dipercaya?",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `bobot(t, d)` = maks(0, 1 - t/d)" },
        { id: "t2", text: "Cetak tabel bobot umur 0–8 untuk d = 2, 4, 8" },
        { id: "t3", text: "Hitung umur maksimum dengan bobot ≥ 0,5 tiap d" },
      ],
      expected: "d=2: 2 hari\nd=4: 3 hari\nd=8: 5 hari",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Bobot negatif untuk t > d.” Rumus memakai maks(0, ...) — bobot tidak pernah negatif. Sinyal yang terlalu tua bobotnya NOL (diabaikan), bukan negatif (melawan).",
      },
      hints: [
        "bobot = max(0.0, 1 - t/d).",
        "Ingatan = banyaknya t dengan bobot(t, d) >= 0.5.",
      ],
      code: {
        starter: "# Bobot decay linear. JANGAN UBAH struktur loop.\n# TULIS KODEMU\ndef bobot(t, d):\n    return  # maks(0, 1 - t/d)\n\nfor d in (2, 4, 8):\n    print(f\"d={d}:\", [round(bobot(t, d), 2) for t in range(9)])\n\nfor d in (2, 4, 8):\n    ingatan = sum(1 for t in range(9) if bobot(t, d) >= 0.5)\n    print(f\"d={d}: {ingatan} hari\")\n",
        lockLines: 2,
        solution: "# Bobot decay linear. JANGAN UBAH struktur loop.\n# TULIS KODEMU\ndef bobot(t, d):\n    return max(0.0, 1 - t / d)\n\nfor d in (2, 4, 8):\n    print(f\"d={d}:\", [round(bobot(t, d), 2) for t in range(9)])\n\nfor d in (2, 4, 8):\n    ingatan = sum(1 for t in range(9) if bobot(t, d) >= 0.5)\n    print(f\"d={d}: {ingatan} hari\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "fungsi `bobot` ada", msg: "Definisikan def bobot(t, d).", name: "bobot" },
          { kind: "stdout_matches", task: "t3", label: "d=2 ingatan 2 hari", msg: "d=2: bobot ≥ 0,5 hanya umur 0 dan 1.", pattern: "d=2: 2 hari" },
          { kind: "stdout_matches", task: "t3", label: "d=8 ingatan 5 hari", msg: "d=8: umur 0–4 berbobot ≥ 0,5.", pattern: "d=8: 5 hari" }
        ],
      },
      reference: "Decay kecil = gelisah. Decay besar = tenang. Pilih sesuai kecepatan sinyal.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Memilih decay dalam 10 detik",
      prose: [
        "Satu: sinyal intraday/mikro (pantulan jam-jaman) → d = 1–2; delay 1 sudah membunuh sebagian, jangan tambah pembunuhan. Dua: reversal 1–5 hari → d = 2–4 (temuan nyata: terbaik di d=2). Tiga: momentum mingguan/bulanan → d = 4–6. Empat: fundamental kuartalan → d = 8+ (temuan nyata: family tertentu justru terbaik di d=8). Lima: tidak tahu kecepatan sinyal → uji d = 2, 4, 8 dan baca polanya (eksperimen decay sensitivity), jangan tebak.",
        "Aturan praktis 10 detik: tanya 'dalam berapa hari sinyal ini basi?' — bagi dua, itulah d awalmu. Sinyal basi 4 hari → mulai dari d=2. Lalu uji, jangan imani.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Decay adalah satu-satunya parameter yang mengubah 'kepribadian' alpha tanpa mengubah idenya: d kecil = trader gelisah, d besar = investor sabar. Ide yang sama bisa jadi dua alpha berbeda hanya karena d.",
      },
      reference: "Basi 4 hari → d=2. Tidak tahu → uji 2/4/8.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mean-reversion 5 hari: d berapa?",
      prose: [
        "Data: sinyal 'saham turun 3 hari berturut-turut cenderung rebound dalam 5 hari'. Backtest: d=2 → Sharpe 1,9, TO 55%. d=4 → Sharpe 2,1, TO 38%. d=8 → Sharpe 1,2, TO 22%.",
        "Pertanyaan: pilih d dan jelaskan. Pembahasan: (1) d=8 membunuh sinyal — rebound 5 hari memang basi di umur 8, Sharpe anjlok. (2) d=2 vs d=4: Sharpe 2,1 > 1,9 DAN turnover 38% < 55% — d=4 menang dua-duanya (lebih tenang + lebih tajam). (3) Keputusan: d=4, dengan catatan fitness: d=2 → F=1,9×√(R/55) vs d=4 → 2,1×√(R/38) — selisih makin lebar setelah biaya. (4) Pelajaran: decay optimal bukan yang turnover-nya paling kecil, melainkan yang memaksimalkan fitness — titik temu sinyal dan biaya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Memilih decay hanya dari Sharpe = mengabaikan biaya; hanya dari turnover = mengabaikan sinyal. Fitness (yang memuat keduanya) adalah wasit yang benar untuk memilih d.",
      },
      reference: "Pilih d yang memaksimalkan fitness, bukan yang meminimalkan turnover.",
    },
    {
      id: "lab-tuner",
      eyebrow: "Langkah 7 · Lab",
      title: "Tuner decay: biarkan fitness memilih",
      prose: [
        "Hasil backtest sinyal reversal 5-hari pada tiga decay: d=2 → Sharpe 1,9, TO 55%; d=4 → Sharpe 2,1, TO 38%; d=8 → Sharpe 1,2, TO 22% (return 11% semua). Tugasmu: tulis fungsi fitness, hitung ketiganya, dan cetak pemenangnya. Jangan menebak — biarkan angkanya bicara.",
        "Eksperimen setelah selesai: ubah return d=8 menjadi 14% (sinyal lambat yang lebih kuat) — apakah pemenangnya berubah? Kapan d=8 layak menang?",
      ],
      tasks: [
        { id: "t1", text: "Tulis `fitness(S, R, TO)`" },
        { id: "t2", text: "Hitung F untuk d = 2, 4, 8 dan cetak pemenang" },
      ],
      expected: "d=2: F 0.85\nd=4: F 1.13\nd=8: F 0.85\nPemenang: d=4",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“d=2 vs d=8 seri (0,85 vs 0,85) berarti keduanya sama.” Seri di angka, beda di makna: d=2 seri karena boros (TO 55%), d=8 seri karena sinyalnya mati (Sharpe 1,2). Angka sama, penyakit beda — dan obatnya beda.",
      },
      hints: [
        "fitness = S * (R / max(TO, 12.5)) ** 0.5.",
        "Pemenang = d dengan F terbesar: max(hasil, key=...).",
      ],
      code: {
        starter: "# (d, Sharpe, return_%, TO_%). JANGAN UBAH.\nhasil = {2: (1.9, 11, 55), 4: (2.1, 11, 38), 8: (1.2, 11, 22)}\n\n# TULIS KODEMU\ndef fitness(S, R, TO):\n    return  # S * sqrt(R / max(TO, 12.5))\n\nF = {d: fitness(S, R, TO) for d, (S, R, TO) in hasil.items()}\nfor d in sorted(F):\n    print(f\"d={d}: F {F[d]:.2f}\")\nprint(f\"Pemenang: d={max(F, key=lambda d: F[d])}\")\n",
        lockLines: 2,
        solution: "# (d, Sharpe, return_%, TO_%). JANGAN UBAH.\nhasil = {2: (1.9, 11, 55), 4: (2.1, 11, 38), 8: (1.2, 11, 22)}\n\n# TULIS KODEMU\ndef fitness(S, R, TO):\n    return S * ((R / max(TO, 12.5)) ** 0.5)\n\nF = {d: fitness(S, R, TO) for d, (S, R, TO) in hasil.items()}\nfor d in sorted(F):\n    print(f\"d={d}: F {F[d]:.2f}\")\nprint(f\"Pemenang: d={max(F, key=lambda d: F[d])}\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "fungsi `fitness` ada", msg: "Definisikan def fitness(S, R, TO).", name: "fitness" },
          { kind: "stdout_matches", task: "t2", label: "d=4 pemenang 1,13", msg: "d=4 menang dua-duanya: Sharpe tertinggi + TO terendah di antara yang hidup.", pattern: "Pemenang: d=4" }
        ],
      },
      reference: "Jangan tebak d — ukur dengan fitness.",
    },
    {
      id: "decay-lanjut",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Kurva decay: kapan d kecil membunuh, kapan d besar membusuk",
      prose: [
        "Mini-case di langkah 6 memilih d=4 — tetapi bagaimana kamu tahu 4 adalah puncaknya, bukan sekadar 'lebih baik dari 2 dan 8'? Jawabannya: sapu d pada grid dan baca bentuk kurvanya. Ambil sinyal reversal 5-hari yang sama (return 11% di semua d), lalu hitung fitness untuk d = 1, 2, 4, 8, 12. Hasilnya: d=1 → Sharpe 1,7, turnover 68%, fitness 0,68; d=2 → 1,9 / 55% / 0,85; d=4 → 2,1 / 38% / 1,13; d=8 → 1,2 / 22% / 0,85; d=12 → 0,6 / 16% / 0,50. Kurvanya naik 0,68 → 0,85 → memuncak 1,13 di d=4 → turun 0,85 → 0,50. Bentuknya gunung — dan puncak gunung itu adalah jawaban yang bisa dipertanggungjawabkan, bukan tebakan.",
        "Sekarang sapu yang sama untuk sinyal fundamental kuartalan (return 13%): d=2 → Sharpe 0,9, turnover 30%, fitness 0,59; d=4 → 1,3 / 24% / 0,96; d=8 → 1,6 / 18% / 1,36; d=12 → 1,55 / 15% / 1,44. Kurvanya tidak membentuk gunung — ia terus menanjak di tepi grid. Itu sinyal bahaya metodologis: optimumnya mungkin di d=16 atau d=20, di luar yang kamu uji. Aturannya: bila yang terbaik ada di tepi grid, perluas grid. Jangan pernah memahkotai juara yang hanya menang karena lawannya tidak diundang.",
        "Tiga bentuk kurva yang wajib dikenali. Gunung (naik lalu turun): optimum terpercaya di puncak — pilih puncaknya. Lereng (terus naik di tepi): optimum belum ketemu — perluas grid. Tebing (anjlok tiba-tiba antar d yang berdekatan, misalnya fitness 1,13 di d=4 langsung 0,50 di d=12): sinyal rapuh, perilakunya berubah drastis oleh satu parameter — selidiki sebelum submit, karena pasar tidak akan memberimu d yang ideal setiap hari. Dataran tinggi (fitness nyaris sama di d=2, 4, 8): sinyal robust — pilih yang tengah sebagai kompromi.",
        "Kenapa d kecil membunuh sinyal lambat — sekarang dengan angka. Sinyal fundamental menyebarkan informasinya selama 5–10 hari (kejutan laba butuh berminggu-minggu untuk dicerna pasar). Dengan d=2, bobot data berumur 6 hari = maks(0, 1 − 6/2) = 0. Nol. Hari-hari terbaik sinyalmu dikalikan nol — bukan dikurangi, dihapus. 'Ingatan efektif' decay = d/2, yaitu umur maksimum dengan bobot ≥ 0,5: d=2 hanya mengingat 1 hari, d=8 mengingat 4 hari. Kaidah praktis: d ≈ 1,5–2× paruh-hidup informasi sinyal. Reversal (paruh-hidup ~2 hari) → d 3–4. Fundamental (paruh-hidup ~6 hari) → d 9–12. Di bawah itu kamu bukan 'konservatif' — kamu mengamputasi.",
        "Interaksi yang jarang dibahas: delay menggeser seluruh kurva bobot ke kanan. Dengan delay 1, data tersegar yang boleh dipakai berumur 1 hari — bobotnya 1 − 1/d. Untuk d=2: 0,50 — separuh keyakinan puncak hilang sebelum trading dimulai. Untuk d=8: 0,875 — nyaris utuh. Artinya sinyal cepat JAUH lebih sensitif terhadap delay daripada sinyal lambat: tepi kiri kurva bobotnya curam, sehingga satu hari keterlambatan mengamputasi separuh konviksi. Ilustrasi pada reversal d=2: delay 0 → fitness 0,95; delay 1 → 0,85; delay 2 → 0,61. Karena platform memaksakan delay 1, optimum praktis biasanya satu tingkat LEBIH BESAR dari optimum delay-0 — kompensasi atas hari yang dicuri delay.",
        "Grounding ke FASTEXPR: decay tinggal di operator ts_decay_linear(x, d), delay tinggal di settings simulasi — dua kenop jam yang sama. Pasangan yang jodoh: cepat — rank(-ts_decay_linear(ts_delta(close, 1), 2)), dibaca 'percaya hanya pada perubahan harga dua hari terakhir, dan pilih yang paling jatuh untuk dibeli'; lambat — rank(ts_decay_linear(sales / assets, 8)), dibaca 'efisiensi aset yang bobotnya bertahan delapan hari'. Angka d di operator HARUS sama dengan d yang menang di kurvamu — operator dan kurva adalah dua penulisan dari satu keputusan.",
        "Protokol kerja yang rapi. Satu: untuk setiap ide baru, sapu d ∈ {2, 4, 8} — tidak kurang. Dua: baca bentuk kurva (gunung/lereng/tebing/dataran). Tiga: perluas grid bila juara di tepi. Empat: pastikan ingatan efektif (d/2) ≥ paruh-hidup informasi sinyalmu. Lima: kunci d di operator ts_decay_linear DAN verifikasi ulang setiap kali delay berubah. Enam: catat kurvanya — enam bulan kemudian, saat sinyalmu melemah, kurva lama adalah diagnosis pertama: apakah puncaknya bergeser (pasar berubah) atau seluruh kurva amblas (sinyal mati).",
        "Satu lensa kuantitatif lagi: 'pusat massa' bobot decay. Bobot linear w(t) = 1 − t/d menempatkan pusat massa pada umur (d−1)/3 ≈ d/3 hari — artinya ts_decay_linear(x, 8) secara efektif 'melihat' 2,3 hari ke belakang, setara dengan rata-rata bergerak sederhana 5-hari (yang pusatnya di 2 hari). Tabel: d=2 → 0,33 hari; d=4 → 1,0; d=8 → 2,33; d=12 → 3,67. Kegunaannya: menerjemahkan antar operator — bila riset lamamu memakai ts_mean(x, 5) dan kamu pindah ke ts_decay_linear, samakan pusat massanya: SMA-5 (pusat 2 hari) ≈ decay d=7 (pusat 2,0 hari). Aturan konversi: d_decay ≈ 1,5 × window_SMA untuk pusat yang sama. Ini jembatan yang membuat intuisi window lamamu tetap berguna di dunia decay.",
        "Terakhir: rezim biaya menggeser optimum. Fungsi fitness mengasumsikan satu rezim biaya lewat suku turnover-nya; di pasar yang lebih mahal (spread lebar, saham kurang likuid), penalti turnover efektif lebih besar dan puncak gunung bergeser kanan 1–2 grid. Praktiknya: bila kamu memindahkan sinyal reversal dari segmen raksasa ke ekor yang lebih mahal, sapu ulang d — jangan bawa d=4 sebagai dogma. Parameter yang optimal di satu rezim biaya hanyalah tebakan di rezim lain.",
      ],
      formula: String.raw`F = S \times \sqrt{R / \max(TO, 12.5)}`,
      formulaNote: "F = fitness (skor akhir pemilihan); S = Sharpe; R = return (%); TO = turnover (%). Pembagi memakai maks(TO, 12.5) sebagai lantai kewajaran — turnover super-rendah tidak boleh meledakkan skor.",
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Kurva decay-fitness adalah autobiografi sinyal: ia menceritakan pada kecepatan apa sinyalmu hidup. Sinyal yang tidak tahu kecepatannya sendiri akan dibunuh oleh parameter yang salah — bukan oleh pasar.",
      },
      hints: [
        "Sapu minimal d ∈ {2, 4, 8}; juara di tepi grid = grid kurang lebar.",
        "Ingatan efektif = d/2 hari (bobot ≥ 0,5). Cocokkan dengan paruh-hidup informasi.",
        "Delay 1 mencuri bobot 1/d dari puncak — sinyal cepat paling terluka.",
      ],
      reference: "Sapu d, baca kurvanya, jodohkan dengan kecepatan sinyal.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan tentang dua jam pasir.",
      ],
      tasks: [],
      summary: [
        "Delay 1 = sinyal kemarin, eksekusi hari ini — cermin realitas, bukan pilihan.",
        "Decay linear: w(t) = maks(0, 1 − t/d) — bobot turun garis lurus hingga nol.",
        "d kecil = percaya yang segar (gelisah, TO tinggi); d besar = sabar (tenang, TO rendah).",
        "Decay harus jodoh dengan kecepatan sinyal; temuan nyata: reversal→d=2, family lambat→d=8.",
        "Pilih d dengan fitness, bukan Sharpe atau turnover saja.",
        "Sapu d ∈ {2, 4, 8} dan baca bentuk kurva: gunung = puncak terpercaya, lereng di tepi = perluas grid.",
        "Ingatan efektif = d/2; delay 1 mencuri bobot 1/d dari puncak — sinyal cepat paling sensitif.",
      ],
      quiz: [
        {
          q: "Kenapa delay 1 wajib dalam backtest?",
          options: [
            { text: "Karena sinyal kemarin baru bisa dieksekusi hari ini di dunia nyata", why: "Tepat — tanpa delay = trading berdasarkan masa depan.", correct: true },
            { text: "Agar Sharpe terlihat lebih kecil", why: "Bukan tujuan estetika — ini soal kejujuran eksekusi." },
            { text: "Karena regulator mewajibkan", why: "Tidak ada aturan regulator soal ini; ini kewarasan metodologi." }
          ],
        },
        {
          q: "d = 4. Bobot data berumur 3 hari?",
          options: [
            { text: "0,25  (1 − 3/4)", why: "Benar.", correct: true },
            { text: "0,75  (3/4)", why: "Terbalik — bobot TURUN seiring umur, bukan naik." },
            { text: "−0,25", why: "Bobot tidak pernah negatif; maks(0, ...) menjaganya." }
          ],
        },
        {
          q: "Sinyal fundamental kuartalan diberi d = 2. Akibatnya?",
          options: [
            { text: "Informasi yang masih segar dibuang — return hancur", why: "Tepat — decay tidak jodoh dengan kecepatan sinyal.", correct: true },
            { text: "Turnover turun sehingga fitness naik", why: "Turnover memang turun, tetapi sinyalnya ikut mati — fitness anjlok." },
            { text: "Tidak ada efek — decay hanya kosmetik", why: "Decay mengubah bobot riil; efeknya besar pada fitness." }
          ],
        },
        {
          q: "d = 8, umur maksimum dengan bobot > 0?",
          options: [
            { text: "7 hari (1 − 7/8 = 0,125)", why: "Benar — umur 8 tepat nol.", correct: true },
            { text: "8 hari", why: "Umur 8 → 1 − 8/8 = 0, tepat nol bukan > 0." },
            { text: "4 hari", why: "Itu untuk d = 4, bukan d = 8." }
          ],
        },
        {
          q: "Kriteria terbaik memilih d?",
          options: [
            { text: "Fitness tertinggi (memuat Sharpe dan turnover)", why: "Benar — wasit dua sisi.", correct: true },
            { text: "Sharpe tertinggi", why: "Mengabaikan biaya — bisa memilih d kecil yang boros." },
            { text: "Turnover terendah", why: "Mengabaikan sinyal — bisa memilih d besar yang membunuh return." }
          ],
        },
        {
          q: "Kurva fitness sinyal fundamental terus naik hingga d=12 (tepi grid). Tindakan yang benar?",
          options: [
            { text: "Perluas grid ke d=16/20 — optimum mungkin di luar yang diuji", why: "Tepat — juara di tepi grid belum tentu juara sebenarnya.", correct: true },
            { text: "Kunci d=12 — itu yang terbaik dari yang diuji", why: "Terbaik dari opsi yang ada ≠ terbaik absolut; grid-nya yang kurang lebar." },
            { text: "Turunkan ke d=2 agar turnover naik", why: "Menaikkan turnover tanpa alasan = membakar biaya." }
          ],
        },
        {
          q: "Sinyal reversal d=2 dengan delay 1. Bobot data tersegar yang boleh dipakai?",
          options: [
            { text: "0,50  (1 − 1/2)", why: "Benar — delay 1 menggeser pemakaian ke umur 1 hari; tepi kiri kurva d=2 curam.", correct: true },
            { text: "1,00 — data tersegar selalu penuh", why: "Hanya bila delay 0; delay 1 memakai data umur 1 hari." },
            { text: "0,875", why: "Itu untuk d=8, bukan d=2." }
          ],
        }
      ],
      reference: "Delay = kejujuran. Decay = jodoh kecepatan sinyal. Wasitnya = fitness.",
    },
  ],
};
