import type { V2Lesson } from "../lib/types";

const FIG_DECAY = `<svg viewBox="0 0 520 330" role="img" aria-label="Sharpe vs decay untuk dua family: slow-reversal memuncak di decay 2, orth-vwap memuncak di decay 8.">
<g font-family="var(--font-ui)">
<line x1="60" y1="260" x2="400" y2="260" stroke="var(--chart-text)" stroke-width="1" opacity="0.4"/>
<line x1="60" y1="160" x2="400" y2="160" stroke="var(--chart-text)" stroke-width="1" opacity="0.4"/>
<line x1="60" y1="60" x2="400" y2="60" stroke="var(--chart-text)" stroke-width="1" opacity="0.4"/>
<line x1="60" y1="160" x2="400" y2="160" stroke="#e5484d" stroke-width="2" stroke-dasharray="6 4"/>
<text x="404" y="164" font-size="11" fill="#e5484d">gerbang S = 1,25</text>
<text x="52" y="264" font-size="11" fill="var(--chart-text)" text-anchor="end">1,0</text>
<text x="52" y="164" font-size="11" fill="var(--chart-text)" text-anchor="end">1,25</text>
<text x="52" y="64" font-size="11" fill="var(--chart-text)" text-anchor="end">1,5</text>
<polyline points="70,240 150,92 230,136 310,188 390,224" fill="none" stroke="var(--c1)" stroke-width="3"/>
<circle cx="70" cy="240" r="5" fill="var(--c1)"/><circle cx="150" cy="92" r="5" fill="var(--c1)"/>
<circle cx="230" cy="136" r="5" fill="var(--c1)"/><circle cx="310" cy="188" r="5" fill="var(--c1)"/>
<circle cx="390" cy="224" r="5" fill="var(--c1)"/>
<polyline points="70,220 150,200 230,172 310,148 390,116" fill="none" stroke="var(--c2)" stroke-width="3"/>
<circle cx="70" cy="220" r="5" fill="var(--c2)"/><circle cx="150" cy="200" r="5" fill="var(--c2)"/>
<circle cx="230" cy="172" r="5" fill="var(--c2)"/><circle cx="310" cy="148" r="5" fill="var(--c2)"/>
<circle cx="390" cy="116" r="5" fill="var(--c2)"/>
<text x="70" y="284" font-size="12" fill="var(--chart-text)" text-anchor="middle">0</text>
<text x="150" y="284" font-size="12" fill="var(--chart-text)" text-anchor="middle">2</text>
<text x="230" y="284" font-size="12" fill="var(--chart-text)" text-anchor="middle">4</text>
<text x="310" y="284" font-size="12" fill="var(--chart-text)" text-anchor="middle">6</text>
<text x="390" y="284" font-size="12" fill="var(--chart-text)" text-anchor="middle">8</text>
<text x="230" y="306" font-size="12" fill="var(--chart-text)" text-anchor="middle">decay</text>
<rect x="60" y="14" width="14" height="14" fill="var(--c1)"/>
<text x="80" y="26" font-size="12" fill="var(--chart-text)">slow-reversal (puncak di decay 2)</text>
<rect x="300" y="14" width="14" height="14" fill="var(--c2)"/>
<text x="320" y="26" font-size="12" fill="var(--chart-text)">orth-vwap (puncak di decay 8)</text>
</g>
</svg>`;

const FIG_BIAYA = `<svg viewBox="0 0 520 190" role="img" aria-label="Perbandingan biaya simulasi: sweep decay 5 sim vs eksplorasi family baru 50 sim.">
<g font-family="var(--font-ui)">
<text x="10" y="40" font-size="12" fill="var(--chart-text)">sweep decay</text>
<rect x="170" y="22" width="45" height="26" fill="var(--c1)" opacity="0.9"/>
<text x="222" y="41" font-size="11" fill="var(--chart-text)">5 sim</text>
<text x="10" y="100" font-size="12" fill="var(--chart-text)">family baru</text>
<rect x="170" y="82" width="300" height="26" fill="var(--c4)" opacity="0.9"/>
<text x="170" y="76" font-size="11" fill="var(--chart-text)">50 sim (hasil belum pasti)</text>
<text x="10" y="160" font-size="11" fill="var(--chart-text)">Sweep = 10% biaya eksplorasi, pada family yang strukturnya sudah terbukti.</text>
</g>
</svg>`;

export const wqb16: V2Lesson = {
  slug: "wqb16-decay-sensitivity",
  track: "WorldQuant Brain",
  module: "Strategi Riset Alpha",
  title: "WQB16 — Decay Sensitivity: Eksperimen yang Mengubah Peta",
  estMinutes: 52,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Lima sim yang memensiunkan “decay 4 untuk semua”",
      prose: [
        "Tim riset alpha ini punya SOP yang tidak pernah dipertanyakan: setiap ekspresi diuji dengan `decay = 4`. Alasannya terdengar masuk akal — empat hari kira-kira satu minggu kerja, cukup halus untuk meredam noise, tidak terlalu lambat. Ratusan simulasi berjalan dengan angka 4 itu, wave demi wave, tanpa ada yang bertanya apakah 4 memang angka yang tepat.",
        "Suatu malam, seorang peneliti iseng mengajukan pertanyaan yang murah: bagaimana kalau decay 4 salah untuk juara kami? Ia mengambil satu ekspresi terbaik family `slow-reversal`, menahannya tetap sama persis, dan hanya mengganti decay: 0, 2, 4, 6, 8. Lima simulasi. Ekspektasinya sederhana — Sharpe naik seiring decay, karena sinyal yang lebih halus mestinya lebih baik. Hasilnya: 1,05 / 1,42 / 1,31 / 1,18 / 1,09. Bukan garis naik, melainkan huruf U terbalik: puncak di decay 2, dan di decay 8 sang juara jatuh di bawah gerbang kualitas.",
        "Twist-nya datang seminggu kemudian. Sweep yang sama dijalankan pada family `orth-vwap` — family yang tidak disukai siapa pun, nyaris dibuang dari bank. Hasilnya: 1,10 / 1,15 / 1,22 / 1,28 / 1,36. Puncak di decay 8. Family yang hampir dibuang itu ternyata submittable — hanya selama ini diuji dengan decay yang salah. Satu angka decay ternyata tidak cocok untuk semua family.",
        "SOP tim berubah malam itu juga: decay berhenti menjadi konstanta global dan menjadi parameter per family, dicatat di tabel seperti halnya region dan universe. Setelah lesson ini kamu bisa: (1) menjelaskan apa yang dilakukan decay terhadap sinyal; (2) merancang eksperimen sweep decay lima sim; (3) membaca hasilnya dan memilih decay optimal per family; (4) memutuskan kapan eksperimen ini layak dibayar dengan budget simulasimu.",
      ],
      tasks: [],
      note: {
        title: "Prasyarat ringkas",
        body: "Sharpe (S) = return/volatilitas tahunan, ukuran return per unit risiko. Fitness (F) = skor kualitas gabungan sebuah alpha. Gerbang kualitas tim ini: S ≥ 1,25 dan F ≥ 1. Turnover (TO) = fraksi portofolio yang berpindah tangan per hari; TO > 0,4 kena penalti. Decay = parameter penghalusan `ts_decay_linear(ekspresi, decay)`.",
      },
      reference: "Decay bukan konstanta global — ia parameter per family.",
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Decay: peredam yang bisa membunuh sinyal",
      prose: [
        "`ts_decay_linear(x, d)` mengambil rata-rata tertimbang dari `d` hari terakhir, dengan bobot yang menurun linear: hari ini berbobot `d`, kemarin `d − 1`, dan seterusnya sampai hari ke-`d` berbobot 1. Decay 0 berarti tanpa penghalusan sama sekali — sinyal mentah apa adanya.",
        "Interpretasi fisiknya: decay = panjang memori sinyal. Decay kecil (2) = sinyal cepat yang bereaksi pada pergerakan kemarin; decay besar (8) = sinyal lambat yang merata-ratakan seminggu. Contoh angka: `d = 4` memberi bobot 0,4 / 0,3 / 0,2 / 0,1. Untuk deret `x = [3, 1, 4, 1, 5]` (indeks 0 = hari ini), hasilnya `(4·3 + 3·1 + 2·4 + 1·1) / 10 = 24/10 = 2,4`. Sinyal mentah hari ini = 3,0; versi decay-4 = 2,4 — lebih tenang, lebih lambat.",
        "Dua efek yang bertarung di sini. Efek baik: penghalusan meredam noise harian, Sharpe bisa naik. Efek buruk: penghalusan berlebihan mengencerkan edge — sinyal reversal cepat yang hidup dari pergerakan kemarin mati kalau dirata-ratakan seminggu. Hasilnya kurva U-terbalik: naik dulu, lalu turun. Efek samping yang sering menguntungkan: turnover biasanya turun saat decay membesar, karena posisi lebih jarang berbalik arah.",
        "Cara membaca figur: sumbu X = decay, sumbu Y = Sharpe, garis merah putus-putus = gerbang S = 1,25. Interpretasi: kurva biru (`slow-reversal`) memuncak di decay 2 lalu jatuh di bawah gerbang pada decay 8 — sinyalnya cepat, ia butuh memori pendek. Kurva oranye (`orth-vwap`) naik terus sampai decay 8 — sinyalnya lambat dan persisten, ia butuh memori panjang. Dua family, dua peta.",
      ],
      formula: String.raw`w_k = \frac{d - k}{\sum_{j=0}^{d-1}(d - j)}, \quad k = 0, \dots, d-1`,
      formulaNote: "Bobot lag ke-k pada decay d. Contoh d = 4: penyebut = 4+3+2+1 = 10, bobot = 0,4 / 0,3 / 0,2 / 0,1. d = 2: penyebut 3, bobot = 0,667 / 0,333.",
      figure: {
        svg: FIG_DECAY,
        alt: "Grafik garis Sharpe vs decay: slow-reversal memuncak di decay 2 lalu turun, orth-vwap naik terus sampai decay 8.",
        caption: "Satu angka decay tidak cocok untuk semua: puncak slow-reversal di 2, puncak orth-vwap di 8.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Decay lebih besar = lebih halus = Sharpe lebih baik.” Penghalusan berlebihan membunuh sinyal cepat — itulah sisi kanan kurva U-terbalik. Decay bukan volume yang makin keras makin bagus; ia fokus lensa, dan lensa bisa terlalu buram.",
      },
      hints: [
        "Bobot selalu menurun linear dari hari ini ke belakang; jumlahkan dulu penyebutnya.",
        "Decay 0 = sinyal mentah; tidak ada pembagian bobot yang terjadi.",
      ],
      reference: "Decay = panjang memori. Terlalu pendek = berisik; terlalu panjang = edge menguap.",
    },
    {
      id: "eksperimen",
      eyebrow: "Langkah 3 · Konsep",
      title: "Desain eksperimen: lima sim, satu family",
      prose: [
        "Protokol sweep-nya sederhana dan ketat: ambil SATU ekspresi terbaik dari satu family, kunci semua parameter lain (region, universe, delay, neutralisasi), dan variasikan hanya decay pada {0, 2, 4, 6, 8}. Lima simulasi, satu variabel bebas — eksperimen terkontrol versi riset alpha. Jangan campur aduk: mengganti ekspresi sekaligus decay membuat hasilnya tidak bisa dibaca.",
        "Matematika biayanya yang membuat eksperimen ini menarik: 5 sim ≈ 2,5% dari budget wave 200 sim. Bandingkan dengan menjelajah family baru — sekitar 50 sim dengan tingkat keberhasilan yang belum diketahui. Sweep decay adalah taruhan murah pada struktur yang sudah terbukti, bukan lotre pada struktur yang belum dikenal.",
        "Kapan layak dijalankan: (1) family borderline — Sharpe 1,1–1,4 dengan fitness ≥ 1, tinggal selangkah dari gerbang; (2) turnover ketinggian — smoothing sering memangkas TO, jadi sweep ganda sebagai obat turnover; (3) family juara yang performanya stagnan — mungkin ia hanya salah decay. Kapan TIDAK layak: (1) fitness < 1 — masalahnya struktural, decay tidak menyembuhkan; (2) Sharpe sudah ≥ 1,5 — simpan budget untuk family baru; (3) family sudah pernah di-sweep — ulangi hanya bila ekspresinya berubah material.",
        "Cara membaca hasil: pilih decay dengan Sharpe tertinggi di antara yang fitness-nya ≥ 1; bila seri, pilih yang turnover-nya lebih rendah. Catat optimumnya di tabel SOP per family — mulai hari itu decay adalah kolom, bukan konstanta.",
      ],
      formula: String.raw`\text{Gain} = \frac{S_{\text{terbaik}} - S_{\text{default}}}{S_{\text{default}}} \times 100\%`,
      formulaNote: "Contoh slow-reversal: (1,42 − 1,31)/1,31 × 100% = 8,4% — kenaikan Sharpe dari lima sim. orth-vwap: (1,36 − 1,22)/1,22 × 100% = 11,5%.",
      figure: {
        svg: FIG_BIAYA,
        alt: "Batang perbandingan biaya: sweep decay 5 sim vs eksplorasi family baru 50 sim.",
        caption: "Sweep decay = 10% biaya eksplorasi family baru, pada struktur yang sudah terbukti.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Sweep decay = lima sim terbuang; mending bikin ekspresi baru.” Hitung nilai ekspektasinya: 5 sim pada family borderline ber-fitness baik punya peluang nyata mengangkat 1,31 → 1,42. Lima puluh sim ekspresi baru punya peluang nyata menghasilkan nol. Murah bukan berarti murahan — berarti return-per-sim-nya tinggi.",
      },
      hints: [
        "Satu variabel bebas per eksperimen: hanya decay yang berubah.",
        "Gain dihitung terhadap decay default (4), bukan terhadap decay 0.",
      ],
      reference: "Sweep = 5 sim, 1 variabel, pada family yang sudah terbukti.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 4 · Jebakan & kebiasaan",
      title: "Dua miskonsepsi, dua kebiasaan",
      prose: [
        "Miskonsepsi pertama sudah kita bedah di Langkah 2: decay besar selalu lebih baik. Data nyatanya berkata sebaliknya untuk sinyal cepat — slow-reversal jatuh dari 1,42 ke 1,09 saat decay digeser dari 2 ke 8. Kebiasaan penggantinya: selalu plot kurvanya, jangan asumsikan monoton. Kalau kurvanya U-terbalik, puncaknya adalah jawaban; kalau naik terus sampai 8, uji 10 dan 12 sebelum puas.",
        "Miskonsepsi kedua: eksperimen kecil = eksperimen tidak penting. Lima sim terasa sepele dibanding wave 164 sim, sehingga godaan untuk melewatkannya besar. Kebiasaan penggantinya: urutkan family borderline berdasarkan fitness tertinggi, sweep dari yang paling menjanjikan. Satu family yang naik dari 1,31 ke 1,42 bernilai lebih dari sepuluh ekspresi baru yang mati di 0,9.",
        "Kebiasaan ketiga: jadikan decay kolom di tabel SOP per family, berdampingan dengan region dan universe. Setiap kali wave baru dirancang, kolom itu dibaca dulu — tidak ada lagi “default 4” yang diwariskan tanpa berpikir. Kebiasaan keempat: bila sweep juga menurunkan turnover di bawah 0,4, catat dua manfaatnya (Sharpe naik + penalti hilang); itu kandidat prioritas Kolam Penyelamatan di wave berikutnya.",
      ],
      tasks: [],
      note: {
        title: "Decay itu bumbu, bukan obat",
        type: "pitfall",
        body: "Jangan pernah menjalankan sweep decay pada ekspresi ber-fitness < 1 dengan harapan ia “membaik”. Decay menghaluskan sinyal yang sudah ada; ia tidak menciptakan edge yang tidak ada. Struktur dulu, bumbu kemudian — urutan ini menghemat ratusan sim.",
      },
      reference: "Plot kurvanya, catat optimumnya, jangan sweep yang sakit struktural.",
    },
    {
      id: "lab-bobot",
      eyebrow: "Langkah 5 · Lab",
      title: "Hitung bobot decay dengan tangan (lalu dengan Python)",
      prose: [
        "Implementasikan `decay_smooth`: bobot linear `d, d−1, …, 1` dikalikan `d` harga terakhir, dibagi jumlah bobot. Data mainan: `x = [3,0, 1,0, 4,0, 1,0, 5,0]` dengan indeks 0 = hari ini. Untuk decay 2: bobot 2/3 dan 1/3 → `(2·3 + 1·1)/3 = 2,333`. Untuk decay 4: bobot 0,4/0,3/0,2/0,1 → 2,400. Perhatikan betapa kecil perbedaannya — dan betapa besar dampaknya pada Sharpe nyata.",
        "Setelah jalan, eksperimen: ganti `x` menjadi deret berisik `[5,0, 1,0, 5,0, 1,0, 5,0]` dan bandingkan decay 2 vs 4. Decay 4 akan jauh lebih “tenang” — itulah intuisi kenapa turnover turun saat decay membesar.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `decay_smooth(x, d)` dengan bobot linear" },
        { id: "t2", text: "Jalankan: pastikan dua baris tercetak dengan nilai yang benar" },
      ],
      expected: "decay 2: 2.333\ndecay 4: 2.400",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Bobot = 1/d rata-rata biasa.” Bukan — decay linear memberi bobot lebih pada hari ini (d) daripada hari terjauh (1). Rata-rata biasa = `ts_mean`, bukan `ts_decay_linear`. Salah bobot = salah intuisi tentang “memori” sinyal.",
      },
      hints: [
        "Bobot = [d - k for k in range(d)]; hanya pakai x[:d].",
        "Hasil = sum(bobot*harga) / sum(bobot).",
      ],
      code: {
        starter: "# Bobot decay linear (JANGAN UBAH): x[0] = hari ini\nx = [3.0, 1.0, 4.0, 1.0, 5.0]\n\n# TULIS KODEMU\ndef decay_smooth(x, d):\n    return\n\nfor d in (2, 4):\n    print(f\"decay {d}: {decay_smooth(x, d):.3f}\")\n",
        lockLines: 5,
        solution: "# Bobot decay linear (JANGAN UBAH): x[0] = hari ini\nx = [3.0, 1.0, 4.0, 1.0, 5.0]\n\n# TULIS KODEMU\ndef decay_smooth(x, d):\n    w = [d - k for k in range(d)]\n    return sum(wi * xi for wi, xi in zip(w, x[:d])) / sum(w)\n\nfor d in (2, 4):\n    print(f\"decay {d}: {decay_smooth(x, d):.3f}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "decay 2 = 2,333", msg: "(2·3 + 1·1) / 3 = 2,333.", pattern: "decay 2: 2\\.333" },
          { kind: "stdout_matches", task: "t2", label: "decay 4 = 2,400", msg: "(4·3 + 3·1 + 2·4 + 1·1) / 10 = 2,400.", pattern: "decay 4: 2\\.400" }
        ],
      },
      reference: "Bobot linear = memori menurun. Kode ini intuisi fisik decay.",
    },
    {
      id: "lab-banding",
      eyebrow: "Langkah 6 · Lab",
      title: "Bandingkan kandidat pada lima decay",
      prose: [
        "Sekarang replika keputusan tim: dari tabel Sharpe per decay, pilih decay terbaik tiap family dan hitung gain terhadap default 4. Inilah tepatnya baris yang mengubah SOP — slow-reversal terbaik di 2 (+8,4%), orth-vwap terbaik di 8 (+11,5%).",
        "Perhatikan fungsi `max(tabel, key=tabel.get)` — pola standar “kunci dengan nilai terbesar”. Setelah selesai, coba ubah satu angka (mis. orth-vwap decay 8 menjadi 1,20) dan lihat keputusannya berubah — latihan membaca sensitivitas.",
      ],
      tasks: [
        { id: "t1", text: "Cari `best_d`, `best_s`, dan `gain` vs decay 4 tiap family" },
        { id: "t2", text: "Jalankan: pastikan dua baris keputusan tercetak" },
      ],
      expected: "slow-reversal: decay terbaik 2 (S=1.42), gain vs decay-4: +8.4%\north-vwap: decay terbaik 8 (S=1.36), gain vs decay-4: +11.5%",
      hints: [
        "best_d = max(tabel, key=tabel.get); best_s = tabel[best_d].",
        "gain = (best_s - tabel[4]) / tabel[4] * 100; format {gain:+.1f}%.",
      ],
      code: {
        starter: "# Sharpe per decay, dua family (JANGAN UBAH)\nhasil = {\n    \"slow-reversal\": {0: 1.05, 2: 1.42, 4: 1.31, 6: 1.18, 8: 1.09},\n    \"orth-vwap\": {0: 1.10, 2: 1.15, 4: 1.22, 6: 1.28, 8: 1.36},\n}\n\n# TULIS KODEMU: decay terbaik & gain vs decay 4\nfor fam, tabel in hasil.items():\n    best_d =\n    best_s =\n    gain =\n    print(f\"{fam}: decay terbaik {best_d} (S={best_s:.2f}), gain vs decay-4: {gain:+.1f}%\")\n",
        lockLines: 6,
        solution: "# Sharpe per decay, dua family (JANGAN UBAH)\nhasil = {\n    \"slow-reversal\": {0: 1.05, 2: 1.42, 4: 1.31, 6: 1.18, 8: 1.09},\n    \"orth-vwap\": {0: 1.10, 2: 1.15, 4: 1.22, 6: 1.28, 8: 1.36},\n}\n\n# TULIS KODEMU: decay terbaik & gain vs decay 4\nfor fam, tabel in hasil.items():\n    best_d = max(tabel, key=tabel.get)\n    best_s = tabel[best_d]\n    gain = (best_s - tabel[4]) / tabel[4] * 100\n    print(f\"{fam}: decay terbaik {best_d} (S={best_s:.2f}), gain vs decay-4: {gain:+.1f}%\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "slow-reversal → decay 2", msg: "1,42 tertinggi; gain (1,42−1,31)/1,31 = +8,4%.", pattern: "slow-reversal: decay terbaik 2 \\(S=1\\.42\\), gain vs decay-4: \\+8\\.4%" },
          { kind: "stdout_matches", task: "t2", label: "orth-vwap → decay 8", msg: "1,36 tertinggi; gain (1,36−1,22)/1,22 = +11,5%.", pattern: "orth-vwap: decay terbaik 8 \\(S=1\\.36\\), gain vs decay-4: \\+11\\.5%" }
        ],
      },
      reference: "Lima sim → dua keputusan decay. Inilah baris yang mengubah SOP.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Sweep atau simpan budget?",
      prose: [
        "Satu: S 1,1–1,4 dan F ≥ 1 → sweep decay 0/2/4/6/8. Family borderline ber-fitness baik = return-per-sim tertinggi. Dua: TO > 0,4 dan S borderline → sweep juga; smoothing sering memangkas turnover, jadi satu eksperimen dua manfaat. Tiga: S ≥ 1,5 → jangan sweep; juara yang sudah lolos tidak butuh diutak-atik, budget untuk family baru. Empat: F < 1 → jangan sweep; perbaiki struktur ekspresi dulu, decay bukan obat. Lima: family sudah pernah di-sweep dengan ekspresi sejenis → jangan ulangi; baca kolom decay di tabel SOP.",
        "Aturan praktis 10 detik: hampir lolos + family sehat → sweep. Sakit struktural atau sudah lolos jauh → simpan budget.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Sweep decay adalah operasi penyelamatan, bukan operasi penemuan. Ia mengubah “hampir” menjadi “lolos” — ia tidak mengubah “buruk” menjadi “bagus”. Kenali bedanya sebelum membayar 5 sim.",
      },
      reference: "Borderline + sehat = sweep. Sisanya = simpan budget.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "mdf_vwap_3: Sharpe tertinggi bukan jawabannya",
      prose: [
        "Data sweep family `mdf_vwap_3` (mean-reversion VWAP): decay 0 → S=1,22, F=1,01, TO=0,61; decay 2 → S=1,38, F=1,02, TO=0,55; decay 4 → S=1,31, F=1,00, TO=0,52; decay 6 → S=1,36, F=1,03, TO=0,38; decay 8 → S=1,24, F=0,99, TO=0,35.",
        "Pertanyaan: decay mana yang masuk wave? Pembahasan: decay 2 punya Sharpe tertinggi (1,38) tetapi TO 0,55 = kena penalti, dan keunggulannya atas decay 6 hanya 0,02. Decay 8 gagal gerbang (S=1,24 < 1,25, F=0,99 < 1). Decay 6: S=1,36 (lolos), F=1,03 (lolos), TO=0,38 (bebas penalti). Keputusan: decay 6. Pelajaran mini-case ini: optimum = Sharpe tertinggi di antara yang lolos SEMUA gerbang, bukan Sharpe tertinggi absolut. Satu angka (TO) mengubah pemenang.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke riset",
        type: "risk",
        body: "Memilih decay 2 “karena Sharpe tertinggi” lalu mengabaikan penalti turnover = keputusan satu dimensi. Alpha yang lolos Sharpe tetapi berdarah di biaya transaksi gagal di dunia nyata. Selalu baca tiga angka sekaligus: S, F, TO.",
      },
      reference: "Optimum = Sharpe max di antara yang lolos S, F, dan TO.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokusnya: membaca kurva, bukan menghafal angka.",
      ],
      tasks: [],
      summary: [
        "Decay = panjang memori sinyal; bobot menurun linear dari hari ini.",
        "Sweep: 1 ekspresi × decay {0,2,4,6,8} = 5 sim, satu variabel bebas.",
        "Satu angka decay tidak cocok untuk semua family — catat optimum per family.",
        "Kurva U-terbalik itu normal: over-smoothing membunuh sinyal cepat.",
        "Optimum = Sharpe tertinggi di antara yang lolos S ≥ 1,25, F ≥ 1, TO ≤ 0,4.",
      ],
      next: { label: "WQB17 — Merancang Wave: Kolam Puncak, Kolam Lebar, Kolam Penyelamatan", href: "/v2/learn/wqb17-merancang-wave" },
      quiz: [
        {
          q: "Family slow-reversal mencapai Sharpe terbaik pada decay berapa?",
          options: [
            { text: "Decay 2 (S = 1,42)", why: "Benar — puncak kurva U-terbaliknya di 2.", correct: true },
            { text: "Decay 4 (default SOP lama)", why: "Itu default lama yang terbukti bukan optimum (1,31)." },
            { text: "Decay 8 (paling halus)", why: "Di decay 8 ia jatuh ke 1,09 — over-smoothing membunuh sinyal cepat." }
          ],
        },
        {
          q: "Kenapa Sharpe slow-reversal turun saat decay digeser 2 → 8?",
          options: [
            { text: "Sinyal reversal-nya cepat; memori terlalu panjang mengencerkan edge", why: "Tepat — inilah sisi kanan kurva U-terbalik.", correct: true },
            { text: "Datanya rusak pada decay besar", why: "Datanya sama; yang berubah hanya bobot penghalusan." },
            { text: "Turnover naik sehingga Sharpe turun", why: "Terbalik — turnover biasanya TURUN saat decay membesar." }
          ],
        },
        {
          q: "Kapan sweep decay TIDAK layak dijalankan?",
          options: [
            { text: "Fitness < 1 — masalahnya struktural", why: "Benar. Decay itu bumbu, bukan obat.", correct: true },
            { text: "Sharpe 1,31 dengan fitness 1,02", why: "Ini kasus ideal sweep: borderline + fitness baik." },
            { text: "Turnover 0,55 dengan Sharpe borderline", why: "Ini justru alasan ganda untuk sweep: Sharpe + TO." }
          ],
        },
        {
          q: "Apa arti decay = 0?",
          options: [
            { text: "Tanpa penghalusan — sinyal mentah", why: "Benar. Bobot hanya hari ini.", correct: true },
            { text: "Sinyal dihapus total", why: "Bukan — 0 berarti tidak ada memori, bukan tidak ada sinyal." },
            { text: "Rata-rata 30 hari", why: "Itu kebalikannya — decay 0 = memori nol hari." }
          ],
        },
        {
          q: "orth-vwap terbaik di decay 8. Apa implikasinya?",
          options: [
            { text: "Sinyalnya lambat/persisten — butuh memori panjang", why: "Benar. Kurva naik terus = edge-nya hidup dari perataan mingguan.", correct: true },
            { text: "Family ini lebih baik dari slow-reversal", why: "Tidak bisa disimpulkan — optimum decay bukan ukuran kualitas family." },
            { text: "Decay 8 harus jadi default baru semua family", why: "Itu mengulang kesalahan SOP lama dengan angka berbeda." }
          ],
        }
      ],
      reference: "Lima sim yang tepat > lima puluh sim yang acak.",
    },
  ],
};
