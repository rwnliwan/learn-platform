import type { V2Lesson } from "../lib/types";

// Bobot MODAL vs bobot RISIKO: 60/40 terlihat seimbang di modal,
// tetapi ~92% risikonya dari saham. Risk parity menyamakan bobot risiko.
const RISK_BARS_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="Diagram batang ganda: 60/40 bobot modal saham 60 persen obligasi 40 persen, tetapi bobot risiko saham 92 persen obligasi 8 persen; risk parity bobot modal saham 25 persen obligasi 75 persen, bobot risiko 50-50.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="70" y1="20" x2="540" y2="20"/><line x1="70" y1="65" x2="540" y2="65"/><line x1="70" y1="110" x2="540" y2="110"/><line x1="70" y1="155" x2="540" y2="155"/><line x1="70" y1="200" x2="540" y2="200"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="64" y="24">100%</text><text x="64" y="114">50%</text><text x="64" y="204">0%</text></g>
<text x="180" y="230" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">60/40 klasik</text>
<text x="430" y="230" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">Risk parity</text>
<g>
<rect x="110" y="92" width="52" height="108" fill="var(--c1)"/><text x="136" y="86" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">60%</text>
<rect x="166" y="128" width="52" height="72" fill="var(--c4)"/><text x="192" y="122" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">40%</text>
<rect x="250" y="20" width="52" height="180" fill="var(--c1)"/><text x="276" y="14" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">~92%</text>
<rect x="306" y="182" width="52" height="18" fill="var(--c4)"/><text x="332" y="176" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">~10%</text>
<rect x="392" y="155" width="52" height="45" fill="var(--c1)"/><text x="418" y="149" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">25%</text>
<rect x="448" y="65" width="52" height="135" fill="var(--c4)"/><text x="474" y="59" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">75%</text>
<rect x="392" y="110" width="52" height="90" fill="var(--c1)" opacity="0.45"/><text x="418" y="104" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">50%</text>
<rect x="448" y="110" width="52" height="90" fill="var(--c4)" opacity="0.45"/><text x="474" y="104" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">50%</text>
</g>
<g font-size="10" font-family="var(--font-ui)">
<rect x="110" y="244" width="10" height="10" fill="var(--c1)"/><text x="124" y="252" fill="var(--chart-text)">bobot modal (kiri tiap pasangan)</text>
<rect x="300" y="244" width="10" height="10" fill="var(--c1)" opacity="0.45"/><text x="314" y="252" fill="var(--chart-text)">bobot risiko (kanan tiap pasangan)</text>
</g>
<text x="136" y="216" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">saham</text>
<text x="192" y="216" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">obligasi</text>
<text x="276" y="216" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">saham</text>
<text x="332" y="216" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">obligasi</text>
<text x="418" y="216" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">saham</text>
<text x="474" y="216" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">obligasi</text>
</svg>`;

export const pmd8: V2Lesson = {
  slug: "pm-d8-risk-parity-budgeting",
  track: "Portfolio Management",
  module: "Kuantitatif Terapan",
  title: "D8 — Risk Parity & Risk Budgeting: Alokasi berbasis Risiko, Bukan Modal",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-2008",
      eyebrow: "Langkah 1 · Cerita",
      title: "Portofolio “seimbang” yang 92% risikonya dari satu kantong",
      prose: [
        "2008. Sebuah dana pensiun menengah bangga dengan portofolio 60/40-nya: 60% saham, 40% obligasi. “Seimbang,” kata laporannya. “Diversifikasi,” kata konsultan. Lalu krisis datang: saham −37%, obligasi +5%. Portofolio “seimbang” itu kehilangan lebih dari 20% — dan ketika tim risiko membedah dari mana luka itu berasal, jawabannya memalukan: sekitar 92% volatilitas portofolio disumbang saham. 40% obligasi itu hampir tidak bersuara.",
        "Twist-nya: mereka mengukur keseimbangan dengan penggaris yang salah. Bobot MODAL 60/40 terdengar adil — tetapi risiko tidak peduli berapa rupiah kamu taruh; ia peduli seberapa liar tiap rupiah bergerak. Saham 3× lebih volatil dari obligasi, jadi 60% modal saham = ~92% risiko saham. “Diversifikasi” mereka adalah diversifikasi modal, bukan diversifikasi risiko. Dua hal yang berbeda — dan yang kedua inilah yang menentukan apakah kamu selamat di krisis.",
        "Dari luka 2008 lahir pendekatan yang membalik logikanya: alokasikan RISIKO dulu, biarkan modal mengikuti. Namanya risk parity — tiap aset menyumbang risiko yang sama besar. Bukan 60/40 modal, melainkan 50/50 risiko. Lesson ini membedah cara menghitung kontribusi risiko, kapan risk parity masuk akal, dan jebakan leverage yang membuat strategi “kalem” ini bisa berubah menjadi buas.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menghitung kontribusi risiko tiap aset (risk contribution) dari bobot, volatilitas, dan korelasi; (2) menurunkan bobot risk parity (inverse volatility) dan memverifikasi risikonya seimbang; (3) menjelaskan kenapa risk parity murni butuh leverage dan apa risikonya; (4) membedakan risk parity (sama rata) dari risk budgeting (jatah risiko sesuai mandat); (5) memutuskan kapan memakai, kapan menghindari, dan kapan leverage dilarang.",
        "Daftar isi: 1) Cerita 2008 · 2) Modal dasar: risk budgeting & statistik (ringkas) · 3) Kontribusi risiko: rumusnya · 4) Lab: bedah 60/40 · 5) Leverage: harga keseimbangan · 6) Lab: volatility targeting · 7) Peta keputusan · 8) Mini-case: Rp50M · 9) Checkpoint.",
        "Metadata: ±50 menit · 2 lab Python · 1 chart · 5 kuis · 1 mini-case. Prasyarat: tidak ada — semua modal diringkas di Langkah 2.",
      ],
      tasks: [],
      reference: "Tanya pertama bukan “berapa bobotnya?”, melainkan “berapa risikonya?”.",
    },
    {
      id: "modal-dasar",
      eyebrow: "Langkah 2 · Modal dasar (ringkas, self-contained)",
      title: "Dua fondasi yang dibawa masuk — tanpa perlu buka lesson lain",
      prose: [
        "Fondasi 1 — risk budgeting & konstruksi portofolio. Konstruksi portofolio modern mengalokasikan RISIKO, bukan modal: tiap aset punya kontribusi risiko (RC_i) terhadap volatilitas total. Optimisasi mean-variance klasik adalah “error maximizer” — ia sangat sensitif terhadap input, sehingga butuh constraints, shrinkage, dan kehati-hatian (Black-Litterman). Intinya: bobot optimal dari optimisasi tidak bisa ditelan mentah-mentah; risk budgeting adalah cara yang lebih jujur dan robust untuk membagi risiko sesuai mandat.",
        "Fondasi 2 — statistik portofolio. Volatilitas portofolio: σ_p² = w′Σw — jumlah dari semua pasangan bobot × kovarians. Korelasi ρ < 1 menurunkan risiko (diversifikasi); ρ mendekati 1 saat krisis menghapus manfaatnya. Return multi-periode dihitung geometric (bukan rata-rata aritmatika), dan uji hipotesis butuh p < α sebelum mengklaim sesuatu “terbukti”. Di lesson ini fondasi statistik dipakai untuk satu hal: membedah dari mana sebenarnya risiko portofoliomu berasal.",
        "Dengan dua fondasi ini kamu siap: risk budgeting memberi filosofinya (bagi risiko, bukan modal), statistik memberi perhitungannya (kovarians → kontribusi risiko). Risk parity = kasus khusus risk budgeting di mana jatahnya sama rata.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: volatilitas itu “bobot risiko” alami",
        body: "Aset dengan volatilitas 2× aset lain menyumbang risiko ~2× LEBIH dari porsi modalnya (tepatnya tergantung korelasi). Itu sebabnya 60/40 “terasa” seperti 92/8 dalam bahasa risiko. Sebelum menghafal rumus, tanam intuisi ini: rupiah yang liar berteriak lebih keras daripada rupiah yang kalem.",
      },
      reference: "Risk parity = risk budgeting dengan jatah sama rata untuk semua aset.",
    },
    {
      id: "konsep-kontribusi-risiko",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Kontribusi risiko: siapa sebenarnya yang berisik?",
      prose: [
        "Definisi: kontribusi risiko aset-i (RC_i) = porsi volatilitas portofolio yang “disebabkan” aset itu. Rumusnya elegan: RC_i = w_i × MCR_i, di mana MCR_i (marginal contribution to risk) = turunan volatilitas portofolio terhadap bobot aset-i. Totalnya pas: jumlah semua RC_i = σ_p (volatilitas portofolio). Risk parity tercapai ketika RC_1 = RC_2 = … = RC_n — setiap aset berteriak sama kerasnya.",
        "Kepribadiannya: risk parity itu wasit yang adil, bukan pelatih yang memihak. Pelatih (optimisasi return) memberi menit bermain ke pemain bintang; wasit (risk parity) memastikan tidak ada satu pemain pun yang mendominasi lapangan — bahkan bintangnya. Hasilnya: tim yang tidak bergantung pada satu orang. Kelemahannya: tim tanpa bintang jarang menang besar.",
        "Rumus lengkapnya:",
      ],
      formula: String.raw`RC_i = w_i \cdot \frac{(\Sigma w)_i}{\sigma_p}, \qquad \sum_i RC_i = \sigma_p`,
      formulaNote:
        "w_i = bobot modal aset-i; Σ = matriks kovarians (diagonal = varians tiap aset, luar diagonal = kovarians antar aset); (Σw)_i = baris-i dari Σ×w = kovarians aset-i dengan portofolio; σ_p = volatilitas portofolio = √(w′Σw). MCR_i = (Σw)_i / σ_p = sensitivitas σ_p terhadap w_i. Risk parity: pilih w agar semua RC_i sama.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “60/40 = diversifikasi”",
        type: "pitfall",
        body: "Yang benar: 60/40 adalah diversifikasi MODAL. Dalam bahasa risiko, portofolio itu ~92% saham — konsentrasi risiko berkedok diversifikasi. Diversifikasi sejati diukur dari RC_i, bukan w_i. Cek portofoliomu sendiri: berapa RC sahamnya? Kebanyakan investor kaget.",
      },
      reference: "Contoh: σ_saham=16%, σ_obligasi=5%, ρ=0,2 → RC saham di 60/40 ≈ 92% dari σ_p.",
    },
    {
      id: "lab-bedah-6040",
      eyebrow: "Langkah 4 · Lab",
      title: "Bedah 60/40: buktikan sendiri 92%-nya",
      prose: [
        "Hitung kontribusi risiko portofolio 60/40 dari volatilitas dan korelasi, lalu bangun bobot risk parity sederhana (inverse volatility: w_i ∝ 1/σ_i) dan verifikasi bahwa RC-nya kini seimbang. Coba ubah korelasi ρ dari 0,2 menjadi 0,9 (krisis!): apa yang terjadi pada manfaat diversifikasi?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rc_saham`, `rc_obligasi` untuk 60/40" },
        { id: "t2", text: "Hitung bobot inverse-vol `w_rp` dan verifikasi RC seimbang" },
      ],
      expected: "RC 60/40: saham 92.4%, obligasi 7.6%  |  Risk parity: w=[24%, 76%], RC=50.0%/50.0%",
      hints: [
        "var_p = ws²σs² + wo²σo² + 2·ws·wo·ρ·σs·σo; sigma_p = sqrt(var_p).",
        "MCR_saham = (ws·σs² + wo·ρ·σs·σo)/sigma_p; RC_saham = ws·MCR_saham.",
        "Inverse-vol: w_saham = (1/σs)/((1/σs)+(1/σo)). Verifikasi: hitung ulang RC dengan bobot baru.",
      ],
      code: {
        starter: `# Bedah risiko 60/40 vs risk parity
import math
sig_s, sig_o, rho = 0.16, 0.05, 0.2   # vol saham, vol obligasi, korelasi
ws, wo = 0.6, 0.4

# TULIS KODEMU
var_p =
sigma_p =
mcr_s =
mcr_o =
rc_saham = ws * mcr_s
rc_obligasi = wo * mcr_o

print(f"RC 60/40: saham {rc_saham/sigma_p:.1%}, obligasi {rc_obligasi/sigma_p:.1%}")

# risk parity: bobot berbanding terbalik dengan volatilitas
w_rp_s =
w_rp_o =
print(f"Risk parity: w=[{w_rp_s:.0%}, {w_rp_o:.0%}]")
print("Verifikasi: hitung ulang RC dengan bobot ini — harus 50/50.")`,
        lockLines: 3,
        solution: `# Bedah risiko 60/40 vs risk parity
import math
sig_s, sig_o, rho = 0.16, 0.05, 0.2   # vol saham, vol obligasi, korelasi
ws, wo = 0.6, 0.4

# TULIS KODEMU
var_p = ws**2 * sig_s**2 + wo**2 * sig_o**2 + 2*ws*wo*rho*sig_s*sig_o
sigma_p = math.sqrt(var_p)
mcr_s = (ws*sig_s**2 + wo*rho*sig_s*sig_o) / sigma_p
mcr_o = (wo*sig_o**2 + ws*rho*sig_s*sig_o) / sigma_p
rc_saham = ws * mcr_s
rc_obligasi = wo * mcr_o

print(f"RC 60/40: saham {rc_saham/sigma_p:.1%}, obligasi {rc_obligasi/sigma_p:.1%}")

# risk parity: bobot berbanding terbalik dengan volatilitas
w_rp_s = (1/sig_s) / ((1/sig_s) + (1/sig_o))
w_rp_o = 1 - w_rp_s
print(f"Risk parity: w=[{w_rp_s:.0%}, {w_rp_o:.0%}]")
# verifikasi cepat
vp2 = w_rp_s**2*sig_s**2 + w_rp_o**2*sig_o**2 + 2*w_rp_s*w_rp_o*rho*sig_s*sig_o
sp2 = math.sqrt(vp2)
rc2_s = w_rp_s * (w_rp_s*sig_s**2 + w_rp_o*rho*sig_s*sig_o) / sp2
print(f"RC risk parity: saham {rc2_s/sp2:.1%}, obligasi {(sp2-rc2_s)/sp2:.1%} (harus 50/50)")
print("Coba: rho=0.9 — diversifikasi ambruk saat paling dibutuhkan.")`,
        checks: [
          { kind: "equal", task: "t1", name: "rc_saham", value: 0.0942, tol: 0.002, label: "`rc_saham` ≈ 0,094", msg: "ws × (ws·σs² + wo·ρ·σs·σo)/σ_p." },
          { kind: "equal", task: "t1", name: "rc_obligasi", value: 0.0077, tol: 0.001, label: "`rc_obligasi` ≈ 0,008", msg: "Saham menyumbang ~92% dari σ_p ≈ 10,2%." },
          { kind: "equal", task: "t2", name: "w_rp_s", value: 0.238, tol: 0.01, label: "`w_rp_s` ≈ 24%", msg: "(1/0,16) / ((1/0,16)+(1/0,05))." },
          { kind: "stdout_matches", task: "t1", pattern: "saham 92\\.4%", label: "`print` menampilkan saham 92,4%", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Angka tidak berbohong: 60% modal, 92% risiko. Itulah yang diperbaiki risk parity.",
    },
    {
      id: "leverage-harga",
      eyebrow: "Langkah 5 · Konsep + chart",
      title: "Leverage: harga sebuah keseimbangan",
      prose: [
        "Masalah risk parity murni: bobotnya didominasi obligasi (76% di lab tadi) — volatilitasnya rendah (~6%), return harapannya pun rendah. Investor yang butuh return 60/40 akan kecewa. Solusi industri: LEVERAGE — pinjam dana untuk memperbesar seluruh portofolio hingga volatilitasnya menyamai target (mis. 10%), sehingga return harapan ikut naik. Inilah “All Weather” ala Bridgewater: risiko seimbang + leverage murah = return kompetitif dengan risiko terkendali.",
        "Tetapi leverage bukan gratis. Pertama, biaya pinjam menggerus return — strategi ini hanya masuk akal bila akses leverage murah & stabil (futures, swap; bukan margin ritel mahal). Kedua, leverage memperbesar SEMUA risiko termasuk yang tak terlihat: 2022, saham DAN obligasi jatuh bersamaan (korelasi melonjak) — risk parity ber-leverage terpukul dua kali lipat. Ketiga, drawdown ber-leverage memicu margin call tepat saat likuiditas kering. Wasit yang adil + megafon leverage = tetap bisa bikin rusuh.",
        "Cara membaca chart: tiap kelompok punya dua pasang batang — kiri = bobot MODAL (saham biru tua, obligasi biru muda), kanan = bobot RISIKO. Perhatikan 60/40: modal 60/40 tetapi risiko ~92/8. Risk parity: modal 25/75 tetapi risiko 50/50.",
        "Interpretasi: chart ini adalah “foto rontgen” portofolio — yang terlihat (modal) vs yang sebenarnya (risiko). Risk parity memindahkan keseimbangan dari kiri ke kanan. Pelajaran praktis: sebelum menambah leverage untuk mengejar return, pastikan kamu paham bahwa yang di-leverage adalah risiko yang sudah seimbang — bukan risiko yang sudah miring.",
      ],
      figure: {
        svg: RISK_BARS_SVG,
        alt: "Bobot modal vs bobot risiko: 60/40 = modal 60/40 tetapi risiko ~92/8; risk parity = modal 25/75, risiko 50/50.",
        caption: "Rontgen portofolio: yang terlihat (bobot modal) vs yang sebenarnya (bobot risiko).",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: risk budgeting > risk parity untuk kebanyakan mandat",
        body: "Risk parity = jatah risiko SAMA RATA. Tetapi mandat nyata jarang sama rata: dana pensiun mungkin ingin 70% risiko dari growth asset, 30% dari diversifier. Itulah risk budgeting — wasit yang adil TETAPI mendengar strategi pelatih. Sama-rata adalah kasus khusus, bukan tujuan universal.",
      },
      reference: "Leverage mengubah skala, bukan bentuk: RC tetap 50/50, tetapi σ_p naik sesuai faktor leverage.",
    },
    {
      id: "lab-vol-targeting",
      eyebrow: "Langkah 6 · Lab",
      title: "Volatility targeting: samakan skala risikonya",
      prose: [
        "Ambil portofolio risk parity dari lab sebelumnya (volatilitas ~6%) dan naikkan skalanya dengan leverage agar volatilitas target 10% — lalu bandingkan return harapannya dengan 60/40. Coba ubah biaya leverage dari 1% menjadi 4%: pada titik berapa keunggulan risk parity hilang? Itulah “biaya keseimbangan”.",
      ],
      tasks: [
        { id: "t1", text: "Hitung faktor leverage `lev` ke target vol 10%" },
        { id: "t2", text: "Hitung return harapan net `ret_rp_net` setelah biaya leverage" },
      ],
      expected: "Leverage: 1.64x  Return RP net: 6.7% vs 60/40: 6.4% (biaya leverage 1%)",
      hints: [
        "lev = target_vol / vol_rp. Bobot ber-leverage = lev × bobot awal; sisanya (1-lev) = pinjam.",
        "ret_rp_gross = lev × ret_rp; biaya = (lev-1) × cost_lev; net = gross - biaya.",
        "60/40: 0,6×8% + 0,4×4% = 6,4%? — hitung sendiri dari angka di kode!",
      ],
      code: {
        starter: `# Volatility targeting: samakan skala risiko, bandingkan return
vol_rp, ret_rp = 0.061, 0.045   # risk parity: vol 6,1%, return harapan 4,5%
target_vol = 0.10
cost_lev = 0.01                  # biaya pinjam 1% — coba naikkan ke 0,04!
ret_6040 = 0.6*0.08 + 0.4*0.04  # return harapan 60/40

# TULIS KODEMU
lev =
ret_rp_net =

print(f"Leverage: {lev:.2f}x")
print(f"Return RP net: {ret_rp_net:.1%} vs 60/40: {ret_6040:.1%} (biaya leverage {cost_lev:.0%})")
print("Tanya: lev naik 2x lipat — drawdown-nya ikut berapa kali lipat?")`,
        lockLines: 4,
        solution: `# Volatility targeting: samakan skala risiko, bandingkan return
vol_rp, ret_rp = 0.061, 0.045   # risk parity: vol 6,1%, return harapan 4,5%
target_vol = 0.10
cost_lev = 0.01                  # biaya pinjam 1% — coba naikkan ke 0,04!
ret_6040 = 0.6*0.08 + 0.4*0.04  # return harapan 60/40

# TULIS KODEMU
lev = target_vol / vol_rp
ret_rp_net = lev*ret_rp - (lev-1)*cost_lev

print(f"Leverage: {lev:.2f}x")
print(f"Return RP net: {ret_rp_net:.1%} vs 60/40: {ret_6040:.1%} (biaya leverage {cost_lev:.0%})")
print("Tanya: lev naik 2x lipat — drawdown-nya ikut berapa kali lipat?")`,
        checks: [
          { kind: "equal", task: "t1", name: "lev", value: 1.639, tol: 0.01, label: "`lev` ≈ 1,64x", msg: "0,10 / 0,061." },
          { kind: "equal", task: "t2", name: "ret_rp_net", value: 0.0674, tol: 0.002, label: "`ret_rp_net` ≈ 6,7%", msg: "1,639×4,5% − 0,639×1%." },
          { kind: "stdout_matches", task: "t2", pattern: "Return RP net: 6\\.7% vs 60/40: 6\\.4%", label: "`print` menampilkan perbandingan return", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Dengan leverage murah, RP mengungguli 60/40 pada risiko SAMA — dengan biaya 4%, keunggulan lenyap.",
    },
    {
      id: "peta-keputusan-rp",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kapan risiko dibagi rata, kapan tidak?",
      prose: [
        "Skenario 1 — Dana pensiun besar, akses leverage murah (futures/swap), tim risiko kuat. → Risk parity penuh + leverage ke target vol. Alasan: skala institusi membuat biaya leverage rendah; diversifikasi risiko sejati menurunkan drawdown krisis.",
        "Skenario 2 — Dana pensiun TANPA akses leverage (banyak regulasi melarang). → Risk budgeting parsial: geser 60/40 ke mis. 40/60 atau tambah diversifier, tanpa leverage. Alasan: RP tanpa leverage = return terlalu rendah untuk liabilitas; kompromi via risk budgeting sesuai mandat lebih jujur daripada memaksakan parity.",
        "Skenario 3 — Krisis likuiditas / korelasi melonjak (2022-style). → Kurangi leverage dulu, pertahankan keseimbangan risiko. Alasan: saat ρ → 1, diversifikasi mati dan leverage menggandakan luka; wasit adil tidak menolong bila seluruh tim cedera.",
        "Skenario 4 — Investor ritel tanpa akses leverage murah. → Lupakan leverage; pakai target-date fund atau multifactor long-only. Alasan: margin ritel mahal & dipanggil di saat terburuk; RP ritel = jebakan biaya.",
        "Aturan praktis 10 detik: (1) hitung RC_i dulu — jangan tebak; (2) leverage hanya bila murah, stabil, dan dipahami komite; (3) uji skenario korelasi = 1 (2022) sebelum percaya; (4) risk budgeting (jatah sesuai mandat) > parity buta untuk kebanyakan kasus; (5) rebalance risiko berkala — bobot risiko juga drift!",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Risk parity = portofolio aman”",
        type: "pitfall",
        body: "Yang benar: yang “aman” adalah KESEIMBANGAN risikonya, bukan TINGKAT risikonya. Dengan leverage 2x, portofolio “seimbang” bisa lebih berisiko dari 60/40 biasa. Dan 2022 membuktikan: saat saham & obligasi jatuh bersamaan, tidak ada keseimbangan yang menyelamatkan — hanya leverage yang lebih kecil.",
      },
      reference: "Bobot risiko pun drift: rebalance risk parity tiap kuartal/semester, bukan sekali jadi.",
    },
    {
      id: "minicase-50m",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Rp50M: tiga jalan di depan komite",
      prose: [
        "Sebuah yayasan dana abadi Rp50M, target return 7%/tahun, toleransi drawdown moderat. Konsultan menawarkan tiga opsi. A: 60/40 klasik (return harapan 6,4%, vol 10,4%, RC saham ~92%). B: risk parity tanpa leverage (return harapan 4,5%, vol 6,1%, RC 50/50). C: risk parity + leverage 1,64x ke vol 10% (return harapan net 6,7% dengan biaya pinjam 1%, RC 50/50).",
        "Pertanyaan: (a) Opsi mana yang “paling terdiversifikasi” dalam bahasa risiko? (b) Kenapa B — yang paling “aman” — justru mungkin ditolak yayasan? (c) Risiko terbesar opsi C apa, dan bagaimana mengujinya sebelum ACC?",
        "Pembahasan. (a) B dan C sama-sama 50/50 — C hanya versi B yang diskalakan. A adalah konsentrasi risiko berkedok diversifikasi. (b) B gagal memenuhi target return 7% (shortfall risk!): “aman” dalam volatilitas tetapi “berisiko” dalam mencapai tujuan — risiko harus diukur terhadap TUJUAN, bukan terhadap nol. (c) Risiko C = leverage: biaya pinjam naik, korelasi melonjak (skenario 2022), margin call. Uji sebelum ACC: stress test ρ = 0,9 & biaya pinjam 4% (lab langkah 6 menunjukkan keunggulan lenyap), batasi lev maksimum tertulis, dan pastikan komite paham bahwa drawdown C = 1,64 × drawdown B. Pelajaran umum: tidak ada opsi “terbaik” — hanya trade-off yang dipilih sadar: A murah tapi miring, B seimbang tapi kurang return, C seimbang + return cukup tetapi rapuh terhadap leverage.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: risiko = jarak ke tujuan, bukan jarak ke nol",
        body: "Portofolio “aman” yang pasti gagal mencapai target 7% lebih berisiko — bagi yayasan ini — daripada portofolio bergejolak yang punya peluang mencapainya. Selalu ukur risiko terhadap liabilitas/tujuan (shortfall), bukan terhadap volatilitas semata.",
      },
      reference: "Keputusan komite yang dewasa: pilih trade-off-nya, tulis batas leverage-nya, uji 2022-nya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran dari semua langkah — dari rumus RC hingga keputusan leverage."],
      tasks: [],
      summary: [
        "Kontribusi risiko: RC_i = w_i × (Σw)_i / σ_p; jumlahnya = σ_p. Ukur diversifikasi dari RC, bukan bobot modal.",
        "60/40 klasik ≈ 92% risiko dari saham — diversifikasi modal bukan diversifikasi risiko.",
        "Risk parity: RC_i sama rata → bobot inverse volatility (w_i ∝ 1/σ_i); verifikasi dengan hitung ulang.",
        "RP murni return-nya rendah → butuh leverage murah & stabil ke target vol; leverage menggandakan drawdown & rapuh saat korelasi melonjak (2022).",
        "Risk budgeting (jatah risiko sesuai mandat) lebih cocok untuk kebanyakan kasus daripada parity buta; bobot risiko pun perlu direbalance.",
      ],
      next: { label: "D9 — CPPI & Asuransi Portofolio", href: "/v2/learn/pm-d9-cppi" },
      quiz: [
        {
          q: "Portofolio 60/40: σ_saham=16%, σ_obligasi=5%, ρ=0,2. Kontribusi risiko saham?",
          options: [
            { text: "~92%", why: "Tepat: RC_saham ≈ 92% dari σ_p (lab langkah 4). 60% modal, 92% risiko.", correct: true },
            { text: "60%", why: "Salah: 60% adalah bobot MODAL — risiko tidak dihitung dari bobot modal saja." },
            { text: "~50%", why: "Salah: itu hasil SETELAH risk parity (bobot ~24/76), bukan 60/40." },
            { text: "~10%", why: "Salah: ~10% adalah kontribusi OBLIGASI — kebalikannya." },
          ],
        },
        {
          q: "Dua aset tidak berkorelasi, σ_A=20%, σ_B=5%. Bobot risk parity (inverse-vol)?",
          options: [
            { text: "A 80%, B 20%", why: "Salah: itu memberi bobot BESAR ke yang liar — kebalikan dari risk parity." },
            { text: "A 50%, B 50%", why: "Salah: bobot sama ≠ risiko sama bila volatilitas beda 4× lipat." },
            { text: "A 20%, B 80%", why: "Tepat: w_A = (1/0,20)/((1/0,20)+(1/0,05)) = 5/25 = 20%. Yang kalem dapat porsi besar.", correct: true },
            { text: "A 0%, B 100%", why: "Salah: itu bukan parity — satu aset nol risiko = portofolio satu aset." },
          ],
        },
        {
          q: "Risk parity murni (vol 6%) di-leverage 1,64x ke vol 10%. Apa yang TIDAK berubah?",
          options: [
            { text: "Volatilitas portofolio", why: "Salah: vol naik 6% → 10% — itu tujuan leverage-nya." },
            { text: "Proporsi kontribusi risiko (tetap 50/50)", why: "Tepat: leverage mengubah SKALA, bukan BENTUK — RC relatif tetap seimbang.", correct: true },
            { text: "Return harapan", why: "Salah: return harapan naik (gross) — dikurangi biaya pinjam." },
            { text: "Besar drawdown", why: "Salah: drawdown ikut diskalakan ~1,64x — inilah harga leverage." },
          ],
        },
        {
          q: "2022: saham & obligasi jatuh bersamaan. Pelajaran untuk risk parity ber-leverage?",
          options: [
            { text: "Tambah leverage untuk rebound", why: "Salah: menambah leverage saat korelasi melonjak = menggandakan luka." },
            { text: "Keseimbangan risiko tidak melindungi dari korelasi → 1; kecilkan leverage saat rezim berubah", why: "Tepat: diversifikasi mati saat ρ melonjak; leverage yang tadinya “aman” menjadi pengganda kerugian.", correct: true },
            { text: "Pindah ke 100% saham", why: "Salah: itu justru konsentrasi risiko maksimal — pelajaran yang keliru total." },
            { text: "Risk parity terbukti gagal total", why: "Salah: yang gagal adalah asumsi korelasi stabil + leverage — bukan logika keseimbangan risikonya." },
          ],
        },
        {
          q: "Yayasan butuh return 7%. Opsi B (RP tanpa leverage, return harapan 4,5%) ditolak. Alasan TEPAT?",
          options: [
            { text: "Volatilitasnya terlalu tinggi", why: "Salah: vol B hanya 6,1% — paling rendah dari semua opsi." },
            { text: "Shortfall risk: hampir pasti gagal mencapai tujuan 7% — risiko diukur terhadap tujuan", why: "Tepat: “aman” vs volatilitas ≠ “aman” vs tujuan. Risiko = jarak ke target.", correct: true },
            { text: "Biaya leverage-nya mahal", why: "Salah: opsi B tidak pakai leverage sama sekali." },
            { text: "Kontribusi risikonya tidak seimbang", why: "Salah: RC B seimbang 50/50 — itu kelebihannya, bukan kekurangannya." },
          ],
        },
      ],
    },
  ],
};
