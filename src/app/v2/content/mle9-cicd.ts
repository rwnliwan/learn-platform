import type { V2Lesson } from "../lib/types";

export const mle9: V2Lesson = {
  slug: "mle9-cicd",
  track: "Machine Learning Engineer",
  module: "Serving & Operasi",
  title: "MLE9 — CI/CD untuk ML",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Model yang di-retrain manual 'tiap Jumat' akan basi — karena Jumat ada cuti, ada insiden, ada lupa. Lesson ini mengotomatiskan siklus hidup model.",
        "Tujuan lesson ini:",
        "• Menjelaskan perbedaan CI/CD software vs ML (data dan model ikut pipeline).",
        "• Merancang training pipeline: dari trigger hingga artefak berversion.",
        "• Menulis quality gate: syarat otomatis lolos/tahan/deploy.",
        "• Menganalisis hasil canary untuk keputusan promosi/rollback.",
        "• Memutuskan trigger retraining untuk 4 skenario.",
        "Isi lesson: cerita model basi 3 bulan → CI untuk ML + lab quality gate → CD & canary + lab → trigger retraining → peta keputusan → mini-case → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Model yang basi 3 bulan karena menunggu 'Jumat'",
      prose: [
        "Sebuah P2P lending punya SOP: retrain model scoring tiap Jumat sore. Tiga bulan berjalan lancar. Lalu datang bulan puasa: tim cuti bergantian, Jumat terlewat sekali, dua kali — dan tidak ada yang sadar model sudah basi 3 bulan.",
        "Twist-nya: bukan orangnya yang lalai — sistemnya yang dirancang bergantung pada ingatan manusia. Setiap langkah manual (tarik data, cek kualitas, training, validasi, deploy) adalah titik di mana proses bisa berhenti diam-diam.",
        "Selama 3 bulan itu, NPL naik 1,8 poin. Tidak ada yang menghubungkan — sampai audit menemukan model memakai pola dari 5 bulan lalu.",
        "Pelajaran: training harus seperti detak jantung — otomatis, terjadwal, terpantau. CI/CD untuk ML = mengubah 'SOP Jumat' menjadi pipeline yang berjalan sendiri dan berteriak jika gagal.",
        "SOP “retrain tiap Jumat” gagal bukan karena orangnya malas — melainkan karena SISTEM bergantung pada ingatan manusia. Cuti, insiden, lupa = single point of failure yang bernama “kebiasaan”. Otomatisasi = memindahkan keandalan dari manusia ke sistem. Tetapi ingat minicase: otomatisasi tanpa gate = memindahkan KECEROBOHAN ke sistem — yang lebih cepat dan lebih konsisten cerobohnya. Otomatiskan DISIPLIN (gate + checklist), bukan sekadar jadwal.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'CI/CD untuk ML = CI/CD biasa + training di tengah'",
        type: "pitfall",
        body: "Yang benar: pipeline ML menguji DATA dan MODEL juga (bukan cuma kode), artefaknya termasuk dataset berversion, dan 'deploy' berarti promosi model di registry — bukan sekadar copy binary.",
      },
    },
    {
      id: "ci",
      eyebrow: "Langkah 3 · CI untuk ML",
      title: "Setiap perubahan diuji, setiap training tercatat",
      prose: [
        "CI untuk ML terpicu oleh TIGA hal: perubahan kode, data baru masuk, atau jadwal (cron). Tiap trigger menjalankan: validasi data → unit test → training → evaluasi → quality gate.",
        "Quality gate adalah penjaga otomatis: kumpulan syarat yang HARUS lolos sebelum artefak boleh lanjut. Contoh: AUC ≥ 0,80; PSI_max ≤ 0,25; latency p99 ≤ 200ms; semua invariant lolos. Satu syarat gagal → pipeline berhenti dan memberi tahu manusia.",
        "Bedanya dengan CI software: training bisa makan waktu berjam-jam dan hasilnya STOKASTIK. Solusinya: seed terkunci (MLE3), perbandingan vs champion (bukan angka absolut buta), dan artefak selalu berversion meski gagal (untuk debugging).",
        "Lab: quality gate dengan 3 syarat. Hasil: AUC 0,84 ✓, PSI 0,18 ✓, latency 150ms ✓ → DEPLOY. Ubah satu angka di kepalamu: jika PSI 0,31 → DITAHAN.",
        "Quality gate — daftar konkret, bukan slogan. (1) Validasi data: skema + range + missing < ambang. (2) Metrik ≥ baseline − toleransi (AUC tidak turun >0,02). (3) Invariant: semua lolos. (4) Fairness: DI ratio ≥ 0,8. (5) Latency: p99 inference < SLO. (6) Ukuran artefak < batas. Enam pintu; SATU gagal = build MERAH = tidak deploy. Gate yang “bisa dinego” = bukan gate, melainkan saran. Tulis toleransinya sebagai ANGKA — “sedikit turun” bukan kriteria.",
        "Waktu CI — anggaran. Validasi data 5 menit + training 2 jam + evaluasi 30 menit = ~2,5 jam per run. Retrain harian = 2,5 jam compute/hari = Rp75.000/hari (GPU kecil). Mahal? Bandingkan: 1 insiden = Rp600 juta. CI = premi Rp2,25 juta/bulan. Tetapi: JANGAN training penuh di setiap commit kode kecil — tiering: commit → test cepat (15 menit, tanpa training); merge → training penuh. CI yang lambat = developer menghindari CI = CI yang mati.",
      ],
      tasks: [
        { id: "t1", text: "Evaluasi tiap gate: `hasil` memenuhi `syarat`?" },
        { id: "t2", text: "Tentukan `keputusan`: 'DEPLOY' jika semua lolos" },
        { id: "t3", text: "Cetak status tiap gate dan keputusan" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: quality gate = checklist pilot sebelum takeoff",
        body: "Pilot tidak 'merasa' pesawat siap — ia mencentang daftar. Quality gate mengubah penilaian subjektif ('kayaknya modelnya oke') menjadi keputusan objektif yang bisa diaudit.",
      },
      hints: [
        "syarat: ('min', ambang) → hasil >= ambang; ('maks', ambang) → hasil <= ambang.",
        "Loop dict syarat, kumpulkan status tiap metrik.",
        "keputusan = 'DEPLOY' jika all(status.values()) else 'DITAHAN'.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
hasil = {"auc": 0.84, "psi_max": 0.18, "latency_p99": 150}
syarat = {"auc": ("min", 0.80), "psi_max": ("maks", 0.25), "latency_p99": ("maks", 200)}

# TULIS KODEMU: evaluasi quality gate
status = {}
for metrik, (arah, ambang) in syarat.items():
    
keputusan = 

print(f"status={status}  keputusan={keputusan}")`,
        lockLines: 3,
        solution: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
hasil = {"auc": 0.84, "psi_max": 0.18, "latency_p99": 150}
syarat = {"auc": ("min", 0.80), "psi_max": ("maks", 0.25), "latency_p99": ("maks", 200)}

# TULIS KODEMU: evaluasi quality gate
status = {}
for metrik, (arah, ambang) in syarat.items():
    status[metrik] = hasil[metrik] >= ambang if arah == "min" else hasil[metrik] <= ambang
keputusan = "DEPLOY" if all(status.values()) else "DITAHAN"

print(f"status={status}  keputusan={keputusan}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t2",
            "label": "`keputusan` = DEPLOY",
            "name": "keputusan",
            "value": "DEPLOY",
            "tol": 1e-09,
            "msg": "Semua gate lolos: 0.84≥0.80, 0.18≤0.25, 150≤200.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan keputusan",
            "pattern": "keputusan=DEPLOY",
            "msg": "Format: status={...}  keputusan=DEPLOY.",
          },
        ],
      },
      reference: "all() True jika semua True. Quality gate = if otomatis untuk deploy.",
    },
    {
      id: "cd",
      eyebrow: "Langkah 4 · CD dan canary",
      title: "Deploy bertahap: 5% dulu, bukan 100% langsung",
      prose: [
        "CD untuk ML: artefak yang lolos gate dipromosikan di registry (staging → production), lalu traffic dialihkan bertahap: 5% → 25% → 100%. Tiap tahap: bandingkan metrik canary vs control (champion).",
        "Aturan analisis canary: error rate canary ≤ 1,5× control DAN latency p99 dalam SLO → lanjut. Jika tidak → rollback otomatis. Tidak ada 'tunggu dulu, kayaknya oke' — keputusan oleh angka, bukan perasaan.",
        "Lab: control 10.000 request (error 1,2%) vs canary 500 request (error 2,4%). Batas: 1,5 × 1,2% = 1,8%. Canary 2,4% > 1,8% → ROLLBACK. Model 'lebih akurat di offline' gagal di dunia nyata — dan sistem menangkapnya dalam 500 request, bukan 500 ribu.",
        "Penting: canary butuh waktu cukup untuk signifikansi. 500 request dengan base rate 1,2% = ~6 error ekspektasi — cukup untuk sinyal, belum untuk kepastian. Aturan praktis: minimum ratusan sampel per varian.",
        "Canary 5% → 25% → 100% — angka durasi. Tiap tahap minimal 1 JAM (tangkap error cepat) + 1 SIKLUS BISNIS (tangkap pola harian — misal traffic malam vs siang berbeda). Total minimal: 3 jam + 1 hari. Terburu-buru (5% → 100% dalam 30 menit) = melewatkan pola yang hanya muncul di jam sibuk. Kecepatan CD = kecepatan dengan PENGAMAN; tanpa pengaman ia disebut kecerobohan. Otomatisasi mempercepat langkah — kriteria yang menentukan ARAH.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `err_control` dan `err_canary` (%)" },
        { id: "t2", text: "Terapkan aturan: canary ≤ 1.5× control → 'LANJUT', else 'ROLLBACK'" },
        { id: "t3", text: "Cetak ketiganya" },
      ],
      expected: "",
      note: {
        title: "🚨 Mitos: 'canary 5% = aman, tidak perlu dianalisis'",
        type: "pitfall",
        body: "Yang benar: canary tanpa analisis = eksperimen tanpa kesimpulan. 5% traffic yang tidak dibandingkan dengan control hanya memberi rasa aman palsu.",
      },
      hints: [
        "err = error / n * 100.",
        "batas = 1.5 * err_control.",
        "keputusan = 'LANJUT' jika err_canary <= batas else 'ROLLBACK'.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
control = {"n": 10000, "error": 120}
canary = {"n": 500, "error": 12}

# TULIS KODEMU: analisis canary
err_control = 
err_canary = 
keputusan = 

print(f"control={err_control:.1f}%  canary={err_canary:.1f}%  keputusan={keputusan}")`,
        lockLines: 3,
        solution: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
control = {"n": 10000, "error": 120}
canary = {"n": 500, "error": 12}

# TULIS KODEMU: analisis canary
err_control = control["error"] / control["n"] * 100
err_canary = canary["error"] / canary["n"] * 100
keputusan = "LANJUT" if err_canary <= 1.5 * err_control else "ROLLBACK"

print(f"control={err_control:.1f}%  canary={err_canary:.1f}%  keputusan={keputusan}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`err_canary` = 2.4%",
            "name": "err_canary",
            "value": 2.4,
            "tol": 1e-09,
            "msg": "12/500 × 100 = 2.4.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`keputusan` = ROLLBACK",
            "name": "keputusan",
            "value": "ROLLBACK",
            "tol": 1e-09,
            "msg": "2.4 > 1.5×1.2 = 1.8 → rollback otomatis.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan keputusan",
            "pattern": "keputusan=ROLLBACK",
            "msg": "Format: control=...%  canary=...%  keputusan=....",
          },
        ],
      },
      reference: "Canary = eksperimen terkontrol di produksi. Keputusan oleh angka.",
    },
    {
      id: "trigger",
      eyebrow: "Langkah 5 · Trigger retraining",
      title: "Kapan pipeline berjalan sendiri",
      prose: [
        "Empat trigger retraining: (1) Jadwal — tiap minggu/bulan. Sederhana, tetapi buta terhadap kebutuhan. (2) Data baru — N sampel baru terkumpul. (3) Degradasi — metrik turun di bawah ambang. (4) Drift signifikan — PSI melewati batas.",
        "Praktik terbaik: kombinasikan. Jadwal sebagai jaring pengaman + trigger degradasi/drift sebagai respons cepat. 'Retrain tiap Senin, ATAU jika akurasi turun 2 poin, ATAU jika PSI > 0,25.'",
        "Yang sering dilupakan: retraining otomatis TETAP butuh quality gate. Pipeline yang me-retrain dan auto-deploy model buruk = otomatisasi bencana. Otomatisasi tanpa gate = mempercepat kegagalan.",
        "Biaya: tiap retraining = compute + risiko. Jangan retrain harian jika drift-nya mingguan — selaraskan frekuensi dengan kecepatan perubahan dunia.",
        "Cara membaca: panjang batang = waktu dari “keputusan retrain” sampai “model baru melayani”; angka di kanan = durasinya. Perhatikan trade-off yang tidak terlihat di diagram: semakin pendek batang, semakin KUAT quality gate yang dibutuhkan.",
        "Interpretasi: 3 minggu → 2 jam = 250×. Tetapi minicase menunjukkan sisi gelapnya: full-otomatis tanpa gate yang kuat = deploy bug dalam 2 jam (bukan 3 minggu). Kecepatan tanpa pengaman = kecelakaan yang lebih cepat. Naik tingkat otomatisasi HANYA jika gate-nya naik setara — diagram ini harus dibaca bersama lesson MLE7.",
        "Trigger DEGRADASI — yang paling cerdas, paling berbahaya. Retrain saat metrik < ambang: adaptif, hemat (tidak retrain saat tidak perlu). Bahayanya: (1) metrik turun karena BUG DATA (bukan drift) → retrain di atas sampah (MLE6!); (2) feedback loop — model mempengaruhi data yang ia latih berikutnya (rekomendasi → klik → training). Aturan: trigger degradasi WAJIB didahului investigasi otomatis (cek data quality dulu). Retrain buta = mengobati gejala dengan racun.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="Lead time retrain → deploy">
<text x="240" y="20" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Lead time retrain → deploy</text>
<text x="142" y="64" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Manual (SOP Jumat)</text>
<rect x="150" y="52" width="300" height="22" fill="var(--c1)" rx="4"/>
<text x="458" y="68" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">3 minggu</text>
<text x="142" y="108" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Semi-otomatis</text>
<rect x="150" y="96" width="150" height="22" fill="var(--c1)" rx="4"/>
<text x="308" y="112" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">3 hari</text>
<text x="142" y="152" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Full CI/CD</text>
<rect x="150" y="140" width="40" height="22" fill="var(--c1)" rx="4"/>
<text x="198" y="156" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2 jam</text>
</svg>`,
        alt: "Diagram batang: lead time dari 3 minggu (manual) menjadi 2 jam (full CI/CD).",
        caption: "Otomatisasi memangkas lead time 250× — tetapi full-otomatis butuh quality gate yang kuat.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: otomatisasi yang baik itu membosankan",
        body: "Pipeline ideal: berjalan tiap minggu, lolos gate, deploy, dan tidak ada yang memperhatikan. Jika retraining selalu jadi 'acara', ada yang salah dengan desainnya.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Tingkat otomasi per konteks",
      prose: [
        "Skenario 1 — Startup, 1 model, tim 3 orang → semi-otomatis: training terjadwal + notifikasi, deploy manual dengan 1 klik. Alasan: full-otomatis butuh investasi; manusia masih lebih murah untuk volume kecil.",
        "Skenario 2 — Scale-up, 20 model → full CI/CD: trigger otomatis + quality gate + canary + rollback otomatis. Alasan: 20 model × proses manual = tidak mungkin konsisten.",
        "Skenario 3 — Model teregulasi (kredit) → otomatisasi penuh TETAPI deploy butuh persetujuan manusia (human-in-the-loop). Alasan: regulator butuh akuntabilitas manusia pada keputusan promosi.",
        "Skenario 4 — Riset/eksperimen → pipeline training otomatis, tanpa CD. Alasan: eksperimen butuh kecepatan iterasi, bukan rilis aman.",
        "Aturan praktis 10 detik: (1) Berapa model? (2) Berapa biaya satu deploy manual yang gagal? (3) Apakah regulator menuntut jejak persetujuan? Jawaban menentukan tingkat otomasi.",
        "Skenario 3 — 2 juta pengguna, model kritis (kasus minicase) → SEMI-OTOMATIS dengan 4 DAN + canary 1 hari + rollback 1 klik. Alasan: blast radius besar = setiap deploy adalah keputusan bisnis, bukan sekadar teknis. “Otomatis penuh” untuk ini = menyerahkan keputusan Rp miliaran ke script. Script tidak bisa dimintai pertanggungjawaban; manusia bisa. Desain CD = desain AKUNTABILITAS.",
        "Canary deployment untuk model — 5% dulu. Model baru layani 5% traffic 1 hari; metrik OK → 50% → 100%. 95% pengguna tak tersentuh bila ada bug. Canary = asuransi Rp2 juta untuk risiko Rp300 juta. Tidak pernah 100% langsung — itu bukan berani, melainkan ceroboh.",
      ],
      tasks: [
      ],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Auto-deploy yang menyebarkan bug ke 2 juta pengguna",
      prose: [
        "Sebuah aplikasi investasi membangun full CI/CD: retrain mingguan + auto-deploy jika AUC naik. Suatu Senin, AUC naik 0,02 — deploy otomatis jalan. Selasa pagi: 2 juta pengguna menerima rekomendasi portofolio yang kacau.",
        "Root cause: data weekend mengandung duplikat akibat bug ETL (satu transaksi tercatat 3x). AUC naik PALSU karena duplikat membuat validasi optimistis. Quality gate hanya memeriksa AUC — tidak ada validasi data di pipeline.",
        "Kerugian: rollback 6 jam, 340 ribu pengguna terdampak, biaya kompensasi Rp1,2 miliar.",
        "Pertanyaan: (a) Di mana rantai pertahanan jebol? (b) Gate apa yang akan menghentikannya? (c) Apakah auto-deploy yang salah, atau desainnya?",
        "Pembahasan: (a) Tidak ada validasi data di pipeline — bug ETL lolos ke training. (b) Data validation gate (duplikat rate, volume check: 'data weekend 3x lipat dari normal = tolak') + perbandingan distribusi train vs baseline. (c) Desainnya: auto-deploy tanpa validasi data dan tanpa canary bertahap. Otomatisasi mempercepat — termasuk mempercepat bencana. Pelajaran: kecepatan pipeline harus diimbangi ketebalan gate.",
        "Anatomi bencana Senin: AUC naik 0,02 → auto-deploy → 2 juta pengguna dapat rekomendasi kacau. Root cause: AUC naik karena DATA BOCOR (leakage — fitur mengandung informasi masa depan), bukan karena model lebih baik. Quality gate yang hilang: (1) leakage check (|r|>0,9?), (2) evaluasi di data FRESH (bukan data yang mungkin bocor), (3) canary dengan metrik BISNIS (konversi, bukan hanya AUC). Tiga pintu, nol dipasang. AUC = metrik yang bisa berbohong; gate = yang memergokinya.",
        "Perbaikan: “auto-deploy jika AUC naik DAN …”. DAN-nya: (1) lolos leakage check; (2) evaluasi pada window waktu TERBARU yang belum pernah dipakai training; (3) canary 5% dengan metrik bisnis ≥ baseline; (4) manusia ACC untuk deploy ke >25%. Auto-deploy penuh = untuk model risiko RENDAH; untuk 2 juta pengguna = semi-otomatis. Otomatisasi = fungsi dari RISIKO, bukan dari kemalasan. Semakin besar blast radius, semakin banyak DAN-nya.",
        "Rollback 1 klik — yang menyelamatkan Selasa pagi. Setelah rekomendasi kacau terdeteksi (canary metrik bisnis turun): 1 klik → traffic kembali ke champion dalam 2 menit. Kerugian: 2 jam × 2 juta pengguna (bukan 2 hari!). Tanpa rollback siap: 4 jam deploy manual panik = 2× kerugian. Aturan: setiap CD HARUS punya rollback yang DIUJI (latihan tiap bulan). Rollback yang tidak pernah dites = harapan, bukan rencana.",
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
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Perbedaan utama CI untuk ML vs CI software biasa?",
          options: [
            {
              text: "Tidak ada, sama saja",
              why: "CI ML menguji data dan model juga, artefaknya termasuk dataset berversion.",
            },
            {
              text: "CI ML menguji data + model, artefak termasuk data berversion",
              why: "Tepat: tiga artefak (code, data, model) semuanya masuk pipeline.",
              correct: true,
            },
            {
              text: "CI ML tidak butuh test",
              why: "Justru butuh LEBIH banyak lapisan test.",
            },
            {
              text: "CI ML hanya untuk deep learning",
              why: "Berlaku untuk semua model ML yang diproduksi.",
            },
          ],
        },
        {
          q: "AUC naik 0,02 tetapi data mengandung duplikat 3x. Deploy?",
          options: [
            {
              text: "Deploy, AUC naik",
              why: "Kenaikan palsu dari duplikat — metriknya bohong.",
            },
            {
              text: "Tahan — validasi data dulu, metrik dari data corrupt tidak valid",
              why: "Tepat: gate data harus lolos sebelum gate metrik dipercaya.",
              correct: true,
            },
            {
              text: "Deploy setengah traffic",
              why: "Canary tidak memperbaiki data training yang corrupt.",
            },
            {
              text: "Naikkan threshold AUC",
              why: "Ambang lebih tinggi tidak mendeteksi duplikat.",
            },
          ],
        },
        {
          q: "Canary error 2,4% vs control 1,2% (batas 1,5x). Keputusan?",
          options: [
            {
              text: "Lanjut, bedanya kecil",
              why: "2,4 > 1,8 = melanggar aturan yang disepakati.",
            },
            {
              text: "ROLLBACK otomatis",
              why: "Tepat: aturan angka ditegakkan tanpa negosiasi perasaan.",
              correct: true,
            },
            {
              text: "Tunggu seminggu lagi",
              why: "Menunggu = membiarkan 5% pengguna menderita tanpa keputusan.",
            },
            {
              text: "Naikkan batas jadi 2,5x",
              why: "Mengubah aturan agar lolos = menonaktifkan pengaman.",
            },
          ],
        },
        {
          q: "Model teregulasi (kredit) dengan CI/CD penuh. Deploy sebaiknya…",
          options: [
            {
              text: "Full otomatis tanpa manusia",
              why: "Regulator butuh akuntabilitas manusia pada keputusan promosi.",
            },
            {
              text: "Otomatis sampai staging, promosi butuh persetujuan manusia",
              why: "Tepat: kecepatan otomasi + akuntabilitas human-in-the-loop.",
              correct: true,
            },
            {
              text: "Manual semua",
              why: "Membuang manfaat otomasi; yang manual hanya keputusan promosi.",
            },
            {
              text: "Tidak perlu CI/CD",
              why: "Justru model teregulasi paling butuh jejak pipeline yang rapi.",
            },
          ],
        },
        {
          q: "Trigger retraining terbaik untuk model dengan drift musiman?",
          options: [
            {
              text: "Retrain harian",
              why: "Boros dan berisiko overfit pada noise harian.",
            },
            {
              text: "Jadwal selaras musim + trigger degradasi/drift",
              why: "Tepat: frekuensi mengikuti kecepatan perubahan dunia, bukan kalender buta.",
              correct: true,
            },
            {
              text: "Tidak pernah retrain",
              why: "Drift permanen tetap butuh adaptasi.",
            },
            {
              text: "Retrain tiap ada data baru 1 baris",
              why: "Terlalu reaktif; noise memicu churn model.",
            },
          ],
        },
      ],
      summary: [
        "CI/CD ML: trigger (kode/data/jadwal) → validasi → training → evaluasi → quality gate → promosi bertahap.",
        "Quality gate = syarat otomatis dan eksplisit; satu gagal = pipeline berhenti.",
        "Canary: bandingkan vs control dengan aturan angka; rollback otomatis jika gagal.",
        "Retraining otomatis TETAP butuh gate — otomatisasi tanpa gate = bencana cepat.",
        "Trigger: jadwal + degradasi + drift; frekuensi selaras dengan kecepatan dunia.",
        "Tingkat otomasi mengikuti skala dan regulasi; model teregulasi butuh human-in-the-loop.",
      ],
      next: { label: "MLE10 — Scaling: Distributed Training", href: "/v2/learn/mle10-scaling" },
    },
  ],
};
