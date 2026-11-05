import type { V2Lesson } from "../lib/types";

// Bar chart: funding ratio tiga dana pensiun fiktif (%) — sehat, waspada, kritis.
const FUNDING_SVG = `<svg viewBox='0 0 480 270' role='img' aria-label='Diagram batang funding ratio: Dana A 112 persen, Dana B 92 persen, Dana C 68 persen. Garis ambang 100 persen.'>
<g stroke='var(--chart-grid)' stroke-width='1'><line x1='48' y1='30' x2='464' y2='30'/><line x1='48' y1='80' x2='464' y2='80'/><line x1='48' y1='130' x2='464' y2='130'/><line x1='48' y1='180' x2='464' y2='180'/><line x1='48' y1='220' x2='464' y2='220'/></g>
<g fill='var(--chart-text)' font-size='11' font-family='var(--font-ui)' text-anchor='end'><text x='42' y='34'>120%</text><text x='42' y='84'>90%</text><text x='42' y='134'>60%</text><text x='42' y='184'>30%</text><text x='42' y='224'>0%</text></g>
<line x1='48' y1='63.3' x2='464' y2='63.3' stroke='var(--text-muted)' stroke-width='1.5' stroke-dasharray='6 4'/>
<text x='458' y='56' font-size='11' fill='var(--text-muted)' font-family='var(--font-ui)' text-anchor='end'>ambang 100%</text>
<g font-size='12' font-family='var(--font-ui)' text-anchor='middle'>
<rect x='90' y='47.3' width='70' height='172.7' fill='var(--c2)'/><text x='125' y='38' fill='var(--text)' font-weight='600'>112%</text><text x='125' y='238' fill='var(--chart-text)'>Dana A</text>
<rect x='210' y='80' width='70' height='140' fill='var(--c5)'/><text x='245' y='70' fill='var(--text)' font-weight='600'>92%</text><text x='245' y='238' fill='var(--chart-text)'>Dana B</text>
<rect x='330' y='116.7' width='70' height='103.3' fill='var(--c4)'/><text x='365' y='107' fill='var(--text)' font-weight='600'>68%</text><text x='365' y='238' fill='var(--chart-text)'>Dana C</text>
</g>
<text x='48' y='262' font-size='11' fill='var(--text-muted)' font-family='var(--font-ui)'>Funding ratio = aset / kewajiban pensiun. Di bawah 100% = janji lebih besar dari simpanan.</text>
</svg>`;

export const e20: V2Lesson = {
  slug: "e20-asuransi-dana-pensiun",
  track: "Financial Markets",
  module: "Asuransi & Pensiun",
  title: "E20. Asuransi & Dana Pensiun: Bisnis yang Menjual Perlindungan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-premi",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Bayar Rp6 juta, klaim Rp400 juta — kok perusahaannya tidak bangkrut?",
      prose: [
        "Bu Rina membayar premi asuransi kesehatan Rp6 juta/tahun. Tahun lalu ia operasi dan asuransinya membayar Rp400 juta. “Perusahaan asuransi rugi Rp394 juta dari saya!” pikirnya. Secara individu, benar. Tapi perusahaan itu punya 10.000 nasabah seperti Bu Rina: premi terkumpul 10.000 × Rp6 juta = Rp60 miliar.",
        "Twist-nya: tidak semua nasabah klaim. Jika peluang klaim Rp400 juta adalah 1% per tahun, ekspektasi klaim = 1% × Rp400 juta × 10.000 = Rp40 miliar. Sisa Rp20 miliar menutup biaya operasi — dan sisanya adalah laba. Asuransi tidak untung karena “menolak klaim”; ia untung karena hukum bilangan besar membuat total klaim bisa diprediksi dengan presisi, lalu premi dipatok sedikit di atasnya. Ditambah satu sumber laba tersembunyi: premi diterima di awal tahun, klaim dibayar belakangan — uang menganggur itu (float) diinvestasikan.",
        "Lesson ini: matematika di balik bisnis perlindungan — pooling risiko, combined ratio, float — plus saudara kembarnya: dana pensiun, bisnis yang menjual janji masa depan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: asuransi menjual kepastian, membeli ketidakpastian",
        body: "Bisnis asuransi membalik arus kas normal: terima uang dulu, tahu biayanya belakangan — dan tetap untung karena hukum bilangan besar. Lima heuristik. Pertama: float adalah pinjaman gratis — premi mengendap berbulan-bulan sebelum menjadi klaim; diinvestasikan, ia mesin laba kedua setelah underwriting; Buffett membangun kerajaannya di atas float. Kedua: combined ratio < 100% = underwriting untung; di atas itu perusahaan hidup dari hasil investasi — rapuh saat pasar jatuh; cek rasionya sebelum percaya premi murah. Ketiga: yang ditakuti bukan satu klaim besar, melainkan klaim yang berkorelasi — satu banjir = ribuan klaim sekaligus; bencana menghancurkan asumsi “acak independen” yang menjadi fondasi pricing. Keempat: skala adalah segalanya — 10.000 nasabah menaklukkan keacakan (risiko ∝ 1/√n), 100 nasabah masih judi; jangan tertipu “asuransi” kecil tanpa skala. Kelima: dana pensiun = janji 30 tahun — cek funded ratio (aset ÷ kewajiban); di bawah 100% = janji yang belum dibayar; janji tanpa dana = harapan. Aturan 10 detiknya: beli proteksi untuk risiko yang bisa membangkrutkanmu (kematian, sakit kritis), tanggung sendiri yang hanya mengganggu (gadget) — asuransi untuk katastrofe, bukan untuk kenyamanan.",
      },
      reference: "Laba asuransi = premi − klaim − biaya + hasil investasi float.",
    },
    {
      id: "pooling",
      eyebrow: "Langkah 2 · Lab: hukum bilangan besar",
      title: "10.000 nasabah menaklukkan keacakan",
      prose: [
        "Kilasan kilat (konsep instrumen keuangan): instrumen keuangan = kontrak klaim atas arus kas masa depan — saham (klaim sisa perusahaan), obligasi (janji bayar + bunga). Polis asuransi pun kontrak: premi hari ini ditukar janji bayar saat musibah terjadi. Dana pensiun membeli instrumen-instrumen ini untuk membayar janji pensiun puluhan tahun ke depan.",
        "Satu nasabah = judi: klaim Rp50 juta atau nol, tidak bisa diprediksi. Seratus nasabah = masih berisik. Sepuluh ribu nasabah = total klaim tahunan nyaris pasti mendekati ekspektasi. Inilah hukum bilangan besar (law of large numbers): rata-rata sampel konvergen ke ekspektasi saat n membesar, dengan simpangan yang menyusut ∝ 1/√n. Premi wajar = peluang × severity (besar klaim) + loading (margin & biaya).",
        "💡 Tips: loading bukan “cari untung semena-mena” — ia menutup biaya akuisisi, operasi, dan buffer modal untuk tahun sial (bencana membuat klaim berkorelasi: satu banjir = ribuan klaim sekaligus — inilah yang ditakuti asuransi, bukan satu klaim besar).",
      ],
      formula: String.raw`\text{premi wajar} = \underbrace{p \times S}_{\text{ekspektasi klaim}} + \text{loading} \qquad \sigma_{\bar{X}} = \frac{\sigma}{\sqrt{n}}`,
      formulaNote: "p = peluang klaim per periode, S = severity (besar klaim), σ = simpangan baku klaim per nasabah, n = jumlah nasabah. Makin besar n, makin stabil rata-rata klaim per nasabah — risiko perusahaan menyusut meski risiko tiap nasabah tetap.",
      tasks: [
        { id: "t1", text: "Hitung `premi_wajar` (Rp) per nasabah" },
        { id: "t2", text: "Jalankan simulasi dan bandingkan `rata2_klaim` n=100 vs n=10000 terhadap premi wajar" },
      ],
      expected: "premi_wajar=1.00jt  n=100→0.500jt  n=1000→0.900jt  n=10000→0.905jt",
      note: {
        title: "Sering salah",
        body: "“n=100 hasilnya 0,5jt — berarti premi 1jt kemahalan 2× lipat!” Salah: dengan n kecil, hasil simulasi masih lotre. Perusahaan asuransi mematok premi dari ekspektasi (1jt), bukan dari satu hasil sampel kecil. Bandingkan n=10000 (0,905jt) — sudah menempel ke ekspektasi.",
      },
      hints: [
        "premi_wajar = p * severity.",
        "Fungsi simulasi sudah jadi — cukup panggil untuk tiap n.",
        "Perhatikan: makin besar n, rata2_klaim makin dekat ke premi_wajar.",
      ],
      code: {
        starter: `import random
random.seed(42)  # kunci: hasil simulasi deterministik

p = 0.02               # peluang klaim per nasabah per tahun
severity = 50_000_000  # Rp per klaim

# TULIS KODEMU: premi wajar per nasabah
premi_wajar =

def simulasi(n):
    klaim = sum(severity for _ in range(n) if random.random() < p)
    return klaim / n  # rata-rata klaim per nasabah

print(f"premi_wajar={premi_wajar/1e6:.2f}jt")
for n in [100, 1000, 10000]:
    rata2 = simulasi(n)
    print(f"n={n}  rata2_klaim={rata2/1e6:.3f}jt")`,
        lockLines: 5,
        solution: `import random
random.seed(42)  # kunci: hasil simulasi deterministik

p = 0.02               # peluang klaim per nasabah per tahun
severity = 50_000_000  # Rp per klaim

# TULIS KODEMU: premi wajar per nasabah
premi_wajar = p * severity

def simulasi(n):
    klaim = sum(severity for _ in range(n) if random.random() < p)
    return klaim / n  # rata-rata klaim per nasabah

print(f"premi_wajar={premi_wajar/1e6:.2f}jt")
for n in [100, 1000, 10000]:
    rata2 = simulasi(n)
    print(f"n={n}  rata2_klaim={rata2/1e6:.3f}jt")`,
        checks: [
          { kind: "equal", task: "t1", name: "premi_wajar", value: 1000000, tol: 1, label: "`premi_wajar` = Rp1 jt", msg: "0,02 × 50jt = Rp1.000.000 per nasabah per tahun." },
          { kind: "stdout_matches", task: "t2", pattern: "premi_wajar=1\\.00jt", label: "`print` premi wajar sesuai format", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t2", pattern: "n=10000\\s+rata2_klaim=0\\.905jt", label: "Simulasi n=10000 ≈ ekspektasi", msg: "Dengan seed 42, n=10000 memberi 0,905jt — bukti hukum bilangan besar." },
        ],
      },
      reference: "Premi = ekspektasi klaim + loading. Skala (n besar) = stabilitas.",
    },
    {
      id: "combined-ratio",
      eyebrow: "Langkah 3 · Combined ratio & float",
      title: "Dua mesin laba: underwriting dan float",
      prose: [
        "Combined ratio = loss ratio (klaim / premi) + expense ratio (biaya / premi). Di bawah 100% = laba underwriting: perusahaan untung bahkan sebelum menginvestasikan sepeser pun. Di atas 100% = rugi underwriting — tapi perusahaan masih bisa untung total berkat float.",
        "Float = uang premi yang sudah diterima tapi belum dibayarkan sebagai klaim. Asuransi jiwa dan dana pensiun memegang float bertahun-tahun — bahkan puluhan tahun. Warren Buffett membangun Berkshire Hathaway di atas float asuransi: “pinjaman” tanpa bunga dan tanpa jatuh tempo dari nasabah. Syaratnya: disiplin underwriting — float dari bisnis yang rugi underwriting terus-menerus = gali lubang tutup lubang.",
        "Contoh tiga perusahaan (Rp miliar): A — premi 120, klaim 78, beban 30 → combined 90%, laba underwriting 12. B — premi 120, klaim 84, beban 38 → combined 101,7%, rugi underwriting 2 — tapi hasil investasi float 8 → total +6. C — premi 120, klaim 70, beban 25 → combined 79,2%, mesin underwriting terbaik.",
      ],
      formula: String.raw`\text{combined ratio} = \frac{\text{klaim}}{\text{premi}} + \frac{\text{biaya}}{\text{premi}} \qquad \text{laba total} = \underbrace{\text{premi} - \text{klaim} - \text{biaya}}_{\text{underwriting}} + \underbrace{\text{hasil float}}_{\text{investasi}}`,
      formulaNote: "Loss ratio mengukur akurasi pricing risiko; expense ratio mengukur efisiensi operasi. Keduanya dalam persen premi — makin kecil, makin baik.",
      tasks: [
        { id: "t1", text: "Hitung `cr_a` dan `uw_a` (Rp miliar) perusahaan A" },
        { id: "t2", text: "Hitung `total_b` = laba underwriting B + hasil float Rp8 miliar" },
      ],
      expected: "cr_a=90.0%  uw_a=12  total_b=6",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Combined ratio B 101,7% — perusahaan jelek, hindari.” Belum tentu: B masih mencetak laba total +6 dari float. Yang berbahaya adalah combined ratio > 100% TANPA hasil investasi yang menutupinya, bertahun-tahun.",
      },
      hints: [
        "cr = (klaim + beban) / premi; uw = premi − klaim − beban.",
        "A: (78+30)/120 dan 120−78−30.",
        "B: uw dulu (negatif!), lalu tambah 8.",
      ],
      code: {
        starter: `# Rp miliar: (premi, klaim, beban)
a = (120, 78, 30)
b = (120, 84, 38)
float_b = 8  # hasil investasi float, Rp miliar

# TULIS KODEMU
cr_a =
uw_a =
total_b =

print(f"cr_a={cr_a*100:.1f}%  uw_a={uw_a:.0f}  total_b={total_b:.0f}")`,
        lockLines: 4,
        solution: `# Rp miliar: (premi, klaim, beban)
a = (120, 78, 30)
b = (120, 84, 38)
float_b = 8  # hasil investasi float, Rp miliar

# TULIS KODEMU
cr_a = (a[1] + a[2]) / a[0]
uw_a = a[0] - a[1] - a[2]
total_b = (b[0] - b[1] - b[2]) + float_b

print(f"cr_a={cr_a*100:.1f}%  uw_a={uw_a:.0f}  total_b={total_b:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cr_a", value: 0.9, tol: 1e-9, label: "`cr_a` = 90%", msg: "(78+30)/120 = 0,9." },
          { kind: "equal", task: "t1", name: "uw_a", value: 12, tol: 1e-9, label: "`uw_a` = 12", msg: "120−78−30 = 12 M laba underwriting." },
          { kind: "equal", task: "t2", name: "total_b", value: 6, tol: 1e-9, label: "`total_b` = 6", msg: "(120−84−38) + 8 = −2 + 8 = 6 M. Float menyelamatkan B." },
          { kind: "stdout_matches", task: "t2", pattern: "cr_a=90\\.0%\\s+uw_a=12\\s+total_b=6", label: "`print` sesuai format", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Combined < 100% = mesin underwriting sehat. Float = mesin kedua.",
    },
    {
      id: "dana-pensiun",
      eyebrow: "Langkah 4 · Dana pensiun",
      title: "Janji 30 tahun ke depan: DB vs DC",
      prose: [
        "Dana pensiun menjual janji: “pensiunmu aman”. Dua desain: Defined Benefit (DB) — manfaat PASTI (mis. 70% gaji terakhir), iurannya yang menyesuaikan; risiko ada di pengelola. Defined Contribution (DC) — iuran pasti (mis. 10% gaji), manfaatnya yang mengikuti hasil investasi; risiko ada di kamu. Tren global: DB ditinggalkan karena mahal dan berisiko bagi perusahaan; DC jadi standar.",
        "Kesehatan dana pensiun diukur funding ratio = aset / kewajiban (nilai kini janji pensiun). Di atas 100% = aman; 80–100% = waspada (butuh iuran tambahan / return lebih tinggi); di bawah 80% = kritis. Jebakannya: kewajiban dihitung dengan asumsi diskonto — turunkan asumsi bunga 1% dan kewajiban bisa melonjak 15–20%.",
        "Kenapa ini penting buat pasar finansial? Dana pensiun + asuransi jiwa = investor institusi terbesar dunia — pembeli utama obligasi jangka panjang, saham, dan REIT. Aliran dana mereka menggerakkan harga aset — obligasi, ekuitas, dan REIT — yang kamu pelajari di track ini.",
        "Cara membaca: tinggi batang = funding ratio tiga dana pensiun fiktif; garis putus-putus = ambang 100% (janji = simpanan).",
        "Interpretasi: Dana A (112%) punya buffer — bisa menahan guncangan pasar. Dana B (92%) defisit 8%: butuh suntikan iuran atau return ekstra. Dana C (68%) kritis: tanpa perbaikan, janji pensiunnya tidak terbayar penuh. Pelajaran: janji “pasti” hanya sekuat funding ratio-nya.",
        "🚨 Mitos: “Asuransi = investasi, jadi premi tidak hangus.” Yang benar: premi asuransi murni membeli PROTEKSI — seperti membayar satpam; tidak ada maling bukan berarti gaji satpam “hangus sia-sia”. Produk unit-link yang mencampur asuransi + investasi justru berbiaya tinggi dan return-nya kalah dari investasi langsung + asuransi murni terpisah.",
        "🚨 Mitos: “Dana pensiun pasti aman, kan diawasi.” Yang benar: diawasi ≠ didanai penuh. Banyak dana pensiun global underfunded puluhan tahun; “aman” harus dibuktikan dengan funding ratio, bukan logo pengawas.",
        "💡 Tips: beli asuransi untuk risiko yang TIDAK sanggup kamu tanggung sendiri (kematian pencari nafkah, sakit kritis, kebakaran rumah) — bukan untuk risiko kecil yang bisa kamu tanggung (cukup dana darurat). Asuransi = transfer risiko bencana, bukan dompet kedua.",
      ],
      figure: {
        svg: FUNDING_SVG,
        alt: "Diagram batang funding ratio: Dana A 112 persen, Dana B 92 persen, Dana C 68 persen. Garis ambang 100 persen.",
        caption: "Funding ratio tiga dana pensiun: aman, waspada, kritis.",
      },
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Longevity risk: orang hidup makin lama = janji pensiun makin mahal. Dana DB yang memakai tabel mortalitas lama bisa underfunded tanpa sadar — risiko yang baru terlihat 20 tahun kemudian.",
      },
      reference: "DB = manfaat pasti (risiko pengelola); DC = iuran pasti (risiko kamu). Funding ratio = kebenaran.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 5 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang pooling dan combined ratio.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Kenapa perusahaan asuransi dengan 10.000 nasabah jauh lebih stabil daripada dengan 100 nasabah (premi per orang sama)?",
          options: [
            { text: "Karena nasabah banyak = premi terkumpul lebih besar", why: "Salah: skala premi ikut skala klaim — bukan itu sumber stabilitasnya." },
            { text: "Hukum bilangan besar: rata-rata klaim per nasabah konvergen ke ekspektasi, simpangan menyusut ∝ 1/√n", why: "Benar: risiko agregat bisa diprediksi meski tiap individu acak.", correct: true },
            { text: "Karena nasabah banyak jarang klaim", why: "Salah: peluang klaim per orang tetap sama." },
            { text: "Tidak ada bedanya", why: "Salah: simulasi menunjukkan n=10000 menempel ke ekspektasi, n=100 masih lotre." },
          ],
        },
        {
          q: "Combined ratio 103% tapi hasil investasi float menutupinya sehingga laba total positif. Kesimpulan?",
          options: [
            { text: "Perusahaan sehat, tidak ada masalah", why: "Salah: underwriting rugi = pricing atau seleksi risiko bermasalah; float hanya menambal." },
            { text: "Perusahaan bangkrut", why: "Salah: laba total masih positif — belum bangkrut." },
            { text: "Waspada: mesin underwriting bocor; andalkan float terus-menerus = rapuh saat pasar jatuh", why: "Benar: float berfluktuasi mengikuti pasar; underwriting harus sehat sendiri.", correct: true },
            { text: "Naikkan premi saja, selesai", why: "Salah: menaikkan premi bisa mengusir nasabah sehat (seleksi merugikan) — masalahnya bisa di pricing ATAU seleksi." },
          ],
        },
      ],
    },
    {
      id: "minicase-tua",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Dana pensiun PT TUA: janji vs simpanan",
      prose: [
        "Dana pensiun PT TUA (skema DB): aset Rp800 miliar, kewajiban (nilai kini janji) Rp1.000 miliar → funding ratio 80%. Arus tahunan: iuran masuk Rp50 miliar, manfaat keluar Rp70 miliar (defisit kas Rp20 miliar/tahun, ditutup dari hasil investasi). Asumsi return aset 7%/tahun.",
        "Pertanyaan: (a) Berapa funding ratio-nya dan statusnya? (b) Jika return hanya 4% (bukan 7%), apa yang terjadi pada defisit? (c) Tiga opsi perbaikan apa yang tersedia, dan siapa yang “membayar” tiap opsi?",
        "Pembahasan: (a) 800/1000 = 80% — zona waspada menuju kritis. (b) Kewajiban tumbuh mengikuti diskonto; aset tumbuh 4% sementara manfaat keluar 70/tahun — defisit melebar tiap tahun, funding ratio melorot (simulasi kasar: dalam ~10 tahun bisa < 70% tanpa tindakan). (c) Naikkan iuran (dibayar perusahaan/karyawan aktif), potong manfaat masa depan (dibayar pensiunan — politis), kejar return lebih tinggi (dibayar pengambil risiko — bisa backfire). Tidak ada opsi gratis: someone always pays.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Underfunding pensiun = utang tersembunyi perusahaan. Analis kredit menambahkan defisit pensiun ke utang saat menilai kelayakan — janji pensiun adalah kewajiban finansial, bukan catatan kaki.",
      },
      reference: "80% = waspada. Perbaikan selalu ada yang membayar: iuran, manfaat, atau risiko.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Empat skenario: beli proteksi atau tanggung sendiri?",
      prose: [
        "Risiko bencana yang tidak sanggup kamu tanggung (kematian pencari nafkah, sakit kritis, rumah kebakaran) → beli asuransi murni (term life / kesehatan). Murah karena kamu hanya membeli proteksi, bukan “investasi”.",
        "Risiko kecil yang sanggup ditanggung (HP rusak, ban bocor) → tanggung sendiri via dana darurat. Premi asuransi untuk risiko kecil = kalah melawan ekspektasi matematis (ada loading!).",
        "Ditawari unit-link (asuransi + investasi) → tolak polanya, pisahkan: beli term life murni + investasikan sisanya di instrumen murah. Campuran = biaya ganda, transparansi setengah.",
        "Memilih dana pensiun (DC) → pastikan iuran ≥ 10–15% penghasilan dan alokasi agresif saat muda (saham/REIT), konservatif mendekati pensiun. Dana pensiun yang “aman” tapi return 3% selama 30 tahun = pensiun yang tidak cukup.",
        "Aturan 10 detik: asuransi = transfer risiko bencana, bukan tabungan. Proteksi dulu (term), investasi kemudian (terpisah). Funding ratio < 80% = janji yang perlu dipertanyakan.",
      ],
      tasks: [],
      reference: "Bencana → asuransi murni. Kecil → dana darurat. Campuran → pisahkan.",
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
        "Asuransi untung dari hukum bilangan besar (total klaim terprediksi) + premi di atas ekspektasi + hasil investasi float.",
        "Premi wajar = peluang × severity + loading; stabilitas naik ∝ √n — skala adalah segalanya.",
        "Combined ratio = loss ratio + expense ratio; < 100% = laba underwriting. Float = mesin laba kedua (uang nasabah tanpa bunga).",
        "Dana pensiun DB = manfaat pasti (risiko pengelola); DC = iuran pasti (risiko kamu). Funding ratio = aset/kewajiban; < 80% = kritis.",
        "Beli asuransi untuk bencana yang tak sanggup ditanggung; risiko kecil tanggung sendiri. Unit-link: pisahkan proteksi dan investasi.",
      ],
      next: { label: "E21 — Investment Banking", href: "/learn/e21-investment-banking" },
      quiz: [
        {
          q: "Apa itu float dalam bisnis asuransi?",
          options: [
            { text: "Uang kembalian premi", why: "Salah: bukan kembalian." },
            { text: "Premi yang sudah diterima tapi klaimnya belum dibayar — “pinjaman” tanpa bunga yang bisa diinvestasikan", why: "Benar: inilah mesin laba kedua Buffett.", correct: true },
            { text: "Dana cadangan wajib regulator", why: "Salah: itu modal minimum, konsep berbeda." },
            { text: "Keuntungan dari menolak klaim", why: "Salah: menolak klaim sah = bunuh diri reputasi & hukum." },
          ],
        },
        {
          q: "Dana pensiun DB punya funding ratio 75%. Artinya?",
          options: [
            { text: "Aman, masih di atas 50%", why: "Salah: ambangnya 100%, bukan 50%." },
            { text: "Kritis: aset hanya menutup 75% janji; butuh iuran tambahan, potong manfaat, atau return lebih tinggi — seseorang harus membayar", why: "Benar: tidak ada perbaikan gratis.", correct: true },
            { text: "Tidak masalah karena DB dijamin perusahaan", why: "Salah: “dijamin perusahaan” hanya sekuat perusahaan + funding-nya." },
            { text: "Pensiunan langsung kehilangan 25% manfaatnya", why: "Salah: 75% adalah rasio agregat kini, bukan potongan otomatis." },
          ],
        },
        {
          q: "Kapan sebaiknya TIDAK membeli asuransi?",
          options: [
            { text: "Risiko kematian pencari nafkah utama", why: "Salah: ini justru risiko bencana yang wajib ditransfer." },
            { text: "Risiko kecil yang sanggup ditanggung sendiri (dana darurat cukup) — premi mengandung loading sehingga ekspektasi matematisnya merugikanmu", why: "Benar: asuransi untuk bencana, bukan untuk hal sepele.", correct: true },
            { text: "Risiko sakit kritis tanpa tabungan besar", why: "Salah: ini bencana finansial — butuh proteksi." },
            { text: "Risiko kebakaran rumah satu-satunya", why: "Salah: bencana — transfer risikonya." },
          ],
        },
        {
          q: "Bencana banjir membuat ribuan nasabah klaim sekaligus. Risiko apa ini bagi asuransi?",
          options: [
            { text: "Risiko biasa, sudah terdiversifikasi", why: "Salah: inilah yang TIDAK terdiversifikasi — klaim berkorelasi." },
            { text: "Risiko korelasi/katastrofe: hukum bilangan besar melemah saat klaim tidak independen — butuh reasuransi & buffer modal", why: "Benar: satu peristiwa = ribuan klaim sekaligus.", correct: true },
            { text: "Bukan risiko perusahaan asuransi", why: "Salah: ini risiko eksistensial mereka." },
            { text: "Hanya risiko reputasi", why: "Salah: ini risiko solvabilitas — uangnya yang jebol." },
          ],
        },
      ],
    },
  ],
};
