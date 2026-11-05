import type { V2Lesson } from "../lib/types";

// Pipeline NLQ: pertanyaan -> SQL -> validasi -> jawaban + confidence.
const NLQ_SVG = `<svg viewBox="0 0 520 280" role="img" aria-label="Pipeline NLQ: pertanyaan menjadi SQL, lalu validasi, lalu jawaban dengan confidence.">
<g font-family="var(--font-ui)" font-size="11">
<rect x="16" y="100" width="100" height="80" rx="10" fill="var(--bg-panel)" stroke="var(--c1)" stroke-width="1.5"/>
<text x="66" y="128" text-anchor="middle" fill="var(--text)" font-weight="600">Pertanyaan</text>
<text x="66" y="148" text-anchor="middle" fill="var(--text-muted)">"revenue Sept?"</text>
<text x="66" y="164" text-anchor="middle" fill="var(--text-muted)">(ambigu!)</text>
<rect x="140" y="100" width="100" height="80" rx="10" fill="var(--bg-panel)" stroke="var(--c2)" stroke-width="1.5"/>
<text x="190" y="128" text-anchor="middle" fill="var(--text)" font-weight="600">Parse → SQL</text>
<text x="190" y="148" text-anchor="middle" fill="var(--text-muted)">SUM WHERE</text>
<text x="190" y="164" text-anchor="middle" fill="var(--text-muted)">status='paid'?</text>
<rect x="264" y="100" width="100" height="80" rx="10" fill="var(--error-soft)" stroke="var(--error)" stroke-width="1.5"/>
<text x="314" y="128" text-anchor="middle" fill="var(--error)" font-weight="600">Validasi</text>
<text x="314" y="148" text-anchor="middle" fill="var(--text)">definisi?</text>
<text x="314" y="164" text-anchor="middle" fill="var(--text)">scope tenant?</text>
<rect x="388" y="100" width="116" height="80" rx="10" fill="var(--success-soft)" stroke="var(--success)" stroke-width="1.5"/>
<text x="446" y="128" text-anchor="middle" fill="var(--success)" font-weight="600">Jawaban</text>
<text x="446" y="148" text-anchor="middle" fill="var(--text)">Rp1.300 rb</text>
<text x="446" y="164" text-anchor="middle" fill="var(--text-muted)">confidence 92%</text>
</g>
<g stroke="var(--text-muted)" stroke-width="1.5">
<line x1="116" y1="140" x2="138" y2="140"/><line x1="240" y1="140" x2="262" y2="140"/><line x1="364" y1="140" x2="386" y2="140"/>
</g>
<text x="260" y="40" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)" font-family="var(--font-ui)">NLQ: 4 tahap, 3 titik gagal</text>
<text x="260" y="60" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Ambiguitas → SQL salah → validasi lolos → jawaban pede tapi keliru</text>
<text x="260" y="220" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Titik paling berbahaya: validasi. Tanpa definisi kanonis (BI11),</text>
<text x="260" y="238" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">NLQ menjawab dengan DEFINISI YANG SALAH secara meyakinkan.</text>
<text x="260" y="262" text-anchor="middle" font-size="11" fill="var(--error)" font-family="var(--font-ui)" font-weight="600">"Penjualan" = gross? net? expected? — AI harus bertanya balik.</text>
</svg>`;

export const biz13: V2Lesson = {
  slug: "biz13-ai",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "BI13 — AI dalam BI",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Jawaban pede yang salah total",
      prose: [
        "CEO PT SinarJaya bertanya ke chatbot BI baru: \u201CKenapa profit turun bulan ini?\u201D Chatbot menjawab dalam 3 detik, penuh percaya diri: \u201CKarena klik banner promo naik 40% — korelasi 0,98 dengan retur. Rekomendasi: hentikan banner promo.\u201D CEO hampir menandatangani memo penghentian.",
        "Analis senior memeriksa: klik banner dan retur MEMANG berkorelasi 0,98 — karena keduanya didorong traffic yang naik. Banner tidak menyebabkan retur; traffic menyebabkan keduanya. Chatbot menemukan korelasi palsu dan menyajikannya sebagai sebab-akibat.",
        "Twist-nya: AI paling berbahaya bukan saat ia salah dengan ragu-ragu, melainkan saat ia salah dengan SANGAT YAKIN — lengkap dengan angka korelasi yang benar secara matematis. Kepercayaan diri AI tidak berkorelasi dengan kebenarannya.",
        "Di lesson ini kamu akan bisa: (1) menjelaskan cara kerja NLQ (text-to-SQL) dan 3 titik gagalnya; (2) mendeteksi ambiguitas yang harus ditanyakan balik; (3) mengevaluasi klaim akurasi vendor; (4) menetapkan batas human-in-the-loop.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menilai kapan AI dalam BI membantu dan kapan ia berbahaya.",
        "(1) Memetakan 3 titik gagal NLQ: ambiguitas bahasa, definisi ganda, dan keterbatasan model data;",
        "(2) Menjelaskan kenapa korelasi 0,98 bisa menipu dan apa yang harus ditanya sebelum bertindak;",
        "(3) Menghitung kalibrasi confidence: akurasi empiris per bucket, dan menandai bucket yang menyesatkan;",
        "(4) Menyusun kriteria kapan AI boleh menjawab tanpa review manusia (kumulatif, bukan salah satu).",
      ],
      tasks: [],
    },

    {
      id: "nlq",
      eyebrow: "Langkah 3 · NLQ",
      title: "NLQ: dari bahasa manusia ke SQL — dan 3 titik gagalnya",
      prose: [
        "Cara kerja NLQ: (1) PARSING — petakan kata ke tabel/kolom/metrik (\u201Crevenue\u201D → kolom apa?); (2) GENERATE — susun SQL; (3) VALIDASI — cek definisi, scope, kewajaran; (4) JAWAB — eksekusi + sajikan dengan confidence.",
        "Titik gagal 1 — AMBIGUITAS: \u201Cpenjualan\u201D bisa gross/net/expected (BI11: tiga definisi!). AI yang baik BERTANYA BALIK, bukan menebak. Menebak = 66% peluang salah diam-diam.",
        "Titik gagal 2 — SKEMA: \u201Cbulan lalu\u201D = September atau 30 hari terakhir? \u201CUser aktif\u201D = definisi siapa? Tanpa semantic layer, NLQ menebak dari nama kolom — dan nama kolom berbohong.",
        "Titik gagal 3 — VALIDASI: SQL-nya valid, angkanya keluar, tapi maknanya salah. Inilah yang terjadi pada chatbot CEO: query benar, interpretasi kausal salah.",
        "Kepribadian: NLQ adalah \u201Csi penerjemah magang\u201D — cepat, rajin, tapi tidak paham konteks bisnismu. Jangan biarkan magang menandatangani laporan keuangan.",
        "💡 Intuisi kunci: akurasi NLQ = akurasi semantic layer-mu. Perusahaan dengan definisi berantakan mendapat AI yang berantakan — hanya lebih cepat dan lebih pede.",
      ],
      formula: String.raw`\text{Akurasi}_{uji} = \frac{\text{benar}}{\text{total}} \qquad \text{gap}_{klaim} = \text{klaim}_{vendor} - \text{akurasi}_{uji}`,
      formulaNote:
        "Akurasi diukur pada PERTANYAAN NYATA perusahaanmu, bukan demo vendor. Gap klaim = selisih klaim marketing vs hasil uji: vendor mengklaim 95%, uji 50 pertanyaan nyata hanya 68% (34/50) — gap 27 poin. Selalu uji dengan pertanyaanmu sendiri.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: NLQ menggantikan analis",
        body: "NLQ menggantikan PENGETIKAN query rutin — bukan analisis. Ia tidak bisa memilih definisi yang tepat (butuh governance), tidak bisa membedakan korelasi vs kausalitas (butuh nalar), dan tidak bertanggung jawab atas keputusan (butuh manusia). Analis naik kelas menjadi validator dan desainer definisi — bukan menganggur.",
      },
    },
    {
      id: "auto-insight",
      eyebrow: "Langkah 4 · Auto-insight",
      title: "Auto-insight: korelasi 0,98 yang menipu",
      prose: [
        "Fitur \u201Cauto-insight\u201D memindai data dan melaporkan pola: \u201CKlik banner berkorelasi 0,98 dengan retur!\u201D Terdengar seperti temuan. Padahal keduanya naik karena traffic naik — confounder klasik.",
        "Cara membaca pipeline: pertanyaan ambigu (\u201Crevenue Sept?\u201D) → SQL yang menebak definisi → validasi yang seharusnya menangkap tebakan itu → jawaban dengan confidence. Titik merah (validasi) adalah pertahanan terakhir — dan paling sering dilewatkan.",
        "Interpretasi: tanpa validasi terhadap definisi kanonis, NLQ adalah mesin penjawab tercepat untuk pertanyaan yang salah paham. Kecepatan tanpa validasi = kecepatan menuju keputusan salah.",
        "Aturan human-in-the-loop: (1) AI boleh menjawab LANGSUNG hanya untuk pertanyaan terdaftar + definisi kanonis + confidence > 90%. (2) Sisanya: tampilkan SQL-nya + minta konfirmasi. (3) Keputusan bernilai besar (> RpX): selalu review manusia, tanpa pengecualian.",
        "💡 Intuisi kunci: minta AI menunjukkan \u201Ckartu definisi\u201D tiap jawabannya (metrik apa, filter apa, versi berapa — format BI11). Jawaban tanpa kartu definisi = opini berpakaian data.",
      ],
      figure: {
        svg: NLQ_SVG,
        alt: "Pipeline NLQ empat tahap dengan titik validasi disorot sebagai pertahanan terakhir.",
        caption: "Pipeline NLQ: ambiguitas → SQL → validasi (pertahanan terakhir) → jawaban + confidence.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: confidence tinggi = jawaban benar",
        body: "Confidence model mengukur keyakinan LINGUISTIK (seberapa cocok polanya), bukan kebenaran BISNIS. Model bisa 99% yakin dengan definisi yang salah. Validasi kebenaran hanya datang dari semantic layer + review manusia — bukan dari skor confidence.",
      },
    },
    {
      id: "lab-nlq",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: bangun NLQ mini + jebak korelasi palsu",
      prose: [
        "Tugasmu: (1) tulis `nlq_to_sql(q)` yang memetakan 3 pola pertanyaan ke SQL (cek substring-nya); (2) tulis `makna_ganda(istilah)` yang mengembalikan daftar definisi ambigu untuk \u201Cpenjualan\u201D — AI yang baik bertanya balik; (3) hitung korelasi banner vs retur (`corr_palsu`) dan putuskan `waspada` = True jika |corr| > 0,9 TANPA bukti kausal.",
        "Coba juga: tambah pola ke-4 untuk pertanyaanmu sendiri. Pada titik berapa template-mu gagal? Itulah batas template-based NLQ — dan alasan model generatif tetap butuh validasi.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `nlq_to_sql(q)` untuk 3 pola → `sql1..3`" },
        { id: "t2", text: "Tulis `makna_ganda('penjualan')` → list definisi" },
        { id: "t3", text: "Hitung `corr_palsu`, tentukan `waspada`; cetak" },
      ],
      expected: "sql ok  ambiguitas=['gross','net','expected']  corr=0.980 waspada=True",
      note: {
        title: "Sering salah",
        body: "Menganggap korelasi tinggi sebagai bukti untuk bertindak. Korelasi 0,98 banner-retur BENAR secara matematis dan SALAH sebagai dasar keputusan. Selalu tanya: variabel ketiga apa yang menggerakkan keduanya?",
      },
      hints: [
        "nlq_to_sql: if 'revenue' in q and 'september' in q: return \"SELECT SUM(amount-refund) FROM orders WHERE status='paid' AND bulan='2026-09'\".",
        "makna_ganda: kembalikan ['gross', 'net', 'expected'] untuk 'penjualan'.",
        "pearson seperti lab BI5; waspada = abs(corr) > 0.9.",
      ],
      code: {
        starter: `import math\n\ndef nlq_to_sql(q):\n    q = q.lower()\n    # TULIS: 3 pola -> SQL\n    return ""\n\ndef makna_ganda(istilah):\n    # TULIS: kembalikan list definisi ambigu\n    return []\n\ndef pearson(xs, ys):\n    n = len(xs); mx = sum(xs)/n; my = sum(ys)/n\n    cov = sum((x-mx)*(y-my) for x, y in zip(xs, ys))\n    return cov / math.sqrt(sum((x-mx)**2 for x in xs) * sum((y-my)**2 for y in ys))\n\nbanner = [11,13,12,17,19,21]\nretur = [2.1,2.5,2.6,3.3,3.5,4.2]\n\n# TULIS KODEMU\nsql1 = nlq_to_sql("berapa revenue bulan september?")\nsql2 = nlq_to_sql("top 3 produk bulan ini")\nsql3 = nlq_to_sql("berapa user aktif?")\namb = makna_ganda("penjualan")\ncorr_palsu = 0.0\nwaspada = False\n\nprint(f"sql1_has_sum={'SUM' in sql1} sql2_has_limit={'3' in sql2}")\nprint(f"ambiguitas={amb}  corr={corr_palsu:.3f} waspada={waspada}")`,
        lockLines: 14,
        solution: `import math\n\ndef nlq_to_sql(q):\n    q = q.lower()\n    if "revenue" in q and "september" in q:\n        return "SELECT SUM(amount - refund) FROM orders WHERE status='paid' AND bulan='2026-09'"\n    if "top 3 produk" in q:\n        return "SELECT produk, SUM(revenue) AS r FROM fact_penjualan GROUP BY produk ORDER BY r DESC LIMIT 3"\n    if "user aktif" in q:\n        return "SELECT COUNT(DISTINCT user_id) FROM aktivitas WHERE definisi='active_core_v1' AND bulan='2026-09'"\n    return ""\n\ndef makna_ganda(istilah):\n    if istilah == "penjualan":\n        return ["gross", "net", "expected"]\n    return []\n\ndef pearson(xs, ys):\n    n = len(xs); mx = sum(xs)/n; my = sum(ys)/n\n    cov = sum((x-mx)*(y-my) for x, y in zip(xs, ys))\n    return cov / math.sqrt(sum((x-mx)**2 for x in xs) * sum((y-my)**2 for y in ys))\n\nbanner = [11,13,12,17,19,21]\nretur = [2.1,2.5,2.6,3.3,3.5,4.2]\n\n# TULIS KODEMU\nsql1 = nlq_to_sql("berapa revenue bulan september?")\nsql2 = nlq_to_sql("top 3 produk bulan ini")\nsql3 = nlq_to_sql("berapa user aktif?")\namb = makna_ganda("penjualan")\ncorr_palsu = pearson(banner, retur)\nwaspada = abs(corr_palsu) > 0.9\n\nprint(f"sql1_has_sum={'SUM' in sql1} sql2_has_limit={'3' in sql2}")\nprint(f"ambiguitas={amb}  corr={corr_palsu:.3f} waspada={waspada}")`,
        checks: [
          { kind: "contains", task: "t1", name: "sql1", value: "SUM", label: "`sql1` memakai SUM", msg: "Pola revenue → agregat SUM dengan filter paid." },
          { kind: "contains", task: "t1", name: "sql1", value: "2026-09", label: "`sql1` memfilter September", msg: "'bulan september' → filter bulan='2026-09'." },
          { kind: "contains", task: "t1", name: "sql2", value: "LIMIT 3", label: "`sql2` memakai LIMIT 3", msg: "'top 3' → LIMIT 3." },
          { kind: "contains", task: "t1", name: "sql3", value: "active_core_v1", label: "`sql3` memakai definisi kanonis", msg: "User aktif harus merujuk definisi berversi (BI11), bukan tebakan." },
          { kind: "equal", task: "t2", name: "amb", value: ["gross", "net", "expected"], label: "Ambiguitas terdaftar", msg: "'penjualan' punya 3 makna — AI harus bertanya balik." },
          { kind: "equal", task: "t3", name: "corr_palsu", value: 0.98, tol: 0.005, label: "`corr_palsu` = 0.980", msg: "Korelasi banner-retur memang tinggi — dan menipu." },
          { kind: "equal", task: "t3", name: "waspada", value: true, label: "`waspada` = True", msg: "|corr| > 0.9 tanpa bukti kausal → waspada." },
          { kind: "stdout_matches", task: "t3", pattern: "corr=0\\.980\\s+waspada=True", label: "`print` menampilkan hasil", msg: "Samakan format." },
        ],
      },
      reference: "Template NLQ = if/elif pola → SQL. Batasnya: pola baru = kode baru.",
    },    {
      id: "lab2-kalibrasi-nlq",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: kalibrasi confidence NLQ",
      prose: [
        "Model mengklaim confidence 95% — tapi dari 20 jawaban nyata, berapa yang benar-benar benar? Tugasmu: hitung akurasi per bucket confidence dan temukan bucket yang 'menyesatkan': confidence ≥ 80% tapi akurasi < 60%.",
        "Confidence yang tidak terkalibrasi lebih berbahaya daripada tidak ada confidence: ia memberi rasa aman palsu. Jawaban 95% yang sebenarnya 60% benar = mesin pembuat keputusan buruk yang pede.",
        "Coba juga: apa aksi untuk bucket_menyesatkan? Opsi jujur: turunkan ambang auto-jawab untuk bucket itu, atau wajibkan sitasi sumber (keputusan peta lesson ini).",
      ],
      tasks: [
        { id: "t1", text: "Bangun `kalibrasi`: dict bucket → akurasi % (bulat)" },
        { id: "t2", text: "Tentukan `bucket_menyesatkan` (conf ≥ 80, akurasi < 60)" },
        { id: "t3", text: "Hitung `gap_max`: selisih confidence − akurasi terbesar (1 desimal)" },
      ],
      expected: "kalibrasi={55: 25, 65: 33, 75: 50, 85: 50, 95: 80}",
      note: {
        title: "Sering salah",
        body: "Menghitung akurasi global (total benar / 20) lalu membandingkan dengan rata-rata confidence. Kalibrasi selalu per bucket — agregat menyembunyikan bucket yang rusak.",
      },
      hints: [
        "Agregasi per bucket: total[c] dan benar[c].",
        "kalibrasi[c] = benar/total*100, bulatkan.",
        "Filter c >= 80 dan akurasi < 60; gap = c - akurasi.",
      ],
      code: {
        starter: `# 20 jawaban NLQ: (bucket_confidence, benar?)\nJAWABAN = [\n    (95, True), (95, True), (95, False), (95, True), (95, True),\n    (85, True), (85, False), (85, True), (85, False),\n    (75, True), (75, False), (75, False), (75, True),\n    (65, False), (65, True), (65, False),\n    (55, False), (55, False), (55, True), (55, False),\n]\n# TULIS KODEMU: kalibrasi, bucket_menyesatkan, gap_max\nkalibrasi = {}\nbucket_menyesatkan = 0\ngap_max = 0.0\n`,
        lockLines: 8,
        solution: `# 20 jawaban NLQ: (bucket_confidence, benar?)\nJAWABAN = [\n    (95, True), (95, True), (95, False), (95, True), (95, True),\n    (85, True), (85, False), (85, True), (85, False),\n    (75, True), (75, False), (75, False), (75, True),\n    (65, False), (65, True), (65, False),\n    (55, False), (55, False), (55, True), (55, False),\n]\n\n# TULIS KODEMU: kalibrasi, bucket_menyesatkan, gap_max\nfrom collections import defaultdict\nbenar = defaultdict(int); total = defaultdict(int)\nfor conf, ok in JAWABAN:\n    total[conf] += 1\n    benar[conf] += 1 if ok else 0\n\nkalibrasi = {c: round(benar[c] / total[c] * 100) for c in sorted(total)}\nkandidat = {c: c - acc for c, acc in kalibrasi.items() if c >= 80 and acc < 60}\nbucket_menyesatkan = max(kandidat, key=kandidat.get) if kandidat else None\ngap_max = round(max(kandidat.values()), 1) if kandidat else 0.0\n\nprint(f"kalibrasi={kalibrasi}")\nprint(f"bucket_menyesatkan={bucket_menyesatkan}  gap_max={gap_max}")\n`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "kalibrasi=\\{55: 25, 65: 33, 75: 50, 85: 50, 95: 80\\}", label: "kalibrasi benar", msg: "Akurasi empiris per bucket." },
          { kind: "equal", task: "t2", name: "bucket_menyesatkan", value: 85, label: "`bucket_menyesatkan` = 85", msg: "Conf 85%, akurasi 50%." },
          { kind: "equal", task: "t3", name: "gap_max", value: 35, tol: 0.05, label: "`gap_max` = 35", msg: "85 − 50." },
        ],
      },
      reference: "Calibration: akurasi empiris per bucket confidence — fondasi trust untuk AI.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Tanya ke setiap jawaban AI: 'apa yang membuatmu yakin, dan apa yang bisa membuatmu salah?' Jawaban yang tidak bisa menyebut sumber keraguannya bukan jawaban — itu tebakan yang pede.",
        "💡 Korelasi adalah mesin pembuat cerita palsu tercepat. Aturannya: korelasi boleh memicu investigasi, tidak boleh memicu aksi. Aksi butuh kausalitas atau eksperimen.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: jangan beli AI dari demonya — uji dengan 50 pertanyaan jebakan",
        body: "Jangan pernah membeli tool AI dari demonya. Demo vendor adalah pertunjukan sulap: pertanyaan yang sudah dilatih, data yang sudah dibersihkan, dan tidak ada pertanyaan jebakan. Heuristik praktisinya: bangun \"golden set\" 50 pertanyaan SEBELUM bertemu vendor — separuhnya pertanyaan jebakan yang kamu sudah tahu jawabannya. Isi jebakannya: ambiguitas (\"penjualan bulan lalu\" — gross atau net? per tanggal order atau tanggal bayar?), sinonim bisnis (\"omzet\" vs \"revenue\" vs \"GMV\" — di perusahaanmu ketiganya bisa beda arti), tanggal relatif (\"kuartal berjalan\" saat tanggal 2 Januari), dan pertanyaan yang jawabannya \"data tidak cukup\" (AI yang baik bilang tidak tahu; AI yang buruk mengarang dengan pede). Minta setiap vendor menjawab 50 itu, dan nilai DUA hal: akurasi jawaban, dan — lebih penting — tingkat \"salah tapi pede\". Aturan kerasnya: confident-wrong rate di atas 5% = belum layak production, seberapa pun impresif demonya. Jawaban salah yang ragu-ragu bisa ditangani manusia; jawaban salah yang pede adalah bom. Jebakan termahalnya adalah pilot yang \"berhasil\" karena diuji 10 pertanyaan ramah, lalu production meledak di pertanyaan ke-11 yang ambigu. Golden set juga berguna setelah pembelian: jalankan ulang tiap ada update model vendor — regresi kemampuan adalah hal nyata. Lima puluh pertanyaan yang ditulis sore ini menghemat lima puluh rapat pemadam kebakaran tahun depan.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: kapan AI membantu vs berbahaya",
      prose: [
        "Skenario 1 — Pertanyaan rutin, definisi kanonis, confidence > 90%. → AI jawab langsung. Contoh: \u201Crevenue net kemarin?\u201D Hemat waktu analis untuk yang penting.",
        "Skenario 2 — Pertanyaan ambigu / definisi banyak. → AI bertanya balik + tampilkan pilihan definisi. Jangan menebak.",
        "Skenario 3 — Auto-insight / anomali. → AI boleh mengusulkan, manusia memvalidasi kausalitas. Korelasi ≠ rekomendasi aksi.",
        "Skenario 4 — Keputusan bernilai besar / risiko tinggi. → AI dilarang memutuskan; ia hanya menyiapkan bahan. Review manusia wajib.",
        "Skenario 5 — Data sensitif / multi-tenant. → AI hanya di atas scoping yang sudah benar (BI12). Salah scope = kebocoran massal yang instan.",
        "Aturan praktis 10 detik: tanya \u201Ckalau AI salah di sini, berapa biayanya?\u201D Murah → otomatisasi. Mahal → human-in-the-loop. Katastrofik → larang.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: evaluasi vendor NLQ",
      prose: [
        "Vendor mengklaim \u201Cakurasi 95%\u201D. Tim BI menguji 50 pertanyaan NYATA dari analis (bukan contoh vendor): 34 benar, 16 salah → akurasi 68%. Gap 27 poin.",
        "Analisis 16 kesalahan: 9 ambiguitas definisi (\u201Cpenjualan\u201D), 4 salah join (fan trap! BI2), 3 salah filter tanggal. Semuanya adalah masalah SEMANTIC LAYER dan MODELING — bukan masalah \u201CAI-nya kurang pintar\u201D.",
        "Keputusan: tunda pembelian lisensi Rp480 juta/tahun. Investasi dulu 2 bulan ke semantic layer (BI6/BI11); uji ulang. Hasil uji kedua: 44/50 = 88%. Baru layak beli — dan sekarang vendor tidak bisa mengklaim keajaiban, karena yang diperbaiki adalah fondasi.",
        "💡 Intuisi kunci: uji vendor dengan PERTANYAANMU, DATAMU, DEFINISIMU. Demo vendor memakai data yang sudah dibersihkan dan pertanyaan yang sudah dipilih — itu bukan uji, itu iklan.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang AI dalam BI. Ingat: pede ≠ benar.",
      ],
      tasks: [],
      summary: [
        "NLQ: parsing → generate → validasi → jawab; 3 titik gagal (ambiguitas, skema, validasi).",
        "AI yang baik bertanya balik saat ambigu — bukan menebak.",
        "Korelasi tinggi (0,98) bukan bukti kausal — cari confounder-nya.",
        "Uji vendor dengan pertanyaan nyatamu; gap klaim 27 poin itu normal.",
        "Human-in-the-loop mengikuti biaya kesalahan: murah → auto, mahal → review, katastrofik → larang.",
      ],
      next: { label: "BI14 — Capstone: BI Suite Satu Perusahaan", href: "/v2/learn/biz14-capstone" },
      quiz: [
        {
          q: "Chatbot: korelasi banner-retur 0,98 → \u201Chentikan banner\u201D. Kesalahan utamanya?",
          options: [
            { text: "Korelasinya salah hitung", why: "Benar secara matematis — dan justru itu bahayanya. Korelasi mengukur 'bergerak bersama', bukan 'saling menyebabkan'. Banner dan retur sama-sama digerakkan traffic (confounder): traffic naik → impresi banner naik DAN retur naik. Mematikan banner tidak menyentuh traffic — retur tetap naik, revenue ikut turun." },
            { text: "Melompat dari korelasi ke kausalitas tanpa memeriksa confounder", why: "Tepat: ini confounder klasik. Uji termurahnya: korelasi parsial (kendalikan traffic) — jika korelasi banner-retur lenyap setelah traffic dikendalikan, hubungan itu semu. Aturan praktis: sebelum bertindak atas korelasi, tanyakan 'variabel ketiga apa yang menggerakkan keduanya?'", correct: true },
            { text: "Terlalu cepat menjawab", why: "Chatbot menjawab dalam 2 detik — mengesankan dan salah. Kecepatan AI adalah fitur; kesimpulan kausal dari korelasi adalah bug. Jangan pernah menukar 'cepat' dengan 'benar': jawaban cepat yang salah lebih berbahaya daripada jawaban lambat yang benar, karena ia dieksekusi sebelum sempat diverifikasi." },
            { text: "Tidak memakai chart", why: "Menampilkan scatter plot yang indah tidak mengubah korelasi menjadi kausalitas — ia hanya membuat kesalahan terlihat meyakinkan. Visualisasi memperkuat pesan, bukan memvalidasinya. Validasi kausal butuh eksperimen atau kontrol confounder, bukan chart yang lebih bagus." },
          ],
        },
        {
          q: "User bertanya \u201Cberapa penjualan bulan lalu?\u201D NLQ yang baik…",
          options: [
            { text: "Menebak definisi paling umum", why: "'Penjualan bulan lalu' ambigu: kalender vs 30 hari terakhir? Gross vs net? Menebak salah satu tanpa bertanya = peluang salah yang tidak tercatat di mana pun. Saat jawabannya keliru, tidak ada yang tahu bahwa itu hasil tebakan — ia terlihat seperti fakta." },
            { text: "Bertanya balik: gross, net, atau expected?", why: "Tepat: NLQ yang baik merespons ambiguitas dengan klarifikasi ('maksudmu kalender atau 30 hari terakhir?') atau menampilkan asumsi eksplisit ('menggunakan gross, kalender'). Prinsipnya: ketidakpastian yang disembunyikan = kebohongan; yang ditampilkan = kejujuran yang bisa dikoreksi.", correct: true },
            { text: "Menjawab dengan ketiganya tanpa label", why: "Menampilkan gross, net, dan recognized sekaligus 'agar lengkap' = memindahkan kebingungan ke pengguna. Tiga angka tanpa label dan tanpa rekomendasi = tiga kali lipat peluang salah baca. Lengkap bukan berarti berguna." },
            { text: "Menolak menjawab", why: "Menolak menjawab pertanyaan ambigu memang ekstrem — tetapi 'menebak diam-diam' juga ekstrem ke arah lain. Jalan tengahnya murah: satu kalimat klarifikasi. Biaya satu pertanyaan << biaya keputusan dari jawaban yang salah tebak." },
          ],
        },
        {
          q: "Vendor klaim 95%, uji 50 pertanyaan nyata: 68%. Kesimpulan?",
          options: [
            { text: "Vendor berbohong", why: "Vendor selalu punya penjelasan ('data kami beda', 'pertanyaannya kurang standar'). Mungkin benar — tetapi itu justru alasannya menguji dengan 50 pertanyaan NYATA milikmu: klaim 95% pada data demo tidak mentransfer ke data produksimu. Beli berdasarkan ujimu, bukan brosur mereka." },
            { text: "Uji dengan datamu sendiri; perbaiki semantic layer dulu, uji ulang", why: "Tepat: dari 16 kesalahan (32%), mayoritas bukan 'AI bodoh' — melainkan ambiguitas definisi ('penjualan' yang mana?) dan keterbatasan model data. Artinya perbaikannya ada di tanganmu (definisi + modeling, BI2/BI11), bukan menunggu vendor 'memperbaiki AI-nya'.", correct: true },
            { text: "Tetap beli, 68% cukup", why: "Akurasi 68% terdengar 'lumayan' sampai diuangkan: sepertiga jawaban salah pada keputusan bisnis = keputusan salah yang sistematis dan pede. Untuk pertanyaan bernilai besar, 68% = tidak layak pakai tanpa review manusia." },
            { text: "Minta diskon 27%", why: "Menawar harga lisensi 50% tidak mengubah 68% menjadi 95%. Biaya sebenarnya bukan lisensi — melainkan keputusan salah dari jawaban yang dipercaya. Negosiasi yang benar: 'perbaiki akurasi pada 50 pertanyaan kami, atau kami tidak beli'." },
          ],
        },
        {
          q: "Kapan AI boleh menjawab tanpa review manusia?",
          options: [
            { text: "Selalu, AI sudah pintar", why: "AI boleh auto-jawab untuk pertanyaan eksplorasi bernilai kecil — tetapi untuk keputusan bernilai besar (budget, PHK, strategi), satu jawaban salah yang pede = bencana. Kriterianya kumulatif: nilai kecil + definisi stabil + terverifikasi + bisa di-rollback. Gagal satu = review manusia wajib." },
            { text: "Pertanyaan rutin + definisi kanonis + confidence tinggi + biaya salah murah", why: "Tepat: (1) nilai keputusan kecil, (2) definisi metrik stabil & terkunci, (3) jawaban terverifikasi terhadap sumber, (4) kesalahan bisa di-rollback. KUMULATIF — bukan 'salah satu'. Pertanyaan CEO biasanya gagal di (1); pertanyaan rutin yang lolos keempatnya boleh otomatis.", correct: true },
            { text: "Saat CEO yang bertanya", why: "'CEO yang bertanya' bukan alasan untuk auto-jawab — justru sebaliknya: pertanyaan CEO hampir selalu bernilai besar (strategi, budget) sehingga gagal syarat (1). Jabatan penanya tidak menurunkan risiko jawabannya." },
            { text: "Saat confidence 100%", why: "Dua kesalahan sekaligus: (a) tidak ada model yang 100% benar — klaim itu sendiri bukti tidak terkalibrasi; (b) confidence = keyakinan model, bukan probabilitas benar (bukti: bucket 85% yang akurasinya 50% di lab 2). Yang dipercaya = akurasi empiris, bukan angka confidence." },
          ],
        },
        {
          q: "Jawaban AI yang sehat selalu menyertakan…",
          options: [
            { text: "Emoji agar ramah", why: "Logo dan warna membuat jawaban terlihat resmi — tetapi tidak membuatnya benar. 'Kosmetik' di sini justru berbahaya: tampilan meyakinkan meningkatkan kepercayaan tanpa meningkatkan akurasi. Yang sehat: sitasi sumber + asumsi eksplisit, bukan branding." },
            { text: "Kartu definisi: metrik apa, filter apa, versi berapa", why: "Tepat: jawaban sehat menyertakan SUMBER (dataset + filter + definisi versi berapa — persis registry BI11) dan ASUMSI yang dipakai. Dengan keduanya, manusia bisa memverifikasi dalam 1 menit. Tanpa keduanya, jawaban AI = klaim tanpa bukti yang harus dipercaya buta.", correct: true },
            { text: "Saran tambahan yang tidak diminta", why: "'Jawaban singkat' tanpa sumber = klaim yang tidak bisa diperiksa. Singkat itu baik untuk dibaca — tetapi ringkasnya presentasi tidak boleh menghapus jejak verifikasinya. Aturannya: singkat di depan, sumber selapis di bawah." },
            { text: "Kode sumber model", why: "Justru paling relevan: pengguna bisnis mengambil keputusan dari jawaban itu. 'Teknis' seperti sumber dan definisi = satu-satunya cara mereka menilai apakah jawaban bisa dipercaya. Menyembunyikannya dari pengguna bisnis = membuat mereka memutuskan secara buta." },
          ],
        },
        {
          q: "NLQ menjawab dengan confidence 95% tapi akurasi empiris bucket itu 60%. Kebijakan yang jujur?",
          options: [
            { text: "Tetap tampilkan 95% — itu output model", why: "Menampilkan angka yang terbukti salah = menyesatkan sistematis. Confidence harus dikalibrasi ke akurasi empiris, bukan diwarisi dari model." },
            { text: "Kalibrasi: tampilkan 60% (atau 'tidak yakin'), dan wajibkan review manusia untuk bucket ini", why: "Tepat: kejujuran = akurasi empiris, bukan klaim model. Bucket yang menyesatkan (gap 35 poin) tidak boleh auto-jawab untuk keputusan bernilai.", correct: true },
            { text: "Sembunyikan confidence-nya", why: "Menyembunyikan bukan memperbaiki. Tanpa confidence, pengguna menganggap semua jawaban sama yakinnya." },
            { text: "Naikkan ambang jadi 99%", why: "Ambang lebih tinggi pada model yang tidak terkalibrasi hanya menggeser masalah, bukan memperbaikinya." },
          ],
        },
      ],
    },
  ],
};
