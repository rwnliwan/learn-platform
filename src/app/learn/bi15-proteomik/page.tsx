"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi15ProteomikPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi15MrnaProtData = [{"x": [1, 2, 3, 4, 5, 6, 7, 8], "y": [1.1, 2.2, 2.9, 4.3, 5.1, 5.8, 7.2, 7.9], "type": "scatter", "mode": "markers", "marker": {"color": "#2a7de1", "size": 9}, "name": "Gen", "text": ["A", "B", "C", "D", "E", "F", "G", "H"], "textposition": "top center"}];
  const bi15MrnaProtDataLayout = {"xaxis": {"title": "log2FC mRNA (RNA-seq)"}, "yaxis": {"title": "log2FC protein (MS)"}, "showlegend": false};

  const bi15MofaData = [{"x": ["Faktor 1", "Faktor 2", "Faktor 3", "Faktor 4"], "y": [35, 20, 12, 8], "type": "bar", "name": "mRNA", "marker": {"color": "#2a7de1"}}, {"x": ["Faktor 1", "Faktor 2", "Faktor 3", "Faktor 4"], "y": [25, 10, 18, 5], "type": "bar", "name": "Protein", "marker": {"color": "#e8a838"}}, {"x": ["Faktor 1", "Faktor 2", "Faktor 3", "Faktor 4"], "y": [15, 8, 5, 20], "type": "bar", "name": "Metilasi", "marker": {"color": "#7fb3f0"}}];
  const bi15MofaDataLayout = {"barmode": "group", "xaxis": {"title": "Faktor laten"}, "yaxis": {"title": "Variansi (%)"}, "showlegend": true};

  const lab1Code = "# spektra observasi (massa fragmen)\nspektra = [100.1, 200.3, 315.2, 428.4, 541.6]\n# kandidat: nama -> massa fragmen teoritis\nkandidat = {'PEPTIDA': [100.0, 200.1, 315.0, 428.2, 541.5],\n            'PEPTIDB': [100.5, 210.0, 300.0, 400.0, 500.0],\n            'DECOY_X': [99.9, 200.4, 315.3, 428.5, 541.7]}\ndef skor(obs, teor, tol=0.5):\n    cocok = sum(1 for o in obs if any(abs(o-t) < tol for t in teor))\n    return cocok/len(obs)\nhasil = sorted(((skor(spektra, t), n) for n, t in kandidat.items()), reverse=True)\nfor s, n in hasil:\n    print(f'{n}: skor={s:.0%}')\nprint()\nprint('DECOY_X menang/tie -> curigai FDR!')\nprint('MaxQuant: ribuan decoy -> FDR 1% yang terkontrol.')";

  const lab2Code = "mrna = {'A':1.0,'B':2.0,'C':3.0,'D':4.0,'E':5.0,'F':6.0,'G':7.0,'H':8.0}\nprot = {'A':1.1,'B':2.2,'C':0.2,'D':4.3,'E':5.1,'F':1.0,'G':7.2,'H':7.9}\nimport statistics as st\nxm, xp = list(mrna.values()), list(prot.values())\nmx, mp = st.mean(xm), st.mean(xp)\nr = sum((a-mx)*(b-mp) for a,b in zip(xm,xp)) / \\\n    (sum((a-mx)**2 for a in xm)*sum((b-mp)**2 for b in xp))**0.5\nprint(f'korelasi mRNA-protein: r={r:.2f}')\nprint('gen diskrepan (|selisih|>2):')\nfor g in mrna:\n    d = abs(mrna[g]-prot[g])\n    if d > 2:\n        arah = 'protein diredam' if mrna[g] > prot[g] else 'protein diperkuat'\n        print(f'  {g}: mRNA={mrna[g]}, protein={prot[g]} -> {arah}')\nprint()\nprint('C & F: mRNA naik, protein tidak -> degradasi/translasi.')\nprint('Tanpa proteomik, keduanya terlihat “aktif”.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI15 &mdash; Bioinformatics</span>
        <h1 className="display-title">AlphaFold &amp; Multi-Omics:<br />Proteomik dan Integrasi</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Struktur yang Menunggu 50 Tahun</a></li>
          <li><a href="#proteomik">Proteomik: Dari Spektra ke Protein</a></li>
          <li><a href="#alphafold">AlphaFold &amp; Docking: Struktur dari Sekuens</a></li>
          <li><a href="#multiomics">Integrasi Multi-Omics</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Identifikasi Peptida (Skor Sederhana)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Integrasi Mini (mRNA vs Protein)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Dari Spektra ke Cerita Multi-Omics</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Ketika RNA Berbohong</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan alur <strong>proteomik mass-spectrometry</strong>: spektra → peptida → protein.</li>
          <li>Menjelaskan <strong>AlphaFold</strong>: prediksi struktur + cara membaca pLDDT.</li>
          <li>Menjelaskan prinsip <strong>docking</strong> untuk drug discovery.</li>
          <li>Merancang <strong>integrasi multi-omics</strong> (MOFA, network) dan menghindari jebakannya.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Struktur yang Menunggu 50 Tahun</h2>
      <div className="story">
        <p>Menentukan SATU struktur protein via kristalografi: 1 PhD, 3 tahun, Rp1 miliar. Tahun 2021, AlphaFold memprediksi <strong>200 juta struktur</strong> dalam setahun — gratis. Masalah 50 tahun (protein folding) runtuh dalam semalam. Lab struktural panik; lab biologi pesta.</p>
      <p>Tapi struktur bukan segalanya: protein bekerja dalam jaringan interaksi, modifikasi, dan konteks sel. Lesson ini: dari spektra mass-spec ke protein, dari sekuens ke struktur (AlphaFold), lalu naik satu level — mengintegrasikan genomik, transkriptomik, proteomik menjadi cerita utuh (multi-omics).</p>
      <p>Twist-nya: AlphaFold memprediksi 200 juta struktur, tapi struktur ≠ fungsi — dan mass-spec yang mengukur kelimpahan protein punya bias buta: protein besar, hidrofobik, atau berlimpah rendah sering <strong>tidak terlihat sama sekali</strong>. Twist yang lebih dalam: RNA naik belum tentu protein naik (regulasi translasi!) — korelasi RNA-protein di sel manusia hanya ~0,4. Satu lapisan omics yang dibaca sendirian bisa berbohong dengan percaya diri. Multi-omics bukan kemewahan; ia adalah <strong>koreksi silang</strong> terhadap kebohongan tiap lapisan.</p>
      </div>

      <h2 id="proteomik">Proteomik: Dari Spektra ke Protein</h2>
      <p><strong>Definisi.</strong> <strong>Mass spec (MS)</strong>: pecah protein → peptida → ukur massa fragmen → cocokkan ke database (search engine: MaxQuant). <strong>Kuantifikasi</strong>: label-free (intensitas) atau TMT (multiplex). <strong>PTM</strong>: fosforilasi dkk. dideteksi sebagai pergeseran massa.</p>
      <Tex math={String.raw`\text{FDR} = \frac{N_{\text{decoy}}}{N_{\text{target}}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`N_{\text{decoy}}`} />: cocokan ke database umpan (urutan terbalik) — estimasi tebakan</li>
          <li><Tex math={String.raw`N_{\text{target}}`} />: cocokan ke database asli</li>
      </ul>
      <p><strong>Interpretasi:</strong> Rasio target-decoy: bila 1.000 dari 100.000 spektra cocok ke umpan (yang pasti salah), ~1% cocokan target juga salah. Standar: FDR 1% di level peptida DAN protein.</p>
      <details className="worked">
        <summary>📐 Contoh: FDR di proteomik</summary>
        <p>100.000 spektra dicocokkan ke database + <strong>decoy</strong> (urutan terbalik).<br />1.000 cocok ke decoy → FDR ≈ 1.000/99.000 ≈ 1% ✓.<br />Tanpa target-decoy, “identifikasi” = tebakan. Standar: FDR 1% peptida &amp; protein.<br /><strong>Missing value:</strong> protein tak terdeteksi di sebagian sampel — imputasi hati-hati (bukan acak! sering MNAR: di bawah limit deteksi).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Proteomik MS itu seperti mengidentifikasi mobil dari suaranya: tiap peptida punya “suara” (pola fragmen massa) yang dicocokkan ke katalog. Label-free = dengarkan satu per satu; TMT = paduan suara 16 sampel sekaligus dengan label nada.</p>
      <p><strong>Kapan memakai:</strong> Ekspresi protein aktual (mRNA ≠ protein!), PTM, interaksi (AP-MS), biomarker cairan tubuh.</p>

      <PlotlyChart
        data={bi15MrnaProtData}
        title="mRNA vs Protein (log2FC, ilustratif)"
        layout={bi15MrnaProtDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Tiap titik = satu gen. Diagonal = mRNA dan protein berubah seiring. Titik jauh dari diagonal = regulasi pasca-transkripsi.</p>
        <p><strong>Interpretasi:</strong> Korelasi hanya ~0,5: gen D naik di mRNA tapi datar di protein (degradasi?), gen H sebaliknya. Inilah kenapa proteomik DIBUTUHKAN — mRNA bukan proksi protein. Multi-omics lahir dari kesenjangan ini.</p>
      </div>

      <h2 id="alphafold">AlphaFold &amp; Docking — Si Peramal Struktur</h2>
      <p><strong>Definisi.</strong> <strong>AlphaFold2/3</strong>: prediksi struktur 3D dari sekuens (deep learning + MSA). <strong>pLDDT</strong>: keyakinan per residu (0–100). <strong>Docking</strong> (AutoDock Vina): prediksi pose &amp; afinitas ligan di kantong protein — skrining virtual obat.</p>
      <details className="worked">
        <summary>📐 Contoh: membaca pLDDT</summary>
        <p>Protein X hasil AlphaFold: domain kinase pLDDT 95 (biru) → percaya diri, bisa untuk docking.<br />Loop N-terminal pLDDT 45 (oranye) → fleksibel/tak terstruktur — JANGAN pakai untuk desain obat presisi.<br />pLDDT rendah + tidak ada MSA dalam = prediksi lemah (protein yatim).<br /><strong>Docking:</strong> 10.000 senyawa → Vina → top 100 skor → uji in vitro 100 → 5 hit. Funnel standar drug discovery komputasional.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> AlphaFold itu seperti arsitek yang melihat daftar bahan (sekuens) lalu menggambar gedungnya — dengan catatan kaki “bagian ini saya yakin, bagian itu (loop fleksibel) jangan percaya”. Docking itu seperti mencoba kunci ke gembok: ribuan kunci dicoba virtual sebelum satu dibuat fisik.</p>
      <p><strong>Kapan memakai:</strong> Struktur untuk hipotesis fungsi, desain mutasi, docking awal. Bukan pengganti eksperimen untuk mekanisme presisi / dinamika.</p>
      <div className="callout callout-warning"><strong>Batasan AlphaFold:</strong> (1) satu konformasi statis — protein itu dinamis; (2) lemah untuk kompleks multimerik tak dikenal &amp; mutasi titik (tidak memprediksi efek mutasi andal!); (3) tanpa ligan/kofaktor (AF3 membaik). Jangan pakai untuk klaim “mutasi ini merusak struktur” tanpa validasi.</div>

      <h2 id="multiomics">Integrasi Multi-Omics — Si Orkestra</h2>
      <p><strong>Definisi.</strong> <strong>Multi-omics</strong>: gabungkan lapisan (genom, epigenom, transkriptom, proteom, metabolom) untuk cerita utuh. Metode: <strong>MOFA</strong> (faktor laten bersama), <strong>network</strong> (jaringan gen-protein), <strong>korelasi lintas-omics</strong>.</p>
      <Tex math={String.raw`X^{(m)} \approx Z {W^{(m)}}^T`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`X^{(m)}`} />: matriks data omics ke-m (sampel × fitur)</li>
          <li><Tex math={String.raw`Z`} />: faktor laten BERSAMA lintas omics (sampel × faktor)</li>
          <li><Tex math={String.raw`W^{(m)}`} />: bobot spesifik omics-m (bagaimana faktor termanifestasi di lapisan ini)</li>
      </ul>
      <p><strong>Interpretasi:</strong> MOFA = faktorisasi matriks bersama: tiap omics dijelaskan oleh faktor laten yang SAMA (Z) dengan bobot spesifik (W). Faktor yang kuat di semua omics = orkestra; yang kuat di satu omics = solo.</p>
      <details className="worked">
        <summary>📐 Contoh: MOFA pada kanker</summary>
        <p>Data: mutasi + metilasi + mRNA + protein, 200 tumor.<br /><strong>MOFA</strong> menemukan faktor laten 1 menjelaskan variansi di SEMUA omics → pasien terstratifikasi 3 subtipe.<br />Subtipe A: mutasi TP53 + hipermetilasi + program EMT aktif → prognosis buruk.<br />Satu omics saja tidak menemukan subtipe ini — sinyalnya terdistribusi.<br /><strong>Jebakan:</strong> batch per-omics beda! Integrasikan setelah koreksi per lapisan (BI10).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Single-omics itu seperti mendengar satu alat musik; multi-omics adalah orkestra: genom = partitur, epigenom = interpretasi konduktor, transkriptom = suara alat, proteom = musik yang terdengar. Satu alat fals belum tentu konser gagal — dengar semuanya.</p>
      <p><strong>Kapan memakai:</strong> Mekanisme penyakit kompleks, biomarker panel, subtipe kanker (TCGA), respons obat. Butuh n cukup &amp; desain terkoordinasi.</p>

      <PlotlyChart
        data={bi15MofaData}
        title="Variansi Dijelaskan per Faktor MOFA (ilustratif)"
        layout={bi15MofaDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Tiap faktor laten = pola bersama lintas omics. Warna = kontribusi per lapisan omics.</p>
        <p><strong>Interpretasi:</strong> Faktor 1 kuat di SEMUA omics = sinyal biologis bersama (mis. subtipe). Faktor 4 dominan metilasi saja = spesifik satu lapisan. MOFA memisahkan “orkestra” (bersama) dari “solo” (spesifik) — fokus pada faktor bersama untuk mekanisme.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;AlphaFold mengakhiri biologi struktural&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> AlphaFold memprediksi SATU konformasi statis dengan keyakinan bervariasi. Dinamika, kompleks baru, efek mutasi, dan interaksi ligan tetap butuh eksperimen + simulasi (MD). Ia mengakselerasi — bukan mengakhiri — struktural.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;mRNA = protein, jadi proteomik mubazir&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Korelasi mRNA-protein hanya ~0,4–0,6 (lihat chart!). Translasi, degradasi, dan PTM memutus hubungan. Obat bekerja pada PROTEIN — mengabaikan lapisan ini = mengabaikan target obat itu sendiri.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin banyak omics selalu makin baik&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Tiap omics = biaya + batch + kompleksitas. Tanpa hipotesis &amp; n cukup, multi-omics = multi-noise. Integrasi butuh desain: sampel SAMA lintas omics, batch terkontrol, pertanyaan jelas.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu cek <strong>pLDDT</strong> sebelum memakai struktur AlphaFold. Aturan praktis: &gt;90 andal, 70–90 hati-hati, &lt;70 jangan untuk desain presisi.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Proteomik: pahami <strong>missing value</strong>-mu (MNAR vs MAR) sebelum imputasi. Imputasi buta = temuan palsu.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Multi-omics: <strong>faktor bersama</strong> (MOFA) lebih berharga dari daftar per-omics. Cerita integratif &gt; tumpukan daftar.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Skor Identifikasi Peptida</h2>
      <p>Cocokkan spektra (massa fragmen) ke 3 kandidat peptida via skor sederhana. Lihat konsep target-decoy: tambahkan kandidat acak (decoy)!</p>
      <PyodideLab
        title="🔬 Lab 1: Skor Identifikasi Peptida"
        hint="Tambahkan 3 decoy acak. Berapa yang menang? Itulah estimasi FDR versi mini — fondasi MaxQuant."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: mRNA vs Protein — Cari Diskrepansi</h2>
      <p>Diberikan log2FC mRNA &amp; protein 8 gen, hitung korelasi dan tandai gen dengan regulasi pasca-transkripsi (diskrepan).</p>
      <PyodideLab
        title="🔬 Lab 2: mRNA vs Protein — Cari Diskrepansi"
        hint="Gen diskrepan = kandidat regulasi translasi/degradasi. Dalam riset nyata, ini daftar untuk validasi (pulse-chase, proteasome inhibitor)."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Butuh struktur cepat untuk hipotesis → AlphaFold + cek pLDDT</h3>
        <p><strong>Kondisi:</strong> Protein globular, MSA dalam.</p>
        <p><strong>Kenapa:</strong> Gratis, cepat, cukup untuk hipotesis.</p>
        <p><strong>Contoh nyata:</strong> Desain mutasi domain kinase.</p>
      </div>
      <div className="decision-card">
        <h3>2. Skrining virtual obat → Docking (Vina) + validasi in vitro</h3>
        <p><strong>Kondisi:</strong> Kantong ikatan jelas; library senyawa.</p>
        <p><strong>Kenapa:</strong> Funnel: 10.000 → 100 → 5 hit.</p>
        <p><strong>Contoh nyata:</strong> Hit untuk target kanker.</p>
      </div>
      <div className="decision-card">
        <h3>3. Ekspresi aktual / PTM → Proteomik MS</h3>
        <p><strong>Kondisi:</strong> mRNA tak cukup (selalu!).</p>
        <p><strong>Kenapa:</strong> Protein = lapisan aksi obat.</p>
        <p><strong>Contoh nyata:</strong> Fosforilasi jalur sinyal.</p>
      </div>
      <div className="decision-card">
        <h3>4. Mekanisme kompleks → Multi-omics (MOFA/network)</h3>
        <p><strong>Kondisi:</strong> n cukup; sampel sama lintas omics.</p>
        <p><strong>Kenapa:</strong> Sinyal terdistribusi antar lapisan.</p>
        <p><strong>Contoh nyata:</strong> Subtipe kanker TCGA.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>mRNA ≠ protein (r~0,5).</li>
          <li>AlphaFold: cek pLDDT; statis bukan dinamis.</li>
          <li>Proteomik: FDR target-decoy 1%.</li>
          <li>Multi-omics: faktor bersama &gt; tumpukan daftar.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: “Obat dari Docking” Tanpa Validasi</h2>
      <div className="callout">
        <p>Tim komputasional melaporkan 3 kandidat obat dari docking ke struktur AlphaFold (pLDDT 55 di kantong ikatan). Manajemen ingin langsung paten + uji klinis.</p>
        <p><strong>Pertanyaan:</strong> Keberatanmu sebagai bioinformatikawan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Tiga lampu merah: (1) pLDDT 55 di kantong = struktur tak terpercaya untuk docking presisi — pose bisa fiktif total; (2) docking ≠ afinitas nyata: skor Vina berkorelasi lemah dengan Kd eksperimental; tanpa uji in vitro (binding/cell assay), kandidat = hipotesis; (3) tanpa ADMET/toksisitas, lompat ke klinik = berbahaya. Jalur benar: validasi struktur (kristal/CryoEM kantong) → docking ulang → uji in vitro 100 senyawa → optimasi lead → hewan → klinik. Pelajaran: komputasi mempercepat funnel, bukan melompati tahap. “In silico hit” ≠ obat — bedakan di setiap slide presentasi.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Dari Spektra ke Cerita Multi-Omics</h2>
      <p>Proteomik adalah omics yang paling dekat dengan <strong>fungsi</strong> — dan paling jauh dari kemudahan. Mass-spec tidak “membaca protein”; ia menimbang fragmen peptida dan menebak asalnya. Pendalaman ini tentang tebakan itu, revolusi AlphaFold, dan kenapa satu lapisan omics tidak cukup.</p>

      <h3>1. Cara mass-spec “melihat” protein (dan butanya)</h3>
      <p>Alur bottom-up: protein → potong jadi peptida (tripsin) → ionisasi → ukur massa (MS1) → pecah → ukur fragmen (MS2) → cocokkan ke database teoritis. Identifikasi = <strong>pencocokan pola</strong>, bukan pembacaan langsung.</p>
      <ul>
        <li><strong>Bias buta:</strong> protein sangat besar, sangat hidrofobik (membran!), atau berlimpah rendah sering tidak terdeteksi. Proteom membran — tempat sebagian besar target obat — adalah titik buta kronis.</li>
        <li><strong>Missing value:</strong> peptida terdeteksi di sampel A tapi tidak di B — apakah tidak ada, atau hanya tidak tertangkap? (Mirip dropout single-cell, BI11.) Imputasi sembarangan = menciptakan data.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: FDR di identifikasi peptida</summary>
        <p>Database target + <strong>decoy</strong> (sekuens acak terbalik): 10.000 PSM (<em>peptide-spectrum match</em>) ke target, 100 ke decoy pada skor cutoff tertentu.<br />
        FDR ≈ 100/10.000 = <strong>1%</strong> — artinya ~100 identifikasi adalah salah, dan kita <strong>tahu</strong> itu (filosofi BI10: kesalahan yang diukur, bukan dihindari).<br />
        <strong>Interpretasi:</strong> daftar “5.000 protein teridentifikasi” selalu mengandung ~50 yang salah pada FDR 1%. Untuk klaim biomarker tunggal, validasi orthogonal (antibodi, targeted MS) wajib — jangan pernah meluncurkan kandidat obat dari satu PSM.</p>
      </details>

      <h3>2. AlphaFold: apa yang berubah, apa yang tidak</h3>
      <p>AlphaFold2 memprediksi struktur dari sekuens dengan akurasi mendekati eksperimen (median RMSD ~1 Å untuk rantai utama) — untuk protein dengan <strong>homolog cukup</strong> (MSA dalam). Yang TIDAK ia selesaikan:</p>
      <ul>
        <li><strong>Dinamika:</strong> protein bernapas (konformasi berubah saat mengikat). Satu struktur statis ≠ cara kerja.</li>
        <li><strong>Kompleks &amp; konteks:</strong> interaksi multi-protein, efek membran, modifikasi pasca-translasi — di luar prediksi standar.</li>
        <li><strong>Protein “yatim”:</strong> tanpa homolog (banyak protein patogen!), akurasi anjlok — skor pLDDT rendah = “jangan percaya daerah ini”.</li>
      </ul>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Baca pLDDT sebelum kagum</strong></p>
        <p>Setiap prediksi AlphaFold punya skor kepercayaan per residu (pLDDT): &gt;90 = sangat yakin; 50–70 = mungkin tidak terstruktur (<em>disordered</em> — yang justru sering fungsional!); &lt;50 = abaikan. Struktur “indah” dengan pLDDT 40 = lukisan, bukan data.</p>
      </div>

      <h3>3. Multi-omics: koreksi silang antar lapisan</h3>
      <p>Korelasi RNA-protein di sel manusia hanya <strong>~0,4</strong> — lebih dari setengah variasi protein TIDAK dijelaskan RNA-nya (regulasi translasi, degradasi, modifikasi). Tiga pola integrasi yang jujur:</p>
      <ul>
        <li><strong>Konkordansi:</strong> RNA naik + protein naik → regulasi transkripsi. Cerita sederhana, kepercayaan tinggi.</li>
        <li><strong>Diskordansi:</strong> RNA naik, protein tetap → regulasi translasi/degradasi aktif. Bukan “data bertentangan” — ini <strong>temuan</strong> (mis. respons stres menahan translasi).</li>
        <li><strong>Modifikasi:</strong> protein sama jumlahnya, tapi fosforilasinya berubah → jalur sinyal aktif tanpa perubahan ekspresi. Hanya terlihat di <strong>phosphoproteomik</strong> — lapisan yang tidak ada di RNA-seq.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: MOFA — faktor laten multi-omics</summary>
        <p>Data: RNA-seq + proteomik + metilasi, 200 pasien kanker. MOFA mengekstrak 10 faktor laten bersama.<br />
        Faktor 3: memuat gen siklus sel (RNA) + protein fosfo-CDK (proteomik) + hipometilasi promoter (epigenomik) — <strong>tiga lapisan menunjuk satu program biologi</strong> (proliferasi tak terkendali).<br />
        Pasien dengan Faktor 3 tinggi: survival 2x lebih buruk (p &lt; 10<sup>−4</sup>).<br />
        <strong>Interpretasi:</strong> tidak satu pun lapisan sendiri sekuat ini. Multi-omics bukan “lebih banyak data” — ia adalah <strong>triangulasi</strong>: tiga saksi independen yang menunjuk tersangka yang sama.</p>
      </details>

      <h3>Kasus nyata: ketika RNA berbohong dan protein jujur</h3>
      <p>Uji obat kanker: RNA-seq menunjukkan pathway apoptosis “aktif” (gen naik). Tim merayakan. Proteomik + phosphoproteomik: protein efektor apoptosis <strong>tidak berubah</strong>, tapi protein anti-apoptosis BCL-2 <strong>terfosforilasi-aktif</strong> — sel justru melindungi diri! Obat gagal di klinik fase 2. <strong>RNA menceritakan niat; protein menceritakan kenyataan.</strong> Inilah kenapa farmasi modern tidak lagi memutuskan dari satu omics — dan kenapa analis yang hanya bisa satu lapisan akan semakin tertinggal.</p>

      <h2 id="kasus2">🏥 Kasus Lapangan: Ketika RNA Berbohong</h2>
      <p>Uji obat kanker Y: RNA-seq menunjukkan gen apoptosis <strong>naik 5x</strong> — tim merayakan “obat memicu kematian sel kanker”. Kamu diminta konfirmasi proteomik sebelum fase 2 (biaya Rp50 miliar). Hasilmu akan menentukan nasib obat ini.</p>

      <h3>Lapisan 1: protein total — tidak berubah?!</h3>
      <p>Quantitative proteomics (TMT): protein efektor apoptosis (CASP3, BAX) — <strong>tidak berubah signifikan</strong>. RNA naik 5x, protein tetap. Diskordansi klasik (korelasi RNA-protein ~0,4!). Hipotesis: regulasi translasi menahan protein — atau protein didegradasi secepat dibuat.</p>

      <h3>Lapisan 2: phosphoproteomik — plot twist</h3>
      <details className="worked">
        <summary>📐 Contoh: fosforilasi yang membalik cerita</summary>
        <p>Phosphoproteomik: BCL-2 (anti-apoptosis!) <strong>terfosforilasi di Ser70</strong> — modifikasi yang <strong>mengaktifkan</strong> fungsi perlindungannya — naik 3x setelah obat.<br />
        Sementara itu BAD (pro-apoptosis) terfosforilasi di Ser112 → <strong>dinonaktifkan</strong> (terikat 14-3-3, disekap di sitoplasma).<br />
        <strong>Interpretasi:</strong> obat Y memicu <strong>respons protektif</strong> sel kanker — bukan apoptosis! RNA “apoptosis naik” adalah respons stres transkripsi yang <strong>gagal diterjemahkan</strong> menjadi kematian sel karena lapisan fosforilasi memblokirnya.<br />
        Keputusan: <strong>hentikan atau kombinasikan</strong> — obat Y saja tidak akan membunuh tumor; kombinasi dengan inhibitor BCL-2 (venetoclax-like) baru masuk akal. <strong>Rp50 miliar diselamatkan</strong> (atau diarahkan ke kombinasi yang benar).</p>
      </details>

      <h3>Pelajaran multi-omics</h3>
      <ul>
        <li><strong>RNA</strong> = niat transkripsi (apa yang sel <em>coba</em> lakukan).</li>
        <li><strong>Protein total</strong> = kenyataan kelimpahan (apa yang <em>ada</em>).</li>
        <li><strong>Phospho</strong> = status aktivitas (apa yang <em>aktif</em>).</li>
      </ul>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Hierarki bukti omics</strong></p>
        <p>Untuk klaim “pathway X aktif”: RNA saja = <strong>lemah</strong> (niat ≠ aksi); protein = <strong>sedang</strong>; modifikasi/fosforilasi + fenotip fungsional = <strong>kuat</strong>. Farmasi yang memutuskan dari RNA saja = membeli niat dengan harga kenyataan. Selalu tanya: “lapisan apa yang <em>tidak</em> kita ukur, dan bisakah ia membalik kesimpulan?”</p>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. pLDDT 45 pada suatu region AlphaFold artinya…"
        options={["Sangat yakin",
          "Tidak yakin (mungkin fleksibel/tak terstruktur) — jangan untuk desain presisi",
          "Error",
          "Harus dihapus"]}
        correct={1}
        explanation="Benar: pLDDT = keyakinan per residu. <70 = jangan pakai untuk klaim presisi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Korelasi mRNA-protein ~0,5 menunjukkan…"
        options={["RNA-seq gagal",
          "Regulasi pasca-transkripsi signifikan — proteomik dibutuhkan",
          "Protein tidak penting",
          "Data buruk"]}
        correct={1}
        explanation="Benar: kesenjangan ini = alasan proteomik & multi-omics ada."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. FDR 1% di proteomik diestimasi via…"
        options={["Feeling",
          "Target-decoy: cocokkan ke database + urutan terbalik",
          "Uji-t",
          "Tidak perlu"]}
        correct={1}
        explanation="Benar: decoy mengukur tebakan. Tanpa itu, identifikasi = klaim tanpa kontrol."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Batasan utama AlphaFold untuk efek mutasi?"
        options={["Tidak ada",
          "Tidak memprediksi efek mutasi titik secara andal + satu konformasi statis",
          "Terlalu lambat",
          "Berbayar"]}
        correct={1}
        explanation="Benar: “mutasi ini merusak struktur” butuh validasi, bukan sekadar AF."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. MOFA menemukan faktor laten yang menjelaskan variansi di SEMUA omics. Artinya?"
        options={["Noise",
          "Sinyal biologis bersama — kandidat mekanisme/subtipe",
          "Batch effect pasti",
          "Error"]}
        correct={1}
        explanation="Benar: orkestra, bukan solo. Faktor bersama = cerita integratif."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Docking virtual screening yang benar?"
        options={["Langsung klinik",
          "Funnel: ribuan senyawa → skor → validasi in vitro → optimasi",
          "Skor terbaik = obat",
          "Tanpa struktur"]}
        correct={1}
        explanation="Benar: komputasi mempercepat, bukan melompati. In silico ≠ obat."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Proteomik MS: <strong>spektra → peptida → protein</strong>; FDR target-decoy 1%.</li>
          <li><strong>mRNA ≠ protein</strong> (r~0,5) — proteomik mengisi kesenjangan.</li>
          <li><strong>AlphaFold</strong>: struktur dari sekuens; baca <strong>pLDDT</strong>; statis, bukan dinamis.</li>
          <li><strong>Docking</strong>: funnel virtual screening — validasi in vitro wajib.</li>
          <li><strong>Multi-omics</strong> (MOFA/network): faktor bersama lintas lapisan.</li>
          <li>Desain: <strong>sampel sama</strong> lintas omics; koreksi batch per lapisan.</li>
          <li>Tiap omics = biaya + kompleksitas — hipotesis dulu.</li>
          <li>Komputasi <strong>mempercepat</strong> drug discovery, bukan melompati tahap.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi14-metagenomik" className="btn btn-secondary btn-sm">← BI14</Link>
        <Link href="/learn/bi16-ml-bio" className="btn btn-primary btn-sm">BI16 →</Link>
      </div>
    </div>
  );
}
