import type { V2Lesson } from "../lib/types";

// Bar: days-to-liquidate per posisi vs garis batas 5 hari — dua posisi melewati batas.
const DTL_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Diagram batang: days-to-liquidate Saham A 0,8 hari, Saham B 12 hari, Obligasi C 15 hari, dengan garis batas 5 hari.">
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<g><rect x="90" y="238" width="90" height="12" fill="var(--c2)"/><text x="135" y="228" fill="var(--chart-text)">Saham A</text><text x="135" y="264" fill="var(--chart-text)">0,8 hari</text></g>
<g><rect x="235" y="106" width="90" height="144" fill="#e11d48"/><text x="280" y="96" fill="var(--chart-text)">Saham B</text><text x="280" y="180" fill="#fff" font-size="14" font-weight="600">12,0</text><text x="280" y="264" fill="var(--chart-text)">hari</text></g>
<g><rect x="380" y="70" width="90" height="180" fill="#e11d48"/><text x="425" y="60" fill="var(--chart-text)">Obligasi C</text><text x="425" y="162" fill="#fff" font-size="14" font-weight="600">15,0</text><text x="425" y="264" fill="var(--chart-text)">hari</text></g>
<line x1="60" y1="190" x2="520" y2="190" stroke="var(--c3)" stroke-width="2" stroke-dasharray="6,4"/>
<text x="515" y="182" fill="var(--c3)" font-size="10" text-anchor="end">batas 5 hari</text>
</g>
<line x1="60" y1="250" x2="540" y2="250" stroke="var(--chart-text)" stroke-width="1"/>
<text x="280" y="272" font-size="13" font-family="var(--font-ui)" text-anchor="middle" fill="var(--text)" font-weight="600">Dua posisi tidak bisa keluar dalam seminggu</text>
<text x="280" y="290" font-size="11" font-family="var(--font-ui)" text-anchor="middle" fill="var(--chart-text)">Menjual Rp60 miliar ke pasar Rp25 miliar/hari = 12 hari — atau harga yang hancur.</text>
</svg>`;

export const pmE3: V2Lesson = {
  slug: "pm-e3-liquidity-risk",
  track: "Portfolio Management",
  module: "Praktik Profesional",
  title: "PME3 — Liquidity Risk: Saat Portofolio Tak Bisa Dijual",
  estMinutes: 65,
  steps: [
    {
      id: "cerita-dana-likuid",
      eyebrow: "Langkah 1 · Cerita",
      title: "“Dana Likuid” yang tidak likuid",
      prose: [
        "Sebuah reksa dana terbuka bernama — ironisnya — “X Dana Likuid”. Saat pasar panik dan 15% investornya meminta penarikan dalam seminggu, manajer investasi harus menjual. Saham blue chip-nya ludes dalam dua hari tanpa masalah. Lalu ia menyentuh saham lapis duanya: posisi Rp60 miliar di saham yang volume harian rata-ratanya hanya Rp25 miliar. Penjualan hari pertama menekan harga 4%; hari kedua 5% lagi. NAV ikut jatuh — investor yang tadinya tenang ikut menarik dananya. Spiral dimulai.",
        "Dana itu tidak rugi karena asetnya jelek — laporan keuangannya sehat. Ia rugi karena tidak bisa MENJUAL tanpa menghancurkan harga jualnya sendiri. Setiap rupiah penarikan memaksa penjualan yang menekan NAV, yang memicu penarikan berikutnya: liquidity spiral, versi reksa dana dari bank run.",
        "Twist-nya: prospektus dana itu mencantumkan risiko pasar, risiko kredit, risiko operasional — tetapi risiko likuiditasnya hanya satu baris generik. Padahal yang membunuh dana itu bukan risiko yang tertulis tebal, melainkan yang nyaris tak disebut. Likuiditas bukan SIFAT ASET (“saham ini likuid”) — ia sifat TRANSAKSI: seberapa besar yang ingin kau jual, seberapa cepat, di pasar seperti apa. Lesson ini tentang mengukur dan mengelola risiko itu sebelum antrean penarikan terbentuk.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan perbedaan likuiditas aset vs likuiditas transaksi; (2) menghitung days-to-liquidate sebuah posisi dari ADV dan batas partisipasi; (3) menjelaskan mekanisme liquidity spiral dan redemption run pada dana terbuka; (4) menyusun liquidity bucketing sederhana dalam IPS; (5) memutuskan kapan menahan, membatasi, atau menutup pintu penarikan.",
        "Daftar isi: 1) Cerita dana likuid · 2) Modal dasar: spread & kedalaman · 3) Konsep: days-to-liquidate · 4) Rumus DTL + spiral · 5) Lab: hitung DTL & simulasi antrean redemption · 6) Chart DTL · 7) Peta keputusan · 8) Mini-case: dana Rp500 miliar · 9) Checkpoint.",
        "Metadata: ±65 menit · 1 lab Python · 1 chart · 6 kuis · 1 mini-case. Prasyarat: tidak ada.",
      ],
      tasks: [],
      reference: "Likuiditas bukan sifat aset — ia sifat transaksi.",
    },
    {
      id: "modal-spread",
      eyebrow: "Langkah 2 · Modal dasar (ringkas, self-contained)",
      title: "Spread dan kedalaman: dua wajah likuiditas pasar",
      prose: [
        "Fondasi — likuiditas pasar punya dua dimensi. BID-ASK SPREAD: selisih harga jual vs beli — “pajak” yang kau bayar setiap kali bertransaksi. Spread 0,1% di saham likuid vs 2% di saham sepi = biaya masuk-keluar yang berbeda 20 kali lipat. KEDALAMAN (DEPTH): berapa banyak yang bisa dibeli/dijual tanpa menggerakkan harga — diukur dari volume harian rata-rata (ADV, average daily volume) dan antrean order.",
        "Keduanya bisa menipumu secara terpisah: spread sempit TETAPI depth tipis (banyak saham lapis dua — 1 lot terlihat murah, 1 juta lot menghancurkan harga), atau depth tebal TETAPI spread melebar saat panik (bahkan blue chip — market maker menarik diri). Analis likuiditas mengukur keduanya, tidak pernah hanya satu.",
        "Lesson ini menjawab: bagaimana mengubah “likuid/tidak” yang kabur menjadi ANGKA (hari untuk keluar), dan apa yang dilakukan dengan angka itu.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: tanyakan “berapa persen dari pasar harian?”",
        body: "Setiap kali melihat sebuah posisi, bagi nilainya dengan ADV. Posisi Rp60 miliar di pasar Rp25 miliar/hari = 240% volume harian — kau bukan “peserta pasar”, kau ADALAH pasarnya. Aturan praktis institusi: jangan jual lebih dari 20% ADV per hari (ρ = 0,2) kecuali darurat.",
      },
      reference: "Spread = pajak transaksi. Depth = seberapa besar kau boleh bergerak.",
    },
    {
      id: "konsep-dtl",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Days-to-liquidate: Si Antrean Kasir",
      prose: [
        "Definisi: days-to-liquidate (DTL) adalah perkiraan hari yang dibutuhkan untuk menjual seluruh posisi tanpa mengguncang harga — dihitung sebagai nilai posisi dibagi kapasitas jual harian (ADV × batas partisipasi ρ).",
        "Kepribadiannya: DTL adalah SI ANTREAN KASIR — ia tidak peduli seberapa bagus barang belanjaanmu (fundamental aset), ia hanya peduli berapa banyak orang di depanmu dan seberapa cepat kasir bekerja. Portofolio Rp1 triliun yang “bagus” dengan DTL 30 hari adalah portofolio yang tidak bisa memenuhi penarikan mingguan — sebagus apa pun isinya.",
        "Tiga hal yang membuat DTL menipu. Pertama, ADV BUKAN KONSTANTA: volume bisa menyusut 70% saat panik — DTL 5 hari di pasar normal bisa menjadi 15 hari di pasar stres. Kedua, ρ BUKAN HAK: batas 20% adalah sopan santun institusi; saat semua orang menjual bersamaan, bahkan 20% pun menggerakkan harga. Ketiga, DTL MENGABAIKAN BIAYA: keluar dalam 5 hari mungkin mungkin, tetapi dengan market impact 3% — likuid secara waktu, tidak likuid secara harga.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “saham blue chip selalu likuid”",
        type: "pitfall",
        body: "Yang benar: blue chip likuid untuk ukuran RITEL. Untuk posisi institusi Rp500 miliar, bahkan saham terbesar pun punya DTL berminggu-minggu. Likuiditas selalu relatif terhadap UKURANMU — tidak ada aset yang likuid secara absolut.",
      },
      reference: "DTL menjawab: berapa hari — di pasar normal DAN pasar stres.",
    },
    {
      id: "konsep-rumus-spiral",
      eyebrow: "Langkah 4 · Konsep inti + rumus",
      title: "Rumus DTL — dan spiral yang tidak ada di rumus",
      prose: [
        "Rumusnya satu baris — tetapi ingat tiga kebohongannya dari langkah 3:",
      ],
      formula: String.raw`\text{DTL} = \frac{\text{Posisi}}{\text{ADV} \times \rho}`,
      formulaNote:
        "Posisi = nilai pasar posisi yang ingin dijual (Rp). ADV = average daily volume, rata-rata nilai transaksi harian (Rp/hari) — pakai rata-rata 3 bulan, BUKAN minggu tenang terakhir. ρ (rho) = batas partisipasi, fraksi ADV yang boleh “dimakan” per hari tanpa impact berlebihan; standar institusi ρ = 0,2. Contoh: posisi Rp60 miliar, ADV Rp25 miliar/hari, ρ = 0,2 → DTL = 60 / (25 × 0,2) = 60/5 = 12 hari. Untuk skenario stres, ulangi dengan ADV_stress = 30% × ADV normal.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “NAV turun 2% berarti rugi 2% — tinggal tunggu rebound”",
        type: "pitfall",
        body: "Yang benar: pada dana terbuka, NAV yang jatuh karena forced selling memicu redemption lanjutan — kerugian menjadi permanen karena dana TERPAKSA menjual di bawah. Inilah liquidity spiral: penarikan → penjualan paksa → NAV jatuh → penarikan lagi. Menunggu rebound hanya works jika kau tidak dipaksa menjual.",
      },
      reference: "Rumus memberi angka; spiral menjelaskan kenapa angka itu bisa meledak.",
    },
    {
      id: "lab-dtl",
      eyebrow: "Langkah 5 · Lab",
      title: "Hitung DTL — dan simulasikan antrean redemption",
      prose: [
        "Lab ini mensimulasikan meja manajer investasi di cerita pembuka: tiga posisi, satu angka redemption Rp150 miliar yang harus dipenuhi dalam 5 hari, ρ = 0,2. Hitung DTL tiap posisi, tandai yang “terjebak” (DTL > 5 hari), lalu hitung berapa kas yang benar-benar bisa dicairkan dalam 5 hari — sisanya adalah lubang yang harus dijelaskan ke direksi.",
        "Perhatikan: Saham A keluar dalam 0,8 hari (bukan masalah), tetapi Saham B butuh 12 hari dan Obligasi C 15 hari. Redemption Rp150 miliar vs kapasitas 5 hari Rp110 miliar → kurang Rp40 miliar. Itulah saat manajer menelepon direksi — atau menutup pintu penarikan (gating).",
        "Coba: naikkan rho menjadi 0,5 (jualan agresif) — DTL menyusut, tetapi ingat langkah 3: itu berarti market impact yang jauh lebih besar. Angka membaik, harga yang dibayar memburuk.",
      ],
      tasks: [
        { id: "t1", text: "Hitung dict `dtl` = posisi / (adv × rho) untuk tiap posisi" },
        { id: "t2", text: "Bangun `terjebak`: posisi dengan DTL > `batas_hari`; hitung `cair_5_hari` dan `kurang`; cetak persis format contoh" },
      ],
      expected: "DTL (hari): Saham A (blue chip)=0.8, Saham B (lapis dua)=12.0, Obligasi C=15.0\nTerjebak (>5 hari): ['Saham B (lapis dua)', 'Obligasi C']\nCair 5 hari: Rp110M vs redemption Rp150M -> kurang Rp40M",
      code: {
        starter: `# Posisi (Rp miliar) dan volume harian rata-rata (Rp miliar/hari)
posisi = {"Saham A (blue chip)": 45, "Saham B (lapis dua)": 60, "Obligasi C": 120}
adv = {"Saham A (blue chip)": 300, "Saham B (lapis dua)": 25, "Obligasi C": 40}
rho = 0.2          # batas partisipasi harian
batas_hari = 5
redemption = 150   # Rp miliar, harus cair dalam 5 hari

# TULIS KODEMU
dtl =
terjebak =
cair_5_hari =
kurang =

print("DTL (hari): " + ", ".join(f"{n}={d:.1f}" for n, d in dtl.items()))
print(f"Terjebak (>{batas_hari} hari): {terjebak}")
print(f"Cair {batas_hari} hari: Rp{cair_5_hari:.0f}M vs redemption Rp{redemption:.0f}M -> kurang Rp{kurang:.0f}M")`,
        lockLines: 7,
        solution: `# Posisi (Rp miliar) dan volume harian rata-rata (Rp miliar/hari)
posisi = {"Saham A (blue chip)": 45, "Saham B (lapis dua)": 60, "Obligasi C": 120}
adv = {"Saham A (blue chip)": 300, "Saham B (lapis dua)": 25, "Obligasi C": 40}
rho = 0.2          # batas partisipasi harian
batas_hari = 5
redemption = 150   # Rp miliar, harus cair dalam 5 hari

# TULIS KODEMU
dtl = {nama: posisi[nama] / (adv[nama] * rho) for nama in posisi}
terjebak = [nama for nama, d in dtl.items() if d > batas_hari]
cair_5_hari = sum(min(posisi[nama], adv[nama] * rho * batas_hari) for nama in posisi)
kurang = max(0, redemption - cair_5_hari)

print("DTL (hari): " + ", ".join(f"{n}={d:.1f}" for n, d in dtl.items()))
print(f"Terjebak (>{batas_hari} hari): {terjebak}")
print(f"Cair {batas_hari} hari: Rp{cair_5_hari:.0f}M vs redemption Rp{redemption:.0f}M -> kurang Rp{kurang:.0f}M")`,
        checks: [
          { kind: "defined", task: "t1", name: "dtl", label: "`dtl` terdefinisi", msg: "Hitung posisi / (adv × rho) tiap posisi." },
          { kind: "equal", task: "t2", name: "terjebak", value: ["Saham B (lapis dua)", "Obligasi C"], label: "dua posisi terjebak", msg: "DTL 12 dan 15 hari > batas 5 hari." },
          { kind: "equal", task: "t2", name: "kurang", value: 40, tol: 1e-9, label: "`kurang` = Rp40 miliar", msg: "Kapasitas 5 hari (110) < redemption (150)." },
          { kind: "stdout_matches", task: "t2", pattern: "kurang Rp40M", label: "`print` menampilkan kekurangan", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Angka DTL adalah undangan untuk menyiapkan rencana — bukan ramalan.",
    },
    {
      id: "chart-dtl",
      eyebrow: "Langkah 6 · Konsep + chart",
      title: "Dua batang merah: visual dari masalah Rp40 miliar",
      prose: [
        "Chart di bawah memvisualkan hasil lab: DTL tiap posisi dibandingkan garis batas 5 hari. Saham A jauh di bawah garis (aman); Saham B dan Obligasi C menjulang di atasnya (batang merah) — dua posisi yang tidak bisa keluar dalam seminggu tanpa menghancurkan harga.",
        "Cara membaca chart: tinggi batang = hari yang dibutuhkan untuk menjual seluruh posisi pada ρ = 0,2; garis putus-putus = batas waktu redemption (5 hari); batang yang melewati garis = posisi “terjebak”.",
        "Interpretasi: chart ini seharusnya ada di meja setiap manajer dana terbuka — diperbarui tiap minggu. Ia mengubah risiko likuiditas dari paragraf prospektus menjadi dua batang merah yang tidak bisa diabaikan. Ketika batang merah muncul, pilihannya hanya tiga: kurangi posisi SEKARANG (saat pasar tenang), siapkan fasilitas likuiditas, atau tulis kebijakan gating sebelum dibutuhkan.",
      ],
      figure: { svg: DTL_SVG, alt: "Diagram batang days-to-liquidate: Saham A 0,8 hari, Saham B 12 hari, Obligasi C 15 hari, garis batas 5 hari.", caption: "DTL vs batas redemption: batang merah = posisi terjebak." },
      tasks: [],
      reference: "Batang merah = telepon ke direksi, sebelum investor yang menelepon.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: sebelum antrean terbentuk",
      prose: [
        "Skenario 1 — DTL posisi > horizon redemption dana (mis. > 5 hari untuk dana harian) → KURANGI POSISI saat pasar tenang, atau pindahkan ke dana tertutup. Alasan: struktur dana harus sesuai likuiditas asetnya.",
        "Skenario 2 — Redemption berjalan tetapi masih < kapasitas 5 hari → JUAL sesuai antrean DTL (yang paling likuid dulu), sambil siapkan komunikasi ke investor. Alasan: menjual yang likuid dulu membeli waktu — tetapi jangan sampai tersisa hanya aset terburuk.",
        "Skenario 3 — Redemption melebihi kapasitas + NAV jatuh memicu penarikan lanjutan (spiral) → AKTIFKAN GATING (batasi penarikan harian) sesuai prospektus. Alasan: gating melindungi investor yang tinggal dari forced selling yang merugikan mereka.",
        "Skenario 4 — Menyusun IPS dana baru → TULIS liquidity bucketing: bucket 1 (kas & setara kas, DTL < 1 hari) ≥ 10%, bucket 2 (DTL < 5 hari), bucket 3 (sisanya, maks 20%). Alasan: batas yang ditulis saat tenang adalah yang dipakai saat panik.",
        "Aturan praktis 10 detik: untuk setiap posisi tanyakan “berapa hari keluar?” — jika jawabannya lebih lama dari janji likuiditas danamu, kau sedang menjual janji yang tidak bisa ditepati.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menjual posisi paling likuid DULU saat redemption — terlihat cerdas (cepat dapat kas), tetapi menyisakan portofolio yang makin tidak likuid untuk investor yang tinggal. Itu transfer risiko diam-diam. Jual proporsional, atau jual yang likuid sambil rebalance bucket.",
      },
      reference: "Gating bukan kegagalan — ia rem darurat yang ditulis sebelum dibutuhkan.",
    },
    {
      id: "minicase-dana500",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Dana Rp500 miliar, redemption Rp200 miliar",
      prose: [
        "Kasus: Dana campuran Rp500 miliar menghadapi redemption Rp200 miliar dalam 5 hari. Posisi: Saham A Rp90 miliar (ADV Rp400 miliar), Saham B Rp150 miliar (ADV Rp30 miliar), Obligasi C Rp260 miliar (ADV Rp50 miliar). ρ = 0,2.",
        "Pertanyaan 1: Hitung DTL tiap posisi dan kapasitas cair 5 hari. Berapa kekurangannya?",
        "Pertanyaan 2: Jika dana tetap memaksakan penjualan penuh dalam 5 hari (ρ dinaikkan paksa), apa konsekuensinya — dan apa alternatifnya?",
        "Pembahasan: (1) DTL: A = 90/(400×0,2) = 1,1 hari; B = 150/6 = 25 hari; C = 260/10 = 26 hari. Kapasitas 5 hari: A min(90, 400) = 90; B min(150, 30) = 30; C min(260, 50) = 50 → total Rp170 miliar. Kurang Rp30 miliar. (2) Memaksa ρ naik = market impact besar: menjual 25 hari volume dalam 5 hari bisa menekan harga 10–20%, NAV jatuh, spiral dimulai. Alternatif: gating parsial + komunikasi transparan (“Rp170 miliar cair minggu ini, sisanya bertahap”) — menyakitkan tetapi tidak menghancurkan nilai.",
      ],
      tasks: [],
      reference: "Rp30 miliar yang “kurang” lebih murah daripada spiral yang menghancurkan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran — dari DTL hingga gating."],
      tasks: [],
      summary: [
        "Likuiditas adalah sifat transaksi (ukuran × kecepatan × kondisi pasar), bukan sifat aset.",
        "DTL = Posisi / (ADV × ρ); ulangi dengan ADV stres — angka normal menipu.",
        "Liquidity spiral: penarikan → forced selling → NAV jatuh → penarikan; gating melindungi yang tinggal.",
        "Liquidity bucketing di IPS + pantau DTL mingguan = risiko likuiditas yang dikelola, bukan didoakan.",
      ],
      next: { label: "PME4 — Deliverable Institusi: Laporan yang Dibaca Komite", href: "/v2/learn/pm-e4-deliverable-institusi" },
      quiz: [
        {
          q: "Posisi Rp60 miliar, ADV Rp25 miliar/hari, ρ = 0,2. DTL?",
          options: [
            { text: "2,4 hari", why: "Salah: itu 60/25 — lupa membagi dengan ρ = 0,2." },
            { text: "12 hari", why: "Tepat: 60 / (25 × 0,2) = 60/5 = 12 hari.", correct: true },
            { text: "0,48 hari", why: "Salah: itu (60 × 0,2)/25 — rumusnya terbalik." },
            { text: "30 hari", why: "Salah: itu 60/(25 × 0,08) — ρ yang dipakai keliru." },
          ],
        },
        {
          q: "Mengapa DTL pasar normal bisa menipu?",
          options: [
            { text: "Karena ADV dihitung salah", why: "Salah: ADV-nya benar — masalahnya ADV tidak konstan." },
            { text: "Karena volume bisa menyusut drastis saat panik — DTL 5 hari bisa jadi 15 hari", why: "Tepat: likuiditas menguap tepat saat paling dibutuhkan; selalu hitung skenario stres.", correct: true },
            { text: "Karena rumusnya tidak akurat", why: "Salah: rumusnya benar sebagai estimasi; yang berubah adalah inputnya." },
            { text: "Karena ρ selalu 0,2", why: "Salah: ρ adalah pilihan kebijakan, bukan konstanta alam." },
          ],
        },
        {
          q: "Mekanisme liquidity spiral pada dana terbuka adalah…",
          options: [
            { text: "NAV naik → investor masuk → dana membesar", why: "Salah: itu spiral positif pertumbuhan, bukan spiral likuiditas." },
            { text: "Penarikan → penjualan paksa → NAV jatuh → penarikan lanjutan", why: "Tepat: forced selling menekan harga, yang memicu kepanikan berikutnya.", correct: true },
            { text: "Biaya manajemen naik → investor protes", why: "Salah: itu soal fee, bukan likuiditas." },
            { text: "Regulator menutup dana", why: "Salah: itu akibat ekstrem, bukan mekanismenya." },
          ],
        },
        {
          q: "Dana harian memegang posisi ber-DTL 25 hari. Masalahnya?",
          options: [
            { text: "Tidak ada — return-nya bagus", why: "Salah: return bagus tidak membayar redemption minggu depan." },
            { text: "Struktur dana (janji likuiditas harian) tidak sesuai likuiditas asetnya", why: "Tepat: janji yang tidak bisa ditepati — pindahkan ke dana tertutup atau kurangi posisi.", correct: true },
            { text: "Harus segera dijual semuanya", why: "Salah: fire sale justru merealisasikan kerugian; solusinya struktural, bukan panik." },
            { text: "Naikkan ρ menjadi 1,0", why: "Salah: ρ = 1,0 berarti memakan seluruh volume harian — market impact katastrofal." },
          ],
        },
        {
          q: "Fungsi gating (pembatasan penarikan) yang benar adalah…",
          options: [
            { text: "Menjebak investor agar tidak kabur", why: "Salah: framing yang sinis — tujuannya melindungi nilai, bukan mengunci orang." },
            { text: "Melindungi investor yang tinggal dari forced selling yang merugikan mereka", why: "Tepat: rem darurat yang adil — penjualan brutal merugikan yang tidak ikut menarik.", correct: true },
            { text: "Menyembunyikan kinerja buruk", why: "Salah: gating transparan justru disertai komunikasi terbuka." },
            { text: "Menghindari pajak", why: "Salah: tidak ada hubungan dengan pajak." },
          ],
        },
        {
          q: "Saat redemption, mengapa “jual yang paling likuid dulu” bisa salah?",
          options: [
            { text: "Karena yang likuid harganya jatuh", why: "Salah: yang likuid justru paling tahan harga." },
            { text: "Karena menyisakan portofolio makin tidak likuid bagi investor yang tinggal — transfer risiko diam-diam", why: "Tepat: yang pergi dapat kas penuh, yang tinggal mewarisi aset tersulit dijual.", correct: true },
            { text: "Karena melanggar prospektus", why: "Salah: prospektus jarang mengatur urutan penjualan." },
            { text: "Karena lebih lambat", why: "Salah: justru itu cara tercepat dapat kas — masalahnya keadilan, bukan kecepatan." },
          ],
        },
      ],
    },
  ],
};
