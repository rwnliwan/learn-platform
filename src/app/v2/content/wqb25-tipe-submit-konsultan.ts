import type { V2Lesson } from "../lib/types";

const FIG_GENIUS = `<svg viewBox="0 0 600 320" role="img" aria-label="Grouped bar chart akses data dan operator per level Genius.">
<g font-family="var(--font-ui)">
<text x="16" y="22" font-size="13" fill="var(--chart-text)" font-weight="600">Akses per level Genius: data fields &amp; operator (%)</text>
<line x1="60" y1="40" x2="60" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<line x1="60" y1="260" x2="580" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="30" y="80" font-size="10" fill="var(--chart-text)">100</text>
<text x="36" y="150" font-size="10" fill="var(--chart-text)">50</text>
<text x="42" y="258" font-size="10" fill="var(--chart-text)">0</text>
<rect x="90" y="150" width="44" height="110" fill="var(--c1)" opacity="0.85"/>
<rect x="138" y="161" width="44" height="99" fill="var(--c2)" opacity="0.85"/>
<text x="136" y="278" font-size="11" fill="var(--chart-text)" text-anchor="middle">Gold</text>
<text x="112" y="144" font-size="10" fill="var(--chart-text)" text-anchor="middle">50</text>
<text x="160" y="155" font-size="10" fill="var(--chart-text)" text-anchor="middle">45</text>
<rect x="220" y="128" width="44" height="132" fill="var(--c1)" opacity="0.85"/>
<rect x="268" y="141" width="44" height="119" fill="var(--c2)" opacity="0.85"/>
<text x="266" y="278" font-size="11" fill="var(--chart-text)" text-anchor="middle">Expert</text>
<text x="242" y="122" font-size="10" fill="var(--chart-text)" text-anchor="middle">61</text>
<text x="290" y="135" font-size="10" fill="var(--chart-text)" text-anchor="middle">63</text>
<rect x="350" y="94" width="44" height="166" fill="var(--c1)" opacity="0.85"/>
<rect x="398" y="94" width="44" height="166" fill="var(--c2)" opacity="0.85"/>
<text x="396" y="278" font-size="11" fill="var(--chart-text)" text-anchor="middle">Master</text>
<text x="372" y="88" font-size="10" fill="var(--chart-text)" text-anchor="middle">78</text>
<text x="420" y="88" font-size="10" fill="var(--chart-text)" text-anchor="middle">78</text>
<rect x="480" y="50" width="44" height="210" fill="var(--c1)" opacity="0.85"/>
<rect x="528" y="50" width="44" height="210" fill="var(--c2)" opacity="0.85"/>
<text x="526" y="278" font-size="11" fill="var(--chart-text)" text-anchor="middle">Grand M.</text>
<text x="502" y="44" font-size="10" fill="var(--chart-text)" text-anchor="middle">100</text>
<text x="550" y="44" font-size="10" fill="var(--chart-text)" text-anchor="middle">100</text>
<rect x="90" y="296" width="12" height="12" fill="var(--c1)"/><text x="108" y="306" font-size="11" fill="var(--chart-text)">data fields</text>
<rect x="200" y="296" width="12" height="12" fill="var(--c2)"/><text x="218" y="306" font-size="11" fill="var(--chart-text)">operator</text>
</g>
</svg>`;

const FIG_PETA_TIPE = `<svg viewBox="0 0 520 400" role="img" aria-label="Flowchart pemilihan tipe submit.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Peta: alpha-mu tipe submit apa?</text>
<rect x="170" y="40" width="180" height="30" fill="var(--c1)" opacity="0.9"/>
<text x="260" y="60" font-size="12" fill="var(--chart-text)" text-anchor="middle">Alpha lolos gerbang submit</text>
<polygon points="260,82 370,116 260,150 150,116" fill="var(--c2)" opacity="0.9"/>
<text x="260" y="120" font-size="11" fill="var(--chart-text)" text-anchor="middle">Field dari 1 dataset saja?</text>
<text x="386" y="100" font-size="11" fill="var(--chart-text)">ya → ATOM</text>
<polygon points="260,162 370,196 260,230 150,196" fill="var(--c2)" opacity="0.9"/>
<text x="260" y="200" font-size="11" fill="var(--chart-text)" text-anchor="middle">Pyramid ≤ 2?</text>
<text x="386" y="178" font-size="11" fill="var(--chart-text)">ya → PYRAMID</text>
<polygon points="260,242 370,276 260,310 150,276" fill="var(--c2)" opacity="0.9"/>
<text x="260" y="280" font-size="11" fill="var(--chart-text)" text-anchor="middle">USA D1 + S≥1 + sederhana?</text>
<text x="386" y="258" font-size="11" fill="var(--chart-text)">ya → POWER POOL</text>
<rect x="170" y="322" width="180" height="30" fill="var(--c4)" opacity="0.9"/>
<text x="260" y="342" font-size="11" fill="var(--chart-text)" text-anchor="middle">tidak semua → SUBMIT REGULER</text>
<text x="260" y="372" font-size="11" fill="var(--chart-text)">Semua tipe = tergantung akses konsultan</text>
</g>
</svg>`;

export const wqb25: V2Lesson = {
  slug: "wqb25-tipe-submit-konsultan",
  track: "WorldQuant Brain",
  module: "Era Konsultan",
  title: "WQB25 — ATOM, Pyramid & Power Pool: Tipe Submit Era Konsultan",
  estMinutes: 56,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Konsultan dengan 40 alpha yang tersebar",
      prose: [
        "Seorang konsultan baru menatap dashboardnya dengan bangga: 40 alpha tersubmit — dari 12 dataset berbeda, 5 region, 9 operator per alpha rata-rata. Kompleks, canggih, mengesankan. Lalu ia membuka dashboard Genius: level Gold, Combined Alpha Performance biasa saja, dan notifikasi: '0 pyramid diformulasikan'. Empat puluh alpha, nol pyramid — seperti punya 40 tentara yang masing-masing perang sendirian.",
        "Di forum, ia membaca tentang konsultan lain: hanya 18 alpha, tetapi 6 pyramid (USA-D1-analyst, USA-D1-fundamental, EUR-D1-price-volume...), tiga di antaranya ATOM — alpha yang field-nya dari SATU dataset saja. Yang sederhana itu justru mendapat hak istimewa: boleh melewati IS Ladder Sharpe test. Dan yang masuk Power Pool dinilai dengan korelasi antar-sesama yang lebih ketat (≤ 0,5).",
        "Twist-nya: di era konsultan, kesederhanaan bukanlah keterbatasan — ia adalah STRATEGI. Sistemnya memberi reward pada alpha yang fokus (ATOM), terstruktur (Pyramid), dan disiplin (Power Pool). Konsultan 40-alpha yang 'canggih' itu kalah dari konsultan 18-alpha yang 'rapi' — bukan karena alpha-nya lebih jelek, melainkan karena portofolionya tidak punya arsitektur.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan kriteria ATOM, Pyramid Alpha, dan Power Pool Alpha; (2) menghitung pyramid sebuah alpha dan menentukan apakah ia Pyramid Alpha; (3) memeriksa kelayakan Power Pool dari 6 kriteria; (4) membaca tangga level Brain Genius dan implikasinya pada akses; (5) memilih tipe submit yang tepat untuk tiap alpha — dengan catatan jujur mana yang tergantung akses konsultan.",
      ],
      tasks: [],
      note: {
        title: "Prasyarat ringkas",
        body: "Self-correlation mengukur kemiripan PnL alphamu dengan alpha lain yang sudah kamu submit — batas umumnya < 0,7, dan platform menampilkan hingga 5 alpha paling berkorelasi. Strategi cadangan era konsultan berarti menahan submit sampai status konsultan jelas (agar alpha tidak 'terbuang' tanpa komisi), sambil menyiapkan stok terdiversifikasi per family/klaster independen sebagai cadangan submit harian pasca-acceptance.",
      },
      reference: "40 alpha tanpa arsitektur < 18 alpha dengan arsitektur.",
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "ATOM — Si Minimalis yang Dapat Hak Istimewa",
      prose: [
        "Definisi resmi: ATOM Alpha adalah alpha yang field-nya berasal dari HANYA 1 dataset. Field grouping dikecualikan dari hitungan dan tidak mendiskualifikasi: currency, country, exchange, sector, industry, subindustry, market — jadi alpha dari 1 dataset + group_neutralize(sector) tetap ATOM.",
        "Dua jebakan yang dinyatakan eksplisit di dokumentasi. Pertama: operator `inst_pnl` dihitung sebagai pemakaian dataset pv1 — jadi `inst_pnl(field_dari_dataset_non_pv1)` TIDAK memenuhi syarat ATOM (kamu memakai dua dataset tanpa sadar). Kedua: hak istimewanya spesifik — ATOM boleh MELEWATI IS Ladder Sharpe test, tetapi WAJIB lolos tes IS reguler dan 2Y Sharpe test. Bukan bebas tes; hanya bebas dari satu tangga.",
        "Kepribadian ATOM: ia adalah penulis haiku di dunia puisi epik. Satu dataset = satu ide yang murni. Mengapa platform memberi hak istimewa pada yang sederhana? Karena alpha satu-dataset lebih mudah dipahami, lebih mudah didiagnosis saat decay, dan kecil kemungkinan overfit dari interaksi antar-dataset yang tidak disadari. Kesederhanaan di sini adalah sinyal kualitas, bukan keterbatasan.",
        "Kapan mengincar ATOM: ketika hipotesismu memang bisa diekspresikan dengan satu dataset (misalnya murni price-volume, atau murni analyst revision). Jangan memaksakan ATOM dengan 'menyembunyikan' dataset kedua di dalam operator — pemeriksaannya menghitung dataset aktual, bukan niatmu.",
        "Catatan akses: seluruh tipe khusus di lesson ini (ATOM, Pyramid, Power Pool) dan program Brain Genius adalah fitur ERA KONSULTAN — tergantung pada akses/status konsultanmu. Bila kamu belum konsultan, perlakukan lesson ini sebagai peta jalan: pahami arsitekturnya sekarang, eksekusi saat aksesnya tiba.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“ATOM = alpha cupu untuk pemula.” Terbalik — ATOM adalah alpha yang PERCAYA DIRI: idenya cukup kuat untuk berdiri di atas satu dataset saja. Banyak alpha 'canggih' multi-dataset sebenarnya menyembunyikan satu ide lemah di balik kompleksitas. Tes kejujurannya: bisakah idemu dijelaskan dalam satu kalimat tanpa menyebut dataset kedua?",
      },
      hints: [
        "Cek ATOM cepat: list semua field non-grouping → kelompokkan per dataset → harus tepat 1 kelompok.",
      ],
      reference: "Satu dataset, satu ide, satu hak istimewa.",
    },
    {
      id: "angka",
      eyebrow: "Langkah 3 · Angka",
      title: "Pyramid: dari definisi ke hitungan",
      tasks: [],
      prose: [
        "Definisi resmi: pyramid adalah kombinasi region + delay + kategori dataset. Contoh: USA-D1-analyst = region USA, Delay-1, kategori dataset analyst. Satu alpha BISA masuk banyak pyramid sekaligus bila memakai field dari banyak kategori. Konsultan dianggap 'memformulasikan' sebuah pyramid bila ia telah mensubmit minimal 3 alpha di dalamnya.",
        "Pyramid Alpha (tipe submit khusus): alpha yang berkontribusi pada MAKSIMAL 2 pyramid. Field grouping (currency, country, exchange, sector, industry, subindustry, market) dikecualikan dari hitungan — contoh resmi: alpha dengan 2 pyramid + field neutralisasi tetap dihitung 2 pyramid dan lolos sebagai Pyramid Alpha.",
        "Contoh hitungan: alpha USA Delay-1 memakai field dari dataset analyst + fundamental, plus group_neutralize(sector). Pyramid-nya: USA-D1-analyst dan USA-D1-fundamental = 2 pyramid (sector tidak dihitung) → memenuhi syarat Pyramid Alpha. Tambahkan satu field kategori price-volume → 3 pyramid → GUGUR dari tipe Pyramid (tetapi tetap bisa submit reguler).",
        "Mengapa pyramid penting di era konsultan? Dua alasan resmi: (a) memformulasikan banyak pyramid berpotensi memperbaiki Value Factor dan Combined Alpha Performance melalui diversifikasi; (b) jumlah pyramid adalah salah satu dari tiga kriteria kelayakan level Genius (bersama jumlah sinyal per kuartal dan combined performance). Pyramid adalah 'satuan diversifikasi' yang diakui sistem.",
        "Kriteria Power Pool Alpha (enam syarat, semuanya wajib): Sharpe ≥ 1,0; jumlah operator unik ≤ 8; jumlah data field unik (di luar grouping) ≤ 3; self-correlation di antara Power Pool alpha-mu ≤ 0,5 (lebih ketat dari 0,7 umum); turnover 1%–70%; region USA, Delay 1. Peringatan keras: sekali kamu menandai alpha sebagai power pool, ia TETAP di pool self-correlation walau tag-nya dilepas kemudian — tidak ada jalan keluar diam-diam.",
      ],
      formula: String.raw`\text{Power Pool} \iff S \geq 1.0 \land n_{ops} \leq 8 \land n_{fields} \leq 3 \land \rho_{self} \leq 0.5 \land 1\% \leq TO \leq 70\%`,
      formulaNote: "S = Sharpe; n_ops = jumlah operator unik; n_fields = jumlah data field unik (grouping dikecualikan); ρ_self = self-correlation maksimum di antara Power Pool alpha-mu; TO = turnover. Ditambah syarat implisit: USA Delay-1. Semua enam harus benar — satu gagal = bukan Power Pool.",
      note: {
        title: "Intuisi",
        body: "Baca kriteria Power Pool sebagai 'disiplin tertulis': Sharpe cukup (≥1,0, bukan bintang), sederhana (≤8 operator, ≤3 field), tidak mirip sesama (≤0,5), tidak boros (TO ≤70%). Power Pool bukan tempat alpha terbaikmu — ia tempat alpha TERDISIPLIN-mu. Itu dua hal berbeda.",
      },
      reference: "Pyramid = region × delay × kategori dataset. Power Pool = disiplin tertulis.",
    },
    {
      id: "lab-tipe",
      eyebrow: "Langkah 4 · Lab",
      title: "Klasifikasi tipe: tulis pemeriksa submit",
      prose: [
        "Tulis tiga fungsi: `is_atom(datasets)` — True bila tepat 1 dataset non-grouping; `n_pyramid(region, delay, kategoris)` — banyaknya pyramid = banyaknya kategori unik (grouping sudah difilter); `power_pool_ok(a)` — True bila keenam kriteria Power Pool terpenuhi (USA, delay 1, Sharpe ≥ 1,0, operator ≤ 8, field ≤ 3, self_corr ≤ 0,5, turnover 1%–70%).",
        "Terapkan pada 5 alpha contoh dan cetak klasifikasinya. Perhatikan B3: field dari 1 dataset TETAPI memakai inst_pnl — ia memakai pv1 secara implisit → bukan ATOM. Dan B5: lolos semua kriteria Power Pool KECUALI self_corr 0,62 → bukan Power Pool (ingat: 0,5, bukan 0,7).",
        "Eksperimen setelah selesai: ubah B5 self_corr menjadi 0,45 — kini ia Power Pool. Lalu tanyakan: apakah menandai B5 sebagai Power Pool keputusan bijak, mengingat tag tidak bisa dilepas dari pool? (Petunjuk: pikirkan tentang alpha power-pool-mu yang akan datang — mereka semua akan diuji korelasi terhadap B5 selamanya.)",
      ],
      tasks: [
        { id: "t1", text: "Tulis is_atom, n_pyramid, power_pool_ok" },
        { id: "t2", text: "Klasifikasikan 5 alpha contoh" },
      ],
      expected: "B1: ATOM=True Pyramid=1 PowerPool=False\nB2: ATOM=False Pyramid=2 PowerPool=False\nB3: ATOM=False Pyramid=1 PowerPool=True\nB4: ATOM=True Pyramid=1 PowerPool=True\nB5: ATOM=False Pyramid=2 PowerPool=False",
      note: {
        title: "Sering salah",
        body: "“Self-correlation 0,62 kan di bawah 0,7 — jadi aman.” Aman untuk SUBMIT REGULER, tetapi TIDAK untuk Power Pool yang ambangnya 0,5. Dua ambang, dua konteks — mencampurnya adalah cara tercepat salah klasifikasi.",
      },
      hints: [
        "datasets sudah difilter grouping; inst_pnl menambah 'pv1' ke list.",
        "power_pool_ok: cek region=='USA' and delay==1 dulu.",
      ],
      code: {
        starter: "# (id, datasets_non_grouping, pakai_inst_pnl, region, delay, kategoris, sharpe, n_ops, n_fields, self_corr, turnover). JANGAN UBAH.\nalphas = [\n    (\"B1\", [\"analyst\"], False, \"USA\", 1, [\"analyst\"], 1.4, 5, 2, 0.55, 0.25),\n    (\"B2\", [\"analyst\", \"fundamental\"], False, \"USA\", 1, [\"analyst\", \"fundamental\"], 1.8, 9, 4, 0.40, 0.30),\n    (\"B3\", [\"analyst\"], True, \"USA\", 1, [\"analyst\"], 1.6, 4, 2, 0.20, 0.22),\n    (\"B4\", [\"pv1\"], False, \"USA\", 1, [\"price-volume\"], 1.2, 6, 2, 0.35, 0.15),\n    (\"B5\", [\"analyst\", \"fundamental\"], False, \"USA\", 1, [\"analyst\", \"fundamental\"], 1.5, 7, 3, 0.62, 0.28),\n]\n\n# TULIS KODEMU\ndef is_atom(datasets, pakai_inst_pnl):\n    return\ndef n_pyramid(kategoris):\n    return\ndef power_pool_ok(a):\n    return\n\nfor a in alphas:\n    ide, ds, ip, reg, dly, kat, s, no, nf, sc, to = a\n    ds2 = ds + ([\"pv1\"] if ip and \"pv1\" not in ds else [])\n    print(f\"{ide}: ATOM={is_atom(ds2, ip)} Pyramid={n_pyramid(kat)} PowerPool={power_pool_ok(a)}\")\n",
        lockLines: 8,
        solution: "# (id, datasets_non_grouping, pakai_inst_pnl, region, delay, kategoris, sharpe, n_ops, n_fields, self_corr, turnover). JANGAN UBAH.\nalphas = [\n    (\"B1\", [\"analyst\"], False, \"USA\", 1, [\"analyst\"], 1.4, 5, 2, 0.55, 0.25),\n    (\"B2\", [\"analyst\", \"fundamental\"], False, \"USA\", 1, [\"analyst\", \"fundamental\"], 1.8, 9, 4, 0.40, 0.30),\n    (\"B3\", [\"analyst\"], True, \"USA\", 1, [\"analyst\"], 1.6, 4, 2, 0.20, 0.22),\n    (\"B4\", [\"pv1\"], False, \"USA\", 1, [\"price-volume\"], 1.2, 6, 2, 0.35, 0.15),\n    (\"B5\", [\"analyst\", \"fundamental\"], False, \"USA\", 1, [\"analyst\", \"fundamental\"], 1.5, 7, 3, 0.62, 0.28),\n]\n\n# TULIS KODEMU\ndef is_atom(datasets, pakai_inst_pnl):\n    return len(set(datasets)) == 1\ndef n_pyramid(kategoris):\n    return len(set(kategoris))\ndef power_pool_ok(a):\n    ide, ds, ip, reg, dly, kat, s, no, nf, sc, to = a\n    return (reg == \"USA\" and dly == 1 and s >= 1.0 and no <= 8 and nf <= 3\n            and sc <= 0.5 and 0.01 <= to <= 0.70)\n\nfor a in alphas:\n    ide, ds, ip, reg, dly, kat, s, no, nf, sc, to = a\n    ds2 = ds + ([\"pv1\"] if ip and \"pv1\" not in ds else [])\n    print(f\"{ide}: ATOM={is_atom(ds2, ip)} Pyramid={n_pyramid(kat)} PowerPool={power_pool_ok(a)}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "B1 ATOM, bukan PP", msg: "ATOM ya, tetapi self-corr 0,55 > 0,5 gagal Power Pool.", pattern: "B1: ATOM=True Pyramid=1 PowerPool=False" },
          { kind: "stdout_matches", task: "t2", label: "B3 bukan ATOM tetapi PP (tipe independen)", msg: "inst_pnl = dataset pv1 kedua (bukan ATOM); tetapi 6 kriteria PP terpenuhi.", pattern: "B3: ATOM=False Pyramid=1 PowerPool=True" },
          { kind: "stdout_matches", task: "t2", label: "B4 PowerPool", msg: "Semua 6 kriteria terpenuhi.", pattern: "B4: ATOM=True Pyramid=1 PowerPool=True" },
          { kind: "stdout_matches", task: "t2", label: "B5 bukan PP (corr 0,62)", msg: "Self-corr 0,62 > 0,5.", pattern: "B5: ATOM=False Pyramid=2 PowerPool=False" }
        ],
      },
      reference: "Klasifikasi dulu, tag kemudian — tag Power Pool tidak bisa ditarik.",
    },
    {
      id: "chart",
      eyebrow: "Langkah 5 · Chart",
      title: "Membaca tangga Brain Genius",
      prose: [
        "Cara membaca: empat kelompok batang = empat level Genius (Gold → Expert → Master → Grand Master); tiap kelompok punya dua batang — gelap = % data fields yang bisa diakses, terang = % operator. Angka di atas batang = persentasenya.",
        "Interpretasi: tiga pola penting. Pertama, Gold (level default konsultan baru) hanya membuka 50% field dan 45% operator — separuh gudang senjata masih terkunci. Kedua, lompatan terbesar ada di Grand Master (78→100%): level teratas bukan sekadar 'lebih baik', ia membuka SELURUH gudang. Ketiga, kenaikan akses berpasangan dengan kenaikan ekspektasi: tiap level menuntut lebih banyak sinyal per kuartal, lebih banyak pyramid, dan combined performance lebih tinggi — dengan slot terbatas (70/20/8/2%) dan tie-breaker antar yang lolos ambang.",
        "Kaitan ke pyramid: tabel region per level — Gold: USA, ASI, EUR, GLB, IND, CHN; Expert: tambahan pyramid lintas region; Master: +AMR, JPN; Grand Master: +HKG, KOR, TW. Level menentukan DI MANA kamu boleh membangun pyramid — arsitektur portofoliomu dibatasi paspor levelmu.",
        "Catatan jujur: angka-angka ini dari dokumentasi resmi program Genius — tetapi program dievaluasi per kuartal dan ambang spesifik diumumkan tiap kuartal sebelumnya. Jangan hafalkan angkanya sebagai konstanta abadi; hafalkan STRUKTURNYA (4 level, 3 kriteria, slot terbatas, tie-breaker).",
      ],
      figure: {
        svg: FIG_GENIUS,
        alt: "Grouped bar chart akses data fields dan operator: Gold 50/45, Expert 61/63, Master 78/78, Grand Master 100/100.",
        caption: "Tangga Genius: akses naik per level — tetapi ekspektasi dan kompetisi ikut naik.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Perhatikan tie-breaker yang 'aneh': rata-rata operator/field per alpha yang LEBIH RENDAH justru lebih baik — tetapi total operator/field unik yang LEBIH TINGGI lebih baik. Terjemahannya: tiap alpha harus SEDERHANA, tetapi portofoliomu harus BERAGAM. Inilah filosofi ATOM + Pyramid yang dikuantifikasi menjadi aturan main.",
      },
      reference: "Level = paspor: menentukan gudang senjata dan wilayah pyramid-mu.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta: alpha-mu tipe submit apa?",
      prose: [
        "Skenario 1 — Field dari 1 dataset (non-grouping): ATOM. Klaim hak istimewanya (lewati IS Ladder, wajib 2Y Sharpe). Waspadai jebakan inst_pnl. Contoh: B1, B4.",
        "Skenario 2 — Bukan ATOM tetapi pyramid ≤ 2: PYRAMID ALPHA. Maksimalkan 2 pyramid; grouping tidak dihitung. Setiap alpha yang diformulasikan menambah hitungan pyramid-mu (butuh 3 alpha per pyramid untuk 'memformulasikan'). Contoh: B2, B5.",
        "Skenario 3 — USA Delay-1, Sharpe ≥ 1,0, sederhana (≤8 operator, ≤3 field), self-corr sesama ≤ 0,5, TO 1%–70%: POWER POOL. Keputusan tag adalah KOMITMEN — ia tinggal di pool selamanya. Tandai hanya alpha yang kamu rela 'menikah' dengannya.",
        "Skenario 4 — Tidak memenuhi semua di atas: SUBMIT REGULER. Bukan vonis — mayoritas alpha bagus hidup di sini. Tipe khusus adalah optimasi, bukan syarat.",
        "Cara membaca figur: jawab tiga belah ketupat berurutan dari atas — dataset dulu, pyramid kemudian, Power Pool terakhir. Interpretasi: urutannya dari yang paling mudah diklaim (ATOM) ke yang paling mengikat (Power Pool). Jangan melompat ke Power Pool sebelum memastikan ATOM/Pyramid — kamu mungkin melewatkan hak istimewa yang lebih murah.",
        "Aturan praktis 10 detik: 1 dataset → ATOM · ≤2 pyramid → Pyramid · USA-D1 sederhana → pertimbangkan Power Pool (komitmen!) · sisanya → reguler, dan itu tidak apa-apa.",
      ],
      figure: {
        svg: FIG_PETA_TIPE,
        alt: "Flowchart pemilihan tipe submit: ATOM, Pyramid, Power Pool, atau reguler.",
        caption: "Tiga belah ketupat berurutan — dari hak istimewa termurah ke komitmen termahal.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Semua alpha saya harus jadi salah satu tipe khusus.” Salah — tipe khusus adalah OPTIMASI untuk alpha yang memang cocok, bukan target kuantitas. Memaksakan alpha 5-dataset menjadi 'Power Pool' dengan membuang 2 dataset merusak alpha demi label. Label tidak membayar; performa yang membayar.",
      },
      reference: "ATOM → Pyramid → Power Pool → reguler. Urutan klaim, bukan kasta.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Kasus: portofolio 6 alpha seorang konsultan",
      prose: [
        "Konsultan Gold punya 6 alpha: C1 (1 dataset analyst, USA D1, S 1,6, 5 ops, 2 field, sc 0,3, TO 20%), C2 (analyst+fundamental, USA D1, S 2,1, 9 ops, 4 field, sc 0,4, TO 30%), C3 (pv1 saja, USA D1, S 1,1, 6 ops, 2 field, sc 0,35, TO 15%), C4 (analyst+pv via inst_pnl, USA D1, S 1,7, 4 ops, 2 field, sc 0,2, TO 25%), C5 (price-volume, EUR D1, S 1,9, 5 ops, 2 field, sc 0,3, TO 18%), C6 (analyst+fundamental+sentiment, USA D1, S 2,4, 12 ops, 5 field, sc 0,55, TO 35%). Tentukan tipe tiap alpha + strategi pyramid-nya SEBELUM membaca pembahasan.",
        "Pembahasan: C1 → ATOM (1 dataset) + kandidat Power Pool? cek: S 1,6≥1, 5 ops≤8, 2 field≤3, sc 0,3≤0,5, TO 20% ok, USA D1 → YA, Power Pool layak. C2 → Pyramid Alpha (2 pyramid), bukan PP (9 ops > 8, 4 field > 3). C3 → ATOM + Power Pool layak (semua kriteria terpenuhi). C4 → BUKAN ATOM (inst_pnl = pv1 kedua → 2 dataset), Pyramid Alpha (2 pyramid). C5 → Pyramid Alpha (EUR-D1-pricevolume, 1 pyramid) — bukan PP (region EUR). C6 → reguler saja (3 pyramid, 12 ops, sc 0,55 — terlalu kompleks untuk semua tipe khusus).",
        "Strategi pyramid: C1+C4 berbagi USA-D1-analyst (2/3 menuju formulasi — butuh 1 lagi); C2 menambah USA-D1-fundamental; C3 mengisi USA-D1-pricevolume; C5 membuka EUR-D1-pricevolume. Total 5 pyramid dirintis, 0 terformulasi — PR kuartal ini: tambah 1 alpha USA-D1-analyst dan 2 alpha di dua pyramid lain untuk memformulasikan 3 pyramid.",
        "Pelajaran: dalam 10 menit, 6 alpha yang tadinya 'sekadar 6 alpha' berubah menjadi peta arsitektur dengan PR yang jelas. Itulah fungsi tipe submit — bukan label kebanggaan, melainkan SISTEM NAVIGASI portofolio.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Latihan klasifikasi ini melatih otot yang sama dengan segmentasi portofolio di risk reporting: mengelompokkan eksposur ke dalam bucket yang diakui sistem, lalu mengelola tiap bucket dengan aturannya sendiri. Bedanya hanya bahasanya — logikanya identik.",
      },
      reference: "Tipe submit = sistem navigasi, bukan label kebanggaan.",
    },
    {
      id: "lab-genius",
      eyebrow: "Langkah 8 · Lab",
      title: "Pemeriksa kelayakan Genius",
      prose: [
        "Tulis fungsi `cek_genius(sinyal, pyramid_terformulasi, combined_sharpe, target)` yang memeriksa tiga kriteria kelayakan level: jumlah sinyal per kuartal ≥ target['sinyal'], pyramid terformulasi ≥ target['pyramid'], combined Sharpe ≥ target['sharpe']. Kembalikan (True/False, daftar kriteria yang gagal). Uji untuk target tiga level (Gold, Expert, Master) dengan angka ilustratif.",
        "Lalu jawab: konsultan dengan 40 sinyal, 2 pyramid, combined Sharpe 1,1 — level apa yang layak? (Petunjuk: Gold butuh (20, 1, 0,5); Expert (35, 3, 0,8); Master (60, 6, 1,2) — angka target ILUSTRATIF, bukan ambang resmi kuartal berjalan.)",
        "Eksperimen: naikkan pyramid-nya menjadi 4 (tambah 2 pyramid terformulasi) — apa yang berubah? Diskusikan: dari tiga kriteria, mana yang paling 'murah' ditingkatkan untuk konsultan ini, dan mana yang paling mahal? (Petunjuk: sinyal = kerja keras; pyramid = arsitektur; combined Sharpe = hasil — yang terakhir tidak bisa 'dikejar' langsung.)",
      ],
      tasks: [
        { id: "t1", text: "Tulis cek_genius 3 kriteria" },
        { id: "t2", text: "Uji 3 level, tentukan level layak" },
      ],
      expected: "Gold: LAYAK\nExpert: GAGAL [pyramid]\nMaster: GAGAL [sinyal, pyramid, sharpe]",
      note: {
        title: "Intuisi",
        body: "Fungsi ini meniru 'pikiran' dashboard Genius: tiga ambang, tanpa kompromi. Nilai praktisnya: sebelum kuartal berakhir, kamu tahu PERSIS kriteria mana yang kurang — dan bisa mengalokasikan sisa minggu secara rasional, bukan panik.",
      },
      hints: [
        "Bandingkan tiap kriteria dengan target; kumpulkan yang gagal ke list.",
        "Target ilustratif: Gold (20,1,0.5), Expert (35,3,0.8), Master (60,6,1.2).",
      ],
      code: {
        starter: "# (sinyal/kuartal, pyramid terformulasi, combined Sharpe). ILUSTRATIF. JANGAN UBAH.\nkonsultan = (40, 2, 1.1)\ntargets = {\n    \"Gold\": {\"sinyal\": 20, \"pyramid\": 1, \"sharpe\": 0.5},\n    \"Expert\": {\"sinyal\": 35, \"pyramid\": 3, \"sharpe\": 0.8},\n    \"Master\": {\"sinyal\": 60, \"pyramid\": 6, \"sharpe\": 1.2},\n}\n\n# TULIS KODEMU\ndef cek_genius(sinyal, pyramid, sharpe, target):\n    return (True, [])  # atau (False, [kriteria_gagal])\n\ns, p, c = konsultan\nfor level, t in targets.items():\n    ok, gagal = cek_genius(s, p, c, t)\n    print(f\"{level}: {'LAYAK' if ok else 'GAGAL ' + str(gagal)}\")\n",
        lockLines: 8,
        solution: "# (sinyal/kuartal, pyramid terformulasi, combined Sharpe). ILUSTRATIF. JANGAN UBAH.\nkonsultan = (40, 2, 1.1)\ntargets = {\n    \"Gold\": {\"sinyal\": 20, \"pyramid\": 1, \"sharpe\": 0.5},\n    \"Expert\": {\"sinyal\": 35, \"pyramid\": 3, \"sharpe\": 0.8},\n    \"Master\": {\"sinyal\": 60, \"pyramid\": 6, \"sharpe\": 1.2},\n}\n\n# TULIS KODEMU\ndef cek_genius(sinyal, pyramid, sharpe, target):\n    gagal = []\n    if sinyal < target[\"sinyal\"]:\n        gagal.append(\"sinyal\")\n    if pyramid < target[\"pyramid\"]:\n        gagal.append(\"pyramid\")\n    if sharpe < target[\"sharpe\"]:\n        gagal.append(\"sharpe\")\n    return (len(gagal) == 0, gagal)\n\ns, p, c = konsultan\nfor level, t in targets.items():\n    ok, gagal = cek_genius(s, p, c, t)\n    print(f\"{level}: {'LAYAK' if ok else 'GAGAL ' + str(gagal)}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Gold layak", msg: "40≥20, 2≥1, 1,1≥0,5.", pattern: "Gold: LAYAK" },
          { kind: "stdout_matches", task: "t2", label: "Expert gagal pyramid", msg: "2 < 3.", pattern: "Expert: GAGAL \\['pyramid'\\]" },
          { kind: "stdout_matches", task: "t2", label: "Master gagal semua", msg: "40<60, 2<6, 1,1<1,2.", pattern: "Master: GAGAL \\['sinyal', 'pyramid', 'sharpe'\\]" }
        ],
      },
      reference: "Tiga ambang, tanpa kompromi — rencanakan kuartalmu dari sini.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Refleksi arsitektur",
      prose: [
        "Lima pertanyaan — jawab sebagai arsitek portofolio.",
      ],
      tasks: [],
      summary: [
        "ATOM = field dari 1 dataset (grouping dikecualikan); inst_pnl dihitung sebagai pv1.",
        "ATOM lewati IS Ladder Sharpe test — tetapi wajib tes IS reguler + 2Y Sharpe.",
        "Pyramid = region × delay × kategori dataset; terformulasi bila ≥3 alpha; Pyramid Alpha ≤ 2 pyramid.",
        "Power Pool: S≥1,0, ≤8 ops, ≤3 field, self-corr ≤0,5, TO 1%–70%, USA D1 — tag tidak bisa ditarik.",
        "Genius: Gold/Expert/Master/Grand Master; 3 kriteria (sinyal, pyramid, combined Sharpe); slot 70/20/8/2%.",
        "Filosofi tie-breaker: tiap alpha sederhana, portofolio beragam — ATOM + Pyramid terkuantifikasi.",
      ],
      quiz: [
        {
          q: "Alpha memakai field dari dataset analyst + group_neutralize(sector). Apakah ATOM?",
          options: [
            { text: "Ya — sector adalah grouping field yang dikecualikan", why: "Tepat — grouping tidak dihitung.", correct: true },
            { text: "Tidak — neutralization menambah dataset", why: "Grouping fields dikecualikan eksplisit dari hitungan." },
            { text: "Tidak — ATOM tidak boleh memakai operator apa pun", why: "ATOM membatasi DATASET, bukan operator." },
            { text: "Ya — tetapi kehilangan hak istimewanya", why: "Tidak — ia tetap ATOM penuh dengan hak istimewanya." }
          ],
        },
        {
          q: "Alpha memakai inst_pnl(field_dari_analyst). Status ATOM?",
          options: [
            { text: "Bukan ATOM — inst_pnl dihitung sebagai dataset pv1 kedua", why: "Benar — jebakan yang dinyatakan eksplisit.", correct: true },
            { text: "Tetap ATOM — inst_pnl hanya operator", why: "Dokumentasi: inst_pnl dihitung sebagai pemakaian pv1." },
            { text: "Tetap ATOM bila field analyst-nya satu", why: "Dua dataset (analyst + pv1) = bukan 1 dataset." },
            { text: "Bukan ATOM — inst_pnl dilarang di ATOM", why: "Tidak dilarang — hanya dihitung sebagai dataset." }
          ],
        },
        {
          q: "Syarat Power Pool yang PALING ketat dibanding submit reguler?",
          options: [
            { text: "Self-correlation ≤ 0,5 (vs 0,7 umum)", why: "Benar — ambang khusus yang lebih ketat.", correct: true },
            { text: "Sharpe ≥ 1,0 (vs 1,25 umum)", why: "Ini justru LEBIH longgar dari ambang submit D1." },
            { text: "Turnover 1%–70% (vs tanpa batas)", why: "Rentang ini SAMA dengan gerbang submit umum." },
            { text: "Harus USA Delay-1", why: "Itu syarat cakupan, bukan 'lebih ketat' dari ambang angka." }
          ],
        },
        {
          q: "Konsultan menandai alpha sebagai Power Pool lalu melepas tag-nya. Apa yang terjadi?",
          options: [
            { text: "Alpha tetap di pool self-correlation Power Pool selamanya", why: "Tepat — tidak ada jalan keluar diam-diam.", correct: true },
            { text: "Alpha keluar dari pool dan bebas", why: "Salah — dokumentasi menyatakan sebaliknya." },
            { text: "Alpha menjadi DECOMMISSIONED", why: "Tag tidak memengaruhi status lifecycle." },
            { text: "Alpha otomatis menjadi ATOM", why: "Tipe submit tidak berubah otomatis." }
          ],
        },
        {
          q: "Filosofi di balik tie-breaker Genius (avg ops/alpha rendah-baik, total ops unik tinggi-baik)?",
          options: [
            { text: "Tiap alpha sederhana, portofolio beragam", why: "Tepat — ATOM + Pyramid terkuantifikasi.", correct: true },
            { text: "Semakin kompleks tiap alpha semakin baik", why: "Terbalik — avg rendah yang dihargai." },
            { text: "Fokus pada satu dataset saja selamanya", why: "Total unik tinggi menuntut keberagaman dataset." },
            { text: "Kuantitas sinyal mengalahkan segalanya", why: "Kuantitas hanya satu dari tiga kriteria + tie-breaker." }
          ],
        }
      ],
      reference: "Sederhana per alpha, beragam per portofolio — arsitektur era konsultan.",
    },
  ],
};
