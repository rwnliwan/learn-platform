import type { V2Lesson } from "../lib/types";

const DUPONT_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Dekomposisi DuPont dua perusahaan: A margin 15 persen turnover 0,8 leverage 1,5 menjadi ROE 18 persen; B margin 4 persen turnover 1,0 leverage 5,0 menjadi ROE 20 persen.">
<text x="260" y="20" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">DuPont: ROE sama bisa datang dari komposisi berbeda</text>
<g font-size="10" font-family="var(--font-ui)" fill="var(--chart-text)"><rect x="150" y="30" width="12" height="12" fill="var(--c1)"/><text x="166" y="40">margin</text><rect x="238" y="30" width="12" height="12" fill="var(--c2)"/><text x="254" y="40">turnover</text><rect x="336" y="30" width="12" height="12" fill="var(--c3)"/><text x="352" y="40">leverage</text></g>
<text x="8" y="90" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">A — berkualitas</text>
<g><rect x="150" y="72" width="100" height="26" fill="var(--c1)"/><rect x="250" y="72" width="100" height="26" fill="var(--c2)"/><rect x="350" y="72" width="100" height="26" fill="var(--c3)"/></g>
<g font-size="10" font-family="var(--font-ui)" fill="#ffffff" text-anchor="middle" font-weight="600"><text x="200" y="89">15%</text><text x="300" y="89">0,8×</text><text x="400" y="89">1,5×</text></g>
<rect x="150" y="106" width="216" height="24" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="1.5"/>
<text x="360" y="123" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end" font-weight="600">ROE = 18%</text>
<text x="8" y="170" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">B — rapuh</text>
<g><rect x="150" y="152" width="100" height="26" fill="var(--c1)"/><rect x="250" y="152" width="100" height="26" fill="var(--c2)"/><rect x="350" y="152" width="100" height="26" fill="var(--c3)"/></g>
<g font-size="10" font-family="var(--font-ui)" fill="#ffffff" text-anchor="middle" font-weight="600"><text x="200" y="169">4%</text><text x="300" y="169">1,0×</text><text x="400" y="169">5,0×</text></g>
<rect x="150" y="186" width="240" height="24" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="1.5"/>
<text x="384" y="203" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end" font-weight="600">ROE = 20%</text>
<text x="260" y="232" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">A: 15% × 0,8 × 1,5 = 18% · B: 4% × 1,0 × 5,0 = 20% — beli komposisinya, bukan angkanya.</text>
</svg>`;

export const pma4: V2Lesson = {
  slug: "pm-a4-financial-statements",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A4 Financial Statements: 3 Laporan & Rasio",
  estMinutes: 55,
  steps: [
    {
      id: "tiga-laporan",
      eyebrow: "Langkah 1 · Tiga Laporan",
      title: "Laba naik 40%, kas malah minus",
      prose: [
        "PT MajuJaya melaporkan laba bersih naik 40%. Sahamnya melonjak. Sebulan kemudian: gagal bayar utang. Kok bisa? Twist-nya ada di arus kas: kas operasi negatif. Laba 40% itu datang dari piutang yang membengkak (penjualan ke distributor \u2018titip\u2019 akhir tahun — channel stuffing) dan penyusutan yang diperpanjang (beban turun, laba naik, kas tidak berubah).",
        "Tiga laporan = satu cerita: income statement (kinerja periode: revenue \u2192 laba), balance sheet (posisi saat itu: Aset = Liabilitas + Ekuitas), cash flow (kas bergerak: operasi, investasi, pendanaan). Keterkaitannya: laba bersih menambah retained earnings di ekuitas; arus kas operasi = laba \u00b1 non-kas \u00b1 modal kerja.",
        "Aturan emas: laba tanpa kas = curiga. Cash flow operasi adalah laporan yang paling sulit dimanipulasi. Analis forensik membaca dengan urutan terbalik dari orang awam: kas dulu, laba kemudian, neraca untuk verifikasi.",
      ],
      formula: String.raw`\text{Aset} = \text{Liabilitas} + \text{Ekuitas}`,
      formulaNote: "Aset = semua yang dimiliki perusahaan (kas, piutang, pabrik); Liabilitas = kewajiban ke pihak luar (utang bank, obligasi); Ekuitas = sisa untuk pemilik setelah semua kewajiban dibayar. Interpretasi: neraca selalu seimbang — setiap rupiah aset didanai utang atau modal sendiri, dan ekuitas adalah buffer penyerap rugi. Contoh angka: aset Rp1 triliun, liabilitas Rp600 miliar → ekuitas Rp400 miliar; rugi Rp500 miliar menghapus ekuitas dan mulai menyentuh hak kreditor.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Divergensi laba vs CFO dua tahun beruntun = red flag kuantitatif. Pola MajuJaya: akrual agresif atau channel stuffing — cek \u0394piutang vs \u0394revenue.",
      },
      reference: "Kas = fakta, laba = opini. Urutan baca: kas \u2192 laba \u2192 catatan kaki.",
    },
    {
      id: "cfo",
      eyebrow: "Langkah 2 · Rekonsiliasi CFO",
      title: "Dari laba ke kas: siapa yang \u2018dimakan\u2019",
      prose: [
        "MajuJaya: laba Rp140M, depresiasi Rp50M, piutang naik Rp200M, persediaan naik Rp20M. CFO = 140 + 50 \u2212 200 \u2212 20 = \u2212Rp30M. Laba \u2018dimakan\u2019 piutang. Rumus metode tidak langsung: CFO = laba + beban non-kas \u2212 kenaikan aset lancar + kenaikan liabilitas lancar.",
        "Ingat tandanya: aset naik = dompet tipis (kas keluar); aset turun = dompet tebal. Inventori turun Rp20M = kas masuk Rp20M.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `cfo` dari laba 140, depresiasi 50, \u0394piutang 200, \u0394persediaan 20 (Rp juta)" },
        { id: "t2", text: "Cetak hasilnya" },
      ],
      expected: "cfo=-30",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Tanda kenaikan piutang. Piutang naik = kas belum diterima = kurangi dari laba. Bukan tambah.",
      },
      hints: [
        "CFO = laba + depresiasi \u2212 kenaikan piutang \u2212 kenaikan persediaan.",
        "Depresiasi non-kas: ditambahkan kembali.",
        "cfo = laba + dep - d_piutang - d_persediaan",
      ],
      code: {
        starter: `laba, dep = 140, 50\nd_piutang, d_persediaan = 200, 20\n\n# TULIS KODEMU\ncfo = \n\nprint(f"cfo={cfo}")`,
        lockLines: 2,
        solution: `laba, dep = 140, 50\nd_piutang, d_persediaan = 200, 20\n\n# TULIS KODEMU\ncfo = laba + dep - d_piutang - d_persediaan\n\nprint(f"cfo={cfo}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cfo", value: -30, tol: 1e-9, label: "`cfo` seharusnya \u221230", msg: "140 + 50 \u2212 200 \u2212 20 = \u221230. Kenaikan aset lancar mengurangi kas." },
          { kind: "stdout_matches", task: "t2", pattern: "cfo=-30", label: "`print` menampilkan cfo", msg: "Format: cfo=... ." },
        ],
      },
      reference: "CFO = laba + non-kas \u2212 \u0394aset lancar + \u0394liabilitas lancar.",
    },
    {
      id: "fifo-lifo",
      eyebrow: "Langkah 3 · FIFO vs LIFO",
      title: "Laba yang \u2018dimasak\u2019 secara legal",
      prose: [
        "Beli 100 unit @Rp10, lalu 100 unit @Rp14. Jual 100 unit @Rp20. FIFO (jual yang lama): COGS = 100\u00d710 = Rp1.000 \u2192 laba kotor Rp1.000. LIFO (jual yang baru): COGS = 100\u00d714 = Rp1.400 \u2192 laba kotor Rp600. Selisih laba 67% — dari transaksi yang identik.",
        "Saat harga naik: FIFO \u2192 COGS rendah \u2192 laba tinggi, pajak tinggi; LIFO \u2192 sebaliknya. IFRS melarang LIFO justru karena distorsi ini. Prinsip analis: bandingkan apel dengan apel — dua emiten beda metode = laba tidak comparable. Normalisasi dulu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung laba kotor `fifo` (COGS dari pembelian pertama)" },
        { id: "t2", text: "Hitung laba kotor `lifo` (COGS dari pembelian kedua), cetak keduanya" },
      ],
      expected: "fifo=1000  lifo=600",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membandingkan emiten AS (boleh LIFO) dengan Indonesia (IFRS, FIFO) tanpa penyesuaian. Laba keduanya tidak comparable — samakan ke FIFO dulu.",
      },
      hints: [
        "Laba kotor = penjualan \u2212 COGS.",
        "FIFO: COGS = 100 \u00d7 10. LIFO: COGS = 100 \u00d7 14.",
        "fifo = jual - 100*10\nlifo = jual - 100*14",
      ],
      code: {
        starter: `jual = 100*20\n\n# TULIS KODEMU: laba kotor FIFO dan LIFO\nfifo = \nlifo = \n\nprint(f"fifo={fifo}  lifo={lifo}")`,
        lockLines: 1,
        solution: `jual = 100*20\n\n# TULIS KODEMU: laba kotor FIFO dan LIFO\nfifo = jual - 100*10\nlifo = jual - 100*14\n\nprint(f"fifo={fifo}  lifo={lifo}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fifo", value: 1000, tol: 1e-9, label: "`fifo` seharusnya 1000", msg: "2000 \u2212 1000 = 1000. FIFO memakai barang lama (murah)." },
          { kind: "equal", task: "t2", name: "lifo", value: 600, tol: 1e-9, label: "`lifo` seharusnya 600", msg: "2000 \u2212 1400 = 600. LIFO memakai barang baru (mahal)." },
          { kind: "stdout_matches", task: "t2", pattern: "fifo=1000\\s+lifo=600", label: "`print` menampilkan keduanya", msg: "Format: fifo=...  lifo=... ." },
        ],
      },
      quiz: [
        {
          q: "Harga-harga naik. FIFO vs LIFO: mana yang menghasilkan laba lebih tinggi?",
          options: [
            { text: "LIFO", why: "Salah: LIFO memakai COGS termahal (barang baru) \u2192 laba lebih rendah saat harga naik." },
            { text: "FIFO (COGS dari barang lama yang murah)", why: "Benar: COGS lama yang murah \u2192 laba tinggi \u2192 pajak tinggi. IFRS melarang LIFO karena distorsi ini.", correct: true },
            { text: "Sama", why: "Salah: contoh di langkah ini menunjukkan selisih laba 67%." },
            { text: "Tergantung pajak", why: "Salah: pajak adalah konsekuensi, bukan penentu mana laba lebih tinggi." },
          ],
        },
      ],
      reference: "Harga naik: FIFO = laba tinggi. IFRS melarang LIFO. Normalisasi sebelum bandingkan.",
    },
    {
      id: "dupont",
      eyebrow: "Langkah 4 · DuPont + chart",
      title: "Bedah ROE: dari mana datangnya",
      prose: [
        "ROE = net margin \u00d7 asset turnover \u00d7 leverage. DuPont membedah sumber ROE: margin tinggi (pricing power — aman), turnover tinggi (efisiensi), atau leverage tinggi (rapuh!).",
        "Dua emiten dengan ROE 20% bisa sangat berbeda: margin 15% \u00d7 turnover 0,8 \u00d7 leverage 1,5 = 18% (berkualitas — dari operasi) vs margin 4% \u00d7 leverage 5 = 20% (rapuh — dari utang, sensitif rate shock). Beli komposisinya, bukan angkanya.",
        "Cara membaca: setiap perusahaan dibedah menjadi tiga blok (margin, turnover, leverage) yang dikalikan menjadi bar ROE di bawahnya; panjang bar ROE sebanding dengan nilainya.",
        "Interpretasi: B punya ROE lebih tinggi (20% vs 18%) tetapi komposisinya rapuh — margin tipis 4% ditopang leverage 5,0×. A justru berkualitas: ROE dari operasi (margin 15%), bukan dari utang. Inilah maksud teks: beli komposisinya, bukan angkanya.",
      ],
      figure: {
        svg: DUPONT_SVG,
        alt: "Dekomposisi DuPont dua perusahaan: A margin 15 persen turnover 0,8 leverage 1,5 menjadi ROE 18 persen; B margin 4 persen turnover 1,0 leverage 5,0 menjadi ROE 20 persen.",
        caption: "Semua angka sama dengan contoh di teks. Bar ROE B lebih panjang — tetapi warnanya menandai kerapuhan: ROE dari leverage sensitif terhadap rate shock.",
      },
      formula: String.raw`ROE = \frac{\text{Laba}}{\text{Rev}} \times \frac{\text{Rev}}{\text{Aset}} \times \frac{\text{Aset}}{\text{Ekuitas}}`,
      formulaNote: "Laba/Rev = net margin (pricing power — seberapa besar laba dari tiap rupiah penjualan); Rev/Aset = perputaran aset (efisiensi operasional); Aset/Ekuitas = leverage (pengungkit utang). Interpretasi: ROE diurai menjadi tiga sumber — ROE tinggi dari margin berarti berkualitas, dari leverage berarti rapuh terhadap kenaikan bunga. Contoh angka: 15% × 0,8 × 1,5 = 18% (dari operasi, sehat) vs 4% × 1,0 × 5,0 = 20% (dari utang, rapuh).",
      tasks: [
        { id: "t1", text: "Hitung `roe` dari margin 15%, turnover 0,8, leverage 1,5 (desimal)" },
        { id: "t2", text: "Cetak sebagai persen" },
      ],
      expected: "roe=18%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "ROE dari leverage = rapuh terhadap rate shock. Cek interest coverage < 3x sebagai pendamping — kenaikan bunga sedikit bisa menjebol coverage emiten berleverage 5x.",
      },
      hints: [
        "ROE = margin \u00d7 turnover \u00d7 leverage, semua dalam desimal.",
        "Cetak persen: kalikan 100 dan format 0 desimal.",
        "roe = margin * ato * lev",
      ],
      code: {
        starter: `margin, ato, lev = 0.15, 0.8, 1.5\n\n# TULIS KODEMU\nroe = \n\nprint(f"roe={roe:.0%}")`,
        lockLines: 1,
        solution: `margin, ato, lev = 0.15, 0.8, 1.5\n\n# TULIS KODEMU\nroe = margin * ato * lev\n\nprint(f"roe={roe:.0%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "roe", value: 0.18, tol: 1e-9, label: "`roe` seharusnya 0.18", msg: "0,15 \u00d7 0,8 \u00d7 1,5 = 0,18. Tiga komponen DuPont dikalikan." },
          { kind: "stdout_matches", task: "t2", pattern: "roe=18%", label: "`print` menampilkan persen", msg: "Format persen: roe=18%." },
        ],
      },
      quiz: [
        {
          q: "ROE 20% dari margin 4% \u00d7 leverage 5x. Penilaianmu?",
          options: [
            { text: "Bagus — ROE tinggi", why: "Salah: angka ROE saja tidak cukup; sumbernya menentukan kualitas." },
            { text: "Rapuh — ROE dari utang; sensitif rate shock", why: "Benar: leverage 5x = DER 4. Kenaikan bunga sedikit bisa menjebol coverage. Kualitas ROE > angka ROE.", correct: true },
            { text: "Tidak bisa dinilai", why: "Salah: DuPont justru memberi alat untuk menilainya." },
            { text: "Lebih baik dari margin tinggi", why: "Salah: ROE dari margin (pricing power) jauh lebih aman dari ROE dari utang." },
          ],
        },
      ],
      reference: "DuPont: ROE = margin \u00d7 turnover \u00d7 leverage. Bedah sumbernya.",
    },
    {
      id: "forensik-lanjut",
      eyebrow: "Langkah 5 · Forensik Lanjut",
      title: "Akrual, lima bendera Beneish, dan laba yang dinormalisasi",
      prose: [
        "Di luar DSO dan divergensi CFO, analis forensik memakai rasio akrual: Akrual = (Laba bersih − CFO) ÷ Total aset. Sloan (1996) menunjukkan akrual tinggi memprediksi return saham masa depan yang rendah — laba “kertas” tidak bertahan karena akrual harus berbalik (reverse) di periode berikut. MajuJaya: (140 − (−30)) ÷ 2.000 = 8,5% — di atas ambang waspada 5% yang dipakai banyak screener kuantitatif. Satu angka, tiga detik, dan kamu sudah tahu ada yang tidak beres sebelum membaca satu pun paragraf narasi manajemen.",
        "Lima bendera gaya Beneish yang paling praktis dipakai. (1) DSO melonjak sementara revenue naik — channel stuffing: barang “titip” ke distributor akhir tahun. (2) Gross margin memburuk tetapi revenue naik — diskon tersembunyi untuk memaksa penjualan. (3) Aset “lunak” (piutang + persediaan + aset takberwujud) tumbuh di atas 30% dari total aset — tempat laba disembunyikan. (4) Beban depresiasi melambat padahal aset tetap naik — umur manfaat diperpanjang diam-diam, persis trik MajuJaya. (5) Penjualan ke afiliasi melonjak di kuartal IV — tutup tahun dengan “pembeli” yang tidak bisa menolak. Aturan keputusan: dua bendera menyala = investigasi mendalam; tiga = jangan sentuh, seberapa pun murahnya valuasi.",
        "Untuk valuasi, laba harus dinormalisasi dulu: buang one-off (penjualan aset, biaya restrukturisasi), ratakan siklikal (rata-rata 5–7 tahun atau estimasi mid-cycle), dan pakai owner earnings = laba + depresiasi − capex pemeliharaan − Δmodal kerja. Emiten dengan laba Rp140 miliar tetapi owner earnings Rp40 miliar tidak layak divaluasi dengan P/E atas Rp140 miliar — kamu membayar untuk laba yang tidak pernah menjadi kas. Analis yang memakai P/E atas laba puncak siklikal sedang membeli ilusi.",
      ],
      tasks: [],
      formula: String.raw`\text{Akrual} = \frac{\text{Laba bersih} - CFO}{\text{Total aset}}`,
      formulaNote: "Laba bersih = laba akuntansi periode berjalan (Rp140 miliar); CFO = arus kas operasi (Rp−30 miliar — negatif!); Total aset = Rp2.000 miliar. Interpretasi: akrual mengukur porsi laba yang TIDAK didukung kas — semakin tinggi, semakin “kertas” labanya dan semakin besar pembalikan di masa depan. Contoh angka: (140 − (−30)) ÷ 2.000 = 8,5%; di atas 5% = waspada, di atas 10% dua tahun beruntun = hampir pasti ada rekayasa.",
      note: {
        title: "Intuisi: baca laporan seperti forensik, bukan seperti fans",
        body: "Analis berpengalaman membuka laporan tahunan dari belakang: arus kas dulu, baru laba rugi. Heuristik 10 menit: (1) CFO ÷ laba bersih — di bawah 0,8 dua tahun beruntun berarti laba “kertas”; (2) Δpiutang vs Δrevenue — piutang tumbuh lebih cepat berarti channel stuffing; (3) tren DSO — naik 20 hari tanpa penjelasan berarti pelanggan dipaksa “membeli”. Jika ketiganya bersih, barulah baca narasi manajemen — urutan ini menghemat ratusan jam kerjamu. Intuisi kedua: akuntansi adalah bahasa dengan dialek — FIFO vs LIFO, masa depresiasi, kapitalisasi vs beban — dan dua emiten “sektor sama” bisa bicara dialek berbeda. Jangan pernah membandingkan rasio sebelum menyamakan dialeknya, atau kamu membandingkan apel dengan lukisan apel. Yang terakhir: catatan kaki adalah tempat mayat disembunyikan — transaksi afiliasi, kontinjensi, dan perubahan estimasi akuntansi tinggal di sana, bukan di headline laba yang dipajang di press release. Satu lagi: bandingkan dengan arus kas bebas, bukan cuma CFO — emiten dengan CFO sehat tetapi capex pemeliharaan raksasa tiap tahun tetap tidak menghasilkan kas untuk pemilik. Owner earnings (CFO − capex pemeliharaan) adalah angka terakhir yang harus kamu cek sebelum percaya pada laba.",
      },
      quiz: [
        {
          q: "Emiten X: laba Rp140M, CFO −Rp30M, total aset Rp2.000M. Rasio akrual dan artinya?",
          options: [
            { text: "8,5% — waspada, laba “kertas”", why: "Benar: (140−(−30))/2000 = 8,5% > ambang 5%. Laba tanpa kas = akrual agresif; pola MajuJaya klasik.", correct: true },
            { text: "7% — aman", why: "Salah: hitung ulang (140+30)/2000 = 8,5%, dan itu di atas ambang waspada." },
            { text: "−1,5% — konservatif", why: "Salah: tanda terbalik — rumusnya (laba − CFO)/aset, dan CFO-nya negatif." },
            { text: "Tidak bisa dinilai tanpa revenue", why: "Salah: rasio akrual hanya butuh laba, CFO, dan aset." },
          ],
        },
      ],
      reference: "Akrual > 5% = waspada. Dua bendera Beneish = investigasi; tiga = jangan sentuh. Normalisasi laba sebelum valuasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: membaca laporan seperti forensik",
      prose: [
        "Skenario 1 — Laba naik tetapi ragu kualitasnya. → Rekonsiliasi CFO: CFO = laba + beban non-kas − kenaikan aset lancar + kenaikan liabilitas lancar. Laba yang 'dimakan' piutang (CFO negatif) = red flag.",
        "Skenario 2 — Membandingkan dua emiten. → Samakan metode akuntansi dulu: FIFO vs LIFO bisa mengubah laba 67% dari transaksi identik. Bandingkan apel dengan apel — normalisasi sebelum menyimpulkan.",
        "Skenario 3 — ROE tinggi, ingin tahu sumbernya. → Bedah DuPont: margin tinggi = pricing power (aman), turnover tinggi = efisiensi, leverage tinggi = rapuh. Beli komposisinya, bukan angkanya.",
        "Skenario 4 — Curiga angka dimanipulasi. → Rasio akrual = (Laba − CFO) ÷ total aset; di atas 5% = waspada (Sloan). Lalu cek bendera Beneish: DSO melonjak, margin memburuk, aset lunak > 30%.",
        "Skenario 5 — Butuh red flag kuantitatif cepat. → DSO = piutang/revenue × 365. Di atas 90 hari untuk emiten non-proyek = kas terjebak berbulan-bulan = investigasi.",
        "Aturan praktis 10 detik: kualitas laba → CFO vs laba; komparabilitas → samakan metode; sumber ROE → DuPont; curiga fraud → akrual + DSO.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membeli ROE 20% tanpa membedahnya. ROE 20% dari margin 15% × leverage 1,5x adalah kualitas operasi; ROE 20% dari margin 4% × leverage 5x adalah kerapuhan yang sensitif terhadap rate shock.",
      },
    },
    {
      id: "minicase-majujaya",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Autopsi MajuJaya: DSO 109 hari",
      prose: [
        "PT MajuJaya: laba +40% (Rp140M), piutang +120% (Rp420M, revenue Rp1,4T), CFO \u2212Rp30M. Saham sempat melonjak 60% lalu kolaps saat gagal bayar kupon obligasi.",
        "Hitung DSO = 420/1400 \u00d7 365 = 109,5 hari vs normal 45 hari — 2,4x lebih lambat. Artinya kas terjebak 3,5 bulan di piutang. DSO > 90 hari pada emiten non-proyek = red flag kuantitatif yang bisa dihitung siapa pun, tanpa \u201cfeeling\u201d.",
        "Tiga tindakan analis kredit sebelum kolaps: (1) bekukan plafon saat DSO > 90 hari dua kuartal beruntun (covenant berbasis rasio, bukan janji); (2) audit piutang — konfirmasi saldo ke distributor (channel stuffing ketahuan saat distributor \u201ctidak merasa memesan sebanyak itu\u201d); (3) skenario likuiditas: jika 30% piutang tak tertagih, apakah debt service masih aman?",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Screening rule anti-MajuJaya: (laba \u2212 CFO)/aset > 10% dua tahun \u2192 buang; \u0394piutang > \u0394revenue \u2192 investigasi. Selalu baca arus kas sebelum laba rugi.",
      },
      reference: "DSO = piutang/revenue \u00d7 365. DSO > 90 hari = red flag.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran: rekonsiliasi CFO, kualitas laba, coverage, dan DuPont.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Laba Rp140M, depresiasi Rp50M, piutang naik Rp200M, persediaan naik Rp20M. CFO?",
          options: [
            { text: "Rp140M", why: "Salah: itu labanya — belum disesuaikan modal kerja." },
            { text: "\u2212Rp30M", why: "Benar: 140 + 50 \u2212 200 \u2212 20 = \u221230. Laba \u201cdimakan\u201d modal kerja — pola MajuJaya klasik.", correct: true },
            { text: "Rp190M", why: "Salah: 140+50 = 190 mengabaikan kenaikan piutang dan persediaan." },
            { text: "Rp410M", why: "Salah: menjumlahkan semuanya tanpa memperhatikan tanda." },
          ],
        },
        {
          q: "Red flag kualitas laba terkuat?",
          options: [
            { text: "Revenue naik", why: "Salah: revenue naik bisa sehat — yang penting kualitasnya." },
            { text: "CFO/laba < 50% bertahun-tahun", why: "Benar: laba tanpa kas = akrual agresif. Divergensi persisten adalah prediktor masalah paling andal.", correct: true },
            { text: "DER turun", why: "Salah: DER turun justru menyehatkan neraca." },
            { text: "Dividen naik", why: "Salah: dividen naik umumnya sinyal kas yang sehat." },
          ],
        },
        {
          q: "Interest coverage 1,5x. Artinya?",
          options: [
            { text: "Aman", why: "Salah: < 3x = waspada, < 1,5x = kritis." },
            { text: "Berbahaya — EBIT hanya 1,5x beban bunga", why: "Benar: guncangan kecil = gagal bayar. Coverage tipis + utang besar = kombinasi mematikan saat resesi.", correct: true },
            { text: "Tidak relevan", why: "Salah: coverage adalah metrik solvabilitas inti." },
            { text: "Bagus untuk growth", why: "Salah: leverage tinggi bukan strategi growth yang sehat tanpa coverage." },
          ],
        },
        {
          q: "NPM 8%, perputaran aset 1,25x, leverage (aset/ekuitas) 2,5x. ROE?",
          options: [
            { text: "25%", why: "Benar: 8% \u00d7 1,25 \u00d7 2,5 = 25%. Tetapi waspada: leverage 2,5x cukup tinggi — cek apakah ROE ini \u201csehat\u201d atau \u201crapuh\u201d.", correct: true },
            { text: "11,75%", why: "Salah: cek perkalian tiga komponen DuPont." },
            { text: "16%", why: "Salah: 8% \u00d7 2 = 16% mengabaikan turnover dan leverage yang benar." },
            { text: "20%", why: "Salah: hitung ulang 0,08 \u00d7 1,25 \u00d7 2,5." },
          ],
        },
      ],
      summary: [
        "3 laporan: IS (kinerja), BS (posisi), CF (kas) — terkait via retained earnings & rekonsiliasi.",
        "Kas = fakta: divergensi laba vs CFO = red flag utama.",
        "Pilihan akuntansi (FIFO/LIFO, depresiasi) mengubah laba — normalisasi dulu.",
        "DuPont: ROE = margin \u00d7 turnover \u00d7 leverage — beli komposisinya, bukan angkanya.",
        "Rasio kunci: current, quick, DER, coverage, margin, ROE, DSO, CCC.",
      ],
      next: { label: "PM-A5 — Corporate Issuers: Governance, WACC & Modal Kerja", href: "/learn/pm-a5-corporate-issuers" },
    },
  ],
};
