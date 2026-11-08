import type { V2Lesson } from "../lib/types";

export const mk16: V2Lesson = {
  slug: "mk16-digital-ads",
  track: "Marketing Analytics",
  module: "Iklan Digital",
  title: "MK16 — Ekonomi Iklan Digital",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-sepatulari",
      eyebrow: "Langkah 1 · Cerita SepatuLari",
      title: "Bid 3x lipat, CPA naik 2,5x",
      prose: [
        "SepatuLari menaikkan bid 3x agar \u201Cmenang lelang\u201D. Hasil: CPA naik 2,5x. Lalu mereka menurunkan bid 30% + memperbaiki quality (landing page, relevansi) — CPA turun 40%.",
        "Pelajaran: lelang iklan tidak dimenangkan oleh bid tertinggi, melainkan Ad Rank = bid × quality. Bid besar dengan quality jelek = bayar mahal untuk posisi jelek.",
        "Lesson ini: matematika lelang (GSP), funnel CPA, dan syarat smart bidding.",
      ],
      tasks: [],
      reference: "Ad Rank = bid × quality. Bid buta = bakar uang.",
    },
    {
      id: "ad-rank-lab",
      eyebrow: "Langkah 2 · Ad Rank & lab",
      title: "Menang lelang, bayar secukupnya",
      prose: [
        "Ad Rank = bid × quality_score. Pemenang = Ad Rank tertinggi. Yang dibayar = AdRank_pesaing_bawah / quality_kamu + 1 — cukup untuk mengalahkan pesaing, tidak lebih.",
        "Worked: A (bid 4.000, quality 10) → AdRank 40.000. B (bid 6.000, quality 8) → 48.000. B menang, bayar 40.000/8 + 1 = Rp5.001. B tidak membayar bid-nya (6.000) — ia membayar seperlunya.",
        "Di lab ini kamu mensimulasikan lelang 3 pengiklan. Lihat: yang bid-nya tertinggi belum tentu menang.",
      ],
      formula: String.raw`\text{Ad Rank} = \text{bid} \times \text{quality} \qquad \text{CPC}_{\text{bayar}} = \frac{\text{AdRank}_{\text{bawah}}}{\text{quality}} + 1`,
      formulaNote: "Ad Rank = skor lelang: bid = tawaran maksimum per klik; quality = quality score (relevansi iklan, landing page, CTR historis). Pemenang = Ad Rank tertinggi. CPC yang dibayar = AdRank pengiklan di bawahmu dibagi quality-mu, +1: cukup untuk mengalahkan pesaing, tidak membayar bid sendiri. Quality tinggi = bayar lebih murah untuk posisi sama.",
      tasks: [
        { id: "t1", text: "Hitung `adrank` tiap pengiklan dan tentukan `pemenang`" },
        { id: "t2", text: "Hitung `cpc` yang dibayar pemenang, cetak" },
      ],
      expected: "pemenang=B cpc=4445.44",
      hints: [
        "adrank = bid * quality.",
        "Pemenang = adrank tertinggi: max(data, key=...).",
        "cpc = adrank_kedua / quality_pemenang + 1.",
      ],
      code: {
        starter: `# (nama, bid, quality)\ndata = [("A", 4000, 10), ("B", 6000, 9), ("C", 5000, 7)]\n\n# TULIS KODEMU: adrank, pemenang, CPC yang dibayar\nranked = sorted(data, key=lambda x: x[1]*x[2], reverse=True)\npemenang =\nadrank2 =\ncpc =\n\nprint(f"pemenang={pemenang} cpc={cpc:.2f}")`,
        lockLines: 5,
        solution: `# (nama, bid, quality)\ndata = [("A", 4000, 10), ("B", 6000, 9), ("C", 5000, 7)]\n\n# TULIS KODEMU: adrank, pemenang, CPC yang dibayar\nranked = sorted(data, key=lambda x: x[1]*x[2], reverse=True)\npemenang = ranked[0][0]\nadrank2 = ranked[1][1] * ranked[1][2]\ncpc = adrank2 / ranked[0][2] + 1\n\nprint(f"pemenang={pemenang} cpc={cpc:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pemenang", value: "B", label: "`pemenang` seharusnya B", msg: "AdRank: A=40.000, B=54.000, C=35.000. B tertinggi." },
          { kind: "equal", task: "t2", name: "cpc", value: 4445.44, tol: 0.01, label: "`cpc` sekitar 4445,44", msg: "40.000/9 + 1. B tidak membayar 6.000." },
          { kind: "stdout_matches", task: "t2", pattern: "pemenang=B", label: "`print` menampilkan pemenang", msg: "Format: pemenang=... cpc=... ." },
        ],
      },
      reference: "Bayar = AdRank bawah/quality + 1. Quality = tuas termurah.",
    },
    {
      id: "funnel-cpa",
      eyebrow: "Langkah 3 · Funnel CPA",
      title: "CPA = CPC / CVR: clickbait itu mahal",
      prose: [
        "CPA = CPC / conversion rate. Iklan clickbait: CPC murah (Rp2rb) tapi CVR 0,2% → CPA Rp1jt. Iklan jujur: CPC Rp5rb, CVR 5% → CPA Rp100rb. Clickbait 10x lebih mahal — walau kliknya \u201Cmurah\u201D.",
        "Optimasi CPC tanpa melihat CVR = optimasi setengah funnel. Selalu tarik sampai CPA (atau ROAS): CPC × (1/CVR).",
        "Implikasi: budget kreatif (copy, landing page) sering ROI-nya lebih tinggi dari budget bid — ia menaikkan quality (CPC turun) dan CVR (CPA turun) sekaligus.",
      ],
      formula: String.raw`\text{CPA} = \frac{\text{CPC}}{\text{CVR}}`,
      formulaNote: "CPA = cost per acquisition: CPC = biaya per klik; CVR = conversion rate (fraksi klik yang convert). CPC murah dengan CVR hancur = CPA mahal (jebakan clickbait: Rp2rb/0,2% = Rp1jt vs Rp5rb/5% = Rp100rb). Optimasi selalu ditarik sampai CPA/ROAS — bukan berhenti di CPC.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Bangga CPC turun tanpa cek CPA. CPC turun 50% + CVR turun 80% = CPA naik 150%. Satu-satunya angka yang penting di ujung adalah CPA/ROAS.",
        type: "pitfall",
      },
      reference: "Optimasi sampai CPA, bukan CPC.",
    },
    {
      id: "smart-bidding",
      eyebrow: "Langkah 4 · Smart bidding",
      title: "Syarat tCPA/tROAS bekerja",
      prose: [
        "Target CPA / target ROAS = bid otomatis by machine learning. Syaratnya: minimal ~30 konversi/minggu — di bawah itu algoritma tidak punya cukup sinyal dan bid-nya ngawur.",
        "Budget ≥ 10× target CPA per hari. Target CPA Rp100rb = budget minimal Rp1jt/hari. Budget terlalu kecil = algoritma tidak pernah keluar dari fase learning.",
        "Jangan ganti target tiap hari — setiap perubahan me-reset learning. Beri 1–2 minggu, nilai by CPA aktual vs target, bukan by firasat.",
      ],
      tasks: [],
      reference: "≥30 konversi/minggu. Budget ≥10× CPA. Jangan utak-atik harian.",
    },
    {
      id: "gsp-worked",
      eyebrow: "Langkah 5 · GSP 4 pengiklan",
      title: "Bid tertinggi kalah: kasus D",
      prose: [
        "Worked example 4 pengiklan: A (5.000×8=40.000), B (6.000×9=54.000), C (4.000×10=40.000), D (20.000×2=40.000). B menang slot 1, bayar 40.000/9+1 = Rp4.446.",
        "D: bid tertinggi (20.000!) tapi quality 2 → AdRank 40.000, kalah dari B. Bid 3,3x lipat B tidak ada gunanya tanpa quality.",
        "Inilah matematika di balik cerita SepatuLari: menaikkan bid tanpa quality = membayar lebih untuk hasil yang sama atau lebih buruk. Turunkan bid + naikkan quality = CPA −40%.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Perang bid tanpa quality = lelang yang hanya menguntungkan platform. Tetapkan max CPC by unit economics (MK1: batas CAC), bukan by ego \u201Charus nomor 1\u201D.",
        type: "risk",
      },
      reference: "Bid tertinggi ≠ menang. Quality = pengganda gratis.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 6 · Kuis cepat",
      title: "Cek intuisimu",
      prose: [
        "Tiga soal cepat.",
      ],
      tasks: [],
      quiz: [
        {
          q: "A: bid 4.000 quality 10. B: bid 6.000 quality 8. Siapa menang & bayar berapa?",
          options: [
            { text: "B menang, bayar Rp5.001", why: "AdRank 48.000 > 40.000; bayar 40.000/8+1.", correct: true },
            { text: "B menang, bayar Rp6.000", why: "GSP: bayar secukupnya mengalahkan pesaing, bukan bid sendiri." },
            { text: "A menang — quality lebih tinggi", why: "Yang dibandingkan AdRank (48rb vs 40rb), bukan quality saja." },
          ],
        },
        {
          q: "Iklan X: CPC Rp2rb, CVR 0,2%. Iklan Y: CPC Rp5rb, CVR 5%. Mana lebih murah?",
          options: [
            { text: "Y — CPA Rp100rb vs X Rp1jt", why: "CPA = CPC/CVR. Klik murah ≠ akuisisi murah.", correct: true },
            { text: "X — CPC-nya lebih murah", why: "Jebakan clickbait: CPC murah, CPA 10x lipat." },
            { text: "Sama", why: "1jt vs 100rb — jauh dari sama." },
          ],
        },
        {
          q: "tCPA dengan 10 konversi/minggu dan budget 3× CPA. Apa yang terjadi?",
          options: [
            { text: "Algoritma kekurangan sinyal + budget — hasil ngawur", why: "Butuh ≥30 konversi/minggu dan ≥10× CPA. Di bawah itu = judi.", correct: true },
            { text: "Tetap optimal", why: "ML butuh data; 10/minggu tidak cukup." },
            { text: "Lebih hemat", why: "Hemat budget, boros hasil." },
          ],
        },
      ],
    },
    {
      id: "adv-pacing",
      eyebrow: "Langkah 7 · Pacing & musiman lelang",
      title: "Lelang punya cuaca: pacing dan inflasi musiman",
      prose: [
        "Harga lelang tidak konstan — ia punya cuaca. 11.11 dan Lebaran: CPM naik 2–3x karena semua pengiklan berebut perhatian yang sama. Budget yang sama = impresi separuh. Analis yang tidak menyesuaikan target CPA musiman akan panik melihat CPA 'memburuk' padahal itu cuaca, bukan kinerja.",
        "Pacing: jangan habiskan budget di jam-jam murah buta. Jika conversion terkonsentrasi 19.00–22.00, dayparting (fokus jam ramai) menaikkan efisiensi. Sebaliknya, learning phase butuh sebaran merata — dayparting agresif di minggu pertama membuat algoritma belajar dari sampel bias.",
        "Aturan: kalender musiman lelang ditulis setahun ke depan (11.11, Lebaran, Natal, gajian); target CPA dilonggarkan ±30% di puncak musiman; evaluasi kinerja SELALU year-on-year periode yang sama — bukan vs bulan lalu yang cuacanya beda.",
      ],
      tasks: [],
      quiz: [
        {
          q: "CPA naik 40% saat 11.11 dibanding Oktober. Reaksi pertama?",
          options: [
            { text: "Cek cuaca lelang — CPM musiman naik 2–3x; bandingkan YoY, bukan MoM", why: "Kenaikan musiman = cuaca, bukan kinerja. Keputusan by perbandingan yang salah = salah.", correct: true },
            { text: "Potong budget — kinerja memburuk", why: "Memotong di puncak demand = menyerahkan pasar ke kompetitor." },
            { text: "Naikkan bid agar menang", why: "Perang bid di cuaca mahal = transfer uang ke platform." },
            { text: "Matikan kampanye", why: "Berlebihan; sesuaikan target, bukan matikan." },
          ],
        },
        {
          q: "Kapan dayparting agresif BERBAHAYA?",
          options: [
            { text: "Minggu pertama (learning phase) — algoritma belajar dari sampel bias", why: "Sampel jam-terbatas = model salah paham audiens.", correct: true },
            { text: "Tidak pernah — selalu bagus", why: "Terlalu dini = bias pembelajaran." },
            { text: "Saat budget besar", why: "Budget besar justru butuh sebaran untuk learning." },
            { text: "Saat conversion merata", why: "Itu kondisi dayparting tidak perlu, bukan berbahaya." },
          ],
        },
      ],
      reference: "Kenali cuaca lelang; target musiman ±30%; evaluasi YoY.",
    },
    {
      id: "adv-walled-garden",
      eyebrow: "Langkah 8 · Walled garden",
      title: "Angka platform vs kebenaran: mengukur di dalam tembok",
      prose: [
        "Google, Meta, TikTok masing-masing mengklaim conversion yang sama — dijumlahkan bisa 180% dari penjualan aktual. Walled garden: tiap platform mengatribusi untuk dirinya sendiri dengan jendela dan modelnya sendiri. Menjumlahkan laporan platform = menghitung ganda.",
        "Solusi: (1) satu sumber kebenaran internal (server-side tracking + dedup, MK2); (2) alokasi by eksperimen/holdout per platform, bukan by laporan platform; (3) geo test mematikan satu platform sejenak untuk mengukur kontribusi inkrementalnya yang sebenarnya.",
        "Aturan keras: jangan pernah menjumlahkan conversion antar-platform. Angka platform = bahan negosiasi mereka, bukan bahan keputusanmu.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Google klaim 60, Meta klaim 70, TikTok klaim 50; penjualan aktual 100. Masalah dan solusi?",
          options: [
            { text: "Double-counting antar walled garden — pakai satu sumber kebenaran internal + eksperimen", why: "180 vs 100 = 80% fiktif. Jumlah laporan platform bukan total kebenaran.", correct: true },
            { text: "Data penjualan salah", why: "Penjualan = kas nyata; yang patut dicurigai klaim platform." },
            { text: "Naikkan budget ketiganya — semua bekerja", why: "Scale by angka ganda = over-invest sistematis." },
            { text: "Pilih platform dengan klaim tertinggi", why: "Klaim tertinggi = atribusi paling agresif, bukan kinerja terbaik." },
          ],
        },
      ],
      reference: "Satu sumber kebenaran internal; alokasi by eksperimen, bukan laporan platform.",
    },
    {
      id: "intuisi-sewa",
      eyebrow: "Langkah 9 · Intuisi",
      title: "Lelang tidak peduli seberapa besar bid-mu — ia peduli seberapa relevan kamu",
      prose: [
        "SepatuLari menaikkan bid 3x dan CPA naik 2,5x — lelang menghukum yang mencoba membeli kemenangan. Tiga heuristik untuk bermain dengan benar.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: kamu tidak membeli klik — kamu menyewa perhatian di pasar yang menawar balik",
        body: "Heuristik pertama: quality adalah satu-satunya diskon yang sah. Setiap poin quality menaikkan Ad Rank TANPA menaikkan bayaran — dan menurunkan CPC yang dibayar. Budget kreatif (copy, landing page, relevansi) hampir selalu ROI-nya lebih tinggi dari budget bid: ia menaikkan quality (CPC turun) dan CVR (CPA turun) sekaligus. Tim yang hanya mengutak-atik bid sedang memainkan setengah papan. Heuristik kedua: tetapkan harga maksimum dari ekonomi, bukan dari ego. Max CPC = batas CAC dibagi (1/CVR) — angka dari unit economics (MK1), bukan dari keinginan 'harus peringkat 1'. Peringkat 1 dengan CPA jebol = piala yang dibayar dengan kerugian. Tulis max CPC di kontrak kampanye; jika lelang memaksa di atasnya, mundur — pasar sedang mahal, bukan kamu yang kalah. Heuristik ketiga: jangan percaya angka dari pihak yang dibayar saat angkanya bagus. Platform dibayar dari spend-mu; laporannya dirancang membuatmu spend lebih. Satu sumber kebenaran internal + holdout berkala = satu-satunya cara tahu berapa yang benar-benar inkremental. Analis yang mengalokasikan by dashboard platform = kasir yang percaya kata pembeli soal kembaliannya.",
      },
      reference: "Quality = diskon sah; max CPC dari ekonomi; verifikasi angka platform.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 10 · Peta keputusan",
      title: "Peta keputusan: scale iklan tanpa membangunkan jebakan",
      prose: [
        "Skenario satu — mau scale 10x (Rp50jt → Rp500jt): jangan sekaligus. Naikkan bertahap agar tidak me-reset learning phase algoritma ke mode eksplorasi liar.",
        "Skenario dua — CPA naik saat scale: cek saturasi audiens (frekuensi 3x = fatigue) dan konteks lelang (momen 11.11, CPM +150%). Kadang jawabannya 'tunggu', bukan 'bid lebih'.",
        "Skenario tiga — memilih strategi bid: smart bidding butuh volume konversi cukup untuk belajar. Volume kecil → bid manual dulu; memaksa smart bidding di data tipis adalah autopilot tanpa bahan bakar.",
        "Skenario empat — walled garden: jangan bandingkan ROAS antar platform mentah-mentah (definisi konversi beda). Satu definisi internal untuk semua.",
        "Skenario lima — pacing: sebar budget mengikuti pola musiman permintaan, bukan rata harian. Budget rata di bulan sepi adalah bayar mahal untuk audiens yang tidak membeli.",
        "Aturan praktis 10 detik: scale bertahap? Frekuensi dan CPM dimonitor? Volume cukup untuk smart bidding? Definisi konversi seragam? Pacing ikut musiman?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menaikkan bid untuk 'memenangkan' lelang. SepatuLari menaikkan bid 3x, CPA naik 2,5x — lelang GSP menghukum yang mencoba membeli kemenangan. Yang menang adalah yang paling relevan, bukan yang paling berani.",
      },
      reference: "Scale bertahap → monitor frekuensi dan CPM → smart bidding bila volume cukup → pacing musiman.",
    },
    {
      id: "minicase-sepatulari2",
      eyebrow: "Langkah 11 · Mini-case",
      title: "SepatuLari, bagian 2: scale Rp50jt → Rp500jt/bulan",
      prose: [
        "Setelah CPA turun 40% (bid −30% + quality), SepatuLari mau scale 10x: Rp50jt → Rp500jt/bulan. Tiga jebakan menunggu: (1) learning phase — budget 10x dalam seminggu me-reset algoritma ke mode eksplorasi liar; (2) saturasi audiens — audiens inti 2 juta orang, frekuensi naik 3x → fatigue; (3) cuaca — scale bertepatan 11.11, CPM +150%.",
        "Rencana disiplin: naikkan 30–50% per minggu (bukan 10x sekaligus); perluas audiens bertahap (lookalike 1% → 3% → 5%); pisahkan budget 11.11 dengan target CPA dilonggarkan +30%; holdout 10% untuk mengukur inkrementalitas scale.",
        "Hasil 8 minggu: spend Rp380jt/bulan (bukan 500jt — saturasi terdeteksi di Rp400jt via marginal CPA), CPA naik hanya 12% vs baseline, iROAS holdout 3,1. Scale yang 'gagal' mencapai 500jt justru sukses: menemukan batas saturasi sebelum uang terbakar.",
        "Pertanyaan: (1) Mengapa 10x sekaligus berbahaya? (2) Apa gunanya holdout di sini? (3) Kapan berhenti scale?",
        "Pembahasan: (1) Learning reset + fatigue + cuaca = tiga pukulan sekaligus; bertahap = tiap variabel terisolasi. (2) Holdout membuktikan scale inkremental (3,1), bukan sekadar atribusi yang ikut membesar. (3) Berhenti saat marginal CPA > batas CAC — scale adalah eksperimen dengan aturan berhenti, bukan target angka.",
      ],
      tasks: [],
      quiz: [
        {
          q: "SepatuLari berhenti di Rp380jt/bulan (target 500jt) karena saturasi. Ini kegagalan?",
          options: [
            { text: "Bukan — menemukan batas saturasi sebelum uang terbakar = scale yang disiplin", why: "Tujuan scale = profit maksimal, bukan angka spend. Marginal CPA > batas = berhenti.", correct: true },
            { text: "Ya — target tidak tercapai", why: "Target spend bukan tujuan bisnis; profit yang tujuan." },
            { text: "Ya — harusnya paksa 500jt", why: "Memaksa = marginal CPA jebol = bakar uang demi angka." },
            { text: "Tidak bisa dinilai", why: "Bisa: iROAS 3,1 + CPA +12% = data lengkap." },
          ],
        },
        {
          q: "Aturan menaikkan budget yang aman?",
          options: [
            { text: "30–50% per minggu + holdout + aturan berhenti by marginal CPA", why: "Bertahap mengisolasi variabel; holdout memverifikasi; aturan berhenti melindungi.", correct: true },
            { text: "10x sekaligus — algoritma pintar", why: "Learning reset + fatigue = resep bencana." },
            { text: "Naikkan saat CPA turun saja", why: "CPA turun bisa musiman; butuh holdout untuk kepastian." },
            { text: "Jangan pernah naikkan", why: "Berlebihan; scale bertahap yang terukur = sehat." },
          ],
        },
      ],
      reference: "Scale bertahap; berhenti di marginal CPA > batas CAC.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran. Lelang dimenangkan oleh matematika, bukan oleh bid terbesar.",
      ],
      tasks: [],
      summary: [
        "Ad Rank = bid × quality; bayar = AdRank bawah/quality + 1.",
        "CPA = CPC/CVR; clickbait (Rp1jt) kalah dari jujur (Rp100rb).",
        "tCPA/tROAS: ≥30 konversi/minggu, budget ≥10× CPA, jangan utak-atik harian.",
        "Bid tertinggi bisa kalah (kasus D); quality = tuas termurah.",
        "Max CPC by unit economics (batas CAC), bukan ego peringkat.",
        "Kenali cuaca lelang: target musiman +-30%; evaluasi YoY, bukan MoM.",
        "Satu sumber kebenaran internal; jangan jumlahkan klaim antar-platform.",
      ],
      next: { label: "MK17 — Text Analytics", href: "/v2/learn/mk17-text-analytics" },
      quiz: [
        {
          q: "Kenapa SepatuLari CPA-nya turun 40% setelah menurunkan bid?",
          options: [
            { text: "Quality naik → AdRank terjaga + CPC turun + CVR naik", why: "Tiga efek sekaligus. Bid turun saja tanpa quality = kehilangan posisi.", correct: true },
            { text: "Kebetulan musiman", why: "Mekanismenya jelas: quality memperbaiki semua sisi persamaan." },
            { text: "Kompetitor berhenti", why: "Tidak ada bukti; penjelasannya internal." },
          ],
        },
        {
          q: "D bid 20.000 quality 2 vs B bid 6.000 quality 9. Pelajaran?",
          options: [
            { text: "Quality mengalahkan bid — 3,3x bid tidak menolong D", why: "AdRank = perkalian. Quality 2 = bid berapa pun tersandera.", correct: true },
            { text: "D kurang menaikkan bid", why: "Sudah 3,3x B. Masalahnya bukan bid." },
            { text: "Lelang tidak adil", why: "Aturannya transparan: perbaiki quality." },
          ],
        },
        {
          q: "Kapan menaikkan bid adalah langkah benar?",
          options: [
            { text: "CPA di bawah target dan volume kurang — ada ruang by unit economics", why: "Keputusan by batas CAC (MK1), bukan by peringkat.", correct: true },
            { text: "Agar selalu peringkat 1", why: "Peringkat 1 dengan CPA jebol = piala yang mahal." },
            { text: "Kompetitor menaikkan bid", why: "Perang bid = transfer uang ke platform." },
          ],
        },
        {
          q: "Smart bidding learning phase di-reset oleh?",
          options: [
            { text: "Mengubah target/budget besar tiap hari", why: "Algoritma butuh stabilitas 1–2 minggu untuk belajar.", correct: true },
            { text: "Hari libur", why: "Itu variasi data, bukan reset." },
            { text: "Tidak ada — sekali set jalan terus", why: "Perubahan besar memang me-reset." },
          ],
        },
        {
          q: "CPC turun 50% tapi CPA naik 150%. Penjelasan?",
          options: [
            { text: "CVR turun lebih dalam (80%) — optimasi setengah funnel", why: "CPA = CPC/CVR. CPC saja menipu.", correct: true },
            { text: "Data salah", why: "Matematis mungkin: 0,5/0,2 = 2,5x." },
            { text: "Tidak mungkin", why: "Sangat mungkin — jebakan klasik." },
          ],
        },
      ],
    },
  ],
};
