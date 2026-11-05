import type { V2Lesson } from "../lib/types";

// ── Figure: CI tiga segmen ───────────────────────────────────────────────
// Skala: y(p) = 260 - (p-0.10)*1466.67. Jakarta 0.20 (CI 0.1774–0.2226);
// Surabaya 0.1625 (CI 0.1369–0.1881); Bandung 0.18 (CI 0.1324–0.2276).
const CI_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Interval kepercayaan tiga segmen: Jakarta dan Surabaya tidak tumpang tindih, Bandung tumpang tindih dengan keduanya.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="260" x2="520" y2="260"/><line x1="60" y1="187" x2="520" y2="187"/>
<line x1="60" y1="113" x2="520" y2="113"/><line x1="60" y1="40" x2="520" y2="40"/>
</g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="263">10%</text><text x="54" y="190">15%</text>
<text x="54" y="116">20%</text><text x="54" y="43">25%</text>
</g>
<g stroke="var(--c1)" stroke-width="3">
<line x1="140" y1="147" x2="140" y2="80"/>
<line x1="280" y1="206" x2="280" y2="131"/>
<line x1="420" y1="213" x2="420" y2="73"/>
</g>
<g stroke="var(--c1)" stroke-width="3">
<line x1="128" y1="147" x2="152" y2="147"/><line x1="128" y1="80" x2="152" y2="80"/>
<line x1="268" y1="206" x2="292" y2="206"/><line x1="268" y1="131" x2="292" y2="131"/>
<line x1="408" y1="213" x2="432" y2="213"/><line x1="408" y1="73" x2="432" y2="73"/>
</g>
<g>
<circle cx="140" cy="113" r="7" fill="var(--c1)"/>
<circle cx="280" cy="168" r="7" fill="var(--c1)"/>
<circle cx="420" cy="143" r="7" fill="var(--c1)"/>
</g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<text x="140" y="278" fill="var(--text)">Jakarta 20,0%</text>
<text x="280" y="278" fill="var(--text)">Surabaya 16,25%</text>
<text x="420" y="278" fill="var(--text)">Bandung 18,0%</text>
<text x="140" y="64" fill="var(--text-muted)" font-size="10">n=1200</text>
<text x="280" y="222" fill="var(--text-muted)" font-size="10">n=800</text>
<text x="420" y="229" fill="var(--text-muted)" font-size="10">n=250</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="60" y="24">tingkat konversi ± CI 95%</text><text x="430" y="24">data sintetis lab</text>
</g>
</svg>`;

export const biz26: V2Lesson = {
  slug: "biz26-statistik-terapan-bi",
  track: "Business Intelligence",
  module: "Analisis & Insight",
  title: "BI26 — Statistik Terapan untuk Analis BI",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Dasbor menampilkan angka titik: 'konversi Surabaya 16,25%'. Manajer membaca: 'Surabaya bermasalah, perbaiki!' Padahal angka itu punya rentang ketidakpastian — dan rentang itulah yang menentukan apakah 'masalah' itu nyata atau hanya noise. Lesson ini tentang statistik yang seharusnya menempel di setiap angka dasbor: interval kepercayaan, ukuran sampel minimum, dan cara membaca driver tanpa terjebak korelasi.",
        "Setelah lesson ini kamu bisa: (1) menghitung dan menginterpretasikan interval kepercayaan 95% untuk proporsi; (2) menjelaskan kenapa CI dua segmen yang tumpang tindih belum tentu berarti 'tidak beda' — dan cara menguji bedanya dengan benar; (3) menentukan ukuran sampel minimum sebelum menyimpulkan apa pun dari dasbor; (4) menjalankan driver analysis sederhana dengan regresi dan mengenali jebakan korelasi-vs-kausalitas di laporan.",
        "Rute: cerita (Surabaya yang 'bermasalah'), interval kepercayaan, ukuran sampel minimum, driver analysis & jebakan korelasi, lab pandas (CI tiga segmen), chart CI dengan panduan baca, peta keputusan, mini-case CTR kreative, kuis, rangkuman. Estimasi 60 menit; lab sekitar 15 menit.",
        "Bekal ringkas: kamu sudah membangun pipeline (BI23), lapisan medallion (BI24), dan otomasi laporan (BI25). Lesson ini adalah 'rem'-nya: memastikan angka yang mengalir di semua itu tidak dipakai untuk keputusan yang salah. Tidak butuh kalkulus — hanya rata-rata, akar kuadrat, dan keberanian untuk berkata 'datanya belum cukup'.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Surabaya yang 'bermasalah' — dan Bandung yang lolos",
      prose: [
        "Senin pagi, dasbor funnel checkout menampilkan: Jakarta 20,0% (n=1200), Surabaya 16,25% (n=800), Bandung 18,0% (n=250). Bu Ratna, head of growth, menunjuk Surabaya: 'Turun 3,75 poin dari Jakarta — investigasi dan perbaiki minggu ini!' Bandung 'hanya' 2 poin di bawah Jakarta — lolos dari sorotan.",
        "Twist-nya dari statistik: selisih Jakarta–Surabaya (3,75 poin) memiliki CI 95% (0,34; 7,16) — tidak mencakup nol, bedanya NYATA. Tetapi selisih Jakarta–Bandung (2,0 poin) memiliki CI (−3,27; 7,27) — mencakup nol, bedanya NOISE. Bu Ratna benar menunjuk Surabaya, tetapi dengan alasan yang salah (ia tidak tahu soal CI); dan ia salah melepas Bandung — bukan karena Bandung 'baik-baik saja', melainkan karena dengan n=250, dasbor BELUM BISA berkata apa-apa tentang Bandung. Keputusan dari angka titik telanjang adalah judi yang berdandan data.",
        "Lesson ini memasang 'rem statistik' pada dasbor: setiap angka proporsi ditemani interval kepercayaannya, setiap perbandingan diuji dengan CI selisih, dan setiap kesimpulan menunggu ukuran sampel yang cukup.",
      ],
      tasks: [],
    },
    {
      id: "konsep-ci",
      eyebrow: "Langkah 3 · Interval",
      title: "Interval Kepercayaan — Si Rentang Jujur",
      prose: [
        "Definisi: interval kepercayaan 95% untuk proporsi = p ± 1,96 × √(p(1−p)/n). Ia berkata: 'nilai sebenarnya kemungkinan besar ada di rentang ini.' Jakarta: 0,20 ± 1,96 × √(0,2×0,8/1200) = 0,20 ± 0,0226 → (17,74%; 22,26%). Bandung: 0,18 ± 1,96 × √(0,18×0,82/250) = 0,18 ± 0,0476 → (13,24%; 22,76%). Perhatikan: Bandung punya n 5× lebih kecil → rentangnya 2× lebih lebar. Ketidakpastian bukan sifat datanya — ia sifat UKURAN datanya.",
        "Untuk membandingkan dua segmen, JANGAN bandingkan CI masing-masing (tumpang tindih CI ≠ tidak beda signifikan — itu mitos). Hitung CI SELISIH: (p1−p2) ± 1,96 × √(SE1² + SE2²). Bila CI selisih tidak mencakup nol → bedanya nyata. Jakarta–Surabaya: 0,0375 ± 0,0341 → (0,0034; 0,0716): tidak mencakup nol → NYATA. Jakarta–Bandung: 0,0200 ± 0,0527 → mencakup nol → NOISE.",
        "Kepribadiannya: CI seperti prakiraan cuaca yang jujur — 'besok 28–32 derajat' lebih berguna daripada 'besok 30 derajat' yang sok pasti. Analis yang melaporkan angka titik tanpa CI seperti peramal cuaca yang menyebut satu angka: terdengar tegas, salahnya tidak tercatat. Kapan memakai: (1) setiap angka proporsi/rata-rata di dasbor yang dipakai untuk keputusan; (2) perbandingan antar-segmen, antar-periode, antar-kampanye. Kapan tidak: data sensus penuh (n = populasi — tidak ada ketidakpastian sampling) atau keputusan yang tidak sensitif terhadap presisi.",
      ],
      formula: String.raw`p \pm z \sqrt{\frac{p(1-p)}{n}}, \qquad (p_1-p_2) \pm z\sqrt{SE_1^2 + SE_2^2}`,
      formulaNote: "p = proporsi sampel; z = 1,96 untuk 95%; SE = standard error = √(p(1−p)/n) — menyusut sebanding 1/√n. Rumus kedua = CI untuk SELISIH dua proporsi. Contoh lab: Jakarta p=0,20, n=1200 → SE=0,0115 → CI (0,1774; 0,2226). Selisih Jakarta−Surabaya = 0,0375, SE gabungan 0,0174 → CI (0,0034; 0,0716) — tidak mencakup nol → beda NYATA.",
      tasks: [],
      note: {
        title: "🚨 Mitos: CI dua segmen bertumpang tindih = tidak ada beda",
        type: "pitfall",
        body: "Yang benar: tumpang tindih CI individu TIDAK SAMA dengan 'tidak signifikan'. Uji yang benar adalah CI SELISIH. Dua CI yang sedikit tumpang tindih masih bisa menghasilkan selisih yang signifikan — dan sebaliknya. Jangan pernah memvonis dari 'apakah batangnya bersentuhan' di chart; hitung CI selisihnya. Chart di Langkah 7 menunjukkan ini secara visual.",
      },
      hints: [
        "💡 Intuisi: lebar CI ∝ 1/√n. Untuk mempersempit CI menjadi SETENGAH, butuh 4× data. Inilah kenapa segmen kecil (Bandung, n=250) hampir selalu 'tidak konklusif' — bukan karena tidak ada efek, tetapi karena mikroskopnya kurang kuat.",
        "💡 Intuisi: 95% bukan 100%. Dari 20 perbandingan, rata-rata SATU akan 'signifikan' secara kebetulan. Makin banyak segmen yang kamu bandingkan di dasbor, makin besar peluang temuan palsu — waspadai multiple comparisons.",
      ],
      reference: "Angka titik + CI = jujur. Bandingkan via CI selisih, bukan tumpang tindih CI.",
    },
    {
      id: "konsep-sampel",
      eyebrow: "Langkah 4 · Sampel",
      title: "Ukuran Sampel Minimum — Si Sabar",
      prose: [
        "Definisi: sebelum menyimpulkan dari dasbor, tanyakan 'n-nya cukup?' Aturan praktis: untuk mendeteksi beda proporsi sebesar d dengan keyakinan 95%, butuh n ≈ 16 × p(1−p) / d² per kelompok (aturan 16, dari (2×1,96)² ≈ 16). Ingin mendeteksi beda 2 poin (d=0,02) di sekitar p=0,2? n ≈ 16 × 0,16 / 0,0004 = 6.400 per kelompok. Bandung dengan n=250 hanya bisa mendeteksi beda ≥ ~10 poin — beda 2 poin di sana TAK TERLIHAT secara statistik, apa pun angkanya.",
        "Implikasinya untuk dasbor: segmen kecil akan SELALU terlihat 'tidak beda' — bukan karena performanya sama, tetapi karena mikroskopnya lemah. Kebijakan yang benar: (1) tampilkan n di samping setiap angka (analis yang menyembunyikan n menyembunyikan ketidakpastian); (2) tetapkan ambang 'n minimum untuk kesimpulan' — di bawah itu, dasbor menampilkan 'data belum cukup', bukan angka yang mengundang vonis; (3) gabungkan periode (7 hari → 30 hari) untuk segmen kecil sebelum membandingkan.",
        "Kepribadiannya: ukuran sampel seperti jumlah saksi di pengadilan — satu saksi bisa benar bisa salah; 1.200 saksi yang independen sulit dibantah. Aturan 16 adalah cara cepat bertanya 'cukupkah saksiku?' sebelum menuntut. Kapan memakai: (1) sebelum me-launch analisis perbandingan apa pun; (2) saat merancang eksperimen (berapa lama harus berjalan?). Kapan tidak: monitoring rutin yang memang hanya butuh 'cukup dekat', bukan presisi ilmiah.",
      ],
      formula: String.raw`n \approx \frac{16 \cdot p(1-p)}{d^2}`,
      formulaNote: "n = sampel minimum per kelompok; p = proporsi baseline; d = beda terkecil yang ingin dideteksi; 16 ≈ (2×1,96)². Contoh: p=0,2, d=0,02 → n ≈ 16×0,16/0,0004 = 6.400. Bandung n=250 → hanya bisa mendeteksi d ≥ √(16×0,16/250) ≈ 0,10 (10 poin). Beda 2 poin di Bandung = di bawah daya deteksi — vonis apa pun adalah tebakan.",
      tasks: [],
      note: {
        title: "🚨 Mitos: 'n=30 sudah cukup' untuk semua analisis",
        type: "pitfall",
        body: "Yang benar: n=30 adalah aturan jempol untuk pendekatan normal, BUKAN untuk daya deteksi. Dengan n=30 dan p=0,2, CI-mu selebar ±14 poin — kamu tidak bisa membedakan 15% dari 25%. 'Cukup' selalu relatif terhadap beda yang ingin dideteksi (d). Selalu hitung dengan rumus, jangan dengan jempol.",
      },
      hints: [
        "💡 Intuisi: bila stakeholder bertanya 'kenapa analisismu lama?', jawabannya sering 'menunggu n cukup'. Analisis cepat dari n kecil bukan analisis — itu ramalan. Lebih baik terlambat 2 minggu dengan jawaban benar daripada cepat dengan jawaban salah.",
      ],
      reference: "n ≈ 16·p(1−p)/d². Tampilkan n di dasbor; di bawah ambang = 'data belum cukup'.",
    },
    {
      id: "konsep-driver",
      eyebrow: "Langkah 5 · Driver",
      title: "Driver Analysis & Jebakan Korelasi — Si Tukang Tuduh",
      prose: [
        "Definisi driver analysis: regresi sederhana y = a + b·x untuk mengukur 'bila X naik 1 unit, Y berubah b'. Contoh: regresi konversi terhadap loading time halaman — b = −0,8 poin per detik: tiap 1 detik lebih lambat, konversi turun 0,8 poin. Inilah cara analis BI menjawab 'kenapa Surabaya rendah?' dengan data, bukan insting: uji kandidat driver satu per satu, laporkan yang koefisiennya signifikan DAN masuk akal secara bisnis.",
        "Jebakan terbesarnya: korelasi ≠ kausalitas — dan di dasbor, keduanya terlihat identik. Penjualan es krim berkorelasi dengan kasus tenggelam (keduanya naik saat panas) — tetapi melarang es krim tidak menyelamatkan perenang. Dalam BI: 'pengguna yang membuka halaman promo berkonversi 3× lebih tinggi' — apakah promo menyebabkan konversi, atau pengguna yang SUDAH berniat beli yang membuka promo? (Jawaban kedua — seleksi, bukan efek.) Aturan: korelasi boleh dilaporkan sebagai PETUNJUK ('perlu investigasi'), tidak pernah sebagai VONIS ('promo menaikkan konversi 3×').",
        "Kepribadiannya: driver analysis seperti detektif — ia mengumpulkan bukti (koefisien), tetapi vonis 'bersalah' butuh motif dan kesempatan (logika bisnis + eksperimen). Detektif yang menangkap berdasarkan satu bukti korelasi akan menangkap orang yang salah. Kapan memakai regresi driver: (1) eksplorasi awal 'apa yang berkorelasi dengan metrikku?'; (2) prioritasi hipotesis untuk diuji via eksperimen. Kapan tidak: klaim kausal di laporan eksekutif tanpa validasi.",
      ],
      formula: String.raw`y = a + b\,x, \qquad b = \frac{\sum (x_i-\bar{x})(y_i-\bar{y})}{\sum (x_i-\bar{x})^2}`,
      formulaNote: "y = metrik (konversi); x = kandidat driver (loading time); a = intersep; b = kemiringan — 'bila x naik 1, y berubah b'. Contoh: b = −0,8 berarti tiap detik tambahan loading time ≈ −0,8 poin konversi. INGAT: b mengukur ASOSIASI. Tanpa eksperimen atau desain kausal, jangan tulis 'menyebabkan' di laporan — tulis 'berasosiasi dengan'.",
      tasks: [],
      note: {
        title: "🚨 Mitos: korelasi kuat di dasbor = temuan untuk dipresentasikan ke direksi",
        type: "pitfall",
        body: "Yang benar: dasbor penuh korelasi palsu (confounding, seleksi, tren bersama). 'Pengguna iOS berkonversi lebih tinggi' bisa berarti: iOS → daya beli lebih tinggi → konversi lebih tinggi — bukan 'aplikasi iOS kita lebih bagus'. Sebelum naik ke direksi, tanyakan tiga hal: (1) adakah penjelasan alternatif yang masuk akal? (2) apakah polanya bertahan bila dipotong per segmen (cek Simpson's paradox)? (3) beranikah kita bertaruh uang pada klaim kausal ini?",
      },
      hints: [
        "💡 Intuisi: Simpson's paradox — tren di level agregat bisa TERBALIK di tiap segmen. 'Kampanye B lebih baik' secara nasional bisa berarti 'kampanye B lebih buruk di SEMUA provinsi' bila B kebetulan dijalankan di provinsi yang memang berkonversi tinggi. Selalu potong per segmen sebelum menyimpulkan.",
        "💡 Intuisi: bahasa laporan yang aman: 'berasosiasi dengan', 'konsisten dengan hipotesis X', 'perlu eksperimen untuk konfirmasi'. Bahasa yang berbahaya: 'menyebabkan', 'terbukti menaikkan', 'driver utama'.",
      ],
      reference: "Regresi = petunjuk, bukan vonis. Korelasi naik ke direksi hanya setelah 3 pertanyaan lolos.",
    },
    {
      id: "lab-ci",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — CI tiga segmen dengan pandas",
      prose: [
        "Waktunya jadi analis yang jujur. Data di bawah: funnel checkout 30 hari — Jakarta (1200 pengunjung, 240 beli), Surabaya (800, 130), Bandung (250, 45). Tugasmu: (1) hitung tingkat konversi tiap segmen; (2) hitung CI 95% tiap segmen (p ± 1,96×SE); (3) hitung CI SELISIH Jakarta–Surabaya dan Jakarta–Bandung, lalu vonis tiap pasangan: NYATA (CI tidak mencakup nol) atau NOISE.",
        "Coba: setelah lolos, ubah n Bandung menjadi 2500 (bayangkan 10× traffic) dengan proporsi sama (450 beli) — apa yang terjadi pada vonis Jakarta–Bandung? Itulah pelajaran Langkah 4 yang hidup: kesimpulan yang sama, data yang cukup, vonis yang berbeda.",
      ],
      tasks: [
        { id: "t1", text: "Buat kolom `konversi` = beli/pengunjung, lalu cetak tiap segmen" },
        { id: "t2", text: "Hitung `se`, `ci_bawah`, `ci_atas` tiap segmen (z=1,96), lalu cetak" },
        { id: "t3", text: "Untuk pasangan Jakarta–Surabaya dan Jakarta–Bandung: hitung selisih, SE gabungan, CI selisih, dan `vonis` (NYATA/NOISE), lalu cetak" },
      ],
      requires: ["pandas"],
      expected: "konversi Jakarta=0.2000 CI=(0.1774,0.2226)\nkonversi Surabaya=0.1625 CI=(0.1369,0.1881)\nkonversi Bandung=0.1800 CI=(0.1324,0.2276)\nbeda Jakarta-Surabaya=0.0375 CI=(0.0034,0.0716) vonis=NYATA\nbeda Jakarta-Bandung=0.0200 CI=(-0.0327,0.0727) vonis=NOISE",
      code: {
        starter: `import pandas as pd
import math
# Data funnel checkout 30 hari terakhir. JANGAN UBAH.
df = pd.DataFrame({
    "segmen": ["Jakarta", "Surabaya", "Bandung"],
    "pengunjung": [1200, 800, 250],
    "beli": [240, 130, 45],
})
Z = 1.96  # z 95%

# TULIS KODEMU di bawah ini
`,
        lockLines: 11,
        solution: `import pandas as pd
import math
# Data funnel checkout 30 hari terakhir. JANGAN UBAH.
df = pd.DataFrame({
    "segmen": ["Jakarta", "Surabaya", "Bandung"],
    "pengunjung": [1200, 800, 250],
    "beli": [240, 130, 45],
})
Z = 1.96  # z 95%

# TULIS KODEMU di bawah ini
df["konversi"] = df["beli"] / df["pengunjung"]
df["se"] = (df["konversi"] * (1 - df["konversi"]) / df["pengunjung"]) ** 0.5
df["ci_bawah"] = df["konversi"] - Z * df["se"]
df["ci_atas"] = df["konversi"] + Z * df["se"]
for _, r in df.iterrows():
    print(f"konversi {r['segmen']}={r['konversi']:.4f} CI=({r['ci_bawah']:.4f},{r['ci_atas']:.4f})")

def banding(a, b):
    ra = df[df.segmen == a].iloc[0]
    rb = df[df.segmen == b].iloc[0]
    d = ra["konversi"] - rb["konversi"]
    se = math.sqrt(ra["konversi"]*(1-ra["konversi"])/ra["pengunjung"] + rb["konversi"]*(1-rb["konversi"])/rb["pengunjung"])
    lo, hi = d - Z*se, d + Z*se
    vonis = "NYATA" if lo > 0 or hi < 0 else "NOISE"
    print(f"beda {a}-{b}={d:.4f} CI=({lo:.4f},{hi:.4f}) vonis={vonis}")
    return d

beda_js = banding("Jakarta", "Surabaya")
beda_jb = banding("Jakarta", "Bandung")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "konversi Jakarta=0\\.2000", label: "Konversi Jakarta = 0,2000", msg: "240/1200 = 0,20. Cek pembagianmu." },
          { kind: "stdout_matches", task: "t2", pattern: "konversi Bandung=0\\.1800 CI=\\(0\\.1324,0\\.2276\\)", label: "CI Bandung lebar (n kecil)", msg: "n=250 → CI selebar ±4,76 poin. Inilah harga sampel kecil." },
          { kind: "equal", task: "t3", name: "beda_js", value: 0.0375, tol: 0.0005, label: "Beda Jakarta–Surabaya = 0,0375", msg: "0,20 − 0,1625. Selisihnya disimpan di variabel beda_js." },
          { kind: "stdout_matches", task: "t3", pattern: "beda Jakarta-Surabaya=0\\.0375 CI=\\(0\\.0034,0\\.0716\\) vonis=NYATA", label: "Jakarta vs Surabaya: NYATA", msg: "CI selisih tidak mencakup nol — bedanya nyata, Bu Ratna benar menunjuk Surabaya." },
          { kind: "stdout_matches", task: "t3", pattern: "beda Jakarta-Bandung=0\\.0200 CI=\\(-0\\.0327,0\\.0727\\) vonis=NOISE", label: "Jakarta vs Bandung: NOISE", msg: "CI mencakup nol — dengan n=250, dasbor belum bisa berkata apa-apa tentang Bandung." },
          { kind: "uses", task: "t1", token: "DataFrame", label: "Memakai pandas DataFrame", msg: "Analis BI hidup di DataFrame — latihan yang jujur memakai alat yang asli." },
        ],
      },
      reference: "CI tiap segmen dulu, lalu CI selisih untuk vonis. Titik tanpa CI = judi.",
    },
    {
      id: "chart-ci",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca ketidakpastian seperti analis senior",
      prose: [
        "Chart di bawah: tiga titik = estimasi konversi tiap segmen; garis vertikal = CI 95%. Jakarta (20,0%; CI 17,7–22,3), Surabaya (16,25%; CI 13,7–18,8), Bandung (18,0%; CI 13,2–22,8).",
        "Cara membaca: sumbu Y = tingkat konversi; titik = estimasi; garis vertikal = rentang ketidakpastian (makin panjang = makin tidak yakin). Perhatikan Bandung: garisnya PALING PANJANG — mencakup hampir seluruh rentang Jakarta.",
        "Interpretasi: whisker Jakarta dan Surabaya tidak tumpang tindih — konsisten dengan vonis NYATA. Whisker Bandung menelan keduanya — konsisten dengan vonis NOISE. Keputusan: chart seperti ini yang seharusnya tampil di dasbor, bukan tiga angka telanjang. Aturan presentasi: bila whisker dua segmen tumpang tindih lebar, JANGAN beri warna merah/hijau 'naik/turun' — beri label abu-abu 'belum konklusif'. Warna merah pada noise adalah cara tercepat menghancurkan kepercayaan pada dasbor.",
      ],
      figure: {
        svg: CI_SVG,
        alt: "Interval kepercayaan tiga segmen: Jakarta dan Surabaya tidak tumpang tindih; Bandung tumpang tindih dengan keduanya.",
        caption: "Whisker = ketidakpastian. Bandung yang 'hampir Jakarta' ternyata tak bisa disimpulkan apa-apa.",
      },
      tasks: [],
      note: {
        title: "Intuisi: chart ini menjelaskan kenapa n harus tampil di dasbor",
        body: "Tanpa label n (1200/800/250), chart ini terlihat seperti 'Jakarta menang, Surabaya kalah, Bandung lumayan'. Dengan label n, ceritanya berubah: 'Jakarta vs Surabaya = temuan; Bandung = belum bisa dinilai'. Tiga prinsip dasbor jujur. Pertama: selalu tampilkan n di samping angka. Kedua: untuk n kecil, tampilkan 'data belum cukup' lebih menonjol daripada angkanya. Ketiga: jangan pernah beri warna status (merah/hijau) pada perbandingan yang belum lolos uji — warna adalah vonis, dan vonis butuh bukti.",
      },
      reference: "Whisker panjang = mikroskop lemah. Warna status hanya untuk temuan yang lolos uji.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "CI cukup, uji formal, atau diam dulu?",
      prose: [
        "Lima skenario kapan memakai alat statistik apa di pekerjaan BI:",
        "Skenario 1 — Melaporkan angka berkala ke manajemen (konversi bulanan, NPS kuartalan). → Tampilkan angka + CI 95%. Alasan: murah, jujur, dan cukup untuk keputusan rutin.",
        "Skenario 2 — Membandingkan dua segmen/periode untuk keputusan aksi ('perlukah intervensi Surabaya?'). → CI selisih + vonis NYATA/NOISE. Alasan: keputusan aksi butuh bukti beda, bukan firasat.",
        "Skenario 3 — n kecil sehingga CI selebar lapangan (seperti Bandung). → Jangan simpulkan; tampilkan 'data belum cukup' + gabungkan periode atau segmen. Alasan: vonis dari n kecil = judi; kejujuran 'belum tahu' lebih berharga.",
        "Skenario 4 — Mencari 'kenapa' (driver analysis). → Regresi eksploratori sebagai PETUNJUK, lalu validasi via eksperimen atau data baru. Alasan: korelasi dasbor ≠ kausalitas; naikkan ke direksi hanya setelah 3 pertanyaan (Langkah 5) lolos.",
        "Skenario 5 — Keputusan besar dan mahal (ubah harga nasional, tutup cabang). → Jangan hanya statistik deskriptif — jalankan eksperimen (A/B atau geo-experiment A322). Alasan: CI menjawab 'berapa ketidakpastiannya', eksperimen menjawab 'apa penyebabnya'. Beda pertanyaan, beda alat.",
        "Aturan praktis 10 detik: lapor rutin → angka + CI. Bandingkan → CI selisih. n kecil → 'belum cukup'. Cari penyebab → regresi = petunjuk. Keputusan mahal → eksperimen.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: memakai uji statistik untuk menghindari keputusan",
        type: "pitfall",
        body: "Ada analis yang berlindung di balik 'belum signifikan' untuk tidak pernah memutuskan apa pun. Statistik adalah alat mengurangi risiko keputusan, bukan alat menghilangkannya. Bila datanya tidak akan pernah cukup (segmen kecil permanen), keputusan harus dibuat dengan data terbaik yang ada + pengakuan ketidakpastian yang eksplisit — bukan penundaan abadi.",
      },
      reference: "Statistik mengurangi risiko, bukan menghilangkannya. 'Belum tahu' adalah jawaban yang sah.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Dua kreative, satu pemenang — benarkah?",
      prose: [
        "Skenario (sintetis, untuk latihan): tim growth menguji dua kreative iklan. Kreative A: 1.200 impresi, 96 klik (CTR 8,0%). Kreative B: 300 impresi, 30 klik (CTR 10,0%). Tim kreative merayakan: 'B menang 2 poin! Scale up B!'",
        "Pertanyaan analisis: (1) Hitung CI 95% tiap kreative. (2) Hitung CI selisih B−A dan vonisnya. (3) Keputusan yang benar?",
        "Pembahasan: (1) CI A: 0,08 ± 1,96×√(0,08×0,92/1200) = 0,08 ± 0,0154 → (6,46%; 9,54%). CI B: 0,10 ± 1,96×√(0,10×0,90/300) = 0,10 ± 0,0340 → (6,60%; 13,40%). (2) Selisih B−A = 0,02; SE gabungan = √(0,08×0,92/1200 + 0,10×0,90/300) = √(0,0000613 + 0,0003) = 0,01901; CI = 0,02 ± 1,96×0,01901 = 0,02 ± 0,0373 → (−0,0173; 0,0573): mencakup nol → NOISE. (3) Jangan scale up B. 'Kemenangan' 2 poin itu sepenuhnya bisa dijelaskan noise dari n=300. Jalankan B sampai n≈1.500 (aturan 16: untuk d=0,02 di p≈0,09, n ≈ 16×0,082/0,0004 ≈ 3.300 per kelompok untuk daya penuh; minimal beberapa ribu impresi) atau terima bahwa dengan budget ini, pertanyaannya tidak terjawab. Scale up berdasarkan noise = membakar budget dengan keyakinan palsu.",
        "Catatan desain: inilah versi mini dari cerita Bu Ratna — hanya segmennya kreative, bukan kota. Polanya sama: angka kecil + n kecil = perayaan prematur. Analis yang baik adalah orang yang berani berkata 'belum tahu' di tengah ruangan yang ingin merayakan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Scale up kreative berdasarkan CTR noise = alokasi modal berdasarkan sinyal palsu — sepupu dekat dari keputusan kredit berdasarkan skor yang tidak tervalidasi. Dalam kedua kasus, biayanya nyata (budget iklan terbuang / NPL) sedangkan 'buktinya' hanya noise yang berdandan angka. CI adalah due diligence termurah sebelum mengeluarkan uang.",
      },
      reference: "CTR 10% vs 8% dengan n=300 → NOISE. Jangan scale up dari noise.",
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
        "Setiap angka proporsi di dasbor wajib ditemani CI 95%: p ± 1,96√(p(1−p)/n).",
        "Bandingkan segmen via CI SELISIH — tumpang tindih CI individu ≠ tidak beda.",
        "n minimum ≈ 16·p(1−p)/d²; di bawah itu, 'data belum cukup' lebih jujur daripada angka.",
        "Regresi driver = petunjuk, bukan vonis; korelasi naik ke direksi hanya setelah 3 pertanyaan lolos.",
        "Jangan beri warna status (merah/hijau) pada perbandingan yang belum lolos uji.",
      ],
      quiz: [
        {
          q: "Jakarta: p=0,20, n=1200. CI 95%?",
          options: [
            { text: "(17,74%; 22,26%) — dari 0,20 ± 1,96×√(0,2×0,8/1200)", why: "Benar: SE = 0,0115; 1,96×SE = 0,0226. Persis angka lab.", correct: true },
            { text: "(18%; 22%) — dari ±2 poin aturan jempol", why: "Salah: 'aturan jempol ±2 poin' tidak ada dalam statistik — CI dihitung dari n, bukan ditebak.", correct: false },
            { text: "(19%; 21%) — dari ±1 poin agar terlihat presisi", why: "Salah: mempersempit CI agar 'terlihat bagus' adalah kecurangan visual.", correct: false },
            { text: "Tidak perlu CI — n=1200 sudah besar", why: "Salah: n besar membuat CI SEMPIT, bukan menghilangkannya. (17,7; 22,3) tetap rentang yang bermakna.", correct: false },
          ],
        },
        {
          q: "CI Jakarta (17,7; 22,3) dan CI Bandung (13,2; 22,8) bertumpang tindih. Kesimpulan yang benar?",
          options: [
            { text: "Belum bisa disimpulkan dari tumpang tindih — hitung CI selisih", why: "Benar: tumpang tindih CI ≠ tidak signifikan. Uji yang benar = CI selisih; di lab ia mencakup nol → NOISE.", correct: true },
            { text: "Tidak ada beda — batangnya bersentuhan", why: "Salah: inilah mitos Langkah 3. 'Bersentuhan' bukan uji statistik.", correct: false },
            { text: "Jakarta lebih baik — titiknya lebih tinggi", why: "Salah: membandingkan titik tanpa ketidakpastian = judi berdandan data.", correct: false },
            { text: "Bandung lebih baik — CI-nya lebih lebar (lebih potensial)", why: "Salah: CI lebar = ketidakpastian besar, BUKAN potensi besar.", correct: false },
          ],
        },
        {
          q: "Ingin mendeteksi beda 2 poin (d=0,02) di sekitar p=0,2. n minimum per kelompok?",
          options: [
            { text: "≈ 6.400 — dari 16×0,16/0,02²", why: "Benar: aturan 16. Bandung (n=250) hanya bisa mendeteksi beda ≥10 poin — jauh dari cukup.", correct: true },
            { text: "30 — aturan jempol klasik", why: "Salah: n=30 memberi CI selebar ±14 poin — tidak bisa melihat beda 2 poin.", correct: false },
            { text: "250 — seperti Bandung, sudah jalan", why: "Salah: 'sudah jalan' ≠ 'cukup'. Bandung justru contoh n yang TIDAK cukup.", correct: false },
            { text: "1.000 — angka bulat yang aman", why: "Salah: dengan n=1000, d terkecil terdeteksi ≈ 5 poin — masih 2,5× target.", correct: false },
          ],
        },
        {
          q: "'Pengguna yang membuka halaman promo berkonversi 3× lebih tinggi.' Klaim kausal yang tepat?",
          options: [
            { text: "Belum bisa — kemungkinan seleksi: pengguna yang sudah berniat belilah yang membuka promo", why: "Benar: korelasi ≠ kausalitas. Butuh eksperimen (acak siapa melihat promo) untuk klaim kausal.", correct: true },
            { text: "Bisa — 3× adalah efek yang besar sehingga pasti kausal", why: "Salah: besarnya efek tidak mengubah logika — seleksi pun bisa menghasilkan 3×.", correct: false },
            { text: "Bisa — datanya dari 10.000 pengguna sehingga valid", why: "Salah: n besar membuat estimasi PRESISI, bukan membuat korelasi menjadi kausal.", correct: false },
            { text: "Tidak bisa — korelasi tidak pernah berguna", why: "Salah: korelasi berguna sebagai PETUNJUK prioritas investigasi; yang dilarang adalah vonis kausal.", correct: false },
          ],
        },
        {
          q: "Kreative B CTR 10% (n=300) vs A 8% (n=1200). CI selisih mencakup nol. Keputusan?",
          options: [
            { text: "Jangan scale up — kemenangannya noise; tambah impresi atau terima pertanyaan tak terjawab", why: "Benar: persis mini-case. Scale up dari noise = bakar budget dengan keyakinan palsu.", correct: true },
            { text: "Scale up B — 10% > 8%, angka tidak berbohong", why: "Salah: angka tidak berbohong, tetapi ia juga tidak berkata apa-apa — CI-nya mencakup nol.", correct: false },
            { text: "Buang B — kalah secara statistik berarti B lebih buruk", why: "Salah: 'tidak terbukti lebih baik' ≠ 'terbukti lebih buruk'.", correct: false },
            { text: "Rata-ratakan keduanya jadi 9%", why: "Salah: merata-rata kreative berbeda = menghancurkan informasi, bukan menghematnya.", correct: false },
          ],
        },
        {
          q: "Praktik dasbor yang PALING jujur untuk segmen kecil (n di bawah ambang)?",
          options: [
            { text: "Tampilkan 'data belum cukup' lebih menonjol daripada angkanya, sertakan n", why: "Benar: kejujuran 'belum tahu' melindungi dari vonis prematur. n yang tampil membuat ketidakpastian terlihat.", correct: true },
            { text: "Sembunyikan segmennya agar tidak membingungkan", why: "Salah: menyembunyikan data = menyembunyikan ketidakpastian — pembaca mengira semuanya baik-baik saja.", correct: false },
            { text: "Tampilkan angkanya saja dengan warna netral", why: "Salah: angka tanpa CI mengundang vonis; warna netral tidak menghentikan pembaca membandingkan titik.", correct: false },
            { text: "Beri warna merah agar tim termotivasi memperbaiki", why: "Salah: warna merah pada noise = vonis tanpa bukti — cara tercepat menghancurkan kepercayaan pada dasbor.", correct: false },
          ],
        },
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};
