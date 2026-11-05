import type { V2Lesson } from "../lib/types";

const FIG_FLOOR = `<svg viewBox="0 0 480 300" role="img" aria-label="RWA final adalah nilai terbesar antara RWA IRB dan 72,5 persen RWA SA.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Floor mengunci RWA: final = max(IRB, 72,5% × SA)</text>
<text x="10" y="58" font-size="11" fill="var(--chart-text)">RWA model internal (IRB)</text>
<rect x="220" y="45" width="180" height="24" fill="var(--c1)" opacity="0.9"/>
<text x="406" y="62" font-size="11" fill="var(--chart-text)">60</text>
<text x="10" y="98" font-size="11" fill="var(--chart-text)">RWA pendekatan standar (SA)</text>
<rect x="220" y="85" width="240" height="24" fill="var(--c2)" opacity="0.9"/>
<text x="180" y="102" font-size="11" fill="var(--chart-text)">100 →</text>
<text x="10" y="138" font-size="11" fill="var(--chart-text)">Output floor (72,5% × SA)</text>
<rect x="220" y="125" width="174" height="24" fill="var(--c4)" opacity="0.9"/>
<text x="400" y="142" font-size="11" fill="var(--chart-text)">72,5</text>
<text x="10" y="178" font-size="11" fill="var(--chart-text)">RWA final</text>
<rect x="220" y="165" width="174" height="24" fill="var(--c3)" opacity="0.9"/>
<text x="400" y="182" font-size="11" fill="var(--chart-text)">72,5</text>
<text x="10" y="220" font-size="11" fill="var(--chart-text)">IRB 60 < floor 72,5 → floor BINDING: bank wajib pakai 72,5.</text>
<text x="10" y="250" font-size="11" fill="var(--chart-text)">Model secanggih apa pun tidak boleh di bawah 72,5% SA.</text>
<text x="10" y="280" font-size="10" fill="var(--chart-text)" opacity="0.75">Angka ilustrasi (miliar rupiah ekuivalen), Basel III final.</text>
</g>
</svg>`;

const FIG_PHASEIN = `<svg viewBox="0 0 480 280" role="img" aria-label="Output floor naik bertahap dari 50 persen ke 72,5 persen.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Phase-in: floor naik bertahap, bank diberi waktu</text>
<text x="10" y="58" font-size="11" fill="var(--chart-text)">2023</text>
<rect x="120" y="45" width="120" height="24" fill="var(--c1)" opacity="0.9"/>
<text x="246" y="62" font-size="11" fill="var(--chart-text)">50%</text>
<text x="10" y="98" font-size="11" fill="var(--chart-text)">2024–2025</text>
<rect x="120" y="85" width="144" height="24" fill="var(--c1)" opacity="0.7"/>
<text x="270" y="102" font-size="11" fill="var(--chart-text)">55–60%</text>
<text x="10" y="138" font-size="11" fill="var(--chart-text)">2026–2027</text>
<rect x="120" y="125" width="162" height="24" fill="var(--c2)" opacity="0.9"/>
<text x="288" y="142" font-size="11" fill="var(--chart-text)">65–70%</text>
<text x="10" y="178" font-size="11" fill="var(--chart-text)">2028</text>
<rect x="120" y="165" width="174" height="24" fill="var(--c4)" opacity="0.9"/>
<text x="300" y="182" font-size="11" fill="var(--chart-text)">72,5% penuh</text>
<text x="10" y="220" font-size="11" fill="var(--chart-text)">Jadwal BCBS: 5 tahun dari 1 Jan 2023. UE mulai 2025, transisi s/d 2032.</text>
<text x="10" y="250" font-size="10" fill="var(--chart-text)" opacity="0.75">Sumber: BCBS Basel III final; ECB Macroprudential Bulletin Des 2023.</text>
</g>
</svg>`;

export const cr33: V2Lesson = {
  slug: "cr33-basel3-final-output-floor",
  track: "Credit Risk",
  module: "Regulasi & Fairness",
  title: "CR33 — Basel III Final: Output Floor 72,5% yang Mengunci RWA",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua bank, satu portofolio, modal beda jauh",
      prose: [
        "Bank A dan Bank B punya portofolio kredit korporasi yang nyaris identik: Rp10 triliun, debitur sejenis, agunan sejenis. Saat laporan modal terbit, kejanggalan muncul: Bank A melaporkan RWA Rp6 triliun, Bank B Rp10 triliun. Artinya Bank A hanya butuh modal Rp480 miliar untuk 'penyangga' yang sama, sementara Bank B butuh Rp800 miliar. Portofolio sama, kewajiban modal beda 67%.",
        "Twist-nya: perbedaan itu legal sepenuhnya. Bank A memakai model internal (IRB) yang ia bangun sendiri — dan modelnya 'menemukan' bahwa risikonya kecil. Bank B memakai pendekatan standar (SA) dari regulator — bobot risiko baku yang sama untuk semua bank. Pertanyaan yang mengguncang Basel: apakah Bank A benar-benar lebih aman, atau modelnya hanya lebih optimis? Studi Basel menemukan variasi RWA antarbank untuk portofolio sejenis terlalu besar untuk dijelaskan oleh perbedaan risiko semata.",
        "Jawaban Basel III final (2017, disebut 'Basel IV' oleh pasar): kunci dari bawah. Berapa pun hasil model internalmu, RWA-mu tidak boleh jatuh di bawah 72,5% dari hasil pendekatan standar. Model boleh canggih, tetapi ada batas bawah yang tidak bisa dinegosiasikan — output floor.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan mengapa Basel III final memasang output floor; (2) menghitung RWA final dari RWA IRB dan RWA SA; (3) menilai kapan floor mengikat (binding) dan kapan tidak; (4) menjelaskan dampaknya ke KPMM bank Indonesia. Prasyarat ringkas: RWA (risk-weighted assets) = total aset bank yang dibobot menurut risikonya; KPMM (rasio kecukupan modal) = modal / RWA, minimum 8% secara internasional. Bank menghitung RWA lewat dua jalur: SA (bobot baku dari regulator) atau IRB (model internal bank sendiri yang disetujui pengawas).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Output floor adalah salah satu perubahan regulasi modal terbesar dalam dua dekade — ia membatasi nilai seluruh model IRB yang dibangun tim risk. Analis risiko kredit wajib paham karena floor mengubah insentif: model internal yang terlalu optimis menjadi tidak berguna.",
      },
      reference: "Model internal boleh canggih, tetapi RWA dikunci 72,5% dari SA.",
    },
    {
      id: "kenapa",
      eyebrow: "Langkah 2 · Konsep",
      title: "Mengapa Basel tidak percaya model lagi",
      prose: [
        "Masalahnya bernama RWA variability: dua bank dengan portofolio sejenis melaporkan RWA yang jauh berbeda. Sebagian perbedaan memang wajar (komposisi portofolio tidak pernah identik), tetapi studi Basel menunjukkan sebagian besar TIDAK bisa dijelaskan oleh perbedaan risiko — melainkan oleh perbedaan asumsi dan kalibrasi model. Model internal menjadi 'kotak hitam' yang hasilnya sulit dibandingkan antarbank.",
        "Dampaknya sistemik: bila RWA bisa ditekan lewat optimisme model, rasio modal (KPMM) terlihat sehat padahal penyangga riilnya tipis. Krisis 2008 memberi pelajaran mahal: bank-bank dengan rasio modal 'memadai' ternyata kekurangan modal saat kerugian datang. Kepercayaan pasar terhadap angka RWA runtuh — dan angka yang tidak dipercaya pasar tidak berguna sebagai pengaman.",
        "Respons Basel III final punya empat kaki: (1) output floor 72,5% — batas bawah RWA dari model internal; (2) perbaikan pendekatan standar (SA) agar lebih sensitif risiko; (3) input floors pada parameter IRB (PD/LGD/EAD tidak boleh di bawah batas tertentu) plus pencabutan opsi IRB untuk eksposur tertentu; (4) kerangka risiko operasional baru. Lesson ini fokus pada kaki pertama — yang paling mengubah permainan.",
        "Kepribadiannya: output floor adalah 'rem tangan' regulasi. Ia tidak melarang model internal — bank tetap boleh membangun model terbaiknya. Tetapi ia berkata: sehebat apa pun modelmu, aku tidak percaya hasilnya di bawah 72,5% dari perhitungan standar. Kepercayaan, tetapi verifikasi — dengan angka.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: floor menghukum model yang bagus",
        type: "pitfall",
        body: "Mitos: 'Floor 72,5% menghukum bank yang modelnya akurat.' Yang benar: floor menghukum VARIABILITAS yang tidak bisa dijelaskan. Bank dengan model akurat tetapi konservatif (RWA IRB di atas 72,5% SA) tidak tersentuh floor sama sekali — floor hanya mengikat yang hasilnya terlalu rendah.",
      },
      hints: [
        "Floor dihitung dari OUTPUT (RWA), bukan dari input (PD/LGD) — karena itu namanya output floor.",
        "72,5% bukan angka magis: ia hasil kalibrasi agar floor mengikat hanya model yang agresif.",
      ],
      reference: "Floor = rem tangan atas optimisme model. Yang konservatif tak tersentuh.",
    },
    {
      id: "rumus",
      eyebrow: "Langkah 3 · Konsep",
      title: "Rumusnya: final = max(IRB, 72,5% × SA)",
      prose: [
        "Perhitungannya sederhana. Bank yang memakai model internal wajib menghitung DUA angka: RWA_IRB (dari modelnya) dan RWA_SA (dari pendekatan standar, sebagai pembanding). RWA final = max(RWA_IRB, 72,5% × RWA_SA). Ambil yang terbesar — tidak ada negosiasi.",
        "Contoh Bank A: RWA_IRB = 60, RWA_SA = 100. Floor = 72,5% × 100 = 72,5. Karena 60 < 72,5, floor BINDING — Bank A wajib melaporkan RWA 72,5, bukan 60. Kebutuhan modalnya naik dari Rp4,8 triliun (8% × 60) menjadi Rp5,8 triliun (8% × 72,5). Modelnya 'ditemukan' terlalu optimis oleh regulasi.",
        "Contoh Bank C: RWA_IRB = 80, RWA_SA = 100. Floor = 72,5. Karena 80 > 72,5, floor TIDAK binding — Bank C tetap memakai 80. Modelnya cukup konservatif sehingga lolos dari kunci. Inilah insentif yang diinginkan Basel: model yang jujur tidak dihukum.",
        "Cara membaca figur: empat batang — IRB 60, SA 100, floor 72,5, dan RWA final 72,5. Interpretasi: batang final 'terangkat' dari 60 ke 72,5 oleh floor; selisih 12,5 adalah 'pajak optimisme' yang dibayar Bank A. Perhatikan: floor dihitung dari SA (100), bukan dari IRB — bank tidak bisa menurunkan floor dengan mengutak-atik modelnya.",
      ],
      formula: String.raw`\text{RWA}_{\text{final}} = \max(\text{RWA}_{\text{IRB}},\ 0{,}725 \times \text{RWA}_{\text{SA}})`,
      formulaNote: "RWA_IRB = hasil model internal; RWA_SA = hasil pendekatan standar. Contoh: max(60; 0,725 × 100) = max(60; 72,5) = 72,5 → floor binding. Interpretasi: ambil yang terbesar; model tak boleh di bawah 72,5% SA.",
      figure: {
        svg: FIG_FLOOR,
        alt: "RWA final terangkat oleh output floor.",
        caption: "Floor binding: RWA final naik dari 60 ke 72,5.",
      },
      tasks: [],
      note: {
        title: "💡 Tips: baca 'jarak ke floor'",
        body: "Analis bank memakai rasio RWA_IRB / RWA_SA sebagai indikator awal. Di bawah 72,5% = floor akan mengikat dan modal harus ditambah (atau aset dikurangi). Di atas 80% = aman dengan margin. Satu rasio, seluruh cerita kesiapan modal.",
      },
      hints: [
        "Binding bila RWA_IRB < 0,725 × RWA_SA. Itu saja syaratnya.",
        "Floor memakai SA yang SUDAH diperbaiki Basel III final — bukan SA lama.",
      ],
      reference: "Final = max(IRB, 72,5% × SA). Binding = IRB di bawah floor.",
    },
    {
      id: "implementasi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Jadwal global: bertahap, tidak sekaligus",
      prose: [
        "Basel memberi masa transisi agar bank tidak kelabakan. Jadwal BCBS: floor dimulai 50% pada 1 Januari 2023, naik bertahap tiap tahun hingga 72,5% penuh pada 2028. Kenaikan bertahap ini disengaja — bank yang floor-nya binding punya lima tahun untuk menambah modal, menahan laba, atau merampingkan portofolio.",
        "Implementasi tiap yurisdiksi berbeda kecepatan. Uni Eropa (CRR3): aturan berlaku 1 Januari 2025 — dua tahun di belakang jadwal Basel — plus pengaturan transisi khusus (mis. bobot risiko lebih ringan untuk properti dan korporasi tanpa rating dalam perhitungan SA) yang membuat floor kurang mengikat selama transisi hingga 2032. Inggris menargetkan 2025; Amerika Serikat mengusulkan 2025. ECB mencatat implementasi penuh akan menaikkan kebutuhan modal secara material, tetapi manfaat jangka panjangnya melebihi biaya transisi.",
        "Poin penting untuk analis: selama masa transisi, angka 'RWA final' bank bergerak setiap tahun BUKAN karena portofolionya berubah, melainkan karena floor-nya naik. Membaca tren KPMM bank pada 2023–2028 tanpa mengoreksi efek phase-in = salah membaca kinerja.",
        "Cara membaca figur: batang 2023 (50%) hingga 2028 (72,5% penuh). Interpretasi: setiap kenaikan tangga = potensi kenaikan RWA bagi bank yang floor-nya binding — analis memproyeksikan kebutuhan modal bank dengan menggeser tangga ini, bukan dengan menebak.",
      ],
      formula: String.raw`\text{Floor}_t = f_t \times \text{RWA}_{\text{SA}}, \quad f_{2023} = 50\%,\ f_{2028} = 72{,}5\%`,
      formulaNote: "f_t = persentase floor pada tahun t, naik bertahap. Contoh: 2023 → 50% × SA; 2028 → 72,5% × SA. Interpretasi: RWA final bank yang binding naik setiap tahun meski portofolio tetap.",
      figure: {
        svg: FIG_PHASEIN,
        alt: "Phase-in output floor 2023–2028.",
        caption: "Floor naik bertahap: 50% (2023) → 72,5% (2028).",
      },
      tasks: [],
      note: {
        title: "Sumber",
        body: "Angka jadwal merujuk BCBS Basel III final dan ECB Macroprudential Bulletin Desember 2023 (artikel 'Basel III finalisation in the EU'). Dokumen teknis BCBS (d592) tidak dibuka langsung dalam riset lesson ini — ringkasan ECB dipakai sebagai pengganti yang setara untuk level lesson.",
      },
      hints: [
        "UE punya deviasi transisi s/d 2032 — jangan samakan jadwal UE dengan jadwal BCBS.",
        "Proyeksi modal bank 2023–2028 wajib memasukkan tangga phase-in.",
      ],
      reference: "50% (2023) → 72,5% (2028). Tren KPMM masa transisi = efek tangga.",
    },
    {
      id: "lab-floor",
      eyebrow: "Langkah 5 · Lab",
      title: "Kapan floor mengikat?",
      prose: [
        "Tiga bank, RWA_SA = 100 untuk ketiganya. RWA_IRB: Bank A = 60, Bank B = 72,5, Bank C = 85. Hitung RWA final tiap bank dengan floor 72,5% dan tandai mana yang binding.",
        "Eksperimen: turunkan floor ke 50% (jadwal 2023) — Bank A tetap binding? Naikkan ke skenario ekstrem: RWA_IRB = 40 — berapa 'pajak optimisme'-nya?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `finals` (list RWA final) untuk ketiga bank" },
        { id: "t2", text: "Jalankan dan pastikan hasilnya tercetak" },
      ],
      expected: "Bank A: RWA final 72.5 (BINDING)\nBank B: RWA final 72.5 (tidak binding)\nBank C: RWA final 85.0 (tidak binding)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Bank B: IRB 72,5 = floor 72,5 → binding.” Tepat di angka floor = TIDAK binding dalam arti tidak ada penyesuaian: final = max(72,5; 72,5) = 72,5, sama dengan hasil modelnya. Binding berarti modelnya DIKOREKSI naik oleh floor.",
      },
      hints: [
        "final = max(irb, 0.725 * sa).",
        "binding = final > irb (ada koreksi ke atas).",
      ],
      code: {
        starter: "# RWA (miliar). JANGAN UBAH.\nsa = 100.0\nirbs = [60.0, 72.5, 85.0]\nnames = [\"Bank A\", \"Bank B\", \"Bank C\"]\nfloor_pct = 0.725\n\n# TULIS KODEMU: RWA final tiap bank\nfinals =\nfor name, irb, final in zip(names, irbs, finals):\n    tag = \"BINDING\" if final > irb else \"tidak binding\"\n    print(f\"{name}: RWA final {final} ({tag})\")\n",
        lockLines: 5,
        solution: "# RWA (miliar). JANGAN UBAH.\nsa = 100.0\nirbs = [60.0, 72.5, 85.0]\nnames = [\"Bank A\", \"Bank B\", \"Bank C\"]\nfloor_pct = 0.725\n\n# TULIS KODEMU: RWA final tiap bank\nfinals = [max(irb, floor_pct * sa) for irb in irbs]\nfor name, irb, final in zip(names, irbs, finals):\n    tag = \"BINDING\" if final > irb else \"tidak binding\"\n    print(f\"{name}: RWA final {final} ({tag})\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Bank A binding 72,5", msg: "max(60; 72,5).", pattern: "Bank A: RWA final 72\\.5 \\(BINDING\\)" },
          { kind: "stdout_matches", task: "t2", label: "Bank C tetap 85", msg: "max(85; 72,5) = 85.", pattern: "Bank C: RWA final 85\\.0 \\(tidak binding\\)" }
        ],
      },
      reference: "Final = max(IRB, 0,725 × SA). Binding = dikoreksi naik.",
    },
    {
      id: "indonesia",
      eyebrow: "Langkah 6 · Konsep",
      title: "Dampak ke bank Indonesia: KPMM ikut bergerak",
      prose: [
        "KPMM = modal / RWA. Bila RWA naik karena floor binding sementara modal tetap, KPMM TURUN. Bank A tadi: modal Rp5,8 triliun, RWA naik 60 → 72,5, KPMM turun dari 9,67% menjadi 8,00% — persis di batas minimum. Bank yang tadinya 'nyaman' tiba-tiba harus memilih: tambah modal (rights issue, tahan laba), kurangi aset berisiko, atau geser ke aset berbobot ringan.",
        "Kabar baiknya untuk Indonesia: mayoritas bank Indonesia memakai pendekatan standar (SA), bukan model internal. Bagi bank SA murni, output floor tidak relevan — tidak ada RWA_IRB yang perlu dikunci. Floor hanya menggigit bank yang memakai (atau berencana memakai) IRB, umumnya bank besar dengan portofolio kompleks.",
        "Namun ada efek tidak langsung yang menyentuh semua bank: SA versi Basel III final sendiri berubah (bobot lebih sensitif risiko, mis. untuk KPR dan korporasi tanpa rating), dan kerangka risiko operasional diganti total. Jadi RWA_SA bank Indonesia pun bergerak — dan karena floor dihitung dari SA yang baru, seluruh sistem perlu menghitung ulang.",
        "OJK mengadopsi reformasi Basel III secara bertahap melalui ketentuan KPMM. Analis bank Indonesia memakai lesson ini untuk dua hal: memproyeksikan kebutuhan modal bank-bank besar bila IRB mereka binding, dan menjelaskan ke manajemen mengapa 'KPMM turun padahal tidak ada kredit macet' — jawabannya bisa jadi sekadar tangga phase-in floor.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: floor menaikkan RWA semua bank",
        type: "pitfall",
        body: "Mitos: 'Basel III final menaikkan RWA semua bank Indonesia.' Yang benar: floor HANYA menyentuh bank IRB yang hasilnya di bawah 72,5% SA — bank SA murni tidak kena floor. Yang menyentuh semua bank adalah perubahan SA-nya sendiri, bukan floor-nya. Bedakan keduanya saat menjelaskan ke direksi.",
      },
      hints: [
        "KPMM turun bukan selalu kabar buruk — cek dulu apakah penyebabnya floor/aturan atau kerugian riil.",
        "Bank SA murni: fokus ke perubahan bobot SA, bukan ke floor.",
      ],
      reference: "KPMM = modal/RWA. Floor hanya menggigit bank IRB yang agresif.",
    },
    {
      id: "lab-kpmm",
      eyebrow: "Langkah 7 · Lab",
      title: "Simulasi KPMM sebelum dan sesudah floor",
      prose: [
        "Bank A: modal Rp5,8 triliun, RWA_IRB = 60, RWA_SA = 100 (triliun). Hitung KPMM sebelum floor (pakai IRB) dan sesudah floor 72,5%, lalu tentukan apakah masih di atas minimum 8%.",
        "Eksperimen: naikkan modal ke Rp6,5 triliun — berapa KPMM sesudah floor? Inilah matematika rights issue: setiap rupiah modal baru mengangkat KPMM sebesar 1/RWA_final.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kpmm_before` dan `kpmm_after` (dalam %)" },
        { id: "t2", text: "Jalankan dan pastikan hasilnya tercetak" },
      ],
      expected: "KPMM sebelum floor: 9.67%\nKPMM sesudah floor: 8.00%",
      note: {
        title: "Intuisi",
        body: "Dari 9,67% ke 8,00% tanpa satu pun kredit macet — murni efek aturan. Inilah mengapa analis modal selalu memisahkan 'perubahan regulasi' dari 'perubahan risiko' dalam menjelaskan pergerakan KPMM.",
      },
      hints: [
        "KPMM = modal / RWA_final × 100.",
        "RWA_final sesudah floor = 72,5 (dari lab sebelumnya).",
      ],
      code: {
        starter: "# Triliun rupiah. JANGAN UBAH.\nmodal = 5.8\nrwa_irb = 60.0\nrwa_sa = 100.0\nfloor_pct = 0.725\n\n# TULIS KODEMU: KPMM (%) sebelum dan sesudah floor\nkpmm_before =\nkpmm_after =\nprint(f\"KPMM sebelum floor: {kpmm_before:.2f}%\")\nprint(f\"KPMM sesudah floor: {kpmm_after:.2f}%\")\n",
        lockLines: 5,
        solution: "# Triliun rupiah. JANGAN UBAH.\nmodal = 5.8\nrwa_irb = 60.0\nrwa_sa = 100.0\nfloor_pct = 0.725\n\n# TULIS KODEMU: KPMM (%) sebelum dan sesudah floor\nrwa_final = max(rwa_irb, floor_pct * rwa_sa)\nkpmm_before = modal / rwa_irb * 100\nkpmm_after = modal / rwa_final * 100\nprint(f\"KPMM sebelum floor: {kpmm_before:.2f}%\")\nprint(f\"KPMM sesudah floor: {kpmm_after:.2f}%\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "KPMM before = 9,67%", msg: "5,8/60.", name: "kpmm_before", value: 9.6667, tol: 0.01 },
          { kind: "equal", task: "t1", label: "KPMM after = 8,00%", msg: "5,8/72,5.", name: "kpmm_after", value: 8.0, tol: 0.01 }
        ],
      },
      reference: "KPMM = modal / RWA × 100. Floor menurunkan KPMM tanpa kerugian.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Membaca posisi bank terhadap floor",
      prose: [
        "Satu: rasio RWA_IRB/RWA_SA < 72,5% → floor binding; siapkan strategi modal (tahan laba, rights issue) atau rampingkan portofolio. Dua: rasio 72,5–80% → zona waspada; sensitivitas: sedikit pelebaran SA (mis. downgrade portofolio) bisa membuat floor binding. Tiga: rasio > 80% → aman; model internal tetap sepenuhnya menentukan RWA.",
        "Empat: bank SA murni → floor tidak relevan; fokus ke perubahan bobot SA Basel III final dan kerangka risiko operasional baru. Lima: membaca laporan bank lain → bila KPMM turun pada 2023–2028 tanpa kenaikan NPL, curigai efek phase-in floor sebelum menyimpulkan kinerja memburuk.",
        "Aturan praktis 10 detik: hitung rasio IRB/SA. Di bawah 72,5% = tambah modal atau kurangi aset. Di atasnya = modelmu masih berkuasa.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Output floor mengubah pertanyaan analis dari 'berapa RWA model kita?' menjadi 'berapa JARAK model kita ke floor?'. Jarak itulah ruang gerak modal bank untuk lima tahun ke depan.",
      },
      reference: "Rasio IRB/SA = kompas. < 72,5% binding; > 80% aman.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Direksi terkejut KPMM-nya",
      prose: [
        "Bank Merdeka (fiktif) memakai IRB untuk kredit korporasi. Akhir 2027: RWA_IRB Rp60 triliun, RWA_SA Rp100 triliun, modal Rp5,8 triliun. Floor 2027 = 70% (tangga phase-in). Direksi melihat KPMM 9,67% (5,8/60) dan merasa aman. Tim risk menghitung ulang: floor = 70% × 100 = 70 > 60 → RWA final 70 → KPMM sebenarnya 8,29%.",
        "Pertanyaan: (a) Mengapa direksi salah? (b) Apa yang terjadi pada 2028 (floor 72,5%)? (c) Opsi apa yang dimiliki bank? Pembahasan: (a) Direksi memakai RWA_IRB mentah, mengabaikan floor yang sudah binding sejak 2023. (b) 2028: floor 72,5 → RWA final 72,5 → KPMM 8,00% — tepat di minimum, tanpa buffer. (c) Tahan laba Rp700 miliar (modal → 6,5; KPMM → 8,97%), kurangi eksposur korporasi berisiko, atau geser ke aset berbobot SA ringan. Menunggu 2028 tanpa aksi = pelanggaran potensial.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kasus ini mensimulasikan jebakan nyata masa transisi: angka KPMM 'versi model' vs 'versi floor' berbeda, dan yang berlaku adalah versi floor. Tim risk yang tidak memproyeksikan tangga phase-in akan selalu terlambat memberi peringatan.",
      },
      reference: "Yang berlaku = versi floor. Proyeksikan tangganya, jangan tunggu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — floor adalah soal kepercayaan terhadap model.",
      ],
      tasks: [],
      summary: [
        "Output floor = RWA model internal tidak boleh di bawah 72,5% RWA pendekatan standar.",
        "RWA final = max(RWA_IRB, 0,725 × RWA_SA); binding bila IRB di bawah floor.",
        "Tujuan: menekan variabilitas RWA antarbank dan memulihkan kepercayaan pasar.",
        "Phase-in 2023 (50%) → 2028 (72,5%); UE mulai 2025 dengan transisi s/d 2032.",
        "Dampak: KPMM bank IRB yang binding turun tanpa kerugian riil; bank SA murni tak kena floor.",
      ],
      next: { label: "CR4a — Basel, RWA & KPMM", href: "/learn/cr4a-basel-rwa-kpmm" },
      quiz: [
        {
          q: "RWA_IRB = 60, RWA_SA = 100, floor 72,5%. RWA final?",
          options: [
            { text: "72,5 (floor binding)", why: "Benar: max(60; 72,5) = 72,5.", correct: true },
            { text: "60", why: "Itu hasil model mentah — floor mengoreksinya naik." },
            { text: "100", why: "Floor 72,5% dari SA, bukan 100% SA." },
            { text: "66,25 (rata-rata)", why: "Tidak ada rata-rata — ambil nilai terbesar." }
          ],
        },
        {
          q: "Tujuan utama output floor?",
          options: [
            { text: "Membatasi variabilitas RWA akibat optimisme model internal", why: "Benar: mengunci hasil model dari bawah.", correct: true },
            { text: "Menghapus pendekatan standar", why: "Sebaliknya — SA menjadi jangkar perhitungan." },
            { text: "Menaikkan modal semua bank 72,5%", why: "Floor soal RWA, bukan perkalian modal; hanya yang binding terdampak." },
            { text: "Melarang bank memakai model internal", why: "Model internal tetap boleh — hanya hasilnya dibatasi bawah." }
          ],
        },
        {
          q: "Kapan floor TIDAK mengikat bank?",
          options: [
            { text: "RWA_IRB sudah di atas 72,5% × RWA_SA", why: "Benar: max mengambil hasil modelnya sendiri.", correct: true },
            { text: "RWA_IRB = 50% × RWA_SA", why: "Itu justru binding — 50% di bawah floor 72,5%." },
            { text: "Pada tahun 2023 (floor 50%)", why: "Floor 50% tetap bisa binding bagi model agresif." },
            { text: "Bila bank menambah modal", why: "Modal tidak mengubah RWA — floor tetap dihitung sama." }
          ],
        },
        {
          q: "Modal Rp5,8 T, RWA final naik 60 → 72,5. Efek ke KPMM?",
          options: [
            { text: "Turun 9,67% → 8,00%", why: "Benar: 5,8/60 vs 5,8/72,5.", correct: true },
            { text: "Tetap 9,67%", why: "RWA berubah — KPMM ikut berubah." },
            { text: "Naik karena modal tetap", why: "Penyebut membesar → rasio mengecil." },
            { text: "Turun ke 0%", why: "Berlebihan — hitung ulang rasionya." }
          ],
        },
        {
          q: "Bank Indonesia mayoritas memakai SA. Implikasi floor bagi mereka?",
          options: [
            { text: "Floor tidak relevan langsung; yang relevan perubahan bobot SA-nya", why: "Benar: floor mengunci IRB, bank SA tak punya IRB.", correct: true },
            { text: "Semua bank wajib menambah modal 72,5%", why: "Salah kaprah — 72,5% adalah rasio terhadap SA, bukan kenaikan modal." },
            { text: "Tidak ada dampak Basel III final sama sekali", why: "Ada — perubahan SA dan risiko operasional menyentuh semua bank." },
            { text: "Bank SA dilarang beralih ke IRB", why: "Tidak dilarang — hanya hasil IRB-nya nanti dikunci floor." }
          ],
        }
      ],
      reference: "Floor = kunci bawah model. Final = max. Binding = tambah modal/kurangi aset.",
    },
  ],
};
