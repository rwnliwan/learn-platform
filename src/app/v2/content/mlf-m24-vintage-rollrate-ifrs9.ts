import type { V2Lesson } from "../lib/types";

export const mlfM24: V2Lesson = {
  slug: "mlf-m24-vintage-rollrate-ifrs9",
  track: "Machine Learning Finance",
  module: "Supervised — credit scoring",
  title: "MLF-M2.4 — Vintage, Roll-Rate & IFRS 9: Bagaimana Kredit Menua",
  estMinutes: 60,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Model di M2.1–M2.3 memotret satu titik waktu: September 2005, PD, lalu keputusan. Lesson ini menambahkan dimensi waktu: bagaimana satu kohort nasabah menua dari bulan ke bulan, bagaimana tunggakan bermigrasi antar bucket, dan bagaimana akuntansi (IFRS 9) mengubah semua itu menjadi cadangan kerugian.",
        "Tujuan lesson ini:",
        "• Menjelaskan vintage analysis: membandingkan kohort berdasarkan status awalnya — dengan caveat data UCI yang jujur.",
        "• Membaca matriks roll-rate 5 bucket dan menemukan quirk PAY = 1 di data.",
        "• Menerapkan IFRS 9 staging (Stage 1/2/3) dan menghitung ECL — termasuk koreksi Stage 3 ke PD = 1.",
        "• Membedakan ECL (akuntansi) dari EL (ekonomi).",
        "• Menjalankan dua lab: roll-rate dari matriks counts, dan staging + ECL.",
        "Isi lesson: cerita perjalanan tunggakan → vintage → roll-rate → IFRS 9 → ECL vs EL → 2 lab → peta keputusan → mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari dataset UCI 30.000 nasabah [notebook]: kohort current default 0,1867 vs kohort 4+ default 0,7132; roll-rate bucket 4+ bertahan 0,6450; total ECL NT$457.366.208 (Stage 3 PD = 1).",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Satu nasabah telat: perjalanan dari current ke 4+",
      prose: [
        "Seorang nasabah membayar tepat waktu di April, Mei, Juni, Juli — lalu telat 2 bulan di Agustus, telat 3 bulan di September. Bank tidak menunggu Oktober untuk tahu ia default; bank sudah melihat perjalanannya sejak Agustus. Pertanyaannya bukan «apakah ia default?» — melainkan «seberapa cepat ia memburuk, dan berapa banyak nasabah lain yang menempuh jalan yang sama?».",
        "Tiga alat menjawab pertanyaan itu. Vintage analysis: bandingkan kohort — kelompok nasabah yang mulai bersama — dan lihat siapa yang paling cepat memburuk. Roll-rate analysis: ukur migrasi antar bucket keterlambatan dari bulan ke bulan. IFRS 9 staging: ubah status keterlambatan menjadi stage akuntansi, dan stage menjadi cadangan kerugian (ECL).",
        "Nilai: dari status Agustus, peluang nasabah telat 2 bulan memburuk ke PAY_0 ≥ 2 di September adalah 0,4744 — dan default rate Oktober mereka 0,5561 [notebook]. Dari status current, peluang yang sama hanya 0,0388, dengan default rate Oktober 0,1627. Satu bulan telat mengubah segalanya — dan angka-angka inilah yang dipakai bank untuk memutuskan kapan menelepon, kapan menagih, kapan mencadangkan.",
        "Baik atau buruk: analisis waktu bagus bila bucket-nya konsisten antar bulan — definisi «telat 2 bulan» yang sama di April dan di September. Buruk bila definisinya berubah diam-diam: migrasi yang tampak bisa jadi hanya perubahan definisi.",
        "Mitigasi: kunci definisi bucket (DPD: days past due) sebelum menghitung apa pun — current = 0 hari, 1 = 1–30 hari, 2 = 31–60 hari, 3 = 61–90 hari, 4+ = 91 hari ke atas — dan pakai definisi yang sama di vintage, roll-rate, dan staging.",
      ],
      tasks: [],
    },
    {
      id: "vintage",
      eyebrow: "Langkah 3 · Vintage analysis",
      title: "Vintage: kohort yang mulai bersama, menua bersama",
      prose: [
        "Vintage analysis membandingkan kohort — kelompok nasabah yang berasal dari periode yang sama — dan melacak default rate mereka seiring waktu. Kohort yang buruk menandakan underwriting yang longgar pada periode itu; kohort yang memburuk tiba-tiba menandakan guncangan ekonomi.",
        "Caveat yang wajib dinyatakan dulu: dataset UCI tidak punya tanggal origination — tidak ada kolom «kapan pinjaman ini diberikan». Jadi kohort di lesson ini didefinisikan dari status bayar pada bulan paling awal yang teramati, April 2005 (PAY_6) — bukan dari tanggal origination yang sesungguhnya. Ini proksi, bukan vintage sejati; hasilnya tetap mengajarkan cara membaca kohort, tapi jangan diklaim sebagai vintage origination.",
        "Nilai: empat kohort dari status April 2005 [notebook] — current (n = 26.921): default Oktober 0,1867. Kohort 2 (n = 2.766): 0,5065. Kohort 3 (n = 184): 0,6413. Kohort 4+ (n = 129): 0,7132. Polanya tajam: nasabah yang sudah telat di April, default di Oktober dengan peluang 2,7 sampai 3,8 kali lipat dari nasabah current.",
        "Gambar di bawah menunjukkan keempat kohort itu. Perhatikan n-nya: kohort current berisi 26.921 nasabah — hampir 90 persen populasi — sementara kohort 4+ hanya 129 orang. Estimasi kohort kecil lebih berisik: 0,7132 dari 129 orang punya selisih yang jauh lebih lebar dari 0,1867 dari 26.921 orang.",
        "Detail per nilai PAY_6 mentah [notebook]: −2: 4.895 nasabah, default 0,2004. −1: 5.740, 0,1699. 0: 16.286, 0,1884. 2: 2.766, 0,5065. 3: 184, 0,6413. 4: 49, 0,6327. 5: 13, 0,5385. 6: 19, 0,7368. 7: 46, 0,8261. 8: 2, 1,0000. Nilai 8 dengan n = 2 dan default 1,0000 adalah contoh sempurna «angka yang benar tapi tidak bisa dipakai» — jangan pernah mengambil keputusan dari n = 2.",
        "Baik atau buruk: vintage bagus bila kohort-nya didefinisikan dari origination yang sesungguhnya dan dilacak cukup lama — minimal 12 bulan. Buruk bila kohort didefinisikan dari status teramati (seperti di sini) lalu dibaca seolah-olah itu origination: status April adalah hasil dari sejarah sebelumnya, bukan titik awal yang bersih.",
        "Mitigasi: nyatakan definisi kohort di samping angkanya — selalu. Dan bila datamu tidak punya tanggal origination, katakan begitu; proksi yang dinyatakan jujur lebih berguna dari vintage palsu yang tampak rapi.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar default rate per kohort Apr 2005: current 0,1867; 2 sebesar 0,5065; 3 sebesar 0,6413; 4+ sebesar 0,7132">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Vintage: kohort yang sudah telat di April, default di Oktober</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,8</text>
<rect x="75.3" y="164.9" width="56.9" height="41.1" fill="var(--c3)"/>
<text x="103.8" y="158.9" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,1867</text>
<line x1="103.8" y1="206" x2="103.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="103.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">current (n=26.921)</text>
<rect x="178.8" y="94.6" width="56.9" height="111.4" fill="var(--c2)"/>
<text x="207.2" y="88.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5065</text>
<line x1="207.2" y1="206" x2="207.2" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="207.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2 (n=2.766)</text>
<rect x="282.3" y="64.9" width="56.9" height="141.1" fill="var(--c4)"/>
<text x="310.8" y="58.9" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,6413</text>
<line x1="310.8" y1="206" x2="310.8" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="310.8" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3 (n=184)</text>
<rect x="385.8" y="49.1" width="56.9" height="156.9" fill="var(--c4)"/>
<text x="414.2" y="43.1" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,7132</text>
<line x1="414.2" y1="206" x2="414.2" y2="210" stroke="var(--chart-text)" stroke-width="1"/>
<text x="414.2" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4+ (n=129)</text>
<text x="259.0" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">kohort (status bayar April 2005, PAY_6)</text>
<text x="14" y="118.0" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118.0)">default Okt 2005</text>
</svg>`,
        alt: "Bar default rate per kohort Apr 2005: current 0,1867; 2 sebesar 0,5065; 3 sebesar 0,6413; 4+ sebesar 0,7132.",
        caption: "Cara membaca: tinggi bar = default Oktober 2005 per kohort (status April 2005, PAY_6); label n = jumlah nasabah kohort. Interpretasi: kohort yang sudah telat di April default 2,7–3,8 kali lipat dari kohort current.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: vintage selalu butuh tanggal origination",
        type: "pitfall",
        body: "Yang benar: vintage sejati memang memakai tanggal origination. Bila datamu tidak punya itu — seperti UCI — kamu boleh memakai proksi (status bulan paling awal teramati), asalkan caveat-nya dinyatakan di samping angka, bukan disembunyikan di catatan kaki.",
      },
    },
    {
      id: "rollrate",
      eyebrow: "Langkah 4 · Roll-rate analysis",
      title: "Roll-rate: ke mana tunggakan bergerak bulan depan?",
      prose: [
        "Roll-rate mengukur migrasi: dari status bulan ini, ke mana nasabah bergerak bulan depan? Jawabannya adalah matriks transisi — baris status asal, kolom status tujuan, tiap sel peluang pindah. Bank membacanya seperti ramalan cuaca: «dari 100 nasabah di bucket 2, 25 akan sembuh, 58 bertahan, 6 memburuk ke bucket 3».",
        "Nilai: matriks roll-rate pooled — total 5 transisi April–September 2005, bucket current/1/2/3/4+ [notebook]. Dari current (n total 131.792): tetap current 0,9388, ke 1: 0,0141, ke 2: 0,0471, ke 3: 0,0000, ke 4+: 0,0000. Dari 2 (n 16.297): ke current 0,2534, ke 1: 0,1028, tetap 2: 0,5805, ke 3: 0,0633, ke 4+: 0,0000. Dari 3 (n 1.108): ke current 0,1588, ke 1: 0,0984, ke 2: 0,3267, tetap 3: 0,1588, ke 4+: 0,2572. Dari 4+ (n 769): ke current 0,0312, ke 1: 0,0559, ke 2: 0,2172, ke 3: 0,0507, tetap 4+: 0,6450.",
        "Gambar di bawah adalah heatmap matriks itu: diagonal gelap berarti persisten — nasabah cenderung bertahan di bucket-nya. Bucket 4+ paling persisten (0,6450): sekali telat 91 hari ke atas, dua dari tiga nasabah tetap di sana bulan depan. Bucket current juga persisten (0,9388): nasabah lancar cenderung tetap lancar.",
        "Sekarang quirk data yang wajib diajarkan: bucket 1 hampir tidak ada. PAY = 1 tercatat 3.688 baris di September (PAY_0), tapi hanya 28 baris di Agustus (PAY_2), 4 di Juli, 2 di Juni, 0 di Mei dan April [notebook]. Akibatnya baris bucket 1 di matriks hanya punya n total 34 — dan seluruh baris itu adalah «tetap di 1» (1,0000) karena transisi yang tercatat hanya dari bulan-bulan yang hampir tidak punya PAY = 1. Jangan baca baris itu: n = 34 dari 150.000 transisi adalah noise, bukan pola. Penyebab quirk ini tidak diketahui dari data — mungkin definisi pencatatan yang berubah — dan lesson ini mencatatnya sebagai quirk, bukan menjelaskannya.",
        "Angka yang bersih dan bisa dipakai: roll ke PAY_0 ≥ 2 dari status Agustus [notebook] — current 0,0388 (default Oktober 0,1627); 1 (n = 28) 0,0000 (default 0,1786); 2: 0,4744 (default 0,5561); 3: 0,5215 (default 0,6166); 4+: 0,6752 (default 0,5478). Semakin telat di Agustus, semakin besar peluang memburuk di September — dan semakin besar default di Oktober. Pengecualian: bucket 4+ default Oktober 0,5478 — sedikit LEBIH RENDAH dari bucket 3 (0,6166) — karena sebagian nasabah 4+ sudah dihapuskan (charge-off) atau direstrukturisasi sebelum Oktober.",
        "Baik atau buruk: roll-rate bagus bila dihitung dari transisi yang cukup banyak per baris — baris current (n 131.792) sangat bisa dipercaya, baris 4+ (n 769) masih bisa dibaca, baris 1 (n 34) tidak. Buruk bila matriks dibaca tanpa n: angka 1,0000 pada baris 1 tampak meyakinkan sampai kamu melihat n-nya.",
        "Mitigasi: selalu tampilkan n per baris di samping matriks — dan tetapkan ambang minimum (misal n ≥ 100) di bawah itu baris tidak dibaca. Roll-rate juga mengasumsikan transisi yang stabil antar bulan (stasioner); bila satu bulan anomali, selidiki dulu sebelum merata-rata.",
        "Jembatan dari M2.2 — ambang «n ≥ 100» itu rule of thumb, bukan pengganti interval statistik. Interval Wilson 95% mengukur ketidakpastian tiap rate: 34/34 (roll-rate bucket 1) → [0,8985; 1,0000], lebar 0,1015 — «pasti bertahan» dari 34 transisi masih menyisakan 10 persen kemungkinan sebaliknya. Kohort 4+ 92/129 (0,7132) → [0,6299; 0,7842], lebar 0,1543. Band skor di bawah 460: 0,6993 dari n = 2.205 → [0,6798; 0,7181], lebar 0,0383. Rumus dan contoh kerja lengkapnya di M2.2 langkah 6; lab menghitung Wilson-nya ada di lab 2 lesson ini.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 250" role="img" aria-label="Heatmap roll-rate 5x5: diagonal tinggi, bucket 4+ paling persisten 0,6450">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Roll-rate: dari status bulan ini ke bulan depan</text>
<text x="131.0" y="26" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">current</text>
<text x="193.0" y="26" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<text x="255.0" y="26" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<text x="317.0" y="26" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3</text>
<text x="379.0" y="26" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4+</text>
<text x="14" y="118" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 118)">dari ↓</text>
<text x="92" y="55.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">current</text>
<text x="60" y="55.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n=131.792</text>
<rect x="100.0" y="34.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.88" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="131.0" y="55.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,9388</text>
<rect x="162.0" y="34.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.09" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="193.0" y="55.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0141</text>
<rect x="224.0" y="34.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.12" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="255.0" y="55.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0471</text>
<rect x="286.0" y="34.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.08" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="317.0" y="55.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0000</text>
<rect x="348.0" y="34.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.08" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="379.0" y="55.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0000</text>
<text x="92" y="89.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<text x="60" y="89.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n=34</text>
<rect x="100.0" y="68.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.08" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="131.0" y="89.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0000</text>
<rect x="162.0" y="68.0" width="60.0" height="32.0" fill="var(--c4)" fill-opacity="0.93" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="193.0" y="89.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">1,0000</text>
<rect x="224.0" y="68.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.08" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="255.0" y="89.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0000</text>
<rect x="286.0" y="68.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.08" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="317.0" y="89.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0000</text>
<rect x="348.0" y="68.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.08" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="379.0" y="89.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0000</text>
<text x="92" y="123.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2</text>
<text x="60" y="123.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n=16.297</text>
<rect x="100.0" y="102.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.30" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="131.0" y="123.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,2534</text>
<rect x="162.0" y="102.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.17" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="193.0" y="123.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,1028</text>
<rect x="224.0" y="102.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.57" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="255.0" y="123.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,5805</text>
<rect x="286.0" y="102.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.13" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="317.0" y="123.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0633</text>
<rect x="348.0" y="102.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.08" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="379.0" y="123.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0000</text>
<text x="92" y="157.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3</text>
<text x="60" y="157.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n=1.108</text>
<rect x="100.0" y="136.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.21" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="131.0" y="157.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,1588</text>
<rect x="162.0" y="136.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.16" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="193.0" y="157.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0984</text>
<rect x="224.0" y="136.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.36" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="255.0" y="157.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,3267</text>
<rect x="286.0" y="136.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.21" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="317.0" y="157.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,1588</text>
<rect x="348.0" y="136.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.30" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="379.0" y="157.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,2572</text>
<text x="92" y="191.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4+</text>
<text x="60" y="191.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">n=769</text>
<rect x="100.0" y="170.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.11" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="131.0" y="191.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0312</text>
<rect x="162.0" y="170.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.13" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="193.0" y="191.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0559</text>
<rect x="224.0" y="170.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.26" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="255.0" y="191.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,2172</text>
<rect x="286.0" y="170.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.12" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="317.0" y="191.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,0507</text>
<rect x="348.0" y="170.0" width="60.0" height="32.0" fill="var(--c1)" fill-opacity="0.63" stroke="var(--chart-text)" stroke-width="0.5"/>
<text x="379.0" y="191.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">0,6450</text>
<text x="259" y="222" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Baris bucket 1: n total hanya 34 — jangan dibaca.</text>
<text x="259" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Diagonal = bertahan di bucket yang sama; kanan atas = memburuk.</text>
</svg>`,
        alt: "Heatmap roll-rate 5x5: diagonal tinggi, bucket 4+ paling persisten 0,6450.",
        caption: "Cara membaca: baris = status bulan ini, kolom = status bulan depan; angka = peluang pindah (pooled, 5 transisi). Interpretasi: diagonal persisten — 4+ bertahan 0,6450; baris bucket 1 (n = 34) jangan dibaca.",
      },
      tasks: [],
    },
    {
      id: "ifrs9",
      eyebrow: "Langkah 5 · IFRS 9 staging & ECL",
      title: "IFRS 9: status tunggakan menjadi cadangan kerugian",
      prose: [
        "IFRS 9 mengubah status keterlambatan menjadi stage akuntansi — dan stage menjadi expected credit loss (ECL) yang dilaporkan di laporan keuangan. Tiga stage: Stage 1 — performing, PD 12 bulan. Stage 2 — significant increase in credit risk (SICR), PD lifetime. Stage 3 — credit-impaired (default), PD = 1.",
        "Nilai: staging dari PAY_0, September 2005, LGD 45 persen [ilustrasi] [notebook]. Stage 1 (PAY_0 ≤ 1, 0–30 DPD): n = 26.870 (89,6 persen), PD 1 bln 0,1659, EAD rata-rata NT$174.495, ECL per nasabah NT$13.031, total NT$350.133.169. Stage 2 (PAY_0 = 2, 3; 31–90 DPD): n = 2.989 (10,0 persen), PD 1 bln 0,6986, EAD NT$108.269, ECL per nasabah NT$34.035, total NT$101.729.540. Stage 3 (PAY_0 ≥ 4, 91+ DPD): n = 141 (0,5 persen), EAD NT$86.738, ECL per nasabah NT$39.032 (dengan PD = 1), total NT$5.503.500. PD 1 bulan dipakai sebagai proksi (label UCI: default bulan berikutnya); ECL di bawah adalah ECL 1 bulan, bukan 12 bulan.",
        "Total ECL 1 bulan: NT$457.366.208 [notebook]. Perhatikan koreksi Stage 3: PD observasi Stage 3 adalah 0,6312 (89 dari 141 default di Oktober) — tapi ECL Stage 3 TIDAK memakai 0,6312. Nasabah Stage 3 sudah impaired: kerugiannya sudah terjadi, bukan peluang. Jadi PD-nya dipaksa 1 — ECL per nasabah menjadi 1 × 0,45 × 86.738 = NT$39.032, bukan 0,6312 × 0,45 × 86.738 = NT$24.637. Koreksi ini menambah NT$2.029.660 ke total ECL (dari NT$455.336.548 menjadi NT$457.366.208). Memakai PD observasi untuk Stage 3 adalah kesalahan yang meremehkan cadangan — dan kesalahan yang mudah dilakukan bila rumusnya diotomasi tanpa berpikir.",
        "Satu catatan tentang Stage 2: ECL 1 bln di atas (NT$34.035 per nasabah) memakai PD 1 bulan sebagai proksi — tapi IFRS 9 meminta PD LIFETIME untuk Stage 2. PD lifetime adalah peluang default selama sisa umur pinjaman — dan itu butuh model multi-tahun, yang baru diajarkan di M9 (simulasi dan validasi). Sebagai ilustrasi [ilustrasi]: bila PD lifetime 0,85, ECL Stage 2 menjadi 0,85 × 0,45 × 108.269 = NT$41.413 per nasabah (total NT$123.783.120) — lebih besar dari ECL 1 bln-nya, seperti seharusnya.",
        "Baik atau buruk: staging bagus bila aturannya eksplisit dan konsisten — «PAY_0 = 2 berarti Stage 2» bisa diaudit siapa pun. Buruk bila SICR didefinisikan kabur («peningkatan signifikan» tanpa angka) — stage menjadi negosiasi, bukan perhitungan.",
        "Mitigasi: kunci definisi stage ke angka (DPD dan/atau kenaikan PD relatif) dan dokumentasikan. Dan ingat: ECL adalah angka akuntansi — ia mengikuti aturan IFRS 9, bukan intuisi ekonomi. Keduanya penting, dan keduanya berbeda — itu topik langkah berikut.",
      ],
      formula: String.raw`ECL = PD \times LGD \times EAD, \quad \text{Stage 3: } PD = 1`,
      formulaNote: "Rumus ECL sama dengan EL — yang berbeda adalah PD-nya: Stage 1 memakai PD 12 bulan, Stage 2 PD lifetime, Stage 3 PD = 1 karena sudah impaired. (Angka yang dihitung di lesson ini memakai PD 1 bulan sebagai proksi untuk PD 12 bulan Stage 1.)",
      tasks: [],
    },
    {
      id: "ecl-vs-el",
      eyebrow: "Langkah 6 · ECL vs EL",
      title: "ECL dan EL: rumus sama, tujuan berbeda",
      prose: [
        "ECL dan EL memakai rumus yang sama — PD × LGD × EAD — tapi menjawab pertanyaan yang berbeda. EL (M2.3) adalah ukuran ekonomi: berapa kerugian yang diharapkan, untuk mengambil keputusan bisnis (threshold, pricing, limit). ECL adalah ukuran akuntansi: berapa cadangan yang harus dilaporkan, mengikuti aturan IFRS 9 (staging, PD 12m vs lifetime, PD = 1 untuk Stage 3).",
        "Nilai: bandingkan keduanya pada data yang sama [notebook]. EL portofolio dari stress test baseline: NT$78.675.378 (PD model × LGD 45 persen × EAD, test set 6.000 nasabah). Total ECL 1 bln staging: NT$457.366.208 (seluruh 30.000 nasabah, Stage 3 PD = 1). Angka-angka ini tidak bisa dibandingkan langsung — populasinya berbeda (6.000 vs 30.000), horizonnya berbeda, dan Stage 3-nya diperlakukan berbeda. Membandingkan keduanya tanpa menyamakan populasi adalah kesalahan yang umum — dan lesson ini melarangnya.",
        "Perbedaan praktisnya: EL berubah saat model berubah; ECL berubah saat stage berubah. Nasabah yang pindah dari Stage 1 ke Stage 2 — karena telat 2 bulan — melompat dari PD 12m ke PD lifetime: ECL-nya naik tajam meski PD 12m-nya nyaris tidak bergerak. Itulah kenapa bank memantau migrasi stage sama seriusnya dengan memantau PD.",
        "Baik atau buruk: ECL bagus bila staging-nya disiplin — ia memaksa bank mencadangkan lebih awal, sebelum default terjadi. Buruk bila staging dimanipulasi: menahan nasabah di Stage 1 padahal sudah telat 2 bulan adalah cara menunda cadangan — dan auditor serta regulator memeriksa tepat di situ.",
        "Mitigasi: laporkan EL dan ECL berdampingan dengan populasi dan horizon yang dinyatakan — jangan pernah menyajikan satu angka tanpa konteksnya. Dan uji sensitivitas: berapa ECL bila ambang Stage 2 digeser satu bucket? Bila jawabannya «berubah drastis», ambang itu adalah asumsi kritis yang harus didokumentasikan.",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 7 · Lab 1",
      title: "Lab: matriks roll-rate dari tabel counts",
      prose: [
        "Lab pertama menghitung matriks roll-rate dari tabel counts transisi yang sesungguhnya — total 5 transisi April–September 2005, 150.000 transisi (= 30.000 nasabah × 5 transisi).",
        "Caranya: tiap baris dibagi total barisnya. Baris current: 123.723 tetap current dari 131.792 transisi → 0,9388. Baris 4+: 496 tetap di 4+ dari 769 → 0,6450 [lab].",
        "Perhatikan baris bucket 1: totalnya hanya 34 — dan rate «tetap di 1»-nya 1,0000. Lab ini mencetaknya apa adanya, tapi prose lesson sudah memperingatkan: jangan dibaca. Menghitung dengan benar dan membaca dengan benar adalah dua keterampilan yang berbeda.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi rate = count / total baris" },
        { id: "t2", text: "Jalankan dan baca matriks roll-rate" },
        { id: "t3", text: "Tentukan baris mana yang tidak boleh dibaca, dan kenapa" },
      ],
      expected: "dari current (n=131792): 0.9388 0.0141 0.0471 0.0000 0.0000\ndari 1 (n=34): 0.0000 1.0000 0.0000 0.0000 0.0000\ndari 2 (n=16297): 0.2534 0.1028 0.5805 0.0633 0.0000\ndari 3 (n=1108): 0.1588 0.0984 0.3267 0.1588 0.2572\ndari 4+ (n=769): 0.0312 0.0559 0.2172 0.0507 0.6450\nroll ke 4+ dari bucket 3: 0.2572\nbertahan di 4+: 0.6450",
      hints: [
        "Rate tiap sel = count sel dibagi jumlah seluruh count di baris yang sama.",
        "Format 4 desimal — samakan dengan expected.",
      ],
      code: {
        starter: `# Matriks counts 5 transisi (Apr->Sep 2005), bucket current/1/2/3/4+
# Baris = status bulan ini, kolom = status bulan depan
counts = [
    [123723, 1860, 6209, 0, 0],      # current
    [0, 34, 0, 0, 0],                # 1
    [4130, 1676, 9460, 1031, 0],     # 2
    [176, 109, 362, 176, 285],       # 3
    [24, 43, 167, 39, 496],          # 4+
]
cats = ["current", "1", "2", "3", "4+"]
M = []
for i, row in enumerate(counts):
    total = sum(row)
    rates = [c / total for c in row]  # TODO: rate = count / total baris
    M.append(rates)
    print(f"dari {cats[i]} (n={total}): " + " ".join(f"{r:.4f}" for r in rates))
print(f"roll ke 4+ dari bucket 3: {counts[3][4] / sum(counts[3]):.4f}")
print(f"bertahan di 4+: {counts[4][4] / sum(counts[4]):.4f}")`,
        lockLines: 10,
        solution: `# Matriks counts 5 transisi (Apr->Sep 2005), bucket current/1/2/3/4+
# Baris = status bulan ini, kolom = status bulan depan
counts = [
    [123723, 1860, 6209, 0, 0],      # current
    [0, 34, 0, 0, 0],                # 1
    [4130, 1676, 9460, 1031, 0],     # 2
    [176, 109, 362, 176, 285],       # 3
    [24, 43, 167, 39, 496],          # 4+
]
cats = ["current", "1", "2", "3", "4+"]
M = []
for i, row in enumerate(counts):
    total = sum(row)
    rates = [c / total for c in row]
    M.append(rates)
    print(f"dari {cats[i]} (n={total}): " + " ".join(f"{r:.4f}" for r in rates))
print(f"roll ke 4+ dari bucket 3: {counts[3][4] / sum(counts[3]):.4f}")
print(f"bertahan di 4+: {counts[4][4] / sum(counts[4]):.4f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "M", value: [[0.9388, 0.0141, 0.0471, 0.0, 0.0], [0.0, 1.0, 0.0, 0.0, 0.0], [0.2534, 0.1028, 0.5805, 0.0633, 0.0], [0.1588, 0.0984, 0.3267, 0.1588, 0.2572], [0.0312, 0.0559, 0.2172, 0.0507, 0.645]], tol: 0.0001, label: "`M` seharusnya matriks roll-rate pooled", msg: "Tiap baris dibagi total barisnya; baris bucket 1 (n = 34) tetap dihitung — tapi jangan dibaca." },
          { kind: "stdout_matches", task: "t2", pattern: "bertahan di 4\\+: 0\\.6450", label: "Output menampilkan persistensi 4+ sebesar 0,6450", msg: "496 dari 769 transisi bertahan di 4+." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 8 · Lab 2",
      title: "Lab: staging IFRS 9 dan total ECL",
      prose: [
        "Lab kedua menghitung ECL dari tabel staging yang sesungguhnya — n, defaults, dan EAD total per stage, langsung dari dataset UCI.",
        "Dua hal yang harus benar: PD = defaults / n (bukan angka yang ditebak), dan EAD rata-rata = EAD total / n. ECL per nasabah = PD × LGD × EAD rata-rata; ECL total stage = ECL per nasabah × n.",
        "Hasilnya: Stage 1 NT$350.133.169, Stage 2 NT$101.729.540, Stage 3 (PD observasi) NT$3.473.840 — total NT$455.336.548 [lab]. Lalu koreksi Stage 3 ke PD = 1: NT$5.503.500 — dan total terkoreksi NT$457.366.208. Selisih koreksinya NT$2.029.660 — kecil dibanding total, tapi besar sebagai prinsip: nasabah yang sudah impaired tidak boleh dicadangkan dengan peluang.",
        "Dua tugas tambahan mengukur ketidakpastian dan drift: tugas 4 menghitung interval Wilson 95% untuk empat rate dengan n yang berbeda — dari «100 persen» yang hampir tidak berarti (n = 2) sampai estimasi yang solid (n = 2.205); tugas 5 menghitung PSI dari dua tabel proporsi sintetis dan menilainya dengan band PSI.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi PD = defaults / n" },
        { id: "t2", text: "Lengkapi ECL per nasabah = PD x LGD x EAD rata-rata" },
        { id: "t3", text: "Jalankan, baca total ECL, lalu terapkan koreksi Stage 3 (PD = 1)" },
        { id: "t4", text: "Hitung interval Wilson 95% untuk empat rate: (k=2, n=2), (1.542, 2.205), (92, 129), (34, 34)" },
        { id: "t5", text: "Hitung PSI dari proporsi expected [0,60; 0,25; 0,15] vs actual [0,52; 0,28; 0,20]" },
      ],
      expected: "Stage 1: PD=0.1659 ECL/nasabah=NT$13031 ECL total=NT$350133169\nStage 2: PD=0.6986 ECL/nasabah=NT$34035 ECL total=NT$101729540\nStage 3: PD=0.6312 ECL/nasabah=NT$24637 ECL total=NT$3473840\nTotal ECL (PD observasi semua stage): NT$455336548\nStage 3 dengan PD=1: ECL/nasabah=NT$39032 total=NT$5503500\nTotal ECL (Stage 3 PD=1): NT$457366208\nWilson k=2 n=2: [0.3424, 1.0000] lebar=0.6576\nWilson k=1542 n=2205: [0.6798, 0.7181] lebar=0.0383\nWilson k=92 n=129: [0.6299, 0.7842] lebar=0.1543\nWilson k=34 n=34: [0.8985, 1.0000] lebar=0.1015\nbin: kontribusi=0.0114\nbin: kontribusi=0.0034\nbin: kontribusi=0.0144\nPSI=0.0292",
      hints: [
        "EAD rata-rata = EAD total (ead_sum) dibagi n.",
        "Total terkoreksi = total observasi − ECL Stage 3 observasi + ECL Stage 3 (PD = 1).",
      ],
      code: {
        starter: `# Staging IFRS 9 dari PAY_0 (Sep 2005); LGD 45% [ilustrasi]
# (stage, n, defaults, EAD_sum)
stages = [("Stage 1", 26870, 4459, 4688683680),
          ("Stage 2", 2989, 2088, 323616000),
          ("Stage 3", 141, 89, 12230000)]
LGD = 0.45
ecl_stage = []
total_ecl = 0.0
for name, n, dflt, ead_sum in stages:
    pd = 0.0  # TODO: PD = defaults / n
    ead_mean = ead_sum / n
    ecl_pp = 0.0  # TODO: ECL per nasabah = PD x LGD x EAD rata-rata
    ecl_tot = ecl_pp * n
    ecl_stage.append(ecl_tot)
    total_ecl += ecl_tot
    print(f"{name}: PD={pd:.4f} ECL/nasabah=NT\${ecl_pp:.0f} ECL total=NT\${ecl_tot:.0f}")
print(f"Total ECL (PD observasi semua stage): NT\${total_ecl:.0f}")
# Koreksi Stage 3: sudah impaired -> PD = 1
s3_ecl_pp = 1.0 * LGD * (12230000 / 141)
s3_ecl_tot = s3_ecl_pp * 141
print(f"Stage 3 dengan PD=1: ECL/nasabah=NT\${s3_ecl_pp:.0f} total=NT\${s3_ecl_tot:.0f}")
total_corr = ecl_stage[0] + ecl_stage[1] + s3_ecl_tot
print(f"Total ECL (Stage 3 PD=1): NT\${total_corr:.0f}")

# --- Tugas 4: interval Wilson 95% untuk rate dari n kecil (G8) ---
import math
def wilson(k, n):
    z = 1.96
    p = k / n
    denom = 1 + z * z / n
    center = 0.0  # TODO: pusat = (p + z^2/(2n)) / denom
    half = 0.0  # TODO: setengah lebar = z*sqrt(p(1-p)/n + z^2/(4n^2)) / denom
    return center - half, center + half
widths = []
for k, n in [(2, 2), (1542, 2205), (92, 129), (34, 34)]:
    lo, hi = wilson(k, n)
    widths.append(hi - lo)
    print(f"Wilson k={k} n={n}: [{lo:.4f}, {hi:.4f}] lebar={hi - lo:.4f}")

# --- Tugas 5: PSI dari dua tabel proporsi (G9) ---
expected = [0.60, 0.25, 0.15]  # proporsi train [ilustrasi]
actual = [0.52, 0.28, 0.20]    # proporsi current [ilustrasi]
psi = 0.0  # TODO: PSI = jumlah (actual - expected) * ln(actual / expected)
for e, a in zip(expected, actual):
    print(f"bin: kontribusi={(a - e) * math.log(a / e):.4f}")
print(f"PSI={psi:.4f}")`,
        lockLines: 6,
        solution: `# Staging IFRS 9 dari PAY_0 (Sep 2005); LGD 45% [ilustrasi]
# (stage, n, defaults, EAD_sum)
stages = [("Stage 1", 26870, 4459, 4688683680),
          ("Stage 2", 2989, 2088, 323616000),
          ("Stage 3", 141, 89, 12230000)]
LGD = 0.45
ecl_stage = []
total_ecl = 0.0
for name, n, dflt, ead_sum in stages:
    pd = dflt / n
    ead_mean = ead_sum / n
    ecl_pp = pd * LGD * ead_mean
    ecl_tot = ecl_pp * n
    ecl_stage.append(ecl_tot)
    total_ecl += ecl_tot
    print(f"{name}: PD={pd:.4f} ECL/nasabah=NT\${ecl_pp:.0f} ECL total=NT\${ecl_tot:.0f}")
print(f"Total ECL (PD observasi semua stage): NT\${total_ecl:.0f}")
# Koreksi Stage 3: sudah impaired -> PD = 1
s3_ecl_pp = 1.0 * LGD * (12230000 / 141)
s3_ecl_tot = s3_ecl_pp * 141
print(f"Stage 3 dengan PD=1: ECL/nasabah=NT\${s3_ecl_pp:.0f} total=NT\${s3_ecl_tot:.0f}")
total_corr = ecl_stage[0] + ecl_stage[1] + s3_ecl_tot
print(f"Total ECL (Stage 3 PD=1): NT\${total_corr:.0f}")

# --- Tugas 4: interval Wilson 95% untuk rate dari n kecil (G8) ---
import math
def wilson(k, n):
    z = 1.96
    p = k / n
    denom = 1 + z * z / n
    center = (p + z * z / (2 * n)) / denom
    half = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / denom
    return center - half, center + half
widths = []
for k, n in [(2, 2), (1542, 2205), (92, 129), (34, 34)]:
    lo, hi = wilson(k, n)
    widths.append(hi - lo)
    print(f"Wilson k={k} n={n}: [{lo:.4f}, {hi:.4f}] lebar={hi - lo:.4f}")

# --- Tugas 5: PSI dari dua tabel proporsi (G9) ---
expected = [0.60, 0.25, 0.15]  # proporsi train [ilustrasi]
actual = [0.52, 0.28, 0.20]    # proporsi current [ilustrasi]
psi = sum((a - e) * math.log(a / e) for e, a in zip(expected, actual))
for e, a in zip(expected, actual):
    print(f"bin: kontribusi={(a - e) * math.log(a / e):.4f}")
print(f"PSI={psi:.4f}")`,
        checks: [
          { kind: "equal", task: "t3", name: "total_corr", value: 457366208, tol: 1, label: "`total_corr` seharusnya NT$457.366.208", msg: "350.133.169 + 101.729.540 + 5.503.500 (Stage 3 dengan PD = 1)." },
          { kind: "stdout_matches", task: "t3", pattern: "Total ECL \\(Stage 3 PD=1\\): NT\\$457366208", label: "Output menampilkan total ECL terkoreksi", msg: "Format: Total ECL (Stage 3 PD=1): NT${total_corr:.0f}." },
          { kind: "equal", task: "t4", name: "widths", value: [0.6576, 0.0383, 0.1543, 0.1015], tol: 0.0001, label: "`widths` seharusnya [0,6576; 0,0383; 0,1543; 0,1015]", msg: "Lebar interval Wilson: n = 2 paling lebar (0,6576), n = 2.205 paling sempit (0,0383) — n yang menentukan, bukan rate-nya." },
          { kind: "equal", task: "t5", name: "psi", value: 0.0292, tol: 0.0001, label: "`psi` seharusnya 0,0292", msg: "PSI = 0,0114 + 0,0034 + 0,0144 = 0,0292 — di bawah 0,1: stabil." },
          { kind: "stdout_matches", task: "t5", pattern: "PSI=0\\.0292", label: "Output menampilkan PSI 0,0292", msg: "Format: PSI={psi:.4f}." },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: kapan vintage, kapan roll-rate, kapan staging?",
      prose: [
        "Mau tahu kohort mana yang paling berisiko? Vintage — bandingkan default rate antar kohort pada umur yang sama.",
        "Mau tahu seberapa cepat tunggakan memburuk bulan depan? Roll-rate — baca matriks transisi, dengan n per baris.",
        "Mau tahu berapa cadangan yang harus dilaporkan? IFRS 9 staging + ECL — dengan definisi stage yang eksplisit dan koreksi Stage 3 (PD = 1).",
        "Mau tahu apakah model PD-mu masih benar? Bandingkan roll-rate aktual dengan roll-rate yang diprediksi model — selisihnya adalah drift yang harus diselidiki (pendalaman M7).",
        "Monitoring — jembatan singkat, bukan pengajaran penuh (itu modul M7). Yang dipantau dari scorecard: base-rate drift (apakah default rate populasi bergeser?), distribution drift per bin (apakah komposisi nasabah berubah?), PSI sebagai indikator, perubahan approval rate dan bad rate, serta calibration drift (apakah PD 0,20 masih berarti 20 persen?). PSI (Population Stability Index) = jumlah (actual − expected) × ln(actual/expected) per bin — makin besar, makin jauh populasi saat ini dari populasi latih.",
        "Band PSI: PSI < 0,1 stabil; 0,1 ≤ PSI < 0,25 waspada; PSI ≥ 0,25 drift besar.",
        "Contoh drift yang BENAR [notebook]: share PAY_0 = 2 naik dari 8,89% menjadi 12% → PSI 0,0104 — stabil, di bawah 0,1. (Catatan koreksi: angka 4,9% yang sempat tertulis di laporan gap untuk share awal ini SALAH — share sebenarnya 8,89%, yaitu 2.667 dari 30.000 nasabah.) Contoh lain: mean PD test 0,2217 naik menjadi 0,29 [ilustrasi] — itu calibration drift yang harus diselidiki, bukan sekadar «model memburuk». Lab 2 menghitung PSI dari dua tabel proporsi sintetis: expected [0,60; 0,25; 0,15] vs actual [0,52; 0,28; 0,20] → PSI 0,0292 — stabil. Kapan threshold dan scorecard perlu dikaji ulang? Bila PSI melewati 0,25, atau bad rate bergerak jauh dari yang diprediksi, atau calibration gap membesar — ketiganya adalah trigger review, bukan vonis otomatis. Bedakan tiga drift: performance drift (metrik model memburuk), population drift (komposisi nasabah berubah — yang diukur PSI), dan calibration drift (PD tidak lagi jujur) — ketiganya bisa terjadi sendiri-sendiri.",
        "Baris matriks dengan n kecil? Jangan dibaca — laporkan n-nya dan lanjutkan ke baris berikutnya.",
        "Peta M2.5 — apa yang menanti. Reject inference: model hanya pernah melihat pinjaman yang disetujui — bagaimana menginferensi outcome pelamar yang ditolak, dan kenapa tidak ada obat yang sempurna. Peta konsep saja — pengajaran penuhnya di lesson berikut.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar berkelompok expected vs actual tiga bin: 0,60 vs 0,52; 0,25 vs 0,28; 0,15 vs 0,20; PSI 0,0292">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Drift populasi: expected (train) vs actual (current)</text>
<text x="240" y="32" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">PSI = 0,0292 — di bawah 0,1: stabil [ilustrasi]</text>
<line x1="52" y1="46" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="155.7" x2="52" y2="155.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="158.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,2</text>
<line x1="48" y1="105.4" x2="52" y2="105.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="108.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,4</text>
<line x1="48" y1="55.1" x2="52" y2="55.1" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="58.1" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,6</text>
<rect x="65" y="55.1" width="52" height="150.9" fill="var(--c1)"/>
<text x="91" y="49.1" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,60</text>
<rect x="125" y="75.3" width="52" height="130.7" fill="var(--c2)"/>
<text x="151" y="69.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,52</text>
<text x="121" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Bin 1</text>
<rect x="203" y="143.1" width="52" height="62.9" fill="var(--c1)"/>
<text x="229" y="137.1" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,25</text>
<rect x="263" y="135.6" width="52" height="70.4" fill="var(--c2)"/>
<text x="289" y="129.6" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,28</text>
<text x="259" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Bin 2</text>
<rect x="341" y="168.3" width="52" height="37.7" fill="var(--c1)"/>
<text x="367" y="162.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,15</text>
<rect x="401" y="155.7" width="52" height="50.3" fill="var(--c2)"/>
<text x="427" y="149.7" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,20</text>
<text x="397" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">Bin 3</text>
<text x="240" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">biru = expected (train) · hijau = actual (current)</text>
</svg>`,
        alt: "Bar berkelompok expected vs actual tiga bin: 0,60 vs 0,52; 0,25 vs 0,28; 0,15 vs 0,20; PSI 0,0292.",
        caption: "Cara membaca: tiap bin punya dua bar — expected (train, biru) dan actual (current, hijau). Interpretasi: pergeserannya kecil — PSI 0,0292, di bawah 0,1: stabil. Bila satu bin bergeser jauh, PSI membesar dan scorecard perlu dikaji ulang.",
      },
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: nasabah telat 2 bulan di Agustus — apa yang terjadi di September dan Oktober?",
      prose: [
        "Seorang nasabah telat 2 bulan di Agustus (PAY_2 = 2). Tiga pertanyaan: (1) berapa peluang ia memburuk ke PAY_0 ≥ 2 di September? (2) berapa peluang ia default di Oktober? (3) stage berapa ia di September, dan berapa ECL-nya?",
        "(1) Roll ke PAY_0 ≥ 2 dari status Agustus: 0,4744 [notebook] — hampir setengah. Rinciannya dari matriks Agustus–September: tetap 2 (0,4051) + ke 3 (0,0693) = 0,4744. (2) Default Oktober untuk kelompok ini: 0,5561 [notebook] — lebih dari separuh. (3) Bila di September ia tercatat PAY_0 = 2, ia masuk Stage 2 — ECL per nasabah NT$34.035 (PD 1 bln), atau NT$41.413 bila memakai PD lifetime ilustrasi 0,85.",
        "Bandingkan dengan nasabah current di Agustus: roll ke ≥ 2 hanya 0,0388, default Oktober 0,1627. Selisihnya — 0,4744 vs 0,0388 — adalah alasan bank menelepon nasabah yang telat 2 bulan jauh sebelum ia default. Roll-rate bukan statistik pajangan; ia adalah jadwal penagihan.",
        "Satu kehati-hatian: angka-angka ini adalah rata-rata kelompok — nasabah individual bisa sembuh (0,0998 dari bucket 2 kembali current di September; sisa baris: 0,4258 ke bucket 1) atau memburuk. Keputusan per nasabah tetap memakai PD modelnya; roll-rate dipakai untuk perencanaan portofolio dan penentuan stage.",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 11 · Guided task di Colab",
      title: "Guided task di Colab: vintage, roll-rate, dan ECL di data UCI",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m24-guided-task.ipynb.",
        "Di notebook itu kamu membangun kohort dari PAY_6 dan menghitung default rate tiap kohort, membangun matriks roll-rate 5 bucket dari 5 transisi bulan (termasuk menemukan quirk PAY = 1 sendiri), menerapkan staging IFRS 9, dan menghitung total ECL dengan koreksi Stage 3 — lengkap dengan checks yang menegaskan tiap langkah.",
        "Tautan Colab:",
        "Buka di Colab: https://colab.research.google.com/drive/1tGsOY-Wpy9nQYeVVbDvTVvI5AFUEtHRw",
        "Jalur file notebook: colab/mlf-m24-guided-task.ipynb.",
        "Companion full-code untuk topik yang memetakan ke proyek nyata: notebook credit scoring end-to-end di Colab: https://colab.research.google.com/drive/1bU3Kpgngs2wpeCNbiN5DRe8ElEGV_xxO — di sana stress test dan policy simulator memakai logika yang sama dengan lesson ini.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 12 · Checkpoint",
      title: "Checkpoint: kredit yang menua",
      prose: [
        "Rangkuman: vintage membandingkan kohort (current 0,1867 vs 4+ 0,7132) — dengan caveat tanpa tanggal origination. Roll-rate mengukur migrasi (4+ bertahan 0,6450; baris bucket 1 n = 34 jangan dibaca). IFRS 9: Stage 1 PD 12m, Stage 2 PD lifetime, Stage 3 PD = 1 — total ECL 1 bln NT$457.366.208. ECL adalah akuntansi; EL adalah ekonomi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Kohort current (status April 2005) default di Oktober sebesar?",
          options: [
            { text: "0,5065", why: "Itu default kohort 2 (n = 2.766)." },
            { text: "0,1867", why: "Benar: 26.921 nasabah current di April, 18,67 persen default di Oktober.", correct: true },
            { text: "0,7132", why: "Itu default kohort 4+ (n = 129)." },
            { text: "0,2212", why: "Itu base rate seluruh dataset, bukan kohort current." },
          ],
        },
        {
          q: "Dari bucket 2, berapa peluang nasabah tetap di bucket 2 bulan depan?",
          options: [
            { text: "0,2534", why: "Itu peluang sembuh ke current." },
            { text: "0,5805", why: "Benar: 9.460 dari 16.297 transisi bertahan di bucket 2.", correct: true },
            { text: "0,0633", why: "Itu peluang memburuk ke bucket 3." },
            { text: "0,1028", why: "Itu peluang membaik ke bucket 1." },
          ],
        },
        {
          q: "Kenapa baris bucket 1 di matriks roll-rate tidak boleh dibaca?",
          options: [
            { text: "Karena rate-nya 1,0000 — terlalu sempurna", why: "Rate 1,0000 itu akibat n yang kecil, bukan penyebabnya — penyebabnya adalah n total hanya 34." },
            { text: "Karena n total baris itu hanya 34 — PAY = 1 hampir tidak ada Apr–Agu", why: "Benar: PAY = 1 tercatat 0–28 baris per bulan Apr–Agu, vs 3.688 di Sep. Baris dengan n = 34 adalah noise.", correct: true },
            { text: "Karena bucket 1 tidak ada di data", why: "Bucket 1 ada — 3.688 baris di September — tapi hampir tidak ada di bulan-bulan sebelumnya." },
            { text: "Karena bucket 1 selalu sembuh", why: "Tidak ada bukti itu — yang ada hanya 34 transisi yang tidak bisa dibaca." },
          ],
        },
        {
          q: "Stage 2 (PAY_0 = 2, 3): berapa ECL 1 bln per nasabah?",
          options: [
            { text: "NT$13.031", why: "Itu ECL per nasabah Stage 1." },
            { text: "NT$24.637", why: "Itu ECL per nasabah Stage 3 bila memakai PD observasi (yang salah)." },
            { text: "NT$34.035", why: "Benar: 2.088/2.989 × 0,45 × 108.269 = 34.035.", correct: true },
            { text: "NT$39.032", why: "Itu ECL per nasabah Stage 3 dengan PD = 1." },
          ],
        },
        {
          q: "Kenapa ECL Stage 3 memakai PD = 1, bukan PD observasi 0,6312?",
          options: [
            { text: "Karena 0,6312 terlalu kecil untuk dilaporkan", why: "Bukan soal besar-kecil — soal status: nasabah Stage 3 sudah impaired." },
            { text: "Karena nasabah Stage 3 sudah impaired — kerugiannya sudah terjadi, bukan peluang", why: "Benar: Stage 3 berarti default sudah terjadi; ECL-nya memakai PD = 1, bukan peluang default.", correct: true },
            { text: "Karena IFRS 9 melarang memakai data observasi", why: "IFRS 9 justru memakai data observasi — tapi untuk Stage 3, PD-nya didefinisikan 1." },
            { text: "Karena n Stage 3 terlalu kecil (141)", why: "n kecil bukan alasan — PD = 1 adalah definisi Stage 3, bukan koreksi sampling." },
          ],
        },
        {
          q: "Berapa total ECL 1 bln (Stage 3 dengan PD = 1)?",
          options: [
            { text: "NT$455.336.548", why: "Itu total bila Stage 3 memakai PD observasi 0,6312 — tanpa koreksi." },
            { text: "NT$457.366.208", why: "Benar: 350.133.169 + 101.729.540 + 5.503.500.", correct: true },
            { text: "NT$350.133.169", why: "Itu hanya ECL Stage 1." },
            { text: "NT$78.675.378", why: "Itu EL baseline stress test (test set 6.000) — bukan total ECL staging." },
          ],
        },
        {
          q: "Dari bucket 2, berapa peluang nasabah MEMBURUK ke bucket 3 atau 4+ bulan depan?",
          options: [
            { text: "0,5805", why: "Itu peluang TETAP di bucket 2 — bukan memburuk." },
            { text: "0,2534", why: "Itu peluang sembuh ke current." },
            { text: "0,0633", why: "Benar: ke bucket 3 sebesar 0,0633 + ke 4+ sebesar 0,0000 = 0,0633 — peluang memburuk adalah jumlah sel tujuan yang lebih buruk.", correct: true },
            { text: "0,1661", why: "Itu 0,0633 + 0,1028 — 0,1028 adalah peluang membaik ke bucket 1, bukan memburuk." },
          ],
        },
        {
          q: "Kohort 4+ default 0,7132 (n = 129) vs kohort current 0,1867 (n = 26.921). Mengapa 0,7132 belum tentu bukti yang lebih kuat?",
          options: [
            { text: "Karena 0,7132 lebih besar dari 0,1867", why: "Besarnya rate bukan ukuran kekuatan bukti — ukuran n-nya." },
            { text: "Karena interval Wilson 4+ selebar 0,1543 [0,6299; 0,7842] — ketidakpastiannya jauh lebih besar", why: "Benar: n = 129 memberi interval selebar 0,1543, sementara current (n = 26.921) intervalnya jauh lebih sempit. Rate tinggi dari n kecil adalah estimasi yang berisik.", correct: true },
            { text: "Karena kohort 4+ bukan vintage sejati", why: "Itu benar sebagai caveat — tapi alasan utamanya di sini adalah lebar interval dari n kecil." },
            { text: "Karena 92 default dari 129 terlalu sedikit untuk dihitung", why: "92 default cukup untuk dihitung — masalahnya lebar intervalnya, bukan tidak bisa dihitung." },
          ],
        },
      ],
      summary: [
        "Vintage: kohort current 0,1867 vs kohort 4+ 0,7132 — dengan caveat tanpa tanggal origination.",
        "Roll-rate: 4+ bertahan 0,6450; baris bucket 1 (n = 34) jangan dibaca — quirk PAY = 1.",
        "Roll ke ≥ 2 dari Agustus: current 0,0388 vs bucket 2: 0,4744 — dan default Oktober 0,1627 vs 0,5561.",
        "IFRS 9: Stage 1 (PD 12m), Stage 2 (PD lifetime), Stage 3 (PD = 1); total ECL 1 bln NT$457.366.208.",
        "ECL = akuntansi (staging + aturan); EL = ekonomi (keputusan bisnis).",
        "Wilson 95%: n kecil berarti interval lebar — 34/34 memberi [0,8985; 1,0000], bukan kepastian.",
        "PSI: < 0,1 stabil, 0,1–0,25 waspada, > 0,25 drift besar; share PAY_0 = 2 naik 8,89% → 12% memberi PSI 0,0104.",
      ],
      next: { label: "Lanjut: MLF-M2.5 — Reject Inference (USP)", href: "/v2/learn/mlf-m25-reject-inference" },
    },
  ],
};
