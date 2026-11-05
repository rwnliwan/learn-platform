import type { V2Lesson } from "../lib/types";

// Rantai lineage: data snapshot -> fitur -> training -> model -> keputusan,
// masing-masing dengan siapa & kapan.
const LINEAGE_SVG = `<svg viewBox="0 0 480 200" role="img" aria-label="Rantai lineage dari data snapshot hingga keputusan K-88121.">
<defs><marker id="arr3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 1 L 9 5 L 0 9 z" fill="var(--text-muted)"/></marker></defs>
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<rect x="8" y="70" width="88" height="52" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/><text x="52" y="92" fill="var(--text)" font-weight="600">data</text><text x="52" y="108" fill="var(--text-muted)" font-size="10">s3://.../10-01</text>
<rect x="112" y="70" width="88" height="52" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/><text x="156" y="92" fill="var(--text)" font-weight="600">fitur</text><text x="156" y="108" fill="var(--text-muted)" font-size="10">pipeline v7</text>
<rect x="216" y="70" width="88" height="52" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="2"/><text x="260" y="92" fill="var(--text)" font-weight="600">model</text><text x="260" y="108" fill="var(--text-muted)" font-size="10">fraud-scorer v3</text>
<rect x="320" y="70" width="88" height="52" rx="8" fill="none" stroke="var(--c1)" stroke-width="2.5"/><text x="364" y="92" fill="var(--text)" font-weight="700">keputusan</text><text x="364" y="108" fill="var(--text-muted)" font-size="10">K-88121</text>
<rect x="320" y="8" width="88" height="40" rx="8" fill="none" stroke="var(--c4)" stroke-width="2"/><text x="364" y="25" fill="var(--text)" font-weight="600" font-size="11">approve</text><text x="364" y="40" fill="var(--text-muted)" font-size="10">budi (risk head)</text>
</g>
<g stroke="var(--text-muted)" stroke-width="1.5"><line x1="96" y1="96" x2="110" y2="96" marker-end="url(#arr3)"/><line x1="200" y1="96" x2="214" y2="96" marker-end="url(#arr3)"/><line x1="304" y1="96" x2="318" y2="96" marker-end="url(#arr3)"/><line x1="364" y1="48" x2="364" y2="68" marker-end="url(#arr3)"/></g>
<text x="240" y="150" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">setiap panah = tercatat siapa, kapan, dengan apa</text>
<text x="240" y="170" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">tanpa rantai ini, "model versi berapa?" tidak terjawab</text>
</svg>`;

const MLOPS10_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Keterisian field model card Bank Mini: field kritis berbobot 3 kosong semua, field lain terisi sebagian."><text x="142" y="51.0" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Batasan pakai (3)</text><rect x="150" y="38.0" width="0.0" height="18" rx="3" fill="var(--c4)"/><text x="156.0" y="51.0" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">KOSONG</text><text x="142" y="85.0" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Bias &amp; slice (3)</text><rect x="150" y="72.0" width="0.0" height="18" rx="3" fill="var(--c4)"/><text x="156.0" y="85.0" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">KOSONG</text><text x="142" y="119.0" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Persetujuan (2)</text><rect x="150" y="106.0" width="314.0" height="18" rx="3" fill="var(--c1)"/><text x="470.0" y="119.0" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">terisi</text><text x="142" y="153.0" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Monitoring (2)</text><rect x="150" y="140.0" width="157.0" height="18" rx="3" fill="var(--c3)"/><text x="313.0" y="153.0" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">sebagian</text><text x="142" y="187.0" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Lainnya (1)</text><rect x="150" y="174.0" width="251.2" height="18" rx="3" fill="var(--c1)"/><text x="407.2" y="187.0" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">terisi</text></svg>`;

export const mlops10: V2Lesson = {
  slug: "mlops10-governance",
  track: "MLOps",
  module: "Governance & Skala",
  title: "MLOps10 — Governance: Audit & Lineage",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga pertanyaan yang tidak terjawab",
      prose: [
        "OJK datang dengan tiga pertanyaan sederhana tentang penolakan kredit nasabah X pada 14 Maret: (1) model versi berapa yang memutuskan? (2) data apa yang melatih versi itu? (3) siapa yang menyetujui deploy-nya?",
        "Tim Bank Mini tidak bisa menjawab satu pun. Model di-deploy dari laptop analis yang sudah resign. Data training 'kayaknya dari warehouse bulan Februari'. Approval 'via chat, kayaknya sudah dihapus'. Modelnya sendiri mungkin 100% benar dan legal — tapi tidak bisa DIBUKTIKAN.",
        "Hasilnya: temuan audit kritis, denda, dan — yang lebih mahal — larangan memakai model itu sampai ketertelusuran diperbaiki. Twist-nya: yang dihukum bukan model yang salah, melainkan model yang tidak bisa menjelaskan dirinya. Di dunia regulated, 'benar tapi tidak terbukti' = salah.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjawab tiga pertanyaan regulator (versi model? data apa? siapa approve?) dalam 5 menit via lineage; (2) menghitung skor kelengkapan model card dan menilai risikonya; (3) merancang approval workflow maker-checker yang proporsional; (4) menjelaskan mengapa audit trail hash chain lebih kuat dari log biasa.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Governance = birokrasi yang memperlambat inovasi'",
        type: "pitfall",
        body: "Governance yang baik memperCEPAT: saat insiden/audit, jawaban tersedia dalam menit bukan minggu. Yang memperlambat adalah governance yang dibangun dadakan SAAT krisis. Bedakan 'rem' (memperlambat) dengan 'sabuk pengaman' (melindungi saat ngebut).",
      },
      reference: "'Benar tapi tidak terbukti' = salah di mata regulator.",
    },
    {
      id: "lineage",
      eyebrow: "Langkah 2 · Lineage",
      title: "Silsilah setiap keputusan",
      prose: [
        "Lineage = rantai 'siapa mengubah apa, kapan, dengan apa' dari data mentah hingga keputusan akhir: data snapshot (hash persis!) → pipeline fitur (versi kode) → training (parameter, seed) → model (versi registry) → approval (siapa) → keputusan (ID, timestamp, input).",
        "Kunci teknisnya: IMMUTABILITY. Snapshot data tidak boleh berubah setelah dipakai (hash SHA-256 sebagai sidik jari). Audit log bersifat append-only — entri tidak diedit, hanya ditambah (koreksi = entri baru). Rantai hash (tiap entri mengunci hash entri sebelumnya) membuat pemalsuan riwayat terdeteksi seketika.",
        "Dengan lineage lengkap, tiga pertanyaan OJK terjawab dalam 5 menit via query — seperti di lab lesson ini. Tanpa lineage, jawabannya adalah 'kayaknya'.",
        "💡 Intuisi: lineage seperti buku nikah + akta kelahiran + riwayat medis dalam satu berkas. Saat sengketa waris (audit), yang punya berkas lengkap menang — bukan yang paling benar secara moral, tapi yang bisa MEMBUKTIKAN.",
      ],
      figure: {
        svg: LINEAGE_SVG,
        alt: "Rantai lineage dari data snapshot hingga keputusan K-88121.",
        caption: "Lineage lengkap: tiap panah tercatat siapa, kapan, dengan apa. Inilah yang menjawab tiga pertanyaan regulator. Cara membaca: ikuti panah dari keputusan akhir mundur ke data mentah; tiap panah berlabel pelaku, waktu, dan artefak (hash). Interpretasi: dengan lineage, `model versi berapa? data apa? siapa approve?` terjawab 5 menit via query — tanpa lineage, jawabannya `kayaknya` seharga Rp500 juta.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: 'Cukup catat versi modelnya saja'",
        type: "pitfall",
        body: "Versi model tanpa data snapshot = setengah silsilah. 'v3 dilatih dari data Februari' — data Februari yang mana? Sudah dibersihkan bagaimana? Tanpa hash snapshot, reproduksibilitas = nol dan jawaban audit = 'kayaknya'. Lineage putus di satu titik = putus semuanya.",
      },
      reference: "Lineage = data(hash) → fitur → model → approval → keputusan. Append-only + hash chain.",
    },
    {
      id: "model-card",
      eyebrow: "Langkah 3 · Model card & kontrol akses",
      title: "KTP model + siapa boleh apa",
      prose: [
        "Model card = dokumentasi standar satu model: tujuan & batasan ('untuk skor KPR, BUKAN untuk hiring'), data training (sumber, periode, bias diketahui), metrik per segmen (bukan cuma global!), risiko & mitigasi, dan pemilik. Ini 'label kemasan' yang dibaca sebelum memakai model — mencegah pemakaian di luar tujuan.",
        "Approval workflow: siapa boleh promote ke production? Aturan umum: maker-checker — yang melatih TIDAK BOLEH sendirian approve deploy-nya. Untuk model berisiko tinggi: + risk head + kadang komite. Tercatat di audit trail (bukan 'via chat').",
        "Kontrol akses & retensi: data sensitif hanya untuk peran yang perlu (least privilege); model lama di-archive bukan di-delete (MLOps4); masa retensi mengikuti regulasi (perbankan umumnya 5 tahun). Governance tanpa retensi = ingatan yang dijadwalkan hilang.",
        "💡 Intuisi: model card seperti brosur obat: indikasi, dosis, efek samping, kontraindikasi. Dokter (pengguna model) yang membaca brosur tidak akan meresepkan obat jantung untuk sakit kepala. Tanpa brosur, semua obat terlihat sama — dan itu berbahaya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Model card ditulis SEKALI saat launch lalu basi. Card harus berversion mengikuti model: tiap versi mayor = card diperbarui (data baru? metrik segmen berubah?). Card basi = brosur obat untuk formula lama — menyesatkan, bukan melindungi.",
      },
      reference: "Model card = label kemasan (tujuan, batasan, bias, pemilik). Maker-checker untuk approval.",
    },
    {
      id: "lab-audit",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: rantai audit anti-rusak",
      prose: [
        "Kita bangun audit trail dengan hash chain: tiap entri menyimpan hash entri sebelumnya. Ubah satu karakter di masa lalu → seluruh rantai setelahnya INVALID (terdeteksi oleh `verifikasi`).",
        "Tugasmu: implementasikan `catat` (hitung hash = SHA256(prev + payload)), `verifikasi` (cek ulang seluruh rantai), dan `lineage` (telusuri keputusan → model → data → approver).",
        "Cara membaca: 'VALID (5 blok)' = riwayat utuh tak terusik. Interpretasi: `lineage('K-88121')` menjawab tiga pertanyaan OJK dalam satu baris — inilah yang tidak dimiliki Bank Mini.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `catat` dengan hash chain" },
        { id: "t2", text: "Implementasikan `verifikasi` dan `lineage`" },
        { id: "t3", text: "Jalankan; baca vonis integritas + lineage" },
      ],
      expected: "VALID (5 blok) · lineage K-88121 → v3 → s3://data/2026-10-01 → budi",
      note: {
        title: "💡 Intuisi: hash chain seperti segel amplop bersambung",
        body: "Bayangkan 5 amplop disegel berantai: segel amplop-2 dicap di atas segel amplop-1. Membuka amplop-3 diam-diam merusak capnya — dan semua amplop setelahnya ikut curiga. Itulah hash chain: kejujuran yang ditegakkan matematika, bukan kepercayaan.",
      },
      hints: [
        "catat: prev = rantai[-1]['hash'] jika ada else GENESIS; h = sha256((prev+payload).encode()).hexdigest().",
        "verifikasi: untuk tiap blok, cek blok['prev'] == prev DAN hash hitung ulang == blok['hash'].",
        "lineage: loop blok, cocokkan aksi['keputusan'] == id, format rantai string.",
      ],
      code: {
        starter: `import hashlib, json\n\nGENESIS = "0" * 64\nrantai = []\n\ndef catat(aksi):\n    # TULIS KODEMU: append blok {prev, aksi, hash}\n    \n\ndef verifikasi():\n    # TULIS KODEMU: return (True, -1) atau (False, indeks_rusak)\n    \n\ndef lineage(keputusan_id):\n    # TULIS KODEMU: telusuri keputusan -> model -> data -> approver\n    \n\ncatat({"event": "train",   "model": "fraud-scorer v3", "data_snapshot": "s3://data/2026-10-01", "oleh": "rani"})\ncatat({"event": "approve", "model": "fraud-scorer v3", "approver": "budi (risk head)"})\ncatat({"event": "deploy",  "model": "fraud-scorer v3", "keputusan": "K-88121", "data_snapshot": "s3://data/2026-10-01", "approver": "budi (risk head)"})\ncatat({"event": "rollback","model": "fraud-scorer v2", "oleh": "rani", "alasan": "canary gagal"})\ncatat({"event": "deploy",  "model": "fraud-scorer v2", "keputusan": "K-88199", "data_snapshot": "s3://data/2026-09-20", "approver": "budi (risk head)"})\n\nok, idx = verifikasi()\nprint(f"Integritas rantai audit: {'VALID' if ok else f'RUSAK di blok {idx}'} ({len(rantai)} blok)")\nprint("Lineage:", lineage("K-88121"))\nprint("Hash blok terakhir:", rantai[-1]["hash"][:16] + "...")`,
        lockLines: 14,
        solution: `import hashlib, json\n\nGENESIS = "0" * 64\nrantai = []\n\ndef catat(aksi):\n    # TULIS KODEMU: append blok {prev, aksi, hash}\n    prev = rantai[-1]["hash"] if rantai else GENESIS\n    payload = json.dumps(aksi, sort_keys=True)\n    h = hashlib.sha256((prev + payload).encode()).hexdigest()\n    rantai.append({"prev": prev, "aksi": aksi, "hash": h})\n\ndef verifikasi():\n    # TULIS KODEMU: return (True, -1) atau (False, indeks_rusak)\n    prev = GENESIS\n    for i, blok in enumerate(rantai):\n        payload = json.dumps(blok["aksi"], sort_keys=True)\n        if blok["prev"] != prev: return False, i\n        if hashlib.sha256((prev + payload).encode()).hexdigest() != blok["hash"]: return False, i\n        prev = blok["hash"]\n    return True, -1\n\ndef lineage(keputusan_id):\n    # TULIS KODEMU: telusuri keputusan -> model -> data -> approver\n    for blok in rantai:\n        if blok["aksi"].get("keputusan") == keputusan_id:\n            a = blok["aksi"]\n            return (f"keputusan {keputusan_id} <- model {a['model']} "\n                    f"<- data {a['data_snapshot']} <- disetujui {a['approver']}")\n    return "tidak ditemukan"\n\ncatat({"event": "train",   "model": "fraud-scorer v3", "data_snapshot": "s3://data/2026-10-01", "oleh": "rani"})\ncatat({"event": "approve", "model": "fraud-scorer v3", "approver": "budi (risk head)"})\ncatat({"event": "deploy",  "model": "fraud-scorer v3", "keputusan": "K-88121", "data_snapshot": "s3://data/2026-10-01", "approver": "budi (risk head)"})\ncatat({"event": "rollback","model": "fraud-scorer v2", "oleh": "rani", "alasan": "canary gagal"})\ncatat({"event": "deploy",  "model": "fraud-scorer v2", "keputusan": "K-88199", "data_snapshot": "s3://data/2026-09-20", "approver": "budi (risk head)"})\n\nok, idx = verifikasi()\nprint(f"Integritas rantai audit: {'VALID' if ok else f'RUSAK di blok {idx}'} ({len(rantai)} blok)")\nprint("Lineage:", lineage("K-88121"))\nprint("Hash blok terakhir:", rantai[-1]["hash"][:16] + "...")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "Integritas rantai audit: VALID \\(5 blok\\)", label: "Rantai VALID", msg: "5 blok terverifikasi — riwayat utuh." },
          { kind: "stdout_matches", task: "t3", pattern: "Lineage: keputusan K-88121 <- model fraud-scorer v3", label: "Lineage v3", msg: "Keputusan K-88121 tertelusur ke fraud-scorer v3." },
          { kind: "stdout_matches", task: "t3", pattern: "disetujui budi \\(risk head\\)", label: "Approver tercatat", msg: "Approver budi (risk head) tercatat di lineage." },
        ],
      },
      reference: "sha256(prev + payload). Ubah 1 char masa lalu = rantai rusak.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Level governance mengikuti risiko",
      prose: [
        "**Skenario 1 — Risiko rendah (rekomendasi konten).** → Governance ringan: registry + model card singkat + log deploy. Jangan bebani tim dengan komite untuk risiko kecil.",
        "**Skenario 2 — Risiko sedang (churn, marketing).** → + approval maker-checker + lineage data + retensi 1–2 tahun. Seimbang: terlacak tanpa birokrasi berat.",
        "**Skenario 3 — Risiko tinggi (kredit, fraud, hiring).** → + risk head sign-off + metrik per segmen di model card + audit trail hash + retensi 5 tahun + review berkala. Ini wilayah OJK — tidak ada jalan pintas.",
        "**Skenario 4 — Sudah terlanjur tanpa governance.** → Jangan 'big bang': mulai dari SEKARANG — registry untuk versi baru, lineage untuk data baru, backfill dokumentasi untuk model kritis saja. Governance retroaktif parsial > menunggu sempurna.",
        "Aturan praktis 10 detik: 'jika keputusan model ini masuk koran / sidang, apa yang harus bisa kutunjukkan?' Jawaban itulah level governance-mu.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: governance seperti asuransi berjenjang",
        body: "Motor butuh STNK; pesawat butuh sertifikasi pilot + maintenance log + black box. Kendaraan berbeda, jenjang berbeda — tapi prinsipnya sama: semakin besar daya rusaknya, semakin ketat catatannya. Samakan jenjang governance dengan daya rusak modelmu.",
      },
      reference: "Jenjang: ringan → maker-checker → risk sign-off + audit. Uji koran/sidang.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Harga tiga pertanyaan tak terjawab",
      prose: [
        "Bedah angka Bank Mini: denda regulator Rp500 jt + larangan pakai model 4 bulan (kehilangan efisiensi: model menghemat Rp180 jt/bulan biaya analis → Rp720 jt) + biaya konsultan membangun ketertelusuran retroaktif Rp350 jt + reputasi. Total terukur: Rp1,57 M.",
        "Biaya membangun governance SEJAK AWAL untuk model itu: registry (2 minggu) + lineage pipeline (3 minggu) + model card & approval workflow (1 minggu) ≈ 6 minggu × Rp15 jt = Rp90 jt.",
        "**Pertanyaan:** (1) Berapa rasio biaya krisis vs biaya awal? (2) Komponen mana yang menjawab masing-masing dari 3 pertanyaan OJK? (3) Kenapa 'laptop analis yang resign' adalah kegagalan governance, bukan kesialan?",
        "**Pembahasan:** (1) Rp1,57 M / Rp90 jt ≈ 17,4x — belum termasuk reputasi. (2) Q1 → registry (stage/version); Q2 → lineage + hash snapshot; Q3 → audit trail approval. (3) Karena artefak kritis di laptop personal = tidak ada kontrol akses, backup, dan serah terima — tiga hal yang diatur governance sejak hari pertama.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ini inti model risk management: model adalah ASET BERISIKO yang harus diinventarisasi, divalidasi, dan diawasi sepanjang hidupnya. 'Tidak tercatat' = 'tidak dikelola' = temuan audit. Governance MLOps adalah implementasi operasional dari kebijakan itu.",
      },
      reference: "17,4x = harga membangun governance saat krisis vs sejak awal.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Skor kelengkapan model card: dari dokumentasi menjadi angka",
      prose: [
        "`Model card lengkap` adalah klaim yang tidak bisa diuji — sampai kita beri skor. Definisikan 12 field wajib model card: (1) tujuan & batasan pakai, (2) data training (sumber, periode), (3) bias yang diketahui, (4) metrik evaluasi + slice, (5) ambang keputusan, (6) pemilik & kontak, (7) tanggal training & versi, (8) environment/dependensi, (9) hasil uji keamanan, (10) rencana monitoring, (11) prosedur rollback, (12) persetujuan (siapa, kapan). Skor kelengkapan = field terisi / 12 × 100%. Sederhana, brutal, dan jujur.",
        "Audit Bank Mini: model yang diperiksa OJK mengisi 5 dari 12 (42%). Yang kosong: batasan pakai, bias, slice, monitoring, rollback, persetujuan — tepat 6 field yang DITANYAKAN regulator. Polanya bukan kebetulan: field yang paling malas diisi adalah field yang paling dibutuhkan saat krisis. Korelasinya hampir sempurna karena keduanya menjawab pertanyaan yang sama: `apa yang bisa salah dan siapa tanggung jawab?`.",
        "Beri BOBOT pada field sesuai risiko. Untuk model kredit: batasan pakai (bobot 3), bias & slice (3), persetujuan (2), monitoring (2), sisanya (1). Skor terbobot = Σ(bobot × terisi)/Σbobot. Contoh: model mengisi 8 field tapi yang kosong adalah batasan pakai + bias (bobot 3+3): skor tak-terbobot 67% terlihat `lumayan`, skor terbobot = (total 20 − 6)/20 = 70%... hmm, masih mirip. Coba yang lebih tajam: aturan `field bobot-3 tidak boleh kosong` — satu field kritis kosong = skor OTOMATIS < 60% = tidak boleh production. Ini mengubah skor dari `rata-rata` menjadi `gerbang`.",
        "Terapkan sebagai gerbang CI (MLOps5): job `model-card-check` membaca model card (YAML/JSON), menghitung skor, dan GAGAL jika < 80% atau ada field kritis kosong. Contoh nyata: model v3.2 skor 92% → lolos; v3.3 (emergency fix Jumat malam) skor 58% (tanpa persetujuan, tanpa batasan) → pipeline BERHENTI. Engineer mengisi 20 menit, skor 85% → lolos. Dua puluh menit mengisi dokumentasi vs temuan audit kritis — gerbang ini membayar dirinya sendiri setiap kali ia menghentikan satu deploy ceroboh.",
        "Hubungkan ke lineage (langkah 2 lesson ini): model card yang lengkap + lineage yang utuh = jawaban 5 menit untuk TIGA pertanyaan OJK plus tiga pertanyaan lanjutan (`siapa yang approve?`, `kapan terakhir dimonitor?`, `bagaimana rollback?`). Tanpa keduanya, jawabannya `kayaknya` — dan `kayaknya` di depan regulator berharga Rp500 juta + larangan pakai model 4 bulan (mini-case). Governance bukan birokrasi; ia adalah kemampuan menjawab.",
        "Jadwalkan `audit kelengkapan` kuartalan untuk SEMUA model production: skor tiap model, tren per kuartal, dan daftar field kritis yang kosong. Contoh dashboard: 12 model, rata-rata skor 78%, 3 model < 60% (semuanya model lama pra-governance). Tiga model itu masuk antrean remediasi — bukan untuk dihukum, tapi karena mereka adalah 3 model yang akan membuatmu tidak bisa menjawab saat OJK datang. Governance yang baik itu proaktif: menemukan lubang SEBELUM regulator menemukannya.",
        "Terakhir, model card BUKAN dokumen mati. Setiap insiden model HARUS memperbarui field `bias yang diketahui` dan `batasan pakai`. Contoh: insiden `model menolak nasabah wilayah X 2x lipat` → field bias diisi `terdeteksi bias wilayah X pada 2026-09, mitigasi: threshold per-wilayah` → skor naik DAN pengetahuan menjadi permanen. Model card yang tidak pernah diupdate setelah insiden = organisasi yang tidak belajar. Skor kelengkapan mengukur kedisiplinan; update pasca-insiden mengukur kejujuran.",
        "Model card juga melindungi engineer-nya sendiri. Kasus nyata: model dituduh bias gender 8 bulan setelah deploy; engineer yang sudah pindah tim dipanggil kembali untuk menjelaskan. Karena model card mencatat `bias yang diketahui: diuji pada slice gender, selisih < 0,005, 2026-03-14` dan lineage menunjuk data training yang persis, investigasi selesai dalam 2 hari dengan kesimpulan `bukan bias model, melainkan perubahan populasi` (wilayah MLOps7). Tanpa catatan itu, ia akan menghabiskan 3 minggu membuktikan hal yang sama — atau lebih buruk, disalahkan atas sesuatu yang bukan salahnya. Dokumentasi bukan beban administratif; ia asuransi karir yang premi-nya 20 menit per deploy.",
      ],
      formula: String.raw`\text{skor} = \frac{\sum w_i \cdot terisi_i}{\sum w_i} \times 100\%`,
      formulaNote: "skor = kelengkapan model card; w_i = bobot field ke-i (3 = kritis: batasan pakai, bias/slice; 2 = penting: persetujuan, monitoring; 1 = standar); terisi_i = 1 jika field diisi bermakna, 0 jika kosong/asalan. Aturan gerbang: skor ≥80% DAN tidak ada field bobot-3 yang kosong.",
      figure: {
        svg: MLOPS10_DEEP_SVG,
        alt: "Diagram batang keterisian field model card: dua field kritis (bobot 3) kosong, sisanya terisi sebagian.",
        caption: "Cara membaca: tiap batang = kelompok field model card; angka dalam kurung = bobot; panjang batang = % terisi; merah = kosong. Interpretasi: Bank Mini skor 42% — dan yang kosong TEPAT field kritis yang ditanya regulator. Skor tak-terbobot menutupi ini; aturan `field bobot-3 tak boleh kosong` tidak.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: yang malas diisi = yang ditanya saat krisis",
        body: "Field model card yang paling sering kosong (batasan, bias, persetujuan) adalah field yang pertama ditanyakan saat insiden/audit. Korelasinya bukan kebetulan — keduanya menjawab `apa yang bisa salah?`. Jadikan skor kelengkapan gerbang CI, bukan PR yang `nanti dilengkapi`.",
      },
      reference: "Skor ≥80% + field kritis wajib terisi = gerbang deploy. Audit kuartalan untuk semua model production.",
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
        "'Benar tapi tidak terbukti' = salah di mata regulator.",
        "Lineage: data(hash) → fitur → model → approval → keputusan; append-only + hash chain.",
        "Model card = label kemasan: tujuan, batasan, bias, metrik segmen, pemilik.",
        "Maker-checker: yang melatih tidak approve sendirian.",
        "Jenjang governance mengikuti daya rusak model; uji koran/sidang.",
      ],
      next: { label: "MLOps11 — Kubernetes untuk ML", href: "/learn/mlops11-k8s" },
      quiz: [
        {
          q: "OJK bertanya versi model penolakan 14 Maret; tim menjawab 'kayaknya v3'. Masalahnya?",
          options: [
            { text: "Jawaban kurang sopan", why: "Bukan soal sopan — soal bukti." },
            { text: "'Kayaknya' bukan jawaban audit: tanpa registry+lineage, tidak ada bukti", why: "Regulator butuh ketertelusuran tercatat, bukan ingatan. 'Kayaknya' = temuan.", correct: true },
            { text: "Seharusnya menjawab v2", why: "Menebak versi lain sama buruknya — tetap tanpa bukti." },
            { text: "OJK tidak berhak bertanya", why: "Justru berhak — itu mandat pengawasannya." },
          ],
        },
        {
          q: "Apa fungsi hash chain di audit trail?",
          options: [
            { text: "Mempercepat query", why: "Hash chain tidak untuk kecepatan — untuk integritas." },
            { text: "Membuat pemalsuan riwayat terdeteksi: ubah 1 entri lama → rantai rusak", why: "Tiap entri mengunci hash sebelumnya; verifikasi ulang menangkap inkonsistensi seketika.", correct: true },
            { text: "Mengenkripsi data sensitif", why: "Hash ≠ enkripsi; ia sidik jari, bukan gembok." },
            { text: "Menghemat storage", why: "Hash menambah sedikit data, bukan menghemat." },
          ],
        },
        {
          q: "Analis melatih model lalu approve sendiri deploy ke production. Pelanggaran apa?",
          options: [
            { text: "Tidak ada — efisien", why: "Efisien tapi tanpa check-and-balance." },
            { text: "Maker-checker: pembuat tidak boleh menjadi satu-satunya penyetuju", why: "Self-approval menghilangkan lapisan review independen — konflik kepentingan struktural.", correct: true },
            { text: "Pelanggaran hak cipta", why: "Tidak relevan dengan pertanyaan — regulator menanyakan BUKTI TERTULIS ketertelusuran, bukan ingatan atau niat baik. `Kayaknya dari warehouse Februari` bukan jawaban di depan OJK." },
            { text: "Terlalu lambat", why: "Justru terlalu cepat tanpa kontrol." },
          ],
        },
        {
          q: "Model rekomendasi konten vs model credit scoring. Perbedaan governance yang tepat?",
          options: [
            { text: "Sama persis — standar itu standar", why: "Over-governance untuk risiko kecil = birokrasi; under-governance untuk risiko besar = bahaya." },
            { text: "Berjenjang: ringan untuk konten, ketat (sign-off + audit + retensi 5 th) untuk kredit", why: "Daya rusak berbeda → jenjang berbeda. Uji koran/sidang.", correct: true },
            { text: "Konten tidak butuh governance sama sekali", why: "Tetap butuh dasar (registry, card) — hanya lebih ringan." },
            { text: "Kredit tidak butuh model card", why: "Justru paling butuh: batasan & bias harus eksplisit." },
          ],
        },
        {
          q: "Perusahaan sudah punya 20 model tanpa governance. Langkah pertama terbaik?",
          options: [
            { text: "Hentikan semua model sampai governance sempurna", why: "Big bang = bisnis berhenti; tidak realistis." },
            { text: "Mulai dari sekarang: registry+lineage untuk versi baru, backfill dokumentasi untuk model kritis", why: "Parsial tapi berjalan > sempurna tapi tak mulai. Prioritas ke risiko terbesar.", correct: true },
            { text: "Tunggu audit berikutnya sebagai motivasi", why: "Menunggu krisis = membayar 17,4x lipat." },
            { text: "Beli platform governance termahal", why: "Tools tanpa proses = rak mahal. Mulai dari proses (langkah MLOps1).", },
          ],
        },
        {
          q: "Model card v3.3 skor 58% (tanpa persetujuan, tanpa batasan pakai) — tapi ini emergency fix untuk bug produksi. Tindakan TEPAT?",
          options: [
            { text: "Deploy saja — emergency lebih penting dari dokumentasi", why: "Emergency membenarkan KECEPATAN, bukan kelalaian. Deploy tanpa persetujuan tercatat = mengulang pola Bank Mini: saat ditanya regulator, jawabannya `kayaknya`." },
            { text: "Pipeline berhenti; isi field kritis (20 menit), baru deploy", why: "Tepat. 20 menit mengisi persetujuan + batasan — jauh lebih murah daripada biaya temuan audit. Gerbang yang bisa di-bypass saat `penting` bukan gerbang — ia saran.", correct: true },
            { text: "Isi field dengan `TBD` agar skor lolos", why: "`TBD` = berbohong kepada gerbang. Skor mengukur kejujuran juga; field asalan akan ketahuan saat audit dan merusak kredibilitas seluruh sistem governance." },
            { text: "Hapus gerbang model card untuk semua emergency fix", why: "Pengecualian permanen untuk `emergency` = semua deploy mendadak jadi emergency. Pengecualian boleh ada tapi TERCATAT dan di-review mingguan." },
          ],
        },
      ],
    },
  ],
};
