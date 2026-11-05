import type { V2Lesson } from "../lib/types";

// ── Figure: deret waktu harga gas + 1 anomali ─────────────────────────────
const GAS_SVG = `<svg viewBox="0 0 620 270" role="img" aria-label="Deret waktu harga gas dengan satu lonjakan anomali">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="48" y1="220.0" x2="590" y2="220.0"/>
<line x1="48" y1="177.4" x2="590" y2="177.4"/>
<line x1="48" y1="134.8" x2="590" y2="134.8"/>
<line x1="48" y1="92.2" x2="590" y2="92.2"/>
<line x1="48" y1="49.6" x2="590" y2="49.6"/>
</g><g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="42" y="224.0">0</text>
<text x="42" y="181.4">50</text>
<text x="42" y="138.8">100</text>
<text x="42" y="96.2">150</text>
<text x="42" y="53.6">200</text>
</g>
<polyline points="48.0,175.7 59.5,173.1 71.1,177.4 82.6,174.8 94.1,174.0 105.7,176.5 117.2,175.7 128.7,172.3 140.3,174.8 151.8,175.7 163.3,174.0 174.9,173.1 186.4,174.8 197.9,175.7 209.4,176.5 221.0,174.0 232.5,174.8 244.0,175.7 255.6,173.1 267.1,174.0 278.6,174.8 290.2,175.7 301.7,174.0 313.2,174.8 324.8,175.7 336.3,174.0 347.8,174.8 359.4,41.0 370.9,173.1 382.4,174.8 394.0,175.7 405.5,174.0 417.0,174.8 428.6,175.7 440.1,173.1 451.6,174.0 463.1,175.7 474.7,174.8 486.2,174.0 497.7,175.7 509.3,174.8 520.8,174.0 532.3,173.1 543.9,175.7 555.4,174.8 566.9,174.0 578.5,174.8 590.0,175.7" fill="none" stroke="var(--c1)" stroke-width="1.6"/>
<circle cx="359.4" cy="41.0" r="6" fill="var(--c2)"/>
<text x="369.4" y="33.0" font-size="11" fill="var(--c2)" font-family="var(--font-ui)">anomali: 210 gwei (z ≈ 127)</text>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)"><text x="48" y="14">harga gas (gwei) per blok — data sintetis</text><text x="590" y="246" text-anchor="end">blok</text></g></svg>`;

export const bcd21: V2Lesson = {
  slug: "bcd21-anomali-deret-waktu",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "Anomaly Detection Deret Waktu On-Chain: Alarm yang Tak Tidur",
  estMinutes: 48,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Alarm jam 3 pagi yang menyelamatkan (atau menghancurkan)",
      prose: [
        "Jam 3 pagi, ponselmu bergetar: “ALERT: deviasi feed harga ETH/USD 12% dalam 5 menit.” Kamu operator oracle — Chainlink-style data feed yang memberi makan protokol lending miliaran dolar. Skenarionya ada dua. Skenario A: kamu bangun, memverifikasi, ternyata agregator salah satu node macet — kamu mem-pause feed sebelum protokol lending melikuidasi ribuan posisi sehat berdasarkan harga palsu. Skenario B: kamu mematikan alarmnya bulan lalu karena “terlalu berisik” — dan pagi ini protokol kehilangan $40 juta dari likuidasi yang dipicu data sesat.",
        "Twist-nya: dalam sejarah DeFi, beberapa kerugian terbesar BUKAN berasal dari hacker yang canggih — melainkan dari DATA yang salah pada waktu yang salah: feed harga yang macet, decimal yang bergeser, agregator yang diam-diam berhenti update. Musuhnya bukan selalu penjahat; seringkali ia adalah keheningan — data yang berhenti bicara tanpa memberi tahu.",
        "Itulah kenapa lowongan seperti JD Chainlink menulis eksplisit “anomaly detection + SLO alerting” sebagai keterampilan inti: menjaga feed data dan protokol berarti membangun ALARM YANG TAK TIDUR — detektor anomali deret waktu yang presisi, dengan aturan paging yang membuat manusia tetap mau bangun saat ia berbunyi. Di lesson ini kamu membangunnya: dari z-score bergulir sampai filosofi alert yang tidak melelahkan.",
      ],
      tasks: [],
      note: {
        title: "Batas lesson ini — baca dulu",
        type: "risk",
        body: "Lesson bcd7 membahas POLA FRAUD aktor on-chain: clustering address, pencucian, skema penipuan — sudut pandang “siapa penjahatnya”. Lesson INI tidak mengulang itu — ia membahas ANOMALI DERET WAKTU + ALERTING OPERASIONAL: metrik yang berubah secara tak wajar terhadap waktunya (gas, TVL, deviasi feed, throughput) dan cara membangun alarm yang bisa diandalkan untuk feed data/protokol. Kalau pertanyaanmu “apakah address ini penipu?”, ke bcd7; kalau “apakah metrik ini rusak dan siapa yang harus dibangunkan?”, di sini.",
      },
      reference: "bcd7 = forensik aktor (siapa). bcd21 = monitoring metrik (apa yang rusak) + alerting (kapan bangunkan manusia).",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) mengklasifikasikan jenis anomali deret waktu on-chain (spike, level shift, variance change, missing data) dan contohnya; (2) mengimplementasikan detektor rolling z-score dan menjelaskan kapan ia gagal (drift, musiman); (3) merancang kebijakan alerting ala SLO — memisahkan page vs ticket, mengelola alert fatigue; (4) memilih metrik yang tepat untuk dimonitor pada feed data/protokol (deviasi, freshness, throughput).",
        "Rutenya: cerita + batas lesson → bekal ringkas → tiga konsep inti (jenis anomali, rolling z-score/CUSUM, SLO alerting) → lab Pyodide (detektor anomali gas) → chart deret gas dengan panduan baca → peta keputusan → mini-case oracle → kuis → rangkuman. Estimasi 48 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, dari fraud on-chain: analis fraud mencari POLA perilaku jahat — address yang terhubung, aliran dana mencurigakan, skema berulang. Anomali deret waktu melengkapinya dari sisi lain: bukan “siapa”, melainkan “kapan metrik menyimpang dari kebiasaannya” — keduanya bisa digabung (anomali memicu investigasi forensik). Kedua, dari indexing skala besar: data on-chain mentah harus diindeks menjadi deret waktu yang query-able (per blok/menit) sebelum bisa dimonitor — detektor hanya sebagus pipeline datanya; feed yang telat 10 menit membuat alarm tercepat pun basi.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: forensik (bcd7) = detektif yang menyelidiki TKP setelah kejadian. Monitoring (lesson ini) = satpam dengan CCTV yang berteriak SAAT kejadian. Sistem keamanan butuh keduanya — tetapi satpam yang berteriak untuk setiap kucing lewat akan diabaikan saat perampok datang.",
      ],
      reference: "Bekal: (1) fraud = pola aktor; anomali = penyimpangan metrik — komplementer; (2) butuh pipeline deret waktu yang segar sebelum detektor berguna.",
    },
    {
      id: "konsep-jenis",
      eyebrow: "Langkah 3 · Konsep",
      title: "Anomali On-Chain — Si Penyusup di Deret Waktu",
      prose: [
        "Definisi: anomali deret waktu adalah titik/periode yang menyimpang signifikan dari perilaku normal metriknya. Empat keluarga: (1) SPIKE — lonjakan tajam sesaat lalu kembali (gas 50→210 gwei satu blok; penyebab: NFT mint massal, serangan, atau bug); (2) LEVEL SHIFT — lompatan ke level baru yang bertahan (TVL turun 40% dan tidak kembali; penyebab: migrasi, exploit, penarikan paus); (3) VARIANCE CHANGE — rata-rata sama tetapi gejolak berubah (volatilitas feed harga naik 10×; penyebab: pasar stres atau agregator rusak); (4) MISSING/STALE DATA — data berhenti atau tidak update (feed oracle tidak refresh 30 menit; penyebab paling berbahaya karena “tidak ada data” sering tidak memicu alarm apa pun).",
        "Kepribadiannya: tiap keluarga adalah penyusup dengan modus berbeda — dan detektor yang menangkap satu belum tentu menangkap lainnya. z-score hebat untuk spike, buta untuk level shift yang landai (ia “beradaptasi” dan menganggap level baru sebagai normal), dan sama sekali tidak melihat missing data (tidak ada titik = tidak ada z-score). Analis yang hanya punya satu detektor seperti satpam yang hanya memeriksa pintu depan.",
        "Kapan memakai: petakan metrik ke keluarganya DULU, baru pilih detektor. Feed harga → spike + stale; TVL protokol → level shift; gas → spike + musiman harian; throughput indexer → stale + variance. JANGAN memakai satu ambang untuk semua metrik — “gas > 200” dan “TVL turun 5%” adalah dua bahasa yang berbeda.",
      ],
      formula: String.raw`\text{staleness} = t_{\text{sekarang}} - t_{\text{update terakhir}} > \text{ambang}_{\text{segar}}`,
      formulaNote: "Bukan rumus statistik — melainkan alarm paling sederhana dan paling sering dilupakan: umur data. Contoh: feed harga yang seharusnya update tiap 60 detik, ambang segar 300 detik; staleness 1.800 detik = feed MATI selama 30 menit — alarm ini harus berbunyi SEBELUM detektor statistik apa pun, karena tanpa data segar, semua statistik adalah dusta. Interpretasi: monitor “apakah datanya hidup” sebelum “apakah datanya aneh”.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Semua anomali = serangan, harus direspons sebagai insiden keamanan”",
        type: "pitfall",
        body: "Yang benar: anomali adalah PENYIMPANGAN, bukan vonis. Spike gas bisa jadi NFT mint yang sah; level shift TVL bisa jadi migrasi terencana; feed macet bisa jadi bug, bukan hack. Respons pertama analis adalah KLASIFIKASI (apa jenisnya? apa penyebabnya?), bukan kepanikan. Alarm yang selalu berarti “serangan!” akan segera diabaikan — termasuk saat serangan sungguhan datang.",
      },
      hints: [
        "💡 Intuisi: urutan respons yang benar — deteksi (ada yang aneh) → klasifikasi (jenis & penyebab) → eskalasi proporsional. Melompat dari deteksi ke eskalasi adalah cara tercepat membunuh kepercayaan pada sistem alarm.",
      ],
      reference: "4 keluarga: spike, level shift, variance change, stale. Pilih detektor per keluarga; monitor staleness dulu.",
    },
    {
      id: "konsep-detektor",
      eyebrow: "Langkah 4 · Konsep",
      title: "Rolling Z-Score & CUSUM — Si Penjaga Bergulir",
      prose: [
        "Definisi: rolling z-score mengukur keganjilan titik RELATIF terhadap jendela terakhir: z = (x − μ_w)/σ_w, dengan μ_w, σ_w dari w titik sebelumnya (mis. 24 blok). “Bergulir” artinya baseline-nya BERGERAK mengikuti data — tidak seperti ambang statis (“gas > 200”) yang mati saat perilaku normal bergeser (drift). CUSUM (cumulative sum) melengkapinya untuk level shift: ia mengakumulasi penyimpangan kecil yang konsisten — S = max(0, S_sebelum + (x − μ − k)) — sehingga pergeseran landai yang lolos dari z-score per-titik akhirnya tertangkap oleh akumulasinya.",
        "Kepribadiannya: rolling z-score adalah penjaga yang ingatannya 24 blok — cukup panjang untuk tahu “normal”, cukup pendek untuk melupakan “dulu”. CUSUM adalah akuntan yang sabar — ia tidak berteriak untuk satu keanehan, tetapi mencatat setiap penyimpangan kecil sampai bukti terkumpul. Kombinasi keduanya menutup dua kelemahan: z-score menangkap spike, CUSUM menangkap pergeseran landai.",
        "Kapan memakai: rolling z untuk metrik berfluktuasi cepat (gas, deviasi feed); CUSUM untuk metrik level (TVL, saldo, throughput). JANGAN memakai rolling z pada data MUSIMAN kuat tanpa dekomposisi dulu (pola harian gas akan memicu alarm setiap sore) — dan JANGAN memakai jendela terlalu pendek (noise) atau terlalu panjang (lambat beradaptasi; anomali lama “tertelan” baseline).",
      ],
      formula: String.raw`z_t = \frac{x_t - \mu_{w}}{\sigma_{w}} \qquad S_t = \max\!\left(0,\, S_{t-1} + (x_t - \mu - k)\right)`,
      formulaNote: "z_t = z-score titik t; μ_w, σ_w = rata-rata & simpangan baku jendela w titik SEBELUM t (bukan termasuk t — agar anomali tidak “mengencerkan” dirinya sendiri); S_t = statistik CUSUM; k = kelonggaran (setengah dari pergeseran yang ingin dideteksi). Contoh: gas normal μ≈53, σ≈1,5; x=210 → z≈127 — bukan “agak aneh”, melainkan mustahil secara statistik. Interpretasi: z mengukur “berapa sigma keanehan”; CUSUM mengukur “sudah berapa lama keanehan kecil ini bertahan”.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Ambang statis (gas > 200 gwei) cukup — sederhana dan jelas”",
        type: "pitfall",
        body: "Yang benar: ambang statis mati oleh DRIFT. Bila baseline gas naik permanen ke 250 (mis. setelah upgrade yang menaikkan permintaan blok), ambang 200 berbunyi SELAMANYA — alarm menjadi noise dan dimatikan. Rolling baseline beradaptasi: ia bertanya “aneh RELATIF terhadap minggu ini?”, bukan “aneh menurut 2021?”.",
      },
      hints: [
        "💡 Intuisi: ambang statis = menilai murid dengan standar tahun 1990; rolling = menilai relatif terhadap kelasnya semester ini. Keduanya bisa benar — tetapi hanya yang kedua yang tetap relevan saat zaman berubah.",
      ],
      reference: "Rolling z = spike; CUSUM = level shift landai. Jendela: cukup panjang untuk normal, cukup pendek untuk adaptif.",
    },
    {
      id: "konsep-slo",
      eyebrow: "Langkah 5 · Konsep",
      title: "SLO Alerting — Si Alarm yang Tak Lelah",
      prose: [
        "Definisi: SLO (service level objective) alerting memperlakukan monitoring seperti kontrak layanan: tetapkan target (mis. “99,9% update feed < 60 detik”), ukur ERROR BUDGET (0,1% kegagalan yang “diizinkan”), dan picu PAGE (bangunkan manusia) hanya bila laju pembakaran budget (burn rate) menunjukkan budget akan habis sebelum waktunya. Aturan emasnya: PAGE untuk yang butuh manusia SEKARANG (feed mati, deviasi > ambang kritis); TICKET (catat, tangani jam kerja) untuk yang bisa menunggu (drift lambat, anomali non-kritis). Setiap page WAJIB punya runbook — “bila alarm ini bunyi, lakukan 1-2-3”.",
        "Kepribadiannya: SLO alerting adalah manajer yang melindungi tidurmu — ia tahu bedanya “penting” dan “mendesak”, dan ia mengukur dirinya sendiri: rasio page yang actionable (bila < 50% page-mu adalah false alarm, ambangmu salah, bukan duniamu yang terlalu berisik). Prinsip paling brutalnya: SETIAP page yang tidak bisa ditindaklanjuti adalah bug — perbaiki ambangnya atau hapus alarmnya. Alarm yang tidak bisa ditindaklanjuti bukan “lebih aman”, ia adalah racun yang membunuh kepercayaan.",
        "Kapan memakai: framework ini WAJIB untuk siapa pun yang menjaga feed/protokol produksi (inilah yang diminta JD Chainlink: anomaly detection + SLO alerting). JANGAN page untuk metrik vanity (“TVL naik 2%!” — itu kabar gembira, bukan insiden) dan JANGAN ticket untuk yang kritis (“feed mati 30 menit” bukan tiket jam kerja — itu page).",
      ],
      formula: String.raw`\text{burn rate} = \frac{\text{laju error saat ini}}{\text{laju error yang diizinkan}} > 1 \Rightarrow \text{PAGE}`,
      formulaNote: "Laju error yang diizinkan = (1 − target SLO) per satuan waktu; mis. SLO 99,9% per 30 hari → budget 43 menit downtime/bulan. Burn rate 2 berarti budget terbakar 2× lebih cepat dari rencana — page SEKARANG sebelum budget habis. Interpretasi: burn rate mengubah “ada error” menjadi “seberapa cepat kita kehabisan toleransi” — bahasa yang tepat untuk memutuskan bangun-tidak-bangun jam 3 pagi.",
      tasks: [],
      hints: [
        "💡 Intuisi: error budget adalah “jatah sakit” sistem — seperti cuti sakit karyawan: boleh dipakai, tetapi bila habis di minggu pertama, ada yang salah besar. Burn rate = seberapa cepat jatah itu dipakai.",
      ],
      reference: "Page = butuh manusia sekarang + ada runbook. Ticket = sisanya. Page tak-actionable = bug, perbaiki ambangnya.",
    },
    {
      id: "lab-detektor",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Bangun detektor anomali gas",
      prose: [
        "Waktunya jadi satpam on-chain-nya. Di bawah ada 48 harga gas (gwei) per blok — sintetis, dengan satu penyusup di dalamnya. Tugasmu: tulis tiga fungsi — `rolling_stats(s, i, w)` (mean & pstdev dari w titik SEBELUM indeks i), `zscore(x, mu, sd)`, dan `detect(s, w, ambang)` (list tuple (indeks, z_bulat_1_desimal) untuk |z| > ambang) — lalu jalankan dengan w=24, ambang=3,0.",
        "Coba: setelah lolos, turunkan ambang ke 2,0. Berapa anomali terdeteksi? Lalu naikkan ke 5,0. Itulah trade-off presisi-recall yang kamu atur sebagai pemilik alarm — dan setiap angkanya adalah janji tentang berapa kali ponselmu bergetar sia-sia.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `rolling_stats(s, i, w)`: `(mean, pstdev)` dari `s[i-w:i]`" },
        { id: "t2", text: "Lengkapi `zscore(x, mu, sd)`: `(x − mu) / sd`" },
        { id: "t3", text: "Lengkapi `detect(s, w, ambang)`: list `(i, round(z,1))` dengan `abs(z) > ambang`, untuk i dari w sampai akhir" },
        { id: "t4", text: "Jalankan (w=24, ambang=3.0) dan pastikan baris anomali tercetak" },
      ],
      expected: "anomali=[(27, 127.0)]",
      hints: [
        "Gunakan `statistics.mean` dan `statistics.pstdev` — sudah diimpor.",
        "Indeks 27 (0-based) = blok ke-28. z-nya raksasa karena jendela 24 titik sebelumnya sangat stabil (σ ≈ 1,2).",
        "Ambang 2,0 akan menangkap beberapa titik normal (false positive) — rasakan bedanya.",
      ],
      code: {
        starter: `import statistics

# Harga gas SINTETIS per blok (gwei) — bukan data mainnet asli
gas = [52,55,50,53,54,51,52,56,53,52,54,55,53,52,51,54,53,52,55,54,53,52,54,53,
       52,54,53,210,55,53,52,54,53,52,55,54,52,53,54,52,53,54,55,52,53,54,53,52]

# TULIS KODEMU: tiga fungsi di bawah ini
def rolling_stats(s, i, w):
    return

def zscore(x, mu, sd):
    return

def detect(s, w, ambang):
    return

flags = detect(gas, 24, 3.0)
print(f"anomali={[(i, round(z, 1)) for i, z in flags]}")`,
        lockLines: 4,
        solution: `import statistics

# Harga gas SINTETIS per blok (gwei) — bukan data mainnet asli
gas = [52,55,50,53,54,51,52,56,53,52,54,55,53,52,51,54,53,52,55,54,53,52,54,53,
       52,54,53,210,55,53,52,54,53,52,55,54,52,53,54,52,53,54,55,52,53,54,53,52]

# TULIS KODEMU: tiga fungsi di bawah ini
def rolling_stats(s, i, w):
    win = s[i-w:i]
    return statistics.mean(win), statistics.pstdev(win)

def zscore(x, mu, sd):
    return (x - mu) / sd

def detect(s, w, ambang):
    out = []
    for i in range(w, len(s)):
        mu, sd = rolling_stats(s, i, w)
        z = zscore(s[i], mu, sd if sd > 0 else 1e-9)
        if abs(z) > ambang:
            out.append((i, z))
    return out

flags = detect(gas, 24, 3.0)
print(f"anomali={[(i, round(z, 1)) for i, z in flags]}")`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "anomali=\\[\\(27, 127\\.0\\)\\]", label: "Satu anomali di indeks 27 (z ≈ 127)", msg: "210 gwei vs baseline μ≈53, σ≈1,2 → z ≈ 127. Spike yang mustahil secara statistik." },
          { kind: "stdout_matches", task: "t4", pattern: "anomali=\\[", label: "Baris anomali tercetak", msg: "Format: anomali=[(indeks, z), ...]." },
        ],
      },
      reference: "Rolling z: baseline bergerak, anomali tidak ikut mengencerkan dirinya. Atur ambang = atur janji alarm.",
    },
    {
      id: "chart-gas",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca deret gas seperti operator",
      prose: [
        "Chart di bawah memplot 48 blok harga gas dari lab-mu — garis datar di ~53 gwei, dengan satu titik merah yang menjulang.",
        "Cara membaca: sumbu X = nomor blok; sumbu Y = harga gas (gwei); garis = harga per blok; titik merah = anomali yang ditangkap detektormu (indeks 27, 210 gwei, z ≈ 127).",
        "Interpretasi: inilah “mudahnya” kasus ini — spike tunggal yang jelas, baseline stabil. Dunia nyata lebih kejam: baseline-nya drift (upgrade, musim NFT), ada pola harian (jam sibuk), dan spike “kecil” 2–3σ yang ambigu. Pelajaran chart ini dua arah: (1) detektor sederhana sudah cukup untuk anomali RAKSASA — jangan over-engineering untuk yang jelas; (2) nilai sebenarnya dari sistem monitoring justru pada kasus AMBIGU — di sanalah CUSUM, dekomposisi musiman, dan kebijakan SLO bekerja. Titik merah ini adalah ujian pertama; ujian sesungguhnya adalah 1.000 titik abu-abu di sekitarnya.",
      ],
      figure: {
        svg: GAS_SVG,
        alt: "Deret waktu 48 blok harga gas datar di ~53 gwei dengan satu lonjakan merah ke 210 gwei di blok 28.",
        caption: "Harga gas per blok (sintetis). Titik merah = anomali terdeteksi (z ≈ 127).",
      },
      tasks: [],
      note: {
        title: "Intuisi: detektor yang baik mengenal musim, bukan cuma mengenali spike",
        body: "Spike gas 4 kali lipat dari baseline memang mudah ditangkap — detektor z-score sederhana pun menemukannya. Tetapi nilai sebenarnya dari sistem monitoring on-chain bukan di sana; ia ada di 1.000 titik abu-abu di sekitarnya: drift baseline setelah upgrade protokol, pola harian jam sibuk Asia versus Amerika, dan anomali \"kecil\" 2 sampai 3 sigma yang ambigu antara noise dan serangan. Heuristik praktisi: dekomposisi dulu, deteksi kemudian — pisahkan tren dan musiman sebelum bertanya \"apakah ini aneh\", karena threshold tetap pada baseline yang hidup hanya menghasilkan dua hal: false positive saat musim sibuk, false negative saat musim sepi. Aturan tiering-nya konkret: z di atas 3 berarti investigasi (catat, korelasikan dengan event yang diketahui), z di atas 5 berarti page operator; apa pun yang mem-page lebih dari 2 kali seminggu akan di-mute — dan mute itulah kematian monitoring. Jebakan on-chain yang khas: setiap anomali terlihat seperti serangan, padahal mayoritas adalah perilaku normal yang belum dimodelkan — airdrop populer, migrasi likuiditas. Maka setiap alert wajib membawa konteks — \"apa yang berubah di sekitar waktu ini\" — bukan sekadar angka. Detektor yang baik bukan yang paling sensitif, melainkan yang paling jarang salah membangunkan orang.",
      },
      reference: "Spike raksasa = ujian pertama (mudah). Kasus ambigu (drift, musiman, 2–3σ) = ujian sesungguhnya.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Alarm apa untuk metrik apa?",
      prose: [
        "Lima skenario monitoring yang dihadapi operator feed/protokol:",
        "Skenario 1 — Feed harga oracle: deviasi > 2% antar-sumber atau staleness > 5 menit. → PAGE + runbook (verifikasi agregator, pause bila perlu). Alasan: feed harga adalah nyawa protokol lending — keterlambatan = likuidasi salah = uang hilang.",
        "Skenario 2 — Spike gas 4σ satu blok, kembali normal. → TICKET + catat (bukan page). Alasan: spike sesaat biasanya peristiwa pasar yang sah (mint, volatilitas) — membangunkan manusia untuknya adalah resep fatigue. Page hanya bila bertahan (CUSUM) atau berulang.",
        "Skenario 3 — TVL protokol turun 30% dalam sehari dan bertahan. → PAGE (level shift, CUSUM menangkapnya). Alasan: ini bukan fluktuasi — ini eksodus atau exploit; butuh manusia SEKARANG untuk klasifikasi.",
        "Skenario 4 — False positive > 50% dari page sebulan terakhir. → BUKAN “tambah waspada” — tetapi NAIKKAN ambang / perbaiki detektor / hapus alarm tak-actionable. Alasan: alarm yang separuh salah akan diabaikan seluruhnya — termasuk yang benar. Ini bug sistem, bukan kewaspadaan.",
        "Skenario 5 — Metrik baru (“kami ingin monitor X”). → Tanya dulu: bila alarm ini bunyi jam 3 pagi, APA yang dilakukan manusia? Bila jawabannya “tidak tahu” — jangan buat page; buat dashboard + ticket dulu sampai runbook-nya jelas. Alasan: page tanpa runbook = kepanikan terjadwal.",
        "Aturan praktis 10 detik: staleness dulu → detektor per keluarga anomali → page hanya bila actionable + ada runbook → audit false positive tiap bulan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menambah SEMUA metrik sebagai page “agar aman” — lalu tim mematikan notifikasi dalam sebulan karena 200 page/hari. “Aman” yang melelahkan = tidak aman. Disiplin SLO: page sedikit, tajam, dan selalu bisa ditindaklanjuti.",
      },
      reference: "Page = kritis + actionable + runbook. Sisanya = ticket/dashboard. Audit false positive bulanan.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Feed yang diam selama 40 menit",
      prose: [
        "Skenario (sintetis, untuk latihan — pola meniru insiden oracle nyata): Protokol lending memakai feed ETH/USD yang update tiap ~60 detik dari 5 node agregator. Senin 02:40, 3 dari 5 node berhenti mengirim (bug update klien) — median dari 2 node tersisa masih “masuk akal” (deviasi < 1%), sehingga detektor DEVIASI diam. Tetapi 2 node itu kebetulan sedang dalam kondisi jaringan buruk dan harganya basi 40 menit — sementara harga ETH spot turun 8%. Protokol terus memberi pinjaman dengan valuasi agunan 8% lebih tinggi dari seharusnya. Tidak ada alarm yang bunyi — karena semua alarm memonitor DEVIASI, bukan STALENESS.",
        "Pertanyaan analisis: (1) Kenapa detektor deviasi gagal? (2) Alarm apa yang seharusnya bunyi, dan kapan? (3) Respons yang benar saat alarm itu bunyi?",
        "Pembahasan: (1) Deviasi mengukur “apakah sumber-sumber SEPAKAT” — dan 2 node yang basi SEPAKAT satu sama lain (keduanya basi dengan cara yang sama). Kesepakatan bukan kebenaran. (2) Alarm STALENESS per node (umur update > 300 detik → page) seharusnya bunyi pukul 02:45 — 5 menit setelah macet, 35 menit SEBELUM kerugian membesar. Pelajaran lesson: monitor “apakah datanya hidup” SEBELUM “apakah datanya aneh”. (3) Runbook: verifikasi harga dari sumber independen (CEX), bila feed tidak pulih dalam X menit → pause pasar yang bergantung feed itu (circuit breaker) → komunikasikan ke pengguna. Jeda 40 menit tanpa circuit breaker = 40 menit memberi pinjaman dengan harga palsu.",
        "Kaitan ke JD Chainlink: inilah tepatnya “anomaly detection + SLO alerting” sebagai keterampilan — bukan teori, melainkan perbedaan antara insiden yang tertangani dan $40 juta yang hilang.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko terbesar monitoring bukan false positive — melainkan FALSE NEGATIVE yang tenang: sistem yang terlihat “semua hijau” sementara datanya basi. Dashboard hijau dengan data mati lebih berbahaya daripada dashboard merah — ia memberi keyakinan palsu. Selalu ada panel “umur data” di samping panel “nilai data”.",
      },
      reference: "Kesepakatan ≠ kebenaran. Monitor staleness per sumber; circuit breaker untuk feed kritis.",
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
        "4 keluarga anomali: spike, level shift, variance change, stale/missing — petakan metrik ke keluarganya sebelum pilih detektor.",
        "Rolling z-score (spike) + CUSUM (level shift landai); baseline harus bergulir — ambang statis mati oleh drift.",
        "Monitor staleness (umur data) SEBELUM deviasi — kesepakatan sumber bukan kebenaran.",
        "SLO alerting: page = kritis + actionable + runbook; burn rate memutuskan kapan bangun; page tak-actionable = bug.",
        "Batas lesson: bcd7 = forensik aktor fraud; lesson ini = monitoring metrik + alerting operasional feed/protokol.",
      ],
      next: { label: "BCD22 — Analisis Kuantitatif Kripto: Volatilitas, Korelasi, Rezim", href: "/v2/learn/bcd22-kuantitatif-kripto" },
      quiz: [
        {
          q: "Feed 5 node: 3 mati, 2 tersisa sepakat (deviasi < 1%) tetapi basi 40 menit. Detektor deviasi diam. Pelajarannya?",
          options: [
            { text: "Monitor staleness per sumber — kesepakatan bukan kebenaran; data basi yang sepakat tetap basi", why: "Benar: mini-case menunjukkan deviasi buta terhadap kasus ini. Alarm umur-data (per node) adalah pertahanan pertamanya.", correct: true },
            { text: "Turunkan ambang deviasi ke 0,1%", why: "Salah: ambang lebih ketat tidak membantu — masalahnya bukan deviasi, melainkan data yang tidak update. Salah sumbu." },
            { text: "Tambah node agregator menjadi 20", why: "Salah: 20 node yang semuanya bisa basi bersamaan (bug klien yang sama) tidak menyelesaikan masalah staleness." },
            { text: "Tidak perlu alarm — 2 node sepakat berarti aman", why: "Salah: inilah asumsi yang menyebabkan insiden — kesepakatan 2 node basi = keyakinan palsu." },
          ],
        },
        {
          q: "Gas baseline naik permanen 50→250 gwei (permintaan struktural). Ambang statis “page bila > 200” akan?",
          options: [
            { text: "Berbunyi selamanya sampai dimatikan — drift membunuh ambang statis; pakai baseline bergulir", why: "Benar: ambang statis tidak tahu bahwa “normal” telah berubah. Rolling z-score beradaptasi dan hanya bereaksi pada penyimpangan RELATIF.", correct: true },
            { text: "Tetap akurat — 250 memang anomali", why: "Salah: bila 250 adalah normal baru yang persisten, membunyikan alarm untuknya setiap blok = noise, bukan sinyal." },
            { text: "Otomatis menyesuaikan diri", why: "Salah: ambang statis tidak punya mekanisme adaptasi — itulah definisinya “statis”." },
            { text: "Menjadi lebih sensitif terhadap spike", why: "Salah: sebaliknya — ia menjadi TAK BERGUNA (selalu bunyi), sehingga spike sungguhan tenggelam dalam kebisingan." },
          ],
        },
        {
          q: "TVL turun 30% dalam sehari dan bertahan (bukan spike sesaat). Detektor terbaik?",
          options: [
            { text: "CUSUM — mengakumulasi penyimpangan kecil konsisten sampai level shift tertangkap", why: "Benar: z-score per-titik bisa “beradaptasi” dan melewatkan pergeseran landai; CUSUM dirancang untuk ini.", correct: true },
            { text: "Rolling z-score ambang 3 — cukup untuk semua", why: "Salah: “cukup untuk semua” adalah mitos satu-detektor; z-score lemah untuk level shift yang tidak spike." },
            { text: "Ambang statis TVL < X", why: "Salah: TVL punya tren dan musiman; ambang statis rapuh terhadap keduanya." },
            { text: "Tidak perlu detektor — terlihat kasat mata", why: "Salah: “kasat mata” tidak berskala — 200 metrik × 24 jam tidak bisa dipantau mata manusia. Itulah gunanya alarm." },
          ],
        },
        {
          q: "50%+ page sebulan terakhir adalah false alarm. Tindakan yang benar?",
          options: [
            { text: "Naikkan ambang / perbaiki detektor / hapus page tak-actionable — page yang separuh salah akan diabaikan seluruhnya", why: "Benar: ini bug sistem alerting (prinsip SLO). Kepercayaan adalah modal alarm; false positive menggerogotinya.", correct: true },
            { text: "Biarkan — lebih baik berisik daripada lengah", why: "Salah: “berisik” berujung pada alarm yang DIMATIKAN — yang justru menciptakan kelengahan total. False positive bukan kewaspadaan." },
            { text: "Tambah lebih banyak page agar tidak ada yang lolos", why: "Salah: menambah page memperparah fatigue — solusi berlawanan arah dengan masalahnya." },
            { text: "Ganti tim on-call dengan yang lebih sabar", why: "Salah: menyalahkan manusia atas bug sistem — fatigue adalah respons rasional terhadap alarm yang buruk." },
          ],
        },
        {
          q: "Metrik baru diusulkan untuk di-page. Pertanyaan pertama sebelum membuatnya?",
          options: [
            { text: "“Bila alarm ini bunyi jam 3 pagi, apa yang dilakukan manusia?” — tanpa jawaban = tanpa page (dashboard dulu)", why: "Benar: page tanpa runbook = kepanikan terjadwal. Aturan SLO: setiap page harus actionable.", correct: true },
            { text: "“Berapa ambang yang bagus?”", why: "Salah: ambang adalah pertanyaan KEDUA — yang pertama adalah apakah alarm ini layak menjadi page sama sekali." },
            { text: "“Siapa yang mau on-call?”", why: "Salah: mendahului keputusan desain alarm dengan staffing — urutannya terbalik." },
            { text: "Langsung buat — nanti disesuaikan", why: "Salah: “nanti disesuaikan” hampir tidak pernah terjadi; yang terjadi adalah alarm buruk yang mengakar." },
          ],
        },
      ],
    },
  ],
};
