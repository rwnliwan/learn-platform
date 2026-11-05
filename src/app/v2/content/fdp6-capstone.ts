import type { V2Lesson } from "../lib/types";

// Diagram: pipeline 4 tahap + gerbang rekonsiliasi.
const PIPE_SVG = `<svg viewBox="0 0 640 230" role="img" aria-label="Pipeline empat tahap: Fetch, Parse, Clean, Ratios, diakhiri gerbang rekonsiliasi.">
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="10" y="60" width="120" height="80" rx="10" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="70" y="90" font-size="12" font-weight="700" fill="var(--text)">1. Fetch</text>
<text x="70" y="110" font-size="10" fill="var(--text-muted)">EDGAR API</text>
<text x="70" y="125" font-size="10" fill="var(--text-muted)">+ User-Agent</text>
<rect x="150" y="60" width="120" height="80" rx="10" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="210" y="90" font-size="12" font-weight="700" fill="var(--text)">2. Parse</text>
<text x="210" y="110" font-size="10" fill="var(--text-muted)">JSON → tabel</text>
<text x="210" y="125" font-size="10" fill="var(--text-muted)">kanonis</text>
<rect x="290" y="60" width="120" height="80" rx="10" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<text x="350" y="90" font-size="12" font-weight="700" fill="var(--text)">3. Clean</text>
<text x="350" y="110" font-size="10" fill="var(--text-muted)">filed menang</text>
<text x="350" y="125" font-size="10" fill="var(--text-muted)">+ provenance</text>
<rect x="430" y="60" width="120" height="80" rx="10" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="490" y="90" font-size="12" font-weight="700" fill="var(--text)">4. Ratios</text>
<text x="490" y="110" font-size="10" fill="var(--text-muted)">16 rasio</text>
<text x="490" y="125" font-size="10" fill="var(--text-muted)">otomatis</text>
<rect x="180" y="165" width="280" height="50" rx="10" fill="none" stroke="var(--error)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="320" y="186" font-size="12" font-weight="700" fill="var(--text)">GERBANG: reconcile.py</text>
<text x="320" y="205" font-size="10" fill="var(--text-muted)">LULUS = track selesai. GAGAL = diagnosis, bukan vonis.</text>
</g>
<g stroke="var(--chart-text)" stroke-width="1.6">
<line x1="130" y1="100" x2="146" y2="100"/><line x1="270" y1="100" x2="286" y2="100"/><line x1="410" y1="100" x2="426" y2="100"/>
<line x1="490" y1="140" x2="490" y2="162"/>
</g>
</svg>`;

export const fdp6: V2Lesson = {
  slug: "fdp6-capstone",
  track: "Financial Data Pipeline",
  module: "Capstone",
  title: "FDP6 — Capstone: Pipeline End-to-End + Laporan Rekonsiliasi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pipeline yang jalan vs pipeline yang dipercaya",
      prose: [
        "Setelah lima lesson, Riko punya semua potongan: fetch dari EDGAR, parse ke tabel kanonis, cleaning dengan aturan filed, dan mesin 16 rasio. Ia merangkainya menjadi pipeline.py, menjalankannya untuk satu emiten, dan mendapat dataset_kanonis.csv yang rapi. Selesai? Belum.",
        "Ia menunjukkan hasilnya ke Sinta. Sinta bertanya satu hal: 'bagaimana kamu tahu angka-angka ini benar?' Riko terdiam. Pipeline-nya jalan tanpa error — tapi 'jalan tanpa error' bukanlah bukti kebenaran. Kode yang salah dengan percaya diri tetap menghasilkan CSV yang rapi.",
        "Twist-nya: kepercayaan tidak dibangun oleh kode yang panjang, melainkan oleh satu gerbang kecil di ujung: reconcile.py — yang membandingkan output pipeline dengan angka yang sudah diverifikasi manusia dari filing asli. Pipeline yang lolos gerbang bukan sekadar 'jalan'; ia 'terbukti benar'.",
        "Lesson capstone ini: merangkai semuanya, lalu melewati gerbang. LULUS = track selesai.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: pipeline selesai saat kodenya jalan",
        type: "pitfall",
        body: "Kode yang jalan hanya membuktikan tidak ada SyntaxError. Kebenaran data dibuktikan oleh perbandingan independen dengan sumber kebenaran — bukan oleh lamanya kode atau rapi outputnya.",
      },
      reference: "Capstone = pipeline end-to-end + gerbang rekonsiliasi. LULUS = terbukti benar.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjalankan pipeline lengkap dan membuktikan kebenarannya lewat laporan rekonsiliasi.",
        "(1) Merangkai fetch → parse → clean → ratios menjadi satu pipeline.py yang utuh;",
        "(2) Menjalankan reconcile.py dan membaca 5 ceknya (C1–C5);",
        "(3) Mendiagnosis kegagalan umum (satuan, definisi, restatement) dari pesan checker;",
        "(4) Menghasilkan tiga deliverable: pipeline.py, dataset_kanonis.csv, laporan_rekonsiliasi.md berstatus LULUS.",
      ],
      tasks: [],
    },
    {
      id: "arsitektur",
      eyebrow: "Langkah 3 · Konsep",
      title: "Anatomi pipeline + gerbang",
      prose: [
        "Pipeline capstone punya empat tahap berurutan — masing-masing adalah lesson yang sudah kamu kuasai. Fetch (FDP2): tarik companyfacts dari EDGAR dengan User-Agent yang benar. Parse (FDP3): bentuk tabel kanonis (concept, value, unit, period_end, fy, fp, form, filed, accn). Clean (FDP4): filed terbaru menang, skala diseragamkan ke satuan penuh dengan Decimal, provenance menempel. Ratios (FDP5): 16 rasio dengan annualisasi dan denominator yang benar.",
        "Lalu gerbang: reconcile.py membandingkan output-mu dengan benchmark.csv — 41 angka terverifikasi builder dari filing asli (KLBF FY2024, BBRI FY2024, BBCA H1 2026). Lima cek: C1 eksak untuk angka level-1, C2 ±0,5 pp untuk rasio, C3 konsistensi internal, C4 provenance, C5 jebakan satuan.",
        "💡 Intuisi: benchmark adalah 'kunci jawaban' yang ditulis manusia dari filing asli. Pipeline-mu adalah 'jawaban ujian'. Gerbang tidak menilai usahamu — ia menilai kecocokan. Dan itu adil: data tidak peduli seberapa keras kamu bekerja.",
        "Cara membaca: empat kotak tahap berurutan, panah ke bawah menuju kotak gerbang reconcile.py.",
        "Interpretasi: gerbang bukan bagian opsional — ia definisi 'selesai'. Pipeline tanpa gerbang adalah klaim; pipeline lolos gerbang adalah bukti.",
      ],
      figure: {
        svg: PIPE_SVG,
        alt: "Empat tahap pipeline — Fetch, Parse, Clean, Ratios — bermuara ke gerbang reconcile.py.",
        caption: "Empat tahap membangun; satu gerbang membuktikan.",
      },
      tasks: [],
      reference: "Fetch → Parse → Clean → Ratios → GERBANG (reconcile.py LULUS).",
    },
    {
      id: "lab-gate",
      eyebrow: "Langkah 4 · Lab",
      title: "Lab: mini-gerbang rekonsiliasi",
      prose: [
        "Sebelum menjalankan gerbang sungguhan di Colab, bangun versi mininya di sini. Kamu mengimplementasikan dua fungsi: `rekonsiliasi()` (C1: bandingkan eksak, kembalikan yang gagal) dan `cek_satuan()` (C5: deteksi rasio kelipatan 1000 yang bersih).",
        "Data uji: benchmark 2 angka KLBF; SCRIPT_OK (benar) harus menghasilkan dict kosong; SCRIPT_TRAP (revenue dalam juta tapi dideklarasikan Rp) harus menghasilkan pesan yang menyebut 'satuan'.",
        "Instruksi eksplorasi: setelah lolos, ubah SCRIPT_TRAP agar revenue-nya 32627776108026 + 1 (selisih Rp1). Apa kata gerbang? Apakah ia menyebut 'satuan'? Seharusnya tidak — selisih Rp1 bukan pola satuan.",
        "Interpretasi: gerbang yang baik tidak hanya bilang 'salah' — ia bilang 'salahnya seperti apa'. Itulah beda C1 dan C5.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `cek_satuan`: True bila rasio = 10^±3/±6/±9 yang bersih" },
        { id: "t2", text: "Lengkapi `rekonsiliasi`: dict {pos: pesan} untuk yang gagal; pesan wajib sebut 'satuan' bila jebakan satuan" },
        { id: "t3", text: "Cetak hasil kedua skenario" },
      ],
      expected: "ok={} | trap={'rev': '...satuan...'}",
      note: {
        title: "Kunci C5",
        body: "Rasio bersih = log10(rasio) mendekati bilangan bulat ±3/±6/±9. Gunakan math.log10 dan bandingkan dengan round()-nya dalam toleransi 1e-9. Jangan bandingkan float dengan ==.",
      },
      hints: [
        "cek_satuan: r = script_val/bench_val; e = round(math.log10(r)); kembalikan abs(math.log10(r)-e) < 1e-9 and abs(e) in (3,6,9). Hati-hati bila bench_val = 0.",
        "rekonsiliasi: untuk tiap pos, bila script[pos] != bench[pos] → pesan. Bila cek_satuan(...) True → pesan menyebut 'satuan'.",
        "Gunakan .get(pos) agar pos yang hilang tidak crash — beri pesan 'hilang'.",
      ],
      code: {
        starter: `import math\n\nBENCH = {"rev": 32627776108026, "ni": 3240636626331}\nSCRIPT_OK = {"rev": 32627776108026, "ni": 3240636626331}\nSCRIPT_TRAP = {"rev": 32627776.108026, "ni": 3240636626331}\n\n# TULIS KODEMU\ndef cek_satuan(script_val, bench_val):\n    \n\n# TULIS KODEMU\ndef rekonsiliasi(script, bench):\n    gagal = {}\n    \n    return gagal\n\nprint("ok:", rekonsiliasi(SCRIPT_OK, BENCH))\nprint("trap:", rekonsiliasi(SCRIPT_TRAP, BENCH))`,
        lockLines: 5,
        solution: `import math\n\nBENCH = {"rev": 32627776108026, "ni": 3240636626331}\nSCRIPT_OK = {"rev": 32627776108026, "ni": 3240636626331}\nSCRIPT_TRAP = {"rev": 32627776.108026, "ni": 3240636626331}\n\ndef cek_satuan(script_val, bench_val):\n    if bench_val == 0 or script_val == 0:\n        return False\n    r = script_val / bench_val\n    e = round(math.log10(r))\n    return abs(e) in (3, 6, 9) and abs(math.log10(r) - e) < 1e-9\n\ndef rekonsiliasi(script, bench):\n    gagal = {}\n    for pos, bv in bench.items():\n        sv = script.get(pos)\n        if sv is None:\n            gagal[pos] = "pos hilang di output script"\n        elif sv != bv:\n            if cek_satuan(sv, bv):\n                gagal[pos] = f"kemungkinan ketidakcocokan satuan: {sv} vs {bv}"\n            else:\n                gagal[pos] = f"selisih {sv - bv:+}"\n    return gagal\n\nprint("ok:", rekonsiliasi(SCRIPT_OK, BENCH))\nprint("trap:", rekonsiliasi(SCRIPT_TRAP, BENCH))`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "ok: \\{\\}", label: "skenario OK kosong", msg: "rekonsiliasi(SCRIPT_OK) harus {} — tidak ada yang gagal." },
          { kind: "stdout_matches", task: "t3", pattern: "trap: \\{'rev': '[^']*satuan[^']*'\\}", label: "trap menyebut 'satuan'", msg: "Pesan untuk 'rev' pada SCRIPT_TRAP wajib menyebut 'satuan'." },
          { kind: "stdout_matches", task: "t1", pattern: "trap:", label: "kedua skenario dicetak", msg: "Baris trap: ... harus tampil." },
        ],
      },
      reference: "Gerbang mini: bandingkan eksak, diagnosis pola satuan.",
    },
    {
      id: "laporan",
      eyebrow: "Langkah 5 · Konsep",
      title: "Membaca laporan rekonsiliasi seperti analis",
      prose: [
        "Output reconcile.py bukan sekadar LULUS/GAGAL — ia peta diagnosis. Setiap baris gagal adalah petunjuk dengan alamat yang jelas.",
        "Pola diagnosis: (1) Pesan 'KETIDAKCOCOKAN SATUAN' → cek kolom satuan dan konversi. Jangan sentuh rumus; sentuh skalanya. (2) C2 gagal (rasio di luar ±0,5 pp) → cek definisi: rata-rata vs akhir? numerator annualisasi? Bandingkan dengan 'definisi bank vs hitunganmu' dari FSA Lab. (3) C3 gagal (inkonsistensi internal) → cek restatement: apakah kamu memakai filed lama untuk satu pos dan filed baru untuk pos lain? (4) C4 gagal (tanpa sumber) → lengkapi provenance; ini bukan soal angka, soal akuntabilitas. (5) C1 gagal tanpa pola satuan → cek periode (Q1 vs H1?) dan concept (padanan yang salah?).",
        "💡 Intuisi: perlakukan laporan GAGAL sebagai senior yang mereview kodemu — spesifik, tidak menghakimi, dan selalu menunjuk baris berikutnya untuk diperiksa. Gerbang yang baik tidak pernah bilang 'salah' tanpa bilang 'di mana'.",
      ],
      tasks: [],
      note: {
        title: "Aturan diagnosis",
        type: "pitfall",
        body: "Jangan pernah 'memperbaiki' angka agar lolos gerbang (mis. menggeser definisi diam-diam). Gerbang menguji pipeline, bukan menguji kemampuanmu mencontek kunci. Angka yang dipaksa cocok adalah kebohongan yang lolos QA.",
      },
      reference: "Diagnosis: satuan → definisi → restatement → provenance → periode/concept.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Kapan LULUS, kapan investigasi",
      prose: [
        "Tidak semua GAGAL berarti pipeline rusak — dan tidak semua LULUS berarti sempurna. Peta ini membedakan keduanya.",
        "Skenario 1 — LULUS semua cek. Keputusan: track selesai. Simpan laporan sebagai bukti; ia portofoliomu.",
        "Skenario 2 — GAGAL C1 dengan pola satuan. Keputusan: perbaiki konversi, bukan angka. Ini bug termurah.",
        "Skenario 3 — GAGAL C2 dalam 0,5–2 pp. Keputusan: investigasi definisi dulu (rata-rata vs akhir, annualisasi). Bila definisimu sah dan terdokumentasi, pertimbangkan penyesuaian definisi — bukan pelonggaran toleransi.",
        "Skenario 4 — GAGAL C3 (inkonsistensi internal). Keputusan: JANGAN lanjut ke interpretasi. Angka yang tidak balance tidak layak ditafsirkan — perbaiki hulu dulu.",
        "Skenario 5 — LULUS tapi ada 'DILEWATI' di C3. Keputusan: LULUS bersyarat — catat pos yang dilewati di laporan sebagai keterbatasan. Kejujuran tentang cakupan adalah bagian dari kelulusan.",
        "Aturan praktis 10 detik: GAGAL = perbaiki dan jalankan ulang. LULUS + catatan = selesai dengan integritas.",
      ],
      tasks: [],
      reference: "GAGAL → perbaiki → ulang. LULUS + catatan keterbatasan = selesai.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: gerbang untuk BBCA interim",
      prose: [
        "Capstone-mu memilih BBCA H1 2026 (interim, unaudited) sebagai emiten EDGAR-pipeline? Tidak bisa — BBCA bukan emiten US. Jadi Bagian B memakai pendekatan IDX: kamu memetakan pos filing interim BBCA ke skema kanonis secara manual, lalu menjalankan reconcile.py atas mapping-mu.",
        "Angka jangkar: NII H1 42.604.563 (Rp juta), laba atribusional 29.534.446, kredit gross 1.035.623.547. Tantangan khas interim: (1) NII adalah flow 6 bulan — untuk rasio tahunan, annualisasi sebagai konvensi (M38); (2) filing-nya unaudited — yang diuji gerbang adalah konsistensi internal, bukan 'kebenaran audit'; (3) kredit gross = konvensional + syariah — jangan lupa komponen syariah 13.574.715.",
        "Pertanyaan: pipeline-mu melaporkan kredit gross 1.022.048.832 (hanya konvensional). Apa kata gerbang, dan apa diagnosisnya?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Gerbang: C1 GAGAL untuk kredit_gross (selisih −13.574.715). Diagnosis: bukan pola satuan (rasio ≈ 0,987, bukan kelipatan 1000) — melainkan komponen hilang: pembiayaan syariah tidak ikut dijumlah. Pelajarannya: untuk bank syariah-mix, 'kredit' tanpa kualifikasi adalah pos yang belum selesai didefinisikan. Perbaiki mapping, bukan toleransi.",
      },
      reference: "GAGAL tanpa pola satuan = komponen/definisi. Baca selisihnya, bukan vonisnya.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Capstone = pipeline end-to-end (fetch → parse → clean → ratios) + gerbang reconcile.py.",
        "Gerbang membuktikan kebenaran lewat perbandingan independen — 'jalan tanpa error' bukan bukti.",
        "Diagnosis GAGAL: satuan → definisi → restatement → provenance → periode/concept.",
        "Jangan pernah memaksa angka agar lolos; LULUS + catatan keterbatasan = integritas.",
        "Deliverable: pipeline.py + dataset_kanonis.csv + laporan_rekonsiliasi.md berstatus LULUS.",
      ],
      quiz: [
        {
          q: "Pipeline-mu jalan tanpa error tapi reconcile.py GAGAL di C1. Artinya…",
          options: [
            { text: "Pipeline selesai — error hanya soal format", why: "GAGAL C1 berarti angka tidak cocok dengan filing asli. Itu soal kebenaran, bukan format." },
            { text: "Ada bug kebenaran data yang harus didiagnosis dan diperbaiki", why: "Tepat: gerbang menguji kebenaran, bukan kelancaran. GAGAL = investigasi, bukan perayaan.", correct: true },
            { text: "Benchmark-nya yang harus disesuaikan", why: "Benchmark terverifikasi dari filing asli — ia wasitnya, bukan terdakwanya." },
            { text: "C1 terlalu ketat untuk pipeline pertama", why: "C1 eksak karena membandingkan angka yang dilaporkan. Melonggarkannya = menurunkan standar kebenaran." },
          ],
        },
        {
          q: "Pesan 'KETIDAKCOCOKAN SATUAN' muncul. Respons pertama yang benar?",
          options: [
            { text: "Cek kolom satuan dan konversi — jangan sentuh rumus", why: "Tepat: pola satuan = bug skala, bukan bug logika. Perbaiki konversinya.", correct: true },
            { text: "Kalikan semua angka dengan 1.000 sampai lolos", why: "Menebak faktor pengali sampai lolos adalah voodoo, bukan engineering." },
            { text: "Hapus cek C5 dari reconcile.py", why: "Menghapus wasit karena tidak suka vonisnya adalah kecurangan." },
            { text: "Ganti benchmark ke satuan yang sama dengan script", why: "Benchmark adalah sumber kebenaran; yang menyesuaikan adalah script, bukan sebaliknya." },
          ],
        },
        {
          q: "C3 GAGAL (neraca tidak balance). Bolehkan lanjut menghitung rasio?",
          options: [
            { text: "Boleh — rasio memakai pos yang balance saja", why: "Rasio dari angka yang tidak balance adalah tafsir atas fondasi retak." },
            { text: "Tidak — perbaiki hulu dulu; angka tak balance tak layak ditafsirkan", why: "Tepat (skenario 4): konsistensi internal adalah prasyarat interpretasi, bukan pelengkap.", correct: true },
            { text: "Boleh bila selisihnya di bawah 1%", why: "Neraca harus balance eksak (akuntansi double-entry). 'Di bawah 1%' tetap berarti ada yang hilang." },
            { text: "Boleh — cukup catat sebagai keterbatasan", why: "Keterbatasan untuk cakupan (pos dilewati), bukan untuk aritmetika yang salah." },
          ],
        },
        {
          q: "Kredit gross BBCA-mu 1.022.048.832 vs benchmark 1.035.623.547. Diagnosis gerbang?",
          options: [
            { text: "Jebakan satuan", why: "Rasio ≈ 0,987 — bukan kelipatan 1000 yang bersih. Bukan pola satuan." },
            { text: "Komponen hilang: pembiayaan syariah 13.574.715 tidak ikut", why: "Tepat: 1.035.623.547 − 1.022.048.832 = 13.574.715 = pos syariah. Definisi 'kredit' belum lengkap.", correct: true },
            { text: "Restatement antar filing", why: "Kedua angka dari filing yang sama (H1 2026); tidak ada versi-versian." },
            { text: "Salah periode (Q1 vs H1)", why: "Keduanya H1; selisihnya persis satu komponen yang terdokumentasi." },
          ],
        },
        {
          q: "Apa definisi 'selesai' untuk track Financial Data Pipeline?",
          options: [
            { text: "Semua 6 lesson dibaca sampai akhir", why: "Membaca bukan membuktikan. Track ini tentang bukti, bukan kehadiran." },
            { text: "pipeline.py + dataset_kanonis.csv + laporan_rekonsiliasi.md berstatus LULUS", why: "Tepat: tiga deliverable dengan gerbang LULUS — bukti kerja, bukan klaim.", correct: true },
            { text: "Notebook Colab dieksekusi tanpa error", why: "Tanpa error ≠ benar. Gerbang rekonsiliasilah yang menyatakan benar." },
            { text: "16 rasio berhasil dihitung untuk 3 emiten", why: "Menghitung tanpa verifikasi = Sinta jilid dua: 160 angka tanpa bukti." },
          ],
        },
      ],
    },
  ],
};
