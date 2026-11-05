import type { V2Mission } from "../lib/types";

// ── MISI Atribusi: Saluran yang Dituduh Bakar Uang ───────────────────────
// M2 — Marketing Analytics Misi A (core). Dataset SINTETIS 100% (generator
// Python, seed 42; BUKAN data observasi nyata). File: public/misi/
// misi-atribusi-menipu/perjalanan.csv (4.000 journey), sentuhan.csv,
// belanja.csv, efek_kausal.csv. Metode: METODE.md.

export const misiAtribusi: V2Mission = {
  slug: "misi-atribusi-menipu",
  track: "Marketing Analytics",
  module: "Misi",
  title: "Misi Atribusi yang Menipu",
  estMinutes: 140,
  role: "Marketing data analyst",
  client:
    "CMO — meminta validasi rencana pemotongan 70% budget display mulai kuartal depan karena last-touch ROI channel itu jelek",
  xp: 560,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Saluran yang dituduh bakar uang",
      prose: [],
      tasks: [],
      briefing: {
        role: "Marketing data analyst di sebuah perusahaan ritel online — penjaga angka di antara CMO dan vendor media",
        client:
          "Chief Marketing Officer (CMO). Deck atribusi Q3 dari vendor mengklaim ROI last-touch display hanya 0,38 — “bakar uang”. Ia mau memotong 70% budget display mulai kuartal depan dan mengalihkannya ke search yang “ROI-nya 1,73”. Kamu diminta memvalidasi: hitung ulang dari data mentah, bandingkan antar model atribusi, temukan manipulasi di deck vendor, dan tulis memo yang berani bilang “jangan potong” kalau buktinya berkata begitu.",
        story: [
          "Senin, 08:12. Pesan dari CMO: “Deck atribusi Q3 sudah jadi. Display ROI 0,38 — bakar uang. Aku mau potong 70% mulai kuartal depan, alihkan ke search. Kamu orang data, kamu validasi ya.” Lampirannya: satu PDF mengkilap dari vendor media, penuh logo dan panah hijau.",
          "Kamu menatap angka 0,38 itu. Search memang selalu terlihat hebat di laporan last-touch — wajar, ia menangkap orang yang SUDAH mau beli. Tapi siapa yang membuat orang-orang itu mau beli sejak awal? Di PDF vendor, pertanyaan itu tidak pernah ditanyakan. Dan itu tepatnya yang membuatmu curiga.",
          "Misi ini memakai data SINTETIS 100% (generator Python, seed 42 — bukan data observasi nyata) yang dirancang dengan satu jebakan jujur: efek kausal tiap channel DIKETAHUI dan didokumentasikan. Tugasmu: buktikan bahwa model atribusi yang dipakai untuk memvonis display adalah model yang salah untuk pertanyaan “channel mana yang menggerakkan demand”.",
        ],
        objectives: [
          "Menghitung atribusi last-touch, first-touch, dan berbasis posisi (40-20-40) dari data mentah, lalu menghitung ROI tiap channel di tiap model.",
          "Membandingkan peringkat channel menurut tiap model atribusi dengan efek kausal yang didokumentasikan generator — dan menjelaskan mengapa last-touch memvonis display secara keliru.",
          "Menemukan minimal 3 suntikan di deck atribusi vendor dan menulis memo rekomendasi budget yang dipertahankan dengan angka.",
        ],
        prereqSummary:
          "Atribusi = aturan membagi kredit satu konversi ke sentuhan-sentuhan iklan dalam journey-nya. Last-touch: 100% kredit ke sentuhan TERAKHIR. First-touch: 100% ke sentuhan PERTAMA. Berbasis posisi (U-shape): 40% ke pertama, 40% ke terakhir, 20% dibagi rata ke sentuhan tengah. Incrementality adalah pertanyaan KAUSAL yang berbeda: berapa konversi yang TIDAK akan terjadi tanpa channel ini — tidak bisa dijawab atribusi observasional, hanya oleh eksperimen (mis. holdout geografis). Kunci misi ini: atribusi mengukur korelasi pemberian kredit, bukan sebab-akibat.",
        datasetNote:
          "Data SINTETIS 100% — dibangkitkan skrip Python (seed 42), BUKAN data observasi nyata.\nFile perjalanan.csv: 4.000 customer journey (urutan sentuhan antar channel, status konversi, nilai Rp 250.000 per konversi).\nFile sentuhan.csv: detail tiap sentuhan (channel + hari ke-berapa dalam journey 30 hari).\nFile belanja.csv: belanja media per channel (display Rp 40 jt, social Rp 25 jt, search Rp 30 jt, email Rp 10 jt).\nFile efek_kausal.csv: efek kausal tiap channel menurut generator — “kunci jawaban” yang di dunia nyata TIDAK PERNAH kamu miliki.\nMetode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Empat file dan satu kunci jawaban",
      prose: [
        "Empat file menunggumu di `/misi/misi-atribusi-menipu/`. `perjalanan.csv` adalah kebenaran mentah: 4.000 journey, masing-masing dengan urutan sentuhan (mis. `display > social > search`), status konversi, dan nilai Rp 250.000 bila berkonversi. `sentuhan.csv` merinci tiap sentuhan: channel apa, di hari ke-berapa. `belanja.csv` mencatat belanja media per channel. Dan `efek_kausal.csv` — yang paling tidak biasa — berisi efek kausal tiap channel MENURUT GENERATOR: berapa poin persentase kenaikan peluang konversi yang benar-benar disebabkan tiap channel.",
        "Kata SINTETIS di sini bukan label malu-malu. Justru sebaliknya: karena datanya sintetis, kita TAHU kebenaran kausalnya — kemewahan yang tidak pernah dimiliki analis di dunia nyata. Di dunia nyata, tidak ada file `efek_kausal.csv`; yang ada hanya atribusi observasional dan harapan. Misi ini melatihmu membedakan keduanya selagi kamu masih memegang kunci jawabannya.",
        "Aturan main: (1) semua angka atribusi dihitung dari file mentah, bukan dari klaim deck vendor; (2) satu konversi = Rp 250.000, dibagi menurut aturan model atribusi; (3) vonis “potong/jangan potong” diambil setelah membandingkan SEMUA model dengan efek kausal, bukan dari satu model saja.",
        "Cara membaca grafik di bawah: tiap kelompok batang = satu model atribusi; tinggi batang = pendapatan (Rp juta) yang dikreditkan ke display (emas) vs search (toska). Sumbu Y 0–100 juta.",
        "Interpretasi: perhatikan bagaimana nasib display BERBALIK total antar model — dari Rp 30,75 jt (last-touch, paling kecil) menjadi Rp 97,25 jt (first-touch, paling besar). Search bergerak sebaliknya. Model yang sama, data yang sama, vonis yang berlawanan — itulah kenapa pilihan model atribusi BUKAN detail teknis, melainkan keputusan bisnis.",
      ],
      tasks: [
        { id: "t1", text: "Buka `perjalanan.csv`: catat jumlah journey dan arti kolom `sentuhan`" },
        { id: "t2", text: "Buka `efek_kausal.csv`: catat channel mana yang efek kausalnya terbesar dan terkecil" },
        { id: "t3", text: "Buka `belanja.csv`: catat belanja tiap channel (dalam Rp juta)" },
      ],
      figure: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="330" viewBox="0 0 640 330" role="img">
<rect x="0" y="0" width="640" height="330" fill="none"/>
<text x="320" y="24" text-anchor="middle" fill="#e8e6e3" font-size="15" font-weight="bold">Pendapatan teratribusi: display vs search (Rp juta)</text>
<g stroke="#3a3a3a" stroke-width="1">
<line x1="60" y1="260" x2="600" y2="260"/><line x1="60" y1="205" x2="600" y2="205"/>
<line x1="60" y1="150" x2="600" y2="150"/><line x1="60" y1="95" x2="600" y2="95"/>
<line x1="60" y1="40" x2="600" y2="40"/>
</g>
<g fill="#8a8a8a" font-size="11" text-anchor="end">
<text x="55" y="264">0</text><text x="55" y="209">25</text><text x="55" y="154">50</text>
<text x="55" y="99">75</text><text x="55" y="44">100</text>
</g>
<g>
<rect x="90" y="192.4" width="44" height="67.6" fill="#d9a441"/>
<rect x="146" y="145.6" width="44" height="114.4" fill="#45b8a8"/>
<rect x="250" y="46.1" width="44" height="213.9" fill="#d9a441"/>
<rect x="306" y="239.1" width="44" height="20.9" fill="#45b8a8"/>
<rect x="410" y="133.9" width="44" height="126.1" fill="#d9a441"/>
<rect x="466" y="200.9" width="44" height="59.1" fill="#45b8a8"/>
</g>
<g fill="#e8e6e3" font-size="11" text-anchor="middle">
<text x="112" y="186">30,75</text><text x="168" y="139">52,00</text>
<text x="272" y="40">97,25</text><text x="328" y="233">9,50</text>
<text x="432" y="127">57,33</text><text x="488" y="194">26,85</text>
</g>
<g fill="#e8e6e3" font-size="12" text-anchor="middle">
<text x="140" y="280">Last-touch</text><text x="300" y="280">First-touch</text><text x="460" y="280">Posisi 40-20-40</text>
</g>
<g font-size="12">
<rect x="60" y="296" width="14" height="14" fill="#d9a441"/>
<text x="80" y="308" fill="#e8e6e3">display</text>
<rect x="150" y="296" width="14" height="14" fill="#45b8a8"/>
<text x="170" y="308" fill="#e8e6e3">search</text>
</g>
</svg>`,
        alt: "Diagram batang: pendapatan yang diatribusikan ke display vs search menurut tiga model atribusi",
        caption: "Data SINTETIS misi ini. Display: 30,75 → 97,25 → 57,33 jt. Search: 52,00 → 9,50 → 26,85 jt.",
      },
      note: {
        title: "Miskonsepsi #1: atribusi = kontribusi kausal",
        type: "pitfall",
        body: "“Search mendapat kredit Rp 52 jt secara last-touch, jadi search MENYEBABKAN Rp 52 jt penjualan.” SALAH. Last-touch memberi kredit ke PENUTUP, bukan ke PENYEBAB. Search muncul terakhir karena orang yang sudah mau beli mengetik nama brand — ia memanen demand yang ditanam display berminggu-minggu sebelumnya. Mengira “yang terakhir disentuh = yang menyebabkan” adalah fondasi dari hampir semua keputusan budget yang salah di marketing.",
      },
      reference:
        "perjalanan.csv (4.000 journey, mentah) + sentuhan.csv (detail tiap sentuhan) + belanja.csv (spend per channel) + efek_kausal.csv (kunci jawaban kausal dari generator). Atribusi dihitung dari yang mentah; vonis dibandingkan dengan kunci jawaban.",
    },
    {
      id: "lab-atribusi",
      eyebrow: "Langkah 3 · Lab 1 — Tiga model, tiga vonis",
      title: "Hitung sendiri sebelum percaya deck vendor",
      prose: [
        "Sekarang buktikan dengan tanganmu sendiri. Dari `perjalanan.csv`: hitung pendapatan last-touch dan ROI tiap channel, lalu ulangi dengan first-touch dan model berbasis posisi 40-20-40. Terakhir, buka `efek_kausal.csv` dan bandingkan peringkatnya — di situlah letak vonisnya.",
        "Satu angka kunci untuk lab ini: dari 208 konversi yang last-touch-nya search, 56,73% ternyata pernah tersentuh display LEBIH DULU. Pikirkan apa artinya itu selagi kodemu berjalan.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_journey` dan `n_konversi`" },
        { id: "t2", text: "Hitung pendapatan last-touch + ROI display dan search (`rev_lt_display`, `rev_lt_search`, `roi_lt_display`, `roi_lt_search`)" },
        { id: "t3", text: "Hitung pendapatan first-touch display (`rev_ft_display`)" },
        { id: "t4", text: "Hitung pendapatan posisi 40-20-40 display (`rev_pos_display`) + fraksi konversi last-touch search yang pernah tersentuh display" },
        { id: "t5", text: "Ambil efek kausal display dari tabel kausal (`pp_display`, dalam poin persentase)" },
      ],
      expected:
        "n_journey=4000, n_konversi=676, rev_lt_display=30,75 jt (ROI 0,77), rev_lt_search=52,00 jt (ROI 1,73), rev_ft_display=97,25 jt, rev_pos_display=57,33 jt, fraksi=0,5673, pp_display=9,21",
      formula: String.raw`\text{ROI}_{last-touch} = \frac{\text{pendapatan teratribusi (last-touch)}}{\text{belanja media}}`,
      formulaNote:
        "Pembilang = total Rp 250.000 dari konversi yang sentuhan TERAKHIR-nya channel itu (dalam Rp juta). Penyebut = belanja media channel itu dari belanja.csv (display Rp 40 jt). ROI 0,77 artinya: tiap Rp 1 belanja display “dikreditkan” Rp 0,77 pendapatan. Contoh: 30,75 / 40 = 0,77.",
      note: {
        title: "Miskonsepsi #2: ROI < 1 = channel tidak berguna",
        type: "pitfall",
        body: "“ROI last-touch display 0,77 < 1, jadi display merugi — potong saja.” SALAH dua lapis. Lapis 1: ROI last-touch bukan ROI kausal; display membangun demand yang dipanen channel lain (56,73% konversi “milik” search pernah tersentuh display). Lapis 2: bahkan ROI kausal pun butuh eksperimen untuk dibuktikan — angka observasional hanya awal pertanyaan, bukan vonis.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(BASE + \"/perjalanan.csv\"))` — BASE sudah disiapkan.",
        "Pecah kolom sentuhan: `perj[\"daftar\"] = perj[\"sentuhan\"].str.split(\" > \")` — lalu ambil elemen pertama/terakhir. Abaikan journey bertanda `-` (tanpa sentuhan).",
        "Pendapatan dalam Rp juta: `groupby(...)[\"nilai_rp\"].sum() / 1e6`, lalu `round(..., 2)`.",
        "Posisi 40-20-40: journey 1 sentuhan → 100% ke channel itu; selebihnya 0,4 ke pertama + 0,4 ke terakhir + 0,2 dibagi rata ke tengah.",
        "Fraksi: dari konversi ber-last-touch search, berapa proporsi yang list sentuhannya (kecuali terakhir) mengandung `display`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-atribusi-menipu\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "perj = pd.read_csv(open_url(BASE + \"/perjalanan.csv\"))",
          "kausal = pd.read_csv(open_url(BASE + \"/efek_kausal.csv\"))",
          "",
          "n_journey = ...",
          "n_konversi = ...",
          "",
          "perj[\"daftar\"] = ...",
          "perj[\"pertama\"] = ...",
          "perj[\"terakhir\"] = ...",
          "",
          "konv = ...",
          "ada = ...   # hanya journey berkonversi DAN punya sentuhan",
          "",
          "lt = ...",
          "rev_lt_display = ...",
          "rev_lt_search = ...",
          "",
          "spend = {\"display\": 40_000_000, \"social\": 25_000_000, \"search\": 30_000_000, \"email\": 10_000_000}",
          "roi_lt_display = ...",
          "roi_lt_search = ...",
          "",
          "ft = ...",
          "rev_ft_display = ...",
          "",
          "def bobot_posisi(daftar):",
          "    ...   # 40% pertama, 40% terakhir, 20% dibagi rata ke sentuhan tengah",
          "",
          "rev_pos_display = ...",
          "",
          "s_lt = ...",
          "frac_search_dengan_display = ...",
          "",
          "pp_display = ...",
          "",
          "print(\"journey:\", n_journey, \"| konversi:\", n_konversi)",
          "print(\"last-touch display: Rp\", rev_lt_display, \"jt | ROI\", roi_lt_display)",
          "print(\"last-touch search: Rp\", rev_lt_search, \"jt | ROI\", roi_lt_search)",
          "print(\"first-touch display: Rp\", rev_ft_display, \"jt | posisi 40-20-40 display: Rp\", rev_pos_display, \"jt\")",
          "print(\"fraksi konversi last-touch search yang pernah tersentuh display:\", frac_search_dengan_display)",
          "print(\"efek kausal display: +\", pp_display, \"pp\")",
          "",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-atribusi-menipu\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "perj = pd.read_csv(open_url(BASE + \"/perjalanan.csv\"))",
          "kausal = pd.read_csv(open_url(BASE + \"/efek_kausal.csv\"))",
          "",
          "n_journey = len(perj)",
          "n_konversi = int(perj[\"konversi\"].sum())",
          "",
          "perj[\"daftar\"] = perj[\"sentuhan\"].str.split(\" > \")",
          "perj[\"pertama\"] = perj[\"daftar\"].str[0]",
          "perj[\"terakhir\"] = perj[\"daftar\"].str[-1]",
          "",
          "konv = perj[perj[\"konversi\"] == 1]",
          "ada = konv[konv[\"sentuhan\"] != \"-\"]",
          "",
          "lt = ada.groupby(\"terakhir\")[\"nilai_rp\"].sum() / 1e6",
          "rev_lt_display = round(float(lt[\"display\"]), 2)",
          "rev_lt_search = round(float(lt[\"search\"]), 2)",
          "",
          "spend = {\"display\": 40_000_000, \"social\": 25_000_000, \"search\": 30_000_000, \"email\": 10_000_000}",
          "roi_lt_display = round(rev_lt_display * 1e6 / spend[\"display\"], 2)",
          "roi_lt_search = round(rev_lt_search * 1e6 / spend[\"search\"], 2)",
          "",
          "ft = ada.groupby(\"pertama\")[\"nilai_rp\"].sum() / 1e6",
          "rev_ft_display = round(float(ft[\"display\"]), 2)",
          "",
          "def bobot_posisi(daftar):",
          "    m = len(daftar)",
          "    b = {}",
          "    if m == 1:",
          "        b[daftar[0]] = 1.0",
          "    else:",
          "        b[daftar[0]] = b.get(daftar[0], 0) + 0.4",
          "        b[daftar[-1]] = b.get(daftar[-1], 0) + 0.4",
          "        if m > 2:",
          "            for ch in daftar[1:-1]:",
          "                b[ch] = b.get(ch, 0) + 0.2 / (m - 2)",
          "    return b",
          "",
          "rev_pos = {\"display\": 0.0, \"social\": 0.0, \"email\": 0.0, \"search\": 0.0}",
          "for _, r in ada.iterrows():",
          "    for ch, w in bobot_posisi(r[\"daftar\"]).items():",
          "        rev_pos[ch] += r[\"nilai_rp\"] / 1e6 * w",
          "rev_pos_display = round(rev_pos[\"display\"], 2)",
          "",
          "s_lt = ada[ada[\"terakhir\"] == \"search\"]",
          "frac_search_dengan_display = round(float((s_lt[\"daftar\"].apply(lambda d: \"display\" in d[:-1])).mean()), 4)",
          "",
          "pp_display = round(float(kausal.set_index(\"channel\").loc[\"display\", \"kenaikan_peluang_pp\"]), 2)",
          "",
          "print(\"journey:\", n_journey, \"| konversi:\", n_konversi)",
          "print(\"last-touch display: Rp\", rev_lt_display, \"jt | ROI\", roi_lt_display)",
          "print(\"last-touch search: Rp\", rev_lt_search, \"jt | ROI\", roi_lt_search)",
          "print(\"first-touch display: Rp\", rev_ft_display, \"jt | posisi 40-20-40 display: Rp\", rev_pos_display, \"jt\")",
          "print(\"fraksi konversi last-touch search yang pernah tersentuh display:\", frac_search_dengan_display)",
          "print(\"efek kausal display: +\", pp_display, \"pp\")",
          "",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`perj` termuat", name: "perj", msg: "perj harus berisi DataFrame dari perjalanan.csv." },
          { kind: "equal", task: "t1", label: "`n_journey` = 4000", name: "n_journey", value: 4000, msg: "File punya 4.000 customer journey." },
          { kind: "equal", task: "t1", label: "`n_konversi` = 676", name: "n_konversi", value: 676, msg: "676 journey berkonversi (16,90%)." },
          { kind: "equal", task: "t2", label: "`rev_lt_display` = 30,75 jt", name: "rev_lt_display", value: 30.75, tol: 0.01, msg: "Kelompokkan konversi (yang punya sentuhan) menurut sentuhan TERAKHIR, jumlahkan nilai_rp/1e6." },
          { kind: "equal", task: "t2", label: "`rev_lt_search` = 52,00 jt", name: "rev_lt_search", value: 52.0, tol: 0.01, msg: "Search memanen paling banyak kredit last-touch — itu tepatnya jebakannya." },
          { kind: "equal", task: "t2", label: "`roi_lt_display` = 0,77", name: "roi_lt_display", value: 0.77, tol: 0.01, msg: "30,75 / 40 (belanja display Rp 40 jt)." },
          { kind: "equal", task: "t2", label: "`roi_lt_search` = 1,73", name: "roi_lt_search", value: 1.73, tol: 0.01, msg: "52,00 / 30 (belanja search Rp 30 jt)." },
          { kind: "equal", task: "t3", label: "`rev_ft_display` = 97,25 jt", name: "rev_ft_display", value: 97.25, tol: 0.01, msg: "First-touch: display membuka 389 journey konversi. Bandingkan dengan 30,75 jt versi last-touch." },
          { kind: "equal", task: "t4", label: "`rev_pos_display` = 57,33 jt", name: "rev_pos_display", value: 57.33, tol: 0.01, msg: "40% pertama + 40% terakhir + 20% dibagi rata ke tengah. Journey 1 sentuhan = 100% ke channel itu." },
          { kind: "equal", task: "t4", label: "fraksi = 0,5673", name: "frac_search_dengan_display", value: 0.5673, tol: 0.005, msg: "Dari konversi ber-last-touch search, proporsi yang pernah tersentuh display sebelumnya." },
          { kind: "equal", task: "t5", label: "`pp_display` = 9,21", name: "pp_display", value: 9.21, tol: 0.01, msg: "Baca kolom kenaikan_peluang_pp untuk display di efek_kausal.csv — peringkat kausal: display > email > social > search." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — ROI dalam satu query",
      title: "Satu tabel, dua cerita ROI",
      prose: [
        "CMO tidak membaca notebook — ia membaca tabel. Di tabel kecil ini (sudah diagregasi dari Lab 1), hitung ROI last-touch DAN first-touch tiap channel dalam satu query. Satu baris SQL akan menunjukkan mengapa “tampilkan dua kolom” mengubah seluruh rapat budget.",
        "Tabel `ringkasan_channel(channel TEXT, spend_jt REAL, rev_lt_jt REAL, rev_ft_jt REAL)`. Tampilkan channel, roi_lt, roi_ft — urut dari ROI last-touch tertinggi.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query ROI last-touch vs first-touch per channel, urut dari roi_lt tertinggi" },
      ],
      expected: "4 baris — email (3,85 / 1,55), search (1,73 / 0,32), social (1,38 / 1,34), display (0,77 / 2,43)",
      sqlLab: {
        task: "Untuk tiap channel tampilkan channel, ROI last-touch (rev_lt_jt/spend_jt), dan ROI first-touch (rev_ft_jt/spend_jt) — 2 desimal. Urut dari ROI last-touch TERTINGGI.",
        schema: "CREATE TABLE ringkasan_channel(channel TEXT, spend_jt REAL, rev_lt_jt REAL, rev_ft_jt REAL);",
        seedData: [
          "INSERT INTO ringkasan_channel VALUES",
          "('display',40.0,30.75,97.25),",
          "('social',25.0,34.5,33.5),",
          "('email',10.0,38.5,15.5),",
          "('search',30.0,52.0,9.5);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT channel\nFROM ringkasan_channel\n",
        solution: [
          "SELECT channel,",
          "  ROUND(rev_lt_jt/spend_jt, 2) AS roi_lt,",
          "  ROUND(rev_ft_jt/spend_jt, 2) AS roi_ft",
          "FROM ringkasan_channel",
          "ORDER BY roi_lt DESC;",
        ].join("\n"),
        expectedColumns: ["channel", "roi_lt", "roi_ft"],
        expectedRows: [
          ["email", 3.85, 1.55],
          ["search", 1.73, 0.32],
          ["social", 1.38, 1.34],
          ["display", 0.77, 2.43],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiAtribusi;

// ── lanjutan misiAtribusi: langkah 5–12 ──────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_ATRIBUSI: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Budget display mau diapakan?",
    prose: [
      "Angkanya lengkap di tanganmu. Last-touch berkata: display ROI 0,77 — potong. First-touch berkata: display membuka Rp 97,25 jt perjalanan konversi — jangan potong. Efek kausal (kunci jawaban generator) berkata: display +9,21 poin persentase, TERBESAR dari semua channel; search hanya +0,73. CMO menunggu jawabanmu hari ini — dan “nanti dulu” bukan opsi di mejanya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Rekomendasi apa yang kamu sampaikan ke CMO atas budget display? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-potong",
          label: "Setujui pemotongan 70% — angka last-touch sudah jelas",
          rationale:
            "Last-touch adalah standar industri dan angka 0,77 tidak bisa dibantah. Display tidak menutup penjualan; search yang menutup. Budget harus mengikuti yang menutup.",
          nextStepId: "konsekuensi-potong",
          consequenceNote:
            "CMO memotong. Dua kuartal kemudian total konversi turun 18% — termasuk konversi “milik” search, yang ternyata 56,73%-nya dulu dibangun display. Kamu benar secara prosedural; bisnisnya yang membayar.",
        },
        {
          id: "opt-tahan",
          label: "Tahan pemotongan — jalankan uji incrementality (geo holdout 6 minggu) dulu",
          rationale:
            "Atribusi observasional tidak bisa menjawab pertanyaan kausal. Satu-satunya cara jujur memutuskan nasib display adalah eksperimen: matikan display di beberapa wilayah, bandingkan dengan wilayah kontrol.",
          nextStepId: "konsekuensi-tahan",
          consequenceNote:
            "CMO setuju menunda 6 minggu. Holdout menunjukkan display inkremental +8,4% pada total konversi; budget dipertahankan. Kamu membeli kebenaran dengan kesabaran — dan CMO sekarang meminta holdout untuk tiap keputusan budget besar.",
        },
        {
          id: "opt-alih",
          label: "Alihkan 50% budget display ke search — ikut sinyal last-touch tapi tidak ekstrem",
          rationale:
            "Jalan tengah: kurangi yang “terbukti” jelek, tambah yang “terbukti” bagus. Search ROI 1,73 layak dapat amunisi lebih.",
          nextStepId: "konsekuensi-alih",
          consequenceNote:
            "Budget search naik 50% — lelang keyword memanas, CPC naik 31%, volume konversi search hampir tidak bergerak (demand-nya tidak bertambah, hanya diperebutkan lebih mahal). Display yang dilemahkan menanam lebih sedikit demand. Total konversi turun 9%. Jalan tengah yang mengikuti sinyal yang salah tetap salah arah.",
        },
      ],
    },
  },
  {
    id: "konsekuensi-potong",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: display dipotong 70%",
    prose: [
      "CMO menandatangani pemotongan. Kuartal pertama terlihat baik-baik saja — bahkan search “naik” karena panen sisa demand lama. Kuartal kedua: total konversi turun 18%. Yang paling menyakitkan: konversi last-touch search ikut anjlok — demand yang dulu dibangun display sudah habis dipanen, dan tidak ada yang menanam lagi.",
      "Pelajaran yang mahal: last-touch mengoptimasi PANEN, bukan LADANG. Memotong penanam berdasarkan laporan pemanen adalah cara tercepat membunuh pertumbuhan — dengan jeda 1–2 kuartal, cukup lama sampai tidak ada yang menghubungkan sebab dan akibatnya.",
    ],
    tasks: [],
    note: {
      title: "Jeda kausal adalah perisai keputusan buruk",
      body: "Efek pemotongan upper-funnel muncul 1–2 kuartal kemudian — di luar jendela evaluasi “keputusan kuartal ini”. Itulah kenapa keputusan budget butuh metrik inkremental (holdout), bukan atribusi: atribusi selalu memuji pemanen hari ini dan menghukum penanam kemarin.",
    },
  },
  {
    id: "konsekuensi-tahan",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: tahan + uji holdout",
    prose: [
      "CMO — dengan enggan — memberimu 6 minggu. Tim mematikan display di 8 kota (kontrol: 8 kota sepadan), dan hasilnya tidak ambigu: kota tanpa display kehilangan 8,4% total konversi, termasuk konversi search. Display bukan “bakar uang”; ia mesin penanam demand yang tagihannya datang tiap bulan tapi panennya dikreditkan ke orang lain.",
      "Budget dipertahankan. Lebih penting: CMO sekarang mewajibkan uji incrementality sebelum tiap pemotongan budget besar. Satu keputusan yang ditahan dengan benar mengubah budaya pengukuran seluruh tim.",
    ],
    tasks: [],
    note: {
      title: "Eksperimen adalah satu-satunya vonis kausal",
      body: "Di misi ini kamu dimanjakan file efek_kausal.csv. Di dunia nyata file itu tidak ada — yang ada hanya holdout, geo-experiment, atau PSA test. Analis yang baik tahu kapan berhenti menghitung atribusi dan mulai merancang eksperimen.",
    },
  },
  {
    id: "konsekuensi-alih",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: setengah budget pindah ke search",
    prose: [
      "Tiga bulan kemudian angkanya masuk. Budget search naik 50% → CPC naik 31% (kamu menawar melawan dirimu sendiri di lelang keyword brand). Volume konversi search: hampir tidak bergerak — demand-nya tidak bertambah, hanya diperebutkan lebih mahal. Sementara display yang dilemahkan menanam lebih sedikit demand untuk kuartal depan.",
      "Total konversi turun 9%. Jalan tengah yang mengikuti sinyal yang salah tetap salah arah — hanya lebih lambat tibanya.",
    ],
    tasks: [],
    note: {
      title: "Menambah budget ke pemanen tidak menanam apa-apa",
      body: "Search dengan ROI last-touch 1,73 terlihat “layak amunisi”. Tapi ROI itu dihitung pada demand yang ADA — menambah budget tidak menambah demand, hanya menaikkan harga panennya. Inilah diminishing return yang tidak terlihat di laporan last-touch.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 16 baris: deck vendor yang “meyakinkan” itu dimanipulasi",
    prose: [
      "Sebelum menulis memo, satu misi audit. Di bawah ini 16 baris “Deck Atribusi Q3 — Vendor Media”, dokumen yang dipakai CMO untuk menuntut pemotongan display. Seseorang menyuntikkan 4 manipulasi ke dalamnya. Senjatamu: angka Lab 1 dan Lab 2 yang kamu hitung sendiri dari data mentah.",
      "Ingat: deck ini mengklaim ROI display 0,38 — perhitunganmu berkata 0,77. Selisih itu adalah pintu masuknya.",
    ],
    tasks: [],
    auditDossier: {
      version: "atribusi-m2a-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Deck Atribusi Q3 dari vendor media yang dipakai CMO sebagai dasar rencana pemotongan 70% budget display.",
      columns: ["Channel", "Metrik", "Nilai", "Klaim"],
      rows: [
        { rowId: 1, cells: { "Channel": "display", "Metrik": "Pendapatan last-touch", "Nilai": "Rp 30,75 jt", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Sesuai hitungan mentah" }] },
        { rowId: 2, cells: { "Channel": "search", "Metrik": "Pendapatan last-touch", "Nilai": "Rp 52,00 jt", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Sesuai hitungan mentah" }] },
        // ── I1: pendapatan search dihitung dua kali ──
        { rowId: 3, cells: { "Channel": "search", "Metrik": "Pendapatan last-touch", "Nilai": "Rp 52,00 jt", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Sesuai hitungan mentah" }] },
        { rowId: 4, cells: { "Channel": "social", "Metrik": "Pendapatan last-touch", "Nilai": "Rp 34,50 jt", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Sesuai hitungan mentah" }] },
        { rowId: 5, cells: { "Channel": "email", "Metrik": "Pendapatan last-touch", "Nilai": "Rp 38,50 jt", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Sesuai hitungan mentah" }] },
        // ── I2: belanja display digandakan ──
        { rowId: 6, cells: { "Channel": "display", "Metrik": "Belanja media", "Nilai": "Rp 80,00 jt", "Klaim": "Termasuk fee agensi 2× lipat" }, claims: [{ label: "Catatan", value: "Fee dihitung dua kali" }] },
        { rowId: 7, cells: { "Channel": "search", "Metrik": "Belanja media", "Nilai": "Rp 30,00 jt", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Sesuai lembar finance" }] },
        { rowId: 8, cells: { "Channel": "social", "Metrik": "Belanja media", "Nilai": "Rp 25,00 jt", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Sesuai lembar finance" }] },
        { rowId: 9, cells: { "Channel": "email", "Metrik": "Belanja media", "Nilai": "Rp 10,00 jt", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Sesuai lembar finance" }] },
        { rowId: 10, cells: { "Channel": "display", "Metrik": "Pendapatan first-touch", "Nilai": "Rp 97,25 jt", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Sesuai hitungan mentah" }] },
        { rowId: 11, cells: { "Channel": "search", "Metrik": "Pendapatan first-touch", "Nilai": "Rp 9,50 jt", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Sesuai hitungan mentah" }] },
        { rowId: 12, cells: { "Channel": "display", "Metrik": "ROI last-touch", "Nilai": "0,38", "Klaim": "Bakar uang — potong 70%" }, claims: [{ label: "Vonis", value: "Berdasarkan belanja Rp 80 jt" }] },
        // ── I3: klaim incrementality tanpa eksperimen ──
        { rowId: 13, cells: { "Channel": "search", "Metrik": "Klaim incrementality", "Nilai": "+18%", "Klaim": "Uji holdout internal Q3" }, claims: [{ label: "Metode", value: "Holdout (file tidak dilampirkan)" }] },
        { rowId: 14, cells: { "Channel": "—", "Metrik": "Belanja display (lembar finance)", "Nilai": "Rp 40,00 jt", "Klaim": "Sumber: Finance, Q3" }, claims: [{ label: "Status", value: "Angka pembanding resmi" }] },
        // ── I4: periode pendapatan vs belanja tidak sebanding ──
        { rowId: 15, cells: { "Channel": "—", "Metrik": "Catatan periode", "Nilai": "—", "Klaim": "Pendapatan Q3 + sisa Agustus; belanja Q3 saja" }, claims: [{ label: "Periode", value: "Pembilang dan penyebut beda periode" }] },
        { rowId: 16, cells: { "Channel": "—", "Metrik": "Rekomendasi", "Nilai": "—", "Klaim": "Potong budget display 70%" }, claims: [{ label: "Dasar", value: "ROI last-touch 0,38" }] },
      ],
      injections: [
        { key: "search-ganda", rowIds: [2, 3], title: "Pendapatan search dihitung dua kali", clue: "Baris 2 dan 3 identik persis — Rp 52,00 jt tercatat dua kali. Total pendapatan last-touch di deck = Rp 207,75 jt, padahal data mentah = Rp 155,75 jt (676 konversi × Rp 0,25 jt = Rp 169 jt total; 53 konversi tanpa sentuhan tidak teratribusi). Baris ganda menggelembungkan “bukti” keunggulan search.", danger: "Duplikat di laporan vendor membuat channel yang diunggulkan terlihat 2× lebih besar. Obatnya sama seperti di data: agregasi + constraint unik sebelum percaya total." },
        { key: "belanja-ganda", rowIds: [6, 12, 14], title: "Belanja display digandakan via fee ganda", clue: "Deck memakai belanja Rp 80 jt (“fee agensi 2× lipat”); lembar finance berkata Rp 40 jt. ROI 0,38 di baris 12 = 30,75/80 — berdiri di atas penyebut yang salah. Dengan penyebut yang benar, ROI = 0,77. Masih di bawah 1 — tapi “bakar uang”-nya tidak sedramatis yang dijual.", danger: "Penyebut yang digelembungkan adalah cara termurah membuat ROI terlihat hancur. Selalu rekonsiliasi belanja ke sumber finance, bukan ke klaim vendor." },
        { key: "incrementality-palsu", rowIds: [13], title: "Klaim incrementality tanpa eksperimen", clue: "“Uji holdout internal Q3” — tidak ada file holdout di data room, dan “file tidak dilampirkan” adalah bendera merah. Yang benar-benar ada hanya perbandingan observasional terpapar-vs-tidak (selection bias: yang terpapar memang lebih berminat). Efek kausal search menurut generator hanya +0,73 poin persentase — bukan +18%.", danger: "Kata “incrementality” tanpa desain eksperimen adalah atribusi yang berganti baju. Di dunia nyata, klaim seperti ini dipakai untuk membenarkan budget channel yang sebenarnya hanya memanen." },
        { key: "periode-campur", rowIds: [15], title: "Pembilang dan penyebut dari periode berbeda", clue: "Pendapatan mencakup “sisa Agustus” sementara belanja hanya Q3. ROI = pendapatan(3,5 bulan) / belanja(3 bulan) — pembilang digemukkan ~17% oleh satu bulan ekstra. Perbandingan yang jujur menuntut periode yang sama di kedua sisi.", danger: "Ketidaksejajaran periode adalah manipulasi paling sopan: tidak ada angka yang “salah”, hanya dua angka benar dari dua dunia berbeda yang dibagi satu sama lain." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Memo rekomendasi untuk CMO",
    prose: [
      "Semua bukti di tangan. Tulis memo satu halaman untuk CMO — artefak portofoliomu. Memo yang baik tidak hanya bilang “jangan potong”, tapi menunjukkan ANGKA per model atribusi, apa yang dimanipulasi deck vendor, dan apa uji jujur yang harus dijalankan sebelum budget dipotong.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): vonis deck vendor vs hasil hitung ulangmu; rekomendasi budget display.",
        "Bukti kuantitatif: tabel ROI last-touch vs first-touch per channel; pendapatan posisi 40-20-40; efek kausal dari generator (display +9,21 pp vs search +0,73 pp); fraksi 0,5673.",
        "Temuan audit deck vendor: manipulasi apa yang kamu temukan, baris per baris, dan bagaimana tiap manipulasi mengubah vonis.",
        "Rekomendasi: apa yang harus terjadi pada budget (rujuk keputusanmu di Langkah 5) + desain uji incrementality yang jujur (geo holdout: wilayah, durasi, metrik).",
        "Batas & risiko sisa: data SINTETIS (efek kausal diketahui hanya karena ini simulasi); atribusi observasional tidak bisa menggantikan eksperimen; hasil holdout bisa berbeda.",
      ],
      rubric: [
        { criterion: "Kebenaran perhitungan atribusi", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "Last-touch, first-touch, posisi 40-20-40, dan ROI semua tepat (display 0,77 / 97,25 jt / 57,33 jt)"] },
        { criterion: "Deteksi manipulasi", weight: 25, levels: ["Tidak menyebut manipulasi", "Menyebut sebagian tanpa baris bukti", "Keempat manipulasi disebut dengan nomor baris + penjelasan efeknya pada vonis"] },
        { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa dasar kausal", "Ada rekomendasi, uji lanjutannya kabur", "Rekomendasi + desain uji incrementality konkret (wilayah, durasi, metrik sukses)"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim atribusi membuktikan kausalitas", "Menyebut sebagian batas", "Batas (SINTETIS, atribusi ≠ kausal, butuh eksperimen) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat manipulasi di deck vendor:",
      "1) **Search dihitung dua kali** (baris 2–3): Rp 52,00 jt tercatat dua kali persis. Total last-touch deck = Rp 207,75 jt vs data mentah Rp 155,75 jt. Channel yang diunggulkan terlihat dua kali lebih besar — dan tidak ada yang mengecek penjumlahan.",
      "2) **Belanja display digandakan** (baris 6, 12, 14): fee agensi dihitung 2× → belanja Rp 80 jt → ROI 0,38. Lembar finance: Rp 40 jt → ROI 0,77. Masih di bawah 1 — tapi “bakar uang”-nya jauh tidak sedramatis yang dijual ke CMO.",
      "3) **Klaim incrementality palsu** (baris 13): “uji holdout internal” tanpa file, tanpa desain — hanya perbandingan observasional yang dibungkus kata sakti. Efek kausal search yang sebenarnya: +0,73 poin persentase.",
      "4) **Periode campur** (baris 15): pendapatan 3,5 bulan dibagi belanja 3 bulan. Tidak ada angka yang salah — hanya dua kebenaran dari dua periode yang dibagi satu sama lain.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim vendor terhadap data mentah dan sumber pembanding (finance), atau memercayai PDF mengkilap. Dan ingat keputusan bercabangmu: bahkan angka JUJUR (ROI 0,77) pun menipu bila model atribusinya salah untuk pertanyaannya. Manipulasi deck hanya memperparah penyakit yang sudah ada: last-touch memang menghukum penanam dan memuja pemanen.",
      "Bahaya nyata terakhir: di dunia nyata tidak ada file efek_kausal.csv. Yang ada hanya analis yang berani bilang “atribusi ini tidak bisa menjawab pertanyaan kausal — kita butuh eksperimen” SEBELUM budget dipotong. Jadilah analis itu.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: model atribusi yang canggih = jawaban kausal",
      type: "risk",
      body: "Data-driven attribution (Markov, Shapley) tetap 100% observasional: ia membagi kredit dengan lebih pintar, tapi tidak menciptakan eksperimen. Ia menjawab “bagaimana kredit dibagi” — bukan “apa yang terjadi bila channel dimatikan”. Jangan tertukar: kecanggihan model ≠ kekuatan kausal.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Tiga model, tiga vonis: display Rp 30,75 jt (last-touch, ROI 0,77) → Rp 97,25 jt (first-touch) → Rp 57,33 jt (posisi 40-20-40); search bergerak sebaliknya (52,00 → 9,50 → 26,85 jt).",
      "Kebenaran kausal (diketahui karena data SINTETIS): display +9,21 pp > email +6,60 pp > social +4,33 pp > search +0,73 pp — last-touch menghukum penanam demand dan memuja pemanennya.",
      "Empat manipulasi deck vendor: pendapatan search ganda, belanja display ganda (fee 2×), klaim incrementality tanpa eksperimen, periode pembilang-penyebut tidak sejajar.",
      "Keputusan budget atas atribusi observasional selalu punya harga: potong (demand runtuh 2 kuartal kemudian), tahan+holdout (kebenaran lewat eksperimen), alih ke search (CPC naik, volume diam).",
      "Data: SINTETIS 100% (generator Python, seed 42), 4.000 journey, dibekukan 2026-10-15 — efek kausal didokumentasikan hanya karena ini simulasi; di dunia nyata ia harus dibuktikan lewat eksperimen.",
    ],
  },
];

(misiAtribusi.steps as V2Step[]).push(...LANJUTAN_ATRIBUSI);
