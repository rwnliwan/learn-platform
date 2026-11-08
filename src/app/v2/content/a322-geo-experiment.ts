import type { V2Lesson } from "../lib/types";

// ── Figure: lift wilayah perlakuan vs placebo kontrol ────────────────────
const LIFT_SVG = `<svg viewBox="0 0 560 320" role="img" aria-label="Diagram batang: lift dua wilayah perlakuan jauh di atas lift placebo empat wilayah kontrol.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="50" y1="250" x2="530" y2="250"/><line x1="50" y1="200" x2="530" y2="200" stroke-width="2"/>
<line x1="50" y1="150" x2="530" y2="150"/><line x1="50" y1="100" x2="530" y2="100"/>
<line x1="50" y1="50" x2="530" y2="50"/>
</g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end">
<text x="44" y="253">-10</text><text x="44" y="203">0</text>
<text x="44" y="153">10</text><text x="44" y="103">20</text><text x="44" y="53">30</text>
</g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<rect x="60" y="119" width="50" height="81" fill="var(--c1)"/>
<text x="85" y="109" fill="var(--text)" font-weight="700">16,2</text>
<rect x="140" y="142" width="50" height="58" fill="var(--c1)"/>
<text x="165" y="132" fill="var(--text)" font-weight="700">11,6</text>
<rect x="220" y="195" width="50" height="5" fill="var(--chart-text)" opacity="0.55"/>
<text x="245" y="187" fill="var(--text-muted)" font-size="10">1,0</text>
<rect x="300" y="200" width="50" height="5" fill="var(--chart-text)" opacity="0.55"/>
<text x="325" y="217" fill="var(--text-muted)" font-size="10">-1,0</text>
<rect x="380" y="167" width="50" height="33" fill="var(--chart-text)" opacity="0.55"/>
<text x="405" y="159" fill="var(--text-muted)" font-size="10">6,7</text>
<rect x="460" y="200" width="50" height="5" fill="var(--chart-text)" opacity="0.55"/>
<text x="485" y="217" fill="var(--text-muted)" font-size="10">-0,9</text>
</g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<text x="85" y="270" fill="var(--text)">T1</text>
<text x="165" y="270" fill="var(--text)">T2</text>
<text x="245" y="270" fill="var(--text-muted)">C1</text>
<text x="325" y="270" fill="var(--text-muted)">C2</text>
<text x="405" y="270" fill="var(--text-muted)">C3</text>
<text x="485" y="270" fill="var(--text-muted)">C4</text>
<text x="125" y="292" fill="var(--c1)">wilayah perlakuan</text>
<text x="365" y="292" fill="var(--text-muted)">placebo (kontrol pura-pura diperlakukan)</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="50" y="24">lift (unit penjualan)</text><text x="430" y="24">data sintetis lab</text>
</g>
</svg>`;

export const a322: V2Lesson = {
  slug: "a322-geo-experiment",
  track: "Statistika",
  module: "Eksperimen",
  title: "A322 — Geo-Experiment: Uji Pasar Saat Randomisasi Mustahil",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Tidak semua pertanyaan bisnis bisa dijawab A/B test. Kamu tidak bisa menaikkan harga untuk setengah pelanggan di kota yang sama — mereka akan protes, pindah, atau tertawa. Kamu tidak bisa menayangkan iklan TV hanya untuk rumah bernomor ganjil. Lesson ini tentang geo-experiment: merandomisasi WILAYAH, bukan individu.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan kapan randomisasi individu mustahil dan kenapa geo-experiment adalah jawabannya; (2) memasangkan wilayah perlakuan dengan kontrol via matched market; (3) menghitung lift dengan difference-in-differences; (4) menjalankan placebo test untuk memvonis apakah efekmu nyata atau noise; (5) mengenali spillover — pembunuh senyap eksperimen wilayah.",
        "Rute: cerita (harga kopi yang 'berhasil'), matched market, difference-in-differences, placebo test, lab Pyodide (mesin geo-experiment), chart lift vs placebo, peta keputusan, mini-case ambang gratis ongkir, kuis, rangkuman. Estimasi 65 menit; lab sekitar 15 menit.",
        "Bekal ringkas, agar lesson mandiri. Pertama, A/B test: bandingkan rata-rata dua kelompok acak; bedanya = efek kausal bila randomisasi bersih. Kedua, rata-rata dan selisih — seluruh lesson ini hanya memakai itu, tidak ada distribusi eksotis. Ketiga, intuisi confounding: bila dua wilayah tumbuh bersamaan karena musim, perbandingan mentah 'sebelum vs sesudah' menuduh perlakuan atas jasa musim.",
      ],
      tasks: [],
      hints: [
        "Intuisi pembuka: geo-experiment menjawab 'apa yang terjadi BILA kita lakukan X di wilayah ini?' — dengan wilayah lain sebagai mesin waktu yang menunjukkan apa yang TERJADI TANPA X.",
      ],
      reference: "Bekal: (1) logika A/B test; (2) rata-rata & selisih; (3) confounding musiman.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Kenaikan harga yang 'berhasil' — di semua kota",
      prose: [
        "Brand kopi 'Kapal Rindu' menaikkan harga 10% di dua kota uji, lalu membandingkan penjualan sebelum vs sesudah: naik 8%! Direksi bersorak, harga dinaikkan nasional. Tiga bulan kemudian, penjualan nasional turun 5% dan kompetitor mengambil alih rak.",
        "Twist-nya ada di empat kota yang TIDAK ikut uji: penjualan mereka juga naik 7% pada periode yang sama — musim liburan. Kenaikan 8% di kota uji hampir seluruhnya adalah jasa musim, bukan jasa harga. Dan lebih parah: pelanggan di perbatasan kota uji menyetir 15 menit ke kota sebelah yang harganya belum naik — penjualan kota uji 'tumbuh' sebagian karena kanibalisasi yang tercatat sebagai keberhasilan.",
        "Lesson ini membangun eksperimen wilayah yang jujur: wilayah perlakuan dipasangkan dengan wilayah kontrol yang mirip (matched market), efek dihitung sebagai selisih-dari-selisih (difference-in-differences), dan kejujurannya diuji dengan placebo test — 'bagaimana bila kota kontrol yang pura-pura diperlakukan?'",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "Keputusan harga, promo regional, dan ekspansi adalah keputusan modal dengan risiko nyata. Eksperimen wilayah yang buruk memberi lampu hijau palsu — seperti model kredit yang memberi skor bagus karena datanya bocor. Geo-experiment yang benar adalah risk control untuk keputusan komersial: ia memisahkan 'efek kebijakanku' dari 'efek dunia yang memang bergerak'.",
      },
      reference: "Sebelum-vs-sesudah tanpa kontrol = menuduh kebijakan atas jasa musim. Spillover = kanibalisasi tercatat sebagai sukses.",
    },
    {
      id: "konsep-matched",
      eyebrow: "Langkah 3 · Konsep",
      title: "Matched Market — Si Kembaran",
      prose: [
        "Definisi: matched market memasangkan setiap wilayah perlakuan dengan wilayah kontrol yang PALING MIRIP pada periode pra-perlakuan — biasanya dari rata-rata penjualan, tren, dan ukuran pasar. T1 (rata-rata pra 426) dipasangkan dengan C1 (rata-rata pra 424), bukan dengan C3 (rata-rata pra 261): membandingkan gajah dengan semut tidak adil bagi keduanya.",
        "Kenapa tidak asal pilih kontrol? Karena wilayah yang berbeda level punya dinamika berbeda: kota kecil yang tumbuh 20% setahun tidak bisa menjadi cermin kota besar yang stagnan. Matching adalah cara murah meniru randomisasi: kita tidak bisa mengacak, jadi kita cari kembarannya.",
        "Kepribadiannya: matched market seperti mencari saudara kembar untuk uji obat — bukan orang acak dari jalan. Kembar identik sulit; kembar yang 'cukup mirip' (selisih pra-perlakuan kecil) sudah jauh lebih baik daripada rata-rata semua kota. Kapan memakai: (1) jumlah wilayah sedikit (4–50); (2) ada histori pra-perlakuan yang panjang. Kapan tidak: bila tidak ada wilayah yang mirip sama sekali — akui saja, jangan paksakan; pakai synthetic control (rata-rata berbobot beberapa kontrol) atau tunda eksperimen.",
      ],
      formula: String.raw`\text{pasangan}(T) = \arg\min_{C \in \text{kontrol}} \left| \bar{y}_{T,\text{pra}} - \bar{y}_{C,\text{pra}} \right|`,
      formulaNote: "pasangan(T) = wilayah kontrol terpilih untuk wilayah perlakuan T; y-bar pra = rata-rata penjualan periode pra-perlakuan; argmin = pilih yang selisihnya terkecil. Contoh lab: T1 rata-rata pra 426,9 → C1 (424,1) menang atas C3 (261,4). Matching memakai data PRA saja — memakai data pasca untuk memilih pasangan adalah curang (memilih wasit setelah pertandingan).",
      tasks: [],
      note: {
        title: "🚨 Mitos: kontrol terbaik = rata-rata semua wilayah lain",
        type: "pitfall",
        body: "Yang benar: rata-rata semua kontrol mencampur kota besar, kota kecil, dan kota wisata menjadi 'kota Frankenstein' yang tidak mirip siapa pun. Bila T1 mirip C1 tetapi C3 berperilaku beda jauh, memasukkan C3 hanya menambah noise. Satu kembaran yang mirip mengalahkan sepuluh kenalan yang asal-asalan — kecuali kamu memakai synthetic control yang memberi bobot optimal, bukan rata-rata naif.",
      },
      hints: [
        "💡 Intuisi: matching yang baik terlihat dari periode pra: dua garis yang berjalan beriringan SEBELUM perlakuan. Bila garisnya sudah menyimpang sebelum perlakuan dimulai, pasanganmu salah — jangan lanjutkan ke perhitungan lift.",
        "💡 Intuisi: regresi ke rata-rata (regression to the mean) adalah jebakan matching: wilayah yang dipilih karena 'kebetulan tinggi' di pra cenderung turun sendiri di pasca. Lawannya: match dari tren dan level jangka panjang, bukan satu titik waktu.",
      ],
      reference: "Pasangan = kontrol dengan rata-rata pra paling dekat. Cek visual: garis pra harus berjalan beriringan.",
    },
    {
      id: "konsep-did",
      eyebrow: "Langkah 4 · Konsep",
      title: "Difference-in-Differences — Si Pengurang Musim",
      prose: [
        "Definisi: lift = (pasca − pra) di wilayah perlakuan DIKURANGI (pasca − pra) di wilayah kontrol pasangannya. Selisih pertama mengandung efek perlakuan + musim; selisih kedua hanya musim (kontrol tidak diperlakukan). Mengurangkan keduanya = musimnya saling menghapus, tersisa efek perlakuan.",
        "Contoh angka lab: T1 naik dari 426,9 ke 458,6 (+31,7); pasangannya C1 naik dari 424,1 ke 439,6 (+15,5). Lift = 31,7 − 15,5 = 16,2 — bukan 31,7. Tanpa pengurangan musim, kamu akan mengklaim efek dua kali lipat dari yang sebenarnya, persis dosa Kapal Rindu.",
        "Kepribadiannya: DiD seperti menimbang badan dengan timbangan yang bergeser tiap hari — kamu tidak percaya angka absolutnya, kamu percaya SELISIH dua penimbangan di hari yang sama. Asumsi kuncinya: tren paralel — tanpa perlakuan, kedua wilayah akan bergerak sejajar. Itulah kenapa matching (Langkah 3) bukan hiasan: ia yang membuat asumsi ini masuk akal. Kapan memakai: (1) ada periode pra dan pasca yang jelas; (2) satu waktu perlakuan yang sama untuk semua wilayah. Kapan tidak: bila perlakuan bergulir bertahap tanpa tanggal jelas — butuh metode yang lebih canggih.",
      ],
      formula: String.raw`\text{lift} = (\bar{y}_{T,\text{pasca}} - \bar{y}_{T,\text{pra}}) - (\bar{y}_{C,\text{pasca}} - \bar{y}_{C,\text{pra}})`,
      formulaNote: "lift = estimasi efek kausal; y-bar = rata-rata penjualan; T = wilayah perlakuan, C = kontrol pasangannya; pra/pasca = periode sebelum/sesudah perlakuan. Tanda kurung pertama = perubahan di wilayah perlakuan (efek + musim); kurung kedua = perubahan di kontrol (musim saja). Contoh lab: (458,6 − 426,9) − (439,6 − 424,1) = 31,7 − 15,5 = 16,2.",
      tasks: [],
      note: {
        title: "🚨 Mitos: lift positif = perlakuan berhasil",
        type: "pitfall",
        body: "Yang benar: lift positif bisa murni noise — terutama dengan wilayah sedikit. Enam belas koma dua terlihat meyakinkan sampai kamu tahu bahwa 'lift' kota kontrol yang pura-pura diperlakukan pun bisa 6,7 (lihat placebo test). Jangan pernah melaporkan lift tanpa pembanding noise-nya. Angka tanpa uji kejujuran adalah opini yang berdandan statistik.",
      },
      hints: [
        "💡 Intuisi: DiD adalah A/B test untuk dunia yang tidak bisa diacak. Harganya: asumsi tren paralel. Bayarannya: jawaban kausal atas pertanyaan yang tidak bisa dijawab cara lain.",
      ],
      reference: "Lift = selisih perubahan. Musim saling menghapus bila tren paralel.",
    },
    {
      id: "konsep-placebo",
      eyebrow: "Langkah 5 · Konsep",
      title: "Placebo Test & Spillover — Si Penguji Kejujuran dan Si Perusak Senyap",
      prose: [
        "Definisi placebo test: ulangi SELURUH prosedur (matching + DiD) dengan tiap wilayah KONTROL berpura-pura sebagai 'wilayah perlakuan'. Karena mereka tidak benar-benar diperlakukan, 'lift' mereka seharusnya kecil — itulah distribusi noise. Vonis: bila lift wilayah perlakuanmu (16,2 dan 11,6) melampaui SEMUA lift placebo (maks 6,7), efekmu nyata. Bila liftmu tenggelam di antara lift placebo, kamu sedang membaca noise.",
        "Definisi spillover: perlakuan di satu wilayah 'bocor' ke wilayah lain — pelanggan perbatasan pindah belanja, iklan regional terlihat tetangga, karyawan bercerita. Spillover melanggar asumsi SUTVA (satu unit tidak boleh memengaruhi unit lain) dan biasanya MENGECILKAN lift yang terukur (kontrol ikut 'ketularan' sehingga selisihnya menyusut).",
        "Kepribadiannya: placebo test seperti lie detector untuk analis — ia tidak membuktikan kamu jujur, tetapi ia menangkapmu bila berbohong pada diri sendiri. Spillover seperti tetangga yang mengintip jawaban ujian: nilaimu dan nilainya jadi tidak independen lagi. Kapan waspada spillover: (1) wilayah bertetangga langsung; (2) perlakuan terlihat/didengar lintas batas (iklan, harga di etalase online); (3) pelanggan mobile. Penawarnya: buffer zone — sisakan wilayah penyangga yang tidak dipakai sebagai kontrol.",
      ],
      formula: String.raw`\text{vonis NYATA} \iff \min(\text{lift}_T) > \max |\text{lift}_{\text{placebo}}|`,
      formulaNote: "Aturan vonis sederhana: NYATA bila lift TERKECIL di wilayah perlakuan masih lebih besar dari lift placebo TERBESAR (nilai absolut). Contoh lab: min(16,2; 11,6) = 11,6 > 6,7 = max|placebo| → NYATA. Ini versi sederhana dari permutation test — dengan wilayah sedikit, ambang 'melampaui semua placebo' sudah cukup jujur.",
      tasks: [],
      note: {
        title: "🚨 Mitos: makin banyak wilayah kontrol = makin akurat",
        type: "pitfall",
        body: "Yang benar: menambah kontrol yang TIDAK MIRIP (atau yang terkena spillover) justru merusak. Kontrol yang berbatasan langsung dengan wilayah perlakuan terlihat 'mirip' secara geografis tetapi terkontaminasi — ia bukan kontrol, ia korban. Kualitas mengalahkan kuantitas: 2 kontrol bersih dan mirip > 10 kontrol asal comot.",
      },
      hints: [
        "💡 Intuisi: placebo test gratis — tidak butuh data tambahan, hanya komputasi ulang. Tidak ada alasan melewatkannya; analis yang melaporkan lift tanpa placebo seperti dokter yang meresepkan tanpa cek alergi.",
        "💡 Intuisi: bila spillover dicurigai BESAR (mis. harga online terlihat semua orang), geo-experiment mungkin alat yang salah sejak awal — pertimbangkan staggered rollout (luncurkan bertahap, pakai yang belum diluncurkan sebagai kontrol).",
      ],
      reference: "Placebo = distribusi noise. Spillover = tetangga yang mengintip. Buffer zone = penawar.",
    },
    {
      id: "lab-geo",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Mesin geo-experiment mini",
      prose: [
        "Waktunya jadi eksperimentalis wilayah. Data di bawah: 6 wilayah × 20 minggu (12 pra + 8 pasca). T1 dan T2 mendapat 'perlakuan' (mis. kenaikan harga) mulai minggu ke-13; C1–C4 tidak. Tugasmu: (1) carikan tiap wilayah perlakuan pasangannya — kontrol dengan rata-rata pra paling dekat; (2) hitung lift DiD tiap pasangan; (3) jalankan placebo test atas keempat kontrol dan vonis: NYATA atau RAGU?",
        "Coba: setelah lolos, ubah efek perlakuan (cari baris SALES['T1'][12:] di data — tidak bisa, datanya terkunci!). Sebagai gantinya, ubah ambang vonis di kodemu: apa yang terjadi bila syaratnya 'rata-rata lift > placebo_max' bukan 'SEMUA lift > placebo_max'? Kapan aturan yang longgar itu berbahaya?",
      ],
      tasks: [
        { id: "t1", text: "Hitung rata-rata pra tiap wilayah, carikan T1 & T2 pasangannya (kontrol dengan rata-rata pra terdekat), lalu cetak" },
        { id: "t2", text: "Hitung `lift_T1` & `lift_T2` = (pasca−pra) perlakuan − (pasca−pra) pasangan, lalu cetak" },
        { id: "t3", text: "Placebo test: untuk tiap kontrol, anggap ia 'diperlakukan' (pasangan dari kontrol lain), hitung lift placebo, ambil `batas` = max|placebo|, vonis NYATA bila kedua lift > batas, lalu cetak" },
      ],
      requires: ["numpy"],
      expected: "match T1=C1 T2=C2\nlift T1=16.2 T2=11.6\nplacebo_max=6.7\nvonis=NYATA",
      code: {
        starter: `import numpy as np
# Penjualan mingguan 20 minggu (12 pra + 8 pasca), 6 wilayah. JANGAN UBAH.
SALES = {
    "T1": [426.9, 435.8, 420.2, 425.5, 409.6, 407.5, 401.2, 436.5, 425.0, 439.3, 438.7, 449.3, 442.8, 441.3, 469.2, 449.8, 436.5, 465.7, 476.7, 463.4],
    "T2": [389.7, 392.6, 387.6, 383.1, 384.9, 381.2, 403.4, 382.7, 388.2, 395.1, 396.9, 398.9, 421.5, 432.1, 409.9, 420.9, 391.3, 426.8, 403.7, 407.3],
    "C1": [418.3, 427.4, 422.5, 427.0, 409.4, 399.8, 419.6, 419.4, 434.3, 432.9, 432.2, 436.1, 451.9, 425.9, 439.9, 422.7, 430.2, 436.2, 438.5, 446.0],
    "C2": [356.2, 378.2, 383.9, 357.7, 368.7, 380.5, 375.5, 396.5, 380.7, 381.1, 402.1, 370.5, 377.4, 367.3, 381.4, 413.2, 393.6, 397.2, 378.6, 410.3],
    "C3": [249.5, 279.8, 239.3, 270.7, 274.8, 255.7, 266.2, 259.1, 247.9, 274.2, 260.9, 241.4, 254.0, 274.7, 304.7, 314.4, 281.5, 271.0, 271.5, 259.6],
    "C4": [498.5, 506.6, 497.3, 512.0, 515.7, 495.4, 506.8, 516.0, 518.4, 500.5, 507.3, 536.7, 511.6, 514.2, 512.3, 510.6, 523.0, 527.3, 532.2, 540.8],
}
PRA = 12

# TULIS KODEMU di bawah ini
`,
        lockLines: 11,
        solution: `import numpy as np
# Penjualan mingguan 20 minggu (12 pra + 8 pasca), 6 wilayah. JANGAN UBAH.
SALES = {
    "T1": [426.9, 435.8, 420.2, 425.5, 409.6, 407.5, 401.2, 436.5, 425.0, 439.3, 438.7, 449.3, 442.8, 441.3, 469.2, 449.8, 436.5, 465.7, 476.7, 463.4],
    "T2": [389.7, 392.6, 387.6, 383.1, 384.9, 381.2, 403.4, 382.7, 388.2, 395.1, 396.9, 398.9, 421.5, 432.1, 409.9, 420.9, 391.3, 426.8, 403.7, 407.3],
    "C1": [418.3, 427.4, 422.5, 427.0, 409.4, 399.8, 419.6, 419.4, 434.3, 432.9, 432.2, 436.1, 451.9, 425.9, 439.9, 422.7, 430.2, 436.2, 438.5, 446.0],
    "C2": [356.2, 378.2, 383.9, 357.7, 368.7, 380.5, 375.5, 396.5, 380.7, 381.1, 402.1, 370.5, 377.4, 367.3, 381.4, 413.2, 393.6, 397.2, 378.6, 410.3],
    "C3": [249.5, 279.8, 239.3, 270.7, 274.8, 255.7, 266.2, 259.1, 247.9, 274.2, 260.9, 241.4, 254.0, 274.7, 304.7, 314.4, 281.5, 271.0, 271.5, 259.6],
    "C4": [498.5, 506.6, 497.3, 512.0, 515.7, 495.4, 506.8, 516.0, 518.4, 500.5, 507.3, 536.7, 511.6, 514.2, 512.3, 510.6, 523.0, 527.3, 532.2, 540.8],
}
PRA = 12

# TULIS KODEMU di bawah ini
def rata2(s):
    return sum(s) / len(s)

wilayah = list(SALES.keys())
pra = {w: rata2(SALES[w][:PRA]) for w in wilayah}
pasca = {w: rata2(SALES[w][PRA:]) for w in wilayah}
kontrol = ["C1", "C2", "C3", "C4"]
cocok = {}
for t in ["T1", "T2"]:
    cocok[t] = min(kontrol, key=lambda c: abs(pra[t] - pra[c]))
lift_T1 = (pasca["T1"] - pra["T1"]) - (pasca[cocok["T1"]] - pra[cocok["T1"]])
lift_T2 = (pasca["T2"] - pra["T2"]) - (pasca[cocok["T2"]] - pra[cocok["T2"]])
placebo = {}
for c in kontrol:
    sisanya = [k for k in kontrol if k != c]
    m = min(sisanya, key=lambda x: abs(pra[c] - pra[x]))
    placebo[c] = (pasca[c] - pra[c]) - (pasca[m] - pra[m])
batas = max(abs(v) for v in placebo.values())
vonis = "NYATA" if lift_T1 > batas and lift_T2 > batas else "RAGU"
print(f"match T1={cocok['T1']} T2={cocok['T2']}")
print(f"lift T1={lift_T1:.1f} T2={lift_T2:.1f}")
print(f"placebo_max={batas:.1f}")
print(f"vonis={vonis}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "match T1=C1 T2=C2", label: "Pasangan matched market benar", msg: "T1→C1 dan T2→C2: rata-rata pra terdekat. Cek: hitung rata-rata 12 minggu pertama tiap wilayah." },
          { kind: "equal", task: "t2", name: "lift_T1", value: 16.2, tol: 0.05, label: "Lift T1 = 16,2", msg: "DiD: (pasca−pra)_T1 − (pasca−pra)_C1. Musim saling menghapus." },
          { kind: "equal", task: "t2", name: "lift_T2", value: 11.6, tol: 0.05, label: "Lift T2 = 11,6", msg: "Pasangan T2 adalah C2 — jangan tertukar." },
          { kind: "stdout_matches", task: "t3", pattern: "placebo_max=6\\.7", label: "Batas placebo = 6,7", msg: "Lift placebo terbesar (nilai absolut) dari keempat kontrol." },
          { kind: "stdout_matches", task: "t3", pattern: "vonis=NYATA", label: "Vonis NYATA", msg: "Kedua lift (16,2 dan 11,6) melampaui batas placebo 6,7 — efeknya nyata, bukan noise." },
          { kind: "uses", task: "t1", token: "min", label: "Memakai min() untuk matching", msg: "Pasangan = kontrol dengan selisih rata-rata pra terkecil: min(..., key=...)." },
        ],
      },
      reference: "Match dari pra → DiD untuk lift → placebo untuk vonis. Urutan ini tidak boleh dibalik.",
    },
    {
      id: "chart-lift",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca lift seperti juri eksperimen",
      prose: [
        "Chart di bawah: dua batang kiri = lift wilayah perlakuan (T1: 16,2; T2: 11,6); empat batang kanan = lift placebo wilayah kontrol (terbesar 6,7).",
        "Cara membaca: sumbu Y = lift dalam unit penjualan; garis nol = 'tidak ada efek'. Batang perlakuan berwarna tegas, batang placebo pudar — karena placebo BUKAN efek, melainkan noise.",
        "Interpretasi: kedua batang perlakuan menjulang JAUH di atas semua batang placebo. Inilah vonis visual 'NYATA': bila perlakuanmu tidak bisa dibedakan dari placebo, kamu tidak punya temuan — kamu punya kebetulan. Keputusan: eksperimen seperti ini layak dilanjutkan ke rollout; eksperimen yang batangnya tenggelam di antara placebo harus dihentikan atau didesain ulang (lebih banyak wilayah, periode lebih panjang).",
      ],
      figure: {
        svg: LIFT_SVG,
        alt: "Diagram batang: lift T1 16,2 dan T2 11,6 jauh di atas lift placebo kontrol (maks 6,7).",
        caption: "Lift perlakuan vs lift placebo — efek nyata menjulang di atas noise.",
      },
      tasks: [],
      note: {
        title: "Intuisi: chart ini adalah placebo test yang bisa dilihat",
        body: "Banyak analis melaporkan lift sebagai satu angka ('+14%!') tanpa pembanding. Chart ini memaksa kejujuran: tempelkan liftmu di samping lift placebo. Bila audiens tidak bisa membedakan mana yang perlakuan dan mana yang placebo tanpa label warna, temuanmu belum layak dipresentasikan ke direksi.",
      },
      reference: "Lift tanpa placebo = opini berdandan statistik.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Eksperimen wilayah, A/B individu, atau jangan ukur?",
      prose: [
        "Lima skenario pemilihan desain eksperimen:",
        "Skenario 1 — Perlakuan mustahil diacak per individu (harga regional, iklan TV, format toko). → Geo-experiment dengan matched market. Alasan: satu-satunya desain kausal yang tersedia; individu bukan unit yang valid.",
        "Skenario 2 — Perlakuan bisa diacak per pengguna (tombol checkout, teks email). → A/B test individu biasa. Alasan: lebih murah, lebih cepat, power lebih besar — jangan pakai meriam geo-experiment untuk nyamuk.",
        "Skenario 3 — Hanya 2–3 wilayah tersedia (mis. 3 negara). → Jangan geo-experiment klasik; pakai synthetic control atau interrupted time series. Alasan: dengan 3 unit, placebo test tidak punya distribusi — vonisnya fiksi.",
        "Skenario 4 — Diduga spillover kuat (harga online terlihat semua orang, pelanggan mobile). → Staggered rollout: luncurkan bertahap, wilayah yang belum diluncurkan = kontrol. Alasan: geo-experiment serentak akan terkontaminasi; rollout bertahap mengubah waktu menjadi dimensi kontrol.",
        "Skenario 5 — Butuh jawaban strategis tahunan (alokasi budget antar-kanal). → Bukan eksperimen — pakai MMM (lihat A321). Alasan: eksperimen menjawab 'apakah X bekerja', MMM menjawab 'ke mana uangnya'.",
        "Aturan praktis 10 detik: bisa acak individu → A/B. Tidak bisa → geo-experiment (≥4 wilayah, ada pra-data). Spillover kuat → staggered. Butuh alokasi budget → MMM.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: geo-experiment untuk pertanyaan taktis mingguan",
        type: "pitfall",
        body: "Geo-experiment itu mahal dan lambat (butuh minggu pra + pasca). Memakainya untuk menguji warna tombol adalah pemborosan — dan hasilnya tiba setelah keputusan kadaluarsa. Aturan kasar: bila pertanyaanmu bisa dijawab A/B test 2 minggu, jangan sentuh geo-experiment.",
      },
      reference: "Individu bisa diacak → A/B. Tidak bisa → geo. Spillover → staggered. Strategis → MMM.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Ambang gratis ongkir: Rp150 ribu atau Rp200 ribu?",
      prose: [
        "Skenario (sintetis, untuk latihan): marketplace 'BelanjaYuk' ingin menaikkan ambang gratis ongkir dari Rp150 ribu menjadi Rp200 ribu untuk menaikkan AOV (average order value). Tidak bisa diacak per pengguna — pengguna akan protes melihat ambang berbeda. Desain: 3 provinsi perlakuan (ambang Rp200 ribu), 5 provinsi kontrol (tetap Rp150 ribu), 8 minggu pra + 8 minggu pasca. Matched market dari AOV pra: pasangan mirip (selisih < 3%).",
        "Hasil: lift DiD AOV = +Rp18.500 per transaksi di provinsi perlakuan. Placebo test atas 5 kontrol: lift placebo terbesar = Rp21.000. Pertanyaan analisis: (1) Apa vonismu — NYATA atau RAGU? (2) Apa masalah desain yang terlihat dari komposisi provinsi? (3) Keputusan yang benar?",
        "Pembahasan: (1) RAGU — lift 18.500 tenggelam di bawah placebo max 21.000; 'efek' ini tidak bisa dibedakan dari noise antar-provinsi. (2) Masalah: 3 provinsi perlakuan vs 5 kontrol terlalu sedikit untuk placebo yang stabil; dan ambang ongkir memengaruhi perilaku lintas provinsi? Tidak — tetapi iklan nasional 'gratis ongkir' yang menyebut angka lama adalah spillover informasi: pelanggan provinsi perlakuan melihat iklan Rp150 ribu. (3) Jangan rollout nasional. Perpanjang periode atau tambah provinsi; perbaiki komunikasi agar tidak ada informasi ambang lama yang beredar di wilayah perlakuan. Keputusan Rp-miliaran tidak boleh bertumpu pada lift yang kalah dari placebo.",
        "Catatan desain: inilah gunanya aturan vonis yang ketat (SEMUA lift > placebo max). Aturan longgar ('rata-rata lift > placebo') akan meloloskan temuan ini — dan BelanjaYuk akan menaikkan ambang berdasarkan noise.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rollout kebijakan berdasarkan lift yang tidak lolos placebo = mengambil risiko tanpa premi: bila efeknya noise, kamu membayar biaya implementasi + kebingungan pelanggan untuk hasil nol. Placebo test adalah 'premi asuransi' termurah dalam eksperimen — ia gratis, hanya butuh disiplin menjalankannya.",
      },
      reference: "Lift 18.500 < placebo 21.000 → RAGU. Jangan rollout dari noise.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Geo-experiment = randomisasi wilayah untuk perlakuan yang tak bisa diacak per individu (harga, iklan regional).",
        "Matched market: pasangkan tiap wilayah perlakuan dengan kontrol ber-rata-rata pra terdekat; cek garis pra berjalan beriringan.",
        "Lift DiD = (pasca−pra)_perlakuan − (pasca−pra)_kontrol — musim saling menghapus bila tren paralel.",
        "Placebo test: lift kontrol yang pura-pura diperlakukan = distribusi noise; vonis NYATA bila semua lift > placebo max.",
        "Spillover melanggar SUTVA dan mengecilkan lift terukur — pakai buffer zone atau staggered rollout.",
      ],
      quiz: [
        {
          q: "Kapan geo-experiment adalah desain yang TEPAT?",
          options: [
            { text: "Menguji kenaikan harga regional — pelanggan tak bisa diacak per individu tanpa protes", why: "Benar: harga adalah perlakuan tingkat wilayah; randomisasi individu tidak valid (spillover + fairness). Inilah kasus klasik geo-experiment.", correct: true },
            { text: "Menguji warna tombol checkout di aplikasi", why: "Salah: tombol bisa diacak per pengguna — A/B test individu lebih murah, cepat, dan powerful.", correct: false },
            { text: "Mengalokasikan budget tahunan antar kanal iklan", why: "Salah: itu pertanyaan strategis alokasi — pakai MMM (A321), bukan eksperimen.", correct: false },
            { text: "Menguji teks email promosi", why: "Salah: email diacak per penerima dengan mudah — tidak perlu merandomisasi kota.", correct: false },
          ],
        },
        {
          q: "T1 rata-rata pra 426,9. Kontrol: C1 424,1; C3 261,4. Pasangan T1 yang benar?",
          options: [
            { text: "C1 — selisih rata-rata pra terkecil (2,8)", why: "Benar: matching = selisih |pra_T − pra_C| terkecil. C1 kembarannya, C3 beda dunia.", correct: true },
            { text: "C3 — kota kecil lebih sensitif terhadap perlakuan", why: "Salah: 'sensitif' bukan kriteria matching; kota kecil punya dinamika berbeda — justru itulah yang harus dihindari.", correct: false },
            { text: "Rata-rata C1 dan C3", why: "Salah: rata-rata keduanya = 'kota Frankenstein' 342,8 yang tidak mirip siapa pun.", correct: false },
            { text: "Acak saja salah satu", why: "Salah: dengan 6 wilayah, acak = berjudi. Matching adalah pengganti randomisasi yang disengaja.", correct: false },
          ],
        },
        {
          q: "T naik +31,7; pasangannya C naik +15,5. Lift DiD dan interpretasinya?",
          options: [
            { text: "16,2 — efek perlakuan setelah musim dihapus", why: "Benar: 31,7 − 15,5 = 16,2. Selisih kedua (kontrol) adalah 'musim' yang harus dikurangkan.", correct: true },
            { text: "31,7 — kenaikan penuh adalah efeknya", why: "Salah: itu dosa Kapal Rindu — menuduh kebijakan atas jasa musim.", correct: false },
            { text: "15,5 — pakai angka kontrol saja", why: "Salah: angka kontrol BUKAN efek; ia pembanding yang harus dikurangkan.", correct: false },
            { text: "47,2 — jumlahkan keduanya agar konservatif", why: "Salah: menjumlahkan menggandakan musim, bukan menghilangkannya.", correct: false },
          ],
        },
        {
          q: "Lift perlakuan 11,6 dan 16,2; lift placebo terbesar 6,7. Vonis?",
          options: [
            { text: "NYATA — lift terkecil (11,6) masih melampaui placebo terbesar (6,7)", why: "Benar: aturan ketat — semua lift harus mengalahkan semua placebo. Efeknya berdiri di atas noise.", correct: true },
            { text: "RAGU — placebo 6,7 cukup besar sehingga semua lift mencurigakan", why: "Salah: 6,7 adalah BATAS noise; lift 11,6/16,2 berada JAUH di atasnya — itulah gunanya batas.", correct: false },
            { text: "NYATA — karena liftnya positif", why: "Salah: positif saja tidak cukup — placebo pun bisa positif (6,7). Tanpa pembanding, 'positif' = opini.", correct: false },
            { text: "RAGU — perlu uji-t formal dulu", why: "Salah: dengan 6 wilayah, uji-t formal bertumpu pada asumsi yang tidak terpenuhi; aturan 'melampaui semua placebo' adalah permutation test yang jujur untuk n kecil.", correct: false },
          ],
        },
        {
          q: "Spillover dalam geo-experiment harga: pelanggan perbatasan pindah belanja ke kota kontrol. Dampaknya?",
          options: [
            { text: "Lift terukur MENYUSUT — kontrol ikut 'ketularan' sehingga selisih mengecil; solusinya buffer zone", why: "Benar: kontrol yang terkontaminasi bukan kontrol. Spillover biasanya bias ke nol (mengecilkan efek), membuat eksperimen gagal mendeteksi efek yang sebenarnya ada.", correct: true },
            { text: "Lift terukur MEMBESAR — kabar baik untuk analis", why: "Salah: kebalikannya — kontrol yang naik membuat selisih (T−C) menyusut.", correct: false },
            { text: "Tidak ada dampak selama matching-nya bagus", why: "Salah: matching yang bagus pun tidak melindungi dari kontaminasi pasca-perlakuan.", correct: false },
            { text: "Solusinya menambah jumlah wilayah kontrol", why: "Salah: menambah kontrol yang juga terkena spillover hanya menambah korban, bukan solusi.", correct: false },
          ],
        },
        {
          q: "Manakah pernyataan yang BENAR tentang placebo test?",
          options: [
            { text: "Ia gratis (tanpa data tambahan) dan wajib — lift tanpa placebo adalah opini berdandan statistik", why: "Benar: placebo = komputasi ulang atas kontrol yang ada. Melewatkannya tidak menghemat apa pun kecuali kejujuran.", correct: true },
            { text: "Ia membutuhkan kelompok kontrol tambahan yang mahal", why: "Salah: tidak butuh data baru — hanya memakai ulang wilayah kontrol yang sudah ada.", correct: false },
            { text: "Ia hanya berguna bila lift-nya negatif", why: "Salah: ia menilai SEMUA lift — positif besar pun harus diuji terhadap noise.", correct: false },
            { text: "Ia menggantikan kebutuhan matching yang baik", why: "Salah: placebo menguji noise, bukan memperbaiki pasangan yang buruk. Keduanya wajib.", correct: false },
          ],
        },
      ],
      next: { label: "A323 — Statistical Process Control: Control Chart", href: "/v2/learn/a323-spc-control-chart" },
    },
  ],
};
