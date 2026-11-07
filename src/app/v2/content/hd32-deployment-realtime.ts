import type { V2Lesson } from "../lib/types";

// ── Figure: skor NEWS2 sederhana vs waktu + ambang + kejadian ─────────────
const NEWS_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Grafik garis skor NEWS2 sederhana dari t0 sampai t11 dengan ambang alert 5 dan kejadian klinis di t7">
<line x1="60" y1="139.3" x2="456" y2="139.3" stroke="var(--c3)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="452" y="131" text-anchor="end" font-size="11" fill="var(--c3)" font-family="var(--font-ui)">ambang alert (≥ 5)</text>
<line x1="312" y1="30" x2="312" y2="200" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="4 4"/>
<text x="316" y="42" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">kejadian klinis t=7</text>
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="30" x2="60" y2="200"/>
<line x1="60" y1="200" x2="456" y2="200"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">
<text x="50" y="204" text-anchor="end">0</text>
<text x="50" y="143" text-anchor="end">5</text>
<text x="50" y="83" text-anchor="end">10</text>
<text x="50" y="34" text-anchor="end">14</text>
<text x="60" y="218" text-anchor="middle">0</text>
<text x="132" y="218" text-anchor="middle">2</text>
<text x="204" y="218" text-anchor="middle">4</text>
<text x="276" y="218" text-anchor="middle">6</text>
<text x="348" y="218" text-anchor="middle">8</text>
<text x="420" y="218" text-anchor="middle">10</text>
</g>
<polyline points="60,200 96,200 132,200 168,187.9 204,139.3 240,139.3 276,90.7 312,78.6 348,54.3 384,42.1 420,30 456,30" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<g fill="var(--c1)">
<circle cx="60" cy="200" r="3.5"/><circle cx="96" cy="200" r="3.5"/><circle cx="132" cy="200" r="3.5"/><circle cx="168" cy="187.9" r="3.5"/><circle cx="204" cy="139.3" r="3.5"/><circle cx="240" cy="139.3" r="3.5"/><circle cx="276" cy="90.7" r="3.5"/><circle cx="312" cy="78.6" r="3.5"/><circle cx="348" cy="54.3" r="3.5"/><circle cx="384" cy="42.1" r="3.5"/><circle cx="420" cy="30" r="3.5"/><circle cx="456" cy="30" r="3.5"/>
</g>
<circle cx="204" cy="139.3" r="7" fill="none" stroke="var(--c2)" stroke-width="2"/>
<text x="204" y="162" text-anchor="middle" font-size="11" fill="var(--c2)" font-family="var(--font-ui)">alert pertama t=4</text>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="470" y="252">data sintetis</text>
</g>
<text x="60" y="22" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Skor NEWS2 sederhana vs waktu (interval 15 menit)</text>
</svg>`;

export const hd32: V2Lesson = {
  slug: "hd32-deployment-realtime",
  track: "Health Data Science",
  module: "Tooling & Tata Kelola Data",
  title: "Deployment Real-Time: Streaming & Alert Klinis",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Sistem yang menyelamatkan — lalu dibisukan",
      prose: [
        "RS Harapan Bangsa memasang early warning system di bangsal rawat inap: setiap 15 menit, skor risiko deteriorasi dihitung dari tanda vital, dan perawat mendapat alert bila skor melewati ambang. Bulan pertama luar biasa — tim rapid response tiba 40 menit SEBELUM seorang pasien kolaps; nyawanya terselamatkan. Direksi memuji “AI rumah sakit”. Lalu bulan ketiga: sistem mengirim 300 alert, hanya 12 yang berujung intervensi nyata. Perawat mulai mengabaikan bunyi alert — “paling-paling false alarm lagi”. Bulan keempat, satu alert yang benar-benar gawat tenggelam di antara 40 alert palsu hari itu. Pasien masuk ICU terlambat dua jam.",
        "Twist-nya: modelnya tidak pernah rusak. Di data retrospektif, akurasinya tetap 90%+. Yang rusak adalah DEPLOYMENT-nya: ambang yang disetel di data historis yang sudah bersih, tanpa rencana menangani alert fatigue, tanpa monitoring apakah alert masih dikerjakan manusia. Sistem yang sama — model yang sama, data yang sama — berubah dari penyelamat menjadi pajangan yang dibisukan. Deployment real-time di kesehatan bukan masalah modeling; ia masalah operasi: latensi, ambang, kelelahan manusia, dan kegagalan yang senyap.",
        "Lesson ini mengajarkan perbedaan batch vs streaming untuk data kesehatan, cara kerja early warning score (NEWS2) sebagai “model” yang sudah terdeploy di mana-mana, anatomi kegagalan senyap pipeline klinis, dan cara memonitor sistem live agar tetap dipercaya.",
      ],
      tasks: [],
      note: {
        title: "Kenapa deployment adalah skill analis kesehatan 2026",
        type: "risk",
        body: "Lowongan analis kesehatan kini meminta “pengalaman deploy model ke produksi” — bukan sekadar “bisa bikin model”. Alasannya persis cerita di atas: 90% model kesehatan mati di tahap deployment, bukan di tahap training. Analis yang paham streaming, ambang, alert fatigue, dan monitoring adalah jembatan langka antara tim data science dan tim klinis — dan jembatan seperti itu dibayar mahal karena kegagalannya berujung nyawa, bukan sekadar angka.",
      },
      reference: "Model yang sama bisa menyelamatkan atau dibisukan — pembedanya adalah deployment, bukan akurasi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) memutuskan kapan data kesehatan butuh streaming vs cukup batch; (2) menghitung early warning score (NEWS2 sederhana) dari tanda vital dan menentukan alert; (3) mengidentifikasi empat kegagalan senyap pipeline klinis dan cara mendeteksinya; (4) merancang monitoring minimal untuk sistem alert live (termasuk mengukur alert fatigue).",
        "Rutenya: cerita → tujuan + bekal → tiga konsep (batch vs streaming, NEWS2, kegagalan senyap & monitoring) → lab Python (simulasi stream vital → skor NEWS2 → alert + lead time) → chart skor vs waktu dengan panduan baca → peta keputusan → mini-case deploy EWS di IGD → kuis → rangkuman. Estimasi 65 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, tanda vital normal: nadi 60–100, SpO2 ≥95%, laju napas 12–20, sistolik 90–120, suhu 36,5–37,5 — skor NEWS2 mengukur seberapa jauh tiap parameter menyimpang. Kedua, trade-off sensitivitas vs spesifisitas: ambang rendah menangkap semua kasus (sensitif) tetapi membanjiri false alarm; ambang tinggi hemat alarm tetapi melewatkan kasus. Ketiga, PPV akan dipakai di lab konsep: proporsi alert yang benar-benar berujung kejadian.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: bedakan “model” dari “sistem”. Model = fungsi matematika (skor dari vital). Sistem = model + data pipeline + ambang + manusia yang merespons + monitoring. Cerita pembuka adalah sistem yang gagal dengan model yang sehat — dan 90% kegagalan produksi memang di lapisan sistem.",
      ],
      reference: "Bekal: (1) rentang vital normal; (2) ambang rendah = sensitif tetapi berisik; (3) PPV = proporsi alert yang benar.",
    },
    {
      id: "konsep-batch-stream",
      eyebrow: "Langkah 3 · Konsep",
      title: "Batch vs streaming — kapan kesehatan butuh “sekarang”",
      prose: [
        "Definisi: batch = data dikumpulkan lalu diproses berkala (harian/mingguan) — mis. laporan mutu, klaim, surveilans rutin. Streaming = data diproses saat tiba, mendekati real-time — mis. monitor tanda vital, alert deteriorasi, deteksi wabah dari kunjungan IGD. Pembedanya bukan teknologi, melainkan pertanyaan: “berapa lama keterlambatan yang masih bisa ditoleransi keputusan ini?”",
        "Kepribadiannya: batch adalah pos — murah, terjadwal, cocok untuk surat biasa (laporan bulanan). Streaming adalah telepon — mahal, instan, untuk kabar darurat (pasien memburuk). Kesalahan klasik ada dua arah: memakai pos untuk kabar darurat (laporan deteriorasi mingguan = pasien sudah kolaps duluan), dan memakai telepon untuk surat biasa (streaming untuk metrik mutu bulanan = membayar mahal untuk noise). Arsitektur yang benar hampir selalu hybrid: streaming untuk yang time-critical, batch untuk sisanya.",
        "Anatomi latensi — total waktu dari kejadian ke respons = latensi data (sensor → sistem, mis. 1 menit) + latensi komputasi (hitung skor, mis. detik) + latensi manusia (perawat melihat & merespons, mis. 5–15 menit). Pelajaran penting: di sistem klinis, latensi manusia biasanya DOMINAN — mengoptimasi komputasi dari 2 detik ke 0,5 detik tidak ada artinya bila perawat baru merespons 20 menit kemudian karena kebanjiran alert. Optimasi dimulai dari bottleneck terbesar, dan bottleneck-nya hampir selalu manusia.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Real-time selalu lebih baik — kejar latensi sekecil mungkin”",
        type: "pitfall",
        body: "Yang benar: real-time hanya sebaik keputusan yang diambil darinya. Streaming tanda vital tanpa protokol respons yang jelas hanya menghasilkan “pengetahuan real-time tentang bencana yang tetap terjadi”. Sebelum membangun streaming, jawab dulu: siapa yang menerima alert, dalam berapa menit harus merespons, dan apa yang ia lakukan setelahnya. Tanpa tiga jawaban ini, streaming adalah teater teknologi.",
      },
      hints: [
        "💡 Intuisi: hitung “anggaran latensi” dari ujung keputusan, bukan dari ujung data. Butuh respons dalam 15 menit? Maka data 5 menit + komputasi 1 menit + respons manusia 9 menit = pas. Anggaran inilah yang menentukan arsitektur — bukan sebaliknya.",
      ],
      reference: "Batch = surat (murah, terjadwal). Streaming = telepon (mahal, darurat). Latensi total = data + komputasi + manusia — manusia biasanya dominan.",
    },
    {
      id: "konsep-news2",
      eyebrow: "Langkah 4 · Konsep",
      title: "NEWS2 — “model” yang sudah terdeploy di mana-mana",
      prose: [
        "Definisi: NEWS2 (National Early Warning Score 2) adalah sistem skoring deteriorasi pasien berbasis tanda vital: tiap parameter (laju napas, SpO2, suhu, tekanan sistolik, nadi, kesadaran) diberi skor 0–3 berdasar seberapa jauh dari normal; total 0–20+. Ambang umum: ≥5 = waspada (review segera), ≥7 = gawat (tim rapid response). Ini adalah “model machine learning” versi 2017 yang tidak butuh GPU — hanya tabel dan penjumlahan.",
        "Kepribadiannya: NEWS2 adalah satpam tua yang tidak pernah tidur. Ia tidak pintar — ia hanya konsisten: setiap 15 menit memeriksa enam hal yang sama dengan aturan yang sama, tanpa lelah, tanpa bias, tanpa “feeling”. Kelebihannya justru kesederhanaannya: perawat bisa menghitung manual saat sistem mati, aturannya bisa dijelaskan dalam 5 menit, dan tidak ada yang perlu ditakuti dari “kotak hitam”. Inilah kenapa ia terdeploy di ribuan RS sementara model deep learning yang lebih akurat masih jadi paper.",
        "Kapan dipakai & keterbatasannya: NEWS2 untuk skrining deteriorasi umum di bangsal/IGD — BUKAN diagnosis. Ia buta terhadap konteks (pasien COPD kronis selalu “skor tinggi” karena SpO2 baseline rendah — ada penyesuaian skala 2 khusus). Pelajaran deployment-nya: model sederhana yang DIPAKAI mengalahkan model canggih yang diabaikan. Adopsi = akurasi × kepercayaan × kemudahan — dan NEWS2 menang di dua faktor terakhir.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Skor tinggi = pasien pasti memburuk, skor rendah = aman”",
        type: "pitfall",
        body: "Yang benar: NEWS2 adalah SKRINING, bukan vonis. Skor tinggi berarti “periksa sekarang”, bukan “pasti kolaps” — sebagian besar alert adalah false positive, dan itu BY DESIGN (lebih baik memeriksa 10 yang sehat daripada melewatkan 1 yang gawat). Sebaliknya skor rendah bukan jaminan aman — ia buta terhadap nyeri dada khas infark yang vitalnya masih normal di menit-menit awal. Skor mendukung penilaian klinis, tidak menggantikannya.",
      },
      hints: [
        "💡 Intuisi: anggap NEWS2 seperti alarm asap — ia berbunyi saat mencium asap, bukan saat memastikan kebakaran. Alarm asap yang sesekali false alarm tetap dipasang di semua rumah; yang dicabut baterainya karena “berisik” adalah rumah yang terbakar tanpa peringatan.",
      ],
      reference: "NEWS2 = 6 parameter × skor 0–3. ≥5 waspada, ≥7 gawat. Skrining, bukan diagnosis. Sederhana + dipakai > canggih + diabaikan.",
    },
    {
      id: "konsep-gagal-senyap",
      eyebrow: "Langkah 5 · Konsep",
      title: "Kegagalan senyap & monitoring — saat sistem mati tanpa berteriak",
      prose: [
        "Definisi kegagalan senyap: pipeline berhenti menghasilkan alert BENAR tanpa error yang terlihat — dashboard tetap hijau karena “tidak ada alert”, padahal sensor terputus. Empat pola klasik di kesehatan: (1) sensor disconnect — SpO2 macet di 97% selama 6 jam (angka “sempurna” yang justru mencurigakan); (2) clock skew — timestamp beda 20 menit antar sistem sehingga “real-time” sebenarnya basi; (3) missing-as-zero — data kosong dibaca sebagai 0 (nadi 0 = mati, tetapi sistem mengira sensor error dan melewatkannya); (4) drift populasi — model dilatih di bangsal bedah, dipakai di bangsal anak: distribusi vitalnya beda, skornya meleset diam-diam.",
        "Kepribadiannya: kegagalan senyap adalah kebocoran gas — tidak terlihat, tidak berbau, mematikan. Sistem yang berteriak saat error (exception, crash) sebenarnya lebih aman daripada sistem yang diam-diam berhenti bekerja. Karena itu pipeline klinis butuh “detektor gas”: heartbeat monitor (apakah data mengalir?), validasi rentang (apakah nilainya masuk akal?), dan audit alert (apakah alert masih dikerjakan manusia?).",
        "Monitoring minimal yang wajib ada: (1) freshness — umur data terakhir < ambang (mis. 20 menit); (2) volume — jumlah alert per shift dalam rentang wajar (0 alert seminggu = sensor mati ATAU ambang terlalu tinggi); (3) PPV berkala — proporsi alert yang berujung intervensi nyata, dihitung tiap bulan; (4) override rate — seberapa sering klinisi mengabaikan alert (proxy alert fatigue). Empat metrik ini adalah “vital sign” untuk sistemmu — sistem monitoring kesehatan butuh dipantau kesehatannya juga.",
      ],
      formula: String.raw`\text{PPV} = \frac{\text{TP}}{\text{TP} + \text{FP}}`,
      formulaNote: "PPV = Positive Predictive Value (nilai prediksi positif): proporsi alert yang benar-benar berujung kejadian/intervensi. TP = true positive (alert benar, mis. 12), FP = false positive (alert palsu, mis. 288). Contoh cerita pembuka: PPV = 12/(12+288) = 12/300 = 0,04 (4%) — dari 25 alert hanya 1 yang nyata. Inilah angka yang menjelaskan kenapa perawat membisukan sistem: PPV 4% berarti 96% pekerjaannya sia-sia. Target operasional realistis: PPV 15–30% untuk alert klinis (lebih tinggi sulit tanpa mengorbankan sensitivitas).",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Tidak ada alert = semua baik-baik saja”",
        type: "pitfall",
        body: "Yang benar: tidak ada alert bisa berarti (a) memang tidak ada yang memburuk, ATAU (b) pipeline mati diam-diam. Keduanya terlihat identik di dashboard. Inilah kenapa freshness monitor wajib: sistem yang sehat membuktikan dirinya hidup dengan “detak jantung” data yang mengalir — bukan dengan keheningan. Aturan: alert nol selama 24 jam di bangsal aktif = insiden yang harus diselidiki, bukan kabar baik.",
      },
      hints: [
        "💡 Intuisi kedua: ukur PPV seperti mengukur demam — berkala dan ditindaklanjuti. PPV yang turun dari 25% ke 8% dalam 3 bulan adalah diagnosis: ambang terlalu rendah, populasi berubah, atau fatigue membuat perawat menunda respons sehingga “intervensi nyata” tercatat lebih sedikit. Angka ini berbicara; dengarkan.",
      ],
      reference: "Kegagalan senyap: sensor macet, clock skew, missing-as-zero, drift. Monitoring: freshness, volume, PPV, override rate.",
    },
    {
      id: "lab-stream",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Simulasi stream vital → skor NEWS2 → alert",
      prose: [
        "Waktunya menjadi engineer sistem alert. Di bawah ada stream SINTETIS tanda vital satu pasien selama 12 interval (15 menit): nadi, SpO2, laju napas, sistolik, suhu, kesadaran. Tugasmu: implementasikan tabel skoring NEWS2 sederhana, hitung skor tiap interval, tentukan alert pertama (skor ≥ 5), dan hitung lead time terhadap kejadian klinis yang dikonfirmasi di t=7.",
        "Coba: setelah lolos, naikkan ambang menjadi 7 — kapan alert pertama muncul dan berapa lead time-nya? Lalu turunkan menjadi 3 — apa yang terjadi dengan jumlah alert? Inilah trade-off ambang yang kamu baca di konsep: tidak ada ambang yang benar secara absolut, hanya ambang yang sesuai dengan kapasitas respons timmu.",
      ],
      tasks: [
        { id: "t1", text: "Isi fungsi `skor_news2(hr, spo2, rr, sbp, temp, sadar)` sesuai tabel (lihat komentar)" },
        { id: "t2", text: "Isi `skor` = list skor tiap interval dari `stream`" },
        { id: "t3", text: "Isi `alert_pertama` = indeks t pertama dengan skor ≥ 5, dan `n_alert` = jumlah interval dengan alert" },
        { id: "t4", text: "Isi `lead_menit` = (7 − alert_pertama) × 15 dan cetak ringkasan" },
      ],
      expected: "skor NEWS2: 0, 0, 0, 1, 5, 5, 9, 10, 12, 13, 14, 14\nalert pertama: t=4 (skor 5)\nlead time vs kejadian t=7: 45 menit\ntotal alert: 8 dari 12 interval",
      code: {
        starter: `# Stream SINTETIS: (t, nadi, spo2, laju_napas, sistolik, suhu, sadar_penuh)
stream = [
    (0, 78, 97, 16, 120, 36.8, True), (1, 82, 97, 17, 118, 36.9, True),
    (2, 88, 96, 18, 115, 37.0, True), (3, 95, 96, 20, 112, 37.2, True),
    (4, 102, 95, 22, 108, 37.5, True), (5, 110, 94, 23, 105, 37.8, True),
    (6, 118, 93, 24, 100, 38.2, True), (7, 125, 92, 26, 95, 38.5, True),
    (8, 130, 91, 28, 90, 38.8, True), (9, 135, 90, 30, 88, 39.0, True),
    (10, 140, 89, 32, 85, 39.2, True), (11, 142, 88, 33, 82, 39.4, True),
]
AMBANG, T_KEJADIAN, INTERVAL_MNT = 5, 7, 15

def skor_news2(hr, spo2, rr, sbp, temp, sadar):
    # Tabel SINTETIS (disederhanakan dari NEWS2):
    # napas: <=8/>=25:3; 9-11:1; 21-24:2; 12-20:0
    # spo2: <=91:3; 92-93:2; 94-95:1; >=96:0
    # sistolik: <=90/>=220:3; 91-100:2; 101-110:1; 111-219:0
    # nadi: <=40/>=131:3; <=50/>=111:2; 51-90:0; sisanya:1
    # suhu: <=35.0/>=39.1:2; <=36.0/>=38.1:1; 36.1-38.0:0
    # sadar: penuh 0, tidak penuh 3
    s = 0
    # TULIS KODEMU (lengkapi 6 komponen)

    return s

# TULIS KODEMU
skor =
alert_pertama =
n_alert =
lead_menit =

print("skor NEWS2: " + ", ".join(str(x) for x in skor))
print(f"alert pertama: t={alert_pertama} (skor {skor[alert_pertama]})")
print(f"lead time vs kejadian t={T_KEJADIAN}: {lead_menit} menit")
print(f"total alert: {n_alert} dari {len(stream)} interval")`,
        lockLines: 21,
        solution: `# Stream SINTETIS: (t, nadi, spo2, laju_napas, sistolik, suhu, sadar_penuh)
stream = [
    (0, 78, 97, 16, 120, 36.8, True), (1, 82, 97, 17, 118, 36.9, True),
    (2, 88, 96, 18, 115, 37.0, True), (3, 95, 96, 20, 112, 37.2, True),
    (4, 102, 95, 22, 108, 37.5, True), (5, 110, 94, 23, 105, 37.8, True),
    (6, 118, 93, 24, 100, 38.2, True), (7, 125, 92, 26, 95, 38.5, True),
    (8, 130, 91, 28, 90, 38.8, True), (9, 135, 90, 30, 88, 39.0, True),
    (10, 140, 89, 32, 85, 39.2, True), (11, 142, 88, 33, 82, 39.4, True),
]
AMBANG, T_KEJADIAN, INTERVAL_MNT = 5, 7, 15

def skor_news2(hr, spo2, rr, sbp, temp, sadar):
    # Tabel SINTETIS (disederhanakan dari NEWS2):
    # napas: <=8/>=25:3; 9-11:1; 21-24:2; 12-20:0
    # spo2: <=91:3; 92-93:2; 94-95:1; >=96:0
    # sistolik: <=90/>=220:3; 91-100:2; 101-110:1; 111-219:0
    # nadi: <=40/>=131:3; <=50/>=111:2; 51-90:0; sisanya:1
    # suhu: <=35.0/>=39.1:2; <=36.0/>=38.1:1; 36.1-38.0:0
    # sadar: penuh 0, tidak penuh 3
    s = 0
    # TULIS KODEMU (lengkapi 6 komponen)
    s += 3 if (rr <= 8 or rr >= 25) else 1 if 9 <= rr <= 11 else 2 if 21 <= rr <= 24 else 0
    s += 3 if spo2 <= 91 else 2 if spo2 <= 93 else 1 if spo2 <= 95 else 0
    s += 3 if (sbp <= 90 or sbp >= 220) else 2 if sbp <= 100 else 1 if sbp <= 110 else 0
    s += 3 if (hr <= 40 or hr >= 131) else 2 if (hr <= 50 or hr >= 111) else 0 if 51 <= hr <= 90 else 1
    s += 2 if (temp <= 35.0 or temp >= 39.1) else 1 if (temp <= 36.0 or temp >= 38.1) else 0
    s += 0 if sadar else 3
    return s

# TULIS KODEMU
skor = [skor_news2(hr, spo2, rr, sbp, temp, sadar) for _, hr, spo2, rr, sbp, temp, sadar in stream]
alert_pertama = next(i for i, x in enumerate(skor) if x >= AMBANG)
n_alert = sum(1 for x in skor if x >= AMBANG)
lead_menit = (T_KEJADIAN - alert_pertama) * INTERVAL_MNT

print("skor NEWS2: " + ", ".join(str(x) for x in skor))
print(f"alert pertama: t={alert_pertama} (skor {skor[alert_pertama]})")
print(f"lead time vs kejadian t={T_KEJADIAN}: {lead_menit} menit")
print(f"total alert: {n_alert} dari {len(stream)} interval")`,
        checks: [
          { kind: "equal", task: "t1", name: "skor", value: [0, 0, 0, 1, 5, 5, 9, 10, 12, 13, 14, 14], label: "`skor` 12 interval benar", msg: "Ikuti tabel di komentar fungsi per komponen." },
          { kind: "equal", task: "t3", name: "alert_pertama", value: 4, label: "`alert_pertama` = t=4", msg: "Indeks pertama dengan skor ≥ 5." },
          { kind: "equal", task: "t3", name: "n_alert", value: 8, label: "`n_alert` = 8", msg: "Interval t=4..11 semuanya ≥ 5." },
          { kind: "equal", task: "t4", name: "lead_menit", value: 45, label: "`lead_menit` = 45", msg: "(7 − 4) × 15 menit." },
          { kind: "stdout_matches", task: "t4", pattern: "lead time vs kejadian t=7: 45 menit", label: "Lead time tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t4", pattern: "total alert: 8 dari 12 interval", label: "Total alert tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: yang kamu bangun adalah inti sistemnya",
        body: "Perhatikan: fungsi skor_news2 + loop stream + ambang inilah SELURUH logika komputasi sistem di cerita pembuka. Sisanya — sensor, dashboard, bunyi alert — adalah infrastruktur di sekitarnya. Artinya: sebagai analis, kamu sudah memegang bagian tersulit (logika keputusan yang benar); kegagalan produksi hampir tidak pernah di fungsi ini, melainkan di ambang yang salah, data yang basi, atau manusia yang kelelahan. Kuasai inti kecil ini, lalu pertahankan lapisan di sekitarnya dengan monitoring dari Langkah 5.",
      },
      reference: "Inti sistem = fungsi skor + ambang + stream. Kegagalan produksi hampir selalu di lapisan sekitarnya.",
    },
    {
      id: "chart-news2",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca kurva deteriorasi",
      prose: [
        "Chart di bawah memplot skor NEWS2 lab-mu terhadap waktu: garis biru = skor, garis putus-putus = ambang alert (≥5), garis vertikal = kejadian klinis yang dikonfirmasi di t=7.",
        "Cara membaca: sumbu X = interval waktu (15 menit); sumbu Y = skor NEWS2; titik yang dilingkari = alert pertama di t=4.",
        "Interpretasi: kurva menanjak mulus dari t=3 — deteriorasi bertahap, bukan lonjakan tiba-tiba; inilah pola yang BISA ditangkap sistem. Alert pertama di t=4 memberi lead time 45 menit sebelum kejadian t=7: waktu yang cukup untuk review, belum tentu untuk mencegah — tergantung protokol respons. Perhatikan juga: 8 dari 12 interval berstatus alert; pada pasien yang memang memburuk ini wajar, tetapi pada populasi bangsal pola “alert terus-menerus” inilah bibit alert fatigue. Chart seperti ini — bukan angka akurasi — yang seharusnya dipresentasikan ke komite klinik saat mengusulkan ambang.",
      ],
      tasks: [],
      figure: { svg: NEWS_SVG, alt: "Grafik garis skor NEWS2 terhadap waktu dengan ambang alert dan kejadian klinis", caption: "Skor NEWS2 vs waktu — alert pertama t=4, kejadian t=7: lead time 45 menit (data sintetis)." },
      hints: [
        "💡 Intuisi: presentasikan sistem alert dengan KURVA seperti ini, bukan dengan tabel akurasi. Klinisi berpikir dalam waktu (“berapa menit sebelumnya kami tahu?”), bukan dalam AUC. Lead time adalah bahasa mereka.",
      ],
      reference: "Kurva skor vs waktu + ambang + kejadian = bahasa presentasi ke klinisi. Lead time > akurasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Keputusan deployment sistem alert",
      prose: [
        "Skenario 1 — “Butuh skrining deteriorasi bangsal, anggaran minim”: kondisi = puluhan bed, perawat terbatas, IT minimal. Keputusan: NEWS2 manual/terkomputerisasi sederhana + ambang ≥5 — seperti lab ini. Alasan: murah, bisa dijelaskan 5 menit, tidak butuh GPU; yang penting protokol responsnya, bukan kecanggihan skornya.",
        "Skenario 2 — “Menentukan ambang”: kondisi = tim respons bisa menangani N review per shift. Keputusan: setel ambang agar volume alert ≈ kapasitas tim (simulasikan di data historis SEBELUM live — hitung PPV tiap kandidat ambang). Alasan: ambang bukan konstanta fisika; ia adalah kontrak antara sensitivitas sistem dan stamina manusia. Ambang “standar literatur” yang membanjiri timmu adalah ambang yang salah untuk RS-mu.",
        "Skenario 3 — “Alert dibisukan perawat”: kondisi = override rate >50% atau keluhan “berisik”. Keputusan: JANGAN naikkan ambang dulu — audit dulu: berapa PPV-nya? apakah alert datang bergerombol di jam sibuk? apakah responsnya jelas? Seringkali obatnya adalah mengelompokkan alert (satu pasien satu notifikasi per jam) atau memperbaiki protokol, bukan mengubah model. Alasan: fatigue adalah masalah UX dan operasi, bukan masalah statistik.",
        "Skenario 4 — “Mau pakai model ML canggih”: kondisi = ada tim data, data historis besar, dan NEWS2 terbukti kurang. Keputusan: boleh — TETAPI dengan syarat: (a) validasi prospektif (bukan hanya retrospektif), (b) fallback ke NEWS2 saat pipeline ML mati, (c) explainability untuk klinisi. Alasan: di ranjang pasien, kepercayaan mengalahkan 2 poin AUC. Model yang tidak dipercaya = model yang dimatikan.",
        "Skenario 5 — “Memilih batch vs streaming untuk proyek baru”: kondisi = keputusan butuh respons <1 jam (deteriorasi, sepsis) → streaming. Kondisi = keputusan harian/mingguan (mutu, klaim, surveilans rutin) → batch. Kondisi = ragu → mulai dari batch + simulasi “seandainya streaming” di data historis untuk mengukur nilai tambah lead time-nya. Alasan: streaming 10× lebih mahal dioperasikan; bayar hanya bila lead time-nya benar-benar mengubah keputusan.",
        "Aturan praktis 10 detik: tentukan keputusan & SLA responsnya dulu → pilih batch/streaming → setel ambang dari kapasitas tim (simulasi historis) → pasang monitoring (freshness, volume, PPV, override) → siapkan fallback manual.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengumumkan “AI rumah sakit” sebelum protokol respons dan monitoring siap. Hasilnya: bulan madu 1 bulan, lalu alert fatigue, lalu sistem dimatikan diam-diam — dan kepercayaan klinisi pada SEMUA proyek data ikut mati. Urutan yang benar: protokol respons → pilot terbatas → monitoring → baru pengumuman. Kepercayaan klinisi adalah modal yang hanya bisa dihabiskan sekali.",
      },
      reference: "Ambang = kontrak dengan stamina tim. Fatigue = masalah operasi. Protokol dulu, pengumuman kemudian.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Deploy EWS di IGD",
      prose: [
        "Situasinya: kamu analis RS Harapan Bangsa pasca-insiden cerita pembuka. Direksi tetap ingin EWS, tetapi “jangan sampai dibisukan lagi”. Kamu diminta merancang redeploy di IGD (30 bed, 12 perawat per shift, IT: satu server + WiFi). Data historis: 6 bulan tanda vital per 15 menit + catatan kejadian deteriorasi.",
        "Pertanyaan analisis: (a) Ambang berapa yang kamu usulkan, dan bagaimana cara menentukannya dari data historis? (b) Protokol respons seperti apa agar alert tidak dibisukan? (c) Monitoring minimal apa yang kamu pasang di minggu pertama live?",
        "Pembahasan: (a) Jangan ambil angka literatur mentah-mentah. Simulasikan kandidat ambang (4, 5, 7) di 6 bulan data historis: hitung sensitivitas (berapa kejadian tertangkap), PPV, dan volume alert per shift. Pilih ambang dengan sensitivitas ≥90% DAN volume ≤ kapasitas tim (mis. ≤6 review/shift untuk 12 perawat). Jika tidak ada ambang yang memenuhi keduanya, masalahnya bukan ambang — tambah kapasitas respons atau persempit populasi (hanya pasien triase kuning/merah). (b) Protokol: satu pasien satu notifikasi per 30 menit (anti-gerombol); alert masuk ke perawat penanggung jawab + tampil di dashboard sentral (bukan hanya bunyi); eskalasi otomatis bila tidak direspons 15 menit; review harian 10 menit membahas 1–2 alert kemarin (menjaga kepercayaan bahwa alert ditanggapi serius). (c) Minggu pertama: freshness data (alert bila data >20 menit basi), volume alert per shift vs proyeksi simulasi (deviasi >50% = investigasi), dan wawancara singkat 3 perawat tiap shift (“apakah alert hari ini berguna?”) — override rate kualitatif sebelum angka PPV bulanan tersedia. Prinsipnya: minggu pertama mengukur KEPERCAYAAN, bukan akurasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kerangka “simulasikan ambang di data historis dengan batasan kapasitas” ini identik dengan penentuan ambang credit scoring: cut-off score dipilih bukan dari teori, melainkan dari trade-off approval rate vs bad rate DENGAN kapasitas tim collection. Analis yang bisa berargumen “ambang 5 karena volume alert-nya pas dengan 12 perawat” sedang melakukan capacity-constrained optimization — skill inti risk analytics.",
      },
      reference: "Redeploy: ambang dari simulasi + kapasitas tim, protokol anti-gerombol, monitoring kepercayaan di minggu pertama.",
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
        "Batch = surat (murah, terjadwal); streaming = telepon (mahal, darurat) — pilih dari SLA keputusan, bukan gengsi teknologi.",
        "Latensi total = data + komputasi + manusia — manusia biasanya dominan; optimasi dari bottleneck terbesar.",
        "NEWS2 = 6 parameter × skor 0–3; ≥5 waspada, ≥7 gawat — skrining yang dipakai mengalahkan model canggih yang diabaikan.",
        "PPV = TP/(TP+FP) — 4% berarti sistem sedang melatih perawat untuk mengabaikannya.",
        "Kegagalan senyap: sensor macet, clock skew, missing-as-zero, drift — monitoring: freshness, volume, PPV, override rate.",
      ],
      quiz: [
        {
          q: "Kapan streaming WAJIB dipilih atas batch untuk data kesehatan?",
          options: [
            { text: "Ketika keputusan butuh respons <1 jam (deteriorasi, sepsis) — keterlambatan batch membuat keputusan basi", why: "Benar: SLA keputusan menentukan arsitektur. Batch untuk deteriorasi = mengetahui pasien kolaps minggu depan.", correct: true },
            { text: "Selalu — streaming lebih modern", why: "Salah: untuk laporan mutu bulanan, streaming hanya membayar mahal untuk noise." },
            { text: "Ketika datanya besar", why: "Salah: volume data bukan alasan; urgensi keputusanlah alasannya." },
            { text: "Tidak pernah — batch cukup untuk semua", why: "Salah: batch tidak bisa mengejar deteriorasi yang butuh respons hitungan menit." },
          ],
        },
        {
          q: "Sistem mengirim 300 alert/bulan dengan 12 yang berujung intervensi. Diagnosisnya?",
          options: [
            { text: "PPV 4% — alert fatigue sistemik; audit ambang, pengelompokan alert, dan protokol respons sebelum menyentuh model", why: "Benar: PPV 4% berarti 96% kerja sia-sia — manusia rasional akan membisukan sistem seperti ini.", correct: true },
            { text: "Modelnya rusak — latih ulang", why: "Salah: model bisa sehat sempurna sementara deployment-nya yang gagal; latih ulang tidak menyentuh PPV operasional." },
            { text: "Perawatnya tidak disiplin", why: "Salah: menyalahkan manusia atas desain sistem yang buruk; 4% PPV akan melelahkan siapa pun." },
            { text: "Itu normal — alert memang begitu", why: "Salah: menormalisasi PPV 4% berarti menerima sistem yang melatih pengabaian." },
          ],
        },
        {
          q: "Tidak ada alert selama 24 jam di bangsal aktif yang biasanya berisik. Respons tepat?",
          options: [
            { text: "Selidiki sebagai insiden — keheningan bisa berarti pipeline mati diam-diam (sensor disconnect, dst.)", why: "Benar: tidak ada alert ≠ tidak ada masalah. Freshness monitor harusnya sudah berteriak lebih dulu.", correct: true },
            { text: "Kabar baik — pasien stabil", why: "Salah: kesimpulan tanpa verifikasi pipeline; inilah cara kegagalan senyap lolos." },
            { text: "Turunkan ambang agar ada alert", why: "Salah: mengubah ambang untuk “memancing” alert adalah manipulasi, bukan diagnosis." },
            { text: "Tunggu sampai ada yang komplain", why: "Salah: menunggu komplain berarti monitoring diserahkan ke pasien yang kolaps." },
          ],
        },
        {
          q: "Mengapa NEWS2 lebih terdeploy luas daripada model deep learning yang lebih akurat?",
          options: [
            { text: "Adopsi = akurasi × kepercayaan × kemudahan — NEWS2 menang telak di kepercayaan dan kemudahan", why: "Benar: bisa dihitung manual, dijelaskan 5 menit, tanpa kotak hitam. Model yang dipakai mengalahkan model yang akurat.", correct: true },
            { text: "Karena lebih akurat", why: "Salah: justru premis soalnya — model DL lebih akurat tetapi kalah adopsi." },
            { text: "Karena lebih murah saja", why: "Salah: biaya hanya satu faktor; kepercayaan klinisi adalah faktor penentunya." },
            { text: "Karena rumah sakit anti-teknologi", why: "Salah: generalisasi sinis; klinisi mengadopsi yang terbukti bisa diandalkan di ranjang pasien." },
          ],
        },
        {
          q: "Menentukan ambang alert yang tepat untuk RS-mu. Cara yang benar?",
          options: [
            { text: "Simulasikan kandidat ambang di data historis: sensitivitas vs PPV vs volume alert per shift — pilih yang muat kapasitas tim", why: "Benar: ambang adalah kontrak dengan stamina tim, bukan konstanta literatur. Data historismu yang menentukan.", correct: true },
            { text: "Pakai ambang dari jurnal — sudah tervalidasi", why: "Salah: tervalidasi di populasi dan kapasitas RS lain; ambang yang membanjiri timmu adalah ambang yang salah." },
            { text: "Setel serendah mungkin agar tidak ada yang terlewat", why: "Salah: sensitivitas 100% dengan PPV 2% = sistem yang pasti dibisukan — melewatkan semuanya secara efektif." },
            { text: "Tanya vendor — mereka yang tahu", why: "Salah: vendor menjual software, bukan menanggung alert fatigue perawatmu." },
          ],
        },
        {
          q: "Data SpO2 pasien macet di 97% selama 6 jam (sempurna terus). Tindakan analis?",
          options: [
            { text: "Flag sebagai anomali sensor — nilai fisiologis tidak mungkin sekonstan itu; cek koneksi sebelum percaya", why: "Benar: “terlalu sempurna” adalah pola klasik sensor disconnect; sistem yang menelannya akan memberi skor palsu rendah.", correct: true },
            { text: "Catat sebagai pasien stabil", why: "Salah: mempercayai angka macet berarti memberi nilai sempurna untuk ketiadaan data." },
            { text: "Abaikan — SpO2 bukan parameter penting", why: "Salah: SpO2 adalah komponen NEWS2; mengabaikannya merusak skor." },
            { text: "Hapus data 6 jam itu", why: "Salah: menghapus tanpa investigasi menghilangkan jejak; yang benar flag + periksa perangkat." },
          ],
        },
      ],
      next: { label: "HD33 — Fondasi R untuk Data Kesehatan: Wrangling, Visualisasi dan Model Dasar", href: "/v2/learn/hd33-fondasi-r" },
    },
  ],
};
