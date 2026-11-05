import type { V2Lesson } from "../lib/types";

// ── Figure: QD lima varian + ambang filter 2,0 ────────────────────────────
const QD_SVG = `<svg viewBox="0 0 560 280" role="img" aria-label="Diagram batang nilai QD lima varian dengan garis ambang filter 2">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="48" y1="230.0" x2="520" y2="230.0"/>
<line x1="48" y1="185.6" x2="520" y2="185.6"/>
<line x1="48" y1="141.1" x2="520" y2="141.1"/>
<line x1="48" y1="96.7" x2="520" y2="96.7"/>
<line x1="48" y1="52.2" x2="520" y2="52.2"/>
</g><g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="42" y="234.0">0</text>
<text x="42" y="189.6">2</text>
<text x="42" y="145.1">4</text>
<text x="42" y="100.7">6</text>
<text x="42" y="56.2">8</text>
</g><g>
<rect x="74.4" y="141.1" width="41.5" height="88.9" fill="var(--c1)" opacity="0.9"/>
<text x="95.2" y="133.1" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">4.0</text>
<text x="95.2" y="246" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">v1</text>
<rect x="168.8" y="205.1" width="41.5" height="24.9" fill="var(--c2)" opacity="0.9"/>
<text x="189.6" y="197.1" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">1.12</text>
<text x="189.6" y="246" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">v2</text>
<rect x="263.2" y="218.9" width="41.5" height="11.1" fill="var(--c2)" opacity="0.9"/>
<text x="284.0" y="210.9" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">0.5</text>
<text x="284.0" y="246" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">v3</text>
<rect x="357.6" y="52.2" width="41.5" height="177.8" fill="var(--c1)" opacity="0.9"/>
<text x="378.4" y="44.2" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">8.0</text>
<text x="378.4" y="246" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">v4</text>
<rect x="452.0" y="130.0" width="41.5" height="100.0" fill="var(--c1)" opacity="0.9"/>
<text x="472.8" y="122.0" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">4.5</text>
<text x="472.8" y="246" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">v5</text>
</g>
<line x1="48" y1="185.6" x2="520" y2="185.6" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="516" y="177.6" text-anchor="end" font-size="11" fill="var(--c2)" font-family="var(--font-ui)">ambang QD = 2,0 (di bawah ini = gagal)</text>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)"><text x="48" y="14">QD = QUAL/DP per varian (merah = QD di bawah ambang; biru = QD lolos ambang)</text><text x="520" y="260" text-anchor="end">varian (data sintetis)</text></g></svg>`;

export const bi20: V2Lesson = {
  slug: "bi20-gatk-best-practices",
  track: "Bioinformatika",
  module: "NGS & Statistik",
  title: "GATK Best Practices: Seni Memanggil Varian dengan Benar",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu sampel, dua daftar mutasi",
      prose: [
        "Sebuah lab klinik menerima satu sampel eksom pasien kanker. Teknisi A menjalankan pipeline standar; teknisi B menjalankan pipeline “yang sama” — beda versi satu tool, beda satu parameter filter. Hasilnya: A melaporkan 4,2 juta varian, B melaporkan 3,8 juta. Selisih 400.000 varian — dan di antaranya ada satu varian kandidat penyebab penyakit yang muncul di daftar A tetapi hilang di daftar B. Dokter bertanya: “jadi pasien saya punya mutasi ini atau tidak?”",
        "Jawaban jujurnya: tidak ada yang tahu — karena variant calling bukan “membaca” mutasi seperti membaca teks. Ia adalah penimbangan bukti statistik: seberapa yakin kita bahwa tumpukan read ini menunjukkan alel alternatif, bukan error mesin? Twist-nya: perbedaan 400.000 itu hampir tidak pernah berasal dari aligner atau dari data — ia berasal dari keputusan STATISTIK: bagaimana skor kualitas dikalibrasi ulang, bagaimana likelihood genotipe dihitung, dan di mana garis filter ditarik. Dua pipeline “sama” dengan statistik berbeda = dua kebenaran berbeda.",
        "GATK Best Practices adalah upaya komunitas (Broad Institute) untuk membakukan keputusan-keputusan itu: urutan langkah yang terbukti, dari BQSR hingga VQSR-vs-hard-filter. Di lesson ini kamu masuk ke ruang mesinnya — bukan sekadar “jalankan HaplotypeCaller”, melainkan memahami matematika yang membuat satu varian lolos dan 400.000 lainnya gugur.",
      ],
      tasks: [],
      note: {
        title: "Batas lesson ini — baca dulu",
        type: "risk",
        body: "Lesson bi8 membahas ORKESTRASI pipeline NGS ujung-ke-ujung (QC → alignment → deduplikasi → calling → VCF): urutan langkah dan tool-nya. Lesson INI tidak mengulang itu — ia masuk ke KEDALAMAN STATISTIK satu tahap pipeline: variant calling. Yang dibahas di sini: BQSR (kalibrasi skor), HaplotypeCaller (likelihood genotipe), VQSR vs hard filter (QD/FS/MQ/SOR), serta joint genotyping vs DRAGEN. Kalau kamu butuh urutan langkahnya — QC read → alignment → tandai duplikat → kalibrasi skor → calling → VCF → anotasi/filter — ringkasannya sudah ada di peta lesson ini; kalau kamu butuh “kenapa varian ini lolos filter”, lanjutkan di sini.",
      },
      reference: "Orkestrasi = urutan langkah pipeline. Lesson ini = statistik calling (kenapa varian lolos/gugur).",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan kenapa skor kualitas mesin perlu dikalibrasi ulang (BQSR) dan bagaimana model kovariatnya bekerja; (2) menjelaskan cara HaplotypeCaller menghitung likelihood genotipe lewat perakitan lokal + pairHMM; (3) menghitung metrik anotasi (QD, FS, MQ, SOR) dan menerapkan hard filter rekomendasi GATK — serta menjelaskan kapan harus memakai VQSR sebagai gantinya; (4) membedakan joint genotyping, single-sample calling, dan akselerasi DRAGEN — dan memilih yang tepat untuk proyekmu.",
        "Rutenya: cerita + batas lesson → bekal ringkas → tiga konsep inti (BQSR, HaplotypeCaller, VQSR-vs-hard-filter) → lab Pyodide (mesin hard filter) → chart QD dengan panduan baca → peta keputusan → mini-case klinik → kuis → rangkuman. Estimasi 50 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pipeline NGS standar berjalan: kontrol kualitas read → alignment ke referensi → tandai duplikat PCR → kalibrasi skor → variant calling → VCF → anotasi dan filter. File VCF mencatat tiap varian kandidat beserta kolom bukti: QUAL (keyakinan), DP (kedalaman), dan anotasi seperti MQ/FS/SOR. Lesson ini mengasumsikan kamu sudah sampai di tahap “punya BAM yang sudah di-align” — dan bertanya: dari tumpukan read ini, varian mana yang benar-benar ada?",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap variant calling seperti juri kontes menyanyi yang buta — ia tidak melihat penyanyinya (DNA asli), hanya mendengar rekaman ber-noise (read). BQSR = mengkalibrasi mikrofonnya; HaplotypeCaller = menilai dari konteks lagu, bukan satu nada; filter = memutuskan siapa lolos audisi.",
      ],
      reference: "Bekal: alur NGS QC→BAM→VCF; VCF menyimpan QUAL/DP/anotasi sebagai bahan bukti. Mulai dari BAM yang sudah rapi.",
    },
    {
      id: "konsep-bqsr",
      eyebrow: "Langkah 3 · Konsep",
      title: "BQSR — Si Tukang Kalibrasi Ulang",
      prose: [
        "Definisi: Base Quality Score Recalibration (BQSR) mengoreksi skor kualitas (Q) yang dilaporkan mesin sequencer karena skor itu bias secara sistematis — bergantung pada siklus baca (read cycle), konteks dinukleotida sebelumnya, dan faktor teknis lain. BQSR membangun tabel tingkat error EMPIRIS per kombinasi kovariat: ia melihat posisi-posisi yang DIKETAHUI bukan varian (dengan mengecualikan situs varian dari dbSNP), menghitung “dari 1 juta basa dengan skor Q30 di siklus 100, berapa yang mismatch terhadap referensi?”, lalu menulis ulang skornya. Skor yang keluar bukan lagi “kata mesin”, melainkan “kata data”.",
        "Kepribadiannya: BQSR adalah teknisi kalibrasi yang tidak percaya pada label pabrik. Mesin bilang Q30 (error 1:1000)? BQSR mengecek sendiri: di konteks ini, mismatch empirisnya 1:500 — maka skornya diturunkan. Tanpa BQSR, HaplotypeCaller menimbang bukti dengan timbangan yang miring: ia terlalu percaya pada basa-basa yang sebenarnya ber-noise, dan variant calling berikutnya mewarisi kebohongan kecil itu menjadi ratusan ribu panggilan palsu.",
        "Kapan memakai: BQSR adalah langkah WAJIB Best Practices untuk data Illumina short-read sebelum HaplotypeCaller. Pengecualiannya sedikit: data yang memang tidak punya skor bermakna (beberapa data lama), atau pipeline yang memakai model error sendiri (beberapa caller modern). Aturan praktis: bila kamu memakai GATK HaplotypeCaller, jalankan BQSR — tanpa debat.",
      ],
      formula: String.raw`Q_{\text{recal}} = -10 \log_{10}\!\left(\frac{\text{mismatch empiris} + 1}{\text{total basa} + 2}\right)`,
      formulaNote: "Q_recal = skor Phred terkoreksi per bin kovariat (kombinasi siklus + konteks + skor awal); mismatch empiris = jumlah basa yang tidak cocok dengan referensi di situs non-varian; total basa = seluruh basa di bin itu. Contoh: bin dengan 1.000.000 basa dan 2.000 mismatch → error ≈ 0,002 → Q ≈ 27 — bila mesin mengklaim Q35 untuk bin itu, BQSR menurunkannya ke ~27. Interpretasi: BQSR mengubah skor dari “klaim pabrik” menjadi “pengukuran”. (+1/+2 adalah pseudocount agar bin kecil tidak menghasilkan error nol.)",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Skor Q30 dari mesin sudah cukup — kalibrasi cuma formalitas”",
        type: "pitfall",
        body: "Yang benar: bias skor itu SISTEMATIS, bukan acak — mis. basa di akhir read secara konsisten overconfident. Error sistematis tidak hilang dengan coverage tinggi; ia justru mengkristal menjadi panggilan varian palsu yang “didukung banyak read”. BQSR menghapus biasnya di hulu, sebelum meracuni hilir.",
      },
      hints: [
        "💡 Intuisi: bedakan error ACAK (diobati coverage/konsensus) vs BIAS SISTEMATIS (hanya diobati kalibrasi). BQSR ada untuk yang kedua — dan variant calling tanpa BQSR seperti menimbang dengan timbangan yang jarumnya miring.",
      ],
      reference: "BQSR = kalibrasi skor per kovariat dari mismatch empiris. Wajib sebelum HaplotypeCaller (Illumina).",
    },
    {
      id: "konsep-haplotypecaller",
      eyebrow: "Langkah 4 · Konsep",
      title: "HaplotypeCaller — Si Pembaca Konteks",
      prose: [
        "Definisi: HaplotypeCaller tidak menilai tiap posisi secara independen — ia menemukan region AKTIF (ada bukti variasi), merakit ulang read di region itu secara lokal (de novo assembly mini, mirip graf de Bruijn), lalu menghitung likelihood tiap haplotipe kandidat dengan model pairHMM, dan dari situ likelihood tiap GENOTIPE. Keputusan akhirnya Bayesian: genotipe dengan posterior tertinggi menang.",
        "Kepribadiannya: ia pembaca konteks, bukan pembaca huruf. Caller naif melihat tumpukan basa di satu posisi (“8 dari 10 read bilang T”) — mudah dikelabui oleh misalignment di sekitar indel. HaplotypeCaller membaca kalimatnya dulu (merakit haplotipe lokal), baru memutuskan hurufnya. Itulah kenapa ia jauh lebih akurat di sekitar indel dan region kompleks: ia tidak bertanya “apa huruf di posisi ini?”, melainkan “haplotipe mana yang paling menjelaskan seluruh region ini?”.",
        "Kapan memakai: HaplotypeCaller (mode GVCF) adalah standar untuk germline SNP+indel. Untuk SOMATIK (tumor/normal), ia BUKAN pilihannya — pakai Mutect2 yang modelnya dirancang untuk frekuensi alel rendah dan heterogenitas tumor. Salah memilih caller = memakai juri kontes menyanyi untuk menilai lomba puisi.",
      ],
      formula: String.raw`P(G \mid D) = \frac{P(D \mid G)\,P(G)}{P(D)}`,
      formulaNote: "P(G|D) = posterior genotipe G (yang dilaporkan sebagai GT di VCF); P(D|G) = likelihood — dihitung pairHMM dari perakitan lokal; P(G) = prior (dari frekuensi populasi / heterozigositas ekspektasi); P(D) = normalisasi. Contoh baca VCF: PL 0,45,300 berarti genotipe 0/0 paling mungkin (PL=0), 0/1 kalah 45 poin Phred (≈ 1:30.000), 1/1 mustahil. Interpretasi: kolom PL/GQ di VCF BUKAN hiasan — ia adalah seluruh penalaran Bayesian yang diringkas menjadi angka.",
      tasks: [],
      hints: [
        "💡 Intuisi: tiga lapis pertahanan HaplotypeCaller — (1) region aktif (jangan buang waktu di region membosankan), (2) perakitan lokal (baca konteks, bukan huruf), (3) Bayes (timbang bukti dengan prior). Caller yang hanya punya lapis (3) tanpa (2) akan kalah di setiap indel.",
      ],
      reference: "HaplotypeCaller = assembly lokal + pairHMM + Bayes. Germline ya; somatik pakai Mutect2.",
    },
    {
      id: "konsep-filter",
      eyebrow: "Langkah 5 · Konsep",
      title: "VQSR vs Hard Filter — Si Penjaga Gerbang",
      prose: [
        "Definisi: setelah varian dipanggil, sebagian adalah artefak — penjaga gerbang memutuskan siapa lolos. Dua strategi: (a) VQSR (Variant Quality Score Recalibration): melatih model campuran Gaussian atas varian yang DIKETAHUI benar/salah (HapMap, Omni, 1000G), memakai ANOTASI (QD, FS, MQ, SOR, ReadPosRankSum…) sebagai fitur, lalu memberi tiap varian skor VQSLOD = log-odds “benar vs artefak”. (b) Hard filtering: aturan ambang manual per anotasi — rekomendasi GATK untuk SNP: QD < 2,0; MQ < 40,0; FS > 60,0; SOR > 3,0; MQRankSum < −12,5; ReadPosRankSum < −8,0 (tanda “<”/“>” menunjukkan arah gagalnya).",
        "Kepribadiannya: VQSR adalah perekrut berbasis data — ia BELAJAR dari contoh benar/salah seperti apa rupa artefak di DATASET-MU. Hard filter adalah satpam dengan daftar ceklis — cepat, transparan, tetapi buta terhadap kekhasan datasetmu. Aturan memilihnya tegas: VQSR butuh BANYAK varian untuk belajar (satu WGS, atau 30+ eksom) — untuk panel kecil / sedikit sampel, VQSR tidak punya cukup murid untuk dilatih, dan hard filter adalah satu-satunya pilihan yang waras.",
        "Kapan memakai: WGS / kohort besar → VQSR dengan tranche (mis. 99,0 untuk SNP — artinya ambang yang mempertahankan 99% varian “benar” pelatihan). Eksperimen kecil / panel gen → hard filter dengan ambang GATK sebagai TITIK AWAL, lalu sesuaikan sambil melihat distribusi anotasi (plot QD vs FS sebelum mematok garis). Anotasi kuncinya: QD = QUAL/DP (keyakinan per kedalaman — varian dengan QUAL 500 pada DP 200 patut dicurigai); FS = bias strand (varian asli muncul di kedua strand); MQ = kualitas pemetaan RMS; SOR = bias strand versi odds.",
      ],
      formula: String.raw`\text{QD} = \frac{\text{QUAL}}{\text{DP}} \qquad \text{FS} = -10\log_{10}(p_{\text{Fisher}})`,
      formulaNote: "QD (QualByDepth): QUAL dibagi kedalaman — menormalisasi keyakinan terhadap dukungan. QUAL 120 pada DP 30 → QD 4,0 (bagus); QUAL 120 pada DP 300 → QD 0,4 (mencurigakan — keyakinan tidak tumbuh bersama bukti). FS (FisherStrand): −10 log10 dari uji Fisher bias strand; FS > 60 berarti alel alternatif hampir eksklusif di satu strand — pola khas artefak sekuensing, bukan biologi. Interpretasi: anotasi adalah “sidik jari” artefak — tiap metrik menangkap satu pola kecurangan yang berbeda.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “QUAL 500 pasti varian bagus — tidak perlu lihat DP”",
        type: "pitfall",
        body: "Yang benar: QUAL tanpa DP seperti nilai ujian tanpa tahu jumlah soalnya. QUAL 500 pada DP 500 (QD = 1,0) jauh lebih mencurigakan daripada QUAL 100 pada DP 20 (QD = 5,0) — keyakinan harus tumbuh SEBANDING dengan bukti. Inilah tepatnya kenapa GATK memakai QD, bukan QUAL mentah, sebagai fitur filter.",
      },
      hints: [
        "💡 Intuisi: hafalkan arahnya — QD dan MQ: makin BESAR makin bagus (gagal bila kecil); FS dan SOR: makin besar makin BURUK (gagal bila besar). Salah arah = filter yang meloloskan artefak dan membuang varian asli.",
        "💡 Intuisi 2: joint genotyping (GenotypeGVCFs atas banyak sampel) vs single-sample — menggabungkan sampel menambah kekuatan untuk varian langka (bukti dari banyak individu), tetapi menambah kompleksitas komputasi. DRAGEN adalah jawaban perangkat-kerasnya: implementasi FPGA yang mempercepat GATK puluhan kali untuk pipeline produksi — statistiknya sama, mesinnya berbeda.",
      ],
      reference: "Banyak varian (WGS/30+ eksom) → VQSR. Sedikit → hard filter (QD<2, MQ<40, FS>60, SOR>3 sebagai titik awal).",
    },
    {
      id: "lab-hardfilter",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Jadi penjaga gerbang",
      prose: [
        "Waktunya jadi filter-nya. Di bawah ada 5 varian sintetis dengan anotasi VCF-nya. Tugasmu: tulis dua fungsi — `qd(v)` = QUAL/DP, dan `hard_filter(v)` yang mengembalikan LIST nama filter yang GAGAL (aturan SNP GATK: QD < 2,0; MQ < 40,0; FS > 60,0; SOR > 3,0) — lalu jalankan ringkasannya.",
        "Coba: setelah lolos, ubah ambang QD menjadi 5,0. Berapa yang lolos sekarang? Itulah sensitivitas keputusanmu terhadap satu angka — dan kenapa ambang harus dipilih sambil melihat distribusi, bukan dihafal mati.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `qd(v)`: kembalikan `v['QUAL'] / v['DP']`" },
        { id: "t2", text: "Lengkapi `hard_filter(v)`: list filter yang gagal (urutan: QD, MQ, FS, SOR)" },
        { id: "t3", text: "Jalankan dan pastikan 6 baris ringkasan tercetak" },
      ],
      expected: "v1: QD=4.00 lolos\nv2: QD=1.12 gagal=['QD', 'MQ', 'FS']\nv3: QD=0.50 gagal=['QD']\nv4: QD=8.00 gagal=['SOR']\nv5: QD=4.50 lolos\nlolos=2/5",
      hints: [
        "Struktur: `fails = []`, lalu empat `if` yang masing-masing `append` nama filternya.",
        "v4 jebakan: QD-nya 8,0 (bagus!) tetapi SOR 3,8 > 3,0 — filter yang baik menangkap artefak dari BANYAK sisi, bukan satu metrik.",
      ],
      code: {
        starter: `# 5 varian SINTETIS dengan anotasi gaya VCF (bukan data pasien asli)
variants = [
    {"id": "v1", "QUAL": 120, "DP": 30, "FS": 2.1,  "MQ": 60, "SOR": 0.8},
    {"id": "v2", "QUAL": 45,  "DP": 40, "FS": 70.5, "MQ": 38, "SOR": 1.2},
    {"id": "v3", "QUAL": 25,  "DP": 50, "FS": 1.0,  "MQ": 59, "SOR": 0.5},
    {"id": "v4", "QUAL": 200, "DP": 25, "FS": 5.0,  "MQ": 61, "SOR": 3.8},
    {"id": "v5", "QUAL": 90,  "DP": 20, "FS": 0.2,  "MQ": 60, "SOR": 0.9},
]

# TULIS KODEMU: dua fungsi di bawah ini
def qd(v):
    return

def hard_filter(v):
    return

for v in variants:
    fails = hard_filter(v)
    status = "lolos" if not fails else f"gagal={fails}"
    print(f'{v["id"]}: QD={qd(v):.2f} {status}')
n_pass = sum(1 for v in variants if not hard_filter(v))
print(f"lolos={n_pass}/5")`,
        lockLines: 9,
        solution: `# 5 varian SINTETIS dengan anotasi gaya VCF (bukan data pasien asli)
variants = [
    {"id": "v1", "QUAL": 120, "DP": 30, "FS": 2.1,  "MQ": 60, "SOR": 0.8},
    {"id": "v2", "QUAL": 45,  "DP": 40, "FS": 70.5, "MQ": 38, "SOR": 1.2},
    {"id": "v3", "QUAL": 25,  "DP": 50, "FS": 1.0,  "MQ": 59, "SOR": 0.5},
    {"id": "v4", "QUAL": 200, "DP": 25, "FS": 5.0,  "MQ": 61, "SOR": 3.8},
    {"id": "v5", "QUAL": 90,  "DP": 20, "FS": 0.2,  "MQ": 60, "SOR": 0.9},
]

# TULIS KODEMU: dua fungsi di bawah ini
def qd(v):
    return v["QUAL"] / v["DP"]

def hard_filter(v):
    fails = []
    if qd(v) < 2.0:
        fails.append("QD")
    if v["MQ"] < 40.0:
        fails.append("MQ")
    if v["FS"] > 60.0:
        fails.append("FS")
    if v["SOR"] > 3.0:
        fails.append("SOR")
    return fails

for v in variants:
    fails = hard_filter(v)
    status = "lolos" if not fails else f"gagal={fails}"
    print(f'{v["id"]}: QD={qd(v):.2f} {status}')
n_pass = sum(1 for v in variants if not hard_filter(v))
print(f"lolos={n_pass}/5")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "v3: QD=0\\.50", label: "`qd` v3 = 0,50", msg: "25/50 = 0,5 — keyakinan kecil relatif terhadap kedalaman." },
          { kind: "stdout_matches", task: "t2", pattern: "v2: QD=1\\.12 gagal=\\['QD', 'MQ', 'FS'\\]", label: "v2 gagal tiga filter", msg: "QD 1,12 < 2; MQ 38 < 40; FS 70,5 > 60 — artefak dari tiga sisi." },
          { kind: "stdout_matches", task: "t2", pattern: "v4: QD=8\\.00 gagal=\\['SOR'\\]", label: "v4 hanya gagal SOR", msg: "QD 8,0 bagus tetapi SOR 3,8 > 3,0 — filter multi-sisi menangkapnya." },
          { kind: "stdout_matches", task: "t3", pattern: "lolos=2/5", label: "2 dari 5 varian lolos", msg: "Hanya v1 dan v5 yang bersih dari semua filter." },
        ],
      },
      note: {
        title: "Intuisi: filter yang baik menjelaskan KENAPA, bukan sekadar ketat",
        body: "Kurator varian berpengalaman menyimpan lima heuristik. Satu: “lebih ketat = lebih aman” adalah sesat — ambang filter dipilih dari DISTRIBUSI anotasi dataset-mu (plot QD vs FS dulu, baru patok garis), bukan dari angka hafalan; ambang buta membuang varian asli demi rasa aman palsu. Dua: QD tanpa DP menipu — QUAL 500 pada DP 200 (QD 2,5) jauh lebih mencurigakan daripada QUAL 60 pada DP 15 (QD 4,0); keyakinan harus tumbuh bersama bukti. Tiga: satu anotasi tidak cukup — artefak canggih lolos dari satu penjaga tetapi tertangkap panel (varian dengan QD 8,0 bisa gagal SOR karena bias strand); filter memakai panel anotasi, bukan satu angka. Empat: VQSR hanya bila datanya cukup — butuh banyak varian untuk melatih model (satu WGS atau 30+ eksom); untuk panel kecil, hard filter transparan adalah satu-satunya pilihan jujur. Lima: pilih caller sesuai biologi — HaplotypeCaller untuk germline diploid, Mutect2 untuk somatik dengan frekuensi alel kontinu; model yang salah = panggilan yang salah, seberapa pun bagusnya filter. Heuristik gabungannya: analis yang baik bisa menjelaskan KENAPA ambangnya di situ (dari data), bukan sekadar “saya pakai yang ketat”.",
      },
      reference: "Hard filter SNP: QD<2, MQ<40, FS>60, SOR>3 (titik awal GATK). Satu metrik tidak cukup.",
    },
    {
      id: "chart-qd",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca batang QD seperti kurator varian",
      prose: [
        "Chart di bawah memplot QD lima varian dari lab-mu, dengan garis putus-putus sebagai ambang GATK (QD = 2,0).",
        "Cara membaca: sumbu Y = QD (QUAL dibagi kedalaman); tinggi batang = QD tiap varian; garis putus-putus = ambang — batang di bawah garis = gagal filter QD. Warna merah = di bawah ambang; biru = lolos ambang.",
        "Interpretasi: v2 (1,12) dan v3 (0,50) jelas gagal — keyakinannya tidak sebanding dengan buktinya. Tetapi pelajaran chart ini ada pada v4: batangnya MENJULANG (8,0) — bila kamu hanya melihat QD, v4 terlihat seperti varian terbaik. Namun v4 gagal di SOR (bias strand) — ia lolos satu metrik dengan gemilang tetapi tertangkap metrik lain. Inilah kenapa filter memakai PANEL anotasi, bukan satu angka: artefak yang canggih lolos dari satu penjaga, tetapi jarang lolos dari empat penjaga yang melihat dari arah berbeda.",
      ],
      figure: {
        svg: QD_SVG,
        alt: "Diagram batang QD lima varian: v1=4,0; v2=1,12; v3=0,50; v4=8,0; v5=4,50. Garis ambang di 2,0.",
        caption: "QD lima varian (data sintetis). Garis putus-putus = ambang GATK 2,0. v4 lolos QD tetapi gagal SOR.",
      },
      tasks: [],
      reference: "Satu metrik tinggi ≠ varian bagus. Panel anotasi = empat penjaga dari empat arah.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Strategi calling & filtering apa untuk proyek apa?",
      prose: [
        "Lima skenario yang dihadapi analis genomik:",
        "Skenario 1 — Satu WGS germline, butuh daftar varian tepercaya. → BQSR → HaplotypeCaller (GVCF) → VQSR tranche 99,0. Alasan: cukup varian untuk melatih VQSR; ini jalur Best Practices paling standar.",
        "Skenario 2 — Panel gen 50 sampel, 200 gen. → BQSR → HaplotypeCaller → HARD FILTER (ambang GATK sebagai titik awal). Alasan: terlalu sedikit varian untuk VQSR — modelnya tidak punya cukup contoh untuk belajar; hard filter transparan dan terkendali.",
        "Skenario 3 — Kohort 500 eksom, fokus varian langka. → Joint genotyping (GenomicsDBImport + GenotypeGVCFs) → VQSR. Alasan: bukti dari banyak sampel memperkuat panggilan varian langka yang di satu sampel terlihat meragukan; jangan panggil tiap sampel sendirian lalu gabungkan VCF-nya (kehilangan kekuatan bersama).",
        "Skenario 4 — Tumor vs normal, cari mutasi somatik. → JANGAN HaplotypeCaller — pakai Mutect2 (+ FilterMutectCalls). Alasan: model germline mengasumsikan genotipe diploid 0/0, 0/1, 1/1; tumor punya frekuensi alel kontinu dan kontaminasi normal — model yang salah = panggilan yang salah.",
        "Skenario 5 — Produksi klinik: 100 WGS per minggu, SLA ketat. → Pertimbangkan DRAGEN (atau cloud-GATK yang dioptimasi). Alasan: statistiknya setara GATK, tetapi akselerasi perangkat keras memangkas waktu dari hari menjadi jam — keputusan infrastruktur, bukan keputusan statistik.",
        "Aturan praktis 10 detik: germline vs somatik? → caller yang benar. Banyak varian? → VQSR, sedikit → hard filter. Kohort? → joint. Butuh cepat skala produksi? → DRAGEN.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjalankan VQSR pada 10 sampel panel lalu percaya buta pada hasilnya — modelnya “belajar” dari segelintir contoh dan memberi skor VQSLOD yang rapi tetapi tidak bermakna. VQSR tanpa data cukup lebih berbahaya daripada hard filter: ia memberi ilusi kecanggihan. Cek jumlah varian pelatihan SEBELUM memilih strategi.",
      },
      reference: "VQSR butuh murid (banyak varian). Sedikit data → hard filter. Model salah (germline untuk somatik) = hasil salah.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Varian yang hilang dari daftar B",
      prose: [
        "Skenario (sintetis, untuk latihan): kembali ke cerita pembuka — dua teknisi, selisih 400.000 varian, satu varian kandidat penyakit (sebuah missense langka) ada di daftar A tetapi tidak di B. Investigasi menemukan: kedua pipeline memakai HaplotypeCaller; bedanya di filter. Pipeline A: hard filter QD < 2,0. Pipeline B: hard filter QD < 5,0 (“lebih ketat = lebih aman”, kata teknisi B). Varian kandidat: QUAL 90, DP 30 → QD 3,0; FS 1,2; MQ 60; SOR 0,9 — semua anotasi lain bersih.",
        "Pertanyaan analisis: (1) Pipeline mana yang “benar” untuk varian ini? (2) Apa kesalahan berpikir teknisi B? (3) Bagaimana seharusnya ambang dipilih?",
        "Pembahasan: (1) Tidak ada yang mutlak benar — tetapi bukti mendukung A: QD 3,0 dengan anotasi lain bersih adalah varian yang wajar; ambang 5,0 B tidak berbasis rekomendasi maupun data (GATK: 2,0). “Lebih ketat” bukan “lebih benar” — B membuang varian asli demi rasa aman palsu. (2) Kesalahan B: mengira keketatan = kualitas, tanpa mengkalibrasi ambang terhadap distribusi anotasi datasetnya sendiri. Filter yang terlalu ketat pada studi penyakit langka berarti membuang justru yang dicari. (3) Cara yang benar: plot distribusi QD/FS/MQ/SOR seluruh varian, letakkan ambang GATK sebagai titik awal, sesuaikan sambil melihat — dan untuk kasus kandidat klinis, SELALU lakukan validasi ortogonal (Sanger / IGV manual) sebelum menyimpulkan. Angka filter tidak menggantikan mata analis untuk temuan kritis.",
        "Pelajaran: 400.000 selisih itu bukan “salah satu pipeline rusak” — melainkan cermin bahwa setiap ambang adalah keputusan dengan trade-off sensitivitas-spesifisitas. Analis yang baik bisa menjelaskan KENAPA ambangnya di situ, bukan sekadar “saya pakai yang ketat”.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di klinik, varian yang terbuang oleh filter terlalu ketat = diagnosis yang terlewat = pasien tanpa jawaban. Di riset, varian palsu yang lolos = bulan validasi terbuang. Filter bukan sekadar “bersih-bersih data” — ia adalah keputusan risiko dengan konsekuensi dua arah.",
      },
      reference: "Ambang = keputusan trade-off, bukan moral (“ketat = baik”). Kalibrasi ke distribusi; validasi temuan kritis.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Orkestrasi = urutan langkah pipeline (QC→VCF); lesson ini = statistik calling: BQSR, HaplotypeCaller, VQSR-vs-hard-filter, joint-vs-DRAGEN.",
        "BQSR mengkalibrasi ulang skor Q per kovariat dari mismatch empiris — menghapus bias sistematis sebelum meracuni calling.",
        "HaplotypeCaller: region aktif → assembly lokal → pairHMM → posterior Bayes P(G|D); untuk germline — somatik pakai Mutect2.",
        "VQSR (belajar dari varian benar/salah, butuh banyak data) vs hard filter (ambang GATK: QD<2, MQ<40, FS>60, SOR>3 — titik awal, bukan kitab suci).",
        "QD = QUAL/DP: keyakinan harus sebanding bukti. Satu metrik tidak cukup — artefak canggih lolos satu penjaga, jarang lolos empat.",
      ],
      quiz: [
        {
          q: "Kenapa BQSR diperlukan padahal mesin sudah memberi skor Q?",
          options: [
            { text: "Skor mesin bias sistematis (per siklus/konteks) — bias tidak hilang dengan coverage dan meracuni calling", why: "Benar: error sistematis mengkristal menjadi panggilan palsu yang “didukung banyak read”. BQSR mengganti klaim pabrik dengan pengukuran empiris.", correct: true },
            { text: "Agar file BAM lebih kecil", why: "Salah: BQSR tidak mengubah ukuran file secara bermakna — ia menulis ulang skor kualitas, bukan mengompresi." },
            { text: "Karena HaplotypeCaller tidak bisa membaca skor Q mentah", why: "Salah: ia bisa membacanya — masalahnya skor itu MIRING (bias), bukan tidak terbaca." },
            { text: "Hanya formalitas publikasi — hasilnya sama saja", why: "Salah: tanpa BQSR, ratusan ribu panggilan bisa bergeser. Ini koreksi statistik nyata, bukan administrasi." },
          ],
        },
        {
          q: "Varian: QUAL 200, DP 100, FS 2,0, MQ 59, SOR 0,7. Menurut hard filter GATK (SNP)?",
          options: [
            { text: "Lolos — QD = 2,0 tepat di ambang (tidak < 2), semua anotasi lain bersih", why: "Benar: 200/100 = 2,0 — syarat gagalnya QD < 2,0 (tegas lebih kecil), jadi 2,0 lolos. FS/MQ/SOR semua aman.", correct: true },
            { text: "Gagal — QD 2,0 terlalu rendah", why: "Salah: ambang GATK adalah QD < 2,0 untuk gagal; tepat 2,0 masih lolos. Baca arah dan ketegasan ambangnya." },
            { text: "Gagal — QUAL 200 terlalu tinggi untuk DP 100", why: "Salah: tidak ada aturan “QUAL terlalu tinggi” — QD 2,0 adalah rasio yang wajar, bukan mencurigakan." },
            { text: "Tidak bisa dinilai tanpa VQSR", why: "Salah: hard filter justru dirancang untuk penilaian tanpa VQSR — dan semua anotasi yang dibutuhkan sudah ada." },
          ],
        },
        {
          q: "Kapan VQSR adalah pilihan yang SALAH?",
          options: [
            { text: "Panel kecil / sedikit sampel — tidak cukup varian untuk melatih model campurannya", why: "Benar: VQSR belajar dari contoh; dengan sedikit varian, “pembelajarannya” adalah overfitting yang rapi — lebih berbahaya dari hard filter yang jujur.", correct: true },
            { text: "Whole genome sequencing satu sampel", why: "Salah: satu WGS punya JUTAAN varian — lebih dari cukup untuk melatih VQSR. Ini kasus idealnya." },
            { text: "Kohort 500 eksom", why: "Salah: ini kasus terbaik VQSR — banyak varian + joint genotyping memperkuat varian langka." },
            { text: "Saat anotasi QD/FS/MQ tersedia", why: "Salah: anotasi tersedia justru PRASYARAT VQSR (ia memakainya sebagai fitur), bukan alasan menolaknya." },
          ],
        },
        {
          q: "Studi tumor vs normal mencari mutasi driver somatik. Caller yang tepat?",
          options: [
            { text: "Mutect2 — modelnya dirancang untuk frekuensi alel rendah dan heterogenitas tumor", why: "Benar: HaplotypeCaller mengasumsikan genotipe diploid diskrit; tumor tidak diploid-diskrit. Model yang salah = panggilan yang salah.", correct: true },
            { text: "HaplotypeCaller — ia caller terbaik GATK untuk semua kasus", why: "Salah: “terbaik” tergantung masalahnya. Untuk somatik, asumsi diploidnya justru menjadi kelemahan." },
            { text: "HaplotypeCaller dengan filter lebih ketat", why: "Salah: filter lebih ketat tidak memperbaiki MODEL yang salah — ia hanya membuang lebih banyak dari hasil yang salah." },
            { text: "Tidak perlu caller khusus — cukup bandingkan dua VCF germline", why: "Salah: mutasi somatik berfrekuensi rendah tidak akan terpanggil oleh caller germline sejak awal — tidak ada yang bisa dibandingkan." },
          ],
        },
        {
          q: "Apa beda peran orkestrasi pipeline vs lesson ini?",
          options: [
            { text: "Orkestrasi = urutan langkah pipeline (QC→VCF); lesson ini = kedalaman statistik tahap calling (BQSR, likelihood, filter, joint-vs-DRAGEN)", why: "Benar: batas yang dinyatakan eksplisit di awal lesson — dua level abstraksi berbeda dari masalah yang sama.", correct: true },
            { text: "Tidak ada beda — keduanya membahas pipeline yang sama", why: "Salah: tumpang tindih topik bukan berarti tumpang tindih kedalaman. Lesson ini menjawab “kenapa”, orkestrasi menjawab “apa urutannya”." },
            { text: "Lesson ini menggantikan orkestrasi pipeline", why: "Salah: tanpa orkestrasi, kedalaman statistik di sini tidak punya tempat berpijak — keduanya komplementer." },
            { text: "Orkestrasi untuk DNA, lesson ini untuk RNA", why: "Salah: keduanya tentang DNA germline/short-read; analisis RNA butuh penanganan khusus (splice-aware: Split'N'Trim, filter intronik) yang di luar pipeline germline ini." },
          ],
        },
      ],
    },
  ],
};
