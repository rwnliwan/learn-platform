import type { V2Lesson } from "../lib/types";

// Line chart: fee drag 20 tahun — dana A (fee 2,5%) vs dana B (fee 0,15%), return bruto 12%.
const FEE_SVG = `<svg viewBox='0 0 480 290' role='img' aria-label='Grafik garis 20 tahun: dana berbiaya 2,5 persen berakhir di 614 juta, dana berbiaya 0,15 persen di 939 juta, dari modal 100 juta.'>
<g stroke='var(--chart-grid)' stroke-width='1'><line x1='52' y1='30' x2='464' y2='30'/><line x1='52' y1='80' x2='464' y2='80'/><line x1='52' y1='130' x2='464' y2='130'/><line x1='52' y1='180' x2='464' y2='180'/><line x1='52' y1='230' x2='464' y2='230'/></g>
<g fill='var(--chart-text)' font-size='11' font-family='var(--font-ui)' text-anchor='end'><text x='46' y='34'>1000</text><text x='46' y='84'>750</text><text x='46' y='134'>500</text><text x='46' y='184'>250</text><text x='46' y='234'>0</text></g>
<g fill='var(--chart-text)' font-size='11' font-family='var(--font-ui)' text-anchor='middle'><text x='60' y='248'>0</text><text x='150' y='248'>5</text><text x='240' y='248'>10</text><text x='330' y='248'>15</text><text x='420' y='248'>20 thn</text></g>
<polyline points='60,210 150,198.5 240,180.4 330,152 420,107.3' fill='none' stroke='var(--c4)' stroke-width='2.5'/>
<polyline points='60,210 150,195.1 240,169 330,123.6 420,42.2' fill='none' stroke='var(--c2)' stroke-width='2.5'/>
<circle cx='420' cy='107.3' r='4' fill='var(--c4)'/><circle cx='420' cy='42.2' r='4' fill='var(--c2)'/>
<g font-size='12' font-family='var(--font-ui)' font-weight='600'>
<text x='428' y='110' fill='var(--c4)'>Rp614 jt</text>
<text x='428' y='45' fill='var(--c2)'>Rp939 jt</text>
</g>
<g font-size='12' font-family='var(--font-ui)'><rect x='60' y='258' width='10' height='10' fill='var(--c4)'/><text x='76' y='267' fill='var(--text)'>Dana A · fee 2,5%</text><rect x='210' y='258' width='10' height='10' fill='var(--c2)'/><text x='226' y='267' fill='var(--text)'>Dana B · fee 0,15%</text></g>
<text x='52' y='288' font-size='11' fill='var(--text-muted)' font-family='var(--font-ui)'>Modal Rp100 jt, return bruto 12%/thn, 20 tahun. Selisih akhir: Rp325 jt.</text>
</svg>`;

export const e22: V2Lesson = {
  slug: "e22-reksa-dana-etf",
  track: "Financial Markets",
  module: "Reksa Dana & ETF",
  title: "E22. Reksa Dana & ETF: Memilih Kendaraan Investasi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-fee",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Fee “kecil” 2,5% yang memakan Rp325 juta",
      prose: [
        "Dua reksa dana saham, return bruto SAMA: 12%/tahun selama 20 tahun. Dana A membebankan fee 2,5%/tahun; Dana B hanya 0,15%/tahun. “Selisih cuma 2,35% — tidak signifikan,” pikir Dimas, lalu memilih A karena iklannya meyakinkan.",
        "Twist-nya: modal Rp100 juta di Dana A menjadi Rp614 juta; di Dana B menjadi Rp939 juta. Selisihnya Rp325 juta — sepertiga kekayaan Dimas hilang bukan karena pasar jatuh, bukan karena manajernya bodoh, tapi karena fee yang “kecil” itu dimajemukkan 20 tahun. Biaya adalah satu-satunya komponen return yang pasti — dan satu-satunya yang bisa kamu kendalikan penuh sebelum berinvestasi.",
        "Lesson ini: cara kerja reksa dana & ETF sebagai “kendaraan”, anatomi biaya, dan cara memilih tanpa terjebak brosur return masa lalu.",
      ],
      tasks: [],
      note: {
        title: "Kilasan kilat prasyarat",
        body: "Tiga bahan baku investasi — pasar uang (jangka pendek, aman), obligasi (janji bayar + bunga), saham (klaim sisa perusahaan). Reksa dana dan ETF hanyalah KEMASAN: satu produk bisa berisi ketiganya. Dan ingat: return = kompensasi atas risiko yang diambil — bandingkan return hanya setelah disesuaikan risiko dan SETELAH biaya. Biaya itu pasti; return tidak.",
      },
      reference: "Kemasan (reksa dana/ETF) ≠ isi (saham/obligasi). Nilai kemasan dari biayanya.",
    },
    {
      id: "mekanik",
      eyebrow: "Langkah 2 · Lab: NAV & premium",
      title: "Di balik layar: NAV, kreasi, dan harga pasar",
      prose: [
        "Reksa dana konvensional: kamu membeli/menjual LANGSUNG ke manajer investasi pada harga NAB (nilai aktiva bersih) = (total aset − kewajiban) / jumlah unit — dihitung sekali sehari setelah pasar tutup. Tidak ada “tawar-menawar”; tidak bisa trading intraday.",
        "ETF: hibrida. Di pasar perdana, Authorized Participant (AP) menukar “keranjang” saham dengan unit ETF baru (creation) atau sebaliknya (redemption) — mekanisme ini menjaga harga pasar ETF menempel ke NAB. Di pasar sekunder, kamu jual-beli ETF di bursa seperti saham, kapan saja jam bursa buka. Jika harga pasar > NAB = premium (kamu membayar lebih mahal dari isi keranjangnya); < NAB = diskon.",
        "💡 Tips: ETF likuid yang mengikuti indeks besar biasanya premium/diskonnya tipis (< 0,5%). Premium 2%+ = kamu membayar “pajak ketidaksabaran” — cek dulu harga vs NAB (iNAV) sebelum beli, terutama ETF yang aset dasarnya tutup saat bursa kita buka.",
      ],
      formula: String.raw`\text{NAB} = \frac{\text{total aset} - \text{kewajiban}}{\text{jumlah unit}} \qquad \text{premium} = \frac{P_{\text{pasar}} - \text{NAB}}{\text{NAB}}`,
      formulaNote: "NAB = harga wajar per unit dari isi keranjangnya. P_pasar = harga yang kamu bayar di bursa. Premium positif = bayar lebih mahal dari isinya.",
      tasks: [
        { id: "t1", text: "Hitung `nav` (Rp) per unit" },
        { id: "t2", text: "Hitung `premium_diskon` (desimal) dari harga pasar Rp1.320" },
      ],
      expected: "NAV=1295  premium=+1.93%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“ETF harganya Rp1.320 — murah.” Harga nominal ETF tidak berarti apa-apa tanpa NAB-nya. Rp1.320 vs NAB Rp1.295 = kamu membayar premium 1,93% — setara 13 tahun fee ETF murah (0,15%)!",
      },
      hints: [
        "nav = (aset − kewajiban) / unit.",
        "premium_diskon = (harga_pasar_etf − nav) / nav.",
        "Format print memakai :+.2f — tanda + otomatis muncul.",
      ],
      code: {
        starter: `aset = 520_000_000_000      # Rp, total aset dana
kewajiban = 2_000_000_000    # Rp
unit = 400_000_000           # unit beredar
harga_pasar_etf = 1320       # Rp, harga di bursa

# TULIS KODEMU
nav =
premium_diskon =

print(f"NAV={nav:.0f}  premium={premium_diskon*100:+.2f}%")`,
        lockLines: 4,
        solution: `aset = 520_000_000_000      # Rp, total aset dana
kewajiban = 2_000_000_000    # Rp
unit = 400_000_000           # unit beredar
harga_pasar_etf = 1320       # Rp, harga di bursa

# TULIS KODEMU
nav = (aset - kewajiban) / unit
premium_diskon = (harga_pasar_etf - nav) / nav

print(f"NAV={nav:.0f}  premium={premium_diskon*100:+.2f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "nav", value: 1295, tol: 1e-9, label: "`nav` = Rp1.295", msg: "(520M − 2M) / 400jt = 1295." },
          { kind: "equal", task: "t2", name: "premium_diskon", value: 0.019305, tol: 0.0005, label: "`premium_diskon` ≈ +1,93%", msg: "(1320−1295)/1295 = 1,93% — mahal untuk ETF indeks." },
          { kind: "stdout_matches", task: "t2", pattern: "NAV=1295\\s+premium=\\+1\\.93%", label: "`print` sesuai format", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Reksa dana = transaksi di NAB harian. ETF = harga pasar bisa premium/diskon.",
    },
    {
      id: "biaya",
      eyebrow: "Langkah 3 · Lab: biaya & tracking error",
      title: "TER, fee drag, dan seberapa setia dana mengikut indeks",
      prose: [
        "TER (total expense ratio) = seluruh biaya tahunan dana: manajemen, kustodian, operasional, pemasaran — dinyatakan % dari aset. Dana aktif Indonesia umumnya 1,5–2,5%; ETF indeks 0,1–0,5%. Fee drag = efek majemuknya: nilai akhir = P × (1 + r − fee)^n. Fee 2,35% lebih tinggi selama 20 tahun bukan “2,35% lebih sedikit” — melainkan ratusan juta rupiah, seperti di cerita pembuka.",
        "Untuk dana indeks/ETF, metrik kejujuran kedua: tracking error = simpangan baku selisih return dana vs indeksnya (disetahunkan). ETF “indeks LQ45” dengan tracking error 3% = tidak benar-benar mengikuti LQ45 — entah karena biaya, kas menganggur, atau rebalancing yang malas.",
        "Cara membaca: sumbu X = tahun; sumbu Y = nilai portofolio (juta Rp); dua garis dari modal Rp100 juta yang sama dengan return bruto 12%/tahun yang sama — bedanya hanya fee.",
        "Interpretasi: garis berpisah makin lebar karena fee dimajemukkan — tahun ke-5 selisih baru Rp17 jt, tahun ke-20 menjadi Rp325 jt. Pelajaran visual: biaya kecil × waktu lama = perampok senyap terbesar portofoliomu.",
      ],
      figure: {
        svg: FEE_SVG,
        alt: "Grafik garis 20 tahun: dana berbiaya 2,5 persen berakhir di 614 juta, dana berbiaya 0,15 persen di 939 juta, dari modal 100 juta.",
        caption: "Fee drag 20 tahun: biaya “kecil” dimajemukkan menjadi Rp325 juta.",
      },
      formula: String.raw`\text{nilai akhir} = P \times (1 + r - \text{fee})^{n} \qquad \text{tracking error} = \sigma(R_{\text{dana}} - R_{\text{indeks}}) \times \sqrt{12}`,
      formulaNote: "P = modal awal, r = return bruto tahunan, n = tahun. Tracking error memakai data bulanan (×√12 untuk disetahunkan); makin kecil makin setia mengikuti indeks.",
      tasks: [
        { id: "t1", text: "Hitung `akhir_A` (fee 2,5%) dan `akhir_B` (fee 0,15%)" },
        { id: "t2", text: "Hitung `tracking_error` tahunan (desimal, bukan %)" },
      ],
      expected: "A=614.2jt  B=939.1jt  selisih=325.0jt  tracking_error=0.34%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung fee sebagai “2,5% × 20 tahun = 50% hilang”. Salah metode, benar intuisi: yang tepat = (1,095/1,1185)^20 — dana A berakhir 34,6% di bawah dana B. Jangan kurangi fee dari return secara linear dalam kepala; pangkatkan.",
      },
      hints: [
        "akhir = P * (1 + r - fee) ** n.",
        "selisih return bulanan: [d - i for d, i in zip(ret_dana, ret_idx)].",
        "tracking_error = st.stdev(selisih) * (12 ** 0.5) / 100 — data dalam %, bagi 100 ke desimal.",
      ],
      code: {
        starter: `import statistics as st
P, r, n = 100_000_000, 0.12, 20  # modal, return bruto, tahun

# TULIS KODEMU: nilai akhir dua dana
akhir_A =
akhir_B =

ret_dana = [1.2,-0.5,0.8,1.5,-0.3,0.9,1.1,-0.7,0.4,1.0,-0.2,0.6]  # %/bulan
ret_idx  = [1.1,-0.4,0.9,1.4,-0.2,1.0,1.0,-0.6,0.5,0.9,-0.1,0.7]

# TULIS KODEMU: tracking error tahunan (desimal)
tracking_error =

print(f"A={akhir_A/1e6:.1f}jt  B={akhir_B/1e6:.1f}jt  selisih={(akhir_B-akhir_A)/1e6:.1f}jt")
print(f"tracking_error={tracking_error*100:.2f}%")`,
        lockLines: 2,
        solution: `import statistics as st
P, r, n = 100_000_000, 0.12, 20  # modal, return bruto, tahun

# TULIS KODEMU: nilai akhir dua dana
akhir_A = P * (1 + r - 0.025) ** n
akhir_B = P * (1 + r - 0.0015) ** n

ret_dana = [1.2,-0.5,0.8,1.5,-0.3,0.9,1.1,-0.7,0.4,1.0,-0.2,0.6]  # %/bulan
ret_idx  = [1.1,-0.4,0.9,1.4,-0.2,1.0,1.0,-0.6,0.5,0.9,-0.1,0.7]

# TULIS KODEMU: tracking error tahunan (desimal)
selisih = [d - i for d, i in zip(ret_dana, ret_idx)]
tracking_error = st.stdev(selisih) * (12 ** 0.5) / 100

print(f"A={akhir_A/1e6:.1f}jt  B={akhir_B/1e6:.1f}jt  selisih={(akhir_B-akhir_A)/1e6:.1f}jt")
print(f"tracking_error={tracking_error*100:.2f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "akhir_A", value: 614161210.41, tol: 1000, label: "`akhir_A` ≈ Rp614,2 jt", msg: "100jt × 1,095^20." },
          { kind: "equal", task: "t1", name: "akhir_B", value: 939117143.56, tol: 1000, label: "`akhir_B` ≈ Rp939,1 jt", msg: "100jt × 1,1185^20." },
          { kind: "equal", task: "t2", name: "tracking_error", value: 0.0034, tol: 0.0005, label: "`tracking_error` ≈ 0,34%", msg: "ETF yang sangat setia pada indeksnya." },
          { kind: "stdout_matches", task: "t2", pattern: "A=614\\.2jt\\s+B=939\\.1jt\\s+selisih=325\\.0jt", label: "`print` baris 1 sesuai format", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t2", pattern: "tracking_error=0\\.34%", label: "`print` baris 2 sesuai format", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "TER = harga kemasan. Tracking error = kesetiaan dana indeks.",
    },
    {
      id: "aktif-pasif",
      eyebrow: "Langkah 4 · Aktif vs pasif",
      title: "Manajer bintang vs robot indeks",
      prose: [
        "Dana aktif: manajer memilih saham, riset, trading — berharap mengalahkan pasar. Dana pasif/indeks: meniru indeks (LQ45, S&P 500) dengan robot — berharap menyamai pasar semurah mungkin. Data SPIVA (S&P) konsisten: mayoritas dana aktif kalah dari indeksnya dalam 10–15 tahun — BUKAN karena manajernya bodoh, tapi karena fee 2% adalah rintangan yang harus dilampaui SETIAP tahun sebelum mulai “mengalahkan” apa pun.",
        "Kapan aktif masuk akal? Pasar yang tidak efisien (riset minim, misinformasi) memberi ruang bagi manajer terampil — sebagian pasar frontier/emerging. Kapan pasif menang telak? Pasar efisien + horizon panjang: fee rendah menang dengan pasti, “keahlian” menang dengan mungkin.",
        "🚨 Mitos: “Pilih dana dengan return 5 tahun tertinggi — buktinya jelas.” Yang benar: persistensi kinerja dana aktif sangat rendah — juara 5 tahun lalu jarang juara 5 tahun berikutnya (riset menunjukkan korelasi nyaris nol). Return masa lalu = jejak, bukan ramalan; yang persisten justru fee-nya.",
        "🚨 Mitos: “ETF pasti lebih murah dari reksa dana.” Yang benar: ETF INDEKS memang murah; tapi ETF tematik/leveraged bisa ber-TER 0,75–1%+ — lebih mahal dari reksa dana indeks. Murah tidaknya ditentukan strategi + TER, bukan label “ETF”.",
        "💡 Tips: biaya adalah satu-satunya prediktor return masa depan yang terbukti secara statistik (riset Morningstar): dana berbiaya termurah di kategorinya punya peluang tertinggi bertahan di kuartil atas. Saat ragu, pilih yang termurah.",
        "💡 Tips: cek “active share” dana aktif — jika isinya 90% mirip indeks tapi fee 2% (closet indexer), kamu membayar harga manajer bintang untuk robot indeks.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dana aktif menambah manager risk: gaya manajer bisa bergeser (style drift), manajer bintang bisa resign, dan dana bisa membesar hingga strateginya tidak muat (asset bloat). Risiko-risiko ini tidak ada di dana indeks.",
      },
      reference: "Mayoritas aktif kalah oleh fee-nya sendiri. Murah = keunggulan yang pasti.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 5 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang harga ETF dan biaya.",
      ],
      tasks: [],
      quiz: [
        {
          q: "ETF indeks diperdagangkan Rp1.320 sementara NAB-nya Rp1.295 (premium +1,93%). Kamu tetap beli karena “ingin masuk sekarang”. Apa artinya?",
          options: [
            { text: "Tidak masalah, harga wajar", why: "Salah: kamu membayar 1,93% di atas isi keranjangnya." },
            { text: "Kamu membayar pajak ketidaksabaran 1,93% — setara ±13 tahun fee ETF murah; lebih bijak tunggu premium menyempit atau pakai limit order dekat NAB", why: "Benar: premium = biaya tambahan yang bisa dihindari.", correct: true },
            { text: "Bagus, berarti ETF-nya laris", why: "Salah: “laris” tidak mengubah fakta kamu overpay." },
            { text: "NAB tidak relevan untuk ETF", why: "Salah: NAB = nilai wajar isi keranjangnya — justru patokan utama." },
          ],
        },
        {
          q: "Dana aktif A: return 5 tahun 14%/tahun, TER 2,2%. ETF indeks B: return 5 tahun 11%/tahun, TER 0,15%. Mana yang “terbukti lebih baik” untuk 10 tahun ke depan?",
          options: [
            { text: "A — return historisnya lebih tinggi", why: "Salah: persistensi kinerja aktif rendah; return masa lalu bukan ramalan." },
            { text: "B — selisih fee 2,05%/tahun adalah keunggulan pasti yang majemuk, sementara keunggulan return A belum tentu bertahan", why: "Benar: bertaruh pada yang pasti (biaya) vs yang mungkin (keahlian).", correct: true },
            { text: "Tidak bisa dibandingkan", why: "Salah: bisa — dengan kerangka ekspektasi, bukan kepastian." },
            { text: "Pilih yang iklannya paling meyakinkan", why: "Salah: iklan = biaya pemasaran yang kamu bayar via TER." },
          ],
        },
      ],
    },
    {
      id: "minicase-pilih-dana",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Tiga dana, satu pilihan: Rp200 juta untuk 15 tahun",
      prose: [
        "Kandidat untuk tujuan pensiun 15 tahun: (A) Reksa dana saham aktif — return 5 thn 13%/thn, TER 2,1%, AUM Rp8 T. (B) ETF indeks LQ45 — return 5 thn 10,5%/thn, TER 0,18%, tracking error 0,4%, AUM Rp3 T. (C) Reksa dana indeks — return 5 thn 10,3%/thn, TER 0,35%, AUM Rp500 M.",
        "Pertanyaan: (a) Hitung perkiraan nilai akhir tiap dana jika return bruto masa depan = 11%/thn (abaikan selisih return historis — anggap ketiganya menangkap pasar yang sama). (b) Mana pilihanmu dan kenapa? (c) Kapan kamu memilih A?",
        "Pembahasan: (a) A: 200jt × 1,089^15 ≈ Rp719 jt. B: 200jt × 1,1082^15 ≈ Rp934 jt. C: 200jt × 1,1065^15 ≈ Rp913 jt. (b) B: termurah + tracking error kecil + AUM besar (likuid, risiko tutup kecil). (c) Pilih A hanya jika kamu punya tesis spesifik: keyakinan pada manajer + pasar tidak efisien + kamu memonitor aktif — dan siap pindah jika underperform 3 tahun.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "AUM kecil (C: Rp500 M) = risiko likuidasi dana jika investor kabur — dana yang ditutup memaksamu realisasi di waktu yang salah. Ukuran dana adalah faktor risiko yang sering dilupakan.",
      },
      reference: "Hitung dengan return bruto SAMA — biarkan fee yang berbicara.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Empat skenario: kendaraan mana untuk tujuan apa?",
      prose: [
        "Dana darurat / parkir < 1 tahun → reksa dana pasar uang (atau deposito). Bukan ETF saham, bukan dana aktif — tujuanmu stabilitas nominal, bukan return.",
        "Pensiun 15–30 tahun → ETF/reksa dana indeks ekuitas berbiaya terendah. Waktu panjang = fee drag paling mematikan = pilih yang termurah dan setia (tracking error kecil).",
        "Butuh jual-beli intraday / taktis → ETF (likuiditas bursa). Reksa dana konvensional hanya bisa transaksi di NAB harian — tidak cocok untuk taktis.",
        "Yakin pada manajer/pasar spesifik → dana aktif BOLEH, dengan syarat: TER wajar (< 1,5%), active share tinggi (benar-benar aktif), AUM tidak bloat, dan review 3 tahunan tanpa ampun.",
        "Aturan 10 detik: cek TER dulu, return kemudian. Premium ETF > 1% = jangan beli pasar. Return 5 tahun terbaik = abaikan; fee termurah = pertimbangkan.",
      ],
      note: {
        title: "Intuisi: fee kecil = pencuri senyap",
        body: "Fee 2% per tahun terdengar sepele — selama 20 tahun ia bisa memakan sepertiga return-mu karena compounding bekerja dua arah: return berlipat, fee pun berlipat. Empat heuristik. Pertama: bandingkan TER (total expense ratio), bukan fee manajemen saja — TER = semua biaya; selisih 2,5% vs 0,25% selama 15 tahun pada Rp200 juta = ratusan juta rupiah hilang; hitung, jangan kira-kira. Kedua: manajer aktif harus mengalahkan benchmark SETELAH fee, konsisten — mayoritas gagal; “bintang 5 tahun lalu” bukan jaminan; persistence of performance itu mitos yang rapi. Ketiga: untuk ETF, yang dirasakan = tracking difference (return dana − indeks), bukan TER — kreasi/redemption, pajak dividen, dan cash drag ikut memakan; TER rendah + tracking buruk = mahal yang tersamar. Keempat: likuiditas ETF = likuiditas underlying + market maker — ETF sepi bukan berarti tidak bisa dijual, tetapi spread-nya melebar; cek AUM dan spread sebelum masuk ETF eksotis. Aturan 10 detiknya: tidak punya alasan kuat memilih aktif → pilih indeks termurah; alasan kuat = akses yang tidak bisa dibeli murah, atau keyakinan berbasis data — bukan brosur.",
      },
      tasks: [],
      reference: "Tujuan menentukan kendaraan; biaya menentukan pemenang.",
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
        "Reksa dana = transaksi ke manajer investasi di NAB harian; ETF = diperdagangkan di bursa, harga bisa premium/diskon vs NAB (mekanisme creation/redemption AP).",
        "TER = seluruh biaya tahunan; fee drag = P×(1+r−fee)^n — biaya kecil × waktu lama = ratusan juta. Biaya = satu-satunya prediktor return yang terbukti.",
        "Tracking error = kesetiaan dana indeks pada indeksnya; makin kecil makin jujur.",
        "Mayoritas dana aktif kalah dari indeksnya karena fee — bukan karena manajer bodoh. Pilih aktif hanya dengan tesis spesifik + monitoring.",
        "Return masa lalu ≠ ramalan; fee masa depan = kepastian. Cek TER dulu, return kemudian.",
      ],
      next: { label: "E1 — Struktur Pasar", href: "/v2/learn/e1-struktur-pasar" },
      quiz: [
        {
          q: "Apa beda utama transaksi reksa dana konvensional vs ETF?",
          options: [
            { text: "Tidak ada beda", why: "Salah: mekanismenya beda total." },
            { text: "Reksa dana: beli/jual ke MI di NAB sehari sekali. ETF: jual-beli di bursa kapan saja, harga bisa premium/diskon vs NAB", why: "Benar: inilah inti perbedaan kendaraan.", correct: true },
            { text: "ETF tidak punya NAB", why: "Salah: ETF punya NAB (iNAV) sebagai patokan wajar." },
            { text: "Reksa dana selalu lebih murah", why: "Salah: tergantung TER masing-masing." },
          ],
        },
        {
          q: "Dana P: TER 0,2%, tracking error 2,8%. Dana Q: TER 0,2%, tracking error 0,3%. Keduanya “indeks IDX30”. Pilih?",
          options: [
            { text: "P — tracking error besar = potensi return lebih", why: "Salah: tracking error besar pada dana indeks = tidak setia, bukan potensi." },
            { text: "Q — tracking error kecil = benar-benar mengikuti indeks yang dijanjikan; P menyimpan kejutan", why: "Benar: untuk dana indeks, kesetiaan adalah kejujuran.", correct: true },
            { text: "Sama saja, TER-nya sama", why: "Salah: TER sama tapi perilaku beda jauh." },
            { text: "Pilih yang AUM-nya lebih kecil agar lincah", why: "Salah: untuk dana indeks, AUM besar = lebih likuid & stabil." },
          ],
        },
        {
          q: "Kenapa “return 5 tahun tertinggi” adalah filter pemilihan dana yang buruk?",
          options: [
            { text: "Karena datanya palsu", why: "Salah: datanya benar — yang salah adalah menggunakannya sebagai ramalan." },
            { text: "Persistensi kinerja rendah: juara masa lalu jarang juara berikutnya; yang persisten justru fee-nya", why: "Benar: filter terbaik = biaya, bukan jejak return.", correct: true },
            { text: "Karena 5 tahun terlalu pendek", why: "Salah: bahkan 10 tahun pun persistensinya lemah." },
            { text: "Tidak buruk — itu filter terbaik", why: "Salah: riset SPIVA/Morningstar konsisten membantahnya." },
          ],
        },
        {
          q: "Kapan dana AKTIF layak dipertimbangkan serius?",
          options: [
            { text: "Selalu — manajer profesional pasti menang", why: "Salah: mayoritas kalah dari indeksnya setelah fee." },
            { text: "Tidak pernah sama sekali", why: "Salah: terlalu absolut — ada kondisi di mana aktif masuk akal." },
            { text: "Pasar tidak efisien + tesis spesifik pada manajer/strategi + TER wajar + monitoring berkala dan siap keluar", why: "Benar: aktif = taruhan yang harus terus dibuktikan, bukan keyakinan.", correct: true },
            { text: "Saat iklannya paling besar", why: "Salah: iklan besar = TER besar yang kamu bayar." },
          ],
        },
      ],
    },
  ],
};
