"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi13EpigenomikPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi13MarksData = [{"x": ["H3K4me3", "H3K27ac", "H3K27me3", "H3K9me3", "DNA metilasi"], "y": [1, 1, -1, -1, -1], "type": "bar", "marker": {"color": ["#2a7de1", "#2a7de1", "#e8a838", "#e8a838", "#e8a838"]}, "text": ["Aktif", "Aktif", "Represif", "Represif", "Represif"], "textposition": "outside"}];
  const bi13MarksDataLayout = {"xaxis": {"title": "Modifikasi"}, "yaxis": {"title": "", "showticklabels": false, "range": [-1.5, 1.5]}, "showlegend": false};

  const bi13PeakData = [{"x": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99], "y": [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 35, 35, 35, 35, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], "type": "bar", "marker": {"color": "#2a7de1"}, "name": "ChIP"}, {"x": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99], "y": [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], "type": "scatter", "mode": "lines", "line": {"dash": "dash", "color": "#e8a838"}, "name": "Kontrol"}];
  const bi13PeakDataLayout = {"xaxis": {"title": "Posisi genom"}, "yaxis": {"title": "Kedalaman read"}, "showlegend": true};

  const lab1Code = "import math\nlatar = 5  # rata-rata read kontrol per jendela\nchip = [4, 6, 5, 45, 60, 52, 6, 5, 20, 4, 5, 48, 7, 5]\ndef p_poisson(k, lam):\n    return 1 - sum(math.exp(-lam)*lam**i/math.factorial(i) for i in range(k))\nprint('jendela: chip-count -> p-value')\nfor i, k in enumerate(chip):\n    p = p_poisson(k, latar)\n    tanda = ' PEAK' if p < 0.01/len(chip) else ''\n    print(f'  {i:>2}: {k:>3} -> p={p:.1e}{tanda}')\nprint()\nprint('Bonferroni untuk 14 jendela. MACS2 memakai model dinamis + FDR.')\nprint('Jendela 8 (count 20): signifikan? Cek p vs ambang!')";

  const lab2Code = "import math, statistics as st\n# (M, U) 5 normal vs 5 tumor di satu CpG\nnormal = [(100,900),(120,880),(90,910),(110,890),(105,895)]\ntumor  = [(850,150),(880,120),(820,180),(860,140),(870,130)]\ndef beta(mu):\n    m, u = mu\n    return m/(m+u+100)\ndef mval(mu):\n    b = beta(mu)\n    return math.log2(b/(1-b))\nbn, bt = [beta(x) for x in normal], [beta(x) for x in tumor]\nmn, mt = [mval(x) for x in normal], [mval(x) for x in tumor]\nprint(f'beta : normal={st.mean(bn):.2f} tumor={st.mean(bt):.2f} '\n      f'delta={st.mean(bt)-st.mean(bn):.2f}')\nprint(f'M-val: normal={st.mean(mn):.1f} tumor={st.mean(mt):.1f}')\n# uji-t sederhana pada M-value\nimport statistics\ndef ttest(a, b):\n    va, vb = statistics.variance(a), statistics.variance(b)\n    se = (va/len(a)+vb/len(b))**0.5\n    return (statistics.mean(a)-statistics.mean(b))/se\nprint(f't-stat (M-value) = {ttest(mt, mn):.1f} -> DMR kuat!')\nprint()\nprint('Presentasi: delta-beta 0.75 (manusiawi).')\nprint('Statistik: uji pada M-value (valid).')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI13 &mdash; Bioinformatics</span>
        <h1 className="display-title">ChIP-seq &amp; Metilasi:<br />Epigenomik: Di Atas Genom</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Kembar Identik, Nasib Beda</a></li>
          <li><a href="#lapisan">Lapisan Epigenetik: Metilasi, Histon, Aksesibilitas</a></li>
          <li><a href="#chipseq">ChIP-seq &amp; ATAC-seq: Memetakan Regulasi</a></li>
          <li><a href="#metilasi">Analisis Metilasi &amp; DMR</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Panggil Peak ChIP-seq</a></li>
          <li><a href="#lab2">🔬 Lab 2: Uji DMR Sederhana</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Membaca Tinta Stabilo Genom</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Biomarker Metilasi untuk Deteksi Dini</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan tiga lapisan epigenetik: <strong>metilasi DNA, modifikasi histon, aksesibilitas kromatin</strong>.</li>
          <li>Menjelaskan prinsip <strong>ChIP-seq &amp; ATAC-seq</strong> dan analisis peak calling.</li>
          <li>Menjelaskan analisis <strong>metilasi (beta value)</strong> dan deteksi <strong>DMR</strong>.</li>
          <li>Menghubungkan epigenomik dengan <strong>regulasi gen &amp; penyakit</strong>.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Kembar Identik, Nasib Beda</h2>
      <div className="story">
        <p>Kembar identik: DNA 100% sama. Di usia 50, satu kena diabetes, satunya tidak. Sekuensing genom keduanya: tidak ada perbedaan menjelaskan. Metilasi DNA: <strong>pola berbeda di ratusan gen metabolik</strong> — pengalaman hidup (diet, stres, rokok) menulis catatan di atas genom.</p>
      <p>Epigenetika adalah “tinta stabilo” genom: tanpa mengubah huruf DNA, ia menandai bagian mana yang dibaca. Lesson ini memetakan tinta itu — teknologi ChIP-seq/ATAC-seq/metilasi — dan cara menganalisisnya. Fondasi untuk memahami regulasi gen di BI9/BI11 dan integrasi multi-omics (BI15).</p>
      <p>Twist-nya: metilasi DNA <strong>bisa diubah</strong> — lewat diet, olahraga, bahkan obat (inhibitor HDAC sudah dipakai untuk kanker). Tidak seperti sekuens DNA yang permanen, “tinta stabilo” ini adalah jembatan antara takdir genetik dan intervensi: ia bisa dibaca sebagai biomarker DAN ditulis ulang sebagai terapi. Tapi ada jebakan: korelasi metilasi-penyakit belum tentu sebab-akibat — perbedaan <strong>komposisi tipe sel</strong> antar sampel bisa menciptakan sinyal palsu yang terlihat meyakinkan. Epigenomik adalah bidang di mana harapan dan artefak hidup berdampingan.</p>
      </div>

      <h2 id="lapisan">Lapisan Epigenetik — Si Tinta Stabilo</h2>
      <p><strong>Definisi.</strong> <strong>Metilasi DNA</strong> (5mC di CpG): umumnya menekan (promoter termetilasi = gen mati). <strong>Modifikasi histon</strong>: H3K4me3 = promoter aktif; H3K27ac = enhancer aktif; H3K27me3 = represif. <strong>Aksesibilitas</strong>: kromatin terbuka = mesin transkripsi bisa masuk.</p>
      <details className="worked">
        <summary>📐 Contoh: membaca tanda histon</summary>
        <p>Gen X: promoter bertanda <strong>H3K4me3 + H3K27ac</strong> → aktif ditranskripsi.<br />Gen Y: <strong>H3K27me3</strong> → dibungkam (Polycomb).<br />Gen Z: <strong>H3K4me3 + H3K27me3</strong> (bivalen!) → “siap tapi ditahan” — khas gen perkembangan di sel punca.<br />Kanker: promoter gen supresor tumor <strong>hipermetilasi</strong> → gen mati tanpa mutasi DNA!</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Genom itu seperti partitur musik yang sama untuk semua sel; epigenetika adalah coretan konduktor: “bagian ini keras (aktif), ini diam (represif)”. Sel hati dan sel otak memainkan lagu berbeda dari partitur yang sama.</p>
      <p><strong>Kapan memakai:</strong> Regulasi gen, diferensiasi, kanker (metilasi abnormal), imprinting, penuaan.</p>

      <PlotlyChart
        data={bi13MarksData}
        title="Kode Histon: Tanda Aktif vs Represif"
        layout={bi13MarksDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang biru ke atas = tanda aktif; kuning ke bawah = represif. Ini “kamus” dasar membaca ChIP-seq.</p>
        <p><strong>Interpretasi:</strong> Kombinasi tanda = status regulasi. H3K4me3+H3K27ac di promoter = gen menyala. H3K27me3 = dibungkam. Bivalen (keduanya) = poised. Kanker sering membajak sistem ini: mematikan supresor tumor via metilasi, bukan mutasi.</p>
      </div>

      <h2 id="chipseq">ChIP-seq &amp; ATAC-seq — Si Pemeta Regulasi</h2>
      <p><strong>Definisi.</strong> <strong>ChIP-seq</strong>: antibodi menarik protein-DNA (mis. faktor transkripsi) → sekuensing → <strong>peak</strong> = lokasi ikatan. <strong>ATAC-seq</strong>: transposase menandai kromatin TERBUKA → peta aksesibilitas (lebih mudah, tanpa antibodi).</p>
      <details className="worked">
        <summary>📐 Contoh: peak calling</summary>
        <p>ChIP-seq faktor transkripsi p53: 20 juta read.<br /><strong>MACS2</strong> membandingkan dengan kontrol input: di promoter gen CDKN1A, 500 read menumpuk vs 10 di kontrol → <strong>peak</strong> (q&lt;0,01).<br />Motif di bawah peak: cocok motif p53 ✓ — validasi biologis.<br /><strong>ATAC-seq</strong> pada sampel sama: peak terbuka di promoter yang sama → konsisten: p53 mengikat kromatin terbuka.<br />QC: FRiP (fraction reads in peaks) &gt;1% ChIP-TF; replikat konkordan (IDR).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> ChIP-seq itu seperti memotret “siapa sedang memegang DNA di mana”: antibodi adalah borgol yang menangkap faktor transkripsi beserta DNA yang dipegangnya. ATAC-seq lebih sederhana: ia menandai pintu-pintu yang terbuka, tanpa perlu tahu siapa yang lewat.</p>
      <p><strong>Kapan memakai:</strong> ChIP-seq: lokasi ikatan TF / tanda histon spesifik. ATAC-seq: peta regulasi umum, sampel sedikit, single-cell (scATAC).</p>

      <PlotlyChart
        data={bi13PeakData}
        title="Peak ChIP-seq vs Kontrol (ilustratif)"
        layout={bi13PeakDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Biru = sinyal ChIP, garis kuning = latar kontrol. Puncak jauh di atas kontrol = peak.</p>
        <p><strong>Interpretasi:</strong> Peak besar (posisi 40–60) = ikatan kuat; peak kecil (70–75) = lemah tapi nyata bila lolos q-value. Peak calling = uji statistik tiap jendela vs kontrol, bukan sekadar “lihat yang tinggi”. Selalu pakai kontrol input!</p>
      </div>

      <h2 id="metilasi">Analisis Metilasi &amp; DMR — Si Termometer</h2>
      <p><strong>Definisi.</strong> <strong>Bisulfite sequencing</strong>: mengubah C tak termetilasi → U (dibaca T); C termetilasi tetap C → baca metilasi per basa. <strong>Beta value</strong> = M/(M+U) (0–1). <strong>DMR</strong>: region dengan metilasi beda antar kondisi.</p>
      <Tex math={String.raw`\beta = \frac{M}{M + U + \alpha}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`M, U`} />: intensitas metilasi &amp; tak termetilasi</li>
          <li><Tex math={String.raw`\beta`} />: proporsi metilasi (0–1)</li>
          <li><Tex math={String.raw`\alpha`} />: offset kecil (stabilisasi)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Beta = termometer metilasi per CpG: 0 = tak termetilasi, 1 = penuh. Tapi beta heteroskedastik (variansi tergantung mean) → untuk statistik pakai M-value = log2(beta/(1-beta)).</p>
      <details className="worked">
        <summary>📐 Contoh: DMR kanker</summary>
        <p>Promoter MLH1 (gen repair DNA): beta normal = 0,1; tumor = 0,85.<br />Delta-beta = 0,75 → <strong>hipermetilasi</strong> → gen dibungkam → kanker kolorektal (tanpa mutasi!).<br />Uji: limma pada M-value + FDR → DMR.<br /><strong>Array 850K</strong> (EPIC): murah untuk ratusan sampel; <strong>WGBS</strong>: seluruh genom, mahal. Pilih sesuai skala (mirip RNA-seq vs microarray dulu).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Bisulfite itu seperti tes lakmus kimia: ia mengubah huruf yang tidak termetilasi sehingga terlihat beda. Beta value adalah termometernya — tapi ingat termometer ini tidak linear untuk statistik (pakai M-value).</p>
      <p><strong>Kapan memakai:</strong> Kanker (biomarker!), imprinting, penuaan (epigenetic clock), paparan lingkungan.</p>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Epigenetik = gen diwariskan berubah&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Epigenetik tidak mengubah urutan DNA — ia mengubah PEMBACAAN. Dan sebagian besar tanda epigenetik di-reset tiap generasi (dengan pengecualian imprinting). “Trauma diwariskan via epigenetik” pada manusia = klaim yang sangat dilebih-lebihkan media.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Metilasi selalu mematikan gen&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Metilasi PROMOTER umumnya represif, tapi metilasi BADAN GEN justru berkorelasi dengan transkripsi aktif! Konteks (di mana) menentukan arti. Jangan generalisasi satu arah.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Peak ChIP-seq = bukti fungsi&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Ikatan ≠ regulasi. Faktor transkripsi mengikat ribuan tempat; hanya sebagian yang fungsional. Butuh bukti lanjutan: motif, perubahan ekspresi saat knockout, reporter assay.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> ChIP-seq <strong>tanpa kontrol input</strong> = tidak valid. Kontrol membedakan ikatan sejati dari bias (GC, keterbacaan). Reviewer pertama yang ditanya: “mana kontrolnya?”</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk metilasi: analisis dengan <strong>M-value</strong>, presentasikan dengan <strong>beta</strong>. Statistik butuh homoskedastisitas; manusia butuh interpretabilitas.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Integrasikan dengan <strong>ekspresi</strong> (BI9/BI11): DMR di promoter + gen turun = cerita regulasi lengkap. Satu lapisan = setengah cerita.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Panggil Peak ChIP-seq (Uji Poisson)</h2>
      <p>Diberikan coverage per jendela (ChIP vs kontrol), uji tiap jendela dengan Poisson dan koreksi sederhana. Rasakan logika MACS2 versi mini.</p>
      <PyodideLab
        title="🔬 Lab 1: Panggil Peak ChIP-seq (Uji Poisson)"
        hint="Ubah lambda latar 5 → 15. Berapa peak hilang? Itulah kenapa estimasi latar lokal (MACS2) penting — latar tidak seragam di genom."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Beta vs M-value & Uji DMR</h2>
      <p>Hitung beta dan M-value dari intensitas M/U, lalu uji beda metilasi dua kelompok. Lihat kenapa M-value untuk statistik.</p>
      <PyodideLab
        title="🔬 Lab 2: Beta vs M-value & Uji DMR"
        hint="Perhatikan variansi beta di dekat 0/1 vs tengah. Itulah heteroskedastisitas — alasan M-value dipakai limma."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Lokasi ikatan TF spesifik → ChIP-seq + kontrol input</h3>
        <p><strong>Kondisi:</strong> Antibodi bagus tersedia.</p>
        <p><strong>Kenapa:</strong> Spesifik protein; standar emas.</p>
        <p><strong>Contoh nyata:</strong> Ikatan p53 genome-wide.</p>
      </div>
      <div className="decision-card">
        <h3>2. Peta regulasi umum / sampel sedikit → ATAC-seq</h3>
        <p><strong>Kondisi:</strong> Tanpa antibodi; 500 sel cukup.</p>
        <p><strong>Kenapa:</strong> Mudah, murah, informatif.</p>
        <p><strong>Contoh nyata:</strong> Aksesibilitas tumor langka.</p>
      </div>
      <div className="decision-card">
        <h3>3. Metilasi ratusan sampel → Array EPIC 850K</h3>
        <p><strong>Kondisi:</strong> Butuh throughput.</p>
        <p><strong>Kenapa:</strong> Murah per sampel; cukup untuk DMR.</p>
        <p><strong>Contoh nyata:</strong> EWAS 500 pasien.</p>
      </div>
      <div className="decision-card">
        <h3>4. Metilasi seluruh genom → WGBS</h3>
        <p><strong>Kondisi:</strong> Butuh resolusi penuh; budget besar.</p>
        <p><strong>Kenapa:</strong> Semua CpG, bukan subset.</p>
        <p><strong>Contoh nyata:</strong> Atlas metilasi jaringan.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Epigenetika = pembacaan, bukan urutan.</li>
          <li>Konteks menentukan arti tanda.</li>
          <li>ChIP-seq wajib kontrol input.</li>
          <li>Statistik M-value, presentasi beta.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Biomarker Metilasi “95% Akurat”</h2>
      <div className="callout">
        <p>Startup klaim tes darah metilasi deteksi 10 kanker dengan akurasi 95%. Kamu diminta review teknis.</p>
      <p>Temuan: validasi hanya di satu populasi (Eropa); tidak ada validasi prospektif; panel 100 CpG dipilih dari data yang sama (overfitting!); tidak dilaporkan PPV pada prevalensi populasi umum.</p>
        <p><strong>Pertanyaan:</strong> Putusanmu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Akurasi 95% di case-control terseleksi ≠ berguna klinis. (1) Overfitting: seleksi fitur + evaluasi di data sama = optimis. (2) Prevalensi: kanker 0,5% populasi → spesifisitas 95% = PPV hanya ~9% (lihat HD9: Bayes!). 91% positif = false alarm. (3) Tanpa validasi prospektif multi-populasi, klaim tidak berdiri. Rekomendasi: minta validasi independen + laporkan PPV/NPV pada prevalensi nyata. Pelajaran: biomarker epigenetik itu menjanjikan (ctDNA metilasi nyata dipakai!), tapi saring dengan HD9 (PPV) + BI16 (validasi) sebelum percaya.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Membaca Tinta Stabilo Genom</h2>
      <p>Epigenomik mengukur <strong>di mana genom aktif</strong>, bukan apa isinya. Tiga teknologi inti — ChIP-seq, ATAC-seq, bisulfite-seq — masing-masing menjawab pertanyaan berbeda dengan jebakan berbeda. Pendalaman ini memastikan kamu memilih teknologi yang tepat dan membaca hasilnya dengan curiga yang benar.</p>

      <h3>1. ChIP-seq: memotret protein yang duduk di DNA</h3>
      <p>Prinsip: ikat-silang (crosslink) protein ke DNA → pecah kromatin → tarik dengan antibodi spesifik → sekuensing DNA yang tertarik. Puncak (<em>peak</em>) = lokasi protein itu duduk. Untuk faktor transkripsi: puncak sempit (~200 bp); untuk marka histon seperti H3K27me3: puncak lebar (ribuan basa).</p>
      <details className="worked">
        <summary>📐 Contoh: dari peak ke motif</summary>
        <p>ChIP-seq faktor transkripsi p53: 5.000 peak signifikan (MACS2, q &lt; 0,01).<br />
        Ambil ±100 bp tiap peak → cari motif berulang (MEME) → motif <strong>RRRCWWGYYY</strong> muncul di 70% peak (E &lt; 10<sup>−100</sup>).<br />
        <strong>Interpretasi:</strong> p53 memang mengikat motif itu secara langsung (bukan penumpang). 30% peak tanpa motif = kemungkinan ikatan tidak langsung (via protein lain) atau artefak antibodi — jangan klaim “target langsung p53” untuk semuanya.<br />
        Kontrol wajib: <strong>input DNA</strong> (tanpa antibodi) — daerah yang “tertarik” juga di input = bias kromatin terbuka, bukan ikatan spesifik. ChIP tanpa input = foto tanpa pembanding.</p>
      </details>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Antibodi menentukan segalanya</strong></p>
        <p>Antibodi buruk = ChIP buruk, seberapapun bagusnya analisis. Validasi antibodi (knockout/knockdown → sinyal hilang?) adalah <strong>syarat</strong>, bukan opsional. Setengah “penemuan” ChIP yang gagal replikasi lahir dari antibodi yang mengikat protein yang salah.</p>
      </div>

      <h3>2. ATAC-seq: peta keterbukaan kromatin</h3>
      <p>Prinsip: enzim Tn5 memotong DNA di daerah <strong>terbuka</strong> (tidak terbungkus nukleosom) sambil menempelkan adaptor — satu langkah, 50.000 sel, tanpa antibodi. Puncak ATAC = <em>enhancer</em>/promoter aktif. Kelebihannya: murah, cepat, butuh sedikit sel (bahkan single-cell!).</p>
      <p>Twist biologis: keterbukaan ≠ aktivitas. Enhancer bisa terbuka tapi “siaga” (<em>poised</em>, bertanda H3K4me1 tanpa H3K27ac) — siap aktif tapi belum. Membaca ATAC saja lalu mengklaim “gen ini aktif” = membaca pintu terbuka sebagai “ada orang di dalam”.</p>
      <details className="worked">
        <summary>📐 Contoh: footprinting — melihat tapak kaki protein</summary>
        <p>Di dalam puncak ATAC 500 bp, ada lekukan 20 bp dengan coverage rendah di tengah — <strong>footprint</strong>: protein duduk di sana melindungi DNA dari Tn5.<br />
        Lekukan cocok motif CTCF → “CTCF mengikat di sini pada kondisi ini”.<br />
        <strong>Interpretasi:</strong> footprinting memberi resolusi mendekati ChIP <strong>tanpa antibodi</strong> — tapi ia butuh coverage dalam (&gt;100 juta read) dan tidak mengidentifikasi proteinnya (tebak dari motif). Kuat untuk hipotesis, lemah untuk vonis.</p>
      </details>

      <h3>3. Metilasi: bisulfite mengubah alfabet</h3>
      <p>Prinsip bisulfite-seq: sitosin tak termetilasi → urasil (dibaca T); 5-metilsitosin → tetap C. Perbandingan C vs T di tiap posisi CpG = <strong>persen metilasi</strong>. Sederhana, brutal, dan mahal (butuh coverage 30x+ karena tiap read hanya memberi 1 bit informasi per CpG).</p>
      <Tex math={String.raw`\beta = \frac{M}{M + U + 100}`} block />
      <p><strong>Artinya tiap simbol:</strong> β (beta) = level metilasi (0–1); M = intensitas/count metilasi; U = tak termetilasi; 100 = offset penstabil (menghindari β liar saat coverage rendah — detail kecil yang menyelamatkan analisis).</p>
      <details className="worked">
        <summary>📐 Contoh: DMR yang mengubah interpretasi</summary>
        <p>Promoter gen <em>MLH1</em> (perbaikan DNA): β = 0,05 di jaringan normal, β = 0,85 di tumor — <strong>hipermetilasi promoter</strong> → gen dibungkam → perbaikan DNA mati → kanker kolorektal (sindrom Lynch-like, tapi tanpa mutasi DNA!).<br />
        <strong>Interpretasi:</strong> fenotip yang sama dengan mutasi genetik, penyebabnya epigenetik — dan <strong>bisa dideteksi dari biopsi cair</strong> (DNA tumor bersirkulasi). Inilah janji diagnostik epigenomik: biomarker yang tidak butuh menemukan mutasi.<br />
        Jebakan (twist cerita pembuka): tumor vs normal beda <strong>komposisi sel</strong> (tumor = campuran sel kanker + imun + stroma). DMR bisa mencerminkan “lebih banyak sel imun” bukan “metilasi berubah”. Koreksi: estimasi proporsi tipe sel (dekonvolusi) atau validasi di single-cell.</p>
      </details>

      <h3>Kasus nyata: jam epigenetik dan forensik</h3>
      <p>Horvath (2013) membangun “jam epigenetik”: 353 situs CpG yang metilasinya memprediksi <strong>usia biologis</strong> dengan error ~3,6 tahun — lintas jaringan! Aplikasinya liar: forensik (usia dari tetes darah di TKP), uji klinis (apakah intervensi “meremajakan” metilasi?), asuransi (usia biologis vs kronologis). Dan sisi gelapnya: diskriminasi berbasis usia biologis. <strong>Teknologi yang sama, dua wajah</strong> — inilah kenapa BI17 membahas etika data genetik/epigenetik sebagai satu paket.</p>

      <h2 id="kasus2">🏥 Kasus Lapangan: Biomarker Metilasi untuk Deteksi Dini</h2>
      <p>Startup diagnostik ingin tes darah untuk deteksi dini kanker kolorektal berbasis <strong>metilasi DNA</strong> (ctDNA). Mereka punya data: 200 pasien kanker + 200 kontrol, array metilasi 850.000 CpG. Kamu direkrut untuk menilai: <strong>apakah sinyalnya nyata, atau artefak?</strong></p>

      <h3>Langkah 1: temukan DMR — dengan curiga</h3>
      <p>Analisis awal: 1.200 CpG “signifikan” (FDR &lt; 0,05). Tapi cek komposisi: darah pasien kanker mengandung <strong>lebih banyak neutrofil</strong> (respons inflamasi) — dan neutrofil punya pola metilasi khas! 900 dari 1.200 CpG = <strong>marker tipe sel</strong>, bukan kanker.</p>
      <details className="worked">
        <summary>📐 Contoh: dekonvolusi menyelamatkan biomarker</summary>
        <p>Sebelum koreksi: CpG di promoter <em>ELANE</em> (gen neutrofil) β = 0,2 (kontrol) vs 0,6 (kanker) — “biomarker!”<br />
        Setelah estimasi proporsi sel (Houseman) + model <code>~ neutrofil + kanker</code>: efek kanker ≈ <strong>0</strong> — seluruh perbedaan dijelaskan neutrofil.<br />
        Tersisa 300 CpG yang tetap signifikan setelah koreksi — termasuk <strong>SEPT9</strong> (β 0,1 → 0,7), gen yang memang termetilasi pada kanker kolorektal (dasar tes Epi proColon yang FDA-approved!).<br />
        <strong>Interpretasi:</strong> 75% “penemuan” adalah komposisi sel. Tanpa dekonvolusi, startup meluncurkan tes yang mendeteksi <strong>inflamasi</strong> — bukan kanker. (False positive = orang sehat dirujuk kolonoskopi sia-sia.)</p>
      </details>

      <h3>Langkah 2: dari 300 CpG ke panel 10</h3>
      <p>Tes klinis butuh panel kecil (murah, cepat): seleksi via Lasso → 10 CpG. Validasi di kohort independen (n = 500): sensitivitas 72%, spesifisitas 90% untuk kanker stadium awal.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Spesifisitas menentukan nasib skrining</strong></p>
        <p>Pada prevalensi 0,5% (populasi skrining): dari 10.000 orang, 50 kanker. Sensitivitas 72% → 36 terdeteksi. Spesifisitas 90% → <strong>995 false positive</strong>! Nilai prediksi positif = 36/(36+995) ≈ <strong>3,5%</strong> — 96,5% hasil positif adalah salah. <strong>Skrining butuh spesifisitas &gt; 99%</strong>, atau ia menjadi mesin kecemasan. Matematika Bayes tidak bisa dinegosiasi.</p>
      </div>

      <h3>Keputusan akhir</h3>
      <p>Rekomendasi: panel SEPT9+ perlu spesifisitas lebih tinggi sebelum skrining populasi — layak sebagai <strong>tes triase</strong> (bukan pengganti kolonoskopi), dengan komunikasi hasil positif yang hati-hati. <strong>Biomarker yang baik = biologi benar + statistik benar + konteks klinis benar.</strong> Satu kaki pincang = produk gagal.</p>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Promoter gen supresor tumor yang hipermetilasi mengakibatkan…"
        options={["Gen aktif",
          "Gen dibungkam tanpa mutasi DNA — mekanisme kanker",
          "Tidak ada efek",
          "Mutasi"]}
        correct={1}
        explanation="Benar: kanker via epigenetik, bukan genetik. Target obat demethylating!"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kombinasi H3K4me3 + H3K27me3 (bivalen) artinya…"
        options={["Aktif penuh",
          "Poised: siap tapi ditahan — khas gen perkembangan sel punca",
          "Rusak",
          "Tidak mungkin"]}
        correct={1}
        explanation="Benar: dua sinyal berlawanan = ditahan dalam kesiapan, bukan mati total."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Keunggulan ATAC-seq atas ChIP-seq?"
        options={["Lebih spesifik protein",
          "Tanpa antibodi; sampel sedikit; peta keterbukaan umum",
          "Lebih murah selalu",
          "Tidak ada"]}
        correct={1}
        explanation="Benar: pintu terbuka vs siapa yang lewat. Pilih sesuai pertanyaan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Untuk UJI STATISTIK metilasi sebaiknya pakai…"
        options={["Beta value",
          "M-value (homoskedastik); beta untuk presentasi",
          "Count mentah",
          "p-value"]}
        correct={1}
        explanation="Benar: beta heteroskedastik. Statistik valid + presentasi manusiawi = dua metrik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Bisulfite sequencing membaca metilasi karena…"
        options={["Menghancurkan DNA",
          "C tak termetilasi → U (dibaca T); C termetilasi tetap C",
          "Menambah metilasi",
          "Sihir"]}
        correct={1}
        explanation="Benar: konversi kimia yang membedakan status metilasi per basa."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Peak ChIP-seq tanpa kontrol input…"
        options={["Tetap valid",
          "Tidak valid — tak bisa bedakan ikatan dari bias teknis",
          "Lebih baik",
          "Wajib dipublikasi"]}
        correct={1}
        explanation="Benar: kontrol = pembeda sinyal vs bias. Tanpa itu, peak = tebakan."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Tiga lapisan: <strong>metilasi, histon, aksesibilitas</strong> = tinta stabilo genom.</li>
          <li>Kode histon: <strong>H3K4me3/H3K27ac</strong> aktif; <strong>H3K27me3</strong> represif; bivalen = poised.</li>
          <li><strong>ChIP-seq</strong> (spesifik, butuh antibodi + kontrol) vs <strong>ATAC-seq</strong> (umum, mudah).</li>
          <li><strong>Peak calling</strong> = uji statistik vs kontrol (MACS2).</li>
          <li>Metilasi: <strong>bisulfite</strong>; beta untuk presentasi, <strong>M-value</strong> untuk statistik.</li>
          <li><strong>DMR</strong>: region beda metilasi — biomarker kanker potensial.</li>
          <li>Integrasikan dengan <strong>ekspresi</strong> untuk cerita lengkap.</li>
          <li>Waspadai klaim biomarker: <strong>overfitting + PPV prevalensi</strong>.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi12-genomika-populasi" className="btn btn-secondary btn-sm">← BI12</Link>
        <Link href="/learn/bi14-metagenomik" className="btn btn-primary btn-sm">BI14 →</Link>
      </div>
    </div>
  );
}
