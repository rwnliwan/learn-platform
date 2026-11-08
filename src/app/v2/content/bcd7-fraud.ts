import type { V2Lesson } from "../lib/types";

// Drain likuiditas: stabil lalu anjlok 97% dalam 1 blok.
const DRAIN_SVG = `<svg viewBox="0 0 480 230" role="img" aria-label="Grafik likuiditas: stabil di 100 ETH selama 42 blok lalu anjlok ke 3 ETH dalam satu blok.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="50" y1="30" x2="450" y2="30"/><line x1="50" y1="80" x2="450" y2="80"/><line x1="50" y1="130" x2="450" y2="130"/><line x1="50" y1="180" x2="450" y2="180"/></g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end"><text x="44" y="34">100</text><text x="44" y="84">75</text><text x="44" y="134">50</text><text x="44" y="184">0 ETH</text></g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle"><text x="90" y="200">blok 1000</text><text x="250" y="200">blok 1021</text><text x="400" y="200">blok 1042</text></g>
<polyline points="90,34 250,34 392,34 400,172 440,172" fill="none" stroke="var(--c4)" stroke-width="3"/>
<circle cx="400" cy="172" r="6" fill="var(--c4)"/>
<text x="330" y="150" font-size="12" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">−97% dalam 1 blok</text>
<text x="170" y="60" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">likuiditas stabil 42 blok…</text>
<text x="240" y="216" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">likuiditas pool (ETH)</text>
</svg>`;

const BCD7_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Aliran dana MOONX: Rp96 miliar masuk, Rp3,5 miliar keluar, Rp92,5 miliar terkunci."><text x="142" y="62.33333333333333" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Masuk (8.200 holder)</text><rect x="150" y="49.33333333333333" width="301.4" height="18" rx="3" fill="var(--c2)"/><text x="457.4" y="62.33333333333333" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp96 M</text><text x="142" y="118.99999999999999" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Keluar (300 trader)</text><rect x="150" y="105.99999999999999" width="11.0" height="18" rx="3" fill="var(--c1)"/><text x="167.0" y="118.99999999999999" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp3,5 M</text><text x="142" y="175.66666666666666" text-anchor="end" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Terkunci (7.900)</text><rect x="150" y="162.66666666666666" width="290.4" height="18" rx="3" fill="var(--c4)"/><text x="446.4" y="175.66666666666666" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp92,5 M</text></svg>`;

export const bcd7: V2Lesson = {
  slug: "bcd7-fraud",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD7 — Deteksi Fraud On-Chain",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "30× dalam 3 hari, −99% dalam 1 blok",
      prose: [
        "Token MOONX naik 30× dalam 3 hari. Grup Telegram 40.000 anggota. Influencer mem-posting 'next 100×'. Di blok 1.042.117, likuiditas pool 100 ETH. Di blok 1.042.118 — SATU blok kemudian — tersisa 3 ETH. Developer menarik 97% likuiditas, menjual timbunannya, dan menghilang. 8.200 holder tersisa memegang token yang tidak bisa dijual (tidak ada likuiditas = tidak ada pembeli). Kerugian: Rp96 miliar.",
        "Yang menghantui: TANDA-TANDANYA ADA SEMUA — dan tercatat publik. Deployer memegang 70% supply. Likuiditas tidak dikunci (tidak ada timelock). 90% 'komunitas' Telegram adalah bot (40.000 anggota, 200 pesan/hari). Contract punya fungsi mint tersembunyi. Semua terlihat di chain SEBELUM blok 1.042.118.",
        "Twist-nya: rug pull bukan perampokan yang tersembunyi — ia perampokan yang DIUMUMKAN di muka lewat data, tetapi tidak ada yang membaca. Lesson ini: taksonomi fraud on-chain + pola peringatan dini yang bisa dihitung. Tujuan: (1) membedakan scam, rug pull, dan mixer abuse; (2) menghitung indikator drain; (3) menyusun skor peringatan dini. Peta: cerita → taksonomi → pola dini → lab drain → mixer → peta keputusan → mini-case → checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan tiga keluarga fraud on-chain (rug pull, honeypot, phishing) dengan contoh MOONX; (2) menghitung drain likuiditas dan mengenali ambangnya; (3) membaca empat sinyal peringatan dini sebelum blok kehancuran; (4) melakukan triase: flag → verifikasi → tindak.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Smart contract sudah diaudit, berarti aman dari rug pull.\" Audit memeriksa BUG, bukan NIAT. Fungsi 'removeLiquidity' yang dipakai developer untuk rug pull adalah fungsi NORMAL yang lolos audit — masalahnya bukan kodenya, melainkan SIAPA memegang kunci dan APAKAH likuiditas dikunci timelock. Audit menjawab 'apakah kodenya benar'; analis menjawab 'apakah strukturnya jujur'.",
      },
      reference: "Audit = cek bug. Analis = cek niat via struktur (kunci, timelock, distribusi).",
    },
    {
      id: "taksonomi",
      eyebrow: "Langkah 2 · Taksonomi",
      title: "Tiga keluarga fraud on-chain",
      prose: [
        "Satu — Rug pull: developer membangun → memompa → menarik likuiditas / menjual timbunan → hilang. Ciri on-chain: konsentrasi deployer tinggi, likuiditas tak terkunci, drain tiba-tiba. Kerugian datang dari DALAM proyek.",
        "Dua — Scam token / phishing: token tiruan ('USDT' palsu), honeypot (bisa beli, tidak bisa jual — fungsi transfer dibatasi), dan drainer (situs 'mint gratis' yang mencuri approval). Ciri on-chain: contract baru meniru nama terkenal, pola distribusi airdrop massal ke ribuan address acak, fungsi transfer asimetris.",
        "Tiga — Mixer abuse / layering: dana hasil kejahatan dipecah, dicampur, disebar untuk mengaburkan jejak sebelum masuk exchange. Ciri on-chain: banyak hop bernilai sama, deposit ke mixer yang diketahui, timing rapat. Ini jembatan ke AML (bcd11).",
        "Ketiganya berbeda dalam PELAKU (orang dalam vs orang luar vs pencuci), tetapi sama dalam JEJAK: anomali konsentrasi, kecepatan, dan struktur yang bisa dihitung.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: fraud on-chain = fraud biasa + jejak permanen",
        body: "Skema Ponzi, pump-and-dump, penggelapan — semuanya pola lama. Yang baru hanyalah JEJAKNYA: permanen, publik, dan terstruktur. Ini kabar baik ganda: (1) pola klasik bisa dideteksi dengan teknik klasik (konsentrasi, anomali waktu); (2) bukti tidak bisa dimusnahkan — pelaku tidak bisa membakar buku kas. Analis fraud tradisional yang belajar membaca chain mendapat 'kacamata sinar-X' untuk pola yang sudah ia kenal.",
      },
      reference: "Rug pull (orang dalam), scam token (orang luar), mixer abuse (pencucian). Pola lama, jejak baru.",
    },
    {
      id: "pola-dini",
      eyebrow: "Langkah 3 · Peringatan dini",
      title: "Empat sinyal sebelum blok kehancuran",
      prose: [
        "Sinyal 1 — Konsentrasi deployer: > 50% supply di cluster deployer (bcd5). Ini 'peluru' yang siap ditembakkan.",
        "Sinyal 2 — Likuiditas tak terkunci: tidak ada timelock / burn LP token. Cek: apakah LP token dikirim ke dead address atau dikunci contract? Jika masih di dompet developer = ia bisa menarik kapan saja.",
        "Sinyal 3 — Fungsi berbahaya: mint tak terbatas, blacklist transfer, pajak jual 99% (honeypot). Baca contract-nya — 15 menit membaca mengalahkan Rp96 miliar penyesalan.",
        "Sinyal 4 — Anomali sosial-ekonomi: holder tumbuh 8.000 dalam 3 hari tetapi transaksi organik stagnan; Telegram 40.000 anggota dengan 200 pesan/hari (bot). On-chain + off-chain harus KONSISTEN — ketidakkonsistenan = sinyal.",
        "Cara membaca diagram: sumbu X = nomor blok, Y = likuiditas pool. Datar di 100 ETH selama 42 blok (fase pompa — terlihat sehat), lalu TEBING: −97% dalam 1 blok. Interpretasi: drain legit (penarikan bertahap, diumumkan) vs rug (tebing vertikal, tanpa pengumuman). Bentuk kurvanya adalah beritanya.",
      ],
      figure: {
        svg: DRAIN_SVG,
        alt: "Grafik likuiditas: stabil di 100 ETH selama 42 blok lalu anjlok ke 3 ETH dalam satu blok.",
        caption: "Fase pompa (datar 42 blok) lalu tebing −97% dalam 1 blok = sidik jari rug pull klasik.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: kecepatan adalah beritanya",
        body: "Penarikan likuiditas 97% dalam 3 BULAN dengan pengumuman = manajemen treasury yang sah. Penarikan yang SAMA dalam 1 BLOK tanpa pengumuman = rug pull. Besaran yang sama, makna berlawanan — pembedanya KECEPATAN dan KOMUNIKASI. Karena itu metrik fraud selalu punya dimensi waktu: 'berapa persen, dalam berapa blok, dengan pengumuman apa'. Analis yang mengabaikan dimensi waktu buta terhadap separuh kasus.",
      },
      reference: "4 sinyal: konsentrasi deployer, likuiditas tak terkunci, fungsi berbahaya, anomali sosial.",
    },
    {
      id: "lab-drain",
      eyebrow: "Langkah 4 · Lab",
      title: "Menghitung drain",
      prose: [
        "Data sintetis peristiwa token MOONX: likuiditas ditambahkan 100 ETH di blok 1000, ditarik 97 ETH di blok 1042 oleh developer.",
        "Tugasmu: hitung (1) `drain_pct` = % likuiditas yang ditarik; (2) `span` = selisih blok; (3) `rug_flag` = True jika drain > 90% DAN span ≤ 100 blok.",
      ],
      formula: String.raw`\text{drain} = \frac{L_{tarik}}{L_{awal}} \qquad \text{rug} \iff \text{drain} > 0{,}9 \land \Delta blok \le 100`,
      formulaNote: "L_awal = likuiditas saat ditambahkan; L_tarik = yang ditarik developer. Ambang 90%/100 blok adalah heuristik triase — kalibrasi per ekosistem.",
      tasks: [
        { id: "t1", text: "Hitung `drain_pct` (persen, bilangan bulat)" },
        { id: "t2", text: "Hitung `span` (selisih blok)" },
        { id: "t3", text: "Tentukan `rug_flag` (bool)" },
        { id: "t4", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "drain_pct=97%  span=42  rug_flag=True",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Rug flag True berarti pasti rug pull.\" TIDAK — ini skor TRIAGE, bukan vonis. Migrasi likuiditas resmi (pindah ke pool baru) bisa memicu pola yang sama. Prosedur benar: flag → cek pengumuman resmi + tujuan penarikan (masuk timelock baru? atau dompet pribadi?) → baru simpulkan. Otomatisasi tanpa verifikasi manusia = fitnah otomatis.",
      },
      hints: [
        "drain_pct = liq_removed / liq_added * 100.",
        "span = blok_tarik - blok_tambah.",
        "rug_flag = (drain_pct > 90) and (span <= 100).",
      ],
      code: {
        starter: `# Peristiwa likuiditas MOONX (sintetis)\nliq_added, blok_add = 100.0, 1000\nliq_removed, blok_rm = 97.0, 1042  # ditarik developer\n\n# TULIS KODEMU\ndrain_pct = \nspan = \nrug_flag = \n\nprint(f"drain_pct={drain_pct:.0f}%  span={span}  rug_flag={rug_flag}")`,
        lockLines: 2,
        solution: `# Peristiwa likuiditas MOONX (sintetis)\nliq_added, blok_add = 100.0, 1000\nliq_removed, blok_rm = 97.0, 1042  # ditarik developer\n\n# TULIS KODEMU\ndrain_pct = liq_removed / liq_added * 100\nspan = blok_rm - blok_add\nrug_flag = (drain_pct > 90) and (span <= 100)\n\nprint(f"drain_pct={drain_pct:.0f}%  span={span}  rug_flag={rug_flag}")`,
        checks: [
          { kind: "equal", task: "t1", name: "drain_pct", value: 97.0, tol: 1e-9, label: "`drain_pct` = 97", msg: "97/100 × 100." },
          { kind: "equal", task: "t2", name: "span", value: 42, tol: 0, label: "`span` = 42", msg: "1042 − 1000." },
          { kind: "equal", task: "t3", name: "rug_flag", value: true, tol: 0, label: "`rug_flag` = True", msg: "97 > 90 dan 42 ≤ 100 → flag triage." },
          { kind: "stdout_matches", task: "t4", pattern: "drain_pct=97%\\s+span=42\\s+rug_flag=True", label: "Output sesuai format", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "drain = tarik/awal. Flag = triage, bukan vonis — verifikasi pengumuman dulu.",
    },
    {
      id: "mixer",
      eyebrow: "Langkah 5 · Mixer",
      title: "Mengaburkan jejak — dan cara membacanya",
      prose: [
        "Mixer (contoh: Tornado Cash) memutus tautan on-chain antara deposit dan withdraw: banyak orang deposit ke pool yang sama, lalu withdraw ke address baru. Secara kriptografi, tautannya putus. Secara perilaku, tidak sepenuhnya.",
        "Tiga jejak perilaku yang tersisa: (1) nominal pas — deposit 10 ETH, withdraw 10 ETH (minus fee) beberapa blok kemudian; (2) timing — withdraw segera setelah 'cukup' tercampur; (3) graf — address yang withdraw lalu berinteraksi dengan deposit yang diketahui pelaku. Heuristik 'deposit-withdraw berpasangan' menangkap pola ceroboh; pelaku canggih memecah nominal dan menunda — tetapi menunda = biaya peluang, memecah = fee lebih banyak. Privasi sempurna itu mahal.",
        "Posisi analis: penggunaan mixer BUKAN bukti kejahatan (ada alasan privasi sah). Ia adalah SINYAL RISIKO yang menaikkan skor (bcd11), bukan vonis. Di beberapa yurisdiksi, interaksi dengan mixer yang disanksi = pelanggaran — analis AML wajib tahu daftar sanksinya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Exchange yang menerima deposit langsung dari mixer yang disanksi berisiko melanggar sanksi — dendanya bisa miliaran dolar (kasus nyata: denda OFAC untuk layanan kripto). Karena itu screening 'apakah dana ini ≤ 3 hop dari mixer yang disanksi' adalah kontrol standar. Batas hop-nya (2? 3? 5?) adalah keputusan kebijakan, bukan kebenaran matematis — dokumentasikan alasannya.",
      },
      reference: "Mixer = sinyal risiko, bukan vonis. Screening sanksi = kontrol standar dengan batas hop yang didokumentasikan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Triase fraud: flag → verifikasi → tindak",
      prose: [
        "Skenario 1 — Token baru, deployer > 50%, likuiditas tak terkunci → JANGAN sentuh / beri peringatan. Dua sinyal struktural = risiko ekstrem.",
        "Skenario 2 — Drain > 90% dalam ≤ 100 blok TERDETEKSI → flag KRITIS: cek pengumuman resmi dalam 1 jam. Ada pengumuman migrasi + tujuan ke timelock = kemungkinan sah. Sunyi = rug pull berjalan.",
        "Skenario 3 — Deposit masuk dari mixer yang disanksi (≤ 3 hop) → tahan + laporkan ke compliance. Jangan proses sampai ada keputusan tertulis.",
        "Skenario 4 — Honeypot dicurigai (bisa beli, tak bisa jual) → uji dengan transaksi kecil DARI address uji (bukan dana nasabah!). Jika gagal jual = konfirmasi; laporkan contract-nya.",
        "Aturan praktis 10 detik: (1) skor dulu (konsentrasi + drain + fungsi + sosial); (2) verifikasi manusia sebelum tindak; (3) semua keputusan tercatat (siapa, kapan, bukti apa). Tanpa catatan = tidak bisa dipertahankan di depan regulator.",
      ],
      tasks: [],
      reference: "Skor → verifikasi manusia → tindak tercatat. Otomatisasi penuh = fitnah otomatis.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "MOONX: 8.200 holder, Rp96 miliar, 1 blok",
      prose: [
        "Rekonstruksi kasus: deployer cluster 70% supply (sinyal 1 ✓). LP token dipegang developer, tanpa timelock (sinyal 2 ✓). Fungsi mint tersembunyi ditemukan pasca-kejadian (sinyal 3 ✓ — luput karena tak ada yang membaca contract). Telegram 40.000 anggota/200 pesan per hari (sinyal 4 ✓). Skor pra-kejadian: 4/4 — kasus ini SEHARUSNYA tertangkap sebelum blok 1.042.118.",
        "Timeline dana: blok 1.042.118 tarik 97 ETH → 40 ETH ke mixer (2 hop) → 30 ETH ke exchange tanpa KYC ketat → 27 ETH parkir. Pelajaran investigasi: 40 ETH yang ke mixer MASIH bisa dilacak perilakunya (nominal pas + timing); 30 ETH di exchange = titik intervensi (lapor + bekukan jika cepat).",
        "Pembahasan: (a) kegagalan di sini bukan kurang data — melainkan tidak ada yang MENJALANKAN checklist; (b) 8.200 holder rugi karena mengandalkan 'komunitas' dan influencer, bukan verifikasi 15 menit; (c) untuk analis: bangun MONITORING otomatis untuk 4 sinyal ini pada token yang ditangani institusimu — deteksi terbaik adalah yang berjalan sebelum bencana.",
      ],
      tasks: [],
      reference: "Kegagalan MOONX = checklist tak dijalankan. Otomatiskan 4 sinyal untuk token yang ditangani.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Honeypot: pajak yang tidak tertulis",
      prose: [
        "Rug pull = likuiditas DITARIK (drain 97%, lesson ini). Honeypot = likuiditas TIDAK BISA ditarik olehMU — kontrak mengizinkan beli tapi memblokir jual (atau memajaki 99%). Dari luar, chart terlihat normal: harga naik 30x dalam 3 hari (cerita MOONX!). Dari dalam: 8.200 holder, hanya 300 yang berhasil jual (mereka yang jual SEBELUM pajak diaktifkan). 7.900 sisanya = penonton yang membayar.",
        "Cara mendeteksi SEBELUM beli (5 menit): (1) BACA KODE — fungsi `_transfer` ada `if (to == pair) tax = 99%`? = honeypot. Tidak bisa baca Solidity? (2) SIMULASI — tools simulasi transaksi: coba jual 1 token di fork lokal; jika gagal/dipajaki 99% = honeypot. (3) CEK HOLDER — 8.200 holder tapi hanya 300 pernah JUAL (outflow)? = pola honeypot. (4) CEK PAJAK — `buyTax` 5% wajar; `sellTax` 99% = rampok. Empat cek ini menangkap 95% honeypot SEBELUM uang masuk.",
        "Contoh angka MOONX: total beli 8.200 holder × rata-rata Rp11,7 juta = Rp96 miliar masuk. Pajak jual 99%: yang berhasil jual awal (300 orang × Rp11,7jt) = Rp3,5 miliar keluar (mereka untung!). 7.900 orang × Rp11,7jt = Rp92,5 miliar TERKUNCI. Pelaku tarik likuiditas: Rp92,5 miliar − Rp3,5 miliar = Rp89 miliar bersih. `30x dalam 3 hari` = umpan; `99% sell tax` = perangkap. Matematikanya sederhana; psikologinya (FOMO) yang mematikan.",
        "Rumus `pajak efektif`: pajak_efektif = 1 − (diterima / dikirim). Simulasi jual 1.000 token: diterima 10 token → pajak_efektif = 99%. Ambang: < 10% = normal (biaya DEX); 10–25% = waspada (pajak tinggi tapi masih bisa keluar); > 25% = JANGAN MASUK. Catatan: pajak bisa DIUBAH pemilik kapan saja (fungsi `setTax`)! Cek juga: apakah kontrak `renounced` (pemilik melepas kontrol)? Jika tidak + ada `setTax` = pajak 5% hari ini bisa jadi 99% besok. Kepercayaan butuh verifikasi ON-CHAIN, bukan janji di Telegram.",
        "Empat sinyal peringatan dini (lesson ini) dilengkapi angka: (1) HOLDER vs TRADER — 8.200 holder tapi < 5% pernah jual = anomali. (2) LIKUIDITAS vs MARKET CAP — mcap Rp960 miliar tapi likuiditas cuma Rp96 miliar (10%) = tipis, mudah dimanipulasi. (3) UMUR KONTRAK — < 7 hari + sudah 30x = pola klasik. (4) DISTRIBUSI — tim pegang > 40% (bcd5!). Skor: tiap sinyal 0/1; total ≥3 = JANGAN SENTUH. MOONX skor 4/4.",
        "Triase yang benar: FLAG (otomatis: skor ≥3 → flag merah) → VERIFIKASI (manual 15 menit: 4 cek honeypot + baca kontrak) → TINDAK (peringatkan komunitas / laporkan / blacklist). Yang TIDAK boleh: langsung `tuduh scam` dari skor saja (false positive = fitnah; bcd3!), atau `tunggu bukti` (keburu drain). Verifikasi 15 menit adalah jembatan antara kecepatan dan keadilan.",
      ],
      formula: String.raw`\text{pajak}_{efektif} = 1 - \frac{\text{diterima}}{\text{dikirim}}`,
      formulaNote: "Hitung via SIMULASI jual sebelum beli (fork lokal/tools). < 10% normal; 10–25% waspada; > 25% jangan masuk. Cek juga apakah pemilik bisa MENGUBAH pajak (setTax + belum renounced) — itu bom waktu.",
      figure: {
        svg: BCD7_DEEP_SVG,
        alt: "Diagram batang aliran MOONX: Rp96 miliar masuk, hanya Rp3,5 miliar keluar, Rp92,5 miliar terkunci.",
        caption: "Cara membaca: tiga batang = aliran dana (miliar rupiah); masuk = total beli, keluar = yang berhasil jual, terkunci = sisanya. Interpretasi: 96% dana TERKUNCI oleh pajak jual 99% — `30x dalam 3 hari` adalah umpan untuk mengisi perangkap, bukan peluang.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: yang tidak bisa keluar = bukan investasi",
        body: "Investasi mensyaratkan kamu BISA keluar. Honeypot menghapus syarat itu secara diam-diam (pajak 99% = tembok tak terlihat). Sebelum beli token apa pun: simulasikan JUAL dulu. Jika simulasinya gagal, itu bukan `risiko` — itu kepastian.",
      },
      reference: "4 cek < 5 menit: baca kode, simulasi jual, cek holder, cek pajak + renounced.",
    },
    {
      id: "kelas-exploit",
      eyebrow: "Langkah 9 · Keamanan protokol",
      title: "Empat pola exploit yang terus berulang",
      prose: [
        "Reentrancy: kontrak memanggil kontrak lain SEBELUM memperbarui catatannya sendiri. Kontrak penyerang 'menelpon balik' di tengah proses dan menarik dana berulang kali dari saldo yang belum berkurang. Gagasannya satu kalimat: jangan pernah memanggil pihak luar sebelum bukumu rapi.",
        "Manipulasi oracle harga: kontrak DeFi butuh 'harga pasar' dari luar (oracle). Penyerang meminjam dana raksasa sesaat (flash loan), menggerakkan harga di pool yang tipis, lalu kontrak korban yang membaca harga dari pool itu mengira harga sungguh berubah — dan memberi pinjaman murah atau likuidasi yang salah sasaran. Gagasannya: satu sumber harga = satu titik kegagalan.",
        "Kontrol akses longgar: fungsi penting (mint, tarik dana, ganti parameter) bisa dipanggil SIAPA SAJA karena pembatas 'hanya admin' lupa dipasang. Ini bukan peretasan canggih — ini pintu yang tidak dikunci. Gagasannya: setiap fungsi istimewa wajib menjawab 'siapa yang boleh memanggil ini'.",
        "Overflow & logic error: perhitungan yang salah di kondisi tepi — pembulatan yang menguntungkan penyerang, pembagian sebelum perkalian yang menghilangkan presisi, atau cabang `if` yang terbalik. Gagasannya: uang adalah bilangan yang tidak memaafkan kesalahan aritmetika.",
        "Kenapa pola yang sama berulang? Tiga alasan struktural. Satu — kode disalin: kontrak di-fork dari proyek terkenal beserta bug-nya. Dua — audit dilewati: meluncurkan cepat dianggap lebih penting daripada memeriksa, padahal biaya audit < 1% potensi kerugian. Tiga — insentif asimetris: penyerang hanya butuh SATU lubang, defender harus menutup SEMUANYA.",
        "💡 Dasar audit kontrak pintar — apa yang sebenarnya diperiksa: (1) CAKUPAN: baris kode mana yang diaudit, versi berapa (audit atas v1.2 tidak berlaku untuk v1.3 yang sudah diubah). (2) TEMUAN BERGRADASI: kritis/tinggi/sedang/rendah + statusnya (diperbaiki? diterima risikonya? diabaikan?). (3) BATASAN: audit = pemeriksaan pada satu titik waktu atas kode tertentu, BUKAN jaminan selamanya. Kontrak teraudit tetap bisa runtuh — kodenya berubah setelah audit, temuannya tidak diperbaiki, atau risikonya di luar cakupan (kunci admin dicuri bukan bug kode). Saat membaca ringkasan insiden, pisahkan AKAR PENYEBAB (kelas exploit apa) dari KERUGIAN (berapa besar) — kerugian besar belum tentu teknik canggih; seringnya teknik lama + nilai terkunci yang besar.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Kontrak ini lolos audit dua firma ternama, jadi pasti aman.\" Audit memeriksa bug pada kode versi tertentu di satu titik waktu — bukan niat developer, bukan kunci yang dicuri setelahnya, bukan perubahan kode pasca-audit. Yang benar: cek versi yang diaudit = versi yang di-deploy? temuan kritis sudah diperbaiki atau hanya 'diterima risikonya'? Audit menjawab 'apakah kodenya benar'; analis menjawab 'apakah strukturnya jujur'.",
      },
      reference: "4 pola: reentrancy, oracle, akses, logika. Audit = cakupan + temuan + batasan, bukan jaminan.",
    },
    {
      id: "custody-risiko",
      eyebrow: "Langkah 10 · Custody",
      title: "Custody: siapa memegang kunci, siapa menanggung risiko",
      prose: [
        "Self-custody vs kustodian: self-custody = kamu pegang private key sendiri (kebebasan penuh, tanggung jawab penuh — key hilang = dana hilang, tidak ada tombol 'lupa password'). Kustodian = pihak ketiga (bursa, layanan kustodi) yang memegang key untukmu — nyaman, tetapi kamu menukar risiko teknis dengan risiko PIHAK KETIGA.",
        "Pelajaran keruntuhan kustodian: beberapa bursa besar runtuh bukan karena diretas, melainkan karena dana nasabah DIPAKAI atau DICAMPUR — dipinjamkan, diinvestasikan, atau dipakai menutup lubang kerugian perusahaan. Prinsip 'bukan kuncimu, bukan koinmu' (not your keys, not your coins) — versi netralnya: setiap dana yang kamu titipkan adalah EKSPOSUR KREDIT terhadap kustodian itu. Perlakukan seperti menaruh uang di bank tanpa penjaminan simpanan.",
        "Proof of reserves — apa yang dibuktikan dan apa yang TIDAK: PoR membuktikan kustodian MEMEGANG aset (kriptografis: tanda tangan dari address yang diklaim). Yang TIDAK dibuktikan: (1) KEWAJIBAN — berapa yang wajib dibayar ke nasabah (liabilitas tidak terlihat di chain); (2) KEPEMILIKAN BERSIH — aset bisa berupa pinjaman sesaat untuk difoto; (3) PEMISAHAN — dana nasabah vs dana operasional. PoR tanpa audit liabilitas = foto setengah badan.",
        "Mitigasi yang nyata: multisig (kunci dipecah ke beberapa pihak — butuh m-dari-n tanda tangan untuk bergerak), pemisahan dana operasional vs nasabah (rekening terpisah, aturan tertulis), dan — ini bagian analis — MEMBACA SINYAL dari data on-chain: arus keluar abnormal dari dompet kustodian (penarikan besar mendadak), konsentrasi dompet (semua dana di 1–2 address = titik kegagalan tunggal), dan pola dana nasabah yang bergerak ke arah tak wajar (misalnya ke dompet trading milik perusahaan).",
        "💡 Intuisi: kustodian = bank tanpa penjamin simpanan. Kamu tidak akan menaruh seluruh tabungan di bank yang tidak dijamin tanpa memeriksanya — perlakukan kustodian kripto dengan skeptisisme yang sama, DITAMBAH satu keunggulan: neraca asetnya terlihat publik di chain. Tugas analis: mengubah 'terlihat' menjadi 'terpantau' — daftar dompet kustodian, ambang arus keluar, alert otomatis.",
        "Lab berikut mensimulasikan pekerjaan triase: 10 insiden dengan gejala, status audit, dan flag kustodian. Klasifikasikan tiap insiden ke 5 kelas (reentrancy, oracle, akses, logika, kustodian), lalu hitung ringkasannya — termasuk pertanyaan yang paling menohok: berapa insiden terjadi pada kontrak yang SUDAH diaudit?",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `klasifikasi(gejala)` yang memetakan gejala ke kelas insiden" },
        { id: "t2", text: "Hitung `porsi` = proporsi tiap kelas dari 10 insiden (dict)" },
        { id: "t3", text: "Hitung `audit_runtuh` = insiden pada kontrak yang sudah diaudit" },
        { id: "t4", text: "Hitung `kustodian` = insiden yang melibatkan kustodian, lalu cetak ringkasan" },
      ],
      expected: "insiden=10 audit_runtuh=5 kustodian=2 | porsi: akses=0.2, kustodian=0.2, logika=0.1, oracle=0.2, reentrancy=0.3",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Bursa ini mempublikasikan proof of reserves, jadi dana nasabah aman.\" PoR hanya membuktikan ASET ADA — bukan bahwa asetnya cukup untuk semua kewajiban, bukan bahwa aset tidak dipinjam sesaat untuk difoto, dan bukan bahwa dana nasabah dipisah dari dana operasional. Yang benar: PoR + audit liabilitas independen + pemisahan dana yang terverifikasi. Tanpa ketiganya, PoR adalah klaim sepihak yang difoto dengan indah.",
      },
      hints: [
        "Petakan gejala: 'tarik-berulang' → reentrancy, 'harga-loncat' → oracle, 'fungsi-publik' → akses, 'perhitungan-salah' → logika, sisanya → kustodian.",
        "porsi: hitung kemunculan tiap kelas dibagi total insiden (dict comprehension + sorted agar urutan stabil).",
        "audit_runtuh: hitung yang diaudit True (hati-hati: None bukan True — pakai `is True`).",
      ],
      code: {
        starter: `# 10 insiden: (nama, gejala, diaudit, kustodian)\nINSIDEN = [\n    ("Pool-Alpha", "tarik-berulang", True, False),\n    ("Swap-Beta", "harga-loncat", True, False),\n    ("Vault-Gamma", "fungsi-publik", False, False),\n    ("Farm-Delta", "tarik-berulang", False, False),\n    ("Oracle-Epsilon", "harga-loncat", False, False),\n    ("Bridge-Zeta", "perhitungan-salah", True, False),\n    ("Token-Eta", "fungsi-publik", True, False),\n    ("Lending-Theta", "tarik-berulang", True, False),\n    ("Bursa-Kappa", "dana-dicampur", None, True),\n    ("Dompet-Lambda", "dana-dicampur", None, True),\n]\n\n# TULIS KODEMU\ndef klasifikasi(gejala):\n    `,
        lockLines: 15,
        solution: `# 10 insiden: (nama, gejala, diaudit, kustodian)\nINSIDEN = [\n    ("Pool-Alpha", "tarik-berulang", True, False),\n    ("Swap-Beta", "harga-loncat", True, False),\n    ("Vault-Gamma", "fungsi-publik", False, False),\n    ("Farm-Delta", "tarik-berulang", False, False),\n    ("Oracle-Epsilon", "harga-loncat", False, False),\n    ("Bridge-Zeta", "perhitungan-salah", True, False),\n    ("Token-Eta", "fungsi-publik", True, False),\n    ("Lending-Theta", "tarik-berulang", True, False),\n    ("Bursa-Kappa", "dana-dicampur", None, True),\n    ("Dompet-Lambda", "dana-dicampur", None, True),\n]\n\n# TULIS KODEMU\ndef klasifikasi(gejala):\n    if gejala == "tarik-berulang":\n        return "reentrancy"\n    if gejala == "harga-loncat":\n        return "oracle"\n    if gejala == "fungsi-publik":\n        return "akses"\n    if gejala == "perhitungan-salah":\n        return "logika"\n    return "kustodian"\n\nhasil = [klasifikasi(g) for _, g, _, _ in INSIDEN]\nn = len(hasil)\nporsi = {k: hasil.count(k) / n for k in sorted(set(hasil))}\naudit_runtuh = sum(1 for _, _, d, _ in INSIDEN if d is True)\nkustodian = sum(1 for _, _, _, k in INSIDEN if k)\n\nprint(f"insiden={n} audit_runtuh={audit_runtuh} kustodian={kustodian}")\nprint("porsi:", ", ".join(f"{k}={v:.1f}" for k, v in porsi.items()))`,
        checks: [
          { kind: "defined", task: "t1", name: "klasifikasi", label: "Fungsi `klasifikasi` terdefinisi", msg: "Definisikan def klasifikasi(gejala): ..." },
          { kind: "equal", task: "t2", name: "porsi", value: { akses: 0.2, kustodian: 0.2, logika: 0.1, oracle: 0.2, reentrancy: 0.3 }, tol: 1e-9, label: "`porsi` tiap kelas benar", msg: "akses=0.2, kustodian=0.2, logika=0.1, oracle=0.2, reentrancy=0.3." },
          { kind: "equal", task: "t3", name: "audit_runtuh", value: 5, tol: 0, label: "`audit_runtuh` = 5", msg: "5 kontrak diaudit tetap runtuh (pakai `is True`, bukan truthy — None bukan True)." },
          { kind: "equal", task: "t4", name: "kustodian", value: 2, tol: 0, label: "`kustodian` = 2", msg: "2 insiden melibatkan kustodian." },
          { kind: "stdout_matches", task: "t4", pattern: "insiden=10 audit_runtuh=5 kustodian=2", label: "Baris ringkasan tercetak", msg: "Samakan format print baris pertama dengan contoh." },
          { kind: "stdout_matches", task: "t4", pattern: "porsi: akses=0\\.2, kustodian=0\\.2, logika=0\\.1, oracle=0\\.2, reentrancy=0\\.3", label: "Baris porsi tercetak", msg: "Samakan urutan (sorted) dan format satu desimal." },
        ],
      },
      reference: "Kustodian = eksposur kredit. PoR bukan bukti solvabilitas. Pantau dompet kustodian dari chain.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Rug pull (orang dalam), scam token (orang luar), mixer abuse (pencucian) — beda pelaku, sama-sama meninggalkan jejak.",
        "4 sinyal dini: konsentrasi deployer, likuiditas tak terkunci, fungsi berbahaya, anomali sosial.",
        "Kecepatan + komunikasi membedakan drain sah vs rug pull.",
        "Flag = triase, bukan vonis — verifikasi manusia wajib sebelum tindak.",
        "Mixer = sinyal risiko (bukan bukti); screening sanksi = kontrol standar.",
      ],
      next: { label: "BCD8 — MEV: Konsep & Deteksi", href: "/v2/learn/bcd8-mev" },
      quiz: [
        {
          q: "Token lolos audit keamanan. Apakah aman dari rug pull?",
          options: [
            { text: "Ya — audit menjamin keamanan penuh", why: "Audit memeriksa bug, bukan niat developer." },
            { text: "Tidak — audit tidak memeriksa siapa pegang kunci, apakah likuiditas dikunci, dan distribusi", why: "Rug pull memakai fungsi normal (removeLiquidity); masalahnya struktur, bukan bug.", correct: true },
            { text: "Ya jika auditornya terkenal", why: "Reputasi auditor tidak mengubah struktur kepemilikan." },
            { text: "Tidak karena audit selalu palsu", why: "Audit bisa valid untuk bug — hanya tidak mencakup risiko niat." },
          ],
        },
        {
          q: "Penarikan 97% likuiditas dalam 1 blok TANPA pengumuman vs dalam 3 bulan DENGAN pengumuman. Bedanya?",
          options: [
            { text: "Tidak ada beda — jumlahnya sama", why: "Jumlah sama, makna berlawanan." },
            { text: "Kecepatan + komunikasi: tebing 1 blok tanpa kabar = sidik jari rug; bertahap + diumumkan = manajemen sah", why: "Metrik fraud selalu berdimensi waktu dan konteks.", correct: true },
            { text: "Yang 3 bulan pasti penipuan juga", why: "Tidak — bisa migrasi likuiditas yang sah." },
            { text: "Yang 1 blok pasti sah", why: "Kebalik — justru itu pola rug pull klasik." },
          ],
        },
        {
          q: "Sistem memberi 'rug flag = True' pada sebuah token. Tindakan yang benar?",
          options: [
            { text: "Langsung umumkan sebagai penipuan", why: "Bisa jadi migrasi sah — pengumuman tanpa verifikasi = fitnah." },
            { text: "Jadikan triase: cek pengumuman resmi + tujuan dana, baru simpulkan — catat keputusannya", why: "Flag = prioritas investigasi, bukan vonis.", correct: true },
            { text: "Abaikan — sistem sering salah", why: "Mengabaikan flag kritis = MOONX terulang." },
            { text: "Blokir semua holder token itu", why: "Menghukum korban — holder adalah korban, bukan pelaku." },
          ],
        },
        {
          q: "Deposit 10 ETH ke mixer, withdraw 9,9 ETH 20 blok kemudian ke address baru. Mengapa masih bisa dicurigai?",
          options: [
            { text: "Karena mixer tidak berfungsi", why: "Mixer berfungsi kriptografis — yang bocor adalah perilaku." },
            { text: "Nominal pas + timing rapat = jejak perilaku yang tersisa walau tautan kriptografis putus", why: "Heuristik deposit-withdraw berpasangan menangkap pola ceroboh.", correct: true },
            { text: "Karena 9,9 ≠ 10", why: "Selisih fee justru memperkuat dugaan pasangan." },
            { text: "Tidak bisa dicurigai sama sekali", why: "Bisa — sebagai sinyal risiko, bukan bukti." },
          ],
        },
        {
          q: "Ciri honeypot (bisa beli, tidak bisa jual) di level contract?",
          options: [
            { text: "Fungsi transfer asimetris / pajak jual 99% / blacklist penjual", why: "Kode membedakan beli vs jual — hanya terlihat dengan membaca contract.", correct: true },
            { text: "Harga naik terus", why: "Harga naik juga terjadi di token sehat." },
            { text: "Banyak holder", why: "Honeypot justru butuh banyak korban = banyak holder." },
            { text: "Likuiditas besar", why: "Likuiditas besar tidak membuktikan bisa menjual." },
          ],
        },
        {
          q: "Token baru: 8.200 holder, naik 30x 3 hari, sell tax 5% tapi kontrak belum renounced + ada fungsi setTax. Evaluasi?",
          options: [
            { text: "Aman — pajak 5% wajar dan holder banyak", why: "Pajak 5% HARI INI. Dengan setTax + belum renounced, pemilik bisa mengubah jadi 99% kapan saja = bom waktu. Holder banyak ≠ aman (MOONX!)." },
            { text: "Berbahaya: bom waktu setTax + 3 sinyal lain (umur, distribusi, likuiditas tipis) → skor ≥3", why: "Tepat. Pajak bisa diubah = pajak saat ini tidak menjamin apa pun. Ditambah umur < 7 hari + 30x + holder tak bisa jual = 4/4 sinyal. Jangan sentuh.", correct: true },
            { text: "Beli cepat sebelum pajak dinaikkan", why: "`Beli cepat` = berlomba dengan perampok yang memegang tombol. Jika menang, untung kecil; jika kalah, -99%. Ekspektasi negatif." },
            { text: "Tunggu 1 bulan lalu evaluasi lagi", why: "1 bulan = memberi waktu pelaku mengaktifkan perangkap + menarik likuiditas. Evaluasi SEKARANG (15 menit), keputusan sekarang." },
          ],
        },
      ],
    },
  ],
};
