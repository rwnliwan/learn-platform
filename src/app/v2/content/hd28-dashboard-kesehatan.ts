import type { V2Lesson } from "../lib/types";

// ── Figure: readmisi 30 hari per bangsal vs ambang 10% (sintetis) ─────────
const READM_SVG = `<svg viewBox="0 0 520 240" role="img" aria-label="Diagram batang readmisi 30 hari per bangsal: Anak 5 persen, Bedah 10 persen, Penyakit Dalam 15 persen, ambang 10 persen">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="120" y1="30" x2="120" y2="190"/>
<line x1="120" y1="190" x2="500" y2="190"/>
</g>
<line x1="120" y1="110" x2="500" y2="110" stroke="var(--c3)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="496" y="102" text-anchor="end" font-size="11" fill="var(--c3)" font-family="var(--font-ui)">ambang 10%</text>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">
<text x="110" y="114" text-anchor="end">10%</text>
<text x="110" y="154" text-anchor="end">5%</text>
<text x="110" y="195" text-anchor="end">0%</text>
</g>
<g>
<rect x="160" y="150" width="80" height="40" rx="4" fill="var(--c1)"/>
<text x="200" y="142" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">5,0%</text>
<text x="200" y="208" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Anak</text>
<rect x="290" y="110" width="80" height="80" rx="4" fill="var(--c2)"/>
<text x="330" y="102" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">10,0%</text>
<text x="330" y="208" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Bedah</text>
<rect x="420" y="70" width="80" height="120" rx="4" fill="var(--c4)"/>
<text x="460" y="62" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">15,0%</text>
<text x="460" y="208" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Penyakit Dalam</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="470" y="228">data sintetis</text>
</g>
<text x="160" y="22" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Readmisi 30 hari per bangsal, Oktober 2026</text>
</svg>`;

export const hd28: V2Lesson = {
  slug: "hd28-dashboard-kesehatan",
  track: "Health Data Science",
  module: "Tooling & Tata Kelola Data",
  title: "Dashboard Kesehatan: Tableau, Power BI, dan Angka yang Jujur",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Semua lampu hijau — kecuali yang tidak diukur",
      prose: [
        "Di lobi RS Sehat Sentosa terpasang layar besar: dashboard operasional. Semua indikator hijau — BOR 82%, rata-rata lama rawat 3,5 hari, kepuasan pasien 4,6 dari 5. Direktur tersenyum setiap melewatinya. Lalu datang surat dari BPJS Kesehatan: angka readmisi 30 hari RS ini termasuk 10% tertinggi di wilayahnya. Direktur terkejut — “kok tidak ada di dashboard?”",
        "Twist-nya: dashboard itu tidak berbohong — ia hanya mengukur yang mudah diukur. BOR, LOS, dan skor kepuasan memang hijau; tetapi metrik yang menentukan mutu klinis dan biaya (readmisi, mortalitas tersesuaikan, infeksi nosokomial) tidak masuk layar karena “datanya susah”. Dashboard yang hanya menampilkan kabar baik bukan alat manajemen — ia dekorasi. Lowongan analis data kesehatan 2026 meminta Tableau/Power BI eksplisit justru untuk peran seperti ini: membangun dashboard yang berani menampilkan angka yang tidak nyaman, dengan definisi metrik yang bisa dipertahankan.",
        "Lesson ini mengajarkan tiga hal: metrik apa yang layak masuk dashboard kesehatan, bagaimana memodelkan data agar dashboard-nya benar, dan jebakan desain yang membuat dashboard menyesatkan — plus kapan memilih Tableau vs Power BI.",
      ],
      tasks: [],
      note: {
        title: "Kenapa dashboard adalah ujian integritas analis",
        type: "risk",
        body: "Dashboard adalah satu-satunya “wajah data” yang dilihat pimpinan setiap hari. Metrik yang dipilih analis menentukan perilaku seluruh organisasi: ukur BOR saja, manajer akan mengisi tempat tidur; ukur readmisi, mereka akan memperbaiki discharge planning. Analis dashboard tidak sekadar memvisualkan data — ia merancang insentif. Salah memilih metrik berarti merancang insentif yang salah untuk ratusan orang.",
      },
      reference: "Dashboard hijau ≠ layanan baik. Ukur yang menentukan mutu, bukan yang mudah diukur.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menghitung tiga metrik inti RS — BOR, ALOS, dan readmisi 30 hari — dari data mentah beserta definisinya; (2) merancang model data star schema sederhana (tabel fakta + dimensi) untuk dashboard; (3) memutuskan kapan memakai Tableau vs Power BI untuk konteks Indonesia; (4) mengenali tiga jebakan visualisasi yang membuat dashboard menyesatkan.",
        "Rutenya: cerita → tujuan + bekal → tiga konsep (model data, metrik inti, desain & tooling) → lab Python (hitung metrik + siapkan tabel dashboard) → chart readmisi per bangsal dengan panduan baca → peta keputusan → mini-case dashboard untuk direktur → kuis → rangkuman. Estimasi 60 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, agregasi: BOR dan kawan-kawannya adalah rasio dari dua angka agregat (pembilang/penyebut) — definisi penyebutnya menentukan kejujuran angkanya. Kedua, data relasional: tabel fakta (kejadian: tiap kunjungan satu baris) vs tabel dimensi (master: daftar bangsal, daftar diagnosis). Ketiga, SQL dasar dari lesson sebelumnya — query adalah bahan baku setiap visual di dashboard.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: dashboard yang baik menjawab pertanyaan keputusan, bukan memamerkan data. Sebelum memilih chart, tulis dulu pertanyaannya: “bangsal mana yang butuh intervensi bulan ini?” — baru tentukan metrik dan visualnya.",
      ],
      reference: "Bekal: (1) metrik = rasio, penyebut menentukan kejujuran; (2) fakta vs dimensi; (3) query = bahan baku visual.",
    },
    {
      id: "konsep-model",
      eyebrow: "Langkah 3 · Konsep",
      title: "Star schema — fondasi dashboard yang tidak berbohong",
      prose: [
        "Definisi: star schema adalah pola pemodelan data untuk analitik: satu tabel FAKTA di tengah (mencatat kejadian — tiap baris = satu kunjungan, berisi kunci asing + ukuran numerik seperti hari_rawat), dikelilingi tabel DIMENSI (master yang jarang berubah: dim_waktu, dim_bangsal, dim_diagnosis, dim_pasien). Query dashboard hampir selalu berbentuk: agregasi dari tabel fakta, dikelompokkan berdasarkan kolom dimensi.",
        "Kepribadiannya: star schema adalah dapur restoran yang tertata. Tabel fakta adalah bahan mentah yang terus datang; tabel dimensi adalah rak bumbu berlabel. Koki (query) bisa meracik hidangan apa pun dengan cepat karena tahu persis bahan ada di mana. Lawannya — satu tabel raksasa hasil join semua — adalah dapur berantakan: setiap query harus memilah ulang, dan duplikasi master (nama bangsal ditulis tiga ejaan berbeda) meracuni semua angka.",
        "Kapan memakai: setiap kali dashboard mengambil dari lebih dari satu sumber atau butuh agregasi lintas dimensi (per bangsal per bulan). Untuk dashboard satu-tabel-satu-sumber yang kecil, star schema berlebihan — tabel datar cukup. Aturannya: kompleksitas model mengikuti kompleksitas pertanyaan, bukan gengsi arsitektur.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Tinggal sambungkan dashboard ke database operasional — beres”",
        type: "pitfall",
        body: "Yang benar: database operasional (OLTP) dioptimalkan untuk transaksi — tulis cepat, bukan baca agregat. Query dashboard yang berat di database operasional bisa MEMPERLAMBAT sistem pendaftaran pasien. Praktik yang benar: salin data ke gudang/lapis analitik (bisa sesederhana tabel agregat harian), dan dashboard membaca dari sana. Dashboard yang membuat sistem pendaftaran macet adalah kegagalan arsitektur, bukan keberhasilan visualisasi.",
      },
      hints: [
        "💡 Intuisi: kalau satu metrik di dashboard butuh join 6 tabel dan 40 baris SQL, itu sinyal model datanya salah — bukan query-nya yang kurang pintar. Perbaiki modelnya (buat tabel agregat), bukan query-nya.",
      ],
      reference: "Fakta = kejadian (satu baris per kunjungan). Dimensi = master (bangsal, waktu, diagnosis). Dashboard baca dari lapis analitik, bukan database transaksi.",
    },
    {
      id: "konsep-metrik",
      eyebrow: "Langkah 4 · Konsep",
      title: "BOR, ALOS, readmisi — tiga metrik yang menentukan nasib RS",
      prose: [
        "Definisi: tiga metrik inti operasional-klinis RS. BOR (Bed Occupancy Rate) = tingkat hunian tempat tidur. ALOS (Average Length of Stay) = rata-rata lama rawat. Readmisi 30 hari = proporsi pasien yang kembali dirawat dalam 30 hari setelah pulang — proksi mutu discharge dan kesinambungan perawatan.",
        "Kepribadiannya: BOR adalah manajer yang obsesif pada utilisasi — BOR tinggi terlihat efisien, tetapi BOR > 85% konsisten berarti RS tidak punya buffer untuk lonjakan (wabah, bencana). ALOS adalah akuntan waktu — terlalu panjang berarti inefisiensi, terlalu pendek berarti pasien dipulangkan prematur. Readmisi adalah auditor jujur — ia tidak peduli seberapa bagus laporanmu; ia mengukur apakah pasien benar-benar sembuh. Ketiganya harus dibaca BERSAMAAN: BOR tinggi + ALOS turun + readmisi naik = efisiensi semu yang dibayar dengan mutu.",
        "Kapan memakai: BOR untuk perencanaan kapasitas; ALOS untuk efisiensi proses klinis; readmisi untuk mutu dan — di banyak sistem — dasar penalti/insentif pembayaran. Di dashboard direksi, ketiganya wajib satu layar: metrik tunggal selalu bisa di-game.",
      ],
      formula: String.raw`\text{BOR} = \frac{\text{hari perawatan}}{\text{TT} \times \text{hari kalender}} \times 100\%`,
      formulaNote: "BOR = Bed Occupancy Rate (%). Pembilang = total hari perawatan (jumlahkan lama rawat semua pasien). Penyebut = TT × hari kalender, dengan TT = jumlah tempat tidur operasional dan hari kalender = jumlah hari dalam periode (mis. 30). Contoh: 700 hari perawatan / (30 TT × 31 hari) × 100% = 75,3%. Catatan jujur: BOR bisa > 100% bila ada tempat tidur darurat — dashboard yang baik menandai anomali ini, bukan menyembunyikannya.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “BOR 95% = RS hebat”",
        type: "pitfall",
        body: "Yang benar: BOR sangat tinggi justru RED FLAG kapasitas. RS tanpa buffer tidak bisa menyerap lonjakan pasien — standar perencanaan memakai ambang ~85%: di atas itu, tambah kapasitas atau alihkan rujukan elektif. Manajer yang mengejar BOR 100% sedang mengorbankan ketahanan sistem demi angka. Dashboard yang jujur mewarnai BOR > 85% sebagai peringatan, bukan prestasi.",
      },
      hints: [
        "💡 Intuisi: setiap metrik punya “pasangan pengawas”. BOR diawasi ALOS dan readmisi; cakupan imunisasi diawasi angka drop-out antar dosis. Metrik tanpa pasangan pengawas adalah undangan untuk di-game.",
      ],
      reference: "BOR = hunian (waspadai >85%). ALOS = lama rawat. Readmisi 30 hari = proksi mutu. Baca ketiganya bersamaan.",
    },
    {
      id: "konsep-desain",
      eyebrow: "Langkah 5 · Konsep",
      title: "Tableau vs Power BI — dan tiga jebakan desain",
      prose: [
        "Definisi tooling: Tableau dan Power BI adalah platform BI untuk membangun dashboard interaktif dari model data. Tableau unggul pada eksplorasi visual yang fleksibel dan komunitas visualisasi yang kuat; Power BI unggul pada integrasi ekosistem Microsoft (Excel, Azure, Teams) dan biaya — Power BI Desktop gratis, lisensi Pro/Premium yang berbayar saat dashboard dibagikan ke banyak pengguna.",
        "Keputusan untuk Indonesia: pilih Power BI bila organisasimu sudah di ekosistem Microsoft (mayoritas RS dan Dinkes memakai Excel/Office) dan anggaran terbatas — kurva belajar analis Excel lebih landai. Pilih Tableau bila kebutuhan utamanya eksplorasi visual kompleks atau tim analis sudah terbiasa. Untuk peran analis junior: kuasai SALAH SATU sampai mahir (konsepnya 80% sama: model data, DAX/L calculated fields, filter konteks), karena lowongan meminta “Tableau/Power BI” sebagai bukti kamu bisa membangun dashboard end-to-end — bukan koleksi sertifikat.",
        "Tiga jebakan desain yang membuat dashboard menyesatkan. Pertama, sumbu yang tidak mulai dari nol pada bar chart — selisih 2% terlihat seperti jurang. Kedua, agregasi yang menutupi disparitas: rata-rata nasional 90% bisa menyembunyikan kabupaten 50% — dashboard kesehatan WAJIB punya drill-down per wilayah/faskes. Ketiga, metrik tanpa definisi: “kepatuhan 92%” tanpa tooltip definisi (pembilang? penyebut? periode?) adalah angka hiasan. Obat ketiganya: sumbu jujur, selalu sediakan perincian, dan setiap angka punya definisi satu klik.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Dashboard real-time selalu lebih baik”",
        type: "pitfall",
        body: "Yang benar: real-time hanya berguna untuk keputusan real-time (keterisian IGD, antrean). Untuk metrik mutu (readmisi, mortalitas), refresh harian atau mingguan justru LEBIH tepat — angka yang berubah tiap menit mengundang reaksi berlebihan terhadap noise. Tanyakan dulu “keputusan apa yang diambil dari angka ini dan seberapa sering?” sebelum menentukan frekuensi refresh. Dashboard IGD real-time + dashboard mutu mingguan = arsitektur yang benar, bukan satu dashboard untuk semua.",
      },
      hints: [
        "💡 Intuisi kedua: aturan “5 detik” — pimpinan harus paham satu layar dashboard dalam 5 detik. Kalau butuh penjelasan, yang salah adalah desainnya. Satu layar = satu pertanyaan keputusan = maksimal 4–6 visual.",
      ],
      reference: "Power BI = ekosistem Microsoft + hemat; Tableau = eksplorasi visual. Jebakan: sumbu tak jujur, agregat menutupi disparitas, metrik tanpa definisi.",
    },
    {
      id: "lab-metrik",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Hitung metrik dashboard dari data mentah",
      prose: [
        "Waktunya menjadi analis dashboard. Di bawah ada data SINTETIS satu bulan RS Sehat Sentosa: tiga bangsal dengan tempat tidur, hari perawatan, pasien pulang, dan readmisi 30 hari. Tugasmu: hitung BOR, ALOS, dan readmisi 30 hari per bangsal, lalu tentukan bangsal prioritas intervensi — persis bahan baku satu layar dashboard direksi.",
        "Coba: setelah lolos, ubah ambang flag dari 10% menjadi 8% — bangsal apa yang ikut ter-flag? Lalu hitung BOR gabungan RS (total hari perawatan / total kapasitas): apakah angka gabungan menyembunyikan sesuatu? Itulah kenapa drill-down per bangsal wajib ada.",
      ],
      tasks: [
        { id: "t1", text: "Isi `bor` = dict bangsal → BOR (%) = hari_rawat / (tt × 31) × 100" },
        { id: "t2", text: "Isi `alos` = dict bangsal → ALOS (hari) = hari_rawat / pulang" },
        { id: "t3", text: "Isi `readm` = dict bangsal → readmisi 30 hari (%) = readmisi / pulang × 100" },
        { id: "t4", text: "Isi `prioritas` = list bangsal dengan readmisi > 10%, cetak ringkasan + flag" },
      ],
      expected: "BOR: Anak=87.1% Bedah=75.3% Dalam=84.7%\nALOS: Anak=3.0 Bedah=3.3 Dalam=4.0 hari\nReadmisi30: Anak=5.0% Bedah=10.0% Dalam=15.0%\nflag: Penyakit Dalam — readmisi tertinggi (15.0%), prioritaskan audit discharge",
      code: {
        starter: `# Data SINTETIS RS Sehat Sentosa, Oktober 2026 (31 hari; angka dibuat untuk latihan)
# bangsal: (tempat_tidur, hari_perawatan, pasien_pulang, readmisi_30hari)
data = {
    "Anak": (20, 540, 180, 9),
    "Bedah": (30, 700, 210, 21),
    "Dalam": (40, 1050, 260, 39),
}
HARI = 31
AMBANG_READMISI = 10.0  # persen

# TULIS KODEMU
bor =
alos =
readm =
prioritas =

print("BOR: " + " ".join(f"{k}={v:.1f}%" for k, v in bor.items()))
print("ALOS: " + " ".join(f"{k}={v:.1f}" for k, v in alos.items()) + " hari")
print("Readmisi30: " + " ".join(f"{k}={v:.1f}%" for k, v in readm.items()))
print("flag: " + ", ".join(prioritas) + " — readmisi tertinggi, prioritaskan audit discharge")`,
        lockLines: 10,
        solution: `# Data SINTETIS RS Sehat Sentosa, Oktober 2026 (31 hari; angka dibuat untuk latihan)
# bangsal: (tempat_tidur, hari_perawatan, pasien_pulang, readmisi_30hari)
data = {
    "Anak": (20, 540, 180, 9),
    "Bedah": (30, 700, 210, 21),
    "Dalam": (40, 1050, 260, 39),
}
HARI = 31
AMBANG_READMISI = 10.0  # persen

# TULIS KODEMU
bor = {k: hr / (tt * HARI) * 100 for k, (tt, hr, plg, rd) in data.items()}
alos = {k: hr / plg for k, (tt, hr, plg, rd) in data.items()}
readm = {k: rd / plg * 100 for k, (tt, hr, plg, rd) in data.items()}
prioritas = sorted([k for k, v in readm.items() if v > AMBANG_READMISI],
                   key=lambda k: readm[k], reverse=True)
label = {"Anak": "Anak", "Bedah": "Bedah", "Dalam": "Penyakit Dalam"}
prioritas = [label[k] for k in prioritas]

# nilai uji (diecek satu per satu)
bor_Anak, bor_Bedah, bor_Dalam = bor["Anak"], bor["Bedah"], bor["Dalam"]
alos_Anak, alos_Bedah, alos_Dalam = alos["Anak"], alos["Bedah"], alos["Dalam"]
readm_Anak, readm_Bedah, readm_Dalam = readm["Anak"], readm["Bedah"], readm["Dalam"]

print("BOR: " + " ".join(f"{k}={v:.1f}%" for k, v in bor.items()))
print("ALOS: " + " ".join(f"{k}={v:.1f}" for k, v in alos.items()) + " hari")
print("Readmisi30: " + " ".join(f"{k}={v:.1f}%" for k, v in readm.items()))
print("flag: " + ", ".join(prioritas) + " — readmisi tertinggi (15.0%), prioritaskan audit discharge")`,
        checks: [
          { kind: "equal", task: "t1", name: "bor_Anak", value: 87.0968, tol: 0.05, label: "`bor` Anak = 87,1%", msg: "540 / (20 × 31) × 100%." },
          { kind: "equal", task: "t1", name: "bor_Bedah", value: 75.2688, tol: 0.05, label: "`bor` Bedah = 75,3%", msg: "700 / (30 × 31) × 100%." },
          { kind: "equal", task: "t1", name: "bor_Dalam", value: 84.6774, tol: 0.05, label: "`bor` Dalam = 84,7%", msg: "1050 / (40 × 31) × 100%." },
          { kind: "equal", task: "t2", name: "alos_Bedah", value: 3.3333, tol: 0.01, label: "`alos` Bedah = 3,33 hari", msg: "700 / 210." },
          { kind: "equal", task: "t3", name: "readm_Anak", value: 5.0, tol: 0.01, label: "`readm` Anak = 5,0%", msg: "9 / 180 × 100%." },
          { kind: "equal", task: "t3", name: "readm_Dalam", value: 15.0, tol: 0.01, label: "`readm` Dalam = 15,0%", msg: "39 / 260 × 100%." },
          { kind: "equal", task: "t4", name: "prioritas", value: ["Penyakit Dalam"], label: "`prioritas` = Penyakit Dalam", msg: "Hanya Dalam yang readmisinya > 10% (Bedah tepat 10,0% — tidak > ambang)." },
          { kind: "stdout_matches", task: "t4", pattern: "Dalam=15\\.0%", label: "Readmisi Dalam tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t4", pattern: "flag: Penyakit Dalam", label: "Flag tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: tabel ringkasan adalah kontrak antara analis dan dashboard",
        body: "Praktik profesional: query/model di balik dashboard SELALU menghasilkan satu “tabel kontrak” — satu baris per entitas (bangsal), satu kolom per metrik, dengan definisi tertulis. Tabel kontrak inilah yang kamu bangun di lab ini (dict bor/alos/readm). Keuntungannya: (1) angka di dashboard bisa dilacak ke satu baris definisi; (2) QA menjadi trivial — bandingkan tabel kontrak vs tampilan; (3) saat definisi berubah (mis. readmisi 30 → 7 hari), hanya satu tempat yang diubah. Dashboard tanpa tabel kontrak adalah kumpulan angka yang tidak bisa diaudit.",
      },
      reference: "Bangun “tabel kontrak”: satu baris per entitas, satu kolom per metrik, definisi tertulis. Itulah bahan baku dashboard yang bisa diaudit.",
    },
    {
      id: "chart-readmisi",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca chart readmisi seperti direktur",
      prose: [
        "Chart di bawah memvisualkan hasil lab-mu: readmisi 30 hari per bangsal, dengan garis ambang 10%. Inilah visual yang layak tampil di layar lobi — bukan karena indah, tetapi karena ia memaksa perhatian ke tempat yang benar.",
        "Cara membaca: sumbu X = tiga bangsal; tinggi batang = readmisi 30 hari (%); garis putus-putus = ambang 10% yang ditetapkan manajemen; angka di atas batang = nilai persis.",
        "Interpretasi: hanya Penyakit Dalam (15,0%) yang menembus ambang — prioritas audit discharge planning. Bedah tepat di ambang (10,0%): tidak ter-flag, tetapi wajib dipantau trennya bulan depan. Anak (5,0%) aman. Keputusan satu layar: alokasikan tim audit ke Penyakit Dalam minggu ini; jadwalkan review tren Bedah bulan depan. Perhatikan juga: BOR Dalam 84,7% (mendekati 85%) — kombinasi hunian nyaris penuh + readmisi tinggi menandakan tekanan kapasitas yang mungkin mempercepat pemulangan. Inilah gunanya membaca metrik bersamaan.",
      ],
      tasks: [],
      figure: { svg: READM_SVG, alt: "Diagram batang readmisi 30 hari per bangsal dengan ambang 10 persen", caption: "Readmisi 30 hari per bangsal vs ambang manajemen (data sintetis)." },
      hints: [
        "💡 Intuisi: garis ambang mengubah chart dari “informasi” menjadi “keputusan”. Tanpa ambang, pembaca menebak-nebak apakah 10% itu besar; dengan ambang, chart-nya sendiri yang menunjuk prioritas.",
      ],
      reference: "Satu chart = satu keputusan. Garis ambang mengubah informasi menjadi prioritas.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Keputusan dashboard: metrik, tool, dan desain",
      prose: [
        "Skenario 1 — “Direksi butuh pantauan harian operasional”: kondisi = keputusan cepat (alokasi bed, IGD). Metrik: BOR, kunjungan IGD, antrean. Refresh: near real-time untuk IGD saja. Alasan: keputusan operasional butuh angka segar; metrik mutu tidak.",
        "Skenario 2 — “Komite mutu butuh evaluasi bulanan”: kondisi = keputusan perbaikan sistem. Metrik: readmisi, ALOS, infeksi nosokomial — selalu dengan tren 6–12 bulan dan perbandingan antar unit. Refresh: bulanan. Alasan: mutu berubah lambat; refresh harian hanya menambah noise dan kepanikan.",
        "Skenario 3 — “Dinkes butuh pantauan wilayah”: kondisi = banyak faskes, satu layar. Metrik: cakupan (imunisasi, SPM) + drop-out, dengan drill-down kabupaten → faskes. Jebakan: rata-rata provinsi menutupi kantong masalah — wajib peta/wilayah. Alasan: disparitas adalah cerita utama kesehatan populasi.",
        "Skenario 4 — “Memilih tool BI”: kondisi = organisasi di ekosistem Microsoft, anggaran terbatas, analis terbiasa Excel → Power BI. Kondisi = butuh eksplorasi visual kompleks dan tim sudah mahir → Tableau. Kondisi = satu analis, satu sumber, cepat → spreadsheet + chart manual pun sah untuk prototipe. Alasan: tool mengikuti konteks, bukan sebaliknya; prototipe murah sebelum investasi lisensi.",
        "Skenario 5 — “Dashboard dituduh menyesatkan”: kondisi = ada yang curiga angka dipercantik. Respons: tunjukkan definisi tiap metrik (tooltip), sumber data + tanggal refresh, dan sediakan tampilan data mentah agregat. Alasan: kepercayaan pada dashboard = transparansi metodologi, bukan keindahan visual.",
        "Aturan praktis 10 detik: tulis pertanyaan keputusannya dulu; pilih metrik + pasangannya; tentukan refresh dari frekuensi keputusan; sediakan drill-down; definisikan tiap angka.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membangun dashboard dari data yang tersedia, bukan dari pertanyaan keputusan. Hasilnya: layar penuh chart yang tidak mengubah satu pun keputusan. Urutan yang benar selalu: keputusan → pertanyaan → metrik → data → visual. Kalau datanya belum ada, tulis dulu “data belum tersedia” di slot itu — slot kosong yang jujur lebih baik dari chart asal-asalan.",
      },
      reference: "Keputusan → pertanyaan → metrik → data → visual. Slot kosong yang jujur > chart asal-asalan.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Satu layar untuk direktur",
      prose: [
        "Situasinya: kamu analis baru RS Sehat Sentosa. Direktur memintamu merancang SATU layar dashboard untuk rapat direksi bulanan. Data yang tersedia: tabel kunjungan (tanggal, bangsal, lama rawat, readmisi_30hari ya/tidak), tabel tempat tidur per bangsal. Waktu: dua minggu. Anggaran tool: nol (pakai yang gratis dulu).",
        "Pertanyaan analisis: (a) metrik apa saja yang masuk layar itu, dan apa “pasangan pengawas” tiap metrik? (b) Bagaimana kamu menyusun layarnya agar terbaca dalam 5 detik? (c) Tool apa yang kamu pilih untuk prototipe, dan apa kriteriamu untuk naik ke lisensi berbayar?",
        "Pembahasan: (a) Enam metrik: BOR (pengawas: ALOS + readmisi), ALOS (pengawas: readmisi), readmisi 30 hari (pengawas: tren 6 bulan), kunjungan IGD harian (pengawas: BOR), kepuasan (pengawas: keluhan formal), dan satu slot “data belum tersedia” yang jujur — mis. mortalitas tersesuaikan — agar direksi tahu apa yang belum diukur. (b) Layout: baris atas = 3 kartu KPI dengan tren panah; tengah = chart readmisi per bangsal + garis ambang; bawah = tabel bangsal (BOR, ALOS, readmisi) untuk drill-down mental. Satu pertanyaan per area, maksimal 6 visual. (c) Prototipe: Power BI Desktop (gratis) atau spreadsheet — karena ekosistem RS umumnya Microsoft dan analisnya terbiasa Excel. Naik ke lisensi berbayar bila: dashboard dipakai >10 orang rutin, butuh refresh otomatis terjadwal, atau butuh row-level security (mis. kepala bangsal hanya lihat bangsalnya). Kriteria berbasis kebutuhan, bukan gengsi tool.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di asuransi kesehatan, dashboard yang sama menentukan deteksi fraud provider (tagihan anomali) dan utilisasi polis. Metrik tanpa pasangan pengawas di dashboard klaim = peluang fraud yang tak terlihat. Disiplin “setiap metrik punya pengawas” yang kamu latih di RS langsung terbawa ke risk analytics.",
      },
      reference: "Satu layar direksi: 6 metrik + pasangannya, tren, ambang, dan slot jujur untuk yang belum terukur.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Star schema: tabel fakta (kejadian) + tabel dimensi (master); dashboard membaca dari lapis analitik, bukan database transaksi.",
        "BOR = hari perawatan / (TT × hari kalender); waspadai >85% sebagai risiko kapasitas, bukan prestasi.",
        "Readmisi 30 hari = proksi mutu; baca bersama BOR dan ALOS — metrik tunggal selalu bisa di-game.",
        "Power BI = ekosistem Microsoft + hemat; Tableau = eksplorasi visual; kuasai satu sampai mahir, prototipe murah dulu.",
        "Jebakan desain: sumbu tak jujur, agregat menutupi disparitas (wajib drill-down), metrik tanpa definisi, refresh tak sesuai frekuensi keputusan.",
      ],
      quiz: [
        {
          q: "RS melaporkan BOR 97% sebagai prestasi. Respons analis yang tepat?",
          options: [
            { text: "Red flag kapasitas — di atas ~85% RS kehilangan buffer lonjakan; tandai sebagai peringatan dan cek ALOS + readmisi", why: "Benar: BOR sangat tinggi = risiko, bukan prestasi. Pasangan pengawas (ALOS turun? readmisi naik?) menentukan apakah ini efisiensi semu.", correct: true },
            { text: "Prestasi — semakin penuh semakin efisien", why: "Salah: efisiensi tanpa buffer adalah kerapuhan; satu wabah bisa melumpuhkan RS." },
            { text: "Tidak masalah selama pasien tidak komplain", why: "Salah: kepuasan adalah lagging indicator; kapasitas yang jebol terlihat di data dulu, di komplain kemudian." },
            { text: "Turunkan BOR dengan menolak pasien", why: "Salah: solusinya perencanaan kapasitas (tambah TT, alihkan elektif), bukan menolak yang butuh." },
          ],
        },
        {
          q: "Dashboard nasional menunjukkan cakupan imunisasi 92%, tetapi dua kabupaten 55%. Pelajaran desainnya?",
          options: [
            { text: "Agregat menutupi disparitas — dashboard kesehatan wajib punya drill-down wilayah sampai faskes", why: "Benar: rata-rata nasional adalah cerita yang salah untuk separuh wilayah. Drill-down adalah fitur wajib, bukan pemanis.", correct: true },
            { text: "Angka nasional sudah cukup untuk keputusan", why: "Salah: keputusan alokasi justru butuh tahu kantong masalahnya di mana." },
            { text: "Hapus data dua kabupaten itu sebagai outlier", why: "Salah: itu bukan outlier statistik — itu populasi nyata yang tidak terlayani." },
            { text: "Naikkan target nasional jadi 95%", why: "Salah: menaikkan target tanpa melihat disparitas hanya memperlebar kesenjangan." },
          ],
        },
        {
          q: "Kapan Power BI lebih tepat daripada Tableau untuk RS di Indonesia?",
          options: [
            { text: "Organisasi sudah di ekosistem Microsoft, anggaran terbatas, analis terbiasa Excel — kurva belajar landai dan Desktop gratis", why: "Benar: konteks menentukan. Mayoritas RS/Dinkes Indonesia = ekosistem Microsoft.", correct: true },
            { text: "Selalu — Tableau sudah usang", why: "Salah: Tableau unggul untuk eksplorasi visual kompleks; tidak ada tool yang selalu menang." },
            { text: "Tidak pernah — gratis berarti murahan", why: "Salah: menilai tool dari harga, bukan kecocokan kebutuhan." },
            { text: "Hanya bila datanya kecil", why: "Salah: keduanya menangani data besar; pembedanya ekosistem, biaya, dan kebutuhan visual." },
          ],
        },
        {
          q: "Chart batang selisih 8,1% vs 8,3% terlihat seperti jurang. Apa yang salah?",
          options: [
            { text: "Sumbu Y tidak mulai dari nol — memperbesar perbedaan kecil secara visual; perbaiki sumbunya", why: "Benar: sumbu terpotong adalah teknik menyesatkan klasik pada bar chart.", correct: true },
            { text: "Datanya salah — selisih sekecil itu tidak mungkin", why: "Salah: datanya bisa valid; yang salah adalah penyajiannya." },
            { text: "Harus pakai pie chart", why: "Salah: pie chart lebih buruk untuk perbandingan presisi antar nilai." },
            { text: "Tidak ada yang salah — memang beda jauh", why: "Salah: 0,2 poin persen bukan jurang; visualnya berbohong." },
          ],
        },
        {
          q: "Metrik readmisi 30 hari naik setelah program percepatan pemulangan. Interpretasi tepat?",
          options: [
            { text: "Efisiensi semu — ALOS turun dibayar dengan mutu; kaji ulang kriteria discharge, jangan rayakan ALOS-nya saja", why: "Benar: inilah gunanya pasangan pengawas. ALOS turun + readmisi naik = pasien dipulangkan prematur.", correct: true },
            { text: "Program gagal total — hentikan", why: "Salah: vonis total tanpa analisis sebab; mungkin hanya kriteria discharge yang perlu dikalibrasi." },
            { text: "Kebetulan — abaikan", why: "Salah: korelasi waktu dengan intervensi adalah sinyal yang wajib diselidiki, bukan diabaikan." },
            { text: "Naikkan lagi target percepatan", why: "Salah: mempercepat pemulangan saat readmisi naik adalah memperbesar masalah." },
          ],
        },
        {
          q: "Dashboard mutu sebaiknya di-refresh seberapa sering?",
          options: [
            { text: "Harian/mingguan hingga bulanan — mengikuti frekuensi keputusan; refresh tiap menit hanya menambah noise", why: "Benar: mutu berubah lambat. Real-time untuk IGD/antrean; periodik untuk mutu.", correct: true },
            { text: "Real-time selalu — semakin segar semakin baik", why: "Salah: angka mutu yang berkedip tiap menit mengundang reaksi berlebihan terhadap fluktuasi acak." },
            { text: "Tahunan — biar stabil", why: "Salah: tahunan terlalu lambat untuk intervensi; masalah terdeteksi setelah membesar." },
            { text: "Tidak perlu refresh — sekali buat selamanya", why: "Salah: dashboard mati = keputusan berbasis angka basi." },
          ],
        },
      ],
      next: { label: "Lanjut: DHIS2 & Data Quality Assessment", href: "/v2/learn/hd29-dhis2-dqa" },
    },
  ],
};
