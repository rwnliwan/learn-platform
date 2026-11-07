import type { V2Lesson } from "../lib/types";

// Diagram pipeline TanyaDok: 6 tahap dengan skor eval.
const FIG_PIPELINE = `<svg viewBox="0 0 560 180" role="img" aria-label="Pipeline TanyaDok: dokumen, chunk, embed, retrieve, generate, eval dengan skor 6 dari 7.">
<g font-family="var(--font-ui)">
<rect x="8" y="50" width="78" height="52" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<rect x="102" y="50" width="78" height="52" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<rect x="196" y="50" width="78" height="52" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<rect x="290" y="50" width="78" height="52" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<rect x="384" y="50" width="78" height="52" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<rect x="478" y="50" width="78" height="52" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2"/>
<g fill="var(--text)" font-size="12" text-anchor="middle" font-weight="600"><text x="47" y="72">Dokumen</text><text x="141" y="72">Chunk</text><text x="235" y="72">Embed</text><text x="329" y="72">Retrieve</text><text x="423" y="72">Generate</text><text x="517" y="72">Eval</text></g>
<g fill="var(--chart-text)" font-size="10" text-anchor="middle"><text x="47" y="90">SOP bank</text><text x="141" y="90">400 kata</text><text x="235" y="90">vektor</text><text x="329" y="90">top-2</text><text x="423" y="90">mock LLM</text><text x="517" y="90" font-weight="700" fill="var(--c4)">6/7</text></g>
<g stroke="var(--text-muted)" stroke-width="2" marker-end="url(#ah)"><line x1="88" y1="76" x2="100" y2="76"/><line x1="182" y1="76" x2="194" y2="76"/><line x1="276" y1="76" x2="288" y2="76"/><line x1="370" y1="76" x2="382" y2="76"/><line x1="464" y1="76" x2="476" y2="76"/></g>
<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--text-muted)" stroke-width="1.5"/></marker></defs>
</g>
<text x="280" y="140" font-size="12" fill="var(--c4)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">1 miss: tanpa abstention, pertanyaan di luar dokumen dijawab ngawur</text>
<text x="280" y="162" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">skor komponen bagus ≠ skor end-to-end bagus — integrasi punya failure mode sendiri</text>
</svg>`;

export const aie12: V2Lesson = {
  slug: "aie12-capstone",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE12 — Capstone: Aplikasi RAG Mini Produksi",
  estMinutes: 90,
  steps: [
    {
      id: "cerita-tanyadok",
      eyebrow: "Langkah 1 · Cerita",
      title: "TanyaDok: merangkai 11 lesson menjadi satu aplikasi",
      prose: [
        "Akhir kuartal, direksi NusaBank meminta demo: 'TanyaDok' — aplikasi tanya-jawab di atas SOP bank, siap produksi. Tim merangkai semuanya: chunking dari AIE3, eval dari AIE4, schema dari AIE6, cache dari AIE7, logging dari AIE8, filter safety dari AIE9, retry dari AIE10, sitasi dari AIE11. Tiap komponen lolos uji sendiri. Lalu uji end-to-end: 6 dari 7.",
        "Twist-nya: yang gagal bukan komponen mana pun — melainkan INTEGRASINYA. Pertanyaan 'siapa direktur utama?' (tidak ada di dokumen) dijawab ngawur '3 bulan' dengan skor retrieval 0,00. Retrieval benar (tidak ada yang mirip), generator salah (tidak tahu cara diam). Tidak ada komponen yang mengajarkan 'kapan tidak menjawab' — itu keputusan arsitektur end-to-end: abstention threshold.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) merangkai pipeline RAG end-to-end; (2) membangun eval harness dengan golden set; (3) mendiagnosis failure mode integrasi; (4) menghitung biaya, latensi, dan kelayakan SLA; (5) memutuskan go/no-go dengan launch checklist.",
        "🗺️ Isi lesson: Langkah 1 · Cerita TanyaDok — Langkah 2 · Arsitektur end-to-end — Langkah 3 · Lab: pipeline + eval — Langkah 4 · Biaya, latensi, SLA — Langkah 5 · Lab: kelayakan produksi — Langkah 6 · Peta keputusan go/no-go — Langkah 7 · Mini-case — Langkah 8 · Varian domain — Langkah 9 · Tiga proyek domain yang hilang — Langkah 10 · Lab: text-to-SQL — Langkah 11 · Dashboard biaya — Langkah 12 · Tracing — Langkah 13 · Design review — Checkpoint.",
      ],
      tasks: [],
      reference: "Capstone = 11 lesson dalam satu aplikasi. Komponen bagus tidak menjamin sistem bagus.",
    },
    {
      id: "konsep-arsitektur",
      eyebrow: "Langkah 2 · Arsitektur",
      title: "Arsitektur TanyaDok: enam kotak, satu keputusan",
      prose: [
        "Pipeline: Dokumen → Chunk (400 kata, overlap 50) → Embed → Retrieve (top-2, Jaccard) → Generate (mock: pilih kunci dengan overlap konteks terbaik) → Eval (golden set 7 pertanyaan). Setiap kotak adalah satu lesson: AIE3, AIE3, AIE4, AIE6/AIE11 untuk format dan sitasi.",
        "Keputusan arsitektur yang tidak ada di kotak mana pun: abstention threshold. Bila skor retrieval teratas di bawah 0,05, jawab 'tidak tahu' — jangan paksakan generator menebak. Inilah failure mode integrasi: tiap komponen 'bekerja sesuai spesifikasi', tetapi spesifikasinya tidak mencakup kasus kosong.",
        "Kepribadian arsitektur end-to-end: ia seperti orkestra — tiap pemain hebat tidak menjamin simfoni indah. Dirigen (eval harness + keputusan ambang) yang membuatnya menjadi musik.",
        "Enam kotak — keputusan tiap kotak. (1) Input guard: filter PII/jailbreak (Rp2 juta/bulan). (2) Router: LLM kecil (96 persen). (3) RAG: 5 dokumen, rerank. (4) Generator: model utama + CoT selektif. (5) Verifier: sitasi + abstention (ECE<0,1). (6) Logger: 5 field + sampling. Tiap kotak = 1 lesson track ini. Keputusan tersulit BUKAN tiap kotak — melainkan URUTANNYA (filter dulu, bukan terakhir!). Arsitektur = urutan keputusan, bukan tumpukan komponen.",
        "Dokumentasi arsitektur — 1 diagram. Enam kotak + panah + keputusan tiap panah ('mengapa filter dulu?'). 6 bulan kemudian: diagram = satu-satunya yang menjelaskan 'mengapa begitu'. Tanpa: arkeologi kode.",
      ],
      formula: String.raw`\text{skor}_{\text{e2e}} = \frac{n_{\text{benar}}}{n}`,
      formulaNote: "skor_e2e = skor end-to-end; n_benar = pertanyaan dijawab benar (termasuk abstain yang tepat); n = total pertanyaan golden. TanyaDok: 6/7 ≈ 86 persen. Target launch: ≥85 persen + red team lolos + biaya masuk budget + SLA terpenuhi — empat syarat, bukan satu.",
      figure: {
        svg: FIG_PIPELINE,
        alt: "Pipeline TanyaDok: dokumen, chunk, embed, retrieve, generate, eval dengan skor 6 dari 7.",
        caption: "Cara membaca: enam kotak = enam tahap pipeline, panah = aliran data; kotak terakhir (Eval) disorot dengan skor 6/7. Interpretasi: tiap tahap lolos uji komponen, tetapi skor end-to-end 86 persen — satu miss berasal dari pertanyaan di luar dokumen yang dijawab ngawur (skor retrieval 0,00). Pelajaran capstone: tambahkan abstention threshold pada skor retrieval; tanpa itu, integrasi selalu punya lubang yang tidak dimiliki komponen mana pun.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Semua komponen lolos uji, berarti sistem siap launch.' Salah. Pengujian komponen tidak mencakup interaksi antar-komponen: retrieval kosong + generator penebak, cache basi + data baru, retry + timeout yang bertabrakan. Eval end-to-end dengan golden set realistis (termasuk pertanyaan mustahil) adalah syarat launch yang tidak bisa digantikan.",
      },
      reference: "Uji komponen ≠ uji sistem. Golden set end-to-end wajib mencakup pertanyaan di luar dokumen.",
    },
    {
      id: "lab-pipeline",
      eyebrow: "Langkah 3 · Lab pipeline",
      title: "Lab: membangun dan mengevaluasi TanyaDok",
      prose: [
        "Empat dokumen SOP mini, tujuh pertanyaan golden (satu mustahil). `retrieve` memakai Jaccard similarity; `jawab` adalah mock generator yang memilih kunci jawaban dengan overlap konteks terbaik. Evaluasi: tiap prediksi dibandingkan kunci emas; untuk pertanyaan mustahil, jawaban benar adalah 'tidak tahu'.",
        "Coba ubah: tambah abstention — bila top_skor < 0,05 kembalikan 'tidak tahu' — jalankan ulang, dan lihat skor menjadi 7/7 (6 benar + 1 abstain tepat). Satu baris arsitektur menutup lubang integrasi.",
      ],
      tasks: [
        { id: "t1", text: "Loop golden set: panggil `jawab`, bandingkan dengan kunci emas" },
        { id: "t2", text: "Hitung `benar` dan cetak tiap hasil + ringkasan" },
      ],
      expected: "end_to_end=6/7",
      note: {
        title: "💡 Intuisi",
        body: "Eval harness adalah dirigen orkestra: ia tidak memainkan alat musik, tetapi tanpa dia tidak ada simfoni. Investasi terbaik sebelum launch bukan satu komponen lagi, melainkan harness yang jujur — karena harness yang jujur menemukan lubang yang tidak dicari siapa pun.",
      },
      hints: [
        "Loop: for q, dok_gold, kunci_gold in GOLDEN:",
        "pred, s = jawab(q); ok = (pred == 'tidak tahu') if kunci_gold is None else (pred == kunci_gold)",
        "Cetak tiap baris lalu print(f\"end_to_end={benar}/{len(GOLDEN)}\")",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nimport re\n\nDOKS = {\n    "dok-1": "cuti tahunan 12 hari diajukan minimal 7 hari sebelumnya",\n    "dok-2": "lembur maksimal 3 jam per hari tarif 1,5x upah per jam",\n    "dok-3": "reimbursement maksimal Rp500.000 per bulan kwitansi wajib dilampirkan",\n    "dok-4": "cuti melahirkan 3 bulan dengan gaji penuh",\n}\nGOLDEN = [\n    ("berapa hari cuti tahunan?", "dok-1", "12 hari"),\n    ("berapa tarif lembur per jam?", "dok-2", "1,5x"),\n    ("dokumen apa yang wajib dilampirkan untuk reimbursement?", "dok-3", "kwitansi wajib"),\n    ("berapa lama cuti melahirkan?", "dok-4", "3 bulan"),\n    ("pengajuan cuti minimal berapa hari sebelumnya?", "dok-1", "7 hari"),\n    ("berapa maksimal jam lembur per hari?", "dok-2", "3 jam"),\n    ("siapa direktur utama perusahaan?", None, None),\n]\n\ndef norm(s):\n    return re.sub(r"[^a-z0-9 ]", "", s.lower())\n\ndef retrieve(q, k=2):\n    qw = set(norm(q).split())\n    skor = []\n    for did, teks in DOKS.items():\n        tw = set(teks.lower().split())\n        s = len(qw & tw)/len(qw | tw) if qw | tw else 0\n        skor.append((s, did))\n    skor.sort(reverse=True)\n    return [did for _, did in skor[:k]], skor[0][0]\n\ndef jawab(q):\n    # mock generator: pilih kunci dengan overlap konteks terbaik\n    ids, top_skor = retrieve(q)\n    teks = DOKS[ids[0]]\n    qwords = set(norm(q).split())\n    best, bs = "tidak tahu", -1\n    for _, _, kunci in GOLDEN:\n        if kunci and kunci in teks:\n            i = teks.index(kunci)\n            window = teks[max(0, i-10):i+len(kunci)+10]\n            s = len(set(window.split()) & qwords)\n            if s > bs: best, bs = kunci, s\n    return best, top_skor\n\n# TULIS KODEMU: evaluasi end-to-end\nbenar = 0\nfor q, dok_gold, kunci_gold in GOLDEN:\n    \n\nprint(f"end_to_end={benar}/{len(GOLDEN)}")`,
        lockLines: 47,
        solution: `# DATA SEED — jangan ubah\nimport re\n\nDOKS = {\n    "dok-1": "cuti tahunan 12 hari diajukan minimal 7 hari sebelumnya",\n    "dok-2": "lembur maksimal 3 jam per hari tarif 1,5x upah per jam",\n    "dok-3": "reimbursement maksimal Rp500.000 per bulan kwitansi wajib dilampirkan",\n    "dok-4": "cuti melahirkan 3 bulan dengan gaji penuh",\n}\nGOLDEN = [\n    ("berapa hari cuti tahunan?", "dok-1", "12 hari"),\n    ("berapa tarif lembur per jam?", "dok-2", "1,5x"),\n    ("dokumen apa yang wajib dilampirkan untuk reimbursement?", "dok-3", "kwitansi wajib"),\n    ("berapa lama cuti melahirkan?", "dok-4", "3 bulan"),\n    ("pengajuan cuti minimal berapa hari sebelumnya?", "dok-1", "7 hari"),\n    ("berapa maksimal jam lembur per hari?", "dok-2", "3 jam"),\n    ("siapa direktur utama perusahaan?", None, None),\n]\n\ndef norm(s):\n    return re.sub(r"[^a-z0-9 ]", "", s.lower())\n\ndef retrieve(q, k=2):\n    qw = set(norm(q).split())\n    skor = []\n    for did, teks in DOKS.items():\n        tw = set(teks.lower().split())\n        s = len(qw & tw)/len(qw | tw) if qw | tw else 0\n        skor.append((s, did))\n    skor.sort(reverse=True)\n    return [did for _, did in skor[:k]], skor[0][0]\n\ndef jawab(q):\n    # mock generator: pilih kunci dengan overlap konteks terbaik\n    ids, top_skor = retrieve(q)\n    teks = DOKS[ids[0]]\n    qwords = set(norm(q).split())\n    best, bs = "tidak tahu", -1\n    for _, _, kunci in GOLDEN:\n        if kunci and kunci in teks:\n            i = teks.index(kunci)\n            window = teks[max(0, i-10):i+len(kunci)+10]\n            s = len(set(window.split()) & qwords)\n            if s > bs: best, bs = kunci, s\n    return best, top_skor\n\n# TULIS KODEMU: evaluasi end-to-end\nbenar = 0\nfor q, dok_gold, kunci_gold in GOLDEN:\n    pred, s = jawab(q)\n    ok = (pred == "tidak tahu") if kunci_gold is None else (pred == kunci_gold)\n    benar += ok\n    print(f"{'OK  ' if ok else 'MISS'} skor={s:.2f} {q} -> {pred}")\n\nprint(f"end_to_end={benar}/{len(GOLDEN)}")`,
        checks: [
          { kind: "defined", task: "t1", name: "benar", label: "`benar` terdefinisi", msg: "Inisialisasi benar = 0 lalu tambah tiap jawaban tepat." },
          { kind: "equal", task: "t1", name: "benar", value: 6, tol: 1e-9, label: "`benar` seharusnya 6", msg: "Enam pertanyaan terjawab; yang mustahil miss (dijawab '3 bulan')." },
          { kind: "stdout_matches", task: "t2", pattern: "end_to_end=6/7", label: "`print` menampilkan ringkasan", msg: "Baris terakhir: end_to_end=6/7." },
        ],
      },
      reference: "Harness jujur > komponen baru. Satu baris abstention menutup lubang integrasi.",
    },
    {
      id: "konsep-biaya-sla",
      eyebrow: "Langkah 4 · Biaya dan SLA",
      title: "Kelayakan produksi: tiga angka sebelum launch",
      prose: [
        "Sebelum launch, tiga angka harus di atas meja. Biaya: 5.000 request/hari × (1.200 token input × $0,5 + 300 token output × $1,5)/1juta = $5,25/hari ≈ Rp2,5 juta/bulan — masuk budget Rp10 juta. Latensi: 120ms retrieval + 1.800ms generate = 1.920ms, di bawah SLA 3 detik. Kualitas: 86 persen end-to-end, di atas ambang 85 persen.",
        "Keempat syarat launch TanyaDok: eval ≥85 persen, red team ASR di bawah ambang, biaya dalam budget, SLA latensi terpenuhi. Gagal satu = no-go atau go bertahap. Launch bukan peristiwa, melainkan keputusan berlapis: internal → beta terbatas → umum, dengan metrik dipantau di tiap lapis.",
        "Kepribadian launch checklist: ia seperti daftar periksa pilot — membosankan, tidak heroik, dan menyelamatkan nyawa. Kecelakaan produksi hampir selalu bermula dari 'ah, yang ini pasti beres'.",
        "Tiga angka sebelum launch — TanyaDok. (1) Biaya: $5,25/hari ≈ Rp2,5 juta/bulan < budget Rp10 juta ✓. (2) Latensi: 1.920ms < SLA 3 detik ✓. (3) Kualitas: 86 persen di golden set > target 85 persen ✓ — tapi margin hanya 1 poin, jadi tambah sampel sebelum klaim kualitas stabil. Tiga ✓ dengan catatan = GO BERSYARAT: launch + tambah sampel golden set. Launch bukan vonis mati — ia awal pengukuran.",
        "Rollback plan — 5 menit atau tidak launch. (1) Feature flag: matikan TanyaDok, kembali ke CS manual (30 detik). (2) Model version pin: kembali ke v1.2 yang stabil (2 menit). (3) Data snapshot: jika index korup, restore kemarin (5 menit). Uji rollback SEBELUM launch (fire drill!). Tanpa drill: rollback 5 menit menjadi 2 jam panik. Launch = berani karena bisa mundur, bukan karena yakin tidak akan gagal.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Demo berhasil = siap launch.' Salah. Demo menguji jalan bahagia dengan 5 pertanyaan pilihan; produksi menguji 5.000 pertanyaan nyata termasuk yang mustahil, jahat, dan aneh. Empat syarat launch (eval, red team, biaya, SLA) tidak bisa digantikan oleh tepuk tangan direksi.",
      },
      reference: "Empat syarat: eval, red team, biaya, SLA. Launch berlapis: internal → beta → umum.",
    },
    {
      id: "lab-kelayakan",
      eyebrow: "Langkah 5 · Lab kelayakan",
      title: "Lab: tiga angka TanyaDok",
      prose: [
        "Hitung biaya harian, total latensi, dan apakah SLA 3 detik terpenuhi — tiga angka yang menentukan nasib launch. Semua konstanta sudah tersedia di seed.",
        "Coba ubah: naikkan REQ_HARI menjadi 50.000, jalankan ulang, dan lihat biaya menjadi $52,50/hari ≈ Rp25 juta/bulan — di atas budget. Itulah momen engineer mengusulkan cache dan routing dari AIE7 sebelum meminta budget tambahan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `biaya_hari`, `lat_p50`, dan `sla_ok`" },
        { id: "t2", text: "Cetak ketiganya" },
      ],
      expected: "biaya_hari=$5.25  latensi=1920ms  sla_3s=True",
      note: {
        title: "💡 Intuisi",
        body: "Tiga angka (biaya, latensi, kualitas) adalah bahasa bersama engineer, keuangan, dan direksi. Engineer yang datang dengan tiga angka ini tidak 'meminta izin' — ia membawa keputusan yang tinggal ditandatangani.",
      },
      hints: [
        "biaya_hari = REQ_HARI*(TOK_IN/1e6*H_IN + TOK_OUT/1e6*H_OUT)",
        "lat_p50 = LAT_R + LAT_G; sla_ok = lat_p50 < 3000",
        "print(f\"biaya_hari=${biaya_hari:.2f}  latensi={lat_p50}ms  sla_3s={sla_ok}\")",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\n# Asumsi produksi TanyaDok\nREQ_HARI = 5_000\nTOK_IN, TOK_OUT = 1_200, 300\nH_IN, H_OUT = 0.5, 1.5          # USD per 1M token\nLAT_R, LAT_G = 120, 1_800  # ms\n\n# TULIS KODEMU: biaya harian, latensi, cek SLA 3 detik\nbiaya_hari = \nlat_p50 = \nsla_ok = \n\nprint(f"biaya_hari=\${biaya_hari:.2f}  latensi={lat_p50}ms  sla_3s={sla_ok}")`,
        lockLines: 8,
        solution: `# DATA SEED — jangan ubah\n# Asumsi produksi TanyaDok\nREQ_HARI = 5_000\nTOK_IN, TOK_OUT = 1_200, 300\nH_IN, H_OUT = 0.5, 1.5          # USD per 1M token\nLAT_R, LAT_G = 120, 1_800  # ms\n\n# TULIS KODEMU: biaya harian, latensi, cek SLA 3 detik\nbiaya_hari = REQ_HARI*(TOK_IN/1e6*H_IN + TOK_OUT/1e6*H_OUT)\nlat_p50 = LAT_R + LAT_G\nsla_ok = lat_p50 < 3000\n\nprint(f"biaya_hari=\${biaya_hari:.2f}  latensi={lat_p50}ms  sla_3s={sla_ok}")`,
        checks: [
          { kind: "equal", task: "t1", name: "biaya_hari", value: 5.25, tol: 1e-9, label: "`biaya_hari` seharusnya 5.25", msg: "5000 x (1200/1e6 x 0,5 + 300/1e6 x 1,5) = 5,25." },
          { kind: "equal", task: "t1", name: "lat_p50", value: 1920, tol: 1e-9, label: "`lat_p50` seharusnya 1920", msg: "120 + 1800 = 1920." },
          { kind: "stdout_matches", task: "t2", pattern: "biaya_hari=\\$5\\.25\\s+latensi=1920ms\\s+sla_3s=True", label: "`print` menampilkan ketiganya", msg: "Format: biaya_hari=$5.25  latensi=1920ms  sla_3s=True." },
        ],
      },
      reference: "Biaya, latensi, kualitas — tiga angka sebelum setiap keputusan launch.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: go atau no-go",
      prose: [
        "Satu, eval ≥ ambang + red team lolos + biaya masuk budget + SLA terpenuhi — GO, berlapis: internal dulu, beta terbatas, baru umum. Dua, eval di bawah ambang — NO-GO; perbaiki retrieval atau prompt dulu, bukan tambah fitur. Tiga, biaya di atas budget — NO-GO atau go dengan optimasi: cache, routing, model kecil (AIE7) sebelum minta budget tambahan.",
        "Empat, data sensitif atau risiko tinggi — GO BERTAHAP wajib: mulai internal 2 minggu, beta 1.000 pengguna, baru umum; tiap lapis punya kriteria naik yang tertulis. Tidak ada lompatan.",
        "Aturan praktis 10 detik: jangan launch yang tidak bisa kamu ukur (eval), amankan (red team), dan bayar (biaya + SLA). Tiga bisa, satu tidak — berarti belum.",
        "Kriteria go/no-go — ditulis SEBELUM launch. GO jika: biaya < budget 20 persen margin, p95 < SLA, kualitas > target + margin error, red team <5 persen ASR, rollback <5 menit. NO-GO jika SATU SAJA gagal. Yang berbahaya: kriteria ditulis SETELAH melihat angka (selalu “cukup baik”!). Tulis dulu, ukur kemudian, patuhi hasilnya. Disiplin ini = beda profesional vs amatir. TanyaDok: GO BERSYARAT (p99 + sampel).",
        "Kriteria darurat — kapan matikan. 'Matikan TanyaDok jika: error >5% 10 menit ATAU biaya >3x normal ATAU 1 insiden PII.' Tertulis SEBELUM launch, bukan dipikirkan saat panik. Kill criteria = rem darurat yang sudah dipasang.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Go bertahap adalah cara engineer membeli informasi murah: 2 minggu internal menemukan 80 persen masalah dengan 1 persen risiko. Launch big-bang adalah cara membeli informasi yang sama dengan harga penuh — plus headline bila gagal.",
      },
      reference: "Empat syarat go; go bertahap untuk risiko tinggi; kriteria naik tertulis per lapis.",
    },
    {
      id: "minicase-launch",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: keputusan launch TanyaDok",
      prose: [
        "Data di meja: eval end-to-end 6/7 = 86 persen (ambang 85 persen) — lolos tipis. Red team 20 serangan: ASR 0 persen setelah filter — lolos. Biaya Rp2,5 juta/bulan dari budget Rp10 juta — lolos. Latensi 1.920ms dari SLA 3.000ms — lolos. Empat syarat terpenuhi: GO.",
        "Tetapi: margin eval tipis (86 vs 85) dan satu-satunya miss adalah ketiadaan abstention. Keputusan matang: GO BERTAHAP — tambah satu baris abstention threshold dulu (diprediksi 7/7), rilis internal 2 minggu, monitor abstention rate harian; bila abstention >15 persen, artinya dokumen kurang lengkap — perbaiki dokumen, bukan model.",
        "Twist terakhir: keputusan terbaik bukan 'go' atau 'no-go', melainkan 'go dengan syarat yang tertulis'. Engineer senior tidak menghindari risiko — ia memberi harga dan batas pada risiko.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Launch bertahap dengan kriteria tertulis adalah risk appetite statement versi engineering: berapa banyak risiko yang boleh diambil di tiap lapis, dan kapan harus berhenti. Sama seperti limit risiko kredit — bedanya objeknya aplikasi AI.",
      },
      reference: "Go/no-go/bertahap dengan syarat tertulis. Risiko diberi harga dan batas, bukan dihindari atau diabaikan.",
    },
    {
      id: "varian-finance",
      eyebrow: "Langkah 8 · Varian domain",
      title: "Varian capstone: asisten kebijakan kredit",
      prose: [
        "Capstone dasar lesson ini — TanyaDok — merangkai enam kotak pipeline (Dokumen → Chunk → Embed → Retrieve → Generate → Eval) menjadi aplikasi tanya-jawab atas SOP bank, dievaluasi dengan golden set tujuh pertanyaan (skor 6/7), dan keputusan arsitekturnya yang paling penting adalah abstention threshold: diam saat skor retrieval terlalu rendah. Sekarang bayangkan versi seriusnya: tim risiko kredit meminta asisten yang menjawab pertanyaan analis atas dokumen kebijakan kredit plus contoh memo analis — dengan sitasi sumber wajib di setiap jawaban. Pipeline-nya sama, tetapi domainnya menuntut lima hal yang capstone dasar tidak miliki.",
        "Pertama, dokumen sumber = PDF kebijakan hasil scan. OCR bisa salah membaca angka ('5,75%' terbaca '6,75%') atau menghilangkan struktur tabel yang justru memuat angka penting. Maka arsitektur bertambah satu kotak sebelum chunking: validasi ekstraksi. Halaman ber-confidence rendah ditolak dan dikembalikan untuk scan ulang manusia; tabel disimpan utuh dalam satu chunk (jangan dipotong); angka-angka kunci diaudit manusia lewat sampling. Aturannya: chunk yang masuk index harus bisa dilacak kembali ke halaman sumbernya — tanpa itu, sitasi hanyalah dekorasi.",
        "Kedua, jawaban salah berdampak regulasi. Di TanyaDok, jawaban ngawur soal direktur utama hanya memalukan; di sini, jawaban salah soal syarat agunan bisa meloloskan kredit yang seharusnya ditolak — dengan jejak audit atas nama tim. Karena itu ambang sitasi dan 'tidak tahu' dibuat jauh lebih ketat: setiap klaim faktual wajib bersitasi, dan pertanyaan dibagi tiga tingkat risiko — info umum boleh dijawab langsung, interpretasi kebijakan wajib bersitasi penuh, dan apapun yang berdampak keputusan kredit wajib lewat human review SEBELUM sampai ke analis. Metriknya bukan sekadar akurasi jawaban, melainkan tingkat eskalasi yang tepat: kasus berisiko tinggi yang lolos tanpa review manusia = kegagalan sistem, seberapa pun 'benar' jawabannya.",
        "Ketiga, data nasabah = PII. Contoh memo analis yang ikut di-index bisa berisi nama, NIK, dan nomor rekening. Masking dilakukan SEBELUM embedding (bukan setelah retrieval — karena vektor tidak bisa di-unsee), dan akses dibedakan per peran: analis melihat portofolionya sendiri, reviewer melihat versi teredaksi, admin melihat log tanpa isi dokumen. Ditambah kebijakan retensi: dokumen nasabah dihapus sesuai jadwal dan setiap penghapusan dicatat. Red team khusus PII wajib lolos: probing 'sebutkan nasabah dengan limit di atas X' harus selalu dijawab dengan penolakan atau data teredaksi, tidak pernah bocor.",
        "Keempat, eval set dibangun dari pertanyaan analis sungguhan — bukan pertanyaan buatan — plus kasus tepi yang dirancang untuk menjebak: dokumen kedaluwarsa (kebijakan v2 sudah diganti v3), dua versi yang isinya konflik, angka hasil OCR yang meragukan, pertanyaan di luar korpus. Perilaku yang diharapkan ditulis eksplisit per kasus: untuk versi konflik, jawab dengan sitasi versi terbaru DAN tandai adanya konflik; untuk dokumen kedaluwarsa, jawab 'kebijakan telah diperbarui' dengan sitasi versi baru. Eval menilai tiga hal: kebenaran jawaban, akurasi sitasi (apakah setiap klaim bersitasi ke dokumen yang masih berlaku?), dan ketepatan abstain.",
        "Kelima, metrik keberhasilan domain: citation accuracy (target ≥95% — setiap klaim faktual tertaut ke sumber yang masih berlaku), abstain tepat pada ≥90% kasus tepi, 0 kebocoran PII pada red team, dan abstention rate harian dipantau (bila >25%, itu sinyal dokumen kurang lengkap — perbaiki korpus, bukan modelnya). Deliverable proyek ini: (1) diagram arsitektur dengan keputusan ambang sitasi/abstain yang tertulis; (2) pipeline OCR → validasi → chunk → index beserta audit log halaman-per-halaman; (3) eval harness: 30+ pertanyaan analis sungguhan + 10 kasus tepi dengan perilaku yang diharapkan; (4) kebijakan PII: daftar field yang dimask + matriks akses peran; (5) launch checklist versi finance. Kriteria lulus: keempat metrik di atas terpenuhi sekaligus — gagal satu = belum launch, sama seperti empat syarat TanyaDok.",
        "💡 Intuisi: capstone dasar mengoptimasi tingkat jawaban benar; varian finance mengoptimasi penolakan yang bisa dipercaya. Analis yang menerima 'tidak tahu' akan bertanya ke atasan — aman. Analis yang menerima jawaban salah lengkap dengan sitasi palsu akan meneruskannya ke komite kredit — dan sitasi palsu itu membuat kesalahan LOLOS review manusia. Di domain ini, jawaban yang terdengar benar adalah musuh yang lebih berbahaya daripada jawaban yang ngawur.",
      ],
      tasks: [
        { id: "t1", text: "Tulis matriks abstain-vs-eskalasi: 3 tingkat risiko pertanyaan (info umum / interpretasi kebijakan / berdampak keputusan kredit) + aturan tiap tingkat (jawab langsung, jawab + sitasi penuh, wajib human review dulu)" },
        { id: "t2", text: "Rancang 5 kasus tepi untuk eval set (dokumen kedaluwarsa, dua versi konflik, angka OCR meragukan, pertanyaan di luar korpus, PII dalam konteks) + tulis perilaku sistem yang diharapkan untuk tiap kasus" },
        { id: "t3", text: "Susun daftar redaksi PII: 6 field yang wajib dimask SEBELUM indexing + matriks peran (analis / reviewer / admin) yang boleh melihat versi tanpa mask" },
        { id: "t4", text: "Tentukan angka ambang lulus: citation accuracy, abstain-tepat, batas abstention rate harian — tulis alasan kenapa tiap angka bukan 100%" },
      ],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Sitasi ada = jawaban aman.' Salah di domain finance. Sitasi bisa menunjuk dokumen yang sudah kedaluwarsa, versi yang berkonflik dengan versi terbaru, atau angka hasil OCR yang korup. Sitasi adalah klaim yang harus diaudit: apakah dokumennya masih berlaku? Versinya benar? Angkanya cocok dengan sumber? Audit sitasi adalah separuh pekerjaan eval di domain ini — sitasi yang tidak diaudit hanyalah jawaban ngawur yang berdasi.",
      },
      reference: "Varian domain = capstone dasar + risiko domain. Ubah arsitektur tepat di titik yang domain menuntut: OCR tervalidasi, sitasi ketat, PII termask, eval dari pertanyaan sungguhan.",
    },    {
      id: "proyek-domain-hilang",
      eyebrow: "Langkah 9 · Proyek domain",
      title: "Tiga proyek domain yang hilang: regulasi, fraud, text-to-SQL",
      prose: [
        "Spec AE19 meminta empat proyek domain; capstone dasar baru mengantar satu (asisten kebijakan kredit, Langkah 8). Tiga sisanya ada di sini — masing-masing memakai pipeline yang sama, tetapi menuntut satu hal berbeda yang tidak dimiliki TanyaDok.",
        "Pertama, tanya-jawab regulasi. Bedanya dengan SOP internal: regulasi punya VERSI dan tanggal berlaku. Jawaban harus menyebut versi yang dipakai (“berdasarkan POJK 12/2024”) dan menolak menjawab dari versi kedaluwarsa. Eval-nya memakai pertanyaan analis sungguhan plus kasus tepi: dua versi yang konflik, dokumen kedaluwarsa, angka hasil OCR yang meragukan. Perilaku yang diharapkan ditulis eksplisit per kasus — untuk versi konflik, jawab dengan sitasi versi terbaru DAN tandai adanya konflik.",
        "Kedua, ringkasan kasus fraud. Inputnya bukan dokumen statis melainkan berkas perkara: alert, mutasi, riwayat nasabah, dan catatan analis sebelumnya. Outputnya ringkasan berkas plus skor prioritas — URUTAN antrean analis, bukan vonis. Garisnya sama seperti KYC/AML di AAI12: agen menyiapkan berkas, manusia memutuskan eskalasi. Metriknya: waktu susun berkas dan tingkat draf diterima tanpa ubahan besar — bukan “jumlah fraud tertangkap”, karena itu keputusan manusia.",
        "Ketiga, text-to-SQL analyst — ada lab-nya di langkah berikut. Analis bertanya dalam bahasa sehari-hari, agen menerjemahkan ke SQL, menjalankan atas data, lalu menjawab dengan angka DAN menunjukkan query-nya. Bahayanya spesifik: SQL yang salah menghasilkan angka yang salah tetapi terlihat resmi — lengkap dengan tabel. Mitigasinya: user database read-only, LIMIT wajib, validasi skema sebelum eksekusi, dan query selalu ditampilkan bersama jawaban agar analis bisa memeriksa.",
        "Pola bersama ketiganya: pipeline RAG yang sama, risiko domain yang berbeda. Tanya-jawab regulasi menuntut ketepatan versi; ringkasan fraud menuntut akuntabilitas keputusan; text-to-SQL menuntut angka yang bisa diperiksa ulang. Arsitektur yang tidak menyebut risiko domainnya bukan arsitektur — ia demo.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Empat proyek domain AE19 bukan empat aplikasi — melainkan satu pipeline dengan empat risiko berbeda. Insinyur yang paham risikonya bisa membangun keempatnya; yang hanya hafal pipelinenya akan membangun empat demo yang sama.",
      },
      reference: "Regulasi = ketepatan versi; fraud = berkas, bukan vonis; text-to-SQL = angka yang bisa diperiksa ulang.",
    },

    {
      id: "lab-text-to-sql",
      eyebrow: "Langkah 10 · Lab text-to-SQL",
      title: "Lab: text-to-SQL analyst atas tabel transaksi (mock)",
      prose: [
        "Analis bertanya: “berapa total reimbursement bulan ini?” Tugasmu: (1) implementasikan `nl_ke_sql` — terjemahkan pertanyaan ke SQL dengan pemetaan kata kunci ke kategori dan kolom; (2) implementasikan `jalankan` — eksekutor SQL mini yang memahami SELECT SUM(kolom) FROM transaksi WHERE kategori = 'X'; (3) jalankan dan cetak query beserta totalnya.",
        "Aturan keamanan yang sudah tertanam di mock: hanya SELECT yang diizinkan (bukan INSERT/UPDATE/DELETE), hanya kolom `jumlah` yang boleh diagregasi, dan kategori harus ada di daftar yang dikenal. Di produksi, tambahkan user database read-only dan LIMIT — di sini, tiga aturan mock sudah cukup untuk menunjukkan pola: terjemahkan, validasi, baru eksekusi.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `nl_ke_sql` (kata kunci -> kategori) dan `jalankan` (parse SUM + WHERE kategori)" },
        { id: "t2", text: "Jalankan pertanyaan contoh dan cetak query + total" },
      ],
      expected: "sql=SELECT SUM(jumlah) FROM transaksi WHERE kategori = 'reimbursement'\ntotal=1500000",
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "“SQL-nya jalan berarti angkanya benar.” Salah: query yang jalan tetapi kategorinya salah (misal “lembur” terbaca “reimbursement”) menghasilkan angka yang rapi dan salah total. Karena itu jawaban text-to-SQL WAJIB menampilkan query-nya — analis memeriksanya, bukan mempercayainya.",
      },
      hints: [
        "Pemetaan: 'reimbursement' -> kategori 'reimbursement'; 'lembur' -> 'lembur'; selain itu -> 'tidak ada data'.",
        "Parse dengan regex: SELECT SUM\\((\\w+)\\) FROM transaksi WHERE kategori = '(\\w+)'",
        "Tolak query yang tidak diawali SELECT, atau kolom bukan 'jumlah'.",
      ],
      code: {
        starter: `# DATA — jangan diubah
import re

TRANSAKSI = [
    {"id": "T1", "kategori": "reimbursement", "jumlah": 500000},
    {"id": "T2", "kategori": "reimbursement", "jumlah": 250000},
    {"id": "T3", "kategori": "lembur", "jumlah": 900000},
    {"id": "T4", "kategori": "reimbursement", "jumlah": 750000},
    {"id": "T5", "kategori": "transport", "jumlah": 300000},
    {"id": "T6", "kategori": "lembur", "jumlah": 400000},
]

# TULIS KODEMU: terjemahan NL -> SQL + eksekutor mini
def nl_ke_sql(pertanyaan):
    ...

def jalankan(sql):
    ...

pertanyaan = "berapa total reimbursement bulan ini?"
sql = nl_ke_sql(pertanyaan)
total = jalankan(sql)
print(f"sql={sql}")
print(f"total={total}")`,
        lockLines: 13,
        solution: `# DATA — jangan diubah
import re

TRANSAKSI = [
    {"id": "T1", "kategori": "reimbursement", "jumlah": 500000},
    {"id": "T2", "kategori": "reimbursement", "jumlah": 250000},
    {"id": "T3", "kategori": "lembur", "jumlah": 900000},
    {"id": "T4", "kategori": "reimbursement", "jumlah": 750000},
    {"id": "T5", "kategori": "transport", "jumlah": 300000},
    {"id": "T6", "kategori": "lembur", "jumlah": 400000},
]

# TULIS KODEMU: terjemahan NL -> SQL + eksekutor mini
def nl_ke_sql(pertanyaan):
    q = pertanyaan.lower()
    if "reimbursement" in q:
        kat = "reimbursement"
    elif "lembur" in q:
        kat = "lembur"
    elif "transport" in q:
        kat = "transport"
    else:
        return "tidak ada data"
    return f"SELECT SUM(jumlah) FROM transaksi WHERE kategori = '{kat}'"

def jalankan(sql):
    if not sql.startswith("SELECT"):
        return "ditolak: bukan SELECT"
    m = re.match(r"SELECT SUM\((\w+)\) FROM transaksi WHERE kategori = '(\w+)'$", sql)
    if not m or m.group(1) != "jumlah":
        return "ditolak: query tidak valid"
    kat = m.group(2)
    return sum(r["jumlah"] for r in TRANSAKSI if r["kategori"] == kat)

pertanyaan = "berapa total reimbursement bulan ini?"
sql = nl_ke_sql(pertanyaan)
total = jalankan(sql)
print(f"sql={sql}")
print(f"total={total}")`,
        checks: [
          { kind: "defined", task: "t1", name: "nl_ke_sql", label: "`nl_ke_sql` terdefinisi", msg: "Definisikan nl_ke_sql(pertanyaan) dengan pemetaan kata kunci." },
          { kind: "defined", task: "t1", name: "jalankan", label: "`jalankan` terdefinisi", msg: "Definisikan jalankan(sql) sebagai eksekutor SELECT SUM mini." },
          { kind: "equal", task: "t2", name: "total", value: 1500000, tol: 1e-9, label: "`total` = 1500000", msg: "500.000 + 250.000 + 750.000 = 1.500.000. Cek filter kategorinya." },
          { kind: "stdout_matches", task: "t2", pattern: "sql=SELECT SUM\\(jumlah\\) FROM transaksi WHERE kategori = 'reimbursement'\\ntotal=1500000", label: "query + total sesuai format", msg: "Samakan format print dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Text-to-SQL = terjemahkan, validasi, baru eksekusi — dan selalu tampilkan query-nya.",
    },

    {
      id: "dashboard-biaya",
      eyebrow: "Langkah 11 · Dashboard biaya",
      title: "Dashboard biaya: satu layar untuk direksi",
      prose: [
        "Spec capstone meminta dashboard biaya — dan sampai langkah ini biaya TanyaDok hanya aritmetika di Langkah 4 dan 5. Dashboard mengubah aritmetika itu menjadi SATU LAYAR yang dibaca direksi tiap pagi: biaya per hari, biaya per request, biaya per tahap, tren 7 hari, dan alert saat mendekati budget.",
        "Angkanya dihitung ulang dari lab Langkah 5 (bukan angka baru): biaya harian $5,25 untuk 5.000 request; biaya per request $5,25 dibagi 5.000 = $0,00105; biaya per bulan (30 hari) $5,25 kali 30 = $157,50. Per tahap: retrieval hampir gratis (pencarian lokal), generate mendominasi — input 1.200 token kali $0,5 per 1 juta token = $0,0006, output 300 token kali $1,5 per 1 juta token = $0,00045; jumlahnya $0,00105 — cocok dengan biaya per request.",
        "Tiga panel yang wajib ada. Panel tren: biaya 7 hari terakhir — naik tiba-tiba berarti ada yang berubah (prompt membengkak, cache mati, atau serangan). Panel per tahap: bila generate 95 persen biaya, optimasi retrieval tidak ada gunanya — hemat di tempat yang besar. Panel alert: kuning di 80 persen budget, merah di 100 persen — dengan aksi yang tertulis (turunkan model, nyalakan cache, batasi request).",
        "Dashboard yang baik menjawab tiga pertanyaan dalam 10 detik: berapa biayanya sekarang, ke mana larinya, dan apa yang berubah sejak kemarin. Dashboard yang hanya menampilkan total bulanan adalah laporan keuangan, bukan alat operasi — ia memberi tahu kamu bangkrut setelah uangnya habis.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Biaya per request $0,00105 terdengar kecil sampai dikali 5.000 request per hari selama 30 hari: $157,50 per bulan. Dashboard ada agar perkalian itu terlihat SEBELUM tagihan datang, bukan sesudahnya.",
      },
      reference: "Dashboard biaya = per hari + per request + per tahap + tren + alert. Angka dari lab Langkah 5.",
    },

    {
      id: "tracing-langkah",
      eyebrow: "Langkah 12 · Tracing",
      title: "Tracing sebagai langkah sendiri: satu request, satu jejak",
      prose: [
        "Sampai langkah ini tracing hanya disebut sekali — di opsi kuis Langkah 7 (“Lihat trace dan atribusi”). Padahal spec capstone memintanya sebagai bagian sistem. Tracing bukan logging yang lebih rapi: logging mencatat peristiwa, tracing mencatat HUBUNGAN — satu request = satu trace id, tiap tahap = satu span dengan nama, durasi, token, dan status.",
        "Enam span TanyaDok: input-guard, router, retrieve, generate, verifier, logger. Tiap span mencatat durasi dan tokennya sendiri. Contoh nyata: request lambat 8 detik — tanpa trace, kamu menebak-nebak; dengan trace, kamu melihat span generate 7,6 detik dan retrieve 0,1 detik — penyebabnya model, bukan retrieval. Tanpa atribusi, 60 persen tim mengganti model saat yang rusak adalah retrieval — dan sebaliknya.",
        "Sampling yang sehat: 100 persen request error di-trace, 10 persen request sukses di-trace — cukup untuk pola, murah untuk disimpan. Logger 5 field dari Langkah 2 ditambah trace id menjadi 6 field: tanpa trace id, log dari enam span tidak bisa dirangkai menjadi satu cerita.",
        "Aturan praktis: bila jawaban buruk di produksi, langkah pertama BUKAN ganti model — melainkan buka trace dan tanya tahap mana yang menyimpang. Itulah jawaban kuis Langkah 7, dan inilah langkah yang membuatnya bisa dilakukan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Trace adalah jejak audit teknis: saat regulator atau direksi bertanya “kenapa jawaban ini keluar”, trace-lah yang menjawab — span mana, model versi berapa, dokumen apa yang di-retrieve. Tanpa trace, jawabannya adalah “tidak tahu”.",
      },
      reference: "Satu request = satu trace id; enam span; 100 persen error + 10 persen sukses di-trace.",
    },

    {
      id: "design-review",
      eyebrow: "Langkah 13 · Design review",
      title: "Design review: arsitektur TanyaDok di hadapan reviewer",
      prose: [
        "Design review adalah langkah eksplisit di track ini: kamu mengkritik sebuah RANCANGAN sebelum ia dibangun. Rancangan TanyaDok di atas meja: enam kotak, abstention threshold 0,05, eval 6/7, biaya $5,25 per hari, dan keputusan go bertahap. Tiga pertanyaan reviewer yang wajib dijawab tertulis.",
        "Pertanyaan pertama: apa yang terjadi bila dokumen kedaluwarsa? Index tidak tahu versi — jawaban mengutip SOP lama dengan percaya diri. Perbaikan: versioning dokumen + tanggal berlaku di tiap chunk + eval kasus tepi dokumen kedaluwarsa (seperti Langkah 9). Pertanyaan kedua: abstention rate di atas 15 persen berarti apa? Bukan model yang rusak — dokumen yang kurang lengkap. Perbaiki korpus, bukan modelnya.",
        "Pertanyaan ketiga: biaya naik 10 kali lipat bila request naik 10 kali lipat — apa rencana sebelum minta budget tambahan? Cache (AIE7), routing ke model kecil (AIE7), dan dashboard biaya (Langkah 11) sebagai bukti. Rancangan yang tidak punya jawaban atas ketiganya belum siap di-review — ia baru siap di-demo.",
      ],
      tasks: [
        { id: "t1", text: "Tulis 1 kelemahan tambahan rancangan TanyaDok di luar ketiga pertanyaan di atas, beserta perbaikan konkretnya" },
        { id: "t2", text: "Tulis kriteria naik tiap lapis launch bertahap (internal -> beta -> umum) dalam 1 kalimat per lapis" },
      ],
      note: {
        title: "💡 Intuisi: design review mencari asumsi, bukan kesalahan ketik",
        body: "Kode yang salah ketik ketahuan di test. Asumsi yang salah (“dokumen tidak pernah kedaluwarsa”, “biaya akan selalu segini”) ketahuan di insiden. Design review adalah satu-satunya momen murah untuk menangkap asumsi.",
      },
      reference: "Design review = kritik rancangan sebelum dibangun: versi dokumen, abstention rate, rencana biaya.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan refleksi capstone dari inti track. Setiap opsi punya alasan kenapa benar atau salah. Catatan penutup: lesson setelah capstone (AIE13–AIE23) adalah modul lanjutan opsional — capstone menutup inti track; lanjutkan bila butuh pendalaman (hybrid search, GraphRAG, self-hosting).",
      ],
      tasks: [],
      summary: [
        "Arsitektur end-to-end: Dokumen → Chunk → Embed → Retrieve → Generate → Eval; tiap kotak = satu lesson.",
        "Skor komponen bagus tidak menjamin skor sistem — integrasi punya failure mode sendiri (contoh: tanpa abstention).",
        "Abstention threshold pada skor retrieval menutup lubang 'menjawab yang tidak ada di dokumen'.",
        "Empat syarat launch: eval ≥ ambang, red team lolos, biaya dalam budget, SLA terpenuhi.",
        "Launch bertahap (internal → beta → umum) membeli informasi murah; keputusan ditulis dengan syarat.",
        "Selamat — kamu menyelesaikan inti track AI Engineering. Lesson AIE13–AIE23 adalah modul lanjutan opsional.",
      ],
      next: { label: "AIE13 — Hybrid Search + Reranking", href: "/v2/learn/aie13-hybrid-search-reranking" },
      quiz: [
        {
          q: "Mengapa skor end-to-end TanyaDok (6/7) di bawah skor tiap komponen?",
          options: [
            { text: "Integrasi punya failure mode sendiri: tidak ada komponen yang menangani 'tidak ada jawaban'", why: "Tepat: retrieval benar (skor 0,00), generator tetap menebak — lubang di antara kotak, bukan di dalamnya.", correct: true },
            { text: "Karena mock generator terlalu sederhana", why: "Mock memang sederhana, tetapi miss-nya adalah keputusan arsitektur (tanpa abstention), bukan keterbatasan mock.", correct: false },
            { text: "Karena dokumennya terlalu sedikit", why: "Empat dokumen cukup untuk 6 pertanyaan; masalahnya pertanyaan ketujuh di luar dokumen.", correct: false },
            { text: "Karena embedding Jaccard terlalu lemah", why: "Jaccard justru benar memberi skor 0,00 — ia bekerja dengan tepat.", correct: false },
          ],
        },
        {
          q: "Apa fungsi abstention threshold pada skor retrieval?",
          options: [
            { text: "Mengubah jawaban ngawur menjadi 'tidak tahu' yang jujur saat skor terlalu rendah", why: "Tepat: satu baris ini menaikkan 6/7 menjadi 7/7 (6 benar + 1 abstain tepat).", correct: true },
            { text: "Mempercepat retrieval", why: "Tidak ada efek kecepatan.", correct: false },
            { text: "Menurunkan biaya token", why: "Efek samping kecil; fungsi utamanya kejujuran.", correct: false },
            { text: "Menggantikan kebutuhan eval", why: "Kebalikannya: butuh eval untuk memilih nilai threshold.", correct: false },
          ],
        },
        {
          q: "TanyaDok: eval 86 persen (ambang 85), red team lolos, biaya dan SLA aman. Keputusan?",
          options: [
            { text: "Go bertahap: tambah abstention dulu, rilis internal, monitor, baru umum", why: "Tepat: margin tipis + satu lubang diketahui = go dengan syarat tertulis, bukan big-bang.", correct: true },
            { text: "Launch besar-besaran langsung ke semua pengguna", why: "Margin 1 persen di atas ambang tidak cukup untuk big-bang.", correct: false },
            { text: "No-go total, proyek dibatalkan", why: "Terlalu ekstrem: empat syarat terpenuhi, hanya perlu penguatan.", correct: false },
            { text: "Tambah fitur dulu selama 3 bulan baru launch", why: "Menunda tanpa alasan terukur; syaratnya sudah hampir terpenuhi.", correct: false },
          ],
        },
        {
          q: "Kapan RAG seperti TanyaDok TIDAK cukup dan butuh function calling?",
          options: [
            { text: "Ketika asisten harus BERTINDAK (cek saldo, blokir kartu), bukan sekadar menjawab", why: "Tepat: RAG menjawab dari dokumen; aksi dunia nyata butuh tool via function calling (AIE6).", correct: true },
            { text: "Ketika dokumennya banyak", why: "Banyak dokumen justru kasus ideal RAG.", correct: false },
            { text: "Ketika butuh sitasi", why: "Sitasi adalah kekuatan RAG.", correct: false },
            { text: "Tidak pernah — RAG cukup untuk semua", why: "RAG tidak bisa mengeksekusi aksi.", correct: false },
          ],
        },
        {
          q: "Jawaban TanyaDok buruk di produksi. Langkah pertama?",
          options: [
            { text: "Lihat trace dan atribusi: tahap mana yang menyimpang (AIE8)", why: "Tepat: 60 persen masalah RAG ada di retrieval — ganti model tanpa atribusi adalah judi mahal.", correct: true },
            { text: "Langsung ganti ke model yang lebih besar", why: "Tanpa atribusi, ini mahal dan sering salah sasaran.", correct: false },
            { text: "Tambah dokumen ke index", why: "Mungkin, tetapi buta tanpa tahu tahap yang gagal.", correct: false },
            { text: "Naikkan temperature", why: "Temperature tidak memperbaiki retrieval kosong.", correct: false },
          ],
        },
        {
          q: "Dashboard biaya TanyaDok: biaya harian $5,25 untuk 5.000 request. Biaya per request dan per bulan (30 hari)?",
          options: [
            { text: "$0,00105 per request; $157,50 per bulan", why: "Benar: 5,25 dibagi 5.000 = 0,00105; 5,25 kali 30 = 157,50. Input 0,0006 + output 0,00045 = 0,00105 — cocok.", correct: true },
            { text: "$0,0105 per request; $1.575 per bulan", why: "Salah: koma bergeser satu digit — 5,25 dibagi 5.000 = 0,00105, bukan 0,0105.", },
            { text: "$0,000105 per request; $15,75 per bulan", why: "Salah: koma bergeser ke arah lain — hitung ulang 5,25 dibagi 5.000.", },
            { text: "$1,05 per request; $157.500 per bulan", why: "Salah: itu 5,25 dibagi 5 — bukan dibagi 5.000.", },
          ],
        },
        {
          q: "Jawaban TanyaDok lambat (8 detik) di produksi. Langkah pertama yang benar menurut tracing?",
          options: [
            { text: "Ganti ke model yang lebih besar", why: "Tanpa atribusi itu judi mahal — belum tentu model yang lambat.", },
            { text: "Buka trace: span mana yang menyimpang (generate 7,6 detik vs retrieve 0,1 detik)", why: "Benar: trace menunjukkan penyebabnya model, bukan retrieval — perbaikan jadi terarah.", correct: true },
            { text: "Tambah dokumen ke index", why: "Tidak ada hubungannya dengan latensi — itu perbaikan recall.", },
            { text: "Matikan logging agar lebih cepat", why: "Logging bukan penyebab 8 detik — dan mematikannya menghilangkan jejak audit.", },
          ],
        },
      ],
    },
  ],
};
