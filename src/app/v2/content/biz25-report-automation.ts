import type { V2Lesson } from "../lib/types";

// Timeline refresh: watermark maju 13->15 Okt; alert pada 14 Okt (omzet 1,2 jt < ambang 1,5 jt).
const BIZ25_TIMELINE_SVG = `<svg viewBox="0 0 560 240" role="img" aria-label="Garis waktu refresh: watermark maju setiap hari, alert muncul 14 Oktober.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="40" y1="120" x2="520" y2="120"/>
</g>
<g font-family="var(--font-ui)">
<circle cx="100" cy="120" r="10" fill="var(--c1)"/>
<text x="100" y="150" text-anchor="middle" font-size="10" fill="var(--chart-text)">12 Okt</text>
<text x="100" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="var(--text)">2,4 jt</text>
<circle cx="220" cy="120" r="10" fill="var(--c1)"/>
<text x="220" y="150" text-anchor="middle" font-size="10" fill="var(--chart-text)">13 Okt</text>
<text x="220" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="var(--text)">2,55 jt</text>
<circle cx="340" cy="120" r="14" fill="var(--c4)"/>
<text x="340" y="150" text-anchor="middle" font-size="10" fill="var(--chart-text)">14 Okt</text>
<text x="340" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="var(--text)">1,2 jt</text>
<text x="340" y="80" text-anchor="middle" font-size="10" font-weight="700" fill="var(--c4)">ALERT</text>
<circle cx="460" cy="120" r="10" fill="var(--c1)"/>
<text x="460" y="150" text-anchor="middle" font-size="10" fill="var(--chart-text)">15 Okt</text>
<text x="460" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="var(--text)">2,4 jt</text>
<text x="280" y="190" text-anchor="middle" font-size="11" fill="var(--text-muted)">Watermark: 13 Okt \u2192 15 Okt \u00b7 ambang alert 1,5 jt/hari</text>
<text x="280" y="210" text-anchor="middle" font-size="11" fill="var(--text-muted)">Refresh kedua batch yang sama: 0 baris baru (idempoten) \u2713</text>
</g>
</svg>`;

export const biz25: V2Lesson = {
  slug: "biz25-report-automation",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "BI25 — Report Automation: Dashboard yang Memperbarui Dirinya",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Dasbor yang datanya tidak diperbarui adalah brosur — bagus dilihat, berbahaya dipakai. Lesson ini tentang membuat dasbor MEMPERBARUI DIRINYA: refresh terjadwal, load inkremental dengan watermark, alert saat angka menyimpang, dan — yang paling penting — memastikan kegagalan tidak pernah terjadi diam-diam.",
        "Setelah lesson ini kamu bisa: (1) membedakan full refresh vs incremental load dan memilihnya dari volume data; (2) mengimplementasikan watermark agar refresh idempoten (dijalankan dua kali tidak mendobel data); (3) merancang aturan alert berbasis ambang yang tidak berisik; (4) menulis runbook \u201Crefresh gagal\u201D: siapa dihubungi, SLA berapa, dan apa yang dilihat pengguna selama data basi; (5) menghitung biaya kegagalan senyap dalam rupiah.",
        "Rute: cerita (tiga hari dasbor basi) → full vs incremental → watermark & idempotency → alert yang tidak berisik → kegagalan senyap & runbook → lab refresh inkremental → peta keputusan → mini-case → checkpoint.",
        "Bekal ringkas: kamu sudah membangun pipeline di BI23 dan lapisan medallion di BI24. Lesson ini adalah \u201Cpenjaga malam\u201D-nya: memastikan semua itu berjalan tiap hari tanpa kamu menunggui.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Tiga hari dasbor basi — dan tidak ada yang tahu",
      prose: [
        "Pak Hendra, direktur PT Maju Bersama, punya ritual: tiap jam 07:00 ia membuka dasbor penjualan harian di HP sebelum berangkat kantor. Jumat pagi angkanya normal. Senin pagi — rapat promo besar — angkanya \u201Cstabil\u201D. Ia menyetujui promo Rp200 juta untuk produk yang \u201Claris\u201D.",
        "Rabu, tim gudang menelepon: stok produk itu KOSONG sejak Minggu. Investigasi: password service account Power BI kedaluwarsa Jumat 17:00. Refresh gagal Sabtu, Minggu, Senin. Dasbor menampilkan data Jumat selama tiga hari — dan TIDAK ADA SATU PUN ALERT yang terkirim. Pak Hendra membuat keputusan Rp200 juta dari brosur basi.",
        "Twist-nya: kegagalan teknisnya sepele (password kedaluwarsa — 5 menit memperbaikinya). Yang mahal adalah KEGAGALAN SENYAPNYA: sistem yang gagal tanpa berteriak. Dasbor yang error terang-terangan (tulisan merah \u201Crefresh gagal\u201D) justru lebih aman daripada dasbor yang diam-diam basi — karena yang pertama tidak dipakai untuk keputusan.",
        "Lesson ini membangun penjaga malamnya: refresh terjadwal yang idempoten, watermark yang jujur, alert yang berteriak pada dua jenis masalah — angka yang aneh, DAN proses yang macet.",
      ],
      tasks: [],
    },
    {
      id: "full-vs-incremental",
      eyebrow: "Langkah 3 · Refresh",
      title: "Full vs incremental: menyiram kebun dengan ember atau selang",
      prose: [
        "FULL REFRESH: tiap pagi hapus semua, tarik ulang 5 tahun data. Sederhana dan selalu konsisten — tetapi seperti menyiram kebun dengan ember bolak-balik: untuk 100 baris tidak masalah, untuk 100 juta baris kamu menghabiskan 6 jam dan tagihan cloud yang membuat finance pingsan.",
        "INCREMENTAL LOAD: hanya ambil yang BARU sejak terakhir berhasil. Seperti selang: efisien, tetapi butuh \u201Cpenanda\u201D — itulah watermark. Aturannya: data < 1 juta baris dan refresh < 10 menit → full refresh saja, jangan over-engineering. Di atas itu → incremental.",
        "Jebakan klasik incremental: data LAMA yang berubah (koreksi faktur minggu lalu, retur yang baru dicatat). Incremental murni butuh \u201Cjendela lihat-balik\u201D (lookback): tiap refresh ambil ulang 7 hari terakhir, bukan hanya kemarin. Tanpa lookback, koreksimu tidak pernah sampai ke dasbor.",
        "\uD83D\uDCA1 Intuisi kunci: pilih strategi dari DUA angka: volume data dan jendela toleransi basi. \u201CData boleh basi berapa lama?\u201D menentukan jadwal; \u201Cberapa banyak yang berubah per hari?\u201D menentukan full vs incremental.",
      ],
      tasks: [],
      reference: "Kecil & cepat → full. Besar → incremental + watermark + lookback 7 hari.",
    },
    {
      id: "watermark",
      eyebrow: "Langkah 4 · Watermark",
      title: "Watermark: garis batas yang tidak bisa diduplikasi",
      prose: [
        "Watermark adalah \u201Cterakhir kali aku berhasil sampai sini\u201D — biasanya tanggal/waktu maksimum yang sudah diproses. Rumus kerjanya satu baris: baris baru = semua baris dengan tanggal LEBIH BESAR dari watermark. Ketat memakai > (bukan ≥): baris yang TEPAT di watermark sudah diproses kemarin — memakainya lagi berarti duplikat.",
        "Sifat terpentingnya: IDEMPOTEN. Jalankan refresh yang sama dua kali → hasil identik, tidak ada baris ganda. Kenapa penting? Karena di dunia nyata refresh GAGAL di tengah jalan lalu dijalankan ulang — tanpa idempotency, data Senin masuk dua kali dan omzetmu dobel (terdengar familiar? itulah dosa Riko di BI23, versi otomatis).",
        "Cara membaca gambar di bawah: garis waktu 12–15 Okt dengan omzet harian; watermark bergerak 13 → 15 Okt seiring batch diproses; 14 Okt menyala ALERT (1,2 jt < ambang 1,5 jt). Interpretasi: watermark adalah memori pipeline — ia tahu persis sampai mana yang sudah dikerjakan, sehingga refresh yang terputus bisa dilanjutkan tanpa mengulang atau mendobel.",
        "\uD83D\uDCA1 Intuisi kunci: watermark yang baik disimpan di TEMPAT yang sama tahan bantingnya dengan datanya (tabel kontrol, bukan variabel di memori). Pipeline yang lupa watermark-nya setiap restart adalah pipeline yang amnesia.",
      ],
      formula: String.raw`B_{baru} = \{ r \mid r.tanggal > w \} \qquad w_{baru} = \max(r.tanggal)`,
      formulaNote:
        "B_baru = himpunan baris yang diproses refresh ini: hanya baris dengan tanggal LEBIH BESAR dari watermark w (tanda > yang ketat mencegah duplikat). w_baru = tanggal maksimum dari batch — watermark maju ke titik terjauh yang berhasil. Contoh lab: w = 2026-10-13, batch berisi 2026-10-13 s.d. 2026-10-15 → B_baru = 4 baris (13 Okt dikecualikan), w_baru = 2026-10-15.",
      figure: {
        svg: BIZ25_TIMELINE_SVG,
        alt: "Garis waktu refresh: watermark maju setiap hari, alert muncul 14 Oktober.",
        caption: "Watermark maju 13 → 15 Okt; 14 Okt memicu alert. Refresh ulang batch yang sama: 0 baris — idempoten.",
      },
      tasks: [],
      reference: "Baru = tanggal > watermark (ketat). Simpan watermark di tabel kontrol.",
    },
    {
      id: "alerting",
      eyebrow: "Langkah 5 · Alerting",
      title: "Alert yang berteriak — tetapi tidak berisik",
      prose: [
        "Alert yang buruk ada dua jenis: yang DIAM saat harusnya berteriak (kasus Pak Hendra), dan yang BERTERIAK terus sampai tidak ada yang mendengar (alert fatigue). Keduanya sama berbahayanya.",
        "Tiga jenis alert yang sehat: (1) alert ANGKA — omzet harian < ambang (seperti lab: 1,2 jt < 1,5 jt); (2) alert PROSES — refresh gagal, 0 baris baru padahal biasanya 500, watermark tidak maju 2 hari; (3) alert KUALITAS — 30% baris ditolak validasi (pola medallion BI24). Yang paling sering dilupakan adalah nomor 2 — padahal itulah yang membunuh Pak Hendra.",
        "Aturan anti-berisik: ambang harus punya HYSTERESIS (pulih hanya setelah 2 periode normal berturut-turut, bukan sekali lewat ambang), alert dikelompokkan (satu pesan per insiden, bukan 40 pesan per baris), dan setiap alert punya PEMILIK + SLA (\u201Csiapa yang bangun jam 3 pagi, dan dalam berapa menit harus merespons?\u201D). Alert tanpa pemilik = pesan dalam botol.",
        "\uD83D\uDCA1 Intuisi kunci: uji alert-mu dengan pertanyaan \u201Ckapan terakhir alert ini menyelamatkan keputusan?\u201D Kalau jawabannya \u201Ctidak pernah, tapi sering bunyi\u201D — ambangmu salah, bukan dunianya.",
      ],
      tasks: [],
      note: {
        title: "\uD83D\uDEA8 Miskonsepsi: refresh sukses = data benar",
        type: "pitfall",
        body: "Status \u201Csukses\u201D hanya berarti job-nya selesai tanpa error — tidak berarti datanya benar, lengkap, atau segar. Refresh bisa \u201Csukses\u201D memproses 0 baris (sumber kosong), atau sukses menduplikasi data (watermark salah). Dasbor produksi butuh TIGA lampu, bukan satu: proses sukses? volume wajar? angka masuk akal? Satu lampu hijau dari tiga tidak cukup untuk terbit.",
      },
      reference: "Alert angka + alert proses + alert kualitas. Tiap alert punya pemilik + SLA.",
    },
    {
      id: "runbook",
      eyebrow: "Langkah 6 · Runbook",
      title: "Runbook refresh gagal: apa yang dilihat pengguna saat data basi",
      prose: [
        "Ketika refresh gagal, ada dua pilihan tampilan: (A) dasbor tetap menampilkan data lama TANPA keterangan — inilah yang menipu Pak Hendra; (B) banner jujur: \u201CData terakhir 14 Okt 06:00 — refresh 15 Okt gagal, tim data sudah dihubungi (SLA 2 jam)\u201D. Pilihan B terasa memalukan; pilihan A terasa profesional. Yang benar adalah B — selalu.",
        "Runbook minimal (satu halaman, ditempel di wiki tim): (1) siapa yang dihubungi pertama + SLA respons; (2) 3 penyebab paling umum (kredensial kedaluwarsa, sumber berubah skema, kuota API habis) + cara cek 5 menit tiap penyebab; (3) kapan boleh menampilkan data basi (dengan banner) vs kapan dasbor harus dikunci; (4) post-mortem 30 menit setelah insiden: apa yang dicegah agar tidak terulang.",
        "Biaya keheningan — hitungan untuk meyakinkan manajemen: 3 hari data basi × 1 keputusan salah (promo Rp200 jt untuk stok kosong) = Rp200 jt + kepercayaan direksi. Biaya pencegahannya: 1 jam menulis runbook + 1 alert proses. Rasio ini yang kamu bawa ke rapat budget.",
      ],
      tasks: [],
      note: {
        title: "\uD83D\uDEA8 Miskonsepsi: menampilkan data basi tanpa keterangan itu “lebih baik daripada kosong”",
        type: "pitfall",
        body: "Dasbor kosong membuat orang bertanya; dasbor basi membuat orang PERCAYA. Kepercayaan yang salah adalah bahan bakar keputusan yang salah. Aturannya: data basi BOLEH tampil hanya dengan banner yang tidak bisa dilewatkan — tanggal refresh terakhir, penyebab, dan ETA perbaikan. Kalau tidak bisa jujur soal kebasian, lebih baik kunci dasbornya.",
      },
      reference: "Gagal harus terlihat: banner tanggal + penyebab + ETA. Post-mortem tiap insiden.",
    },
    {
      id: "lab-refresh",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: refresh inkremental yang idempoten + alert",
      prose: [
        "Database penjualan sudah berisi data s.d. 13 Okt; watermark = 2026-10-13. Batch baru datang (5 baris, termasuk 1 baris 13 Okt yang duplikat). Tugasmu: (t1) saring `baru` (tanggal > watermark — ketat!), masukkan ke tabel, majukan watermark ke tanggal maksimum batch; (t2) hitung total harian dan isi `alerts` untuk hari dengan total < 1.500.000, lalu cetak.",
        "Perhatikan: baris 2026-10-13 SBY di batch adalah duplikat dari yang sudah ada — filter > yang ketat mengecualikannya. Inilah idempotency dalam praktik: refresh yang sama dijalankan ulang tidak akan pernah mendobel.",
        "Coba juga: setelah selesai, jalankan filter yang sama sekali lagi terhadap batch — berapa baris baru yang didapat? (Jawaban: 0.) Itulah bukti pipeline-mu amnesia-proof.",
      ],
      tasks: [
        { id: "t1", text: "Saring `baru`, INSERT, majukan `watermark`" },
        { id: "t2", text: "Hitung total harian → `alerts` (tanggal, total) di bawah AMBANG" },
      ],
      expected: "baris baru: 4\nwatermark: 2026-10-15\nALERT 2026-10-14: omzet 1200000 di bawah ambang 1500000",
      note: {
        title: "Sering salah",
        body: "Memakai >= alih-alih > pada filter watermark — akibatnya baris 2026-10-13 SBY masuk dua kali dan total 13 Okt menjadi 3.500.000. Tanda > yang ketat bukan gaya penulisan — ia adalah seluruh jaminan idempotency. Satu karakter membedakan pipeline yang aman dengan yang mendobel data.",
      },
      hints: [
        "baru = [r for r in batch if r[0] > watermark]; lalu cur.executemany INSERT.",
        "watermark = max(r[0] for r in batch) — tanggal maksimum batch, bukan hari ini.",
        "SELECT tanggal, SUM(omzet) ... GROUP BY tanggal; alert bila total < AMBANG; int() untuk tampilan.",
      ],
      code: {
        starter: `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE penjualan (tanggal TEXT, cabang TEXT, omzet REAL)")
# Data sampai 13 Okt sudah ada (JANGAN UBAH)
seed = [
    ("2026-10-12", "JKT", 1500000), ("2026-10-12", "SBY", 900000),
    ("2026-10-13", "JKT", 1600000), ("2026-10-13", "SBY", 950000),
]
cur.executemany("INSERT INTO penjualan VALUES (?,?,?)", seed)
# Batch baru dari sumber (JANGAN UBAH)
batch = [
    ("2026-10-13", "SBY", 950000),
    ("2026-10-14", "JKT", 1000000),
    ("2026-10-14", "SBY", 200000),
    ("2026-10-15", "JKT", 1550000),
    ("2026-10-15", "SBY", 850000),
]
watermark = "2026-10-13"   # refresh terakhir yang berhasil
AMBANG = 1500000           # alert bila omzet harian < ini

# ── TULIS KODEMU di bawah garis ini ──
baru = []        # t1: baris yang lebih baru dari watermark
alerts = []      # t2: list (tanggal, total) di bawah ambang
print(f"baris baru: {len(baru)}")
print(f"watermark: {watermark}")
for tgl, tot in alerts:
    print(f"ALERT {tgl}: omzet {tot} di bawah ambang {AMBANG}")`,
        lockLines: 23,
        solution: `import sqlite3

con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE TABLE penjualan (tanggal TEXT, cabang TEXT, omzet REAL)")
# Data sampai 13 Okt sudah ada (JANGAN UBAH)
seed = [
    ("2026-10-12", "JKT", 1500000), ("2026-10-12", "SBY", 900000),
    ("2026-10-13", "JKT", 1600000), ("2026-10-13", "SBY", 950000),
]
cur.executemany("INSERT INTO penjualan VALUES (?,?,?)", seed)
# Batch baru dari sumber (JANGAN UBAH)
batch = [
    ("2026-10-13", "SBY", 950000),
    ("2026-10-14", "JKT", 1000000),
    ("2026-10-14", "SBY", 200000),
    ("2026-10-15", "JKT", 1550000),
    ("2026-10-15", "SBY", 850000),
]
watermark = "2026-10-13"   # refresh terakhir yang berhasil
AMBANG = 1500000           # alert bila omzet harian < ini

# ── TULIS KODEMU di bawah garis ini ──
baru = [r for r in batch if r[0] > watermark]
alerts = []
cur.executemany("INSERT INTO penjualan VALUES (?,?,?)", baru)
watermark = max(r[0] for r in batch)
for tgl, tot in cur.execute("SELECT tanggal, SUM(omzet) FROM penjualan GROUP BY tanggal ORDER BY tanggal"):
    if tot < AMBANG:
        alerts.append((tgl, int(tot)))
print(f"baris baru: {len(baru)}")
print(f"watermark: {watermark}")
for tgl, tot in alerts:
    print(f"ALERT {tgl}: omzet {tot} di bawah ambang {AMBANG}")`,
        checks: [
          { kind: "defined", task: "t1", name: "baru", label: "`baru` terdefinisi", msg: "Saring batch dengan tanggal > watermark." },
          { kind: "stdout_matches", task: "t1", pattern: "baris baru: 4", label: "4 baris baru", msg: "5 batch − 1 duplikat 13 Okt = 4 (filter > yang ketat)." },
          { kind: "equal", task: "t1", name: "watermark", value: "2026-10-15", label: "Watermark maju", msg: "watermark = tanggal maksimum batch." },
          { kind: "defined", task: "t2", name: "alerts", label: "`alerts` terdefinisi", msg: "Isi list (tanggal, total) di bawah ambang." },
          { kind: "stdout_matches", task: "t2", pattern: "ALERT 2026-10-14: omzet 1200000 di bawah ambang 1500000", label: "Alert 14 Okt", msg: "1.000.000 + 200.000 = 1.200.000 < 1.500.000." },
          { kind: "uses", task: "t1", token: "executemany", label: "INSERT batch", msg: "Masukkan baris baru dengan executemany." },
        ],
      },
      reference: "> ketat, bukan >=. Tiga lampu: proses sukses? volume wajar? angka masuk akal?",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: strategi refresh untuk tiap situasi",
      prose: [
        "Skenario 1 — Tabel 50 ribu baris, refresh 3 menit: → full refresh tiap pagi. Alasan: sederhana selalu menang bila murah.",
        "Skenario 2 — Tabel 80 juta baris, refresh 5 jam: → incremental + watermark + lookback 7 hari. Alasan: full refresh menghabiskan jendela malam.",
        "Skenario 3 — Sumber sering koreksi data lama (retur, faktur revisi): → incremental + lookback LEBIH PANJANG (14–30 hari) + alert \u201C% baris terkoreksi\u201D. Alasan: koreksi yang tidak sampai = dasbor berbohong pelan-pelan.",
        "Skenario 4 — Direksi butuh data maksimal basi 1 jam: → micro-batch tiap 30 menit + alert proses yang agresif. Alasan: jendela basi menentukan segalanya — desain dari SLA-nya, bukan dari nyamannya.",
        "Skenario 5 — Refresh gagal 2x berturut-turut: → kunci dasbor atau banner besar + eskalasi ke pemilik data (bukan hanya tim BI). Alasan: dua kegagalan = masalah sumber, bukan masalah jadwal.",
        "Aturan praktis 10 detik: tanya \u201Ckalau refresh ini gagal total malam ini, siapa yang tahu jam berapa, dan apa yang dilihat pengguna jam 7 pagi?\u201D Kalau jawabannya \u201Ctidak tahu\u201D — itulah pekerjaan rumahmu minggu ini.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: runbook satu halaman untuk PT Maju Bersama",
      prose: [
        "Konteks: setelah insiden Rp200 juta, kamu diminta menulis runbook. Fakta: refresh dasbor penjualan jalan tiap 06:00 (full refresh, 8 menit, 400 ribu baris); service account password kedaluwarsa tiap 90 hari; sumber ERP kadang berubah skema tanpa pemberitahuan; SLA direksi: data maksimal basi 4 jam.",
        "Pertanyaan: (1) rancang 3 alert proses + 2 alert angka + 1 alert kualitas untuk dasbor ini, masing-masing dengan pemilik dan SLA; (2) tulis teks banner yang muncul saat refresh gagal (maksimal 2 kalimat, tidak boleh ada jargon); (3) hitung: jika alert proses sudah ada sejak awal, berapa rupiah yang dihemat? Apa asumsi terlemah dalam hitunganmu?",
        "Pembahasan: (1) proses: \u201Cjob gagal\u201D → tim BI, SLA 30 mnt; \u201C0 baris baru\u201D → tim BI, SLA 1 jam; \u201Cwatermark tidak maju 1 hari\u201D → pemilik data ERP, SLA 4 jam. Angka: \u201Comzet harian < 1,5 jt\u201D → analis, SLA 2 jam; \u201Cselisih vs hari yang sama minggu lalu > 40%\u201D → analis. Kualitas: \u201C>10% baris ditolak validasi\u201D → data engineer. (2) \u201CData terakhir Jumat 06:00 — pembaruan Senin gagal, tim kami sedang memperbaikinya (perkiraan selesai 10:00). Mohon tidak memakai angka ini untuk keputusan promo.\u201D (3) hemat ≈ Rp200 jt (satu keputusan salah) − biaya ~0 (alert proses hampir gratis). Asumsi terlemah: bahwa direksi MEMBACA banner dan menunda keputusan — teknologi tidak bisa memaksa manusia berhenti; budaya \u201Ccek tanggal refresh dulu\u201D harus dibangun bersamaan.",
        "\uD83D\uDCA1 Intuisi kunci: runbook terbaik bukan yang paling tebal — melainkan yang dibaca. Satu halaman yang ditempel di wiki dan dilatih 15 menit mengalahkan 40 halaman yang tidak pernah dibuka.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan tentang report automation. Ingat: kegagalan yang berteriak lebih murah daripada kegagalan yang diam.",
      ],
      tasks: [],
      summary: [
        "Kecil & cepat → full refresh; besar → incremental + watermark + lookback.",
        "Baru = tanggal > watermark (ketat); idempoten = refresh ulang tidak mendobel.",
        "Tiga alert: angka, proses, kualitas — proses yang paling sering dilupakan.",
        "Refresh sukses ≠ data benar: butuh tiga lampu (proses, volume, angka).",
        "Data basi boleh tampil hanya dengan banner jujur; kalau tidak bisa jujur, kunci dasbornya.",
        "Runbook satu halaman yang dibaca > 40 halaman yang tidak dibuka; tiap alert punya pemilik + SLA.",
      ],
      next: {
        label: "BI26 — Statistik Terapan untuk Analis BI",
        href: "/learn/biz26-statistik-terapan-bi",
      },
      quiz: [
        {
          q: "Filter watermark memakai > yang ketat (bukan >=) karena…",
          options: [
            { text: "Agar kodenya lebih pendek", why: "Panjang kode tidak relevan." },
            { text: "Baris tepat di watermark sudah diproses — memakainya lagi berarti duplikat", why: "Tepat: inilah seluruh jaminan idempotency. Satu karakter membedakan aman vs dobel.", correct: true },
            { text: "Tanggal tidak bisa dibandingkan dengan >=", why: "String tanggal ISO bisa dibandingkan dengan operator apa pun." },
            { text: "Agar alert tidak terpicu", why: "Alert tidak ada hubungannya dengan operator filter." },
          ],
        },
        {
          q: "Tabel 80 juta baris, full refresh 5 jam tiap malam. Keputusan yang tepat?",
          options: [
            { text: "Tetap full refresh agar sederhana", why: "5 jam tiap malam memakan jendela dan budget — sederhana yang mahal." },
            { text: "Incremental + watermark + lookback 7 hari", why: "Tepat: efisien + tahan koreksi data lama + bisa dilanjutkan saat gagal.", correct: true },
            { text: "Berhenti me-refresh, pakai data kemarin selamanya", why: "Itu menyerah — dasbor menjadi brosur." },
            { text: "Refresh tiap jam secara full", why: "Memperparah masalah: 5 jam × 24 = tidak mungkin." },
          ],
        },
        {
          q: "Alert mana yang PALING mungkin mencegah insiden Pak Hendra?",
          options: [
            { text: "Alert omzet harian di bawah ambang", why: "Berguna, tetapi insiden ini bukan soal angka aneh." },
            { text: "Alert proses: refresh gagal / watermark tidak maju", why: "Tepat: masalahnya proses yang macet diam-diam. Alert angka tidak akan bunyi karena angkanya “stabil” (basi).", correct: true },
            { text: "Alert kualitas: baris ditolak validasi", why: "Tidak ada baris yang ditolak — job-nya tidak jalan sama sekali." },
            { text: "Alert email ke semua karyawan", why: "Broadcast tanpa pemilik = tidak ada yang bertindak." },
          ],
        },
        {
          q: "Refresh gagal total malam ini. Tindakan tampilan yang benar?",
          options: [
            { text: "Tampilkan data lama tanpa keterangan agar terlihat profesional", why: "Itulah yang menipu Pak Hendra — terlihat profesional, berakibat fatal." },
            { text: "Banner jujur: tanggal terakhir + penyebab + ETA, atau kunci dasbor", why: "Tepat: kejujuran soal kebasian > kesan profesional. Dasbor basi tanpa keterangan adalah jebakan.", correct: true },
            { text: "Sembunyikan dasbor dan berharap tidak ada yang sadar", why: "Menyembunyikan masalah ≠ menyelesaikan." },
            { text: "Isi manual dengan perkiraan agar tetap segar", why: "Itu dosa Riko versi lama — menebak dengan percaya diri." },
          ],
        },
        {
          q: "Sumber ERP sering merevisi faktur 2 minggu ke belakang. Apa yang harus ditambahkan ke incremental load?",
          options: [
            { text: "Watermark yang lebih besar", why: "Watermark bukan soal besar-kecil." },
            { text: "Jendela lookback: ambil ulang 14–30 hari terakhir tiap refresh", why: "Tepat: tanpa lookback, koreksi tidak pernah sampai ke dasbor dan dasbor berbohong pelan-pelan.", correct: true },
            { text: "Alert yang lebih sering", why: "Alert tidak memperbaiki data yang tidak diambil." },
            { text: "Full refresh tiap jam", why: "Tidak menyelesaikan koreksi historis secara efisien." },
          ],
        },
        {
          q: "Setiap alert yang baik wajib memiliki…",
          options: [
            { text: "Warna merah yang mencolok", why: "Warna tidak menggantikan akuntabilitas." },
            { text: "Pemilik yang jelas + SLA respons", why: "Tepat: alert tanpa pemilik = pesan dalam botol. Seseorang harus bangun dan bertindak.", correct: true },
            { text: "Dikirim ke grup chat terbesar", why: "Broadcast = difusi tanggung jawab." },
            { text: "Bunyi setiap 5 menit sampai diakui", why: "Itu resep alert fatigue." },
          ],
        },
      ],
    },
  ],
};
