import type { V2Lesson } from "../lib/types";

// Bar chart: return total tahunan 10 tahun (ilustratif, %) — properti langsung vs REIT vs saham vs obligasi.
// Uses var(--chart-*) / var(--c*) so it follows the active theme.
const RETURN_SVG = `<svg viewBox='0 0 480 270' role='img' aria-label='Diagram batang return tahunan: properti langsung 8,2 persen, REIT 9,5 persen, saham 10,1 persen, obligasi 6,0 persen.'>
<g stroke='var(--chart-grid)' stroke-width='1'><line x1='48' y1='20' x2='464' y2='20'/><line x1='48' y1='70' x2='464' y2='70'/><line x1='48' y1='120' x2='464' y2='120'/><line x1='48' y1='170' x2='464' y2='170'/><line x1='48' y1='220' x2='464' y2='220'/></g>
<g fill='var(--chart-text)' font-size='11' font-family='var(--font-ui)' text-anchor='end'><text x='42' y='24'>12%</text><text x='42' y='74'>9%</text><text x='42' y='124'>6%</text><text x='42' y='174'>3%</text><text x='42' y='224'>0%</text></g>
<g font-size='12' font-family='var(--font-ui)' text-anchor='middle'>
<rect x='80' y='82.7' width='64' height='137.3' fill='var(--c1)'/><text x='112' y='72' fill='var(--text)' font-weight='600'>8,2%</text><text x='112' y='238' fill='var(--chart-text)'>Properti langsung</text>
<rect x='184' y='61.7' width='64' height='158.3' fill='var(--c2)'/><text x='216' y='51' fill='var(--text)' font-weight='600'>9,5%</text><text x='216' y='238' fill='var(--chart-text)'>REIT</text>
<rect x='288' y='51.7' width='64' height='168.3' fill='var(--c3)'/><text x='320' y='41' fill='var(--text)' font-weight='600'>10,1%</text><text x='320' y='238' fill='var(--chart-text)'>Saham</text>
<rect x='392' y='120' width='64' height='100' fill='var(--c4)'/><text x='424' y='109' fill='var(--text)' font-weight='600'>6,0%</text><text x='424' y='238' fill='var(--chart-text)'>Obligasi</text>
</g>
<text x='48' y='262' font-size='11' fill='var(--text-muted)' font-family='var(--font-ui)'>Return total tahunan (dividen/sewa + apresiasi), 10 tahun, ilustratif — bukan janji return.</text>
</svg>`;

export const e19: V2Lesson = {
  slug: "e19-real-estate-reit",
  track: "Financial Markets",
  module: "Real Estate",
  title: "E19. Real Estate & REIT: Properti sebagai Aset Investasi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-leverage",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Modal Rp200 juta jadi Rp1,2 miliar — atau jadi Rp80 juta",
      prose: [
        "2018, Pak Budi membeli apartemen Rp1 miliar: DP Rp200 juta, KPR Rp800 juta. 2026 ia jual Rp2 miliar. “Modal Rp200 juta jadi Rp1,2 miliar — untung 6× lipat dalam 8 tahun!” katanya bangga. Hitungan kasarnya benar: Rp2 miliar − Rp800 juta (pokok utang) = Rp1,2 miliar dari modal Rp200 juta.",
        "Tapi dengar cerita tetangganya, Pak Andi. Apartemen sejenis dibeli 2019 seharga Rp1,1 miliar dengan struktur sama (DP 20%). Pandemi menekan harga 20% menjadi Rp880 juta. Utangnya masih ±Rp800 juta — ekuitasnya tinggal Rp80 juta dari modal Rp220 juta. Hangus 64%, padahal “cuma” turun 20%. Leverage yang sama yang melipatgandakan untung Pak Budi, melipatgandakan rugi Pak Andi. Properti + utang = return yang diperbesar ke dua arah.",
        "Lesson ini: cara menilai properti sebagai aset investasi (bukan sekadar tempat tinggal), matematika sewa dan leverage, serta REIT — cara ikut pasar properti tanpa harus membeli gedungnya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: properti = bisnis arus kas berkostum tanah",
        body: "Yang kamu beli bukan tanahnya — melainkan arus kas sewanya; tanah hanyalah bonus yang kadang naik. Enam heuristik. Pertama: nilai properti = NOI ÷ cap rate yang wajar — kalau sewanya tidak masuk akal, “lokasi strategis” hanyalah alasan membayar kemahalan. Kedua: bandingkan cap rate dengan SBN 10Y — selisihnya premi risiko properti; kalau cuma beda 1%, kamu menanggung drama penyewa demi receh. Ketiga: leverage dua arah — DP 20% membuat untung berlipat, tetapi turun 20% menghapus seluruh modalmu; hitung skenario turun dulu, bukan skenario naik. Keempat: REIT = properti tanpa drama — dapat yield dan diversifikasi tanpa urus bocor dan penyewa kabur; bayarannya: kamu tidak mengontrol apa-apa. Kelima: yang tidak ada di spreadsheet menentukan — banjir, sertifikat sengketa, akses jalan; survei fisik bukan opsional. Keenam: untuk REIT, nilai dari AFFO yield bukan P/E — laba akuntansi properti menipu karena depresiasi gedung yang harganya naik; kas yang benar-benar bisa dibagi (AFFO) adalah kebenarannya, dan harga vs NAV memberi tahu diskon atau premi yang kamu bayar. Aturan 10 detiknya: sewa tahunan < 5% harga beli = mahal kecuali kamu yakin harganya naik cepat; untuk REIT, AFFO yield harus di atas SBN 10Y plus premi yang pantas.",
      },
      reference: "Leverage = pengali dua arah. Hitung skenario turun, bukan cuma skenario naik.",
    },
    {
      id: "yield-caprate",
      eyebrow: "Langkah 2 · Lab: yield & cap rate",
      title: "Bahasa universal properti: NOI dan cap rate",
      prose: [
        "Tiga angka yang menentukan apakah sebuah properti “investasi” atau “beban”: pendapatan sewa kotor (semua kamar terisi penuh), NOI — net operating income = sewa efektif (setelah dikurangi kekosongan/vacancy) − biaya operasional (pajak properti, perawatan, asuransi, manajemen) — dan cap rate = NOI / harga beli. Cap rate adalah “bahasa universal”: kos di Bandung cap rate 6% vs ruko di Jakarta 4,5% langsung bisa dibandingkan, tanpa peduli harganya beda jauh.",
        "Kilasan kilat (konsep nilai waktu uang): Rp1 hari ini lebih berharga dari Rp1 tahun depan karena bisa diinvestasikan — jadi arus kas masa depan harus didiskon ke nilai sekarang (present value). Harga wajar properti = nilai kini dari seluruh NOI masa depan yang didiskon; cap rate pada dasarnya adalah versi praktis dan kasar dari logika itu.",
        "Total return properti = rental yield + apresiasi harga. Kos dengan yield 7% yang harganya stagnan bisa mengalahkan apartemen mewah yang naik 4%/tahun tapi yield-nya cuma 2%. Investor amatir terpaku pada “harganya naik berapa”; investor profesional menghitung “kas yang masuk berapa”.",
        "💡 Tips: cap rate mengukur ASET-nya, bukan struktur biayamu — NOI tidak termasuk cicilan KPR dan pajak penghasilan. Dua orang membeli kos yang sama bisa dapat cap rate identik tapi cash-on-cash return yang beda jauh karena DP dan bunganya beda.",
      ],
      formula: String.raw`\text{cap rate} = \frac{\text{NOI}}{\text{harga beli}} \qquad \text{cash-on-cash} = \frac{\text{arus kas tahunan}}{\text{modal sendiri (DP)}}`,
      formulaNote: "NOI = pendapatan sewa efektif − biaya operasional. Arus kas tahunan = NOI − cicilan KPR setahun. Cap rate menjawab “seberapa produktif asetnya”; cash-on-cash menjawab “seberapa produktif uangku”.",
      tasks: [
        { id: "t1", text: "Hitung `noi` (Rp) dan `cap_rate` (desimal)" },
        { id: "t2", text: "Hitung `cicilan` (Rp/bln), `arus_kas` (Rp/thn), dan `cash_on_cash` (desimal)" },
      ],
      expected: "NOI=113.0jt  cap_rate=5.65%  cicilan=12.60jt/bln  arus_kas=-38.2jt/thn  CoC=-6.36%",
      note: {
        title: "Sering salah",
        body: "Mengira cap rate 5,65% dengan KPR bunga 9% tetap “untung karena properti naik”. Ini negative leverage: setiap rupiah utang menggerus kas −6,36%/tahun atas modalmu. Kenaikan harga harus menutup lubang kas ini dulu sebelum kamu benar-benar untung.",
      },
      hints: [
        "pendapatan = sewa_per_kamar × n_kamar × 12 × okupansi; noi = pendapatan − biaya_operasional.",
        "cap_rate = noi / harga. cicilan pakai rumus anuitas: P·r/(1−(1+r)^−n).",
        "arus_kas = noi − cicilan×12; cash_on_cash = arus_kas / dp.",
      ],
      code: {
        starter: `harga = 2_000_000_000          # Rp, kos 10 pintu
sewa_per_kamar = 1_500_000     # Rp/bulan
n_kamar = 10
okupansi = 0.85                # 15% kosong rata-rata
biaya_operasional = 40_000_000 # Rp/tahun: pajak, rawat, kelola

# TULIS KODEMU: NOI dan cap rate
noi =
cap_rate =

# KPR: DP 30%, bunga 9% efektif/tahun, tenor 20 tahun
dp = 0.30 * harga
pinjaman = harga - dp
r_bulan = 0.09 / 12
n_bulan = 20 * 12

# TULIS KODEMU: cicilan bulanan, arus kas tahunan, cash-on-cash
cicilan =
arus_kas =
cash_on_cash =

print(f"NOI={noi/1e6:.1f}jt  cap_rate={cap_rate*100:.2f}%")
print(f"cicilan={cicilan/1e6:.2f}jt/bln  arus_kas={arus_kas/1e6:.1f}jt/thn  CoC={cash_on_cash*100:.2f}%")`,
        lockLines: 5,
        solution: `harga = 2_000_000_000          # Rp, kos 10 pintu
sewa_per_kamar = 1_500_000     # Rp/bulan
n_kamar = 10
okupansi = 0.85                # 15% kosong rata-rata
biaya_operasional = 40_000_000 # Rp/tahun: pajak, rawat, kelola

# TULIS KODEMU: NOI dan cap rate
noi = sewa_per_kamar * n_kamar * 12 * okupansi - biaya_operasional
cap_rate = noi / harga

# KPR: DP 30%, bunga 9% efektif/tahun, tenor 20 tahun
dp = 0.30 * harga
pinjaman = harga - dp
r_bulan = 0.09 / 12
n_bulan = 20 * 12

# TULIS KODEMU: cicilan bulanan, arus kas tahunan, cash-on-cash
cicilan = pinjaman * r_bulan / (1 - (1 + r_bulan) ** (-n_bulan))
arus_kas = noi - cicilan * 12
cash_on_cash = arus_kas / dp

print(f"NOI={noi/1e6:.1f}jt  cap_rate={cap_rate*100:.2f}%")
print(f"cicilan={cicilan/1e6:.2f}jt/bln  arus_kas={arus_kas/1e6:.1f}jt/thn  CoC={cash_on_cash*100:.2f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "noi", value: 113000000, tol: 1, label: "`noi` = Rp113 jt", msg: "1,5jt × 10 × 12 × 0,85 − 40jt = Rp153jt − Rp40jt." },
          { kind: "equal", task: "t1", name: "cap_rate", value: 0.0565, tol: 1e-4, label: "`cap_rate` = 5,65%", msg: "113jt / 2000jt = 0,0565." },
          { kind: "equal", task: "t2", name: "cicilan", value: 12596163.38, tol: 5000, label: "`cicilan` ≈ Rp12,60 jt/bln", msg: "Anuitas: P·r/(1−(1+r)^−n) dengan P=1400jt, r=0,0075, n=240." },
          { kind: "equal", task: "t2", name: "cash_on_cash", value: -0.0635899, tol: 0.002, label: "`cash_on_cash` ≈ −6,36%", msg: "(113jt − cicilan×12) / 600jt. Negatif = negative leverage." },
          { kind: "stdout_matches", task: "t2", pattern: "NOI=113\\.0jt\\s+cap_rate=5\\.65%", label: "`print` baris 1 sesuai format", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t2", pattern: "cicilan=12\\.60jt/bln\\s+arus_kas=-38\\.2jt/thn\\s+CoC=-6\\.36%", label: "`print` baris 2 sesuai format", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "NOI & cap rate = bahasa banding properti. Cap rate < bunga KPR = negative leverage.",
    },
    {
      id: "reit",
      eyebrow: "Langkah 3 · REIT",
      title: "Punya mal tanpa beli mal: REIT",
      prose: [
        "Real Estate Investment Trust (REIT; di Indonesia: DIRE) = perusahaan yang hartanya gedung/mal/hotel/apartemen sewa, dan kamu membeli sahamnya di bursa. Kilasan kilat (konsep ekuitas): saham = klaim sisa atas perusahaan — pemegang saham dibayar terakhir setelah kreditor; harga saham mencerminkan ekspektasi pasar atas arus kas masa depan. REIT diperdagangkan seperti saham biasa, jadi harganya bergerak oleh sentimen pasar dan suku bunga — bukan cuma oleh nilai bangunannya.",
        "Daya tariknya: dividen jumbo (aturan main mewajibkan REIT membagikan porsi besar labanya sebagai dividen), tiket masuk kecil (1 lot, bukan Rp1 miliar), likuid (jual dalam hitungan detik), dan terdiversifikasi (satu REIT bisa pegang 20 mal). Harganya: kamu tidak mengendalikan propertinya, kena fee manajemen, dan harga saham REIT bisa anjlok 20% sementara gedungnya baik-baik saja — volatilitas pasar menempel padamu.",
        "Metrik khas REIT: FFO (funds from operations) = laba bersih + depresiasi. Kenapa depresiasi ditambahkan kembali? Karena depresiasi gedung adalah beban akuntansi non-kas — gedung sewaan yang dirawat baik justru sering naik nilainya, bukan menyusut seperti mesin pabrik. Menilai REIT dari laba bersih akuntansi = salah alamat; analis memakai FFO yield = FFO / harga saham.",
        "Cara membaca: sumbu X = empat kelas aset; tinggi batang = return total tahunan (sewa/dividen/kupon + apresiasi) selama 10 tahun. Angka ilustratif untuk perbandingan konsep, bukan janji return.",
        "Interpretasi: REIT duduk di antara properti langsung dan saham — return mirip saham dengan karakter pendapatan mirip properti. Obligasi paling rendah return-nya tapi paling stabil. Pelajarannya bukan “pilih yang tertinggi”, melainkan: tiap kelas aset menempati peran berbeda di portofolio — pertumbuhan (saham), pendapatan + diversifikasi (REIT/properti), stabilitas (obligasi).",
      ],
      figure: {
        svg: RETURN_SVG,
        alt: "Diagram batang return tahunan: properti langsung 8,2 persen, REIT 9,5 persen, saham 10,1 persen, obligasi 6,0 persen.",
        caption: "Return total tahunan 10 tahun (ilustratif): REIT di antara properti langsung dan saham.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“REIT = punya properti, jadi aman seperti punya ruko.” Salah: harga saham REIT berfluktuasi harian mengikuti pasar dan sangat sensitif pada suku bunga (saat bunga naik, dividen REIT kalah menarik vs obligasi → harga REIT turun). Gedungnya stabil; harga sahamnya tidak.",
      },
      reference: "REIT = eksposur properti likuid + dividen; nilai via FFO, bukan laba bersih.",
    },
    {
      id: "risiko-properti",
      eyebrow: "Langkah 4 · Risiko",
      title: "Empat risiko yang membunuh investor properti",
      prose: [
        "Vacancy (kekosongan): kos 10 pintu yang terisi 6 = pendapatan −40% sementara cicilan KPR tetap 100%. Properti punya biaya tetap tinggi — kekosongan adalah musuh nomor satu arus kas. Selalu hitung skenario okupansi 70%, bukan 100%.",
        "Suku bunga: KPR floating naik 3% bisa menambah cicilan 25–30%. REIT pun terpukul saat bunga naik (dividennya kalah bersaing dengan obligasi). Properti adalah aset yang paling sensitif pada suku bunga setelah obligasi jangka panjang.",
        "Likuiditas: jual saham butuh detik; jual ruko butuh 3–12 bulan + biaya notaris/PPh 5–8%. Butuh uang mendadak = jual murah. Properti bukan dana darurat.",
        "Konsentrasi & leverage: satu ruko Rp3 miliar bisa = 80% kekayaanmu dalam satu aset, satu lokasi, satu penyewa. Ditambah utang 70% = bom konsentrasi berlapis.",
        "🚨 Mitos: “Properti tidak pernah turun — tanah kan tidak bertambah.” Yang benar: harga properti turun berkali-kali dalam sejarah — Jakarta 1998 (−40%+ dalam dolar), AS 2008 (−30%), bahkan Jepang stagnan 30 tahun. Tanah tidak bertambah, tapi daya beli, suku bunga, dan demografi berubah.",
        "🚨 Mitos: “Beli properti = investasi; beli REIT = spekulasi.” Yang benar: kebalikannya bisa terjadi — REIT terdiversifikasi 20 gedung lebih “investasi” daripada satu ruko yang 80% kekayaanmu. Spekulatif tidaknya ditentukan konsentrasi dan leverage, bukan labelnya.",
        "💡 Tips: aturan 1% kasar — sewa bulanan ≈ 1% harga beli = properti yang arus kasnya sehat (Rp3 miliar → sewa Rp30 jt/bln). Di bawah 0,5% = kamu bertaruh murni pada apresiasi harga.",
        "💡 Tips: stress-test tiga skenario sebelum tanda tangan: (1) bunga naik 3%, (2) kosong 6 bulan, (3) harga turun 20%. Kalau ketiganya masih bisa bernapas — lanjut.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko properti = risiko kredit + risiko pasar + risiko likuiditas dalam satu paket. Bank menilai KPR-mu dengan logika yang sama: kemampuan bayar (arus kas), agunan (harga), dan skenario stres. Pahami sisi bank = pahami risikomu sendiri.",
      },
      reference: "Vacancy, bunga, likuiditas, konsentrasi — stress-test ketiganya sebelum beli.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 5 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang cap rate dan leverage sebelum ke mini-case.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Kos A: harga Rp2 M, NOI Rp113 jt (cap rate 5,65%). Kos B: harga Rp1,5 M, NOI Rp90 jt (cap rate 6%). Mana “aset” yang lebih produktif?",
          options: [
            { text: "A — harganya lebih mahal", why: "Salah: harga mahal bukan ukuran produktivitas aset." },
            { text: "B — cap rate 6% > 5,65%: tiap rupiah harga menghasilkan NOI lebih besar", why: "Benar: cap rate = ukuran produktivitas aset, independen dari harga.", correct: true },
            { text: "Sama saja", why: "Salah: 6% vs 5,65% beda nyata dalam jangka panjang." },
            { text: "Tidak bisa dibandingkan", why: "Salah: justru cap rate diciptakan agar properti beda harga bisa dibandingkan." },
          ],
        },
        {
          q: "Cap rate 5,65%, bunga KPR 9%, DP 30%. Apa yang terjadi pada arus kasmu?",
          options: [
            { text: "Untung, karena properti pasti naik", why: "Salah: apresiasi tidak membayar cicilan bulan ini." },
            { text: "Tetap untung karena leverage", why: "Salah: leverage memperbesar, bukan menciptakan — di sini memperbesar kerugian kas." },
            { text: "Negative leverage: kas keluar tiap bulan (−6,36%/tahun atas modal); hanya apresiasi besar yang menyelamatkan", why: "Benar: biaya utang > produktivitas aset = lubang kas.", correct: true },
            { text: "Tidak ada efek", why: "Salah: lab menunjukkan arus kas −Rp38,2 jt/tahun." },
          ],
        },
      ],
    },
    {
      id: "minicase-ruko",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Ruko Rp3 miliar: sewa atau REIT?",
      prose: [
        "Kamu punya Rp3 miliar. Opsi 1: beli ruko — sewa kontrak Rp180 jt/tahun, biaya (pajak, perawatan, asuransi) Rp30 jt/tahun, risiko kosong 20% (rata-rata 2,4 bulan/tahun tanpa penyewa). Opsi 2: beli REIT dengan dividend yield 7%/tahun, likuid, tanpa urus penyewa.",
        "Pertanyaan: (a) Hitung NOI efektif ruko (setelah vacancy) dan yield-nya. (b) Bandingkan dengan REIT 7% — kapan ruko menang? (c) Faktor non-angka apa yang mengubah keputusanmu?",
        "Pembahasan: (a) Sewa efektif = 180 × 80% = Rp144 jt; NOI = 144 − 30 = Rp114 jt; yield = 114/3000 = 3,8%. (b) Ruko kalah telak dari sisi yield (3,8% vs 7%) — ruko hanya menang jika apresiasi harga > 3,2%/tahun secara konsisten PLUS kamu mau repot kelola. (c) Kontrol (bisa renovasi/naikkan sewa), diversifikasi (REIT = banyak gedung), likuiditas (REIT jual sedetik), pajak & biaya transaksi (ruko 5–8% sekali jalan).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Yield 3,8% < inflasi + risiko = return riil bisa negatif. Investor properti yang hanya menghitung “harga naik” tanpa yield = spekulan yang beruntung, bukan investor yang terampil.",
      },
      reference: "Bandingkan apel vs apel: yield efektif setelah vacancy, bukan sewa brosur.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Empat skenario: beli, sewa, REIT, atau tunggu?",
      prose: [
        "Butuh tempat tinggal → beli jika akan tinggal ≥ 7 tahun DAN pekerjaan/lokasi stabil; jika tidak, sewa + investasikan selisihnya. Biaya transaksi properti 5–8% butuh tahunan untuk “balik modal” — beli lalu pindah 3 tahun kemudian = rugi pasti.",
        "Mau eksposur properti tapi modal < Rp500 jt atau tidak mau urus penyewa → REIT/DIRE. Tiket kecil, likuid, terdiversifikasi, dividen rutin. Kekurangannya: tidak ada kontrol dan harga sahamnya fluktuatif.",
        "Punya modal besar + waktu + keahlian kelola → properti langsung (kos/kontrakan/ruko). Keunggulannya kontrol penuh dan leverage KPR; syaratnya: hitung NOI jujur (pakai okupansi 70–85%, bukan 100%) dan stress-test bunga + vacancy.",
        "Suku bunga sedang naik atau cap rate < bunga KPR → tunggu / pilih REIT. Negative leverage + harga yang biasanya tertekan saat bunga naik = dua pukulan sekaligus. Kesabaran adalah posisi.",
        "Aturan 10 detik: yield < 4% setelah vacancy = taruhan apresiasi, bukan investasi. Cap rate < bunga KPR = jangan pakai utang. Satu aset > 50% kekayaanmu = konsentrasi berbahaya.",
      ],
      tasks: [],
      reference: "Beli vs sewa vs REIT vs tunggu — jawab dengan angka, bukan gengsi.",
    },
    {
      id: "reit-lanjut",
      eyebrow: "Langkah 8 · Pendalaman: membaca REIT",
      title: "NAV, FFO, dan membaca REIT seperti analis",
      prose: [
        "Harga REIT bisa dinilai murah-mahal dengan NAV (net asset value): (nilai pasar seluruh properti − utang) ÷ jumlah unit. REIT diperdagangkan Rp2.700 saat NAV Rp3.000 = diskon 10% — pasar pesimistis atau ada masalah tersembunyi. Premi di atas NAV wajar bila manajemennya terbukti (okupansi tinggi, sewa tumbuh). Aturan kasar: beli diskon > 15% hanya setelah tahu KENAPA pasar memberi diskon.",
        "Laba akuntansi properti menipu: gedung didepresiasi tiap tahun padahal harga pasarnya naik! Analis memakai FFO (funds from operations) = laba bersih + depresiasi + amortisasi — ukuran kas operasi yang lebih jujur. AFFO = FFO − capex rutin (renovasi agar penyewa betah) = kas yang benar-benar bisa dibagi sebagai dividen. Nilai REIT dari AFFO yield (AFFO ÷ harga), bukan P/E — P/E properti adalah lelucon akuntansi.",
        "Leverage properti Indonesia: bank membatasi LTV KPR, dan cicilan idealnya < 30–40% penghasilan. Untuk REIT, waspadai utang > 40% dari aset — apalagi berbunga floating: skenario triple kill 2020 = mal sepi (vacancy naik) + cicilan jalan + bunga naik. Bandingkan yield REIT dengan SBN 10Y: selisihnya = premi risiko properti yang kamu terima; spread menyempit = REIT kemahalan relatif.",
        "Aturan praktis: (1) valuasi REIT = AFFO yield vs SBN, dan harga vs NAV; (2) cek okupansi & WALE (rata-rata sisa kontrak sewa) — WALE pendek = risiko sewa turun; (3) utang > 40% atau bunga floating dominan = kurangi; (4) properti fisik = cek sertifikat, banjir, dan akses — yang tidak ada di spreadsheet.",
      ],
      formula: String.raw`\text{NAV/unit} = \frac{\text{nilai properti} - \text{utang}}{\text{unit}} \qquad \text{FFO} = \text{laba} + \text{depresiasi}`,
      formulaNote: "NAV/unit = nilai bersih per unit penyertaan; diskon = (NAV − harga) ÷ NAV. FFO = funds from operations — laba + kembali depresiasi (non-kas). AFFO = FFO − capex rutin = kas dividen yang riil. Contoh: properti Rp500 M − utang Rp200 M = Rp300 M ÷ 100 jt unit = NAV Rp3.000; harga Rp2.700 → diskon 10%.",
      tasks: [
        { id: "t1", text: "Hitung `nav` per unit" },
        { id: "t2", text: "Hitung `diskon_pct` vs harga pasar" },
      ],
      expected: "nav=3000  diskon_pct=10.0",
      hints: [
        "nav = (nilai_properti − utang) ÷ unit.",
        "diskon_pct = (nav − harga_pasar) ÷ nav × 100.",
      ],
      code: {
        starter: `nilai_properti = 500_000_000_000\nutang = 200_000_000_000\nunit = 100_000_000\nharga_pasar = 2_700\n\n# TULIS KODEMU\nnav = \ndiskon_pct = \n\nprint(f"nav={nav:.0f}  diskon_pct={diskon_pct:.1f}")`,
        lockLines: 4,
        solution: `nilai_properti = 500_000_000_000\nutang = 200_000_000_000\nunit = 100_000_000\nharga_pasar = 2_700\n\n# TULIS KODEMU\nnav = (nilai_properti - utang) / unit\ndiskon_pct = (nav - harga_pasar) / nav * 100\n\nprint(f"nav={nav:.0f}  diskon_pct={diskon_pct:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "nav", value: 3000, tol: 1, label: "`nav` seharusnya 3000", msg: "300 miliar ÷ 100 juta = Rp3.000 per unit." },
          { kind: "equal", task: "t2", name: "diskon_pct", value: 10.0, tol: 0.1, label: "`diskon_pct` seharusnya 10,0", msg: "(3000 − 2700) ÷ 3000 × 100 = 10%. Diskon — cari tahu kenapa." },
          { kind: "stdout_matches", task: "t2", pattern: "nav=3000\\s+diskon_pct=10\\.0", label: "`print` menampilkan dua angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "REIT dinilai dari AFFO yield & NAV. Utang > 40% = waspada.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "Total return properti = rental yield + apresiasi; investor profesional menghitung kas masuk, bukan cuma harga naik.",
        "Cap rate = NOI / harga = bahasa universal bandingkan properti; ukur asetnya, bukan struktur biayamu.",
        "Leverage memperbesar return ke dua arah: Pak Budi 6× untung, Pak Andi −64% dari penurunan 20%. Cap rate < bunga KPR = negative leverage.",
        "REIT = eksposur properti likuid + dividen jumbo; dinilai dari FFO (laba + depresiasi non-kas), bukan laba bersih. Harga sahamnya tetap fluktuatif & sensitif bunga.",
        "Empat risiko: vacancy, suku bunga, likuiditas, konsentrasi. Stress-test: bunga +3%, kosong 6 bulan, harga −20%.",
      ],
      next: { label: "E20 — Asuransi & Dana Pensiun", href: "/learn/e20-asuransi-dana-pensiun" },
      quiz: [
        {
          q: "Kenapa analis REIT memakai FFO (laba bersih + depresiasi), bukan laba bersih?",
          options: [
            { text: "Agar angkanya terlihat lebih besar", why: "Salah: ini soal akurasi, bukan kosmetik." },
            { text: "Depresiasi gedung adalah beban non-kas; gedung yang dirawat justru bisa naik nilainya — laba bersih akuntansi meremehkan kas yang dihasilkan", why: "Benar: FFO mendekati arus kas operasional REIT.", correct: true },
            { text: "Karena aturan pajak", why: "Salah: FFO adalah metrik analis, bukan aturan pajak." },
            { text: "Tidak ada alasan khusus", why: "Salah: ada — depresiasi properti ≠ penyusutan mesin." },
          ],
        },
        {
          q: "Bank sentral menaikkan suku bunga acuan 2%. Dampak paling mungkin ke REIT?",
          options: [
            { text: "Harga saham REIT naik karena dividennya naik", why: "Salah: dividen tidak otomatis naik; yang berubah adalah daya saingnya." },
            { text: "Tidak ada dampak", why: "Salah: REIT termasuk aset paling sensitif bunga." },
            { text: "Harga cenderung turun: yield obligasi naik membuat dividen REIT kalah menarik → investor pindah", why: "Benar: efek substitusi yield.", correct: true },
            { text: "Harga pasti naik karena properti lindung nilai inflasi", why: "Salah: lindung nilai jangka panjang ≠ imun terhadap guncangan bunga jangka pendek." },
          ],
        },
        {
          q: "Ruko Rp3 M, sewa Rp180 jt/thn, biaya Rp30 jt/thn, vacancy 20%. Yield efektif?",
          options: [
            { text: "6%", why: "Salah: itu sewa brosur tanpa vacancy dan biaya (180/3000)." },
            { text: "5%", why: "Salah: lupa vacancy — (180−30)/3000." },
            { text: "3,8% — (180×80% − 30)/3000", why: "Benar: yield jujur setelah vacancy dan biaya.", correct: true },
            { text: "4,4%", why: "Salah: cek lagi — 144−30=114; 114/3000=3,8%." },
          ],
        },
        {
          q: "Kapan properti langsung LEBIH tepat daripada REIT?",
          options: [
            { text: "Selalu — properti fisik lebih “nyata”", why: "Salah: “nyata” bukan argumen investasi." },
            { text: "Tidak pernah", why: "Salah: kontrol dan leverage KPR adalah keunggulan riil properti langsung." },
            { text: "Saat kamu punya modal besar, keahlian kelola, dan bisa memakai leverage secara disiplin (cap rate > bunga)", why: "Benar: keunggulan properti langsung = kontrol + leverage; syaratnya matematika masuk.", correct: true },
            { text: "Saat suku bunga sedang naik tajam", why: "Salah: itu saat terburuk untuk leverage properti." },
          ],
        },
      ],
    },
  ],
};
