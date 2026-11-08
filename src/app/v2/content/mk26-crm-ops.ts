import type { V2Lesson } from "../lib/types";

const FIG_LIFECYCLE = `<svg viewBox="0 0 560 340" role="img" aria-label="Distribusi segmen lifecycle 12 user contoh dan aturan frequency cap.">
<g font-family="var(--font-ui)">
<text x="14" y="26" font-size="13" fill="var(--chart-text)" font-weight="bold">Segmen lifecycle 12 user: siapa boleh terima kampanye?</text>
<line x1="60" y1="290" x2="540" y2="290" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="60" y1="290" x2="60" y2="40" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="20" y="295" font-size="9" fill="var(--chart-text)">0</text>
<text x="20" y="228" font-size="9" fill="var(--chart-text)">1</text>
<text x="20" y="161" font-size="9" fill="var(--chart-text)">2</text>
<text x="20" y="94" font-size="9" fill="var(--chart-text)">3</text>
<text x="20" y="45" font-size="9" fill="var(--chart-text)">4</text>
<rect x="110" y="52" width="70" height="238" fill="var(--c1)" opacity="0.85"/>
<rect x="230" y="52" width="70" height="238" fill="var(--c2)" opacity="0.85"/>
<rect x="350" y="170" width="70" height="120" fill="var(--c3)" opacity="0.85"/>
<rect x="470" y="170" width="70" height="120" fill="var(--chart-grid)" opacity="0.9"/>
<text x="145" y="180" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">4</text>
<text x="265" y="180" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">4</text>
<text x="385" y="240" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">2</text>
<text x="505" y="240" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">2</text>
<text x="145" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">Champions</text>
<text x="265" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">Regular</text>
<text x="385" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">At-risk</text>
<text x="505" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">Dormant</text>
<rect x="90" y="42" width="210" height="26" fill="none" stroke="var(--c1)" stroke-width="2" stroke-dasharray="5,4"/>
<text x="195" y="59" font-size="9" fill="var(--c1)" text-anchor="middle" font-weight="bold">target kampanye</text>
<text x="400" y="150" font-size="9" fill="var(--c3)" font-weight="bold">cap: maks 3 pesan/minggu</text>
<line x1="330" y1="140" x2="400" y2="140" stroke="var(--c3)" stroke-width="2"/>
<line x1="400" y1="140" x2="400" y2="100" stroke="var(--c3)" stroke-width="1.5"/>
</g>
</svg>`;

export const mk26: V2Lesson = {
  slug: "mk26-crm-ops",
  track: "Marketing Analytics",
  module: "Tooling Analis",
  title: "MK26 — CRM Ops: Braze, MoEngage, HubSpot dalam Praktik",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Blast 2 juta push — dan 18.000 uninstall",
      prose: [
        "Rina, CRM manager di e-commerce fashion \"Laras\", menyiapkan kampanye Harbolnas terbesar tahun ini: satu push notification promo ke SELURUH 2 juta pengguna aplikasi. Copywriting-nya digarap seminggu, desainnya disetujui tiga level. Hasilnya: open rate 4% — dan 18.000 uninstall dalam tujuh hari. Tim kreatif disalahkan, copywriter diminta revisi total.",
        "Tiga minggu kemudian audit data mengungkap cerita berbeda: 61% penerima blast ternyata tidak aktif lebih dari 30 hari — mereka menerima promo untuk aplikasi yang sudah mereka lupakan. Segmentasi \"pengguna aktif\" di CRM ternyata didefinisikan dari tanggal INSTALL, bukan dari perilaku. Rina tidak mengirim pesan yang buruk ke orang yang tepat; ia mengirim pesan ke kuburan — dan yang masih hidup pun muak karena itu pesan ke-11 minggu itu.",
        "Twist-nya: tool CRM (Braze/MoEngage/HubSpot) tidak pernah bisa menyelamatkan data yang tidak mengalir. CRM adalah megafon — megafon tidak berguna bila tidak tahu siapa yang masih mendengarkan. Lesson ini tentang sisi analis dari CRM ops: event apa yang harus mengalir, bagaimana segmen dibangun dan dihitung ulang, dan bagaimana mengukur apakah CRM menghasilkan uang atau justru mengusir pelanggan. Karena di lowongan CRM/lifecycle marketing 2026, yang ditanya bukan 'bisa pakai Braze?' — melainkan 'data apa yang kamu butuhkan agar Braze bisa diukur?'",
      ],
      tasks: [],
      note: {
        title: "Konteks pasar",
        type: "risk",
        body: "Riset lowongan 2026: lifecycle/CRM marketing muncul eksplisit di JD analis marketing e-commerce & fintech — dengan frasa 'hands-on Braze/MoEngage/HubSpot' plus 'strong analytical skills'. Tool-nya bisa dipelajari seminggu; yang langka adalah analis yang paham data apa yang harus mengalir ke tool itu.",
      },
      reference: "CRM tanpa data yang mengalir = megafon ke kuburan.",
    },
    {
      id: "konsep-event",
      eyebrow: "Langkah 2 · Konsep",
      title: "Event adalah bahan bakar CRM: taksonomi sebelum kampanye",
      prose: [
        "Si Pencatat Setia — begitu kepribadian konsep ini. CRM yang baik dimulai BUKAN di dashboard Braze, melainkan di taksonomi event: daftar baku 'apa saja yang boleh dicatat'. Tiga levelnya: EVENT (sesuatu terjadi: `product_viewed`, `checkout_started`), ATRIBUT EVENT (properti kejadian: `product_id`, `price`, `source`), dan PROFIL PENGGUNA (atribut melekat: `kota`, `tanggal_install`, `segmen`). Tanpa taksonomi, tim produk mencatat `beli`, tim web mencatat `purchase`, dan analis menghabiskan 3 minggu menyatukan keduanya sebelum SATU kampanye bisa jalan.",
        "Aturan taksonomi yang bekerja: (1) nama event = kata kerja lampau + objek (`order_completed`, bukan `order`); (2) setiap event wajib membawa `user_id`, `timestamp`, `platform`; (3) atribut uang selalu dalam satuan terkecil (sen, bukan rupiah) agar tidak ada bug pembulatan; (4) taksonomi ditulis di SATU dokumen yang dimiliki bersama produk + analis + CRM — bukan di kepala masing-masing.",
        "Dari sisi analis, pertanyaan kuncinya: 'event apa yang HARUS ada agar segmen lifecycle bisa dihitung?' Jawabannya hampir selalu sama: login/app_open (aktivitas), product_view + add_to_cart + checkout_started (niat), order_completed + refund (uang), dan push_open (respons terhadap CRM itu sendiri — tanpa ini, kamu tidak bisa tahu apakah pesanmu dibaca atau diabaikan).",
        "🚨 Mitos: 'CRM ops = bikin journey di canvas.' Yang benar: 70% pekerjaan CRM ops adalah data plumbing — memastikan event mengalir benar, tepat waktu, dan konsisten. Canvas yang indah di atas event yang rusak hanya mengotomatiskan kesalahan dalam skala besar.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mencatat event TANPA user_id yang stabil (misal hanya cookie anonim): saat user login di HP baru, ia tercatat sebagai 'pengguna baru' — segmen new user membengkak palsu, dan riwayat belanjanya hilang dari profil. Solusi: identity resolution — gabungkan anonymous_id + user_id saat login, dan JANGAN pernah memakai email sebagai key utama (orang ganti email).",
      },
      reference: "Taksonomi dulu, kampanye kemudian; event = kata kerja lampau + objek.",
    },
    {
      id: "konsep-segmen",
      eyebrow: "Langkah 3 · Konsep",
      title: "Segmentasi dinamis: RFM versi lifecycle",
      prose: [
        "Si Penjaga Gerbang — ia memutuskan siapa boleh lewat ke kampanye. Segmentasi CRM yang hidup memakai logika RFM yang diadaptasi: Recency (kapan terakhir aktif/beli), Frequency (berapa kali dalam 30 hari), Monetary (total spend). Empat segmen kanonis: CHAMPIONS (beli ≥2× dan aktif ≤7 hari — duta terbaikmu), REGULAR (sisanya yang masih bernapas), AT-RISK (tidak aktif >14 hari tapi pernah beli — masih bisa diselamatkan), DORMANT (tidak aktif >30 hari — jangan kirimi promo, kirimi alasan kembali).",
        "Kata kuncinya DINAMIS: segmen dihitung ulang setiap ada event baru, bukan daftar statis yang diunduh tiap bulan. User yang kemarin dormant bisa jadi champions hari ini setelah satu pembelian — dan kampanye 'winback' yang telat 3 minggu adalah spam untuk orang yang sudah kembali sendiri. Di Braze/MoEngage ini disebut 'live segments'; di HubSpot 'active lists'. Prinsipnya sama: segmen = query yang selalu segar, bukan file CSV yang basi.",
        "Urutan evaluasi aturan itu penting (seperti di lab): cek dormant DULU, baru at-risk, baru champions. Bila champions dicek duluan, user yang dormant tapi pernah beli banyak bisa salah masuk champions — dan menerima pesan 'eksklusif untuk pelanggan setia' padahal sudah 45 hari tidak buka aplikasi. Aturan yang tumpang tindih harus punya prioritas yang eksplisit.",
        "🚨 Mitos: 'Makin banyak segmen makin personal.' Yang benar: 4–6 segmen yang masing-masing punya PERLAKUAN berbeda sudah cukup. 40 segmen mikro yang perlakuannya sama semua = segmentasi teater — kerja ekstra, hasil nol. Tesnya: bila dua segmen menerima pesan dan frekuensi yang sama, gabungkan.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Segmen 'aktif' paling sering didefinisikan salah: dari tanggal install ('install < 90 hari = aktif') alih-alih dari perilaku ('buka aplikasi 7 hari terakhir'). Akibatnya persis kasus Rina: 61% 'aktif' ternyata mayat. Selalu definisikan segmen dari EVENT (buka, beli, klik), bukan dari atribut statis (tanggal install).",
      },
      reference: "Segmen = query yang selalu segar; evaluasi aturan dari yang paling sempit (dormant) dulu.",
    },
    {
      id: "konsep-fatigue",
      eyebrow: "Langkah 4 · Konsep",
      title: "Fatigue: frekuensi yang membunuh",
      prose: [
        "Si Penjaga Tidur — ia memastikan pelangganmu bisa tidur nyenyak. Message fatigue adalah pembunuh senyap CRM: tiap pesan tambahan menaikkan peluang uninstall, dan efeknya TIDAK linear — pesan ke-1 sampai ke-3 menaikkan konversi, pesan ke-4+ menurunkannya. Frequency capping adalah remnya: aturan 'maks N pesan per user per 7 hari' yang ditegakkan di level platform, bukan di level tiap kampanye (tiga tim yang masing-masing mengirim 2 pesan = 6 pesan tanpa ada yang merasa bersalah).",
        "Dua kontrol pendamping cap: QUIET HOURS (jangan kirim 22:00–08:00 waktu lokal user — push tengah malam = uninstall instan) dan PRIORITAS (bila user lolos 3 kampanye sekaligus, kirim yang prioritas tertinggi saja — transaksional > promo > konten). Tanpa prioritas, cap hanya memilih secara acak mana yang dikorbankan.",
        "Rumus ekspektasi kampanye yang jujur memasukkan SEMUA saringan: dari N target, hanya yang lolos cap yang benar-benar menerima. Inilah yang dihitung lab: 6 user lolos segmen, tetapi hanya 4 yang lolos cap — 2 user 'terbaikmu' justru sedang difatigue dan harus DILEWATI minggu ini.",
        "🚨 Mitos: 'Unsubscribe/uninstall itu salah copywriting.' Yang benar: data industri konsisten — penyebab #1 adalah FREKUENSI, bukan isi pesan. Sebelum merevisi copy, cek dulu berapa pesan yang diterima user itu dalam 7 hari terakhir. Sering kali jawabannya memalukan.",
      ],
      tasks: [],
      formula: String.raw`E = N \times r_{buka} \times r_{konversi} \times AOV \quad ; \quad \text{kirim}(u) = [\,m_7(u) < \text{cap}\,]`,
      formulaNote: "E = ekspektasi revenue kampanye; N = jumlah penerima AKHIR (setelah segmen DAN cap); r_buka = open rate; r_konversi = conversion rate dari yang buka; AOV = average order value. kirim(u) = aturan keputusan per user: kirim hanya bila m_7(u) = pesan diterima user u dalam 7 hari terakhir KURANG dari cap. Contoh lab: 6 user lolos segmen champions+at-risk, cap=3 → U2 (4 pesan) dan U9 (5 pesan) dilewati → N=4. Interpretasi: 2 user terbaikmu minggu ini 'dilindungi' dari kampanye — itulah gunanya cap.",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengukur sukses kampanye dari open rate TANPA membandingkan dengan grup kontrol yang tidak dikirimi: open rate 22% terlihat bagus — padahal 18% dari mereka akan beli juga tanpa pesan (baseline). Lift sebenarnya = 22% − 18% = 4 poin, bukan 22%. CRM tanpa holdout group = mengklaim kemenangan atas sesuatu yang terjadi sendiri.",
      },
      reference: "Cap di level platform + quiet hours + prioritas; ukur dengan holdout, bukan open rate mentah.",
    },
    {
      id: "visual-lifecycle",
      eyebrow: "Langkah 5 · Visual",
      title: "Membaca peta segmen: siapa boleh terima kampanye",
      prose: [
        "Diagram menampilkan 12 user contoh dari lab yang dikelompokkan ke 4 segmen: Champions 4, Regular 4, At-risk 2, Dormant 2. Kotak putus-putus menandai target kampanye (Champions + At-risk = 6 user) — dan anotasi cap mengingatkan bahwa 2 dari 6 itu sedang difatigue.",
        "Poin visualnya: segmen terbesar (Champions, Regular) memang berisi user paling berharga, tetapi JUMLAH bukan segalanya — Dormant yang 2 orang itu bila dikirimi blast justru menghasilkan uninstall, bukan revenue. Chart segmen yang baik selalu dibaca bersama aturan cap: 'berapa' × 'apakah boleh'.",
      ],
      figure: {
        svg: FIG_LIFECYCLE,
        alt: "Distribusi segmen lifecycle 12 user contoh dan aturan frequency cap.",
        caption: "Cara membaca: tinggi batang = jumlah user per segmen; kotak putus-putus = segmen yang jadi target kampanye (Champions + At-risk). Interpretasi: dari 6 user target, 2 sedang menerima ≥3 pesan/minggu (U2: 4, U9: 5) sehingga dilewati cap → penerima akhir 4. Keputusan: kirim ke U1, U3, U7, U12 minggu ini; U2 dan U9 'diistirahatkan'. Pelajaran visual: segmen menjawab 'SIAPA yang relevan', cap menjawab 'SIAPA yang boleh SEKARANG' — keduanya harus dipakai bersama.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Dashboard segmen yang hanya menampilkan JUMLAH user per segmen (tanpa cap & tanpa tren) menyesatkan: 'at-risk naik 20%' bisa berarti segmen membesar (buruk) ATAU definisinya berubah (netral). Selalu tampilkan segmen bersama: tren 4 minggu + berapa yang lolos cap. Jumlah tanpa konteks = dekorasi.",
      },
      reference: "Baca segmen bersama cap: 'siapa relevan' × 'siapa boleh sekarang'.",
    },
    {
      id: "lab-crm",
      eyebrow: "Langkah 6 · Lab",
      title: "Membangun segmen dan menerapkan frequency cap",
      prose: [
        "Data: 12 user dengan last_active (hari lalu), purchases_30d, spend, dan msg7 (pesan 7 hari terakhir). Tugasmu: (t1) tulis fungsi segmen(u) dengan prioritas dormant → at-risk → champions → regular, lalu hitung jumlah per segmen; (t2) filter target kampanye (champions + at-risk) dengan cap 3 pesan/minggu → list penerima; (t3) cetak ringkasan. Hasil yang benar: champions=4, at_risk=2, dormant=2, regular=4; penerima = U1, U3, U7, U12 (4 user). Eksplorasi: ubah cap menjadi 5 — siapa yang ikut? Ubah definisi at-risk menjadi >10 hari — segmen apa yang berubah paling banyak, dan mengapa itu berbahaya bagi pesan winback?",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi segmen(u) (prioritas: dormant → at-risk → champions → regular) dan hitung jumlah tiap segmen" },
        { id: "t2", text: "Filter target (champions + at-risk) dengan cap msg7 < 3 → penerima" },
        { id: "t3", text: "Cetak ringkasan: jumlah segmen + daftar penerima" },
      ],
      expected: "champions=4 at_risk=2 penerima=4",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menulis aturan segmen TANPA prioritas (if berurutan tanpa else): user U4 (dormant, purchases=2, last_active=45) lolos cek champions bila dicek duluan — ia 'aktif ≤7 hari'? Tidak (45>7), jadi aman di sini. Tetapi U9 (at-risk, purchases=2, last_active=16): bila champions dicek sebelum at-risk dengan syarat longgar, ia bisa salah masuk champions. Aturan tumpang tindih WAJIB punya urutan eksplisit — bug ini tidak terlihat di dashboard, hanya di dompet.",
      },
      hints: [
        "t1: def segmen(u): if u['last_active'] > 30: return 'dormant'; ... — urutan MATI.",
        "t2: penerima = [u['id'] for u in users if segmen(u) in ('champions','at_risk') and u['msg7'] < 3]",
        "t3: print(f\"champions={...} at_risk={...} penerima={len(penerima)}\")",
      ],
      code: {
        starter: "# DATA — JANGAN UBAH\nusers = [\n    {\"id\":\"U1\",\"last_active\":2,\"purchases\":3,\"spend\":450000,\"msg7\":1},\n    {\"id\":\"U2\",\"last_active\":5,\"purchases\":2,\"spend\":300000,\"msg7\":4},\n    {\"id\":\"U3\",\"last_active\":20,\"purchases\":1,\"spend\":150000,\"msg7\":0},\n    {\"id\":\"U4\",\"last_active\":45,\"purchases\":2,\"spend\":500000,\"msg7\":0},\n    {\"id\":\"U5\",\"last_active\":1,\"purchases\":0,\"spend\":0,\"msg7\":2},\n    {\"id\":\"U6\",\"last_active\":10,\"purchases\":1,\"spend\":120000,\"msg7\":3},\n    {\"id\":\"U7\",\"last_active\":3,\"purchases\":4,\"spend\":800000,\"msg7\":0},\n    {\"id\":\"U8\",\"last_active\":60,\"purchases\":0,\"spend\":0,\"msg7\":1},\n    {\"id\":\"U9\",\"last_active\":16,\"purchases\":2,\"spend\":250000,\"msg7\":5},\n    {\"id\":\"U10\",\"last_active\":4,\"purchases\":1,\"spend\":90000,\"msg7\":1},\n    {\"id\":\"U11\",\"last_active\":25,\"purchases\":0,\"spend\":0,\"msg7\":0},\n    {\"id\":\"U12\",\"last_active\":2,\"purchases\":5,\"spend\":1200000,\"msg7\":2},\n]\nCAP = 3\n\n# TULIS KODEMU\ndef segmen(u):\n    \n\npenerima = \n\nprint(f\"champions={} at_risk={} penerima={len(penerima)}\")\n",
        lockLines: 19,
        solution: "# DATA — JANGAN UBAH\nusers = [\n    {\"id\":\"U1\",\"last_active\":2,\"purchases\":3,\"spend\":450000,\"msg7\":1},\n    {\"id\":\"U2\",\"last_active\":5,\"purchases\":2,\"spend\":300000,\"msg7\":4},\n    {\"id\":\"U3\",\"last_active\":20,\"purchases\":1,\"spend\":150000,\"msg7\":0},\n    {\"id\":\"U4\",\"last_active\":45,\"purchases\":2,\"spend\":500000,\"msg7\":0},\n    {\"id\":\"U5\",\"last_active\":1,\"purchases\":0,\"spend\":0,\"msg7\":2},\n    {\"id\":\"U6\",\"last_active\":10,\"purchases\":1,\"spend\":120000,\"msg7\":3},\n    {\"id\":\"U7\",\"last_active\":3,\"purchases\":4,\"spend\":800000,\"msg7\":0},\n    {\"id\":\"U8\",\"last_active\":60,\"purchases\":0,\"spend\":0,\"msg7\":1},\n    {\"id\":\"U9\",\"last_active\":16,\"purchases\":2,\"spend\":250000,\"msg7\":5},\n    {\"id\":\"U10\",\"last_active\":4,\"purchases\":1,\"spend\":90000,\"msg7\":1},\n    {\"id\":\"U11\",\"last_active\":25,\"purchases\":0,\"spend\":0,\"msg7\":0},\n    {\"id\":\"U12\",\"last_active\":2,\"purchases\":5,\"spend\":1200000,\"msg7\":2},\n]\nCAP = 3\n\n# TULIS KODEMU\ndef segmen(u):\n    if u[\"last_active\"] > 30:\n        return \"dormant\"\n    if u[\"last_active\"] > 14 and u[\"purchases\"] >= 1:\n        return \"at_risk\"\n    if u[\"purchases\"] >= 2 and u[\"last_active\"] <= 7:\n        return \"champions\"\n    return \"regular\"\n\nsegs = [segmen(u) for u in users]\npenerima = [u[\"id\"] for u in users if segmen(u) in (\"champions\", \"at_risk\") and u[\"msg7\"] < CAP]\n\nprint(f\"champions={segs.count('champions')} at_risk={segs.count('at_risk')} penerima={len(penerima)}\")\n",
        checks: [
          { kind: "defined", task: "t1", name: "segmen", label: "fungsi segmen terdefinisi", msg: "Definisikan def segmen(u) dengan prioritas dormant → at-risk → champions → regular." },
          { kind: "equal", task: "t1", name: "segs", value: ["champions","champions","at_risk","dormant","regular","regular","champions","dormant","at_risk","regular","regular","champions"], label: "segmen 12 user benar", msg: "Urutan U1..U12: champions,champions,at_risk,dormant,regular,regular,champions,dormant,at_risk,regular,regular,champions." },
          { kind: "equal", task: "t2", name: "penerima", value: ["U1","U3","U7","U12"], label: "penerima = 4 user yang tepat", msg: "U2 (4 pesan) dan U9 (5 pesan) dilewati cap." },
          { kind: "stdout_matches", task: "t3", pattern: "penerima=4", label: "print menampilkan penerima=4", msg: "Format: penerima=..." },
        ],
      },
      reference: "Segmen dinamis berprioritas + cap frekuensi = penerima akhir.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: kapan CRM apa, untuk siapa",
      prose: [
        "Skenario satu — butuh kampanye multichannel (push + email + in-app) dengan journey bercabang: pilih Braze/MoEngage (canvas/journey visual + live segments). Email-only newsletter: HubSpot/Mailchimp cukup — jangan bayar Ferrari untuk antar surat.",
        "Skenario dua — event belum mengalir rapi: JANGAN beli tool dulu. Rapikan taksonomi + identity resolution dulu (2–4 minggu). Tool di atas data rusak = mengotomatiskan kesalahan.",
        "Skenario tiga — user dormant >60 hari: jangan kirim promo. Kirim SATU pesan winback dengan insentif nyata, lalu diam 30 hari bila tak respons. Dormant yang di-spam = uninstall yang tertunda.",
        "Skenario empat — tiga tim berebut kirim ke segmen sama: tegakkan cap di level platform + rapat prioritas mingguan. Tanpa ini, cap per kampanye tidak ada artinya.",
        "Skenario lima — bos minta 'personalized 1-to-1 untuk semua user': tolak dengan data — tunjukkan lift 4 segmen vs 40 segmen mikro (biasanya ≈ sama). Personalisasi = perlakuan berbeda per segmen, bukan nama depan di template.",
        "Aturan praktis 10 detik: (1) event-nya mengalir? (2) segmen = query segar? (3) cap + quiet hours aktif? — bila satu saja 'tidak', perbaiki itu dulu sebelum kampanye baru.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengukur CRM dari 'jumlah kampanye terkirim' (activity metric). Yang benar: incremental revenue vs holdout + unsubscribe/uninstall rate. Tim yang dikejar target 'kirim 20 kampanye/bulan' akan mengorbankan fatigue demi angka aktivitas — persis cara menciptakan kasus Rina.",
      },
      reference: "Tool mengikuti kebutuhan; data dulu, kampanye kemudian; ukur incremental, bukan aktivitas.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Laras setelah audit: dari blast ke presisi",
      prose: [
        "Pasca-insiden, Rina merombak total: taksonomi 24 event dibakukan, segmen dihitung ulang real-time, cap 3 pesan/minggu + quiet hours 22:00–08:00, dan setiap kampanye wajib punya holdout 10%. Kampanye Harbolnas berikutnya: target 380 ribu user (champions + at-risk yang lolos cap) dari 2 juta — open rate 23% (vs 4% saat blast), conversion 3,1%, revenue Rp1,42 miliar dengan 71% lebih sedikit pesan terkirim. Uninstall turun 62%.",
        "Pertanyaan: (a) mengapa revenue NAIK padahal pesan turun 71%? (b) apa yang masih berisiko? Pembahasan: (a) Karena pesan hanya sampai ke yang relevan DAN boleh menerima — open rate 23% × 380rb ≈ 87rb pembuka vs blast 4% × 2jt = 80rb; jangkauan efektif SAMA dengan biaya perhatian jauh lebih kecil, plus konversi lebih tinggi karena relevansi. (b) Risiko: definisi segmen bisa usang (perilaku berubah pasca-Harbolnas) — mitigasi: review definisi tiap kuartal; dan holdout 10% berarti 10% user 'dikorbankan' dari promo — komunikasikan sebagai investasi pengukuran, bukan kerugian.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Pelajaran Laras dalam satu kalimat: CRM yang baik MENGURANGI jumlah pesan, bukan menambahnya. Setiap pesan yang TIDAK dikirim ke orang yang salah adalah uninstall yang dicegah — dan itu sama berharganya dengan satu konversi.",
      },
      reference: "Presisi mengalahkan volume: pesan lebih sedikit, revenue lebih besar.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran dari semua langkah. Target: skor ≥ 4 dari 5.",
      ],
      tasks: [],
      summary: [
        "CRM ops = data plumbing dulu (taksonomi event, identity resolution), canvas kampanye kemudian.",
        "Segmen lifecycle: champions / regular / at-risk / dormant — dihitung ulang real-time, dievaluasi dari yang tersempit (dormant) dulu.",
        "Frequency cap di level platform + quiet hours + prioritas; ukur incremental vs holdout, bukan open rate mentah.",
        "Rumus ekspektasi kampanye memakai N penerima AKHIR (setelah segmen dan cap), bukan ukuran segmen mentah.",
        "Satu tool untuk satu kebutuhan: multichannel journey → Braze/MoEngage; email-only → HubSpot/Mailchimp.",
      ],
      quiz: [
        {
          q: "61% penerima blast Rina ternyata tidak aktif >30 hari. Akar masalahnya?",
          options: [
            { text: "Segmen 'aktif' didefinisikan dari tanggal install, bukan dari event perilaku", why: "Benar: definisi dari atribut statis, bukan perilaku — segmen basi.", correct: true },
            { text: "Copywriting promo kurang menarik", why: "Copywriting tidak menjelaskan mengapa mayoritas penerima sudah mati." },
            { text: "Waktu kirim kurang tepat", why: "Waktu kirim tidak mengubah fakta 61% penerima dormant." },
            { text: "Tool CRM-nya kurang canggih", why: "Tool tidak bisa memperbaiki definisi segmen yang salah." },
          ],
        },
        {
          q: "Mengapa aturan segmen harus dievaluasi dari dormant dulu (bukan champions dulu)?",
          options: [
            { text: "Agar user dengan aturan tumpang tindih jatuh ke segmen tersempit yang benar", why: "Benar: tanpa prioritas, user dormant yang pernah beli banyak bisa salah masuk champions.", correct: true },
            { text: "Karena dormant adalah segmen terbesar", why: "Dormant justru biasanya bukan yang terbesar; alasannya soal tumpang tindih aturan." },
            { text: "Agar komputasi lebih cepat", why: "Urutan tidak berpengaruh signifikan ke kecepatan." },
            { text: "Tidak penting, hasilnya sama saja", why: "Salah: contoh U9 menunjukkan hasil bisa berbeda." },
          ],
        },
        {
          q: "Tiga tim masing-masing mengirim 2 pesan/minggu ke segmen yang sama. Cap per kampanye = 3. Apa yang terjadi?",
          options: [
            { text: "User menerima 6 pesan — cap per kampanye tidak melindungi dari akumulasi lintas tim", why: "Benar: cap harus di level platform, bukan per kampanye.", correct: true },
            { text: "Aman, karena tiap kampanye di bawah cap", why: "Itulah jebakannya: tiap tim merasa patuh, user yang menderita." },
            { text: "Sistem otomatis membatalkan 3 pesan", why: "Tidak ada mekanisme seperti itu tanpa cap platform + prioritas." },
            { text: "Open rate akan naik karena lebih banyak pesan", why: "Terbalik: fatigue menurunkan engagement." },
          ],
        },
        {
          q: "Kampanye mencatat open rate 22%. Tanpa grup holdout, apa yang TIDAK bisa kamu klaim?",
          options: [
            { text: "Berapa lift incremental yang disebabkan kampanye (vs yang beli juga tanpa pesan)", why: "Benar: tanpa baseline holdout, 22% bisa sebagian besar terjadi sendiri.", correct: true },
            { text: "Berapa orang membuka pesan", why: "Itu justru yang BISA diketahui dari open rate." },
            { text: "Berapa pesan terkirim", why: "Itu data pengiriman, bukan klaim kausal." },
            { text: "Berapa revenue total periode itu", why: "Revenue total bisa diketahui; yang tak diketahui adalah kontribusi kampanye." },
          ],
        },
        {
          q: "Startup hanya butuh newsletter email mingguan. Rekomendasi tool yang paling masuk akal?",
          options: [
            { text: "HubSpot/Mailchimp — email-only, jangan bayar platform multichannel mahal", why: "Benar: tool mengikuti kebutuhan; Braze untuk newsletter = overkill.", correct: true },
            { text: "Braze — karena paling canggih", why: "Kecanggihan tanpa kebutuhan = biaya terbuang." },
            { text: "Bangun sendiri dengan Python + SMTP", why: "Maintenance deliverability/IP reputation jauh lebih mahal dari lisensi." },
            { text: "Tidak perlu tool, kirim manual via Gmail", why: "Tidak scalable dan merusak deliverability domain." },
          ],
        },
      ],
      next: { label: "MK27 — SEO Analytics: Mengukur Mesin Organik", href: "/v2/learn/mk27-seo-analytics" },
    },
  ],
};
