import type { V2Lesson } from "../lib/types";

export const mlf2: V2Lesson = {
  slug: "mlf2-membaca-angka",
  track: "Machine Learning Finance",
  module: "Foundations — ML end-to-end in finance",
  title: "MLF2 — Membaca Angka: Statistik untuk Hasil Model",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Model machine learning mengeluarkan angka — skor, metrik, interval. Lesson ini mengajarkan cara membacanya: kapan rata-rata menipu, kenapa base rate mengubah segalanya, seberapa lebar interval kepercayaan, dan kapan korelasi bukan sebab-akibat.",
        "Tujuan lesson ini:",
        "• Membandingkan mean dan median pada data skew dan memilih yang tepat.",
        "• Menghitung dan membaca base rate serta PPV dengan rumus Bayes.",
        "• Membaca interval kepercayaan Wilson dan efek ukuran sampel.",
        "• Membedakan korelasi dan sebab-akibat, serta p-value dan effect size.",
        "Isi lesson: cerita return yang menipu → distribusi dan skewness → base rate dan Bayes → interval kepercayaan → korelasi dan signifikansi → 2 lab → peta keputusan → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan: default rate notebook 0,2212 dari 6.000 nasabah test (1.327 default); mean return contoh 0,0495 vs median 0,0200.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Return rata-rata 4,95 persen — atau 2,0 persen?",
      prose: [
        "Seorang analis melaporkan: return strategi trading rata-rata 4,95 persen per bulan selama 10 bulan. Terdengar bagus. Lalu seseorang membuka datanya: sembilan bulan return-nya antara minus 1 persen dan 4 persen, dan satu bulan 35 persen. Median-nya — nilai tengah setelah diurutkan — hanya 2,0 persen.",
        "Rata-rata 0,0495 ditarik ke atas oleh satu bulan ekstrem; median 0,0200 menggambarkan bulan yang biasa. Keduanya benar secara aritmetika; keduanya bercerita berbeda. Analis yang hanya melaporkan mean sedang — sengaja atau tidak — menyembunyikan bentuk distribusi.",
        "Lesson ini mengajarkan membaca bentuk itu: distribusi, base rate, interval, korelasi. Empat alat baca, masing-masing dengan nilai, gambar, bacaan baik-buruk, dan mitigasi.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: satu angka cukup untuk meringkas data",
        type: "pitfall",
        body: "Yang benar: satu angka selalu menyembunyikan sesuatu. Mean menyembunyikan skew; median menyembunyikan ekor; keduanya menyembunyikan sebaran. Laporkan minimal dua angka — pusat dan sebaran — plus bentuk distribusinya.",
      },
    },
    {
      id: "distribusi",
      eyebrow: "Langkah 3 · Distribusi dan skewness",
      title: "Mean vs median: siapa yang jujur saat data miring",
      prose: [
        "Mean adalah jumlah semua nilai dibagi banyaknya data. Median adalah nilai tengah setelah data diurutkan. Pada data simetris keduanya hampir sama; pada data skew keduanya berpisah — dan arah perpisahannya memberi tahu bentuk distribusi.",
        "Nilai: sepuluh return bulanan dari cerita pembuka — mean 0,0495, median 0,0200, simpangan baku 0,1012. Mean lebih besar dari median dengan selisih 0,0295, dan rasio mean terhadap median 0,0495 dibagi 0,0200, yaitu 2,475. Itu ciri right-skew: ekor panjang di kanan menarik mean ke atas. Satu bulan 35 persen (0,35) sendirian menyumbang 0,035 ke mean — lebih dari dua pertiga nilai mean itu sendiri (0,035 dari 0,0495). Simpangan baku di sini adalah population sd (dibagi n, bukan n−1).",
        "Gambar di bawah menunjukkan histogramnya: sembilan bulan menumpuk di rentang minus 0,01 sampai 0,04, satu bulan terpisah jauh di 0,35. Garis mean (putus-putus merah) jatuh di 0,0495 — di daerah yang tidak ada bulannya sama sekali. Garis median (hijau) jatuh di 0,0200 — di tengah tumpukan bulan biasa.",
        "Baik atau buruk: mean baik bila distribusi simetris dan tanpa outlier — misal return harian yang sudah dibersihkan. Mean buruk bila ada skew atau outlier: ia menggambarkan bulan yang tidak pernah terjadi. Median baik bila data skew — ia kebal terhadap satu bulan ekstrem. Median buruk bila yang penting justru ekornya: dalam risk, ekor kanan dan kiri adalah ceritanya, bukan gangguan.",
        "Mitigasi: bila skew, laporkan median bersama mean, atau transformasi log untuk menarik ekor ke dalam. Bila ekornya yang penting — misal kerugian ekstrem — jangan sembunyikan dengan median: laporkan kuantil ekor (misal persentil 95 dan 99) secara terpisah. Detail transformasi dan deteksi outlier ada di L0.3.",
        "Batas scope: lesson ini membaca implikasi distribusi terhadap hasil model — mean vs median, ekor, dan apa yang harus dilaporkan. Diagnosis distribusi dan transformasi secara mendalam — QQ plot, skewness/kurtosis, IQR, z-score, dan kapan memakai log-transform — adalah materi L0.3, bukan di sini. Bila kamu butuh prosedurnya, tunggu L0; bila kamu butuh membacanya, lesson ini cukup.",
      ],
      formula: String.raw`\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i \qquad \text{median} = \begin{cases} x_{((n+1)/2)}, & n \text{ ganjil} \\ \frac{x_{(n/2)} + x_{(n/2+1)}}{2}, & n \text{ genap} \end{cases} \text{ (data terurut)}`,
      formulaNote: "Mean = jumlah semua nilai dibagi n. Median = nilai tengah setelah data diurutkan (n ganjil) atau rata-rata dua nilai tengah (n genap). Pada 10 return contoh, median = (0,02 + 0,02) / 2 = 0,0200.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Histogram: 9 return menumpuk di -0,01 sampai 0,04; satu return 0,35 jauh di kanan">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Return bulanan: 9 bulan biasa, 1 bulan ekstrem</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="98.0" y1="206" x2="98.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="98.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="190.0" y1="206" x2="190.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="190.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<line x1="282.0" y1="206" x2="282.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="282.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,20</text>
<line x1="374.0" y1="206" x2="374.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="374.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,30</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,40</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">5</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">10</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">return bulanan</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">jumlah bulan</text>
<rect x="79.6" y="47.6" width="64.4" height="158.4" fill="var(--c1)"/>
<text x="111.8" y="41.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">9 bulan</text>
<rect x="374.0" y="188.4" width="92.0" height="17.6" fill="var(--c4)"/>
<text x="420.0" y="182.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1 bulan</text>
<line x1="143.5" y1="30" x2="143.5" y2="206" stroke="var(--c4)" stroke-width="2" stroke-dasharray="5,3"/>
<text x="147.5" y="44" font-size="10" fill="var(--c4)" font-family="var(--font-ui)" font-weight="600">mean 0,0495</text>
<line x1="116.4" y1="30" x2="116.4" y2="206" stroke="var(--c3)" stroke-width="2"/>
<text x="120.4" y="58" font-size="10" fill="var(--c3)" font-family="var(--font-ui)" font-weight="600">median 0,0200</text>
</svg>`,
        alt: "Histogram: 9 return menumpuk di -0,01 sampai 0,04; satu return 0,35 jauh di kanan.",
        caption: "Cara membaca: tinggi bar = jumlah bulan; garis merah putus-putus = mean 0,0495, garis hijau = median 0,0200. Interpretasi: distribusi right-skew — mean jatuh di daerah kosong, median di tengah bulan biasa.",
      },
      tasks: [],
      note: {
        title: "Tip: cek mean vs median dulu sebelum percaya rata-rata",
        body: "Selisih mean dan median adalah tes skew termurah yang ada. Bila keduanya dekat, mean aman dipakai. Bila berjauhan, berhenti dan lihat histogramnya — seperti gambar di atas.",
      },
    },
    {
      id: "baserate",
      eyebrow: "Langkah 4 · Base rate dan Bayes",
      title: "Base rate: kenapa tes 99 persen akurat bisa setengahnya salah",
      prose: [
        "Bayes mengubah pertanyaan: bukan seberapa akurat tesnya, melainkan seberapa mungkin fraud bila tes berkata fraud. Jawabannya tergantung base rate — seberapa umum fraud di populasi yang diperiksa. Tes yang sama, base rate berbeda, kesimpulan berbeda.",
        "Nilai: tes fraud dengan sensitivitas 0,99 dan spesifisitas 0,99. Pada prevalensi 1 persen, PPV-nya 0,5000 — separuh alert adalah false positive. Pada prevalensi 10 persen, PPV naik ke 0,9167. Pada prevalensi 22,12 persen (default rate notebook), PPV mencapai 0,9657. Tesnya tidak berubah; yang berubah hanya base rate. Perhitungannya: PPV = 0,99 × 0,01 dibagi (0,99 × 0,01 + 0,01 × 0,99) = 0,0099 dibagi 0,0198 = 0,5000.",
        "Gambar di bawah menunjukkan ketiga PPV itu sebagai bar. Pesannya visual: bar pertama hanya setengah tinggi, bar ketiga hampir penuh — padahal tesnya identik. Inilah base rate neglect: manusia cenderung membaca 99 persen akurat sebagai 99 persen benar, dan melupakan prevalensi.",
        "Baik atau buruk: PPV 0,5000 buruk bila tiap alert ditindaklanjuti dengan pemblokiran otomatis — separuh nasabah yang diblokir tidak bersalah. PPV yang sama bisa diterima bila tindak lanjutnya murah — misal antrean investigasi manusia, bukan pemblokiran. Penilaian baik-buruk selalu melibatkan biaya tindak lanjut, bukan PPV sendirian.",
        "Mitigasi: selalu laporkan PPV bersama prevalensi dan biaya tindak lanjut. Bila prevalensi rendah, naikkan threshold alert atau tambahkan sinyal kedua sebelum bertindak. Di Siskamling, prinsip yang sama berlaku: skor model bukan vonis; ia antrean triase yang diurutkan berdasarkan expected value.",
        "Rantai lengkapnya, memakai mini-case kredit MLF1 [ilustrasi]: base rate menentukan peluang default (PD) → PD dikalikan LGD dan EAD menjadi expected loss → expected loss dibandingkan dengan margin → hasilnya menentukan threshold. Contoh: PD ilustrasi 0,5 memberi EL Rp2.250.000 melawan margin Rp500.000 — tolak; PD ilustrasi 0,1 memberi EL Rp450.000 melawan margin Rp500.000 — setujui bersyarat. Bayes mengubah base rate menjadi PPV; expected loss mengubah probabilitas itu menjadi keputusan. Tanpa rantai ini, PPV hanyalah angka.",
      ],
      formula: String.raw`P(\text{fraud} \mid \text{alert}) = \frac{\text{sens} \times \text{prev}}{\text{sens} \times \text{prev} + (1-\text{spec}) \times (1-\text{prev})}`,
      formulaNote: "PPV = peluang benar-benar fraud bila tes memberi alert. sens = peluang tes menangkap fraud yang ada; spec = peluang tes melepas transaksi legit; prev = base rate fraud di populasi.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar: PPV 50% pada prevalensi 1%, 91,7% pada 10%, 96,6% pada 22,12%">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">PPV tes yang sama di tiga base rate berbeda</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="121.0" y1="206" x2="121.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="121.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1%</text>
<line x1="259.0" y1="206" x2="259.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">10%</text>
<line x1="397.0" y1="206" x2="397.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="397.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">22,12%</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">50%</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">100%</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">prevalensi (base rate)</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">PPV = P(fraud | alert)</text>
<rect x="83.0" y="118.0" width="75.9" height="88.0" fill="var(--c1)"/>
<text x="121.0" y="112.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">50.0%</text>
<rect x="221.1" y="44.7" width="75.9" height="161.3" fill="var(--c1)"/>
<text x="259.0" y="38.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">91.7%</text>
<rect x="359.1" y="36.0" width="75.9" height="170.0" fill="var(--c1)"/>
<text x="397.0" y="30.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">96.6%</text>
</svg>`,
        alt: "Bar: PPV 50% pada prevalensi 1%, 91,7% pada 10%, 96,6% pada 22,12%.",
        caption: "Cara membaca: tinggi bar = PPV pada prevalensi itu. Interpretasi: tes yang sama (sens 99%, spec 99%) memberi PPV 50,0% saat fraud jarang dan 96,6% saat fraud umum — base rate yang menentukan.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: sensitivitas 99 persen berarti 99 persen alert benar",
        type: "pitfall",
        body: "Yang benar: sensitivitas menjawab seberapa banyak fraud yang tertangkap; PPV menjawab seberapa banyak alert yang benar. Keduanya berbeda, dan PPV butuh base rate. Tanpa prevalensi, angka 99 persen itu belum bercerita.",
      },
    },
    {
      id: "ci",
      eyebrow: "Langkah 5 · Interval kepercayaan",
      title: "Interval kepercayaan: seberapa yakin kita pada angka itu",
      prose: [
        "Estimasi titik — misal default rate 0,2212 — selalu punya ketidakpastian. Interval kepercayaan (CI) 95 persen memberi rentangnya: nilai benarnya plausibel berada di dalam interval itu, dengan catatan prosedur ini benar 95 persen dalam jangka panjang bila diulang.",
        "Nilai: default rate notebook 1.327 dari 6.000 nasabah, yaitu 0,2212. Interval Wilson 95 persennya [0,2108, 0,2318] — lebarnya 0,2318 dikurangi 0,2108, yaitu 0,0210. Dengan sampel yang sama proporsinya tapi hanya 100 nasabah (22 dari 100), intervalnya [0,1500, 0,3107] — lebarnya 0,1607, hampir delapan kali lebih lebar (0,1607 dibagi 0,0210 sama dengan 7,65). Proporsinya sama; keyakinannya jauh berbeda.",
        "Gambar di bawah menunjukkan kedua interval itu. Interval n = 6.000 pendek dan tegas; interval n = 100 panjang dan ragu-ragu. Titik estimasinya hampir sama (0,2212 vs 0,2200) — yang berbeda adalah seberapa banyak kita boleh percaya padanya.",
        "Baik atau buruk: CI sempit baik — estimasi presisi, keputusan bisa tegas. CI lebar buruk untuk keputusan yang butuh presisi — misal menetapkan threshold berdasarkan default rate yang rentangnya 0,15 sampai 0,31. Tapi CI lebar bukan berarti datanya salah; ia jujur tentang ketidaktahuan.",
        "Mitigasi: bila CI terlalu lebar untuk keputusan yang dibutuhkan, tambah sampel — lebar interval menyusut sebanding akar n, jadi melipatgandakan presisi butuh empat kali sampel. Bila tidak bisa tambah sampel, laporkan intervalnya apa adanya dan buat keputusan yang robust di seluruh rentang interval.",
        "Teaser: interval di atas untuk default rate — sebuah proporsi. Metrik model punya ketidakpastian yang sama: ROC-AUC GBM 0,7823 [notebook] adalah estimasi dari test set 6.000 nasabah, bukan konstanta populasi; selisih 0,0397 terhadap LR 0,7426 juga punya ketidakpastian, dan tanpa interval kita tidak tahu apakah selisih itu kokoh atau sekadar noise split. Prosedur bootstrap untuk interval metrik model dibahas penuh di M9 — di sini cukup ingat: metrik tanpa ketidakpastian adalah klaim yang belum lengkap.",
      ],
      formula: String.raw`\text{Wilson: } \frac{\hat{p} + \frac{z^2}{2n} \pm z\sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}}`,
      formulaNote: "Interval Wilson untuk proporsi: p-hat = k/n, z = 1,96 untuk 95 persen. Wilson lebih akurat dari aproksimasi normal saat n kecil atau p dekat 0 atau 1.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Dua interval Wilson untuk default rate yang sama: n=6000 sempit, n=100 lebar">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Interval kepercayaan: sampel besar vs kecil</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,10</text>
<line x1="134.8" y1="206" x2="134.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="134.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,15</text>
<line x1="217.6" y1="206" x2="217.6" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="217.6" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,20</text>
<line x1="300.4" y1="206" x2="300.4" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="300.4" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="383.2" y1="206" x2="383.2" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="383.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,30</text>
<line x1="466.0" y1="206" x2="466.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,35</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">default rate</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)"></text>
<line x1="235.5" y1="75" x2="270.3" y2="75" stroke="var(--c1)" stroke-width="3"/>
<line x1="235.5" y1="68" x2="235.5" y2="82" stroke="var(--c1)" stroke-width="2"/>
<line x1="270.3" y1="68" x2="270.3" y2="82" stroke="var(--c1)" stroke-width="2"/>
<circle cx="252.7" cy="75" r="5" fill="var(--c4)"/>
<text x="52" y="59" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">n = 6.000  (notebook)</text>
<text x="235.5" y="97" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.2108</text>
<text x="270.3" y="97" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.2318</text>
<line x1="134.8" y1="155" x2="400.9" y2="155" stroke="var(--c1)" stroke-width="3"/>
<line x1="134.8" y1="148" x2="134.8" y2="162" stroke="var(--c1)" stroke-width="2"/>
<line x1="400.9" y1="148" x2="400.9" y2="162" stroke="var(--c1)" stroke-width="2"/>
<circle cx="250.7" cy="155" r="5" fill="var(--c4)"/>
<text x="52" y="139" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">n = 100  (sampel kecil)</text>
<text x="134.8" y="177" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.1500</text>
<text x="400.9" y="177" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.3107</text>
</svg>`,
        alt: "Dua interval Wilson untuk default rate yang sama: n=6000 sempit, n=100 lebar.",
        caption: "Cara membaca: garis horizontal = interval 95 persen; titik merah = estimasi titik. Interpretasi: n = 6.000 memberi [0,2108, 0,2318]; n = 100 memberi [0,1500, 0,3107] — proporsi sama, keyakinan berbeda.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: CI 95 persen berarti 95 persen peluang nilai benar di dalam",
        type: "pitfall",
        body: "Yang benar: setelah interval dihitung, nilai benar ada di dalam atau tidak — tidak ada peluangnya lagi. Yang 95 persen adalah prosedurnya: bila prosedur ini diulang berkali-kali, 95 persen interval yang dihasilkan akan memuat nilai benar.",
      },
    },
    {
      id: "korelasi",
      eyebrow: "Langkah 6 · Korelasi dan signifikansi",
      title: "Korelasi bukan sebab-akibat; p-value bukan ukuran penting",
      prose: [
        "Korelasi mengukur seberapa bergerak bersama dua variabel — dari minus 1 sampai 1. P-value mengukur seberapa mengejutkan data bila tidak ada efek sama sekali. Keduanya sering disalahbaca: korelasi dibaca sebagai sebab-akibat, p-value dibaca sebagai ukuran penting.",
        "Nilai: 14 nasabah, limit kartu vs tagihan bulanan, korelasi r = 0,899. Kuat dan positif: limit besar cenderung bertagihan besar. Tapi korelasi ini tidak membuktikan limit menyebabkan tagihan — bisa jadi penghasilanlah yang menyebabkan keduanya. Gambar di bawah menunjukkan scatter-nya beserta garis tren.",
        "Nilai kedua: korelasi 0,02 dengan n = 30.000. Standard error korelasi kira-kira 1 dibagi akar n, yaitu 1 dibagi akar 30.000, sama dengan 0,0058. Statistik z = 0,02 dibagi 0,0058, yaitu 3,47 — p-value sekitar 0,0005, signifikan secara statistik. Tapi efeknya 0,02: praktis nol. Signifikan bukan berarti penting; dengan n besar, efek yang remeh pun lolos uji.",
        "Baik atau buruk: korelasi 0,899 baik sebagai sinyal prediktif — limit membantu memprediksi tagihan. Buruk sebagai klaim kausal — menaikkan limit tidak otomatis menaikkan tagihan. P-value kecil baik sebagai bukti ada sesuatu; buruk bila dipakai sendirian tanpa effect size.",
        "Mitigasi: laporkan effect size bersama p-value — korelasi, selisih, atau interval kepercayaannya. Untuk klaim sebab-akibat, butuh desain yang lebih kuat: eksperimen, atau minimal kontrol terhadap perancu (confounder) seperti penghasilan. Di finance, korelasi yang berubah saat krisis adalah peringatan — dibahas di M4 sebagai correlation breakdown.",
        "Implikasi untuk model: dua fitur yang berkorelasi 0,899 hampir membawa informasi yang sama — memasukkan keduanya ke logistic regression membuat koefisiennya tidak stabil (multicollinearity): koefisien bisa berubah besar saat data sedikit bergeser, dan interpretasi 'pengaruh fitur X' menjadi tidak bisa dipercaya. Di scorecard M2, fitur redundant disaring sebelum masuk model — salah satunya dibuang atau digabung — supaya skornya stabil dan bisa dijelaskan. Korelasi di sini bukan sekadar soal kausal: ia soal stabilitas model.",
      ],
      formula: String.raw`r = \frac{\sum (x_i-\bar{x})(y_i-\bar{y})}{\sqrt{\sum (x_i-\bar{x})^2 \sum (y_i-\bar{y})^2}}`,
      formulaNote: "Korelasi Pearson r: kovarians dibagi perkalian simpangan baku. r = 1 berarti naik bersama sempurna; r = 0 berarti tidak ada hubungan linear; r = -1 berarti berlawanan sempurna.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Scatter limit kartu vs tagihan bulanan: naik bersama, tapi korelasi bukan sebab-akibat">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Korelasi: limit vs tagihan (r = 0,899)</text>

<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52.0" y1="206" x2="52.0" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="127.3" y1="206" x2="127.3" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="127.3" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<line x1="202.5" y1="206" x2="202.5" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="202.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<line x1="277.8" y1="206" x2="277.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="277.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3</text>
<line x1="353.1" y1="206" x2="353.1" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="353.1" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<line x1="428.4" y1="206" x2="428.4" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="428.4" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">5</text>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="166.9" x2="52" y2="166.9" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="169.9" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<line x1="48" y1="127.8" x2="52" y2="127.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="130.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="91.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3</text>
<line x1="48" y1="49.6" x2="52" y2="49.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="52.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">limit kartu (juta)</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">tagihan (juta)</text>
<circle cx="300.6" cy="110.9" r="5" fill="var(--c1)"/>
<circle cx="408.9" cy="101.7" r="5" fill="var(--c1)"/>
<circle cx="340.3" cy="89.5" r="5" fill="var(--c1)"/>
<circle cx="247.4" cy="132.1" r="5" fill="var(--c1)"/>
<circle cx="409.2" cy="91.7" r="5" fill="var(--c1)"/>
<circle cx="128.0" cy="202.1" r="5" fill="var(--c1)"/>
<circle cx="248.5" cy="128.9" r="5" fill="var(--c1)"/>
<circle cx="284.0" cy="91.1" r="5" fill="var(--c1)"/>
<circle cx="94.1" cy="186.3" r="5" fill="var(--c1)"/>
<circle cx="400.0" cy="54.9" r="5" fill="var(--c1)"/>
<circle cx="349.0" cy="71.5" r="5" fill="var(--c1)"/>
<circle cx="136.6" cy="143.6" r="5" fill="var(--c1)"/>
<circle cx="298.8" cy="109.0" r="5" fill="var(--c1)"/>
<circle cx="384.8" cy="75.5" r="5" fill="var(--c1)"/>
<line x1="74.6" y1="197.4" x2="443.4" y2="53.5" stroke="var(--c4)" stroke-width="2" stroke-dasharray="5,3"/>
</svg>`,
        alt: "Scatter limit kartu vs tagihan bulanan: naik bersama, tapi korelasi bukan sebab-akibat.",
        caption: "Cara membaca: tiap titik satu nasabah; garis putus-putus = tren naik. Interpretasi: r = 0,899 — hubungan linear kuat, tapi bukan bukti limit menyebabkan tagihan.",
      },
      tasks: [],
      note: {
        title: "Tip: tanyakan selalu — apa perancunya?",
        body: "Sebelum menyimpulkan sebab-akibat dari korelasi, cari variabel ketiga yang bisa menjelaskan keduanya. Di contoh ini: penghasilan. Nasabah berpenghasilan besar mendapat limit besar dan berbelanja besar — limit dan tagihan hanya bergerak bersama karena penghasilan.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab: mean, median, dan interval Wilson",
      prose: [
        "Hitung sendiri angka-angka dari cerita pembuka: mean dan median 10 return, lalu interval Wilson untuk default rate notebook — sekali dengan n = 6.000, sekali dengan n = 100. Bandingkan lebarnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mean`, `median`, dan `sd` dari `returns`" },
        { id: "t2", text: "Hitung interval Wilson untuk 1.327 dari 6.000 nasabah" },
        { id: "t3", text: "Hitung interval Wilson yang sama dengan n = 100, lalu jalankan" },
      ],
      expected: "mean=0.0495 median=0.0200 sd=0.1012\ndefault rate=0.2212 Wilson 95%: [0.2108, 0.2318]\nn=100 Wilson 95%: [0.1500, 0.3107]",
      hints: [
        "Median n genap: rata-rata dua nilai tengah setelah diurutkan.",
        "Rumus Wilson ada di langkah 5; z = 1,96 untuk 95 persen.",
      ],
      code: {
        starter: `import math

returns = [0.02, 0.01, 0.03, -0.01, 0.02, 0.015, 0.025, -0.005, 0.04, 0.35]
s = sorted(returns)
n = len(returns)
mean = 0.0  # TODO: jumlah returns dibagi n
median = 0.0  # TODO: rata-rata dua nilai tengah s
sd = 0.0  # TODO: akar rata-rata kuadrat selisih dari mean
print(f"mean={mean:.4f} median={median:.4f} sd={sd:.4f}")

# Wilson interval untuk default rate notebook: 1327 dari 6000
k, N, z = 1327, 6000, 1.96
p = k / N
den = 1 + z * z / N
center = 0.0  # TODO: (p + z^2 / (2N)) / den
half = 0.0  # TODO: z * sqrt(p(1-p)/N + z^2/(4N^2)) / den
print(f"default rate={p:.4f} Wilson 95%: [{center - half:.4f}, {center + half:.4f}]")

# Wilson yang sama dengan n=100 (sampel kecil) untuk perbandingan
N2 = 100
k2 = 22
p2 = k2 / N2
den2 = 1 + z * z / N2
c2 = (p2 + z * z / (2 * N2)) / den2
h2 = z * math.sqrt(p2 * (1 - p2) / N2 + z * z / (4 * N2 * N2)) / den2
print(f"n=100 Wilson 95%: [{c2 - h2:.4f}, {c2 + h2:.4f}]")`,
        lockLines: 5,
        solution: `import math

returns = [0.02, 0.01, 0.03, -0.01, 0.02, 0.015, 0.025, -0.005, 0.04, 0.35]
s = sorted(returns)
n = len(returns)
mean = sum(returns) / n
median = (s[n // 2 - 1] + s[n // 2]) / 2
sd = (sum((r - mean) ** 2 for r in returns) / n) ** 0.5
print(f"mean={mean:.4f} median={median:.4f} sd={sd:.4f}")

# Wilson interval untuk default rate notebook: 1327 dari 6000
k, N, z = 1327, 6000, 1.96
p = k / N
den = 1 + z * z / N
center = (p + z * z / (2 * N)) / den
half = z * math.sqrt(p * (1 - p) / N + z * z / (4 * N * N)) / den
print(f"default rate={p:.4f} Wilson 95%: [{center - half:.4f}, {center + half:.4f}]")

# Wilson yang sama dengan n=100 (sampel kecil) untuk perbandingan
N2 = 100
k2 = 22
p2 = k2 / N2
den2 = 1 + z * z / N2
c2 = (p2 + z * z / (2 * N2)) / den2
h2 = z * math.sqrt(p2 * (1 - p2) / N2 + z * z / (4 * N2 * N2)) / den2
print(f"n=100 Wilson 95%: [{c2 - h2:.4f}, {c2 + h2:.4f}]")`,
        checks: [
          { kind: "equal", task: "t1", name: "mean", value: 0.0495, tol: 1e-4, label: "`mean` seharusnya 0.0495", msg: "Jumlah returns 0,495 dibagi 10." },
          { kind: "equal", task: "t1", name: "median", value: 0.02, tol: 1e-9, label: "`median` seharusnya 0.02", msg: "Dua nilai tengah setelah diurutkan sama-sama 0,02." },
          { kind: "stdout_matches", task: "t2", pattern: "Wilson 95%: \\[0\\.2108, 0\\.2318\\]", label: "Output menampilkan Wilson [0.2108, 0.2318]", msg: "Cek rumus Wilson: center dan half-width." },
          { kind: "stdout_matches", task: "t3", pattern: "n=100 Wilson 95%: \\[0\\.1500, 0\\.3107\\]", label: "Output menampilkan Wilson n=100 [0.1500, 0.3107]", msg: "Sampel kecil = interval jauh lebih lebar." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab: PPV dengan rumus Bayes",
      prose: [
        "Satu tes, tiga base rate. Lengkapi rumus Bayes, lalu lihat bagaimana PPV berubah dari 0,5000 ke 0,9657 — tanpa mengubah tesnya sedikit pun. Bagian kedua menghitung berapa alert yang benar dari 10.000 transaksi pada prevalensi 1 persen.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi rumus PPV (Bayes) di dalam loop" },
        { id: "t2", text: "Jalankan dan bandingkan PPV di tiga prevalensi" },
        { id: "t3", text: "Jawab: kenapa PPV naik saat prevalensi naik, padahal tesnya sama?" },
      ],
      expected: "prevalensi=0.0100 PPV=0.5000\nprevalensi=0.1000 PPV=0.9167\nprevalensi=0.2212 PPV=0.9657\ndari 10000 transaksi: TP=99 FP=99 alert-benar=50.0%",
      hints: [
        "PPV = sens × prev dibagi (sens × prev + (1 - spec) × (1 - prev)).",
        "TP = sens × prev × n; FP = (1 - spec) × (1 - prev) × n.",
      ],
      code: {
        starter: `sens, spec = 0.99, 0.99
for prev in [0.01, 0.10, 0.2212]:
    ppv = 0.0  # TODO: rumus Bayes PPV
    print(f"prevalensi={prev:.4f} PPV={ppv:.4f}")
n = 10000
prev = 0.01
tp = sens * prev * n
fp = (1 - spec) * (1 - prev) * n
print(f"dari {n} transaksi: TP={tp:.0f} FP={fp:.0f} alert-benar={tp / (tp + fp) * 100:.1f}%")`,
        lockLines: 2,
        solution: `sens, spec = 0.99, 0.99
for prev in [0.01, 0.10, 0.2212]:
    ppv = sens * prev / (sens * prev + (1 - spec) * (1 - prev))
    print(f"prevalensi={prev:.4f} PPV={ppv:.4f}")
n = 10000
prev = 0.01
tp = sens * prev * n
fp = (1 - spec) * (1 - prev) * n
print(f"dari {n} transaksi: TP={tp:.0f} FP={fp:.0f} alert-benar={tp / (tp + fp) * 100:.1f}%")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "prevalensi=0\\.0100 PPV=0\\.5000", label: "Output menampilkan PPV 0.5000 pada prevalensi 1%", msg: "Cek rumus Bayes: penyebutnya sens×prev + (1-spec)×(1-prev)." },
          { kind: "stdout_matches", task: "t1", pattern: "prevalensi=0\\.2212 PPV=0\\.9657", label: "Output menampilkan PPV 0.9657 pada prevalensi 22,12%", msg: "Base rate yang sama dengan notebook memberi PPV tertinggi." },
          { kind: "stdout_matches", task: "t2", pattern: "alert-benar=50\\.0%", label: "Output menampilkan alert-benar 50.0%", msg: "TP 99 dan FP 99 dari 10.000 transaksi: separuh alert benar." },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: statistik apa untuk pertanyaan apa?",
      prose: [
        "Mau meringkas pusat data? Cek dulu bentuknya: simetris pakai mean, skew pakai median — dan laporkan keduanya bila ragu.",
        "Mau menilai tes atau model klasifikasi? Jangan berhenti di sensitivitas: hitung PPV dengan base rate populasimu. Tes 99 persen bisa berarti 50 persen benar.",
        "Mau menyatakan seberapa yakin pada sebuah proporsi? Laporkan interval kepercayaannya, bukan titiknya. Interval lebar berarti butuh sampel lebih besar — empat kali sampel untuk dua kali presisi.",
        "Mau mengklaim hubungan antar variabel? Laporkan korelasi bersama n dan intervalnya — dan jangan lompat ke sebab-akibat tanpa desain yang mendukung.",
        "Mau mengklaim sesuatu penting? P-value kecil saja tidak cukup: laporkan effect size. Efek 0,02 dengan n = 30.000 signifikan secara statistik dan remeh secara bisnis.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: 198 alert, separuh salah — investigasi atau blokir?",
      prose: [
        "Payment gateway memakai tes fraud dengan sensitivitas 0,99 dan spesifisitas 0,99 pada 10.000 transaksi harian dengan prevalensi fraud 1 persen. Dari lab 2: TP = 0,99 × 0,01 × 10.000 = 99 fraud tertangkap; FP = 0,01 × 0,99 × 10.000 = 99 transaksi legit ikut ter-flag. Total alert 198, dan yang benar 99 dari 198 — 50,0 persen.",
        "Opsi A: blokir otomatis semua alert. Biaya: 99 nasabah legit terblokir — komplain, churn, dan risiko reputasi. Opsi B: investigasi manusia tiap alert dengan biaya Rp50.000 per alert. Biaya investigasi = 198 × Rp50.000 = Rp9.900.000. Tiap fraud yang dicegah menghemat Rp2.000.000, jadi 99 fraud × Rp2.000.000 = Rp198.000.000. Manfaat bersih opsi B = Rp198.000.000 dikurangi Rp9.900.000 = Rp188.100.000 per hari.",
        "Keputusan: investigasi, bukan blokir otomatis. PPV 50,0 persen terlalu rendah untuk tindakan yang merugikan nasabah, tapi cukup tinggi untuk antrean investigasi yang menguntungkan. Inilah logika triase: skor dan PPV menentukan URUTAN dan JENIS tindakan — bukan vonis. Prinsip yang sama dipakai Siskamling: model mengurutkan laporan, manusia memutuskan.",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab: audit statistik sebuah portofolio pinjaman",
      prose: [
        "Lesson web ini mengajarkan cara membaca angka. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf2-guided-task.ipynb.",
        "Di notebook itu kamu mengaudit statistik sebuah portofolio pinjaman: menghitung mean vs median dan memutuskan mana yang jujur, menghitung base rate dan PPV untuk dua populasi berbeda, membangun interval Wilson untuk default rate, dan menuliskan rekomendasi: angka mana yang boleh masuk laporan direksi dan mana yang tidak.",
        "Tautan Colab:",
        "Buka di Colab: https://colab.research.google.com/drive/1wePvbiPSYY9NxBEpnN1sygFV9zlJPJiB",
        "Jalur file notebook: colab/mlf2-guided-task.ipynb.",
        "Companion full-code untuk topik yang memetakan ke proyek nyata: notebook credit scoring end-to-end di Colab: https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO — default rate 0,2212 dan interval Wilson di lesson ini dihitung dari test set 6.000 nasabahnya.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint: membaca angka dengan curiga yang sehat",
      prose: [
        "Rangkuman: mean menipu saat skew — median 0,0200 vs mean 0,0495. Base rate menentukan PPV — 0,5000 pada prevalensi 1 persen, 0,9657 pada 22,12 persen. Interval menyusut dengan akar n — [0,2108, 0,2318] pada n = 6.000 vs [0,1500, 0,3107] pada n = 100. Korelasi bukan sebab-akibat; p-value bukan ukuran penting.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Data return sangat right-skew karena satu bulan ekstrem. Ukuran pusat mana yang paling jujur dilaporkan?",
          options: [
            { text: "Mean, karena memakai semua data", why: "Mean memakai semua data — dan justru itu masalahnya: satu bulan ekstrem menariknya jauh dari bulan biasa." },
            { text: "Median, karena kebal terhadap outlier", why: "Benar: median 0,0200 menggambarkan bulan biasa, sementara mean 0,0495 jatuh di daerah kosong.", correct: true },
            { text: "Modus, karena paling sering muncul", why: "Modus tidak bermakna untuk data kontinu seperti return — hampir tidak ada nilai yang berulang." },
            { text: "Simpangan baku, karena mengukur sebaran", why: "Simpangan baku mengukur sebaran, bukan pusat — ia tidak menjawab berapa return yang biasa." },
          ],
        },
        {
          q: "Sepuluh return: mean 0,0495 dan median 0,0200. Pernyataan mana yang benar?",
          options: [
            { text: "Mean lebih besar dari median karena satu bulan 0,35 menarik mean ke atas", why: "Benar: bulan 0,35 menyumbang 0,035 ke mean — lebih dari dua pertiga nilai mean itu sendiri.", correct: true },
            { text: "Median lebih besar dari mean karena data left-skew", why: "Kebalik: mean 0,0495 lebih besar dari median 0,0200 — ini right-skew." },
            { text: "Mean dan median sama karena data simetris", why: "0,0495 tidak sama dengan 0,0200; rasionya 2,475." },
            { text: "Mean 0,0495 berarti tiap bulan return-nya 4,95 persen", why: "Mean adalah rata-rata, bukan tiap bulan — sembilan bulan di bawah 0,04." },
          ],
        },
        {
          q: "Tes fraud: sensitivitas 0,99, spesifisitas 0,99, prevalensi 1 persen. Berapa PPV-nya?",
          options: [
            { text: "0,9900", why: "Itu sensitivitasnya, bukan PPV — PPV butuh base rate." },
            { text: "0,5000", why: "Benar: 0,0099 dibagi 0,0198 = 0,5000 — separuh alert adalah false positive.", correct: true },
            { text: "0,0100", why: "Itu prevalensinya, bukan PPV." },
            { text: "0,9657", why: "Itu PPV pada prevalensi 22,12 persen, bukan 1 persen." },
          ],
        },
        {
          q: "Default rate yang sama diestimasi dua kali: n = 6.000 memberi [0,2108, 0,2318]; n = 100 memberi [0,1500, 0,3107]. Kesimpulan mana yang benar?",
          options: [
            { text: "Interval n = 100 lebih sempit karena sampelnya lebih fokus", why: "Kebalik: interval n = 100 lebarnya 0,1607 — hampir delapan kali lebar interval n = 6.000." },
            { text: "Interval n = 6.000 lebih sempit karena sampel lebih besar", why: "Benar: lebar interval menyusut sebanding akar n.", correct: true },
            { text: "Keduanya sama akurat karena proporsinya sama", why: "Proporsi sama, keyakinan berbeda — itulah yang diukur lebar interval." },
            { text: "Interval n = 100 salah karena memuat 0,22", why: "Memuat nilai estimasi adalah hal yang wajar; lebarnya yang menjadi masalah untuk keputusan." },
          ],
        },
        {
          q: "Limit kartu dan tagihan berkorelasi r = 0,899. Kesimpulan mana yang benar?",
          options: [
            { text: "Menaikkan limit menyebabkan tagihan naik", why: "Korelasi bukan sebab-akibat: penghasilan bisa menjelaskan keduanya." },
            { text: "Limit membantu memprediksi tagihan, tapi bukan bukti sebab-akibat", why: "Benar: r = 0,899 adalah sinyal prediktif yang kuat, bukan klaim kausal.", correct: true },
            { text: "Korelasi 0,899 berarti 89,9 persen tagihan disebabkan limit", why: "Korelasi bukan persentase sebab — dan r kuadrat pun bukan bukti kausal." },
            { text: "Korelasi tidak berguna karena bukan sebab-akibat", why: "Untuk prediksi, korelasi sangat berguna; yang tidak boleh adalah klaim kausal tanpa desain." },
          ],
        },
        {
          q: "Korelasi 0,02 dengan n = 30.000 memberi p-value sekitar 0,0005. Penilaian mana yang benar?",
          options: [
            { text: "Efeknya penting karena p-value sangat kecil", why: "P-value kecil dengan n besar bisa datang dari efek yang remeh — efeknya di sini hanya 0,02." },
            { text: "Signifikan secara statistik, tapi remeh secara bisnis", why: "Benar: z sekitar 3,47 memberi p kecil, tapi effect size 0,02 praktis nol.", correct: true },
            { text: "Hasilnya salah karena p-value harus di atas 0,05", why: "Tidak ada aturan p-value harus di atas 0,05; yang salah adalah membaca p kecil sebagai penting." },
            { text: "Efek 0,02 dengan n besar tidak mungkin signifikan", why: "Justru dengan n besar, efek kecil pun signifikan — standard error-nya hanya 0,0058." },
          ],
        },
      ],
      summary: [
        "Mean vs median: selisih keduanya adalah tes skew termurah; laporkan keduanya bila ragu.",
        "Base rate menentukan PPV: tes 99 persen memberi PPV 0,5000 pada prevalensi 1 persen.",
        "Interval Wilson: [0,2108, 0,2318] pada n = 6.000 vs [0,1500, 0,3107] pada n = 100.",
        "Korelasi r = 0,899 membantu prediksi, bukan bukti kausal; p kecil bukan berarti penting.",
      ],
      next: { label: "Lanjut: MLF3 — Evaluasi Model", href: "/v2/learn/mlf3-evaluasi-model" },
    },
  ],
};
