import type { V2Lesson } from "../lib/types";

const FIG_SUB = `<svg viewBox="0 0 600 330" role="img" aria-label="Sharpe per sub-universe: satu segmen merah jauh di bawah ambang.">
<g font-family="var(--font-ui)">
<text x="20" y="28" font-size="14" fill="var(--chart-text)" font-weight="bold">Sharpe per sub-universe (kandidat &ldquo;Perkasa&rdquo;)</text>
<g font-size="12" fill="var(--chart-text)">
<text x="20" y="76">USA large</text>
<text x="20" y="116">USA small</text>
<text x="20" y="156">EUR</text>
<text x="20" y="196">ASI</text>
<text x="20" y="236">GLB</text>
</g>
<g>
<rect x="120" y="60" width="264" height="24" fill="var(--c2)" opacity="0.9"/>
<text x="126" y="77" font-size="11" fill="#fff">2,2</text>
<rect x="120" y="100" width="228" height="24" fill="var(--c2)" opacity="0.9"/>
<text x="126" y="117" font-size="11" fill="#fff">1,9</text>
<rect x="120" y="140" width="204" height="24" fill="var(--c2)" opacity="0.9"/>
<text x="126" y="157" font-size="11" fill="#fff">1,7</text>
<rect x="120" y="180" width="72" height="24" fill="#e5484d" opacity="0.9"/>
<text x="126" y="197" font-size="11" fill="#fff">0,6</text>
<rect x="120" y="220" width="180" height="24" fill="var(--c4)" opacity="0.9"/>
<text x="126" y="237" font-size="11" fill="#fff">1,5</text>
</g>
<line x1="240" y1="44" x2="240" y2="256" stroke="var(--chart-text)" stroke-width="2" stroke-dasharray="5 4"/>
<text x="240" y="272" font-size="11" fill="var(--chart-text)" text-anchor="middle">ambang 1,0</text>
<text x="120" y="300" font-size="12" fill="var(--chart-text)">Keseluruhan: Sharpe 1,9 &mdash; tetapi ASI 0,6 &lt; 1,0 &rarr; GAGAL.</text>
<text x="120" y="318" font-size="11" fill="var(--chart-text)">Sinyal hanya hidup di 4 dari 5 segmen: rapuh, bukan kuat.</text>
</g>
</svg>`;

export const wqb12: V2Lesson = {
  slug: "wqb12-sub-universe",
  track: "WorldQuant Brain",
  module: "Praktik & Diagnosis",
  title: "WQB12 — Sub-Universe Sharpe: Ujian Ketat Kandidat Kuat",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kandidat Perkasa yang roboh di segmen kelima",
      prose: [
        "Kandidat 'Perkasa' datang dengan angka yang membuat ruangan hening: Sharpe 1,9 keseluruhan, fitness 1,7, turnover 0,38. Tiga analis memeriksanya bergantian — tidak ada yang menemukan cacat. Satu-satunya check yang belum dibaca: sub-universe Sharpe. Seseorang mengkliknya sambil lalu, mengira formalitas.",
        "Hasilnya: USA large 2,2; USA small 1,9; EUR 1,7; GLB 1,5; ASI 0,6. Empat segmen perkasa, satu segmen — Asia — Sharpe 0,6, jauh di bawah ambang 1,0. Check GAGAL. Ruangan yang tadinya hening menjadi gaduh: 'tapi keseluruhan 1,9!' Ya — dan justru itu masalahnya. Sinyal ini ternyata hanya hidup di Amerika dan Eropa; di Asia ia nyaris noise. Begitu regime berubah atau bobot Asia naik di live, Sharpe 1,9 itu menguap.",
        "Twist-nya: Perkasa bukan sinyal yang buruk — ia sinyal yang tidak jujur tentang dirinya sendiri. Angka agregat 1,9 menyembunyikan fakta bahwa 20% wilayah kerjanya tidak berfungsi. Sub-universe check ada untuk satu pertanyaan sederhana: apakah sinyalmu bekerja di mana-mana, atau hanya di halaman belakangmu sendiri?",
        "Konteks singkat. Universe = himpunan saham tempat alpha diuji (mis. gabungan USA, EUR, ASI, GLB). Sub-universe = potongan universe per region/segmen. Sub-universe Sharpe = Sharpe yang dihitung terpisah di tiap potongan. Prasyarat dari praktik sebelumnya: kamu sudah bisa membaca panel hasil dan tujuh IS checks — check keenam inilah yang kita bedah habis di sini. Setelah lesson ini kamu bisa: (1) menjelaskan apa yang diukur sub-universe Sharpe dan kenapa agregat bisa menipu; (2) menghitung Sharpe per sub-universe dari matriks return; (3) menjalankan keputusan lolos/gagal berbasis Sharpe minimum; (4) membedakan kandidat rapuh vs kandidat yang benar-benar kuat.",
        "Framing contoh kerja: contoh lima segmen di lesson ini (USA large, USA small, EUR, ASI, GLB) MENGASUMSIKAN akses konsultan — sesuai WQB7, sebelum berstatus Research Consultant yang terbuka hanyalah USA, sehingga contoh ini tidak bisa direplikasi apa adanya oleh pengguna USA-only. Bagi pengguna USA-only, sub-universe yang sama tetap berlaku di dalam USA: potong universe menurut ukuran (large vs small cap) atau sektor — lima segmen contohnya menjadi USA large, USA small, USA value, USA growth, dan USA sektor terbesar. Aturannya tidak berubah: minimum segmen harus 1,0 atau lebih.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Di live trading, 'di mana sinyal bekerja' sama pentingnya dengan 'seberapa besar return-nya'. Dana yang crash di 2020-an umumnya bukan karena sinyalnya bodoh — melainkan karena sinyalnya hanya teruji di satu regime/region lalu regime-nya berganti. Sub-universe check adalah vaksin dini terhadap kerapuhan itu.",
      },
      reference: "Agregat bisa berbohong; potongannya tidak. Kuat = kuat di semua segmen.",
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Apa yang sebenarnya diuji",
      prose: [
        "Bayangkan universe 3.000 saham dibagi lima sub-universe: USA large (1.000 saham), USA small (600), EUR (700), ASI (400), GLB (300). Platform menghitung return sinyal di tiap potongan secara terpisah, lalu menghitung Sharpe masing-masing. Aturan main: sub-universe Sharpe = Sharpe TERENDAH di antara semua potongan, dan ia harus ≥ 1,0. Bukan rata-rata — minimum. Satu potongan 0,6 = gagal, titik.",
        "Kenapa minimum, bukan rata-rata? Karena rata-rata bisa dibeli dengan satu segmen luar biasa. Contoh: empat segmen Sharpe 2,0 dan satu segmen −0,5 → rata-rata 1,5 (terlihat lolos) padahal ada segmen yang rugi. Minimum memaksa kejujuran: sinyalmu hanya sekuat titik terlemahnya. Analogi: rantai hanya sekuat mata rantai terlemah — sub-universe check mengukur mata rantai itu.",
        "Kenapa kandidat kuat bisa gugur di sini? Tiga penyebab klasik. Pertama, sinyal overfit ke karakteristik satu region — mis. memakai pola volume yang hanya ada di saham USA large cap yang likuid; di ASI yang likuiditasnya tipis, polanya hilang. Kedua, data snooping per region: analis tanpa sadar memoles parameter sampai bagus di region yang paling sering ia lihat (biasanya USA), mengabaikan sisanya. Ketiga, regime tersembunyi: satu sub-universe kebetulan sedang dalam regime yang bersahabat selama periode IS (mis. tren kuat di EUR 2019–2024) — Sharpe tinggi di sana bukan skill, melainkan cuaca.",
        "Contoh angka Perkasa: keseluruhan 1,9 vs minimum sub-universe 0,6. Selisih 1,3 poin Sharpe itu = 'pajak kerapuhan'. Kandidat kedua, 'Merata': keseluruhan 1,45, sub-universe 1,3 / 1,5 / 1,2 / 1,4 / 1,1 → minimum 1,1 ≥ 1,0 → LOLOS. Merata 'kalah' di headline (1,45 < 1,9) tapi menang di kejujuran — dan di live, kejujuran mengalahkan headline.",
      ],
      formula: String.raw`\text{SubUniverseSharpe} = \min_{s \in \text{segmen}} \text{Sharpe}_s \quad \text{lolos jika } \geq 1{,}0`,
      formulaNote: "Sharpe_s = Sharpe di sub-universe s (dihitung dari return sinyal di saham-saham segmen itu saja). Contoh Perkasa: min(2,2; 1,9; 1,7; 0,6; 1,5) = 0,6 < 1,0 → GAGAL. Contoh Merata: min(1,3; 1,5; 1,2; 1,4; 1,1) = 1,1 ≥ 1,0 → LOLOS.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Keseluruhan 1,9 pasti lolos sub-universe juga.” Tidak ada hubungan yang dijamin. Sharpe keseluruhan adalah rata-rata tertimbang — ia bisa tinggi justru KARENA satu segmen raksasa (USA large) menutupi empat segmen kecil yang lemah. Selalu baca potongannya, bukan hanya agregatnya.",
      },
      hints: [
        "Sub-universe Sharpe = MINIMUM, bukan rata-rata.",
        "Ambang: minimum ≥ 1,0 (lebih longgar dari Sharpe keseluruhan 1,25 — karena tiap potongan sampelnya lebih kecil).",
      ],
      reference: "Kuat = minimum segmen ≥ 1,0. Rantai sekuat mata terlemah.",
    },
    {
      id: "figur",
      eyebrow: "Langkah 3 · Figur",
      title: "Melihat kerapuhan dalam satu gambar",
      prose: [
        "Cara membaca figur: lima batang horizontal = Sharpe di lima sub-universe kandidat Perkasa; garis putus-putus vertikal = ambang 1,0. Interpretasi: empat batang hijau melewati garis dengan nyaman (2,2 / 1,9 / 1,7 / 1,5) — tetapi batang ASI merah hanya 0,6, jauh di kiri garis. Satu batang merah = gagal total, tidak peduli empat lainnya setinggi apa.",
        "Perhatikan jebakannya secara visual: kalau figur ini hanya menampilkan 'keseluruhan 1,9' sebagai satu batang, ia terlihat perkasa. Begitu dipecah per segmen, kerapuhannya telanjang. Inilah fungsi figur ini di meja riset: mengubah 'Sharpe 1,9!' menjadi 'di mana tepatnya 1,9 itu berasal?' — dan jawabannya menentukan nasib kandidat.",
        "Latihan mata: bayangkan kandidat ketiga dengan batang 1,2 / 1,1 / 1,3 / 1,0 / 1,2 — semua hijau tapi mepet garis. Ia LOLOS (minimum 1,0), tapi ini kandidat 'lolos dengan keringat': tiap poles berikutnya harus menjaga tidak ada batang yang tergelincir ke kiri garis. Bandingkan dengan Merata (1,1–1,5): margin lebih tebal, tidur lebih nyenyak.",
      ],
      figure: {
        svg: FIG_SUB,
        alt: "Lima batang Sharpe sub-universe; segmen ASI 0,6 di bawah ambang 1,0.",
        caption: "Empat segmen perkasa tidak menolong satu segmen yang roboh: minimum yang dinilai.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Trader profesional membaca figur seperti ini bukan untuk mengagumi yang hijau, melainkan untuk menginterogasi yang merah: 'kenapa ASI 0,6?' Jawabannya — likuiditas tipis? regime? overfit region? — menentukan apakah kandidat bisa diperbaiki atau harus dibuang.",
      },
      reference: "Satu batang merah = gagal. Interogasi yang merah, bukan kagumi yang hijau.",
    },
    {
      id: "lab-hitung",
      eyebrow: "Langkah 4 · Lab",
      title: "Hitung Sharpe per sub-universe",
      prose: [
        "Waktunya menghitung sendiri. Diberikan matriks return: 5 sub-universe × 252 hari. Tugasmu: hitung Sharpe tahunan tiap segmen (mean/std × √252), lalu ambil minimumnya. Data ini mensimulasikan kandidat 'Perkasa-mini': empat segmen sehat, satu segmen lemah.",
        "Perhatikan cara data dibuat di bagian terkunci: tiap segmen punya 'mean_true' berbeda — segmen ASI mean-nya hanya sepertiga yang lain. Inilah model mainan dari 'sinyal hanya hidup di sebagian region'. Setelah selesai, coba ubah mean ASI menjadi setara yang lain dan lihat minimumnya melonjak — begitulah rasanya memperbaiki akar masalah vs memoles angka.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sharpes` (list 5 Sharpe) dan `min_sharpe`" },
        { id: "t2", text: "Jalankan: pastikan 5 baris + minimum tercetak" },
      ],
      expected: "USA_large: 2.23\nUSA_small: 2.17\nEUR: 1.59\nASI: 0.58\nGLB: 2.19\nSub-universe Sharpe (min): 0.58",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Rata-rata lima Sharpe = 1,75, masih di atas 1,0 — lolos dong?” Inilah jebakan yang sama persis dengan cerita Perkasa. Aturannya minimum, bukan rata-rata. Rata-rata 1,75 dengan minimum 0,58 = GAGAL. Tulis min(), bukan sum()/5.",
      },
      hints: [
        "Sharpe tiap segmen: mean/std*sqrt(252), std pembagi N.",
        "min_sharpe = min(sharpes).",
      ],
      code: {
        starter: "# Return 5 sub-universe x 252 hari (JANGAN UBAH).\nimport random, math\n_rng = random.Random(626)\nsegs = [(\"USA_large\", 0.0011, 0.0079), (\"USA_small\", 0.0009, 0.0076),\n        (\"EUR\", 0.0008, 0.0075), (\"ASI\", 0.0003, 0.0082), (\"GLB\", 0.0008, 0.0085)]\nrets = {n: [_rng.gauss(mu, sd) for _ in range(252)] for n, mu, sd in segs}\n\n# TULIS KODEMU\nsharpes = []\nfor nama, mu, sd in segs:\n    r = rets[nama]\n    m = sum(r) / len(r)\n    s = math.sqrt(sum((x - m) ** 2 for x in r) / len(r))\n    sharpes.append(  )\nmin_sharpe = \n\nfor (nama, _, _), sh in zip(segs, sharpes):\n    print(f\"{nama}: {sh:.2f}\")\nprint(f\"Sub-universe Sharpe (min): {min_sharpe:.2f}\")\n",
        lockLines: 6,
        solution: "# Return 5 sub-universe x 252 hari (JANGAN UBAH).\nimport random, math\n_rng = random.Random(626)\nsegs = [(\"USA_large\", 0.0011, 0.0079), (\"USA_small\", 0.0009, 0.0076),\n        (\"EUR\", 0.0008, 0.0075), (\"ASI\", 0.0003, 0.0082), (\"GLB\", 0.0008, 0.0085)]\nrets = {n: [_rng.gauss(mu, sd) for _ in range(252)] for n, mu, sd in segs}\n\n# TULIS KODEMU\nsharpes = []\nfor nama, mu, sd in segs:\n    r = rets[nama]\n    m = sum(r) / len(r)\n    s = math.sqrt(sum((x - m) ** 2 for x in r) / len(r))\n    sharpes.append(m / s * math.sqrt(252))\nmin_sharpe = min(sharpes)\n\nfor (nama, _, _), sh in zip(segs, sharpes):\n    print(f\"{nama}: {sh:.2f}\")\nprint(f\"Sub-universe Sharpe (min): {min_sharpe:.2f}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "ASI ≈ 0,58 (terendah)", msg: "Segmen lemah terdeteksi sebagai minimum.", pattern: "ASI: 0\\.58" },
          { kind: "stdout_matches", task: "t2", label: "Minimum = 0,58", msg: "min(), bukan rata-rata.", pattern: "Sub-universe Sharpe \\(min\\): 0\\.58" },
          { kind: "equal", task: "t1", label: "`min_sharpe` ≈ 0,58", msg: "Minimum lima Sharpe.", name: "min_sharpe", value: 0.58, tol: 0.02 }
        ],
      },
      reference: "Hitung per segmen → ambil minimum. ASI 0,58 = mata rantai terlemah.",
    },
    {
      id: "lab-keputusan",
      eyebrow: "Langkah 5 · Lab",
      title: "Mesin keputusan sub-universe",
      prose: [
        "Lab kedua: ubah angka menjadi keputusan. Diberikan tiga kandidat (Perkasa, Merata, dan 'Goyah' — yang semua segmennya mepet ambang), tentukan LOLOS/GAGAL tiap kandidat berdasarkan minimum sub-universe ≥ 1,0, plus 'margin' (jarak minimum ke ambang) sebagai ukuran tidur nyenyak.",
        "Margin penting untuk praktik: kandidat dengan margin 0,02 (minimum 1,02) lolos secara teknis tapi hidup di tepi jurang — satu poles yang salah arah dan ia gagal. Kandidat dengan margin 0,4 punya ruang bernapas. Lab ini mengajarkanmu membaca bukan hanya lolos/gagal, tapi seberapa nyaman kelolosan itu.",
      ],
      tasks: [
        { id: "t1", text: "Untuk tiap kandidat: minimum, margin, keputusan" },
        { id: "t2", text: "Jalankan: pastikan 3 baris tercetak" },
      ],
      expected: "Perkasa: min 0.60 -> GAGAL (margin -0.40)\nMerata: min 1.10 -> LOLOS (margin 0.10)\nGoyah: min 1.02 -> LOLOS tipis (margin 0.02)",
      note: {
        title: "Intuisi",
        body: "Goyah 'lolos' tapi margin 0,02 = lolos yang tidak bisa dirayakan. Di meja riset, kandidat seperti ini diberi label 'lolos-bersyarat': boleh lanjut, tapi dilarang dipoles ke arah mana pun yang menyentuh segmen terlemahnya. Satu label menghemat satu bulan kerja sia-sia.",
      },
      hints: [
        "minimum = min(segmen); margin = minimum - 1.0.",
        "Status: 'LOLOS' bila margin >= 0.1, 'LOLOS tipis' bila >= 0, else 'GAGAL'.",
      ],
      code: {
        starter: "# Sharpe per sub-universe 3 kandidat (JANGAN UBAH).\nkandidat = {\"Perkasa\": [2.2, 1.9, 1.7, 0.6, 1.5],\n            \"Merata\": [1.3, 1.5, 1.2, 1.4, 1.1],\n            \"Goyah\": [1.2, 1.1, 1.3, 1.02, 1.2]}\n\n# TULIS KODEMU\nfor nama, segs in kandidat.items():\n    mn = \n    margin = \n    status = \"LOLOS\" if margin >= 0.1 else (\"LOLOS tipis\" if margin >= 0 else \"GAGAL\")\n    print(f\"{nama}: min {mn:.2f} -> {status} (margin {margin:+.2f})\")\n",
        lockLines: 5,
        solution: "# Sharpe per sub-universe 3 kandidat (JANGAN UBAH).\nkandidat = {\"Perkasa\": [2.2, 1.9, 1.7, 0.6, 1.5],\n            \"Merata\": [1.3, 1.5, 1.2, 1.4, 1.1],\n            \"Goyah\": [1.2, 1.1, 1.3, 1.02, 1.2]}\n\n# TULIS KODEMU\nfor nama, segs in kandidat.items():\n    mn = min(segs)\n    margin = mn - 1.0\n    status = \"LOLOS\" if margin >= 0.1 else (\"LOLOS tipis\" if margin >= 0 else \"GAGAL\")\n    print(f\"{nama}: min {mn:.2f} -> {status} (margin {margin:+.2f})\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Perkasa GAGAL", msg: "min 0,6 < 1,0.", pattern: "Perkasa: min 0\\.60 -> GAGAL \\(margin -0\\.40\\)" },
          { kind: "stdout_matches", task: "t2", label: "Merata LOLOS", msg: "min 1,1 ≥ 1,0.", pattern: "Merata: min 1\\.10 -> LOLOS \\(margin \\+0\\.10\\)" },
          { kind: "stdout_matches", task: "t2", label: "Goyah LOLOS tipis", msg: "min 1,02: lolos dengan margin 0,02.", pattern: "Goyah: min 1\\.02 -> LOLOS tipis \\(margin \\+0\\.02\\)" }
        ],
      },
      reference: "Keputusan = minimum vs 1,0; margin = seberapa nyaman kelolosan itu.",
    },
    {
      id: "miskonsepsi",
      eyebrow: "Langkah 6 · Jebakan pikir",
      title: "Dua miskonsepsi tentang 'kuat'",
      prose: [
        "Miskonsepsi satu: 'lolos semua check lain = pasti bagus di live.' Sub-universe check justru dirancang untuk membunuh keyakinan ini. Kandidat bisa lolos Sharpe, fitness, turnover, drawdown, netralitas — dan tetap rapuh karena kekuatannya terkonsentrasi di satu region. 'Lolos semua check' artinya 'lolos semua yang dicek', bukan 'pasti bagus di live'. Live menguji hal yang tidak ada di check: regime yang belum pernah terlihat. Kandidat yang kuat di semua segmen punya peluang lebih baik menghadapi regime baru — bukan jaminan, tapi peluang.",
        "Miskonsepsi dua: 'segmen kecil tidak penting — bobotnya kecil.' Justru segmen kecil sering menjadi tempat sinyal mati PERTAMA di live: likuiditas berubah, biaya naik, pola menghilang. Lagi pula bobot region di live tidak tetap — alokasi bisa bergeser, dan segmen yang tadinya 10% bisa menjadi 25%. Kandidat yang gagal di segmen kecil = kandidat yang membawa bom waktu berbobot tidak pasti.",
        "Dua tips praktik. Pertama, saat merancang sinyal, uji sub-universe SEJAK prototipe — bukan di akhir. Mengetahui di minggu pertama bahwa idemu hanya bekerja di USA large menghemat tiga minggu poles sia-sia; kamu bisa langsung memutuskan: perbaiki logikanya atau buang. Kedua, catat 'peta kekuatan' tiap kandidat yang lolos (segmen terkuat vs terlemah + margin). Saat regime berubah di live nanti, peta ini adalah dokumen pertama yang dibuka — bukan untuk menyalahkan, melainkan untuk mendiagnosis cepat.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Sub-universe gagal? Gampang — keluarkan saja segmen ASI dari universe, kan opsional.” Mengeluarkan segmen yang gagal agar lolos check = memalsukan ujian. Itu bukan perbaikan sinyal; itu perbaikan laporan. Platform dan tim yang sehat menganggap ini pelanggaran integritas, bukan kreativitas.",
      },
      hints: [
        "Uji sub-universe sejak prototipe, bukan di akhir.",
        "Simpan peta kekuatan (terkuat/terlemah + margin) tiap kandidat lolos.",
      ],
      reference: "Lolos semua check ≠ pasti bagus di live. Segmen kecil = tempat sinyal mati pertama.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kapan perbaiki, kapan buang",
      prose: [
        "Satu: minimum ≥ 1,2 di semua segmen → KUAT, lanjut tanpa ragu; kandidat langka, prioritaskan. Dua: minimum 1,0–1,2 → LOLOS, lanjut dengan catatan margin; poles dilarang menyentuh segmen terlemah. Tiga: satu segmen 0,7–1,0, sisanya kuat → INVESTIGASI AKAR: apakah penyebabnya fundamental (likuiditas, struktur pasar) atau artefak (outlier satu tahun)? Fundamental → buang atau desain ulang logika; artefak → perbaiki data, uji ulang. Empat: satu segmen < 0,7 atau dua+ segmen < 1,0 → BUANG. Kerapuhan terlalu dalam untuk poles; energimu lebih berharga untuk kandidat baru.",
        "Lima: pola 'kuat di USA, lemah di semua non-USA' → curigai overfit region sejak awal; jangan habiskan budget poles — langsung uji hipotesis alternatif (mis. ganti faktor region-spesifik dengan faktor global) atau pindah ke universe yang memang kamu kuasai.",
        "Aturan praktis 10 detik: cari batang terpendek; ≥ 1,0 lanjut, < 1,0 buang — kecuali kamu bisa menyebut penyebabnya dalam satu kalimat dan penyebabnya artefak data.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Peta ini pada dasarnya menanyakan satu hal: 'apakah kelemahan segmen ini sesuatu yang kamu pahami?' Kelemahan yang dipahami (artefak data yang bisa dibersihkan) = bisa diperbaiki. Kelemahan yang misterius (entah kenapa ASI 0,6) = buang. Riset alpha adalah bisnis memahami, bukan bisnis berharap.",
      },
      reference: "Minimum ≥ 1,2 = kuat; 1,0–1,2 = lolos bersyarat; < 1,0 = investigasi akar atau buang.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Kandidat 'Samudra': agregat 1,75",
      prose: [
        "Data: Sharpe keseluruhan 1,75, fitness 1,5, turnover 0,44. Sub-universe: USA large 2,4; USA small 2,0; EUR 1,8; ASI 0,85; GLB 1,6. Tugas: putuskan dan tulis alasan satu kalimat.",
        "Pembahasan: minimum = 0,85 < 1,0 → GAGAL check, terlepas dari agregat 1,75 yang memesona. Masuk skenario tiga peta keputusan: satu segmen 0,7–1,0 → investigasi akar. Pertanyaan investigasi: kenapa ASI 0,85? Hipotesis A (fundamental): sinyal memakai pola intraday yang butuh likuiditas dalam; saham ASI lebih tipis → pola tidak terbentuk. Hipotesis B (artefak): satu tahun krisis Asia di periode IS menarik rata-rata ke bawah; di luar tahun itu ASI 1,3.",
        "Cara membedakan: hitung Sharpe ASI per tahun. Jika 4 dari 5 tahun ≥ 1,1 dan satu tahun −0,5 → artefak, kandidat bisa diperbaiki (buang tahun outlier dengan dokumentasi, atau terima dengan catatan). Jika 5 tahun semuanya 0,7–1,0 → fundamental, dan kandidat ini pada dasarnya 'sinyal USA/Eropa yang menyamar sebagai sinyal global' → BUANG, atau persempit universe secara jujur sejak desain (bukan setelah gagal check). Keputusan akhir Samudra: TUNDA dengan tugas investigasi — bukan lanjut, bukan buang, melainkan 'kembali dengan jawaban kenapa ASI 0,85'.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "'Tunda dengan tugas investigasi' adalah keputusan ketiga yang sering dilupakan — selain lanjut dan buang. Ia mencegah dua dosa: meloloskan kandidat rapuh (dosa komisi) dan membuang kandidat yang sebenarnya bisa diperbaiki (dosa omisi). Syaratnya: tugas investigasinya spesifik dan berbatas waktu.",
      },
      reference: "Samudra: agregat 1,75, minimum 0,85 → TUNDA dengan tugas: kenapa ASI 0,85?",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Uji apakah matamu kini otomatis mencari batang terpendek.",
      ],
      tasks: [],
      summary: [
        "Sub-universe Sharpe = MINIMUM Sharpe di semua segmen; lolos jika ≥ 1,0.",
        "Agregat bisa menipu: satu segmen raksasa menutupi segmen kecil yang lemah.",
        "Kandidat kuat bisa gugur: overfit region, data snooping per region, regime tersembunyi.",
        "Keputusan: ≥ 1,2 kuat; 1,0–1,2 lolos bersyarat; satu segmen 0,7–1,0 investigasi akar; < 0,7 buang.",
        "Uji sub-universe sejak prototipe; simpan peta kekuatan tiap kandidat lolos.",
      ],
      next: { label: "WQB13 — Self-Correlation: Gerbang Submit yang Sebenarnya", href: "/learn/wqb13-self-correlation" },
      quiz: [
        {
          q: "Kandidat: keseluruhan 1,9; segmen 2,2 / 1,9 / 1,7 / 0,6 / 1,5. Sub-universe Sharpe dan keputusan?",
          options: [
            { text: "0,6 → GAGAL", why: "Benar. Minimum = 0,6 < 1,0. Agregat 1,9 tidak relevan untuk check ini.", correct: true },
            { text: "1,74 (rata-rata) → LOLOS", why: "Salah. Aturannya minimum, bukan rata-rata. Rata-rata 1,74 menyembunyikan segmen 0,6." },
            { text: "1,9 → LOLOS", why: "Salah. 1,9 adalah agregat — check ini justru dirancang untuk tidak memercayai agregat." }
          ],
        },
        {
          q: "Kenapa aturan memakai minimum, bukan rata-rata?",
          options: [
            { text: "Rata-rata bisa dibeli satu segmen luar biasa; minimum memaksa kejujuran di titik terlemah", why: "Benar. Rantai sekuat mata terlemah — minimum mengukur mata itu.", correct: true },
            { text: "Minimum lebih mudah dihitung", why: "Bukan soal kemudahan — keduanya sama mudah. Ini soal filosofi pengujian." },
            { text: "Rata-rata selalu lebih kecil dari minimum", why: "Terbalik: rata-rata ≥ minimum. Justru itu masalahnya — rata-rata terlihat lebih baik." }
          ],
        },
        {
          q: "Satu segmen 0,85, sisanya ≥ 1,6. Respons sesuai peta keputusan?",
          options: [
            { text: "TUNDA + investigasi akar: fundamental atau artefak?", why: "Benar. Skenario tiga: 0,7–1,0 satu segmen → cari penyebab dulu (likuiditas? outlier tahun?).", correct: true },
            { text: "BUANG langsung", why: "Terburu-buru. 0,85 masih di zona investigasi (0,7–1,0), bukan zona buang (< 0,7)." },
            { text: "LANJUT — 4 dari 5 segmen kuat", why: "Salah. Satu segmen < 1,0 = gagal check. Tidak ada voting mayoritas." }
          ],
        },
        {
          q: "Mana miskonsepsi yang paling berbahaya di sini?",
          options: [
            { text: "'Lolos semua check lain = pasti bagus di live'", why: "Benar. Keyakinan ini membuat analis melewatkan kerapuhan segmen — padahal live menguji regime yang belum terlihat.", correct: true },
            { text: "'Sub-universe check terlalu ketat'", why: "Ambang 1,0 justru lebih longgar dari Sharpe keseluruhan 1,25 — ketatnya di tempat yang benar." },
            { text: "'Segmen kecil boleh diabaikan'", why: "Ini juga salah, tapi keyakinan 'lolos = pasti bagus' lebih berbahaya karena mematikan kewaspadaan total." }
          ],
        },
        {
          q: "Kandidat 'Goyah': minimum 1,02 (margin 0,02). Perlakuan yang tepat?",
          options: [
            { text: "Lolos bersyarat: lanjut, tapi poles dilarang menyentuh segmen terlemah", why: "Benar. Lolos teknis dengan margin 0,02 = hidup di tepi jurang; constraint tercatat mencegah bunuh diri.", correct: true },
            { text: "Rayakan — lolos adalah lolos", why: "Berbahaya. Margin 0,02 berarti satu tweak salah arah = gagal check." },
            { text: "Buang — terlalu mepet", why: "Terlalu keras. 1,02 ≥ 1,0 = lolos; yang dibutuhkan adalah kehati-hatian, bukan pembuangan." }
          ],
        }
      ],
      reference: "Cari batang terpendek. Minimum ≥ 1,0 = lanjut; di bawahnya = investigasi atau buang.",
    },
  ],
};
