import type { V2Lesson } from "../lib/types";

export const bcd36: V2Lesson = {
  slug: "bcd36-tokenisasi-rwa",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD36 — Tokenisasi RWA: Membawa Aset Nyata ke Rantai",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Obligasi Rp 100 miliar yang dibeli Rp 5 juta",
      prose: [
        "Sebuah perusahaan pembiayaan punya portofolio tagihan senilai Rp 100 miliar. Dulu, membeli bagiannya butuh Rp 1 miliar — hanya institusi yang bisa masuk. Setelah tokenisasi, aset itu dipecah menjadi 1 juta token seharga Rp 100.000 per token. Seorang investor ritel membeli 50 token dengan Rp 5 juta — 0,005 persen dari aset — dan menerima imbal hasil yang sama persis per rupiah dengan pemegang besar.",
        "Imbal hasil kotor aset 8 persen per tahun. Setelah biaya kustodi 0,8 persen dan platform 0,5 persen, imbal bersih 6,7 persen. Satu token Rp 100.000 tetap Rp 100.000 setelah setahun, tetapi pemegangnya menerima distribusi Rp 6.700 — nilai total Rp 106.700 (pokok + distribusi). Biaya legal satu kali 1,2 persen dari nilai aset — Rp 1,2 miliar — dibayar di awal oleh penerbit, bukan oleh pemegang token.",
        "Lesson ini mengajarkan tokenisasi RWA (Real World Assets) end-to-end: siklus hidup, struktur hukum, ekonomi, dan risiko. Setelah lesson ini kamu bisa: (1) menjelaskan siklus tokenisasi dari aset ke token ke penebusan; (2) membedakan token yang didukung aset dan klaim yang tidak didukung; (3) menghitung imbal bersih, harga token, dan porsi kepemilikan; (4) menilai risiko kustodi, hukum, dan likuiditas RWA; (5) membaca data on-chain protokol RWA dan membedakannya dari klaim pemasaran.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "BCD16 punya satu langkah penuh tentang RWA — definisi tokenisasi, dua arah (RWA ke rantai vs CBDC), dan satu lab yang mengklasifikasi instrumen termasuk satu token RWA. Lesson ini TIDAK mengulang langkah itu: ia membangun tokenisasi sebagai sistem lengkap — siklus hidup dan SPV, struktur biaya dan imbal bersih, risiko kustodi/hukum/likuiditas, serta cara membaca data on-chain protokol RWA — dengan lab yang menghitung ekonomi token dari angka mentah.",
      },
      reference: "Aset Rp 100 miliar = 1 juta token @ Rp 100.000. Imbal kotor 8 persen, bersih 6,7 persen; distribusi setahun Rp 6.700 per token, nilai total Rp 106.700. Investor Rp 5 juta = 50 token = 0,005 persen.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menilai token RWA dari struktur dan angkanya — bukan dari brosurnya.",
        "(1) Menjelaskan siklus tokenisasi: origination, SPV, penerbitan, distribusi, penebusan;",
        "(2) Membedakan token yang didukung aset, token klaim, dan token tanpa dukungan;",
        "(3) Menghitung imbal bersih, distribusi dan nilai total setelah setahun, dan porsi kepemilikan;",
        "(4) Menilai tiga risiko khas RWA: kustodi, hukum, dan likuiditas;",
        "(5) Membaca data on-chain protokol RWA: TVL, pemegang, dan arus penebusan.",
      ],
      tasks: [],
    },
    {
      id: "siklus",
      eyebrow: "Langkah 3 · Teori",
      title: "Siklus tokenisasi: dari aset ke token ke penebusan",
      prose: [
        "Langkah pertama adalah ORIGINATION: aset dipilih dan dinilai — tagihan, obligasi negara, properti, atau kredit korporat. Penilaian independen menentukan nilai wajar; tanpa ini, harga token tidak punya jangkar. Langkah kedua adalah STRUKTUR HUKUM: aset dipindahkan ke SPV (Special Purpose Vehicle) — perusahaan khusus yang hanya memegang aset itu. SPV adalah dinding hukum: BILA pemindahan asetnya sah (true sale), dokumen tokennya benar, dan yurisdiksinya mengakui pemisahan itu, aset di SPV tidak ikut disita kreditor penerbit bila penerbit bangkrut. Bila salah satu syarat itu gagal — misalnya transfernya dicatat sebagai pinjaman, bukan penjualan, atau SPV-nya sendiri yang bangkrut — dinding itu runtuh.",
        "Langkah ketiga adalah PENERBITAN: SPV menerbitkan token yang mewakili klaim atas aset atau atas arus kasnya. Satu token sama dengan satu bagian — Rp 100.000 dalam contoh kita. Kontrak token mencatat siapa memegang berapa; kontrak kedua (atau modul yang sama) mencatat aturan transfer — misalnya hanya alamat yang sudah KYC yang boleh menerima. Langkah keempat adalah DISTRIBUSI: token dijual ke investor, langsung atau lewat platform, dengan prospektus yang menjelaskan aset, biaya, dan risiko.",
        "Langkah kelima adalah SERVICING: selama aset menghasilkan arus kas — kupon obligasi, cicilan tagihan, sewa properti — arus itu dikumpulkan SPV, dipotong biaya, dan dibagikan ke pemegang token, biasanya lewat stablecoin. Langkah keenam adalah PENEBUSAN: saat aset jatuh tempo atau dijual, SPV membagikan hasilnya dan token dibakar. Siklus yang sehat bisa diaudit di tiap langkah: asetnya ada (laporan kustodian), arusnya masuk (rekening SPV), pembagiannya cocok (data on-chain).",
        "Tiga jenis token yang harus dibedakan. Token DIDUKUNG ASET: ada aset di SPV dan audit kustodian berkala — klaimmu punya isi. Token KLAIM: kamu hanya punya klaim kontraktual atas penerbit, tanpa aset yang dipisahkan — bila penerbit bangkrut, kamu antre bersama kreditor lain. Token TANPA DUKUNGAN: namanya memakai aset terkenal tetapi tidak ada hubungan hukum — ini bukan RWA, ini pemasaran. Pertanyaan pertama analis pada token RWA apa pun: tunjukkan SPV-nya dan laporan kustodiannya.",
      ],
      tasks: [],
      note: {
        title: "SPV bukan formalitas",
        body: "Tanpa SPV, 'tokenisasi' hanya berarti perusahaan berjanji membayar — sama dengan obligasi biasa, hanya dicatat di rantai. SPV-lah yang mengubah janji menjadi klaim atas aset yang dipisahkan. Tetapi SPV bukan jaminan otomatis: pemisahan itu harus dibuktikan — true sale, dokumen token, dan yurisdiksi yang mengakuinya. Bila sebuah proyek RWA tidak bisa menunjukkan dokumen SPV dan struktur hukumnya, perlakukan tokennya sebagai klaim tanpa dukungan — berapa pun TVL-nya.",
      },
      reference: "Siklus: origination → SPV → penerbitan → distribusi → servicing → penebusan. Tiga jenis: didukung aset, klaim, tanpa dukungan.",
    },
    {
      id: "ekonomi",
      eyebrow: "Langkah 4 · Teori",
      title: "Ekonomi token: imbal bersih dan porsi kepemilikan",
      prose: [
        "Ekonomi RWA dihitung dari tiga angka: imbal kotor aset, biaya berjalan, dan biaya satu kali. Imbal kotor 8 persen per tahun dikurangi kustodi 0,8 persen dan platform 0,5 persen sama dengan imbal bersih 6,7 persen. Satu token Rp 100.000 TIDAK menjadi Rp 106.700: imbal 6,7 persen DIBAYARKAN sebagai distribusi tunai — Rp 6.700 per token — dan harga tokennya tetap Rp 100.000. Nilai total yang dipegang investor adalah Rp 106.700 (pokok + distribusi), dengan asumsi pokok utuh dan distribusi dibayar. Menyebut 'harga token Rp 106.700' adalah kesalahan: harga token dan distribusi yang sudah diterima tidak bisa dijumlahkan sebagai harga. Biaya legal satu kali 1,2 persen dari Rp 100 miliar sama dengan Rp 1,2 miliar — dibayar penerbit di awal; bila dibebankan ke pemegang, imbal tahun pertama turun menjadi 5,5 persen.",
        "Porsi kepemilikan adalah aritmetika sederhana yang sering disalahpahami. Investor Rp 5 juta membeli 50 token dari 1 juta token — 0,005 persen dari aset. Ia menerima 0,005 persen dari tiap distribusi: dari distribusi Rp 6,7 miliar (imbal bersih setahun), bagiannya Rp 335.000. Angka kecil ini bukan kelemahan — ia adalah inti tokenisasi: akses yang dulu butuh Rp 1 miliar kini butuh Rp 100.000.",
        "Perbandingan yang jujur dengan reksa dana: RWA token memberi kepemilikan fraksional dan penyelesaian instan, tetapi biayanya sering lebih tinggi (kustodi + platform + legal) dan likuiditas sekundernya belum tentu ada. Reksa dana memberi diversifikasi dan regulasi yang matang, tetapi minimum investasi dan proses penebusan yang lambat. Tokenisasi bukan 'reksa dana yang lebih baik' — ia adalah kemasan berbeda dengan trade-off berbeda.",
        "Risiko likuiditas adalah yang paling sering diremehkan. Token bisa diperdagangkan 24 jam — bila ada pembeli. Banyak token RWA tidak punya pasar sekunder yang aktif: kamu bisa membeli dengan mudah di penerbitan, tetapi menjualnya berarti menunggu penebusan atau mencari pembeli sendiri. Likuiditas yang dijanjikan brosur dan likuiditas yang ada di order book adalah dua hal berbeda — periksa kedalaman pasar sebelum percaya.",
      ],
      tasks: [],
      note: {
        title: "Imbal bersih bukan imbal yang dijanjikan",
        body: "Brosur RWA hampir selalu menulis imbal kotor aset — 8 persen terdengar lebih baik dari 6,7 persen. Aturan analis: hitung sendiri dari prospektus — kurangi semua biaya berjalan, lalu tanyakan siapa membayar biaya satu kali. Bila prospektus tidak merinci biaya, itu sendiri adalah temuan: biaya yang tidak tertulis adalah biaya yang akan muncul belakangan.",
      },
      reference: "Imbal bersih 6,7 persen; distribusi Rp 6.700 per token, nilai total Rp 106.700. 50 token = 0,005 persen; distribusi Rp 6,7 miliar berarti bagian Rp 335.000.",
    },
    {
      id: "lab-rwa",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: kalkulator ekonomi token RWA",
      prose: [
        "Lab ini membangun kalkulator ekonomi token: dari nilai aset, jumlah token, imbal kotor, biaya kustodi dan platform, serta investasi seorang investor — hitung harga token, imbal bersih, distribusi setahun per token, nilai total setelah setahun, jumlah token investor, dan porsi kepemilikannya.",
        "Hitung dulu di kepala. Harga token: Rp 100 miliar dibagi 1 juta token sama dengan Rp 100.000. Imbal bersih: 8 dikurangi 0,8 dikurangi 0,5 sama dengan 6,7 persen. Distribusi setahun: 100.000 dikali 6,7 persen sama dengan Rp 6.700 per token — dibayarkan tunai, bukan menaikkan harga token. Nilai total setelah setahun: 100.000 ditambah 6.700 sama dengan Rp 106.700 (pokok + distribusi). Jumlah token investor: Rp 5 juta dibagi Rp 100.000 sama dengan 50 token. Porsi: 5 juta dibagi 100 miliar dikali 100 sama dengan 0,005 persen.",
        "Tugas lab: tulis fungsi yang menerima nilai_aset, jumlah_token, imbal_kotor, biaya_kustodi, biaya_platform, dan investasi — lalu mencetak enam angka: harga_token, imbal_bersih, distribusi_setahun, nilai_total, token_investor, porsi_persen. Enam angka ini adalah jawaban atas pertanyaan investor: berapa bagian saya, dan berapa hasilnya?",
        "Setelah lolos, coba eksperimen: naikkan biaya platform menjadi 2,0 persen dan lihat imbal bersih turun menjadi 5,2 persen — lalu tanyakan: pada biaya berapa token ini kalah dari deposito bank yang memberi 5,5 persen tanpa risiko token?",
      ],
      tasks: [
        { id: "t1", text: "Hitung harga token dan imbal bersih" },
        { id: "t2", text: "Hitung distribusi setahun dan nilai total setelah setahun" },
        { id: "t3", text: "Hitung jumlah token dan porsi kepemilikan investor Rp 5 juta" },
      ],
      expected: "harga_token=100000.0\nimbal_bersih=6.7\ndistribusi_setahun=6700.0\nnilai_total=106700.0\ntoken_investor=50.0\nporsi_persen=0.005",
      hints: [
        "Harga token = nilai_aset dibagi jumlah_token.",
        "Imbal bersih = imbal_kotor dikurangi biaya_kustodi dikurangi biaya_platform.",
        "Distribusi setahun = harga_token dikali imbal_bersih / 100; nilai total = harga_token + distribusi_setahun.",
        "Porsi persen = investasi dibagi nilai_aset, dikali 100.",
      ],
      code: {
        starter: `# Kalkulator ekonomi token RWA (rupiah).\nnilai_aset = 100_000_000_000\njumlah_token = 1_000_000\nimbal_kotor = 8.0  # persen per tahun\nbiaya_kustodi = 0.8  # persen per tahun\nbiaya_platform = 0.5  # persen per tahun\ninvestasi = 5_000_000\n\n# TULIS KODEMU: hitung enam angka ekonomi token di bawah ini.\n# Cetak, per baris: harga_token, imbal_bersih, distribusi_setahun,\n# nilai_total, token_investor, porsi_persen.\n\n\nkalkulator_rwa(nilai_aset, jumlah_token, imbal_kotor, biaya_kustodi, biaya_platform, investasi)`,
        lockLines: 6,
        solution: `# Kalkulator ekonomi token RWA (rupiah).\nnilai_aset = 100_000_000_000\njumlah_token = 1_000_000\nimbal_kotor = 8.0  # persen per tahun\nbiaya_kustodi = 0.8  # persen per tahun\nbiaya_platform = 0.5  # persen per tahun\ninvestasi = 5_000_000\n\n\ndef kalkulator_rwa(nilai_aset, jumlah_token, imbal_kotor, biaya_kustodi, biaya_platform, investasi):\n    harga_token = nilai_aset / jumlah_token\n    imbal_bersih = imbal_kotor - biaya_kustodi - biaya_platform\n    distribusi_setahun = harga_token * imbal_bersih / 100
    nilai_total = harga_token + distribusi_setahun\n    token_investor = investasi / harga_token\n    porsi_persen = investasi / nilai_aset * 100\n    print(f"harga_token={harga_token}")\n    print(f"imbal_bersih={imbal_bersih}")\n    print(f"distribusi_setahun={distribusi_setahun}")
    print(f"nilai_total={nilai_total}")\n    print(f"token_investor={token_investor}")\n    print(f"porsi_persen={porsi_persen}")\n\n\nkalkulator_rwa(nilai_aset, jumlah_token, imbal_kotor, biaya_kustodi, biaya_platform, investasi)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "harga_token=100000.0", label: "Harga token Rp 100.000", msg: "100 miliar / 1 juta = Rp 100.000 per token." },
          { kind: "stdout_matches", task: "t1", pattern: "imbal_bersih=6.7", label: "Imbal bersih 6,7 persen", msg: "8 - 0,8 - 0,5 = 6,7 persen. Brosur menulis 8 — analis menulis 6,7." },
          { kind: "stdout_matches", task: "t2", pattern: "distribusi_setahun=6700.0", label: "Distribusi setahun Rp 6.700", msg: "100.000 x 6,7% = Rp 6.700 per token — dibayarkan tunai, bukan menaikkan harga token." },
          { kind: "stdout_matches", task: "t2", pattern: "nilai_total=106700.0", label: "Nilai total Rp 106.700", msg: "100.000 + 6.700 = Rp 106.700 — pokok + distribusi, bukan harga token." },
          { kind: "stdout_matches", task: "t3", pattern: "token_investor=50.0", label: "Investor mendapat 50 token", msg: "5 juta / 100.000 = 50 token." },
          { kind: "stdout_matches", task: "t3", pattern: "porsi_persen=0.005", label: "Porsi 0,005 persen", msg: "5 juta / 100 miliar x 100 = 0,005 persen dari aset." },
        ],
      },
      reference: "Harga token Rp 100.000; imbal bersih 6,7 persen; distribusi Rp 6.700/token, nilai total Rp 106.700; investor 50 token = 0,005 persen.",
    },
    {
      id: "risiko-data",
      eyebrow: "Langkah 6 · Teori",
      title: "Risiko dan data on-chain: membaca protokol RWA",
      prose: [
        "Tiga risiko khas RWA. Pertama, KUSTODI: siapa memegang aset dasarnya — bank kustodian berlisensi, atau perusahaan afiliasi penerbit? Laporan kustodian berkala (proof of reserves) adalah minimum; tanpa itu, token bisa beredar tanpa aset. Kedua, HUKUM: yurisdiksi SPV, status token sebagai sekuritas, dan apa yang terjadi bila penerbit digugat — token di rantai tidak melindungi dari pengadilan di dunia nyata. Ketiga, LIKUIDITAS: pasar sekunder yang tipis berarti harga token di DEX bisa menyimpang jauh dari nilai aset — diskon 20 persen pada token 'stabil' adalah sinyal, bukan peluang.",
        "Data on-chain yang dibaca analis: TVL protokol RWA (klaim berapa aset yang di-tokenisasi — angka on-chain tidak membuktikan aset dasarnya ada; cocokkan dengan laporan kustodian), jumlah pemegang unik (apakah tersebar atau 3 dompet menguasai 90 persen), arus penebusan (apakah penebusan berjalan lancar atau antre), dan kesesuaian antara suplai token dan laporan kustodian (bila token beredar melebihi aset yang dikustodi, ada yang salah). Empat angka ini membentuk pemeriksaan kewarasan — sanity check — sebelum membaca prospektus.",
        "Satu pola penipuan yang berulang: protokol mengklaim TVL besar dari aset yang 'akan' di-tokenisasi — asetnya belum ada di SPV, tetapi tokennya sudah dijual. Pembedanya sederhana: laporan kustodian dengan tanggal dan jumlah yang cocok dengan suplai token hari itu. Bila laporan terakhir berumur 6 bulan, perlakukan klaim TVL sebagai klaim, bukan fakta.",
      ],
      tasks: [],
      note: {
        title: "Diskon bukan peluang otomatis",
        body: "Token RWA yang diperdagangkan 20 persen di bawah nilai asetnya bisa berarti dua hal: pasar tidak efisien (peluang) atau pasar tahu sesuatu yang kamu tidak tahu (peringatan). Sebelum membeli diskon, cari tahu: apakah penebusan masih jalan? Apakah laporan kustodian terbaru cocok? Apakah ada gugatan? Diskon tanpa jawaban atas tiga pertanyaan itu adalah jebakan, bukan peluang.",
      },
      reference: "Risiko: kustodi, hukum, likuiditas. Data: TVL, pemegang unik, arus penebusan, kesesuaian suplai vs kustodian.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: token obligasi yang lolos uji, token properti yang tidak",
      prose: [
        "Analis membandingkan dua token RWA. Token obligasi negara: SPV di yurisdiksi jelas, kustodian bank besar dengan laporan bulanan, suplai token cocok dengan laporan, 4.200 pemegang, penebusan berjalan tiap kuartal. Imbal bersih 6,7 persen — tidak spektakuler, tetapi semua angka bisa diverifikasi. Vonis: layak dengan batas eksposur.",
        "Token properti: imbal dijanjikan 14 persen, tetapi tidak ada dokumen SPV yang bisa ditemukan, laporan kustodian terakhir 8 bulan lalu, suplai token 30 persen di atas nilai properti yang diklaim, dan 3 dompet menguasai 85 persen suplai. Vonis: tolak — 14 persen adalah harga risiko yang tidak bisa diukur, bukan peluang.",
        "Enam bulan kemudian token obligasi membayar kupon tepat waktu; token properti membekukan penebusan dengan alasan 'restrukturisasi'. Perbedaannya bukan keberuntungan — melainkan apakah analis memeriksa SPV, kustodian, dan kesesuaian suplai sebelum percaya pada angka imbal.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat vonis ini benar. Pertama, struktur diperiksa sebelum imbal — SPV dan kustodian dulu, persen kemudian. Kedua, data on-chain dipakai sebagai pemeriksaan kewarasan terhadap klaim prospektus. Ketiga, vonisnya berani menolak imbal 14 persen — menolak adalah keputusan analis yang paling sulit dan paling berharga.",
      },
      reference: "Token obligasi lolos: SPV jelas + kustodian bulanan + suplai cocok + 4.200 pemegang. Token properti gagal: tanpa SPV + laporan 8 bulan + suplai 30 persen di atas aset.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Siklus: origination → SPV → penerbitan → distribusi → servicing → penebusan.",
        "Tiga jenis: didukung aset, klaim, tanpa dukungan — periksa SPV dan kustodian.",
        "Lab: harga Rp 100.000; imbal bersih 6,7 persen; distribusi Rp 6.700/token, nilai total Rp 106.700; 50 token = 0,005 persen.",
        "Risiko: kustodi, hukum, likuiditas — diskon bukan peluang otomatis.",
        "Data: TVL, pemegang unik, arus penebusan, kesesuaian suplai vs kustodian.",
      ],
      next: { label: "BCD37 — ZK-Proof dan ZK-Rollup: Bukti Tanpa Membuka Data", href: "/v2/learn/bcd37-zk-rollup" },
      quiz: [
        {
          q: "Aset Rp 100 miliar, 1 juta token, imbal kotor 8 persen, kustodi 0,8 persen, platform 0,5 persen. Investor Rp 5 juta. Berapa harga token, imbal bersih, dan porsinya?",
          options: [
            { text: "Rp 100.000; 6,7 persen; 50 token = 0,005 persen", why: "Tepat: 100 miliar/1 juta = 100.000; 8-0,8-0,5 = 6,7; 5 juta/100.000 = 50 token = 0,005 persen.", correct: true },
            { text: "Rp 100.000; 8 persen; 50 token = 5 persen", why: "Salah: 8 persen adalah imbal kotor — brosur, bukan analis. Porsi 5 juta/100 miliar adalah 0,005 persen, bukan 5 persen." },
            { text: "Rp 1.000.000; 6,7 persen; 5 token = 0,005 persen", why: "Salah: harga token 100 miliar/1 juta = 100.000, bukan 1 juta — satu nol mengubah segalanya." },
            { text: "Rp 100.000; 5,5 persen; 50 token = 0,05 persen", why: "Salah: 5,5 persen adalah imbal bila biaya legal satu kali dibebankan ke tahun pertama — bukan imbal bersih berjalan. Porsi 0,005, bukan 0,05." },
          ],
        },
        {
          q: "Apa fungsi SPV dalam tokenisasi RWA?",
          options: [
            { text: "Mempercepat perdagangan token di DEX", why: "Salah: kecepatan perdagangan ditentukan likuiditas pasar, bukan SPV." },
            { text: "Memisahkan aset dari penerbit — bila penerbit bangkrut, aset di SPV tidak ikut disita kreditor", why: "Tepat: SPV adalah dinding hukum yang mengubah janji menjadi klaim atas aset yang dipisahkan — dengan catatan pemisahan itu hanya berlaku bila transfernya sah (true sale), dokumennya benar, dan yurisdiksinya mengakuinya; tanpa itu, aset tetap bisa terseret.", correct: true },
            { text: "Menjamin imbal hasil yang dijanjikan brosur", why: "Salah: SPV tidak menjamin imbal — ia hanya memisahkan kepemilikan aset." },
            { text: "Menggantikan kustodian — SPV menyimpan asetnya sendiri", why: "Salah: SPV adalah wadah hukum; kustodian adalah lembaga yang menyimpan dan melaporkan asetnya." },
          ],
        },
        {
          q: "Suplai token 30 persen di atas nilai aset yang diklaim, laporan kustodian terakhir 8 bulan lalu. Apa vonis yang benar?",
          options: [
            { text: "Beli — suplai lebih besar berarti permintaan tinggi", why: "Salah: suplai token di atas aset berarti token beredar tanpa dukungan penuh — bukan permintaan." },
            { text: "Tolak — token beredar tanpa dukungan yang bisa diverifikasi; laporan basi berarti tidak ada bukti asetnya masih ada", why: "Tepat: dua sinyal merah independen — kesesuaian suplai dan kesegaran laporan — cukup untuk menolak.", correct: true },
            { text: "Tunggu — 8 bulan masih wajar untuk laporan kustodian", why: "Salah: laporan kustodian RWA yang sehat terbit bulanan atau kuartalan. 8 bulan berarti tidak ada yang memeriksa." },
            { text: "Beli sedikit — 30 persen masih dalam toleransi", why: "Salah: tidak ada toleransi 30 persen untuk ketidaksesuaian suplai vs aset. Itu bukan selisih pembulatan." },
          ],
        },
        {
          q: "Token RWA diperdagangkan 20 persen di bawah nilai asetnya. Apa yang harus dilakukan analis SEBELUM menyimpulkan ini peluang?",
          options: [
            { text: "Langsung beli — diskon 20 persen selalu peluang arbitrase", why: "Salah: diskon bisa berarti pasar tahu sesuatu yang kamu tidak tahu. Beli tanpa memeriksa adalah judi." },
            { text: "Periksa: apakah penebusan masih jalan, apakah laporan kustodian terbaru cocok, apakah ada gugatan", why: "Tepat: tiga pertanyaan ini membedakan inefisiensi pasar dari peringatan.", correct: true },
            { text: "Tunggu harga kembali ke nilai aset — pasar selalu benar dalam seminggu", why: "Salah: pasar tidak selalu kembali — bila ada masalah nyata, harga tidak kembali." },
            { text: "Abaikan — harga DEX tidak relevan untuk RWA", why: "Salah: harga DEX adalah satu-satunya harga pasar sekunder yang ada — mengabaikannya berarti mengabaikan likuiditas." },
          ],
        },
        {
          q: "Mana yang membedakan token RWA yang didukung aset dari token klaim?",
          options: [
            { text: "Token didukung aset punya imbal lebih tinggi", why: "Salah: imbal tidak menentukan dukungan — token klaim bisa menjanjikan imbal lebih tinggi justru karena risikonya lebih besar." },
            { text: "Token didukung aset punya aset di SPV dengan audit kustodian berkala; token klaim hanya janji kontraktual atas penerbit", why: "Tepat: pembedanya adalah apakah ada aset yang dipisahkan dan bisa diaudit — bukan besar imbalnya.", correct: true },
            { text: "Token didukung aset hanya bisa dibeli institusi", why: "Salah: justru tokenisasi membuka akses ritel — pembedanya struktur hukum, bukan siapa pembelinya." },
            { text: "Tidak ada bedanya — keduanya sama-sama token", why: "Salah: bedanya adalah apa yang terjadi bila penerbit bangkrut — dan itu beda yang menentukan segalanya." },
          ],
        },
      ],
    },
  ],
};
