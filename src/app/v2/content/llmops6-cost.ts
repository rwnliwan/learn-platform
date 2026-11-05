import type { V2Lesson } from "../lib/types";

const COST_SVG = `<svg viewBox="0 0 480 210" role="img" aria-label="Bar chart biaya bulanan: baseline 48 juta, dengan routing 12 juta, dengan routing plus cache 7,8 juta.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="52" y1="170" x2="460" y2="170"/><line x1="52" y1="130" x2="460" y2="130"/><line x1="52" y1="90" x2="460" y2="90"/><line x1="52" y1="50" x2="460" y2="50"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)"><text x="30" y="173">0</text><text x="24" y="133">20jt</text><text x="24" y="93">40jt</text><text x="24" y="53">60jt</text></g>
<rect x="110" y="50" width="70" height="120" fill="var(--c4)"/>
<rect x="230" y="140" width="70" height="30" fill="var(--c2)"/>
<rect x="350" y="150" width="70" height="20" fill="var(--c1)"/>
<g font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">
<text x="145" y="192">Baseline</text><text x="145" y="42">Rp48,0 jt</text>
<text x="265" y="192">+ Routing</text><text x="265" y="132">Rp12,0 jt</text>
<text x="385" y="192">+ Cache 35%</text><text x="385" y="142">Rp7,8 jt</text>
</g>
<text x="256" y="20" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">hemat Rp40,2 jt/bulan (83,75%) tanpa ganti kualitas jawaban</text>
</svg>`;

const LLMOPS6_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="CPA per user per bulan: awal Rp18.000, setelah cache Rp12.960, setelah model murah Rp8.660, setelah kuota Rp6.900."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">9.000</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">18.000</text><rect x="65.9" y="20.0" width="64.8" height="160.0" rx="3" fill="var(--c4)"/><text x="98.2" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp18rb</text><text x="98.2" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Awal</text><rect x="170.4" y="64.8" width="64.8" height="115.2" rx="3" fill="var(--c3)"/><text x="202.8" y="58.8" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp12.960</text><text x="202.8" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">+cache</text><rect x="274.9" y="103.0" width="64.8" height="77.0" rx="3" fill="var(--c2)"/><text x="307.2" y="97.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp8.660</text><text x="307.2" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">+model murah</text><rect x="379.4" y="118.7" width="64.8" height="61.3" rx="3" fill="var(--c1)"/><text x="411.8" y="112.7" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp6.900</text><text x="411.8" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">+kuota</text><line x1="46" y1="113.3" x2="464" y2="113.3" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="460" y="107.3" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">target 30% ARPU</text></svg>`;

export const llmops6: V2Lesson = {
  slug: "llmops6-cost",
  track: "LLMOps",
  module: "Operasi Harian",
  title: "LLMOps6 — Operasi Biaya",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tagihan Rp48 juta yang 70%-nya bisa dihindari",
      prose: [
        "Awal Desember 2026, finance KopiChain memanggil tim AI: tagihan API LLM bulan November Rp48 juta — tiga kali lipat budget. Audit cepat menemukan pola yang menyakitkan: 70% query adalah pertanyaan sepele (`jam buka cabang?`, `cek saldo`) yang dijawab model besar seharga Rp96 per request, padahal model kecil Rp6 per request menjawabnya sama baiknya. Tidak ada yang salah dengan modelnya; yang salah adalah tidak ada yang mengatur kapan memakai yang mana.",
        "Twist-nya: tim mengira `model besar = kualitas lebih baik untuk semua query`. Pengujian buta menunjukkan untuk 80% query rutin, penilai manusia tidak bisa membedakan jawaban model besar dan kecil. Mereka membayar 16x lipat untuk perbedaan yang tidak bisa dirasakan user.",
        "Lesson ini tentang operasi biaya LLM: matematika token, routing model besar/kecil, caching, dan budget guardrail — empat tuas yang memangkas tagihan tanpa menyentuh kualitas.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menghitung biaya LLM per request, per user, dan per bulan dari komponen token; (2) menghitung unit economics (biaya per user aktif) dan menilainya terhadap ARPU; (3) merancang strategi caching berlapis dengan hitungannya; (4) memutuskan kapan pindah ke model lebih murah vs optimasi arsitektur.",
      ],
      tasks: [],
      note: {
        title: "Mitos: model besar selalu sepadan untuk semua query",
        type: "pitfall",
        body: "Yang benar: kualitas marginal model besar hanya terasa di query kompleks (penalaran, nuansa). Untuk query rutin yang berpola, model kecil 16x lebih murah dengan kualitas tak terbedakan. Memakai model besar untuk semuanya = membayar premi asuransi untuk risiko yang tidak ada.",
      },
      reference: "Biaya LLM = token × harga. Tuas: routing, cache, budget.",
    },
    {
      id: "matematika-token",
      eyebrow: "Langkah 2 · Konsep",
      title: "Matematika token: dari request ke rupiah",
      prose: [
        "Biaya satu request = (token input / 1000 × harga input) + (token output / 1000 × harga output). Harga output biasanya 2–4x harga input — karena generating lebih mahal dari reading. Contoh mock realistis: model besar Rp40/1K input + Rp160/1K output; model kecil Rp2,5/1K input + Rp10/1K output. Request tipikal (800 input + 400 output token): besar = 0,8×40 + 0,4×160 = Rp96; kecil = 0,8×2,5 + 0,4×10 = Rp6. Selisih 16x untuk request yang sama.",
        "Tiga pendorong biaya yang sering luput. Satu: konteks RAG yang digemukkan — tiap 1K token konteks = Rp40 per request di model besar; 500.000 request = Rp20 juta/bulan hanya untuk konteks. Dua: `max_tokens` yang dibiarkan besar — model mengisi ruang yang diberi. Tiga: retry tanpa backoff saat error — membayar dua kali untuk satu jawaban.",
        "💡 Intuisi: ukur biaya per request per fitur, bukan tagihan total. `Fitur X = Rp96/request × 500rb = Rp48jt/bulan` membuat keputusan bisnis menjadi konkret: apakah fitur X menghasilkan > Rp48jt nilai?",
      ],
      formula: String.raw`C = N \times \left( \frac{t_{in}}{1000}\,p_{in} + \frac{t_{out}}{1000}\,p_{out} \right)`,
      formulaNote: "C = biaya total; N = jumlah request; t_in/t_out = token input/output per request; p_in/p_out = harga per 1K token.",
      tasks: [],
      note: {
        title: "Mitos: biaya LLM tidak bisa diprediksi",
        type: "pitfall",
        body: "Yang benar: biaya LLM adalah salah satu biaya infra yang PALING bisa diprediksi — rumusnya linear dan semua variabelnya terukur (token per request dari log, harga dari price list). Yang tidak terprediksi adalah biaya dari sistem tanpa instrumentasi: tanpa log token, setiap tagihan adalah kejutan.",
      },
      reference: "Log token per request = fondasi semua optimasi biaya.",
    },
    {
      id: "routing-cache",
      eyebrow: "Langkah 3 · Konsep",
      title: "Routing dan caching: dua tuas terbesar",
      prose: [
        "Routing: classifier kecil (bahkan aturan keyword) memilah query sebelum sampai ke LLM — `jam buka`, `cek saldo` → model kecil; `komplain kompleks`, `butuh penalaran` → model besar. Dengan 80% query rutin ke model kecil: biaya rata-rata per request turun dari Rp96 ke Rp24 (0,8×6 + 0,2×96). Satu baris logika routing memangkas 75% tagihan.",
        "Caching: banyak query berulang persis sama (`jam buka cabang?` ditanya ribuan kali sehari). Exact-match cache: hash dari prompt ternormalisasi → simpan jawaban 1 jam. Hit rate 35% berarti 35% request berharga nyaris nol. Untuk parafrasa (`kapan cabang buka?` vs `jam buka cabang?`), semantic cache (similarity embedding > 0,95) menambah hit rate — dengan risiko jawaban sedikit basi yang harus dikelola TTL.",
        "💡 Intuisi: urutan optimasi = ukur dulu, routing dulu, cache kemudian, negosiasi harga terakhir. Tim yang langsung `ganti vendor lebih murah` tanpa routing biasanya hanya memindahkan inefisiensi ke tagihan yang lebih kecil.",
        "💡 Intuisi: cache untuk LLM butuh TTL agresif (menit–jam, bukan hari) karena jawaban bisa basi seperti dokumen RAG. Cache tanpa invalidasi = RAG basi versi murah.",
      ],
      tasks: [],
      note: {
        title: "Mitos: caching jawaban LLM berbahaya karena nondeterministik",
        type: "pitfall",
        body: "Yang benar: justru karena query-nya deterministik (pertanyaan sama), jawabannya boleh di-cache — user yang bertanya `jam buka cabang?` tidak butuh variasi kreatif. Yang tidak boleh di-cache: query personal (`saldo saya?`) dan jawaban yang bergantung waktu/konteks user. Cache key harus memuat identitas yang relevan.",
      },
      reference: "Routing: 80/20 kecil/besar. Cache: exact dulu, semantic dengan TTL ketat.",
    },
    {
      id: "lab-biaya",
      eyebrow: "Langkah 4 · Lab",
      title: "Kalkulator biaya: baseline → routing → cache",
      prose: [
        "Lab ini menghitung ulang tagihan KopiChain dengan harga mock: 500.000 request/bulan, rata-rata 800 token input + 400 output. Hitung tiga skenario: baseline (semua model besar), routing (80% model kecil), dan routing + cache 35% hit.",
        "Coba eksplorasi: ubah proporsi routing menjadi 50% atau hit rate cache menjadi 60%. Tuas mana yang paling sensitif — dan apa trade-off kualitasnya?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `base_jt` = biaya baseline (juta Rp)" },
        { id: "t2", text: "Hitung `final_jt` = biaya setelah routing + cache (juta Rp)" },
        { id: "t3", text: "Hitung `hemat_pct` = persen penghematan" },
      ],
      expected: "base=48.0jt  final=7.8jt  hemat=83.75%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa membagi token dengan 1000 — harga dinyatakan per 1K token. 800 token × Rp40 = Rp32.000 (salah); yang benar 0,8 × Rp40 = Rp32. Selalu konversi token ke satuan harga dulu.",
      },
      hints: [
        "Fungsi biaya() sudah disediakan — pakai untuk tiap skenario.",
        "Routing: 0,8 × biaya kecil + 0,2 × biaya besar.",
        "hemat_pct = (base_jt - final_jt) / base_jt * 100",
      ],
      code: {
        starter: `req = 500_000\nt_in, t_out = 800, 400\npB_in, pB_out = 40, 160      # Rp per 1K token, model besar (mock)\npK_in, pK_out = 2.5, 10       # Rp per 1K token, model kecil (mock)\n\ndef biaya(n, tin, tout, pin, pout):\n    return n * (tin / 1000 * pin + tout / 1000 * pout)\n\n# TULIS KODEMU: baseline, routing 80% kecil, + cache hit 35%\nbase_jt = \nroute_jt = \nfinal_jt = \nhemat_pct = \n\nprint(f"base={base_jt:.1f}jt  final={final_jt:.1f}jt  hemat={hemat_pct:.2f}%")`,
        lockLines: 9,
        solution: `req = 500_000\nt_in, t_out = 800, 400\npB_in, pB_out = 40, 160      # Rp per 1K token, model besar (mock)\npK_in, pK_out = 2.5, 10       # Rp per 1K token, model kecil (mock)\n\ndef biaya(n, tin, tout, pin, pout):\n    return n * (tin / 1000 * pin + tout / 1000 * pout)\n\n# TULIS KODEMU: baseline, routing 80% kecil, + cache hit 35%\nbase_jt = biaya(req, t_in, t_out, pB_in, pB_out) / 1e6\nroute_jt = (0.8 * biaya(req, t_in, t_out, pK_in, pK_out) + 0.2 * biaya(req, t_in, t_out, pB_in, pB_out)) / 1e6\nfinal_jt = route_jt * (1 - 0.35)\nhemat_pct = (base_jt - final_jt) / base_jt * 100\n\nprint(f"base={base_jt:.1f}jt  final={final_jt:.1f}jt  hemat={hemat_pct:.2f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "base_jt", value: 48.0, tol: 1e-9, label: "`base_jt` seharusnya 48.0", msg: "500.000 × Rp96 = Rp48.000.000." },
          { kind: "equal", task: "t2", name: "final_jt", value: 7.8, tol: 1e-9, label: "`final_jt` seharusnya 7.8", msg: "Routing → Rp12jt; cache 35% → ×0,65 = Rp7,8jt." },
          { kind: "equal", task: "t3", name: "hemat_pct", value: 83.75, tol: 0.01, label: "`hemat_pct` seharusnya 83.75", msg: "(48 − 7,8)/48 × 100 = 83,75%." },
          { kind: "stdout_matches", task: "t3", pattern: "base=48\\.0jt\\s+final=7\\.8jt\\s+hemat=83\\.75%", label: "`print` menampilkan tiga angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Harga per 1K token — selalu konversi dulu. Routing 80/20, cache 35%.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Tuas apa untuk masalah biaya apa",
      prose: [
        "Lima skenario. Satu: tagihan membengkak tapi kualitas baik-baik saja → pasang routing besar/kecil dulu (tuas termurah, dampak terbesar). Dua: banyak query identik berulang (FAQ, jam operasional) → exact cache dengan TTL 1 jam. Tiga: konteks RAG digemukkan `biar aman` → audit token konteks per query; potong ke top-k yang benar-benar dibutuhkan; tiap 1K token = Rp40/request di model besar.",
        "Empat: butuh kualitas model besar untuk SEMUA query menurut tim produk → uji buta (blind test): jika penilai tak bisa membedakan, routing 80/20 bukan penurunan kualitas — ia koreksi persepsi. Lima: budget per tim/fitur jebol → budget guardrail: alert di 80%, throttle di 100%, pemilik biaya per fitur jelas.",
        "Aturan praktis 10 detik: sebelum negosiasi harga atau ganti vendor, pastikan routing + cache sudah jalan. Vendor murah dengan arsitektur boros tetap lebih mahal dari vendor mahal dengan arsitektur hemat.",
      ],
      figure: {
        svg: COST_SVG,
        alt: "Bar chart biaya bulanan: baseline 48 juta, dengan routing 12 juta, dengan routing plus cache 7,8 juta.",
        caption: "Cara membaca: tinggi batang = biaya per bulan (juta Rp). Tiga batang = tiga skenario berurutan. Interpretasi: routing saja memangkas 75% (Rp48jt → Rp12jt); cache menambah penghematan hingga 83,75% (Rp7,8jt). Tuas arsitektur mengalahkan tuas harga — tanpa mengganti vendor atau menurunkan kualitas.",
      },
      tasks: [],
      note: {
        title: "Mitos: optimasi biaya = menurunkan kualitas",
        type: "pitfall",
        body: "Yang benar: 83,75% penghematan di lab ini datang dari routing query SEPELE ke model kecil dan caching jawaban berulang — dua hal yang tidak menyentuh kualitas query kompleks sama sekali. Optimasi biaya yang benar bersifat selektif, bukan pemotongan merata.",
      },
      reference: "Ukur → routing → cache → budget guardrail. Arsitektur dulu, harga terakhir.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Budget guardrail untuk KopiChain",
      prose: [
        "Setelah optimasi, tagihan KopiChain Rp7,8 juta/bulan untuk 500.000 request = Rp15,6 per request rata-rata. Finance menetapkan budget Rp10 juta/bulan dengan aturan: alert di 80% (Rp8 juta), throttle fitur non-kritis di 100%. Pertanyaannya: dengan pertumbuhan 20% request per bulan, kapan budget jebol jika tidak ada optimasi lanjutan? Bulan 1: 500rb × Rp15,6 = Rp7,8jt. Bulan 2: 600rb = Rp9,36jt (alert terlampaui di tengah bulan). Bulan 3: 720rb = Rp11,2jt — jebol.",
        "Pertanyaan analisis: (a) hitung bulan berapa tepatnya alert 80% tersentuh di bulan 2 (asumsi linear dalam bulan). (b) tuas apa yang disiapkan SEBELUM alert berbunyi? (c) mengapa throttle harus per fitur, bukan global?",
        "Jawaban yang defensibel: (a) kebutuhan bulan 2 Rp9,36jt; alert Rp8jt tersentuh saat 8/9,36 = 85,5% bulan berjalan ≈ hari ke-26. (b) naikkan hit rate cache (TTL tuning), perluas routing ke 90% kecil, audit konteks RAG — siapkan sebelum krisis. (c) throttle global mematikan fitur kritis (CS) bersama yang non-kritis (rekomendasi menu) — prioritas bisnis harus tercermin di kebijakan throttle.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Biaya LLM adalah risiko operasional yang tumbuh diam-diam — tidak ada yang `rusak`, hanya tagihan yang naik 20% per bulan. Tanpa budget guardrail, ia ditemukan finance sebagai kejutan. Analis yang memasang alert biaya melakukan manajemen risiko, bukan sekadar penghematan.",
      },
      reference: "Rp15,6/request pasca-optimasi. Alert 80%, throttle 100%, per fitur.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Unit economics: berapa biaya satu user?",
      prose: [
        "Chatbot KopiChain: 10.000 user aktif/bulan, masing-masing 50 request. Per request: input 800 token (× Rp150/1K = Rp120) + output 400 token (× Rp600/1K = Rp240) = Rp360/request. Tanpa optimasi: 10.000 × 50 × Rp360 = Rp180 juta/bulan. ARPU (pendapatan per user) KopiChain: Rp25.000/bulan → total Rp250 juta. Margin kotor: Rp70 juta (28%). Satu kenaikan harga vendor 30% (Rp360 → Rp468) = biaya Rp234 juta — margin tinggal Rp16 juta (6,4%). Bisnis ini hidup dari SELISIH Rp70 juta yang rapuh.",
        "Hitung `biaya per user aktif` (CPA — cost per active user): Rp180jt/10.000 = Rp18.000/user/bulan vs ARPU Rp25.000. Rasio CPA/ARPU = 72% — ZONA MERAH (sehat < 30%). Tiga tuas: (1) TURUNKAN CPA — cache, model murah, kurangi token; (2) NAIKKAN ARPU — monetisasi fitur AI; (3) BATASI — kuota request per user. Kebanyakan tim hanya mengerjakan (1) dan lupa (2)+(3) adalah keputusan PRODUK, bukan engineering.",
        "Simulasi tuas (1): semantic cache hit rate 35% (dari lesson ini, 37 pola cache) → menghemat 35% × 80% (cache tidak sempurna) = 28% → CPA Rp18.000 → Rp12.960. Model murah untuk 40% request sederhana (Rp360 → Rp90) → hemat tambahan ~Rp4.300 → CPA ≈ Rp8.660. Total: Rp18.000 → Rp8.660 (52% turun), rasio CPA/ARPU 35% — masih kuning, tapi bernapas. Kombinasikan dengan tuas (3): kuota 50 → 40 request/user untuk tier gratis (power user < 5% terdampak) → CPA ≈ Rp6.900, rasio 28% ✓ HIJAU.",
        "Pelajaran terbesar: unit economics harus dihitung SEBELUM scale, bukan sesudah. KopiChain yang scale ke 100.000 user dengan CPA/ARPU 72%: biaya Rp1,8M vs pendapatan Rp2,5M — margin Rp700jt terlihat besar, TAPI satu kenaikan harga vendor 30% = rugi Rp140jt/bulan. Scale memperbesar nominal, bukan memperbaiki rasio. Rasio yang merah di 10.000 user akan TETAP merah di 1 juta user — hanya lebih besar dan lebih sulit diperbaiki (kontrak vendor, ekspektasi user).",
      ],
      formula: String.raw`\frac{CPA}{ARPU} < 30\% \quad\text{dengan}\quad CPA = \frac{\text{total biaya LLM}}{\text{user aktif}}`,
      formulaNote: "CPA = biaya LLM per user aktif per bulan; ARPU = pendapatan per user. Rasio < 30% hijau (sehat), 30–50% kuning (waspada), > 50% merah (model bisnis terancam). Hitung SEBELUM scale — scale tidak memperbaiki rasio.",
      tasks: [],
      note: {
        title: "💡 Intuisi: scale memperbesar, bukan memperbaiki",
        body: "Rasio CPA/ARPU 72% di 10.000 user = 72% di 1 juta user, hanya nominalnya 100x. Jangan `scale dulu, optimasi nanti` — nanti = saat margin sudah negatif dan kontrak vendor sudah ditandatangani. Hijau-kan rasionya saat masih kecil dan murah diubah.",
      },
      reference: "Dashboard mingguan: CPA, ARPU, rasio, dan proyeksi kenaikan harga vendor 30%.",
    },
    {
      id: "pendalaman-angka",
      eyebrow: "Langkah 8 · Membaca Angka",
      title: "Ke mana perginya Rp180 juta",
      prose: [
        "Breakdown Rp180 juta/bulan: input token Rp60 juta (33%), output token Rp120 juta (67%). Output 2x lebih mahal — dan ini pola umum: model `berbicara` lebih mahal daripada `mendengar`. Tiga pemboros output terbesar dari audit log: (1) `max_tokens` default 4.096 padahal 95% jawaban < 500 token → batasi 800, hemat 12%; (2) prompt `jelaskan detail` untuk pertanyaan sederhana → routing ke template ringkas, hemat 18%; (3) retry tanpa cache (LLMOps1: nondeterminisme!) → cachekan dulu, hemat 9%. Total 39% dari output = Rp47 juta/bulan — tanpa menyentuh kualitas.",
        "Urutan optimasi yang benar: UKUR dulu (breakdown per komponen), potong yang terbesar dulu. Tim yang langsung `ganti model murah` tanpa breakdown sering memotong 10% sambil mengabaikan 39% yang bocor di output. Audit token bulanan (2 jam kerja) adalah kegiatan ROI tertinggi di LLMOps: setiap Rp1 juta gaji auditor mengembalikan Rp20+ juta penghematan.",
        "Terakhir, siapkan `circuit breaker biaya`: alert jika biaya harian > 150% rata-rata 7 hari (tanda prompt loop, serangan, atau bug retry), dan hard limit per API key per hari. Satu bug infinite-loop pada Desember 2025 menghabiskan Rp84 juta dalam 6 jam di sebuah startup — tanpa circuit breaker, tagihan adalah satu-satunya monitor. Monitor biaya = monitor teknis juga.",
      ],
      figure: {
        svg: LLMOPS6_DEEP_SVG,
        alt: "Diagram batang CPA turun bertahap dari Rp18.000 ke Rp6.900 melewati target Rp7.500.",
        caption: "Cara membaca: tinggi batang = biaya per user aktif per bulan (rupiah); tiap batang = setelah satu optimasi; garis = target 30% ARPU (Rp7.500). Interpretasi: tidak ada SATU optimasi yang cukup — perlu tumpukan cache + model murah + kuota untuk mencapai hijau. Optimasi biaya LLM adalah maraton tumpukan, bukan satu lompatan.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: output 2x lebih mahal dari input — potong di sana",
        body: "67% tagihan KopiChain adalah token OUTPUT. `max_tokens` default, prompt bertele-tele, dan retry tanpa cache adalah tiga pemboros terbesar — total 39% dari output. Audit token bulanan: 2 jam kerja untuk Rp47 juta/bulan penghematan.",
      },
      reference: "Circuit breaker biaya: alert 150% harian + hard limit per API key.",
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
        "C = N × (t_in/1000 × p_in + t_out/1000 × p_out); harga output 2–4x harga input.",
        "Routing 80/20 (kecil/besar) = tuas termurah; cache exact + TTL untuk query berulang.",
        "Ukur biaya per request per fitur — bukan tagihan total — agar keputusan bisnis konkret.",
        "Optimasi selektif (query sepele, cache) tidak menurunkan kualitas query kompleks.",
        "Budget guardrail: alert 80%, throttle 100%, per fitur sesuai prioritas bisnis.",
      ],
      next: { label: "LLMOps7 — Observability", href: "/learn/llmops7-observability" },
      quiz: [
        {
          q: "Request 800 input + 400 output token. Model besar Rp40/1K in + Rp160/1K out. Biaya per request?",
          options: [
            { text: "Rp96", why: "0,8 × 40 + 0,4 × 160 = 32 + 64 = Rp96.", correct: true },
            { text: "Rp200", why: "Itu 800×40 + 400×160 tanpa dibagi 1000 — lupa konversi satuan." },
            { text: "Rp32", why: "Itu hanya komponen input — output (yang lebih mahal) terlupakan." },
            { text: "Rp6", why: "Itu harga model kecil, bukan besar." },
          ],
        },
        {
          q: "Mengapa harga output biasanya 2–4x harga input?",
          options: [
            { text: "Vendor ingin untung lebih", why: "Sinis tapi bukan penjelasan teknisnya." },
            { text: "Generating token autoregresif lebih mahal komputasinya dari reading", why: "Tiap token output butuh forward pass penuh berurutan; input diproses paralel.", correct: true },
            { text: "Output selalu lebih panjang dari input", why: "Tidak selalu — dan harga per token tidak tergantung panjang total." },
            { text: "Agar user hemat menulis prompt", why: "Insentifnya justru sebaliknya: prompt panjang (input) lebih murah." },
          ],
        },
        {
          q: "500.000 request/bulan, 80% bisa ke model kecil (Rp6) sisanya besar (Rp96). Biaya routing per bulan?",
          options: [
            { text: "Rp12.000.000", why: "500.000 × (0,8×6 + 0,2×96) = 500.000 × 24 = Rp12jt.", correct: true },
            { text: "Rp3.000.000", why: "Itu jika 100% ke model kecil — 20% query kompleks tetap butuh besar." },
            { text: "Rp48.000.000", why: "Itu baseline tanpa routing." },
            { text: "Rp24.000.000", why: "Itu 500.000 × Rp48 — salah hitung rata-rata tertimbang." },
          ],
        },
        {
          q: "Query apa yang TIDAK boleh masuk cache jawaban?",
          options: [
            { text: "`Jam buka cabang?`", why: "Query umum yang sama untuk semua user — kandidat cache ideal." },
            { text: "`Berapa saldo saya?`", why: "Jawaban personal bergantung user — cache akan membocorkan saldo orang lain.", correct: true },
            { text: "`Di mana cabang terdekat?`", why: "Selama tidak personal, bisa di-cache dengan TTL." },
            { text: "`Apa itu deposito?`", why: "Definisi umum — aman di-cache." },
          ],
        },
        {
          q: "Urutan optimasi biaya yang benar?",
          options: [
            { text: "Ganti vendor → routing → cache", why: "Terbalik — arsitektur dulu, harga terakhir." },
            { text: "Ukur (log token) → routing → cache → budget guardrail", why: "Tanpa ukur tidak tahu tuas mana yang berdampak; routing termurah; cache berikutnya; guardrail menjaga.", correct: true },
            { text: "Cache → ukur → routing", why: "Cache tanpa ukur = tidak tahu hit rate dan risikonya." },
            { text: "Potong max_tokens sekecil mungkin untuk semua", why: "Pemotongan buta merusak query kompleks — optimasi harus selektif." },
          ],
        },
        {
          q: "CPA Rp18.000, ARPU Rp25.000 (rasio 72%). Vendor naikkan harga 30%. Apa yang terjadi dan apa respons TEPAT?",
          options: [
            { text: "Margin turun 28% → 6,4%; tumpuk optimasi (cache + model murah + kuota) SEKARANG", why: "Tepat. Rp180jt → Rp234jt, margin Rp70jt → Rp16jt. Rasio 72% = zona merah yang tidak tahan guncangan harga. Hijau-kan SEBELUM scale.", correct: true },
            { text: "Naikkan harga ke user 30% juga agar margin kembali", why: "Menaikkan harga 30% tanpa perbaikan nilai = churn massal. ARPU naik di spreadsheet, turun di dunia nyata." },
            { text: "Pindah ke model termurah yang ada, kualitas nomor dua", why: "Model termurah tanpa breakdown = memotong 10% sambil mengabaikan 39% yang bocor di output. Ukur dulu, potong yang terbesar dulu." },
            { text: "Tidak apa-apa — margin masih positif Rp16 juta", why: "Margin 6,4% dengan satu vendor sebagai single point of failure = hidup di tepi jurang. Satu insiden + satu kenaikan harga = rugi." },
          ],
        },
      ],
    },
  ],
};
