import type { V2Lesson } from "../lib/types";

export const mlfM25: V2Lesson = {
  slug: "mlf-m25-reject-inference",
  track: "Machine Learning Finance",
  module: "Supervised — credit scoring",
  title: "MLF-M2.5 — Reject Inference: Model yang Tidak Pernah Melihat Penolakan",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Lesson ini adalah USP modul M2 — topik yang membedakan credit scoring yang jujur dari yang menipu diri sendiri. Semua model di M2.1–M2.4 dilatih pada pinjaman yang disetujui. Tapi bank juga menolak pelamar — dan model tidak pernah melihat outcome mereka. Apa yang terjadi bila model itu dipakai menilai pelamar yang ditolak?",
        "Tujuan lesson ini:",
        "• Menjelaskan selection bias: kenapa model yang dilatih pada yang disetujui meremehkan risiko yang ditolak.",
        "• Mengukur biasnya dengan angka simulasi UCI: gap 0,2422 pada yang ditolak.",
        "• Membandingkan tiga obat — extrapolation, reweighting, fuzzy augmentation — dengan hasil hitung yang jujur.",
        "• Menyatakan kesimpulan yang tidak nyaman: tidak satu pun obat yang memperbaiki bias sepenuhnya.",
        "• Menjalankan dua lab: mengukur bias, dan reweighting Horvitz–Thompson.",
        "Isi lesson: cerita 6.588 penolakan → selection bias → extrapolation → reweighting → fuzzy augmentation → 2 lab → peta keputusan → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari simulasi approval di atas dataset UCI 30.000 nasabah [notebook]: approval rate 0,7804; default yang disetujui 0,1495 vs yang ditolak 0,4759; model-A meremehkan yang ditolak sebesar 0,2422. Aturan approval-nya sintetis [ilustrasi]: PAY_0 ≤ 1 DAN LIMIT_BAL ≥ 50.000.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "6.588 pelamar ditolak — dan model tidak tahu apa-apa tentang mereka",
      prose: [
        "Bank menerima 30.000 pengajuan. Ia menyetujui 23.412 dan menolak 6.588. Dari yang disetujui, 14,95 persen default. Dari yang ditolak — bank tidak tahu. Mereka tidak pernah diberi pinjaman, jadi tidak ada outcome yang bisa dipelajari. Model credit scoring dilatih pada 23.412 yang disetujui — dan hanya pada mereka.",
        "Suatu hari bank bertanya: «Bagaimana bila kita longgarkan kebijakan dan menyetujui sebagian yang dulu kita tolak? Berapa risiko mereka?» Model menjawab dengan percaya diri — dan jawabannya salah. Itulah reject inference: seni menginferensi outcome orang yang tidak pernah kamu amati.",
        "Nilai: dalam simulasi di atas data UCI [notebook], aturan approval sintetis [ilustrasi] — PAY_0 ≤ 1 DAN LIMIT_BAL ≥ 50.000 — menghasilkan approval rate 0,7804 (23.412 disetujui, 6.588 ditolak). Default aktual yang disetujui 0,1495; yang ditolak 0,4759; semua pelamar 0,2212. Yang ditolak tiga kali lebih berisiko dari yang disetujui — dan model tidak pernah melihat satu pun dari mereka.",
        "Baik atau buruk: menolak pelamar berisiko adalah keputusan yang benar — bank memang seharusnya menolak mereka. Yang buruk adalah memakai model yang dilatih pada yang disetujui untuk menilai yang ditolak, seolah-olah keduanya populasi yang sama. Mereka bukan populasi yang sama — penolakan itu sendiri adalah seleksi.",
        "Mitigasi: sebelum memakai model di luar populasi latihnya, ukur dulu seberapa jauh populasi baru itu dari populasi latih — bandingkan distribusi fitur, approval rate, dan default rate. Bila jauh, jangan percaya prediksi mentahnya — terapkan salah satu dari tiga obat di lesson ini, dan laporkan ketidakpastiannya.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: model yang bagus di test set pasti bagus di pelamar baru",
        type: "pitfall",
        body: "Yang benar: test set notebook adalah sampel dari populasi yang disetujui — sama seperti data latih. Skor test 0,7823 tidak berkata apa-apa tentang performa pada pelamar yang ditolak, karena mereka tidak ada di test set. Test set yang baik mengukur generalisasi ke data baru dari populasi yang sama — bukan ke populasi yang berbeda.",
      },
    },
    {
      id: "selection-bias",
      eyebrow: "Langkah 3 · Selection bias",
      title: "Selection bias: model meremehkan yang tidak pernah ia lihat",
      prose: [
        "Selection bias terjadi ketika data latih bukan sampel acak dari populasi yang akan diprediksi — melainkan sampel yang sudah diseleksi. Di kredit, seleksinya adalah keputusan approval itu sendiri: hanya pelamar yang lolos seleksi yang punya outcome. Model belajar «nasabah seperti apa yang default» dari nasabah yang sudah disaring menjadi relatif aman.",
        "Nilai: model-A — logistic regression yang dilatih hanya pada yang disetujui [notebook] — memprediksi mean PD 0,1495 pada yang disetujui (aktual 0,1495 — tepat) dan 0,2337 pada yang ditolak (aktual 0,4759 — meleset 0,2422). Pada semua pelamar, mean PD model-A 0,1680 vs aktual 0,2212 — meremehkan 0,0532. Dalam hitungan nasabah: 0,0532 × 30.000 = 1.596 default yang «hilang» dari perhitungan bank bila ia percaya model-A mentah-mentah.",
        "Gambar di bawah membandingkan aktual vs prediksi model-A pada dua kelompok: pada yang disetujui, dua batang sama tinggi (0,1495 vs 0,1495); pada yang ditolak, batang aktual (0,4759) dua kali batang prediksi (0,2337). Gap 0,2422 itu adalah harga selection bias — dalam satuan peluang default.",
        "Yang menarik: ranking model-A nyaris tidak rusak. ROC-AUC model-A pada semua pelamar 0,7124 vs oracle (model yang dilatih pada semua data, termasuk yang ditolak) 0,7139 [notebook] — selisih 0,0015. Model-A masih bisa mengurutkan nasabah berisiko di atas yang aman — yang rusak adalah KALIBRASI-nya: angka probabilitasnya terlalu rendah pada yang ditolak. Selection bias menghantam kalibrasi, bukan ranking — dan kalibrasi-lah yang dipakai menghitung EL dan ECL.",
        "Baik atau buruk: model-A bagus bila dipakai pada populasi yang sama dengan latihnya — pelamar yang memenuhi kriteria approval yang sama. Buruk bila dipakai menilai pelamar di luar kriteria itu — misal saat bank melonggarkan kebijakan dan mulai menyetujui profil yang dulu ditolak.",
        "Mitigasi: jangan pernah memakai model di luar populasi latih tanpa diagnosis. Diagnosis termurah: bandingkan distribusi fitur pelamar baru dengan distribusi latih — bila skor, limit, atau riwayat telatnya bergeser jauh, model sedang diekstrapolasi, dan ekstrapolasi butuh obat — itu langkah berikut.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar berkelompok: pada yang disetujui aktual dan prediksi sama 0,1495; pada yang ditolak aktual 0,4759 tapi prediksi hanya 0,2337">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Bias kalibrasi: model-A pas di yang disetujui, meleset di yang ditolak</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,125</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,375</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<rect x="99.5" y="153.4" width="52.0" height="52.6" fill="var(--c4)"/>
<text x="125.5" y="147.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,1495</text>
<rect x="159.5" y="153.4" width="52.0" height="52.6" fill="var(--c1)"/>
<text x="185.5" y="147.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,1495</text>
<line x1="155.5" y1="206" x2="155.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="155.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Disetujui</text>
<rect x="306.5" y="38.5" width="52.0" height="167.5" fill="var(--c4)"/>
<text x="332.5" y="32.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,4759</text>
<rect x="366.5" y="123.7" width="52.0" height="82.3" fill="var(--c1)"/>
<text x="392.5" y="117.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,2337</text>
<line x1="362.5" y1="206" x2="362.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="362.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Ditolak</text>
<line x1="362" y1="46" x2="362" y2="117" stroke="var(--c4)" stroke-width="1.5"/>
<polygon points="362,42 358,50 366,50" fill="var(--c4)"/>
<polygon points="362,121 358,113 366,113" fill="var(--c4)"/>
<text x="372" y="84" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">gap 0,2422</text>
<rect x="52" y="228" width="12" height="12" fill="var(--c4)"/><text x="70" y="238" font-size="10" fill="var(--text)" font-family="var(--font-ui)">default aktual</text>
<rect x="170" y="228" width="12" height="12" fill="var(--c1)"/><text x="188" y="238" font-size="10" fill="var(--text)" font-family="var(--font-ui)">mean PD model-A</text>
</svg>`,
        alt: "Bar berkelompok: pada yang disetujui aktual dan prediksi sama 0,1495; pada yang ditolak aktual 0,4759 tapi prediksi hanya 0,2337.",
        caption: "Cara membaca: merah = default aktual, biru = mean PD model-A. Interpretasi: pada yang disetujui keduanya sama (0,1495); pada yang ditolak model meremehkan sebesar 0,2422.",
      },
      tasks: [],
    },
    {
      id: "extrapolation",
      eyebrow: "Langkah 4 · Obat 1: extrapolation",
      title: "Extrapolation: terapkan model ke yang ditolak — dan sadari batasnya",
      prose: [
        "Obat pertama adalah yang paling sederhana: terapkan saja model-A ke pelamar yang ditolak, dan baca prediksinya. Inilah yang dilakukan simulasi di atas — mean PD 0,2337 pada yang ditolak. Extrapolation tidak mengubah model; ia hanya memperluas wilayah pakainya.",
        "Nilai: extrapolation mendiagnosis dengan baik — ia menunjukkan gap 0,2422 dengan jelas — tapi tidak memperbaikinya. Mean PD pada yang ditolak tetap 0,2337, jauh dari aktual 0,4759 [notebook]. ROC-AUC-nya 0,7124, nyaris sama dengan oracle 0,7139 — ranking aman, kalibrasi rusak. Extrapolation adalah alat diagnosis, bukan alat perbaikan.",
        "Kenapa extrapolation gagal memperbaiki? Karena model-A belajar hubungan «fitur → default» dari populasi yang disetujui — dan hubungan itu sendiri bisa berbeda pada yang ditolak. Contoh: di populasi disetujui, LIMIT_BAL tinggi berarti nasabah mapan (OR 0,79). Di populasi ditolak, LIMIT_BAL tinggi bisa berarti nasabah yang sudah kehabisan limit di bank lain — artinya sebaliknya. Model tidak bisa tahu itu, karena ia tidak pernah melihat yang ditolak.",
        "Baik atau buruk: extrapolation bagus sebagai langkah pertama — murah, cepat, dan menunjukkan besar biasnya. Buruk bila hasilnya dipakai sebagai estimasi risiko yang ditolak tanpa koreksi: 0,2337 akan dipakai menghitung EL, dan EL-nya akan meremehkan separuh risiko.",
        "Mitigasi: pakai extrapolation untuk mendiagnosis dan membandingkan skenario — «bila kita menyetujui 10 persen yang ditolak dengan skor tertinggi, berapa PD mereka menurut model-A?» — tapi laporkan selalu bahwa angka itu adalah batas bawah, bukan estimasi. Untuk perbaikan, lanjut ke reweighting.",
      ],
      tasks: [],
    },
    {
      id: "reweighting",
      eyebrow: "Langkah 5 · Obat 2: reweighting",
      title: "Reweighting: beri bobot lebih pada yang mirip dengan yang ditolak",
      prose: [
        "Obat kedua: latih ulang model dengan bobot — tiap nasabah latih diberi bobot 1 / P(approve), peluang ia disetujui. Nasabah yang «hampir ditolak» (P(approve) kecil) diberi bobot besar, karena merekalah yang paling mirip dengan populasi yang ditolak. Nasabah yang «pasti disetujui» diberi bobot mendekati 1.",
        "Nilai: reweighting dengan bobot 1/P(approve), clip 0,05 [notebook] — mean PD pada yang ditolak naik dari 0,2337 (model-A) menjadi 0,2804. Perbaikan nyata — tapi masih jauh dari aktual 0,4759. Gap menyusut dari 0,2422 menjadi 0,1955 — terpotong seperlima, bukan hilang. ROC-AUC-nya 0,7154 — sedikit di atas model-A dan oracle.",
        "Kenapa hanya sebagian? Karena reweighting hanya mengoreksi seleksi yang TERAMATI — seleksi berdasarkan fitur yang ada di data (PAY_0, LIMIT_BAL, dan seterusnya). Bila approval juga bergantung pada hal yang tidak ada di data — wawancara, catatan internal, insting analis — maka tidak ada bobot yang bisa mengoreksinya. Bobot hanya bisa menyeimbangkan apa yang terlihat.",
        "Satu bahaya teknis: bobot ekstrem — bila ada nasabah dengan P(approve) sangat kecil, bobotnya membesar dan satu orang bisa mewakili puluhan orang; bila orang itu kebetulan outlier, model ikut terseret. Di simulasi ini bobotnya jinak — min 1,00 / median 1,02 / maks 4,27 [notebook] — jadi clip 0,05 tidak pernah aktif: tidak ada nasabah dengan P(approve) di bawah 0,234. Clip tetap relevan sebagai pengaman bila P(approve) sangat kecil.",
        "Baik atau buruk: reweighting bagus bila seleksi terutama didorong fitur teramati dan P(approve) bisa diestimasi dengan baik — dan ia adalah obat yang paling membantu di simulasi ini. Buruk bila P(approve)-nya sendiri dimodelkan dengan buruk: bobot yang salah lebih berbahaya daripada tanpa bobot.",
        "Mitigasi: estimasi P(approve) dengan model terpisah (approval model), validasi model itu, clip bobotnya, dan selalu laporkan distribusi bobot — berapa persen nasabah yang bobotnya di atas 5, di atas 10. Bobot yang tidak dilaporkan adalah asumsi yang disembunyikan.",
      ],
      tasks: [],
    },
    {
      id: "fuzzy",
      eyebrow: "Langkah 6 · Obat 3: fuzzy augmentation",
      title: "Fuzzy augmentation: beri label lunak pada yang ditolak — dan mengapa ia menggemakan bias",
      prose: [
        "Obat ketiga: buat «data» untuk yang ditolak dengan label lunak. Tiap pelamar yang ditolak diduplikasi dua kali — sekali dengan label default (bobot 0,5 × p) dan sekali dengan label lancar (bobot 0,5 × (1 − p)), dengan p adalah PD prediksi model-A untuknya. Lalu latih ulang model pada data gabungan: yang disetujui (label keras) + yang ditolak (label lunak). Idenya: model belajar dari yang ditolak tanpa harus tahu outcome mereka yang sesungguhnya.",
        "Nilai: hasilnya SAMA PERSIS dengan model-A [notebook] — mean PD pada yang ditolak 0,2337, ROC-AUC 0,7124. Koefisien model fuzzy vs model-A berbeda maksimal 0,000875 — nyaris identik. Fuzzy augmentation tidak menambah informasi baru: label lunaknya berasal dari model-A itu sendiri, jadi model baru hanya menggemakan model lama. Mengajari model dengan jawabannya sendiri tidak membuatnya lebih pintar.",
        "Gambar di bawah membandingkan keempat metode pada yang ditolak: aktual 0,4759 (target), model-A 0,2337, reweighting 0,2804, fuzzy 0,2337, oracle 0,3938. Oracle — model yang dilatih pada SEMUA data termasuk outcome yang ditolak — pun hanya mencapai 0,3938, masih di bawah aktual 0,4759: bahkan dengan data lengkap, model linear ini meremehkan kelompok yang ditolak. Batas atas dari ketiga obat adalah oracle — dan oracle pun tidak sempurna.",
        "Baik atau buruk: fuzzy augmentation bagus sebagai pengingat — ia menunjukkan bahwa «data tambahan» yang dibuat dari model sendiri bukanlah data. Buruk bila dipakai sebagai solusi: ia memberi rasa aman palsu («kami sudah memakai data yang ditolak») padahal tidak ada informasi baru yang masuk.",
        "Mitigasi: bila benar-benar butuh informasi tentang yang ditolak, satu-satunya jalan adalah data baru — bukan label buatan. Dua sumbernya: (1) approve sebagian kecil yang ditolak secara acak dan amati outcome-nya (reject sampling / champion-challenger); (2) beli data biro kredit tentang perilaku mereka di tempat lain. Keduanya mahal — dan justru itulah harganya: informasi tentang yang tidak teramati tidak bisa didapat gratis.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar mean PD pada yang ditolak: aktual 0,4759; model-A 0,2337; reweighting 0,2804; fuzzy 0,2337; oracle 0,3938">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Mean PD pada yang ditolak — siapa paling dekat ke 0,4759?</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,125</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,375</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<rect x="70.6" y="38.5" width="45.5" height="167.5" fill="var(--c4)"/>
<text x="93.4" y="32.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,4759</text>
<line x1="93.4" y1="206" x2="93.4" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="93.4" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Aktual (target)</text>
<rect x="153.4" y="123.7" width="45.5" height="82.3" fill="var(--c1)"/>
<text x="176.2" y="117.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,2337</text>
<line x1="176.2" y1="206" x2="176.2" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="176.2" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Model-A (bias)</text>
<rect x="236.2" y="107.3" width="45.5" height="98.7" fill="var(--c2)"/>
<text x="259.0" y="101.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,2804</text>
<line x1="259.0" y1="206" x2="259.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Reweight (parsial)</text>
<rect x="319.0" y="123.7" width="45.5" height="82.3" fill="var(--c1)"/>
<text x="341.8" y="117.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,2337</text>
<line x1="341.8" y1="206" x2="341.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="341.8" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Fuzzy (gema)</text>
<rect x="401.8" y="67.4" width="45.5" height="138.6" fill="var(--c3)"/>
<text x="424.6" y="61.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3938</text>
<line x1="424.6" y1="206" x2="424.6" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="424.6" y="222" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">Oracle (batas atas)</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">metode (aturan approval sintetis [ilustrasi])</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">mean PD pada yang ditolak</text>
</svg>`,
        alt: "Bar mean PD pada yang ditolak: aktual 0,4759; model-A 0,2337; reweighting 0,2804; fuzzy 0,2337; oracle 0,3938.",
        caption: "Cara membaca: tinggi bar = mean PD pada 6.588 pelamar yang ditolak; bar merah = aktual (target). Interpretasi: reweighting paling dekat, fuzzy sama dengan model-A, bahkan oracle (0,3938) masih di bawah aktual.",
      },
      tasks: [],
      note: {
        title: "Kesimpulan jujur modul ini",
        type: "pitfall",
        body: "Tak satu pun dari ketiga obat memperbaiki bias sepenuhnya di simulasi ini: extrapolation mendiagnosis (gap 0,2422), reweighting paling membantu (0,2804 vs target 0,4759), fuzzy menggemakan model lama (0,2337 — sama dengan model-A). Yang memperbaiki sungguh-sungguh hanyalah data baru tentang yang ditolak.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab: ukur bias model-A pada simulasi UCI",
      prose: [
        "Lab pertama mengukur bias dengan angka ringkas simulasi approval UCI — aturan approval sintetis [ilustrasi]: PAY_0 ≤ 1 DAN LIMIT_BAL ≥ 50.000. Angka aktual yang ditolak diketahui di sini karena ini simulasi — dalam produksi, angka itu justru yang tidak diketahui.",
        "Tiga gap yang dihitung: pada yang disetujui (aktual 0,1495 vs prediksi 0,1495 — gap 0,0000: model tepat di wilayahnya sendiri), pada yang ditolak (0,4759 vs 0,2337 — gap 0,2422), dan pada semua pelamar (0,2212 vs 0,1680 — gap 0,0532).",
        "Gap 0,0532 pada semua pelamar berarti 1.596 default yang «hilang» dari perhitungan [lab] — bila bank memakai mean PD model-A sebagai default rate portofolio, ia meremehkan kerugian yang diharapkan sebesar itu. Inilah harga selection bias dalam satuan nasabah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung approval rate = disetujui / semua" },
        { id: "t2", text: "Hitung gap pada yang ditolak dan pada semua pelamar" },
        { id: "t3", text: "Hitung berapa default yang hilang dari perhitungan" },
      ],
      expected: "approval rate: 0.7804\ngap ditolak (aktual - prediksi): 0.2422\ngap semua (aktual - prediksi): 0.0532\ndefault yang \"hilang\" dari perhitungan: 1596 nasabah",
      hints: [
        "Gap = default rate aktual dikurangi mean PD prediksi model-A.",
        "Default yang hilang = gap semua × jumlah semua pelamar.",
      ],
      code: {
        starter: `# Angka ringkas simulasi approval UCI [notebook]
# Aturan approval [ilustrasi]: PAY_0 <= 1 DAN LIMIT_BAL >= 50.000
n_all = 30000
n_appr = 23412
n_rej = 6588
def_appr = 0.1495   # default rate aktual yang disetujui
def_rej = 0.4759    # default rate aktual yang ditolak (diketahui karena ini simulasi)
def_all = 0.2212    # default rate aktual semua pelamar
pd_appr = 0.1495    # mean PD model-A pada yang disetujui
pd_rej = 0.2337     # mean PD model-A pada yang ditolak
pd_all = 0.1680     # mean PD model-A pada semua pelamar

ar = 0.0  # TODO: approval rate = disetujui / semua
gap_rej = 0.0  # TODO: gap pada yang ditolak = aktual - prediksi
gap_all = 0.0  # TODO: gap pada semua pelamar = aktual - prediksi
missed = 0  # TODO: default yang hilang = gap semua x jumlah semua pelamar
print(f"approval rate: {ar:.4f}")
print(f"gap ditolak (aktual - prediksi): {gap_rej:.4f}")
print(f"gap semua (aktual - prediksi): {gap_all:.4f}")
print(f'default yang "hilang" dari perhitungan: {missed:.0f} nasabah')`,
        lockLines: 12,
        solution: `# Angka ringkas simulasi approval UCI [notebook]
# Aturan approval [ilustrasi]: PAY_0 <= 1 DAN LIMIT_BAL >= 50.000
n_all = 30000
n_appr = 23412
n_rej = 6588
def_appr = 0.1495   # default rate aktual yang disetujui
def_rej = 0.4759    # default rate aktual yang ditolak (diketahui karena ini simulasi)
def_all = 0.2212    # default rate aktual semua pelamar
pd_appr = 0.1495    # mean PD model-A pada yang disetujui
pd_rej = 0.2337     # mean PD model-A pada yang ditolak
pd_all = 0.1680     # mean PD model-A pada semua pelamar

ar = n_appr / n_all
gap_rej = def_rej - pd_rej
gap_all = def_all - pd_all
missed = gap_all * n_all
print(f"approval rate: {ar:.4f}")
print(f"gap ditolak (aktual - prediksi): {gap_rej:.4f}")
print(f"gap semua (aktual - prediksi): {gap_all:.4f}")
print(f'default yang "hilang" dari perhitungan: {missed:.0f} nasabah')`,
        checks: [
          { kind: "equal", task: "t2", name: "gap_rej", value: 0.2422, tol: 0.0001, label: "`gap_rej` seharusnya 0,2422", msg: "0,4759 − 0,2337 = 0,2422 — model-A meremehkan yang ditolak sebesar itu." },
          { kind: "stdout_matches", task: "t2", pattern: "gap ditolak \\(aktual - prediksi\\): 0\\.2422", label: "Output menampilkan gap ditolak 0,2422", msg: "Format: gap ditolak (aktual - prediksi): {gap_rej:.4f}." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab: reweighting Horvitz–Thompson pada 12 pelamar sintetis",
      prose: [
        "Lab kedua menunjukkan mekanisme reweighting pada 12 pelamar sintetis [ilustrasi] — cukup kecil untuk dihitung tangan, cukup jelas untuk melihat cara kerjanya.",
        "Datanya: band High (skor ≥ 50): 6 orang, semua disetujui, 1 default. Band Low (skor < 50): 6 orang, 2 disetujui (1 default), 4 ditolak (2 default). P(approve|High) = 1,0 → bobot 1. P(approve|Low) = 2/6 = 0,3333 → bobot 3,0.",
        "Tanpa bobot (naive): default rate yang disetujui 0,2500 — bank mengira portofolio default 25 persen. Dengan bobot Horvitz–Thompson: (1 × 1 + 3 × 1) / 12 = 0,3333 — tepat sama dengan aktual semua pelamar 0,3333 [lab].",
        "Baca hasil ini dengan benar: di contoh kecil ini approval di dalam band bersifat acak, sehingga reweighting tepat. Di data UCI yang sesungguhnya, approval bergantung pada hal-hal yang tidak teramati model — dan reweighting hanya memperbaiki sebagian (0,2337 → 0,2804, target 0,4759). Mekanismenya benar; datanya yang membatasi.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi naive = default rate di antara yang disetujui" },
        { id: "t2", text: "Lengkapi estimasi Horvitz-Thompson dengan bobot 1/P(approve|band)" },
        { id: "t3", text: "Jalankan dan bandingkan naive, reweighted, dan aktual" },
      ],
      expected: "naive (default rate yang disetujui): 0.2500\nreweighted (estimasi semua pelamar): 0.3333\naktual semua pelamar: 0.3333\nP(approve|High)=1.0000 bobot=1.00\nP(approve|Low)=0.3333 bobot=3.00",
      hints: [
        "P(approve|band) = jumlah disetujui di band itu dibagi jumlah semua di band itu.",
        "Horvitz-Thompson: jumlahkan (default / P(approve|band)) untuk yang disetujui, lalu bagi jumlah semua pelamar.",
      ],
      code: {
        starter: `# 12 pelamar sintetis [ilustrasi]: (band, disetujui, default)
# Band High (skor >= 50): 6 orang, semua disetujui. Band Low: 6 orang, 2 disetujui.
data = [
    ("High", 1, 0), ("High", 1, 0), ("High", 1, 0), ("High", 1, 0), ("High", 1, 0), ("High", 1, 1),
    ("Low", 1, 0), ("Low", 1, 1),
    ("Low", 0, 0), ("Low", 0, 1), ("Low", 0, 1), ("Low", 0, 0),
]

def p_approve(band):
    n = sum(1 for b, _, _ in data if b == band)
    a = sum(1 for b, ap, _ in data if b == band and ap == 1)
    return a / n

naive = 0.0  # TODO: default rate di antara yang disetujui
ht = 0.0  # TODO: Horvitz-Thompson = jumlah (default / P(approve|band)) / semua pelamar
actual = sum(d for _, _, d in data) / len(data)
print(f"naive (default rate yang disetujui): {naive:.4f}")
print(f"reweighted (estimasi semua pelamar): {ht:.4f}")
print(f"aktual semua pelamar: {actual:.4f}")
print(f"P(approve|High)={p_approve('High'):.4f} bobot={1 / p_approve('High'):.2f}")
print(f"P(approve|Low)={p_approve('Low'):.4f} bobot={1 / p_approve('Low'):.2f}")`,
        lockLines: 7,
        solution: `# 12 pelamar sintetis [ilustrasi]: (band, disetujui, default)
# Band High (skor >= 50): 6 orang, semua disetujui. Band Low: 6 orang, 2 disetujui.
data = [
    ("High", 1, 0), ("High", 1, 0), ("High", 1, 0), ("High", 1, 0), ("High", 1, 0), ("High", 1, 1),
    ("Low", 1, 0), ("Low", 1, 1),
    ("Low", 0, 0), ("Low", 0, 1), ("Low", 0, 1), ("Low", 0, 0),
]

def p_approve(band):
    n = sum(1 for b, _, _ in data if b == band)
    a = sum(1 for b, ap, _ in data if b == band and ap == 1)
    return a / n

naive = sum(d for _, ap, d in data if ap == 1) / sum(1 for _, ap, _ in data if ap == 1)
ht = sum(d / p_approve(b) for b, ap, d in data if ap == 1) / len(data)
actual = sum(d for _, _, d in data) / len(data)
print(f"naive (default rate yang disetujui): {naive:.4f}")
print(f"reweighted (estimasi semua pelamar): {ht:.4f}")
print(f"aktual semua pelamar: {actual:.4f}")
print(f"P(approve|High)={p_approve('High'):.4f} bobot={1 / p_approve('High'):.2f}")
print(f"P(approve|Low)={p_approve('Low'):.4f} bobot={1 / p_approve('Low'):.2f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "ht", value: 0.3333, tol: 0.0001, label: "`ht` seharusnya 0,3333", msg: "(1 × 1 + 3 × 1) / 12 = 0,3333 — sama dengan aktual, karena approval di dalam band bersifat acak di contoh ini." },
          { kind: "stdout_matches", task: "t2", pattern: "reweighted \\(estimasi semua pelamar\\): 0\\.3333", label: "Output menampilkan estimasi reweighted 0,3333", msg: "Format: reweighted (estimasi semua pelamar): {ht:.4f}." },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: obat apa untuk bias apa?",
      prose: [
        "Baru menduga ada bias? Extrapolation dulu — terapkan model ke yang ditolak, ukur gap-nya. Murah dan menunjukkan besar masalahnya.",
        "Seleksi terutama didorong fitur teramati dan P(approve) bisa diestimasi? Reweighting — obat yang paling membantu di simulasi ini (0,2804 vs target 0,4759).",
        "Seseorang mengusulkan fuzzy augmentation? Tolak dengan bukti: label lunak dari model sendiri hanya menggemakan model lama (koefisien beda ≤ 0,000875).",
        "Butuh estimasi yang benar-benar bisa dipercaya tentang yang ditolak? Kumpulkan data baru: approve sebagian kecil yang ditolak secara acak (reject sampling) atau beli data biro kredit. Tidak ada jalan pintas.",
        "Bank melonggarkan kebijakan? Jangan pakai model lama mentah-mentah — populasi baru berada di luar wilayah latih, dan kalibrasinya sudah terbukti meleset 0,2422.",
        "Model dipakai menilai kelompok yang berbeda? Audit fairness dulu (M2.2 langkah 6): approval SEX = 2 adalah 0,3007 vs SEX = 1 adalah 0,2614 (AIR 1,1502), bad rate approved hampir sama (0,0665 vs 0,0669) — dan ingat, IV SEX yang rendah (0,0092) tidak membuktikan model fair, karena bias bisa masuk lewat proxy.",
        "Memilih model yang dipakai bank — champion–challenger (perbandingan lengkap di M2.3 langkah 9) [notebook]: scorecard ROC-AUC 0,7248 vs LR 0,7426 vs GBM 0,7823; kalibrasi desil terburuk scorecard 0,1406 vs GBM terkalibrasi 0,0181. Scorecard approve ≥ 500: approval 0,7232, bad rate 0,1415, EL NT$46.382.448, profit −NT$9.140.169 — RUGI, jangan pakai ambang 500. Scorecard ≥ 520: approval 0,1972, bad rate 0,1057, EL NT$16.121.864, profit NT$2.179.202. GBM threshold 0,10: approval 0,2850, bad rate 0,0667, EL NT$11.989.453. Skor test: mean 504,0, min 437, maks 532. Keputusannya bukan «ROC-AUC tertinggi menang» — melainkan kombinasi ranking, kalibrasi, reason codes, fairness, dan biaya — dan scorecard yang threshold-nya tidak pernah dicari akan kalah karena ambangnya, bukan karena modelnya.",
        "Artefak penutup modul — scorecard card satu halaman (dokumentasi penuh adalah M8; ini template ringkasnya, diisi angka kanonis UCI yang sudah ada di M2): Tujuan — scorecard kredit ritel untuk keputusan approve/reject kartu kredit. Definisi default — 90+ hari tunggakan pada bulan berikutnya (label UCI, horizon 1 bulan). Populasi — 30.000 nasabah kartu kredit Taiwan, Sep 2005; exclusions: tidak ada (seluruh populasi dipakai). Fitur & binning — PAY_0 (7 bin, 4+ digabung), LIMIT_BAL (6 bin), AGE (5 bin); WoE/IV dihitung dari train. Performa — scorecard ROC-AUC 0,7248 (test), korelasi skor-default −0,4204; band skor monoton 0,6993 → 0,0892. Threshold — approve ≥ 520 (bukan 500); kebijakan dan profit per threshold ada di M2.3. Fairness audit — approval SEX=2 0,3007 vs SEX=1 0,2614 (AIR 1,1502); FPR 0,6434 vs 0,6817; FNR 0,0940 vs 0,0749. Asumsi & batasan — label 1 bulan; LGD 45% [ilustrasi]; EAD = LIMIT_BAL [proxy]; approval rule reject inference sintetis; hasil tidak otomatis mewakili bank/negara/produk/periode lain (checklist lengkap di checkpoint). Versi & owner — scorecard v1, data Sep 2005; owner: tim model (nama dan tanggal review diisi bank). Mini-case pengisian: bila atasanmu bertanya «di mana buktinya scorecard ini adil?» — jawab dengan dua angka dari kartu ini: AIR 1,1502 dan bad rate approved 0,0665 vs 0,0669 — bukan dengan «IV SEX rendah».",
        "Peta modul berikutnya — M3 Unsupervised / fraud. Di sana, ketiadaan label bukan pengecualian — melainkan titik awal: clustering dan anomaly detection mencari fraud sebelum ada label. Reject inference yang kamu pelajari di sini adalah jembatan ke sana: keduanya berurusan dengan apa yang tidak teramati.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: bank ingin melonggarkan kebijakan — apa yang harus dilakukan dulu?",
      prose: [
        "Bank memutuskan melonggarkan kebijakan: mulai bulan depan, 10 persen pelamar yang dulu ditolak akan disetujui. Tim model diminta memperkirakan risiko mereka. Tiga jawaban yang salah — dan satu yang benar.",
        "Jawaban salah pertama: «Pakai model-A mentah-mentah — mean PD mereka 0,2337.» Salah: itu meremehkan 0,2422 — EL yang dihitung akan separuh dari risiko sesungguhnya. Jawaban salah kedua: «Pakai fuzzy augmentation — kami sudah memakai data yang ditolak.» Salah: fuzzy hanya menggemakan model-A (0,2337, sama persis). Jawaban salah ketiga: «Pakai oracle — kami latih ulang dengan semua data.» Salah: oracle pun hanya mencapai 0,3938 vs aktual 0,4759 — dan dalam produksi, outcome yang ditolak memang tidak ada untuk dilatih.",
        "Jawaban yang benar: jalankan reject sampling. Setujui sebagian kecil yang ditolak SECARA ACAK — misal 5 persen dari 6.588, yaitu 329 nasabah — amati outcome mereka selama 12 bulan, lalu ukur default rate aktual kelompok itu. 329 nasabah dengan default rate sekitar 0,4759 memberi estimasi dengan selisih baku sekitar 0,028 — cukup untuk mengoreksi model dan menetapkan threshold baru. Biayanya: EL dari 329 nasabah yang sengaja disetujui meski berisiko — harga informasi yang tidak bisa didapat gratis.",
        "Sambil menunggu 12 bulan itu, pakai reweighting sebagai estimasi sementara (0,2804) — dengan catatan eksplisit bahwa itu batas bawah, bukan estimasi. Dan jangan pernah melaporkan 0,2337 sebagai risiko yang ditolak tanpa menyebut gap 0,2422-nya.",
        "Desain reject sampling yang benar — bukan sekadar «ambil 329 orang acak». Acak DALAM score band/risk band (stratified): jangan hanya mengambil penolakan dengan skor tertinggi — mereka adalah yang paling aman di antara yang ditolak, dan default rate mereka tidak mewakili seluruh populasi yang ditolak. Dokumentasikan override dan policy: siapa yang disetujui di luar sampling, dan kenapa. Amati outcome selama 12 bulan (horizon yang sama dengan label), lalu hitung default rate per band beserta selisih bakunya. Rumus selisih baku (standard error): SE = √(p(1−p)/n). Dengan p ≈ 0,476 dan n = 329, SE ≈ 0,0275 — cocok dengan angka di paragraf sebelumnya.",
        "Mini-case alokasi per band [notebook]: 6.588 rejected terbagi tiga band skor — di bawah 460: n = 2.205 (33,5%), default 0,6993; 460–499: n = 2.793 (42,4%), default 0,4436; 500+: n = 1.590 (24,1%), default 0,2226 (semuanya 500–519; tidak ada rejected ≥ 520). Alokasi proporsional dari 329 sampel: di bawah 460 → 110 nasabah (SE 0,0437); 460–499 → 139 (SE 0,0421); 500+ → 80 (SE 0,0465). Perhatikan: SE per band (0,042–0,047) LEBIH BESAR dari SE keseluruhan (0,0275) — karena n per band lebih kecil. Itulah harga dari stratifikasi: estimasi per band lebih jujur, tapi lebih berisik. Dan bila bank hanya mengambil 110 nasabah band teratas (500+), ia hanya mengukur default 0,2226 — lalu mengira seluruh yang ditolak berisiko 0,22, padahal aktualnya 0,4759.",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab: simulasi approval dan tiga obat di data UCI",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m25-guided-task.ipynb.",
        "Di notebook itu kamu menerapkan aturan approval sintetis [ilustrasi] pada dataset UCI 30.000 nasabah, melatih model-A hanya pada yang disetujui, mengukur gap kalibrasi pada yang ditolak, lalu menerapkan ketiga obat — extrapolation, reweighting, fuzzy augmentation — dan membandingkan hasilnya dengan oracle — lengkap dengan checks yang menegaskan tiap langkah, termasuk verifikasi bahwa koefisien fuzzy nyaris identik dengan model-A.",
        "Tautan Colab:",
        "Buka di Colab: https://colab.research.google.com/drive/1iExwvjnz_V5zmVO4A_FjhY-qkVxLId68",
        "Jalur file notebook: colab/mlf-m25-guided-task.ipynb.",
        "Companion full-code untuk topik yang memetakan ke proyek nyata: notebook credit scoring end-to-end di Colab: https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO — di sana fairness audit menunjukkan pola yang sama: model yang dilatih pada yang disetujui berperilaku berbeda antar kelompok.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint: yang tidak terlihat adalah yang paling mahal",
      prose: [
        "Rangkuman: model hanya belajar dari yang disetujui — dan meremehkan yang ditolak sebesar 0,2422 (mean PD 0,2337 vs aktual 0,4759). Ranking-nya aman (ROC-AUC 0,7124 vs oracle 0,7139); kalibrasinya yang rusak. Tiga obat: extrapolation mendiagnosis, reweighting paling membantu (0,2804), fuzzy menggemakan model lama (0,2337 — koefisien beda ≤ 0,000875). Yang memperbaiki sungguh-sungguh hanyalah data baru tentang yang ditolak.",
        "Checklist batasan UCI — baca sebelum mengklaim apa pun dari dataset ini. Bukan origination/vintage sejati: tidak ada tanggal origination, kohort didefinisikan dari status teramati. Tanpa recovery cash flow: LGD tidak bisa dilatih — 45 persen adalah asumsi [ilustrasi]. Tanpa utilization-at-default: EAD tidak bisa dilatih — LIMIT_BAL adalah proxy. Label 1 bulan: default Oktober 2005 saja — bukan PD 12 bulan. Approval rule sintetis: reject inference memakai aturan buatan (PAY_0 ≤ 1 DAN LIMIT_BAL ≥ 50.000), bukan kebijakan bank sungguhan. Hasil tidak otomatis mewakili bank, negara, produk, atau periode lain: 30.000 nasabah kartu kredit Taiwan 2005 bukan populasi universal. Checklist ini adalah gerbang terakhir modul M2 — tiap kali kamu tergoda menggeneralisasi, kembali ke enam baris ini.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Checklist enam batasan UCI: bukan vintage sejati; tanpa recovery; tanpa utilization; label 1 bulan; approval sintetis; tidak mewakili bank lain">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Checklist batasan UCI — sebelum mengklaim apa pun</text>
<text x="70" y="54" text-anchor="middle" font-size="14" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">×</text>
<text x="90" y="54" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Bukan origination/vintage sejati — tanpa tanggal origination</text>
<text x="70" y="80" text-anchor="middle" font-size="14" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">×</text>
<text x="90" y="80" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Tanpa recovery cash flow — LGD tidak bisa dilatih</text>
<text x="70" y="106" text-anchor="middle" font-size="14" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">×</text>
<text x="90" y="106" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Tanpa utilization-at-default — EAD tidak bisa dilatih</text>
<text x="70" y="132" text-anchor="middle" font-size="14" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">×</text>
<text x="90" y="132" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Label 1 bulan — default Oktober 2005 saja</text>
<text x="70" y="158" text-anchor="middle" font-size="14" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">×</text>
<text x="90" y="158" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Approval rule sintetis — reject inference</text>
<text x="70" y="184" text-anchor="middle" font-size="14" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">×</text>
<text x="90" y="184" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Hasil tidak otomatis mewakili bank/negara/produk/periode lain</text>
<text x="240" y="214" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Tiap klaim dari UCI harus lolos enam baris ini dulu.</text>
<text x="240" y="230" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Bukti UCI → batasan produksi: yang tidak ada di data, tidak boleh diklaim.</text>
</svg>`,
        alt: "Checklist enam batasan UCI: bukan vintage sejati; tanpa recovery; tanpa utilization; label 1 bulan; approval sintetis; tidak mewakili bank lain.",
        caption: "Cara membaca: tiap baris = satu hal yang TIDAK dimiliki dataset UCI. Interpretasi: klaim produksi harus lolos checklist ini — LGD 45% adalah asumsi, EAD = LIMIT_BAL adalah proxy, dan labelnya hanya 1 bulan.",
      },
      tasks: [],
      quiz: [
        {
          q: "Apa itu selection bias dalam credit scoring?",
          options: [
            { text: "Model memilih fitur yang salah", why: "Itu feature selection yang buruk — bukan selection bias." },
            { text: "Data latih hanya berisi pinjaman yang disetujui, bukan semua pelamar", why: "Benar: outcome hanya tersedia untuk yang disetujui — model tidak pernah melihat yang ditolak.", correct: true },
            { text: "Model bias terhadap satu kelompok nasabah", why: "Itu fairness/bias kelompok — terkait, tapi bukan definisi selection bias di sini." },
            { text: "Test set terlalu kecil", why: "Test set kecil adalah masalah varians — bukan selection bias." },
          ],
        },
        {
          q: "Model-A: mean PD pada yang ditolak 0,2337, aktual 0,4759. Berapa gap-nya?",
          options: [
            { text: "0,0532", why: "Itu gap pada semua pelamar (0,2212 vs 0,1680)." },
            { text: "0,2422", why: "Benar: 0,4759 − 0,2337 = 0,2422.", correct: true },
            { text: "0,1955", why: "Itu gap reweighting (0,4759 vs 0,2804)." },
            { text: "0,0821", why: "Itu gap oracle (0,4759 vs 0,3938)." },
          ],
        },
        {
          q: "ROC-AUC model-A 0,7124 vs oracle 0,7139. Apa kesimpulannya?",
          options: [
            { text: "Model-A rusak total — tidak bisa dipakai", why: "Ranking-nya nyaris sama dengan oracle — yang rusak kalibrasinya, bukan rankingnya." },
            { text: "Ranking aman; yang rusak adalah kalibrasi", why: "Benar: selisih ROC-AUC hanya 0,0015, tapi gap kalibrasi 0,2422 — selection bias menghantam kalibrasi, bukan ranking.", correct: true },
            { text: "Oracle lebih buruk dari model-A", why: "Oracle 0,7139 sedikit DI ATAS model-A 0,7124." },
            { text: "ROC-AUC tidak bisa dibandingkan antar model", why: "ROC-AUC justru dirancang untuk dibandingkan — keduanya dihitung pada populasi yang sama." },
          ],
        },
        {
          q: "Reweighting: mean PD pada yang ditolak menjadi 0,2804. Apa artinya?",
          options: [
            { text: "Bias teratasi penuh — 0,2804 sudah dekat dengan 0,4759", why: "Masih jauh: gap tersisa 0,1955 — perbaikan parsial, bukan penuh." },
            { text: "Perbaikan parsial — gap menyusut dari 0,2422 menjadi 0,1955", why: "Benar: reweighting paling membantu di antara tiga obat, tapi tidak memperbaiki sepenuhnya.", correct: true },
            { text: "Reweighting memperburuk bias", why: "Tidak — 0,2804 lebih dekat ke 0,4759 daripada 0,2337." },
            { text: "Reweighting sama dengan fuzzy augmentation", why: "Fuzzy tetap 0,2337 — sama dengan model-A; reweighting 0,2804." },
          ],
        },
        {
          q: "Kenapa fuzzy augmentation tidak memperbaiki bias?",
          options: [
            { text: "Karena label lunaknya berasal dari model-A itu sendiri — tidak ada informasi baru", why: "Benar: koefisien fuzzy vs model-A berbeda maksimal 0,000875 — model baru hanya menggemakan model lama.", correct: true },
            { text: "Karena bobot 0,5 terlalu kecil", why: "Besar bobot bukan masalahnya — sumber labelnya yang bermasalah." },
            { text: "Karena fuzzy augmentation butuh data yang ditolak dalam jumlah besar", why: "Jumlah bukan masalahnya — labelnya yang berasal dari model yang sudah bias." },
            { text: "Karena fuzzy augmentation tidak memakai logistic regression", why: "Fuzzy memakai model yang sama — masalahnya bukan jenis modelnya." },
          ],
        },
        {
          q: "Bank ingin tahu risiko pelamar yang ditolak dengan benar. Apa jalan yang paling bisa dipercaya?",
          options: [
            { text: "Terapkan model-A mentah-mentah", why: "Itu meremehkan 0,2422 — jawaban yang salah dengan percaya diri." },
            { text: "Pakai fuzzy augmentation", why: "Fuzzy hanya menggemakan model-A — 0,2337, sama persis." },
            { text: "Approve sebagian kecil yang ditolak secara acak dan amati outcome-nya", why: "Benar: reject sampling memberi data baru yang sesungguhnya — satu-satunya jalan yang memperbaiki bias, bukan hanya mengukurnya.", correct: true },
            { text: "Naikkan threshold supaya lebih banyak yang ditolak", why: "Itu memperparah seleksi — bukan mengukurnya." },
          ],
        },
        {
          q: "6.588 pelamar ditolak dengan default rate aktual 0,4759. Sekitar berapa dari mereka yang benar-benar akan default?",
          options: [
            { text: "1.537", why: "Itu 6.588 × 0,2337 — mean PD model-A yang meremehkan, bukan default aktual." },
            { text: "3.135", why: "Benar: 6.588 × 0,4759 ≈ 3.135 — lebih dari dua kali lipat perkiraan model-A.", correct: true },
            { text: "2.594", why: "Itu 6.588 × 0,3938 — estimasi oracle, masih di bawah aktual." },
            { text: "1.847", why: "Itu 6.588 × 0,2804 — estimasi reweighting, masih batas bawah." },
          ],
        },
        {
          q: "Andaikan (hipotetis, BUKAN simulasi UCI di lesson ini) sebuah metode reweighting memberi P(approve) = 0,05 pada satu nasabah. Berapa bobot inverse-probability-nya, dan apa risikonya?",
          options: [
            { text: "Bobot 0,05 — risiko tidak ada", why: "Bobotnya 1/P, bukan P — dan satu nasabah dengan bobot besar adalah risiko, bukan bukan-apa-apa." },
            { text: "Bobot 20 — satu orang mewakili 20 orang, varians meledak; clip diperlukan", why: "Benar: bobot = 1/0,05 = 20. Satu nasabah yang default atau tidak mengubah estimasi sebesar 20 orang — varians meledak, jadi bobot harus di-clip. Ini situasi hipotetis; simulasi UCI di lesson ini memakai bobot yang jauh lebih ringan.", correct: true },
            { text: "Bobot 20 — dan itu aman karena bobot besar berarti data lebih banyak", why: "Bobot besar bukan data lebih banyak — itu satu observasi yang digandakan 20 kali, dan variansnya meledak." },
            { text: "Bobot 1,05 — risiko kecil", why: "1,05 bukan 1/0,05 — rumusnya bobot = 1/P(approve)." },
          ],
        },
      ],
      summary: [
        "Selection bias: model hanya melihat yang disetujui — meremehkan yang ditolak 0,2422.",
        "Ranking aman (ROC-AUC 0,7124 vs oracle 0,7139); kalibrasi yang rusak.",
        "Reweighting paling membantu (0,2804); fuzzy menggemakan model-A (0,2337).",
        "Yang memperbaiki sungguh-sungguh hanyalah data baru: reject sampling 329 nasabah (SE 0,0275).",
        "Alokasi sampling per band: 110 / 139 / 80 — SE per band 0,0437 / 0,0421 / 0,0465.",
        "Scorecard butuh threshold-nya sendiri: ≥ 500 rugi NT$9.140.169; ≥ 520 untung NT$2.179.202.",
        "Checklist batasan UCI: label 1 bulan, LGD asumsi, EAD proxy, approval rule sintetis.",
        "Bahkan oracle (0,3938) masih di bawah aktual 0,4759.",
        "Yang memperbaiki sungguh-sungguh: data baru — reject sampling atau data biro kredit.",
      ],
      next: { label: "Lanjut: MLF-M3.1 — Unsupervised: Clustering & Anomaly Detection", href: "/v2/learn/mlf-m31-unsupervised-clustering-anomaly" },
    },
  ],
};
