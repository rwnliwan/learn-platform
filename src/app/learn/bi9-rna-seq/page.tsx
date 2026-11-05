"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi9RnaSeqPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi9NormData = [{"x": ["Gen A", "Gen B", "Gen C", "Gen D", "MYC"], "y": [100, 100, 100, 100, 100], "type": "bar", "name": "Normal (RPM)", "marker": {"color": "#2a7de1"}}, {"x": ["Gen A", "Gen B", "Gen C", "Gen D", "MYC"], "y": [60, 60, 60, 60, 4000], "type": "bar", "name": "Kanker (RPM)", "marker": {"color": "#e8a838"}}];
  const bi9NormDataLayout = {"barmode": "group", "xaxis": {"title": "Gen"}, "yaxis": {"title": "RPM"}, "showlegend": true};

  const bi9VolcData = [{"x": [-3.2, -2.5, -2.1, -0.2, 0.1, 0.3, 2.2, 2.8, 3.5, 0.5, -0.4, 1.2], "y": [8, 12, 6, 9, 1, 0.5, 7, 11, 9, 2, 1.5, 3], "type": "scatter", "mode": "markers+text", "marker": {"color": "#2a7de1", "size": 9}, "text": ["", "TP53", "", "", "", "", "", "MYC", "", "", "", ""], "textposition": "top center", "showlegend": false}];
  const bi9VolcDataLayout = {"xaxis": {"title": "log2 fold change"}, "yaxis": {"title": "-log10(padj)"}, "showlegend": false, "shapes": [{"type": "line", "x0": -4, "x1": 4, "y0": 1.3, "y1": 1.3, "line": {"dash": "dash", "color": "#e8a838"}}, {"type": "line", "x0": 1, "x1": 1, "y0": 0, "y1": 13, "line": {"dash": "dash", "color": "#94a3b8"}}, {"type": "line", "x0": -1, "x1": -1, "y0": 0, "y1": 13, "line": {"dash": "dash", "color": "#94a3b8"}}]};

  const lab1Code = "# count 5 gen x 2 kondisi (A normal, B kanker)\nA = [100, 200, 150, 300, 100]\nB = [100, 200, 150, 300, 5000]  # gen5 (MYC) meledak\ntotA, totB = sum(A), sum(B)\nprint('RPM (bagi total):')\nfor i in range(5):\n    print(f'  gen{i+1}: A={A[i]/totA*1e6:.0f}  B={B[i]/totB*1e6:.0f}')\nprint('  -> gen1-4 TERLIHAT turun! (palsu)')\nprint()\n# median-of-ratios (ala DESeq2)\nimport statistics as st\nrasio = [b/a for a, b in zip(A, B)]\nsf = st.median(rasio)\nprint(f'median rasio (size factor B) = {sf:.2f}')\nprint('normalisasi B/sf:')\nfor i in range(5):\n    print(f'  gen{i+1}: A={A[i]}  B_adj={B[i]/sf:.0f}')\nprint('  -> gen1-4 TETAP, gen5 naik. Benar!')";

  const lab2Code = "gen = [('TP53',-2.5,1e-12),('MYC',2.8,1e-11),('GAPDH',0.1,0.4),\n       ('BRCA1',-1.8,1e-6),('ACTB',0.05,0.7),('EGFR',3.2,0.02),\n       ('X1',0.3,1e-8),('X2',4.0,0.3),('X3',-0.1,0.02),\n       ('X4',1.5,1e-4),('X5',-3.0,0.1),('X6',0.8,1e-5)]\nm = len(gen)\n# Benjamini-Hochberg\nurut = sorted(gen, key=lambda x: x[2])\npadj = {}\nmn = 1.0\nfor i, (g, fc, p) in reversed(list(enumerate(urut, 1))):\n    mn = min(mn, p*m/i)\n    padj[g] = mn\nprint(f\"{'gen':<6} {'log2FC':>7} {'p':>10} {'padj':>10}  status\")\nfor g, fc, p in gen:\n    pa = padj[g]\n    if pa < 0.05 and abs(fc) > 1: st = 'KANDIDAT'\n    elif pa < 0.05: st = 'signifikan, efek kecil'\n    elif abs(fc) > 1: st = 'efek besar, tak signifikan'\n    else: st = '-'\n    print(f'{g:<6} {fc:>7.1f} {p:>10.1e} {pa:>10.1e}  {st}')\nprint()\nprint('X2: efek besar tapi padj buruk -> JANGAN kejar (noise).')\nprint('X1: padj bagus tapi efek kecil -> mungkin tak bermakna biologis.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI9 &mdash; Bioinformatics</span>
        <h1 className="display-title">DESeq2 &amp; Volcano Plot:<br />RNA-seq: Gen Apa yang Berubah</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 20.000 Gen, 3 Replikat</a></li>
          <li><a href="#normalisasi">Normalisasi: Mengapa Tidak Bisa Dibagi Total</a></li>
          <li><a href="#nb">Model Negative Binomial &amp; DESeq2</a></li>
          <li><a href="#volcano">Volcano Plot &amp; Multiple Testing</a></li>
          <li><a href="#gsea">GSEA: Dari Gen ke Pathway</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Mengapa Normalisasi Total Menipu</a></li>
          <li><a href="#lab2">🔬 Lab 2: Volcano Plot &amp; FDR</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Dari Count ke Cerita Biologi</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Uji Obat 3 vs 3</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan mengapa <strong>normalisasi RNA-seq</strong> tidak bisa sekadar dibagi total read.</li>
          <li>Menjelaskan model <strong>negative binomial</strong> dan alur <strong>DESeq2</strong> (size factor, dispersi, shrinkage).</li>
          <li>Membaca <strong>volcano plot &amp; MA plot</strong> dan menerapkan <strong>FDR</strong>.</li>
          <li>Menafsirkan <strong>GSEA / enrichment GO-KEGG</strong> dari daftar gen.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 20.000 Gen, 3 Replikat</h2>
      <div className="story">
        <p>Peneliti punya 3 sampel kanker vs 3 normal, 20.000 gen. Ia menjalankan uji-t per gen pada data mentah — dapat 5.000 “gen signifikan”. Reviewer menolak dalam 1 paragraf: tanpa normalisasi yang benar, tanpa model count yang tepat, tanpa koreksi multiple testing — 5.000 itu sebagian besar noise.</p>
      <p>RNA-seq adalah ujian statistik bioinformatika: data count yang overdispersed, 20.000 uji simultan, dan replikat sedikit. Lesson ini mengajarkan cara yang benar — dari normalisasi sampai pathway — agar “gen signifikan”-mu bukan sekadar daftar belanja noise.</p>
      <p>Twist-nya: reviewer menolak paper itu bukan karena 5.000 “signifikan” terlalu banyak — tapi karena tanpa normalisasi yang benar, <strong>ranking gen-nya pun berubah total</strong>. Gen peringkat 1 di analisis mentah bisa jatuh ke peringkat 800 setelah normalisasi TMM. Artinya: count mentah menyesatkan bahkan untuk eksplorasi paling sederhana. Normalisasi bukan “langkah administratif” sebelum uji statistik — ia <strong>mengubah kesimpulan biologis</strong>. Salah di sini, dan seluruh cerita kanker-vs-normal yang kamu tulis adalah fiksi.</p>
      </div>

      <h2 id="normalisasi">Normalisasi: Mengapa Tidak Bisa Dibagi Total</h2>
      <p><strong>Definisi.</strong> <strong>Normalisasi</strong> membuat count antar-sampel sebanding. Masalah: <strong>komposisi</strong> — jika 10 gen super-ekspresi menyedot 50% read di sampel kanker, gen lain terlihat turun padahal tidak. <strong>DESeq2 size factor</strong> (median-of-ratios) robust terhadap ini; TPM/FPKM untuk perbandingan antar-gen.</p>
      <details className="worked">
        <summary>📐 Contoh: jebakan total count</summary>
        <p>Sampel N (normal): total 1 jt read. Sampel K (kanker): total 1 jt read, tapi gen MYC saja menyedot 400rb.<br /><strong>RPM</strong> (bagi total): semua gen lain di K terlihat turun 40% — PALSU.<br /><strong>Size factor</strong>: median rasio gen-per-gen ≈ 1 (kebanyakan gen tidak berubah) → tidak tertipu MYC.<br />Inilah kenapa DESeq2/edgeR tidak memakai RPM untuk DE.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Normalisasi total itu seperti membandingkan belanja dua keluarga dari total struk: keluarga A beli 1 TV mahal → terlihat “boros di semua”. Size factor itu seperti membandingkan harga per barang yang sama — tidak tertipu satu pembelian raksasa.</p>
      <p><strong>Kapan memakai:</strong> DE antar-sampel → size factor (DESeq2) / TMM (edgeR). Banding gen dalam sampel → TPM (koreksi panjang gen).</p>

      <PlotlyChart
        data={bi9NormData}
        title="Jebakan Normalisasi Total (RPM)"
        layout={bi9NormDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Biru = normal, kuning = kanker (RPM). Perhatikan gen A–D yang sebenarnya TIDAK berubah.</p>
        <p><strong>Interpretasi:</strong> Gen A–D terlihat turun (100→60) padahal biologinya sama — hanya karena MYC menyedot read. Inilah artefak komposisi: normalisasi total menghukum semua gen lain. Size factor/TMM kebal terhadap ini.</p>
      </div>

      <h2 id="nb">Model Negative Binomial &amp; DESeq2 — Si Statistikawan</h2>
      <p><strong>Definisi.</strong> Count RNA-seq bersifat <strong>overdispersed</strong> (variansi &gt; mean) → Poisson tidak cukup → <strong>Negative Binomial</strong>. <strong>DESeq2</strong>: estimasi size factor → estimasi dispersi per gen (shrinkage antar-gen!) → uji Wald/LRT → FDR.</p>
      <Tex math={String.raw`K_{ij} \sim NB(\mu_{ij}, \alpha_i), \quad \mu_{ij} = s_j \cdot q_{ij}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`K_{ij}`} />: count gen i sampel j</li>
          <li><Tex math={String.raw`s_j`} />: size factor sampel j (normalisasi)</li>
          <li><Tex math={String.raw`q_{ij}`} />: ekspresi sebenarnya (dinormalisasi)</li>
          <li><Tex math={String.raw`\alpha_i`} />: dispersi gen i (seberapa berisik)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Model memisahkan 3 hal: kedalaman sekuensing (s), biologi (q), dan noise (alpha). Shrinkage dispersi = pinjam kekuatan antar-gen: dengan 3 replikat, dispersi satu gen tak terestimasi andal — tapi pola 20.000 gen membantu.</p>
      <details className="worked">
        <summary>📐 Contoh: kenapa tidak uji-t</summary>
        <p>Gen X: count normal [10,12,11], kanker [100,110,105].<br /><strong>Uji-t</strong> pada count mentah: mengasumsikan normal + variansi sama — dilanggar (count, overdispersed).<br /><strong>DESeq2</strong>: NB dengan dispersi terestimasi → log2FC ≈ 3,3, padj = 1e-8 ✓.<br />Gen Y: [0,1,0] vs [2,3,2] — uji-t “bisa signifikan” tapi DESeq2 menshrink log2FC (count kecil = tidak dipercaya). Inilah kebijaksanaan shrinkage.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> DESeq2 itu seperti juri berpengalaman: untuk gen dengan bukti sedikit (count kecil), ia tidak langsung percaya — ia “menciutkan” klaimnya menuju rata-rata. Untuk bukti kuat, ia membiarkan angka bicara.</p>
      <p><strong>Kapan memakai:</strong> DE standar: DESeq2 (konservatif, shrinkage) atau edgeR (mirip, TMM). n kecil → DESeq2. Selalu: desain formula benar (~kondisi + batch!).</p>
      <div className="callout callout-warning"><strong>Desain formula menentukan segalanya:</strong> ~kondisi saja padahal ada batch → confounded. Tulis design = ~batch + kondisi. Dan JANGAN pre-filter gen terlalu agresif sebelum DE — biarkan DESeq2 menangani via independent filtering.</div>

      <h2 id="volcano">Volcano Plot &amp; Multiple Testing — Si Peta Harta</h2>
      <p><strong>Definisi.</strong> <strong>Volcano plot</strong>: x = log2 fold change, y = −log10(padj). Gen menarik = <strong>atas-kiri/kanan</strong> (besar + signifikan). <strong>FDR (Benjamini-Hochberg)</strong>: kontrol ekspektasi proporsi false discovery — wajib untuk 20.000 uji.</p>
      <details className="worked">
        <summary>📐 Contoh: membaca volcano</summary>
        <p>Gen TP53: log2FC = −2,5, padj = 1e-12 → puncak kiri-atas: turun kuat &amp; sangat signifikan ✓ kandidat.<br />Gen Z: log2FC = 0,2, padj = 1e-9 → signifikan tapi efek kecil — mungkin tidak bermakna biologis.<br />Gen Y: log2FC = 4, padj = 0,2 → efek besar tapi tidak signifikan (count kecil/noise) — jangan kejar!<br /><strong>FDR:</strong> dari 20.000 uji, p&lt;0,05 mentah → 1.000 false positive ekspektasi. padj&lt;0,05 → hanya 5% dari yang diklaim yang palsu.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Volcano plot itu seperti peta harta karun: sumbu X = seberapa besar harta (efek), sumbu Y = seberapa yakin peta (signifikansi). Harta sejati ada di dua puncak gunung — bukan di lembah tengah yang ramai tapi tak berarti.</p>
      <p><strong>Kapan memakai:</strong> Presentasi hasil DE; pilih kandidat validasi. Threshold umum: |log2FC|&gt;1 &amp; padj&lt;0,05 — tapi justifikasi biologis &gt; angka magis.</p>

      <PlotlyChart
        data={bi9VolcData}
        title="Volcano Plot (ilustratif, 12 gen contoh)"
        layout={bi9VolcDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> X = besar perubahan (kanan = naik di kanker), Y = signifikansi (makin atas makin yakin). Garis putus-putus = threshold umum.</p>
        <p><strong>Interpretasi:</strong> TP53 (kiri-atas) dan MYC (kanan-atas) = kandidat kuat: besar + signifikan. Titik tengah-atas (log2FC kecil, signifikan) = nyata tapi mungkin tak bermakna biologis. Titik kanan-bawah (efek besar, tak signifikan) = jangan kejar — noise. Baca volcano = baca dua dimensi sekaligus.</p>
      </div>

      <h2 id="gsea">GSEA: Dari Gen ke Pathway — Si Pelihat Hutan</h2>
      <p><strong>Definisi.</strong> <strong>Enrichment</strong>: apakah gen signifikan menumpuk di pathway tertentu (GO/KEGG) melebihi acak? <strong>GSEA</strong>: tanpa threshold — pakai SEMUA gen terurut skor, uji apakah gen satu pathway menumpuk di ujung.</p>
      <Tex math={String.raw`P(X \geq k) = \sum_{x=k}^{min(n,K)} \frac{\binom{K}{x}\binom{N-K}{n-x}}{\binom{N}{n}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`N`} />: total gen latar (20.000)</li>
          <li><Tex math={String.raw`K`} />: gen dalam pathway</li>
          <li><Tex math={String.raw`n`} />: gen DE</li>
          <li><Tex math={String.raw`k`} />: irisan teramati</li>
      </ul>
      <p><strong>Interpretasi:</strong> Uji hipergeometrik: peluang irisan sebesar k secara acak. Kecil = enrichment nyata. Pilih latar N dengan benar (gen yang terdeteksi, bukan semua gen genom!).</p>
      <details className="worked">
        <summary>📐 Contoh: over-representation</summary>
        <p>500 gen DE (padj&lt;0,05). Pathway “apoptosis” punya 200 gen; 40 di antaranya ada di 500 DE.<br />Ekspektasi acak: 500 × (200/20000) = 5. Teramati 40 → enrichment 8x, p hipergeometrik = 1e-20.<br />Kesimpulan: program kematian sel aktif — cerita biologis, bukan sekadar daftar.<br /><strong>Waspada:</strong> pathway tumpang tindih &amp; redundan; pilih database yang tepat (GO-BP untuk proses, KEGG untuk metabolik).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Enrichment itu seperti bertanya “dari 500 nama di daftar, kebetulan berapa yang satu marga?” GSEA lebih halus: tidak memotong daftar dulu, tapi melihat apakah satu marga menumpuk di peringkat atas.</p>
      <p><strong>Kapan memakai:</strong> Interpretasi biologis hasil DE: dari “500 gen” menjadi “pathway apoptosis &amp; siklus sel aktif” — bahasa yang dimengerti biolog.</p>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Normalisasi = bagi dengan total read (RPM) sudah cukup&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Tidak untuk DE: artefak komposisi (pelajaran chart di atas). RPM/TPM untuk visualisasi &amp; antar-gen; DE butuh size factor/TMM. Salah normalisasi = ribuan gen DE palsu.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Uji-t per gen sudah cukup untuk RNA-seq&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Count itu diskret + overdispersed + n kecil. Uji-t mengasumsikan normalitas &amp; variansi sama — ketiga asumsi dilanggar. DESeq2/edgeR dirancang untuk ini: NB + shrinkage + FDR. “Cukup” = 5.000 temuan palsu.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Gen dengan p-value terkecil = gen terpenting&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> p-value = keyakinan, bukan kepentingan. Gen dengan padj 1e-50 tapi log2FC 0,2 kalah penting dari padj 1e-6 dengan log2FC 4 untuk validasi. Baca volcano dua dimensi; pertimbangkan biologi.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu sertakan <strong>batch dalam desain</strong> (~batch + kondisi) bila ada. Batch effect (BI10) adalah pembunuh DE #1 — lebih mematikan dari metode yang salah.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Buat <strong>PCA sebelum DE</strong>: sampel harus mengelompok per kondisi, bukan per tanggal sekuensing. Bila tidak, perbaiki desain dulu — jangan lanjut.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Simpan <strong>daftar gen lengkap</strong> (bukan cuma yang signifikan) untuk GSEA. Threshold memotong sinyal pathway yang terdistribusi di banyak gen kecil.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Artefak Komposisi &amp; Size Factor</h2>
      <p>Simulasikan 5 gen: 4 stabil + 1 meledak di kondisi B. Bandingkan normalisasi total (RPM) vs median-of-ratios. Lihat RPM menipu.</p>
      <PyodideLab
        title="🔬 Lab 1: Artefak Komposisi &amp; Size Factor"
        hint="Inilah intuisi size factor DESeq2: median rasio kebal terhadap segelintir gen ekstrem. Coba buat 3 gen meledak — kapan median jebol?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Volcano Plot &amp; Koreksi FDR (BH)</h2>
      <p>Diberikan 12 gen (log2FC + p-value), terapkan Benjamini-Hochberg manual, lalu klasifikasikan: kandidat / signifikan-kecil / noise.</p>
      <PyodideLab
        title="🔬 Lab 2: Volcano Plot &amp; Koreksi FDR (BH)"
        hint="Bandingkan p-value mentah vs padj: berapa gen “signifikan” yang gugur? Itulah 20.000 uji tanpa koreksi = banjir false positive."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. DE dua kondisi, n kecil → DESeq2</h3>
        <p><strong>Kondisi:</strong> Standar; butuh shrinkage.</p>
        <p><strong>Kenapa:</strong> Konservatif, terdokumentasi, vignette luar biasa.</p>
        <p><strong>Contoh nyata:</strong> Kanker vs normal, 3 vs 3.</p>
      </div>
      <div className="decision-card">
        <h3>2. DE kompleks / n besar → edgeR / limma-voom</h3>
        <p><strong>Kondisi:</strong> Desain faktorial, banyak sampel.</p>
        <p><strong>Kenapa:</strong> Fleksibel, cepat untuk besar.</p>
        <p><strong>Contoh nyata:</strong> Time-course multi-kondisi.</p>
      </div>
      <div className="decision-card">
        <h3>3. Interpretasi biologis → GSEA + GO/KEGG</h3>
        <p><strong>Kondisi:</strong> Dari daftar gen ke cerita.</p>
        <p><strong>Kenapa:</strong> Pathway = bahasa biolog.</p>
        <p><strong>Contoh nyata:</strong> Apoptosis aktif pada respons obat.</p>
      </div>
      <div className="decision-card">
        <h3>4. Single-cell → Bukan DESeq2 bulk!</h3>
        <p><strong>Kondisi:</strong> Data sel tunggal.</p>
        <p><strong>Kenapa:</strong> Struktur noise beda (lihat BI11).</p>
        <p><strong>Contoh nyata:</strong> DE antar klaster sel.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Normalisasi untuk DE = size factor/TMM, bukan RPM.</li>
          <li>Count → NB + shrinkage, bukan uji-t.</li>
          <li>20.000 uji → FDR wajib.</li>
          <li>Baca volcano dua dimensi; batch di desain.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: “500 Gen Resistensi Obat” yang Salah Desain</h2>
      <div className="callout">
        <p>Tim membandingkan 3 sampel responsif vs 3 resisten terhadap kemoterapi. DESeq2 dijalankan dengan design = ~kondisi. Hasil: 500 gen DE. Validasi 20 gen via qPCR: <strong>hanya 2 terkonfirmasi</strong>.</p>
      <p>Audit: 3 responsif disekuensing Januari (batch 1), 3 resisten Maret (batch 2). PCA menunjukkan pemisahan sempurna per batch — bukan per kondisi.</p>
        <p><strong>Pertanyaan:</strong> Diagnosis + bagaimana seharusnya.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Batch effect total (kondisi = batch): DESeq2 tidak bisa memisahkan — 500 gen = perbedaan batch (tanggal, reagen, teknisi), bukan biologi. Tidak ada statistik yang menyelamatkan desain confounded total. Seharusnya: (1) rancang interleaved (acak batch); (2) PCA SEBELUM DE — bila batch mendominasi, hentikan; (3) design = ~batch + kondisi hanya bila batch tidak confounded total. Pelajaran termahal RNA-seq: <strong>desain eksperimen &gt; analisis</strong>. 2/20 validasi = uang dan waktu terbuang karena 1 jam perencanaan dilewatkan.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Dari Count ke Cerita Biologi</h2>
      <p>RNA-seq terlihat sederhana: hitung read per gen, bandingkan. Kenyataannya ia adalah <strong>ujian berlapis</strong> — tiap lapisan punya jebakan yang mengubah daftar “gen signifikan”. Pendalaman ini membedah lapisan yang paling sering salah.</p>

      <h3>1. Kenapa count mentah menipu (bahkan untuk eksplorasi)</h3>
      <p>Dua bias sistematis membuat count mentah tidak bisa dibandingkan langsung:</p>
      <ul>
        <li><strong>Kedalaman sekuensing:</strong> sampel A 40 juta read, sampel B 20 juta — gen yang sama tampak “2x lebih aktif” di A padahal identik.</li>
        <li><strong>Panjang gen:</strong> gen 10 kb mengumpulkan ~10x read dibanding gen 1 kb pada ekspresi yang sama (lebih banyak “target” untuk read jatuh).</li>
      </ul>
      <p>Normalisasi TMM (DESeq2/edgeR) mengatasi ini dengan elegan: bukan membagi total read (yang didominasi segelintir gen super-aktif), tapi memakai <strong>median rasio</strong> gen-gen yang tidak berubah — “suara mayoritas gen yang stabil” sebagai jangkar.</p>
      <details className="worked">
        <summary>📐 Contoh: total-count vs TMM, kesimpulan berbalik</summary>
        <p>Dua sampel, 3 gen. Sampel A: gen X=1000 (super-aktif), Y=100, Z=100 (total 1200). Sampel B: X=1000, Y=100, Z=100 (total 1200) — <strong>identik</strong>.<br />
        Sekarang gen X di B meledak 10x (X=10000, total B=10200) karena satu pathway aktif.<br />
        Normalisasi total-count: Y di A = 100/1200 = 8,3%; Y di B = 100/10200 = 0,98% → <strong>Y tampak turun 8,5x</strong> padahal tidak berubah! (Efek komposisional — mirip jebakan BI14.)<br />
        TMM: memakai median rasio gen stabil (Y, Z tidak berubah → faktor skala ≈ 1 untuk keduanya) → Y benar dinyatakan <strong>tidak berubah</strong>, hanya X yang naik.<br />
        <strong>Interpretasi:</strong> satu gen yang meledak bisa membuat ribuan gen lain “tampak berubah” di normalisasi naif. Mayoritas “penemuan” RNA-seq yang gagal replikasi lahir di sini.</p>
      </details>

      <h3>2. Model negatif binomial: kenapa bukan uji-t</h3>
      <Tex math={String.raw`\text{Var}(K) = \mu + \alpha \mu^2`} block />
      <p><strong>Artinya tiap simbol:</strong> K = count read suatu gen; μ (mu) = rata-rata count; α (alpha) = dispersi (seberapa “meledak” variansi antar replikat biologis). Suku αμ² membuat variansi <strong>tumbuh kuadratik</strong> — jauh di atas Poisson (yang variansinya = μ).</p>
      <details className="worked">
        <summary>📐 Contoh: uji-t menghukum gen yang menarik</summary>
        <p>Gen dengan μ = 1000, α = 0,1 (tipikal RNA-seq): Var = 1000 + 0,1×10<sup>6</sup> = <strong>101.000</strong> → SD ≈ 318.<br />
        Uji-t mengasumsikan variansi konstan/skala normal → untuk gen count-tinggi, ia <strong>meremehkan variansi</strong> → p-value terlalu kecil → false positive.<br />
        Untuk gen count-rendah (μ = 10): Var = 10 + 0,1×100 = 20 — Poisson masih lumayan. Jadi uji-t <strong>bias sistematis</strong>: menghukum gen ekspresi tinggi (yang sering paling menarik biologisnya).<br />
        DESeq2/edgeR mengestimasi α per gen (dengan <em>shrinkage</em> antar gen — “pinjam kekuatan” dari ribuan gen lain karena replikat cuma 3!) lalu uji Wald/LRT. Inilah kenapa “3 vs 3” bisa bekerja: informasi dibagi antar 20.000 gen.</p>
      </details>

      <h3>3. Batch effect: musuh yang tak terlihat</h3>
      <p>RNA-seq sensitif pada <strong>kapan/di mana/diolah siapa</strong>: reagen beda lot, teknisi beda, mesin beda → ribuan gen “berubah signifikan” antar batch. Jika semua sampel kanker diproses Senin dan semua normal diproses Jumat, “gen kanker” yang ditemukan mungkin sebenarnya “gen hari-Jumat”.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Desain mengalahkan statistik</strong></p>
        <p>Batch effect yang <strong>confounded</strong> (batch = kondisi) tidak bisa dikoreksi statistik apa pun — informasi sudah hilang. Solusinya di desain: acak sampel ke batch (jangan kelompokkan per kondisi!), catat semua variabel teknis, dan sertakan sebagai kovariat di model DESeq2 (<code>~ batch + kondisi</code>). Statistik memperbaiki ketidakseimbangan kecil; ia tidak menghidupkan data yang mati.</p>
      </div>

      <h3>4. Dari daftar gen ke cerita: enrichment</h3>
      <p>Daftar 500 gen DE tidak bisa dibaca satu per satu — perlu <strong>enrichment</strong>: apakah gen-gen ini berkumpul di pathway tertentu melebihi kebetulan? GSEA memakai seluruh ranking (tanpa cutoff arbitrer “p &lt; 0,05”), ORA memakai daftar terpotong. Keduanya menjawab: “cerita biologis apa yang diceritakan data ini?”</p>
      <details className="worked">
        <summary>📐 Contoh: membaca hasil enrichment</summary>
        <p>Hasil: pathway “DNA repair” — 25 dari 500 gen DE ada di pathway ini; pathway punya 200 gen dari total 20.000.<br />
        Ekspektasi kebetulan: 500 × (200/20.000) = <strong>5 gen</strong>. Teramati: 25 (5x lipat, p-adjust &lt; 10<sup>−6</sup>).<br />
        <strong>Interpretasi:</strong> bukan “25 gen penting” — tapi “program perbaikan DNA aktif secara kolektif”, konsisten dengan respons kerusakan DNA pada kanker. Satu pathway yang koheren &gt; 25 gen acak. Inilah lompatan dari <em>daftar</em> ke <em>cerita</em>.</p>
      </details>

      <h2 id="kasus2">🏥 Kasus Lapangan: Uji Obat 3 vs 3</h2>
      <p>Startup menguji obat X pada sel kanker: 3 replikat treated vs 3 kontrol, RNA-seq. CEO ingin “daftar gen yang diubah obat” minggu depan. Kamu menjalankan DESeq2. Ini walkthrough keputusan nyatanya:</p>

      <h3>Langkah 1: PCA dulu, p-value kemudian</h3>
      <p>PCA: PC1 (45%) memisahkan treated vs kontrol ✓. Tapi PC2 (20%) memisahkan <strong>replikat 1-2 vs replikat 3</strong> di kedua kondisi — batch effect! Cek metadata: replikat 3 diproses hari berbeda. Model: <code>~ batch + kondisi</code> (bukan <code>~ kondisi</code> saja).</p>
      <details className="worked">
        <summary>📐 Contoh: biaya mengabaikan batch</summary>
        <p>Tanpa koreksi batch: <strong>2.300 gen DE</strong> (FDR &lt; 0,05). Dengan <code>~ batch + kondisi</code>: <strong>480 gen DE</strong>.<br />
        1.820 gen “temuan” adalah <strong>efek hari-pemrosesan</strong>, bukan obat. CEO yang menerima angka 2.300 akan mempresentasikan ke investor — lalu malu saat due diligence.<br />
        <strong>Interpretasi:</strong> batch effect tidak mengurangi “signifikansi” — ia <strong>menciptakan penemuan palsu</strong>. Selalu masukkan batch yang diketahui ke model; yang tidak diketahui, deteksi via PCA/RUV.</p>
      </details>

      <h3>Langkah 2: baca volcano plot seperti profesional</h3>
      <p>Sumbu X = log2 fold-change, Y = −log10(p-adjust). Gen kandidat ideal: <strong>kanan-atas</strong> (naik kuat + sangat signifikan) atau <strong>kiri-atas</strong>. Tapi waspadai:</p>
      <ul>
        <li><strong>Gen di puncak tengah-atas:</strong> p sangat kecil tapi fold-change 1,2x — signifikan statistik, <strong>relevan biologis?</strong> (mungkin tidak).</li>
        <li><strong>Gen di ujung kanan-bawah:</strong> fold-change 8x tapi tidak signifikan — biasanya <strong>count rendah + variansi tinggi</strong> (satu replikat meledak). Jangan kejar!</li>
      </ul>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Shrinkage LFC</strong></p>
        <p>DESeq2 <code>lfcShrink</code>: fold-change gen count-rendah <strong>ditarik ke nol</strong> (karena estimasinya tidak stabil). Volcano dengan LFC ter-shrink = peta yang jujur; tanpa shrink = peta yang melebih-lebihkan gen kecil. Selalu pakai untuk ranking &amp; visualisasi.</p>
      </div>

      <h3>Langkah 3: dari 480 gen ke cerita obat</h3>
      <p>GSEA pada ranking: pathway <strong>apoptosis</strong> dan <strong>p53</strong> enriched naik; <strong>siklus sel (E2F targets)</strong> turun. Cerita: obat X mengaktifkan p53 → henti siklus + apoptosis — <strong>mekanisme yang masuk akal</strong> untuk kandidat antikanker. Validasi: qPCR 5 gen top + uji viabilitas dosis-respons (RNA-seq tidak membuktikan obat bekerja — ia memberi <strong>hipotesis mekanisme</strong>).</p>

      <h3>Yang dilaporkan ke CEO</h3>
      <p>“480 gen berubah (FDR 5%), mekanisme probable via p53/apoptosis, butuh validasi qPCR + fungsional sebelum klaim. Estimasi false discovery: ~24 gen.” <strong>Angka + mekanisme + ketidakpastian</strong> — tiga hal yang membuat laporan dipercaya investor yang paham.</p>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kenapa RPM tidak cocok untuk differential expression?"
        options={["Terlalu lambat",
          "Artefak komposisi: segelintir gen ekstrem menggeser semua gen lain",
          "Tidak ada alasan",
          "Hanya untuk DNA"]}
        correct={1}
        explanation="Benar: MYC menyedot read → gen lain terlihat turun palsu. Pakai size factor/TMM."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Count RNA-seq dimodelkan dengan Negative Binomial karena…"
        options={["Selalu normal",
          "Overdispersed (variansi > mean) — Poisson tidak cukup",
          "Lebih mudah",
          "Wajib regulasi"]}
        correct={1}
        explanation="Benar: biologi itu berisik melebihi Poisson. NB + dispersi per gen = model yang tepat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Fungsi shrinkage dispersi di DESeq2?"
        options={["Mempercantik plot",
          "Pinjam kekuatan antar-gen: stabilkan estimasi dengan replikat sedikit",
          "Menghapus outlier",
          "Tidak ada"]}
        correct={1}
        explanation="Benar: 3 replikat tak cukup estimasi dispersi satu gen — tapi pola 20.000 gen membantu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Dari 20.000 uji tanpa koreksi, p<0,05 menghasilkan sekitar…"
        options={["0 false positive",
          "1.000 false positive ekspektasi",
          "5",
          "Semua benar"]}
        correct={1}
        explanation="Benar: 20.000 × 0,05. Inilah kenapa FDR (BH) wajib — bukan opsional."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Gen: log2FC=4, padj=0,3. Sikap?"
        options={["Kejar! efek besar",
          "Jangan — efek besar tapi tak signifikan = noise (count kecil/variansi besar)",
          "Publikasikan",
          "Abaikan FC"]}
        correct={1}
        explanation="Benar: baca volcano dua dimensi. Efek tanpa keyakinan = harta karun palsu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. GSEA unggul atas over-representation karena…"
        options={["Lebih cepat",
          "Tanpa threshold: memakai semua gen terurut — sinyal terdistribusi tidak terpotong",
          "Gratis",
          "Tidak perlu statistik"]}
        correct={1}
        explanation="Benar: pathway dengan banyak gen berubah kecil terlewat oleh threshold tapi tertangkap GSEA."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Normalisasi DE = <strong>size factor/TMM</strong>; waspadai artefak komposisi.</li>
          <li>Count overdispersed → <strong>Negative Binomial + shrinkage</strong> (DESeq2/edgeR).</li>
          <li>Jangan uji-t pada count mentah.</li>
          <li><strong>FDR (BH)</strong> wajib untuk 20.000 uji.</li>
          <li><strong>Volcano</strong>: baca efek DAN signifikansi bersamaan.</li>
          <li>Desain: <strong>batch dalam formula</strong>; PCA sebelum DE.</li>
          <li>Interpretasi: <strong>GSEA/GO/KEGG</strong> — dari gen ke cerita.</li>
          <li>Desain eksperimen &gt; analisis: batch confounded = tidak terselamatkan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi8-ngs-pipeline" className="btn btn-secondary btn-sm">← BI8</Link>
        <Link href="/learn/bi10-statistik-bioinfo" className="btn btn-primary btn-sm">BI10 →</Link>
      </div>
    </div>
  );
}
