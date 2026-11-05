import type { V2Lesson } from "../lib/types";

const FIG_FUSION = `<svg viewBox="0 0 480 280" role="img" aria-label="Tiga tim melebur ke fusion center.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Fusion center: tiga mata menjadi satu</text>
<rect x="20" y="50" width="130" height="60" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="85" y="75" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Fraud</text>
<text x="85" y="95" font-size="10" fill="var(--chart-text)" text-anchor="middle">mule, scam, ATO</text>
<rect x="175" y="50" width="130" height="60" rx="8" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<text x="240" y="75" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Cyber</text>
<text x="240" y="95" font-size="10" fill="var(--chart-text)" text-anchor="middle">SOC, malware, IDS</text>
<rect x="330" y="50" width="130" height="60" rx="8" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="395" y="75" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">AML</text>
<text x="395" y="95" font-size="10" fill="var(--chart-text)" text-anchor="middle">STR, monitoring</text>
<text x="85" y="135" font-size="14" fill="var(--chart-text)" text-anchor="middle">↓</text>
<text x="240" y="135" font-size="14" fill="var(--chart-text)" text-anchor="middle">↓</text>
<text x="395" y="135" font-size="14" fill="var(--chart-text)" text-anchor="middle">↓</text>
<rect x="140" y="150" width="200" height="70" rx="10" fill="var(--chart-text)" opacity="0.12" stroke="var(--chart-text)" stroke-width="2"/>
<text x="240" y="178" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">FUSION CENTER</text>
<text x="240" y="200" font-size="10" fill="var(--chart-text)" text-anchor="middle">korelasi alert · intel bersama · eskalasi satu pintu</text>
<text x="20" y="250" font-size="11" fill="var(--chart-text)">Satu serangan, tiga jejak — hanya terlihat utuh bila digabung.</text>
</g>
</svg>`;

const FIG_TIMELINE = `<svg viewBox="0 0 480 260" role="img" aria-label="Linimasa serangan terkoordinasi lintas tiga tim.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Pukul 02.14 — satu serangan, tiga jejak</text>
<line x1="40" y1="60" x2="440" y2="60" stroke="var(--chart-text)" stroke-width="2" opacity="0.4"/>
<circle cx="80" cy="60" r="8" fill="var(--c3)"/>
<text x="80" y="90" font-size="10" fill="var(--chart-text)" text-anchor="middle">02.14</text>
<text x="80" y="105" font-size="10" fill="var(--chart-text)" text-anchor="middle">Cyber: malware</text>
<circle cx="220" cy="60" r="8" fill="var(--c1)"/>
<text x="220" y="90" font-size="10" fill="var(--chart-text)" text-anchor="middle">02.41</text>
<text x="220" y="105" font-size="10" fill="var(--chart-text)" text-anchor="middle">Fraud: mule aktif</text>
<circle cx="360" cy="60" r="8" fill="var(--c4)"/>
<text x="360" y="90" font-size="10" fill="var(--chart-text)" text-anchor="middle">03.05</text>
<text x="360" y="105" font-size="10" fill="var(--chart-text)" text-anchor="middle">AML: structuring</text>
<text x="40" y="150" font-size="11" fill="var(--chart-text)">Tanpa fusion: tiga insiden terpisah, tiga antrean.</text>
<text x="40" y="172" font-size="11" fill="var(--chart-text)">Dengan fusion: SATU kampanye — dibekukan pukul 03.20.</text>
<text x="40" y="205" font-size="11" fill="var(--chart-text)" font-weight="bold">Selisihnya: 51 menit vs 3 hari.</text>
<text x="40" y="230" font-size="10" fill="var(--chart-text)" opacity="0.75">Ilustrasi pola serangan ransomware + pencucian terkoordinasi.</text>
</g>
</svg>`;

export const aml17: V2Lesson = {
  slug: "aml17-fusion-center",
  track: "Fraud & AML Analytics",
  module: "Anti-Financial Crime",
  title: "AML17 — Fusion Center: Ketika Fraud, Cyber, dan AML Satu Meja",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pukul 02.14",
      prose: [
        "Pukul 02.14, SOC Bank Nusantara mendeteksi malware di workstation teller. Pukul 02.41, tim fraud melihat 40 rekening mule aktif serentak — pola yang belum pernah terjadi. Pukul 03.05, sistem AML menandai structuring: setoran tunai Rp95 juta berulang ke rekening yang sama. Tiga tim, tiga alert, tiga antrean investigasi.",
        "Twist-nya: itu SATU serangan. Ransomware melumpuhkan, mule memindahkan, structuring mencuci. Di bank tanpa fusion center, ketiga tim baru menyadari keterkaitannya tiga hari kemudian — setelah dana Rp12 miliar lenyap ke luar negeri. Di bank dengan fusion center, korelasi alert otomatis menandai 'satu kampanye' pukul 03.12, dan rekening dibekukan pukul 03.20. Selisihnya: 51 menit vs 3 hari. Selisihnya: Rp12 miliar.",
        "Lesson ini tentang model organisasi anti-financial crime: fusion center. Setelah lesson ini kamu bisa: (1) menjelaskan arsitektur fusion center (people–process–technology); (2) merancang aturan korelasi alert lintas tim; (3) menyusun alur eskalasi gabungan dengan SLA; (4) mengukur efektivitas fusion dengan metrik yang tepat.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "CAMS edisi ke-7 memperluas cakupan dari AML murni ke spektrum anti-financial crime — dan fusion center adalah jawaban organisasionalnya. Kejahatan modern tidak mengenal sekat tim; pertahanan yang bersekat akan selalu kalah cepat. Analis yang paham fusion memahami masa depan profesi ini.",
      },
      reference: "Satu serangan, tiga jejak. Fusion = korelasi + eskalasi satu pintu.",
    },
    {
      id: "arsitektur",
      eyebrow: "Langkah 2 · Konsep",
      title: "People, process, technology",
      prose: [
        "Fusion center bukan ruangan — ia sistem operasi. People: analis fraud, analis SOC, analis AML duduk dalam satu tim (fisik atau virtual) dengan wewenang lintas fungsi; ada 'duty officer' 24/7 yang bisa memicu pembekuan. Process: taksonomi alert bersama (satu bahasa untuk 'serangan'), matriks eskalasi tunggal, SLA per tingkat keparahan. Technology: platform korelasi yang menggabungkan feed tiga tim ke satu entity graph — rekening, perangkat, IP yang sama otomatis terhubung.",
        "Kepribadiannya: fusion center adalah 'ruang perang', bukan 'rapat koordinasi'. Rapat koordinasi berbagi informasi minggu depan; ruang perang berbagi dalam menit. Perbedaannya bukan niat — melainkan wewenang dan tooling.",
        "Tiga miskonsepsi. Satu: 'Fusion = grup chat bersama.' Grup chat tanpa wewenang pembekuan dan tanpa korelasi otomatis = rapat yang lebih cepat, bukan fusion. Dua: 'Hanya untuk bank besar.' Prinsipnya skala-independent: bank kecil bisa fusion virtual (duty officer + playbook + korelasi sederhana). Tiga: 'Teknologi dulu, orang kemudian.' Urutan yang benar: proses dan wewenang dulu — tool mahal tanpa wewenang = dashboard yang indah dan tidak berguna.",
        "Kadensi operasional fusion yang sehat: huddle 15 menit tiap pagi (tiga tim meninjau kampanye terbuka), review intel mingguan (pola baru, penyesuaian aturan korelasi), dan tabletop exercise kuartalan (simulasi serangan penuh). Tanpa kadensi, fusion meluruh menjadi tiga tim yang kebetulan duduk berdekatan. Dengan kadensi, ia menjadi otot — semakin sering dipakai, semakin cepat.",
      ],
      figure: {
        svg: FIG_FUSION,
        alt: "Tiga tim melebur ke fusion center.",
        caption: "Satu serangan, tiga jejak — hanya terlihat utuh bila digabung.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kami sudah koordinasi — tiap Jumat ada sync fraud-AML-cyber.” Sync mingguan tidak menangkap serangan yang selesai dalam 51 menit. Koordinasi periodik ≠ fusion operasional. Ujinya: berapa menit dari alert ketiga hingga keputusan pembekuan?",
      },
      hints: [
        "Mulai dari wewenang: siapa yang boleh membekukan rekening pukul 03.20 tanpa menunggu direksi?",
        "Taksonomi bersama dulu, tool kemudian — 'kampanye' harus berarti sama bagi tiga tim.",
      ],
      reference: "Fusion = wewenang + taksonomi + korelasi. Bukan grup chat.",
    },
    {
      id: "korelasi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Aturan korelasi: kapan tiga menjadi satu",
      prose: [
        "Jantung teknis fusion adalah aturan korelasi: kapan alert dari tim berbeda dinyatakan satu kampanye? Aturan praktis: (1) entitas sama (rekening/perangkat/IP/nama) muncul di ≥2 feed dalam jendela 24 jam; (2) pola waktu berurutan (cyber → fraud → AML, seperti rantai serangan); (3) skor gabungan = jumlah terbobot melampaui ambang. Ketiganya harus bisa dijelaskan ke auditor — bukan black box.",
        "Contoh: PT Maju muncul di feed cyber (malware, 02.14), fraud (mule, 02.41), AML (structuring, 03.05) — tiga feed, satu entitas, urutan rantai serangan → skor fusion MAKSIMUM → eskalasi otomatis ke duty officer. Inilah yang dihitung lab pertama.",
        "Dua miskonsepsi. Satu: 'Korelasi = kecocokan nama persis.' Entitas memakai alias, variasi ejaan, rekening berbeda — butuh entity resolution (fuzzy matching, graph), bukan string match. Dua: 'Semakin banyak aturan semakin baik.' Aturan berlebihan = alert fatigue fusion — mulai dari sedikit aturan presisi tinggi, tambah bertahap.",
        "Entity resolution dalam praktik: mulai dari pencocokan deterministik (nomor rekening, NIK, device fingerprint — pasti sama = pasti satu entitas), lanjut ke probabilistik (nama mirip + alamat sama + pola transaksi sama = kemungkinan besar satu entitas, dengan skor keyakinan). Setiap tautan probabilistik dicatat dengan skornya — auditor harus bisa melihat MENGAPA dua entitas dinyatakan sama. Aturan praktis: deterministik untuk eskalasi otomatis, probabilistik untuk antrean verifikasi manusia.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kita korelasikan SEMUA alert.” Korelasi total = noise total. Mulai dari pola rantai serangan yang sudah dikenal (cyber→fraud→AML), bukan dari semua kombinasi. Presisi dulu, cakupan kemudian.",
      },
      hints: [
        "Jendela 24 jam adalah titik awal yang wajar — terlalu pendek melewatkan, terlalu panjang berisik.",
        "Bobot feed: alert cyber berbobot lebih untuk deteksi dini (ia paling awal dalam rantai).",
      ],
      reference: "Entitas sama + ≥2 feed + 24 jam + urutan rantai = satu kampanye.",
    },
    {
      id: "eskalasi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Eskalasi satu pintu dengan SLA",
      prose: [
        "Deteksi tanpa eskalasi = trivia. Matriks eskalasi fusion: Level 1 (skor rendah) → analis gabungan memverifikasi dalam 4 jam. Level 2 (skor sedang / dua feed) → duty officer + pembatasan transaksi sementara, SLA 1 jam. Level 3 (tiga feed / rantai serangan) → pembekuan + notifikasi direksi + persiapan STR, SLA 30 menit. Setiap level punya pemilik keputusan yang jelas — tidak ada 'menunggu semua setuju'.",
        "Kepribadian SLA: ia adalah 'kontrak kecepatan'. Tanpa SLA tertulis, eskalasi bergantung pada keberanian individu — dan orang cenderung menunggu. Dengan SLA, menunggu melewati batas = pelanggaran prosedur. Sistem yang baik tidak mengandalkan keberanian.",
        "Dua miskonsepsi. Satu: 'Pembekuan butuh persetujuan direksi.' Untuk level 3, wewenang didelegasikan ke duty officer — direksi dinotifikasi, bukan dimintai izin. Kecepatan adalah fiturnya. Dua: 'SLA = target aspirasional.' SLA fusion adalah prosedur operasional — dilanggar = insiden tersendiri yang diinvestigasi.",
        "Sisi hukum yang wajib dipahami analis: pembekuan dana punya dasar hukum (di Indonesia antara lain ketentuan TPPU dan kewenangan PPATK/OJK), tetapi pembekuan yang salah sasaran bisa digugat nasabah. Itulah mengapa dokumentasi eskalasi harus rapi: skor fusion berapa, aturan korelasi mana yang terpicu, siapa memutuskan, kapan. Dokumentasi ini bukan birokrasi — ia adalah tameng hukum. Duty officer yang membekukan tanpa dokumentasi = pahlawan tanpa baju zirah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dokumentasikan setiap eskalasi: siapa memutuskan, kapan, berdasarkan skor apa. Dokumentasi ini adalah perisaimu saat nasabah menuntut atas pembekuan — dan bukti untuk regulator bahwa program AFC-mu hidup, bukan sekadar dokumen.",
      },
      hints: [
        "Latih eskalasi dengan tabletop exercise tiap kuartal — prosedur yang tidak dilatih tidak akan jalan saat krisis.",
        "Catat false positive eskalasi juga — ia mengkalibrasi ambang, bukan kegagalan.",
      ],
      reference: "Level 3 = bekukan dalam 30 menit. Wewenang didelegasikan, bukan menunggu.",
    },
    {
      id: "lab-korelasi",
      eyebrow: "Langkah 5 · Lab",
      title: "Korelasi alert lintas tiga feed",
      prose: [
        "Delapan alert dari tiga tim. Tugasmu: gabungkan per entitas, hitung berapa feed berbeda yang menyebutnya, dan tandai entitas dengan alert dari ≥2 feed sebagai 'fusion'. PT Maju seharusnya menyala — ia muncul di ketiga feed.",
        "Eksperimen: tambahkan satu alert fiktif untuk 'PT Mundur' dari tim cyber, jalankan ulang. Apakah ia naik menjadi fusion? Inilah sensitivitas aturan: ambang ≥2 feed adalah keputusan kebijakan — dokumentasikan alasannya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung per entitas: jumlah alert dan jumlah tim berbeda, simpan ke dict `hasil`" },
        { id: "t2", text: "Tandai entitas dengan >=2 tim sebagai 'fusion', cetak ringkasannya" },
      ],
      expected: "PT Maju: 4 alert, 3 tim -> FUSION\nPT Mundur: 1 alert, 1 tim -> biasa\nCV Lain: 1 alert, 1 tim -> biasa",
      note: {
        title: "💡 Intuisi",
        body: "Tiga alert terpisah terlihat seperti tiga masalah kecil. Digabung per entitas, ia menjadi satu masalah besar. Korelasi bukan menambah informasi — ia mengungkap struktur yang sudah ada di data.",
      },
      hints: [
        "Gunakan dict: entitas -> set() tim, lalu hitung len(set).",
        "fusion = len(tim_set) >= 2.",
      ],
      code: {
        starter: "# (id_alert, tim, entitas). JANGAN UBAH.\nalerts = [(\"F-101\", \"fraud\", \"PT Maju\"), (\"C-201\", \"cyber\", \"PT Maju\"),\n          (\"A-301\", \"aml\", \"PT Maju\"), (\"F-102\", \"fraud\", \"PT Mundur\"),\n          (\"C-202\", \"cyber\", \"PT Maju\"), (\"A-302\", \"aml\", \"CV Lain\")]\n\n# TULIS KODEMU: agregasi per entitas; fusion bila >=2 tim berbeda\nentitas_tim = {}\nfor _id, tim, ent in alerts:\n    entitas_tim.setdefault(ent, set()).add(tim)\nhasil = {}\nfor ent, tims in entitas_tim.items():\n    n = \n    status = \n    hasil[ent] = (n, len(tims))\n    print(f\"{ent}: {n} alert, {len(tims)} tim -> {status}\")\n",
        lockLines: 8,
        solution: "# (id_alert, tim, entitas). JANGAN UBAH.\nalerts = [(\"F-101\", \"fraud\", \"PT Maju\"), (\"C-201\", \"cyber\", \"PT Maju\"),\n          (\"A-301\", \"aml\", \"PT Maju\"), (\"F-102\", \"fraud\", \"PT Mundur\"),\n          (\"C-202\", \"cyber\", \"PT Maju\"), (\"A-302\", \"aml\", \"CV Lain\")]\n\n# TULIS KODEMU: agregasi per entitas; fusion bila >=2 tim berbeda\nentitas_tim = {}\nfor _id, tim, ent in alerts:\n    entitas_tim.setdefault(ent, set()).add(tim)\nhasil = {}\nfor ent, tims in entitas_tim.items():\n    n = sum(1 for _id, _t, e in alerts if e == ent)\n    status = \"FUSION\" if len(tims) >= 2 else \"biasa\"\n    hasil[ent] = (n, len(tims))\n    print(f\"{ent}: {n} alert, {len(tims)} tim -> {status}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "PT Maju FUSION 3 tim", msg: "4 alert, 3 tim.", pattern: "PT Maju: 4 alert, 3 tim -> FUSION" },
          { kind: "stdout_matches", task: "t2", label: "PT Mundur biasa", msg: "Hanya 1 tim.", pattern: "PT Mundur: 1 alert, 1 tim -> biasa" },
          { kind: "stdout_matches", task: "t2", label: "CV Lain biasa", msg: "Hanya 1 tim.", pattern: "CV Lain: 1 alert, 1 tim -> biasa" },
        ],
      },
      reference: "Agregasi per entitas; ≥2 tim = FUSION.",
    },
    {
      id: "lab-sla",
      eyebrow: "Langkah 6 · Lab",
      title: "Simulasi SLA eskalasi",
      prose: [
        "Lima kampanye terdeteksi dengan skor fusion dan waktu deteksi. Terapkan matriks eskalasi: skor ≥8 → Level 3 (SLA 30 menit), skor ≥5 → Level 2 (SLA 60 menit), selainnya Level 1 (SLA 240 menit). Hitung batas waktu respons tiap kampanye dan tandai yang melewati 'sekarang' (asumsikan sekarang = menit ke-300 sejak tengah malam).",
        "Perhatikan kampanye K-103: terdeteksi pukul 04.10 dengan skor 9 — Level 3, batas respons 04.40. Jika sekarang 05.00, ia sudah breach. Inilah dashboard yang dilihat duty officer setiap pagi.",
      ],
      tasks: [
        { id: "t1", text: "Tentukan level & SLA tiap kampanye dari skornya, simpan ke dict `hasil`" },
        { id: "t2", text: "Hitung batas respons (deteksi + SLA) dan tandai BREACH bila > menit 300" },
      ],
      expected: "K-101: L1, batas 400 -> OK\nK-102: L2, batas 301 -> OK\nK-103: L3, batas 280 -> BREACH\nK-104: L2, batas 330 -> OK\nK-105: L1, batas 500 -> OK",
      note: {
        title: "💡 Intuisi",
        body: "SLA mengubah 'segera' menjadi angka. 'Segera' bisa berarti besok; '30 menit' berarti 30 menit. Analis yang bekerja dengan angka bisa diukur — dan yang bisa diukur bisa diperbaiki.",
      },
      hints: [
        "level = 'L3' jika skor>=8, 'L2' jika skor>=5, else 'L1'.",
        "sla = {'L3':30,'L2':60,'L1':240}; batas = deteksi + sla.",
      ],
      code: {
        starter: "# (id, skor, menit_deteksi). JANGAN UBAH. Sekarang = menit 300.\nkampanye = [(\"K-101\", 3, 160), (\"K-102\", 6, 241), (\"K-103\", 9, 250),\n            (\"K-104\", 5, 270), (\"K-105\", 2, 260)]\nSEkarang = 300\n\n# TULIS KODEMU: level, SLA, batas respons, status OK/BREACH\nhasil = {}\nfor kid, skor, det in kampanye:\n    level = \n    sla = \n    batas = det + sla\n    status = \"BREACH\" if batas <= SEkarang else \"OK\"\n    hasil[kid] = (level, batas)\n    print(f\"{kid}: {level}, batas {batas} -> {status}\")\n",
        lockLines: 9,
        solution: "# (id, skor, menit_deteksi). JANGAN UBAH. Sekarang = menit 300.\nkampanye = [(\"K-101\", 3, 160), (\"K-102\", 6, 241), (\"K-103\", 9, 250),\n            (\"K-104\", 5, 270), (\"K-105\", 2, 260)]\nSEkarang = 300\n\n# TULIS KODEMU: level, SLA, batas respons, status OK/BREACH\nhasil = {}\nfor kid, skor, det in kampanye:\n    level = \"L3\" if skor >= 8 else (\"L2\" if skor >= 5 else \"L1\")\n    sla = {\"L3\": 30, \"L2\": 60, \"L1\": 240}[level]\n    batas = det + sla\n    status = \"BREACH\" if batas <= SEkarang else \"OK\"\n    hasil[kid] = (level, batas)\n    print(f\"{kid}: {level}, batas {batas} -> {status}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "K-103 Level 3 BREACH", msg: "Skor 9 >= 8, batas 280 <= 300.", pattern: "K-103: L3, batas 280 -> BREACH" },
          { kind: "stdout_matches", task: "t2", label: "K-102 masih OK", msg: "Batas 301 > 300 (sekarang) — belum breach.", pattern: "K-102: L2, batas 301 -> OK" },
          { kind: "stdout_matches", task: "t1", label: "K-101 Level 1", msg: "Skor 3 < 5.", pattern: "K-101: L1, batas 400 -> OK" },
        ],
      },
      reference: "Skor→level→SLA→batas. Batas ≤ sekarang = BREACH.",
    },
    {
      id: "lab-entity",
      eyebrow: "Langkah 7 · Lab",
      title: "Resolusi entitas: 'Djaja' vs 'Jaya'",
      prose: [
        "Penyerang mengeja namanya 'PT Maju Djaja' di satu feed dan 'PT Maju Jaya' di feed lain — kecocokan string persis gagal, kampanye tidak terkorelasi. Tugasmu: normalisasi nama (lowercase, buang 'PT'/'CV') lalu cari kecocokan terbaik dengan SequenceMatcher; nyatakan MATCH bila ratio ≥ 0,8.",
        "Perhatikan 'CV Lain': kecocokan terbaiknya hanya 0,15 → beda entitas. Ambang 0,8 adalah keputusan kebijakan: terlalu rendah = entitas berbeda digabung (false merge berbahaya); terlalu tinggi = alias lolos. Eksperimen: turunkan ambang ke 0,5 — apa yang berubah?",
      ],
      tasks: [
        { id: "t1", text: "Normalisasi nama & hitung ratio kecocokan tiap nama feed_b ke feed_a" },
        { id: "t2", text: "Tandai MATCH bila ratio >= 0.8, cetak hasilnya" },
      ],
      expected: "PT Maju Jaya -> PT Maju Jaya (1.0) : MATCH\nPT Maju Djaja -> PT Maju Jaya (0.84) : MATCH\nCV Lain -> PT Maju Jaya (0.15) : beda entitas",
      note: {
        title: "💡 Intuisi",
        body: "Entity resolution adalah 'penerjemah' fusion center: ia membuat 'Djaja' dan 'Jaya' menjadi satu orang di mata sistem. Tanpa ini, korelasi hanya menangkap penyerang yang malas mengganti ejaan.",
      },
      hints: [
        "norm: lowercase, hapus 'pt '/'cv ', rapikan spasi ganda.",
        "difflib.SequenceMatcher(None, a, b).ratio() -> 0..1.",
      ],
      code: {
        starter: "import difflib\n\n# Daftar nama dari dua feed. JANGAN UBAH.\nfeed_a = [\"PT Maju Jaya\", \"PT Mundur Teratur\"]\nfeed_b = [\"PT Maju Jaya\", \"PT Maju Djaja\", \"CV Lain\"]\n\ndef norm(nama):\n    n = nama.lower()\n    for p in [\"pt \", \"cv \"]:\n        n = n.replace(p, \"\")\n    return \" \".join(n.split())\n\n# TULIS KODEMU: kecocokan terbaik tiap nama feed_b; MATCH bila ratio >= 0.8\nhasil = {}\nfor nb in feed_b:\n    terbaik, r = max(\n        ((na, difflib.SequenceMatcher(None, norm(na), norm(nb)).ratio()) for na in feed_a),\n        key=lambda x: x[1])\n    status = \n    hasil[nb] = (terbaik, round(r, 2))\n    print(f\"{nb} -> {terbaik} ({round(r, 2)}) : {status}\")\n",
        lockLines: 13,
        solution: "import difflib\n\n# Daftar nama dari dua feed. JANGAN UBAH.\nfeed_a = [\"PT Maju Jaya\", \"PT Mundur Teratur\"]\nfeed_b = [\"PT Maju Jaya\", \"PT Maju Djaja\", \"CV Lain\"]\n\ndef norm(nama):\n    n = nama.lower()\n    for p in [\"pt \", \"cv \"]:\n        n = n.replace(p, \"\")\n    return \" \".join(n.split())\n\n# TULIS KODEMU: kecocokan terbaik tiap nama feed_b; MATCH bila ratio >= 0.8\nhasil = {}\nfor nb in feed_b:\n    terbaik, r = max(\n        ((na, difflib.SequenceMatcher(None, norm(na), norm(nb)).ratio()) for na in feed_a),\n        key=lambda x: x[1])\n    status = \"MATCH\" if r >= 0.8 else \"beda entitas\"\n    hasil[nb] = (terbaik, round(r, 2))\n    print(f\"{nb} -> {terbaik} ({round(r, 2)}) : {status}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Djaja MATCH Jaya", msg: "Ratio 0.84 >= 0.8.", pattern: "PT Maju Djaja -> PT Maju Jaya.*MATCH" },
          { kind: "stdout_matches", task: "t2", label: "CV Lain beda entitas", msg: "Ratio 0.15 < 0.8.", pattern: "CV Lain -> PT Maju Jaya.*beda entitas" },
          { kind: "stdout_matches", task: "t1", label: "Identik MATCH 1.0", msg: "Nama persis.", pattern: "PT Maju Jaya -> PT Maju Jaya.*MATCH" },
        ],
      },
      reference: "Normalisasi + SequenceMatcher ≥ 0,8 = MATCH.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Alert masuk: respons fusion apa",
      prose: [
        "Satu: alert menyebut entitas yang sudah ada di feed lain dalam 24 jam → nyatakan KAMPANYE, skor gabungan, eskalasi per matriks. Dua: alert tunggal tanpa korelasi → antrean tim masing-masing seperti biasa. Tiga: skor ≥8 (tiga feed / rantai serangan) → Level 3: bekukan + notifikasi direksi + siapkan STR, 30 menit. Empat: breach SLA → investigasi prosedur tersendiri; jangan biarkan 'telat' menjadi normal baru.",
        "Aturan praktis 10 detik: korelasi dulu, eskalasi per level, breach = insiden. Fusion yang baik membosankan: alert masuk, level keluar, tindakan jalan.",
        "Satu skenario yang sering salah ditangani: alert cyber tentang malware TETAPI belum ada jejak fraud/AML. Responsnya bukan 'tunggu sampai ada' — melainkan pantau diperketat (enhanced monitoring) pada entitas terkait selama 72 jam. Rantai serangan dimulai dari cyber; menunggu jejak lengkap = menunggu kerugian.",
        "Lima: kampanye selesai ditangani → post-mortem dalam 5 hari kerja: apa yang terdeteksi duluan, berapa lama tiap tahap, aturan korelasi mana yang bekerja dan mana yang luput. Post-mortem bukan mencari kesalahan — ia mengkalibrasi sistem. Fusion center yang tidak pernah merevisi aturannya sedang membusuk perlahan.",
        "Enam: ingat batas privasi dan proporsionalitas. Korelasi lintas feed berarti analis fraud bisa melihat data yang dulunya milik tim cyber — tetapkan akses berbasis peran dan audit trail. Fusion memperluas visibilitas; ia harus sekaligus memperketat akuntabilitas. Kekuatan tanpa pengawasan = risiko insider baru.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ukur fusion dengan metrik yang tepat: waktu dari alert ketiga ke keputusan (bukan jumlah alert), persentase kampanye terdeteksi sebelum kerugian (bukan sesudah), dan false positive eskalasi Level 3 (harus rendah — pembekuan salah itu mahal). Metrik yang salah = fusion yang terlihat sibuk tapi tidak efektif.",
      },
      reference: "Korelasi → level → SLA. Pantau diperketat untuk jejak tunggal.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Serangan fajar di Bank Artha Dana",
      prose: [
        "Senin 04.00: SOC mendeteksi credential stuffing ke mobile banking (12.000 percobaan, 300 berhasil). 04.25: tim fraud melihat 300 rekening baru langsung transfer ke 5 rekening penampung. 04.50: AML menandai 5 rekening penampung menerima total Rp4,2 miliar lalu memecahnya ke 60 rekening. Duty officer baru 2 minggu menjabat.",
        "Pertanyaan: (a) Level eskalasi apa? (b) Tindakan 30 menit pertama? Pembahasan: (a) Tiga feed + urutan rantai serangan klasik (cyber → fraud → AML) → skor maksimum → LEVEL 3. (b) Bekukan 5 rekening penampung + 60 rekening tujuan SEGERA (wewenang duty officer, tanpa menunggu direksi); notifikasi direksi + tim legal; blokir pola credential stuffing di WAF; siapkan STR. Menunggu 'konfirmasi lengkap' = memberi 60 rekening waktu menghilang. Fusion center ada precisely untuk keputusan seperti ini: cepat, terdokumentasi, berwewenang.",
        "Pertanyaan lanjutan untuk diskusi tim: (c) Bagaimana jika 60 rekening tujuan ternyata milik nasabah sah yang tertipu (korban, bukan pelaku)? Pembahasan: pembekuan sementara tetap benar — ia melindungi korban juga (dana tidak bisa diteruskan). Bedakan perlakuan: korban = buka blokir setelah verifikasi + edukasi; pelaku = bekukan + STR + lapor. Kecepatan pembekuan tidak mengorbankan keadilan — yang membedakan adalah apa yang terjadi SETELAH pembekuan: investigasi yang cermat, bukan asumsi bersalah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan: duty officer 'baru 2 minggu' tetap bisa bertindak — karena wewenangnya dari prosedur, bukan dari senioritas. Inilah inti fusion: sistem yang membuat orang biasa bisa mengambil keputusan luar biasa cepat.",
      },
      reference: "Tiga feed + rantai = Level 3. Bekukan dulu, dokumentasikan, notifikasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor \u2265 4 dari 5.",
      ],
      summary: [
        "Kriteria kampanye: entitas sama + ≥2 feed berbeda dalam jendela 24 jam + urutan rantai cyber→fraud→AML = SATU kampanye; 3 alert terkorelasi lebih penting dari 100 yang acak.",
        "Korelasi total = noise total: mulai dari pola rantai serangan yang sudah dikenal, dan boboti alert cyber lebih untuk deteksi dini.",
        "Entity resolution: pencocokan deterministik dulu (rekening, NIK, device fingerprint), lalu fuzzy — 'Djaja' 0,84 = MATCH, 'CV Lain' 0,15 = beda entitas; ambang 0,8 adalah keputusan kebijakan.",
        "Matriks eskalasi terukur: skor ≥8 = Level 3 (pembekuan dalam 30 menit, wewenang duty officer), skor ≥5 = Level 2, rendah = Level 1 (verifikasi 4 jam); deteksi tanpa eskalasi = trivia.",
        "Ukur kecepatan, bukan kesibukan: waktu dari alert ketiga ke keputusan dan % kampanye terdeteksi sebelum kerugian; catat false positive untuk kalibrasi ambang.",
        "Fusion = wewenang + korelasi otomatis + SLA — bukan grup chat atau rapat koordinasi rutin.",
      ],
      quiz: [
        {
          q: "Kapan beberapa alert dari tim berbeda dinyatakan SATU kampanye?",
          options: [
            { text: "Entitas sama muncul di ≥2 feed dalam jendela waktu + pola urutan rantai serangan", why: "Benar: kriteria objektif (entitas + feed + waktu + urutan) yang bisa diotomasi.", correct: true },
            { text: "Ketiga tim mengadakan rapat dan sepakat itu satu kampanye", why: "Kesepakatan rapat = subjektif dan lambat; korelasi harus otomatis." },
            { text: "Jumlah alert total melebihi 10 dalam sehari", why: "Volume bukan kriteria — 3 alert terkorelasi lebih penting dari 100 yang acak." },
            { text: "Salah satu tim menyatakan alert-nya berprioritas tinggi", why: "Prioritas satu tim tidak membuktikan keterkaitan antar tim." },
          ],
        },
        {
          q: "Apa pembeda utama fusion center dibanding 'rapat koordinasi rutin'?",
          options: [
            { text: "Wewenang keputusan cepat (mis. pembekuan) + korelasi otomatis + SLA", why: "Benar: tiga pembeda struktural — wewenang, tooling, dan kecepatan terukur.", correct: true },
            { text: "Ruangannya lebih besar dan ada layar video wall", why: "Fasilitas fisik bukan pembeda operasional." },
            { text: "Melibatkan lebih banyak manajer senior", why: "Fusion justru mendelegasikan ke duty officer, bukan menambah lapisan." },
            { text: "Frekuensi rapat yang lebih sering", why: "Rapat lebih sering tetap rapat — tanpa wewenang dan SLA tidak menjadi fusion." },
          ],
        },
        {
          q: "Kampanye terdeteksi dengan skor 9. Level dan SLA yang benar:",
          options: [
            { text: "Level 3 — pembekuan + notifikasi direksi, SLA 30 menit", why: "Benar: skor ≥8 = Level 3; wewenang di duty officer.", correct: true },
            { text: "Level 2 — pantau dulu 24 jam, SLA 1 jam", why: "Level 2 untuk skor 5-7; skor 9 butuh respons lebih cepat." },
            { text: "Level 1 — verifikasi analis, SLA 4 jam", why: "Level 1 untuk skor rendah; terlalu lambat untuk kampanye terkonfirmasi." },
            { text: "Menunggu persetujuan direksi sebelum bertindak", why: "Level 3 mendelegasikan wewenang — menunggu = melanggar SLA." },
          ],
        },
        {
          q: "Alert cyber (malware) muncul TETAPI belum ada jejak fraud/AML. Respons fusion yang tepat:",
          options: [
            { text: "Enhanced monitoring 72 jam pada entitas terkait — rantai serangan dimulai dari cyber", why: "Benar: jejak tunggal = pantau diperketat; cyber adalah awal rantai.", correct: true },
            { text: "Abaikan sampai ada alert fraud/AML yang berkorelasi", why: "Menunggu jejak lengkap = menunggu kerugian terjadi." },
            { text: "Langsung bekukan semua rekening terkait", why: "Berlebihan untuk jejak tunggal — bekukan butuh korelasi memadai." },
            { text: "Tutup tiket cyber karena tidak ada dampak finansial", why: "Dampak finansial datang belakangan; menutup tiket = buta." },
          ],
        },
        {
          q: "Metrik efektivitas fusion center yang PALING tepat:",
          options: [
            { text: "Waktu dari alert ketiga ke keputusan + % kampanye terdeteksi sebelum kerugian", why: "Benar: mengukur kecepatan dan pencegahan — tujuan fusion.", correct: true },
            { text: "Jumlah alert yang diproses per hari", why: "Volume = kesibukan, bukan efektivitas." },
            { text: "Jumlah rapat koordinasi per minggu", why: "Rapat bukan hasil; fusion yang baik justru mengurangi rapat." },
            { text: "Jumlah analis di masing-masing tim", why: "Headcount bukan metrik kinerja operasional." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Fusion butuh investasi besar dulu baru jalan.” Mulai dari yang murah: duty officer + matriks eskalasi tertulis + korelasi spreadsheet per entitas. Tool mahal menguatkan fusion yang sudah berjalan — ia tidak menciptakan fusion dari nol.",
      },
      hints: [
        "Uji pemahaman: bisakah kamu menjelaskan ke teman kenapa 'grup chat bersama' bukan fusion?",
        "Ingat angka mini-case: 51 menit vs 3 hari — itulah nilai fusion.",
      ],
      reference: "Korelasi + wewenang + SLA = fusion. Ukur kecepatan, bukan kesibukan.",
    },
  ],
};
