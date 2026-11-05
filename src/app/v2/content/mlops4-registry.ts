import type { V2Lesson } from "../lib/types";

// Siklus stage model: staging -> production, production lama turun ke staging,
// model gagal -> archived. Hanya satu production dalam satu waktu.
const STAGE_SVG = `<svg viewBox="0 0 480 190" role="img" aria-label="Diagram siklus stage: staging ke production, lalu archived.">
<defs><marker id="arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 1 L 9 5 L 0 9 z" fill="var(--text-muted)"/></marker></defs>
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="30" y="60" width="110" height="60" rx="10" fill="none" stroke="var(--chart-grid)" stroke-width="2"/>
<text x="85" y="86" fill="var(--text)" font-weight="600">staging</text>
<text x="85" y="104" fill="var(--text-muted)" font-size="11">diuji, belum live</text>
<rect x="185" y="60" width="110" height="60" rx="10" fill="none" stroke="var(--c1)" stroke-width="3"/>
<text x="240" y="86" fill="var(--text)" font-weight="700">production</text>
<text x="240" y="104" fill="var(--text-muted)" font-size="11">melayani trafik</text>
<rect x="340" y="60" width="110" height="60" rx="10" fill="none" stroke="var(--chart-grid)" stroke-width="2"/>
<text x="395" y="86" fill="var(--text)" font-weight="600">archived</text>
<text x="395" y="104" fill="var(--text-muted)" font-size="11">pensiun, tetap ada</text>
</g>
<g stroke="var(--text-muted)" stroke-width="1.8">
<line x1="140" y1="80" x2="183" y2="80" marker-end="url(#arr2)"/>
<line x1="295" y1="80" x2="338" y2="80" marker-end="url(#arr2)"/>
<path d="M 240 120 C 240 155, 85 155, 85 122" fill="none" marker-end="url(#arr2)"/>
</g>
<text x="161" y="70" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">promote</text>
<text x="317" y="70" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">pensiun</text>
<text x="162" y="162" text-anchor="middle" font-size="11" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">rollback = promote versi lama (1 klik)</text>
<text x="240" y="182" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">aturan: hanya SATU production dalam satu waktu</text>
</svg>`;

const MLOPS4_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Selisih AUC challenger vs ambang signifikansi: v2.3 selisih 0,005 di bawah ambang 0,006, v2.4 selisih 0,008 di atas ambang."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0,004</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0,008</text><rect x="85.7" y="80.0" width="129.6" height="100.0" rx="3" fill="var(--c4)"/><text x="150.5" y="74.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">0,005 &lt; 0,006: TOLAK</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">v2.3: Δ0,005</text><rect x="294.7" y="20.0" width="129.6" height="160.0" rx="3" fill="var(--c1)"/><text x="359.5" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">0,008 &gt; 0,004: LOLOS</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">v2.4: Δ0,008</text><line x1="46" y1="60.0" x2="464" y2="60.0" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="460" y="54.0" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">ambang 2×SE</text></svg>`;

export const mlops4: V2Lesson = {
  slug: "mlops4-registry",
  track: "MLOps",
  module: "Fondasi Operasi",
  title: "MLOps4 — Model Registry & Versioning",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Enam jam mencari model_final_v2_REAL.pkl",
      prose: [
        "Jumat malam, model fraud baru mulai memblokir transaksi legit — false positive naik 5x. Tim memutuskan rollback ke versi sebelumnya. Masalahnya: tidak ada yang tahu versi mana yang sedang live. Di shared folder ada model_final.pkl, model_final_v2.pkl, model_final_v2_REAL.pkl, dan model_final_v2_REAL_fix.pkl — tanpa tanggal, tanpa catatan, tanpa pemilik.",
        "Butuh 6 jam untuk menelusuri: versi mana yang di-deploy, dilatih dari data apa, dan apakah file-nya masih cocok dengan kode serving. Enam jam false positive, komplain nasabah menumpuk, dan tim begadang menebak-nebak file.",
        "Twist-nya: rollback seharusnya SATU KLIK. Di perusahaan dengan model registry, insiden ini selesai dalam 5 menit: lihat versi production saat ini, klik 'promote' versi sebelumnya, selesai — lengkap dengan jejak audit siapa melakukan apa. Registry mengubah rollback dari detektif menjadi tombol.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa registry berbeda dari sekadar folder berisi file .pkl; (2) menghitung berapa sampel yang dibutuhkan agar kemenangan challenger signifikan secara statistik; (3) merancang stage (staging → production → archived) dengan aturan promosi yang eksplisit; (4) melakukan rollback ke versi sebelumnya dalam hitungan menit, bukan jam.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Versioning model = menyimpan file dengan nama berbeda'",
        type: "pitfall",
        body: "Nama file bukan versioning. Versioning sejati = identitas unik tak terbantahkan + metadata (data training, parameter, metrik, siapa, kapan) + stage (staging/production/archived) + jejak audit perubahan. 'v2_REAL_fix' adalah arkeologi, bukan engineering.",
      },
      reference: "Registry = identitas + metadata + stage + audit. Nama file bukan versioning.",
    },
    {
      id: "registry",
      eyebrow: "Langkah 2 · Model registry",
      title: "KTP untuk setiap model",
      prose: [
        "Model registry adalah katalog terpusat semua versi model. Setiap entri punya: nama + nomor versi (identitas), stage (staging/production/archived — status hidupnya), metrik (AUC, latensi di validasi), artefak (file model itu sendiri), lineage (data & kode apa yang menghasilkannya), dan jejak audit (siapa promote kapan).",
        "Stage adalah konsep kuncinya. Staging = 'sedang diuji, keputusannya belum dipakai'. Production = 'melayani trafik nyata, satu-satunya'. Archived = 'pensiun tapi tetap tersimpan untuk audit'. Aturan keras: hanya SATU versi production per model dalam satu waktu — promote versi baru otomatis mendemote yang lama.",
        "Kenapa archived bukan delete? Regulator, auditor, atau investigasi insiden 8 bulan kemudian butuh menjawab 'model versi berapa yang menolak nasabah X pada 14 Maret?' Model yang dihapus = jawaban yang hilang selamanya.",
        "💡 Intuisi: registry seperti catatan sipil. Setiap model punya akta kelahiran (register), status perkawinan (stage), dan riwayat hidup (audit). Tanpa catatan sipil, kamu tidak bisa membuktikan siapa siapa — dan saat sengketa (insiden/audit), yang tidak tercatat dianggap tidak ada.",
      ],
      figure: {
        svg: STAGE_SVG,
        alt: "Diagram siklus stage: staging ke production, lalu archived.",
        caption: "Siklus stage: staging → production (promote), production lama turun saat versi baru naik, gagal → archived. Rollback = promote versi lama. Cara membaca: kotak = stage, panah = transisi yang diizinkan; hanya SATU versi di production dalam satu waktu. Interpretasi: rollback bukan operasi darurat khusus — ia transisi biasa yang sudah dirancang, sehingga insiden Senin pagi selesai dalam 5 menit, bukan 6 jam.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Model lama yang sudah diganti boleh dihapus'",
        type: "pitfall",
        body: "Menghapus = menghancurkan bukti. Kasus nyata: sengketa penolakan kredit 8 bulan kemudian; bank tidak bisa menunjukkan model versi berapa yang memutuskan — denda regulator. Archive itu murah (storage), delete itu mahal (risiko hukum). Retensi minimal mengikuti regulasi industri (perbankan: umumnya 5 tahun).",
      },
      reference: "Archive, jangan delete. Storage murah; bukti yang hilang mahal.",
    },
    {
      id: "champion",
      eyebrow: "Langkah 3 · Champion & challenger",
      title: "Dua model, satu tahta",
      prose: [
        "Pola operasi standar: champion = versi production saat ini (sang juara bertahan). Challenger = versi staging yang menantang (calon pengganti). Challenger harus MEMBUKTIKAN diri — lewat shadow testing atau canary — sebelum merebut tahta. Tidak ada kudeta tanpa bukti.",
        "Versioning model memakai tiga angka seperti software: mayor.minor.patch. Mayor = berubah arsitektur/data secara fundamental (v1 → v2: ganti algoritma). Minor = retrain dengan data baru, arsitektur sama (v2.1 → v2.2). Patch = perbaikan kecil (bug preprocessing). Nomor ini memberi tahu seberapa 'berani' perubahannya — dan seberapa ketat pengujiannya harus.",
        "Metadata yang wajib dicatat tiap versi: hash data training (data snapshot persis), parameter & seed, metrik validasi, dependensi (library version!), dan approver. 'Dependensi' sering dilupakan: model yang sama dengan scikit-learn beda versi bisa memberi skor beda.",
        "💡 Intuisi: nomor versi seperti gelar akademik. 'v3.0.0' vs 'v2.7.3' langsung memberi tahu: ini revolusi atau evolusi. Tanpa nomor yang bermakna, semua update terlihat sama berbahayanya — dan tim jadi takut deploy apa pun.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mencatat metrik tapi lupa mencatat DATA dan LIBRARY. 'AUC 0,87' tanpa hash dataset = angka tanpa konteks: tidak bisa direproduksi, tidak bisa dibandingkan antar versi. Reproduksibilitas = kode + data + environment, ketiganya berversion.",
      },
      reference: "Champion vs challenger; versioning mayor.minor.patch; catat data + lib, bukan cuma metrik.",
    },
    {
      id: "lab-registry",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: registry dengan promote & rollback",
      prose: [
        "Kita bangun registry mini: `register` mendaftarkan versi (mulai di staging), `promote` memindahkan stage (dengan aturan satu production), `archive` mempensiunkan versi gagal.",
        "Tugasmu: lengkapi `promote` — saat target adalah production, demote dulu versi production lama ke staging, catat semuanya di jejak audit. Lalu jalankan skenario: v2 naik ke production, v3 diuji di staging, v3 gagal canary → archive, v2 tetap bertahan.",
        "Cara membaca: baris 'PRODUCTION saat ini' = jawaban 5-detik saat insiden. Interpretasi: jejak audit menunjukkan SETIAP perubahan stage — inilah yang tidak dimiliki tim 'model_final_v2_REAL.pkl'.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `promote`: demote production lama bila target = production" },
        { id: "t2", text: "Pastikan tiap aksi tercatat di `_log`" },
        { id: "t3", text: "Jalankan skenario v2 → production, v3 → staging → archived" },
      ],
      expected: "PRODUCTION: fraud-scorer v2 (auc=0.852) · 6 baris audit",
      note: {
        title: "💡 Intuisi: promote adalah upacara, bukan sekadar pindah file",
        body: "Tiap promote = keputusan tercatat: SIAPA memindahkan, KAPAN, dari stage apa ke apa. Upacara ini yang membuat rollback aman — karena kamu tahu persis apa yang diganti dan bisa mengembalikannya. Tanpa upacara, deploy = lempar file ke server dan berdoa.",
      },
      hints: [
        "Di promote: loop semua versi; jika nama sama dan stage == 'production', ubah ke 'staging' + catat DEMOTE.",
        "Lalu ubah stage versi target dan catat PROMOTE.",
        "Skenario sudah disiapkan di bawah kelas — fokus lengkapi method-nya.",
      ],
      code: {
        starter: `import random\nrandom.seed(44)\n\nclass Registry:\n    def __init__(self):\n        self._versi = {}\n        self._log = []\n\n    def register(self, nama, ver, metrik):\n        self._versi[(nama, ver)] = {"stage": "staging", "metrik": metrik}\n        self._log.append(f"REGISTER {nama} v{ver} (auc={metrik['auc']:.3f}) -> staging")\n\n    def promote(self, nama, ver, stage_tujuan):\n        # TULIS KODEMU: demote production lama + catat audit\n        \n\n    def archive(self, nama, ver):\n        self._versi[(nama, ver)]["stage"] = "archived"\n        self._log.append(f"ARCHIVE  {nama} v{ver}")\n\n    def production(self, nama):\n        for (n, ver), v in self._versi.items():\n            if n == nama and v["stage"] == "production":\n                return ver, v["metrik"]\n        return None, None\n\nreg = Registry()\nfor ver, auc in [(1, 0.820), (2, 0.851), (3, 0.873)]:\n    reg.register("fraud-scorer", ver, {"auc": auc + random.gauss(0, 0.001)})\n\nreg.promote("fraud-scorer", 2, "production")\nreg.promote("fraud-scorer", 3, "staging")\nreg.archive("fraud-scorer", 3)   # v3 gagal canary -> rollback\n\nver_live, metrik = reg.production("fraud-scorer")\nprint(f"Model PRODUCTION saat ini: fraud-scorer v{ver_live} (auc={metrik['auc']:.3f})")\nprint("Jejak audit:")\nfor baris in reg._log:\n    print(" ", baris)`,
        lockLines: 29,
        solution: `import random\nrandom.seed(44)\n\nclass Registry:\n    def __init__(self):\n        self._versi = {}\n        self._log = []\n\n    def register(self, nama, ver, metrik):\n        self._versi[(nama, ver)] = {"stage": "staging", "metrik": metrik}\n        self._log.append(f"REGISTER {nama} v{ver} (auc={metrik['auc']:.3f}) -> staging")\n\n    def promote(self, nama, ver, stage_tujuan):\n        # TULIS KODEMU: demote production lama + catat audit\n        kunci = (nama, ver)\n        assert kunci in self._versi, "versi tidak dikenal!"\n        if stage_tujuan == "production":\n            for k, v in self._versi.items():\n                if k[0] == nama and v["stage"] == "production":\n                    v["stage"] = "staging"\n                    self._log.append(f"DEMOTE   {k[0]} v{k[1]} production -> staging")\n        self._versi[kunci]["stage"] = stage_tujuan\n        self._log.append(f"PROMOTE  {nama} v{ver} -> {stage_tujuan}")\n\n    def archive(self, nama, ver):\n        self._versi[(nama, ver)]["stage"] = "archived"\n        self._log.append(f"ARCHIVE  {nama} v{ver}")\n\n    def production(self, nama):\n        for (n, ver), v in self._versi.items():\n            if n == nama and v["stage"] == "production":\n                return ver, v["metrik"]\n        return None, None\n\nreg = Registry()\nfor ver, auc in [(1, 0.820), (2, 0.851), (3, 0.873)]:\n    reg.register("fraud-scorer", ver, {"auc": auc + random.gauss(0, 0.001)})\n\nreg.promote("fraud-scorer", 2, "production")\nreg.promote("fraud-scorer", 3, "staging")\nreg.archive("fraud-scorer", 3)   # v3 gagal canary -> rollback\n\nver_live, metrik = reg.production("fraud-scorer")\nprint(f"Model PRODUCTION saat ini: fraud-scorer v{ver_live} (auc={metrik['auc']:.3f})")\nprint("Jejak audit:")\nfor baris in reg._log:\n    print(" ", baris)`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "PRODUCTION saat ini: fraud-scorer v2 \\(auc=0\\.852\\)", label: "v2 tetap production", msg: "Setelah v3 di-archive, production harus kembali/fix di v2 dengan auc 0.852." },
          { kind: "stdout_matches", task: "t3", pattern: "PROMOTE  fraud-scorer v2 -> production", label: "Audit promote v2", msg: "Jejak audit harus mencatat promote v2 ke production." },
          { kind: "stdout_matches", task: "t3", pattern: "ARCHIVE  fraud-scorer v3", label: "Audit archive v3", msg: "Jejak audit harus mencatat archive v3 yang gagal canary." },
        ],
      },
      reference: "promote = demote lama + catat. Rollback = promote versi lama.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kapan promote otomatis, kapan manual?",
      prose: [
        "**Skenario 1 — Retrain rutin, metrik stabil.** Model churn di-retrain bulanan, 6 bulan terakhir AUC 0,84±0,01. → Promote otomatis staging → production dengan gerbang kualitas (lihat MLOps5). Risiko rendah, pola terbukti.",
        "**Skenario 2 — Perubahan mayor / model baru.** v1 → v2 ganti algoritma. → WAJIB manual: review manusia + shadow/canary + sign-off risk. Otomatisasi di sini = bunuh diri.",
        "**Skenario 3 — Banyak model, sedikit tim.** 40 model scoring, tim 3 orang. → Otomatisasi dengan guardrail ketat + daftar pengecualian manual untuk 5 model kritis. Manusia fokus di mana risikonya besar.",
        "**Skenario 4 — Archive vs delete.** Model lama tidak dipakai 1 tahun. → Archive SELALU; delete HANYA jika regulasi retensi mengizinkan DAN sudah lewat masa retensi. 'Tidak dipakai' ≠ 'tidak dibutuhkan sebagai bukti'.",
        "Aturan praktis 10 detik: tanyakan 'jika promote ini salah, berapa lama sampai ketahuan dan berapa kerugiannya?' Terdeteksi <1 jam & murah → otomatis boleh. Terdeteksi lama atau mahal → manusia dulu.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: otomasi itu autopilot, bukan tanpa pilot",
        body: "Pesawat autopilot tetap punya pilot yang mengawasi dan mengambil alih saat cuaca buruk. Promote otomatis = autopilot: hebat untuk rute rutin yang sudah dipetakan, berbahaya untuk rute baru yang belum dikenal. Bedakan keduanya dengan versioning mayor vs minor.",
      },
      reference: "Otomatis untuk minor/rutin; manual untuk mayor/baru. Ukur dengan biaya kesalahan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Insiden 6 jam vs insiden 5 menit",
      prose: [
        "Dua perusahaan, insiden identik: model fraud false positive 5x lipat, Jumat malam. Perusahaan A (tanpa registry): 6 jam identifikasi versi + rollback manual. Perusahaan B (dengan registry): 5 menit — lihat dashboard, promote v_sebelumnya, selesai.",
        "Angka: 6 jam × 5.000 transaksi/jam × 2% false positive × Rp75.000 biaya penanganan komplain = 6 × 5.000 × 0,02 × 75.000 = Rp45.000.000. Perusahaan B: 5 menit ≈ Rp625.000. Selisih satu insiden: Rp44,4 juta — belum termasuk lembur tim dan reputasi.",
        "**Pertanyaan:** (1) Komponen registry apa yang memangkas 6 jam jadi 5 menit? (2) Jika insiden serupa terjadi 3x setahun, berapa nilai registry per tahun? (3) Kenapa 'kita ingat kok versinya' bukan strategi?",
        "**Pembahasan:** (1) Stage yang jelas (tahu persis versi production) + promote 1-klik + audit (tahu apa yang berubah). (2) 3 × Rp44,4 jt = Rp133,2 jt/tahun — vs biaya membangun registry sederhana yang jauh lebih kecil. (3) Ingatan manusia tidak bisa diaudit, tidak tahan turnover karyawan, dan gagal tepat saat panik — yaitu saat paling dibutuhkan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "RTO (Recovery Time Objective) untuk model kritis harus didefinisikan seperti sistem kritis lain. 'Rollback 6 jam' untuk fraud scoring = 6 jam tanpa pertahanan. Registry dengan promote 1-klik adalah kontrol keberlangsungan bisnis (BCM), bukan sekadar kerapian.",
      },
      reference: "Rp44,4 jt per insiden = harga tidak punya tombol rollback.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Kapan challenger boleh naik tahta: hitung, jangan rasa",
      prose: [
        "Kasus nyata: challenger mencatat AUC 0,915 vs champion 0,910 pada 10.000 sampel validasi. Tim bersorak — `naik 0,005!` — dan mempromosikannya Jumat sore. Senin pagi metrik produksi TURUN. Apa yang terjadi? Selisih 0,005 pada 10.000 sampel kemungkinan besar hanya noise. Standard error AUC kira-kira √(AUC(1−AUC)/n) = √(0,91×0,09/10000) ≈ 0,0029. Selisih 0,005 hanya 1,7 standard error — peluang `kemenangan` semu seperti ini muncul sekitar 9% hanya karena kebetulan. Tim mempromosikan noise.",
        "Aturan praktisnya: untuk mengklaim challenger lebih baik dengan tingkat kepercayaan 95%, butuh selisih Δ > 2 × SE. Dengan n = 10.000, SE ≈ 0,0029, maka Δ_min ≈ 0,006. Challenger 0,915 vs 0,910 (selisih 0,005) BELUM cukup bukti. Berapa sampel yang dibutuhkan agar selisih 0,005 signifikan? SE harus < 0,0025 → n > 0,91×0,09/0,0025² ≈ 13.100. Jadi dengan ~13–15 ribu sampel validasi, kemenangan 0,005 baru bisa dipercaya. Di bawah itu, `challenger menang` = undian.",
        "Ini bukan alasan untuk tidak pernah promosi — ini alasan untuk punya ATURAN promosi yang tertulis di registry. Contoh aturan yang defensibel: (1) challenger harus mengalahkan champion pada metrik PRIMER (AUC) dengan Δ > 2×SE pada minimal 15.000 sampel; (2) tidak boleh kalah lebih dari 0,002 pada metrik SEKUNDER (presisi@10%, kalibrasi); (3) lolos uji slice: tidak ada segmen (gender, wilayah, tenor) yang turun > 0,01; (4) lolos shadow 2 minggu. Empat gerbang ini ditulis sebagai `promotion policy` di registry — bukan di kepala seseorang.",
        "Contoh penerapan: challenger v2.4 mencatat AUC 0,918 vs champion 0,910 pada 20.000 sampel. SE ≈ √(0,91×0,09/20000) ≈ 0,0020; Δ = 0,008 > 2×SE = 0,004 ✓. Metrik sekunder: presisi@10% 0,72 vs 0,71 ✓. Slice: semua segmen naik atau datar ✓. Shadow 2 minggu: distribusi skor konsisten ✓. Empat gerbang lolos → promote otomatis diizinkan. Bandingkan dengan v2.3 yang `menang 0,005 pada 10.000 sampel` — gerbang 1 menolaknya, dan tim terhindar dari insiden Senin pagi.",
        "Registry juga mencatat ALASAN setiap promosi: siapa yang approve, angka-angka gerbangnya, timestamp-nya. Enam bulan kemudian saat auditor (atau direksi) bertanya `kenapa model ini yang live?`, jawabannya bukan `kata Dimas` melainkan satu baris query: v2.4, approved by Rina, ΔAUC 0,008 (p<0,05), 4 gerbang lolos, 2026-08-14 10:32. Inilah bedanya registry dengan folder berisi `model_final_v2_REAL.pkl`: yang satu akuntabel, yang satu arkeologi.",
        "Biaya promosi yang salah juga konkret. Champion yang `kalah` padahal seharusnya menang: jika challenger semu menurunkan AUC produksi 0,003 pada 10.000 keputusan/hari dengan biaya keputusan buruk Rp150 ribu dan hubungan kasar 2×ΔAUC → peluang salah, maka kerugian ≈ 10.000 × 24 × 0,006 × Rp150rb ≈ Rp216 juta/hari. Aturan promosi yang menolak noise bukan birokrasi — ia asuransi Rp216 juta per hari.",
        "Terakhir: simpan champion lama di stage `archived`, JANGAN dihapus. Rollback = promote versi lama kembali ke production — satu klik, < 5 menit. Syaratnya: artefak lama (model + environment + fitur) masih utuh dan bisa di-serve. Registry yang menghapus versi lama demi `hemat storage` (Rp50 ribu/bulan) menghancurkan kemampuan rollback senilai Rp216 juta/hari. Storage itu murah; penyesalan itu mahal.",
        "Satu jebakan terakhir: promosi otomatis tanpa batas. Aturan 4 gerbang BOLEH dieksekusi otomatis (pipeline mempromosikan sendiri saat semua hijau), TAPI hanya untuk model dengan dampak di bawah ambang tertentu — misal tidak menyentuh keputusan kredit di atas Rp100 juta. Untuk model high-stakes, gerbang otomatis menyiapkan REKOMENDASI, manusia yang menekan tombol. Alasannya: statistik tidak menangkap konteks bisnis. Challenger yang menang 0,008 dua hari sebelum regulasi baru berlaku mungkin tetap harus ditahan. Otomatisasi mempercepat yang rutin; manusia menjaga yang berisiko. Tulis batas ini di promotion policy yang sama: `auto-promote diizinkan untuk dampak < Rp100 juta; di atas itu butuh sign-off manusia`.",
      ],
      formula: String.raw`\Delta_{min} \approx 2 \times \sqrt{\frac{AUC \cdot (1-AUC)}{n}}`,
      formulaNote: "Δ_min = selisih AUC minimum agar kemenangan signifikan (95%); AUC = akurasi champion; n = jumlah sampel validasi. Jika selisih challenger vs champion < Δ_min, perlakukan sebagai seri — jangan promosi berdasarkan noise.",
      figure: {
        svg: MLOPS4_DEEP_SVG,
        alt: "Diagram batang: v2.3 selisih 0,005 di bawah ambang signifikansi (tolak), v2.4 selisih 0,008 di atas ambang (lolos).",
        caption: "Cara membaca: tinggi batang = selisih AUC challenger vs champion; garis putus-putus = ambang signifikansi 2×SE (berbeda per jumlah sampel). Interpretasi: v2.3 `menang` 0,005 tapi di bawah ambang — promosinya adalah undian; v2.4 menang 0,008 di atas ambang — promosinya berdasar bukti.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: promosi model itu sidang, bukan sorak",
        body: "Kemenangan kecil pada sampel kecil hampir selalu noise. Tulis aturan promosi (4 gerbang: primer, sekunder, slice, shadow) di registry SEBELUM ada challenger — karena setelah angkanya keluar, semua orang jadi pengacara bagi model favoritnya.",
      },
      reference: "Δ > 2×SE pada ≥15rb sampel + 4 gerbang. Arsipkan champion lama — rollback adalah promote ulang.",
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
        "Registry = identitas + metadata + stage + audit; nama file bukan versioning.",
        "Stage: staging → production → archived; hanya satu production; archive jangan delete.",
        "Champion bertahan, challenger membuktikan diri sebelum merebut tahta.",
        "Versioning mayor.minor.patch memberi tahu seberapa berani perubahan.",
        "Otomatis untuk rutin/minor; manual untuk mayor/baru — ukur dengan biaya kesalahan.",
      ],
      next: { label: "MLOps5 — CI/CD untuk Model", href: "/learn/mlops5-cicd" },
      quiz: [
        {
          q: "Apa yang MEMBEDAKAN registry dari sekadar folder berisi file model?",
          options: [
            { text: "Foldernya lebih rapi", why: "Kerapian bukan jaminan apa pun saat insiden." },
            { text: "Identitas unik + metadata + stage + jejak audit perubahan", why: "Empat hal inilah yang memangkas rollback 6 jam jadi 5 menit.", correct: true },
            { text: "File-nya dikompresi", why: "Kompresi soal storage, bukan soal operasional." },
            { text: "Hanya bisa diakses admin", why: "Akses kontrol penting tapi bukan pembeda utama." },
          ],
        },
        {
          q: "v3 di-staging gagal canary. Tindakan registry yang benar?",
          options: [
            { text: "Hapus v3 agar tidak membingungkan", why: "Menghapus = menghancurkan bukti untuk post-mortem." },
            { text: "Archive v3; production tetap di v2 (champion bertahan)", why: "Challenger gagal = ia pensiun ke archived dengan catatan; champion tidak terganggu.", correct: true },
            { text: "Paksa promote v3, siapa tahu membaik", why: "'Siapa tahu' bukan strategi deploy. Canary gagal = bukti, bukan opini." },
            { text: "Rollback ke v1 yang paling tua", why: "Rollback = ke versi TERAKHIR yang terbukti (v2), bukan yang tertua." },
          ],
        },
        {
          q: "Kenapa metrik saja tidak cukup sebagai metadata versi?",
          options: [
            { text: "Metrik bisa dimanipulasi", why: "Bukan itu masalah utamanya di sini." },
            { text: "Tanpa hash data + versi library, hasil tidak bisa direproduksi/dibandingkan", why: "AUC 0,87 tanpa konteks data & environment = angka yatim piatu.", correct: true },
            { text: "Metrik terlalu teknis", why: "Metrik justru bahasa bersama tim." },
            { text: "Metrik berubah-ubah", why: "Metrik versi tercatat tidak berubah; yang hilang adalah konteksnya." },
          ],
        },
        {
          q: "Model retrain bulanan, 6 bulan AUC stabil 0,84±0,01. Kebijakan promote?",
          options: [
            { text: "Manual selalu — otomasi berbahaya", why: "Terlalu konservatif untuk pola rutin terbukti; membuang waktu tim." },
            { text: "Otomatis dengan gerbang kualitas; manual hanya untuk perubahan mayor", why: "Risiko rendah + pola terbukti = autopilot aman. Manusia siaga untuk anomali.", correct: true },
            { text: "Otomatis tanpa gerbang — sudah stabil 6 bulan", why: "Tanpa gerbang, satu batch data korup lolos diam-diam. Stabilitas masa lalu ≠ jaminan." },
            { text: "Jangan pernah promote — yang stabil jangan diganggu", why: "Itu berarti tidak pernah retrain — kembali ke pembusukan MLOps1." },
          ],
        },
        {
          q: "Bank tidak bisa menunjukkan model versi berapa yang menolak nasabah 8 bulan lalu. Akar masalah?",
          options: [
            { text: "Modelnya tidak akurat", why: "Akurasi tidak relevan dengan ketertelusuran." },
            { text: "Tidak ada registry + kebijakan archive: versi & lineage tidak tercatat", why: "Tanpa identitas versi, metadata, dan archive, pertanyaan audit tidak terjawab. Ini risiko hukum.", correct: true },
            { text: "Nasabahnya memang tidak layak", why: "Tidak bisa dinilai tanpa tahu model versinya." },
            { text: "Regulator terlalu ketat", why: "Ketertelusuran keputusan otomatis adalah standar wajar industri finansial." },
          ],
        },
        {
          q: "Challenger mencatat AUC 0,913 vs champion 0,910 pada 8.000 sampel validasi. Keputusan promosi yang TEPAT?",
          options: [
            { text: "Promosikan — 0,913 > 0,910, angka tidak berbohong", why: "Angka tidak berbohong tapi BISA menipu: SE ≈ √(0,91×0,09/8000) ≈ 0,0032, selisih 0,003 < 1×SE. Ini murni noise — promosi = undian Rp216 juta/hari." },
            { text: "Tolak promosi; selisih 0,003 di bawah ambang signifikansi untuk n=8.000", why: "Tepat. Δ_min ≈ 2×0,0032 = 0,0064; selisih 0,003 jauh di bawahnya. Minta evaluasi pada ≥15.000 sampel atau terima hasil seri.", correct: true },
            { text: "Promosikan parsial 50% traffic untuk `mengumpulkan bukti`", why: "Canary 50% dengan bukti lemah = setengah produksi dijadikan kelinci percobaan untuk hipotesis yang belum signifikan. Kumpulkan bukti DULU di validasi/shadow, baru canary." },
            { text: "Buang challenger — tidak pernah ada gunanya selisih sekecil itu", why: "Selisih kecil pada sampel BESAR bisa signifikan dan berharga. Yang salah bukan selisihnya, melainkan sampelnya yang terlalu kecil untuk membuktikan apa pun." },
          ],
        },
      ],
    },
  ],
};
