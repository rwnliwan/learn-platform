import type { V2Lesson } from "../lib/types";

export const mlfL03: V2Lesson = {
  slug: "mlf-l03-distribusi-outlier",
  track: "Machine Learning Finance",
  module: "Data Foundations — prasyarat M1",
  title: "L0.3 — Distribusi & Outlier: Membaca Bentuk Data",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "L0.2 mengajarkan mean vs median — tapi pilihan itu baru benar bila kamu tahu bentuk distribusinya. Lesson ini mengajarkan cara membaca bentuk: normal atau miring, ke kanan atau ke kiri, dan kapan satu-dua nilai ekstrem mengubah segalanya.",
        "Tujuan lesson ini:",
        "• Memeriksa normalitas dengan tiga alat: histogram, QQ plot, dan skewness/kurtosis — plus Shapiro-Wilk dengan catatan besar sampelnya.",
        "• Membedakan right-skew dan left-skew, dan memilih transformasi yang benar untuk masing-masing.",
        "• Mendeteksi outlier dengan dua metode yang saling memeriksa: pagar IQR dan z-score.",
        "• Memutuskan nasib outlier: selidiki dulu, hapus belakangan — dan hanya dengan alasan.",
        "Isi lesson: cerita kompas mean vs median → normal → right-skew → left-skew → outlier → 2 lab → peta keputusan → mini-case notebook → guided task di Colab → checkpoint.",
        "Batas scope: lesson ini adalah fondasi terapan — prosedur memeriksa, angka, dan keputusan. Teori distribusi yang dalam (uji formal, keluarga distribusi) ada di Track A; MLF2 memakai mean/median/CI sebagai alat baca dan mendelegasikan detail QQ, Shapiro-Wilk, IQR, z-score, dan log-transform ke lesson ini.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Mean 3,48, median 2,70 — kompas yang menunjuk ke bentuk",
      prose: [
        "Di L0.2, daftar B punya mean 3,4833 dan median 2,7000. Selisih 0,7833 itu bukan sekadar angka — itu kompas. Bila mean jauh lebih besar dari median, ekornya ke kanan. Bila mean jauh lebih kecil, ekornya ke kiri. Bila keduanya hampir sama, bentuknya simetris.",
        "Analis yang hanya melihat mean akan menyimpulkan 'rata-rata nasabah ber-income 3,48 juta' — padahal 9 dari 12 nasabah berada di bawah angka itu. Analis yang melihat bentuknya tahu: satu outlier 12,0 menarik mean ke atas, dan median 2,7 adalah gambaran yang lebih jujur.",
        "Lesson ini mengajarkan empat diagnosis, masing-masing dengan gambarnya sendiri: normal, right-skew, left-skew, dan outlier. Tiap diagnosis punya tiga hal: bentuknya, cara membacanya, dan fix-nya.",
      ],
      tasks: [],
      note: {
        title: "Tip: mean vs median adalah kompas skew",
        body: "Sebelum menghitung skewness, bandingkan mean dan median. Mean lebih besar dari median berarti ekor kanan (right-skew); mean lebih kecil berarti ekor kiri (left-skew); keduanya hampir sama berarti simetris. Kompas ini bekerja dalam 5 detik dan hampir tidak pernah salah arah — detail angkanya menyusul di langkah berikut.",
      },
    },
    {
      id: "normal",
      eyebrow: "Langkah 3 · Normal",
      title: "Normal: lonceng, garis lurus, dan angka yang setuju",
      prose: [
        "Distribusi normal adalah lonceng yang simetris: mean, median, dan modus berhimpit di tengah, ekornya sama panjang di kedua sisi. Tiga alat memeriksanya — dan ketiganya harus setuju sebelum kamu menyebut data itu normal.",
        "Nilai: 20 skor (48 sampai 84) [lab] — mean 65,75, median 65,50 (selisih 0,25, hampir berhimpit); skewness 0,068 (hampir 0); kurtosis (excess) −0,612 (sedikit lebih datar dari lonceng normal, tapi masih dalam batas wajar); korelasi QQ 0,9988 (titik-titik menempel garis acuan). Band skewness-nya kontinu: nilai absolut di bawah 0,5 berarti hampir simetris; 0,5 sampai 1 miring sedang; di atas 1 miring kuat. Band korelasi QQ: di atas 0,99 menempel garis; 0,95 sampai 0,99 cukup dekat; di bawah 0,95 menyimpang. Band kurtosis (excess): nilai absolut di bawah 1 wajar — −0,612 masuk band wajar.",
        "Gambar di bawah menunjukkan dua panel: histogram yang berbentuk lonceng, dan QQ plot yang titik-titiknya menempel garis acuan. QQ plot bekerja dengan membandingkan kuantil data dengan kuantil normal teoritis — bila data normal, titik-titiknya jatuh di garis lurus. Bila melengkung, bentuknya menyimpang — dan arah lengkungannya memberitahu ke mana miringnya (lihat langkah berikut).",
        "Baik atau buruk: normal baik untuk mean, sd, dan uji-uji klasik — semuanya mengasumsikan bentuk ini. Normal buruk bila dipaksakan: menerapkan uji yang mengasumsikan normal pada data yang miring kuat menghasilkan p-value yang tidak bisa dipercaya.",
        "Mitigasi: bila tidak normal, jangan langsung transformasi — cek dulu arah miringnya (langkah 4 dan 5). Bila miringnya sedang (skew 0,5 sampai 1), banyak metode masih tahan. Bila miring kuat, transformasi atau metode robust. Dan Shapiro-Wilk: p sama dengan 0,03 [ilustrasi] pada n sama dengan 30.000 menolak normal — tapi pada n sebesar itu, penyimpangan kecil pun menghasilkan p kecil. Selalu cek BESAR penyimpangannya (skewness, QQ), bukan hanya p-value-nya.",
        "Prosedur Shapiro-Wilk (input → output → interpretasi): inputnya data terurut dan koefisien bobot a_i yang dihitung dari kuantil normal yang diharapkan — rumusnya memakai norm_ppf yang sama dengan QQ plot di Lab 2, jadi W dan korelasi QQ adalah saudara: keduanya membandingkan data terurut dengan kuantil normal teoritis. Outputnya satu angka W antara 0 dan 1 — makin dekat ke 1, makin normal. Interpretasinya: bandingkan W dengan nilai kritis untuk n dan alpha 0,05 — bila W di bawah kritis, tolak normal. Contoh [lab]: norm20 W 0,998 (n=20, kritis 0,905) — tidak tolak normal; bills W 0,586 (n=14, kritis 0,874) — tolak normal; exams W 0,816 (n=16, kritis 0,887) — tolak normal. Ketiganya setuju dengan QQ dan skewness — dan di situlah gunanya: W adalah konfirmasi, bukan pengganti gambar. Peringatan besar sampel: pada n 30.000, W bisa menolak normal karena penyimpangan yang secara praktis tidak berarti — p-value makin sensitif seiring n membesar, sedangkan besar penyimpangan (skewness, QQ) tidak. Karena itu uji formal tidak pernah menjadi satu-satunya dasar keputusan: gambar dulu, angka menyusul, uji formal terakhir.",
      ],
      formula: String.raw`\text{skewness} = \frac{\frac{1}{n}\sum (x_i - \bar{x})^3}{s^3}`,
      formulaNote: "Skewness: momen ketiga yang distandardisasi. Nol berarti simetris; positif berarti ekor kanan; negatif berarti ekor kiri. Dibagi s pangkat 3 supaya tidak bergantung pada satuan. s di sini adalah standard deviation populasi (pembagi n), sehingga pembilang dan penyebut konsisten — bila memakai sd sampel (pembagi n−1), hasilnya berbeda.",
      figure: {
        svg: `<svg viewBox="0 0 480 360" role="img" aria-label="Histogram lonceng dan QQ plot dengan titik menempel garis">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Histogram: bentuk lonceng</text>
<line x1="52" y1="36" x2="52" y2="176" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="176" x2="466" y2="176" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="179.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="44" y="119.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<text x="44" y="59.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<rect x="63.6" y="146.0" width="28.5" height="30.0" fill="var(--c1)"/>
<text x="77.9" y="140.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1</text>
<rect x="115.4" y="146.0" width="28.5" height="30.0" fill="var(--c1)"/>
<text x="129.6" y="140.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1</text>
<rect x="167.1" y="86.0" width="28.5" height="90.0" fill="var(--c1)"/>
<text x="181.4" y="80.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">3</text>
<rect x="218.9" y="56.0" width="28.5" height="120.0" fill="var(--c1)"/>
<text x="233.1" y="50.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">4</text>
<rect x="270.6" y="56.0" width="28.5" height="120.0" fill="var(--c1)"/>
<text x="284.9" y="50.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">4</text>
<rect x="322.4" y="86.0" width="28.5" height="90.0" fill="var(--c1)"/>
<text x="336.6" y="80.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">3</text>
<rect x="374.1" y="116.0" width="28.5" height="60.0" fill="var(--c1)"/>
<text x="388.4" y="110.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">2</text>
<rect x="425.9" y="116.0" width="28.5" height="60.0" fill="var(--c1)"/>
<text x="440.1" y="110.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">2</text>
<text x="77.9" y="192" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">45–50</text>
<text x="129.6" y="192" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">50–55</text>
<text x="181.4" y="192" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">55–60</text>
<text x="233.1" y="192" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">60–65</text>
<text x="284.9" y="192" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">65–70</text>
<text x="336.6" y="192" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">70–75</text>
<text x="388.4" y="192" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">75–80</text>
<text x="440.1" y="192" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">80–85</text>
<text x="240.0" y="212" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">QQ plot: titik menempel garis</text>
<line x1="52" y1="216" x2="52" y2="356" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="356" x2="466" y2="356" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="96.7" y1="333.6" x2="421.3" y2="232.8" stroke="var(--c2)" stroke-width="1.5"/>
<circle cx="96.7" cy="333.6" r="3" fill="var(--c1)"/>
<circle cx="139.8" cy="322.4" r="3" fill="var(--c1)"/>
<circle cx="163.8" cy="314.0" r="3" fill="var(--c1)"/>
<circle cx="181.6" cy="308.4" r="3" fill="var(--c1)"/>
<circle cx="196.5" cy="302.8" r="3" fill="var(--c1)"/>
<circle cx="209.5" cy="300.0" r="3" fill="var(--c1)"/>
<circle cx="221.4" cy="297.2" r="3" fill="var(--c1)"/>
<circle cx="232.6" cy="294.4" r="3" fill="var(--c1)"/>
<circle cx="243.3" cy="291.6" r="3" fill="var(--c1)"/>
<circle cx="253.8" cy="286.0" r="3" fill="var(--c1)"/>
<circle cx="264.2" cy="283.2" r="3" fill="var(--c1)"/>
<circle cx="274.7" cy="277.6" r="3" fill="var(--c1)"/>
<circle cx="285.4" cy="274.8" r="3" fill="var(--c1)"/>
<circle cx="296.6" cy="272.0" r="3" fill="var(--c1)"/>
<circle cx="308.5" cy="269.2" r="3" fill="var(--c1)"/>
<circle cx="321.5" cy="263.6" r="3" fill="var(--c1)"/>
<circle cx="336.4" cy="258.0" r="3" fill="var(--c1)"/>
<circle cx="354.2" cy="252.4" r="3" fill="var(--c1)"/>
<circle cx="378.2" cy="244.0" r="3" fill="var(--c1)"/>
<circle cx="421.3" cy="232.8" r="3" fill="var(--c1)"/>
</svg>`,
        alt: "Histogram lonceng dan QQ plot dengan titik menempel garis.",
        caption: "Cara membaca: histogram simetris di tengah (puncak di 60–70), QQ plot membandingkan kuantil data dengan kuantil normal — titik menempel garis acuan berarti normal. Interpretasi: skewness 0,068 dan korelasi QQ 0,9988 setuju — data ini mendekati normal.",
      },
      tasks: [],
      note: {
        title: "Tip: cek QQ dulu, p-value belakangan",
        body: "Shapiro-Wilk memberi satu angka (p-value) tanpa menunjukkan DI MANA penyimpangannya. QQ plot menunjukkan bentuknya: lengkung ke atas di ujung kanan berarti ekor kanan; titik yang menjauh di ujung berarti outlier. Mulai dari gambar, baru konfirmasi dengan angka.",
      },
    },
    {
      id: "rightskew",
      eyebrow: "Langkah 4 · Right-skew",
      title: "Right-skew: ekor kanan dan log-transform",
      prose: [
        "Right-skew adalah bentuk yang paling umum di finance: income, tagihan, limit kartu, kerugian — semuanya punya batas bawah (nol) dan ekor kanan yang panjang. Mean tertarik ke kanan, median tinggal di tengah kerumunan, dan selisih keduanya adalah tanda pertamanya.",
        "Nilai: 14 tagihan kartu (ribu rupiah) [lab] — [120, 150, 180, 200, 220, 250, 280, 300, 350, 400, 500, 800, 1500, 3000]: mean 589,3, median 290,0 — mean dua kali lipat median; skewness 2,386 (miring kuat, di atas 1); korelasi QQ 0,7692 (jauh di bawah 0,95 — menyimpang). Setelah log-transform (log natural tiap nilai): mean 5,901, median 5,669; skewness 1,068; korelasi QQ 0,9493. Log menarik ekor ke dalam — skewness turun dari 2,39 ke 1,07 dan QQ naik dari 0,77 ke 0,95 — tapi belum normal: skewness masih di atas 1.",
        "Gambar di bawah menunjukkan sebelum dan sesudah log: panel atas menumpuk di kiri dengan satu batang jauh di kanan (3.000); panel bawah menyebar lebih merata. Perhatikan: log tidak menghilangkan ekor — ia memendekkannya. Nilai 3.000 yang tadinya 10 kali lipat median kini hanya sekitar 1,4 kali lipat dalam skala log.",
        "Baik atau buruk: right-skew baik untuk median dan metode robust — keduanya tidak peduli ekor. Right-skew buruk untuk mean dan sd — keduanya ditarik ekor, dan interval yang dibangun dari keduanya menyesatkan. Log-transform baik bila nilai semuanya positif dan ekornya panjang; buruk bila ada nol atau negatif (log nol tidak terdefinisi — geser dulu atau pakai log1p). Contoh nyata: BILL_AMT di notebook bisa negatif sampai −165.580 — log langsung tidak terdefinisi di sana.",
        "Mitigasi: urutan fix-nya — pertama log (atau akar kuadrat untuk skew sedang); bila masih miring kuat, coba Box-Cox; bila tetap miring, jangan paksa normal — pakai median, IQR, dan metode robust. Dan ingat: log mengubah interpretasi — koefisien model pada data log adalah efek persen, bukan efek rupiah.",
        "Kotak keputusan — kapan TIDAK transformasi: lima pertanyaan sebelum kamu menyentuh transformasi apa pun. (1) Apakah model/metodemu butuh asumsi distribusi? Bila tidak (tree-based, median, IQR) — jangan transformasi, pakai metode robust. (2) Apakah ada nol atau negatif? Bila ya — log langsung tidak terdefinisi: BILL_AMT bisa negatif sampai −165.580 [notebook] karena itu saldo kredit, bukan error — geser dulu (log1p) atau jangan transformasi sama sekali. (3) Apakah interpretasi skala asli penting? Bila ya — efek log adalah efek persen, bukan rupiah; bila stakeholder butuh rupiah, laporkan di skala asli atau transform balik. (4) Apakah metode robust sudah cukup? Bila median dan IQR menjawab pertanyaanmu — cukup, jangan transformasi. (5) Transformasi predictor saja atau target juga? Bila target yang ditransformasi, prediksimu keluar di skala log dan harus ditransform balik — dan intervalnya menjadi asimetris di skala asli. Bila kelima pertanyaan dijawab dan transformasi tetap diperlukan — barulah log, Box-Cox, atau reflect+log.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 360" role="img" aria-label="Histogram tagihan sebelum log (ekor kanan panjang) dan sesudah log (lebih simetris)">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Tagihan: ekor kanan panjang</text>
<line x1="52" y1="36" x2="52" y2="176" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="176" x2="466" y2="176" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="179.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="44" y="129.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<text x="44" y="79.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<rect x="70.7" y="51.0" width="45.5" height="125.0" fill="var(--c1)"/>
<text x="93.4" y="45.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">5</text>
<rect x="153.5" y="51.0" width="45.5" height="125.0" fill="var(--c1)"/>
<text x="176.2" y="45.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">5</text>
<rect x="236.3" y="126.0" width="45.5" height="50.0" fill="var(--c1)"/>
<text x="259.0" y="120.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">2</text>
<rect x="319.1" y="151.0" width="45.5" height="25.0" fill="var(--c1)"/>
<text x="341.8" y="145.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1</text>
<rect x="401.9" y="151.0" width="45.5" height="25.0" fill="var(--c4)"/>
<text x="424.6" y="145.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1</text>
<text x="93.4" y="192" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">0–250</text>
<text x="176.2" y="192" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">250–500</text>
<text x="259.0" y="192" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">500–1000</text>
<text x="341.8" y="192" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">1000–2000</text>
<text x="424.6" y="192" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">2000–3500</text>
<text x="240.0" y="212" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Sesudah log: ekor tertarik masuk</text>
<line x1="52" y1="216" x2="52" y2="356" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="356" x2="466" y2="356" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="65.4" y="331.0" width="32.5" height="25.0" fill="var(--c1)"/>
<text x="81.6" y="325.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1</text>
<rect x="124.5" y="231.0" width="32.5" height="125.0" fill="var(--c1)"/>
<text x="140.7" y="225.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">5</text>
<rect x="183.7" y="256.0" width="32.5" height="100.0" fill="var(--c1)"/>
<text x="199.9" y="250.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">4</text>
<rect x="242.8" y="331.0" width="32.5" height="25.0" fill="var(--c1)"/>
<text x="259.0" y="325.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1</text>
<rect x="301.9" y="331.0" width="32.5" height="25.0" fill="var(--c1)"/>
<text x="318.1" y="325.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1</text>
<rect x="361.1" y="331.0" width="32.5" height="25.0" fill="var(--c1)"/>
<text x="377.3" y="325.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1</text>
<rect x="420.2" y="331.0" width="32.5" height="25.0" fill="var(--c1)"/>
<text x="436.4" y="325.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1</text>
</svg>`,
        alt: "Histogram tagihan sebelum log (ekor kanan panjang) dan sesudah log (lebih simetris).",
        caption: "Cara membaca: panel atas menumpuk di kiri dengan ekor sampai 3.000; panel bawah (skala log) menyebar lebih merata. Interpretasi: log menurunkan skewness dari 2,39 ke 1,07 dan menaikkan korelasi QQ dari 0,77 ke 0,95 — membaik, tapi belum normal.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: log selalu menormalkan",
        type: "pitfall",
        body: "Yang benar: log membantu bila ekornya panjang dan nilainya positif — tapi ia bukan sulap. Tagihan di atas membaik dari skewness 2,39 ke 1,07, masih di atas 1 (miring kuat). Bila setelah log masih miring kuat, jangan tambah transformasi membabi buta — pakai median dan metode robust.",
      },
    },
    {
      id: "leftskew",
      eyebrow: "Langkah 5 · Left-skew",
      title: "Left-skew: cermin dan fix-nya",
      prose: [
        "Left-skew adalah cermin dari right-skew: ekornya ke kiri, mean tertarik ke bawah median. Bentuk ini muncul pada skor yang menumpuk di batas atas — ujian yang terlalu mudah, skor kepuasan yang menumpuk di 9–10, atau persentase yang mendekati 100.",
        "Nilai: 16 skor ujian [55, 70, 78, 82, 85, 88, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99] [ilustrasi] — mean 87,69, median 91,50 — mean lebih kecil dari median, kompas menunjuk ke kiri; skewness −1,569 (miring kuat); korelasi QQ 0,9047 (menyimpang). Fix-nya: reflect dulu (100 dikurangi skor), lalu log — reflect membalik ekor kiri menjadi ekor kanan, log lalu menariknya masuk. Hasilnya: skewness −0,296, korelasi QQ 0,9959 — hampir normal. Alternatif yang gagal: mengkuadratkan skor — skewness hanya turun ke −1,271, nyaris tidak memperbaiki.",
        "Gambar di bawah menunjukkan histogramnya: menumpuk di kanan (90–100 ada 10 dari 16), dengan ekor tipis ke kiri sampai 55. Perhatikan: bin 60–70 kosong — celah itu adalah jejak ekor kiri.",
        "Baik atau buruk: left-skew baik untuk median — ia tidak peduli ekor. Left-skew buruk untuk mean — mean 87,69 lebih rendah dari 11 dari 16 skor, dan 'rata-rata 87,7' meremehkan kelompok yang menumpuk di atas 90. Reflect + log baik bila batas atasnya jelas (skor maksimal 100); buruk bila batas atasnya tidak jelas — reflect butuh nilai cermin yang bermakna.",
        "Mitigasi: bila batas atasnya jelas, reflect (maks dikurangi nilai) lalu log — dan ingat urutannya: reflect DULU, log KEMUDIAN; log langsung pada data left-skew justru memperburuk. Bila batas atasnya tidak jelas, pakai median dan metode robust — jangan paksa transformasi yang tidak punya cermin.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Histogram skor ujian: menumpuk di kanan, ekor tipis ke kiri">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Skor ujian: menumpuk di kanan, ekor ke kiri</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="44" y="179.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<text x="44" y="149.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<text x="44" y="119.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6</text>
<text x="44" y="89.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">8</text>
<text x="44" y="59.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">10</text>
<rect x="70.7" y="191.0" width="45.5" height="15.0" fill="var(--c1)"/>
<text x="93.4" y="185.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1</text>
<text x="93.4" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">55–60</text>
<rect x="153.5" y="206.0" width="45.5" height="0.0" fill="var(--c1)"/>
<text x="176.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">60–70</text>
<rect x="236.3" y="176.0" width="45.5" height="30.0" fill="var(--c1)"/>
<text x="259.0" y="170.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2</text>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">70–80</text>
<rect x="319.1" y="161.0" width="45.5" height="45.0" fill="var(--c1)"/>
<text x="341.8" y="155.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">3</text>
<text x="341.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">80–90</text>
<rect x="401.9" y="56.0" width="45.5" height="150.0" fill="var(--c4)"/>
<text x="424.6" y="50.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">10</text>
<text x="424.6" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">90–100</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">mean 87,69 &lt; median 91,50 — ekor kiri</text>
</svg>`,
        alt: "Histogram skor ujian: menumpuk di kanan, ekor tipis ke kiri.",
        caption: "Cara membaca: 10 dari 16 skor menumpuk di 90–100, ekor tipis sampai 55; bin 60–70 kosong. Interpretasi: mean 87,69 di bawah median 91,50 — left-skew kuat (skewness −1,569). Fix: reflect (100 − skor) lalu log → skewness −0,296.",
      },
      tasks: [],
    },
    {
      id: "outlier",
      eyebrow: "Langkah 6 · Outlier",
      title: "Outlier: dua metode yang saling memeriksa",
      prose: [
        "Outlier adalah nilai yang jauh dari kerumunan — tapi 'jauh' harus diukur, bukan dirasakan. Dua metode mengukurnya dari arah yang berbeda, dan keduanya harus setuju sebelum kamu bertindak.",
        "Nilai: 15 transaksi (ribu rupiah) [lab] — [120, 95, 210, 88, 150, 175, 130, 99, 5000, 145, 180, 110, 4200, 160, 140]: mean 733,47, sd populasi 1523,95. Metode IQR: Q1 sama dengan 110, median 145, Q3 sama dengan 180 (metode Tukey: median separuh bawah dan atas), IQR sama dengan 70, pagar bawah 5,0, pagar atas 285,0. Di luar pagar: 5000 dan 4200. Metode z-score: z(5000) sama dengan 2,80, z(4200) sama dengan 2,27 — keduanya di atas 2. Band z-score-nya kontinu: nilai absolut di bawah 2 biasa; 2 sampai 3 periksa (3 termasuk); di atas 3 kuat. Kedua metode setuju: yang sama adalah 5000 dan 4200.",
        "Gambar di bawah adalah boxplot-nya: kotak dari Q1 ke Q3 dengan garis median, kumis sampai pagar, dan dua titik jauh di kanan — dengan skala yang terputus, karena 5.000 tidak muat di skala yang sama dengan kotak 110–180. Keterputusan skala itu sendiri adalah pesannya: outlier ini bukan 'sedikit lebih besar', melainkan satu orde lebih besar. Panel bawah gambar yang sama menunjukkan jebakan berikutnya: empat nilai korporat yang tampak sebagai outlier global ternyata bukan outlier apa pun di dalam kelompoknya sendiri.",
        "Baik atau buruk: outlier baik bila diselidiki — 5.000 dan 4.200 bisa jadi transaksi korporat yang sah, atau kesalahan input satu nol. Outlier buruk bila dihapus otomatis — menghapus 2 dari 15 baris (13 persen) tanpa alasan adalah membuang data; dan bila keduanya sah, model yang dilatih tanpa mereka tidak pernah belajar menghadapi transaksi besar. Outlier buruk bila dibiarkan mentah pada model yang sensitif — mean 733,47 dari 15 transaksi ini lebih dari 5 kali lipat median 145, dan satu nilai mengubah seluruh gambaran.",
        "Mitigasi: pertama selidiki — cek sumbernya, tanya pemilik data. Bila sah tapi mengganggu model: winsorize (cap di pagar atas 285,0) atau pakai model robust (median, tree-based). Bila terbukti salah input: perbaiki atau hapus dengan dokumentasi. Bila tidak bisa diputuskan: laporkan hasil dengan dan tanpa outlier — itulah uji sensitivitas yang jujur.",
        "Outlier global vs per-kelompok adalah jebakan yang paling mahal di lesson ini. Contoh [ilustrasi]: 16 transaksi reguler [120, 150, 180, 200, 220, 250, 280, 300, 320, 350, 380, 420, 450, 480, 500, 550] dan 4 transaksi korporat [3.200, 4.200, 5.000, 6.200]. Secara global (n=20): Q1 235, median 365, Q3 525, IQR 290, pagar atas 960 — keempat nilai korporat di luar pagar, semuanya 'outlier'. Per kelompok: reguler Q1 210, median 310, Q3 435, IQR 225, pagar atas 772,5 — tidak ada outlier; korporat Q1 3.700, median 4.600, Q3 5.600, IQR 1.900, pagar atas 8.450 — tidak ada outlier. Keempat nilai itu bukan outlier — mereka kelompok yang berbeda. Workflow-nya: deteksi dulu (IQR + z-score, global), segmentasi (pecah menurut kelompok yang bermakna bisnis — jenis nasabah, kanal, wilayah), validasi bisnis (tanya pemilik data: apakah transaksi korporat memang sebesar itu?), lalu analisis pengaruh (berapa besar kesimpulan berubah bila keempat nilai itu dikeluarkan?). Bila kesimpulannya berubah drastis, laporkan keduanya. Influence diagnostics formal — seberapa besar satu observasi mengubah koefisien model — adalah materi Track A; di sini cukup pahami: outlier yang mengubah kesimpulan adalah outlier yang berpengaruh, dan pengaruh itu harus dilaporkan, bukan disembunyikan.",
      ],
      formula: String.raw`\text{pagar bawah} = Q_1 - 1,5 \times \text{IQR} \qquad \text{pagar atas} = Q_3 + 1,5 \times \text{IQR}`,
      formulaNote: "Pagar IQR (Tukey): nilai di luar pagar adalah kandidat outlier. IQR sama dengan Q3 dikurangi Q1. Faktor 1,5 adalah konvensi — bukan hukum alam — jadi hasil IQR selalu dicek silang dengan z-score.",
      figure: {
        svg: `<svg viewBox="0 0 480 520" role="img" aria-label="Boxplot 15 transaksi: kotak 110 sampai 180, pagar atas 285, outlier 4200 dan 5000 jauh di kanan. Panel bawah: outlier global vs per kelompok">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Boxplot: 15 transaksi (skala terputus)</text>
<line x1="52" y1="180" x2="340" y2="180" stroke="var(--chart-text)" stroke-width="1"/>
<text x="52" y="196" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="148" y="196" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">100</text>
<text x="244" y="196" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">200</text>
<text x="340" y="196" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">300</text>
<line x1="56.8" y1="100" x2="56.8" y2="140" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="4 3"/>
<line x1="136.5" y1="100" x2="136.5" y2="140" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="136.5" y1="120" x2="157.6" y2="120" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="157.6" y="100" width="67.2" height="40" fill="var(--c1)"/>
<line x1="191.2" y1="100" x2="191.2" y2="140" stroke="var(--text)" stroke-width="2.5"/>
<line x1="224.8" y1="120" x2="253.6" y2="120" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="253.6" y1="100" x2="253.6" y2="140" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="325.6" y1="100" x2="325.6" y2="140" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="56.8" y="92" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">pagar 5</text>
<text x="157.6" y="92" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Q1 110</text>
<text x="191.2" y="160" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">median 145</text>
<text x="224.8" y="92" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Q3 180</text>
<text x="325.6" y="92" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">pagar 285</text>
<path d="M340 100 L350 120 L340 140 M350 100 L360 120 L350 140" stroke="var(--chart-text)" stroke-width="1.5" fill="none"/>
<circle cx="395" cy="120" r="5" fill="var(--c4)"/>
<text x="395" y="100" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">4.200</text>
<circle cx="435" cy="120" r="5" fill="var(--c4)"/>
<text x="435" y="100" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">5.000</text>
<text x="259.0" y="222" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">skala terputus: 4.200 dan 5.000 jauh di luar pagar atas 285,0</text>
<line x1="20" y1="252" x2="460" y2="252" stroke="var(--chart-text)" stroke-width="1"/>
<text x="240.0" y="272" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Satu outlier global, nol outlier per kelompok</text>
<text x="240.0" y="292" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Global (n=20): Q1 235, med 365, Q3 525 — pagar atas 960</text>
<line x1="20" y1="328" x2="460" y2="328" stroke="var(--chart-text)" stroke-width="1"/>
<text x="20" y="344" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="88" y="344" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">1000</text>
<text x="156" y="344" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">2000</text>
<text x="224" y="344" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">3000</text>
<text x="292" y="344" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">4000</text>
<text x="359" y="344" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">5000</text>
<text x="427" y="344" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">6000</text>
<line x1="28" y1="328" x2="36" y2="328" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="36" y="308" width="20" height="40" fill="var(--c1)"/>
<line x1="45" y1="308" x2="45" y2="348" stroke="var(--text)" stroke-width="2.5"/>
<line x1="56" y1="328" x2="85" y2="328" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="4 3"/>
<line x1="85" y1="308" x2="85" y2="348" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="4 3"/>
<circle cx="237" cy="328" r="5" fill="var(--c4)"/>
<circle cx="304" cy="328" r="5" fill="var(--c4)"/>
<circle cx="359" cy="328" r="5" fill="var(--c4)"/>
<circle cx="440" cy="328" r="5" fill="var(--c4)"/>
<text x="338" y="362" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4 nilai korporat di luar pagar</text>
<text x="240.0" y="380" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Per kelompok — skala yang sama:</text>
<text x="240.0" y="398" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Reguler (n=16): Q1 210, med 310, Q3 435 — tidak ada outlier</text>
<line x1="28" y1="419" x2="34" y2="419" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="34" y="404" width="15" height="30" fill="var(--c1)"/>
<line x1="41" y1="404" x2="41" y2="434" stroke="var(--text)" stroke-width="2.5"/>
<line x1="49" y1="419" x2="57" y2="419" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="57" y1="404" x2="57" y2="434" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="72" y1="404" x2="72" y2="434" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="240.0" y="452" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Korporat (n=4): Q1 3700, med 4600, Q3 5600 — tidak ada outlier</text>
<line x1="78" y1="475" x2="78" y2="490" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="4 3"/>
<line x1="237" y1="475" x2="270" y2="475" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="270" y="460" width="129" height="30" fill="var(--c1)"/>
<line x1="331" y1="460" x2="331" y2="490" stroke="var(--text)" stroke-width="2.5"/>
<line x1="399" y1="475" x2="440" y2="475" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="440" y1="460" x2="440" y2="490" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="240.0" y="508" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Kesimpulan: empat nilai itu bukan outlier — mereka kelompok yang berbeda.</text>
</svg>`,
        alt: "Boxplot 15 transaksi: kotak 110 sampai 180, pagar atas 285, outlier 4200 dan 5000 jauh di kanan. Panel bawah: outlier global vs per kelompok.",
        caption: "Cara membaca: kotak Q1–Q3 (110–180) dengan median 145; kumis sampai pagar bawah 5,0 dan pagar atas 285,0; dua titik di kanan adalah outlier. Interpretasi: IQR dan z-score setuju (z 2,80 dan 2,27) — tapi kesepakatan metode bukan vonis; selidiki dulu sebelum menghapus. Panel bawah [ilustrasi]: 16 transaksi reguler + 4 korporat — secara global keempat nilai korporat di luar pagar atas 960; per kelompok tidak ada outlier (reguler pagar atas 772,5; korporat pagar atas 8.450). Kesimpulan: mereka kelompok yang berbeda, bukan outlier.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: outlier harus selalu dihapus",
        type: "pitfall",
        body: "Yang benar: outlier adalah undangan untuk menyelidiki, bukan perintah menghapus. 5.000 dan 4.200 dari 15 transaksi bisa jadi transaksi korporat yang sah — menghapusnya berarti model tidak pernah belajar menghadapi transaksi besar. Hapus hanya bila terbukti salah input, dan selalu dengan dokumentasi.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab 1 — Deteksi outlier dengan IQR dan z-score",
      prose: [
        "Kerjakan deteksi outlier pada 15 transaksi: hitung mean dan sd populasi, kuartil dengan metode Tukey (median separuh bawah dan atas), pagar IQR, lalu daftar outlier-nya — dan cek silang dengan z-score.",
        "Tiga tugas: hitung Q1, median, Q3, dan IQR; hitung pagar bawah dan atas lalu daftar nilai di luar pagar; hitung z-score kedua outlier. Fungsi median sudah disediakan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung Q1, median, Q3 (Tukey) dan IQR dari 15 transaksi." },
        { id: "t2", text: "Hitung pagar bawah (Q1 − 1,5×IQR) dan pagar atas (Q3 + 1,5×IQR), lalu daftar nilai di luar pagar." },
        { id: "t3", text: "Hitung z-score kedua outlier — apakah keduanya di atas 2?" },
      ],
      expected: "mean: 733.47\nsd: 1523.95\nQ1: 110\nmedian: 145\nQ3: 180\nIQR: 70\npagar bawah: 5.0\npagar atas: 285.0\noutlier: [5000, 4200]\nz 5000: 2.80\nz 4200: 2.27",
      code: {
        starter: `# 15 transaksi (ribu rupiah) — sama dengan contoh di langkah 6.
tx = [120, 95, 210, 88, 150, 175, 130, 99, 5000, 145, 180, 110, 4200, 160, 140]
def med(xs):
    s = sorted(xs)
    n = len(s)
    if n % 2 == 1:
        return s[n // 2]
    return (s[n // 2 - 1] + s[n // 2]) / 2
def pvar(xs):
    m = sum(xs) / len(xs)
    return sum((x - m) ** 2 for x in xs) / len(xs)
mean = sum(tx) / len(tx)
sd = pvar(tx) ** 0.5
s = sorted(tx)
q1 = 0  # TODO: median separuh bawah (Tukey)
q3 = 0  # TODO: median separuh atas (Tukey)
iqr = 0  # TODO: Q3 - Q1
lo = 0.0  # TODO: pagar bawah = Q1 - 1,5 * IQR
hi = 0.0  # TODO: pagar atas = Q3 + 1,5 * IQR
out = []  # TODO: nilai di luar pagar
z5000 = 0.0  # TODO: z-score 5000
z4200 = 0.0  # TODO: z-score 4200
print(f"mean: {mean:.2f}")
print(f"sd: {sd:.2f}")
print(f"Q1: {q1}")
print(f"median: {med(tx)}")
print(f"Q3: {q3}")
print(f"IQR: {iqr}")
print(f"pagar bawah: {lo:.1f}")
print(f"pagar atas: {hi:.1f}")
print(f"outlier: {out}")
print(f"z 5000: {z5000:.2f}")
print(f"z 4200: {z4200:.2f}")`,
        lockLines: 14,
        solution: `# 15 transaksi (ribu rupiah) — sama dengan contoh di langkah 6.
tx = [120, 95, 210, 88, 150, 175, 130, 99, 5000, 145, 180, 110, 4200, 160, 140]
def med(xs):
    s = sorted(xs)
    n = len(s)
    if n % 2 == 1:
        return s[n // 2]
    return (s[n // 2 - 1] + s[n // 2]) / 2
def pvar(xs):
    m = sum(xs) / len(xs)
    return sum((x - m) ** 2 for x in xs) / len(xs)
mean = sum(tx) / len(tx)
sd = pvar(tx) ** 0.5
s = sorted(tx)
q1 = med(s[:7])
q3 = med(s[8:])
iqr = q3 - q1
lo = q1 - 1.5 * iqr
hi = q3 + 1.5 * iqr
out = [x for x in tx if x < lo or x > hi]
z5000 = (5000 - mean) / sd
z4200 = (4200 - mean) / sd
print(f"mean: {mean:.2f}")
print(f"sd: {sd:.2f}")
print(f"Q1: {q1}")
print(f"median: {med(tx)}")
print(f"Q3: {q3}")
print(f"IQR: {iqr}")
print(f"pagar bawah: {lo:.1f}")
print(f"pagar atas: {hi:.1f}")
print(f"outlier: {out}")
print(f"z 5000: {z5000:.2f}")
print(f"z 4200: {z4200:.2f}")`,
        checks: [
          { kind: "equal", task: "mean = 733,47", value: 733.47, tol: 0.01, name: "mean", label: "`mean` seharusnya 733.47", msg: "mean = 733,47" },
          { kind: "equal", task: "sd populasi = 1523,95", value: 1523.95, tol: 0.01, name: "sd", label: "`sd` seharusnya 1523.95", msg: "sd populasi = 1523,95" },
          { kind: "equal", task: "Q1 = 110", value: 110, name: "q1", label: "`q1` seharusnya 110", msg: "Q1 = 110" },
          { kind: "equal", task: "Q3 = 180", value: 180, name: "q3", label: "`q3` seharusnya 180", msg: "Q3 = 180" },
          { kind: "equal", task: "IQR = 70", value: 70, name: "iqr", label: "`iqr` seharusnya 70", msg: "IQR = 70" },
          { kind: "equal", task: "pagar atas = 285,0", value: 285.0, tol: 0.1, name: "hi", label: "`hi` seharusnya 285.0", msg: "pagar atas = 285,0" },
          { kind: "equal", task: "z 5000 = 2,80", value: 2.8, tol: 0.01, name: "z5000", label: "`z5000` seharusnya 2.8", msg: "z 5000 = 2,80" },
          { kind: "equal", task: "z 4200 = 2,27", value: 2.27, tol: 0.01, name: "z4200", label: "`z4200` seharusnya 2.27", msg: "z 4200 = 2,27" },
          { kind: "stdout_matches", task: "laporan lab lengkap tercetak", pattern: "mean: 733.47\\nsd: 1523.95\\nQ1: 110\\nmedian: 145\\nQ3: 180\\nIQR: 70\\npagar bawah: 5.0\\npagar atas: 285.0\\noutlier: \\[5000, 4200\\]\\nz 5000: 2.80\\nz 4200: 2.27", label: "Output menampilkan mean: 733.47", msg: "Bandingkan tiap baris output dengan expected di atas." },
        ],
      },
      hints: [
        "Tukey: separuh bawah adalah 7 nilai terkecil (median 110), separuh atas 7 nilai terbesar (median 180) — nilai tengah (145) tidak ikut keduanya.",
        "Pagar bawah: Q1 − 1,5 × IQR = 110 − 105 = 5,0. Pagar atas: 180 + 105 = 285,0.",
        "z-score: (nilai − mean) dibagi sd.",
      ],
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab 2 — Log-transform dan korelasi QQ",
      prose: [
        "Kerjakan transformasi log pada 14 tagihan: hitung skewness dan korelasi QQ sebelum dan sesudah log, lalu nilai sendiri apakah log sudah cukup. Fungsi kuantil normal (norm_ppf) dan korelasi sudah disediakan — tugasmu menulis skewness dan korelasi QQ-nya.",
        "Tiga tugas: tulis fungsi skewness (momen ketiga dibagi sd pangkat 3) dan fungsi qq_r (korelasi antara data terurut dan kuantil normal teoritis); terapkan keduanya pada tagihan dan pada log tagihan; dan hitung W Shapiro-Wilk untuk norm20, bills, dan exams dengan fungsi sw_w yang disediakan, lalu bandingkan dengan nilai kritisnya (0,905 / 0,874 / 0,887) dan simpulkan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi skewness dan hitung skewness tagihan sebelum log." },
        { id: "t2", text: "Log-transform tagihan, hitung skewness dan korelasi QQ sesudahnya — bandingkan dengan sebelum log." },
        { id: "t3", text: "Hitung W Shapiro-Wilk untuk norm20, bills, dan exams dengan fungsi sw_w yang disediakan, lalu bandingkan dengan nilai kritisnya (0,905 / 0,874 / 0,887) dan simpulkan." },
      ],
      expected: "skew tagihan: 2.386\nqq-r tagihan: 0.7692\nskew tagihan sesudah log: 1.068\nqq-r tagihan sesudah log: 0.9493\nW norm20: 0.998 (kritis 0,905) — tidak tolak normal\nW bills: 0.586 (kritis 0,874) — tolak normal\nW exams: 0.816 (kritis 0,887) — tolak normal",
      code: {
        starter: `import math
# 14 tagihan kartu (ribu rupiah) — sama dengan contoh di langkah 4.
bills = [120, 150, 180, 200, 220, 250, 280, 300, 350, 400, 500, 800, 1500, 3000]
def norm_ppf(p):
    # Aproksimasi Acklam untuk kuantil normal standar.
    a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
         1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00]
    b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
         6.680131188771972e+01, -1.328068155288572e+01]
    c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
         -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00]
    d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00,
         3.754408661907416e+00]
    plow, phigh = 0.02425, 1 - 0.02425
    if p < plow:
        q = math.sqrt(-2 * math.log(p))
        return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    if p > phigh:
        q = math.sqrt(-2 * math.log(1 - p))
        return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    q = p - 0.5
    r = q * q
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
def corr(xs, ys):
    n = len(xs)
    mx, my = sum(xs) / n, sum(ys) / n
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den = (sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys)) ** 0.5
    return num / den
def skew(xs):
    m = sum(xs) / len(xs)
    sd = (sum((x - m) ** 2 for x in xs) / len(xs)) ** 0.5
    return 0.0  # TODO: momen ketiga dibagi sd pangkat 3
def qq_r(xs):
    s = sorted(xs)
    n = len(s)
    q = [norm_ppf((i + 0.5) / n) for i in range(n)]
    return 0.0  # TODO: korelasi antara s dan q
norm20 = [48, 52, 55, 57, 59, 60, 61, 62, 63, 65, 66, 68, 69, 70, 71, 73, 75, 77, 80, 84]
exams = [55, 70, 78, 82, 85, 88, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99]
def sw_w(xs):
    # Aproksimasi Shapiro-Wilk (Blom): bobot dari kuantil normal yang diharapkan.
    s = sorted(xs)
    n = len(s)
    m = [norm_ppf((i + 1 - 0.375) / (n + 0.25)) for i in range(n)]
    norm = math.sqrt(sum(v * v for v in m))
    a = [v / norm for v in m]
    num = sum(ai * xi for ai, xi in zip(a, s)) ** 2
    den = sum((x - sum(s) / n) ** 2 for x in s)
    return num / den
sk = skew(bills)
qr = qq_r(bills)
logb = [math.log(x) for x in bills]
sk_log = skew(logb)
qr_log = qq_r(logb)
print(f"skew tagihan: {sk:.3f}")
print(f"qq-r tagihan: {qr:.4f}")
print(f"skew tagihan sesudah log: {sk_log:.3f}")
print(f"qq-r tagihan sesudah log: {qr_log:.4f}")
w_norm = 0.0  # TODO: W norm20
w_bills = 0.0  # TODO: W bills
w_exams = 0.0  # TODO: W exams
v_norm = "TODO"  # TODO: "tidak tolak normal" atau "tolak normal"
v_bills = "TODO"  # TODO: "tidak tolak normal" atau "tolak normal"
v_exams = "TODO"  # TODO: "tidak tolak normal" atau "tolak normal"
print(f"W norm20: {w_norm:.3f} (kritis 0,905) — {v_norm}")
print(f"W bills: {w_bills:.3f} (kritis 0,874) — {v_bills}")
print(f"W exams: {w_exams:.3f} (kritis 0,887) — {v_exams}")`,
        lockLines: 32,
        solution: `import math
# 14 tagihan kartu (ribu rupiah) — sama dengan contoh di langkah 4.
bills = [120, 150, 180, 200, 220, 250, 280, 300, 350, 400, 500, 800, 1500, 3000]
def norm_ppf(p):
    # Aproksimasi Acklam untuk kuantil normal standar.
    a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
         1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00]
    b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
         6.680131188771972e+01, -1.328068155288572e+01]
    c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
         -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00]
    d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00,
         3.754408661907416e+00]
    plow, phigh = 0.02425, 1 - 0.02425
    if p < plow:
        q = math.sqrt(-2 * math.log(p))
        return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    if p > phigh:
        q = math.sqrt(-2 * math.log(1 - p))
        return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    q = p - 0.5
    r = q * q
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
def corr(xs, ys):
    n = len(xs)
    mx, my = sum(xs) / n, sum(ys) / n
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den = (sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys)) ** 0.5
    return num / den
def skew(xs):
    m = sum(xs) / len(xs)
    sd = (sum((x - m) ** 2 for x in xs) / len(xs)) ** 0.5
    return (sum((x - m) ** 3 for x in xs) / len(xs)) / sd ** 3
def qq_r(xs):
    s = sorted(xs)
    n = len(s)
    q = [norm_ppf((i + 0.5) / n) for i in range(n)]
    return corr(s, q)
norm20 = [48, 52, 55, 57, 59, 60, 61, 62, 63, 65, 66, 68, 69, 70, 71, 73, 75, 77, 80, 84]
exams = [55, 70, 78, 82, 85, 88, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99]
def sw_w(xs):
    # Aproksimasi Shapiro-Wilk (Blom): bobot dari kuantil normal yang diharapkan.
    s = sorted(xs)
    n = len(s)
    m = [norm_ppf((i + 1 - 0.375) / (n + 0.25)) for i in range(n)]
    norm = math.sqrt(sum(v * v for v in m))
    a = [v / norm for v in m]
    num = sum(ai * xi for ai, xi in zip(a, s)) ** 2
    den = sum((x - sum(s) / n) ** 2 for x in s)
    return num / den
sk = skew(bills)
qr = qq_r(bills)
logb = [math.log(x) for x in bills]
sk_log = skew(logb)
qr_log = qq_r(logb)
print(f"skew tagihan: {sk:.3f}")
print(f"qq-r tagihan: {qr:.4f}")
print(f"skew tagihan sesudah log: {sk_log:.3f}")
print(f"qq-r tagihan sesudah log: {qr_log:.4f}")
w_norm = sw_w(norm20)
w_bills = sw_w(bills)
w_exams = sw_w(exams)
v_norm = "tidak tolak normal" if w_norm >= 0.905 else "tolak normal"
v_bills = "tidak tolak normal" if w_bills >= 0.874 else "tolak normal"
v_exams = "tidak tolak normal" if w_exams >= 0.887 else "tolak normal"
print(f"W norm20: {w_norm:.3f} (kritis 0,905) — {v_norm}")
print(f"W bills: {w_bills:.3f} (kritis 0,874) — {v_bills}")
print(f"W exams: {w_exams:.3f} (kritis 0,887) — {v_exams}")`,
        checks: [
          { kind: "equal", task: "skew tagihan = 2,386", value: 2.386, tol: 0.001, name: "sk", label: "`sk` seharusnya 2.386", msg: "skew tagihan = 2,386" },
          { kind: "equal", task: "qq-r tagihan = 0,7692", value: 0.7692, tol: 0.001, name: "qr", label: "`qr` seharusnya 0.7692", msg: "qq-r tagihan = 0,7692" },
          { kind: "equal", task: "skew sesudah log = 1,068", value: 1.068, tol: 0.001, name: "sk_log", label: "`sk_log` seharusnya 1.068", msg: "skew sesudah log = 1,068" },
          { kind: "equal", task: "qq-r sesudah log = 0,9493", value: 0.9493, tol: 0.001, name: "qr_log", label: "`qr_log` seharusnya 0.9493", msg: "qq-r sesudah log = 0,9493" },
          { kind: "equal", task: "W norm20 = 0,998", value: 0.998, tol: 0.002, name: "w_norm", label: "`w_norm` seharusnya 0.998", msg: "W norm20 = 0,998" },
          { kind: "equal", task: "W bills = 0,586", value: 0.586, tol: 0.002, name: "w_bills", label: "`w_bills` seharusnya 0.586", msg: "W bills = 0,586" },
          { kind: "equal", task: "W exams = 0,816", value: 0.816, tol: 0.002, name: "w_exams", label: "`w_exams` seharusnya 0.816", msg: "W exams = 0,816" },
          { kind: "stdout_matches", task: "laporan lab lengkap tercetak", pattern: "skew tagihan: 2.386\\nqq-r tagihan: 0.7692\\nskew tagihan sesudah log: 1.068\\nqq-r tagihan sesudah log: 0.9493\\nW norm20: 0.998 \\(kritis 0,905\\) — tidak tolak normal\\nW bills: 0.586 \\(kritis 0,874\\) — tolak normal\\nW exams: 0.816 \\(kritis 0,887\\) — tolak normal", label: "Output menampilkan skew tagihan: 2.386", msg: "Bandingkan tiap baris output dengan expected di atas." },
        ],
      },
      hints: [
        "Skewness: rata-rata dari (x − mean) pangkat 3, dibagi sd pangkat 3.",
        "Korelasi QQ: korelasi Pearson antara data terurut dan kuantil normal teoritis.",
        "Log natural: math.log(x) — semua tagihan positif, jadi log terdefinisi.",
        "W mendekati 1 berarti mendekati normal — bandingkan dengan nilai kritis untuk n dan alpha 0,05: norm20 0,905, bills 0,874, exams 0,887.",
      ],
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan distribusi & outlier",
      prose: [
        "Empat diagnosis, empat fix — urutannya: bentuk dulu, baru outlier:",
        "• Simetris (|skew| di bawah 0,5, QQ r di atas 0,99): pakai mean dan sd; uji klasik sah.",
        "• Right-skew (mean di atas median, skew positif): log-transform; bila masih di atas 1, coba Box-Cox; bila tetap, pakai median dan metode robust.",
        "• Left-skew (mean di bawah median, skew negatif): reflect (maks dikurangi nilai) lalu log; jangan kuadratkan — itu nyaris tidak membantu.",
        "• Outlier (di luar pagar IQR dan |z| di atas 2): selidiki dulu — bila sah, winsorize atau pakai model robust; bila salah input, perbaiki atau hapus dengan dokumentasi; bila ragu, laporkan hasil dengan dan tanpa outlier.",
        "Dan dua aturan yang mengikat semuanya: pertama, diagnosis selalu dari gambar DAN angka — histogram tanpa skewness bisa menipu, skewness tanpa histogram juga bisa. Kedua, transformasi mengubah interpretasi — catat transformasinya di model card, karena koefisien pada skala log bukan koefisien pada skala rupiah.",
        "Koneksi ke modul berikutnya: diagnosis distribusi adalah fondasi feature diagnosis — di M1, learning curve dan evaluasi model (MLF4) hanya bisa dibaca bila distribusi fiturnya dipahami; di M2, transformasi dan winsorizing dari lesson ini dipakai saat menyiapkan fitur credit scoring (dan scorecard WoE justru bekerja pada data yang sudah di-binning, bukan pada distribusi mentahnya); di M4, volatilitas dan VaR bergantung pada bentuk distribusi return — return yang fat-tailed membuat VaR normal meremehkan risiko; di M9, simulasi Monte Carlo memilih distribusi yang bentuknya cocok dengan data, bukan yang nyaman. Peta lengkap L0 → M1–M9 ada di L0.5.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case — Distribusi PAY_0 di notebook credit scoring",
      prose: [
        "Notebook credit scoring (cell 8) memeriksa default rate per nilai PAY_0: PAY_0 sama dengan 0 (lancar) — default rate 0,128 dengan n 14.737; PAY_0 sama dengan 2 (terlambat 2 bulan) — default rate 0,691 dengan n 2.667. Distribusi PAY_0 menumpuk di −2/−1/0 (23.182 dari 30.000 = 77%) dengan ekor tipis ke kanan sampai 8 — diskrit dan miring, bukan lonceng.",
        "Kesalahan yang dihindari notebook: memperlakukan PAY_0 sebagai variabel kontinu yang normal. PAY_0 adalah kode keterlambatan (diskrit, −2 sampai 8) — mean dan sd-nya tidak bermakna seperti pada variabel kontinu, dan korelasinya dengan target (0,325, cell 9) harus dibaca sebagai 'keterlambatan yang lebih besar berhubungan dengan default yang lebih tinggi', bukan sebagai hubungan linear yang rapi.",
        "Keputusan notebook yang sejalan dengan peta lesson ini: LIMIT_BAL berkorelasi negatif dengan target (−0,154, cell 9) — limit yang lebih besar berhubungan dengan default yang lebih rendah — dan notebook tidak memaksakan transformasi apa pun sebelum memeriksa bentuknya. Fitur baru yang dibuat notebook (cell 13) justru merangkum 6 kolom PAY menjadi agregat yang lebih stabil: PAY_MEAN, PAY_MAX, dan PAY_DELAY_COUNT (jumlah bulan terlambat) — agregasi adalah salah satu jawaban atas distribusi yang miring dan diskrit.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa PAY_0 tidak boleh diperlakukan sebagai variabel kontinu yang normal — apa bentuk distribusinya?" },
        { id: "t2", text: "Jelaskan kenapa notebook membuat PAY_DELAY_COUNT dari 6 kolom PAY — apa hubungannya dengan bentuk distribusi?" },
      ],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab — Diagnosis pada 60 pengajuan sintetis",
      prose: [
        "Di Colab, kamu mendiagnosis tiga kolom dari 60 pengajuan sintetis (seed 42): income (right-skew), skor (left-skew), dan transaksi (dengan outlier yang disuntikkan). Tugasmu: hitung skewness dan korelasi QQ tiap kolom, pilih transformasi yang benar tiap kolom, deteksi outlier dengan IQR dan z-score, lalu bandingkan keputusanmu dengan peta lesson ini.",
        "Notebook ini juga menguji Shapiro-Wilk sebagai [ilustrasi] — dengan catatan besar sampelnya — dan meminta refleksi: transformasi mana yang mengubah interpretasi model, dan bagaimana kamu mendokumentasikannya?",
        "Buka di Colab: https://colab.research.google.com/drive/1d2_q5eehVGDpuw23LC7QX7SAMTvM9h6U",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint — 8 soal",
      prose: [
        "Delapan soal menutup lesson ini. Bila ada yang salah, kembali ke langkah yang dirujuk di 'why' — jawabannya ada di angka diagnosis, bukan di hafalan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "20 skor: mean 65,75, median 65,50, skewness 0,068, korelasi QQ 0,9988. Kesimpulan?",
          options: [
            { text: "Mendekati normal — ketiga alat setuju", why: "Benar: mean dan median hampir berhimpit, skewness hampir 0, dan titik QQ menempel garis (0,9988).", correct: true },
            { text: "Right-skew — mean lebih besar dari median", why: "Salah: selisih mean dan median hanya 0,25 pada data dengan sd 9,17 (0,027 sd) — terlalu kecil untuk disebut skew.", correct: false },
            { text: "Left-skew — kurtosis negatif", why: "Salah: kurtosis −0,612 berarti sedikit lebih datar, bukan miring ke kiri.", correct: false },
            { text: "Tidak bisa ditentukan tanpa Shapiro-Wilk", why: "Salah: tiga alat (histogram, QQ, skewness) sudah cukup untuk menyimpulkan mendekati normal.", correct: false },
          ],
        },
        {
          q: "14 tagihan: mean 589,3, median 290,0. Bentuk distribusinya?",
          options: [
            { text: "Normal — mean dan median keduanya besar", why: "Salah: mean dua kali lipat median — itu tanda ekor kanan, bukan normal.", correct: false },
            { text: "Right-skew — mean jauh di atas median, ekor kanan panjang", why: "Benar: skewness 2,386 (miring kuat) dan korelasi QQ 0,7692 (menyimpang).", correct: true },
            { text: "Left-skew — median lebih kecil dari mean", why: "Salah: median lebih kecil dari mean justru tanda right-skew.", correct: false },
            { text: "Bimodal — ada dua puncak", why: "Salah: histogramnya menumpuk di kiri dengan satu ekor kanan — bukan dua puncak.", correct: false },
          ],
        },
        {
          q: "Log-transform tagihan: skewness 2,386 menjadi 1,068, korelasi QQ 0,7692 menjadi 0,9493. Apakah datanya sudah normal?",
          options: [
            { text: "Ya — log selalu menormalkan", why: "Salah: skewness 1,068 masih di atas 1 (miring kuat).", correct: false },
            { text: "Membaik tapi belum normal — skewness masih di atas 1", why: "Benar: log menarik ekor ke dalam, tapi belum cukup — pertimbangkan Box-Cox atau metode robust.", correct: true },
            { text: "Tidak — log memperburuk skewness", why: "Salah: skewness turun dari 2,39 ke 1,07 — itu perbaikan, bukan perburukan.", correct: false },
            { text: "Tidak bisa dinilai dari skewness", why: "Salah: skewness dan korelasi QQ justru alat penilainya.", correct: false },
          ],
        },
        {
          q: "16 skor ujian left-skew (skewness −1,569). Fix yang benar?",
          options: [
            { text: "Log langsung pada skor", why: "Salah: log langsung pada data left-skew justru memperburuk.", correct: false },
            { text: "Kuadratkan skor", why: "Salah: mengkuadratkan hanya menurunkan skewness ke −1,271 — nyaris tidak membantu.", correct: false },
            { text: "Reflect (100 − skor) lalu log", why: "Benar: reflect membalik ekor kiri menjadi ekor kanan, log lalu menariknya masuk — skewness menjadi −0,296, korelasi QQ 0,9959.", correct: true },
            { text: "Hapus skor terendah 55", why: "Salah: menghapus ekor bukan memperbaiki bentuk — itu membuang data.", correct: false },
          ],
        },
        {
          q: "15 transaksi: pagar IQR 5,0 sampai 285,0. Outlier-nya?",
          options: [
            { text: "Tidak ada — semua di dalam pagar", why: "Salah: 5000 dan 4200 jauh di atas pagar atas 285,0.", correct: false },
            { text: "5000 dan 4200 — dan z-score setuju (2,80 dan 2,27)", why: "Benar: kedua metode menunjuk nilai yang sama.", correct: true },
            { text: "Hanya 5000 — 4200 masih wajar", why: "Salah: 4200 juga di luar pagar dan z-nya 2,27 (di atas 2).", correct: false },
            { text: "88 dan 95 — nilai terkecil", why: "Salah: pagar bawah 5,0 — 88 dan 95 masih di dalam pagar.", correct: false },
          ],
        },
        {
          q: "Shapiro-Wilk p sama dengan 0,03 pada n sama dengan 30.000. Kesimpulan yang benar?",
          options: [
            { text: "Data tidak normal — tolak dan selesai", why: "Salah: pada n sebesar itu, penyimpangan kecil pun menghasilkan p kecil. Cek besar penyimpangannya.", correct: false },
            { text: "Data normal — p 0,03 masih besar", why: "Salah: 0,03 di bawah 0,05 — secara statistik normal ditolak.", correct: false },
            { text: "Secara statistik normal ditolak, tapi cek besar penyimpangan (skewness, QQ) sebelum bertindak", why: "Benar: p-value tanpa ukuran efek tidak cukup — yang menentukan tindakan adalah seberapa besar penyimpangannya.", correct: true },
            { text: "Uji Shapiro-Wilk tidak berlaku untuk n besar", why: "Salah: uji itu berlaku — yang berubah adalah interpretasinya: p kecil pada n besar belum tentu berarti penyimpangan besar.", correct: false },
          ],
        },
        {
          q: "15 transaksi: 5.000 dan 4.200 di luar pagar IQR (285,0), keduanya terbukti transaksi korporat yang sah. Apa yang dilakukan?",
          options: [
            { text: "Winsorize ke pagar atas 285,0 — atau pakai model robust; jangan hapus", why: "Benar: nilai yang sah tidak boleh dihapus — winsorize (cap di pagar atas 285,0) membatasi pengaruhnya tanpa membuang informasi bahwa transaksi besar itu ada; model robust (median, tree-based) juga menerimanya apa adanya.", correct: true },
            { text: "Hapus keduanya — di luar pagar berarti outlier", why: "Salah: di luar pagar berarti kandidat outlier, bukan vonis — keduanya terbukti sah, dan menghapus 2 dari 15 baris (13 persen) membuang data nyata.", correct: false },
            { text: "Biarkan mentah pada model linear", why: "Salah: mean 733,47 dari 15 transaksi ini lebih dari 5 kali lipat median 145 — satu nilai mengubah seluruh gambaran pada model yang sensitif terhadap mean.", correct: false },
            { text: "Ganti keduanya dengan median 145", why: "Salah: mengganti nilai sah dengan median adalah imputasi yang tidak berdasar — winsorize (cap di pagar) mempertahankan urutannya, median tidak.", correct: false },
          ],
        },
        {
          q: "Tiga alat memberi tiga bacaan [ilustrasi]: skewness 0,7 (miring sedang), korelasi QQ 0,97 (cukup dekat), kurtosis (excess) 0,4 (wajar). Apa keputusan yang benar?",
          options: [
            { text: "Miring sedang — skewness 0,7 masuk band 0,5–1, QQ 0,97 masuk band cukup dekat, kurtosis 0,4 wajar; ketiganya setuju: bukan normal, bukan miring kuat", why: "Benar: ketiga alat dibaca bersama — skewness 0,7 masuk band 0,5–1, QQ 0,97 masuk band cukup dekat, kurtosis 0,4 wajar — dan ketiganya jatuh di band 'sedang': keputusannya transformasi ringan atau metode robust, bukan transformasi agresif.", correct: true },
            { text: "Normal — kurtosis 0,4 masih wajar", why: "Salah: kurtosis yang wajar tidak menutupi skewness 0,7 (miring sedang) dan QQ 0,97 (hanya cukup dekat, bukan menempel).", correct: false },
            { text: "Miring kuat — skewness sudah di atas 0,5", why: "Salah: 0,7 masuk band miring sedang (0,5–1), bukan miring kuat (di atas 1).", correct: false },
            { text: "Tidak bisa ditentukan — butuh Shapiro-Wilk", why: "Salah: ketiga alat sudah cukup untuk menyimpulkan miring sedang; Shapiro-Wilk hanya konfirmasi.", correct: false },
          ],
        },
      ],
      summary: [
        "Diagnosis dari gambar DAN angka: histogram, QQ plot, skewness, dan korelasi QQ harus setuju.",
        "Normal: mean dan median berhimpit, skewness hampir 0, QQ menempel garis (r di atas 0,99).",
        "Right-skew: mean di atas median — log-transform; bila masih di atas 1, coba Box-Cox atau metode robust.",
        "Left-skew: mean di bawah median — reflect lalu log; jangan kuadratkan.",
        "Outlier: pagar IQR dan z-score harus setuju; selidiki dulu sebelum menghapus.",
        "Shapiro-Wilk: cek besar penyimpangan, bukan hanya p-value — terutama pada n besar.",
        "Shapiro-Wilk adalah konfirmasi, bukan pengganti gambar — W norm20 0,998, bills 0,586, exams 0,816; dan p-value makin sensitif seiring n membesar.",
        "Outlier global belum tentu outlier per kelompok — empat nilai korporat di luar pagar global 960 ternyata bukan outlier di kelompoknya sendiri.",
      ],
      next: { label: "Lanjut ke L0.4 — Data Wrangling", href: "/v2/learn/mlf-l04-data-wrangling" },
    },
  ],
};
