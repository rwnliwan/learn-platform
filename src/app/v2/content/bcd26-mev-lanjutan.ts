import type { V2Lesson } from "../lib/types";

const FIG_SANDWICH = `<svg viewBox="0 0 520 300" role="img" aria-label="Diagram urutan sandwich attack: penyerang di depan dan belakang korban.">
<g font-family="var(--font-ui)">
<text x="260" y="24" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Sandwich attack: antrean yang dimanipulasi</text>
<rect x="40" y="60" width="120" height="60" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="100" y="86" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Penyerang</text>
<text x="100" y="104" font-size="10" fill="var(--chart-text)" text-anchor="middle">beli duluan (front-run)</text>
<rect x="200" y="60" width="120" height="60" rx="8" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="260" y="86" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Korban</text>
<text x="260" y="104" font-size="10" fill="var(--chart-text)" text-anchor="middle">swap di harga buruk</text>
<rect x="360" y="60" width="120" height="60" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="420" y="86" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Penyerang</text>
<text x="420" y="104" font-size="10" fill="var(--chart-text)" text-anchor="middle">jual kembali (back-run)</text>
<line x1="100" y1="140" x2="100" y2="200" stroke="var(--c1)" stroke-width="2"/>
<line x1="260" y1="140" x2="260" y2="200" stroke="var(--c2)" stroke-width="2"/>
<line x1="420" y1="140" x2="420" y2="200" stroke="var(--c1)" stroke-width="2"/>
<line x1="40" y1="200" x2="480" y2="200" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="100" y="222" font-size="10" fill="var(--chart-text)" text-anchor="middle">harga naik</text>
<text x="260" y="222" font-size="10" fill="var(--chart-text)" text-anchor="middle">harga makin naik</text>
<text x="420" y="222" font-size="10" fill="var(--chart-text)" text-anchor="middle">cuan dari selisih</text>
<rect x="60" y="238" width="400" height="40" rx="8" fill="var(--c3)" opacity="0.2" stroke="var(--c3)" stroke-width="1.5"/>
<text x="260" y="262" font-size="10" fill="var(--chart-text)" text-anchor="middle">Korban membayar “pajak antrean”: terima 8.281 vs 9.091 tanpa serangan (−809).</text>
</g>
</svg>`;

export const bcd26: V2Lesson = {
  slug: "bcd26-mev-lanjutan",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD26 — MEV Lanjutan: Sandwich, Arbitrase & Ekstraksi Nilai",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Swap Rp50 juta, lenyap Rp2,1 juta tanpa peringatan",
      prose: [
        "Seorang pengguna DEX menukar token senilai Rp50 juta. Layar menampilkan estimasi yang ia setujui; tidak ada peringatan slippage. Beberapa detik kemudian, ia menerima token senilai Rp2,1 juta LEBIH SEDIKIT dari estimasi. Ia memeriksa ulang — tidak salah klik, tidak salah jaringan. Uangnya tidak dicuri; ia hanya 'terlambat sepersekian detik' dari seseorang yang membayar untuk berdiri di depannya dalam antrean.",
        "Twist-nya: tidak ada bug, tidak ada hack, tidak ada yang melanggar aturan protokol. Penyerang hanya melakukan tiga transaksi yang semuanya sah: beli sebelum korban, biarkan korban membeli di harga yang sudah naik, lalu jual kembali. Semua tercatat transparan di blockchain — korban bahkan bisa melihat siapa yang menyerangnya dan berapa cuannya. Di dunia MEV, kejahatannya legal secara protokol tetapi merugikan secara ekonomi — dan analis on-chain adalah orang yang bisa membuktikannya dari data.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan mempool dan mengapa urutan transaksi bisa dimanipulasi; (2) menguraikan mekanik sandwich attack langkah per langkah; (3) menghitung output AMM dengan rumus x·y=k serta profit penyerang dan kerugian korban; (4) membedakan sandwich, arbitrase, dan JIT liquidity; (5) menjelaskan mitigasi untuk pengguna dan cara mendeteksi sandwich dari data on-chain. Prasyarat diringkas: AMM menukar token memakai pool likuiditas dengan rumus harga x·y=k — semakin besar swap relatif terhadap pool, semakin besar pergeseran harga (price impact).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "MEV adalah 'pajak tak terlihat' DeFi: pengguna ritel membayarnya tanpa sadar, bot meraupnya secara sistematis. Analis yang bisa mengukur ekstraksi nilai per protokol memberi data yang dipakai tim produk untuk merancang proteksi — dan data itu langka serta mahal harganya.",
      },
      reference: "Antrean transparan bisa dimanipulasi.",
    },
    {
      id: "mempool",
      eyebrow: "Langkah 2 · Konsep",
      title: "Mempool: ruang tunggu berdinding kaca",
      prose: [
        "Si Ruang Tunggu Kaca. Sebelum transaksi masuk blok, ia menunggu di mempool — antrean publik yang bisa dibaca siapa pun. Di sinilah letak masalahnya: niat transaksimu (mau swap apa, berapa banyak, slippage berapa) TERLIHAT oleh semua orang SEBELUM dieksekusi. Bayangkan memesan ojek dengan mengumumkan tujuan dan budget ke seluruh terminal sebelum naik — tentu ada yang memanfaatkan infonya.",
        "Urutan transaksi dalam satu blok ditentukan oleh block builder/validator — dan di banyak rantai, siapa membayar biaya (gas/priority fee) lebih tinggi bisa 'menyalip'. Mekanisme ini sah secara protokol: tidak ada aturan yang dilanggar. Tetapi ia menciptakan pasar untuk POSISI dalam antrean — dan posisi di depan transaksi besar adalah posisi yang berharga.",
        "Implikasi untuk analis: mempool adalah sumber data prediksi — bot MEV memindai mempool untuk transaksi korban yang menguntungkan, BUKAN menunggu blok jadi. Pola yang bisa dideteksi: transaksi dengan priority fee janggal yang selalu muncul tepat sebelum swap besar dari alamat yang sama.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Blockchain itu adil karena semua orang melihat data yang sama.” Transparansi justru SENJATA penyerang di sini: korban tidak bisa menyembunyikan niatnya, sedangkan penyerang bisa menyembunyikan strateginya (bot, modal, timing). Keadilan informasi ≠ keadilan hasil.",
      },
      reference: "Niatmu publik; strateginya privat.",
    },
    {
      id: "sandwich",
      eyebrow: "Langkah 3 · Konsep",
      title: "Sandwich: menyerang dari dua sisi",
      prose: [
        "Si Tukang Selip. Sandwich attack adalah tiga langkah: (1) FRONT-RUN — penyerang melihat swap besar korban di mempool, lalu membeli token yang sama SEBELUM korban dengan fee lebih tinggi agar dieksekusi duluan; pembelian ini mendorong harga naik. (2) KORBAN — swap korban dieksekusi di harga yang sudah naik; ia menerima token lebih sedikit dari estimasi. (3) BACK-RUN — penyerang menjual kembali tokennya (sekarang lebih mahal karena korban baru saja membeli) dan mengantongi selisihnya.",
        "Syarat sandwich yang menguntungkan: swap korban harus CUKUP BESAR relatif terhadap pool (sehingga price impact-nya signifikan), dan penyerang butuh modal + kecepatan (bot memindai mempool otomatis). Korban ritel dengan swap kecil biasanya tidak menarik — bukan karena aman, melainkan karena tidak ekonomis untuk diserang.",
        "Kenapa ini bukan 'hack': ketiga transaksi valid menurut aturan protokol; tidak ada kunci yang dibobol. Ini adalah eksploitasi EKONOMI atas desain antrean — seperti calo yang sah membeli tiket lalu menjualnya lebih mahal di depan pintu. Legalitasnya diperdebatkan, tetapi datanya tidak: setiap sandwich meninggalkan jejak tiga transaksi yang bisa diukur.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Kunci sandwich adalah URUTAN, bukan kecepatan semata. Penyerang tidak perlu lebih cepat dari korban — ia hanya perlu membayar agar transaksinya DITEMPATKAN sebelum dan sesudah korban. Ini kompetisi lelang posisi, bukan balapan.",
      },
      reference: "Tiga transaksi sah, satu korban.",
    },
    {
      id: "matematika-amm",
      eyebrow: "Langkah 4 · Konsep",
      title: "Matematika AMM: dari mana cuan itu berasal",
      prose: [
        "Si Kasir Jujur. AMM constant-product menjaga x·y=k: cadangan dua token selalu berkalian tetap. Saat kamu memasukkan Δx token X, kamu menerima Δy token Y menurut rumus di bawah — dan karena k tetap, pembelian besar menggeser harga melawanmu (price impact). Inilah 'mesin' yang dieksploitasi sandwich: penyerang membeli dulu (menggeser harga naik), korban membeli di harga yang sudah digeser, penyerang menjual di harga yang makin tinggi.",
        "Rumus kerja analis — output swap AMM:",
      ],
      formula: String.raw`\Delta y = \frac{y \cdot \Delta x}{x + \Delta x}`,
      formulaNote: "x, y = cadangan token X dan Y di pool SEBELUM swap; Δx (delta x) = jumlah token X yang dimasukkan; Δy = jumlah token Y yang diterima. Contoh: pool (1000 X, 100.000 Y), swap 100 X → Δy = 100.000×100/(1000+100) = 9.090,91 Y. Profit sandwich = token X yang diterima penyerang saat back-run dikurangi modal front-run-nya; kerugian korban = Δy tanpa serangan dikurangi Δy dengan serangan.",
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Slippage tolerance melindungi dari sandwich.” Slippage tolerance hanya MEMBATASI kerugian (transaksi gagal bila harga bergerak terlalu jauh) — ia tidak MENCEGAH serangan. Korban dengan slippage 1% tetap bisa disedot tepat 1%; perlindungannya adalah batas kerugian, bukan perisai.",
      },
      reference: "Rumusnya jujur; antreannya tidak.",
    },
    {
      id: "keluarga-mev",
      eyebrow: "Langkah 5 · Konsep",
      title: "Keluarga MEV & cara bertahan",
      prose: [
        "Si Keluarga Ekstraktor. Sandwich hanyalah satu anggota keluarga MEV (Maximal Extractable Value). Arbitrase antar-DEX: bot membeli token murah di satu DEX dan menjual mahal di DEX lain dalam blok yang sama — ini MEV yang 'sehat' karena menyamakan harga antar-pasar. JIT (just-in-time) liquidity: bot menambahkan likuiditas raksasa sepersekian detik sebelum swap besar untuk meraup fee, lalu menariknya kembali — menumpang tanpa menanggung risiko.",
        "Cara membaca figur: tiga kotak berurutan = urutan eksekusi dalam satu blok; panah harga di bawahnya menunjukkan harga bergerak naik setiap langkah; kotak bawah merangkum 'pajak' korban. Interpretasi: penyerang tidak mencuri dari dompet korban — ia memanipulasi HARGA yang dihadapi korban, lalu memanen selisihnya. Kerugian korban (−809 Y) praktis sama dengan keuntungan kotor penyerang sebelum biaya.",
        "Mitigasi untuk pengguna: (1) private orderflow / RPC privat — kirim transaksi langsung ke builder tanpa lewat mempool publik (niat tidak terlihat = tidak bisa diserang); (2) batasi ukuran swap relatif terhadap pool; (3) pakai limit order, bukan market swap. Mitigasi untuk analis: deteksi sandwich dari pola tiga transaksi (beli–korban–jual oleh alamat yang sama dalam satu blok dengan token yang sama).",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Tidak semua MEV jahat: arbitrase antar-DEX membuat harga efisien untuk semua orang. Analis yang baik membedakan MEV 'ekstraktif' (sandwich — merugikan pengguna spesifik) dari MEV 'efisien' (arbitrase — memperbaiki pasar). Vonis buta 'semua MEV buruk' sama salahnya dengan 'semua MEV boleh'.",
      },
      figure: {
        svg: FIG_SANDWICH,
        alt: "Diagram urutan sandwich attack: front-run, korban, back-run.",
        caption: "Sandwich = lelang posisi: penyerang membayar untuk mengapit korban dalam satu blok.",
      },
      reference: "Bedakan ekstraktif vs efisien.",
    },
    {
      id: "lab-sandwich",
      eyebrow: "Langkah 6 · Lab",
      title: "Simulasi sandwich di AMM",
      prose: [
        "Pool (1000 X, 100.000 Y). Korban menukar 100 X; penyerang front-run 50 X lalu back-run seluruh Y yang ia terima. Tugasmu: (1) simulasikan tiga langkah (front-run → korban → back-run) dengan rumus Δy = y·Δx/(x+Δx); (2) hitung profit penyerang (X diterima saat back-run dikurangi modal 50 X) dan kerugian korban (Y tanpa serangan dikurangi Y dengan serangan); (3) cetak keduanya dibulatkan 2 desimal.",
        "Hasil yang benar: profit ≈ 9,71 X; kerugian korban ≈ 809,34 Y (korban menerima 8.281,57 vs 9.090,91 tanpa serangan). Perhatikan: kerugian korban hampir seluruhnya berpindah menjadi keuntungan penyerang — sandwich adalah transfer kekayaan, bukan penciptaan nilai.",
      ],
      tasks: [
        { id: "t1", text: "Simulasikan front-run, swap korban, dan back-run di AMM" },
        { id: "t2", text: "Hitung `profit` penyerang dan `rugi_korban`" },
        { id: "t3", text: "Cetak keduanya dengan 2 desimal" },
      ],
      expected: "profit=9.71\nrugi_korban=809.34",
      note: {
        title: "💡 Intuisi",
        body: "Perhatikan urutan cadangan: setelah front-run, pool menjadi (1050, 95238) — korban menghadapi pool yang LEBIH MAHAL. Setelah korban, pool (1150, 86957) — penyerang menjual di harga yang makin baik. Setiap langkah menggeser harga melawan pihak berikutnya.",
      },
      hints: [
        "Fungsi swap: dy = y*dx/(x+dx); cadangan baru (x+dx, y-dy).",
        "Back-run: tukar SEMUA y_out_a kembali ke X: dx = x*y_in/(y+y_in).",
        "rugi_korban = y_korban_tanpa_serangan − y_korban_dengan_serangan.",
      ],
      code: {
        starter: "# Pool & pelaku. JANGAN UBAH.\nx0, y0 = 1000.0, 100000.0\ndx_victim, dx_attack = 100.0, 50.0\n\ndef swap(x, y, dx):\n    dy = y * dx / (x + dx)\n    return x + dx, y - dy, dy\n\n# TULIS KODEMU: tiga langkah sandwich.\nx1, y1, y_out_a = \nx2, y2, y_out_v = \nx3, y3, x_out_a = \n_, _, y_out_v_clean = swap(x0, y0, dx_victim)\nprofit = \nrugi_korban = \nprint(f\"profit={profit:.2f}\")\nprint(f\"rugi_korban={rugi_korban:.2f}\")\n",
        lockLines: 8,
        solution: "# Pool & pelaku. JANGAN UBAH.\nx0, y0 = 1000.0, 100000.0\ndx_victim, dx_attack = 100.0, 50.0\n\ndef swap(x, y, dx):\n    dy = y * dx / (x + dx)\n    return x + dx, y - dy, dy\n\n# TULIS KODEMU: tiga langkah sandwich.\nx1, y1, y_out_a = swap(x0, y0, dx_attack)\nx2, y2, y_out_v = swap(x1, y1, dx_victim)\nx3, y3, x_out_a = swap(y2, x2, y_out_a)\n_, _, y_out_v_clean = swap(x0, y0, dx_victim)\nprofit = round(x_out_a - dx_attack, 2)\nrugi_korban = round(y_out_v_clean - y_out_v, 2)\nprint(f\"profit={profit:.2f}\")\nprint(f\"rugi_korban={rugi_korban:.2f}\")\n",
        checks: [
          { kind: "equal", task: "t2", name: "profit", value: 9.71, tol: 0.05, label: "profit ≈ 9,71", msg: "Selisih back-run vs modal." },
          { kind: "equal", task: "t2", name: "rugi_korban", value: 809.34, tol: 1.0, label: "rugi ≈ 809,34", msg: "Y hilang vs tanpa serangan." },
          { kind: "stdout_matches", task: "t3", label: "profit tercetak", msg: "Format 2 desimal.", pattern: "profit=9.71" },
          { kind: "stdout_matches", task: "t3", label: "rugi tercetak", msg: "Format 2 desimal.", pattern: "rugi_korban=809.34" },
          { kind: "uses", task: "t1", token: "swap", label: "memakai swap", msg: "Fungsi AMM dipakai tiga kali." },
          { kind: "defined", task: "t2", name: "y_out_v", label: "`y_out_v` terdefinisi", msg: "Hasil swap korban." },
        ],
      },
      reference: "Tiga swap, satu transfer kekayaan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: bertahan & mendeteksi",
      prose: [
        "Skenario 1 — Kamu pengguna ritel swap besar di DEX → pakai RPC privat / private orderflow agar niat tidak terlihat di mempool; bagi swap besar menjadi beberapa kecil bila private orderflow tak tersedia.",
        "Skenario 2 — Kamu analis mendeteksi sandwich → cari pola tiga transaksi dalam satu blok: alamat sama membeli token A, lalu alamat korban swap A, lalu alamat sama menjual A — dengan jeda posisi berdekatan dan token identik.",
        "Skenario 3 — Kamu tim produk DEX → sediakan opsi private orderflow dan tampilkan estimasi 'MEV risk' untuk swap besar; pengguna yang paham risikonya memilih proteksi sendiri.",
        "Skenario 4 — Kamu peneliti mengukur MEV → bedakan sandwich (ekstraktif, merugikan pengguna spesifik) dari arbitrase (efisien, menyamakan harga); laporkan keduanya terpisah — menggabungkannya menyesatkan.",
        "Aturan 10 detik: (1) siapa yang membayar pajak antrean? (2) niat transaksinya terlihat di mana? (3) proteksi apa yang tersedia? Sembunyikan niat atau kecilkan target.",
      ],
      tasks: [],
      reference: "Sembunyikan niat atau kecilkan target.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Bot yang meraup 9,7 X dari satu blok",
      prose: [
        "Seorang analis menelusuri satu blok dan menemukan tiga transaksi berurutan dari alamat 0x7f…: (1) beli 50 X seharga 4.761 Y; (2) [transaksi korban] swap 100 X; (3) jual 4.761 Y kembali menjadi 59,71 X. Modal awal 50 X, akhir 59,71 X — profit 9,71 X dalam 12 detik, tanpa memegang risiko harga semalaman.",
        "Pertanyaan: (1) Buktikan dari data bahwa ini sandwich, bukan tiga trade kebetulan — ciri apa yang dicari? (2) Berapa kerugian korban, dan dari mana angka itu berasal? (3) Jika kamu auditor protokol DEX ini, rekomendasi proteksi apa yang kamu tulis?",
        "Pembahasan: (1) Ciri sandwich: alamat penyerang sama di transaksi 1 & 3, token sama, posisi mengapit tepat satu swap besar korban, dan back-run menjual PERSIS jumlah yang dibeli di front-run (4.761 Y) — kebetulan tidak serapi ini. (2) Kerugian korban = 809,34 Y — selisih antara yang diterima (8.281,57) vs tanpa serangan (9.090,91); praktis sama dengan profit kotor penyerang. (3) Rekomendasi: integrasikan private orderflow sebagai opsi default untuk swap di atas ambang, tampilkan peringatan price-impact vs MEV-risk, dan pertimbangkan batch auction untuk pasangan likuid.",
      ],
      tasks: [],
      reference: "Jejak tiga transaksi tidak berbohong.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      summary: [
        "Mempool = antrean publik: niat transaksi terlihat sebelum dieksekusi; posisi dalam blok bisa dibeli lewat fee.",
        "Sandwich = front-run (beli duluan, harga naik) → korban (beli di harga buruk) → back-run (jual, panen selisih); semuanya sah secara protokol.",
        "Rumus AMM: Δy = y·Δx/(x+Δx); pembelian menggeser harga melawan pembeli berikutnya — mesin ekonomi sandwich.",
        "Keluarga MEV: sandwich (ekstraktif), arbitrase antar-DEX (efisien), JIT liquidity (menumpang fee).",
        "Mitigasi: private orderflow (sembunyikan niat), swap kecil, limit order; deteksi: pola tiga transaksi satu blok.",
      ],
      quiz: [
        {
          q: "Mengapa mempool memungkinkan sandwich attack?",
          options: [
            { text: "Niat transaksi (aset, jumlah, slippage) terlihat publik sebelum dieksekusi", why: "Benar: penyerang membaca niat korban dari mempool.", correct: true },
            { text: "Mempool menyimpan private key pengguna", why: "Salah: mempool hanya berisi transaksi yang menunggu, bukan kunci." },
            { text: "Validator bisa mengubah jumlah swap korban", why: "Salah: validator mengatur urutan, bukan isi transaksi." },
            { text: "Mempool memperlambat semua transaksi", why: "Salah: kecepatan bukan mekanisme serangannya." },
          ],
        },
        {
          q: "Urutan yang benar dalam sandwich attack:",
          options: [
            { text: "Penyerang beli → korban swap di harga naik → penyerang jual kembali", why: "Benar: front-run, korban, back-run.", correct: true },
            { text: "Korban swap → penyerang beli → penyerang jual", why: "Salah: tanpa front-run tidak ada penggeseran harga." },
            { text: "Penyerang jual → korban swap → penyerang beli", why: "Salah: itu kebalikan logika — menjual dulu tidak menggeser harga naik." },
            { text: "Ketiganya dieksekusi dalam blok yang berbeda", why: "Salah: justru harus satu blok agar urutannya terjamin." },
          ],
        },
        {
          q: "Pool (1000 X, 100.000 Y). Swap 100 X menerima:",
          options: [
            { text: "9.090,91 Y — dihitung dari Δy = y·Δx/(x+Δx)", why: "Benar: 100.000×100/1100.", correct: true },
            { text: "10.000 Y — harga tidak berubah", why: "Salah: mengabaikan price impact." },
            { text: "9.523,81 Y — itu hasil swap 50 X, bukan 100 X", why: "Salah: 9.523,81 adalah output front-run penyerang." },
            { text: "8.281,57 Y — itu hasil korban SAAT diserang", why: "Salah: itu angka dengan sandwich, bukan tanpa." },
          ],
        },
        {
          q: "Pernyataan yang benar tentang slippage tolerance:",
          options: [
            { text: "Ia membatasi kerugian maksimum, tetapi tidak mencegah sandwich terjadi", why: "Benar: perisai parsial, bukan penangkal.", correct: true },
            { text: "Slippage 0% membuat sandwich mustahil", why: "Salah: slippage 0% hanya membuat transaksi gagal bila harga bergerak — serangan tetap dicoba." },
            { text: "Slippage tinggi melindungi dari MEV", why: "Salah: kebalikannya — memberi ruang lebih besar untuk disedot." },
            { text: "Slippage hanya relevan untuk limit order", why: "Salah: relevan untuk market swap." },
          ],
        },
        {
          q: "Bot membeli murah di DEX A dan menjual mahal di DEX B dalam satu blok. Ini termasuk MEV yang:",
          options: [
            { text: "Efisien — menyamakan harga antar-pasar, menguntungkan semua pengguna", why: "Benar: arbitrase memperbaiki pasar.", correct: true },
            { text: "Ekstraktif seperti sandwich — merugikan pengguna spesifik", why: "Salah: tidak ada korban spesifik yang harganya dimanipulasi." },
            { text: "Ilegal di semua yurisdiksi", why: "Salah: arbitrase adalah aktivitas pasar yang umum." },
            { text: "Mustahil dideteksi dari data on-chain", why: "Salah: sangat terlihat — dua trade berlawanan satu blok." },
          ],
        },
        {
          q: "Proteksi paling efektif bagi pengguna ritel terhadap sandwich:",
          options: [
            { text: "Private orderflow — niat transaksi tidak terlihat di mempool publik", why: "Benar: tanpa visibilitas, tidak ada serangan.", correct: true },
            { text: "Menaikkan slippage tolerance", why: "Salah: justru memperbesar ruang ekstraksi." },
            { text: "Swap dalam jumlah sangat kecil selalu", why: "Lemah: tidak praktis dan tetap bisa diserang bila pola berulang." },
            { text: "Memakai DEX dengan volume terbesar", why: "Salah: volume besar tidak menyembunyikan niat individu." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Karena tercatat di blockchain, MEV pasti bisa diberantas total.” Transparansi membuat MEV TERUKUR, bukan otomatis hilang. Selama urutan bisa dibeli dan niat terlihat, insentif ekonominya tetap ada — solusinya desain mekanisme (private orderflow, batch auction), bukan sekadar 'lebih banyak transparansi'.",
      },
      hints: [
        "Uji cepat: jelaskan tiga langkah sandwich + dari mana profitnya berasal.",
        "Ingat: Δy = y·Δx/(x+Δx); slippage = batas rugi; private orderflow = sembunyikan niat.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      reference: "Urutannya bisa dibeli; niatnya jangan dipamerkan.",
    },
  ],
};
