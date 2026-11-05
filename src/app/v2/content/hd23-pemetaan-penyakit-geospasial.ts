import type { V2Lesson } from "../lib/types";

// ── Figure: SMR kasar vs SMR terhaluskan Bayes, 8 area ────────────────────
const SMR_SVG = `<svg viewBox="0 0 600 300" role="img" aria-label="Diagram batang SMR kasar vs SMR terhaluskan delapan area">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="48" y1="240.0" x2="560" y2="240.0"/>
<line x1="48" y1="193.3" x2="560" y2="193.3"/>
<line x1="48" y1="146.7" x2="560" y2="146.7"/>
<line x1="48" y1="100.0" x2="560" y2="100.0"/>
<line x1="48" y1="53.3" x2="560" y2="53.3"/>
</g><g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="42" y="244.0">0</text>
<text x="42" y="197.3">1</text>
<text x="42" y="150.7">2</text>
<text x="42" y="104.0">3</text>
<text x="42" y="57.3">4</text>
</g><g>
<rect x="59.5" y="184.0" width="17.9" height="56.0" fill="var(--c1)" opacity="0.9"/>
<rect x="81.3" y="188.2" width="17.9" height="51.8" fill="var(--c3)" opacity="0.9"/>
<text x="80.0" y="256" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A1</text>
<rect x="123.5" y="240.0" width="17.9" height="0.0" fill="var(--c1)" opacity="0.9"/>
<rect x="145.3" y="208.7" width="17.9" height="31.3" fill="var(--c3)" opacity="0.9"/>
<text x="144.0" y="256" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A2</text>
<rect x="187.5" y="170.0" width="17.9" height="70.0" fill="var(--c1)" opacity="0.9"/>
<rect x="209.3" y="174.7" width="17.9" height="65.3" fill="var(--c3)" opacity="0.9"/>
<text x="208.0" y="256" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A3</text>
<rect x="251.5" y="196.6" width="17.9" height="43.4" fill="var(--c1)" opacity="0.9"/>
<rect x="273.3" y="195.7" width="17.9" height="44.3" fill="var(--c3)" opacity="0.9"/>
<text x="272.0" y="256" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A4</text>
<rect x="315.5" y="224.6" width="17.9" height="15.4" fill="var(--c1)" opacity="0.9"/>
<rect x="337.3" y="212.0" width="17.9" height="28.0" fill="var(--c3)" opacity="0.9"/>
<text x="336.0" y="256" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A5</text>
<rect x="379.5" y="123.3" width="17.9" height="116.7" fill="var(--c1)" opacity="0.9"/>
<rect x="401.3" y="135.0" width="17.9" height="105.0" fill="var(--c3)" opacity="0.9"/>
<text x="400.0" y="256" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A6</text>
<rect x="443.5" y="193.3" width="17.9" height="46.7" fill="var(--c1)" opacity="0.9"/>
<rect x="465.3" y="193.3" width="17.9" height="46.7" fill="var(--c3)" opacity="0.9"/>
<text x="464.0" y="256" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A7</text>
<rect x="507.5" y="53.3" width="17.9" height="186.7" fill="var(--c1)" opacity="0.9"/>
<rect x="529.3" y="165.3" width="17.9" height="74.7" fill="var(--c3)" opacity="0.9"/>
<text x="528.0" y="256" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">A8</text>
</g>
<line x1="48" y1="193.3" x2="560" y2="193.3" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="556" y="185.3" text-anchor="end" font-size="11" fill="var(--c2)" font-family="var(--font-ui)">SMR = 1 (sesuai ekspektasi)</text>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)"><text x="48" y="14">SMR kasar (biru) vs SMR terhaluskan Bayes (oranye) — data sintetis</text><text x="560" y="270" text-anchor="end">area</text></g></svg>`;

export const hd23: V2Lesson = {
  slug: "hd23-pemetaan-penyakit-geospasial",
  track: "Health Data Science",
  module: "Kesehatan Populasi",
  title: "Disease Mapping: Peta Risiko Penyakit dengan Model Spasial Bayesian",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Peta yang menghukum kota kecil",
      prose: [
        "Bayangkan dua kabupaten. Kabupaten Maju: 200.000 penduduk, 150 kasus kanker langka tahun ini. Kabupaten Kecil: 2.000 penduduk, 2 kasus. Seorang jurnalis menghitung angka kasar, matanya membelalak: angka Kabupaten Kecil SEPULUH KALI LEBIH TINGGI. Headline keesokan harinya: “Klaster Kanker Misterius di Kabupaten Kecil — 10× Rata-rata!”. Warga panik, harga tanah anjlok, tim investigasi diterjunkan.",
        "Tim itu tidak menemukan apa-apa. Karena memang tidak ada apa-apa: 2 kasus dari 2.000 orang adalah fluktuasi acak yang sangat wajar — tahun depan bisa nol, bisa tiga, tanpa ada perubahan risiko sesungguhnya. Twist-nya: peta penyakit yang digambar dari angka mentah secara sistematis BERBOHONG untuk wilayah kecil. Ia mengubah noise menjadi “klaster”, dan keheningan data menjadi kepanikan. Setiap titik merah di peta semacam itu adalah tuduhan — dan tuduhan butuh bukti yang memperhitungkan ketidakpastian.",
        "Solusinya lahir dari statistik spasial Bayesian: model yang “meminjam kekuatan” dari wilayah tetangga untuk menstabilkan estimasi wilayah kecil — smoothing yang disiplin, bukan sekadar menghaluskan. Varian modernnya, model BYM2 (diformalkan ulang dalam literatur terbaru, termasuk paper 2026), memisahkan pola yang benar-benar spasial (risiko yang menular lewat tetangga) dari noise acak tiap wilayah. Di lesson ini kamu membangun intuisi itu dari nol: dari SMR yang naif, lewat pengerutan Bayes, sampai peta yang berani kamu pertanggungjawabkan.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini pekerjaan data, bukan cuma pekerjaan kartografer",
        type: "risk",
        body: "Peta risiko dipakai untuk mengalokasikan anggaran kesehatan, menempatkan puskesmas, dan memprioritaskan intervensi — seringkali dinilai dengan DALY (disability-adjusted life years, tahun hidup yang hilang akibat penyakit). Peta yang salah mengarahkan dana ke “klaster” palsu sementara klaster sungguhan tidak kebagian. Kegagalan analitik di sini = uang publik dan nyawa salah sasaran.",
      },
      reference: "Peta mentah menghukum wilayah kecil. Smoothing Bayesian = tuduhan hanya bila bukti cukup.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menghitung SMR (standardized morbidity/mortality ratio) dari kasus teramati dan ekspektasi, serta menjelaskan kenapa angka kasar menyesatkan untuk wilayah kecil; (2) menerapkan pengerutan Empirical Bayes untuk menstabilkan estimasi wilayah berpopulasi kecil; (3) menjelaskan model spasial BYM2 — komponen spasial terstruktur vs tak terstruktur dan peran parameter ρ; (4) memutuskan kapan memakai angka kasar, EB sederhana, atau model spasial penuh — dan mengaitkan peta risiko ke prioritas berbasis DALY.",
        "Rutenya: cerita → dua bekal ringkas → tiga konsep inti (SMR, pengerutan Bayes, BYM2) → lab Pyodide (mesin smoothing) → chart SMR kasar vs halus dengan panduan baca → peta keputusan → mini-case kabupaten fiktif → kuis → rangkuman. Estimasi 52 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, dari epidemiologi dasar: angka kasar (crude rate) tidak bisa dibandingkan antar-populasi berstruktur umur berbeda — karena itu dipakai standardisasi: kasus ekspektasi E dihitung dengan menerapkan angka acuan per kelompok umur ke struktur populasi wilayah. SMR = kasus teramati dibagi ekspektasi inilah versi ringkasnya. Kedua, dari inferensi Bayesian: posterior menggabungkan prior (keyakinan awal) dengan likelihood (data) — saat data sedikit, posterior “ditarik” mendekati prior; saat data banyak, data mendominasi. Prinsip inilah mesin di balik pengerutan: wilayah kecil “meminjam” informasi dari rata-rata keseluruhan (atau tetangganya) sampai datanya sendiri cukup kuat untuk bicara.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap setiap wilayah kecil seperti murid baru yang nilai ulangannya cuma 2 soal — kamu tidak langsung menyimpulkan ia bodoh/pintar; kamu “meminjam” nilai rata-rata kelas sampai ujiannya cukup banyak. Smoothing = versi statistik dari kebijaksanaan itu.",
      ],
      reference: "Bekal: (1) SMR = O/E setelah standardisasi umur; (2) Bayes: data sedikit → prior mendominasi; data banyak → data mendominasi.",
    },
    {
      id: "konsep-smr",
      eyebrow: "Langkah 3 · Konsep",
      title: "SMR — Si Pembanding Jujur yang Naif",
      prose: [
        "Definisi: Standardized Morbidity/Mortality Ratio membandingkan kasus yang TERAMATI (O, observed) di suatu wilayah dengan kasus yang DIEKSPEKTASI (E, expected) bila wilayah itu mengikuti pola populasi acuan. Ekspektasi dihitung per kelompok umur: E = Σ (populasi_kelompok × angka_acuan_kelompok). SMR = 1 berarti persis seperti ekspektasi; SMR = 2 berarti dua kali lipat.",
        "Kepribadiannya: SMR adalah wasit yang jujur tetapi naif — ia membandingkan dengan benar (sudah dikoreksi struktur umur), tetapi ia melaporkan skor apa adanya tanpa bertanya “berapa besar sampelnya?”. Untuk kota 200.000 jiwa, SMR = 1,5 adalah temuan kokoh. Untuk desa 2.000 jiwa dengan E = 0,5, satu kasus tambahan mengubah SMR dari 2 menjadi 4 — wasitnya berteriak, padahal yang terjadi cuma satu keluarga pindah masuk.",
        "Kapan memakai: SMR kasar boleh dipakai untuk wilayah berpopulasi BESAR dengan E yang besar (aturan praktis: E ≥ 20), atau sebagai langkah diagnostik awal sebelum smoothing. JANGAN pernah mempublikasikan peta SMR kasar untuk wilayah kecil — itulah peta pembohong dari cerita pembuka.",
      ],
      formula: String.raw`\text{SMR}_i = \frac{O_i}{E_i} \qquad E_i = \sum_j n_{ij}\, r_j^{\text{acuan}}`,
      formulaNote: "O_i = kasus teramati di wilayah i; E_i = kasus ekspektasi; n_ij = populasi kelompok umur j di wilayah i; r_j^acuan = angka penyakit kelompok umur j pada populasi acuan (mis. nasional). Contoh: wilayah dengan O = 12 dan E = 8 → SMR = 1,5 — 50% di atas ekspektasi. Interpretasi: SMR adalah RASIO, bukan risiko absolut; dan tanpa ukuran ketidakpastian (atau smoothing), ia tidak menjawab “apakah ini nyata?”.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “SMR 4 di desa itu = risikonya 4× lipat, harus investigasi”",
        type: "pitfall",
        body: "Yang benar: SMR 4 dengan E = 0,5 berarti O = 2 — dua kasus. Selisih satu kasus mengubah kesimpulan total. Sebelum investigasi, tanyakan E-nya: bila E kecil, SMR kasar adalah noise yang berdandan sebagai sinyal. Investigasi mahal (tim, lab, kepanikan publik) tidak boleh dipicu oleh dua kasus tanpa koreksi ketidakpastian.",
      },
      hints: [
        "💡 Intuisi: varians SMR kasar ≈ 1/E — berbanding terbalik dengan ekspektasi. E kecil = varians raksasa. Inilah satu-satunya rumus yang perlu kamu ingat untuk curiga pada peta wilayah kecil.",
      ],
      reference: "SMR kasar hanya aman bila E besar (≥ 20). Selain itu: smoothing dulu, peta kemudian.",
    },
    {
      id: "konsep-shrinkage",
      eyebrow: "Langkah 4 · Konsep",
      title: "Pengerutan Bayes — Si Pengerem yang Adil",
      prose: [
        "Definisi: pengerutan (shrinkage) Empirical Bayes mengganti SMR kasar O/E dengan estimasi yang “ditarik” ke arah rata-rata keseluruhan: θ̂ = (O + α)/(E + β), dengan α dan β parameter prior yang diestimasi dari seluruh data (mis. α = β = 2 berarti prior “percaya” risiko rata-rata = 1 dengan bobot setara 2 kasus ekspektasi). Mekanismenya otomatis adil: bila E besar, suku +α/+β tenggelam — data bicara sendiri; bila E kecil, prior mendominasi — estimasi “mengalah” ke rata-rata.",
        "Kepribadiannya: pengerutan adalah pengerem yang tahu kapan harus diinjak. Ia tidak menghapus sinyal — wilayah dengan O = 25, E = 10 tetap menunjukkan risiko tinggi setelah dikerutkan (2,5 → 2,25). Ia hanya menolak berteriak untuk bukti tipis: O = 2, E = 0,5 yang kasarnya SMR = 4 dikerutkan menjadi (2+2)/(0,5+2) = 1,6 — “menarik, tapi belum cukup bukti”. Itulah keadilan statistik: standar bukti yang sama untuk semua, disesuaikan dengan kekuatan data masing-masing.",
        "Kapan memakai: EB adalah pilihan default untuk peta cepat — satu baris rumus, tanpa model spasial, sudah menghilangkan sebagian besar klaster palsu. Keterbatasannya: ia mengerutkan SEMUA wilayah ke rata-rata GLOBAL, mengabaikan geografi — dua desa bertetangga yang sama-sama tinggi tidak saling menguatkan. Untuk itu ada langkah berikutnya.",
      ],
      formula: String.raw`\hat{\theta}_i^{\text{EB}} = \frac{O_i + \alpha}{E_i + \beta}`,
      formulaNote: "θ̂ = estimasi risiko relatif wilayah i setelah pengerutan; α, β = parameter prior (bobot “kasus/ekspektasi imajiner” yang ditarik ke rata-rata); O_i, E_i sama seperti SMR. Contoh: O = 2, E = 0,5, α = β = 2 → (2+2)/(0,5+2) = 1,6 — jauh lebih kalem dari SMR kasar 4,0. Bandingkan O = 25, E = 10 → (25+2)/(10+2) = 2,25 vs kasar 2,5 — hampir tidak berubah karena datanya kuat. Interpretasi: pengerutan = rata-rata tertimbang antara bukti lokal dan rata-rata global, dengan bobot otomatis dari kekuatan data.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Smoothing menghilangkan klaster yang sebenarnya”",
        type: "pitfall",
        body: "Yang benar: smoothing menghilangkan klaster yang TIDAK DIDUKUNG bukti — klaster sungguhan dengan data kuat hampir tidak bergeser (contoh di atas: 2,5 → 2,25). Yang hilang hanyalah “klaster” yang sebenarnya dua kasus kebetulan. Kalau smoothing menghapus temuanmu, temuanmu memang tidak pernah kokoh.",
      },
      hints: [
        "💡 Intuisi: α dan β adalah “bobot skeptisisme”. Makin besar nilainya, makin skeptis model terhadap klaim ekstrem dari data tipis. Nilai default α = β = 2 adalah skeptisisme yang sopan — cukup untuk membungkam noise, tidak cukup untuk membungkam sinyal.",
      ],
      reference: "EB: (O+α)/(E+β). Data kuat → tak berubah; data tipis → mengalah ke rata-rata.",
    },
    {
      id: "konsep-bym2",
      eyebrow: "Langkah 5 · Konsep",
      title: "BYM2 — Si Tetangga yang Bijak",
      prose: [
        "Definisi: model Besag–York–Mollié (BYM) dan reparametrisasi modernnya BYM2 memodelkan risiko tiap wilayah sebagai kombinasi tiga hal: baseline keseluruhan (α), efek SPASIAL TERSTRUKTUR (u_i — risiko yang “menular” lewat kedekatan geografis, dimodelkan dengan struktur CAR/conditional autoregressive: wilayah mirip dengan tetangganya), dan efek TAK TERSTRUKTUR (v_i — keunikan tiap wilayah yang acak). BYM2 menambahkan parameter ρ (0–1): proporsi varians yang dijelaskan komponen spasial. ρ mendekati 1 = pola penyakit mengikuti peta (klaster geografis nyata); ρ mendekati 0 = tiap wilayah jalan sendiri (noise acak).",
        "Kepribadiannya: jika EB adalah pengerem yang menarik semua ke rata-rata global, BYM2 adalah tetangga bijak yang berkata “tunggu — sebelum menarik ke rata-rata nasional, lihat dulu tetangga-tetangganya”. Tiga desa bertetangga yang semuanya tinggi saling menguatkan — mungkin ada sumber pencemaran di sungainya. Satu desa tinggi yang dikelilingi desa normal justru dicurigai sebagai noise. BYM2 mengkodekan kebijaksanaan “lihat konteks geografis” ke dalam matematika.",
        "Kapan memakai: BYM2 adalah standar emas disease mapping modern (dipakai dalam literatur spatial epidemiology terkini) bila (a) kamu punya data cukup banyak wilayah (puluhan+), (b) ada alasan geografis risiko mengelompok (pencemaran, vektor, akses layanan), dan (c) petanya akan dipakai untuk keputusan alokasi. Hasil akhirnya bukan sekadar peta titik estimasi, melainkan peta KETIDAKPASTIAN — kamu bisa menjawab “probabilitas risiko wilayah ini > 1,2 adalah 87%”, bahasa yang tepat untuk pengambil keputusan.",
      ],
      formula: String.raw`\log(\theta_i) = \alpha + u_i + v_i \qquad \rho = \frac{\text{Var}(u)}{\text{Var}(u)+\text{Var}(v)}`,
      formulaNote: "θ_i = risiko relatif wilayah i; α = log-risiko baseline keseluruhan; u_i = komponen spasial terstruktur (CAR — dipengaruhi tetangga); v_i = komponen acak tiap wilayah; ρ = fraksi varians yang bersifat spasial. Contoh baca output: ρ = 0,8 berarti 80% variasi risiko antar-wilayah mengikuti pola geografis — petanya “bercerita” tentang geografi, bukan noise. Interpretasi praktis: wilayah dengan θ̂ = 1,4 dan P(θ > 1,2) = 0,9 adalah kandidat intervensi yang jauh lebih meyakinkan daripada wilayah dengan θ̂ = 1,8 tetapi interval kredibelnya lebar mencakup 1.",
      tasks: [],
      hints: [
        "💡 Intuisi: tiga level kecanggihan — SMR kasar (percaya semua angka), EB (curiga pada data tipis), BYM2 (curiga pada data tipis TAPI percaya pada pola tetangga). Setiap level menambah satu kebijaksanaan: ketidakpastian, lalu geografi.",
      ],
      reference: "BYM2: log θ = α + u(spasial) + v(acak). ρ = seberapa “geografis” polanya. Output ideal = peta + ketidakpastian.",
    },
    {
      id: "lab-smoothing",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Bangun mesin smoothing",
      prose: [
        "Waktunya jadi analis spasialnya. Di bawah ada 8 area sintetis dengan kasus teramati (O) dan ekspektasi (E). Perhatikan A8: O = 2, E = 0,5 — SMR kasarnya 4,0, calon headline panik. Tugasmu: tulis tiga fungsi — `smr`, `smooth` (EB dengan α = β = 2), dan `biggest_shift` (area dengan selisih kasar-vs-halus terbesar) — lalu jalankan.",
        "Coba: setelah lolos, ubah α = β = 10 (skeptisisme lebih besar). Area mana yang paling banyak berubah? Itulah tuas “seberapa skeptis” yang kamu pegang sebagai analis.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `smr(o, e)`: kembalikan `o / e`" },
        { id: "t2", text: "Lengkapi `smooth(o, e)`: kembalikan `(o + 2) / (e + 2)` (α = β = 2)" },
        { id: "t3", text: "Lengkapi `biggest_shift()`: kembalikan nama area dengan |kasar − halus| terbesar" },
        { id: "t4", text: "Jalankan dan pastikan ringkasannya tercetak" },
      ],
      expected: "A1: kasar=1.20 halus=1.11\nA2: kasar=0.00 halus=0.67\nA3: kasar=1.50 halus=1.40\nA4: kasar=0.93 halus=0.95\nA5: kasar=0.33 halus=0.60\nA6: kasar=2.50 halus=2.25\nA7: kasar=1.00 halus=1.00\nA8: kasar=4.00 halus=1.60\nA8: kasar=4.00 halus=1.60 selisih=2.40",
      hints: [
        "Loop atas `areas`, hitung keduanya, simpan selisih absolutnya.",
        "A2 punya O = 0 — SMR kasarnya 0, tetapi versi halusnya tidak nol. Pikirkan kenapa itu masuk akal.",
      ],
      code: {
        starter: `# Data SINTETIS 8 area (bukan data surveilans asli)
areas = [
    {"nama": "A1", "o": 3,  "e": 2.5},
    {"nama": "A2", "o": 0,  "e": 1.0},
    {"nama": "A3", "o": 12, "e": 8.0},
    {"nama": "A4", "o": 7,  "e": 7.5},
    {"nama": "A5", "o": 1,  "e": 3.0},
    {"nama": "A6", "o": 25, "e": 10.0},
    {"nama": "A7", "o": 4,  "e": 4.0},
    {"nama": "A8", "o": 2,  "e": 0.5},
]

# TULIS KODEMU: tiga fungsi di bawah ini
def smr(o, e):
    return

def smooth(o, e):
    return

def biggest_shift():
    return

for a in areas:
    k = smr(a["o"], a["e"]); s = smooth(a["o"], a["e"])
    print(f'{a["nama"]}: kasar={k:.2f} halus={s:.2f}')
nama = biggest_shift()
a = next(x for x in areas if x["nama"] == nama)
print(f"{nama}: kasar={smr(a['o'],a['e']):.2f} halus={smooth(a['o'],a['e']):.2f} selisih={abs(smr(a['o'],a['e'])-smooth(a['o'],a['e'])):.2f}")`,
        lockLines: 11,
        solution: `# Data SINTETIS 8 area (bukan data surveilans asli)
areas = [
    {"nama": "A1", "o": 3,  "e": 2.5},
    {"nama": "A2", "o": 0,  "e": 1.0},
    {"nama": "A3", "o": 12, "e": 8.0},
    {"nama": "A4", "o": 7,  "e": 7.5},
    {"nama": "A5", "o": 1,  "e": 3.0},
    {"nama": "A6", "o": 25, "e": 10.0},
    {"nama": "A7", "o": 4,  "e": 4.0},
    {"nama": "A8", "o": 2,  "e": 0.5},
]

# TULIS KODEMU: tiga fungsi di bawah ini
def smr(o, e):
    return o / e

def smooth(o, e):
    return (o + 2) / (e + 2)

def biggest_shift():
    return max(areas, key=lambda a: abs(smr(a["o"], a["e"]) - smooth(a["o"], a["e"])))["nama"]

for a in areas:
    k = smr(a["o"], a["e"]); s = smooth(a["o"], a["e"])
    print(f'{a["nama"]}: kasar={k:.2f} halus={s:.2f}')
nama = biggest_shift()
a = next(x for x in areas if x["nama"] == nama)
print(f"{nama}: kasar={smr(a['o'],a['e']):.2f} halus={smooth(a['o'],a['e']):.2f} selisih={abs(smr(a['o'],a['e'])-smooth(a['o'],a['e'])):.2f}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "A8: kasar=4\\.00", label: "SMR kasar A8 = 4,00", msg: "2 / 0,5 = 4 — angka yang memicu headline panik." },
          { kind: "stdout_matches", task: "t2", pattern: "A8: kasar=4\\.00 halus=1\\.60", label: "SMR halus A8 = 1,60", msg: "(2+2)/(0,5+2) = 1,6 — pengerutan menjinakkan klaim ekstrem dari data tipis." },
          { kind: "stdout_matches", task: "t3", pattern: "selisih=2\\.40", label: "A8 teridentifikasi sebagai pergeseran terbesar", msg: "Selisih 2,40 = yang terbesar di antara 8 area." },
          { kind: "stdout_matches", task: "t4", pattern: "A6: kasar=2\\.50 halus=2\\.25", label: "A6 nyaris tak berubah", msg: "Data kuat (O=25) → smoothing hampir tidak menggeser: 2,50 → 2,25." },
        ],
      },
      note: {
        title: "Intuisi: curigai titik merah di wilayah kecil",
        body: "Pembuat peta penyakit yang berpengalaman membaca petanya dengan satu kecurigaan default: wilayah terkecil yang paling merah hampir pasti berbohong. Heuristiknya: pertama, jangan pernah mempublikasikan SMR kasar untuk wilayah kecil — variansnya ≈ 1/E, dan satu kasus bisa mengubah headline. Kedua, smoothing dulu, peta kemudian: EB untuk pekerjaan cepat, BYM2 bila ada dugaan pola geografis; yang runtuh setelah smoothing tidak pernah kokoh. Ketiga, baca ρ sebelum membaca warna — ρ tinggi berarti polanya geografis (pikirkan sumber bersama seperti pencemaran), ρ rendah berarti noise acak (jangan kejar). Keempat, untuk alokasi dana, jangan kejar warna paling merah — pakai probabilitas risiko melebihi ambang, ditimbang dengan beban DALY, karena anggaran harus mengalir ke beban penyakit terbesar, bukan ke outlier terkecil. Kelima, uji kejujuran petamu: bila wilayah terkecil = yang paling merah atau paling hijau, ulangi analisismu. Keenam, waspadai MAUP (modifiable areal unit problem) — batas administratif adalah garis politik, bukan garis epidemiologi; bila memungkinkan, uji sensitivitas dengan agregasi berbeda, karena klaster yang hanya muncul pada satu level agregasi patut dicurigai sebagai artefak batas. Peta adalah tuduhan — dan setiap tuduhan butuh standar bukti yang sama untuk semua wilayah, disesuaikan dengan kekuatan datanya.",
      },
      reference: "SMR kasar → EB smoothing. Yang berubah drastis = bukti tipis; yang tetap = sinyal kokoh.",
    },
    {
      id: "chart-smr",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca batang SMR seperti pembuat kebijakan",
      prose: [
        "Chart di bawah memplot hasil lab-mu: SMR kasar (biru) vs SMR terhaluskan (oranye) untuk 8 area, dengan garis putus-putus di SMR = 1.",
        "Cara membaca: sumbu Y = SMR (risiko relatif terhadap ekspektasi); tiap area punya dua batang berdampingan — biru = kasar, oranye = setelah pengerutan; garis putus-putus = 1 (sesuai ekspektasi). Selisih tinggi kedua batang = seberapa besar “koreksi skeptisisme” untuk area itu.",
        "Interpretasi: A8 adalah pelajaran chart ini — batang birunya menjulang ke 4,0 (calon headline), batang oranyenya turun ke 1,6. A6 justru meyakinkan: keduanya tinggi (2,5 → 2,25), artinya sinyalnya kokoh walau dikerutkan — inilah kandidat investigasi yang sebenarnya. A2 menarik dari arah sebaliknya: kasarnya 0 (nol kasus!), tetapi versi halusnya 0,67 — model menolak percaya risikonya benar-benar nol hanya karena belum ada kasus pada populasi kecil. Dan A5: kasar 0,33 naik menjadi 0,6 — “lebih rendah dari rata-rata” yang ekstrem pun dikoreksi ke arah tengah. Pola umumnya: makin kecil E suatu area, makin besar selisih kedua batangnya.",
      ],
      figure: {
        svg: SMR_SVG,
        alt: "Diagram batang 8 area: SMR kasar vs terhaluskan. A8 turun drastis dari 4,0 ke 1,6; A6 tetap tinggi; A2 naik dari 0 ke 0,67.",
        caption: "SMR kasar (biru) vs terhaluskan Bayes (oranye), 8 area (data sintetis). Garis putus-putus = ekspektasi.",
      },
      tasks: [],
      reference: "Batang yang runtuh setelah smoothing = noise. Batang yang bertahan = sinyal layak investigasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta seperti apa untuk keputusan apa?",
      prose: [
        "Lima skenario yang dihadapi analis kesehatan masyarakat:",
        "Skenario 1 — Dashboard internal cepat, semua wilayah berpopulasi besar (E ≥ 20). → SMR kasar cukup, sertakan interval kepercayaan. Alasan: data kuat → smoothing tidak mengubah apa-apa; kecepatan lebih berharga.",
        "Skenario 2 — Publikasi peta kabupaten/kota dengan populasi bervariasi. → WAJIB smoothing minimal EB. Alasan: tanpa ini, peta menghukum wilayah kecil — persis jebakan cerita pembuka. Ini bukan pilihan gaya; ini etika publikasi.",
        "Skenario 3 — Diduga ada klaster geografis (pencemaran sungai, vektor nyamuk, akses layanan). → Model spasial BYM2: ia memisahkan pola tetangga (u) dari noise (v), dan ρ memberi tahu seberapa “geografis” polanya. Alasan: EB menarik ke rata-rata global dan bisa melemahkan klaster nyata yang bergerombol — BYM2 justru memperkuatnya lewat tetangga.",
        "Skenario 4 — Alokasi anggaran intervensi antar-wilayah. → Pakai output model (bukan titik estimasi saja): prioritaskan wilayah dengan probabilitas risiko melebihi ambang TINGGI, mis. P(θ > 1,2) > 0,8 — dan timbang dengan DALY agar wilayah dengan beban penyakit terbesar didahulukan. Alasan: keputusan alokasi butuh bahasa probabilitas + beban, bukan sekadar warna merah di peta.",
        "Skenario 5 — Seseorang mengusulkan kovariat (tingkat kemiskinan, jarak ke RS) langsung di peta. → Boleh, tetapi masukkan sebagai kovariat DALAM model (bukan pewarnaan manual): log θ = α + βX + u + v. Alasan: kovariat menjelaskan SEBAGIAN variasi; sisa yang tak dijelaskan tetap butuh komponen spasial — kalau tidak, kamu mengklaim “kemiskinan menjelaskan semuanya” tanpa menguji sisa polanya.",
        "Aturan praktis 10 detik: E kecil? → smoothing wajib. Ada pola tetangga? → BYM2. Untuk alokasi dana? → pakai probabilitas + DALY, bukan warna.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mewarnai peta berdasarkan SMR kasar lalu menyebutnya “peta risiko”. Itu peta noise, bukan peta risiko. Uji kejujuran: bila wilayah terkecil di petamu juga yang paling merah (atau paling hijau), petamu hampir pasti berbohong — ulangi dengan smoothing.",
      },
      reference: "Kasus cepat → SMR+CI. Publikasi → EB. Klaster geografis → BYM2. Alokasi → probabilitas + DALY.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Dua kabupaten, satu headline",
      prose: [
        "Skenario (sintetis, untuk latihan): Dinas Kesehatan Provinsi S menerima laporan: Kabupaten Pesisir (populasi 180.000, E = 96) mencatat O = 144 kasus ISPA berat — SMR kasar 1,50. Kabupaten Pegunungan (populasi 9.000, E = 4,8) mencatat O = 14 — SMR kasar 2,92. Media lokal menulis “Pegunungan 2× lebih berbahaya dari Pesisir”. Kepala dinas harus memutuskan: kirim tim investigasi ke mana dulu, dengan anggaran hanya cukup untuk satu tim bulan ini?",
        "Pertanyaan analisis: (1) Hitung versi EB (α = β = 2) untuk keduanya — apa yang berubah? (2) Ke mana tim dikirim, dan apa argumen angkanya? (3) Informasi apa yang masih kurang untuk keputusan final?",
        "Pembahasan: (1) Pesisir: (144+2)/(96+2) = 1,49 — nyaris tak berubah (data kuat). Pegunungan: (14+2)/(4,8+2) = 2,35 — turun dari 2,92 tetapi tetap tinggi. (2) Kirim ke Pegunungan DULU — tetapi dengan narasi yang benar: bukan “2,9× lebih berbahaya” melainkan “risiko ~2,3× ekspektasi setelah koreksi ketidakpastian, perlu verifikasi”. Pesisir masuk antrean kedua dengan pemantauan rutin — SMR 1,49 pada E = 96 adalah sinyal kokoh yang tidak hilang, hanya kalah prioritas. (3) Yang masih kurang: struktur umur (apakah E sudah distandardisasi dengan benar?), tren waktu (apakah Pegunungan naik atau ini satu titik?), peta tetangga (apakah kabupaten sekitar Pegunungan juga tinggi — kandidat BYM2?), dan beban DALY (14 kasus ISPA vs 144 kasus — dampak populasinya beda jauh).",
        "Pelajaran: smoothing tidak selalu membatalkan kekhawatiran — kadang ia justru MEMVALIDASI-nya dengan angka yang bisa dipertahankan di depan publik. Analis yang baik tidak memakai smoothing untuk menenangkan, melainkan untuk jujur.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko terbesar di sini bukan salah hitung — melainkan salah NARASI. “Pegunungan 2× lebih berbahaya” (headline) vs “risiko Pegunungan ~2,3× ekspektasi setelah koreksi, butuh verifikasi” (analis). Yang pertama memicu kepanikan dan tuntutan politik; yang kedua memicu investigasi proporsional. Analis menulis narasi, bukan cuma angka.",
      },
      reference: "Smoothing memvalidasi kekhawatiran yang kokoh, membatalkan yang rapuh — dan selalu memperbaiki narasinya.",
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
        "SMR = O/E (dengan E terstandardisasi umur); variansnya ≈ 1/E — wilayah kecil = noise besar, jangan petakan mentah.",
        "Pengerutan Empirical Bayes θ̂ = (O+α)/(E+β): data kuat nyaris tak berubah, data tipis ditarik ke rata-rata — standar bukti yang adil untuk semua wilayah.",
        "BYM2: log θ = α + u(spasial CAR) + v(acak); ρ = fraksi varians yang geografis; output ideal = peta + probabilitas (mis. P(θ>1,2)).",
        "Aturan pakai: E ≥ 20 → SMR+CI cukup; publikasi wilayah kecil → EB wajib; dugaan klaster geografis → BYM2; alokasi dana → probabilitas + DALY.",
        "Uji kejujuran peta: bila wilayah terkecil = yang paling merah/hijau, ulangi dengan smoothing.",
      ],
      quiz: [
        {
          q: "Wilayah X: O = 2, E = 0,5 (SMR kasar 4,0). Tindakan analis yang benar?",
          options: [
            { text: "Terapkan smoothing dulu (mis. EB) sebelum menyimpulkan — SMR 4 dari E = 0,5 belum cukup bukti", why: "Benar: varians SMR kasar ≈ 1/E = 2 — sangat besar. Setelah EB (α=β=2): 1,6. Satu kasus tambahan mengubah segalanya; ini bukan dasar investigasi mahal.", correct: true },
            { text: "Langsung umumkan klaster — SMR 4 sudah sangat tinggi", why: "Salah: mengumumkan klaster dari 2 kasus adalah tepat jebakan cerita pembuka — headline panik dari noise." },
            { text: "Abaikan — SMR di atas 3 pasti noise", why: "Salah: tidak semua SMR tinggi adalah noise; yang menentukan adalah E (kekuatan data), bukan besarnya SMR." },
            { text: "Kalikan dengan populasi agar angkanya “lebih stabil”", why: "Salah: mengalikan tidak mengubah rasio O/E sama sekali — SMR tidak bergantung pada trik aritmetika, melainkan pada ketidakpastian." },
          ],
        },
        {
          q: "Setelah EB (α = β = 2), wilayah A: 2,50 → 2,25; wilayah B: 4,00 → 1,60. Kesimpulan?",
          options: [
            { text: "A sinyal kokoh (bertahan), B bukti tipis (runtuh) — prioritaskan A untuk investigasi", why: "Benar: smoothing adalah uji ketahanan. Yang bertahan = didukung data kuat; yang runtuh = tidak pernah kokoh.", correct: true },
            { text: "B lebih penting karena SMR kasarnya lebih tinggi", why: "Salah: SMR kasar B justru yang paling tidak bisa dipercaya — E-nya kecil. Membaca angka kasar setelah tahu hasil smoothing adalah kemunduran." },
            { text: "Keduanya sama-sama tidak valid karena sudah “dimanipulasi”", why: "Salah: smoothing bukan manipulasi — ia koreksi ketidakpastian yang terdokumentasi. Menolaknya berarti memilih noise." },
            { text: "Aman — keduanya di bawah ambang 5", why: "Salah: tidak ada ambang universal 5 untuk SMR; keputusan memakai kekuatan bukti (E) dan konteks, bukan angka magis." },
          ],
        },
        {
          q: "Output BYM2: ρ = 0,85. Artinya?",
          options: [
            { text: "85% variasi risiko antar-wilayah mengikuti pola geografis — klaster spasial kemungkinan nyata", why: "Benar: ρ = Var(u)/(Var(u)+Var(v)). Nilai tinggi = komponen tetangga (CAR) mendominasi — pola di peta bercerita tentang geografi, bukan noise acak.", correct: true },
            { text: "Risiko penyakitnya 85% lebih tinggi dari rata-rata", why: "Salah: ρ bukan ukuran risiko — ia ukuran SEBERAPA SPASIAL polanya. Risiko dibaca dari θ, bukan ρ." },
            { text: "Model 85% akurat", why: "Salah: ρ bukan akurasi model. Jangan menempelkan makna “akurasi” pada setiap parameter yang keluar dari model." },
            { text: "85% wilayah harus diintervensi", why: "Salah: ρ tidak memberi ambang intervensi — keputusan intervensi memakai P(θ > ambang) per wilayah, bukan ρ global." },
          ],
        },
        {
          q: "Kapan SMR kasar (tanpa smoothing) masih boleh dipakai?",
          options: [
            { text: "Wilayah berpopulasi besar (E ≥ 20) untuk dashboard internal cepat, disertai interval kepercayaan", why: "Benar: data kuat → smoothing tidak mengubah hasil; kecepatan dan kesederhanaan lebih berharga, selama ketidakpastian dilaporkan.", correct: true },
            { text: "Untuk peta publikasi kabupaten/kota dengan populasi bervariasi", why: "Salah: inilah kasus yang PALING butuh smoothing — peta publik dari SMR kasar menghukum wilayah kecil." },
            { text: "Saat ingin menemukan klaster sekecil apa pun", why: "Salah: “menemukan klaster sekecil apa pun” dari angka kasar = menemukan noise. Sensitivitas tanpa koreksi ketidakpastian adalah mesin alarm palsu." },
            { text: "Tidak pernah — SMR kasar selalu dilarang", why: "Salah: terlalu ekstrem. SMR kasar + CI untuk data kuat adalah praktik yang sah dan efisien." },
          ],
        },
        {
          q: "Untuk alokasi anggaran intervensi, metrik terbaik dari model spasial?",
          options: [
            { text: "Probabilitas risiko melebihi ambang per wilayah, ditimbang dengan beban DALY", why: "Benar: P(θ > 1,2) memberi bahasa keputusan (“87% yakin wilayah ini bermasalah”); DALY memastikan dana mengalir ke beban penyakit terbesar, bukan ke warna paling merah.", correct: true },
            { text: "SMR kasar tertinggi — kejar angka terbesar", why: "Salah: mengejar SMR kasar = mengejar noise wilayah kecil; anggaran publik bukan hadiah untuk outlier." },
            { text: "Jumlah kasus mentah tertinggi — kejar O terbesar", why: "Salah: O mentah mengabaikan ukuran populasi dan struktur umur — kota besar selalu menang tanpa informasi risiko." },
            { text: "Wilayah dengan ρ tertinggi", why: "Salah: ρ adalah parameter GLOBAL model (seberapa spasial polanya), bukan skor per wilayah untuk alokasi." },
          ],
        },
      ],
    },
  ],
};
