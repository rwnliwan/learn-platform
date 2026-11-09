import type { V2Lesson } from "../lib/types";

// Bar perbandingan Sharpe / Sortino / Calmar dua strategi contoh lesson:
// "seimbang" (Sharpe 0,6; Sortino 0,9; Calmar 0,6) vs short-vol
// (Sharpe 2,0; Sortino 2,5; Calmar 3,0; skew -3).
const METRIK_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Perbandingan Sharpe, Sortino, Calmar: strategi short-vol menang di semua metrik tetapi skew minus 3.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="53">3</text><text x="54" y="110">2</text><text x="54" y="167">1</text><text x="54" y="224">0</text></g>
<rect x="95" y="186" width="50" height="34" fill="var(--c1)"/><rect x="155" y="106" width="50" height="114" fill="var(--c3)"/>
<rect x="225" y="169" width="50" height="51" fill="var(--c1)"/><rect x="285" y="77" width="50" height="143" fill="var(--c3)"/>
<rect x="355" y="186" width="50" height="34" fill="var(--c1)"/><rect x="415" y="49" width="50" height="171" fill="var(--c3)"/>
<g fill="var(--text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle" font-weight="600"><text x="120" y="178">0,6</text><text x="180" y="98">2,0</text><text x="250" y="161">0,9</text><text x="310" y="69">2,5</text><text x="380" y="178">0,6</text><text x="440" y="41">3,0</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="150" y="240">Sharpe</text><text x="280" y="240">Sortino</text><text x="410" y="240">Calmar</text></g>
<line x1="300" y1="30" x2="325" y2="30" stroke="var(--c1)" stroke-width="8"/><text x="330" y="34" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">strategi seimbang</text>
<line x1="300" y1="46" x2="325" y2="46" stroke="var(--c3)" stroke-width="8"/><text x="330" y="50" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">short-vol (skew -3!)</text>
<text x="440" y="28" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">menang semua - tapi bom!</text>
</svg>`;

export const pmd5: V2Lesson = {
  slug: "pm-d5-metrik-kinerja",
  track: "Portfolio Management",
  module: "Kuantitatif Terapan",
  title: "D5 — Metrik Kinerja",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-sharpe-bangkrut",
      eyebrow: "Langkah 1 · Cerita",
      title: "Sharpe 2,0 yang bangkrut",
      prose: [
        "Hedge fund: Sharpe 2,0 (5 tahun)! Investor masuk Rp50M. Sebulan kemudian: −40% \u2014 fund tutup. Kok bisa? Strategi jual put (short vol): untung kecil setiap bulan (Sharpe tinggi!) sampai ekor datang \u2014 sekali, mematikan.",
        "Twist-nya: Sharpe buta ekor \u2014 distribusi skew negatif terlihat \u2018hebat\u2019 sampai bencana. Satu metrik = satu kebohongan.",
        "Lesson ini tentang panel instrumen lengkap: Sharpe hingga CVaR.",
      ],
      tasks: [],
      reference: "Jangan kumpulkan receh di rel kereta.",
    },
    {
      id: "risk-adjusted",
      eyebrow: "Langkah 2 · Risk-adjusted + chart",
      title: "Sharpe, Sortino, Calmar",
      prose: [
        "Sharpe = (R − R_f)/σ \u2014 return per total risiko. Sortino: penyebut = downside deviation (hanya risiko buruk!). Calmar = return / max drawdown. Aturan kasar: Sharpe > 1 baik; > 2 luar biasa (curigai skew!). Kelemahannya: Sharpe buta skew (short-vol terlihat hebat!); Sortino butuh target; Calmar sensitif satu kejadian. Paket wajib: Sharpe + Sortino + Calmar + skew \u2014 jangan satu.",
        "Contoh hitung: Rp = 12%, Rf = 3%, σp = 15% → Sharpe = (12%−3%)/15% = 0,6 (lumayan, 0,5\u20131,0). Downside dev 10% → Sortino = 9%/10% = 0,9 \u2014 lebih tinggi dan lebih relevan (hanya downside!). Tetapi: cek skew!",
        "Bedah short-vol: Sharpe 2,0, Sortino 2,5, skew −3, MaxDD historis 5%. Lampu oli: skew −3 = ekor kiri! Calmar = 15%/5% = 3 (terlihat bagus \u2014 karena ekor belum datang!). Verdict: tolak \u2014 Sharpe tinggi + skew sangat negatif = bom waktu. Benar saja: −40% sebulan kemudian. Strategi +1%/bulan (59 bulan), −40% (1 bulan) → Sharpe ≈ 2,0, skew −3. Jangan tertipu!",
        "Cara membaca: tiga grup = tiga metrik (Sharpe, Sortino, Calmar); tiap grup berisi dua bar — strategi “seimbang” dari contoh hitung (biru) vs strategi short-vol dari bedah kasus (merah). Makin tinggi bar = makin “bagus” menurut metrik itu.",
        "Interpretasi: short-vol menang telak di SEMUA bar — Sharpe 2,0 vs 0,6; Sortino 2,5 vs 0,9; Calmar 3,0 vs 0,6. Jika keputusan hanya dari chart ini, jawabannya jelas: pilih short-vol. Dan itulah jebakannya: skew −3 tidak tampil di chart ini — ekor kiri yang menutup fund sebulan kemudian. Bahkan tiga metrik pun berbohong jika semuanya buta bentuk distribusi. Paket wajib = metrik + skew + CVaR + stress test.",
      ],
      figure: {
        svg: METRIK_SVG,
        alt: "Perbandingan Sharpe, Sortino, Calmar: strategi short-vol menang di semua metrik tetapi skew minus 3.",
        caption: "Short-vol menang di semua bar — dan tetap bom waktu. Metrik tanpa skew = kebohongan yang rapi.",
      },
      formula: String.raw`Sharpe = \frac{R - R_f}{\sigma} \quad;\quad Sortino = \frac{R - T}{\sigma_{down}} \quad;\quad Calmar = \frac{R}{MaxDD}`,
      formulaNote: "σ_down = deviasi return di bawah target T saja. Calmar > 1,0 = baik.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Sharpe tinggi = aman.\u2019 Salah. Cek skew! Cek CVaR! Short-vol: Sharpe 2,0 + skew −3 = bom waktu. Satu metrik = satu kebohongan. Dokter tidak hanya cek tekanan darah \u2014 investor tidak hanya cek Sharpe.",
      },
      reference: "Dashboard: Sharpe = kecepatan; skew = lampu oli. Ngebut dengan lampu oli menyala = mogok.",
    },
    {
      id: "lab-metrik",
      eyebrow: "Langkah 3 · Lab metrik",
      title: "Kalkulator metrik lengkap",
      prose: [
        "Hitung Sharpe, Sortino, MaxDD, dan Calmar dari 60 bulan return dengan satu crash −40% di akhir. Ubah SKEW_CRASH menjadi False (tanpa crash): Sharpe mirip, MaxDD beda jauh \u2014 metrik butuh paket!",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sharpe`, `sortino`" },
        { id: "t2", text: "Hitung `mdd` dan `calmar`" },
        { id: "t3", text: "Cetak hasil dengan `print`" },
      ],
      expected: "Sharpe : 0.57   Sortino: 0.37  MaxDD  : -40%   Calmar : 0.29",
      hints: [
        "sharpe = mean/sd×√12; sortino = mean/dsd×√12 (dsd dari return < 0).",
        "Loop NAV: nav ×= 1+r; pek = max; mdd = min(nav/pek − 1).",
        "calmar = (mean×12)/|mdd|; format :.2f, :.0%, :.2f.",
      ],
      code: {
        starter: `# Kalkulator metrik: Sharpe, Sortino, MaxDD, Calmar\nimport math, random\nrandom.seed(21)\nSKEW_CRASH = True   # ubah ke False!\nrets = [random.gauss(0.012, 0.03) for _ in range(59)]\nrets.append(-0.40 if SKEW_CRASH else 0.01)\n\n# TULIS KODEMU\nn = len(rets)\nmean = sum(rets)/n\nsd = \ndown = [r for r in rets if r < 0]\ndsd = \nsharpe = \nsortino = \n# max drawdown\npek, mdd, nav = 1.0, 0.0, 1.0\nfor r in rets:\n    nav *= 1+r\n    pek = \n    mdd = \ncalmar = \n\nprint(f"Sharpe : {sharpe:.2f}   Sortino: {sortino:.2f}")\nprint(f"MaxDD  : {mdd:.0%}   Calmar : {calmar:.2f}")\nprint()\nprint("Crash:", SKEW_CRASH)\nprint("Sharpe mirip, MaxDD beda jauh -> SATU metrik menipu!")`,
        lockLines: 6,
        solution: `# Kalkulator metrik: Sharpe, Sortino, MaxDD, Calmar\nimport math, random\nrandom.seed(21)\nSKEW_CRASH = True   # ubah ke False!\nrets = [random.gauss(0.012, 0.03) for _ in range(59)]\nrets.append(-0.40 if SKEW_CRASH else 0.01)\n\n# TULIS KODEMU\nn = len(rets)\nmean = sum(rets)/n\nsd = math.sqrt(sum((r-mean)**2 for r in rets)/(n-1))\ndown = [r for r in rets if r < 0]\ndsd = math.sqrt(sum(r**2 for r in down)/len(down))\nsharpe = mean/sd*math.sqrt(12)\nsortino = mean/dsd*math.sqrt(12)\n# max drawdown\npek, mdd, nav = 1.0, 0.0, 1.0\nfor r in rets:\n    nav *= 1+r\n    pek = max(pek, nav)\n    mdd = min(mdd, nav/pek-1)\ncalmar = (mean*12)/abs(mdd)\n\nprint(f"Sharpe : {sharpe:.2f}   Sortino: {sortino:.2f}")\nprint(f"MaxDD  : {mdd:.0%}   Calmar : {calmar:.2f}")\nprint()\nprint("Crash:", SKEW_CRASH)\nprint("Sharpe mirip, MaxDD beda jauh -> SATU metrik menipu!")`,
        checks: [
          { kind: "equal", task: "t1", name: "sharpe", value: 0.57, tol: 0.01, label: "`sharpe` ≈ 0.57", msg: "Dengan crash −40%: Sharpe tahunan 0,57 (seed 21)." },
          { kind: "equal", task: "t2", name: "mdd", value: -0.40, tol: 0.01, label: "`mdd` ≈ −0.40", msg: "Max drawdown −40% \u2014 luka terdalam dari crash." },
          { kind: "equal", task: "t2", name: "calmar", value: 0.29, tol: 0.01, label: "`calmar` ≈ 0.29", msg: "Return tahunan / 40% = 0,29 \u2014 jauh di bawah 1,0." },
          { kind: "stdout_matches", task: "t3", pattern: "MaxDD  : -40%   Calmar : 0\\.29", label: "`print` menampilkan MaxDD -40% dan Calmar 0.29", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Tanpa crash: Sharpe 2,15, MaxDD −8% \u2014 satu crash mengubah segalanya.",
    },
    {
      id: "lab-var-cvar",
      eyebrow: "Langkah 4 · Lab VaR & CVaR",
      title: "Bahasa risiko",
      prose: [
        "Hitung VaR 95% dan CVaR historis dari 1.000 return harian. Ubah NILAI dari 10.000 menjadi 50.000 (Rp jt): VaR/CVaR skala linear \u2014 risiko proporsional! Ingat: VaR bukan rugi maksimal.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `var` dan `cvar`" },
        { id: "t2", text: "Cetak hasil dengan `print`" },
      ],
      expected: "VaR 95% : 2.48% = Rp248jt  CVaR 95%: 3.02% = Rp302jt",
      hints: [
        "Urutkan return; idx = int(0,05×1000); var = −rets[idx].",
        "ekor = rets[:idx]; cvar = −rata-rata(ekor).",
        "CVaR ≥ VaR selalu \u2014 ekor lebih dalam dari batas.",
      ],
      code: {
        starter: `# VaR & CVaR historis\nimport random\nrandom.seed(33)\nNILAI = 10000   # Rp jt (ubah jadi 50000!)\nrets = sorted([random.gauss(0.0005, 0.015) for _ in range(1000)])\n\n# TULIS KODEMU\nidx = \nvar = \nekor = \ncvar = \n\nprint(f"VaR 95% : {var:.2%} = Rp{var*NILAI:.0f}jt")\nprint(f"CVaR 95%: {cvar:.2%} = Rp{cvar*NILAI:.0f}jt")\nprint()\nprint("VaR: 95% hari rugi <= ini. BUKAN rugi maksimal!")\nprint("CVaR: rata-rata rugi di 5% hari terburuk.")\nprint("Keduanya buta di luar histori -> tambah STRESS TEST.")`,
        lockLines: 3,
        solution: `# VaR & CVaR historis\nimport random\nrandom.seed(33)\nNILAI = 10000   # Rp jt (ubah jadi 50000!)\nrets = sorted([random.gauss(0.0005, 0.015) for _ in range(1000)])\n\n# TULIS KODEMU\nidx = int(0.05*1000)\nvar = -rets[idx]\nekor = rets[:idx]\ncvar = -sum(ekor)/len(ekor)\n\nprint(f"VaR 95% : {var:.2%} = Rp{var*NILAI:.0f}jt")\nprint(f"CVaR 95%: {cvar:.2%} = Rp{cvar*NILAI:.0f}jt")\nprint()\nprint("VaR: 95% hari rugi <= ini. BUKAN rugi maksimal!")\nprint("CVaR: rata-rata rugi di 5% hari terburuk.")\nprint("Keduanya buta di luar histori -> tambah STRESS TEST.")`,
        checks: [
          { kind: "equal", task: "t1", name: "var", value: 0.0248, tol: 0.001, label: "`var` ≈ 0.0248", msg: "Persentil 5% dari 1.000 return harian (seed 33)." },
          { kind: "equal", task: "t1", name: "cvar", value: 0.0302, tol: 0.001, label: "`cvar` ≈ 0.0302", msg: "Rata-rata 50 return terburuk \u2014 lebih dalam dari VaR." },
          { kind: "stdout_matches", task: "t2", pattern: "VaR 95% : 2\\.48% = Rp248jt", label: "`print` menampilkan VaR 2.48% = Rp248jt", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t2", pattern: "CVaR 95%: 3\\.02% = Rp302jt", label: "`print` menampilkan CVaR 3.02% = Rp302jt", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "VaR untuk limit harian; CVaR untuk modal & ekor.",
    },
    {
      id: "drawdown",
      eyebrow: "Langkah 5 · Drawdown",
      title: "Luka & sembuh",
      prose: [
        "Drawdown: penurunan dari puncak terakhir. MaxDD: yang terdalam. Underwater chart: visual luka \u2014 dua dimensi penderitaan: dalamnya (MaxDD) & lamanya (recovery). Psikologi: MaxDD = ujian terberat investor  \u2014 lebih penting dari Sharpe untuk retensi. Investor kabur di MaxDD → tidak menikmati recovery.",
        "Matematika brutal: Rp100jt → −50% = Rp50jt. Pulih ke 100? Butuh +100%! −20% → butuh +25%. −80% (gorengan!) → butuh +400% (mustahil!). Return +100% lalu −50% = 0%, bukan +50%! Implikasi: hindari kerugian besar > kejar untung besar \u2014 inilah matematika di balik stop-loss & diversifikasi. Lindungi downside dulu!",
        "Contoh gaya CFA: nilai 100 → 150 → 90 → 120. Puncak 150, lembah 90 → MaxDD = (90−150)/150 = −40%! Recovery: 90 → 120 (belum pulih!). Calmar: return 12%, MaxDD 20% → 12%/20% = 0,6 (baik jika > 1,0).",
      ],
      formula: String.raw`DD_t = \frac{P_t - \max_{s \leq t} P_s}{\max_{s \leq t} P_s}`,
      formulaNote: "Recovery dari −50% butuh +100% (asimetri brutal!). Dari −20% butuh +25%.",
      tasks: [],
      reference: "Investor rasakan drawdown, bukan volatilitas \u2014 kelola DD, komunikasikan ekspektasi di muka .",
    },
    {
      id: "var-cvar",
      eyebrow: "Langkah 6 · VaR & CVaR",
      title: "Batas vs ekor",
      prose: [
        "VaR 95%: kerugian maksimal di 95% hari \u2018normal\u2019 \u2014 tidak bilang seberapa parah 5% terburuk! CVaR/Expected Shortfall: rata-rata kerugian di 5% terburuk \u2014 jujur tentang ekor. Analoginya: VaR = \u2018banjir maksimal 95% tahun\u2019 (tidak bilang sedalam apa saat banjir besar!); CVaR = \u2018rata-rata kedalaman saat banjir besar\u2019. Warga butuh keduanya: tanggul (VaR) + evakuasi (CVaR).",
        "Contoh angka jujur: portofolio Rp10M, VaR 95% = 2% (Rp200jt). Artinya: 95% hari rugi ≤ Rp200jt. Tidak artinya: \u2018rugi maksimal Rp200jt\u2019! (Salah kaprah #1!) CVaR 95% = 3,5% (Rp350jt) \u2014 rata-rata saat 5% terburuk. Laporan benar: \u2018VaR Rp200jt; CVaR Rp350jt; stress 2008: −Rp2M.\u2019 Tiga angka, tiga cerita.",
        "Contoh parametrik: portofolio Rp10M, return harian μ 0,05%, σ 1% → VaR 95% 1-hari = 10M × (1,645×1% − 0,05%) = Rp164jt. Artinya: 95% rugi < Rp164jt; 5% = lebih! Aturannya: VaR untuk limit harian; CVaR untuk modal & ekor. Keduanya buta di luar data historis → stress test (skenario “bagaimana jika” + rugi Rupiah + rencana aksi).",
      ],
      formula: String.raw`VaR_{95\%} = -Q_{5\%}(R) \quad;\quad CVaR_{95\%} = -E[R \mid R < -VaR]`,
      formulaNote: "Q_5% = persentil 5% return. CVaR ≥ VaR selalu (ekor lebih dalam).",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018VaR = maksimum rugi.\u2019 Salah. VaR = batas (di 95% hari normal); 5% terburuk bisa jauh lebih dalam \u2014 itulah yang diukur CVaR. Selalu lapor keduanya!",
      },
      reference: "Metode VaR: parametrik (normal), historis (data), Monte Carlo (simulasi) \u2014 pahami batas tiap metode.",
    },
    {
      id: "minicase-sharpe20",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Sharpe 2,0",
      prose: [
        "Hedge fund: Sharpe 2,0 (5 tahun). Investor masuk Rp50M. Sebulan kemudian: −40% \u2014 fund tutup. Strategi: jual put (short vol).",
        "(a) Bedah panel: Sharpe 2,0 + Sortino 2,5 + skew −3 + MaxDD historis 5% + Calmar 3 (terlihat bagus \u2014 karena ekor belum datang!). Lampu oli: skew −3 = ekor kiri. (b) Verdict: tolak \u2014 Sharpe tinggi + skew sangat negatif = bom waktu. (c) Pelajaran umum: satu metrik = satu kebohongan; paket minimal Sharpe + skew + MaxDD + CVaR + stress.",
        "(d) LTCM: Sharpe tinggi! VaR rendah! Hasil: bangkrut! Kenapa? Model normal, realita fat-tail, korelasi → 1. Pelajaran: stress test; jangan percaya model. (e) Laporan benar: \u2018VaR Rp200jt; CVaR Rp350jt; stress 2008: −Rp2M.\u2019 Bandingkan apel vs apel: periode sama, benchmark sama, net fee, risk-adjusted.",
      ],
      tasks: [],
      reference: "Evaluasi butuh waktu: 1 tahun = noise, 3 tahun = awal, 5 tahun = minimum. Jangan pecat/hire cepat.",
    },
    {
      id: "kappa-pemilihan",
      eyebrow: "Langkah 8 · Kappa & pemilihan",
      title: "Kappa dan aturan memilih metrik",
      prose: [
        "Sortino menghukum downside volatility — tetapi buta terhadap BENTUK ekor. Strategi short-vol bisa punya Sortino 2,5 (downside dev kecil... sampai ekor datang) sementara skew −3. Kappa_n menutup lubang ini: κ_n = (R − T) / LPM_n^(1/n), dengan LPM_n = lower partial moment orde-n = rata-rata dari (shortfall)^n. n=2 → Sortino; n=3 → menghukum skew negatif JUGA. Strategi short-vol tadi: Sortino 2,5 tetapi Kappa_3 = 0,8 — ekornya ketahuan. Kappa_3 adalah “Sortino yang sudah dewasa”.",
        "Omega ratio — sepupu yang intuitif untuk klien: Ω = (rata-rata gain di atas target, tertimbang peluang) / (rata-rata loss di bawah target). Ω > 1 = “untung harapan” mengalahkan “rugi harapan”. Tidak butuh asumsi distribusi — murni dari data. Kelemahannya: sensitif pada pilihan target T; selalu laporkan T-nya.",
        "Aturan pemilihan metrik — tempel di dinding: (1) Return simetris, normal-ish → Sharpe cukup, jangan over-engineering. (2) Ada payoff berekor (opsi, short-vol, carry) → Sortino + skew + CVaR; Sharpe DILARANG sendirian. (3) Dana dengan target/liabilitas (pensiun, dana abadi) → Sortino vs TARGET + probabilitas shortfall + MaxDD; yang ditakuti adalah gagal capai tujuan, bukan volatilitas. (4) Membandingkan manajer → alpha t-stat + information ratio, net of fees, periode & benchmark SAMA. (5) Laporan ke investor awam → MaxDD (“rugi terdalam RpX dari puncak”), CVaR (“rata-rata saat 5% terburuk”), skenario Rp — Yunani dilarang tanpa terjemahan.",
        "Mode kegagalan: metric shopping — coba 10 metrik, laporkan yang paling menyanjung. Ini p-hacking versi laporan kinerja. Obatnya: tetapkan metrik PRIMER sebelum melihat hasil (pre-commit, tulis di mandat); sisanya hanya diagnostik. Manajer yang memilih metriknya sendiri setelah melihat hasil = tersangka, bukan kandidat.",
      ],
      formula: String.raw`\kappa_n = \frac{R - T}{\left( E[\max(T-R, 0)^n] \right)^{1/n}}`,
      formulaNote: "T = target/threshold return; E[max(T−R,0)^n] = lower partial moment orde-n (rata-rata dari shortfall^n). n=2 → Sortino; n=3 → menghukum downside DAN skew negatif. Contoh: short-vol Sortino 2,5 tetapi Kappa_3 0,8 — “hebat” yang palsu ketahuan oleh orde-3.",
      tasks: [],
      note: {
        title: "💡 Intuisi: pilih metrik seperti pilih alat — bukan palu untuk semua",
        body: "Lima heuristik. Pertama: cocokkan metrik dengan KETAKUTANMU — takut “rugi besar tiba-tiba” → CVaR + MaxDD; takut “gagal capai target pensiun” → probabilitas shortfall + Sortino vs target; takut “manajer bohong” → skew + alpha t-stat. Metrik yang tidak menjawab ketakutanmu = dekorasi. Kedua: jangan pernah laporkan rasio tanpa bahan-bahannya — “Sharpe 1,5” tanpa periode, benchmark, dan status net/gross = angka tanpa makna; selalu sebut ketiganya. Ketiga: aturan dua angka — setiap angka return ditempeli angka risiko di sebelahnya; return tanpa risiko = iklan. Keempat: waspadai metrik yang menyanjung strategi yang memilihnya — jika manajer yang memilih metriknya, tanya kenapa YANG ITU; metric shopping adalah p-hacking berkedok laporan. Kelima: saat ragu orde berapa yang penting, Kappa_3 adalah kompromi jujur — menghukum downside volatility dan skew negatif sekaligus. Satu metrik = satu kebohongan; satu SET metrik yang dipilih sebelum melihat hasil = kejujuran.",
      },
      reference: "Pre-commit metrik primer di mandat. Yang dipilih setelah hasil keluar = yang dimanipulasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Tujuh pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "Sharpe/Sortino/Calmar: return per risiko; Sharpe buta skew \u2014 selalu cek skew & ekor.",
        "Drawdown: luka nyata investor; −50% butuh +100% untuk pulih; kelola & komunikasikan.",
        "VaR = batas (bukan maksimum!); CVaR = rata-rata ekor; selalu lapor keduanya.",
        "Satu metrik = satu kebohongan: paket minimal Sharpe + skew + MaxDD + CVaR + stress.",
        "Bandingkan apel vs apel: periode & benchmark sama, net fee, risk-adjusted.",
      ],
      next: { label: "D6 \u2014 Risk Reporting", href: "/v2/learn/pm-d6-risk-reporting" },
      quiz: [
        {
          q: "Rp = 12%, Rf = 3%, σp = 15%. Sharpe?",
          options: [
            { text: "0,8", why: "Salah: (12−3)/15 = 0,6 \u2014 cek pembagiannya." },
            { text: "0,6", why: "Tepat: (12%−3%)/15% = 0,6 \u2014 lumayan (0,5\u20131,0). Tapi: cek skew!", correct: true },
            { text: "1,2", why: "Salah: itu jika σ = 7,5% \u2014 bukan 15%." },
            { text: "0,3", why: "Salah: 0,3 = jika excess return hanya 4,5% \u2014 padahal 9%." },
          ],
        },
        {
          q: "Fund: Sharpe 2,0, skew −3. Investasi?",
          options: [
            { text: "Ya \u2014 Sharpe luar biasa", why: "Salah: Sharpe 2,0 + skew −3 = short-vol = bom waktu. Jangan tertipu satu metrik!" },
            { text: "Tidak \u2014 bom waktu short-vol", why: "Tepat: skew −3 = ekor kiri fatal. Cek CVaR + stress test sebelum putuskan.", correct: true },
            { text: "Ya \u2014 tambah alokasi", why: "Salah: menambah alokasi ke strategi berekor kiri = memperbesar bencana." },
            { text: "Tunggu Sharpe 3,0", why: "Salah: Sharpe lebih tinggi justru makin mencurigakan untuk strategi skew negatif." },
          ],
        },
        {
          q: "Nilai: 100 → 150 → 90 → 120. MaxDD?",
          options: [
            { text: "−10%", why: "Salah: itu dari 100 ke 90 \u2014 drawdown dihitung dari puncak, bukan dari awal." },
            { text: "−40%", why: "Tepat: puncak 150, lembah 90 → (90−150)/150 = −40%. Recovery: 90→120 belum pulih.", correct: true },
            { text: "−25%", why: "Salah: tidak ada pasangan puncak-lembah yang menghasilkan −25% di sini." },
            { text: "+20%", why: "Salah: drawdown selalu negatif (penurunan) \u2014 +20% = recovery parsial, bukan DD." },
          ],
        },
        {
          q: "VaR 95% Rp200jt. Artinya?",
          options: [
            { text: "Rugi maksimal Rp200jt", why: "Salah \u2014 salah kaprah #1! VaR bukan maksimum; 5% terburuk bisa jauh lebih dalam." },
            { text: "95% hari rugi ≤ Rp200jt; 5% terburuk bisa lebih dalam (lihat CVaR)", why: "Tepat: VaR = batas, bukan maksimum. CVaR mengukur rata-rata 5% terburuk.", correct: true },
            { text: "Rugi pasti Rp200jt", why: "Salah: VaR = ambang probabilitas, bukan kepastian." },
            { text: "Untung minimal Rp200jt", why: "Salah: VaR bicara tentang kerugian, bukan keuntungan." },
          ],
        },
        {
          q: "Return 12%, MaxDD 20%. Calmar?",
          options: [
            { text: "0,6", why: "Tepat: 12%/20% = 0,6. Baik jika > 1,0 \u2014 ini belum.", correct: true },
            { text: "1,67", why: "Salah: itu kebalikannya (20%/12%) \u2014 Calmar = return/DD." },
            { text: "2,4", why: "Salah: tidak ada kombinasi 12% dan 20% yang menghasilkan 2,4." },
            { text: "0,32", why: "Salah: cek pembagiannya \u2014 12/20 = 0,6." },
          ],
        },
        {
          q: "Strategi opsi: Sharpe 1,8, skew −2,5. Paket metrik primer yang TEPAT?",
          options: [
            { text: "Sharpe saja — 1,8 sudah luar biasa", why: "Salah: Sharpe buta skew; 1,8 + skew −2,5 = pola short-vol = bom waktu." },
            { text: "Sortino + skew + CVaR (+ Kappa_3); Sharpe dilarang sendirian", why: "Tepat: payoff berekor butuh metrik berekor. Sharpe sendirian = kebohongan.", correct: true },
            { text: "Calmar saja", why: "Salah: Calmar sensitif satu kejadian dan buta bentuk ekor — perlu paket." },
            { text: "Return absolut saja", why: "Salah: return tanpa risiko = iklan, bukan evaluasi." },
          ],
        },
        {
          q: "Short-vol: Sortino 2,5 tetapi Kappa_3 = 0,8. Artinya?",
          options: [
            { text: "Strategi hebat — Sortino tinggi", why: "Salah: Sortino buta bentuk ekor; Kappa_3 membongkar skew negatifnya." },
            { text: "Ekor kiri tersembunyi — Kappa_3 menghukum skew negatif yang lolos dari Sortino", why: "Tepat: orde-3 menangkap “receh di rel kereta”. Tolak atau minta premi risiko.", correct: true },
            { text: "Data salah hitung", why: "Salah: perbedaan ini matematis by design — LPM orde-3 vs orde-2." },
            { text: "Naikkan target T", why: "Salah: mengubah target tidak mengubah bentuk distribusi — hanya menggeser ambang." },
          ],
        },
      ],
    },
  ],
};
