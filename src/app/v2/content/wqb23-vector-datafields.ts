import type { V2Lesson } from "../lib/types";

const FIG_VEC_TURNOVER = `<svg viewBox="0 0 560 300" role="img" aria-label="Bar chart turnover sinyal vec_count sebelum dan sesudah decay.">
<g font-family="var(--font-ui)">
<text x="16" y="22" font-size="13" fill="var(--chart-text)" font-weight="600">Turnover sinyal vec_count: mentah vs didiet (ilustratif)</text>
<line x1="60" y1="40" x2="60" y2="250" stroke="var(--chart-grid)" stroke-width="1"/>
<line x1="60" y1="250" x2="540" y2="250" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="22" y="80" font-size="10" fill="var(--chart-text)">200%</text>
<text x="22" y="140" font-size="10" fill="var(--chart-text)">130%</text>
<text x="28" y="200" font-size="10" fill="var(--chart-text)">60%</text>
<text x="28" y="240" font-size="10" fill="var(--chart-text)">25%</text>
<rect x="110" y="70" width="70" height="180" fill="var(--c2)" opacity="0.85"/>
<text x="145" y="265" font-size="11" fill="var(--chart-text)" text-anchor="middle">mentah</text>
<text x="145" y="62" font-size="10" fill="var(--chart-text)" text-anchor="middle">~200%</text>
<rect x="230" y="190" width="70" height="60" fill="var(--c4)" opacity="0.85"/>
<text x="265" y="265" font-size="11" fill="var(--chart-text)" text-anchor="middle">decay(10)</text>
<text x="265" y="182" font-size="10" fill="var(--chart-text)" text-anchor="middle">~60%</text>
<rect x="350" y="230" width="70" height="20" fill="var(--c4)" opacity="0.85"/>
<text x="385" y="265" font-size="11" fill="var(--chart-text)" text-anchor="middle">decay(20)</text>
<text x="385" y="222" font-size="10" fill="var(--chart-text)" text-anchor="middle">~25%</text>
<line x1="60" y1="148" x2="540" y2="148" stroke="#e11d48" stroke-width="2" stroke-dasharray="8 5"/>
<text x="545" y="152" font-size="11" fill="#e11d48" font-weight="600">batas 70%</text>
<text x="60" y="292" font-size="11" fill="var(--chart-text)">Angka ilustratif dari plot dok resmi: mentah menembus batas, diet menurunkannya</text>
</g>
</svg>`;

const FIG_PETA_VEC = `<svg viewBox="0 0 520 380" role="img" aria-label="Flowchart pemilihan operator vec bintang.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Peta: pertanyaan riset → operator vec_*</text>
<rect x="170" y="40" width="180" height="30" fill="var(--c1)" opacity="0.9"/>
<text x="260" y="60" font-size="12" fill="var(--chart-text)" text-anchor="middle">Punya vector field (berita/event)</text>
<polygon points="260,82 360,116 260,150 160,116" fill="var(--c2)" opacity="0.9"/>
<text x="260" y="120" font-size="11" fill="var(--chart-text)" text-anchor="middle">Mau hitung APA dari vektornya?</text>
<text x="120" y="120" font-size="11" fill="var(--chart-text)" text-anchor="end">banyaknya event</text>
<text x="140" y="140" font-size="11" fill="var(--c4)" font-weight="600" text-anchor="end">→ vec_count</text>
<text x="120" y="180" font-size="11" fill="var(--chart-text)" text-anchor="end">nilai tipikal</text>
<text x="140" y="200" font-size="11" fill="var(--c4)" font-weight="600" text-anchor="end">→ vec_avg / vec_median</text>
<text x="120" y="240" font-size="11" fill="var(--chart-text)" text-anchor="end">ekstrem / sebaran</text>
<text x="140" y="260" font-size="11" fill="var(--c4)" font-weight="600" text-anchor="end">→ vec_max / vec_range / vec_stddev</text>
<text x="120" y="300" font-size="11" fill="var(--chart-text)" text-anchor="end">total dampak</text>
<text x="140" y="320" font-size="11" fill="var(--c4)" font-weight="600" text-anchor="end">→ vec_sum / vec_norm</text>
<rect x="330" y="150" width="170" height="60" fill="var(--c4)" opacity="0.9"/>
<text x="415" y="172" font-size="11" fill="var(--chart-text)" text-anchor="middle">Lalu: operator matriks</text>
<text x="415" y="192" font-size="11" fill="var(--chart-text)" text-anchor="middle">decay / rank / neutralize</text>
<rect x="170" y="330" width="180" height="30" fill="var(--c1)" opacity="0.9"/>
<text x="260" y="350" font-size="11" fill="var(--chart-text)" text-anchor="middle">BARU jadi ekspresi alpha</text>
</g>
</svg>`;

export const wqb23: V2Lesson = {
  slug: "wqb23-vector-datafields",
  track: "WorldQuant Brain",
  module: "Data & Sinyal",
  title: "WQB23 — Vector Data Fields: Menambang Alpha dari Berita & Sentimen",
  estMinutes: 54,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Hari dengan tujuh headline",
      prose: [
        "Selasa pagi, satu emiten farmasi muncul di tujuh headline berbeda sebelum jam 10: hasil uji klinis positif, analis menaikkan target, rumor akuisisi, lalu dua bantahan, satu gugatan, dan satu tweet viral CEO. Harga bergerak liar sepanjang hari. Kamu ingin membangun alpha dari 'intensitas berita' hari itu — tetapi field data biasa hanya menyimpan SATU angka per emiten per hari. Tujuh headline tidak muat dalam satu sel.",
        "Inilah mengapa WorldQuant Brain punya vector data fields: field yang jumlah event-nya per hari per emiten BERVARIASI — disimpan sebagai vektor, bukan matriks. Field `nws12_afterhsz_1_minute` mencatat persentase perubahan harga dalam satu menit pertama setelah tiap rilis berita; dalam sehari bisa ada 3, 7, atau 20 entri untuk satu emiten. Matriks biasa akan membuang informasi ini; vektor menyimpannya.",
        "Twist-nya: kamu tidak bisa langsung memakai vektor itu di ekspresi alpha. SEMUA operator platform adalah operator matriks — mereka menuntut satu nilai per hari per emiten. Maka ada gerbang wajib: agregasi dulu dengan operator `vec_*` (misalnya `vec_count` untuk menghitung beritanya), BARU hasilnya boleh diolah dengan `rank`, `ts_decay_linear`, dan kawan-kawan. Melewati gerbang ini = error; memahaminya = membuka tambang sinyal berita dan sentimen.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan perbedaan vector vs matrix data fields dan kapan vektor dibutuhkan; (2) memilih operator `vec_*` yang tepat untuk tiap pertanyaan riset; (3) menulis ekspresi FASTEXPR dari field `nws12_` dan `scl15_` yang valid (agregasi dulu, baru operator matriks); (4) mengantisipasi masalah turnover mentah sinyal berita dan mengatasinya; (5) menjelaskan batas akses dataset konsultan untuk field sentimen.",
      ],
      tasks: [],
      note: {
        title: "Prasyarat ringkas",
        body: "Data fields adalah kolom data mentah platform (harga, volume, fundamental, berita) yang menjadi bahan ekspresi alpha. FASTEXPR adalah bahasa ekspresi platform: kamu merangkai operator (ts_decay_linear, rank, group_neutralize, trade_when) menjadi satu baris alpha. Aturan mainnya: ekspresi alpha harus menghasilkan matriks posisi — satu nilai per emiten per hari.",
      },
      reference: "Tujuh headline, satu sel: di sinilah vektor dibutuhkan.",
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Vektor, Matriks, dan Gerbang vec_*",
      tasks: [],
      prose: [
        "Definisi: vector data field adalah field yang jumlah event tercatatnya per hari per emiten bervariasi — sehingga disimpan sebagai vektor. Lawannya, matrix data field, punya tepat satu nilai per hari per emiten (seperti close, volume, assets). Contoh kanonis: dataset berita — satu emiten bisa punya 0, 3, atau 15 berita dalam sehari; memaksanya ke format matriks berarti membuang informasi.",
        "Gerbang wajibnya sederhana dan tidak bisa ditawar: karena hasil akhir ekspresi alpha HARUS matriks posisi dan semua operator platform adalah operator matriks, kamu WAJIB mengagregasi vektor menjadi satu nilai per hari per emiten dulu — dengan operator `vec_*` — sebelum memakai operator matriks apa pun. Urutannya: vector field → `vec_*` → matrix → `rank`/`ts_decay_linear`/`group_neutralize` → alpha.",
        "Kepribadian gerbang vec_*: ia adalah penerjemah di perbatasan dua dunia. Dunia vektor bicara 'banyak event'; dunia matriks bicara 'satu posisi'. Penerjemah yang buruk (agregasi yang salah) mengubah cerita datanya — memakai `vec_max` saat yang kamu butuhkan adalah `vec_count` sama dengan menyimpulkan 'hari ini beritanya positif' padahal yang benar 'hari ini beritanya BANYAK'.",
        "Empat belas operator agregasi resmi: `vec_avg` (rata-rata), `vec_choose(x, nth=k)` (ambil item ke-k), `vec_count` (jumlah elemen), `vec_ir` (mean/std dev vektor), `vec_kurtosis`, `vec_max`, `vec_min`, `vec_norm` (jumlah nilai absolut), `vec_percentage(x, percentage=0.5)` (persentil), `vec_powersum(x, constant=2)` (jumlah pangkat), `vec_range` (max−min), `vec_skewness`, `vec_stddev`, `vec_sum`. Contoh resmi juga menyebut `vec_median` sebagai alternatif representatif sentimen — ia tidak ada di tabel operator tetapi muncul di contoh dokumentasi, jadi perlakukan sebagai opsi yang sah dengan catatan ini.",
        "Kapan memakai vector fields: ketika pertanyaan risetmu inherently tentang EVENT — intensitas berita, sebaran sentimen harian, ekstrem reaksi pasar per berita. Bila pertanyaanmu tentang level harga atau volume harian biasa, matrix fields sudah cukup; jangan memvektorkan yang tidak perlu.",
      ],
      formula: String.raw`\text{vec\_ir}(x) = \frac{\text{mean}(x)}{\text{std}(x)}`,
      formulaNote: "vec_ir = information ratio di dalam satu vektor: rata-rata elemen dibagi standar deviasinya. x = vektor event satu emiten satu hari (misalnya 7 skor sentimen). Nilai tinggi = event-event hari itu searah dan konsisten; nilai rendah = campur aduk.",
      note: {
        title: "Intuisi",
        body: "Pikirkan vec_* sebagai 'fungsi ringkas': ia menjawab 'dari 7 headline ini, SATU angka apa yang paling mewakili harinya?' Jawabannya tergantung pertanyaanmu — tidak ada agregasi yang benar secara universal, hanya yang tepat untuk hipotesismu.",
      },
      reference: "Vektor → vec_* → matriks → operator matriks. Urutan ini tidak bisa dibalik.",
    },
    {
      id: "angka",
      eyebrow: "Langkah 3 · Angka",
      title: "Dua field nyata: nws12_ dan scl15_",
      prose: [
        "Field pertama: `nws12_afterhsz_1_minute` — persentase perubahan harga dalam satu menit pertama setelah rilis berita. Satu emiten, satu hari, lima berita: [+1,2%, −0,4%, +2,8%, +0,6%, −1,1%]. Hipotesis dokumentasi resmi: saat intensitas berita TINGGI, saham cenderung momentum; saat intensitas RENDAH, cenderung reversal. Untuk menguji ini kamu butuh 'jumlah berita' — `vec_count(nws12_afterhsz_120_min)` mengubah vektor perubahan harga menjadi hitungan kemunculan: 5.",
        "Dari hitungan itu kamu bisa membangun dua sisi: `rank(vec_count(nws12_afterhsz_120_min))` sebagai proksi intensitas, lalu momentum pada intensitas tinggi dan reversal pada intensitas rendah. Peringatan resmi yang penting: turnover mentah sinyal ini SANGAT tinggi — plot dokumentasi menunjukkan kadang menyentuh 200%. Wajib didiet dengan decay sebelum digabung ke alpha (lihat chart langkah 5).",
        "Field kedua: `scl15_d1_sentiment` — skor sentimen berbagai event dalam sehari. Contoh: AAPL satu hari punya 5 skor sentimen [0,6, 0,8, −0,2, 0,5, 0,7]. Karena kamu hanya bisa mengambil satu posisi per emiten, kamu butuh satu angka: `vec_avg(scl15_d1_sentiment)` = 0,48 sebagai representasi wajar sentimen hari itu — atau `vec_median` bila kamu khawatir outlier. Plot resmi: nilai rata-rata field ini padat di sekitar 15.000 dengan turnover ~130% — lagi-lagi wajib diet via `ts_rank` atau `ts_decay`.",
        "Batas akses yang jujur: field `scl15_` hanya untuk konsultan dengan akses dataset konsultan — bukan untuk semua pengguna. Jangan merancang riset di atas field yang tidak bisa kamu simulasikan; cek akses datasetmu dulu sebelum jatuh cinta pada idenya.",
        "Contoh ekspresi lengkap yang valid: `alpha = ts_decay_linear(rank(vec_count(nws12_afterhsz_120_min)), 10);` — baca dari dalam ke luar: hitung beritanya (vektor→matriks), rank cross-sectional, haluskan dengan decay 10 hari. Tiga langkah, tiga dunia: agregasi, normalisasi, smoothing.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“`vec_count` menghitung berita positif.” Salah — ia menghitung SEMUA elemen vektor tanpa peduli tanda. Vektor [+1,2%, −0,4%, +2,8%] → vec_count = 3, bukan 2. Kalau mau 'berita positif saja', filternya harus dilakukan sebelum agregasi pada level ekspresi, bukan di dalam vec_count.",
      },
      hints: [
        "Ingat: vec_* selalu menghasilkan matriks 1-nilai-per-hari — setelah itu kamu bebas memakai SEMUA operator matriks.",
      ],
      reference: "nws12_ = intensitas (diet wajib); scl15_ = sentimen (akses konsultan).",
    },
    {
      id: "lab-agregasi",
      eyebrow: "Langkah 4 · Lab",
      title: "Bangun agregator vec_* sendiri",
      prose: [
        "Tulis fungsi-fungsi Python yang meniru operator resmi: `vec_count`, `vec_avg`, `vec_sum`, `vec_max`, `vec_range`, `vec_stddev` — masing-masing menerima list (satu vektor = satu emiten satu hari) dan mengembalikan satu angka. Terapkan pada 4 'hari' data berita fiktif dan amati bagaimana tiap agregator 'bercerita' berbeda tentang hari yang sama.",
        "Eksperimen setelah selesai: hari ke-4 punya satu outlier ekstrem (+9,5%). Bandingkan `vec_avg` vs `vec_max` vs `vec_count` pada hari itu — agregator mana yang paling 'jujur' bila hipotesismu adalah intensitas? Mana yang paling jujur bila hipotesismu adalah euforia ekstrem? (Petunjuk: tidak ada jawaban tunggal — inilah mengapa pemilihan agregator adalah keputusan riset, bukan teknis.)",
      ],
      tasks: [
        { id: "t1", text: "Tulis 6 fungsi vec_* tiruan" },
        { id: "t2", text: "Agregasi 4 hari, bandingkan ceritanya" },
      ],
      expected: "hari1: count=3 avg=1.20 max=2.80\nhari4: count=4 avg=2.85 max=9.50 -> outlier mengubah avg, tidak mengubah count",
      note: {
        title: "Intuisi",
        body: "Perhatikan hari ke-4: vec_count tetap 4 (tidak peduli outlier), vec_avg melonjak ke 2,85 (diseret outlier), vec_max = 9,50 (hanya peduli ekstrem). Tiga angka, tiga cerita — dan ketiganya 'benar'. Pilihanmu di antara mereka adalah hipotesis risetmu yang sesungguhnya.",
      },
      hints: [
        "vec_range = max - min; vec_stddev pakai statistics.pstdev.",
        "Cetak dengan format f\"hari{i}: count={} avg={:.2f} max={:.2f}\".",
      ],
      code: {
        starter: "import statistics\n# vektor = % perubahan harga per berita, 1 emiten 1 hari. JANGAN UBAH.\nhari = {\n    1: [1.2, -0.4, 2.8],\n    2: [0.6],\n    3: [-1.1, -0.8, -1.5, -0.3],\n    4: [0.5, 0.9, 9.5, 0.5],\n}\n\n# TULIS KODEMU: 6 fungsi vec_* tiruan\ndef vec_count(x):\n    return\ndef vec_avg(x):\n    return\ndef vec_sum(x):\n    return\ndef vec_max(x):\n    return\ndef vec_range(x):\n    return\ndef vec_stddev(x):\n    return\n\nfor i, v in hari.items():\n    print(f\"hari{i}: count={vec_count(v)} avg={vec_avg(v):.2f} sum={vec_sum(v):.2f} max={vec_max(v):.2f} range={vec_range(v):.2f} std={vec_stddev(v):.2f}\")\n",
        lockLines: 8,
        solution: "import statistics\n# vektor = % perubahan harga per berita, 1 emiten 1 hari. JANGAN UBAH.\nhari = {\n    1: [1.2, -0.4, 2.8],\n    2: [0.6],\n    3: [-1.1, -0.8, -1.5, -0.3],\n    4: [0.5, 0.9, 9.5, 0.5],\n}\n\n# TULIS KODEMU: 6 fungsi vec_* tiruan\ndef vec_count(x):\n    return len(x)\ndef vec_avg(x):\n    return sum(x) / len(x)\ndef vec_sum(x):\n    return sum(x)\ndef vec_max(x):\n    return max(x)\ndef vec_range(x):\n    return max(x) - min(x)\ndef vec_stddev(x):\n    return statistics.pstdev(x)\n\nfor i, v in hari.items():\n    print(f\"hari{i}: count={vec_count(v)} avg={vec_avg(v):.2f} sum={vec_sum(v):.2f} max={vec_max(v):.2f} range={vec_range(v):.2f} std={vec_stddev(v):.2f}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "hari1 benar", msg: "count=3, avg=1.20, max=2.80.", pattern: "hari1: count=3 avg=1\\.20 sum=3\\.60 max=2\\.80" },
          { kind: "stdout_matches", task: "t2", label: "hari3 negatif semua", msg: "count=4, avg=-0.93, range=1.20.", pattern: "hari3: count=4 avg=-0\\.93 sum=-3\\.70 max=-0\\.30 range=1\\.20" },
          { kind: "stdout_matches", task: "t2", label: "hari4 outlier", msg: "avg terseret ke 2.85, count tetap 4.", pattern: "hari4: count=4 avg=2\\.85" }
        ],
      },
      reference: "Agregator = hipotesis risetmu dalam bentuk fungsi.",
    },
    {
      id: "chart",
      eyebrow: "Langkah 5 · Chart",
      title: "Membaca diet turnover sinyal berita",
      prose: [
        "Cara membaca: tiga batang = turnover sinyal `vec_count` pada tiga tahap pengolahan; garis merah putus-putus = batas submit 70%. Batang 'mentah' (~200%) menembus jauh di atas garis — sinyal ini TIDAK BISA disubmit apa adanya. Batang 'decay(10)' (~60%) turun di bawah garis; 'decay(20)' (~25%) semakin nyaman.",
        "Interpretasi: inilah pola universal sinyal event-driven — mentahnya selalu 'terlalu sibuk' karena event datang bergerombol dan tidak beraturan. Diet (decay) bukan kosmetik di sini; ia adalah syarat hidup. Perhatikan trade-off-nya: decay(20) menenangkan turnover tetapi juga menumpulkan respons terhadap berita hari ini — kamu menukar ketajaman dengan kelangsungan hidup.",
        "Catatan kejujuran: angka batang ini ilustratif, direkonstruksi dari deskripsi plot di dokumentasi resmi ('turnover mentah sangat tinggi, kadang menyentuh 200%') — bukan angka eksak dari plot tersebut. Polanya (mentah > batas ≫ setelah decay) yang terverifikasi, bukan angkanya.",
      ],
      figure: {
        svg: FIG_VEC_TURNOVER,
        alt: "Bar chart turnover vec_count: mentah ~200%, decay(10) ~60%, decay(20) ~25%; garis batas 70%.",
        caption: "Sinyal berita mentah menembus batas 70% — diet decay adalah syarat hidup, bukan kosmetik.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Turnover tinggi = sinyal kuat, jadi biarkan.” Salah fatal — turnover 200% berarti kamu membayar biaya dua kali lipat book setiap hari; margin-nya (lihat wqb22) akan negatif sebelum alpha sempat membuktikan apa pun. Di WQB, sinyal yang tidak bisa didiet adalah sinyal yang tidak bisa disubmit.",
      },
      reference: "Event-driven mentah selalu terlalu sibuk — diet dulu, kagum kemudian.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta: dari pertanyaan riset ke operator",
      prose: [
        "Skenario 1 — 'Seberapa RAMAI harinya?' → `vec_count`. Pertanyaan intensitas murni: jumlah event, tanpa peduli isinya. Contoh: hipotesis momentum-pada-intensitas-tinggi.",
        "Skenario 2 — 'Bagaimana SUASANA harinya?' → `vec_avg` (atau `vec_median` bila takut outlier). Satu angka representatif: sentimen tipikal, reaksi tipikal. Contoh: `vec_avg(scl15_d1_sentiment)`.",
        "Skenario 3 — 'Seberapa EKSTREM / BERAGAM harinya?' → `vec_max` / `vec_min` untuk ekstrem satu sisi, `vec_range` untuk rentang, `vec_stddev` / `vec_skewness` / `vec_kurtosis` untuk bentuk sebaran. Contoh: mendeteksi hari euforia (max tinggi) vs hari konsensus (stddev rendah).",
        "Skenario 4 — 'Seberapa BESAR total dampaknya?' → `vec_sum` (total bertanda) atau `vec_norm` (total nilai absolut — 'berapa banyak pergerakan, tanpa peduli arah'). Contoh: total guncangan berita harian sebagai proksi perhatian pasar.",
        "Setelah agregasi, SELALU lanjutkan ke operator matriks: `rank` untuk normalisasi cross-sectional, `ts_decay_linear` untuk diet turnover, `group_neutralize` bila perlu. Cara membaca figur: mulai dari kotak vektor di atas, jawab 'mau hitung apa?' di belah ketupat, ikuti panah ke operatornya, lalu WAJIB turun ke kotak operator matriks sebelum menjadi alpha.",
        "Aturan praktis 10 detik: vektor → tanya 'count, tipikal, ekstrem, atau total?' → vec_* → rank → decay → baru alpha. Tidak ada jalan pintas melewati vec_*.",
      ],
      figure: {
        svg: FIG_PETA_VEC,
        alt: "Flowchart: pertanyaan riset (banyaknya, tipikal, ekstrem, total) memetakan ke operator vec_* lalu ke operator matriks.",
        caption: "Empat pertanyaan, empat keluarga operator — lalu wajib lanjut ke operator matriks.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Peta ini sebenarnya peta HIPOTESIS: 'banyaknya event' vs 'suasana hari' adalah dua teori berbeda tentang bagaimana berita menggerakkan harga. Operator yang kamu pilih adalah teorimu yang dieksekusi — jadi pilihlah dengan sadar, bukan karena 'kelihatannya bagus'.",
      },
      reference: "Count, tipikal, ekstrem, total — lalu rank, decay, alpha.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Kasus: sinyal sentimen yang 'terlalu bagus'",
      prose: [
        "Seorang konsultan membangun alpha dari `vec_avg(scl15_d1_sentiment)`: long saat sentimen sangat positif, short saat sangat negatif. Hasil simulasi: Sharpe 2,3, fitness 1,9, turnover 130%. Ia ingin langsung submit. Tulis evaluasimu (lanjut / diet / buang + satu kalimat alasan) SEBELUM membaca pembahasan.",
        "Pembahasan: DIET DULU. Sharpe 2,3 memang memukau, tetapi turnover 130% gagal gerbang submit (< 70%) — tombol submit bahkan tidak akan lolos. Satu kalimat: 'Sinyal sentimen mentahnya terlalu sibuk (TO 130% > 70%); terapkan ts_decay_linear 10–20 hari dan ukur ulang — bila Sharpe bertahan di atas 1,25 setelah diet, barulah kandidat submit.' Pelajaran: angka bagus dengan turnover gagal gerbang = angka yang belum selesai dimasak.",
        "Variasi: setelah decay(15), turnover turun ke 45% tetapi Sharpe ikut turun ke 1,1 (di bawah 1,25). Vonis baru: TAHAN/REWORK — dietnya membunuh sinyalnya, artinya edge-nya memang hidup dari frekuensi trading yang tidak sustainable. Ini sinyal untuk kembali ke hipotesis: mungkin agregatornya salah (coba vec_count sebagai intensitas, bukan vec_avg sebagai arah), bukan decay-nya yang salah.",
        "Catatan kedua: sebelum semua ini, verifikasi akses — bila kamu bukan konsultan dengan akses dataset konsultan, field scl15_ tidak bisa kamu simulasikan sama sekali. Riset di atas field yang tidak accessible = riset fiksi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Kasus ini adalah versi WQB dari 'model bagus, data tidak accessible' di dunia kerja: analis membangun model di atas data yang tidak dimiliki tim produksi. Selalu verifikasi akses data SEBELUM optimasi — urutan yang salah membuang minggu kerja.",
      },
      reference: "Turnover gagal gerbang = masakan belum matang, seenak apa pun bumbunya.",
    },
    {
      id: "lab-rezim",
      eyebrow: "Langkah 8 · Lab",
      title: "Lab rezim: momentum saat ramai, reversal saat sepi",
      prose: [
        "Implementasikan hipotesis dokumentasi resmi: intensitas berita tinggi → momentum; intensitas rendah → reversal. Diberikan deret harian `intensitas` (vec_count) dan `ret_1d` (return 1 hari ke depan, dalam %). Hitung median intensitas sebagai ambang; pada hari intensitas > median, sinyal = +rank(intensitas) (momentum); pada hari ≤ median, sinyal = −rank(intensitas) (reversal). Cetak korelasi sinyal vs return (IC harian versi sederhana).",
        "Eksperimen setelah selesai: ganti ambang median menjadi persentil 75 — bagaimana IC-nya berubah? Hipotesis mana yang 'menang' di data fiktif ini, dan mengapa hasilnya tidak bisa digeneralisasi ke data nyata? (Petunjuk: 20 hari data fiktif = noise; di sinilah overfitting dimulai.)",
      ],
      tasks: [
        { id: "t1", text: "Bagi rezim ramai/sepi dari median intensitas" },
        { id: "t2", text: "Bangun sinyal rezim, hitung korelasinya" },
      ],
      expected: "ambang(median)=5.5\nIC sinyal rezim = 0.69 (fiktif)",
      note: {
        title: "Intuisi",
        body: "Lab ini meniru 'otak' strategi berita: bukan satu sinyal, melainkan DUA sinyal yang diaktifkan bergantian oleh rezim intensitas. Di FASTEXPR asli, pola 'saklar rezim' seperti ini bisa ditulis dengan perkalian kondisional — tetapi ingat, di platform sungguhan kamu tetap harus melewati gerbang vec_* dulu.",
      },
      hints: [
        "rank manual: urutan nilai dibagi banyaknya hari (pakai sorted + index).",
        "korelasi Pearson: cov/(std1*std2); pakai statistics.mean/pstdev.",
      ],
      code: {
        starter: "import statistics\n# intensitas harian (vec_count) & return 1-hari ke depan (%). FIKTIF. JANGAN UBAH.\nintensitas = [3, 8, 2, 9, 4, 7, 1, 10, 5, 6, 2, 8, 3, 9, 4, 7, 1, 6, 5, 8]\nret_1d      = [0.4, 0.9, -0.5, 1.1, -0.3, 0.7, -0.6, 1.3, 0.2, -0.4, -0.5, 0.8, 0.3, 1.0, -0.2, 0.6, -0.7, -0.3, 0.1, 0.9]\n\n# TULIS KODEMU\nn = len(intensitas)\nambang =  # median intensitas\nperingkat = {}  # nilai -> rank 0..1\nsinyal = []  # momentum bila > ambang, reversal bila <= ambang\nfor i in range(n):\n    pass\n\ndef korel(a, b):\n    ma, mb = statistics.mean(a), statistics.mean(b)\n    cov = sum((x - ma) * (y - mb) for x, y in zip(a, b)) / n\n    return cov / (statistics.pstdev(a) * statistics.pstdev(b))\n\nprint(f\"ambang(median)={ambang}\")\nprint(f\"IC sinyal rezim = {korel(sinyal, ret_1d):.2f} (fiktif)\")\n",
        lockLines: 3,
        solution: "import statistics\n# intensitas harian (vec_count) & return 1-hari ke depan (%). FIKTIF. JANGAN UBAH.\nintensitas = [3, 8, 2, 9, 4, 7, 1, 10, 5, 6, 2, 8, 3, 9, 4, 7, 1, 6, 5, 8]\nret_1d      = [0.4, 0.9, -0.5, 1.1, -0.3, 0.7, -0.6, 1.3, 0.2, -0.4, -0.5, 0.8, 0.3, 1.0, -0.2, 0.6, -0.7, -0.3, 0.1, 0.9]\n\n# TULIS KODEMU\nn = len(intensitas)\nambang = statistics.median(intensitas)\nurut = sorted(intensitas)\nperingkat = {v: (urut.index(v) + 1) / n for v in set(intensitas)}\nsinyal = []\nfor i in range(n):\n    r = peringkat[intensitas[i]]\n    sinyal.append(r if intensitas[i] > ambang else -r)\n\ndef korel(a, b):\n    ma, mb = statistics.mean(a), statistics.mean(b)\n    cov = sum((x - ma) * (y - mb) for x, y in zip(a, b)) / n\n    return cov / (statistics.pstdev(a) * statistics.pstdev(b))\n\nprint(f\"ambang(median)={ambang}\")\nprint(f\"IC sinyal rezim = {korel(sinyal, ret_1d):.2f} (fiktif)\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "ambang median = 6", msg: "Median 20 nilai intensitas = 5.5? hitung: sorted tengah = (5+6)/2.", pattern: "ambang\\(median\\)=5\\.5" },
          { kind: "stdout_matches", task: "t2", label: "IC tercetak", msg: "Korelasi sinyal rezim vs return tercetak.", pattern: "IC sinyal rezim = " }
        ],
      },
      reference: "Saklar rezim: intensitas memilih sinyal mana yang aktif.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Refleksi tambang berita",
      prose: [
        "Lima pertanyaan — jawab dari gerbang vec_*, bukan dari hafalan.",
      ],
      tasks: [],
      summary: [
        "Vector field = jumlah event/hari/emiten bervariasi; matrix = satu nilai.",
        "Gerbang wajib: vec_* dulu (vektor→matriks), baru operator matriks.",
        "vec_count = intensitas; vec_avg/vec_median = suasana; vec_max/range/std = ekstrem/sebaran.",
        "Sinyal berita mentah turnover-nya buas (~200%) — diet decay adalah syarat submit.",
        "nws12_ untuk intensitas (semua), scl15_ sentimen (hanya akses konsultan).",
        "ts_backfill tercatat sebagai operator resmi; perilaku rinci di luar sumber yang dibuka — verifikasi di dokumentasi operator sebelum dipakai.",
      ],
      quiz: [
        {
          q: "Mengapa ekspresi `rank(nws12_afterhsz_1_minute)` tidak valid?",
          options: [
            { text: "Field vektor harus diagregasi vec_* dulu sebelum operator matriks", why: "Tepat — semua operator platform adalah operator matriks.", correct: true },
            { text: "rank tidak boleh dipakai pada data berita", why: "rank boleh — tetapi hanya SETELAH agregasi vec_*." },
            { text: "Field nws12_ sudah berupa matriks", why: "Terbalik — ia vector field, itu inti masalahnya." },
            { text: "Ekspresi alpha tidak boleh memakai field berita", why: "Boleh — justru itu gunanya vector fields." }
          ],
        },
        {
          q: "Hipotesis 'saham dengan BANYAK berita hari ini cenderung momentum'. Operator yang tepat?",
          options: [
            { text: "vec_count — menghitung banyaknya event", why: "Benar — intensitas = count.", correct: true },
            { text: "vec_avg — rata-rata perubahan harga per berita", why: "Itu mengukur arah/reaksi tipikal, bukan banyaknya." },
            { text: "vec_max — berita paling ekstrem", why: "Itu euforia ekstrem, bukan intensitas." },
            { text: "vec_sum — total perubahan harga", why: "Itu total dampak bertanda, bukan hitungan event." }
          ],
        },
        {
          q: "Sinyal vec_count mentah turnover-nya 200%. Tindakan benar?",
          options: [
            { text: "Diet dengan ts_decay_linear lalu ukur ulang sebelum submit", why: "Tepat — 200% gagal gerbang 70%.", correct: true },
            { text: "Langsung submit — turnover tinggi = sinyal kuat", why: "Gagal gerbang otomatis; margin pun akan negatif." },
            { text: "Buang — sinyal berita tidak pernah bisa didiet", why: "Dokumentasi resmi justru mewajibkan diet, bukan membuang." },
            { text: "Naikkan delay ke 0 agar lebih responsif", why: "Delay 0 menaikkan turnover lebih jauh — arah yang salah." }
          ],
        },
        {
          q: "Batas akses field scl15_d1_sentiment?",
          options: [
            { text: "Hanya konsultan dengan akses dataset konsultan", why: "Benar — dinyatakan eksplisit di dokumentasi.", correct: true },
            { text: "Semua pengguna Bronze ke atas", why: "Tidak — aksesnya terbatas tier konsultan." },
            { text: "Hanya level Grand Master", why: "Batasnya 'akses dataset konsultan', bukan level Genius." },
            { text: "Tidak ada batas — field publik", why: "Salah — dokumentasi menulis ONLY FOR CONSULTANTS." }
          ],
        },
        {
          q: "Urutan ekspresi FASTEXPR yang valid untuk alpha berita?",
          options: [
            { text: "ts_decay_linear(rank(vec_count(nws12_afterhsz_120_min)), 10)", why: "Benar — agregasi → normalisasi → smoothing.", correct: true },
            { text: "vec_count(ts_decay_linear(nws12_afterhsz_120_min, 10))", why: "decay adalah operator matriks — tidak bisa menerima vektor." },
            { text: "vec_count(rank(nws12_afterhsz_120_min))", why: "Urutan terbalik — vec_* butuh vektor mentah sebagai input, bukan output rank.", correct: false },
            { text: "group_neutralize(nws12_afterhsz_120_min, sector)", why: "group_neutralize operator matriks — vektor mentah tidak bisa masuk." }
          ],
        }
      ],
      reference: "Gerbang vec_* = perbatasan dua dunia yang tidak bisa dilewati diam-diam.",
    },
  ],
};
