import type { V2Lesson } from "../lib/types";

// ── Figure: bar segmen RFM + heatmap retensi cohort (data lab, 8 pelanggan) ─
const SEG_COHORT_SVG = `<svg viewBox=\"0 0 560 340\" role=\"img\" aria-label=\"Diagram batang segmen RFM dan heatmap retensi cohort\">
<text x=\"20\" y=\"22\" font-size=\"13\" font-weight=\"700\" font-family=\"var(--font-ui)\" fill=\"var(--text)\">Segmen RFM (8 pelanggan)</text>
<g font-size=\"11\" font-family=\"var(--font-ui)\" fill=\"var(--text)\" text-anchor=\"end\">
<text x=\"104\" y=\"66\">Loyal</text><text x=\"104\" y=\"110\">New</text><text x=\"104\" y=\"154\">Hibernating</text>
<text x=\"104\" y=\"198\">Champions</text><text x=\"104\" y=\"242\">At Risk</text>
</g>
<g>
<rect x=\"112\" y=\"50\" width=\"120\" height=\"22\" fill=\"var(--c1)\" rx=\"3\"/>
<rect x=\"112\" y=\"94\" width=\"120\" height=\"22\" fill=\"var(--c1)\" rx=\"3\"/>
<rect x=\"112\" y=\"138\" width=\"120\" height=\"22\" fill=\"var(--c1)\" rx=\"3\"/>
<rect x=\"112\" y=\"182\" width=\"60\" height=\"22\" fill=\"var(--c2)\" rx=\"3\"/>
<rect x=\"112\" y=\"226\" width=\"60\" height=\"22\" fill=\"var(--chart-text)\" rx=\"3\"/>
</g>
<g font-size=\"11\" font-family=\"var(--font-ui)\" fill=\"var(--text)\">
<text x=\"238\" y=\"66\">2</text><text x=\"238\" y=\"110\">2</text><text x=\"238\" y=\"154\">2</text>
<text x=\"178\" y=\"198\">1</text><text x=\"178\" y=\"242\">1</text>
</g>
<text x=\"290\" y=\"22\" font-size=\"13\" font-weight=\"700\" font-family=\"var(--font-ui)\" fill=\"var(--text)\">Matriks retensi cohort</text>
<g font-size=\"10\" font-family=\"var(--font-ui)\" fill=\"var(--text-muted)\" text-anchor=\"middle\">
<text x=\"365\" y=\"42\">Bln ke-1</text><text x=\"435\" y=\"42\">Bln ke-2</text><text x=\"505\" y=\"42\">Bln ke-3</text>
</g>
<g font-size=\"10\" font-family=\"var(--font-ui)\" fill=\"var(--text)\" text-anchor=\"end\">
<text x=\"324\" y=\"76\">Kohor Jan</text><text x=\"324\" y=\"120\">Kohor Feb</text><text x=\"324\" y=\"164\">Kohor Mar</text>
</g>
<g stroke=\"var(--chart-grid)\" stroke-width=\"1\">
<rect x=\"330\" y=\"54\" width=\"68\" height=\"40\" fill=\"var(--c1)\" fill-opacity=\"1\"/>
<rect x=\"400\" y=\"54\" width=\"68\" height=\"40\" fill=\"var(--c1)\" fill-opacity=\"0.4\"/>
<rect x=\"470\" y=\"54\" width=\"68\" height=\"40\" fill=\"var(--c1)\" fill-opacity=\"0.4\"/>
<rect x=\"330\" y=\"98\" width=\"68\" height=\"40\" fill=\"none\"/>
<rect x=\"400\" y=\"98\" width=\"68\" height=\"40\" fill=\"var(--c1)\" fill-opacity=\"1\"/>
<rect x=\"470\" y=\"98\" width=\"68\" height=\"40\" fill=\"var(--c1)\" fill-opacity=\"0.06\"/>
<rect x=\"330\" y=\"142\" width=\"68\" height=\"40\" fill=\"none\"/>
<rect x=\"400\" y=\"142\" width=\"68\" height=\"40\" fill=\"none\"/>
<rect x=\"470\" y=\"142\" width=\"68\" height=\"40\" fill=\"var(--c1)\" fill-opacity=\"1\"/>
</g>
<g font-size=\"11\" font-family=\"var(--font-ui)\" text-anchor=\"middle\" fill=\"var(--text)\">
<text x=\"364\" y=\"78\">1,00</text><text x=\"434\" y=\"78\">0,40</text><text x=\"504\" y=\"78\">0,40</text>
<text x=\"434\" y=\"122\">1,00</text><text x=\"504\" y=\"122\">0,00</text>
<text x=\"504\" y=\"166\">1,00</text>
</g>
<g font-size=\"11\" font-family=\"var(--font-ui)\" text-anchor=\"middle\" fill=\"var(--text-muted)\">
<text x=\"364\" y=\"122\">–</text><text x=\"364\" y=\"166\">–</text><text x=\"434\" y=\"166\">–</text>
</g>
<g fill=\"var(--text-muted)\" font-size=\"10\" font-family=\"var(--font-ui)\">
<text x=\"20\" y=\"290\">retensi = % anggota kohor yang belanja di bulan ke-t</text>
<text x=\"20\" y=\"306\">sel kosong (–) = kohor belum punya masa depan sejauh itu</text>
<text x=\"430\" y=\"322\">data sintetis lab</text>
</g>
</svg>`;

export const a319: V2Lesson = {
  slug: "a319-rfm-cohort",
  track: "Statistika",
  module: "Analitik Pelanggan",
  title: "A319 — RFM & Cohort Analysis: Segmentasi dari Data Transaksi",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pelanggan Rp1,5 juta yang sudah mati — dan Rp120 ribu yang hidup",
      prose: [
        "Tim growth sebuah brand kopi D2C di Makassar membuka dashboard: pelanggan dengan total belanja terbesar sepanjang masa adalah Budi — Rp1,5 juta. Logikanya sederhana: orang yang sudah belanja paling banyak adalah yang paling berharga, jadi voucher loyalitas Rp100 ribu dikirim ke Budi dan kawan-kawannya sesama top spender. Hasilnya? Hampir tidak ada yang kembali. Budi terakhir belanja 73 hari yang lalu; voucher-nya kedaluwarsa tanpa dibuka.",
        "Twist-nya ada di baris bawah dashboard yang tidak dibaca siapa pun: Citra, total belanja hanya Rp120 ribu — satu pembelian, 7 hari yang lalu. Citra tidak dapat voucher apa pun karena \"terlalu kecil untuk dipedulikan\". Padahal Citra adalah pelanggan BARU yang sedang dalam masa kritis: 7 hari setelah pembelian pertama adalah jendela emas untuk pembelian kedua, dan setelah jendela itu tertutup, probabilitas ia kembali anjlok. Tim marketing menghabiskan budget untuk mayat (Budi) sambil mengabaikan bayi yang lapar (Citra).",
        "Lesson ini tentang RFM — Recency, Frequency, Monetary: tiga angka yang mengubah tumpukan transaksi menjadi peta siapa yang hidup, siapa yang sekarat, dan siapa yang baru lahir. Ditambah cohort analysis: mengelompokkan pelanggan berdasarkan bulan pertama mereka belanja, lalu menonton nasib tiap angkatan dari bulan ke bulan. Kombinasi keduanya adalah bahasa ibu analis CRM, growth, dan risk (kolektibilitas punya logika yang sama: siapa yang baru telat vs siapa yang sudah lama hilang).",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "Logika RFM hidup di credit risk dengan nama lain: recency = hari sejak pembayaran terakhir (DPD), frequency = konsistensi cicilan, monetary = eksposur. Nasabah dengan total pinjaman besar tetapi DPD 73 hari (Budi) jauh lebih berbahaya daripada nasabah baru dengan pinjaman kecil yang lancar (Citra). Segmentasi perilaku — bukan sekadar nominal — adalah fondasi collection strategy dan early warning system.",
      },
      reference: "Total belanja masa lalu ≠ nilai masa depan. RFM membaca KAPAN, SEBERAPA SERING, SEBERAPA BESAR.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menghitung Recency, Frequency, Monetary dari data transaksi mentah; (2) mengubah ketiganya menjadi skor kuantil 1–5 yang adil; (3) memetakan skor menjadi segmen aksi (Champions, At Risk, New, Loyal, Hibernating); (4) membangun matriks retensi cohort dan membacanya tanpa tertipu; (5) menjelaskan kapan RFM menyesatkan dan apa penggantinya.",
        "Rutenya: cerita, bekal ringkas, dua konsep (RFM; cohort), lab Pyodide (mesin segmentasi), chart segmen + heatmap dengan panduan baca, peta keputusan, mini-case voucher, kuis, rangkuman. Estimasi 60 menit; lab-nya sekitar 15 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, kuantil: membagi data terurut menjadi bagian sama besar — kuantil 1–5 berarti tiap skor diisi ~20% pelanggan; ini membuat skor selalu relatif terhadap basis pelangganmu sendiri. Kedua, rata-rata dan proporsi: retensi cohort hanyalah proporsi (jumlah aktif dibagi jumlah anggota). Ketiga, tanggal: recency = tanggal acuan minus tanggal transaksi terakhir, dalam hari — pastikan zona waktu dan definisi 'hari ini' konsisten.",
      ],
      tasks: [],
      hints: [
        "Intuisi pembuka: RFM menjawab 'siapa pelangganmu HARI INI' (foto), cohort menjawab 'bagaimana nasib tiap angkatan SEIRING WAKTU' (film). Foto untuk aksi cepat; film untuk diagnosis.",
      ],
      reference: "Bekal: (1) kuantil = ranking relatif; (2) proporsi = retensi; (3) recency butuh tanggal acuan yang jelas.",
    },
    {
      id: "konsep-rfm",
      eyebrow: "Langkah 3 · Konsep",
      title: "RFM — Si Tukang Sortir Pelanggan",
      prose: [
        "Definisi: tiga metrik per pelanggan. Recency (R) = hari sejak transaksi terakhir — SEMAKIN KECIL semakin baik (inversi!). Frequency (F) = jumlah transaksi dalam periode. Monetary (M) = total nominal. Ketiganya lalu diskorkan 1–5 via kuantil: pelanggan dengan R terkecil mendapat skor R = 5. Hasilnya tiga digit, misalnya 553 = R5 F5 M3 (baru, sering, belanja sedang).",
        "Kepribadiannya: RFM seperti perawat triase di IGD — ia tidak mendiagnosis penyakitmu, ia memutuskan siapa ditangani DULUAN. Tiga digit itu bukan nilai moral pelanggan; ia adalah prioritas aksi. 555 (Champions): beri mereka panggung (referral, early access). 155 (At Risk): belanja besar tapi menghilang — selamatkan SEKARANG atau kubur. 511 (New): sambut dengan onboarding, bukan diskon jor-joran. Aturan segmentasinya eksplisit dan bisa diotomasi — itulah kenapa RFM bertahan 50+ tahun sejak katalog Sears.",
        "Kapan memakai: (1) basis pelanggan transaksional (e-commerce, ritel, F&B) dengan ribuan–jutaan pelanggan; (2) kamu butuh segmentasi CEPAT tanpa model ML — RFM jalan dalam satu query; (3) aksi yang berbeda per segmen sudah tersedia (voucher win-back vs program referral). Kapan tidak: B2B dengan 20 klien (segmentasi manual lebih kaya), atau subscription flat tanpa variasi perilaku.",
      ],
      formula: String.raw`s(x) = 1 + 4\cdot\frac{x - x_{\min}}{x_{\max} - x_{\min}}, \qquad s_R = 6 - s(R)`,
      formulaNote: "s(x) = skor kuantil 1–5 untuk nilai x; x_min, x_max = nilai terkecil/terbesar di basis pelanggan (skor selalu RELATIF). Untuk Recency, arahnya dibalik — R kecil harus skor besar — sehingga dipakai s_R = 6 − s(R), atau ekuivalen memetakan dengan min/max terbalik. Contoh lab: R Andi = 4 hari (min) → s_R = 5; R Budi = 73 hari (max) → s_R = 1. Hasil dibulatkan ke bilangan bulat terdekat.",
      tasks: [],
      note: {
        title: "🚨 Mitos: skor 555 berarti pelanggan terbaik secara absolut",
        type: "pitfall",
        body: "Yang benar: skor 5 = 20% teratas dari BASIS-MU, bukan standar universal. 555 di warung sepi bisa berarti belanja Rp200 ribu; 555 di marketplace bisa berarti Rp20 juta. Jangan bandingkan skor antar-periode tanpa rekalibrasi — inflasi dan pertumbuhan menggeser x_min/x_max. Dan jangan pernah memakai M tanpa R: Budi M=5 tetapi R=1 — monetary tanpa recency adalah kuburan, bukan harta karun.",
      },
      hints: [
        "💡 Intuisi: R adalah dimensi terpenting untuk aksi JANGKA PENDEK (siapa dihubungi minggu ini), F untuk LOYALITAS (siapa diberi status), M untuk NILAI (siapa dapat layanan prioritas). Satu digit, satu keputusan.",
        "💡 Intuisi: recency membusuk setiap hari — RFM adalah foto, bukan tato. Skor yang tidak dihitung ulang tiap minggu adalah koran kemarin.",
      ],
      reference: "R = hari sejak terakhir (kecil = baik). Skor 1–5 relatif terhadap basis. Segmen = aturan eksplisit atas tiga digit.",
    },
    {
      id: "konsep-cohort",
      eyebrow: "Langkah 4 · Konsep",
      title: "Cohort — Si Mesin Waktu Retensi",
      prose: [
        "Definisi: cohort = kelompok pelanggan berdasarkan WAKTU AKUISISI (biasanya bulan pertama belanja). Matriks retensi: baris = cohort, kolom = umur (bulan ke-1, ke-2, ...), sel = proporsi anggota cohort yang masih aktif di umur tersebut. Bentuknya selalu SEGITIGA: cohort Januari punya 3 kolom, cohort Maret hanya 1 — karena masa depan belum terjadi.",
        "Kepribadiannya: kalau RFM adalah foto, cohort adalah film dokumenter per angkatan. Ia menjawab pertanyaan yang tidak bisa dijawab angka agregat: 'apakah pelanggan yang datang bulan Maret lebih setia daripada yang datang Januari?' atau 'apakah retensi membaik karena produk membaik, atau karena cohort baru lebih besar?' Baris yang menurun curam = angkatan bermasalah (akuisisi salah sasaran? onboarding rusak?). Baris yang datar = angkatan sehat.",
        "Kapan memakai: (1) mengevaluasi kualitas akuisisi dari waktu ke waktu; (2) mengukur dampak perubahan produk/onboarding pada retensi; (3) memproyeksikan lifetime value per angkatan. Syarat: definisi 'aktif' harus konsisten (belanja? login? bayar?) dan periode harus cukup panjang untuk melihat pola.",
      ],
      formula: String.raw`R_{c,t} = \frac{N_{c,t}}{N_c}`,
      formulaNote: "R_{c,t} = retensi cohort c pada umur t; N_c = jumlah anggota cohort c (pembagi TETAP — inilah yang membuat baris bisa dibandingkan); N_{c,t} = anggota cohort c yang aktif pada umur t. Contoh lab: cohort Jan N = 5; aktif di bulan ke-2 (umur 2): Andi dan Dewi → R = 2/5 = 0,40. Selalu bagi dengan N_c awal, bukan dengan yang aktif bulan lalu — kalau tidak, kamu mengukur hal lain.",
      tasks: [],
      note: {
        title: "🚨 Mitos: retensi agregat naik berarti produk membaik",
        type: "pitfall",
        body: "Yang benar: retensi agregat bisa naik SEMATA karena komposisi — cohort baru yang besar (dengan retensi bulan-1 selalu 100%) menenggelamkan cohort lama yang memburuk. Ini efek komposisi alias paradoks Simpson. Selalu baca matriks PER BARIS: bila tiap baris menurun tetapi agregat naik, produkmu tidak membaik — akusisimu hanya menutupi kebocoran dengan ember baru.",
      },
      hints: [
        "💡 Intuisi: baca matriks dua arah. Horizontal (satu baris) = nasib satu angkatan — menurun curam berarti masalah. Vertikal (satu kolom umur) = perbandingan antar-angkatan — kolom ke-2 yang membaik dari Jan ke Feb berarti onboarding membaik.",
      ],
      reference: "Cohort = angkatan akuisisi. Matriks segitiga. Baca per baris (nasib) dan per kolom umur (perbandingan).",
    },
    {
      id: "lab-rfm",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Bangun mesin segmentasi RFM + cohort",
      prose: [
        "Waktunya jadi analis CRM. Data di bawah: 19 transaksi dari 8 pelanggan selama Jan–Mar 2026, tanggal acuan 1 April 2026. Tugasmu: hitung R/F/M tiap pelanggan, ubah menjadi skor kuantil 1–5 (recency di-inversi!), petakan ke segmen, lalu cetak matriks retensi cohort.",
        "Coba: setelah lolos, ubah REF menjadi date(2026, 6, 1) — seolah dua bulan berlalu tanpa transaksi baru. Segmen siapa yang berubah? Champions mana yang jatuh menjadi At Risk? Itulah pelajaran kedua lab ini: RFM adalah foto yang membusuk — tanpa dihitung ulang, segmentasi minggu lalu adalah koran kemarin.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rfm` = dict pelanggan → [R (hari), F (kali), M (Rp ribu)]" },
        { id: "t2", text: "Hitung `skor` = dict pelanggan → [sR, sF, sM] via `qscore` (recency: min/max dibalik!)" },
        { id: "t3", text: "Petakan `segmen` dengan aturan: Champions (R≥4,F≥3,M≥3), At Risk (R≤2 dan (F≥3 atau M≥3)), New (R≥4,F≤2), Loyal (R≥3,F≥3), Hibernating (R≤2,F≤2)" },
        { id: "t4", text: "Cetak matriks retensi cohort per bulan akuisisi (format: `Kohor 01: 1.00 0.40 0.40`)" },
      ],
      expected: "Kohor 01: 1.00 0.40 0.40\nKohor 02: - 1.00 0.00\nKohor 03: - - 1.00",
      code: {
        starter: `from datetime import date
REF = date(2026, 4, 1)          # tanggal acuan "hari ini"
# (pelanggan, tanggal, nominal Rp ribu). JANGAN UBAH.
trx = [
    ("Andi", "2026-01-10", 150), ("Andi", "2026-02-12", 200), ("Andi", "2026-03-05", 180),
    ("Andi", "2026-03-20", 220), ("Andi", "2026-03-28", 170),
    ("Budi", "2026-01-05", 800), ("Budi", "2026-01-18", 700),
    ("Citra", "2026-03-25", 120),
    ("Dewi", "2026-01-15", 100), ("Dewi", "2026-02-15", 100), ("Dewi", "2026-03-15", 100),
    ("Eko", "2026-03-10", 50), ("Eko", "2026-03-27", 60),
    ("Farah", "2026-01-08", 300), ("Farah", "2026-01-22", 250),
    ("Gilang", "2026-02-03", 400), ("Gilang", "2026-02-10", 350), ("Gilang", "2026-02-25", 300),
    ("Hana", "2026-01-30", 80),
]

# TULIS KODEMU di bawah ini
rfm =
skor =
segmen =`,
        lockLines: 16,
        solution: `from datetime import date
REF = date(2026, 4, 1)          # tanggal acuan "hari ini"
# (pelanggan, tanggal, nominal Rp ribu). JANGAN UBAH.
trx = [
    ("Andi", "2026-01-10", 150), ("Andi", "2026-02-12", 200), ("Andi", "2026-03-05", 180),
    ("Andi", "2026-03-20", 220), ("Andi", "2026-03-28", 170),
    ("Budi", "2026-01-05", 800), ("Budi", "2026-01-18", 700),
    ("Citra", "2026-03-25", 120),
    ("Dewi", "2026-01-15", 100), ("Dewi", "2026-02-15", 100), ("Dewi", "2026-03-15", 100),
    ("Eko", "2026-03-10", 50), ("Eko", "2026-03-27", 60),
    ("Farah", "2026-01-08", 300), ("Farah", "2026-01-22", 250),
    ("Gilang", "2026-02-03", 400), ("Gilang", "2026-02-10", 350), ("Gilang", "2026-02-25", 300),
    ("Hana", "2026-01-30", 80),
]

# TULIS KODEMU di bawah ini
def qscore(x, xmin, xmax):
    return int(round(1 + 4 * (x - xmin) / (xmax - xmin)))

pelanggan = sorted({t[0] for t in trx})
rfm = {}
for c in pelanggan:
    own = [t for t in trx if t[0] == c]
    last = max(date.fromisoformat(t[1]) for t in own)
    rfm[c] = [(REF - last).days, len(own), sum(t[2] for t in own)]

Rs = [v[0] for v in rfm.values()]
Fs = [v[1] for v in rfm.values()]
Ms = [v[2] for v in rfm.values()]
skor = {}
for c in pelanggan:
    skor[c] = [qscore(rfm[c][0], max(Rs), min(Rs)),
               qscore(rfm[c][1], min(Fs), max(Fs)),
               qscore(rfm[c][2], min(Ms), max(Ms))]

def label(s):
    r, f, m = s
    if r >= 4 and f >= 3 and m >= 3:
        return "Champions"
    if r <= 2 and (f >= 3 or m >= 3):
        return "At Risk"
    if r >= 4 and f <= 2:
        return "New"
    if r >= 3 and f >= 3:
        return "Loyal"
    if r <= 2 and f <= 2:
        return "Hibernating"
    return "Perlu Perhatian"

segmen = {c: label(s) for c, s in skor.items()}

bln = ["2026-01", "2026-02", "2026-03"]
pertama = {c: min(t[1][:7] for t in trx if t[0] == c) for c in pelanggan}
for i, cb in enumerate(bln):
    anggota = [c for c in pelanggan if pertama[c] == cb]
    sel = []
    for t in range(3 - i):
        m = bln[i + t]
        aktif = sum(1 for c in anggota if any(x[0] == c and x[1][:7] == m for x in trx))
        sel.append(f"{aktif / len(anggota):.2f}")
    print("Kohor " + cb[-2:] + ": " + " ".join(["-"] * i + sel))`,
        checks: [
          { kind: "equal", task: "t1", name: "rfm", value: { Andi: [4, 5, 920], Budi: [73, 2, 1500], Citra: [7, 1, 120], Dewi: [17, 3, 300], Eko: [5, 2, 110], Farah: [69, 2, 550], Gilang: [35, 3, 1050], Hana: [61, 1, 80] }, label: "`rfm` benar untuk 8 pelanggan", msg: "R = (REF − tanggal terakhir).days; F = banyak transaksi; M = jumlah nominal." },
          { kind: "equal", task: "t2", name: "skor", value: { Andi: [5, 5, 3], Budi: [1, 2, 5], Citra: [5, 1, 1], Dewi: [4, 3, 2], Eko: [5, 2, 1], Farah: [1, 2, 2], Gilang: [3, 3, 4], Hana: [2, 1, 1] }, label: "`skor` kuantil 1–5 benar", msg: "Recency di-inversi: qscore(R, max, min). Budi R=73 → skor 1." },
          { kind: "equal", task: "t3", name: "segmen", value: { Andi: "Champions", Budi: "At Risk", Citra: "New", Dewi: "Loyal", Eko: "New", Farah: "Hibernating", Gilang: "Loyal", Hana: "Hibernating" }, label: "`segmen` sesuai aturan", msg: "Budi = At Risk (R=1 tetapi M=5); Andi = Champions." },
          { kind: "stdout_matches", task: "t4", pattern: "Kohor 01: 1\\.00 0\\.40 0\\.40", label: "Matriks cohort tercetak", msg: "Kohor Jan: 5 anggota; aktif di bulan ke-2 hanya Andi & Dewi = 0,40." },
        ],
      },
      reference: "RFM = foto perilaku hari ini; cohort = film nasib tiap angkatan. Keduanya dari data transaksi yang sama.",
    },
    {
      id: "chart-segmen",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca segmen dan heatmap seperti analis CRM",
      prose: [
        "Chart kiri: distribusi 8 pelanggan ke 5 segmen. Chart kanan: heatmap retensi cohort dari lab-mu — baris = cohort (bulan akuisisi), kolom = umur (bulan ke-1/2/3), intensitas warna = retensi.",
        "Cara membaca: pada heatmap, tiap sel = R_{c,t} (proporsi anggota cohort yang aktif). Sel kosong bertanda – bukan nol — ia berarti 'belum ada data' (cohort Feb tidak punya bulan ke-1 di data ini karena... tunggu, justru sebaliknya: cohort Feb tidak punya 'masa lalu', ia tidak punya sel di kolom yang lebih tua dari umurnya — segitiga menunjuk ke kanan-bawah).",
        "Interpretasi: baris Kohor Jan turun dari 1,00 ke 0,40 lalu datar di 0,40 — angkatan Januari kehilangan 60% di bulan kedua (Budi, Farah, Hana pergi) tetapi yang bertahan (Andi, Dewi) stabil. Kohor Feb: 1 anggota (Gilang) yang tidak belanja di Maret → 0,00 — tetapi n=1, jangan ambil keputusan dari satu orang! Kohor Mar terlalu muda untuk dinilai. Keputusan: investigasi kenapa angkatan Jan rontok di bulan ke-2 (onboarding?), dan jangan kirim voucher mahal ke Farah/Hana tanpa strategi win-back khusus — mereka Hibernating, bukan At Risk.",
      ],
      figure: {
        svg: SEG_COHORT_SVG,
        alt: "Diagram batang 5 segmen RFM dan heatmap retensi cohort 3x3: baris Kohor Jan 1,00-0,40-0,40.",
        caption: "Kiri: segmen RFM 8 pelanggan lab. Kanan: matriks retensi cohort — baca per baris.",
      },
      tasks: [],
      note: {
        title: "Intuisi: dua chart, dua keputusan",
        body: "Chart segmen menjawab 'ke mana budget minggu ini' — aksi operasional. Heatmap menjawab 'apakah mesin retensimu sehat' — diagnosis strategis. Analis junior hanya membuat salah satunya; analis senior membuat keduanya dan tahu kapan memakai yang mana. Tiga heuristik. Pertama: sel 0,00 dengan n kecil (Gilang sendirian) adalah noise, bukan sinyal — selalu timbang sel dengan ukuran cohort. Kedua: baris yang menurun lalu DATAR lebih berharga daripada baris yang terus menurun — datar berarti ada inti setia yang bisa dipelajari. Ketiga: jangan bandingkan kolom umur yang berbeda antar-baris tanpa normalisasi — kolom ke-3 Kohor Jan vs kolom ke-1 Kohor Mar adalah apel vs jeruk (umur berbeda).",
      },
      reference: "Segmen = aksi minggu ini. Heatmap = kesehatan mesin retensi. Timbang sel dengan n cohort.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "RFM, cohort, atau model — kapan memakai apa?",
      prose: [
        "Lima skenario pemilihan alat:",
        "Skenario 1 — Butuh aksi retensi MINGGU INI (kampanye win-back, daftar telepon koleksi). → RFM. Alasan: foto terkini, satu query, aturan aksi eksplisit. Cohort terlalu lambat untuk kebutuhan ini.",
        "Skenario 2 — Menilai apakah perubahan onboarding/produk memperbaiki retensi. → Cohort, baca per kolom umur. Alasan: hanya cohort yang memisahkan efek waktu dari efek angkatan; RFM buta terhadap 'kapan mereka datang'.",
        "Skenario 3 — Alokasi budget tahunan akuisisi vs retensi. → Cohort LTV per angkatan (retensi × margin, didiskon). Alasan: keputusan budget butuh nilai SEUMUR HIDUP, bukan foto sesaat.",
        "Skenario 4 — Personalisasi skala besar (rekomendasi, harga, konten). → Skor RFM sebagai FITUR untuk model ML, bukan keputusan akhir. Alasan: RFM meringkas perilaku menjadi 3 angka yang kaya sinyal; model yang memakainya hampir selalu lebih baik daripada yang tidak.",
        "Skenario 5 — B2B dengan 30 klien korporat, atau subscription flat Rp99 ribu/bulan tanpa variasi. → JANGAN pakai RFM. Alasan: kuantil atas 30 klien tidak bermakna; subscription flat membuat F dan M hampir konstan — segmentasi manual/account-based jauh lebih kaya.",
        "Aturan praktis 10 detik: aksi minggu ini → RFM; diagnosis tren → cohort; budget tahunan → CLV per cohort; personalisasi → RFM sebagai fitur ML; B2B/subscription flat → jangan RFM.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: memakai skor RFM antar-periode tanpa rekalibrasi",
        type: "pitfall",
        body: "Skor 5 = 20% teratas basis SAAT ITU. Setelah setahun tumbuh 3x lipat dan inflasi 8%, pelanggan dengan perilaku identik bisa jatuh dari 4 ke 2 — bukan karena ia memburuk, tetapi karena tetangganya membaik. Untuk tracking individu dari waktu ke waktu, simpan NILAI MENTAH (R/F/M) dan hitung skor terhadap basis yang sama, atau pakai ambang absolut yang ditinjau berkala.",
      },
      reference: "RFM = operasional cepat. Cohort = diagnosis. CLV = budget. Skor selalu relatif — simpan nilai mentah.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Voucher Rp50 ribu: ke siapa tepatnya?",
      prose: [
        "Skenario (sintetis, untuk latihan): E-commerce punya 10.000 pelanggan dan budget voucher Rp50 ribu (diberikan HANYA bila pelanggan belanja — jadi biaya = p_belanja × Rp50 ribu). Margin per order ulang = Rp80 ribu. Ekspektasi nilai per pelanggan yang ditarget = p_belanja × (Rp80 ribu − Rp50 ribu) = p_belanja × Rp30 ribu. Uji coba pada 500 pelanggan per segmen memberi tingkat belanja ulang: acak 8%, Champions 22%, At Risk 16%, Hibernating 6%.",
        "Pertanyaan analisis: (1) Hitung ekspektasi nilai per pelanggan untuk keempat opsi target. (2) Mana yang terbaik — dan kenapa Hibernating hampir tidak layak disentuh voucher? (3) Apa yang TIDAK bisa disimpulkan dari angka ini (jebakan kausalitas)?",
        "Pembahasan: (1) Acak: 0,08 × 30rb = Rp2.400. Champions: 0,22 × 30rb = Rp6.600. At Risk: 0,16 × 30rb = Rp4.800. Hibernating: 0,06 × 30rb = Rp1.800. (2) Champions terbaik, At Risk kedua. Hibernating nyaris tak bergerak — voucher bukan obat untuk orang yang sudah lupa kamu ada; mereka butuh re-akuisisi (iklan, bukan voucher). Pelajaran segmentasi: kanal dan pesan harus mengikuti segmen, bukan sekadar 'siapa dikirimi'. (3) Yang tidak bisa disimpulkan: berapa yang BELANJA KARENA voucher vs yang memang akan belanja (incrementality). Champions 22% mungkin 20%-nya memang akan belanja tanpa voucher — voucher Rp50 ribu ke mereka sebagian besar adalah subsidi untuk perilaku yang sudah terjadi. Untuk kausalitas, butuh eksperimen (geo-experiment / holdout), bukan observasi.",
        "Catatan desain: angka di atas adalah ekspektasi, bukan janji — di dunia nyata p_belanja tiap segmen harus diukur via holdout, dan voucher fatigue (pelanggan menunggu voucher sebelum belanja) bisa menggerogoti margin bila kampanye diulang terus.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Struktur berpikir yang sama dipakai collection: dunning call ke 'At Risk' (DPD 1–30, histori baik) punya recovery rate tinggi; ke 'Hibernating' (DPD 90+, histori buruk) hampir nol — di sana strategi yang tepat adalah restrukturisasi atau write-off parsial, bukan telepon ke-15. Segmentasi perilaku menentukan STRATEGI, bukan sekadar prioritas.",
      },
      reference: "Nilai ekspektasi = p_aksi × margin bersih. Segmen menentukan pesan & kanal, bukan cuma daftar nama.",
    },
    {
      id: "pendalaman-clv",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Dari RFM ke CLV: memberi harga pada pelanggan",
      prose: [
        "RFM mengurutkan; CLV (Customer Lifetime Value) memberi HARGA. Model paling sederhana untuk bisnis kontraktual/non-kontraktual dengan retensi konstan r per periode, margin m per periode, dan tingkat diskonto d: CLV = m × r / (1 + d − r). Intuisinya: deret geometri — pelanggan memberimu m tahun ini dengan probabilitas r, m·r tahun depan, dan seterusnya, didiskon. Contoh: m = Rp200 ribu/tahun, r = 0,7, d = 0,1 → CLV = 200 × 0,7 / 0,4 = Rp350 ribu. Inilah angka yang seharusnya menjadi langit-langit CAC (biaya akuisisi): bayar lebih dari Rp350 ribu untuk mengakuisisi pelanggan seperti ini = bakar uang.",
        "Jembatan ke model serius: Pareto/NBD (pelanggan 'hidup' atau 'mati' secara laten — cocok untuk non-kontraktual seperti ritel) dan BG/NBD + Gamma-Gamma (memprediksi frekuensi DAN monetary). RFM-mu di lab ini sebenarnya adalah versi sederhana dari input model-model itu: recency ≈ 'kapan terakhir terlihat hidup', frequency ≈ 'seberapa aktif saat hidup'.",
        "Peringatan senior: CLV adalah ekspektasi atas MODEL, bukan fakta. Ia runtuh bila retensi tidak stasioner (musiman, promosi besar), bila margin per pelanggan sangat bervariasi, atau bila 'aktif' didefinisikan asal-asalan. Selalu validasi prediksi CLV terhadap realisasi cohort lama sebelum dipakai untuk budget — model yang tidak pernah di-backtest adalah opini berbiaya mahal.",
      ],
      formula: String.raw`CLV = \frac{m \cdot r}{1 + d - r}`,
      formulaNote: "CLV = customer lifetime value; m = margin kontribusi per periode; r = tingkat retensi per periode (0–1, dari matriks cohort!); d = tingkat diskonto. Contoh: m = Rp200 ribu, r = 0,7, d = 0,1 → CLV = 200.000 × 0,7 / (1 + 0,1 − 0,7) = Rp350 ribu. Batas CAC yang rasional = CLV (atau sebagian darinya).",
      tasks: [],
      reference: "CLV = harga pelanggan. r dari cohort. Validasi ke realisasi sebelum jadi budget.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "RFM = Recency (hari sejak terakhir, kecil = baik), Frequency, Monetary — diskorkan 1–5 relatif terhadap basis via kuantil.",
        "Skor tiga digit memetakan ke segmen aksi: Champions, At Risk, New, Loyal, Hibernating — tiap segmen butuh pesan dan kanal berbeda.",
        "Cohort = angkatan akuisisi; matriks retensi R_{c,t} = N_{c,t}/N_c berbentuk segitiga; baca per baris (nasib) dan per kolom umur (perbandingan).",
        "Waspada efek komposisi: retensi agregat bisa naik sementara tiap cohort memburuk — selalu cek per baris.",
        "RFM adalah foto yang membusuk: hitung ulang berkala, simpan nilai mentah, dan jangan pakai untuk B2B kecil/subscription flat.",
      ],
      quiz: [
        {
          q: "Budi: total Rp1,5 juta, terakhir belanja 73 hari lalu (At Risk). Citra: total Rp120 ribu, belanja 7 hari lalu (New). Budget voucher terbatas. Keputusan?",
          options: [
            { text: "Prioritaskan Budi — total belanjanya 12,5x lipat Citra", why: "Salah: total masa lalu ≠ nilai masa depan. Budi sudah 73 hari hilang; voucher ke mayat jarang kembali. Ini tepat jebakan cerita pembuka.", correct: false },
            { text: "Budi dapat upaya win-back sekarang (mumpung M-nya besar, masih mungkin diselamatkan); Citra dapat onboarding (jendela pembelian kedua) — keduanya disentuh dengan pesan BERBEDA", why: "Benar: segmentasi bukan soal siapa 'lebih berharga', tetapi aksi apa yang tepat. At Risk = selamatkan; New = rawat. Satu voucher untuk semua = strategi malas.", correct: true },
            { text: "Abaikan keduanya — fokus ke Champions saja", why: "Salah: Champions memang prioritas, tetapi At Risk bervaluasi tinggi (M=5) adalah tempat ROI win-back terbesar; mengabaikannya = membiarkan uang bocor." },
            { text: "Kirim voucher identik ke semua pelanggan", why: "Salah: mini-case menunjukkan ekspektasi nilai per segmen berbeda 3x lipat (Rp6.600 vs Rp1.800). Voucher buta segmen = bakar budget di Hibernating." },
          ],
        },
        {
          q: "Di lab, R Andi = 4 hari (minimum) dan R Budi = 73 hari (maksimum). Skor R Andi?",
          options: [
            { text: "5 — recency terkecil mendapat skor tertinggi (arah di-inversi)", why: "Benar: s_R = 1 + 4·(73−4)/(73−4)... tepatnya qscore(4, max=73, min=4) = 1 + 4·(4−73)/(4−73) = 5.", correct: true },
            { text: "1 — recency kecil = skor kecil", why: "Salah: itu lupa inversi — kesalahan paling umum. Recency kecil (baru belanja) = BAIK = skor BESAR." },
            { text: "3 — tengah-tengah", why: "Salah: 4 adalah MINIMUM, bukan tengah. Skor kuantil selalu relatif terhadap min/max basis." },
            { text: "Tidak bisa dihitung tanpa distribusi lengkap", why: "Salah: dengan pemetaan min-max linear, min dan max cukup. (Distribusi lengkap dibutuhkan untuk kuantil persentil sejati.)" },
          ],
        },
        {
          q: "Baris Kohor Jan di matriks: 1,00 → 0,40 → 0,40. Interpretasi yang tepat?",
          options: [
            { text: "60% anggota pergi di bulan kedua, tetapi yang bertahan stabil di bulan ketiga — ada inti setia", why: "Benar: penurunan lalu DATAR = seleksi selesai, inti (Andi, Dewi) loyal. Inti seperti ini layak dipelajari: apa yang membuat mereka bertahan?", correct: true },
            { text: "Cohort Jan gagal total dan harus dihapus dari laporan", why: "Salah: 40% bertahan stabil — itu fondasi. Menghapus cohort buruk dari laporan = menyembunyikan diagnosis." },
            { text: "Retensi 40% berarti produk bermasalah untuk semua orang", why: "Salah: agregat 40% mencampur yang pergi dan yang setia. Baris yang datar di 0,40 justru kabar baik bagi yang bertahan." },
            { text: "Angka 1,00 di bulan pertama membuktikan akuisisi Januari sempurna", why: "Salah: bulan pertama SELALU 1,00 menurut definisi (mereka baru saja belanja). Itu bukan prestasi — itu tautologi." },
          ],
        },
        {
          q: "Kenapa matriks cohort berbentuk segitiga, bukan persegi penuh?",
          options: [
            { text: "Karena cohort yang lebih muda belum hidup cukup lama — masa depannya belum terjadi", why: "Benar: Kohor Mar tidak punya 'bulan ke-0' di masa lalu relatif terhadap akuisisinya... tepatnya: sel kosong (–) adalah umur yang belum dialami cohort itu. Mengisinya dengan nol adalah kebohongan statistik.", correct: true },
            { text: "Karena rumusnya hanya defined untuk segitiga", why: "Salah: rumus R_{c,t} berlaku untuk t berapa pun — yang tidak ada adalah DATANYA." },
            { text: "Karena cohort lama datanya dihapus", why: "Salah: tidak ada penghapusan; ini soal waktu, bukan retensi data." },
            { text: "Supaya chart-nya terlihat rapi", why: "Salah: bentuk segitiga adalah konsekuensi logis, bukan pilihan estetika." },
          ],
        },
        {
          q: "Retensi agregat perusahaan naik dari 35% ke 45% dalam setahun, tetapi SETIAP baris cohort menurun lebih curam dari tahun lalu. Kesimpulan?",
          options: [
            { text: "Produk membaik — angka agregat tidak berbohong", why: "Salah: ini efek komposisi (paradoks Simpson). Agregat naik karena cohort baru yang besar menenggelamkan cohort lama yang memburuk.", correct: false },
            { text: "Ada efek komposisi: cohort baru menutupi kebocoran cohort lama — investigasi per baris, bukan rayakan agregat", why: "Benar: inilah tepatnya jebakan yang diperingatkan di Langkah 4. Retensi agregat adalah rata-rata berbobot; bobotnya (ukuran cohort) bisa menipu.", correct: true },
            { text: "Data cohort-nya salah hitung", why: "Salah: jangan menuduh data dulu — pola ini sepenuhnya konsisten secara matematis." },
            { text: "Tidak ada kesimpulan tanpa uji signifikansi", why: "Salah: signifikansi soal generalisasi; pola deskriptifnya sudah cukup untuk memicu investigasi." },
          ],
        },
        {
          q: "Manakah situasi di mana RFM paling TIDAK cocok?",
          options: [
            { text: "E-commerce dengan 2 juta pelanggan transaksional", why: "Salah: ini habitat ideal RFM — banyak pelanggan, perilaku bervariasi." },
            { text: "B2B dengan 25 klien korporat dan tim account manager", why: "Benar: kuantil atas 25 klien tidak bermakna; account manager sudah tahu tiap klien lebih dalam dari tiga digit. RFM butuh skala.", correct: true },
            { text: "Aplikasi fintech dengan 500 ribu pengguna aktif", why: "Salah: skala dan variasi perilaku = RFM cocok (dengan adaptasi definisi 'transaksi')." },
            { text: "Ritel fashion dengan pembelian musiman", why: "Salah: musiman ditangani via definisi periode dan cohort, bukan alasan menolak RFM." },
          ],
        },
      ],
      next: { label: "A320 — Desain Survei", href: "/v2/learn/a320-desain-survei" },
    },
  ],
};
