import type { V2Lesson } from "../lib/types";

const FIG_PLAFON = `<svg viewBox="0 0 600 330" role="img" aria-label="Kurva fitness 40 kali tweak: naik lalu datar di plafon 0,94.">
<g font-family="var(--font-ui)">
<text x="20" y="28" font-size="14" fill="var(--chart-text)" font-weight="bold">Fitness vs jumlah tweak (family reversal 1&ndash;5 hari)</text>
<line x1="60" y1="40" x2="60" y2="270" stroke="var(--chart-text)" stroke-width="1" opacity="0.5"/>
<line x1="60" y1="270" x2="570" y2="270" stroke="var(--chart-text)" stroke-width="1" opacity="0.5"/>
<text x="20" y="120" font-size="11" fill="var(--chart-text)">1,0</text>
<text x="20" y="180" font-size="11" fill="var(--chart-text)">0,9</text>
<text x="20" y="240" font-size="11" fill="var(--chart-text)">0,8</text>
<polyline points="70,246 83,238 96,232 109,224 122,218 135,210 148,206 161,200 174,196 187,190 200,188 213,184 226,182 239,180 252,178 265,177 278,176 291,175 304,174 317,174 330,173 343,173 356,172 369,172 382,172 395,171 408,172 421,171 434,172 447,171 460,172 473,171 486,172 499,171 512,172 525,171 538,172 551,171 560,172" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<line x1="60" y1="172" x2="570" y2="172" stroke="#e5484d" stroke-width="2" stroke-dasharray="7 5"/>
<text x="430" y="162" font-size="12" fill="#e5484d">plafon &asymp; 0,94</text>
<text x="90" y="300" font-size="11" fill="var(--chart-text)">tweak 1&ndash;10: naik cepat</text>
<text x="280" y="300" font-size="11" fill="var(--chart-text)">tweak 11&ndash;25: melambat</text>
<text x="440" y="300" font-size="11" fill="var(--chart-text)">tweak 26+: datar</text>
<text x="60" y="320" font-size="11" fill="var(--chart-text)">Yang menembus plafon bukan tweak ke-41, melainkan pindah family.</text>
</g>
</svg>`;

export const wqb14: V2Lesson = {
  slug: "wqb14-overfitting",
  track: "WorldQuant Brain",
  module: "Praktik & Diagnosis",
  title: "WQB14 — Overfitting & Plafon Satu Family",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tweak ke-47 yang tidak mengubah apa-apa",
      prose: [
        "Tim reversal menghabiskan kuartal itu untuk satu family: sinyal reversal 1–5 hari. Logikanya sederhana — harga yang jatuh kemarin cenderung memantul hari ini. Tweak pertama menaikkan fitness dari 0,71 ke 0,83 (ganti decay). Tweak kedelapan: 0,89 (ubah delay). Tweak kedua puluh: 0,92 (persempit universe). Setiap tweak dirayakan — kurva fitness menanjak, tim merasa produktif.",
        "Lalu tweak kedua puluh enam sampai keempat puluh tujuh terjadi. Fitness: 0,93. 0,91. 0,94. 0,92. 0,93. 0,94. 0,92. Tiga minggu kerja, belasan simulasi, dan angka itu menolak bergerak melewati 0,94. Seseorang mengusulkan tweak ke-48 ('coba decay eksponensial dengan half-life 2,5 hari!'). Analis senior menghentikan ruangan: 'Kita tidak sedang meneliti lagi. Kita sedang menggosok angka yang sama dengan kain yang berbeda.'",
        "Twist-nya: yang menembus plafon akhirnya bukan tweak ke-48, melainkan keputusan membuang seluruh family reversal dan pindah ke family volatilitas — yang dalam dua minggu menghasilkan fitness 1,31. Tiga minggu menggosok plafon 0,94 vs dua minggu membangun 1,31. Pelajaran kuartal itu: mengenali plafon LEBIH PENTING daripada menembusnya — karena plafon tidak bisa ditembus dengan cara yang sama yang membawamu ke sana.",
        "Konteks singkat. Overfitting = sinyal yang terlalu menyesuaikan diri dengan noise data historis sehingga terlihat bagus di in-sample tapi gagal di live. Data snooping = versi praktisnya: mencoba ratusan varian di data yang sama sampai satu terlihat bagus — yang 'terbaik' sering kali hanya yang paling beruntung. Family = kelompok alpha berlogika sejenis (reversal, momentum, volatilitas, volume). Prasyarat: kamu sudah bisa membaca panel dan IS checks — di sini kita membahas musuh yang tidak terlihat di panel: ilusi kemajuan. Setelah lesson ini kamu bisa: (1) menjelaskan mekanisme overfitting dan data snooping dengan angka; (2) mendeteksi plafon satu family dari deret hasil tweak; (3) memutuskan kapan berhenti memoles dan kapan pindah family; (4) merancang budget tweak yang anti-snooping.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Kasus plafon fitness ±0,94 pada family reversal 1–5 hari adalah kasus nyata yang dianonimkan. Angka ini bukan teori — ia adalah tagihan tiga minggu kerja tim yang menolak mengakui plafon. Setiap family punya plafonnya sendiri; tugasmu adalah menemukannya dengan cepat, bukan membantahnya dengan lama.",
      },
      reference: "Mengenali plafon > menembus plafon. Tweak ke-48 jarang lebih pintar dari tweak ke-20.",
    },
    {
      id: "snooping",
      eyebrow: "Langkah 2 · Konsep",
      title: "Data snooping: undian yang selalu 'menang'",
      prose: [
        "Mekanismenya brutal dan sederhana. Setiap kali kamu mencoba satu varian dan melihat hasilnya, kamu sedang mengundi. Peluang satu varian acak terlihat 'bagus' (mis. Sharpe ≥ 1,5) murni karena keberuntungan = katakanlah 5%. Coba 1 varian: peluang tertipu 5%. Coba 20 varian: peluang minimal satu terlihat bagus = 1 − 0,95^20 ≈ 64%. Coba 100 varian: ≈ 99,4%. Pada titik ini, menemukan 'kandidat bagus' bukan prestasi — ia kepastian statistik. Inilah data snooping: bukan kamu yang menemukan sinyal, melainkan undian yang akhirnya memberimu pemenang.",
        "Kenapa ini mematikan di live? Karena 'kemenangan' undian tidak punya alasan ekonomi — ia hanya pola noise yang kebetulan cocok dengan data historis. Di data baru (live), noise-nya berbeda, polanya tidak berulang, Sharpe-nya runtuh. Ciri khas korban snooping: performa IS brilian, performa live/OS (out-of-sample) anjlok — jurang antara keduanya disebut 'decay IS→live', dan jurang yang dalam = tanda snooping.",
        "Bedakan dua dosa. Dosa satu — overfitting klasik: model terlalu kompleks untuk data (terlalu banyak parameter/delay/decay yang di-tune). Dosa dua — snooping prosedural: tiap varian sederhana dan masuk akal, TAPI kamu mencoba 200 di antaranya dan hanya melaporkan 3 yang terbaik. Dosa kedua lebih berbahaya karena tidak terlihat di kode — ia terlihat di buku catatan (yang tidak) kamu tulis. Tim yang hanya mengarsipkan varian yang bagus = tim yang memalsukan bukti tanpa sadar.",
        "Contoh angka: analis mencoba 47 tweak reversal (kasus cerita). Dengan 47 undian @5%, peluang minimal satu 'palsu-bagus' = 1 − 0,95^47 ≈ 91%. Fitness 0,94 yang dirayakan itu kemungkinan besar bukan 'sinyal terbaik', melainkan 'undian terbaik dari 47'. Plafon 0,94 = batas atas keberuntungan + sedikit skill — bukan fondasi untuk tweak ke-48.",
      ],
      formula: String.raw`P(\text{tertipu}) = 1 - (1-p)^n`,
      formulaNote: "p = peluang satu varian acak terlihat bagus (mis. 0,05), n = jumlah varian yang dicoba. Contoh: n = 20 → 1 − 0,95^20 ≈ 0,64 (64%). n = 100 → ≈ 0,994 (99,4%). n = 47 (kasus reversal) → ≈ 0,91 (91%). Makin banyak mencoba, makin pasti 'menemukan' sesuatu — makin besar kemungkinan itu ilusi.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Setiap varian saya masuk akal secara ekonomi, jadi bukan snooping.” Snooping bukan soal akal tiap varian — soal JUMLAH undian. Seratus varian yang masing-masing masuk akal tetap seratus undian; pemenangnya tetap bisa jadi keberuntungan. Yang menyelamatkan bukan 'masuk akal', melainkan budget percobaan + arsip lengkap + validasi out-of-sample.",
      },
      hints: [
        "Snooping = banyak undian di data yang sama; pemenang = yang paling beruntung.",
        "Jurang IS→live yang dalam = sidik jari snooping.",
      ],
      reference: "1 − (1−p)^n: makin banyak mencoba, makin pasti tertipu. Arsip SEMUA varian.",
    },
    {
      id: "plafon",
      eyebrow: "Langkah 3 · Konsep",
      title: "Plafon family: kenapa tweak berhenti bekerja",
      prose: [
        "Setiap family punya plafon — batas atas fitness yang bisa dicapai logika itu di universe itu, tidak peduli seberapa kreatif tweak-nya. Untuk reversal 1–5 hari: ±0,94. Plafon bukan kegagalan analis; ia sifat dari ide itu sendiri: reversal jangka pendek hanya mengandung sedikit 'sinyal murni', sisanya noise mikrostruktur. Semua tweak — delay, decay, universe, operator — pada dasarnya memeras spons yang sama; setelah kering, diperas 20 kali pun tidak keluar air baru.",
        "Tanda-tanda kamu menabrak plafon (bukan sekadar 'butuh tweak lebih pintar'): (1) 10+ tweak terakhir bergerak dalam rentang sempit (±0,03) tanpa tren naik; (2) tweak yang 'berhasil' di satu sub-periode gagal di sub-periode lain (tanda kamu memoles noise, bukan sinyal); (3) perbaikan hanya datang dari mempersempit universe/periode (memperkecil ujian, bukan memperkuat jawaban); (4) intuisi tim mulai mengarang alasan pasca-fakta ('mungkin pasar Asia libur panjang waktu itu…').",
        "Cara membaca figur: sumbu-x = jumlah tweak, sumbu-y = fitness terbaik sejauh itu; garis merah putus-putus = plafon ±0,94. Interpretasi: tweak 1–10 menanjak curam (fase belajar — tweak bekerja!), 11–25 melambat (fase peras), 26+ datar total (fase gosok — plafon tercapai). Kesalahan termahal adalah mengira fase gosok sebagai 'butuh ide tweak lebih brilian'. Tidak — fase gosok adalah sinyal untuk PINDAH, bukan untuk MEMOLES.",
        "Rumus pendeteksi sederhana: ambil 15 fitness terakhir, hitung slope tren linearnya. Slope ≈ 0 (mis. < 0,002 per tweak) selama 15 tweak = plafon terkonfirmasi. Ini bukan statistik canggih — ini termometer. Demamnya: tidak ada tren naik.",
      ],
      formula: String.raw`\text{slope} = \frac{\sum (t-\bar{t})(f-\bar{f})}{\sum (t-\bar{t})^2} \approx 0 \Rightarrow \text{plafon}`,
      formulaNote: "t = nomor tweak, f = fitness terbaik s.d. tweak itu. Slope mengukur kenaikan fitness per tweak. Contoh: 15 tweak terakhir slope 0,0008/tweak → praktis nol → plafon. Bandingkan fase awal: slope 0,015/tweak (naik nyata). Aturan: slope < 0,002 selama 15 tweak = berhenti memoles.",
      figure: {
        svg: FIG_PLAFON,
        alt: "Kurva fitness menanjak lalu datar di plafon 0,94 setelah 25 tweak.",
        caption: "Tiga fase: belajar (naik), peras (melambat), gosok (datar di plafon). Fase gosok = waktunya pindah.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Plafon adalah kabar baik yang menyamar sebagai kabar buruk. Ia memberi tahumu dengan tepat kapan berhenti — dan 'kapan berhenti' adalah keputusan termahal di riset. Tim yang tidak mengenal plafon membayar dengan kuartal; tim yang mengenalnya membayar dengan minggu.",
      },
      reference: "Slope ≈ 0 selama 15 tweak = plafon. Jangan gosok spons kering.",
    },
    {
      id: "lab-snooping",
      eyebrow: "Langkah 4 · Lab",
      title: "Saksikan snooping melahirkan 'bintang palsu'",
      prose: [
        "Lab ini mensimulasikan dosa snooping secara langsung. Data = murni noise (return acak tanpa sinyal apa pun — 'strategi' terbaik yang sebenarnya = tidak ada). Kamu akan 'mencoba' 200 strategi acak (masing-masing = bobot acak pada noise) dan mencatat Sharpe terbaik. Prediksi sebelum menjalankan: berapa Sharpe 'terbaik' dari 200 undian noise murni?",
        "Hasilnya akan mengganggu: Sharpe terbaik noise murni menembus 2,8 — PADA SEED 99 (seed yang dipakai lab ini): antar-seed bervariasi 1,85–3,02, jadi 'menembus 2,8' bukan sifat umum 200 undian noise; yang umum adalah 'Sharpe terbaik noise bisa menembus ambang 1,25 dengan mudah' — jauh di atas ambang 1,25. Di dunia nyata, analis yang tidak sadar sedang mengundi akan merayakan angka ini, memolesnya, men-submitnya — lalu menyaksikan keruntuhannya di live. Lab ini adalah vaksin: sekali kamu melihat bintang palsu lahir dari noise di depan matamu, kamu tidak akan pernah merayakan Sharpe IS tanpa bertanya 'berapa undian yang kubayar untuk angka ini?'",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan 200 strategi acak di noise murni, catat Sharpe terbaik" },
        { id: "t2", text: "Jalankan dan bandingkan dengan ambang 1,25" },
        { id: "t3", text: "Ubah seed ke 1, 7, 42 dan catat Sharpe terbaik — berapa variasinya?" },
      ],
      expected: "Strategi acak terbaik dari 200 undian (seed 99): Sharpe 2.84\n> ambang 1.25? YA -> bintang palsu lahir dari noise murni",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Tapi strategi saya bukan acak — ada logikanya!” Lab ini tidak menuduh strategimu acak; ia menunjukkan bahwa SELEKSI dari banyak kandidat menghasilkan pemenang palsu bahkan dari noise. Dengan 200 kandidat 'masuk akal', mekanismenya identik — hanya labelnya yang berbeda.",
      },
      hints: [
        "Sharpe satu strategi = mean/std*sqrt(252) dari return-nya.",
        "Strategi acak ke-i: return = rata-rata noise dengan bobot acak — sederhananya: ambil subset acak hari lalu rata-ratakan.",
      ],
      code: {
        starter: "# Noise murni: 252 hari x 50 'saham' tanpa sinyal apa pun (JANGAN UBAH).\nimport random, math\n_rng = random.Random(99)\nnoise = [[_rng.gauss(0, 0.01) for _ in range(252)] for _ in range(50)]\n\n# TULIS KODEMU: 200 'strategi' acak, masing-masing rata-rata 10 saham acak\ndef sharpe(rets):\n    m = sum(rets) / len(rets)\n    s = math.sqrt(sum((x - m) ** 2 for x in rets) / len(rets))\n    return m / s * math.sqrt(252)\n\nterbaik = -9e9\nfor i in range(200):\n    saham = _rng.sample(range(50), 10)\n    r = [sum(noise[j][t] for j in saham) / 10 for t in range(252)]\n    s = sharpe(r)\n    terbaik = \n\nprint(f\"Strategi acak terbaik dari 200 undian (seed 99): Sharpe {terbaik:.2f}\")\nprint(f\"> ambang 1.25? {'YA' if terbaik > 1.25 else 'TIDAK'} -> {'bintang palsu lahir dari noise murni' if terbaik > 1.25 else 'aman'}\")\n",
        lockLines: 11,
        solution: "# Noise murni: 252 hari x 50 'saham' tanpa sinyal apa pun (JANGAN UBAH).\nimport random, math\n_rng = random.Random(99)\nnoise = [[_rng.gauss(0, 0.01) for _ in range(252)] for _ in range(50)]\n\n# TULIS KODEMU: 200 'strategi' acak, masing-masing rata-rata 10 saham acak\ndef sharpe(rets):\n    m = sum(rets) / len(rets)\n    s = math.sqrt(sum((x - m) ** 2 for x in rets) / len(rets))\n    return m / s * math.sqrt(252)\n\nterbaik = -9e9\nfor i in range(200):\n    saham = _rng.sample(range(50), 10)\n    r = [sum(noise[j][t] for j in saham) / 10 for t in range(252)]\n    s = sharpe(r)\n    terbaik = max(terbaik, s)\n\nprint(f\"Strategi acak terbaik dari 200 undian (seed 99): Sharpe {terbaik:.2f}\")\nprint(f\"> ambang 1.25? {'YA' if terbaik > 1.25 else 'TIDAK'} -> {'bintang palsu lahir dari noise murni' if terbaik > 1.25 else 'aman'}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Sharpe terbaik > 1,25", msg: "Bintang palsu dari noise murni.", pattern: "Strategi acak terbaik dari 200 undian \\(seed 99\\): Sharpe 2\\.\\d\\d" },
          { kind: "stdout_matches", task: "t2", label: "Melewati ambang", msg: "200 undian cukup untuk melahirkan pemenang palsu.", pattern: "> ambang 1\\.25\\? YA -> bintang palsu lahir dari noise murni" }
        ],
      },
      reference: "200 undian noise murni → Sharpe 'terbaik' > 1,25. Itulah harga tidak menghitung undian.",
    },
    {
      id: "lab-plafon",
      eyebrow: "Langkah 5 · Lab",
      title: "Termometer plafon: slope 15 tweak terakhir",
      prose: [
        "Sekarang deteksi plafon seperti analis senior. Diberikan deret 40 fitness 'terbaik sejauh ini' dari family reversal (mensimulasikan kasus nyata: naik cepat, melambat, datar di ±0,94). Tugasmu: hitung slope tren linear pada 15 tweak terakhir dan putuskan: LANJUTKAN MEMOLES atau PINDAH FAMILY (aturan: slope < 0,002 → pindah).",
        "Setelah selesai, ubah jendela menjadi 15 tweak PERTAMA dan hitung slopenya — bandingkan. Itulah beda fase belajar vs fase gosok dalam satu angka. Termometer ini murah, objektif, dan kebal terhadap 'tapi tweak berikutnya mungkin…' — karena ia menjawab dengan data, bukan harapan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `slope` 15 tweak terakhir" },
        { id: "t2", text: "Jalankan: pastikan slope + keputusan tercetak" },
      ],
      expected: "Slope 15 tweak terakhir: 0.0000/tweak\nKeputusan: PINDAH FAMILY (plafon terkonfirmasi)",
      note: {
        title: "Intuisi",
        body: "Slope 0,0000/tweak = tren naiknya nol persis — plafon datar sempurna. Bukan 'lambat', melainkan 'berhenti'. Di titik ini tiap tweak tambahan = undian berbayar tanpa hadiah. Pindah family bukan menyerah; ia realokasi modal ke tempat return-nya lebih tinggi.",
      },
      hints: [
        "Ambil f15 = fitness 15 terakhir; t = 0..14.",
        "slope = sum((t-mt)*(f-mf))/sum((t-mt)^2).",
      ],
      code: {
        starter: "# Fitness terbaik s.d. tweak ke-i, 40 tweak family reversal (JANGAN UBAH).\nfitness = [0.71, 0.76, 0.79, 0.83, 0.84, 0.86, 0.87, 0.89, 0.89, 0.90,\n           0.91, 0.91, 0.92, 0.92, 0.92, 0.93, 0.92, 0.93, 0.93, 0.94,\n           0.93, 0.94, 0.92, 0.93, 0.94, 0.93, 0.94, 0.93, 0.94, 0.93,\n           0.94, 0.93, 0.94, 0.93, 0.94, 0.93, 0.94, 0.93, 0.94, 0.93]\n\n# TULIS KODEMU\nf15 = fitness[-15:]\nn = len(f15)\nmt = sum(range(n)) / n\nmf = sum(f15) / n\nslope = \n\nprint(f\"Slope 15 tweak terakhir: {slope:.4f}/tweak\")\nprint(f\"Keputusan: {'PINDAH FAMILY (plafon terkonfirmasi)' if slope < 0.002 else 'LANJUTKAN MEMOLES'}\")\n",
        lockLines: 6,
        solution: "# Fitness terbaik s.d. tweak ke-i, 40 tweak family reversal (JANGAN UBAH).\nfitness = [0.71, 0.76, 0.79, 0.83, 0.84, 0.86, 0.87, 0.89, 0.89, 0.90,\n           0.91, 0.91, 0.92, 0.92, 0.92, 0.93, 0.92, 0.93, 0.93, 0.94,\n           0.93, 0.94, 0.92, 0.93, 0.94, 0.93, 0.94, 0.93, 0.94, 0.93,\n           0.94, 0.93, 0.94, 0.93, 0.94, 0.93, 0.94, 0.93, 0.94, 0.93]\n\n# TULIS KODEMU\nf15 = fitness[-15:]\nn = len(f15)\nmt = sum(range(n)) / n\nmf = sum(f15) / n\nslope = sum((t - mt) * (f - mf) for t, f in enumerate(f15)) / sum((t - mt) ** 2 for t in range(n))\n\nprint(f\"Slope 15 tweak terakhir: {slope:.4f}/tweak\")\nprint(f\"Keputusan: {'PINDAH FAMILY (plafon terkonfirmasi)' if slope < 0.002 else 'LANJUTKAN MEMOLES'}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Slope ≈ 0", msg: "Nol persis — plafon datar.", pattern: "Slope 15 tweak terakhir: 0\\.0000/tweak" },
          { kind: "stdout_matches", task: "t2", label: "Keputusan PINDAH FAMILY", msg: "Slope < 0,002 → pindah.", pattern: "Keputusan: PINDAH FAMILY \\(plafon terkonfirmasi\\)" },
          { kind: "equal", task: "t1", label: "`slope` ≈ 0", msg: "Slope tren 15 tweak terakhir.", name: "slope", value: 0.0, tol: 0.0005 }
        ],
      },
      reference: "Slope < 0,002 selama 15 tweak = plafon. Termometer murah, keputusan mahal.",
    },
    {
      id: "budget",
      eyebrow: "Langkah 6 · Praktik",
      title: "Budget tweak anti-snooping",
      prose: [
        "Kalau snooping adalah undian, solusinya adalah membatasi jumlah undian DAN mencatat semuanya. Praktik tim profesional: budget tweak per family — mis. 25 tweak untuk eksplorasi awal. Setiap tweak dicatat: nomor, perubahan, hasil SEMUA metrik (bukan hanya fitness), dan hipotesisnya ('mengapa perubahan ini seharusnya membantu?'). Tweak tanpa hipotesis = undian; undian tanpa catatan = snooping yang tidak terlacak.",
        "Dua tips. Pertama, pisahkan 'tweak hipotesis' dari 'tweak kepepet'. Tweak hipotesis ('delay 2 seharusnya menangkap pembalikan yang lebih lambat karena…') boleh dihitung sebagai riset. Tweak kepepet ('coba decay 3,5 siapa tahu…') dihitung sebagai undian — dan undian ada budgetnya: mis. maksimal 5 per family. Kedua, tetapkan 'kriteria berhenti' SEBELUM mulai memoles: 'berhenti bila 15 tweak slope < 0,002 ATAU fitness ≥ 1,2'. Kriteria yang ditulis sebelum mulai = kompas; kriteria yang dibuat setelah melihat hasil = riasan.",
        "Miskonsepsi kedua: 'sedikit tweak lagi pasti naik.' Kata 'pasti' adalah bendera merah terbesar di meja riset. Tidak ada yang 'pasti naik' — ada ekspektasi nilai: (peluang naik × besarnya kenaikan) vs biaya waktu. Di plafon, peluang naik ≈ 0 sehingga ekspektasinya ≈ 0 berapa pun 'sedikit'-nya. Ganti 'pasti' dengan angka: 'berapa slope 15 terakhir?' — dan biarkan angka yang menjawab.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Saya hanya melaporkan yang terbaik — yang gagal tidak penting.” Arsip yang hanya berisi pemenang = bukti yang dipalsukan. Reviewer, rekan tim, dan dirimu tiga bulan dari sekarang butuh melihat SEMUA undian untuk menilai apakah 'terbaik' itu skill atau keberuntungan. Catat semua, laporkan yang terbaik — dengan menyebut n.",
      },
      hints: [
        "Budget: mis. 25 tweak eksplorasi + 5 undian per family.",
        "Tulis kriteria berhenti SEBELUM memoles, bukan sesudah.",
      ],
      reference: "Batasi undian, catat semua, tulis kriteria berhenti di awal.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kapan berhenti, kapan pindah",
      prose: [
        "Satu: slope 15 terakhir ≥ 0,005 → FASE BELAJAR: lanjutkan memoles, tweak bekerja. Dua: slope 0,002–0,005 → FASE PERAS: lanjutkan tapi dengan budget ketat (maks 10 tweak lagi) + hipotesis tertulis tiap tweak. Tiga: slope < 0,002 selama 15 tweak → PLAFON: berhenti memoles family ini; pindah family atau ganti universe secara fundamental. Empat: fitness sudah ≥ 1,2 DAN slope masih positif → JANGAN KEJAR SEMPURNA: kunci kandidat, submit, alihkan energi ke kandidat berikutnya. Mengejar 1,2 → 1,35 di satu kandidat hampir selalu kalah dari membangun kandidat kedua 1,2.",
        "Lima: pola 'tweak berhasil di sub-periode A, gagal di B' berulang → SNOOPING AKTIF: hentikan semua poles, audit arsip (berapa n sebenarnya?), dan uji kandidat terbaik di periode yang belum pernah dipakai tuning. Bila runtuh → buang, bukan poles.",
        "Aturan praktis 10 detik: '15 tweak terakhir naik berapa?' — kalau jawabannya butuh mikir lama atau angkanya < 0,03 total, kamu sedang menggosok plafon. Berhenti.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Keputusan pindah family terasa seperti menyerah — padahal ia adalah diversifikasi waktu, konsep yang sama dengan diversifikasi portofolio. Waktu riset yang 100% di satu family = portofolio yang 100% di satu saham: rapuh. Pindah = rebalance.",
      },
      reference: "Slope ≥ 0,005 lanjut; 0,002–0,005 peras ketat; < 0,002 pindah; ≥ 1,2 kunci & submit.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "12 tweak, fitness 0,88 → 0,93",
      prose: [
        "Data: tim 'Nusa' memoles reversal 2–4 hari. 12 tweak tercatat, fitness terbaik: 0,88 → 0,90 → 0,91 → 0,91 → 0,92 → 0,92 → 0,93 → 0,92 → 0,93 → 0,93 → 0,93 → 0,93. Tweak ke-13 diusulkan: 'ganti decay linear menjadi eksponensial, half-life 2 hari'. Tugas: putuskan — setujui tweak ke-13, atau hentikan?",
        "Pembahasan: total kenaikan 12 tweak = 0,05; 6 tweak terakhir bergerak 0,92–0,93 (rentang 0,01, tanpa tren). Slope 6 terakhir ≈ 0,001/tweak — di bawah 0,002. Ini FASE GOSOK: plafon family (±0,94) sudah tercapai. Tweak ke-13 = undian ke-13 di spons kering. Keputusan: TOLAK tweak ke-13; alihkan tim ke eksplorasi family baru (volatilitas/volume) dengan budget 25 tweak. Estimasi nilai: ekspektasi tweak ke-13 ≈ +0,001 fitness vs biaya 2–3 hari tim; ekspektasi 25 tweak family baru (fase belajar, slope historis family baru 0,01) ≈ +0,2 — 200× lipat.",
        "Catatan penting: keputusan ini BUKAN vonis bahwa reversal tidak berguna — 0,93 adalah kandidat yang layak dan tetap diarsipkan (bahkan bisa disubmit bila lolos check lain). Ini vonis bahwa MEMOLESNYA sudah tidak berguna. Bedakan 'ide sudah matang' vs 'ide sudah mati': yang pertama dirayakan, yang kedua ditinggalkan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Menolak tweak ke-13 membutuhkan keberanian manajerial — pengusulnya biasanya analis yang paling bersemangat. Cara menolak yang benar: tunjukkan slope, bukan otoritas. 'Slope 6 terakhir 0,001 — bukan saya yang menolak idemu, angkanya.' Data melindungi hubungan tim.",
      },
      reference: "12 tweak, slope ≈ 0,001 → tolak tweak ke-13, alihkan ke family baru.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Tema: bedakan kemajuan nyata dari ilusi undian.",
      ],
      tasks: [],
      summary: [
        "Data snooping: P(tertipu) = 1 − (1−p)^n — makin banyak varian dicoba, makin pasti 'menemukan' bintang palsu.",
        "Korban snooping: IS brilian, live runtuh. Arsip SEMUA varian, bukan hanya yang terbaik.",
        "Plafon family (reversal 1–5 hari: ±0,94) = batas logika itu sendiri; tweak tidak menembusnya.",
        "Deteksi: slope 15 tweak terakhir < 0,002 = plafon → berhenti memoles, pindah family.",
        "Budget: mis. 25 tweak + 5 undian per family; kriteria berhenti ditulis SEBELUM memoles.",
      ],
      next: { label: "WQB15 — Korelasi Antar-Alpha: Berpikir Klaster, Bukan Baris", href: "/v2/learn/wqb15-korelasi-klaster" },
      quiz: [
        {
          q: "Analis mencoba 100 varian (p = 5% tiap varian terlihat bagus karena luck). Peluang minimal satu bintang palsu?",
          options: [
            { text: "≈ 99,4% — praktis pasti", why: "Benar. 1 − 0,95^100 ≈ 0,994. Pada 100 undian, bintang palsu bukan kemungkinan — ia kepastian.", correct: true },
            { text: "≈ 5% — sama seperti satu varian", why: "Salah. 5% adalah peluang PER varian; peluang kolektifnya 1 − 0,95^n." },
            { text: "≈ 50% — setengah-setengah", why: "Salah. 50% tercapai sekitar n = 14; pada n = 100 sudah 99,4%." }
          ],
        },
        {
          q: "Setiap varian masuk akal secara ekonomi. Apakah ini masih bisa snooping?",
          options: [
            { text: "Ya — snooping soal jumlah undian, bukan akal tiap varian", why: "Benar. 100 varian masuk akal = 100 undian; pemenangnya tetap bisa keberuntungan.", correct: true },
            { text: "Tidak — akal ekonomi = kebal snooping", why: "Salah. 'Masuk akal' tidak mengubah matematika 1 − (1−p)^n." },
            { text: "Hanya jika variannya > 1000", why: "Salah. Pada p = 5%, n = 100 saja sudah 99,4%." }
          ],
        },
        {
          q: "15 tweak terakhir slope 0,0000/tweak, fitness mentok 0,93–0,94. Keputusan?",
          options: [
            { text: "PINDAH FAMILY — plafon terkonfirmasi", why: "Benar. Slope < 0,002 = fase gosok; tweak ke-41 tidak lebih pintar dari ke-20.", correct: true },
            { text: "LANJUTKAN — siapa tahu tweak berikutnya menembus", why: "'Siapa tahu' = undian. Tren nol = tidak ada ekspektasi kenaikan berapa pun biayanya." },
            { text: "BUANG family-nya — 0,94 tidak berguna", why: "Salah. 0,94 kandidat layak (diarsipkan/bisa disubmit); yang dihentikan MEMOLESNYA, bukan idenya." }
          ],
        },
        {
          q: "Mana tanda kamu sedang SNOOPING (bukan sekadar memoles)?",
          options: [
            { text: "Tweak 'berhasil' di sub-periode A tapi gagal di B, berulang-ulang", why: "Benar. Pola ini = kamu memoles noise, bukan sinyal. Hentikan dan audit.", correct: true },
            { text: "Fitness naik 0,05 dalam 12 tweak", why: "Ini kemajuan nyata (fase belajar/peras) — bukan tanda snooping." },
            { text: "Mencatat semua 40 varian termasuk yang gagal", why: "Ini justru OBAT snooping — arsip lengkap membuat n terlihat." }
          ],
        },
        {
          q: "Kriteria berhenti yang benar ditulis…",
          options: [
            { text: "SEBELUM mulai memoles", why: "Benar. Kompas sebelum berlayar; kriteria sesudah melihat hasil = riasan.", correct: true },
            { text: "Setelah melihat 10 tweak pertama", why: "Terlambat — 10 hasil sudah memengaruhi 'kriteria'-mu tanpa sadar." },
            { text: "Tidak perlu — ikuti intuisi saja", why: "Intuisi di fase gosok selalu berkata 'sedikit lagi'. Itulah jebakannya." }
          ],
        }
      ],
      reference: "Hitung undianmu, hormati plafon, tulis kriteria berhenti di awal.",
    },
  ],
};
