import type { V2Lesson } from "../lib/types";

const FIG_MER = `<svg viewBox="0 0 480 300" role="img" aria-label="Dua pilar penilaian MER FATF dan perjalanan status Indonesia.">
<g font-family="var(--font-ui)">
<text x="240" y="24" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="600">Dua pilar yang dinilai MER FATF</text>
<text x="240" y="42" font-size="10" fill="var(--chart-text)" text-anchor="middle">technical compliance + effectiveness &#8212; keduanya harus kuat</text>
<text x="40" y="92" font-size="11" fill="var(--chart-text)">Kepatuhan teknis (aturan tertulis)</text>
<rect x="40" y="100" width="200" height="24" fill="var(--c2)" opacity="0.9"/>
<text x="248" y="117" font-size="11" fill="var(--chart-text)">undang-undang, regulasi, kewajiban ada di kertas</text>
<text x="40" y="152" font-size="11" fill="var(--chart-text)">Efektivitas (hasil nyata)</text>
<rect x="40" y="160" width="200" height="24" fill="var(--c4)" opacity="0.9"/>
<text x="248" y="177" font-size="11" fill="var(--chart-text)">penindakan, penyitaan, data &#8212; yang diukur evaluator</text>
<text x="40" y="220" font-size="11" fill="var(--chart-text)" font-weight="600">Perjalanan Indonesia:</text>
<circle cx="60" cy="244" r="5" fill="var(--c3)"/>
<text x="72" y="248" font-size="11" fill="var(--chart-text)">2015: keluar grey list</text>
<circle cx="210" cy="244" r="5" fill="var(--c1)"/>
<text x="222" y="248" font-size="11" fill="var(--chart-text)">Okt 2023: anggota penuh</text>
<circle cx="360" cy="244" r="5" fill="var(--c4)"/>
<text x="372" y="248" font-size="11" fill="var(--chart-text)">2029: MER</text>
<text x="240" y="282" font-size="11" fill="var(--chart-text)" text-anchor="middle">Cara membaca: MER menilai kertas DAN hasil.</text>
<text x="240" y="298" font-size="11" fill="var(--chart-text)" text-anchor="middle">Interpretasi: anggota penuh justru diuji lebih dalam.</text>
</g>
</svg>`;

export const aml16: V2Lesson = {
  slug: "aml16-fatf-greylist-indonesia",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML16 — Indonesia Anggota Penuh FATF: Apa Artinya bagi Program AML",
  estMinutes: 65,
  steps: [
    {
      id: "sampul",
      eyebrow: "Sampul",
      title: "Yang dinilai bukan bankmu — negerimu",
      prose: [
        "AML16 — Indonesia Anggota Penuh FATF: Apa Artinya bagi Program AML · 65 menit · 2 lab Python · 6 kuis · 1 mini-case · 1 chart.",
        "Daftar isi: 1. Cerita: rapat yang mengubah kalender compliance. 2. Konsep: dari grey list ke kursi anggota penuh. 3. Konsep: ujian bernama MER. 4. Konsep: NRA sebagai tulang punggung. 5. Lab: peta panas kesiapan MER. 6. Lab: biaya menutup gap bukti efektivitas. 7. Peta keputusan: menuju MER 2029. 8. Mini-case: kesiapan Bank Artha Dana. 9. Checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan perjalanan status Indonesia di FATF (keluar grey list 2015, anggota penuh Oktober 2023) dan mekanisme ICRG di baliknya; (2) menjelaskan dua pilar penilaian MER dan konsekuensi hasil yang buruk; (3) menjelaskan fungsi National Risk Assessment bagi bank dan kaitannya dengan kebijakan AML institusi; (4) menghitung skor kesiapan MER dan memprioritaskan perbaikan; (5) mengestimasi beban kerja menutup gap bukti efektivitas.",
        "Catatan kejujuran: klaim status dalam lesson ini bertanggal 2026-10-19. Status dan jadwal evaluasi berubah mengikuti keputusan plenary FATF (Februari, Juni, Oktober). Verifikasi mandiri: buka fatf-gafi.org → baca pernyataan plenary dan daftar 'mutual evaluations' terbaru. Jangan mengutip tanggal dari ingatan — termasuk dari lesson ini.",
      ],
      tasks: [],
      reference: "Premis lesson ini: Indonesia anggota penuh FATF, dievaluasi menuju MER 2029.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rapat yang mengubah kalender compliance",
      prose: [
        "Rina, analis AML di Bank Artha Dana, Jakarta, sudah lima tahun mengerjakan hal yang sama: CDD nasabah baru, memantau transaksi mencurigakan, menulis STR. Suatu Senin pagi, kepala compliance mengumpulkan seluruh tim: 'Mulai bulan ini kita masuk program kesiapan MER 2029. PPATK baru meluncurkan tiga National Risk Assessment. Prioritas kita berubah.' Di papan tulis tertulis daftar yang asing baginya: statistik penindakan, dokumentasi efektivitas, penilaian risiko sektoral.",
        "Twist-nya: selama ini Rina mengira status Indonesia di FATF adalah urusan diplomat di Paris — jauh dari mejanya. Ternyata tidak. Mutual Evaluation Review menilai NEGARA, tetapi buktinya diambil dari meja-meja seperti milik Rina: berapa STR yang berujung penyidikan, seberapa cepat bank merespons permintaan informasi, apakah penilaian risiko bank selaras dengan penilaian risiko nasional. Ujian negara = ujian kolektif seluruh pelapor.",
        "Pelajaran lesson ini: Indonesia bukan lagi negara yang diawasi dari luar — ia duduk di meja pembuat standar sebagai anggota penuh sejak Oktober 2023, dan sebagai anggota ia justru akan dievaluasi LEBIH dalam pada MER 2029. Pekerjaanmu sehari-hari adalah bahan ujiannya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "MER yang buruk bukan sekadar nilai jelek di rapor: ia membuka risiko negara kembali masuk daftar pengawasan, yang berujung pada de-risking bank koresponden, biaya transaksi lintas batas yang naik, dan persepsi risiko negara yang memburuk. Bagi bank devisa, itu ancaman terhadap jalur hidup trade finance. Kesiapan MER = manajemen risiko tingkat negara.",
      },
      reference: "Ujian negara, bukti dari mejamu. Anggota penuh = dievaluasi lebih dalam.",
    },
    {
      id: "perjalanan",
      eyebrow: "Langkah 2 · Konsep",
      title: "Dari grey list ke kursi anggota penuh",
      prose: [
        "Grey list — Si Rapor Merah. Nama resminya 'Jurisdictions under Increased Monitoring'. Bukan sanksi, bukan larangan berbisnis — melainkan pengumuman publik bahwa suatu yurisdiksi punya kekurangan strategis dalam kerangka AML/CFT dan sedang diawasi perbaikannya. Mekanisme di baliknya bernama ICRG (International Co-operation Review Group): FATF menilai lewat mutual evaluation, yang bermasalah masuk masa observasi untuk berbenah, lalu FATF menyusun action plan bersama yurisdiksi itu. Keluar dari daftar = selesaikan action plan + kunjungan verifikasi lapangan + keputusan plenary.",
        "Perjalanan Indonesia — Si Anak yang Naik Kelas. Indonesia pernah berada di grey list dan KELUAR pada 2015 setelah menyelesaikan action plan-nya. Delapan tahun kemudian, Oktober 2023, Indonesia menjadi anggota penuh FATF — duduk sejajar dengan negara-negara pembuat standar. Bedanya status pengamat dan anggota: pengamat mengikuti aturan; anggota ikut MENULIS aturan sekaligus berkomitmen dievaluasi penuh atas pelaksanaannya. Kursi di meja standar datang sepaket dengan sorotan yang lebih terang.",
        "Implikasinya bagi analis: era 'kita diawasi' sudah lewat; era 'kita diuji sebagai pembuat standar' sedang berjalan. Evaluator MER 2029 tidak akan bertanya 'apakah Indonesia punya undang-undang TPPU' — itu sudah terjawab. Mereka akan bertanya: 'tunjukkan bahwa undang-undang itu BEKERJA' — dengan data penindakan, statistik, dan studi kasus. Pertanyaan berubah dari 'ada atau tidak' menjadi 'efektif atau tidak'.",
        "Satu hal yang tidak berubah: daftar dan jadwal FATF tetap bergerak mengikuti plenary (Februari, Juni, Oktober). Kebiasaan 'plenary watch' tetap berlaku — bedanya, yang kamu pantau kini bukan hanya daftar grey list, melainkan juga kalender dan metodologi evaluasi yang akan dipakai menilai negaramu sendiri.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Indonesia sudah anggota penuh, jadi urusan FATF selesai.” Justru sebaliknya: anggota penuh adalah KOMITMEN untuk dievaluasi penuh. Grey list mengawasi negara yang berbenah; MER menguji negara yang mengklaim sudah baik — dan standar ujinya lebih dalam. Status 2015 dan 2023 adalah awal babak baru, bukan garis finis.",
      },
      hints: [
        "ICRG = mekanisme review di balik grey list. Keluar = action plan + on-site + plenary.",
        "Anggota penuh = ikut menulis standar + dievaluasi penuh. Bukan tameng.",
      ],
      reference: "2015: keluar grey list. Oktober 2023: anggota penuh. 2029: diuji sebagai pembuat standar.",
    },
    {
      id: "mer",
      eyebrow: "Langkah 3 · Konsep",
      title: "Ujian bernama MER",
      prose: [
        "MER — Si Ujian Dua Mata Pelajaran. Mutual Evaluation Review menilai negara lewat DUA pilar sekaligus. Pilar pertama: technical compliance — apakah aturan tertulisnya lengkap (undang-undang, regulasi, kewajiban pelapor). Pilar kedua: effectiveness — apakah aturan itu menghasilkan sesuatu di dunia nyata (penyidikan, penuntutan, penyitaan aset, kerja sama internasional yang berjalan). Lulus kertas tapi gagal lapangan = tetap gagal. Inilah yang membuat MER 2029 berbeda dari semua 'ujian' kepatuhan yang pernah kamu ikuti: auditor internal memeriksa dokumenmu; evaluator MER memeriksa DAMPAK dokumenmu.",
        "Konsekuensi hasil yang buruk — Si Efek Domino. Negara dengan hasil MER yang buruk berisiko kembali masuk mekanisme pengawasan FATF, dan pasar bereaksi jauh sebelum pengumuman resmi: bank koresponden global mulai menaikkan biaya atau membatasi layanan (de-risking), biaya transaksi lintas batas naik, dan premi risiko negara ikut naik. Bagi analis di bank devisa, rantai ini konkret: hasil MER → persepsi koresponden → kuesioner EDD yang lebih berat → biaya compliance bankmu. Kamu tidak duduk di ruang evaluasi di Paris, tetapi dompet bankmu ikut dinilai.",
        "Rumus kesiapan — cara berpikir evaluator dalam angka. Evaluator pada intinya menimbang dua skor: Kesiapan = 0,4 × TC + 0,6 × E, dengan TC = skor kepatuhan teknis (0–100) dan E = skor efektivitas (0–100). Bobot efektivitas lebih besar dengan sengaja: di era anggota penuh, 'aturan sudah ada' adalah ekspektasi minimum, bukan prestasi. Contoh: TC 78, E 55 → kesiapan = 31,2 + 33,0 = 64,2 → kategori 'perbaikan terjadwal' (ambang: ≥75 siap, 60–74 perbaikan terjadwal, <60 prioritas). Angka ini akan kamu hitung sendiri di lab.",
        "Cara membaca figur: dua batang = dua pilar penilaian; timeline = perjalanan status Indonesia. Interpretasi: pilar efektivitas adalah tempat pertarungan MER 2029 dimenangkan atau dikalahkan — dan pilar itulah yang bukti-buktinya lahir dari pekerjaan harian analis seperti kamu.",
      ],
      figure: {
        svg: FIG_MER,
        alt: "Dua pilar MER: kepatuhan teknis dan efektivitas; timeline Indonesia 2015, 2023, 2029.",
        caption: "MER menilai kertas DAN hasil. Efektivitas berbobot lebih besar.",
      },
      formula: String.raw`\text{Kesiapan} = 0{,}4 \cdot TC + 0{,}6 \cdot E`,
      formulaNote: "Kesiapan MER per area (0–100); TC = skor kepatuhan teknis; E = skor efektivitas; bobot 0,4/0,6 mencerminkan penekanan evaluator pada hasil nyata. Contoh: TC 78, E 55 → 0,4×78 + 0,6×55 = 64,2 → PERBAIKAN TERJADWAL (≥75 siap; 60–74 perbaikan terjadwal; <60 prioritas).",
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“MER itu audit dokumen negara — urusan regulator, bukan bank.” Evaluator menilai efektivitas SISTEM, dan sistem itu = regulator + penegak hukum + PELAPOR (bank, fintech, notaris, dan kamu). STR yang tidak pernah berujung penyidikan, data yang tidak bisa diagregasi nasional, penilaian risiko bank yang tidak selaras dengan NRA — semua itu adalah temuan MER yang bersumber dari industri. Kamu adalah bagian dari sampel.",
      },
      hints: [
        "Dua pilar: technical compliance + effectiveness. Bobot efektivitas lebih besar.",
        "Hasil buruk → risiko pengawasan ulang → de-risking koresponden → biaya naik.",
      ],
      reference: "MER = ujian dua mata pelajaran. Efektivitas = tempat pertarungan.",
    },
    {
      id: "nra",
      eyebrow: "Langkah 4 · Konsep",
      title: "NRA: tulang punggung risk-based approach",
      prose: [
        "NRA — Si Peta Harta Karun Nasional. National Risk Assessment adalah penilaian resmi sebuah negara atas risiko pencucian uang dan pendanaan terorisme di wilayahnya: sektor apa yang paling berisiko, modus apa yang dominan, di mana celah pengawasannya. Pada 28 Agustus 2026, PPATK meluncurkan tiga NRA sekaligus sebagai persiapan menuju MER 2029. Tiga dokumen ini bukan pajangan — mereka adalah fondasi yang di atasnya seluruh arsitektur risk-based approach nasional dibangun.",
        "Rantai yang harus kamu hafal: NRA (nasional) → SRA (sectoral risk assessment, per sektor) → kebijakan AML institusi (bankmu). Logikanya: negara memetakan risiko, sektor menerjemahkannya ke konteksnya, dan bankmu WAJIB menyelaraskan penilaian risiko institusionalnya dengan keduanya. Bank yang menilai risiko 'rendah' untuk sektor yang NRA nyatakan 'tinggi' akan ditanya evaluator: 'atas dasar apa?' — dan 'firasat' bukan jawaban yang diterima.",
        "Fungsi praktis NRA bagi analis sehari-hari ada tiga. Satu: kalibrasi — gunakan peringkat risiko NRA sebagai jangkar saat menilai nasabah dan produk; penyimpangan harus didokumentasikan alasannya. Dua: prioritas — alokasikan sumber daya EDD dan pemantauan ke sektor berisiko tinggi menurut NRA, bukan menurut kebiasaan. Tiga: bahasa bersama — saat regulator, auditor, dan evaluator bertanya 'mengapa begini', jawabanmu merujuk ke dokumen yang sama dengan yang mereka pegang.",
        "Jebakan terbesar: memperlakukan NRA sebagai dokumen rak buku — dibaca sekali saat launching, lalu dilupakan. Evaluator MER justru memeriksa JEJAK penggunaannya: apakah kebijakan bank diperbarui setelah NRA terbit? Apakah matriks risiko direvisi? NRA yang tidak mengubah apa pun di bankmu adalah bukti efektivitas yang GAGAL — ditulis oleh dirimu sendiri.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“NRA sudah terbit, tugas negara selesai.” NRA adalah TITIK AWAL, bukan garis finis. Nilainya nol jika tidak mengalir ke SRA dan ke kebijakan institusi. Pertanyaan evaluator bukan 'apakah NRA ada' (itu technical compliance), melainkan 'tunjukkan keputusan bank yang berubah karena NRA' (itu effectiveness). Simpan bukti perubahannya.",
      },
      hints: [
        "Rantai: NRA → SRA → kebijakan institusi. Selaraskan penilaian risikomu.",
        "28 Agustus 2026: PPATK luncurkan 3 NRA untuk persiapan MER 2029.",
      ],
      reference: "NRA yang tidak mengubah kebijakan = bukti efektivitas yang gagal.",
    },
    {
      id: "lab-kesiapan",
      eyebrow: "Langkah 5 · Lab",
      title: "Peta panas kesiapan MER",
      prose: [
        "Lima area kesiapan Bank Artha Dana menuju MER 2029, masing-masing dengan skor kepatuhan teknis (TC) dan efektivitas (E). Hitung kesiapan = 0,4×TC + 0,6×E, klasifikasikan (≥75 SIAP, 60–74 PERBAIKAN TERJADWAL, <60 PRIORITAS), lalu cetak daftar prioritas dari yang terendah.",
        "Perhatikan hasilnya: 'Kepatuhan teknis' 68,4 — aturan tertulisnya cukup baik. Tetapi 'Transparansi BO' 50,2 dan 'Pengawasan berbasis risiko' 55,2 — keduanya PRIORITAS. Inilah pola klasik negara anggota penuh: kertasnya rapi, efektivitasnya yang bocor. Lab ini menunjukkan MENGAPA evaluator memberi bobot lebih pada E: karena di sanalah kegagalan biasanya bersembunyi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `siap` (dict nama → skor) dan `overall` (rata-rata)" },
        { id: "t2", text: "Jalankan dan pastikan peta panas + daftar prioritas tercetak" },
      ],
      expected: "Kepatuhan teknis: 68.4 -> PERBAIKAN TERJADWAL\nEfektivitas penindakan: 61.0 -> PERBAIKAN TERJADWAL\nPengawasan berbasis risiko: 55.2 -> PRIORITAS\nKerja sama internasional: 68.0 -> PERBAIKAN TERJADWAL\nTransparansi BO: 50.2 -> PRIORITAS\nKESIAPAN KESELURUHAN: 60.6\nPRIORITAS: Transparansi BO, Pengawasan berbasis risiko, Efektivitas penindakan, Kerja sama internasional, Kepatuhan teknis",
      note: {
        title: "💡 Intuisi",
        body: "Peta panas mengubah 'kita harus bersiap' yang abstrak menjadi daftar belanja yang konkret: dua area PRIORITAS, tiga PERBAIKAN TERJADWAL. Inilah cara compliance meminta anggaran ke direksi — bukan dengan kecemasan, melainkan dengan urutan kerja.",
      },
      hints: [
        "nilai = 0.4*tc + 0.6*e; SIAP >= 75, PERBAIKAN TERJADWAL >= 60, else PRIORITAS.",
        "overall = rata-rata nilai semua area; prioritas = urut menaik.",
      ],
      code: {
        starter: "# (nama, kepatuhan_teknis, efektivitas). JANGAN UBAH.\narea = [(\"Kepatuhan teknis\", 78, 62),\n        (\"Efektivitas penindakan\", 70, 55),\n        (\"Pengawasan berbasis risiko\", 66, 48),\n        (\"Kerja sama internasional\", 80, 60),\n        (\"Transparansi BO\", 58, 45)]\n\n# TULIS KODEMU: kesiapan = 0,4*TC + 0,6*E; kelas: >=75 SIAP, >=60 PERBAIKAN, else PRIORITAS\nsiap = {}\nfor nama, tc, e in area:\n    nilai =\n    kelas =\n    siap[nama] = round(nilai, 1)\n    print(f\"{nama}: {nilai:.1f} -> {kelas}\")\n",
        lockLines: 10,
        solution: "# (nama, kepatuhan_teknis, efektivitas). JANGAN UBAH.\narea = [(\"Kepatuhan teknis\", 78, 62),\n        (\"Efektivitas penindakan\", 70, 55),\n        (\"Pengawasan berbasis risiko\", 66, 48),\n        (\"Kerja sama internasional\", 80, 60),\n        (\"Transparansi BO\", 58, 45)]\n\n# TULIS KODEMU: kesiapan = 0,4*TC + 0,6*E; kelas: >=75 SIAP, >=60 PERBAIKAN, else PRIORITAS\nsiap = {}\nfor nama, tc, e in area:\n    nilai = 0.4 * tc + 0.6 * e\n    kelas = \"SIAP\" if nilai >= 75 else (\"PERBAIKAN TERJADWAL\" if nilai >= 60 else \"PRIORITAS\")\n    siap[nama] = round(nilai, 1)\n    print(f\"{nama}: {nilai:.1f} -> {kelas}\")\noverall = sum(siap.values()) / len(siap)\nprint(f\"KESIAPAN KESELURUHAN: {overall:.1f}\")\nprioritas = sorted(siap.items(), key=lambda x: x[1])\nprint(\"PRIORITAS: \" + \", \".join(n for n, v in prioritas))\n",
        checks: [
          { kind: "equal", task: "t1", label: "Overall 60,6", msg: "Rata-rata 5 area.", name: "overall", value: 60.6, tol: 0.05 },
          { kind: "stdout_matches", task: "t2", label: "Transparansi BO PRIORITAS", msg: "23,2+27=50,2.", pattern: "Transparansi BO: 50\\.2 -> PRIORITAS" },
          { kind: "stdout_matches", task: "t2", label: "Overall tercetak", msg: "Format persis.", pattern: "KESIAPAN KESELURUHAN: 60\\.6" },
          { kind: "stdout_matches", task: "t2", label: "Daftar prioritas urut", msg: "Dari terendah.", pattern: "PRIORITAS: Transparansi BO, Pengawasan berbasis risiko, Efektivitas penindakan, Kerja sama internasional, Kepatuhan teknis" }
        ],
      },
      reference: "Kesiapan = 0,4TC + 0,6E. Efektivitas = tempat kegagalan bersembunyi.",
    },
    {
      id: "lab-bukti",
      eyebrow: "Langkah 6 · Lab",
      title: "Biaya menutup gap bukti efektivitas",
      prose: [
        "Mengetahui gap saja tidak cukup — evaluator bertanya 'apa yang sudah diperbaiki'. Lima area yang sama, kini dengan cakupan bukti dokumentasi (%) dan estimasi jam analis untuk menutup gap hingga 100%. Hitung total jam analis yang dibutuhkan.",
        "Total 580 jam analis ≈ 3,6 bulan kerja satu analis penuh. Angka ini adalah 'anggaran kesiapan MER' bank — dan inilah cara compliance bernegosiasi: bukan 'kami butuh orang', melainkan 'menutup gap bukti efektivitas butuh 580 jam sebelum 2029; tanpa itu, area transparansi BO tetap PRIORITAS di mata evaluator'.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `jam_total` dari semua area" },
        { id: "t2", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "Kepatuhan teknis: kurang 10% -> 40 jam\nEfektivitas penindakan: kurang 35% -> 120 jam\nPengawasan berbasis risiko: kurang 45% -> 160 jam\nKerja sama internasional: kurang 20% -> 60 jam\nTransparansi BO: kurang 55% -> 200 jam\nTOTAL: 580 jam analis",
      note: {
        title: "💡 Intuisi",
        body: "Efektivitas tanpa dokumentasi = tidak terjadi, di mata evaluator. Setiap jam analis yang dihabiskan merapikan bukti adalah premi asuransi terhadap temuan MER. Asuransi termurah adalah yang dibeli sebelum musibah — dan MER 2029 tanggalnya sudah diketahui.",
      },
      hints: [
        "Jumlahkan kolom jam semua area.",
        "kurang% = 100 - cakupan_bukti.",
      ],
      code: {
        starter: "# (nama, cakupan_bukti %, jam analis untuk menutup gap). JANGAN UBAH.\nbukti = [(\"Kepatuhan teknis\", 90, 40),\n         (\"Efektivitas penindakan\", 65, 120),\n         (\"Pengawasan berbasis risiko\", 55, 160),\n         (\"Kerja sama internasional\", 80, 60),\n         (\"Transparansi BO\", 45, 200)]\n\n# TULIS KODEMU: jumlahkan jam semua area ke jam_total\njam_total =\nfor nama, cakupan, jam in bukti:\n    print(f\"{nama}: kurang {100 - cakupan}% -> {jam} jam\")\n",
        lockLines: 7,
        solution: "# (nama, cakupan_bukti %, jam analis untuk menutup gap). JANGAN UBAH.\nbukti = [(\"Kepatuhan teknis\", 90, 40),\n         (\"Efektivitas penindakan\", 65, 120),\n         (\"Pengawasan berbasis risiko\", 55, 160),\n         (\"Kerja sama internasional\", 80, 60),\n         (\"Transparansi BO\", 45, 200)]\n\n# TULIS KODEMU: jumlahkan jam semua area ke jam_total\njam_total = 0\nfor nama, cakupan, jam in bukti:\n    jam_total += jam\n    print(f\"{nama}: kurang {100 - cakupan}% -> {jam} jam\")\nprint(f\"TOTAL: {jam_total} jam analis\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "Total 580 jam", msg: "40+120+160+60+200.", name: "jam_total", value: 580, tol: 0 },
          { kind: "stdout_matches", task: "t2", label: "BO 55% 200 jam", msg: "Baris transparansi BO.", pattern: "Transparansi BO: kurang 55% -> 200 jam" },
          { kind: "stdout_matches", task: "t2", label: "Total tercetak", msg: "Format persis.", pattern: "TOTAL: 580 jam analis" }
        ],
      },
      reference: "Efektivitas tanpa dokumentasi = tidak terjadi, di mata evaluator.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Menuju MER 2029: apa dulu",
      prose: [
        "Satu: selaraskan penilaian risiko institusi dengan NRA terbaru (28 Agustus 2026) — dokumentasikan setiap penyimpangan peringkat sektor beserta alasannya; ini baris pertahanan pertama saat evaluator bertanya. Dua: kejar DUA area PRIORITAS dari peta panas (transparansi beneficial ownership, pengawasan berbasis risiko) sebelum menyentuh yang lain — evaluator menilai dari yang terlemah. Tiga: bangun pipa data efektivitas: STR → penyidikan → penuntutan → penyitaan harus bisa ditelusur angkanya per kuartal; tanpa pipa ini, klaim efektivitas = opini. Empat: uji coba 'mock evaluation' internal 12 bulan sebelum MER — undang auditor eksternal berperan sebagai evaluator dan cari temuanmu sendiri sebelum mereka datang.",
        "Aturan praktis 10 detik: NRA dulu, yang terlemah dulu, data dulu, latihan dulu. Urutan ini tidak bisa dibalik: tanpa NRA kamu tidak tahu arah; tanpa memperbaiki yang terlemah skor tertahan di bawah; tanpa data tidak ada bukti; tanpa latihan kamu kaget di hari-H.",
        "Satu jebakan kalender: 2029 terdengar jauh. Tetapi program perbaikan efektivitas butuh 18–24 bulan untuk menunjukkan TREN (evaluator menilai perbaikan yang berkelanjutan, bukan lonjakan sebulan). Ditambah mock evaluation 12 bulan sebelumnya, jendela mulai yang aman sebenarnya sudah terbuka SEKARANG — di 2026.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jadwalkan 'MER watch' seperti dulu 'plenary watch': tiap plenary FATF (Februari, Juni, Oktober), 1 analis membaca pernyataan terbaru dan memperbarui asumsi kesiapan — metodologi evaluasi, jadwal, dan fokus tematik bisa berubah. Bank yang persiapannya memakai metodologi 2024 untuk evaluasi 2029 = belajar dengan silabus yang salah.",
      },
      reference: "NRA dulu, terlemah dulu, data dulu, latihan dulu. Jendela mulai = sekarang.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Program kesiapan Bank Artha Dana",
      prose: [
        "Bank Artha Dana: kesiapan keseluruhan 60,6 (PERBAIKAN TERJADWAL), dua area PRIORITAS, gap bukti 580 jam analis, dan 30 bulan menuju mock evaluation internal. Direksi bertanya: 'cukupkah anggaran compliance tahun ini?'",
        "Pertanyaan: (a) Prioritas 12 bulan pertama? (b) Bagaimana menjawab direksi soal anggaran? Pembahasan: (a) Selaraskan matriks risiko dengan NRA Agustus 2026 + kejar transparansi BO (50,2) dan pengawasan berbasis risiko (55,2) + bangun pipa data STR→penyitaan. Tiga ini menaikkan E — komponen berbobot 0,6. (b) Jawab dengan angka lab: 580 jam ≈ 3,6 bulan satu analis; tanpa itu dua area tetap PRIORITAS dan menjadi temuan pertama evaluator. Anggaran = premi asuransi temuan. Pelajaran: kesiapan MER bukan proyek 'nanti', melainkan antrean kerja yang tanggal mulainya sudah lewat kemarin.",
        "Pelajaran terbesar dari status Indonesia: menjadi anggota penuh FATF adalah kepercayaan dunia yang harus dibayar dengan bukti, setiap hari, di setiap meja analis. Setiap STR yang berkualitas, setiap penilaian risiko yang selaras NRA, adalah suaramu dalam evaluasi 2029.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bank yang menjawab evaluator dengan 'kami sedang memperbaiki' tanpa data tren = bank yang dinilai dari niat. Bank yang menunjukkan kurva perbaikan 18 bulan = bank yang dinilai dari bukti. Mulailah mengumpulkan kurvanya hari ini — evaluator 2029 menilai apa yang kamu lakukan sejak 2026.",
      },
      reference: "Kejar E (bobot 0,6). Jawab direksi dengan angka, bukan kecemasan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan. Kunci: status yang benar, dua pilar, dan apa yang harus dikerjakan.",
      ],
      tasks: [],
      summary: [
        "Indonesia: keluar grey list 2015 → anggota penuh FATF Oktober 2023 (ICRG di balik grey list: observasi → action plan → on-site → plenary).",
        "Anggota penuh = ikut menulis standar + dievaluasi penuh — bukan tameng.",
        "MER menilai dua pilar: technical compliance + effectiveness (bobot efektivitas lebih besar).",
        "Hasil MER buruk → risiko pengawasan ulang → de-risking koresponden, biaya transaksi naik, persepsi risiko negara memburuk.",
        "PPATK meluncurkan 3 NRA pada 28 Agustus 2026 untuk persiapan MER 2029; rantai: NRA → SRA → kebijakan institusi.",
        "Peta jalan: selaraskan dengan NRA, kejar area terlemah dulu, bangun pipa data efektivitas, mock evaluation 12 bulan sebelumnya.",
      ],
      next: { label: "AML17 — Fraud–AML–Cyber Fusion Center", href: "/learn/aml17-fusion-center" },
      quiz: [
        {
          q: "Bagaimana perjalanan status Indonesia di FATF?",
          options: [
            { text: "Keluar grey list 2015, menjadi anggota penuh Oktober 2023", why: "Benar: fakta yang dipakai lesson ini.", correct: true },
            { text: "Masih di grey list sampai sekarang", why: "Salah: Indonesia keluar 2015 — premis usang yang lesson lama pakai." },
            { text: "Anggota penuh sejak 2015", why: "2015 = keluar grey list; anggota penuh = Oktober 2023." },
            { text: "Belum pernah dievaluasi FATF", why: "Indonesia dievaluasi lewat ICRG/mutual evaluation — itulah yang membawanya keluar grey list." }
          ],
        },
        {
          q: "Apa fungsi ICRG dalam sistem FATF?",
          options: [
            { text: "Mereview yurisdiksi bermasalah dan menyusun action plan perbaikan bersamanya", why: "Benar: ICRG = International Co-operation Review Group.", correct: true },
            { text: "Menjatuhkan sanksi ekonomi ke negara", why: "FATF bukan badan sanksi; ICRG = review kerja sama." },
            { text: "Menilai efektivitas bank individual", why: "ICRG menilai yurisdiksi/negara, bukan bank." },
            { text: "Menerbitkan daftar sanksi PBB", why: "Daftar sanksi PBB = rezim DK PBB, bukan FATF." }
          ],
        },
        {
          q: "Dua pilar penilaian MER dan bobotnya dalam lesson ini?",
          options: [
            { text: "Technical compliance + effectiveness; efektivitas berbobot lebih besar", why: "Benar: kesiapan = 0,4TC + 0,6E.", correct: true },
            { text: "Hanya technical compliance", why: "Era anggota penuh: 'aturan ada' = ekspektasi minimum." },
            { text: "Hanya effectiveness", why: "Keduanya dinilai; kepatuhan teknis tetap pilar." },
            { text: "Kepatuhan teknis berbobot lebih besar", why: "Terbalik: efektivitas 0,6 > teknis 0,4." }
          ],
        },
        {
          q: "Risiko nyata bila hasil MER sebuah negara buruk?",
          options: [
            { text: "Risiko kembali diawasi, de-risking koresponden, biaya transaksi naik", why: "Benar: rantai domino yang dijelaskan lesson ini.", correct: true },
            { text: "Tidak ada dampak, hanya nilai di kertas", why: "Pasar dan koresponden bereaksi jauh sebelum pengumuman." },
            { text: "Negara otomatis dikeluarkan dari FATF", why: "Tidak ada mekanisme 'dikeluarkan'; risikonya pengawasan ulang." },
            { text: "Hanya denda administratif untuk bank", why: "Dampaknya sistemik tingkat negara, bukan denda bank." }
          ],
        },
        {
          q: "Apa fungsi 3 NRA yang diluncurkan PPATK 28 Agustus 2026 bagi bank?",
          options: [
            { text: "Fondasi risk-based approach: bank menyelaraskan penilaian risikonya (NRA → SRA → kebijakan institusi)", why: "Benar: NRA = jangkar kalibrasi risiko nasional.", correct: true },
            { text: "Dokumen arsip yang cukup dibaca sekali", why: "NRA tak terpakai = bukti efektivitas yang gagal." },
            { text: "Menggantikan kewajiban CDD bank", why: "NRA melengkapi, bukan menggantikan kewajiban pelapor." },
            { text: "Daftar hitam nasabah berisiko", why: "NRA = penilaian risiko sektoral/nasional, bukan daftar nama." }
          ],
        },
        {
          q: "Manakah miskonsepsi yang paling berbahaya menurut lesson ini?",
          options: [
            { text: "“Sudah anggota penuh FATF, jadi urusan selesai”", why: "Benar: anggota penuh justru dievaluasi lebih dalam.", correct: true },
            { text: "“MER menilai efektivitas, bukan sekadar dokumen”", why: "Ini pemahaman yang BENAR, bukan miskonsepsi." },
            { text: "“NRA harus mengalir ke kebijakan bank”", why: "Ini pemahaman yang BENAR." },
            { text: "“Persiapan MER butuh 18–24 bulan tren perbaikan”", why: "Ini fakta perencanaan yang benar." }
          ],
        }
      ],
      reference: "Anggota penuh = diuji lebih dalam. Efektivitas = tempat pertarungan. NRA = jangkar.",
    },
  ],
};
