import type { V2Lesson } from "../lib/types";

const FIG_ARSI = `<svg viewBox="0 0 560 360" role="img" aria-label="Arsitektur client-side vs server-side tracking.">
<g font-family="var(--font-ui)">
<text x="14" y="26" font-size="13" fill="var(--chart-text)" font-weight="bold">Client-side vs server-side: ke mana data mengalir</text>
<text x="140" y="52" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Client-side (sekarat)</text>
<text x="420" y="52" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Server-side (tahan banting)</text>
<rect x="40" y="66" width="200" height="44" rx="8" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="140" y="85" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Browser pengguna</text>
<text x="140" y="101" font-size="10" fill="var(--chart-text)" text-anchor="middle">pixel JS → Meta / GA4</text>
<rect x="40" y="200" width="200" height="44" rx="8" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="140" y="219" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Adblocker / ITP / ATT</text>
<text x="140" y="235" font-size="10" fill="var(--chart-text)" text-anchor="middle">memotong aliran ✕</text>
<line x1="140" y1="110" x2="140" y2="200" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6,4"/>
<rect x="320" y="66" width="200" height="44" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="420" y="85" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Browser → server sendiri</text>
<text x="420" y="101" font-size="10" fill="var(--chart-text)" text-anchor="middle">satu endpoint milikmu</text>
<rect x="320" y="140" width="200" height="44" rx="8" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<text x="420" y="159" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Server kamu (GTM/CAPI)</text>
<text x="420" y="175" font-size="10" fill="var(--chart-text)" text-anchor="middle">deduplikasi + pengayaan</text>
<rect x="320" y="214" width="200" height="44" rx="8" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="420" y="233" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Meta CAPI / GA4 MP</text>
<text x="420" y="249" font-size="10" fill="var(--chart-text)" text-anchor="middle">server → server ✓</text>
<line x1="420" y1="110" x2="420" y2="140" stroke="var(--c1)" stroke-width="2"/>
<line x1="420" y1="184" x2="420" y2="214" stroke="var(--c1)" stroke-width="2"/>
<rect x="60" y="280" width="440" height="56" rx="8" fill="var(--chart-text)" opacity="0.08" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="280" y="302" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Prinsipnya: browser hanya bicara ke serverMU;</text>
<text x="280" y="320" font-size="11" fill="var(--chart-text)" text-anchor="middle">servermu yang bicara ke Meta/Google — di luar jangkauan adblocker.</text>
</g>
</svg>`;

export const mk21: V2Lesson = {
  slug: "mk21-server-side",
  track: "Marketing Analytics",
  module: "Tracking & Data",
  title: "MK21 — Server-Side Tracking & Conversions API: Saat Cookie Mati",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "ROAS 4,2 yang ternyata 2,8 — dan budget yang salah sasaran",
      prose: [
        "Februari 2025. Performance marketer sebuah brand skincare di Bandung menatap dasbor Meta Ads dengan bangga: ROAS 4,2, di atas target 3,0. Ia menaikkan budget 50%. Tiga bulan kemudian tim finance melapor: revenue riil dari channel Meta hanya tumbuh 8% — ROAS sebenarnya sekitar 2,8, DI BAWAH target. Selisihnya bukan penipuan Meta, melainkan kebutaan: sejak iOS 14.5 (2021), pengguna iPhone bisa menolak tracking (ATT opt-in hanya ~25%), Safari memotong cookie via ITP, dan 30%+ pengguna desktop memakai adblocker. Pixel browser hanya 'melihat' sebagian pembelian — dan Meta mengisi kekosongan itu dengan model yang terlalu optimistis.",
        "Twist-nya: tim kompetitor yang ROAS-nya terlihat 'hanya' 3,5 justru scale dengan benar — karena mereka memasang Meta Conversions API (CAPI): pembelian dikirim dari SERVER mereka langsung ke Meta, lengkap dengan data pelanggan ter-hash, sehingga Meta bisa mencocokkan conversion yang tidak terlihat pixel. ROAS 4,2 yang buta vs ROAS 3,5 yang melihat — yang kedua memenangkan budget. Lesson ini mengajarkan arsitektur pengukuran pasca-cookie: kenapa client-side mati, cara kerja CAPI/GA4 server-side, deduplikasi, dan SKAdNetwork — plus ringkasan model event GA4 (2-3 kalimat, agar lesson ini mandiri): GA4 mengukur dunia sebagai event — setiap interaksi (page_view, purchase) adalah event bernama dengan parameters (value, currency), user properties, dan items[]; session dan user dihitung DARI event tersebut, bukan dikirim terpisah. Semua teknik server-side di lesson ini pada dasarnya mengirim event berstruktur SAMA — hanya jalurnya yang pindah dari browser ke server.",
      ],
      tasks: [],
      note: {
        title: "Konteks karir",
        type: "risk",
        body: "Lowongan 'App Analytics Specialist' (Upwork, terverifikasi) mensyaratkan SKAdNetwork + server-side tracking. Analis yang hanya bisa baca dasbor pixel di 2026 sedang mengoptimalkan angka buta — dan atasan yang paham akan menanyakannya.",
      },
      reference: "Pixel buta → ROAS semu → keputusan budget salah. Server-side mengembalikan penglihatan.",
    },
    {
      id: "kematian-cookie",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga pembunuh tracking browser",
      prose: [
        "Pembunuh satu — ITP (Intelligent Tracking Prevention) Safari/Firefox: cookie pihak ketiga diblokir total; cookie pihak pertama kedaluwarsa dalam 7 hari (bahkan 24 jam dalam beberapa kasus). Artinya perjalanan pelanggan 30 hari tidak bisa dirangkai dari cookie browser — atribusi last-click pun patah.",
        "Pembunuh dua — ATT (App Tracking Transparency) iOS 14.5+: aplikasi WAJIB meminta izin tracking, dan ~75% pengguna menolak. Imbasnya ke web: Meta kehilangan sinyal untuk optimasi algoritma — lookalike melemah, attribution window menyusut dari 28 hari menjadi 7 hari. Inilah akar 'ROAS semu' di cerita pembuka.",
        "Pembunuh tiga — adblocker & privacy sandbox: 30%+ pengguna memblokir pixel dan tag manager pihak ketiga langsung di browser. Ditambah Chrome Privacy Sandbox yang menghapus cookie pihak ketiga: tidak ada lagi 'jalan pintas' lintas situs.",
        "Kepribadian konsep ini: cookie adalah 'kertas catatan yang dititipkan di saku pengunjung' — praktis, tetapi pengunjung kini menggeledah sakunya sendiri dan membuang catatanmu. Server-side tracking adalah 'buku kasir milikmu sendiri': catatan ditulis di tokomu, bukan di saku pengunjung — tidak bisa dibuang adblocker.",
        "🚨 Mitos: 'Cookie pihak pertama masih aman, jadi tracking browser baik-baik saja.' Yang benar: pihak pertama bertahan dari ITP, tetapi TIDAK dari adblocker (yang memblokir domain tag manager) dan tidak membantu sama sekali untuk sinyal ke Meta (yang butuh data dikirim ke server Meta).",
        "🚨 Mitos: 'Server-side tracking mengakali izin pengguna.' Yang benar: server-side TIDAK membebaskanmu dari consent — UU PDP Indonesia dan GDPR tetap mewajibkan dasar hukum pengiriman data ke Meta/Google. Yang berubah hanya JALURNYA, bukan izinnya. Consent mode tetap wajib dipasang.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira server-side = 'tracking tanpa cookie sehingga bebas aturan privasi'. Salah dua kali: (1) consent tetap wajib; (2) Meta/Google tetap butuh identifier (email ter-hash) untuk matching — data yang justru LEBIH sensitif dari cookie. Konsultasikan legal sebelum mengirim PII ke platform iklan.",
      },
      reference: "ITP + ATT + adblocker = pixel buta. Server-side = buku kasir sendiri.",
    },
    {
      id: "capi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Meta Conversions API: mengirim struk dari kasir",
      prose: [
        "Cara kerja CAPI sederhana: saat pembelian terjadi, SERVER-mu (bukan browser pembeli) mengirim event purchase ke endpoint Meta — berisi event_name, event_time, event_id, dan customer_information (email/telepon ter-hash SHA-256, bukan plaintext). Meta mencocokkan dengan penggunanya via data ter-hash itu. Hasilnya: conversion yang tidak terlihat pixel (pengguna iOS menolak ATT, adblocker) kini tercatat — dengan identitas yang justru lebih akurat dari cookie.",
        "Dua parameter penentu kualitas. Satu — event_id: string unik per transaksi yang SAMA dikirim pixel browser dan CAPI. Meta memakai ini untuk DEDUPLIKASI: dua event dengan event_id sama dihitung satu. Tanpa event_id yang konsisten, kamu mendapat kebalikan dari kebutaan: conversion GANDA — event yang sama tercatat dua kali, sekali dari pixel browser dan sekali dari CAPI. Dua — match quality: skor 0-10 dari Meta yang menilai kelengkapan data pencocokan (email+telepon+nama+kota = skor tinggi). Event Match Quality (EMQ) di bawah 6 = CAPI-mu hampir tidak berguna; di atas 8 = setara atau lebih baik dari pixel.",
        "Analogi kasir: pixel = pramuniaga yang mengintip dari jendela dan menebak siapa yang beli (kadang salah, kadang tidak lihat). CAPI = kasir yang mencatat struk lengkap dengan nama di nota — lalu mengirim salinannya ke Meta. Struk selalu lebih akurat dari intipan.",
        "🚨 Mitos: 'Pasang CAPI, matikan pixel.' Yang benar: Meta merekomendasikan KEDUANYA berjalan paralel dengan event_id sama — pixel menangkap yang bisa ia lihat (cepat, real-time), CAPI menangkap sisanya (lengkap, tertunda). Redundansi + deduplikasi > salah satu saja.",
      ],
      tasks: [],
      formula: String.raw`\text{Event Match Quality} \propto \text{kelengkapan identifier ter-hash}`,
      formulaNote: "Event Match Quality (EMQ) = skor 0-10 dari Meta; identifier = email, telepon, nama, kota, kode pos (dikirim ter-hash SHA-256). Simbol ∝ artinya 'berbanding lurus'. Interpretasi: tiap field identitas yang kamu kirim menaikkan peluang Meta mencocokkan conversion ke pengguna yang tepat — EMQ < 6 praktis tidak membantu optimasi algoritma; target operasional ≥ 8. Contoh: hanya kirim email → EMQ ~5; tambah telepon + nama + kota → EMQ ~8,5.",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "CAPI bukan sulap: ia hanya sebaik data pelangganmu. Toko dengan 90% checkout sebagai guest tanpa email akan dapat EMQ rendah — solusinya bukan di CAPI, melainkan di strategi akuisisi data pihak pertama (insentif login/member). Tracking server-side dan CRM adalah satu masalah yang sama.",
      },
      reference: "CAPI = server→Meta; event_id = deduplikasi; EMQ ≥ 8 = target.",
    },
    {
      id: "ga4-server",
      eyebrow: "Langkah 4 · Konsep",
      title: "GA4 server-side & Measurement Protocol",
      prose: [
        "Sisi Google punya dua jalur server. Satu — GTM Server Container: kamu menyewa server (misal di Cloud Run) dengan subdomain milikmu (gtm.tokomu.com); browser mengirim event ke subdomain itu (pihak pertama — lolos ITP dan sebagian adblocker), lalu server meneruskannya ke GA4/Meta. Keuntungan: satu pintu untuk semua platform, cookie ditulis dari domain sendiri (lebih awet), dan kamu bisa MEMPERKAYA event di server (tambah margin produk dari database — data yang tidak boleh ada di browser).",
        "Dua — Measurement Protocol (MP): API langsung untuk mengirim event ke GA4 dari server, TANPA melalui GTM. Dipakai untuk event yang tidak pernah menyentuh browser: pembelian via WhatsApp/CS, refund, langganan yang diperpanjang otomatis, transaksi offline toko fisik. Syarat: kirim client_id atau user_id yang KONSISTEN agar GA4 bisa menggabungkannya dengan sesi browser pengguna yang sama — tanpa ini, MP menciptakan 'pengguna hantu' baru.",
        "Jebakan terbesar MP: timestamp dan session attribution. Event MP yang dikirim 3 hari setelah pembelian akan tercatat di tanggal PENGIRIMAN kecuali kamu set timestamp_micros dengan benar — merusak analisis harian. Dan tanpa client_id yang tepat, pembelian offline tidak teratribusi ke campaign yang membawanya — sia-sia untuk optimasi iklan.",
        "🚨 Mitos: 'Server-side GA4 membuat data 100% akurat.' Yang benar: ia menghilangkan KEHILANGAN akibat adblocker/ITP, tetapi tidak memperbaiki KESALAHAN definisi (event ganda, value salah). Akurasi = jalur benar × definisi benar; server-side hanya memperbaiki faktor pertama.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Server GTM = infrastruktur milikmu = biaya dan tanggung jawab. Estimasi: Cloud Run untuk traffic menengah ~Rp500rb-2jt/bulan — murah dibanding satu keputusan budget iklan yang salah arah Rp500 juta. Tetapi ia juga titik kegagalan tunggal: monitor uptime-nya seperti kamu memonitor checkout.",
      },
      reference: "GTM Server = pintu pihak pertama; MP = untuk event non-browser; client_id konsisten wajib.",
    },
    {
      id: "skan",
      eyebrow: "Langkah 5 · Konsep",
      title: "SKAdNetwork & Privacy Sandbox: atribusi tanpa identitas",
      prose: [
        "Untuk aplikasi mobile iOS, ATT membunuh IDFA (identifier iklan) bagi 75% pengguna. Penggantinya: SKAdNetwork (SKAN) — Apple sendiri yang mencatat install dan mengirim 'laporan agregat tertunda' ke ad network: tanpa identitas pengguna, tanpa timestamp presisi (delay 24-48 jam), dengan nilai conversion coarse (6-bit: 64 nilai saja). Kamu tahu 'campaign X menghasilkan Y install', tetapi tidak tahu SIAPA — dan tidak bisa optimasi real-time.",
        "Implikasinya brutal untuk analis: cohort analysis per pengguna hilang; DDA tidak bisa jalan (tidak ada user journey); optimasi algoritma Meta/Google untuk iOS berjalan dengan data agregat yang tertunda. Praktik adaptasinya: skema conversion value (petakan 64 nilai ke milestone bisnis: 1=install, 10=register, 40=purchase), jendela atribusi lebih panjang, dan ekspektasi yang dijaga — ROAS iOS memang tidak akan sepresisi dulu.",
        "Di web, Privacy Sandbox Chrome menggantikan cookie pihak ketiga dengan API agregat (Attribution Reporting API): laporan konversi tanpa identitas lintas situs, dengan noise dan delay. Polanya sama: masa depan atribusi = agregat + tertunda + tanpa identitas. Analis yang karirnya dibangun di atas user-level tracking harus belajar berpikir agregat — inilah jembatan ke MMM dan incrementality.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membandingkan ROAS iOS vs Android secara naif. Keduanya diukur dengan metodologi BERBEDA (SKAN agregat-tertunda vs device-level). Selisihnya mencerminkan perbedaan pengukuran, bukan hanya performa. Selalu beri catatan kaki metodologi di laporan lintas platform.",
      },
      reference: "SKAN = agregat, tertunda, tanpa identitas. Masa depan = berpikir agregat.",
    },
    {
      id: "figure-arsi",
      eyebrow: "Langkah 6 · Visual",
      title: "Membaca arsitektur server-side",
      prose: [
        "Diagram membandingkan dua arsitektur. Kiri: browser mengirim langsung ke Meta/GA4 — garis putus-putus menunjukkan aliran yang dipotong adblocker/ITP/ATT. Kanan: browser hanya bicara ke server milikmu (satu endpoint pihak pertama); servermu memperkaya dan meneruskan ke Meta (CAPI) dan GA4 (MP) via koneksi server-to-server yang tidak bisa dijangkau adblocker.",
        "Perhatikan kotak tengah kanan: 'deduplikasi + pengayaan' — di sinilah nilai tambah server-side selain ketahanan. Kamu bisa menggabungkan event browser + server via event_id (menghilangkan duplikat), menambahkan data margin dari database internal, dan memfilter bot SEBELUM data sampai ke platform iklan.",
      ],
      figure: {
        svg: FIG_ARSI,
        alt: "Arsitektur client-side vs server-side tracking.",
        caption: "Cara membaca: kiri = browser→platform langsung (garis putus-putus = dipotong adblocker/ITP/ATT); kanan = browser→server sendiri→platform (garis penuh = lolos). Interpretasi: server-side memindahkan 'percakapan' ke wilayah yang kamu kuasai — browser hanya bicara ke domainmu (pihak pertama), dan servermu bicara ke Meta/Google via CAPI/MP di luar jangkauan pemblokir. Bonusnya: deduplikasi dan pengayaan data terjadi di servermu sebelum dikirim.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Hafalkan mantra arsitekturnya: 'browser ke serverku, serverku ke dunia'. Setiap kali ada vendor yang memintamu pasang pixel pihak ketiga langsung di browser, tanyakan: 'bisa lewat server-side?' — bila ya, itulah jawabannya.",
      },
      reference: "Satu endpoint pihak pertama → dedup + enrich → CAPI/MP.",
    },
    {
      id: "lab-dedup",
      eyebrow: "Langkah 7 · Lab",
      title: "Deduplikasi event_id dan uplift CAPI",
      prose: [
        "Simulasikan 1.000 pembelian. Pixel browser hanya menangkap 62% (sisanya: ATT/iOS 20%, adblocker 12%, lain-lain 6%). CAPI menangkap 95% — tetapi 62% di antaranya ADALAH event yang sama dengan pixel (duplikat potensial). Tugasmu: gabungkan kedua sumber via event_id (deduplikasi!), hitung total conversion unik, dan uplift vs pixel saja.",
        "Hasil yang benar: unik ≈ 980 (bukan 620 + 950 = 1.570!). Tanpa deduplikasi via event_id, kamu melaporkan conversion ~60% LEBIH TINGGI dari aslinya — persis kesalahan 'ROAS semu' versi server-side. Eksplorasi: ubah pixel coverage ke 40% (simulasi traffic dominan iOS) — seberapa besar peran CAPI sekarang?",
      ],
      tasks: [
        { id: "t1", text: "Bangun set event_id pixel (62%) dan CAPI (95%) dari 1000 pembelian" },
        { id: "t2", text: "Dedup via gabungan set; hitung conversion unik + uplift vs pixel, cetak" },
      ],
      expected: "pixel=620 capi=950 unik=979 uplift=57.9%",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Inilah matematika di balik rekomendasi Meta 'jalankan keduanya': pixel + CAPI yang didedup = cakupan maksimal TANPA double counting. Tim yang mematikan pixel setelah pasang CAPI kehilangan kecepatan real-time; tim yang tidak dedup melaporkan angka ganda. Keduanya salah.",
      },
      hints: [
        "random.seed(11); ids = [f't{i}' for i in range(1000)].",
        "pixel = set(random.sample(ids, 620)); capi = set(random.sample(ids, 950)).",
        "unik = len(pixel | capi); uplift = (unik - len(pixel)) / len(pixel).",
        "Format: f\"pixel={len(pixel)} capi={len(capi)} unik={unik} uplift={uplift:.1%}\".",
      ],
      code: {
        starter: "import random\nrandom.seed(11)\n\n# 1000 pembelian; pixel menangkap 62%, CAPI 95% (random overlap). JANGAN UBAH.\nids = [f\"t{i}\" for i in range(1000)]\npixel = set(random.sample(ids, 620))\ncapi = set(random.sample(ids, 950))\n\n# TULIS KODEMU: dedup via event_id, conversion unik, uplift vs pixel\nunik =\nuplift =\nprint(f\"pixel={len(pixel)} capi={len(capi)} unik={unik} uplift={uplift:.1%}\")\n",
        lockLines: 7,
        solution: "import random\nrandom.seed(11)\n\n# 1000 pembelian; pixel menangkap 62%, CAPI 95% (random overlap). JANGAN UBAH.\nids = [f\"t{i}\" for i in range(1000)]\npixel = set(random.sample(ids, 620))\ncapi = set(random.sample(ids, 950))\n\n# TULIS KODEMU: dedup via event_id, conversion unik, uplift vs pixel\nunik = len(pixel | capi)\nuplift = (unik - len(pixel)) / len(pixel)\nprint(f\"pixel={len(pixel)} capi={len(capi)} unik={unik} uplift={uplift:.1%}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "pixel=620 capi=950", msg: "Cakupan tiap sumber sesuai simulasi.", pattern: "pixel=620 capi=950" },
          { kind: "stdout_matches", task: "t2", label: "unik=979 & uplift=57.9%", msg: "Gabungan terdedup ≈ 979; uplift ≈ 57,9% vs pixel.", pattern: "unik=979 uplift=57.9%" },
          { kind: "forbids", task: "t1", label: "Tidak menjumlah tanpa dedup", msg: "Jangan jumlahkan len(pixel)+len(capi) — itu double counting.", token: "len(pixel) + len(capi)" },
        ],
      },
      reference: "event_id konsisten → gabungan set → unik. Uplift = (unik−pixel)/pixel.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Jalur mana untuk tiap kebutuhan",
      prose: [
        "Skenario satu — iklan Meta dengan traffic iOS besar: pasang CAPI + pixel paralel, event_id konsisten, kejar EMQ ≥ 8. Ini ROI tertinggi untuk kebanyakan e-commerce Indonesia (iOS ~25-35% traffic).",
        "Skenario dua — butuh cookie awet + satu pintu multi-platform: bangun GTM Server Container di subdomain sendiri. Sekalian perkuat data GA4 (lolos ITP/adblocker sebagian) dan teruskan ke Meta/TikTok dari satu tempat.",
        "Skenario tiga — transaksi non-browser (WhatsApp/CS/offline/refund): kirim via Measurement Protocol dengan client_id konsisten + timestamp_micros benar. Tanpa client_id = pengguna hantu; tanpa timestamp = tanggal kacau.",
        "Skenario empat — aplikasi iOS: implementasikan SKAN dengan skema conversion value 64-nilai yang dipetakan ke milestone bisnis; terima delay 24-48 jam; JANGAN bandingkan ROAS iOS vs Android secara naif.",
        "Skenario lima — budget kecil (< Rp50 juta/bulan): JANGAN bangun server dulu — pasang CAPI via integrasi bawaan platform (Shopify/Meta punya konektor tanpa kode) + consent mode. Server-side custom baru layak saat skala dan kompleksitasnya membenarkan.",
        "Aturan praktis 10 detik: (1) dari mana conversion hilang? (iOS→CAPI, adblocker→server GTM, offline→MP); (2) apakah event_id konsisten di semua jalur? (3) apakah consent mode terpasang? Tiga YA = arsitektur sehat.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membangun GTM Server Container megah tetapi lupa event_id di CAPI. Arsitektur termahal pun runtuh oleh satu string yang tidak konsisten. Audit event_id adalah checklist 5 menit dengan dampak terbesar.",
      },
      reference: "iOS→CAPI; adblocker→server GTM; offline→MP; kecil→integrasi bawaan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Brand yang scale dengan ROAS yang 'turun'",
      prose: [
        "Brand skincare 'MawarPutih': Desember 2024, pixel-only, ROAS Meta 4,2, spend Rp400 juta/bulan. Januari 2025: pasang CAPI (EMQ 8,4), ROAS TERCATAT turun ke 3,1 — karena conversion yang dulu 'dimodelkan optimistis' kini diganti data aktual yang lebih rendah tetapi JUJUR. Tim panik dan ingin mematikan CAPI ('merusak ROAS!'). Head of growth menolak: ia menaikkan spend ke Rp700 juta berdasar ROAS 3,1 yang terpercaya, dan revenue riil naik 61% dalam 3 bulan — sementara kompetitor yang masih pixel-only scale berdasar ROAS 4,5 semu dan boncos.",
        "Pertanyaan: (a) mengapa ROAS turun setelah CAPI dipasang — apakah performa iklan memburuk? (b) keputusan mana yang benar? Pembahasan: (a) TIDAK — yang berubah adalah PENGUKURAN, bukan performa. Pixel memakai modeling untuk menutupi kebutaan (bias optimistis); CAPI mengganti tebakan dengan data server aktual. ROAS 4,2 adalah angka yang salah dengan percaya diri; 3,1 adalah angka yang benar dengan kerendahan hati. (b) Scale berdasar 3,1 yang benar — persis yang dilakukan head of growth. Pelajaran: dalam pengukuran, angka yang turun karena metodenya membaik adalah KABAR BAIK. Tim yang menghukum metrik yang jujur akan selalu memilih kebohongan yang nyaman.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Bingkai untuk stakeholder: 'ROAS kita turun 26% karena kita berhenti berbohong pada diri sendiri.' Siapkan narasi ini SEBELUM memasang CAPI — kejutan metrik tanpa narasi = proyek pengukuran dibunuh di rapat pertama.",
      },
      reference: "Metrik jujur yang turun > metrik semu yang naik.",
    },
    {
      id: "adv-kegagalan-sunyi",
      eyebrow: "Langkah 10 · Operasional advanced",
      title: "Kegagalan sunyi: tiga jebakan yang tidak terlihat di dasbor",
      prose: [
        "Server-side memindahkan kebutaan dari browser ke tempat baru — dan tempat baru punya jebakannya sendiri. Satu — event_id tidak konsisten: pixel mengirim 'order-123', CAPI mengirim 'ORDER_123' (beda casing). Meta melihat dua event berbeda → double counting. Audit: bandingkan sampel 100 transaksi — jumlah event Meta vs order di database harus selisih < 2%. Dua — timestamp MP yang salah: event offline dikirim tanpa timestamp_micros sehingga tercatat di tanggal pengiriman, bukan tanggal transaksi. Analisis harian rusak diam-diam; atribusi campaign salah sasaran. Tiga — server GTM sebagai titik kegagalan tunggal: saat container down, SEMUA platform (Meta, GA4, TikTok) buta sekaligus — lebih parah dari satu pixel yang mati. Monitor uptime-nya seperti checkout: alert < 5 menit, bukan laporan bulanan.",
        "Checklist operasional bulanan (30 menit): (1) EMQ masih ≥ 8? (2) event_id match rate pixel↔CAPI > 95%? (3) selisih conversion Meta vs database < 5%? (4) consent mode masih terpasang pasca-update tema? Empat YA = arsitektur sehat; satu TIDAK = investigasi minggu ini.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Pixel kirim event_id 'order-123', CAPI kirim 'ORDER_123'. Akibatnya?",
          options: [
            { text: "Double counting — Meta melihat dua event berbeda; samakan format event_id di semua jalur", why: "Deduplikasi Meta berbasis string persis; beda casing = beda event.", correct: true },
            { text: "Tidak masalah — Meta tidak case-sensitive", why: "Meta membandingkan string persis; casing beda = tidak match." },
            { text: "CAPI otomatis dikalahkan pixel", why: "Tidak ada prioritas otomatis; keduanya dihitung." },
            { text: "EMQ turun", why: "EMQ soal identifier, bukan event_id — masalahnya double counting." },
          ],
        },
        {
          q: "Server GTM down 6 jam tanpa alert. Risiko terbesarnya?",
          options: [
            { text: "Semua platform buta sekaligus — titik kegagalan tunggal; butuh monitoring seperti checkout", why: "Satu pintu = satu titik gagal; keheningan 6 jam = data hilang permanen.", correct: true },
            { text: "Hanya GA4 yang terpengaruh", why: "Semua platform lewat pintu yang sama — semua ikut mati." },
            { text: "Data bisa di-recover dari cache browser", why: "Event yang tidak terkirim = hilang; tidak ada cache penyelamat." },
            { text: "Tidak ada risiko — pixel browser jadi cadangan otomatis", why: "Tidak otomatis; arsitektur harus dirancang dengan fallback eksplisit." },
          ],
        },
      ],
      reference: "Audit bulanan: EMQ ≥ 8, event_id match > 95%, selisih < 5%, consent utuh.",
    },
    {
      id: "intuisi-kekuasaan",
      eyebrow: "Langkah 11 · Intuisi",
      title: "Server-side bukan upgrade — ia pemindahan kekuasaan",
      prose: [
        "Dari pixel yang buta hingga ROAS 3,1 yang jujur — satu benang merahnya: siapa yang memegang data. Tiga heuristik arsiteknya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: browser adalah wilayah orang lain; server adalah wilayahmu",
        body: "Heuristik pertama: setiap data yang hanya hidup di browser adalah data pinjaman. Browser milik pengguna, aturannya ditulis Apple dan Google, dan mereka sedang menarik pinjamannya satu per satu (ITP, ATT, Privacy Sandbox). Arsitek yang bijak tidak membangun istana di tanah sewaan — ia memindahkan fondasi ke servernya sendiri, tempat ia menulis aturannya. Heuristik kedua: redundansi + deduplikasi mengalahkan kesempurnaan tunggal. Pixel + CAPI dengan event_id konsisten > salah satu yang 'sempurna'. Dalam sistem terdistribusi, tidak ada jalur yang 100% andal — keandalan datang dari dua jalur yang saling mengoreksi, bukan dari satu jalur yang diharapkan tidak pernah gagal. Heuristik ketiga: metrik yang jujur terasa seperti penurunan. ROAS 4,2 → 3,1 setelah CAPI bukan kegagalan proyek — ia momen proyeknya BERHASIL. Siapkan narasi ini sebelum implementasi, bukan sesudah: 'kita berhenti berbohong pada diri sendiri.' Tim yang menghukum metrik jujur akan selamanya mengoptimalkan kebohongan yang nyaman. Mantra arsitekturnya tetap: browser ke serverku, serverku ke dunia — dengan event_id yang konsisten dan consent yang utuh.",
      },
      reference: "Data pinjaman vs fondasi sendiri; redundansi > kesempurnaan; jujur > nyaman.",
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
        "Tiga pembunuh tracking browser: ITP (cookie dipotong), ATT iOS (75% menolak, atribusi 28→7 hari), adblocker (~30% memblokir pixel) — hasilnya pixel buta dan ROAS semu; server-side tidak membebaskan dari consent (UU PDP/GDPR tetap berlaku).",
        "Meta CAPI: server mengirim event purchase + customer info ter-hash ke Meta; event_id yang konsisten = deduplikasi pixel+CAPI; Event Match Quality target ≥ 8; jalankan pixel+CAPI paralel, jangan matikan salah satu.",
        "GA4 server-side: GTM Server Container (subdomain pihak pertama, lolos ITP/adblocker, bisa perkaya data) dan Measurement Protocol untuk event non-browser — wajib client_id konsisten (hindari pengguna hantu) dan timestamp_micros benar.",
        "SKAdNetwork/Privacy Sandbox: atribusi agregat-tertunda-tanpa identitas (SKAN: 64 nilai conversion, delay 24-48 jam); jangan bandingkan ROAS iOS vs Android secara naif; masa depan analis = berpikir agregat (MMM, incrementality).",
        "Keputusan: iOS→CAPI, adblocker→server GTM, offline→MP, budget kecil→integrasi bawaan; angka yang turun karena metode membaik adalah kabar baik — scale berdasar metrik jujur.",
        "Operasional: audit event_id, timestamp MP, dan uptime server GTM setiap bulan — 4 YA = sehat.",
      ],
      next: { label: "MK22 — CDP & Identity Resolution", href: "/v2/learn/mk22-cdp" },
      quiz: [
        {
          q: "Mengapa ROAS pixel-only bisa 'semu' (terlalu tinggi)?",
          options: [
            { text: "Pixel buta terhadap conversion iOS/adblocker; platform menutupinya dengan modeling yang bias optimistis", why: "Benar: kebutaan + modeling = angka percaya diri yang salah; CAPI mengganti tebakan dengan data aktual.", correct: true },
            { text: "Meta sengaja menggelembungkan angka untuk semua pengiklan", why: "Bukan kesengajaan — melainkan keterbatasan sinyal yang ditutup modeling." },
            { text: "Karena atribusi DDA selalu bias ke channel termahal", why: "DDA membagi kredit berdasar data; masalahnya adalah data yang hilang, bukan modelnya." },
            { text: "ROAS pixel selalu akurat; yang salah adalah tim finance", why: "Terbalik: finance memegang uang riil — sumber kebenaran." },
          ],
        },
        {
          q: "Fungsi event_id yang SAMA di pixel browser dan CAPI:",
          options: [
            { text: "Deduplikasi — Meta menghitung dua event ber-event_id sama sebagai satu conversion", why: "Benar: tanpa ini kamu dapat double counting (lab: 1.570 vs 950 yang benar).", correct: true },
            { text: "Menaikkan Event Match Quality secara otomatis", why: "EMQ ditentukan kelengkapan identifier, bukan event_id." },
            { text: "Menggantikan kebutuhan consent pengguna", why: "Consent tetap wajib; event_id tidak ada hubungannya dengan izin." },
            { text: "Mempercepat pengiriman event ke Meta", why: "Kecepatan tidak dipengaruhi event_id." },
          ],
        },
        {
          q: "Toko menerima banyak order via WhatsApp/CS yang tidak tercatat di GA4. Solusi tepat?",
          options: [
            { text: "Kirim via Measurement Protocol dengan client_id konsisten + timestamp_micros benar", why: "Benar: MP untuk event non-browser; client_id mencegah pengguna hantu, timestamp menjaga tanggal.", correct: true },
            { text: "Pasang pixel tambahan di halaman chat WhatsApp", why: "Chat terjadi di luar browser/situs — tidak ada halaman untuk dipasangi pixel." },
            { text: "Kirim via MP tanpa client_id agar sederhana", why: "Tanpa client_id, GA4 menciptakan pengguna hantu baru per event." },
            { text: "Abaikan saja — order offline tidak memengaruhi optimasi iklan", why: "Tanpa data ini, campaign yang membawa order WA terlihat gagal dan dimatikan — salah optimasi." },
          ],
        },
        {
          q: "Setelah pasang CAPI, ROAS tercatat TURUN dari 4,2 ke 3,1. Interpretasi yang benar?",
          options: [
            { text: "Pengukuran membaik: tebakan optimistis pixel diganti data aktual — scale berdasar angka jujur", why: "Benar: yang berubah metodenya, bukan performanya; menghukum metrik jujur = memilih kebohongan nyaman.", correct: true },
            { text: "CAPI merusak performa iklan — segera matikan", why: "CAPI tidak mengubah siapa yang beli; ia mengubah apa yang tercatat." },
            { text: "Artinya CAPI gagal terpasang dengan benar", why: "EMQ 8,4 menunjukkan instalasi sehat; penurunan adalah koreksi ke jujur." },
            { text: "Kecilkan budget sampai ROAS kembali 4,2", why: "Mengejar angka lama = mengoptimalkan kebohongan; angka 4,2 tidak akan kembali karena ia memang tidak nyata." },
          ],
        },
        {
          q: "Pernyataan yang BENAR tentang SKAdNetwork:",
          options: [
            { text: "Laporan agregat tertunda 24-48 jam, tanpa identitas pengguna, 64 nilai conversion — atribusi tanpa user journey", why: "Benar: inilah harga privasi iOS; analis harus berpikir agregat.", correct: true },
            { text: "Pengganti IDFA yang sama persis, hanya namanya beda", why: "Berbeda total: agregat vs individual, tertunda vs real-time." },
            { text: "Hanya berlaku untuk Android, iOS memakai IDFA seperti dulu", why: "Terbalik: SKAN adalah solusi iOS pasca-ATT; IDFA justru yang mati." },
            { text: "Memungkinkan DDA per pengguna seperti di web", why: "Tanpa user journey, DDA per pengguna tidak mungkin." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghafal akronim (CAPI, MP, SKAN) tanpa bisa menjelaskan alur datanya dalam satu kalimat. Uji dirimu: 'CAPI = serverku mengirim struk ke Meta.' Bila satu konsep tidak bisa diringkas satu kalimat, kamu belum paham — baca ulang langkahnya.",
      },
      hints: [
        "Uji cepat: kenapa event_id yang tidak konsisten lebih berbahaya daripada tidak pasang CAPI sama sekali? (double counting vs kebutaan.)",
        "Ingat angka: EMQ ≥ 8, ATT opt-in ~25%, adblocker ~30%.",
      ],
      reference: "Browser ke serverku, serverku ke dunia — dengan event_id dan consent.",
    },
  ],
};
