import type { ChapterPack } from "./bedahbuku";

export const PACK1: ChapterPack = {
  slug: "bab-1",
  bab: 1,
  judul: `The Map and the Territory`,
  catatan: `satu-satunya bab tanpa matematika — peta konteks sebelum bab-bab teknis.`,
  ideBesar: `sebelum membangun model apa pun, seorang quant harus memahami peta wilayahnya — kontrak apa yang diperdagangkan, di mana, oleh siapa, dan dari mana *excess returns* bisa muncul. Pesan penutup bab: *"theory is cheap and is often not hard. What is hard is putting the right tool at the service of the right insight."*`,
  diagram: `Standarisasi → konsolidasi demand → biaya transaksi turun → Likuiditas naik
      │                                              (tapi: mengorbankan fitur produk)
      ▼
Kontrak yang bisa dipakai strategi kuantitatif = STANDARDIZED + LIQUID
   (Equities & ETF · Futures · Bonds · Vanilla Options · IRS · CDS)

Modus perdagangan:
   Exchange (LOB + matching engine; keanggotaan wajib)
   OTC (lewat broker-dealer; bonds, IRS, FX, CDS)
   Dark Pools (ATS; LOB tidak transparan; ±16% saham AS tahun 2024)

Partisipan pasar:
   SELL SIDE                        BUY SIDE
   ├─ Dealers (spread, inventory)    ├─ Indexers (pasif)
   ├─ Brokers (tanpa risiko posisi)  ├─ Hedgers (lindung risiko bisnis)
   └─ Broker-dealers (dual traders)  ├─ Institutional active managers
                                     ├─ Asset allocators
                                     ├─ Informed traders (price discovery + liquidity)
                                     └─ Retail investors (umumnya uninformed)

Sumber excess returns (6 kelas):
   pure arbitrage · heterogeneous risk preferences · liquidity
   funding · flow predictability · informational advantage
        ▲                                              │
        └── terbatasi oleh: risiko, likuiditas, pendanaan ──┘

Kerangka proses investasi kuantitatif:
   DATA (prices & volumes · characteristics · time series · unstructured)
     → PRE-TRADE: risk · expected returns · transaction costs
     → DURING TRADE: risk constraints · signal aggregation · hedging
     → POST-TRADE: performance attribution · intertemporal volatility & leverage
        leverage = GMV / AuM`,
  konsep: [
    {
      nama: `Standardized claims`,
      definisi: `kontrak dengan atribut yang didefinisikan jelas dan dikenal semua pihak (saham/ETF, futures, bonds, vanilla options, IRS, CDS).`,
      relasi: `standardisasi mengonsolidasikan demand → menurunkan biaya → menaikkan likuiditas.`,
      contoh: `*Big Bang* ISDA 8 April 2009 menstandarkan kupon CDS (100 bps & 500 bps) + pembayaran upfront standar → memulihkan kepercayaan pada kelas aset ini.`,
    },
    {
      nama: `Liquid contract`,
      definisi: `bisa dibeli/dijual dalam ukuran besar dan waktu singkat tanpa biaya transaksi yang membuat strategi tidak ekonomis.`,
      relasi: `bukan sifat mutlak — ada aset bursa yang tidak likuid, dan ada produk OTC yang sangat likuid (mis. valuta). Lawannya: aset unik (rumah) yang butuh tawar-menawar bilateral dengan sedikit pembeli.`,
    },
    {
      nama: `Limit-order book (LOB) & matching engine`,
      definisi: `buku catatan pesanan aktif (size, jumlah, arah, harga) di exchange; mesin pencocok memasangkan beli–jual berdasar aturan prioritas.`,
      relasi: `jantung eksekusi di exchange; anggota exchange wajib punya tata kelola, proses risiko, dan struktur modal yang sehat.`,
    },
    {
      nama: `Dealer`,
      definisi: `penyedia likuiditas: mengambil sisi berlawanan dari transaksi klien. Profit dari **spread** ($ask - bid$; yang direalisasi biasanya lebih kecil dari yang dikutip) dan dari informasi order flow.`,
      relasi: `trader pasif (merespons klien), memegang inventory, menghadapi counterparty yang bisa lebih informed, status regulasi khusus.`,
    },
    {
      nama: `Broker`,
      definisi: `perantara yang mengeksekusi atas nama klien **tanpa memegang risiko posisi**. Layanan: akses bursa, anonimitas, clearing & settlement, prime-brokerage (custody, rehypothecation, margin loan, short location, riset, capital introduction).`,
      relasi: `dibayar komisi, bunga, dan **payment for order flow (PFOF)** — kompensasi dari market maker atas pengalihan arus order ritel.`,
    },
    {
      nama: `Broker-dealer (dual trader)`,
      definisi: `menggabungkan keduanya; risiko **front-running** (dealer memakai info order klien untuk trading duluan) → diatur Securities Exchange Act 1934.`,
    },
    {
      nama: `Excess returns`,
      definisi: `imbal hasil di atas aset bebas risiko (mis. US Treasuries jangka pendek).`,
      relasi: `bisa diprediksi (empiris) tetapi tidak selalu bisa dieksploitasi — terbatasi risiko, likuiditas, pendanaan, arus terprediksi, keunggulan informasi.`,
    },
    {
      nama: `Market efficiency (Malkiel, 1987)`,
      definisi: `pasar efisien terhadap set informasi $\\phi$ bila harga tidak berubah andaikan $\\phi$ diungkap ke semua partisipan → mustahil mencetak laba ekonomis dari $\\phi$.`,
    },
    {
      nama: `Tracking error`,
      definisi: `ukuran risiko penyimpangan portofolio manajer aktif dari benchmark.`,
      relasi: `portofolio aktif = posisi benchmark + posisi diskresioner ("tracking portfolio"); tracking error rendah → "closet indexer"/"index hugger".`,
    },
    {
      nama: `Price discovery & liquidity provisioning`,
      definisi: `dua fungsi informed traders: memperdagangkan mispricing hingga harga mendekati keseimbangan, dan memasok likuiditas menjelang kebutuhan yang terprediksi.`,
    },
  ],
  deepDive: [
    {
      judul: `Standardisasi × Likuiditas — fondasi strategi kuantitatif`,
      ringkas: `Standardisasi mengonsolidasikan demand sehingga biaya transaksi turun dan likuiditas naik — hanya kontrak yang lolos kedua syarat ini yang bisa di-"quant"-kan.`,
      definisi: `Bab ini membatasi cakupan hanya pada kontrak yang **terstandarisasi** (atributnya didefinisikan jelas, dikenal semua pembeli-penjual potensial) **dan likuid** (bisa dibeli/dijual dalam ukuran besar dan waktu singkat, tanpa biaya transaksi yang membuat strategi tidak ekonomis — bahkan untuk ukuran trading kecil sekalipun).`,
      kenapa: `Strategi kuantitatif hidup dari eksekusi berulang. Kalau setiap transaksi butuh pencarian counterparty yang lama atau menanggung biaya selip besar, sinyal sebagus apa pun mati di biaya. Itu sebabnya bab ini tidak membahas kepemilikan rumah, lukisan, atau "ide" — semuanya bukan klaim terstandarisasi/likuid.`,
      contoh: `Bayangkan dua dunia: 15,4 miliar lembar saham Apple (per Juli 2024) yang identik satu sama lain dan laku dalam hitungan detik, versus sebuah rumah dengan lokasi, ukuran, umur, denah, dan kondisi yang unik — penjualnya harus bernegosiasi satu-per-satu dengan segelintir pembeli. Dunia pertama bisa di-"quant"-kan; dunia kedua tidak.`,
      jebakan: `Mengira "diperdagangkan di bursa = pasti likuid". Bab ini menegaskan: *likuid bukan syarat perlu maupun cukup* dari status bursa — ada aset bursa yang volumenya minimal, dan ada produk OTC yang termasuk paling likuid di dunia (valuta).`,
    },
    {
      judul: `Dealer vs Broker — dua mesin sell side yang berbeda`,
      ringkas: `Dealer menanggung risiko dari inventory dan spread, broker justru dibayar untuk menghindari risiko posisi — tertukar berarti salah membaca seluruh struktur pasar.`,
      definisi: `*Dealer* menyediakan likuiditas dengan mengambil sisi berlawanan dari transaksi klien; ia trader **pasif** yang memegang **inventory** (portofolio posisi) dan untung bila rata-rata menjual lebih mahal dari harga belinya — dari **spread** (selisih $ask - bid$) yang terealisasi dan dari informasi yang ia baca dari order flow. *Broker* adalah perantara yang mengeksekusi pesanan klien **tanpa menahan risiko posisi** kapan pun.`,
      kenapa: `Keduanya "menjual jasa", tapi profil risikonya berlawanan: dealer dibayar untuk menanggung risiko (dan karenanya punya status regulasi khusus serta bisa dirugikan oleh klien yang lebih informed), sedangkan broker dibayar untuk *menghindari* risiko posisi — jasanya adalah akses, anonimitas, dan penyelesaian transaksi.`,
      contoh: `Dealer mengutip bid 100 dan ask 101 untuk suatu kontrak (quoted spread $= 1$). Kalau ia bisa membeli di 100 lalu menjual kembali di 101 berulang-ulang, spread 1 itu pendapatannya — tapi dalam praktik yang *terealisasi* lebih kecil karena harga bergerak dan sebagian flow datang dari klien yang lebih informed. Di sisi broker: klien meminjam modal lewat **margin loan** dengan bunga **$SOFR + \\text{spread}$**; saat short selling, hasil kas dari penjualan diinvestasikan broker di **$SOFR + \\text{spread}$**, dan klien menerima **$SOFR - \\text{spread}$** — selisihnya adalah pendapatan broker.`,
      jebakan: `Tiga jebakan seputar peran dealer, broker, dan broker-dealer — dirinci satu per satu di bawah.`,
      poin: [
        { judul: `Dealer ≠ broker`, isi: `Menyamakan dealer dan broker — padahal yang memegang inventory dan menanggung risiko harga hanya dealer.`, nada: "jebakan" },
        { judul: `PFOF: dealer membayar broker`, isi: `Mengira PFOF dibayar *oleh* broker ke klien ritel — sebenarnya **PFOF dibayar dealer/market maker *kepada broker*** sebagai kompensasi karena broker mengarahkan arus order ritel (yang umumnya uninformed dan karenanya menguntungkan bagi dealer) ke mereka.`, nada: "jebakan" },
        { judul: `Broker-dealer & risiko front-running`, isi: `Mengira broker-dealer aman-aman saja: gabungan dua peran menciptakan insentif **front-running** — dealer memakai informasi order klien untuk trading mendahului demand itu — sehingga diatur oleh Securities Exchange Act 1934.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Dark Pools — likuiditas yang disembunyikan`,
      ringkas: `Sekitar 16% saham AS diperdagangkan di venue yang menyembunyikan limit-order book-nya — bukan pasar gelap, melainkan jawaban atas dilema dampak harga.`,
      definisi: `Dark pool adalah jenis **Alternative Trading System (ATS)** yang **tidak membuat LOB-nya transparan**: detail order disembunyikan dan hanya detail perdagangan yang diumumkan *setelah* eksekusi. Per 2024, sekitar **16% saham AS** diperdagangkan di dark pools.`,
      kenapa: `Investor institusional dengan order besar menghadapi dilema: menampilkan niatnya di LOB publik sama dengan mengundang pasar bergerak melawannya (dampak harga). Dark pool menjawab kebutuhan mengeksekusi tanpa mengekspos intensi — mekanisme pasar yang sah, bukan "pasar gelap".`,
      contoh: `Manajer dana ingin membeli 2 juta lembar saham tanpa membuat harga naik sebelum ordernya selesai. Di exchange, order sebesar itu terlihat di LOB dan memancing reaksi; di dark pool, ia bisa dicocokkan dengan penjual tanpa ada yang melihat niatnya lebih dulu.`,
      jebakan: `Mengira dark pool = tempat transaksi ilegal/curang. Bab ini menempatkannya sejajar dengan exchange dan OTC sebagai *venue* yang berbeda desain: kadang bahkan dimiliki oleh exchange itu sendiri.`,
    },
    {
      judul: `Dari mana excess returns berasal — dan kenapa tidak selalu bisa diambil`,
      ringkas: `Enam sumber excess returns yang saling bertautan — dan tiga penghalang (risiko, likuiditas, pendanaan) yang membuat mispricing belum tentu berarti uang gratis.`,
      definisi: `*Excess returns* = imbal hasil di atas aset bebas risiko (mis. US Treasuries jangka pendek). Bab ini mendaftarkan **enam kelas** sumbernya: (1) pure arbitrage, (2) heterogeneous risk preferences, (3) liquidity, (4) funding, (5) flow predictability, (6) informational advantage — dengan catatan kategori ini tidak saling eksklusif.`,
      kenapa: `Ini peta "di mana uangnya" bagi seorang quant — dan sekaligus peta batasnya. Informasi yang akurat pun bisa tidak berguna bila tiga hal menghalangi: **risiko, likuiditas, pendanaan**.`,
      contoh: `Empat ilustrasi hambatannya — risiko, likuiditas, pendanaan, dan arus terprediksi — dirinci satu per satu di bawah.`,
      jebakan: `Tiga jebakan dalam menafsirkan mispricing dan sumber excess returns — dirinci di bawah.`,
      poin: [
        { judul: `Risiko: yakin belum tentu berani`, isi: `Kamu yakin pasar AS naik 8% tahun depan sementara kas di broker hanya memberi 2%. Apakah kamu all-in 100% ke SPY? Tidak — karena simpangan bakunya 20%, terlalu tidak nyaman.` },
        { judul: `Likuiditas: kasus 3Com/Palm`, isi: `Spin-off Palm oleh 3Com tahun 2000 — Palm bernilai pasar 54 miliar dolar AS sementara 3Com hanya 28 miliar dolar AS, menyiratkan nilai aset 3Com **−22 miliar dolar AS** (padahal 3Com tidak berutang, punya kas 1 miliar dolar AS, arus kas positif). Arbitrase "beli 3Com + short Palm" tampak jelas, tetapi saham Palm sulit/tidak bisa dipinjam untuk short — suku pinjamnya (kalau ada kuotasinya) terlalu mahal sehingga trade-nya mustahil.` },
        { judul: `Pendanaan: deleveraging spirals`, isi: `Aset murah setelah krisis ("deleveraging spirals") tidak bisa dibeli karena modal untuk margin dan buffer kerugian tidak cukup.` },
        { judul: `Arus terprediksi: kasus TSLA`, isi: `**TSLA ditambahkan ke NASDAQ 100 efektif 15 Juli 2013** (diumumkan 10 Juli); investor yang memprediksi lebih awal membeli TSLA lalu menjualnya di lelang penutupan tanggal efektif — karena ETF/reksadana pelacak indeks *wajib* membeli di hari itu, permintaannya mendorong harga. Ukuran investasi pasif besar: estimasi 17,5%–38% dari total AUM.` },
        { judul: `Harga salah ≠ untung pasti`, isi: `"Harga salah = untung pasti" — contoh 3Com/Palm membuktikan mispricing bisa bertahan karena hambatan eksekusi.`, nada: "jebakan" },
        { judul: `Liquidity provisioning ≠ front-running`, isi: `Menyamakan *liquidity provisioning* atas arus terprediksi dengan **front-running**: keduanya membeli/menjual berdasar prakiraan demand, tetapi front-running memakai informasi **non-publik** — itu bedanya.`, nada: "jebakan" },
        { judul: `Keenam kelas tidak terpisah rapi`, isi: `Mengira keenam kelas sumber itu kotak-kotak terpisah — bab menegaskan flow predictability dan liquidity berkaitan, dan batas antara "kompensasi menanggung risiko" vs "keunggulan informasi" biasanya kabur.`, nada: "jebakan" },
      ],
    },
    {
      judul: `Kerangka proses investasi kuantitatif — dari data sampai leverage`,
      ringkas: `Satu peta alur dari data mentah sampai keputusan leverage — sekaligus daftar isi yang menata seluruh buku ini.`,
      definisi: `Bab menyusun komponen analitis manajer portofolio kuantitatif dalam empat tahap — Data, Pre-trade, During trade, Post-trade — dirinci satu per satu di bawah.`,
      poin: [
        { judul: `Data: bahan mentah`, isi: `**Data**: harga & volume; characteristics — mis. free cash flow/market cap atau return 6 bulan terakhir; time series — CPI, yield Treasury 10 tahun, Fed Funds Effective Rate, VIX; unstructured data — "dark matter of financial data": transkrip earnings, berita, citra satelit.` },
        { judul: `Pre-trade: siapkan senjata`, isi: `**Pre-trade**: risk — volatilitas portofolio sebagai proksi; expected returns — bisa ribuan hingga jutaan estimasi; transaction costs & market impact.` },
        { judul: `During trade: eksekusi`, isi: `**During trade**: risk constraints/penalties, signal aggregation — menggabungkan banyak sinyal jadi satu, hedging decisions.` },
        { judul: `Post-trade: evaluasi & leverage`, isi: `**Post-trade**: performance attribution — menelusuri PnL aktual kembali ke sumbernya, ex-ante vs ex-post, termasuk menilai skill dalam sizing; intertemporal volatility allocation & **$\\mathrm{Leverage} = \\frac{GMV}{AuM}$**.` },
      ],
      kenapa: `Ini "peta" dari judul bab — dan sekaligus daftar isi buku ini (bab-bab berikutnya mengikuti susunan ini; penulis menyebut ada susunan alternatif, mis. Narang 2024 dan Pedersen 2015). Tanpa kerangka ini, seorang quant mudah terjebak mengagungkan satu komponen saja.`,
      contoh: `Sebuah sinyal memprediksi return 0,5% dalam sebulan. Itu belum strategi: dikurangi transaction costs & market impact, mungkin sisanya negatif — atau positif tapi terlalu kecil untuk menutup risiko. Keputusan leverage (GMV/AuM) lalu menentukan seberapa besar risiko dialokasikan antar periode, yang sangat menentukan pertumbuhan modal.`,
      jebakan: `Mengira *expected returns* (sinyal) adalah segalanya — pesan eksplisit bab: *"theory is cheap and is often not hard. What is hard is putting the right tool at the service of the right insight."* Keberhasilan datang dari memahami perilaku counterparty, aturan trading asetmu, dan cara kerja exchange — bukan dari teori yang paling canggih.

---`,
    },
  ],
  cheatsheet: `Cheatsheet Bab

> Satu halaman ringkas — cetak dan tempel. Semua definisi & hubungan dari Bab 1.

**Kontrak yang dipakai quant** = STANDARDIZED + LIQUID
- Standardized: atribut jelas, dikenal semua pihak. Liquid: ukuran besar + waktu singkat, biaya transaksi tidak membunuh strategi.
- Jenis: Equities & ETF · Futures · Bonds · Vanilla Options · IRS · CDS.

**Rantai standardisasi → likuiditas**
\`\`\`
Standarisasi ↑  →  demand terkonsolidasi  →  biaya transaksi ↓  →  likuiditas ↑
(tapi: mengorbankan fitur produk yang berguna)
\`\`\`
Contoh: CDS *Big Bang* ISDA, 8 Apr 2009 — kupon standar 100 & 500 bps + upfront standar.

**Venue perdagangan**
| Venue | Ciri | Catatan |
|---|---|---|
| Exchange | LOB + matching engine; wajib jadi anggota | AS: >12 bursa saham; tidak otomatis likuid |
| OTC | Via broker-dealer, tanpa LOB pusat | Bonds, IRS, FX spot/forward, CDS; FX sangat likuid |
| Dark Pools | ATS; LOB disembunyikan, trade diumumkan setelah eksekusi | ±16% saham AS (2024) |

**Sell side**
- Dealer: ambil sisi berlawanan, pegang inventory, profit dari spread terealisasi + info order flow. Trader pasif.
- Broker: eksekusi atas nama klien, **tanpa risiko posisi**. Dibayar: komisi, bunga, **PFOF** (dari market maker ke broker).
- Broker-dealer (dual trader): rawan front-running → diatur Securities Exchange Act 1934.

**Rumus & hubungan penting**
- **Spread** $= \\text{Ask Price} - \\text{Bid Price}$ (keuntungan dealer dari *realized spread*, $< \\text{quoted spread}$)
- **Leverage** $= \\frac{GMV}{AuM}$ (Gross Market Value ÷ Assets under Management)
- **Portofolio aktif** $= \\text{Posisi benchmark} + \\text{Tracking portfolio}$ (diskresioner) → tracking error = risiko penyimpangannya
- **Bunga margin loan** $= SOFR + \\text{spread}$ · **Hasil kas short selling (diterima klien)** $= SOFR - \\text{spread}$
- **Excess returns** $= \\text{return portofolio} - \\text{return aset bebas risiko}$ (mis. US T-bills)

**Enam sumber excess returns:** pure arbitrage · heterogeneous risk preferences · liquidity · funding · flow predictability · informational advantage
**Tiga penghambat eksploitasi:** risiko ($8\\%$ vs $2\\%$, tapi $\\sigma = 20\\%$ → tidak all-in) · likuiditas (3Com/Palm 2000: implied −22 miliar dolar AS, tak bisa short) · pendanaan (deleveraging spirals, margin tak cukup)

**Buy side (6):** Indexers (pasif; >37% kapitalisasi pasar AS 2020; BlackRock/Vanguard/State Street) · Hedgers (lindung risiko bisnis inti; mis. maskapai beli bahan bakar) · Institutional active managers (SPIVA: >60% underperform 1 thn; 91% tertinggal S&P500 15 thn per Jan 2024) · Asset allocators (multi-asset class + alternatif) · Informed traders (absolute returns; price discovery + liquidity provisioning) · Retail investors (±20% volume 2020; umumnya uninformed — alirannya diburu dealer)

**Proses investasi:** DATA (prices, characteristics, time series, unstructured) → PRE-TRADE (risk, expected returns, transaction costs) → DURING (risk constraints, signal aggregation, hedging) → POST-TRADE (performance attribution, leverage)

---`,
  prediksi: [
    {
      id: "P1",
      pertanyaan: `Menurutmu, kenapa strategi kuantitatif hanya memakai kontrak yang *terstandarisasi dan likuid* — bukan aset unik seperti properti atau lukisan?`,
      kunci: `Karena strategi kuantitatif hidup dari eksekusi berulang: standardisasi mengonsolidasikan demand → biaya transaksi turun → likuiditas naik, sehingga order besar bisa dieksekusi cepat dan murah. Aset unik (rumah) butuh tawar-menawar bilateral dengan sedikit pembeli — lambat, mahal, dan tidak bisa diskalakan oleh strategi sistematis.`,
    },
    {
      id: "P2",
      pertanyaan: `Dealer dan broker sama-sama "menjual jasa" di pasar. Menurutmu: siapa di antara keduanya yang memegang risiko posisi, dan dari mana masing-masing mendapatkan bayarannya?`,
      kunci: `Yang memegang risiko posisi (inventory) adalah **dealer** — ia dibayar dari **spread** yang terealisasi ($ask - bid$) plus informasi dari order flow. **Broker tidak memegang risiko posisi**; ia dibayar dari komisi, bunga (margin loan, cash), dan **payment for order flow** dari market maker.`,
    },
    {
      id: "P3",
      pertanyaan: `Kamu menemukan sekuritas yang sama dihargai berbeda di dua tempat (mispricing yang jelas). Apakah itu otomatis keuntungan pasti? Sebutkan minimal dua hal yang bisa menggagalkan arbitrase itu.`,
      kunci: `Tidak. Dua penggagal klasik dari bab ini: (1) **likuiditas** — contoh 3Com/Palm 2000: saham Palm tidak bisa dipinjam untuk short (atau suku pinjamnya terlalu mahal) sehingga arbitrase mustahil; (2) **risiko** — volatilitas di sekitar prediksi terlalu tinggi untuk berani ambil posisi besar; (3) **pendanaan** — tidak cukup modal untuk margin/buffer saat dibutuhkan. (Dua dari tiga sudah cukup.)`,
    },
  ],
  kuis: [
    {
      pertanyaan: `Menurut Bab 1, kontrak disebut *likuid* bila …`,
      opsi: [
        `A. diperdagangkan di bursa resmi`,
        `B. bisa dibeli/dijual dalam ukuran besar dan waktu singkat tanpa biaya transaksi yang membuat strategi tidak ekonomis`,
        `C. memiliki harga yang stabil dari hari ke hari`,
        `D. diterbitkan oleh perusahaan besar`,
      ],
      benar: 1,
      penjelasan: `definisi likuiditas bab ini fungsional (ukuran, kecepatan, biaya), bukan soal venue atau stabilitas harga.`,
    },
    {
      pertanyaan: `*Big Bang* ISDA pada 8 April 2009 berkaitan dengan …`,
      opsi: [
        `A. peluncuran limit-order book elektronik pertama`,
        `B. standardisasi kontrak CDS (kupon 100 & 500 bps + upfront standar) yang memulihkan kepercayaan pasar`,
        `C. larangan dark pools di Amerika Serikat`,
        `D. pembentukan Securities Exchange Act 1934`,
      ],
      benar: 1,
      penjelasan: `standardisasi kupon CDS 100/500 bps + upfront standar pada 8 April 2009; contoh nyata rantai standardisasi → kepercayaan/likuiditas.`,
    },
    {
      pertanyaan: `Dark pools berbeda dari exchange karena …`,
      opsi: [
        `A. tidak mengenakan biaya transaksi sama sekali`,
        `B. hanya memperdagangkan obligasi pemerintah`,
        `C. menyembunyikan detail limit-order book; detail perdagangan diumumkan setelah eksekusi`,
        `D. pesertanya hanya investor ritel`,
      ],
      benar: 2,
      penjelasan: `dark pool = ATS tanpa LOB transparan; ±16% saham AS (2024) diperdagangkan di sana.`,
    },
    {
      pertanyaan: `Perbedaan paling mendasar antara dealer dan broker adalah …`,
      opsi: [
        `A. dealer hanya beroperasi di pasar OTC, broker hanya di bursa`,
        `B. dealer memegang inventory/risiko posisi dan bertrading atas nama sendiri; broker mengeksekusi atas nama klien tanpa memegang risiko posisi`,
        `C. broker mengenakan spread, dealer mengenakan komisi`,
        `D. dealer wajib menjadi anggota bursa, broker tidak`,
      ],
      benar: 1,
      penjelasan: `dealer = liquidity provider dengan inventory dan risiko sendiri; broker = perantara tanpa risiko posisi.`,
    },
    {
      pertanyaan: `Seorang klien melakukan short selling lewat broker. Dari hasil kas penjualan itu, klien menerima …`,
      opsi: [
        `A. $SOFR + \\text{spread}$`,
        `B. $SOFR - \\text{spread}$ (broker menginvestasikan kasnya di $SOFR + \\text{spread}$)`,
        `C. Fed Funds Rate + spread`,
        `D. seluruh hasil kas tanpa potongan`,
      ],
      benar: 1,
      penjelasan: `broker menginvestasikan hasil kas short di $SOFR + \\text{spread}$, klien menerima $SOFR - \\text{spread}$; selisihnya pendapatan broker.`,
    },
    {
      pertanyaan: `*Tracking error* mengukur …`,
      opsi: [
        `A. selisih waktu eksekusi order di dua bursa`,
        `B. besarnya risiko penyimpangan portofolio manajer aktif terhadap benchmark-nya (portofolio aktif = posisi benchmark + tracking portfolio)`,
        `C. error pada data harga historis`,
        `D. biaya transaksi sebagai persentase return`,
      ],
      benar: 1,
      penjelasan: `tracking error rendah + klaim aktif = "closet indexer"/"index hugger".`,
    },
    {
      pertanyaan: `Kasus TSLA (ditambahkan ke NASDAQ 100, efektif 15 Juli 2013, diumumkan 10 Juli 2013) dipakai bab ini untuk mengilustrasikan …`,
      opsi: [
        `A. pure arbitrage`,
        `B. flow predictability — investor yang memprediksi rebalancing indeks membeli lebih awal dan menjual saat pelacak indeks wajib membeli`,
        `C. keunggulan informasi dari data satelit`,
        `D. kegagalan market efficiency`,
      ],
      benar: 1,
      penjelasan: `contoh utama predictable flows: aturan rekonstitusi indeks yang terjadwal menciptakan demand yang bisa diprediksi.`,
    },
    {
      pertanyaan: `Leverage dalam kerangka bab ini didefinisikan sebagai …`,
      opsi: [
        `A. total utang perusahaan dibagi ekuitasnya`,
        `B. Gross Market Value (GMV) portofolio dibagi Assets under Management (AuM) — $\\frac{GMV}{AuM}$`,
        `C. beta portofolio terhadap pasar`,
        `D. margin yang dipinjam dari broker dibagi kas klien`,
      ],
      benar: 1,
      penjelasan: `$\\mathrm{Leverage} = \\frac{GMV}{AuM}$, dipakai pada tahap post-trade (alokasi volatilitas antar-periode).`,
    },
  ],
  fsrs: [
    { depan: `Definisi kontrak yang "likuid" menurut Bab 1.`, belakang: `Bisa dibeli/dijual dalam ukuran besar dan waktu singkat tanpa biaya transaksi yang membuat strategi tidak ekonomis.` },
    { depan: `Enam jenis standardized claims yang dicakup buku ini.`, belakang: `Equities & ETF, futures, bonds, vanilla options, IRS, CDS.` },
    { depan: `Apa itu limit-order book (LOB)?`, belakang: `Catatan pesanan aktif di exchange (size, jumlah, arah beli/jual, harga) yang dicocokkan matching engine berdasar aturan prioritas.` },
    { depan: `Tiga modus perdagangan dalam bab ini.`, belakang: `Exchange, over-the-counter (OTC), dark pools.` },
    { depan: `Ciri khas dark pools dan pangsanya di AS (2024).`, belakang: `ATS yang menyembunyikan LOB; detail trade diumumkan setelah eksekusi; ±16% saham AS.` },
    { depan: `Perbedaan dealer vs broker soal risiko posisi.`, belakang: `Dealer memegang inventory/risiko posisi (trading atas nama sendiri); broker mengeksekusi atas nama klien tanpa memegang risiko posisi.` },
    { depan: `Dari mana dealer memperoleh profit?`, belakang: `Dari realized spread ($ask - bid$; biasanya $< \\text{quoted spread}$) dan informasi dari order flow.` },
    { depan: `Apa itu payment for order flow (PFOF)?`, belakang: `Kompensasi yang diterima broker DARI dealer/market maker atas pengalihan arus order ritel ke mereka.` },
    { depan: `Rumus leverage menurut Bab 1.`, belakang: `$\\mathrm{Leverage} = \\frac{GMV}{AuM}$ (Gross Market Value ÷ Assets under Management).` },
    { depan: `Enam sumber excess returns menurut Bab 1.`, belakang: `Pure arbitrage, heterogeneous risk preferences, liquidity, funding, flow predictability, informational advantage.` },
  ],
  feynman: [
    {
      poin: `Kenapa quant hanya memakai kontrak terstandarisasi & likuid`,
      penajaman: `kalau ditanya "kenapa tidak trading rumah atau lukisan dengan model kuantitatif?", harus bisa jawab soal biaya pencarian counterparty dan tawar-menawar bilateral.`,
    },
    {
      poin: `Rantai standardisasi → likuiditas beserta contoh CDS Big Bang 2009`,
      penajaman: `kalau ditanya "apa trade-off dari standardisasi?", harus bisa jawab: mengorbankan fitur produk yang berguna; dan apa yang distandarkan ISDA (kupon 100 & 500 bps + upfront standar).`,
    },
    {
      poin: `Peran LOB & matching engine di exchange`,
      penajaman: `kalau ditanya "apa isi satu baris order di LOB dan siapa yang memasangkannya?", harus bisa jawab: size, jumlah, arah, harga — dicocokkan matching engine.`,
    },
    {
      poin: `Dealer vs broker vs broker-dealer`,
      penajaman: `kalau ditanya "siapa yang pegang inventory, siapa yang dibayar PFOF, dan apa risiko front-running?", harus bisa jawab ketiganya tanpa tertukar.`,
    },
    {
      poin: `SOFR ± spread pada margin loan & short selling`,
      penajaman: `kalau ditanya "klien bayar berapa untuk margin loan, dan terima berapa dari hasil kas short-nya?", harus bisa jawab: bayar $SOFR + \\text{spread}$; terima $SOFR - \\text{spread}$.`,
    },
    {
      poin: `Enam partisipan buy side dan cirinya`,
      penajaman: `kalau ditanya "apa beda indexer, hedger, dan informed trader?", harus bisa jawab: indexer pasif replikasi benchmark; hedger lindungi risiko bisnis inti; informed trader kejar absolute return lewat price discovery & liquidity provisioning.`,
    },
    {
      poin: `Definisi excess returns & market efficiency (Malkiel)`,
      penajaman: `kalau ditanya "apa itu $\\phi$ dalam definisi efisiensi pasar?", harus bisa jawab: set informasi; pasar efisien terhadap $\\phi$ bila harga tak berubah andaikan $\\phi$ diungkap ke semua orang.`,
    },
    {
      poin: `Tiga penghambat arbitrase: risiko, likuiditas, pendanaan`,
      penajaman: `kalau ditanya "kenapa contoh 3Com/Palm bukan uang gratis?", harus bisa jawab: saham Palm tak bisa dipinjam untuk short (likuiditas), plus risiko volatilitas dan keterbatasan margin.`,
    },
    {
      poin: `Flow predictability lewat index rebalancing (kasus TSLA)`,
      penajaman: `kalau ditanya "kenapa rebalancing indeks menciptakan peluang?", harus bisa jawab: pelacak indeks wajib beli di tanggal efektif → demand terprediksi → penyedia likuiditas awal mengambil selisihnya (dengan risiko).`,
    },
    {
      poin: `Empat tahap proses investasi kuantitatif`,
      penajaman: `kalau ditanya "apa yang dikerjakan di pre-trade vs post-trade?", harus bisa jawab: pre-trade = risk, expected returns, transaction costs; post-trade = performance attribution (ex-ante vs ex-post) dan leverage/volatility allocation.`,
    },
  ],
  // Tata letak v2 (2026-10-17): jarak antar-simpul dilebarkan agar label garis
  // tidak bertabrakan dengan simpul; edge dealer→broker dirutekan via titik
  // atas (bawah = melewati simpul bd). Lihat LAPORAN_POLES_G1.md addendum.
  peta: {
    nodes: [
      { id: `std`, label: `Standardized claims`, x: 150, y: 80, konsepId: 0 },
      { id: `liq`, label: `Liquid contract`, x: 450, y: 80, konsepId: 1 },
      { id: `lob`, label: `LOB & matching engine`, x: 750, y: 80, konsepId: 2 },
      { id: `dealer`, label: `Dealer`, x: 150, y: 300, konsepId: 3 },
      { id: `bd`, label: `Broker-dealer`, x: 450, y: 300, konsepId: 5 },
      { id: `broker`, label: `Broker`, x: 750, y: 300, konsepId: 4 },
      { id: `excess`, label: `Excess returns`, x: 150, y: 520, konsepId: 6 },
      { id: `eff`, label: `Market efficiency`, x: 450, y: 520, konsepId: 7 },
      { id: `pdisc`, label: `Price discovery`, x: 1050, y: 300, konsepId: 9 },
      { id: `track`, label: `Tracking error`, x: 150, y: 740, konsepId: 8 },
    ],
    edges: [
      { from: `std`, to: `liq`, label: `konsolidasi demand` },
      { from: `dealer`, to: `lob`, label: `pasang order di` },
      { from: `broker`, to: `lob`, label: `eksekusi via` },
      { from: `dealer`, to: `broker`, label: `bayar PFOF ke`, via: [{ x: 450, y: -80 }] },
      { from: `bd`, to: `dealer`, label: `gabungan peran` },
      { from: `bd`, to: `broker`, label: `gabungan peran` },
      { from: `eff`, to: `excess`, label: `membatasi` },
      { from: `pdisc`, to: `eff`, label: `menuju` },
      { from: `pdisc`, to: `lob`, label: `terjadi di` },
      { from: `track`, to: `excess`, label: `risiko mengejar` },
    ],
  },
};
