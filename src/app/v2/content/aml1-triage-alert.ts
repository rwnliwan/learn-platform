import type { V2Lesson } from "../lib/types";

// Distribusi 1.200 alert harian per band skor: 18+96+210+376+500 = 1200.
// Garis kapasitas: 150 review/hari hanya mencapai band 70-89.
const BAND_SVG = `<svg viewBox="0 0 480 300" role="img" aria-label="Diagram batang distribusi 1200 alert per band skor dengan garis kapasitas 150.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="52" y1="20" x2="452" y2="20"/><line x1="52" y1="80" x2="452" y2="80"/><line x1="52" y1="140" x2="452" y2="140"/><line x1="52" y1="200" x2="452" y2="200"/><line x1="52" y1="260" x2="452" y2="260"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="46" y="24">500</text><text x="46" y="84">375</text><text x="46" y="144">250</text><text x="46" y="204">125</text><text x="46" y="264">0</text></g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle" fill="var(--chart-text)">
<rect x="80" y="251" width="56" height="9" fill="var(--c1)"/><text x="108" y="276">90-100</text><text x="108" y="248" fill="var(--text)" font-weight="600">18</text>
<rect x="156" y="212" width="56" height="48" fill="var(--c1)"/><text x="184" y="276">70-89</text><text x="184" y="208" fill="var(--text)" font-weight="600">96</text>
<rect x="232" y="155" width="56" height="105" fill="var(--c2)"/><text x="260" y="276">50-69</text><text x="260" y="151" fill="var(--text)" font-weight="600">210</text>
<rect x="308" y="72" width="56" height="188" fill="var(--c3)"/><text x="336" y="276">30-49</text><text x="336" y="68" fill="var(--text)" font-weight="600">376</text>
<rect x="384" y="20" width="56" height="240" fill="var(--c4)" opacity="0.55"/><text x="412" y="276">0-29</text><text x="412" y="16" fill="var(--text)" font-weight="600">500</text>
</g>
<line x1="52" y1="185" x2="452" y2="185" stroke="var(--c4)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="446" y="178" text-anchor="end" font-size="12" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">kapasitas 150 review/hari</text>
<text x="240" y="296" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">band skor prioritas (0-100)</text>
</svg>`;

export const aml1: V2Lesson = {
  slug: "aml1-triage-alert",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML1 — Triase Alert Transaction Monitoring",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Alert nomor 1.043 yang baru dibaca 11 hari kemudian",
      prose: [
        "Bank \"ArusDana\" menerima 1.200 alert transaction monitoring setiap hari. Timnya: 5 analis, masing-masing sanggup me-review 30 alert sehari. Kapasitas total: 150. Setiap pagi antrean bertambah 1.050 alert yang tidak akan pernah dibaca. Mereka memakai FIFO — first in, first out. Terdengar adil.",
        "Hari Selasa, 40 alert kecil masuk berurutan: 6 rekening berbeda, masing-masing 6-7 transfer Rp40-90 juta ke satu rekening tujuan yang sama, semuanya dalam 5 jam. Skor risikonya — kalau ada yang menghitung — akan masuk 10 besar hari itu. Tapi antrean FIFO menaruhnya di posisi 1.043. Analis paling rajin baru membacanya 11 hari kemudian. Uang Rp9,8 miliar sudah berpindah 4 negara.",
        "Sementara itu 200 alert teratas antrean minggu itu adalah transfer payroll korporat Rp2-5 miliar — nominal raksasa, risiko nol. Tim menghabiskan 46 jam kerja me-review gaji bulanan yang sah. Inilah twist-nya: tanpa triase, analis terbaik pun hanya menjadi pembaca antrean yang rapi — sementara pencucian uang lewat di nomor antrean belakang.",
        "Setelah lesson ini kamu bisa: menghitung skor prioritas alert dari fitur mentah, menjelaskan kenapa FIFO gagal di beban tinggi, dan merancang tier SLA berbasis risiko. Ini fondasi operasional seluruh track AML: semua tipologi di lesson berikutnya tidak ada gunanya kalau alert-nya tidak pernah dibaca.",
      ],
      tasks: [],
      reference: "Triase = memutuskan urutan kerja, bukan memutuskan bersalah. FIFO di beban 8x kapasitas = 87,5% alert tidak terbaca.",
    },
    {
      id: "ekonomi",
      eyebrow: "Langkah 2 · Ekonomi alert",
      title: "Backlog adalah utang berbunga",
      prose: [
        "Tiga angka mengendalikan ruang operasi monitoring: volume alert (1.200/hari), kapasitas review (150/hari), dan umur backlog. Umur backlog = berapa lama alert menunggu sebelum dibaca. Di ArusDana: 1.050 alert/hari tak terbaca, umur backlog rata-rata 11 hari. Setiap hari keterlambatan adalah hari tambahan bagi dana untuk berpindah yurisdiksi — biaya keterlambatan tidak linear, ia meledak setelah dana melewati batas negara kedua.",
        "False positive (FP) adalah pajaknya: analis ArusDana menemukan 8% alert yang direview benar-benar suspicious. Artinya 92% waktu review dibakar untuk hal sah. Tapi FP bukan musuh — FP adalah harga deteksi. Musuh sebenarnya adalah FP yang tidak diukur: tanpa mengukur hit rate per rule, kamu tidak tahu rule mana yang membakar kapasitas.",
        "SLA (service level agreement) mengubah \"secepatnya\" menjadi kontrak: alert risiko tinggi harus direview dalam 4 jam kerja, sedang dalam 2 hari, rendah dalam 5 hari. SLA tanpa triase = janji kosong; triase tanpa SLA = prioritas tanpa akuntabilitas.",
      ],
      formula: String.raw`\text{coverage} = \frac{\text{kapasitas}}{\text{volume}} = \frac{150}{1200} = 0{,}125`,
      formulaNote: "coverage = fraksi alert yang bisa direview. 0,125 artinya 12,5% terbaca, 87,5% buta. x = alert, w = bobot — lihat langkah 3.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Kalau FP 92%, matikan saja rule-nya.\" FP tinggi bukan alasan mematikan rule — ia alasan men-tuning-nya. Rule dengan hit rate 8% yang menangkap satu jaringan Rp9,8 miliar setahun mungkin rule terbaik di bank itu. Yang harus dimatikan adalah rule yang tidak pernah diukur.",
      },
      reference: "Ukur tiga hal tiap minggu: coverage, umur backlog, hit rate per rule. Sisanya opini.",
    },
    {
      id: "skor",
      eyebrow: "Langkah 3 · Skor prioritas",
      title: "Satu angka untuk mengurutkan 1.200 alert",
      prose: [
        "Skor prioritas = rata-rata berbobot dari fitur risiko yang dinormalisasi ke 0-100. Tiga fitur paling prediktif di transaction monitoring: nominal relatif terhadap profil nasabah (bukan nominal absolut — Rp450 juta untuk payroll korporat itu kecil, untuk warung itu gila), risiko negara tujuan (skala 1-3 dari daftar yurisdiksi berisiko), dan velocity 24 jam (banyaknya transaksi — pencuci uang berpacu dengan waktu).",
        "Bobot mencerminkan pengalaman investigator: 0,4 untuk nominal, 0,35 untuk negara, 0,25 untuk velocity. Bobot harus berjumlah 1 — kalau tidak, skor antar versi tidak bisa dibandingkan. Normalisasi memakai cap (min(nominal/500, 1)) agar satu transfer Rp50 miliar tidak menenggelamkan semua sinyal lain.",
        "Cara membaca diagram: sumbu X = band skor, tinggi batang = jumlah alert di band itu. Garis putus-putus = kapasitas 150 review/hari. Interpretasi: hanya band 90-100 (18 alert) dan 70-89 (96 alert) yang seluruhnya terbaca — total 114. Dari band 50-69 (210 alert) hanya 36 yang kebagian slot. Alert di bawah skor 50 praktis tidak pernah direview: kalau rule-mu menaruh kasus nyata di sana, tuning ulang.",
      ],
      formula: String.raw`S = \sum_{i=1}^{n} w_i x_i \qquad \sum_{i=1}^{n} w_i = 1`,
      formulaNote: "S = skor prioritas (0-100). w_i = bobot fitur ke-i (jumlah = 1). x_i = fitur ternormalisasi 0-100. Contoh: w = (0,4; 0,35; 0,25) untuk (nominal; negara; velocity).",
      figure: {
        svg: BAND_SVG,
        alt: "Diagram batang distribusi 1200 alert per band skor dengan garis kapasitas 150.",
        caption: "Distribusi 1.200 alert harian per band skor. Hanya ~150 alert teratas yang terbaca — sisanya buta.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Skor prioritas bukan vonis bersalah — ia daftar belanja investigator. Skor 93 tidak berarti \"pasti cuci uang\"; ia berarti \"kalau kamu cuma punya 1 jam hari ini, baca ini dulu.\" Analis yang paham ini tidak akan pernah bilang \"skornya tinggi, langsung blokir.\"",
      },
      reference: "Bobot = pengetahuan investigator yang bisa diwariskan. Dokumentasikan kenapa 0,4 bukan 0,5.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab triase",
      title: "Urutkan 8 alert seperti investigator",
      prose: [
        "Delapan alert menunggu. Kamu punya slot untuk 3. Hitung skor tiap alert dengan rumus langkah 3, urutkan menurun, dan lihat siapa yang lolos seleksi. Perhatikan jebakannya: alert a3 punya nominal terbesar (Rp2.000 juta) — apakah ia peringkat 1?",
        "Coba ubah-ubah bobot setelah selesai: apa yang terjadi kalau bobot velocity dinaikkan ke 0,5? Alert mana yang naik daun? Itulah tuning: bobot adalah hipotesis tentang musuhmu.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `skor_prioritas(a)` → skor 0-100 (1 desimal)" },
        { id: "t2", text: "Jalankan dan catat peringkat 1 serta top-3" },
      ],
      expected: "peringkat 1: a1 (93.5); top-3 = a1, a3, a4 — nominal terbesar (a3) kalah dari kombinasi negara+velocity (a1)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Urutkan by nominal saja, lebih gampang.\" a3 (Rp2.000 juta) memang terlihat menakutkan — tapi ia transfer korporat ke negara risiko 2 dengan velocity 25. a1 (Rp450 juta) ke negara risiko 3 dengan velocity 18 justru pola placement klasik. Nominal absolut tanpa konteks = umpan FP.",
      },
      hints: [
        "Normalisasi: s_nom = min(nominal/500, 1)*100; s_neg = negara/3*100; s_vel = min(vel/20, 1)*100.",
        "Skor = 0.4*s_nom + 0.35*s_neg + 0.25*s_vel, bulatkan 1 desimal.",
        "Contoh a1: 0.4*90 + 0.35*100 + 0.25*90 = 36 + 35 + 22.5 = 93.5.",
      ],
      code: {
        starter: `# 8 alert: (id, nominal_jt, negara_risk 1-3, velocity_24h)\nalerts = [\n    ("a1", 450, 3, 18),\n    ("a2", 120, 1, 3),\n    ("a3", 2000, 2, 25),\n    ("a4", 95, 3, 30),\n    ("a5", 800, 1, 6),\n    ("a6", 150, 2, 12),\n    ("a7", 300, 3, 4),\n    ("a8", 60, 2, 22),\n]\n\n# TULIS KODEMU: skor = 0.4*nominal + 0.35*negara + 0.25*velocity (0-100)\ndef skor_prioritas(a):\n    _, nominal, negara, vel = a\n    s_nom =\n    s_neg =\n    s_vel =\n    return\n\nranking = sorted(alerts, key=skor_prioritas, reverse=True)\nfor i, a in enumerate(ranking, 1):\n    print(f"peringkat {i}: {a[0]}  skor={skor_prioritas(a)}")\nprint("top3:", [a[0] for a in ranking[:3]])`,
        lockLines: 10,
        solution: `# 8 alert: (id, nominal_jt, negara_risk 1-3, velocity_24h)\nalerts = [\n    ("a1", 450, 3, 18),\n    ("a2", 120, 1, 3),\n    ("a3", 2000, 2, 25),\n    ("a4", 95, 3, 30),\n    ("a5", 800, 1, 6),\n    ("a6", 150, 2, 12),\n    ("a7", 300, 3, 4),\n    ("a8", 60, 2, 22),\n]\n\n# TULIS KODEMU: skor = 0.4*nominal + 0.35*negara + 0.25*velocity (0-100)\ndef skor_prioritas(a):\n    _, nominal, negara, vel = a\n    s_nom = min(nominal / 500, 1) * 100\n    s_neg = negara / 3 * 100\n    s_vel = min(vel / 20, 1) * 100\n    return round(0.4 * s_nom + 0.35 * s_neg + 0.25 * s_vel, 1)\n\nranking = sorted(alerts, key=skor_prioritas, reverse=True)\nfor i, a in enumerate(ranking, 1):\n    print(f"peringkat {i}: {a[0]}  skor={skor_prioritas(a)}")\nprint("top3:", [a[0] for a in ranking[:3]])`,
        checks: [
          { kind: "defined", task: "t1", name: "skor_prioritas", label: "`skor_prioritas` terdefinisi", msg: "Buat fungsi skor_prioritas(a) yang mengembalikan skor 0-100." },
          { kind: "stdout_matches", task: "t2", pattern: "peringkat 1: a1\\s+skor=93\\.5", label: "Peringkat 1 = a1 (93.5)", msg: "a1: 0.4*90 + 0.35*100 + 0.25*90 = 93.5. Cek normalisasi dan bobot." },
          { kind: "stdout_matches", task: "t2", pattern: "top3: \\['a1', 'a3', 'a4'\\]", label: "Top-3 = a1, a3, a4", msg: "Urutan menurun: a1 (93.5), a3 (88.3), a4 (67.6)." },
        ],
      },
      reference: "min(x,1) = cap. Bobot jumlah 1. sorted(..., reverse=True).",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Simulasi",
      title: "30 hari FIFO vs skor: matematika kelangkaan",
      prose: [
        "Simulasikan 30 hari. FIFO: 1.200 alert masuk per hari, 150 direview — backlog tumbuh 1.050 per hari. Dari 4.500 yang direview, hit rate 8% → 360 suspicious tertangkap. Kedengarannya lumayan, sampai kamu menghitung yang tidak terlihat: jika 8% dari SEMUA alert sebenarnya suspicious, totalnya 2.880 — FIFO meloloskan 2.520 (87,5%).",
        "Dengan skor: 150 top-skor direview per hari, hit rate 20,7% → 932 tertangkap, 1.948 lolos (67,6%). Masih banyak yang lolos — tetapi 572 kasus tambahan tertangkap dengan analis, gaji, dan kopi yang sama. Triase tidak menyelesaikan masalah kapasitas; ia mengalokasikan kelangkaan ke tempat paling berharga.",
        "Pelajaran yang sering terlewat: backlog TETAP tumbuh di kedua skenario (1.200 > 150). Triase mengubah KOMPOSISI yang direview, bukan volume masalah. Tanpa auto-close tier bawah (skor < 30) dan tuning rule hulu, triase hanya memperlambat pendarahan — tidak menghentikannya.",
        "Eksperimen setelah lab: ubah kapasitas menjadi 300/hari. Backlog tetap tumbuh (1.200 > 300), tangkapan naik 2× tetapi lolos tetap ribuan. Kesimpulan: tambah analis tanpa triase = antrean yang dibaca lebih cepat, tetap buta. Urutan intervensi yang benar: skor dulu, auto-close tier bawah, tuning rule, baru tambah orang.",
        "Angka ekonomi triage: analis dibayar Rp15 juta/bulan, menangani ~150 alert/hari. Biaya per review ≈ Rp4.500. Dengan 36.000 alert/bulan, mereview SEMUA = Rp162 juta/bulan biaya analis — versus expected loss dari alert yang terlewat. Jika 2.520 suspicious lolos dan tiap kasus merugikan Rp50 juta, ekspektasi kerugian Rp126 miliar. Biaya review Rp162 juta vs risiko Rp126 miliar: rasio 1 : 778. Review bukan biaya — ia asuransi termurah di bank.",
        "Tetapi ada batas: menambah analis ke-20 tidak menambah 150 review/hari yang produktif. Setiap analis butuh 2 minggu training, 1 bulan supervisi, dan kualitas review menurun setelah alert ke-100 dalam sehari (kelelahan keputusan). Kapasitas manusia punya diminishing return — di titik inilah otomasi (skor + aturan) mengambil alih 80% volume, manusia fokus ke 20% teratas.",
        "Benchmark industri: bank besar Indonesia memproses 50.000–200.000 alert/bulan dengan rasio analis 1:3.000 alert. Bank yang rasionya 1:10.000 bukan efisien — ia buta. Jika backlog-mu tumbuh 1.050/hari seperti simulasi lab, dalam 30 hari ada 31.500 alert tak tersentuh. Itu bukan antrean; itu kuburan bukti.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total_susp`, `fifo_tangkap`, `skor_tangkap`" },
        { id: "t2", text: "Jalankan dan bandingkan yang lolos" },
      ],
      expected: "Total suspicious 30 hari: 2880\nFIFO menangkap 360 (12.5%) -> lolos 2520\nSkor menangkap 932 (32.3%) -> lolos 1948",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Tambah analis dulu, triase nanti.” 5 analis → 10 analis: FIFO menangkap 720 dari 2.880 — masih 75% lolos, dengan gaji 2×. Triase dengan 5 analis menangkap 932. Urutan yang benar: skor dulu, tambah orang kemudian.",
      },
      hints: [
        "total_susp = hari * masuk * susp_rate.",
        "Format persen: {x:.1%} mengalikan 100 otomatis.",
      ],
      code: {
        starter: "# Simulasi 30 hari (JANGAN UBAH).\nhari, masuk, kapasitas = 30, 1200, 150\nhit_fifo, hit_skor, susp_rate = 0.08, 0.207, 0.08\n\n# TULIS KODEMU: bandingkan FIFO vs skor\ntotal_susp =\nfifo_tangkap =\nskor_tangkap =\n\nprint(f\"Total suspicious 30 hari: {total_susp:.0f}\")\nprint(f\"FIFO menangkap {fifo_tangkap:.0f} ({fifo_tangkap/total_susp:.1%}) -> lolos {total_susp-fifo_tangkap:.0f}\")\nprint(f\"Skor menangkap {skor_tangkap:.0f} ({skor_tangkap/total_susp:.1%}) -> lolos {total_susp-skor_tangkap:.0f}\")",
        lockLines: 3,
        solution: "# Simulasi 30 hari (JANGAN UBAH).\nhari, masuk, kapasitas = 30, 1200, 150\nhit_fifo, hit_skor, susp_rate = 0.08, 0.207, 0.08\n\n# TULIS KODEMU: bandingkan FIFO vs skor\ntotal_susp = hari * masuk * susp_rate\nfifo_tangkap = hari * kapasitas * hit_fifo\nskor_tangkap = hari * kapasitas * hit_skor\n\nprint(f\"Total suspicious 30 hari: {total_susp:.0f}\")\nprint(f\"FIFO menangkap {fifo_tangkap:.0f} ({fifo_tangkap/total_susp:.1%}) -> lolos {total_susp-fifo_tangkap:.0f}\")\nprint(f\"Skor menangkap {skor_tangkap:.0f} ({skor_tangkap/total_susp:.1%}) -> lolos {total_susp-skor_tangkap:.0f}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "FIFO 360 tertangkap", msg: "4.500 × 8% = 360.", pattern: "FIFO menangkap 360 \\(12\\.5%\\)" },
          { kind: "stdout_matches", task: "t2", label: "Skor menangkap lebih banyak", msg: "4.500 × 20,7% ≈ 932.", pattern: "Skor menangkap 932" }
        ],
      },
      reference: "Triase = alokasi kelangkaan. Backlog tumbuh terus; komposisi yang berubah.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Empat situasi, empat respons",
      prose: [
        "Satu: volume 8x kapasitas dan backlog menua → terapkan risk scoring, dan auto-close alert skor <30 dengan audit trail (bukan dihapus — ditutup otomatis dengan alasan tercatat, bisa dibuka lagi). Jangan tambah analis dulu; tambah analis tanpa triase = antrean yang dibaca lebih cepat, tetap buta.",
        "Dua: regulator menetapkan SLA ketat (mis. STR 15 hari) → tier-kan antrean: skor ≥70 direview ≤4 jam kerja, 40-69 ≤2 hari, <40 ≤5 hari. SLA diukur dari umur alert tertua per tier, bukan rata-rata — rata-rata menyembunyikan satu alert busuk berumur 30 hari.",
        "Tiga: hit rate <5% dan analis mengeluh → masalahnya di hulu, bukan hilir. Audit rule: rule mana penyumbang alert terbesar dengan hit rate terendah? Ketatkan atau turunkan aksinya dari hold menjadi monitor. Satu rule yang diperbaiki menghemat ratusan jam.",
        "Empat: lonjakan serangan terkonfirmasi (spike velocity lintas nasabah) → mode darurat 14 hari: threshold sementara diperketat, lembur terarah ke tier atas, tanggal kedaluwarsa mode darurat dicatat. Mode darurat tanpa tanggal kedaluwarsa menjadi beban permanen.",
        "Aturan praktis 10 detik: coverage <20% → skor dulu, tambah orang kemudian. Umur backlog tier atas >SLA → eskalasi hari ini. Satu rule >40% volume → audit rule itu minggu ini.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Auto-close bukan \"membuang alert\" — ia memindahkan keputusan dari analis yang kelelahan ke rule yang terdokumentasi. Alert yang di-auto-close dengan alasan tercatat lebih aman daripada alert yang \"dibaca\" dalam 8 detik karena analis mengejar target.",
      },
      reference: "Urutkan intervensi: tuning rule > triase > tambah analis. Kebanyakan tim melakukannya terbalik.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "1.200 alert, 150 slot: FIFO vs skor",
      prose: [
        "Bank ArusDana, satu hari kerja. Volume: 1.200 alert. Kapasitas: 150 review (5 analis x 30). Skenario FIFO: 150 alert pertama direview, 12 terkonfirmasi suspicious → hit rate 8%. Waktu terbuang untuk FP: 138 review x 20 menit = 46 jam kerja — lebih dari satu analis penuh sehari, habis untuk hal sah.",
        "Skenario skor: 150 alert skor tertinggi direview, 31 terkonfirmasi suspicious → hit rate 20,7%. Kenaikan temuan: 31/12 = 2,58x dengan analis yang sama, gaji yang sama, kopi yang sama. Dari 31 itu, 9 berasal dari satu jaringan placement yang di FIFO terkubur di posisi 900-an.",
        "Pertanyaan: (a) Berapa review terbuang di skenario FIFO? (b) Berapa kali lipat kenaikan temuan? (c) Jika tiap temuan suspicious rata-rata mencegah kerugian Rp400 juta, berapa nilai tambah triase hari itu?",
        "Pembahasan: (a) 150 - 12 = 138 review terbuang (92%). (b) 31/12 = 2,58x. (c) Tambahan temuan = 31 - 12 = 19; 19 x Rp400 juta = Rp7,6 miliar nilai yang \"ditemukan\" oleh pengurutan — tanpa menambah satu analis pun. Pelajaran mini-case: di beban tinggi, algoritma pengurutan adalah pegawai terbaik yang tidak digaji.",
      ],
      tasks: [],
      reference: "Hitung selalu: temuan per 100 review. Itulah \"upah\" tiap jam investigator.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan.",
      ],
      tasks: [],
      summary: [
        "Coverage = kapasitas/volume. Di bawah ~20%, FIFO praktis buta — triase wajib.",
        "Skor prioritas = Σ w_i x_i dengan Σ w_i = 1; fitur ternormalisasi 0-100 dengan cap.",
        "Nominal absolut tanpa konteks = umpan FP; nominal relatif terhadap profil nasabah yang prediktif.",
        "SLA per tier (mis. ≥70: 4 jam; 40-69: 2 hari; <40: 5 hari), diukur dari umur tertua per tier.",
        "Urutan intervensi: tuning rule > triase > tambah analis.",
      ],
      next: { label: "AML2 — KYC & CDD: Kenali Nasabahmu", href: "/v2/learn/aml2-kyc-cdd" },
      quiz: [
        {
          q: "Bank menerima 2.000 alert/hari, kapasitas 200 review. Coverage dan artinya?",
          options: [
            { text: "10% — 90% alert tidak terbaca, FIFO tidak bisa dipertahankan", why: "200/2000 = 10%. 1.800 alert/hari buta — triase risk-based wajib, bukan opsional.", correct: true },
            { text: "90% — hampir semua terbaca", why: "Terbalik: 200/2000 = 0,1 = 10%, bukan 90%." },
            { text: "50% — setengah terbaca", why: "200/2000 = 10%, bukan 50%." },
            { text: "Tidak bisa dihitung", why: "Bisa: coverage = kapasitas / volume." },
          ],
        },
        {
          q: "Alert Rp2 miliar (korporat, negara risiko 1) vs Rp95 juta (perorangan, negara risiko 3, velocity 30). Mana diprioritaskan?",
          options: [
            { text: "Rp2 miliar — nominal terbesar selalu menang", why: "Inilah umpan FP: nominal absolut tanpa konteks. Korporat Rp2 miliar bisa jadi payroll rutin." },
            { text: "Rp95 juta — kombinasi negara risiko 3 + velocity 30 = pola placement, skornya lebih tinggi", why: "Skor = bobot fitur, bukan nominal. Di lab, a1 (Rp450jt, negara 3, vel 18) mengalahkan a3 (Rp2.000jt).", correct: true },
            { text: "Keduanya sama", why: "Skor keduanya jauh berbeda — fitur konteks memisahkan keduanya." },
            { text: "Tolak keduanya", why: "Triase = urutan kerja, bukan vonis. Tidak ada yang ditolak di tahap ini." },
          ],
        },
        {
          q: "Kenapa bobot skor harus berjumlah 1?",
          options: [
            { text: "Agar terlihat rapi", why: "Bukan soal estetika — soal perbandingan antar versi skor." },
            { text: "Agar skor antar versi/tuning bisa dibandingkan — tanpa itu, skor 70 versi lama vs 70 versi baru artinya beda", why: "Normalisasi bobot membuat skala 0-100 stabil. Tanpa itu tuning menjadi tebak-tebakan.", correct: true },
            { text: "Syarat regulator", why: "Regulator tidak mengatur rumus internal skor bank." },
            { text: "Tidak harus", why: "Harus — kalau tidak, tiap tuning mengubah arti angka." },
          ],
        },
        {
          q: "Hit rate sebuah rule 3% tapi ia satu-satunya penangkap tipologi X. Keputusan?",
          options: [
            { text: "Matikan — 3% terlalu rendah", why: "Hit rate rendah + cakupan unik = rule mahal tapi tak tergantikan. Matikan = buta terhadap tipologi X." },
            { text: "Pertahankan sambil tuning; ukur deteksinya terhadap tipologi X, bukan sekadar hit rate", why: "Nilai rule = (temuan unik x nilai temuan) vs biaya review. Rule mahal yang menangkap yang lain tak bisa tangkap = aset.", correct: true },
            { text: "Naikkan threshold sampai hit rate 50%", why: "Menaikkan threshold bisa membunuh tepat tipologi X yang hanya ia tangkap." },
            { text: "Serahkan ke ML", why: "ML butuh label; tipologi langka = label sedikit. Rule tetap lapisan terbaik." },
          ],
        },
        {
          q: "SLA tier atas dilanggar 3 hari beruntun. Respons pertama yang benar?",
          options: [
            { text: "Tambah analis lembur", why: "Lembur tanpa tahu penyebab = membakar orang. Diagnosis dulu." },
            { text: "Cek umur backlog tier atas dan rule penyumbang volume terbesar minggu ini, lalu eskalasi", why: "Pelanggaran SLA = gejala. Penyebabnya backlog menua atau rule bocor — ukur dulu, bertindak tepat.", correct: true },
            { text: "Longgarkan SLA", why: "Mengubah target agar tercapai = menyembunyikan masalah dari regulator." },
            { text: "Auto-close semua tier bawah", why: "Tier bawah bukan penyebab pelanggaran tier atas. Salah sasaran." },
          ],
        },
      ],
    },
  ],
};
