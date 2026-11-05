import type { V2Lesson } from "../lib/types";

// Dua skenario CPPI: (1) turun bertahap — floor terjaga, eksposur menyusut;
// (2) gap crash semalam — floor jebol. BUKAN data aktual — ilustrasi konsep.
const CPPI_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="Dua skenario CPPI: skenario mulus nilai turun bertahap dan lantai 90 terjaga; skenario gap nilai anjlok semalam menembus lantai.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="540" y2="20"/><line x1="60" y1="75" x2="540" y2="75"/><line x1="60" y1="130" x2="540" y2="130"/><line x1="60" y1="185" x2="540" y2="185"/><line x1="60" y1="240" x2="540" y2="240"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">110</text><text x="54" y="134">90</text><text x="54" y="244">70</text></g>
<line x1="60" y1="130" x2="300" y2="130" stroke="var(--c4)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="290" y="122" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" text-anchor="end">floor 90</text>
<polyline points="70,75 110,85 150,95 190,105 230,112 270,118" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<text x="90" y="60" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Skenario mulus: lantai terjaga</text>
<text x="180" y="200" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">V=100, F=90, m=4</text>
<line x1="330" y1="130" x2="530" y2="130" stroke="var(--c4)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="520" y="122" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" text-anchor="end">floor 90</text>
<polyline points="340,75 420,80 425,205" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<circle cx="425" cy="205" r="5" fill="var(--c2)"/>
<text x="360" y="60" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Skenario gap: lantai JEBOL</text>
<text x="440" y="225" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">crash semalam: V 100 → 78</text>
<text x="330" y="200" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">E=40 → rugi 12 → V=88 &lt; 90</text>
</svg>`;

export const pmd9: V2Lesson = {
  slug: "pm-d9-cppi",
  track: "Portfolio Management",
  module: "Kuantitatif Terapan",
  title: "D9 — CPPI & Asuransi Portofolio: Lantai yang Bergerak",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-1987",
      eyebrow: "Langkah 1 · Cerita",
      title: "Asuransi yang memperparah kecelakaan",
      prose: [
        "19 Oktober 1987 — Black Monday. Dow Jones jatuh 22,6% dalam SEHARI, kejatuhan harian terbesar dalam sejarah. Di tengah kepanikan, banyak dana institusi merasa “aman”: mereka memakai portfolio insurance — strategi canggih yang mereplikasi put option secara dinamis (jual saat pasar turun, beli saat naik). Teorinya: lantai portofolio terjaga tanpa perlu membeli opsi yang mahal.",
        "Yang terjadi justru sebaliknya. Ribuan dana menjalankan program komputer yang SAMA: saat pasar turun, semua menjual — yang mendorong pasar turun lebih dalam — yang memicu lebih banyak penjualan. Asuransi portofolio berubah menjadi mesin penghancur berumpan-balik: proteksi yang dijanjikan justru memperbesar bencana yang ingin dihindari. “Asuransi” itu tidak punya cadangan nyata — hanya asumsi bahwa selalu ada pembeli di sisi lain.",
        "Twist-nya: dari puing 1987 lahir pertanyaan yang lebih jujur — bisakah lantai portofolio dijaga dengan ATURAN yang transparan, tanpa bergantung pada pasar opsi yang likuid dan tanpa asumsi “selalu bisa jual”? Jawabannya: CPPI (Constant Proportion Portfolio Insurance). Bukan sihir — hanya tiga angka (lantai, cushion, multiplier) dan disiplin rebalance yang brutal. Tetapi ia membawa jebakannya sendiri: gap risk, yang akan kamu rasakan di lab lesson ini.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mekanik CPPI — floor, cushion, multiplier — dan menghitung eksposur risky asset; (2) mensimulasikan rebalance CPPI langkah demi langkah termasuk cash lock-in; (3) menjelaskan TIPP sebagai varian ratchet dan kapan ia dipakai; (4) menghitung skenario gap risk dan menunjukkan kapan floor jebol; (5) memilih antara CPPI, protective put, stop-loss, dan buy-and-hold untuk kasus nyata.",
        "Daftar isi: 1) Cerita 1987 · 2) Modal dasar: opsi & delta hedging (ringkas) · 3) Mekanik CPPI: tiga angka · 4) Lab: simulasi rebalance · 5) TIPP, gap risk & biaya · 6) Lab: multiplier besar vs kecil · 7) Peta keputusan · 8) Mini-case: Rp1M · 9) Checkpoint.",
        "Metadata: ±50 menit · 2 lab Python · 1 chart · 5 kuis · 1 mini-case. Prasyarat: tidak ada — semua modal diringkas di Langkah 2.",
      ],
      tasks: [],
      reference: "CPPI = lantai yang dijaga aturan, bukan janji. Aturan punya harga: gap risk.",
    },
    {
      id: "modal-dasar",
      eyebrow: "Langkah 2 · Modal dasar (ringkas, self-contained)",
      title: "Dua fondasi yang dibawa masuk — tanpa perlu buka lesson lain",
      prose: [
        "Fondasi 1 — opsi sebagai asuransi. Put option = hak (bukan kewajiban) menjual di harga strike; payoff-nya seperti tongkat hoki — datar lalu menukik — sehingga protective put (saham + put) memberi lantai pada portofolio. Harganya = premi, yaitu BIAYA asuransi yang hangus jika pasar naik. Put-call parity menghubungkan harga call, put, saham, dan strike. Intinya: proteksi selalu punya harga eksplisit (premi) atau implisit (aturan dinamis) — tidak ada makan siang gratis.",
        "Fondasi 2 — delta hedging & replikasi dinamis. Opsi bisa “ditiru” tanpa membelinya: jual-beli aset dasar mengikuti delta (sensitivitas harga opsi terhadap harga saham). Masalahnya: gamma — delta berubah saat harga bergerak, sehingga replikasi butuh trading terus-menerus; di pasar lompat (gap), replikasi gagal total. Inilah yang runtuh pada 1987. CPPI pada dasarnya adalah replikasi dinamis yang disederhanakan menjadi tiga angka — dan mewarisi kelemahan yang sama terhadap lompatan harga.",
        "Dengan dua fondasi ini logika CPPI menjadi jelas: ia mengambil ide protective put (lantai + premi), lalu mengganti premi eksplisit dengan ATURAN rebalance dinamis ala delta hedging — lebih murah saat pasar tenang, tetapi rapuh saat pasar melompat.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: semua proteksi dinamis itu trend-following",
        body: "CPPI, delta hedging, stop-loss — semuanya menjual SETELAH turun dan membeli SETELAH naik. Artinya proteksi dinamis selalu procyclical: ia memperdalam tren, bukan melawannya. Di pasar mulus ia bekerja indah; di pasar berbalik-balik (whipsaw) ia membeli mahal-menjual murah berulang-ulang. Kenali watak ini sebelum memakai.",
      },
      reference: "Premi put = harga asuransi yang terlihat. Aturan CPPI = harga asuransi yang tersembunyi.",
    },
    {
      id: "konsep-mekanik",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Tiga angka yang menjaga lantai",
      prose: [
        "Definisi: CPPI membagi portofolio menjadi dua kantong berdasarkan tiga angka. Floor (F) = nilai minimum yang ingin dilindungi. Cushion (C) = V − F = “ruang napas” di atas lantai. Eksposur ke aset berisiko: E = m × C, di mana m = multiplier (konstanta, mis. 3–6). Sisanya (V − E) parkir di aset bebas risiko. Setiap periode, hitung ulang dan rebalance.",
        "Kepribadiannya: CPPI itu penjaga lantai yang gelisah — tidak pernah diam. Saat portofolio naik, cushion membesar, ia membeli LEBIH BANYAK aset berisiko (tambah untung). Saat turun, cushion menyusut, ia menjual (kecilkan rugi). Jika V menyentuh F, cushion = 0, E = 0: seluruh dana pindah ke aset aman — disebut cash lock-in. Lantainya “bergerak” karena F bisa dinaikkan mengikuti V (itu TIPP, di Langkah 5).",
        "Contoh dari definisi klasiknya: V = 100, F = 90, m = 5 → C = 10 → E = 50 ke aset berisiko, 50 ke aset bebas risiko. Jika V naik ke 110: C = 20 → E = 100 (beli lagi 50!). Jika V turun ke 95: C = 5 → E = 25 (jual 25). Rumusnya:",
      ],
      formula: String.raw`E_t = m \cdot C_t, \qquad C_t = V_t - F, \qquad B_t = V_t - E_t`,
      formulaNote:
        "E_t = eksposur aset berisiko periode-t; m = multiplier (konstanta ≥ 1, biasanya 3–6); C_t = cushion = ruang di atas lantai; V_t = nilai portofolio; F = floor (bisa konstan atau ratchet naik); B_t = alokasi aset bebas risiko. Aturan praktis: m ≤ 1 / (penurunan terburuk satu periode yang masih ditoleransi) — mis. toleransi −20% → m ≤ 5.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “CPPI menjamin lantai”",
        type: "pitfall",
        body: "Yang benar: CPPI menjaga lantai HANYA jika harga bergerak mulus dan rebalance bisa dieksekusi terus-menerus. Crash semalam −30% (gap) melewatkan semua titik rebalance — lantai jebol sebelum penjaga sempat bereaksi. “Jaminan” CPPI bersyarat pada asumsi pasar, bukan janji kontraktual seperti opsi.",
      },
      reference: "Tidak seperti strategi asuransi lain, CPPI tidak butuh horizon waktu yang ditetapkan — aturannya jalan terus.",
    },
    {
      id: "lab-simulasi-cppi",
      eyebrow: "Langkah 4 · Lab",
      title: "Rasakan rebalance CPPI di tanganmu",
      prose: [
        "Simulasikan 5 periode CPPI: V₀ = 100, F = 90, m = 4. Harga aset berisiko bergerak 100 → 92 → 82 → 86 → 90. Tiap periode: hitung cushion, eksposur target, rebalance, lalu terapkan return. Perhatikan apa yang terjadi pada eksposur saat V mendekati floor — itulah cash lock-in. Coba ubah m menjadi 6: seberapa agresif penjaga lantai ini?",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan `V` tiap periode dengan rebalance CPPI" },
        { id: "t2", text: "Cetak `E` (eksposur) tiap periode dan amati cash lock-in" },
      ],
      expected: "Periode 0: V=100.0 E=40.0 | ... | Periode 4: V=95.4 (floor 90 terjaga, E menyusut 40→18)",
      hints: [
        "Tiap periode: C = V - F; E_target = m*C; return risky r → V_baru = (V - E_target) + E_target*(1+r).",
        "Aset bebas risiko dianggap return 0 untuk simplifikasi.",
        "Perhatikan: saat C mengecil, E menyusut cepat — penjaga menjual di dasar.",
      ],
      code: {
        starter: `# Simulasi CPPI: V0=100, F=90, m=4
V, F, m = 100.0, 90.0, 4
prices = [100, 92, 82, 86, 90]   # harga aset berisiko tiap periode

# TULIS KODEMU
print(f"Periode 0: V={V:.1f} E={m*(V-F):.1f}")
for t in range(1, len(prices)):
    r = prices[t]/prices[t-1] - 1
    C =
    E =
    V =
    print(f"Periode {t}: V={V:.1f} E={E:.1f}  (r={r:+.1%})")
print()
print("Amati: E menyusut saat V turun — dan V akhir vs floor 90?")`,
        lockLines: 2,
        solution: `# Simulasi CPPI: V0=100, F=90, m=4
V, F, m = 100.0, 90.0, 4
prices = [100, 92, 82, 86, 90]   # harga aset berisiko tiap periode

# TULIS KODEMU
print(f"Periode 0: V={V:.1f} E={m*(V-F):.1f}")
for t in range(1, len(prices)):
    r = prices[t]/prices[t-1] - 1
    C = V - F
    E = m * C
    V = (V - E) + E * (1 + r)
    print(f"Periode {t}: V={V:.1f} E={E:.1f}  (r={r:+.1%})")
print()
print("Amati: E menyusut saat V turun — dan V akhir vs floor 90?")`,
        checks: [
          { kind: "equal", task: "t1", name: "V", value: 95.45, tol: 0.5, label: "`V` akhir ≈ 95,4", msg: "Floor 90 terjaga; E menyusut 40 → 18 (cash lock-in bertahap)." },
          { kind: "stdout_matches", task: "t2", pattern: "Periode 4: V=95\\.4", label: "`print` menampilkan V periode 4", msg: "Samakan format dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t2", pattern: "E=40\\.0", label: "`print` menampilkan E awal 40,0", msg: "E₀ = 4 × (100−90) = 40." },
        ],
      },
      reference: "V akhir 95,4 > floor 90: rebalance tiap periode menyerap penurunan; E menyusut 40 → 18 — itulah cash lock-in bertahap.",
    },
    {
      id: "tipp-gaprisk",
      eyebrow: "Langkah 5 · Konsep + chart",
      title: "TIPP, gap risk, dan biaya kegelisahan",
      prose: [
        "TIPP (Time-Invariant Portfolio Protection) = CPPI dengan lantai yang NAIK mengikuti portofolio: F_t = max(F_{t−1}, k × V_t) — mis. k = 90%. Saat V naik, lantai “diratchet” naik dan mengunci keuntungan; lantai tidak pernah turun. Cocok untuk investor yang berkata “saya tidak mau kembali rugi setelah cuan”. Harganya: ratchet membuat cushion lebih tipis → eksposur lebih kecil → upside lebih terbatas.",
        "Gap risk — musuh bebuyutan CPPI. Jika harga melompat melewati semua titik rebalance (crash semalam, trading halt, pasar tutup akhir pekan), kerugian = E × gap bisa melebihi cushion → V < F. Aturan multiplier m ≤ 1/(penurunan terburuk yang ditoleransi) adalah pertahanan teoritis; kenyataannya “terburuk” selalu bisa lebih buruk. Biaya kedua: whipsaw — di pasar sideways naik-turun, CPPI membeli mahal-menjual murah berulang-ulang; tiap rebalance membayar spread & komisi.",
        "Cara membaca chart: kiri = skenario mulus — V turun bertahap, rebalance tiap langkah, lantai 90 terjaga. Kanan = skenario gap — V anjlok semalam dari 100 ke 78, melewatkan rebalance.",
        "Interpretasi: pada skenario mulus, E₀ = 4×10 = 40 bekerja — kerugian bertahap terserap cushion. Pada skenario gap, rugi = 40 × (−22%) = −8,8 → V = 91,2? Tidak — contoh chart memakai gap −30%: rugi 12 → V = 88 < 90: floor JEBOL. Inilah bedanya teori dan praktik: CPPI menjanjikan proteksi terhadap risiko yang bisa diperdagangkan, bukan terhadap lompatan.",
      ],
      figure: {
        svg: CPPI_SVG,
        alt: "Dua skenario CPPI: turun bertahap membuat lantai 90 terjaga; gap crash semalam membuat lantai jebol.",
        caption: "CPPI vs lompatan harga: aturan rebalance hanya bekerja jika harga memberinya kesempatan.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: multiplier = seberapa percaya kamu pada kemulusan pasar",
        body: "m besar = percaya pasar bergerak mulus (cushion kecil tapi eksposur besar = efisien). m kecil = curiga ada lompatan (boros cushion, tetapi selamat dari gap). Memilih m bukan optimisasi matematika — melainkan pernyataan tentang seberapa liar menurutmu pasar bisa melompat dalam satu periode tanpa kamu bisa trading.",
      },
      reference: "TIPP mengunci cuan; CPPI biasa membiarkan lantai tetap — pilih sesuai janji ke klien.",
    },
    {
      id: "lab-multiplier",
      eyebrow: "Langkah 6 · Lab",
      title: "Multiplier besar vs kecil: siapa selamat?",
      prose: [
        "Bandingkan m = 2 vs m = 6 pada path harga yang SAMA (mulus, lalu crash −25% di akhir). Mana yang cuan lebih besar saat mulus? Mana yang lebih dekat ke floor saat crash? Coba tambahkan satu periode gap −30%: m = 6 bahkan jebol SEBELUM gap — gap hanya mengunci kegagalannya. Inilah trade-off multiplier dalam angka.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan `V2` (m=2) dan `V6` (m=6) pada path yang sama" },
        { id: "t2", text: "Terapkan gap −30% dan tentukan siapa yang jebol floor" },
      ],
      expected: "m=2: V=95.1 (aman) | m=6: V=85.0 (JEBOL) | Setelah gap -30%: m=2 V=92.0 aman, m=6 V=85.0 JEBOL",
      hints: [
        "Fungsi cppi(V0, F, m, rets): loop seperti lab sebelumnya.",
        "Path mulus: [0.03, 0.02, -0.04, -0.25] — crash di akhir.",
        "Gap: satu periode r = -0.30 dari V terakhir; jebol bila V < F.",
      ],
      code: {
        starter: `# Duel multiplier pada path yang sama
def cppi(V0, F, m, rets):
    V = V0
    for r in rets:
        E = max(0.0, m * (V - F))   # tanpa short: E tak negatif (cash lock-in)
        V = (V - E) + E * (1 + r)
    return V

F = 90.0
path = [0.03, 0.02, -0.04, -0.25]   # mulus, lalu crash -25%

# TULIS KODEMU
V2 =
V6 =
gap = -0.30
V2_gap =
V6_gap =

print(f"m=2: V={V2:.1f} ({'aman' if V2 >= F else 'JEBOL'}) | m=6: V={V6:.1f} ({'aman' if V6 >= F else 'JEBOL'})")
print(f"Setelah gap -30%: m=2 V={V2_gap:.1f} {'aman' if V2_gap >= F else 'JEBOL'}, m=6 V={V6_gap:.1f} {'aman' if V6_gap >= F else 'JEBOL'}")
print("Kesimpulan: m besar = efisien saat mulus, bunuh diri saat gap.")`,
        lockLines: 9,
        solution: `# Duel multiplier pada path yang sama
def cppi(V0, F, m, rets):
    V = V0
    for r in rets:
        E = max(0.0, m * (V - F))   # tanpa short: E tak negatif (cash lock-in)
        V = (V - E) + E * (1 + r)
    return V

F = 90.0
path = [0.03, 0.02, -0.04, -0.25]   # mulus, lalu crash -25%

# TULIS KODEMU
V2 = cppi(100.0, F, 2, path)
V6 = cppi(100.0, F, 6, path)
gap = -0.30
V2_gap = cppi(V2, F, 2, [gap])
V6_gap = cppi(V6, F, 6, [gap])

print(f"m=2: V={V2:.1f} ({'aman' if V2 >= F else 'JEBOL'}) | m=6: V={V6:.1f} ({'aman' if V6 >= F else 'JEBOL'})")
print(f"Setelah gap -30%: m=2 V={V2_gap:.1f} {'aman' if V2_gap >= F else 'JEBOL'}, m=6 V={V6_gap:.1f} {'aman' if V6_gap >= F else 'JEBOL'}")
print("Kesimpulan: m besar = efisien saat mulus, bunuh diri saat gap.")`,
        checks: [
          { kind: "equal", task: "t1", name: "V2", value: 95.07, tol: 0.3, label: "`V2` ≈ 95,1", msg: "CPPI m=2 pada path mulus + crash −25%." },
          { kind: "equal", task: "t1", name: "V6", value: 84.98, tol: 0.3, label: "`V6` ≈ 85,0 (JEBOL)", msg: "m=6 jebol bahkan tanpa gap: crash −25% terlalu curam untuk cushion tipisnya." },
          { kind: "equal", task: "t2", name: "V6_gap", value: 84.98, tol: 0.5, label: "`V6_gap` ≈ 85,0 (JEBOL)", msg: "E di-clamp 0 (cash lock-in): V tetap 84,98 < 90 — gap mengunci kegagalan." },
          { kind: "stdout_matches", task: "t2", pattern: "JEBOL", label: "`print` menandai yang jebol", msg: "m=6 harus JEBOL setelah gap −30%." },
        ],
      },
      reference: "Angka tidak berdebat: m=6 selamat dari crash bertahap, tewas oleh satu lompatan.",
    },
    {
      id: "peta-keputusan-cppi",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Proteksi mana untuk siapa?",
      prose: [
        "Skenario 1 — Dana pensiun butuh lantai keras, pasar opsi likuid tersedia. → Protective put (beli put sungguhan). Alasan: lantai KONTRAKTUAL — gap risk ditanggung penjual opsi, bukan kamu. Bayar premi eksplisit untuk kepastian.",
        "Skenario 2 — Reksadana di pasar tanpa opsi likuid, investor ritel butuh “jaminan modal”. → CPPI/TIPP dengan m konservatif (3–4). Alasan: tidak butuh pasar derivatif; transparan dan mudah dijelaskan. Wajib: ungkapkan gap risk di prospektus — “jaminan” yang tidak menyebut gap = menyesatkan.",
        "Skenario 3 — Trader aktif, horizon pendek, disiplin tinggi. → Stop-loss mekanis. Alasan: lebih sederhana & murah dari CPPI untuk horizon pendek; gap risk tetap ada — akui, jangan sembunyikan.",
        "Skenario 4 — Investor jangka panjang yang “tidak tahan lihat rugi” tetapi sebenarnya horizon 20 tahun. → Buy-and-hold + edukasi, BUKAN CPPI. Alasan: proteksi dinamis mengorbankan upside jangka panjang (cash lock-in di dasar!) untuk ketenangan semu; yang dibutuhkan adalah kontrak perilaku, bukan mesin trading.",
        "Aturan praktis 10 detik: (1) butuh kepastian kontraktual → beli opsi; (2) tidak ada pasar opsi → CPPI dengan m konservatif; (3) m ≤ 1/(lompatan terburuk yang kamu akui mungkin); (4) waspadai whipsaw — pasar sideways = musuh CPPI; (5) jangan pernah sebut “dijamin” tanpa kata “kecuali gap”.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Multiplier besar selalu lebih baik”",
        type: "pitfall",
        body: "Yang benar: m besar hanya unggul di pasar MULUS — ia memaksimalkan partisipasi upside dengan cushion tipis. Di pasar bergejolak ia whipsaw (beli mahal-jual murah berulang), dan SATU gap cukup untuk menjebol floor. m bukan “keberanian”, melainkan “kepercayaan pada kemulusan pasar” — dan pasar paling tidak mulus tepat saat kamu butuh proteksi.",
      },
      reference: "1987 mengajarkan: strategi yang sama dipakai semua orang = risiko sistemik. CPPI massal pun bisa procyclical.",
    },
    {
      id: "minicase-1m",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Rp1M dengan janji lantai Rp900jt",
      prose: [
        "Sebuah produk “proteksi modal” menghimpun Rp1M dengan janji: nilai tidak akan di bawah Rp900jt dalam 3 tahun. Manajer memakai CPPI: F = Rp900jt, m = 4. E₀ = 4 × Rp100jt = Rp400jt di saham, Rp600jt di obligasi/SBN.",
        "Pertanyaan: (a) Skenario mulus — saham turun 5% per kuartal selama 5 kuartal, lalu pulih. Apakah lantai terjaga? (b) Skenario gap — di kuartal ke-3, kabar buruk membuat saham anjlok 30% dalam dua hari (bursa sempat halt). Apakah lantai terjaga? (c) Apa yang harus ditulis manajer di prospektus agar janji “tidak di bawah Rp900jt” tidak menjadi kebohongan?",
        "Pembahasan. (a) Mulus: tiap kuartal E menyusut mengikuti cushion — setelah 5 kuartal V ≈ Rp920jt-an, lantai terjaga; cash lock-in parsial membuat pemulihan berikutnya lambat (cushion tipis = E kecil). (b) Gap: di kuartal ke-3 mis. V = Rp950jt → C = Rp50jt → E = Rp200jt; gap −30% → rugi Rp60jt → V = Rp890jt < Rp900jt: JEBOL Rp10jt. Janji dilanggar bukan karena manajer lalai, melainkan karena janji itu mustahil dijamin aturan dinamis. (c) Prospektus jujur: “Target proteksi Rp900jt berlaku untuk pergerakan pasar normal; tidak berlaku untuk lompatan harga (gap) — pada 1987/2020-style crash, nilai bisa di bawah target.” Pelajaran umum: bedakan TARGET proteksi dari JAMINAN proteksi — yang pertama tugas manajer, yang kedua hanya bisa diberikan penjual opsi (dengan premi).",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: tanya “siapa menanggung gap?”",
        body: "Setiap produk proteksi jawab satu pertanyaan: saat harga melompat, siapa yang menelan selisihnya? Protective put: penjual opsi (sudah dibayar premi). CPPI: KAMU (tidak ada yang membayar). Stop-loss: KAMU juga. Jika penjual tidak bisa menjawab pertanyaan ini dengan jelas, proteksinya fiktif.",
      },
      reference: "Produk “jaminan modal” tanpa penjelasan gap risk = janji yang menunggu dilanggar.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran dari semua langkah — dari rumus E = m×C hingga prospektus yang jujur."],
      tasks: [],
      summary: [
        "CPPI: E_t = m × C_t, C_t = V_t − F, sisanya di aset bebas risiko; rebalance tiap periode — naik = beli, turun = jual.",
        "Cash lock-in: V menyentuh F → E = 0 → seluruh dana di aset aman; pemulihan setelahnya lambat.",
        "TIPP = CPPI dengan floor diratchet naik (kunci cuan); harga: cushion tipis, upside terbatas.",
        "Gap risk: lompatan harga melewatkan rebalance → floor jebol; m ≤ 1/(lompatan terburuk yang ditoleransi).",
        "Pilih proteksi dengan jujur: butuh kepastian kontraktual → beli put; tanpa pasar opsi → CPPI konservatif + ungkapkan gap risk; jangan sebut “dijamin” tanpa “kecuali gap”.",
      ],
      next: { label: "D10 — Rebalancing: Kalender, Threshold & Tax-Aware", href: "/learn/pm-d10-rebalancing" },
      quiz: [
        {
          q: "V = 100, F = 90, m = 5 (contoh klasik). Eksposur aset berisiko?",
          options: [
            { text: "50", why: "Tepat: E = 5 × (100−90) = 50; sisanya 50 di aset bebas risiko.", correct: true },
            { text: "90", why: "Salah: 90 adalah floor — justru bagian yang TIDAK boleh dipertaruhkan." },
            { text: "10", why: "Salah: 10 adalah cushion — eksposur = m × cushion, bukan cushion-nya." },
            { text: "100", why: "Salah: itu tanpa proteksi sama sekali — floor 90 diabaikan." },
          ],
        },
        {
          q: "V turun mendekati F. Apa yang dilakukan CPPI dan apa konsekuensinya?",
          options: [
            { text: "Menambah eksposur (buy the dip)", why: "Salah: itu strategi contrarian — CPPI melakukan sebaliknya." },
            { text: "Mengurangi eksposur hingga E=0 (cash lock-in); pemulihan setelahnya lambat", why: "Tepat: cushion → 0 → E → 0. Lantai terjaga, tetapi dana “terkunci” di aset aman saat pasar rebound.", correct: true },
            { text: "Menurunkan floor agar cushion tetap", why: "Salah: menurunkan floor = melanggar janji proteksi; TIPP justru MENAIKKAN floor." },
            { text: "Tidak melakukan apa-apa", why: "Salah: CPPI rebalance tiap periode — diam = bukan CPPI." },
          ],
        },
        {
          q: "Kapan floor CPPI jebol meski aturan dijalankan sempurna?",
          options: [
            { text: "Saat pasar naik terus", why: "Salah: pasar naik = cushion membesar = lantai makin aman." },
            { text: "Saat harga melompat (gap) melewati titik rebalance — mis. crash semalam −30%", why: "Tepat: kerugian E × gap bisa melebihi cushion sebelum rebalance sempat dieksekusi. Inilah gap risk.", correct: true },
            { text: "Saat multiplier terlalu kecil", why: "Salah: m kecil justru lebih tahan gap (eksposur kecil) — harganya upside terbatas." },
            { text: "Tidak pernah — CPPI selalu menjaga floor", why: "Salah: inilah mitos yang dibantah lesson ini — “jaminan” CPPI bersyarat kemulusan pasar." },
          ],
        },
        {
          q: "Investor berkata “saya tidak mau kembali rugi setelah cuan”. Varian yang cocok?",
          options: [
            { text: "CPPI biasa dengan floor tetap", why: "Salah: floor tetap tidak mengunci keuntungan yang sudah diraih." },
            { text: "TIPP — floor diratchet naik mengikuti V", why: "Tepat: F_t = max(F_{t−1}, k×V_t) mengunci cuan; harganya upside lebih terbatas.", correct: true },
            { text: "Multiplier diperbesar", why: "Salah: m besar menambah risiko gap, bukan mengunci cuan." },
            { text: "Stop-loss dihilangkan", why: "Salah: menghilangkan proteksi justru menjauh dari keinginan investor." },
          ],
        },
        {
          q: "Prospektus produk “proteksi modal” berbasis CPPI yang JUJUR menulis:",
          options: [
            { text: "“Dijamin tidak di bawah Rp900jt dalam kondisi apa pun”", why: "Salah: janji tanpa syarat = kebohongan — gap risk selalu ada pada proteksi dinamis." },
            { text: "“Target proteksi Rp900jt untuk pergerakan normal; tidak berlaku saat lompatan harga”", why: "Tepat: membedakan TARGET dari JAMINAN; jujur soal siapa menanggung gap.", correct: true },
            { text: "Tidak menyebut risiko sama sekali agar laku", why: "Salah: itu menyesatkan — dan menjadi bom reputasi saat gap terjadi." },
            { text: "“Risiko nol karena memakai rumus”", why: "Salah: rumus ≠ kepastian; 1987 adalah buktinya." },
          ],
        },
      ],
    },
  ],
};
