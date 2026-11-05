import type { V2Lesson } from "../lib/types";

const FIG_SRP = `<svg viewBox="0 0 480 300" role="img" aria-label="Alur ICAAP ke SREP.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Pilar 2: bank menilai, regulator menguji</text>
<rect x="20" y="60" width="200" height="110" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="120" y="92" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">ICAAP</text>
<text x="120" y="112" font-size="10" fill="var(--chart-text)" text-anchor="middle">bank menilai sendiri</text>
<text x="120" y="128" font-size="10" fill="var(--chart-text)" text-anchor="middle">kecukupan modalnya</text>
<text x="120" y="148" font-size="10" fill="var(--text-muted)" text-anchor="middle">6 komponen</text>
<rect x="260" y="60" width="200" height="110" rx="8" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="360" y="92" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">SREP</text>
<text x="360" y="112" font-size="10" fill="var(--chart-text)" text-anchor="middle">OJK mengkaji &amp; menguji</text>
<text x="360" y="128" font-size="10" fill="var(--chart-text)" text-anchor="middle">hasil ICAAP bank</text>
<text x="360" y="148" font-size="10" fill="var(--text-muted)" text-anchor="middle">4 cakupan kaji ulang</text>
<line x1="220" y1="115" x2="260" y2="115" stroke="var(--chart-text)" stroke-width="2" marker-end="url(#arr)"/>
<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><polygon points="0,0 8,4 0,8" fill="var(--chart-text)"/></marker></defs>
<rect x="140" y="200" width="200" height="60" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2"/>
<text x="240" y="224" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Keputusan: capital add-on?</text>
<text x="240" y="242" font-size="10" fill="var(--chart-text)" text-anchor="middle">modal tambahan bila ICAAP</text>
<text x="240" y="256" font-size="10" fill="var(--chart-text)" text-anchor="middle">dinilai belum cukup</text>
<text x="240" y="290" font-size="11" fill="var(--chart-text)" text-anchor="middle">Pilar 1 = aturan main. Pilar 2 = wasit yang memeriksa.</text>
</g>
</svg>`;

export const rr25: V2Lesson = {
  slug: "rr25-icaap-pilar2",
  track: "Risk Reporting",
  module: "Pilar 2 & ICAAP",
  title: "RR25 — ICAAP: Bank Menilai Sendiri Kecukupan Modalnya (Pilar 2)",
  estMinutes: 53,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Bank yang lolos Pilar 1 tetapi ditegur OJK",
      prose: [
        "Bank Artha Dana menutup kuartal dengan CAR 16% — dua kali lipat minimum 8%. Direksi merayakannya. Sebulan kemudian surat dari OJK tiba: hasil kaji ulang menunjukkan bank wajib menambah modal Rp400 miliar. Direksi bingung: 'Bukankah CAR kami 16%? Apa yang kurang?'",
        "Twist-nya: 16% itu jawaban Pilar 1 — modal minimum atas risiko yang SUDAH dihitung (kredit, pasar, operasional). Yang ditagih OJK adalah jawaban Pilar 2: risiko konsentrasi Rp2 triliun di sektor properti, risiko suku bunga di banking book, dan skenario stres yang menunjukkan modal tergerus 3 poin bila properti jatuh 20%. Pilar 1 berkata bank sehat; penilaian internal bank sendiri (ICAAP) — yang ternyata dikerjakan asal-asalan — tidak bisa membantah temuan OJK. Maka OJK memakai wewenangnya: capital add-on.",
        "Inilah logika Basel yang sering disalahpahami: Pilar 1 = aturan main yang sama untuk semua bank. Pilar 2 = wasit yang memeriksa apakah aturan main itu CUKUP untuk bank yang spesifik ini, dengan profil risiko yang spesifik ini. Instrumen bank untuk menjawab wasit bernama ICAAP — Internal Capital Adequacy Assessment Process: proses bank menilai sendiri kecukupan modalnya terhadap SELURUH risiko material, termasuk yang tidak tercakup Pilar 1, secara forward-looking di bawah skenario stres.",
        "Setelah lesson ini kamu bisa: (1) menempatkan ICAAP di arsitektur Pilar 2 Basel; (2) menyebutkan enam komponen ICAAP yang sehat; (3) membedakan Pilar 1 vs Pilar 2; (4) menghitung target modal internal dan capital headroom; (5) menjelaskan alur ICAAP \u2192 SREP \u2192 keputusan regulator dan apa yang disiapkan tim risk reporting.",
        "Dua bekal dari track ini, diringkas cepat. RR16 membahas ECL dan RWA: bagaimana aset bank diberi bobot menurut risikonya sehingga Rp1 triliun kredit properti 'lebih berat' dari Rp1 triliun obligasi pemerintah — ATMR inilah penyebut rasio modal. RR15 membahas risk appetite: batas risiko yang disetujui dewan komisaris — seberapa besar risiko yang BOLEH diambil bank. ICAAP mengambil keduanya sebagai input: ATMR sebagai titik awal perhitungan, risk appetite sebagai pagar pembatas target modal internal.",
        "Satu prinsip sebelum lanjut: ICAAP bukan dokumen — ia PROSES yang berjalan terus. Bank yang mengerjakannya dua minggu sebelum deadline OJK akan ketahuan dari kualitas asumsinya. Regulator membaca ICAAP seperti dokter membaca hasil lab: yang dicari bukan angkanya saja, melainkan apakah proses di baliknya sehat.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di bank, dokumen ICAAP biasanya disusun tim risk/keuangan dengan kontribusi risk reporting untuk data, rekonsiliasi, dan template. Analis yang memahami ICAAP = analis yang bisa duduk di meja pembahasan modal dengan direksi \u2014 bukan sekadar pengisi template.",
      },
      reference: "Pilar 1 = aturan main. Pilar 2 = wasit. ICAAP = jawaban bank ke wasit.",
    },
    {
      id: "posisi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Posisi ICAAP di Pilar 2",
      prose: [
        "Arsitektur Basel berdiri di tiga pilar: Pilar 1 menetapkan modal MINIMUM (8% dari ATMR, dengan CET1 \u2265 4,5% dan Tier 1 \u2265 6%); Pilar 2 adalah Supervisory Review Process \u2014 tinjauan pengawas; Pilar 3 adalah disiplin pasar lewat keterbukaan. Pilar 2 sendiri punya dua sisi: ICAAP, proses INTERNAL bank menilai kecukupan modalnya; dan SREP (Supervisory Review and Evaluation Process), proses OJK mengkaji dan menguji hasil ICAAP itu.",
        "Empat prinsip dasar tinjauan pengawas menurut Basel, diringkas: (1) bank wajib punya proses menilai kecukupan modal terhadap profil risikonya plus strategi menjaga modal; (2) pengawas mengkaji dan mengevaluasi penilaian internal bank; (3) pengawas mengharapkan bank beroperasi DI ATAS minimum dan boleh mewajibkan modal lebih besar; (4) pengawas turun tangan dini bila modal terancam jatuh di bawah level yang dibutuhkan. Prinsip 3 dan 4 adalah dasar hukum capital add-on — OJK tidak perlu menunggu bank bangkrut untuk bertindak.",
        "Kenapa Pilar 1 tidak cukup? Karena ia tidak menangkap semuanya. Risiko konsentrasi (terlalu banyak eksposur di satu sektor/nasabah), risiko suku bunga di banking book (IRRBB), risiko likuiditas, risiko reputasi, dan risiko strategik — semuanya nyata, semuanya bisa membunuh bank, tidak satu pun dihitung memadai di Pilar 1. ICAAP ada untuk mengisi lubang ini: mengidentifikasi SELURUH risiko material, mengukurnya, dan menetapkan modal untuk menutupnya.",
        "Cara membaca gambar di atas: kotak kiri = ICAAP, pekerjaan bank (6 komponen, dibahas langkah 3). Panah ke kotak kanan = SREP, pekerjaan OJK mengkaji hasil itu (4 cakupan kaji ulang: kesesuaian proses dengan ukuran bank, keakuratan data, kewajaran metode dan asumsi, kewajaran skenario stress testing). Kotak bawah = keputusan: puas, minta perbaikan, atau tetapkan capital add-on. Interpretasi: ICAAP yang lemah tidak 'lolos diam-diam' — ia justru memicu pengawasan lebih ketat, karena regulator mengasumsikan yang terburuk dari bank yang tidak bisa menjelaskan risikonya sendiri.",
        "Satu perbedaan krusial: Pilar 1 menghitung kebutuhan modal dari RUMUS yang sama untuk semua bank; ICAAP menghitung kebutuhan modal dari PROFIL RISIKO bank itu sendiri. Dua bank dengan ATMR identik bisa punya target modal internal berbeda — bank yang terkonsentrasi di properti butuh buffer lebih tebal dari bank yang terdiversifikasi. Inilah mengapa ICAAP disebut 'penilaian sendiri': tidak ada jawaban generik.",
        "Rumus target modal internal di bawah ini adalah jantung kuantitatif ICAAP. Ia sederhana — justru karena kesederhanaannya, setiap komponennya harus bisa dipertahankan di depan penguji OJK.",
      ],
      figure: {
        svg: FIG_SRP,
        alt: "Alur ICAAP ke SREP.",
        caption: "Cara membaca: kiri = pekerjaan bank (ICAAP), kanan = pekerjaan OJK (SREP), bawah = keputusan. Interpretasi: ICAAP lemah memicu add-on, bukan kelolosan.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CCAR kami 16%, jauh di atas 8% \u2014 pasti aman dari OJK.\u201D Salah: 8% adalah lantai Pilar 1. OJK menilai kecukupan terhadap PROFIL RISIKO bank via SREP, dan boleh mewajibkan modal di atas minimum bila ICAAP menunjukkan lubang. CAR tinggi tanpa ICAAP yang kredibel = tameng kertas.",
      },
      hints: [
        "Hafalkan pasangan: ICAAP = bank menilai; SREP = OJK menguji.",
        "Empat prinsip SRP Basel = dasar hukum capital add-on.",
      ],
      formula: String.raw`C_{target} = C_{P1} + B_{internal} + A_{P2}`,
      formulaNote: "C_target = target modal internal bank (% dari ATMR). C_P1 = kebutuhan Pilar 1 sesuai profil risiko (8% untuk peringkat profil risiko 1, lebih tinggi untuk peringkat lebih buruk \u2014 lihat RR26). B_internal = buffer internal yang ditetapkan bank sendiri di atas minimum (mis. 2,5% untuk selera risiko konservatif). A_P2 = add-on untuk risiko di luar Pilar 1 hasil identifikasi ICAAP (mis. 1,5% untuk konsentrasi properti). Contoh: 8% + 2,5% + 1,5% = 12,0%. Interpretasi: inilah 'garis merah versi bank sendiri' \u2014 modal di bawah ini = melanggar kebijakan internal, BUKAN (belum tentu) melanggar regulasi.",
      reference: "Target internal = Pilar 1 + buffer sendiri + add-on risiko non-Pilar 1.",
    },
    {
      id: "komponen",
      eyebrow: "Langkah 3 · Konsep",
      title: "Enam komponen ICAAP yang sehat",
      prose: [
        "Praktik internasional merumuskan enam komponen ICAAP yang sehat. Satu: board & senior management oversight — dewan komisaris menyetujui tujuan, asumsi utama, dan hasil ICAAP; tanpa ini ICAAP = dokumen staf tanpa pemilik. Dua: sound capital assessment & planning — perhitungan kebutuhan modal yang metodologinya jelas plus rencana permodalan 3-5 tahun ke depan (dividen, penerbitan modal, pertumbuhan aset).",
        "Tiga: comprehensive assessment of risks — identifikasi dan pengukuran SELURUH risiko material, termasuk yang di luar Pilar 1: konsentrasi, IRRBB, likuiditas, reputasi, strategik. Empat: stress testing — menguji kecukupan modal di bawah skenario buruk tetapi plausible, secara forward-looking. Lima: monitoring & reporting — pemantauan berkala posisi modal vs target, dilaporkan ke manajemen. Enam: internal control review — audit internal memastikan prosesnya berjalan sebagaimana dirancang, bukan sekadar di atas kertas.",
        "Stress testing layak dibedah karena ia 'mesin waktu' ICAAP. Idenya: proyeksikan rasio modal di bawah skenario adverse — laba turun (modal tergerus), NPL naik (ATMR naik karena bobot risiko memburuk), dan lihat apakah rasio masih di atas target internal. Bank yang lolos skenario normal tetapi jebol di skenario adverse = bank yang butuh buffer lebih tebal HARI INI, bukan saat krisis tiba.",
        "Rumus proyeksi di bawah menghitung CET1 ratio di bawah tekanan. Simbolnya sederhana; yang sulit adalah ASUMSINYA — seberapa besar kerugian skenario adverse? Di sinilah OJK menguji 'kewajaran skenario stress testing' saat SREP: skenario yang terlalu jinak = ICAAP yang tidak jujur.",
        "Dua miskonsepsi. Satu: 'ICAAP = dokumen tahunan untuk OJK.' Bukan — ia proses berkelanjutan: monitoring berkala, direview minimal tahunan atau saat ada trigger (akuisisi besar, perubahan model bisnis). Dokumen hanyalah potret sesaat dari proses yang hidup. Dua: 'Yang penting angkanya masuk akal.' OJK menilai PROSES dulu, angka kemudian: kesesuaian proses dengan ukuran dan kompleksitas bank, keakuratan data, kewajaran metode dan asumsi. Angka bagus dari proses buruk = temuan.",
        "Contoh konkret komponen 3 di Bank Artha Dana: eksposur properti Rp2 triliun dari total kredit Rp10 triliun (20%). Pilar 1 menghitung ATMR-nya dengan bobot risiko standar — selesai. ICAAP menanyakan lebih jauh: bagaimana bila harga properti jatuh 20%? Kerugian terkonsentrasi Rp400 miliar menggerus CET1 1 poin. Add-on 1,5% ditetapkan untuk risiko ini. Inilah nilai tambah ICAAP yang tidak bisa diberikan rumus generik Pilar 1.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CStress test kami lolos semua skenario.\u201D Cek dulu skenarionya: PDB turun 0,5% bukan stress test \u2014 itu proyeksi normal yang diberi nama dramatis. Skenario adverse yang kredibel membuat direksi tidak nyaman membacanya. Bila semua skenario terasa nyaman, skenarionya yang salah.",
      },
      hints: [
        "Enam komponen: oversight, assessment & planning, risk identification, stress test, monitoring, control review.",
        "Stress test = satu-satunya komponen yang melihat ke DEPAN; lima lainnya menilai hari ini.",
      ],
      formula: String.raw`\text{CET1}_{stres} = \frac{\text{Modal CET1} - \text{Kerugian skenario}}{\text{ATMR} \times (1 + g)} \times 100\%`,
      formulaNote: "CET1_stres = rasio CET1 di bawah skenario adverse (%). Modal CET1 = modal inti utama saat ini (Rp). Kerugian skenario = estimasi kerugian di bawah skenario adverse (Rp) \u2014 menggerus pembilang. ATMR = aset tertimbang menurut risiko saat ini (Rp). g = pertumbuhan ATMR di bawah stres (desimal; mis. 0,10 bila bobot risiko memburuk 10%) \u2014 menggelembungkan penyebut. Contoh: (50 \u2212 8) / (400 \u00D7 1,10) \u00D7 100% = 9,5%. Interpretasi: bila hasil di bawah target internal 12% = bank butuh buffer tambahan SEKARANG; stres bukan ramalan, melainkan uji ketahanan.",
      reference: "Stres = modal turun, ATMR naik. Lolos stres = buffer cukup hari ini.",
    },
    {
      id: "alur",
      eyebrow: "Langkah 4 · Konsep",
      title: "Alur ke regulator: ICAAP \u2192 SREP \u2192 keputusan",
      prose: [
        "Alurnya setahun sekali, ritmenya seperti audit. Bank menyusun (atau memutakhirkan) dokumen ICAAP: hasil identifikasi risiko, metodologi, asumsi, hasil stress test, target modal internal, dan capital plan. Dokumen disetujui dewan komisaris, lalu disampaikan ke OJK. OJK menjalankan SREP: mengkaji empat hal \u2014 (1) kecukupan pengawasan aktif dewan komisaris dan direksi; (2) kecukupan penilaian kecukupan modal; (3) kecukupan pemantauan dan pelaporan; (4) kecukupan pengendalian internal.",
        "Keluaran SREP ada tiga. Puas: ICAAP kredibel, tidak ada tindakan. Minta perbaikan: metodologi/asumsi/data harus diperbaiki dengan tenggat. Capital add-on: OJK menetapkan modal tambahan yang wajib dipenuhi \u2014 seperti yang dialami Bank Artha Dana (Rp400 miliar). Add-on bukan denda; ia modal yang tetap milik bank, tetapi tidak boleh dipakai untuk ekspansi atau dividen sampai risiko yang mendasarinya turun.",
        "Perbedaan Pilar 1 vs Pilar 2, ringkas dalam lima baris. Tujuan: P1 = lantai minimum seragam; P2 = kecukupan sesuai profil risiko spesifik. Metode: P1 = rumus standar/model yang disetujui; P2 = penilaian internal bank + uji regulator. Cakupan risiko: P1 = kredit, pasar, operasional; P2 = semua risiko material termasuk konsentrasi, IRRBB, likuiditas, reputasi. Sifat: P1 = backward/point-in-time; P2 = forward-looking (stress test, capital plan 3-5 tahun). Konsekuensi: P1 = pelanggaran = sanksi; P2 = add-on dan pembatasan distribusi modal.",
        "Apa yang disiapkan tim risk reporting? Empat paket. Satu: data input yang terekonsiliasi \u2014 angka ICAAP harus bisa dilacak ke laporan keuangan dan laporan risiko (lihat prinsip rekonsiliasi di RR24). Dua: dokumentasi asumsi \u2014 setiap angka proyeksi punya sumber dan alasan tertulis. Tiga: template hasil \u2014 ringkasan eksekutif untuk dewan: target vs aktual vs stres, dalam 2 halaman. Empat: jejak persetujuan \u2014 notulen dewan yang menyetujui ICAAP; tanpa ini, SREP menilai oversight dewan 'tidak cukup'.",
        "Dua miskonsepsi. Satu: 'SREP = OJK menghitung ulang angka kami.' Lebih dari itu: OJK menilai KUALITAS proses \u2014 apakah dewan terlibat, apakah data akurat, apakah asumsi wajar. Bank dengan angka konservatif tetapi proses asal-asalan tetap dapat temuan. Dua: 'Add-on = hukuman.' Bukan \u2014 ia penyangga yang melindungi bank itu sendiri. Bank yang proaktif menetapkan buffer internal via ICAAP justru jarang kena add-on, karena sudah melakukan sendiri apa yang regulator minta.",
        "Satu catatan karir: kemampuan 'bercerita tentang modal' \u2014 menjelaskan mengapa target internal bank 12% bukan 8%, dengan angka dan skenario \u2014 adalah keterampilan langka. Direksi butuh orang yang bisa menerjemahkan ICAAP menjadi keputusan bisnis: bisa ekspansi berapa, dividen berapa. Itulah kursi yang kamu incar.",
      ],
      tasks: [],
      note: {
        title: "\uD83D\uDCA1 Intuisi",
        body: "Anggap SREP seperti sidang skripsi: penguji (OJK) tidak hanya membaca kesimpulanmu, tetapi menguji apakah metodologimu tahan ditanya. Mahasiswa yang hanya menghafal kesimpulan gugur di pertanyaan kedua. Bank yang hanya 'mengisi template ICAAP' gugur dengan cara yang sama.",
      },
      hints: [
        "Empat cakupan SREP OJK: dewan, penilaian modal, pemantauan & pelaporan, pengendalian internal.",
        "Add-on = modal sendiri yang 'dikunci', bukan denda yang dibayar.",
      ],
      reference: "Bank menilai (ICAAP) \u2192 OJK menguji (SREP) \u2192 puas / perbaiki / add-on.",
    },
    {
      id: "lab-headroom",
      eyebrow: "Langkah 5 · Lab",
      title: "Menghitung capital headroom",
      prose: [
        "Bank Artha Dana: ATMR Rp400 triliun; modal CET1 Rp51,2 triliun (rasio 12,8%); target internal 12,0% (8,0 Pilar 1 + 2,5 buffer internal + 1,5 add-on konsentrasi). Hitung headroom: selisih rasio (dalam poin) dan dalam rupiah (selisih rasio \u00D7 ATMR) \u2014 'ruang napas' sebelum menyentuh garis merah internal.",
        "Hasil: 0,8 poin = Rp3,2 triliun. Interpretasi: bank boleh 'membakar' Rp3,2 triliun modal (rugi, ekspansi ATMR, atau dividen) sebelum melanggar kebijakan sendiri. Eksperimen: naikkan add-on konsentrasi menjadi 2,5% (target 13,0%) \u2014 headroom menjadi negatif. Apa artinya bagi rencana dividen direksi?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `target`, `headroom_poin`, dan `headroom_rp` (Rp triliun)" },
        { id: "t2", text: "Cetak ketiganya dengan format contoh" },
      ],
      expected: "Target internal: 12.0%\nHeadroom: 0.8 poin = Rp3.20 T",
      note: {
        title: "\uD83D\uDCA1 Intuisi",
        body: "Headroom dalam rupiah lebih 'nyata' bagi direksi daripada poin persentase. Rp3,2 triliun ruang napas terdengar konkret; 0,8 poin terdengar abstrak. Sajikan keduanya \u2014 poin untuk analis, rupiah untuk direksi.",
      },
      hints: [
        "target = p1 + buffer + addon.",
        "headroom_rp = selisih rasio (desimal) \u00D7 ATMR.",
      ],
      code: {
        starter: "# (Rp triliun, rasio desimal). JANGAN UBAH.\natmr, cet1 = 400, 51.2\np1, buffer, addon = 0.08, 0.025, 0.015\n\n# TULIS KODEMU: target internal, headroom poin & rupiah\ntarget = \nheadroom_poin = \nheadroom_rp = \nprint(f\"Target internal: {target*100:.1f}%\")\nprint(f\"Headroom: {headroom_poin*100:.1f} poin = Rp{headroom_rp:.2f} T\")\n",
        lockLines: 7,
        solution: "# (Rp triliun, rasio desimal). JANGAN UBAH.\natmr, cet1 = 400, 51.2\np1, buffer, addon = 0.08, 0.025, 0.015\n\n# TULIS KODEMU: target internal, headroom poin & rupiah\ntarget = p1 + buffer + addon\nheadroom_poin = cet1 / atmr - target\nheadroom_rp = headroom_poin * atmr\nprint(f\"Target internal: {target*100:.1f}%\")\nprint(f\"Headroom: {headroom_poin*100:.1f} poin = Rp{headroom_rp:.2f} T\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "Target 12%", msg: "0,08+0,025+0,015.", name: "target", value: 0.12, tol: 1e-9 },
          { kind: "equal", task: "t1", label: "Headroom 0.8 poin", msg: "12,8% \u2212 12,0%.", name: "headroom_poin", value: 0.008, tol: 1e-9 },
          { kind: "equal", task: "t1", label: "Headroom Rp3.2 T", msg: "0,008 \u00D7 400.", name: "headroom_rp", value: 3.2, tol: 1e-9 },
          { kind: "stdout_matches", task: "t2", label: "Cetak headroom", msg: "Cetak target dan headroom.", pattern: "Headroom: 0.8 poin = Rp3.20 T" },
        ],
      },
      reference: "Headroom = (CET1 aktual \u2212 target) \u00D7 ATMR. Negatif = rem dividen.",
    },
    {
      id: "lab-stres",
      eyebrow: "Langkah 6 · Lab",
      title: "Uji stres: apakah buffer cukup?",
      prose: [
        "Skenario adverse Artha Dana: kerugian Rp8 triliun (properti jatuh), ATMR naik 10% (bobot risiko memburuk). Modal CET1 awal Rp51,2 T, ATMR Rp400 T, target internal 12,0%. Hitung CET1 ratio di bawah stres dan tentukan status: 'AMAN' bila \u2265 target, 'TAMBAH BUFFER' bila di bawah.",
        "Hasil: (51,2 \u2212 8)/(400 \u00D7 1,1) = 9,8% \u2192 TAMBAH BUFFER. Bank yang terlihat aman di 12,8% ternyata jebol 2,2 poin di bawah target saat stres \u2014 inilah gunanya ICAAP: menemukan kebutuhan modal SEBELUM krisis, bukan saat krisis. Eksperimen: turunkan kerugian menjadi Rp4 T \u2014 berapa rasionya? Sensitivitas terhadap asumsi inilah yang diuji OJK.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `cet1_stres` (%)" },
        { id: "t2", text: "Tentukan `status` dan cetak keduanya" },
      ],
      expected: "CET1 stres: 9.8%\nStatus: TAMBAH BUFFER",
      note: {
        title: "\uD83D\uDCA1 Intuisi",
        body: "Satu skenario stres yang jujur lebih berharga dari sepuluh skenario yang jinak. Kalau hasil stres selalu 'AMAN', bukan banknya yang kuat \u2014 skenarionya yang lemah.",
      },
      hints: [
        "Pembilang berkurang (rugi), penyebut bertambah (ATMR naik).",
        "Bandingkan hasil dengan target untuk status.",
      ],
      code: {
        starter: "# (Rp triliun). JANGAN UBAH.\ncet1, atmr = 51.2, 400\nrugi, g = 8, 0.10\ntarget = 12.0\n\n# TULIS KODEMU: CET1 di bawah stres + status\ncet1_stres = \nstatus = \nprint(f\"CET1 stres: {cet1_stres:.1f}%\")\nprint(f\"Status: {status}\")\n",
        lockLines: 7,
        solution: "# (Rp triliun). JANGAN UBAH.\ncet1, atmr = 51.2, 400\nrugi, g = 8, 0.10\ntarget = 12.0\n\n# TULIS KODEMU: CET1 di bawah stres + status\ncet1_stres = (cet1 - rugi) / (atmr * (1 + g)) * 100\nstatus = \"AMAN\" if cet1_stres >= target else \"TAMBAH BUFFER\"\nprint(f\"CET1 stres: {cet1_stres:.1f}%\")\nprint(f\"Status: {status}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "CET1 stres 9.8", msg: "(51,2\u22128)/(400\u00D71,1) \u00D7 100.", name: "cet1_stres", value: 9.8181818, tol: 0.05 },
          { kind: "equal", task: "t2", label: "Status TAMBAH BUFFER", msg: "9,8 < target 12.", name: "status", value: "TAMBAH BUFFER" },
          { kind: "stdout_matches", task: "t2", label: "Cetak status", msg: "Cetak rasio dan status.", pattern: "Status: TAMBAH BUFFER" },
        ],
      },
      reference: "Stres = (modal \u2212 rugi) / (ATMR \u00D7 (1+g)). Di bawah target = tambah buffer.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Lima skenario, lima respons",
      prose: [
        "Satu: headroom tebal (>2 poin) dan lolos stres \u2192 EKSPANSI DIPERBOLEHKAN. Modal berlebih = kapasitas tumbuh; direksi boleh menyetujui kredit baru atau dividen. Dua: headroom tipis (<1 poin) tetapi lolos stres \u2192 TAHAN. Tunda dividen ekstra dan ekspansi agresif; prioritaskan laba ditahan untuk menebalkan buffer.",
        "Tiga: gagal stres (di bawah target) \u2192 CAPITAL PLAN. Opsi: tahan dividen, terbitkan modal (rights issue/AT1), atau turunkan ATMR (kurangi eksposur berisiko). Rencana wajib punya tenggat dan pemilik \u2014 'akan kami pertimbangkan' bukan rencana.",
        "Empat: OJK menetapkan add-on via SREP \u2192 PATUHI + PERBAIKI AKAR. Penuhi add-on-nya, tetapi jangan berhenti di situ: perbaiki komponen ICAAP yang dinilai lemah (biasanya asumsi stres atau data), agar add-on bisa ditinjau turun tahun depan. Add-on yang dibiarkan permanen = pajak tahunan atas ICAAP yang buruk.",
        "Lima: data tidak lengkap / tidak terekonsiliasi \u2192 JANGAN AJUKAN DULU. ICAAP dengan angka yang tidak bisa dilacak = undangan temuan SREP. Tunda pengajuan, bereskan data \u2014 keterlambatan yang dijelaskan lebih murah daripada temuan formal.",
        "Aturan praktis 10 detik: hitung headroom \u2192 jalankan stres \u2192 bandingkan dengan target \u2192 putuskan ekspansi / tahan / capital plan. Tiga angka, satu keputusan \u2014 inilah dashboard modal yang seharusnya ada di meja direksi tiap kuartal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jadikan peta ini template memo kuartalan ke direksi: posisi headroom, hasil stres, rekomendasi. Konsistensi format = direksi belajar membaca dalam 2 menit = keputusan modal diambil cepat saat dibutuhkan.",
      },
      reference: "Headroom \u2192 stres \u2192 vs target \u2192 ekspansi / tahan / capital plan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Artha Dana: memo ke direksi",
      prose: [
        "Data ICAAP Bank Artha Dana (Rp triliun): ATMR 400; CET1 51,2 (12,8%); target internal 12,0% (8,0 + 2,5 + 1,5 konsentrasi properti); skenario adverse: rugi 8, ATMR +10%; rencana direksi: dividen Rp2 triliun + ekspansi kredit Rp30 triliun (ATMR +Rp24 triliun).",
        "Pertanyaan: (a) Berapa headroom saat ini? (b) Apakah bank lolos stres? (c) Bisakah kedua rencana direksi jalan bersamaan? Pembahasan: (a) Headroom 0,8 poin = Rp3,2 T (lihat lab 1). (b) Tidak \u2014 CET1 stres 9,8%, di bawah target 12% (lihat lab 2). (c) Tidak: dividen Rp2 T menggerus headroom menjadi Rp1,2 T; ekspansi menambah ATMR Rp24 T yang menurunkan rasio aktual ke 51,2/424 = 12,08% \u2014 nyaris menyentuh target SEBELUM stres. Kombinasi keduanya = melanggar kebijakan internal sendiri. Rekomendasi memo: pilih SATU \u2014 dividen ditunda sampai buffer internal terpenuhi pasca-stres, atau ekspansi diperkecil. Bank yang disiplin pada targetnya sendiri tidak akan kaget saat OJK datang.",
        "Pelajaran mini-case: ICAAP mengubah diskusi direksi dari 'CAR kita 16%, aman' menjadi 'stres menunjukkan 9,8% vs target 12% \u2014 kita defisit 2,2 poin'. Angka yang sama, bingkai yang berbeda, keputusan yang berbeda. Inilah fungsi ICAAP sebagai alat manajemen, bukan sekadar dokumen kepatuhan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan cara memo ini ditulis: setiap klaim punya angka, setiap angka punya sumber (lab 1, lab 2). Memo modal tanpa angka yang bisa diverifikasi = opini. Direksi butuh analis yang memberi angka, bukan opini.",
      },
      reference: "Bingkai ICAAP mengubah 'aman' menjadi 'defisit 2,2 poin' \u2014 keputusan berubah.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor \u2265 4 dari 5.",
      ],
      summary: [
        "Pilar 2 = Supervisory Review Process: bank menilai sendiri via ICAAP, OJK mengkaji via SREP \u2014 dasar hukum capital add-on ada di prinsip 3 & 4 Basel.",
        "ICAAP mengisi lubang Pilar 1: risiko konsentrasi, IRRBB, likuiditas, reputasi, strategik \u2014 dihitung dari profil risiko bank itu sendiri, bukan rumus generik.",
        "Enam komponen ICAAP sehat: oversight dewan, assessment & planning, identifikasi risiko menyeluruh, stress testing, monitoring & reporting, internal control review.",
        "Target modal internal = Pilar 1 + buffer internal + add-on risiko non-Pilar 1; headroom = (aktual \u2212 target) \u00D7 ATMR \u2014 negatif berarti rem dividen/ekspansi.",
        "SREP OJK mengkaji 4 hal (dewan, penilaian modal, pemantauan & pelaporan, pengendalian internal) \u2014 keluarannya: puas, minta perbaikan, atau capital add-on.",
      ],
      quiz: [
        {
          q: "Bank CAR 16% (minimum 8%) tetapi OJK menetapkan capital add-on. Penjelasan yang tepat:",
          options: [
            { text: "Pilar 1 hanya lantai minimum; SREP menilai kecukupan vs profil risiko dan boleh mewajibkan modal lebih", why: "Benar: prinsip 3 & 4 SRP Basel memberi wewenang ini.", correct: true },
            { text: "OJK salah hitung", why: "Add-on adalah wewenang resmi, bukan kesalahan hitung." },
            { text: "CAR 16% sebenarnya di bawah minimum", why: "16% jelas di atas 8%; masalahnya bukan Pilar 1." },
            { text: "Bank harus menurunkan CAR-nya", why: "Terbalik: add-on = tambah modal, bukan kurangi." },
          ],
        },
        {
          q: "Risiko yang menjadi alasan utama ICAAP ada (tidak tercakup memadai di Pilar 1):",
          options: [
            { text: "Risiko konsentrasi, IRRBB, likuiditas, reputasi", why: "Benar: inilah lubang Pilar 1 yang diisi ICAAP.", correct: true },
            { text: "Risiko kredit debitur individual", why: "Itu justru inti Pilar 1." },
            { text: "Risiko operasional", why: "Risiko operasional sudah di Pilar 1." },
            { text: "Risiko pasar trading book", why: "Sudah di Pilar 1." },
          ],
        },
        {
          q: "Target internal = 8% + 2,5% + 1,5% = 12%; CET1 aktual 12,8%; ATMR Rp400 T. Headroom:",
          options: [
            { text: "0,8 poin = Rp3,2 T", why: "Benar: (12,8%\u221212%) \u00D7 400 = 3,2.", correct: true },
            { text: "4,8 poin = Rp19,2 T", why: "Itu selisih vs minimum 8% \u2014 bukan vs target internal." },
            { text: "Rp51,2 T", why: "Itu total CET1, bukan ruang napas." },
            { text: "Negatif", why: "12,8% masih di atas target 12%." },
          ],
        },
        {
          q: "CET1 Rp51,2 T, ATMR Rp400 T; stres: rugi Rp8 T, ATMR +10%; target 12%. Hasil dan status:",
          options: [
            { text: "9,8% \u2192 TAMBAH BUFFER", why: "Benar: (51,2\u22128)/(400\u00D71,1) = 9,8% < 12%.", correct: true },
            { text: "12,8% \u2192 AMAN", why: "Itu rasio SAAT INI, bukan di bawah stres." },
            { text: "10,8% \u2192 AMAN", why: "Salah hitung: pembilang juga berkurang karena rugi." },
            { text: "9,8% \u2192 AMAN karena di atas 8%", why: "Patokannya target internal 12%, bukan minimum 8%." },
          ],
        },
        {
          q: "Cakupan kaji ulang SREP oleh OJK atas ICAAP bank:",
          options: [
            { text: "Pengawasan dewan, penilaian kecukupan modal, pemantauan & pelaporan, pengendalian internal", why: "Benar: empat cakupan resmi SREP OJK.", correct: true },
            { text: "Hanya angka CAR akhir", why: "SREP menilai KUALITAS proses, bukan cuma angka." },
            { text: "Hanya laporan keuangan", why: "SREP = kaji ulang ICAAP, jauh lebih luas." },
            { text: "Tidak ada \u2014 ICAAP urusan internal bank", why: "Justru SREP adalah sisi regulator dari Pilar 2." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CICAAP sudah diserahkan ke OJK \u2014 selesai.\u201D Penyerahan = awal, bukan akhir. SREP bisa meminta perbaikan atau menetapkan add-on berbulan-bulan setelahnya. Siapkan tim untuk putaran klarifikasi \u2014 bank yang responsif mendapat penilaian proses yang lebih baik.",
      },
      hints: [
        "Uji cepat: target 12%, aktual 12,8%, ATMR 400 \u2014 headroom rupiah? (3,2 T)",
        "Ingat: ICAAP = bank menilai; SREP = OJK menguji.",
      ],
      reference: "ICAAP yang kredibel = add-on yang tidak perlu.",
    },
  ],
};
