import type { V2Lesson } from "../lib/types";

// Bar chart: distribusi underpricing IPO hari pertama (jumlah IPO per rentang, ilustratif).
const IPO_SVG = `<svg viewBox='0 0 480 280' role='img' aria-label='Distribusi underpricing IPO: paling banyak di rentang 0 sampai 20 persen, ekor kanan sampai di atas 100 persen.'>
<g stroke='var(--chart-grid)' stroke-width='1'><line x1='48' y1='30' x2='464' y2='30'/><line x1='48' y1='80' x2='464' y2='80'/><line x1='48' y1='130' x2='464' y2='130'/><line x1='48' y1='180' x2='464' y2='180'/><line x1='48' y1='230' x2='464' y2='230'/></g>
<g fill='var(--chart-text)' font-size='11' font-family='var(--font-ui)' text-anchor='end'><text x='42' y='34'>35</text><text x='42' y='84'>26</text><text x='42' y='134'>17</text><text x='42' y='184'>9</text><text x='42' y='234'>0</text></g>
<g font-size='12' font-family='var(--font-ui)' text-anchor='middle'>
<rect x='66' y='187.1' width='56' height='42.9' fill='var(--c4)'/><text x='94' y='177' fill='var(--text)' font-weight='600'>10</text><text x='94' y='248' fill='var(--chart-text)'>&lt;0%</text>
<rect x='146' y='80' width='56' height='150' fill='var(--c2)'/><text x='174' y='70' fill='var(--text)' font-weight='600'>35</text><text x='174' y='248' fill='var(--chart-text)'>0–20%</text>
<rect x='226' y='110' width='56' height='120' fill='var(--c2)'/><text x='254' y='100' fill='var(--text)' font-weight='600'>28</text><text x='254' y='248' fill='var(--chart-text)'>20–50%</text>
<rect x='306' y='165.7' width='56' height='64.3' fill='var(--c5)'/><text x='334' y='155' fill='var(--text)' font-weight='600'>15</text><text x='334' y='248' fill='var(--chart-text)'>50–100%</text>
<rect x='386' y='200' width='56' height='30' fill='var(--c4)'/><text x='414' y='190' fill='var(--text)' font-weight='600'>7</text><text x='414' y='248' fill='var(--chart-text)'>&gt;100%</text>
</g>
<text x='48' y='270' font-size='11' fill='var(--text-muted)' font-family='var(--font-ui)'>Underpricing = (harga hari pertama − harga IPO) / harga IPO. Data ilustratif 95 IPO.</text>
</svg>`;

export const e21: V2Lesson = {
  slug: "e21-investment-banking",
  track: "Financial Markets",
  module: "Investment Banking",
  title: "E21. Investment Banking: IPO, Underwriting & M&A",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-ipo",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "IPO naik 150% hari pertama — siapa yang rugi?",
      prose: [
        "IPO saham “MAJU” dipatok Rp500. Hari pertama perdagangan ditutup di Rp1.250 — melonjak 150%. Media merayakan “IPO tersukses tahun ini”. Investor yang dapat jatah alokasi pesta. Tapi ada satu pihak yang diam-diam rugi besar: perusahaan MAJU sendiri.",
        "Twist-nya: 200 juta saham × selisih Rp750 = Rp150 miliar “tertinggal di meja”. Uang yang SEHARUSNYA masuk kas perusahaan (untuk pabrik, riset, ekspansi) justru menjadi keuntungan instan bagi investor yang beruntung dapat alokasi. Underpricing = perusahaan menjual terlalu murah. “IPO sukses” bagi investor sering berarti “IPO kemurahan” bagi perusahaan.",
        "Lesson ini: mesin di balik layar pasar modal — investment bank yang menentukan harga IPO, menanggung risiko penjualan (underwriting), dan merancang merger & akuisisi.",
      ],
      tasks: [],
      note: {
        title: "Kilasan kilat prasyarat",
        body: "Saham = klaim sisa atas perusahaan — pemegang saham dibayar terakhir setelah kreditor; harga wajarnya = nilai kini ekspektasi arus kas masa depan. IPO = pertama kali klaim ini dijual ke publik, dan bankir investasi membantu menentukan harganya. Pasar primer = tempat efek baru diterbitkan (uang mengalir KE perusahaan); pasar sekunder = jual-beli antar investor (uang tidak ke perusahaan). IPO terjadi di pasar primer — satu-satunya momen perusahaan benar-benar menerima dana dari penjualan sahamnya.",
      },
      reference: "Underpricing = diskon yang dibayar perusahaan ke investor. “Sukses” tergantung dari sisi mana.",
    },
    {
      id: "ipo-proses",
      eyebrow: "Langkah 2 · Lab: anatomi IPO",
      title: "Bookbuilding, greenshoe, dan harga yang “salah”",
      prose: [
        "Proses IPO: (1) bankir investasi menilai perusahaan (valuasi) dan mengusulkan rentang harga; (2) bookbuilding — roadshow ke investor institusi, mencatat minat di tiap level harga (“buku” pesanan); (3) penetapan harga final (biasanya di atas/bawah rentang, jarang di tengah); (4) alokasi + pencatatan perdana; (5) stabilisasi 30 hari via greenshoe (opsi jual 15% saham tambahan untuk menahan harga bila anjlok).",
        "Kenapa underpricing nyaris selalu terjadi? Teori winner's curse: investor yang paling optimistis (dan paling banyak ditawari) adalah yang paling mungkin overpay — jadi investor rasional menuntut diskon sebagai kompensasi. Bankir pun punya insentif: IPO yang “meledak” menyenangkan klien investor institusi (calon klien berikutnya) dan mengurangi risiko underwriter tidak laku.",
        "💡 Tips: greenshoe = underwriter boleh menjual 115% dari saham yang ada (15% “pinjaman”); jika harga turun, ia membeli kembali di pasar (menopang harga) — jika harga naik, ia mengeksekusi opsi saham tambahan dari perusahaan. Stabilisator 30 hari, bukan penjamin selamanya.",
      ],
      formula: String.raw`\text{underpricing} = \frac{P_1 - P_0}{P_0} \qquad \text{dana bersih} = P_0 \times N \times (1 - \text{fee})`,
      formulaNote: "P₀ = harga IPO, P₁ = harga penutupan hari pertama, N = jumlah saham dijual. Fee underwriter 3–7%. “Uang tertinggal di meja” = (P₁ − P₀) × N.",
      tasks: [
        { id: "t1", text: "Hitung `underpricing` (desimal) dan `dana_bersih` (Rp) yang diterima MAJU" },
        { id: "t2", text: "Hitung `left_on_table` (Rp) — uang yang tertinggal di meja" },
      ],
      expected: "underpricing=150%  dana_bersih=93M  left_on_table=150M",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Fee 7% = biaya IPO.” Biaya sesungguhnya = fee 7% (Rp7 M) + underpricing Rp150 M. Underpricing adalah biaya TERBESAR IPO — 20× lipat fee-nya — tapi tidak muncul di laporan sebagai “biaya”.",
      },
      hints: [
        "underpricing = (harga_h1 − harga_ipo) / harga_ipo.",
        "dana_bersih = harga_ipo × (saham_juta × 1e6) × (1 − fee_pct).",
        "left_on_table = (harga_h1 − harga_ipo) × (saham_juta × 1e6).",
      ],
      code: {
        starter: `harga_ipo = 500       # Rp per saham
harga_h1 = 1250       # penutupan hari pertama
saham_juta = 200      # juta lembar dijual
fee_pct = 0.07        # fee underwriter

# TULIS KODEMU
underpricing =
dana_bersih =
left_on_table =

print(f"underpricing={underpricing*100:.0f}%  dana_bersih={dana_bersih/1e9:.0f}M  left_on_table={left_on_table/1e9:.0f}M")`,
        lockLines: 4,
        solution: `harga_ipo = 500       # Rp per saham
harga_h1 = 1250       # penutupan hari pertama
saham_juta = 200      # juta lembar dijual
fee_pct = 0.07        # fee underwriter

# TULIS KODEMU
underpricing = (harga_h1 - harga_ipo) / harga_ipo
dana_bersih = harga_ipo * (saham_juta * 1e6) * (1 - fee_pct)
left_on_table = (harga_h1 - harga_ipo) * (saham_juta * 1e6)

print(f"underpricing={underpricing*100:.0f}%  dana_bersih={dana_bersih/1e9:.0f}M  left_on_table={left_on_table/1e9:.0f}M")`,
        checks: [
          { kind: "equal", task: "t1", name: "underpricing", value: 1.5, tol: 1e-9, label: "`underpricing` = 150%", msg: "(1250−500)/500 = 1,5." },
          { kind: "equal", task: "t1", name: "dana_bersih", value: 93e9, tol: 1e6, label: "`dana_bersih` = Rp93 M", msg: "500 × 200jt × 0,93 = Rp93 miliar masuk kas perusahaan." },
          { kind: "equal", task: "t2", name: "left_on_table", value: 150e9, tol: 1e6, label: "`left_on_table` = Rp150 M", msg: "750 × 200jt = Rp150 miliar — lebih besar dari dana yang diterima perusahaan!" },
          { kind: "stdout_matches", task: "t2", pattern: "underpricing=150%\\s+dana_bersih=93M\\s+left_on_table=150M", label: "`print` sesuai format", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Biaya IPO terbesar = underpricing, bukan fee. Winner's curse menjelaskan kenapa ia persisten.",
    },
    {
      id: "underwriting",
      eyebrow: "Langkah 3 · Underwriting",
      title: "Siapa menanggung risiko kalau saham tidak laku?",
      prose: [
        "Dua kontrak underwriting: firm commitment — bank MEMBELI seluruh saham dari perusahaan lalu menjualnya ke publik; kalau tidak laku, bank yang rugi (makanya fee 5–7%: premi risiko). Best efforts — bank hanya “berusaha sebaik mungkin” menjualkan; risiko tidak laku tetap di perusahaan (fee lebih kecil, dipakai perusahaan kecil/berisiko).",
        "Selain IPO saham, investment bank juga meng-underwrite OBLIGASI korporasi (membantu perusahaan menerbitkan utang), menasihati M&A, dan melakukan market making. Tiga peran, tiga sumber fee: underwriting spread, advisory fee (1–2% nilai transaksi M&A), trading.",
        "Konflik kepentingan adalah bayang-bayang industri ini: bank menasihati perusahaan (ingin harga IPO tinggi) SEKALIGUS melayani investor institusi (ingin harga murah agar dapat untung). Chinese wall — pemisah divisi advisory dan trading/investasi — adalah jawabannya secara teori; dalam praktik, insentif fee selalu menggoda. Inilah kenapa analis independen dan prospektus yang dibaca kritis itu penting.",
        "🚨 Mitos: “Investment bank = bank tempat menabung/investasi.” Yang benar: investment bank BUKAN bank ritel — ia tidak menghimpun tabungan dan tidak menyalurkan KPR. Ia adalah firma jasa korporasi: membantu perusahaan menerbitkan efek dan bertransaksi. Nasabahnya korporasi, bukan kamu.",
        "💡 Tips: lock-up period (biasanya 90–180 hari) melarang insider menjual sahamnya pasca-IPO. Berakhirnya lock-up = potensi banjir suplai → perhatikan tanggalnya sebelum membeli saham IPO di pasar sekunder.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Firm commitment = bank mengambil market risk ke bukunya sendiri. Saat pasar crash di tengah proses IPO (contoh: 2008, 2020), underwriter bisa rugi miliaran dalam semalam — risiko yang dibayar oleh fee 5–7% di masa tenang.",
      },
      reference: "Firm commitment = risiko di bank. Best efforts = risiko di perusahaan.",
    },
    {
      id: "merger-math",
      eyebrow: "Langkah 4 · Lab: merger",
      title: "Akuisisi: akretif, dilutif, atau ilusi?",
      prose: [
        "Logika M&A: 1 + 1 > 2 lewat sinergi — sinergi biaya (tutup kantor ganda, PHK overlap) dan sinergi pendapatan (cross-selling, pricing power). Harga yang dibayar biasanya premium 30–50% di atas harga pasar target — premi ini adalah “taruhan” bahwa sinergi akan melebihi premi.",
        "Tes cepatnya: accretion/dilution. EPS gabungan = (laba A + laba B + sinergi) / (saham A + saham baru diterbitkan). Jika EPS gabungan > EPS A semula = akretif (menaikkan EPS); jika lebih rendah = dilutif. Akretif BUKAN berarti bagus — menerbitkan saham murah untuk membeli laba bisa akretif secara akuntansi tapi menghancurkan nilai jika sinerginya fiktif.",
        "Kenapa banyak merger gagal? Winner's curse (pemenang lelang = yang paling overpay), integrasi budaya yang diremehkan, dan sinergi pendapatan yang tidak pernah datang (sinergi biaya relatif pasti; sinergi pendapatan relatif khayalan). Studi konsisten: mayoritas akuisisi menghancurkan nilai bagi pemegang saham PENGAKUISISI.",
        "🚨 Mitos: “Saham pengakuisisi naik saat merger diumumkan = mergernya bagus.” Yang benar: reaksi harga harian mencerminkan ekspektasi sesaat yang sering meleset — euforia pengumuman bukan validasi. Yang menentukan adalah realisasi sinergi 2–3 tahun kemudian, dan di situlah mayoritas merger gagal.",
        "🚨 Mitos: “Bayar premi 40% wajar — semua merger begitu.” Yang benar: premi 30–50% adalah TARUHAN, bukan kewajaran. Setiap poin premi harus dibayar kembali oleh sinergi nyata; “wajar karena umum” adalah cara paling mahal untuk membenarkan overpay.",
      ],
      formula: String.raw`\text{EPS}_{\text{gabungan}} = \frac{\text{laba}_A + \text{laba}_B + \text{sinergi}}{\text{saham}_A + \text{saham}_{\text{baru}}} \qquad \text{sinergi impas} = \text{EPS}_A \times \text{saham}_{\text{total}} - \text{laba}_A - \text{laba}_B`,
      formulaNote: "EPS_A = laba_A / saham_A (sebelum merger). Sinergi impas = sinergi minimum agar EPS tidak turun — di bawah itu, merger dilutif.",
      tasks: [
        { id: "t1", text: "Hitung `eps_gabungan` (Rp) dan `akretif` (True/False)" },
        { id: "t2", text: "Hitung `sinergi_impas` (Rp)" },
      ],
      expected: "EPS_sebelum=1200  EPS_gabungan=1272  akretif=True  sinergi_impas=6.0M",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Akretif = merger bagus, langsung setuju.” Akretif hanya soal aritmetika EPS. Merger bisa akretif tapi buruk: sinergi Rp15 M di atas kertas belum tentu terealisasi, sementara 25 juta saham baru yang diterbitkan = dilusi kepemilikan permanen.",
      },
      hints: [
        "eps_sebelum = laba_a / saham_a; eps_gabungan = (laba_a + laba_b + sinergi) / (saham_a + saham_baru).",
        "akretif = eps_gabungan > eps_sebelum.",
        "sinergi_impas: balik rumusnya — sinergi agar eps_gabungan == eps_sebelum.",
      ],
      code: {
        starter: `laba_a, saham_a = 120_000_000_000, 100_000_000  # Rp, lembar (PT Akuisitor)
laba_b, saham_baru = 24_000_000_000, 25_000_000   # target dibeli dgn 25jt saham baru
sinergi = 15_000_000_000  # Rp/tahun, klaim manajemen

eps_sebelum = laba_a / saham_a

# TULIS KODEMU
eps_gabungan =
akretif =

# TULIS KODEMU: sinergi minimum agar tidak dilutif
sinergi_impas =

print(f"EPS_sebelum={eps_sebelum:.0f}  EPS_gabungan={eps_gabungan:.0f}  akretif={akretif}")
print(f"sinergi_impas={sinergi_impas/1e9:.1f}M")`,
        lockLines: 5,
        solution: `laba_a, saham_a = 120_000_000_000, 100_000_000  # Rp, lembar (PT Akuisitor)
laba_b, saham_baru = 24_000_000_000, 25_000_000   # target dibeli dgn 25jt saham baru
sinergi = 15_000_000_000  # Rp/tahun, klaim manajemen

eps_sebelum = laba_a / saham_a

# TULIS KODEMU
eps_gabungan = (laba_a + laba_b + sinergi) / (saham_a + saham_baru)
akretif = eps_gabungan > eps_sebelum

# TULIS KODEMU: sinergi minimum agar tidak dilutif
sinergi_impas = eps_sebelum * (saham_a + saham_baru) - laba_a - laba_b

print(f"EPS_sebelum={eps_sebelum:.0f}  EPS_gabungan={eps_gabungan:.0f}  akretif={akretif}")
print(f"sinergi_impas={sinergi_impas/1e9:.1f}M")`,
        checks: [
          { kind: "equal", task: "t1", name: "eps_gabungan", value: 1272, tol: 1, label: "`eps_gabungan` = Rp1.272", msg: "(120+24+15)M / 125jt = 1272." },
          { kind: "equal", task: "t1", name: "akretif", value: true, label: "`akretif` = True", msg: "1272 > 1200 — akretif secara aritmetika." },
          { kind: "equal", task: "t2", name: "sinergi_impas", value: 6e9, tol: 1e6, label: "`sinergi_impas` = Rp6 M", msg: "1200 × 125jt − 144M = Rp6 M. Klaim Rp15 M = 2,5× ambang — skeptis itu sehat." },
          { kind: "stdout_matches", task: "t2", pattern: "EPS_sebelum=1200\\s+EPS_gabungan=1272\\s+akretif=True", label: "`print` baris 1 sesuai format", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t2", pattern: "sinergi_impas=6\\.0M", label: "`print` baris 2 sesuai format", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Akretif = aritmetika. Bagus = sinergi terealisasi > premi dibayar.",
    },
    {
      id: "chart-ipo",
      eyebrow: "Langkah 5 · Chart",
      title: "Seberapa umum IPO “meledak”?",
      prose: [
        "Cara membaca: sumbu X = rentang underpricing hari pertama; tinggi batang = jumlah IPO dalam rentang itu (dari 95 IPO ilustratif).",
        "Interpretasi: mayoritas IPO underpriced 0–50% — “meledak moderat” adalah normal, bukan pengecualian. Ekor kanan (di atas 100%) jarang tapi spektakuler — inilah yang masuk berita dan membentuk persepsi “IPO selalu meledak”. Ekor kiri (< 0%, harga turun hari pertama) juga ada: 10 dari 95. Pelajaran: jangan menggeneralisasi dari berita; distribusinya yang bercerita.",
      ],
      figure: {
        svg: IPO_SVG,
        alt: "Distribusi underpricing IPO: paling banyak di rentang 0 sampai 20 persen, ekor kanan sampai di atas 100 persen.",
        caption: "Distribusi underpricing 95 IPO (ilustratif): moderat itu normal, ledakan itu ekor.",
      },
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ekor kanan distribusi = insentif underwriter untuk underprice lebih dalam (“IPO kami meledak 150%!” jadi iklan). Risiko ini ditanggung perusahaan penerbit — bukan bank.",
      },
      reference: "Berita menampilkan ekor; keputusan memakai distribusi.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 6 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang insentif IPO dan merger.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Kenapa bankir investasi tidak keberatan (bahkan senang) jika IPO “meledak” 150% hari pertama?",
          options: [
            { text: "Karena itu tugas mereka menaikkan harga", why: "Salah: tugas mereka melayani penerbit — harga wajar, bukan termurah." },
            { text: "IPO meledak menyenangkan investor institusi (klien masa depan), mengurangi risiko tidak laku, dan jadi iklan — biayanya ditanggung perusahaan penerbit, bukan bank", why: "Benar: insentif tidak selaras dengan penerbit.", correct: true },
            { text: "Karena mereka dapat bonus dari kenaikan itu", why: "Salah: fee dihitung dari dana terhimpun, bukan dari pop hari pertama." },
            { text: "Mereka tidak peduli sama sekali", why: "Salah: mereka peduli — hanya saja insentifnya miring." },
          ],
        },
        {
          q: "Merger akretif terhadap EPS. Apakah pemegang saham pengakuisisi pasti diuntungkan?",
          options: [
            { text: "Ya, EPS naik = pasti bagus", why: "Salah: akretif hanya aritmetika; sinergi bisa fiktif dan saham baru = dilusi permanen." },
            { text: "Tidak — akretif tidak menjamin sinergi terealisasi melebihi premi yang dibayar; mayoritas akuisisi justru menghancurkan nilai pengakuisisi", why: "Benar: uji sesungguhnya = realisasi sinergi vs premi.", correct: true },
            { text: "Ya jika dibayar tunai", why: "Salah: tunai menghindari dilusi saham tapi bisa berarti utang besar — tetap harus diuji." },
            { text: "Tidak pernah", why: "Salah: ada merger yang sukses — hanya saja minoritas." },
          ],
        },
      ],
    },
    {
      id: "minicase-merger",
      eyebrow: "Langkah 7 · Mini-case",
      title: "PT KONGLOMERAT mengincar PT KECIL",
      prose: [
        "PT KONGLOMERAT (laba Rp200 M, 100 jt saham → EPS Rp2.000) ingin mengakuisisi PT KECIL (laba Rp40 M) seharga Rp600 M — dibayar 50% tunai (dari kas) dan 50% saham baru KONGLOMERAT (harga pasar Rp4.000/lembar → 75 jt lembar baru). Manajemen mengklaim sinergi Rp50 M/tahun.",
        "Pertanyaan: (a) Hitung EPS gabungan dan tentukan akretif/dilutif. (b) Berapa sinergi impasnya? (c) Risiko apa yang tidak tertangkap angka EPS?",
        "Pembahasan: (a) Laba gabungan = 200 + 40 + 50 = Rp290 M; saham = 175 jt → EPS = Rp1.657 < Rp2.000 = DILUTIF meski sinergi Rp50 M! (b) Impas: 2000 × 175jt − 240M = Rp110 M sinergi — klaim Rp50 M bahkan tidak setengahnya. (c) Integrasi budaya, overpay (harga Rp600 M untuk laba Rp40 M = 15× earnings!), utang/tunai yang terkuras, dan perhatian manajemen terpecah. Pelajaran: bayar mahal + terbitkan banyak saham = dilutif walau ada sinergi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Harga 15× laba untuk perusahaan kecil = premi raksasa. Analis M&A selalu bertanya: “sinergi apa, siapa pemiliknya, kapan terealisasi?” — bukan “berapa EPS-nya”.",
      },
      reference: "Uji merger: sinergi impas dulu, baru percaya klaim manajemen.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Empat skenario di dunia IB",
      prose: [
        "Perusahaan butuh dana ekspansi → IPO jika butuh dana besar + siap transparansi publik (laporan triwulanan, sorotan media); pertimbangkan direct listing jika tidak butuh dana baru (hanya ingin likuiditas pemegang saham lama) — tanpa underpricing, tanpa fee besar.",
        "Menilai saham IPO untuk dibeli → tunggu berakhirnya lock-up dan stabilisasi greenshoe (30 hari); baca prospektus: ke mana dana IPO dipakai? (ekspansi = bagus; bayar utang pemegang saham lama = waspada). Jangan kejar pop hari pertama — itu lotre alokasi.",
        "Perusahaan diakuisisi dengan premi 40% → tanyakan: tunai atau saham? Tunai = kepastian; saham pengakuisisi = kamu ikut menanggung risiko integrasinya. Cek juga sinergi impasnya masuk akal atau tidak.",
        "Menjadi analis/konsultan M&A → kuasai tiga senjata: valuasi (DCF + pembanding), merger math (akresi/dilusi), dan skeptisisme terhadap sinergi pendapatan. Karier IB = 80% Excel + 20% negosiasi.",
        "Aturan 10 detik: underpricing = biaya tersembunyi IPO. Akretif ≠ bagus. Premi 30–50% = taruhan sinergi — minta buktinya.",
      ],
      note: {
        title: "Intuisi: banker menjual kepastian, menanggung yang tak pasti",
        body: "Fee underwriting 2–3% terlihat mahal sampai kamu sadar risikonya: di firm commitment, kalau saham tidak laku, banker yang menelan sisanya. Empat heuristik. Pertama: underwriting = bisnis pindah risiko — emiten membayar untuk kepastian dana; harga kepastian itu = fee + diskon IPO; IPO “meledak” 150% hari pertama bukan sukses — ia underpricing: emiten menjual terlalu murah, banker menyenangkan klien investor. Kedua: merger math — akretif (EPS naik) ≠ bagus; yang penting apakah harga bayar < nilai sinergi; banyak akuisisi akretif menghancurkan nilai karena membayar kemahalan demi EPS. Ketiga: bookbuilding = price discovery — banker mengetes minat investor institusi untuk menemukan harga; greenshoe = peredam 30 hari pertama (opsi beli kembali untuk stabilisasi). Keempat: sebagai ritel, pahami posisimu di rantai makanan — institusi dapat alokasi + informasi duluan; kamu dapat sisa + hype; lock-up insider berakhir = tekanan jual menantimu. Aturan 10 detiknya: IPO = lotre dengan tiket berbayar — ikut dengan uang yang siap hilang, atau tunggu 6 bulan sampai hype-nya reda dan lock-up lewat.",
      },
      tasks: [],
      reference: "IPO, beli IPO, diakuisisi, kerja di IB — empat lensa, satu matematika.",
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
        "IPO: bookbuilding → harga final → alokasi → stabilisasi greenshoe 30 hari. Underpricing = (P₁−P₀)/P₀ — biaya terbesar IPO, dibayar perusahaan.",
        "Winner's curse menjelaskan underpricing persisten; insentif bankir (senangkan institusi, kurangi risiko) ikut mendorongnya.",
        "Underwriting: firm commitment = risiko di bank (fee 5–7%); best efforts = risiko di perusahaan.",
        "M&A: premi 30–50% = taruhan sinergi. Tes akresi/dilusi = aritmetika; tes sesungguhnya = sinergi terealisasi vs premi. Sinergi biaya > sinergi pendapatan (kepercayaan).",
        "Chinese wall & lock-up: pahami insentif dan kalendernya sebelum bertransaksi di sekitar IPO/M&A.",
      ],
      next: { label: "E22 — Reksa Dana & ETF", href: "/v2/learn/e22-reksa-dana-etf" },
      quiz: [
        {
          q: "Apa fungsi greenshoe dalam IPO?",
          options: [
            { text: "Menjamin harga tidak akan turun selamanya", why: "Salah: hanya 30 hari, dan hanya menstabilkan — bukan garansi." },
            { text: "Opsi 15% saham tambahan untuk stabilisasi 30 hari: menopang harga jika turun, eksekusi jika naik", why: "Benar: mekanisme stabilisasi underwriter.", correct: true },
            { text: "Diskon untuk investor ritel", why: "Salah: tidak ada hubungannya dengan diskon ritel." },
            { text: "Biaya tersembunyi IPO", why: "Salah: itu underpricing — greenshoe justru melindungi pasar." },
          ],
        },
        {
          q: "Perusahaan IPO memilih kontrak best efforts. Artinya?",
          options: [
            { text: "Bank membeli semua sahamnya dulu", why: "Salah: itu firm commitment." },
            { text: "Bank hanya berusaha menjualkan; jika tidak laku, risiko di perusahaan — fee lebih kecil", why: "Benar: trade-off risiko vs fee.", correct: true },
            { text: "IPO pasti sukses", why: "Salah: tidak ada yang pasti." },
            { text: "Tidak ada bank yang terlibat", why: "Salah: bank tetap terlibat sebagai agen penjual." },
          ],
        },
        {
          q: "Akuisisi dibayar 100% tunai dari kas perusahaan. Keuntungan vs dibayar saham?",
          options: [
            { text: "Tidak ada bedanya", why: "Salah: beda — tunai tidak mendilusi kepemilikan." },
            { text: "Menghindari dilusi saham; tapi menguras kas / menambah utang — uji arus kasnya", why: "Benar: trade-off dilusi vs likuiditas.", correct: true },
            { text: "Selalu lebih baik", why: "Salah: jika kas terkuras hingga membahayakan operasi, saham bisa lebih aman." },
            { text: "Selalu lebih buruk", why: "Salah: tergantung kondisi neraca." },
          ],
        },
        {
          q: "Lock-up period 180 hari berakhir minggu depan untuk saham IPO yang kamu incar. Langkah bijak?",
          options: [
            { text: "Beli sekarang juga sebelum insider menjual", why: "Salah: justru tunggu — banjir suplai bisa menekan harga." },
            { text: "Waspada potensi tekanan jual dari insider; pertimbangkan menunggu hingga pasokan terserap pasar", why: "Benar: kalender lock-up = kalender risiko suplai.", correct: true },
            { text: "Lock-up tidak relevan bagi investor ritel", why: "Salah: pelepasan jutaan lembar menggerakkan harga." },
            { text: "Jual semua saham lain untuk all-in", why: "Salah: all-in karena kalender = spekulasi, bukan strategi." },
          ],
        },
      ],
    },
  ],
};
