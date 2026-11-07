import type { V2Lesson } from "../lib/types";

const KONVEKS_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Kurva price-yield konveks untuk obligasi durasi panjang dan pendek, plus garis singgung di yield kini.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="60" x2="500" y2="60"/><line x1="60" y1="100" x2="500" y2="100"/><line x1="60" y1="140" x2="500" y2="140"/><line x1="60" y1="180" x2="500" y2="180"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="64">120</text><text x="54" y="104">100</text><text x="54" y="144">80</text><text x="54" y="184">60</text></g>
<text x="28" y="120" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 28 120)">harga</text>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="240">2%</text><text x="207" y="240">4%</text><text x="353" y="240">6%</text><text x="500" y="240">8%</text></g>
<polyline points="115.0,25.9 133.3,35.4 151.7,44.5 170.0,53.3 188.3,61.8 206.7,69.9 225.0,77.9 243.3,85.5 261.7,92.9 280.0,100.0 298.3,106.9 316.7,113.5 335.0,119.9 353.3,126.1 371.7,132.1 390.0,137.9 408.3,143.5 426.7,148.8 445.0,154.0 463.3,159.1 481.7,163.9 500.0,168.6" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<polyline points="60.0,74.5 78.3,76.7 96.7,79.0 115.0,81.2 133.3,83.3 151.7,85.5 170.0,87.6 188.3,89.7 206.7,91.8 225.0,93.9 243.3,96.0 261.7,98.0 280.0,100.0 298.3,102.0 316.7,104.0 335.0,105.9 353.3,107.8 371.7,109.8 390.0,111.6 408.3,113.5 426.7,115.4 445.0,117.2 463.3,119.0 481.7,120.8 500.0,122.6" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<line x1="133" y1="156" x2="427" y2="44" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6,4"/>
<line x1="280" y1="20" x2="280" y2="220" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4,4"/>
<text x="286" y="32" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">yield kini</text>
<g font-size="10" font-family="var(--font-ui)" fill="var(--chart-text)"><line x1="70" y1="150" x2="92" y2="150" stroke="var(--c1)" stroke-width="2.5"/><text x="96" y="153">durasi panjang (D_mod 14, dari teks)</text><line x1="70" y1="166" x2="92" y2="166" stroke="var(--c2)" stroke-width="2.5"/><text x="96" y="169">durasi pendek</text><line x1="70" y1="182" x2="92" y2="182" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6,4"/><text x="96" y="185">garis singgung (aproksimasi duration)</text></g>
</svg>`;

export const pma7: V2Lesson = {
  slug: "pm-a7-fixed-income",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A7 Fixed Income: Pricing, Duration & Kredit",
  estMinutes: 55,
  steps: [
    {
      id: "pricing",
      eyebrow: "Langkah 1 · Pricing",
      title: "Obligasi \u2018aman\u2019 yang turun 20%",
      prose: [
        "Pak Hendra membeli obligasi pemerintah 20 tahun karena \u201caman — pasti dibayar\u201d. Kupon 6%. Setahun kemudian BI menaikkan suku bunga 2% — harga obligasinya anjlok 20%. Ia panik: \u201ckatanya aman?!\u201d",
        "Twist-nya: aman dari gagal bayar \u2260 aman dari risiko harga. Risiko suku bunga (duration 14 tahun!) menghantam duluan. \u201cAman\u201d punya banyak arti — dan investor obligasi yang tidak paham duration sedang memegang bom waktu berbunga.",
        "Harga obligasi = PV kupon + PV principal, didiskon pada YTM. Par (kupon = YTM), premium (kupon > YTM \u2192 harga > 100), discount (kupon < YTM \u2192 harga < 100). Aturan mekanis: yield naik \u2192 harga turun. Selalu. Tidak ada pengecualian.",
      ],
      formula: String.raw`P = \sum_{t=1}^{N} \frac{C}{(1+y)^t} + \frac{F}{(1+y)^N}`,
      formulaNote: "P = harga obligasi; C = kupon per periode (6); F = nilai nominal/principal (100); y = yield to maturity per periode (8%); N = jumlah periode (20). Interpretasi: harga adalah nilai kini dari semua janji kas — kuponnya tetap, yang bergerak adalah y (discount rate pasar). Contoh angka: 6 × [1 − 1,08^−20]/0,08 + 100/1,08^20 = 6 × 9,818 + 21,45 = 80,36 — kupon 6% tidak berubah, tetapi harga jatuh 20% karena yield naik dari 6% ke 8%.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko obligasi ada lima: suku bunga, kredit, inflasi, reinvestasi, likuiditas. Obligasi \u201caman\u201d dari gagal bayar bisa tetap menghancurkan portofolio lewat duration.",
      },
      reference: "Harga = PV kupon + principal. Yield naik \u2192 harga turun (selalu).",
    },
    {
      id: "harga-obligasi",
      eyebrow: "Langkah 2 · Hitung Harga",
      title: "Dari kupon 6% ke harga 80,36",
      prose: [
        "Obligasi 20 tahun, kupon 6, YTM naik dari 6% ke 8%. Harga = 6 \u00d7 [(1\u22121,08^\u221220)/0,08] + 100/1,08^20 = 6 \u00d7 9,818 + 21,45 = 80,36. Inilah pelajaran Pak Hendra: duration panjang = sensitivitas brutal.",
        "Perhatikan: kupon tetap 6, tetapi harga jatuh 20% karena discount rate berubah. Kupon menentukan arus kas; YTM menentukan harganya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `anuitas` = PV 20 kupon @8% (kupon=6)" },
        { id: "t2", text: "Hitung `pv_principal` dan `harga`, cetak harga 2 desimal" },
      ],
      expected: "harga=80.36",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira harga tetap 100 karena \u201ckupon tidak berubah\u201d. Harga = PV pada YTM kini — kupon tetap, discount rate yang bergerak.",
      },
      hints: [
        "PV anuitas = kupon \u00d7 [1 \u2212 (1+y)^\u2212N]/y.",
        "PV principal = face / (1+y)^N.",
        "anuitas = kupon * (1 - (1+ytm)**-n) / ytm\npv_principal = face / (1+ytm)**n\nharga = anuitas + pv_principal",
      ],
      code: {
        starter: `kupon, n, ytm, face = 6, 20, 0.08, 100\n\n# TULIS KODEMU\nanuitas = \npv_principal = \nharga = \n\nprint(f"harga={harga:.2f}")`,
        lockLines: 1,
        solution: `kupon, n, ytm, face = 6, 20, 0.08, 100\n\n# TULIS KODEMU\nanuitas = kupon * (1 - (1+ytm)**-n) / ytm\npv_principal = face / (1+ytm)**n\nharga = anuitas + pv_principal\n\nprint(f"harga={harga:.2f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "harga", value: 80.36, tol: 0.05, label: "`harga` sekitar 80.36", msg: "6\u00d79,818 + 21,45 = 80,36. Cek faktor anuitas 20 tahun @8%." },
          { kind: "stdout_matches", task: "t2", pattern: "harga=80\\.36", label: "`print` menampilkan harga", msg: "Format 2 desimal: harga=80.36." },
        ],
      },
      reference: "Harga = PV kupon + PV principal pada YTM kini.",
    },
    {
      id: "yield",
      eyebrow: "Langkah 3 · Yield",
      title: "YTM, current yield, dan spread",
      prose: [
        "YTM = return sebenarnya jika dipegang hingga jatuh tempo (dengan 3 syarat: pegang sampai maturity, kupon diinvestasikan kembali pada YTM, tidak default). Current yield = kupon/harga — mengabaikan capital gain/loss, sehingga menipu.",
        "Contoh: kupon 12% harga 130 vs kupon 6% harga 100 (tenor dan risiko sama) \u2192 return SAMA. Harga premium 130 \u2018memakan\u2019 kupon besarnya. Bandingkan YTM — kupon tanpa harga = ilusi.",
        "Spread = YTM \u2212 yield pemerintah setenor = harga risiko kredit. Spread melebar = pasar ketakutan (2008: spread IG 2% \u2192 6%); menyempit = pasar berani. Analis kredit membaca spread seperti dokter membaca tekanan darah.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai YTM sebagai realized return yang pasti. YTM butuh 3 syarat (tahan sampai maturity, reinvestasi pada YTM, tidak default) — jarang terpenuhi semua.",
      },
      reference: "YTM = return sebenarnya. Current yield menipu. Spread = harga risiko kredit.",
    },
    {
      id: "duration",
      eyebrow: "Langkah 4 · Duration",
      title: "Pengukur nyeri suku bunga",
      prose: [
        "Macaulay duration = rata-rata tertimbang waktu arus kas (tahun). Modified duration = MacDur/(1+y) \u2192 \u0394P/P \u2248 \u2212D_mod \u00d7 \u0394y. Aturan praktis: duration \u2248 % perubahan harga per 1% perubahan yield (tanda negatif). D_mod 14 \u2192 yield +1% \u2248 harga \u221214%.",
        "Konveksitas = koreksi orde-2 (kurva, bukan garis). Duration untuk \u0394 kecil; tambah convexity untuk \u0394 besar. Contoh: obligasi 3 tahun kupon 5%, harga 97,33, modified duration 2,70. Yield naik 1% \u2192 \u0394P \u2248 \u22122,70 \u00d7 1% \u00d7 97,33 = \u22122,63 \u2192 harga \u2248 94,70.",
      ],
      formula: String.raw`\frac{\Delta P}{P} \approx -D_{mod} \times \Delta y`,
      formulaNote: "ΔP/P = persentase perubahan harga; D_mod = modified duration (2,70 — sensitivitas harga per 1% perubahan yield); Δy = perubahan yield dalam desimal (1% = 0,01). Interpretasi: aturan “D tahun nyeri” — yield naik 1% menghapus D_mod% harga; aproksimasi linear yang akurat untuk perubahan kecil, meleset untuk perubahan besar (di situlah convexity masuk). Contoh angka: −2,70 × 0,01 = −2,7% → harga 97,33 menjadi ≈ 94,70.",
      tasks: [
        { id: "t1", text: "Hitung `delta` perubahan harga: D_mod=2,70, \u0394y=1%, harga 97,33" },
        { id: "t2", text: "Hitung `baru` = harga + delta, cetak 2 desimal" },
      ],
      expected: "baru=94.70",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menyamakan duration dengan maturity. Duration = maturity hanya untuk zero-coupon. Untuk kupon > 0, duration selalu lebih pendek dari maturity.",
      },
      hints: [
        "delta = \u2212D_mod \u00d7 \u0394y \u00d7 harga. Perhatikan tanda negatif.",
        "\u0394y = 0,01 untuk 1%.",
        "delta = -dmod * dy * harga\nbaru = harga + delta",
      ],
      code: {
        starter: `harga, dmod, dy = 97.33, 2.70, 0.01\n\n# TULIS KODEMU\ndelta = \nbaru = \n\nprint(f"baru={baru:.2f}")`,
        lockLines: 1,
        solution: `harga, dmod, dy = 97.33, 2.70, 0.01\n\n# TULIS KODEMU\ndelta = -dmod * dy * harga\nbaru = harga + delta\n\nprint(f"baru={baru:.2f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "baru", value: 94.7, tol: 0.05, label: "`baru` sekitar 94.70", msg: "\u22122,70 \u00d7 1% \u00d7 97,33 = \u22122,63 \u2192 94,70. Ini aproksimasi linear." },
          { kind: "stdout_matches", task: "t2", pattern: "baru=94\\.70", label: "`print` menampilkan harga baru", msg: "Format 2 desimal: baru=94.70." },
        ],
      },
      reference: "\u0394P/P \u2248 \u2212D_mod \u00d7 \u0394y. Duration untuk \u0394 kecil; +convexity untuk \u0394 besar.",
    },
    {
      id: "kredit-sekuritisasi",
      eyebrow: "Langkah 5 · Kredit",
      title: "Waterfall: kerugian dimakan dari bawah",
      prose: [
        "Risiko kredit: default, downgrade, spread widening. Rating (AAA \u2192 D) = opini kemampuan bayar, bukan kebenaran mutlak.",
        "Sekuritisasi: kumpulkan pinjaman \u2192 jual sebagai tranches: senior (dibayar pertama, rating tinggi), mezzanine, equity/first-loss (dibayar terakhir, return tertinggi). Waterfall: kerugian dimakan dari bawah (equity) ke atas. Pool Rp100M: senior 80, mezz 15, equity 5. Gagal bayar Rp12M \u2192 equity habis (5), mezz rugi 7 (sisa 8), senior utuh. Senior \u2018aman\u2019 selama loss < buffer Rp20M — tetapi 2008 membuktikan buffer bisa jebol.",
        "Expected loss = PD \u00d7 LGD. Obligasi: PD 2%, LGD 60% \u2192 EL = 120bp. Spread pasar 300bp = 120bp (kompensasi EL) + 180bp (premi risiko + likuiditas). Inti credit picking: berbeda pendapat tentang PD dengan pasar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Selalu tanya \u201cdi tranche mana saya?\u201d dan hitung break-even loss tiap tranche. Gagal bayar Rp25M pada pool di atas \u2192 equity habis, mezz habis, senior rugi Rp5M.",
      },
      quiz: [
        {
          q: "Pool Rp100M: senior 80, mezz 15, equity 5. Loss Rp12M. Yang rugi?",
          options: [
            { text: "Senior rugi 12", why: "Salah: waterfall — kerugian dimakan dari bawah dulu, senior paling terakhir." },
            { text: "Equity habis (5) + mezz rugi 7; senior utuh", why: "Benar: loss 12 = equity 5 habis + mezz 7 (sisa 8). Senior aman selama loss < buffer Rp20M.", correct: true },
            { text: "Dibagi rata", why: "Salah: tranching justru tidak membagi rata — ada urutan penyerapan." },
            { text: "Tidak ada yang rugi", why: "Salah: Rp12M gagal bayar harus diserap seseorang." },
          ],
        },
      ],
      reference: "Waterfall: kerugian dari bawah. EL = PD \u00d7 LGD. Rating = opini.",
    },
    {
      id: "convexity-spread",
      eyebrow: "Langkah 6 · Convexity & Spread + chart",
      title: "Lengkungan harga dan anatomi spread",
      prose: [
        "Duration adalah aproksimasi linear — untuk perubahan yield besar, harga obligasi melengkung, dan lengkungan itu menguntungkanmu. Convexity adalah koreksi orde-2: ΔP/P ≈ −D_mod·Δy + ½·C·(Δy)². Obligasi 20 tahun Pak Hendra: D_mod 14, convexity 250. Yield naik 2%: tebakan linear → −28%; dengan convexity → −28% + ½×250×(0,02)² = −28% + 5% = −23%. Convexity “menyelamatkan” 5 poin — dan simetris: saat yield turun 2%, convexity menambah gain di atas tebakan linear. Kapan layak membayar mahal untuk convexity? Saat kamu yakin volatilitas suku bunga akan tinggi tetapi tidak tahu arahnya. Struktur barbell (obligasi pendek + panjang) punya convexity lebih tinggi daripada bullet (tenor menengah) pada duration yang sama — harganya: yield barbell biasanya lebih rendah, karena kamu membayar premi asuransi.",
        "Spread bukan satu angka melainkan tiga lapis: spread = expected loss + premi risiko + premi likuiditas. Contoh: obligasi PD 2%, LGD 60% → expected loss = 120bp; spread pasar 300bp → 180bp sisanya adalah premi risiko & likuiditas. Dua obligasi dengan spread sama bisa berisikan risiko berbeda: obligasi A (PD 4%, LGD 60% → EL 240bp + premi 60bp) vs obligasi B (PD 1%, LGD 60% → EL 60bp + premi 240bp). A = risiko default tinggi, B = risiko likuiditas tinggi. Saat krisis likuiditas 2008, yang jatuh adalah obligasi tipe B — bukan A. Analis kredit yang hanya membaca angka spread tanpa membedah komposisinya sedang membaca suhu tanpa tahu penyebab demamnya.",
        "Tiga jebakan yield yang paling mahal. (1) Yield 15% pada obligasi peringkat CCC bukan “diskon” — itu pasar memprediksi default; bandingkan spread-nya dengan expected loss historis peringkat tersebut sebelum tergiur. (2) Current yield 12% pada obligasi premium 130 mengabaikan capital loss Rp30 yang pasti terjadi saat jatuh tempo — bandingkan YTM, bukan kupon dibagi harga. (3) YTM obligasi callable adalah skenario terbaik EMITEN, bukan kamu: emiten akan memanggil obligasimu tepat saat kamu paling ingin mempertahankannya (saat suku bunga turun). Untuk callable, pakai yield-to-worst. Aturan penutup: tidak ada yield tinggi tanpa alasan — tugasmu menemukan alasannya sebelum membeli, bukan sesudah menyesal.",
        "Cara membaca: sumbu X = yield (%), sumbu Y = harga obligasi; dua kurva = obligasi durasi panjang (D_mod 14, dari teks) dan pendek; garis putus-putus miring = garis singgung di yield kini (aproksimasi duration).",
        "Interpretasi: kurva durasi panjang lebih melengkung dan selalu berada di ATAS garis singgungnya — selisihnya adalah efek convexity: saat yield naik 2%, harga jatuh 23%, bukan 28% seperti tebakan linear di teks. Kelengkungan selalu menguntungkan pemegang obligasi, dua arah.",
      ],
      figure: {
        svg: KONVEKS_SVG,
        alt: "Kurva price-yield konveks untuk obligasi durasi panjang dan pendek, plus garis singgung di yield kini.",
        caption: "D_mod 14 = obligasi 20 tahun Pak Hendra di teks. Kurva pendek hampir lurus (convexity kecil); kurva panjang melengkung jelas — makin panjang duration, makin besar asuransi convexity-nya.",
      },
      tasks: [],
      formula: String.raw`\frac{\Delta P}{P} \approx -D_{mod} \times \Delta y + \frac{1}{2} C (\Delta y)^2`,
      formulaNote: "ΔP/P = persentase perubahan harga; D_mod = modified duration (14); Δy = perubahan yield desimal (2% = 0,02); C = convexity (250 — kelengkungan hubungan harga-yield). Interpretasi: suku pertama adalah tebakan linear (duration), suku kedua adalah koreksi lengkung yang selalu positif — convexity adalah “asuransi gratis” arah dua sisi: mengurangi rugi saat yield naik, menambah untung saat yield turun. Contoh angka: −14 × 0,02 + 0,5 × 250 × 0,0004 = −28% + 5% = −23% vs −28% versi linear.",
      note: {
        title: "Intuisi: obligasi itu janji — baca siapa yang berjanji dan berapa lama",
        body: "Tiga intuisi praktisi obligasi. Satu: duration adalah “tahun-tahun nyeri” — obligasi duration 14 berarti setiap 1% kenaikan yield menghapus ~14% harga; sebelum membeli, tanya kapan uangnya dibutuhkan — duration di atas horizon adalah spekulasi suku bunga berkedok investasi, seperti Pak Hendra. Dua: yield tinggi bukan diskon, melainkan tagihan risiko — spread 500bp di atas obligasi pemerintah artinya pasar menagih kompensasi untuk sesuatu yang ia ketahui dan kamu belum; tugasmu menemukan apa itu sebelum membeli, bukan sesudah. Bandingkan spread dengan expected loss (PD × LGD): jika spread jauh di atas EL, pasar sedang takut (peluang); jika spread di bawah EL, pasar sedang mabuk (bahaya). Tiga: untuk obligasi callable, YTM adalah dongeng — pakai yield-to-worst, karena emiten akan memanggil obligasimu tepat saat kamu paling ingin mempertahankannya. Obligasi “aman” yang gagal bayar hampir selalu berarti investornya gagal paham kontrak. Keempat: risiko reinvestasi adalah bayangan duration — obligasi pendek yang “aman” memaksamu menginvestasikan kupon di rate yang belum diketahui; saat rate turun, reinvestment risk menggigit. Tidak ada obligasi yang bebas risiko suku bunga — hanya pilihan di mana kamu menaruhnya: di harga atau di reinvestasi.",
      },
      quiz: [
        {
          q: "Obligasi: D_mod 14, convexity 250. Yield naik 2%. Estimasi perubahan harga dengan convexity?",
          options: [
            { text: "−28% (linear saja)", why: "Salah: itu tebakan duration linear — mengabaikan koreksi lengkung convexity." },
            { text: "≈ −23% (−28% + 5% koreksi convexity)", why: "Benar: −14×0,02 + ½×250×0,0004 = −28% + 5% = −23%. Convexity mengurangi rugi.", correct: true },
            { text: "−33%", why: "Salah: convexity mengurangi rugi, bukan menambah — suku koreksinya selalu positif." },
            { text: "+5%", why: "Salah: itu besar koreksinya saja, bukan total perubahan harga." },
          ],
        },
        {
          q: "Obligasi A: spread 300bp, EL 240bp. Obligasi B: spread 300bp, EL 60bp. Saat krisis likuiditas, mana yang lebih jatuh?",
          options: [
            { text: "A — EL-nya lebih tinggi", why: "Salah: EL A memang tinggi, tetapi spread-nya sudah mencerminkan itu (premi cuma 60bp)." },
            { text: "B — 240bp spread-nya adalah premi likuiditas yang menguap saat krisis", why: "Benar: premi likuiditas B (240bp) adalah kompensasi risiko yang justru meledak saat likuiditas kering.", correct: true },
            { text: "Sama — spread-nya sama", why: "Salah: spread sama, komposisi beda — itulah gunanya dekomposisi spread." },
            { text: "Tidak bisa dinilai", why: "Salah: dekomposisi spread justru memberi alat menilainya." },
          ],
        },
      ],
      reference: "Convexity = koreksi lengkung (asuransi dua arah). Spread = EL + premi risiko + premi likuiditas. Callable → yield-to-worst.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: risiko obligasi apa yang kamu pegang",
      prose: [
        "Skenario 1 — Membeli obligasi karena 'aman'. → Tanya aman dari apa: gagal bayar ≠ harga. Duration 14 tahun = setiap 1% kenaikan yield menghapus ~14% harga. 'Aman' punya banyak arti.",
        "Skenario 2 — Membandingkan dua obligasi. → Bandingkan YTM — bukan kupon, bukan current yield. Kupon 12% di harga 130 bisa sama return-nya dengan kupon 6% di harga 100.",
        "Skenario 3 — Mengukur nyeri suku bunga. → Modified duration: ΔP/P ≈ −D_mod × Δy untuk perubahan kecil; tambah convexity (½·C·(Δy)²) untuk perubahan besar.",
        "Skenario 4 — Spread melebar. → Bedah tiga lapis: expected loss + premi risiko + premi likuiditas. Melebar karena likuiditas kering = peluang beli; karena expected loss naik = jauhi. Angka sama, arti berlawanan.",
        "Skenario 5 — Menganalisis tranche sekuritisasi. → Pahami waterfall: kerugian dimakan dari bawah (equity dulu). Senior 'aman' hanya selama loss < buffer — 2008 membuktikan buffer bisa tersapu.",
        "Aturan praktis 10 detik: aman? → aman dari apa; bandingkan → YTM; nyeri rate → duration; spread → bedah lapisnya; tranche → cek buffer.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira current yield = return obligasi. Ia mengabaikan capital gain/loss — obligasi premium 'memakan' kupon besarnya, dan investor yang tidak paham membeli ilusi.",
      },
    },
    {
      id: "minicase-hendra",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Pak Hendra dan dua arti \u201caman\u201d",
      prose: [
        "Pak Hendra membeli obligasi pemerintah 20 tahun kupon 6% karena \u201caman\u201d. BI menaikkan suku bunga 2% \u2192 harga anjlok 20% (dari 100 ke ~80,36). Ia panik — padahal tidak ada gagal bayar.",
        "Dua pelajaran: (1) obligasi aman dari gagal bayar \u2260 aman dari risiko harga — duration 14 tahun berarti setiap 1% kenaikan yield menghapus ~14% harga; (2) investor pensiun dengan kewajiban 20 tahun lagi justru butuh duration panjang (immunization): kenaikan yield menurunkan harga obligasi TETAPI juga menurunkan PV kewajiban — match = kebal.",
        "Aturan: duration \u2264 horizon untuk dana yang akan dipakai; match duration untuk kewajiban jangka panjang.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dana pendek (butuh 2 tahun) di obligasi duration 14 = mismatch yang mematikan. Tanya selalu: kapan uang ini dibutuhkan, dan berapa duration instrumennya?",
      },
      reference: "Duration \u2264 horizon. Match duration = immunization untuk kewajiban panjang.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: pricing, duration, yield, kredit, dan immunization.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Obligasi 20 tahun kupon 6%, YTM naik 6% \u2192 8%. Harga?",
          options: [
            { text: "Tetap 100", why: "Salah: kupon tetap, tetapi discount rate berubah \u2192 harga berubah." },
            { text: "\u2248 Rp80,4jt (\u221220%)", why: "Benar: 6\u00d79,818 + 21,45 = 80,36. Duration panjang = sensitivitas brutal.", correct: true },
            { text: "Rp120jt", why: "Salah: harga naik hanya jika yield turun." },
            { text: "Rp90jt", why: "Salah: hitung ulang — 6\u00d79,818 + 21,45 = 80,36." },
          ],
        },
        {
          q: "D_mod = 7,5. Yield naik 1%. Estimasi perubahan harga?",
          options: [
            { text: "+7,5%", why: "Salah: tanda terbalik — yield naik \u2192 harga turun." },
            { text: "\u22127,5%", why: "Benar: \u0394P/P \u2248 \u2212D_mod \u00d7 \u0394y = \u22127,5%. Tanda negatif selalu.", correct: true },
            { text: "\u22121%", why: "Salah: itu besar perubahan yield, bukan harga." },
            { text: "Tidak berubah", why: "Salah: duration 7,5 berarti sensitif." },
          ],
        },
        {
          q: "Kupon 12% harga 130 vs kupon 6% harga 100, tenor & risiko sama. Mana return lebih tinggi?",
          options: [
            { text: "Kupon 12%", why: "Salah: harga premium 130 \u201cmemakan\u201d kupon besarnya." },
            { text: "Sama (YTM yang menentukan, bukan kupon)", why: "Benar: bandingkan YTM — kupon tanpa harga = ilusi.", correct: true },
            { text: "Kupon 6%", why: "Salah: kupon kecil bukan berarti return kecil — harganya 100 (par)." },
            { text: "Tidak bisa tahu", why: "Salah: dengan tenor dan risiko sama, YTM bisa dibandingkan." },
          ],
        },
        {
          q: "Investor pensiun butuh pembayaran 20 tahun lagi. Strategi duration?",
          options: [
            { text: "Duration sependek mungkin", why: "Salah: duration pendek membuat reinvestment risk dan mismatch dengan kewajiban panjang." },
            { text: "Match: duration panjang \u2248 horizon (immunization)", why: "Benar: kenaikan yield menurunkan harga obligasi TETAPI juga menurunkan PV kewajiban. Match = kebal.", correct: true },
            { text: "Tidak peduli duration", why: "Salah: duration adalah risiko harga utama obligasi." },
            { text: "Hanya deposito", why: "Salah: deposito = duration pendek = mismatch untuk kewajiban 20 tahun." },
          ],
        },
        {
          q: "Obligasi 3 tahun kupon 5%, harga 97,33, modified duration 2,70. Yield naik 1%. Estimasi harga baru?",
          options: [
            { text: "97,33 (tidak berubah)", why: "Salah: duration 2,70 \u2260 0." },
            { text: "94,70", why: "Benar: \u0394P \u2248 \u22122,70 \u00d7 1% \u00d7 97,33 = \u22122,63 \u2192 94,70. Aproksimasi linear — untuk \u0394 besar tambah convexity.", correct: true },
            { text: "99,96", why: "Salah: arah salah — yield naik \u2192 harga turun." },
            { text: "90,00", why: "Salah: hitung ulang — penurunannya ~2,63, bukan ~7,33." },
          ],
        },
      ],
      summary: [
        "Harga = PV kupon + principal; par/premium/discount vs YTM.",
        "YTM = return sebenarnya; current yield menipu; spread = harga risiko kredit.",
        "Duration: \u0394P/P \u2248 \u2212D_mod \u00d7 \u0394y; konveksitas = koreksi lengkung.",
        "Sekuritisasi: waterfall — kerugian dari bawah (equity) ke atas.",
        "Aturan: duration \u2264 horizon; tanya tranche; bandingkan YTM.",
      ],
      next: { label: "PM-A7B — Fixed Income: Durasi, Konveksitas & Kurva Yield", href: "/v2/learn/pm-a7b-durasi-konveksitas" },
    },
  ],
};
