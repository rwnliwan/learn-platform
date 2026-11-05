import type { V2Lesson } from "../lib/types";

// ── Figure: fraksi jam dengan k kejadian (simulasi) vs PMF Poisson(3) ──────
const POIS_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Histogram jumlah kejadian per jam vs kurva Poisson">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="240" x2="530" y2="240"/>
<line x1="60" y1="198" x2="530" y2="198"/><line x1="60" y1="156" x2="530" y2="156"/>
<line x1="60" y1="114" x2="530" y2="114"/><line x1="60" y1="72" x2="530" y2="72"/>
<line x1="60" y1="30" x2="530" y2="30"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="243">0</text><text x="54" y="201">0,05</text><text x="54" y="159">0,10</text>
<text x="54" y="117">0,15</text><text x="54" y="75">0,20</text><text x="54" y="33">0,25</text>
</g>
<g opacity="0.9">
<g><rect x="69" y="199" width="20" height="41" fill="var(--c1)"/><rect x="91" y="198" width="20" height="42" fill="var(--c2)"/><text x="90" y="258" text-anchor="middle" font-size="11" fill="var(--text)">0</text></g>
<g><rect x="124" y="112" width="20" height="128" fill="var(--c1)"/><rect x="146" y="114" width="20" height="126" fill="var(--c2)"/><text x="145" y="258" text-anchor="middle" font-size="11" fill="var(--text)">1</text></g>
<g><rect x="179" y="49" width="20" height="191" fill="var(--c1)"/><rect x="201" y="52" width="20" height="188" fill="var(--c2)"/><text x="200" y="258" text-anchor="middle" font-size="11" fill="var(--text)">2</text></g>
<g><rect x="234" y="53" width="20" height="187" fill="var(--c1)"/><rect x="256" y="52" width="20" height="188" fill="var(--c2)"/><text x="255" y="258" text-anchor="middle" font-size="11" fill="var(--text)">3</text></g>
<g><rect x="289" y="100" width="20" height="140" fill="var(--c1)"/><rect x="311" y="99" width="20" height="141" fill="var(--c2)"/><text x="310" y="258" text-anchor="middle" font-size="11" fill="var(--text)">4</text></g>
<g><rect x="344" y="156" width="20" height="84" fill="var(--c1)"/><rect x="366" y="155" width="20" height="85" fill="var(--c2)"/><text x="365" y="258" text-anchor="middle" font-size="11" fill="var(--text)">5</text></g>
<g><rect x="399" y="198" width="20" height="42" fill="var(--c1)"/><rect x="421" y="198" width="20" height="42" fill="var(--c2)"/><text x="420" y="258" text-anchor="middle" font-size="11" fill="var(--text)">6</text></g>
<g><rect x="454" y="222" width="20" height="18" fill="var(--c1)"/><rect x="476" y="222" width="20" height="18" fill="var(--c2)"/><text x="475" y="258" text-anchor="middle" font-size="11" fill="var(--text)">7</text></g>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="80" y="270" width="14" height="14" fill="var(--c1)"/><text x="100" y="282" fill="var(--text)">simulasi (6.706 jam)</text>
<rect x="250" y="270" width="14" height="14" fill="var(--c2)"/><text x="270" y="282" fill="var(--text)">Poisson(3) teori</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="60" y="16">fraksi jam</text><text x="400" y="296">kejadian per jam (data sintetis)</text>
</g>
</svg>`;

export const b18: V2Lesson = {
  slug: "b18-poisson-process",
  track: "Probabilitas",
  module: "Proses Stokastik",
  title: "Poisson Processes: Menghitung Kejadian Sepanjang Waktu (kedatangan default, alert fraud)",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu analis per 20 menit — lalu lima alert dalam dua menit",
      prose: [
        "Tim SOC sebuah bank menerima rata-rata 180 alert fraud per 12 jam shift — tepat 1 alert per 4 menit. Manajer shift membuat jadwal elegan: 1 analis siaga per 4 menit, kapasitas pas. Minggu pertama berjalan mulus. Minggu kedua, pada Selasa pukul 02:14, lima alert masuk dalam dua menit yang sama. Antrean meledak, dua analis lembur, satu alert phishing senilai Rp800 juta baru ditangani 40 menit kemudian. Investigasi internal menyimpulkan: tidak ada serangan terkoordinasi, tidak ada yang salah dengan sistem — malam itu hanyalah malam yang sial.",
        "Twist-nya: jadwal siaga itu dibangun dari rata-rata — dan rata-rata adalah ringkasan yang buta terhadap clustering. Kedatangan alert yang acak dan independen TIDAK datang rapi satu per 4 menit; ia datang bergerombol: kadang 20 menit sepi, kadang 5 dalam 2 menit. Manajer itu merencanakan kapasitas untuk dunia yang deterministik, padahal alert hidup di dunia stokastik. Kekeliruan ini punya nama dan obatnya — keduanya berusia lebih dari seabad.",
        "Lesson ini tentang proses Poisson (materi kuliah MIT 18.440, sesi 13): model matematika untuk kejadian yang datang acak sepanjang waktu — alert fraud, kedatangan default, klaim asuransi, telepon ke call center. Kamu akan belajar menghitung bukan hanya rata-ratanya, tetapi seberapa sering gerombolan terjadi — sehingga jadwal siaga berikutnya dirancang untuk malam yang sial, bukan malam yang rata-rata.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "Kapasitas operasional (analis SOC, kolektor, CS) dan cadangan (klaim, default) ditentukan oleh EKOR distribusi kedatangan, bukan rata-ratanya. Merencanakan dari rata-rata menjamin kejutan — dan kejutan di risiko selalu lebih mahal daripada kelebihan kapasitas yang direncanakan.",
      },
      reference: "Rata-rata menjawab berapa banyak. Proses Poisson menjawab kapan bergerombolnya — dan itu yang menentukan kapasitas.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menulis tiga aksioma proses Poisson dan menjelaskan makna tiap-tiapnya; (2) menghitung peluang jumlah kejadian dalam interval dengan PMF Poisson; (3) memakai distribusi eksponensial untuk waktu antar-kedatangan dan sifat memoryless-nya; (4) mengestimasi laju lambda dari data dan memvalidasi model terhadap data; (5) memutuskan kapan Poisson cocok dan kapan harus naik ke model yang lebih kaya (Hawkes, non-homogen).",
        "Rutenya: cerita, bekal ringkas, dua konsep (definisi proses Poisson; waktu antar-kedatangan eksponensial), lab Pyodide (mesin kedatangan), chart validasi dengan panduan baca, peta keputusan, mini-case SOC, kuis, rangkuman. Estimasi 52 menit; lab-nya sekitar 12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, distribusi Poisson: peluang tepat k kejadian bila rata-ratanya mu adalah e^(−mu) mu^k / k! — dipakai untuk COUNT dalam interval tetap. Kedua, distribusi eksponensial: peluang waktu tunggu melebihi t adalah e^(−lambda t) — dipakai untuk WAKTU antar kejadian, dan punya sifat memoryless: sisa waktu tunggu tidak peduli berapa lama kamu sudah menunggu. Proses Poisson adalah jembatan yang menyatukan keduanya: count-nya Poisson, jeda-nya eksponensial.",
      ],
      tasks: [],
      hints: [
        "Intuisi pembuka: proses Poisson = film yang diputar dari dua kamera. Kamera pertama menghitung berapa kejadian per jam (Poisson). Kamera kedua mengukur jeda antar kejadian (eksponensial). Kedua kamera merekam film yang SAMA — hanya sudut pandangnya beda.",
      ],
      reference: "Bekal: (1) Poisson = distribusi count; (2) eksponensial = distribusi jeda, memoryless; (3) proses Poisson menyatukan keduanya.",
    },
    {
      id: "konsep-definisi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Proses Poisson — Si Penghitung yang Jujur",
      prose: [
        "Definisi: proses Poisson dengan laju lambda adalah model kedatangan kejadian sepanjang waktu yang memenuhi tiga aksioma. (1) Stationary increments: peluang kejadian dalam interval hanya tergantung PANJANG interval, bukan posisinya — jam 2 pagi sama dengan jam 2 siang (bila tidak, pakai Poisson non-homogen). (2) Independent increments: kejadian di interval-interval yang tidak tumpang tindih saling independen — masa lalu tidak memengaruhi masa depan. (3) Orderliness: dalam interval sangat pendek, peluang lebih dari 1 kejadian bisa diabaikan — kejadian datang satu per satu, tidak berpasangan. Dari ketiganya lahir rumus: jumlah kejadian N(t) dalam interval panjang t berdistribusi Poisson(lambda t).",
        "Kepribadiannya: proses Poisson seperti hujan gerimis yang jujur — tiap tetes jatuh independen, tidak ada tetes yang memanggil tetes lain, dan intensitasnya konstan. Kadang dua tetes jatuh nyaris bersamaan (gerombolan!), kadang lama tidak ada tetes — tetapi itu murni kebetulan, bukan konspirasi. Analis yang menuduh ada pola di balik gerombolan sedang membaca konspirasi di awan.",
        "Kapan memakai: (1) kejadian langka dan independen: alert fraud per jam, default per bulan, klaim per hari; (2) kamu butuh peluang count: P(lebih dari 5 alert dalam sejam) = 1 − jumlah PMF k=0..5; (3) kamu merancang kapasitas: persentil-99 jumlah kejadian per shift. Estimasi lambda dari data: lambda-topi = total kejadian / total waktu — MLE yang sederhana dan tepat.",
      ],
      formula: String.raw`P(N(t) = k) = \frac{e^{-\lambda t} (\lambda t)^k}{k!}, \qquad k = 0, 1, 2, \ldots`,
      formulaNote: "N(t) = jumlah kejadian dalam interval panjang t; lambda = laju (kejadian per satuan waktu); k = jumlah kejadian yang ditanyakan. Contoh angka: alert fraud lambda = 3 per jam. Peluang jam yang sepi total (k=0): e^(−3)·3^0/0! = e^(−3) ≈ 0,0498 — sekitar 5% jam tidak ada alert sama sekali. Peluang banjir (k ≥ 6): 1 − jumlah PMF k=0..5 ≈ 0,084 — sekitar 8,4% jam menerima 6+ alert. Manajer shift yang hanya tahu rata-rata 3 tidak pernah membayangkan angka 8,4% ini.",
      tasks: [],
      note: {
        title: "🚨 Mitos: kejadian Poisson datang teratur, satu per 1/lambda waktu",
        type: "pitfall",
        body: "Yang benar: 1/lambda hanyalah RATA-RATA jeda. Realisasi proses Poisson bergerombol secara alami — itulah yang membuat malam 5-alert-dalam-2-menit mungkin tanpa anomali apa pun. Keteraturan adalah sifat rata-rata jangka panjang, bukan sifat realisasinya. Menjadwalkan kapasitas dari keteraturan imajiner adalah kesalahan cerita pembuka.",
      },
      hints: [
        "💡 Intuisi: lambda t adalah satu-satunya hal yang penting — peluang hanya peduli pada HASIL KALI laju dan panjang interval. 3 per jam selama 2 jam ≡ 6 per 2 jam ≡ 0,05 per menit selama 120 menit. Pilih satuan yang membuat angkamu nyaman.",
      ],
      reference: "Tiga aksioma: stasioner, independen, satu-per-satu. N(t) ~ Poisson(lambda t).",
    },
    {
      id: "konsep-eksponensial",
      eyebrow: "Langkah 4 · Konsep",
      title: "Jeda eksponensial & memoryless — Si Pelupa yang Konsisten",
      prose: [
        "Definisi: dalam proses Poisson, waktu antar dua kejadian berurutan (interarrival time) berdistribusi eksponensial dengan mean 1/lambda: peluang jeda melebihi t adalah e^(−lambda t). Sifat khasnya adalah MEMORYLESS: P(T > s + t | T > s) = P(T > t) — bila kamu sudah menunggu s menit tanpa alert, peluang menunggu t menit LAGI sama persis seperti saat kamu baru mulai menunggu. Proses ini tidak punya ingatan dan tidak punya utang: masa tunggu yang lama tidak membuat kejadian berikutnya semakin dekat.",
        "Kepribadiannya: eksponensial seperti tukang ojek yang tidak pernah lelah menunggu — ia tidak menghitung sudah berapa lama kamu menunggunya, dan ia tidak merasa berutang untuk datang lebih cepat. Kebalikannya adalah mesin yang menua (Weibull): semakin lama menunggu, semakin besar peluang rusaknya. Kalau alert fraud-mu berdistribusi eksponensial, tidak ada gunanya berkata sudah lama sepi, pasti sebentar lagi ramai — peluangnya tetap sama setiap detiknya.",
        "Kapan memakai: (1) simulasi: bangkitkan jeda eksponensial lalu kumulatifkan — itulah cara termudah mensimulasikan proses Poisson (dipakai di lab); (2) uji kecocokan model: plot histogram jeda antar-kejadian dari data; bila tidak eksponensial (misalnya ada dua punuk), prosesnya bukan Poisson homogen — mungkin ada dua rezim laju; (3) perhitungan cepat: peluang TIDAK ada kejadian dalam t = e^(−lambda t) — satu rumus untuk pertanyaan kapasitas paling umum.",
      ],
      formula: String.raw`P(T > t) = e^{-\lambda t}, \qquad P(T > s+t \mid T > s) = P(T > t)`,
      formulaNote: "T = waktu antar dua kejadian berurutan; lambda = laju yang sama dengan di Langkah 3. Contoh: lambda = 3/jam. Peluang tidak ada alert dalam 1 jam ke depan = e^(−3) ≈ 0,0498 — SAMA dengan peluang count nol di Langkah 3, karena tidak ada kejadian dalam 1 jam ≡ jeda berikutnya melebihi 1 jam. Dua rumus, satu realitas. Memoryless: sudah 50 menit sepi tidak mengubah peluang 10 menit ke depan tetap sepi menjadi e^(−3·(1/6)) ≈ 0,607.",
      tasks: [],
      note: {
        title: "🚨 Mitos: setelah lama sepi, kejadian pasti segera datang (gambler's fallacy versi waktu)",
        type: "pitfall",
        body: "Yang benar: untuk proses Poisson, tidak. Memoryless berarti peluang kejadian di 10 menit ke depan TIDAK PEDULI sudah berapa lama sepi. Naluri sudah lama sepi pasti ramai itu kuat — dan salah. (Pengecualian: bila datanya memang bukan Poisson, misalnya ada pola musiman — maka modelnya yang salah, bukan sifatnya.)",
      },
      hints: [
        "💡 Intuisi simulasi: proses Poisson = ulangi selamanya: tarik jeda ~ Eksponensial(1/lambda), catat waktu kumulatif. Lima baris kode, dan kamu punya malam-malam sial yang realistis untuk stress-test jadwal siaga.",
        "💡 Intuisi diagnostik: rata-rata jeda = 1/lambda dan MEDIAN jeda = ln(2)/lambda ≈ 0,69/lambda. Bila median jauh lebih kecil dari 69% rata-rata, jedanya lebih bergerombol dari Poisson — curigai dependensi (Hawkes) atau laju berubah-ubah.",
      ],
      reference: "Jeda ~ Eksponensial(1/lambda), memoryless. Simulasi = kumulatifkan jeda acak.",
    },
    {
      id: "lab-kedatangan",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Bangun mesin kedatangan",
      prose: [
        "Waktunya jadi perancang kapasitas. Di bawah ada simulator proses Poisson: alert fraud dengan laju lambda = 3 per jam, 20.000 jeda antar-kedatangan. Tugasmu: estimasi lambda dari data (MLE), bangun garis waktu kedatangan, lalu ukur fraksi jam yang sepi total — dan bandingkan dengan teori e^(−lambda t).",
        "Coba: setelah lolos, ubah lam = 3.0 menjadi 0.5 (jarang) lalu 10.0 (banjir). Bagaimana fraksi jam sepi berubah? Pada lambda berapa malam yang sial (6+ alert per jam) menjadi kejadian mingguan, bukan tahunan? Itulah angka yang seharusnya masuk ke proposal penambahan analis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lam_hat` = 1 / rata-rata jeda (MLE laju Poisson)" },
        { id: "t2", text: "Bangun `T` = waktu kedatangan kumulatif, lalu `cnt_100` = banyaknya kejadian dalam 100 jam pertama" },
        { id: "t3", text: "Hitung `frac_empty` = fraksi jam (blok 1 jam) tanpa kejadian sama sekali" },
        { id: "t4", text: "Hitung `teori` = e^(−lam·1) lalu cetak perbandingannya dengan frac_empty" },
      ],
      requires: ["numpy"],
      expected: "lam_hat=2.9824\nfrac_empty=0.0486\nteori=0.0498",
      code: {
        starter: `import numpy as np
rng = np.random.default_rng(18)
lam = 3.0                       # alert per jam
N = 20000
inter = rng.exponential(scale=1/lam, size=N)   # jeda antar-kedatangan

# TULIS KODEMU di bawah ini
lam_hat =
T =
cnt_100 =
nbin =
counts =
frac_empty =
teori =

print(f"lam_hat={lam_hat:.4f}")
print(f"cnt_100={cnt_100} (teori {lam*100:.0f})")
print(f"frac_empty={frac_empty:.4f}")
print(f"teori={teori:.4f}")`,
        lockLines: 6,
        solution: `import numpy as np
rng = np.random.default_rng(18)
lam = 3.0                       # alert per jam
N = 20000
inter = rng.exponential(scale=1/lam, size=N)   # jeda antar-kedatangan

# TULIS KODEMU di bawah ini
lam_hat = 1 / inter.mean()
T = np.cumsum(inter)
cnt_100 = int(np.searchsorted(T, 100))
nbin = int(T[-1])
counts, _ = np.histogram(T, bins=nbin, range=(0, nbin))
frac_empty = float(np.mean(counts == 0))
teori = float(np.exp(-lam * 1))

print(f"lam_hat={lam_hat:.4f}")
print(f"cnt_100={cnt_100} (teori {lam*100:.0f})")
print(f"frac_empty={frac_empty:.4f}")
print(f"teori={teori:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "lam_hat", value: 2.9824, tol: 0.05, label: "`lam_hat` ≈ 2,98", msg: "MLE laju = 1 / rata-rata jeda. Harus dekat dengan 3,0." },
          { kind: "equal", task: "t2", name: "cnt_100", value: 302, tol: 5, label: "`cnt_100` ≈ 300", msg: "Dalam 100 jam dengan laju 3/jam, ekspektasinya 300 kejadian." },
          { kind: "equal", task: "t3", name: "frac_empty", value: 0.0486, tol: 0.01, label: "`frac_empty` ≈ 0,0486", msg: "Fraksi jam sepi dari simulasi — harus dekat teori e^(−3) ≈ 0,0498." },
          { kind: "equal", task: "t4", name: "teori", value: 0.0498, tol: 0.001, label: "`teori` ≈ 0,0498", msg: "teori = e^(−lam·1): peluang tidak ada kejadian dalam 1 jam." },
          { kind: "stdout_matches", task: "t4", pattern: "frac_empty=0\\.04", label: "Ringkasan tercetak", msg: "Baris frac_empty harus tercetak di output." },
        ],
      },
      reference: "Simulasi ≈ teori: validasi model sebelum dipakai merancang kapasitas.",
    },
    {
      id: "chart-validasi",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca validasi model seperti ilmuwan",
      prose: [
        "Chart di bawah memvalidasi model: untuk 6.706 jam simulasi, batang terang = fraksi jam observasi dengan k kejadian, batang gelap = PMF Poisson(3) teori.",
        "Cara membaca: sumbu X = jumlah kejadian per jam (0–7); sumbu Y = fraksi jam; tiap pasangan batang = observasi vs teori untuk k yang sama. Validasi yang baik = pasangan-pasangan yang tingginya nyaris sama.",
        "Interpretasi: kesesuaiannya hampir sempurna — termasuk ekornya: 4,9% jam kosong (teori 5,0%), 2,2% jam dengan 7 kejadian (teori 2,2%). Inilah cara meyakinkan dirimu (dan auditor) bahwa model Poisson cocok untuk datamu: bukan dengan argumen, melainkan dengan histogram yang menempel pada teori. Pelajaran chart ini: malam yang sial (6–7 alert per jam) terjadi sekitar 7% jam — bukan anomali, melainkan fitur. Jadwal siaga yang mengabaikan 7% ini dirancang untuk gagal 7% waktu.",
      ],
      figure: {
        svg: POIS_SVG,
        alt: "Histogram jumlah kejadian per jam dari simulasi menempel hampir sempurna pada PMF Poisson(3) teori, termasuk ekornya.",
        caption: "Validasi: distribusi count simulasi vs Poisson(3) teori (6.706 jam simulasi).",
      },
      tasks: [],
      reference: "Model yang baik = histogram menempel teori. Ekor 7% = fitur, bukan anomali.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Poisson, atau naik kelas?",
      prose: [
        "Empat skenario pemilihan model kedatangan:",
        "Skenario 1 — Alert fraud / default / klaim yang independen, laju stabil. → Poisson homogen. Alasan: tiga aksioma terpenuhi; model paling sederhana yang jujur; estimasi hanya satu parameter lambda.",
        "Skenario 2 — Laju berubah mengikuti waktu yang diketahui (siang vs malam, weekday vs weekend, musim). → Poisson NON-homogen: lambda(t) fungsi waktu. Alasan: aksioma stasioner dilanggar secara terang-terangan; memaksakan lambda konstan meratakan perbedaan yang penting untuk penjadwalan.",
        "Skenario 3 — Kejadian memicu kejadian lain (satu fraud berhasil memicu percobaan lanjutan; satu default memicu kepanikan). → Proses Hawkes (self-exciting). Alasan: aksioma independensi dilanggar — gerombolan di sini BUKAN kebetulan melainkan penularan; Poisson akan meremehkan risiko cluster.",
        "Skenario 4 — Interval tetap, peluang kecil per trial, banyak trial (n nasabah, masing-masing peluang default p kecil). → Binomial(n,p) — atau Poisson sebagai aproksimasi bila n besar, p kecil (limit Poisson). Alasan: bila yang natural adalah trial diskret (bukan waktu kontinu), binomial lebih langsung; Poisson adalah jalan pintas yang sah.",
        "Aturan praktis 10 detik: independen + laju stabil → Poisson; laju berubah terjadwal → non-homogen; kejadian menular → Hawkes; trial diskret → binomial. Ragu? Plot histogram jeda: bukan eksponensial → bukan Poisson homogen.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: memakai Poisson untuk antrean dengan kedatangan berkelompok kausal",
        type: "pitfall",
        body: "Contoh: kegagalan server memicu retry otomatis dari ribuan klien — lonjakan yang terlihat seperti gerombolan Poisson padahal kausal. Model Poisson akan berkata 7% jam sibuk adalah normal; kenyataannya lonjakan retry bisa 100x lipat dan berkorelasi. Selalu tanya: apakah satu kejadian bisa MENYEBABKAN kejadian lain? Bila ya, tinggalkan Poisson.",
      },
      reference: "Poisson = independensi. Ada penularan atau jadwal → naik kelas.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Berapa analis untuk malam yang sial?",
      prose: [
        "Skenario (sintetis, untuk latihan): SOC bank menerima alert fraud dengan laju lambda = 3 per jam, 24/7. Satu analis menangani 1 alert per 20 menit (3 per jam) dengan kualitas baik. Saat ini tiap shift malam (8 jam) dijaga 3 analis — kapasitas 72 alert per shift, tepat menutupi rata-rata 24 alert. Manajemen bertanya: berapa analis agar peluang shift kewalahan (alert datang lebih cepat daripada bisa ditangani) di bawah 1%?",
        "Pertanyaan analisis: (1) Berapa distribusi jumlah alert per shift 8 jam? (2) Dengan 4 analis (kapasitas 96 alert/shift), berapa peluang kewalahan? (3) Rekomendasi jumlah analis dan biayanya vs risiko satu alert Rp800 juta yang tertunda.",
        "Pembahasan: (1) N(8 jam) ~ Poisson(lambda t) = Poisson(24). (2) Peluang N > 96 untuk Poisson(24): memakai aproksimasi normal, z = (96,5 − 24)/akar(24) ≈ 14,8 — peluangnya praktis NOL (di bawah 10^(−40)). Bahkan 4 analis sangat berlebihan untuk kriteria 1%! Cek 3 analis (kapasitas 72): z = (72,5−24)/4,9 ≈ 9,9 — juga praktis nol. Hmm — jadi 3 analis cukup? (3) Tunggu: kriteria yang benar bukan per SHIFT, melainkan per JAM sibuk. Dalam 1 jam, kapasitas 3 analis = 9 alert; P(N(1 jam) > 9 | lambda=3) ≈ 0,0011 — sekitar 0,1%, atau ~9 jam per tahun. Dengan 2 analis (6/jam): P(N > 6) ≈ 0,034 — 3,4%, atau ~300 jam per tahun kewalahan. Rekomendasi: 3 analis per shift malam memberi margin yang sehat (0,1% jam kewalahan); penghematan 1 analis tidak sebanding dengan 300 jam antrean per tahun — dan satu alert Rp800 juta yang tertunda 40 menit sudah membayar gaji analis setahun.",
        "Catatan: perhitungan ini mengasumsikan alert independen. Bila ada serangan terkoordinasi (bukan Poisson), semua angka di atas optimistis — defense in depth tetap diperlukan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kesalahan fatal di mini-case ini adalah merancang kapasitas dari rata-rata per shift (24 alert vs kapasitas 72 — terlihat aman 3x lipat!) sambil mengabaikan variasi per jam. Agregasi menyembunyikan risiko: shift yang aman secara rata-rata bisa punya jam-jam yang mematikan. Selalu rancang pada granularitas waktu di mana kegagalan terjadi.",
      },
      reference: "Rancang kapasitas pada granularitas kegagalan (per jam), bukan pada agregat yang menenangkan (per shift).",
    },
    {
      id: "konsep-lanjutan",
      eyebrow: "Langkah 9 · Konsep lanjutan",
      title: "Non-homogen, thinning, superposisi — trik master proses Poisson",
      prose: [
        "Dua trik master yang membuat proses Poisson jauh lebih berguna di produksi adalah thinning dan superposisi — dan keduanya tidak mengubah keluarga distribusi. Thinning: ambil proses Poisson dengan laju lambda, lalu simpan tiap kejadian secara independen dengan peluang p (buang sisanya). Hasilnya tetap proses Poisson, dengan laju p·lambda. Contoh konkret: alert fraud datang lambda = 5 per jam, tetapi sistem auto-resolve menutup 60% tanpa campur tangan manusia (p = 0,4 yang lolos ke analis). Arus yang dihadapi analis = Poisson(2 per jam) — dan kamu tidak perlu mensimulasikan filternya, cukup kalikan lajunya. Kebalikannya, superposisi: gabungkan aliran-aliran Poisson yang independen — totalnya tetap Poisson dengan laju JUMLAHAN. Tiga cabang call center dengan lambda 2, 5, dan 7 per jam digabung ke satu antrean pusat = Poisson(14 per jam). Dua operasi ini adalah aljabar kedatangan: menipiskan atau menggabung tidak pernah keluar dari keluarga Poisson, selama independensi antar aliran terjaga.",
        "Laju konstan adalah asumsi, bukan hukum alam. Alert fraud naik saat jam kerja dan turun dini hari; default naik di musim krisis. Proses Poisson non-homogen (NHPP) mengganti lambda konstan dengan fungsi waktu lambda(t): jumlah kejadian dalam interval [0,t] tetap Poisson, tetapi parameternya adalah integral laju, Lambda(t) = integral dari 0 sampai t atas lambda(s) ds. Contoh angka: lambda(t) = 2 per jam pada jam sepi (22.00–06.00) dan 8 per jam pada jam sibuk (06.00–22.00). Dalam satu shift malam 8 jam: Lambda = 8 × 2 = 16, sehingga N ~ Poisson(16). Peluang dua jam pertama shift (22.00–24.00) sepi total = e^(−4) ≈ 0,0183 — sekitar 1,8%. Perhatikan: kamu tidak bisa lagi menulis lambda·t begitu saja; kamu harus mengintegralkan. Untuk lambda(t) tangga (piecewise constant), integralnya hanyalah jumlah dari lambda_i × durasi_i per segmen.",
        "Dualitas cantik antara count Poisson dan jeda eksponensial HANYA berlaku untuk laju konstan. Pada NHPP, jeda antar-kejadian tidak lagi eksponensial dan sifat memoryless runtuh: peluang 10 menit ke depan sepi bergantung pada posisi waktu saat ini, karena lambdanya berbeda. Contoh: pada 05.55 (lambda = 2/jam) peluang 10 menit ke depan sepi = e^(−2/6) ≈ 0,717; pada 06.05 (lambda = 8/jam) peluangnya = e^(−8/6) ≈ 0,264 — tiga kali lipat lebih kecil, hanya karena bergeser 10 menit melewati batas rezim. Aturan praktisi: sebelum memakai rumus jeda e^(−lambda t), tanyakan dulu apakah lambda stabil selama interval itu. Bila tidak, pecah interval per rezim dan kalikan peluang tiap segmennya.",
        "Mensimulasikan NHPP tidak butuh kalkulus — cukup thinning yang cerdas (metode Lewis–Shedler). Pilih lambda_maks = nilai terbesar lambda(t) (pada contoh di atas: 8). Bangkitkan proses Poisson homogen dengan laju lambda_maks — jeda eksponensial 1/8 jam, semudah lab Langkah 5. Untuk tiap kejadian pada waktu t, SIMPAN dengan peluang lambda(t)/lambda_maks, buang sisanya. Hasilnya persis NHPP dengan laju lambda(t). Angka: pada jam sibuk peluang simpan = 8/8 = 1 (semua disimpan); pada jam sepi = 2/8 = 0,25. Dari 1.000 kejadian homogen, yang tersimpan dari jam sibuk tetap 1.000 per 125 jam simulasi sementara dari jam sepi hanya seperempatnya — total tersimpan mencerminkan pola harian yang benar. Implementasi praktisnya lima baris: bangkitkan jeda eksponensial dengan scale 1/lambda_maks, kumulatifkan menjadi waktu kejadian, lalu untuk tiap waktu t simpan dengan peluang lambda(t)/lambda_maks memakai satu uniform acak. Uji kebenarannya: histogram count per segmen harus menempel pada Poisson(Lambda_segmen) — validasi yang sama seperti chart Langkah 6, tetapi per rezim. Simulasi ini adalah cara termurah untuk stress-test jadwal siaga terhadap laju yang berubah-ubah: jalankan 10.000 shift malam sintetis, hitung distribusi beban puncaknya, dan rancang kapasitas dari persentil-99 — bukan dari rata-rata.",
        "Jebakan estimasi laju yang paling mahal: lambda-topi = total kejadian / total waktu hanya sah bila laju STASIONER. Estimasi satu lambda untuk 24 jam dengan pola 2/jam (8 jam sepi) dan 8/jam (16 jam sibuk) memberi lambda-topi = (16 + 128)/24 = 6 per jam. Angka 6 ini salah di KEDUA rezim: ia meremehkan jam sibuk (yang butuh 8) dan melebihkan jam sepi (yang cukup 2). Kapasitas yang dirancang dari 6 akan kewalahan setiap jam sibuk dan menganggur setiap jam sepi — rugi dua arah. Prosedur senior: (1) plot estimasi laju per jam dalam sehari selama dua minggu — bila polanya bergelombang, jangan dirata-ratakan; (2) segmentasi waktu menjadi rezim yang homogen, estimasi lambda per segmen; (3) untuk tiap segmen, validasi dengan histogram jeda versus eksponensial seperti chart Langkah 6. Model kedatangan yang baik adalah model yang tahu jam berapa sekarang. Satu jebakan lanjutan: laju yang tampak stasioner dalam agregat harian bisa menyembunyikan pola mingguan — Senin pagi berbeda dari Minggu dini hari. Selalu plot dalam DUA granularitas (per jam dalam sehari, per hari dalam seminggu) sebelum memutuskan segmentasi final.",
      ],
      formula: String.raw`P(N_p(t) = k) = \frac{e^{-p\lambda t} (p\lambda t)^k}{k!}, \qquad k = 0, 1, 2, \ldots`,
      formulaNote: "N_p(t) = jumlah kejadian yang TERSISA setelah tiap kejadian asli disimpan dengan peluang p; p = fraksi yang lolos filter (0 < p ≤ 1); lambda, t, k seperti pada Langkah 3. Contoh: lambda = 5/jam, p = 0,4 (40% lolos ke analis), t = 1 jam → laju efektif 2/jam. Peluang analis menerima tepat 3 kasus dalam sejam = e^(−2)·2^3/3! ≈ 0,180. Tanpa thinning kamu harus mensimulasikan 5 kejadian lalu membuang 3 — dengan thinning, satu perkalian selesai.",
      tasks: [],
      note: {
        title: "Intuisi: lima heuristik laju untuk praktisi kedatangan",
        body: "Lima heuristik yang dipakai praktisi kedatangan setiap hari. Pertama, superposisi dulu, model belakangan: bila beban datang dari banyak sumber independen (cabang, kanal, jenis alert), jumlahkan laju mereka menjadi satu lambda_total sebelum menghitung apa pun — satu model Poisson(14) lebih jujur daripada tiga model yang dihitung terpisah lalu digabung dengan tangan. Kedua, filter = perkalian: tiap tahap penyaringan (auto-resolve, deduplikasi, triase) hanyalah p yang dikalikan ke lambda; rantai tiga filter 0,8 lalu 0,5 lalu 0,9 berarti laju akhir 0,36·lambda — tidak perlu simulasi berlapis. Ketiga, curigai laju sebelum curigai model: bila validasi histogram gagal, hal pertama yang dicek adalah kestasioneran lambda, bukan melompat ke Hawkes. Keempat, untuk simulasi NHPP jangan pernah menginversi CDF integral — thin saja proses homogen pada lambda_maks; lebih sederhana dan bebas galat numerik. Kelima, setiap estimasi laju punya tanggal kedaluwarsa: perilaku nasabah, pola serangan, dan musim berubah — jadwalkan re-estimasi tiap kuartal, dan waspadai drift tiba-tiba (lambda naik 30% dalam seminggu adalah sinyal yang harus diinvestigasi, bukan noise, sebelum kapasitas jebol).",
      },
      quiz: [
        {
          q: "Tiga aliran alert independen dengan laju 2, 5, dan 7 per jam digabung ke satu antrean. Distribusi jumlah alert per jam di antrean gabungan?",
          options: [
            { text: "Poisson(14) — superposisi: laju dijumlahkan, keluarga tetap Poisson", why: "Benar: gabungan aliran Poisson independen = Poisson dengan lambda = 2+5+7 = 14. Tidak perlu simulasi tiga aliran.", correct: true },
            { text: "Poisson(4,67) — rata-rata ketiga laju", why: "Salah: merata-ratakan laju menghilangkan total beban; antrean menerima JUMLAH kejadian, bukan rata-ratanya." },
            { text: "Normal(14, 14) — memakai aproksimasi normal", why: "Salah: aproksimasi normal untuk Poisson(14) memang lumayan, tetapi distribusi eksaknya tetap Poisson — dan soal menanyakan distribusinya." },
            { text: "Tidak bisa ditentukan tanpa data korelasi antar cabang", why: "Salah: soal menyatakan aliran independen — syarat superposisi terpenuhi, tidak butuh data tambahan." },
          ],
        },
        {
          q: "Alert datang lambda = 5/jam; 60% auto-resolve tanpa analis (p = 0,4 lolos). Laju yang dihadapi analis dan peluang ia menerima tepat 3 kasus dalam sejam?",
          options: [
            { text: "Poisson(2/jam); P = e^(−2)·2^3/3! ≈ 0,180", why: "Benar: thinning — laju efektif = 0,4 × 5 = 2/jam, lalu PMF Poisson biasa.", correct: true },
            { text: "Poisson(5/jam); P = e^(−5)·5^3/3! ≈ 0,140", why: "Salah: lupa menerapkan filter — analis tidak melihat 5/jam, hanya 2/jam yang lolos." },
            { text: "Poisson(3/jam); P = e^(−3)·3^3/3! ≈ 0,224", why: "Salah: 3/jam adalah laju yang TERBUANG (60%), bukan yang lolos (40%)." },
            { text: "Binomial(5; 0,4) per jam", why: "Salah: thinning proses Poisson menghasilkan Poisson, bukan Binomial — Binomial untuk trial diskret tetap." },
          ],
        },
        {
          q: "Data 24 jam: 8 jam sepi (2/jam) + 16 jam sibuk (8/jam). Seorang analis mengestimasi satu lambda = 6/jam untuk seluruh hari. Penilaianmu?",
          options: [
            { text: "Menyesatkan di kedua rezim — segmentasi per rezim, estimasi lambda per segmen", why: "Benar: 6 meremehkan jam sibuk dan melebihkan jam sepi; kapasitas dari angka ini rugi dua arah.", correct: true },
            { text: "Sudah benar — 6 adalah MLE yang sah", why: "Salah: MLE 6 sah secara matematis untuk SATU lambda, tetapi model satu-lambda salah untuk data dua rezim." },
            { text: "Kurang data — butuh 30 hari dulu", why: "Salah: masalahnya bukan jumlah data, melainkan model yang mengasumsikan stasioneritas yang tidak ada." },
            { text: "Ganti ke distribusi normal saja", why: "Salah: mengganti distribusi tidak memperbaiki akar masalah — laju yang berubah terhadap waktu." },
          ],
        },
      ],
      reference: "Thinning & superposisi = aljabar Poisson. Laju berubah → NHPP: integralkan, segmentasi, thin untuk simulasi.",
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
        "Proses Poisson: kedatangan acak dengan tiga aksioma (stasioner, independen, satu-per-satu); N(t) ~ Poisson(lambda t).",
        "Rumus kunci: P(N(t)=k) = e^(−lambda t)(lambda t)^k/k! — untuk count; P(T>t) = e^(−lambda t) — untuk jeda.",
        "Jeda antar-kedatangan ~ eksponensial dan memoryless: lama menunggu tidak mengubah peluang ke depan.",
        "Gerombolan adalah fitur alami Poisson, bukan anomali — kapasitas dirancang dari ekor, bukan rata-rata.",
        "Ada penularan antar-kejadian → Hawkes; laju berubah terjadwal → Poisson non-homogen; trial diskret → binomial.",
      ],
      quiz: [
        {
          q: "Alert fraud datang dengan laju 3 per jam (Poisson). Peluang tepat 5 alert dalam 2 jam ke depan?",
          options: [
            { text: "e^(−6)·6^5/5! ≈ 0,161 — Poisson dengan mu = lambda·t = 6", why: "Benar: N(2 jam) ~ Poisson(3·2 = 6). Peluang tepat 5 = e^(−6)·6^5/120 ≈ 0,1606. Kuncinya: kalikan laju dengan panjang interval DULU.", correct: true },
            { text: "e^(−3)·3^5/5! ≈ 0,101", why: "Salah: lupa mengalikan dengan t=2 jam. Mu yang dipakai harus 6, bukan 3." },
            { text: "5/6 ≈ 0,833", why: "Salah: ini bukan peluang — membagi k dengan mu tidak punya makna probabilistik." },
            { text: "Tidak bisa dihitung tanpa data historis", why: "Salah: model Poisson memberi jawaban langsung dari lambda; data historis hanya untuk mengestimasi lambda." },
          ],
        },
        {
          q: "Sudah 45 menit tidak ada alert (laju 3/jam). Peluang 15 menit ke depan tetap sepi?",
          options: [
            { text: "e^(−3·0,25) ≈ 0,472 — sama seperti bila baru mulai menunggu (memoryless)", why: "Benar: memoryless — 45 menit sepi tidak mengubah apa pun. Peluang 15 menit ke depan sepi = e^(−lambda·t) = e^(−0,75) ≈ 0,472.", correct: true },
            { text: "Mendekati 0 — sudah lama sepi, pasti segera ramai", why: "Salah: ini gambler's fallacy versi waktu. Proses Poisson tidak punya ingatan dan tidak punya utang." },
            { text: "Mendekati 1 — tren sepi akan berlanjut", why: "Salah: kebalikan dari fallacy di atas, sama salahnya. Peluangnya tetap 0,472." },
            { text: "0,0498 — sama dengan peluang 1 jam sepi", why: "Salah: 0,0498 adalah untuk interval 1 jam penuh; di sini intervalnya 15 menit (0,25 jam)." },
          ],
        },
        {
          q: "Manajer shift melihat 5 alert dalam 2 menit dan menyimpulkan ada serangan terkoordinasi. Dengan lambda=3/jam, penilaian yang benar?",
          options: [
            { text: "Hitung dulu peluangnya di bawah Poisson — gerombolan seperti ini mungkin terjadi secara alami dan bukan bukti serangan", why: "Benar: P(5+ dalam 2 menit) = P(Poisson(0,1) ≥ 5) ≈ sangat kecil per 2-menit, tetapi dalam ribuan blok 2-menit per tahun, kejadian langka PASTI muncul. Tuduhan serangan butuh bukti dependensi, bukan sekadar gerombolan.", correct: true },
            { text: "Benar — 5 dalam 2 menit tidak mungkin kebetulan", why: "Salah: tidak mungkin dalam SATU blok spesifik ≠ tidak mungkin dalam setahun operasi. Law of truly large numbers." },
            { text: "Salah — Poisson tidak pernah bergerombol", why: "Salah: kebalikan yang sama kelirunya. Poisson PASTI bergerombol — itu fitur, bukan bug." },
            { text: "Ganti modelnya ke binomial", why: "Salah: mengganti model tidak menjawab pertanyaan; yang dibutuhkan adalah uji hipotesis yang benar di bawah model yang ada." },
          ],
        },
        {
          q: "Data jeda antar-default menunjukkan dua punuk (banyak jeda sangat pendek DAN sangat panjang). Artinya?",
          options: [
            { text: "Bukan Poisson homogen — kemungkinan ada dua rezim laju (mis. krisis vs normal); pertimbangkan mixture atau non-homogen", why: "Benar: jeda Poisson homogen harus eksponensial (satu punuk menurun). Dua punuk = dua rezim. Model satu-lambda akan salah di kedua rezim.", correct: true },
            { text: "Tetap Poisson — dua punuk adalah variasi sampling", why: "Salah: dengan data cukup, dua punuk yang jelas bukan variasi sampling — itu sinyal struktural." },
            { text: "Pakai lambda = rata-rata kedua punuk", why: "Salah: meratakan dua rezim menghasilkan model yang salah untuk keduanya — seperti sepatu rata-rata untuk kaki besar dan kecil." },
            { text: "Hapus data punuk kedua sebagai pencilan", why: "Salah: menghapus rezim krisis dari data default adalah cara tercepat membuat model risiko yang buta krisis." },
          ],
        },
        {
          q: "Kapan memakai aproksimasi Poisson untuk Binomial(n, p)?",
          options: [
            { text: "n besar, p kecil, np sedang — limit Poisson: banyak trial, tiap trial jarang sukses", why: "Benar: Binomial(10.000 nasabah, p=0,0003) ≈ Poisson(3). Syarat klasik: n ≥ 100, p ≤ 0,01, np < 10 sebagai aturan kasar.", correct: true },
            { text: "Selalu — Poisson lebih sederhana", why: "Salah: bila p besar (mis. 0,4), aproksimasi buruk — Binomial(100, 0,4) tidak mirip Poisson(40) karena variansi Binomial = np(1−p) ≠ np." },
            { text: "Tidak pernah — keduanya tidak berhubungan", why: "Salah: Poisson adalah limit Binomial saat n→∞, p→0, np konstan — hubungan fundamental, bukan kebetulan." },
            { text: "Hanya bila datanya sudah pasti Poisson", why: "Salah: melingkar — aproksimasi justru dipakai saat menghitung Binomial eksak tidak praktis." },
          ],
        },
      ],
    },
  ],
};
