import type { V2Lesson } from "../lib/types";

// ── Figure: PSI tiga peristiwa exon-skipping, dua kondisi ─────────────────
const PSI_SVG = `<svg viewBox="0 0 560 280" role="img" aria-label="Diagram batang PSI tiga peristiwa splicing pada dua kondisi">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="48" y1="230.0" x2="520" y2="230.0"/>
<line x1="48" y1="180.0" x2="520" y2="180.0"/>
<line x1="48" y1="130.0" x2="520" y2="130.0"/>
<line x1="48" y1="80.0" x2="520" y2="80.0"/>
<line x1="48" y1="30.0" x2="520" y2="30.0"/>
</g><g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="42" y="234.0">0</text>
<text x="42" y="134.0">0.5</text>
<text x="42" y="34.0">1.0</text>
</g><g>
<rect x="82.6" y="70.0" width="39.3" height="160.0" fill="var(--c1)" opacity="0.9"/>
<rect x="131.4" y="170.0" width="39.3" height="60.0" fill="var(--c3)" opacity="0.9"/>
<text x="102.3" y="62.0" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">0.8</text>
<text x="151.1" y="162.0" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">0.3</text>
<text x="126.7" y="246" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">SE1</text>
<rect x="239.9" y="130.0" width="39.3" height="100.0" fill="var(--c1)" opacity="0.9"/>
<rect x="288.7" y="120.0" width="39.3" height="110.0" fill="var(--c3)" opacity="0.9"/>
<text x="259.6" y="122.0" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">0.5</text>
<text x="308.4" y="112.0" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">0.55</text>
<text x="284.0" y="246" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">SE2</text>
<rect x="397.3" y="50.0" width="39.3" height="180.0" fill="var(--c1)" opacity="0.9"/>
<rect x="446.1" y="60.0" width="39.3" height="170.0" fill="var(--c3)" opacity="0.9"/>
<text x="416.9" y="42.0" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">0.9</text>
<text x="465.7" y="52.0" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">0.85</text>
<text x="441.3" y="246" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">SE3</text>
</g>
<g font-size="11" font-family="var(--font-ui)"><rect x="48" y="8" width="12" height="12" fill="var(--c1)"/><text x="66" y="18" fill="var(--text)">kondisi 1</text><rect x="158" y="8" width="12" height="12" fill="var(--c3)"/><text x="176" y="18" fill="var(--text)">kondisi 2</text></g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)"><text x="48" y="260">peristiwa exon-skipping (data sintetis)</text></g></svg>`;

export const bi24: V2Lesson = {
  slug: "bi24-alternative-splicing",
  track: "Bioinformatika",
  module: "NGS & Statistik",
  title: "Alternative Splicing: Satu Gen, Banyak Wajah",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Lalat buah yang mempermalukan manusia",
      prose: [
        "Manusia punya sekitar 20.000 gen protein-coding. Cacing tanah (C. elegans) punya sekitar 20.000 juga. Selama puluhan tahun ini jadi teka-teki memalukan: kalau jumlah gen menentukan kompleksitas, kenapa kita tidak jauh lebih “genetik” dari cacing? Jawabannya bukan pada jumlah gen — melainkan pada apa yang terjadi SETELAH gen dibaca.",
        "Masuklah lalat buah Drosophila dan gennya yang bernama Dscam. Satu gen ini, lewat alternative splicing, berpotensi menghasilkan 38.016 isoform protein berbeda — hampir dua kali lipat seluruh jumlah gen manusia, dari SATU gen. Tiap isoform dipakai neuron yang berbeda untuk “mengenali diri sendiri” saat kabel otak disambung. Twist-nya: dogma lama “satu gen = satu protein” bukan sekadar penyederhanaan — ia salah arah. Kompleksitas biologi tidak ditulis dalam jumlah gen, melainkan dalam KOPERASI potongan gen.",
        "Dan inilah jebakan analitiknya: pipeline RNA-seq standar mengukur ekspresi per GEN — ia menjumlahkan semua isoform menjadi satu angka. Bila kondisi A memakai isoform X dan kondisi B memakai isoform Y dari gen yang sama, total bacaannya bisa IDENTIK — gennya “tidak differentially expressed”, tetapi biologinya berubah total. Lesson ini tentang apa yang tidak terlihat oleh penghitungan per gen.",
      ],
      tasks: [],
      note: {
        title: "Batas lesson ini — baca dulu",
        type: "risk",
        body: "Analisis DIFFERENTIAL EXPRESSION (DE): gen mana yang naik/turun ekspresinya antar-kondisi (DESeq2, normalisasi, FDR). Lesson INI tidak mengulang itu — ia membahas DIFFERENTIAL SPLICING: isoform mana yang DIPILIH antar-kondisi, pada gen yang ekspresi totalnya bisa tetap sama. Metriknya berbeda (PSI, bukan fold change), tool-nya berbeda (rMATS/DEXSeq, bukan DESeq2), dan pertanyaannya berbeda (“bentuk protein apa?” bukan “berapa banyak?”). Keduanya komplementer: analisis RNA-seq yang lengkap memeriksa keduanya.",
      },
      reference: "DE = berapa BANYAK tiap gen (ekspresi). DS = bentuk APA tiap gen (isoform). Keduanya bisa berubah independen.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan lima tipe alternative splicing dan cara spliceosome memilihnya; (2) menghitung PSI dari junction read dan menafsirkan ΔPSI antar-kondisi; (3) membedakan differential splicing dari differential expression — dan menjelaskan kapan keduanya berpisah; (4) memilih tool yang tepat (rMATS, DEXSeq, long-read isoform) untuk tiap pertanyaan splicing.",
        "Rutenya: cerita + batas lesson → bekal ringkas → tiga konsep inti (tipe splicing, PSI, tool DS-vs-DE) → lab Pyodide (kalkulator PSI) → chart PSI dengan panduan baca → peta keputusan → mini-case kanker → kuis → rangkuman. Estimasi 50 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, dari biologi molekuler: gen ditranskripsi menjadi pre-mRNA (ekson = bagian yang dipakai, intron = bagian yang dibuang), lalu diterjemahkan menjadi protein — dogma sentral DNA → RNA → protein. Kedua, dari RNA-seq: read disekuens dari RNA, dipetakan ke genom, lalu DIHITUNG per gen untuk uji differential expression (apakah gen ini lebih aktif di kondisi A vs B?). Yang TIDAK dilakukan pipeline standar: memeriksa APAKAH ekson-eksonnya dirangkai berbeda — dan itulah lubang yang ditutup lesson ini.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap gen sebagai kalimat, ekson sebagai kata. Differential expression menghitung “berapa kali kalimat ini diucapkan”; alternative splicing bertanya “kata-kata mana yang DIPILIH tiap kali diucapkan”. Kalimat yang sama seringnya diucapkan bisa berarti hal yang berbeda.",
      ],
      reference: "Bekal: (1) pre-mRNA = ekson + intron; (2) RNA-seq standar menghitung per gen (DE) — tidak melihat pilihan ekson.",
    },
    {
      id: "konsep-tipe",
      eyebrow: "Langkah 3 · Konsep",
      title: "Spliceosome — Si Editor Film",
      prose: [
        "Definisi: splicing adalah pemotongan intron dan penyambungan ekson dari pre-mRNA oleh spliceosome (kompleks RNA-protein raksasa). ALTERNATIVE splicing terjadi ketika spliceosome memilih kombinasi ekson yang berbeda dari gen yang sama. Lima tipe utama: (1) exon skipping — ekson dilewati (kaset ekson masuk/keluar); (2) intron retention — intron TIDAK dibuang (umum di tumbuhan, pengatur di hewan); (3) alternative 5′ splice site — batas awal ekson bergeser; (4) alternative 3′ splice site — batas akhir ekson bergeser; (5) mutually exclusive exons — dari sepasang ekson, tepat satu yang dipakai.",
        "Kepribadiannya: spliceosome adalah editor film dengan lima gaya potongan — dan pilihan potongannya diatur oleh protein regulator (SR protein sebagai “penyambung”, hnRNP sebagai “pemutus”) yang menanggapi sinyal sel: jaringan, tahap perkembangan, stres, penyakit. Satu gen dengan 10 ekson kaset teoretis punya 2¹⁰ = 1.024 kombinasi — tidak semuanya dipakai, tetapi ruang kemungkinannya menjelaskan kenapa ~95% gen multi-ekson manusia mengalami alternative splicing.",
        "Kapan memakai: klasifikasi tipe penting karena tiap tipe dibaca dari pola junction read yang berbeda — exon skipping terlihat dari read yang “melompati” ekson (junction ekson 1→3), intron retention dari read yang menutupi intron. Salah mengklasifikasi tipe = salah menghitung PSI.",
      ],
      formula: String.raw`\text{isoform potensial} = 2^{n} \quad (n = \text{jumlah ekson kaset})`,
      formulaNote: "n = jumlah ekson yang bisa masuk/keluar secara independen. Contoh: 3 ekson kaset → 2³ = 8 isoform potensial. Interpretasi: pertumbuhan EKSPONENSIAL — inilah matematika di balik Dscam (38.016 isoform): belasan ekson yang saling eksklusif di beberapa klaster, dikombinasikan. Praktiknya tidak semua kombinasi dipakai sel, tetapi ruangnya nyata dan terukur.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Splicing cuma buang intron — hasilnya selalu sama”",
        type: "pitfall",
        body: "Yang benar: splicing KONSTITUTIF (selalu sama) hanyalah kasus khusus. Pada ~95% gen multi-ekson manusia, spliceosome membuat PILIHAN — dan pilihannya berbeda antar-jaringan (otak vs hati), antar-waktu (embrio vs dewasa), dan antar-kondisi (sehat vs kanker). Menganggapnya deterministik berarti melewatkan satu lapisan regulasi terbesar dalam biologi.",
      },
      hints: [
        "💡 Intuisi: hafalkan lima tipenya lewat gambar mental — skipping = lompat, retention = lupa buang, alt 5′/3′ = geser batas, mutually exclusive = pilih satu dari dua. 90% soal splicing praktis adalah exon skipping.",
      ],
      reference: "5 tipe: skipping, retention, alt-5′, alt-3′, mutually exclusive. Pilihan diatur protein regulator per konteks sel.",
    },
    {
      id: "konsep-psi",
      eyebrow: "Langkah 4 · Konsep",
      title: "PSI — Si Pengukur Proporsi",
      prose: [
        "Definisi: PSI (Percent Spliced In, dinotasikan Ψ) mengukur fraksi transkrip yang MEMASUKKAN ekson tertentu: PSI = I/(I + E), dengan I = read inklusi (mendukung ekson dipakai — mis. junction 1→2 dan 2→3) dan E = read eksklusi (junction 1→3 yang melompati). PSI = 0,8 berarti 80% transkrip memakai ekson itu. Untuk perbandingan kondisi: ΔPSI = PSI_kondisi2 − PSI_kondisi1; |ΔPSI| > 0,1 (10 poin persen) adalah ambang praktis “perubahan biologis menarik” — dengan uji statistik (Fisher/GLM pada hitungan junction, dikoreksi FDR) untuk memastikan bukan noise sampling.",
        "Kepribadiannya: PSI adalah jajak pendapat di antara transkrip — “berapa persen dari kalian memakai ekson ini?”. Ia tidak peduli gennya naik atau turun secara total (itu urusan DE); ia hanya menghitung PROPORSINYA. Itulah kekuatannya: ia bisa mendeteksi perubahan total pada gen yang “tidak DE”. Dan itulah syaratnya: butuh read yang MELEWATI junction (split read) — read yang jatuh di tengah ekson tidak memberi informasi inklusi/eksklusi.",
        "Kapan memakai: PSI adalah bahasa standar laporan splicing (rMATS melaporkannya langsung). JANGAN menafsirkan ΔPSI tanpa melihat kedalaman junction: ΔPSI 0,5 dari total 10 read jauh lebih meragukan daripada ΔPSI 0,15 dari 1.000 read — proporsi tanpa penyebut adalah gosip.",
      ],
      formula: String.raw`\Psi = \frac{I}{I + E} \qquad \Delta\Psi = \Psi_2 - \Psi_1`,
      formulaNote: "I = jumlah read inklusi (junction yang mencakup ekson); E = jumlah read eksklusi (junction yang melompati). Contoh: I = 80, E = 20 → PSI = 0,8. Kondisi 2: I = 30, E = 70 → PSI = 0,3; ΔPSI = −0,5 — penurunan 50 poin persen, perubahan splicing yang besar. Interpretasi: PSI menjawab “seberapa sering”, ΔPSI menjawab “seberapa berubah” — dan keduanya butuh uji statistik atas hitungan mentahnya, bukan sekadar selisih.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Gen ini tidak DE, jadi tidak ada yang berubah”",
        type: "pitfall",
        body: "Yang benar: gen bisa mempertahankan total ekspresi sambil MENGGANTI isoformnya — mis. dari isoform pro-apoptosis ke anti-apoptosis pada kanker. Pipeline DE-only akan melaporkan “tidak ada temuan” sementara biologinya jungkir balik. Inilah alasan analisis RNA-seq modern memeriksa DE DAN DS — keduanya adalah sumbu perubahan yang independen.",
      },
      hints: [
        "💡 Intuisi: DE = volume suara; DS = nada suara. Gen yang volumenya sama bisa menyanyikan nada yang sama sekali berbeda. Analis yang hanya mengukur volume tuli terhadap melodi.",
      ],
      reference: "PSI = I/(I+E); ΔPSI = selisih antar-kondisi; butuh uji statistik atas hitungan junction, bukan cuma selisih.",
    },
    {
      id: "konsep-tool",
      eyebrow: "Langkah 5 · Konsep",
      title: "rMATS, DEXSeq & Long-Read — Si Pembeda",
      prose: [
        "Definisi: tiga keluarga tool untuk pertanyaan berbeda. (a) rMATS: berbasis junction — menguji ΔPSI per PERISTIWA splicing (tiap exon skipping satu uji), cepat dan standar untuk short-read; (b) DEXSeq: berbasis exon usage — menguji apakah tiap ekson dipakai secara tidak proporsional relatif terhadap gennya (model GLM binomial negatif), bagus untuk pola kompleks; (c) long-read isoform (PacBio Iso-Seq, ONT): membaca transkrip FULL-LENGTH — tidak menebak kombinasi ekson dari potongan, melainkan MELIHAT isoform utuhnya, termasuk isoform baru yang tak ada di anotasi.",
        "Kepribadiannya: rMATS adalah akuntan junction — teliti per peristiwa, tetapi buta terhadap kombinasi jarak jauh (“ekson 2 diskip BERSAMAAN dengan ekson 7 dipakai?” — short-read tidak bisa menjawab karena read-nya terlalu pendek untuk mencakup keduanya). Long-read adalah saksi mata — ia melihat seluruh transkrip sekaligus, mengakhiri tebak-tebakan. Harganya: throughput dan biaya per basa masih kalah dari short-read.",
        "Kapan memakai: skrining genome-wide short-read → rMATS/DEXSeq untuk daftar kandidat ΔPSI; validasi dan karakterisasi isoform baru → long-read. Untuk pertanyaan “isoform APA SAJA yang ada di sampel ini?” (bukan “berubah berapa?”), long-read bukan pilihan — ia satu-satunya jawaban yang jujur.",
      ],
      formula: String.raw`\text{probabilitas fase benar dari short-read} \approx \prod \text{(peluang tiap junction)} \ll 1`,
      formulaNote: "Bukan rumus baku tool — melainkan intuisi matematikanya: menebak kombinasi 5 peristiwa splicing independen dari short-read berarti mengalikan ketidakpastian tiap tebakan — hasilnya runtuh cepat. Long-read tidak menebak: satu read = satu isoform utuh. Interpretasi: short-read sangat baik untuk “apakah peristiwa ini berubah?” (peristiwa tunggal, terukur), tetapi buruk untuk “kombinasi lengkapnya apa?” — pilih tool sesuai pertanyaan.",
      tasks: [],
      hints: [
        "💡 Intuisi: pasangkan tool dengan pertanyaan — “ΔPSI gen X?” → rMATS; “pola exon usage kompleks?” → DEXSeq; “isoform utuh apa saja?” → long-read. Tool yang salah untuk pertanyaan yang benar tetap memberi jawaban yang salah.",
      ],
      note: {
        title: "Intuisi: splicing adalah sumbu perubahan yang independen dari ekspresi",
        body: "Analis splicing menyimpan lima heuristik. Satu: “tidak DE” bukan “tidak berubah” — pipeline per-gen menjumlahkan semua isoform; gen yang berganti isoform total (BCL2L1: Bcl-xL → Bcl-xS) terlihat “tidak berubah” padahal fungsinya berbalik; selalu uji differential splicing sebelum menyimpulkan tidak ada apa-apa. Dua: ΔPSI tanpa penyebut adalah gosip — ΔPSI 0,5 dari 10 junction read jauh lebih meragukan daripada ΔPSI 0,15 dari 1.000 read; proporsi butuh kedalaman untuk dipercaya. Tiga: pilih tool sesuai pertanyaan — “peristiwa apa yang berubah?” (skrining genome-wide) → rMATS/DEXSeq pada short-read; “kombinasi ekson lengkapnya apa?” → long-read, satu-satunya jawaban jujur; short-read menebak kombinasi, long-read melihatnya. Empat: intron retention massal = curigai artefak dulu — retensi intron yang tiba-tiba muncul di ratusan gen sering berarti kontaminasi DNA genomik atau pre-mRNA, bukan biologi; cek dengan kontrol yang tepat sebelum merayakan. Lima: isoform butuh bukti protein — transkrip alternatif belum tentu diterjemahkan menjadi protein stabil (NMD bisa menghancurkannya); klaim fungsional butuh validasi di level protein. Heuristik gabungannya: analisis RNA yang berhenti di DE adalah analisis yang setengah buta — dan di kanker, kebutaan itu bisa berarti melewatkan mekanisme resistensi obat.",
      },
      reference: "rMATS = per peristiwa (short-read); DEXSeq = exon usage; long-read = isoform utuh, satu-satunya cara melihat kombinasi.",
    },
    {
      id: "lab-psi",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Kalkulator PSI",
      prose: [
        "Waktunya jadi analis splicingnya. Di bawah ada 3 peristiwa exon-skipping sintetis dengan hitungan junction (I = inklusi, E = eksklusi) pada dua kondisi. Tugasmu: tulis tiga fungsi — `psi(I, E)`, `dpsi(ev)` (selisih PSI kondisi 2 − kondisi 1), dan `signifikan(ev)` (True bila |ΔPSI| > 0,1) — lalu jalankan.",
        "Coba: setelah lolos, ubah ambang menjadi 0,2. Peristiwa mana yang gugur? Itulah trade-off analis: ambang longgar menangkap lebih banyak kandidat (termasuk noise), ambang ketat hanya yang besar (melewatkan yang sedang tapi nyata).",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `psi(I, E)`: kembalikan `I / (I + E)`" },
        { id: "t2", text: "Lengkapi `dpsi(ev)`: `psi(I2, E2) − psi(I1, E1)`" },
        { id: "t3", text: "Lengkapi `signifikan(ev)`: True bila `abs(dpsi) > 0.1`" },
        { id: "t4", text: "Jalankan dan pastikan tiga baris ringkasan tercetak" },
      ],
      expected: "SE1: PSI1=0.80 PSI2=0.30 dPSI=-0.50 signifikan=True\nSE2: PSI1=0.50 PSI2=0.55 dPSI=0.05 signifikan=False\nSE3: PSI1=0.90 PSI2=0.85 dPSI=-0.05 signifikan=False",
      hints: [
        "ev adalah dict dengan kunci I1, E1, I2, E2.",
        "Format cetak: `f\"{ev['id']}: PSI1={p1:.2f} PSI2={p2:.2f} dPSI={d:.2f} signifikan={s}\"` — boolean tercetak True/False.",
      ],
      code: {
        starter: `# 3 peristiwa exon-skipping SINTETIS (bukan data RNA-seq asli)
events = [
    {"id": "SE1", "I1": 80, "E1": 20, "I2": 30, "E2": 70},
    {"id": "SE2", "I1": 50, "E1": 50, "I2": 55, "E2": 45},
    {"id": "SE3", "I1": 90, "E1": 10, "I2": 85, "E2": 15},
]

# TULIS KODEMU: tiga fungsi di bawah ini
def psi(I, E):
    return

def dpsi(ev):
    return

def signifikan(ev):
    return

for ev in events:
    p1 = psi(ev["I1"], ev["E1"])
    p2 = psi(ev["I2"], ev["E2"])
    d = dpsi(ev)
    s = signifikan(ev)
    print(f"{ev['id']}: PSI1={p1:.2f} PSI2={p2:.2f} dPSI={d:.2f} signifikan={s}")`,
        lockLines: 7,
        solution: `# 3 peristiwa exon-skipping SINTETIS (bukan data RNA-seq asli)
events = [
    {"id": "SE1", "I1": 80, "E1": 20, "I2": 30, "E2": 70},
    {"id": "SE2", "I1": 50, "E1": 50, "I2": 55, "E2": 45},
    {"id": "SE3", "I1": 90, "E1": 10, "I2": 85, "E2": 15},
]

# TULIS KODEMU: tiga fungsi di bawah ini
def psi(I, E):
    return I / (I + E)

def dpsi(ev):
    return psi(ev["I2"], ev["E2"]) - psi(ev["I1"], ev["E1"])

def signifikan(ev):
    return abs(dpsi(ev)) > 0.1

for ev in events:
    p1 = psi(ev["I1"], ev["E1"])
    p2 = psi(ev["I2"], ev["E2"])
    d = dpsi(ev)
    s = signifikan(ev)
    print(f"{ev['id']}: PSI1={p1:.2f} PSI2={p2:.2f} dPSI={d:.2f} signifikan={s}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "SE1: PSI1=0\\.80 PSI2=0\\.30", label: "PSI SE1 benar (0,80 → 0,30)", msg: "80/100 = 0,8; 30/100 = 0,3." },
          { kind: "stdout_matches", task: "t2", pattern: "dPSI=-0\\.50", label: "ΔPSI SE1 = −0,50", msg: "0,3 − 0,8 = −0,5 — penurunan inklusi 50 poin persen." },
          { kind: "stdout_matches", task: "t3", pattern: "SE1:.*signifikan=True", label: "SE1 signifikan", msg: "|−0,5| > 0,1 → True." },
          { kind: "stdout_matches", task: "t3", pattern: "SE2:.*signifikan=False", label: "SE2 tidak signifikan", msg: "|0,05| < 0,1 → False. SE3 juga False (|−0,05|)." },
        ],
      },
      reference: "PSI = I/(I+E); |ΔPSI| > 0,1 = ambang praktis; selalu sertai uji statistik pada data nyata.",
    },
    {
      id: "chart-psi",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca batang PSI seperti biolog molekuler",
      prose: [
        "Chart di bawah memplot hasil lab-mu: PSI tiga peristiwa pada dua kondisi (biru = kondisi 1, oranye = kondisi 2).",
        "Cara membaca: sumbu Y = PSI (0 = ekson selalu dilewati, 1 = selalu dipakai); tiap peristiwa punya dua batang berdampingan; selisih tinggi = ΔPSI.",
        "Interpretasi: SE1 adalah temuan chart ini — batangnya runtuh dari 0,8 ke 0,3 (ΔPSI −0,5): pada kondisi 2, ekson ini sebagian besar DILEWATI. Bila ekson itu mengkode domain protein penting, fungsinya berubah drastis — tanpa perubahan ekspresi total gen. SE2 (0,50 → 0,55) dan SE3 (0,90 → 0,85) nyaris tidak bergerak: fluktuasi biasa, bukan sinyal. Pelajaran: mata analis splicing terlatih melihat SELISIH ANTAR-BATANG, bukan tinggi batang — dan bertanya “apakah selisih ini nyata?” (uji statistik) sebelum “apakah ini penting?” (biologi).",
      ],
      figure: {
        svg: PSI_SVG,
        alt: "Diagram batang PSI: SE1 turun 0,8 ke 0,3; SE2 0,5 ke 0,55; SE3 0,9 ke 0,85. Dua kondisi berdampingan.",
        caption: "PSI tiga peristiwa exon-skipping pada dua kondisi (data sintetis). SE1 = perubahan besar.",
      },
      tasks: [],
      reference: "Lihat selisih antar-batang (ΔPSI), bukan tingginya. SE1 = sinyal; SE2/SE3 = noise.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Strategi splicing apa untuk pertanyaan apa?",
      prose: [
        "Lima skenario yang dihadapi analis RNA:",
        "Skenario 1 — Skrining genome-wide: peristiwa splicing apa yang berubah antara sehat vs sakit? → rMATS pada short-read + filter |ΔPSI| > 0,1 + FDR. Alasan: cepat, standar, dan memberi daftar kandidat berperingkat untuk validasi.",
        "Skenario 2 — Kandidat dari rMATS perlu validasi. → RT-PCR / qPCR isoform-spesifik (atau long-read terarah). Alasan: hitungan junction short-read adalah bukti tidak langsung — validasi ortogonal memisahkan sinyal dari artefak pemetaan.",
        "Skenario 3 — Pertanyaannya “isoform utuh apa saja yang diekspresikan jaringan ini?” → Long-read (Iso-Seq/ONT) + anotasi isoform baru. Alasan: satu-satunya cara jujur melihat kombinasi ekson lengkap; short-read hanya menebak.",
        "Skenario 4 — Gen tidak DE tetapi dicurigai berubah fungsi. → Uji DS dulu (rMATS/DEXSeq) SEBELUM menyimpulkan “tidak ada apa-apa”. Alasan: inilah lubang analisis DE per-gen — sumbu perubahan yang independen dari ekspresi total.",
        "Skenario 5 — Intron retention tinggi di banyak gen. → Curigai ARTEFAK dulu: kontaminasi DNA genomik atau pre-mRNA yang belum selesai diproses — cek dengan kontrol (mis. perbandingan dengan fraksi nuklear vs sitoplasmik). Alasan: intron retention adalah temuan biologis yang nyata SEKALIGUS artefak persiapan sampel yang paling umum — bedakan sebelum merayakan.",
        "Aturan praktis 10 detik: ΔPSI? → rMATS. Kombinasi utuh? → long-read. Tidak DE? → tetap cek DS. Intron retention massal? → curigai artefak dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Melaporkan ΔPSI besar dari total 12 junction read sebagai “temuan utama”. Proporsi dari penyebut mungil adalah gosip — selalu sertakan kedalaman dan uji statistik. Aturan meja: tidak ada klaim splicing tanpa (1) |ΔPSI| bermakna, (2) uji signifikan, (3) replikasi/validasi.",
      },
      reference: "Pasangkan tool dengan pertanyaan; validasi kandidat; curigai artefak pada intron retention massal.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Gen apoptosis yang “tidak berubah”",
      prose: [
        "Skenario (sintetis, untuk latihan): tim onkologi membandingkan RNA-seq tumor vs jaringan normal (n = 6 vs 6). Gen BCL2L1 — regulator apoptosis terkenal — TIDAK masuk daftar DE (fold change 1,05; FDR 0,62): “tidak berubah”, tulis laporan awal. Seorang analis splicing iseng menjalankan rMATS dan menemukan exon skipping pada ekson 2: PSI normal = 0,85, PSI tumor = 0,25 (ΔPSI = −0,6; FDR < 0,001; didukung ratusan junction read per sampel). Literatur: ekson 2 membedakan isoform Bcl-xL (anti-apoptosis, panjang) dari Bcl-xS (pro-apoptosis, pendek).",
        "Pertanyaan analisis: (1) Apa yang sebenarnya terjadi pada gen ini? (2) Kenapa pipeline DE melewatkannya? (3) Implikasi terapinya?",
        "Pembahasan: (1) Tumor mengganti isoform: dari 85% Bcl-xL menjadi hanya 25% — mayoritas beralih ke Bcl-xS yang pro-apoptosis... tunggu, itu justru BAGUS untuk pasien? Di sinilah biologi menuntut kehati-hatian: arah yang menguntungkan ini perlu verifikasi protein (apakah isoform pendeknya stabil diterjemahkan?) — tetapi yang pasti, gen ini JAUH dari “tidak berubah”. (2) DE menjumlahkan semua isoform: total bacaan gen tetap karena yang berubah hanya KOMPOSISINYA — seperti restoran yang pengunjungnya sama banyak tetapi menunya berganti total. (3) Implikasi: bila validasi protein mengonfirmasi, tumor ini mungkin lebih rentan terhadap kemoterapi pemicu apoptosis — sebuah hipotesis terapi yang lahir BUKAN dari daftar DE, melainkan dari analisis splicing. Dan sebaliknya — bila arahnya ke isoform anti-apoptosis, itu menjelaskan resistensi.",
        "Pelajaran: “tidak DE” ≠ “tidak penting”. Analisis yang berhenti di DE adalah analisis yang setengah buta — dan di kanker, kebutaan itu bisa berarti melewatkan mekanisme resistensi obat.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko analitik: laporan “tidak ada gen apoptosis yang berubah” memberi rasa aman palsu pada tim terapi — sementara peralihan isoform diam-diam mengubah respons obat. Di farmakogenomik dan onkologi presisi, keputusan terapi berbasis profil molekuler yang setengah (DE saja) adalah keputusan dengan informasi yang hilang.",
      },
      reference: "DE menjumlahkan isoform; DS melihat komposisinya. Keduanya sumbu independen — periksa keduanya.",
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
        "Alternative splicing: spliceosome memilih kombinasi ekson berbeda (5 tipe) — ~95% gen multi-ekson manusia mengalaminya; kompleksitas dari kombinasi, bukan jumlah gen.",
        "PSI = I/(I+E) mengukur fraksi inklusi ekson; ΔPSI = selisih antar-kondisi; |ΔPSI| > 0,1 + uji statistik = ambang praktis.",
        "Differential splicing ≠ differential expression: gen bisa berganti isoform total tanpa berubah ekspresi — periksa keduanya.",
        "rMATS = uji per peristiwa (short-read); DEXSeq = exon usage; long-read = satu-satunya cara jujur melihat isoform utuh + kombinasi jarak jauh.",
        "Waspada: ΔPSI dari junction read sedikit = gosip; intron retention massal = curigai artefak dulu; validasi kandidat secara ortogonal.",
      ],
      next: { label: "BI25 · Indeks dan Aligner: BWT, FM-Index, dan Cara Kerja BWA/Bowtie", href: "/v2/learn/bi25-indeks-aligner" },
      quiz: [
        {
          q: "I = 30, E = 70 pada kondisi A; I = 80, E = 20 pada kondisi B. ΔPSI (B − A)?",
          options: [
            { text: "0,5 — dari 0,3 ke 0,8: peningkatan inklusi 50 poin persen", why: "Benar: PSI_A = 30/100 = 0,3; PSI_B = 80/100 = 0,8; ΔPSI = 0,5. Arahnya: ekson makin SERING dipakai di B.", correct: true },
            { text: "−0,5", why: "Salah: urutan pengurangannya B − A = 0,8 − 0,3 = +0,5. Tanda ΔPSI mengikuti urutan kondisi yang didefinisikan." },
            { text: "0,25", why: "Salah: kemungkinan keliru memakai I/E sebagai rasio (30/70) bukan proporsi I/(I+E). PSI selalu penyebut total." },
            { text: "Tidak bisa dihitung tanpa total ekspresi gen", why: "Salah: PSI justru TIDAK butuh total ekspresi — ia proporsi internal peristiwa itu. Itulah kelebihannya atas DE." },
          ],
        },
        {
          q: "Gen tidak DE (FDR 0,9) tetapi ΔPSI = −0,55 (FDR < 0,001) pada ekson pengkode domain kunci. Kesimpulan?",
          options: [
            { text: "Gen berubah fungsi lewat pergantian isoform — temuan nyata yang tidak terlihat oleh DE", why: "Benar: inilah kasus BCL2L1 di mini-case. Total bacaan tetap, komposisinya berubah — biologi yang berbeda dari gen “tidak berubah”.", correct: true },
            { text: "Abaikan — tidak DE berarti tidak penting", why: "Salah: tepat mitos yang dibantah lesson ini. DE dan DS adalah sumbu independen." },
            { text: "Hasilnya kontradiktif — salah satu analisis pasti salah", why: "Salah: tidak kontradiktif sama sekali — keduanya mengukur hal berbeda (jumlah vs komposisi) dan bisa berbeda arah dengan sah." },
            { text: "Naikkan stringency DE sampai gen ini signifikan", why: "Salah: memaksa ambang DE tidak akan memunculkan sinyal splicing — seperti mengeraskan volume untuk mendengar nada. Salah sumbu." },
          ],
        },
        {
          q: "Peneliti ingin tahu KOMBINASI ekson lengkap (isoform utuh) di jaringan otak. Pendekatan terbaik?",
          options: [
            { text: "Long-read sequencing (Iso-Seq/ONT) — satu read = satu isoform utuh", why: "Benar: hanya long-read yang melihat kombinasi jarak jauh secara langsung; short-read hanya menebak dari potongan dengan ketidakpastian perkalian.", correct: true },
            { text: "rMATS pada short-read — cukup untuk merekonstruksi isoform", why: "Salah: rMATS menguji peristiwa TUNGGAL dengan baik, tetapi tidak bisa memfase kombinasi antar-peristiwa yang jauh." },
            { text: "DESeq2 — isoform bisa diturunkan dari fold change", why: "Salah: DESeq2 mengukur jumlah per gen; ia tidak melihat pilihan ekson sama sekali." },
            { text: "Menambah depth short-read 10× lipat", why: "Salah: depth menambah ketelitian per peristiwa, bukan kemampuan memfase kombinasi — read-nya tetap pendek." },
          ],
        },
        {
          q: "Ditemukan intron retention tinggi di ratusan gen sekaligus. Langkah pertama?",
          options: [
            { text: "Curigai artefak (kontaminasi DNA genomik / pre-mRNA) dan verifikasi dengan kontrol sebelum klaim biologi", why: "Benar: intron retention massal adalah pola artefak klasik persiapan sampel. Klaim biologi tanpa menyingkirkan ini = fondasi pasir.", correct: true },
            { text: "Langsung publikasi sebagai regulasi global baru", why: "Salah: melompati verifikasi artefak untuk temuan sebesar ini adalah cara tercepat menuju retraksi." },
            { text: "Jalankan DESeq2 untuk konfirmasi", why: "Salah: DESeq2 tidak mengukur retensi intron — salah tool untuk pertanyaan ini." },
            { text: "Abaikan — intron retention tidak pernah bermakna biologis", why: "Salah: ia BISA bermakna (terutama regulasi di tumbuhan/hewan) — hanya saja harus disingkirkan artefaknya dulu." },
          ],
        },
        {
          q: "Dua peristiwa: X dengan ΔPSI 0,4 (total 20 junction read) vs Y dengan ΔPSI 0,15 (total 5.000 junction read). Mana temuan yang lebih meyakinkan?",
          options: [
            { text: "Y — didukung kedalaman; presisi mengalahkan besaran mentah", why: "Benar: ΔPSI 0,15 dari 5.000 read punya interval kepercayaan sempit; ΔPSI 0,4 dari 20 read bisa jadi fluktuasi sampling. Proporsi tanpa penyebut = gosip.", correct: true },
            { text: "X — efeknya hampir 3× lebih besar", why: "Salah: besaran tanpa presisi menipu — 20 read memberi rentang error yang menelan “efek besar” itu." },
            { text: "Keduanya sama meyakinkannya", why: "Salah: keyakinan statistik tumbuh dengan akar jumlah observasi, bukan dengan besaran efek." },
            { text: "Tidak bisa dibandingkan tanpa uji DE", why: "Salah: DE tidak relevan untuk pertanyaan ini — yang dibutuhkan adalah uji statistik atas hitungan junction (mis. Fisher/beta-binomial), bukan ekspresi total." },
          ],
        },
        {
          q: "Apa beda fokus differential expression vs differential splicing?",
          options: [
            { text: "DE = berapa banyak per gen (fold change); DS = isoform apa per gen (PSI)", why: "Benar: metrik (fold change vs PSI), tool (DESeq2 vs rMATS), dan pertanyaan (“berapa banyak?” vs “bentuk apa?”) berbeda — dua sumbu independen.", correct: true },
            { text: "DE untuk manusia, DS untuk tumbuhan", why: "Salah: keduanya umum untuk semua organisme dengan RNA-seq; bedanya sumbu analisis, bukan spesies." },
            { text: "DS menggantikan DE", why: "Salah: komplementer — analisis RNA-seq lengkap memeriksa DE dan DS; menghilangkan salah satunya membutakan setengah gambaran." },
            { text: "Tidak ada beda — splicing bagian dari DE", why: "Salah: pipeline DE standar menjumlahkan isoform dan tidak menguji pilihan ekson — splicing tidak tercakup di sana." },
          ],
        },
      ],
    },
  ],
};
