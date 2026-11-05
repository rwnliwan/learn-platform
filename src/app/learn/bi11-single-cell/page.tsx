"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi11SingleCellPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi11QcData = [{"x": [200, 500, 800, 1200, 1800, 2500, 3500, 5000], "y": [50, 800, 2500, 3000, 1800, 600, 150, 30], "type": "bar", "marker": {"color": "#2a7de1"}, "name": "Sel", "text": ["", "", "", "", "", "", "", ""], "textposition": "outside"}];
  const bi11QcDataLayout = {"xaxis": {"title": "nFeature_RNA (gen terdeteksi)"}, "yaxis": {"title": "Jumlah barcode"}, "showlegend": false, "shapes": [{"type": "line", "x0": 200, "x1": 200, "y0": 0, "y1": 3200, "line": {"dash": "dash", "color": "#e8a838"}}, {"type": "line", "x0": 2500, "x1": 2500, "y0": 0, "y1": 3200, "line": {"dash": "dash", "color": "#e8a838"}}]};

  const lab1Code = "import random\nrandom.seed(2024)\nsel = []\nfor i in range(3000):\n    r = random.random()\n    if r < 0.15:      # droplet kosong\n        nf, nc, mt = random.randint(20,150), random.randint(50,400), random.uniform(0,5)\n    elif r < 0.25:    # sel mati\n        nf, nc, mt = random.randint(300,800), random.randint(500,2000), random.uniform(15,40)\n    elif r < 0.30:    # doublet\n        nf, nc, mt = random.randint(3000,6000), random.randint(8000,20000), random.uniform(2,8)\n    else:             # sel baik\n        nf, nc, mt = random.randint(500,2200), random.randint(1500,7000), random.uniform(1,9)\n    sel.append((nf, nc, mt))\nlolos = [s for s in sel if 200 <= s[0] <= 2500 and s[2] < 10]\nprint(f'total barcode : {len(sel)}')\nprint(f'lolos QC      : {len(lolos)} ({len(lolos)/len(sel):.0%})')\nprint(f'terbuang      : {len(sel)-len(lolos)} (kosong/mati/doublet)')\nprint()\nprint('30% sampah = NORMAL di scRNA-seq. QC bukan opsional.')\nprint('Doublet sungguhan butuh DoubletFinder/scrublet (pola ekspresi),')\nprint('bukan cuma nFeature tinggi.')";

  const lab2Code = "import random, statistics as st\nrandom.seed(11)\n# 3 tipe sel: (CD3D, CD79A)\ntipe = {'T': (10, 1), 'B': (1, 10), 'Mono': (4, 4)}\ndata = []\nfor t, (m1, m2) in tipe.items():\n    for _ in range(100):\n        data.append((t, random.gauss(m1,1.5), random.gauss(m2,1.5)))\n# k-means k=3, sederhana\ncent = [(12,1),(1,12),(4,4)]\nfor _ in range(20):\n    kl = [[] for _ in range(3)]\n    for t,x,y in data:\n        j = min(range(3), key=lambda j: (x-cent[j][0])**2+(y-cent[j][1])**2)\n        kl[j].append((t,x,y))\n    cent = [(st.mean(p[1] for p in c), st.mean(p[2] for p in c)) for c in kl]\nprint('klaster -> komposisi tipe asli:')\nfor j, c in enumerate(kl):\n    hit = {}\n    for t,_,_ in c: hit[t] = hit.get(t,0)+1\n    print(f'  klaster {j}: {hit}')\nprint()\nprint('Klaster ~ tipe asli bila marker kuat. Anotasi = beri nama')\nprint('berdasarkan marker dominan (CD3D tinggi -> T cell).')";

  const bi11TradeData = [{"x": ["Bulk", "Single-cell", "Spatial"], "y": [9, 6, 4], "type": "bar", "name": "Throughput/murah", "marker": {"color": "#2a7de1"}}, {"x": ["Bulk", "Single-cell", "Spatial"], "y": [2, 9, 10], "type": "bar", "name": "Resolusi", "marker": {"color": "#e8a838"}}];
  const bi11TradeDataLayout = {"barmode": "group", "xaxis": {"title": "Teknologi"}, "yaxis": {"title": "Skor"}, "showlegend": true};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI11 &mdash; Bioinformatics</span>
        <h1 className="display-title">Seurat, UMAP &amp; Trajectory:<br />Single-Cell RNA-seq</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Smoothie vs Buah Potong</a></li>
          <li><a href="#qc">QC Single-Cell: Sel Baik vs Sampah</a></li>
          <li><a href="#reduksi">HVG, PCA, Clustering &amp; Anotasi</a></li>
          <li><a href="#trajectory">Trajectory &amp; Spatial (Arah Baru)</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: QC Metrics &amp; Filter Sel</a></li>
          <li><a href="#lab2">🔬 Lab 2: Clustering Sederhana (k-means)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Dari Matriks Jarang ke Peta Sel</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Menemukan Sel yang Lolos Kemoterapi</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan perbedaan <strong>bulk vs single-cell RNA-seq</strong> dan kapan masing-masing.</li>
          <li>Menerapkan <strong>QC sel</strong>: nFeature, nCount, %MT, doublet.</li>
          <li>Menjelaskan alur <strong>HVG → PCA → neighbor → clustering → UMAP → anotasi marker</strong>.</li>
          <li>Menjelaskan konsep <strong>trajectory/pseudotime</strong> dan <strong>spatial transcriptomics</strong>.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Smoothie vs Buah Potong</h2>
      <div className="story">
        <p>Bulk RNA-seq seperti membuat smoothie dari sekeranjang buah lalu menebak komposisinya dari rasa: “ada manis apel, asam jeruk…” Single-cell seperti memotong tiap buah dan mencicipi satu per satu: “oh, ada 3 apel, 2 jeruk, dan 1 buah aneh yang belum pernah kulihat!”</p>
      <p>Buah aneh itu = tipe sel langka yang tak terlihat di bulk — mis. sel punca kanker 0,1% yang menyebabkan kekambuhan. Single-cell RNA-seq (teknologi terpilih dekade ini!) membuka heterogenitas yang disembunyikan rata-rata. Lesson ini adalah tur alur analisisnya — skill yang muncul di hampir semua lowongan bioinformatika 2026.</p>
      <p>Twist-nya berlapis. <strong>Pertama</strong>: sel langka 0,1% itu bukan sekadar “menarik” — sel punca kanker yang resisten kemoterapi itulah yang menyebabkan kekambuhan; menemukannya mengubah protokol terapi. <strong>Kedua</strong>: single-cell punya cara menipu yang baru. <em>Dropout</em> — gen yang tidak terdeteksi padahal aktif — membuat nol di matriks ≠ nol di sel. Bulk menyembunyikan lewat rata-rata; single-cell bisa menipu lewat <strong>ketidakhadiran palsu</strong>. Teknologi yang membuka heterogenitas menuntut skeptisisme yang juga baru.</p>
      </div>

      <h2 id="qc">QC Single-Cell: Sel Baik vs Sampah</h2>
      <p><strong>Definisi.</strong> Tiap <strong>barcode</strong> = satu sel (harusnya). QC menyaring: <strong>droplet kosong</strong> (nCount rendah), <strong>sel mati/stres</strong> (%MT tinggi — mitokondria bocor), <strong>doublet</strong> (2 sel 1 droplet — nFeature ganda).</p>
      <details className="worked">
        <summary>📐 Contoh: filter Seurat tipikal</summary>
        <p>nFeature_RNA: 200–2500 (buang &lt;200 = kosong, &gt;2500 = doublet?).<br />percent.mt &lt; <strong>10%</strong> (jaringan umum; otak bisa 20%).<br />Doublet: prediksi via DoubletFinder/scrublet — buang skor tinggi.<br />Dari 10.000 barcode → 7.000 sel bersih. 30% sampah dibuang SEBELUM analisis — normal!</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> QC single-cell itu seperti sortir buah: buang yang busuk (mati), yang kembar siam (doublet), dan yang ternyata cuma kulit (droplet kosong). Smoothie dari buah busuk = bulk yang tercemar; untungnya di single-cell kita bisa membuang per buah.</p>
      <p><strong>Kapan memakai:</strong> Langkah 1 SELALU. Threshold tergantung jaringan (otak %MT tinggi normal!) — jangan pakai angka magis buta.</p>

      <PlotlyChart
        data={bi11QcData}
        title="Distribusi nFeature per Barcode (ilustratif)"
        layout={bi11QcDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Histogram gen terdeteksi per barcode. Dua garis kuning = ambang filter bawah (200) dan atas (2500).</p>
        <p><strong>Interpretasi:</strong> Puncak kiri (&lt;200) = droplet kosong/debris — buang. Ekor kanan (&gt;2500) = kandidat doublet — curigai. Yang tengah = sel layak. Inilah QC visual standar sebelum satu gen pun dianalisis.</p>
      </div>

      <h2 id="reduksi">HVG, PCA, Clustering &amp; Anotasi — Si Jalur Pipa</h2>
      <p><strong>Definisi.</strong> <strong>HVG</strong>: pilih 2.000 gen paling bervariasi (buang noise). <strong>PCA</strong>: reduksi linear. <strong>Clustering</strong> (Louvain/Leiden): kelompokkan sel mirip. <strong>UMAP</strong>: visualisasi. <strong>Anotasi</strong>: beri nama klaster via marker gen (CD3D = T cell, dsb.).</p>
      <Tex math={String.raw`\text{Resolusi} \uparrow \Rightarrow \text{jumlah klaster} \uparrow`} block />
      <p><strong>Interpretasi:</strong> Resolusi clustering adalah parameter, bukan kebenaran. Naikkan hingga klaster punya marker biologis yang jelas; berhenti sebelum menjadi noise. Uji beberapa resolusi (0,4–1,2) dan pilih yang bermakna.</p>
      <details className="worked">
        <summary>📐 Contoh: anotasi klaster imun</summary>
        <p>Klaster 0: CD3D+, CD8A+ → <strong>T CD8</strong>. Klaster 1: CD79A+, MS4A1+ → <strong>B cell</strong>. Klaster 2: CD14+, LYZ+ → <strong>monosit</strong>.<br />Validasi: cocokkan dengan referensi (Azimuth/SingleR) + cek marker di literatur.<br /><strong>Waspada:</strong> klaster kecil (0,5%) bisa jadi doublet atau tipe langka — investigasi, jangan langsung buang atau langsung klaim “novel”.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Alur ini seperti sensus: HVG = pilih pertanyaan survei yang membedakan; PCA = ringkas jawaban; clustering = kelompokkan warga mirip; anotasi = beri nama kampungnya (“Kampung T-cell”) berdasarkan penanda.</p>
      <p><strong>Kapan memakai:</strong> Alur standar Seurat/Scanpy untuk semua scRNA-seq. Resolusi clustering = tombol “berapa kampung” — tidak ada angka benar, ada yang bermakna biologis.</p>

      <h2 id="trajectory">Trajectory &amp; Spatial — Si Arah Baru</h2>
      <p><strong>Definisi.</strong> <strong>Trajectory/pseudotime</strong> (Monocle, Slingshot): urutkan sel sepanjang proses biologis (diferensiasi) dari snapshot statis. <strong>Spatial transcriptomics</strong> (Visium, Xenium): ekspresi gen + POSISI di jaringan — peta, bukan sekadar daftar.</p>
      <details className="worked">
        <summary>📐 Contoh: pseudotime diferensiasi</summary>
        <p>Sel punca darah: klaster HSC → progenitor → monosit matang.<br />Pseudotime mengurutkan sel; gen GATA1 naik di tengah (komitmen), CD14 naik di ujung (matang).<br /><strong>Validasi:</strong> pseudotime = inferensi, bukan waktu nyata! Konfirmasi dengan time-course eksperimen atau RNA velocity (rasio spliced/unspliced → arah perubahan).<br /><strong>Spatial:</strong> di tumor, T cell TERKECUALI dari inti tumor (excluded) vs menyusup (inflamed) — memprediksi respons imunoterapi. Tanpa posisi, keduanya terlihat sama!</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Trajectory itu seperti menyusun foto-foto kerumunan menjadi film: dari sel punca → perantara → matang, ditebak dari kemiripan. Spatial itu seperti sensus ber-peta: tidak cuma “siapa” tapi “tinggal di mana” — tetangga sel kanker vs sel imun mengubah segalanya.</p>
      <p><strong>Kapan memakai:</strong> Trajectory: diferensiasi, respons obat sepanjang waktu, perkembangan. Spatial: interaksi sel, mikroenvironment tumor — skill terpanas di lowongan 2026.</p>
      <div className="callout"><strong>Catatan lowongan:</strong> “Experience with single-cell and spatial transcriptomics” kini standar di posting bioinformatika (Karolinska, Tempus, Excelra). Kuasai alur scRNA-seq dulu (lesson ini), lalu spatial sebagai ekstensi — polanya mirip (QC → reduksi → klaster → anotasi + dimensi ruang).</div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Klaster = tipe sel yang pasti&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Klaster adalah hasil algoritma + parameter (resolusi!). Klaster bisa = tipe sel, state sel, batch, atau doublet. Anotasi butuh marker + referensi + validasi — bukan sekadar “Louvain bilang 8 klaster”.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;UMAP yang bagus = analisis yang benar&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> UMAP cantik bisa menutupi QC buruk (doublet jadi “klaster novel”!). Urutan: QC ketat → analisis → UMAP sebagai visualisasi, bukan validasi. Jangan tune parameter demi UMAP indah.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Pseudotime = waktu nyata&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Pseudotime = urutan inferensi dari kemiripan, bukan jam. Ia tidak tahu arah tanpa info tambahan (root yang benar, RNA velocity). Klaim “A menjadi B” butuh validasi eksperimental.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Hafalkan <strong>marker klasik</strong> jaringanmu (imun: CD3D/CD79A/CD14; otak: NEUN/OLIG2/GFAP). Anotasi 80% lebih cepat dengan kamus marker di kepala.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk integrasi multi-sampel: <strong>integrasi/harmony</strong> untuk hapus batch TAPI cek tidak menghapus biologi. Over-integration = klaster palsu menyatu.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Simpan <strong>Seurat/AnnData object</strong> berversi. Objek 50 GB yang tidak terdokumentasi = tidak ada gunanya 6 bulan kemudian.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: QC Metrics &amp; Filter Sel</h2>
      <p>Diberikan matriks sel × metrik (nFeature, nCount, %MT), terapkan filter QC dan lihat berapa sel lolos + distribusinya.</p>
      <PyodideLab
        title="🔬 Lab 1: QC Metrics &amp; Filter Sel"
        hint="Ubah threshold %MT 10 → 20. Berapa sel “martir” terselamatkan? Untuk jaringan apa ini dibenarkan? (Petunjuk: otak.)"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Clustering k-means Sederhana</h2>
      <p>Simulasikan 3 tipe sel (ekspresi 2 gen marker), jalankan k-means dari nol, lalu evaluasi: apakah klaster = tipe asli?</p>
      <PyodideLab
        title="🔬 Lab 2: Clustering k-means Sederhana"
        hint="Ini versi mini Louvain. Perhatikan: k-means butuh k yang benar — Louvain/Leiden menemukan k dari data (dengan resolusi). Itulah kenapa dipakai."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Eksplorasi heterogenitas jaringan → scRNA-seq</h3>
        <p><strong>Kondisi:</strong> Butuh resolusi sel; tipe langka penting.</p>
        <p><strong>Kenapa:</strong> Bulk meratakan sinyal langka.</p>
        <p><strong>Contoh nyata:</strong> Sel punca kanker 0,1%.</p>
      </div>
      <div className="decision-card">
        <h3>2. Perbandingan kondisi, n besar, budget terbatas → bulk RNA-seq</h3>
        <p><strong>Kondisi:</strong> Efek rata-rata cukup; butuh power statistik.</p>
        <p><strong>Kenapa:</strong> Murah, dalam, statistik matang (BI9).</p>
        <p><strong>Contoh nyata:</strong> DE 50 vs 50 sampel klinis.</p>
      </div>
      <div className="decision-card">
        <h3>3. Diferensiasi / dinamika → trajectory + RNA velocity</h3>
        <p><strong>Kondisi:</strong> Proses kontinu dari snapshot.</p>
        <p><strong>Kenapa:</strong> Urutkan + arahkan perubahan.</p>
        <p><strong>Contoh nyata:</strong> Diferensiasi hematopoietik.</p>
      </div>
      <div className="decision-card">
        <h3>4. Konteks ruang penting → spatial transcriptomics</h3>
        <p><strong>Kondisi:</strong> Posisi menentukan fungsi/interaksi.</p>
      <PlotlyChart
        data={bi11TradeData}
        title="Bulk vs Single-cell vs Spatial (ilustratif)"
        layout={bi11TradeDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Biru = kemudahan/throughput, kuning = resolusi informasi. Tidak ada yang menang keduanya.</p>
        <p><strong>Interpretasi:</strong> Trade-off klasik: bulk murah tapi buta heterogenitas; spatial paling informatif tapi mahal dan kompleks. Pilih sesuai pertanyaan — bukan yang paling canggih.</p>
      </div>
        <p><strong>Kenapa:</strong> Peta, bukan daftar.</p>
        <p><strong>Contoh nyata:</strong> Mikroenvironment tumor vs respons imunoterapi.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>QC dulu: nFeature, %MT, doublet.</li>
          <li>HVG → PCA → klaster → UMAP → anotasi marker.</li>
          <li>Klaster ≠ tipe sel sampai tervalidasi.</li>
          <li>Pseudotime = inferensi, bukan jam.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: “Tipe Sel Baru” yang Ternyata Doublet</h2>
      <div className="callout">
        <p>Paper mengklaim tipe sel imun BARU dari scRNA-seq: klaster kecil (1%) mengekspresikan marker T cell DAN B cell bersamaan. Media heboh. Kamu diminta replikasi.</p>
      <p>Cekmu: nFeature klaster itu 2x median; tidak ada validasi doublet; tidak ada konfirmasi eksperimental (FACS/RNA-FISH).</p>
        <p><strong>Pertanyaan:</strong> Putusan dan bukti yang dibutuhkan untuk klaim “novel”.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Kemungkinan besar doublet T+B (marker ganda + nFeature tinggi = tanda klasik), bukan biologi baru. Bukti yang dibutuhkan: (1) skor doublet rendah via 2 metode independen; (2) replikasi di sampel/dataset independen; (3) validasi eksperimental (FACS sorting + qPCR, atau spatial: apakah “sel” ini ada sebagai satu sel di jaringan?). Pelajaran: klaster kecil + marker ganda = doublet sampai terbukti bukan. Klaim “novel cell type” adalah klaim luar biasa yang butuh bukti luar biasa — dan doublet adalah penjelasan paling membosankan yang paling sering benar.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Dari Matriks Jarang ke Peta Sel</h2>
      <p>Data single-cell adalah matriks <strong>sel × gen</strong> yang 90%+ nol — dan sebagian nol itu bohong (dropout). Alur analisis scRNA-seq adalah seni membedakan <strong>nol yang bermakna</strong> (gen memang mati) dari <strong>nol yang menipu</strong> (gen aktif tapi tak tertangkap). Pendalaman ini tentang tiap tahap dan jebakannya.</p>

      <h3>1. QC: menyaring sel mati dan droplet kosong</h3>
      <p>Tiga metrik QC per sel, dengan logikanya:</p>
      <ul>
        <li><strong>nGene (jumlah gen terdeteksi):</strong> terlalu rendah (&lt;200) = droplet kosong atau sel mati; terlalu tinggi (&gt;6000) = <em>doublet</em> (dua sel dalam satu droplet).</li>
        <li><strong>nUMI (total molekul):</strong> berkorelasi dengan nGene; outlier = curiga.</li>
        <li><strong>% gen mitokondria:</strong> sel sekarat bocor → RNA sitoplasma hilang, menyisakan mitokondria → %MT tinggi (&gt;10–20%) = sel mati, buang.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: membaca QC 8.000 sel</summary>
        <p>Distribusi nGene: median 1.800, ekor kiri 150 sel dengan nGene &lt; 200 (droplet kosong — buang), ekor kanan 90 sel &gt; 6.000 (kandidat doublet — tandai).<br />
        %MT: 400 sel &gt; 15% (sel sekarat — buang).<br />
        Tersisa ~7.300 sel (91%). <strong>Interpretasi:</strong> membuang 9% “data” bukan kehilangan — droplet kosong dan sel mati tidak membawa informasi biologi, hanya noise yang meracuni clustering. QC yang ketat di awal = cluster yang bersih di akhir.</p>
      </details>

      <h3>2. Normalisasi: UMI mengubah permainan</h3>
      <p>Teknologi droplet (10x) memakai <strong>UMI</strong> (<em>unique molecular identifier</em>): tiap molekul RNA asli diberi barcode sebelum amplifikasi PCR. Setelah sekuensing, read dengan UMI sama = <strong>satu molekul</strong> (bukan dihitung ganda). Ini menghilangkan bias amplifikasi PCR — masalah yang menghantui bulk RNA-seq.</p>
      <p>Normalisasi standar: <code>log1p(count / total_UMI_sel × 10.000)</code> — <em>LogNormalize</em>. Pembagian menormalkan kedalaman; log menstabilkan variansi (gen ekspresi tinggi tidak mendominasi PCA). Sederhana, dan untuk kebanyakan kasus mengalahkan metode canggih.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Jangan over-normalisasi</strong></p>
        <p>Regresi “canggih” yang membuang variasi nUMI/%MT bisa ikut membuang <strong>sinyal biologi</strong> (sel aktif memang punya lebih banyak RNA!). Aturan: normalisasi untuk teknis, tapi curigai setiap langkah yang membuat perbedaan biologis yang kamu harapkan ikut hilang.</p>
      </div>

      <h3>3. Clustering: dari 20.000 gen ke peta 2D</h3>
      <p>Alur standar: pilih ~2.000 gen paling variabel → PCA (50 komponen) → graf tetangga (kNN) → clustering Louvain/Leiden → visualisasi UMAP. Tiap langkah mereduksi dimensi sambil menjaga <strong>struktur lokal</strong> (sel sejenis tetap bertetangga).</p>
      <details className="worked">
        <summary>📐 Contoh: membaca UMAP tanpa tertipu</summary>
        <p>UMAP 7.300 sel menunjukkan 8 gugus. Anotasi dengan gen marker: gugus 3 mengekspresikan CD3D/CD8A → <strong>sel T sitotoksik</strong>; gugus 6: EPCAM/KRT19 → <strong>sel epitel (kanker?)</strong>.<br />
        Jebakan UMAP: <strong>jarak antar gugus tidak bermakna</strong> (gugus yang “dekat” di gambar belum tentu mirip biologisnya); <strong>ukuran gugus tidak bermakna</strong> (tergantung parameter). Yang bermakna: keanggotaan gugus + gen marker.<br />
        Resolusi clustering (0,4 vs 1,2) mengubah 8 gugus menjadi 15 — tidak ada yang “benar”; pilih resolusi di mana tiap gugus punya <strong>marker yang masuk akal biologisnya</strong>.</p>
      </details>

      <h3>4. Trajectory: sel sebagai film, bukan foto</h3>
      <p>Sel punca berdiferensiasi bertahap — scRNA-seq menangkap <strong>cuplikan acak</strong> dari proses itu. <em>Trajectory inference</em> (Monocle, Slingshot) mengurutkan sel sepanjang “waktu semu” (<em>pseudotime</em>): dari punca → progenitor → matang, lengkap dengan titik <strong>percabangan</strong> (satu progenitor menjadi dua tipe sel).</p>
      <p>Twist-nya (sesuai cerita pembuka): pseudotime bukan waktu nyata — ia adalah <strong>urutan kemiripan</strong>. Validasi butuh eksperimen (lineage tracing) atau setidaknya konsistensi dengan marker yang diketahui. Trajectory yang indah tanpa validasi = narasi yang meyakinkan tentang film yang belum tentu diputar.</p>

      <h3>Kasus nyata: sel 0,1% yang mengubah terapi</h3>
      <p>Pada leukemia mieloid akut, bulk RNA-seq pasien remisi terlihat “bersih”. scRNA-seq 10.000 sel sumsum tulang menemukan ~12 sel (0,12%) dengan profil <strong>sel punca leukemia</strong> (CD34+CD38−, program quiescence) — sel yang resisten kemoterapi dan menjadi bibit kekambuhan. Pasien dengan sel ini terdeteksi mendapat terapi lanjutan; yang tanpa tetap observasi. <strong>Dari “tidak terlihat” menjadi “menentukan terapi”</strong> — itulah nilai 0,1% yang hanya bisa dibayar oleh single-cell.</p>

      <h2 id="kasus2">🏥 Kasus Lapangan: Menemukan Sel yang Lolos Kemoterapi</h2>
      <p>Pasien kanker payudara, kemoterapi selesai, respons “baik” (tumor menyusut 90%). 18 bulan kemudian: kambuh. Sampel tumor awal dianalisis ulang dengan scRNA-seq (8.000 sel). Pertanyaan: <strong>apakah bibit kekambuhan sudah ada sejak awal?</strong></p>

      <h3>Analisis: berburu 0,1%</h3>
      <p>QC → 7.400 sel. Clustering (resolusi 0,8): 10 gugus. Sembilan gugus = sel tumor luminal tipikal + stroma + imun. <strong>Gugus 9: 11 sel (0,15%)</strong> — profil aneh: CD44+/CD24− (marker sel punca kanker), program quiescence (tidak membelah!), dan <strong>ABCB1 tinggi</strong> (pompa efflux obat — memompa kemoterapi keluar sel).</p>
      <details className="worked">
        <summary>📐 Contoh: kenapa bulk tidak pernah melihatnya</summary>
        <p>Ekspresi ABCB1: gugus 9 (11 sel) = 500 UMI/sel; 7.389 sel lain = 5 UMI/sel.<br />
        Rata-rata bulk = (11×500 + 7389×5) / 7400 = (5.500 + 36.945) / 7.400 ≈ <strong>5,7 UMI/sel</strong> — tampak seperti “ekspresi latar rendah”, tidak signifikan di DE bulk.<br />
        <strong>Interpretasi:</strong> sinyal 100x lipat <strong>ditelan rata-rata</strong>. Inilah matematika buta bulk: 0,15% × 100x = 0,15 kontribusi — di bawah noise. Single-cell bukan “lebih detail”; ia adalah <strong>satu-satunya</strong> cara melihat ini. Dan 11 sel resisten inilah yang selamat dari kemoterapi → membelah lagi 18 bulan kemudian → kambuh.</p>
      </details>

      <h3>Validasi: 11 sel bukan artefak</h3>
      <p>Sebelum klaim, tiga cek: (1) <strong>Bukan doublet</strong> — skor doublet rendah, nGene normal. (2) <strong>Bukan batch</strong> — 11 sel tersebar di 3 batch, bukan mengumpul di satu. (3) <strong>Marker konsisten</strong> — bukan hanya ABCB1, tapi seluruh program quiescence + stemness koheren. Lolos ketiganya → temuan nyata.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Sel langka butuh bukti ekstra</strong></p>
        <p>Semakin kecil gugus, semakin besar peluang ia artefak (doublet, kontaminasi, batch). Aturan: gugus &lt; 0,5% wajib melewati <strong>3 cek validasi</strong> + idealnya konfirmasi orthogonal (FACS/flow cytometry atau imunohistokimia). Klaim “tipe sel baru” dari 11 sel tanpa validasi = cara cepat kehilangan kredibilitas.</p>
      </div>

      <h3>Implikasi terapi</h3>
      <p>Temuan ini mengubah strategi: pasien dengan profil sel punca terdeteksi → pertimbangkan <strong>terapi kombinasi</strong> (kemoterapi + inhibitor ABCB1/pemburu sel quiescent) atau pemantauan ketat pasca-terapi. Dari 11 sel menjadi keputusan terapi — <strong>inilah janji single-cell yang sebenarnya</strong>: bukan peta yang indah, tapi sel yang mengubah nasib.</p>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Keunggulan single-cell atas bulk RNA-seq?"
        options={["Lebih murah",
          "Melihat heterogenitas & tipe sel langka yang diratakan bulk",
          "Lebih mudah",
          "Tidak ada"]}
        correct={1}
        explanation="Benar: smoothie vs buah potong. Sel 0,1% tak terlihat di bulk."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. %MT tinggi pada suatu barcode menandakan…"
        options={["Sel sehat",
          "Sel mati/stres (mitokondria bocor, RNA sitoplasma hilang) — buang",
          "Sel membelah",
          "Doublet pasti"]}
        correct={1}
        explanation="Benar: QC klasik. Tapi threshold tergantung jaringan (otak lebih toleran)!"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Urutan alur scRNA-seq standar?"
        options={["UMAP dulu",
          "QC → HVG → PCA → clustering → UMAP → anotasi marker",
          "Anotasi dulu",
          "Bebas"]}
        correct={1}
        explanation="Benar: pipa Seurat/Scanpy. Tiap tahap punya alasan; jangan loncat QC."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Doublet adalah…"
        options={["Sel ganda DNA",
          "Dua sel dalam satu droplet — terlihat sebagai “tipe” palsu bermarker ganda",
          "Sel mati",
          "Batch effect"]}
        correct={1}
        explanation="Benar: tanda = nFeature tinggi + marker dua tipe. Deteksi via DoubletFinder/scrublet."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Pseudotime mengukur…"
        options={["Waktu nyata",
          "Urutan inferensi sepanjang proses biologis — bukan jam; butuh validasi",
          "Umur sel",
          "Kecepatan"]}
        correct={1}
        explanation="Benar: dari kemiripan snapshot. Arah + validasi (RNA velocity/eksperimen) wajib."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Kapan spatial transcriptomics dipilih?"
        options={["Selalu",
          "Ketika POSISI sel menentukan fungsi (mikroenvironment tumor, otak)",
          "Tidak pernah",
          "Hanya untuk bakteri"]}
        correct={1}
        explanation="Benar: peta, bukan daftar. T cell excluded vs inflamed = prediksi imunoterapi."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>scRNA-seq</strong> = heterogenitas per sel; bulk = rata-rata.</li>
          <li><strong>QC</strong>: nFeature, nCount, %MT, doublet — buang 30% sampah itu normal.</li>
          <li>Alur: <strong>HVG → PCA → Louvain/Leiden → UMAP → anotasi marker</strong>.</li>
          <li>Klaster = hipotesis; <strong>anotasi butuh marker + referensi + validasi</strong>.</li>
          <li><strong>Trajectory</strong>: urutan diferensiasi (inferensi!); <strong>RNA velocity</strong>: arah.</li>
          <li><strong>Spatial</strong>: ekspresi + posisi — skill terpanas lowongan.</li>
          <li>Resolusi clustering = parameter; pilih yang bermakna biologis.</li>
          <li>Waspadai doublet menyamar sebagai “tipe sel baru”.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi10-statistik-bioinfo" className="btn btn-secondary btn-sm">← BI10</Link>
        <Link href="/learn/bi12-genomika-populasi" className="btn btn-primary btn-sm">BI12 →</Link>
      </div>
    </div>
  );
}
