import type { V2Lesson } from "../lib/types";

// Grouped bars: revenue vs laba bersih PT Maju Jaya Abadi, T1–T3 (Rp miliar).
const MODEL_SVG = `<svg viewBox='0 0 480 290' role='img' aria-label='Batang grup: pendapatan 1344, 1478, 1597 miliar dan laba bersih 323, 361, 393 miliar untuk tahun 1 sampai 3.'>
<g stroke='var(--chart-grid)' stroke-width='1'><line x1='52' y1='30' x2='464' y2='30'/><line x1='52' y1='80' x2='464' y2='80'/><line x1='52' y1='130' x2='464' y2='130'/><line x1='52' y1='180' x2='464' y2='180'/><line x1='52' y1='230' x2='464' y2='230'/></g>
<g fill='var(--chart-text)' font-size='11' font-family='var(--font-ui)' text-anchor='end'><text x='46' y='34'>1600</text><text x='46' y='84'>1200</text><text x='46' y='134'>800</text><text x='46' y='184'>400</text><text x='46' y='234'>0</text></g>
<g fill='var(--chart-text)' font-size='11' font-family='var(--font-ui)' text-anchor='middle'><text x='140' y='248'>T1</text><text x='260' y='248'>T2</text><text x='380' y='248'>T3</text></g>
<g>
<rect x='100' y='62' width='34' height='168' fill='var(--c2)'/><rect x='138' y='190' width='34' height='40' fill='var(--c4)'/>
<rect x='220' y='46' width='34' height='184' fill='var(--c2)'/><rect x='258' y='185' width='34' height='45' fill='var(--c4)'/>
<rect x='340' y='31' width='34' height='199' fill='var(--c2)'/><rect x='378' y='181' width='34' height='49' fill='var(--c4)'/>
</g>
<g font-size='11' font-family='var(--font-ui)' fill='var(--text)' text-anchor='middle'>
<text x='117' y='56'>1.344</text><text x='155' y='184'>323</text>
<text x='237' y='40'>1.478</text><text x='275' y='179'>361</text>
<text x='357' y='25'>1.597</text><text x='395' y='175'>393</text>
</g>
<g font-size='12' font-family='var(--font-ui)'><rect x='60' y='258' width='10' height='10' fill='var(--c2)'/><text x='76' y='267' fill='var(--text)'>Pendapatan</text><rect x='180' y='258' width='10' height='10' fill='var(--c4)'/><text x='196' y='267' fill='var(--text)'>Laba bersih</text></g>
<text x='52' y='288' font-size='11' fill='var(--text-muted)' font-family='var(--font-ui)'>Rp miliar. Margin bersih stabil ±24%: model konsisten, bukan sekadar tumbuh.</text>
</svg>`;

export const e23: V2Lesson = {
  slug: "e23-excel-financial-modeling",
  track: "Financial Markets",
  module: "Tooling Analis",
  title: "E23. Financial Modeling di Excel: Membangun Model yang Bisa Diaudit",
  estMinutes: 70,
  steps: [
    {
      id: "cerita-model-sesat",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Model yang seimbang tapi menyesatkan: Rp1,8 triliun yang tidak pernah ada",
      prose: [
        "Rina, analis junior di sebuah sekuritas Jakarta, begadang tiga malam membangun model valuasi PT Nusantara Foods. Modelnya “seimbang”: semua sheet terhubung, tidak ada error `#REF!`, tombol F9 menghitung mulus. Rekomendasi: BELI, target harga 40% di atas harga pasar. Komite investasi menyetujuinya.",
        "Twist-nya terungkap dua minggu kemudian saat seniornya menekan Ctrl+` (tampilkan rumus): di sel pertumbuhan tahun ke-3 tertulis `=B5*1.25` — angka 25% diketik manual di tengah rumus, bukan merujuk ke sel asumsi. Saat Rina mengubah asumsi pertumbuhan di sheet input dari 12% menjadi 8%, tahun ke-3 tidak ikut berubah. Target harga yang “40% upside” itu bertumpu pada angka hantu Rp1,8 triliun pendapatan yang tidak pernah ada dalam asumsi resminya.",
        "Lesson ini: cara membangun model keuangan yang bisa diaudit — arsitektur tiga zona, proyeksi laporan laba rugi 3 tahun yang konsisten, checks yang menangkap kesalahan, dan jebakan klasik yang membuat model terlihat benar padahal salah.",
      ],
      tasks: [],
      note: {
        title: "Kilasan kilat prasyarat",
        body: "Laporan laba rugi: pendapatan − beban pokok = laba kotor; − beban operasi = EBIT (laba operasi); − pajak = laba bersih; laba bersih / jumlah saham = EPS. Model keuangan = terjemahan asumsi bisnis (pertumbuhan, margin) menjadi angka-angka ini, tahun demi tahun, dengan rumus yang bisa dilacak.",
      },
      reference: "Model yang baik bukan yang rumit — melainkan yang setiap angkanya bisa ditanya “dari mana?” dan dijawab dalam 10 detik.",
    },
    {
      id: "arsitektur-tiga-zona",
      eyebrow: "Langkah 2 · Konsep",
      title: "Arsitektur tiga zona: INPUT, CALC, OUTPUT",
      prose: [
        "Model profesional dibagi tiga zona yang dipisah sheet atau blok warna. Zona INPUT (biasanya font biru): semua asumsi dan angka mentah — pertumbuhan, margin, tarif pajak, jumlah saham. Hanya di sinilah angka boleh diketik manual. Zona CALC: murni rumus yang merujuk ke INPUT atau ke sel CALC lain — tidak ada satu pun angka diketik di sini. Zona OUTPUT: ringkasan untuk keputusan — tabel proyeksi, grafik, dan target harga.",
        "Aturan emasnya satu kalimat: hardcode hanya di INPUT. Begitu angka muncul di tengah rumus CALC (seperti `*1.25` milik Rina), model kehilangan sifat terpentingnya: sensitivitas. Mengubah asumsi tidak lagi mengubah hasil — dan kamu tidak akan sadar sampai seseorang mengaudit.",
        "💡 Tips: beri warna konsisten — biru untuk input (boleh diubah), hitam untuk rumus (jangan sentuh), hijau untuk output/link antar-sheet. Pewarnaan ini adalah “type system”-nya Excel: reviewer langsung tahu sel mana yang aman diubah.",
        "Konvensi kedua: satu rumus per baris yang bisa di-copy ke kanan (antar tahun) tanpa edit. Rumus `=B5*(1+$C$2)` memakai `$` (absolute reference) untuk asumsi agar saat di-drag ke kanan, yang bergerak hanya tahunnya, bukan asumsinya. Model yang setiap tahunnya ditulis manual bukan model — itu tabel ketikan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Model saya benar karena angkanya masuk akal.” Angka yang masuk akal bisa dihasilkan model yang rusak — Rina membuktikannya. Yang membedakan model benar dari model “kelihatan benar” bukan hasilnya, melainkan apakah setiap sel CALC hanya berisi rumus yang merujuk ke INPUT.",
      },
      reference: "INPUT biru (asumsi) → CALC hitam (rumus saja) → OUTPUT hijau (ringkasan). Satu angka di CALC = model cacat.",
    },
    {
      id: "lab-proyeksi",
      eyebrow: "Langkah 3 · Lab: proyeksi 3 tahun",
      title: "Membangun proyeksi laba rugi PT Maju Jaya Abadi",
      prose: [
        "Sekarang bangun sendiri mesinnya. PT Maju Jaya Abadi: pendapatan tahun berjalan Rp1.200 miliar, asumsi pertumbuhan 12% / 10% / 8%, margin kotor 45%, beban operasi Rp180 miliar tumbuh 6%/tahun, pajak 22%, 500 juta saham beredar. Setiap baris di bawah ini adalah satu “baris Excel”: pendapatan tahun ke-t = pendapatan tahun ke-(t−1) × (1 + g).",
        "Pemetaan ke praktik Excel: `rev1 = rev0 * (1 + g)` ≡ rumus `=B5*(1+$C$2)` yang di-drag ke kanan; `round(..., 2)` ≡ format dua desimal; blok audit di akhir ≡ fitur “Trace Precedents” + pencarian manual angka di zona CALC.",
        "Cara membaca chart di bawah: sumbu X = tahun proyeksi; batang biru = pendapatan, batang oranye = laba bersih (skala sama, Rp miliar).",
        "Interpretasi: pendapatan tumbuh 1.344 → 1.597 sementara laba bersih 323 → 393 — margin bersih stabil di ±24%. Model yang sehat menunjukkan konsistensi internal: pertumbuhan tidak “membeli” laba dengan margin yang runtuh diam-diam.",
      ],
      figure: {
        svg: MODEL_SVG,
        alt: "Batang grup: pendapatan 1344, 1478, 1597 miliar dan laba bersih 323, 361, 393 miliar untuk tahun 1 sampai 3.",
        caption: "Proyeksi 3 tahun: pertumbuhan pendapatan dengan margin bersih yang konsisten.",
      },
      formula: String.raw`\text{Rev}_t = \text{Rev}_{t-1} \times (1 + g_t) \qquad \text{EBIT}_t = \text{Rev}_t \times m_{\text{kotor}} - \text{Opex}_t \qquad \text{EPS}_t = \frac{\text{Net}_t}{\text{Saham}}`,
      formulaNote: "Rev = pendapatan; g_t = asumsi pertumbuhan tahun t (dari INPUT); m_kotor = margin kotor; Opex = beban operasi; Net = laba bersih = EBIT × (1 − pajak); Saham = jumlah saham beredar.",
      tasks: [
        { id: "t1", text: "Hitung `rev1`, `rev2`, `rev3` (Rp miliar, 2 desimal)" },
        { id: "t2", text: "Hitung `ebit1`, `ebit2`, `ebit3` dari margin kotor 45% dan opex tahunan" },
        { id: "t3", text: "Hitung `net1..net3` (pajak 22%) dan `eps1..eps3` (500 juta saham)" },
        { id: "t4", text: "Audit: hitung `keras` = jumlah rumus CALC yang mengandung angka hardcode" },
      ],
      expected: "rev3=1596.67  ebit3=504.11  net3=393.21  eps3=0.79  keras=5/6",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menulis `rev2 = 1478.4` langsung (angka jadi) alih-alih `rev2 = rev1 * (1 + g[1])`. Hasilnya sama hari ini — tapi saat asumsi g berubah minggu depan, modelmu diam sementara model yang benar ikut bergerak. Di lab ini, nilai “meniru Excel yang benar” hanya bila setiap baris adalah rumus dari baris/asumsi lain.",
      },
      hints: [
        "rev1 = round(rev0 * (1 + g[0]), 2); rev2 memakai rev1, bukan rev0.",
        "opex_t = round(opex_{t-1} * (1 + g_opex), 2); ebit = rev*m - opex.",
        "net = ebit*(1-pajak); eps = net/saham; bulatkan 2 desimal.",
        "Audit: hapus referensi sel dulu dengan re.sub(r\"\\$?[A-Z]{1,3}\\$?\\d+\", \"\", f), lalu cari sisa digit.",
      ],
      code: {
        starter: `import re
# INPUT (zona biru): hanya angka di sini
rev0 = 1200.0          # Rp miliar, pendapatan tahun berjalan
g = [0.12, 0.10, 0.08] # asumsi pertumbuhan 3 tahun
margin_kotor = 0.45
opex0 = 180.0          # Rp miliar
g_opex = 0.06
pajak = 0.22
saham = 500.0          # juta lembar

# TULIS KODEMU: zona CALC — rumus, bukan angka jadi
rev1 =
rev2 =
rev3 =
opex1 =
opex2 =
opex3 =
ebit1 =
ebit2 =
ebit3 =
net1 =
net2 =
net3 =
eps1 =
eps2 =
eps3 =

# TULIS KODEMU: audit zona CALC — deteksi angka hardcode
rumus = ["=B5*(1+$C$2)", "=C7*0.45-D9", "=E11*(1-C3)", "=F13/F2", "=B5+150", "=D9*(1+E2)"]
bersih =
keras =

print(f"rev3={rev3:.2f}  ebit3={ebit3:.2f}  net3={net3:.2f}  eps3={eps3:.2f}  keras={keras}/6")`,
        lockLines: 10,
        solution: `import re
# INPUT (zona biru): hanya angka di sini
rev0 = 1200.0          # Rp miliar, pendapatan tahun berjalan
g = [0.12, 0.10, 0.08] # asumsi pertumbuhan 3 tahun
margin_kotor = 0.45
opex0 = 180.0          # Rp miliar
g_opex = 0.06
pajak = 0.22
saham = 500.0          # juta lembar

# TULIS KODEMU: zona CALC — rumus, bukan angka jadi
rev1 = round(rev0 * (1 + g[0]), 2)
rev2 = round(rev1 * (1 + g[1]), 2)
rev3 = round(rev2 * (1 + g[2]), 2)
opex1 = round(opex0 * (1 + g_opex), 2)
opex2 = round(opex1 * (1 + g_opex), 2)
opex3 = round(opex2 * (1 + g_opex), 2)
ebit1 = round(rev1 * margin_kotor - opex1, 2)
ebit2 = round(rev2 * margin_kotor - opex2, 2)
ebit3 = round(rev3 * margin_kotor - opex3, 2)
net1 = round(ebit1 * (1 - pajak), 2)
net2 = round(ebit2 * (1 - pajak), 2)
net3 = round(ebit3 * (1 - pajak), 2)
eps1 = round(net1 / saham, 2)
eps2 = round(net2 / saham, 2)
eps3 = round(net3 / saham, 2)

# TULIS KODEMU: audit zona CALC — deteksi angka hardcode
rumus = ["=B5*(1+$C$2)", "=C7*0.45-D9", "=E11*(1-C3)", "=F13/F2", "=B5+150", "=D9*(1+E2)"]
bersih = [re.sub(r"\\$?[A-Z]{1,3}\\$?\\d+", "", f) for f in rumus]
keras = sum(1 for c in bersih if re.search(r"\\d", c))

print(f"rev3={rev3:.2f}  ebit3={ebit3:.2f}  net3={net3:.2f}  eps3={eps3:.2f}  keras={keras}/6")`,
        checks: [
          { kind: "equal", task: "t1", name: "rev3", value: 1596.67, tol: 0.01, label: "`rev3` = 1.596,67", msg: "1200×1,12=1344; ×1,10=1478,4; ×1,08=1596,67." },
          { kind: "equal", task: "t2", name: "ebit3", value: 504.11, tol: 0.01, label: "`ebit3` = 504,11", msg: "1596,67×0,45 − 214,38 = 504,11 (2 desimal)." },
          { kind: "equal", task: "t3", name: "net3", value: 393.21, tol: 0.01, label: "`net3` = 393,21", msg: "504,11×(1−0,22) = 393,21." },
          { kind: "equal", task: "t3", name: "eps3", value: 0.79, tol: 0.005, label: "`eps3` = 0,79", msg: "393,21/500 = 0,79 (Rp miliar per juta saham = Rp)." },
          { kind: "equal", task: "t4", name: "keras", value: 5, tol: 0, label: "`keras` = 5 dari 6 rumus", msg: "Hanya =F13/F2 yang bersih dari angka." },
          { kind: "stdout_matches", task: "t4", pattern: "rev3=1596\\.67\\s+ebit3=504\\.11\\s+net3=393\\.21\\s+eps3=0\\.79\\s+keras=5/6", label: "`print` sesuai format", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Satu baris = satu rumus dari INPUT. Audit CALC: tidak ada digit di luar referensi sel.",
    },
    {
      id: "checks-keseimbangan",
      eyebrow: "Langkah 4 · Konsep",
      title: "Checks: sabuk pengaman model",
      prose: [
        "Model tanpa checks seperti mobil tanpa sabuk pengaman — kamu baru tahu pentingnya saat tabrakan. Tiga checks wajib di setiap model proyeksi. Pertama, checks pertumbuhan: pertumbuhan implisit antar tahun harus sama dengan asumsi g yang kamu masukkan — hitung `rev3/rev2 − 1` dan pastikan = 8%, bukan 25% seperti kasus Rina.",
        "Kedua, checks margin: EBIT margin = EBIT/revenue harus berada dalam rentang wajar historis perusahaan. Model kita: 414/1344 = 30,8% di T1 naik ke 504,11/1596,67 = 31,6% di T3 — wajar untuk ekspansi skala. Margin yang melonjak dari 30% ke 60% dalam setahun tanpa penjelasan = sinyal ada rumus yang salah, bukan bisnis yang ajaib.",
        "Ketiga, checks keseimbangan akuntansi: laba bersih harus = (pendapatan − COGS − opex) × (1 − pajak). Di Excel ini diimplementasikan sebagai sel “check” yang bernilai 0 bila seimbang: `=laba_bersih − (pendapatan−cogs−opex)*(1−pajak)`. Praktik profesional: kumpulkan semua checks di satu blok “Error Checks” dengan conditional formatting merah bila ≠ 0 — reviewer cukup melirik satu blok, bukan seluruh workbook.",
        "💡 Tips: checks terbaik adalah yang punya nilai ekspektasi pasti (nol, atau sama dengan asumsi). Check yang berbunyi “margin terlihat wajar” bukan check — itu opini. Check yang berbunyi “sel C40 − C12 = 0” adalah check.",
      ],
      formula: String.raw`\text{check}_g = \frac{\text{Rev}_t}{\text{Rev}_{t-1}} - 1 - g_t = 0 \qquad \text{check}_{\text{bal}} = \text{Net} - (\text{Rev} - \text{COGS} - \text{Opex})(1-\tau) = 0`,
      formulaNote: "check_g memastikan pertumbuhan hasil sama dengan asumsi; check_bal memastikan laba bersih konsisten dengan komponennya; τ (tau) = tarif pajak.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membuat checks setelah model “selesai dan benar”. Checks yang ditulis belakangan cenderung disetel agar lolos (toleransi diperlebar, sel dikecualikan). Tulis checks BERSAMAAN dengan rumus — ia adalah spesifikasi, bukan hiasan akhir.",
      },
      reference: "Tiga checks wajib: pertumbuhan = asumsi, margin dalam rentang historis, identitas akuntansi = 0.",
    },
    {
      id: "jebakan-model",
      eyebrow: "Langkah 5 · Konsep",
      title: "Tiga jebakan yang membunuh model diam-diam",
      prose: [
        "Jebakan pertama: circular reference. Contoh klasik — beban bunga dihitung dari kas rata-rata, tetapi kas akhir tergantung laba bersih, yang tergantung beban bunga. Excel berputar: bunga → laba → kas → bunga. Model “menghitung” tanpa error tetapi angkanya adalah hasil iterasi yang belum tentu konvergen ke jawaban benar. Solusi: putus lingkarannya — hitung bunga dari kas AWAL periode (atau jadwal utang terpisah), bukan kas akhir.",
        "Jebakan kedua: hardcode di tengah rumus — dosa Rina. Deteksinya: di Excel tekan Ctrl+` untuk menampilkan semua rumus, lalu cari angka yang bukan bagian dari alamat sel. Aturan praktis: bila kamu tidak bisa menjelaskan dari sel mana sebuah angka berasal dalam 5 detik, ia hardcode.",
        "Jebakan ketiga: format campur. Persen diketik sebagai 12 (bukan 12% atau 0,12), mata uang tercampur Rp miliar dan Rp juta dalam satu kolom, atau tanggal sebagai teks. Model menghitung “benar” atas input yang salah arti: pertumbuhan 12 (bukan 12%) membuat pendapatan meledak 13×. Solusi: satu kolom = satu satuan, tulis satuannya di header (\"Rp miliar\", bukan di benakmu).",
        "Ketiganya punya kesamaan: tidak menghasilkan error. Excel tidak akan berteriak — ia hanya menghitung dengan patuh apa yang kamu tulis, termasuk kesalahanmu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Tidak ada error = model benar.” Error Excel (#DIV/0!, #REF!) justru kabar baik — ia terlihat. Pembunuh sesungguhnya adalah model yang menghitung mulus dengan logika salah: circular reference yang “konvergen”, hardcode yang “masuk akal”, format yang “kelihatannya persen”. Audit model = mencari yang tidak berteriak.",
      },
      reference: "Circular ref → putus lingkaran via kas awal. Hardcode → Ctrl+` + cari digit. Format campur → satu kolom satu satuan.",
    },
    {
      id: "peta-model",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Model seperti apa untuk kebutuhan apa",
      prose: [
        "Skenario 1 — Screening cepat 20 saham: pakai model satu halaman (pendapatan, margin, EPS 3 tahun seperti lab ini). Alasan: keputusan screening butuh arah, bukan presisi; 80% nilai dari 20% usaha. Contoh nyata: filter awal universe LQ45 sebelum deep-dive.",
        "Skenario 2 — Rekomendasi resmi sekuritas (BUY/SELL + target harga): butuh model 3-statement (laba rugi + neraca + arus kas terhubung) + DCF atau valuasi relatif. Alasan: target harga yang dipublikasikan harus bisa dipertahankan di depan komite dan regulator — model satu halaman tidak cukup.",
        "Skenario 3 — Perusahaan dengan utang besar / siklus komoditas: wajib jadwal utang terpisah dan skenario (base/bull/bear). Alasan: di sinilah circular reference mengintai (bunga ↔ kas) dan satu skenario tunggal menipu.",
        "Skenario 4 — Startup pra-profit / turnaround: JANGAN pakai model laba — pakai model unit economics (CAC, LTV, burn multiple) dan runway kas. Alasan: memproyeksikan “laba tahun ke-3” untuk perusahaan yang belum punya produk = fiksi berformat Excel.",
        "Aturan praktis 10 detik: sebelum membuka Excel, jawab tiga hal — (1) keputusan apa yang akan diambil dari model ini? (2) seberapa besar kesalahan yang masih bisa ditoleransi? (3) siapa yang akan mengauditnya? Jawabannya menentukan seberapa rumit model yang layak dibangun.",
      ],
      tasks: [],
      reference: "Kompleksitas model mengikuti keputusan, bukan gengsi. Screening = 1 halaman; rekomendasi resmi = 3-statement; utang besar = skenario; pra-profit = unit economics.",
    },
    {
      id: "minicase-audit",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Audit 15 menit atas model rekanmu",
      prose: [
        "Kamu menerima model valuasi PT Sinar Kemas dari rekan analis. Fakta: pendapatan T0 Rp800 miliar; asumsi pertumbuhan di INPUT: 10%/tahun flat 3 tahun; margin kotor 40%; opex Rp120 miliar +5%/tahun; pajak 22%. Output model: pendapatan T3 = Rp1.165 miliar, laba bersih T3 = Rp296 miliar, rekomendasi BELI.",
        "Pertanyaan 1: apakah pendapatan T3 konsisten dengan asumsi? Pertanyaan 2: bila opex T3 di model tertulis Rp139 miliar, apakah konsisten? Pertanyaan 3: apa dua hal pertama yang kamu cek dengan Ctrl+`?",
        "Pembahasan: (1) 800×1,1^3 = 1.064,8 — bukan 1.165. Selisih ~Rp100 miliar: kemungkinan hardcode pertumbuhan di salah satu tahun (mis. 15% diketik manual). (2) 120×1,05^3 = 138,9 ≈ Rp139 miliar — konsisten, opex bukan masalahnya. (3) Pertama: semua sel CALC yang mengandung digit di luar alamat sel (cari `*1.15` atau `+50` yang tidak merujuk INPUT). Kedua: blok checks — apakah ada sel check pertumbuhan yang seharusnya merah tapi “diperbaiki” dengan mengubah toleransinya.",
        "Pelajaran mini-case: audit model bukan membaca ulang semua rumus — melainkan menguji tiga titik (pertumbuhan, margin, checks) dan membiarkan ketidakkonsistenan menunjuk pelakunya.",
      ],
      tasks: [],
      reference: "Uji 800×1,1^3 = 1.064,8 vs 1.165 → ada yang tidak beres. Biarkan angka yang bicara.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca alasannya bahkan untuk jawaban yang kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Arsitektur tiga zona: INPUT (angka, biru) → CALC (rumus saja, hitam) → OUTPUT (ringkasan, hijau).",
        "Satu baris proyeksi = satu rumus dari asumsi: Rev_t = Rev_{t−1} × (1+g); EBIT = Rev × margin − opex.",
        "Tiga checks wajib: pertumbuhan hasil = asumsi; margin dalam rentang historis; identitas akuntansi = 0.",
        "Tiga jebakan sunyi: circular reference, hardcode di tengah rumus, format campur — tidak ada yang memicu error.",
        "Kompleksitas model mengikuti keputusan: screening 1 halaman, rekomendasi resmi 3-statement, utang besar pakai skenario.",
        "Kapan TIDAK memodel laba: pra-profit — pakai unit economics dan runway kas.",
      ],
      quiz: [
        {
          q: "Di mana satu-satunya tempat angka boleh diketik manual dalam model yang bisa diaudit?",
          options: [
            { text: "Zona INPUT (asumsi)", why: "Benar: INPUT adalah satu-satunya zona hardcode. CALC murni rumus, OUTPUT murni ringkasan.", correct: true },
            { text: "Zona CALC, asal angkanya kecil", why: "Salah: angka kecil yang hardcode sama merusaknya — ia memutus sensitivitas model terhadap asumsi." },
            { text: "Zona OUTPUT, untuk pembulatan", why: "Salah: OUTPUT merujuk ke CALC. Pembulatan dilakukan via format sel, bukan angka ketikan." },
            { text: "Di mana saja asal konsisten", why: "Salah: “konsisten” tidak bisa diverifikasi. Aturan zona membuat audit 15 menit menjadi mungkin." },
          ],
        },
        {
          q: "Model Rina: asumsi g=12% di INPUT, tetapi sel tahun ke-3 berisi `=B5*1.25`. Apa konsekuensinya?",
          options: [
            { text: "Tidak ada — 25% masih dalam rentang wajar", why: "Salah: masalahnya bukan kewajaran angka, melainkan putusnya hubungan asumsi→hasil." },
            { text: "Mengubah asumsi di INPUT tidak mengubah tahun ke-3; target harga bertumpu pada angka hantu", why: "Benar: hardcode memutus sensitivitas — model “hidup” di tahun 1–2 tetapi mati di tahun ke-3.", correct: true },
            { text: "Excel menampilkan error #VALUE!", why: "Salah: inilah bahayanya — tidak ada error sama sekali. Model menghitung dengan patuh." },
            { text: "Hanya memengaruhi format tampilan", why: "Salah: ini memengaruhi angka, bukan format — Rp1,8 triliun pendapatan hantu." },
          ],
        },
        {
          q: "Beban bunga dihitung dari kas AKHIR, kas akhir tergantung laba, laba tergantung beban bunga. Solusi yang benar?",
          options: [
            { text: "Biarkan Excel iterasi sampai konvergen", why: "Salah: iterasi circular reference belum tentu konvergen ke jawaban ekonomi yang benar." },
            { text: "Hitung bunga dari kas AWAL periode atau buat jadwal utang terpisah", why: "Benar: memutus lingkaran — bunga menjadi fungsi dari sesuatu yang sudah diketahui, bukan yang sedang dihitung.", correct: true },
            { text: "Naikkan jumlah iterasi maksimum Excel", why: "Salah: itu mengobati gejala (tidak konvergen), bukan penyakit (logika melingkar)." },
            { text: "Sembunyikan baris kas agar tidak terlihat", why: "Salah: menyembunyikan masalah bukan menyelesaikannya — auditor akan menemukannya." },
          ],
        },
        {
          q: "Check pertumbuhan yang baik berbunyi seperti apa?",
          options: [
            { text: "“Margin terlihat wajar”", why: "Salah: itu opini, bukan check — tidak ada nilai ekspektasi yang pasti." },
            { text: "Sel check: `=rev3/rev2-1-g3` harus = 0 (dengan toleransi kecil)", why: "Benar: check yang baik punya nilai ekspektasi pasti (nol) dan menunjuk sel yang salah bila gagal.", correct: true },
            { text: "“Model sudah direview senior”", why: "Salah: review manusia penting, tetapi bukan pengganti check mekanis yang jalan tiap F9." },
            { text: "Bandingkan dengan model kompetitor", why: "Salah: itu validasi eksternal yang berguna, tetapi bukan check internal konsistensi." },
          ],
        },
        {
          q: "Kapan model proyeksi laba 3 tahun seperti di lab ini TIDAK layak dipakai?",
          options: [
            { text: "Screening cepat 20 saham LQ45", why: "Salah: justru inilah kasus idealnya — cepat, konsisten, cukup untuk filter awal." },
            { text: "Startup pra-profit yang belum punya produk", why: "Benar: memproyeksikan laba untuk perusahaan tanpa revenue = fiksi. Pakai unit economics & runway kas.", correct: true },
            { text: "Rekomendasi resmi dengan target harga", why: "Salah: bisa dipakai sebagai fondasi, tetapi harus dilengkapi 3-statement dan valuasi — bukan “tidak layak”." },
            { text: "Perusahaan manufaktur mapan", why: "Salah: perusahaan mapan dengan histori stabil adalah kasus terbaik model seperti ini." },
          ],
        },
      ],
      next: { label: "E24 — WPPE & Ekosistem Pasar Modal Indonesia", href: "/v2/learn/e24-wppe-pasar-modal" },
    },
  ],
};
