import type { V2Lesson } from "../lib/types";

// Bar chart: bobot target vs aktual 5 aset — yang keluar band 2,5pp hanya ASII.
const DRIFT_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Diagram batang: bobot aktual vs target lima aset; hanya ASII yang keluar dari band 2,5 poin persentase.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="70" y1="30" x2="540" y2="30"/><line x1="70" y1="90" x2="540" y2="90"/><line x1="70" y1="150" x2="540" y2="150"/><line x1="70" y1="210" x2="540" y2="210"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="64" y="34">40%</text><text x="64" y="94">30%</text><text x="64" y="154">20%</text><text x="64" y="214">10%</text><text x="64" y="264">0%</text></g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<g><rect x="95" y="88" width="34" height="162" fill="var(--c1)" opacity="0.55"/><rect x="129" y="82" width="34" height="168" fill="var(--c1)"/><text x="129" y="268" fill="var(--chart-text)">BBCA</text></g>
<g><rect x="190" y="154" width="34" height="96" fill="var(--c2)" opacity="0.55"/><rect x="224" y="158" width="34" height="92" fill="var(--c2)"/><text x="224" y="268" fill="var(--chart-text)">TLKM</text></g>
<g><rect x="285" y="188" width="34" height="62" fill="var(--c3)" opacity="0.55"/><rect x="319" y="176" width="34" height="74" fill="var(--c3)"/><text x="319" y="268" fill="var(--chart-text)">ASII</text></g>
<g><rect x="380" y="222" width="34" height="28" fill="var(--c4)" opacity="0.55"/><rect x="414" y="228" width="34" height="22" fill="var(--c4)"/><text x="414" y="268" fill="var(--chart-text)">GOVT10Y</text></g>
<g><rect x="470" y="222" width="34" height="28" fill="var(--c5)" opacity="0.55"/><rect x="500" y="228" width="34" height="22" fill="var(--c5)"/><text x="500" y="268" fill="var(--chart-text)">EMAS</text></g>
</g>
<line x1="70" y1="250" x2="540" y2="250" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="70" y="52" width="12" height="12" fill="var(--c1)" opacity="0.55"/><text x="88" y="62" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">target</text>
<rect x="150" y="52" width="12" height="12" fill="var(--c1)"/><text x="168" y="62" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">aktual</text>
<line x1="300" y1="176" x2="352" y2="176" stroke="#e11d48" stroke-width="2" stroke-dasharray="5 4"/><text x="356" y="170" font-size="11" fill="#e11d48" font-family="var(--font-ui)">drift 3,0pp &gt; band 2,5pp</text>
</svg>`;

export const pmd11: V2Lesson = {
  slug: "pm-d11-tooling-vendor-vba",
  track: "Portfolio Management",
  module: "Kuantitatif Terapan",
  title: "D11 — Terminal & VBA: Mesin Harian Analis Portofolio",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-terminal",
      eyebrow: "Langkah 1 · Cerita",
      title: "Hari pertama Raka di manajer investasi",
      prose: [
        "Senin, 08:55. Raka — analis portofolio baru di sebuah manajer investasi Jakarta — duduk di meja yang sudah dilengkapi tiga layar. Di layar tengah: terminal data berbayar yang biaya langganannya lebih mahal dari gaji bulanannya. Di layar kanan: spreadsheet kosong. Manajernya menunjuk layar tengah: “Pagi ini cari tahu kenapa bobot ASII kita menyimpang.” Raka mengetik, mengklik, mengetik lagi. 20 menit kemudian ia punya angka. Manajernya mengangguk — lalu bertanya: “Oke. Sekarang buktikan angka itu BENAR.”",
        "Raka terdiam. Ia punya angka, tetapi tidak punya JEJAK: data dari feed mana? Harga penutupan atau harga rata-rata? Corporate action sudah disesuaikan belum? Ia mengulang pekerjaannya — kali ini mencatat setiap langkah. Butuh 45 menit. Manajernya tersenyum: “Terminal ini bukan kristal ball. Ia cuma mesin fotokopi yang sangat mahal — yang berharga adalah kemampuanmu membuktikan setiap angka yang keluar darinya.”",
        "Twist-nya: alat termahal di meja analis bukanlah sumber kebenaran — ia sumber DATA. Kebenaran lahir dari proses verifikasi di antara data dan keputusan. Lesson ini tentang dua mesin harian analis portofolio: terminal data vendor (Bloomberg/Eikon dan sejenisnya) sebagai gudang data, dan VBA sebagai tukang otomatisasi laporan — plus cara membuat keduanya bisa diaudit.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan tiga fungsi terminal vendor dalam workflow analis (data, screening, fungsi analitik) dan batasnya; (2) merancang alur ekspor terminal → spreadsheet → laporan yang bisa diaudit; (3) menulis pola VBA aman untuk otomasi reporting portofolio (loop, format, ekspor) dan mengenali tiga pola berbahaya; (4) menghitung bobot, drift, dan flag rebalancing dari data harga; (5) memutuskan kapan memakai terminal, kapan spreadsheet cukup, kapan membangun feed sendiri.",
        "Daftar isi: 1) Cerita Raka · 2) Modal dasar: rantai data-keputusan (ringkas) · 3) Anatomi terminal vendor · 4) VBA untuk reporting portofolio · 5) Lab: hitung bobot, drift & flag rebalance · 6) Chart drift · 7) Peta keputusan · 8) Mini-case: drift ASII · 9) Checkpoint.",
        "Metadata: ±60 menit · 1 lab Python · 1 chart · 6 kuis · 1 mini-case. Prasyarat: tidak ada — semua modal diringkas di Langkah 2.",
      ],
      tasks: [],
      reference: "Terminal = gudang data mahal. Nilaimu = jejak verifikasi di antaranya.",
    },
    {
      id: "modal-dasar",
      eyebrow: "Langkah 2 · Modal dasar (ringkas, self-contained)",
      title: "Rantai data → keputusan",
      prose: [
        "Fondasi — rantai data-keputusan analis portofolio. Setiap keputusan investasi mengalir lewat empat pos: (1) DATA mentah (harga, laporan keuangan, corporate action); (2) INFORMASI (data yang dibersihkan + konteks: harga disesuaikan corporate action, rasio yang terdefinisi); (3) ANALISIS (perbandingan vs target, valuasi, skenario); (4) KEPUTUSAN (beli/jual/tahan/rebalance, tercatat di IPS).",
        "Satu aturan mengikat keempatnya: AUDIT TRAIL. Setiap angka di laporan harus bisa ditelusuri mundur ke sumbernya — feed apa, tanggal unduh kapan, transformasi apa yang dilakukan. Angka tanpa jejak = opini, bukan analisis. Inilah alasan terminal vendor mahal: bukan karena datanya “lebih benar”, melainkan karena ia mencatat provenance (sumber, timestamp, metodologi penyesuaian) secara sistematis.",
        "Dengan fondasi ini lesson ini menjawab: apa yang dikerjakan terminal di pos 1–2, apa yang dikerjakan VBA di pos 2–3, dan bagaimana memastikan rantainya tidak putus di tengah.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: analis dibayar untuk jejaknya, bukan angkanya",
        body: "Dua analis bisa menghasilkan angka yang sama; yang satu bisa membuktikan tiap langkahnya dalam 5 menit, yang lain butuh sehari mengulang. Di institusi, yang pertama yang dipercaya mengelola uang orang lain.",
      },
      reference: "Data → informasi → analisis → keputusan. Audit trail mengikat semuanya.",
    },
    {
      id: "konsep-terminal",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Anatomi terminal vendor: tiga mesin dalam satu layar",
      prose: [
        "Definisi: terminal vendor (Bloomberg, LSEG Workspace/Eikon, dan sejenisnya) adalah layanan data keuangan berlangganan yang menggabungkan database historis, feed real-time, dan fungsi analitik dalam satu antarmuka. Ia menggantikan tiga pekerjaan manual: mengumpulkan data, membersihkannya (penyesuaian corporate action, kalender bursa), dan mendokumentasikan sumbernya.",
        "Kepribadiannya: terminal adalah ARSIPARIS yang terobsesi kerapian — setiap harga punya stempel tanggal, sumber, dan catatan penyesuaian. Ia tidak pernah “menebak”; kalau datanya tidak ada, ia bilang tidak ada. Justru karena itu analis pemula sering salah paham: mengira arsiparis ini juga PENASIHAT.",
        "Tiga kategori fungsi dalam workflow analis. Pertama, DATA: harga historis & real-time, data fundamental, komposisi indeks, kalender corporate action — bahan baku pos 1 rantai. Kedua, SCREENING: menyaring ribuan emiten berdasar kriteria (mis. kapitalisasi, dividend yield, momentum) — mempercepat shortlist, bukan menggantikan penilaian. Ketiga, FUNGSI ANALITIK SEDERHANA: kalkulasi valuasi standar, perbandingan peer, dan ekspor data — titik awal analisis, bukan kesimpulan.",
        "Batas yang harus dihafal: (1) terminal tidak tahu KONTEKS portofoliomu — ia tidak tahu target alokasimu, batasan mandatmu, atau profil pajak nasabahmu; (2) metodologi default-nya mungkin tidak cocok — mis. cara ia menghitung yield bisa berbeda dari definisi di IPS-mu; (3) biaya langganan membuatnya “terlalu mahal untuk dipakai asal” — setiap query sebaiknya menjawab pertanyaan yang sudah dirumuskan, bukan browsing.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “punya akses terminal = otomatis jadi analis hebat”",
        type: "pitfall",
        body: "Yang benar: terminal menaikkan KECEPATAN, bukan KUALITAS penilaian. Analis hebat dengan spreadsheet bisa mengalahkan analis biasa dengan terminal — karena keputusan lahir dari kerangka berpikir (langkah 2), bukan dari banyaknya layar. Terminal tanpa pertanyaan yang tajam = mesin fotokopi mahal.",
      },
      reference: "Terminal: data + screening + analitik awal. Konteks & keputusan tetap milikmu.",
    },
    {
      id: "konsep-vba",
      eyebrow: "Langkah 4 · Konsep inti",
      title: "VBA: tukang otomatisasi yang setia tapi ceroboh",
      prose: [
        "Definisi: VBA (Visual Basic for Applications) adalah bahasa makro di dalam Excel — ia bisa mengulang pekerjaan berulang: menarik data dari sheet, memformat laporan, mengekspor PDF, mengirim email ringkasan. Di banyak manajer investasi dan sekuritas, laporan harian portofolio masih berjalan di atas makro VBA yang ditulis bertahun-tahun lalu.",
        "Kepribadiannya: VBA adalah TUKANG yang rajin tapi tidak pernah bertanya. Ia menjalankan persis apa yang ditulis — termasuk kesalahannya. Makro yang “berhasil” 500 kali bisa gagal diam-diam pada run ke-501 karena satu baris data berubah format. Inilah pola bahaya nomor satu: SILENT FAILURE — laporan terlihat normal, angkanya salah.",
        "Tiga pola VBA yang aman untuk reporting portofolio. Pertama, LOOP TERBATAS: iterasi atas daftar holding yang dibaca dari sheet (bukan range hardcode seperti A2:A50), berhenti di baris kosong. Kedua, FORMAT TERPISAH DARI LOGIKA: satu modul menghitung, modul lain memformat — jangan campur rumus dan warna dalam satu prosedur raksasa. Ketiga, EKSPOR DENGAN STEMPEL: setiap laporan yang dihasilkan makro menyertakan tanggal data, sumber, dan versi makro di header — audit trail versi VBA.",
        "Tiga pola berbahaya yang wajib dikenali (kamu akan mewarisinya): (1) RANGE HARDCODE — makro pecah saat jumlah holding berubah; (2) TANPA VERSION CONTROL — “laporan_final_v7_FINAL.xlsm” di shared drive; (3) LOGIKA BISNIS DI DALAM MAKRO TANPA DOKUMENTASI — tidak ada yang tahu kenapa ada pengali 1,02 di baris 214. Aturan praktis: VBA boleh untuk otomasi alur, JANGAN untuk logika valuasi yang kompleks — logika kompleks milik sistem yang bisa diuji.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “VBA sudah ketinggalan zaman — tidak usah dipelajari”",
        type: "pitfall",
        body: "Yang benar: di industri, membaca VBA warisan adalah keterampilan bertahan hidup — laporan harian tempatmu bekerja mungkin berjalan di atasnya. Yang ketinggalan zaman adalah MENULIS sistem baru yang besar di VBA. Sikap tepat: bisa membaca & memperbaiki yang lama, membangun yang baru di perkakas yang bisa diuji (Python/SQL).",
      },
      reference: "VBA: otomasi alur boleh, logika kompleks jangan. Waspadai silent failure.",
    },
    {
      id: "lab-drift-rebalance",
      eyebrow: "Langkah 5 · Lab",
      title: "Dari data harga ke flag rebalance — tiru kerja terminal + VBA",
      prose: [
        "Lab ini meniru alur harian analis: data nilai pasar per aset (seolah hasil ekspor terminal) → hitung bobot → bandingkan dengan target (seperti yang dilakukan makro VBA) → flag aset yang melewati band. Tugasmu: lengkapi tiga perhitungan.",
        "Data: portofolio Rp100 juta, 5 aset, target [40%, 25%, 15%, 10%, 10%], band drift 2,5 poin persentase.",
        "Coba: ubah band menjadi 0.01 — berapa aset yang ter-flag? Band longgar = jarang rebalance = murah tapi berisiko drift; band ketat = disiplin tapi mahal. Inilah kurva U dari lesson D10, versi alur kerja.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `bobot` tiap aset: nilai / total" },
        { id: "t2", text: "Hitung `drift` = |bobot − target| dan `drift_max` beserta `aset_max`-nya" },
        { id: "t3", text: "Buat `flag` (drift > band) dan `n_flag`; cetak ringkasan persis format contoh" },
      ],
      expected: "Total portofolio: Rp100,000,000  Drift maksimum: 3.00% pada ASII  Aset melewati band 2.5%: 1 -> REBALANCE",
      code: {
        starter: `# Data seolah dari ekspor terminal (nilai pasar kini, Rp)
aset = ["BBCA", "TLKM", "ASII", "GOVT10Y", "EMAS"]
target = [0.40, 0.25, 0.15, 0.10, 0.10]
nilai = [42_000_000, 24_000_000, 18_000_000, 8_000_000, 8_000_000]
band = 0.025

# TULIS KODEMU
total =
bobot =
drift =
drift_max =
aset_max =
flag =
n_flag =

print(f"Total portofolio: Rp{total:,}")
print(f"Drift maksimum: {drift_max:.2%} pada {aset_max}")
print(f"Aset melewati band {band:.1%}: {n_flag} -> {'REBALANCE' if n_flag else 'TAHAN'}")`,
        lockLines: 6,
        solution: `# Data seolah dari ekspor terminal (nilai pasar kini, Rp)
aset = ["BBCA", "TLKM", "ASII", "GOVT10Y", "EMAS"]
target = [0.40, 0.25, 0.15, 0.10, 0.10]
nilai = [42_000_000, 24_000_000, 18_000_000, 8_000_000, 8_000_000]
band = 0.025

# TULIS KODEMU
total = sum(nilai)
bobot = [v / total for v in nilai]
drift = [abs(w - t) for w, t in zip(bobot, target)]
drift_max = max(drift)
aset_max = aset[drift.index(drift_max)]
flag = [d > band for d in drift]
n_flag = sum(flag)

print(f"Total portofolio: Rp{total:,}")
print(f"Drift maksimum: {drift_max:.2%} pada {aset_max}")
print(f"Aset melewati band {band:.1%}: {n_flag} -> {'REBALANCE' if n_flag else 'TAHAN'}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total", value: 100_000_000, tol: 1, label: "`total` = Rp100jt", msg: "Jumlah seluruh nilai pasar." },
          { kind: "equal", task: "t2", name: "drift_max", value: 0.03, tol: 0.005, label: "`drift_max` ≈ 3,0%", msg: "ASII: |18% − 15%| = 3pp — satu-satunya pelanggar band." },
          { kind: "equal", task: "t3", name: "n_flag", value: 1, tol: 0, label: "`n_flag` = 1", msg: "Hanya ASII yang drift-nya > 2,5pp." },
          { kind: "contains", task: "t3", name: "flag", label: "`flag` terdefinisi", msg: "Daftar True/False per aset, sejalan dengan bobot." },
          { kind: "stdout_matches", task: "t3", pattern: "Drift maksimum: 3\\.00% pada ASII", label: "`print` menampilkan drift maksimum", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Alur analis: ekspor → bobot → drift → flag. Makro VBA melakukan hal yang sama tiap pagi.",
    },
    {
      id: "chart-drift",
      eyebrow: "Langkah 6 · Konsep + chart",
      title: "Melihat drift sebelum ia menjadi masalah",
      prose: [
        "Chart di bawah memvisualkan hasil lab: batang muda = target, batang tua = aktual. Hanya ASII yang selisihnya melewati band 2,5pp (garis merah). Perhatikan: BBCA, GOVT10Y, dan EMAS juga menyimpang (2,0pp) tetapi BELUM terpicu — inilah gunanya band: mencegah over-trading atas noise kecil.",
        "Cara membaca chart: sumbu X = lima aset; tinggi batang = bobot portofolio (%); dua batang per aset = target (muda) vs aktual (tua); garis merah = batas band pada ASII.",
        "Interpretasi: drift 3,0pp pada ASII berarti porsi risiko ASII sudah 20% di atas jatahnya (3/15). Satu flag bukan krisis — tetapi tiga pagi berturut-turut tanpa tindakan = kegagalan proses, bukan kegagalan pasar.",
      ],
      figure: { svg: DRIFT_SVG, alt: "Diagram batang bobot target vs aktual lima aset; hanya ASII keluar band 2,5pp.", caption: "Drift per aset: target vs aktual. Hanya ASII yang melewati band." },
      tasks: [],
      reference: "Band = filter noise. Flag = pemicu tindakan, bukan vonis.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: terminal, spreadsheet, atau bangun sendiri?",
      prose: [
        "Skenario 1 — Butuh data historis bersih + jejak sumber untuk laporan ke direksi → TERMINAL. Alasan: provenance tercatat otomatis; mempertahankannya di pengadilan/regulator.",
        "Skenario 2 — Laporan harian rutin dengan format tetap, data dari sistem internal → VBA/otomasi spreadsheet. Alasan: murah, cepat, dan formatnya sudah dikenal semua orang.",
        "Skenario 3 — Logika valuasi kompleks / backtest / optimisasi → BANGUN SENDIRI (Python/SQL). Alasan: butuh version control, unit test, dan reproduksibilitas yang tidak bisa diberikan makro.",
        "Skenario 4 — Screening cepat “cari emiten dengan kriteria X” → TERMINAL (fungsi screening). Alasan: database-nya yang besar; jangan unduh 8.000 emiten ke Excel.",
        "Aturan praktis 10 detik: tanya dulu “apakah angka ini harus bisa saya buktikan setahun dari sekarang?” — kalau ya, pilih alat yang memberi jejak otomatis (terminal/sistem berversion-control), bukan yang mengandalkan ingatanmu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memilih alat termahal karena terlihat canggih, lalu memakai 5% fiturnya. Terminal mahal yang hanya dipakai unduh harga = Excel berbayar.",
      },
      reference: "Pilih alat berdasar kebutuhan jejak & kompleksitas, bukan gengsi.",
    },
    {
      id: "minicase-drift",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Pagi yang sibuk di dealing room",
      prose: [
        "Kasus: Pukul 08:40, 20 menit sebelum pasar buka. Laporan otomatis pagi ini menandai DUA aset melewati band: ASII (drift 3,0pp) dan TLKM (drift 2,6pp). Target dan band sama seperti lab. Kamu analis jaga pagi ini.",
        "Pertanyaan 1: Berapa nilai rupiah yang harus digeser agar kedua aset kembali TEPAT ke target? (Petunjuk: total portofolio Rp100jt; jual kelebihan ASII & TLKM, hasilnya dipakai menambah aset yang kurang bobot.)",
        "Pertanyaan 2: Makro pelaporan kemarin sempat error dan memakai data harga H-2. Apa yang kamu lakukan SEBELUM mengeksekusi rebalance?",
        "Pembahasan: (1) ASII kelebihan 3pp × Rp100jt = Rp3jt; TLKM kelebihan 1pp = Rp1jt — total Rp4jt dijual, dialokasikan ke aset yang defisit (BBCA −2pp, GOVT10Y −2pp, EMAS −2pp... perhatikan jumlah drift harus nol: +3+1−2−1+2−2 = 0 ✓). (2) JANGAN eksekusi dulu — verifikasi tanggal data (stempel feed), jalankan ulang makro dengan data benar, dan catat insidennya. Rebalance berdasar data basi = dua kesalahan sekaligus: salah angka DAN salah waktu.",
      ],
      tasks: [],
      reference: "Verifikasi data dulu, eksekusi kemudian. Selalu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran dari semua langkah — dari anatomi terminal hingga flag rebalance."],
      tasks: [],
      summary: [
        "Terminal vendor = data + screening + analitik awal; ia arsiparis yang rapi, bukan penasihat — konteks & keputusan tetap milik analis.",
        "VBA = otomasi alur yang setia tapi ceroboh: waspadai silent failure, range hardcode, dan logika tanpa dokumentasi.",
        "Alur kerja harian: ekspor → bobot → drift = |w − target| → flag bila > band → verifikasi → eksekusi.",
        "Pilih alat berdasar kebutuhan jejak & kompleksitas: terminal untuk data beraudit, spreadsheet untuk rutin sederhana, bangun sendiri untuk logika kompleks.",
      ],
      next: { label: "D12 — WMI & Kerangka POJK bagi Manajer Investasi", href: "/learn/pm-d12-wmi-regulasi-mi" },
      quiz: [
        {
          q: "Manajer meminta analis 'membuktikan angka itu benar'. Yang ia minta sebenarnya adalah…",
          options: [
            { text: "Angka yang lebih besar", why: "Salah: bukan soal besar-kecil, soal ketertelusuran." },
            { text: "Audit trail: sumber data, tanggal unduh, dan transformasi yang dilakukan", why: "Tepat: angka tanpa jejak = opini. Inilah nilai sesungguhnya analis institusional.", correct: true },
            { text: "Screenshot terminal", why: "Salah: screenshot bukan jejak yang bisa direproduksi." },
            { text: "Pendapat analis lain", why: "Salah: konsensus bukan bukti." },
          ],
        },
        {
          q: "Fungsi terminal yang PALING tepat untuk 'cari emiten dengan dividend yield > 5% dan DER < 1'?",
          options: [
            { text: "Screening — menyaring ribuan emiten berdasar kriteria", why: "Tepat: screening = shortlist cepat; penilaian tetap manual setelahnya.", correct: true },
            { text: "Fungsi analitik — langsung beli yang muncul", why: "Salah: hasil screening bukan rekomendasi beli." },
            { text: "Ekspor semua data ke Excel lalu filter manual", why: "Salah: membuang keunggulan database terminal." },
            { text: "Minta IT membuatkan feed sendiri", why: "Salah: mahal & lambat untuk kebutuhan ad-hoc." },
          ],
        },
        {
          q: "Makro VBA laporan harian memakai range hardcode A2:A50. Bulan ini holding bertambah jadi 63. Risiko terbesar?",
          options: [
            { text: "Laporan error dengan pesan jelas", why: "Salah: justru bahayanya ia TIDAK error — 13 holding terakhir diam-diam tidak terhitung (silent failure)." },
            { text: "13 holding terakhir tidak masuk perhitungan tanpa peringatan", why: "Tepat: silent failure — laporan terlihat normal tetapi angkanya salah.", correct: true },
            { text: "Excel crash", why: "Salah: makro tetap jalan, hanya tidak lengkap." },
            { text: "Data terduplikasi", why: "Salah: masalahnya data hilang, bukan ganda." },
          ],
        },
        {
          q: "Portofolio Rp200jt, target saham 60%, aktual 66%, band 5pp. Tindakan?",
          options: [
            { text: "Rebalance — jual Rp12jt saham hingga kembali 60%", why: "Tepat: drift 6pp > 5pp → jual 6% × Rp200jt = Rp12jt.", correct: true },
            { text: "Tahan — 66% masih wajar", why: "Salah: 'wajar' bukan aturannya; aturannya band 5pp." },
            { text: "Jual semua saham", why: "Salah: rebalance = kembalikan ke target, bukan likuidasi." },
            { text: "Ubah target jadi 66%", why: "Salah: mengubah target agar cocok dengan drift = drift berkedok kebijakan." },
          ],
        },
        {
          q: "Logika valuasi kompleks untuk produk baru sebaiknya dibangun di…",
          options: [
            { text: "VBA, karena semua orang bisa buka", why: "Salah: VBA sulit diuji & tanpa version control — bukan tempat logika kompleks." },
            { text: "Python/SQL dengan version control dan pengujian", why: "Tepat: logika kompleks butuh reproduksibilitas dan test.", correct: true },
            { text: "Terminal, dengan fungsi bawaannya", why: "Salah: terminal tidak tahu konteks & metodologi internmu." },
            { text: "Kepala analis — hafalkan saja", why: "Salah: bus factor = 1 adalah risiko operasional." },
          ],
        },
        {
          q: "Aturan 10 detik sebelum memilih alat analisis?",
          options: [
            { text: "Pilih yang paling mahal — pasti terbaik", why: "Salah: harga ≠ kecocokan." },
            { text: "Tanya: 'apakah angka ini harus bisa saya buktikan setahun dari sekarang?'", why: "Tepat: kebutuhan jejak menentukan alat — terminal/sistem berversion-control vs spreadsheet.", correct: true },
            { text: "Pilih yang paling familiar", why: "Salah: familiar ≠ tepat; bias kenyamanan." },
            { text: "Selalu bangun sendiri", why: "Salah: mahal & lambat untuk kebutuhan yang sudah terjawab terminal." },
          ],
        },
      ],
    },
  ],
};
