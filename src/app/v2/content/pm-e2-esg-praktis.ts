import type { V2Lesson } from "../lib/types";

// Scatter: skor ESG provider A (sumbu X) vs provider B (sumbu Y) untuk 8 emiten — titik jauh dari diagonal.
const ESG_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Diagram sebar: skor ESG provider A vs provider B untuk 8 emiten, titik-titik tersebar jauh dari garis diagonal.">
<g font-size="11" font-family="var(--font-ui)">
<line x1="70" y1="250" x2="520" y2="250" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="70" y1="250" x2="70" y2="30" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="70" y1="250" x2="520" y2="30" stroke="var(--c3)" stroke-width="1" stroke-dasharray="6,4"/>
<text x="480" y="60" fill="var(--c3)" font-size="10" text-anchor="end">sepakat penuh</text>
<circle cx="198" cy="186" r="7" fill="var(--c1)"/><text x="198" y="172" fill="var(--chart-text)" text-anchor="middle" font-size="9">ADRO</text>
<circle cx="340" cy="122" r="7" fill="var(--c1)"/><text x="340" y="108" fill="var(--chart-text)" text-anchor="middle" font-size="9">ANTM</text>
<circle cx="266" cy="161" r="7" fill="var(--c1)"/><text x="266" y="147" fill="var(--chart-text)" text-anchor="middle" font-size="9">ASII</text>
<circle cx="410" cy="104" r="7" fill="var(--c1)"/><text x="410" y="90" fill="var(--chart-text)" text-anchor="middle" font-size="9">BBCA</text>
<circle cx="232" cy="177" r="7" fill="var(--c1)"/><text x="232" y="191" fill="var(--chart-text)" text-anchor="middle" font-size="9">ICBP</text>
<circle cx="304" cy="138" r="7" fill="var(--c1)"/><text x="304" y="152" fill="var(--chart-text)" text-anchor="middle" font-size="9">INDF</text>
<circle cx="436" cy="68" r="7" fill="#e11d48"/><text x="436" y="54" fill="var(--chart-text)" text-anchor="middle" font-size="9">SMGR</text>
<circle cx="164" cy="205" r="7" fill="var(--c1)"/><text x="164" y="219" fill="var(--chart-text)" text-anchor="middle" font-size="9">TLKM</text>
</g>
<text x="295" y="272" font-size="11" font-family="var(--font-ui)" text-anchor="middle" fill="var(--chart-text)">Skor provider A →</text>
<text x="30" y="140" font-size="11" font-family="var(--font-ui)" text-anchor="middle" fill="var(--chart-text)" transform="rotate(-90 30 140)">Skor provider B →</text>
<text x="280" y="292" font-size="13" font-family="var(--font-ui)" text-anchor="middle" fill="var(--text)" font-weight="600">Skor 78 dan skor 32 untuk perusahaan yang sama</text>
</svg>`;

export const pmE2: V2Lesson = {
  slug: "pm-e2-esg-praktis",
  track: "Portfolio Management",
  module: "Praktik Profesional",
  title: "PME2 — ESG dalam Praktik: Skor, Greenwashing, Integrasi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-skor",
      eyebrow: "Langkah 1 · Cerita",
      title: "Skor 78 dan skor 32 — untuk perusahaan yang sama",
      prose: [
        "Dua fund ESG global memegang saham perusahaan semen yang sama. Fund X memasarkannya sebagai “pemimpin transisi energi — skor ESG 78 dari 100”. Fund Y justru memberi skor 32 dengan label “risiko iklim tinggi”. Keduanya memakai data publik yang sama: laporan keberlanjutan, emisi, dan tata kelola perusahaan itu.",
        "Manajer dana yang memegang kedua fund menelepon kedua penyedia skor dan bertanya: siapa yang salah hitung? Jawaban keduanya sama: tidak ada yang salah hitung. Provider A memberi bobot 50% pada “kebijakan dan target transisi” (janji masa depan), provider B memberi bobot 50% pada “emisi aktual per ton semen” (fakta hari ini). Perusahaan itu memang punya target ambisius SEKALIGUS emisi yang masih naik.",
        "Twist-nya: skor ESG bukan termometer yang mengukur suhu objektif — ia CERMIN METODOLOGI. Dua cermin berbeda memantulkan dua wajah berbeda dari perusahaan yang sama. Analis yang memakai skor tanpa membaca metodologinya sedang berinvestasi berdasarkan cermin, bukan bendanya. Lesson ini tentang memakai ESG secara profesional: memahami skor, mendeteksi greenwashing dari data, dan memilih cara integrasi yang jujur.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa skor ESG antar-provider bisa berbeda jauh untuk emiten yang sama; (2) menghitung skor agregat tertimbang dan menunjukkan sensitivitasnya terhadap bobot; (3) mendeteksi greenwashing dengan membandingkan klaim vs data emisi; (4) membedakan empat pendekatan integrasi ESG (eksklusi, tilting, best-in-class, engagement); (5) memutuskan pendekatan yang tepat untuk sebuah mandat dana.",
        "Daftar isi: 1) Cerita dua skor · 2) Modal dasar: tiga pilar ESG · 3) Konsep: cermin metodologi · 4) Rumus skor tertimbang · 5) Lab: bandingkan dua provider + flag greenwashing · 6) Chart sebar skor · 7) Peta keputusan · 8) Mini-case: dana Rp2 triliun · 9) Checkpoint.",
        "Metadata: ±60 menit · 1 lab Python · 1 chart · 6 kuis · 1 mini-case. Prasyarat: tidak ada.",
      ],
      tasks: [],
      reference: "Skor ESG = cermin metodologi, bukan termometer kebenaran.",
    },
    {
      id: "modal-pilar",
      eyebrow: "Langkah 2 · Modal dasar (ringkas, self-contained)",
      title: "Tiga pilar — dan mengapa bobotnya yang menentukan",
      prose: [
        "Fondasi — ESG menilai perusahaan pada tiga pilar. E (Environmental): emisi, penggunaan energi/air, limbah, dan risiko iklim terhadap bisnisnya. S (Social): hubungan karyawan, keselamatan kerja, komunitas, dan rantai pasok. G (Governance): dewan direksi, remunerasi eksekutif, hak pemegang saham, dan anti-korupsi.",
        "Kunci profesionalnya: tidak ada pilar yang “lebih penting” secara universal — MATERIALITAS-nya tergantung sektor. Untuk tambang batu bara, E adalah soal hidup-mati bisnis (risiko stranded asset); untuk bank, G dan S (tata kelola kredit, perlindungan data nasabah) jauh lebih material. Provider yang memberi bobot E besar ke bank sedang mengukur hal yang kurang relevan — dan analis yang tidak menyadarinya sedang memakai penggaris yang salah.",
        "Lesson ini menjawab: bagaimana membaca skor (bukan menelannya), dan bagaimana mengintegrasikan ESG ke portofolio tanpa terjebak greenwashing.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: tanyakan “material untuk SIAPA?”",
        body: "Setiap kali melihat metrik ESG, tanyakan dua hal: material untuk sektor ini? dan material untuk HORIZON investasiku? Risiko iklim 30 tahun penting bagi dana pensiun, kurang relevan bagi trader mingguan. ESG tanpa konteks mandat = angka dekoratif.",
      },
      reference: "Materialitas = sektor × horizon mandat.",
    },
    {
      id: "konsep-cermin",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Si Cermin Metodologi: kenapa dua skor bisa bertolak belakang",
      prose: [
        "Definisi: divergensi skor ESG adalah perbedaan peringkat/skor yang diberikan dua provider untuk emiten yang sama, yang timbul dari tiga sumber — PILIHAN INDIKATOR (provider A memakai 30 indikator, B memakai 80), BOBOT (A menimbang janji transisi, B menimbang emisi aktual), dan SUMBER DATA (laporan perusahaan vs estimasi model vs kontroversi media).",
        "Studi-studi akademik menemukan korelasi antar-provider ESG hanya sekitar 0,5–0,6 — jauh di bawah korelasi antar-lembaga pemeringkat kredit (yang di atas 0,9). Artinya: ketidaksepakatan adalah KONDISI NORMAL, bukan anomali. Analis profesional memperlakukan skor ESG seperti opini analis — satu dari banyak masukan — bukan seperti harga pasar.",
        "Kepribadiannya: skor ESG adalah SI CERMIN METODOLOGI — ia jujur memantulkan apa yang ditanyakan kepadanya. Tanyakan “seberapa ambisius janjinya?”, ia menjawab 78. Tanyakan “seberapa kotor faktanya?”, ia menjawab 32. Kesalahan fatal adalah bertanya pada cermin lalu mengira jawabannya adalah bendanya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “skor ESG tinggi = perusahaan baik, titik”",
        type: "pitfall",
        body: "Yang benar: skor tinggi berarti “skor tinggi MENURUT metodologi itu”. Perusahaan rokok bisa mendapat skor G yang baik; perusahaan batu bara bisa mendapat skor S yang baik karena program komunitasnya. Skor agregat menyembunyikan trade-off antar pilar — analis profesional selalu membuka kapnya dan melihat per pilar.",
      },
      reference: "Korelasi antar-provider ±0,5: ketidaksepakatan adalah kondisi normal.",
    },
    {
      id: "konsep-agregat",
      eyebrow: "Langkah 4 · Konsep inti + rumus",
      title: "Skor tertimbang: kecilkan bobot, berubah ceritanya",
      prose: [
        "Cara provider membangun satu angka dari banyak indikator adalah rata-rata tertimbang — dan di sinilah metodologi “bekerja” secara diam-diam:",
      ],
      formula: String.raw`\text{Skor} = \sum_{i=1}^{n} w_i \cdot s_i \quad \text{dengan} \quad \sum_{i=1}^{n} w_i = 1`,
      formulaNote:
        "s_i = skor indikator ke-i (mis. emisi, keselamatan kerja, independensi dewan), skala 0–100. w_i = bobot indikator — INILAH tempat metodologi bersembunyi. Contoh: perusahaan semen dengan s_emisi=30, s_sosial=70, s_governance=80. Provider A (w = 0,5/0,2/0,3): 0,5×30 + 0,2×70 + 0,3×80 = 15 + 14 + 24 = 53. Provider B (w = 0,2/0,3/0,5): 6 + 21 + 40 = 67. Perusahaan yang sama, selisih 14 poin — hanya karena bobot.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “greenwashing itu soal iklan yang berlebihan”",
        type: "pitfall",
        body: "Yang benar: greenwashing paling berbahaya justru yang BERDATA — “kami menanam 1 juta pohon” (tetapi emisi naik 8%), “net zero 2060” (tetapi belanja modal masih 90% ke batu bara). Deteksinya bukan dari bahasa iklan, melainkan dari KESENJANGAN klaim vs data: tren emisi, alokasi capex, dan target interim yang terukur.",
      },
      reference: "Bobot adalah tempat metodologi bersembunyi — selalu baca.",
    },
    {
      id: "lab-esg",
      eyebrow: "Langkah 5 · Lab",
      title: "Bandingkan dua provider — dan tangkap greenwashing-nya",
      prose: [
        "Lab ini mensimulasikan pekerjaan analis ESG: delapan emiten dinilai dua provider (skor 0–100). Hitung selisih rata-rata absolut kedua skor, lalu hitung peringkat masing-masing emiten di tiap provider dan cari beda peringkat terbesar. Terakhir, jalankan deteksi greenwashing sederhana: emiten yang mengklaim “net zero” TETAPI tren emisinya naik = flag.",
        "Data skornya disengaja ekstrem — SMGR dapat 38 dari A tetapi 80 dari B (beda peringkat 7 posisi!). Inilah divergensi 0,5-an dalam bentuk konkret.",
        "Coba: ubah satu skor provider B agar mendekati A, jalankan ulang, dan lihat selisih rata-rata menyusut. Itulah yang terjadi ketika dua provider memakai metodologi serupa — kesepakatan naik, tetapi belum tentu kebenarannya naik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `selisih_rata` = rata-rata |skor_a − skor_b| atas 8 emiten" },
        { id: "t2", text: "Hitung peringkat tiap emiten per provider (1 = skor tertinggi), lalu `beda_peringkat_maks`" },
        { id: "t3", text: "Bangun `flag_greenwash`: emiten dengan klaim net-zero TETAPI tren emisi > 0; cetak ringkasan persis format contoh" },
      ],
      expected: "Selisih rata-rata: 21.25 poin | Beda peringkat maks: 7 | Flag greenwashing: ['SMGR']",
      code: {
        starter: `# Skor ESG dua provider (0-100) untuk 8 emiten
emiten = ["ADRO", "ANTM", "ASII", "BBCA", "ICBP", "INDF", "SMGR", "TLKM"]
skor_a = [72, 45, 68, 81, 55, 50, 38, 77]
skor_b = [40, 70, 55, 75, 48, 62, 80, 44]

# Klaim "net zero" vs tren emisi tahunan (+ = emisi naik)
klaim_netzero = {"SMGR": True, "ADRO": True}
tren_emisi = {"SMGR": 0.08, "ADRO": -0.03}

def peringkat(skor):
    # 1 = skor tertinggi
    urut = sorted(range(len(skor)), key=lambda i: skor[i], reverse=True)
    rank = [0] * len(skor)
    for r, i in enumerate(urut, start=1):
        rank[i] = r
    return rank

# TULIS KODEMU
selisih_rata =
rank_a =
rank_b =
beda_peringkat_maks =
flag_greenwash =

print(f"Selisih rata-rata: {selisih_rata:.2f} poin | Beda peringkat maks: {beda_peringkat_maks} | Flag greenwashing: {flag_greenwash}")`,
        lockLines: 17,
        solution: `# Skor ESG dua provider (0-100) untuk 8 emiten
emiten = ["ADRO", "ANTM", "ASII", "BBCA", "ICBP", "INDF", "SMGR", "TLKM"]
skor_a = [72, 45, 68, 81, 55, 50, 38, 77]
skor_b = [40, 70, 55, 75, 48, 62, 80, 44]

# Klaim "net zero" vs tren emisi tahunan (+ = emisi naik)
klaim_netzero = {"SMGR": True, "ADRO": True}
tren_emisi = {"SMGR": 0.08, "ADRO": -0.03}

def peringkat(skor):
    # 1 = skor tertinggi
    urut = sorted(range(len(skor)), key=lambda i: skor[i], reverse=True)
    rank = [0] * len(skor)
    for r, i in enumerate(urut, start=1):
        rank[i] = r
    return rank

# TULIS KODEMU
selisih_rata = sum(abs(a - b) for a, b in zip(skor_a, skor_b)) / len(emiten)
rank_a = peringkat(skor_a)
rank_b = peringkat(skor_b)
beda_peringkat_maks = max(abs(a - b) for a, b in zip(rank_a, rank_b))
flag_greenwash = [e for e in emiten if klaim_netzero.get(e) and tren_emisi.get(e, 0) > 0]

print(f"Selisih rata-rata: {selisih_rata:.2f} poin | Beda peringkat maks: {beda_peringkat_maks} | Flag greenwashing: {flag_greenwash}")`,
        checks: [
          { kind: "equal", task: "t1", name: "selisih_rata", value: 21.25, tol: 1e-9, label: "`selisih_rata` = 21,25 poin", msg: "Rata-rata |A−B| atas 8 emiten = 170/8." },
          { kind: "equal", task: "t2", name: "beda_peringkat_maks", value: 7, label: "`beda_peringkat_maks` = 7", msg: "SMGR: peringkat 8 di A vs peringkat 1 di B." },
          { kind: "equal", task: "t3", name: "flag_greenwash", value: ["SMGR"], label: "SMGR ter-flag greenwashing", msg: "Klaim net-zero + emisi naik 8% = kesenjangan klaim vs data." },
          { kind: "stdout_matches", task: "t3", pattern: "Beda peringkat maks: 7 \\| Flag greenwashing: \\['SMGR'\\]", label: "`print` menampilkan ringkasan", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Divergensi diukur, bukan dirasakan — lalu klaim diuji terhadap data.",
    },
    {
      id: "chart-sebar",
      eyebrow: "Langkah 6 · Konsep + chart",
      title: "Peta ketidaksepakatan: semakin jauh dari diagonal, semakin tidak sepakat",
      prose: [
        "Chart sebar di bawah memplot skor provider A (sumbu X) melawan provider B (sumbu Y) untuk 8 emiten. Garis putus-putus diagonal = “sepakat penuh” — titik di garis itu berarti kedua provider memberi skor identik.",
        "Cara membaca chart: posisi titik = kombinasi dua skor satu emiten; jarak tegak lurus dari diagonal = besar ketidaksepakatan. SMGR (merah) adalah titik terjauh: A menilai 38, B menilai 80.",
        "Interpretasi: jika skor ESG adalah “kebenaran”, titik-titik harus menumpuk di diagonal. Kenyataannya menyebar — bukti visual bahwa memakai satu provider tanpa memahami metodologinya sama dengan memilih cermin secara acak. Analis profesional memakai skor sebagai TITIK AWAL investigasi (kenapa SMGR beda jauh?), bukan titik akhir keputusan.",
      ],
      figure: { svg: ESG_SVG, alt: "Diagram sebar skor ESG provider A vs B untuk 8 emiten; titik tersebar jauh dari diagonal, SMGR paling jauh.", caption: "Ketidaksepakatan provider dalam satu gambar: jauh dari diagonal = jauh dari kata sepakat." },
      tasks: [],
      reference: "Jauh dari diagonal = bahan investigasi, bukan bahan keputusan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: empat cara mengintegrasikan ESG",
      prose: [
        "Skenario 1 — Mandat eksplisit “bebas batu bara/tembakau” dari klien → EKSKLUSI: coret sektor dari universe. Alasan: kepatuhan pada mandat mengalahkan optimasi return.",
        "Skenario 2 — Ingin portofolio lebih hijau tanpa mengorbankan diversifikasi → TILTING: overweight emiten berskor ESG baik dalam tiap sektor, underweight yang buruk. Alasan: tetap fully invested, insentif perbaikan menyebar.",
        "Skenario 3 — Sudah memegang emiten “kotor” yang penting secara sistemik → ENGAGEMENT: gunakan hak suara & dialog untuk mendorong transisi, bukan jual. Alasan: menjual hanya memindahkan masalah ke pemilik yang kurang peduli.",
        "Skenario 4 — Klaim dana “ESG” tetapi tidak ada proses yang terdokumentasi → JANGAN pasang label ESG; beri label sesuai proses yang benar-benar dijalankan. Alasan: label tanpa proses = greenwashing di level dana.",
        "Aturan praktis 10 detik: tanyakan dulu MANDAT klien (apa yang dijanjikan?), lalu pilih alatnya — eksklusi untuk janji keras, tilting untuk perbaikan bertahap, engagement untuk posisi yang tidak bisa dijual, dan tidak ada label tanpa proses.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai skor ESG satu provider sebagai “filter otomatis” tanpa membaca metodologi — lalu kaget saat diaudit kenapa emiten X lolos. Skor adalah input, bukan keputusan; keputusan selalu punya nama analis yang menandatanganinya.",
      },
      reference: "Mandat dulu, alat kemudian. Label tanpa proses = greenwashing.",
    },
    {
      id: "minicase-dana",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Dana Rp2 triliun yang “net zero”",
      prose: [
        "Kasus: Sebuah dana pensiun mengklaim portofolio Rp2 triliunnya “selaras net zero 2050”. Audit independen menemukan: 40% portofolio di emiten yang punya target net zero TETAPI tren emisi 3 tahun terakhir NAIK rata-rata 5%/tahun; tidak ada target interim 2030; dan 70% “pengurangan emisi” berasal dari penjualan aset kotor (divestasi) — emisinya tidak hilang dari atmosfer, hanya pindah kepemilikan.",
        "Pertanyaan 1: Di mana letak greenwashing-nya menurut kerangka klaim vs data?",
        "Pertanyaan 2: Tiga perbaikan konkret apa yang membuat klaim itu kredibel?",
        "Pembahasan: (1) Tiga kesenjangan: target tanpa tren yang mendukung (emisi naik vs janji turun), tanpa target interim yang bisa diaudit tahun ini, dan “pengurangan” lewat divestasi — akuntansi karbon, bukan dekarbonisasi. (2) Perbaikan: target interim 2030 yang terukur + dilaporkan tahunan; ukur emisi yang DAPAT DIATRIBUSIKAN ke aktivitas (bukan kepemilikan); engagement dengan 10 emiten terbesar alih-alih menjualnya diam-diam.",
      ],
      tasks: [],
      reference: "Klaim iklim yang kredibel punya target interim, tren yang mendukung, dan tanpa akuntansi karbon.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran — dari divergensi skor hingga integrasi."],
      tasks: [],
      summary: [
        "Skor ESG = cermin metodologi: indikator, bobot, dan sumber data menentukan wajah yang dipantulkan.",
        "Skor agregat = Σ w_i × s_i; bobot adalah tempat metodologi bersembunyi — selalu buka kapnya.",
        "Greenwashing dideteksi dari kesenjangan klaim vs data (tren emisi, capex, target interim), bukan dari bahasa iklan.",
        "Empat alat integrasi: eksklusi, tilting, best-in-class, engagement — dipilih berdasarkan mandat, dan label tanpa proses = greenwashing.",
      ],
      next: { label: "PME3 — Liquidity Risk: Saat Portofolio Tak Bisa Dijual", href: "/learn/pm-e3-liquidity-risk" },
      quiz: [
        {
          q: "Dua provider memberi skor 78 dan 32 untuk emiten yang sama. Penjelasan paling tepat?",
          options: [
            { text: "Salah satu provider salah hitung", why: "Salah: keduanya bisa benar menurut metodologinya — perbedaan bobot dan indikator adalah sumber normal divergensi." },
            { text: "Perbedaan indikator, bobot, dan sumber data antar metodologi", why: "Tepat: skor adalah cermin metodologi — tanyakan apa yang diukur dan bagaimana ditimbang.", correct: true },
            { text: "Emiten memanipulasi salah satu provider", why: "Salah: tidak ada bukti manipulasi; divergensi 0,5-an adalah kondisi normal antar-provider." },
            { text: "Skor ESG tidak ada gunanya sama sekali", why: "Salah: skor berguna sebagai titik awal investigasi — yang berbahaya adalah memakainya sebagai vonis akhir." },
          ],
        },
        {
          q: "Perusahaan: s_emisi=30, s_sosial=70, s_governance=80. Bobot 0,5/0,2/0,3. Skor agregat?",
          options: [
            { text: "60", why: "Salah: itu rata-rata sederhana (30+70+80)/3 — mengabaikan bobot." },
            { text: "53", why: "Tepat: 0,5×30 + 0,2×70 + 0,3×80 = 15 + 14 + 24 = 53.", correct: true },
            { text: "67", why: "Salah: itu hasil bobot 0,2/0,3/0,5 — bobot yang berbeda, cerita yang berbeda." },
            { text: "180", why: "Salah: itu jumlah tanpa pembobotan dan tanpa normalisasi." },
          ],
        },
        {
          q: "Emiten mengklaim “net zero” tetapi tren emisinya +8%/tahun. Menurut kerangka lesson ini…",
          options: [
            { text: "Wajar — transisi butuh waktu", why: "Salah: “butuh waktu” bukan lisensi untuk klaim yang bertentangan dengan data saat ini." },
            { text: "Flag greenwashing: kesenjangan klaim vs data", why: "Tepat: deteksi greenwashing = bandingkan janji dengan tren emisi, capex, dan target interim.", correct: true },
            { text: "Bukti data emisinya salah", why: "Salah: tidak ada alasan mengasumsikan data salah; yang diuji adalah klaimnya." },
            { text: "Tidak relevan selama skor ESG-nya tinggi", why: "Salah: skor tinggi dari satu provider tidak menghapus kesenjangan klaim vs data." },
          ],
        },
        {
          q: "Dana ingin lebih hijau tetapi tetap fully invested dan terdiversifikasi. Pendekatan tepat?",
          options: [
            { text: "Eksklusi seluruh sektor energi", why: "Salah: itu untuk mandat keras; mengorbankan diversifikasi tanpa diminta." },
            { text: "Tilting: overweight skor baik per sektor", why: "Tepat: tetap fully invested, insentif perbaikan menyebar ke semua sektor.", correct: true },
            { text: "Jual semua emiten berskor rendah sekaligus", why: "Salah: fire sale menghancurkan harga dan hanya memindahkan masalah ke pemilik lain." },
            { text: "Pasang label ESG tanpa mengubah proses", why: "Salah: label tanpa proses = greenwashing di level dana." },
          ],
        },
        {
          q: "Untuk bank, pilar ESG yang paling material adalah…",
          options: [
            { text: "E — karena semua perusahaan harus hijau", why: "Salah: materialitas tergantung sektor; untuk bank, risiko iklim langsung pada bisnisnya kecil." },
            { text: "G dan S — tata kelola kredit, perlindungan data nasabah, praktik karyawan", why: "Tepat: risiko terbesar bank ada pada governance dan social, bukan emisi cerobongnya.", correct: true },
            { text: "Sama rata E, S, G untuk semua sektor", why: "Salah: bobot seragam = mengukur hal yang kurang relevan untuk sebagian sektor." },
            { text: "Tidak ada — bank tidak punya risiko ESG", why: "Salah: krisis tata kelola perbankan justru contoh klasik risiko G." },
          ],
        },
        {
          q: "Korelasi antar-provider ESG sekitar 0,5 vs pemeringkat kredit di atas 0,9. Implikasinya bagi analis?",
          options: [
            { text: "Abaikan semua skor ESG", why: "Salah: skor tetap berguna sebagai titik awal — yang harus diubah adalah cara memakainya." },
            { text: "Perlakukan skor sebagai opini yang perlu diverifikasi, bukan fakta final", why: "Tepat: ketidaksepakatan adalah kondisi normal — buka metodologi, bandingkan, lalu putuskan sendiri.", correct: true },
            { text: "Pakai provider dengan skor tertinggi agar portofolio terlihat hijau", why: "Salah: memilih cermin yang paling menyanjung = cherry-picking." },
            { text: "Rata-ratakan semua provider — pasti benar", why: "Salah: rata-rata dari metodologi yang berbeda tidak menghasilkan kebenaran, hanya kompromi." },
          ],
        },
      ],
    },
  ],
};
