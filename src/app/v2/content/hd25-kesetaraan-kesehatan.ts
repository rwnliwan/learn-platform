import type { V2Lesson } from "../lib/types";

// ── Figure: kurva konsentrasi stunting per kuintil kekayaan (sintetis) ────
const CONC_SVG = `<svg viewBox="0 0 520 280" role="img" aria-label="Kurva konsentrasi di atas diagonal: 20 persen termiskin menanggung 28 persen kasus stunting">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="56" y1="216" x2="480" y2="216"/>
<line x1="56" y1="166" x2="480" y2="166"/><line x1="56" y1="116" x2="480" y2="116"/>
<line x1="56" y1="66" x2="480" y2="66"/><line x1="56" y1="16" x2="480" y2="16"/>
</g>
<line x1="56" y1="216" x2="480" y2="16" stroke="var(--chart-text)" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.7"/>
<text x="470" y="34" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">garis kesetaraan</text>
<polyline points="56,216 140.8,159.3 225.6,111.5 310.4,71.2 395.2,38.4 480,16" fill="none" stroke="var(--c1)" stroke-width="3"/>
<g fill="var(--c1)">
<circle cx="140.8" cy="159.3" r="5"/><circle cx="225.6" cy="111.5" r="5"/>
<circle cx="310.4" cy="71.2" r="5"/><circle cx="395.2" cy="38.4" r="5"/>
</g>
<text x="150" y="150" font-size="11" fill="var(--text)" font-family="var(--font-ui)">20% termiskin: 28% kasus</text>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<text x="280" y="238">pangsa kumulatif populasi (termiskin ke terkaya)</text>
<text x="98" y="216">0%</text><text x="182" y="216">20%</text><text x="268" y="216">40%</text>
<text x="352" y="216">60%</text><text x="438" y="216">80%</text>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">
<text x="30" y="120" transform="rotate(-90 30 120)" text-anchor="middle">pangsa kumulatif stunting</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="470" y="258">data sintetis</text>
</g>
</svg>`;

export const hd25: V2Lesson = {
  slug: "hd25-kesetaraan-kesehatan",
  track: "Health Data Science",
  module: "Ketimpangan Kesehatan",
  title: "Health Equity & SDOH: Mengukur Ketimpangan yang Tak Terlihat",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua kabupaten, satu angka rata-rata, dua kenyataan",
      prose: [
        "Dinas Kesehatan menerima laporan tahunan: Kabupaten A dan Kabupaten B sama-sama mencatat prevalensi stunting 27%. Kepala dinas mengangguk puas — target tercapai, kedua kabupaten “sama baiknya”. Lalu seorang analis muda memecah angka itu per kuintil kekayaan. Di Kabupaten A: 38% anak termiskin stunting, 15% anak terkaya stunting. Di Kabupaten B: 27% di semua kuintil — merata.",
        "Twist-nya: angka rata-rata yang sama menyembunyikan dua dunia yang berbeda. Di Kabupaten B, intervensi massal yang merata masuk akal. Di Kabupaten A, intervensi yang sama akan gagal total — karena masalahnya bukan “27%”, melainkan jurang 23 poin antara si miskin dan si kaya. Kepala dinas yang hanya membaca rata-rata akan mengirim bantuan yang salah ke tempat yang salah. Lesson ini tentang alat ukur yang membuat ketimpangan tak terlihat menjadi terlihat — dan bisa ditindaklanjuti: social determinants of health (SDOH), rate ratio, concentration index, dan indeks Kakwani.",
        "Konteks Indonesia-nya nyata: studi ekuitas pembiayaan kesehatan Indonesia 2015–2019 (Cheng dkk., diterbitkan 2022, memakai data SUSENAS dan IFLS) menemukan sistem pembiayaan yang progresif pada 2015–2018 berubah menjadi sedikit regresif pada 2019 — orang miskin menanggung proporsi beban lebih besar dari pendapatannya. Tanpa alat ukur ketimpangan, pergeseran itu tidak akan pernah terdeteksi dari angka rata-rata belanja kesehatan nasional.",
      ],
      tasks: [],
      note: {
        title: "Beda dengan HD13 — jangan tertukar",
        type: "risk",
        body: "HD13 membahas fairness MODEL AI (apakah algoritma merugikan grup tertentu). Lesson ini membahas PENGUKURAN ketimpangan kesehatan di populasi (seberapa besar jurang antara kaya dan miskin, dan apakah melebar). Keduanya memakai kata “keadilan”, tetapi objeknya beda: yang satu mengaudit model, yang satu mengukur dunia.",
      },
      reference: "Rata-rata menyembunyikan distribusi. Ketimpangan harus diukur — baru bisa dikelola.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan kerangka SDOH",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan kerangka social determinants of health (SDOH) WHO dan memetakan sebuah ketimpangan ke determinan struktural vs perantaranya; (2) menghitung dan menafsirkan rate ratio dan rate difference — serta menjelaskan kapan keduanya bercerita berbeda; (3) menghitung concentration index dari data kuintil memakai rumus kovarians dan membaca kurva konsentrasi; (4) menafsirkan indeks Kakwani untuk progresivitas pembiayaan kesehatan memakai temuan nyata Indonesia 2015–2019.",
        "Rutenya: cerita → tujuan + kerangka SDOH → tiga konsep (SDOH, rate ratio/difference, concentration index + Kakwani) → lab Pyodide (hitung C dari data sintetis) → kurva konsentrasi dengan panduan baca → peta keputusan pemilihan metrik → mini-case pembiayaan kesehatan Indonesia → kuis → rangkuman. Estimasi 60 menit.",
        "Kerangka SDOH (WHO): kesehatan dibentuk oleh “kondisi tempat orang dilahirkan, tumbuh, hidup, bekerja, dan menua” — bukan cuma oleh layanan kesehatan. Determinan struktural (konteks sosial-ekonomi-politik: tata kelola, kebijakan, posisi sosial-ekonomi seperti pendidikan, pekerjaan, pendapatan) membentuk determinan perantara (kondisi material seperti perumahan dan pangan, faktor perilaku, faktor psikososial, dan sistem kesehatan itu sendiri). Analis ketimpangan selalu bertanya: apakah jurang yang saya ukur lahir dari determinan struktural (butuh kebijakan) atau perantara (bisa diintervensi program)?",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: ketimpangan kesehatan hampir selalu mengikuti gradien sosial — bukan cuma “miskin vs kaya”, melainkan tangga bertingkat di setiap level. Kalau datamu hanya membandingkan dua ekstrem, kamu kehilangan bentuk tangganya.",
      ],
      reference: "SDOH: struktural (kebijakan, posisi sosial-ekonomi) -> perantara (material, perilaku, sistem kesehatan) -> outcome.",
    },
    {
      id: "konsep-sdoh",
      eyebrow: "Langkah 3 · Konsep",
      title: "SDOH — peta jalan dari jurang ke akar",
      prose: [
        "Definisi: social determinants of health adalah kondisi non-medis yang memengaruhi outcome kesehatan — tempat lahir, tumbuh, hidup, bekerja, menua — beserta sistem yang membentuknya (kebijakan ekonomi, norma sosial, politik). WHO membaginya dua lapis: determinan struktural (konteks sosioekonomi-politik dan posisi sosial-ekonomi: pendidikan, pekerjaan, pendapatan, gender, etnisitas) dan determinan perantara (keadaan material, perilaku, faktor biologis, sistem kesehatan). Ketimpangan yang sistematis, dapat dihindari, dan tidak adil antar grup sosial inilah yang disebut health inequity — beda dari inequality biasa yang mungkin tak terhindarkan (mis. risiko kesehatan menurut umur).",
        "Kepribadiannya: SDOH adalah detektif yang menolak berhenti di TKP. Ia melihat anak stunting dan bertanya bukan “kurang gizi apa?” melainkan “kenapa keluarga ini tidak bisa mengakses pangan bergizi? — ibunya putus sekolah di SMP (struktural: pendidikan), ayahnya buruh harian tanpa jaminan (struktural: pekerjaan), rumah tanpa air bersih (perantara: material), puskesmas 8 km tanpa transport (perantara: sistem kesehatan)”. Satu outcome, rantai kausal berlapis — dan tiap lapis menuntut intervensi berbeda.",
        "Kapan memakai: kerangka SDOH dipakai saat kamu sudah MENGUKUR ketimpangan (langkah 4–5) dan beralih ke “mengapa dan apa yang dilakukan”. Ia mencegah jebakan solusi tunggal: membagikan suplemen gizi tanpa menyentuh akses pangan dan pendidikan ibu hanya menambal gejala.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Ketimpangan kesehatan = orang miskin berperilaku tidak sehat”",
        type: "pitfall",
        body: "Yang benar: perilaku adalah determinan PERANTARA — ia sendiri dibentuk oleh determinan struktural. Menyalahkan perilaku (“mereka malas ke puskesmas”) menghentikan analisis tepat di titik yang paling dangkal. Analis yang baik selalu menarik satu lapis lebih dalam: perilaku apa yang bahkan tidak menjadi pilihan bagi grup ini?",
      },
      hints: [
        "💡 Intuisi: uji cepat sebuah klaim ketimpangan — tanyakan “apakah jurang ini akan hilang jika grup bawah diberi uang?” Kalau ya, akarnya struktural-ekonomi. Kalau tidak, cari di norma, geografi, atau sistem layanan.",
      ],
      reference: "Inequality = perbedaan terukur. Inequity = perbedaan yang sistematis, dapat dihindari, dan tidak adil.",
    },
    {
      id: "konsep-rate",
      eyebrow: "Langkah 4 · Konsep",
      title: "Rate ratio & rate difference — dua lensa yang bisa bertengkar",
      prose: [
        "Definisi: untuk membandingkan outcome kesehatan antar dua grup (mis. kuintil termiskin vs terkaya), ada dua ukuran baku. Rate ratio (RR) = rate_grup_bawah / rate_grup_atas — ukuran RELATIF (“berapa kali lipat”). Rate difference (RD) = rate_grup_bawah − rate_grup_atas — ukuran ABSOLUT (“selisih berapa poin”). Keduanya sah, tetapi bisa bercerita berbeda — dan analis wajib melaporkan keduanya.",
        "Kepribadiannya: RR adalah jurnalis headline (“2,5 kali lipat!”), RD adalah bendahara (“selisih 23 anak per 100”). Jebakan klasik: program yang menurunkan stunting di SEMUA kuintil — miskin 38%→30%, kaya 15%→10% — membuat RD menyusut (23→20 poin, kabar baik) tetapi RR MEMBESAR (2,53→3,00, kabar buruk). Keduanya benar secara matematis! Inilah kenapa pedoman pelaporan ketimpangan mewajibkan keduanya: headline tanpa bendahara menipu, bendahara tanpa headline menumpulkan urgensi.",
        "Kapan memakai: RR untuk advokasi dan perbandingan antar konteks (relatif terhadap baseline), RD untuk perencanaan (“berapa kasus ekstra yang harus dicegah di grup bawah”). Aturan: jika RR dan RD bergerak berlawanan arah, jelaskan keduanya — jangan pilih yang mendukung narasimu.",
      ],
      formula: String.raw`\text{Rate Ratio} = \frac{R_{\text{bawah}}}{R_{\text{atas}}} \qquad \text{Rate Difference} = R_{\text{bawah}} - R_{\text{atas}}`,
      formulaNote: "R_bawah = rate outcome di grup paling dirugikan (mis. prevalensi stunting kuintil termiskin = 38%); R_atas = rate di grup paling diuntungkan (kuintil terkaya = 15%). Contoh: RR = 38/15 ≈ 2,53 — anak termiskin 2,53 kali lebih mungkin stunting. RD = 38 − 15 = 23 poin persentase — ada 23 kasus ekstra per 100 anak di grup termiskin. Interpretasi ganda inilah yang wajib dilaporkan berpasangan.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “RR turun = ketimpangan membaik, titik”",
        type: "pitfall",
        body: "Yang benar: RR bisa turun sementara RD naik — mis. kedua grup naik tetapi grup atas naik lebih cepat (ketimpangan absolut melebar walau relatif menyempit). “Membaik” tidak bisa diputuskan dari satu lensa. Selalu tampilkan RR dan RD berdampingan, plus tren keduanya.",
      },
      hints: [
        "💡 Intuisi: RR sensitif terhadap baseline rendah (dari 1% ke 2% = “naik 2x lipat” padahal cuma 1 poin). RD sensitif terhadap skala masalah. Pasangan ini saling mengoreksi kelemahan masing-masing.",
      ],
      reference: "Laporkan RR dan RD berpasangan. Kalau keduanya bertengkar, ceritakan pertengkarannya.",
    },
    {
      id: "konsep-ci",
      eyebrow: "Langkah 5 · Konsep",
      title: "Concentration index & Kakwani — satu angka untuk seluruh tangga",
      prose: [
        "Definisi: concentration index (C) mengukur ketimpangan outcome kesehatan di SELURUH gradien sosial-ekonomi — bukan cuma dua ekstrem. Caranya: urutkan populasi dari termiskin ke terkaya, plot pangsa kumulatif outcome (kurva konsentrasi) melawan pangsa kumulatif populasi. C = dua kali luas antara kurva dan garis diagonal kesetaraan, rentang −1 sampai +1. Untuk outcome buruk (stunting, kematian): C negatif = terkonsentrasi di si miskin; C positif = terkonsentrasi di si kaya; C = 0 = merata. Rumus praktisnya elegan: C = 2·cov(h, r)/μ — dua kali kovarians antara status kesehatan (h) dan peringkat fraksional kekayaan (r), dibagi rata-rata.",
        "Kepribadiannya: jika RR/RD adalah foto dua orang di ujung tangga, concentration index adalah video seluruh tangga. Ia menangkap pola yang luput dari perbandingan ekstrem — mis. ketimpangan yang menumpuk di kelas menengah bawah. Kakwani index (K = C_pembayaran − G_pendapatan) adalah sepupunya untuk pembiayaan: selisih antara concentration index pembayaran kesehatan dan koefisien Gini pendapatan. K > 0 = progresif (kaya membayar proporsi lebih besar dari pendapatannya), K < 0 = regresif (miskin terbebani lebih besar).",
        "Kapan memakai: C untuk outcome kesehatan (siapa yang sakit), K untuk pembiayaan (siapa yang membayar). Keduanya adalah bahasa standar ekonomi kesehatan global — dipakai Bank Dunia, WHO, dan studi ekuitas nasional.",
      ],
      formula: String.raw`C = \frac{2 \cdot \mathrm{cov}(h, r)}{\mu} \qquad K = C_{\text{pembayaran}} - G_{\text{pendapatan}}`,
      formulaNote: "h = indikator kesehatan per individu/grup (mis. prevalensi stunting per kuintil); r = peringkat fraksional di distribusi kesejahteraan (0 termiskin → 1 terkaya; untuk data kuintil: 0,1; 0,3; 0,5; 0,7; 0,9); μ = rata-rata h; cov = kovarians. Contoh (data sintetis): h = [38, 32, 27, 22, 15]%, μ = 26,8 → cov(h,r) = −2,24 → C = 2×(−2,24)/26,8 ≈ −0,167. Interpretasi: stunting terkonsentrasi di si miskin dengan derajat sedang (17% dari maksimum teoretis). K: mis. C_pembayaran = 0,45 dan G = 0,38 → K = +0,07 (progresif ringan).",
      tasks: [],
      note: {
        title: "🚨 Mitos: “C = 0 berarti adil”",
        type: "pitfall",
        body: "Yang benar: C = 0 berarti outcome terdistribusi MERATA menurut peringkat kekayaan — tetapi belum tentu adil. Jika si miskin butuh layanan lebih banyak (need lebih besar) namun menerima proporsi yang sama, maka “merata” justru tidak adil (prinsip horizontal equity: perlakuan sama untuk kebutuhan sama; vertical equity: perlakuan berbeda untuk kebutuhan berbeda). C mengukur ketimpangan, bukan keadilan — keadilan butuh pembanding kebutuhan.",
      },
      hints: [
        "💡 Intuisi: tanda C memberi tahu ARAH (siapa yang menanggung), besarnya memberi tahu DERAJAT. C = −0,167 untuk stunting = “menumpuk di si miskin, derajat sedang”. Selalu laporkan keduanya — arah tanpa derajat = alarm tanpa volume.",
        "💡 Intuisi kedua: kurva konsentrasi di ATAS diagonal untuk outcome buruk (si miskin menanggung lebih dulu), di BAWAH diagonal untuk outcome baik (mis. cakupan imunisasi — si kaya menikmati lebih dulu).",
      ],
      reference: "C: −1 s.d. +1, tanda = arah, besar = derajat. K = C − G: positif = progresif, negatif = regresif.",
    },
    {
      id: "lab-ci",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Hitung concentration index dari nol",
      prose: [
        "Waktunya mengukur sendiri. Data di bawah adalah prevalensi stunting per kuintil kekayaan — SINTETIS, diberi label jelas (pola meniru survei nyata, angka dibuat untuk latihan). Tugasmu: hitung rata-rata, kovarians dengan peringkat fraksional, concentration index, lalu rate ratio dan rate difference sebagai pembanding.",
        "Coba: setelah lolos, ubah prevalensi kuintil tengah (Q3) dari 27 menjadi 35 — jurang ekstrem sama, tetapi tangga berubah bentuk. Apa yang terjadi pada C vs RR? Itulah keunggulan C: ia merasakan seluruh tangga, bukan cuma ujungnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mu` = rata-rata prevalensi" },
        { id: "t2", text: "Hitung `cov_hr` = kovarians(h, r) dengan r = [0.1, 0.3, 0.5, 0.7, 0.9]" },
        { id: "t3", text: "Hitung `C` = 2*cov_hr/mu, `RR` = h[0]/h[4], `RD` = h[0]-h[4]" },
        { id: "t4", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "mu=26.8 cov=-2.240 C=-0.167\nRR=2.53 (relatif) RD=23.0 poin (absolut)\ninterpretasi: stunting terkonsentrasi di si miskin, derajat sedang",
      code: {
        starter: `# Prevalensi stunting (%) per kuintil kekayaan — DATA SINTETIS untuk latihan
h = [38, 32, 27, 22, 15]   # Q1 (termiskin) s.d. Q5 (terkaya)
r = [0.1, 0.3, 0.5, 0.7, 0.9]  # peringkat fraksional

# TULIS KODEMU
mu =
cov_hr =
C =
RR =
RD =

print(f"mu={mu:.1f} cov={cov_hr:.3f} C={C:.3f}")
print(f"RR={RR:.2f} (relatif) RD={RD:.1f} poin (absolut)")
print("interpretasi: stunting terkonsentrasi di si miskin, derajat sedang")`,
        lockLines: 3,
        solution: `# Prevalensi stunting (%) per kuintil kekayaan — DATA SINTETIS untuk latihan
h = [38, 32, 27, 22, 15]   # Q1 (termiskin) s.d. Q5 (terkaya)
r = [0.1, 0.3, 0.5, 0.7, 0.9]  # peringkat fraksional

# TULIS KODEMU
mu = sum(h) / len(h)
cov_hr = sum((hi - mu) * (ri - 0.5) for hi, ri in zip(h, r)) / len(h)
C = 2 * cov_hr / mu
RR = h[0] / h[4]
RD = h[0] - h[4]

print(f"mu={mu:.1f} cov={cov_hr:.3f} C={C:.3f}")
print(f"RR={RR:.2f} (relatif) RD={RD:.1f} poin (absolut)")
print("interpretasi: stunting terkonsentrasi di si miskin, derajat sedang")`,
        checks: [
          { kind: "equal", task: "t1", name: "mu", value: 26.8, tol: 1e-9, label: "`mu` = 26,8", msg: "(38+32+27+22+15)/5 = 26,8." },
          { kind: "equal", task: "t2", name: "cov_hr", value: -2.24, tol: 1e-9, label: "`cov_hr` = −2,240", msg: "Kovarians negatif: makin kaya (r besar), makin rendah stunting." },
          { kind: "equal", task: "t3", name: "C", value: -0.1672, tol: 0.001, label: "`C` = −0,167", msg: "2×(−2,24)/26,8 = −0,167: terkonsentrasi di si miskin, derajat sedang." },
          { kind: "equal", task: "t3", name: "RR", value: 2.5333, tol: 0.001, label: "`RR` = 2,53", msg: "38/15 = 2,53." },
          { kind: "equal", task: "t3", name: "RD", value: 23.0, tol: 1e-9, label: "`RD` = 23 poin", msg: "38 − 15 = 23." },
          { kind: "stdout_matches", task: "t4", pattern: "C=-0\\.167", label: "Ringkasan tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: ukur jurangnya, jangan kagumi rata-ratanya",
        body: "Analis ketimpangan yang berpengalaman tidak pernah berhenti di angka rata-rata — ia langsung memecahnya. Heuristik lapangannya: pertama, selalu tampilkan distribusi sebelum rata-rata; dua kabupaten dengan stunting 27% bisa berarti “merata 27%” atau “jurang 38% vs 15%” — dan intervensinya berlawanan arah. Kedua, laporkan RR dan RD berpasangan dan ceritakan saat keduanya bertengkar; memilih satu yang mendukung narasimu adalah cherry-picking. Ketiga, untuk tren waktu, pakai concentration index — ia merasakan pergeseran di tengah tangga yang luput dari perbandingan dua ekstrem. Keempat, tetapkan metrik primer SEBELUM melihat data; mengganti metrik setelah melihat hasil adalah fiksi, bukan evaluasi. Kelima, curigai angka yang terlihat bagus: “OOP progresif” bisa berarti si miskin menahan diri berobat — selalu baca metrik pembiayaan bersama metrik akses dan unmet need. Dan yang terakhir: ketimpangan yang tidak diukur dengan benar tidak bisa diperbaiki dengan benar — setiap rupiah intervensi yang salah sasaran adalah rupiah yang tidak sampai ke anak yang paling membutuhkan. Ketujuh, bedakan inequality dari inequity — tidak semua perbedaan adalah ketidakadilan (risiko menurut umur itu alamiah); fokuskan advokasimu pada jurang yang sistematis, dapat dihindari, dan tidak adil, karena di sanalah kebijakan bisa mengubah nasib.",
      },
      reference: "C = 2 cov(h,r) / mu. Tanda = arah, besar = derajat. Selalu dampingi dengan RR + RD.",
    },
    {
      id: "chart-konsentrasi",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca kurva konsentrasi",
      prose: [
        "Chart di bawah memplot kurva konsentrasi dari data lab-mu.",
        "Cara membaca: sumbu X = pangsa kumulatif populasi, diurutkan dari termiskin (kiri) ke terkaya (kanan); sumbu Y = pangsa kumulatif kasus stunting. Garis diagonal putus-putus = kesetaraan sempurna (20% populasi menanggung 20% kasus). Kurva solid = data sesungguhnya.",
        "Interpretasi: kurva berada DI ATAS diagonal — untuk outcome buruk, ini berarti kasus terkonsentrasi di si miskin: 20% termiskin menanggung 28% kasus, 40% termiskin menanggung 52% kasus. Luas antara kurva dan diagonal (dikalikan 2) = |C| = 0,167. Pelajaran chart: semakin jauh kurva melengkung dari diagonal, semakin besar ketimpangan. Dan arah lengkungan memberi tahu siapa yang menanggung — di atas diagonal untuk penyakit (beban di si miskin), di bawah diagonal untuk layanan baik seperti imunisasi (manfaat dinikmati si kaya lebih dulu).",
      ],
      figure: {
        svg: CONC_SVG,
        alt: "Kurva konsentrasi di atas garis diagonal: 20 persen termiskin menanggung 28 persen kasus stunting.",
        caption: "Kurva konsentrasi stunting (data sintetis). Di atas diagonal = terkonsentrasi di si miskin; luas area = |C|/2.",
      },
      tasks: [],
      reference: "Di atas diagonal = beban di si miskin (outcome buruk). Jarak dari diagonal = derajat ketimpangan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Metrik mana untuk pertanyaan mana",
      prose: [
        "Lima skenario pemilihan metrik:",
        "Skenario 1 — “Seberapa besar jurang antara si miskin dan si kaya?” → Rate ratio + rate difference berpasangan. Alasan: pertanyaan dua-grup dijawab paling komunikatif oleh RR (relatif) dan RD (absolut); keduanya wajib tampil bersama.",
        "Skenario 2 — “Apakah ketimpangannya melebar dari waktu ke waktu?” → Concentration index + tren RR/RD. Alasan: C menangkap seluruh distribusi sehingga tidak tertipu pergeseran di tengah tangga; tren tiga metrik memberi gambaran lengkap.",
        "Skenario 3 — “Apakah pembiayaan kesehatannya adil?” → Indeks Kakwani (K = C_pembayaran − G). Alasan: pertanyaan tentang BEBAN pembayaran relatif terhadap kemampuan membayar — hanya K yang menjawabnya langsung.",
        "Skenario 4 — “Grup mana yang paling tertinggal?” → Analisis stratifikasi per kuintil/wilayah/gender (tabel + chart). Alasan: metrik ringkas menyembunyikan LOKASI masalah; stratifikasi menunjuk ke mana intervensi harus pergi.",
        "Skenario 5 — “Apakah programku mengurangi ketimpangan?” → RD absolut sebagai outcome utama, RR sebagai pendamping. Alasan: program dinilai dari kasus yang dicegah (absolut); RR bisa memburuk sementara RD membaik — jangan biarkan headline relatif membunuh program yang sebenarnya bekerja.",
        "Aturan praktis 10 detik: dua grup → RR+RD; seluruh tangga → C; siapa membayar → K; di mana masalahnya → stratifikasi; evaluasi program → RD dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih metrik yang membuat program terlihat bagus (cherry-picking metrik). Standarnya: tentukan metrik PRIMER sebelum melihat data, laporkan metrik pendamping apa pun hasilnya. Analis yang mengganti metrik setelah melihat hasil sedang menulis fiksi, bukan evaluasi.",
      },
      reference: "Metrik primer ditetapkan sebelum analisis. Pendamping dilaporkan apa pun hasilnya.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Pembiayaan kesehatan Indonesia: progresif yang menipu",
      prose: [
        "Skenario (angka NYATA dari studi Cheng dkk. 2022 — analisis 5 tahun data SUSENAS 2015–2019 dan IFLS): sekitar sepertiga pembiayaan kesehatan Indonesia berasal dari out-of-pocket (OOP) setiap tahunnya — 32,1% pada 2019, kontributor terbesar belanja kesehatan. Pajak langsung dan OOP tercatat PROGRESIF sepanjang 2015–2019; pajak tidak langsung regresif; iuran JKN (SHI) regresif kecuali 2017–2018. Sistem keseluruhan progresif pada 2015–2018 tetapi progresivitasnya menurun tiap tahun — dan menjadi sedikit regresif pada 2019. Cakupan JKN mencapai sekitar 84% populasi pada akhir 2019.",
        "Pertanyaan analisis: (1) Apa arti “sistem menjadi sedikit regresif pada 2019” dalam bahasa indeks Kakwani? (2) OOP tercatat progresif — kabar baik? (3) Jika kamu penasihat Kemenkes, intervensi pembiayaan apa yang paling tepat sasaran berdasarkan temuan ini?",
        "Pembahasan: (1) K agregat berubah dari positif (2015–2018) menjadi sedikit negatif (2019): orang miskin kini membayar proporsi pendapatannya LEBIH BESAR dibanding orang kaya — definisi regresif. Trennya lebih penting dari titiknya: progresivitas menurun tiap tahun selama 5 tahun. (2) TIDAK — dan ini twist studi tersebut: OOP yang “progresif” kemungkinan mencerminkan orang miskin MENAHAN DIRI dari layanan kesehatan yang dibutuhkan (unmet need), bukan kemurahan sistem. Orang miskin yang tidak berobat tidak membayar — terlihat “ringan bebannya” di statistik, padahal ia menanggung beban penyakitnya. Progresivitas semu ini adalah alasan kenapa metrik pembiayaan harus dibaca bersama metrik akses dan unmet need. (3) Prioritas: perkuat proteksi finansial untuk kelompok bawah — perluas cakupan dan kedalaman JKN (manfaat yang benar-benar dipakai si miskin), tekan porsi OOP (32% terlalu tinggi untuk keadilan), dan pantau unmet need sebagai metrik pendamping agar “progresif” tidak lagi menipu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kesalahan termahal di sini: melaporkan “OOP progresif, sistem cukup adil” ke pengambil kebijakan tanpa menyebut unmet need. Keputusan anggaran berbasis metrik setengah cerita bisa menghentikan program subsidi tepat saat dibutuhkan. Analis ketimpangan wajib menulis caveat-nya — terutama saat angkanya terlihat bagus.",
      },
      reference: "Sumber: Cheng dkk. 2022 (PMC8873956) — SUSENAS 2015–2019, IFLS, National Health Accounts Indonesia.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "SDOH: kesehatan dibentuk kondisi tempat orang dilahirkan, tumbuh, hidup, bekerja, menua — determinan struktural membentuk determinan perantara.",
        "Rate ratio (relatif) dan rate difference (absolut) wajib dilaporkan berpasangan — keduanya bisa bergerak berlawanan arah.",
        "Concentration index C = 2 cov(h,r) / mu (−1 s.d. +1): tanda = siapa menanggung, besar = derajat; kurva di atas diagonal = beban di si miskin.",
        "Indeks Kakwani K = C_pembayaran − G: positif = progresif, negatif = regresif. Indonesia: progresif 2015–2018, sedikit regresif 2019.",
        "Waspadai progresivitas semu: OOP yang “progresif” bisa berarti si miskin menahan diri berobat — selalu baca bersama metrik akses/unmet need.",
      ],
      quiz: [
        {
          q: "Apa perbedaan fokus HD25 dengan HD13 (fairness AI)?",
          options: [
            { text: "HD25 mengukur ketimpangan kesehatan di populasi (concentration index, Kakwani); HD13 mengaudit keadilan model AI", why: "Benar: objeknya beda — yang satu mengukur dunia (berapa besar jurang kaya-miskin), yang satu mengaudit model (apakah algoritma merugikan grup tertentu).", correct: true },
            { text: "Keduanya sama — hanya beda istilah", why: "Salah: metrik, data, dan keputusan yang dihasilkan berbeda total. Menyamakannya membuat analis memakai alat yang salah." },
            { text: "HD25 tentang model, HD13 tentang populasi", why: "Salah: terbalik. HD25 = populasi, HD13 = model." },
            { text: "HD25 tidak memakai metrik kuantitatif", why: "Salah: HD25 justru penuh metrik kuantitatif — C, K, RR, RD — sama kuantitatifnya dengan fairness metrics di HD13." },
          ],
        },
        {
          q: "Program menurunkan stunting: miskin 38%→30%, kaya 15%→10%. Apa yang terjadi pada RR dan RD?",
          options: [
            { text: "RD membaik (23→20 poin) tetapi RR memburuk (2,53→3,00) — keduanya benar, wajib dilaporkan berpasangan", why: "Benar: inilah alasan kenapa satu lensa tidak cukup. Program mencegah kasus absolut (RD membaik) tetapi jurang relatif melebar.", correct: true },
            { text: "Keduanya membaik — program sukses penuh", why: "Salah: RR justru naik dari 2,53 ke 3,00. Mengklaim sukses penuh berarti menyembunyikan separuh cerita." },
            { text: "Keduanya memburuk — program gagal", why: "Salah: RD membaik (23→20). Program mencegah 3 kasus ekstra per 100 anak miskin — itu kemajuan absolut yang nyata." },
            { text: "Tidak bisa dinilai tanpa concentration index", why: "Salah: RR dan RD sudah cukup untuk menilai dua grup ini; C dibutuhkan untuk seluruh tangga distribusi." },
          ],
        },
        {
          q: "C = −0,167 untuk stunting. Interpretasi yang tepat?",
          options: [
            { text: "Stunting terkonsentrasi di si miskin dengan derajat sedang — 17% dari ketimpangan maksimum teoretis", why: "Benar: tanda negatif = beban di si miskin (outcome buruk); besar 0,167 = derajat sedang.", correct: true },
            { text: "Stunting terkonsentrasi di si kaya", why: "Salah: untuk outcome buruk, tanda negatif berarti terkonsentrasi di si MISKIN." },
            { text: "Distribusi sudah adil karena nilainya kecil", why: "Salah: 0,167 bukan nol — dan “kecil” relatif; yang penting arah + tren + konteks. Lagipula C mengukur ketimpangan, bukan keadilan." },
            { text: "Tidak ada ketimpangan karena tidak sama dengan −1", why: "Salah: −1 adalah maksimum teoretis (semua kasus di orang termiskin) — ketimpangan nyata selalu di antaranya." },
          ],
        },
        {
          q: "Indeks Kakwani sistem pembiayaan = −0,03. Artinya?",
          options: [
            { text: "Sedikit regresif — orang miskin membayar proporsi pendapatannya sedikit lebih besar dibanding orang kaya", why: "Benar: K = C_pembayaran − G; negatif = kurva pembayaran di dalam kurva Lorenz = beban relatif lebih berat di bawah.", correct: true },
            { text: "Progresif — sistem sudah adil", why: "Salah: progresif butuh K positif. Negatif — walau kecil — berarti arahnya regresif." },
            { text: "Proporsional sempurna", why: "Salah: proporsional = K tepat 0. −0,03 memang kecil, tetapi tren dan titiknya tetap informatif." },
            { text: "Tidak bisa ditafsirkan tanpa Gini", why: "Salah: K SUDAH memuat Gini di dalamnya (K = C − G) — itulah gunanya indeks ini." },
          ],
        },
        {
          q: "Studi Indonesia menemukan OOP “progresif”. Respons analis yang tepat?",
          options: [
            { text: "Curigai progresivitas semu — cek unmet need: si miskin mungkin menahan diri berobat sehingga terlihat ringan bebannya", why: "Benar: ini interpretasi yang ditulis peneliti studinya sendiri. Metrik pembiayaan tanpa metrik akses = setengah cerita yang menipu.", correct: true },
            { text: "Rayakan — sistem pembiayaan sudah adil", why: "Salah: merayakan tanpa memeriksa unmet need berisiko menghentikan program subsidi tepat saat dibutuhkan." },
            { text: "Abaikan — OOP bukan bagian sistem pembiayaan", why: "Salah: OOP adalah 32% belanja kesehatan Indonesia (2019) — kontributor terbesar, tidak bisa diabaikan." },
            { text: "Minta data baru karena hasilnya pasti salah hitung", why: "Salah: hasilnya konsisten dengan studi 2008 sebelumnya; yang perlu dipertanyakan adalah INTERPRETASINYA, bukan hitungannya." },
          ],
        },
      ],
    },
  ],
};
