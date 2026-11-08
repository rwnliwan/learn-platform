import type { V2Lesson } from "../lib/types";

// ── Figure: skor kelengkapan metodologi (ilustrasi pola) ─────────────────
const SKOR_SVG = `<svg viewBox="0 0 620 260" role="img" aria-label="Skor kelengkapan metodologi: 4 dari 6 komponen hadir, skor 66,7 persen (ilustrasi)">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="180" y1="30" x2="180" y2="210"/><line x1="180" y1="210" x2="590" y2="210"/></g>
<g font-family="var(--font-ui)" font-size="12" fill="var(--chart-text)" text-anchor="end">
<text x="170" y="55">sumber data</text><text x="170" y="85">periode sampel</text><text x="170" y="115">definisi metrik</text><text x="170" y="145">batasan</text><text x="170" y="175">replikasi</text><text x="170" y="205">risiko</text></g>
<g><rect x="180" y="42" width="330" height="18" fill="var(--c1)"/><rect x="180" y="72" width="330" height="18" fill="var(--c1)"/><rect x="180" y="102" width="60" height="18" fill="var(--chart-grid)"/><rect x="180" y="132" width="330" height="18" fill="var(--c1)"/><rect x="180" y="162" width="60" height="18" fill="var(--chart-grid)"/><rect x="180" y="192" width="330" height="18" fill="var(--c1)"/></g>
<g font-family="var(--font-ui)" font-size="12" fill="var(--chart-text)"><text x="520" y="130">skor: 4/6 = 66,7%</text></g>
<g fill="var(--text-muted)" font-size="11" font-family="var(--font-ui)"><text x="180" y="245">batang penuh = komponen terdokumentasi; batang pendek = hilang (definisi metrik, replikasi)</text></g></svg>`;

export const bcd24: V2Lesson = {
  slug: "bcd24-riset-institusional",
  track: "Blockchain Data Scientist",
  module: "Komunikasi Analis",
  title: "BCD24 — Menulis Riset Kripto Berkualitas Institusional: Dari Angka ke Kepercayaan",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menyusun riset kripto dengan struktur institusional — tesis, data pendukung, metodologi yang bisa direplikasi, risiko & ketidakpastian; (2) memisahkan tiga bahasa riset — fakta, opini, proyeksi — dan memperlakukan masing-masing dengan disiplin yang benar; (3) mensitasi data on-chain dengan standar yang membuat analis lain bisa memverifikasi klaimmu; (4) mengenali empat jebakan klasik — cherry-picking jendela waktu, survivorship bias, metrik tanpa definisi, dan overclaim; (5) mengaudit draf riset (milikmu atau orang lain) dengan checklist kuantitatif.",
        "Rutenya: cerita riset yang ditolak klien → empat konsep inti (struktur, tiga bahasa, sitasi, jebakan) → lab Pyodide (audit klaim, deteksi overclaim, skor metodologi) → chart skor kelengkapan dengan panduan baca → peta keputusan → mini-case → kuis → rangkuman. Estimasi 60 menit; lab-nya ±15 menit.",
        "Satu batas di awal: lesson ini mengajarkan MENULIS riset, bukan MEMBERI rekomendasi investasi. Riset institusional yang baik justru menahan diri dari kesimpulan beli/jual — ia memberi pembaca bahan untuk memutuskan sendiri, dengan ketidakpastian yang jujur.",
      ],
      tasks: [],
      reference: "Lima konsep: struktur → tiga bahasa → sitasi → jebakan → audit.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Riset yang angkanya benar tetapi ditolak klien",
      prose: [
        "Bima, analis di firma riset kripto Jakarta, menghabiskan tiga minggu menganalisis arus stablecoin ke exchange. Temuannya solid: setiap lonjakan net inflow di atas Rp500 miliar didahului reli 7 hari kemudian — dengan data 18 bulan dan uji yang rapi. Ia mengirim draf 40 halaman ke klien institusi. Balasannya satu paragraf: “Menarik. Tapi kami tidak bisa memakai ini.”",
        "Bima protes — angkanya benar! Klien menjelaskan dengan sabar: drafnya tidak menulis SUMBER data mentahnya (node sendiri? API pihak ketiga?), tidak mendefinisikan “lonjakan” secara operasional (ambang berapa? jendela berapa jam?), tidak menyebut 4 dari 18 bulan di mana polanya GAGAL, dan kesimpulannya memakai kata “dijamin”. “Kami mengelola dana pensiun,” kata mereka. “Kami tidak membeli angka. Kami membeli KEPERCAYAAN pada proses yang menghasilkan angka itu.”",
        "Twist-nya: riset yang ditolak bukan karena salah hitung — melainkan karena tidak bisa DIPERCAYA. Di pasar institusional, metodologi yang transparan mengalahkan temuan yang spektakuler. Klien tidak membayar untuk jawaban; mereka membayar untuk keyakinan bahwa jawabanmu bisa diuji, direplikasi, dan — bila salah — salah dengan cara yang sudah kamu peringatkan sebelumnya.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: bedakan “riset yang benar” dari “riset yang bisa dipercaya”. Yang pertama soal angka; yang kedua soal PROSES — dan institusi hanya membeli yang kedua.",
      ],
      reference: "Pelajaran cerita: institusi membeli kepercayaan pada proses, bukan angka spektakuler.",
    },
    {
      id: "struktur",
      eyebrow: "Langkah 3 · Konsep",
      title: "Struktur Riset — Si Kerangka Baja",
      prose: [
        "Definisi: riset institusional punya struktur baku lima bagian. (1) TESIS: satu kalimat klaim utama (“net inflow stablecoin mendahului reli 7 hari”). (2) DATA PENDUKUNG: angka yang menopang tesis, masing-masing dengan sumber. (3) METODOLOGI: sumber data, periode sampel, definisi setiap metrik, batasan, dan cara mereplikasi — bagian yang membuat risetmu bisa diuji orang lain. (4) RISIKO & KETIDAKPASTIAN: kapan tesis GAGAL, seberapa besar ketidakpastiannya. (5) KESIMPULAN TERUKUR: apa yang bisa dan TIDAK bisa disimpulkan.",
        "Kepribadiannya: struktur ini seperti kerangka baja gedung — tidak terlihat dari luar, tetapi tanpanya bangunan roboh saat gempa pertama (pertanyaan kritis klien). Analis amatir membangun fasad yang indah (chart cantik, angka besar); analis institusional membangun fondasi yang membosankan (definisi, batasan, replikasi).",
        "Enam komponen metodologi yang diaudit di lab: sumber data, periode sampel, definisi metrik, batasan, replikasi (langkah yang cukup detail untuk diulang), dan risiko. Aturan praktis: bila analis kompeten tidak bisa mereplikasi hasilmu dari bagian metodologi saja, metodologimu belum selesai ditulis.",
        "Kapan memakai: setiap kali tulisanmu akan dibaca orang yang mempertaruhkan uang atau reputasi padanya. Untuk catatan internal cepat, versi ringkas (tesis + data + batasan) cukup — tetapi JANGAN pernah menghilangkan bagian batasan, bahkan di versi ringkas.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Metodologi itu formalitas — yang penting temuannya”",
        type: "pitfall",
        body: "Yang benar: di riset institusional, metodologi ADALAH temuannya — separuh nilainya. Temuan tanpa metodologi = anekdot mahal. Klien institusi membaca bagian metodologi DULU sebelum percaya satu angka pun; bila bagian itu tipis, sisa dokumen tidak dibaca. Bima belajar ini dengan cara yang mahal: tiga minggu kerja ditolak satu paragraf.",
      },
      hints: [
        "💡 Intuisi: tulis metodologi seolah pembacamu adalah rival yang ingin membuktikan kamu salah — karena memang itulah yang dilakukan tim riset klien institusi.",
      ],
      reference: "Lima bagian: tesis → data → metodologi → risiko → kesimpulan terukur. Enam komponen metodologi diaudit di lab.",
    },
    {
      id: "tiga-bahasa",
      eyebrow: "Langkah 4 · Konsep",
      title: "Tiga Bahasa Riset — Fakta, Opini, Proyeksi",
      prose: [
        "Definisi: setiap kalimat riset berbahasa salah satu dari tiga. FAKTA: klaim yang bisa diverifikasi (“volume spot BTC naik 40% dalam 30 hari”) — wajib disertai angka + sumber. OPINI: interpretasi analis (“kenaikan volume menandakan adopsi institusional”) — wajib ditandai sebagai interpretasi dan dipisahkan dari fakta. PROYEKSI: klaim tentang masa depan (“harga akan menembus ATH dalam 2 bulan”) — wajib disertai ketidakpastian dan kondisi yang bisa membatalkannya.",
        "Kepribadiannya: tiga bahasa ini seperti tiga seragam berbeda — pembaca harus tahu kapan kamu berbicara sebagai pencatat (fakta), penafsir (opini), atau peramal (proyeksi). Riset yang mencampur ketiganya tanpa penanda seperti tentara yang ganti seragam di tengah pertempuran: tidak ada yang tahu perintah siapa yang sedang dijalankan.",
        "Disiplinnya: (1) fakta tanpa angka pendukung = klaim kosong — lab mengaudit ini (“Miner capitulation sudah selesai” tanpa angka = ditandai); (2) opini tanpa label “menurut analisis kami” = fakta palsu; (3) proyeksi tanpa skenario gagal = ramalan, bukan riset. Uji cepat: sorot tiap kalimat drafmu dengan tiga warna — bila satu paragraf punya tiga warna tanpa pemisah, tulis ulang.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Opini analis senior tidak butuh bukti”",
        type: "pitfall",
        body: "Yang benar: senioritas TIDAK menggantikan disiplin bahasa. “Menurut pengalaman saya” bukan lisensi untuk menyajikan opini sebagai fakta. Justru analis senior dituntut LEBIH eksplisit menandai opininya — karena pembaca cenderung mempercayainya tanpa memeriksa. Di riset institusional, kredibilitas dibangun dengan menunjukkan batas pengetahuanmu, bukan menyembunyikannya.",
      },
      hints: [
        "💡 Intuisi: fakta = “apa yang terjadi”, opini = “apa artinya menurutku”, proyeksi = “apa yang mungkin terjadi”. Pembaca berhak tahu kapan kamu berganti peran — beri tahu mereka.",
      ],
      reference: "Fakta butuh angka+sumber; opini butuh label; proyeksi butuh ketidakpastian + kondisi pembatal.",
    },
    {
      id: "sitasi",
      eyebrow: "Langkah 5 · Konsep",
      title: "Sitasi Data On-Chain — Si Jejak Kertas",
      prose: [
        "Definisi: sitasi on-chain yang baik memuat EMPAT hal: (1) sumber (node sendiri? API? block explorer mana?), (2) tinggi blok atau rentang waktu PASTI (bukan “baru-baru ini”), (3) definisi metrik operasional (“volume = jumlah transfer ≥ Rp10 juta, tidak termasuk transfer internal exchange”), (4) tanggal akses — karena data label (mis. tag alamat) berubah seiring waktu.",
        "Kenapa ini istimewa untuk kripto: tidak seperti data survei yang tersembunyi di balik paywall, data on-chain BISA diverifikasi siapa pun — tetapi HANYA bila kamu memberi koordinat yang tepat. “Berdasarkan data blockchain” tanpa tinggi blok sama informatifnya dengan “berdasarkan buku di perpustakaan” tanpa judul dan halaman.",
        "Kepribadiannya: sitasi adalah jejak kertas yang kamu tinggalkan untuk rivalmu. Analis yang sitasinya lengkap sedang berkata: “Silakan periksa — saya tidak takut salah ketahuan.” Analis yang sitasinya samar sedang berkata sebaliknya, entah ia sadar atau tidak.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Cukup tulis ‘data on-chain’ — semua orang bisa cek sendiri”",
        type: "pitfall",
        body: "Yang benar: tanpa koordinat presisi (blok, definisi, tanggal akses), “cek sendiri” = “ulangi seluruh pekerjaan dari nol”. Itu bukan transparansi, itu pelemparan tanggung jawab. Standar institusional: pembaca yang kompeten harus bisa mencapai angka yang SAMA (dalam toleransi wajar) hanya dari bagian metodologi + sitasi.",
      },
      hints: [
        "💡 Intuisi: sitasi yang baik seperti pin lokasi, bukan “di sekitar Jakarta”. Presisi adalah sopan santun terhadap waktu pembacamu.",
      ],
      reference: "Empat unsur sitasi: sumber, tinggi blok/waktu, definisi metrik, tanggal akses.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 6 · Konsep",
      title: "Empat Jebakan Klasik — Si Pembunuh Kredibilitas",
      prose: [
        "Jebakan 1 — CHERRY-PICKING JENDELA WAKTU: memilih periode yang mendukung tesis (“lihat, 2024 polanya sempurna!”) sambil menyembunyikan periode gagal. Obatnya: laporkan SELURUH periode yang diuji, termasuk yang gagal — seperti Bima yang menyembunyikan 4 bulan gagal dari 18 bulan.",
        "Jebakan 2 — SURVIVORSHIP BIAS: menganalisis hanya koin yang masih hidup. “Strategi ini return 300% di 50 koin top” — tanpa menyebut 200 koin yang mati di tengah jalan dan akan memegang sebagian portofolio strategi itu. Obatnya: sertakan yang mati, atau nyatakan eksplisit bahwa analisismu bersyarat pada survival.",
        "Jebakan 3 — METRIK TANPA DEFINISI: “aktivitas jaringan naik 2x” — aktivitas apa? Alamat aktif? Jumlah transaksi? Volume? Definisi yang berbeda memberi jawaban berbeda; tanpa definisi, angka tidak bisa diuji. Obatnya: definisikan setiap metrik di metodologi (lihat langkah 5).",
        "Jebakan 4 — OVERCLAIM: kata-kata kepastian (“pasti”, “dijamin”, “tanpa risiko”, “tidak mungkin gagal”) di dokumen tentang masa depan yang tidak pasti. Lab menghitungnya: 4 kemunculan dalam satu paragraf pendek = draf yang belum layak kirim. Obatnya: ganti dengan bahasa probabilitas (“cenderung”, “dengan keyakinan X%”, “kecuali kondisi Y”).",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Sedikit melebih-lebihkan itu wajar dalam marketing riset”",
        type: "pitfall",
        body: "Yang benar: di riset institusional, satu overclaim yang ketahuan membunuh SEMUA klaim lain — termasuk yang valid. Klien berpikir: “kalau bagian ini dibesar-besarkan, bagian mana lagi?” Kehati-hatian berbahasa bukan kelemahan; ia adalah mata uang kepercayaan. Riset yang jujur tentang ketidakpastiannya justru dihargai lebih mahal.",
      },
      hints: [
        "💡 Intuisi: overclaim seperti pemanis buatan — sedikit membuat enak dibaca, tetapi pembaca institusi bisa menciumnya dari kejauhan, dan sekali tercium, seluruh hidangan dicurigai.",
      ],
      reference: "Empat jebakan: cherry-picking, survivorship, metrik tanpa definisi, overclaim. Obat umum: transparansi + bahasa probabilitas.",
    },
    {
      id: "lab-audit",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab — Audit draf riset seperti klien institusi",
      prose: [
        "Waktunya jadi tim riset klien yang menolak draf Bima. Di bawah ada draf mini SINTETIS: 5 klaim, 1 paragraf narasi, dan 1 bagian metodologi. Tugasmu: tulis tiga fungsi — `audit_klaim(klaim)` (kembalikan klaim FAKTA tanpa angka pendukung + OPINI tanpa penanda), `hitung_overclaim(teks, daftar)` (dict kata → jumlah kemunculan), dan `skor_metodologi(teks, komponen)` (skor 0–100 + daftar komponen yang hadir) — lalu cetak ringkasannya.",
        "Coba: setelah lolos, tambahkan kata “pasti” dua kali lagi ke DRAF dan lihat total overclaim berubah. Lalu hapus “batasan” dari DRAF_METODE dan lihat skornya turun — rasakan bagaimana satu komponen yang hilang langsung terlihat di angka.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `audit_klaim(klaim)`: kembalikan (list fakta tanpa angka, list opini) — opini selalu butuh penanda eksplisit" },
        { id: "t2", text: "Lengkapi `hitung_overclaim(teks, daftar)`: dict kata → jumlah kemunculan (case-insensitive)" },
        { id: "t3", text: "Lengkapi `skor_metodologi(teks, komponen)`: (skor persen 1 desimal, list komponen yang hadir)" },
        { id: "t4", text: "Jalankan dan pastikan ringkasan tercetak: 1 klaim bermasalah, 4 overclaim, skor 66,7" },
      ],
      expected: "klaim_bermasalah=1  overclaim=4  skor_metodologi=66.7",
      hints: [
        "💡 Untuk t1: fakta bermasalah = `tipe == \"fakta\" and not ada_angka`; opini selalu masuk daftar (tidak ada penanda di data ini).",
        "💡 Untuk t2: ubah teks ke huruf kecil dulu dengan `.lower()`, lalu `teks.count(kata)` per kata.",
      ],
      code: {
        starter: `# Draf mini sintetis untuk diaudit
KLAIM = [
    {"teks": "Volume spot BTC naik 40% dalam 30 hari", "tipe": "fakta", "ada_angka": True},
    {"teks": "Kenaikan volume menandakan adopsi institusional", "tipe": "opini", "ada_angka": False},
    {"teks": "Harga akan menembus ATH dalam 2 bulan", "tipe": "proyeksi", "ada_angka": False},
    {"teks": "Korelasi BTC-ETH periode krisis = 0,90", "tipe": "fakta", "ada_angka": True},
    {"teks": "Miner capitulation sudah selesai", "tipe": "fakta", "ada_angka": False},
]
OVERCLAIM = ["pasti", "dijamin", "tanpa risiko", "tidak mungkin gagal"]
DRAF = "Riset ini pasti benar. Dana dijamin aman. Volume naik 40% dalam 30 hari. Strategi kami tanpa risiko dan tidak mungkin gagal mengungguli pasar."
METODOLOGI = ["sumber data", "periode sampel", "definisi metrik", "batasan", "replikasi", "risiko"]
DRAF_METODE = "Sumber data: node internal. Periode sampel: Jan-Jun 2026. Batasan: data satu bursa. Risiko: volatilitas tinggi."

# TULIS KODEMU
def audit_klaim(klaim):
    hasil = 

def hitung_overclaim(teks, daftar):
    hasil = 

def skor_metodologi(teks, komponen):
    hasil = 

tanpa_angka, opini = audit_klaim(KLAIM)
oc = hitung_overclaim(DRAF, OVERCLAIM)
skor, hadir = skor_metodologi(DRAF_METODE, METODOLOGI)
print(f"klaim_bermasalah={len(tanpa_angka)}  overclaim={sum(oc.values())}  skor_metodologi={skor}")`,
        lockLines: 11,
        solution: `# Draf mini sintetis untuk diaudit
KLAIM = [
    {"teks": "Volume spot BTC naik 40% dalam 30 hari", "tipe": "fakta", "ada_angka": True},
    {"teks": "Kenaikan volume menandakan adopsi institusional", "tipe": "opini", "ada_angka": False},
    {"teks": "Harga akan menembus ATH dalam 2 bulan", "tipe": "proyeksi", "ada_angka": False},
    {"teks": "Korelasi BTC-ETH periode krisis = 0,90", "tipe": "fakta", "ada_angka": True},
    {"teks": "Miner capitulation sudah selesai", "tipe": "fakta", "ada_angka": False},
]
OVERCLAIM = ["pasti", "dijamin", "tanpa risiko", "tidak mungkin gagal"]
DRAF = "Riset ini pasti benar. Dana dijamin aman. Volume naik 40% dalam 30 hari. Strategi kami tanpa risiko dan tidak mungkin gagal mengungguli pasar."
METODOLOGI = ["sumber data", "periode sampel", "definisi metrik", "batasan", "replikasi", "risiko"]
DRAF_METODE = "Sumber data: node internal. Periode sampel: Jan-Jun 2026. Batasan: data satu bursa. Risiko: volatilitas tinggi."

# TULIS KODEMU
def audit_klaim(klaim):
    tanpa_angka = [k["teks"] for k in klaim if k["tipe"] == "fakta" and not k["ada_angka"]]
    opini = [k["teks"] for k in klaim if k["tipe"] == "opini"]
    return tanpa_angka, opini

def hitung_overclaim(teks, daftar):
    tl = teks.lower()
    return {w: tl.count(w) for w in daftar if w in tl}

def skor_metodologi(teks, komponen):
    tl = teks.lower()
    hadir = [k for k in komponen if k in tl]
    return round(len(hadir) / len(komponen) * 100, 1), hadir

tanpa_angka, opini = audit_klaim(KLAIM)
oc = hitung_overclaim(DRAF, OVERCLAIM)
skor, hadir = skor_metodologi(DRAF_METODE, METODOLOGI)
print(f"klaim_bermasalah={len(tanpa_angka)}  overclaim={sum(oc.values())}  skor_metodologi={skor}")`,
        checks: [
          { kind: "equal", task: "t1", name: "tanpa_angka", value: ["Miner capitulation sudah selesai"], label: "Fakta tanpa angka terdeteksi", msg: "Satu-satunya fakta tanpa angka pendukung." },
          { kind: "equal", task: "t1", name: "opini", value: ["Kenaikan volume menandakan adopsi institusional"], label: "Opini terdeteksi", msg: "Opini butuh penanda eksplisit." },
          { kind: "equal", task: "t2", name: "oc", value: {"pasti": 1, "dijamin": 1, "tanpa risiko": 1, "tidak mungkin gagal": 1}, label: "4 overclaim terhitung", msg: "pasti, dijamin, tanpa risiko, tidak mungkin gagal — masing-masing 1x." },
          { kind: "equal", task: "t3", name: "skor", value: 66.7, tol: 0.05, label: "Skor metodologi 66,7", msg: "4 dari 6 komponen hadir; definisi metrik & replikasi hilang." },
          { kind: "equal", task: "t3", name: "hadir", value: ["sumber data", "periode sampel", "batasan", "risiko"], label: "Komponen yang hadir benar", msg: "Urutan sesuai daftar METODOLOGI." },
          { kind: "stdout_matches", task: "t4", pattern: "klaim_bermasalah=1\\s+overclaim=4\\s+skor_metodologi=66\\.7", label: "`print` menampilkan ringkasan", msg: "Format: klaim_bermasalah=...  overclaim=...  skor_metodologi=...." },
        ],
      },
      reference: "Audit: fakta butuh angka, opini butuh label, overclaim dihitung, metodologi diskor.",
    },
    {
      id: "chart-skor",
      eyebrow: "Langkah 8 · Visual",
      title: "Membaca chart skor kelengkapan",
      prose: [
        "Cara membaca: tiap baris = satu komponen metodologi; batang penuh = terdokumentasi di draf, batang pendek = hilang. Interpretasi: draf Bima versi lab mendapat 66,7% — dua komponen hilang (definisi metrik, replikasi) tepat di bagian yang membuat riset bisa DIUJI orang lain. Inilah visual dari penolakan klien: bukan angkanya yang kurang, melainkan fondasinya yang berlubang.",
        "Aturan praktis untuk drafmu sendiri: jalankan audit ini SEBELUM mengirim — skor di bawah 85% = belum layak ke klien institusi. Dua komponen yang paling sering hilang (definisi metrik, replikasi) juga yang paling menentukan kepercayaan.",
      ],
      figure: {
        svg: SKOR_SVG,
        alt: "Diagram batang horizontal: 4 dari 6 komponen metodologi hadir, skor 66,7%.",
        caption: "Skor kelengkapan metodologi draf lab (ilustrasi pola). Yang hilang = yang membuat riset bisa diuji.",
      },
      tasks: [],
      reference: "Visual: batang penuh = ada, pendek = hilang. Target institusional: ≥85%.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta Keputusan",
      title: "Peta keputusan: seberapa formal risetmu harus?",
      prose: [
        "Skenario 1 — Catatan internal tim (keputusan cepat, pembaca = rekanmu): cukup tesis + data + batasan satu paragraf. Syarat: batasan TIDAK boleh hilang bahkan di versi ringkas.",
        "Skenario 2 — Riset untuk klien institusi (dana pensiun, manajer aset): struktur penuh lima bagian + sitasi presisi + skor metodologi ≥85%. Ini standar Bima — tidak bisa ditawar.",
        "Skenario 3 — Publikasi publik/blog (pembaca campuran): struktur penuh tetapi bahasa lebih lugas; waspadai overclaim — publik tidak punya tim riset untuk memverifikasimu, jadi tanggung jawabmu lebih besar, bukan lebih kecil.",
        "Skenario 4 — Proyeksi harga (“kapan ATH?”): hanya bila kamu berani menulis KONDISI PEMBATAL + tingkat keyakinan. Tanpa keduanya, itu ramalan — dan ramalan bukan riset.",
        "Aturan 10 detik: tanyakan “siapa yang mempertaruhkan apa atas tulisan ini?” — makin besar taruhannya, makin formal strukturnya; tetapi batasan dan bahasa jujur wajib di semua level.",
      ],
      tasks: [],
      reference: "Taruhan kecil → ringkas (batasan tetap ada). Taruhan besar → struktur penuh + ≥85%.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: thread viral yang harus diverifikasi",
      prose: [
        "Seorang influencer kripto memposting thread: “DATA: 90% holder BTC sedang profit! Bull run dikonfirmasi. Dijamin aman masuk sekarang.” Thread-nya viral — 50 ribu like. Seorang manajer dana memintamu memverifikasi sebelum kliennya ikut-ikutan. Kamu menjalankan audit tiga bahasa + checklist:",
        "Temuanmu: (1) “90% holder profit” = FAKTA tanpa sumber, tanpa definisi “holder” (alamat aktif? semua alamat termasuk yang hilang?), tanpa tinggi blok — klaim kosong; (2) “bull run dikonfirmasi” = OPINI yang disajikan sebagai fakta — tidak ada label interpretasi; (3) “dijamin aman” = OVERCLAIM ganda (dijamin + aman absolut) atas masa depan; (4) metodologi = NOL — tidak ada satu pun komponen yang bisa diaudit.",
        "Rekomendasimu ke manajer dana: JANGAN jadikan dasar keputusan; bila klien bertanya, tunjukkan hasil audit — bukan untuk “membantah”, melainkan untuk menunjukkan bahwa thread itu tidak memenuhi standar bukti minimum. Pelajaran mini-case: virality ≠ validitas. Justru konten paling viral paling butuh diaudit — karena paling banyak orang yang akan bertindak atasnya.",
      ],
      tasks: [],
      reference: "Audit thread: fakta tanpa sumber + opini tanpa label + overclaim + metodologi nol = tidak layak jadi dasar keputusan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca alasannya bahkan untuk jawaban yang kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Struktur institusional: tesis → data pendukung → metodologi → risiko & ketidakpastian → kesimpulan terukur; metodologi adalah separuh nilai riset.",
        "Tiga bahasa: fakta butuh angka + sumber; opini butuh label eksplisit; proyeksi butuh ketidakpastian + kondisi pembatal.",
        "Sitasi on-chain: sumber, tinggi blok/waktu, definisi metrik operasional, tanggal akses — presisi adalah sopan santun.",
        "Empat jebakan: cherry-picking jendela, survivorship bias, metrik tanpa definisi, overclaim — obatnya transparansi + bahasa probabilitas.",
        "Audit draf sebelum kirim: fakta tanpa angka, opini tanpa label, hitung overclaim, skor metodologi (target ≥85% untuk klien institusi).",
        "Institusi membeli kepercayaan pada proses, bukan angka spektakuler.",
      ],
      quiz: [
        {
          q: "Mengapa klien institusi menolak riset Bima padahal angkanya benar?",
          options: [
            { text: "Angkanya sebenarnya salah hitung", why: "Salah: cerita menegaskan temuannya solid dan datanya rapi. Penolakan bukan soal aritmetika." },
            { text: "Metodologinya tidak transparan — tidak bisa diverifikasi, direplikasi, atau dinilai batasnya", why: "Benar: tanpa sumber data, definisi operasional, periode gagal yang dilaporkan, dan dengan kata “dijamin” — klien membeli kepercayaan pada proses, dan prosesnya tidak terlihat.", correct: true },
            { text: "Risetnya terlalu panjang (40 halaman)", why: "Salah: panjang bukan masalahnya — klien institusi justru membaca dokumen panjang. Masalahnya kelengkapan, bukan volume." },
            { text: "Temuannya tidak cukup spektakuler", why: "Salah: temuannya justru kuat. Institusi tidak mencari sensasi — mereka mencari sesuatu yang bisa dipertanggungjawabkan ke komite investasi." },
          ],
        },
        {
          q: "Kalimat: “Adopsi institusional meningkat pesat.” Masalahnya menurut disiplin tiga bahasa?",
          options: [
            { text: "Tidak ada masalah — ini fakta umum", why: "Salah: “meningkat pesat” tanpa angka, tanpa periode, tanpa sumber = klaim kosong berkedok fakta." },
            { text: "Ini opini/fakta-campuran tanpa angka pendukung dan tanpa penanda interpretasi", why: "Benar: “pesat” adalah penilaian (opini) yang disajikan sebagai fakta, tanpa satu angka pun. Perbaikannya: beri angka + sumber, atau tandai sebagai interpretasi.", correct: true },
            { text: "Masalahnya hanya pilihan kata “pesat”", why: "Salah: bukan soal satu kata — soal tidak adanya BUKTI apa pun di balik klaim kuantitatif." },
            { text: "Kalimatnya terlalu pendek", why: "Salah: panjang kalimat tidak relevan dengan disiplin bukti." },
          ],
        },
        {
          q: "Sitasi on-chain mana yang memenuhi standar institusional?",
          options: [
            { text: "“Berdasarkan data blockchain, volume naik.”", why: "Salah: tanpa sumber, tanpa waktu, tanpa definisi volume — tidak bisa diverifikasi." },
            { text: "“Volume (transfer ≥ Rp10 juta, tidak termasuk transfer internal exchange; sumber: node internal, blok 840.000–845.000, diakses 12 Okt 2026) naik 40%.”", why: "Benar: empat unsur lengkap — definisi operasional, sumber, rentang blok pasti, tanggal akses. Analis lain bisa mereplikasi.", correct: true },
            { text: "“Menurut block explorer, volume naik 40%.”", why: "Salah: “block explorer” bukan sumber spesifik; tidak ada rentang waktu/blok dan definisi." },
            { text: "“Volume naik 40% (data 2026).”", why: "Salah: “2026” terlalu kasar untuk data yang berubah per blok; definisi volume tidak ada." },
          ],
        },
        {
          q: "Backtest strategimu atas 60 koin yang masih diperdagangkan dari 100 koin top 2021 menunjukkan return fantastis. Masalah terbesarnya?",
          options: [
            { text: "Sampel 60 koin terlalu kecil", why: "Salah: 60 bukan masalah jumlah — masalahnya SELEKSI. 60 koin acak 2021 valid; 60 survivor tidak." },
            { text: "Survivorship bias — 40 koin yang mati hilang dari dataset", why: "Benar: strategi nyata 2021 akan memegang sebagian dari 40 koin yang mati dan menanggung kerugiannya. Hasil hanya milik para pemenang.", correct: true },
            { text: "Data 2021 sudah kedaluwarsa", why: "Salah: usia data bukan masalah utama — bias seleksinya. Data lama yang lengkap tetap berguna." },
            { text: "Return fantastis pasti berarti overfitting", why: "Salah: mungkin, tetapi bukan masalah TERBESAR yang pasti ada di sini — survivorship bias sudah pasti mencemari hasil." },
          ],
        },
        {
          q: "Draf risetmu mendapat skor metodologi 66,7% (definisi metrik & replikasi hilang). Tindakan yang tepat sebelum kirim ke klien institusi?",
          options: [
            { text: "Kirim saja — 66,7% sudah di atas rata-rata", why: "Salah: tidak ada “rata-rata” yang relevan; standar institusional ≥85%. Mengirim di bawah standar = mengulangi kesalahan Bima." },
            { text: "Lengkapi dulu dua komponen yang hilang, audit ulang sampai ≥85%", why: "Benar: definisi metrik dan replikasi adalah fondasi keterujian — tanpa keduanya riset tidak bisa dipercaya klien institusi.", correct: true },
            { text: "Hapus bagian metodologi agar skornya tidak terlihat", why: "Salah: menyembunyikan kelemahan bukan memperbaikinya — dan klien institusi justru membaca bagian itu duluan." },
            { text: "Tambahkan lebih banyak chart agar terlihat lengkap", why: "Salah: kosmetik tidak menaikkan skor substansi. Chart tanpa definisi metrik = ilustrasi, bukan bukti." },
          ],
        },
      ],
      next: { label: "BCD25 — Regulasi Kripto Indonesia: OJK, PPATK, dan Kewajiban Exchange", href: "/v2/learn/bcd25-regulasi-kripto-indonesia" },
    },
  ],
};
