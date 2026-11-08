import type { V2Lesson } from "../lib/types";

// Diagram alur ekosistem pasar modal Indonesia.
const EKOSISTEM_SVG = `<svg viewBox='0 0 480 300' role='img' aria-label='Alur: investor ke sekuritas ke BEI ke KPEI ke KSEI, dengan OJK sebagai pengawas di atas.'>
<g font-family='var(--font-ui)' font-size='12' text-anchor='middle'>
<rect x='20' y='120' width='90' height='44' rx='8' fill='var(--c2)'/><text x='65' y='138' fill='white' font-weight='600'>Investor</text><text x='65' y='154' fill='white' font-size='10'>(kamu)</text>
<rect x='140' y='120' width='90' height='44' rx='8' fill='var(--c1)'/><text x='185' y='138' fill='white' font-weight='600'>Sekuritas</text><text x='185' y='154' fill='white' font-size='10'>Anggota Bursa</text>
<rect x='260' y='120' width='70' height='44' rx='8' fill='var(--c3)'/><text x='295' y='139' fill='white' font-weight='600'>BEI</text><text x='295' y='154' fill='white' font-size='10'>matching</text>
<rect x='360' y='60' width='100' height='44' rx='8' fill='var(--c4)'/><text x='410' y='78' fill='white' font-weight='600'>KPEI</text><text x='410' y='94' fill='white' font-size='10'>kliring</text>
<rect x='360' y='180' width='100' height='44' rx='8' fill='var(--c4)'/><text x='410' y='198' fill='white' font-weight='600'>KSEI</text><text x='410' y='214' fill='white' font-size='10'>settlement T+2</text>
<rect x='170' y='20' width='140' height='40' rx='8' fill='none' stroke='var(--c1)' stroke-width='2'/><text x='240' y='37' fill='var(--text)' font-weight='600'>OJK</text><text x='240' y='52' fill='var(--text-muted)' font-size='10'>regulator &amp; lisensi</text>
</g>
<g stroke='var(--text-muted)' stroke-width='1.6' fill='none' marker-end='url(#ah)'>
<defs><marker id='ah' markerWidth='8' markerHeight='8' refX='7' refY='4' orient='auto'><path d='M0,0 L8,4 L0,8 z' fill='var(--text-muted)'/></marker></defs>
<line x1='112' y1='142' x2='138' y2='142'/>
<line x1='232' y1='142' x2='258' y2='142'/>
<line x1='332' y1='135' x2='385' y2='95'/>
<line x1='332' y1='150' x2='358' y2='185'/>
<line x1='240' y1='60' x2='240' y2='112'/>
</g>
<g font-family='var(--font-ui)' font-size='11' fill='var(--text-muted)'>
<text x='118' y='132'>order</text><text x='238' y='132'>order</text>
<text x='336' y='108' font-size='10'>hasil match</text><text x='330' y='172' font-size='10'>netting</text>
<text x='248' y='90' font-size='10'>awasi</text>
</g>
<text x='20' y='280' font-size='11' fill='var(--text-muted)' font-family='var(--font-ui)'>Satu order beli melewati 5 institusi sebelum saham resmi menjadi milikmu (T+2).</text>
</svg>`;

export const e24: V2Lesson = {
  slug: "e24-wppe-pasar-modal",
  track: "Financial Markets",
  module: "Pasar Modal Indonesia",
  title: "E24. WPPE & Ekosistem Pasar Modal Indonesia",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-lisensi",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Gelar CFA yang tidak cukup",
      prose: [
        "Budi lulus CFA Level II — prestasi yang dirayakan seluruh tim kampusnya. Ia diterima sebagai analis di sebuah sekuritas Jakarta. Hari pertama, atasannya bertanya santai: “WPPE kamu sudah jalan?” Budi mengernyit. “Saya CFA Level II, Pak.” Atasannya tersenyum: “Bagus. Tapi tanpa izin WPPE, kamu tidak boleh menandatangani rekomendasi, tidak boleh mewakili perusahaan di depan nasabah, dan analisismu tidak boleh terbit atas nama sekuritas.”",
        "Twist-nya: kualifikasi global paling bergengsi di industri investasi pun tidak menggantikan lisensi lokal. Di Indonesia, otoritas memberikan izin kepada ORANG — bukan hanya perusahaan — untuk melakukan kegiatan tertentu di pasar modal. CFA membuktikan kamu pintar; WPPE membuktikan kamu boleh.",
        "Lesson ini: apa itu WPPE/WPEE/WMI, mengapa regulator mewajibkannya, bagaimana jalur memperolehnya, siapa saja pemain ekosistem pasar modal Indonesia, dan batas etika seorang pemegang lisensi.",
      ],
      tasks: [],
      note: {
        title: "Kilasan kilat prasyarat",
        body: "Pasar modal = tempat perusahaan menjual kepemilikan (saham) atau utang (obligasi) ke publik via Bursa Efek Indonesia (BEI). Perantara Pedagang Efek (sekuritas/broker) = perusahaan yang menjadi anggota bursa dan mengeksekusi order nasabah. Manajer Investasi = perusahaan yang mengelola dana (reksa dana). OJK = Otoritas Jasa Keuangan, regulatornya.",
      },
      reference: "CFA = kompetensi. WPPE = kewenangan. Di Indonesia kamu butuh keduanya untuk praktik.",
    },
    {
      id: "tiga-wakil",
      eyebrow: "Langkah 2 · Konsep",
      title: "WPPE, WPEE, WMI: tiga kunci tiga pintu",
      prose: [
        "WPPE (Wakil Perantara Pedagang Efek) = orang yang mewakili sekuritas dalam bertransaksi efek untuk nasabah: menerima order, mengeksekusi di bursa, memberi rekomendasi. Hampir semua pekerjaan “depan” di sekuritas — sales, dealer, analis riset yang rekomendasinya terbit — membutuhkan orang ber-WPPE di kursi itu.",
        "WPEE (Wakil Penjamin Emisi Efek) = orang yang mewakili perusahaan dalam penjaminan emisi (underwriting): membantu perusahaan IPO atau menerbitkan obligasi, menyusun prospektus, memasarkan ke investor. Ini dunianya investment banking — seperti di E21 — dan pintunya berbeda dari WPPE.",
        "WMI (Wakil Manajer Investasi) = orang yang mewakili manajer investasi dalam mengelola portofolio reksa dana: mengambil keputusan beli/jual di dalam dana. Tiga lisensi, tiga profesi — dan seseorang bisa memegang lebih dari satu, selama memenuhi syarat masing-masing.",
        "💡 Tips: logika regulator sederhana — semakin besar dampak keputusanmu terhadap uang orang lain, semakin ketat izinnya. Resepsionis sekuritas tidak butuh WPPE; orang yang menekan tombol “beli” atas nama nasabah butuh.",
        "Kenapa izin diberikan ke orang, bukan cuma ke perusahaan? Karena perusahaan bisa berganti nama, merger, atau tutup — tetapi rekam jejak individunya melekat. Lisensi bisa dibekukan atau dicabut bila pemegangnya melanggar: inilah “rem” yang membuat seorang analis berpikir dua kali sebelum menulis rekomendasi asal-asalan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Sekuritas tempat saya kerja sudah berizin OJK, jadi saya otomatis boleh.” Salah: izin perusahaan ≠ izin individu. Karyawan yang melakukan fungsi wakil tanpa lisensi = pelanggaran oleh perusahaan DAN orangnya. Saat interview, tanyakan siapa yang akan mensponsori lisensimu — itu pertanyaan profesional, bukan lancang.",
      },
      reference: "WPPE = broker/dealer & riset. WPEE = underwriting/IPO. WMI = kelola reksa dana. Izin melekat pada orang.",
    },
    {
      id: "jalur-lisensi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Jalur memperoleh lisensi: ujian, pengalaman, registrasi",
      prose: [
        "Secara konseptual jalurnya tiga tahap. Pertama, pendidikan dan ujian sertifikasi: calon wakil mengikuti program dan lulus ujian yang menguji pengetahuan pasar modal, regulasi, dan etika. Ujiannya bukan formalitas — tingkat kelulusannya menyaring yang benar-benar paham, bukan yang sekadar hadir.",
        "Kedua, pengalaman dan sponsor perusahaan: lisensi tidak bisa “dibeli perorangan lalu dibawa kabur” — kamu didaftarkan melalui perusahaan efek tempatmu bekerja, yang bertanggung jawab atas perilakumu. Pindah perusahaan = lisensimu didaftarkan ulang oleh sponsor baru.",
        "Ketiga, registrasi ke OJK dan pembinaan berkelanjutan: setelah terdaftar, kamu wajib menjaga kompetensi (pelatihan berkelanjutan) dan tunduk pada kode etik. Pelanggaran — misalnya memberi janji return pasti ke nasabah — bisa berujung pembekuan atau pencabutan.",
        "Detail teknis (materi ujian, biaya, jadwal) berubah dari waktu ke waktu dan diumumkan lewat kanal resmi OJK serta asosiasi profesi — jangan menghafal brosur tahun lalu sebagai kebenaran abadi. Yang tidak berubah: logikanya — buktikan pengetahuan, buktikan integritas, lalu dapatkan kewenangan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Lulus ujian = selesai selamanya.” Lisensi adalah SIM, bukan ijazah: ada masa berlaku, kewajiban pengembangan kompetensi, dan bisa dicabut. Analis yang berhenti belajar setelah lulus ujian adalah risiko bagi perusahaannya — dan bagi dirinya sendiri saat aturan berubah.",
      },
      reference: "Ujian → sponsor perusahaan → registrasi OJK → belajar terus. Detail teknis cek kanal resmi OJK (bisa berubah).",
    },
    {
      id: "ekosistem",
      eyebrow: "Langkah 4 · Konsep",
      title: "Lima institusi dalam satu order belimu",
      prose: [
        "Saat kamu menekan “beli” 5 lot BBCA di aplikasi sekuritas, ordermu melewati lima institusi. (1) Sekuritas (Anggota Bursa) meneruskan ordermu ke sistem perdagangan. (2) BEI mempertemukan (matching) order beli dan jual di sistem JATS — harga terbentuk di sini. (3) KPEI (Kliring Penjaminan Efek Indonesia) melakukan kliring: menghitung kewajiban bersih tiap anggota bursa (netting) dan MENJAMIN penyelesaian — bila satu pihak gagal, KPEI yang menalangi.",
        "Lalu (4) KSEI (Kustodian Sentral Efek Indonesia) menyelesaikan: memindahkan efek ke rekening kustodianmu dan dana ke penjual — ini yang disebut settlement T+2 (dua hari bursa setelah transaksi). Dana mengendap di (5) RDN (Rekening Dana Nasabah) atas namamu di bank kustodian — bukan di rekening sekuritas. Di atas semuanya, OJK mengawasi dan memberi (atau mencabut) izin.",
        "Cara membaca diagram: panah kiri→kanan = aliran order/efek; kotak OJK di atas = pengawasan, bukan bagian aliran transaksi.",
        "Interpretasi: pasar modal bukan “aplikasi jual-beli” — ia adalah rantai penjaminan. Kamu berani beli dari orang asing karena KPEI menjamin pihak lawan dan KSEI memastikan efeknya benar-benar berpindah. Rantai inilah yang membuat “kepercayaan” menjadi infrastruktur.",
        "💡 Tips: T+2 artinya uang hasil jualanmu baru bisa ditarik dua hari bursa kemudian — tetapi biasanya sudah bisa dipakai untuk beli lagi (dana “available to trade”) lebih cepat. Pahami bedanya sebelum merencanakan arus kas.",
      ],
      figure: {
        svg: EKOSISTEM_SVG,
        alt: "Alur: investor ke sekuritas ke BEI ke KPEI ke KSEI, dengan OJK sebagai pengawas di atas.",
        caption: "Satu order, lima institusi: dari aplikasi di tanganmu hingga saham resmi milikmu.",
      },
      tasks: [],
      reference: "BEI = matching. KPEI = kliring + penjaminan. KSEI = settlement T+2. RDN = danamu, bukan dana sekuritas. OJK = wasit.",
    },
    {
      id: "lab-settlement",
      eyebrow: "Langkah 5 · Lab: lifecycle order",
      title: "Simulasi: dari order sampai settlement T+2",
      prose: [
        "Sekarang jalankan sendiri lifecycle-nya. Data: tiga order pada Senin, 19 Oktober 2026 (5 lot BBCA @Rp9.850 beli; 10 lot TLKM @Rp3.420 jual; 2 lot ASII @Rp5.125 beli; 1 lot = 100 saham). Ada satu hari libur bursa: Selasa, 20 Oktober 2026.",
        "Pemetaan ke dunia nyata: `nilai = lot × 100 × harga` ≡ nilai transaksi yang diteruskan sekuritas ke BEI; loop T+2 dengan daftar libur ≡ kalender KSEI; pemetaan tahap→institusi ≡ siapa yang bertanggung jawab bila sesuatu macet di tiap tahap.",
        "Tugasmu: (1) hitung total nilai transaksi; (2) tentukan tanggal settlement T+2 dengan melewati akhir pekan dan hari libur; (3) petakan tiap tahap ke institusinya dan cetak rantai tanggung jawabnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total_nilai` (Rp) dari ketiga order" },
        { id: "t2", text: "Hitung `tgl_settle` (T+2 hari bursa dari 2026-10-19, lewati 2026-10-20 yang libur) dan `tgl_settle_str` (format ISO)" },
        { id: "t3", text: "Cetak rantai `rantai` = tahap→institusi untuk matching, kliring, settlement" },
      ],
      expected: "total=9370000  settle=2026-10-22  rantai=BEI-KPEI-KSEI",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“T+2 = dua hari kalender.” Bukan: T+2 = dua HARI BURSA. Order Senin dengan libur di Selasa → settlement Kamis, bukan Rabu. Kesalahan ini membuat analis salah menjadwalkan penarikan dana nasabah — memalukan dan bisa jadi temuan audit.",
      },
      hints: [
        "total_nilai = sum(lot*100*harga for ...).",
        "Mulai dari 2026-10-19, tambah 1 hari demi 1 hari; hitung hanya hari Senin–Jumat yang tidak ada di daftar libur, sampai 2 hari terkumpul.",
        "rantai = f\"{m}-{k}-{s}\" dengan m, k, s = BEI, KPEI, KSEI.",
      ],
      code: {
        starter: `from datetime import date, timedelta
# INPUT: order (saham, lot, harga, arah) pada 2026-10-19
order = [("BBCA", 5, 9850, "beli"), ("TLKM", 10, 3420, "jual"), ("ASII", 2, 5125, "beli")]
tgl_transaksi = date(2026, 10, 19)   # Senin
libur = {date(2026, 10, 20)}          # Selasa libur bursa

# TULIS KODEMU
total_nilai =

# TULIS KODEMU: T+2 hari bursa
tgl_settle = tgl_transaksi
terhitung = 0
tgl_settle_str =

# TULIS KODEMU: rantai tanggung jawab
m, k, s = "BEI", "KPEI", "KSEI"
rantai =

print(f"total={total_nilai}  settle={tgl_settle.isoformat()}  rantai={rantai}")`,
        lockLines: 6,
        solution: `from datetime import date, timedelta
# INPUT: order (saham, lot, harga, arah) pada 2026-10-19
order = [("BBCA", 5, 9850, "beli"), ("TLKM", 10, 3420, "jual"), ("ASII", 2, 5125, "beli")]
tgl_transaksi = date(2026, 10, 19)   # Senin
libur = {date(2026, 10, 20)}          # Selasa libur bursa

# TULIS KODEMU
total_nilai = sum(lot * 100 * harga for _, lot, harga, _ in order)

# TULIS KODEMU: T+2 hari bursa
tgl_settle = tgl_transaksi
terhitung = 0
while terhitung < 2:
    tgl_settle += timedelta(days=1)
    if tgl_settle.weekday() < 5 and tgl_settle not in libur:
        terhitung += 1
tgl_settle_str = tgl_settle.isoformat()

# TULIS KODEMU: rantai tanggung jawab
m, k, s = "BEI", "KPEI", "KSEI"
rantai = f"{m}-{k}-{s}"

print(f"total={total_nilai}  settle={tgl_settle.isoformat()}  rantai={rantai}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total_nilai", value: 9370000, tol: 0, label: "`total_nilai` = Rp9.370.000", msg: "5×100×9850 + 10×100×3420 + 2×100×5125." },
          { kind: "equal", task: "t2", name: "tgl_settle_str", value: "2026-10-22", tol: 0, label: "`tgl_settle_str` = 2026-10-22", msg: "Senin→(Selasa libur dilewati)→Rabu(1)→Kamis(2)." },
          { kind: "stdout_matches", task: "t3", pattern: "total=9370000\\s+settle=2026-10-22\\s+rantai=BEI-KPEI-KSEI", label: "`print` sesuai format", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "T+2 = hari bursa, bukan kalender. Rantai: BEI (match) → KPEI (kliring) → KSEI (settle).",
    },
    {
      id: "etika-wakil",
      eyebrow: "Langkah 6 · Konsep",
      title: "Etika dan batas kewenangan: lisensi adalah amanah",
      prose: [
        "Lisensi memberimu kewenangan — dan kewenangan punya pagar. Pagar pertama: larangan menjanjikan return. Kalimat “dijamin naik 20%” bukan sekadar salah secara analisis, melainkan pelanggaran etika profesi: kamu menjual kepastian yang tidak kamu miliki, atas uang orang lain.",
        "Pagar kedua: amanat terbatas. Nasabah memberimu kuasa untuk mengeksekusi strateginya, bukan untuk “mengelola seenaknya” atau memakai dananya untuk kepentingan lain. Dana nasabah di RDN — bukan di rekening perusahaan — adalah pagar struktural untuk hal ini; pelanggaran atasnya adalah ranah pidana, bukan sekadar etik.",
        "Pagar ketiga: benturan kepentingan dan kerahasiaan. Analis yang menulis “BELI” sambil perusahaannya melepas posisi (atau sebaliknya) tanpa pengungkapan = melanggar. Order besar nasabah = informasi rahasia, bukan bahan obrolan grup.",
        "Inilah alasan lisensi melekat pada orang: saat pagar dilanggar, yang dicabut adalah izin individunya — kariernya. Perusahaan bisa merekrut pengganti; reputasi pribadimu tidak bisa di-rekrut ulang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Etika = urusan compliance, bukan analis.” Justru analis paling sering diuji: tekanan target penjualan vs kejujuran rekomendasi, godaan “sedikit melebih-lebihkan” agar note dibaca. Lisensi membuat integritasmu tercatat — sekali tercoreng, seluruh industri tahu.",
      },
      reference: "Tiga pagar: tanpa janji return, amanat terbatas (RDN), tanpa benturan kepentingan. Pelanggaran = lisensi dicabut.",
    },
    {
      id: "peta-lisensi",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Lisensi apa untuk karier apa",
      prose: [
        "Skenario 1 — Mau jadi analis riset yang rekomendasinya terbit atas nama sekuritas: kejar WPPE. Alasan: fungsi “memberi rekomendasi mewakili perusahaan efek” adalah definisi pekerjaan wakil perantara.",
        "Skenario 2 — Mau jadi sales/marketing sekuritas yang menerima order nasabah: WPPE juga. Alasan: menerima dan meneruskan order = fungsi perantara, sama wajibnya.",
        "Skenario 3 — Mau ke investment banking (IPO, rights issue, obligasi korporasi): kejar WPEE. Alasan: penjaminan emisi adalah pintu berbeda dengan orang dan ujian yang berbeda.",
        "Skenario 4 — Mau jadi fund manager / analis di manajer investasi: kejar WMI. Alasan: keputusan beli/jual di dalam reksa dana adalah fungsi wakil manajer investasi.",
        "Skenario 5 — Back office, IT, atau riset internal yang tidak berhadapan dengan nasabah/transaksi: lisensi tidak wajib, tetapi menjadi nilai plus. Alasan: memahami pagar regulasi membuatmu tidak accidentally melanggar saat naik jabatan.",
        "Aturan praktis 10 detik: tanyakan “apakah pekerjaanku menyentuh uang nasabah atau keputusan investasi atas nama perusahaan?” Ya → cari tahu lisensi pintunya sebelum tanda tangan kontrak.",
      ],
      tasks: [],
      reference: "Riset & sales sekuritas = WPPE. IB/underwriting = WPEE. Fund manager = WMI. Sentuh uang nasabah = butuh lisensi.",
    },
    {
      id: "minicase-tanpa-lisensi",
      eyebrow: "Langkah 8 · Mini-case",
      title: "“Analis” tanpa lisensi yang viral",
      prose: [
        "PT Dana Pialang merekrut Dito sebagai “analis pasar” tanpa mensponsori lisensinya (“nanti saja kalau sudah ramai”). Dito rajin membuat konten: setiap pagi ia mengunggah “rekomendasi saham hari ini” atas nama perusahaan, lengkap dengan target harga. Akunnya viral — 200 ribu pengikut dalam 3 bulan. Lalu OJK memanggil.",
        "Pertanyaan 1: siapa yang melanggar — Dito, perusahaan, atau keduanya? Pertanyaan 2: apa bedanya bila Dito mengunggah opini pribadi tanpa mencatut nama perusahaan? Pertanyaan 3: apa yang seharusnya dilakukan perusahaan sejak hari pertama?",
        "Pembahasan: (1) Keduanya. Dito melakukan fungsi wakil (rekomendasi mewakili perusahaan efek) tanpa izin; perusahaan membiarkan fungsi berizin dijalankan orang tak berizin. (2) Opini pribadi tanpa atribut perusahaan memasuki wilayah abu-abu influencer — tetap berisiko bila menyesatkan publik, tetapi pelanggaran “fungsi wakil tanpa lisensi” spesifik pada atribut perusahaan. (3) Daftarkan Dito ke jalur WPPE sejak awal, atau batasi perannya hingga lisensi terbit — “nanti saja” bukan strategi kepatuhan.",
        "Pelajaran mini-case: di pasar modal, kredibilitas tanpa kewenangan = pelanggaran. Viral tidak menyembuhkan.",
      ],
      tasks: [],
      reference: "Fungsi wakil tanpa lisensi = pelanggaran orang + perusahaan. Atribut perusahaan adalah pemicunya.",
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
        "WPPE = mewakili sekuritas (broker, sales, analis riset). WPEE = penjaminan emisi/IPO. WMI = mengelola reksa dana.",
        "Lisensi melekat pada ORANG: izin perusahaan tidak otomatis mengizinkan karyawannya.",
        "Jalur konseptual: ujian sertifikasi → sponsor perusahaan → registrasi OJK → pembinaan berkelanjutan.",
        "Rantai satu order: Sekuritas → BEI (matching) → KPEI (kliring + penjaminan) → KSEI (settlement T+2) → RDN; OJK mengawasi.",
        "T+2 = dua HARI BURSA, bukan kalender — lewati akhir pekan dan hari libur.",
        "Tiga pagar etika: tanpa janji return, amanat terbatas, tanpa benturan kepentingan — pelanggaran = lisensi dicabut.",
      ],
      quiz: [
        {
          q: "Budi CFA Level II tetapi belum punya WPPE. Apa yang TIDAK boleh ia lakukan?",
          options: [
            { text: "Menandatangani rekomendasi atas nama sekuritas", why: "Benar: itu fungsi wakil perantara — butuh WPPE. CFA membuktikan kompetensi, bukan kewenangan.", correct: true },
            { text: "Belajar analisis laporan keuangan di rumah", why: "Salah: belajar tidak butuh lisensi. Lisensi mengatur fungsi profesional, bukan pengetahuan." },
            { text: "Bekerja sebagai staf back office", why: "Salah: back office tidak menjalankan fungsi wakil — lisensi tidak wajib di sana." },
            { text: "Mengikuti ujian sertifikasi WPPE", why: "Salah: justru inilah yang harus ia lakukan — ujian terbuka untuk calon wakil." },
          ],
        },
        {
          q: "Order beli 5 lot BBCA @Rp9.850 dieksekusi Senin 19 Okt 2026, Selasa 20 Okt libur bursa. Kapan settlement-nya?",
          options: [
            { text: "Rabu, 21 Oktober 2026", why: "Salah: ini T+2 kalender. T+2 dihitung dalam hari bursa — Selasa yang libur tidak dihitung.", correct: false },
            { text: "Kamis, 22 Oktober 2026", why: "Benar: Senin→Rabu (1)→Kamis (2), melewati Selasa yang libur.", correct: true },
            { text: "Selasa, 20 Oktober 2026", why: "Salah: selain T+2 belum tercapai, hari itu justru libur bursa." },
            { text: "Jumat, 23 Oktober 2026", why: "Salah: kelebihan satu hari — T+2 dari Senin (dengan 1 libur) jatuh Kamis." },
          ],
        },
        {
          q: "Apa peran KPEI dalam rantai transaksi?",
          options: [
            { text: "Mempertemukan order beli dan jual", why: "Salah: itu BEI (matching di sistem perdagangan).", correct: false },
            { text: "Kliring (netting kewajiban) dan menjamin penyelesaian bila satu pihak gagal", why: "Benar: KPEI = Kliring Penjaminan — ia yang membuatmu berani bertransaksi dengan orang asing.", correct: true },
            { text: "Menyimpan efek dan memindahkan kepemilikan (settlement)", why: "Salah: itu KSEI (Kustodian Sentral).", correct: false },
            { text: "Memberi izin WPPE kepada analis", why: "Salah: itu OJK sebagai regulator.", correct: false },
          ],
        },
        {
          q: "Mengapa lisensi diberikan kepada orang, bukan hanya kepada perusahaan?",
          options: [
            { text: "Agar biayanya lebih mahal", why: "Salah: biaya bukan tujuannya — akuntabilitaslah tujuannya." },
            { text: "Karena rekam jejak individu melekat: lisensi bisa dibekukan/dicabut bila ia melanggar, di mana pun ia bekerja", why: "Benar: perusahaan bisa berganti nama atau tutup; rem perilaku harus mengikuti orangnya.", correct: true },
            { text: "Agar perusahaan tidak perlu berizin", why: "Salah: perusahaan tetap wajib berizin — keduanya, bukan salah satu." },
            { text: "Supaya analis bisa pindah tanpa prosedur", why: "Salah: pindah perusahaan justru butuh pendaftaran ulang oleh sponsor baru." },
          ],
        },
        {
          q: "Dito mengunggah “rekomendasi saham hari ini” atas nama sekuritas tanpa WPPE. Penilaian yang tepat?",
          options: [
            { text: "Tidak masalah selama rekomendasinya akurat", why: "Salah: akurasi tidak menyembuhkan pelanggaran kewenangan — fungsinya yang dilarang, bukan hasilnya." },
            { text: "Pelanggaran oleh Dito dan perusahaan: fungsi wakil tanpa lisensi", why: "Benar: Dito menjalankan fungsi berizin tanpa izin; perusahaan membiarkannya.", correct: true },
            { text: "Hanya perusahaan yang salah karena merekrutnya", why: "Salah: Dito ikut bertanggung jawab — lisensi melekat pada orang justru untuk ini." },
            { text: "Boleh selama ia tidak menerima order", why: "Salah: rekomendasi mewakili perusahaan efek sudah termasuk fungsi wakil, bukan hanya eksekusi order." },
          ],
        },
      ],
      next: { label: "E25 — Menulis Research Note & Investment Memo", href: "/v2/learn/e25-research-note" },
    },
  ],
};
