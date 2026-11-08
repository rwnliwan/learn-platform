import type { V2Lesson } from "../lib/types";

// Tangga deploy: shadow (0%) -> canary 5% -> 25% -> 100%, dengan gerbang di tiap anak tangga.
const LADDER_SVG = `<svg viewBox="0 0 480 200" role="img" aria-label="Tangga deploy: shadow, canary 5 persen, 25 persen, 100 persen, dengan gerbang kualitas di tiap tahap.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="30" y="130" width="96" height="44" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/><text x="78" y="149" fill="var(--text)" font-weight="600">shadow</text><text x="78" y="165" fill="var(--text-muted)" font-size="11">0% trafik</text>
<rect x="146" y="96" width="96" height="44" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/><text x="194" y="115" fill="var(--text)" font-weight="600">canary</text><text x="194" y="131" fill="var(--text-muted)" font-size="11">5% trafik</text>
<rect x="262" y="62" width="96" height="44" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/><text x="310" y="81" fill="var(--text)" font-weight="600">bertahap</text><text x="310" y="97" fill="var(--text-muted)" font-size="11">25% → 50%</text>
<rect x="378" y="28" width="96" height="44" rx="8" fill="none" stroke="var(--c1)" stroke-width="3"/><text x="426" y="47" fill="var(--text)" font-weight="700">penuh</text><text x="426" y="63" fill="var(--text-muted)" font-size="11">100%</text>
</g>
<g font-family="var(--font-ui)" font-size="10" text-anchor="middle" fill="var(--c4)" font-weight="600">
<text x="136" y="120">gerbang: metrik</text><text x="252" y="86">gerbang: guardrail</text><text x="368" y="52">gerbang: stabil</text></g>
<g stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="4 3">
<line x1="126" y1="130" x2="146" y2="118"/><line x1="242" y1="96" x2="262" y2="84"/><line x1="358" y1="62" x2="378" y2="50"/></g>
<text x="240" y="192" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">risiko naik tiap anak tangga — jangan melompat</text>
</svg>`;

const MLOPS5_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Peluang model rusak lolos gerbang: 3,7% pada 200 sampel vs praktis nol pada 2.000 sampel."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">2%</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">4%</text><rect x="85.7" y="20.0" width="129.6" height="160.0" rx="3" fill="var(--c4)"/><text x="150.5" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">3,7%: BOLONG</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">n=200</text><rect x="294.7" y="180.0" width="129.6" height="0.0" rx="3" fill="var(--c1)"/><text x="359.5" y="174.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">≈0%: AMAN</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">n=2.000</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">P(lolos | rusak)</text></svg>`;

export const mlops5: V2Lesson = {
  slug: "mlops5-cicd",
  track: "MLOps",
  module: "Pipeline & Deploy",
  title: "MLOps5 — CI/CD untuk Model",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "CI hijau, model mati",
      prose: [
        "E-commerce TokoKilat bangga dengan pipeline CI/CD-nya: setiap commit ke repo model langsung di-test dan di-deploy otomatis. Suatu Selasa, data engineer mengubah format kolom 'harga' dari rupiah ke ribuan rupiah — tanpa memberi tahu siapa pun. CI tetap hijau: semua unit test lolos, karena test hanya mengecek 'kode berjalan tanpa error'.",
        "Model baru ter-deploy otomatis dan selama 2 hari memprediksi semua transaksi 'aman' — karena fitur harga tiba-tiba 1000x lebih kecil dari yang pernah ia lihat. Fraud senilai Rp380 juta lolos tanpa satu pun alert. CI hijau sempurna, model mati total.",
        "Twist-nya: pipeline-nya bekerja PERSIS seperti dirancang. Yang salah adalah rancangannya: ia menguji KODE, bukan DATA dan bukan MODEL. CI untuk software ≠ CI untuk ML. Model butuh gerbang kualitas yang menguji tiga hal: kode, data, dan perilaku model itu sendiri.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa CI hijau tidak menjamin model aman di-deploy; (2) menghitung peluang model rusak lolos gerbang kualitas sebagai fungsi ukuran sampel evaluasi; (3) merancang tangga deploy (shadow → canary → bertahap) dengan gerbang yang terukur; (4) memutuskan kapan deploy otomatis aman dan kapan harus ada manusia di loop.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'CI/CD software bisa langsung dipakai untuk ML'",
        type: "pitfall",
        body: "CI software menguji kode deterministik: input sama → output sama. ML menambah dua sumber kegagalan baru: DATA (skema, distribusi, kualitas) dan MODEL (perilaku statistik). Pipeline yang hanya menjalankan pytest lalu deploy = pintu gerbang tanpa penjaga untuk dua risiko terbesar ML.",
      },
      reference: "CI untuk ML = uji kode + uji data + uji model. Satu saja bolong = TokoKilat.",
    },
    {
      id: "ci-ml",
      eyebrow: "Langkah 2 · CI untuk ML",
      title: "Tiga gerbang sebelum deploy",
      prose: [
        "Gerbang 1 — uji kode: unit test fungsi preprocessing, integration test pipeline end-to-end. Ini yang sudah dikenal tim software.",
        "Gerbang 2 — uji data: validasi skema (tipe & kolom), rentang (tidak ada umur −5), distribusi (PSI vs baseline, lihat MLOps7), dan kelengkapan (missing rate). Kasus TokoKilat tertangkap di sini: 'harga' 1000x lebih kecil = anomali distribusi yang jelas.",
        "Gerbang 3 — uji model: metrik minimum (AUC ≥ ambang), uji invariansi ('dua input identik kecuali gender harus memberi skor sama'), uji slice ('performa di segmen nasabah baru tidak jatuh >5pp'), dan latensi (p99 < SLA). Model yang lolos metrik global tapi diskriminatif di satu segmen harus tertahan di sini.",
        "Hasil tiap gerbang hanya tiga: LULUS OTOMATIS (semua hijau + margin aman), REVIEW MANUAL (kuning — butuh manusia), atau BLOKIR (merah — jangan sentuh). Tidak ada 'hijau tapi...' — ambiguitas adalah musuh otomasi.",
        "💡 Intuisi: gerbang kualitas seperti pemeriksaan imigrasi tiga lapis: dokumen (kode), barang bawaan (data), dan wawancara (perilaku model). Pelaku kejahatan yang lolos dari satu lapis tertangkap di lapis berikutnya — karena tiap lapis memeriksa hal yang berbeda.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Kalau metrik naik, model pasti aman di-deploy'",
        type: "pitfall",
        body: "Metrik agregat menyembunyikan banyak dosa: bias segmen, latensi 10x lipat, atau skew train-serve. Model dengan AUC naik 2pp tapi p99 latensi 8 detik akan membunuh API-mu. Gerbang kualitas memeriksa PAKET lengkap: benar + adil + cepat + konsisten.",
      },
      reference: "Tiga gerbang: kode, data, model. Output: lulus / review / blokir.",
    },
    {
      id: "cd-strategi",
      eyebrow: "Langkah 3 · Strategi deploy",
      title: "Jangan terjun — menuruni tangga",
      prose: [
        "Setelah lolos gerbang, model tetap tidak langsung 100%. Tangga risiko: shadow (0% — skor dicatat, keputusan tidak dipakai; bandingkan dengan champion 1–2 minggu), canary (5% trafik + guardrail: metrik bisnis tidak menyimpang > ambang), bertahap (25% → 50%), penuh (100%). Tiap anak tangga punya gerbangnya sendiri.",
        "Untuk memutuskan 'berapa banyak kesalahan boleh terjadi', pakai error budget:",
      ],
      formula: String.raw`B = (1 - SLO) \times N`,
      formulaNote: "B = budget kesalahan yang diizinkan; SLO = target keandalan (mis. 0,999); N = total request periode itu. SLO 99,9% dari 1 juta request = 1.000 kesalahan diizinkan. Budget habis = hentikan deploy otomatis, fokus stabilitas.",
      figure: {
        svg: LADDER_SVG,
        alt: "Tangga deploy: shadow, canary 5 persen, 25 persen, 100 persen, dengan gerbang kualitas di tiap tahap.",
        caption: "Tangga deploy: risiko naik tiap anak tangga. Shadow 0% → canary 5% → bertahap → 100%, masing-masing dengan gerbang. Cara membaca: tiap anak tangga = porsi traffic; kotak kecil di tiap tangga = gerbang yang harus lolos sebelum naik. Interpretasi: jangan naik tangga sebelum gerbang lolos DENGAN n memadai — tergesa naik = melompati gerbang, dan setiap lompatan mengalikan risiko.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Canary 50% lalu heran kenapa 'canary' tidak menangkap apa-apa. Canary yang benar = 5% (cukup untuk sinyal statistik, kecil untuk blast radius). 50% bukan canary — itu setengah deploy buta. Dan shadow yang dilewati = eksperimen pertama dilakukan dengan uang nasabah.",
      },
      reference: "Shadow → canary 5% → bertahap → penuh. Error budget mengatur kecepatan.",
    },
    {
      id: "lab-gate",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: gerbang kualitas otomatis",
      prose: [
        "Kandidat model hasil training semalam datang dengan empat angka: AUC, latensi p99, status skema, dan PSI train-serve skew. Tugasmu: implementasikan `keputusan_gate` dengan aturan — BLOKIR jika AUC < 0,78 atau skema berubah atau PSI > 0,30; REVIEW jika AUC < 0,82 atau p99 > 400ms; selain itu AUTO_DEPLOY.",
        "Perhatikan urutannya: cek kondisi BLOKIR dulu (fail-fast), baru kondisi REVIEW. Satu pelanggaran kritis membatalkan semua nilai bagus lainnya — seperti kasus TokoKilat: AUC-nya mungkin bagus, tapi skema berubah = blokir.",
        "Cara membaca: 'Metrik kandidat' adalah apa yang dilihat gerbang; 'Keputusan' adalah vonisnya. Interpretasi: jika keputusanmu BLOCKED dengan alasan skema, gerbangmu baru saja menyelamatkan Rp380 juta.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan aturan BLOKIR di `keputusan_gate`" },
        { id: "t2", text: "Implementasikan aturan MANUAL_REVIEW" },
        { id: "t3", text: "Jalankan; baca vonis gerbang" },
      ],
      expected: "BLOCKED · alasan: skema fitur berubah",
      note: {
        title: "💡 Intuisi: gerbang itu wasit, bukan pelatih",
        body: "Wasit tidak melatih pemain jadi lebih baik — ia menghentikan pertandingan yang berbahaya. Gerbang kualitas tidak memperbaiki model; ia mencegah model berbahaya mencapai lapangan. Perbaikan tetap tugas training; pencegahan tugas gerbang. Jangan meminta wasit melatih.",
      },
      hints: [
        "Cek BLOKIR dulu: if k['auc'] < 0.78: alasan.append(...); lalu schema, lalu psi > 0.30.",
        "Jika alasan terisi -> return 'BLOCKED', alasan.",
        "Lalu cek REVIEW: auc < 0.82, p99_ms > 400. Jika ada -> 'MANUAL_REVIEW'.",
      ],
      code: {
        starter: `import random\nrandom.seed(55)\n\nkandidat = {\n    "auc":      round(random.gauss(0.83, 0.02), 3),\n    "p99_ms":   int(random.gauss(320, 60)),\n    "schema_ok": random.random() > 0.15,\n    "psi":      round(abs(random.gauss(0.12, 0.10)), 3),\n}\n\ndef keputusan_gate(k):\n    # TULIS KODEMU: kembalikan (keputusan, daftar_alasan)\n    \n\nprint("Metrik kandidat:", kandidat)\nkeputusan, alasan = keputusan_gate(kandidat)\nprint(f"Keputusan gerbang: {keputusan}")\nfor a in alasan:\n    print(" -", a)`,
        lockLines: 10,
        solution: `import random\nrandom.seed(55)\n\nkandidat = {\n    "auc":      round(random.gauss(0.83, 0.02), 3),\n    "p99_ms":   int(random.gauss(320, 60)),\n    "schema_ok": random.random() > 0.15,\n    "psi":      round(abs(random.gauss(0.12, 0.10)), 3),\n}\n\ndef keputusan_gate(k):\n    # TULIS KODEMU: kembalikan (keputusan, daftar_alasan)\n    alasan = []\n    if k["auc"] < 0.78:\n        alasan.append(f"BLOCKED: auc {k['auc']} < 0.78")\n    if not k["schema_ok"]:\n        alasan.append("BLOCKED: skema fitur berubah")\n    if k["psi"] > 0.30:\n        alasan.append(f"BLOCKED: skew train-serve PSI {k['psi']} > 0.30")\n    if alasan:\n        return "BLOCKED", alasan\n    if k["auc"] < 0.82:\n        alasan.append(f"REVIEW: auc {k['auc']} di bawah 0.82")\n    if k["p99_ms"] > 400:\n        alasan.append(f"REVIEW: p99 {k['p99_ms']}ms > SLA 400ms")\n    if alasan:\n        return "MANUAL_REVIEW", alasan\n    return "AUTO_DEPLOY", ["semua gerbang lolos: auc, latensi, skema, skew aman"]\n\nprint("Metrik kandidat:", kandidat)\nkeputusan, alasan = keputusan_gate(kandidat)\nprint(f"Keputusan gerbang: {keputusan}")\nfor a in alasan:\n    print(" -", a)`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "Keputusan gerbang: BLOCKED", label: "Vonis BLOCKED", msg: "Kandidat punya auc 0.871 dan p99 399ms (bagus!) tapi skema berubah -> BLOCKED." },
          { kind: "stdout_matches", task: "t3", pattern: "BLOCKED: skema fitur berubah", label: "Alasan skema", msg: "Alasan blokir harus menyebut perubahan skema — pelajaran TokoKilat." },
        ],
      },
      reference: "Fail-fast: cek BLOKIR dulu. Satu merah membatalkan semua hijau.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kapan deploy otomatis aman?",
      prose: [
        "**Skenario 1 — Retrain rutin, minor version.** Pola 6 bulan stabil, gerbang hijau dengan margin. → Otomatis penuh sampai production. Inilah kasus yang paling menguntungkan otomasi.",
        "**Skenario 2 — Minor tapi metrik kuning.** AUC turun 1pp (masih di atas ambang). → Otomatis sampai staging, MANUAL untuk production. Kuning = manusia melihat dulu, 15 menit review vs risiko deploy buta.",
        "**Skenario 3 — Mayor / arsitektur baru.** → Manual penuh + shadow 2 minggu + canary. Tidak ada jalan pintas; ini wilayah 'bukti dulu, percaya kemudian'.",
        "**Skenario 4 — Error budget habis.** Tiga insiden bulan ini menghabiskan budget kesalahan. → BEKUKAN semua deploy otomatis sampai stabil. Aturan ini melindungi tim dari dirinya sendiri saat sedang sial/terburu-buru.",
        "Aturan praktis 10 detik: 'apakah aku berani deploy ini Jumat malam lalu mematikan HP?' Ya → otomatis. Tidak → manual. Instingmu tentang risiko biasanya benar; dengarkan.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: otomasi itu kepercayaan yang terverifikasi",
        body: "Kamu tidak memberi kunci brankas ke orang baru — kepercayaan dibangun bertahap: diawasi, lalu sebagian, lalu penuh. Deploy otomatis sama: mulai manual → semi-otomatis → otomatis, NAIK LEVEL hanya setelah N deploy sukses beruntun. Kepercayaan tanpa verifikasi = kecerobohan.",
      },
      reference: "Otomatis untuk rutin+margin; manual untuk kuning/mayor; beku saat budget habis.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Rp380 juta yang lolos dari gerbang",
      prose: [
        "Bedah angka TokoKilat: model 'semua aman' hidup 2 hari. Volume fraud normal: 40 kasus/hari × Rp4.750.000 rata-rata = Rp190 juta/hari lolos. Total 2 hari: Rp380 juta. Biaya membangun gerbang data (validasi skema + distribusi) yang bisa menangkapnya: ~2 minggu engineer ≈ Rp30 juta sekali bayar.",
        "**Pertanyaan:** (1) Berapa ROI gerbang dalam insiden pertama saja? (2) Uji apa yang PALING murah namun menangkap kasus ini? (3) Kenapa tim tidak membangunnya sebelumnya?",
        "**Pembahasan:** (1) Rp380 jt / Rp30 jt ≈ 12,7x — dan itu baru satu insiden; gerbang melindungi selamanya. (2) Uji distribusi sederhana: bandingkan rata-rata/median 'harga' batch baru vs 30 hari terakhir; perubahan 1000x tertangkap oleh assert satu baris. (3) Karena 'CI sudah hijau' memberi rasa aman palsu — mereka menguji hal yang salah dengan sangat baik. Rasa aman palsu lebih berbahaya daripada rasa takut yang jujur.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dalam model risk management (SR 11-7 / OJK), 'model di-deploy tanpa validasi independen' adalah temuan audit. Gerbang kualitas = validasi berkelanjutan yang terdokumentasi otomatis — setiap deploy tercatat lolos uji apa. Ini bukan birokrasi; ini bukti kepatuhan.",
      },
      reference: "ROI 12,7x untuk satu insiden. Assert satu baris bisa menyelamatkan Rp380 jt.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Gerbang tanpa ukuran sampel hanyalah pajangan",
      prose: [
        "Mini-case lesson ini: model rusak (AUC sebenarnya 0,80) LOLOS gerbang `AUC ≥ 0,85` dan merugikan Rp380 juta. Kok bisa? Karena gerbang menguji pada 200 sampel. Standard error AUC pada n=200: SE ≈ √(0,80×0,20/200) ≈ 0,028. Skor terukur = 0,80 + noise; peluang noise mengangkatnya melewati 0,85 adalah P(Z > (0,85−0,80)/0,028) = P(Z > 1,79) ≈ 3,7%. Artinya: dari 27 model rusak yang diuji, SATU lolos. Gerbangnya ada, tapi bolong — bolongnya bernama `n terlalu kecil`.",
        "Bandingkan dengan n=2.000: SE ≈ 0,009; P(Z > (0,05)/0,009) = P(Z > 5,6) ≈ 0,0000001. Peluang lolosnya praktis NOL. Selisih biaya evaluasi: 200 vs 2.000 sampel scoring — untuk model batch, bedanya mungkin Rp50 ribu compute. Gerbang Rp50 ribu inilah yang membedakan Rp380 juta kerugian dengan insiden yang tidak pernah terjadi. Inilah pelajaran intinya: KEKETATAN gerbang bukan ditentukan oleh ambangnya (0,85), melainkan oleh KETELITIAN pengukurannya (n).",
        "Rumus umumnya: peluang model rusak (AUC_r) lolos gerbang (ambang T) adalah P(Z > (T − AUC_r)/SE) dengan SE ≈ √(AUC_r(1−AUC_r)/n). Tiga tuas untuk memperkecilnya: (1) perbesar n — termurah, lakukan dulu; (2) naikkan T — tapi ini juga menolak model BAGUS (false reject), ada trade-off; (3) tambah gerbang independen (slice test, shadow) — peluang lolos SEMUA gerbang = perkalian peluang masing-masing jika independen. Kombinasi (1)+(3) biasanya paling ekonomis.",
        "Contoh trade-off tuas (2): naikkan ambang ke 0,87 dengan n=200. Model rusak (0,80): P(Z > 2,5) ≈ 0,6% — bagus, 6x lebih aman. Tapi model BAGUS (AUC 0,88): P(terukur < 0,87) = P(Z < (0,87−0,88)/0,028) = P(Z < −0,36) ≈ 36% — lebih dari sepertiga model bagus DITOLAK sia-sia, tim frustrasi, dan mereka mulai mem-bypass gerbang (`ah, gerbangnya terlalu ketat`). Gerbang yang terlalu ketat sama berbahayanya dengan yang longgar: ia mengajari tim untuk tidak percaya pada gerbang.",
        "Karena itu desain gerbang yang benar: ambang moderat (0,85) + n BESAR (2.000+) + gerbang independen berlapis. Hitung untuk kombinasi: gerbang AUC (n=2.000, P_lolos_rusak ≈ 0) praktis sudah cukup; tambah slice test (tidak ada segmen turun > 0,01) dan shadow 2 minggu sebagai asuransi untuk jenis kerusakan yang TIDAK tertangkap AUC (mis. bias segmen, skew definisi). Total biaya gerbang ≈ Rp200 ribu per deploy — premi asuransi terhadap Rp380 juta.",
        "Terakhir, gerbang harus OTOMATIS dan BLOCKING. Gerbang yang hasilnya `disarankan untuk dipertimbangkan` = tidak ada gerbang. Di CI/CD, gerbang adalah job yang exit code-nya non-zero saat gagal — pipeline berhenti, tidak ada tombol `lanjutkan saja`. Pengecualian manual BOLEH ada, tapi harus tercatat (siapa, kapan, alasan) dan di-review mingguan. Jika pengecualian > 20% dari deploy, gerbangnya yang salah desain — perbaiki gerbangnya, jangan normalisasi bypass-nya.",
        "Hubungkan ke tangga deploy: tiap anak tangga (shadow 0% → canary 5% → 25% → 100%) punya gerbangnya sendiri dengan n yang MEMBESAR. Di shadow, n kecil tidak apa karena dampak nol. Di canary 5%, n = 5% traffic × durasi — pastikan cukup untuk SE yang kecil SEBELUM naik ke 25%. Aturan: jangan naik tangga sebelum gerbang tangga saat ini lolos dengan n yang memadai. Tergesa naik tangga = melompati gerbang.",
      ],
      formula: String.raw`P(\text{lolos} \mid \text{rusak}) = P\left(Z > \frac{T - AUC_r}{SE}\right), \quad SE \approx \sqrt{\frac{AUC_r(1-AUC_r)}{n}}`,
      formulaNote: "P(lolos|rusak) = peluang model rusak lolos gerbang; T = ambang gerbang; AUC_r = AUC sebenarnya model rusak; SE = standard error; n = ukuran sampel evaluasi; Z = distribusi normal baku. Perkecil dengan memperbesar n atau menambah gerbang independen.",
      figure: {
        svg: MLOPS5_DEEP_SVG,
        alt: "Diagram batang: peluang model rusak lolos gerbang 3,7% pada 200 sampel vs praktis nol pada 2.000 sampel.",
        caption: "Cara membaca: tinggi batang = peluang model rusak (AUC 0,80) lolos gerbang AUC ≥ 0,85; dua batang = dua ukuran sampel evaluasi. Interpretasi: ambang yang SAMA (0,85) bisa bolong (3,7% lolos!) atau kedap — yang menentukan adalah n, bukan ambangnya. Gerbang Rp50 ribu (2.000 sampel) mencegah Rp380 juta.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: gerbang diukur dari ketelitiannya, bukan ketinggiannya",
        body: "Ambang 0,85 pada 200 sampel = pagar dengan lubang sebesar badan. Sebelum memperketat ambang (yang menolak model bagus), perbesar dulu sampel evaluasinya — itu tuas termurah dan tidak punya efek samping false reject.",
      },
      reference: "Ketat = ambang moderat + n besar + gerbang berlapis. Gerbang harus blocking, bukan saran.",
    },
    {
      id: "fondasi-linux-shell",
      eyebrow: "Langkah 8 · Fondasi Linux",
      title: "Linux & shell: bahasa yang dipakai pipeline",
      prose: [
        "Pipeline ML tidak berjalan di laptopmu — ia berjalan di server Linux. Ketika job training mati jam 2 pagi, log yang kamu baca ditulis oleh Linux, proses yang kamu hentikan dihentikan lewat shell, dan artefak yang gagal terbaca gagal karena permission. CI/CD untuk model pada dasarnya adalah orkestrasi perintah shell di mesin Linux; siapa yang buta shell akan mendiagnosis pipeline dengan cara menebak.",
        "Permission & kepemilikan: artefak model ditulis oleh service account training dengan mode 600 (hanya pemilik boleh baca-tulis). Service account serving berjalan sebagai user lain → error 'Permission denied' yang misterius padahal file-nya jelas ada. Cek dengan `ls -l`: kolom mode (rw-------) dan kolom pemilik memberi tahu SIAPA boleh apa. Perbaikannya adalah ownership yang benar — file ditulis dan dibaca oleh identitas yang memang berhak — bukan jalan pintas (lihat jebakan di bawah).",
        "Exit code: pipeline tidak membaca teks log untuk memutuskan sukses atau gagal — ia membaca SATU angka, exit code. 0 = sukses, selain itu = gagal. Script training yang crash lalu 'menelan' error dan keluar dengan exit 0 = pipeline mengira sukses lalu men-deploy model basi. Aturan keras: setiap tahap pipeline harus gagal dengan LOUD (exit code non-zero) atau tidak sama sekali. `set -e` di bash menghentikan script pada perintah pertama yang gagal — tanpa itu, script terus berjalan melewati error seolah tidak terjadi apa-apa.",
        "Environment & log: konfigurasi (BUCKET, MODEL_VERSION) dan rahasia (API key, password DB) masuk lewat environment variable, bukan di-hardcode — script yang sama harus jalan di dev, staging, dan produksi, yang berubah hanya environment-nya. Keluarannya dibaca lewat log: `grep ERROR train.log` mencari pola, `tail -n 50 train.log` melihat akhir (di sinilah traceback biasanya), `python train.py > train.log 2>&1` menyimpan stdout+stderr sebelum container mati dan membawa lognya pergi.",
        "💡 Intuisi: exit code itu lampu rem mobil — seluruh sistem (CI, orchestrator, scheduler) hanya membaca satu bit itu. Script yang print 'ERROR' tapi exit 0 = mobil rusak dengan lampu rem hijau: semua orang di belakangmu mengira jalanan aman. Tulis script seolah satu-satunya output yang dibaca mesin adalah exit code — karena memang begitu.",
        "Proses & sinyal (sekilas): `kill` tidak selalu 'membunuh' — ia MENGIRIM SINYAL. SIGTERM (15) = 'tolong berhenti dengan rapi', proses boleh menyimpan checkpoint dulu; SIGKILL (9) = dieksekusi seketika tanpa kesempatan. Inilah kenapa training yang dihentikan scheduler kadang meninggalkan checkpoint dan kadang tidak. Desain training yang baik menangkap SIGTERM dan menyimpan checkpoint sebelum mati.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'chmod 777 menyelesaikan masalah permission'",
        type: "pitfall",
        body: "Yang benar: 777 memberi SEMUA orang — termasuk proses lain di server bersama — hak baca-TULIS. Artefak model yang bisa ditulis siapa saja = model yang bisa diracun siapa saja tanpa jejak. Permission yang benar: pemilik = service account yang memang butuh, mode = seminimal mungkin (600/640). Kenyamanan 777 hari ini = insiden keamanan bulan depan.",
      },
      reference: "Pipeline berbicara lewat exit code, log, dan permission. Kuasai ketiganya sebelum menyalahkan model.",
    },
    {
      id: "fondasi-git-docker",
      eyebrow: "Langkah 9 · Fondasi Git & Docker",
      title: "Git & Docker: dua lapis reproduktibilitas",
      prose: [
        "Dua pertanyaan yang harus bisa dijawab kapan pun dalam hidup sebuah model: 'KODE mana yang menghasilkan model ini?' (Git) dan 'di LINGKUNGAN apa ia berjalan?' (Docker). Tanpa jawaban keduanya, hasil eksperimen = anekdot: tidak bisa diulang, tidak bisa diaudit, tidak bisa dipercaya.",
        "Git untuk ML: branch eksperimen boleh berantakan; branch main hanya menerima yang lolos gerbang kualitas (Langkah 2 lesson ini). Commit hash = identitas kode — catat di metadata model di registry, sehingga model v2.3.1 bisa dilacak ke commit persis yang melahirkannya. Eksperimen yang tidak di-commit = tidak pernah terjadi.",
        "Yang TIDAK boleh masuk repo: (1) DATA — repo membengkak (clone 40 GB, CI merangkak), data hidup di storage terpisah dengan versi sendiri; (2) artefak besar — model.pkl puluhan GB mematikan git, simpan di artifact/model registry; (3) SECRETS — API key yang pernah ter-commit = bocor SELAMANYA (menghapus dari history tidak mencabut key yang sudah dilihat orang; yang benar: rotate segera). Atur lewat `.gitignore` + penyimpanan terpisah, seperti di lab bawah.",
        "Docker: Dockerfile = resep environment yang bisa dibaca mesin. Tiga aturan: pin base image (`python:3.11-slim`, BUKAN `python:latest` — latest berubah tanpa pemberitahuan, build hari ini ≠ build besok); pin dependensi (versi pasti di requirements); tag image sebagai identitas rilis yang tak berubah (`model:v2.3.1`, bukan `model:latest` di produksi — latest berpindah-pindah, kamu tak tahu apa yang sebenarnya sedang berjalan). Layer cache mempercepat build: ubah kode saja → hanya layer kode di-build ulang, layer dependensi dipakai ulang.",
        "Hubungan image ↔ model registry: image berisi kode + environment; model registry berisi artefak + metadata (metrik, commit hash, versi dataset). Keduanya di-tag dengan run ID yang SAMA → pasangan lengkap yang bisa di-deploy ulang kapan pun, di mana pun, dengan hasil identik. Inilah arti 'reproduktibel' yang dijanjikan MLOps — bukan sekadar kata.",
        "💡 Intuisi: Git menjawab 'SIAPA dan KAPAN' (jejak kode), Docker menjawab 'DI MANA' (ruang kerja yang identik). Model tanpa keduanya = resep masakan tanpa takaran dan tanpa dapur yang sama — tidak bisa dimasak ulang, dan tidak ada yang tahu kenapa dulu rasanya enak.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan fungsi `tertahan(nama)` sesuai pola .gitignore" },
        { id: "t2", text: "Jalankan; baca daftar yang tertahan vs yang ter-commit" },
      ],
      expected: "TERTAHAN: 5  TERCOMMIT: 4",
      note: {
        title: "🚨 Mitos: 'Docker = reproduktibilitas otomatis'",
        type: "pitfall",
        body: "Yang benar: image yang di-build dari `python:latest` dengan dependensi tak ter-pin TIDAK reproduktibel — build ulang besok bisa menghasilkan environment berbeda tanpa satu baris kode pun berubah. Docker hanya menjamin reproduktibilitas bila resepnya deterministik: base image ter-pin, dependensi ter-pin, tag tak berubah. Container ≠ sihir.",
      },
      hints: [
        "Pola berakhiran '/' berarti direktori: cocokkan bila nama == nama dir atau nama diawali 'data/'.",
        "Untuk pola lain, pakai fnmatch.fnmatch(nama, pola) — sudah di-import.",
        "Kembalikan True pada kecocokan pertama; False bila tidak ada pola yang cocok.",
      ],
      code: {
        starter: `import fnmatch\n\ngitignore = [\n    "*.pkl",\n    "*.parquet",\n    "data/",\n    ".env",\n    "*.log",\n]\n\nfiles = [\n    "train.py",\n    "data/raw.csv",\n    "model.pkl",\n    "requirements.txt",\n    ".env",\n    "logs/training.log",\n    "notebooks/eksperimen.ipynb",\n    "data/validasi.parquet",\n    "README.md",\n]\n\ndef tertahan(nama):\n    # TULIS KODEMU: True bila nama cocok salah satu pola di atas\n`,
        lockLines: 24,
        solution: `import fnmatch\n\ngitignore = [\n    "*.pkl",\n    "*.parquet",\n    "data/",\n    ".env",\n    "*.log",\n]\n\nfiles = [\n    "train.py",\n    "data/raw.csv",\n    "model.pkl",\n    "requirements.txt",\n    ".env",\n    "logs/training.log",\n    "notebooks/eksperimen.ipynb",\n    "data/validasi.parquet",\n    "README.md",\n]\n\ndef tertahan(nama):\n    # TULIS KODEMU: True bila nama cocok salah satu pola di atas\n    for pola in gitignore:\n        if pola.endswith("/"):\n            if nama == pola[:-1] or nama.startswith(pola):\n                return True\n        elif fnmatch.fnmatch(nama, pola):\n            return True\n    return False\n\ndiblokir = [f for f in files if tertahan(f)]\nprint(f"TERTAHAN: {len(diblokir)}  TERCOMMIT: {len(files) - len(diblokir)}")\nfor f in diblokir:\n    print(" -", f)`,
        checks: [
          { kind: "defined", task: "t1", name: "tertahan", label: "Fungsi tertahan terdefinisi", msg: "Definisikan fungsi tertahan(nama) di bagian editable di bawah komentar TULIS KODEMU." },
          { kind: "equal", task: "t1", name: "diblokir", value: ["data/raw.csv", "model.pkl", ".env", "logs/training.log", "data/validasi.parquet"], label: "Daftar tertahan tepat", msg: "Yang tertahan: data/raw.csv, model.pkl, .env, logs/training.log, data/validasi.parquet — train.py dkk. tetap ter-commit." },
          { kind: "stdout_matches", task: "t2", pattern: "TERTAHAN: 5", label: "Hitungan tertahan", msg: "Baris ringkasan harus mencetak TERTAHAN: 5 — cek logika pencocokan polamu." },
        ],
      },
      reference: "Git = jejak kode. Docker = ruang kerja identik. Keduanya di-tag dengan run ID yang sama.",
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
        "CI untuk ML = uji kode + uji data + uji model; CI software saja tidak cukup.",
        "Tiga vonis gerbang: lulus otomatis / review manual / blokir — tanpa area abu-abu.",
        "Tangga deploy: shadow → canary 5% → bertahap → penuh, tiap anak tangga ada gerbang.",
        "Error budget B = (1 − SLO) × N mengatur kapan otomasi harus berhenti.",
        "Otomatis untuk rutin bermargin; manual untuk kuning/mayor; beku saat budget habis.",
      ],
      next: { label: "MLOps6 — Serving Infra", href: "/v2/learn/mlops6-serving" },
      quiz: [
        {
          q: "Kasus TokoKilat: kenapa CI hijau tapi model mati 2 hari?",
          options: [
            { text: "Test-nya kurang banyak", why: "Bukan jumlah — jenisnya. Seribu unit test kode tidak akan menangkap perubahan data." },
            { text: "CI hanya menguji kode, tidak menguji data & perilaku model", why: "Perubahan format 'harga' 1000x lolos karena tidak ada uji distribusi data. Tiga gerbang, satu terisi.", correct: true },
            { text: "Modelnya terlalu kompleks", why: "Kompleksitas model tidak relevan; inputnya yang berubah arti." },
            { text: "Deploy-nya terlalu cepat", why: "Kecepatan bukan masalah; gerbang yang bolong masalahnya." },
          ],
        },
        {
          q: "Kandidat: AUC 0,871, p99 399ms, skema BERUBAH, PSI 0,107. Vonis gerbang?",
          options: [
            { text: "AUTO_DEPLOY — AUC tinggi", why: "Satu merah membatalkan semua hijau. Skema berubah = input tak dikenal." },
            { text: "BLOCKED — skema berubah (fail-fast)", why: "Aturan: cek BLOKIR dulu. Perubahan skema = model memakan data asing.", correct: true },
            { text: "MANUAL_REVIEW — p99 399ms dekat SLA", why: "399ms < 400ms = masih hijau. Dan vonisnya bukan review — ini blokir." },
            { text: "AUTO_DEPLOY dengan catatan", why: "'Dengan catatan' = area abu-abu. Gerbang tidak mengenal abu-abu." },
          ],
        },
        {
          q: "Urutan deploy yang benar untuk model mayor baru?",
          options: [
            { text: "Langsung 100% — gerbang sudah hijau", why: "Gerbang hijau ≠ bukti di produksi. Bencana butuh satu lompatan saja." },
            { text: "Shadow 0% → canary 5% + guardrail → bertahap → 100%", why: "Tiap anak tangga membuktikan dengan risiko terbatas. Inilah tangga risiko.", correct: true },
            { text: "Canary 50% → 100%", why: "50% bukan canary — itu setengah deploy buta." },
            { text: "Shadow dilewati, langsung canary", why: "Shadow satu-satunya cara melihat perilaku di produksi tanpa risiko keputusan." },
          ],
        },
        {
          q: "SLO 99,9%, 1 juta request/bulan. Error budget?",
          options: [
            { text: "100", why: "Itu untuk SLO 99,99%. Hitung: (1−0,999) × 1.000.000." },
            { text: "1.000 — budget habis = bekukan deploy otomatis", why: "B = 0,001 × 1.000.000 = 1.000. Fungsinya: rem otomatis kecepatan deploy.", correct: true },
            { text: "10.000", why: "Itu untuk SLO 99%. Perhatikan jumlah 9-nya." },
            { text: "Tidak terbatas selama metrik naik", why: "Budget justru ada untuk menghentikan 'metrik naik tapi sistem berdarah'." },
          ],
        },
        {
          q: "Kapan deploy otomatis PENUH aman?",
          options: [
            { text: "Selalu — otomasi selalu lebih baik", why: "Otomasi buta untuk perubahan mayor = bunuh diri yang efisien." },
            { text: "Retrain rutin minor + gerbang hijau bermargin + budget tersedia", why: "Tiga syarat: pola terbukti, bukti kuat, rem masih ada. Kurang satu = turun level.", correct: true },
            { text: "Saat engineer sedang cuti", why: "Justru saat butuh kehati-hatian ekstra, bukan otomasi ekstra." },
            { text: "Saat direksi meminta cepat", why: "Tekanan jadwal bukan penilai risiko. Gerbang tidak peduli deadline." },
          ],
        },
        {
          q: "Gerbang `AUC ≥ 0,85` diuji pada 200 sampel. Model rusak (AUC 0,80) lolos dengan peluang ~3,7%. Perbaikan SATU langkah yang paling efektif?",
          options: [
            { text: "Naikkan ambang menjadi 0,90", why: "Menaikkan ambang memang menurunkan P(lolos|rusak), tapi juga menaikkan false reject model bagus secara drastis (36% pada contoh) — tim akan mulai mem-bypass gerbang. Ini tuas dengan efek samping terbesar." },
            { text: "Perbesar sampel evaluasi menjadi 2.000+", why: "Tepat. SE menyusut 3x, P(lolos|rusak) jatuh dari 3,7% ke praktis nol — tanpa menambah false reject model bagus. Biaya tambahannya hanya Rp50 ribu compute.", correct: true },
            { text: "Ganti metrik AUC menjadi akurasi", why: "Mengganti metrik tidak menyelesaikan masalah ketelitian pengukuran; akurasi pada 200 sampel punya SE yang sama besarnya. Masalahnya n, bukan metriknya." },
            { text: "Hapus gerbang — toh bisa bolong juga", why: "Gerbang bolong yang diperbaiki (n besar) jauh lebih baik daripada tidak ada gerbang. Menghapusnya = kembali ke deploy buta." },
          ],
        },
      ],
    },
  ],
};
