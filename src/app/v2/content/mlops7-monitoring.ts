import type { V2Lesson } from "../lib/types";

// Histogram baseline (saat training) vs produksi minggu ini untuk fitur trx_per_hari.
// Produksi bergeser ke kanan = pola perilaku berubah.
const DRIFT_SVG = `<svg viewBox="0 0 480 210" role="img" aria-label="Histogram baseline vs produksi: distribusi produksi bergeser ke kanan.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="40" y1="160" x2="460" y2="160"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle"><text x="40" y="178">0</text><text x="146" y="178">10</text><text x="252" y="178">20</text><text x="358" y="178">30</text><text x="450" y="178">trx/hari</text></g>
<g opacity="0.75">
<rect x="46" y="120" width="34" height="40" fill="var(--c1)"/><rect x="88" y="96" width="34" height="64" fill="var(--c1)"/><rect x="130" y="72" width="34" height="88" fill="var(--c1)"/><rect x="172" y="88" width="34" height="72" fill="var(--c1)"/><rect x="214" y="112" width="34" height="48" fill="var(--c1)"/><rect x="256" y="136" width="34" height="24" fill="var(--c1)"/><rect x="298" y="148" width="34" height="12" fill="var(--c1)"/><rect x="340" y="154" width="34" height="6" fill="var(--c1)"/>
</g>
<g opacity="0.75">
<rect x="52" y="148" width="34" height="12" fill="var(--c4)"/><rect x="94" y="140" width="34" height="20" fill="var(--c4)"/><rect x="136" y="128" width="34" height="32" fill="var(--c4)"/><rect x="178" y="112" width="34" height="48" fill="var(--c4)"/><rect x="220" y="92" width="34" height="68" fill="var(--c4)"/><rect x="262" y="76" width="34" height="84" fill="var(--c4)"/><rect x="304" y="88" width="34" height="72" fill="var(--c4)"/><rect x="346" y="108" width="34" height="52" fill="var(--c4)"/><rect x="388" y="132" width="34" height="28" fill="var(--c4)"/>
</g>
<rect x="40" y="8" width="10" height="10" fill="var(--c1)"/><text x="56" y="17" font-size="12" fill="var(--text)" font-family="var(--font-ui)">baseline (training)</text>
<rect x="200" y="8" width="10" height="10" fill="var(--c4)"/><text x="216" y="17" font-size="12" fill="var(--text)" font-family="var(--font-ui)">produksi minggu ini</text>
<text x="420" y="60" font-size="12" fill="var(--c4)" font-family="var(--font-ui)" font-weight="700">PSI = 1,22 → ALERT</text>
</svg>`;

const MLOPS7_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Presisi alert: ambang 0,02 hanya 5 persen, ambang 0,05 dengan konfirmasi 3 hari mencapai 83 persen."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">50%</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">100%</text><rect x="85.7" y="170.4" width="129.6" height="9.6" rx="3" fill="var(--c4)"/><text x="150.5" y="164.4" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">5%: SPAM</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Ambang 0,02</text><rect x="294.7" y="20.0" width="129.6" height="160.0" rx="3" fill="var(--c1)"/><text x="359.5" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">83%: SEHAT</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Ambang 0,05+3hr</text><line x1="46" y1="83.6" x2="464" y2="83.6" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="460" y="77.6" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">target 50%</text></svg>`;

export const mlops7: V2Lesson = {
  slug: "mlops7-monitoring",
  track: "MLOps",
  module: "Pipeline & Deploy",
  title: "MLOps7 — Monitoring & Alerting",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dashboard hijau, bisnis berdarah",
      prose: [
        "Model fraud PayLancar dipantau dengan dashboard yang indah: API uptime 99,98%, latensi p99 180ms, error rate 0,01%. Semua hijau selama 3 bulan. Tim infra bangga.",
        "Lalu audit triwulanan: kerugian fraud naik 34%. Investigasi menunjukkan pola serangan berubah total 3 bulan lalu — fitur 'trx_per_hari' bergeser drastis — tapi tidak ada SATU PUN metrik di dashboard yang mengukur hal itu. Yang dipantau adalah kesehatan SERVER, bukan kesehatan MODEL.",
        "Twist-nya: dashboard tidak berbohong — ia hanya menjawab pertanyaan yang salah. 'Apakah API hidup?' YA. 'Apakah model masih benar?' TIDAK DITANYA. Monitoring ML harus menjawab pertanyaan kedua, dan itu butuh metrik yang sama sekali berbeda.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa dashboard hijau bisa menutupi bisnis yang berdarah; (2) menghitung PSI untuk mengukur pergeseran distribusi; (3) menghitung presisi alert dan mengenali kelelahan alert; (4) memutuskan: page, tiket, atau sekadar log untuk tiap jenis sinyal; (5) menghitung burn rate error budget dan memutuskan page/tiket dari angka; (6) merancang monitoring per versi model, validasi data di serving, dan sampling untuk trafik tinggi. Lesson ini adalah kelanjutan dari MLE6 (ME14, monitoring dasar) — di sana kamu belajar MENDETEKSI drift; di sini kamu belajar MENGOPERASIKAN monitoring 24/7.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Monitoring model = pastikan API tidak down'",
        type: "pitfall",
        body: "Uptime hanya membuktikan model MENJAWAB, bukan menjawab dengan BENAR. Model yang down ketahuan dalam menit; model yang diam-diam salah bisa berdarah berbulan-bulan. Keduanya butuh dipantau — dengan metrik dan pemilik yang berbeda.",
      },
      reference: "API hidup ≠ model sehat. Pantau keduanya, dengan metrik berbeda.",
    },
    {
      id: "empat-lapis",
      eyebrow: "Langkah 2 · Empat lapis monitoring",
      title: "Radar empat lapis",
      prose: [
        "Lapis 1 — Input (data): distribusi fitur vs baseline (PSI per fitur), missing rate, skema. Pertanyaan: 'apakah dunia masih seperti saat training?' Ini radar TERCEPAT — drift terlihat di sini berminggu-minggu sebelum metrik lain bergerak.",
        "Lapis 2 — Output (prediksi): distribusi skor, alert/approval rate, proporsi tiap kelas. Pertanyaan: 'apakah perilaku model berubah?' Lonjakan alert rate 200 → 3.000/jam = alarm keras, bahkan sebelum tahu kenapa.",
        "Lapis 3 — Performa (kebenaran): akurasi/presisi/recall dengan label yang SUDAH MATANG, per segmen. Pertanyaan: 'apakah model masih benar?' Paling lambat (label fraud matang 30–90 hari), tapi paling definitif.",
        "Lapis 4 — Bisnis & infra: kerugian aktual, biaya operasional, komplain, latensi, utilisasi. Pertanyaan: 'apakah bisnis masih untung dan sistem masih kuat?' Lapis ini yang dibaca direksi.",
        "Aturan keras: setiap metrik butuh PEMILIK dan RUNBOOK. 'Jika alert rate naik 3x jam 3 pagi, siapa yang bangun dan melakukan apa?' Metrik tanpa runbook = dekorasi dashboard.",
        "💡 Intuisi: seperti pemeriksaan kesehatan. Lapis 1 = cek darah rutin (cepat, preventif). Lapis 2 = gejala yang dirasakan. Lapis 3 = biopsi (lambat, pasti). Lapis 4 = 'apakah pasien masih bisa kerja?' Hanya mengandalkan satu lapis = menunggu kanker stadium 4.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Nanti saja monitoringnya, yang penting deploy dulu'",
        type: "pitfall",
        body: "Deploy tanpa monitoring = mengemudi tanpa spidometer dan tanpa rem darurat. 'Nanti' berarti insiden pertamamu tidak akan ketahuan — seperti PayLancar yang berdarah 3 bulan. Monitoring bukan fase 2; ia bagian dari definisi 'selesai deploy'.",
      },
      reference: "4 lapis: input → output → performa → bisnis. Tiap metrik = pemilik + runbook.",
    },
    {
      id: "psi",
      eyebrow: "Langkah 3 · Drift detection",
      title: "PSI: mengukur pergeseran distribusi",
      prose: [
        "Population Stability Index (PSI) mengukur seberapa jauh distribusi fitur produksi menyimpang dari baseline training:",
      ],
      formula: String.raw`PSI = \sum_{i=1}^{k} (A_i - E_i) \cdot \ln\left(\frac{A_i}{E_i}\right)`,
      formulaNote: "k = jumlah bin histogram; A_i = proporsi aktual (produksi) di bin i; E_i = proporsi ekspektasi (baseline) di bin i. Ambang praktis: < 0,10 aman; 0,10–0,25 waspada; > 0,25 = pergeseran signifikan, investigasi.",
      figure: {
        svg: DRIFT_SVG,
        alt: "Histogram baseline vs produksi: distribusi produksi bergeser ke kanan.",
        caption: "Drift nyata: distribusi trx_per_hari produksi bergeser kanan vs baseline. PSI 1,22 — jauh di atas ambang 0,25. Cara membaca: dua kurva distribusi fitur; biru = baseline training, merah = produksi 30 hari terakhir; angka PSI mengukur jarak keduanya. Interpretasi: PSI 1,22 berarti pergeseran SANGAT signifikan (ambang waspada 0,25) — populasi yang dilayani model sudah bukan populasi yang ia kenali.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung PSI dengan bin yang dibuat TERPISAH untuk baseline dan produksi (rentang berbeda!). Bin harus SAMA untuk keduanya — kalau tidak, kamu membandingkan apel dengan jeruk dan PSI-mu sampah. Selalu tentukan bin dari gabungan kedua distribusi.",
      },
      reference: "PSI > 0,25 = alert. Bin harus sama untuk baseline & produksi.",
    },
    {
      id: "lab-drift",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: detektor drift tiga fitur",
      prose: [
        "Tiga fitur PayLancar, baseline (saat training) vs data produksi minggu ini: `tenor_bulan` (seharusnya stabil), `limit_kartu` (diduga bergeser), `trx_per_hari` (diduga berubah total).",
        "Tugasmu: implementasikan `psi()` — buat histogram dengan bin SAMA dari rentang gabungan, lalu terapkan rumus. Klasifikasikan: < 0,10 aman; 0,10–0,25 waspada; > 0,25 ALERT.",
        "Cara membaca: tiap baris = satu fitur dengan vonisnya. Interpretasi: fitur dengan ALERT adalah 'tersangka utama' penurunan performa — mulai investigasi dari sana, bukan dari menuduh modelnya.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `histogram` dengan bin dari rentang gabungan" },
        { id: "t2", text: "Implementasikan rumus `psi`" },
        { id: "t3", text: "Jalankan; identifikasi fitur yang ALERT" },
      ],
      expected: "tenor 0.006 aman · limit 0.277 ALERT · trx 1.220 ALERT",
      note: {
        title: "💡 Intuisi: drift seperti demam",
        body: "Demam bukan penyakit — ia sinyal ada infeksi. Drift bukan vonis 'model rusak' — ia sinyal 'dunia berubah, investigasi!'. Respon yang benar bukan langsung retrain, melainkan: pahami DULU apa yang bergeser dan kenapa. Kadang jawabannya bug data, bukan model basi.",
      },
      hints: [
        "lo, hi = min(baseline+current), max(baseline+current); lebar = (hi-lo)/bins.",
        "psi = sum((c-b) * math.log((c+eps)/(b+eps)) untuk tiap bin.",
        "Jangan lupa eps=1e-4 agar tidak log(0).",
      ],
      code: {
        starter: `import math, random\nrandom.seed(77)\n\ndef histogram(data, bins, lo, hi):\n    # TULIS KODEMU: proporsi tiap bin (bin SAMA untuk baseline & current)\n    \n\ndef psi(baseline, current, bins=10, eps=1e-4):\n    # TULIS KODEMU: rumus PSI\n    \n\nfitur = {\n    "tenor_bulan":   ([random.gauss(24, 8) for _ in range(2000)],\n                      [random.gauss(24, 8) for _ in range(2000)]),\n    "limit_kartu":   ([random.gauss(15, 4) for _ in range(2000)],\n                      [random.gauss(17, 5) for _ in range(2000)]),\n    "trx_per_hari":  ([random.expovariate(1/3) for _ in range(2000)],\n                      [random.expovariate(1/9) for _ in range(2000)]),\n}\n\nprint("Drift detector (ambang: PSI > 0.25 = ALERT):")\nfor nama, (base, curr) in fitur.items():\n    nilai = psi(base, curr)\n    status = "ALERT" if nilai > 0.25 else ("waspada" if nilai > 0.10 else "aman")\n    print(f"  {nama:12s} PSI={nilai:.3f} -> {status}")`,
        lockLines: 21,
        solution: `import math, random\nrandom.seed(77)\n\ndef histogram(data, bins, lo, hi):\n    # TULIS KODEMU: proporsi tiap bin (bin SAMA untuk baseline & current)\n    n = len(data)\n    lebar = (hi - lo) / bins if hi > lo else 1.0\n    hit = [0] * bins\n    for x in data:\n        i = min(bins - 1, int((x - lo) / lebar)) if lebar else 0\n        hit[i] += 1\n    return [h / n for h in hit]\n\ndef psi(baseline, current, bins=10, eps=1e-4):\n    # TULIS KODEMU: rumus PSI\n    lo, hi = min(baseline + current), max(baseline + current)\n    pb = histogram(baseline, bins, lo, hi)\n    pc = histogram(current, bins, lo, hi)\n    return sum((c - b) * math.log((c + eps) / (b + eps)) for b, c in zip(pb, pc))\n\nfitur = {\n    "tenor_bulan":   ([random.gauss(24, 8) for _ in range(2000)],\n                      [random.gauss(24, 8) for _ in range(2000)]),\n    "limit_kartu":   ([random.gauss(15, 4) for _ in range(2000)],\n                      [random.gauss(17, 5) for _ in range(2000)]),\n    "trx_per_hari":  ([random.expovariate(1/3) for _ in range(2000)],\n                      [random.expovariate(1/9) for _ in range(2000)]),\n}\n\nprint("Drift detector (ambang: PSI > 0.25 = ALERT):")\nfor nama, (base, curr) in fitur.items():\n    nilai = psi(base, curr)\n    status = "ALERT" if nilai > 0.25 else ("waspada" if nilai > 0.10 else "aman")\n    print(f"  {nama:12s} PSI={nilai:.3f} -> {status}")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "tenor_bulan\\s+PSI=0\\.006 -> aman", label: "tenor aman", msg: "tenor_bulan stabil: PSI 0.006." },
          { kind: "stdout_matches", task: "t3", pattern: "limit_kartu\\s+PSI=0\\.277 -> ALERT", label: "limit ALERT", msg: "limit_kartu bergeser melewati ambang: PSI 0.277." },
          { kind: "stdout_matches", task: "t3", pattern: "trx_per_hari\\s+PSI=1\\.220 -> ALERT", label: "trx ALERT besar", msg: "trx_per_hari berubah total: PSI 1.220 — tersangka utama." },
        ],
      },
      reference: "Bin sama, eps anti-log(0). ALERT > 0,25 = mulai investigasi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Page, tiket, atau sekadar log?",
      prose: [
        "Tidak semua alert butuh membangunkan orang. Peta respons:",
        "**Skenario 1 — PAGE (bangunkan manusia, respons <15 menit).** API error rate > 1%, skor tidak keluar sama sekali, fraud loss melonjak tiba-tiba. Kriteria: uang/reputasi hilang SEKARANG.",
        "**Skenario 2 — TIKET (ditangani jam kerja).** PSI satu fitur 0,25–0,5, alert rate naik 20%, latensi p99 mendekati SLA. Kriteria: sinyal memburuk tapi belum darurat — investigasi terjadwal.",
        "**Skenario 3 — LOG + review mingguan.** PSI 0,10–0,25, fluktuasi musiman yang sudah dikenal. Kriteria: pantau tren, jangan ganggu manusia.",
        "**Skenario 4 — JANGAN ALERT.** Metrik tanpa runbook, ambang asal-asalan, atau 'info' yang tidak butuh aksi. Setiap alert tanpa aksi = latihan mengabaikan alert. Alert fatigue membunuh sistem monitoring lebih pasti daripada tidak ada monitoring.",
        "Aturan praktis 10 detik: untuk tiap alert, tulis SATU kalimat aksi ('jika X, maka Y lakukan Z'). Tidak bisa menulisnya = jangan buat alert-nya.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: alarm kebakaran vs notifikasi promo",
        body: "Alarm kebakaran membangunkan seluruh gedung karena taruhannya nyawa. Notifikasi promo cukup dibaca nanti. Sistem alert yang memperlakukan keduanya sama akan membuat penghuni mengabaikan KEDUANYA — termasuk saat api benar-benar datang. Klasifikasi alert = menyelamatkan nyawa sistem.",
      },
      reference: "Page = uang hilang sekarang. Tiket = memburuk. Log = tren. Tanpa aksi = tanpa alert.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Tiga bulan yang hilang",
      prose: [
        "Bedah angka PayLancar: kerugian fraud naik 34% selama 3 bulan sebelum ketahuan. Baseline kerugian Rp2,1 M/bulan → naik jadi Rp2,81 M/bulan. Kelebihan kerugian: 3 × Rp714 jt = Rp2,14 M. Biaya membangun monitoring 4 lapis yang layak: ~Rp120 jt sekali + Rp15 jt/bulan operasional.",
        "Jika drift terdeteksi di minggu ke-2 (PSI trx_per_hari pasti sudah > 0,25), kerugian berlebih hanya 0,5 × Rp714 jt = Rp357 jt. Penghematan: Rp2,14 M − Rp357 jt = Rp1,78 M — untuk investasi Rp120 jt.",
        "**Pertanyaan:** (1) Kenapa drift terdeteksi di lapis 1 (input) berminggu-minggu sebelum lapis 3 (performa)? (2) Apa yang harus dilakukan SAAT alert PSI berbunyi — langsung retrain? (3) Hitung payback period investasi monitoring.",
        "**Pembahasan:** (1) Lapis 1 tidak butuh label kebenaran — distribusi input bisa diukur hari ini; akurasi butuh label matang 30–90 hari. (2) TIDAK langsung retrain: investigasi dulu (apakah bug data? perubahan bisnis legit? serangan baru?). Retrain buta bisa mengabadikan pola sementara. (3) Rp120 jt / (Rp714 jt/bulan penghematan) < 1 bulan — payback tercepat di antara semua investasi MLOps.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk model berisiko tinggi, 'tidak ada yang memantau' adalah temuan audit kritis. Regulator tidak bertanya 'apakah modelmu akurat saat deploy' — mereka bertanya 'bagaimana kamu TAHU ia masih akurat bulan lalu?' Monitoring 4 lapis adalah jawabannya.",
      },
      reference: "Payback < 1 bulan. Drift = sinyal investigasi, bukan perintah retrain.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Presisi alert: ketika alarm terlalu sering berbohong",
      prose: [
        "Tim KreditKu akhirnya memasang monitoring — dan langsung kebanjiran: 120 alert per bulan. Dari 120 itu, hanya 14 yang actionable (benar-benar butuh tindakan). Presisi alert = 14/120 ≈ 12%. Tiga bulan kemudian, engineer mulai me-mute channel alert (`berisik, tidak penting`). Lalu datanglah insiden nyata — distribusi skor bergeser 0,08 — alertnya BERBUNYI, tapi tidak ada yang membaca. Model rusak 3 minggu tanpa terdeteksi. Ironisnya: mereka buta BUKAN karena tidak ada alarm, melainkan karena alarmnya terlalu sering berbohong.",
        "Presisi = TP/(TP+FP): dari semua yang berbunyi, berapa yang benar. Target sehat: presisi ≥ 50% untuk page (membangunkan orang), ≥ 20% untuk tiket. Di bawah itu, alarm adalah spam — dan spam melatih manusia untuk mengabaikan. Hitung untuk timmu sekarang: ambil 30 hari alert terakhir, tandai mana yang berujung tindakan nyata. Jika presisi page-mu 12% seperti KreditKu, kamu tidak punya sistem alerting — kamu punya sistem spam.",
        "Cara menaikkan presisi ada tiga. Pertama, NAIKKAN AMBANG berdasarkan data, bukan firasat. Alert `skor bergeser > 0,02` berbunyi 40x/bulan (38 false); ambang 0,05 berbunyi 6x/bulan (5 true, 1 false) — presisi naik dari 5% ke 83% dengan mengorbankan sedikit keterlambatan deteksi (waktu buta +4 hari). Kedua, TAMBAH KONDISI: alert hanya bunyi jika pergeseran bertahan 3 hari berturut-turut (menghilangkan noise 1-hari) — false alarm turun 70%. Ketiga, BEDAKAN SEVERITY: geser 0,05–0,08 → tiket; > 0,08 → page. Page yang jarang bunyi = page yang didengar.",
        "Contoh perhitungan trade-off: ambang 0,02 — waktu buta 2 hari, presisi 5%, 38 gangguan tidur/bulan. Ambang 0,05 + konfirmasi 3 hari — waktu buta 6 hari, presisi 83%, 1 gangguan/bulan. Biaya 4 hari waktu buta tambahan: 4 × Rp6,5 miliar/30 ≈ Rp870 juta (kasus KreditKu). Biaya 38 false page: setiap page membangunkan 2 orang × 30 menit × Rp500 ribu/jam ≈ Rp19 juta/bulan + EROSI KEPERCAYAAN yang tak terhitung (dan yang akhirnya menyebabkan 3 minggu buta = Rp4,5 miliar). Total biaya ambang longgar ternyata LEBIH MURAH. Kelelahan alert bukan masalah kenyamanan — ia masalah uang.",
        "Presisi bukan satu-satunya metrik: ada juga RECALL alert = TP/(TP+FN) — dari semua insiden nyata, berapa yang tertangkap alarm. Ambang terlalu tinggi menaikkan presisi tapi menurunkan recall (insiden lolos diam-diam). Keseimbangan ideal: recall 100% untuk insiden SEVERE (tidak boleh ada yang lolos), presisi ≥ 50% untuk page. Caranya: dua lapis — lapis sensitif (ambang rendah → tiket/log, recall tinggi) + lapis spesifik (ambang tinggi + konfirmasi → page, presisi tinggi). Jangan minta SATU ambang melakukan dua pekerjaan.",
        "Audit alert tiap kuartal dengan 4 angka: total alert, presisi page, presisi tiket, recall insiden severe. Aturan aksi: presisi page < 50% → naikkan ambang/tambah konfirmasi minggu ini juga. Alert yang di-mute > 2x → hapus atau perbaiki (mute adalah vonis mati yang tidak jujur). Tidak ada alert baru boleh masuk ke channel page tanpa 2 minggu masa percobaan di channel log — `alert probation`. Dengan disiplin ini, 120 alert/bulan KreditKu turun menjadi 18 — dan setiap bunyi kini didengar.",
        "Terakhir, bedakan alert untuk MESIN vs untuk MANUSIA. Alert mesin (auto-remediation: restart worker, rollback otomatis) boleh berisik — mesin tidak lelah. Alert manusia (page/tiket) harus pelit — manusia lelah. Kesalahan KreditKu: mencampur keduanya dalam satu channel. Pisahkan: channel `#ml-ops-auto` untuk mesin (boleh 100/hari), `#ml-ops-human` untuk manusia (target < 1/hari). Kelelahan alert adalah masalah desain channel, bukan masalah jumlah metrik.",
      ],
      formula: String.raw`\text{presisi} = \frac{TP}{TP + FP} \qquad \text{recall} = \frac{TP}{TP + FN}`,
      formulaNote: "TP = alert benar yang berujung tindakan; FP = false alarm; FN = insiden nyata yang tidak tertangkap alarm. Target: presisi page ≥50%, presisi tiket ≥20%, recall insiden severe = 100%. Ukur dari 30 hari data alert terakhir.",
      figure: {
        svg: MLOPS7_DEEP_SVG,
        alt: "Diagram batang presisi alert: ambang 0,02 = 5% (spam), ambang 0,05 dengan konfirmasi 3 hari = 83% (sehat).",
        caption: "Cara membaca: tinggi batang = presisi alert (persen alert yang benar-benar butuh tindakan); garis putus-putus = target minimum 50% untuk page. Interpretasi: ambang sensitif tanpa konfirmasi = spam 5% yang melatih tim mengabaikan alarm; ambang terkalibrasi + konfirmasi 3 hari = 83% — setiap bunyi didengar.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: alarm yang sering bohong = tidak ada alarm",
        body: "Manusia tidak bisa membedakan `alarm ke-37 yang false` dengan `alarm ke-38 yang nyata` — keduanya di-snooze. Presisi page di bawah 50% bukan masalah kecil yang `nanti diperbaiki`; ia adalah sistem monitoring yang sedang tidak berfungsi. Perbaiki minggu ini, bukan kuartal depan.",
      },
      reference: "Ukur presisi tiap kuartal. Pisahkan channel mesin vs manusia. Alert baru wajib probation 2 minggu.",
    },
    {
      id: "ops-lanjutan",
      eyebrow: "Langkah 8 · Pendalaman lanjutan",
      title: "Burn rate, monitoring per versi, dan sampling",
      prose: [
        "Empat lapis (Langkah 2) dan presisi alert (Langkah 7) menjawab 'apa yang dipantau' dan 'apakah alarm dipercaya'. Langkah ini — pendalaman yang membedakan MO11 dari MLE6 — menjawab tiga pertanyaan operasional: seberapa CEPAT kita kehabisan budget, SIAPA yang sebenarnya bermasalah (versi model yang mana), dan bagaimana memantau saat trafik terlalu besar untuk mencatat semuanya.",
        "Burn rate: kecepatan menghabiskan error budget. SLO 99,9 persen berarti laju error yang diizinkan 0,1 persen — budget 43,2 menit per bulan. Burn rate sama dengan laju error teramati dibagi laju budget. Burn 1x berarti budget habis tepat di akhir bulan (sesuai rencana). Burn 4,5x berarti budget habis dalam 30 dibagi 4,5 sama dengan 6,7 hari — dan itu alasan untuk PAGE, bukan tiket. Aturan operasional: burn di atas 2x selama 1 jam → page; burn 1 sampai 2x → tiket; burn di bawah 1x → log + review mingguan. Keunggulan burn rate dibanding ambang absolut: ia berbicara dalam bahasa budget ('kita kehabisan uang dalam 6,7 hari'), bukan dalam bahasa angka mentah ('error 45 per jam') yang tidak berarti apa-apa tanpa konteks. Lab berikut menghitungnya: jam pertama 45 error dari 10.000 request (burn 4,5x → PAGE), jam kedua 12 error (burn 1,2x → TIKET).",
        "Monitoring PER VERSI model — bukan agregat. Saat champion (v6) dan challenger (v7) berjalan berdampingan, dashboard agregat bisa menunjukkan akurasi 84 persen yang menenangkan — padahal champion 86 persen dan challenger 79 persen. Challenger yang buruk tersembunyi di dalam rata-rata, dan keputusan promosi diambil dari angka yang salah. Aturan: tiap versi model punya deret metriknya sendiri (PSI, error rate, latensi, distribusi skor) + label versi di setiap baris log dan trace. Tanpa label versi, investigasi insiden menjadi tebak-tebakan ('model yang mana yang menjawab jam 02.14?'). Ini juga prasyarat canary yang jujur (MLOps5): canary 5 persen yang tidak diukur terpisah bukan canary, melainkan undian.",
        "Validasi data DI TITIK SERVING — bukan hanya di training. Kasus DanaKilat dari MLE6 (field jumlah_pengajuan_7hari sama dengan 0 untuk 40 persen request karena bug API partner) tertangkap oleh PSI — tetapi lebih cepat lagi bila ada schema + range check pada request masuk: tolak request yang melanggar kontrak, atau beri default yang benar + alarm missing rate. Contract test dengan upstream (partner API) berjalan di CI dan di serving: bila format berubah, alert berbunyi SEBELUM data rusak masuk ke model. Monitoring input (lapis 1) tanpa validasi di titik masuk = radar yang melihat tetapi tidak bisa menghentikan.",
        "Sampling untuk trafik tinggi. DompetKu memproses 5 juta transaksi per hari — mencatat 100 persen request dengan payload lengkap berarti tagihan storage yang lebih besar dari tagihan serving. Polanya: log 100 persen untuk error dan untuk request yang di-block guardrail, 1 persen acak untuk sukses — lalu estimasi metrik dari sampel beserta interval kepercayaannya (MLE4: lebar interval menyusut dengan akar n). Pengecualian: segmen langka dan bernilai tinggi (transaksi di atas Rp10 juta, nasabah VIP) dicatat 100 persen — sampling buta menghapus justru baris yang paling penting. Dan tutup loop-nya: PSI + burn rate + performa per versi adalah INPUT trigger retraining (MLOps8) — bukan kalender. Monitoring yang tidak pernah memicu aksi adalah dashboard; monitoring yang memicu aksi tercatat adalah sistem.",
      ],
      formula: String.raw`\text{burn} = \frac{\text{laju error teramati}}{\text{laju budget}} \qquad T_{habis} = \frac{30 \text{ hari}}{\text{burn}}`,
      formulaNote: "burn = burn rate error budget; laju budget = 1 − SLO (0,1% untuk SLO 99,9%); T_habis = sisa umur budget bila burn bertahan. Contoh lab: 45 error/10.000 request = 0,45% → burn 4,5x → PAGE, budget habis dalam 6,7 hari; 12 error → burn 1,2x → TIKET.",
      tasks: [
        { id: "t1", text: "Hitung `burn1` dan `burn2` (laju error dibagi laju budget 0,001)" },
        { id: "t2", text: "Tentukan `aksi1` dan `aksi2` ('PAGE' bila burn >= 2, 'TIKET' bila >= 1, else 'LOG')" },
        { id: "t3", text: "Hitung `habis_hari` = umur budget bila burn1 bertahan, cetak semuanya" },
      ],
      expected: "burn_jam1=4.5x -> PAGE  burn_jam2=1.2x -> TIKET  budget_habis_dalam=6.7 hari",
      note: {
        title: "💡 Intuisi: burn rate = speedometer budget",
        type: "pitfall",
        body: "Ambang absolut ('error lebih dari 40 per jam') tidak tahu apakah 40 itu banyak atau sedikit — tergantung SLO dan volume. Burn rate selalu tahu: 4,5x berarti 'dengan kecepatan ini, budget habis minggu depan'. Alert yang berbicara dalam bahasa budget didengar direksi; alert yang berbicara dalam bahasa angka mentah diabaikan.",
      },
      hints: [
        "laju error = errors / reqs; burn = laju error / 0.001.",
        "PAGE bila burn >= 2; TIKET bila burn >= 1; else LOG.",
        "habis_hari = 30 / burn1.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
SLO = 0.999            # laju budget = 1 - SLO = 0,1%
reqs = 10_000          # request per jam
err_jam1, err_jam2 = 45, 12
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: burn rate + aksi + umur budget
laju_budget = 
burn1 = 
burn2 = 
aksi1 = 
aksi2 = 
habis_hari = 

print(f"burn_jam1={burn1:.1f}x -> {aksi1}  burn_jam2={burn2:.1f}x -> {aksi2}  budget_habis_dalam={habis_hari:.1f} hari")`,
        lockLines: 4,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
SLO = 0.999            # laju budget = 1 - SLO = 0,1%
reqs = 10_000          # request per jam
err_jam1, err_jam2 = 45, 12
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: burn rate + aksi + umur budget
laju_budget = 1 - SLO
burn1 = (err_jam1 / reqs) / laju_budget
burn2 = (err_jam2 / reqs) / laju_budget
aksi1 = "PAGE" if burn1 >= 2 else ("TIKET" if burn1 >= 1 else "LOG")
aksi2 = "PAGE" if burn2 >= 2 else ("TIKET" if burn2 >= 1 else "LOG")
habis_hari = 30 / burn1

print(f"burn_jam1={burn1:.1f}x -> {aksi1}  burn_jam2={burn2:.1f}x -> {aksi2}  budget_habis_dalam={habis_hari:.1f} hari")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`burn1` = 4.5",
            "name": "burn1",
            "value": 4.5,
            "tol": 1e-09,
            "msg": "0,45% / 0,1% = 4,5x — budget habis jauh sebelum akhir bulan.",
          },
          {
            "kind": "equal",
            "task": "t1",
            "label": "`burn2` = 1.2",
            "name": "burn2",
            "value": 1.2,
            "tol": 1e-09,
            "msg": "0,12% / 0,1% = 1,2x — di atas budget, belum darurat.",
          },
          {
            "kind": "equal",
            "task": "t3",
            "label": "`habis_hari` ≈ 6.7",
            "name": "habis_hari",
            "value": 6.666666666666667,
            "tol": 0.05,
            "msg": "30 / 4,5 = 6,7 hari bila burn bertahan.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` memvonis PAGE lalu TIKET",
            "pattern": "burn_jam1=4\\.5x -> PAGE\\s+burn_jam2=1\\.2x -> TIKET",
            "msg": "Burn di atas 2x = page; 1–2x = tiket.",
          },
        ],
      },
      reference: "Burn >= 2x = page, 1–2x = tiket, < 1x = log. Metrik per versi model, validasi di serving, sampling 100% error + 1% sukses.",
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
        "API hidup ≠ model sehat; pantau keduanya dengan metrik berbeda.",
        "4 lapis: input (tercepat) → output → performa (terlambat, pasti) → bisnis.",
        "PSI > 0,25 = pergeseran signifikan; bin histogram harus sama untuk keduanya.",
        "Klasifikasi alert: page / tiket / log; tanpa aksi = tanpa alert.",
        "Drift = sinyal investigasi, bukan perintah retrain otomatis.",
        "Burn rate: burn di atas 2x = page, 1–2x = tiket; metrik per versi model, validasi di serving, sampling 100% error + 1% sukses. Kelanjutan dari MLE6 (ME14, monitoring dasar).",
      ],
      next: { label: "MLOps8 — Strategi Retraining", href: "/v2/learn/mlops8-retraining" },
      quiz: [
        {
          q: "Kasus PayLancar: kenapa dashboard hijau 3 bulan padahal rugi naik 34%?",
          options: [
            { text: "Dashboard-nya error", why: "Dashboard benar — uptime dan latensi memang baik." },
            { text: "Yang dipantau hanya kesehatan server, bukan kesehatan model", why: "Tidak ada metrik drift fitur, distribusi skor, atau performa — pertanyaan 'apakah model masih benar' tidak pernah ditanya.", correct: true },
            { text: "Modelnya memang tidak bisa dipantau", why: "Bisa — dengan 4 lapis metrik yang tepat." },
            { text: "Fraud memang tidak terdeteksi", why: "Itu akibatnya, bukan sebabnya. Sebabnya: tidak ada radar." },
          ],
        },
        {
          q: "Kenapa drift input terdeteksi berminggu-minggu sebelum penurunan akurasi?",
          options: [
            { text: "Drift input tidak berhubungan dengan akurasi", why: "Berhubungan — hanya terdeteksi lebih awal." },
            { text: "Distribusi input terukur hari ini; akurasi butuh label matang 30–90 hari", why: "Lapis 1 tidak menunggu kebenaran; lapis 3 menunggunya. Itulah keunggulan radar dini.", correct: true },
            { text: "Akurasi tidak pernah turun karena drift", why: "Justru drift adalah penyebab utama penurunan akurasi diam-diam." },
            { text: "PSI lebih akurat dari akurasi", why: "Bukan soal akurasi metrik — soal kecepatan ketersediaan sinyal." },
          ],
        },
        {
          q: "Lab: fitur mana tersangka utama penurunan performa, dan kenapa?",
          options: [
            { text: "tenor_bulan — PSI 0,006", why: "0,006 = stabil, bukan tersangka." },
            { text: "trx_per_hari — PSI 1,220, jauh di atas ambang 0,25", why: "Pergeseran terbesar = perubahan perilaku paling dramatis. Mulai investigasi dari sini.", correct: true },
            { text: "limit_kartu — PSI 0,277", why: "Juga ALERT, tapi 1,220 jauh lebih besar — prioritas ke yang terbesar." },
            { text: "Semua sama parahnya", why: "0,006 vs 0,277 vs 1,220 — jelas bertingkat." },
          ],
        },
        {
          q: "Alert 'PSI fitur X = 0,15' tanpa runbook, jam 3 pagi. Respons tepat?",
          options: [
            { text: "Bangunkan tim — semua alert penting", why: "0,15 = zona waspada, bukan darurat. Membangunkan orang untuk ini = alert fatigue." },
            { text: "Jangan jadikan alert page; cukup log + review mingguan, dan tulis runbook-nya", why: "Klasifikasi benar: waspada = tren, bukan darurat. Dan alert tanpa runbook seharusnya tidak ada.", correct: true },
            { text: "Abaikan selamanya", why: "Waspada tetap sinyal — dipantau sebagai tren, bukan diabaikan." },
            { text: "Langsung retrain model", why: "Drift = investigasi dulu, bukan perintah retrain." },
          ],
        },
        {
          q: "Kesalahan implementasi PSI yang paling fatal?",
          options: [
            { text: "Memakai 10 bin, bukan 20", why: "Jumlah bin memengaruhi sensitivitas, tapi bukan fatal." },
            { text: "Bin dihitung terpisah untuk baseline dan produksi (rentang beda)", why: "Membandingkan distribusi dengan 'penggaris' berbeda = angka sampah. Bin harus dari rentang gabungan.", correct: true },
            { text: "Lupa menambahkan eps", why: "Penting (hindari log 0) tapi mudah diperbaiki; bukan kesalahan konsep." },
            { text: "Memakai log natural, bukan log10", why: "Basis log hanya mengubah skala, bukan vonis relatif terhadap ambang yang konsisten." },
          ],
        },
        {
          q: "Timmu menerima 120 alert/bulan dengan presisi 12%. Insiden nyata minggu lalu tidak direspons karena channel di-mute. Langkah PERTAMA yang tepat?",
          options: [
            { text: "Tambah lebih banyak metrik agar tidak ada yang lolos", why: "Menambah metrik pada sistem spam = menambah spam. Masalahnya bukan cakupan, melainkan presisi — tim sudah berhenti mendengar." },
            { text: "Naikkan ambang + tambah konfirmasi multi-hari untuk menaikkan presisi page ≥50%", why: "Tepat. Akar masalahnya presisi 12% yang melatih tim mengabaikan. Naikkan ambang berdasarkan data historis + syarat bertahan 3 hari; pisahkan page (pelit) dari tiket/log (longgar).", correct: true },
            { text: "Matikan semua alert selama sebulan agar tim `istirahat`", why: "Mematikan semua = kembali buta total. Yang dimatikan seharusnya false alarm-nya (via ambang), bukan seluruh sistem." },
            { text: "Ganti tool monitoring dengan yang lebih mahal", why: "Tool tidak memperbaiki ambang yang salah. Presisi 12% akan tetap 12% di tool semahal apa pun — ini masalah kalibrasi, bukan lisensi." },
          ],
        },
        {
          q: "SLO 99,9%. Jam pertama: 45 error dari 10.000 request. Jam kedua: 12 error. Tindakan?",
          options: [
            { text: "Jam 1 PAGE (burn 4,5x — budget habis dalam 6,7 hari), jam 2 TIKET (burn 1,2x)", why: "Tepat: burn = laju error / 0,1%. Di atas 2x = page; 1–2x = tiket. Burn rate berbicara dalam bahasa budget.", correct: true },
            { text: "Keduanya PAGE — error apa pun harus membangunkan tim", why: "Jam 2 hanya 1,2x — membangunkan tim untuk itu = alert fatigue yang dibahas Langkah 7." },
            { text: "Keduanya LOG — tunggu sampai akhir bulan", why: "Menunggu = budget habis dalam 6,7 hari tanpa ada yang bertindak. Burn 4,5x adalah darurat." },
            { text: "Naikkan SLO menjadi 99,99% agar burn turun", why: "Menaikkan SLO MEMPERKECIL laju budget (0,1% → 0,01%) sehingga burn NAIK 10x — memperparah keadaan." },
          ],
        },
      ],
    },
  ],
};
