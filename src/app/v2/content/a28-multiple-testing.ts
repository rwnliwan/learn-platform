import type { V2Lesson } from "../lib/types";

export const a28: V2Lesson = {
  slug: "a28-multiple-testing",
  track: "Statistika",
  module: "Inferensial",
  title: "A2.8 Multiple Testing: Jebakan Jelly Bean Hijau",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-jellybean",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Jelly bean hijau penyebab jerawat",
      prose: [
        "Komik sains terkenal menggambarkan ilmuwan menguji apakah jelly bean menyebabkan jerawat — 20 warna, masing-masing uji α = 5%. Hasil: 19 tidak signifikan; satu warna — hijau — signifikan (p < 0,05)! Headline: JELLY BEAN HIJAU MENYEBABKAN JERAWAT — TERBUKTI SECARA ILMIAH! Tentu saja omong kosong: dengan 20 uji pada α = 5%, peluang minimal satu false positive adalah 64% — bahkan jika jelly bean tidak berpengaruh sama sekali.",
        "Ini mekanisme di balik krisis replikasi sains, strategi trading yang bagus di backtest hancur di live, dan A/B test yang menang lalu gagal direplikasi. Setiap kali kamu menguji banyak hal dan melaporkan yang menarik, kamu mengulangi eksperimen jelly bean hijau.",
        "Lesson bersama (shared): materi ini dipakai juga di track Bioinformatics, Health Data Science, dan Marketing Analytics — pelajari sekali di sini, dan tautkan dari sana, jangan diduplikasi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `fwer` = 1 − 0,95^20, bulatkan 2 desimal" },
        { id: "t2", text: "Hitung `ambang_bonf` = 0,05/20 (ambang Bonferroni per uji)" },
      ],
      expected: "fwer=0.64  ambang_bonf=0.0025",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jumlah uji adalah bagian dari metode — menyembunyikannya = menyembunyikan risiko. 'Saya cuma pakai α = 5%' tidak ada artinya tanpa menyebut berapa uji yang dijalankan. Strategi terbaik dari 50 backtest hampir selalu adalah yang paling beruntung, bukan yang paling bagus.",
      },
      hints: [
        "fwer = round(1 - 0.95**20, 2).",
        "ambang_bonf = 0.05 / 20.",
        "64% — temuan hijau hampir pasti kebetulan.",
      ],
      code: {
        starter: `# 20 warna jelly bean, tiap uji alpha=5%\n\n# TULIS KODEMU\nfwer = \nambang_bonf = \n\nprint(f"fwer={fwer}  ambang_bonf={ambang_bonf}")`,
        lockLines: 1,
        solution: `# 20 warna jelly bean, tiap uji alpha=5%\n\n# TULIS KODEMU\nfwer = round(1 - 0.95**20, 2)\nambang_bonf = 0.05/20\n\nprint(f"fwer={fwer}  ambang_bonf={ambang_bonf}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fwer", value: 0.64, tol: 0.01, label: "`fwer` seharusnya 0.64", msg: "1 − 0,95²⁰ ≈ 64% — false positive hampir pasti." },
          { kind: "equal", task: "t2", name: "ambang_bonf", value: 0.0025, tol: 1e-9, label: "`ambang_bonf` seharusnya 0.0025", msg: "Ambang per uji: 0,05/20 = 0,0025." },
          { kind: "stdout_matches", task: "t2", pattern: "fwer=0\\.64\\s+ambang_bonf=0\\.0025", label: "`print` menampilkan keduanya", msg: "Format: fwer=...  ambang_bonf=... ." },
        ],
      },
      reference: "Masalahnya bukan p-value-nya — tapi seleksinya.",
    },
    {
      id: "fwer-bonferroni",
      eyebrow: "Langkah 2 · FWER & Bonferroni",
      title: "Palu godam yang sederhana",
      prose: [
        "FWER = peluang membuat minimal satu error Tipe I di antara m uji = 1 − (1−α)ᵐ. Pada m = 100: 99,4% — temuan palsu hampir pasti. Intuisi kunci: p-value tiap uji tetap valid untuk uji itu sendiri. Masalahnya adalah seleksi — kamu menjalankan 20 uji lalu melaporkan yang terkecil. p-value minimum dari 20 uji tidak lagi uniform — ia bias ke kecil.",
        "Koreksi Bonferroni: bagi α dengan m → ambang 0,0025 untuk m = 20. p hijau = 0,03 > 0,0025 → gagal menolak. Headline dibatalkan. Dijamin FWER ≤ α bahkan jika uji saling berkorelasi. Tapi sangat konservatif saat m besar: dengan 1.000 uji, ambang = 0,00005 — power anjlok. Bonferroni mengendalikan false positive dengan mengorbankan banyak true positive.",
      ],
      formula: String.raw`\text{FWER} = 1-(1-\alpha)^m, \quad \text{ambang Bonferroni} = \frac{\alpha}{m}`,
      formulaNote: "FWER = peluang membuat minimal satu error Tipe I di antara m uji; alpha = level signifikansi per uji (biasanya 0,05); m = banyaknya uji yang dijalankan; ambang Bonferroni = alpha/m, dipakai sebagai threshold p-value tiap uji.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Bonferroni selalu pilihan yang benar karena paling aman. Salah — paling aman dari false positive ≠ paling benar. Jika tujuanmu eksplorasi (menemukan kandidat untuk ditindaklanjuti), Bonferroni terlalu kejam. Pilih koreksi sesuai tujuan — bukan yang paling ketat secara membabi buta.",
      },
      reference: "Koreksi mengubah keputusan — itulah gunanya.",
    },
    {
      id: "holm",
      eyebrow: "Langkah 3 · Prosedur Holm",
      title: "Palu yang lebih cerdas",
      prose: [
        "Holm (step-down): urutkan p-value terkecil→terbesar, uji satu per satu dengan ambang yang melonggar: α/m, α/(m−1), … Begitu satu gagal, berhenti. Contoh m = 4, p terurut [0,008; 0,015; 0,03; 0,40]: 0,008 < 0,0125 → tolak; 0,015 < 0,0167 → tolak; 0,03 < 0,025? Tidak → berhenti. Hasil: 2 penolakan — Bonferroni (ambang 0,0125 semua) hanya menolak 1.",
        "Holm selalu menolak minimal sebanyak Bonferroni (uniformly more powerful) — dengan jaminan FWER yang sama dan tanpa asumsi tambahan. Setiap penolakan membebaskan sebagian budget α untuk hipotesis berikutnya. Tidak ada alasan memakai Bonferroni jika Holm tersedia — kecuali butuh ambang tunggal yang simpel untuk komunikasi.",
      ],
      tasks: [
        { id: "t1", text: "Terapkan Holm: p = [0,008; 0,015; 0,03; 0,40], m=4, α=0,05 — hitung `tolak` (jumlah penolakan)" },
      ],
      expected: "tolak=2",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Power gratis tanpa harga: Holm menangkap satu temuan tambahan dibanding Bonferroni dengan jaminan FWER yang sama. Untuk keputusan konfirmatori (uji klinis, rilis model), selalu pilih Holm di atas Bonferroni.",
      },
      hints: [
        "Urutkan p; ambang ke-k = 0.05/(4-k+1).",
        "0.008 < 0.0125 ✓; 0.015 < 0.0167 ✓; 0.03 < 0.025 ✗ → berhenti.",
        "tolak = 2",
      ],
      code: {
        starter: `# Holm step-down: m=4, alpha=0.05\np = [0.008, 0.015, 0.03, 0.40]\n\n# TULIS KODEMU\ntolak = \n\nprint(f"tolak={tolak}")`,
        lockLines: 2,
        solution: `# Holm step-down: m=4, alpha=0.05\np = [0.008, 0.015, 0.03, 0.40]\n\n# TULIS KODEMU\ntolak = 0\nfor k, pk in enumerate(sorted(p), start=1):\n    if pk < 0.05/(len(p)-k+1):\n        tolak += 1\n    else:\n        break\n\nprint(f"tolak={tolak}")`,
        checks: [
          { kind: "equal", task: "t1", name: "tolak", value: 2, tol: 1e-9, label: "`tolak` seharusnya 2", msg: "Holm menolak 2 — satu lebih banyak dari Bonferroni, gratis." },
          { kind: "stdout_matches", task: "t1", pattern: "tolak=2", label: "`print` menampilkan tolak", msg: "Format: tolak=... ." },
        ],
      },
      reference: "Holm: hipotesis yang terbukti tidak memakan budget α.",
    },
    {
      id: "bh-fdr",
      eyebrow: "Langkah 4 · Benjamini–Hochberg & FDR",
      title: "Mengendalikan proporsi, bukan keberadaan",
      prose: [
        "BH mengendalikan False Discovery Rate — proporsi temuan yang palsu, bukan peluang adanya temuan palsu. Bandingkan p-value terurut ke-k dengan garis k·α/m; tolak semua sampai titik terakhir di mana p-value masih di bawah garis. Jaminan: dari semua yang kamu klaim temuan, maksimal α yang palsu (rata-rata).",
        "Filosofi: FWER (Bonferroni/Holm) = hampir pasti TIDAK ADA temuan palsu — untuk konfirmatori: uji klinis, keputusan final. FDR (BH) = maksimal α dari temuanku yang palsu — untuk eksploratori: skrining ribuan fitur/gen/strategi. BH jauh lebih longgar dan powerful untuk eksplorasi — standar di genomik dan skrining fitur ML. Trik BH: ia tidak berhenti di persimpangan pertama (seperti Holm) — ia melompat ke yang terakhir.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Adjusted p-value (BH) = 0,04 harus dibandingkan lagi dengan α/m. Salah — adjusted p-value sudah dikoreksi, siap dibandingkan langsung dengan α = 0,05 → signifikan pada FDR 5%. Mengoreksi dua kali membuat uji terlalu konservatif.",
      },
      reference: "BH untuk skrining; Holm/Bonferroni untuk keputusan final.",
    },
    {
      id: "kapan-pakai",
      eyebrow: "Langkah 5 · Memilih koreksi",
      title: "Sesuai tujuan, bukan yang paling ketat",
      prose: [
        "Keputusan final, sedikit uji, false positive mahal (uji klinis, rilis model kredit) → Holm. Eksplorasi skala besar, ribuan kandidat, rela sedikit palsu demi menangkap sinyal (skrining fitur, genomik) → BH, lalu validasi finalis secara terpisah. Bonferroni hanya jika butuh ambang tunggal yang simpel untuk komunikasi.",
        "Dan untuk temuan tak terencana (mencoba 50 segmentasi, menemukan 1 signifikan, melaporkan itu saja): ini p-hacking — jelly bean hijau versi korporat. Koreksi (BH/Holm) atau — lebih baik — replikasi pada data baru. Melaporkan yang menarik saja tanpa menyebut 49 lainnya = menyembunyikan m.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Backtest 50 strategi tanpa protokol multiple testing = 50 jelly bean. Tetapkan protokol sebelum backtest massal: BH untuk skrining + validasi out-of-sample untuk finalis. Jangan alokasikan modal dari temuan yang konsisten dengan noise.",
      },
      reference: "Pilih koreksi sesuai tujuan — eksplorasi vs konfirmasi.",
    },
    {
      id: "minicase-trading",
      eyebrow: "Langkah 6 · Mini-case",
      title: "50 varian strategi trading",
      prose: [
        "Tim quant menguji 50 varian strategi pada data historis 5 tahun. Tiga varian signifikan (p = 0,01; 0,03; 0,04) dengan Sharpe 1,1–1,4. Tim ingin mengalokasikan modal ke ketiganya.",
        "(a) Ekspektasi false positive = 50 × 0,05 = 2,5. Tiga temuan ≈ ekspektasi palsu — sangat mungkin ketiganya noise. FWER = 1 − 0,95⁵⁰ ≈ 92%. (b) Bonferroni: ambang = 0,001 — tidak satu pun lolos. BH: 0,01 ≤ 1×0,05/50 = 0,001? Tidak → tidak ada yang lolos. (c) Jangan alokasikan modal: akui ketiga temuan konsisten dengan noise; jika penasaran, uji out-of-sample (data yang belum pernah dipakai); ke depan, tetapkan protokol multiple testing sebelum backtest massal.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `eksp_fp` = 50 × 0,05" },
        { id: "t2", text: "Hitung `fwer` = 1 − 0,95^50, bulatkan 2 desimal" },
        { id: "t3", text: "Hitung `ambang` = 0,05/50 (ambang Bonferroni)" },
      ],
      expected: "eksp_fp=2.5  fwer=0.92  ambang=0.001",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tiga 'temuan' dari 50 uji ≈ ekspektasi palsu 2,5. Mengalokasikan modal ke ketiganya = mengalokasikan ke noise. Pelajaran mahal: strategi terbaik dari 50 backtest hampir selalu yang paling beruntung, bukan yang paling bagus.",
      },
      hints: [
        "eksp_fp = 50 * 0.05.",
        "fwer = round(1 - 0.95**50, 2).",
        "ambang = 0.05 / 50 — p=0,01 pun tidak lolos.",
      ],
      code: {
        starter: `# 50 varian strategi, tiap uji alpha=5%\n\n# TULIS KODEMU\neksp_fp = \nfwer = \nambang = \n\nprint(f"eksp_fp={eksp_fp}  fwer={fwer}  ambang={ambang}")`,
        lockLines: 1,
        solution: `# 50 varian strategi, tiap uji alpha=5%\n\n# TULIS KODEMU\neksp_fp = 50 * 0.05\nfwer = round(1 - 0.95**50, 2)\nambang = 0.05/50\n\nprint(f"eksp_fp={eksp_fp}  fwer={fwer}  ambang={ambang}")`,
        checks: [
          { kind: "equal", task: "t1", name: "eksp_fp", value: 2.5, tol: 1e-9, label: "`eksp_fp` seharusnya 2.5", msg: "Ekspektasi 2,5 false positive — tiga temuan ≈ noise." },
          { kind: "equal", task: "t2", name: "fwer", value: 0.92, tol: 0.01, label: "`fwer` seharusnya 0.92", msg: "FWER ≈ 92% — temuan palsu hampir pasti." },
          { kind: "equal", task: "t3", name: "ambang", value: 0.001, tol: 1e-9, label: "`ambang` seharusnya 0.001", msg: "Ambang Bonferroni 0,001 — tidak satu pun lolos." },
          { kind: "stdout_matches", task: "t3", pattern: "eksp_fp=2\\.5\\s+fwer=0\\.92\\s+ambang=0\\.001", label: "`print` menampilkan ketiganya", msg: "Format: eksp_fp=...  fwer=...  ambang=... ." },
        ],
      },
      reference: "Jangan alokasikan modal dari backtest tanpa koreksi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "FWER = 1 − (1−α)ᵐ — error menumpuk seiring jumlah uji.",
        "Bonferroni: ambang α/m — sederhana, konservatif, tanpa asumsi.",
        "Holm: step-down, selalu ≥ Bonferroni dalam power, FWER sama.",
        "BH: kendalikan FDR — untuk eksplorasi skala besar.",
        "Melaporkan hanya yang menarik tanpa menyebut m = p-hacking.",
      ],
      next: { label: "A2.9 — Bootstrap", href: "/learn/a29-bootstrap" },
      quiz: [
        {
          q: "20 uji independen pada α=5%, semua H0 benar. Peluang ≥1 false positive?",
          options: [
            { text: "5%", why: "Itu peluang per uji — bukan peluang kolektifnya." },
            { text: "1 − 0,95²⁰ ≈ 64%", why: "FWER = 1 − (1−α)ᵐ — aritmetika jelly bean hijau.", correct: true },
            { text: "100%", why: "Belum 100% — tapi 64% sudah berbahaya." },
            { text: "0,25%", why: "Itu 0,05²⁰ — peluang SEMUA uji false positive, bukan ≥1." },
          ],
        },
        {
          q: "Setelah koreksi Bonferroni (m=20), p=0,03 menjadi tidak signifikan. Apa yang terjadi?",
          options: [
            { text: "Datanya berubah", why: "Datanya sama — yang berubah standar buktinya." },
            { text: "Ambang diperketat ke 0,0025 untuk mengendalikan FWER — p=0,03 tidak cukup kuat untuk 20 uji", why: "Dengan 20 kesempatan, p=0,03 diharapkan muncul ~1× secara kebetulan.", correct: true },
            { text: "Ujinya salah", why: "Ujinya benar — koreksinya yang mengubah keputusan." },
            { text: "α diubah jadi 3%", why: "α tetap 5% — ambang per ujinya yang dibagi m." },
          ],
        },
        {
          q: "Mengapa Holm selalu ≥ Bonferroni dalam power?",
          options: [
            { text: "Karena rumusnya lebih rumit", why: "Kerumitan bukan sumber power." },
            { text: "Karena ambangnya melonggar (α/(m−k+1)) setiap ada penolakan — hipotesis yang terbukti tidak 'memakan' budget α", why: "Jaminan FWER-nya sama — power gratis tanpa harga.", correct: true },
            { text: "Karena memakai FDR", why: "Holm mengendalikan FWER, bukan FDR." },
            { text: "Karena mengasumsikan independensi", why: "Holm tidak butuh asumsi independensi." },
          ],
        },
        {
          q: "Skrining 1.000 kandidat fitur untuk model. Koreksi paling tepat?",
          options: [
            { text: "Tanpa koreksi — nanti juga ketahuan", why: "Tanpa koreksi, temuanmu didominasi noise." },
            { text: "Bonferroni — paling aman", why: "Ambang 0,00005 akan membunuh hampir semua sinyal." },
            { text: "BH (FDR) — eksplorasi skala besar; rela 5% temuan palsu demi menangkap sinyal; finalis divalidasi terpisah", why: "FDR tepat untuk skrining yang dilanjutkan validasi.", correct: true },
            { text: "Holm — untuk semua kasus", why: "Holm untuk keputusan final, bukan skrining massal." },
          ],
        },
        {
          q: "Analis mencoba 50 segmentasi, menemukan 1 yang 'signifikan' (p=0,02), lalu melaporkannya saja. Masalah terbesar?",
          options: [
            { text: "p=0,02 kurang kecil", why: "Bukan soal kecilnya p — soal seleksinya." },
            { text: "Seleksi temuan tanpa koreksi/replikasi — ini p-hacking; ekspektasi false positive dari 50 uji ≈ 2,5", why: "Jelly bean hijau versi korporat — replikasi pada data baru lebih baik.", correct: true },
            { text: "Segmentasinya terlalu banyak", why: "Banyak segmentasi boleh — asal dikoreksi." },
            { text: "Harus pakai α=1%", why: "α=1% tanpa koreksi masih memberi ekspektasi 0,5 FP dari 50 uji." },
          ],
        },
      ],
      note: {
        title: "Intuisi: p-value adalah harga, bukan label kebenaran",
        body: "Enam heuristik meja kerja. Satu: m bertambah diam-diam — setiap “coba-coba dulu” sebelum memilih uji menambah jumlah uji yang sebenarnya kamu lakukan; p-hacking tidak butuh niat jahat, cukup rasa penasaran tanpa catatan. Dua: Bonferroni adalah asuransi termahal di toko — preminya dibayar dengan power; pakai hanya bila false positive benar-benar mahal, seperti keputusan final atau rilis model. Tiga: pilih FWER atau FDR sebelum melihat hasil — mengganti standar setelah melihat p-value sama dengan menawar harga setelah barang dibeli. Empat: aturan praktis — di atas 20 uji, BH adalah default yang waras; untuk sedikit uji yang menentukan nasib, Holm mengalahkan Bonferroni tanpa harga tambahan. Lima: p-value tiap uji tetap valid untuk uji itu sendiri; yang rusak adalah interpretasi kolektifnya — jangan pernah melaporkan “satu yang signifikan” tanpa menyebut berapa yang dicoba. Enam: koreksi mengendalikan error statistik, bukan error desain — tidak ada koreksi yang menyelamatkan eksperimen yang bocor; bila taruhannya tinggi, replikasi independen selalu mengalahkan koreksi tercanggih.",
      },
    },
  ],
};
