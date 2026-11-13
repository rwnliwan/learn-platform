import type { V2Lesson } from "../lib/types";

export const mlfM34: V2Lesson = {
  slug: "mlf-m34-behavioral-peer-group",
  track: "Machine Learning Finance",
  module: "Unsupervised — fraud",
  title: "MLF-M3.4 — Behavioral Profiling & Peer-Group: Normal Menurut Siapa?",
  estMinutes: 60,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Modul M3 adalah unsupervised untuk fraud: tanpa label «fraud», bagaimana menemukan yang aneh — clustering, profiling, peer-group, dan triage alert. Lesson ini adalah fondasinya: sebelum menuduh sesuatu aneh, kamu harus tahu dulu apa yang normal — dan normal itu selalu relatif terhadap seseorang dan kelompoknya.",
        "Tujuan lesson ini:",
        "• Membangun behavioral profile per nasabah dari agregat: utilization (UTIL), pay ratio, dan bill trend (BILL_TREND) — tiga angka yang merangkum kebiasaan, bukan satu transaksi.",
        "• Mendefinisikan peer group yang benar: band LIMIT_BAL half-open — dan tahu kenapa peer group yang salah menghasilkan perbandingan yang salah.",
        "• Menghitung dan membaca z-score terhadap peer: z = (x − mean peer) / sd peer, dengan sd simpangan baku sampel (dibagi n−1).",
        "• Membaca flag |z| > 2 dengan benar: flag adalah undangan memeriksa, bukan vonis — 73,60% yang di-flag ternyata lancar.",
        "• Mengenali profile drift: profil yang berubah dari waktu ke waktu — dan kapan drift menjadi sinyal.",
        "• Menjalankan dua lab dari nol: hitung peer mean/sd + z-score, lalu flag |z| > 2 pada 8 nasabah yang sama.",
        "Isi lesson: cerita nasabah yang tagihannya 3x limit → behavioral profile → peer group → z-score → flag → profile drift → 2 lab → peta keputusan & mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini dihitung dari dataset UCI 30.000 nasabah, default rate 0,2212 [notebook]. Peer group = band LIMIT_BAL (NT$): <50rb n=4.311 default 0,3607; [50rb,150rb) n=10.979 default 0,2520; [150rb,300rb) n=9.593 default 0,1682; [300rb+) n=5.117 default 0,1368. Flag |z| > 2 dalam peer band: n=788 (2,63%), default 0,2640.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Tagihan 3x limit — aneh atau normal?",
      prose: [
        "Seorang analis fraud menatap satu baris di layar: nasabah dengan LIMIT_BAL NT$50.000 punya BILL_AMT1 NT$162.865. Tagihannya 3,26 kali lipat dari limitnya. Jari sudah di atas tombol «bekukan kartu» — lalu ia berhenti. Pertanyaan yang benar bukan «berapa besar tagihannya?», melainkan «normal menurut siapa?».",
        "Nasabah ini ternyata tetap lancar bulan berikutnya (default 0) [notebook] — ia membayar NT$5.000 dari tagihannya (PAY_RATIO 0,0307) secara revolving, tanpa satu pun telat di PAY_0..PAY_6. Ia bukan fraud — ia nasabah yang memakai kartunya jauh di atas limit nominalnya, lalu membayar sebagian secara teratur.",
        "Nilai: nasabah itu adalah baris UCI idx 13252 [notebook] — LIMIT_BAL 50.000, BILL_AMT1 162.865, UTIL 3,257, z = 6,67 terhadap peer band-nya [50rb,150rb). Ia ekstrem secara statistik dan lancar secara faktual. Dua fakta itu hidup berdampingan, dan lesson ini mengajarkan cara memegang keduanya sekaligus.",
        "Baik atau buruk: menilai transaksi dari nominal mentahnya bagus bila yang dicari adalah pelanggaran batas keras — misal transaksi di atas limit otorisasi. Buruk bila yang dicari adalah perilaku menyimpang: nominal mentah tidak tahu siapa nasabahnya, berapa limitnya, dan seperti apa kebiasaannya. NT$162.865 untuk nasabah berlimit NT$50.000 adalah 3,26x limit; untuk nasabah berlimit NT$1.000.000 itu 0,16x — angka yang sama, makna yang berlawanan.",
        "Mitigasi: jangan pernah menilai satu angka sendirian. Ubah transaksi menjadi profil (agregat per nasabah), bandingkan profil itu dengan peer group yang tepat, dan baca selisihnya sebagai z-score — baru putuskan apakah layak diperiksa. Itulah tiga langkah lesson ini.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: outlier = fraud",
        type: "pitfall",
        body: "Yang benar: outlier adalah data yang jauh dari pusat kelompoknya — bukan bukti niat jahat. Nasabah idx 13252 adalah outlier ekstrem (z = 6,67) yang ternyata lancar. Outlier mengundang pemeriksaan; hanya pemeriksaan yang boleh menyimpulkan.",
      },
    },
    {
      id: "profil",
      eyebrow: "Langkah 3 · Behavioral profile",
      title: "Behavioral profile: tiga angka yang merangkum kebiasaan",
      prose: [
        "Behavioral profile adalah ringkasan kebiasaan seorang nasabah dalam beberapa angka agregat — bukan satu transaksi, melainkan pola. Tiga agregat yang dipakai lesson ini, semuanya dihitung dari kolom UCI yang sama [notebook]: utilization UTIL = BILL_AMT1 / LIMIT_BAL — seberapa penuh limit dipakai; pay ratio PAY_RATIO = PAY_AMT1 / BILL_AMT1 — seberapa besar tagihan yang dibayar; bill trend BILL_TREND = BILL_AMT1 / rata-rata BILL_AMT1..6 — apakah tagihan bulan ini lebih besar dari kebiasaan enam bulannya. Jangan tertukar dengan dua rasio M3.3: V (velocity, M3.3) menghitung JUMLAH bulan dengan PAY_AMT > 0 — frekuensi membayar, bukan besar tagihan; R (bill jump, M3.3) = BILL_AMT1 / mean(BILL_AMT2..6) — penyebutnya lima bulan sebelumnya, bukan rata-rata enam bulan termasuk bulan ini.",
        "Nilai: pada 30.000 nasabah [notebook], UTIL mean 0,4238, median 0,3140 — separuh nasabah memakai kurang dari sepertiga limitnya. PAY_RATIO median 0,0611 — separuh nasabah membayar kurang dari 6 persen tagihannya (revolving); mean-nya 1,7761 justru menyesatkan, karena segelintir nasabah bertagihan nyaris nol membuat rasionya meledak — medianlah pusat yang jujur di sini. BILL_TREND mean 1,2586, median 1,0279 — tagihan bulan ini biasanya nyaris sama dengan rata-rata enam bulannya.",
        "Gambar mentalnya: profil adalah «sidik jari kebiasaan». Dua nasabah bisa punya tagihan yang sama bulan ini — satu membayar 90 persen tagihannya tiap bulan (PAY_RATIO 0,9), satu membayar 5 persen (PAY_RATIO 0,05). Transaksinya sama, profilnya berlawanan, risikonya berlawanan: nasabah dengan PAY_RATIO > 0,9 default 0,1539 (n = 4.140), sedangkan PAY_RATIO < 0,1 default 0,2440 (n = 16.786) [notebook]. Membayar hampir lunas adalah sinyal sehat; membayar minimum terus-menerus adalah sinyal rapuh.",
        "Satu fitur saja jarang cukup: UTIL > 1 (tagihan melebihi limit) default 0,3007 (n = 2.115) vs UTIL ≤ 1 default 0,2152 [notebook] — UTIL tinggi menaikkan risiko, tapi 69,93% nasabah ber-UTIL > 1 tetap lancar. BILL_TREND > 1,5 default 0,1646 (n = 5.937) vs BILL_TREND < 0,5 default 0,1608 [notebook] — BILL_TREND sendirian hampir tidak membedakan apa-apa. Profil bekerja sebagai kombinasi, bukan sebagai satu angka ajaib.",
        "Baik atau buruk: profil bagus bila agregatnya stabil (rata-rata 6 bulan lebih stabil dari satu bulan) dan definisinya transparan — tiap angka bisa dijelaskan ke pemeriksa. Buruk bila agregatnya memakai informasi dari masa depan: profil September yang memakai tagihan Oktober adalah leakage, bukan profil.",
        "Mitigasi: tetapkan jendela observasi sebelum menghitung — di UCI ini, profil September 2005 dihitung dari April–September 2005, dan labelnya Oktober 2005. Tulis jendelanya di samping angkanya: «UTIL Sep 2005, jendela 6 bulan» — supaya orang lain bisa membangun ulang profil yang sama persis.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: mean selalu mewakili pusat",
        type: "pitfall",
        body: "Yang benar: pada rasio dengan penyebut yang bisa mendekati nol — seperti PAY_RATIO saat BILL_AMT1 kecil — mean ditarik segelintir nilai raksasa (mean 1,7761 vs median 0,0611). Bila distribusinya miring, laporkan median di samping mean, dan katakan mana yang kamu pakai.",
      },
    },
    {
      id: "peer-group",
      eyebrow: "Langkah 4 · Peer group",
      title: "Peer group: band LIMIT_BAL — normal menurut siapa?",
      prose: [
        "Peer group adalah kelompok pembanding: nasabah-nasabah yang «sebanding» dengan yang dinilai, sehingga perbandingan menjadi adil. Di lesson ini peer group didefinisikan dari LIMIT_BAL — limit adalah proksi kapasitas dan segmen nasabah yang ditetapkan bank sendiri. Band-nya half-open dan tanpa tumpang tindih [notebook]: <50rb; [50rb,150rb); [150rb,300rb); [300rb+). LIMIT_BAL 150.000 masuk band [150rb,300rb) — bukan [50rb,150rb) — karena kurung siku [ berarti termasuk, kurung biasa ) berarti tidak termasuk.",
        "Nilai: keempat band itu [notebook] — <50rb: n = 4.311, default 0,3607, UTIL mean 0,6426, sd 0,4029. [50rb,150rb): n = 10.979, default 0,2520, UTIL mean 0,5551, sd 0,4048. [150rb,300rb): n = 9.593, default 0,1682, UTIL mean 0,2918, sd 0,3667. [300rb+): n = 5.117, default 0,1368, UTIL mean 0,2049, sd 0,3070. Polanya searah dan konsisten: limit makin besar → default makin rendah DAN utilization makin rendah.",
        "Gambar di bawah menunjukkan kedua pola itu sekaligus: batang default rate turun dari 0,3607 ke 0,1368, dan garis UTIL mean turun dari 0,6426 ke 0,2049. Dua penurunan itu saling menguatkan ceritanya: nasabah berlimit kecil memakai limitnya lebih penuh dan lebih sering default — utilization bukan sekadar angka, ia cermin segmen.",
        "Baik atau buruk: peer group berdasarkan LIMIT_BAL bagus bila limit memang mencerminkan segmen — di UCI ini iya, karena bank menetapkan limit dari penilaian kapasitas. Buruk bila peer group dicampur aduk: membandingkan nasabah berlimit NT$50.000 dengan nasabah berlimit NT$1.000.000 membuat UTIL 0,90 tampak ekstrem, padahal terhadap peer-nya sendiri UTIL 0,90 itu biasa (z = 0,85 — lihat kuis). Peer group yang salah = perbandingan yang salah = flag yang salah.",
        "Mitigasi: tiga aturan. Pertama, definisikan band secara eksplisit dan half-open, tanpa celah dan tanpa tumpang tindih — tiap nasabah masuk tepat satu band. Kedua, pastikan tiap band cukup besar: band terkecil di sini masih n = 4.311 — mean dan sd-nya stabil. Band dengan n = 30 akan goyah oleh satu nasabah. Ketiga, dokumentasikan definisi peer group di samping hasil: «peer = band LIMIT_BAL, cutoff Sep 2005» — supaya flag bisa diaudit ulang.",
      ],
      formula: String.raw`\text{UTIL} = \frac{\text{BILL\_AMT1}}{\text{LIMIT\_BAL}}`,
      formulaNote: "Utilization: tagihan bulan ini dibagi limit. UTIL 1 berarti tagihan sama dengan limit; UTIL 3,257 berarti tagihan 3,26 kali limit.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar default rate per band LIMIT_BAL: 0,3607; 0,2520; 0,1682; 0,1368; dan UTIL mean: 0,6426; 0,5551; 0,2918; 0,2049">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Default rate &amp; UTIL mean per band LIMIT_BAL</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="155.7" x2="52" y2="155.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="159.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="105.4" x2="52" y2="105.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="108.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="55.1" x2="52" y2="55.1" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="58.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<polyline points="100.0,44.4 190.0,66.4 280.0,132.6 370.0,154.5" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<rect x="82" y="115.3" width="36" height="90.7" fill="var(--c1)"/>
<text x="100" y="109.3" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,3607</text>
<rect x="172" y="142.6" width="36" height="63.4" fill="var(--c1)"/>
<text x="190" y="136.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,2520</text>
<rect x="262" y="163.7" width="36" height="42.3" fill="var(--c1)"/>
<text x="280" y="157.7" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,1682</text>
<rect x="352" y="171.6" width="36" height="34.4" fill="var(--c1)"/>
<text x="370" y="165.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,1368</text>
<circle cx="100.0" cy="44.4" r="5" fill="var(--c2)"/>
<text x="100" y="38.4" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,6426</text>
<circle cx="190.0" cy="66.4" r="5" fill="var(--c2)"/>
<text x="190" y="60.4" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5551</text>
<circle cx="280.0" cy="132.6" r="5" fill="var(--c2)"/>
<text x="280" y="126.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,2918</text>
<circle cx="370.0" cy="154.5" r="5" fill="var(--c2)"/>
<text x="370" y="148.5" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,2049</text>
<text x="100" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">&lt;50rb</text>
<text x="190" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">[50rb,150rb)</text>
<text x="280" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">[150rb,300rb)</text>
<text x="370" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">[300rb+)</text>
<text x="240" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">biru = default rate · garis + titik = UTIL mean [notebook]</text>
</svg>`,
        alt: "Bar default rate per band LIMIT_BAL: 0,3607; 0,2520; 0,1682; 0,1368; dan UTIL mean: 0,6426; 0,5551; 0,2918; 0,2049.",
        caption: "Cara membaca: X = band LIMIT_BAL (NT$, half-open); batang biru = default rate tiap band; garis + titik = UTIL mean tiap band [notebook]. Interpretasi: limit makin besar → default makin rendah (0,3607 → 0,1368) DAN utilization makin rendah (0,6426 → 0,2049) — dua pola searah, satu cerita segmen.",
      },
      tasks: [],
    },
    {
      id: "zscore",
      eyebrow: "Langkah 5 · Z-score vs peer",
      title: "Z-score: seberapa jauh dari peer, dalam satuan simpangan baku",
      prose: [
        "Peer group memberi pusat (mean) dan sebaran (sd). Z-score mengubah selisih mentah menjadi selisih yang bisa dibandingkan antar band: z = (x − mean peer) / sd peer. UTIL 0,90 di band [50rb,150rb) dan UTIL 0,90 di band [300rb+) adalah dua z yang berbeda — karena peer-nya berbeda.",
        "Definisi sd-nya wajib eksplisit: sd di sini adalah simpangan baku SAMPEL — akar dari jumlah kuadrat selisih dibagi (n−1), bukan dibagi n. Pembagi n−1 mengoreksi bias sampel kecil; pada n = 10.979 selisihnya nyaris tidak terasa, tapi pada peer group kecil ia penting — dan Lab 1 menghitungnya persis dengan pembagi n−1.",
        "Nilai — contoh hitung eksak [notebook]: nasabah idx 13252, UTIL 3,257, peer band [50rb,150rb) dengan mean 0,555 dan sd 0,405 (pembulatan dari 0,5551 dan 0,4048). z = (3,257 − 0,555) / 0,405 = 2,702 / 0,405 = 6,67. Artinya: utilization-nya 6,67 simpangan baku di atas rata-rata peer-nya. Bukan «6,67 kali lipat» — melainkan 6,67 satuan sebaran di atas pusat.",
        "Gambar di bawah memetakan contoh itu: garis peer mean 0,555, garis batas +2 sd di 1,365, dan titik nasabah di 3,257 — jauh di kanan, di dalam zona flag. Perhatikan juga batas bawahnya: −2 sd = 0,555 − 0,810 = −0,255 — di bawah nol. UTIL tidak bisa negatif, jadi flag |z| > 2 di sini praktis hanya terjadi di sisi atas. Z-score mengasumsikan sebaran yang simetris; UTIL miring kanan — jadi sisi bawahnya tidak punya arti.",
        "Baik atau buruk: z-score bagus bila peer group-nya besar dan homogen — mean dan sd-nya stabil, dan satu nasabah tidak mengubah keduanya. Buruk bila peer group-nya kecil: outlier yang sama yang sedang dinilai ikut menggelembungkan sd peer-nya sendiri, sehingga z-nya mengecil — persis yang terjadi di Lab 1 (z = 1,49 pada peer n = 4, vs z = 6,53 pada peer band n = 10.979 untuk nasabah yang sama).",
        "Mitigasi: hitung mean dan sd peer dari kelompok yang cukup besar (ratusan ke atas), dan bila peer group kecil, pakai statistik band yang lebih besar sebagai rujukan — seperti Lab 2. Dan selalu laporkan mean dan sd peer di samping z-nya: z tanpa peer adalah angka tanpa konteks.",
      ],
      formula: String.raw`z = \frac{x - \text{mean peer}}{\text{sd peer}}, \quad \text{sd} = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n-1}}`,
      formulaNote: "Z-score: selisih dari mean peer, dibagi simpangan baku peer. Sd adalah simpangan baku sampel — pembaginya (n−1), bukan n.",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Diagram z-score: peer mean UTIL 0,555, batas plus 2 sd di 1,365, nasabah idx 13252 di UTIL 3,257 dengan z sama dengan 6,67">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Z-score vs peer band [50rb,150rb) — mean 0,555 · sd 0,405</text>
<rect x="213.5" y="40" width="252.5" height="110" fill="var(--c4)" fill-opacity="0.15"/>
<text x="340" y="56" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">zona flag (sisi atas)</text>
<line x1="52" y1="150" x2="466" y2="150" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="117.6" y1="40" x2="117.6" y2="150" stroke="var(--c1)" stroke-width="2.5"/>
<text x="117.6" y="30" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">peer mean 0,555</text>
<line x1="213.5" y1="40" x2="213.5" y2="150" stroke="var(--c4)" stroke-width="2" stroke-dasharray="5 4"/>
<text x="213.5" y="30" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">batas +2 sd = 1,365</text>
<line x1="437.2" y1="40" x2="437.2" y2="150" stroke="var(--c2)" stroke-width="2" stroke-dasharray="5 4"/>
<circle cx="437.2" cy="150" r="5" fill="var(--c2)"/>
<text x="430" y="118" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">nasabah idx 13252</text>
<text x="430" y="134" text-anchor="end" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">UTIL 3,257 · z = 6,67</text>
<line x1="52.0" y1="144" x2="52.0" y2="156" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52.0" y="166" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="111.1" y1="144" x2="111.1" y2="156" stroke="var(--chart-text)" stroke-width="1"/>
<text x="111.1" y="166" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="170.3" y1="144" x2="170.3" y2="156" stroke="var(--chart-text)" stroke-width="1"/>
<text x="170.3" y="166" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1,0</text>
<line x1="229.4" y1="144" x2="229.4" y2="156" stroke="var(--chart-text)" stroke-width="1"/>
<text x="229.4" y="166" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1,5</text>
<line x1="288.6" y1="144" x2="288.6" y2="156" stroke="var(--chart-text)" stroke-width="1"/>
<text x="288.6" y="166" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2,0</text>
<line x1="347.7" y1="144" x2="347.7" y2="156" stroke="var(--chart-text)" stroke-width="1"/>
<text x="347.7" y="166" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2,5</text>
<line x1="406.9" y1="144" x2="406.9" y2="156" stroke="var(--chart-text)" stroke-width="1"/>
<text x="406.9" y="166" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3,0</text>
<line x1="466.0" y1="144" x2="466.0" y2="156" stroke="var(--chart-text)" stroke-width="1"/>
<text x="466.0" y="166" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3,5</text>
<text x="240" y="190" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Batas bawah −2 sd = −0,255: di bawah nol — UTIL tidak bisa negatif,</text>
<text x="240" y="206" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">jadi flag |z| &gt; 2 di sini praktis hanya terjadi di sisi atas.</text>
<text x="240" y="222" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">z = 6,67 berarti 6,67 simpangan baku di atas peer — ekstrem, bukan vonis.</text>
</svg>`,
        alt: "Diagram z-score: peer mean UTIL 0,555, batas plus 2 sd di 1,365, nasabah idx 13252 di UTIL 3,257 dengan z sama dengan 6,67.",
        caption: "Cara membaca: X = UTIL; garis biru = peer mean 0,555; garis putus-putus = batas +2 sd di 1,365; area berbayang = zona flag sisi atas; titik = nasabah idx 13252 (UTIL 3,257, z = 6,67) [notebook]. Interpretasi: nasabah itu jauh di luar zona normal peer-nya — tapi «jauh» belum berarti «bersalah»; batas bawah −2 sd jatuh di bawah nol, jadi flag praktis satu sisi.",
      },
      tasks: [],
    },
    {
      id: "flag",
      eyebrow: "Langkah 6 · Flag |z| > 2",
      title: "Flag |z| > 2: undangan memeriksa, bukan vonis",
      prose: [
        "Flag adalah aturan sederhana: |z| > 2 berarti nasabah itu lebih dari dua simpangan baku dari peer-nya — layak diperiksa. Aturan ini menangkap ekor distribusi: pada sebaran normal, sekitar 4,6 persen populasi berada di luar ±2 sd. Pada UTIL yang miring kanan, yang tertangkap hampir semuanya dari ekor atas.",
        "Nilai: flag |z| > 2 dalam peer band di UCI [notebook] — n = 788 dari 30.000 (2,63%), default rate 0,2640 vs keseluruhan 0,2212. Flag menaikkan risiko: 0,2640 vs 0,2212 — selisih 0,0428. Tapi jauh dari vonis: 73,60% yang di-flag TERNYATA lancar (580 dari 788). Tiga dari empat yang di-flag tidak default. Siapa pun yang membaca flag sebagai «fraud» akan salah tiga kali dari empat.",
        "Gambar mentalnya: flag adalah saringan, bukan hakim. Dari 30.000 nasabah, flag menyaring 788 untuk diperiksa manusia — bukan 788 untuk dibekukan. Tanpa flag, pemeriksa harus membaca 30.000 baris; dengan flag, 788. Nilai flag ada pada penghematan itu — dan pada kejujuran tentang batasnya: di dalam 788 itu, yang default hanya 208.",
        "Contoh nyata yang sama [notebook]: idx 13252, z = 6,67 — flag paling ekstrem yang bisa dibayangkan — default 0 (LANCAR). Ia memakai tagihan 3,26x limitnya, membayar NT$5.000 secara revolving tanpa satu pun telat (PAY_0..PAY_6 semua 0), dan tetap lancar. Kalau flag dibaca sebagai vonis, nasabah inilah yang paling dirugikan — padahal ia nasabah yang membayar teratur. Peer outlier adalah undangan memeriksa, bukan bukti.",
        "Baik atau buruk: flag |z| > 2 bagus bila tujuannya triage — mengurutkan siapa diperiksa duluan — dan bila kapasitas pemeriksa terbatas. Buruk bila dipakai sebagai keputusan otomatis (auto-decline, auto-bekukan): 73,60% false alarm dalam arti «di-flag tapi lancar» akan menjadi 73,60% nasabah yang dirugikan tanpa sebab.",
        "Mitigasi: tiga lapis. Pertama, jangan flag dari satu fitur saja — gabungkan UTIL dengan PAY_RATIO dan riwayat telat sebelum memutuskan. Kedua, bedakan flag «periksa» dari keputusan «tindak»: flag membuka antrean pemeriksaan, keputusan diambil manusia setelah memeriksa. Ketiga, ukur dan laporkan precision flag-mu sendiri — di sini 0,2640 — supaya tidak ada yang mengira flag itu vonis. Ekonomi dari antrean ini — berapa biaya memeriksa, berapa biaya melewatkan — adalah pelajaran M3.5.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: flag 2,63% berarti 2,63% nasabah fraud",
        type: "pitfall",
        body: "Yang benar: 2,63% adalah porsi yang di-flag — bukan porsi yang fraud, bukan pula porsi yang default. Yang default di antara yang di-flag hanya 26,40%. Flag mengukur keanehan statistik, bukan niat.",
      },
    },
    {
      id: "drift",
      eyebrow: "Langkah 7 · Profile drift",
      title: "Profile drift: ketika «normalnya dia» berubah",
      prose: [
        "Peer-group membandingkan nasabah dengan orang lain. Profile drift membandingkan nasabah dengan dirinya sendiri di masa lalu: profil yang berubah dari waktu ke waktu. Nasabah yang UTIL-nya 0,30 selama lima bulan lalu tiba-tiba 1,10 bulan ini sudah drift — meski 1,10 itu belum tentu ekstrem terhadap peer.",
        "Nilai — apa yang bisa dan tidak bisa diukur di UCI [notebook]: UCI adalah satu snapshot (fitur April–September 2005, label Oktober 2005), jadi drift «antar periode» yang sesungguhnya tidak tersedia — yang tersedia adalah perubahan di dalam jendela: rasio BILL_AMT1 terhadap BILL_AMT6. Nasabah dengan rasio > 2 (tagihan September lebih dari dua kali tagihan April) default 0,1568 (n = 5.747); rasio < 0,5 default 0,1632 (n = 3.787). Drift sendirian hampir tidak membedakan — sama seperti BILL_TREND sendirian. Itu fakta yang jujur, bukan kegagalan: drift adalah sinyal penguat, bukan sinyal tunggal.",
        "Gambar mentalnya: level menjawab «seberapa jauh dari peer?», drift menjawab «seberapa cepat ia menjauh dari dirinya sendiri?». Kombinasinya yang kuat: UTIL tinggi DAN naik cepat lebih mencurigakan daripada UTIL tinggi yang stabil — yang stabil itu kebiasaan, yang naik cepat itu perubahan. Di produksi, drift diukur sebagai selisih z-score antar periode: z bulan ini minus z tiga bulan lalu — bila selisihnya melewati ambang, profilnya dinyatakan berubah.",
        "Baik atau buruk: drift bagus bila profil dasarnya stabil dan datanya berderet waktu — perubahan mendadak lalu jadi sinyal yang bersih. Buruk bila profil dasarnya memang bergejolak (misal nasabah musiman): drift-nya berisik, dan ambang yang sama akan berteriak tiap musim. Buruk juga bila «drift» dihitung dari jendela yang tumpang tindih — perubahan yang sama dihitung dua kali.",
        "Mitigasi: tetapkan baseline yang eksplisit (misal rata-rata 6 bulan), tetapkan ambang drift sebelum melihat hasilnya, dan selalu baca drift bersama level — drift tanpa level tidak tahu arahnya, level tanpa drift tidak tahu kecepatannya. Dan catat keterbatasan datanya: di UCI satu snapshot ini, drift hanya bisa didemonstrasikan di dalam jendela April–September — klaim drift antar-periode yang sesungguhnya butuh data berderet yang tidak dimiliki dataset ini.",
      ],
      tasks: [],
      note: {
        title: "Kejujuran data: drift antar-periode tidak mungkin di UCI",
        type: "pitfall",
        body: "Yang benar: UCI hanya punya satu snapshot — fitur April–September 2005, label Oktober 2005. Tidak ada Oktober, November, dan seterusnya untuk dibandingkan. Drift di lesson ini didemonstrasikan sebagai perubahan di dalam jendela, dan drift antar-periode yang sesungguhnya diajarkan sebagai prinsip, bukan sebagai angka UCI.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 8 · Lab 1",
      title: "Lab: peer mean/sd + z-score untuk 8 nasabah",
      prose: [
        "Sekarang giliranmu menghitung. Datanya 8 nasabah dalam 2 peer group kecil: peer A (LIMIT_BAL NT$50.000, 4 nasabah) dan peer B (LIMIT_BAL NT$100.000, 4 nasabah). Kedua limit masuk band kanonis [50rb,150rb) — itu penting di Lab 2.",
        "Tugasmu: untuk tiap peer group, hitung mean dan sd SAMPEL (pembagi n−1) dari UTIL, lalu z-score tiap nasabah terhadap peer-nya sendiri. Perhatikan N4: UTIL 3,2000 — tagihan 3,2x limit — tapi z-nya hanya 1,4933. Kenapa? Karena N4 sendiri yang menggelembungkan sd peer A (1,3226): outlier itu ikut menghitung sebaran yang menilainya. Itulah kelemahan peer group kecil — dan alasan Lab 2 memakai statistik band yang besar.",
        "Bandingkan juga peer B: mean 0,3000, sd 0,1080 — kelompok yang rapat. N8 (UTIL 0,4500) mendapat z = 1,3887 di peer B, nyaris sebesar z N4 — padahal UTIL-nya tujuh kali lebih kecil. Z-score tidak mengukur besarnya angka; ia mengukur jauhnya dari peer.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `mean` tiap peer group" },
        { id: "t2", text: "Lengkapi `sd` sampel tiap peer group (pembagi n−1)" },
        { id: "t3", text: "Lengkapi `z` tiap nasabah dan jalankan" },
      ],
      expected: "peer A: n=4 mean=1.2250 sd=1.3226\npeer B: n=4 mean=0.3000 sd=0.1080\nN1 UTIL=0.4000 z=-0.6238\nN2 UTIL=0.7000 z=-0.3970\nN3 UTIL=0.6000 z=-0.4726\nN4 UTIL=3.2000 z=1.4933\nN5 UTIL=0.2000 z=-0.9258\nN6 UTIL=0.3000 z=0.0000\nN7 UTIL=0.2500 z=-0.4629\nN8 UTIL=0.4500 z=1.3887",
      hints: [
        "Mean = jumlah nilai dibagi banyaknya nilai.",
        "Sd sampel = akar dari jumlah kuadrat selisih dibagi (n−1) — bukan n.",
        "z = (UTIL − mean peer) / sd peer.",
      ],
      code: {
        starter: `import math

# Data: (nama, peer, LIMIT_BAL NT$, BILL_AMT1 NT$, default)
# Peer A = LIMIT_BAL 50.000; peer B = LIMIT_BAL 100.000.
# Kedua limit masuk band kanonis [50rb,150rb) — dipakai lagi di Lab 2.
data = [
    ("N1", "A", 50000, 20000, 0),
    ("N2", "A", 50000, 35000, 0),
    ("N3", "A", 50000, 30000, 1),
    ("N4", "A", 50000, 160000, 0),
    ("N5", "B", 100000, 20000, 0),
    ("N6", "B", 100000, 30000, 1),
    ("N7", "B", 100000, 25000, 0),
    ("N8", "B", 100000, 45000, 0),
]

utils = {}
for name, peer, limit, bill, y in data:
    utils[name] = bill / limit

stats = {}
for peer in ("A", "B"):
    vals = [utils[n] for n, p, _, _, _ in data if p == peer]
    mean = 0.0  # TODO: mean = sum(vals) / len(vals)
    sd = 0.0  # TODO: sd sampel = sqrt(sum((v - mean) ** 2 for v in vals) / (len(vals) - 1))
    stats[peer] = (mean, sd)
    print(f"peer {peer}: n={len(vals)} mean={mean:.4f} sd={sd:.4f}")

mean_a, sd_a = stats["A"]
mean_b, sd_b = stats["B"]

z = {}
for name, peer, limit, bill, y in data:
    m, sd = stats[peer]
    z[name] = 0.0  # TODO: z = (utils[name] - m) / sd
    print(f"{name} UTIL={utils[name]:.4f} z={z[name]:.4f}")

z_n4 = z["N4"]`,
        lockLines: 23,
        solution: `import math

# Data: (nama, peer, LIMIT_BAL NT$, BILL_AMT1 NT$, default)
# Peer A = LIMIT_BAL 50.000; peer B = LIMIT_BAL 100.000.
# Kedua limit masuk band kanonis [50rb,150rb) — dipakai lagi di Lab 2.
data = [
    ("N1", "A", 50000, 20000, 0),
    ("N2", "A", 50000, 35000, 0),
    ("N3", "A", 50000, 30000, 1),
    ("N4", "A", 50000, 160000, 0),
    ("N5", "B", 100000, 20000, 0),
    ("N6", "B", 100000, 30000, 1),
    ("N7", "B", 100000, 25000, 0),
    ("N8", "B", 100000, 45000, 0),
]

utils = {}
for name, peer, limit, bill, y in data:
    utils[name] = bill / limit

stats = {}
for peer in ("A", "B"):
    vals = [utils[n] for n, p, _, _, _ in data if p == peer]
    mean = sum(vals) / len(vals)
    sd = math.sqrt(sum((v - mean) ** 2 for v in vals) / (len(vals) - 1))
    stats[peer] = (mean, sd)
    print(f"peer {peer}: n={len(vals)} mean={mean:.4f} sd={sd:.4f}")

mean_a, sd_a = stats["A"]
mean_b, sd_b = stats["B"]

z = {}
for name, peer, limit, bill, y in data:
    m, sd = stats[peer]
    z[name] = (utils[name] - m) / sd
    print(f"{name} UTIL={utils[name]:.4f} z={z[name]:.4f}")

z_n4 = z["N4"]`,
        checks: [
          { kind: "equal", task: "t1", name: "mean_a", value: 1.225, tol: 0.0001, label: "`mean_a` seharusnya 1,2250", msg: "Mean UTIL peer A: (0,40 + 0,70 + 0,60 + 3,20) / 4 = 1,2250." },
          { kind: "equal", task: "t2", name: "sd_a", value: 1.3226, tol: 0.0001, label: "`sd_a` seharusnya 1,3226", msg: "Sd SAMPEL peer A (pembagi n−1 = 3): 1,3226 — bila memakai pembagi n, hasilnya 1,1454 dan salah." },
          { kind: "equal", task: "t3", name: "z_n4", value: 1.4933, tol: 0.0001, label: "`z_n4` seharusnya 1,4933", msg: "z N4 = (3,2000 − 1,2250) / 1,3226 = 1,4933 — di bawah 2, jadi belum di-flag di peer kecil ini." },
          { kind: "stdout_matches", task: "t3", pattern: "N4 UTIL=3\\.2000 z=1\\.4933", label: "Output menampilkan N4 UTIL 3.2000 z 1.4933", msg: "Format: N4 UTIL={util:.4f} z={z:.4f}." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 9 · Lab 2",
      title: "Lab: flag |z| > 2 dengan peer band yang besar",
      prose: [
        "Lab 1 menunjukkan masalah peer group kecil: N4 hanya mendapat z = 1,4933 — tidak di-flag — karena ia sendiri menggelembungkan sd peer-nya. Lab 2 memakai 8 nasabah yang sama, tapi dinilai terhadap statistik peer band kanonis [50rb,150rb) dari notebook: mean 0,555, sd 0,405 (n = 10.979). Kedelapan nasabah berlimit NT$50.000 atau NT$100.000 — semuanya masuk band itu, jadi perbandingannya sah.",
        "Hasilnya berbalik: N4 kini z = 6,5309 — di-flag. Nasabah yang sama, angka yang sama, keputusan yang berbeda — hanya karena peer group-nya berubah. Inilah kenapa definisi peer group adalah keputusan yang harus ditulis dan diaudit, bukan detail implementasi.",
        "Dan perhatikan ujungnya: yang di-flag hanya N4 — dan N4 default 0 (lancar). Default rate yang di-flag 0,0000, yang tidak di-flag 0,2857 (2 dari 7). Pada 8 orang ini, flag justru «salah arah» — persis seperti 73,60% yang di-flag ternyata lancar di data penuh. Lab kecil ini bukan bukti flag tidak berguna; ia bukti flag bukan vonis — dan bukti bahwa 8 orang terlalu sedikit untuk menilai kualitas sebuah flag.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `zz` tiap nasabah terhadap peer band kanonis" },
        { id: "t2", text: "Jalankan dan baca siapa yang di-flag" },
        { id: "t3", text: "Hitung default rate yang di-flag vs yang tidak di-flag" },
      ],
      expected: "N1 UTIL=0.4000 z=-0.3827\nN2 UTIL=0.7000 z=0.3580\nN3 UTIL=0.6000 z=0.1111\nN4 UTIL=3.2000 z=6.5309 FLAGGED\nN5 UTIL=0.2000 z=-0.8765\nN6 UTIL=0.3000 z=-0.6296\nN7 UTIL=0.2500 z=-0.7531\nN8 UTIL=0.4500 z=-0.2593\ndi-flag: ['N4']\njumlah di-flag: 1 dari 8 (0.1250)\ndefault rate yang di-flag: 0.0000\ndefault rate yang tidak di-flag: 0.2857",
      hints: [
        "z = (UTIL − peer_mean) / peer_sd, dengan peer_mean 0,555 dan peer_sd 0,405.",
        "Flag bila nilai mutlak z lebih dari 2 — pakai abs(zz) > 2.",
        "Default rate = jumlah default dibagi jumlah nasabah di kelompok itu.",
      ],
      code: {
        starter: `# Data yang sama dengan Lab 1: (nama, LIMIT_BAL NT$, BILL_AMT1 NT$, default)
# Peer band kanonis [50rb,150rb) dari notebook: mean 0.555, sd 0.405 (n=10.979).
data = [
    ("N1", 50000, 20000, 0),
    ("N2", 50000, 35000, 0),
    ("N3", 50000, 30000, 1),
    ("N4", 50000, 160000, 0),
    ("N5", 100000, 20000, 0),
    ("N6", 100000, 30000, 1),
    ("N7", 100000, 25000, 0),
    ("N8", 100000, 45000, 0),
]
peer_mean = 0.555
peer_sd = 0.405
flagged = []
for name, limit, bill, y in data:
    util = bill / limit
    zz = 0.0  # TODO: z = (util - peer_mean) / peer_sd
    mark = " FLAGGED" if abs(zz) > 2 else ""
    if abs(zz) > 2:
        flagged.append(name)
    print(f"{name} UTIL={util:.4f} z={zz:.4f}{mark}")
print(f"di-flag: {flagged}")
print(f"jumlah di-flag: {len(flagged)} dari {len(data)} ({len(flagged) / len(data):.4f})")
fdef = [y for n, _, _, y in data if n in flagged]
nfdef = [y for n, _, _, y in data if n not in flagged]
flagged_default_rate = sum(fdef) / len(fdef)
print(f"default rate yang di-flag: {flagged_default_rate:.4f}")
print(f"default rate yang tidak di-flag: {sum(nfdef) / len(nfdef):.4f}")`,
        lockLines: 17,
        solution: `# Data yang sama dengan Lab 1: (nama, LIMIT_BAL NT$, BILL_AMT1 NT$, default)
# Peer band kanonis [50rb,150rb) dari notebook: mean 0.555, sd 0.405 (n=10.979).
data = [
    ("N1", 50000, 20000, 0),
    ("N2", 50000, 35000, 0),
    ("N3", 50000, 30000, 1),
    ("N4", 50000, 160000, 0),
    ("N5", 100000, 20000, 0),
    ("N6", 100000, 30000, 1),
    ("N7", 100000, 25000, 0),
    ("N8", 100000, 45000, 0),
]
peer_mean = 0.555
peer_sd = 0.405
flagged = []
for name, limit, bill, y in data:
    util = bill / limit
    zz = (util - peer_mean) / peer_sd
    mark = " FLAGGED" if abs(zz) > 2 else ""
    if abs(zz) > 2:
        flagged.append(name)
    print(f"{name} UTIL={util:.4f} z={zz:.4f}{mark}")
print(f"di-flag: {flagged}")
print(f"jumlah di-flag: {len(flagged)} dari {len(data)} ({len(flagged) / len(data):.4f})")
fdef = [y for n, _, _, y in data if n in flagged]
nfdef = [y for n, _, _, y in data if n not in flagged]
flagged_default_rate = sum(fdef) / len(fdef)
print(f"default rate yang di-flag: {flagged_default_rate:.4f}")
print(f"default rate yang tidak di-flag: {sum(nfdef) / len(nfdef):.4f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "flagged", value: ["N4"], label: "`flagged` seharusnya ['N4']", msg: "Hanya N4 yang |z| > 2: z = 6,5309. N8 (z = −0,2593) dan yang lain jauh di bawah ambang." },
          { kind: "equal", task: "t3", name: "flagged_default_rate", value: 0, tol: 1e-9, label: "`flagged_default_rate` seharusnya 0,0000", msg: "Satu-satunya yang di-flag (N4) default 0 — flag di sini bukan vonis, dan n = 8 terlalu kecil untuk menilai flag." },
          { kind: "stdout_matches", task: "t2", pattern: "di-flag: \\['N4'\\]", label: "Output menampilkan di-flag ['N4']", msg: "Format: di-flag: {flagged}." },
          { kind: "stdout_matches", task: "t3", pattern: "default rate yang di-flag: 0\\.0000", label: "Output menampilkan default rate yang di-flag 0.0000", msg: "Format: default rate yang di-flag: {rate:.4f}." },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 10 · Peta keputusan & mini-case",
      title: "Peta keputusan & mini-case: dari flag ke tindakan",
      prose: [
        "Peta keputusan lesson ini — kapan memakai apa:",
        "Butuh tahu «normalnya dia»? Bangun behavioral profile: UTIL, PAY_RATIO, BILL_TREND dari jendela 6 bulan — bukan satu transaksi.",
        "Butuh tahu «normal menurut siapa»? Definisikan peer group dulu — band LIMIT_BAL half-open — sebelum menghitung apa pun; peer yang salah meracuni semua angka sesudahnya.",
        "Butuh satu angka keanehan? Z-score terhadap peer (sd sampel, pembagi n−1) — dan laporkan mean/sd peer di samping z-nya.",
        "Butuh antrean pemeriksaan? Flag |z| > 2 — tapi flag membuka antrean, bukan menutup vonis; 73,60% yang di-flag ternyata lancar.",
        "Butuh tahu apakah ini perubahan atau kebiasaan? Tambah drift: bandingkan profilnya dengan dirinya sendiri 3–6 bulan lalu — level tanpa drift tidak tahu kecepatan, drift tanpa level tidak tahu arah.",
        "Mini-case — nasabah idx 13252, sekali lagi, sekarang sebagai keputusan. Fakta [notebook]: LIMIT_BAL NT$50.000, BILL_AMT1 NT$162.865, UTIL 3,257, z = 6,67 terhadap peer [50rb,150rb), default 0 (LANCAR). Flag berkata «periksa duluan». Pemeriksaan bertanya tiga hal: (1) Apakah UTIL tinggi ini menetap atau satu bulan saja — lihat BILL_AMT1..6 dan BILL_TREND-nya. (2) Apakah ia membayar — lihat PAY_RATIO dan PAY_0..PAY_6: nasabah yang membayar lunas tiap bulan bukan pola fraud. (3) Apakah profilnya drift — bandingkan dengan dirinya 6 bulan lalu. Bila ketiganya menjawab «ia memang begitu dan ia membayar», keputusannya: tidak ada tindakan, catat sebagai profil ekstrem yang sah. Bila salah satunya menjawab «ini baru dan ia tidak membayar», keputusannya: eskalasi ke pemeriksa senior — tetap bukan bekukan otomatis. Itulah beda triage dan vonis.",
        "Kesalahan yang paling mahal di sini bukan melewatkan satu fraud — melainkan membekukan nasabah yang membayar, karena kepercayaan yang rusak tidak kembali dengan permintaan maaf. Karena itu flag selalu berpasangan dengan pemeriksaan manusia — dan ekonomi antrean pemeriksaan itu adalah M3.5.",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab: profiling & peer-group di data UCI 30.000 nasabah",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat pada 8 nasabah. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m34-guided-task.ipynb.",
        "Di notebook itu kamu memuat dataset UCI yang sesungguhnya (30.000 nasabah), membangun behavioral profile (UTIL, PAY_RATIO, BILL_TREND), menghitung peer band LIMIT_BAL beserta mean/sd-nya, menghitung z-score dan flag |z| > 2 (n = 788, default 0,2640), memeriksa contoh nyata idx 13252 (UTIL 3,257, z = 6,67, lancar), dan mendemonstrasikan profile drift di dalam jendela April–September 2005 — lengkap dengan checks yang menegaskan tiap angka kanonis lesson ini.",
        "Tautan Colab:",
        "https://colab.research.google.com/drive/1dCk7vX61YHTN21xn14bNofuSgiLvTCNU",
        "Jalur file notebook: colab/mlf-m34-guided-task.ipynb.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint: normal menurut siapa?",
      prose: [
        "Rangkuman: behavioral profile merangkum kebiasaan dalam UTIL, PAY_RATIO, dan BILL_TREND. Peer group (band LIMIT_BAL half-open) menentukan apa yang «normal» — peer yang salah menghasilkan perbandingan yang salah. Z-score mengukur jauhnya dari peer dalam satuan sd sampel (pembagi n−1): idx 13252 z = 6,67. Flag |z| > 2 menyaring 788 nasabah (2,63%) dengan default 0,2640 — tapi 73,60% yang di-flag ternyata lancar, jadi flag adalah undangan memeriksa, bukan vonis. Profile drift membandingkan nasabah dengan dirinya sendiri — level tanpa drift tidak tahu kecepatan, drift tanpa level tidak tahu arah.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Nasabah UTIL 1,365; peer band-nya mean 0,555, sd 0,405. Berapa z-score-nya, dan apakah ia di-flag (|z| > 2)?",
          options: [
            { text: "z = 2,00 — tepat di batas, TIDAK di-flag (aturan |z| > 2)", why: "Benar: (1,365 − 0,555) / 0,405 = 0,810 / 0,405 = 2,00. Aturan |z| > 2: 2,00 tidak lebih dari 2 — jadi secara ketat ia TIDAK di-flag, ia tepat di batas. (Soal ini menguji ketelitian: yang di-flag adalah yang MELEBIHI 2.)", correct: true },
            { text: "z = 3,37 — di-flag", why: "3,37 = 1,365 / 0,405 — kamu lupa mengurangi mean peer dulu. Z-score mengukur selisih dari mean, bukan nilai mentahnya." },
            { text: "z = 1,50 — tidak di-flag", why: "1,50 tidak muncul dari angka ini: (1,365 − 0,555) = 0,810, dan 0,810 / 0,405 = 2,00 — bukan 1,50." },
            { text: "z = 0,81 — tidak di-flag", why: "0,81 adalah selisih mentah (1,365 − 0,555) — belum dibagi sd. Tanpa dibagi sd, angkanya tidak bisa dibandingkan antar band." },
          ],
        },
        {
          q: "Nasabah berlimit NT$50.000 punya UTIL 0,90. Analis membandingkannya dengan peer berlimit [300rb+) (UTIL mean 0,2049, sd 0,3070) dan menyimpulkan ia ekstrem. Apa kesalahannya?",
          options: [
            { text: "Tidak ada — UTIL 0,90 memang ekstrem di mana pun", why: "Salah: terhadap peer-nya sendiri [50rb,150rb) (mean 0,5551, sd 0,4048), z-nya hanya 0,85 — biasa saja. «Ekstrem» tergantung peer." },
            { text: "Peer group-nya salah — ia harus dibandingkan dengan band [50rb,150rb)", why: "Benar: terhadap peer yang salah, z = (0,90 − 0,2049) / 0,3070 = 2,26 (tampak ekstrem); terhadap peer sendiri, z = 0,85 (normal). Peer group yang salah = perbandingan yang salah.", correct: true },
            { text: "UTIL 0,90 tidak mungkin untuk limit 50.000", why: "Mungkin: UTIL 0,90 berarti tagihan NT$45.000 pada limit NT$50.000 — sangat wajar." },
            { text: "Sd peer [300rb+) terlalu kecil", why: "Sd 0,3070 bukan masalahnya — masalahnya adalah memakai peer dari segmen yang berbeda." },
          ],
        },
        {
          q: "Dari 788 nasabah yang di-flag |z| > 2, 73,60% ternyata lancar. Apa arti angka ini yang paling tepat?",
          options: [
            { text: "Flag tidak berguna — harus dibuang", why: "Salah: flag menaikkan default rate dari 0,2212 ke 0,2640 dan menyaring 30.000 baris menjadi 788 untuk diperiksa. Ia berguna sebagai triage, bukan sebagai vonis." },
            { text: "Flag adalah undangan memeriksa — tiga dari empat yang di-flag tidak default", why: "Benar: 73,60% lancar berarti flag bukan bukti. Flag membuka antrean pemeriksaan; keputusan diambil setelah memeriksa.", correct: true },
            { text: "73,60% nasabah UCI adalah fraud", why: "Salah besar: 73,60% adalah porsi LANCAR di antara yang di-flag — bukan porsi fraud, dan flag tidak mengukur fraud." },
            { text: "Ambang flag harus dinaikkan sampai tidak ada yang lancar di-flag", why: "Salah: menaikkan ambang sampai 0% lancar di-flag berarti hampir tidak ada yang di-flag — dan sebagian besar default akan lolos. Itu menukar false alarm dengan miss." },
          ],
        },
        {
          q: "UTIL nasabah naik dari 0,30 ke 1,10 dalam dua bulan, tapi z terhadap peer-nya masih di bawah 2. Apa respons yang paling tepat?",
          options: [
            { text: "Abaikan — z di bawah 2 berarti tidak ada apa-apa", why: "Salah: level-nya normal terhadap peer, tapi perubahannya terhadap dirinya sendiri besar — itu drift, dan drift adalah sinyal yang terpisah dari level." },
            { text: "Langsung bekukan kartunya", why: "Salah: tidak ada flag, tidak ada bukti — pembekuan tanpa pemeriksaan adalah vonis tanpa proses." },
            { text: "Catat sebagai drift, pantau, dan gabungkan dengan sinyal lain (pay ratio, riwayat telat)", why: "Benar: drift + level dibaca bersama. Drift sendirian hampir tidak membedakan (di UCI, rasio tagihan > 2 default 0,1568 vs < 0,5 default 0,1632) — ia penguat, bukan vonis.", correct: true },
            { text: "Ubah peer group-nya sampai z-nya melewati 2", why: "Salah: memilih peer group sampai hasilnya sesuai keinginan adalah manipulasi — peer group ditetapkan dulu, hasilnya diterima apa adanya." },
          ],
        },
        {
          q: "Mengapa sd peer di lesson ini memakai pembagi (n−1), bukan n?",
          options: [
            { text: "Karena (n−1) membuat sd lebih kecil", why: "Terbalik: membagi dengan (n−1) yang lebih kecil membuat sd LEBIH BESAR — koreksi untuk sampel kecil." },
            { text: "Karena sd sampel membagi jumlah kuadrat selisih dengan (n−1) untuk mengoreksi bias", why: "Benar: itulah definisi simpangan baku sampel. Pada n = 10.979 selisihnya nyaris tidak terasa, tapi pada peer group kecil ia penting — Lab 1 membuktikannya.", correct: true },
            { text: "Karena n adalah jumlah populasi, bukan sampel", why: "Terbalik: n di sini adalah ukuran sampel peer group — dan justru karena ini sampel, pembaginya (n−1)." },
            { text: "Tidak ada bedanya — keduanya memberi hasil yang sama", why: "Salah: pada n = 4 (Lab 1), sd peer A dengan pembagi n adalah 1,1454 vs 1,3226 dengan (n−1) — z N4 ikut berubah." },
          ],
        },
        {
          q: "LIMIT_BAL nasabah tepat NT$150.000. Masuk band peer yang mana?",
          options: [
            { text: "[50rb,150rb)", why: "Salah: kurung ) berarti 150.000 TIDAK termasuk — band ini hanya sampai di bawah 150.000." },
            { text: "[150rb,300rb)", why: "Benar: kurung siku [ berarti 150.000 termasuk. Band half-open memastikan tiap nasabah masuk tepat satu band — tanpa celah, tanpa tumpang tindih.", correct: true },
            { text: "Keduanya — ia dihitung di dua band", why: "Salah: itulah yang dicegah notasi half-open. Satu nasabah, satu band." },
            { text: "Tidak masuk band mana pun — ia di celah", why: "Salah: band half-open menutup semua nilai — [50rb,150rb) berakhir tepat di mana [150rb,300rb) mulai." },
          ],
        },
        {
          q: "Band LIMIT_BAL mana yang default rate-nya paling tinggi, dan berapa?",
          options: [
            { text: "[300rb+) — 0,1368", why: "Itu justru yang PALING RENDAH: limit terbesar, default terendah." },
            { text: "<50rb — 0,3607", why: "Benar: band limit terkecil default 0,3607 (n = 4.311) — lebih dari satu setengah kali base rate 0,2212. Limit makin besar → default makin rendah.", correct: true },
            { text: "[50rb,150rb) — 0,2520", why: "Itu band kedua — 0,2520, di bawah <50rb (0,3607)." },
            { text: "[150rb,300rb) — 0,1682", why: "Itu band ketiga — 0,1682, jauh di bawah yang tertinggi." },
          ],
        },
        {
          q: "Di Lab 1, N4 mendapat z = 1,49 terhadap peer kecilnya (n = 4); di Lab 2, N4 yang sama mendapat z = 6,53 terhadap peer band (n = 10.979). Mengapa z-nya berbeda?",
          options: [
            { text: "Karena UTIL N4 berubah antar lab", why: "Salah: UTIL N4 tetap 3,2000 di kedua lab — yang berubah adalah peer-nya." },
            { text: "Karena outlier menggelembungkan sd peer kecilnya sendiri, sehingga z mengecil", why: "Benar: sd peer A 1,3226 membengkak karena N4 sendiri ada di dalamnya; sd band 0,405 stabil karena N4 hanya 1 dari 10.979. Peer kecil membuat z tidak bisa dipercaya.", correct: true },
            { text: "Karena Lab 2 memakai sd populasi, Lab 1 memakai sd sampel", why: "Salah: kedua lab memakai sd sampel (pembagi n−1) — bedanya adalah ukuran peer group, bukan definisi sd." },
            { text: "Karena ambang flag Lab 2 lebih rendah", why: "Salah: ambang flag sama (|z| > 2) di kedua lab — yang berbeda adalah z-nya, bukan ambangnya." },
          ],
        },
      ],
      summary: [
        "Behavioral profile merangkum kebiasaan dalam UTIL, PAY_RATIO, dan BILL_TREND — median lebih jujur dari mean bila distribusinya miring.",
        "Peer group = band LIMIT_BAL half-open (<50rb; [50rb,150rb); [150rb,300rb); [300rb+)): limit makin besar → default makin rendah (0,3607 → 0,1368) dan UTIL makin rendah (0,6426 → 0,2049).",
        "Z-score: z = (x − mean peer) / sd peer, sd = simpangan baku sampel (pembagi n−1). Contoh eksak: idx 13252 z = 6,67.",
        "Flag |z| > 2: n = 788 (2,63%), default 0,2640 vs 0,2212 — tapi 73,60% yang di-flag ternyata lancar: flag adalah undangan memeriksa, bukan vonis.",
        "Profile drift membandingkan nasabah dengan dirinya sendiri; drift sendirian hampir tidak membedakan — ia penguat, bukan sinyal tunggal.",
        "Lab: peer kecil membuat z N4 hanya 1,49; peer band membuat z N4 6,53 — nasabah yang sama, peer yang berbeda, keputusan yang berbeda.",
      ],
      next: { label: "Lanjut: MLF-M3.5 — Alert Triage Economics", href: "/v2/learn/mlf-m35-alert-triage-economics" },
    },
  ],
};
