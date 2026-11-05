import type { V2Lesson } from "../lib/types";

export const mr8: V2Lesson = {
  slug: "mr8-risiko-suku-bunga",
  track: "Market Risk",
  module: "Risiko Suku Bunga",
  title: "MR8 — Risiko Suku Bunga: Duration, DV01, dan Lengkung yang Menyelamatkan",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-hedged",
      eyebrow: "Langkah 1 · Duration",
      title: "Cerita: bank yang hedged tapi tetap rugi",
      prose: [
        "Bank XYZ punya portofolio obligasi Rp2 triliun dengan duration 7 tahun. Untuk netral, treasury menjual obligasi pemerintah berduration 7 tahun senilai sama. Duration bersih = nol. Laporan risiko: hijau. Risiko suku bunga kami hedged sempurna, kata treasurer.",
        "Sebulan kemudian bank sentral menaikkan suku bunga acuan. Yang terjadi bukan parallel shift — suku bunga jangka pendek naik 150 bp, jangka panjang cuma 30 bp (kurva memipih/flattening). Hasilnya? Portofolio (tenor 10 tahun, sensitif ke long-end) rugi Rp45 miliar, hedge (tenor 3 tahun, sensitif ke short-end) untung cuma Rp12 miliar. Rugi bersih Rp33 miliar — dari posisi yang duration-netral.",
        "Twist-nya: duration mengasumsikan seluruh kurva bergerak paralel — asumsi yang hampir tidak pernah benar. Hedge yang sempurna di atas kertas runtuh karena bentuk kurva berubah, bukan levelnya. Macaulay duration sendiri adalah rata-rata tertimbang waktu diterimanya arus kas (bobot = PV tiap arus kas dibagi harga): kapan, rata-rata, uangmu kembali. Obligasi 10 tahun berkupon punya duration ~7–8 tahun; zero-coupon 10 tahun punya duration tepat 10 tahun.",
      ],
      formula: String.raw`D_{mac} = \sum_t t \cdot w_t, \qquad w_t = \frac{PV(CF_t)}{P}`,
      formulaNote: "D_mac = Macaulay duration (tahun) — rata-rata tertimbang waktu kas kembali; t = waktu arus kas; w_t = bobot = PV arus kas ke-t dibagi harga P; kupon besar → bobot awal besar → duration pendek.",
      tasks: [
        { id: "t1", text: "Jelaskan kenapa hedge duration-netral gagal dalam cerita di atas." },
        { id: "t2", text: "Kenapa kupon lebih besar → duration lebih pendek?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira duration 7 tahun artinya uang kembali dalam 7 tahun. Duration adalah rata-rata tertimbang, bukan janji — arus kas terakhir obligasi 10 tahun tetap di tahun ke-10. Jangan pakai duration untuk perencanaan likuiditas, dan jangan samakan tenor dengan risiko suku bunga.",
        type: "pitfall",
      },
      reference: "Duration = rata-rata tertimbang waktu kas kembali = juga ukuran sensitivitas (via modified).",
    },
    {
      id: "duration-dv01",
      eyebrow: "Langkah 2 · Modified & DV01",
      title: "Dari tahun ke rupiah: modified duration dan DV01",
      prose: [
        "Modified duration mengubah duration waktu menjadi sensitivitas harga: D_mod = D_mac / (1+y), dengan ΔP/P ≈ −D_mod · Δy. Tanda negatif = harga turun saat yield naik. DV01 menerjemahkannya ke rupiah per basis poin: DV01 = D_mod · P · 0,0001 — artinya tiap yield naik 1 bp, nilai berubah DV01 rupiah. Ini bahasa limit: trader dan risk manager bicara DV01, bukan duration.",
        "Contoh: obligasi P = Rp1 miliar, D_mod = 7,5, yield naik 50 bp. DV01 = 7,5 × 1 M × 0,0001 = Rp750 ribu/bp. ΔP ≈ −750 rb × 50 = −Rp37,5 juta. Cek silang: −7,5 × 0,005 × 1 M = −Rp37,5 juta. Konsisten. Limit desk DV01 maks Rp5 juta/bp langsung bisa dibandingkan dengan Rp750 ribu ini.",
        "Hitung sendiri dari arus kas: obligasi 3 tahun, kupon 8%, yield 8%, face 100. Arus kas 8, 8, 108. Hitung PV tiap arus kas, lalu Macaulay duration, modified duration, dan DV01-nya.",
      ],
      formula: String.raw`D_{mod} = \frac{D_{mac}}{1+y}, \qquad \text{DV01} = D_{mod} \cdot P \cdot 0{,}0001`,
      formulaNote: "D_mod = modified duration — mengubah satuan tahun menjadi sensitivitas harga; y = yield; DV01 = perubahan nilai per 1 bp (0,0001) — bahasa rupiah untuk limit harian.",
      tasks: [
        { id: "t1", text: "Hitung `Dmac` (Macaulay duration, tahun) dari `cf` dan `y`" },
        { id: "t2", text: "Hitung `Dmod` dan `dv01`, lalu cetak ketiganya" },
      ],
      expected: "Dmac=2.7833  Dmod=2.5771  dv01=0.02577",
      note: {
        title: "Sering salah",
        body: "Lupa membagi dengan (1+y) saat mengubah Macaulay ke modified duration. Keduanya beda: Macaulay dalam tahun (waktu), modified untuk sensitivitas harga. Untuk yield 8%, selisihnya ~7% — cukup besar untuk merusak limit.",
        type: "pitfall",
      },
      hints: [
        "pv_t = cf_t / (1+y)^t untuk tiap arus kas; P = jumlah pv.",
        "Dmac = jumlah(t * pv_t) / P. Perlu enumerate mulai dari 1.",
        "Dmod = Dmac/(1+y); dv01 = Dmod * P * 0.0001.",
      ],
      code: {
        starter: `# Obligasi 3 tahun, kupon 8%, yield 8%, face 100\ncf = [8, 8, 108]\ny = 0.08\n\n# TULIS KODEMU: PV tiap arus kas, lalu Dmac, Dmod, DV01\npv = \nP = \nDmac = \nDmod = \ndv01 = \n\nprint(f"Dmac={Dmac:.4f}  Dmod={Dmod:.4f}  dv01={dv01:.5f}")`,
        lockLines: 3,
        solution: `# Obligasi 3 tahun, kupon 8%, yield 8%, face 100\ncf = [8, 8, 108]\ny = 0.08\n\n# TULIS KODEMU: PV tiap arus kas, lalu Dmac, Dmod, DV01\npv = [c / (1 + y) ** t for t, c in enumerate(cf, 1)]\nP = sum(pv)\nDmac = sum(t * p for t, p in enumerate(pv, 1)) / P\nDmod = Dmac / (1 + y)\ndv01 = Dmod * P * 0.0001\n\nprint(f"Dmac={Dmac:.4f}  Dmod={Dmod:.4f}  dv01={dv01:.5f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "Dmac", value: 2.7833, tol: 0.001, label: "`Dmac` seharusnya 2.7833", msg: "(1×7,407 + 2×6,859 + 3×85,734)/100. Cek bobot PV tiap arus kas." },
          { kind: "equal", task: "t2", name: "Dmod", value: 2.5771, tol: 0.001, label: "`Dmod` seharusnya 2.5771", msg: "2,7833/1,08. Jangan lupa bagi (1+y)." },
          { kind: "equal", task: "t2", name: "dv01", value: 0.02577, tol: 0.0005, label: "`dv01` seharusnya 0.02577", msg: "2,5771 × 100 × 0,0001 (per 100 face)." },
          { kind: "stdout_matches", task: "t2", pattern: "Dmac=2\\.7833\\s+Dmod=2\\.5771\\s+dv01=0\\.02577", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "D_mod = D_mac/(1+y). DV01 = D_mod·P·0,0001: bahasa rupiah untuk limit.",
    },
    {
      id: "convexity",
      eyebrow: "Langkah 3 · Convexity",
      title: "Koreksi orde-2: lengkung yang menguntungkan",
      prose: [
        "Hubungan harga-yield melengkung (konveks) — aproksimasi linear (duration) selalu meremehkan harga aktual, ke dua arah. Convexity mengukur kelengkungan: C = Σ t(t+1)·PV(CF_t) / (P(1+y)²), dengan ΔP/P ≈ −D_mod·Δy + ½·C·(Δy)². Suku kedua selalu positif untuk obligasi biasa — selalu menguntungkan pemegangnya.",
        "Kenapa menguntungkan? Saat yield turun besar, harga naik lebih dari prediksi duration; saat yield naik besar, harga turun lebih sedikit dari prediksi duration. Asimetri yang menguntungkan — inilah convexity premium: pasar bersedia membayar (yield lebih rendah) untuk obligasi ber-convexity tinggi. Untuk shock ±200bp, error duration-only bisa material — jangan abaikan orde-2.",
        "Untuk obligasi 3 tahun tadi (C ≈ 9,30), shock +200bp: duration-only memberi ΔP = −5,15, dengan convexity −4,97 — sangat dekat dengan harga eksak −4,97. Selisih 0,19 terlihat kecil di sini, tetapi untuk tenor panjang dan shock stres (±300bp+), koreksinya menentukan.",
      ],
      formula: String.raw`\frac{\Delta P}{P} \approx -D_{mod}\Delta y + \tfrac{1}{2} C (\Delta y)^2`,
      formulaNote: "ΔP/P = perubahan harga relatif; Δy = perubahan yield; D_mod = modified duration; C = convexity — suku kedua selalu positif untuk obligasi biasa (menguntungkan), bisa negatif untuk obligasi callable.",
      tasks: [
        { id: "t1", text: "Hitung `C` (convexity) dari `pv` dan `y` yang sudah ada" },
        { id: "t2", text: "Hitung `dP_dur` dan `dP_cvx` untuk shock +200bp, lalu cetak" },
      ],
      expected: "C=9.3002  dP_dur=-5.1542  dP_cvx=-4.9682",
      note: {
        title: "Sering salah",
        body: "Mengira convexity selalu positif. Obligasi ber-embedded-option (callable) punya negative convexity di sekitar harga call: saat yield turun, harga tertahan di harga call karena penerbit akan membeli kembali. Semua intuisi konveks-itu-baik terbalik untuk obligasi callable.",
        type: "pitfall",
      },
      hints: [
        "C = jumlah(t*(t+1)*pv_t) / (P*(1+y)**2). P = 100 di sini.",
        "dP_dur = -Dmod*P*dy; dP_cvx = dP_dur + 0.5*C*P*dy**2, dengan dy=0.02, Dmod=2.5771.",
        "Suku convexity positif — ia mengoreksi (mengurangi) kerugian prediksi duration.",
      ],
      code: {
        starter: `# Lanjutan obligasi 3 tahun: pv, P, Dmod sudah diketahui\npv = [7.4074, 6.8587, 85.7339]\nP, Dmod, y = 100.0, 2.5771, 0.08\ndy = 0.02  # shock +200bp\n\n# TULIS KODEMU: convexity, lalu dP dua versi\nC = \ndP_dur = \ndP_cvx = \n\nprint(f"C={C:.4f}  dP_dur={dP_dur:.4f}  dP_cvx={dP_cvx:.4f}")`,
        lockLines: 4,
        solution: `# Lanjutan obligasi 3 tahun: pv, P, Dmod sudah diketahui\npv = [7.4074, 6.8587, 85.7339]\nP, Dmod, y = 100.0, 2.5771, 0.08\ndy = 0.02  # shock +200bp\n\n# TULIS KODEMU: convexity, lalu dP dua versi\nC = sum(t * (t + 1) * p for t, p in enumerate(pv, 1)) / (P * (1 + y) ** 2)\ndP_dur = -Dmod * P * dy\ndP_cvx = dP_dur + 0.5 * C * P * dy ** 2\n\nprint(f"C={C:.4f}  dP_dur={dP_dur:.4f}  dP_cvx={dP_cvx:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "C", value: 9.3002, tol: 0.01, label: "`C` seharusnya 9.3002", msg: "Σ t(t+1)·PV / (P(1+y)²). Cek pembagi (1+y)²." },
          { kind: "equal", task: "t2", name: "dP_dur", value: -5.1542, tol: 0.01, label: "`dP_dur` seharusnya −5.1542", msg: "−2,5771 × 100 × 0,02." },
          { kind: "equal", task: "t2", name: "dP_cvx", value: -4.9682, tol: 0.01, label: "`dP_cvx` seharusnya −4.9682", msg: "−5,1542 + 0,5×9,30×100×0,0004. Dekat dengan eksak −4,97." },
        ],
      },
      reference: "Convexity: koreksi orde-2, selalu positif untuk obligasi biasa. Wajib untuk shock besar.",
    },
    {
      id: "key-rate",
      eyebrow: "Langkah 4 · Key-rate duration",
      title: "Melawan asumsi paralel",
      prose: [
        "Duration biasa mengasumsikan parallel shift — seluruh kurva naik/turun sama. Key-rate duration (KRD) mengukur sensitivitas terhadap perubahan tiap titik tenor kurva secara terpisah: KRD_k = −(1/P)(∂P/∂y_k), dengan jumlah semua KRD = modified duration. Jadi KRD adalah bedah duration per titik kurva (1Y, 2Y, 5Y, 10Y, 30Y…).",
        "Inilah yang membunuh asumsi cerita pembuka: portofolio duration-netral (D=0) bisa punya KRD +3 tahun di 2Y dan −3 tahun di 10Y — taruhan besar pada bentuk kurva (steepening/flattening) yang tidak terlihat dari duration total. Jika 2Y naik dan 10Y turun (flattening), posisi ini rugi di kedua kaki. Hedge yang benar: netralkan KRD per bucket, bukan cuma duration total.",
        "Aturan praktis: operasional → DV01; relatif → modified duration; shock besar → tambah convexity; bentuk kurva → key-rate. Duration-netral ≠ hedged — cek KRD sebelum klaim netral. Dan waspada: obligasi ber-embedded-option punya negative convexity — semua intuisi konveks-itu-baik terbalik.",
      ],
      tasks: [
        { id: "t1", text: "Portofolio D=0 tetapi KRD +3 thn di 2Y, −3 thn di 10Y. Jelaskan risikonya." },
        { id: "t2", text: "Bagaimana membangun hedge yang tahan twist?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira dua portofolio ber-duration sama punya risiko suku bunga sama. Duration sama hanya berarti sensitif sama terhadap parallel shift — skenario yang jarang terjadi murni. Terhadap twist, keduanya bisa bergerak berlawanan arah. Selalu cek distribusi KRD, bukan cuma totalnya.",
        type: "pitfall",
      },
      reference: "KRD: sensitivitas per titik kurva; jumlahnya = D_mod. Netralkan per bucket untuk hedge tahan twist.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Metrik mana, kapan",
      prose: [
        "Empat keputusan. Pertama, limit harian atau komunikasi trader → DV01 (rupiah per bp): satuan rupiah langsung dibandingkan dengan P&L dan limit — DV01 Rp5 juta lebih operasional daripada duration 7,3. Kedua, shock besar atau stress test (±200bp+) → duration + convexity: aproksimasi linear sistematis salah untuk shock besar; untuk obligasi ber-opsi (callable), convexity bisa negatif — hati-hati.",
        "Ketiga, hedging atau risiko bentuk kurva → key-rate duration per bucket: duration total buta terhadap bentuk; netralkan KRD per bucket untuk hedge yang tahan twist. Keempat, perbandingan risiko relatif antar obligasi → modified duration: satuan per 1% yield membuat perbandingan apel-to-apel antar obligasi berbeda harga/kupon.",
        "Aturan 10 detik: operasional → DV01; relatif → modified duration; shock besar → tambah convexity; bentuk kurva → key-rate. Dan selalu ingat: duration-netral bukan berarti hedged.",
      ],
      tasks: [
        { id: "t1", text: "Desk butuh limit harian. Metrik apa dan kenapa?" },
        { id: "t2", text: "Kapan convexity wajib dimasukkan, dan kapan ia bisa negatif?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "2022 adalah tahun obligasi terburuk dalam sejarah modern: kenaikan suku bunga agresif + shock besar = tahun di mana aproksimasi duration-only gagal total dan hedge berbasis duration total runtuh di twist. Metrik yang tepat bukan soal presisi akademis — ia menentukan apakah bank selamat di tahun seperti 2022.",
        type: "risk",
      },
      reference: "Operasional → DV01. Relatif → D_mod. Shock besar → +convexity. Bentuk → KRD.",
    },
    {
      id: "minicase-twist",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Twist yang membunuh hedge",
      prose: [
        "Kembali ke Bank XYZ. Portofolio Rp2 triliun (tenor 10 tahun, sensitif ke long-end), hedge obligasi pemerintah tenor 3 tahun (sensitif ke short-end) senilai sama. Duration bersih = 0. Skenario bank sentral: short-end +150 bp, long-end +30 bp.",
        "Hitung kasarnya: portofolio rugi Rp45 miliar (long-end +30 bp × DV01 besar tenor 10Y), hedge untung Rp12 miliar (short-end +150 bp × DV01 kecil tenor 3Y — arahnya menguntungkan tetapi basisnya kecil). Rugi bersih Rp33 miliar dari posisi yang katanya hedged sempurna.",
        "Tiga pertanyaan untuk risk manager: berapa KRD per bucket sebelum hedge disetujui (apakah +3/−3 tersembunyi)? Skenario twist apa yang diuji — atau hanya parallel shift? Dan apakah hedge dinilai ulang saat kurva berubah bentuk, bukan cuma saat level berubah? Hedge yang tidak diuji terhadap twist bukan hedge — ia taruhan bentuk kurva yang tidak disadari.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan dengan angka kenapa hedge Rp12 M tidak menutup rugi Rp45 M." },
        { id: "t2", text: "Tuliskan tiga pertanyaan risk manager sebelum menyetujui hedge duration-netral." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Kerugian Rp33 miliar ini bukan kegagalan pasar — ia kegagalan metrik. Laporan risiko berwarna hijau karena metriknya (duration total) buta terhadap risiko yang sebenarnya (bentuk kurva). Pilih metrik yang buta = pilih untuk tidak melihat.",
        type: "risk",
      },
      reference: "Duration-netral + twist = taruhan bentuk kurva tersembunyi. Uji KRD per bucket.",
    },
    {
      id: "effective-duration",
      eyebrow: "Langkah 7 · Effective duration",
      title: "Saat duration biasa berbohong: obligasi ber-opsi",
      prose: [
        "Semua duration di lesson ini mengasumsikan arus kas tetap — tetapi obligasi callable bisa dibeli kembali penerbitnya saat yield turun, dan obligasi putable bisa dijual kembali investornya saat yield naik. Arus kasnya berubah mengikuti yield, sehingga rumus D_mac/D_mod yang memakai arus kas tetap memberi jawaban salah. Obatnya: effective duration — ukur sensitivitas langsung dari harga: D_eff = −(P_+ − P_−)/(2·P_0·Δy), dengan P_+ dan P_− = harga hasil valuasi ulang penuh (termasuk model opsi) saat yield ±Δy.",
        "Kenapa ini penting: di sekitar harga call, obligasi callable punya negative convexity — saat yield turun, harga tertahan di harga call karena penerbit akan menebusnya; investor tidak menikmati kenaikan harga penuh. Effective duration menangkap ini otomatis karena ia memakai harga hasil valuasi ulang, bukan rumus arus kas tetap. Aturan praktis: arus kas pasti → modified duration cukup; ada embedded option → effective duration wajib.",
        "Konsep terkait yang dipakai pasar: option-adjusted spread (OAS) — spread di atas kurva bebas risiko setelah mengeluarkan nilai opsi yang tertanam. Dua obligasi callable dengan yield sama bisa punya OAS berbeda: yang OAS-nya lebih tinggi memberi kompensasi lebih baik untuk risiko yang sama. Untuk konteks Indonesia: SBN ritel (ORI, Sukuk Ritel) umumnya tanpa opsi — duration biasa berlaku; tetapi obligasi korporasi dengan fitur call semakin umum, dan di sanalah effective duration/OAS menjadi bahasa yang benar.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa modified duration salah untuk obligasi callable." },
        { id: "t2", text: "Kapan memakai effective duration dan kapan modified duration cukup?" },
      ],
      note: {
        title: "Intuisi: metrik harus mengikuti arus kas, bukan sebaliknya",
        body: "Prinsip senior: setiap metrik punya asumsi arus kas di dalamnya — pakai metrik yang asumsinya cocok dengan instrumenmu. Lima heuristik. Pertama: sebelum memakai duration, tanya apakah arus kasnya pasti — jika ada opsi tertanam (call/put), rumus arus-kas-tetap berbohong dan effective duration adalah jawabannya. Kedua: negative convexity bukan teori — di sekitar harga call, obligasi callable berhenti naik saat yield turun; hedge yang memakai duration biasa akan over-hedge tepat di zona ini. Ketiga: bandingkan obligasi ber-opsi via OAS, bukan via yield — yield mencampur kompensasi risiko dengan harga opsi yang kamu jual; OAS memisahkannya. Keempat: untuk SBN ritel tanpa opsi, jangan over-engineering — modified duration dan DV01 sudah bahasa yang benar; kecanggihan yang tidak dibutuhkan adalah noise. Kelima: setiap kali struktur produk berubah (callable baru diterbitkan, suku bunga mendekati strike opsi), evaluasi ulang metrikmu — metrik yang benar tahun lalu bisa salah tahun ini. Keenam: untuk hedging obligasi ber-opsi, lindungi nilai terhadap pergerakan yield kecil dengan effective duration, tetapi siapkan skenario terpisah untuk yield yang menembus strike — di sanalah convexity berubah tanda dan hedge linear jebol. Aturan 10 detiknya: arus kas pasti → modified; ada opsi → effective + OAS; dan selalu tanya di mana convexity berubah tanda.",
      },
      reference: "Arus kas berubah → effective duration (valuasi ulang). Bandingkan via OAS, bukan yield.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut.",
      ],
      tasks: [],
      summary: [
        "Macaulay duration = rata-rata tertimbang waktu kas kembali; kupon besar → duration pendek.",
        "Modified duration = D_mac/(1+y); DV01 = D_mod·P·0,0001 — bahasa rupiah untuk limit.",
        "Convexity: koreksi orde-2, selalu positif untuk obligasi biasa; wajib untuk shock besar (±200bp+).",
        "Key-rate duration: sensitivitas per titik kurva; jumlahnya = D_mod; netralkan per bucket untuk hedge tahan twist.",
        "Duration-netral ≠ hedged. Obligasi callable punya negative convexity.",
      ],
      next: { label: "MR9 — Kurva Yield", href: "/learn/mr9-kurva-yield" },
      quiz: [
        {
          q: "Obligasi P=Rp1 M, D_mod=7,5. Yield naik 50bp. Estimasi ΔP?",
          options: [
            { text: "−Rp37,5 juta", why: "DV01 = 7,5 × 1M × 0,0001 = Rp750rb/bp; × 50bp = −Rp37,5 juta.", correct: true },
            { text: "−Rp750 ribu", why: "itu DV01 per 1 bp — belum dikali 50 bp." },
            { text: "+Rp37,5 juta", why: "Salah tanda: harga turun saat yield naik." },
            { text: "−Rp375 juta", why: "kelebihan satu nol — 750rb × 50 = 37,5 jt, bukan 375 jt." },
          ],
        },
        {
          q: "Zero-coupon 10 tahun. Macaulay duration-nya?",
          options: [
            { text: "5 tahun", why: "bukan setengah tenor." },
            { text: "10 tahun — semua kas di akhir, jadi rata-rata tertimbang = tenor", why: "hanya satu arus kas di t=10 dengan bobot 1 → D_mac = 10. Kasus khusus: untuk zero-coupon, duration = tenor.", correct: true },
            { text: "0 tahun", why: "justru maksimal — tidak ada kupon yang mempercepat." },
            { text: "Tergantung yield", why: "untuk zero-coupon, duration = tenor berapa pun yield-nya." },
          ],
        },
        {
          q: "Untuk shock +300bp, aproksimasi duration-only akan…",
          options: [
            { text: "Tetap akurat", why: "untuk shock besar, error-nya material." },
            { text: "Sistematis meremehkan harga (error material) — butuh koreksi convexity orde-2", why: "kurva harga-yield konveks; garis singgung selalu di bawah kurva.", correct: true },
            { text: "Melebih-lebihkan harga", why: "arahnya terbalik — justru meremehkan." },
            { text: "Tidak bisa dipakai sama sekali", why: "masih bisa dipakai sebagai aproksimasi awal, hanya perlu koreksi." },
          ],
        },
        {
          q: "Portofolio duration-netral (D=0) tetapi KRD +3 thn di 2Y dan −3 thn di 10Y. Ini adalah…",
          options: [
            { text: "Hedge sempurna", why: "justru sebaliknya." },
            { text: "Taruhan bentuk kurva (flattening/steepening) yang tersembunyi — akan rugi/untung besar saat kurva twist", why: "duration total nol menyembunyikan taruhan bentuk kurva.", correct: true },
            { text: "Tidak ada risiko", why: "risikonya besar, hanya tersembunyi dari duration total." },
            { text: "Arbitrase", why: "bukan arbitrase — ini eksposur berisiko." },
          ],
        },
        {
          q: "Untuk limit harian desk obligasi, metrik paling operasional?",
          options: [
            { text: "Macaulay duration (tahun)", why: "satuan tahun harus diterjemahkan dulu ke rupiah." },
            { text: "DV01 (rupiah per bp) — langsung dibandingkan dengan P&L dan limit", why: "DV01 Rp5jt/bp vs limit Rp8jt/bp langsung bisa diputuskan.", correct: true },
            { text: "Convexity", why: "convexity untuk shock besar, bukan monitoring harian." },
            { text: "Yield to maturity", why: "yield bukan ukuran risiko." },
          ],
        },
      ],
    },
  ],
};
