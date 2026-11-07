import type { V2Lesson } from "../lib/types";

// ── Figure: alur workflow perubahan master data ──────────────────────────
const FLOW_SVG = `<svg viewBox="0 0 560 230" role="img" aria-label="Diagram alur workflow perubahan master data: diajukan, validasi otomatis, ditinjau steward, disetujui atau ditolak, dengan cabang ditahan untuk approval L2">
<g font-family="var(--font-ui)" font-size="11" fill="var(--text)" text-anchor="middle">
<rect x="8" y="20" width="120" height="52" rx="8" fill="var(--c1)" opacity="0.9"/>
<text x="68" y="42">Diajukan</text><text x="68" y="58" font-size="9" fill="var(--text-muted)">pemohon</text>
<rect x="158" y="20" width="120" height="52" rx="8" fill="var(--c2)" opacity="0.9"/>
<text x="218" y="42">Validasi</text><text x="218" y="58" font-size="9" fill="var(--text-muted)">otomatis</text>
<rect x="308" y="20" width="120" height="52" rx="8" fill="var(--c3)" opacity="0.9"/>
<text x="368" y="42">Ditinjau</text><text x="368" y="58" font-size="9" fill="var(--text-muted)">steward</text>
<rect x="458" y="20" width="94" height="52" rx="8" fill="var(--c4)" opacity="0.9"/>
<text x="505" y="42">Disetujui</text><text x="505" y="58" font-size="9" fill="var(--text-muted)">/ ditolak</text>
<rect x="158" y="130" width="120" height="52" rx="8" fill="var(--c5)" opacity="0.9"/>
<text x="218" y="152">Ditahan</text><text x="218" y="168" font-size="9" fill="var(--text-muted)">approval L2</text>
</g>
<g stroke="var(--text-muted)" stroke-width="1.5" fill="none">
<line x1="128" y1="46" x2="158" y2="46"/><polygon points="158,46 150,41 150,51" fill="var(--text-muted)"/>
<line x1="278" y1="46" x2="308" y2="46"/><polygon points="308,46 300,41 300,51" fill="var(--text-muted)"/>
<line x1="428" y1="46" x2="458" y2="46"/><polygon points="458,46 450,41 450,51" fill="var(--text-muted)"/>
<line x1="218" y1="72" x2="218" y2="130"/><polygon points="218,130 213,122 223,122" fill="var(--text-muted)"/>
<line x1="278" y1="156" x2="458" y2="156" stroke-dasharray="5 4"/><line x1="458" y1="156" x2="458" y2="72" stroke-dasharray="5 4"/>
</g>
<g font-family="var(--font-ui)" font-size="10" fill="var(--text-muted)">
<text x="10" y="214">Aturan validasi (format, duplikat, ambang nilai) berjalan di kotak Validasi — sebelum manusia dilibatkan.</text>
</g>
</svg>`;

export const dm27: V2Lesson = {
  slug: "dm27-sap-mdg",
  track: "Data Management",
  module: "Tata Kelola",
  title: "DM27 — SAP MDG & MDM Enterprise",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Tujuan, rute, dan bekal",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan arsitektur SAP MDG — data model, change request, dan workflow persetujuan; (2) membedakan tata kelola reaktif (bersih-bersih setelah kotor) vs by-design (kotor tidak bisa masuk); (3) merancang workflow perubahan master data lengkap dengan aturan validasi otomatis; (4) meminjam pola MDG untuk perusahaan tanpa SAP — golden record, steward, dan audit trail; (5) menilai kapan MDM enterprise layak dibeli dan kapan ia overkill.",
        "Rutenya: cerita tiga versi “PT Maju Jaya” → arsitektur MDG → workflow perubahan master → pola tanpa SAP → lab simulasi workflow (aturan validasi + status mesin) → jebakan governance → peta keputusan → mini-case 12.000 record BP → kuis → rangkuman. Estimasi 60 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Master data = data induk yang dipakai lintas proses: pelanggan (Business Partner), material, vendor, akun. Berbeda dari data transaksional (faktur, order) yang terus bertambah, master data berubah jarang tetapi dampaknya ke mana-mana — salah satu huruf di nama pelanggan merambat ke faktur, pengiriman, dan laporan. Workflow = alur persetujuan bertahap: diajukan → divalidasi → ditinjau → disetujui/ditolak. Lesson ini tidak mengasumsikan kamu pernah menyentuh SAP.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: master data itu seperti KTP perusahaan — jarang berubah, tetapi kalau salah, semua urusan ikut salah. MDM adalah Disdukcapil-nya: satu pintu resmi untuk menerbitkan dan mengubahnya.",
      ],
      reference: "Bekal: master data vs transaksional, workflow persetujuan. SAP tidak wajib untuk mengikuti lesson ini.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Tiga versi “PT Maju Jaya”",
      prose: [
        "Distributor bahan bangunan itu punya tiga sistem: SAP untuk keuangan, aplikasi gudang, dan toko online. Di SAP, pelanggannya tercatat “PT Maju Jaya”. Di gudang: “PT MAJU JAYA”. Di toko online: “Pt. Maju Jaya”. Tiga record, satu perusahaan yang sama. Bulan itu tim sales memberi diskon loyalitas — dan karena sistem tidak tahu ketiganya sama, diskon diberikan tiga kali. Kerugian Rp47 juta dalam satu kuartal, dari satu nama yang ditulis tiga cara.",
        "Manajemen menyalahkan “data kotor” dan memerintahkan proyek cleansing besar-besaran. Enam bulan kemudian datanya kotor lagi — dengan cara yang sama persis. Twist-nya: masalahnya BUKAN data kotor. Masalahnya adalah tidak ada yang berwenang mengubah master data: semua orang bisa menambah pelanggan baru, tidak ada yang bertanggung jawab memastikan ia belum ada, dan tidak ada pintu resmi untuk perubahan. Cleansing tanpa governance seperti mengepel lantai sambil keran bocor — lantainya bersih sesaat, lalu basah lagi.",
        "SAP MDG (Master Data Governance) adalah jawaban enterprise untuk keran bocor ini: bukan alat pembersih, melainkan penjaga gerbang — setiap perubahan master data harus lewat pintu resmi, lolos validasi, dan disetujui orang yang bertanggung jawab.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “MDM = proyek cleansing data”",
        body: "Yang benar: cleansing adalah pekerjaan satu kali; MDM adalah sistem agar data tidak kotor lagi. Perusahaan dalam cerita sudah dua kali cleansing dan tetap kotor — karena yang diperbaiki akibatnya, bukan pintunya. Bila setelah cleansing tidak ada workflow perubahan, anggap uang cleansing-nya hangus dalam 6–12 bulan.",
        type: "pitfall",
      },
    },
    {
      id: "konsep-mdg",
      eyebrow: "Langkah 3 · Konsep",
      title: "MDG — Si Penjaga Gerbang",
      prose: [
        "Definisi: SAP MDG adalah modul tata kelola data induk di atas SAP S/4HANA (bisa juga dihubungkan ke non-SAP). Tiga pilarnya: (1) data model — definisi resmi entitas master (Business Partner untuk pelanggan/vendor, Material, dsb.) beserta atribut dan relasinya; (2) change request — setiap perubahan adalah tiket resmi yang tercatat siapa, apa, kapan; (3) workflow — tiket itu berjalan lewat tahap persetujuan sesuai aturan (nilai kecil → steward, nilai besar → manajer). Di belakangnya ada validasi (aturan format), derivasi (isi otomatis field turunan), dan replikasi (perubahan yang disetujui disebar ke sistem satelit).",
        "Kepribadiannya: MDG seperti imigrasi di bandara — semua orang boleh lewat, tetapi semua harus lewat pemeriksaan yang sama, dan yang mencurigakan ditahan untuk pemeriksaan lanjutan. Tanpa imigrasi (semua bisa edit langsung), bandara tetap berfungsi — sampai ada yang membawa barang terlarang.",
        "Kapan memakai: ketika master data dipakai ≥3 sistem dan kesalahan merambat mahal (cerita di atas). Kapan TIDAK: startup 20 orang dengan satu database — spreadsheet + satu penanggung jawab cukup; MDG penuh di sana adalah meriam untuk nyamuk. Kualitas master data bisa diukur dengan kompas perkalian di bawah — ketiganya harus ada, bukan salah satu.",
      ],
      formula: String.raw`Q = C \times U \times K`,
      formulaNote: "Q = kualitas master data (0–1) — peluang sebuah record bisa dipakai tanpa verifikasi manual; C = completeness, proporsi field wajib yang terisi; U = uniqueness, proporsi record yang benar-benar entitas berbeda (1 − tingkat duplikat); K = konsistensi, proporsi record yang lolos aturan validasi. Perkalian, bukan rata-rata: 90% lengkap × 80% unik × 50% konsisten = 0,36 — setengah record bermasalah meski “rata-ratanya” 73%.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “beli MDG, data otomatis bersih”",
        body: "Yang benar: MDG adalah kerangka + workflow — isinya (data model, aturan validasi, siapa steward-nya) tetap harus dirancang oleh manusia yang paham bisnis. Perusahaan yang membeli lisensi tanpa menunjuk data steward berakhir dengan gerbang imigrasi tanpa petugas: pintunya ada, semua orang melenggang lewat.",
        type: "pitfall",
      },
      hints: [
        "💡 Intuisi: tiga pilar MDG bisa dihafal sebagai “APA – BAGAIMANA – SIAPA”: data model (apa yang dijaga), workflow (bagaimana menjaganya), steward (siapa yang memutuskan).",
      ],
      reference: "MDG = data model + change request + workflow + validasi + replikasi. Q = C × U × K.",
    },
    {
      id: "konsep-workflow",
      eyebrow: "Langkah 4 · Konsep",
      title: "Workflow perubahan — Si Antrian Bertingkat",
      prose: [
        "Sebuah change request hidup dalam mesin status: Diajukan → Validasi otomatis → Ditinjau steward → Disetujui (atau Ditolak). Ada satu cabang penting: Ditahan — ketika aturan mendeteksi sesuatu yang butuh wewenang lebih tinggi (misalnya kenaikan harga > 50% butuh approval L2/manager). Validasi otomatis adalah filter murahnya: format NPWP 15 digit, kode material tidak duplikat, nama tidak kosong — ribuan request gugur di sini tanpa menghabiskan waktu manusia.",
        "Cara membaca chart di bawah: lima kotak adalah status yang bisa ditempati sebuah request; panah solid adalah alur normal; panah putus-putus adalah cabang “ditahan” yang kembali ke “disetujui” setelah approval L2. Interpretasi: perhatikan bahwa manusia (steward) baru dilibatkan SETELAH mesin selesai bekerja — ini desain yang benar. Workflow yang menaruh manusia di depan mesin akan menenggelamkan steward dalam request sampah.",
        "Dua keputusan desain yang menentukan hidup-mati workflow: (1) ambang eskalasi — terlalu rendah, manajer kebanjiran; terlalu tinggi, perubahan berisiko lolos diam-diam; (2) siapa steward per domain — tanpa nama orang yang jelas, request “ditinjau” berubah menjadi “didiamkan”.",
      ],
      figure: {
        svg: FLOW_SVG,
        alt: "Diagram alur workflow perubahan master data dengan cabang approval L2",
        caption: "Alur resmi perubahan master: mesin memfilter dulu (validasi), manusia memutuskan kemudian (steward), dan kasus berisiko naik ke approval L2.",
      },
      tasks: [],
      hints: [
        "💡 Intuisi: validasi otomatis = satpam yang memeriksa KTP di pintu; steward = manajer yang memutuskan tamu VIP boleh masuk ruang rapat. Satpam tidak memutuskan nasib tamu — ia hanya memastikan yang masuk sudah memenuhi syarat minimal.",
      ],
      reference: "Status: diajukan → validasi → ditinjau → disetujui/ditolak; cabang: ditahan (butuh L2).",
    },
    {
      id: "konsep-tanpa-sap",
      eyebrow: "Langkah 5 · Konsep",
      title: "Meminjam MDG tanpa SAP — Si Koki Rumahan",
      prose: [
        "Kabar baiknya: 80% nilai MDG bukan software-nya, melainkan polanya — dan polanya bisa ditiru dengan tool seadanya. Empat pinjaman praktisnya: (1) golden record — satu tabel/sistem yang dinyatakan sebagai sumber kebenaran per domain (bukan “nanti disinkronkan”); (2) steward bernama — satu orang penanggung jawab per domain master, namanya tertulis, bukan “tim”; (3) aturan validasi sebagai kode — cek format, duplikat, dan ambang yang berjalan otomatis sebelum data masuk (persis lab lesson ini); (4) audit trail — setiap perubahan mencatat siapa, kapan, dari apa ke apa (bahkan tabel log sederhana di database sudah cukup untuk memulai).",
        "Pola integrasinya dengan pelajaran DM lain: golden record hidup di katalog (dm24 — terdaftar, terdokumentasi, bisa dicari); aturan validasi adalah executable data quality rules (dm25 — Great Expectations versi mini); dan change request besar yang menyentuh data pribadi harus melewati catatan transfer ala dm26. MDG enterprise pada dasarnya adalah dm24 + dm25 + dm26 yang dibungkus workflow persetujuan.",
        "Kapan pola pinjaman cukup dan kapan harus beli yang asli: cukup bila master < 50 ribu record, sistem < 5, dan satu steward paruh waktu bisa menangani antrean. Beli (MDG/Stibo/Informatica) bila regulasi menuntut kontrol formal, atau volume perubahan > 500/hari sehingga antrean manual runtuh.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “tanpa SAP, MDM tidak mungkin”",
        body: "Yang benar: yang tidak mungkin tanpa tool mahal adalah MDM otomatis penuh lintas 20 sistem. Tetapi golden record + steward bernama + validasi sebagai kode + audit trail bisa dibangun di atas database biasa dalam hitungan minggu — dan menyelesaikan 80% masalah cerita pembuka. Tool mahal mempercepat, bukan memungkinkan.",
        type: "pitfall",
      },
      hints: [
        "💡 Intuisi: mulai dari ujung yang sakit — domain master dengan duplikat terbanyak dan dampak uang terbesar. Satu domain yang beres memberi bukti untuk meminta anggaran domain berikutnya.",
      ],
      reference: "Pinjaman MDG: golden record + steward bernama + validasi sebagai kode + audit trail.",
    },
    {
      id: "lab-workflow",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Simulasi workflow perubahan master data",
      prose: [
        "Waktunya menjadi mesin validasi. Lima change request menunggu (data SINTETIS): dua perubahan nama BP, satu NPWP, satu kode material, satu kenaikan harga. Tugasmu: lengkapi `digit_saja` (ekstrak digit NPWP) dan aturan-aturan di `putuskan` — nama kosong ditolak, NPWP harus 15 digit, kode duplikat ditahan, kenaikan harga > 50% ditahan menunggu approval L2. Selebihnya disetujui.",
        "Coba: setelah lolos, ubah `baru` MD-04 menjadi \"160000\" (naik 6,7%) dan jalankan ulang — ia harusnya lolos tanpa L2. Lalu kembalikan. Perhatikan: mesin status ini tidak tahu apa-apa soal bisnis — ia hanya menjalankan aturan. Kebijakannya (“berapa ambang L2?”) tetap keputusan manusia.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `digit_saja`: kembalikan hanya karakter digit dari string" },
        { id: "t2", text: "Aturan nama: bila `baru` kosong → kembalikan (\"DITOLAK\", \"nama baru kosong\")" },
        { id: "t3", text: "Aturan NPWP: digit != 15 → (\"DITOLAK\", \"NPWP tidak valid: %d digit\" % len(d))" },
        { id: "t4", text: "Aturan duplikat: kode ada di `master_material` → (\"DITAHAN\", \"kode duplikat di master\")" },
        { id: "t5", text: "Aturan harga: kenaikan > 50% → (\"DITAHAN\", \"butuh approval L2: kenaikan %.1f%%\" % naik)" },
        { id: "t6", text: "Jalankan dan pastikan ringkasan “Lolos: 2 | Ditahan: 2 | Ditolak: 1” tercetak" },
      ],
      expected: "MD-01: DISETUJUI (validasi lolos)\nMD-02: DITOLAK (NPWP tidak valid: 14 digit)\nMD-03: DITAHAN (kode duplikat di master)\nMD-04: DITAHAN (butuh approval L2: kenaikan 66.7%)\nMD-05: DISETUJUI (validasi lolos)\nLolos: 2 | Ditahan: 2 | Ditolak: 1",
      code: {
        starter: `# Lab DM27 — data SINTETIS, bukan SAP sungguhan
master_material = {"MAT-1001": "Baut M8", "MAT-1002": "Mur M8"}  # JANGAN UBAH
perubahan = [  # JANGAN UBAH
    {"id": "MD-01", "entitas": "BP", "kolom": "nama", "lama": "PT Maju Jaya", "baru": "PT Maju Jaya Abadi"},
    {"id": "MD-02", "entitas": "BP", "kolom": "npwp", "lama": "01.234.567.8-901.000", "baru": "01.234.567.8-901.00"},
    {"id": "MD-03", "entitas": "Material", "kolom": "kode", "lama": "-", "baru": "MAT-1001"},
    {"id": "MD-04", "entitas": "Material", "kolom": "harga", "lama": "150000", "baru": "250000"},
    {"id": "MD-05", "entitas": "BP", "kolom": "nama", "lama": "", "baru": "PT Sinar Baru"},
]

def digit_saja(s):
    # TODO t1: kembalikan hanya karakter digit dari s
    return ""

def putuskan(p):
    # TODO t2-t5: terapkan aturan, kembalikan (status, alasan)
    # - nama baru kosong -> ("DITOLAK", "nama baru kosong")
    # - digit NPWP != 15 -> ("DITOLAK", "NPWP tidak valid: %d digit" % len(d))
    # - kode duplikat di master_material -> ("DITAHAN", "kode duplikat di master")
    # - kenaikan harga > 50% -> ("DITAHAN", "butuh approval L2: kenaikan %.1f%%" % naik)
    # - lolos semua -> ("DISETUJUI", "validasi lolos")
    return ("?", "?")

# --- driver: JANGAN UBAH di bawah ini ---
lolos, ditahan, ditolak = [], [], []
for p in perubahan:
    status, alasan = putuskan(p)
    print("%s: %s (%s)" % (p["id"], status, alasan))
    if status == "DISETUJUI":
        lolos.append(p["id"])
    elif status == "DITAHAN":
        ditahan.append(p["id"])
    else:
        ditolak.append(p["id"])
print("Lolos: %d | Ditahan: %d | Ditolak: %d" % (len(lolos), len(ditahan), len(ditolak)))`,
        lockLines: 9,
        solution: `# Lab DM27 — data SINTETIS, bukan SAP sungguhan
master_material = {"MAT-1001": "Baut M8", "MAT-1002": "Mur M8"}  # JANGAN UBAH
perubahan = [  # JANGAN UBAH
    {"id": "MD-01", "entitas": "BP", "kolom": "nama", "lama": "PT Maju Jaya", "baru": "PT Maju Jaya Abadi"},
    {"id": "MD-02", "entitas": "BP", "kolom": "npwp", "lama": "01.234.567.8-901.000", "baru": "01.234.567.8-901.00"},
    {"id": "MD-03", "entitas": "Material", "kolom": "kode", "lama": "-", "baru": "MAT-1001"},
    {"id": "MD-04", "entitas": "Material", "kolom": "harga", "lama": "150000", "baru": "250000"},
    {"id": "MD-05", "entitas": "BP", "kolom": "nama", "lama": "", "baru": "PT Sinar Baru"},
]

def digit_saja(s):
    hasil = ""
    for c in s:
        if c.isdigit():
            hasil += c
    return hasil

def putuskan(p):
    if p["kolom"] == "nama" and not p["baru"].strip():
        return ("DITOLAK", "nama baru kosong")
    if p["kolom"] == "npwp":
        d = digit_saja(p["baru"])
        if len(d) != 15:
            return ("DITOLAK", "NPWP tidak valid: %d digit" % len(d))
    if p["kolom"] == "kode" and p["baru"] in master_material:
        return ("DITAHAN", "kode duplikat di master")
    if p["kolom"] == "harga":
        naik = (float(p["baru"]) - float(p["lama"])) / float(p["lama"]) * 100
        if naik > 50:
            return ("DITAHAN", "butuh approval L2: kenaikan %.1f%%" % naik)
    return ("DISETUJUI", "validasi lolos")

# --- driver: JANGAN UBAH di bawah ini ---
lolos, ditahan, ditolak = [], [], []
for p in perubahan:
    status, alasan = putuskan(p)
    print("%s: %s (%s)" % (p["id"], status, alasan))
    if status == "DISETUJUI":
        lolos.append(p["id"])
    elif status == "DITAHAN":
        ditahan.append(p["id"])
    else:
        ditolak.append(p["id"])
print("Lolos: %d | Ditahan: %d | Ditolak: %d" % (len(lolos), len(ditahan), len(ditolak)))`,
        checks: [
          { kind: "equal", task: "t6", name: "lolos", value: ["MD-01", "MD-05"], label: "`lolos` = MD-01 & MD-05", msg: "Hanya request yang lolos semua aturan." },
          { kind: "equal", task: "t6", name: "ditahan", value: ["MD-03", "MD-04"], label: "`ditahan` = MD-03 & MD-04", msg: "Duplikat dan kenaikan > 50% menunggu manusia." },
          { kind: "equal", task: "t6", name: "ditolak", value: ["MD-02"], label: "`ditolak` = MD-02", msg: "NPWP 14 digit melanggar aturan format." },
          { kind: "stdout_matches", task: "t6", pattern: "NPWP tidak valid: 14 digit", label: "Alasan penolakan tercetak", msg: "Pastikan alasan MD-02 tercetak." },
          { kind: "stdout_matches", task: "t6", pattern: "Lolos: 2 \\| Ditahan: 2 \\| Ditolak: 1", label: "Ringkasan tercetak", msg: "Baris terakhir ringkasan status." },
        ],
      },
      reference: "Mesin validasi memfilter (format, duplikat, ambang); manusia memutuskan yang ditahan. Kebijakan ambang = keputusan bisnis.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Tiga jebakan governance",
      prose: [
        "Jebakan 1 — workflow terlalu berat. Bila mengubah satu huruf nama butuh tiga tanda tangan dan dua minggu, orang akan membuat “master bayangan” di spreadsheet — dan dalam setahun spreadsheet itu menjadi sistem yang sebenarnya. Aturan praktis: 80% perubahan rutin harus lolos dalam 1 hari kerja; yang lambat hanya yang berisiko.",
        "Jebakan 2 — golden record tanpa steward. Tabel “sumber kebenaran” yang tidak ada pemiliknya akan basi dalam tiga bulan: tidak ada yang berani mengubahnya, tidak ada yang berani menghapusnya. Golden record adalah jabatan, bukan tabel.",
        "Jebakan 3 — replikasi satu arah yang dilupakan. Perubahan disetujui di MDG tetapi job replikasi ke sistem satelit mati diam-diam selama dua minggu — gudang kembali memakai data lama. Setiap replikasi butuh monitoring dengan alert, bukan sekadar jadwal.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “governance yang baik = kontrol yang ketat”",
        body: "Yang benar: governance yang baik = kontrol yang proporsional dengan risiko. Kontrol maksimal untuk semua perubahan menghasilkan satu dari dua: antrean macet, atau sistem bayangan. Ukur lead time perubahan seperti kamu mengukur SLA — dan sesuaikan ambang eskalasinya tiap kuartal.",
        type: "pitfall",
      },
      reference: "Berat secukupnya; steward bernama; replikasi dimonitor.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan MDM",
      prose: [
        "Skenario 1 — Master < 10 ribu record, 1–2 sistem: spreadsheet terkontrol + satu penanggung jawab. MDM formal = overkill.",
        "Skenario 2 — Master dipakai 3–5 sistem, duplikat mulai merugikan: pola pinjaman (golden record + steward + validasi sebagai kode + audit trail) di database biasa.",
        "Skenario 3 — Enterprise teregulasi / > 500 perubahan per hari / banyak sistem satelit: MDM enterprise (SAP MDG atau sejenis) dengan workflow formal.",
        "Skenario 4 — Perusahaan non-SAP tetapi butuh kontrol: MDM non-SAP (Stibo, Informatica, Reltio) atau bangun registry sendiri — polanya sama, hanya tooling-nya beda.",
        "Aturan praktis 10 detik: (1) Hitung biaya duplikat per kuartal dulu — itu justifikasi anggarannya. (2) Tunjuk steward SEBELUM beli tool. (3) Mulai dari satu domain tersakit, bukan big-bang semua domain.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "12.000 record BP, 18% duplikat",
      prose: [
        "Distributor memiliki 12.000 record business partner; audit menemukan 18% adalah duplikat (2.160 record ganda). Setiap record duplikat rata-rata menyebabkan satu faktur ganda per tahun senilai Rp2,5 juta yang harus dikoreksi manual (biaya koreksi Rp150 ribu per kejadian). Pertanyaan: (1) Berapa biaya koreksi tahunan akibat duplikat? (2) Bila proyek MDM pola-pinjaman butuh Rp180 juta sekali jalan + Rp60 juta/tahun operasional, kapan impas? (3) Apa yang harus diukur tiap kuartal setelah MDM jalan?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "(1) 2.160 × Rp150 ribu = Rp324 juta/tahun. (2) Tahun 1: 324 − (180 + 60) = hemat Rp84 juta — impas di tahun pertama (bahkan tanpa menghitung faktur ganda yang dicegah). (3) Q = C × U × K per domain + lead time perubahan + % request yang lolos validasi otomatis. Tiga metrik ini menjawab “apakah gerbangnya bekerja?” setiap kuartal.",
        type: "risk",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      summary: [
        "MDM = penjaga gerbang perubahan master data, bukan proyek cleansing; cleansing tanpa governance kotor lagi dalam 6–12 bulan.",
        "Tiga pilar MDG: data model (apa) + change request & workflow (bagaimana) + steward (siapa); validasi, derivasi, replikasi di belakangnya.",
        "Kualitas master: Q = C × U × K (perkalian — satu nol, hasil nol).",
        "Mesin status: diajukan → validasi otomatis → ditinjau → disetujui/ditolak; cabang ditahan untuk kasus butuh wewenang L2.",
        "80% pola MDG bisa dipinjam tanpa SAP: golden record + steward bernama + validasi sebagai kode + audit trail.",
        "Governance proporsional: ukur lead time perubahan; mulai dari satu domain tersakit.",
      ],
      next: { label: "DM28 — Migrasi Data: Strategi, Cutover, dan Validasi", href: "/v2/learn/dm28-migrasi-data" },
      quiz: [
        {
          q: "Perusahaan sudah dua kali cleansing tetapi data kembali kotor dengan pola sama. Diagnosis yang tepat?",
          options: [
            { text: "Vendor cleansing-nya tidak kompeten — ganti vendor", why: "Salah: dua vendor berbeda gagal dengan pola sama = masalahnya sistemik, bukan vendor.", correct: false },
            { text: "Tidak ada pintu resmi perubahan: semua bisa edit, tak ada yang bertanggung jawab — keran bocornya belum ditutup", why: "Benar: cleansing tanpa governance = mengepel sambil keran bocor.", correct: true },
            { text: "Datanya terlalu banyak untuk dibersihkan", why: "Salah: volume bukan akar masalah bila pola kekotorannya berulang.", correct: false },
            { text: "Karyawan perlu training input data lagi", why: "Salah: training tanpa pintu resmi hanya menunda kekotoran berikutnya.", correct: false },
          ],
        },
        {
          q: "Dalam workflow MDG, kapan manusia (steward) dilibatkan?",
          options: [
            { text: "Di awal — setiap request harus dibaca manusia dulu", why: "Salah: itu menenggelamkan steward dalam request sampah.", correct: false },
            { text: "Setelah validasi otomatis selesai — mesin memfilter dulu, manusia memutuskan sisanya", why: "Benar: desain yang benar menaruh mesin di depan, manusia di belakang.", correct: true },
            { text: "Hanya bila request ditolak", why: "Salah: yang ditolak sudah selesai di mesin; steward menangani yang lolos filter tapi butuh penilaian.", correct: false },
            { text: "Tidak perlu — otomatisasi penuh", why: "Salah: aturan tidak bisa menilai konteks bisnis (mis. apakah kenaikan harga wajar).", correct: false },
          ],
        },
        {
          q: "Q = 0,9 × 0,8 × 0,5 = 0,36. Mengapa memakai perkalian, bukan rata-rata (0,73)?",
          options: [
            { text: "Agar angkanya terlihat lebih dramatis", why: "Salah: ini matematika, bukan retorika.", correct: false },
            { text: "Karena kegagalan satu dimensi merusak kegunaan record — record tak konsisten 50% tidak bisa dipakai walau lengkap dan unik", why: "Benar: seperti rantai — kekuatan ditentukan mata terlemah.", correct: true },
            { text: "Rata-rata tidak bisa dipakai untuk persentase", why: "Salah: rata-rata bisa dipakai, tetapi memberi gambaran yang menipu di sini.", correct: false },
            { text: "Standar industri DAMA mewajibkan perkalian", why: "Salah: ini kompas praktis lesson ini, bukan standar formal.", correct: false },
          ],
        },
        {
          q: "Request kenaikan harga 66,7% berstatus DITAHAN. Artinya?",
          options: [
            { text: "Request ditolak dan harus diajukan ulang", why: "Salah: ditahan ≠ ditolak — ia menunggu wewenang lebih tinggi.", correct: false },
            { text: "Menunggu approval L2 — aturannya mendeteksi risiko di atas ambang dan menaikkan ke pengambil keputusan yang berwenang", why: "Benar: eskalasi proporsional, bukan penolakan.", correct: true },
            { text: "Sistem error dan request hilang", why: "Salah: statusnya eksplisit tercatat di mesin status.", correct: false },
            { text: "Otomatis disetujui setelah 24 jam", why: "Salah: tidak ada auto-approve untuk kasus berisiko — itu justru yang dihindari.", correct: false },
          ],
        },
        {
          q: "Startup 25 orang, satu database, ingin “MDM seperti enterprise”. Saranmu?",
          options: [
            { text: "Beli SAP MDG sekarang agar siap saat besar nanti", why: "Salah: meriam untuk nyamuk — biaya dan kompleksitasnya membunuh kecepatan startup.", correct: false },
            { text: "Pola pinjaman: golden record + steward bernama + validasi sebagai kode — 80% manfaat tanpa lisensi enterprise", why: "Benar: proporsional dengan skala; beli tool-nya saat antrean manual runtuh.", correct: true },
            { text: "Tunda sampai datanya kotor dulu", why: "Salah: menunggu kotor = membayar biaya duplikat seperti cerita pembuka.", correct: false },
            { text: "MDM tidak relevan untuk startup", why: "Salah: polanya relevan sejak awal; yang tidak relevan adalah tool enterprise-nya.", correct: false },
          ],
        },
        {
          q: "Perubahan disetujui di MDG tetapi gudang tetap memakai data lama. Kemungkinan terbesar?",
          options: [
            { text: "Steward salah menyetujui", why: "Mungkin, tetapi bukan kemungkinan terbesar — persetujuan tercatat dan bisa diaudit.", correct: false },
            { text: "Job replikasi ke sistem satelit mati diam-diam — disetujui tidak sama dengan tersebar", why: "Benar: replikasi butuh monitoring + alert, bukan sekadar jadwal.", correct: true },
            { text: "Data model-nya salah", why: "Salah: data model yang salah akan menggagalkan validasi, bukan replikasi.", correct: false },
            { text: "Gudang menolak data baru", why: "Salah: sistem satelit tidak “menolak” — ia hanya belum menerima.", correct: false },
          ],
        },
      ],
    },
  ],
};
