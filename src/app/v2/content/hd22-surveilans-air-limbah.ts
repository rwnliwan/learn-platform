import type { V2Lesson } from "../lib/types";

// ── Figure: konsentrasi ternormalisasi 12 minggu + ambang siaga μ+2σ ──────
const WBE_SVG = `<svg viewBox="0 0 560 270" role="img" aria-label="Grafik garis konsentrasi virus ternormalisasi 12 minggu dengan ambang siaga">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="48" y1="216.0" x2="520" y2="216.0"/>
<line x1="48" y1="173.3" x2="520" y2="173.3"/>
<line x1="48" y1="130.7" x2="520" y2="130.7"/>
<line x1="48" y1="88.0" x2="520" y2="88.0"/>
<line x1="48" y1="45.3" x2="520" y2="45.3"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="42" y="220.0">0</text>
<text x="42" y="177.3">100</text>
<text x="42" y="134.7">200</text>
<text x="42" y="92.0">300</text>
<text x="42" y="49.3">400</text>
</g><g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle">
<text x="48.0" y="232">1</text>
<text x="90.9" y="232">2</text>
<text x="133.8" y="232">3</text>
<text x="176.7" y="232">4</text>
<text x="219.6" y="232">5</text>
<text x="262.5" y="232">6</text>
<text x="305.5" y="232">7</text>
<text x="348.4" y="232">8</text>
<text x="391.3" y="232">9</text>
<text x="434.2" y="232">10</text>
<text x="477.1" y="232">11</text>
<text x="520.0" y="232">12</text>
</g>
<polyline points="48.0,164.8 90.9,156.9 133.8,162.7 176.7,151.2 219.6,156.2 262.5,149.9 305.5,149.4 348.4,77.7 391.3,41.1 434.2,55.9 477.1,130.7 520.0,144.7" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<line x1="48" y1="145.0" x2="520" y2="145.0" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="516" y="137.0" text-anchor="end" font-size="11" fill="var(--c2)" font-family="var(--font-ui)">ambang siaga (μ+2σ)</text>
<g>
<circle cx="48.0" cy="164.8" r="4.5" fill="var(--c1)"/>
<circle cx="90.9" cy="156.9" r="4.5" fill="var(--c1)"/>
<circle cx="133.8" cy="162.7" r="4.5" fill="var(--c1)"/>
<circle cx="176.7" cy="151.2" r="4.5" fill="var(--c1)"/>
<circle cx="219.6" cy="156.2" r="4.5" fill="var(--c1)"/>
<circle cx="262.5" cy="149.9" r="4.5" fill="var(--c1)"/>
<circle cx="305.5" cy="149.4" r="4.5" fill="var(--c1)"/>
<circle cx="348.4" cy="77.7" r="4.5" fill="var(--c2)"/>
<circle cx="391.3" cy="41.1" r="4.5" fill="var(--c2)"/>
<circle cx="434.2" cy="55.9" r="4.5" fill="var(--c2)"/>
<circle cx="477.1" cy="130.7" r="4.5" fill="var(--c2)"/>
<circle cx="520.0" cy="144.7" r="4.5" fill="var(--c2)"/>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)"><text x="48" y="14">konsentrasi ternormalisasi (unit arbitrer)</text><text x="520" y="246" text-anchor="end">minggu (data sintetis)</text></g>
</svg>`;

export const hd22: V2Lesson = {
  slug: "hd22-surveilans-air-limbah",
  track: "Health Data Science",
  module: "Kesehatan Populasi",
  title: "Wastewater-Based Epidemiology: Membaca Wabah dari Air Limbah",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kota yang tahu lebih dulu — dari selokan",
      prose: [
        "Maret 2020, kota Amersfoort di Belanda. Belum ada satu pun kasus COVID-19 yang dilaporkan di sana — rumah sakit tenang, angka resmi nol. Tetapi di laboratorium, sebuah sampel air limbah dari instalasi pengolahan kota itu positif mengandung materi genetik SARS-CoV-2. Enam hari kemudian, kasus klinis pertama Amersfoort tercatat. Air limbah kota itu tahu lebih dulu daripada sistem kesehatannya sendiri.",
        "Itu bukan sulap. Orang yang terinfeksi membuang fragmen virus lewat tinja — termasuk mereka yang tidak bergejala dan tidak pernah dites. Satu sampel dari pipa utama mewakili puluhan ribu orang sekaligus, tanpa perlu satu pun dari mereka antre swab. Twist-nya: surveilans klinis, yang selama ini kita anggap “data resmi”, sebenarnya hanya melihat puncak gunung es — orang yang sakit cukup parah untuk dites. Air limbah melihat seluruh gunung esnya, dari bawah.",
        "Amerika Serikat membangun ini menjadi infrastruktur nasional: CDC menjalankan National Wastewater Surveillance System (NWSS), dan kisah resminya lugas — data air limbah real-time memandu aksi kesehatan masyarakat, dari peringatan dini lonjakan hingga evaluasi efektivitas intervensi. Lalu ironi pahitnya: komentar RAND pada April 2025 memperingatkan pendanaan federal untuk surveilans air limbah berisiko habis pada September 2025 — sistem yang paling murah per kapita justru yang paling rapuh pendanaannya. Dan pada Maret 2025, StatNews melaporkan air limbah dipakai melacak penyebaran flu burung H5N1 — saat surveilans klinis pada manusia nyaris buta karena kasusnya langka. Di lesson ini kamu belajar membaca data jenis ini seperti epidemiolog: normalisasi, baseline, dan ambang siaga.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini pekerjaan data, bukan cuma pekerjaan lab",
        type: "risk",
        body: "Sampel air limbah mentah hanyalah angka konsentrasi — tidak ada artinya sampai dinormalisasi terhadap debit dan populasi, dibandingkan dengan baseline, dan diterjemahkan menjadi keputusan (“peringatkan dinas kesehatan” vs “ini cuma efek hujan”). Kegagalan analitik di sini berarti dua hal: peringatan dini yang terlewat (wabah meledak tanpa aba-aba), atau alarm palsu yang menghabiskan sumber daya respons.",
      },
      reference: "Air limbah = surveilans tingkat komunitas: menangkap yang tidak dites, lebih dulu, lebih murah — dengan syarat analitiknya benar.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan prinsip wastewater-based epidemiology (WBE) — kenapa sampel komunal bisa mendahului data klinis; (2) menghitung beban virus per kapita dari konsentrasi mentah, debit, dan populasi, lengkap dengan interpretasi tiap simbol; (3) menerapkan normalisasi aliran (dan indikator fekal) untuk membedakan sinyal wabah asli dari artefak hujan; (4) membangun aturan ambang siaga berbasis z-score terhadap baseline dan menafsirkan kapan harus memicu respons.",
        "Rutenya: cerita → dua bekal ringkas → tiga konsep inti (WBE, normalisasi, ambang siaga) → lab Pyodide (mesin deteksi minggu siaga) → chart 12 minggu dengan panduan baca → peta keputusan respons → mini-case kota fiktif → kuis → rangkuman. Estimasi 52 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, dari surveilans wabah: penyebaran penyakit dimodelkan dengan model kompartemen SIR (Susceptible–Infectious–Recovered) — dari laju kontak dan pemulihan kita memperkirakan R0 dan memprediksi puncak wabah. Data kasus klinis adalah input utama model semacam itu, tetapi ia selalu terlambat: ada jeda infeksi → gejala → tes → pelaporan. WBE tidak menggantikan model itu — ia memberi input yang lebih awal dan lebih lengkap. Kedua, dari epidemiologi dasar: insidens adalah kasus BARU per populasi per waktu, prevalens adalah kasus yang ADA saat ini; tabel 2×2 dipakai untuk menghitung ukuran asosiasi pada individu. Air limbah tidak bisa memberi tahu SIAPA yang sakit (tidak ada tabel 2×2 individu) — tetapi ia memberi tren insidens tingkat komunitas yang jujur terhadap bias tes.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap WBE sebagai “survei yang tidak bisa menolak” — seluruh kota menjadi responden, setiap hari, tanpa kuesioner. Kelemahannya simetris: kamu tidak tahu siapa responden yang menjawab apa.",
      ],
      reference: "Bekal: (1) SIR butuh data kasus yang selalu terlambat — WBE memberi sinyal lebih awal; (2) insidens vs prevalens; WBE = tren komunitas, bukan diagnosis individu.",
    },
    {
      id: "konsep-wbe",
      eyebrow: "Langkah 3 · Konsep",
      title: "WBE — Si Mata-Mata Komunal",
      prose: [
        "Definisi: wastewater-based epidemiology (WBE) adalah surveilans kesehatan masyarakat berbasis analisis patogen (atau biomarker) dalam sampel air limbah komunal — biasanya diambil di instalasi pengolahan air limbah (IPAL) atau titik hulu seperti saluran lingkungan. Orang yang terinfeksi menumpahkan (shedding) materi genetik patogen lewat tinja; qPCR/ddPCR mengukur konsentrasinya dalam satuan genome copies per liter (gc/L). Satu titik sampel mewakili seluruh populasi yang tersambung ke jaringan — puluhan hingga ratusan ribu orang.",
        "Kepribadiannya: WBE adalah mata-mata yang tidak bisa kamu bohongi dan tidak bisa kamu ajak bicara. Ia tidak peduli apakah kamu dites atau tidak, bergejala atau tidak, punya asuransi atau tidak — semua yang masuk ke pipa tercatat. Itulah kekuatannya: menangkap infeksi asimptomatik dan kelompok yang tidak terjangkau layanan kesehatan, dengan biaya per kapita jauh di bawah testing massal. Dan itulah kelemahannya: ia tidak bisa menunjuk satu orang pun. Ia tahu “sesuatu naik di wilayah ini”, bukan “siapa yang harus dikarantina”.",
        "Kapan memakai: WBE bersinar untuk (a) peringatan dini — sinyalnya mendahului kasus klinis 3–7 hari karena shedding dimulai sebelum gejala dan tanpa antrean tes; (b) pemantauan tren saat testing klinis menurun (fase “post-emergency”); (c) patogen yang surveilans klinisnya lemah — contohnya H5N1 pada manusia, di mana kasus klinis langka tetapi virusnya bisa terdeteksi di air limbah. JANGAN memakai WBE untuk diagnosis individu, estimasi jumlah kasus pasti tanpa kalibrasi, atau perbandingan antar-kota tanpa normalisasi yang setara.",
      ],
      formula: String.raw`\text{beban per kapita} = \frac{C \times Q}{P}`,
      formulaNote: "C = konsentrasi virus terukur (genome copies per liter, gc/L); Q = debit air limbah (liter per hari) — total volume yang lewat titik sampel; P = populasi yang dilayani titik itu (jiwa). Hasilnya: gc per orang per hari — ukuran beban infeksi komunitas yang sudah dikoreksi ukuran kota dan volume air. Contoh angka: C = 150 gc/L, Q = 80 juta L/hari, P = 200.000 jiwa → beban = 150 × 80.000.000 / 200.000 = 60.000 gc/orang/hari. Interpretasi: angka absolutnya tidak bermakna tanpa baseline — yang bermakna adalah PERUBAHANNYA dari minggu ke minggu di kota yang sama.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Konsentrasi virus naik 2× — berarti kasus naik 2×”",
        type: "pitfall",
        body: "Yang benar: konsentrasi MENTAH naik bisa berarti tiga hal — (1) memang lebih banyak yang terinfeksi, (2) hujan deras mengencerkan sampel kemarin sehingga hari ini terlihat “naik” padahal cuma kembali normal, atau (3) debit berubah karena hari libur. Tanpa normalisasi terhadap debit (dan idealnya indikator fekal), angka mentah adalah angka yang berbohong dengan percaya diri.",
      },
      hints: [
        "💡 Intuisi: WBE mengukur PIPA, bukan ORANG. Setiap langkah analitik — normalisasi debit, koreksi populasi, baseline — adalah upaya menerjemahkan “apa yang terjadi di pipa” menjadi “apa yang terjadi pada orang”.",
      ],
      reference: "WBE = surveilans komunal: lebih awal, lebih lengkap, lebih murah — tetapi buta individu dan butuh normalisasi.",
    },
    {
      id: "konsep-normalisasi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Normalisasi — Si Penerjemah Hujan",
      prose: [
        "Definisi: normalisasi adalah koreksi konsentrasi terukur terhadap faktor non-epidemi yang mengubahnya — terutama pengenceran oleh air hujan/limbah industri (dilution) dan fluktuasi populasi (komuter, wisatawan). Dua pendekatan standar: (a) koreksi debit — kalikan konsentrasi dengan rasio debit terhadap debit acuan; (b) normalisasi indikator fekal — bagi konsentrasi target dengan konsentrasi virus indikator tinja manusia yang stabil, misalnya pepper mild mottle virus (PMMoV), sehingga yang tersisa adalah “virus per tinja manusia”, bukan “virus per liter air hujan”.",
        "Kepribadiannya: normalisasi adalah penerjemah yang jujur di antara pipa dan analis. Tanpa dia, analis membaca “wabah reda” padahal yang terjadi cuma hujan deras tiga hari berturut-turut — kesalahan yang dalam konteks nyata berarti mencabut peringatan dini tepat saat wabah sedang naik. Dengan dia, pola musiman curah hujan berhenti meniru pola wabah.",
        "Kapan memakai: SELALU laporkan metode normalisasimu, dan JANGAN bandingkan angka antar-kota (atau antar-musim) yang memakai metode normalisasi berbeda. Praktik terbaik: sajikan keduanya — konsentrasi mentah dan ternormalisasi — agar pembaca bisa menilai sendiri seberapa besar koreksinya.",
      ],
      formula: String.raw`C_{\text{adj}} = C_{\text{mentah}} \times \frac{Q_{\text{acuan}}}{Q_{\text{terukur}}} \qquad\text{atau}\qquad C_{\text{norm}} = \frac{C_{\text{target}}}{C_{\text{PMMoV}}}`,
      formulaNote: "C_adj = konsentrasi terkoreksi debit; Q_acuan = debit pada kondisi kering normal (mis. rata-rata musim kemarau); Q_terukur = debit saat sampel diambil. Contoh: C_mentah = 300 gc/L tetapi hujan membuat Q_terukur = 120 juta L/hari vs Q_acuan = 80 juta L/hari → C_adj = 300 × 80/120 = 200 gc/L — sinyal “asli” lebih tinggi dari yang terlihat mentah. Versi PMMoV: C_target dibagi C_PMMoV — bila hujan mengencerkan keduanya sama besar, rasionya tetap stabil. Interpretasi: normalisasi tidak menambah informasi wabah — ia MENGHAPUS informasi cuaca dari datamu.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Data mentah dari lab sudah cukup — koreksi cuma kosmetik”",
        type: "pitfall",
        body: "Yang benar: di kota beriklim hujan, variasi debit bisa mengubah konsentrasi 2–5× lipat tanpa satu pun infeksi baru. Koreksi bukan kosmetik — ia adalah perbedaan antara “mendeteksi wabah” dan “mendeteksi musim hujan”. Analis yang melewatkan langkah ini akan menulis laporan tren yang sebenarnya laporan cuaca.",
      },
      hints: [
        "💡 Intuisi: setiap kali melihat lonjakan atau penurunan tajam pada data air limbah, pertanyaan PERTAMA bukan “ada varian baru?” melainkan “bagaimana cuacanya minggu itu?”. Baru setelah cuaca disingkirkan, boleh bicara epidemiologi.",
      ],
      reference: "Normalisasi = hapus cuaca dari data. Koreksi debit atau rasio PMMoV; jangan bandingkan antar-kota dengan metode berbeda.",
    },
    {
      id: "konsep-ambang",
      eyebrow: "Langkah 5 · Konsep",
      title: "Ambang Siaga — Si Penjaga yang Tak Tidur",
      prose: [
        "Definisi: ambang siaga (alert threshold) adalah aturan kuantitatif yang mengubah deret waktu konsentrasi menjadi keputusan biner: “picu respons” atau “lanjutkan pantau”. Pendekatan paling umum: z-score terhadap baseline — z = (x − μ_baseline) / σ_baseline, dengan baseline diambil dari periode tenang (mis. 4–6 minggu terakhir). Aturan praktis: z > 2 pada satu minggu = waspada (naikkan frekuensi sampling); z > 2 pada dua minggu berturut-turut (atau z > 3 sekali) = siaga — picu investigasi: testing terarah di wilayah hulu, cek kapasitas RS.",
        "Kepribadiannya: ambang siaga adalah penjaga malam yang tidak kenal lelah tetapi buta konteks — ia akan berteriak untuk lonjakan nyata maupun untuk sampel yang terkontaminasi lab. Karena itu ambang yang baik selalu berpasangan dengan protokol verifikasi: ulangi sampel, cek catatan operasional IPAL (ada bypass? ada perbaikan?), baru eskalasi. Ambang tanpa protokol verifikasi menghasilkan alarm fatigue — dan penjaga yang terlalu sering berteriak palsu akhirnya tidak didengar saat bahaya sungguhan datang.",
        "Kapan memakai: ambang siaga dipakai untuk SEMUA program WBE rutin — tanpa ambang, data hanya jadi arsip. JANGAN memakai ambang yang sama untuk semua patogen: shedding dynamics berbeda (norovirus melonjak tajam dan cepat reda; SARS-CoV-2 lebih landai), sehingga baseline dan kelipatan σ harus dikalibrasi per patogen dari data historis.",
      ],
      formula: String.raw`z = \frac{x - \mu_{\text{baseline}}}{\sigma_{\text{baseline}}}`,
      formulaNote: "x = konsentrasi ternormalisasi minggu ini; μ_baseline = rata-rata periode tenang (mis. 6 minggu terakhir tanpa kejadian); σ_baseline = simpangan bakunya. Contoh: baseline μ = 138,4, σ = 14,0; minggu ini x = 324,1 → z = (324,1 − 138,4)/14,0 ≈ 13,3 — tiga belas simpangan baku di atas normal, bukan fluktuasi. Interpretasi: z mengukur “seberapa tidak normal” minggu ini dalam satuan variabilitas normalnya sendiri — z = 2 artinya dua kali lipat kegaduhan latar, ambang waspada yang wajar.",
      tasks: [],
      hints: [
        "💡 Intuisi: z-score adalah bahasa universal “keganjilan”. Ia bekerja untuk air limbah, harga saham, maupun detak jantung — yang berbeda hanya apa yang kamu lakukan setelah ia berteriak.",
      ],
      reference: "Ambang: z > 2 = waspada; z > 2 dua minggu berturut-turut (atau z > 3) = siaga + verifikasi sebelum eskalasi.",
    },
    {
      id: "lab-siaga",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Bangun mesin deteksi minggu siaga",
      prose: [
        "Waktunya jadi analis surveilansnya. Di bawah ada 12 minggu data sintetis satu kota: konsentrasi mentah (gc/L) dan debit (juta L/hari). Perhatikan minggu 11–12: hujan deras, debit melonjak — jebakan klasik. Tugasmu: tulis tiga fungsi — `adjust` (koreksi debit), `baseline_stats` (μ dan σ dari 6 minggu pertama), dan `detect` (daftar minggu dengan z > 2) — lalu jalankan.",
        "Coba: setelah lolos, hapus koreksi debit (pakai konsentrasi mentah langsung) dan lihat apa yang berubah pada daftar minggu siaga. Itulah harga melewatkan normalisasi — minggu hujan deras akan terlihat “aman” padahal sinyalnya masih menyala.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `adjust(c, q)`: kembalikan `c * 80 / q` (Q_acuan = 80)" },
        { id: "t2", text: "Lengkapi `baseline_stats(vals)`: kembalikan `(mean, stdev)` dari 6 nilai pertama" },
        { id: "t3", text: "Lengkapi `detect(adj, mu, sd)`: kembalikan list nomor minggu (1-based) dengan z > 2" },
        { id: "t4", text: "Jalankan dan pastikan dua baris ringkasan tercetak" },
      ],
      expected: "baseline: mu=138.4 sd=14.0\nminggu_siaga=[8, 9, 10, 11, 12]",
      hints: [
        "Gunakan `statistics.mean` dan `statistics.stdev` — sudah diimpor.",
        "z = (a − mu) / sd; nomor minggu = indeks + 1.",
        "Minggu 11–12: konsentrasi mentah TURUN (300, 240) tetapi debit NAIK (120, 115) — koreksi debit seharusnya membuat keduanya tetap di atas ambang.",
      ],
      code: {
        starter: `import statistics

# Data SINTETIS satu kota (bukan data NWSS asli)
conc = [120,135,128,150,142,155,160,320,410,380,300,240]  # gc/L
flow = [80,78,82,79,81,80,82,79,80,81,120,115]            # juta L/hari
Q_ACUAN = 80

# TULIS KODEMU: tiga fungsi di bawah ini
def adjust(c, q):
    return

def baseline_stats(vals):
    return

def detect(adj, mu, sd):
    return

adj = [adjust(c, q) for c, q in zip(conc, flow)]
mu, sd = baseline_stats(adj)
flags = detect(adj, mu, sd)
print(f"baseline: mu={mu:.1f} sd={sd:.1f}")
print(f"minggu_siaga={flags}")`,
        lockLines: 6,
        solution: `import statistics

# Data SINTETIS satu kota (bukan data NWSS asli)
conc = [120,135,128,150,142,155,160,320,410,380,300,240]  # gc/L
flow = [80,78,82,79,81,80,82,79,80,81,120,115]            # juta L/hari
Q_ACUAN = 80

# TULIS KODEMU: tiga fungsi di bawah ini
def adjust(c, q):
    return c * Q_ACUAN / q

def baseline_stats(vals):
    return statistics.mean(vals[:6]), statistics.stdev(vals[:6])

def detect(adj, mu, sd):
    return [i + 1 for i, a in enumerate(adj) if (a - mu) / sd > 2]

adj = [adjust(c, q) for c, q in zip(conc, flow)]
mu, sd = baseline_stats(adj)
flags = detect(adj, mu, sd)
print(f"baseline: mu={mu:.1f} sd={sd:.1f}")
print(f"minggu_siaga={flags}")`,
        checks: [
          { kind: "contains", task: "t1", name: "flags", value: 11, label: "Minggu 11 (hujan deras) tetap terdeteksi", msg: "Minggu 11 hanya masuk daftar bila koreksi debit benar: 300 × 80/120 = 200 > ambang." },
          { kind: "equal", task: "t2", name: "mu", value: 138.41, tol: 0.05, label: "`mu` baseline ≈ 138,4", msg: "Rata-rata 6 nilai ternormalisasi pertama." },
          { kind: "equal", task: "t2", name: "sd", value: 14.02, tol: 0.05, label: "`sd` baseline ≈ 14,0", msg: "statistics.stdev dari 6 nilai pertama (simpangan baku sampel)." },
          { kind: "stdout_matches", task: "t4", pattern: "minggu_siaga=\\[8, 9, 10, 11, 12\\]", label: "Lima minggu siaga terdeteksi", msg: "Minggu 8–12 semua z > 2; minggu 11–12 hanya tertangkap berkat koreksi debit." },
        ],
      },
      note: {
        title: "Intuisi: pipa tidak berbohong, tetapi ia bicara bahasa cuaca",
        body: "Analis WBE senior punya satu refleks: setiap kali melihat lonjakan atau penurunan tajam, pertanyaan pertamanya bukan “ada varian baru?” melainkan “bagaimana cuacanya minggu itu?” Heuristik lengkapnya: pertama, normalisasi dulu, interpretasi kemudian — konsentrasi mentah tanpa koreksi debit adalah angka yang berbohong dengan percaya diri; sajikan mentah dan ternormalisasi berdampingan agar koreksinya bisa diaudit. Kedua, yang bermakna adalah perubahan terhadap baseline kota yang sama, bukan angka absolutnya — 60.000 gc/orang/hari tidak berarti apa-apa tanpa tahu normalnya berapa. Ketiga, hormati keunggulan WBE: sinyalnya mendahului kasus klinis 3–7 hari — menunggu konfirmasi klinis sebelum bertindak berarti membuang satu-satunya keunggulanmu. Keempat, ambang tanpa protokol verifikasi menghasilkan alarm fatigue — cek catatan operasional IPAL sebelum eskalasi, karena penjaga yang terlalu sering berteriak palsu tidak didengar saat bahaya sungguhan datang. Kelima, jangan hentikan sampling saat tenang — keheningan data hari ini adalah kebutaan minggu depan, dan biaya sampling rutin jauh lebih murah daripada satu minggu keterlambatan respons.",
      },
      reference: "Alur WBE: konsentrasi mentah → koreksi debit → bandingkan dengan baseline (z-score) → putuskan waspada/siaga.",
    },
    {
      id: "chart-wbe",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca grafik 12 minggu seperti epidemiolog",
      prose: [
        "Chart di bawah memplot hasil lab-mu: konsentrasi ternormalisasi 12 minggu, dengan garis putus-putus sebagai ambang siaga (μ + 2σ).",
        "Cara membaca: sumbu X = minggu ke-; sumbu Y = konsentrasi virus ternormalisasi; tiap titik = satu minggu; garis putus-putus merah = ambang siaga. Titik merah = minggu yang z-score-nya melewati ambang (hasil fungsi `detect`-mu).",
        "Interpretasi: minggu 1–7 datar di sekitar baseline — kota dalam kondisi tenang. Minggu 8 sinyal mulai menyala, minggu 9–10 mencapai puncak — ini pola wabah yang sedang naik, bukan fluktuasi. Pelajaran terpenting ada di minggu 11–12: garis konsentrasi mentah (tanpa koreksi) akan menunjukkan penurunan karena hujan — tetapi setelah koreksi debit, kedua minggu itu tetap merah. Analis yang membaca data mentah akan melaporkan “wabah mereda”; analis yang menormalisasi tahu wabahnya masih menyala. Selisih antara kedua kesimpulan itu adalah nilai seluruh lesson ini.",
      ],
      figure: {
        svg: WBE_SVG,
        alt: "Grafik garis 12 minggu: datar di minggu 1-7, melonjak di minggu 8-10, tetap di atas ambang siaga pada minggu 11-12. Garis ambang putus-putus.",
        caption: "Konsentrasi ternormalisasi 12 minggu (data sintetis). Titik merah = minggu siaga (z > 2).",
      },
      tasks: [],
      reference: "Titik merah setelah hujan = bukti normalisasi bekerja. Tanpa koreksi, minggu 11–12 terlihat “aman”.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Sinyal menyala — lalu apa?",
      prose: [
        "Lima skenario respons yang dihadapi tim surveilans setiap musim:",
        "Skenario 1 — Tren naik 2 minggu berturut-turut, data klinis masih datar (seperti minggu 8–9 di lab). → Waspada: naikkan frekuensi sampling jadi 2× seminggu, beri tahu dinas kesehatan untuk siaga testing. Alasan: inilah jendela keunggulan WBE — 3–7 hari sebelum kasus klinis; menunggu konfirmasi klinis berarti membuang keunggulan itu.",
        "Skenario 2 — Lonjakan satu minggu lalu kembali normal. → Verifikasi dulu: cek catatan IPAL (ada bypass/pemeliharaan?), ulangi sampel. Alasan: satu titik bisa berarti kontaminasi lab atau kejadian operasional — ambang siaga butuh konfirmasi sebelum eskalasi.",
        "Skenario 3 — Konsentrasi mentah turun tajam bertepatan dengan hujan deras. → JANGAN umumkan “wabah mereda” sebelum normalisasi debit. Alasan: ini jebakan minggu 11–12 di lab-mu — pengenceran meniru perbaikan.",
        "Skenario 4 — Sinyal tinggi bertahan 4+ minggu tetapi kasus klinis tetap rendah. → Investigasi terarah: testing di wilayah hulu (sekolah, asrama), cek apakah varian baru dengan shedding tinggi tetapi gejala ringan. Alasan: diskrepansi persisten antara WBE dan klinis adalah informasi — bukan error.",
        "Skenario 5 — Sinyal turun konsisten 3 minggu di bawah baseline. → Turunkan level respons, tetapi JANGAN hentikan sampling. Alasan: menghentikan surveilans saat tenang berarti buta saat gelombang berikutnya mulai — biaya sampling rutin jauh lebih murah daripada satu minggu keterlambatan respons.",
        "Aturan praktis 10 detik: normalisasi dulu → hitung z vs baseline → z > 2 dua minggu = siaga → verifikasi operasional → eskalasi proporsional. Tidak ada langkah yang boleh dilompati.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengumumkan tren ke publik dari data mentah tanpa normalisasi — lalu harus meralat saat hujan reda. Sekali kredibilitas surveilans retak, peringatan berikutnya yang valid pun diabaikan. Aturan komunikasi: yang diumumkan ke publik selalu angka ternormalisasi dengan baseline yang jelas.",
      },
      reference: "Respons proporsional: waspada (sampling↑) → siaga (testing terarah) → reda (jangan hentikan sampling).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Kota Rawa dan minggu ke-8 yang basah",
      prose: [
        "Skenario (sintetis, untuk latihan — kota dan angkanya fiktif): Kota Rawa (populasi 210.000) menjalankan WBE mingguan di satu IPAL. Enam minggu pertama tenang: konsentrasi ternormalisasi 120–155 unit. Minggu 7: 156 — masih di bawah ambang. Minggu 8: konsentrasi mentah 320 gc/L pada debit normal → ternormalisasi 324, z ≈ 13 — sirene menyala. Minggu 9–10: puncak (410, 375). Lalu hujan deras mengguyur: minggu 11 debit melonjak 50%, konsentrasi mentah “hanya” 300; minggu 12 debit masih tinggi, konsentrasi mentah 240. Kepala dinas kesehatan bertanya: “Apakah wabahnya sudah mereda? Kasus RS minggu ini cuma 12.”",
        "Pertanyaan analisis: (1) Apa jawabanmu untuk kepala dinas — dengan angka? (2) Tindakan apa yang proporsional minggu ini? (3) Apa yang akan terjadi jika tim memakai data mentah?",
        "Pembahasan: (1) Belum mereda. Setelah koreksi debit, minggu 11 = 200 unit (z ≈ 4,4) dan minggu 12 = 167 unit (z ≈ 2,0) — keduanya masih di atas ambang siaga μ+2σ = 166,4. Kasus RS yang rendah justru KONSISTEN dengan keunggulan WBE: sinyal air limbah mendahului kasus klinis, dan banyak infeksi tidak sampai ke RS. (2) Pertahankan status siaga: testing terarah di kelurahan hulu IPAL, pastikan stok reagen, siapkan komunikasi publik berbasis angka ternormalisasi — bukan angka mentah. (3) Dengan data mentah, tim akan melihat “penurunan” 410 → 300 → 240 dan mengumumkan perbaikan — tepat saat sinyal yang benar masih menyala. Itu bukan sekadar salah baca grafik; itu keputusan mencabut kewaspadaan di tengah wabah.",
        "Catatan konteks: program seperti NWSS membuktikan WBE bisa menjadi infrastruktur peringatan dini nasional — tetapi komentar RAND (April 2025) mengingatkan sisi rapuhnya: pendanaan federal AS berisiko habis September 2025. Infrastruktur termurah per kapita ternyata paling mudah dipangkas karena manfaatnya tidak terlihat — sampai wabah berikutnya datang tanpa aba-aba.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan paling berbahaya di sini bukan salah hitung z-score — melainkan salah membaca data mentah sebagai kabar baik. Analis yang menulis “konsentrasi turun, wabah mereda” dalam memo resmi ikut bertanggung jawab atas keterlambatan respons. Tulis yang jujur: “konsentrasi mentah turun AKIBAT hujan; setelah normalisasi sinyal masih di atas ambang; rekomendasi: pertahankan siaga.”",
      },
      reference: "Jawab dengan angka ternormalisasi, bukan angka mentah. Kasus RS rendah ≠ wabah reda saat WBE masih menyala.",
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
        "WBE = surveilans komunal dari air limbah: menangkap infeksi asimtomatik/tidak dites, mendahului kasus klinis 3–7 hari, murah per kapita — tetapi buta terhadap individu.",
        "Beban per kapita = (C × Q) / P; yang bermakna adalah perubahannya terhadap baseline kota yang sama, bukan angka absolutnya.",
        "Normalisasi (koreksi debit atau rasio PMMoV) menghapus pengaruh cuaca dari data — tanpanya, analis membaca laporan cuaca, bukan laporan wabah.",
        "Ambang siaga: z = (x − μ)/σ terhadap baseline; z > 2 = waspada, z > 2 dua minggu berturut-turut (atau z > 3) = siaga + verifikasi operasional sebelum eskalasi.",
        "Aturan komunikasi: umumkan selalu angka ternormalisasi; jangan hentikan sampling saat tenang — keheningan data hari ini adalah kebutaan minggu depan.",
      ],
      quiz: [
        {
          q: "Keunggulan utama WBE dibanding surveilans klinis konvensional?",
          options: [
            { text: "Menangkap seluruh komunitas termasuk yang asimptomatik/tidak dites, lebih awal, dan lebih murah per kapita", why: "Benar: satu sampel mewakili puluhan ribu orang tanpa perlu mereka datang dites — shedding dimulai sebelum gejala, tanpa antrean tes.", correct: true },
            { text: "Bisa mendiagnosis individu yang terinfeksi untuk dikarantina", why: "Salah: WBE buta individu — ia tahu “sesuatu naik di wilayah ini”, bukan siapa yang sakit. Diagnosis individu tetap butuh tes klinis." },
            { text: "Memberi jumlah kasus pasti tanpa perlu kalibrasi", why: "Salah: konsentrasi tidak sama dengan jumlah kasus; butuh kalibrasi terhadap data klinis untuk estimasi beban, dan kalibrasinya tidak stabil antar-waktu." },
            { text: "Tidak memerlukan analisis data sama sekali", why: "Salah: justru sebaliknya — angka mentah tidak bermakna tanpa normalisasi debit, baseline, dan ambang. Tanpa analitik, WBE hanya arsip mahal." },
          ],
        },
        {
          q: "C = 150 gc/L, Q = 80 juta L/hari, P = 200.000 jiwa. Beban per kapita?",
          options: [
            { text: "60.000 gc/orang/hari", why: "Benar: 150 × 80.000.000 / 200.000 = 60.000. Ingat: angka ini baru bermakna dibanding baseline kota yang sama.", correct: true },
            { text: "150 gc/orang/hari", why: "Salah: itu konsentrasi per liter air, bukan per orang. Tanpa dikali debit dan dibagi populasi, satuannya salah." },
            { text: "30.000 gc/orang/hari", why: "Salah: hasil keliru membagi — cek lagi: 150 × 80.000.000 = 12 miliar; dibagi 200.000 = 60.000." },
            { text: "Tidak bisa dihitung tanpa data PMMoV", why: "Salah: rumus beban per kapita hanya butuh C, Q, P. PMMoV adalah metode normalisasi alternatif, bukan syarat rumus ini." },
          ],
        },
        {
          q: "Hujan deras: konsentrasi mentah turun 40%, debit naik 2× lipat. Kesimpulan yang benar?",
          options: [
            { text: "Tidak bisa disimpulkan sebelum normalisasi — penurunan mentah kemungkinan besar artefak pengenceran", why: "Benar: inilah jebakan minggu 11–12 di lab. Debit 2× lipat mengencerkan konsentrasi; sinyal asli bisa tetap sama atau bahkan naik.", correct: true },
            { text: "Wabah mereda — konsentrasi turun", why: "Salah: membaca data mentah sebagai kabar baik tanpa koreksi cuaca adalah kesalahan paling mahal di WBE." },
            { text: "Wabah memburuk — debit naik berarti lebih banyak virus", why: "Salah: debit naik berarti lebih banyak AIR, bukan lebih banyak virus. Jangan menafsirkan volume air sebagai beban penyakit." },
            { text: "Data minggu ini harus dibuang", why: "Salah: data hujan tetap berguna SETELAH dinormalisasi — membuangnya berarti kehilangan satu minggu surveilans." },
          ],
        },
        {
          q: "Baseline μ = 138,4, σ = 14,0. Minggu ini x = 324,1 (ternormalisasi). Artinya?",
          options: [
            { text: "z ≈ 13,3 — jauh di atas ambang siaga; picu protokol verifikasi dan eskalasi", why: "Benar: (324,1−138,4)/14,0 ≈ 13,3. Ini bukan fluktuasi — tiga belas simpangan baku di atas normal.", correct: true },
            { text: "Naik 2,3× dari baseline — masih dalam batas wajar", why: "Salah: “kali lipat dari rata-rata” mengabaikan variabilitas latar. z-score-lah yang menentukan keganjilan, bukan rasio terhadap rata-rata." },
            { text: "324 orang terinfeksi minggu ini", why: "Salah: satuannya gc/L ternormalisasi, bukan jumlah orang. WBE tidak menghitung kepala." },
            { text: "Cukup catat — ambang siaga baru di z > 20", why: "Salah: ambang z > 20 tidak ada dasarnya; aturan praktis z > 2 (waspada) / z > 3 atau dua minggu (siaga) sudah memadai." },
          ],
        },
        {
          q: "Kapan WBE TIDAK cocok dipakai?",
          options: [
            { text: "Menentukan siapa yang harus dikarantina di sebuah asrama", why: "Benar: WBE buta individu. Untuk karantina per orang butuh testing individu — WBE hanya bisa bilang “lakukan testing terarah di asrama itu”.", correct: true },
            { text: "Memberi peringatan dini lonjakan di tingkat kota", why: "Salah: ini justru kasus penggunaan terbaik WBE — sinyal komunal mendahului data klinis." },
            { text: "Memantau tren saat testing klinis menurun", why: "Salah: ini keunggulan WBE — ia tidak bergantung pada kemauan orang untuk dites." },
            { text: "Melacak patogen yang jarang terdeteksi klinis seperti H5N1", why: "Salah: contoh nyata (dilaporkan StatNews Maret 2025) — air limbah melacak H5N1 saat surveilans klinis nyaris buta." },
          ],
        },
      ],
    },
  ],
};
