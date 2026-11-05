import type { V2Lesson } from "../lib/types";

// Timeline insiden: 09:02 anomali -> 09:26 alert -> 09:41 diagnosis -> 10:05 mitigasi.
const INCIDENT_SVG = `<svg viewBox="0 0 480 180" role="img" aria-label="Timeline insiden: anomali 09:02, alert 09:26, diagnosis 09:41, mitigasi 10:05.">
<g font-family="var(--font-ui)">
<line x1="30" y1="90" x2="450" y2="90" stroke="var(--chart-grid)" stroke-width="2"/>
<circle cx="70" cy="90" r="7" fill="var(--c3)"/><text x="70" y="70" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-weight="600">09:02</text><text x="70" y="120" text-anchor="middle" font-size="10" fill="var(--text-muted)">anomali: p95 naik</text>
<circle cx="180" cy="90" r="7" fill="var(--c4)"/><text x="180" y="70" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-weight="600">09:26</text><text x="180" y="120" text-anchor="middle" font-size="10" fill="var(--text-muted)">alert diterima</text>
<circle cx="290" cy="90" r="7" fill="var(--c2)"/><text x="290" y="70" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-weight="600">09:41</text><text x="290" y="120" text-anchor="middle" font-size="10" fill="var(--text-muted)">diagnosis: lock+no index</text>
<circle cx="410" cy="90" r="7" fill="var(--c1)"/><text x="410" y="70" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-weight="600">10:05</text><text x="410" y="120" text-anchor="middle" font-size="10" fill="var(--text-muted)">mitigasi selesai</text>
<path d="M77 82 Q 128 60 173 82" fill="none" stroke="var(--c4)" stroke-width="1.5"/>
<text x="125" y="52" text-anchor="middle" font-size="10" fill="var(--text-muted)">MTTD 24 mnt</text>
<path d="M187 98 Q 298 118 403 98" fill="none" stroke="var(--c1)" stroke-width="1.5"/>
<text x="295" y="140" text-anchor="middle" font-size="10" fill="var(--text-muted)">MTTR 39 mnt</text>
</g></svg>`;

export const dba12: V2Lesson = {
  slug: "dba12-capstone",
  track: "Database Administrator",
  module: "Skala & Cloud",
  title: "DBA12 — Capstone: Operasional Database Produksi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-insiden",
      eyebrow: "Langkah 1 · Cerita",
      title: "Selasa 09:02: semuanya dimulai dari grafik yang sedikit naik",
      prose: [
        "Selasa 09:02, dashboard PayNusa menunjukkan p95 latency checkout naik dari 120 ms ke 400 ms — belum alert (ambang 500 ms), hanya \u201Csedikit naik\u201D. Analis yang sedang buka dashboard mengabaikannya: \u201Cfluktuasi biasa.\u201D 09:26, alert berbunyi: p95 1.800 ms, error rate 4%. 09:41, DBA on-call menemukan dua hal: (1) job ETL baru mengunci tabel orders (ACCESS EXCLUSIVE dari CREATE INDEX non-concurrent), (2) query checkout yang biasanya 30 ms kini full scan karena indeksnya sedang di-build ulang dan terkunci.",
        "10:05, mitigasi selesai: lock dibunuh (pg_terminate_backend setelah verifikasi), index dibangun ulang dengan CONCURRENTLY, traffic pulih. Total: 63 menit dari anomali pertama, 39 menit dari alert. Kerugian: ~Rp180 juta transaksi tertunda + 1.900 checkout gagal.",
        "Twist-nya: tidak ada komponen yang \u201Crusak\u201D. ETL berjalan sesuai jadwal, indeks dibuat dengan niat baik, database mengikuti perintah. Insiden ini 100% kegagalan operasi manusia + proses: deploy indeks tanpa CONCURRENTLY di jam sibuk, alert yang terlambat 24 menit, dan tidak ada runbook \u201Ccheckout lambat\u201D. Capstone ini merangkai SEMUA yang kamu pelajari menjadi satu respons insiden end-to-end.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CInsiden = ada yang rusak\u201D",
        body: "Mayoritas insiden database bukan kerusakan — melainkan interaksi tak terduga antar hal yang \u201Cbenar\u201D sendiri-sendiri: ETL benar, indeks benar, jam sibuk benar; kombinasinya mematikan. Itulah kenapa diagnosis butuh pemahaman arsitektur (DBA2), bukan sekadar \u201Ccari yang merah\u201D.",
        type: "pitfall",
      },
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjalankan operasional database produksi saat insiden.",
        "(1) Menghitung MTTD dan MTTR dari timeline insiden dan membaca artinya;",
        "(2) Menyusun scorecard game day: metrik berbobot + rollback sebagai syarat mutlak;",
        "(3) Menjelaskan kenapa 'kecepatan tanpa jalan pulang' adalah keberanian yang sembrono;",
        "(4) Menulis runbook yang bisa diikuti orang setengah tidur jam 3 pagi.",
      ],
      tasks: [],
    },

    {
      id: "diagnosis",
      eyebrow: "Langkah 3 · Diagnosis",
      title: "Diagnosis sistematis: dari gejala ke akar dalam 15 menit",
      prose: [
        "Cara membaca timeline: empat titik — 09:02 anomali (terlihat tetapi belum alert), 09:26 alert (MTTD = 24 menit — waktu dari anomali ke deteksi), 09:41 diagnosis (15 menit investigasi), 10:05 mitigasi (MTTR = 39 menit dari alert). Interpretasi: MTTD 24 menit adalah kelemahan terbesar — anomali terlihat 24 menit sebelum ada yang bertindak. Alert yang lebih awal (rate-of-change, DBA8) bisa memangkas ini menjadi < 5 menit.",
        "Urutan diagnosis DBA (hafalkan): (1) Apa gejalanya? (p95 naik, error 4% — bukan \u201Cdatabase down\u201D). (2) Kapan mulai & apa yang berubah? (09:02; job ETL baru deploy kemarin). (3) Metrik: lock (pg_locks: ACCESS EXCLUSIVE di orders), plan (EXPLAIN: Seq Scan — indeks terkunci), koneksi & I/O normal. (4) Hipotesis → uji terkecil dulu: cek lock sebelum restart apa pun.",
        "💡 Intuisi: diagnosis yang baik mempersempit, bukan melebar. Setiap pertanyaan harus mengeliminasi separuh kemungkinan: \u201Clock atau bukan? plan atau bukan? disk atau bukan?\u201D DBA senior bukan yang tahu semua jawaban — melainkan yang bertanya dengan urutan yang tepat.",
      ],
      figure: {
        svg: INCIDENT_SVG,
        alt: "Timeline insiden dengan MTTD 24 menit dan MTTR 39 menit.",
        caption: "MTTD 24 mnt (anomali→alert), MTTR 39 mnt (alert→pulih). Kelemahan terbesar: deteksi.",
      },
      tasks: [],
    },
    {
      id: "lab-insiden",
      eyebrow: "Langkah 4 · Lab simulasi",
      title: "Lab: ukur respons insidenmu (MTTD & MTTR)",
      prose: [
        "Diberi empat timestamp: anomali 09:02, alert 09:26, diagnosis 09:41, mitigasi 10:05. Tugasmu: hitung MTTD (Mean Time To Detect = alert − anomali), MTTR (Mean Time To Respond/Recover = mitigasi − alert), dan total durasi anomali→pulih — semua dalam menit.",
        "Interpretasi: MTTD 24 + MTTR 39 = 63 menit total. Benchmark industri untuk tim matang: MTTD < 5 menit (alert proaktif), MTTR < 30 menit (runbook siap). Skor tim ini: deteksi C, respons B. Satu angka tidak cukup — MTTD buruk + MTTR baik = \u201Ccepat bertindak setelah terlambat sadar\u201D, profil klasik tim tanpa monitoring proaktif (DBA8).",
        "Coba eksplorasi: jika alert rate-of-change memangkas MTTD menjadi 5 menit dan runbook memangkas MTTR menjadi 20 menit, berapa totalnya? Dan berapa rupiah yang dihemat jika tiap menit downtime = Rp4,6 juta? (Petunjuk: (63 − total_baru) × 4,6 juta.)",
      ],
      formula: String.raw`\text{MTTD} = t_{\text{alert}} - t_{\text{anomali}} \qquad \text{MTTR} = t_{\text{pulih}} - t_{\text{alert}}`,
      formulaNote: "MTTD mengukur kecepatan DETEKSI (kualitas monitoring/alerting). MTTR mengukur kecepatan RESPONS (kualitas runbook & kesiapan). Keduanya dalam menit; diperbaiki dengan cara berbeda.",
      tasks: [
        { id: "t1", text: "Hitung `mttd_mnt` (alert − anomali)" },
        { id: "t2", text: "Hitung `mttr_mnt` (mitigasi − alert)" },
        { id: "t3", text: "Hitung `total_mnt` (mitigasi − anomali)" },
      ],
      expected: "mttd_mnt=24  mttr_mnt=39  total_mnt=63",
      note: {
        title: "💡 Intuisi: yang diukur yang diperbaiki",
        body: "Tim yang tidak mencatat MTTD/MTTR tidak pernah membaik — karena \u201Cagak lama kemarin\u201D bukan data. Postmortem yang baik selalu menutup dengan angka: berapa MTTD/MTTR insiden ini, dan target berikutnya berapa.",
      },
      hints: [
        "Gunakan datetime(2026,10,13,9,2) dst. dan .total_seconds()/60.",
        "mttd = (t_alert − t_anomali).",
        "total = mttd + mttr (atau selisih langsung).",
      ],
      code: {
        starter: `from datetime import datetime\n\n# Timeline insiden (jangan diubah)\nt_anomali  = datetime(2026, 10, 13, 9, 2)\nt_alert    = datetime(2026, 10, 13, 9, 26)\nt_diagnosa = datetime(2026, 10, 13, 9, 41)\nt_pulih    = datetime(2026, 10, 13, 10, 5)\n\n# TULIS KODEMU: MTTD, MTTR, total (menit, bulatkan)\nmttd_mnt = \nmttr_mnt = \ntotal_mnt = \n\nprint(f"mttd_mnt={mttd_mnt}  mttr_mnt={mttr_mnt}  total_mnt={total_mnt}")`,
        lockLines: 7,
        solution: `from datetime import datetime\n\n# Timeline insiden (jangan diubah)\nt_anomali  = datetime(2026, 10, 13, 9, 2)\nt_alert    = datetime(2026, 10, 13, 9, 26)\nt_diagnosa = datetime(2026, 10, 13, 9, 41)\nt_pulih    = datetime(2026, 10, 13, 10, 5)\n\n# TULIS KODEMU: MTTD, MTTR, total (menit, bulatkan)\nmttd_mnt = round((t_alert - t_anomali).total_seconds() / 60)\nmttr_mnt = round((t_pulih - t_alert).total_seconds() / 60)\ntotal_mnt = round((t_pulih - t_anomali).total_seconds() / 60)\n\nprint(f"mttd_mnt={mttd_mnt}  mttr_mnt={mttr_mnt}  total_mnt={total_mnt}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mttd_mnt", value: 24, tol: 0.01, label: "`mttd_mnt` = 24", msg: "09:26 − 09:02 = 24 menit." },
          { kind: "equal", task: "t2", name: "mttr_mnt", value: 39, tol: 0.01, label: "`mttr_mnt` = 39", msg: "10:05 − 09:26 = 39 menit." },
          { kind: "equal", task: "t3", name: "total_mnt", value: 63, tol: 0.01, label: "`total_mnt` = 63", msg: "24 + 39 = 63 menit." },
          { kind: "stdout_matches", task: "t3", pattern: "mttd_mnt=24\\s+mttr_mnt=39\\s+total_mnt=63", label: "`print` menampilkan tiga angka", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Selisih datetime → .total_seconds()/60.",
    },    {
      id: "lab2-scorecard-gameday",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: scorecard game day",
      prose: [
        "Game day selesai: MTTD 4 menit, MTTR 22 menit, rollback berhasil, RPO 3 menit. Tugasmu: skor tiap metrik vs target (bobot 30/40/30), dengan rollback sebagai syarat mutlak — gagal rollback = skor 0.",
        "Hasil: 100, lolos. Tetapi 'lolos' bukan 'sempurna': catatan kosong hari ini, tetapi MTTR 22 dari target 30 = margin tipis. Scorecard jujur mencatat margin, bukan sekadar lulus/gagal.",
        "Coba juga: andai rollback GAGAL — skor 0 meski MTTD/MTTR bagus. Itulah desain syarat mutlak: kemampuan kembali adalah fondasi; kecepatan tanpa jalan pulang = keberanian yang sembrono.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor`: jumlah bobot metrik yang memenuhi target" },
        { id: "t2", text: "Tentukan `lolos`: skor ≥ 80 DAN rollback berhasil" },
        { id: "t3", text: "Isi `catatan`: metrik yang gagal target" },
      ],
      expected: "skor=100  lolos=True",
      note: {
        title: "Sering salah",
        body: "Menjumlahkan bobot tanpa syarat mutlak rollback. Rollback gagal = 0, bukan 70: tanpa jalan pulang, kecepatan respons tidak ada artinya.",
      },
      hints: [
        "Loop metrik: tambah BOBOT[k] jika HASIL[k] <= TARGET[k].",
        "Jika rollback gagal: skor = 0.",
        "lolos = skor >= 80 and rollback_berhasil.",
      ],
      code: {
        starter: `# Hasil game day: (mttd_mnt, mttr_mnt, rollback_berhasil, rpo_mnt)\nHASIL = {"mttd_mnt": 4, "mttr_mnt": 22, "rollback_berhasil": True, "rpo_mnt": 3}\nTARGET = {"mttd_mnt": 5, "mttr_mnt": 30, "rpo_mnt": 5}\nBOBOT = {"mttd_mnt": 30, "mttr_mnt": 40, "rpo_mnt": 30}  # rollback = syarat mutlak\n# TULIS KODEMU: skor, lolos, catatan\nskor = 0\nlolos = False\ncatatan = []\n`,
        lockLines: 4,
        solution: `# Hasil game day: (mttd_mnt, mttr_mnt, rollback_berhasil, rpo_mnt)\nHASIL = {"mttd_mnt": 4, "mttr_mnt": 22, "rollback_berhasil": True, "rpo_mnt": 3}\nTARGET = {"mttd_mnt": 5, "mttr_mnt": 30, "rpo_mnt": 5}\nBOBOT = {"mttd_mnt": 30, "mttr_mnt": 40, "rpo_mnt": 30}  # rollback = syarat mutlak\n\n# TULIS KODEMU: skor, lolos, catatan\nskor = 0\ncatatan = []\nfor k in ("mttd_mnt", "mttr_mnt", "rpo_mnt"):\n    if HASIL[k] <= TARGET[k]:\n        skor += BOBOT[k]\n    else:\n        catatan.append(k)\nif not HASIL["rollback_berhasil"]:\n    skor = 0\n    catatan.append("rollback_gagal")\nlolos = skor >= 80 and HASIL["rollback_berhasil"]\n\nprint(f"skor={skor}  lolos={lolos}")\nprint(f"catatan={catatan}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "skor", value: 100, label: "`skor` = 100", msg: "30+40+30." },
          { kind: "equal", task: "t2", name: "lolos", value: true, label: "`lolos` = True", msg: "Skor ≥ 80 dan rollback ok." },
          { kind: "equal", task: "t3", name: "catatan", value: [], label: "`catatan` kosong", msg: "Semua di bawah target." },
        ],
      },
      reference: "Game day scorecard: metrik berbobot + syarat mutlak rollback.",
    },

    {
      id: "postmortem",
      eyebrow: "Langkah 6 · Postmortem",
      title: "Postmortem blameless: insiden adalah guru termahal",
      prose: [
        "Setelah pulih, tim menulis postmortem — BUKAN untuk mencari siapa salah, melainkan agar tidak terulang. Format 5 bagian: (1) Ringkasan (apa, kapan, dampak: 63 mnt, Rp180 jt, 1.900 checkout gagal). (2) Timeline faktual (09:02 → 10:05). (3) Akar masalah: 5 Whys — kenapa lock? karena CREATE INDEX non-concurrent; kenapa non-concurrent? karena runbook ETL tidak menyebutkannya; kenapa? karena tidak ada review DBA untuk job baru… hingga ke proses, bukan orang.",
        "(4) Yang berjalan baik: diagnosis 15 menit (urutan tepat), mitigasi tanpa data hilang. (5) Action items dengan pemilik & tanggal: alert rate-of-change p95 (Budi, 2 minggu), larangan DDL non-concurrent jam 07–22 via policy (Sari, 1 minggu), runbook \u201Ccheckout lambat\u201D (DBA on-call, 1 minggu), review DBA untuk job ETL baru (lead, segera).",
        "💡 Intuisi: postmortem tanpa action item bertanggal = arsip; action item tanpa pemilik = angan-angan. Dan \u201Cblameless\u201D bukan berarti \u201Ctanpa akuntabilitas\u201D — akuntabilitasnya ada pada SISTEM yang membiarkan kesalahan manusia menjadi insiden (tidak ada guardrail), bukan pada manusianya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: \u201CPenyebabnya human error, kasus ditutup\u201D",
        body: "\u201CHuman error\u201D bukan akar masalah — ia adalah titik awal investigasi. Manusia akan selalu salah; sistem yang baik membuatnya sulit salah (guardrail: larang DDL berat jam sibuk via policy, bukan via harapan). Postmortem berhenti di \u201Chuman error\u201D = insiden akan terulang dengan manusia berbeda.",
        type: "pitfall",
      },
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Saat insiden, satu orang memimpin, sisanya mengeksekusi. Insiden tanpa komandan = 5 orang menebak 5 hal berbeda. Tunjuk incident commander SEBELUM insiden, bukan saat api menyala.",
        "💡 Postmortem yang baik tidak mencari siapa yang salah — ia mencari apa yang memungkinkan kesalahan itu. 'Siapa' menghasilkan kambing hitam; 'apa' menghasilkan perbaikan sistem.",
      ],
      tasks: [],
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: playbook respons insiden",
      prose: [
        "Skenario 1 — p95 naik tetapi di bawah ambang (seperti 09:02). → Jangan abaikan: cek rate-of-change & apa yang berubah (deploy? job baru?). Alasan: 24 menit MTTD dimulai dari pengabaian ini.",
        "Skenario 2 — Alert bunyi, diagnosis belum jelas. → Ikuti urutan: gejala → perubahan → metrik (lock, plan, koneksi, disk) → hipotesis terkecil. Alasan: struktur mengalahkan kepanikan; jangan restart \u201Csiapa tahu membantu\u201D.",
        "Skenario 3 — Butuh mitigasi tetapi akar belum pasti. → Mitigasi dulu (kill blocker, tambah kapasitas sementara), diagnosis lanjut setelah stabil. Alasan: MTTR lebih penting dari keindahan diagnosis; orang membayar untuk pulih, bukan untuk paham.",
        "Skenario 4 — Insiden selesai. → Postmortem < 48 jam, blameless, action item berpemilik & bertanggal. Alasan: insiden tanpa pembelajaran = biaya hangus; dengan pembelajaran = investasi termahal yang pernah dibayar.",
        "Aturan praktis 10 detik: saat insiden — (1) stabilkan, (2) catat timeline SEJAK MENIT PERTAMA (jangan andalkan ingatan), (3) satu komandan (banyak koki = kekacauan).",
      ],
      tasks: [],
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: merangkai 12 lesson dalam satu malam",
      prose: [
        "Audit insiden PayNusa dengan lensa 12 lesson. DBA1: tidak ada error budget — tim ETL tidak tahu deploy-nya \u201Cberharga\u201D 24 menit MTTD. DBA2: diagnosis memakai arsitektur (lock + plan), bukan tebak-tebakan. DBA3: parameter lock_timeout tidak diset — query menunggu selamanya. DBA4: untung tidak perlu restore (tidak ada data hilang) — tetapi PITR standby jika mitigasi salah. DBA5: replica ikut melambat? Tidak — replica tidak terkunci (DDL me-replay cepat); baca dialihkan sebagian ke replica saat krisis.",
        "DBA6: EXPLAIN menemukan Seq Scan dalam 2 menit — indeks terkunci. DBA7: ETL memakai role dengan hak DDL berlebih — dibatasi setelahnya. DBA8: alert rate-of-change tidak ada — action item #1. DBA9: kapasitas bukan masalah (disk 40%). DBA10: CREATE INDEX tanpa CONCURRENTLY = \u201Cmigrasi skema tanpa strategi\u201D. DBA11: managed tidak akan mencegah ini — lock & indeks adalah sisi kanan garis. DBA12: postmortem menghasilkan 4 action item.",
        "Pembahasan: tidak ada satu lesson yang \u201Cmenyelesaikan\u201D insiden sendirian — tetapi tiap lesson memangkas menit: DBA8 memangkas MTTD (24→5), runbook DBA12 memangkas MTTR (39→20), DBA6 mempercepat diagnosis (15→2). Total baru: ~27 menit vs 63 — hemat 36 menit × Rp4,6 juta = Rp165 juta per insiden sejenis. Pelajaran capstone: DBA bukan 12 keterampilan terpisah, melainkan satu sistem operasi yang bekerja bersama saat tekanan datang.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu — dan kelulusan track",
      prose: [
        "Enam pertanyaan terakhir track ini. Jika kamu bisa menjawab semuanya dengan alasan, kamu berpikir seperti DBA.",
      ],
      tasks: [],
      summary: [
        "Insiden = interaksi hal-hal yang \u201Cbenar\u201D sendiri-sendiri; diagnosis = mempersempit dengan urutan tepat.",
        "MTTD = kualitas deteksi (monitoring); MTTR = kualitas respons (runbook). Ukur keduanya.",
        "Mitigasi dulu, diagnosis indah kemudian; catat timeline sejak menit pertama.",
        "Postmortem blameless: 5 Whys hingga proses, action item berpemilik & bertanggal.",
        "\u201CHuman error\u201D = awal investigasi, bukan akhir. Bangun guardrail, bukan harapan.",
        "12 lesson = satu sistem operasi: tiap lesson memangkas menit dari insiden berikutnya.",
      ],
      next: { label: "DBA13 — Otomasi & Scripting untuk DBA", href: "/v2/learn/dba13-otomasi" },
      quiz: [
        {
          q: "Anomali terlihat 09:02, alert 09:26. Kelemahan terbesar & perbaikannya?",
          options: [
            { text: "MTTR buruk; tambah orang on-call", why: "MTTR 39 menit wajar; masalahnya deteksi 24 menit." },
            { text: "MTTD 24 menit buruk; alert rate-of-change + jangan abaikan anomali sub-ambang", why: "Deteksi terlambat = 24 menit hilang sebelum respons mulai. Inilah yang dipangkas DBA8.", correct: true },
            { text: "Diagnosis terlalu cepat", why: "15 menit diagnosis justru baik." },
            { text: "Timeline tidak penting", why: "Tanpa timeline, MTTD/MTTR tak terukur dan tak membaik." },
          ],
        },
        {
          q: "Alert bunyi, penyebab belum jelas, pengguna terdampak. Prioritas?",
          options: [
            { text: "Cari akar masalah sampai tuntas baru bertindak", why: "Pengguna membayar untuk pulih, bukan untuk diagnosis indah." },
            { text: "Mitigasi dulu (stabilkan), diagnosis lanjut setelahnya", why: "MTTR mengalahkan keindahan analisis. Stabilkan → pahami.", correct: true },
            { text: "Restart database siapa tahu membantu", why: "Aksi tanpa hipotesis = judi dengan data produksi." },
            { text: "Tunggu sampai jelas sendiri", why: "Menunggu = MTTR membengkak tanpa alasan." },
          ],
        },
        {
          q: "Postmortem menyimpulkan \u201Chuman error: operator salah perintah\u201D. Respons tepat?",
          options: [
            { text: "Setuju, kasus ditutup", why: "Berhenti di human error = insiden terulang dengan orang berbeda." },
            { text: "Tolak: gali 5 Whys hingga proses/guardrail yang memungkinkan kesalahan itu", why: "Manusia selalu bisa salah; sistem harus membuatnya sulit salah.", correct: true },
            { text: "Hukum operatornya", why: "Blame mematikan pelaporan jujur insiden berikutnya." },
            { text: "Hapus log-nya", why: "Menghancurkan bukti pembelajaran." },
          ],
        },
        {
          q: "Dua perbaikan: (A) MTTD 24→5 mnt, (B) MTTR 39→20 mnt. Total baru & hemat (Rp4,6 jt/mnt)?",
          options: [
            { text: "44 mnt, hemat Rp87,4 jt", why: "Salah hitung: 5+20=25, bukan 44." },
            { text: "25 mnt total; hemat (63−25)×4,6 = Rp174,8 jt per insiden", why: "Aritmetika capstone: tiap lesson memangkas menit, menit = rupiah.", correct: true },
            { text: "63 mnt, tidak berubah", why: "Perbaikan nyata pada kedua metrik." },
            { text: "5 mnt, hemat Rp266,8 jt", why: "MTTR tidak hilang; ia ikut dihitung." },
          ],
        },
        {
          q: "CREATE INDEX biasa di tabel orders jam 09:00 (jam sibuk). Masalahnya?",
          options: [
            { text: "Tidak ada, indeks itu baik", why: "Indeks baik; CARA membuatnya yang bermasalah." },
            { text: "Lock ACCESS EXCLUSIVE memblokir tulis/baca → pakai CREATE INDEX CONCURRENTLY", why: "Persis akar insiden PayNusa: DDL berat jam sibuk tanpa strategi (DBA6+DBA10).", correct: true },
            { text: "Indeks memperlambat baca", why: "Terbalik: indeks mempercepat baca." },
            { text: "Harus di replica", why: "Indeks dibutuhkan di primary untuk query produksi." },
          ],
        },
        {
          q: "Setelah 12 lesson, mana pernyataan yang paling DBA?",
          options: [
            { text: "Beli server terbesar agar tidak pernah ada masalah", why: "Mitos DBA2/DBA9: masalah operasi tak selesai dengan hardware." },
            { text: "Pindah ke managed agar tidak perlu belajar database", why: "Mitos DBA11: managed ≠ tanpa pengetahuan." },
            { text: "Keandalan = sistem: arsitektur + operasi + monitoring + respons — tiap bagian memangkas menit & rupiah dari insiden berikutnya", why: "Sintesis track: 12 lesson sebagai satu sistem operasi.", correct: true },
            { text: "Backup harian cukup untuk semua kebutuhan", why: "Mengabaikan RPO/RTO, HA, performa, keamanan — DBA4 saja tidak cukup." },
          ],
        },
        {
          q: "Game day: MTTD 4, MTTR 22, rollback BERHASIL, semua di bawah target. Skor 100, lolos. Tindak lanjutmu?",
          options: [
            { text: "Tidak ada — sempurna", why: "100 = lolos, bukan sempurna. MTTR 22 dari target 30 = margin 8 menit. Tanpa tindak lanjut, margin itu tergerus sampai gagal beneran." },
            { text: "Catat margin tipis MTTR; targetkan < 15 menit di game day berikut", why: "Tepat: scorecard jujur mencatat margin, bukan sekadar lulus/gagal. Game day adalah latihan: tiap putaran harus menaikkan standar, bukan merayakan angka pas-pasan.", correct: true },
            { text: "Naikkan target agar lebih menantang", why: "Menaikkan target tanpa memperbaiki kemampuan = menetapkan kegagalan. Perbaiki dulu (otomasi, runbook), target mengikuti." },
            { text: "Kurangi frekuensi game day — sudah lolos", why: "Mengurangi latihan karena 'sudah bisa' = cara tercepat menjadi tidak bisa. Keandalan adalah otot: tidak dilatih = menyusut." },
          ],
        },
      ],
    },
  ],
};
