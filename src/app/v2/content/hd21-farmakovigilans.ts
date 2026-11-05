import type { V2Lesson } from "../lib/types";

// ── Figure: PRR per pasangan obat–efek, garis ambang Evans PRR=2 ──────────
const PRR_SVG = `<svg viewBox="0 0 520 240" role="img" aria-label="Diagram batang PRR tiga pasangan obat-efek dengan garis ambang 2">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="48" y1="196" x2="500" y2="196"/>
<line x1="48" y1="156" x2="500" y2="156"/><line x1="48" y1="116" x2="500" y2="116"/>
<line x1="48" y1="76" x2="500" y2="76"/><line x1="48" y1="36" x2="500" y2="36"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="42" y="199">0</text><text x="42" y="159">5</text><text x="42" y="119">10</text>
<text x="42" y="79">15</text><text x="42" y="39">20</text>
</g>
<g>
<rect x="110" y="76" width="64" height="120" fill="var(--c1)" opacity="0.9"/>
<text x="142" y="68" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">15,0</text>
<text x="142" y="214" text-anchor="middle" font-size="11" fill="var(--text)">Obat A + rabdomiolisis</text>
<rect x="238" y="186" width="64" height="10" fill="var(--chart-text)" opacity="0.55"/>
<text x="270" y="178" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">1,3</text>
<text x="270" y="214" text-anchor="middle" font-size="11" fill="var(--text)">Obat B + mual</text>
<rect x="366" y="164" width="64" height="32" fill="var(--c1)" opacity="0.9"/>
<text x="398" y="156" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">3,2</text>
<text x="398" y="214" text-anchor="middle" font-size="11" fill="var(--text)">Obat C + gagal hati</text>
</g>
<line x1="48" y1="180" x2="500" y2="180" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="496" y="172" text-anchor="end" font-size="11" fill="var(--c2)" font-family="var(--font-ui)">ambang Evans: PRR = 2</text>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="48" y="24">PRR</text><text x="470" y="228">pasangan obat–efek (data sintetis)</text>
</g>
</svg>`;

export const hd21: V2Lesson = {
  slug: "hd21-farmakovigilans",
  track: "Health Data Science",
  module: "Farmakovigilans & Keamanan Obat",
  title: "Pharmacovigilance & Signal Detection: Menangkap Sinyal Bahaya Obat Sebelum Terlambat",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Obat yang lolos uji klinis, tapi gagal di dunia nyata",
      prose: [
        "Tahun 1957, thalidomide dipasarkan di puluhan negara sebagai obat mual untuk ibu hamil — “aman”, kata brosurnya, karena uji klinis pada ribuan orang dewasa tidak menemukan masalah serius. Empat tahun kemudian, dokter di Jerman dan Australia mulai melaporkan pola yang janggal: bayi lahir dengan anggota tubuh sangat pendek. Sekitar 10.000 anak terdampak sebelum obat itu ditarik dari pasar. Twist-nya: tidak ada satu pun uji klinis yang salah — mereka semua benar dalam populasi yang mereka uji. Yang salah adalah asumsinya: bahwa keamanan pada 3.000 orang dewasa menjamin keamanan pada 10 juta ibu hamil.",
        "Tragedi itu melahirkan farmakovigilans modern: WHO mendirikan Programme for International Drug Monitoring (1968) dan sistem pelaporan spontan global. Pelajaran intinya bertahan sampai hari ini: uji klinis menjawab “apakah obat ini bekerja pada populasi terpilih?”; farmakovigilans menjawab “apakah obat ini tetap aman saat dipakai jutaan orang yang berbeda-beda, bertahun-tahun, dengan penyakit penyerta dan obat lain?” Pertanyaan kedua tidak bisa dijawab sebelum obat beredar — hanya oleh data dunia nyata yang dikumpulkan dengan disiplin.",
        "Indonesia sedang membangun jawabannya. Peraturan BPOM No. 15 Tahun 2022 mewajibkan penerapan farmakovigilans — dari pelaporan spontan hingga Risk Management Plan — dan pada Maret 2024 WHO bersama BPOM mengumumkan penguatan sistem ini: 162 evaluator farmakovigilans dilatih analisis laporan dan deteksi sinyal, 170 petugas dan pelaku industri dilatih penyusunan Risk Management Plan. Tantangannya jujur diakui: pejabat BPOM menyebut Indonesia “minim data efek obat” — tidak ada angka pasti berapa banyak efek samping yang sebenarnya terjadi. Di lesson ini kamu belajar mesin statistik yang mengubah tumpukan laporan mentah menjadi sinyal yang bisa ditindaklanjuti: analisis disproporsionalitas — PRR, ROR, dan kriteria Evans.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini pekerjaan data, bukan cuma pekerjaan dokter",
        type: "risk",
        body: "Dokter melihat satu pasien; analis farmakovigilans melihat 100.000 laporan sekaligus dan bertanya “pola apa yang tidak terlihat dari satu kasus?”. Sinyal yang terlewat berarti obat berbahaya tetap beredar berbulan-bulan; sinyal palsu yang ditindaklanjuti berarti obat yang menyelamatkan nyawa ditarik sia-sia. Keduanya adalah kegagalan analitik.",
      },
      reference: "Uji klinis = keamanan pada populasi terpilih. Farmakovigilans = keamanan pada populasi sesungguhnya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan alur pelaporan spontan Indonesia (MESO → Pusat Farmakovigilans/MESO Nasional → analisis sinyal) dan karakteristik laporan yang baik menurut pedoman BPOM; (2) menghitung PRR, ROR, dan chi-square dari tabel 2×2 laporan spontan, lengkap dengan interpretasi tiap simbol; (3) menerapkan kriteria sinyal Evans (a ≥ 3, PRR ≥ 2, χ² ≥ 4) dan menjelaskan kenapa tiap syarat ada; (4) membedakan sinyal statistik dari bukti kausal, termasuk jebakan confounding by indication dan bias pelaporan.",
        "Rutenya: cerita → dua bekal ringkas → tiga konsep inti (pelaporan spontan, PRR, ROR) → lab Pyodide (mesin deteksi sinyal) → chart PRR dengan panduan baca → peta keputusan tindak lanjut → mini-case RS → kuis → rangkuman. Estimasi 60 menit; lab-nya ±15 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, lanskap data kesehatan: sistem kesehatan menghasilkan banyak sumber data sekunder — rekam medis elektronik, data klaim asuransi, surveilans penyakit — dan database laporan efek samping obat adalah salah satunya. Setiap sumber punya bias pengumpulan sendiri; analis yang baik selalu bertanya “data ini dikumpulkan untuk apa, oleh siapa, dan apa yang tidak tercatat?”. Kedua, epidemiologi dasar: dari tabel 2×2 (terpapar/tidak × sakit/tidak) kita bisa menghitung risk ratio dan odds ratio sebagai ukuran asosiasi. PRR dan ROR yang kamu pelajari di sini adalah sepupu dekat kedua ukuran itu — bedanya, yang dibandingkan bukan risiko sakit, melainkan proporsi pelaporan dalam database laporan spontan.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: PRR/ROR tidak mengukur “seberapa berbahaya obatnya” — mereka mengukur “seberapa tidak proporsional pola pelaporannya dibanding latar belakang database”. Ketidakproporsionalan adalah undangan untuk menyelidiki, bukan vonis.",
      ],
      reference: "Bekal: (1) tiap sumber data kesehatan punya bias pengumpulan; (2) tabel 2×2 → ukuran asosiasi; PRR/ROR = versi untuk data laporan spontan.",
    },
    {
      id: "konsep-pelaporan",
      eyebrow: "Langkah 3 · Konsep",
      title: "Pelaporan spontan — radar yang buta separuh",
      prose: [
        "Definisi: pelaporan spontan (spontaneous reporting) adalah sistem pengumpulan laporan kejadian tidak diinginkan yang dicurigai terkait obat, yang dilaporkan secara sukarela oleh tenaga kesehatan, industri farmasi, atau masyarakat — tanpa desain studi, tanpa kelompok pembanding yang direncanakan. Di Indonesia, alurnya diatur Peraturan BPOM No. 15 Tahun 2022: laporan efek samping obat (ESO) dikirim ke Pusat Farmakovigilans/MESO Nasional — untuk kejadian serius paling lambat 15 hari kalender — melalui formulir MESO atau elektronik via e-MESO. Pedoman MESO BPOM merinci karakteristik laporan yang baik: deskripsi efek samping termasuk time to onset (kapan gejala mulai setelah obat dipakai), detail produk (dosis, tanggal, frekuensi, lama pemberian, nomor lot), obat lain yang dipakai bersamaan, data laboratorium bila ada, dan informasi pelapor untuk tindak lanjut.",
        "Kepribadiannya: pelaporan spontan itu seperti radar cuaca yang hanya menyala kalau ada yang menelepon melapor “di sini hujan”. Ia murah, mencakup seluruh populasi, dan bisa menangkap kejadian langka yang tidak akan pernah muncul di uji klinis 3.000 orang — tetapi ia buta terhadap semua yang tidak dilaporkan. Tidak ada penyebut (denominator): kita tahu ada 45 laporan ruam untuk Obat X, tetapi tidak tahu dari berapa juta pengguna. Dan radar ini bias: obat baru lebih rajin dilaporkan daripada obat lama (Weber effect), kejadian yang sedang ramai dibicarakan media melonjak laporannya (notoriety bias), dan kejadian serius jauh lebih mungkin dilaporkan daripada yang ringan.",
        "Kapan memakai: pelaporan spontan adalah alat deteksi dini — murah dan luas — bukan alat pembuktian. Ia menjawab “adakah pola yang patut diselidiki?”, lalu investigasi lanjutan (kajian kausalitas kasus per kasus, studi farmakoepidemiologi) yang menjawab “apakah obat ini benar-benar penyebabnya?”.",
      ],
      formula: String.raw`\text{fraksi terdeteksi} = \frac{\text{kasus yang dilaporkan}}{\text{kasus yang sebenarnya terjadi}} \ll 1`,
      formulaNote: "Tidak ada simbol misterius di sini — justru itu masalahnya. Pembilang (kasus yang dilaporkan) kita ketahui dari database; penyebut (kasus yang sebenarnya terjadi) hampir tidak pernah kita ketahui. Literatur global konsisten: sistem pelaporan spontan hanya menangkap sebagian kecil dari kejadian sebenarnya. Untuk Indonesia, pejabat BPOM sendiri menyatakan tidak ada angka pasti — data efek obat nasional masih minim. Akibatnya: JANGAN pernah menafsirkan “sedikit laporan” sebagai “obatnya aman”.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Hanya 3 laporan tahun ini — berarti obatnya aman”",
        type: "pitfall",
        body: "Yang benar: 3 laporan adalah 3 laporan, bukan 3 kejadian. Tanpa penyebut dan dengan underreporting yang besar, angka laporan mentah tidak bisa dibandingkan antar obat, antar RS, atau antar tahun. Analis yang membandingkan “RS A lapor 50, RS B lapor 5” lalu menyimpulkan RS B lebih aman sedang membaca budaya pelaporan, bukan keamanan obat.",
      },
      hints: [
        "💡 Intuisi analis: saat membaca database laporan spontan, selalu tanya tiga hal — siapa yang rajin melapor (bias pelapor), apa yang sedang ramai (bias publisitas), dan obat mana yang baru (Weber effect) — SEBELUM menghitung statistik apa pun.",
      ],
      reference: "Laporan spontan = radar deteksi dini: murah, luas, buta penyebut, bias. Sinyal → investigasi, bukan vonis.",
    },
    {
      id: "konsep-prr",
      eyebrow: "Langkah 4 · Konsep",
      title: "PRR — Si Pembanding Proporsi",
      prose: [
        "Definisi: Proportional Reporting Ratio (PRR) membandingkan proporsi laporan suatu efek samping pada obat tertentu terhadap proporsi laporan efek yang sama pada semua obat lain di database. Idenya sederhana: kalau 4,5% laporan Obat X menyebut ruam, sementara hanya 0,3% laporan obat-obat lain yang menyebut ruam, maka ruam “tidak proporsional” untuk Obat X — ada yang patut diselidiki. Tabel 2×2-nya: a = laporan (obat X, efek Y); b = laporan (obat X, efek selain Y); c = laporan (obat selain X, efek Y); d = laporan (obat selain X, efek selain Y).",
        "Kepribadiannya: PRR adalah tetangga yang suka membandingkan — “anakmu demam 4,5% dari waktunya, anak-anak lain cuma 0,3%”. Ia tidak tahu kenapa (mungkin memang obatnya, mungkin pasien Obat X memang lebih sering sakit kulit), tapi ia tahu kapan sesuatu terlihat aneh. Kekuatannya: hanya butuh hitungan laporan, bisa dihitung untuk ribuan pasangan obat–efek dalam sekejap. Kelemahannya: ia buta terhadap jumlah pengguna obat (tanpa penyebut insidens) dan terhadap siapa yang memakai obat itu.",
        "Kapan memakai: PRR adalah skrining massal tahap pertama di banyak otoritas regulasi. Kriteria sinyal Evans (2001) yang dipakai luas: sebuah pasangan obat–efek dinyatakan sinyal hanya jika KETIGA syarat terpenuhi — (1) a ≥ 3 (menjaga dari hitungan mungil: PRR 10 dari 2 laporan tidak ada artinya), (2) PRR ≥ 2 (asosiasi minimal dua kali lipat), (3) χ² ≥ 4 (pola tidak mungkin dijelaskan kebetulan saja). Tiga syarat, tidak bisa ditawar satu pun.",
      ],
      formula: String.raw`\text{PRR} = \frac{a/(a+b)}{c/(c+d)}`,
      formulaNote: "a = laporan obat X + efek Y (yang kita selidiki); b = laporan obat X + efek lain; c = laporan obat selain X + efek Y; d = laporan obat selain X + efek lain. Pembilang a/(a+b) = proporsi efek Y di antara semua laporan obat X. Penyebut c/(c+d) = proporsi efek Y di antara semua laporan obat lain (latar belakang). Contoh angka: a=45, b=955, c=30, d=9970 → PRR = (45/1000)/(30/10000) = 0,045/0,003 = 15. Interpretasi: ruam dilaporkan 15 kali lebih sering secara proporsional pada Obat X dibanding latar belakang database. Itu sinyal yang berteriak — TAPI masih harus lolos dua syarat Evans lainnya.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “PRR 15 berarti 15 kali lebih berbahaya”",
        type: "pitfall",
        body: "Yang benar: PRR 15 berarti 15 kali lebih sering DILAPORKAN secara proporsional — bukan 15 kali lebih berisiko. Risiko butuh penyebut (jumlah pengguna), yang tidak dimiliki database laporan spontan. PRR juga bisa tinggi karena confounding by indication: obat diabetes tentu “berhubungan” dengan hiperglikemia di laporan — karena itulah indikasinya, bukan efek sampingnya.",
      },
      hints: [
        "💡 Intuisi: baca PRR sebagai skor kecurigaan, bukan skor bahaya. PRR menjawab “apakah pola ini aneh?” — pertanyaan “apakah obat ini menyebabkan efek ini?” dijawab oleh investigasi klinis setelahnya.",
      ],
      reference: "Evans: a ≥ 3 DAN PRR ≥ 2 DAN χ² ≥ 4. Satu syarat gugur = bukan sinyal.",
    },
    {
      id: "konsep-ror",
      eyebrow: "Langkah 5 · Konsep",
      title: "ROR — Si Pemain Odds dengan Interval Kepercayaan",
      prose: [
        "Definisi: Reporting Odds Ratio (ROR) adalah versi odds dari PRR — ia membandingkan odds pelaporan efek Y pada obat X terhadap odds pelaporan efek Y pada obat lain: ROR = (a×d)/(b×c). Dipakai dalam sistem EVDAS milik EMA (otoritas obat Eropa). Hubungannya dengan PRR: ketika efeknya langka, keduanya hampir sama; ketika efeknya umum, ROR ≥ PRR. Keunggulan praktis ROR: ia punya interval kepercayaan 95% yang mudah dihitung, sehingga kita bisa menilai presisi estimasi — bukan cuma titiknya.",
        "Kepribadiannya: jika PRR adalah tetangga yang membandingkan proporsi, ROR adalah akuntan yang selalu membawa margin of error. ROR 15 dengan CI 95% (9,8–25,0) berkata “efeknya besar DAN saya cukup yakin ia bukan nol”. ROR 15 dengan CI (0,8–280) berkata “titiknya besar tapi datanya terlalu tipis untuk dipercaya” — dan analis yang baik mendengar bagian keduanya. Aturan sinyal untuk ROR: batas bawah CI 95% > 1.",
        "Kapan memakai: ROR + CI adalah pilihan ketika kamu ingin satu angka yang sekaligus membawa ketidakpastiannya — misalnya untuk ranking sinyal atau laporan regulator. Chi-square (χ² = N(ad−bc)²/((a+b)(c+d)(a+c)(b+d))) tetap dipakai sebagai penjaga syarat Evans ketiga: χ² ≥ 4 berarti pola ini punya peluang di bawah ~5% terjadi karena kebetulan semata.",
      ],
      formula: String.raw`\text{ROR} = \frac{a \times d}{b \times c} \qquad 95\%\,\text{CI} = \exp\!\left(\ln(\text{ROR}) \pm 1{,}96\sqrt{\tfrac{1}{a}+\tfrac{1}{b}+\tfrac{1}{c}+\tfrac{1}{d}}\right)`,
      formulaNote: "a, b, c, d sama seperti pada PRR. ln = logaritma natural; 1,96 = nilai-z untuk 95%. Contoh lanjutan (a=45, b=955, c=30, d=9970): ROR = (45×9970)/(955×30) ≈ 15,7; SE = √(1/45+1/955+1/30+1/9970) ≈ 0,238; CI 95% = exp(2,751 ± 0,467) = (9,8; 25,0). Interpretasi: odds pelaporan ruam ~15,7 kali lebih tinggi pada Obat X, dan seluruh rentang kepercayaan jauh di atas 1 — sinyal kuat dan presisi. Bandingkan dengan syarat Evans: a=45 ≥ 3 ✓, PRR=15 ≥ 2 ✓, χ²≈237 ≥ 4 ✓ → SINYAL.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Sinyal terdeteksi — obatnya terbukti menyebabkan efek samping”",
        type: "pitfall",
        body: "Yang benar: sinyal statistik adalah hipotesis, bukan kesimpulan kausal. Daftar periksa sebelum menaikkan status: (1) confounding by indication — apakah efeknya justru gejala penyakit yang diobati? (2) bias pelaporan — apakah obatnya baru (Weber) atau sedang ramai di media? (3) kualitas laporan — apakah time to onset masuk akal, apakah ada dechallenge (efek hilang saat obat dihentikan)? Sinyal yang lolos saringan inilah yang diteruskan ke evaluasi kausalitas formal.",
      },
      hints: [
        "💡 Intuisi: urutan kerja farmakovigilans adalah corong — ribuan pasangan obat–efek masuk, disaring PRR/ROR/Evans menjadi puluhan sinyal, disaring klinis menjadi segelintir hipotesis, lalu dibuktikan (atau dibatalkan) oleh studi lanjutan. Jangan melompati corong.",
      ],
      reference: "ROR + CI 95%: sinyal bila batas bawah > 1. Sinyal = hipotesis prioritas, bukan vonis kausal.",
    },
    {
      id: "lab-sinyal",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Bangun mesin deteksi sinyal",
      prose: [
        "Waktunya jadi analisnya. Di bawah ada tiga pasangan obat–efek dari sebuah database laporan spontan (data sintetis untuk latihan — polanya meniru database nyata). Tugasmu: tulis empat fungsi — `prr`, `ror`, `chi2`, dan `is_signal` yang menerapkan ketiga kriteria Evans sekaligus — lalu jalankan untuk ketiga pasangan dan tentukan mana yang menjadi sinyal.",
        "Coba: setelah lolos, ubah pasangan Obat B + mual menjadi a=40, b=160, c=300, d=19700 (obat B dipakai jauh lebih sedikit). Apa yang terjadi pada PRR-nya? Itulah kenapa penyebut laporan (b) penting — dan kenapa PRR tanpa konteks bisa menipu.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `prr(a,b,c,d)` = (a/(a+b)) / (c/(c+d))" },
        { id: "t2", text: "Lengkapi `ror(a,b,c,d)` = (a*d) / (b*c)" },
        { id: "t3", text: "Lengkapi `chi2(a,b,c,d)` = N*(a*d-b*c)**2 / ((a+b)*(c+d)*(a+c)*(b+d)), dengan N=a+b+c+d" },
        { id: "t4", text: "Lengkapi `is_signal(a,b,c,d)`: True bila a>=3 DAN prr>=2 DAN chi2>=4" },
        { id: "t5", text: "Jalankan dan pastikan tiga baris ringkasan tercetak" },
      ],
      expected: "A+rabdomiolisis: PRR=15.00 ROR=15.89 chi2=633.0 sinyal=True\nB+mual: PRR=1.33 ROR=1.34 chi2=3.0 sinyal=False\nC+gagal_hati: PRR=3.20 ROR=3.22 chi2=10.5 sinyal=True",
      code: {
        starter: `# Database laporan spontan (SINTETIS untuk latihan — bukan data BPOM/FAERS asli)
pairs = [
    {"nama": "A+rabdomiolisis", "a": 120, "b": 1880, "c": 80,  "d": 19920},
    {"nama": "B+mual",          "a": 40,  "b": 1960, "c": 300, "d": 19700},
    {"nama": "C+gagal_hati",    "a": 8,   "b": 992,  "c": 50,  "d": 19950},
]

# TULIS KODEMU: empat fungsi di bawah ini
def prr(a, b, c, d):
    return

def ror(a, b, c, d):
    return

def chi2(a, b, c, d):
    return

def is_signal(a, b, c, d):
    return

for p in pairs:
    a, b, c, d = p["a"], p["b"], p["c"], p["d"]
    print(f'{p["nama"]}: PRR={prr(a,b,c,d):.2f} ROR={ror(a,b,c,d):.2f} chi2={chi2(a,b,c,d):.1f} sinyal={is_signal(a,b,c,d)}')`,
        lockLines: 6,
        solution: `# Database laporan spontan (SINTETIS untuk latihan — bukan data BPOM/FAERS asli)
pairs = [
    {"nama": "A+rabdomiolisis", "a": 120, "b": 1880, "c": 80,  "d": 19920},
    {"nama": "B+mual",          "a": 40,  "b": 1960, "c": 300, "d": 19700},
    {"nama": "C+gagal_hati",    "a": 8,   "b": 992,  "c": 50,  "d": 19950},
]

# TULIS KODEMU: empat fungsi di bawah ini
def prr(a, b, c, d):
    return (a / (a + b)) / (c / (c + d))

def ror(a, b, c, d):
    return (a * d) / (b * c)

def chi2(a, b, c, d):
    n = a + b + c + d
    return n * (a * d - b * c) ** 2 / ((a + b) * (c + d) * (a + c) * (b + d))

def is_signal(a, b, c, d):
    return a >= 3 and prr(a, b, c, d) >= 2 and chi2(a, b, c, d) >= 4

for p in pairs:
    a, b, c, d = p["a"], p["b"], p["c"], p["d"]
    print(f'{p["nama"]}: PRR={prr(a,b,c,d):.2f} ROR={ror(a,b,c,d):.2f} chi2={chi2(a,b,c,d):.1f} sinyal={is_signal(a,b,c,d)}')`,
        checks: [
          { kind: "equal", task: "t1", name: "prr", value: 15.0, tol: 0.01, label: "`prr` pasangan A harus 15,00", msg: "(120/2000)/(80/20000) = 0,06/0,004 = 15." },
          { kind: "equal", task: "t2", name: "ror", value: 15.89, tol: 0.01, label: "`ror` pasangan A harus ±15,89", msg: "(120×19920)/(1880×80) ≈ 15,89." },
          { kind: "equal", task: "t3", name: "chi2", value: 633.0, tol: 1.0, label: "`chi2` pasangan A harus ±633,0", msg: "N(ad−bc)²/((a+b)(c+d)(a+c)(b+d)) dengan N=22000." },
          { kind: "equal", task: "t4", name: "is_signal", value: true, tol: 0, label: "`is_signal` pasangan A harus True", msg: "a=120≥3, PRR=15≥2, chi²≈633≥4 — ketiga syarat Evans terpenuhi." },
          { kind: "stdout_matches", task: "t5", pattern: "B\\+mual: PRR=1\\.33.*sinyal=False", label: "Pasangan B bukan sinyal", msg: "PRR 1,33 < 2 — gagal syarat Evans kedua." },
          { kind: "stdout_matches", task: "t5", pattern: "C\\+gagal_hati: PRR=3\\.20.*sinyal=True", label: "Pasangan C adalah sinyal", msg: "a=8≥3, PRR=3,2≥2, chi²≈11≥4 — sinyal walau hitungannya kecil." },
        ],
      },
      reference: "Evans: a ≥ 3, PRR ≥ 2, χ² ≥ 4 — ketiganya, tanpa kecuali.",
    },
    {
      id: "chart-prr",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca bar PRR seperti analis regulator",
      prose: [
        "Chart di bawah memplot hasil lab-mu: PRR tiga pasangan obat–efek, dengan garis putus-putus sebagai ambang Evans PRR = 2.",
        "Cara membaca: sumbu Y = nilai PRR (berapa kali lipat proporsi pelaporan dibanding latar belakang database); tinggi tiap batang = PRR pasangan tersebut; garis putus-putus = ambang sinyal Evans. Batang di atas garis = kandidat sinyal (masih harus lolos a ≥ 3 dan χ² ≥ 4 — chart ini hanya menunjukkan satu dari tiga syarat).",
        "Interpretasi: Obat A + rabdomiolisis (PRR 15) menjulang jauh di atas ambang — pola pelaporannya sangat tidak proporsional, prioritas investigasi tertinggi. Obat C + gagal hati (PRR 3,2) melewati ambang dengan margin tipis — sinyal yang sah menurut Evans, tetapi analis yang bijak mengecek dulu kualitas 8 laporannya (apakah time to onset masuk akal? adakah dechallenge?). Obat B + mual (PRR 1,3) berada di bawah ambang — bukan sinyal; mual memang efek yang umum dilaporkan untuk banyak obat, sehingga proporsinya tidak aneh. Pelajaran chart ini: ambang mengubah angka kontinu menjadi keputusan biner — dan keputusan biner selalu butuh konteks klinis.",
      ],
      figure: {
        svg: PRR_SVG,
        alt: "Diagram batang: PRR 15,0 untuk Obat A + rabdomiolisis; 1,3 untuk Obat B + mual; 3,2 untuk Obat C + gagal hati. Garis ambang di PRR = 2.",
        caption: "PRR tiga pasangan obat–efek (data sintetis). Garis putus-putus = ambang sinyal Evans (PRR ≥ 2).",
      },
      tasks: [],
      reference: "Chart PRR tanpa a dan χ² = setengah cerita. Selalu tampilkan ketiganya.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Sinyal terdeteksi — lalu apa?",
      prose: [
        "Deteksi hanyalah pintu masuk. Lima skenario tindak lanjut yang dihadapi analis farmakovigilans setiap minggu:",
        "Skenario 1 — Sinyal kuat, obat baru, efek serius (seperti Obat A + rabdomiolisis, PRR 15, χ² besar). → Prioritas tertinggi: verifikasi kualitas laporan (apakah benar rabdomiolisis terkonfirmasi lab, bukan sekadar nyeri otot?), kaji kausalitas per kasus (time to onset, dechallenge/rechallenge), lalu eskalasi ke tim evaluasi untuk pembaruan Risk Management Plan dan komunikasi risiko. Alasan: kombinasi efek serius + sinyal kuat = potensi bahaya terbesar.",
        "Skenario 2 — PRR di bawah ambang (Obat B + mual, PRR 1,3). → Bukan sinyal; tetap dalam pemantauan rutin. Alasan: mual adalah efek latar yang umum; memaksa investigasi untuk setiap PRR kecil menghabiskan sumber daya dan menghasilkan alarm fatigue.",
        "Skenario 3 — PRR tinggi tetapi a kecil (mis. a=2, PRR=12). → Bukan sinyal menurut Evans; kumpulkan laporan, jangan investigasi penuh dulu. Alasan: syarat a ≥ 3 melindungi dari fluktuasi hitungan mungil — dua laporan bisa jadi kebetulan dua dokter yang sama-sama rajin melapor.",
        "Skenario 4 — Sinyal pada obat yang baru 6 bulan beredar. → Curigai Weber effect: obat baru memang lebih rajin dilaporkan. Bandingkan dengan obat sekelas yang sudah lama beredar sebelum menyimpulkan. Alasan: bias pelaporan meniru sinyal.",
        "Skenario 5 — Sinyal “obat diabetes + hiperglikemia”. → Hentikan sebelum mulai: cek indikasi dulu. Alasan: confounding by indication — efek yang dilaporkan adalah gejala penyakit yang diobati, bukan efek obat. Ini jebakan paling memalukan karena jawabannya ada di baris pertama formulir (kolom “indikasi”).",
        "Aturan praktis 10 detik: a ≥ 3? PRR ≥ 2? χ² ≥ 4? → lalu tanya berurutan: masuk akal secara klinis? → confounding by indication? → bias pelaporan (obat baru/ramai media)? → kualitas laporan cukup untuk dinilai? Baru tentukan tindak lanjut.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menaikkan status sinyal langsung ke “peringatan publik” tanpa saringan klinis. Rantai yang benar: sinyal statistik → validasi laporan → evaluasi kausalitas → keputusan regulasi (update informasi produk, pembatasan, atau penarikan). Melompati rantai menghancurkan kredibilitas sistem: sekali publik panik karena sinyal palsu, sinyal berikutnya yang asli tidak dipercaya.",
      },
      reference: "Sinyal → validasi → kausalitas → keputusan regulasi. Jangan melompati rantai.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Tiga laporan dari RSUD Harapan",
      prose: [
        "Skenario (sintetis, untuk latihan — angka dan RS-nya fiktif): RSUD Harapan melaporkan 3 kejadian gagal hati serius yang dicurigai terkait Obat C (obat baru untuk tuberkulosis) dalam 8 bulan pertama pemakaiannya. Tim farmasi menemukan: ketiga pasien memakai dosis sesuai label, time to onset 2–6 minggu setelah mulai obat, dan pada 2 pasien fungsi hati membaik setelah obat dihentikan (dechallenge positif). Dari database nasional (ilustrasi), pasangan Obat C + gagal hati mencatat a=8, b=992, c=50, d=19950 — persis angka di lab-mu: PRR 3,2, χ² ≈ 11, lolos Evans.",
        "Pertanyaan analisis: (1) Apakah ini sinyal menurut Evans? (2) Seberapa kuat bukti kausalnya dari tiga laporan RS saja — dan apa yang masih kurang? (3) Tindakan apa yang proporsional untuk tim farmasi RS minggu ini vs untuk BPOM bulan ini?",
        "Pembahasan: (1) Ya — a=8 ≥ 3, PRR=3,2 ≥ 2, χ²≈11 ≥ 4: sinyal sah. (2) Bukti kausal awal cukup menjanjikan: time to onset konsisten (2–6 minggu, masuk akal untuk hepatotoksisitas idiosinkratik), dechallenge positif pada 2 dari 3 pasien — tetapi belum ada rechallenge (tidak etis dicoba), belum disingkirkan penyebab lain (hepatitis virus, alkohol, obat lain), dan 8 laporan nasional terlalu sedikit untuk estimasi risiko. Statusnya: hipotesis prioritas, bukan kesimpulan. (3) Minggu ini di RS: pastikan ketiga laporan terkirim lengkap ke Pusat Farmakovigilans/MESO Nasional (KTD serius ≤ 15 hari kalender menurut Peraturan BPOM 15/2022), briefing kewaspadaan ke dokter paru, pantau fungsi hati pasien pemakai Obat C. Bulan ini di BPOM: validasi 8 laporan nasional, kaji kausalitas formal, pertimbangkan pembaruan informasi keamanan produk — belum penarikan, karena bukti belum cukup dan obat TB menyelamatkan nyawa.",
        "Catatan underreporting: 8 laporan nasional hampir pasti jauh di bawah kejadian sebenarnya — sistem pelaporan spontan di mana pun hanya menangkap sebagian kecil kasus, dan untuk Indonesia sendiri belum ada angka pasti (diakui BPOM). Maka “sedikit laporan” tidak boleh dibaca sebagai “risikonya kecil” — ia dibaca sebagai “kita belum tahu seberapa besar”.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan paling berbahaya di sini bukan salah hitung PRR — melainkan salah membaca “sedikit laporan” sebagai “aman”. Analis yang menulis “hanya 8 laporan, risiko minimal” dalam memo berisiko menunda penarikan obat yang sebenarnya bermasalah. Tulis yang jujur: “8 laporan terkonfirmasi; beban sebenarnya tidak diketahui karena underreporting; rekomendasi: pantau aktif.”",
      },
      reference: "Proporsionalitas: tindakan RS (lapor + waspada) vs tindakan regulator (validasi + kaji + putuskan).",
    },
    {
      id: "bayes-sinyal",
      eyebrow: "Langkah 10 · Lanjutan",
      title: "Di atas PRR: IC Bayesian, masking, dan triage",
      prose: [
        "PRR/ROR adalah frequentist — ia bertanya “seberapa tidak proporsional angka ini?” tanpa memakai pengetahuan sebelumnya. Pendekatan Bayesian (BCPNN — Bayesian Confidence Propagation Neural Network, dipakai WHO Uppsala Monitoring Centre) bertanya lebih cermat: “setelah menggabungkan data dengan prior, seberapa yakin kita?” Statistiknya bernama Information Component: IC = log2(observasi / ekspektasi) — logaritma rasio kemunculan kombinasi obat–efek terhadap yang diharapkan bila keduanya independen. IC > 0 berarti kombinasi muncul lebih sering dari kebetulan; kredibilitasnya dibaca dari batas bawah interval kredibel 95% (IC025 > 0 = sinyal). Keunggulannya: pada data tipis, prior menyusutkan IC ke nol — tidak ada lagi “PRR 12 dari 2 laporan”.",
        "Dua jebakan yang tidak ditangkap PRR/ROR. Pertama, masking: obat yang sangat sering dilaporkan (mis. vaksin saat pandemi) menggelembungkan penyebut database sehingga sinyal obat LAIN tenggelam — seperti mencoba mendengar bisikan di konser rock. Solusinya: stratifikasi atau keluarkan obat dominan dari latar belakang. Kedua, duplikat: satu kejadian yang dilaporkan RS, dokter, DAN pasien tercatat tiga kali — sel a membengkak 3× lipat. Database besar memakai algoritma deduplikasi (mis. vigiMatch) sebelum analisis; analis yang menghitung dari data mentah menghitung gema, bukan kejadian.",
        "Di atas semua metrik ada disiplin triage: tidak semua sinyal layak investigasi penuh. Skor prioritas praktis menggabungkan lima hal: kekuatan statistik (IC025/PRR), keseriusan efek (kematian/cacat vs mual ringan), kebaruan obat (Weber effect), kualitas laporan (dechallenge, time to onset masuk akal), dan novelty (sudah ada di label?). Sinyal “obat baru + efek serius + IC025 tinggi + dechallenge positif + belum di label” naik ke puncak antrean; “obat lama + efek ringan + laporan tipis” menunggu giliran. Farmakovigilans modern bukan tentang menemukan SEMUA sinyal — melainkan tentang mengurutkan dengan benar mana yang diselidiki duluan dengan sumber daya yang terbatas.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: jadilah skeptis yang terorganisir",
        body: "Analis farmakovigilans senior memproses setiap sinyal dengan lima interogasi berurutan — dan urutannya penting. Pertama: apakah datanya cukup? (a ≥ 3 — di bawah itu kamu membaca noise.) Kedua: apakah polanya aneh? (PRR ≥ 2 dan χ² ≥ 4, atau IC025 > 0 — ketidakproporsionalan yang tidak bisa dijelaskan kebetulan.) Ketiga: apakah masuk akal secara klinis? (time to onset konsisten dengan farmakologi obatnya? ada dechallenge?) Keempat: apakah ada penjelasan yang membosankan? (confounding by indication — cek kolom indikasi; Weber — obatnya baru?; notoriety — sedang ramai di media?; duplikat — satu kejadian tiga laporan?; masking — ada obat dominan yang menenggelamkan latar?) Kelima: apakah ini sudah diketahui? (cek label produk — sinyal yang sudah di label bukan temuan, melainkan konfirmasi.) Sinyal yang selamat dari kelima interogasi barulah hipotesis prioritas. Dan satu heuristik terakhir: sinyal yang paling berbahaya bukanlah yang PRR-nya tertinggi, melainkan yang efeknya paling serius dengan bukti yang cukup — dahulukan yang bisa membunuh, bukan yang angkanya paling dramatis. Dan yang terakhir: catat setiap keputusan triage beserta alasannya — sinyal yang hari ini kamu turunkan prioritasnya bisa menjadi penarikan obat tahun depan; jejak audit yang rapi membedakan sistem farmakovigilans profesional dari tumpukan spreadsheet.",
      },
      reference: "Bayesian IC: IC025 > 0 = sinyal yang tahan data tipis. Waspadai masking & duplikat. Triage = urutkan berdasar bukti × keseriusan × novelty.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Farmakovigilans = deteksi, penilaian, pemahaman, pencegahan efek merugikan obat — pasca-pasar, dari data dunia nyata.",
        "Pelaporan spontan (MESO → Pusat Farmakovigilans/MESO Nasional, KTD serius ≤15 hari) adalah radar deteksi dini: murah, luas, tanpa penyebut, bias — underreporting besar dan Indonesia belum punya angka pasti.",
        "PRR = [a/(a+b)] / [c/(c+d)]; ROR = (a×d)/(b×c) dengan CI 95%; keduanya mengukur ketidakproporsionalan pelaporan, bukan risiko.",
        "Kriteria sinyal Evans: a ≥ 3 DAN PRR ≥ 2 DAN χ² ≥ 4 — ketiganya wajib terpenuhi.",
        "Sinyal = hipotesis prioritas. Saringan wajib: confounding by indication, bias pelaporan (Weber/notoriety), kualitas laporan — baru eskalasi ke evaluasi kausalitas dan keputusan regulasi.",
        "Di atas PRR/ROR: IC Bayesian (IC025 > 0) tahan data tipis; waspadai masking & duplikat; triage mengurutkan sinyal berdasar bukti × keseriusan × novelty.",
      ],
      quiz: [
        {
          q: "Fungsi utama analisis disproporsionalitas (PRR/ROR) dalam farmakovigilans?",
          options: [
            { text: "Menyaring ribuan pasangan obat–efek menjadi segelintir hipotesis sinyal prioritas untuk diselidiki", why: "Benar: PRR/ROR adalah corong tahap pertama — dari ribuan pasangan menjadi puluhan sinyal yang layak divalidasi dan dikaji kausalitasnya.", correct: true },
            { text: "Membuktikan obat menyebabkan efek samping", why: "Salah: bukti kausal butuh investigasi lanjutan (kajian kasus, studi farmakoepidemiologi). PRR/ROR hanya mengukur ketidakproporsionalan pelaporan." },
            { text: "Menghitung insidens efek samping di populasi", why: "Salah: database laporan spontan tidak punya penyebut (jumlah pengguna obat), jadi insidens tidak bisa dihitung dari sini." },
            { text: "Menggantikan uji klinis fase 4", why: "Salah: keduanya komplementer. Uji klinis menjawab efikasi/keamanan terkontrol; farmakovigilans menangkap yang lolos dari uji klinis." },
          ],
        },
        {
          q: "Pasangan obat–efek: a=2, b=48, c=10, d=9990. PRR = 8,3 dan χ² = 9,1. Menurut kriteria Evans, statusnya?",
          options: [
            { text: "Bukan sinyal — gagal syarat a ≥ 3 walau PRR dan χ² lolos", why: "Benar: Evans mensyaratkan KETIGANYA. a=2 terlalu mungil — dua laporan bisa jadi kebetulan atau dua pelapor yang sama-sama rajin.", correct: true },
            { text: "Sinyal kuat — PRR 8,3 jauh di atas ambang", why: "Salah: satu syarat gugur = bukan sinyal. PRR tinggi dari hitungan mungil adalah pola paling menipu di database spontan." },
            { text: "Sinyal lemah — perlu ditindaklanjuti segera", why: "Salah: bukan sinyal lemah, melainkan belum memenuhi definisi sinyal. Responsnya: kumpulkan laporan, bukan investigasi penuh." },
            { text: "Tidak bisa dinilai tanpa data uji klinis", why: "Salah: kriteria Evans justru dirancang untuk data laporan spontan — dan jawabannya jelas: belum sinyal." },
          ],
        },
        {
          q: "Database menunjukkan sinyal “obat antidiabetes + hiperglikemia” dengan PRR 6. Langkah pertama yang benar?",
          options: [
            { text: "Cek kolom indikasi: hiperglikemia kemungkinan gejala penyakit yang diobati (confounding by indication), bukan efek obat", why: "Benar: ini jebakan klasik. Obat diabetes dipakai oleh penderita diabetes — gulanya tinggi karena penyakitnya. Selalu singkirkan confounding by indication sebelum merayakan sinyal.", correct: true },
            { text: "Langsung terbitkan peringatan keamanan", why: "Salah: melompati saringan klinis. Peringatan untuk sinyal palsu menghancurkan kredibilitas sistem farmakovigilans." },
            { text: "Hitung ulang dengan ROR sebagai gantinya", why: "Salah: mengganti metrik tidak menghilangkan confounding. Masalahnya bukan rumus, melainkan makna klinis pasangannya." },
            { text: "Tarik obat dari pasar sebagai tindakan pencegahan", why: "Salah: penarikan adalah keputusan regulasi tahap akhir berbasis bukti kausal, bukan respons terhadap satu angka PRR." },
          ],
        },
        {
          q: "ROR = 15,7 dengan CI 95% (9,8–25,0) vs ROR = 15,7 dengan CI 95% (0,8–280). Perbedaan makna bagi analis?",
          options: [
            { text: "Yang pertama sinyal kuat dan presisi; yang kedua titiknya sama tetapi terlalu tidak pasti — batas bawahnya melewati 1", why: "Benar: analis membaca interval, bukan titik. CI kedua mencakup 1 (tidak ada efek) — datanya terlalu tipis untuk dipercaya walau titik estimasinya besar.", correct: true },
            { text: "Keduanya sama kuat karena titik estimasinya identik", why: "Salah: mengabaikan ketidakpastian adalah kesalahan paling umum membaca estimasi. Titik tanpa interval = setengah informasi." },
            { text: "Yang kedua lebih kuat karena intervalnya lebih lebar", why: "Salah: interval lebar = ketidakpastian besar = bukti lebih lemah, bukan lebih kuat." },
            { text: "Keduanya bukan sinyal karena ROR bukan kriteria Evans", why: "Salah: kriteria sinyal untuk ROR adalah batas bawah CI 95% > 1 — yang pertama lolos, yang kedua tidak." },
          ],
        },
        {
          q: "RS melaporkan “hanya 5 KTD tahun ini, jadi obat-obat kami aman”. Kesalahan logikanya?",
          options: [
            { text: "Mengira sedikit laporan = sedikit kejadian, padahal underreporting membuat angka laporan bukan cermin kejadian sebenarnya", why: "Benar: tanpa penyebut dan dengan pelaporan yang hanya menangkap sebagian kecil kasus, 5 laporan tidak bisa diterjemahkan menjadi klaim keamanan. Untuk Indonesia, besaran underreporting-nya sendiri belum diketahui pasti.", correct: true },
            { text: "Salah menghitung PRR", why: "Salah: masalahnya bukan perhitungan, melainkan interpretasi angka mentah laporan sebagai ukuran keamanan." },
            { text: "Seharusnya memakai ROR bukan jumlah laporan", why: "Salah: ROR juga butuh database pembanding yang memadai; 5 laporan tetap 5 laporan apa pun metriknya." },
            { text: "Tidak ada kesalahan — 5 memang kecil", why: "Salah: “kecil” relatif terhadap apa? Tanpa pembanding dan tanpa koreksi underreporting, angka mentah tidak bermakna." },
          ],
        },
      ],
    },
  ],
};

