import type { V2Lesson } from "../lib/types";

export const mle6: V2Lesson = {
  slug: "mle6-monitoring",
  track: "Machine Learning Engineer",
  module: "Serving & Operasi",
  title: "MLE6 — Monitoring: Drift & Performance Decay",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Model yang sehat hari ini bisa sakit bulan depan — bukan karena kodenya berubah, melainkan karena dunianya berubah. Lesson ini tentang mendeteksi perubahan itu sebelum merugikan.",
        "Tujuan lesson ini:",
        "• Membedakan data drift, concept drift, dan label drift.",
        "• Menghitung Population Stability Index (PSI) dari nol dan membaca ambangnya.",
        "• Membedakan alarm yang bermakna dari noise (mencegah alert fatigue).",
        "• Merancang dashboard monitoring: apa yang dimonitor di input, output, dan performa.",
        "• Memutuskan kapan me-retrain, kapan investigasi, kapan tidak ngapa-ngapain.",
        "Isi lesson: cerita model yang 'sehat' tapi revenue turun → 3 jenis drift + lab PSI → alarm vs noise + lab → apa yang dimonitor → peta keputusan → mini-case → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Model yang sehat, revenue yang turun",
      prose: [
        "Model prediksi churn sebuah telco 'sehat': akurasi validasi 86%, tidak ada error di log, dashboard hijau semua. Namun revenue turun 9% dalam dua kuartal.",
        "Tim me-retrain model tiga kali dengan data terbaru. Hasilnya: akurasi naik 1 poin, revenue tetap turun. Frustrasi memuncak — sampai seorang analis junior memplot distribusi umur pelanggan.",
        "Twist-nya: distribusi umur bergeser drastis — pandemi mengubah komposisi pelanggan (lebih banyak pelanggan muda digital), tetapi model dilatih di era pelanggan lama. Modelnya tidak rusak; DUNIA-nya yang berubah. Tiga kali retrain sia-sia karena yang dibutuhkan bukan model baru, melainkan pemahaman bahwa perilaku segmen baru berbeda.",
        "Pelajaran: monitoring model BUKAN monitoring akurasi saja. Distribusi input adalah sistem peringatan dini — ia bergeser BERBULAN-BULAN sebelum akurasi ikut jatuh.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'monitoring model = pantau akurasi'",
        type: "pitfall",
        body: "Yang benar: label aktual (untuk hitung akurasi) sering datang berminggu-minggu terlambat (mis. default kredit butuh 90 hari). Menunggu akurasi = menunggu kerugian. Pantau distribusi input/output — ia tersedia detik ini juga.",
      },
    },
    {
      id: "drift",
      eyebrow: "Langkah 3 · Tiga jenis drift",
      title: "Data drift, concept drift, label drift",
      prose: [
        "Data drift (covariate shift): distribusi INPUT berubah, hubungan input→label tetap. Contoh: rata-rata umur pelanggan 35 → 28. Model masih 'benar' secara logika, tetapi beroperasi di wilayah data yang jarang ia lihat saat training.",
        "Concept drift: hubungan INPUT→LABEL berubah. Contoh: pola 'pelanggan muda = loyal' berbalik setelah kompetitor meluncurkan paket murah. Ini yang paling berbahaya — model confidently wrong.",
        "Label drift: distribusi LABEL berubah. Contoh: baseline fraud naik dari 0,7% ke 2% saat serangan terkoordinasi. Threshold yang dikalibrasi untuk 0,7% menjadi tidak optimal.",
        "Population Stability Index (PSI) mengukur data drift per fitur: bandingkan % per bin antara training (expected) dan serving (actual). Ambang industri: < 0,1 stabil; 0,1–0,25 waspada; > 0,25 pergeseran signifikan.",
        "Lab: distribusi umur bergeser (mean bin 4,5 → 5,5), PSI = 0,153 → 'waspada'. Belum darurat, tetapi wajib investigasi — inilah peringatan dini yang menyelamatkan revenue di cerita pembuka.",
        "Drift yang “benar” vs drift yang “salah” — bedakan! Kampanye marketing baru menggeser umur pelanggan 35→28 = drift LEGITIMATE (dunia berubah, model harus adaptasi → retrain). Bug API mengeset field=0 untuk 40% request = drift PATOLOGIS (data rusak, model harus DILINDUNGI → perbaiki pipeline, JANGAN retrain!). Retrain di atas data rusak = mengajarkan model bahwa “0 = normal” — meracuni masa depan. Aturan: investigasi DULU (legitimate vs bug), retrain KEMUDIAN. Urutan ini menyelamatkan modelmu.",
        "PSI vs KS vs Wasserstein — pilih senjatamu. PSI: standar industri, sensitif terhadap bin (pakai 10 bin tetap!). KS (Kolmogorov-Smirnov): tanpa bin, tetapi kurang sensitif di ekor. Wasserstein: intuitif (“biaya memindahkan distribusi”), bagus untuk kontinu. Praktik: PSI untuk monitoring rutin (threshold jelas: 0,1/0,25), KS untuk investigasi ad-hoc. Satu metrik konsisten > tiga metrik berganti-ganti. Konsistensi = tren yang bisa dibandingkan.",
      ],
      formula: String.raw`\text{PSI} = \sum_{b} (\%Aktual_b - \%Ekspektasi_b)\,\ln\frac{\%Aktual_b}{\%Ekspektasi_b}`,
      formulaNote: "PSI (Population Stability Index) = Σ (%Aktual − %Ekspektasi) × ln(%Aktual/%Ekspektasi) per bin; %Aktual = distribusi kini, %Ekspektasi = distribusi saat training. PSI <0,1 = stabil; 0,1–0,25 = waspada (pantau); >0,25 = drift signifikan (investigasi). PSI sensitif terhadap bin — pakai 10 bin konsisten, jangan ubah-ubah.",
      figure: {
        svg: `<svg viewBox="0 0 480 200" role="img" aria-label="% sampel per bin usia: training vs serving">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">% sampel per bin usia: training vs serving</text>
<line x1="46" y1="166.0" x2="466" y2="166.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="170.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.0</text>
<line x1="46" y1="131.0" x2="466" y2="131.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="135.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4.5</text>
<line x1="46" y1="96.0" x2="466" y2="96.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="100.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">9.0</text>
<line x1="46" y1="61.0" x2="466" y2="61.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="65.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">13.5</text>
<line x1="46" y1="26.0" x2="466" y2="26.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="30.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">18.0</text>
<rect x="53.6" y="72.7" width="26.9" height="93.3" fill="var(--c1)" rx="3"/>
<text x="67.0" y="66.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">12</text>
<text x="67.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">b3 tr</text>
<rect x="95.6" y="111.6" width="26.9" height="54.4" fill="var(--c2)" rx="3"/>
<text x="109.0" y="105.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">7</text>
<text x="109.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">b3 sv</text>
<rect x="137.6" y="49.3" width="26.9" height="116.7" fill="var(--c1)" rx="3"/>
<text x="151.0" y="43.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">15</text>
<text x="151.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">b4 tr</text>
<rect x="179.6" y="64.9" width="26.9" height="101.1" fill="var(--c2)" rx="3"/>
<text x="193.0" y="58.9" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">13</text>
<text x="193.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">b4 sv</text>
<rect x="221.6" y="26.0" width="26.9" height="140.0" fill="var(--c1)" rx="3"/>
<text x="235.0" y="20.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">18</text>
<text x="235.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">b5 tr</text>
<rect x="263.6" y="43.1" width="26.9" height="122.9" fill="var(--c2)" rx="3"/>
<text x="277.0" y="37.1" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">15.8</text>
<text x="277.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">b5 sv</text>
<rect x="305.6" y="49.3" width="26.9" height="116.7" fill="var(--c1)" rx="3"/>
<text x="319.0" y="43.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">15</text>
<text x="319.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">b6 tr</text>
<rect x="347.6" y="40.8" width="26.9" height="125.2" fill="var(--c2)" rx="3"/>
<text x="361.0" y="34.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">16.1</text>
<text x="361.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">b6 sv</text>
<rect x="389.6" y="72.7" width="26.9" height="93.3" fill="var(--c1)" rx="3"/>
<text x="403.0" y="66.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">12</text>
<text x="403.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">b7 tr</text>
<rect x="431.6" y="29.1" width="26.9" height="136.9" fill="var(--c2)" rx="3"/>
<text x="445.0" y="23.1" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">17.6</text>
<text x="445.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">b7 sv</text>
<line x1="46" y1="166" x2="466" y2="166" stroke="var(--chart-grid)" stroke-width="1"/>
</svg>`,
        alt: "Bar chart: per bin usia, % training vs % serving bergeser ke kanan.",
        caption: "Cara membaca: tiap pasangan batang = % sampel pada satu bin usia (tr=training, sv=serving). Interpretasi: massa bergeser ke bin kanan — serving menumpuk di usia lebih tua. PSI merangkum seluruh pergeseran ini menjadi satu angka: 0,153 (waspada).",
      },
      tasks: [
        { id: "t1", text: "Bangun distribusi `actual` (proporsi) dari 2000 sampel serving" },
        { id: "t2", text: "Hitung `psi` dan tentukan `verdict` (ambang 0.1 / 0.25)" },
        { id: "t3", text: "Cetak psi dan verdict" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: PSI adalah termometer, bukan diagnosis",
        body: "PSI bilang 'ada yang bergeser', bukan 'apa yang salah'. PSI 0,3 pada fitur 'kode promo' mungkin wajar (kampanye baru); PSI 0,3 pada 'umur' mungkin krisis. Selalu interpretasikan dengan konteks bisnis.",
      },
      hints: [
        "actual = [c/2000 for c in actual_counts] — proporsi, bukan persen!",
        "psi += (a - e) * math.log(a/e), lewati bin dengan a=0 atau e=0.",
        "verdict: >0.25 'drift', >0.1 'waspada', else 'stabil'.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random, math
random.seed(21)
expected = [0.05,0.08,0.12,0.15,0.18,0.15,0.12,0.08,0.05,0.02]
actual_counts = [0]*10
for _ in range(2000):
    b = min(9, max(0, int(random.gauss(5.5, 2.2))))
    actual_counts[b] += 1
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU
actual = 
psi = 0.0
for a, e in zip(actual, expected):
    if a > 0 and e > 0:
        psi += 
verdict = 

print(f"psi={psi:.3f}  verdict={verdict}")`,
        lockLines: 9,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random, math
random.seed(21)
expected = [0.05,0.08,0.12,0.15,0.18,0.15,0.12,0.08,0.05,0.02]
actual_counts = [0]*10
for _ in range(2000):
    b = min(9, max(0, int(random.gauss(5.5, 2.2))))
    actual_counts[b] += 1
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU
actual = [c/2000 for c in actual_counts]
psi = 0.0
for a, e in zip(actual, expected):
    if a > 0 and e > 0:
        psi += (a - e) * math.log(a/e)
verdict = "drift" if psi > 0.25 else ("waspada" if psi > 0.1 else "stabil")

print(f"psi={psi:.3f}  verdict={verdict}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t2",
            "label": "`psi` ≈ 0.153",
            "name": "psi",
            "value": 0.1532177508555593,
            "tol": 0.005,
            "msg": "PSI dalam proporsi (0-1). 0.153 = zona waspada.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` memvonis waspada",
            "pattern": "verdict=waspada",
            "msg": "0.1 < 0.153 < 0.25 → 'waspada'.",
          },
        ],
      },
      reference: "math.log = ln (natural log). PSI memakai proporsi, bukan persen.",
    },
    {
      id: "alarm",
      eyebrow: "Langkah 4 · Alarm vs noise",
      title: "Sembilan alarm palsu vs dua alarm yang benar",
      prose: [
        "Monitoring tanpa disiplin alarm menghasilkan alert fatigue: tim menerima 50 notifikasi sehari, semuanya diabaikan — termasuk yang benar. Alarm yang selalu diabaikan sama dengan tidak ada alarm.",
        "Teknik anti-noise: (1) smoothing — alarm hanya jika rata-rata 3 hari melewati ambang, bukan satu titik; (2) multi-window — cek anomali 1 jam DAN 1 hari (spike sesaat vs tren); (3) deadband — butuh 2 pelanggaran berurutan sebelum berbunyi.",
        "Lab: metrik akurasi harian 30 hari dengan 1 degradasi nyata (hari 20–22). Alarm naif (tiap titik < 0,775) berbunyi 9 kali — 7 di antaranya noise. Alarm dengan smoothing 3-hari berbunyi 2 kali — tepat pada degradasi nyata.",
        "Cara membaca: alarm bukan tujuan; alarm adalah BIAYA perhatian. Setiap false alarm menggerogoti kepercayaan tim pada sistem monitoring.",
        "Contoh angka anti-noise. Tanpa smoothing: 50 notifikasi/hari, 48 false alarm → tim mute channel → 2 alarm benar HILANG (termasuk yang Rp187 juta). Dengan smoothing 3-hari + deadband: 4 notifikasi/hari, 3 benar → tim membaca semuanya. False alarm bukan “gangguan kecil” — ia adalah RACUN yang membunuh kepercayaan pada SEMUA alarm. Satu false alarm = satu langkah menuju “mute channel”. Desain alarm seperti desain obat: dosis tepat, efek samping minimal.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `naive`: jumlah hari dengan metrik < 0.775" },
        { id: "t2", text: "Hitung `smooth`: rata-rata 3-hari, lalu hitung pelanggarannya" },
        { id: "t3", text: "Cetak keduanya dan `hemat` = naive - smooth" },
      ],
      expected: "",
      note: {
        title: "🚨 Mitos: 'semakin sensitif alarm semakin aman'",
        type: "pitfall",
        body: "Yang benar: alarm hipersensitif dibunuh oleh manusia (di-mute). Keamanan datang dari alarm yang DIPERCAYA — sedikit, tajam, dan selalu ditindaklanjuti.",
      },
      hints: [
        "naive = sum(1 for m in metric if m < 0.775).",
        "smooth = [sum(metric[i:i+3])/3 for i in range(28)].",
        "hemat = naive - smooth.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random
random.seed(30)
metric = [0.80 + random.gauss(0, 0.02) for _ in range(30)]
for i in (19, 20, 21):
    metric[i] -= 0.05   # degradasi NYATA hari 20-22
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU
naive = 
smooth = 
smooth_alarm = 
hemat = 

print(f"alarm_naif={naive}  alarm_smooth={smooth_alarm}  hemat={hemat}")`,
        lockLines: 7,
        solution: `# === SEED TERKUNCI: jangan ubah blok berikut ===
import random
random.seed(30)
metric = [0.80 + random.gauss(0, 0.02) for _ in range(30)]
for i in (19, 20, 21):
    metric[i] -= 0.05   # degradasi NYATA hari 20-22
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU
naive = sum(1 for m in metric if m < 0.775)
smooth = [sum(metric[i:i+3])/3 for i in range(28)]
smooth_alarm = sum(1 for m in smooth if m < 0.775)
hemat = naive - smooth_alarm

print(f"alarm_naif={naive}  alarm_smooth={smooth_alarm}  hemat={hemat}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`naive` = 9 alarm",
            "name": "naive",
            "value": 9,
            "tol": 1e-09,
            "msg": "9 hari di bawah 0.775 — mayoritas noise.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`smooth_alarm` = 2",
            "name": "smooth_alarm",
            "value": 2,
            "tol": 1e-09,
            "msg": "Smoothing menyisakan 2 window — tepat pada degradasi nyata.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan penghematan",
            "pattern": "hemat=7",
            "msg": "9 − 2 = 7 false alarm dihemat.",
          },
        ],
      },
      reference: "Smoothing = rata-rata bergerak. Noise acak saling meniadakan; sinyal nyata bertahan.",
    },
    {
      id: "apa",
      eyebrow: "Langkah 5 · Apa yang dimonitor",
      title: "Empat lapisan monitoring",
      prose: [
        "Lapisan 1 — Input: distribusi fitur (PSI per fitur penting), missing rate, range violation, volume data. Ini peringatan dini tercepat.",
        "Lapisan 2 — Output: distribusi prediksi (apakah % 'fraud' tiba-tiba 10x lipat?), confidence rata-rata. Perubahan output tanpa perubahan input = sinyal concept drift.",
        "Lapisan 3 — Performa: akurasi/precision/recall begitu label tersedia; proxy metric sementara (mis. tingkat dispute pelanggan). Ekspektasikan jeda label berminggu-minggu.",
        "Lapisan 4 — Infra: latency p99, error rate, throughput, biaya per prediksi. Model 'benar' yang lambat atau mahal tetap gagal.",
        "Golden rule: setiap lapisan punya owner dan runbook ('jika alarm X, lakukan Y dalam Z menit'). Alarm tanpa runbook = notifikasi kecemasan, bukan sistem.",
        "Lapisan 3 — Bisnis: metrik yang DIBAYAR. Approval rate, konversi, NPL, revenue per pengguna. Lapisan 1–2 (input/output) = INDIKATOR; lapisan 3 = TUJUAN. Model bisa “sehat” di lapisan 1–2 tetapi revenue turun (kasus telco!) — karena yang berubah = DUNIA (concept drift), bukan data. Monitor ketiganya; yang menentukan “baik/buruk” = lapisan 3. Dashboard tanpa metrik bisnis = speedometer tanpa tujuan.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: monitor seperti dokter UGD — triase dulu",
        body: "Input = tanda vital (cepat, murah, selalu tersedia). Performa = lab darah (akurat, lambat, mahal). Dokter yang baik tidak menunggu hasil lab untuk memeriksa nadi.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Drift terdeteksi — sekarang apa?",
      prose: [
        "Skenario 1 — PSI 0,15 pada satu fitur, performa stabil → investigasi ringan, catat, pantau mingguan. Alasan: waspada ≠ darurat; retrain buta membuang biaya.",
        "Skenario 2 — PSI > 0,25 pada banyak fitur + proxy metric turun → investigasi mendalam: apakah pergeseran legitimate (kampanye baru) atau data rusak (pipeline bug)? Alasan: retrain di atas data rusak = melestarikan bug.",
        "Skenario 3 — Concept drift terkonfirmasi (hubungan berubah) → retrain dengan data baru + validasi ulang penuh. Alasan: model lama secara struktural sudah salah.",
        "Skenario 4 — Drift musiman yang berulang (lebaran, akhir tahun) → JANGAN retrain panik; bangun model yang sadar musiman atau terima fluktuasi sebagai normal. Alasan: retrain tiap musim = overfit pada kalender.",
        "Aturan praktis 10 detik: (1) Apakah drift-nya legitimate atau bug? (2) Apakah performa ikut turun? (3) Apakah polanya permanen atau musiman? Jawaban menentukan: pantau / perbaiki data / retrain / terima.",
      ],
      tasks: [
      ],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Pinjol DanaKilat: PSI 0,31 di tengah malam",
      prose: [
        "Jam 02.14, alarm berbunyi: PSI fitur `jumlah_pengajuan_7hari` = 0,31 (drift signifikan). Di saat yang sama, approval rate naik dari 34% ke 61% dalam 6 jam.",
        "Investigasi pagi harinya: bukan perubahan perilaku nasabah — melainkan bug di API partner yang mengirim `jumlah_pengajuan_7hari = 0` untuk 40% request (field kosong di-default 0). Model membaca '0 pengajuan' sebagai 'nasabah sangat aman' dan meloloskan hampir semua.",
        "Kerugian 6 jam: 1.900 pengajuan berisiko tinggi lolos, estimasi eksposur Rp4,7 miliar. Jika alarm diabaikan (alert fatigue), kerugian berlanjut berhari-hari.",
        "Pertanyaan: (a) Ini drift jenis apa? (b) Lapisan monitoring mana yang menangkapnya pertama? (c) Perbaikan sistemik apa yang mencegah terulang?",
        "Pembahasan: (a) Data drift akibat BUG — distribusi input berubah bukan karena dunia berubah. (b) Lapisan input (PSI per fitur) + lapisan output (approval rate anomali) — keduanya tersedia real-time, jauh sebelum label default muncul 90 hari kemudian. (c) Data validation di serving (tolak/default yang benar untuk field kosong + alarm missing rate), contract test dengan partner API, dan runbook: 'PSI > 0,25 tengah malam → page on-call, bukan tunggu pagi'.",
        "Timeline insiden — pelajaran waktu respons. 02.14 alarm PSI 0,31. 02.15 auto-triage: cek volume data (normal?) → cek missing rate (40% field=0!) → klasifikasi: PATOLOGIS (bug, bukan drift). 02.20 traffic ke model di-pause otomatis (circuit breaker), fallback ke aturan manual. 09.00 tim datang: model AMAN (tidak sempat belajar dari data rusak), bug API diperbaiki. Tanpa monitoring: model retrain Senin pagi di atas data rusak → 2 pekan keputusan kacau. Monitoring = bukan “dashboard cantik”, melainkan RANTAI RESPON OTOMATIS.",
        "False alarm yang HAMPIR terjadi — pelajaran. PSI 0,31 + approval naik = terlihat seperti “pelanggan mengajukan lebih banyak” (kabar baik?). Auto-triage yang benar: cek missing rate DULU (40% field=0!) → klasifikasi PATOLOGIS dalam 1 menit. Tanpa auto-triage: analis melihat “approval naik” → senang → 6 jam kemudian sadar → model sudah “belajar” pola rusak? Tidak — circuit breaker menghentikan traffic ke model di menit ke-6. Rantai: DETEKSI (1 menit) → KLASIFIKASI (1 menit) → AKSI (4 menit). Total 6 menit vs 6 jam. Otomatisasi triage = bukan kemewahan, melainkan KEBUTUHAN untuk respons menit.",
      ],
      tasks: [
      ],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah.",
        "Refleksi monitoring: tiga lapisan (input → output → bisnis), tiga alat (PSI, alarm anti-noise, auto-triage), satu prinsip (investigasi DULU, retrain KEMUDIAN). Dan satu ritual: REVIEW ALARM MINGGUAN — 30 menit, lihat semua alarm pekan ini, tanya “mana yang noise? mana yang terlewat?”. Monitoring tanpa review = kamera CCTV yang tidak ada yang menonton. Ritual > tooling.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Rata-rata umur pelanggan 35 → 28, tetapi hubungan umur→churn tetap. Ini…",
          options: [
            {
              text: "Concept drift",
              why: "Concept drift = hubungannya yang berubah; di sini hubungannya tetap.",
            },
            {
              text: "Data drift",
              why: "Tepat: distribusi input berubah, hubungan input→label tetap.",
              correct: true,
            },
            {
              text: "Label drift",
              why: "Label drift = distribusi label yang berubah.",
            },
            {
              text: "Tidak ada drift",
              why: "Distribusinya jelas bergeser — itu drift.",
            },
          ],
        },
        {
          q: "PSI = 0,31 pada fitur penting. Tindakan pertama?",
          options: [
            {
              text: "Langsung retrain model",
              why: "Retrain di atas data yang mungkin rusak = melestarikan bug.",
            },
            {
              text: "Investigasi: pergeseran legitimate atau bug data?",
              why: "Tepat: penyebab menentukan obat — bug diperbaiki, pergeseran legitimate baru dipertimbangkan retrain.",
              correct: true,
            },
            {
              text: "Abaikan, nanti juga kembali",
              why: "0,31 adalah drift signifikan; mengabaikan = mini-case DanaKilat.",
            },
            {
              text: "Matikan model",
              why: "Terlalu drastis sebelum tahu penyebabnya; cek dulu.",
            },
          ],
        },
        {
          q: "Kenapa akurasi bukan metrik monitoring utama?",
          options: [
            {
              text: "Akurasi tidak penting",
              why: "Akurasi penting, tetapi labelnya datang terlambat berminggu-minggu.",
            },
            {
              text: "Label aktual datang terlambat; distribusi input tersedia real-time",
              why: "Tepat: menunggu label = menunggu kerugian. Input adalah peringatan dini.",
              correct: true,
            },
            {
              text: "Akurasi sulit dihitung",
              why: "Bukan soal sulit, melainkan soal waktu ketersediaan label.",
            },
            {
              text: "Drift tidak memengaruhi akurasi",
              why: "Drift justru sering mendahului penurunan akurasi.",
            },
          ],
        },
        {
          q: "Alarm berbunyi 50x sehari dan semuanya diabaikan tim. Diagnosis?",
          options: [
            {
              text: "Tim malas",
              why: "Menyalahkan manusia mengabaikan desain sistem yang buruk.",
            },
            {
              text: "Alert fatigue — alarm butuh anti-noise (smoothing, deadband)",
              why: "Tepat: alarm yang tak dipercaya = tak ada alarm. Kurangi noise, naikkan kepercayaan.",
              correct: true,
            },
            {
              text: "Butuh lebih banyak alarm",
              why: "Menambah alarm memperparah fatigue.",
            },
            {
              text: "Monitoring tidak berguna",
              why: "Monitoringnya berguna; desain alarmnya yang gagal.",
            },
          ],
        },
        {
          q: "Approval rate naik 34% → 61% dalam 6 jam tanpa perubahan model. Sinyal apa?",
          options: [
            {
              text: "Model makin pintar",
              why: "Model tidak berubah — yang berubah adalah input atau dunia.",
            },
            {
              text: "Anomali output — investigasi distribusi input segera",
              why: "Tepat: perubahan output mendadak tanpa perubahan model = sinyal kuat masalah input.",
              correct: true,
            },
            {
              text: "Keberuntungan",
              why: "Lompatan 27 poin dalam 6 jam bukan keberuntungan.",
            },
            {
              text: "Butuh retrain",
              why: "Investigasi dulu — bisa jadi bug data seperti kasus DanaKilat.",
            },
          ],
        },
      ],
      summary: [
        "Data drift: input berubah; concept drift: hubungan berubah; label drift: baseline berubah.",
        "PSI: < 0,1 stabil; 0,1–0,25 waspada; > 0,25 drift signifikan.",
        "Pantau input/output (real-time) — jangan tunggu label (berminggu-minggu).",
        "Alarm butuh anti-noise: smoothing, multi-window, deadband.",
        "Alarm tanpa runbook dan owner = notifikasi kecemasan.",
        "Retrain hanya setelah memastikan drift legitimate, bukan bug data.",
      ],
      next: { label: "MLE7 — Testing untuk ML", href: "/v2/learn/mle7-testing" },
    },
  ],
};
