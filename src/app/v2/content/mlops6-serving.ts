import type { V2Lesson } from "../lib/types";

// Kurva latensi vs utilisasi: datar lalu meledak setelah ~75% (knee antrean).
// Garis SLA 300ms; zona operasi aman di kiri knee.
const LATENCY_SVG = `<svg viewBox="0 0 480 210" role="img" aria-label="Kurva latensi p99 meledak setelah utilisasi 75 persen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="40" y1="170" x2="460" y2="170"/><line x1="40" y1="130" x2="460" y2="130"/><line x1="40" y1="90" x2="460" y2="90"/><line x1="40" y1="50" x2="460" y2="50"/><line x1="40" y1="10" x2="460" y2="10"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="34" y="174">0</text><text x="34" y="134">2 dtk</text><text x="34" y="94">4 dtk</text><text x="34" y="54">6 dtk</text><text x="34" y="14">8 dtk</text></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle"><text x="40" y="188">0%</text><text x="145" y="188">25%</text><text x="250" y="188">50%</text><text x="355" y="188">75%</text><text x="450" y="188">100% utilisasi</text></g>
<line x1="40" y1="158" x2="460" y2="158" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="452" y="152" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">SLA p99 300ms</text>
<path d="M 40 168 C 150 166, 250 162, 330 140 C 390 118, 420 70, 455 20" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="355" cy="128" r="5" fill="var(--c4)"/>
<text x="355" y="112" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">knee ~75%</text>
<text x="120" y="60" font-size="11" fill="var(--c1)" font-family="var(--font-ui)" font-weight="600">zona aman: antrean pendek</text>
<text x="400" y="60" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">zona antrean: p99 meledak</text>
</svg>`;

const MLOPS6_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Utilisasi: 3 replika = 100 persen (kolaps), 5 replika = 64 persen (aman)."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">50%</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">100%</text><rect x="85.7" y="20.0" width="129.6" height="160.0" rx="3" fill="var(--c4)"/><text x="150.5" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">100%: KOLEPS</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">3 replika</text><rect x="294.7" y="77.6" width="129.6" height="102.4" rx="3" fill="var(--c1)"/><text x="359.5" y="71.6" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">64%: AMAN</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">5 replika</text><line x1="46" y1="68.0" x2="464" y2="68.0" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="460" y="62.0" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">batas 70%</text></svg>`;

export const mlops6: V2Lesson = {
  slug: "mlops6-serving",
  track: "MLOps",
  module: "Pipeline & Deploy",
  title: "MLOps6 — Serving Infra",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model 20ms yang terasa 8 detik",
      prose: [
        "Harbolnas 12.12. E-commerce CepatKirim memasang model fraud scoring dengan latensi inferensi 20ms — sangat cepat. Tim yakin infrastruktur beres. Pukul 19.00, traffic naik 6x lipat. Checkout mulai timeout massal.",
        "Investigasi: modelnya tetap 20ms. Yang meledak adalah ANTREAN — request menumpuk menunggu giliran, plus cold start: container baru butuh 40 detik untuk load model 2GB ke memori, tepat saat dibutuhkan. p99 latensi: 8 detik. Model tercepat pun tidak berguna jika request-nya mengantre 400x lebih lama dari inferensinya.",
        "Twist-nya: tim mengoptimasi hal yang salah. Mereka mengecilkan model (20ms → 12ms) sementara masalahnya adalah kapasitas dan antrean. Serving ML bukan soal 'model cepat' — melainkan soal 'sistem yang tetap cepat saat diserbu'.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa model 20ms bisa terasa 8 detik di mata user; (2) menghitung jumlah replika yang dibutuhkan dari laju request dengan Hukum Little; (3) membaca kurva latensi-vs-utilisasi dan menentukan batas operasi aman; (4) memilih pola serving (batch, online, streaming) sesuai SLA-nya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Latensi inferensi = latensi yang dirasakan user'",
        type: "pitfall",
        body: "Latensi user = antrean + cold start + inferensi + network. Mengukur hanya inferensi seperti mengukur kecepatan kasir tanpa menghitung antreannya. p99 yang dilaporkan harus END-TO-END, dari request masuk sampai respons keluar.",
      },
      reference: "Serving = inferensi + antrean + cold start. Optimasi yang salah sasaran = sia-sia.",
    },
    {
      id: "pola-serving",
      eyebrow: "Langkah 2 · Tiga pola serving",
      title: "Batch, online, edge: pilih senjatamu",
      prose: [
        "Batch serving: skor dihitung terjadwal untuk BANYAK entitas sekaligus (jutaan nasabah semalam), hasilnya disimpan. Latensi: jam. Cocok: skor kredit bulanan, segmentasi. Murah, sederhana, tapi tidak real-time.",
        "Online serving: API yang menjawab per request dalam milidetik. Latensi: 10–300ms. Cocok: fraud scoring saat transaksi, rekomendasi saat halaman dibuka. Mahal, kompleks (autoscaling, antrean), tapi real-time.",
        "Edge/on-device: model berjalan di HP/IoT pengguna. Latensi: ~0 network. Cocok: privasi (data tidak keluar device), offline. Kendala: model harus kecil, update sulit, monitoring buta.",
        "Tidak ada pola yang 'terbaik' — hanya yang cocok dengan SLA keputusanmu. Pertanyaan kuncinya: 'berapa lama keputusan boleh menunggu?' Skor kredit KPR (ditentukan dalam hari) tidak butuh API 50ms; blokir fraud (ditentukan dalam detik) tidak bisa batch semalam.",
        "💡 Intuisi: seperti memilih kendaraan. Batch = kereta barang (banyak, terjadwal, lambat). Online = ojek (cepat, per-penumpang, mahal saat macet). Edge = sepeda sendiri (bebas, tapi tenagamu terbatas). Jangan naik ojek untuk pindahan rumah.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Semua model harus real-time API'",
        type: "pitfall",
        body: "Real-time adalah pola TERMahal: autoscaling, monitoring 24/7, on-call. Banyak 'kebutuhan real-time' ternyata hanya butuh 'cukup cepat': skor dihitung tiap 15 menit (micro-batch) sudah memenuhi 80% kasus dengan 20% biaya. Tanyakan SLA-nya dalam angka, bukan dalam kata 'real-time'.",
      },
      reference: "Pola mengikuti SLA keputusan: batch (jam), online (ms), edge (device).",
    },
    {
      id: "capacity",
      eyebrow: "Langkah 3 · Capacity planning",
      title: "Hukum Little: antrean itu matematika",
      prose: [
        "Hubungan fundamental antrean dirumuskan Hukum Little:",
      ],
      formula: String.raw`L = \lambda \times W`,
      formulaNote: "L = rata-rata jumlah request dalam sistem (mengantre + dilayani); λ (lambda) = laju kedatangan (request/detik); W = rata-rata waktu tiap request di sistem (detik). Jika λ×W melebihi kapasitas pelayan, antrean tumbuh TANPA BATAS.",
      tasks: [],
      figure: {
        svg: LATENCY_SVG,
        alt: "Kurva latensi p99 meledak setelah utilisasi 75 persen.",
        caption: "Hukum antrean: latensi datar sampai ~75% utilisasi, lalu meledak. Beroperasi di kanan knee = berjudi dengan SLA. Cara membaca: sumbu X = utilisasi server, sumbu Y = latensi; kurva datar lalu menanjak tajam setelah ~75%. Interpretasi: knee di 70–75% adalah batas operasi — setiap request di atasnya membayar `pajak antrean` yang naik eksponensial.",
      },
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "'Kapasitas = QPS puncak ÷ QPS per replika, pas-pasan.' Tanpa buffer, kamu beroperasi TEPAT di knee — spike 10% saja meledakkan p99. Aturan praktis: provision untuk puncak × 1,3, dan autoscale SEBELUM menyentuh 75%. Kapasitas pas-pasan = SLA yang menunggu untuk jebol.",
      },
      reference: "L = λW. Provision puncak × 1,3; waspada di 75% utilisasi.",
    },
    {
      id: "lab-capacity",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: perencana kapasitas Harbolnas",
      prose: [
        "Prakiraan QPS fraud-scoring 24 jam: datar di siang hari, memuncak 1.199 QPS jam 19.00. Satu replika aman menangani 40 QPS. Kamu punya 30 replika. Tugasmu: lengkapi fungsi `replika_butuh` (QPS × safety 1,3 ÷ 40, dibulatkan ke atas), lalu temukan jam berapa SLA jebol dan berapa biaya provision puncak.",
        "Cara membaca: tiap baris jam menunjukkan kebutuhan vs kapasitas. Interpretasi: 'JEBOL' berarti antrean tumbuh — Little's law berkata p99 akan meledak meski modelnya 20ms. Inilah malam 12.12 yang diramalkan sebelum terjadi.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `replika_butuh(q)` dengan safety 1.3" },
        { id: "t2", text: "Jalankan; catat jam pertama berstatus JEBOL" },
        { id: "t3", text: "Hitung biaya 24 jam pada kebutuhan puncak" },
      ],
      expected: "JEBOL mulai jam 17 · puncak 39 replika · Rp1.404.000",
      note: {
        title: "💡 Intuisi: kapasitas itu parkiran mal",
        body: "Mal menyediakan parkir untuk Sabtu malam tersibuk, bukan rata-rata Selasa. 364 hari terlihat 'boros' — tapi satu hari kekurangan parkir = pengunjung pergi ke mal lain. Kapasitas ML sama: kamu membayar untuk puncak yang jarang, karena biaya kehabisan (checkout gagal) jauh lebih mahal.",
      },
      hints: [
        "replika_butuh = math.ceil(q * 1.3 / 40).",
        "Loop 24 jam sudah disiapkan; fokus pada fungsi dan pembacaan output.",
        "Biaya = replika_puncak × 1500 × 24.",
      ],
      code: {
        starter: `import math, random\nrandom.seed(66)\n\nqps = [round(300 + 900 * math.exp(-((h - 19) ** 2) / 18) + random.gauss(0, 25)) for h in range(24)]\nqps = [max(150, v) for v in qps]\n\nKAPASITAS_PER_REPLIKA = 40\nSAFETY = 1.3\nBIAYA_REPLIKA_JAM = 1500\nREPLIKA_TERSEDIA = 30\n\ndef replika_butuh(q):\n    # TULIS KODEMU\n    \n\njam_bocor, maks_butuh = None, 0\nfor h, q in enumerate(qps):\n    butuh = replika_butuh(q)\n    maks_butuh = max(maks_butuh, butuh)\n    status = "OK " if butuh <= REPLIKA_TERSEDIA else "JEBOL"\n    if butuh > REPLIKA_TERSEDIA and jam_bocor is None:\n        jam_bocor = h\n    print(f"jam {h:02d}: QPS={q:3d} -> butuh {butuh:2d} replika [{status}]")\n\nprint(f"Replika tersedia : {REPLIKA_TERSEDIA}")\nprint(f"Kebutuhan puncak : {maks_butuh} replika")\nif jam_bocor is not None:\n    print(f"SLA JEBOL mulai jam {jam_bocor:02d}: antrean tumbuh, p99 meledak (Little's law).")\nprint(f"Biaya 24 jam @puncak: Rp{maks_butuh * BIAYA_REPLIKA_JAM * 24:,}".replace(",", "."))`,
        lockLines: 11,
        solution: `import math, random\nrandom.seed(66)\n\nqps = [round(300 + 900 * math.exp(-((h - 19) ** 2) / 18) + random.gauss(0, 25)) for h in range(24)]\nqps = [max(150, v) for v in qps]\n\nKAPASITAS_PER_REPLIKA = 40\nSAFETY = 1.3\nBIAYA_REPLIKA_JAM = 1500\nREPLIKA_TERSEDIA = 30\n\ndef replika_butuh(q):\n    # TULIS KODEMU\n    return math.ceil(q * SAFETY / KAPASITAS_PER_REPLIKA)\n\njam_bocor, maks_butuh = None, 0\nfor h, q in enumerate(qps):\n    butuh = replika_butuh(q)\n    maks_butuh = max(maks_butuh, butuh)\n    status = "OK " if butuh <= REPLIKA_TERSEDIA else "JEBOL"\n    if butuh > REPLIKA_TERSEDIA and jam_bocor is None:\n        jam_bocor = h\n    print(f"jam {h:02d}: QPS={q:3d} -> butuh {butuh:2d} replika [{status}]")\n\nprint(f"Replika tersedia : {REPLIKA_TERSEDIA}")\nprint(f"Kebutuhan puncak : {maks_butuh} replika")\nif jam_bocor is not None:\n    print(f"SLA JEBOL mulai jam {jam_bocor:02d}: antrean tumbuh, p99 meledak (Little's law).")\nprint(f"Biaya 24 jam @puncak: Rp{maks_butuh * BIAYA_REPLIKA_JAM * 24:,}".replace(",", "."))`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "SLA JEBOL mulai jam 17", label: "Jebol jam 17", msg: "Dengan safety 1.3, kebutuhan melewati 30 replika mulai jam 17." },
          { kind: "stdout_matches", task: "t2", pattern: "Kebutuhan puncak : 39 replika", label: "Puncak 39 replika", msg: "Jam 19-20 butuh 39 replika (1.199 QPS × 1.3 ÷ 40)." },
          { kind: "stdout_matches", task: "t3", pattern: "Rp1\\.404\\.000", label: "Biaya Rp1.404.000", msg: "39 × 1500 × 24 = Rp1.404.000 untuk 24 jam di level puncak." },
        ],
      },
      reference: "ceil(q × 1.3 / 40). Ramalkan puncak SEBELUM event, bukan saat event.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Pola serving untuk tiap SLA",
      prose: [
        "**Skenario 1 — Keputusan boleh menunggu jam/hari.** Skor kredit KPR, segmentasi. → Batch semalam. Paling murah, paling sederhana, paling mudah di-debug.",
        "**Skenario 2 — Keputusan dalam detik, volume fluktuatif.** Fraud scoring, rekomendasi. → Online API + autoscaling + buffer 30%. Inilah kasus Harbolnas — mahal tapi perlu.",
        "**Skenario 3 — Butuh 'hampir real-time' dengan budget terbatas.** Skor dihitung tiap 15 menit untuk dashboard. → Micro-batch: 80% manfaat real-time dengan 20% biaya. Sering dilupakan, sering jadi jawaban terbaik.",
        "**Skenario 4 — Privasi / offline / latensi ekstrem.** Deteksi penipuan di HP tanpa kirim data. → Edge. Bayar dengan model kecil + update sulit + monitoring buta — hanya jika privasi/latensi benar-benar menuntut.",
        "Aturan praktis 10 detik: tulis SLA dalam angka ('keputusan dalam X detik untuk Y% request') SEBELUM memilih pola. 'Real-time' bukan SLA — itu kata sifat.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: mulai dari batch, naik kelas jika terbukti perlu",
        body: "Batch adalah default yang bijak: murah, terobservasi, mudah di-replay. Naik ke online hanya jika ada ANGKA yang menuntut (kehilangan RpX per jam keterlambatan). Tim yang langsung membangun API real-time untuk kebutuhan batch membayar pajak kompleksitas setiap hari tanpa pernah ditagih manfaatnya.",
      },
      reference: "SLA dalam angka dulu, pola kemudian. Default: batch.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Tagihan autoscaling yang membengkak",
      prose: [
        "Setelah trauma 12.12, CepatKirim over-provision: 60 replika 24/7 'biar aman'. Tagihan: 60 × Rp1.500 × 24 × 30 = Rp64,8 juta/bulan — padahal kebutuhan rata-rata hanya 11 replika (Rp11,9 jt/bulan). Trauma berubah menjadi pemborosan Rp52,9 jt/bulan.",
        "Solusi: autoscaling terjadwal — 12 replika di jam sepi, scale ke 40 sebelum jam 17, turun lagi jam 22. Rata-rata tertimbang ≈ 18 replika ≈ Rp19,4 jt/bulan. Ditambah load test SEBELUM event besar (biaya sekali Rp5 jt) untuk validasi angka.",
        "**Pertanyaan:** (1) Berapa penghematan tahunan autoscaling terjadwal vs over-provision? (2) Kenapa autoscaling reaktif (berdasarkan CPU) saja tidak cukup untuk event seperti 12.12? (3) Apa peran load test di sini?",
        "**Pembahasan:** (1) (64,8 − 19,4) × 12 = Rp544,8 jt/tahun. (2) Cold start 40 detik: saat autoscaler reaktif mendeteksi lonjakan, container baru belum siap — request sudah timeout duluan. Event terjadwal butuh scaling PROAKTIF. (3) Load test memvalidasi angka kapasitas (40 QPS/replika) sebelum dipertaruhkan — asumsi tanpa test = tebakan Rp544 jt.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Over-provision permanen setelah insiden adalah pola 'trauma budgeting' — keputusan finansial berbasis rasa takut, bukan angka. Risk management yang baik mengganti rasa takut dengan perhitungan: prakiraan + buffer + autoscaling + load test.",
      },
      reference: "Rp544,8 jt/tahun = harga mengganti trauma dengan perhitungan.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Menghitung replika: Hukum Little untuk capacity planning",
      prose: [
        "Cerita lesson ini: model 20ms terasa 8 detik karena antrean. Sekarang kita hitung BERAPA server yang seharusnya disediakan — bukan dengan firasat, melainkan dengan Hukum Little: L = λ × W. L = rata-rata jumlah request DALAM sistem (dilayani + mengantre), λ = laju kedatangan (request/detik), W = rata-rata waktu tiap request di sistem (detik). Jika λ = 120 req/s dan W = 0,25 detik (20ms inferensi + overhead), maka L = 30 — setiap saat ada 30 request dalam sistem.",
        "Satu replika melayani c = 10 request konkuren (terbatas memori GPU). Jumlah replika minimum n = ⌘L / c⌙ = ⌘3⌙ = 3. Tapi mengoperasikan TEPAT 3 replika = utilisasi 100% = antrean meledak (kurva di chart lesson ini). Target operasi aman: utilisasi ≤ 70%. Maka n = ⌘L / (0,7 × c)⌙ = ⌘30/7⌙ = 5 replika. Lima, bukan tiga — selisih DUA replika inilah yang membedakan `model 20ms` dengan `terasa 8 detik`.",
        "Contoh kedua dengan angka berbeda — fraud scoring real-time: λ = 800 req/s (puncak jam 12 siang), W = 0,05 detik (model ringan), c = 50 konkuren per replika. L = 800 × 0,05 = 40; n = ⌘40/(0,7×50)⌙ = ⌘1,14⌙ = 2 replika untuk rata-rata. Tapi λ puncak vs rata-rata: jika rata-rata harian 300 req/s tapi puncak 800, provisioning untuk rata-rata = 1 replika → kolaps tiap jam makan siang. Aturan: hitung dengan λ PUNCAK (p95 harian), bukan rata-rata. Autoscaling menangani sisanya: baseline 2 replika, scale up ke 4 saat λ > 500.",
        "Autoscaling sendiri punya matematika: waktu scale-up (cold start container + load model) ≈ 90 detik. Jika λ naik dari 300 ke 800 dalam 60 detik (flash sale), maka selama 30 detik sistem kekurangan kapasitas: defisit ≈ (800−500) × 30 = 9.000 request mengantre → latensi melonjak. Solusinya: (1) scheduled scaling (tahu jam sibuk → scale duluan), (2) over-provision buffer 30%, atau (3) percepat cold start (model lebih kecil, image pre-warmed). Pilih berdasarkan pola traffic: terjadwal → (1); acak → (2)+(3).",
        "Biaya menganggur vs biaya kolaps: 5 replika × 24 jam × Rp15 ribu/jam = Rp1,8 juta/hari. Kolaps 1 jam saat puncak: 800 req/s × 3600 × 10% gagal × Rp50 ribu nilai transaksi = Rp144 juta. Rasio 80:1 — over-provision 2 replika `mubazir` Rp600 ribu/hari untuk mengasuransikan Rp144 juta. Inilah hitungan yang harus dibawa saat finance bertanya `kenapa servernya nganggur 30%`. Jawab: karena 30% itu bukan nganggur — itu sabuk pengaman.",
        "Waspadai satu jebakan: W (waktu di sistem) BUKAN waktu inferensi model. W = inferensi + antrean + serialisasi + network. Tim yang menghitung n dari `model 20ms` lalu kaget karena butuh 3x replika biasanya lupa overhead: serialisasi JSON 5ms, network 10ms, antrean 15ms → W aktual 50ms, bukan 20ms. Selalu ukur W dari PRODUKSI (p50 latensi end-to-end), bukan dari benchmark lab. Lab mengukur kecepatan lari; produksi mengukur kecepatan lari sambil mengantre.",
        "Checklist capacity planning 10 menit: (1) ukur λ puncak (p95) dan W p50 dari produksi 7 hari terakhir; (2) tentukan c per replika dari load test (naikkan konkuren sampai latensi naik 20%); (3) n = ⌘λW/(0,7c)⌙; (4) tentukan strategi scale (scheduled vs reactive) dari pola traffic; (5) uji chaos: matikan 1 replika saat puncak, pastikan latensi tetap dalam SLA. Jika langkah (5) gagal, n-mu kurang — atau autoscaling-mu terlalu lambat.",
      ],
      formula: String.raw`n = \left\lceil \frac{\lambda \times W}{0{,}7 \times c} \right\rceil`,
      formulaNote: "n = jumlah replika; λ = laju request puncak per detik; W = waktu rata-rata request di sistem (detik, ukur dari produksi!); c = kapasitas konkuren satu replika; 0,7 = target utilisasi maksimum 70%; ⌈⌉ = bulatkan ke atas. Hitung dengan λ puncak, bukan rata-rata.",
      figure: {
        svg: MLOPS6_DEEP_SVG,
        alt: "Diagram batang utilisasi: 3 replika = 100% (kolaps, di atas batas), 5 replika = 64% (aman, di bawah batas 70%).",
        caption: "Cara membaca: tinggi batang = utilisasi server; garis putus-putus = batas operasi aman 70%; dua batang = dua pilihan jumlah replika untuk beban yang sama. Interpretasi: 3 replika terlihat `cukup` secara matematika (λW/c = 3) tapi beroperasi di 100% = antrean meledak; 5 replika memberi sabuk pengaman 36% — `nganggur` yang sebenarnya asuransi Rp144 juta.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: antrean adalah pajak atas utilisasi 100%",
        body: "Setiap persen utilisasi di atas 70% dibayar dengan latensi yang naik eksponensial. Server yang `nganggur 30%` bukan pemborosan — ia sedang membayar premi asuransi agar model 20ms tidak terasa 8 detik. Tunjukkan hitungan Rp600 ribu vs Rp144 juta ke finance.",
      },
      reference: "n = ⌈λW/(0,7c)⌉ dengan λ puncak dan W dari produksi. Uji chaos: matikan 1 replika saat puncak.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Latensi user = antrean + cold start + inferensi; ukur end-to-end (p99).",
        "Tiga pola: batch (jam), online (ms), edge (device) — pilih berdasar SLA angka.",
        "Hukum Little L = λW; provision puncak × 1,3; waspada di 75% utilisasi.",
        "Cold start membuat autoscaling reaktif gagal untuk lonjakan tiba-tiba — butuh proaktif.",
        "Default mulai dari batch; naik kelas hanya jika angka menuntut.",
      ],
      next: { label: "MLOps7 — Monitoring & Alerting", href: "/learn/mlops7-monitoring" },
      quiz: [
        {
          q: "Model 20ms tapi p99 8 detik saat Harbolnas. Penyebab utama?",
          options: [
            { text: "Model terlalu besar", why: "Model tetap 20ms — bukan ia yang melambat." },
            { text: "Antrean + cold start: request menunggu jauh lebih lama dari inferensinya", why: "Kapasitas jebol → antrean tumbuh (Little's law) + container baru butuh 40 detik load model.", correct: true },
            { text: "Network internet lambat", why: "Tidak ada bukti; masalahnya di sisi serving." },
            { text: "Database lambat", why: "Skor dihitung dari fitur cache; bottleneck-nya antrean serving." },
          ],
        },
        {
          q: "Skor kredit KPR diputuskan dalam 3 hari. Pola serving tepat?",
          options: [
            { text: "API real-time 50ms", why: "Overkill: keputusan 3 hari tidak butuh 50ms. Pajak kompleksitas tanpa manfaat." },
            { text: "Batch semalam — murah, sederhana, cukup", why: "SLA jam/hari = batch adalah jawaban default yang bijak.", correct: true },
            { text: "Edge di HP nasabah", why: "Tidak ada kebutuhan privasi/offline ekstrem di sini." },
            { text: "Micro-batch 15 menit", why: "Bisa, tapi batch harian sudah lebih dari cukup dan lebih murah." },
          ],
        },
        {
          q: "λ = 100 req/detik, W = 0,5 detik, tiap replika menangani 25 req/detik. Replika minimum (tanpa buffer)?",
          options: [
            { text: "2", why: "2 × 25 = 50 req/detik < λ = 100 — kapasitas kurang dari kedatangan, antrean tumbuh tanpa batas." },
            { text: "4", why: "λ=100 ÷ 25 = 4 replika (cek silang: L = 100×0,5 = 50 request; 4 replika × 25 = 100 req/detik pas).", correct: true },
            { text: "50", why: "Itu L (jumlah request dalam sistem), bukan jumlah replika." },
            { text: "8", why: "Itu jika pakai buffer 2x tanpa diminta. Soal minta tanpa buffer." },
          ],
        },
        {
          q: "Kenapa autoscaling reaktif (berbasis CPU) gagal untuk flash sale?",
          options: [
            { text: "CPU tidak naik saat traffic naik", why: "CPU justru naik — masalahnya bukan deteksi." },
            { text: "Cold start: container baru butuh puluhan detik siap, request sudah timeout duluan", why: "Scaling reaktif selalu terlambat untuk lonjakan curam. Event terjadwal butuh scaling proaktif.", correct: true },
            { text: "Autoscaler tidak bisa menambah replika", why: "Bisa — hanya terlambat." },
            { text: "Traffic flash sale tidak terdeteksi", why: "Terdeteksi, tapi responsnya kalah cepat dari timeout." },
          ],
        },
        {
          q: "Operasi di 95% utilisasi 'kan efisien'. Masalahnya?",
          options: [
            { text: "Tidak ada — efisiensi maksimal", why: "Lihat kurva: di kanan knee, spike 5% meledakkan p99 berkali-kali lipat." },
            { text: "Berada di kanan knee: spike kecil → antrean meledak → SLA jebol", why: "Efisiensi tanpa buffer = kerapuhan. Buffer 25-30% adalah harga ketahanan.", correct: true },
            { text: "Biaya lebih mahal", why: "Justru lebih murah — tapi rapuh." },
            { text: "Model jadi tidak akurat", why: "Akurasi tidak terpengaruh utilisasi; latensi yang hancur." },
          ],
        },
        {
          q: "Fraud scoring: λ puncak = 800 req/s, W = 0,05 dtk (dari produksi), c = 50 konkuren/replika. Berapa replika untuk operasi aman?",
          options: [
            { text: "1 replika — cukup untuk rata-rata 300 req/s", why: "Menghitung dengan rata-rata = kolaps tiap jam puncak. λ yang dipakai harus PUNCAK (800), bukan rata-rata." },
            { text: "2 replika — hasil ⌘40/(0,7×50)⌙", why: "Tepat. L = 800×0,05 = 40 request dalam sistem; kapasitas aman per replika = 0,7×50 = 35; 40/35 = 1,14 → bulatkan ke atas = 2. Plus autoscaling untuk lonjakan.", correct: true },
            { text: "4 replika — selalu kali dua untuk aman", why: "Faktor `kali dua` tanpa hitungan = over-provision buta. Hitungan yang benar memberi 2 (baseline) + autoscaling — 4 permanen membuang Rp720 ribu/hari tanpa dasar." },
            { text: "800 replika — satu per request per detik", why: "Satu replika melayani BANYAK request konkuren (c=50), bukan satu. 800 replika = 400x over-provision = Rp288 juta/hari terbuang." },
          ],
        },
      ],
    },
  ],
};
