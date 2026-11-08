import type { V2Lesson } from "../lib/types";

const LOOP_SVG = `<svg viewBox="0 0 480 210" role="img" aria-label="Siklus feedback loop: kumpulkan, agregasi pola, aksi perbaikan, ukur ulang.">
<g font-family="var(--font-ui)" font-size="11">
<rect x="180" y="10" width="120" height="52" rx="10" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="240" y="32" text-anchor="middle" fill="var(--text)" font-weight="700">1. Kumpulkan</text>
<text x="240" y="48" text-anchor="middle" fill="var(--chart-text)" font-size="10">thumbs + alasan</text>
<rect x="330" y="80" width="120" height="52" rx="10" fill="none" stroke="var(--c2)" stroke-width="2"/>
<text x="390" y="102" text-anchor="middle" fill="var(--text)" font-weight="700">2. Agregasi</text>
<text x="390" y="118" text-anchor="middle" fill="var(--chart-text)" font-size="10">pola × frekuensi</text>
<rect x="180" y="148" width="120" height="52" rx="10" fill="none" stroke="var(--c3)" stroke-width="2"/>
<text x="240" y="170" text-anchor="middle" fill="var(--text)" font-weight="700">3. Aksi</text>
<text x="240" y="186" text-anchor="middle" fill="var(--chart-text)" font-size="10">fix template/RAG</text>
<rect x="30" y="80" width="120" height="52" rx="10" fill="none" stroke="var(--c4)" stroke-width="2"/>
<text x="90" y="102" text-anchor="middle" fill="var(--text)" font-weight="700">4. Ukur ulang</text>
<text x="90" y="118" text-anchor="middle" fill="var(--chart-text)" font-size="10">thumbs-down turun?</text>
<line x1="300" y1="36" x2="345" y2="80" stroke="var(--chart-grid)" stroke-width="1.5"/>
<line x1="390" y1="132" x2="300" y2="148" stroke="var(--chart-grid)" stroke-width="1.5"/>
<line x1="180" y1="174" x2="150" y2="132" stroke="var(--chart-grid)" stroke-width="1.5"/>
<line x1="90" y1="80" x2="180" y2="36" stroke="var(--chart-grid)" stroke-width="1.5"/>
<text x="240" y="112" text-anchor="middle" fill="var(--text)" font-size="12" font-weight="600">loop tertutup: tiap pola punya pemilik + deadline</text>
</g></svg>`;

const LLMOPS11_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Skor risiko total feedback per bulan: 10.000, lalu 5.230, lalu 3.040."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">5.000</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">10.000</text><rect x="72.5" y="20.0" width="86.4" height="160.0" rx="3" fill="var(--c4)"/><text x="115.7" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">10.000</text><text x="115.7" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">B1</text><rect x="211.8" y="96.3" width="86.4" height="83.7" rx="3" fill="var(--c3)"/><text x="255.0" y="90.3" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">5.230</text><text x="255.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">B2</text><rect x="351.1" y="131.4" width="86.4" height="48.6" rx="3" fill="var(--c1)"/><text x="394.3" y="125.4" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">3.040</text><text x="394.3" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">B3</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">skor = volume x severity</text></svg>`;

export const llmops11: V2Lesson = {
  slug: "llmops11-feedback",
  track: "LLMOps",
  module: "Safety & Skala",
  title: "LLMOps11 — Feedback Loop",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "2.000 thumbs-down yang tidak pernah dibaca",
      prose: [
        "Chatbot KopiChain punya tombol thumbs-down di setiap jawaban. Tiga bulan, terkumpul 2.000. Tidak satu pun dibaca — `nanti kalau sempat`. Saat akhirnya seorang analis iseng mengunduhnya, polanya menampar: 80% berasal dari hanya 3 masalah — tanggal salah format, konteks polis kosong, jawaban terlalu panjang. Tiga perbaikan template/RAG akan menghapus 1.600 keluhan. Tiga bulan penderitaan user untuk masalah yang bisa diperbaiki dalam seminggu.",
        "Twist-nya: tim mengira feedback gunanya `melatih model`. Yang benar: 80% feedback menunjuk ke operasi — template, data RAG, guardrail — bukan ke bobot model. Feedback loop LLMOps bukan soal machine learning; ia soal mendengarkan dengan sistematis, lalu memperbaiki lapisan yang tepat.",
        "Lesson ini tentang menutup loop: mengumpulkan sinyal yang benar, mengagregasi menjadi pola yang bisa ditindak, dan mengukur apakah perbaikan benar-benar mengurangi keluhan.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa 80% feedback menunjuk ke operasi, bukan ke model; (2) menghitung skor prioritas (frekuensi × severity) dan menggunakannya untuk memprioritaskan pola; (3) merancang agregasi feedback menjadi pola yang bisa ditindak; (4) menutup loop: dari pola ke perbaikan ke pengukuran.",
      ],
      tasks: [],
      note: {
        title: "Mitos: feedback user = data training",
        type: "pitfall",
        body: "Yang benar: sebagian besar feedback menunjuk ke bug operasional (template salah, konteks kosong, jawaban kepanjangan) yang diperbaiki dalam hitungan hari tanpa menyentuh model. Melempar semua feedback ke `data fine-tune` = menunggu 2 bulan untuk memperbaiki typo template.",
      },
      reference: "80% feedback → perbaikan operasi (template/RAG/guardrail), bukan training model.",
    },
    {
      id: "kumpulkan",
      eyebrow: "Langkah 2 · Konsep",
      title: "Kumpulkan sinyal yang benar",
      prose: [
        "Tiga jenis sinyal. Eksplisit: thumbs up/down + alasan singkat (wajib ada opsi alasan — `salah`, `tidak lengkap`, `tidak sopan`, `lainnya`). Tanpa alasan, thumbs-down hanya angka keluhan tanpa diagnosis. Implisit: user bertanya ulang dengan parafrasa = KEMUNGKINAN jawaban sebelumnya tidak memuaskan (proksi, bukan bukti — user bisa bertanya ulang karena ingin detail lebih lanjut, bukan karena jawaban salah); user langsung menelepon CS setelah chat = sinyal KUAT chatbot tidak menyelesaikan masalah (bukan bukti mutlak — bisa juga user memang lebih nyaman menelepon); eskalasi ke manusia = pola kegagalan yang mahal.",
        "Sinyal implisit sering lebih jujur dari eksplisit — user yang frustrasi jarang menekan thumbs-down, mereka langsung pergi. Instrumentasi: korelasikan session (pertanyaan ulang dalam 5 menit, chat→telepon dalam 1 jam) dan hitung `repeat rate` sebagai proksi kepuasan yang tidak butuh partisipasi user.",
        "💡 Intuisi: setiap feedback harus bisa menjawab `lapisan mana yang salah?` Thumbs-down tanpa konteks = keluhan; thumbs-down + trace ID = bukti yang bisa ditindak. Selalu tautkan feedback ke trace (LLMOps7).",
      ],
      formula: String.raw`\text{prioritas} = \text{frekuensi} \times \text{severity}`,
      formulaNote: "frekuensi = berapa banyak feedback berpola sama; severity = dampak per kejadian (kebocoran data > typo tanggal). Perbaiki yang skornya tertinggi dulu.",
      tasks: [],
      note: {
        title: "Mitos: makin banyak feedback terkumpul = makin baik",
        type: "pitfall",
        body: "Yang benar: 2.000 feedback yang tidak dibaca = 0 nilai + ilusi `kita mendengarkan`. Nilai feedback = kecepatan dari keluhan menjadi perbaikan. Kumpulkan hanya sebanyak yang sanggup kamu proses — atau otomatiskan agregasinya (seperti lab berikut).",
      },
      reference: "Eksplisit (thumbs + alasan) + implisit (repeat rate, eskalasi). Tautkan ke trace.",
    },
    {
      id: "agregasi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Dari 2.000 keluhan menjadi 3 pola",
      prose: [
        "Agregasi = mengelompokkan feedback menjadi pola yang bisa ditindak. Cara murah: kategorisasi aturan (keyword `tanggal` → template, `konteks kosong` → RAG) + hitung frekuensi. Cara mahal: clustering embedding + review manusia. Mulai dari yang murah — 80% pola terlihat jelas tanpa ML.",
        "Untuk tiap pola, tentukan: lapisan penyebab (template/RAG/guardrail/model), pemilik, dan estimasi dampak (frekuensi × severity). Pola tanpa pemilik = pola yang tidak akan diperbaiki. Pola tanpa estimasi dampak = tidak bisa diprioritaskan melawan 50 pekerjaan lain.",
        "💡 Intuisi: pola kecil tapi parah mengalahkan pola besar tapi sepele. 60 laporan `menyebut NIK orang lain` (severity 10 → skor 600) mengalahkan 500 laporan `jawaban kepanjangan` (severity 1 → skor 500). Frekuensi × severity, bukan frekuensi saja. Catatan skala: 5 laporan kritis (skor 50) TIDAK mengalahkan 500 laporan sepele (skor 500) — perbandingan hanya bermakna bila skor dihitung, bukan dari label `kritis` saja. Dan pola kritis (kebocoran PII) tidak menunggu menang skor: ia masuk jalur incident (LLMOps9) apa pun skornya.",
        "💡 Intuisi: tutup loop secara publik ke user yang melapor bila memungkinkan (`masalah tanggal sudah diperbaiki, terima kasih atas laporannya`). Feedback yang ditindaklanjuti menghasilkan lebih banyak feedback berkualitas — lingkaran kebaikan.",
      ],
      tasks: [],
      note: {
        title: "Mitos: agregasi butuh pipeline ML canggih",
        type: "pitfall",
        body: "Yang benar: Counter + keyword (seperti lab berikut) menemukan 3 pola dominan dalam 10 baris kode. ML clustering berguna setelah pola-pola jelas habis diperbaiki. Jangan menunda 3 bulan menunggu `sistem agregasi AI` sementara 1.600 keluhan menunggu fix template.",
      },
      reference: "Kelompokkan → tentukan lapisan + pemilik + dampak → prioritaskan (frekuensi × severity).",
    },
    {
      id: "lab-feedback",
      eyebrow: "Langkah 4 · Lab",
      title: "Agregasi feedback menjadi pola (mock)",
      prose: [
        "Lab ini mensimulasikan 20 feedback KopiChain yang sudah dikategorikan: template, rag, guardrail, lain. Tugasmu: agregasi dengan Counter, temukan pola dominan, dan hitung berapa persen feedback yang tercakup 3 pola teratas.",
        "Coba eksplorasi: jika `guardrail` (2 kasus: menolak pertanyaan wajar) punya severity 10x lipat dari `lain`, pola mana yang harus diperbaiki duluan menurut rumus prioritas?",
      ],
      tasks: [
        { id: "t1", text: "Temukan `top1` = kategori terbanyak" },
        { id: "t2", text: "Hitung `top3_pct` = % feedback dalam 3 pola teratas" },
        { id: "t3", text: "Hitung `n` = total feedback" },
      ],
      expected: "top1=template  top3_pct=90%  n=20",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengurutkan manual dengan mata. Untuk 20 data masih bisa; untuk 2.000 tidak. Biasakan Counter + most_common sejak awal — pola kerja yang scalable lebih penting dari jawaban satu lab.",
      },
      hints: [
        "Ambil kategorinya: [k for _, k in feedback].",
        "Counter(...).most_common(3) memberi 3 teratas.",
        "top3_pct = sum(v for _, v in top3) / len(feedback) * 100",
      ],
      code: {
        starter: `from collections import Counter\n\nfeedback = [\n    ("tanggal salah format", "template"),\n    ("tanggal salah format", "template"),\n    ("tanggal salah format", "template"),\n    ("tanggal salah format", "template"),\n    ("tanggal salah format", "template"),\n    ("jawaban terlalu panjang", "template"),\n    ("jawaban terlalu panjang", "template"),\n    ("jawaban terlalu panjang", "template"),\n    ("konteks polis kosong", "rag"),\n    ("konteks polis kosong", "rag"),\n    ("konteks polis kosong", "rag"),\n    ("konteks polis kosong", "rag"),\n    ("konteks polis kosong", "rag"),\n    ("menolak pertanyaan wajar", "guardrail"),\n    ("menolak pertanyaan wajar", "guardrail"),\n    ("bahasa tidak sopan", "lain"),\n    ("bahasa tidak sopan", "lain"),\n    ("jawaban ngawur", "lain"),\n    ("jawaban ngawur", "lain"),\n    ("jawaban ngawur", "lain"),\n]\n\n# TULIS KODEMU: agregasi pola feedback\ncats = \ndist = \ntop3 = \ntop1 = \ntop3_pct = \nn = \n\nprint(f"top1={top1}  top3_pct={top3_pct:.0f}%  n={n}")`,
        lockLines: 26,
        solution: `from collections import Counter\n\nfeedback = [\n    ("tanggal salah format", "template"),\n    ("tanggal salah format", "template"),\n    ("tanggal salah format", "template"),\n    ("tanggal salah format", "template"),\n    ("tanggal salah format", "template"),\n    ("jawaban terlalu panjang", "template"),\n    ("jawaban terlalu panjang", "template"),\n    ("jawaban terlalu panjang", "template"),\n    ("konteks polis kosong", "rag"),\n    ("konteks polis kosong", "rag"),\n    ("konteks polis kosong", "rag"),\n    ("konteks polis kosong", "rag"),\n    ("konteks polis kosong", "rag"),\n    ("menolak pertanyaan wajar", "guardrail"),\n    ("menolak pertanyaan wajar", "guardrail"),\n    ("bahasa tidak sopan", "lain"),\n    ("bahasa tidak sopan", "lain"),\n    ("jawaban ngawur", "lain"),\n    ("jawaban ngawur", "lain"),\n    ("jawaban ngawur", "lain"),\n]\n\n# TULIS KODEMU: agregasi pola feedback\ncats = [k for _, k in feedback]\ndist = Counter(cats)\ntop3 = dist.most_common(3)\ntop1 = top3[0][0]\ntop3_pct = sum(v for _, v in top3) / len(feedback) * 100\nn = len(feedback)\n\nprint(f"top1={top1}  top3_pct={top3_pct:.0f}%  n={n}")`,
        checks: [
          { kind: "equal", task: "t1", name: "top1", value: "template", label: "`top1` seharusnya template", msg: "8 dari 20 = kategori terbanyak." },
          { kind: "equal", task: "t2", name: "top3_pct", value: 90, tol: 1e-9, label: "`top3_pct` seharusnya 90", msg: "(8+5+5)/20 × 100 = 90%." },
          { kind: "equal", task: "t3", name: "n", value: 20, tol: 1e-9, label: "`n` seharusnya 20", msg: "Total 20 feedback." },
          { kind: "stdout_matches", task: "t3", pattern: "top1=template\\s+top3_pct=90%\\s+n=20", label: "`print` menampilkan tiga angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Counter + most_common. Pola → lapisan + pemilik + dampak.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Pola apa → aksi apa",
      prose: [
        "Lima skenario. Satu: pola `tanggal salah format` (template) → fix template + tambah checker format ke golden set (LLMOps3) agar tidak regresi. Dua: pola `konteks kosong` (RAG) → perbaiki pipeline freshness/index (LLMOps4), bukan prompt. Tiga: pola `jawaban terlalu panjang` → turunkan max_tokens + instruksi ringkas di prompt; ukur ulang repeat rate.",
        "Empat: pola kecil tapi severity kritis (PII bocor, penolakan salah) → perlakukan sebagai incident (LLMOps9), bukan antrean backlog biasa. Lima: tidak ada pola dominan (feedback tersebar) → masalahnya sistemik: mungkin ekspektasi user salah (perbaiki onboarding/UX) atau kualitas umum rendah (evaluasi menyeluruh).",
        "Aturan praktis 10 detik: untuk tiap pola, tulis satu kalimat `lapisan X diperbaiki dengan Y, pemilik Z, diukur dengan W`. Jika kalimat itu tidak bisa ditulis, polanya belum siap ditindak — kembali agregasi.",
      ],
      figure: {
        svg: LOOP_SVG,
        alt: "Siklus feedback loop: kumpulkan, agregasi pola, aksi perbaikan, ukur ulang.",
        caption: "Cara membaca: empat kotak membentuk siklus tertutup, panah kembali ke awal. Interpretasi: loop hanya `tertutup` jika ada pengukuran ulang — tanpa kotak ke-4, ini bukan loop melainkan tempat sampah keluhan. KopiChain berhenti di kotak 1 selama 3 bulan.",
      },
      tasks: [],
      note: {
        title: "Mitos: semua feedback harus ditindaklanjuti",
        type: "pitfall",
        body: "Yang benar: feedback individual (selera, edge case sekali pakai) ditindaklanjuti secara agregat, bukan satu per satu. Menindaklanjuti tiap feedback = tim support menjadi tim concierge. Ambangnya: pola (≥5 kasus serupa) atau severity kritis.",
      },
      reference: "Pola → lapisan + pemilik + metrik ukur ulang. Kritis = incident, bukan backlog.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "1.600 keluhan, 1 minggu perbaikan",
      prose: [
        "2.000 thumbs-down × 80% = 1.600 berasal dari 3 pola. Pola #1 (template tanggal, 40% = 800 keluhan) diperbaiki dalam 1 minggu: fix template + checker golden set. Potensi kotor: JIKA seluruh 800 keluhan pola #1 hilang, thumbs-down turun ~800 per 3 bulan (≈ 267 per bulan) dan, dengan biaya penanganan keluhan Rp20.000 per kasus (waktu CS + investigasi), 800 × 20.000 = Rp16.000.000 per kuartal. Itu POTENSI KOTOR, BUKAN hasil: perbaikan pola #1 tidak serta-merta menghilangkan 800 keluhan (lihat analisis (a) di bawah), dan angka ini belum dikurangi biaya perbaikan (1 minggu kerja 1 orang). Laporkan sebagai `potensi kotor hingga Rp16jt/kuartal`, bukan sebagai penghematan yang sudah terjadi.",
        "Pertanyaan analisis: (a) mengapa perbaikan pola #1 tidak serta-merta menghilangkan 800 keluhan — apa yang bisa gagal? (b) bagaimana memastikan perbaikan tidak menimbulkan regresi di tempat lain? (c) rancang SLA feedback loop: dari keluhan ke perbaikan, berapa lama untuk tiap severity?",
        "Jawaban yang defensibel: (a) user yang sudah frustrasi mungkin tidak kembali; pola bisa punya sub-pola; fix bisa tidak sempurna — ukur ulang, jangan asumsikan. (b) regression test golden set sebelum deploy fix (LLMOps3) + canary (LLMOps10). (c) contoh: kritis (PII/keamanan) = 24 jam; tinggi (fungsional rusak) = 1 minggu; sedang (kualitas) = 1 bulan; rendah (selera) = backlog kuartalan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Feedback yang tidak diproses adalah risiko reputasi yang terukur tapi diabaikan: 2.000 thumbs-down = 2.000 bukti tertulis ketidakpuasan. Dalam sengketa atau audit, `kami tahu tapi tidak bertindak` jauh lebih buruk dari `kami tidak tahu`. SLA feedback loop adalah kontrol risiko.",
      },
      reference: "800 × Rp20rb = potensi kotor hingga Rp16jt/kuartal dari 1 minggu kerja (bukan hasil). SLA per severity.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Skor prioritas: dari keluhan menjadi prioritas",
      prose: [
        "KopiChain: 2.000 thumbs-down. Pola #1 (template tanggal): 800 keluhan. Pola #2 (RAG basi): 600. Pola #3 (guardrail menolak wajar): 200. Sisanya 400 tersebar. Mana dulu? Hitung SKOR PRIORITAS per pola = keluhan pola × severity — BUKAN `win rate` (istilah itu menyesatkan: ini skor dampak, bukan persentase kemenangan; nilai ternormalisasi (keluhan/total)×severity adalah 1,2 / 2,4 / 1,0 — JANGAN dicampur dengan skor mentah 2.400/4.800/2.000). Severity: tanggal = 3 (bikin bingung), RAG basi = 8 (jawaban SALAH = bahaya), guardrail = 10 (menolak user yang sah = churn). Skor: tanggal 800×3 = 2.400; RAG 600×8 = 4.800; guardrail 200×10 = 2.000. Prioritas: RAG, tanggal, guardrail — BUKAN urutan jumlah! 600 keluhan RAG mengalahkan 800 keluhan tanggal karena 2,7x lebih parah.",
        "Tanpa severity, tim mengerjakan pola TERBANYAK dulu (tanggal, 800) — 2 minggu kerja untuk masalah `bikin bingung`, sementara 600 jawaban SALAH (RAG basi) terus meracuni user. Skor prioritas = jumlah × severity memaksa mata ke DAMPAK, bukan volume. Ini pola yang sama dengan skor risiko red-team (LLMOps9): seram/banyak ≠ penting.",
        "Contoh eksekusi: pola RAG (skor 4.800) → perbaiki pipeline freshness (LLMOps4): 1 minggu, 2 engineer. Hasil: keluhan RAG 600 → 90 per bulan (turun 85%) — keduanya total bulanan; `90/minggu` akan berarti ~360/bulan dan menyamarkan penurunan sebenarnya. Ukur SKOR PRIORITAS ULANG bulan depan (angka bulan 2): RAG 90×8 = 720 < guardrail 180×10 = 1.800 < tanggal 750×3 = 2.250 — sekarang tanggal jadi prioritas #1, guardrail #2. Flywheel: ukur → perbaiki → ukur lagi. Tanpa pengukuran ulang, tim akan `melanjutkan` perbaikan RAG yang sudah selesai (over-fix) sementara tanggal menunggu.",
        "Feedback juga punya `biaya pengumpulan`: tombol thumbs-down + alasan wajib (4 opsi) → response rate 12%. Tanpa alasan wajib: 25% tapi tidak bisa diagregasi (keluhan tanpa konteks = sampah). 12% yang BISA ditindak > 25% yang tidak. Dan sinyal IMPLISIT (user pergi tanpa klik, sesi dibatalkan) sering lebih jujur — instrumentasikan: `sesi berakhir < 30 detik setelah jawaban` = sinyal negatif implisit. KopiChain menemukan 3x lebih banyak sinyal implisit daripada eksplisit.",
      ],
      formula: String.raw`\text{prioritas} = n_{pola} \times severity`,
      formulaNote: "n_pola = keluhan pada pola itu (jumlah mentah, BUKAN proporsi); severity = 1–10 (dampak per kejadian: bingung=3, jawaban salah=8, tolak user sah=10). Kerjakan dari skor tertinggi. Ukur ulang tiap bulan — prioritas BERUBAH setelah perbaikan. (Versi ternormalisasi (n_pola/n_total)×severity memberi 1,2/2,4/1,0 — urutan sama, skala beda; jangan campur keduanya.)",
      tasks: [],
      note: {
        title: "💡 Intuisi: banyak × parah, bukan banyak saja",
        body: "800 keluhan `bikin bingung` kalah dari 600 keluhan `jawaban salah` — karena 2,7x lebih parah per kejadian. Prioritas = volume × severity. Tim yang mengerjakan yang terbanyak dulu sedang mengoptimasi perasaan (`lihat, 800 selesai!`), bukan dampak.",
      },
      reference: "Flywheel bulanan: agregasi → skor → perbaiki → ukur ulang. Sinyal implisit 3x lebih banyak.",
    },
    {
      id: "pendalaman-angka",
      eyebrow: "Langkah 8 · Membaca Angka",
      title: "Sebelum vs sesudah: bukti flywheel bekerja",
      prose: [
        "Data KopiChain 3 bulan: bulan 1 (sebelum): 2.000 keluhan (800 tanggal, 600 RAG, 200 guardrail, 400 lain). Bulan 2 (perbaiki RAG): 1.250 (750 tanggal, 90 RAG, 180 guardrail, 230 lain). Bulan 3 (perbaiki tanggal): 620 (120 tanggal, 80 RAG, 150 guardrail, 270 lain). Total turun 69%. Tapi perhatikan: `lain` TURUN lalu NAIK (400→230→270) — karena pola baru MUNCUL saat pola lama hilang (dulu tenggelam dalam kebisingan). Ini normal dan SEHAT: flywheel tidak menghabiskan masalah, ia MENGUNGKAP lapisan berikutnya.",
        "Guardrail (200→180→150) turun PELAN — dan karena severity-nya 10, ia justru menjadi prioritas #1 di bulan 3 (150×10 = 1.500 > RAG 80×8 = 640 > tanggal 120×3 = 360), bukan #2. Pelajaran: JANGAN kejar `nol keluhan`; kejar `skor risiko total menurun`. Skor total — SATU scope untuk semua bulan, `lain` selalu dihitung dengan severity 2 (mencampur scope membuat turunnya tampak 67% dari 9.200→3.040 atau 73% dari 9.200→2.500 — keduanya salah karena pembilangnya tidak sebanding): bulan 1 = 800×3+600×8+200×10+400×2 = 10.000; bulan 2 = 750×3+90×8+180×10+230×2 = 5.230; bulan 3 = 360+640+1.500+540 = 3.040. Turun (10.000−3.040)/10.000 = 69,6% ≈ 70%. SATU angka ini = KPI flywheel yang dilaporkan ke manajemen. Bukan `2.000 keluhan`, melainkan `skor risiko 10.000 → 3.040`.",
        "Tutup loop ke user: untuk pola yang diperbaiki, kirim notifikasi ke pelapor (`masalah tanggal sudah diperbaiki, terima kasih atas laporanmu`) — response rate feedback NAIK 12% → 19% (user merasa didengar). Flywheel yang terlihat = flywheel yang diberi makan. Loop yang tidak ditutup = sumur yang kering: user berhenti melapor karena `percuma`.",
      ],
      figure: {
        svg: LLMOPS11_DEEP_SVG,
        alt: "Diagram batang skor risiko total: turun dari 10.000 ke 3.040 dalam 3 bulan.",
        caption: "Cara membaca: tinggi batang = skor risiko total (volume × severity) per bulan. Interpretasi: turun ~70% dalam 3 bulan DENGAN prioritas yang berubah tiap bulan (RAG dulu, lalu tanggal) — bukan dengan mengerjakan yang terbanyak dulu. Satu angka ini = KPI flywheel untuk manajemen.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: kejar skornya, bukan nolnya",
        body: "Nol keluhan = tidak ada user (atau tidak ada yang peduli melapor). Target yang sehat: skor risiko total menurun tiap bulan + pola baru terungkap (tanda sistem pendengaran bekerja). Flywheel yang baik tidak menghabiskan masalah — ia memastikan masalah TERBERAT selalu dikerjakan duluan.",
      },
      reference: "KPI: skor risiko total bulanan. Tutup loop ke pelapor — response rate naik 12% → 19%.",
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
        "Kumpulkan eksplisit (thumbs + alasan) + implisit (repeat rate, eskalasi); tautkan ke trace.",
        "Agregasi: Counter + keyword dulu; pola = lapisan + pemilik + dampak.",
        "Prioritas = frekuensi × severity (skor mentah, bukan \u201Cwin rate\u201D); pola kecil-kritis mengalahkan pola besar-sepele bila skornya lebih besar.",
        "80% feedback → fix operasi (template/RAG/guardrail), bukan training model.",
        "Loop tertutup = ada ukur ulang; SLA per severity; rayakan feedback yang ditindaklanjuti.",
      ],
      next: { label: "LLMOps12 — Capstone: LLMOps Asisten Produksi", href: "/v2/learn/llmops12-capstone" },
      quiz: [
        {
          q: "2.000 thumbs-down tanpa alasan. Masalah utamanya?",
          options: [
            { text: "Jumlahnya terlalu sedikit", why: "2.000 sudah banyak — masalahnya bukan volume." },
            { text: "Tanpa alasan + tanpa tautan trace, tidak bisa didiagnosis menjadi pola", why: "Keluhan tanpa diagnosis = angka tanpa tindakan. Alasan + trace ID mengubah keluhan menjadi bukti.", correct: true },
            { text: "Harusnya dikumpulkan via survei email", why: "Channel bukan masalah; kualitas sinyalnya." },
            { text: "Thumbs-down tidak berguna sama sekali", why: "Berguna sebagai sinyal volume — hanya tidak cukup sendirian." },
          ],
        },
        {
          q: "Pola A: 500 laporan `jawaban kepanjangan` (severity 1). Pola B: 60 laporan `menyebut NIK orang lain` (severity 10). Didahulukan?",
          options: [
            { text: "A — lebih dari 8x lebih banyak", why: "Frekuensi tanpa severity = prioritas buta." },
            { text: "B — severity kritis (kebocoran data) mengalahkan frekuensi", why: "Prioritas = frekuensi × severity. 60 × 10 = 600 > 500 × 1 = 500. (Catatan: 5 laporan kritis saja = skor 50, TIDAK mengalahkan 500 — tapi pola kritis tetap masuk jalur incident apa pun skornya.)", correct: true },
            { text: "Kerjakan paralel keduanya", why: "Ideal tapi tidak realistis; prioritas tetap harus eksplisit." },
            { text: "Abaikan keduanya — bukan bug model", why: "Keduanya bug operasional yang valid untuk diperbaiki." },
          ],
        },
        {
          q: "Dalam lab, top3 mencakup 90% feedback. Apa implikasi operasionalnya?",
          options: [
            { text: "Sisanya 10% tidak penting", why: "10% bisa mengandung severity kritis — cek sebelum mengabaikan." },
            { text: "Tiga perbaikan terfokus menghapus mayoritas keluhan — leverage tinggi", why: "Inilah kekuatan agregasi: dari 2.000 keluhan menjadi 3 pekerjaan.", correct: true },
            { text: "Harus perbaiki 100% sekaligus", why: "Perfeksionisme menunda 90% nilai yang bisa didapat sekarang." },
            { text: "Lab-nya terlalu kecil untuk disimpulkan", why: "Prinsipnya skala: pola dominan ada di semua ukuran data." },
          ],
        },
        {
          q: "User bertanya ulang dengan parafrasa 3 menit setelah jawaban pertama. Ini sinyal apa?",
          options: [
            { text: "User iseng", why: "Mengasumsikan user iseng = mengabaikan sinyal paling jujur." },
            { text: "Sinyal implisit: jawaban pertama gagal (repeat rate)", why: "Tidak butuh partisipasi user; perilaku adalah sinyal yang kuat — tapi tetap proksi, bukan bukti: user bisa bertanya ulang karena ingin detail, bukan karena jawaban salah. Konfirmasi dengan pola agregat, bukan satu sesi.", correct: true },
            { text: "Bug di tombol thumbs-down", why: "Tidak berkaitan." },
            { text: "Latency terlalu tinggi", why: "Mungkin, tapi interpretasi utama = ketidakpuasan jawaban." },
          ],
        },
        {
          q: "800 keluhan × Rp20.000 biaya penanganan. Berapa POTENSI KOTOR per kuartal jika SELURUH 800 keluhan pola #1 hilang?",
          options: [
            { text: "Rp16.000.000 — potensi kotor, bukan hasil", why: "800 × 20.000 = Rp16jt, DENGAN asumsi semua 800 hilang dan sebelum dikurangi biaya perbaikan. Yang benar-benar terjadi bisa jauh lebih kecil.", correct: true },
            { text: "Rp1.600.000", why: "Kurang satu nol." },
            { text: "Rp160.000.000", why: "Kelebihan satu nol." },
            { text: "Rp40.000.000", why: "Itu 2.000 × 20.000 — seolah semua keluhan hilang." },
          ],
        },
        {
          q: "Pola A: 800 keluhan × severity 3. Pola B: 600 × severity 8. Pola C: 200 × severity 10. Urutan TEPAT?",
          options: [
            { text: "A, B, C — kerjakan yang terbanyak dulu", why: "Volume tanpa severity = optimasi perasaan. A (2.400) < B (4.800): mengerjakan A dulu membiarkan 600 jawaban SALAH terus meracuni user." },
            { text: "B, A, C — skor: 4.800 > 2.400 > 2.000", why: "Tepat. Prioritas = volume × severity. B (jawaban salah) paling merusak, lalu A, lalu C. Ukur ulang bulan depan — urutan BISA berubah.", correct: true },
            { text: "C, B, A — severity tertinggi dulu", why: "Severity saja mengabaikan volume: C (2.000) < A (2.400). 200 kasus severity-10 vs 800 kasus severity-3 — total dampak A lebih besar." },
            { text: "Acak — semua penting", why: "`Semua penting` = tidak ada prioritas = yang mudah/seram dikerjakan dulu. Skor ada agar keputusan tidak acak." },
          ],
        },
      ],
    },
  ],
};
