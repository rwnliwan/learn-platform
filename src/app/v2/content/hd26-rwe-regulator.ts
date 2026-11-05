import type { V2Lesson } from "../lib/types";

// ── Figure: forest plot crude vs adjusted RR (sintetis) ───────────────────
const FOREST_SVG = `<svg viewBox="0 0 520 220" role="img" aria-label="Forest plot: RR kasar 2,23 turun menjadi 1,25 setelah penyesuaian usia">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="56" y1="180" x2="500" y2="180"/>
</g>
<line x1="232" y1="24" x2="232" y2="180" stroke="var(--chart-text)" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.7"/>
<text x="232" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">1,0 (tidak ada efek)</text>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<text x="56" y="198">0,5</text><text x="144" y="198">1,0</text><text x="320" y="198">2,0</text><text x="452" y="198">3,0</text>
</g>
<g>
<line x1="330" y1="70" x2="452" y2="70" stroke="var(--c2)" stroke-width="2"/>
<circle cx="391" cy="70" r="7" fill="var(--c2)"/>
<text x="48" y="74" font-size="12" fill="var(--text)" font-family="var(--font-ui)">RR kasar</text>
<text x="462" y="74" font-size="12" fill="var(--text)" font-family="var(--font-ui)">2,23</text>
<line x1="200" y1="120" x2="300" y2="120" stroke="var(--c1)" stroke-width="2"/>
<circle cx="250" cy="120" r="7" fill="var(--c1)"/>
<text x="48" y="124" font-size="12" fill="var(--text)" font-family="var(--font-ui)">RR sesuaian usia</text>
<text x="462" y="124" font-size="12" fill="var(--text)" font-family="var(--font-ui)">1,25</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="470" y="208">data sintetis</text>
</g>
<text x="280" y="30" font-size="12" fill="var(--text)" font-family="var(--font-ui)">rawat inap: obat baru vs obat lama</text>
</svg>`;

export const hd26: V2Lesson = {
  slug: "hd26-rwe-regulator",
  track: "Health Data Science",
  module: "Evidence untuk Regulator",
  title: "Real-World Evidence untuk Regulator: Ketika Data Klaim Jadi Bukti",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Obat yang “terbukti” di 2.000 orang, dipertanyakan oleh 200.000 data",
      prose: [
        "Sebuah obat diabetes baru lolos uji klinis dengan gemilang: pada 2.000 pasien terpilih, HbA1c turun 1,2% dalam setahun, efek samping serius nyaris nol. Regulator memberinya izin edar. Tiga tahun kemudian, analis di badan regulator membuka data klaim asuransi kesehatan nasional: 200.000 pengguna obat itu di dunia nyata. Polanya berbeda — angka rawat inap karena gagal jantung tampak 2,2 kali lebih tinggi dibanding pengguna obat lama. Panik? Tarik izin edar?",
        "Twist-nya: angka 2,2 itu benar secara hitungan, tetapi salah sebagai vonis. Setelah dipecah per kelompok usia, ternyata dokter cenderung meresepkan obat baru justru kepada pasien yang LEBIH TUA dan lebih sakit — merekalah yang memang lebih sering dirawat inap. Setelah penyesuaian, rasionya tinggal 1,25 — masih perlu dipantau, tetapi bukan keadaan darurat. Regulator yang bereaksi terhadap angka kasar akan menarik obat yang bermanfaat; regulator yang tidak bereaksi sama sekali akan melewatkan sinyal bahaya yang nyata. Di antara keduanya ada disiplin bernama Real-World Evidence (RWE): cara mengubah data klaim, rekam medis, dan registri menjadi bukti yang layak dipakai untuk keputusan regulasi.",
        "Indonesia sedang membangun fondasinya: SATUSEHAT — platform pertukaran data kesehatan nasional berbasis standar HL7 FHIR — mengintegrasikan puluhan ribu fasilitas kesehatan; kebijakan “No EMR, No Claim” mewajibkan klaim JKN berbasis rekam medis elektronik; NIK menjadi identitas tunggal yang memungkinkan linkage antar sumber data. Data dunia nyata Indonesia sedang lahir — dan regulator butuh analis yang bisa mengubahnya menjadi bukti, bukan sekadar angka.",
      ],
      tasks: [],
      note: {
        title: "Kenapa analis RWE adalah profesi regulator masa depan",
        type: "risk",
        body: "Keputusan regulasi (izin edar, label, penarikan) bernilai triliunan rupiah dan menyangkut jutaan nyawa — dan makin banyak yang berbasis data dunia nyata. Analis yang bisa berkata “angka kasar ini menipu, yang benar setelah penyesuaian adalah 1,25, dan kualitas datanya belum layak untuk keputusan final” adalah garis pertahanan antara kepanikan dan kelalaian.",
      },
      reference: "RCT = efficacy di populasi terpilih. RWE = effectiveness & safety di populasi sesungguhnya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) membedakan real-world data (RWD) dari real-world evidence (RWE) memakai definisi FDA — dan menyebut tiga sumber RWD utama Indonesia; (2) menilai fitness for use sebuah sumber data memakai dua lensa FDA — relevansi dan reliabilitas; (3) merancang analisis klaim dengan pola pikir target trial emulation (merumuskan pertanyaan seolah merancang RCT); (4) menghitung estimasi kasar vs tersesuaikan dari data klaim sintetis dan menjelaskan jebakan confounding by indication kepada pengambil keputusan.",
        "Rutenya: cerita → tujuan + bekal → tiga konsep (RWD vs RWE, fitness for use, target trial emulation) → lab Pyodide (kasar vs sesuaian + skor kualitas data) → forest plot dengan panduan baca → peta keputusan → mini-case keputusan regulator → kuis → rangkuman. Estimasi 60 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, sumber data kesehatan: sistem kesehatan menghasilkan data sekunder berlimpah — rekam medis elektronik (catatan klinis), data klaim asuransi (siapa dibayar untuk tindakan apa), dan registri penyakit. Masing-masing dikumpulkan untuk tujuan operasional, bukan riset — sehingga bias dan missingness-nya mengikuti logika operasionalnya. Kedua, uji klinis terandomisasi (RCT): randomisasi menyeimbangkan confounder terukur maupun tak terukur, menjadikannya standar emas efikasi — tetapi pada populasi terpilih, durasi terbatas, dan biaya raksasa. Ketiga, kausalitas observasional: tanpa randomisasi, asosiasi bisa lahir dari confounding — dan musuh bebuyutan analisis klaim adalah confounding by indication, ketika alasan pemberian obat justru berhubungan dengan outcome.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: RWE bukan “RCT murahan”. Ia menjawab pertanyaan yang RCT tidak bisa jawab: bagaimana obat ini bekerja pada lansia dengan 5 komorbid yang tidak pernah lolos kriteria inklusi uji klinis?",
      ],
      reference: "Bekal: (1) data sekunder punya bias operasional; (2) RCT = standar emas tetapi sempit; (3) confounding by indication = musuh analisis klaim.",
    },
    {
      id: "konsep-rwd-rwe",
      eyebrow: "Langkah 3 · Konsep",
      title: "RWD vs RWE — bahan mentah vs bukti masak",
      prose: [
        "Definisi (FDA): real-world data (RWD) adalah data tentang status kesehatan pasien dan/atau penyelenggaraan layanan kesehatan yang dikumpulkan secara rutin dari berbagai sumber — rekam medis elektronik, data klaim, registri, bahkan wearable. Real-world evidence (RWE) adalah bukti klinis tentang penggunaan serta potensi manfaat/risiko suatu produk medis yang DIHASILKAN DARI ANALISIS RWD. Pembedanya satu kata: analisis. Tumpukan klaim BPJS adalah RWD; estimasi efek obat yang sudah disesuaikan confounder, dengan protokol transparan, adalah RWE.",
        "Kepribadiannya: RWD adalah pasar bahan mentah — melimpah, murah, berantakan. RWE adalah hidangan yang sudah dimasak dengan resep (protokol), dicicipi (validasi), dan disajikan dengan daftar bahan (transparansi metode). Regulator tidak makan bahan mentah. Kerangka globalnya: di AS, 21st Century Cures Act (2016) memandatkan FDA membangun framework evaluasi RWE (terbit 2018, diperkuat panduan-panduan berikutnya hingga pusat inovasi RWE); di Eropa, EMA menargetkan pemakaian RWD dalam keputusan regulasi lewat strategi Regulatory Science to 2025. Penggunaannya nyata: perluasan indikasi label, studi keamanan pasca-pasar, dan external control arm untuk penyakit langka.",
        "Kapan memakai: RWE tepat ketika RCT tidak feasible (penyakit langka, follow-up puluhan tahun), tidak etis, atau ketika pertanyaannya memang tentang dunia nyata (adherence, komorbid, lansia). Ia tidak tepat sebagai pengganti RCT untuk efikasi awal obat baru — di sana standar emas tetap berlaku.",
      ],
      formula: String.raw`\text{RWE} = \text{analisis}(\text{RWD}) + \text{protokol} + \text{validasi} + \text{transparansi}`,
      formulaNote: "Ini bukan rumus matematika melainkan rumus kelembagaan — dan justru itu intinya. RWD = bahan (klaim, EHR, registri). Analisis = metode kausal yang tepat (emulasi trial, penyesuaian confounder). Protokol = rencana analisis ditulis SEBELUM melihat hasil (mencegah p-hacking). Validasi = cek kualitas data dan robustness. Transparansi = orang lain bisa mereplikasi. Hilangkan satu suku saja, dan yang tersisa bukan bukti — melainkan angka.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Datanya 200.000 pasien — pasti lebih kuat dari RCT 2.000 orang”",
        type: "pitfall",
        body: "Yang benar: n besar mengecilkan varians, bukan bias. Bias confounding sebesar 2,2x pada 200.000 pasien TETAP 2,2x — hanya dengan interval kepercayaan yang sempit dan menipu. “Big data, big bias” adalah peringatan resmi di literatur RWE: ukuran sampel tidak mengkompensasi desain yang buruk.",
      },
      hints: [
        "💡 Intuisi: tanya selalu “200.000 SIAPA?” — siapa yang masuk database klaim, siapa yang tidak, dan apakah alasan mereka masuk berhubungan dengan outcome? Jawabannya menentukan validitas sebelum satu baris kode pun ditulis.",
      ],
      reference: "RWD = bahan mentah. RWE = bahan + analisis + protokol + validasi + transparansi.",
    },
    {
      id: "konsep-fitness",
      eyebrow: "Langkah 4 · Konsep",
      title: "Fitness for use — SIM sebelum mengemudi",
      prose: [
        "Definisi: fitness for use adalah penilaian apakah sebuah sumber data LAYAK dipakai untuk pertanyaan regulasi tertentu — bukan penilaian kualitas data secara abstrak. FDA membaginya dua lensa. Lensa 1 — Relevansi: apakah data ini mengandung populasi, paparan, outcome, confounder kunci, dan periode yang dibutuhkan pertanyaan? (Data klaim hebat untuk “apakah obat diresepkan dan pasien dirawat inap”, buruk untuk “apakah pasien benar-benar minum obatnya”.) Lensa 2 — Reliabilitas: apakah data dikumpulkan dan diproses dengan cara yang bisa dipercaya? Dimensinya: kelengkapan (completeness), akurasi/validitas (apakah kode diagnosis benar?), konsistensi, dan ketepatan waktu — plus provenance (jejak asal-usul data) dan kualitas linkage antar sumber.",
        "Kepribadiannya: fitness for use adalah SIM — bukan soal bisa menyetir (punya data), melainkan boleh mengemudi di jalan ini (untuk pertanyaan ini). Data klaim JKN punya SIM untuk pertanyaan utilisasi layanan; tidak otomatis punya SIM untuk pertanyaan efektivitas klinis yang butuh data confounder perilaku (merokok, misalnya — yang kelengkapannya di klaim biasanya rendah). Analis yang melewatkan penilaian ini seperti mengemudi tanpa SIM: bisa jalan, tetapi tidak sah — dan berbahaya.",
        "Kapan memakai: SELALU, sebelum analisis apa pun — dan hasilnya didokumentasikan sebagai paket bukti (data evidence package) yang bisa diaudit regulator. Di Indonesia, fondasinya sedang dibangun: SATUSEHAT (standar HL7 FHIR, puluhan ribu fasyankes terintegrasi) untuk interoperabilitas rekam medis; kebijakan “No EMR, No Claim” yang mewajibkan klaim JKN berbasis RME; NIK sebagai identitas tunggal tervalidasi Dukcapil untuk linkage yang akurat. Fondasi ada — tugas analis menilai apakah untuk PERTANYAAN INI fondasinya cukup.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Data sudah digital dan terintegrasi — berarti siap pakai untuk riset”",
        type: "pitfall",
        body: "Yang benar: digitalisasi menjamin KETERSEDIAAN, bukan KUALITAS atau KESESUAIAN. Rekam medis elektronik bisa memuat diagnosis tidak terkode, duplikasi identitas, terminologi tidak konsisten, dan keterlambatan update — masalah kualitas data yang didokumentasikan luas di literatur kesehatan digital. Integrasi SATUSEHAT menyelesaikan pertukaran data; fitness for use menyelesaikan pertanyaan “layak untuk keputusan apa?”.",
      },
      hints: [
        "💡 Intuisi: nilai setiap dimensi kualitas dengan ambang eksplisit SEBELUM analisis — mis. kelengkapan confounder kunci minimal 80%. Ambang yang ditulis di awal melindungimu dari godaan “ya sudahlah, pakai saja” di tengah jalan.",
        "💡 Intuisi kedua: data yang tidak layak untuk keputusan regulasi masih bisa layak untuk HIPOTESIS — bedakan “bukti untuk bertindak” dari “sinyal untuk menyelidiki”.",
      ],
      reference: "Fitness for use = relevansi (populasi, paparan, outcome, confounder) + reliabilitas (lengkap, akurat, konsisten, provenance jelas).",
    },
    {
      id: "konsep-trial",
      eyebrow: "Langkah 5 · Konsep",
      title: "Target trial emulation — berpikir seperti perancang RCT",
      prose: [
        "Definisi: target trial emulation adalah disiplin merumuskan analisis observasional SEOLAH-OLAH merancang RCT: tentukan eligibility (siapa masuk), strategi treatment (obat baru vs pembanding apa, dosis, kapan mulai), assignment (bagaimana meniru randomisasi — mis. dengan penyesuaian confounder terukur), periode follow-up (kapan mulai dihitung — time zero), outcome, kontras kausal (intention-to-treat vs per-protocol), dan rencana analisis — SEMUA ditulis dalam protokol sebelum menyentuh data. Tujuannya: memaksa analis menghadapi setiap keputusan desain yang di RCT dijawab oleh protokol, tetapi di studi klaim sering dijawab asal-asalan.",
        "Kepribadiannya: emulasi trial adalah sutradara yang memaksa aktor amatir (data observasional) memerankan naskah profesional (RCT). Adegan paling sering gagal: time zero — kapan “mulai” dihitung? Pasien yang mulai obat baru 3 bulan setelah diagnosis vs yang mulai hari ini tidak comparable; salah menentukan time zero melahirkan immortal time bias (pasien “abadi” selama menunggu obat). Adegan gagal kedua: pembanding — “pengguna vs bukan pengguna” hampir selalu bias (confounding by indication); pembanding yang benar adalah pengguna obat PEMBANDING AKTIF (active comparator) dengan indikasi sama.",
        "Kapan memakai: setiap analisis klaim yang ingin bicara kausal. Protokol pra-registrasi adalah pembeda antara RWE dan eksplorasi data: ia mengikat tangan analis agar tidak memilih spesifikasi yang hasilnya paling “bagus”.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Cukup masukkan semua confounder ke regresi — beres”",
        type: "pitfall",
        body: "Yang benar: regresi tidak memperbaiki desain yang salah. Time zero yang keliru, pembanding yang tidak comparable, atau confounder kunci yang tidak terukur (mis. derajat keparahan penyakit yang hanya ada di catatan naratif dokter) tidak bisa “diregresikan pergi”. Urutannya: desain dulu (emulasi trial), metode kemudian. Regresi adalah alat finishing, bukan fondasi.",
      },
      hints: [
        "💡 Intuisi: sebelum menulis kode, tulis satu paragraf: “Jika saya punya dana tak terbatas, RCT seperti apa yang akan saya jalankan untuk pertanyaan ini?” — lalu tanyakan untuk setiap elemennya: “bagaimana saya menirunya dengan data klaim?” Yang tidak bisa ditiru = keterbatasan yang wajib dilaporkan.",
      ],
      reference: "Emulasi trial: eligibility, treatment, assignment, time zero, outcome, kontras kausal — ditulis sebelum analisis.",
    },
    {
      id: "lab-klaim",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Angka kasar vs angka jujur dari data klaim",
      prose: [
        "Waktunya membuka data klaim. Di bawah ada data SINTETIS (diberi label jelas — pola meniru klaim nyata: pasien yang diberi obat baru cenderung lebih tua dan lebih sakit): 1.800 pasien diabetes, dua kelompok usia, outcome = rawat inap gagal jantung dalam setahun. Tugasmu: hitung RR kasar, lalu RR tersesuaikan usia dengan Mantel-Haenszel, lalu nilai kelengkapan data untuk uji fitness for use.",
        "Coba: setelah lolos, ubah angka agar distribusi usia di kedua kelompok obat SAMA (mis. pindahkan 400 pasien tua dari obat baru ke obat lama). Apa yang terjadi pada selisih RR kasar vs sesuaian? Itulah confounding by indication yang hilang — dan kenapa desain (siapa dibanding siapa) lebih penting dari rumus.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rr_kasar` = (kasus/pasien obat baru) / (kasus/pasien obat lama)" },
        { id: "t2", text: "Hitung `rr_sesuaian` Mantel-Haenszel: jumlah(a*n0/N) / jumlah(c*n1/N) per strata" },
        { id: "t3", text: "Hitung `lengkap` = dict kelengkapan tiap field; tentukan `layak` (True bila SEMUA field >= 80%)" },
        { id: "t4", text: "Jalankan dan pastikan ringkasan + keputusan tercetak" },
      ],
      expected: "RR kasar=2.23\nRR sesuaian usia (MH)=1.25\nkelengkapan: diagnosis=98% paparan=95% outcome=92% perokok=45%\nkeputusan: BELUM LAYAK untuk keputusan regulasi — lengkapi pencatatan perokok dulu",
      code: {
        starter: `# Data klaim SINTETIS (pola meniru klaim nyata; angka dibuat untuk latihan)
# strata: (kasus_obat_baru, pasien_obat_baru, kasus_obat_lama, pasien_obat_lama)
muda = (10, 200, 32, 800)
tua  = (90, 600, 24, 200)
# kelengkapan field (%)
fields = {"diagnosis": 98, "paparan": 95, "outcome": 92, "perokok": 45}

# TULIS KODEMU
rr_kasar =
rr_sesuaian =
lengkap =
layak =

print(f"RR kasar={rr_kasar:.2f}")
print(f"RR sesuaian usia (MH)={rr_sesuaian:.2f}")
print("kelengkapan: " + " ".join(f"{k}={v}%" for k, v in lengkap.items()))
print("keputusan: " + ("LAYAK untuk keputusan regulasi" if layak else "BELUM LAYAK untuk keputusan regulasi — lengkapi pencatatan perokok dulu"))`,
        lockLines: 5,
        solution: `# Data klaim SINTETIS (pola meniru klaim nyata; angka dibuat untuk latihan)
# strata: (kasus_obat_baru, pasien_obat_baru, kasus_obat_lama, pasien_obat_lama)
muda = (10, 200, 32, 800)
tua  = (90, 600, 24, 200)
# kelengkapan field (%)
fields = {"diagnosis": 98, "paparan": 95, "outcome": 92, "perokok": 45}

# TULIS KODEMU
def _rr(a, n1, c, n0):
    return (a / n1) / (c / n0)

rr_kasar = _rr(muda[0] + tua[0], muda[1] + tua[1], muda[2] + tua[2], muda[3] + tua[3])

def _mh(strata):
    num = sum(a * n0 / (n1 + n0) for a, n1, c, n0 in strata)
    den = sum(c * n1 / (n1 + n0) for a, n1, c, n0 in strata)
    return num / den

rr_sesuaian = _mh([muda, tua])
lengkap = dict(fields)
layak = all(v >= 80 for v in lengkap.values())

print(f"RR kasar={rr_kasar:.2f}")
print(f"RR sesuaian usia (MH)={rr_sesuaian:.2f}")
print("kelengkapan: " + " ".join(f"{k}={v}%" for k, v in lengkap.items()))
print("keputusan: " + ("LAYAK untuk keputusan regulasi" if layak else "BELUM LAYAK untuk keputusan regulasi — lengkapi pencatatan perokok dulu"))`,
        checks: [
          { kind: "equal", task: "t1", name: "rr_kasar", value: 2.2321, tol: 0.005, label: "`rr_kasar` = 2,23", msg: "(100/800)/(56/1000) = 0,125/0,056 = 2,23 — angka yang memanikkan." },
          { kind: "equal", task: "t2", name: "rr_sesuaian", value: 1.25, tol: 0.001, label: "`rr_sesuaian` = 1,25", msg: "Mantel-Haenszel = 30,5/24,4 = 1,25 — usia menjelaskan sebagian besar sinyal kasar." },
          { kind: "equal", task: "t3", name: "layak", value: false, tol: 0, label: "`layak` = False", msg: "Field perokok hanya 45% (< 80%) — confounder kunci tak lengkap, belum layak untuk keputusan regulasi." },
          { kind: "stdout_matches", task: "t4", pattern: "BELUM LAYAK untuk keputusan regulasi", label: "Keputusan tercetak", msg: "Samakan kalimat keputusan dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t4", pattern: "RR sesuaian usia \\(MH\\)=1\\.25", label: "RR sesuaian tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: angka kasar itu umpan",
        body: "Analis RWE senior memperlakukan setiap angka kasar sebagai tersangka, bukan saksi. Heuristiknya: pertama, tanyakan “200.000 SIAPA?” — siapa yang masuk database klaim dan mengapa; bila alasan masuknya berhubungan dengan outcome, confounding by indication hampir pasti ada. Kedua, jangan pernah melaporkan angka kasar tanpa pasangannya yang tersesuaikan; selisih keduanya adalah cerita confounding-nya, dan komite regulator berhak mendengar keduanya. Ketiga, nilai fitness for use SEBELUM analisis dengan ambang eksplisit — confounder kunci yang kelengkapannya 45% berarti datanya belum layak untuk keputusan, seberapa pun besar n-nya; n besar mengecilkan varians, bukan bias. Keempat, tulis protokol emulasi trial sebelum menyentuh data: time zero, active comparator, kontras kausal — karena regresi tidak bisa memperbaiki desain yang salah. Kelima, bedakan “bukti untuk bertindak” dari “sinyal untuk menyelidiki” — data yang belum layak untuk penarikan obat masih layak untuk pemantauan diperketat. Analis yang berani berkata “data ini tidak bisa menjawab pertanyaan itu” menyelamatkan regulator dari keputusan berbasis ilusi bukti. Dan yang terakhir: dokumentasikan semua yang TIDAK bisa kamu jawab — daftar confounder tak terukur dan keterbatasan linkage adalah bagian dari bukti, bukan aib; regulator lebih percaya analis yang jujur tentang titik butanya daripada yang berpura-pura melihat segalanya.",
      },
      reference: "Kasar 2,23 vs sesuaian 1,25 = confounding by indication. Kualitas data menentukan kelayakan keputusan.",
    },
    {
      id: "chart-forest",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca forest plot seperti komite regulator",
      prose: [
        "Forest plot di bawah merangkum hasil lab-mu dalam format standar laporan regulator.",
        "Cara membaca: sumbu X = rate ratio (skala log); garis vertikal putus-putus di 1,0 = tidak ada efek. Tiap baris = satu estimasi: titik = estimasi, garis horizontal = interval kepercayaan (ilustrasi). Baris atas = RR kasar 2,23; baris bawah = RR sesuaian usia 1,25.",
        "Interpretasi: RR kasar 2,23 dengan interval yang seluruhnya di atas 1,0 terlihat “signifikan dan mengkhawatirkan” — inilah angka yang memicu kepanikan. Tetapi setelah penyesuaian usia, estimasi jatuh ke 1,25 — masih di atas 1,0 (perlu pemantauan), tetapi jauh dari keadaan darurat. Pelajaran chart: forest plot yang hanya menampilkan angka kasar adalah presentasi yang tidak lengkap; komite regulator yang baik selalu meminta baris “sesuaian”-nya. Selisih kedua baris = ukuran confounding yang berhasil dijelaskan — di sini, usia menjelaskan sebagian besar sinyal.",
      ],
      figure: {
        svg: FOREST_SVG,
        alt: "Forest plot: RR kasar 2,23 jauh di kanan garis 1,0; RR sesuaian usia 1,25 dekat garis 1,0.",
        caption: "RR kasar vs tersesuaikan usia (data sintetis). Jarak kedua estimasi = confounding yang dijelaskan usia.",
      },
      tasks: [],
      reference: "Selalu tampilkan kasar dan sesuaian berdampingan. Selisihnya adalah cerita confounding-nya.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Kapan data klaim boleh jadi bukti",
      prose: [
        "Lima skenario keputusan RWE:",
        "Skenario 1 — Sinyal keamanan pasca-pasar dari farmakovigilans; data klaim lengkap untuk populasi, paparan, outcome; confounder kunci terukur. → Lanjutkan ke analisis RWE formal dengan emulasi trial. Alasan: pertanyaan jelas, data fit for use, metode kausal tersedia.",
        "Skenario 2 — Estimasi kasar mengkhawatirkan (RR 2,23) tetapi setelah penyesuaian tinggal 1,25 dan confounder kunci tak lengkap (perokok 45%). → JANGAN jadikan dasar keputusan regulasi; tetapkan sebagai sinyal untuk investigasi: perbaiki pencatatan, minta studi lanjutan, pantau aktif. Alasan: bukti belum layak — bertindak di atas bukti setengah matang berisiko dua arah.",
        "Skenario 3 — Ingin membuktikan efikasi obat BARU untuk izin edar pertama. → Butuh RCT; RWE bukan pengganti. Alasan: untuk klaim efikasi awal, standar regulasi global tetap randomisasi — RWE perannya di label expansion dan pasca-pasar.",
        "Skenario 4 — Penyakit langka, RCT tidak feasible, ada registri nasional berkualitas. → RWE dengan external control arm bisa diterima regulator (dengan syarat ketat). Alasan: ketika RCT mustahil, bukti terbaik yang ada — yang didokumentasikan rapi — lebih baik daripada tidak ada bukti.",
        "Skenario 5 — Dua analisis RWE dengan spesifikasi berbeda memberi hasil berlawanan. → Kembali ke protokol: mana yang pra-registrasi? Lakukan analisis sensitivitas; laporkan KEDUANYA dengan penjelasan. Alasan: cherry-picking spesifikasi menghancurkan kredibilitas; transparansi menyelamatkannya.",
        "Aturan praktis 10 detik: pertanyaannya kausal? → emulasi trial-nya jelas? → data fit for use (relevan + reliabel)? → protokol pra-registrasi? → baru klaim sebagai bukti.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai RWE untuk menjawab pertanyaan yang datanya tidak bisa jawab — mis. efektivitas obat yang kepatuhannya tidak tercatat di klaim. Analis yang baik berkata “data ini tidak bisa menjawab pertanyaan itu” — kalimat yang menyelamatkan regulator dari keputusan berbasis ilusi bukti.",
      },
      reference: "RWE menjawab: keamanan pasca-pasar, label expansion, penyakit langka. Bukan: efikasi awal obat baru.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Memo keputusan: obat diabetes baru",
      prose: [
        "Skenario (sintetis, untuk latihan): tiga tahun pasca-izin edar, tim farmakovigilans melaporkan sinyal: data klaim JKN (200.000 pengguna obat diabetes baru “Glukostat”) menunjukkan rawat inap gagal jantung lebih tinggi vs obat lama. Kamu diminta menulis memo keputusan satu halaman untuk komite. Data yang kamu punya: RR kasar 2,23; RR sesuaian usia 1,25 (Mantel-Haenszel, dari lab-mu); kelengkapan field: diagnosis 98%, paparan 95%, outcome 92%, status merokok 45%; tidak ada data fraksi ejeksi jantung (penanda keparahan gagal jantung) di klaim.",
        "Pertanyaan analisis: (1) Rekomendasi regulasi apa — penarikan, pembatasan, pemantauan diperketat, atau tidak ada tindakan? (2) Bagaimana kamu menjelaskan angka 2,23 vs 1,25 kepada komite yang non-teknis? (3) Bukti tambahan apa yang kamu minta, dan dari sumber mana?",
        "Pembahasan: (1) Pemantauan diperketat + studi lanjutan — BUKAN penarikan. Alasan: sinyal kasar sebagian besar dijelaskan usia (confounding by indication: dokter meresepkan obat baru ke pasien lebih tua/lebih sakit — channeling bias); estimasi sesuaian 1,25 masih di atas 1 tetapi dengan confounder kunci tak lengkap (merokok 45%, fraksi ejeksi tak ada) sehingga belum layak jadi dasar penarikan. Penarikan butuh bukti kausal yang kokoh; mengabaikan sinyal juga salah — jalan tengahnya: enhanced pharmacovigilance + studi farmakoepidemiologi dengan data lebih lengkap (mis. linkage klaim–RME via SATUSEHAT untuk menangkap keparahan penyakit). (2) Bahasa komite: “Angka 2,23 membandingkan apel dengan jeruk — pengguna obat baru memang lebih tua dan lebih sakit sejak awal. Setelah membandingkan apel dengan apel, selisihnya tinggal 1,25 — masih kami pantau, tetapi bukan keadaan darurat. Dan catatan kami belum lengkap, jadi kami belum bisa memutuskan final.” (3) Minta: linkage ke data RME (SATUSEHAT/FHIR) untuk keparahan penyakit dan status merokok; analisis active-comparator baru vs obat lama sekelas (bukan vs “bukan pengguna”); emulasi trial dengan time zero yang benar; hasil pra-registrasi sebelum analisis.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Memo seperti ini dibaca oleh orang yang menandatangani keputusan triliunan rupiah. Tiga dosa memo RWE: menyembunyikan angka kasar (komite akan menemukannya sendiri), tidak menyebut keterbatasan data (kredibilitasmu taruhannya), dan memberi rekomendasi tanpa tingkat keyakinan. Tulis: rekomendasi + keyakinan + apa yang bisa mengubah rekomendasi.",
      },
      reference: "Struktur memo: temuan (kasar vs sesuaian) → keterbatasan → rekomendasi + keyakinan → bukti tambahan yang diminta.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "RWD = data rutin (klaim, EHR, registri); RWE = bukti klinis dari ANALISIS RWD + protokol + validasi + transparansi (definisi FDA).",
        "n besar mengecilkan varians, bukan bias — big data dengan desain buruk = big bias.",
        "Fitness for use: relevansi (populasi, paparan, outcome, confounder) + reliabilitas (lengkap, akurat, konsisten, provenance jelas) — dinilai SEBELUM analisis.",
        "Target trial emulation: rumuskan analisis observasional seolah merancang RCT — time zero dan active comparator adalah titik gagal tersering.",
        "Kasar 2,23 vs sesuaian 1,25 = confounding by indication; keputusan regulasi proporsional = pantau diperketat + studi lanjutan, bukan panik atau abai.",
      ],
      next: { label: "HD27 — SQL untuk Data Kesehatan", href: "/v2/learn/hd27-sql-kesehatan" },
      quiz: [
        {
          q: "Apa pembeda RWD dan RWE menurut definisi FDA?",
          options: [
            { text: "RWE adalah bukti klinis yang dihasilkan dari ANALISIS RWD — tumpukan klaim saja baru RWD, bukan bukti", why: "Benar: satu kata pembeda — analisis. RWE = RWD + metode kausal + protokol + validasi + transparansi.", correct: true },
            { text: "RWD untuk riset, RWE untuk operasional", why: "Salah: keduanya bisa untuk riset; pembedanya adalah apakah sudah dianalisis menjadi bukti klinis." },
            { text: "RWE selalu berasal dari RCT", why: "Salah: justru sebaliknya — RWE berasal dari data dunia nyata non-RCT (klaim, EHR, registri)." },
            { text: "Tidak ada beda — istilah pemasaran saja", why: "Salah: pembedanya operasional dan regulatori — regulator hanya menerima yang sudah memenuhi standar bukti." },
          ],
        },
        {
          q: "Studi klaim 200.000 pasien: RR kasar 2,23, setelah penyesuaian usia 1,25. Interpretasi tepat?",
          options: [
            { text: "Confounding by indication — pasien obat baru lebih tua/sakit sejak awal; 2,23 menipu, 1,25 lebih jujur tetapi masih butuh confounder lain", why: "Benar: selisih kasar vs sesuaian = confounding yang dijelaskan usia (channeling bias). 1,25 belum final karena confounder kunci tak lengkap.", correct: true },
            { text: "Obat terbukti berbahaya — tarik dari pasar", why: "Salah: angka kasar tidak bisa jadi vonis; penarikan butuh bukti kausal kokoh yang belum ada." },
            { text: "Obat terbukti aman — tidak perlu tindakan", why: "Salah: 1,25 masih di atas 1 dan confounder tak lengkap; respons tepat = pantau diperketat + studi lanjutan." },
            { text: "Penyesuaian usia salah — angka kasar yang benar", why: "Salah: mengabaikan confounding justru kesalahan. Tanpa penyesuaian, kita membandingkan pasien yang memang beda sejak awal." },
          ],
        },
        {
          q: "Kelengkapan field: diagnosis 98%, paparan 95%, outcome 92%, merokok 45%. Keputusan fitness for use?",
          options: [
            { text: "Belum layak untuk keputusan regulasi — confounder kunci (merokok) tak lengkap; layak untuk hipotesis/pemantauan", why: "Benar: ambang 80% untuk SEMUA field kunci; satu field kritis gugur = keputusan regulasi ditunda. Bedakan bukti-untuk-bertindak vs sinyal-untuk-menyelidiki.", correct: true },
            { text: "Layak — tiga field sudah di atas 90%", why: "Salah: confounder yang hilang justru yang paling berbahaya — ia membiaskan estimasi tanpa terlihat di angka kelengkapan lain." },
            { text: "Layak bila memakai imputasi untuk merokok", why: "Salah: imputasi 55% missing pada confounder kunci menghasilkan estimasi yang bertumpu pada asumsi, bukan data — tidak layak untuk keputusan regulasi." },
            { text: "Tidak layak untuk apa pun — buang datanya", why: "Salah: data tetap berguna untuk pemantauan sinyal dan hipotesis; yang dilarang adalah menjadikannya dasar keputusan final." },
          ],
        },
        {
          q: "Dalam emulasi trial dari data klaim, kesalahan desain tersering?",
          options: [
            { text: "Time zero yang keliru (immortal time bias) dan pembanding non-active (pengguna vs bukan pengguna)", why: "Benar: dua titik gagal klasik. Time zero salah menciptakan periode “abadi”; pembanding bukan-pengguna hampir pasti beda indikasi.", correct: true },
            { text: "Ukuran sampel terlalu kecil", why: "Salah: data klaim justru biasanya raksasa; masalahnya desain, bukan n." },
            { text: "Tidak memakai machine learning", why: "Salah: metode canggih tidak memperbaiki desain salah — regresi/ML adalah finishing, bukan fondasi." },
            { text: "Terlalu banyak confounder disesuaikan", why: "Salah: masalah umum adalah confounder KUNCI yang tak terukur, bukan kelebihan penyesuaian." },
          ],
        },
        {
          q: "Kapan RWE tepat — dan kapan tidak — untuk keputusan regulasi?",
          options: [
            { text: "Tepat: keamanan pasca-pasar, label expansion, penyakit langka; tidak tepat: pengganti RCT untuk efikasi awal obat baru", why: "Benar: peta FDA/EMA — RWE mengisi kekosongan RCT (lama, mahal, tak etis, populasi sempit), bukan menggantikan standar emas efikasi.", correct: true },
            { text: "RWE bisa menggantikan RCT untuk semua keputusan — lebih murah", why: "Salah: tanpa randomisasi, confounding tak terukur tetap mengancam; untuk efikasi awal, regulator global tetap mensyaratkan RCT." },
            { text: "RWE hanya untuk obat yang sudah ditarik", why: "Salah: justru terutama untuk obat yang BEREDAR — pemantauan keamanan dan perluasan indikasi." },
            { text: "RWE tidak pernah bisa dipakai regulator", why: "Salah: FDA (framework 2018) dan EMA (Regulatory Science to 2025) secara resmi mengintegrasikan RWE ke keputusan regulasi." },
          ],
        },
      ],
    },
  ],
};
