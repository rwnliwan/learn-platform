import type { V2Lesson } from "../lib/types";

// Diagram: tiga endpoint EDGAR.
const ENDPOINT_SVG = `<svg viewBox="0 0 660 220" role="img" aria-label="Tiga endpoint EDGAR: submissions untuk daftar filing, companyconcept untuk satu konsep, companyfacts untuk semua fakta.">
<defs><marker id="fdp2a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-text)"/></marker></defs>
<g font-family="var(--font-ui)" text-anchor="middle">
<rect x="14" y="40" width="200" height="130" rx="10" fill="var(--c1)" opacity="0.22" stroke="var(--c1)" stroke-width="2"/>
<text x="114" y="68" font-size="12" font-weight="600" fill="var(--text)">submissions</text>
<text x="114" y="88" font-size="10" fill="var(--text-muted)">daftar filing per emiten</text>
<text x="114" y="104" font-size="10" fill="var(--text-muted)">"filing apa saja yang ada?"</text>
<text x="114" y="124" font-size="10" fill="var(--text-muted)">/Archives/edgar/data/…</text>
<text x="114" y="140" font-size="10" fill="var(--text-muted)">+ /cgi-bin/browse-edgar</text>
<rect x="230" y="40" width="200" height="130" rx="10" fill="var(--c2)" opacity="0.22" stroke="var(--c2)" stroke-width="2"/>
<text x="330" y="68" font-size="12" font-weight="600" fill="var(--text)">companyconcept</text>
<text x="330" y="88" font-size="10" fill="var(--text-muted)">satu concept, semua emiten? tidak —</text>
<text x="330" y="104" font-size="10" fill="var(--text-muted)">satu concept SATU emiten</text>
<text x="330" y="124" font-size="10" fill="var(--text-muted)">"revenue emiten ini saja"</text>
<text x="330" y="140" font-size="10" fill="var(--text-muted)">/api/xbrl/companyconcept/…</text>
<rect x="446" y="40" width="200" height="130" rx="10" fill="var(--c3)" opacity="0.22" stroke="var(--c3)" stroke-width="2"/>
<text x="546" y="68" font-size="12" font-weight="600" fill="var(--text)">companyfacts ⭐</text>
<text x="546" y="88" font-size="10" fill="var(--text-muted)">SEMUA fakta SATU emiten</text>
<text x="546" y="104" font-size="10" fill="var(--text-muted)">satu download = seisi filing</text>
<text x="546" y="124" font-size="10" fill="var(--text-muted)">/api/xbrl/companyfacts/…</text>
<text x="546" y="140" font-size="10" fill="var(--text-muted)">pilihan utama track ini</text>
</g>
<text x="330" y="198" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">Aturan: companyfacts = borong semua fakta satu emiten; companyconcept = intip satu concept.</text>
</svg>`;

// Diagram: struktur JSON companyfacts.
const JSONTREE_SVG = `<svg viewBox="0 0 660 230" role="img" aria-label="Struktur JSON companyfacts: facts berisi taksonomi, berisi concept, berisi units, berisi daftar nilai.">
<g font-family="var(--font-ui)" font-size="11">
<text x="20" y="30" fill="var(--text)" font-weight="600">{ "cik", "entityName", "facts": {</text>
<text x="50" y="58" fill="var(--c1)" font-weight="600">"us-gaap": {   ← taksonomi (kamus)</text>
<text x="80" y="86" fill="var(--c2)" font-weight="600">"Revenues": {   ← concept (kata)</text>
<text x="110" y="114" fill="var(--c3)" font-weight="600">"units": { "USD": [   ← satuan</text>
<text x="140" y="142" fill="var(--text)">{ "end": "2024-09-28", "val": 391035000000,</text>
<text x="140" y="160" fill="var(--text">"accn": "0000320187-24-000070", "fy": 2024,</text>
<text x="140" y="178" fill="var(--text">"fp": "FY", "form": "10-K", "filed": "2024-11-01",</text>
<text x="140" y="196" fill="var(--text">"start": "2023-10-01", "frame": "CY2024" }   ← fakta</text>
<text x="110" y="218" fill="var(--text-muted)">] } } } }</text>
</g>
</svg>`;

export const fdp2: V2Lesson = {
  slug: "fdp2-edgar",
  track: "Financial Data Pipeline",
  module: "Fondasi Data",
  title: "FDP2 — EDGAR API: Menarik Fakta Tanpa API Key",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Error 403 yang menghabiskan dua jam",
      prose: [
        "Bagas sudah menulis skripnya dengan rapi. requests.get ke data.sec.gov, URL companyfacts sudah benar, CIK sudah zero-pad 10 digit. Ia tekan Enter — dan mendapat HTTP 403 Forbidden. Ia cek URL-nya: benar. Ia cek koneksi: normal. Ia ganti library, tambah retry, bahkan restart laptop. Dua jam habis untuk satu error.",
        "Twist-nya: masalahnya bukan di kode, melainkan di SATU baris yang tidak ia tulis — header User-Agent. SEC mewajibkan setiap request membawa identitas: siapa kamu dan email kontakmu. Tanpa itu, server mengira kamu bot anonim dan menutup pintu. Satu baris headers={'User-Agent': 'Bagas bagas@email.com'} — dan 403 berubah menjadi 200 beserta 40 MB fakta keuangan.",
        "Lesson ini tentang tiga endpoint EDGAR, aturan fair access-nya, dan cara membaca struktur JSON companyfacts. Di akhir lesson, kamu bisa menarik seluruh fakta keuangan satu emiten AS dengan satu request — tanpa API key, tanpa registrasi, gratis.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: 'API publik = tanpa aturan'",
        type: "pitfall",
        body: "EDGAR gratis dan tanpa API key, tapi bukan tanpa aturan. Dua aturan keras SEC: (1) header User-Agent berisi nama + email kontak — tanpa ini = 403; (2) maksimal 10 request per detik — lebih dari itu = 403/429 sementara. Ini error #1 dan #2 yang dialami semua pemula EDGAR, dan keduanya diselesaikan dalam 30 detik kalau kamu tahu aturannya.",
      },
      reference: "EDGAR = gratis, tanpa key, tapi wajib User-Agent + maks 10 request/detik.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menarik data keuangan emiten AS langsung dari sumber primernya.",
        "(1) Menyebutkan tiga endpoint EDGAR dan kapan memakai masing-masing; (2) Memetakan ticker menjadi CIK 10-digit;",
        "(3) Menulis request yang lolos aturan fair access SEC (User-Agent + rate limit); (4) Menavigasi struktur JSON companyfacts sampai ke daftar nilai;",
        "(5) Mengekstrak deret revenue lima tahun satu emiten dari data sampel.",
      ],
      tasks: [],
    },
    {
      id: "endpoint",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tiga endpoint: katalog, intip, borong",
      prose: [
        "EDGAR punya tiga pintu utama. Pertama, submissions — katalog filing: 'emiten ini pernah mengajukan filing apa saja?' Lewat https://data.sec.gov/submissions/CIK{cik}.json kamu dapat daftar 10-K, 10-Q, 8-K beserta nomor aksesi (accn) dan tanggalnya. Ini pintu untuk menjawab 'kapan terakhir filing?'",
        "Kedua, companyconcept — intip satu concept: 'berapa revenue emiten ini dari tahun ke tahun?' Endpoint-nya https://data.sec.gov/api/xbrl/companyconcept/CIK{cik}/us-gaap/Revenues.json. Ringan dan fokus, cocok kalau kamu hanya butuh satu-dua pos.",
        "Ketiga, companyfacts — borong semua: https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json mengembalikan SELURUH fakta XBRL satu emiten dalam satu JSON (puluhan MB untuk emiten besar). Ini pilihan utama track ini: satu download, lalu semua analisis dilakukan lokal tanpa request tambahan.",
        "💡 Intuisi: strateginya 'borong sekali, olah berkali-kali'. companyfacts membuatmu independen dari rate limit untuk sisa analisis — parsing, cleaning, dan hitung rasio semuanya terjadi di mesimmu, bukan di server SEC.",
        "Cara membaca: tiga kotak — submissions (katalog filing), companyconcept (satu concept satu emiten), companyfacts (semua fakta satu emiten, pilihan utama).",
        "Interpretasi: untuk pipeline analisis, companyfacts hampir selalu menang — biaya satu download besar lebih murah daripada ratusan request kecil yang masing-masing berisiko kena rate limit.",
      ],
      figure: {
        svg: ENDPOINT_SVG,
        alt: "Tiga endpoint EDGAR: submissions untuk daftar filing, companyconcept untuk satu concept, companyfacts untuk semua fakta.",
        caption: "companyfacts = borong semua fakta satu emiten dalam satu request.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: companyconcept bisa untuk semua emiten sekaligus",
        type: "pitfall",
        body: "Nama 'companyconcept' menipu: ia tetap per-emiten (satu concept, SATU emiten). Tidak ada endpoint 'semua emiten sekaligus' di API XBRL publik — untuk 500 emiten kamu butuh 500 request companyfacts (dengan jeda rate limit). Inilah kenapa pipeline produksi memakai antrean + cache, bukan loop naif.",
      },
      reference: "submissions = katalog; companyconcept = 1 concept 1 emiten; companyfacts = semua fakta 1 emiten.",
    },
    {
      id: "ticker-cik",
      eyebrow: "Langkah 4 · Konsep",
      title: "Ticker → CIK: nomor induk emiten",
      prose: [
        "Setiap emiten di EDGAR punya nomor induk bernama CIK (Central Index Key) — 10 digit, zero-pad di depan. Apple = 0000320187. Ticker (AAPL) adalah nama panggilan untuk manusia; CIK adalah identitas untuk mesin. API XBRL hanya menerima CIK.",
        "Pemetaannya tersedia publik di https://www.sec.gov/files/company_tickers.json — satu JSON berisi pasangan ticker↔CIK untuk semua emiten. Polanya: unduh sekali, simpan sebagai kamus lokal, pakai berkali-kali. Jangan request file ini setiap kali skrip jalan.",
        "Rumusnya sederhana tapi wajib hafal:",
      ],
      formula: String.raw`\text{CIK}_{10} = \text{str(CIK).zfill(10)}`,
      formulaNote: "CIK_10 = CIK sebagai string 10 digit dengan nol di depan (zero-pad). Contoh: 320187 → '0000320187'. URL companyfacts = https://data.sec.gov/api/xbrl/companyfacts/CIK + CIK_10 + '.json'. Lupa zero-pad = 404.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai CIK apa adanya (320187) di URL sehingga menjadi CIK320187.json → 404. Atau lebih halus: memakai integer sehingga nol di depan hilang saat diformat. Selalu konversi ke string dan zfill(10) SEBELUM merangkai URL — jadikan ini baris pertama setiap fungsi fetch EDGAR-mu.",
      },
      reference: "Ticker untuk manusia, CIK 10-digit untuk mesin. Selalu zfill(10).",
    },
    {
      id: "fair-access",
      eyebrow: "Langkah 5 · Konsep",
      title: "Fair access: dua aturan tak tertulis yang tertulis",
      prose: [
        "SEC menerbitkan data ini sebagai layanan publik, dan mereka melindunginya dengan dua aturan. Aturan satu: header User-Agent. Setiap request ke data.sec.gov WAJIB membawa User-Agent berisi nama dan email kontak, misalnya 'RisetMandiri riset@contoh.id'. Ini bukan autentikasi — ini sopan santun yang ditegakkan server. Tanpa User-Agent yang valid: 403.",
        "Aturan dua: maksimal 10 request per detik. Untuk manusia ini longgar — skrip analisis biasa hanya butuh 2–3 request per emiten. Tapi loop naif atas 500 emiten tanpa jeda akan menabraknya dan kena blokir sementara. Pola amannya: time.sleep(0.15) antar request, atau unduh companyfacts sekali lalu olah lokal.",
        "💡 Intuisi: anggap EDGAR seperti perpustakaan umum — gratis masuk, tapi kamu wajib menulis nama di buku tamu (User-Agent) dan tidak boleh memborong semua buku sekaligus (rate limit). Melanggar keduanya bukan kejahatan, tapi pintunya ditutup untukmu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: '403 berarti IP-ku diblokir permanen'",
        type: "pitfall",
        body: "Hampir semua 403 EDGAR adalah salah satu dari dua hal: User-Agent hilang/tidak valid, atau rate limit terlampaui. Keduanya pulih sendiri begitu request-nya diperbaiki (tambah header, beri jeda). Jangan panik, jangan ganti IP, jangan install VPN — baca pesan error-nya dan perbaiki header dulu.",
      },
      reference: "User-Agent (nama + email) wajib; maks 10 req/detik; sleep antar request.",
    },
    {
      id: "struktur-json",
      eyebrow: "Langkah 6 · Konsep",
      title: "Membaca peta: struktur companyfacts",
      prose: [
        "JSON companyfacts terlihat menakutkan (puluhan MB), tapi strukturnya hanya empat tingkat — peta yang sama dengan anatomi XBRL di FDP1. Tingkat 1: facts berisi kamus-kamus (taksonomi): us-gaap, dei, srt. Tingkat 2: tiap taksonomi berisi concept: Revenues, Assets, NetIncomeLoss. Tingkat 3: tiap concept berisi units: USD, shares. Tingkat 4: tiap unit berisi DAFTAR fakta — masing-masing dengan end, val, accn, fy, fp, form, filed, plus start untuk duration dan frame bila ada.",
        "Jalur menuju satu angka selalu sama: data['facts']['us-gaap']['Revenues']['units']['USD'] → list → pilih fakta yang tepat. 'Memilih fakta yang tepat' adalah seluruh isi FDP3 dan FDP4 — di sini cukup tahu jalurnya.",
        "💡 Intuisi: bayangkan lemari arsip empat laci: laci kamus → laci kata → laci satuan → map berisi lembaran fakta. Skrip yang baik tidak pernah 'mengobok-obok' — ia membuka laci yang tepat berurutan. Setiap KeyError yang kamu temui hampir pasti karena salah satu laci kosong (concept tidak ada di taksonomi itu, atau unit-nya bukan USD).",
        "Cara membaca: diagram pohon — facts → 'us-gaap' (taksonomi) → 'Revenues' (concept) → 'units' → 'USD' (satuan) → daftar fakta dengan end/val/accn/fy/fp/form/filed/start/frame.",
        "Interpretasi: empat tingkat = empat pertanyaan: kamus apa? kata apa? satuan apa? fakta yang mana? Jawab berurutan dan kamu tidak akan tersesat di JSON 40 MB.",
      ],
      figure: {
        svg: JSONTREE_SVG,
        alt: "Struktur JSON companyfacts: facts berisi taksonomi, berisi concept, berisi units, berisi daftar nilai.",
        caption: "Empat tingkat: taksonomi → concept → units → daftar fakta.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira 'units' hanya berisi 'USD'. Concept saham (shares outstanding) memakai unit 'shares'; rasio memakai 'pure'. Kode yang hardcode ['USD'] akan KeyError saat menyentuh concept non-moneter. Selalu baca dulu kunci units yang tersedia sebelum memilih.",
      },
      reference: "Jalur fakta: facts → taksonomi → concept → units → list fakta.",
    },
    {
      id: "lab-edgar",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: tarik deret revenue dari JSON sampel",
      prose: [
        "Fetch asli ke data.sec.gov tidak bisa dari browser (tidak support CORS — keterbatasan yang jujur, dibahas di bawah). Jadi lab ini memakai pola yang sama persis dengan data sampel cached: /v2/data/fdp-sample.json — satu emiten fiktif 'Northwind Retail Inc.' dengan struktur companyfacts asli.",
        "Tugasmu: muat JSON-nya, navigasi empat tingkat ke us-gaap:Revenues dalam USD, lalu saring hanya fakta tahunan (form 10-K, fp FY, dan punya frame) menjadi deret {tahun: nilai}. Filter frame penting: tanpa itu, kamu bisa menangkap fakta restatement (duplikat tahun yang sama dari filing berbeda) — topik FDP4.",
        "Cara membaca: dict rev yang rapi {2020: ..., 2021: ...} berarti navigasi dan filter-mu benar. Nilai 2024 harus 391035000000.",
        "Interpretasi: lab ini adalah miniatur seluruh track — navigasi (FDP2), filter fakta tepat (FDP3), dan kewaspadaan duplikat (FDP4) dalam 15 baris kode.",
      ],
      tasks: [
        { id: "t1", text: "Muat JSON sampel dan ambil `nama` emiten (entityName)" },
        { id: "t2", text: "Navigasi ke daftar fakta `us-gaap:Revenues` satuan USD" },
        { id: "t3", text: "Saring fakta tahunan (form 10-K, fp FY, punya frame) menjadi dict `rev` {fy: val}" },
        { id: "t4", text: "Cetak nama dan deretnya dengan `print`" },
      ],
      expected: "nama=NORTHWIND RETAIL INC | rev={2020: 274515000000, 2021: 365817000000, 2022: 394328000000, 2023: 383285000000, 2024: 391035000000}",
      note: {
        title: "Sering salah",
        body: "Lupa filter 'frame' sehingga fakta restatement FY2023 ikut masuk (dict menimpa 2023 dengan nilai restatement 383300000000). Di lab ini itu salah; di FDP4 kamu akan belajar kapan restatement justru yang harus dipakai. Untuk sekarang: filter eksplisit, jangan mengandalkan keberuntungan urutan.",
      },
      hints: [
        "from pyodide.http import open_url; import json; data = json.loads(open_url('/v2/data/fdp-sample.json').read())",
        "Jalur: data['facts']['us-gaap']['Revenues']['units']['USD'] — sebuah list.",
        "Filter: f['form']=='10-K' and f['fp']=='FY' and 'frame' in f. Lalu rev[f['fy']] = f['val'].",
      ],
      code: {
        starter: `from pyodide.http import open_url\nimport json\n\n# Sampel companyfacts (struktur asli, emiten fiktif)\ndata = json.loads(open_url("/v2/data/fdp-sample.json").read())\n\n# TULIS KODEMU: nama emiten\nnama = \n\n# TULIS KODEMU: daftar fakta Revenues (USD)\nfacts = \n\n# TULIS KODEMU: saring fakta tahunan -> dict {fy: val}\nrev = {}\nfor f in facts:\n    if :\n        rev[] = \n\nprint(f"nama={nama}")\nprint(f"rev={rev}")`,
        lockLines: 5,
        solution: `from pyodide.http import open_url\nimport json\n\n# Sampel companyfacts (struktur asli, emiten fiktif)\ndata = json.loads(open_url("/v2/data/fdp-sample.json").read())\n\n# Nama emiten\nnama = data["entityName"]\n\n# Daftar fakta Revenues (USD)\nfacts = data["facts"]["us-gaap"]["Revenues"]["units"]["USD"]\n\n# Saring fakta tahunan -> dict {fy: val}\nrev = {}\nfor f in facts:\n    if f["form"] == "10-K" and f["fp"] == "FY" and "frame" in f:\n        rev[f["fy"]] = f["val"]\n\nprint(f"nama={nama}")\nprint(f"rev={rev}")`,
        checks: [
          { kind: "equal", task: "t1", name: "nama", value: "NORTHWIND RETAIL INC", label: "`nama` tepat", msg: "entityName dari JSON sampel." },
          { kind: "equal", task: "t3", name: "rev", value: {2020: 274515000000, 2021: 365817000000, 2022: 394328000000, 2023: 383285000000, 2024: 391035000000}, label: "`rev` 5 tahun tepat", msg: "2020–2024, hanya fakta tahunan ber-frame. Tanpa filter frame, 2023 tertimpa restatement." },
          { kind: "stdout_matches", task: "t4", pattern: "nama=NORTHWIND RETAIL INC", label: "`print` menampilkan nama", msg: "Baris pertama: nama=NORTHWIND RETAIL INC." },
          { kind: "stdout_matches", task: "t4", pattern: "2024: 391035000000", label: "`print` menampilkan 2024", msg: "Deret harus memuat 2024: 391035000000." },
        ],
      },
      reference: "Navigasi 4 tingkat + filter eksplisit = deret bersih. Filter frame mengusir restatement (untuk sekarang).",
    },
    {
      id: "colab-route",
      eyebrow: "Langkah 8 · Guided task",
      title: "Rute real: fetch EDGAR dari Colab",
      prose: [
        "Lab di atas memakai data sampel karena browser tidak bisa fetch ke data.sec.gov (tidak support CORS — server SEC menolak request lintas-origin dari JavaScript). Ini bukan bug lesson; ini kebijakan server. Rute real-nya: jalankan skrip Python di Colab atau laptop — di sana requests bekerja normal.",
        "Skrip Colab-nya (salin ke notebook; ganti email dengan emailmu): import requests, lalu headers = {'User-Agent': 'NamaKamu email@kamu.id', 'Accept-Encoding': 'gzip'}. Ambil CIK: dari file company_tickers.json, atau hardcode dulu untuk satu emiten. Rangkai URL: f'https://data.sec.gov/api/xbrl/companyfacts/CIK{cik.zfill(10)}.json'. Lalu r = requests.get(url, headers=headers); r.raise_for_status(); data = r.json().",
        "Setelah itu, kode parsing-nya IDENTIK dengan lab di atas — dict rev yang sama, filter yang sama. Itulah gunanya lab sampel: logika yang kamu uji di browser berjalan tanpa perubahan di Colab, hanya sumber datanya yang berubah dari file lokal menjadi API real.",
        "Tugas terpandu: di Colab, tarik us-gaap:Revenues satu emiten pilihanmu (mis. AAPL, MSFT, atau TSLA), tampilkan 5 tahun terakhir, dan bandingkan satu angka dengan laporan tahunannya (PDF) — verifikasi manual satu titik sebelum percaya pada pipeline.",
      ],
      tasks: [],
      note: {
        title: "Catatan kejujuran: kenapa tidak fetch langsung di lesson",
        type: "pitfall",
        body: "Dua server, dua penolakan: data.sec.gov tidak mengirim header CORS (browser memblokir), dan idx.co.id memblokir request otomatis via Cloudflare. Jadi arsitektur track ini jujur sejak awal: browser untuk logika (data sampel), Colab/laptop untuk fetch real. Kalau suatu hari SEC mengaktifkan CORS, lab ini tinggal ganti URL — logikanya tidak berubah.",
      },
      reference: "Browser = logika dengan sampel. Colab = fetch real. Kode parsing-nya sama.",
    },
    {
      id: "intuisi",
      eyebrow: "Langkah 9 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Borong sekali, olah berkali-kali. companyfacts memindahkan biaya dari 'banyak request kecil yang rapuh' menjadi 'satu download besar yang mandiri'. Setelah JSON ada di disk-mu, SEC bisa maintenance pun analisismu tetap jalan.",
        "💡 User-Agent adalah surat perkenalan, bukan password. SEC tidak mengautentikasi siapa pun — mereka hanya ingin tahu siapa yang mengambil data publik mereka. Kegagalan menulis satu baris header telah menghabiskan lebih banyak jam engineer daripada semua bug parsing digabungkan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: API publik yang baik itu seperti perpustakaan yang baik",
        body: "Perpustakaan umum tidak memungut biaya, tidak meminta KTP untuk masuk — tapi mewajibkan mengisi buku tamu dan membatasi buku yang dibawa sekaligus. EDGAR persis begitu: gratis tanpa key (tidak pungut biaya), wajib User-Agent (buku tamu), maks 10 request/detik (batas bawaan). Engineer yang menghormati tiga hal ini tidak akan pernah kena 403. Yang mengabaikannya akan menghabiskan dua jam seperti Bagas — untuk masalah satu baris.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Endpoint mana untuk kebutuhan apa",
      prose: [
        "Tiga pintu, tiga kegunaan. Salah pilih pintu = kerja dua kali atau data yang salah bentuk.",
        "Skenario 1 — 'Kapan terakhir emiten ini filing 10-K?' Kondisi: butuh daftar filing + tanggal. Keputusan: submissions. Jangan unduh companyfacts 40 MB hanya untuk menjawab satu tanggal.",
        "Skenario 2 — 'Berapa deret revenue 10 tahun emiten ini?' Kondisi: satu concept, satu emiten. Keputusan: companyconcept/us-gaap/Revenues — ringan, langsung ke sasaran.",
        "Skenario 3 — 'Bangun dataset 15 pos untuk 1 emiten.' Kondisi: analisis multi-pos. Keputusan: companyfacts — satu download, olah lokal. Memanggil companyconcept 15 kali = 15 request + 15 risiko rate limit untuk hasil yang sama.",
        "Skenario 4 — 'Dapatkan '403' padahal URL benar.' Kondisi: error misterius. Keputusan: cek User-Agent dulu (90% kasus), lalu cek rate (9% kasus), baru curigai hal lain (1%). Urutan diagnosis ini menghemat jam.",
        "Aturan praktis 10 detik: satu tanggal → submissions. Satu concept → companyconcept. Banyak concept → companyfacts. Error 403 → header dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai companyfacts untuk menjawab 'kapan filing terakhir' — seperti menyewa truk kontainer untuk membeli satu bungkus mie. Bisa, tapi 40 MB untuk satu tanggal adalah pemborosan yang membuat skrip lambat dan boros memori tanpa alasan.",
      },
      reference: "Tanggal → submissions. Satu concept → companyconcept. Banyak pos → companyfacts.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 11 · Mini-case",
      title: "Mini-case: rangkai URL yang benar",
      prose: [
        "Skrip Bagas gagal dua kali sebelum berhasil: pertama 403 (lupa User-Agent), kedua 404 (lupa zero-pad CIK). Mini-case ini memastikan kamu tidak mengulangi keduanya — dengan membangun URL companyfacts yang valid dari ticker mentah.",
        "Diketahui: ticker 'AAPL' memetakan ke CIK integer 320187 (dari company_tickers.json). Tugas: buat CIK 10-digit dengan zero-pad, rangkai URL companyfacts lengkap, dan verifikasi panjang string CIK-nya tepat 10.",
        "Interpretasi: tiga baris ini adalah fondasi setiap fungsi fetch EDGAR yang akan kamu tulis di FDP6. Salah satu baris = 404 atau 403 di capstone.",
      ],
      tasks: [
        { id: "t1", text: "Buat `cik10` dari CIK integer 320187 (zero-pad 10 digit)" },
        { id: "t2", text: "Rangkai `url` companyfacts lengkap" },
        { id: "t3", text: "Cetak `cik10`, panjangnya, dan `url`" },
      ],
      expected: "cik10=0000320187 | panjang=10 | url=https://data.sec.gov/api/xbrl/companyfacts/CIK0000320187.json",
      hints: [
        "cik10 = str(320187).zfill(10).",
        "url = f'https://data.sec.gov/api/xbrl/companyfacts/CIK{cik10}.json'.",
        "len(cik10) harus 10.",
      ],
      code: {
        starter: `# Mini-case: rangkai URL EDGAR yang benar\nticker = "AAPL"\ncik = 320187  # dari company_tickers.json\n\n# TULIS KODEMU\ncik10 = \nurl = \n\nprint(f"cik10={cik10}")\nprint(f"panjang={len(cik10)}")\nprint(f"url={url}")`,
        lockLines: 4,
        solution: `# Mini-case: rangkai URL EDGAR yang benar\nticker = "AAPL"\ncik = 320187  # dari company_tickers.json\n\n# TULIS KODEMU\ncik10 = str(cik).zfill(10)\nurl = f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik10}.json"\n\nprint(f"cik10={cik10}")\nprint(f"panjang={len(cik10)}")\nprint(f"url={url}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cik10", value: "0000320187", label: "`cik10` tepat", msg: "str(320187).zfill(10) = '0000320187'." },
          { kind: "equal", task: "t2", name: "url", value: "https://data.sec.gov/api/xbrl/companyfacts/CIK0000320187.json", label: "`url` tepat", msg: "Format: .../companyfacts/CIK + 10 digit + .json." },
          { kind: "stdout_matches", task: "t3", pattern: "panjang=10", label: "`print` menampilkan panjang", msg: "Baris kedua: panjang=10." },
        ],
      },
      reference: "zfill(10) dulu, baru rangkai URL. Urutan ini tidak bisa dibalik.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "Tiga endpoint: submissions (katalog filing), companyconcept (1 concept 1 emiten), companyfacts (semua fakta 1 emiten — pilihan utama).",
        "Ticker untuk manusia, CIK 10-digit (zfill) untuk mesin; pemetaan di company_tickers.json.",
        "Fair access: User-Agent (nama + email) wajib, maks 10 request/detik — 403 hampir selalu salah satunya.",
        "Struktur JSON: facts → taksonomi → concept → units → daftar fakta (end/val/accn/fy/fp/form/filed).",
        "Browser tidak bisa fetch EDGAR (no CORS): logika diuji dengan sampel, fetch real di Colab.",
      ],
      next: { label: "FDP3 — Parsing: Dari JSON Berantakan ke Tabel Kanonis", href: "/v2/learn/fdp3-parsing" },
      quiz: [
        {
          q: "Kapan memakai companyfacts dibanding companyconcept?",
          options: [
            { text: "Selalu companyconcept — lebih ringan", why: "Ringan tapi 15 concept = 15 request. Untuk analisis multi-pos, companyfacts (1 request) menang telak." },
            { text: "companyfacts saat butuh banyak pos satu emiten; companyconcept saat hanya butuh 1–2 pos", why: "Tepat: borong sekali untuk analisis, intip ringan untuk kebutuhan tunggal.", correct: true },
            { text: "companyfacts untuk banyak emiten sekaligus", why: "Salah: companyfacts tetap per-emiten. Tidak ada endpoint lintas-emiten di API XBRL publik." },
            { text: "Tidak ada bedanya", why: "Beda besar: satu download 40 MB vs satu concept ringan — pilih sesuai kebutuhan." }
          ],
        },
        {
          q: "Request ke data.sec.gov mengembalikan 403 padahal URL benar. Diagnosis pertama yang benar?",
          options: [
            { text: "Daftar API key ke SEC", why: "EDGAR tidak memakai API key — mendaftar tidak menyelesaikan apa pun." },
            { text: "Coba lagi 100x sampai lolos", why: "Retry buta justru memicu rate limit dan memperpanjang blokir sementara." },
            { text: "Ganti IP dengan VPN", why: "Panik dan salah sasaran: 403 EDGAR hampir selalu soal header, bukan IP." },
            { text: "Cek header User-Agent (nama + email), lalu cek rate limit", why: "Tepat: 90% kasus = User-Agent hilang/tidak valid; 9% = rate limit. Urutan ini menghemat jam.", correct: true }
          ],
        },
        {
          q: "CIK Apple adalah 320187 (integer). Bentuk yang benar untuk URL adalah…",
          options: [
            { text: "CIK0000320187", why: "Tepat: str(320187).zfill(10) = '0000320187'.", correct: true },
            { text: "CIK00320187", why: "Hanya 8 digit — kurang dua nol." },
            { text: "3201870000", why: "Nol di belakang, bukan di depan — salah total." },
            { text: "CIK320187", why: "Kurang 4 digit nol di depan → 404." }
          ],
        },
        {
          q: "Jalur yang benar menuju daftar nilai revenue dalam USD adalah…",
          options: [
            { text: "data['units']['USD']['Revenues']", why: "Urutan terbalik — units ada DI DALAM concept, bukan sebaliknya." },
            { text: "data['Revenues']['USD']", why: "Melewatkan dua tingkat: facts dan taksonomi (us-gaap)." },
            { text: "data['facts']['us-gaap']['Revenues']['units']['USD']", why: "Tepat: empat tingkat berurutan — facts → taksonomi → concept → units → list.", correct: true },
            { text: "data['facts']['Revenues']", why: "Melewatkan tingkat taksonomi — KeyError." }
          ],
        },
        {
          q: "Kenapa lab lesson ini memakai JSON sampel, bukan fetch langsung ke EDGAR?",
          options: [
            { text: "Karena EDGAR berbayar", why: "Salah: EDGAR gratis tanpa API key." },
            { text: "Karena data.sec.gov tidak support CORS sehingga browser memblokir fetch-nya", why: "Tepat: kebijakan server, bukan bug. Rute real-nya Colab/laptop dengan requests.", correct: true },
            { text: "Karena JSON sampel lebih akurat", why: "Terbalik: sampel adalah fiksi terstruktur; data real selalu lebih akurat." },
            { text: "Karena Python tidak bisa fetch URL", why: "requests bisa — yang tidak bisa adalah JavaScript di browser karena CORS." }
          ],
        },
      ],
    },
  ],
};
