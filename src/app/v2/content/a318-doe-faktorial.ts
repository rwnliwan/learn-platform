import type { V2Lesson } from "../lib/types";

// ── Figure: interaction plot 2^2 — garis tidak sejajar = ada interaksi ────
// B=-1 (malam): 7,03 -> 10,40 ; B=+1 (pagi): 7,69 -> 14,89 (data lab, seed 318)
const INTERACT_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Plot interaksi: dua garis tidak sejajar">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="250" x2="530" y2="250"/>
<line x1="60" y1="200" x2="530" y2="200"/><line x1="60" y1="150" x2="530" y2="150"/>
<line x1="60" y1="100" x2="530" y2="100"/><line x1="60" y1="50" x2="530" y2="50"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="253">5</text><text x="54" y="203">8</text><text x="54" y="153">11</text>
<text x="54" y="103">14</text><text x="54" y="53">17</text>
</g>
<line x1="150" y1="213" x2="450" y2="152" stroke="var(--chart-text)" stroke-width="2.5"/>
<line x1="150" y1="201" x2="450" y2="70" stroke="var(--c2)" stroke-width="2.5"/>
<g font-size="12" font-family="var(--font-ui)" font-weight="600">
<circle cx="150" cy="213" r="6" fill="var(--chart-text)"/><text x="150" y="232" text-anchor="middle" fill="var(--text)">7,0</text>
<circle cx="450" cy="152" r="6" fill="var(--chart-text)"/><text x="450" y="171" text-anchor="middle" fill="var(--text)">10,4</text>
<circle cx="150" cy="201" r="6" fill="var(--c2)"/><text x="150" y="190" text-anchor="middle" fill="var(--text)">7,7</text>
<circle cx="450" cy="70" r="6" fill="var(--c2)"/><text x="450" y="59" text-anchor="middle" fill="var(--text)">14,9</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<text x="470" y="140" fill="var(--chart-text)">B = malam</text>
<text x="470" y="66" fill="var(--c2)">B = pagi</text>
<text x="150" y="272" text-anchor="middle" fill="var(--text)">A = diskon 5%</text>
<text x="450" y="272" text-anchor="middle" fill="var(--text)">A = diskon 10%</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="60" y="20">konversi (%)</text><text x="430" y="290">data sintetis lab</text>
</g>
</svg>`;

export const a318: V2Lesson = {
  slug: "a318-doe-faktorial",
  track: "Statistika",
  module: "Eksperimen & Kausalitas",
  title: "Design of Experiments: Rancangan Faktorial, Blocking & Taguchi — Melampaui A/B Testing",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tombol hijau yang menang — sampai diluncurkan",
      prose: [
        "Tim produk sebuah bank digital menjalankan A/B test klasik: tombol hijau vs tombol biru di halaman pengajuan kartu kredit. Setelah dua minggu, hijau menang signifikan: konversi naik 8%. Tombol hijau diluncurkan ke 100% pengguna. Sebulan kemudian, konversi keseluruhan... tidak berubah. Tidak naik 8%, tidak turun — datar. Tim data dituduh salah hitung; tim produk dituduh salah implementasi. Keduanya benar — yang salah adalah eksperimennya.",
        "Twist-nya: audit log menunjukkan kemenangan tombol hijau HANYA terjadi pada pengguna yang membuka email promo di pagi hari. Pada pengguna malam hari, tombol biru yang menang. A/B test dua-grup meratakan keduanya menjadi kemenangan hijau yang semu — karena ia buta terhadap interaksi antara warna tombol dan waktu email. Ketika diluncurkan ke semua pengguna (pagi dan malam), efeknya saling meniadakan.",
        "Lesson ini tentang Design of Experiments (NIST/SEMATECH e-Handbook, bagian 4.3.1): rancangan faktorial yang menguji BEBERAPA faktor sekaligus dan justru MEMBURU interaksi; blocking yang menjinakkan gangguan; dan metode Taguchi untuk membuat produk kebal terhadap noise. A/B testing hanyalah kasus paling sederhana — dan sering kali terlalu sederhana.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "Keputusan risiko penuh eksperimen multi-faktor: limit x tenor x channel penawaran; model skoring x threshold x segmen; strategi koleksi x waktu kontak x kanal. Menjalankan A/B satu faktor per satu bukan hanya lambat — ia sistematis melewatkan interaksi, yaitu tepat di mana kejutan mahal bersembunyi (seperti tombol hijau di atas).",
      },
      reference: "A/B test = faktorial 2^1. Dunia nyata = banyak faktor yang berinteraksi. DOE = cara mengujinya sekaligus dengan benar.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan keterbatasan A/B dua-grup dan kapan ia menyesatkan; (2) merancang eksperimen faktorial 2^k lengkap dengan pengacakan dan replikasi; (3) menghitung efek utama dan efek interaksi dari tabel hasil; (4) memakai blocking untuk mengendalikan sumber gangguan yang diketahui; (5) menjelaskan ide Taguchi: merancang agar robust terhadap noise, bukan sekadar mengoptimalkan rata-rata.",
        "Rutenya: cerita, bekal ringkas, dua konsep (faktorial; blocking dan Taguchi), lab Pyodide (mesin efek), chart interaksi dengan panduan baca, peta keputusan, mini-case limit x tenor, kuis, rangkuman. Estimasi 52 menit; lab-nya sekitar 12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, A/B testing: dua grup (kontrol vs perlakuan), pengacakan, lalu uji beda proporsi atau rata-rata — sah untuk SATU faktor dengan DUA level. Kedua, uji hipotesis: efek dinyatakan nyata bila tidak bisa dijelaskan oleh kebetulan saja (p-value kecil / interval tidak mencakup nol). Ketiga, ANOVA: mengurai variansi total menjadi kontribusi tiap sumber — logika yang sama dipakai DOE untuk memisahkan efek A, efek B, dan interaksi AB.",
      ],
      tasks: [],
      hints: [
        "Intuisi pembuka: A/B testing menjawab apakah satu tuas berpengaruh. DOE menjawab tuas mana, seberapa besar, dan — yang paling berharga — kombinasi tuas mana yang saling menguatkan atau saling membatalkan.",
      ],
      reference: "Bekal: (1) A/B = satu faktor dua level; (2) uji hipotesis = sinyal vs noise; (3) ANOVA = mengurai variansi per sumber.",
    },
    {
      id: "konsep-faktorial",
      eyebrow: "Langkah 3 · Konsep",
      title: "Rancangan faktorial — Si Pemburu Interaksi",
      prose: [
        "Definisi: rancangan faktorial 2^k menguji k faktor, masing-masing dengan 2 level (rendah −1 / tinggi +1), pada SEMUA kombinasi — total 2^k sel perlakuan. Untuk k=2 (faktor A = diskon, faktor B = waktu email): 4 sel, yaitu (−,−), (+,−), (−,+), (+,+). Efek utama A = rata-rata respons saat A tinggi minus rata-rata saat A rendah (dirata-ratakan atas kedua level B); efek utama B analog. Efek INTERAKSI AB = setengah selisih dari selisih: (efek A saat B tinggi) minus (efek A saat B rendah). Bila AB ≠ 0, efek A TERGANTUNG pada level B — inilah yang tidak terlihat oleh A/B biasa.",
        "Kepribadiannya: faktorial seperti koki yang tidak mencicipi garam dan gula terpisah lalu menebak rasanya dicampur — ia mencicipi SEMUA kombinasi. A/B testing mencicipi garam-vs-tanpa-garam sambil gulanya tetap; faktorial mencicipi garam×gula sekaligus dan menemukan bahwa garam memperkuat manis pada kue tetapi merusak pada kopi (interaksi!). Tiga prinsip DOE yang menjaganya jujur: pengacakan (randomisasi urutan/unit agar bias tersebar), replikasi (tiap sel diulang agar noise terukur), dan blocking (lihat Langkah 4).",
        "Kapan memakai: (1) kamu punya 2–4 faktor yang diduga berinteraksi; (2) biaya per kombinasi terjangkau (digital: murah; manufaktur: mahal — di sinilah Taguchi masuk); (3) kamu butuh jawaban CEPAT — satu eksperimen 2^3 (8 sel) menggantikan tiga A/B berurutan DAN memberi bonus interaksi. Efisiensi faktorial bersifat matematis: tiap observasi dipakai untuk mengestimasi SEMUA efek sekaligus, bukan satu efek.",
      ],
      formula: String.raw`\text{Efek}_A = \bar{y}_{A+} - \bar{y}_{A-}, \qquad \text{Efek}_{AB} = \frac{(\bar{y}_{++} - \bar{y}_{-+}) - (\bar{y}_{+-} - \bar{y}_{--})}{2}`,
      formulaNote: "y-bar_A+ = rata-rata respons semua sel dengan A di level tinggi (+1), dirata-ratakan atas level B; y-bar_A− analog. Untuk interaksi: y-bar_{++} = rata-rata sel (A+,B+), dan seterusnya. Contoh angka dari lab (konversi %): sel (−,−)=7,03; (+,−)=10,40; (−,+)=7,69; (+,+)=14,89. Efek A = (10,40+14,89)/2 − (7,03+7,69)/2 = 12,65 − 7,36 = 5,29 poin. Efek AB = ((14,89−7,69) − (10,40−7,03))/2 = (7,20 − 3,37)/2 = 1,91: diskon 10% JAUH lebih ampuh bila email dikirim pagi — interaksi positif yang mengubah keputusan.",
      tasks: [],
      note: {
        title: "🚨 Mitos: faktorial 2^2 butuh 4 kali sampel dibanding A/B",
        type: "pitfall",
        body: "Yang benar: dengan total sampel SAMA, faktorial memberi presisi efek utama yang SAMA dengan A/B — karena tiap efek diestimasi dari seluruh N observasi (setengah di +, setengah di −). Kamu tidak membayar 4x; kamu mendapat 2 efek utama + 1 interaksi dengan harga 1 eksperimen. Yang mahal hanyalah operasional menjalankan 4 varian, bukan statistiknya.",
      },
      hints: [
        "💡 Intuisi: kodekan level sebagai −1/+1 (bukan 0/1). Dengan kode ini, efek = 2 kali koefisien regresi, dan kolom-kolom desain saling ortogonal — efek A, B, AB terestimasi independen satu sama lain. Inilah keindahan matematis faktorial.",
      ],
      reference: "2^k sel, semua kombinasi. Efek utama = beda rata-rata level; interaksi = efek yang tergantung level faktor lain.",
    },
    {
      id: "konsep-blocking",
      eyebrow: "Langkah 4 · Konsep",
      title: "Blocking & Taguchi — Si Penjinak Gangguan",
      prose: [
        "Definisi blocking: kelompokkan unit eksperimen ke dalam blok-blok homogen berdasarkan sumber gangguan yang DIKETAHUI tetapi tidak diteliti (misalnya hari kerja vs akhir pekan, region, vintage nasabah), lalu jalankan SEMUA kombinasi perlakuan di dalam tiap blok. Gangguan antar-blok terserap oleh efek blok — tidak lagi mengotori perbandingan perlakuan. Ini seperti menimbang dua koki dengan timbangan yang sama di dapur yang sama, bukan satu di dapur panas dan satu di dapur dingin.",
        "Definisi Taguchi (Genichi Taguchi): rancangan robust — bukan mengoptimalkan rata-rata respons, melainkan MEMINIMALKAN sensitivitas terhadap noise. Taguchi memakai array ortogonal (misalnya L8 untuk 7 faktor 2-level hanya dalam 8 run — faktorial fraksional cerdas) dan rasio signal-to-noise sebagai kriteria: pilih setting faktor yang hasilnya bagus DAN stabil di berbagai kondisi noise (suhu, kelembapan, perilaku pengguna). Filosofinya terbalik dari A/B: bukan mencari pemenang dalam kondisi lab, melainkan mencari yang tidak kalah dalam kondisi berantakan.",
        "Kapan memakai: blocking — (1) ada gangguan diketahui yang besar (musiman, region, batch produksi); (2) unit terbatas sehingga tiap sumber variansi harus dikendalikan, bukan dibiarkan jadi noise. Taguchi — (1) eksperimen fisik mahal (tiap run = jutaan rupiah); (2) tujuanmu robustness: formulasi kredit yang tetap baik saat ekonomi bergoyang, template email yang tetap konvert di semua segmen. Catatan jujur: Taguchi kontroversial di kalangan statistikawan (interaksi dikorbankan demi efisiensi run) — pakai untuk screening dan robustness, bukan untuk inferensi interaksi yang presisi.",
      ],
      formula: String.raw`y_{ijk} = \mu + \tau_i + \beta_j + \varepsilon_{ijk}`,
      formulaNote: "Model blok acak: y_ijk = respons; mu = rata-rata umum; tau_i = efek perlakuan i (yang diteliti); beta_j = efek blok j (gangguan yang dikendalikan — hari, region, batch); epsilon = noise sisa. Dengan memasukkan beta_j, variansi yang tadinya menggelembungkan epsilon kini dijelaskan blok — uji perlakuan menjadi lebih tajam TANPA menambah sampel. Syarat: perlakuan diacak DI DALAM tiap blok.",
      tasks: [],
      note: {
        title: "🚨 Mitos: blocking = menambah variabel kontrol di regresi, sama saja",
        type: "pitfall",
        body: "Yang benar: mirip tetapi tidak sama. Kontrol di regresi observasional hanya bisa mengendalikan yang TERUKUR dan tetap rentan confounding tak terukur. Blocking adalah DESAIN: ia memaksa perbandingan dilakukan di dalam grup homogen SEBELUM data dikumpulkan, sehingga gangguan — terukur maupun tidak, selama konstan dalam blok — tereliminasi secara desain, bukan secara doa.",
      },
      hints: [
        "💡 Intuisi blocking: kalau kamu tahu besok hujan dan lusa cerah, jangan uji payung-vs-tanpa-payung dengan semua uji payung besok dan semua tanpa-payung lusa. Uji keduanya di KEDUA hari — hari adalah blok.",
        "💡 Intuisi Taguchi: A/B mencari juara di arena yang steril; Taguchi mencari petarung jalanan yang menang di arena mana pun. Untuk produk yang hidup di dunia berantakan, petarung jalanan lebih berharga.",
      ],
      reference: "Blocking = kendalikan gangguan via desain. Taguchi = optimalkan robustness (signal-to-noise), bukan rata-rata.",
    },
    {
      id: "lab-efek",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Bangun mesin efek faktorial",
      prose: [
        "Waktunya jadi eksperimenter. Data di bawah mensimulasikan eksperimen 2^2: A = diskon (−1 berarti 5%, +1 berarti 10%), B = waktu email (−1 malam, +1 pagi), respons = konversi (%). Tiap sel diulang 6 kali (replikasi). Tugasmu: hitung efek utama A, efek utama B, efek interaksi AB dari rata-rata sel — lalu tentukan kombinasi terbaik.",
        "Coba: setelah lolos, ubah effAB = 1.0 menjadi effAB = -2.5 (interaksi negatif kuat). Kombinasi terbaik berubah ke mana? Itulah pelajaran interaksi: tanpa mengukurnya, kamu bisa meluncurkan kombinasi yang saling membatalkan — seperti tombol hijau di cerita pembuka.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `cell_means` = rata-rata tiap sel (axis=1), lalu `eff_A` = (sel10+sel11)/2 − (sel00+sel01)/2" },
        { id: "t2", text: "Hitung `eff_B` = (sel01+sel11)/2 − (sel00+sel10)/2" },
        { id: "t3", text: "Hitung `eff_AB` = (sel00+sel11)/2 − (sel10+sel01)/2" },
        { id: "t4", text: "Tentukan `best` = kombinasi (A,B) dengan rata-rata sel tertinggi, lalu cetak ringkasannya" },
      ],
      requires: ["numpy"],
      expected: "eff_A=5.29\neff_B=2.58\neff_AB=1.91\nterbaik=(1, 1)",
      code: {
        starter: `import numpy as np
rng = np.random.default_rng(318)
# A: diskon (-1 = 5%, +1 = 10%) ; B: jam email (-1 = malam, +1 = pagi)
base, effA, effB, effAB = 10.0, 3.0, 1.5, 1.0   # efek sebenarnya (tak terlihat)
cells = [(-1, -1), (1, -1), (-1, 1), (1, 1)]
reps = 6
Y = np.array([rng.normal(base + effA*a + effB*b + effAB*a*b, 1.0, reps)
              for (a, b) in cells])             # 4 sel x 6 ulangan

# TULIS KODEMU di bawah ini
cell_means =
eff_A =
eff_B =
eff_AB =
best =

print(f"eff_A={eff_A:.2f}")
print(f"eff_B={eff_B:.2f}")
print(f"eff_AB={eff_AB:.2f}")
print(f"terbaik={best}")`,
        lockLines: 9,
        solution: `import numpy as np
rng = np.random.default_rng(318)
# A: diskon (-1 = 5%, +1 = 10%) ; B: jam email (-1 = malam, +1 = pagi)
base, effA, effB, effAB = 10.0, 3.0, 1.5, 1.0   # efek sebenarnya (tak terlihat)
cells = [(-1, -1), (1, -1), (-1, 1), (1, 1)]
reps = 6
Y = np.array([rng.normal(base + effA*a + effB*b + effAB*a*b, 1.0, reps)
              for (a, b) in cells])             # 4 sel x 6 ulangan

# TULIS KODEMU di bawah ini
cell_means = Y.mean(axis=1)
eff_A = (cell_means[1] + cell_means[3]) / 2 - (cell_means[0] + cell_means[2]) / 2
eff_B = (cell_means[2] + cell_means[3]) / 2 - (cell_means[0] + cell_means[1]) / 2
eff_AB = (cell_means[0] + cell_means[3]) / 2 - (cell_means[1] + cell_means[2]) / 2
best = cells[int(np.argmax(cell_means))]

print(f"eff_A={eff_A:.2f}")
print(f"eff_B={eff_B:.2f}")
print(f"eff_AB={eff_AB:.2f}")
print(f"terbaik={best}")`,
        checks: [
          { kind: "equal", task: "t1", name: "eff_A", value: 5.2873, tol: 0.01, label: "`eff_A` ≈ 5,29", msg: "Efek utama A = rata-rata sel A+ minus rata-rata sel A−." },
          { kind: "equal", task: "t2", name: "eff_B", value: 2.5796, tol: 0.01, label: "`eff_B` ≈ 2,58", msg: "Efek utama B = rata-rata sel B+ minus rata-rata sel B−." },
          { kind: "equal", task: "t3", name: "eff_AB", value: 1.9142, tol: 0.01, label: "`eff_AB` ≈ 1,91", msg: "Interaksi AB = setengah selisih dari selisih — positif berarti saling menguatkan." },
          { kind: "stdout_matches", task: "t4", pattern: "terbaik=\\(1, 1\\)", label: "Kombinasi terbaik tercetak", msg: "Sel (A+,B+) = diskon 10% + email pagi = rata-rata tertinggi." },
        ],
      },
      reference: "Satu eksperimen 2^2 = 2 efek utama + 1 interaksi, semuanya dari N observasi yang sama.",
    },
    {
      id: "chart-interaksi",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca plot interaksi seperti insinyur eksperimen",
      prose: [
        "Chart di bawah adalah interaction plot dari lab-mu: sumbu X = level faktor A (diskon), dua garis = level faktor B (waktu email), sumbu Y = konversi rata-rata tiap sel.",
        "Cara membaca: tiap titik = rata-rata satu sel; garis menghubungkan level A yang sama untuk B tertentu. Kunci bacanya adalah KEMIRINGAN relatif: garis sejajar berarti tidak ada interaksi; garis tidak sejajar (berpotongan atau melebar) berarti ada interaksi.",
        "Interpretasi: garis B=pagi (biru) JAUH lebih curam dari garis B=malam (abu-abu) — menaikkan diskon dari 5% ke 10% menambah 3,4 poin konversi bila email dikirim malam, tetapi 7,2 poin bila dikirim pagi. Inilah interaksi +1,91 yang kamu hitung: efek diskon TERGANTUNG waktu kirim. Keputusan bisnisnya: jangan luncurkan diskon 10% sendirian — pasangkan dengan email pagi, atau setengah efeknya hilang. Pelajaran chart ini: plot interaksi mengubah tabel angka menjadi keputusan dalam 5 detik.",
      ],
      figure: {
        svg: INTERACT_SVG,
        alt: "Plot interaksi: garis B=pagi jauh lebih curam daripada garis B=malam — efek diskon tergantung waktu kirim email.",
        caption: "Interaction plot A (diskon) × B (waktu email). Garis tidak sejajar = interaksi.",
      },
      tasks: [],
      note: {
        title: "Intuisi: garis sejajar berarti dunia sederhana",
        body: "Interaction plot dibaca dalam 5 detik: garis sejajar = tidak ada interaksi = efek berdiri sendiri; garis tidak sejajar = ada interaksi = keputusan harus kombinasi. Tiga heuristik. Pertama: interaksi negatif adalah pembunuh diam-diam — dua kebijakan yang masing-masing baik bisa saling membatalkan saat digabung (limit besar + tenor panjang). Faktorial adalah satu-satunya cara murah melihat kombinasi SEBELUM diluncurkan. Kedua: jangan pernah meluncurkan kombinasi (+,+) hanya karena kedua efek utama positif — cek selnya langsung. Efek utama adalah rata-rata; keputusan adalah sel spesifik. Ketiga: blocking mengendalikan yang diketahui via desain; randomisasi melindungimu dari yang tidak diketahui. Keduanya wajib, tidak saling menggantikan. Aturan praktis: eksperimen tanpa replikasi sejati = anekdot berstatistik — ulangan independen tiap sel adalah harga kepercayaan pada uji signifikansi.",
      },
      reference: "Sejajar = tidak ada interaksi. Tidak sejajar = efek satu faktor tergantung faktor lain.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Satu faktor, banyak faktor, atau Taguchi?",
      prose: [
        "Lima skenario pemilihan rancangan:",
        "Skenario 1 — Satu faktor, dua level, tidak ada interaksi yang dicurigai (ganti warna tombol, semua else equal). → A/B testing klasik. Alasan: DOE penuh mubazir bila memang hanya satu tuas yang dipertaruhkan.",
        "Skenario 2 — Dua sampai empat faktor digital yang diduga berinteraksi (diskon x waktu x channel). → Faktorial penuh 2^k dengan replikasi. Alasan: satu eksperimen memberi semua efek utama + semua interaksi; tiap observasi dipakai berkali-kali secara matematis.",
        "Skenario 3 — Ada gangguan besar yang diketahui (weekday vs weekend, region). → Faktorial + blocking: jalankan semua sel di dalam tiap blok. Alasan: gangguan terserap efek blok; perbandingan perlakuan menjadi tajam tanpa menambah sampel.",
        "Skenario 4 — Eksperimen fisik mahal, 7 faktor, tiap run jutaan rupiah, tujuan = setting yang stabil. → Taguchi array ortogonal (mis. L8) + kriteria signal-to-noise. Alasan: 8 run untuk 7 faktor — mustahil dengan faktorial penuh (128 sel); bayarannya: interaksi dikorbankan, jadi pakai untuk screening dan robustness, bukan inferensi presisi.",
        "Skenario 5 — Banyak faktor tetapi hanya sedikit yang benar-benar berpengaruh (dugaan sparsity). → Faktorial fraksional 2^(k−p) untuk screening, lalu faktorial penuh pada faktor yang lolos. Alasan: prinsip sparsity of effects — dari 10 faktor biasanya hanya 2–3 yang aktif; jangan bayar 1.024 sel untuk menemukannya.",
        "Aturan praktis 10 detik: 1 faktor → A/B; 2–4 faktor + curiga interaksi → faktorial penuh; gangguan diketahui → tambah blocking; run mahal + butuh robust → Taguchi; banyak faktor → fraksional screening dulu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: menjalankan A/B berurutan untuk tiap faktor",
        type: "pitfall",
        body: "Uji A lalu uji B lalu uji C terlihat hemat, tetapi tiga masalah: (1) total waktu 3x lipat; (2) interaksi A×B tidak pernah terukur — padahal bisa membatalkan efek (tombol hijau!); (3) kondisi berubah antar-periode sehingga hasil tidak comparable. Faktorial menguji semuanya dalam SATU periode yang sama.",
      },
      reference: "A/B berurutan = lambat + buta interaksi + tidak comparable. Faktorial = sekaligus + interaksi + satu periode.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Limit x tenor: siapa membatalkan siapa?",
      prose: [
        "Skenario (sintetis, untuk latihan): Bank ingin menaikkan penyaluran KTA. Dua faktor dipertimbangkan: A = limit (5 juta vs 15 juta), B = tenor (12 vs 36 bulan). Eksperimen 2^2 pada 4.000 nasabah acak (1.000 per sel) menghasilkan take-up rate: (−,−) = 12%, (+,−) = 18%, (−,+) = 14%, (+,+) = 16%. Tim produk membaca: efek limit +4 poin (rata-rata), efek tenor +1 poin — lalu mengusulkan luncurkan limit 15 juta + tenor 36 bulan (kombinasi +,+).",
        "Pertanyaan analisis: (1) Hitung efek interaksi AB. (2) Apakah kombinasi (+,+) memang terbaik? (3) Apa rekomendasi yang benar — dan apa yang terjadi bila bank meluncurkan (+,+) tanpa melihat interaksi?",
        "Pembahasan: (1) AB = ((12 + 16) − (18 + 14))/2 = (28 − 32)/2 = −2 poin — interaksi NEGATIF. (2) Tidak: sel (+,−) = 18% adalah yang tertinggi. Kombinasi (+,+) = 16% kalah 2 poin darinya. (3) Rekomendasi: luncurkan limit 15 juta dengan tenor 12 bulan. Mekanismenya masuk akal: limit besar + tenor panjang = cicilan tetap ringan tetapi total bunga menakutkan — nasabah sensitif pada total biaya. Bila bank meluncurkan (+,+) buta interaksi, ia kehilangan 2 poin take-up di SELURUH portofolio — pada 100 ribu nasabah, itu 2.000 nasabah hilang karena satu angka yang tidak dihitung.",
        "Catatan desain: eksperimen ini memakai blocking implisit — keempat sel dijalankan pada periode yang sama sehingga kondisi ekonomi tidak mengotori perbandingan. A/B berurutan (uji limit bulan Januari, uji tenor bulan Maret) akan mencampur efek musim dengan efek perlakuan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Interaksi negatif seperti ini adalah pola berbahaya di risiko: dua kebijakan yang masing-masing baik (limit besar menaikkan take-up; tenor panjang menaikkan take-up) menjadi buruk saat digabung. Tanpa DOE, komite menyetujui keduanya terpisah — dan portofolio menanggung kombinasinya. Faktorial adalah satu-satunya cara murah untuk melihat kombinasi SEBELUM diluncurkan.",
      },
      reference: "Dua kebijakan baik-baik saja bisa saling membatalkan. Interaksi negatif = alasan DOE wajib sebelum peluncuran.",
    },
    {
      id: "pendalaman-power-fraksional",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Power, replikasi & faktorial fraksional: eksperimen yang bisa menjawab",
      prose: [
        "Eksperimen tanpa power analysis = judi dengan statistik. Ukuran sampel per sel: n ≈ 2σ²(z_{1−α/2} + z_{1−β})²/δ². Tiga input: σ² dari data historis atau pilot; δ = efek MINIMUM yang material bagi keputusan — bukan efek yang kamu harapkan (optimisme bukan parameter statistik); power 80% standar (z = 0,84), alpha 5% (z = 1,96). Contoh: σ = 2, δ = 1 → n ≈ 63 per sel. Aturan senior: tentukan δ dari keputusan bisnis — efek sebesar apa yang mengubah keputusan peluncuran? Bila δ tidak bisa didefinisikan, eksperimennya belum siap.",
        "Replikasi vs repetisi — bedakan dengan keras. Replikasi = ulangan independen penuh: run baru, pengacakan baru, kondisi diacak ulang — mengukur variansi sejati antar eksperimen. Repetisi = pengukuran ulang unit yang sama — hanya mengukur noise alat ukur. Menghitung 3x pengukuran satu sel sebagai n = 3 adalah pseudoreplikasi: uji signifikansinya fiksi karena yang diukur bukan variansi eksperimen. Tanpa replikasi sejati, tidak ada uji yang sah.",
        "Untuk faktor banyak: faktorial fraksional 2^(k−p) — jalankan sebagian sel. Kuncinya resolusi: III = efek utama tercampur (alias) dengan interaksi 2-faktor — hanya untuk screening kasar; IV = efek utama bersih dari interaksi 2-faktor, tapi interaksi 2-faktor tercampur sesamanya — screening yang lebih aman; V = efek utama DAN interaksi 2-faktor bersih — untuk inferensi serius. Aturan: 10 faktor screening → 2^(10−6) resolusi IV (16 run); bila interaksi dicurigai penting → naik ke resolusi V atau faktorial penuh pada faktor yang lolos.",
        "Praktik senior: DOE adalah kampanye, bukan satu pertempuran. Urutan sekuensial: screening fraksional (faktor mana yang aktif?) → faktorial penuh pada faktor aktif (berapa besar efek + interaksinya?) → titik tengah (apakah ada kelengkungan? bila ya, efek tidak linear) → response surface (RSM) untuk optimasi level. Setiap tahap menjawab satu pertanyaan dan menghemat budget tahap berikut. Jangan habiskan seluruh budget di satu eksperimen raksasa — informasi tahap awal mengubah desain tahap akhir.",
      ],
      formula: String.raw`n \approx \frac{2\sigma^2 \left(z_{1-\alpha/2} + z_{1-\beta}\right)^2}{\delta^2}`,
      formulaNote: "n = sampel per sel; σ² = variansi respons (dari pilot/historis); z = kuantil normal (α = 0,05 → 1,96; power 80% → 0,84); δ = efek minimum yang material bagi keputusan. Contoh: σ = 2, δ = 1 → n ≈ 2·4·(2,8)²/1 ≈ 63 per sel.",
      tasks: [],
      reference: "δ dari keputusan bisnis. Replikasi = run independen baru. Screening → penuh → titik tengah → RSM.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Faktorial 2^k menguji semua kombinasi k faktor: 2^k sel memberi semua efek utama + semua interaksi dari N observasi yang sama.",
        "Efek interaksi AB mengukur ketergantungan: efek A berbeda pada level B yang berbeda — inilah yang tidak terlihat A/B biasa.",
        "Tiga prinsip DOE: pengacakan (randomisasi), replikasi (ulangan tiap sel), blocking (kendalikan gangguan via desain).",
        "Blocking menyerap gangguan diketahui ke efek blok; Taguchi mengoptimalkan robustness (signal-to-noise), bukan rata-rata.",
        "Banyak faktor → faktorial fraksional untuk screening dulu; A/B berurutan = lambat, buta interaksi, tidak comparable.",
      ],
      next: { label: "A319 — RFM & Cohort Analysis", href: "/learn/a319-rfm-cohort" },
      quiz: [
        {
          q: "A/B test tombol hijau menang 8%, tetapi setelah diluncurkan ke semua pengguna efeknya hilang. Penjelasan paling mungkin?",
          options: [
            { text: "Ada interaksi dengan faktor lain (mis. waktu email) — kemenangan hanya berlaku pada satu level faktor itu", why: "Benar: A/B dua-grup meratakan efek atas semua level faktor lain yang tidak dikontrol. Interaksi membuat efek semu pada agregat tetapi nol (atau terbalik) pada subgrup.", correct: true },
            { text: "Sampel A/B test terlalu kecil", why: "Salah: kemenangan signifikan berarti sampel cukup untuk mendeteksi efek PADA KONDISI test. Masalahnya generalisasi, bukan power." },
            { text: "Tim implementasi salah memasang tombolnya", why: "Salah: ini kambing hitam favorit. Selalu curigai desain eksperimen dulu sebelum menuduh implementasi." },
            { text: "Uji statistik yang dipakai salah", why: "Salah: uji yang benar pada desain yang buta interaksi tetap memberi jawaban yang benar untuk pertanyaan yang salah." },
          ],
        },
        {
          q: "Eksperimen 2^2 menghasilkan sel: (−,−)=12, (+,−)=18, (−,+)=14, (+,+)=16. Kombinasi terbaik dan interaksi?",
          options: [
            { text: "(+,−) terbaik (18); interaksi AB = −2, negatif — kombinasi (+,+) saling melemahkan", why: "Benar: AB = ((12+16)−(18+14))/2 = −2. Sel (+,−)=18 tertinggi. Meluncurkan (+,+) karena kedua efek utama positif adalah kesalahan klasik.", correct: true },
            { text: "(+,+) terbaik (16); interaksi positif", why: "Salah: 16 < 18, dan interaksi = −2 (negatif). Membaca hanya efek utama menyesatkan." },
            { text: "(−,−) terbaik karena paling murah", why: "Salah: keputusan eksperimen memaksimalkan respons (atau rasio), bukan meminimalkan biaya perlakuan secara membabi buta." },
            { text: "Tidak bisa ditentukan tanpa uji signifikansi", why: "Salah: pertanyaan ini tentang estimasi titik dan ranking sel — signifikansi penting untuk generalisasi, tetapi ranking deskriptifnya jelas." },
          ],
        },
        {
          q: "Kenapa DOE mewajibkan pengacakan (randomisasi) alokasi perlakuan?",
          options: [
            { text: "Agar bias dari faktor tak terukur tersebar merata ke semua sel, tidak menumpuk di satu perlakuan", why: "Benar: randomisasi adalah satu-satunya pertahanan terhadap confounder yang tidak kamu ketahui. Tanpa itu, perlakuan terbaik bisa jadi hanya perlakuan yang kebetulan dapat kondisi terbaik.", correct: true },
            { text: "Agar jumlah sampel tiap sel sama persis", why: "Salah: keseimbangan ukuran sel adalah desain (bukan hasil randomisasi); randomisasi soal SIAPA masuk sel mana." },
            { text: "Agar memenuhi asumsi normalitas", why: "Salah: normalitas soal distribusi galat, tidak ada hubungannya dengan alokasi." },
            { text: "Supaya analis tidak bosan", why: "Salah: ini bukan alasan statistik — walau analis yang bosan memang berbahaya." },
          ],
        },
        {
          q: "Kapan blocking lebih tepat daripada sekadar menambah sampel?",
          options: [
            { text: "Ketika ada sumber gangguan besar yang diketahui (hari, region, batch) — blocking menghilangkannya via desain", why: "Benar: menambah sampel hanya mengecilkan SE secara perlahan (1/akar-n); blocking MEMOTONG variansi gangguan langsung dari pembanding. Untuk gangguan besar, blocking jauh lebih efisien.", correct: true },
            { text: "Ketika sampel sudah terlalu banyak", why: "Salah: blocking bukan alat penghemat sampel — ia alat penajam perbandingan." },
            { text: "Ketika tidak ada gangguan sama sekali", why: "Salah: tanpa gangguan, blok hanya membuang derajat bebas tanpa manfaat." },
            { text: "Blocking selalu lebih baik dari menambah sampel", why: "Salah: bila gangguan kecil dan tak diketahui polanya, menambah sampel (atau randomisasi) lebih praktis." },
          ],
        },
        {
          q: "Perusahaan manufaktur ingin menyetel 7 parameter mesin; tiap run Rp5 juta; tujuannya setting yang stabil di semua kondisi. Rancangan?",
          options: [
            { text: "Taguchi array ortogonal (mis. L8) dengan kriteria signal-to-noise — 8 run untuk 7 faktor, fokus robustness", why: "Benar: faktorial penuh butuh 128 run (Rp640 juta). Taguchi mengorbankan interaksi demi efisiensi dan mengoptimalkan stabilitas — tepat untuk tujuan ini.", correct: true },
            { text: "Faktorial penuh 2^7", why: "Salah: 128 run = Rp640 juta untuk screening 7 parameter — boros dan lambat; pakai fraksional/Taguchi dulu." },
            { text: "A/B test 7 kali berurutan", why: "Salah: 7 periode berbeda = kondisi tak comparable + buta interaksi + sangat lambat." },
            { text: "Tebak setting terbaik dari pengalaman operator", why: "Salah: pengalaman berharga untuk hipotesis, bukan untuk kesimpulan — 7 parameter berinteraksi di luar intuisi manusia." },
          ],
        },
        {
          q: "δ (efek minimum) untuk power analysis diambil dari efek yang diharapkan peneliti berdasarkan optimisme. Masalah?",
          options: [
            { text: "Tidak ada — optimisme = motivasi", why: "Salah: optimisme mengecilkan n sehingga eksperimen underpowered." },
            { text: "δ harus dari keputusan bisnis: efek sebesar apa yang mengubah keputusan peluncuran. δ optimis → n kekecilan → eksperimen tidak bisa menjawab", why: "Benar: bila δ tidak bisa didefinisikan dari keputusan, eksperimennya belum siap.", correct: true },
            { text: "δ harus selalu 0,05", why: "Salah: 0,05 adalah alpha, bukan δ." },
            { text: "Power analysis tidak perlu δ", why: "Salah: δ adalah input kuncinya." },
          ],
        },
        {
          q: "6 faktor, budget 16 run, tujuan screening awal. Rancangan fraksional yang tepat?",
          options: [
            { text: "2^(6−2) resolusi IV — 16 run, efek utama bersih dari interaksi 2-faktor", why: "Benar: untuk screening, efek utama yang bersih sudah cukup; interaksi menyusul di tahap berikut.", correct: true },
            { text: "2^(6−3) resolusi III — lebih hemat", why: "Salah: resolusi III mencampur efek utama dengan interaksi 2-faktor — screening yang rapuh." },
            { text: "Faktorial penuh 2^6 = 64 run", why: "Salah: melebihi budget 4x lipat." },
            { text: "A/B 6 kali berurutan", why: "Salah: lambat, buta interaksi, tidak comparable." },
          ],
        },
        {
          q: "Satu sel diukur 3x (alat yang sama, unit yang sama) lalu diklaim sebagai n=3 replikasi. Penilaian?",
          options: [
            { text: "Sah — 3 pengukuran = 3 replikasi", why: "Salah: itu repetisi, bukan replikasi." },
            { text: "Pseudoreplikasi: yang diukur hanya noise alat, bukan variansi eksperimen. Replikasi sejati = run independen baru dengan pengacakan baru", why: "Benar: tanpa replikasi sejati, uji signifikansinya fiksi.", correct: true },
            { text: "Sah bila alatnya akurat", why: "Salah: akurasi alat tidak mengubah definisi replikasi." },
            { text: "Tidak masalah untuk DOE", why: "Salah: DOE justru paling butuh replikasi sejati." },
          ],
        },
      ],
    },
  ],
};
