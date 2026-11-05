import type { V2Lesson } from "../lib/types";

// ── Figure: control chart 25 hari ────────────────────────────────────────
// Skala: x = 60 + i*19.6 (25 titik); y(v) = 260 - (v-30)*5.5.
// Garis: rata-rata 45,18 → y 176,5; UCL 50,68 → y 146,3; LCL 39,68 → y 206,8;
// +2σ 48,84 → y 156,4; −2σ 41,52 → y 196,6.
const SPC_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Control chart 25 hari: satu titik di atas UCL dan tiga titik beruntun di zona 2-sigma.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="50" y1="260" x2="540" y2="260"/><line x1="50" y1="205" x2="540" y2="205"/>
<line x1="50" y1="150" x2="540" y2="150"/><line x1="50" y1="95" x2="540" y2="95"/>
<line x1="50" y1="40" x2="540" y2="40"/>
</g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end">
<text x="44" y="263">30</text><text x="44" y="208">40</text>
<text x="44" y="153">50</text><text x="44" y="98">60</text><text x="44" y="43">70</text>
</g>
<line x1="50" y1="146.3" x2="540" y2="146.3" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="8 4"/>
<line x1="50" y1="206.8" x2="540" y2="206.8" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="8 4"/>
<line x1="50" y1="156.4" x2="540" y2="156.4" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="2 4" opacity="0.6"/>
<line x1="50" y1="196.6" x2="540" y2="196.6" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="2 4" opacity="0.6"/>
<line x1="50" y1="176.5" x2="540" y2="176.5" stroke="var(--chart-text)" stroke-width="1.5"/>
<g font-size="10" font-family="var(--font-ui)" fill="var(--c4)" text-anchor="start">
<text x="544" y="149">UCL 50,7</text>
<text x="544" y="209">LCL 39,7</text>
</g>
<text x="544" y="179" font-size="10" font-family="var(--font-ui)" fill="var(--chart-text)">rata2 45,2</text>
<polyline points="60,183 79.6,166.5 99.2,188.5 118.8,172 138.4,177.5 158,161 177.6,194 197.2,172 216.8,183 236.4,166.5 256,177.5 275.6,51 295.2,183 314.8,172 334.4,177.5 354,188.5 373.6,166.5 393.2,155.5 412.8,152.8 432.4,155.5 452,172 471.6,183 491.2,166.5 510.8,177.5 530.4,172" fill="none" stroke="var(--c1)" stroke-width="2"/>
<g>
<circle cx="275.6" cy="51" r="6" fill="var(--c4)"/>
<text x="275.6" y="34" text-anchor="middle" font-size="10" font-family="var(--font-ui)" fill="var(--c4)" font-weight="700">hari 12</text>
<circle cx="393.2" cy="155.5" r="5" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<circle cx="412.8" cy="152.8" r="5" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<circle cx="432.4" cy="155.5" r="5" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<text x="412.8" y="138" text-anchor="middle" font-size="10" font-family="var(--font-ui)" fill="var(--c2)" font-weight="700">hari 18–20</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<line x1="60" y1="282" x2="80" y2="282" stroke="var(--c1)" stroke-width="2.5"/>
<text x="86" y="286" fill="var(--text)">waktu proses harian</text>
<line x1="230" y1="282" x2="250" y2="282" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="8 4"/>
<text x="256" y="286" fill="var(--text)">batas kontrol ±3σ</text>
<line x1="400" y1="282" x2="420" y2="282" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="2 4"/>
<text x="426" y="286" fill="var(--text)">zona ±2σ</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="50" y="20">menit</text><text x="430" y="20">data sintetis lab</text>
</g>
</svg>`;

export const a323: V2Lesson = {
  slug: "a323-spc-control-chart",
  track: "Statistika",
  module: "Kontrol Kualitas",
  title: "A323 — Statistical Process Control: Control Chart",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Rata-rata adalah pembohong yang sopan: ia menyembunyikan satu hari bencana dan tiga hari pergeseran di balik angka '47 menit, stabil'. Lesson ini tentang control chart — alat statistik berumur seabad (Walter Shewhart, 1924) yang membedakan variasi normal dari sinyal bahaya, dan dipakai bukan cuma di pabrik: di bank, rumah sakit, dan tim data.",
        "Setelah lesson ini kamu bisa: (1) membedakan common cause vs special cause variation; (2) menghitung garis tengah dan batas kontrol ±3σ dari periode acuan; (3) menerapkan aturan Western Electric (termasuk pola 2-dari-3 yang menangkap pergeseran halus); (4) menjelaskan kenapa batas kontrol dihitung dari data BERSIH, bukan dari data yang mengandung anomali; (5) memakai SPC untuk proses bisnis (waktu proses, error rate, antrian).",
        "Rute: cerita (rata-rata 47 menit yang berbohong), dua konsep (common vs special cause; aturan Western Electric), lab Pyodide (mesin control chart), chart dengan panduan baca, peta keputusan, mini-case call center, kuis, rangkuman. Estimasi 60 menit; lab sekitar 15 menit.",
        "Bekal ringkas, agar lesson mandiri. Pertama, rata-rata (mean): jumlah semua nilai dibagi banyaknya. Kedua, simpangan baku (standard deviation): ukuran sebaran — kecil berarti data mengumpul rapat di sekitar rata-rata. Ketiga, intuisi distribusi normal: bila data berperilaku 'normal', ~99,7% titik jatuh dalam ±3σ dari rata-rata — titik di luar itu nyaris mustahil terjadi secara kebetulan.",
      ],
      tasks: [],
      hints: [
        "Intuisi pembuka: control chart menjawab 'apakah prosesku BERUBAH?' — bukan 'berapa rata-ratanya?'. Rata-rata menjawab kemarin; control chart mengawasi hari ini.",
      ],
      reference: "Bekal: (1) mean; (2) simpangan baku; (3) 99,7% data normal dalam ±3σ.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Rata-rata 47 menit yang berbohong",
      prose: [
        "Bank 'Nusa' memproses klaim asuransi dengan SLA 60 menit. Dasbor manajer menampilkan satu angka: rata-rata 25 hari = 47,6 menit. 'Stabil, di bawah SLA,' lapornya tiap Senin. Tidak ada yang menyelidiki.",
        "Twist-nya terungkap saat audit membuka data harian: hari ke-12 mencatat 68 menit — sistem core banking down 2 jam, 40 nasabah menunggu tanpa kabar. Lebih halus: hari ke-18, 19, 20 mencatat 49, 49,5, 49 — tiga hari beruntun di atas normal, tanda awal server yang mulai kepayahan sebelum akhirnya... tidak ada yang tahu, karena tidak ada yang melihat polanya. Rata-rata 47,6 menelan kedua sinyal itu bulat-bulat.",
        "Lesson ini membangun control chart-nya: garis tengah 45,2, batas kontrol 39,7–50,7. Di chart itu, hari ke-12 berteriak merah di atas batas, dan hari ke-18–20 membentuk pola yang melanggar aturan Western Electric. Dua sinyal, dua jenis masalah, satu chart — dan tidak satu pun terlihat dari angka rata-rata.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "Mayoritas kegagalan operasional tidak datang tiba-tiba — mereka merangkak. Fraud rate yang naik 0,1% per minggu, waktu settlement yang melar 2 menit per bulan: semuanya tak terlihat di rata-rata sampai melewati ambang krisis. Control chart adalah early warning system termurah yang ada: ia mengubah 'kok tiba-tiba?' menjadi 'sudah terlihat sejak tiga minggu lalu'.",
      },
      reference: "Rata-rata menyembunyikan sinyal. Control chart memisahkan noise dari bahaya.",
    },
    {
      id: "konsep-variasi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Common vs Special Cause — Si Bisikan dan Si Teriakan",
      prose: [
        "Definisi: COMMON CAUSE variation = goyangan yang melekat pada proses itu sendiri — beda operator, beda jam, beda mood nasabah. Ia acak, kecil, dan tidak bisa 'diperbaiki' dengan memarahi siapa pun. SPECIAL CAUSE variation = goyangan yang punya PENYEBAB TERIDENTIFIKASI — server down, prosedur baru yang salah, supplier ganti bahan. Ia besar atau berpola, dan BISA diinvestigasi.",
        "Control chart memisahkan keduanya dengan batas kontrol: garis tengah (CL) = rata-rata periode acuan; UCL = rata-rata + 3σ; LCL = rata-rata − 3σ. Titik di dalam batas = bisikan (jangan diutak-atik); titik di luar batas = teriakan (investigasi!). Aturan emas Deming: bereaksi terhadap bisikan (tampering — mis. memarahi staf karena satu hari buruk yang masih dalam batas) justru MENAMBAH variasi.",
        "Kepribadiannya: common cause seperti ombak kecil di pantai — selalu ada, tidak perlu diselamatkan siapa pun. Special cause seperti orang tenggelam yang melambaikan tangan — butuh respons SEKARANG. Manajer yang tidak bisa membedakan keduanya akan mengabaikan orang tenggelam sambil meneriaki ombak. Kapan memakai: (1) proses berulang yang ingin dijaga stabil (waktu proses, defect rate, antrian); (2) ada periode acuan yang 'sehat' untuk menghitung batas. Kapan tidak: proses yang memang dirancang berubah-ubah (mis. penjualan musiman tanpa penyesuaian) — di sana chart tanpa dekomposisi musiman hanya menghasilkan alarm palsu.",
      ],
      formula: String.raw`\text{CL} = \bar{x}, \qquad \text{UCL} = \bar{x} + 3\sigma, \qquad \text{LCL} = \bar{x} - 3\sigma`,
      formulaNote: "CL (center line) = rata-rata periode acuan; σ = simpangan baku periode acuan; UCL/LCL = batas kontrol atas/bawah. Kenapa 3σ? Untuk data yang berperilaku normal, peluang titik acak keluar batas hanya ~0,27% — jadi titik yang keluar hampir pasti BUKAN kebetulan. Contoh lab: x-bar = 45,18, σ = 1,83 → UCL = 45,18 + 3×1,83 = 50,68; LCL = 45,18 − 3×1,83 = 39,68.",
      tasks: [],
      note: {
        title: "🚨 Mitos: batas kontrol = batas spesifikasi (SLA)",
        type: "pitfall",
        body: "Yang benar: batas kontrol dihitung DARI DATA (suara proses), sedangkan SLA ditentukan OLEH MANAJEMEN (suara pelanggan). Proses bisa 'terkendali' (semua titik dalam batas kontrol) tetapi 'tidak capable' (batas kontrol lebih lebar dari SLA) — artinya prosesnya stabil tetapi stabil-stabil GAGAL memenuhi janji. Jangan pernah menggambar garis SLA 60 menit lalu menyebutnya control chart.",
      },
      hints: [
        "💡 Intuisi: 3σ bukan angka mistis — ia adalah ambang 'nyaris mustahil kebetulan'. Alarm palsu ~0,27% per titik berarti dengan 25 titik, peluang satu alarm palsu ≈ 6,5%. Itu harga yang wajar untuk tidak melewatkan bencana.",
        "💡 Intuisi: tampering adalah dosa termahal SPC — menyesuaikan proses setiap kali ada goyangan normal justru menggandakan variasi (seperti menyetir dengan mengoreksi setiap guncangan kecil: mobilmu zig-zag). Aturannya: di dalam batas = diam; di luar batas = bertindak.",
      ],
      reference: "Dalam batas = bisikan (diam). Luar batas = teriakan (investigasi). Batas kontrol ≠ SLA.",
    },
    {
      id: "konsep-aturan",
      eyebrow: "Langkah 4 · Aturan",
      title: "Western Electric Rules — Si Pembaca Pola",
      prose: [
        "Definisi: aturan 1 — SATU titik di luar ±3σ → special cause (peluang kebetulan 0,27%). Aturan 2 — DUA dari TIGA titik beruntun di luar ±2σ pada sisi yang sama → special cause. Kenapa aturan 2 penting? Karena pergeseran KECIL tapi PERSISTEN (rata-rata naik 1,5σ selama berhari-hari) hampir tidak pernah menembus 3σ dalam satu titik — tetapi tiga titik beruntun di zona 2σ–3σ punya peluang kebetulan hanya ~0,3%. Aturan 2 adalah radar untuk bahaya yang merangkak.",
        "Contoh lab: hari ke-12 (68 menit) melanggar aturan 1 — teriakan tunggal, penyebab jelas (sistem down). Hari ke-18, 19, 20 (49; 49,5; 49) TIDAK melanggar aturan 1 (semuanya di bawah UCL 50,68) tetapi ketiganya di atas +2σ (48,84) — melanggar aturan 2. Tanpa aturan 2, pergeseran halus ini lolos; tiga minggu kemudian ia menjadi hari ke-12 berikutnya.",
        "Kepribadiannya: aturan 1 seperti alarm kebakaran — berbunyi saat api sudah besar. Aturan 2 seperti detektor asap — berbunyi saat baru ada bau hangus. Keduanya dibutuhkan; mengandalkan alarm kebakaran saja berarti kamu selalu datang terlambat. Kapan memakai aturan 2: (1) proses dengan biaya kegagalan tinggi (perbankan, kesehatan); (2) data cukup banyak sehingga alarm palsu tambahan masih bisa ditoleransi. Catatan jujur: tiap aturan tambahan menaikkan alarm palsu — pakai 2–3 aturan inti, bukan delapan sekaligus.",
      ],
      formula: String.raw`P(\text{1 titik} > 3\sigma) \approx 0{,}27\%, \qquad P(\text{2 dari 3} > 2\sigma \text{ searah}) \approx 0{,}3\%`,
      formulaNote: "Peluang kebetulan tiap aturan bila proses normal. Aturan 1: satu titik di luar 3σ — sangat jarang kebetulan. Aturan 2: dua dari tiga beruntun di luar 2σ pada sisi yang sama — juga sangat jarang kebetulan, tetapi SENSITIF terhadap pergeseran kecil yang persisten. Contoh lab: +2σ = 45,18 + 2×1,83 = 48,84; hari 18–20 (49; 49,5; 49) semuanya di atasnya → pelanggaran aturan 2.",
      tasks: [],
      note: {
        title: "🚨 Mitos: hitung batas kontrol dari SEMUA data yang ada",
        type: "pitfall",
        body: "Yang benar: batas dihitung dari periode ACUAN yang sudah dipastikan sehat (Fase I) — 11 hari pertama di lab. Bila kamu menghitung σ dari 25 hari yang SUDAH mengandung anomali (hari ke-12 = 68), σ membengkak dari 1,83 menjadi 6,01, UCL naik ke 65,6 — dan tiba-tiba TIDAK ADA yang melanggar, termasuk anomali itu sendiri. Itu seperti mengukur 'normal' dengan memasukkan demam ke dalamnya: semua orang jadi terlihat sehat.",
      },
      hints: [
        "💡 Intuisi: Fase I (bangun batas dari data bersih) → Fase II (awasi data baru dengan batas itu). Batas kontrol adalah 'foto masa sehat' — kamu tidak memotret orang sakit untuk menentukan standar sehat.",
        "💡 Intuisi: bila tidak ada periode yang terbukti sehat, mulai dari seluruh data, BUANG titik yang melanggar, hitung ulang — ulangi sampai stabil. Itulah 'pembersihan Fase I' yang jujur.",
      ],
      reference: "Aturan 1 = teriakan. Aturan 2 = bau hangus. Batas dari data BERSIH, bukan data beranomali.",
    },
    {
      id: "lab-spc",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Bangun control chart mini",
      prose: [
        "Waktunya jadi inspektur proses. Data di bawah: 25 hari waktu proses klaim (menit). 11 hari pertama adalah periode acuan yang sehat — JANGAN pakai 25 hari untuk menghitung batas (lihat jebakan di Langkah 4). Tugasmu: (1) hitung garis tengah, simpangan baku, UCL, LCL dari 11 hari acuan; (2) terapkan aturan 1 (di luar ±3σ); (3) terapkan aturan 2 Western Electric (2 dari 3 beruntun di luar ±2σ, sisi sama, di luar yang sudah kena aturan 1); (4) vonis: TERKENDALI atau TIDAK_TERKENDALI?",
        "Coba: setelah lolos, hitung ulang batas dari KESELURUHAN 25 hari dan lihat apa yang terjadi pada daftar pelanggar. Itulah mengapa 'σ dari data kotor' adalah cara paling elegan untuk menyembunyikan masalah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rata`, `sd` (simpangan baku sampel), `ucl`, `lcl` dari 11 hari pertama (`x[:11]`), lalu cetak" },
        { id: "t2", text: "Terapkan aturan 1: `aturan1` = nomor hari (1-based) dengan nilai di luar [lcl, ucl], lalu cetak" },
        { id: "t3", text: "Terapkan aturan 2: `aturan2` = hari-hari dalam jendela 3-beruntun dengan ≥2 titik di luar ±2σ sisi sama (kecualikan yang sudah kena aturan 1), lalu cetak" },
        { id: "t4", text: "Gabungkan jadi `spesial`, cetak, dan cetak `vonis` (TIDAK_TERKENDALI bila ada special cause)" },
      ],
      expected: "mean=45.18 sd=1.83\nUCL=50.68 LCL=39.68\naturan1_melanggar: [12]\naturan2_melanggar: [18, 19, 20]\nspecial_cause: [12, 18, 19, 20]\nvonis=TIDAK_TERKENDALI",
      code: {
        starter: `import statistics as st
# Waktu proses klaim harian (menit), 25 hari. 11 hari pertama = periode acuan. JANGAN UBAH.
x = [44,47,43,46,45,48,42,46,44,47,45,68,44,46,45,43,47,49,49.5,49,46,44,47,45,46]
ACUAN = 11

# TULIS KODEMU di bawah ini
`,
        lockLines: 6,
        solution: `import statistics as st
# Waktu proses klaim harian (menit), 25 hari. 11 hari pertama = periode acuan. JANGAN UBAH.
x = [44,47,43,46,45,48,42,46,44,47,45,68,44,46,45,43,47,49,49.5,49,46,44,47,45,46]
ACUAN = 11

# TULIS KODEMU di bawah ini
dasar = x[:ACUAN]
rata = st.mean(dasar)
sd = st.stdev(dasar)
ucl = rata + 3*sd
lcl = rata - 3*sd
aturan1 = [i+1 for i, v in enumerate(x) if v > ucl or v < lcl]
atas2 = [v > rata + 2*sd for v in x]
bawah2 = [v < rata - 2*sd for v in x]
aturan2 = set()
for i in range(len(x)-2):
    j = atas2[i:i+3]
    if sum(j) >= 2:
        aturan2.update(i+1+k for k, w in enumerate(j) if w)
    j = bawah2[i:i+3]
    if sum(j) >= 2:
        aturan2.update(i+1+k for k, w in enumerate(j) if w)
aturan2 = sorted(aturan2 - set(aturan1))
spesial = sorted(set(aturan1) | set(aturan2))
vonis = "TIDAK_TERKENDALI" if spesial else "TERKENDALI"
print(f"mean={rata:.2f} sd={sd:.2f}")
print(f"UCL={ucl:.2f} LCL={lcl:.2f}")
print(f"aturan1_melanggar: {aturan1}")
print(f"aturan2_melanggar: {aturan2}")
print(f"special_cause: {spesial}")
print(f"vonis={vonis}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rata", value: 45.18, tol: 0.01, label: "Garis tengah = 45,18", msg: "Rata-rata 11 hari acuan (bukan 25 hari!)." },
          { kind: "equal", task: "t1", name: "ucl", value: 50.68, tol: 0.01, label: "UCL = 50,68", msg: "45,18 + 3 × 1,83. Bila UCL-mu ~65, kamu menghitung dari data kotor." },
          { kind: "stdout_matches", task: "t2", pattern: "aturan1_melanggar: \\[12\\]", label: "Aturan 1: hari 12", msg: "68 menit > UCL 50,68 — teriakan tunggal." },
          { kind: "stdout_matches", task: "t3", pattern: "aturan2_melanggar: \\[18, 19, 20\\]", label: "Aturan 2: hari 18–20", msg: "Tiga beruntun di atas +2σ (48,84) — bau hangus yang aturan 1 lewatkan." },
          { kind: "stdout_matches", task: "t4", pattern: "vonis=TIDAK_TERKENDALI", label: "Vonis TIDAK_TERKENDALI", msg: "Ada special cause → proses tidak terkendali → investigasi, bukan diam." },
          { kind: "forbids", task: "t1", token: "numpy", label: "Lab murni stdlib", msg: "Lab ini memakai statistics stdlib saja — tanpa numpy." },
        ],
      },
      reference: "Batas dari acuan bersih → aturan 1 untuk teriakan → aturan 2 untuk bau hangus.",
    },
    {
      id: "chart-spc",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca control chart seperti inspektur",
      prose: [
        "Chart di bawah: 25 titik waktu proses harian. Garis solid = garis tengah 45,2; garis putus-putus merah = batas kontrol ±3σ (50,7 / 39,7); garis titik-titik = zona ±2σ.",
        "Cara membaca: sumbu X = hari ke-1 s.d. 25; sumbu Y = menit. Titik merah besar di hari ke-12 menembus UCL; tiga titik berbingkai oranye (hari 18–20) duduk di antara garis +2σ dan UCL — di dalam batas 3σ, tetapi di luar batas 2σ secara beruntun.",
        "Interpretasi: rata-rata 25 hari (47,6) terlihat 'baik-baik saja', tetapi chart menunjukkan DUA cerita: satu insiden akut (hari 12 — investigasi: apa yang terjadi?) dan satu pergeseran halus (hari 18–20 — apakah ini awal tren naik?). Keputusan: jangan tutup bulan dengan 'rata-rata aman'; buka chart-nya, dan untuk hari 18–20, mulai pantau harian — bila berlanjut 2 hari lagi, eskalasi SEBELUM menjadi hari ke-12 berikutnya.",
      ],
      figure: {
        svg: SPC_SVG,
        alt: "Control chart 25 hari: titik hari ke-12 di atas UCL; titik hari 18-20 di zona 2-sigma.",
        caption: "Satu teriakan (hari 12) dan satu bau hangus (hari 18–20) — keduanya tak terlihat dari rata-rata.",
      },
      tasks: [],
      note: {
        title: "Intuisi: chart ini menjelaskan kenapa KPI rata-rata berbahaya",
        body: "Dasbor KPI menampilkan rata-rata — satu angka yang menghaluskan segalanya. Control chart menampilkan SEBARAN terhadap waktu — ia menjawab 'apakah masih sama seperti kemarin?'. Tiga heuristik. Pertama: KPI rata-rata untuk laporan, control chart untuk pengawasan — beda pertanyaan, beda alat. Kedua: alarm palsu itu murah (investigasi 15 menit), bencana yang terlewat itu mahal. Ketiga: bila chart-mu 'terlalu bersih' (tidak ada titik di dekat batas selama berbulan-bulan), curigai datanya — proses nyata selalu punya bisikan.",
      },
      reference: "Rata-rata untuk laporan; control chart untuk pengawasan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "SPC, ambang alert, atau cukup rata-rata?",
      prose: [
        "Lima skenario pemilihan alat pengawasan proses:",
        "Skenario 1 — Proses berulang dengan volume cukup (puluhan observasi per periode): waktu proses, defect rate, waktu tunggu. → Control chart (X-bar / p-chart). Alasan: butuh pemisah noise vs sinyal yang prinsipil, bukan ambang tebakan.",
        "Skenario 2 — Butuh alarm biner cepat ('server down!'). → Alert ambang, bukan SPC. Alasan: SPC butuh baseline dan pola; untuk kegagalan biner, ambang langsung lebih cepat.",
        "Skenario 3 — Data jarang (1 observasi per minggu) atau proses baru tanpa histori sehat. → Jangan SPC dulu; kumpulkan baseline 20–25 titik. Alasan: batas dari 5 titik adalah fiksi berlabel statistik.",
        "Skenario 4 — Data proporsi (persen gagal bayar, persen klaim ditolak). → p-chart: batas = p ± 3√(p(1−p)/n). Alasan: sebaran binomial, bukan normal — rumus X-bar salah kaprah di sini.",
        "Skenario 5 — Proses memang musiman/tren (penjualan ritel Desember). → Dekomposisi dulu (buang musiman), SPC atas residual. Alasan: chart atas data mentah akan berteriak setiap Desember — alarm yang benar-benar diabaikan.",
        "Aturan praktis 10 detik: berulang + cukup data → control chart. Biner/mendesak → alert ambang. Data jarang → kumpulkan dulu. Proporsi → p-chart. Musiman → residual dulu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: memasang SPC lalu tidak pernah melihatnya",
        type: "pitfall",
        body: "Control chart yang tidak dibuka sama dengan tidak ada. Tetapkan RITME: siapa melihat chart ini, kapan, dan apa yang ia lakukan bila ada titik merah. Chart tanpa pemilik dan tanpa respons = dekorasi dinding. SPC adalah sistem sosio-teknis: separuh statistik, separuh disiplin.",
      },
      reference: "Chart tanpa ritme tinjauan = dekorasi.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Call center: handle time merangkak naik",
      prose: [
        "Skenario (sintetis, untuk latihan): call center 'BantuKu' memantau rata-rata handle time (AHT) mingguan: 6,2 – 6,1 – 6,4 – 6,3 – 6,8 – 7,1 – 7,4 menit selama 7 minggu. Target < 7 menit. Manajer minggu ke-5 berkata 'masih fluktuasi normal'; minggu ke-7 AHT 7,4 melewati target dan ia memarahi tim.",
        "Pertanyaan analisis: (1) Dengan pendekatan SPC, kapan seharusnya alarm berbunyi? (2) Apa kesalahan manajer di minggu ke-5 dan ke-7? (3) Rancangan chart yang benar?",
        "Pembahasan: (1) Ambil 4 minggu pertama sebagai acuan kasar: rata-rata ≈ 6,25, σ ≈ 0,13 → +2σ ≈ 6,5. Minggu ke-5 (6,8), 6 (7,1), 7 (7,4): tiga beruntun di atas +2σ — aturan 2 berbunyi di minggu ke-7 (bahkan minggu ke-6 sudah 2-dari-3). Alarm seharusnya di minggu ke-6, bukan menunggu target jebol. (2) Minggu ke-5: mengabaikan sinyal awal ('fluktuasi normal' tanpa chart = tebakan). Minggu ke-7: memarahi tim atas special cause — bila penyebabnya sistem (mis. aplikasi baru yang lambat), memarahi orang adalah tampering. (3) X-bar chart mingguan dengan baseline 8–12 minggu sehat + aturan 1 dan 2 + ritme tinjauan: siapa yang melihat tiap Senin pagi dan apa tindak lanjutnya.",
        "Catatan desain: dengan hanya 7 titik, baseline 4 minggu itu lemah — vonisnya 'indikasi awal, kumpulkan data'. SPC yang jujur mengakui keterbatasannya; analis yang baik menyampaikan 'sinyal awal, belum vonis final' daripada diam atau menghakimi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Handle time yang merangkak = biaya operasional yang merangkak + kepuasan yang merosot — keduanya risiko yang 'tiba-tiba' hanya bagi yang tidak mengawasi. Dalam risk management, SPC adalah alat deteksi dini untuk risiko operasional: ia mengubah kerugian yang 'tak terduga' menjadi tren yang 'sudah terlihat tiga minggu lalu'.",
      },
      reference: "Alarm di minggu ke-6 (aturan 2), bukan saat target jebol. Marahi sistem, bukan orang.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Common cause = goyangan inheren (diam); special cause = penyebab teridentifikasi (investigasi).",
        "Batas kontrol dari periode acuan BERSIH: CL = x̄, UCL/LCL = x̄ ± 3σ.",
        "Aturan 1: satu titik di luar 3σ. Aturan 2: 2 dari 3 beruntun di luar 2σ searah — menangkap pergeseran halus.",
        "Batas kontrol ≠ SLA: terkendali belum tentu capable.",
        "Tampering (bereaksi pada bisikan) menambah variasi; chart butuh ritme tinjauan dan pemilik.",
      ],
      quiz: [
        {
          q: "Periode acuan: x̄ = 45,18, σ = 1,83. UCL dan LCL?",
          options: [
            { text: "UCL 50,68; LCL 39,68 — dari 45,18 ± 3 × 1,83", why: "Benar: persis perhitungan lab. Hafalkan polanya, bukan angkanya.", correct: true },
            { text: "UCL 48,84; LCL 41,52 — dari ±2σ", why: "Salah: itu garis peringatan 2σ (untuk aturan 2), bukan batas kontrol.", correct: false },
            { text: "UCL 60; LCL 30 — dari SLA", why: "Salah: SLA bukan batas kontrol. Mencampur keduanya adalah mitos Langkah 3.", correct: false },
            { text: "UCL 65,6 — dari σ seluruh 25 hari", why: "Salah: σ dari data kotor (termasuk anomali) membengkak dan menyembunyikan anomali itu sendiri.", correct: false },
          ],
        },
        {
          q: "Titik 68 menit dengan UCL 50,68. Statusnya?",
          options: [
            { text: "Special cause (aturan 1) — investigasi penyebabnya", why: "Benar: di luar 3σ, peluang kebetulan 0,27%. Ini teriakan, bukan bisikan.", correct: true },
            { text: "Common cause — masih dalam batas wajar", why: "Salah: 68 > 50,68 — ia JELAS di luar batas.", correct: false },
            { text: "Abaikan — rata-rata keseluruhan masih 47,6", why: "Salah: inilah dosa Bank Nusa — rata-rata menelan sinyal.", correct: false },
            { text: "Sesuaikan proses agar besok tidak 68 lagi", why: "Salah arah: 'sesuaikan' tanpa tahu penyebab = tampering. Investigasi dulu, bertindak kemudian.", correct: false },
          ],
        },
        {
          q: "Hari 18–20 mencatat 49; 49,5; 49 dengan UCL 50,68 dan +2σ 48,84. Vonis?",
          options: [
            { text: "Melanggar aturan 2 (2-dari-3 di luar +2σ searah) — pergeseran halus, pantau ketat", why: "Benar: ketiganya di atas 48,84 tetapi di bawah UCL — aturan 1 diam, aturan 2 berbunyi. Inilah gunanya radar bau hangus.", correct: true },
            { text: "Aman — tidak ada yang melewati UCL", why: "Salah: 'aman' hanya menurut aturan 1. Aturan 2 dirancang persis untuk kasus ini.", correct: false },
            { text: "Special cause aturan 1", why: "Salah: tidak ada yang > 50,68. Jangan paksa klasifikasi.", correct: false },
            { text: "Common cause — tiga hari belum pola", why: "Salah: tiga beruntun di zona 2σ punya peluang kebetulan ~0,3% — itu DEFINISI pola.", correct: false },
          ],
        },
        {
          q: "Manajer memarahi staf setiap ada hari di atas rata-rata (tetapi masih dalam batas kontrol). Ini adalah...",
          options: [
            { text: "Tampering — bereaksi pada common cause, justru menambah variasi", why: "Benar: Deming's funnel experiment membuktikan penyesuaian pada noise memperbesar goyangan. Aturannya: dalam batas = diam.", correct: true },
            { text: "Praktik SPC yang baik — disiplin itu penting", why: "Salah: disiplin yang salah sasaran = tampering. Disiplin SPC = patuhi ATURAN, bukan patuhi emosi.", correct: false },
            { text: "Tidak masalah selama target tercapai", why: "Salah: target tercapai HARI INI; tampering menaikkan variasi dan merusak target BESOK.", correct: false },
            { text: "Contoh aturan Western Electric", why: "Salah: aturan WE justru MELARANG reaksi pada titik dalam batas.", correct: false },
          ],
        },
        {
          q: "Proses stabil dalam batas kontrol, tetapi UCL/LCL lebih lebar dari SLA. Artinya?",
          options: [
            { text: "Terkendali tetapi tidak capable — stabil-stabil gagal memenuhi janji; perlu perbaikan proses, bukan pengawasan", why: "Benar: inilah beda suara proses vs suara pelanggan. Solusinya redesign (kurangi variasi inheren), bukan alarm.", correct: true },
            { text: "Sempurna — tidak ada yang perlu dilakukan", why: "Salah: 'terkendali' ≠ 'memuaskan pelanggan'.", correct: false },
            { text: "Batas kontrol salah hitung", why: "Salah: batas dihitung benar dari data; masalahnya ekspektasi (SLA) vs kemampuan.", correct: false },
            { text: "Naikkan SLA agar sesuai kemampuan", why: "Salah: menurunkan standar agar terlihat bagus = kecurangan metrik, bukan perbaikan.", correct: false },
          ],
        },
        {
          q: "Kapan control chart TIDAK tepat dipakai?",
          options: [
            { text: "Data penjualan ritel musiman yang di-chart mentah tanpa dekomposisi", why: "Benar: chart akan berteriak tiap Desember — alarm yang diabaikan = sistem yang mati. Buang musiman dulu, chart atas residual.", correct: true },
            { text: "Waktu proses klaim harian bank", why: "Salah: ini kasus ideal — berulang, cukup data, ingin stabil.", correct: false },
            { text: "Defect rate produksi dengan 100+ unit per hari", why: "Salah: pakai p-chart — sangat tepat.", correct: false },
            { text: "Waktu tunggu antrian layanan", why: "Salah: proses berulang yang ingin dijaga stabil — kandidat SPC.", correct: false },
          ],
        },
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};
