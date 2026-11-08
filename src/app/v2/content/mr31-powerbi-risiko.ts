import type { V2Lesson } from "../lib/types";

const FIG_UTIL = `<svg viewBox=\"0 0 560 360\" role=\"img\" aria-label=\"Utilisasi limit per desk.\">
<g font-family=\"var(--font-ui)\">
<text x=\"14\" y=\"24\" font-size=\"13\" fill=\"var(--chart-text)\" font-weight=\"bold\">Utilisasi limit per desk (eksposur ÷ limit)</text>
<line x1=\"60\" y1=\"280\" x2=\"520\" y2=\"280\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<line x1=\"60\" y1=\"80\" x2=\"520\" y2=\"80\" stroke=\"var(--c4)\" stroke-width=\"1.5\" stroke-dasharray=\"6,4\"/>
<text x=\"512\" y=\"72\" font-size=\"10\" fill=\"var(--c4)\" text-anchor=\"end\">Limit 100%</text>
<text x=\"22\" y=\"170\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" transform=\"rotate(-90 22 170)\">Utilisasi →</text>
<rect x=\"90\" y=\"86\" width=\"70\" height=\"194\" fill=\"var(--c1)\" opacity=\"0.85\"/>
<text x=\"125\" y=\"78\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">97,5%</text>
<text x=\"125\" y=\"298\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Rates</text>
<rect x=\"200\" y=\"60\" width=\"70\" height=\"220\" fill=\"var(--c4)\" opacity=\"0.9\"/>
<text x=\"235\" y=\"52\" font-size=\"10\" fill=\"var(--c4)\" text-anchor=\"middle\" font-weight=\"bold\">105,6% ⚠</text>
<text x=\"235\" y=\"298\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">FX</text>
<rect x=\"310\" y=\"132\" width=\"70\" height=\"148\" fill=\"var(--c2)\" opacity=\"0.85\"/>
<text x=\"345\" y=\"124\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">74,3%</text>
<text x=\"345\" y=\"298\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Equities</text>
<rect x=\"420\" y=\"92\" width=\"70\" height=\"188\" fill=\"var(--c1)\" opacity=\"0.85\"/>
<text x=\"455\" y=\"84\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">93,9%</text>
<text x=\"455\" y=\"298\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Credit</text>
<text x=\"14\" y=\"335\" font-size=\"10\" fill=\"var(--chart-text)\">Merah &amp; menembus garis = breach. Kuning-hijau di atas 95% = watchlist.</text>
</g>
</svg>`;

export const mr31: V2Lesson = {
  slug: "mr31-powerbi-risiko",
  track: "Market Risk",
  module: "Pelaporan & Tooling",
  title: "MR31 — Power BI untuk Pelaporan Risiko Pasar",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dashboard hijau semua, breach di mana-mana",
      prose: [
        "Senin pagi, dashboard Power BI risiko pasar bank 'Wira' tampil sempurna: semua desk hijau, utilisasi di bawah 90%. Head of Risk, Sinta, tersenyum — sampai ia membuka email dari meja FX: 'Kami breach limit sejak Kamis.' Dashboard bilang 88%. Sistem limit bilang 105,6%. Keduanya membaca 'data yang sama'.",
        "Akar masalahnya ditemukan dalam 20 menit: measure DAX utilisasi memakai SUM(eksposur) ÷ SUM(limit) — benar — tetapi tabel limit di-refresh tiap jam 6 pagi SEMENTARA tabel eksposur di-refresh tiap jam 9 malam. Dashboard Senin pagi membandingkan eksposur Jumat malam dengan limit Senin pagi (yang baru dinaikkan). Angka 'hijau' itu adalah pernikahan dua tanggal yang berbeda.",
        "Twist-nya: Power BI tidak pernah berbohong — ia hanya menjawab persis apa yang ditanya, dari data persis yang diberi. Laporan risiko yang salah hampir selalu soal tiga hal: model data (relasi tabel), measure (rumus DAX), dan refresh (kapan data ditarik). Lesson ini mengajarkan ketiganya dari sudut risiko pasar: star schema untuk limit & eksposur, measure utilisasi dan breach, row-level security, dan jadwal refresh yang tidak menipu.",
      ],
      tasks: [],
    },
    {
      id: "model",
      eyebrow: "Langkah 2 · Konsep",
      title: "Model data: star schema untuk limit",
      prose: [
        "Model data — Si Peta Kota: satu tabel fakta `fact_exposure` (tiap baris = eksposur satu desk pada satu waktu) dikelilingi tabel dimensi: `dim_desk` (nama desk, head, region), `dim_limit` (limit per desk per periode), `dim_tanggal`. Relasi satu-ke-banyak dari dimensi ke fakta. Kenapa tidak satu tabel raksasa saja? Karena limit berubah per kuartal sementara eksposur berubah per menit — mencampur keduanya dalam satu tabel membuat setiap baris mengulang limit ribuan kali, dan satu update limit yang terlewat meracuni seluruh histori.",
        "Intuisi: tabel fakta adalah 'kejadian' (apa yang terjadi), tabel dimensi adalah 'konteks' (siapa/di mana/batasnya berapa). Laporan risiko yang bisa menjawab 'utilisasi desk FX bulan lalu vs limit yang berlaku SAAT ITU' hanya mungkin bila limit disimpan sebagai dimensi yang berversi waktu (slowly changing dimension) — bukan angka yang ditimpa tiap kuartal.",
        "Kapan memakai: setiap dashboard risiko yang membandingkan angka vs batas. Tanpa star schema, measure utilisasi akan salah pada minggu pertama limit berubah.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menyimpan limit sebagai kolom di tabel eksposur ('praktis, satu tabel saja'). Saat limit direvisi, seluruh histori ikut berubah — dan laporan bulan lalu yang sudah dikirim ke regulator tiba-tiba menampilkan angka berbeda saat dibuka ulang. Limit adalah dimensi berversi, bukan atribut baris.",
      },
      reference: "Fakta = kejadian; dimensi = konteks; limit = dimensi berversi waktu.",
    },
    {
      id: "dax",
      eyebrow: "Langkah 3 · Konsep",
      title: "Measure DAX: utilisasi, breach, dan RLS",
      prose: [
        "Measure — Si Kalkulator Jujur: rumus yang dievaluasi dalam konteks filter visual. Tiga measure wajib dashboard risiko: `Utilisasi = SUM(fact_exposure[eksposur]) / SUM(dim_limit[limit])`; `Status = IF([Utilisasi] > 1, \"BREACH\", IF([Utilisasi] >= 0.95, \"WATCH\", \"OK\"))`; `Headcount breach = COUNTROWS(FILTER(dim_desk, [Utilisasi] > 1))`. Kuncinya: measure dihitung DARI tabel yang benar — eksposur dari fakta, limit dari dimensi — bukan dari kolom yang 'kebetulan ada'.",
        "Row-Level Security (RLS) — Si Penjaga Pintu: aturan DAX per peran, misalnya head desk FX hanya melihat baris desk FX: `[desk] = USERPRINCIPALNAME()` dipetakan via tabel peran. Tanpa RLS, satu dashboard untuk semua desk berarti setiap head desk bisa mengintip posisi desk lain — pelanggaran segregasi yang serius di trading floor.",
        "Refresh — Si Kurir Tepat Waktu: gateway menjadwalkan refresh; aturan emasnya — SEMUA tabel dalam satu dataset di-refresh dalam SATU jendela yang sama. Cerita Sinta di atas adalah pelanggaran aturan ini: eksposur dan limit dari 'hari yang berbeda' disandingkan seolah sejaman.",
      ],
      formula: String.raw`\text{Utilisasi} = \frac{\sum \text{Eksposur}}{\sum \text{Limit}} \qquad \text{Breach} \iff \text{Utilisasi} > 100\%`,
      formulaNote: "Σ Eksposur = total eksposur desk pada periode filter; Σ Limit = limit yang berlaku pada periode yang SAMA (dari dimensi berversi waktu); Breach terjadi tepat saat utilisasi melampaui 100% — bukan 99%, bukan 'hampir'.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menulis measure utilisasi sebagai rata-rata dari rasio per baris (AVERAGE(eksposur/limit)) alih-alih rasio dari total (SUM/SUM). Keduanya sama hanya bila semua limit sama — yang tidak pernah terjadi. AVERAGE-of-ratio vs RATIO-of-sum bisa berbeda 10+ poin persen, dan yang benar untuk limit adalah ratio-of-sum.",
      },
      reference: "Measure = SUM/SUM (bukan rata-rata rasio); RLS = segregasi; refresh = satu jendela.",
    },
    {
      id: "figure-util",
      eyebrow: "Langkah 4 · Visual",
      title: "Bar utilisasi: membaca breach sekilas",
      prose: [
        "Cara membaca: tinggi batang = utilisasi (eksposur ÷ limit); garis merah putus-putus = 100% (limit); batang merah menembus garis = breach. Interpretasi: FX 105,6% breach dan wajib eskalasi; Rates 97,5% masuk watchlist (≥95%) — dekat breach, pantau harian; Equities 74,3% aman; Credit 93,9% di bawah watchlist tetapi trennya perlu dilihat (satu visual statis tidak menunjukkan arah).",
        "Perhatikan: chart ini benar HANYA bila eksposur dan limit dari periode yang sama — persis pelajaran cerita pembuka. Visual yang bagus di atas data yang tidak sinkron adalah kebohongan yang rapi.",
      ],
      figure: {
        svg: FIG_UTIL,
        alt: "Bar utilisasi limit: Rates 97,5%, FX 105,6% breach, Equities 74,3%, Credit 93,9%.",
        caption: "Cara membaca: tinggi batang = utilisasi; garis merah = 100%. Interpretasi: FX breach (eskalasi); Rates watchlist; Equities aman. Chart benar hanya bila eksposur & limit sejaman.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mewarnai breach dengan merah MUDA yang nyaris tak terlihat 'agar dashboard tetap cantik'. Breach harus MENYAKITKAN mata: merah pekat, ikon ⚠, dan — yang terpenting — memicu alert otomatis, bukan menunggu seseorang membuka dashboard.",
      },
      reference: "Breach = merah pekat + alert otomatis, bukan sekadar warna.",
    },
    {
      id: "lab-util",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: replika measure utilisasi dengan sqlite3",
      prose: [
        "Replikasikan logika measure DAX `SUM(eksposur)/SUM(limit)` memakai sqlite3: buat tabel `eksposur(desk, eks, lim)`, isi 4 desk (Rates 780/800, FX 950/900, Equities 520/700, Credit 610/650 — juta Rp), hitung utilisasi per desk, tentukan `breaches` (util > 1,0) dan `watch` (0,95 ≤ util ≤ 1,0), lalu cetak baris `BREACH:` untuk desk yang breach.",
        "Hasil yang benar: FX 1,0556 → breach; Rates 0,975 → watchlist. Eksplorasi: ubah limit FX menjadi 1000 — apakah breach hilang? Turunkan eksposur Rates menjadi 700 — apakah ia keluar dari watchlist? Perhatikan: measure yang sama, input berbeda, keputusan berbeda — itulah gunanya measure, bukan angka mati.",
      ],
      tasks: [
        { id: "t1", text: "Buat tabel & isi data, hitung `util` (dict desk → utilisasi, bulatkan 4 desimal)" },
        { id: "t2", text: "Tentukan `breaches` dan `watch`; cetak baris diawali `BREACH:`" },
      ],
      expected: "util={'Rates': 0.975, 'FX': 1.0556, 'Equities': 0.7429, 'Credit': 0.9385}\nbreaches=['FX']\nwatch=['Rates']\nBREACH: desk FX utilisasi 105.56% — di atas limit, eskalasi ke head of risk",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Perhatikan Rates: 0,975 — di bawah 100% tetapi di atas 95%. Sistem limit yang baik punya DUA ambang: watch (95%) dan breach (100%). Tanpa watchlist, kejutan breach selalu datang 'tiba-tiba' — padahal datanya sudah berteriak seminggu.",
      },
      hints: [
        "Gunakan con.executemany untuk insert banyak baris sekaligus.",
        "util = {desk: round(eks/lim, 4) untuk tiap baris hasil SELECT}.",
        "breaches = [desk untuk desk, u di util jika u > 1.0].",
      ],
      code: {
        starter: "import sqlite3\n\n# Data eksposur & limit per desk (juta Rp) — JANGAN UBAH.\nDATA = [\n    (\"Rates\", 780.0, 800.0),\n    (\"FX\", 950.0, 900.0),\n    (\"Equities\", 520.0, 700.0),\n    (\"Credit\", 610.0, 650.0),\n]\n\n# TULIS KODEMU: buat tabel, hitung utilisasi, tentukan breach & watchlist\nutil = \nbreaches = \nwatch = \nprint(f\"util={util}\")\nprint(f\"breaches={breaches}\")\nprint(f\"watch={watch}\")\nprint(f\"BREACH: desk {breaches[0]} utilisasi {round(util[breaches[0]]*100, 2)}% — di atas limit, eskalasi ke head of risk\")\n",
        lockLines: 10,
        solution: "import sqlite3\n\n# Data eksposur & limit per desk (juta Rp) — JANGAN UBAH.\nDATA = [\n    (\"Rates\", 780.0, 800.0),\n    (\"FX\", 950.0, 900.0),\n    (\"Equities\", 520.0, 700.0),\n    (\"Credit\", 610.0, 650.0),\n]\n\n# TULIS KODEMU: buat tabel, hitung utilisasi, tentukan breach & watchlist\ncon = sqlite3.connect(\":memory:\")\ncon.execute(\"CREATE TABLE eksposur (desk TEXT, eks REAL, lim REAL)\")\ncon.executemany(\"INSERT INTO eksposur VALUES (?,?,?)\", DATA)\nutil = {d: round(e / l, 4) for d, e, l in con.execute(\"SELECT desk, eks, lim FROM eksposur\")}\nbreaches = [d for d, u in util.items() if u > 1.0]\nwatch = [d for d, u in util.items() if 0.95 <= u <= 1.0]\nprint(f\"util={util}\")\nprint(f\"breaches={breaches}\")\nprint(f\"watch={watch}\")\nprint(f\"BREACH: desk {breaches[0]} utilisasi {round(util[breaches[0]]*100, 2)}% — di atas limit, eskalasi ke head of risk\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "util", value: { Rates: 0.975, FX: 1.0556, Equities: 0.7429, Credit: 0.9385 }, label: "utilisasi per desk benar", msg: "950/900 = 1,0556; 780/800 = 0,975; dst. — rasio dari total (SUM/SUM).", tol: 0.0001 },
          { kind: "equal", task: "t2", name: "breaches", value: ["FX"], label: "breaches = ['FX']", msg: "Hanya FX yang utilisasinya > 1,0." },
          { kind: "equal", task: "t2", name: "watch", value: ["Rates"], label: "watch = ['Rates']", msg: "Rates 0,975 berada di rentang [0,95; 1,0]." },
          { kind: "stdout_matches", task: "t2", label: "Baris BREACH tercetak", msg: "Baris laporan harus diawali persis 'BREACH:'.", pattern: "BREACH:" },
          { kind: "uses", task: "t1", label: "Memakai sqlite3", msg: "Tabel dibuat dengan sqlite3 seperti pipeline data sungguhan.", token: "sqlite3" },
        ],
      },
      reference: "Measure = SUM/SUM dari tabel yang sejaman; dua ambang: watch 95%, breach 100%.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Kapan Power BI cukup, kapan tidak",
      prose: [
        "Skenario satu — laporan utilisasi limit harian untuk manajemen: POWER BI CUKUP. Refresh terjadwal tiap pagi, star schema sederhana, RLS per desk. Ini kasus ideal dashboard: angka agregat, toleransi keterlambatan hitungan jam.",
        "Skenario dua — monitoring limit intraday untuk desk trading aktif: POWER BI TIDAK CUKUP. Butuh sistem limit real-time (Murex/Calypso atau engine sendiri) dengan pre-trade check. Dashboard yang refresh tiap jam untuk limit intraday = mengemudi sambil melihat spion 60 menit lalu.",
        "Skenario tiga — laporan regulator (OJK/BI) dari data yang sama: POWER BI BISA, DENGAN SYARAT. Butuh lineage (jejak asal data), versi dataset yang terkunci per periode laporan, dan rekonsiliasi vs sumber (GL). Dashboard ad-hoc tanpa versi = tidak bisa diaudit.",
        "Skenario empat — head desk butuh drill-down ke transaksi penyebab breach: POWER BI KUAT. Inilah keunggulan drill-through: dari batang FX 105,6% klik ke daftar transaksi penyumbang terbesar. Syaratnya: model data menyimpan granularitas transaksi, bukan hanya agregat desk.",
        "Aturan praktis 10 detik: (1) butuh < 1 jam? ya → bukan Power BI; (2) untuk regulator? ya → kunci versi + lineage; (3) drill-down? ya → simpan granularitas transaksi; (4) semua tabel refresh satu jendela — tanpa kecuali.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menganggap 'sudah ada dashboard' = 'sudah ada kontrol limit'. Dashboard adalah CERMIN — ia tidak menghentikan apa pun. Kontrol limit yang sesungguhnya adalah pre-trade check di sistem trading; dashboard hanya memastikan cerminnya tidak retak.",
      },
      reference: "Dashboard = cermin, bukan rem. Rem-nya di sistem trading.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Limit naik, dashboard tetap merah",
      prose: [
        "Komite risiko menyetujui kenaikan limit desk Credit dari 650 menjadi 750 (juta Rp), berlaku Senin. Senin pagi dashboard masih menunjukkan utilisasi 93,9% (610/650) dan status WATCH — padahal seharusnya 81,3% (610/750). Pertanyaan: (a) apa yang salah? (b) bagaimana mencegahnya? (c) apa risiko bila dibiarkan seminggu?",
        "Pembahasan: (a) Tabel dim_limit belum di-refresh / tidak berversi waktu — measure membaca limit lama 650. Klasik 'limit sebagai angka mati'. (b) Simpan limit sebagai SCD (berlaku-sejak/berlaku-sampai), refresh satu jendela dengan fakta, dan tampilkan 'limit berlaku per tanggal' di header dashboard agar usang-nya terlihat. (c) Desk Credit beroperasi dengan limit bayangan yang lebih ketat — bisa menolak transaksi yang sebenarnya boleh (opportunity cost), atau lebih buruk: trader belajar mengabaikan dashboard karena 'angkanya sering salah'.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dashboard yang salah dua kali akan diabaikan selamanya — bahkan setelah diperbaiki. Kepercayaan pada laporan risiko adalah aset yang rapuh: sekali trader memutuskan 'angka dashboard tidak bisa dipakai', mereka kembali menebak, dan seluruh investasi kontrol menjadi pajangan.",
      },
      reference: "Limit usang = keputusan usang. Tampilkan tanggal berlaku limit di dashboard.",
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
        "Model data risiko = star schema: fact_exposure + dim_desk + dim_limit (berversi waktu) + dim_tanggal.",
        "Measure utilisasi = SUM(eksposur)/SUM(limit) — rasio dari total, bukan rata-rata rasio; dari tabel yang sejaman.",
        "Dua ambang: WATCH 95%, BREACH 100%. Breach = merah pekat + alert otomatis.",
        "RLS memisahkan pandangan per desk; refresh semua tabel dalam satu jendela waktu.",
        "Power BI = cermin (laporan), bukan rem (pre-trade check). Untuk intraday dan regulator ada syarat tambahan.",
      ],
      quiz: [
        {
          q: "Dashboard Senin pagi memakai eksposur Jumat malam dan limit Senin pagi. Masalahnya?",
          options: [
            { text: "Refresh tidak sejaman — angka 'hijau' membandingkan dua tanggal berbeda", why: "Benar: persis kasus Sinta; semua tabel harus refresh dalam satu jendela.", correct: true },
            { text: "Tidak masalah selama measure-nya benar", why: "Measure benar di atas input yang salah tetap menghasilkan kebohongan." },
            { text: "Power BI tidak cocok untuk data akhir pekan", why: "Bukan soal akhir pekan — soal sinkronisasi refresh." },
            { text: "Limit seharusnya tidak pernah berubah", why: "Limit berubah tiap kuartal; yang harus berubah adalah cara menyimpannya." },
          ],
        },
        {
          q: "Dua desk: A eksposur 900/limit 1000, B eksposur 100/limit 200. Utilisasi gabungan yang benar?",
          options: [
            { text: "(900+100)/(1000+200) = 83,3% (rasio dari total)", why: "Benar: SUM/SUM — cara measure limit yang benar.", correct: true },
            { text: "(90%+50%)/2 = 70% (rata-rata rasio)", why: "Salah: average-of-ratio meremehkan kontribusi desk besar." },
            { text: "90% — ambil yang terbesar saja", why: "Utilisasi gabungan bukan max; itu metrik lain." },
            { text: "Tidak bisa digabung — desk tidak sebanding", why: "Bisa: limit bersifat aditif dalam agregat yang sama." },
          ],
        },
        {
          q: "Head desk FX tidak boleh melihat posisi desk Rates. Mekanisme Power BI-nya?",
          options: [
            { text: "Row-Level Security (RLS) — filter baris per peran", why: "Benar: RLS membatasi baris yang terlihat tiap pengguna.", correct: true },
            { text: "Menyembunyikan tab dengan password", why: "Keamanan via obscurity — data tetap bisa diakses via model." },
            { text: "Membuat file PBIX terpisah per desk", why: "Bisa tapi tidak scalable dan rawan versi ganda." },
            { text: "Menghapus kolom desk dari tabel", why: "Menghancurkan kegunaan laporan untuk semua orang." },
          ],
        },
        {
          q: "Desk butuh pantauan limit setiap 15 menit saat pasar volatile. Keputusan tepat?",
          options: [
            { text: "Power BI tidak cukup — butuh sistem limit real-time dengan pre-trade check", why: "Benar: dashboard refresh jam-an tidak bisa menjadi rem intraday.", correct: true },
            { text: "Percepat refresh Power BI menjadi tiap 5 menit", why: "Refresh cepat tidak mengubah sifatnya: tetap cermin, bukan rem." },
            { text: "Naikkan limit agar tidak breach", why: "Mengakali alarm; risiko riil tidak berubah." },
            { text: "Matikan alert agar tidak berisik", why: "Bunuh messenger-nya — masalahnya tetap ada." },
          ],
        },
        {
          q: "Lab lesson ini: bila limit FX diubah dari 900 menjadi 1000 (eksposur tetap 950), apa yang terjadi?",
          options: [
            { text: "Utilisasi FX menjadi 95% — keluar dari breach, masuk watchlist", why: "Benar: 950/1000 = 0,95 — tepat di ambang watch.", correct: true },
            { text: "Tetap breach — utilisasi tidak tergantung limit", why: "Utilisasi = eksposur/limit; limit adalah penyebutnya." },
            { text: "Menjadi 0% — limit baru me-reset perhitungan", why: "Tidak ada reset; hanya penyebut yang berubah." },
            { text: "Desk FX hilang dari laporan", why: "Desk tetap ada; hanya statusnya berubah." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghafal 'SUM/SUM' tanpa memahami kenapa. Uji pemahamanmu: bila seorang kolega mengusulkan AVERAGE(eksposur/limit), bisakah kamu menjelaskan dengan angka kenapa itu salah? Bila belum bisa, baca ulang langkah 3.",
      },
      hints: [
        "Ingat tiga serangkai laporan risiko yang benar: model data (star schema), measure (SUM/SUM), refresh (satu jendela).",
        "Ingat angka lab: FX 105,6% breach; Rates 97,5% watchlist — dua ambang, bukan satu.",
      ],
      reference: "Cermin yang jujur: star schema + SUM/SUM + refresh sejaman + RLS.",
      next: { label: "MR32 — Market Data Management: Kurva, Vol Surface & Data Busuk", href: "/v2/learn/mr32-market-data-management" },
    },
  ],
};
