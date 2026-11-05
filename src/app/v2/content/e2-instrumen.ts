import type { V2Lesson } from "../lib/types";

export const e2: V2Lesson = {
  slug: "e2-instrumen",
  track: "Financial Markets",
  module: "Fondasi Pasar",
  title: "E2. Instrumen Keuangan: Apa yang Kamu Beli?",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-waran",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "“Saham” yang ternyata bukan saham",
      prose: [
        "Dimas bangga: “Aku beli saham perusahaan tambang, katanya bakal naik 50%!” Dicek: yang dia beli ternyata waran — derivatif yang hangus tak bernilai kalau harga saham tidak melewati harga eksekusi sebelum tanggal kedaluwarsa. Harga sahamnya naik 10%… warannya? Rugi. Dimas tidak rugi karena “sahamnya jelek”, tapi karena dia tidak tahu apa yang dia beli.",
        "Waran “MAJU-W”: harga beli Rp200 per waran, strike Rp1.500, kedaluwarsa 6 bulan. Saat expiry saham di Rp1.650 (naik 10%): payoff = max(1.650 − 1.500, 0) − 200 = Rp150 − Rp200 = rugi Rp50 per waran (−25%), padahal sahamnya naik! Kenaikan 10% tidak cukup menutup time value yang menguap. Di derivatif, benar soal arah saja tidak cukup: harus benar arah, besar gerakan, dan batas waktu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `payoff` waran saat expiry (saham Rp1.650)" },
        { id: "t2", text: "Hitung `rugi_pct` (persen dari harga beli waran)" },
      ],
      expected: "payoff=-50  rugi_pct=-25.0",
      note: {
        title: "Sering salah",
        body: "Mengira waran/opsi = saham biasa. Derivatif punya tanggal kedaluwarsa: lewat tanggalnya tanpa kondisi terpenuhi, nilainya nol — saham biasa tidak begitu.",
      },
      hints: [
        "Payoff waran = max(harga_expiry − strike, 0) − harga beli waran.",
        "Fungsi max(a, 0) memastikan payoff tidak negatif sebelum dikurangi harga beli.",
        "rugi_pct = payoff / harga_beli * 100",
      ],
      code: {
        starter: `strike = 1500       # harga eksekusi\nharga_beli = 200   # harga waran yang dibayar Dimas\nharga_expiry = 1650  # saham naik 10% saat expiry\n\n# TULIS KODEMU: payoff dan rugi persen\npayoff = \nrugi_pct = \n\nprint(f"payoff={payoff:.0f}  rugi_pct={rugi_pct:.1f}")`,
        lockLines: 3,
        solution: `strike = 1500       # harga eksekusi\nharga_beli = 200   # harga waran yang dibayar Dimas\nharga_expiry = 1650  # saham naik 10% saat expiry\n\n# TULIS KODEMU: payoff dan rugi persen\npayoff = max(harga_expiry - strike, 0) - harga_beli\nrugi_pct = payoff / harga_beli * 100\n\nprint(f"payoff={payoff:.0f}  rugi_pct={rugi_pct:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "payoff", value: -50, tol: 1e-9, label: "`payoff` seharusnya −50", msg: "max(1650 − 1500, 0) − 200 = 150 − 200 = −50." },
          { kind: "equal", task: "t2", name: "rugi_pct", value: -25.0, tol: 1e-9, label: "`rugi_pct` seharusnya −25,0", msg: "−50 / 200 × 100 = −25%. Saham naik 10%, waran rugi 25%." },
          { kind: "stdout_matches", task: "t2", pattern: "payoff=-50\\s+rugi_pct=-25\\.0", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Payoff call/waran = max(S − K, 0) − premi. Derivatif bisa hangus total.",
    },
    {
      id: "saham-obligasi",
      eyebrow: "Langkah 2 · Saham vs obligasi",
      title: "Siapa dibayar duluan saat bangkrut?",
      prose: [
        "Saham = bukti kepemilikan sebagian atas perusahaan. Return dari dividen dan capital gain. Tidak ada janji return tetap — dan saat bangkrut, pemegang saham antre paling belakang. Obligasi = surat utang: kamu meminjamkan uang ke penerbit, menerima kupon periodik dan pokok kembali saat jatuh tempo. Saat bangkrut, obligasi dibayar sebelum saham.",
        "Urutan senioritas: kreditur bank (senior) → pemegang obligasi → saham preferen → saham biasa (paling junior). Inilah alasan return saham harus lebih tinggi: ia menanggung risiko first-loss. Senioritas = harga dari keamanan.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan waterfall: hitung `dibayar` tiap klaim dari aset Rp250 jt" },
        { id: "t2", text: "Cetak total yang diterima pemegang saham biasa" },
      ],
      expected: "biasa=0",
      note: {
        title: "Sering salah",
        body: "“Obligasi itu aman, pasti balik modal.” Obligasi punya risiko gagal bayar — penerbit bisa tidak membayar. “Aman” hanya relatif terhadap saham.",
      },
      hints: [
        "Bayar klaim berurutan dari paling senior; tiap klaim dapat min(sisa, tagihan).",
        "Kurangi sisa aset setiap kali membayar satu klaim.",
        "Gunakan loop: dibayar = min(sisa, tagihan); sisa -= dibayar",
      ],
      code: {
        starter: `aset = 250_000_000\nklaim = [\n    ("Kreditur bank (senior)", 100_000_000),\n    ("Pemegang obligasi", 100_000_000),\n    ("Saham preferen", 100_000_000),\n    ("Saham biasa", 100_000_000),\n]\n\n# TULIS KODEMU: bayar berurutan, simpan hasilnya di list dibayar\nsisa = aset\ndibayar = []\n\nprint(f"biasa={dibayar[3]:.0f}")`,
        lockLines: 8,
        solution: `aset = 250_000_000\nklaim = [\n    ("Kreditur bank (senior)", 100_000_000),\n    ("Pemegang obligasi", 100_000_000),\n    ("Saham preferen", 100_000_000),\n    ("Saham biasa", 100_000_000),\n]\n\n# TULIS KODEMU: bayar berurutan, simpan hasilnya di list dibayar\nsisa = aset\ndibayar = []\nfor nama, tagihan in klaim:\n    terima = min(sisa, tagihan)\n    sisa -= terima\n    dibayar.append(terima)\n\nprint(f"biasa={dibayar[3]:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dibayar", value: [100000000, 100000000, 50000000, 0], label: "`dibayar` = [100jt, 100jt, 50jt, 0]", msg: "Aset 250jt habis di 2,5 klaim: bank dan obligasi lunas, preferen dapat 50jt, biasa Rp0." },
          { kind: "stdout_matches", task: "t2", pattern: "biasa=0", label: "`print` menampilkan saham biasa = 0", msg: "Pemegang saham biasa tidak menerima apa-apa di skenario ini." },
        ],
      },
      reference: "Senioritas: bank → obligasi → preferen → biasa. Saham = klaim paling junior.",
    },
    {
      id: "derivatif-fx-komoditas",
      eyebrow: "Langkah 3 · Derivatif, FX, komoditas",
      title: "Tiga kelas instrumen lain yang perlu kamu kenal",
      prose: [
        "Derivatif = kontrak yang nilainya diturunkan dari aset lain (underlying): futures, opsi, waran. Kamu tidak memiliki asetnya — kamu memegang kontrak tentang asetnya. Bisa untuk lindung nilai (eksportir mengunci kurs dengan kontrak forward — kurs dikunci hari ini untuk pembayaran 3 bulan lagi) atau spekulasi ber-leverage. Dua bentuk paling umum: futures — kontrak baku yang diperdagangkan di bursa dengan kliring terpusat dan margin harian; dan opsi — hak (bukan kewajiban) untuk membeli (call) atau menjual (put) di harga strike, dengan kerugian pembeli maksimal sebesar premi yang dibayar di muka.",
        "Valas (FX) = jual-beli mata uang: USD/IDR, EUR/USD. Pasar keuangan terbesar di dunia, mayoritas OTC antar bank. Kurs bergerak karena selisih suku bunga, inflasi, dan sentimen risiko global. Komoditas = barang mentah: emas, minyak, batubara, CPO, nikel. Indonesia = negara komoditas: harga batubara/CPO/nikel langsung memengaruhi APBN dan IHSG.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Trading FX ritel ber-leverage = salah satu cara tercepat kehilangan uang bagi pemula. Leverage memperbesar rugi sama cepatnya dengan untung — tanpa underlying exposure, itu spekulasi murni.",
      },
      reference: "Derivatif = kontrak atas aset lain. FX = pasar terbesar (OTC). Komoditas = termometer ekonomi.",
    },
    {
      id: "reksadana-etf-fee",
      eyebrow: "Langkah 4 · Reksa dana, ETF & fee",
      title: "Fee 2% vs 0,2%: selisihnya ratusan juta",
      prose: [
        "Reksa dana dan ETF = kumpulan dana investor yang dikelola menjadi portofolio. Bedanya: reksa dana aktif diperdagangkan sekali sehari di harga NAB dengan fee 1–2%/tahun; ETF diperdagangkan di bursa sepanjang hari seperti saham, mayoritas pasif mengikuti indeks, fee 0,1–0,5%/tahun.",
        "Fee terlihat sepele per tahun, tapi memakan bunga-berbungamu juga. Modal Rp100 juta, return bruto 10%/tahun, 30 tahun — hitung berapa yang tersisa dengan fee 2% vs 0,2%.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `akhir_02` (fee 0,2%) dan `akhir_20` (fee 2%)" },
        { id: "t2", text: "Hitung `selisih` antara keduanya" },
      ],
      expected: "selisih=645563169",
      note: {
        title: "Sering salah",
        body: "“Reksa dana pasti lebih aman dari saham langsung.” Reksa dana saham isinya saham — risikonya mengikuti isi portofolionya, bukan bungkusnya. Cek fund fact sheet.",
      },
      hints: [
        "Return neto = return bruto − fee, lalu dimajukan 30 tahun.",
        "akhir = modal × (1 + r_neto)^30.",
        "selisih = akhir_02 - akhir_20",
      ],
      code: {
        starter: `modal = 100_000_000\nr_bruto = 0.10\ntahun = 30\n\n# TULIS KODEMU: nilai akhir dengan fee 0,2% dan 2%\nakhir_02 = \nakhir_20 = \nselisih = \n\nprint(f"akhir_02={akhir_02:.0f}")\nprint(f"akhir_20={akhir_20:.0f}")\nprint(f"selisih={selisih:.0f}")`,
        lockLines: 3,
        solution: `modal = 100_000_000\nr_bruto = 0.10\ntahun = 30\n\n# TULIS KODEMU: nilai akhir dengan fee 0,2% dan 2%\nakhir_02 = modal * (1 + r_bruto - 0.002) ** tahun\nakhir_20 = modal * (1 + r_bruto - 0.02) ** tahun\nselisih = akhir_02 - akhir_20\n\nprint(f"akhir_02={akhir_02:.0f}")\nprint(f"akhir_20={akhir_20:.0f}")\nprint(f"selisih={selisih:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "akhir_02", value: 1652228858, tol: 1, label: "`akhir_02` ≈ Rp1,65 M", msg: "100jt × 1,098^30. Return neto = 10% − 0,2% = 9,8%." },
          { kind: "equal", task: "t1", name: "akhir_20", value: 1006265689, tol: 1, label: "`akhir_20` ≈ Rp1,01 M", msg: "100jt × 1,08^30. Return neto = 10% − 2% = 8%." },
          { kind: "equal", task: "t2", name: "selisih", value: 645563169, tol: 1, label: "`selisih` ≈ Rp646 jt", msg: "Fee 1,8%/tahun selama 30 tahun = pajak senyap ratusan juta." },
          { kind: "stdout_matches", task: "t2", pattern: "selisih=645563169", label: "`print` menampilkan selisih", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Fee = pajak majemuk. Untuk investasi pasif, fee = prediktor return bersih terbaik.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 5 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan dari materi di atas. Baca alasan tiap opsi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Perusahaan bangkrut, aset tersisa terbatas. Siapa dibayar PALING akhir?",
          options: [
            { text: "Kreditur bank", why: "Salah: kreditur bank paling senior — dibayar pertama." },
            { text: "Pemegang obligasi", why: "Salah: obligasi dibayar setelah kreditur senior, sebelum saham." },
            { text: "Pemegang saham preferen", why: "Salah: preferen di atas saham biasa, tapi masih di bawah obligasi." },
            { text: "Pemegang saham biasa", why: "Benar: klaim paling junior. Inilah alasan return saham harus paling tinggi: risiko first-loss.", correct: true },
          ],
        },
        {
          q: "Waran yang dipegang Dimas di cerita pembuka termasuk…",
          options: [
            { text: "Saham biasa", why: "Salah: Dimas tidak memegang saham — ia memegang kontrak atas saham." },
            { text: "Obligasi", why: "Salah: obligasi = surat utang dengan kupon, bukan hak beli saham." },
            { text: "Derivatif — nilainya diturunkan dari saham dan bisa hangus", why: "Benar: waran = hak membeli saham di harga dan waktu tertentu. Lewat tanggalnya = nilai nol.", correct: true },
            { text: "Reksa dana", why: "Salah: reksa dana = kumpulan dana yang dikelola, bukan kontrak derivatif." },
          ],
        },
      ],
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Instrumen mana untuk siapa?",
      prose: [
        "Dana darurat, tidak boleh minus → deposito/reksa dana pasar uang: pokok stabil, likuid. Tujuan 3–5 tahun, profil moderat → SBN ritel/obligasi: kupon periodik + pokok kembali saat jatuh tempo (jika tidak default). Tujuan 10+ tahun, tahan gejolak → saham/ETF indeks: return ekspektasi tertinggi jangka panjang, fee rendah.",
        "Lindungi bisnis dari kurs → derivatif FX untuk hedging: ini asuransi, bukan investasi — tujuannya menghilangkan risiko. Takut inflasi menggerogoti → komoditas/saham porsi kecil (5–10%) sebagai pelengkap.",
        "Aturan 10 detik: horizon < 1 tahun → pasar uang; 1–5 tahun → obligasi/SBN; 5+ tahun → saham/ETF. Cek bungkusnya: reksa dana “saham” = risiko saham. Derivatif tanpa eksposur yang dilindungi = spekulasi.",
      ],
      note: {
        title: "Intuisi: baca instrumen dari bawah — siapa dibayar duluan?",
        body: "Semua instrumen keuangan adalah kontrak klaim atas arus kas masa depan — bedanya hanya urutan antrean saat uang dibagi dan seberapa pasti klaimnya. Empat heuristik. Pertama: sebelum tergiur return, tanya “kalau emiten bangkrut, saya urutan ke berapa?” Pemegang saham biasa = antrean paling belakang; pemegang obligasi senior = depan. Return tinggi hampir selalu berarti antrean belakang atau risiko yang disembunyikan. Kedua: baca prospektus dari bagian “faktor risiko”, bukan dari halaman janji return — yang ditulis kecil itulah yang paling mungkin terjadi. Ketiga: biaya yang tidak terlihat (spread, TER, biaya tersembunyi produk terstruktur) hampir selalu lebih besar dari biaya yang terlihat (fee broker). Keempat: derivatif = leverage waktu — futures dan opsi memindahkan risiko antar waktu, bukan menghilangkannya; leverage memperbesar hasil dua arah sama cepatnya. Aturan praktisnya: jangan beli instrumen yang tidak bisa kamu jelaskan ke keponakanmu dalam dua kalimat — bukan karena ia bodoh, melainkan karena kalau kamu tidak bisa menyederhanakannya, kemungkinan besar kamu belum paham risikonya.",
      },
      tasks: [],
      reference: "Horizon menentukan instrumen. Selalu cek ISI produk, bukan bungkusnya.",
    },
    {
      id: "minicase-pensiun",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Dana pensiun 25 tahun: fee aktif vs ETF",
      prose: [
        "Rina, 30 tahun, menyisihkan Rp2 juta/bulan untuk pensiun (25 tahun). Penasihat A menawarkan reksa dana saham aktif (fee 2%/tahun, “pernah” return 14%/tahun). Penasihat B menawarkan ETF indeks (fee 0,2%/tahun, ekspektasi return pasar 10%/tahun).",
        "Pertanyaan: (a) Dengan asumsi return bruto keduanya SAMA (10%/tahun), berapa selisih hasil akhir akibat fee? (b) Argumen apa yang bisa membenarkan pilihan reksa dana aktif?",
        "Pembahasan: (a) Return neto A = 8%, B = 9,8%. Dari lab langkah 4 kamu tahu polanya: selisih 1,8%/tahun selama 25 tahun = ratusan juta hingga miliaran rupiah. Fee = pajak senyap yang brutal. (b) Reksa dana aktif hanya masuk akal jika manajernya konsisten mengalahkan pasar setelah fee — yang secara statistik jarang dan sulit diidentifikasi di muka. Klaim “pernah 14%” tanpa konteks periode dan risiko = marketing, bukan bukti.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko terbesar Rina bukan volatilitas pasar — melainkan kepastian fee yang menggerogoti return setiap tahun, apapun kinerja pasarnya.",
      },
      reference: "Sebelum membeli instrumen: apa yang kubeli, dari mana return-nya, kapan bisa jadi nol?",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "Saham = kepemilikan; return dari dividen + capital gain; klaim paling junior.",
        "Obligasi = surat utang; return dari kupon + pokok; senior dari saham tapi bisa default.",
        "Derivatif = kontrak atas aset lain; untuk hedging atau spekulasi ber-leverage; bisa hangus.",
        "Reksa dana/ETF = paket diversifikasi; cek isinya dan waspadai fee — fee kecil × puluhan tahun = besar.",
        "Tidak ada return tinggi tanpa risiko tinggi.",
      ],
      next: { label: "E3 — Time Value of Money", href: "/learn/e3-tvm" },
      quiz: [
        {
          q: "Perbedaan utama ETF vs reksa dana konvensional?",
          options: [
            { text: "ETF dijamin tidak rugi", why: "Salah: tidak ada instrumen pasar yang dijamin tidak rugi." },
            { text: "ETF diperdagangkan di bursa sepanjang hari dan umumnya berfee lebih rendah", why: "Benar: ETF = seperti saham (trading intraday) + umumnya pasif berfee rendah. Risikonya tetap mengikuti aset dasarnya.", correct: true },
            { text: "Reksa dana tidak bisa rugi", why: "Salah: reksa dana saham bisa turun tajam mengikuti pasar." },
            { text: "ETF hanya untuk institusi", why: "Salah: ritel bisa membeli ETF lewat sekuritas seperti membeli saham." },
          ],
        },
        {
          q: "Return obligasi terutama berasal dari…",
          options: [
            { text: "Dividen dan capital gain", why: "Salah: itu bahasa saham." },
            { text: "Kupon periodik + pengembalian pokok saat jatuh tempo", why: "Benar: obligasi = surat utang; return-nya dijanjikan di awal.", correct: true },
            { text: "Premi opsi", why: "Salah: premi = bahasa derivatif." },
            { text: "Selisih kurs", why: "Salah: selisih kurs = bahasa FX." },
          ],
        },
        {
          q: "Mengapa harga batubara/CPO penting bagi investor Indonesia?",
          options: [
            { text: "Tidak penting sama sekali", why: "Salah: Indonesia = negara komoditas." },
            { text: "Indonesia negara komoditas — harga komoditas memengaruhi APBN, laba emiten, dan IHSG", why: "Benar: boom komoditas mengangkat penerimaan negara dan laba emiten — dan sebaliknya saat bust.", correct: true },
            { text: "Karena OJK mewajibkan", why: "Salah: tidak ada kewajiban seperti itu." },
            { text: "Hanya penting untuk petani", why: "Salah: dampaknya ke APBN, emiten tambang/perkebunan, dan IHSG." },
          ],
        },
        {
          q: "Eksportir mengunci kurs USD/IDR 6 bulan ke depan dengan kontrak forward. Ini contoh penggunaan derivatif untuk…",
          options: [
            { text: "Spekulasi mencari untung", why: "Salah: eksportir SUDAH punya eksposur penerimaan USD — ia menghilangkan risiko, bukan menciptakannya." },
            { text: "Hedging — menghilangkan risiko yang sudah ada", why: "Benar: forward mengunci kepastian kurs untuk eksposur yang memang ada.", correct: true },
            { text: "Arbitrase", why: "Salah: arbitrase = profit bebas risiko dari mispricing, bukan penguncian kurs." },
            { text: "Investasi jangka panjang", why: "Salah: forward 6 bulan untuk kebutuhan operasional, bukan investasi." },
          ],
        },
      ],
    },
  ],
};
