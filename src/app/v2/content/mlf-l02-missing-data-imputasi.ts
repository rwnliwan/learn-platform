import type { V2Lesson } from "../lib/types";

export const mlfL02: V2Lesson = {
  slug: "mlf-l02-missing-data-imputasi",
  track: "Machine Learning Finance",
  module: "Data Foundations — prasyarat M1",
  title: "L0.2 — Missing Data & Imputasi: Mengisi yang Kosong",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "L0.1 mengakhiri file 20 pengajuan dengan 3 income kosong yang dibiarkan. Lesson ini menjawab lanjutannya: bagaimana mengisi yang kosong — dan kapan pengisian itu justru berbohong.",
        "Tujuan lesson ini:",
        "• Memilih mean atau median untuk imputasi berdasarkan bentuk distribusi, bukan kebiasaan.",
        "• Memakai mode, forward-fill, dan imputasi berbasis model pada tempatnya masing-masing.",
        "• Membedakan tiga mekanisme missing — MCAR, MAR, MNAR — dari angka yang bisa dihitung.",
        "• Mengukur kebohongan imputasi: penyusutan varians dan lonjakan di satu nilai.",
        "Isi lesson: cerita analis yang mengisi rata-rata → mean vs median → teknik imputasi → MCAR/MAR/MNAR → kapan imputasi berbohong → 2 lab → peta keputusan → mini-case notebook → guided task di Colab → checkpoint.",
        "Batas scope: MLF2 sudah memakai mean dan median sebagai alat baca hasil model (mean 0,0495 vs median 0,0200 pada contoh lab-nya). Lesson ini tidak mengulang cara membacanya — lesson ini mengajarkan mekanisme imputasinya: bagaimana mengisi, dan kapan pengisian itu berbohong.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Rata-rata yang membuat model terlalu percaya diri",
      prose: [
        "Analis itu mengisi 3 income kosong dengan rata-rata 3,48 juta. File jadi lengkap, model jalan, dan akurasinya naik sedikit. Semua terlihat beres — sampai ia memeriksa varians income-nya: menyusut 20,0 persen (3 dari 15 = 20 persen). Modelnya kini 'yakin' bahwa income nasabah jauh lebih seragam dari kenyataannya, karena 3 dari 15 nilai adalah salinan rata-rata yang sama.",
        "Itulah kebohongan imputasi yang paling umum: mengisi dengan satu nilai membuat data tampak lebih rapi dari aslinya. Kebohongan kedua: mengisi dengan rata-rata dari data yang miring — rata-ratanya sendiri sudah ditarik oleh outlier, jadi yang diisi adalah nilai yang tidak mewakili siapa pun.",
        "Lesson ini mengajarkan tiga hal berurutan: pilih pengisi yang tepat (mean atau median), pilih teknik yang tepat (mode, forward-fill, atau model), dan ketahui mekanisme missing-nya (MCAR, MAR, MNAR) — karena mekanisme itulah yang menentukan apakah pengisianmu sah atau sekadar menambal.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: mengisi rata-rata selalu aman",
        type: "pitfall",
        body: "Yang benar: mengisi dengan rata-rata aman hanya bila distribusinya simetris DAN porsi missing-nya kecil. Pada data miring, rata-rata ditarik outlier; pada missing yang besar, satu nilai yang diulang berkali-kali menyusutkan varians dan menciptakan puncak palsu. 'Aman' adalah klaim tentang distribusi dan porsi — bukan tentang metodenya.",
      },
    },
    {
      id: "meanmedian",
      eyebrow: "Langkah 3 · Mean vs median",
      title: "Mean vs median: outlier yang memilihkan untukmu",
      prose: [
        "Mean dan median menjawab pertanyaan yang berbeda. Mean adalah rata-rata aritmetik — semua nilai ikut, termasuk outlier. Median adalah nilai tengah setelah diurutkan — outlier tidak bisa menariknya. Bila keduanya jauh, distribusinya miring, dan pilihanmu sudah ditentukan oleh bentuk data.",
        "Nilai: dua daftar income (juta per bulan) [lab]. Daftar A simetris, 8 nilai [2,0, 2,2, 2,4, 2,6, 2,8, 3,0, 3,2, 3,4]: mean sama dengan median sama dengan 2,7000 — pilih mana pun hasilnya sama. Daftar B miring dengan satu outlier 12,0, 12 nilai [1,7, 1,9, 2,0, 2,2, 2,4, 2,6, 2,8, 3,1, 3,3, 3,6, 4,2, 12,0]: mean 3,4833, median 2,7000. Tanpa outlier 12,0, mean daftar B menjadi 2,7091 — selisih 0,7742 dari mean yang mengandung outlier. Median bergerak sedikit: dari 2,7000 menjadi 2,6000 (selisih 0,1000) — n menjadi ganjil (11), jadi median = nilai ke-6 = 2,6. Robust bukan berarti diam sama sekali: median bergerak 0,1, mean bergerak 0,7742.",
        "Gambar di bawah menunjukkan apa yang terjadi bila 3 nilai kosong di daftar B diisi dengan mean 3,4833: bin 3 sampai 4 melonjak dari 3 menjadi 6 — puncak palsu di satu nilai. Itulah jejak visual imputasi mean: distribusi yang tadinya tersebar kini menumpuk di satu titik.",
        "Baik atau buruk: mean baik bila distribusi simetris (daftar A) — ia memakai semua informasi. Mean buruk bila ada outlier (daftar B) — ia mewakili nilai yang tidak dimiliki siapa pun, karena 3,4833 lebih besar dari 9 dari 12 nilai yang ada. Median baik bila distribusi miring — ia kebal terhadap outlier. Median buruk bila distribusinya bimodal atau diskrit kasar — nilai tengah bisa jatuh di celah antar kelompok.",
        "Mitigasi: sebelum memilih, hitung keduanya dan bandingkan. Bila selisihnya kecil (daftar A: 0), pilih mean. Bila selisihnya besar (daftar B: 0,7833), pilih median — atau transformasi dulu (log) baru isi dengan mean dari data yang sudah ditransformasi. Dan laporkan selalu nilai pengisinya: 'diisi dengan median 2,7' adalah jejak audit, bukan detail sepele.",
      ],
      formula: String.raw`\text{median} = \begin{cases} x_{\left(\frac{n+1}{2}\right)} & n \text{ ganjil} \\ \frac{x_{\left(\frac{n}{2}\right)} + x_{\left(\frac{n}{2}+1\right)}}{2} & n \text{ genap} \end{cases}`,
      formulaNote: "Median: nilai tengah setelah data diurutkan naik. Untuk n ganjil, ambil nilai di posisi (n+1)/2; untuk n genap, rata-ratakan dua nilai tengah di posisi n/2 dan n/2+1. Daftar B punya n=12 (genap): (2,6 + 2,8) dibagi 2 sama dengan 2,7.",
      figure: {
        svg: `<svg viewBox="0 0 480 360" role="img" aria-label="Histogram daftar B sebelum dan sesudah imputasi mean: sebelum 2, 5, 3, 1, 0, 1; sesudah 2, 5, 6, 1, 0, 1; bin 3 sampai 4 melonjak dari 3 menjadi 6">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Daftar B: sebelum imputasi (n=12)</text>
<line x1="52" y1="36" x2="52" y2="176" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="176" x2="466" y2="176" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="179.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="44" y="119.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3</text>
<text x="44" y="99.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<text x="44" y="59.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6</text>
<rect x="67.5" y="136.0" width="38.0" height="40.0" fill="var(--c1)"/>
<text x="86.5" y="130.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2</text>
<rect x="136.5" y="76.0" width="38.0" height="100.0" fill="var(--c1)"/>
<text x="155.5" y="70.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">5</text>
<rect x="205.5" y="116.0" width="38.0" height="60.0" fill="var(--c1)"/>
<text x="224.5" y="110.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">3</text>
<rect x="274.5" y="156.0" width="38.0" height="20.0" fill="var(--c1)"/>
<text x="293.5" y="150.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1</text>
<rect x="343.5" y="176.0" width="38.0" height="0.0" fill="var(--c1)"/>
<rect x="412.5" y="156.0" width="38.0" height="20.0" fill="var(--c1)"/>
<text x="431.5" y="150.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1</text>
<text x="86.5" y="192" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1–2</text>
<text x="155.5" y="192" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2–3</text>
<text x="224.5" y="192" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3–4</text>
<text x="293.5" y="192" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4–5</text>
<text x="362.5" y="192" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">5–12</text>
<text x="431.5" y="192" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">12–13</text>
<text x="240.0" y="212" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Sesudah isi mean ×3 (n=15)</text>
<line x1="52" y1="216" x2="52" y2="356" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="356" x2="466" y2="356" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="67.5" y="316.0" width="38.0" height="40.0" fill="var(--c1)"/>
<text x="86.5" y="310.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">2</text>
<rect x="136.5" y="256.0" width="38.0" height="100.0" fill="var(--c1)"/>
<text x="155.5" y="250.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">5</text>
<rect x="205.5" y="236.0" width="38.0" height="120.0" fill="var(--c4)"/>
<text x="224.5" y="230.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">6</text>
<rect x="274.5" y="336.0" width="38.0" height="20.0" fill="var(--c1)"/>
<text x="293.5" y="330.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1</text>
<rect x="343.5" y="356.0" width="38.0" height="0.0" fill="var(--c1)"/>
<rect x="412.5" y="336.0" width="38.0" height="20.0" fill="var(--c1)"/>
<text x="431.5" y="330.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1</text>
</svg>`,
        alt: "Histogram daftar B sebelum dan sesudah imputasi mean: sebelum 2, 5, 3, 1, 0, 1; sesudah 2, 5, 6, 1, 0, 1; bin 3 sampai 4 melonjak dari 3 menjadi 6.",
        caption: "Cara membaca: tinggi bar = jumlah nilai di tiap bin income (juta); panel bawah menambahkan 3 nilai pengisi (mean 3,4833) yang semuanya jatuh di bin 3–4. Interpretasi: imputasi mean menciptakan puncak palsu — distribusi tampak lebih menumpuk dari aslinya.",
      },
      tasks: [],
    },
    {
      id: "teknik",
      eyebrow: "Langkah 4 · Teknik imputasi",
      title: "Mode, forward-fill, dan imputasi berbasis model",
      prose: [
        "Tidak semua kolom itu angka. Tiap jenis kolom punya pengisi yang wajar — dan tiap pengisi punya syaratnya sendiri.",
        "Nilai: mode EDUCATION pada 10 pelamar [2, 2, 3, 2, 1, 2, 4, 2, 3, 2] adalah 2 (university), muncul 6 dari 10 kali [ilustrasi]. Mode adalah pengisi yang wajar untuk kategori: nilai yang paling sering muncul. Forward-fill pada riwayat keterlambatan [0, 0, 1, kosong, 2, 2, kosong] menjadi [0, 0, 1, 1, 2, 2, 2] [ilustrasi]: nilai kosong diisi nilai sebelumnya, karena status bulan berjalan biasanya sama dengan bulan lalu — syaratnya urutan waktu bermakna dan nilainya bertahan (sticky). Imputasi berbasis model: prediksi income dari limit kartu dan riwayat bayar, lalu isi dengan prediksinya — teknik penuhnya di M2 dan M6, di sini cukup tahu prinsipnya: pengisi yang memakai informasi kolom lain.",
        "Baik atau buruk: mode baik bila satu kategori jelas dominan; buruk bila kategorinya seimbang — mengisi dengan mode dari dua kategori yang sama kuat adalah undian. Forward-fill baik untuk status yang bertahan (keterlambatan, status keanggotaan); buruk untuk nilai yang berubah cepat (harga saham, saldo harian) — mengisi harga kemarin untuk hari ini adalah kebohongan. Imputasi model baik bila prediktornya kuat; buruk bila modelnya lemah — pengisi dari model yang buruk hanya menambah noise yang tampak rapi.",
        "Mitigasi: untuk kategori, laporkan porsi modenya ('mode 2, 60 persen') supaya pembaca tahu seberapa dominan pengisinya. Untuk forward-fill, batasi jaraknya — jangan isi 12 bulan kosong dari satu nilai. Untuk imputasi model, validasi model pengisinya seperti model apa pun: bila ia tidak bisa memprediksi nilai yang ada, ia tidak boleh mengisi nilai yang hilang.",
        "Dan satu aturan yang mengikat semua teknik di atas: fit pada train, apply ke test. Urutannya — raw data → split train/validation/test → fit cleaning, imputasi, dan transformasi hanya pada train → terapkan hasilnya ke validation dan test. Median income yang dihitung dari seluruh data adalah leakage: ia memakai informasi test (termasuk outlier 12,0) untuk menentukan pengisi train. Contoh [lab]: daftar B dibagi train 8 angka pertama [1,7, 1,9, 2,0, 2,2, 2,4, 2,6, 2,8, 3,1] dan test 4 angka terakhir [3,3, 3,6, 4,2, 12,0] — pembagian ini sengaja memakai urutan nilai supaya outlier 12,0 jatuh di test dan bocorannya terlihat — median train 2,3000, median seluruh data 2,7000; selisih 0,4000 adalah bocoran outlier test ke dalam pengisi. Di M1 (MLF3), aturan yang sama berlaku untuk scaling dan encoding: fit pada train, apply ke test — bila tidak, evaluasi modelmu mengukur kebocoran, bukan kemampuan.",
        "Satu jebakan transformasi: bila kolomnya di-log-transform dulu (L0.3 — bills skew 2,386), imputasi mean di skala log lalu dipakai langsung sebagai rupiah adalah salah — mean di skala log adalah log dari geometric mean, dan memakainya langsung meremehkan nilai aslinya. Aturannya: imputasi di skala transformasi wajib ditransform balik (exponentiate) sebelum dipakai sebagai nilai asli; atau isi dengan median di skala asli yang tidak butuh transformasi.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="Pipeline anti-leakage: raw data, split train 8 dan test 4, fit median pada train (2,3000), apply ke test">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Pipeline anti-leakage: fit pada train, apply ke test</text>
<rect x="140" y="34" width="200" height="28" fill="var(--c1)"/>
<text x="240.0" y="52" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">raw data — daftar B (12 nilai)</text>
<line x1="240" y1="62" x2="240" y2="76" stroke="var(--chart-text)" stroke-width="1"/>
<polygon points="236,76 244,76 240,84" fill="var(--chart-text)"/>
<rect x="140" y="84" width="200" height="28" fill="var(--c1)"/>
<text x="240.0" y="102" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">split — train 8 | test 4</text>
<line x1="240" y1="112" x2="240" y2="126" stroke="var(--chart-text)" stroke-width="1"/>
<polygon points="236,126 244,126 240,134" fill="var(--chart-text)"/>
<rect x="140" y="134" width="200" height="28" fill="var(--c4)"/>
<text x="240.0" y="152" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">fit median pada train → 2,3000</text>
<line x1="240" y1="162" x2="240" y2="176" stroke="var(--chart-text)" stroke-width="1"/>
<polygon points="236,176 244,176 240,184" fill="var(--chart-text)"/>
<rect x="140" y="184" width="200" height="28" fill="var(--c1)"/>
<text x="240.0" y="202" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">apply ke test — isi dengan 2,3000</text>
<text x="240.0" y="228" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">✕ SALAH: median seluruh data 2,7000 — outlier 12,0 di test</text>
<text x="240.0" y="242" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">ikut menentukan pengisi (selisih 0,4000 dari median train 2,3000)</text>
</svg>`,
        alt: "Pipeline anti-leakage: raw data, split train 8 dan test 4, fit median pada train (2,3000), apply ke test.",
        caption: "Cara membaca: panah = urutan kerja; kotak merah = langkah yang hanya boleh memakai train. Interpretasi: median seluruh data 2,7000 terinflasi outlier 12,0 di test — selisih 0,4000 dari median train 2,3000 adalah bocoran itu sendiri.",
      },
      tasks: [],
      note: {
        title: "Tip: catat nilai pengisinya",
        body: "Tiap imputasi meninggalkan jejak: kolom apa, metode apa, nilai berapa, berapa baris yang diisi. 'Income diisi median 2,7 untuk 3 baris' adalah satu baris di model card — dan satu baris itu yang membedakan analisis yang bisa diaudit dari yang tidak.",
      },
    },
    {
      id: "mekanisme",
      eyebrow: "Langkah 5 · MCAR / MAR / MNAR",
      title: "Kenapa kosong? Tiga mekanisme missing",
      prose: [
        "Mekanisme missing adalah jawaban atas 'kenapa kosong?' — dan ia menentukan apakah pengisianmu sah. Ada tiga: MCAR (Missing Completely At Random), MAR (Missing At Random), dan MNAR (Missing Not At Random).",
        "Nilai: demonstrasi MAR [ilustrasi] pada 20 pelamar — income kosong 6 dari 20, yaitu 30 persen. Dipecah menurut keterlambatan: pelamar dengan late 2 atau lebih (8 orang) — income kosong 5 dari 8, yaitu 62,5 persen. Pelamar dengan late di bawah 2 (12 orang) — income kosong 1 dari 12, yaitu 8,3 persen. Missing-nya bergantung pada keterlambatan — kolom lain yang teramati — jadi datanya konsisten dengan MAR, bukan MCAR — perbedaan antar kelompok yang teramati adalah bukti pendukung, bukan bukti pasti. Bila kedua kelompok sama-sama 30 persen, datanya konsisten dengan MCAR: kosongnya tidak bergantung pada apa pun yang teramati.",
        "Baik atau buruk: MCAR — menghapus baris tidak bias untuk mean; namun imputasi satu nilai tetap menyusutkan varians (§4). Yang hilang tanpa bias hanyalah estimasi mean marginal. MAR buruk bila diisi rata-rata global — rata-rata itu mencampur dua kelompok yang berbeda (62,5 persen vs 8,3 persen), dan pengisiannya harus bersyarat pada keterlambatan: isi dengan rata-rata kelompoknya, atau dengan model yang memakai keterlambatan. MNAR buruk dan tidak bisa dideteksi dari data yang teramati: missing bergantung pada nilai yang hilang itu sendiri — misal nasabah ber-income rendah yang tidak melaporkan income. Tidak ada uji dari data yang ada yang bisa membuktikan MNAR; yang bisa dilakukan adalah uji sensitivitas — bagaimana kesimpulan berubah bila asumsi tentang yang hilang diubah.",
        "Mitigasi: selalu pecah missing rate menurut kolom lain yang teramati (seperti contoh keterlambatan di atas). Bila ada kolom yang membedakan missing rate secara tajam, datanya konsisten dengan MAR — dan pengisianmu harus memakai kolom itu. Bila tidak ada yang membedakan, MCAR masih mungkin, tapi MNAR tidak pernah bisa disingkirkan sepenuhnya: catat asumsi itu di model card.",
        "Perbedaan missing rate antar kelompok adalah bukti pendukung MAR, bukan bukti pasti — dan tidak ada tes dari data teramati yang bisa menyingkirkan MNAR. Alasannya: MAR berkata missing bergantung pada kolom yang teramati (keterlambatan) — itu bisa dicek. MNAR berkata missing bergantung pada nilai yang hilang itu sendiri (income rendah yang tidak dilaporkan) — nilai itu tidak ada di data, jadi tidak ada uji yang bisa membuktikannya atau menyingkirkannya. Yang memutuskan adalah domain knowledge (apakah proses bisnisnya membuat nasabah ber-income rendah enggan melapor?), proses bisnis (apakah formulirnya memang menanyakan income hanya bila terlambat?), dan sensitivity analysis — bagaimana kesimpulan berubah bila asumsi tentang yang hilang diubah (M6). Karena itu kesimpulan Lab 2 ditulis 'konsisten dengan MAR', bukan 'MAR': datanya mendukung MAR, tapi tidak membuktikannya.",
      ],
      formula: String.raw`\text{MCAR: } P(\text{kosong}) = \text{tetap} \qquad \text{MAR: } P(\text{kosong} \mid X_{\text{teramati}}) \qquad \text{MNAR: } P(\text{kosong} \mid X_{\text{hilang}})`,
      formulaNote: "MCAR: peluang kosong sama untuk semua baris. MAR: peluang kosong bergantung pada kolom lain yang teramati (misal keterlambatan). MNAR: peluang kosong bergantung pada nilai yang hilang itu sendiri — tidak bisa dicek dari data yang ada.",
      tasks: [],
    },
    {
      id: "berbohong",
      eyebrow: "Langkah 6 · Kapan imputasi berbohong",
      title: "Kapan imputasi berbohong: varians menyusut, puncak palsu",
      prose: [
        "Imputasi dengan satu nilai selalu menyusutkan varians — itu bukan kecelakaan, itu aritmetik. Nilai yang diulang tidak menambah keragaman; ia menambah kepadatan di satu titik. Pertanyaannya adalah seberapa besar penyusutannya, dan apakah kesimpulanmu masih tahan setelah itu.",
        "Nilai: daftar B [lab] — varians populasi sebelum imputasi 7,0997 (sd 2,6645). Isi 3 nilai kosong dengan mean 3,4833: varians menjadi 5,6798 — menyusut 1,4199, yaitu 20,0 persen. Isi dengan median 2,7000: varians 5,7780 — menyusut juga, sedikit lebih kecil. Perhatikan: median lebih jujur sebagai pusat, tapi tetap menyusutkan varians — masalahnya bukan mean vs median, melainkan mengisi dengan SATU nilai yang diulang.",
        "Gambar di bawah membandingkan ketiganya: batang pertama varians sebelum imputasi, dua batang berikutnya sesudah imputasi mean dan median. Keduanya lebih pendek — dan keduanya lebih pendek dengan cara yang sama. Panel bawah gambar yang sama menunjukkan kenapa: satu nilai yang diulang tidak punya sebaran, sedangkan beberapa dataset mencerminkan ketidakpastian pengisian.",
        "Baik atau buruk: penyusutan varians punya tiga band — di bawah 5 persen abaikan (efeknya kecil, kesimpulan jarang berubah); 5 sampai 10 persen laporkan; di atas 10 persen laporkan dan pertimbangkan indikator missing atau multiple imputation. Penyusutan 20 persen buruk bila tidak dilaporkan — interval kepercayaan yang dihitung dari data yang sudah diimputasi tampak lebih sempit dari yang seharusnya, dan model tampak lebih yakin dari yang berhak ia yakini. Penyusutan buruk bila porsi missing besar: 3 dari 15 (20 persen missing) sudah cukup untuk menyusutkan varians seperlima.",
        "Mitigasi: tiga cara. Pertama, tambah indikator missing — kolom baru yang menandai baris mana yang diimputasi — supaya model bisa belajar bahwa baris itu berbeda. Kedua, uji sensitivitas: jalankan analisis dengan mean, dengan median, dan tanpa imputasi (hapus baris); bila kesimpulan berubah, laporkan bahwa kesimpulanmu sensitif terhadap imputasi. Ketiga, multiple imputation — isi beberapa kali dengan nilai yang berbeda-beda (dengan noise), lalu gabungkan hasilnya; teknik penuhnya di M6.",
        "Satu gambar yang menjelaskan kenapa single imputation menipiskan varians dan kenapa multiple imputation adalah jawabannya: panel bawah gambar di atas memakai delapan nilai pertama daftar B sebagai nilai teramati [lab] — mean 2,3375, varians populasi 0,1998. Single imputation mengisi 4 nilai kosong dengan satu nilai tetap (mean 2,3375) — varians menyusut menjadi 0,1332, yaitu 33,3 persen, karena nilai isi tidak punya sebaran. Multiple imputation mengisi dengan nilai yang berbeda di tiap dataset — varians antar-dataset mencerminkan ketidakpastian pengisian itu sendiri. Single imputation memperlakukan nilai isi seolah pasti — standard error dan interval kepercayaan menjadi terlalu sempit. Multiple imputation tidak memberi satu jawaban, melainkan sebaran jawaban — dan sebaran itulah yang benar. Algoritme lengkapnya bukan materi lesson ini: kapan MI diperlukan dan bagaimana hasilnya digabung dibahas di M6 (model selection & validation); di sini cukup pahami intuisinya: satu titik = kepastian palsu; beberapa dataset = ketidakpastian yang jujur.",
        "Band 5 persen dan 10 persen di atas juga heuristik, bukan hukum — sama seperti band missing di L0.1. Penyusutan varians 4,9 persen vs 5,2 persen [ilustrasi] pada file yang sama tidak boleh menghasilkan keputusan berbeda (abaikan vs laporkan) — keduanya dekat batas, keduanya didokumentasikan. Yang menentukan adalah dampaknya: penyusutan 9 persen pada kolom yang dipakai sebagai fitur utama model lebih berbahaya daripada penyusutan 11 persen pada kolom yang hanya dipakai sebagai kontrol deskriptif. Persentase menentukan band; dampak menentukan keputusan.",
      ],
      formula: String.raw`\text{penyusutan varians} = \frac{\text{var sebelum} - \text{var sesudah}}{\text{var sebelum}}`,
      formulaNote: "Penyusutan varians: porsi keragaman yang hilang karena imputasi. Daftar B: (7,0997 − 5,6798) dibagi 7,0997 sama dengan 20,0 persen.",
      figure: {
        svg: `<svg viewBox="0 0 480 480" role="img" aria-label="Tiga batang varians: sebelum 7,10, isi mean 5,68, isi median 5,78. Panel bawah: ketidakpastian imputasi — satu nilai vs beberapa dataset">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Varians daftar B: sebelum vs sesudah imputasi</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="44" y="169.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<text x="44" y="129.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4</text>
<text x="44" y="89.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6</text>
<text x="44" y="49.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">8</text>
<rect x="83.1" y="64.0" width="75.9" height="142.0" fill="var(--c1)"/>
<text x="121.0" y="58.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">7,10</text>
<text x="121.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Sebelum</text>
<rect x="221.1" y="92.4" width="75.9" height="113.6" fill="var(--c4)"/>
<text x="259.0" y="86.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">5,68</text>
<text x="259.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Isi mean</text>
<rect x="359.1" y="90.4" width="75.9" height="115.6" fill="var(--c4)"/>
<text x="397.0" y="84.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">5,78</text>
<text x="397.0" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Isi median</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">varians populasi (skala 20px per unit)</text>
<line x1="20" y1="252" x2="460" y2="252" stroke="var(--chart-text)" stroke-width="1"/>
<text x="240.0" y="272" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Ketidakpastian imputasi: satu nilai vs beberapa dataset</text>
<text x="80" y="296" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">teramati (8 nilai)</text>
<text x="240" y="296" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">single imputation (1 nilai)</text>
<text x="400" y="296" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">multiple imputation (beberapa dataset)</text>
<line x1="20" y1="400" x2="140" y2="400" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="180" y1="400" x2="300" y2="400" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="340" y1="400" x2="460" y2="400" stroke="var(--chart-text)" stroke-width="1"/>
<circle cx="28" cy="360" r="4" fill="var(--c1)"/>
<circle cx="36" cy="360" r="4" fill="var(--c1)"/>
<circle cx="40" cy="360" r="4" fill="var(--c1)"/>
<circle cx="48" cy="360" r="4" fill="var(--c1)"/>
<circle cx="56" cy="360" r="4" fill="var(--c1)"/>
<circle cx="64" cy="360" r="4" fill="var(--c1)"/>
<circle cx="72" cy="360" r="4" fill="var(--c1)"/>
<circle cx="84" cy="360" r="4" fill="var(--c1)"/>
<circle cx="188" cy="330" r="4" fill="var(--c1)"/>
<circle cx="196" cy="330" r="4" fill="var(--c1)"/>
<circle cx="200" cy="330" r="4" fill="var(--c1)"/>
<circle cx="208" cy="330" r="4" fill="var(--c1)"/>
<circle cx="216" cy="330" r="4" fill="var(--c1)"/>
<circle cx="224" cy="330" r="4" fill="var(--c1)"/>
<circle cx="232" cy="330" r="4" fill="var(--c1)"/>
<circle cx="244" cy="330" r="4" fill="var(--c1)"/>
<circle cx="213.5" cy="345" r="4" fill="var(--c4)"/>
<circle cx="213.5" cy="360" r="4" fill="var(--c4)"/>
<circle cx="213.5" cy="375" r="4" fill="var(--c4)"/>
<circle cx="213.5" cy="390" r="4" fill="var(--c4)"/>
<circle cx="348" cy="330" r="4" fill="var(--c1)"/>
<circle cx="356" cy="330" r="4" fill="var(--c1)"/>
<circle cx="360" cy="330" r="4" fill="var(--c1)"/>
<circle cx="368" cy="330" r="4" fill="var(--c1)"/>
<circle cx="376" cy="330" r="4" fill="var(--c1)"/>
<circle cx="384" cy="330" r="4" fill="var(--c1)"/>
<circle cx="392" cy="330" r="4" fill="var(--c1)"/>
<circle cx="404" cy="330" r="4" fill="var(--c1)"/>
<circle cx="364" cy="360" r="4" fill="var(--c4)"/>
<circle cx="396" cy="360" r="4" fill="var(--c4)"/>
<circle cx="416" cy="360" r="4" fill="var(--c4)"/>
<circle cx="356" cy="360" r="4" fill="var(--c4)"/>
<circle cx="380" cy="390" r="4" fill="var(--c4)"/>
<circle cx="400" cy="390" r="4" fill="var(--c4)"/>
<circle cx="372" cy="390" r="4" fill="var(--c4)"/>
<circle cx="408" cy="390" r="4" fill="var(--c4)"/>
<text x="335" y="364" text-anchor="end" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">isi #1</text>
<text x="335" y="394" text-anchor="end" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">isi #2</text>
<text x="80" y="420" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">8 nilai teramati</text>
<text x="80" y="436" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">mean 2,3375 · var 0,1998</text>
<text x="240" y="420" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4 nilai isi = 2,3375 (mean)</text>
<text x="240" y="436" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">var 0,1998 → 0,1332 (−33,3%)</text>
<text x="400" y="420" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">nilai isi berbeda tiap dataset</text>
<text x="400" y="436" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">sebaran antar-dataset = ketidakpastian</text>
<text x="240.0" y="464" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Satu titik = kepastian palsu. Beberapa dataset = ketidakpastian yang jujur.</text>
</svg>`,
        alt: "Tiga batang varians: sebelum 7,10, isi mean 5,68, isi median 5,78. Panel bawah: ketidakpastian imputasi — satu nilai vs beberapa dataset.",
        caption: "Cara membaca: tinggi bar = varians populasi daftar B; skala 20px per unit. Interpretasi: kedua metode imputasi menyusutkan varians — mean 20,0 persen, median sedikit lebih kecil. Panel bawah memakai delapan nilai pertama daftar B [lab]: single imputation mengisi 4 nilai kosong dengan mean 2,3375 — varians 0,1998 menjadi 0,1332 (−33,3 persen); multiple imputation mengisi dengan nilai berbeda tiap dataset — sebarannya adalah ketidakpastian pengisian itu sendiri.",
      },
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab 1 — Mean vs median dan varians yang menyusut",
      prose: [
        "Kerjakan perbandingan mean vs median pada dua daftar income, lalu ukur kebohongan imputasi mean: berapa persen varians yang hilang. Daftar A simetris (8 nilai), daftar B miring dengan satu outlier 12,0 (12 nilai) — datanya sama dengan yang dipakai di langkah 3.",
        "Empat tugas: hitung mean dan median kedua daftar; hitung mean daftar B tanpa outlier; isi 3 nilai kosong dengan mean daftar B, lalu hitung varians sebelum dan sesudahnya serta persen penyusutannya; dan hitung median income hanya dari train (8 angka pertama daftar B), terapkan ke test (4 angka terakhir), lalu bandingkan dengan median seluruh data. Fungsi median sudah disediakan (perhatikan: untuk n genap ia merata-ratakan dua nilai tengah).",
      ],
      tasks: [
        { id: "t1", text: "Hitung mean dan median daftar A dan daftar B — bandingkan keduanya." },
        { id: "t2", text: "Hitung mean daftar B tanpa outlier 12,0 — berapa selisihnya dari mean yang mengandung outlier?" },
        { id: "t3", text: "Isi 3 nilai kosong dengan mean daftar B, hitung varians populasi sebelum dan sesudahnya, lalu persen penyusutannya." },
        { id: "t4", text: "Hitung median hanya dari train (8 angka pertama daftar B), lalu bandingkan dengan median seluruh data — selisihnya menunjukkan bocoran outlier test ke dalam pengisi." },
      ],
      expected: "mean A: 2.7000\nmedian A: 2.7000\nmean B: 3.4833\nmedian B: 2.7000\nmean B tanpa outlier: 2.7091\nvar sebelum: 7.0997\nvar sesudah isi mean: 5.6798\nvar menyusut: 20.0%\nmedian train: 2.3000\nmedian seluruh data: 2.7000",
      code: {
        starter: `# Income (juta/bulan). A simetris, B miring dengan outlier 12,0.
A = [2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4]
B = [1.7, 1.9, 2.0, 2.2, 2.4, 2.6, 2.8, 3.1, 3.3, 3.6, 4.2, 12.0]
def median(xs):
    s = sorted(xs)
    n = len(s)
    if n % 2 == 1:
        return s[n // 2]
    return (s[n // 2 - 1] + s[n // 2]) / 2
def pvar(xs):
    m = sum(xs) / len(xs)
    return sum((x - m) ** 2 for x in xs) / len(xs)
mean_a = 0.0  # TODO: mean daftar A
mean_b = 0.0  # TODO: mean daftar B
mean_b_no = 0.0  # TODO: mean daftar B tanpa outlier 12,0
var_before = 0.0  # TODO: varians populasi daftar B
filled = B + [mean_b] * 3  # 3 nilai kosong diisi mean
var_after = 0.0  # TODO: varians populasi daftar B sesudah diisi
shrink = 0.0  # TODO: persen penyusutan varians
train = B[:8]  # 8 angka pertama = train
med_train = 0.0  # TODO: median train
med_all = 0.0  # TODO: median seluruh data
print(f"mean A: {mean_a:.4f}")
print(f"median A: {median(A):.4f}")
print(f"mean B: {mean_b:.4f}")
print(f"median B: {median(B):.4f}")
print(f"mean B tanpa outlier: {mean_b_no:.4f}")
print(f"var sebelum: {var_before:.4f}")
print(f"var sesudah isi mean: {var_after:.4f}")
print(f"var menyusut: {shrink:.1f}%")
print(f"median train: {med_train:.4f}")
print(f"median seluruh data: {med_all:.4f}")`,
        lockLines: 12,
        solution: `# Income (juta/bulan). A simetris, B miring dengan outlier 12,0.
A = [2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4]
B = [1.7, 1.9, 2.0, 2.2, 2.4, 2.6, 2.8, 3.1, 3.3, 3.6, 4.2, 12.0]
def median(xs):
    s = sorted(xs)
    n = len(s)
    if n % 2 == 1:
        return s[n // 2]
    return (s[n // 2 - 1] + s[n // 2]) / 2
def pvar(xs):
    m = sum(xs) / len(xs)
    return sum((x - m) ** 2 for x in xs) / len(xs)
mean_a = sum(A) / len(A)
mean_b = sum(B) / len(B)
mean_b_no = sum(x for x in B if x != 12.0) / 11
var_before = pvar(B)
filled = B + [mean_b] * 3  # 3 nilai kosong diisi mean
var_after = pvar(filled)
shrink = (var_before - var_after) / var_before * 100
train = B[:8]
med_train = median(train)
med_all = median(B)
print(f"mean A: {mean_a:.4f}")
print(f"median A: {median(A):.4f}")
print(f"mean B: {mean_b:.4f}")
print(f"median B: {median(B):.4f}")
print(f"mean B tanpa outlier: {mean_b_no:.4f}")
print(f"var sebelum: {var_before:.4f}")
print(f"var sesudah isi mean: {var_after:.4f}")
print(f"var menyusut: {shrink:.1f}%")
print(f"median train: {med_train:.4f}")
print(f"median seluruh data: {med_all:.4f}")`,
        checks: [
          { kind: "equal", task: "mean B = 3,4833", value: 3.4833, tol: 0.001, name: "mean_b", label: "`mean_b` seharusnya 3.4833", msg: "mean B = 3,4833" },
          { kind: "equal", task: "mean B tanpa outlier = 2,7091", value: 2.7091, tol: 0.001, name: "mean_b_no", label: "`mean_b_no` seharusnya 2.7091", msg: "mean B tanpa outlier = 2,7091" },
          { kind: "equal", task: "varians sebelum = 7,0997", value: 7.0997, tol: 0.001, name: "var_before", label: "`var_before` seharusnya 7.0997", msg: "varians sebelum = 7,0997" },
          { kind: "equal", task: "varians sesudah isi mean = 5,6798", value: 5.6798, tol: 0.001, name: "var_after", label: "`var_after` seharusnya 5.6798", msg: "varians sesudah isi mean = 5,6798" },
          { kind: "equal", task: "varians menyusut = 20,0 persen", value: 20.0, tol: 0.1, name: "shrink", label: "`shrink` seharusnya 20.0", msg: "varians menyusut = 20,0 persen" },
          { kind: "equal", task: "median train = 2,3000", value: 2.3, tol: 0.001, name: "med_train", label: "`med_train` seharusnya 2.3", msg: "median train = 2,3000" },
          { kind: "equal", task: "median seluruh data = 2,7000", value: 2.7, tol: 0.001, name: "med_all", label: "`med_all` seharusnya 2.7", msg: "median seluruh data = 2,7000" },
          { kind: "stdout_matches", task: "laporan lab lengkap tercetak", pattern: "mean A: 2.7000\\nmedian A: 2.7000\\nmean B: 3.4833\\nmedian B: 2.7000\\nmean B tanpa outlier: 2.7091\\nvar sebelum: 7.0997\\nvar sesudah isi mean: 5.6798\\nvar menyusut: 20.0%\\nmedian train: 2.3000\\nmedian seluruh data: 2.7000", label: "Output menampilkan mean A: 2.7000", msg: "Bandingkan tiap baris output dengan expected di atas." },
        ],
      },
      hints: [
        "Varians populasi membagi dengan n, bukan n-1 — fungsi pvar sudah disediakan.",
        "Mean tanpa outlier: jumlahkan semua nilai kecuali 12,0, lalu bagi 11.",
        "Persen penyusutan: (var sebelum − var sesudah) dibagi var sebelum, kali 100.",
        "Median train: urutkan 8 angka pertama daftar B — dua nilai tengahnya 2,2 dan 2,4, rata-ratanya 2,3. Median seluruh data 2,7 terinflasi outlier 12,0 di test.",
      ],
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab 2 — Deteksi MAR dari dua kelompok",
      prose: [
        "Kerjakan deteksi mekanisme missing pada 20 pelamar: income kosong 6 dari 20 (30 persen). Pecah missing rate menurut keterlambatan — pelamar dengan late 2 atau lebih vs di bawah 2 — lalu simpulkan mekanismenya.",
        "Dua tugas: hitung jumlah dan persen missing di tiap kelompok; simpulkan apakah datanya konsisten dengan MAR atau MCAR dari perbandingannya. Aturan simpulan: bila kedua kelompok missing-nya jauh berbeda, datanya konsisten dengan MAR (bergantung pada kolom yang teramati); bila hampir sama, MCAR masih mungkin.",
      ],
      tasks: [
        { id: "t1", text: "Hitung missing income di kelompok late 2 atau lebih (8 orang) dan kelompok late di bawah 2 (12 orang) — jumlah dan persennya." },
        { id: "t2", text: "Simpulkan mekanismenya: 'konsisten dengan MAR' bila kedua kelompok jauh berbeda, MCAR bila hampir sama — perbedaan antar kelompok adalah bukti pendukung, bukan bukti pasti." },
      ],
      expected: "missing keseluruhan: 6 (30%)\nmissing late>=2: 5 dari 8 (62.5%)\nmissing late<2: 1 dari 12 (8.3%)\nkesimpulan: konsisten dengan MAR (missing bergantung pada late yang teramati)",
      code: {
        starter: `# 20 pelamar: income (juta/bulan) dipisah menurut keterlambatan.
# None = income kosong.
late_ge = [None, None, 2.1, None, None, 2.8, None, 3.0]  # late >= 2
late_lt = [2.5, 2.2, None, 2.9, 3.1, 2.0, 2.4, 2.7, 3.3, 2.6, 2.3, 3.5]  # late < 2
m_ge = 0  # TODO: jumlah missing di kelompok late >= 2
m_lt = 0  # TODO: jumlah missing di kelompok late < 2
r_ge = 0.0  # TODO: persen missing kelompok late >= 2
r_lt = 0.0  # TODO: persen missing kelompok late < 2
m_all = m_ge + m_lt
kesimpulan = "TODO"  # TODO: "konsisten dengan MAR (missing bergantung pada late yang teramati)" atau "MCAR (missing acak)"
print(f"missing keseluruhan: {m_all} ({m_all / 20 * 100:.0f}%)")
print(f"missing late>=2: {m_ge} dari 8 ({r_ge:.1f}%)")
print(f"missing late<2: {m_lt} dari 12 ({r_lt:.1f}%)")
print(f"kesimpulan: {kesimpulan}")`,
        lockLines: 4,
        solution: `# 20 pelamar: income (juta/bulan) dipisah menurut keterlambatan.
# None = income kosong.
late_ge = [None, None, 2.1, None, None, 2.8, None, 3.0]  # late >= 2
late_lt = [2.5, 2.2, None, 2.9, 3.1, 2.0, 2.4, 2.7, 3.3, 2.6, 2.3, 3.5]  # late < 2
m_ge = sum(1 for x in late_ge if x is None)
m_lt = sum(1 for x in late_lt if x is None)
r_ge = m_ge / len(late_ge) * 100
r_lt = m_lt / len(late_lt) * 100
m_all = m_ge + m_lt
if r_ge > r_lt + 10:
    kesimpulan = "konsisten dengan MAR (missing bergantung pada late yang teramati)"
else:
    kesimpulan = "MCAR (missing acak)"
print(f"missing keseluruhan: {m_all} ({m_all / 20 * 100:.0f}%)")
print(f"missing late>=2: {m_ge} dari 8 ({r_ge:.1f}%)")
print(f"missing late<2: {m_lt} dari 12 ({r_lt:.1f}%)")
print(f"kesimpulan: {kesimpulan}")`,
        checks: [
          { kind: "equal", task: "missing late>=2 = 5", value: 5, name: "m_ge", label: "`m_ge` seharusnya 5", msg: "missing late>=2 = 5" },
          { kind: "equal", task: "missing late<2 = 1", value: 1, name: "m_lt", label: "`m_lt` seharusnya 1", msg: "missing late<2 = 1" },
          { kind: "equal", task: "rate late>=2 = 62,5 persen", value: 62.5, tol: 0.1, name: "r_ge", label: "`r_ge` seharusnya 62.5", msg: "rate late>=2 = 62,5 persen" },
          { kind: "equal", task: "rate late<2 = 8,3 persen", value: 8.3, tol: 0.1, name: "r_lt", label: "`r_lt` seharusnya 8.3", msg: "rate late<2 = 8,3 persen" },
          { kind: "stdout_matches", task: "laporan deteksi lengkap tercetak", pattern: "missing keseluruhan: 6 \\(30%\\)\\nmissing late>=2: 5 dari 8 \\(62.5%\\)\\nmissing late<2: 1 dari 12 \\(8.3%\\)\\nkesimpulan: konsisten dengan MAR \\(missing bergantung pada late yang teramati\\)", label: "Output menampilkan missing keseluruhan: 6 (30%)", msg: "Bandingkan tiap baris output dengan expected di atas." },
        ],
      },
      hints: [
        "Hitung missing dengan sum(1 for x in kelompok if x is None).",
        "Persen: jumlah missing dibagi ukuran kelompok, kali 100.",
        "Beda 62,5 persen vs 8,3 persen jauh lebih besar dari 10 poin — datanya konsisten dengan MAR, bukan MCAR.",
      ],
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan imputasi",
      prose: [
        "Tiga pertanyaan berurutan menentukan pengisianmu — dan urutannya penting:",
        "• Seberapa banyak yang kosong? Di bawah 5 persen: pengisi sederhana (mean/median/mode) cukup, efeknya kecil. 5 sampai 30 persen: pengisi harus dipilih dengan benar dan didokumentasikan, plus uji sensitivitas. Di atas 30 persen: jangan imputasi mentah — pertimbangkan model-based atau buang kolomnya.",
        "• Apa mekanismenya? MCAR: rata-rata global sah. MAR: pengisian harus bersyarat pada kolom yang menjelaskan missing-nya (rata-rata per kelompok, atau model yang memakai kolom itu). MNAR: tidak ada pengisian dari data yang ada yang sah tanpa asumsi tambahan — uji sensitivitas wajib.",
        "• Apa jenis kolomnya? Angka simetris: mean. Angka miring: median. Kategori: mode. Urutan waktu yang bertahan: forward-fill. Prediktor kuat tersedia: model-based.",
        "Dan satu aturan yang mengikat semuanya: setelah mengisi, ukur penyusutan variansnya — di bawah 5 persen abaikan; 5 sampai 10 persen laporkan; di atas 10 persen laporkan dan pertimbangkan indikator missing atau multiple imputation.",
        "Koneksi ke modul berikutnya: imputasi adalah fondasi preprocessing — di M1, imputasi yang fit pada train dan diterapkan ke test adalah syarat agar evaluasi model (MLF3) tidak bocor; di M2, scorecard credit scoring dibangun di atas data yang sudah diimputasi, dan pilihan imputasi (mean vs median vs model-based) diuji sensitivity-nya di M6; di M7, indikator missing itu sendiri bisa menjadi fitur yang adil atau tidak adil — kolom dengan missing tinggi pada kelompok tertentu menuntut audit fairness. Peta lengkap L0 → M1–M9 ada di L0.5.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case — Bila income notebook kosong 15 persen",
      prose: [
        "Notebook credit scoring punya 0 nilai kosong — jadi mini-case ini adalah skenario 'bagaimana bila': bayangkan LIMIT_BAL (sebagai proksi income) kosong 15 persen, dan missing-nya terkonsentrasi pada nasabah dengan PAY_0 sama dengan 2 (terlambat 2 bulan). Apa yang dilakukan?",
        "Pertama, uji mekanismenya seperti Lab 2: pecah missing rate menurut PAY_0. Bila kelompok PAY_0 sama dengan 2 punya missing rate jauh lebih tinggi, datanya konsisten dengan MAR — pengisian harus bersyarat pada PAY_0, bukan rata-rata global. Rata-rata global akan mencampur nasabah yang terlambat dengan yang lancar, dan pengisinya salah untuk kedua kelompok.",
        "Kedua, pilih pengisi menurut bentuk distribusi: LIMIT_BAL miring ke kanan (ada limit sangat besar), jadi median per kelompok PAY_0 lebih jujur dari mean global. Ketiga, ukur penyusutan varians dan tambahkan indikator missing — kolom yang menandai baris mana yang diimputasi — supaya model GBM bisa belajar bahwa baris itu berbeda.",
        "Perhatikan perbedaan dengan L0.1: EDUCATION 0/5/6 yang tak dikenal BUKAN missing — nilainya ada, hanya kodenya tidak terdokumentasi. Obatnya berbeda (biarkan + dokumentasi, karena 1,15 persen), dan mencampuradukkan 'kode tak dikenal' dengan 'nilai kosong' adalah kesalahan yang paling umum di tahap cleaning.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa rata-rata global salah bila missing-nya MAR dan terkonsentrasi pada PAY_0 sama dengan 2." },
        { id: "t2", text: "Jelaskan perbedaan obat antara 'income kosong 15 persen' dan 'EDUCATION tak dikenal 1,15 persen'." },
      ],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab — Imputasi pada 60 pengajuan sintetis",
      prose: [
        "Di Colab, kamu bekerja pada 60 pengajuan sintetis (seed 42) dengan missing income yang disuntikkan pada dua pola: sebagian acak (MCAR) dan sebagian terkonsentrasi pada nasabah yang terlambat (MAR). Tugasmu: deteksi mekanismenya per kelompok, isi dengan metode yang sesuai tiap kelompok, dan ukur penyusutan varians sebelum dan sesudahnya — lalu bandingkan dengan hasil Lab 1.",
        "Notebook ini juga menguji forward-fill pada riwayat pembayaran 6 bulan dan mode pada kolom kategori, dengan checks yang menegaskan tiap angka.",
        "Buka di Colab: https://colab.research.google.com/drive/1qIAmBF8RDAXtYIQiy9ohVcqhU-R9H8s9",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint — 8 soal",
      prose: [
        "Delapan soal menutup lesson ini. Bila ada yang salah, kembali ke langkah yang dirujuk di 'why' — jawabannya ada di angka lab, bukan di hafalan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Daftar B: mean 3,4833, median 2,7000, satu outlier 12,0. Mana yang mewakili pusat daftar ini?",
          options: [
            { text: "Mean 3,4833 — ia memakai semua nilai", why: "Salah: mean ditarik outlier 12,0 — 3,4833 lebih besar dari 9 dari 12 nilai yang ada.", correct: false },
            { text: "Median 2,7000 — ia kebal terhadap outlier", why: "Benar: median 2,7000 — bila outlier 12,0 dihapus median hanya bergerak 0,1 (menjadi 2,6000), sedangkan mean jatuh 0,7742 (ke 2,7091).", correct: true },
            { text: "Keduanya sama baiknya", why: "Salah: selisihnya 0,7833 — terlalu besar untuk dianggap sama.", correct: false },
            { text: "Tidak ada yang mewakili — datanya harus dibuang", why: "Salah: distribusi miring bukan alasan membuang data; median sudah mewakilinya.", correct: false },
          ],
        },
        {
          q: "Mengisi 3 nilai kosong daftar B dengan mean 3,4833: varians populasi menyusut berapa?",
          options: [
            { text: "0 persen — varians tidak berubah", why: "Salah: mengisi dengan satu nilai yang diulang pasti menyusutkan varians.", correct: false },
            { text: "20,0 persen (dari 7,0997 menjadi 5,6798)", why: "Benar: (7,0997 − 5,6798) dibagi 7,0997 sama dengan 20,0 persen.", correct: true },
            { text: "5,0 persen", why: "Salah: itu angka band 'baik' dari peta keputusan — bukan hasil hitung lab ini.", correct: false },
            { text: "50,0 persen", why: "Salah: penyusutan 20 persen sudah besar — 50 persen berarti setengah keragaman hilang.", correct: false },
          ],
        },
        {
          q: "Missing income 62,5 persen pada late 2 atau lebih, 8,3 persen pada late di bawah 2. Mekanismenya?",
          options: [
            { text: "MCAR — kosongnya acak", why: "Salah: bila acak, kedua kelompok akan sama-sama sekitar 30 persen.", correct: false },
            { text: "MAR — missing bergantung pada keterlambatan yang teramati", why: "Benar: 62,5 persen vs 8,3 persen — missing-nya berbeda menurut kolom lain yang teramati, jadi datanya konsisten dengan MAR (bukan bukti pasti — MNAR tidak bisa disingkirkan dari data teramati).", correct: true },
            { text: "MNAR — missing bergantung pada income itu sendiri", why: "Salah: MNAR tidak bisa dibuktikan dari data yang teramati — yang terbukti di sini adalah ketergantungan pada keterlambatan.", correct: false },
            { text: "Tidak bisa ditentukan", why: "Salah: perbandingan dua kelompok itu adalah bukti pendukung yang kuat untuk membedakan MAR dari MCAR — meski bukan bukti pasti, ia cukup untuk memilih pengisian bersyarat.", correct: false },
          ],
        },
        {
          q: "Forward-fill mengubah [0, 0, 1, kosong, 2, 2, kosong] menjadi [0, 0, 1, 1, 2, 2, 2]. Kapan teknik ini sah?",
          options: [
            { text: "Selalu — forward-fill adalah pengisi default untuk data berurutan", why: "Salah: forward-fill hanya sah bila nilai itu bertahan dari waktu ke waktu.", correct: false },
            { text: "Bila urutan waktu bermakna dan nilainya bertahan (sticky), seperti status keterlambatan", why: "Benar: status bulan berjalan biasanya sama dengan bulan lalu — itulah syarat forward-fill.", correct: true },
            { text: "Bila datanya angka, bukan kategori", why: "Salah: syaratnya bukan jenis datanya, melainkan apakah nilainya bertahan.", correct: false },
            { text: "Bila missing-nya lebih dari 30 persen", why: "Salah: forward-fill pada missing yang besar justru memperpanjang satu nilai terlalu jauh.", correct: false },
          ],
        },
        {
          q: "Mode EDUCATION pada [2, 2, 3, 2, 1, 2, 4, 2, 3, 2] adalah 2 (6 dari 10). Kapan mengisi dengan mode menjadi salah?",
          options: [
            { text: "Bila modenya muncul 6 dari 10 — itu terlalu dominan", why: "Salah: dominan justru yang membuat mode jadi pengisi yang wajar.", correct: false },
            { text: "Bila kategorinya seimbang — dua kategori sama kuat, mode adalah undian", why: "Benar: mode hanya bermakna bila satu kategori jelas dominan.", correct: true },
            { text: "Bila datanya kategori, bukan angka", why: "Salah: mode justru pengisi untuk kategori.", correct: false },
            { text: "Tidak pernah — mode selalu aman", why: "Salah: tidak ada pengisi yang selalu aman.", correct: false },
          ],
        },
        {
          q: "Kenapa MNAR tidak bisa dicek dari data yang teramati?",
          options: [
            { text: "Karena missing-nya bergantung pada nilai yang hilang itu sendiri — nilai itu tidak ada di data", why: "Benar: nasabah ber-income rendah yang tidak melaporkan income — income-nya tidak teramati, jadi tidak ada uji yang bisa membuktikannya.", correct: true },
            { text: "Karena MNAR hanya terjadi pada data kecil", why: "Salah: MNAR bisa terjadi pada data sebesar apa pun.", correct: false },
            { text: "Karena MNAR sama dengan MCAR", why: "Salah: MCAR acak dan bisa dicek; MNAR bergantung pada nilai yang hilang.", correct: false },
            { text: "Karena uji statistik belum ditemukan untuk MNAR", why: "Salah: bukan soal uji yang belum ditemukan — datanya sendiri tidak ada.", correct: false },
          ],
        },
        {
          q: "Nasabah terlambat melaporkan income 62,5 persen vs 8,3 persen yang tidak terlambat. Apa kesimpulan yang benar?",
          options: [
            { text: "Data konsisten dengan MAR — bukti pendukung, bukan bukti pasti; MNAR tidak bisa disingkirkan dari data teramati", why: "Benar: perbedaan antar kelompok yang teramati hanya mendukung MAR — mekanisme sebenarnya (apakah nasabah yang tidak membayar sengaja tidak melaporkan) tidak terlihat di data. Domain knowledge dan sensitivity analysis yang memutuskan.", correct: true },
            { text: "Mekanismenya terbukti MAR", why: "Salah: tidak ada tes dari data teramati yang bisa membuktikan MAR — yang terlihat hanya perbedaan antar kelompok yang teramati.", correct: false },
            { text: "Mekanismenya MNAR karena selisihnya besar", why: "Salah: selisih besar justru menunjukkan missing-nya bisa dijelaskan oleh variabel teramati (keterlambatan) — itu ciri MAR, bukan MNAR.", correct: false },
            { text: "Mekanismenya MCAR karena income-nya yang kosong", why: "Salah: MCAR berarti missing tidak bergantung pada apa pun — sedangkan di sini missing bergantung pada keterlambatan.", correct: false },
          ],
        },
        {
          q: "Bills sangat right-skew (skew 2,386). Kamu log-transform dulu, lalu isi missing dengan mean dari nilai log. Apa yang harus dilakukan sebelum nilai itu dipakai sebagai tagihan?",
          options: [
            { text: "Transform balik (exponentiate) — mean di skala log bukan mean di skala rupiah", why: "Benar: mean dari log adalah log dari geometric mean — memakainya langsung sebagai rupiah meremehkan tagihan. Imputasi di skala transformasi wajib ditransform balik sebelum dipakai.", correct: true },
            { text: "Pakai langsung — mean tetap mean di skala apa pun", why: "Salah: mean di skala log tidak sama dengan mean di skala asli; log mengubah skala secara non-linear.", correct: false },
            { text: "Jangan log-transform — imputasi harus selalu di skala asli", why: "Salah: log-transform adalah cara yang sah untuk data skew — yang wajib adalah transform balik sesudahnya.", correct: false },
            { text: "Isi dengan median saja, tanpa transform", why: "Salah: median memang robust, tapi soal ini menanyakan apa yang harus dilakukan bila sudah memakai log-then-mean — jawabannya transform balik.", correct: false },
          ],
        },
      ],
      summary: [
        "Mean untuk distribusi simetris, median untuk yang miring — bandingkan keduanya sebelum memilih pengisi.",
        "Mode untuk kategori, forward-fill untuk nilai yang bertahan, model-based bila prediktornya kuat.",
        "MCAR: kosongnya acak. MAR: kosongnya bergantung pada kolom lain yang teramati. MNAR: bergantung pada nilai yang hilang — tidak bisa dicek dari data.",
        "Imputasi satu nilai selalu menyusutkan varians — daftar B: 20,0 persen. Ukur dan laporkan penyusutannya.",
        "Mitigasi: indikator missing, uji sensitivitas (mean vs median vs tanpa imputasi), dan multiple imputation bila porsinya besar.",
        "Perbedaan missing antar kelompok adalah bukti pendukung MAR, bukan bukti pasti — MNAR tidak bisa disingkirkan dari data teramati; kesimpulan Lab 2 ditulis 'konsisten dengan MAR'.",
        "Imputasi di skala transformasi wajib ditransform balik sebelum dipakai; dan imputasi harus fit pada train, diterapkan ke test — median train 2,3000 vs median seluruh data 2,7000 (selisih 0,4000) adalah bocoran outlier test.",
        "Kode tak dikenal bukan missing — obatnya berbeda (L0.1).",
      ],
      next: { label: "Lanjut ke L0.3 — Distribusi & Outlier", href: "/v2/learn/mlf-l03-distribusi-outlier" },
    },
  ],
};
