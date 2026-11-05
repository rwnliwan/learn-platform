import type { V2Lesson } from "../lib/types";

const CICD_SVG = `<svg viewBox="0 0 520 194" role="img" aria-label="Waktu CI: semua test 18 menit vs test selektif 13 menit; bug tertangkap sebelum produksi.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="150" y1="16" x2="500" y2="16"/><line x1="150" y1="56" x2="500" y2="56"/><line x1="150" y1="96" x2="500" y2="96"/></g>
<g font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">
<text x="140" y="35" text-anchor="end">Semua test</text><rect x="150" y="20" width="35.0" height="18" fill="var(--c1)"/><text x="191" y="35">18 mnt</text>
<text x="140" y="75" text-anchor="end">Test selektif</text><rect x="150" y="60" width="25.3" height="18" fill="var(--c1)"/><text x="181" y="75">13 mnt</text>
<text x="140" y="115" text-anchor="end">Tanpa CI (fix prod)</text><rect x="150" y="100" width="350.0" height="18" fill="var(--error)"/><text x="506" y="115">180 mnt</text>
</g>
<text x="150" y="188" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">0</text><text x="500" y="188" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="end">menit</text>
</svg>`;
export const de15: V2Lesson = {
  slug: "de15-cicd",
  track: "Data Engineer",
  module: "Software Engineering untuk Data",
  title: "DE15 — CI/CD untuk Data Pipeline",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Deploy Jumat sore yang merusak Senin pagi",
      prose: [
        "Jumat 17.30, Doni (data engineer) mem-push 'perbaikan kecil' ke pipeline: mengubah pembulatan di transform/clean.py. Tidak ada test yang jalan — 'kan cuma satu baris'. Senin 09.00, tiga dashboard direksi menampilkan revenue Rp2,1 Miliar yang seharusnya Rp2,0 Miliar. Selisih Rp100 juta dari satu baris pembulatan.",
        "Investigasi: test test_revenue SEBENARNYA ADA — dan akan menangkap bug itu dalam 8 menit. Tetapi tidak ada yang menjalankannya, karena tidak ada CI yang otomatis jalan saat PR dibuat. Test yang tidak otomatis = test yang tidak ada.",
        "Twist-nya: Senin siang Doni berkata 'untung ketahuan cepat'. Yang tidak ia sadari: bug itu hidup 2,5 hari dan sempat dipakai untuk keputusan promo. 'Ketahuan cepat' = 2,5 hari setelah merusak. CI akan menangkapnya dalam 8 menit — SEBELUM merge.",
        "Di lesson ini kamu akan bisa: (1) menjelaskan CI/CD khusus data pipeline (bukan sekadar 'kayak software'); (2) memilih test yang jalan per PR (test selection); (3) merancang deployment gate yang bijak; (4) memakai canary untuk tabel kritis; (5) mengukur DORA metrics untuk tim data.",
      ],
      tasks: [],
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa:",
        "(1) Membedakan CI untuk data vs CI untuk aplikasi (data punya contract test, quality gate, dan backfill plan);",
        "(2) Mengimplementasikan test selection: hanya test yang menjaga file berubah yang jalan;",
        "(3) Merancang deployment gate (unit, contract, lint, review, backfill plan) yang tidak bisa di-bypass diam-diam;",
        "(4) Memutuskan kapan perlu canary/blue-green untuk perubahan pipeline;",
        "(5) Menghitung DORA metrics (lead time, failure rate) untuk tim data.",
      ],
      tasks: [],
    },
    {
      id: "ci-data",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "CI untuk data: test yang menjaga pipa",
      prose: [
        "CI (Continuous Integration) = setiap perubahan kode pipeline OTOMATIS diuji sebelum merge. Untuk data, test-nya khas: (1) unit test transformasi (fungsi bersih()), (2) CONTRACT test (skema input sesuai janji — DE8), (3) DATA QUALITY test pada sampel (expect_*), (4) lint SQL/Python.",
        "Contoh langkah-demi-langkah (dari lab 1): PR mengubah transform/clean.py. Peta dependensi bilang test_dedup dan test_revenue menjaganya → 2 test jalan (13 menit), bukan 4 (18 menit). Hemat 27,8% — kecil di sini, besar di repo dengan 200 test.",
        "Test selection = 'test yang relevan saja'. Aturannya: test jalan jika ia menjaga file yang berubah (langsung atau transitif). PR yang hanya mengubah README? Tidak ada test pipeline yang jalan — dan itu BENAR, bukan kemalasan.",
        "💡 Intuisi kunci: CI yang lambat = CI yang di-bypass. Target: PR mendapat sinyal < 15 menit. Lebih dari itu, engineer me-bypass ('nanti saja') — dan 'nanti' = Jumat 17.30 tanpa test.",
        "Kapan memakai: SETIAP repo pipeline. Tidak ada 'terlalu kecil untuk CI': pipeline 1 file yang merusak dashboard direksi = bukti ukurannya tidak relevan.",
      ],
      formula: String.raw`T_{\text{CI}} = \sum_{t \in S(\Delta)} d_t \quad S = \text{test yang menjaga file berubah}`,
      formulaNote:
        "Waktu CI = jumlah durasi test yang TERPILIH (S) berdasar file berubah (Δ). Tanpa selection: semua test (18 mnt). Dengan selection: hanya yang menjaga clean.py (13 mnt). Hemat = 5 mnt (27,8%) — dan selection yang benar TIDAK mengurangi cakupan untuk perubahan ini.",
      note: {
        title: "🚨 Miskonsepsi: CI/CD data = CI/CD aplikasi biasa",
        body: "CI aplikasi menguji KODE (apakah fungsi benar). CI data menguji KODE + DATA + KONTRAK (apakah skema input masih sesuai? apakah output masih memenuhi ekspektasi kualitas? apakah dashboard hilir tidak pecah?). Pipeline 'lolos test' tetapi merusak mart_revenue = CI yang tidak lengkap. Data punya dimensi yang tidak dimiliki aplikasi: kualitas, kontrak, dan lineage hilir.",
      },
      tasks: [],
    },
    {
      id: "cd-gate",
      eyebrow: "Langkah 4 · CD & Gate",
      title: "CD: gerbang yang bijak, bukan tembok",
      prose: [
        "CD (Continuous Deployment/Delivery) = perubahan yang lolos CI dipromosikan ke produksi dengan AMAN. Untuk pipeline: (1) DEPLOYMENT GATE — checklist yang harus hijau (test, contract, review 2 orang, backfill plan); (2) CANARY — jalankan pipeline baru berdampingan dengan lama, bandingkan output; (3) ROLLBACK PLAN — cara kembali jika canary gagal.",
        "Contoh (dari lab 2): PR menyentuh mart_revenue (dipakai 3 dashboard direksi) tetapi review_2_orang = False → GATE MERAH, deploy DITAHAN. Blocker-nya jelas: ['review_2_orang']. Bukan 'tidak boleh deploy selamanya' — melainkan 'lengkapi dulu'.",
        "Canary untuk data: jalankan pipeline v2 menulis ke tabel shadow (mart_revenue_v2), bandingkan dengan v1 selama 3 hari. Beda > toleransi → investigasi. Sama → promosikan. Inilah 'blue-green' untuk data.",
        "💡 Intuisi kunci: gate yang bijak (quarantine + ambang — pelajaran DE14) dipertahankan; gate yang kaku (semua merah = tahan selamanya) di-bypass. Bedakan 'tahan' (ada blocker jelas) vs 'birokrasi' (butuh 5 approval tanpa alasan).",
        "Kapan memakai: canary WAJIB untuk tabel kritis (dipakai direksi/keuangan); gate untuk semua. Tabel mainan? Gate ringan (test saja). Ikuti risiko — pelajaran DE12.",
      ],
      formula: String.raw`\text{Deploy} \iff \bigwedge G_i \land (\text{kritis} \Rightarrow \text{canary OK})`,
      formulaNote:
        "Deploy diizinkan JIKA DAN HANYA JIKA semua gate G_i hijau, DAN (jika tabel kritis) canary lolos. Lab 2: G_review=False → deploy ditahan; tabel kritis tersentuh → canary wajib. Logika AND, bukan 'sebagian besar hijau'.",
      note: {
        title: "🚨 Miskonsepsi: CD = deploy otomatis ke produksi setiap merge",
        body: "CD untuk data BUKAN 'merge = langsung produksi'. Data tidak punya 'Ctrl+Z' semudah aplikasi (data yang salah sudah dibaca direksi!). CD yang benar = DELIVERY otomatis ke staging + PROMOSI terkontrol ke produksi (gate + canary). Otomatisasi tanpa gerbang = kecepatan menuju bencana yang lebih cepat.",
      },
      tasks: [],
    },
    {
      id: "waktu-ci",
      eyebrow: "Langkah 5 · Visual",
      title: "Harga 8 menit vs harga 3 hari",
      prose: [
        "Cara membaca: tiga batang — 'Semua test' 18 menit, 'Test selektif' 13 menit, 'Tanpa CI (fix di prod)' 180 menit (3 jam: deteksi Senin + investigasi + fix + backfill + permintaan maaf). Batang merah = tanpa CI.",
        "Interpretasi: 8 menit test_revenue di CI vs 180 menit krisis di produksi = 22x lipat. Dan itu belum termasuk 2,5 hari keputusan berbasis data salah. CI bukan biaya — ia diskon 95% untuk harga kegagalan.",
        "💡 Intuisi kunci: tunjukkan chart ini saat seseorang bilang 'CI memperlambat'. Yang memperlambat = 180 menit krisis + 2,5 hari data salah. 13 menit CI = jalan tol, bukan jalan memutar.",
      ],
      figure: {
        svg: CICD_SVG,
        alt: "Waktu CI 13-18 menit vs 180 menit perbaikan di produksi.",
        caption:
          "CI 13 menit vs krisis produksi 180 menit — belum termasuk 2,5 hari data salah.",
      },
      tasks: [],
    },
    {
      id: "lab-seleksi",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: selektor test CI",
      prose: [
        "PR mengubah transform/clean.py. Dari 4 test (18 menit), mana yang HARUS jalan?",
        "Tugasmu: pakai peta dependensi untuk memilih test yang menjaga file berubah, lalu hitung penghematannya.",
        "Coba juga: PR mengubah ['ingest/orders.py', 'orchestration/dag.py']. Test apa yang jalan? (Jawaban: test_schema + test_sla = 5 menit.)",
      ],
      tasks: [
        { id: "t1", text: "Tentukan `jalan`: test yang menjaga file BERUBAH (urutkan)" },
        { id: "t2", text: "Hitung `hemat_mnt` dan `hemat_pct` vs jalan semua test (1 desimal)" },
      ],
      expected: "jalan=['test_dedup', 'test_revenue']",
      note: {
        title: "Sering salah",
        body: "Menjalankan SEMUA test 'biar aman'. Aman = cakupan untuk perubahan ini — test_sla tidak menjaga clean.py; menjalankannya = 3 menit tanpa informasi tambahan.",
      },
      hints: [
        "jalan = test yang file-nya beririsan dengan BERUBAH.",
        "semua = sum(DURASI.values()); jalan_mnt = sum yang jalan.",
        "hemat_pct = (semua-jalan_mnt)/semua*100.",
      ],
      code: {
        starter: `# Peta dependensi: test -> file pipeline yang ia jaga\nTESTS = {\n    "test_schema": ["ingest/orders.py"],\n    "test_dedup": ["transform/clean.py"],\n    "test_revenue": ["transform/clean.py", "models/mart.py"],\n    "test_sla": ["orchestration/dag.py"],\n}\n# Waktu tiap test (menit)\nDURASI = {"test_schema": 2, "test_dedup": 5, "test_revenue": 8, "test_sla": 3}\n# File berubah di PR ini:\nBERUBAH = ["transform/clean.py"]\n# TULIS KODEMU: jalan, hemat_mnt, hemat_pct\njalan = []\nhemat_mnt = 0\nhemat_pct = 0.0\n\nprint(f"jalan={jalan}")\nprint(f"hemat_mnt={hemat_mnt}  hemat_pct={hemat_pct}")\n`,
        lockLines: 11,
        solution: `# Peta dependensi: test -> file pipeline yang ia jaga\nTESTS = {\n    "test_schema": ["ingest/orders.py"],\n    "test_dedup": ["transform/clean.py"],\n    "test_revenue": ["transform/clean.py", "models/mart.py"],\n    "test_sla": ["orchestration/dag.py"],\n}\n# Waktu tiap test (menit)\nDURASI = {"test_schema": 2, "test_dedup": 5, "test_revenue": 8, "test_sla": 3}\n# File berubah di PR ini:\nBERUBAH = ["transform/clean.py"]\n\n# TULIS KODEMU: jalan, hemat_mnt, hemat_pct\njalan = sorted(t for t, files in TESTS.items() if any(f in BERUBAH for f in files))\nsemua = sum(DURASI.values())\njalan_mnt = sum(DURASI[t] for t in jalan)\nhemat_mnt = semua - jalan_mnt\nhemat_pct = round(hemat_mnt / semua * 100, 1)\n\nprint(f"jalan={jalan}")\nprint(f"hemat_mnt={hemat_mnt}  hemat_pct={hemat_pct}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "jalan", value: ["test_dedup", "test_revenue"], label: "`jalan` benar", msg: "Yang menjaga transform/clean.py." },
          { kind: "equal", task: "t2", name: "hemat_mnt", value: 5, label: "`hemat_mnt` = 5", msg: "18-13." },
          { kind: "equal", task: "t2", name: "hemat_pct", value: 27.8, tol: 0.05, label: "`hemat_pct` = 27,8", msg: "5/18." },
        ],
      },
      reference: "Test selection: jalankan yang menjaga perubahan — bukan semuanya, bukan seadanya.",
    },
    {
      id: "lab-gate",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: penjaga gerbang deploy",
      prose: [
        "PR menyentuh mart_revenue (3 dashboard direksi). Lima gate, satu merah.",
        "Tugasmu: daftarkan blocker, putuskan lolos/tidak, dan tentukan perlu canary atau tidak.",
        "Hasil: TAHAN — bukan 'jangan pernah', melainkan 'lengkapi review dulu'. Dan karena tabel kritis: canary wajib. Inilah gate yang bijak: jelas apa yang kurang, jelas apa selanjutnya.",
      ],
      tasks: [
        { id: "t1", text: "Isi `blocker`: gate yang merah (urutkan)" },
        { id: "t2", text: "Tentukan `lolos` dan `perlu_canary` (tabel kritis tersentuh?)" },
      ],
      expected: "lolos=False  blocker=['review_2_orang']  perlu_canary=True",
      note: {
        title: "Sering salah",
        body: "Menghitung '4 dari 5 hijau = lolos'. Gate = AND, bukan voting. Satu merah = tahan. 'Sebagian besar' tidak berlaku untuk gerbang.",
      },
      hints: [
        "blocker = [k for k,v in GATE.items() if not v].",
        "lolos = not blocker.",
        "perlu_canary = bool(SENTUH & TABEL_KRITIS).",
      ],
      code: {
        starter: `# Checklist gate deploy ke produksi\nGATE = {\n    "unit_tests": True,\n    "contract_tests": True,\n    "lint": True,\n    "review_2_orang": False,\n    "backfill_plan": True,\n}\n# Perubahan ini menyentuh tabel: ["mart_revenue"] (dipakai 3 dashboard direksi)\nTABEL_KRITIS = {"mart_revenue"}\nSENTUH = {"mart_revenue"}\n# TULIS KODEMU: lolos, blocker, perlu_canary\nlolos = True\nblocker = []\nperlu_canary = False\n\nprint(f"lolos={lolos}  blocker={blocker}  perlu_canary={perlu_canary}")\n`,
        lockLines: 11,
        solution: `# Checklist gate deploy ke produksi\nGATE = {\n    "unit_tests": True,\n    "contract_tests": True,\n    "lint": True,\n    "review_2_orang": False,\n    "backfill_plan": True,\n}\n# Perubahan ini menyentuh tabel: ["mart_revenue"] (dipakai 3 dashboard direksi)\nTABEL_KRITIS = {"mart_revenue"}\nSENTUH = {"mart_revenue"}\n\n# TULIS KODEMU: lolos, blocker, perlu_canary\nblocker = sorted(k for k, v in GATE.items() if not v)\nlolos = not blocker\nperlu_canary = bool(SENTUH & TABEL_KRITIS)\n\nprint(f"lolos={lolos}  blocker={blocker}  perlu_canary={perlu_canary}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "blocker", value: ["review_2_orang"], label: "`blocker` benar", msg: "Satu-satunya gate merah." },
          { kind: "equal", task: "t2", name: "lolos", value: false, label: "`lolos` = False", msg: "Ada blocker = tahan." },
          { kind: "equal", task: "t2", name: "perlu_canary", value: true, label: "`perlu_canary` = True", msg: "mart_revenue kritis tersentuh." },
        ],
      },
      reference: "Deployment gate: AND atas semua gate + canary untuk tabel kritis.",
    },
    {
      id: "dora",
      eyebrow: "Langkah 8 · Metrik",
      title: "DORA untuk tim data: ukur kecepatanmu",
      prose: [
        "Empat metrik DORA (dari riset Google) — diterjemahkan untuk data: (1) LEAD TIME: ide → produksi (target: < 1 hari untuk perubahan kecil); (2) DEPLOY FREQUENCY: berapa kali/minggu pipeline di-update (elit: on-demand); (3) CHANGE FAILURE RATE: % deploy yang merusak data (target: < 15%); (4) MTTR: deteksi → pulih (target: < 1 jam).",
        "Contoh: tim Doni sebelum CI: lead time 5 hari (takut deploy), failure rate 40% (Jumat 17.30!), MTTR 2,5 hari. Sesudah CI+gate: lead time 4 jam, failure 10%, MTTR 30 menit. Angka-angka ini yang membuat investasi CI disetujui manajemen.",
        "Formula kunci: failure rate = deploy_gagal / total_deploy. 'Gagal' untuk data = data salah mengalir ke hilir (bukan sekadar job error — job error yang tertahan gate TIDAK dihitung gagal; ia bukti gate bekerja!).",
        "💡 Intuisi kunci: yang diukur = yang diperbaiki. Tim yang tidak mengukur failure rate akan selalu merasa 'deploy kita baik-baik saja' — sampai Senin pagi seperti cerita pembuka.",
      ],
      formula: String.raw`\text{FailureRate} = \frac{D_{\text{gagal}}}{D_{\text{total}}} \qquad \text{Target} < 15\%`,
      formulaNote:
        "D_gagal = deploy yang menyebabkan data salah di hilir; D_total = semua deploy ke produksi. Job yang GAGAL DI GATE (tertahan sebelum produksi) tidak dihitung gagal — ia bukti sistem bekerja. Target elit: < 15%.",
      tasks: [],
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 9 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 CI yang lambat = CI yang di-bypass. Jika pipeline CI > 15 menit, engineer mencari jalan pintas — dan jalan pintas = Jumat 17.30. Investasi terbaik: test selection + paralelisme, bukan 'disiplin'.",
        "💡 Test yang tidak otomatis = tidak ada. Test_revenue Doni ADA dan BENAR — tetapi tidak jalan otomatis = tidak ada. Otomatisasi adalah satu-satunya cara test benar-benar dijalankan.",
        "💡 Bedakan 'tahan' vs 'birokrasi'. Tahan = ada blocker jelas + jalan keluar jelas (lab 2). Birokrasi = butuh 5 tanda tangan tanpa kriteria. Gate pertama membangun kepercayaan; gate kedua menghancurkannya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tidak ada tombol undo untuk data yang sudah ditulis",
        body: "Deploy aplikasi yang buruk bisa di-rollback; deploy pipeline yang buruk menulis data yang salah ke tabel yang dibaca 14 dashboard — dan \"rollback data\" berarti backfill yang menyakitkan. Inilah kenapa disiplin deploy di data lebih ketat, bukan lebih longgar. Heuristik praktisi: setiap perubahan pipeline wajib lolos tiga syarat — backward compatible (tambah kolom boleh, rename atau ganti arti jangan), rerunnable (bisa di-run ulang tanpa efek ganda), dan reversible (ada rencana backfill bila salah). Jebakan yang paling mahal: perubahan skema tanpa migrasi — kolom di-rename Jumat sore, Senin pagi 6 dashboard merah dan tidak ada yang tahu nama kolom barunya. Aturan emasnya: tidak pernah rename, hanya add plus deprecate — tulis ke kolom baru, dual-run dua minggu, umumkan, baru hapus yang lama. Untuk keberanian deploy, pola yang terbukti adalah shadow run: jalankan kode baru di atas data kemarin, diff hasilnya dengan produksi, deploy hanya bila diff-nya sesuai harapan — kerugian Rp100 juta dari satu baris pembulatan tertangkap di tahap ini, bukan di produksi. Dan uji Jumat 17.30: bila kamu tidak berani deploy ini Jumat sore, pipeline-nya yang belum siap — bukan nyalimu yang kurang.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: seberapa ketat pipelinenya?",
      prose: [
        "Skenario 1 — PR mengubah transformasi inti. → CI penuh: unit + contract + quality + lint. Alasan: risiko tinggi, sinyal lengkap.",
        "Skenario 2 — PR hanya mengubah docs/README. → Lint + review ringan saja. Alasan: tidak ada kode pipeline yang berubah; menjalankan test data = pemborosan.",
        "Skenario 3 — Deploy menyentuh tabel kritis (direksi/keuangan). → Gate penuh + CANARY (shadow table, bandingkan 3 hari). Alasan: harga kegagalan besar.",
        "Skenario 4 — Hotfix produksi (data salah mengalir SEKARANG). → Jalur cepat: test relevan + 1 reviewer + canary singkat. Alasan: kecepatan + keamanan seimbang; 'bypass semua' = mengulangi kesalahan.",
        "Skenario 5 — Pipeline baru, belum ada pengguna. → Gate ringan (unit + lint). Alasan: risiko rendah; keketatan mengikuti risiko (DE12).",
        "Aturan praktis 10 detik: tanya 'tabel apa yang tersentuh dan siapa yang membacanya?' Mainan → ringan. Direksi → penuh + canary. Darurat → cepat tapi tetap ada test.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 11 · Mini-case",
      title: "Mini-case: Rp100 juta dari satu baris pembulatan",
      prose: [
        "PT MajuLogistik, Jumat 17.30. Doni push 'perbaikan kecil': round(x, 2) → round(x, 1) di transform/clean.py. Tidak ada CI. Senin 09.00: revenue Rp2,1 M vs seharusnya Rp2,0 M — selisih Rp100 juta (5%) dari pembulatan yang lebih kasar di 2 juta baris.",
        "Timeline biaya: deteksi 2,5 hari (keputusan promo diambil dengan data salah: estimasi dampak Rp50 juta) + investigasi 4 jam (Rp1 juta) + fix + backfill 3 hari (Rp750 ribu compute) + kepercayaan direksi (tak ternilai). Total kasar: > Rp51 juta dari satu baris.",
        "Dengan CI (seperti lab 1-2): test_revenue menangkap dalam 8 menit, PR tidak di-merge, biaya = 13 menit compute (Rp5 ribu). Rasio: 10.000x. Inilah 'asuransi' termurah di data engineering.",
        "Pembahasan: (a) test ADA tetapi tidak OTOMATIS = tidak ada; (b) gate + canary untuk tabel kritis; (c) aturan 'no Friday deploy' adalah plester — CI adalah obat. Jangan larang Jumat; pasang gerbang.",
        "💡 Intuisi kunci: 'cuma satu baris' adalah kalimat paling mahal di engineering. Satu baris + 2 juta baris data = Rp100 juta. CI tidak menilai niat; ia menilai dampak.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Pertanyaan tentang lesson ini. Setiap opsi menjelaskan alasannya — baca semua why meski jawabanmu benar.",
      ],
      tasks: [],
      summary: [
        "CI untuk data = uji kode + kontrak + kualitas + dampak hilir, otomatis tiap PR.",
        "Test selection: hanya test yang menjaga file berubah — presisi, bukan kemalasan.",
        "Deployment gate = AND atas semua gate; canary wajib untuk tabel kritis.",
        "CD data = delivery otomatis + promosi terkontrol (bukan merge = produksi).",
        "Ukur DORA: lead time, frequency, failure rate (<15%), MTTR — yang diukur yang diperbaiki.",
      ],
      next: { label: "DE16 — dbt: Transformasi sebagai Kode", href: "/v2/learn/de16-dbt" },
      quiz: [
        {
          q: "PR mengubah transform/clean.py. Dari 4 test (18 menit), strategi CI yang benar?",
          options: [
            { text: "Jalankan semua — biar aman", why: "18 menit tiap PR = CI lambat = di-bypass. 'Biar aman' yang membuat orang menghindari CI = tidak aman." },
            { text: "Test selection: hanya test yang menjaga file berubah (13 menit)", why: "Tepat: test_dedup + test_revenue menjaga clean.py (lab 1). Cakupan untuk perubahan ini PENUH dengan 27,8% lebih cepat. Selection ≠ malas; selection = presisi.", correct: true },
            { text: "Tidak usah test — perubahannya kecil", why: "'Kecil' = Rp100 juta (mini-case). Ukuran diff tidak memprediksi ukuran dampak." },
            { text: "Test manual oleh author", why: "Manual = tidak konsisten + tidak tercatat + tidak jalan saat author lupa. Otomatis atau tidak ada." },
          ],
        },
        {
          q: "Gate: 4 hijau, 1 merah (review_2_orang=False). PR menyentuh tabel kritis. Keputusan?",
          options: [
            { text: "Lolos — 80% hijau cukup", why: "Gate = AND, bukan voting. 80% hijau + tabel kritis = TAHAN. 'Cukup' tidak ada dalam kamus gerbang." },
            { text: "Tahan: lengkapi review, lalu canary karena tabel kritis", why: "Tepat (lab 2): blocker jelas ['review_2_orang'] + jalan keluar jelas. Setelah hijau: canary (shadow table 3 hari) karena kritis. Bijak, bukan birokrasi.", correct: true },
            { text: "Bypass gate — urgent", why: "Bypass 'urgent' untuk tabel kritis = Jumat 17.30 jilid 2. Jalur hotfix tetap ada test + reviewer." },
            { text: "Hapus gate review agar hijau", why: "Menghapus gate agar hijau = menipu diri (pelajaran DE14). Gate yang mengganggu = diperbaiki desainnya, bukan dihapus." },
          ],
        },
        {
          q: "Apa beda utama CI untuk data vs CI untuk aplikasi?",
          options: [
            { text: "Tidak ada beda", why: "Ada: data butuh contract test (skema), quality test (expect_*), dan pertimbangan hilir (dashboard pecah?). Aplikasi: kode benar = cukup." },
            { text: "Data menguji kode + kontrak + kualitas + dampak hilir", why: "Tepat: pipeline 'lolos unit test' tetapi merusak mart_revenue = CI tidak lengkap. Dimensi data (kualitas, kontrak, lineage) tidak ada di CI aplikasi biasa.", correct: true },
            { text: "Data tidak butuh CI", why: "Mini-case Rp100 juta membantah. Data butuh CI LEBIH dari aplikasi — karena tidak ada Ctrl+Z untuk data yang sudah dibaca direksi." },
            { text: "CI data lebih lambat", why: "Bisa lebih cepat dengan test selection (lab 1). Kecepatan = desain, bukan nasib." },
          ],
        },
        {
          q: "Kapan canary (shadow table) WAJIB untuk perubahan pipeline?",
          options: [
            { text: "Setiap perubahan", why: "Canary untuk typo di README = pemborosan. Keketatan mengikuti risiko." },
            { text: "Saat menyentuh tabel kritis (direksi/keuangan) atau logika inti", why: "Tepat: harga kegagalan besar = verifikasi besar. Shadow table + bandingkan 3 hari = bukti sebelum promosi. Tabel mainan? Gate ringan cukup.", correct: true },
            { text: "Tidak pernah — buang waktu", why: "'Buang waktu' = 3 hari canary vs 2,5 hari krisis + Rp51 juta. Hitungannya jelas." },
            { text: "Hanya saat diminta manajer", why: "Kebutuhan canary ditentukan risiko, bukan permintaan. Engineer yang menunggu diminta = reaktif." },
          ],
        },
        {
          q: "Tim: lead time 5 hari, failure rate 40%, MTTR 2,5 hari. Diagnosis DORA?",
          options: [
            { text: "Tim lambat — tambah orang", why: "Lead time 5 hari + failure 40% = bukan kurang orang, melainkan takut deploy (tidak ada CI) + sering rusak. Tambah orang = tambah yang takut." },
            { text: "Tidak ada CI/gate yang efektif: takut deploy (lead time) + sering rusak (failure) + lama pulih (MTTR)", why: "Tepat: tiga metrik menunjuk satu akar — tidak ada jaring pengaman otomatis. Obat: CI + test selection + gate + canary. Ukur lagi 3 bulan kemudian.", correct: true },
            { text: "Normal untuk tim data", why: "'Normal' = menyerah. Elit DORA: lead time < 1 hari, failure < 15%, MTTR < 1 jam. Jauh, tetapi arahnya jelas." },
            { text: "Kurangi deploy agar failure turun", why: "Mengurangi deploy menurunkan failure DENGAN CARA menyerah pada kecepatan. Target = sering deploy + jarang gagal (keduanya!), bukan jarang deploy." },
          ],
        },
      ],
    },
  ],
};
