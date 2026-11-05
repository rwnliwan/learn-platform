import type { V2Lesson } from "../lib/types";

const FIG_PACING_DASH = `<svg viewBox="0 0 560 340" role="img" aria-label="Pacing dashboard: spend vs revenue kumulatif terhadap target.">
<g font-family="var(--font-ui)">
<text x="14" y="26" font-size="13" fill="var(--chart-text)" font-weight="bold">Dashboard pacing: spend vs revenue kumulatif (4 minggu)</text>
<line x1="60" y1="290" x2="540" y2="290" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="60" y1="290" x2="60" y2="40" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="20" y="295" font-size="9" fill="var(--chart-text)">0</text>
<text x="8" y="228" font-size="9" fill="var(--chart-text)">80jt</text>
<text x="8" y="166" font-size="9" fill="var(--chart-text)">160jt</text>
<text x="8" y="104" font-size="9" fill="var(--chart-text)">240jt</text>
<line x1="60" y1="225" x2="540" y2="225" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4,4"/>
<line x1="60" y1="160" x2="540" y2="160" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4,4"/>
<line x1="60" y1="95" x2="540" y2="95" stroke="var(--chart-grid)" stroke-width="1" stroke-dasharray="4,4"/>
<polyline points="100,273 220,256 340,239 460,222" fill="none" stroke="var(--c2)" stroke-width="2" stroke-dasharray="7,5"/>
<polyline points="100,260 220,235 340,205 460,175" fill="none" stroke="var(--c3)" stroke-width="2" stroke-dasharray="7,5"/>
<polyline points="100,275 220,253 340,227 460,205" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<polyline points="100,268 220,251 340,237 460,222" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<circle cx="460" cy="205" r="5" fill="var(--c1)"/>
<circle cx="460" cy="222" r="5" fill="var(--c4)"/>
<text x="100" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">W1</text>
<text x="220" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">W2</text>
<text x="340" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">W3</text>
<text x="460" y="312" font-size="9" fill="var(--chart-text)" text-anchor="middle">W4</text>
<text x="380" y="60" font-size="10" fill="var(--c2)" font-weight="bold">- - target spend</text>
<text x="380" y="76" font-size="10" fill="var(--c3)" font-weight="bold">- - target revenue</text>
<text x="380" y="92" font-size="10" fill="var(--c1)" font-weight="bold">— aktual spend</text>
<text x="380" y="108" font-size="10" fill="var(--c4)" font-weight="bold">— aktual revenue</text>
<text x="470" y="190" font-size="9" fill="var(--c1)" font-weight="bold">over 5%</text>
<text x="470" y="240" font-size="9" fill="var(--c4)" font-weight="bold">under 14%</text>
</g>
</svg>`;

export const mk25: V2Lesson = {
  slug: "mk25-dashboard-marketing",
  track: "Marketing Analytics",
  module: "Tooling Analis",
  title: "MK25 — Membangun Dashboard Marketing: Satu Layar, Satu Keputusan",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dashboard Bu Sari yang hijau semua — dan revenue yang turun",
      prose: [
        "Bu Sari, head of marketing sebuah D2C skincare, membuka dashboard setiap Senin pagi. Semua lampunya hijau: traffic naik 40% kuartal ini, follower bertambah 25 ribu, engagement rate di atas benchmark. Di rapat direksi ia melaporkan 'marketing bertumbuh sehat'. Lalu CFO menyelipkan satu slide: revenue turun 12% pada periode yang sama.",
        "Ruangan hening. Dashboard Bu Sari mengukur segalanya KECUALI yang penting: tidak ada revenue, tidak ada CAC, tidak ada ROAS — hanya metrik hulu (traffic, follower, engagement) yang naik karena budget iklan naik, sementara efisiensi anjlok. Ia telah mengoptimalkan angka-angka yang tidak membayar gaji siapa pun. Tiga bulan berikutnya ia membangun ulang dashboard dari nol — dimulai dari SATU pertanyaan: 'apakah marketing menghasilkan uang?' — dan setiap chart harus menjawabnya atau dibuang.",
        "Twist-nya: dashboard yang semua lampunya hijau justru yang paling berbahaya — ia memberi rasa aman palsu sementara kapal bocor. Dashboard yang baik kadang berwarna MERAH, karena tugasnya bukan menenangkan, melainkan menunjukkan di mana masalahnya. Lesson ini tentang membangun dashboard marketing yang jujur: memilih tool (Tableau/Power BI/Looker), merancang model data, memilih metrik per level funnel, dan menghindari jebakan vanity metrics. Karena dashboard adalah produk — dan penggunanya (direksi, channel manager) berhak mendapat produk yang menjawab pertanyaan mereka, bukan pameran chart.",
      ],
      tasks: [],
      note: {
        title: "Konteks bisnis",
        type: "risk",
        body: "Riset lowongan 2026: dashboard building (Tableau/Power BI/Looker) diminta 5 dari 8 lowongan analis marketing — paling ditekankan di level junior/mid. Alasannya sederhana: analis junior dinilai dari kemampuannya membuat angka bisa dibaca orang lain, bukan hanya bisa menghitung.",
      },
      reference: "Dashboard yang baik kadang merah — tugasnya menunjukkan masalah, bukan menenangkan.",
    },
    {
      id: "konsep-tool",
      eyebrow: "Langkah 2 · Konsep",
      title: "Memilih senjata: Tableau vs Power BI vs Looker",
      prose: [
        "Tiga raksasa, tiga kepribadian. Tableau: raja visualisasi eksploratif — drag-and-drop paling luwes, komunitas terbesar, tetapi mahal dan butuh skill untuk data prep yang serius. Power BI: juara ekosistem Microsoft — murah (sering sudah termasuk lisensi perusahaan), integrasi Excel/Azure mulus, DAX-nya powerful tetapi learning curve-nya curam. Looker (Google): juara semantic layer — definisi metrik ditulis SEKALI di LookML, semua dashboard memakai definisi yang sama; tetapi butuh tim yang nyaman dengan model data dan harganya enterprise.",
        "Yang sering dilupakan: pilihan tool adalah pilihan ORGANISASI, bukan pilihan teknis. Tim yang 100% Microsoft + analis fasih Excel → Power BI (DAX terasa familiar). Perusahaan dengan tim data kuat + banyak definisi metrik yang berkonflik → Looker (semantic layer menyelesaikan 'dua versi ROAS'). Butuh eksplorasi visual cepat oleh analis senior → Tableau.",
        "Jebakan terbesar bukan memilih tool yang 'salah' — melainkan membeli lisensi sebelum merapikan definisi metrik. Dashboard di tool semahal apa pun tetap menampilkan definisi yang berantakan bila 'revenue' berarti tiga hal berbeda di tiga tim. Urutan yang benar: sepakati definisi (satu glosarium metrik) → rapikan model data → baru pilih tool. Tool adalah langkah KETIGA, bukan pertama.",
        "🚨 Mitos: 'Tool mahal = dashboard bagus.' Yang benar: 80% kualitas dashboard ditentukan SEBELUM tool dibuka — oleh definisi metrik, model data, dan pertanyaan yang jelas. Dashboard jelek di Tableau tetap jelek di Power BI; ia hanya jelek dengan lebih mahal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membangun dashboard langsung dari tabel mentah (tanpa model data): tiap chart menulis logikanya sendiri, 'revenue' dihitung 5 cara berbeda di 5 chart. Solusinya: satu tabel fakta terkurasi (satu baris = satu kejadian dengan grain jelas) + tabel dimensi — SEMUA chart membaca dari sana. Model data dulu, chart kemudian.",
      },
      reference: "Definisi metrik → model data → tool. Urutan ini tidak boleh dibalik.",
    },
    {
      id: "konsep-model",
      eyebrow: "Langkah 3 · Konsep",
      title: "Model data dashboard: grain, fakta, dan dimensi",
      prose: [
        "Grain adalah 'satu baris = apa?' — keputusan paling penting dan paling sering diabaikan. Grain 'satu baris = satu klik' cocok untuk analisis traffic; grain 'satu baris = satu transaksi' cocok untuk revenue; mencampur keduanya dalam satu tabel = double counting yang menunggu terjadi. Aturan: satu tabel fakta, satu grain, ditulis di dokumentasi.",
        "Pola standarnya star schema: tabel FAKTA di tengah (kejadian terukur: spend_harian per kampanye, transaksi) dikelilingi tabel DIMENSI (kanal, kampanye, tanggal, segmen pelanggan). Fakta menyimpan angka; dimensi menyimpan 'potongan' analisis. Dashboard yang bisa di-filter 'per kanal per minggu' butuh dimensi kanal dan tanggal — bila tidak ada, filter itu mustahil dibuat, betapa pun bagusnya tool-nya.",
        "Untuk marketing, tiga tabel fakta biasanya cukup: spend_harian (grain: kampanye × hari), transaksi (grain: order), dan user_akuisisi (grain: user — untuk cohort). Dari ketiganya, SEMUA metrik dashboard bisa diturunkan: ROAS, CAC, konversi funnel, retensi. Bila sebuah metrik tidak bisa diturunkan dari tiga tabel ini, model datanya kurang — bukan chart-nya yang salah.",
        "🚨 Mitos: 'Model data itu urusan data engineer.' Yang benar: analis yang tidak paham grain akan salah membaca dashboard buatannya sendiri — misal me-rata-rata CAC harian (rata-rata dari rasio, salah — lihat lesson MK23) padahal yang benar total spend / total pelanggan. Paham grain = paham batas apa yang boleh dihitung.",
      ],
      tasks: [],
      formula: String.raw`\text{CAC} = \frac{\text{spend}}{\text{pelanggan baru}} \quad ; \quad \frac{\text{LTV}}{\text{CAC}} \geq 3`,
      formulaNote: "CAC (Customer Acquisition Cost) = spend / pelanggan baru. LTV = nilai seumur hidup pelanggan. Rasio LTV:CAC ≥ 3 adalah rule of thumb bisnis yang sehat (tiap Rp1 biaya akuisisi kembali ≥ Rp3). Interpretasi: CAC Rp60rb dengan LTV Rp180rb → rasio 3,0 — sehat; bila CAC naik ke Rp90rb tanpa LTV naik → rasio 2,0 — waspada. Contoh lab: CAC total Rp60.432, LTV asumsi Rp180rb → rasio 2,98 — di ambang batas, pantau mingguan.",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Uji grain 10 detik: tanya 'kalau saya SUM kolom revenue di tabel ini, apakah hasilnya = revenue perusahaan?' Bila ya, grain-nya benar untuk revenue. Bila tidak (misal terlipat 3×), ada fan-out atau grain ganda — perbaiki SEBELUM membuat chart apa pun. Chart di atas grain rusak = lukisan di atas fondasi miring.",
      },
      reference: "Satu tabel fakta = satu grain; semua metrik turun dari 3 tabel inti.",
    },
    {
      id: "konsep-metrik",
      eyebrow: "Langkah 4 · Konsep",
      title: "Metrik per level funnel: dari vanity ke outcome",
      prose: [
        "Tiap level funnel punya metrik JUJUR dan metrik VANITY. Awareness: jujur = reach unik & frekuensi; vanity = impresi (satu orang melihat 20× = 20 impresi). Consideration: jujur = CTR unik & biaya per visitor berkualitas; vanity = klik mentah (termasuk klik tak sengaja). Conversion: jujur = CAC, ROAS, conversion rate per kohort; vanity = jumlah transaksi tanpa konteks biaya. Retention: jujur = retensi cohort & repeat rate; vanity = total user terdaftar (termasuk yang mati).",
        "Aturan praktisnya: metrik yang baik (1) bisa ditindaklanjuti — 'CTR turun' → perbaiki kreatif; 'impresi naik' → lalu apa? (2) dibandingkan dengan sesuatu — target, periode lalu, atau benchmark; angka sendirian tidak bercerita; (3) sedekat mungkin dengan uang — makin ke hilir funnel, makin jujur.",
        "Hierarki dashboard yang sehat: 3–5 KPI di puncak (revenue, CAC, ROAS, LTV:CAC, retensi) → metrik diagnostik per level di bawahnya (CTR, CPC, konversi) → detail operasional (per kampanye). Direksi hanya melihat puncak; channel manager menyelam ke bawah. Dashboard satu layar untuk semua orang = dashboard untuk tidak ada orang.",
        "🚨 Mitos: 'Makin banyak metrik di dashboard makin lengkap.' Yang benar: dashboard dengan 40 KPI = tidak ada prioritas. Setiap metrik tambahan mengencerkan perhatian. Tesnya: bila sebuah metrik tidak pernah memicu tindakan dalam 3 bulan, buang — ia dekorasi, bukan instrumen.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Snapshot tanpa konteks waktu: 'revenue turun 10% vs bulan lalu' terlihat merah — padahal bulan lalu ada Harbolnas (musiman) dan tahun lalu di periode sama turun 15% (artinya tahun ini MEMBAIK). Setiap angka time-series wajib punya pembanding yang fair: YoY untuk musiman, atau rata-rata 4 minggu untuk tren. Angka tanpa pembanding = opini.",
      },
      reference: "Metrik jujur = bisa ditindaklanjuti + ada pembanding + dekat dengan uang.",
    },
    {
      id: "visual-pacing-dash",
      eyebrow: "Langkah 5 · Visual",
      title: "Membaca dashboard pacing: dua garis, satu cerita",
      prose: [
        "Diagram menampilkan dashboard pacing 4 minggu dari data lab: garis putus-putus = target (spend & revenue kumulatif), garis tegas = aktual. Ceritanya terbaca dalam 5 detik: spend aktual sedikit di atas target sejak awal (over 5% di W4), tetapi revenue aktual makin tertinggal (under 14% di W4).",
        "Inilah kekuatan dashboard yang dirancang benar: DUA garis yang berlawanan arah langsung mengajukan pertanyaan — 'kita belanja lebih TETAPI dapat lebih sedikit — efisiensi turun.' Tanpa garis target, kedua garis aktual terlihat 'naik' dan dashboard terlihat hijau. Target mengubah 'naik' menjadi 'tertinggal'.",
      ],
      figure: {
        svg: FIG_PACING_DASH,
        alt: "Pacing dashboard: spend vs revenue kumulatif terhadap target.",
        caption: "Cara membaca: sumbu X = minggu, sumbu Y = kumulatif Rp; garis putus-putus = target, garis tegas = aktual; biru/hijau = spend, oranye/ungu = revenue. Interpretasi: spend aktual over-target 5% di W4 sementara revenue under-target 14% — efisiensi (ROAS) memburuk dari minggu ke minggu. Tindakan: bukan menambah budget (mempercepat kebocoran), melainkan audit kampanye dengan ROAS terendah. Dashboard yang baik membuat keputusan ini terlihat dalam 5 detik.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Tes 5 detik untuk setiap dashboard yang kamu buat: tunjukkan ke orang yang belum pernah melihatnya, beri 5 detik, tanya 'apa masalahnya?' Bila ia tidak bisa menjawab, dashboard-mu gagal — betapa pun cantiknya. Kejelasan > kelengkapan, selalu.",
      },
      reference: "Setiap chart wajib punya pembanding (target/periode lalu) — tanpa itu ia dekorasi.",
    },
    {
      id: "lab-dashboard",
      eyebrow: "Langkah 6 · Lab",
      title: "Membangun metrik dashboard dari data mentah",
      prose: [
        "Data: 4 minggu berisi spend, revenue, pelanggan baru, serta target kumulatif spend & revenue. Tugasmu menghitung metrik puncak dashboard: (t1) CAC total, ROAS total, dan rasio LTV:CAC (LTV asumsi Rp180rb); (t2) tabel pacing mingguan — kumulatif aktual vs target untuk spend & revenue + status; (t3) identifikasi minggu anomali (ROAS mingguan < 1,0) dan cetak ringkasannya. Inilah 'mesin' di balik dashboard langkah 5 — angka yang sama, sebelum divisualkan.",
        "Hasil yang benar: CAC = Rp60.432; ROAS total = 0,98; LTV:CAC = 2,98 (di ambang batas 3,0 — waspada); minggu anomali = 2 (W3, W4). Eksplorasi: ubah threshold anomali menjadi ROAS < 0,9 — berapa minggu yang ke-flag? Mengapa threshold adalah keputusan bisnis, bukan konstanta statistik?",
      ],
      tasks: [
        { id: "t1", text: "Hitung CAC total, ROAS total, rasio LTV:CAC (LTV=180rb)" },
        { id: "t2", text: "Bangun tabel pacing: kumulatif aktual vs target per minggu" },
        { id: "t3", text: "Flag minggu anomali (ROAS mingguan < 1,0) → minggu_buruk, lalu cetak" },
      ],
      expected: "cac=60432 roas_total=0.98 ltv_cac=2.98 minggu_buruk=2",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung CAC sebagai RATA-RATA CAC mingguan: (50.000 + 52.632 + 66.667 + 75.000)/4 = Rp61.075 — salah. Yang benar: total spend / total pelanggan = Rp60.432. Rata-rata dari rasio memberi bobot sama ke minggu kecil dan besar (lagi-lagi jebakan lesson MK23). Di dashboard, satu formula salah di KPI puncak = seluruh organisasi membaca angka yang salah.",
      },
      hints: [
        "t1: cac = sum(spend)/sum(pelanggan); roas = sum(revenue)/sum(spend).",
        "t2: loop minggu; kumulatif += nilai; bandingkan dengan target_kum.",
        "t3: roas_w = revenue/spend per minggu; hitung yang < 1.0.",
        "Format cetak: f\"cac={cac:.0f} roas_total={roas_total:.2f} ltv_cac={ltv_cac:.2f} minggu_buruk={minggu_buruk}\".",
      ],
      code: {
        starter: "# DATA — JANGAN UBAH (4 minggu; target = kumulatif)\nminggu = [\n    {\"w\": \"W1\", \"spend\": 45_000_000, \"revenue\": 54_000_000, \"pelanggan\": 900},\n    {\"w\": \"W2\", \"spend\": 50_000_000, \"revenue\": 55_000_000, \"pelanggan\": 950},\n    {\"w\": \"W3\", \"spend\": 55_000_000, \"revenue\": 49_500_000, \"pelanggan\": 825},\n    {\"w\": \"W4\", \"spend\": 60_000_000, \"revenue\": 48_000_000, \"pelanggan\": 800},\n]\ntarget_spend_kum = [50_000_000, 100_000_000, 150_000_000, 200_000_000]\ntarget_rev_kum = [60_000_000, 120_000_000, 180_000_000, 240_000_000]\nLTV = 180_000\n\n# TULIS KODEMU\ncac = \nroas_total = \nltv_cac = \nminggu_buruk = \n\nprint(f\"cac={cac:.0f} roas_total={roas_total:.2f} ltv_cac={ltv_cac:.2f} minggu_buruk={minggu_buruk}\")\n",
        lockLines: 10,
        solution: "# DATA — JANGAN UBAH (4 minggu; target = kumulatif)\nminggu = [\n    {\"w\": \"W1\", \"spend\": 45_000_000, \"revenue\": 54_000_000, \"pelanggan\": 900},\n    {\"w\": \"W2\", \"spend\": 50_000_000, \"revenue\": 55_000_000, \"pelanggan\": 950},\n    {\"w\": \"W3\", \"spend\": 55_000_000, \"revenue\": 49_500_000, \"pelanggan\": 825},\n    {\"w\": \"W4\", \"spend\": 60_000_000, \"revenue\": 48_000_000, \"pelanggan\": 800},\n]\ntarget_spend_kum = [50_000_000, 100_000_000, 150_000_000, 200_000_000]\ntarget_rev_kum = [60_000_000, 120_000_000, 180_000_000, 240_000_000]\nLTV = 180_000\n\n# TULIS KODEMU\ntot_spend = sum(m[\"spend\"] for m in minggu)\ntot_rev = sum(m[\"revenue\"] for m in minggu)\ntot_cust = sum(m[\"pelanggan\"] for m in minggu)\ncac = tot_spend / tot_cust\nroas_total = tot_rev / tot_spend\nltv_cac = LTV / cac\nminggu_buruk = sum(1 for m in minggu if m[\"revenue\"] / m[\"spend\"] < 1.0)\n\nprint(f\"cac={cac:.0f} roas_total={roas_total:.2f} ltv_cac={ltv_cac:.2f} minggu_buruk={minggu_buruk}\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "cac", value: 210_000_000 / 3475, tol: 1.0, label: "cac sekitar Rp60.432", msg: "210jt / 3475 = 60.431,65." },
          { kind: "equal", task: "t1", name: "roas_total", value: 206_500_000 / 210_000_000, tol: 0.01, label: "roas_total sekitar 0,98", msg: "206,5jt / 210jt = 0,983." },
          { kind: "equal", task: "t1", name: "ltv_cac", value: 180_000 / (210_000_000 / 3475), tol: 0.01, label: "ltv_cac sekitar 2,98", msg: "180.000 / 60.432 = 2,98 — di ambang batas 3,0." },
          { kind: "equal", task: "t3", name: "minggu_buruk", value: 2, label: "minggu_buruk = 2", msg: "W3 ROAS 0,90 dan W4 ROAS 0,80 < 1,0." },
          { kind: "stdout_matches", task: "t3", pattern: "minggu_buruk=2", label: "print menampilkan minggu_buruk", msg: "Format: minggu_buruk=..." },
        ],
      },
      reference: "KPI puncak dari total (bukan rata-rata); pacing vs target; flag anomali.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Merancang dashboard: dari pertanyaan ke layar",
      prose: [
        "Skenario satu — audiens direksi (5 menit perhatian): SATU layar, 3–5 KPI (revenue, CAC, ROAS, LTV:CAC), tiap KPI dengan pembanding (vs target / vs bulan lalu) dan status warna. Tidak ada drill-down — direksi butuh vonis, bukan eksplorasi.",
        "Skenario dua — audiens channel manager (pengguna harian): drill-down per kampanye/kreatif, filter tanggal & kanal, tabel pacing + flag anomali otomatis. Mereka butuh DIAGNOSIS, bukan vonis.",
        "Skenario tiga — banyak definisi metrik berkonflik di perusahaan: selesaikan di semantic layer (LookML/dbt semantic) SEBELUM membangun dashboard. Dashboard di atas definisi ganda = memvisualkan perdebatan.",
        "Skenario empat — data belum siap (tracking berantakan, grain tidak jelas): JANGAN bangun dashboard. Dashboard di atas data kotor = memproduksi keyakinan palsu dalam skala organisasi. Rapikan dulu (lesson MK23–MK24), baru visualkan.",
        "Skenario lima — diminta 'dashboard real-time': tanya dulu 'keputusan apa yang berubah dalam hitungan menit?' Bila tidak ada (mayoritas marketing), refresh harian cukup — real-time menambah biaya & kompleksitas tanpa nilai keputusan.",
        "Aturan praktis 10 detik: (1) siapa yang melihat & berapa lama? (2) keputusan apa yang diambil dari layar ini? (3) apakah tiap angka punya pembanding? — bila salah satu tidak terjawab, jangan bangun dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Dashboard 'serba bisa': satu layar untuk direksi + channel manager + finance. Hasilnya: terlalu detail untuk direksi, terlalu dangkal untuk manager, dan tidak dipakai siapa pun. Satu dashboard = satu audiens = satu keputusan. Lebih baik 3 dashboard fokus daripada 1 dashboard raksasa.",
      },
      reference: "Satu layar, satu audiens, satu keputusan; definisi dulu, tool kemudian.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Redesain dashboard Bu Sari dalam satu sprint",
      prose: [
        "Setelah insiden lampu hijau, Bu Sari meredesain dashboard dalam 2 minggu. Layar 1 (direksi): 4 KPI — revenue bulanan vs target, CAC vs bulan lalu, ROAS blended, LTV:CAC — masing-masing dengan status warna & tren 6 bulan. Layar 2 (channel): tabel per kanal (spend, revenue, ROAS, CAC, pacing) + flag otomatis bila ROAS < 1,0 dua minggu berturut. Layar 3 (diagnostik): funnel per kanal + cohort retensi. Total: 3 layar, 11 metrik — turun dari 40 metrik sebelumnya.",
        "Pertanyaan: (a) metrik apa yang DIBUANG dan mengapa itu benar? (b) apa risiko desain barunya? Pembahasan: (a) Dibuang: impresi, follower, engagement mentah — vanity metrics yang tidak pernah memicu tindakan; diganti metrik yang bisa ditindaklanjuti (CAC naik → audit kanal; pacing merah → rem budget). (b) Risiko: KPI puncak bisa 'baik-baik saja' sementara masalah kecil menumpuk di bawah (agregat menyembunyikan disparitas) — mitigasinya: flag anomali otomatis di layar 2 & review diagnostik mingguan, bukan bulanan. Pelajaran: dashboard yang baik adalah hasil PENGURANGAN, bukan penambahan — keberanian membuang 29 metrik adalah skill-nya.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Setiap kuartal, audit dashboard-mu sendiri: metrik mana yang tidak pernah memicu tindakan dalam 3 bulan? Buang. Dashboard adalah kebun — tanpa pemangkasan rutin, ia menjadi hutan yang tidak bisa dilalui. Bu Sari menjadwalkan 'pemangkasan metrik' tiap awal kuartal.",
      },
      reference: "Dashboard hebat = hasil pengurangan; audit & pangkas tiap kuartal.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran dari semua langkah. Target: skor ≥ 4 dari 5.",
      ],
      tasks: [],
      summary: [
        "Pilih tool berdasar organisasi (ekosistem, tim, konflik definisi) — bukan gengsi; urutan: definisi metrik → model data → tool.",
        "Model data: satu tabel fakta = satu grain; star schema (fakta + dimensi); 3 tabel inti marketing (spend_harian, transaksi, user_akuisisi) menurunkan semua metrik.",
        "KPI puncak dari TOTAL (bukan rata-rata rasio): CAC = spend/pelanggan baru; LTV:CAC ≥ 3 sebagai rule of thumb; ROAS = revenue/spend.",
        "Metrik jujur = bisa ditindaklanjuti + punya pembanding + dekat dengan uang; vanity metrics (impresi, follower mentah) dibuang bila tak pernah memicu tindakan.",
        "Setiap angka time-series wajib pembanding fair (target, YoY untuk musiman); snapshot tanpa konteks = opini.",
        "Satu dashboard = satu audiens = satu keputusan; tes 5 detik menentukan apakah ia bekerja.",
      ],
      quiz: [
        {
          q: "Perusahaan dengan tim 100% Microsoft, analis fasih Excel, dan butuh dashboard direksi murah. Pilihan paling masuk akal?",
          options: [
            { text: "Power BI — ekosistem & lisensi sudah ada, DAX familiar bagi pengguna Excel", why: "Benar: pilihan tool mengikuti organisasi, bukan gengsi teknis.", correct: true },
            { text: "Tableau — karena visualisasinya paling bagus", why: "Visualisasi bagus tidak mengalahkan biaya & ekosistem yang sudah ada untuk kasus ini." },
            { text: "Looker — karena semantic layer-nya terbaik", why: "Berlebihan untuk kebutuhan ini; Looker bersinar saat konflik definisi metrik skala besar." },
            { text: "Bangun custom dashboard dengan Python", why: "Mahal di maintenance untuk kebutuhan standar direksi." },
          ],
        },
        {
          q: "Sebuah tabel 'dashboard' memiliki grain ganda (baris klik + baris transaksi tercampur). Akibatnya bila SUM(revenue)?",
          options: [
            { text: "Revenue bisa terlipat ganda / salah — grain ganda merusak semua agregat", why: "Benar: satu tabel satu grain; campuran = double counting menunggu terjadi.", correct: true },
            { text: "Tidak masalah selama chart-nya bagus", why: "Chart bagus di atas agregat salah = keyakinan palsu yang cantik." },
            { text: "Hanya memengaruhi kecepatan query", why: "Salah: ini soal kebenaran, bukan kecepatan." },
            { text: "Bisa diperbaiki dengan filter di dashboard", why: "Filter menyembunyikan gejala; grain yang rusak tetap meracuni metrik lain." },
          ],
        },
        {
          q: "Dashboard menampilkan 'revenue turun 10% vs bulan lalu' dengan warna merah. Respons analis yang tepat SEBELUM panik?",
          options: [
            { text: "Cek pembanding yang fair: apakah bulan lalu ada event musiman (Harbolnas)? Bagaimana YoY?", why: "Benar: snapshot tanpa konteks musiman = opini. Mungkin tahun ini justru membaik.", correct: true },
            { text: "Langsung potong budget kanal termahal", why: "Reaktif tanpa diagnosis — bisa memotong kanal yang sebenarnya sehat." },
            { text: "Ubah warna menjadi kuning agar tidak panik", why: "Mengubah warna tidak mengubah fakta; itu manipulasi tampilan." },
            { text: "Hapus metrik revenue dari dashboard", why: "Menghapus masalah bukan menyelesaikannya." },
          ],
        },
        {
          q: "CAC dihitung sebagai rata-rata CAC mingguan (bukan total spend / total pelanggan). Apa masalahnya?",
          options: [
            { text: "Memberi bobot sama ke minggu kecil & besar — rata-rata dari rasio ≠ rasio dari total", why: "Benar: minggu dengan 100 pelanggan diperlakukan setara minggu dengan 1.000 pelanggan.", correct: true },
            { text: "Tidak ada masalah, keduanya sama", why: "Hanya sama bila tiap minggu pelanggannya identik — praktis tidak pernah." },
            { text: "Rata-rata selalu lebih kecil dari rasio total", why: "Tidak selalu — arah biasnya tergantung distribusi, itulah masalahnya." },
            { text: "CAC tidak boleh dihitung mingguan sama sekali", why: "Boleh — asal agregatnya memakai total, bukan rata-rata rasio." },
          ],
        },
        {
          q: "Diminta membuat 'satu dashboard untuk direksi, channel manager, dan finance'. Sikap yang benar?",
          options: [
            { text: "Tolak & pecah menjadi 3 dashboard fokus — satu audiens, satu keputusan per layar", why: "Benar: dashboard serba bisa = terlalu detail untuk direksi, terlalu dangkal untuk manager.", correct: true },
            { text: "Buat satu dashboard raksasa dengan 40 KPI agar semua puas", why: "40 KPI = tidak ada prioritas; tidak ada yang membaca semuanya." },
            { text: "Buat untuk direksi saja, yang lain menyusul", why: "Mengabaikan kebutuhan operasional channel manager yang butuh diagnosis harian." },
            { text: "Minta tiap tim membuat dashboard sendiri", why: "Itu justru menciptakan definisi ganda — masalah yang ingin dihindari." },
          ],
        },
      ],
      next: {
        label: "MK26 — CRM Ops: Braze, MoEngage, HubSpot dalam Praktik",
        href: "/learn/mk26-crm-ops",
      },
    },
  ],
};
