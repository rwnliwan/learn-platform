import type { V2Lesson } from "../lib/types";

const FIG_ERM = `<svg viewBox="0 0 480 300" role="img" aria-label="Kerangka ERM: dari appetite ke laporan.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">ERM: satu atap untuk semua risiko</text>
<rect x="150" y="50" width="180" height="40" rx="8" fill="var(--chart-text)" opacity="0.18" stroke="var(--chart-text)" stroke-width="2"/>
<text x="240" y="75" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Risk Appetite</text>
<text x="240" y="115" font-size="14" fill="var(--chart-text)" text-anchor="middle">↓</text>
<rect x="40" y="130" width="120" height="50" rx="8" fill="var(--c1)" opacity="0.3"/>
<text x="100" y="152" font-size="11" fill="var(--chart-text)" text-anchor="middle">Kredit</text>
<text x="100" y="170" font-size="10" fill="var(--chart-text)" text-anchor="middle">NPL, ECL</text>
<rect x="180" y="130" width="120" height="50" rx="8" fill="var(--c3)" opacity="0.3"/>
<text x="240" y="152" font-size="11" fill="var(--chart-text)" text-anchor="middle">Pasar</text>
<text x="240" y="170" font-size="10" fill="var(--chart-text)" text-anchor="middle">VaR, stress</text>
<rect x="320" y="130" width="120" height="50" rx="8" fill="var(--c4)" opacity="0.3"/>
<text x="380" y="152" font-size="11" fill="var(--chart-text)" text-anchor="middle">Operasional</text>
<text x="380" y="170" font-size="10" fill="var(--chart-text)" text-anchor="middle">KRI, loss</text>
<text x="240" y="205" font-size="14" fill="var(--chart-text)" text-anchor="middle">↓</text>
<rect x="120" y="220" width="240" height="44" rx="8" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="240" y="247" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Dashboard Terintegrasi</text>
</g>
</svg>`;

export const rr23: V2Lesson = {
  slug: "rr23-erm-terintegrasi",
  track: "Risk Reporting",
  module: "Enterprise Risk",
  title: "RR23 — ERM Terintegrasi: Satu Atap untuk Semua Risiko",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Krisis yang tidak terlihat siapa-siapa",
      prose: [
        "Maret 2020: pandemi menghantam. Di Bank Nusantara, tim kredit melaporkan NPL naik; tim pasar melaporkan VaR jebol; tim likuiditas melaporkan LCR turun; tim operasional melaporkan fraud naik. Empat laporan, empat rapat, empat rencana — tidak ada yang menjumlahkannya. Direksi bertanya: 'Berapa TOTAL risiko kita?' Tidak ada yang bisa menjawab.",
        "Tiga lini pertahanan dalam cerita ini: lini 1 (bisnis) sibuk memadamkan api masing-masing; lini 2 (risk) punya empat laporan yang tidak berbicara satu sama lain; lini 3 (audit) akan datang 6 bulan kemudian dan bertanya mengapa tidak ada agregasi. ERM yang baik memastikan pertanyaan direksi \u2018berapa total risiko kita\u2019 bisa dijawab dalam 1 halaman \u2014 kapan pun ditanya.",
        "Satu detail operasional: siapa yang menyusun dashboard terintegrasi? Bukan komite \u2014 komite memutuskan. Penyusunnya adalah fungsi ERM (biasanya di bawah CRO) yang mengumpulkan metrik dari tiap unit risiko, memvalidasi, lalu menyajikan. Tanpa fungsi ini, \u2018laporan terintegrasi\u2019 = menempelkan empat laporan dengan staples. Integrasi butuh pemilik, bukan staples.",
        "Twist-nya: setiap tim benar di wilayahnya, tetapi bank hampir salah secara keseluruhan. Risiko berkorelasi — kredit macet menggerus modal, modal tergerus menaikkan biaya dana, biaya dana naik menekan likuiditas. ERM (Enterprise Risk Management) adalah disiplin yang menjumlahkan semuanya: satu appetite, satu bahasa, satu dashboard. Setelah lesson ini kamu bisa: (1) menjelaskan kerangka ERM (COSO/ISO 31000); (2) membaca risk appetite statement; (3) memeriksa breach appetite; (4) menghitung skor risiko terintegrasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "OJK mewajibkan bank menerapkan manajemen risiko terintegrasi (POJK 18/2016 untuk konglomerasi keuangan + POJK 8/2023 untuk AFC). ERM bukan pilihan — ia kewajiban regulasi. Analis yang paham ERM = analis yang paham bahasa direksi.",
      },
      reference: "Risiko berkorelasi. ERM = satu appetite, satu bahasa, satu dashboard.",
    },
    {
      id: "kerangka",
      eyebrow: "Langkah 2 · Konsep",
      title: "COSO & ISO 31000: anatomi ERM",
      prose: [
        "Dua kerangka acuan global. COSO ERM: governance & budaya → strategi & penetapan tujuan → kinerja (identifikasi, penilaian, respons) → review → informasi & komunikasi. ISO 31000: prinsip → kerangka → proses (komunikasi, ruang lingkup, penilaian, perlakuan, pemantauan). Keduanya sepakat pada intinya: risiko dikelola sebagai SISTEM, bukan sebagai kumpulan silo.",
        "Komponen yang wajib ada: (1) risk appetite statement — berapa banyak risiko yang BERANI diambil; (2) risk taxonomy — kamus risiko bersama; (3) three lines of defence — bisnis (pemilik), risk/compliance (pengawas), audit (penjamin); (4) pelaporan terintegrasi — dashboard yang menjumlahkan. Tanpa salah satunya, ERM = dokumen, bukan sistem.",
        "Tiga miskonsepsi. Satu: 'ERM = departemen risk.' ERM = cara seluruh organisasi mengambil keputusan — departemen risk hanya orkestranya. Dua: 'ERM menghilangkan silo.' Tidak — silo keahlian tetap perlu; ERM menjembatani, bukan menghapus. Tiga: 'ERM = menghindari risiko.' ERM = mengambil risiko yang DIPAHAMI dalam batas yang DISETUJUI. Bank yang tidak berani ambil risiko = bank yang tidak menghasilkan.",
        "Kematangan ERM empat level: level 1 \u2018dokumen\u2019 (kerangka tertulis, tidak dipakai); level 2 \u2018pemantauan\u2019 (dashboard ada, dibaca); level 3 \u2018keputusan\u2019 (appetite menghentikan/menyetujui deal nyata); level 4 \u2018budaya\u2019 (setiap manajer berpikir risiko tanpa disuruh). Kebanyakan organisasi di level 1-2. Target realistis: naik satu level per 2 tahun \u2014 dan ukur dengan pertanyaan \u2018kapan terakhir ERM mengubah keputusan?\u2019.",
        "Contoh nyata level 3: komite kredit menolak pembiayaan Rp2 triliun ke sektor properti BUKAN karena NPL-nya tinggi, melainkan karena akan menaikkan skor ERM agregat melewati appetite. Keputusan yang merujuk appetite secara eksplisit \u2014 itulah ERM level 3. Dokumentasikan keputusan seperti ini; ia adalah bukti kematangan untuk regulator.",
      ],
      figure: {
        svg: FIG_ERM,
        alt: "Kerangka ERM: dari appetite ke laporan.",
        caption: "Satu appetite mengalir ke semua jenis risiko, bermuara di satu dashboard.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kami sudah ERM — ada komite risiko.” Komite tanpa appetite statement yang operasional = forum diskusi. Ujinya: bisakah komite menunjukkan SATU angka batas yang bila dilewati memicu tindakan otomatis?",
      },
      hints: [
        "Hafalkan three lines: 1st = bisnis, 2nd = risk/compliance, 3rd = audit.",
        "ERM yang hidup = keputusan bisnis merujuk appetite. Tanya: kapan terakhir appetite menghentikan sebuah deal?",
      ],
      reference: "Appetite + taksonomi + 3 lini + laporan = ERM.",
    },
    {
      id: "appetite",
      eyebrow: "Langkah 3 · Konsep",
      title: "Risk appetite: selera yang tertulis",
      prose: [
        "Risk appetite statement (RAS) adalah dokumen direksi yang menyatakan: risiko apa yang diambil, berapa banyak, dan dalam bentuk apa. Contoh: 'NPL < 4%, VaR < Rp150 M, LCR > 120%, tidak ada toleransi untuk fraud internal.' RAS yang baik: KUANTITATIF (ada angkanya), CASCADING (diturunkan ke limit per unit), dan DIPANTAU (breach memicu eskalasi otomatis).",
        "Hierarki: appetite (direksi, umum) → tolerance (batas operasional per risiko) → limit (batas harian per desk). Breach limit = desk berhenti; breach tolerance = eskalasi ke direksi; breach appetite = krisis tata kelola. Setiap level punya pemilik dan respons.",
        "Dua miskonsepsi. Satu: 'Appetite = target.' Bukan — target = yang diinginkan (laba), appetite = risiko yang DITERIMA untuk mencapainya. Keduanya bisa konflik: target laba tinggi + appetite ketat = tidak konsisten. Dua: 'Appetite statis.' Appetite ditinjau tiap tahun atau saat kondisi berubah drastis — dokumen mati = tata kelola mati.",
        "Contoh RAS mini untuk bank menengah: \u2018NPL gross di bawah 4 persen; VaR 99 persen 1-hari di bawah Rp150 miliar; LCR di atas 120 persen; tidak ada toleransi terhadap fraud internal (nol kejadian); eksposur single obligor di bawah 15 persen modal.\u2019 Lima kalimat, lima angka, lima pemicu eskalasi. Inilah yang dimaksud kuantitatif \u2014 bukan \u2018risiko rendah\u2019 yang tidak bisa diuji.",
        "Mekanisme eskalasi yang konkret: breach limit desk \u2192 desk head menghentikan aktivitas baru dan melapor ke CRO dalam 1x24 jam; breach tolerance \u2192 CRO melapor ke komite risiko direksi dengan rencana pemulihan 30 hari; breach appetite \u2192 direksi membahas dalam rapat luar biasa, OJK dinotifikasi bila diwajibkan. Tiga level, tiga kecepatan, tiga pemilik. Tulis ini di RAS \u2014 bukan di tempat lain.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Appetite kami: risiko rendah.” Itu bukan appetite — itu harapan. Appetite tanpa angka = tidak bisa dipantau = tidak ada. Setiap pernyataan appetite harus bisa diuji dengan data.",
      },
      hints: [
        "Uji RAS: untuk tiap kalimat, tanya 'bagaimana mengukurnya?' — bila tidak bisa, tulis ulang.",
        "Perhatikan arah: NPL/VaR lower-better; LCR/CAR higher-better. Salah arah = breach terbalik.",
      ],
      reference: "Appetite kuantitatif → tolerance → limit. Breach = eskalasi.",
    },
    {
      id: "agregasi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Agregasi: menjumlahkan yang tak sejenis",
      prose: [
        "Tantangan ERM: NPL (%), VaR (Rp), KRI (skor), LCR (%) — bagaimana menjumlahkan apel dan jeruk? Tiga pendekatan: (1) skor ternormalisasi — ubah semua ke skala 0-100 lalu bobot (seperti lab kedua); (2) modal ekonomi — ubah semua ke kebutuhan modal (bahasa umum); (3) skenario terintegrasi — satu skenario makro menghantam SEMUA jenis risiko sekaligus (paling kuat, paling sulit).",
        "Korelasi antar risiko adalah intinya: dalam krisis, kredit + pasar + likuiditas memburuk BERSAMAAN. Agregasi yang mengasumsikan independen = meremehkan. Praktik terbaik: agregasi dasar + overlay korelasi stres (asumsikan korelasi naik saat krisis).",
        "Dua miskonsepsi. Satu: 'Skor 0-100 itu ilmiah.' Skor = alat komunikasi, bukan pengukuran presisi — kejujuran tentang bobot (mengapa kredit 40%?) lebih penting dari angkanya. Dua: 'Agregasi menggantikan laporan detail.' Tidak — dashboard terintegrasi untuk direksi, laporan detail untuk pemilik risiko. Dua level, dua kebutuhan.",
        "Kaitan ke ICAAP: skor ERM 0-100 adalah bahasa komunikasi; kebutuhan modal adalah bahasa keputusan. Bank yang matang menerjemahkan keduanya: skor TINGGI pada risiko kredit = alokasi modal lebih besar + limit lebih ketat. Jembatan skor-modal inilah yang membuat ERM \u2018nyata\u2019 bagi direksi \u2014 karena modal adalah uang, dan uang selalu didengarkan.",
        "Satu peringatan: jangan agregasi risiko yang tidak sebanding. Risiko reputasi dan risiko strategik sulit dikuantifikasi \u2014 memaksakannya ke skor 0-100 menghasilkan angka palsu yang presisi. Untuk risiko kualitatif, gunakan penilaian naratif terstruktur (tinggi/sedang/rendah + justifikasi) di samping skor kuantitatif. Kejujuran metodologi: tidak semua bisa diangkakan, dan itu tidak apa-apa.",
        "Praktik pelaporan berlapis yang konkret: lapis 1 (dewan komisaris/direksi, 1 halaman) \u2014 skor agregat, status appetite (OK/breach), 3 risiko terbesar, tren kuartal; lapis 2 (komite risiko, 5 halaman) \u2014 per jenis risiko + rencana aksi; lapis 3 (pemilik risiko, detail penuh) \u2014 metrik granular + KRI + loss data. Satu sumber data, tiga penyajian. Jangan kirim lapis 3 ke direksi \u2014 mereka tidak akan membacanya dan akan berhenti membaca semuanya.",
        "Refleksi karir: ERM adalah \u2018bahasa direksi\u2019. Analis yang hanya bisa bicara VaR atau NPL berbicara ke sesama analis; analis yang bisa menjelaskan skor terintegrasi, appetite, dan trade-off risiko-imbal hasil berbicara ke pengambil keputusan. Kuasai lesson ini dan kamu naik satu level percakapan \u2014 dari teknis ke strategis.",
        "Satu prinsip penutup: ERM yang baik tidak membuat organisasi takut risiko \u2014 ia membuat organisasi JUJUR tentang risiko. Kejujuran itu memungkinkan pengambilan risiko yang lebih cerdas, bukan lebih sedikit. Bank dengan ERM matang bukan bank yang paling aman; ia bank yang paling tahu persis seberapa berisiko dirinya.",
        "Mulai dari mana minggu depan: pilih SATU metrik appetite yang belum dipantau otomatis, dan buat pemeriksa sederhananya (seperti lab pertama). Satu metrik yang hidup lebih berharga dari dokumen ERM 100 halaman yang mati. Itulah perbedaan antara ERM sebagai sistem dan ERM sebagai slogan. Pilih sistemnya, bukan slogannya \u2014 mulai minggu ini.",
        "Satu metrik untuk mengukur dirimu sendiri setelah lesson ini: bisakah kamu menjelaskan risk appetite bank tempatmu bekerja (atau bank impianmu) dalam 3 kalimat? Bila tidak, itulah pekerjaan rumah pertamamu \u2014 cari dokumennya, baca, dan uji dengan pertanyaan lesson ini.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "ICAAP (Internal Capital Adequacy Assessment Process) adalah wujud agregasi tertinggi: bank menghitung KEBUTUHAN MODAL total dari semua risiko. Dashboard ERM yang baik 'berbicara' dengan ICAAP — bahasa modal adalah bahasa yang dipahami direksi dan regulator.",
      },
      hints: [
        "Mulai dari skor terbobot — sederhana, komunikatif, cukup untuk direksi.",
        "Dokumentasikan bobot + alasannya; tinjau tiap tahun.",
      ],
      formula: String.raw`\text{Skor ERM} = \sum_i w_i \times s_i`,
      formulaNote: "w_i = bobot jenis risiko i (jumlah = 1); s_i = skor 0-100 jenis risiko i. Contoh lab: 0,4x65 + 0,25x45 + 0,2x70 + 0,15x30 = 55,8 = SEDANG. Interpretasi: bobot mencerminkan kontribusi modal/pendapatan tiap jenis risiko \u2014 bukan angka sembarang. Ubah bobot = ubah pernyataan tentang apa yang penting bagi bank.",
      reference: "Normalisasi → bobot → agregasi. Korelasi stres jangan lupa.",
    },
    {
      id: "lab-appetite",
      eyebrow: "Langkah 5 · Lab",
      title: "Pemeriksa breach risk appetite",
      prose: [
        "Empat metrik vs batas appetite-nya. Perhatikan ARAHNYA: NPL, VaR, dan rugi operasional lower-better (breach bila MELEBIHI batas); LCR higher-better (breach bila DI BAWAH batas). Salah arah = kesimpulan terbalik.",
        "Hasilnya: hanya VaR yang breach — tetapi SATU breach appetite = eskalasi ke direksi. Eksperimen: ubah LCR menjadi 110 — kini dua breach. Inilah gunanya pemeriksa otomatis: direksi tahu dalam hitungan detik, bukan kuartal berikutnya.",
      ],
      tasks: [
        { id: "t1", text: "Tentukan status OK/BREACH tiap metrik sesuai arahnya" },
        { id: "t2", text: "Cetak hasilnya" },
      ],
      expected: "NPL %: 3.2 vs batas 4.0 -> OK\nVaR RpM: 180 vs batas 150 -> BREACH\nLCR %: 135 vs batas 120 -> OK\nRugi op RpM: 90 vs batas 100 -> OK",
      note: {
        title: "💡 Intuisi",
        body: "Appetite tanpa pemantauan = resolusi tahun baru: ditulis Januari, dilupakan Februari. Pemeriksa otomatis = alarm yang memastikan appetite tetap hidup.",
      },
      hints: [
        "Gunakan dict arah: 'rendah' vs 'tinggi'.",
        "rendah: breach bila aktual > batas; tinggi: breach bila aktual < batas.",
      ],
      code: {
        starter: "# (metrik, aktual, batas). JANGAN UBAH.\nappetite = [(\"NPL %\", 3.2, 4.0), (\"VaR RpM\", 180, 150), (\"LCR %\", 135, 120), (\"Rugi op RpM\", 90, 100)]\narah = {\"NPL %\": \"rendah\", \"VaR RpM\": \"rendah\", \"LCR %\": \"tinggi\", \"Rugi op RpM\": \"rendah\"}\n\n# TULIS KODEMU: status sesuai arah\nfor nama, aktual, batas in appetite:\n    if arah[nama] == \"rendah\":\n        status = \n    else:\n        status = \n    print(f\"{nama}: {aktual} vs batas {batas} -> {status}\")\n",
        lockLines: 8,
        solution: "# (metrik, aktual, batas). JANGAN UBAH.\nappetite = [(\"NPL %\", 3.2, 4.0), (\"VaR RpM\", 180, 150), (\"LCR %\", 135, 120), (\"Rugi op RpM\", 90, 100)]\narah = {\"NPL %\": \"rendah\", \"VaR RpM\": \"rendah\", \"LCR %\": \"tinggi\", \"Rugi op RpM\": \"rendah\"}\n\n# TULIS KODEMU: status sesuai arah\nfor nama, aktual, batas in appetite:\n    if arah[nama] == \"rendah\":\n        status = \"BREACH\" if aktual > batas else \"OK\"\n    else:\n        status = \"BREACH\" if aktual < batas else \"OK\"\n    print(f\"{nama}: {aktual} vs batas {batas} -> {status}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "VaR BREACH", msg: "180 > 150.", pattern: "VaR RpM: 180 vs batas 150 -> BREACH" },
          { kind: "stdout_matches", task: "t1", label: "LCR OK", msg: "135 > 120 (higher-better).", pattern: "LCR %: 135 vs batas 120 -> OK" },
          { kind: "stdout_matches", task: "t1", label: "NPL OK", msg: "3.2 < 4.0.", pattern: "NPL %: 3.2 vs batas 4.0 -> OK" },
        ],
      },
      reference: "Arah menentukan arti breach. Otomatiskan pemantauan.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 6 · Lab",
      title: "Skor risiko terintegrasi",
      prose: [
        "Empat jenis risiko dengan skor 0-100 dan bobot. Hitung skor terintegrasi = jumlah skor×bobot; kategorikan: <40 RENDAH, <65 SEDANG, ≥65 TINGGI. Cetak kontribusi tiap jenis — transparansi bobot adalah kejujuran metodologi.",
        "Hasil: 55,8 = SEDANG. Perhatikan: dua risiko individual TINGGI (kredit 65, operasional 70) tetapi agregat SEDANG — diversifikasi antar jenis risiko. Eksperimen: naikkan bobot operasional ke 0,4 (dan turunkan kredit ke 0,2) — apa kategorinya? Bobot = keputusan kebijakan; dokumentasikan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor terintegrasi = Σ skor*bobot + kategorinya" },
        { id: "t2", text: "Cetak skor, kategori, dan kontribusi tiap jenis" },
      ],
      expected: "Skor terintegrasi: 55.8 -> SEDANG\n  Kredit: 65 x 0.4 = 26.0\n  Pasar: 45 x 0.25 = 11.2\n  Operasional: 70 x 0.2 = 14.0\n  Likuiditas: 30 x 0.15 = 4.5",
      note: {
        title: "💡 Intuisi",
        body: "Satu angka 55,8 yang bisa dijelaskan ('kredit 26 + pasar 11,2 + ...') = alat komunikasi direksi. Satu angka tanpa rincian = angka mistis. Selalu tampilkan kontribusinya.",
      },
      hints: [
        "total = sum(s*w for _, s, w in risiko).",
        "Kategori: <40 RENDAH, <65 SEDANG, else TINGGI.",
      ],
      code: {
        starter: "# (jenis, skor 0-100, bobot). JANGAN UBAH.\nrisiko = [(\"Kredit\", 65, 0.4), (\"Pasar\", 45, 0.25), (\"Operasional\", 70, 0.2), (\"Likuiditas\", 30, 0.15)]\n\n# TULIS KODEMU: agregasi + kategori + kontribusi\ntotal = \nkat = \"RENDAH\" if total < 40 else (\"SEDANG\" if total < 65 else \"TINGGI\")\nprint(f\"Skor terintegrasi: {total:.1f} -> {kat}\")\nfor nama, s, w in risiko:\n    print(f\"  {nama}: {s} x {w} = {s*w:.1f}\")\n",
        lockLines: 8,
        solution: "# (jenis, skor 0-100, bobot). JANGAN UBAH.\nrisiko = [(\"Kredit\", 65, 0.4), (\"Pasar\", 45, 0.25), (\"Operasional\", 70, 0.2), (\"Likuiditas\", 30, 0.15)]\n\n# TULIS KODEMU: agregasi + kategori + kontribusi\ntotal = sum(s * w for _, s, w in risiko)\nkat = \"RENDAH\" if total < 40 else (\"SEDANG\" if total < 65 else \"TINGGI\")\nprint(f\"Skor terintegrasi: {total:.1f} -> {kat}\")\nfor nama, s, w in risiko:\n    print(f\"  {nama}: {s} x {w} = {s*w:.1f}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Skor 55.8 SEDANG", msg: "26+11.25+14+4.5.", pattern: "Skor terintegrasi: 55.8 -> SEDANG" },
          { kind: "stdout_matches", task: "t2", label: "Kontribusi kredit", msg: "65×0.4.", pattern: "Kredit: 65 x 0.4 = 26.0" },
          { kind: "stdout_matches", task: "t2", label: "Kontribusi pasar", msg: "45×0.25=11.25→11.2.", pattern: "Pasar: 45 x 0.25 = 11.2" },
        ],
      },
      reference: "Agregat = Σ skor×bobot. Tampilkan kontribusi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Membangun dashboard ERM",
      prose: [
        "Satu: tetapkan taksonomi — kamus risiko bersama semua unit. Dua: susun RAS kuantitatif — disetujui direksi, cascading ke limit. Tiga: pilih metrik per jenis risiko — sedikit tetapi mewakili (5-8 per jenis). Empat: bangun agregasi — skor terbobot atau modal ekonomi; dokumentasikan bobot. Lima: tetapkan kadensi — dashboard bulanan, review direksi kuartalan, appetite tahunan. Enam: uji dengan skenario — satu skenario makro per tahun menghantam semua risiko.",
        "Aturan praktis 10 detik: taksonomi → appetite → metrik → agregasi → kadensi → skenario. Dashboard yang tidak dipakai untuk keputusan = wallpaper mahal.",
        "Satu jebakan: 'dashboard untuk semua'. Direksi butuh 1 halaman (skor + breach + tren); CRO butuh 5 halaman (per jenis risiko); pemilik risiko butuh detail. Satu dashboard untuk semua = tidak cocok untuk siapa-siapa. Desain berlapis.",
        "Tujuh: tetapkan pemilik dashboard. Dashboard tanpa pemilik = tidak ada yang memperbarui, tidak ada yang mempertanggungjawabkan. Pemilik ideal: kepala ERM/divisi risk terintegrasi \u2014 dengan wewenang meminta data dari semua unit dan akses langsung ke CRO. Wewenang meminta data lintas unit adalah kunci; tanpa itu dashboard mati dalam 2 kuartal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ukur kematangan ERM: level 1 (dokumen ada), level 2 (dipantau), level 3 (memengaruhi keputusan), level 4 (budaya). Tanya jujur: kapan terakhir dashboard ERM mengubah sebuah keputusan bisnis? Jawabannya menentukan levelmu.",
      },
      reference: "Taksonomi → appetite → metrik → agregasi → kadensi. Berlapis.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Konglomerat Nusantara: menjumlahkan segalanya",
      prose: [
        "Konglomerat Nusantara: bank (aset Rp80 T), asuransi (Rp20 T), sekuritas (Rp10 T). Masing-masing punya laporan risiko sendiri. OJK meminta laporan risiko TERINTEGRASI konglomerasi. Skor saat ini: bank 55 (SEDANG), asuransi 70 (TINGGI — klaim bencana), sekuritas 40 (RENDAH).",
        "Pertanyaan: (a) Skor konglomerasi dengan bobot aset? (b) Apa tantangan integrasinya? Pembahasan: (a) (55×80 + 70×20 + 40×10)/110 = (4400+1400+400)/110 = 56,4 → SEDANG. Tetapi: asuransi TINGGI tertutupi rata-rata — laporkan JUGA maksimum dan sebarannya, bukan hanya rata-rata. (b) Tantangan: taksonomi berbeda (asuransi bicara 'klaim', bank bicara 'NPL'), appetite belum terintegrasi, data tidak sebanding. Solusi: kamus bersama dulu, baru agregasi. Pelajaran: rata-rata menyembunyikan masalah — selalu tampilkan distribusi + maksimum di samping agregat.",
        "Pertanyaan lanjutan: (c) Bagaimana menyamakan taksonomi bank vs asuransi? Pembahasan: buat kamus pemetaan \u2014 \u2018klaim asuransi\u2019 dipetakan ke \u2018risiko operasional/strategi\u2019 sesuai sifatnya; \u2018risiko underwriting\u2019 menjadi jenis tersendiri dalam taksonomi konglomerasi. Prosesnya butuh 3-6 bulan lokakarya lintas entitas \u2014 mahal, tetapi sekali jadi dipakai bertahun-tahun. Jangan agregasi sebelum kamusnya sama; itu seperti menjumlahkan rupiah dan dolar tanpa kurs.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "POJK 18/2016 mewajibkan konglomerasi keuangan menerapkan manajemen risiko terintegrasi. Ini bukan teori — OJK menilai dan bisa memberi sanksi. Analis di konglomerasi wajib paham tantangan agregasi lintas entitas ini.",
      },
      reference: "Rata-rata menyembunyikan. Tampilkan distribusi + maksimum.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor \u2265 4 dari 5.",
      ],
      summary: [
        "Risiko berkorelasi: setiap tim bisa benar di wilayahnya sementara bank salah secara keseluruhan — ERM = satu appetite, satu bahasa (taksonomi), satu dashboard.",
        "Komponen wajib: risk appetite statement (berapa risiko yang BERANI diambil), taksonomi risiko, dan tiga lini pertahanan; komite tanpa appetite operasional = forum diskusi.",
        "Uji operasionalnya konkret: bisakah komite menolak pembiayaan Rp2 triliun ke sektor properti BUKAN karena NPL-nya, melainkan karena appetite konsentrasi?",
        "Kerangka acuan: COSO ERM dan ISO 31000; dasar hukum Indonesia: POJK 18/2016 (konglomerasi keuangan) + POJK 8/2023.",
      ],
      quiz: [
        {
          q: "Urutan three lines of defence yang benar:",
          options: [
            { text: "Lini 1 = bisnis (pemilik risiko); lini 2 = risk/compliance; lini 3 = audit internal", why: "Benar: bisnis pemilik risiko, risk mengawasi, audit menjamin.", correct: true },
            { text: "Lini 1 = audit; lini 2 = bisnis; lini 3 = risk", why: "Terbalik: audit independen justru lini 3." },
            { text: "Lini 1 = direksi; lini 2 = komisaris; lini 3 = OJK", why: "Itu struktur tata kelola, bukan three lines." },
            { text: "Semua lini = departemen risk", why: "Risk hanya lini 2; bisnis tetap pemilik risiko." },
          ],
        },
        {
          q: "LCR aktual 110 vs batas appetite 120. Status:",
          options: [
            { text: "BREACH — LCR higher-better, aktual di bawah batas", why: "Benar: arah higher-better; di bawah appetite = breach.", correct: true },
            { text: "OK — masih di atas 100", why: "100 = minimum regulasi; appetite 120 yang dilanggar." },
            { text: "OK — batas hanya panduan", why: "Appetite bukan panduan; pelanggaran = eskalasi." },
            { text: "BREACH — tetapi tidak perlu eskalasi", why: "Breach tanpa eskalasi = appetite mati." },
          ],
        },
        {
          q: "Mengapa agregasi risiko harus mempertimbangkan korelasi stres?",
          options: [
            { text: "Saat krisis semua jenis risiko memburuk bersamaan — agregasi independen meremehkan", why: "Benar: korelasi stres menghapus diskon diversifikasi.", correct: true },
            { text: "Regulator melarang agregasi independen", why: "Bukan soal larangan; soal angka yang jujur." },
            { text: "Korelasi selalu 1", why: "Tidak selalu 1; stres menaikkannya — itulah yang dimodelkan." },
            { text: "Tidak perlu — diversifikasi selalu berlaku", why: "Diversifikasi menguap saat krisis." },
          ],
        },
        {
          q: "Risk appetite statement yang baik harus:",
          options: [
            { text: "Kuantitatif, cascading ke limit, dipantau dengan eskalasi breach", why: "Benar: tiga syarat appetite yang hidup.", correct: true },
            { text: "Kualitatif dan aspirasional", why: "Aspirasi tanpa angka tidak bisa dipantau." },
            { text: "Ditetapkan sekali dan tidak diubah", why: "Appetite direviu berkala mengikuti strategi." },
            { text: "Hanya diketahui direksi", why: "Harus cascading sampai pemilik risiko." },
          ],
        },
        {
          q: "Dashboard ERM untuk direksi yang ideal:",
          options: [
            { text: "1 halaman: skor terintegrasi + breach appetite + tren + 3 risiko terbesar", why: "Benar: sintesis untuk keputusan.", correct: true },
            { text: "50 halaman detail semua metrik", why: "Detail untuk analis; direksi butuh sintesis." },
            { text: "Hanya menampilkan yang hijau", why: "Menyembunyikan merah = dashboard bohong." },
            { text: "Sama persis dengan dashboard analis", why: "Audiens berbeda = kebutuhan berbeda; berlapis." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Skor agregat kami SEDANG — aman.” Agregat menyembunyikan distribusi. Selalu tanya: komponen apa yang TINGGI? Konsentrasi di mana? Rata-rata yang tenang bisa menyimpan badai.",
      },
      hints: [
        "Uji cepat: jelaskan bedanya appetite, tolerance, dan limit dalam satu kalimat masing-masing.",
        "Ingat mini-case: 56,4 SEDANG tetapi asuransi 70 TINGGI — jangan tertipu rata-rata.",
      ],
      reference: "Satu appetite, pantau otomatis, agregat jujur.",
    },
  ],
};
