import type { V2Lesson } from "../lib/types";

// ── Figure: matriks keputusan berbobot tiga jalur ────────────────────────
const MATRIX_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Matriks keputusan berbobot: Oracle 19c OCP 4,10 gugur anggaran, Oracle AI 23ai Pro 3,60 gugur, DP-300 3,55 layak dan direkomendasikan">
<g font-family="var(--font-ui)" font-size="11" fill="var(--text)" text-anchor="middle">
<text x="200" y="20" font-size="10" fill="var(--text-muted)">bobot →</text>
<text x="330" y="20">0,15</text><text x="390" y="20">0,20</text><text x="450" y="20">0,40</text><text x="510" y="20">0,25</text>
<text x="200" y="45" font-size="10" fill="var(--text-muted)">biaya</text><text x="200" y="62" font-size="10" fill="var(--text-muted)">waktu</text>
<text x="200" y="79" font-size="10" fill="var(--text-muted)">relevansi</text><text x="200" y="96" font-size="10" fill="var(--text-muted)">pengakuan</text>
<text x="90" y="135">Oracle 19c OCP</text><text x="330" y="135">2</text><text x="390" y="135">4</text><text x="450" y="135">5</text><text x="510" y="135">4</text>
<text x="90" y="165">Oracle AI 23ai Pro</text><text x="330" y="165">3</text><text x="390" y="165">4</text><text x="450" y="165">4</text><text x="510" y="165">3</text>
<text x="90" y="195">DP-300</text><text x="330" y="195">5</text><text x="390" y="195">3</text><text x="450" y="195">3</text><text x="510" y="195">4</text>
</g>
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<text x="90" y="228" fill="var(--c1)">4,10 ✗ anggaran</text>
<text x="280" y="228" fill="var(--c1)">3,60 ✗ anggaran</text>
<text x="470" y="228" fill="var(--c2)">3,55 ✓ LAYAK →</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="20" y1="112" x2="540" y2="112"/><line x1="20" y1="208" x2="540" y2="208"/>
</g>
</svg>`;

export const dba25: V2Lesson = {
  slug: "dba25-sertifikasi-oracle-azure",
  track: "Database Administrator",
  module: "Keandalan & Performa",
  title: "DBA25 — Jalur Sertifikasi DBA: Oracle & Azure",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Tujuan, rute, dan bekal",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) memetakan jalur sertifikasi DBA yang AKTIF per Oktober 2026 — Oracle 19c OCP, Oracle AI Database 23ai, dan Azure DP-300 — lengkap dengan kode ujiannya; (2) menjelaskan mengapa AWS Certified Database–Specialty TIDAK boleh masuk rencanamu; (3) memilih jalur dari role target dengan matriks berbobot (bukan dari gengsi); (4) menyusun bukti pengalaman yang mendampingi sertifikat; (5) menilai kapan sertifikat bernilai dan kapan portofolio lebih berbicara.",
        "Rutenya: cerita dua kandidat → peta sertifikasi (fakta terverifikasi Okt 2026) → matriks berbobot → lab keputusan + rencana 12 minggu → jebakan sertifikasi → peta keputusan → mini-case profil DBA junior → kuis → rangkuman dan penutup track. Estimasi 60 menit; lab-nya ±10 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Sertifikasi DBA = ujian resmi vendor yang memvalidasi kompetensimu (contoh: Oracle Certified Professional). Bobot keputusan = teknik memilih: tiap opsi dinilai per kriteria (1–5), dikali bobot kriteria, dijumlahkan — yang tertinggi menang, SETELAH yang gagal syarat keras disaring. Syarat keras (constraint) = filter ya/tidak yang tidak bisa ditawar, mis. anggaran.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: memilih sertifikasi seperti memilih kendaraan — bukan yang paling keren, melainkan yang muat di garasi (anggaran), cocok dengan jalanan (role target), dan bisa kamu kendarai tiap hari (waktu belajar).",
      ],
      reference: "Bekal: sertifikasi vendor, matriks berbobot, syarat keras. Fakta program = per Oktober 2026.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Dua kandidat, satu lowongan",
      prose: [
        "Lowongan DBA di sebuah bank: 47 pelamar. Kandidat A punya tiga sertifikat — semuanya dari program yang sudah pensiun atau tidak relevan dengan stack bank itu. Kandidat B punya satu sertifikat yang pas (Oracle 19c OCP — banknya memang Oracle shop) plus satu halaman portofolio: “migrasi 3 TB tanpa downtime, RTO 50 detik, runbook failover”. Yang dipanggil interview? Kandidat B. Yang ditanya dulu soal gajinya? Juga B.",
        "Twist-nya: kandidat A belajar LEBIH lama dan mengeluarkan biaya LEBIH besar — tetapi ia mengoleksi sertifikat seperti perangko, tanpa peta. Sertifikat yang salah bukan netral; ia mengirim sinyal bahwa pemiliknya tidak riset sebelum berinvestasi. Perekrut membaca itu.",
        "Lesson ini memberimu petanya: jalur mana yang hidup, bagaimana memilih dengan angka (bukan gengsi), dan bagaimana sertifikat + bukti pengalaman saling menguatkan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “makin banyak sertifikat makin mudah dapat kerja”",
        body: "Yang benar: SATU sertifikat yang selaras dengan role target + bukti pengalaman mengalahkan tiga sertifikat acak. Sertifikasi adalah sinyal — dan sinyal yang salah arah sama buruknya dengan tidak ada sinyal.",
        type: "pitfall",
      },
    },
    {
      id: "konsep-peta",
      eyebrow: "Langkah 3 · Konsep",
      title: "Peta sertifikasi — fakta per Oktober 2026",
      prose: [
        "Jalur 1 — Oracle Database 19c (jalur mapan, paling dicari enterprise/banking Indonesia). Dua ujian: 1Z0-082 (Administration I) + 1Z0-083 (Administration II) → gelar “Oracle Database Administration 2019 Certified Professional” (OCP). Titik masuk yang lebih ringan: 1Z0-071 (Oracle Database SQL) untuk level Associate. Catatan: namanya “2019” tetapi sertifikasinya untuk 19c — penamaan Oracle memang membingungkan; yang penting kodenya.",
        "Jalur 2 — Oracle AI Database 23ai (jalur baru, diumumkan April 2025 — dulu bernama “23ai”). Dua ujian: 1Z0-182 (Associate) + 1Z0-183 (Professional) → “Oracle AI Database Administration”. Ada juga ujian spesialis (1Z0-084 untuk multitenant, 1Z0-076/078/116 untuk area lain). Pilih jalur ini bila targetmu perusahaan yang mengadopsi 23ai/AI features — untuk bank konservatif, 19c masih lebih aman.",
        "Jalur 3 — Microsoft Azure DP-300 (“Administering Relational Databases on Microsoft Azure”) → “Azure Database Administrator Associate”. SATU ujian — paling ringan dari sisi jumlah ujian. Blueprint diperbarui 24 April 2026 dan berlaku saat ini; pembaruan berikutnya dijadwalkan 27 Oktober 2026 (belum berlaku per lesson ini ditulis — cek ulang sebelum daftar). Pilih bila targetmu cloud/Azure shop.",
        "Kontras — AWS: “AWS Certified Database – Specialty” (DBS-C01) PENSIUN 30 April 2024. Jangan memasukkannya ke rencanamu, dan waspadai materi/bootcamp yang masih menjualnya. Alternatif AWS yang hidup: DEA-C01 (Data Engineer Associate) atau SAP-C02 (Solutions Architect Professional) — tetapi keduanya bukan sertifikasi DBA murni.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “kode ujian tidak berubah, hafalkan saja”",
        body: "Yang benar: nama dan kode ujian BERUBAH (bukti: 23ai → AI Database; DBS-C01 pensiun; blueprint DP-300 berganti). Selalu verifikasi kode ujian di situs resmi vendor maksimal seminggu sebelum mendaftar. Mempersiapkan ujian yang salah kode = belajar untuk pintu yang sudah pindah.",
        type: "pitfall",
      },
      hints: [
        "💡 Intuisi: anggap peta sertifikasi seperti peta jalan — ia kedaluwarsa. Lesson ini benar per Oktober 2026; saat kamu eksekusi, verifikasi ulang di situs Oracle/Microsoft sebelum membayar biaya ujian.",
      ],
      reference: "19c OCP = 1Z0-082 + 1Z0-083. 23ai Pro = 1Z0-182 + 1Z0-183. DP-300 = satu ujian. DBS-C01 pensiun Apr 2024.",
    },
    {
      id: "konsep-matriks",
      eyebrow: "Langkah 4 · Konsep",
      title: "Matriks berbobot — Si Penimbang",
      prose: [
        "Definisi: matriks berbobot mengubah “kayaknya bagus” menjadi angka. Tiap jalur dinilai 1–5 per kriteria (biaya/keterjangkauan, waktu, relevansi dengan role target, pengakuan pasar), tiap kriteria punya bobot (total 1,0), skor = jumlah bobot × nilai. ATURAN MAIN yang paling penting: syarat keras difilter DULU — jalur yang gagal anggaran/bahasa/waktu tersingkir sebelum skor dibandingkan. Menghitung skor dulu baru memikirkan anggaran = mengagumi mobil yang tidak bisa dibeli.",
        "Cara membaca chart di bawah: kolom = bobot tiap kriteria (relevansi 0,40 paling berat — disengaja: sertifikat yang tidak relevan dengan target = sia-sia); baris = nilai 1–5 tiap jalur; bawah = skor akhir + vonis. Interpretasi: Oracle 19c OCP menang skor (4,10) TETAPI gugur di syarat anggaran (keterjangkauan 2 < 4) — ia butuh dua ujian; DP-300 (3,55) lolos semua syarat dan menjadi rekomendasi. Inilah twist lab: yang tertinggi tidak selalu yang terpilih.",
        "Kepribadiannya: matriks ini seperti juri yang jujur tapi kaku — ia tidak peduli gengsimu, hanya peduli angka yang KAMU masukkan. Garbage in, gospel out: nilai “relevansi” harus dari riset lowongan (berapa loker menyebut Oracle vs Azure?), bukan dari perasaan.",
      ],
      formula: String.raw`S = \sum_{i} w_i \times s_i \quad \text{dengan} \quad \sum_i w_i = 1`,
      formulaNote: "S = skor total jalur; w_i = bobot kriteria i (jumlah semua bobot = 1 — menaikkan satu bobot berarti menurunkan yang lain, tidak ada makan siang gratis); s_i = nilai jalur pada kriteria i (1–5). Contoh DP-300: 0,15×5 + 0,20×3 + 0,40×3 + 0,25×4 = 3,55. Syarat keras (anggaran ≥ 4) diterapkan SEBELUM perbandingan S.",
      figure: {
        svg: MATRIX_SVG,
        alt: "Matriks berbobot tiga jalur sertifikasi dengan skor dan vonis kelayakan",
        caption: "OCP 4,10 gugur anggaran; 23ai Pro 3,60 gugur anggaran; DP-300 3,55 layak → rekomendasi. Skor tanpa filter syarat keras menyesatkan.",
      },
      tasks: [],
      hints: [
        "💡 Intuisi: bobot adalah pernyataan prioritas. Relevansi 0,40 berarti kamu menyatakan “kecocokan dengan role target empat kali lebih penting dari biaya” — berani menandatangani pernyataan itu? Kalau tidak, ubah bobotnya.",
      ],
      reference: "S = Σ w_i × s_i; Σw = 1. Filter syarat keras dulu, bandingkan skor kemudian.",
    },
    {
      id: "konsep-bukti",
      eyebrow: "Langkah 5 · Konsep",
      title: "Bukti pengalaman — Si Pasangan Sertifikat",
      prose: [
        "Definisi: bukti pengalaman = artefak kerja nyata yang bisa diverifikasi — runbook failover yang pernah kamu uji, dasbor metrik database, post-mortem insiden yang kamu tulis, skrip backup yang berjalan di produksi. Sertifikat membuktikan kamu BISA (lolos ujian); bukti membuktikan kamu PERNAH (menyentuh sistem nyata). Perekrut senior menimbang yang kedua lebih berat.",
        "Tiga bentuk bukti yang murah tetapi kuat untuk DBA junior: (1) lab terdokumentasi — replikasi Postgres + failover manual + RTO terukur (persis seperti lab DBA23!), ditulis sebagai satu halaman; (2) post-mortem — satu insiden (bahkan di lab) dengan timeline, akar masalah, dan aksi pencegahan; (3) runbook — prosedur backup/restore yang sudah kamu uji restore-nya (DBA24 mengajarkan: backup tanpa restore test = harapan).",
        "Nilainya vs sertifikat: sertifikat membuka pintu ATS (filter otomatis lowongan); bukti memenangkan interview (cerita yang bisa ditanya balik). Strategi optimal untuk career pivot: kejar SATU sertifikat yang selaras + bangun 2–3 bukti — bukan lima sertifikat tanpa cerita.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “lulus ujian = siap kerja sebagai DBA”",
        body: "Yang benar: ujian menguji pengetahuan dalam kondisi steril; produksi menguji penilaian dalam kondisi kotor (jam 3 pagi, alert beruntun, manajer panik). Sertifikat tanpa bukti = SIM tanpa jam terbang. Kumpulkan jam terbang di lab yang terdokumentasi — murah, aman, dan bisa diceritakan.",
        type: "pitfall",
      },
      hints: [
        "💡 Intuisi: tiap lesson track ini memberimu bahan bukti — DBA23 (RTO failover), DBA24 (strategi load), DBA22 (Always On). Tiga lab = tiga halaman portofolio. Sertifikat adalah bingkainya.",
      ],
      reference: "Sertifikat = bisa; bukti = pernah. Satu sertifikat selaras + 2–3 bukti > lima sertifikat tanpa cerita.",
    },
    {
      id: "lab-keputusan",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Matriks keputusan + rencana 12 minggu",
      prose: [
        "Profil contoh: DBA junior di perusahaan enterprise, target tetap di dunia on-prem perbankan (relevansi Oracle tinggi), anggaran terbatas. Tugasmu: lengkapi fungsi `skor` (jumlah berbobot) dan `layak` (filter anggaran: keterjangkauan ≥ 4). Driver mencetak skor, vonis tiap jalur, rekomendasi (terbaik di antara yang LAYAK), dan rencana belajar 12 minggu / 120 jam.",
        "Perhatikan twist-nya: Oracle 19c OCP punya skor tertinggi (4,10) tetapi GUGUR anggaran — rekomendasi jatuh ke DP-300. Itulah gunanya filter syarat keras. Coba: setelah lolos, naikkan ANGGARAN menjadi 2 (anggaran longgar) dan lihat rekomendasinya berubah menjadi OCP — keputusan yang benar BERGANTUNG pada constraint-mu, bukan pada “jalur terbaik” secara absolut.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `skor`: jumlahkan bobot[k] × j[k] untuk tiap kriteria" },
        { id: "t2", text: "Lengkapi `layak`: True bila j[\"biaya\"] >= ANGGARAN" },
        { id: "t3", text: "Jalankan dan pastikan rekomendasi = DP-300" },
      ],
      expected: "Oracle 19c OCP: skor 4.10 -> GUGUR (anggaran)\nOracle AI 23ai Pro: skor 3.60 -> GUGUR (anggaran)\nDP-300: skor 3.55 -> LAYAK\nRekomendasi: DP-300 (3.55)\nRencana 12 minggu: Fondasi 30 jam, Inti 36 jam, Lab 30 jam, Tryout 24 jam\nTotal: 120 jam",
      code: {
        starter: `# Lab DBA25 — data SINTETIS untuk latihan pengambilan keputusan
jalur = [  # JANGAN UBAH
    {"nama": "Oracle 19c OCP", "biaya": 2, "waktu": 4, "relevansi": 5, "pengakuan": 4},
    {"nama": "Oracle AI 23ai Pro", "biaya": 3, "waktu": 4, "relevansi": 4, "pengakuan": 3},
    {"nama": "DP-300", "biaya": 5, "waktu": 3, "relevansi": 3, "pengakuan": 4},
]  # JANGAN UBAH
bobot = {"biaya": 0.15, "waktu": 0.20, "relevansi": 0.40, "pengakuan": 0.25}  # JANGAN UBAH
ANGGARAN = 4  # JANGAN UBAH (skor keterjangkauan minimum)

def skor(j):
    # TODO t1: jumlahkan bobot[k] * j[k] untuk tiap kriteria
    return 0.0

def layak(j):
    # TODO t2: True bila j["biaya"] >= ANGGARAN
    return False

# --- driver: JANGAN UBAH di bawah ini ---
hasil = [(j["nama"], round(skor(j), 2), layak(j)) for j in jalur]
for nama, s, ok in hasil:
    print("%s: skor %.2f -> %s" % (nama, s, "LAYAK" if ok else "GUGUR (anggaran)"))
kandidat = [h for h in hasil if h[2]]
terbaik = max(kandidat, key=lambda x: x[1])
print("Rekomendasi: %s (%.2f)" % (terbaik[0], terbaik[1]))
fase = [("Fondasi", 30), ("Inti", 36), ("Lab", 30), ("Tryout", 24)]
print("Rencana 12 minggu: " + ", ".join("%s %d jam" % (n, h) for n, h in fase))
print("Total: %d jam" % sum(h for _, h in fase))`,
        lockLines: 8,
        solution: `# Lab DBA25 — data SINTETIS untuk latihan pengambilan keputusan
jalur = [  # JANGAN UBAH
    {"nama": "Oracle 19c OCP", "biaya": 2, "waktu": 4, "relevansi": 5, "pengakuan": 4},
    {"nama": "Oracle AI 23ai Pro", "biaya": 3, "waktu": 4, "relevansi": 4, "pengakuan": 3},
    {"nama": "DP-300", "biaya": 5, "waktu": 3, "relevansi": 3, "pengakuan": 4},
]  # JANGAN UBAH
bobot = {"biaya": 0.15, "waktu": 0.20, "relevansi": 0.40, "pengakuan": 0.25}  # JANGAN UBAH
ANGGARAN = 4  # JANGAN UBAH (skor keterjangkauan minimum)

def skor(j):
    return sum(bobot[k] * j[k] for k in bobot)

def layak(j):
    return j["biaya"] >= ANGGARAN

# --- driver: JANGAN UBAH di bawah ini ---
hasil = [(j["nama"], round(skor(j), 2), layak(j)) for j in jalur]
for nama, s, ok in hasil:
    print("%s: skor %.2f -> %s" % (nama, s, "LAYAK" if ok else "GUGUR (anggaran)"))
kandidat = [h for h in hasil if h[2]]
terbaik = max(kandidat, key=lambda x: x[1])
print("Rekomendasi: %s (%.2f)" % (terbaik[0], terbaik[1]))
fase = [("Fondasi", 30), ("Inti", 36), ("Lab", 30), ("Tryout", 24)]
print("Rencana 12 minggu: " + ", ".join("%s %d jam" % (n, h) for n, h in fase))
print("Total: %d jam" % sum(h for _, h in fase))`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "Oracle 19c OCP: skor 4\\.10 -> GUGUR", label: "OCP gugur anggaran", msg: "Skor 4,10 tetapi keterjangkauan 2 < 4." },
          { kind: "stdout_matches", task: "t3", pattern: "Oracle AI 23ai Pro: skor 3\\.60 -> GUGUR", label: "23ai Pro gugur anggaran", msg: "Skor 3,60 tetapi keterjangkauan 3 < 4." },
          { kind: "stdout_matches", task: "t3", pattern: "DP-300: skor 3\\.55 -> LAYAK", label: "DP-300 layak", msg: "Skor 3,55 dan lolos filter anggaran." },
          { kind: "stdout_matches", task: "t3", pattern: "Rekomendasi: DP-300 \\(3\\.55\\)", label: "Rekomendasi DP-300", msg: "Terbaik di antara yang LAYAK." },
          { kind: "stdout_matches", task: "t3", pattern: "Total: 120 jam", label: "Total rencana 120 jam", msg: "30+36+30+24 = 120 jam dalam 12 minggu." },
        ],
      },
      reference: "Skor: OCP 4,10 (gugur), 23ai Pro 3,60 (gugur), DP-300 3,55 (layak → rekomendasi). Rencana: 120 jam / 12 minggu.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Tiga jebakan sertifikasi",
      prose: [
        "Jebakan 1 — dump soal. Menghafal bocoran soal memang meluluskan ujian — dan menghancurkan nilainya. Pewawancara senior menciumnya dalam 5 menit (“coba jelaskan kenapa jawabanmu begitu”). Aturan: bila kamu tidak bisa menjelaskan jawabannya tanpa pilihan ganda, kamu belum siap — lulus atau tidak.",
        "Jebakan 2 — sertifikasi kedaluwarsa di CV. Mencantumkan DBS-C01 (pensiun April 2024) sebagai “rencana aktif” memberi tahu perekrut bahwa risetmu basi. Aturan: audit CV tiap 6 bulan; hapus yang pensiun, perbarui yang berganti kode.",
        "Jebakan 3 — belajar untuk ujian, bukan untuk peran. Lulus DP-300 tetapi tidak pernah menyentuh Azure portal = sertifikat kertas. Aturan: tiap topik ujian dipasangkan dengan lab nyata — 120 jam rencanamu dibagi 30/36/30/24 dengan porsi lab 30 jam karena alasan ini.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “tujuan belajar = lulus ujian”",
        body: "Yang benar: tujuan belajar = bisa melakukan pekerjaannya; lulus ujian adalah efek samping. Orang yang belajar untuk peran lulus ujian dengan sendirinya; orang yang belajar untuk ujian sering gagal di interview teknis pertama.",
        type: "pitfall",
      },
      reference: "Tanpa dump; audit CV 6 bulanan; tiap topik ujian + lab nyata.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan jalur sertifikasi",
      prose: [
        "Skenario 1 — Target enterprise/bank on-prem (Oracle shop): Oracle 19c OCP (1Z0-082 + 1Z0-083) — paling mapan dan dicari; siapkan anggaran dua ujian.",
        "Skenario 2 — Target perusahaan adopter 23ai/AI features: Oracle AI Database Pro (1Z0-182 + 1Z0-183) — jalur baru, verifikasi relevansinya ke loker incaran.",
        "Skenario 3 — Target cloud/Azure atau anggaran ketat: DP-300 — satu ujian, blueprint cek ulang sebelum daftar.",
        "Skenario 4 — Tergoda AWS Database Specialty: JANGAN — pensiun April 2024; pertimbangkan DEA-C01/SAP-C02 hanya bila targetmu memang AWS (dan sadari keduanya bukan DBA murni).",
        "Aturan praktis 10 detik: (1) Riset 20 loker incaran dulu, hitung sebutan tiap vendor. (2) Filter syarat keras (anggaran/waktu) sebelum bandingkan skor. (3) Satu sertifikat selaras + 2–3 bukti > banyak sertifikat acak. (4) Verifikasi kode ujian di situs resmi sebelum membayar.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Profilmu sendiri",
      prose: [
        "Kamu: profesional yang pivot ke data, 10 jam/minggu untuk belajar, anggaran terbatas (satu ujian dalam 6 bulan), target 12 bulan ke depan: role data/analitik di perusahaan enterprise Indonesia (banyak Oracle shop, sebagian migrasi ke cloud). Pertanyaan: (1) Dengan bobot lab tadi, jalur apa rekomendasimu — dan apa yang berubah bila anggaranmu longgar? (2) Bukti pengalaman apa yang kamu bangun PARALEL selama 12 minggu belajar? (3) Kapan kamu memutuskan sertifikat kedua?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "(1) Anggaran ketat → DP-300 (satu ujian, layak, 3,55); anggaran longgar → OCP 19c (4,10, dua ujian, paling relevan untuk enterprise Oracle shop). Tidak ada jawaban absolut — hanya jawaban yang konsisten dengan constraint. (2) Paralel: satu halaman lab replikasi+failover (DBA23), satu analisis strategi load (DBA24), satu runbook backup/restore teruji — 30 jam porsi lab dipakai untuk ini, bukan sekadar latihan soal. (3) Sertifikat kedua diputuskan SETELAH yang pertama dipakai melamar 2–3 bulan: bila pasar merespons baik, dalami (spesialis); bila pasar meminta cloud, ambil DP-300/AWS. Data pasar > rencana di atas kertas.",
        type: "risk",
      },
    },
    {
      id: "jalur-dbre",
      eyebrow: "Tambahan · DB16",
      title: "Jalur DBRE: saat DBA bertemu SRE",
      prose: [
        "Lesson ini sejauh ini membahas jalur SERTIFIKASI (Oracle, Azure) — tetapi spec DB16 meminta satu jalur lagi: DBRE, Database Reliability Engineer (juga disebut platform engineer untuk data). DBRE adalah DBA yang bekerja dengan cara SRE (site reliability engineering): bukan hanya mengoperasikan database, melainkan membangun PLATFORM agar tim lain bisa memakai database dengan aman tanpa mengetuk pintu DBA tiap kali.",
        "Empat pembeda DBRE dari DBA tradisional. Satu: SLO & ERROR BUDGET — layanan database punya target terukur (misalnya ketersediaan 99,9 persen per bulan — angka contoh) dan 'anggaran kesalahan' yang bila habis, perubahan fitur ditahan demi stabilitas. Dua: OTOMASI SEBAGAI PEKERJAAN UTAMA — provisioning, backup, failover, dan scaling ditulis sebagai kode (lihat DBA13/DBA23), bukan dijalankan manual; pekerjaan manual yang berulang disebut 'toil' dan targetnya ditekan di bawah separuh waktu kerja. Tiga: SELF-SERVICE — tim produk bisa membuat database, menaikkan ukuran, dan melihat metriknya sendiri lewat platform — dengan guardrail (batas ukuran, backup otomatis aktif) sehingga kebebasan tidak menjadi kekacauan. Empat: BLAMELESS POSTMORTEM & DRILL — insiden dipelajari tanpa menyalahkan orang (lihat DBA12/DBA16), dan failover dilatih seperti latihan kebakaran.",
        "Jalur kariernya: DBA yang kuat di otomasi (scripting, IaC, CI/CD — DBA13/DBA23) + paham SRE (SLO, monitoring, incident response — DBA8/DBA12) adalah kandidat DBRE. Sertifikasi di lesson ini tetap berguna sebagai bukti penguasaan produk (Oracle/Azure), tetapi DBRE dinilai dari PORTOFOLIO OTOMASI: pipeline provisioning yang kamu bangun, runbook yang kamu kodifikasi, dan insiden yang tidak terulang karena guardrail yang kamu pasang. Bila sertifikasi adalah ijazah, portofolio otomasi adalah transkrip nilai DBRE.",
        "Catatan jujur: tidak semua organisasi butuh DBRE — tim kecil dengan satu database mungkin lebih butuh DBA generalis yang andal. DBRE bersinar di organisasi dengan BANYAK database, BANYAK tim, dan perubahan yang cepat — di sanalah platform dan guardrail menghemat ratusan jam toil. Pilih jalur ini bila kamu suka membangun sistem yang membuat orang lain mandiri — bukan bila kamu suka menjadi satu-satunya orang yang bisa memperbaiki database.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke karier",
        type: "risk",
        body: "“DBRE = DBA dengan gaji lebih besar.” Bukan — DBRE = DBA dengan PEKERJAAN berbeda: membangun platform, bukan hanya mengoperasikan. Bila kamu tidak suka menulis kode dan membangun guardrail, jalur sertifikasi DBA senior (lesson ini) adalah jalur yang lebih jujur untukmu.",
      },
      quiz: [
        {
          q: "Pembeda utama DBRE dari DBA tradisional?",
          options: [
            { text: "DBRE tidak perlu memahami database", why: "Salah: DBRE tetap DBA — penguasaan database adalah fondasinya." },
            { text: "DBRE membangun platform + otomasi + SLO/error budget agar tim lain mandiri dengan guardrail", why: "Benar: DBRE = DBA dengan cara kerja SRE — platform, bukan hanya operasi manual.", correct: true },
            { text: "DBRE hanya bekerja di cloud dan tidak menyentuh on-premise", why: "Salah: DBRE soal cara kerja (platform + otomasi), bukan soal lokasi server." },
            { text: "DBRE tidak perlu sertifikasi apa pun", why: "Salah: sertifikasi tetap bukti penguasaan produk — hanya bukan satu-satunya bukti; portofolio otomasi yang dinilai." },
          ],
        },
      ],
      reference: "DBRE = DBA + SRE: SLO, otomasi, self-service ber-guardrail, postmortem blameless.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah — sekaligus penutup track Database Administrator. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      summary: [
        "Jalur DBRE: DBA dengan cara kerja SRE — platform, otomasi, SLO/error budget, self-service ber-guardrail.",
        "Jalur aktif per Okt 2026: Oracle 19c OCP (1Z0-082+083), Oracle AI 23ai Pro (1Z0-182+183), Azure DP-300 (satu ujian).",
        "AWS Database Specialty (DBS-C01) pensiun April 2024 — jangan masuk rencana.",
        "Pilih dengan matriks berbobot S = Σ w_i × s_i; filter syarat keras DULU, bandingkan skor kemudian.",
        "Sertifikat = bisa; bukti pengalaman = pernah. Satu sertifikat selaras + 2–3 bukti menang.",
        "Belajar untuk peran, bukan untuk ujian; tiap topik dipasangkan lab nyata.",
        "Verifikasi kode ujian di situs resmi sebelum membayar — peta kedaluwarsa, vendor tidak.",
        "Track Database Administrator selesai — 25 lesson dari fondasi operasi hingga sertifikasi. Kembali ke kurikulum untuk track berikutnya.",
      ],
      next: { label: "DBA26 — Normalisasi dari Kursi DBA: BCNF, Review Skema, dan Denormalisasi Operasional", href: "/v2/learn/dba26-normalisasi-dba" },
      quiz: [
        {
          q: "Kandidat DBA perlu sertifikasi Oracle. Kombinasi ujian yang benar untuk OCP 19c?",
          options: [
            { text: "1Z0-082 + 1Z0-083", why: "Benar: Administration I + II → Oracle Database Administration 2019 Certified Professional.", correct: true },
            { text: "1Z0-182 + 1Z0-183", why: "Salah: itu jalur Oracle AI Database 23ai Professional, bukan 19c.", correct: false },
            { text: "DP-300", why: "Salah: itu jalur Azure, bukan Oracle.", correct: false },
            { text: "DBS-C01", why: "Salah: AWS Database Specialty pensiun April 2024.", correct: false },
          ],
        },
        {
          q: "Dalam matriks lab, mengapa Oracle 19c OCP (skor 4,10) tidak direkomendasikan?",
          options: [
            { text: "Skornya paling rendah", why: "Salah: 4,10 adalah skor TERTINGGI.", correct: false },
            { text: "Gugur di syarat keras anggaran (keterjangkauan 2 < 4) — filter kelayakan mendahului perbandingan skor", why: "Benar: constraint dulu, optimasi kemudian.", correct: true },
            { text: "Tidak relevan dengan role target", why: "Salah: relevansinya 5, tertinggi.", correct: false },
            { text: "Ujiannya sudah pensiun", why: "Salah: jalur 19c masih aktif.", correct: false },
          ],
        },
        {
          q: "Rekanmu berencana mengambil AWS Certified Database – Specialty tahun depan. Responsmu?",
          options: [
            { text: "Dukung — AWS selalu bagus", why: "Salah: programnya pensiun April 2024; dukung = menjerumuskan.", correct: false },
            { text: "Cegah: programnya pensiun 30 April 2024 — arahkan ke DEA-C01/SAP-C02 bila targetnya AWS, atau jalur DBA murni lain", why: "Benar: fakta kedaluwarsa + alternatif yang hidup.", correct: true },
            { text: "Dukung — namanya bergengsi", why: "Salah: gengsi program pensiun tidak membuka pintu ATS.", correct: false },
            { text: "Netral — terserah dia", why: "Salah: teman yang tahu diam = tidak membantu.", correct: false },
          ],
        },
        {
          q: "Bobot relevansi 0,40 dalam matriks artinya...",
          options: [
            { text: "Relevansi 40% lebih penting dari kriteria lain", why: "Salah: bukan 40% “lebih”, melainkan bobot 0,40 dari total 1,0.", correct: false },
            { text: "Kamu menyatakan kecocokan dengan role target adalah prioritas terbesar — dan harus berani mempertahankannya", why: "Benar: bobot = pernyataan prioritas yang harus bisa dipertanggungjawabkan.", correct: true },
            { text: "Skor relevansi dikali 40", why: "Salah: dikali 0,40.", correct: false },
            { text: "Hanya 40% jalur yang relevan", why: "Salah: salah baca total.", correct: false },
          ],
        },
        {
          q: "Strategi terbaik untuk career pivot dengan waktu terbatas?",
          options: [
            { text: "Kumpulkan lima sertifikat secepatnya", why: "Salah: koleksi acak mengirim sinyal riset yang buruk.", correct: false },
            { text: "Satu sertifikat yang selaras dengan role target + 2–3 bukti pengalaman paralel", why: "Benar: sinyal + cerita yang bisa ditanya balik.", correct: true },
            { text: "Fokus dump soal agar lulus cepat", why: "Salah: lulus tanpa pemahaman gagal di interview 5 menit.", correct: false },
            { text: "Tunggu sampai ada lowongan baru belajar", why: "Salah: persiapan 12 minggu tidak bisa dikebut semalam.", correct: false },
          ],
        },
        {
          q: "Sebelum membayar biaya ujian DP-300, satu hal wajib?",
          options: [
            { text: "Menghafal blueprint dari blog tahun lalu", why: "Salah: blueprint diperbarui (Apr 2026; berikutnya Okt 2026) — blog lama bisa basi.", correct: false },
            { text: "Verifikasi kode ujian + blueprint yang berlaku di situs resmi Microsoft", why: "Benar: peta kedaluwarsa; vendor adalah sumber kebenaran.", correct: true },
            { text: "Membeli materi termahal", why: "Salah: harga materi ≠ kualitas.", correct: false },
            { text: "Menunggu teman mendaftar dulu", why: "Salah: keputusan karir tidak menunggu teman.", correct: false },
          ],
        },
      ],
    },
  ],
};
