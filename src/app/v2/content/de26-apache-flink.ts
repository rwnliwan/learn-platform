import type { V2Lesson } from "../lib/types";

// Event time vs arrival: dua garis waktu untuk 10 event flash sale.
const TIME_SVG = `<svg viewBox="0 0 640 250" role="img" aria-label="Event time versus waktu kedatangan untuk 10 event, satu event terlambat.">
<g font-family="var(--font-ui)" font-size="10" text-anchor="middle">
<line x1="40" y1="70" x2="600" y2="70" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="40" y1="160" x2="600" y2="160" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="180" y1="55" x2="180" y2="200" stroke="var(--c3)" stroke-dasharray="5 4"/>
<line x1="400" y1="55" x2="400" y2="200" stroke="var(--c3)" stroke-dasharray="5 4"/>
<line x1="290" y1="145" x2="290" y2="200" stroke="var(--c1)" stroke-dasharray="5 4"/>
</g>
<g font-family="var(--font-ui)" font-size="11">
<text x="45" y="45" fill="var(--text)">event time (kapan terjadi)</text>
<text x="45" y="135" fill="var(--text)">waktu kedatangan (kapan tiba)</text>
<text x="180" y="215" fill="var(--chart-text)" text-anchor="middle">11:55</text>
<text x="400" y="215" fill="var(--chart-text)" text-anchor="middle">12:00</text>
<text x="290" y="228" fill="var(--c1)" text-anchor="middle">watermark: event time 9</text>
</g>
<g>
<circle cx="200" cy="70" r="7" fill="var(--c2)"/><circle cx="230" cy="70" r="7" fill="var(--c2)"/><circle cx="260" cy="70" r="7" fill="var(--c2)"/><circle cx="290" cy="70" r="7" fill="var(--c2)"/><circle cx="320" cy="70" r="7" fill="var(--c2)"/>
<circle cx="420" cy="70" r="7" fill="var(--c2)"/><circle cx="450" cy="70" r="7" fill="var(--c2)"/><circle cx="480" cy="70" r="7" fill="var(--c2)"/><circle cx="510" cy="70" r="7" fill="var(--c2)"/>
<circle cx="230" cy="70" r="7" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="200" cy="160" r="7" fill="var(--c2)"/><circle cx="230" cy="160" r="7" fill="var(--c2)"/><circle cx="290" cy="160" r="7" fill="var(--c2)"/><circle cx="260" cy="160" r="7" fill="var(--c2)"/><circle cx="420" cy="160" r="7" fill="var(--c2)"/>
<circle cx="450" cy="160" r="7" fill="var(--c2)"/><circle cx="350" cy="160" r="7" fill="var(--c2)"/><circle cx="480" cy="160" r="7" fill="var(--c2)"/><circle cx="560" cy="160" r="7" fill="var(--c2)"/>
<circle cx="500" cy="160" r="7" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
</g>
<g font-family="var(--font-ui)" font-size="10" fill="var(--chart-text)">
<text x="230" y="100">E10: event jam 11:56</text>
<text x="500" y="190">E10: tiba jam 12:04</text>
<text x="470" y="100">lingkaran merah = E10</text>
</g>
</svg>`;

// Window salah vs benar: processing time vs event time.
const WINDOW_SVG = `<svg viewBox="0 0 640 240" role="img" aria-label="Perbandingan agregasi window menurut waktu kedatangan versus event time.">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<text x="160" y="25" fill="var(--text)">menurut waktu kedatangan (salah)</text>
<text x="480" y="25" fill="var(--text)">menurut event time (benar)</text>
<rect x="60" y="200" width="60" height="12" fill="var(--c1)" fill-opacity="0.7"/>
<rect x="130" y="120" width="60" height="92" fill="var(--c1)" fill-opacity="0.7"/>
<rect x="200" y="185" width="60" height="27" fill="var(--c1)" fill-opacity="0.7"/>
<rect x="380" y="150" width="60" height="62" fill="var(--c2)" fill-opacity="0.7"/>
<rect x="450" y="90" width="60" height="122" fill="var(--c2)" fill-opacity="0.7"/>
</g>
<g font-family="var(--font-ui)" font-size="10" fill="var(--chart-text)" text-anchor="middle">
<text x="90" y="195">750</text><text x="160" y="112">1430</text><text x="230" y="178">500</text>
<text x="410" y="142">1000</text><text x="480" y="82">1500</text>
<text x="90" y="228">[11:55,12:00)</text><text x="160" y="228">[12:00,12:05)</text><text x="230" y="228">[12:05,12:10)</text>
<text x="410" y="228">[11:55,12:00)</text><text x="480" y="228">[12:00,12:05)</text>
</g>
<text x="320" y="30" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">total sama (Rp2.680 ribu), distribusi beda — keputusan beda</text>
</svg>`;

export const de26: V2Lesson = {
  slug: "de26-apache-flink",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE26 — Apache Flink: Stream Processing yang Stateful",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Setelah lesson ini, kamu bisa menjelaskan mengapa 'real-time' yang memakai jam yang salah menghasilkan keputusan yang salah — dan merancang stream processing yang memakai jam yang benar.",
        "(1) Membedakan event time dan processing time, serta menjelaskan kapan keduanya berbohong;",
        "(2) Merancang watermark dengan toleransi keterlambatan yang eksplisit dan bisa dipertanggungjawabkan;",
        "(3) Memilih jenis window (tumbling, sliding, session) untuk pola bisnis yang berbeda;",
        "(4) Menjelaskan state, checkpointing, dan exactly-once tanpa mantra — sebagai mekanisme yang bisa digambar;",
        "(5) Membedakan peran Kafka (transport) dan Flink (mesin) dalam arsitektur streaming.",
        "Alurnya: dashboard 12.12 yang salah membaca puncak → dua jam → watermark → window → state dan checkpoint → lab windowing → peta keputusan → mini-case Rp2,68 miliar.",
        "Estimasi 65 menit. Lab memakai Python murni — tanpa install, jalan di browser.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Puncak penjualan yang pindah jam",
      prose: [
        "Desember 2026. TokoRame menggelar flash sale 12.12. Dashboard GMV 'real-time' dibangun di atas Kafka + consumer micro-batch 5 menit: setiap 5 menit, jumlahkan transaksi yang TIBA di 5 menit itu. Sederhana, cepat, dan disukai direksi.",
        "Jam 12:07, dashboard menunjukkan puncak di window 12:00–12:05: Rp1,43 miliar. Tim marketing menyimpulkan promo yang dipasang tepat jam 12:00 'meledak' — anggaran iklan jam berikutnya digeser ke pola yang sama. Keputusan diambil dalam 20 menit, dengan percaya diri penuh.",
        "Twist-nya terungkap saat tim data mengaudit dengan event time — kapan transaksi BENAR-BENAR terjadi di kasir, bukan kapan pesannya tiba. Tiga gateway pembayaran di luar Jawa sempat retry karena jaringan, sehingga ratusan transaksi jam 11:55–12:00 baru tiba jam 12:04–12:06. Kebenarannya: window 11:55–12:00 = Rp1,0 miliar, window 12:00–12:05 = Rp1,5 miliar — dan 'ekor' Rp500 juta di window 12:05–12:10 murni artefak keterlambatan, bukan penjualan baru.",
        "Totalnya sama persis: Rp2,68 miliar di kedua dashboard. Yang berbeda hanya distribusinya per window — dan distribusi itulah yang dibaca manusia untuk mengambil keputusan. Dashboard 'real-time' itu cepat dalam kedatangan, tapi salah dalam kebenaran: ia menjawab 'kapan kami TAHU' seolah itu 'kapan TERJADI'. Anggaran iklan digeser berdasarkan puncak yang pindah jam.",
      ],
      tasks: [],
      reference: "Real-time yang memakai jam yang salah = cepat menuju kesimpulan yang salah. Bedakan 'kapan terjadi' dari 'kapan tiba'.",
    },
    {
      id: "dua-jam",
      eyebrow: "Langkah 3 · Dua jam",
      title: "Event time vs processing time: si jam dinding dan si jam tangan",
      prose: [
        "Setiap event punya dua jam. Event time = kapan sesuatu terjadi di dunia nyata (kasir menekan tombol bayar). Processing time = kapan sistem memprosesnya (pesan tiba di consumer). Panggil mereka Si Jam Dinding (waktu dunia, tidak bisa diubah) dan Si Jam Tangan (waktu sistem, selalu 'sekarang').",
        "Micro-batch TokoRame memakai Si Jam Tangan: mengelompokkan menurut waktu tiba. Masalahnya, waktu tiba adalah properti JARINGAN, bukan properti bisnis — retry, antrean, dan gateway yang lambat semuanya menggesernya. Bisnis bertanya 'penjualan jam berapa', bukan 'pesan tiba jam berapa'.",
        "Flink dibangun di atas Si Jam Dinding: semua window, agregasi, dan join memakai event time. Harganya: sistem harus menunggu event yang terlambat — dan di sinilah watermark masuk (langkah berikutnya).",
        "Cara membaca diagram: garis atas = kapan 10 event terjadi; garis bawah = kapan mereka tiba. E10 (lingkaran merah) terjadi jam 11:56 tapi tiba jam 12:04 — di garis bawah ia 'pindah' dua window ke kanan. Itulah seluruh masalah lesson ini dalam satu gambar.",
        "Interpretasi: keterlambatan bukan anomali — ia kondisi normal jaringan. Arsitektur yang mengasumsikan 'tiba = terjadi' akan salah tepat pada momen tersibuk, yaitu saat keputusan paling penting.",
      ],
      figure: {
        svg: TIME_SVG,
        alt: "Event time versus waktu kedatangan untuk 10 event, satu event terlambat.",
        caption: "Dua jam untuk tiap event. E10 terjadi jam 11:56 tetapi tiba jam 12:04 — pindah window bila memakai jam yang salah.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: micro-batch 5 menit 'cukup real-time' untuk semua kebutuhan",
        type: "pitfall",
        body: "Micro-batch menjawab 'apa yang tiba dalam 5 menit terakhir', bukan 'apa yang terjadi dalam 5 menit terakhir'. Untuk total harian, bedanya tidak terlihat. Untuk deteksi puncak, alokasi promo, dan alerting — bedanya adalah keputusan yang salah. Pilih semantik waktu dulu, baru pilih mesin.",
      },
      reference: "Event time = kebenaran bisnis. Processing time = kenyamanan sistem. Pilih sebelum membangun.",
    },
    {
      id: "watermark",
      eyebrow: "Langkah 4 · Watermark",
      title: "Watermark: si penjaga pintu yang sabar 2 menit",
      prose: [
        "Kalau memakai event time, kapan window boleh 'ditutup' dan hasilnya dikeluarkan? Menunggu selamanya = dashboard tidak pernah update. Menutup langsung = event terlambat hilang diam-diam. Watermark adalah komprominya: penanda 'sejauh ini, event time sudah maju sampai sini' — dan ia maju dengan aturan eksplisit.",
      ],
      formula: String.raw`W = \max(t_{event}) - L`,
      formulaNote: "W = watermark (batas event time yang dianggap selesai); max(t_event) = event time terbesar yang pernah terlihat; L = toleransi keterlambatan (allowed lateness). Event dengan t_event di bawah W dinyatakan terlambat. Contoh: event terbesar jam 12:01, L = 2 menit, maka W = 11:59 — event jam 11:56 yang tiba setelahnya = terlambat.",
      tasks: [],
      note: {
        title: "🚨 Mitos: event terlambat harus selalu dibuang",
        type: "pitfall",
        body: "Tergantung harganya. Untuk dashboard GMV, event terlambat 2 menit dibuang = selisih kecil yang bisa diterima. Untuk penagihan dan rekonsiliasi keuangan, setiap rupiah harus masuk — pakai side output: aliran khusus untuk event terlambat yang diproses terpisah (koreksi, bukan dibuang). Watermark memutuskan kapan; side output memutuskan ke mana.",
      },
      reference: "Watermark = jam tutup yang jujur. L = kontrak bisnis, bukan angka ajaib.",
    },
    {
      id: "windows",
      eyebrow: "Langkah 5 · Window",
      title: "Window: tiga cara memotong waktu",
      prose: [
        "Window adalah cara memotong aliran tak berujung menjadi potongan yang bisa dihitung. Tiga pola mencakup hampir semua kebutuhan. Tumbling (jatuh berderet): potongan 5 menit yang tidak tumpang tindih — [11:55,12:00), [12:00,12:05). Untuk metrik per periode: GMV per 5 menit. Sliding (geser): window 10 menit yang maju tiap 2 menit — tiap event masuk beberapa window. Untuk rata-rata bergerak dan deteksi tren. Session (berdasarkan jeda): window terbentuk dari aktivitas — dimulai saat event datang, ditutup setelah 30 menit sepi. Untuk sesi pengguna dan perjalanan pelanggan.",
        "Aturan memilihnya sederhana: tanya 'periode kalender, tren halus, atau perilaku?' Kalender = tumbling. Tren halus = sliding. Perilaku = session. Salah pilih window = menjawab pertanyaan yang tidak ditanya: rata-rata sliding dipakai untuk laporan keuangan per jam akan menghitung tiap transaksi berkali-kali.",
        "Semua window di Flink memakai event time + watermark: window [11:55,12:00) ditutup ketika watermark melewati 12:00. Inilah yang membuat hasil streaming bisa direkonsiliasi dengan batch harian — keduanya menghitung potongan waktu yang sama.",
        "💡 Intuisi: window adalah GROUP BY untuk waktu. Seperti GROUP BY yang salah kolom menghasilkan angka yang salah makna, window yang salah jenis menghasilkan cerita yang salah.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: sliding window 'lebih akurat' dari tumbling",
        type: "pitfall",
        body: "Sliding bukan versi akurat dari tumbling — ia menjawab pertanyaan berbeda (tren vs total periode). Memakai sliding untuk menjumlah omzet per jam = double counting: tiap transaksi dihitung di banyak window. Akurasi datang dari kecocokan dengan pertanyaan, bukan dari kerumitan window.",
      },
      reference: "Kalender = tumbling, tren = sliding, perilaku = session. Samakan window dengan pertanyaan.",
    },
    {
      id: "state-checkpoint",
      eyebrow: "Langkah 6 · State dan checkpoint",
      title: "State, checkpoint, dan exactly-once: ingatan yang tidak hilang",
      prose: [
        "Agregasi streaming butuh ingatan: jumlah window [11:55,12:00) yang 'sedang berjalan' harus disimpan di suatu tempat — itulah state. Tanpa state yang dikelola, restart aplikasi = angka mulai dari nol dan window setengah jalan hilang.",
        "Flink menyimpan state dengan checkpointing: secara berkala, seluruh state di-snapshot ke penyimpanan tahan lama (seperti save game). Saat worker mati, aplikasi di-restore dari checkpoint terakhir dan memutar ulang event setelahnya. Kepribadiannya: Si Penjaga Ingatan yang rajin menekan save.",
        "Exactly-once adalah janji yang sering disalahpahami: bukan 'event diproses tepat sekali secara fisik' (retry bisa mengirim dua kali), melainkan 'HASIL AKHIR seolah tepat sekali' — dicapai dengan checkpoint + sink yang idempoten atau transaksional. Kafka = jalan tol (transport, menyimpan urutan pesan). Flink = pabrik di tepi jalan tol (mesin, menyimpan state dan logika). Keduanya dibutuhkan; keduanya bukan pengganti satu sama lain.",
        "💡 Intuisi: kalau aplikasimu mati jam 12:03 dan tidak ada yang sadar sampai jam 12:20, exactly-once-lah yang membuat angka jam 12:20 tetap bisa dipercaya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: exactly-once berarti tidak ada duplikat di mana pun",
        type: "pitfall",
        body: "Duplikat bisa tetap terjadi di level transport (retry Kafka mengirim dua kali). Exactly-once Flink menjamin EFEKnya sekali — via state yang di-checkpoint dan sink yang idempoten (mis. upsert by key, bukan insert buta). Kalau sink-mu insert tanpa key, janji exactly-once gugur di pintu terakhir.",
      },
      reference: "Kafka mengantar pesan; Flink mengingat dan menghitung. Exactly-once = checkpoint + sink idempoten.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: windowing dengan watermark",
      prose: [
        "Waktunya membangun mesin mini ala Flink. Lab ini memproses 10 event flash sale TokoRame: tiap event punya event time dan arrival time (dalam menit sejak 11:50). Kamu akan mengimplementasikan tiga hal: watermark yang menandai event terlambat, agregasi window tumbling 5 menit menurut EVENT time, dan perbandingan dengan agregasi naif menurut waktu kedatangan.",
        "Perhatikan hasilnya: agregasi naif menunjukkan 'puncak' di window [12:00,12:05) plus 'ekor' Rp500 ribu di [12:05,12:10) — persis dashboard yang menyesatkan di cerita. Agregasi event time menunjukkan kebenaran: Rp1000 ribu dan Rp1500 ribu, dengan satu event terlambat yang ditangani eksplisit.",
        "Cara membaca output: tiap baris window menampilkan jumlah dalam ribu rupiah; baris terakhir mendaftar event yang dinyatakan terlambat oleh watermark.",
        "Interpretasi: total keduanya sama (Rp2680 ribu) — yang berbeda hanya distribusinya. Dan distribusi itulah yang dibaca manusia.",
      ],
      formula: String.raw`\text{terlambat} \iff t_{event} < \max(t_{event}) - L`,
      formulaNote: "Suatu event dinyatakan terlambat bila event time-nya di bawah watermark saat ia tiba; L = toleransi keterlambatan (di lab ini 2 menit). E10: t_event = 6, watermark saat tiba = 11, maka 6 < 11 = terlambat.",
      tasks: [
        { id: "t1", text: "Lengkapi `tandai_terlambat`: proses menurut waktu tiba, lacak watermark, pisahkan event tepat vs terlambat" },
        { id: "t2", text: "Lengkapi `agregasi`: jumlahkan amount per window tumbling menurut EVENT time" },
        { id: "t3", text: "Pastikan 3 baris print cocok dengan expected — termasuk perbandingan naif" },
      ],
      expected: "window [5,10): Rp1000 ribu\nwindow [10,15): Rp1500 ribu\nterlambat: ['E10'] -> dibuang (watermark sudah lewat)",
      note: {
        title: "Sering salah",
        body: "Mengurutkan atau mengelompokkan menurut waktu TIBA (kolom ketiga) padahal agregasi harus memakai EVENT time (kolom kedua). Itulah tepatnya bug TokoRame — jangan ulangi di lab ini.",
      },
      hints: [
        "tandai_terlambat: by_arrival = sorted(events, key=lambda e: e[2]); max_et = max(max_et, e[1]) tiap langkah; wm = max_et - LATENESS.",
        "Terlambat bila e[1] < wm — kembalikan dua list: tepat dan id terlambat.",
        "agregasi: w = window_of(e[1]); jumlahkan e[3] per w. Cetak dengan f\"window [{w},{w+5}): Rp{s} ribu\".",
      ],
      code: {
        starter: `# Flash sale 12.12: (id, event_time, arrival_time, amount Rp ribu)\n` +
`# waktu = menit sejak 11:50 ; window 5 menit ; toleransi keterlambatan 2 menit\n` +
`events = [\n` +
`    ("E01", 5, 5, 100), ("E02", 6, 6, 200), ("E03", 7, 9, 150),\n` +
`    ("E04", 8, 8, 300), ("E05", 9, 12, 250), ("E06", 10, 10, 400),\n` +
`    ("E07", 11, 11, 350), ("E08", 12, 16, 500), ("E09", 13, 13, 250),\n` +
`    ("E10", 6, 14, 180),\n` +
`]\n` +
`WINDOW = 5\n` +
`LATENESS = 2\n` +
`\n` +
`def window_of(t):\n` +
`    return (t // WINDOW) * WINDOW\n` +
`\n` +
`# TUGAS 1: pisahkan event tepat waktu vs terlambat (proses menurut waktu TIBA)\n` +
`def tandai_terlambat(evts):\n` +
`    return [], []\n` +
`\n` +
`# TUGAS 2: agregasi window tumbling menurut EVENT time (kolom kedua!)\n` +
`def agregasi(evts):\n` +
`    return {}\n` +
`\n` +
`tepat, terlambat = tandai_terlambat(events)\n` +
`sums = agregasi(tepat)\n` +
`for w in sorted(sums):\n` +
`    print(f"window [{w},{w+5}): Rp{sums[w]} ribu")\n` +
`print(f"terlambat: {terlambat} -> dibuang (watermark sudah lewat)")\n`,
        lockLines: 15,
        solution: `# Flash sale 12.12: (id, event_time, arrival_time, amount Rp ribu)\n# waktu = menit sejak 11:50 ; window 5 menit ; toleransi keterlambatan 2 menit\nevents = [\n    ("E01", 5, 5, 100), ("E02", 6, 6, 200), ("E03", 7, 9, 150),\n    ("E04", 8, 8, 300), ("E05", 9, 12, 250), ("E06", 10, 10, 400),\n    ("E07", 11, 11, 350), ("E08", 12, 16, 500), ("E09", 13, 13, 250),\n    ("E10", 6, 14, 180),\n]\nWINDOW = 5\nLATENESS = 2\n\ndef window_of(t):\n    return (t // WINDOW) * WINDOW\n\n# TUGAS 1: pisahkan event tepat waktu vs terlambat (proses menurut waktu TIBA)\ndef tandai_terlambat(evts):\n    by_arrival = sorted(evts, key=lambda e: e[2])\n    max_et = -1\n    tepat, telat = [], []\n    for e in by_arrival:\n        max_et = max(max_et, e[1])\n        wm = max_et - LATENESS\n        if e[1] < wm:\n            telat.append(e[0])\n        else:\n            tepat.append(e)\n    return tepat, telat\n\n# TUGAS 2: agregasi window tumbling menurut EVENT time (kolom kedua!)\ndef agregasi(evts):\n    hasil = {}\n    for e in evts:\n        w = window_of(e[1])\n        hasil[w] = hasil.get(w, 0) + e[3]\n    return hasil\n\ntepat, terlambat = tandai_terlambat(events)\nsums = agregasi(tepat)\nfor w in sorted(sums):\n    print(f"window [{w},{w+5}): Rp{sums[w]} ribu")\nprint(f"terlambat: {terlambat} -> dibuang (watermark sudah lewat)")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "tandai_terlambat", label: "fungsi `tandai_terlambat` terdefinisi", msg: "Definisikan tandai_terlambat(evts) yang mengembalikan (tepat, id_terlambat)." },
          { kind: "equal", task: "t1", name: "terlambat", value: ["E10"], label: "`terlambat` = ['E10']", msg: "Hanya E10 yang tiba setelah watermark melewatinya." },
          { kind: "defined", task: "t2", name: "agregasi", label: "fungsi `agregasi` terdefinisi", msg: "Definisikan agregasi(evts) yang mengembalikan dict window -> jumlah." },
          { kind: "stdout_matches", task: "t3", pattern: "window \\[5,10\\): Rp1000 ribu", label: "window pertama Rp1000 ribu", msg: "Baris agregasi window [5,10) harus mencetak Rp1000 ribu." },
          { kind: "stdout_matches", task: "t3", pattern: "window \\[10,15\\): Rp1500 ribu", label: "window kedua Rp1500 ribu", msg: "Baris agregasi window [10,15) harus mencetak Rp1500 ribu." },
          { kind: "stdout_matches", task: "t3", pattern: "terlambat: \\['E10'\\]", label: "`print` daftar terlambat", msg: "Baris terakhir harus mendaftar ['E10']." },
        ],
      },
      reference: "Event time untuk kebenaran, watermark untuk ketegasan, window untuk keterbacaan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: arsitektur streaming apa?",
      prose: [
        "Skenario 1 — Dashboard metrik per 5 menit, toleransi keterlambatan kecil, tim kecil. Keputusan: Kafka + Flink, tumbling window event time, watermark 2 menit, late ke side output. Alasan: pola paling standar, bisa direkonsiliasi dengan batch.",
        "Skenario 2 — Deteksi fraud kartu kredit: pola '3 transaksi beda kota dalam 10 menit'. Keputusan: Flink CEP (complex event processing) di atas event time. Alasan: urutan dan jarak waktu antar event adalah inti logikanya — micro-batch tidak bisa mengekspresikan 'diikuti dalam'.",
        "Skenario 3 — Menghitung total harian untuk laporan keuangan. Keputusan: batch harian biasa, bukan streaming. Alasan: tidak ada yang butuh angka jam 12:07 untuk laporan yang dibaca besok pagi — streaming di sini hanya menambah kerumitan.",
        "Skenario 4 — Join dua stream: klik iklan dan pembelian. Keputusan: interval join Flink dengan batas waktu (mis. pembelian dalam 30 menit setelah klik). Alasan: join stream-to-stream butuh state dua sisi + watermark dua sisi — jangan di-approximate dengan batch.",
        "Skenario 5 — Backfill 6 bulan data historis untuk model. Keputusan: Flink batch mode atau Spark — BUKAN replay ke cluster streaming. Alasan: replay historis lewat pipeline real-time mencemari metrik live dan watermark; pisahkan jalur.",
        "Aturan praktis 10 detik: tanya 'jam siapa yang dipakai, dan berapa lama kita mau menunggu yang terlambat?' Bila jawabannya tidak ada = belum siap streaming. Cara membaca diagram: kiri = agregasi menurut waktu tiba (puncak semu + ekor artefak); kanan = menurut event time (distribusi sebenarnya).",
        "Interpretasi: total sama, keputusan beda. Pilih semantik waktu sebelum memilih mesin — mesin tidak bisa memperbaiki jam yang salah.",
      ],
      figure: {
        svg: WINDOW_SVG,
        alt: "Perbandingan agregasi window menurut waktu kedatangan versus event time.",
        caption: "Waktu tiba vs event time: total sama (Rp2.680 ribu), distribusi beda, keputusan beda.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai Flink untuk semua yang 'ingin cepat', termasuk laporan harian. Streaming membayar pajak kerumitan (watermark, state, checkpoint) — bayar pajak itu hanya bila keputusannya benar-benar butuh angka dalam menit.",
      },
      reference: "Butuh menit = streaming. Butuh besok = batch. Butuh urutan antar event = CEP.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: Rp2,68 miliar dan anggaran iklan yang salah arah",
      prose: [
        "Kembali ke TokoRame. Flash sale 12.12: 10.240 transaksi, GMV Rp2,68 miliar dalam 20 menit. Dashboard micro-batch (processing time) melaporkan: [11:55,12:00) Rp750 juta, [12:00,12:05) Rp1,43 miliar, [12:05,12:10) Rp500 juta. Kesimpulan tim: 'promo jam 12:00 meledak' — Rp400 juta anggaran iklan minggu berikutnya digeser meniru 'pola jam 12:00'.",
        "Audit event time: [11:55,12:00) Rp1,0 miliar, [12:00,12:05) Rp1,5 miliar, dan Rp180 juta sisanya adalah 312 transaksi terlambat (retry gateway) yang tersebar di dua window pertama. Tidak ada 'ekor' penjualan jam 12:05 — yang ada ekor keterlambatan. Puncak sebenarnya terjadi bertahap sejak 11:55, bukan meledak jam 12:00.",
        "Pertanyaan analisis: (1) Berapa besar kesalahan alokasi bila 'pola jam 12:00' direplikasi — dan mengapa angka total yang 'benar' (Rp2,68 miliar) tidak menyelamatkan keputusan? (2) Rancang watermark: gateway terjauh punya retry hingga 4 menit — berapa L yang wajar, dan apa konsekuensi dashboard-nya? (3) Transaksi terlambat untuk penagihan (bukan dashboard) harus diperlakukan bagaimana?",
        "Pembahasan: (1) Rp400 juta dialokasikan meniru artefak — total yang benar tidak menolong karena keputusan dibaca dari DISTRIBUSI per window, bukan dari total. (2) L = 4–5 menit: dashboard final tertunda ~5 menit, tetapi angka per window stabil dan bisa direkonsiliasi; L lebih kecil = dashboard cepat tapi angka 'bergerak' saat koreksi masuk. (3) Untuk penagihan: jangan dibuang — kirim ke side output dan gabungkan saat rekonsiliasi; uang tidak mengenal watermark.",
      ],
      tasks: [],
      reference: "Keputusan dibaca dari distribusi, bukan dari total. Distribusi yang salah = keputusan yang salah.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam soal. Semua jawaban ada di lesson ini — yang diuji adalah pemahaman, bukan hafalan.",
      ],
      tasks: [],
      summary: [
        "Event time = kapan terjadi (kebenaran bisnis); processing time = kapan tiba (kenyamanan sistem). Streaming yang benar memakai event time.",
        "Watermark W = max(t_event) − L: jam tutup yang jujur; L adalah kontrak bisnis tentang keterlambatan yang bisa diterima.",
        "Tumbling untuk periode kalender, sliding untuk tren, session untuk perilaku — samakan window dengan pertanyaan.",
        "State + checkpoint = ingatan yang selamat dari restart; exactly-once = efek sekali via sink idempoten.",
        "Kafka = transport (jalan tol); Flink = mesin (pabrik). Micro-batch menjawab 'apa yang tiba', bukan 'apa yang terjadi'.",
      ],
      next: { label: "DE27 — Data Observability: Mengetahui Data Rusak Sebelum Dashboard Berteriak", href: "/v2/learn/de27-data-observability" },
      quiz: [
        {
          q: "Dashboard GMV 'real-time' memakai micro-batch menurut waktu tiba. Apa risiko terbesarnya?",
          options: [
            { text: "Total hariannya pasti salah", why: "Total harian biasanya tetap benar — yang rusak adalah distribusi per window.", },
            { text: "Distribusi per window bisa salah: puncak 'pindah jam' dan muncul ekor artefak dari event terlambat", why: "Tepat: waktu tiba adalah properti jaringan, bukan bisnis — retry menggeser event antar window dan menciptakan pola palsu.", correct: true },
            { text: "Kafka akan kehabisan storage", why: "Retention Kafka tidak ada hubungannya dengan semantik waktu agregasi.", },
            { text: "Latensinya pasti di atas 1 jam", why: "Micro-batch 5 menit justru cepat — masalahnya bukan kecepatan, melainkan kebenaran waktunya.", },
          ],
        },
        {
          q: "Watermark = max(t_event) − L. Apa arti L = 5 menit?",
          options: [
            { text: "Dashboard dijamin update tiap 5 menit", why: "Frekuensi update diatur trigger, bukan oleh L.", },
            { text: "Sistem menunggu hingga 5 menit keterlambatan sebelum menutup window — kontrak bisnis tentang keterlambatan yang diterima", why: "Tepat: L adalah janji eksplisit 'kami mentolerir keterlambatan sampai 5 menit'; event yang lebih lambat ditangani terpisah.", correct: true },
            { text: "Event yang terlambat 5 menit otomatis benar", why: "L tidak membuat event benar — ia hanya menentukan batas penutupan window.", },
            { text: "Window berukuran 5 menit", why: "Ukuran window dan L adalah dua parameter berbeda.", },
          ],
        },
        {
          q: "Untuk 'rata-rata GMV per jam yang bergerak halus', window yang tepat?",
          options: [
            { text: "Tumbling 1 jam", why: "Tumbling memberi total per jam kalender yang kaku — tidak 'bergerak halus'.", },
            { text: "Sliding: window 1 jam, maju tiap 10 menit", why: "Tepat: sliding menghasilkan deret rata-rata yang halus karena tiap titik memakai 1 jam data terakhir.", correct: true },
            { text: "Session 30 menit", why: "Session untuk perilaku pengguna, bukan untuk metrik kalender.", },
            { text: "Tanpa window, langsung jumlahkan", why: "Tanpa window tidak ada deret waktu sama sekali — hanya satu angka.", },
          ],
        },
        {
          q: "Worker Flink mati 10 menit lalu hidup lagi. Mengapa angka tetap bisa dipercaya?",
          options: [
            { text: "Karena Kafka menyimpan pesannya", why: "Kafka menyimpan pesan, tetapi agregasi setengah jalan (state) tidak ada di Kafka.", },
            { text: "Checkpoint: state di-snapshot berkala, restore dari snapshot terakhir + replay event setelahnya", why: "Tepat: checkpoint adalah 'save game'-nya streaming — ingatan selamat dari restart.", correct: true },
            { text: "Karena event time tidak berubah", why: "Event time membantu kebenaran, tetapi tidak mengembalikan state yang hilang.", },
            { text: "Flink tidak pernah mati", why: "Semua sistem bisa mati — arsitektur yang baik merencanakannya.", },
          ],
        },
        {
          q: "Tim ingin exactly-once ke tabel laporan. Selain checkpoint Flink, syarat yang tidak boleh lupa?",
          options: [
            { text: "Sink harus idempoten (mis. upsert by key), bukan insert buta", why: "Tepat: retry bisa mengirim dua kali di level transport — yang menjamin 'efek sekali' adalah sink yang aman diulang.", correct: true },
            { text: "Menambah jumlah worker dua kali lipat", why: "Worker lebih banyak = throughput, bukan kebenaran.", },
            { text: "Memakai window yang lebih kecil", why: "Ukuran window tidak memengaruhi semantik pengiriman.", },
            { text: "Mematikan checkpoint agar lebih cepat", why: "Mematikan checkpoint justru menghancurkan exactly-once — itu sumbernya.", },
          ],
        },
        {
          q: "Kapan sebaiknya TIDAK memakai streaming (pilih batch)?",
          options: [
            { text: "Saat datanya besar", why: "Streaming justru dirancang untuk data besar yang kontinu.", },
            { text: "Saat keputusannya dibaca besok pagi (laporan harian) — pajak kerumitan streaming tidak terbayar", why: "Tepat: watermark, state, dan checkpoint adalah biaya — bayar hanya bila keputusan butuh angka dalam hitungan menit.", correct: true },
            { text: "Saat memakai Kafka", why: "Kafka bisa di-consume batch juga — bukan alasan.", },
            { text: "Saat tim sudah bisa Flink", why: "Kemampuan tim bukan kriteria arsitektur — kebutuhan keputusanlah.", },
          ],
        },
      ],
    },
  ],
};
