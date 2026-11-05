import type { V2Lesson } from "../lib/types";

const FIG_ANATOMI = `<svg viewBox="0 0 520 300" role="img" aria-label="Diagram anatomi satu simulasi: expression dan settings masuk ke mesin simulasi, keluar tiga metrik.">
<g font-family="var(--font-ui)">
<rect x="20" y="30" width="150" height="90" rx="8" fill="var(--c1)" opacity="0.85"/>
<text x="95" y="58" font-size="13" fill="#fff" text-anchor="middle" font-weight="bold">EXPRESSION</text>
<text x="95" y="80" font-size="11" fill="#fff" text-anchor="middle">rank(ts_mean(</text>
<text x="95" y="96" font-size="11" fill="#fff" text-anchor="middle">close,5)-close)</text>
<rect x="20" y="150" width="150" height="120" rx="8" fill="var(--c2)" opacity="0.85"/>
<text x="95" y="178" font-size="13" fill="#fff" text-anchor="middle" font-weight="bold">SETTINGS</text>
<text x="95" y="200" font-size="11" fill="#fff" text-anchor="middle">region: USA</text>
<text x="95" y="216" font-size="11" fill="#fff" text-anchor="middle">universe: TOP3000</text>
<text x="95" y="232" font-size="11" fill="#fff" text-anchor="middle">delay: 1 · decay: 5</text>
<text x="95" y="248" font-size="11" fill="#fff" text-anchor="middle">neutral: subindustry</text>
<rect x="220" y="90" width="130" height="120" rx="8" fill="var(--c3)" opacity="0.9"/>
<text x="285" y="140" font-size="13" fill="#fff" text-anchor="middle" font-weight="bold">MESIN</text>
<text x="285" y="162" font-size="13" fill="#fff" text-anchor="middle" font-weight="bold">SIMULASI</text>
<text x="285" y="184" font-size="11" fill="#fff" text-anchor="middle">WQB</text>
<line x1="170" y1="75" x2="220" y2="120" stroke="var(--chart-text)" stroke-width="2" marker-end="url(#ah)"/>
<line x1="170" y1="210" x2="220" y2="170" stroke="var(--chart-text)" stroke-width="2" marker-end="url(#ah)"/>
<rect x="390" y="30" width="110" height="70" rx="8" fill="var(--c4)" opacity="0.9"/>
<text x="445" y="56" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold">Sharpe</text>
<text x="445" y="76" font-size="11" fill="#fff" text-anchor="middle">1,62</text>
<rect x="390" y="115" width="110" height="70" rx="8" fill="var(--c4)" opacity="0.9"/>
<text x="445" y="141" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold">Fitness</text>
<text x="445" y="161" font-size="11" fill="#fff" text-anchor="middle">1,03</text>
<rect x="390" y="200" width="110" height="70" rx="8" fill="var(--c4)" opacity="0.9"/>
<text x="445" y="226" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold">Turnover</text>
<text x="445" y="246" font-size="11" fill="#fff" text-anchor="middle">32%</text>
<line x1="350" y1="120" x2="390" y2="65" stroke="var(--chart-text)" stroke-width="2"/>
<line x1="350" y1="150" x2="390" y2="150" stroke="var(--chart-text)" stroke-width="2"/>
<line x1="350" y1="180" x2="390" y2="235" stroke="var(--chart-text)" stroke-width="2"/>
<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--chart-text)"/></marker></defs>
</g>
</svg>`;

const FIG_RANK = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang skor sinyal versus return aktual lima saham: urutan keduanya selaras.">
<g font-family="var(--font-ui)">
<text x="20" y="20" font-size="12" fill="var(--chart-text)" font-weight="bold">Skor sinyal (prediksi)</text>
<rect x="40" y="40" width="60" height="150" fill="var(--c1)" opacity="0.85"/>
<rect x="130" y="70" width="60" height="120" fill="var(--c1)" opacity="0.7"/>
<rect x="220" y="100" width="60" height="90" fill="var(--c1)" opacity="0.55"/>
<rect x="310" y="130" width="60" height="60" fill="var(--c1)" opacity="0.4"/>
<rect x="400" y="160" width="60" height="30" fill="var(--c1)" opacity="0.25"/>
<text x="70" y="210" font-size="11" fill="var(--chart-text)" text-anchor="middle">A 0,9</text>
<text x="160" y="210" font-size="11" fill="var(--chart-text)" text-anchor="middle">B 0,7</text>
<text x="250" y="210" font-size="11" fill="var(--chart-text)" text-anchor="middle">C 0,5</text>
<text x="340" y="210" font-size="11" fill="var(--chart-text)" text-anchor="middle">D 0,3</text>
<text x="430" y="210" font-size="11" fill="var(--chart-text)" text-anchor="middle">E 0,1</text>
<text x="20" y="238" font-size="12" fill="var(--chart-text)" font-weight="bold">Return aktual minggu depan: +4% · +2% · 0% · -1% · -3%</text>
<text x="20" y="256" font-size="11" fill="var(--chart-text)">Urutan skor = urutan return: A &gt; B &gt; C &gt; D &gt; E. Inilah alpha.</text>
</g>
</svg>`;

export const wqb1: V2Lesson = {
  slug: "wqb1-apa-itu-alpha",
  track: "WorldQuant Brain",
  module: "Fondasi: Dari Nol",
  title: "WQB1 — Apa Itu Alpha & Anatomi Satu Simulasi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua angka 20% yang hanya satu alpha",
      prose: [
        "Di sebuah tim riset alpha, dua strategi diajukan ke komite review pada minggu yang sama. Strategi pertama: setiap hari memeringkat 3.000 saham AS dari yang paling 'murah' ke paling 'mahal' menurut sebuah rumus, lalu membeli 100 saham termurah dan menjual short 100 saham termahal. Backtest 10 tahun: return 20% per tahun, dengan eksposur bersih terhadap pasar mendekati nol. Strategi kedua: 'beli indeks saat tren naik' dengan leverage 2x. Backtest 10 tahun yang sama: return 20% per tahun juga.",
        "Komite awalnya mengangguk untuk keduanya — angka 20% memang menggoda. Lalu seseorang membuka lembar yang jarang dibaca: komposisi return. Strategi pertama menghasilkan 20% nyaris tanpa mengikuti naik-turunnya pasar. Strategi kedua menghasilkan 20% karena pasarnya sendiri sedang naik 10% per tahun dan leverage menggandakannya. Tahun ketika pasar turun 10%, strategi kedua rugi 20%. Strategi pertama? Tetap untung — karena keuntungannya datang dari selisih peringkat antar saham, bukan dari arah pasar.",
        "Twist-nya: kedua angka 20% itu BENAR. Yang salah adalah maknanya. Hanya strategi pertama yang disebut alpha: kemampuan memprediksi PERINGKAT return relatif antar saham — saham mana mengalahkan saham mana — terlepas dari pasar naik atau turun. Strategi kedua hanyalah beta ber-leverage: taruhan arah pasar yang dibungkus jargon. Di WorldQuant Brain (WQB), platform riset kuantitatif tempat alpha diuji lewat simulasi, yang dinilai adalah alpha — bukan beta.",
        "Setelah lesson ini kamu bisa: (1) mendefinisikan alpha sebagai prediksi peringkat return relatif antar saham, bukan prediksi arah harga; (2) membedakan alpha dari beta dengan satu pertanyaan kunci; (3) menguraikan anatomi satu simulasi WQB — expression, settings, dan metrik hasil; (4) membaca tiga metrik utama output simulasi (Sharpe, fitness, turnover) dan tahu ambang lolosnya.",
      ],
      tasks: [],
      note: {
        title: "Pertanyaan satu kalimat",
        body: "'Kalau pasar turun 20% tahun depan, strategi ini masih menghasilkan uang?' Kalau jawabannya 'tidak' — itu beta, bukan alpha. Alpha hidup dari perbedaan antar saham; beta hidup dari arah pasar.",
      },
      reference: "Alpha = peringkat relatif antar saham. Beta = arah pasar.",
    },
    {
      id: "definisi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Alpha, si peramal peringkat",
      prose: [
        "Definisi kerja yang dipakai tim riset alpha: alpha adalah sinyal — sebuah skor untuk setiap saham — yang urutannya selaras dengan urutan return aktual di masa depan. Skor tidak harus menebak angka return-nya; cukup menebak URUTANNYA. Saham berskor tertinggi idealnya menjadi saham ber-return tertinggi, skor terendah menjadi return terendah. Selisih antara keduanya itulah yang dipanen menjadi keuntungan lewat posisi long-short.",
        "Contoh terperinci. Lima saham A–E. Sinyal memberi skor: A 0,9 · B 0,7 · C 0,5 · D 0,3 · E 0,1. Seminggu kemudian return aktual: A +4% · B +2% · C 0% · D −1% · E −3%. Bandingkan urutannya: skor tertinggi (A) → return tertinggi (+4%); skor terendah (E) → return terendah (−3%). Lima-limanya selaras — ini alpha yang sempurna. Sekarang ubah return aktual menjadi: A +4% · B −3% · C +2% · D 0% · E +1%. Skornya sama, tetapi urutan return acak terhadap skor — sinyal ini bukan alpha, walau rata-rata returnnya positif. Pelajarannya: alpha diukur dari KESELARASAN PERINGKAT, bukan dari besar return.",
        "Cara membaca figur: lima batang = skor sinyal lima saham, dari tertinggi (A) ke terendah (E). Interpretasi: baris return aktual di bawahnya menunjukkan urutan yang sama persis — A > B > C > D > E. Keselarasan sempurna seperti ini langka di dunia nyata; yang dicari platform adalah keselarasan yang cukup konsisten selama ribuan hari, bukan sempurna.",
        "Kepribadian konsep ini: alpha itu seperti juri lomba lari yang tidak perlu tahu catatan waktu tiap pelari — cukup menebak urutan finis dengan benar. Juri yang urutan tebakannya sering benar, itulah yang dibayar.",
      ],
      formula: String.raw`\text{Kualitas alpha} \approx \text{korelasi peringkat}(\text{skor sinyal}, \text{return aktual})`,
      formulaNote: "Korelasi peringkat (rank correlation): +1 = urutan selalu selaras (alpha sempurna), 0 = tebakan acak (bukan alpha), −1 = selalu terbalik (sinyal terbalik — dibalik menjadi alpha). Platform mengukur ini dalam skala ribuan saham × ribuan hari.",
      figure: {
        svg: FIG_RANK,
        alt: "Batang skor sinyal lima saham menurun dari A ke E, dengan return aktual yang urutannya selaras.",
        caption: "Alpha = keselarasan peringkat. Skor (batang) dan return aktual (teks) berurutan sama: A > B > C > D > E.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "'Alpha = return tinggi.' Bukan. Reksa dana indeks ber-leverage bisa mencetak return 30% di tahun bull tanpa setetes pun alpha. Alpha = return yang TIDAK bisa dijelaskan oleh naik-turunnya pasar — return dari keahlian memilih, bukan dari keberanian bertaruh arah.",
      },
      hints: [
        "Uji cepat: long-short yang netral pasar masih untung? Itu alpha.",
        "Skor sinyal tidak harus memprediksi angka return — urutannya yang penting.",
      ],
      reference: "Alpha diukur dari keselarasan peringkat skor vs return, bukan besar return.",
    },
    {
      id: "anatomi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Anatomi satu simulasi: tiga organ",
      prose: [
        "Setiap simulasi di WQB punya tiga organ. Organ pertama: EXPRESSION — rumus matematika sinyal yang ditulis dalam bahasa FASTEXPR, misalnya rank(ts_mean(close,5)-close). Inilah 'otak' alpha: mengubah data mentah menjadi skor per saham per hari. Organ kedua: SETTINGS — kondisi laboratoriumnya: region (wilayah pasar, mis. USA), universe (kumpulan saham, mis. TOP3000), delay (jeda eksekusi, mis. 1 hari), decay (kecepatan peluruhan sinyal), dan neutralization (pembersih bias pasar). Organ ketiga: METRIK HASIL — rapornya: Sharpe ratio (return per unit risiko), fitness (skor kualitas gabungan), turnover (seberapa sering posisi berganti), plus return, drawdown, dan margin.",
        "Analoginya seperti uji coba resep masakan: expression = resepnya, settings = dapur dan aturannya (kompor apa, berapa lama), metrik = penilaian juri. Resep hebat di dapur yang salah tetap gagal — dan juri tidak menilai niat, hanya hidangan akhir. Karena itu peneliti alpha tidak pernah membahas expression tanpa menyebut settings-nya: angka Sharpe tanpa konteks settings = angka tanpa makna.",
        "Cara membaca figur: dua kotak kiri adalah INPUT — Expression (rumus) dan Settings (region, universe, delay, decay, neutralization). Keduanya masuk ke kotak tengah, Mesin Simulasi WQB, yang mensimulasikan jual-beli harian selama bertahun-tahun. Tiga kotak kanan adalah OUTPUT — Sharpe, Fitness, Turnover. Interpretasi: alur ini satu arah; mengubah satu settings (mis. delay 0 → 1) bisa mengubah seluruh output walau expression-nya identik.",
        "Tiga ambang yang menentukan nasib: Sharpe ≥ 1,25 (gerbang kualitas), fitness > 1,0 (syarat lolos), turnover ≤ 70% (batas biaya). Tiga lampu harus hijau bersamaan — satu merah, alpha kembali ke papan gambar.",
      ],
      figure: {
        svg: FIG_ANATOMI,
        alt: "Diagram alir: Expression dan Settings masuk ke Mesin Simulasi WQB, keluar Sharpe, Fitness, Turnover.",
        caption: "Satu simulasi = Expression + Settings → Mesin Simulasi → Sharpe / Fitness / Turnover.",
      },
      tasks: [],
      note: {
        title: "💡 Kebiasaan peneliti senior",
        body: "Selalu catat settings bersama expression — 'rank(ts_mean(close,5)-close) | USA TOP3000 D1 decay5 subindustry'. Dua peneliti dengan expression sama tetapi settings beda sedang menguji dua alpha yang berbeda. Buku catatan yang rapi menghemat minggu debugging.",
      },
      hints: [
        "Expression menjawab 'APA sinyalnya'; settings menjawab 'DI MANA dan BAGAIMANA diujinya'.",
        "Hafalkan tiga ambang: Sharpe 1,25 · fitness 1,0 · turnover 70%.",
      ],
      reference: "Simulasi = expression + settings → metrik. Angka tanpa settings = angka tanpa makna.",
    },
    {
      id: "lab-kendall",
      eyebrow: "Langkah 4 · Lab",
      title: "Mengukur keselarasan peringkat",
      prose: [
        "Ukur sendiri seberapa 'alpha' sebuah sinyal: diberi skor 6 saham dan return aktualnya, hitung pasangan yang selaras — untuk setiap pasangan saham, apakah urutan skornya sama dengan urutan returnnya? 15 pasangan, 11 selaras = 73,3%. Di atas 60% untuk sampel kecil seperti ini menandakan sinyal berisi alpha; di platform nyata, pengujian yang sama dilakukan atas ribuan saham dan ribuan hari.",
        "Perhatikan saham ke-4 (skor 0,4, return +4%): ia 'mengkhianati' urutan — skor menengah tetapi return tertinggi kedua. Satu pengkhianat seperti ini wajar; alpha tidak butuh sempurna, butuh konsisten. Eksperimen setelah selesai: ubah return saham ke-4 menjadi −5% dan lihat skor keselarasan melonjak — lalu renungkan, seberapa rapuh sinyal yang bergantung pada satu saham?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `selaras`: jumlah pasangan (i,j) dengan urutan skor == urutan return" },
        { id: "t2", text: "Jalankan dan pastikan verdict tercetak" },
      ],
      expected: "Pasangan selaras: 11/15 (73.3%) -> sinyal BERISI alpha",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "'Korelasi skor-return tinggi = alpha bagus, selesai.' Korelasi peringkat yang dihitung dari 6 saham dan 1 minggu = noise statistik. Platform menuntut konsistensi lintas ribuan hari justru karena sampel kecil mudah menipu. Jangan jatuh cinta pada backtest mini.",
      },
      hints: [
        "Untuk tiap pasangan i<j: selaras jika (skor[i]-skor[j]) dan (ret[i]-ret[j]) bertanda sama.",
        "total pasangan = n*(n-1)/2 = 15 untuk 6 saham.",
      ],
      code: {
        starter: "# Skor sinyal & return aktual 6 saham (JANGAN UBAH).\nskor = [0.9, 0.7, 0.5, 0.4, 0.2, 0.1]\nret  = [0.05, 0.03, -0.01, 0.04, -0.02, 0.01]\n\n# TULIS KODEMU: hitung pasangan selaras\nselaras = 0\ntotal = 0\nfor i in range(len(skor)):\n    for j in range(i + 1, len(skor)):\n        total += 1\n        if :\n            selaras += 1\npct = selaras / total * 100\nprint(f\"Pasangan selaras: {selaras}/{total} ({pct:.1f}%) -> {'sinyal BERISI alpha' if pct > 60 else 'BUKAN alpha'}\")\n",
        lockLines: 3,
        solution: "# Skor sinyal & return aktual 6 saham (JANGAN UBAH).\nskor = [0.9, 0.7, 0.5, 0.4, 0.2, 0.1]\nret  = [0.05, 0.03, -0.01, 0.04, -0.02, 0.01]\n\n# TULIS KODEMU: hitung pasangan selaras\nselaras = 0\ntotal = 0\nfor i in range(len(skor)):\n    for j in range(i + 1, len(skor)):\n        total += 1\n        if (skor[i] - skor[j]) * (ret[i] - ret[j]) > 0:\n            selaras += 1\npct = selaras / total * 100\nprint(f\"Pasangan selaras: {selaras}/{total} ({pct:.1f}%) -> {'sinyal BERISI alpha' if pct > 60 else 'BUKAN alpha'}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "`selaras` = 11", msg: "11 dari 15 pasangan urutannya selaras.", name: "selaras", value: 11, tol: 1e-09 },
          { kind: "stdout_matches", task: "t2", label: "Verdict tercetak benar", msg: "11/15 = 73,3% > 60%.", pattern: "Pasangan selaras: 11/15 \\(73\\.3%\\) -> sinyal BERISI alpha" }
        ],
      },
      reference: "Alpha diukur, bukan dirasakan: hitung keselarasan peringkat skor vs return.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Baru dapat hasil simulasi: baca apa dulu",
      prose: [
        "Satu: Sharpe 0,9, fitness 0,7 → di bawah kedua gerbang. Jangan sentuh settings dulu; sinyalnya sendiri lemah. Kembali ke ide. Dua: Sharpe 2,1, turnover 78% → sinyal kuat tetapi biaya membunuh; naikkan decay atau haluskan sinyal sebelum bicara submit. Tiga: Sharpe 1,6, fitness 1,8, turnover 25% → tiga lampu hijau; kandidat submit, lanjut cek korelasi dengan alpha lain. Empat: return 30% tetapi Sharpe 1,1 → return tinggi dari volatilitas tinggi; tolak, ini beta berbaju alpha.",
        "Aturan praktis 10 detik: Sharpe ≥ 1,25 DAN fitness > 1,0 DAN turnover ≤ 70% — tiga lampu hijau baru bicara submit. Satu lampu merah = kembali bekerja, bukan kembali berharap.",
      ],
      tasks: [],
      note: {
        title: "💡 Urutan baca rapor",
        body: "Baca turnover DULU sebelum Sharpe. Turnover > 70% membuat Sharpe berapa pun tidak relevan — seperti menilai kecepatan mobil yang bannya bocor. Urutan: turnover → Sharpe → fitness → sisanya.",
      },
      reference: "Tiga lampu hijau (Sharpe, fitness, turnover) baru bicara submit.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Alpha 'murah-menang': lolos atau tidak",
      prose: [
        "Data: expression rank(ts_mean(close,20)-close), settings USA TOP3000, delay 1, decay 5, neutralization subindustry. Hasil 10 tahun: return 14% per tahun, volatilitas 9% per tahun → Sharpe ≈ 1,55. Turnover 35%. Fitness ≈ 1,55 × √(14/35) = 1,55 × 0,63 = 0,98.",
        "Pertanyaan: lolos submit? Pembahasan: Sharpe 1,55 melewati gerbang 1,25 — lampu hijau pertama. Turnover 35% di bawah 70% — lampu hijau kedua. Tetapi fitness 0,98 di bawah 1,0 — lampu merah ketiga. Keputusan: BELUM lolos. Pelajaran angkanya: turnover 35% 'memakan' sepertiga lebih dari nilai Sharpe lewat akar kuadrat di rumus fitness. Opsi perbaikan: naikkan decay (mis. 5 → 10) untuk menekan turnover ke ~22% → fitness ≈ 1,55 × √(14/22) = 1,24 → lolos. Inilah cara peneliti berpikir: bukan 'tambah return', melainkan 'kecilkan biaya'.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Alpha yang 'hampir lolos' adalah yang paling berbahaya: godaannya adalah mengutak-atik settings sampai angkanya lewat (overfitting), bukan memperbaiki sinyalnya. Aturan tim: maksimal tiga putaran tuning per ide; setelah itu ganti ide, bukan ganti parameter.",
      },
      reference: "Fitness 0,98 < 1,0: Sharpe lolos, biaya menggagalkan. Obati turnover, bukan return.",
    },
    {
      id: "lab-ekspresi",
      eyebrow: "Langkah 7 · Lab",
      title: "Bedah ekspresi: operator apa saja?",
      prose: [
        "Anatomi tanpa praktik = hafalan. Tiga ekspresi FASTEXPR nyata di bawah — tugasmu menulis 'pembedah' yang mengenali operator apa saja dipakai tiap ekspresi (operator muncul sebagai nama diikuti kurung buka). Ini keterampilan membaca paling dasar: sebelum menilai sebuah alpha, kenali dulu organ-organnya.",
        "Eksperimen setelah selesai: tambahkan ekspresi keempat buatanmu sendiri (mis. rank(ts_std_dev(returns,20))) dan lihat pembedah mengenalinya.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `bedah(e)` → daftar operator yang muncul sebagai `nama(`" },
        { id: "t2", text: "Jalankan pada 3 ekspresi dan pastikan hitungan tercetak" },
      ],
      expected: "2 operator: rank, ts_mean\n2 operator: rank, ts_corr\n3 operator: rank, ts_decay_linear, group_neutralize",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Mencari substring 'rank' saja cukup.” Tidak — 'rank' juga muncul di dalam kata lain. Syarat kemunculan operator = nama diikuti '(' — persis seperti sintaks pemanggilan fungsi.",
      },
      hints: [
        "Cek `o + \"(\" in e` untuk tiap operator o.",
        "Kembalikan daftar sesuai urutan OPERATOR.",
      ],
      code: {
        starter: "# Tiga ekspresi FASTEXPR. JANGAN UBAH.\nekspresi = [\n    \"rank(ts_mean(close,5)-close)\",\n    \"0.5*rank(ts_corr(high,low,60))+0.5*rank(-ts_corr(est_epsr,est_fcf,30))\",\n    \"group_neutralize(rank(ts_decay_linear(returns,4)), subindustry)\",\n]\nOPERATOR = [\"rank\", \"ts_mean\", \"ts_corr\", \"ts_decay_linear\", \"ts_backfill\",\n            \"group_neutralize\", \"ts_delay\", \"ts_std_dev\"]\n\n# TULIS KODEMU\ndef bedah(e):\n    return  # daftar operator yang muncul sebagai nama(\n\nfor e in ekspresi:\n    ketemu = bedah(e)\n    print(f\"{len(ketemu)} operator: {', '.join(ketemu)}\")\n",
        lockLines: 8,
        solution: "# Tiga ekspresi FASTEXPR. JANGAN UBAH.\nekspresi = [\n    \"rank(ts_mean(close,5)-close)\",\n    \"0.5*rank(ts_corr(high,low,60))+0.5*rank(-ts_corr(est_epsr,est_fcf,30))\",\n    \"group_neutralize(rank(ts_decay_linear(returns,4)), subindustry)\",\n]\nOPERATOR = [\"rank\", \"ts_mean\", \"ts_corr\", \"ts_decay_linear\", \"ts_backfill\",\n            \"group_neutralize\", \"ts_delay\", \"ts_std_dev\"]\n\n# TULIS KODEMU\ndef bedah(e):\n    return [o for o in OPERATOR if o + \"(\" in e]\n\nfor e in ekspresi:\n    ketemu = bedah(e)\n    print(f\"{len(ketemu)} operator: {', '.join(ketemu)}\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "fungsi `bedah` ada", msg: "Definisikan def bedah(e).", name: "bedah" },
          { kind: "stdout_matches", task: "t2", label: "Ekspresi 1: rank, ts_mean", msg: "rank(ts_mean(close,5)-close) memakai 2 operator.", pattern: "2 operator: rank, ts_mean" },
          { kind: "stdout_matches", task: "t2", label: "Ekspresi 3: 3 operator", msg: "group_neutralize + rank + ts_decay_linear.", pattern: "3 operator: rank, ts_decay_linear, group_neutralize" }
        ],
      },
      reference: "Kenali organ sebelum menilai makhluknya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada pembedaan alpha vs beta dan anatomi simulasi — fondasi seluruh busur ini.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: baca rapor simulasi seperti dokter baca hasil lab — fitness dulu, baru detail",
        body: "Rapor simulasi yang baru keluar memancing insting yang salah: langsung melihat return-nya. Peneliti senior membalik urutannya. Pertama: fitness — lolos atau tidak. Fitness adalah hakim agung yang menggabungkan Sharpe, breadth, dan disiplin turnover; alpha yang gagal fitness sudah mati apa pun ceritanya, dan tidak ada detail yang bisa menghidupkannya. Kedua: Sharpe dan konsistensinya — apakah return datang stabil atau dari segelintir taruhan beruntung? Ketiga: turnover dan fit-nya — alpha brilian dengan turnover 80% akan dimakan biaya; turnover di atas batas bukanlah alpha, melainkan donasi ke broker. Keempat: drawdown — seberapa dalam rasa sakitnya, karena angka return tidak pernah bercerita tentang malam-malam buruknya. Terakhir barulah ekspresi: operator apa yang dipakai, apakah masuk akal secara ekonomi. Aturan praktisnya: jangan jatuh cinta pada alpha sebelum membaca fitness-nya — seperti jangan membeli mobil karena warnanya sebelum cek mesinnya. Dan satu pemeriksaan terakhir: kemiripan dengan alpha yang sudah ada. Alpha yang mirip dengan 50 alpha pendahulunya bukanlah penemuan, melainkan duplikat yang mahal.",
      },
      summary: [
        "Alpha = prediksi peringkat return relatif antar saham, bukan prediksi arah pasar.",
        "Beta = return dari arah pasar; alpha hidup saat pasar turun sekalipun.",
        "Satu simulasi WQB = expression (rumus FASTEXPR) + settings (region, universe, delay, decay, neutralization) → metrik.",
        "Tiga ambang nasib: Sharpe ≥ 1,25 · fitness > 1,0 · turnover ≤ 70%.",
        "Kualitas alpha diukur dari keselarasan peringkat skor vs return aktual.",
      ],
      quiz: [
        {
          q: "Mana yang merupakan alpha menurut definisi lesson ini?",
          options: [
            { text: "Sinyal yang urutan skornya selaras dengan urutan return aktual antar saham", why: "Tepat — alpha = prediksi peringkat relatif, bukan angka return.", correct: true },
            { text: "Strategi dengan return backtest tertinggi", why: "Return tinggi bisa murni beta ber-leverage; tanpa netralitas pasar ia bukan alpha." },
            { text: "Strategi yang selalu untung tiap bulan", why: "Konsistensi bukan definisi alpha; strategi beta di bull market panjang juga 'selalu untung'." },
            { text: "Sinyal yang memprediksi IHSG naik atau turun", why: "Itu prediksi arah pasar (beta/timing), bukan peringkat relatif antar saham." }
          ],
        },
        {
          q: "Pasar turun 20% tahun depan. Mana yang PALING mungkin tetap menghasilkan uang?",
          options: [
            { text: "Long-short 100 saham termurah vs 100 termahal yang netral pasar", why: "Benar — keuntungannya dari selisih peringkat, bukan arah pasar.", correct: true },
            { text: "Beli indeks dengan leverage 2x", why: "Leverage menggandakan arah pasar: turun 20% menjadi rugi 40%." },
            { text: "Beli saham termurah saja (long only)", why: "Long-only tetap punya beta ≈ 1: ikut tenggelam bersama pasar." }
          ],
        },
        {
          q: "Apa peran 'settings' dalam satu simulasi?",
          options: [
            { text: "Kondisi laboratorium: region, universe, delay, decay, neutralization tempat expression diuji", why: "Tepat — settings yang sama pentingnya dengan rumus; angka tanpa settings = tanpa makna.", correct: true },
            { text: "Hiasan administratif yang tidak memengaruhi hasil", why: "Salah besar — delay 0 vs 1 saja bisa mengubah Sharpe 3,2 menjadi 0,4." },
            { text: "Pengaturan tampilan grafik hasil", why: "Bukan tampilan; settings mengubah cara simulasi menghitung posisi dan PnL." }
          ],
        },
        {
          q: "Hasil simulasi: Sharpe 1,6 · fitness 1,8 · turnover 25%. Keputusan?",
          options: [
            { text: "Kandidat submit — tiga lampu hijau", why: "Benar: 1,6 ≥ 1,25; 1,8 > 1,0; 25% ≤ 70%. Lanjut cek korelasi.", correct: true },
            { text: "Ditolak — Sharpe harus di atas 2,0", why: "Ambang platform 1,25; menuntut 2,0 untuk semua alpha membuang banyak kandidat valid." },
            { text: "Ditolak — turnover harus di bawah 12,5%", why: "12,5% adalah lantai bonus fitness, bukan syarat; turnover ≤ 70% sudah sah." }
          ],
        },
        {
          q: "Skor sinyal 6 saham vs return aktual: 11 dari 15 pasangan selaras (73,3%). Artinya?",
          options: [
            { text: "Sinyal berisi alpha — urutan skor cenderung mengikuti urutan return", why: "Tepat — 73,3% jauh di atas 50% (acak).", correct: true },
            { text: "Sinyal sempurna dan siap disubmit", why: "Sampel 6 saham × 1 minggu = noise; platform menuntut ribuan hari." },
            { text: "Tidak ada informasi — 73,3% masih di bawah 100%", why: "Alpha tidak butuh sempurna; butuh konsisten di atas acak dalam sampel besar." }
          ],
        }
      ],
      reference: "Alpha = peringkat, bukan arah. Simulasi = expression + settings → tiga metrik.",
    },
  ],
};
