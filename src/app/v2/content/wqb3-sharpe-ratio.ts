import type { V2Lesson } from "../lib/types";

const FIG_SLOPE = `<svg viewBox="0 0 520 300" role="img" aria-label="Diagram sebar return vs volatilitas: strategi Y di garis curam, strategi X di garis landai.">
<g font-family="var(--font-ui)">
<line x1="60" y1="20" x2="60" y2="260" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="60" y1="260" x2="500" y2="260" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="20" y="40" font-size="11" fill="var(--chart-text)">return</text>
<text x="470" y="280" font-size="11" fill="var(--chart-text)">risiko (vol)</text>
<line x1="60" y1="260" x2="420" y2="80" stroke="var(--c1)" stroke-width="2.5"/>
<line x1="60" y1="260" x2="460" y2="210" stroke="var(--c4)" stroke-width="2.5" stroke-dasharray="7 4"/>
<circle cx="168" cy="200" r="7" fill="var(--c1)"/>
<text x="150" y="190" font-size="12" fill="var(--c1)" font-weight="bold">Y</text>
<text x="120" y="225" font-size="11" fill="var(--chart-text)">15% / 8%</text>
<circle cx="380" cy="218" r="7" fill="var(--c4)"/>
<text x="392" y="222" font-size="12" fill="var(--c4)" font-weight="bold">X</text>
<text x="340" y="245" font-size="11" fill="var(--chart-text)">25% / 40%</text>
<text x="250" y="120" font-size="12" fill="var(--c1)" font-weight="bold">kemiringan = Sharpe 1,88</text>
<text x="300" y="200" font-size="12" fill="var(--c4)">kemiringan = Sharpe 0,63</text>
<text x="60" y="295" font-size="11" fill="var(--chart-text)">Sharpe = kemiringan garis dari titik nol: return per unit risiko.</text>
</g>
</svg>`;

const FIG_AMBANG = `<svg viewBox="0 0 520 220" role="img" aria-label="Penggaris Sharpe dengan zona merah, kuning, hijau dan ambang 1,25.">
<g font-family="var(--font-ui)">
<rect x="40" y="80" width="160" height="40" fill="var(--c4)" opacity="0.7"/>
<rect x="200" y="80" width="120" height="40" fill="var(--c3)" opacity="0.7"/>
<rect x="320" y="80" width="160" height="40" fill="var(--c1)" opacity="0.7"/>
<text x="40" y="70" font-size="11" fill="var(--chart-text)">&lt; 1,25 DITOLAK</text>
<text x="210" y="70" font-size="11" fill="var(--chart-text)">1,25–2,0 KANDIDAT</text>
<text x="330" y="70" font-size="11" fill="var(--chart-text)">&gt; 2,0 curigai overfit</text>
<line x1="200" y1="60" x2="200" y2="140" stroke="var(--chart-text)" stroke-width="3"/>
<text x="200" y="160" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">1,25</text>
<text x="200" y="178" font-size="11" fill="var(--chart-text)" text-anchor="middle">gerbang WQB</text>
<text x="60" y="200" font-size="11" fill="var(--chart-text)">Di bawah gerbang = noise. Di atas 2,5 = verifikasi out-of-sample dulu.</text>
</g>
</svg>`;

export const wqb3: V2Lesson = {
  slug: "wqb3-sharpe-ratio",
  track: "WorldQuant Brain",
  module: "Fondasi: Dari Nol",
  title: "WQB3 — Sharpe Ratio dari Nol (dan Kenapa 1,25)",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Strategi 25% yang kalah dari strategi 15%",
      prose: [
        "Komite investasi sebuah dana memeriksa dua strategi untuk dialokasikan modal. Strategi X: return 25% per tahun. Strategi Y: return 15% per tahun. Voting awal 4–1 untuk X — 'selisih 10 poin, tidak perlu dibahas,' kata seorang anggota. Lalu analis risiko menampilkan satu kolom tambahan yang belum dibaca: volatilitas. X: 40% per tahun. Y: 8% per tahun.",
        "Seorang anggota iseng membagi: 25/40 = 0,625 untuk X; 15/8 = 1,875 untuk Y. Ruangan hening. Strategi 'pemenang' X ternyata membayar 0,6 unit return untuk setiap unit risiko yang ditanggung investor — sedangkan Y membayar 1,9 unit. X seperti memanjat dengan tali tambang yang getas; Y seperti menaiki tangga yang kokoh. Voting ulang: 5–0 untuk Y.",
        "Twist-nya: angka return 25% dan 15% keduanya BENAR. Yang salah adalah kesimpulan 'return lebih tinggi = strategi lebih baik'. Return tanpa penyebut risiko = kecepatan tanpa rem. Rasio itulah yang disebut Sharpe ratio — return per unit risiko — dan di WQB ia adalah gerbang pertama yang menentukan hidup-matinya sebuah alpha: di bawah 1,25, simulasi ditolak tanpa diskusi.",
        "Setelah lesson ini kamu bisa: (1) menulis dan mengurai rumus Sharpe ratio simbol per simbol; (2) menghitung Sharpe dari deret return secara manual langkah demi langkah; (3) mengannualisasi Sharpe harian ke tahunan dengan √252; (4) menjelaskan mengapa ambang 1,25 menjadi gerbang kualitas WQB; (5) menyebutkan tiga cara Sharpe tinggi bisa menipu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi satu kalimat",
        body: "Sharpe ratio menjawab: 'untuk setiap unit mimpi buruk (risiko) yang saya tanggung, berapa unit return yang saya dibayar?' Di atas 1 = dibayar lebih dari penderitaannya. Di bawah 1 = menderita lebih dari bayarannya.",
      },
      reference: "Sharpe = return per unit risiko. Gerbang WQB: 1,25.",
    },
    {
      id: "rumus",
      eyebrow: "Langkah 2 · Konsep",
      title: "Rumusnya, dibedah simbol per simbol",
      prose: [
        "Sharpe = rata-rata(excess return) / simpangan baku(excess return). Tiga simbol, tiga makna. R_p = return portofolio/strategi per periode. R_f = risk-free rate — return 'tanpa risiko' (mis. obligasi pemerintah); yang dihitung BUKAN return mentah, melainkan EXCESS return = R_p − R_f, yaitu premi yang dibayar di atas pilihan aman. Pembilang = rata-rata premi itu: 'berapa saya dibayar lebih'. Penyebut = simpangan baku premi: 'seberapa tidak pasti pembayarannya'. Rasio keduanya tak bersatuan — 1,5 berarti 1,5 unit bayaran per 1 unit ketidakpastian.",
        "Contoh terperinci — 5 hari excess return (dalam %): [0,6; −0,4; 0,5; 0,7; −0,4]. Langkah 1, rata-rata pembilang: (0,6 − 0,4 + 0,5 + 0,7 − 0,4)/5 = 1,0/5 = 0,20%. Langkah 2, selisih dari rata-rata: 0,4; −0,6; 0,3; 0,5; −0,6. Langkah 3, kuadratkan: 0,16; 0,36; 0,09; 0,25; 0,36 — jumlah 1,22. Langkah 4, bagi n−1 = 4: 0,305. Langkah 5, akarkan: √0,305 = 0,5523%. Langkah 6, bagi: 0,20 / 0,5523 = 0,362. Inilah Sharpe HARIAN. Langkah 7, annualisasi: 0,362 × √252 = 0,362 × 15,87 = 5,75.",
        "Tunggu — 5,75 terdengar fantastis? Memang: sampel mainan 5 hari tidak mewakili apa pun; alpha nyata diukur dari ribuan hari dan Sharpe tahunan yang sehat berada di 1,25–2,5. Contoh realistis: return 14% per tahun, volatilitas 9%, risk-free 0% → Sharpe = 14/9 = 1,55. Lolos gerbang, tidak fantastis — persis profil alpha yang baik.",
        "Cara membaca figur pertama: sumbu tegak = return, sumbu datar = risiko (volatilitas). Titik Y (15%, 8%) duduk di garis curam; titik X (25%, 40%) di garis landai. Interpretasi: kemiringan garis dari titik nol = Sharpe. Garis Y lebih curam (1,88) daripada garis X (0,63) — Y membayar lebih per unit risiko walau return nominalnya lebih kecil. Figur kedua: penggaris Sharpe. Interpretasi: kiri garis 1,25 = zona merah (ditolak platform); 1,25–2,0 = zona kandidat; di atas 2,0 = hijau tetapi wajib curiga overfit dan verifikasi out-of-sample.",
      ],
      formula: String.raw`\text{Sharpe} = \frac{\bar{R_p - R_f}}{\sigma(R_p - R_f)} \quad ; \quad \text{Sharpe}_{\text{tahunan}} = \text{Sharpe}_{\text{harian}} \times \sqrt{252}`,
      formulaNote: "R_p = return strategi per periode; R_f = risk-free rate; R_p − R_f = excess return (premi di atas pilihan aman); garis atas = rata-rata premi; σ = simpangan baku premi (pembagi n−1). Annualisasi memakai √252 untuk data harian, √12 untuk bulanan.",
      figure: {
        svg: FIG_SLOPE,
        alt: "Diagram return vs risiko: strategi Y di garis curam Sharpe 1,88, strategi X di garis landai Sharpe 0,63.",
        caption: "Sharpe = kemiringan garis. Y (15%/8%) lebih curam — lebih baik — daripada X (25%/40%).",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "'Sharpe 3 = pasti untung.' Tiga penipu klasik: (1) volatilitas nyaris nol — return 3% dengan vol 1% memberi Sharpe 3, tetapi 3%-nya tidak membayar sewa; (2) overfit in-sample — Sharpe 3 di data latih, 0,4 di data baru; (3) tail risk — strategi yang 99% waktunya mulus lalu sesekali rugi besar (menjual asuransi) punya Sharpe 'indah' sampai hari kiamat tiba. Sharpe buta terhadap bentuk distribusi di luar rata-rata dan sebaran.",
      },
      hints: [
        "💡 Pembilang dan penyebut harus dalam satuan periode yang SAMA — jangan bagi rata-rata tahunan dengan vol harian.",
        "💡 Sharpe tak bersatuan: 1,5 dari data harian (setelah annualisasi) sebanding dengan 1,5 dari data bulanan.",
      ],
      reference: "Sharpe = mean(excess)/std(excess); tahunan = harian × √252.",
    },
    {
      id: "ambang",
      eyebrow: "Langkah 3 · Konsep",
      title: "Kenapa gerbangnya 1,25",
      prose: [
        "Angka 1,25 bukan undian. Secara statistik, Sharpe tahunan ≈ t-statistik dari return rata-rata — ukuran 'apakah return ini benar-benar positif atau cuma kebetulan'. Sharpe 1,25 berarti rata-rata return 1,25 simpangan baku di atas nol: cukup jauh dari noise untuk dianggap sinyal, tetapi tidak terlalu jauh hingga mustahil. Platform memakai ambang ini sebagai filter pertama (pemeriksaan LOW_SHARPE): di bawahnya, alpha dianggap tidak bisa dibedakan dari keberuntungan.",
        "Ada alasan bisnisnya juga. Dana yang menampung ratusan alpha membayar biaya transaksi, operasional, dan risiko model untuk setiap alpha. Alpha dengan Sharpe 0,8 mungkin 'sedikit positif', tetapi setelah biaya, ia menjadi beban. Ambang 1,25 memberi margin: cukup tinggi untuk bertahan setelah biaya, cukup realistis untuk dicapai strategi yang benar-benar berisi edge.",
        "Kepribadian konsep ini: 1,25 adalah satpam klub alpha. Ia tidak menilai seberapa keren idemu, seberapa rumit rumusmu, atau seberapa yakin kamu — ia hanya memeriksa KTP (Sharpe). Di bawah 1,25: 'maaf, lain kali.' Di atasnya: 'silakan masuk, pemeriksaan berikutnya: fitness dan turnover.'",
      ],
      figure: {
        svg: FIG_AMBANG,
        alt: "Penggaris Sharpe: merah di bawah 1,25, kuning 1,25 sampai 2,0, hijau di atasnya.",
        caption: "Peta zona Sharpe: <1,25 ditolak · 1,25–2,0 kandidat · >2,0 verifikasi out-of-sample.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "'Sharpe 1,3 di backtest 6 bulan = lolos.' Sharpe dari periode pendek punya error estimasi raksasa: standar error ≈ 1/√Tahun. Sharpe 1,3 dari 6 bulan punya rentang kepercayaan yang mencakup nol — belum tentu positif. Platform menilai dari ribuan hari justru untuk mengecilkan error ini. Jangan merayakan Sharpe dari sampel kecil.",
      },
      hints: [
        "💡 Aturan jempol: butuh ~4 tahun data agar Sharpe 1,25 signifikan secara statistik kasar.",
        "Ingat tiga serangkai penipu Sharpe: vol semu-kecil, overfit, tail risk.",
      ],
      reference: "1,25 = batas sinyal-vs-noise (t-stat) + margin biaya. Sampel kecil = Sharpe belum bisa dipercaya.",
    },
    {
      id: "lab-sharpe",
      eyebrow: "Langkah 4 · Lab",
      title: "Hitung Sharpe dari nol",
      prose: [
        "Implementasikan seluruh rantai: dari 5 angka excess return harian → rata-rata → simpangan baku (n−1) → Sharpe harian → Sharpe tahunan (×√252). Angka target: Sharpe harian ≈ 0,362 dan tahunan ≈ 5,75 — ingat, ini sampel mainan 5 hari; di dunia nyata angka setinggi ini dari sampel sekecil ini = noise, bukan keajaiban.",
        "Eksperimen setelah selesai: ubah satu angka menjadi −2,0 (satu hari buruk). Lihat Sharpe tahunan anjlok — rasakan betapa rapuhnya statistik dari 5 titik data, dan mengapa platform menuntut ribuan hari.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mean`, `std` (pembagi n−1), `sharpe_harian`" },
        { id: "t2", text: "Hitung `sharpe_tahunan` dan pastikan tercetak" },
      ],
      expected: "Sharpe harian: 0.362\nSharpe tahunan: 5.75",
      note: {
        title: "Jebakan satuan",
        type: "pitfall",
        body: "'Mean 0,20% dibagi std 0,5523% = 0,362 — lalu kali 252?' Annualisasi Sharpe memakai AKAR 252, bukan 252. Mean tumbuh linear dengan waktu, tetapi std tumbuh dengan akar waktu — sehingga rasionya tumbuh dengan akar waktu. Kali 252 memberi 91,3: angka fantasi.",
      },
      hints: [
        "std = sqrt(sum((x-mean)^2)/(n-1)).",
        "sharpe_tahunan = sharpe_harian * sqrt(252).",
      ],
      code: {
        starter: "import math  # (JANGAN UBAH)\nexcess = [0.6, -0.4, 0.5, 0.7, -0.4]  # % harian, JANGAN UBAH\n\n# TULIS KODEMU\nmean = \nvar = \nstd = math.sqrt(var)\nsharpe_harian = \nsharpe_tahunan = \nprint(f\"Sharpe harian: {sharpe_harian:.3f}\")\nprint(f\"Sharpe tahunan: {sharpe_tahunan:.2f}\")\n",
        lockLines: 2,
        solution: "import math  # (JANGAN UBAH)\nexcess = [0.6, -0.4, 0.5, 0.7, -0.4]  # % harian, JANGAN UBAH\n\n# TULIS KODEMU\nmean = sum(excess) / len(excess)\nvar = sum((x - mean) ** 2 for x in excess) / (len(excess) - 1)\nstd = math.sqrt(var)\nsharpe_harian = mean / std\nsharpe_tahunan = sharpe_harian * math.sqrt(252)\nprint(f\"Sharpe harian: {sharpe_harian:.3f}\")\nprint(f\"Sharpe tahunan: {sharpe_tahunan:.2f}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "`sharpe_harian` ≈ 0,362", msg: "0,20 / 0,5523.", name: "sharpe_harian", value: 0.36214, tol: 0.001 },
          { kind: "equal", task: "t2", label: "`sharpe_tahunan` ≈ 5,75", msg: "Harian × √252.", name: "sharpe_tahunan", value: 5.749, tol: 0.01 },
          { kind: "stdout_matches", task: "t2", label: "Cetak Sharpe tahunan", msg: "Format 2 desimal.", pattern: "Sharpe tahunan: 5\\.75" }
        ],
      },
      reference: "Rantai lengkap: mean → std (n−1) → bagi → ×√252.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Sharpe keluar: lalu apa",
      prose: [
        "Satu: Sharpe 0,9 → di bawah gerbang; jangan tuning settings, perbaiki sinyalnya atau ganti ide. Dua: Sharpe 1,6 → lolos gerbang; lanjut ke pemeriksaan fitness dan turnover (gerbang 1 bukan satu-satunya). Tiga: Sharpe 2,8 dari backtest 1 tahun → curigai overfit; wajib verifikasi out-of-sample sebelum percaya. Empat: Sharpe negatif kecil (−0,2) → jangan langsung dibuang; balik logika sinyalnya (long↔short) dan uji lagi — sinyal terbalik yang konsisten = alpha yang belum dibalik.",
        "Aturan praktis 10 detik: di bawah 1,25 = kembali ke papan gambar. 1,25–2,0 = kandidat, lanjutkan pemeriksaan. Di atas 2,5 = curigai overfit, buktikan di data baru.",
      ],
      tasks: [],
      note: {
        title: "💡 Trik peneliti senior",
        body: "Simpan 'Sharpe negatif yang konsisten' di buku catatan sebagai kandidat balik-arah. Banyak alpha lahir dari sinyal yang 'salah arah' — membaliknya lebih murah daripada menemukan sinyal baru. Syaratnya: negatifnya KONSISTEN, bukan noise di sekitar nol.",
      },
      reference: "<1,25 perbaiki ide · 1,25–2,0 kandidat · >2,5 verifikasi out-of-sample.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Alpha 'tenang': 12% dengan vol 7%",
      prose: [
        "Data: sebuah alpha obligasi-korporasi versi saham: return 12% per tahun, volatilitas 7% per tahun, risk-free 2%. Manajer bertanya: 'return-nya kecil, layak modal?'",
        "Pertanyaan: hitung Sharpe dan putuskan. Pembahasan: excess return = 12% − 2% = 10%. Sharpe = 10/7 = 1,43. Lolos gerbang 1,25 — lampu hijau pertama menyala. Pelajaran angkanya: return 12% yang 'kecil' mengalahkan return 25% ber-volatilitas 40% (Sharpe 0,63) karena penyebutnya jauh lebih kecil. Keputusan: kandidat — lanjutkan ke pemeriksaan fitness (butuh return dan turnover) dan drawdown. Catatan jujur: Sharpe 1,43 belum 'aman'; ia baru izin masuk ke pemeriksaan berikutnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Sharpe 1,43 dari 2 tahun data punya standar error ≈ 1/√2 = 0,71 — rentang kepercayaannya mencakup 0,7 hingga 2,1. Artinya 'lolos 1,25' belum kokoh. Inilah mengapa platform memakai ribuan hari: memperkecil error estimasi sampai keputusan 'lolos' benar-benar berarti.",
      },
      reference: "Excess 10% / vol 7% = Sharpe 1,43: lolos gerbang, lanjut pemeriksaan berikutnya.",
    },
    {
      id: "lab-duel",
      eyebrow: "Langkah 7 · Lab",
      title: "Duel: return tinggi vs Sharpe tinggi",
      prose: [
        "Dua strategi, 12 bulan data. Strategi A: tenang (volatilitas bulanan 0,67%). Strategi B: liar (volatilitas 3,49%) dengan return rata-rata 3× lipat. Tugasmu: hitung Sharpe tahunan keduanya dari data bulanan (annualisasi ×√12) dan putuskan mana yang lolos ambang 1,25.",
        "Eksperimen setelah selesai: naikkan semua return B sebesar 1% per bulan — apakah Sharpe-nya mengejar A? Rasakan betapa mahalnya volatilitas: return harus naik BERKALI-KALI LIPAT untuk menebus vol 5× lipat.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `sharpe_ann_bulanan(rets)` = mean/stdev × √12" },
        { id: "t2", text: "Cetak Sharpe A & B + verdict lolos ambang 1,25" },
      ],
      expected: "A: Sharpe 2.12 -> LOLOS\nB: Sharpe 1.16 -> GAGAL",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Return 3× lipat pasti menang.” Volatilitas 5× lipat memakan semuanya: Sharpe B (1,16) di bawah ambang walau return-nya jauh lebih besar. Inilah kenapa meja review membaca Sharpe, bukan return.",
      },
      hints: [
        "statistics.mean / statistics.stdev sudah tersedia via import.",
        "Data bulanan → annualisasi dengan 12**0.5, bukan 252**0.5.",
      ],
      code: {
        starter: "import statistics\n# Return BULANAN 12 bulan. JANGAN UBAH.\nA = [0.008, -0.004, 0.012, 0.006, -0.002, 0.010,\n     0.004, -0.006, 0.014, 0.002, 0.008, -0.003]\nB = [0.03, -0.02, 0.05, -0.01, 0.04, -0.03,\n     0.02, 0.06, -0.04, 0.01, 0.05, -0.02]\n\n# TULIS KODEMU\ndef sharpe_ann_bulanan(rets):\n    return  # mean/stdev * sqrt(12)\n\nfor nama, r in ((\"A\", A), (\"B\", B)):\n    s = sharpe_ann_bulanan(r)\n    print(f\"{nama}: Sharpe {s:.2f} -> {'LOLOS' if s >= 1.25 else 'GAGAL'}\")\n",
        lockLines: 7,
        solution: "import statistics\n# Return BULANAN 12 bulan. JANGAN UBAH.\nA = [0.008, -0.004, 0.012, 0.006, -0.002, 0.010,\n     0.004, -0.006, 0.014, 0.002, 0.008, -0.003]\nB = [0.03, -0.02, 0.05, -0.01, 0.04, -0.03,\n     0.02, 0.06, -0.04, 0.01, 0.05, -0.02]\n\n# TULIS KODEMU\ndef sharpe_ann_bulanan(rets):\n    return statistics.mean(rets) / statistics.stdev(rets) * (12 ** 0.5)\n\nfor nama, r in ((\"A\", A), (\"B\", B)):\n    s = sharpe_ann_bulanan(r)\n    print(f\"{nama}: Sharpe {s:.2f} -> {'LOLOS' if s >= 1.25 else 'GAGAL'}\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "fungsi `sharpe_ann_bulanan` ada", msg: "Definisikan def sharpe_ann_bulanan(rets).", name: "sharpe_ann_bulanan" },
          { kind: "stdout_matches", task: "t2", label: "A lolos 2,12", msg: "A tenang: Sharpe 2,12.", pattern: "A: Sharpe 2\\.12 -> LOLOS" },
          { kind: "stdout_matches", task: "t2", label: "B gagal 1,16", msg: "B liar: return 3× lipat tetapi Sharpe 1,16.", pattern: "B: Sharpe 1\\.16 -> GAGAL" }
        ],
      },
      reference: "Volatilitas 5× lipat tidak bisa ditebus return 3× lipat.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Bedakan yang paham rumus dari yang hafal rumus — perhatikan penipu Sharpe.",
      ],
      tasks: [],
      summary: [
        "Sharpe = rata-rata(excess return) / simpangan baku(excess return) — return per unit risiko.",
        "Excess return = R_p − R_f: premi di atas pilihan aman, bukan return mentah.",
        "Annualisasi: Sharpe tahunan = Sharpe harian × √252 (akar, bukan linear).",
        "Gerbang WQB 1,25 = batas sinyal-vs-noise + margin biaya.",
        "Waspadai: vol semu-kecil, overfit in-sample, tail risk, dan sampel kecil.",
      ],
      quiz: [
        {
          q: "Excess return harian: [0,6; −0,4; 0,5; 0,7; −0,4]%. Sharpe hariannya?",
          options: [
            { text: "≈ 0,362  (0,20 / 0,5523)", why: "Benar — mean 0,20%, std sampel 0,5523%.", correct: true },
            { text: "≈ 0,405  (0,20 / 0,4937)", why: "Itu memakai pembagi n (populasi), bukan n−1 (sampel) — 0,4937 salah konvensi." },
            { text: "≈ 5,75", why: "Itu Sharpe TAHUNAN (0,362 × √252); yang ditanya harian." }
          ],
        },
        {
          q: "Mengapa annualisasi Sharpe memakai √252, bukan 252?",
          options: [
            { text: "Mean tumbuh linear dengan waktu, std tumbuh dengan akar waktu", why: "Tepat — rasio keduanya tumbuh dengan akar waktu.", correct: true },
            { text: "252 terlalu besar sehingga angkanya tidak bagus", why: "Bukan soal estetika — ini matematika difusi: varians linear, std akar." },
            { text: "Karena 252 = 12 × 21, faktor bulan", why: "Tidak relevan — √252 khusus data harian; data bulanan pakai √12." }
          ],
        },
        {
          q: "Strategi A: return 3%, vol 1% (Sharpe 3). Strategi B: return 18%, vol 12% (Sharpe 1,5). Mana benar?",
          options: [
            { text: "Sharpe A lebih tinggi, tetapi return 3% mungkin tidak menutup biaya — Sharpe bukan satu-satunya kriteria", why: "Benar — Sharpe tinggi dari vol mungil bisa berarti return absolut tak ekonomis.", correct: true },
            { text: "A pasti lebih baik karena Sharpe 3 > 1,5", why: "Jebakan 'Sharpe tinggi = pasti untung': vol 1% dengan return 3% = alpha yang tak membayar sewa." },
            { text: "B pasti lebih baik karena return 18% > 3%", why: "Kembali ke kesalahan cerita pembuka: return tanpa penyebut risiko." }
          ],
        },
        {
          q: "Apa makna statistik ambang 1,25?",
          options: [
            { text: "Sharpe tahunan ≈ t-statistik: 1,25 cukup jauh dari nol untuk dianggap sinyal, bukan noise", why: "Tepat — plus margin biaya operasional.", correct: true },
            { text: "Angka arbitrer dari undian platform", why: "Bukan arbitrer — berakar pada uji signifikansi dan ekonomi biaya." },
            { text: "Artinya return pasti 125% per tahun", why: "Salah satuan total: Sharpe tak bersatuan, bukan persen return." }
          ],
        },
        {
          q: "Backtest 6 bulan menghasilkan Sharpe 2,2. Respons tepat?",
          options: [
            { text: "Curigai error estimasi besar — verifikasi di periode lebih panjang/out-of-sample", why: "Benar — standar error dari 6 bulan ≈ 1,41; 2,2 belum kokoh.", correct: true },
            { text: "Langsung submit — 2,2 jauh di atas 1,25", why: "Jebakan sampel kecil: merayakan noise sebagai alpha." },
            { text: "Tolak — Sharpe di atas 2,0 pasti overfit", why: "Terlalu sinis: >2,0 = curigai dan verifikasi, bukan tolak otomatis." }
          ],
        }
      ],
      reference: "Sharpe = mean(excess)/std(excess); ×√252; gerbang 1,25; waspadai penipunya.",
    },
  ],
};
