import type { V2Lesson } from "../lib/types";

const FIG_IC_DECAY = `<svg viewBox="0 0 600 330" role="img" aria-label="Bar chart peluruhan IC terhadap holding period.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">IC sinyal B vs holding period (hari)</text>
<line x1="60" y1="40" x2="60" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<line x1="60" y1="260" x2="580" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="30" y="44" font-size="10" fill="var(--chart-text)">0.6</text>
<text x="30" y="112" font-size="10" fill="var(--chart-text)">0.4</text>
<text x="30" y="182" font-size="10" fill="var(--chart-text)">0.2</text>
<text x="42" y="262" font-size="10" fill="var(--chart-text)">0</text>
<rect x="100" y="58" width="70" height="202" fill="var(--c1)" opacity="0.9"/>
<text x="135" y="50" font-size="11" fill="var(--chart-text)" text-anchor="middle">0.59</text>
<rect x="210" y="126" width="70" height="134" fill="var(--c1)" opacity="0.9"/>
<text x="245" y="118" font-size="11" fill="var(--chart-text)" text-anchor="middle">0.31</text>
<rect x="320" y="192" width="70" height="68" fill="var(--c2)" opacity="0.9"/>
<text x="355" y="184" font-size="11" fill="var(--chart-text)" text-anchor="middle">0.12</text>
<rect x="430" y="236" width="70" height="24" fill="var(--c2)" opacity="0.9"/>
<text x="465" y="228" font-size="11" fill="var(--chart-text)" text-anchor="middle">0.03</text>
<text x="135" y="280" font-size="11" fill="var(--chart-text)" text-anchor="middle">1 hari</text>
<text x="245" y="280" font-size="11" fill="var(--chart-text)" text-anchor="middle">5 hari</text>
<text x="355" y="280" font-size="11" fill="var(--chart-text)" text-anchor="middle">10 hari</text>
<text x="465" y="280" font-size="11" fill="var(--chart-text)" text-anchor="middle">20 hari</text>
<line x1="60" y1="192" x2="580" y2="192" stroke="var(--c3)" stroke-width="1" stroke-dasharray="5 4"/>
<text x="566" y="186" font-size="10" fill="var(--c3)" text-anchor="end">ambang 0.10</text>
</g>
</svg>`;

export const wqb26: V2Lesson = {
  slug: "wqb26-python-riset-quant",
  track: "WorldQuant Brain",
  module: "Riset Kuantitatif",
  title: "WQB26 — Python untuk Riset Quant: Prototyping Sebelum FastExpression",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Sinyal dengan IC 0,85 yang gagal di pintu pertama",
      prose: [
        "Rudi, konsultan tahun pertama, menghabiskan akhir pekan menatap spreadsheet. Ia punya dua kandidat sinyal untuk diuji di Brain. Sinyal A: korelasi rank terhadap return ke depan = 0,85 — angka yang belum pernah ia lihat sekencang itu di data mainannya. Sinyal B: hanya 0,59. Rudi sudah membayangkan A melenggang jadi alpha perdananya.",
        "Senin pagi, sebelum mengetik satu baris FastExpression pun, ia menjalankan ritual kecil yang diajarkan seniornya: hitung estimasi turnover dari kedua sinyal di Python. Hasilnya: sinyal A turnover 162%. Sinyal B: 13%. Rudi menatap angka 1,62 itu lama. Ia tahu aturannya — turnover di atas 70% berarti tidak boleh disubmit apa adanya. Sinyal A yang juara di kertas, mati di pintu pertama.",
        "Twist-nya: kegagalan itu justru kemenangan. Kalau Rudi langsung menghabiskan dua hari menerjemahkan sinyal A ke FastExpression, menjalankan simulasi, lalu menatap hasil BUANG di triase, ia kehilangan dua hari untuk jawaban yang Python berikan dalam dua menit. Prototyping di luar platform bukan kemewahan — ia saringan termurah yang dimiliki seorang peneliti.",
        "Lesson ini mengajarkan workflow itu: eksplorasi field di Python, prototipe sinyal, ukur IC, decay, dan estimasi turnover — sebelum satu baris pun masuk ke Brain.",
      ],
      tasks: [],
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga angka sebelum kamu menyentuh platform",
      prose: [
        "Workflow riset yang sehat punya urutan: (1) eksplorasi data field di Python — distribusi, nilai hilang, outlier; (2) prototipe sinyal sebagai deret angka biasa; (3) ukur tiga hal: IC, decay, turnover. Baru setelah ketiganya masuk akal, sinyal diterjemahkan ke FastExpression untuk simulasi resmi di Brain.",
        "IC (Information Coefficient) adalah korelasi rank (Spearman) antara nilai sinyal hari ini dan return ke depan. Rank dipakai, bukan Pearson, karena yang penting urutan prediksi — bukan skala angkanya. IC 0,03–0,10 di data nyata sudah lumayan; di atas 0,30 patut dicurigai (biasanya bocor informasi masa depan).",
        "Decay menjawab: berapa lama prediksi sinyal bertahan? Hitung IC terhadap return 1 hari, 5 hari, 10 hari, 20 hari ke depan. Sinyal yang IC-nya runtuh setelah 1 hari butuh rebalance agresif — dan rebalance agresif menaikkan turnover. Dua angka ini selalu dibaca berpasangan.",
        "Estimasi turnover dari prototipe: rata-rata perubahan absolut sinyal dibagi rata-rata nilai absolutnya. Ini BUKAN turnover simulasi resmi (yang dihitung dari perubahan posisi aktual), tetapi aproksimasi yang cukup untuk menyaring: kalau estimasinya sudah di atas 70%, versi FastExpression-nya hampir pasti gagal gerbang submit.",
      ],
      formula: String.raw`IC = \rho = 1 - \frac{6\sum d_i^2}{n(n^2 - 1)} \qquad TO_{est} = \frac{\overline{|\Delta s|}}{\overline{|s|}}`,
      formulaNote: "ρ (rho) = korelasi rank Spearman; d_i = selisih peringkat sinyal vs return pada observasi ke-i; n = banyak observasi. TO_est = estimasi turnover; Δs = perubahan sinyal antar periode; |s| = nilai absolut sinyal. Sinyal vektor nol tidak boleh dipakai sebagai pembagi — standarkan dulu bila perlu.",
      note: {
        title: "Sering salah", type: "pitfall",
        body: "“IC tinggi = alpha bagus.” IC mengukur arah prediksi, bukan biaya mencapainya. Sinyal A di cerita punya IC 0,85 dan turnover 162% — ia memprediksi dengan brilian sinyal yang tidak bisa dieksekusi. Alpha yang baik = IC layak DENGAN turnover yang lolos gerbang 70%.",
      },
      tasks: [],
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 3 · Konsep",
      title: "Dua pembunuh senyap: look-ahead dan overfitting",
      prose: [
        "Look-ahead bias adalah dosa paling mahal di prototyping: sinyal yang tanpa sadar memakai informasi masa depan. Contoh klasik: menstandarkan sinyal memakai mean seluruh periode (termasuk masa depan), atau memakai field yang direvisi (reported) padahal yang tersedia saat itu adalah angka awal. Gejalanya selalu sama: IC yang terlalu bagus untuk jadi kenyataan — di atas 0,30 di data harian, curigai dulu, rayakan kemudian.",
        "Aturan praktisnya: setiap baris kode prototipe harus bisa menjawab “data apa saja yang dipakai untuk menghitung titik ini?” Kalau jawabannya mencakup apa pun setelah titik waktu keputusan, itu look-ahead. Uji termudah: geser sinyal mundur satu periode — kalau IC runtuh, sinyalmu kemarin memakai hari ini.",
        "Overfitting di prototyping muncul saat kamu mengutak-atik parameter sampai IC sampel naik, lalu menganggap angka itu janji. Di Brain, janji itu diuji oleh simulasi out-of-sample dan self-correlation. Di Python, padanannya: split waktu (train di paruh awal, uji di paruh akhir) dan jangan pernah memilih parameter berdasarkan paruh uji. Parameter yang dipilih dari paruh uji = parameter yang sudah “melihat” jawabannya.",
        "Satu lagi: purge. Return ke depan untuk observasi yang berdekatan saling tumpang tindih (return 5-hari dari hari ke-1 dan hari ke-2 berbagi 4 hari). Saat split waktu, sisakan jeda (embargo) sepanjang horizon return di batas split — kalau tidak, “out-of-sample”-mu bocor lewat tumpang tindih.",
      ],
      note: {
        title: "Sering salah", type: "pitfall",
        body: "“Sudah split train-test, berarti aman dari overfitting.” Split waktu tanpa embargo di batasnya bukan split yang jujur bila return-nya multi-hari. Dan memilih 1 dari 20 varian parameter berdasarkan skor test = 20 kali kesempatan beruntung — itu selection bias, bukan validasi.",
      },
      tasks: [],
    },
    {
      id: "lab-sinyal",
      eyebrow: "Langkah 4 · Lab",
      title: "Vonis dua sinyal: tulis pemeriksa prototipe",
      prose: [
        "Tulis tiga fungsi: `fwd_returns(p)` — return satu periode ke depan; `spearman(x, y)` — korelasi rank (tanpa library statistik); `turnover(s)` — rata-rata |Δs| dibagi rata-rata |s|.",
        "Terapkan pada dua kandidat dari cerita Rudi. Aturan vonisnya: LAYAK bila IC ≥ 0,03 DAN turnover ≤ 0,70; selain itu TIDAK. Cetak hasilnya persis dengan format contoh.",
        "Eksperimen setelah selesai: ubah ambang IC menjadi 0,50 — sinyal B ikut gugur. Tanyakan pada dirimu: apakah ambang 0,50 bijak untuk data mainan 11 observasi, atau kamu sedang menghukum sinyal yang jujur? (Petunjuk: di data nyata IC 0,05 pun bisa jadi alpha bila turnover-nya 15%.)",
      ],
      tasks: [
        { id: "t1", text: "Tulis fwd_returns, spearman, dan turnover" },
        { id: "t2", text: "Hitung IC & turnover kedua sinyal, cetak vonisnya" },
      ],
      expected: "Sinyal A: IC=0.8455 turnover=1.6200 -> TIDAK\nSinyal B: IC=0.5909 turnover=0.1333 -> LAYAK",
      note: {
        title: "Sering salah", type: "pitfall",
        body: "“Sinyal A IC-nya 0,85 — sayang dibuang.” Tidak dibuang — ditahan. Ingat bahasa triase: turnover di atas 70% berarti TIDAK BOLEH DISUBMIT apa adanya; “TIDAK” di sini = simpan, diet turnover (mis. smoothing sinyal), uji ulang. Vonis ini soal antrean hari ini, bukan nasib ide selamanya.",
      },
      hints: [
        "Spearman: ubah tiap deret jadi peringkat 1..n, lalu korelasi Pearson atas peringkatnya.",
        "turnover: mean(|s[i]-s[i-1]|) / mean(|s[i]|) — tanpa library, tulis loop biasa.",
      ],
      code: {
        starter: "# 12 harga penutupan + 2 kandidat sinyal. JANGAN UBAH.\nprices = [100,102,101,103,105,104,106,108,107,110,109,112]\nsigA = [0.5,-0.4,0.6,0.4,-0.5,0.5,0.6,-0.3,0.7,-0.4,0.6]\nsigB = [0.3,0.25,0.35,0.3,0.28,0.32,0.36,0.34,0.38,0.35,0.4]\n\n# TULIS KODEMU\ndef fwd_returns(p):\n    return\ndef spearman(x, y):\n    return\ndef turnover(s):\n    return\n\nrets = fwd_returns(prices)\nfor nama, s in [(\"A\", sigA), (\"B\", sigB)]:\n    ic = spearman(s, rets)\n    to = turnover(s)\n    vonis = \"LAYAK\" if (ic >= 0.03 and to <= 0.70) else \"TIDAK\"\n    print(f\"Sinyal {nama}: IC={ic:.4f} turnover={to:.4f} -> {vonis}\")\n",
        lockLines: 4,
        solution: "# 12 harga penutupan + 2 kandidat sinyal. JANGAN UBAH.\nprices = [100,102,101,103,105,104,106,108,107,110,109,112]\nsigA = [0.5,-0.4,0.6,0.4,-0.5,0.5,0.6,-0.3,0.7,-0.4,0.6]\nsigB = [0.3,0.25,0.35,0.3,0.28,0.32,0.36,0.34,0.38,0.35,0.4]\n\n# TULIS KODEMU\ndef fwd_returns(p):\n    return [(p[i+1]-p[i])/p[i] for i in range(len(p)-1)]\ndef spearman(x, y):\n    def ranks(v):\n        order = sorted(range(len(v)), key=lambda i: v[i])\n        r = [0]*len(v)\n        for pos, i in enumerate(order):\n            r[i] = pos+1\n        return r\n    rx, ry = ranks(x), ranks(y)\n    n = len(x)\n    mx, my = sum(rx)/n, sum(ry)/n\n    num = sum((a-mx)*(b-my) for a, b in zip(rx, ry))\n    den = (sum((a-mx)**2 for a in rx)*sum((b-my)**2 for b in ry))**0.5\n    return num/den if den else 0.0\ndef turnover(s):\n    chg = sum(abs(s[i]-s[i-1]) for i in range(1, len(s)))/(len(s)-1)\n    lvl = sum(abs(v) for v in s)/len(s)\n    return chg/lvl\n\nrets = fwd_returns(prices)\nicA, toA = spearman(sigA, rets), turnover(sigA)\nicB, toB = spearman(sigB, rets), turnover(sigB)\nfor nama, ic, to in [(\"A\", icA, toA), (\"B\", icB, toB)]:\n    vonis = \"LAYAK\" if (ic >= 0.03 and to <= 0.70) else \"TIDAK\"\n    print(f\"Sinyal {nama}: IC={ic:.4f} turnover={to:.4f} -> {vonis}\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "icA", value: 0.8455, tol: 0.001, label: "`icA` sekitar 0,8455", msg: "Korelasi rank sinyal A vs return ke depan." },
          { kind: "equal", task: "t1", name: "toA", value: 1.62, tol: 0.01, label: "`toA` sekitar 1,62", msg: "Sinyal A berubah-ubah liar: turnover jauh di atas 70%." },
          { kind: "equal", task: "t2", name: "icB", value: 0.5909, tol: 0.001, label: "`icB` sekitar 0,5909", msg: "Korelasi rank sinyal B vs return ke depan." },
          { kind: "equal", task: "t2", name: "toB", value: 0.1333, tol: 0.001, label: "`toB` sekitar 0,1333", msg: "Sinyal B halus: turnover rendah." },
          { kind: "stdout_matches", task: "t2", label: "Vonis sinyal A = TIDAK", msg: "IC hebat tapi turnover 162% — tidak boleh submit apa adanya.", pattern: "Sinyal A: IC=0\\.8455 turnover=1\\.6200 -> TIDAK" },
          { kind: "stdout_matches", task: "t2", label: "Vonis sinyal B = LAYAK", msg: "IC layak dan turnover 13% — boleh diterjemahkan ke FastExpression.", pattern: "Sinyal B: IC=0\\.5909 turnover=0\\.1333 -> LAYAK" },
        ],
      },
      reference: "Ukur dulu di Python, bayar mahal kemudian di platform — kalau memang layak.",
    },
    {
      id: "chart",
      eyebrow: "Langkah 5 · Chart",
      title: "Membaca peluruhan: IC vs holding period",
      prose: [
        "Chart ini memakai sinyal B dari lab: IC dihitung terhadap return 1, 5, 10, dan 20 hari ke depan.",
        "Cara membaca: sumbu X = holding period (berapa lama posisi ditahan); tinggi batang = IC sinyal terhadap return sepanjang periode itu; garis putus-putus = ambang praktis 0,10.",
        "Interpretasi: IC meluruh dari 0,59 (1 hari) ke 0,03 (20 hari) — sinyal ini berumur pendek. Ia hanya masuk akal untuk strategi rebalance cepat; memaksanya jadi sinyal 20-harian berarti trading noise. Dan ingat pasangan abadinya: rebalance cepat = turnover tinggi — dua angka ini selalu dinegosiasikan bersama, tidak pernah sendiri-sendiri.",
      ],
      figure: { svg: FIG_IC_DECAY, alt: "Bar chart IC meluruh dari 0,59 ke 0,03 seiring holding period", caption: "IC sinyal B meluruh terhadap holding period — sinyal berumur pendek." },
      tasks: [],
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta: sinyal prototipe diapakan?",
      prose: [
        "Skenario 1 — IC ≥ 0,03 dan turnover ≤ 70%: terjemahkan ke FastExpression, uji di Brain. Prototipe lolos saringan termurah.",
        "Skenario 2 — IC tinggi tetapi turnover > 70%: TAHAN. Coba smoothing (rata-rata bergerak atas sinyal) atau kurangi frekuensi rebalance, lalu ukur ulang. Jangan submit apa adanya.",
        "Skenario 3 — IC di bawah 0,03 tetapi turnover sangat rendah: jangan langsung dibuang — coba varian (netralisasi sektor, delay berbeda). Sinyal murah yang lemah kadang jadi bahan diversifikasi.",
        "Skenario 4 — IC di atas 0,30 di data harian: curigai look-ahead dulu sebelum merayakan. Audit titik waktu setiap komponen, geser sinyal satu periode, lihat apakah IC bertahan.",
        "Skenario 5 — IC bagus di train, runtuh di paruh akhir (split waktu): overfitting. Sederhanakan sinyal atau terima bahwa ia tidak general.",
        "Aturan 10 detik: IC layak? Turnover lolos? Bukan look-ahead? Tahan uji waktu? Empat ya = terjemahkan; satu tidak = kembali ke meja Python.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Tiga sinyal di meja Rudi",
      prose: [
        "Setelah lab, Rudi memprototipe tiga sinyal baru atas 20 hari data. Hasil pengukurannya: Sinyal X — IC 0,045, turnover 0,52. Sinyal Y — IC 0,012, turnover 0,18. Sinyal Z — IC 0,41, turnover 0,44.",
        "Pertanyaan 1: sinyal mana yang langsung layak diterjemahkan ke FastExpression menurut aturan vonis lab (IC ≥ 0,03 dan turnover ≤ 0,70)?",
        "Pertanyaan 2: sinyal mana yang paling mencurigakan, dan apa audit pertama yang harus dilakukan?",
        "Pertanyaan 3: untuk sinyal Y, apa langkah prototipe berikutnya yang paling masuk akal — buang, atau coba varian?",
        "Pembahasan: (1) Sinyal X — 0,045 ≥ 0,03 dan 0,52 ≤ 0,70, lolos kedua gerbang. (2) Sinyal Z — IC 0,41 di data harian terlalu bagus; audit look-ahead dulu (cek titik waktu komponen, geser satu periode). (3) Sinyal Y jangan langsung dibuang: turnover-nya murah (0,18), jadi ia kandidat varian — coba netralisasi atau delay lain sebelum memutuskan.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Refleksi prototipe",
      prose: [
        "Lima pertanyaan — jawab sebagai peneliti yang baru saja menghemat dua hari kerja sia-sia.",
      ],
      tasks: [],
      summary: [
        "Urutan riset: eksplorasi field → prototipe sinyal di Python → ukur IC, decay, turnover → baru FastExpression.",
        "IC = korelasi rank sinyal vs return ke depan; 0,03–0,10 di data nyata sudah lumayan; >0,30 patut dicurigai.",
        "Decay dan turnover dibaca berpasangan: sinyal berumur pendek menuntut rebalance cepat yang mahal.",
        "Estimasi turnover prototipe = mean(|Δs|)/mean(|s|); di atas 0,70 = tidak boleh submit apa adanya.",
        "Look-ahead: sinyal memakai info masa depan — gejalanya IC yang terlalu bagus; audit titik waktu tiap komponen.",
        "Overfitting: split waktu + embargo di batas split; jangan pilih parameter dari paruh uji.",
      ],
      quiz: [
        {
          q: "Kenapa IC dihitung sebagai korelasi rank (Spearman), bukan Pearson biasa?",
          options: [
            { text: "Karena yang penting urutan prediksi, bukan skala angkanya", why: "Tepat — alpha menang dari ranking yang benar, bukan dari besaran yang presisi.", correct: true },
            { text: "Karena Pearson tidak bisa dipakai untuk data return", why: "Bisa — tetapi Pearson sensitif pada outlier dan skala, rank lebih robust." },
            { text: "Karena Spearman selalu menghasilkan angka lebih besar", why: "Tidak — tidak ada jaminan begitu; ini soal makna, bukan besaran." },
            { text: "Karena regulator mewajibkan Spearman", why: "Tidak ada kewajiban semacam itu — ini pilihan metodologis." },
          ],
        },
        {
          q: "Sinyalmu IC 0,06 tetapi estimasi turnover 1,10. Keputusan yang benar?",
          options: [
            { text: "Tahan — coba smoothing/diet turnover lalu ukur ulang; jangan submit apa adanya", why: "Tepat — 1,10 > 0,70 berarti gagal gerbang submit; TAHAN bukan tiket submit.", correct: true },
            { text: "Submit saja — IC 0,06 sudah di atas ambang", why: "Salah — turnover di atas 70% = tidak boleh disubmit apa adanya." },
            { text: "Buang permanen — ide yang gagal turnover tidak ada harapan", why: "Terlalu jauh — diet turnover sering menyelamatkan struktur sinyal yang baik." },
            { text: "Naikkan ambang IC supaya sinyal ini lolos", why: "Mengubah ambang agar hasil cocok = mengarang vonis, bukan riset." },
          ],
        },
        {
          q: "IC sinyalmu 0,55 di data harian. Reaksi pertama yang paling sehat?",
          options: [
            { text: "Curigai look-ahead: audit titik waktu tiap komponen", why: "Tepat — angka setinggi itu di data harian hampir selalu bocor informasi masa depan.", correct: true },
            { text: "Langsung terjemahkan ke FastExpression dan submit", why: "Berbahaya — merayakan sebelum audit adalah cara tercepat membuang waktu simulasi." },
            { text: "Naikkan ukuran sampel supaya IC turun ke angka wajar", why: "Mengutak-atik data agar angka terlihat wajar = menutupi masalah, bukan menyelesaikannya." },
            { text: "Ganti ke korelasi Pearson agar angkanya lebih kecil", why: "Mengganti metrik agar hasil cocok = cherry-picking metodologi." },
          ],
        },
        {
          q: "Apa fungsi embargo (jeda) di batas split train-test?",
          options: [
            { text: "Mencegah kebocoran lewat return multi-hari yang tumpang tindih di batas split", why: "Tepat — tanpa jeda sepanjang horizon return, 'out-of-sample'-mu tidak jujur.", correct: true },
            { text: "Memberi waktu istirahat bagi peneliti sebelum evaluasi", why: "Bukan soal istirahat — ini soal kebocoran informasi antar split." },
            { text: "Mengurangi ukuran data test agar komputasi cepat", why: "Terbalik — embargo justru membuang sedikit data demi kejujuran." },
            { text: "Menstandarkan skala fitur antara train dan test", why: "Itu normalisasi, bukan embargo." },
          ],
        },
        {
          q: "Sinyal B (IC 0,59, turnover 0,13) vs sinyal A (IC 0,85, turnover 1,62). Mana yang diteruskan ke Brain?",
          options: [
            { text: "Sinyal B — lolos kedua gerbang; A ditahan untuk diet turnover", why: "Tepat — vonis lab: B LAYAK, A TIDAK (apa adanya).", correct: true },
            { text: "Sinyal A — IC 0,85 jauh lebih besar dari 0,59", why: "IC tanpa turnover = angka hampa; A gagal gerbang 70%." },
            { text: "Keduanya — biar simulasi yang memutuskan", why: "Itulah pemborosan yang ingin dihindari prototyping: dua menit vs dua hari." },
            { text: "Tidak keduanya — IC 0,59 terlalu kecil untuk alpha", why: "Di data nyata IC 0,05 pun bisa jadi alpha bila turnover-nya murah." },
          ],
        },
      ],
      reference: "Prototipe yang jujur menghemat simulasi yang mahal.",
    },
  ],
};
