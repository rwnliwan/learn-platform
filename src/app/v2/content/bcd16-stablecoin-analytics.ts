import type { V2Lesson } from "../lib/types";

const BCD16_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Garis harga stablecoin 48 jam: stabil di 1,00 lalu anjlok ke 0,969 pada jam 21-26 (depeg) lalu pulih."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><rect x="232.8" y="20" width="44.4" height="160" fill="var(--c4)" opacity="0.15"/><text x="40" y="44.9" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">1,00</text><text x="40" y="79.7" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0,99</text><text x="40" y="114.4" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0,98</text><text x="40" y="149.2" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0,97</text><text x="46.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="152.7" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">12</text><text x="259.4" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">24</text><text x="366.2" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">36</text><text x="464.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">47</text><line x1="46" y1="75.7" x2="464" y2="75.7" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="460" y="71.7" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">ambang -1%</text><polyline points="46.0,41.9 54.9,40.9 63.8,41.6 72.7,41.2 81.6,41.6 90.5,39.5 99.4,43.0 108.3,39.8 117.1,45.0 126.0,42.6 134.9,42.3 143.8,44.0 152.7,38.8 161.6,42.6 170.5,38.4 179.4,37.0 188.3,43.0 197.2,37.7 206.1,38.4 215.0,39.5 223.9,61.7 232.8,89.6 241.7,131.3 250.6,148.7 259.4,141.7 268.3,113.9 277.2,82.6 286.1,54.8 295.0,42.3 303.9,41.6 312.8,39.8 321.7,37.0 330.6,42.6 339.5,44.7 348.4,37.0 357.3,38.1 366.2,38.4 375.1,40.5 384.0,43.0 392.9,43.7 401.7,42.6 410.6,41.2 419.5,44.3 428.4,39.1 437.3,39.1 446.2,45.0 455.1,38.1 464.0,40.9" fill="none" stroke="var(--c1)" stroke-width="2.5"/><circle cx="250.6" cy="148.7" r="4" fill="var(--c4)"/><text x="250.6" y="164.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">-3,1%</text><text x="255.0" y="34" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">event jam 21-26</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">USD / jam (data sintetis)</text></svg>`;

export const bcd16: V2Lesson = {
  slug: "bcd16-stablecoin-analytics",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD16 — Stablecoin Analytics: Mengukur Kapan 'Stabil' Goyah",
  estMinutes: 64,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Jam 2 pagi, tiga harga yang semuanya benar",
      prose: [
        "11 Maret 2023, pukul 02.00. Layar analis di Jakarta menampilkan tiga angka untuk token yang SAMA — USDC: DEX menunjukkan $0,97, bursa terpusat $0,93, oracle Chainlink masih $1,00. Tiga harga, tiga cerita. Dua jam sebelumnya Circle mengakui $3,3 miliar dari $40 miliar cadangan USDC-nya tersangkut di Silicon Valley Bank yang kolaps. Pagi itu USDC menyentuh $0,87 — diskon 13% untuk 'dolar digital'.",
        "Twist-nya: ketiga angka itu BENAR sebagai data. $0,97 = harga di kolam DEX yang likuiditasnya menipis saat semua orang panik jual. $0,93 = harga di bursa tempat tekanan redeem menumpuk. $1,00 = harga oracle yang belum sempat update (basi!). Tidak ada yang 'salah input' — yang berbeda adalah APA yang diukur. Peg $1 bukan properti token seperti massa jenis air; peg adalah KEYAKINAN pasar ditambah MEKANISME redeem. Keyakinan goyah = angka goyah.",
        "Pekerjaan analis di sini bukan menebak 'apakah USDC selamat?' — itu pertanyaan pasar. Pekerjaan analis: MENGUKUR goyahnya dengan presisi. Seberapa jauh menyimpang (deviasi)? Berapa lama (durasi)? Apakah arus keluar (redeem) mempercepat atau justru mereda? Lesson ini membangun tiga alat ukur itu dari data on-chain: metrik depeg, arus mint/redeem, dan perbandingan harga DEX vs oracle.",
        "Bekal yang dipakai di sini (ringkas, tanpa prasyarat lain): dari BCD2 — membaca data on-chain berarti membaca blok, transaksi, dan event log yang bisa dihitung ulang siapa pun; dari BCD4 — harga di AMM bukan 'nilai', melainkan rasio cadangan x·y=k yang bergeser saat orang panik jual; dari BCD15 — harga on-chain adalah klaim yang harus diverifikasi (siapa melapor, kapan, dari mana).",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menghitung tiga metrik depeg (deviasi, durasi, kedalaman) dari deret harga; (2) membedakan depeg-noise vs depeg-struktural dari kombinasi metrik + arus; (3) membaca arus mint/redeem on-chain sebagai barometer tekanan; (4) menjelaskan mengapa harga DEX menyimpang duluan saat depeg; (5) merancang panel dashboard monitoring depeg.",
        "Daftar isi: 1) Cerita tiga harga · 2) Tiga metrik depeg · 3) Arus mint/redeem · 4) Lab: detektor depeg · 5) DEX vs oracle saat depeg · 6) Peta keputusan: noise atau struktural · 7) Mini-case: malam SVB · 8) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Stablecoin = harganya selalu $1`",
        type: "pitfall",
        body: "Tidak ada hukum fisika yang menahan harga stablecoin di $1. Yang ada: TARGET $1 + mekanisme (redeem ke issuer, arbitrase) + keyakinan pasar. Riset S&P Global (Jun 2021–Jun 2023) menemukan USDC sempat di bawah $0,90 selama 23 menit dan DAI 20 menit — 'stabil' pun punya riwayat goyah yang TERUKUR. Analis tidak bertanya 'apakah stabil?' melainkan 'seberapa goyah, berapa lama, didorong apa?'",
      },
      reference: "Peg = keyakinan + mekanisme, bukan properti token. Ukur: deviasi, durasi, arus.",
    },
    {
      id: "metrik",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga metrik depeg: termometer, stopwatch, riwayat penyakit",
      prose: [
        "METRIK 1 — DEVIASI (termometer): seberapa jauh harga dari $1, dalam persen. D = (P − 1)/1 × 100%. USDC di $0,87 = deviasi −13%. Deviasi menjawab 'seberapa parah SEKARANG'. Analis memakai ambang: |D| < 0,5% = noise pasar normal (biaya gesek, spread); 0,5–2% = waspada; > 2% = event. Ambang bukan angka magis — ia harus ditulis eksplisit di setiap laporan, karena 'depeg' tanpa ambang = opini.",
        "METRIK 2 — DURASI (stopwatch): berapa lama deviasi bertahan di luar ambang, dihitung dari periode BERURUTAN. Depeg −3% selama 10 menit ≠ depeg −3% selama 6 jam — yang pertama bisa jadi kepanikan sesaat yang diarbritase, yang kedua berarti mekanisme penutup gap (redeem/arbitrase) macet. Durasi = metrik yang membedakan 'goyah' dari 'rusak'. Aturan praktis: durasi > 1 jam pada ambang 1% = eskalasi monitoring.",
        "METRIK 3 — KEDALAMAN & FREKUENSI (riwayat penyakit): kedalaman = deviasi maksimum dalam satu event; frekuensi = berapa kali event terjadi per periode. Riset S&P Global yang dirangkum Cointelegraph (12 Sep 2023) memberi benchmark nyata: dalam dua tahun (Jun 2021–Jun 2023), USDC di bawah $0,90 selama total 23 menit dan DAI 20 menit; USDT di bawah $0,95 hanya 1 menit; BUSD tidak pernah di bawah $0,975. Frekuensi depeg USDC dan DAI 'jauh lebih tinggi' dibanding USDT dan BUSD. Para peneliti mencatat event 1-menit 'dapat diatribusikan ke noise' — hanya event yang lebih lama yang 'lebih bermakna'.",
        "Cara MEMBACA ketiganya bersamaan: deviasi dalam tanpa durasi = spike (mungkin noise); durasi panjang tanpa kedalaman besar = tekanan kronis (pasar tidak percaya tapi tidak panik); frekuensi tinggi = mekanisme peg lemah secara struktural. USDC vs USDT di riset S&P: USDC kalah di SEMUA metrik (lebih dalam, lebih lama, lebih sering) — profil 'lebih goyah' yang konsisten, bukan satu kecelakaan.",
        "Jebakan rata-rata: jangan ringkas depeg 6 jam menjadi 'rata-rata −1,5%'. Rata-rata menyembunyikan bentuk: −3% selama 3 jam lalu pulih ≠ −1,5% datar selama 6 jam — yang pertama menakutkan tapi mekanisme bekerja, yang kedua tenang tapi mekanisme tidak pernah menutup gap. Selalu laporkan TRIPLET: kedalaman, durasi, bentuk (V tajam vs U landai vs L menempel).",
        "Kepribadian metrik: deviasi itu termometer (suhu saat ini), durasi itu stopwatch (sudah berapa lama demam), frekuensi itu riwayat penyakit (sering demam = ada yang salah dengan daya tahan tubuh). Dokter yang baik tidak mendiagnosis dari satu angka — analis depeg juga begitu.",
      ],
      formula: String.raw`D_t = \frac{P_t - 1}{1} \times 100\% \quad ; \quad \text{event} \iff |D_t| > \theta \text{ berurutan}`,
      formulaNote: "D_t = deviasi persen pada periode t; P_t = harga teramati; θ (theta) = ambang depeg yang ditulis eksplisit (mis. 1%). Event depeg = rangkaian periode berurutan dengan |D| > θ. Durasi = panjang rangkaian; kedalaman = min D dalam rangkaian. Tanpa θ yang eksplisit, 'depeg' hanya opini.",
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: depeg 1 menit ≠ depeg 1 jam",
        body: "Peneliti S&P menyebut event 1-menit sebagai noise — wajar, karena satu blok aneh bisa datang dari satu trade besar di kolam tipis. Yang 'lebih bermakna' = event berdurasi: ia membuktikan bahwa ARBITRASER tidak datang menutup gap. Durasi mengukur KEGAGALAN mekanisme, bukan cuma besarnya guncangan. Saat membaca laporan depeg, cari dulu angkanya: berapa MENIT, bukan berapa PERSEN.",
      },
      reference: "Triplet wajib: kedalaman, durasi, bentuk. Ambang θ selalu eksplisit.",
    },
    {
      id: "flows",
      eyebrow: "Langkah 3 · Konsep",
      title: "Mint/redeem: barometer tekanan yang jujur",
      prose: [
        "Mekanisme inti stablecoin fiat-backed: MINT = pengguna setor dolar ke issuer → issuer mencetak token baru (supply on-chain BERTAMBAH, terlihat sebagai event Mint/transfer dari alamat nol); REDEEM = pengguna mengembalikan token → issuer membakar (supply BERKURANG, event Burn). Harga $1 dipertahankan karena siapa pun bisa menukar 1 token = $1 — selama issuer mampu dan mau membayar.",
        "NET FLOW = mint − redeem per periode, dalam dolar. Net flow positif besar = permintaan masuk (orang mencetak stablecoin baru); net flow negatif besar = tekanan keluar (orang menukar kembali ke dolar). Ini 'barometer yang jujur' karena tidak bisa dimanipulasi dengan satu trade: mencetak/membakar butuh interaksi nyata dengan issuer dan tercatat permanen di supply.",
        "Membaca flow BERSAMA harga — empat kuadran: (1) harga ≈ $1 + net flow ≈ 0 = tenang; (2) harga turun + net redeem besar = tekanan struktural (orang BENAR-BENAR keluar, bukan sekadar panik di DEX); (3) harga turun + net flow ≈ 0 = kepanikan DEX lokal — likuiditas tipis, belum ada eksodus; (4) harga pulih + net mint kembali = mekanisme bekerja, keyakinan kembali. Kuadran 2 vs 3 adalah pembeda terpenting lesson ini: keduanya 'harga turun', hanya satu yang 'uang keluar'.",
        "Kasus SVB dalam bahasa flow: kabar $3,3 miliar cadangan USDC tersangkut di SVB memicu redeem wave — net flow negatif masif selama berjam-jam SEMENTARA harga di bawah $1. Itu kuadran 2 murni: bukan noise DEX, melainkan eksodus. Dan contagion-nya terukur: MakerDAO menyimpan 3,1 miliar USDC sebagai agunan DAI, sehingga DAI ikut depeg — korelasi depeg USDC–DAI yang bisa dihitung dari deret deviasi keduanya, bukan sekadar narasi 'kena imbas'.",
        "Sumber flow on-chain: totalSupply() per blok (perubahan = net mint/redeem), event Mint/Burn pada kontrak token, dan transfer ke/dari alamat treasury issuer. Tiga sumber ini saling cek: jika totalSupply turun tapi tidak ada event Burn yang cocok = ada jalur redeem off-chain atau anomali pencatatan — temuan itu sendiri layak dilaporkan.",
        "Kepribadian: harga = SUHU (mudah dilihat, mudah menipu), net flow = TEKANAN DARAH (butuh alat, tapi jujur). Pasien bisa demam karena kepanasan (kuadran 3) atau karena infeksi (kuadran 2) — termometer tidak membedakan, tekanan darah + gejala lain yang membedakan.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Supply naik = permintaan sehat`",
        type: "pitfall",
        body: "Supply yang naik bisa berarti tiga hal berbeda: (a) adopsi organik — orang butuh dolar digital; (b) farming insentif — orang mencetak untuk mengejar yield, pergi saat insentif habis; (c) exit liquidity — mencetak untuk dijual ke pasar. Bedakan dengan MEMBACA BERSAMA deviasi dan durasi: supply naik + harga di atas $1 = permintaan genuinely; supply naik + harga di bawah $1 = seseorang mencetak untuk JUAL (tekanan!). Satu metrik tidak pernah cukup.",
      },
      reference: "Kuadran kunci: harga turun + net redeem besar = struktural; tanpa redeem = panik lokal.",
    },
    {
      id: "lab-depeg",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: detektor depeg dari deret harga",
      prose: [
        "Data: 48 harga per jam (SINTETIS — contoh pembelajaran, bukan harga pasar nyata) plus arus net mint/redeem per jam dalam $juta. Ada satu event depeg tersembunyi di dalamnya. Tugasmu: (1) tulis fungsi deviasi; (2) deteksi event = jam BERURUTAN dengan deviasi < −1%; (3) untuk tiap event laporkan durasi dan kedalaman; (4) hitung net redeem kumulatif selama event terpanjang.",
        "Cara membaca output: n_event = jumlah event; 'event jam A-B' = rentang; kedalaman = deviasi ternegatif; net_redeem_event negatif besar = uang benar-benar keluar. Interpretasi: event 6 jam dengan kedalaman −3,1% dan net redeem −$1,4 miliar = kuadran 2 (struktural!), bukan noise.",
        "Coba eksplorasi: ubah AMBANG ke −0,5% — berapa event muncul? (Noise ikut kehitung!) Kembalikan ke −2% — apa yang hilang? (Event menyusut!) Pelajaran: ambang menentukan APA yang kamu lihat; analis yang baik melaporkan hasil di 2–3 ambang, bukan satu.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi deviasi(p) = (p-1)*100" },
        { id: "t2", text: "Deteksi event: jam berurutan dengan deviasi < AMBANG" },
        { id: "t3", text: "Jalankan; laporkan durasi, kedalaman, dan net redeem event terpanjang" },
      ],
      expected: "n_event=1 · event jam 21-26 · durasi 6 jam · kedalaman -3,10% · net redeem -$1.431,5 jt",
      note: {
        title: "💡 Intuisi: ambang = kacamata analis",
        body: "Ambang −0,5% membuat jam 20 dan 27 ikut terhitung (keduanya cuma −0,6% dan −0,4% — noise!). Ambang −2% memotong event jadi lebih pendek dan menyembunyikan awal tekanan. Tidak ada ambang 'benar' — yang benar adalah MELAPORKAN ambangmu dan menguji sensitivitasnya. Sama seperti peneliti S&P yang membedakan event 1-menit (noise) dari event bermakna.",
      },
      hints: [
        "deviasi(p) = (p - 1) * 100.",
        "Jejaki 'mulai' saat deviasi < AMBANG; tutup event saat kembali di atas AMBANG.",
        "Event terpanjang = max(events, key=lambda t: t[1]-t[0]); net = sum(flow[s:e+1]).",
      ],
      code: {
        starter: `harga = [0.9997, 1.0, 0.9998, 0.9999, 0.9998, 1.0004, 0.9994, 1.0003, 0.9988, 0.9995,\n         0.9996, 0.9991, 1.0006, 0.9995, 1.0007, 1.0011, 0.9994, 1.0009, 1.0007, 1.0004,\n         0.994, 0.986, 0.974, 0.969, 0.971, 0.979, 0.988, 0.996, 0.9996, 0.9998,\n         1.0003, 1.0011, 0.9995, 0.9989, 1.0011, 1.0008, 1.0007, 1.0001, 0.9994, 0.9992,\n         0.9995, 0.9999, 0.999, 1.0005, 1.0005, 0.9988, 1.0008, 1.0]\nflow = [-1.5, -5.0, 5.0, -6.6, 2.7, -0.7, -6.8, 2.1, -7.3, 0.7,\n        -6.6, -6.2, 0.5, 8.5, -5.5, -3.5, 4.5, 11.0, 3.5, -0.1,\n        -188.7, -268.2, -143.6, -298.7, -244.7, -183.7, -292.6, -232.0, -4.4, 3.6,\n        4.8, -0.6, 3.0, -6.7, -6.8, -3.9, 5.6, 0.6, -1.7, 3.7,\n        1.1, -2.0, 7.9, 6.0, -3.1, 3.5, 2.5, 9.5]\n\n# DATA SINTETIS: contoh pembelajaran, bukan harga pasar nyata\nAMBANG = -1.0  # persen; deviasi di bawah ini = depeg\n\n# TULIS KODEMU DI BAWAH INI`,
        lockLines: 15,
        solution: `harga = [0.9997, 1.0, 0.9998, 0.9999, 0.9998, 1.0004, 0.9994, 1.0003, 0.9988, 0.9995,\n         0.9996, 0.9991, 1.0006, 0.9995, 1.0007, 1.0011, 0.9994, 1.0009, 1.0007, 1.0004,\n         0.994, 0.986, 0.974, 0.969, 0.971, 0.979, 0.988, 0.996, 0.9996, 0.9998,\n         1.0003, 1.0011, 0.9995, 0.9989, 1.0011, 1.0008, 1.0007, 1.0001, 0.9994, 0.9992,\n         0.9995, 0.9999, 0.999, 1.0005, 1.0005, 0.9988, 1.0008, 1.0]\nflow = [-1.5, -5.0, 5.0, -6.6, 2.7, -0.7, -6.8, 2.1, -7.3, 0.7,\n        -6.6, -6.2, 0.5, 8.5, -5.5, -3.5, 4.5, 11.0, 3.5, -0.1,\n        -188.7, -268.2, -143.6, -298.7, -244.7, -183.7, -292.6, -232.0, -4.4, 3.6,\n        4.8, -0.6, 3.0, -6.7, -6.8, -3.9, 5.6, 0.6, -1.7, 3.7,\n        1.1, -2.0, 7.9, 6.0, -3.1, 3.5, 2.5, 9.5]\n\n# DATA SINTETIS: contoh pembelajaran, bukan harga pasar nyata\nAMBANG = -1.0  # persen; deviasi di bawah ini = depeg\n\n# TULIS KODEMU DI BAWAH INI\ndef deviasi(p):\n    return (p - 1) * 100\n\nevents = []\nmulai = None\nfor h in range(len(harga)):\n    if deviasi(harga[h]) < AMBANG:\n        if mulai is None:\n            mulai = h\n    else:\n        if mulai is not None:\n            events.append((mulai, h - 1))\n            mulai = None\nif mulai is not None:\n    events.append((mulai, len(harga) - 1))\n\nprint("n_event:", len(events))\nfor s, e in events:\n    seg = [deviasi(harga[h]) for h in range(s, e + 1)]\n    print(f"event jam {s}-{e}: durasi={e - s + 1} jam, kedalaman={min(seg):.2f}%")\ns, e = max(events, key=lambda t: t[1] - t[0])\nprint("net_redeem_event:", round(sum(flow[s:e + 1]), 1), "$jt")`,
        checks: [
          { kind: "stdout_matches", task: "t3", label: "1 event", msg: "Harus tepat 1 event depeg terdeteksi.", pattern: "n_event: 1" },
          { kind: "stdout_matches", task: "t3", label: "jam 21-26", msg: "Event harus jam 21-26 (jam 20 dan 27 di atas ambang -1%).", pattern: "event jam 21-26" },
          { kind: "stdout_matches", task: "t3", label: "kedalaman -3.10%", msg: "Kedalaman maksimum = -3.10% (jam 23).", pattern: "kedalaman=-3\\.10%" },
          { kind: "stdout_matches", task: "t3", label: "net redeem -1431.5", msg: "Net redeem kumulatif event = -1431.5 $jt.", pattern: "net_redeem_event: -1431\\.5" },
        ],
      },
      reference: "Event = jam berurutan di bawah ambang. Lapor triplet + net flow.",
    },
    {
      id: "feed-vs-oracle",
      eyebrow: "Langkah 5 · Pendalaman",
      title: "DEX vs oracle: mengapa yang 'murah' muncul duluan",
      prose: [
        "Saat depeg Maret 2023, urutan kejadiannya konsisten: harga DEX jatuh DULUAN, bursa terpusat menyusul, oracle terakhir. Ini bukan kebetulan — ini arsitektur. Harga di AMM (bekal BCD4: x·y=k) adalah rasio cadangan: saat 1.000 orang panik jual USDC ke kolam USDC/ETH yang tipis, rasio bergeser dan harga AMM anjlok — bahkan jika 'nilai wajar' belum berubah. DEX mengukur TEKANAN JUAL LOKAL, bukan konsensus global.",
        "Oracle menyusul karena ia dirancang LAMBAT demi aman: Chainlink hanya update jika harga bergerak > 0,5% (deviation threshold) atau heartbeat tercapai (bekal BCD15). Saat crash 13% dalam hitungan jam, oracle menampilkan harga 'kemarin' selama jeda update — basi di momen paling kritis. Analis yang memakai harga oracle mentah-mentah saat depeg = membaca koran kemarin untuk berita hari ini.",
        "Yang MENUTUP gap dalam kondisi normal adalah loop arbitrase: beli USDC murah di DEX ($0,97) → redeem ke issuer $1,00 → profit $0,03 per token → tekanan beli di DEX menaikkan harga kembali. Loop ini punya DUA syarat yang bisa diukur: (1) redeem berfungsi (issuer membayar!); (2) cepat & murah (tidak ada antrean redeem, fee kecil). Maret 2023: syarat (1) diragukan ($3,3 miliar 'hilang' di SVB?) → arbitraser menuntut diskon risiko lebih besar → gap bertahan di −13%. Depeg berkepanjangan = pasar memberi harga pada KERAGUAN terhadap redeem.",
        "Cara mengukurnya: hitung SPREAD tiga harga per periode — spread_DEX = P_DEX − P_CEX, spread_oracle = P_oracle − P_CEX. Pola sehat: ketiganya ≈ 0. Pola 'panik lokal': spread_DEX negatif besar, spread_oracle ≈ 0, net flow ≈ 0 (kuadran 3!). Pola 'krisis redeem': spread_DEX negatif + spread_oracle negatif (oracle ikut basi) + net redeem besar (kuadran 2!). Spread = peta keyakinan pasar yang bisa dihitung per menit.",
        "Batas cakupan yang eksplisit: lesson ini berhenti di PENGUKURAN — mendeteksi, mengklasifikasi, dan memvisualkan depeg dari data on-chain. Keputusan lindung nilai, penentuan eksposur portofolio, dan strategi trading di sekitar depeg adalah wilayah analisis risiko pasar, bukan wilayah lesson ini. Analis yang baik tahu di mana pengukurannya selesai.",
      ],
      figure: {
        svg: BCD16_SVG,
        alt: "Garis harga stablecoin 48 jam: stabil di 1,00, anjlok ke 0,969 pada jam 21-26 (area berbayang), lalu pulih.",
        caption: "Cara membaca: sumbu-x = jam (data sintetis!), sumbu-y = USD; garis = harga; garis putus-putus = ambang depeg −1%; area berbayang = event jam 21–26. Interpretasi: bentuk V tajam (jatuh 6 jam, pulih 2 jam) + area berbayang sempit = guncangan yang mekanisme tutup dengan cepat; bandingkan dengan bentuk L (menempel di bawah ambang berjam-jam) yang menandakan keraguan terhadap redeem. Titik −3,1% = kedalaman maksimum event.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: urutan jatuh = peta arsitektur",
        body: "DEX dulu, CEX kemudian, oracle terakhir — urutan ini MENGUNGKAPKAN cara kerja sistem, bukan sekadar kronologi. DEX = sensor tercepat tapi paling berisik (likuiditas tipis). Oracle = sensor paling lambat tapi paling stabil. Analis memakai ketiganya seperti dokter memakai tiga alat: stetoskop (DEX, cepat), tensimeter (CEX, pasar), dan lab (oracle, terverifikasi tapi lambat). Jangan mendiagnosis hanya dari satu alat.",
      },
      reference: "Spread tiga harga = peta keyakinan. Depeg panjang = keraguan terhadap redeem.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Noise atau struktural: peta 5 skenario",
      prose: [
        "**Skenario 1 — Deviasi −0,3%, durasi 5 menit, net flow ≈ 0.** → NOISE. Satu trade besar di kolam tipis. Tindakan: catat, pantau, jangan eskalasi. (Ingat peneliti S&P: event 1-menit = noise.)",
        "**Skenario 2 — Deviasi −2,5%, durasi 3 jam, net redeem −$800 juta.** → STRUKTURAL. Uang benar-benar keluar + gap tidak tertutup = keraguan terhadap redeem. Tindakan: eskalasi monitoring (interval per menit), siapkan panel contagion (stablecoin lain dengan agunan sama).",
        "**Skenario 3 — Oracle $1,00 tapi DEX $0,96 selama 1 jam.** → ORACLE STALE, bukan 'harga benar'. Tindakan: jangan pakai harga oracle untuk logika apa pun sampai spread_oracle menutup; tandai data oracle periode itu sebagai tidak valid di dataset.",
        "**Skenario 4 — Depeg −4% pulih dalam 30 menit + net mint kembali positif.** → MEKANISME BEKERJA. Arbitrase menutup gap, keyakinan kembali. Tindakan: dokumentasikan sebagai studi kasus 'loop sehat' — bandingkan durasinya dengan event struktural untuk kalibrasi ambang eskalasi.",
        "**Skenario 5 — Dua stablecoin depeg bersamaan (mis. USDC & DAI).** → CONTAGION TERUKUR. Tindakan: hitung korelasi deviasi keduanya + petakan agunan bersama (3,1 miliar USDC menopang DAI saat SVB). Depeg ganda dengan korelasi tinggi = satu akar masalah, jangan analisis terpisah.",
        "Aturan praktis 10 detik: (1) deviasi > 1%? (2) durasi > 1 jam? (3) net redeem besar? Tiga YA = struktural. Satu YA = waspada. Nol YA = noise. Tulis ambangmu, uji sensitivitasnya, laporkan triplet (kedalaman, durasi, bentuk) — selalu.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: tanya 'uangnya ke mana', bukan 'harganya berapa'",
        body: "Harga bisa bohong sesaat (kolam tipis, satu paus). Arus tidak bisa bohong lama: redeem −$800 juta berarti 800 juta alasan individual untuk keluar. Saat ragu antara noise dan struktural, tutup chart harga 10 detik dan buka chart net flow — jawabannya hampir selalu di sana.",
      },
      reference: "3 YA = struktural. 1 YA = waspada. 0 = noise.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Malam SVB: dashboard analis 6 jam",
      prose: [
        "10–11 Maret 2023. Kamu analis on-chain sebuah dana. Pukul 22.00: USDC $0,995 (deviasi −0,5%). Pukul 01.00: $0,94 (−6%). Pukul 04.00: $0,87 (−13%, titik terdalam). Net redeem kumulatif 6 jam: −$2,1 miliar. Oracle Chainlink tertinggal: masih $0,99 saat DEX $0,90. DAI ikut turun ke $0,93.",
        "**Pertanyaan:** (a) Klasifikasikan tiap fase dengan triplet (kedalaman, durasi, bentuk) — kapan status berubah dari 'waspada' ke 'struktural'? (b) Metrik apa yang PALING membedakan malam ini dari sekadar 'kepanikan DEX'? (c) Rancang 3 panel dashboard yang kamu pantau live malam itu — apa sumbu dan ambangnya? (d) Kriteria TERUKUR apa yang kamu pakai untuk menyatakan 'depeg selesai'?",
        "**Pembahasan:** (a) 22.00: −0,5%, di bawah ambang 1% = belum event (waspada). 01.00: −6% + 3 jam berurutan = event struktural DIMULAI (durasi > 1 jam + net redeem besar = 3 YA). 04.00: kedalaman −13%, bentuk V-dalam. Status berubah struktural sekitar tengah malam, bukan saat menyentuh $0,87 — durasi dan flow yang menentukan, bukan titik terdalam. (b) Net redeem −$2,1 miliar: harga bisa jatuh karena kolam tipis, tapi $2,1 miliar tidak keluar tanpa alasan. Flow = pembeda kuadran 2 vs 3. (c) Panel 1: deviasi per menit + garis ambang ±1% (sumbu: %, ambang: 1%/2%). Panel 2: net flow kumulatif per jam dalam $juta (ambang eskalasi: −$500 juta/jam). Panel 3: spread tiga harga DEX/CEX/oracle (ambang: spread_oracle < −1% = data oracle tidak valid). (d) 'Selesai' = deviasi kembali dalam ±0,5% selama 24 jam BERURUTAN + net flow netral/positif 3 hari + spread tiga harga < 0,3%. Tanpa kriteria tertulis, 'pulih' hanya perasaan.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk: konsentrasi yang terukur",
        type: "risk",
        body: "$3,3 miliar cadangan di SATU bank = risiko konsentrasi yang bisa dihitung SEBELUM kolaps: pangsa cadangan per kustodian. DAI yang 3,1 miliar USDC-nya menopang = contagion yang bisa dipetakan SEBELUM depeg ganda. Pengukuran konsentrasi (pangsa, overlap agunan) adalah pekerjaan analis — ia tidak memprediksi SVB kolaps, tapi ia memberi tahu SEBERAPA BESAR ledakannya jika terjadi.",
      },
      reference: "Status ditentukan durasi + flow, bukan titik terdalam. 'Selesai' butuh kriteria tertulis.",
    },
    {
      id: "rwa-tokenisasi",
      eyebrow: "Langkah 8 · RWA",
      title: "RWA: ketika aset dunia nyata naik ke rantai",
      prose: [
        "Sebuah platform menjual token yang diklaim mewakili surat utang perusahaan senilai puluhan miliar rupiah. Iklannya sederhana: 'aset dunia nyata, di blockchain'. Calon pembeli bertanya satu hal yang tepat: kalau perusahaannya gagal bayar, saya menagih ke siapa — ke tokennya, atau ke kantornya? Pertanyaan itu adalah seluruh isi langkah ini. Tokenisasi Real-World Assets (RWA) memindahkan BUNGKUS aset ke rantai, bukan MENGGANTI sifat asetnya. Analis yang tidak membedakan keduanya akan membaca angka on-chain yang rapi untuk risiko yang tetap berantakan.",
        "Definisi kerja: RWA = aset dari sistem keuangan tradisional yang diterbitkan ulang sebagai token — obligasi pemerintah, surat utang swasta, deposito, bahkan properti. Mekaniknya: penerbit (biasanya kendaraan khusus/SPV) memegang aset dasar lewat kustodian, lalu menerbitkan token yang mewakili klaim atas aset itu. Pembeli memegang token; bunga atau kupon yang dibayar tetap berasal dari arus kas aset dasar, bukan dari rantai.",
        "Kenapa diterbitkan di rantai — klaimnya, bukan janjinya: penyelesaian hampir seketika (tanpa T+2), fraksionasi (properti Rp10 miliar bisa dibeli Rp1 juta per pecahan), pasar 24 jam tanpa buka-tutup bursa. Ketiganya NYATA sebagai fitur teknis. Tapi perhatikan: semuanya adalah perbaikan pada DISTRIBUSI dan LIKUIDITAS, bukan pada KUALITAS aset. Obligasi macet yang ditokenisasi = obligasi macet yang bisa diperdagangkan 24 jam. Fraksionasi tidak mengubah risiko gagal bayar; ia mengubah siapa saja yang bisa ikut menanggungnya.",
        "Risiko yang TIDAK hilang oleh tokenisasi — tiga lapis yang tetap tinggal di dunia hukum: (1) KUSTODIAN: siapa yang benar-benar memegang aset dasar, dan apa buktinya selain klaim di situs? (2) ENFORCEABILITY: bila penerbit ingkar, apakah pemegang token punya kedudukan hukum untuk menuntut — di yurisdiksi mana? (3) RISIKO PENERBIT: token dari pihak swasta membawa risiko kredit penerbitnya sendiri; blockchain tidak memperbaiki neraca perusahaan. Token = bungkus baru untuk kontrak lama: baca kontraknya, bukan bungkusnya.",
        "Data on-chain RWA — setengah gambar yang rapi: yang TERLIHAT = supply token, jumlah pemegang, peredaran, volume transfer (semua bisa dihitung ulang siapa pun, sesuai bekal membaca data on-chain). Yang TIDAK terlihat = kualitas aset dasar (rating obligasinya? kondisi fisik propertinya?), status kustodian hari ini, dan dokumen hukumnya. On-chain memberi tahu SEBERAPA BANYAK token beredar; ia tidak memberi tahu SEBERAPA BAGUS isinya.",
        "Lima pertanyaan analis sebelum percaya angka TVL RWA: (1) Siapa kustodiannya, dan apakah independen dari penerbit? (2) Apa dasar hukum klaim token — prospektus, kontrak, atau sekadar janji di situs? (3) Adakah audit berkala atas aset dasar — oleh siapa, seberapa sering? (4) Dari mana bunga/kupon dibayar — arus kas aset, atau token baru? (5) Bila penerbit hilang besok, jalur hukum apa yang tersisa untuk pemegang token? Bila tiga dari lima tak terjawab, angka TVL-nya adalah dekorasi.",
      ],
      tasks: [
        { id: "t1", text: "Untuk satu token RWA hipotetis, tulis: siapa penerbit, siapa kustodian, apa dasar hukum klaim — tandai mana yang TIDAK bisa dijawab dari data on-chain" },
        { id: "t2", text: "Terapkan lima pertanyaan analis pada token itu; simpulkan: angkanya layak dipercaya, atau belum" },
      ],
      note: {
        title: "💡 Intuisi: token = sampul, bukan isi",
        body: "Menilai RWA dari data on-chain saja seperti menilai buku dari sampulnya: sampulnya rapi dan ketebalannya bisa diukur presisi, tapi ceritanya ditulis penulis yang tinggal di luar sana. Analis membaca SAMPUL dengan teliti, lalu pergi memeriksa PENULISNYA (kustodian, kontrak, audit) sebelum memberi vonis.",
      },
      reference: "Token = bungkus baru untuk kontrak lama. Baca kontraknya.",
    },
    {
      id: "cbdc-pembayaran",
      eyebrow: "Langkah 9 · CBDC",
      title: "CBDC: ketika bank sentral ikut naik ke rel digital",
      prose: [
        "Bayangkan rupiah dalam dua bentuk: yang di dompetmu (uang bank sentral, fisik) dan yang di aplikasi bank (uang bank komersial, digital). CBDC — Central Bank Digital Currency — adalah bentuk ketiga: rupiah digital yang diterbitkan LANGSUNG oleh bank sentral. Ia datang dalam dua lapis: CBDC RITEL untuk publik (pelengkap/pengganti uang tunai) dan CBDC GROSIR untuk penyelesaian antarbank di belakang layar.",
        "Tiga instrumen, tiga penerbit — jangan tertukar: (a) CBDC: penerbit = bank sentral, klaim = atas bank sentral (risiko gagal bayar praktis nol dalam mata uang sendiri). (b) Stablecoin: penerbit = perusahaan swasta, klaim = atas penerbit itu — persis risiko kredit penerbit yang dibahas di seluruh lesson ini. (c) E-money/saldo dompet: penerbit = bank atau non-bank swasta, klaim = atas penerbit, penyelesaian lewat ledger penerbit. Bedanya bukan 'digital atau tidak' — ketiganya digital. Bedanya: KEPADA SIAPA kamu punya klaim saat semuanya runtuh.",
        "Desain yang diperdebatkan — dua sisi yang jujur: di satu sisi, CBDC ritel menjanjikan pembayaran instan murah, inklusi keuangan, dan jejak transaksi yang mempersempit ruang uang gelap. Di sisi lain, jejak yang SAMA bisa berarti pengawasan atas setiap transaksi warga — privasi tunai yang hilang. Tidak ada jawaban teknis yang 'benar': ini pilihan desain kebijakan (anonimitas terbatas? batas nilai? data disimpan siapa?). Tugas analis bukan memihak, melainkan MEMBACA desainnya: data apa yang tercatat, siapa bisa melihat, dan apa yang berubah dari status quo.",
        "Status Indonesia — tanpa tanggal pasti: Bank Indonesia mengembangkan rupiah digital lewat Proyek Garuda, saat ini dalam tahap pengembangan dan percontohan, bukan peluncuran publik. Analis yang baik menulis 'tahap pengembangan' dan berhenti di situ — tidak mengarang tanggal rilis, tidak mengarang angka adopsi. Aturan umum: untuk proyek yang masih berjalan, laporkan STATUSNYA, bukan RAMALANNYA.",
        "Implikasi untuk analis data — rel baru, cermin baru: hari ini sebagian aliran uang terlihat di rantai publik (transfer stablecoin antar-dompet bisa dilacak siapa pun). Bila pembayaran berpindah ke rel CBDC yang tertutup, jejak itu PINDAH dari cermin publik ke database bank sentral — analis luar kehilangan granularitas dan harus mengandalkan statistik agregat resmi. Sebaliknya, analis DI DALAM sistem justru mendapat data lebih lengkap. Pertanyaannya bergeser dari 'apa yang bisa saya hitung?' menjadi 'data siapa yang saya lihat — dan apa yang TIDAK saya lihat lagi?'",
        "Dua langkah baru ini adalah dua arah berlawanan dari 'aset naik ke rantai': RWA membawa aset SWASTA ke rel publik, CBDC membawa uang NEGARA ke rel digital yang tertutup. Keduanya mengubah PETA DATA yang tersedia. Prinsipnya sama dengan seluruh lesson ini: kenali dulu REL-nya (siapa penerbit, siapa melihat datanya), baru baca ANGKAnya. Angka tanpa peta rel = angka tanpa konteks.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi kategori_penerbit(p): 'bank sentral' -> 'uang bank sentral'; 'perusahaan swasta' -> 'uang swasta'; 'SPV RWA' -> 'klaim atas aset dasar (bukan uang)'; selainnya -> 'klaim tidak langsung'" },
        { id: "t2", text: "Klasifikasikan 7 instrumen tertanam, cetak ringkasan hitung per kategori" },
        { id: "t3", text: "Cetak berapa instrumen yang settlement-nya terlihat on-chain publik; tulis satu kalimat implikasinya untuk analis luar" },
      ],
      expected: "uang bank sentral: 3 · uang swasta: 2 · klaim atas aset dasar (bukan uang): 1 · klaim tidak langsung: 1 · terlihat on-chain publik: 3",
      note: {
        title: "💡 Intuisi: bedakan 'digital' dari 'kepada siapa klaimnya'",
        body: "E-money, stablecoin, dan CBDC ritel ketiganya 'uang digital' — label yang tidak membedakan apa-apa. Pertanyaan yang membedakan: kalau penerbitnya bangkrut besok pagi, kepada siapa kamu menagih? Jawabannya menentukan seluruh profil risiko instrumen, dan ia tidak tertulis di aplikasi mana pun — analis yang menanyakannya.",
      },
      hints: [
        "kategori = fungsi if/elif/else atas string penerbit.",
        "ringkasan = dict: ringkasan[k] = ringkasan.get(k, 0) + 1.",
        "Hitung yang settlement-nya 'on-chain publik' dengan sum(1 for i in instrumen if ...).",
      ],
      code: {
        starter: `instrumen = [\n    {"nama": "USDT", "jenis": "stablecoin", "penerbit": "perusahaan swasta", "klaim": "penerbit swasta", "settlement": "on-chain publik"},\n    {"nama": "USDC", "jenis": "stablecoin", "penerbit": "perusahaan swasta", "klaim": "penerbit swasta", "settlement": "on-chain publik"},\n    {"nama": "Token obligasi negara (RWA)", "jenis": "RWA token", "penerbit": "SPV RWA", "klaim": "aset dasar via kustodian", "settlement": "on-chain publik"},\n    {"nama": "Rupiah digital (percontohan)", "jenis": "CBDC ritel", "penerbit": "bank sentral", "klaim": "bank sentral", "settlement": "rel tertutup"},\n    {"nama": "CBDC grosir antarbank", "jenis": "CBDC grosir", "penerbit": "bank sentral", "klaim": "bank sentral", "settlement": "rel tertutup"},\n    {"nama": "W-Rupiah antarbank", "jenis": "CBDC grosir", "penerbit": "bank sentral", "klaim": "bank sentral", "settlement": "rel tertutup"},\n    {"nama": "Saldo dompet elektronik", "jenis": "e-money", "penerbit": "bank komersial", "klaim": "bank komersial", "settlement": "ledger penerbit"},\n]\n\n# TULIS KODEMU DI BAWAH INI`,
        lockLines: 11,
        solution: `instrumen = [\n    {"nama": "USDT", "jenis": "stablecoin", "penerbit": "perusahaan swasta", "klaim": "penerbit swasta", "settlement": "on-chain publik"},\n    {"nama": "USDC", "jenis": "stablecoin", "penerbit": "perusahaan swasta", "klaim": "penerbit swasta", "settlement": "on-chain publik"},\n    {"nama": "Token obligasi negara (RWA)", "jenis": "RWA token", "penerbit": "SPV RWA", "klaim": "aset dasar via kustodian", "settlement": "on-chain publik"},\n    {"nama": "Rupiah digital (percontohan)", "jenis": "CBDC ritel", "penerbit": "bank sentral", "klaim": "bank sentral", "settlement": "rel tertutup"},\n    {"nama": "CBDC grosir antarbank", "jenis": "CBDC grosir", "penerbit": "bank sentral", "klaim": "bank sentral", "settlement": "rel tertutup"},\n    {"nama": "W-Rupiah antarbank", "jenis": "CBDC grosir", "penerbit": "bank sentral", "klaim": "bank sentral", "settlement": "rel tertutup"},\n    {"nama": "Saldo dompet elektronik", "jenis": "e-money", "penerbit": "bank komersial", "klaim": "bank komersial", "settlement": "ledger penerbit"},\n]\n\n# TULIS KODEMU DI BAWAH INI\ndef kategori_penerbit(p):\n    if p == "bank sentral":\n        return "uang bank sentral"\n    elif p == "perusahaan swasta":\n        return "uang swasta"\n    elif p == "SPV RWA":\n        return "klaim atas aset dasar (bukan uang)"\n    else:\n        return "klaim tidak langsung"\n\nhasil = [{"nama": i["nama"], "kategori": kategori_penerbit(i["penerbit"])} for i in instrumen]\n\nringkasan = {}\nfor h in hasil:\n    k = h["kategori"]\n    ringkasan[k] = ringkasan.get(k, 0) + 1\n\nprint("uang bank sentral:", ringkasan.get("uang bank sentral", 0))\nprint("uang swasta:", ringkasan.get("uang swasta", 0))\nprint("klaim atas aset dasar (bukan uang):", ringkasan.get("klaim atas aset dasar (bukan uang)", 0))\nprint("klaim tidak langsung:", ringkasan.get("klaim tidak langsung", 0))\n\npublik = sum(1 for i in instrumen if i["settlement"] == "on-chain publik")\nprint("terlihat on-chain publik:", publik)`,
        checks: [
          { kind: "defined", task: "t1", label: "fungsi kategori_penerbit ada", name: "kategori_penerbit", msg: "Fungsi kategori_penerbit belum didefinisikan." },
          { kind: "equal", task: "t2", label: "ringkasan kategori", name: "ringkasan", value: { "uang bank sentral": 3, "uang swasta": 2, "klaim atas aset dasar (bukan uang)": 1, "klaim tidak langsung": 1 }, msg: "Ringkasan harus: bank sentral=3, swasta=2, klaim aset dasar=1, tidak langsung=1." },
          { kind: "stdout_matches", task: "t2", label: "cetak bank sentral: 3", pattern: "uang bank sentral: 3", msg: "Output harus memuat baris 'uang bank sentral: 3'." },
          { kind: "stdout_matches", task: "t3", label: "terlihat on-chain: 3", pattern: "terlihat on-chain publik: 3", msg: "Output harus memuat 'terlihat on-chain publik: 3' (USDT, USDC, token RWA)." },
        ],
      },
      reference: "Kenali relnya dulu: siapa penerbit, siapa melihat datanya — baru baca angkanya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Malam depeg: DEX $0,97, CEX $0,93, oracle $1,00. Sikap analis yang TEPAT?",
          options: [
            { text: "Pakai $1,00 — oracle paling tepercaya", why: "Oracle saat crash cepat = BASI (belum update). Memakai harga kemarin untuk keputusan hari ini = buta.", },
            { text: "Pakai $0,93 — CEX paling likuid", why: "CEX memang likuid, tapi analis tidak 'memilih satu harga' — ia MEMBACA ketiganya: spread-nya sendiri adalah sinyal.", },
            { text: "Ketiganya benar sebagai data; spread di antaranya = peta keyakinan (DEX=tekanan lokal, CEX=pasar, oracle=basi)", why: "Tepat. Tidak ada 'harga yang benar' saat depeg — ada tiga pengukuran dengan makna berbeda. Spread DEX vs oracle yang lebar = peringatan data.", correct: true },
            { text: "Rata-ratakan ketiganya = $0,967", why: "Rata-rata tiga pengukuran yang mengukur HAL BERBEDA = angka tanpa makna. Seperti merata-ratakan suhu, tekanan darah, dan berat badan.", },
          ],
        },
        {
          q: "Menurut riset S&P Global (Jun 2021–Jun 2023), profil depeg USDC vs USDT?",
          options: [
            { text: "USDT lebih sering depeg dibanding USDC", why: "Kebalik. Riset menemukan frekuensi depeg USDC dan DAI 'jauh lebih tinggi' dibanding USDT dan BUSD.", },
            { text: "USDC di bawah $0,90 selama 23 menit, DAI 20 menit; USDT di bawah $0,95 hanya 1 menit; BUSD tak pernah di bawah $0,975", why: "Tepat — angka langsung dari riset. USDC kalah di kedalaman, durasi, DAN frekuensi: profil 'lebih goyah' yang konsisten.", correct: true },
            { text: "Keduanya tidak pernah depeg dalam periode itu", why: "Salah total — justru temuan utamanya: stablecoin besar pun depeg, hanya berbeda profilnya.", },
            { text: "BUSD paling sering depeg", why: "BUSD justru paling stabil: tidak pernah di bawah $0,975 sepanjang dua tahun.", },
          ],
        },
        {
          q: "Event 1-menit di bawah ambang depeg. Menurut para peneliti S&P, ini adalah?",
          options: [
            { text: "Bukti mekanisme peg rusak", why: "Satu menit tidak membuktikan apa-apa tentang mekanisme — terlalu singkat untuk arbitraser bereaksi.", },
            { text: "Noise — dapat diatribusikan ke satu trade/kolam tipis, bukan kegagalan struktural", why: "Tepat. Para peneliti menyebut event 1-menit 'dapat diatribusikan ke noise'; yang 'lebih bermakna' = event berdurasi.", correct: true },
            { text: "Sinyal jual terkuat", why: "Menjual karena noise 1-menit = bereaksi terhadap data yang bahkan belum tentu mewakili pasar. Itu keputusan, bukan analisis.", },
            { text: "Wajib dilaporkan sebagai krisis", why: "Melaporkan noise sebagai krisis = alarm palsu yang mengikis kepercayaan pada monitoring. Klasifikasikan dulu.", },
          ],
        },
        {
          q: "Harga −3% selama 6 jam + net redeem −$1,4 miliar. Klasifikasi dan alasannya?",
          options: [
            { text: "Noise — 6 jam masih singkat", why: "6 jam dengan uang keluar $1,4 miliar bukan noise. Noise = menit + tanpa flow.", },
            { text: "Struktural (kuadran 2): durasi panjang + net redeem besar = keraguan terhadap redeem, bukan panik DEX lokal", why: "Tepat. Pembeda kuadran 2 vs 3 adalah FLOW: harga bisa jatuh karena kolam tipis, tapi $1,4 miliar tidak keluar tanpa alasan.", correct: true },
            { text: "Panik DEX lokal — harga jatuh = likuiditas tipis", why: "Panik lokal (kuadran 3) punya net flow ≈ 0. Di sini flow-nya −$1,4 miliar — itu eksodus, bukan kepanikan sesaat.", },
            { text: "Tidak bisa diklasifikasi tanpa tahu harga bitcoin", why: "Harga bitcoin tidak relevan untuk klasifikasi depeg stablecoin — yang relevan: deviasi, durasi, flow.", },
          ],
        },
        {
          q: "Mengapa harga DEX jatuh DULUAN saat depeg (sebelum CEX dan oracle)?",
          options: [
            { text: "DEX dimanipulasi penyerang", why: "Tidak perlu penyerang: 1.000 penjual panik di kolam tipis sudah cukup menggeser rasio x·y=k.", },
            { text: "Harga AMM = rasio cadangan; saat semua orang jual ke kolam tipis, rasio bergeser — DEX mengukur tekanan jual lokal, bukan konsensus global", why: "Tepat (bekal BCD4). DEX = sensor tercepat tapi paling berisik. Oracle lambat karena dirancang begitu (threshold + heartbeat).", correct: true },
            { text: "Oracle selalu lebih cepat dari DEX", why: "Kebalik: oracle Chainlink update hanya jika > 0,5% atau heartbeat — ia sensor TERLAMBAT saat crash.", },
            { text: "CEX menahan harga secara artifisial", why: "CEX tidak 'menahan' — ia hanya punya likuiditas lebih dalam sehingga bergerak lebih lambat. Tidak ada konspirasi, hanya mekanika.", },
          ],
        },
        {
          q: "Kriteria TERUKUR untuk menyatakan 'depeg selesai'?",
          options: [
            { text: "Harga kembali tepat $1,00", why: "'Tepat $1,00' hampir tidak pernah terjadi (noise ±0,5% normal). Kriteria mustahil = tidak pernah selesai.", },
            { text: "Perasaan pasar sudah tenang (baca berita)", why: "Perasaan bukan metrik. Analis butuh angka yang bisa diaudit orang lain.", },
            { text: "Deviasi dalam ±0,5% selama 24 jam berurutan + net flow netral/positif + spread tiga harga < 0,3%", why: "Tepat: tiga syarat tertulis (harga, flow, spread) — masing-masing terukur, bisa dicek ulang. Tanpa kriteria tertulis, 'pulih' hanya opini.", correct: true },
            { text: "Satu jam di atas $0,99", why: "Satu jam terlalu singkat (ingat: event 1-menit = noise; pemulihan 1-jam bisa jadi jeda sebelum gelombang kedua).", },
          ],
        },
      ],
      summary: [
        "Peg = keyakinan + mekanisme redeem, bukan properti token; goyahnya diukur, bukan ditebak.",
        "Triplet depeg: deviasi (D=(P−1)×100%), durasi (periode berurutan > ambang θ), kedalaman + bentuk; θ selalu eksplisit.",
        "Benchmark S&P (2021–2023): USDC < $0,90 selama 23 mnt, DAI 20 mnt; USDT < $0,95 hanya 1 mnt; BUSD tak pernah < $0,975.",
        "Net flow (mint − redeem) = pembeda kuadran 2 (struktural) vs kuadran 3 (panik DEX lokal).",
        "Urutan jatuh DEX → CEX → oracle = arsitektur; spread tiga harga = peta keyakinan.",
        "Aturan 10 detik: 3 YA (deviasi > 1%, durasi > 1 jam, redeem besar) = struktural; 'selesai' butuh kriteria tertulis.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};
