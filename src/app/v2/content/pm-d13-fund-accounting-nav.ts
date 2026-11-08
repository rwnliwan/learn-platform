import type { V2Lesson } from "../lib/types";

// Waterfall NAV: aset → dikurangi liabilitas → dibagi unit = NAV per unit.
const NAV_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Diagram air terjun NAV: total aset 9,1 juta dikurangi liabilitas 0,1 juta menjadi NAV 9 juta, dibagi 4.500 unit menjadi Rp2.000 per unit.">
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<g><rect x="60" y="60" width="90" height="180" fill="var(--c1)"/><text x="105" y="50" fill="var(--chart-text)">Aset</text><text x="105" y="150" fill="#fff">Rp9,1jt</text><text x="105" y="258" fill="var(--chart-text)">5,2 + 3,1 + 0,8</text></g>
<text x="172" y="150" font-size="20" fill="var(--chart-text)">−</text>
<g><rect x="195" y="216" width="90" height="24" fill="#e11d48"/><text x="240" y="206" fill="var(--chart-text)">Liabilitas</text><text x="240" y="233" fill="#fff" font-size="10">Rp0,1jt</text><text x="240" y="258" fill="var(--chart-text)">fee + utang</text></g>
<text x="307" y="150" font-size="20" fill="var(--chart-text)">=</text>
<g><rect x="330" y="64" width="90" height="176" fill="var(--c2)"/><text x="375" y="50" fill="var(--chart-text)">NAV</text><text x="375" y="150" fill="#fff">Rp9,0jt</text><text x="375" y="258" fill="var(--chart-text)">dana bersih</text></g>
<text x="442" y="150" font-size="20" fill="var(--chart-text)">÷</text>
<g><rect x="465" y="64" width="70" height="176" fill="var(--c3)" opacity="0.6"/><text x="500" y="50" fill="var(--chart-text)">Unit</text><text x="500" y="150" fill="var(--chart-text)">4.500</text></g>
</g>
<line x1="40" y1="250" x2="550" y2="250" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="180" y="272" width="200" height="0" fill="none"/>
<text x="280" y="272" font-size="13" font-family="var(--font-ui)" text-anchor="middle" fill="var(--text)" font-weight="600">NAV per unit = Rp2.000</text>
<text x="280" y="290" font-size="11" font-family="var(--font-ui)" text-anchor="middle" fill="var(--chart-text)">Harga yang dipakai investor masuk &amp; keluar hari itu.</text>
</svg>`;

export const pmd13: V2Lesson = {
  slug: "pm-d13-fund-accounting-nav",
  track: "Portfolio Management",
  module: "Kuantitatif Terapan",
  title: "D13 — Fund Accounting & NAV: Satu Rupiah pun Harus Bisa Dijelaskan",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-nav",
      eyebrow: "Langkah 1 · Cerita",
      title: "NAV yang salah 2% — dan antrean penarikan besok paginya",
      prose: [
        "2019, sebuah reksa dana saham domestik. Pukul 16:00, NAV hari itu diumumkan: turun 2,1% — padahal IHSG hari itu NAIK 0,4%. Telepon investor berdatangan. Manajer investasinya panik: portofolionya tidak mungkin turun sebesar itu. Audit kilat malam harinya menemukan penyebabnya: satu holding — saham lapis dua yang jarang ditransaksikan — memakai harga feed yang basi TIGA HARI, tepat sebelum aksi korporasi yang menaikkan harganya 40%. Bukan fraud. Bukan pencurian. Hanya harga yang kedaluwarsa.",
        "Besok paginya antrean penarikan (redemption) memanjang. Bukan karena dananya rugi — melainkan karena investor kehilangan kepercayaan pada ANGKAnya. NAV yang salah 2% selama satu hari merusak sesuatu yang dibangun bertahun-tahun: keyakinan bahwa setiap rupiah bisa dijelaskan.",
        "Twist-nya: musuh terbesar fund accounting bukanlah penjahat — melainkan KETELEDORAN RUTIN: feed basi, akrual yang lupa dicatat, corporate action yang terlewat. Lesson ini tentang mesin harian yang menjaga NAV tetap jujur: siklus fund accounting, rumus NAV, sumber kesalahan, dan kontrolnya.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan siklus harian fund accounting dari valuasi hingga publikasi NAV; (2) menghitung NAV dan NAV per unit dengan benar termasuk akrual biaya; (3) mengidentifikasi empat sumber kesalahan NAV dan kontrol untuk masing-masing; (4) menjelaskan peran bank kustodian & administrator dalam verifikasi; (5) merancang cek toleransi harga untuk mendeteksi feed basi.",
        "Daftar isi: 1) Cerita NAV 2% · 2) Modal dasar: akuntansi dana (ringkas) · 3) Siklus harian fund accounting · 4) Rumus NAV · 5) Lab: hitung NAV & deteksi selisih valuasi · 6) Chart waterfall · 7) Peta keputusan · 8) Mini-case: corporate action terlewat · 9) Checkpoint.",
        "Metadata: ±65 menit · 1 lab Python · 1 chart · 6 kuis · 1 mini-case. Prasyarat: tidak ada.",
      ],
      tasks: [],
      reference: "NAV salah 2% sehari bisa menghapus kepercayaan bertahun-tahun.",
    },
    {
      id: "modal-dasar",
      eyebrow: "Langkah 2 · Modal dasar (ringkas, self-contained)",
      title: "Akuntansi dana: akuntansi untuk uang orang banyak",
      prose: [
        "Fondasi — fund accounting. Berbeda dari akuntansi perusahaan (yang mengukur laba perusahaan), akuntansi dana mengukur NILAI KEPEMILIKAN BERSAMA: kumpulan aset milik banyak investor yang dikelola sebagai satu portofolio. Setiap investor memiliki sejumlah UNIT; nilai tiap unit berubah harian mengikuti nilai portofolio.",
        "Dua prinsip turunannya. Pertama, KEADILAN ANTAR INVESTOR: investor yang masuk hari ini tidak boleh mensubsidi (atau disubsidi oleh) investor lama — maka NAV harus dihitung dengan benar SETIAP HARI agar harga masuk/keluar adil. Kedua, PEMISAHAN TOTAL: aset dana ≠ aset manajer investasi (pagar 1 dari lesson D12) — fund accounting mencatat keduanya di buku yang terpisah.",
        "Lesson ini menjawab: bagaimana NAV dihitung setiap hari (siklus + rumus), apa yang bisa salah, dan siapa yang memverifikasi.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: NAV adalah 'harga saham'-nya reksa dana",
        body: "Bedanya: harga saham ditentukan pasar (tawar-menawar), NAV ditentukan PERHITUNGAN (aset minus liabilitas dibagi unit). Karena ia hasil hitung, ia bisa SALAH hitung — dan tidak ada 'pasar' yang mengoreksinya otomatis.",
      },
      reference: "Fund accounting = keadilan antar investor, dihitung harian.",
    },
    {
      id: "konsep-siklus",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Siklus harian: dari pasar tutup hingga NAV terbit",
      prose: [
        "Definisi: siklus fund accounting harian adalah urutan pekerjaan yang mengubah posisi portofolio hari itu menjadi satu angka NAV yang dipublikasikan. Urutannya:",
        "Langkah A — VALUASI ASET: setiap holding dinilai dengan harga penutupan hari itu (saham/obligasi likuid), atau model valuasi untuk yang tidak likuid. Inilah titik gagal cerita pembuka: harga basi = valuasi salah.",
        "Langkah B — AKRUAL BIAYA & PENDAPATAN: biaya manajemen, kustodian, dan pajak diakru harian (dibagi 365), dividen/bunga yang menjadi hak dicatat. Satu hari akrual yang terlewat = NAV meleset kecil — tetapi meleset SETIAP HARI menumpuk.",
        "Langkah C — UNIT CREATION/REDEMPTION: subscription (uang masuk) menambah unit beredar, redemption (uang keluar) menguranginya — keduanya memakai NAV hari itu. Urutan penting: hitung NAV dulu, baru terbitkan/tarik unitnya.",
        "Langkah D — REKONSILIASI & PUBLIKASI: cocokkan dengan catatan kustodian (independen), selisih di atas toleransi harus dijelaskan SEBELUM publikasi. Baru NAV diumumkan.",
        "Kepribadiannya: fund accounting adalah AKUNTAN FORENSIK yang bekerja dengan tenggat harian — teliti seperti auditor, cepat seperti newsroom. Ia tidak mencari 'kebenaran filosofis', ia memastikan tidak ada rupiah yang tidak bisa dijelaskan asalnya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “NAV salah 0,1% tidak masalah — kecil”",
        type: "pitfall",
        body: "Yang benar: 0,1% dari dana Rp1 triliun = Rp1 miliar — dan kesalahan sistematis 0,1% harian menumpuk menjadi transfer kekayaan diam-diam dari investor keluar ke investor masuk (atau sebaliknya). Keadilan antar investor menuntut presisi, bukan 'kira-kira'.",
      },
      reference: "Valuasi → akrual → unit → rekonsiliasi → publikasi. Tiap hari.",
    },
    {
      id: "konsep-rumus",
      eyebrow: "Langkah 4 · Konsep inti + rumus",
      title: "Rumus NAV: sederhana di kertas, menuntut di praktik",
      prose: [
        "Rumusnya hanya satu baris — tetapi setiap sukunya adalah hasil seluruh siklus di langkah 3:",
      ],
      formula: String.raw`\text{NAV} = \frac{\text{Total Aset} - \text{Total Liabilitas}}{\text{Unit Beredar}}`,
      formulaNote:
        "Total Aset = nilai pasar seluruh holding (saham, obligasi, kas, piutang dividen) setelah valuasi langkah A. Total Liabilitas = akrual biaya manajemen/kustodian/pajak + utang dana (langkah B). Unit Beredar = jumlah unit setelah creation/redemption hari itu (langkah C). Contoh: aset Rp9,1jt − liabilitas Rp0,1jt = NAV Rp9,0jt; dibagi 4.500 unit → Rp2.000/unit.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “fund accounting itu back office membosankan — PM tidak perlu paham”",
        type: "pitfall",
        body: "Yang benar: PM yang tidak paham NAV tidak bisa menjelaskan kinerjanya sendiri — attribution, fee drag, dan cash drag semuanya lahir dari angka-angka ini. Cerita pembuka: yang menelepon duluan saat NAV salah adalah INVESTOR, dan yang ditanya adalah MANAJERnya, bukan staf back office.",
      },
      reference: "Satu rumus, empat langkah kerja di belakangnya.",
    },
    {
      id: "lab-nav",
      eyebrow: "Langkah 5 · Lab",
      title: "Hitung NAV — dan tangkap feed yang basi",
      prose: [
        "Lab ini mensimulasikan langkah A–C siklus harian: hitung NAV dari komponennya, lalu jalankan cek toleransi harga — dua feed harga untuk satu saham dibandingkan; selisih di atas toleransi = flag untuk investigasi (persis yang gagal di cerita pembuka).",
        "Data: saham Rp5,2jt, obligasi Rp3,1jt, kas Rp0,8jt; fee akrual Rp20rb, utang Rp80rb; unit beredar 4.500. Feed A: Rp1.250, feed B: Rp1.300, toleransi 0,5%.",
        "Coba: ubah harga_feed_b menjadi 1_256 (selisih 0,48%) — flag mati. Di sinilah letak seninya: toleransi terlalu longgar = feed basi lolos; terlalu ketat = analis tenggelam dalam false alarm.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total_aset`, `total_liab`, `nav`, dan `nav_per_unit`" },
        { id: "t2", text: "Hitung `selisih` relatif dua feed dan `flag_valuasi`; cetak ringkasan persis format contoh" },
      ],
      expected: "NAV=9000000  NAV/unit=2000.00  Selisih feed 4.00% -> flag valuasi: True",
      code: {
        starter: `# Komponen NAV harian (Rp)
saham, obligasi, kas = 5_200_000, 3_100_000, 800_000
fee_akrual, utang = 20_000, 80_000
unit_beredar = 4_500

# Cek toleransi harga: dua feed untuk saham yang sama
harga_feed_a, harga_feed_b = 1_250, 1_300
toleransi = 0.005

# TULIS KODEMU
total_aset =
total_liab =
nav =
nav_per_unit =
selisih =
flag_valuasi =

print(f"NAV={nav}  NAV/unit={nav_per_unit:.2f}  Selisih feed {selisih:.2%} -> flag valuasi: {flag_valuasi}")`,
        lockLines: 9,
        solution: `# Komponen NAV harian (Rp)
saham, obligasi, kas = 5_200_000, 3_100_000, 800_000
fee_akrual, utang = 20_000, 80_000
unit_beredar = 4_500

# Cek toleransi harga: dua feed untuk saham yang sama
harga_feed_a, harga_feed_b = 1_250, 1_300
toleransi = 0.005

# TULIS KODEMU
total_aset = saham + obligasi + kas
total_liab = fee_akrual + utang
nav = total_aset - total_liab
nav_per_unit = nav / unit_beredar
selisih = abs(harga_feed_a - harga_feed_b) / harga_feed_a
flag_valuasi = selisih > toleransi

print(f"NAV={nav}  NAV/unit={nav_per_unit:.2f}  Selisih feed {selisih:.2%} -> flag valuasi: {flag_valuasi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "nav", value: 9_000_000, tol: 1, label: "`nav` = Rp9.000.000", msg: "9,1jt − 0,1jt. Akrual yang terlewat langsung menggeser angka ini." },
          { kind: "equal", task: "t1", name: "nav_per_unit", value: 2000.0, tol: 0.01, label: "`nav_per_unit` = Rp2.000", msg: "Harga masuk/keluar investor hari itu." },
          { kind: "equal", task: "t2", name: "flag_valuasi", value: true, label: "`flag_valuasi` = True", msg: "Selisih 4% >> toleransi 0,5% — investigasi sebelum publikasi." },
          { kind: "stdout_matches", task: "t2", pattern: "NAV/unit=2000\\.00", label: "`print` menampilkan NAV/unit", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "NAV benar + feed terverifikasi = publikasi. Salah satu gagal = tahan dulu.",
    },
    {
      id: "chart-waterfall",
      eyebrow: "Langkah 6 · Konsep + chart",
      title: "Waterfall: ke mana perginya setiap rupiah",
      prose: [
        "Chart waterfall di bawah memecah NAV Rp2.000/unit menjadi komponennya: mulai dari total aset, dikurangi liabilitas, menjadi NAV, lalu dibagi unit. Setiap balok = satu langkah siklus yang bisa diaudit.",
        "Cara membaca chart: balok pertama = total aset Rp9,1jt (dipecah 5,2 + 3,1 + 0,8); balok merah = liabilitas yang dikurangkan; balok NAV = dana bersih; pembagi = unit beredar; angka akhir = NAV per unit.",
        "Interpretasi: waterfall membuat 'Rp2.000' tidak lagi angka ajaib — ia hasil aritmetika yang setiap sukunya punya pemilik (valuasi, akrual, unit). Ketika investor bertanya 'kenapa NAV turun?', jawaban yang benar menunjuk ke balok yang bergerak — bukan ke 'kondisi pasar' secara umum.",
      ],
      figure: { svg: NAV_SVG, alt: "Diagram air terjun: aset 9,1 juta dikurangi liabilitas 0,1 juta menjadi NAV 9 juta, dibagi 4.500 unit = Rp2.000 per unit.", caption: "Waterfall NAV: setiap rupiah punya asal yang bisa ditunjuk." },
      tasks: [],
      reference: "Jawaban 'kenapa NAV bergerak' selalu menunjuk ke balok tertentu.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: sebelum NAV terbit, empat gerbang",
      prose: [
        "Skenario 1 — Selisih valuasi vs kustodian di atas toleransi → TAHAN PUBLIKASI, investigasi dulu. Alasan: NAV yang terbit tidak bisa 'ditarik kembali' dari investor yang sudah bertransaksi.",
        "Skenario 2 — Corporate action tercatat besok pagi tetapi ex-date hari ini → SESUAIKAN HARI INI. Alasan: harga ex-date tanpa penyesuaian = valuasi salah satu hari penuh.",
        "Skenario 3 — Aset tidak likuid tanpa harga pasar → GUNAKAN MODEL VALUASI yang didokumentasikan + catat asumsinya. Alasan: 'harga terakhir 3 bulan lalu' bukan valuasi — ia penundaan masalah.",
        "Skenario 4 — Redemption besar (>10% unit) di hari yang sama → HITUNG NAV DULU, baru eksekusi unit. Alasan: urutan terbalik = investor keluar mensubsidi (atau disubsidi) yang tinggal.",
        "Aturan praktis 10 detik: NAV terbit hanya jika (1) semua harga terverifikasi, (2) akrual lengkap, (3) rekonsiliasi kustodian cocok dalam toleransi, (4) corporate action termutakhirkan. Satu gagal = tunda & jelaskan, jangan 'terbitkan dulu, koreksi belakangan'.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menerbitkan NAV karena tenggat jam 8 pagi, lalu mengoreksi diam-diam. NAV koreksian tanpa jejak audit = temuan — keterlambatan 30 menit lebih murah dari koreksi senyap.",
      },
      reference: "Empat gerbang sebelum terbit. Tidak ada jalan pintas.",
    },
    {
      id: "minicase-corporate-action",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Dividen yang hampir terlewat",
      prose: [
        "Kasus: Reksa dana saham memegang 1 juta lembar saham XYZ. XYZ mengumumkan dividen Rp100/lembar dengan cum-date kemarin — artinya dividen SUDAH menjadi hak dana. Staf fund accounting lupa mencatat piutang dividen Rp100jt dalam valuasi hari ini. Total aset tercatat Rp50,0 miliar (harusnya Rp50,1 miliar), unit beredar 25 juta.",
        "Pertanyaan 1: Berapa NAV/unit yang terbit vs yang seharusnya? Siapa yang diuntungkan dari kesalahan ini?",
        "Pertanyaan 2: Kontrol apa yang seharusnya menangkap ini sebelum publikasi?",
        "Pembahasan: (1) Terbit: 50,0M/25jt = Rp2.000; seharusnya 50,1M/25jt = Rp2.004. Investor yang REDEMPTION hari itu dirugikan Rp4/unit (menjual terlalu murah); investor yang bertahan diuntungkan diam-diam — transfer kekayaan antar investor akibat keteledoran. (2) Checklist corporate action harian (kalender aksi korporasi vs daftar holding) + rekonsiliasi dengan kustodian yang mencatat piutang dividen secara independen — dua pasang mata untuk satu angka.",
      ],
      tasks: [],
      reference: "Rp4/unit × jutaan unit = keteledoran yang mahal.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran — dari siklus harian hingga kontrol corporate action."],
      tasks: [],
      summary: [
        "Siklus harian: valuasi → akrual → creation/redemption → rekonsiliasi → publikasi — urutan ini tidak boleh dibalik.",
        "NAV = (total aset − total liabilitas) / unit beredar; setiap suku adalah hasil kerja yang bisa diaudit.",
        "Empat sumber kesalahan klasik: harga basi, akrual terlewat, corporate action tidak tercatat, urutan unit yang salah — masing-masing punya kontrolnya.",
        "Kustodian = verifikator independen; NAV terbit hanya setelah empat gerbang lolos.",
      ],
      next: { label: "DM1 — Data Lifecycle", href: "/v2/learn/dm1-data-lifecycle" },
      quiz: [
        {
          q: "Urutan yang BENAR dalam siklus harian fund accounting?",
          options: [
            { text: "Publikasi → valuasi → akrual → rekonsiliasi", why: "Salah: publikasi adalah langkah TERAKHIR, bukan pertama." },
            { text: "Valuasi → akrual → creation/redemption → rekonsiliasi → publikasi", why: "Tepat: hitung dulu dengan benar, verifikasi, baru umumkan.", correct: true },
            { text: "Rekonsiliasi → valuasi → publikasi → akrual", why: "Salah: tidak bisa rekonsiliasi sebelum ada angka yang dihitung." },
            { text: "Akrual → publikasi → valuasi", why: "Salah: akrual hanya satu suku; valuasi mendahuluinya." },
          ],
        },
        {
          q: "Dana: aset Rp12M, liabilitas Rp0,5M, unit 5,75 juta. NAV/unit?",
          options: [
            { text: "Rp2.086,96", why: "Salah: itu (12+0,5)/5,75 — liabilitas DITAMBAH, harusnya dikurang." },
            { text: "Rp2.000", why: "Tepat: (12 − 0,5)/5,75 = 11,5/5,75 = Rp2.000.", correct: true },
            { text: "Rp2.173,91", why: "Salah: itu 12,5/5,75 — sama, liabilitas malah menambah." },
            { text: "Rp2.086", why: "Salah: pembulatan dari hitungan yang keliru." },
          ],
        },
        {
          q: "Dua feed harga berbeda 4% dengan toleransi 0,5%. Tindakan tepat?",
          options: [
            { text: "Pakai rata-ratanya dan terbitkan", why: "Salah: rata-rata dari dua angka yang salah satunya basi = angka yang 'pasti salah sedikit'." },
            { text: "Tahan publikasi, investigasi feed mana yang benar", why: "Tepat: selisih >> toleransi = sinyal, bukan noise. NAV yang terbit tidak bisa ditarik.", correct: true },
            { text: "Pakai feed yang lebih tinggi agar NAV bagus", why: "Salah: memilih angka yang 'bagus' = manipulasi." },
            { text: "Abaikan — 4% kecil", why: "Salah: 4% adalah 8× toleransi — justru red flag." },
          ],
        },
        {
          q: "Dividen Rp100jt lupa dicatat (kasus mini-case). Siapa yang dirugikan?",
          options: [
            { text: "Tidak ada — hanya Rp4/unit", why: "Salah: Rp4 × 25 juta unit = Rp100jt transfer kekayaan diam-diam." },
            { text: "Investor yang redemption hari itu — menjual unit terlalu murah", why: "Tepat: NAV understated = penjual dirugikan, yang tinggal diuntungkan.", correct: true },
            { text: "Manajer investasi", why: "Salah: MI tidak dirugikan langsung — yang dirugikan investor yang keluar." },
            { text: "Bank kustodian", why: "Salah: kustodian bukan pemilik dana." },
          ],
        },
        {
          q: "Mengapa redemption besar harus dieksekusi SETELAH NAV dihitung?",
          options: [
            { text: "Agar MI sempat menyiapkan kas", why: "Salah: itu soal likuiditas operasional, bukan prinsipnya." },
            { text: "Agar harga keluar adil — tidak mensubsidi/mendisubsidi investor yang tinggal", why: "Tepat: keadilan antar investor menuntut NAV yang benar sebelum unit berubah.", correct: true },
            { text: "Agar laporan terlihat rapi", why: "Salah: kosmetik bukan alasan." },
            { text: "Tidak penting urutannya", why: "Salah: urutan terbalik = transfer kekayaan antar investor." },
          ],
        },
        {
          q: "Kontrol terbaik untuk 'corporate action terlewat'?",
          options: [
            { text: "Mengandalkan ingatan staf senior", why: "Salah: ingatan bukan kontrol." },
            { text: "Checklist kalender corporate action harian vs daftar holding + rekonsiliasi kustodian independen", why: "Tepat: dua pasang mata — internal checklist dan verifikator eksternal.", correct: true },
            { text: "Menunggu investor komplain", why: "Salah: komplain = kontrol yang sudah terlambat dan merusak kepercayaan." },
            { text: "Memakai harga kemarin saja", why: "Salah: itu justru menciptakan masalah baru (harga basi)." },
          ],
        },
      ],
    },
  ],
};
