import type { V2Lesson } from "../lib/types";

export const e1: V2Lesson = {
  slug: "e1-struktur-pasar",
  track: "Financial Markets",
  module: "Fondasi Pasar",
  title: "E1. Struktur Pasar: Ke Mana Uang Mengalir?",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-primer",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "IPO Rp100 miliar — lalu uangnya ke mana?",
      prose: [
        "PT MajuMundur IPO: menjual 100 juta lembar saham @ Rp1.000 — total Rp100 miliar masuk ke kas perusahaan. Budi ikut IPO. Sebulan kemudian harga naik ke Rp1.500, Budi menjual 1.000 lembarnya ke Ani. Ani bangga: ia merasa sudah memberi modal Rp1,5 juta ke MajuMundur.",
        "Salah. Perusahaan menerima Rp0 dari transaksi Budi–Ani. Uang Rp1,5 juta berpindah dari Ani ke Budi — MajuMundur tidak kebagian sepeser pun. Inilah perbedaan paling fundamental di pasar keuangan: pasar primer (uang mengalir ke perusahaan) vs pasar sekunder (uang berpindah antar investor).",
        "Mayoritas transaksi yang kamu lihat di aplikasi sekuritas terjadi di pasar yang tidak memberi sepeser pun ke perusahaan. Memahami dua pasar ini = memahami ke mana sebenarnya uangmu pergi setiap kali menekan tombol beli.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dana_bruto` dari IPO (lembar × harga)" },
        { id: "t2", text: "Hitung `dana_bersih` setelah fee underwriter 3%" },
      ],
      expected: "dana_bersih=97000000000",
      note: {
        title: "Sering salah",
        body: "Mengira beli saham di bursa = memberi modal ke perusahaan. Hanya di pasar primer (IPO, rights issue) uangmu sampai ke emiten.",
      },
      hints: [
        "Dana bruto = jumlah lembar dikali harga IPO per lembar.",
        "Fee = dana bruto × 0,03. Dana bersih = dana bruto − fee.",
        "dana_bersih = lembar * harga_ipo * (1 - 0.03)",
      ],
      code: {
        starter: `lembar = 100_000_000  # lembar saham IPO\nharga_ipo = 1_000    # Rp per lembar\nfee_pct = 0.03       # fee underwriter 3%\n\n# TULIS KODEMU: dana bruto dan dana bersih ke perusahaan\ndana_bruto = \ndana_bersih = \n\nprint(f"dana_bruto={dana_bruto:.0f}")\nprint(f"dana_bersih={dana_bersih:.0f}")`,
        lockLines: 3,
        solution: `lembar = 100_000_000  # lembar saham IPO\nharga_ipo = 1_000    # Rp per lembar\nfee_pct = 0.03       # fee underwriter 3%\n\n# TULIS KODEMU: dana bruto dan dana bersih ke perusahaan\ndana_bruto = lembar * harga_ipo\ndana_bersih = dana_bruto * (1 - fee_pct)\n\nprint(f"dana_bruto={dana_bruto:.0f}")\nprint(f"dana_bersih={dana_bersih:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dana_bruto", value: 100000000000, tol: 1, label: "`dana_bruto` seharusnya 100 miliar", msg: "100 juta lembar × Rp1.000 = Rp100 miliar. Cek perkaliannya." },
          { kind: "equal", task: "t2", name: "dana_bersih", value: 97000000000, tol: 1, label: "`dana_bersih` seharusnya 97 miliar", msg: "Kurangi fee 3% dari dana bruto: × (1 − 0,03)." },
          { kind: "stdout_matches", task: "t2", pattern: "dana_bersih=97000000000", label: "`print` menampilkan dana bersih", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Pasar primer = sekuritas diterbitkan pertama kali, uang ke emiten. Pasar sekunder = diperdagangkan antar investor.",
    },
    {
      id: "pasar-uang-modal",
      eyebrow: "Langkah 2 · Pasar uang vs pasar modal",
      title: "Parkiran vs perkebunan: pembedanya tenor",
      prose: [
        "Pembedanya adalah tenor (jangka waktu). Pasar uang (money market): instrumen utang berjangka pendek — jatuh tempo ≤ 1 tahun. Contoh: deposito, Sertifikat Rupiah Bank Indonesia (SRBI), commercial paper, repo. Pasar modal (capital market): instrumen berjangka panjang — > 1 tahun. Contoh: saham, obligasi/SBN bertenor panjang, reksa dana, ETF.",
        "Pasar uang itu parkiran — dana singgah sementara, aman, gampang keluar-masuk. Pasar modal itu perkebunan — ditanam lama, hasilnya lebih besar tapi harus tahan cuaca (volatilitas). Dana darurat dan kas operasional → pasar uang. Dana pensiun dan tujuan 5–10 tahun → pasar modal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira “pasar uang” = tempat jual-beli mata uang (valas). Pasar uang = instrumen utang jangka pendek (deposito, SRBI). Jual-beli mata uang asing itu pasar valuta asing — pasar yang berbeda.",
      },
      reference: "≤ 1 tahun = pasar uang. > 1 tahun = pasar modal. Pembedanya tenor, bukan institusinya.",
    },
    {
      id: "bursa-otc",
      eyebrow: "Langkah 3 · Bursa vs OTC",
      title: "Supermarket vs pasar negosiasi",
      prose: [
        "Bursa (exchange) = pasar terorganisir dengan aturan baku, harga transparan, dan kliring terpusat. Contoh: IDX untuk saham. OTC (over-the-counter) = transaksi bilateral langsung antar pihak, biasanya via dealer/bank, tanpa bursa terpusat. Contoh: sebagian besar perdagangan obligasi korporasi dan valas antar bank.",
        "Bursa itu supermarket — harga terpampang, semua orang melihat harga yang sama. OTC itu pasar negosiasi — harga tergantung siapa lawan bicaramu. Lima pelaku pasar: emiten, investor (ritel/institusi), broker/sekuritas, dealer/market maker, dan underwriter (di pasar primer).",
        "Wasit Indonesia: OJK mengawasi pasar modal dan melindungi investor; BI mengatur moneter dan pasar uang; Bappebti mengawasi berjangka komoditi dan kripto; LPS menjamin simpanan bank; KSEI/KPEI memastikan settlement beres.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira OTC = pasar gelap/ilegal. OTC hanya berarti “di luar bursa” — sepenuhnya legal. Risikonya: harga kurang transparan dan ada risiko lawan transaksi (counterparty risk).",
      },
      reference: "Bursa = transparan + kliring terpusat. OTC = bilateral via dealer, legal tapi kurang transparan.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan dari materi di atas. Jawab, lalu baca alasannya — terutama untuk opsi yang salah.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Ani membeli saham di bursa dari Budi (bukan saat IPO). Siapa yang menerima uang Ani?",
          options: [
            { text: "Perusahaan penerbit saham", why: "Salah: perusahaan hanya menerima dana di pasar primer (IPO/rights issue), bukan dari transaksi bursa harian." },
            { text: "Budi, penjual sahamnya", why: "Benar: ini transaksi pasar sekunder — uang berpindah antar investor.", correct: true },
            { text: "Bursa Efek Indonesia", why: "Salah: bursa hanya menyediakan tempat dan sistem perdagangannya, bukan pihak transaksinya." },
            { text: "OJK sebagai regulator", why: "Salah: OJK mengawasi pasar, tidak menerima dana transaksi." },
          ],
        },
        {
          q: "Perdagangan obligasi korporasi antar bank yang dinegosiasikan langsung tanpa bursa disebut…",
          options: [
            { text: "Perdagangan ilegal", why: "Salah: OTC sepenuhnya legal — hanya berarti di luar bursa terpusat." },
            { text: "OTC (over-the-counter)", why: "Benar: negosiasi bilateral antar pihak tanpa bursa. Konsekuensinya: harga kurang transparan + risiko counterparty.", correct: true },
            { text: "IPO", why: "Salah: IPO = penawaran perdana di pasar primer, bukan perdagangan antar bank." },
            { text: "Rights issue", why: "Salah: rights issue = penerbitan saham baru untuk pemegang lama di pasar primer." },
          ],
        },
      ],
    },
    {
      id: "lab-spread",
      eyebrow: "Langkah 5 · Lab: bid-ask spread",
      title: "Pajak tak terlihat di setiap transaksi",
      prose: [
        "Kamu beli di harga ask, jual di harga bid. Selisihnya = biaya yang kamu bayar ke market maker setiap round-trip. Di saham likuid spread tipis; di saham sepi bisa 2–5% — kamu rugi sebelum harga bergerak.",
        "Hitung mid-price, spread, dan biaya round-trip 1.000 lembar dari kuotasi bid Rp1.490 / ask Rp1.510.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mid` (tengah bid-ask) dan `spread`" },
        { id: "t2", text: "Hitung `spread_pct` dan `biaya` round-trip 1.000 lembar" },
      ],
      expected: "mid=1500  spread=20  spread_pct=1.33  biaya=20000",
      note: {
        title: "Sering salah",
        body: "Mengira biaya trading cuma fee broker 0,15%. Total biaya = fee broker + spread + market impact. Di saham tidak likuid, spread bisa 10× lipat fee broker.",
      },
      hints: [
        "Mid = rata-rata bid dan ask. Spread = ask − bid.",
        "spread_pct = spread / mid × 100. Biaya = spread × lembar.",
        "spread_pct = spread / mid * 100\nbiaya = spread * lembar",
      ],
      code: {
        starter: `bid = 1490   # harga jual (yang berani dibayar pembeli)\nask = 1510   # harga beli (yang diminta penjual)\nlembar = 1000\n\n# TULIS KODEMU: mid, spread, spread_pct, biaya round-trip\nmid = \nspread = \nspread_pct = \nbiaya = \n\nprint(f"mid={mid:.0f}  spread={spread:.0f}  spread_pct={spread_pct:.2f}  biaya={biaya:.0f}")`,
        lockLines: 3,
        solution: `bid = 1490   # harga jual (yang berani dibayar pembeli)\nask = 1510   # harga beli (yang diminta penjual)\nlembar = 1000\n\n# TULIS KODEMU: mid, spread, spread_pct, biaya round-trip\nmid = (bid + ask) / 2\nspread = ask - bid\nspread_pct = spread / mid * 100\nbiaya = spread * lembar\n\nprint(f"mid={mid:.0f}  spread={spread:.0f}  spread_pct={spread_pct:.2f}  biaya={biaya:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mid", value: 1500, tol: 1e-9, label: "`mid` seharusnya 1500", msg: "(1490 + 1510) / 2 = 1500. Itu harga wajar acuannya." },
          { kind: "equal", task: "t1", name: "spread", value: 20, tol: 1e-9, label: "`spread` seharusnya 20", msg: "1510 − 1490 = 20. Spread = ask − bid." },
          { kind: "equal", task: "t2", name: "spread_pct", value: 1.3333, tol: 0.01, label: "`spread_pct` sekitar 1,33", msg: "20 / 1500 × 100 = 1,33%. Jangan lupa × 100." },
          { kind: "equal", task: "t2", name: "biaya", value: 20000, tol: 1e-9, label: "`biaya` seharusnya 20000", msg: "Spread Rp20 × 1.000 lembar = Rp20.000 per round-trip." },
          { kind: "stdout_matches", task: "t2", pattern: "mid=1500\\s+spread=20\\s+spread_pct=1\\.33\\s+biaya=20000", label: "`print` menampilkan empat angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Spread = ask − bid. Biaya round-trip ≈ spread × lembar. Spread = pajak likuiditas.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Uangmu mau ke mana? Empat skenario",
      prose: [
        "Perusahaan butuh modal ekspansi → pasar primer (IPO, rights issue): hanya di sinilah uang investor sampai ke kas emiten. Dana nganggur 3 bulan dan tidak boleh berkurang → pasar uang (deposito/SRBI): pokok stabil, horizon pendek.",
        "Ingin bisa jual kapan saja dengan harga transparan → bursa yang likuid: kuotasi publik + kliring terpusat; waspadai spread lebar di OTC. Dana pensiun 20 tahun lagi → pasar modal: horizon panjang memberi waktu pulih dari volatilitas, dengan ekspektasi return lebih tinggi.",
        "Aturan 10 detik: (1) Uang ke siapa? Ke emiten = primer, antar investor = sekunder. (2) Kapan butuh uangnya? < 1 tahun = pasar uang, > 5 tahun = pasar modal. (3) Butuh jual cepat? Pilih instrumen bursa yang likuid.",
      ],
      tasks: [],
      reference: "Primer = uang ke emiten. Tenor = penentu pasar uang/modal. Likuiditas = syarat jual cepat.",
    },
    {
      id: "minicase-ipo",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Startup KilatKilat butuh Rp500 miliar",
      prose: [
        "Startup logistik “KilatKilat” butuh Rp500 miliar untuk ekspansi gudang. Opsi A: IPO di IDX (fee underwriter 5%, proses 6–9 bulan, laporan keuangan diaudit dan transparan). Opsi B: pinjam ke 3 bank via negosiasi bilateral (bunga 9%/tahun, proses 2 bulan, tanpa keterbukaan publik).",
        "Pertanyaan: (a) Opsi mana yang termasuk pasar primer, dan opsi mana yang mirip mekanisme OTC? (b) Jika KilatKilat memilih IPO lalu 2 tahun kemudian harga sahamnya naik 3× lipat, berapa tambahan kas yang diterima perusahaan dari kenaikan itu?",
        "Pembahasan: (a) IPO = pasar primer (sekuritas diterbitkan pertama kali, dana ke emiten). Pinjaman bank bilateral = mirip OTC — negosiasi langsung dua pihak tanpa bursa terpusat. (b) Rp0. Kenaikan harga di pasar sekunder tidak menambah kas perusahaan. Manfaatnya tidak langsung: valuasi tinggi memudahkan rights issue berikutnya dan menurunkan biaya modal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kenaikan harga saham ≠ kas bertambah. Analis yang menilai “perusahaan makin kuat karena sahamnya naik” tanpa cek arus kas sedang membaca indikator yang salah.",
      },
      reference: "Harga sekunder naik = kekayaan pemegang saham naik, bukan kas perusahaan.",
    },
    {
      id: "mikrostruktur-lanjut",
      eyebrow: "Langkah 8 · Pendalaman: mikrostruktur",
      title: "Di balik order book: siapa yang memungut spread-mu",
      prose: [
        "Setiap harga yang kamu lihat di aplikasi sekuritas lahir dari dua antrean: bid — daftar orang yang mau beli beserta harganya — dan ask — daftar orang yang mau jual. Kumpulan keduanya disebut order book. Best bid Rp1.490, best ask Rp1.510: selisih Rp20 itulah spread, dan depth (kedalaman) menunjukkan berapa lembar tersedia di tiap harga. Kamu tidak pernah bertransaksi “dengan pasar” — kamu bertransaksi dengan orang di ujung antrean itu.",
        "Yang selalu siap di kedua sisi antrean adalah market maker: pedagang yang terus-menerus memasang bid dan ask sekaligus. Keuntungannya = spread yang ia pungut dari setiap trader yang tidak sabar; risikonya = adverse selection — suatu saat lawan transaksinya adalah orang yang tahu sesuatu (misalnya pengumuman belum publik), dan market maker-lah yang rugi. Spread bukan pungli — ia premi risiko yang dibayar pasar kepada penyedia likuiditas.",
        "Di IDX ada dua pagar tambahan. Pertama, tick bertingkat (fraksi harga): di bawah Rp200 tick-nya Rp1, Rp200–500 tick Rp2, Rp500–2.000 tick Rp5, Rp2.000–5.000 tick Rp10, di atas Rp5.000 tick Rp25 — spread minimum ditentukan secara struktural oleh tick. Kedua, 1 lot = 100 lembar, plus batas auto-reject harian (ARA/ARB) yang mengunci pergerakan ekstrem. Saham Rp50.000 per lembar berarti 1 lot = Rp5 juta — “mahal” bukan soal harga per lembar, melainkan soal kelipatan lot.",
        "Biaya implisit = spread + market impact. Market order 1.200 lembar saat ask hanya menyediakan 500 lembar di harga terbaik akan “memakan” book: 500 lembar @Rp1.510, 700 lembar berikutnya @Rp1.520 — harga rata-ratamu Rp1.515,8, bukan Rp1.510. Selisih dari mid-price itulah pajak ketidaksabaranmu, dan di saham sepi ia bisa 10× lipat fee broker 0,15%.",
        "Aturan praktis: (1) sebelum entry, hitung spread ÷ mid — di atas 2%, instrumen itu mahal untuk ditradingkan; (2) market order hanya jika sizemu di bawah 10% depth yang terlihat; (3) mau hemat? Pasang limit order — kamu menjadi market maker mini: dapat harga lebih baik, risikonya order tidak tereksekusi; (4) jangan pernah market order besar di 15 menit pertama perdagangan — spread melebar saat semua orang berebut.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total_bayar` untuk market buy 1.200 lembar" },
        { id: "t2", text: "Hitung `biaya_implisit` vs mid-price" },
      ],
      expected: "total_bayar=1819000  biaya_implisit=19000",
      hints: [
        "500 lembar @1510, sisanya 700 lembar @1520.",
        "biaya_implisit = total_bayar − mid × lembar; mid = (1490+1510)/2.",
        "ambil1 = min(lembar, depth1); ambil2 = lembar − ambil1",
      ],
      code: {
        starter: `bid = 1490\nask1 = 1510\ndepth1 = 500\nask2 = 1520\ndepth2 = 2000\nlembar = 1200\n\n# TULIS KODEMU: total_bayar dan biaya_implisit vs mid\nmid = \nambil1 = \nambil2 = \ntotal_bayar = \nbiaya_implisit = \n\nprint(f"total_bayar={total_bayar:.0f}  biaya_implisit={biaya_implisit:.0f}")`,
        lockLines: 6,
        solution: `bid = 1490\nask1 = 1510\ndepth1 = 500\nask2 = 1520\ndepth2 = 2000\nlembar = 1200\n\n# TULIS KODEMU: total_bayar dan biaya_implisit vs mid\nmid = (bid + ask1) / 2\nambil1 = min(lembar, depth1)\nambil2 = lembar - ambil1\ntotal_bayar = ambil1 * ask1 + ambil2 * ask2\nbiaya_implisit = total_bayar - mid * lembar\n\nprint(f"total_bayar={total_bayar:.0f}  biaya_implisit={biaya_implisit:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total_bayar", value: 1819000, tol: 1, label: "`total_bayar` seharusnya 1819000", msg: "500×1510 + 700×1520 = 1.819.000. Order memakan dua level book." },
          { kind: "equal", task: "t2", name: "biaya_implisit", value: 19000, tol: 1, label: "`biaya_implisit` seharusnya 19000", msg: "1.819.000 − 1500×1200 = 19.000. Itu pajak ketidaksabaranmu." },
          { kind: "stdout_matches", task: "t2", pattern: "total_bayar=1819000\\s+biaya_implisit=19000", label: "`print` menampilkan dua angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: spread adalah harga ketidaksabaran",
        body: "Market maker tidak menebak arah harga — ia memungut tol dari orang yang terburu-buru. Setiap kali kamu menekan market order, kamu membayar dua hal: setengah spread ke market maker, dan informasi gratis ke seluruh pasar tentang ketidaksabaranmu. Tiga heuristik. Pertama: spread ÷ harga = biaya masuk; kali dua untuk round-trip. Saham dengan spread 1,5% memakan 3% per bolak-balik — butuh naik 3% hanya untuk impas, sebelum fee broker. Kedua: limit order membalik peran — kamu yang memungut spread dari orang tak sabar, dengan risiko order tak tereksekusi. Trader sabar = market maker tanpa modal besar. Ketiga: likuiditas itu semu tepat saat kamu paling membutuhkannya — depth Rp5 miliar terlihat kokoh sampai kamu harus jual Rp500 juta di hari panik; saat itulah book menipis dan spread meledak. Aturan 10%-nya: jangan pernah market order melebihi 10% dari depth yang terlihat, dan jangan trading saham yang spread-nya lebih besar dari ekspektasi return harianmu.",
      },
      reference: "Spread = premi likuiditas. Biaya implisit = spread + market impact. Limit = sabar, market = bayar.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari seluruh lesson. Setiap opsi punya alasannya.",
      ],
      tasks: [],
      summary: [
        "Primer = uang ke emiten (IPO, rights issue, lelang SBN). Sekunder = uang antar investor (bursa harian).",
        "Pasar uang = tenor ≤ 1 tahun (deposito, SRBI). Pasar modal = tenor > 1 tahun (saham, obligasi).",
        "Bursa = harga transparan + kliring terpusat. OTC = negosiasi bilateral, legal tapi kurang transparan.",
        "Pelaku: emiten, investor, broker, market maker, underwriter. Wasit: OJK (pasar modal), BI (moneter/pasar uang).",
        "Biaya trading = fee broker + spread + market impact — bukan cuma fee.",
      ],
      next: { label: "E2 — Instrumen Keuangan", href: "/learn/e2-instrumen" },
      quiz: [
        {
          q: "Deposito 6 bulan termasuk…",
          options: [
            { text: "Pasar modal, karena lewat bank", why: "Salah: pembedanya tenor, bukan institusinya. ≤ 1 tahun = pasar uang." },
            { text: "Pasar uang, karena tenor ≤ 1 tahun", why: "Benar: tenor di bawah 1 tahun = pasar uang, apapun institusinya.", correct: true },
            { text: "Pasar valuta asing", why: "Salah: itu pasar jual-beli mata uang asing — pasar yang berbeda." },
            { text: "Pasar primer saham", why: "Salah: deposito bukan sekuritas yang diterbitkan di pasar primer." },
          ],
        },
        {
          q: "Di Indonesia, lembaga yang mengawasi pasar modal dan melindungi investor adalah…",
          options: [
            { text: "Bank Indonesia", why: "Salah: BI = otoritas moneter, mengatur pasar uang dan nilai tukar." },
            { text: "Bappebti", why: "Salah: Bappebti = perdagangan berjangka komoditi dan aset kripto." },
            { text: "OJK", why: "Benar: OJK mengawasi pasar modal, perbankan, dan IKNB.", correct: true },
            { text: "LPS", why: "Salah: LPS = penjamin simpanan bank, bukan pengawas pasar modal." },
          ],
        },
        {
          q: "Mengapa pasar sekunder yang likuid penting bagi pasar primer?",
          options: [
            { text: "Karena emiten dapat uang dari tiap transaksi sekunder", why: "Salah: emiten tidak menerima sepeser pun dari transaksi sekunder." },
            { text: "Karena investor berani beli di IPO hanya jika yakin bisa menjual kembali dengan mudah", why: "Benar: likuiditas sekunder = jaminan exit. Tanpa itu, tidak ada yang mau beli dari pabrik.", correct: true },
            { text: "Karena OJK mewajibkannya", why: "Salah: ini soal insentif ekonomi investor, bukan kewajiban regulator." },
            { text: "Tidak penting — keduanya tidak berhubungan", why: "Salah: keduanya terhubung — sekunder yang hidup membuat primer bisa menghimpun dana." },
          ],
        },
        {
          q: "PT MajuMundur rights issue: 250 juta lembar baru @ Rp800, total 1 miliar lembar lama @ Rp1.000. Berapa dana segar ke kas perusahaan?",
          options: [
            { text: "Rp200 miliar", why: "Benar: 250 juta × Rp800 = Rp200 miliar masuk kas — ini pasar primer.", correct: true },
            { text: "Rp960 per lembar", why: "Salah: Rp960 = harga teoretis pasca-rights issue (TERP), bukan dana ke perusahaan." },
            { text: "Rp1.200 miliar", why: "Salah: itu nilai total perusahaan pasca-issue (1.000M + 200M), bukan dana segar." },
            { text: "Rp0", why: "Salah: rights issue = penerbitan baru, dananya masuk kas emiten — beda dengan jual-beli di bursa." },
          ],
        },
      ],
    },
  ],
};
