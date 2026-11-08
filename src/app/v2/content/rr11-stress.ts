import type { V2Lesson } from "../lib/types";

// Fan chart: tiga skenario NPL melebar dari baseline.
const FIG_FAN = `<svg viewBox=\"0 0 480 280\" role=\"img\" aria-label=\"Fan chart tiga skenario stress test NPL yang melebar dari baseline.\">
<g stroke=\"var(--chart-grid)\" stroke-width=\"1\">
<line x1=\"50\" y1=\"240\" x2=\"450\" y2=\"240\"/><line x1=\"50\" y1=\"180\" x2=\"450\" y2=\"180\"/>
<line x1=\"50\" y1=\"120\" x2=\"450\" y2=\"120\"/><line x1=\"50\" y1=\"60\" x2=\"450\" y2=\"60\"/>
</g>
<g fill=\"var(--chart-text)\" font-size=\"10\" font-family=\"var(--font-ui)\" text-anchor=\"end\">
<text x=\"44\" y=\"243\">3,0</text><text x=\"44\" y=\"183\">4,0</text><text x=\"44\" y=\"123\">5,0</text><text x=\"44\" y=\"63\">6,0</text>
</g>
<line x1=\"50\" y1=\"120\" x2=\"450\" y2=\"120\" stroke=\"var(--c4)\" stroke-width=\"1.5\" stroke-dasharray=\"7 5\"/>
<text x=\"446\" y=\"110\" font-size=\"11\" fill=\"var(--c4)\" font-family=\"var(--font-ui)\" text-anchor=\"end\">batas 5,0%</text>
<path d=\"M50,240 L450,204 L450,96 L50,240 Z\" fill=\"var(--c2)\" opacity=\"0.25\"/>
<line x1=\"50\" y1=\"240\" x2=\"450\" y2=\"204\" stroke=\"var(--c3)\" stroke-width=\"2.5\"/>
<line x1=\"50\" y1=\"240\" x2=\"450\" y2=\"150\" stroke=\"var(--c2)\" stroke-width=\"2.5\"/>
<line x1=\"50\" y1=\"240\" x2=\"450\" y2=\"96\" stroke=\"var(--c4)\" stroke-width=\"2.5\"/>
<g font-size=\"12\" fill=\"var(--chart-text)\" font-family=\"var(--font-ui)\" font-weight=\"600\" text-anchor=\"start\">
<text x=\"330\" y=\"216\">baseline 3,4%</text>
<text x=\"330\" y=\"164\" fill=\"var(--c2)\">adverse 4,2%</text>
<text x=\"330\" y=\"112\" fill=\"var(--c4)\">severe 5,0%</text>
</g>
<g fill=\"var(--chart-text)\" font-size=\"10\" font-family=\"var(--font-ui)\" text-anchor=\"middle\">
<text x=\"50\" y=\"256\">now</text><text x=\"450\" y=\"256\">+12 bln</text>
</g>
<text x=\"240\" y=\"28\" font-size=\"12\" fill=\"var(--chart-text)\" font-family=\"var(--font-ui)\" text-anchor=\"middle\">Skenario melebar dari titik yang sama — jarak ke batas yang penting</text>
</svg>`;

export const rr11: V2Lesson = {
  slug: "rr11-stress",
  track: "Risk Reporting",
  module: "Operasi & Regulasi",
  title: "RR11 — Melaporkan Hasil Stress Test",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "\u201CKatanya aman\u201D",
      prose: [
        "Hasil stress test tahunan dipresentasikan ke direksi: \u201Cdi semua skenario, NPL tetap di bawah batas 5%.\u201D Direksi tenang, dividen disetujui. Enam bulan kemudian skenario adverse terjadi — kontraksi ekonomi, NPL menyentuh 4,9%. Komite memanggil tim risiko: \u201CKatanya aman?\u201D",
        "Twist-nya: presentasinya tidak berbohong — skenario severe memang menghasilkan 5,0%, tepat di batas, alias \u201Clolos\u201D. Tetapi \u201Clolos dengan jarak 0,0 pp\u201D disajikan dengan nada yang sama dengan \u201Clolos dengan jarak 2,0 pp\u201D. Direksi pulang dengan kesan \u201Caman\u201D, padahal yang benar adalah \u201Clolos tipis — buffer nyaris nol\u201D. Pelajaran: dalam melaporkan stress test, yang penting bukan lolos/tidak — melainkan JARAK ke batas dan seberapa bisa dipercaya asumsinya.",
        "Setelah lesson ini kamu bisa: (1) menghitung sensitivitas NPL terhadap shock; (2) menyajikan jarak ke batas, bukan sekadar lolos/gagal; (3) menulis asumsi sebelum hasil.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "\u201CLolos tipis\u201D yang disajikan sebagai \u201Caman\u201D = dividen disetujui dari buffer yang sebenarnya tidak ada. Ketika shock datang, bank kekurangan modal tepat saat paling dibutuhkan. Nada presentasi adalah keputusan.",
      },
      reference: "Laporkan jarak ke batas, bukan vonis lolos/gagal.",
    },
    {
      id: "skenario",
      eyebrow: "Langkah 2 · Skenario",
      title: "Tiga skenario, satu yang penting",
      prose: [
        "Baseline: ekonomi berjalan normal — untuk perencanaan. Adverse: resesi moderat — untuk menguji buffer. Severely adverse: krisis — untuk menguji kelangsungan hidup. Ketiganya BUKAN prediksi; mereka adalah \u201Cbagaimana jika\u201D. Kesalahan fatal: memperlakukan skenario severe sebagai ramalan (\u201Ckrisis akan datang!\u201D) atau mengabaikannya (\u201Ctidak mungkin terjadi\u201D).",
        "Sensitivitas mengukur: jika GDP terkontraksi 1%, NPL naik berapa? Dengan beta 0,4 pp per 1% kontraksi: shock −1% → NPL 3,4%; −3% → 4,2%; −5% → 5,0%. Angka yang penting bukan 3,4/4,2/5,0 — melainkan jarak ke batas 5%: 1,6 pp, 0,8 pp, 0,0 pp. \u201CJarak 0,0 pp\u201D adalah kalimat yang seharusnya menggema di ruang direksi, bukan \u201Clolos\u201D.",
      ],
      formula: String.raw`\text{NPL}_{\text{skenario}} = \text{NPL}_{\text{base}} + \beta \times |\text{shock}| \qquad \text{Jarak} = \text{Batas} - \text{NPL}_{\text{skenario}}`,
      formulaNote: "NPL_base = 3,0% (titik awal), β = 0,4 pp (sensitivitas: tiap 1% kontraksi GDP menaikkan NPL 0,4 pp), |shock| = besar kontraksi. Contoh: shock −3% → 3,0 + 0,4×3 = 4,2%; jarak = 5,0 − 4,2 = 0,8 pp. Interpretasi: jarak menyusut = buffer menipis; jarak 0 = batas tersentuh.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CSkenario terburuk = prediksi yang harus dihindari.\u201D Bukan prediksi — ia alat ukur ketahanan. Dan \u201Ctampilkan hanya skenario yang lolos agar tidak panik\u201D = menenangkan palsu. Tugasmu: tunjukkan SEMUA skenario dengan jujur, termasuk yang menyentuh batas.",
      },
      hints: [
        "Intuisi: stress test seperti uji tabrak mobil — tujuannya bukan meramalkan kecelakaan, melainkan memastikan sabuk pengaman bekerja saat kecelakaan terjadi.",
        "Selalu tulis asumsi SEBELUM hasil: \u201Cbeta 0,4 dari regresi 10 tahun; shock GDP −5% = krisis 2008.\u201D Hasil tanpa asumsi = angka mistis.",
      ],
      reference: "Skenario = alat ukur, bukan ramalan. Jarak ke batas = angka terpenting.",
    },
    {
      id: "lab-sens",
      eyebrow: "Langkah 3 · Lab",
      title: "Hitung sensitivitas dan jarak ke batas",
      prose: [
        "Implementasikan rumus sensitivitas untuk tiga shock dan hitung jarak masing-masing ke batas 5%. Perhatikan baris terakhir output: jarak 0,0 pp. Dalam presentasi, baris inilah yang harus disorot — bukan disamarkan.",
        "Eksperimen: ubah beta menjadi 0,6 (ekonomi lebih sensitif). Skenario severe kini menembus batas (5,0 → 6,0?). Inilah gunanya analisis sensitivitas: menunjukkan seberapa rapuh kesimpulanmu terhadap asumsinya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi perhitungan `npl_s` dan `jarak`" },
        { id: "t2", text: "Jalankan dan baca jarak ke batas" },
      ],
      expected: "shock -1% -> NPL 3.4%, jarak ke batas 1.6pp\nshock -3% -> NPL 4.2%, jarak ke batas 0.8pp\nshock -5% -> NPL 5.0%, jarak ke batas 0.0pp",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CBeta adalah konstanta alam.\u201D Beta diestimasi dari data historis — ia bisa berubah saat struktur ekonomi berubah. Selalu laporkan dari mana beta berasal dan uji sensitivitas terhadap beta itu sendiri.",
      },
      hints: [
        "npl_s = base + beta * (-shock) — shock negatif, jadi pakai nilai mutlaknya.",
        "jarak = batas - npl_s.",
        "Format: f\"shock {s}% -> NPL {n:.1f}%, jarak ke batas {j:.1f}pp\".",
      ],
      code: {
        starter: `# Parameter stress test. JANGAN UBAH baris ini.\nbase, beta, batas = 3.0, 0.4, 5.0\nshocks = [-1, -3, -5]\n\n# TULIS KODEMU: NPL skenario + jarak ke batas\nfor s in shocks:\n    npl_s =\n    jarak =\n    print(f"shock {s}% -> NPL {npl_s:.1f}%, jarak ke batas {jarak:.1f}pp")`,
        lockLines: 3,
        solution: `# Parameter stress test. JANGAN UBAH baris ini.\nbase, beta, batas = 3.0, 0.4, 5.0\nshocks = [-1, -3, -5]\n\n# TULIS KODEMU: NPL skenario + jarak ke batas\nfor s in shocks:\n    npl_s = base + beta * (-s)\n    jarak = batas - npl_s\n    print(f"shock {s}% -> NPL {npl_s:.1f}%, jarak ke batas {jarak:.1f}pp")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "shock -1% -> NPL 3\\.4%, jarak ke batas 1\\.6pp", label: "Skenario -1% benar", msg: "3.0 + 0.4×1 = 3.4; jarak 1.6." },
          { kind: "stdout_matches", task: "t2", pattern: "shock -5% -> NPL 5\\.0%, jarak ke batas 0\\.0pp", label: "Skenario -5% menyentuh batas", msg: "3.0 + 0.4×5 = 5.0; jarak 0.0 — sorot ini!" },
        ],
      },
      reference: "npl = base + beta×|shock|; jarak = batas − npl. Sorot jarak terkecil.",
    },
    {
      id: "nada",
      eyebrow: "Langkah 4 · Nada",
      title: "Tanpa fear-mongering, tanpa comfort palsu",
      prose: [
        "Dua dosa presentasi stress test: fear-mongering (\u201Cskenario severe = kiamat!\u201D — membuat direksi defensif dan menolak hasil) dan false comfort (\u201Csemua lolos, aman\u201D — membuat direksi lengah). Nada yang benar: netral, kuantitatif, berorientasi aksi. \u201CPada skenario severe, NPL menyentuh batas 5% (jarak 0,0 pp). Artinya buffer habis tepat di skenario terberat. Opsi: tambah buffer RpX atau batasi eksposur segmen Y.\u201D",
        "Cara membaca figur: tiga garis melebar dari titik yang sama (kini); garis putus-putus = batas 5%. Interpretasi: yang melebar = ketidakpastian; yang penting = seberapa dekat garis teratas ke batas. Presentasikan jaraknya, bukan ketakutannya.",
        "Aturan: setiap skenario ekstrem ditemani dua hal — probabilitas kasar (\u201Cterjadi 2x dalam 30 tahun\u201D) dan rencana aksi (\u201Cjika ini terjadi, kita...\u201D). Skenario tanpa rencana aksi = horor; skenario dengan rencana aksi = kesiapan.",
      ],
      figure: {
        svg: FIG_FAN,
        alt: "Fan chart tiga skenario stress test NPL yang melebar dari baseline.",
        caption: "Fan chart: ketidakpastian melebar, batas tetap. Fokus pada jarak garis teratas ke batas.",
      },
      tasks: [],
      hints: [
        "Intuisi: direksi tidak butuh diyakinkan bahwa badai tidak datang — mereka butuh tahu kapal kuat sampai badai seberapa besar.",
        "Jangan pernah hanya menampilkan skenario \u201Cyang lolos\u201D. Seleksi skenario = manipulasi.",
      ],
      reference: "Netral + kuantitatif + aksi. Skenario ekstrem wajib ditemani probabilitas + rencana.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Reverse",
      title: "Reverse stress test: seberapa buruk sampai jebol?",
      prose: [
        "Stress test biasa berjalan maju: shock → hasil. Reverse stress test berjalan mundur: batas → shock berapa yang menjebol? Rumusnya: shock_breach = (batas − base) / beta. Untuk NPL total: (5,0 − 3,0) / 0,4 = kontraksi GDP 5%. Satu angka ini mengubah 'jarak 0,0 pp' menjadi kalimat yang bisa dicerna direksi.",
        "Interpretasi: 'Butuh kontraksi ekonomi 5% — setara krisis 1998 — untuk menjebol batas NPL 5%.' Bandingkan dengan frekuensi historis: kontraksi ≥5% terjadi 1× dalam 25 tahun. Tiba-tiba buffer yang 'tipis' punya konteks probabilitas — bukan lagi sekadar 'lolos tipis' yang menakutkan tanpa ukuran.",
        "Kekuatan sebenarnya: ranking kerapuhan antar segmen. SME: (5,0 − 4,1)/0,4 = 2,25% → paling rapuh. Ritel: (5,0 − 3,2)/0,5 = 3,6%. Korporat: (5,0 − 2,5)/0,3 = 8,3% → paling kuat. Lab menghitung ketiganya dan mengurutkan. Hasilnya memberi tahu komite ke mana buffer tambahan harus dialokasikan duluan — bukan dibagi rata.",
        "Reverse stress test bukan pesimisme — ia menjawab pertanyaan direksi yang sebenarnya: 'seberapa buruk keadaan harus menjadi sebelum kita bermasalah?' Jawaban 'kontraksi 2,25% menjebol SME' jauh lebih berguna daripada 'jangan khawatir' maupun 'kiamat datang'.",
      ],
      formula: String.raw`\text{Shock}_{\text{breach}} = \frac{\text{Batas} - \text{Base}}{\beta}`,
      formulaNote: "Batas = ambang internal (%), Base = NPL saat ini (%), beta = sensitivitas NPL per 1% kontraksi (pp). Contoh SME: (5,0 − 4,1)/0,4 = 2,25%. Interpretasi: kontraksi GDP 2,25% sudah cukup menjebol batas — segmen paling rapuh.",
      tasks: [
        { id: "t1", text: "Hitung `shock` tiap segmen dan urutkan" },
        { id: "t2", text: "Jalankan dan pastikan ranking tercetak" },
      ],
      expected: "SME: jebol pada kontraksi 2.25%\nRitel: jebol pada kontraksi 3.60%\nKorporat: jebol pada kontraksi 8.33%\nPaling rapuh: SME",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Reverse stress test = pesimisme.” Bukan — ia presisi. 'Jangan khawatir' dan 'kiamat datang' sama-sama tidak kuantitatif. 'Kontraksi 2,25% menjebol SME' memberi direksi angka untuk memutuskan, bukan emosi untuk dirasakan.",
      },
      hints: [
        "shock = (batas - base) / beta.",
        "sort by shock menaik = paling rapuh dulu.",
      ],
      code: {
        starter: "# Base NPL & beta per segmen (JANGAN UBAH).\nsegmen = [(\"SME\", 4.1, 0.4), (\"Korporat\", 2.5, 0.3), (\"Ritel\", 3.2, 0.5)]\nbatas = 5.0\n\n# TULIS KODEMU: shock_breach per segmen, urutkan dari paling rapuh\nhasil = []\nfor nama, base, beta in segmen:\n    shock = \n    hasil.append((nama, shock))\nhasil.sort(key=lambda x: x[1])\n\nfor nama, shock in hasil:\n    print(f\"{nama}: jebol pada kontraksi {shock:.2f}%\")\nprint(f\"Paling rapuh: {hasil[0][0]}\")",
        lockLines: 3,
        solution: "# Base NPL & beta per segmen (JANGAN UBAH).\nsegmen = [(\"SME\", 4.1, 0.4), (\"Korporat\", 2.5, 0.3), (\"Ritel\", 3.2, 0.5)]\nbatas = 5.0\n\n# TULIS KODEMU: shock_breach per segmen, urutkan dari paling rapuh\nhasil = []\nfor nama, base, beta in segmen:\n    shock = (batas - base) / beta\n    hasil.append((nama, shock))\nhasil.sort(key=lambda x: x[1])\n\nfor nama, shock in hasil:\n    print(f\"{nama}: jebol pada kontraksi {shock:.2f}%\")\nprint(f\"Paling rapuh: {hasil[0][0]}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "SME paling rapuh", msg: "2,25% < 3,60% < 8,33%.", pattern: "Paling rapuh: SME" },
          { kind: "stdout_matches", task: "t2", label: "Angka shock tercetak", msg: "Tiga baris segmen + verdict.", pattern: "Korporat: jebol pada kontraksi 8\\.33%" }
        ],
      },
      reference: "Shock_breach = (batas - base)/beta. Ranking kerapuhan > rata-rata.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Buffer modal",
      title: "Berapa sisa modal tiap skenario?",
      prose: [
        "Lab pertama mencari titik jebol lewat reverse stress test. Lab ini menghitung sisa modal: Rp1.200 miliar dikurangi rugi tiap skenario. Skenario ringan (rugi Rp150 M) dan berat (Rp480 M) masih AMAN — sisa di atas Rp300 M. Skenario ekstrem (Rp1.100 M) menyisakan Rp100 M = KRITIS.",
        "Ambang Rp300 M di sini mewakili buffer minimum operasional — di bawah itu bank tidak bisa menyalurkan kredit baru. Stress test yang baik tidak berhenti di 'berapa ruginya', melainkan 'masih bisa beroperasi atau tidak'.",
      ],
      tasks: [
        { id: "t1", text: "Hitung sisa = modal - rugi tiap skenario" },
        { id: "t2", text: "Jalankan dan pastikan status tercetak" },
      ],
      expected: "ringan: sisa Rp1050 M -> AMAN\nberat: sisa Rp720 M -> AMAN\nekstrem: sisa Rp100 M -> KRITIS",
      note: {
        title: "Sisa positif ≠ aman.",
        type: "pitfall",
        body: "“Masih sisa Rp100 M, berarti selamat.” Sisa di bawah buffer operasional = bank zombie: hidup di kertas, mati di lapangan. Stress test menilai kelangsungan operasi, bukan sekadar solvabilitas akuntansi.",
      },
      hints: [
        "sisa = modal - r.",
        "Status AMAN bila sisa > 300, selain itu KRITIS.",
      ],
      code: {
        starter: "# Modal dan rugi per skenario (Rp M). JANGAN UBAH.\nmodal = 1200\nrugi = {\"ringan\": 150, \"berat\": 480, \"ekstrem\": 1100}\n\n# TULIS KODEMU: sisa modal + status\nfor sken, r in rugi.items():\n    sisa = \n    status = \"AMAN\" if sisa > 300 else \"KRITIS\"\n    print(f\"{sken}: sisa Rp{sisa} M -> {status}\")",
        lockLines: 4,
        solution: "# Modal dan rugi per skenario (Rp M). JANGAN UBAH.\nmodal = 1200\nrugi = {\"ringan\": 150, \"berat\": 480, \"ekstrem\": 1100}\n\n# TULIS KODEMU: sisa modal + status\nfor sken, r in rugi.items():\n    sisa = modal - r\n    status = \"AMAN\" if sisa > 300 else \"KRITIS\"\n    print(f\"{sken}: sisa Rp{sisa} M -> {status}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Skenario ringan", msg: "Sisa Rp1050 M.", pattern: "ringan: sisa Rp1050 M -\> AMAN" },
          { kind: "stdout_matches", task: "t2", label: "Skenario ekstrem", msg: "Sisa Rp100 M = KRITIS.", pattern: "ekstrem: sisa Rp100 M -\> KRITIS" }
        ],
      },
      reference: "Stress test menilai operasi, bukan kertas. Di bawah buffer = zombie.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Seberapa detail untuk siapa",
      prose: [
        "Satu: direksi → 1 slide: fan chart + jarak ke batas + 2 opsi aksi. Dua: komite risiko → 5 halaman: asumsi, sensitivitas beta, per segmen, rencana kontinjensi. Tiga: regulator → dokumen lengkap: metodologi, validasi model, tata kelola. Empat: publik (jika diumumkan) → ringkasan tanpa detail sensitif; pasar membaca sinyal, bukan metodologi.",
        "Aturan praktis 10 detik: semakin tinggi pengambil keputusan, semakin sedikit skenario yang ditampilkan — tetapi jarak ke batas TIDAK BOLEH hilang di versi ringkas mana pun.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Direksi → 1 slide: fan chart + jarak ke batas + shock_breach ('jebol pada kontraksi X%'). Tiga angka ini menjawab 'seberapa aman kita?' lebih baik daripada 10 skenario. Skenario banyak = untuk komite; angka jebol = untuk direksi.",
      },
      reference: "Direksi: 1 slide + jarak. Komite: asumsi + sensitivitas. Regulator: dokumen penuh.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "\u201CLolos tipis\u201D Bank Artha Dana",
      prose: [
        "Data: NPL base 3,0%, beta 0,4, batas 5%. Hasil: baseline 3,4% (jarak 1,6), adverse 4,2% (jarak 0,8), severe 5,0% (jarak 0,0). Draf slide analis: judul \u201CStress Test: LOLOS di semua skenario\u201D dengan centang hijau tiga biji.",
        "Tulis ulang: Judul — \u201CBuffer habis pada skenario terberat (jarak 0,0 pp)\u201D. Isi — tabel tiga skenario + kolom jarak (dari lab Langkah 3) + dua opsi: (a) tambah CKPN Rp8 miliar → jarak severe menjadi 0,4 pp; (b) batasi eksposur SME Rp50 miliar. Rekomendasi: opsi (a) sebelum akhir kuartal. Perhatikan: tidak ada kata \u201Caman\u201D, tidak ada kata \u201Ckiamat\u201D — hanya jarak dan opsi. Itulah nada yang benar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Slide \u201CLOLOS\u201D + dividen disetujui = modal keluar saat buffer sebenarnya nol. Ketika shock datang 6 bulan kemudian, bank menyesal. Presentasi stress test adalah keputusan modal — perlakukan dengan keseriusan itu.",
      },
      reference: "Ganti vonis \u201Clolos\u201D dengan jarak + opsi aksi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Ingat: jarak ke batas > vonis lolos/gagal.",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "Jarak ke batas > vonis lolos/gagal > shock_breach sebagai konteks. Tiga lapis ini = laporan stress test yang lengkap: posisi (jarak), vonis (lolos), dan 'seberapa jauh dari jurang' (reverse).",
      },

      summary: [
        "Skenario = \u201Cbagaimana jika\u201D, bukan prediksi.",
        "NPL skenario = base + β×|shock|; angka terpenting = jarak ke batas.",
        "Tulis asumsi sebelum hasil; uji sensitivitas terhadap beta.",
        "Nada: netral, kuantitatif, berorientasi aksi — tanpa fear-mongering/comfort palsu.",
        "Skenario ekstrem wajib ditemani probabilitas kasar + rencana aksi.",
      ],
      next: { label: "RR12 — Pelaporan Insiden & Near-Miss", href: "/v2/learn/rr12-insiden" },
      quiz: [
        {
          q: "Apa angka terpenting dalam laporan stress test?",
          options: [
            { text: "Vonis lolos/gagal", why: "\u201CLolos\u201D menyembunyikan seberapa tipis lolosan itu." },
            { text: "Jarak ke batas", why: "Tepat. Jarak 0,0 pp vs 2,0 pp = dua dunia berbeda.", correct: true },
            { text: "Jumlah skenario", why: "Banyak skenario tanpa jarak = banyak angka tanpa makna." },
          ],
        },
        {
          q: "Skenario severely adverse seharusnya diperlakukan sebagai?",
          options: [
            { text: "Ramalan krisis yang pasti terjadi", why: "Itu fear-mongering — skenario bukan prediksi." },
            { text: "Alat ukur ketahanan: seberapa besar badai kapal kita tahan", why: "Benar. Uji tabrak, bukan ramalan cuaca.", correct: true },
            { text: "Skenario yang boleh disembunyikan agar tidak panik", why: "Itu false comfort — manipulasi." },
          ],
        },
        {
          q: "Beta 0,4 dalam rumus berasal dari?",
          options: [
            { text: "Konstanta alam yang tetap", why: "Beta diestimasi dari data — bisa berubah." },
            { text: "Estimasi historis yang harus dilaporkan sumbernya + diuji sensitivitasnya", why: "Benar. Tulis asalnya, uji kerapuhannya.", correct: true },
            { text: "Tebakan analis senior", why: "Tebakan tanpa dasar = angka mistis." },
          ],
        },
        {
          q: "Presentasi hasil \u201Clolos tipis\u201D yang benar?",
          options: [
            { text: "\u201CLOLOS di semua skenario\u201D + centang hijau", why: "False comfort — menyembunyikan jarak 0,0 pp." },
            { text: "\u201CBuffer habis di skenario terberat (jarak 0,0 pp)\u201D + opsi aksi", why: "Tepat: jujur, kuantitatif, berorientasi aksi.", correct: true },
            { text: "\u201CKita akan kiamat jika skenario severe terjadi\u201D", why: "Fear-mongering — membuat direksi defensif." },
          ],
        },
        {
          q: "Setiap skenario ekstrem wajib ditemani?",
          options: [
            { text: "Probabilitas kasar + rencana aksi", why: "Benar. Tanpa rencana aksi, skenario = horor.", correct: true },
            { text: "Grafik 3D yang dramatis", why: "Dramatisasi visual = fear-mongering." },
            { text: "Pendapat pribadi analis", why: "Opini tanpa dasar tidak menggantikan rencana." },
          ],
        },
      ],
    },
  ],
};
