import type { V2Lesson } from "../lib/types";

const CANARY_SVG = `<svg viewBox="0 0 480 200" role="img" aria-label="Tahapan canary: 5 persen, 25 persen, 50 persen, 100 persen, dengan gerbang evaluasi di tiap tahap.">
<g font-family="var(--font-ui)" font-size="11">
<line x1="30" y1="100" x2="450" y2="100" stroke="var(--chart-grid)" stroke-width="2"/>
<g text-anchor="middle">
<circle cx="70" cy="100" r="26" fill="var(--c1)"/><text x="70" y="104" fill="var(--text)" font-weight="700" font-size="12">5%</text>
<circle cx="190" cy="100" r="26" fill="none" stroke="var(--chart-grid)" stroke-width="2"/><text x="190" y="104" fill="var(--text)" font-weight="600" font-size="12">25%</text>
<circle cx="310" cy="100" r="26" fill="none" stroke="var(--chart-grid)" stroke-width="2"/><text x="310" y="104" fill="var(--text)" font-weight="600" font-size="12">50%</text>
<circle cx="430" cy="100" r="26" fill="var(--c2)"/><text x="430" y="104" fill="var(--text)" font-weight="700" font-size="12">100%</text>
<text x="70" y="150" fill="var(--text)" font-weight="600">20 menit</text><text x="70" y="165" fill="var(--chart-text)" font-size="10">tangkap masalah</text>
<text x="190" y="150" fill="var(--chart-text)">2 jam</text><text x="310" y="150" fill="var(--chart-text)">6 jam</text><text x="430" y="150" fill="var(--chart-text)">24 jam</text>
<text x="130" y="80" fill="var(--c4)" font-size="10">gerbang &#10003;</text><text x="250" y="80" fill="var(--c4)" font-size="10">gerbang &#10003;</text><text x="370" y="80" fill="var(--c4)" font-size="10">gerbang &#10003;</text>
</g>
<text x="240" y="30" text-anchor="middle" fill="var(--text)" font-size="12" font-weight="600">Gerbang tiap tahap: error, latency, golden-set live, thumbs-down</text>
<text x="240" y="185" text-anchor="middle" fill="var(--chart-text)" font-size="10">gagal gerbang di tahap mana pun = rollback otomatis, bukan diskusi</text>
</g></svg>`;

const LLMOPS10_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Peluang salah rollback: 1,8 persen pada 50 sampel vs kurang dari 0,1 persen pada 600 sampel."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">1%</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">2%</text><rect x="85.7" y="36.0" width="129.6" height="144.0" rx="3" fill="var(--c4)"/><text x="150.5" y="30.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">1,8%: BUKTI KUAT</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">n=50</text><rect x="294.7" y="178.0" width="129.6" height="2.0" rx="3" fill="var(--c1)"/><text x="359.5" y="172.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">&lt;0,1%: AMAN</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">n=600</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">P(salah hukum canary sehat)</text></svg>`;

export const llmops10: V2Lesson = {
  slug: "llmops10-deploy",
  track: "LLMOps",
  module: "Safety & Skala",
  title: "LLMOps10 — Deploy: Canary & Rollback untuk LLM",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Deploy 100% yang merusak parser 3 jam",
      prose: [
        "Juni 2026. NusaBank meng-upgrade model chatbot — langsung 100% traffic, Jumat sore. Dua puluh menit kemudian, tim laporan menyadari format JSON dari chatbot berubah: field `tanggal` yang tadinya `14 Jun 2026` menjadi `2026-06-14`. Parser downstream crash, antrean laporan menumpuk, dan rollback manual butuh 3 jam karena tidak ada yang tahu persis versi mana yang terakhir stabil.",
        "Twist-nya: jika mereka memakai canary 5%, masalah yang sama akan tertangkap dalam 20 menit dengan hanya ~50 user terdampak — bukan 3 jam dengan ribuan user. Canary bukan tentang `pelan-pelan`; ia tentang `membatasi radius ledakan saat asumsi kita salah` — dan untuk LLM, asumsi kita lebih sering salah dari yang kita akui.",
        "Lesson ini tentang strategi deploy LLM: canary bertahap dengan gerbang evaluasi, metrik khusus LLM (bukan cuma error rate), dan rollback otomatis yang tidak butuh rapat.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) memilih strategi deploy (canary, blue-green, shadow) sesuai jenis perubahan; (2) menghitung berapa lama canary harus berjalan agar cukup bukti; (3) merancang gerbang evaluasi per tahap canary dengan metrik LLM; (4) mengeksekusi rollback < 5 menit saat gerbang gagal.",
      ],
      tasks: [],
      note: {
        title: "Mitos: kalau sudah lolos staging, deploy 100% aman",
        type: "pitfall",
        body: "Yang benar: staging tidak punya traffic nyata — variasi pertanyaan user produksi 100x lebih liar dari skenario uji. Untuk LLM yang perilakunya sensitif terhadap input, produksi adalah satu-satunya test yang jujur. Canary = menjalankan test itu dengan radius ledakan kecil.",
      },
      reference: "Canary 5% → 25% → 50% → 100% dengan gerbang tiap tahap. Radius ledakan kecil.",
    },
    {
      id: "strategi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Canary, blue-green, shadow: pilih senjatamu",
      prose: [
        "Canary: sebagian kecil traffic (5%) ke versi baru, sisanya ke versi lama; naikkan bertahap jika gerbang lolos. Kelebihan: menangkap masalah produksi nyata dengan dampak terbatas; kekurangan: butuh routing traffic dan waktu. Blue-green: dua environment penuh, alihkan traffic sekaligus setelah verifikasi — cepat tapi radius ledakan 100% saat dialihkan; cocok untuk perubahan kecil yang sudah sangat yakin.",
        "Shadow: versi baru menerima salinan traffic tapi jawabannya dibuang (tidak sampai ke user) — nol dampak user, tapi tidak menangkap masalah yang hanya terlihat dari interaksi (follow-up question, kepuasan). Untuk LLM, shadow bagus untuk mengukur latency/biaya, buruk untuk mengukur kualitas.",
        "💡 Intuisi: untuk LLM, canary adalah default yang benar. Perilaku LLM terlalu sensitif terhadap variasi input nyata untuk diuji tanpa user — dan terlalu berisiko untuk diuji ke semua user sekaligus. Canary adalah kompromi yang jujur.",
      ],
      formula: String.raw`\text{rollback} \iff (e_c > 3 \times e_b) \lor (g_c < g_b - 10)`,
      formulaNote: "e_c/e_b = error rate canary/baseline; g_c/g_b = pass rate golden-set live canary/baseline. Rollback jika error 3x lipat ATAU golden set turun >10 poin.",
      tasks: [],
      note: {
        title: "Mitos: canary hanya memantau error rate",
        type: "pitfall",
        body: "Yang benar: untuk LLM, error teknis sering TETAP NOL sementara perilaku rusak (format berubah, jawaban ngawur tapi HTTP 200). Gerbang canary LLM wajib mencakup golden-set live (sampel jawaban dinilai) dan thumbs-down rate — bukan cuma error/latency.",
      },
      reference: "Canary default untuk LLM; gerbang = error + latency + golden live + thumbs-down.",
    },
    {
      id: "gerbang",
      eyebrow: "Langkah 3 · Konsep",
      title: "Gerbang evaluasi dan rollback otomatis",
      prose: [
        "Tiap tahap canary punya gerbang: (1) error rate canary ≤ 3x baseline, (2) p95 latency tidak naik >20%, (3) golden-set live (50–100 jawaban canary dinilai checker/juri) tidak turun >10 poin, (4) thumbs-down rate tidak naik signifikan. Gagal satu gerbang = rollback otomatis ke versi lama. `Otomatis` artinya tidak butuh persetujuan manusia — manusia terlalu lambat untuk radius ledakan yang membesar tiap menit.",
        "Ambang 3× di lesson ini adalah pilihan kontekstual NusaBank, bukan konstanta universal — track lain memakai ambang berbeda untuk sistem berbeda (mis. AAI15: error rate >2× baseline selama 15 menit untuk agen); tiap sistem menetapkan ambangnya dari biaya false alarm vs biaya bencana yang ia tanggung. Yang universal adalah PRINSIPNYA: ambang ditulis sebelum deploy, bukan saat panik.",
        "Rollback harus semudah deploy: satu pointer versi (LLMOps2), satu perintah, <5 menit. Latih rollback seperti latihan kebakaran — tim yang belum pernah rollback dalam latihan akan butuh 3 jam saat incident sungguhan (seperti NusaBank).",
        "💡 Intuisi: definisikan kriteria rollback SEBELUM deploy, bukan saat incident. Di tengah kepanikan, setiap ambang terlihat `masih bisa ditoleransi`. Keputusan yang dibuat saat tenang selalu lebih baik dari keputusan saat panik.",
        "💡 Intuisi: canary tanpa rollback otomatis = observasi tanpa rem. Menonton metrik memburuk sambil menunggu persetujuan atasan adalah cara paling mahal untuk belajar.",
      ],
      tasks: [],
      note: {
        title: "Mitos: rollback = kegagalan tim",
        type: "pitfall",
        body: "Yang benar: rollback adalah bukti sistem keselamatan bekerja — seperti airbag mengembang. Tim yang tidak pernah rollback mungkin bukan `selalu benar`, melainkan `tidak pernah cukup berani bereksperimen` atau `tidak punya deteksi`. Rayakan rollback yang cepat.",
      },
      reference: "Gerbang 4 metrik; rollback otomatis <5 menit; latih seperti latihan kebakaran.",
    },
    {
      id: "lab-canary",
      eyebrow: "Langkah 4 · Lab",
      title: "Simulasi canary: putuskan rollback atau lanjut",
      prose: [
        "Lab ini mensimulasikan canary NusaBank: 50 request (5%) ke model baru dengan error rate 8%, 950 request ke baseline dengan error rate 1%. Tugasmu: hitung error rate tiap sisi, terapkan aturan rollback (canary > 3x baseline), dan hitung berapa user yang `diselamatkan` canary dibanding deploy 100% langsung.",
        "Coba eksplorasi: ubah seed atau error rate canary menjadi 2%. Pada titik berapa keputusan berubah dari rollback menjadi lanjut?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rate_c` = error rate canary (%)" },
        { id: "t2", text: "Hitung `rate_b` = error rate baseline (%)" },
        { id: "t3", text: "Terapkan aturan: `rollback` = rate_c > 3 × rate_b" },
      ],
      expected: "canary=12.0%  base=1.05%  rollback=True  diselamatkan~114",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membandingkan jumlah error mentah (6 vs 10) bukan rate. 6 dari 50 JAUH lebih buruk dari 10 dari 950. Selalu normalisasi dengan ukuran sampel — canary kecil dengan error sedikit bisa lebih berbahaya dari baseline besar dengan error banyak.",
      },
      hints: [
        "Rate = error / total × 100 untuk tiap sisi.",
        "Aturan rollback: rate_c > 3 * rate_b.",
        "rollback = rate_c > 3 * rate_b  → boolean True/False",
      ],
      code: {
        starter: `import random\n\nrng = random.Random(42)\nn_canary, n_base = 50, 950\nerr_c = sum(rng.random() < 0.08 for _ in range(n_canary))\nerr_b = sum(rng.random() < 0.01 for _ in range(n_base))\n\n# TULIS KODEMU: hitung rate tiap sisi + keputusan rollback\nrate_c = \nrate_b = \nrollback = \nselamat = int(1000 * rate_c / 100) - err_c\n\nprint(f"canary={rate_c:.1f}%  base={rate_b:.2f}%  rollback={rollback}  diselamatkan~{selamat}")`,
        lockLines: 8,
        solution: `import random\n\nrng = random.Random(42)\nn_canary, n_base = 50, 950\nerr_c = sum(rng.random() < 0.08 for _ in range(n_canary))\nerr_b = sum(rng.random() < 0.01 for _ in range(n_base))\n\n# TULIS KODEMU: hitung rate tiap sisi + keputusan rollback\nrate_c = err_c / n_canary * 100\nrate_b = err_b / n_base * 100\nrollback = rate_c > 3 * rate_b\nselamat = int(1000 * rate_c / 100) - err_c\n\nprint(f"canary={rate_c:.1f}%  base={rate_b:.2f}%  rollback={rollback}  diselamatkan~{selamat}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rate_c", value: 12.0, tol: 1e-9, label: "`rate_c` seharusnya 12.0", msg: "6/50 × 100 = 12%." },
          { kind: "equal", task: "t2", name: "rate_b", value: 1.0526, tol: 0.01, label: "`rate_b` seharusnya ~1.05", msg: "10/950 × 100 ≈ 1,05%." },
          { kind: "equal", task: "t3", name: "rollback", value: true, label: "`rollback` seharusnya True", msg: "12% > 3 × 1,05% = 3,16% → rollback." },
          { kind: "stdout_matches", task: "t3", pattern: "canary=12\\.0%\\s+base=1\\.05%\\s+rollback=True", label: "`print` menampilkan keputusan", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Bandingkan rate, bukan jumlah mentah. Rollback otomatis tanpa rapat.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Strategi deploy untuk tiap jenis perubahan",
      prose: [
        "Lima skenario. Satu: upgrade model vendor (perilaku bisa bergeser halus) → canary 5%→100% dengan gerbang golden-set live. Dua: update prompt kecil (typo, contoh) → canary singkat 5%→100% dalam 1 jam; tetap pakai gerbang. Tiga: perubahan infrastruktur (naik tier, ganti region) → blue-green: perilaku model sama, yang diuji adalah infra.",
        "Empat: ingin tahu biaya/latency model baru tanpa risiko user → shadow 24 jam dulu, baru canary. Lima: hotfix keamanan (block pola serangan) → deploy cepat ke 100% DENGAN rollback siap — kecepatan mitigasi mengalahkan kehati-hatian canary saat serangan aktif.",
        "Aturan praktis 10 detik: `makin besar ketidakpastian perilaku, makin kecil langkah canary pertama`. Tidak yakin sama sekali → 1%. Yakin 90% → 5%. Hanya hotfix keamanan yang boleh 100% langsung — dan itu pun dengan jari di tombol rollback.",
      ],
      figure: {
        svg: CANARY_SVG,
        alt: "Tahapan canary: 5 persen, 25 persen, 50 persen, 100 persen, dengan gerbang evaluasi di tiap tahap.",
        caption: "Cara membaca: lingkaran = tahap traffic, angka di bawah = durasi tipikal, centang = gerbang lolos. Interpretasi: masalah NusaBank tertangkap di lingkaran pertama (5%, 20 menit) — bukan setelah 100% dan 3 jam. Waktu tiap tahap membeli informasi; gerbang mengubah informasi menjadi keputusan.",
      },
      tasks: [],
      note: {
        title: "Mitos: canary memperlambat inovasi",
        type: "pitfall",
        body: "Yang benar: canary 5%→100% selesai dalam ~30 jam — jauh lebih cepat dari 3 jam incident + 2 minggu investigasi + 1 bulan kehilangan kepercayaan. Kecepatan yang diperhitungkan bukan `waktu ke deploy`, melainkan `waktu ke nilai yang aman`.",
      },
      reference: "Ketidakpastian besar → canary kecil. Hotfix keamanan → cepat + rollback siap.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Rp72 juta yang bisa jadi 114 user",
      prose: [
        "Incident Juni: 3 jam × 2.000 request/jam = 6.000 request gagal diproses. Biaya penanganan manual Rp12.000 per request → 6.000 × 12.000 = Rp72.000.000. Dengan canary 5%: hanya ~50 user terdampak di 20 menit pertama, gerbang gagal, rollback otomatis — total ~6 user gagal (dari lab) vs 120 jika 100% langsung. Canary `menyelamatkan` ~114 user dari pengalaman rusak + Rp72 juta biaya.",
        "Pertanyaan analisis: (a) biaya membangun pipeline canary (routing + gerbang + rollback) vs Rp72 juta incident — kapan break-even? (b) mengapa NusaBank butuh 3 jam untuk rollback manual — komponen apa yang hilang? (c) untuk LLM, mengapa gerbang golden-set live lebih penting dari error rate?",
        "Jawaban yang defensibel: (a) pipeline canary dibangun sekali (~2–4 minggu engineer) dan dipakai selamanya; satu incident Rp72jt sudah melebihi biayanya — break-even di incident pertama yang dicegah. (b) hilang: pointer versi produksi yang jelas (LLMOps2), perintah rollback satu langkah, dan latihan. (c) karena kegagalan perilaku LLM tidak menaikkan error HTTP — format berubah = HTTP 200 yang merusak parser. Error rate buta terhadap ini.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Deploy 100% langsung untuk sistem LLM adalah risiko operasional yang seharusnya masuk risk register: probabilitas kejadian × Rp72jt × frekuensi upgrade vendor per tahun. Setelah dihitung, canary bukan `best practice` — ia kontrol risiko yang wajib.",
      },
      reference: "6.000 × Rp12rb = Rp72jt. Break-even canary = 1 incident yang dicegah.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Berapa lama canary harus jalan? Hitung n-nya",
      prose: [
        "Canary 5% NusaBank: 50 request ke model baru, error rate 8% (4 error) vs baseline 2%. Rollback atau lanjut? Uji yang jujur memakai SE DI BAWAH HIPOTESIS NOL — SE₀ = √(0,02×0,98/50) ≈ 2,0% — bukan SE dari angka teramati (3,8%). Dan di n sekecil ini, uji yang tepat adalah binomial eksak, bukan uji-z: P(X ≥ 4 | p=0,02, n=50) ≈ 1,8%. Jadi 4 error dari 50 SUDAH bukti yang cukup kuat bahwa model lebih buruk dari baseline — keputusan rollback di sini BUKAN berdasarkan noise. (Di lab, yang teramati malah 6 error = 12%; P(X ≥ 6 | p=0,02, n=50) ≈ 0,05% — lihat Langkah 8.) Yang TIDAK bisa dilakukan 50 sampel: mendeteksi perbedaan KECIL secara andal. Untuk mendeteksi kenaikan error 2% → 5% (selisih 3pp) dengan 95% confidence: n ≈ 16 × p(1−p)/Δ² = 16 × 0,035 × 0,965 / 0,0009 ≈ 600 sampel per grup. Pada 5% dari 2.000 request/jam = 100/jam → butuh 6 JAM canary, bukan 30 menit.",
        "Inilah kesalahan paling umum canary LLM: durasi ditentukan oleh JADWAL (`30 menit lalu naik`), bukan oleh STATISTIK (`600 sampel lalu putuskan`). Canary 30 menit dengan 50 sampel menangkap bencana — 12% vs 1% ketahuan seketika — tapi buta terhadap degradasi halus: model yang error-nya 5% lolos dari ambang 4 error 76% waktu. Aturan: tentukan Δ minimum yang ingin dideteksi (mis. kenaikan error 3pp), hitung n, konversi ke durasi dari traffic canary. Baru tentukan jadwal.",
        "Contoh jadwal yang benar: target deteksi Δ3pp error, n = 600/grup. Traffic 2.000/jam, canary 5% = 100/jam → 6 jam. Canary 10% = 200/jam → 3 jam (tapi blast radius 2x). Trade-off: canary KECIL = lama tapi aman; canary BESAR = cepat tapi berisiko. NusaBank memilih 5% × 6 jam untuk upgrade model (risiko tinggi), 20% × 1,5 jam untuk update prompt kecil (risiko rendah). Ukuran canary mengikuti RISIKO perubahan (LLMOps2: klasifikasi risiko!).",
        "Gerbang per tahap juga butuh n: tahap 5% (6 jam, n=600) → cek error + latency + golden-set live. Lolos → 25% (3 jam, n=1.500) → cek ulang + metrik bisnis awal. Lolos → 100%. Total waktu: ~12 jam untuk upgrade model. Terdengar lama? Bandingkan dengan insiden Juni: 3 jam × 2.000 request = 6.000 gagal = Rp72 juta. 12 jam canary = Rp0 (canary yang gagal hanya memengaruhi 5%). Waktu canary bukan biaya — ia premi.",
      ],
      formula: String.raw`n \approx \frac{16 \cdot p(1-p)}{\Delta^2}`,
      formulaNote: "n = sampel per grup (canary & baseline); p = baseline rate (mis. error 0,02); Δ = selisih minimum yang ingin dideteksi. Durasi canary = n / (traffic per jam × % canary). Jangan tentukan durasi dari jadwal — tentukan dari n.",
      tasks: [],
      note: {
        title: "💡 Intuisi: canary tanpa n = ritual keberuntungan",
        body: "Canary 30 menit yang `terlihat aman` lalu naik ke 100% = melempar koin dengan upacara. Tentukan dulu Δ yang ingin dideteksi, hitung n, konversi ke jam dari traffic canary. Jika n-nya butuh 6 jam, ya 6 jam — bukan 30 menit karena `jadwalnya begitu`.",
      },
      reference: "Ukuran canary mengikuti risiko perubahan. Total ~12 jam untuk upgrade model itu premi, bukan biaya.",
    },
    {
      id: "pendalaman-angka",
      eyebrow: "Langkah 8 · Membaca Angka",
      title: "50 sampel: terlalu sedikit untuk menghakimi",
      prose: [
        "Kasus lab: 50 request canary, 6 error (12%) vs baseline ~1–2%. Mari jadi hakim yang jujur. Hipotesis: model baru SAMA BAIKNYA (error 2%) — berapa peluang canary sehat menghasilkan 6 error atau lebih hanya karena sial? P(X ≥ 6 | p=0,02, n=50) ≈ 0,05%: dari 10.000 canary sehat, hanya ~5 yang terlihat seburuk ini. Bahkan ambang yang lebih longgar pun sudah ketat: P(X ≥ 4 | p=0,02, n=50) ≈ 1,8% — 4 error saja sudah bukti cukup kuat. Rollback di sini BUKAN menghukum yang tidak bersalah. Kelemahan 50 sampel justru di arah berlawanan: andai model memang rusak (error 8%), peluang ia terlihat `sebaik ini` (≤ 4 error) ≈ 63% — lebih sering lolos daripada ketahuan; peluang ia terlihat ≤ 6 error ≈ 90%. Jadi 50 sampel bukan koin yang adil ke dua arah: ia JARANG menghukum yang sehat (1,8%), tapi SERING meloloskan yang rusak (63%). Masalah n kecil adalah power rendah — bukan false alarm tinggi.",
        "Implikasinya untuk gerbang: dengan n kecil, gerbang bertugas MENOLAK yang jelas rusak — bukan menyetujui kenaikan. `Lanjut ke 25%` butuh n=600 (6 jam). Desain gerbang dua tingkat: TINGKAT 1 (n=50, 30 menit): tolak jika bencana — gerbang 3× baseline terlanggar jauh (kasus lab: 12% vs ~1% = 11× lipat) atau error absolut > 15% atau latency 3× — cepat dan murah. TINGKAT 2 (n=600, 6 jam): putuskan perbedaan HALUS (mis. 4% vs 2%) yang di n=50 masih abu-abu. Tanpa tingkat 1, bencana 15% error dibiarkan 6 jam: canary 5% dari 2.000 request/jam = 100/jam × 6 jam = 600 user terekspos, 90 di antaranya gagal. Tanpa tingkat 2, keputusan halus dibuat dari noise.",
        "Rollback < 5 menit adalah syarat agar canary berani: pointer versi (LLMOps2) + satu perintah + traffic kembali 100% ke lama. Latih rollback tiap kuartal seperti latihan kebakaran (MLOps12: error budget). NusaBank yang rollback-nya 3 jam (manual) TIDAK BERANI canary kecil — mereka deploy 100% langsung `karena rollback-nya ribet`. Ironis: semakin sulit rollback, semakin berani deploy-nya. Balik: semakin MUDAH rollback, semakin kecil canary yang berani diambil.",
      ],
      figure: {
        svg: LLMOPS10_DEEP_SVG,
        alt: "Diagram batang peluang salah menghukum canary yang sehat: 1,8% pada 50 sampel vs kurang dari 0,1% pada 600 sampel.",
        caption: "Cara membaca: tinggi batang = peluang canary SEHAT terlihat buruk (error ≥8% dari n) hanya karena sial. Interpretasi: dengan 50 sampel, hanya 1,8% canary sehat yang terlihat seburuk itu — 4 error sudah bukti cukup kuat, bukan noise; dengan 600 sampel (6 jam), peluang salah hukum praktis nol (<0,1%). Kelemahan 50 sampel bukan false alarm — melainkan power: model rusak 8% lolos dari ambang 4 error 63% waktu.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: semakin mudah rollback, semakin berani canary kecil",
        body: "Tim yang rollback-nya 3 jam tidak berani canary — mereka deploy 100% langsung. Tim yang rollback-nya 1 perintah (< 5 menit) berani canary 1%. Investasi terbaik untuk keberanian deploy bukan tool canary yang canggih, melainkan rollback yang membosankan dan cepat.",
      },
      reference: "Gerbang 2 tingkat: tolak bencana di n=50; putuskan halus di n=600. Latih rollback kuartalan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Canary default untuk LLM: 5% → 25% → 50% → 100% dengan gerbang tiap tahap.",
        "Gerbang LLM = error + latency + golden-set live + thumbs-down; bukan cuma error rate.",
        "Rollback otomatis <5 menit; kriteria ditetapkan sebelum deploy, bukan saat panik.",
        "Shadow untuk biaya/latency; blue-green untuk infra; canary untuk perilaku.",
        "Break-even pipeline canary = satu incident yang dicegah.",
      ],
      next: { label: "LLMOps11 — Feedback Loop", href: "/v2/learn/llmops11-feedback" },
      quiz: [
        {
          q: "Mengapa error rate saja tidak cukup sebagai gerbang canary LLM?",
          options: [
            { text: "Error rate terlalu lambat dihitung", why: "Error rate justru cepat — masalahnya bukan kecepatan." },
            { text: "Kegagalan perilaku (format berubah) tetap HTTP 200 — error rate buta", why: "LLM gagal secara `sukses`: status OK, isi merusak parser. Butuh golden-set live.", correct: true },
            { text: "Error rate tidak bisa diukur di canary", why: "Bisa — hanya tidak cukup sendirian." },
            { text: "LLM tidak pernah error teknis", why: "LLM bisa timeout/rate-limit; itu bukan poinnya." },
          ],
        },
        {
          q: "Dalam lab: canary 6/50 error, baseline 10/950. Mengapa keputusan = rollback?",
          options: [
            { text: "Karena 6 < 10, canary lebih baik — lanjut", why: "Membandingkan jumlah mentah tanpa normalisasi ukuran sampel — jebakan klasik." },
            { text: "Rate canary 12% > 3× baseline 1,05% — melanggar gerbang", why: "Aturan 3x lipat melindungi dari fluktuasi kecil sekaligus menangkap degradasi nyata.", correct: true },
            { text: "Karena seed random-nya 42", why: "Seed hanya untuk reproduksibilitas, bukan dasar keputusan." },
            { text: "Canary 5% terlalu kecil untuk disimpulkan", why: "50 sampel cukup untuk sinyal 12% vs 1% — bedanya 11x lipat." },
          ],
        },
        {
          q: "Kapan blue-green lebih tepat dari canary?",
          options: [
            { text: "Upgrade model vendor yang perilakunya belum dikenal", why: "Itu kasus canary — ketidakpastian perilaku butuh langkah kecil." },
            { text: "Perubahan infrastruktur dengan perilaku model yang sama", why: "Yang diuji infra (latency, konektivitas) — bukan perilaku; alihkan sekaligus setelah verifikasi.", correct: true },
            { text: "Hotfix keamanan aktif", why: "Hotfix butuh kecepatan, bukan blue-green yang butuh verifikasi penuh dulu." },
            { text: "Tidak pernah — canary selalu menang", why: "Terlalu absolut; tiap strategi ada wilayahnya." },
          ],
        },
        {
          q: "Tim ingin deploy Jumat sore 100% langsung `karena sudah lolos staging`. Responsmu?",
          options: [
            { text: "Setuju — staging sudah cukup", why: "Staging tak punya variasi input produksi; Jumat sore + 100% = radius ledakan maksimal di waktu respons minimal." },
            { text: "Tolak — canary dengan gerbang; Jumat sore dilarang untuk perubahan berisiko", why: "Dua prinsip: batasi radius ledakan + jangan deploy berisiko saat tim respons tipis.", correct: true },
            { text: "Setuju asal CTO menyetujui", why: "Persetujuan atasan tidak mengubah matematika risiko." },
            { text: "Tunda sampai Senin tanpa canary", why: "Senin 100% langsung tetap 100% — harinya bukan masalah utama." },
          ],
        },
        {
          q: "6.000 request gagal × Rp12.000. Total biaya incident?",
          options: [
            { text: "Rp72.000.000", why: "6.000 × 12.000 = Rp72jt.", correct: true },
            { text: "Rp7.200.000", why: "Kurang satu nol." },
            { text: "Rp720.000.000", why: "Kelebihan satu nol." },
            { text: "Rp18.000.000", why: "Itu 1.500 × 12.000 — salah volume." },
          ],
        },
        {
          q: "Canary 5%, 50 sampel: 6 error (12%) vs baseline ~1%. Tindakan TEPAT?",
          options: [
            { text: "Tahan di 5%, tunggu 600 sampel (6 jam), baru putuskan", why: "Menahan canary 12% vs baseline ~1% selama 6 jam = membiarkan ~90 user gagal lagi; bukti sudah kuat (P(X ≥ 6 | p=0,02) ≈ 0,05%) dan gerbang 3× baseline sudah terlanggar jauh (11×). n=600 dibutuhkan untuk perbedaan HALUS (5% vs 2%), bukan untuk 12% vs 1%." },
            { text: "Rollback sekarang — 12% jauh di atas baseline ~1%", why: "Tepat. 6 error dari 50 saat baseline ~1–2% adalah bukti kuat (P ≈ 0,05%) dan melanggar gerbang 3× baseline (12% > 3,2%) — rollback sekarang, bukan tunggu.", correct: true },
            { text: "Lanjut ke 100% — 12% masih dalam batas wajar", why: "Sama salahnya ke arah berlawanan: bukti sudah kuat bahwa model lebih buruk dari baseline. Lanjut = berjudi dengan 95% traffic." },
            { text: "Naikkan ke 50% agar sampel terkumpul lebih cepat", why: "Menaikkan ke 50% sebelum bukti = menjadikan setengah produksi sebagai kelinci percobaan. Kecepatan pengumpulan sampel tidak boleh dibayar dengan blast radius." },
          ],
        },
      ],
    },
  ],
};
