"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi18CapstoneDePage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi18PcaData = [{"x": [-3, -2.5, -2.8, 3, 3.2, 2.9], "y": [-2, -1.5, 2, -1.8, 1.9, 2.2], "type": "scatter", "mode": "markers+text", "marker": {"color": "#2a7de1", "size": 11}, "text": ["N-A1", "N-A2", "N-B1", "T-A1", "T-A2", "T-B1"], "textposition": "top center", "name": ""}];
  const bi18PcaDataLayout = {"xaxis": {"title": "PC1 (batch)"}, "yaxis": {"title": "PC2 (kondisi)"}, "showlegend": false};

  const bi18EnrichData = [{"x": [6, 4, 3.2, 2.5], "y": ["Apoptosis", "Siklus sel", "Respons DNA damage", "Angiogenesis"], "type": "bar", "orientation": "h", "marker": {"color": "#2a7de1"}, "text": ["1e-6", "1e-4", "6e-4", "3e-3"], "textposition": "outside"}];
  const bi18EnrichDataLayout = {"xaxis": {"title": "-log10(p)"}, "yaxis": {"title": ""}, "showlegend": false};

  const lab1Code = "import random, math, statistics as st\nrandom.seed(1234)\nGEN, N = 40, 12\nde_sejati = {5, 12, 23, 31, 37}  # kebenaran (tak terlihat analis!)\n# simulasi: 6 normal, 6 tumor; batch A/B\ndata, meta = [], []\nfor s in range(N):\n    tumor = s >= 6\n    batch = 'B' if s % 4 >= 2 else 'A'\n    meta.append((tumor, batch))\n    row = []\n    for g in range(GEN):\n        mu = 100\n        if g in de_sejati and tumor: mu = 400\n        if batch == 'B': mu *= 1.3\n        # overdispersed count (gamma-poisson)\n        lam = random.gammavariate(4, mu/4)\n        c = 0; p = lam/(1+lam)\n        while random.random() < p and c < 5000:\n            c += 1; p *= lam/(1+lam)\n        row.append(c)\n    data.append(row)\n# 1. size factor (median rasio vs rata-rata geometrik)\nsf = []\nfor s in range(N):\n    r = []\n    for g in range(GEN):\n        gm = math.exp(sum(math.log(data[t][g]+1) for t in range(N))/N)\n        r.append((data[s][g]+1)/gm)\n    sf.append(st.median(r))\n# 2. uji per gen: bandingkan mean tumor vs normal (ternormalisasi)\nhasil = []\nfor g in range(GEN):\n    tn = [data[s][g]/sf[s] for s in range(N) if meta[s][0]]\n    nn = [data[s][g]/sf[s] for s in range(N) if not meta[s][0]]\n    mt, mn = st.mean(tn), st.mean(nn)\n    lfc = math.log2((mt+1)/(mn+1))\n    # skor-t sederhana\n    se = (st.variance(tn)/len(tn) + st.variance(nn)/len(nn))**0.5\n    t = abs(mt-mn)/(se+1e-9)\n    hasil.append((t, lfc, g))\nhasil.sort(reverse=True)\n# 3. ambil top-8 sebagai “DE”\npred = {g for _, _, g in hasil[:8]}\ntp = len(pred & de_sejati)\nprint(f'diprediksi DE: {sorted(pred)}')\nprint(f'sejati       : {sorted(de_sejati)}')\nprint(f'true positive: {tp}/5, false positive: {len(pred)-tp}')\nprint()\nprint('Refleksi: gen mana yang lolos? Apakah batch mengecoh?')\nprint('Di DESeq2 nyata: NB + shrinkage + BH -> lebih baik dari ini.')";

  const lab2Code = "gen = [('CDKN1A',2.8,1e-8),('BAX',2.1,1e-6),('MKI67',-2.4,1e-7),\n       ('TP53',0.3,1e-9),('GAPDH',0.05,0.8),('MYC',3.5,0.06),\n       ('GEN_X',1.2,0.03),('GEN_Y',-1.5,0.02),('GEN_Z',4.0,0.2),\n       ('GEN_W',0.8,1e-4),('GEN_V',-0.9,0.04),('ACTB',0.1,0.5),\n       ('GEN_U',2.2,0.01),('GEN_T',-3.1,0.001),('GEN_S',1.0,0.049)]\nprint('KANDIDAT (padj<0.05 & |log2FC|>1):')\nfor g, fc, pa in gen:\n    if pa < 0.05 and abs(fc) > 1:\n        arah = 'naik' if fc > 0 else 'turun'\n        print(f'  {g}: {arah} {abs(fc):.1f}-fold (padj={pa:.0e})')\nprint()\nprint('DITOLAK tapi menarik:')\nfor g, fc, pa in gen:\n    if not (pa < 0.05 and abs(fc) > 1) and (pa < 0.05 or abs(fc) > 1):\n        alasan = 'efek kecil' if abs(fc) <= 1 else 'tak signifikan'\n        print(f'  {g}: {alasan} -> butuh bukti tambahan, bukan kandidat utama')\nprint()\nprint('TP53: padj luar biasa tapi FC kecil -> bukan driver di sini.')\nprint('MYC/GEN_Z: FC besar tapi tak signifikan -> JANGAN kejar.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI18 &mdash; Bioinformatics</span>
        <h1 className="display-title">Capstone: End-to-End<br />Differential Expression Nyata</h1>
        <div className="meta">60–90 menit • proyek mini end-to-end • integrasi BI1–BI17</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dari Nol ke Paper</a></li>
          <li><a href="#brief">Brief Proyek</a></li>
          <li><a href="#tahap1">Tahap 1: QC &amp; Desain (BI8+BI10)</a></li>
          <li><a href="#tahap2">Tahap 2: Normalisasi &amp; DE (BI9)</a></li>
          <li><a href="#tahap3">Tahap 3: Interpretasi (BI9+BI13)</a></li>
          <li><a href="#tahap4">Tahap 4: Laporan Reproduksibel (BI17)</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Pipeline DE Mini</a></li>
          <li><a href="#lab2">🔬 Lab 2: Seleksi Kandidat &amp; Justifikasi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Bermain Seperti Profesional</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Simulasi Peer Review</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjalankan <strong>alur DE end-to-end</strong>: QC → normalisasi → uji → koreksi → interpretasi.</li>
          <li>Menerapkan <strong>semua QC</strong>: batch (BI10), komposisi (BI9), anotasi (BI2).</li>
          <li>Menulis <strong>laporan reproduksibel</strong> (BI17) dengan keterbatasan jujur.</li>
          <li>Menilai <strong>kapan berhenti</strong>: bedakan temuan vs artefak.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Dari Nol ke Paper</h2>
      <div className="story">
        <p>Bayangkan 8 minggu lalu kamu tidak tahu apa itu FASTQ. Hari ini: kamu mengunduh data RNA-seq publik kanker dari GEO, menjalankan QC, menemukan batch effect, mengoreksinya, menjalankan DE, dan menulis laporan dengan 12 gen kandidat + pathway — lengkap dengan keterbatasan. Itulah yang dilakukan bioinformatikawan profesional setiap hari.</p>
      <p>Capstone ini mensimulasikan proyek nyata end-to-end pada data simulasi realistis (pola dari GEO nyata). Tidak ada jawaban di belakang buku — ada keputusan yang harus kamu buat dan pertahankan, seperti profesional.</p>
      <p>Twist-nya: di proyek nyata, tidak ada yang menilai apakah pipeline-mu “jalan” — yang dinilai adalah apakah <strong>keputusanmu bisa dipertahankan</strong> di depan reviewer yang skeptis. Dua analis bisa menjalankan tool yang sama pada data yang sama dan sampai pada daftar gen kandidat yang berbeda — keduanya “benar” secara komputasi, tapi hanya satu yang mendokumentasikan KENAPA tiap pilihan dibuat. Capstone ini melatih otot yang membedakan profesional dari operator tool: <strong>menulis alasan, bukan sekadar menjalankan perintah</strong>.</p>
      </div>

      <h2 id="brief">Brief Proyek</h2>
      <p><strong>Definisi.</strong> <strong>Dataset:</strong> RNA-seq 12 sampel (6 tumor, 6 normal) × 500 gen — simulasi realistis: ada batch effect, 30 gen DE sejati, noise overdispersed. <strong>Misi:</strong> temukan gen DE + interpretasi biologis + laporan. <strong>Deliverable:</strong> daftar gen (padj&lt;0,05), volcano, pathway, laporan 1 halaman.</p>
      <details className="worked">
        <summary>📐 Contoh: rencana kerja 60 menit</summary>
        <p><strong>0–10':</strong> Eksplorasi: PCA + label batch/kondisi (BI10). Temukan batch!<br /><strong>10–25':</strong> Normalisasi size-factor + DE per gen dengan model NB (BI9).<br /><strong>25–40':</strong> FDR + volcano; pilih kandidat (efek + signifikansi).<br /><strong>40–55':</strong> Enrichment pathway (BI9); cek anotasi gen top (BI2).<br /><strong>55–60':</strong> Tulis laporan + keterbatasan (BI17).<br />Disiplin waktu = skill profesional: analisis tak pernah “selesai”, hanya “cukup”.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Capstone ini seperti ujian SIM: bukan menghafal rambu (teori BI1–BI17), tapi mengemudi di jalan nyata — dengan lubang (batch), tanjakan (multiple testing), dan rambu membingungkan (noise).</p>
      <p><strong>Kapan memakai:</strong> Pola kerja ini = 80% pekerjaan bioinformatikawan: terima data → QC → analisis → cerita.</p>

      <h2 id="tahap1">Tahap 1: QC &amp; Desain (BI8+BI10)</h2>
      <p><strong>Definisi.</strong> Sebelum SATU PUN uji: PCA berlabel, cek batch, cek outlier. Keputusan desain (formula) dibuat DI SINI — bukan setelah melihat hasil.</p>
      <details className="worked">
        <summary>📐 Contoh: temuan QC dataset capstone</summary>
        <p>PCA: PC1 memisahkan batch (A/B), PC2 memisahkan tumor/normal.<br />Batch seimbang antar kondisi (3+3 tiap batch) ✓ → bisa dikoreksi.<br />Satu sampel tumor outlier ekstrem (kemungkinan gagal library) → buang dengan justifikasi tercatat.<br /><strong>Desain:</strong> ~batch + kondisi. Keputusan ini dibuat SEBELUM DE — mengubah desain setelah lihat hasil = p-hacking.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Tahap ini seperti cek pra-penerbangan: membosankan, tidak heroik, dan satu-satunya yang mencegah kecelakaan. Pilot yang melewatkannya = berita.</p>
      <p><strong>Kapan memakai:</strong> Selalu pertama. Tidak ada pengecualian.</p>

      <PlotlyChart
        data={bi18PcaData}
        title="PCA Sampel Capstone (ilustratif, 6 dari 12)"
        layout={bi18PcaDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Titik = sampel (N=normal, T=tumor; A/B=batch). PC1 horizontal, PC2 vertikal.</p>
        <p><strong>Interpretasi:</strong> PC1 memisahkan batch A (kiri) vs B (kanan); PC2 memisahkan N (bawah) vs T (atas). Batch nyata tapi seimbang → masukkan ke desain. Inilah 30 detik yang menentukan validitas seluruh analisis.</p>
      </div>

      <h2 id="tahap2">Tahap 2: Normalisasi &amp; DE (BI9)</h2>
      <p><strong>Definisi.</strong> Size factor (median-of-ratios) → model NB per gen → uji Wald → BH FDR. Jangan: RPM, uji-t, p mentah.</p>
      <Tex math={String.raw`s_j = \text{median}_i \frac{K_{ij}}{(\prod_{v=1}^{m} K_{iv})^{1/m}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`s_j`} />: size factor sampel j</li>
          <li><Tex math={String.raw`K_{ij}`} />: count gen i di sampel j</li>
          <li><Tex math={String.raw`(\prod_v K_{iv})^{1/m}`} />: rata-rata geometrik gen i lintas semua sampel</li>
      </ul>
      <p><strong>Interpretasi:</strong> Rasio tiap gen terhadap rata-rata geometriknya, lalu ambil MEDIAN — median kebal terhadap segelintir gen ekstrem (seperti MYC di BI9). Inilah jantung normalisasi DESeq2 yang kamu praktikkan di lab 1.</p>
      <details className="worked">
        <summary>📐 Contoh: hasil DE dataset</summary>
        <p>500 gen → 42 dengan padj&lt;0,05. Dari 30 DE sejati: 27 tertangkap (power 90%), 15 false positive (FDR ~36%??).<br />Tunggu — FDR 5% kok 36% palsu? Karena n kecil + efek kecil: FDR mengontrol <em>rate</em>, bukan menjamin. Tambahkan filter |log2FC|&gt;1 → 30 gen, 25 sejati.<br />Pelajaran: threshold ganda (signifikansi + efek) = praktik standar untuk n kecil.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Tahap ini seperti menimbang dengan timbangan terkalibrasi: normalisasi = kalibrasi; NB = timbangan yang tepat untuk benda berisik; FDR = tidak mengklaim setiap debu sebagai emas.</p>
      <p><strong>Kapan memakai:</strong> Inti analisis DE. Otomatisasi dengan DESeq2 bila tersedia; pahami manualnya via lab.</p>

      <h2 id="tahap3">Tahap 3: Interpretasi (BI9+BI13)</h2>
      <p><strong>Definisi.</strong> Dari daftar gen ke cerita: enrichment pathway (GO/KEGG), cek literatur gen top, hubungkan dengan epigenetik bila ada. Satu gen tanpa konteks = trivia; pathway = biologi.</p>
      <details className="worked">
        <summary>📐 Contoh: cerita dataset capstone</summary>
        <p>Gen top: CDKN1A (naik, padj 1e-8), BAX (naik), MKI67 (turun).<br />Enrichment: “apoptosis” (p=1e-6), “siklus sel” (p=1e-4).<br />Cerita: tumor mengaktifkan program kematian sel + menekan proliferasi — konsisten respons kemoterapi.<br /><strong>Keterbatasan:</strong> n=6/kelompok; tanpa validasi qPCR; batch dikoreksi tapi tidak dihilangkan total.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Tahap ini seperti menerjemahkan: daftar 30 gen berbahasa “mesin” menjadi paragraf berbahasa “manusia”: “program apoptosis aktif, siklus sel terhenti”.</p>
      <p><strong>Kapan memakai:</strong> Setelah DE. Alokasikan waktu terbesar ke sini — interpretasi adalah nilai tambahmu.</p>

      <PlotlyChart
        data={bi18EnrichData}
        title="Enrichment Pathway (ilustratif)"
        layout={bi18EnrichDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang horizontal = signifikansi enrichment tiap pathway. Makin panjang makin kuat.</p>
        <p><strong>Interpretasi:</strong> Apoptosis dominan — cerita utama. Tiga lainnya pendukung. Presentasikan 2–3 teratas dengan narasi, bukan 50 pathway mentah. Kurasi = profesionalisme.</p>
      </div>

      <h2 id="tahap4">Tahap 4: Laporan Reproduksibel (BI17)</h2>
      <p><strong>Definisi.</strong> Laporan 1 halaman: pertanyaan, metode (cukup untuk reproduksi), hasil utama (gambar + angka), keterbatasan JUJUR, langkah lanjut. Tanpa spin.</p>
      <details className="worked">
        <summary>📐 Contoh: kerangka laporan</summary>
        <p><strong>Pertanyaan:</strong> gen apa berubah tumor vs normal?<br /><strong>Metode:</strong> 12 sampel; QC PCA; desain ~batch+kondisi; NB + BH.<br /><strong>Hasil:</strong> 30 gen (padj&lt;0,05, |log2FC|&gt;1); apoptosis enriched.<br /><strong>Keterbatasan:</strong> n kecil; 1 outlier dibuang; tanpa validasi independen.<br /><strong>Lanjut:</strong> qPCR 5 gen top; kohort validasi.<br />Satu halaman ini lebih berharga dari 50 halaman tanpa keterbatasan.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Laporan ini seperti berita, bukan iklan: fakta dulu, interpretasi jelas dibedakan, kekurangan diakui. Kepercayaan dibangun dari kejujuran tentang apa yang TIDAK kamu tahu.</p>
      <p><strong>Kapan memakai:</strong> Akhir setiap proyek. Template ini dipakai ulang selamanya.</p>
      <div className="callout"><strong>Standar kelulusan capstone:</strong> (1) QC didokumentasikan + keputusan desain beralasan; (2) metode benar (NB, FDR, bukan uji-t/RPM); (3) kandidat dipilih dua dimensi (volcano); (4) interpretasi pathway, bukan daftar; (5) keterbatasan jujur; (6) kode + parameter tercatat (BI17).</div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Capstone = dapatkan jawaban “benar”&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Tidak ada kunci jawaban — ada keputusan yang dipertahankan. Profesional dinilai dari ALASAN (kenapa desain ini? kenapa threshold ini?), bukan dari angka yang “cocok”. Dua analis bisa beda hasil dan keduanya benar bila alasannya kuat.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Analisis selesai saat dapat daftar gen&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Daftar gen = bahan mentah. Nilai = interpretasi + keputusan + komunikasi. Lesson ini sengaja memberi bobot besar pada tahap 3–4 — di situlah karir dibangun.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Keterbatasan melemahkan laporan&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Sebaliknya: keterbatasan yang diakui MEMPERKUAT kredibilitas. Reviewer/manager lebih percaya analis yang tahu batasnya daripada yang mengklaim sempurna. Kejujuran = strategi.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Kerjakan <strong>berurutan</strong>: jangan interpretasi sebelum QC beres. Tiap tahap mengunci keputusan tahap berikut.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Catat <strong>setiap keputusan</strong> (buang outlier? threshold?) DENGAN alasan. Buku lab komputasional = jejak audit profesionalisme.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Bandingkan temuanmu dengan <strong>literatur</strong> (BI2): gen top sudah dikenal di kanker ini? Konsisten = keyakinan; baru = butuh bukti ekstra.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Pipeline DE Mini End-to-End</h2>
      <p>Dataset simulasi 12 sampel × 40 gen (5 DE sejati disisipkan). Jalankan: normalisasi median-rasio → uji per gen (aproksimasi) → BH → evaluasi: berapa DE sejati tertangkap?</p>
      <PyodideLab
        title="🔬 Lab 1: Pipeline DE Mini End-to-End"
        hint="Dataset ini mensimulasikan overdispersi + batch kecil. Skor: presisi & recall vs kebenaran yang diketahui — kemewahan yang tidak ada di data nyata!"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Seleksi Kandidat Dua Dimensi</h2>
      <p>Diberikan 15 gen (log2FC + padj), terapkan aturan seleksi profesional (|log2FC|&gt;1 &amp; padj&lt;0,05), lalu tulis justifikasi 1 kalimat per kandidat seperti di laporan.</p>
      <PyodideLab
        title="🔬 Lab 2: Seleksi Kandidat Dua Dimensi"
        hint="Latihan ini = 80% pekerjaan interpretasi. Bedakan “kandidat validasi” (kuat dua dimensi) dari “menarik tapi lemah”."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Mulai proyek DE → Ikuti 4 tahap capstone</h3>
        <p><strong>Kondisi:</strong> Data RNA-seq baru.</p>
        <p><strong>Kenapa:</strong> QC → DE → interpretasi → laporan.</p>
        <p><strong>Contoh nyata:</strong> Template 60 menit lesson ini.</p>
      </div>
      <div className="decision-card">
        <h3>2. Batch terdeteksi → Koreksi bila seimbang; hentikan bila confounded</h3>
        <p><strong>Kondisi:</strong> PCA menunjukkan batch.</p>
        <p><strong>Kenapa:</strong> BI10: desain &gt; analisis.</p>
        <p><strong>Contoh nyata:</strong> ~batch + kondisi vs ulangi eksperimen.</p>
      </div>
      <div className="decision-card">
        <h3>3. Pilih kandidat → Dua dimensi (volcano)</h3>
        <p><strong>Kondisi:</strong> Dari tabel DE ke validasi.</p>
        <p><strong>Kenapa:</strong> Efek + keyakinan bersamaan.</p>
        <p><strong>Contoh nyata:</strong> |log2FC|&gt;1 &amp; padj&lt;0,05.</p>
      </div>
      <div className="decision-card">
        <h3>4. Tulis laporan → Fakta + keterbatasan jujur</h3>
        <p><strong>Kondisi:</strong> Akhir proyek.</p>
        <p><strong>Kenapa:</strong> Kredibilitas = kejujuran.</p>
        <p><strong>Contoh nyata:</strong> Template 1 halaman tahap 4.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>QC dulu; desain dikunci sebelum hasil.</li>
          <li>NB + FDR; bukan uji-t/RPM/p mentah.</li>
          <li>Kandidat = dua dimensi volcano.</li>
          <li>Interpretasi = pathway + literatur.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Review Sejawat: Capstone-mu Dinilai</h2>
      <div className="callout">
        <p>Kamu submit laporan capstone. Reviewer (teman sekelas) menemukan: kamu membuang 1 outlier TAPI tidak mencatat alasannya; threshold |log2FC|&gt;1 dipilih SETELAH melihat hasil; pathway diambil 20 teratas tanpa kurasi.</p>
        <p><strong>Pertanyaan:</strong> Apakah kritiknya valid? Perbaiki.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Semuanya valid — tiga dosa klasik: (1) outlier tanpa jejak audit = tidak reproduksibel; catat alasan + tunjukkan hasil dengan/tanpa. (2) Threshold setelah lihat hasil = p-hacking ringan; tetapkan SEBELUM atau justifikasi biologis + tunjukkan sensitivitas. (3) 20 pathway tanpa kurasi = malas; pilih 2–3 dengan narasi. Perbaikan = revisi laporan dengan jejak keputusan lengkap. Pelajaran: standar kelulusan capstone (callout tahap 4) bukan hiasan — ia adalah definisi profesionalisme. Mampu menerima review = skill terakhir yang dipelajari lesson ini.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Bermain Seperti Profesional</h2>
      <p>Capstone ini mensimulasikan proyek nyata. Bedanya dengan lesson lain: tidak ada “jawaban benar” tunggal — ada <strong>keputusan yang dipertahankan</strong>. Pendalaman ini melatih tiga otot profesional yang tidak diajarkan tool apa pun: merancang analisis, menangani kegagalan, dan menulis laporan yang dipercaya.</p>

      <h3>1. Mulai dari pertanyaan, bukan dari data</h3>
      <p>Kegagalan capstone paling umum: langsung mengunduh data lalu “menganalisis” tanpa pertanyaan. Hasilnya: 2 minggu eksplorasi tanpa arah, laporan yang isinya “kami menemukan beberapa hal menarik” (= tidak menemukan apa-apa).</p>
      <details className="worked">
        <summary>📐 Contoh: pertanyaan yang baik vs buruk</summary>
        <p>Buruk: “Analisis data RNA-seq kanker payudara.” (Tidak bisa dijawab — analisis <em>apa</em>? untuk <em>apa</em>?)<br />
        Baik: “Gen dan pathway apa yang terdiferensial antara subtipu luminal vs basal pada kohort TCGA-BRCA, dan apakah kandidat top direplikasi di dataset independen?”<br />
        Bedanya: yang baik menyebut <strong>perbandingan</strong> (luminal vs basal), <strong>output</strong> (gen + pathway), dan <strong>kriteria sukses</strong> (replikasi independen). Tulis ini di halaman 1 laporan — sebelum satu baris kode pun. Reviewer menilai: apakah analisis menjawab pertanyaan yang dijanjikan?</p>
      </details>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Kontrak analisis 1 halaman</strong></p>
        <p>Sebelum coding, tulis: (1) pertanyaan, (2) data + kriteria inklusi/eksklusi sampel, (3) metode per langkah dengan <strong>alternatif jika gagal</strong> (“jika batch confounded, fallback ke analisis per-batch”), (4) kriteria sukses/gagal yang ditetapkan di muka. Dokumen ini — bukan kode — yang membedakan profesional dari penghobi.</p>
      </div>

      <h3>2. Kegagalan adalah data: buku harian keputusan</h3>
      <p>Di proyek nyata, 70% waktu adalah kegagalan: QC merah, batch effect, hasil tidak masuk akal. Profesional tidak menyembunyikannya — mereka <strong>mencatatnya sebagai bukti ketelitian</strong>. Laporan yang baik punya bagian “Keterbatasan &amp; keputusan sulit”:</p>
      <ul>
        <li>“12 dari 60 sampel dibuang karena %MT &gt; 20% (kriteria ditetapkan sebelum analisis, commit a3f9c1d).”</li>
        <li>“Batch effect terdeteksi di PCA (batch memisah di PC1); batch dimasukkan sebagai kovariat. Analisis sensitivitas tanpa koreksi menunjukkan hasil yang sama untuk 80% gen top.”</li>
        <li>“Kandidat gen X tidak direplikasi di dataset independen — dilaporkan sebagai negatif, bukan disembunyikan.”</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: keputusan sulit yang dipertahankan</summary>
        <p>Skenario: 2 dari 3 replikat kondisi perlakuan gagal QC. Opsi A: buang kondisi itu (n=1 tersisa — tidak bisa uji statistik). Opsi B: pakai n=1 + nyatakan deskriptif saja.<br />
        Keputusan profesional: <strong>Opsi B + transparansi penuh</strong> — laporkan fold-change deskriptif, tandai “n=1, tidak ada uji statistik, butuh replikasi”, dan jadikan ini temuan operasional (“protokol perlakuan perlu diperbaiki”).<br />
        Yang TIDAK profesional: mengarang “n=3” dari duplikat teknis, atau diam-diam membuang kondisi itu dari laporan. Reviewer memaafkan data jelek yang jujur; mereka tidak memaafkan data jelek yang disembunyikan.</p>
      </details>

      <h3>3. Struktur laporan yang dipercaya</h3>
      <ul>
        <li><strong>Ringkasan eksekutif (1 paragraf):</strong> pertanyaan, jawaban, tingkat kepercayaan. Untuk pembaca yang hanya punya 60 detik.</li>
        <li><strong>Metode (reproduksibel):</strong> versi tool, parameter, seed, aksesi data — cukup untuk orang lain mengulang (BI17).</li>
        <li><strong>Hasil (jujur):</strong> angka + visualisasi + <strong>apa yang TIDAK ditemukan</strong>. Hasil negatif yang dilaporkan = kredibilitas.</li>
        <li><strong>Interpretasi (terpisah dari hasil!):</strong> “data menunjukkan X; kami menafsirkan sebagai Y karena Z; alternatifnya W.” Jangan campur fakta dan tafsir dalam satu kalimat.</li>
        <li><strong>Keterbatasan:</strong> n kecil, batch, populasi spesifik — ditulis sendiri sebelum reviewer menanyakannya.</li>
      </ul>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Tulis keterbatasanmu sendiri</strong></p>
        <p>Paradoks pelaporan: analis yang menulis keterbatasannya sendiri terlihat <strong>lebih</strong> kompeten, bukan kurang — karena menunjukkan ia tahu di mana tepi pengetahuannya. Reviewer menyerang laporan yang mengklaim terlalu banyak; mereka menghormati laporan yang tahu batasnya.</p>
      </div>

      <h3>4. Checklist penyerahan capstone</h3>
      <details className="worked">
        <summary>📐 Contoh: definisi “selesai” profesional</summary>
        <p>Capstone dinyatakan selesai jika:<br />
        (1) Pertanyaan tertulis di halaman 1 dan <strong>terjawab eksplisit</strong> di kesimpulan.<br />
        (2) Semua kode di Git, environment terkunci, satu perintah menjalankan ulang semuanya.<br />
        (3) QC dilaporkan (berapa sampel dibuang, kenapa) — bukan disembunyikan.<br />
        (4) Hasil negatif/inkonsisten dilaporkan, bukan dibuang.<br />
        (5) Keterbatasan ditulis sendiri (minimal 3).<br />
        (6) Seseorang yang belum pernah melihat proyek ini bisa membaca laporan dan <strong>memahami setiap keputusan</strong> tanpa bertanya padamu.<br />
        Poin 6 adalah ujian sebenarnya: <strong>karya yang hanya dipahami pembuatnya = belum selesai</strong>.</p>
      </details>

      <h3>Kata penutup track: dari huruf ke manusia</h3>
      <p>Delapan belas lesson lalu kamu mulai dari 4 huruf: A, T, G, C. Sekarang kamu tahu huruf-huruf itu menjadi database, format, pipeline, statistik, sel tunggal, populasi, epigenetik, mikrobiom, protein, model ML — dan akhirnya menjadi <strong>keputusan tentang manusia</strong>: diagnosis, terapi, risiko. Bioinformatika bukan tentang komputer yang memproses huruf; ia tentang <strong>ketelitian yang melindungi pasien</strong> di ujung setiap pipeline. Selamat — sekarang buktikan di proyek nyata.</p>

      <h2 id="kasus2">🏥 Kasus Lapangan: Simulasi Peer Review</h2>
      <p>Capstone-mu selesai. Sekarang ganti peran: kamu menjadi <strong>reviewer</strong>. Di bawah ini adalah ringkasan laporan analis junior (fiktif tapi realistis). Tugasmu: temukan <strong>3 cacat fatal</strong> sebelum daftarnya dibuka. (Kemampuan ini — membaca kritis karya orang lain — adalah separuh pekerjaan analis senior.)</p>

      <h3>Laporan yang direview</h3>
      <div className="callout">
        <p><em>“Kami menganalisis RNA-seq 4 kanker vs 4 normal (GEO). Ditemukan 3.000 gen DE (p &lt; 0,05). Pathway teratas: ribosom. Gen X naik 10x — kandidat biomarker. Kesimpulan: gen X menyebabkan kanker.”</em></p>
      </div>

      <h3>Cacat #1: tanpa koreksi multiple testing</h3>
      <p><strong>p &lt; 0,05 mentah</strong> pada 20.000 gen → ekspektasi 1.000 false positive (BI10!). Dari 3.000 “temuan”, sepertiganya noise. Reviewer menulis: <em>“Ulangi dengan FDR; laporkan berapa yang tersisa.”</em></p>

      <h3>Cacat #2: tanpa normalisasi yang benar + tanpa cek batch</h3>
      <p>Tidak disebut normalisasi apa pun; tidak ada PCA. Kemungkinan: count mentah + uji-t (persis kesalahan BI9!). Pathway “ribosom” teratas = <strong>tanda klasik artefak</strong> — gen ribosom sangat terekspresi dan paling sensitif terhadap bias normalisasi. Reviewer: <em>“Tunjukkan PCA; pakai DESeq2/edgeR; jelaskan kenapa ribosom.”</em></p>
      <details className="worked">
        <summary>📐 Contoh: menulis review yang membangun (bukan menghancurkan)</summary>
        <p>Review buruk: “Analisis ini salah semua. Ditolak.” (Tidak membantu, tidak profesional.)<br />
        Review baik:<br />
        <em>“Kekhawatiran utama: (1) Tanpa koreksi multiple testing, ~1.000 dari 3.000 temuan kemungkinan false positive — mohon ulangi dengan FDR &lt; 0,05. (2) Metode normalisasi/uji tidak dijelaskan; pathway ribosom teratas menyarankan artefak normalisasi — mohon sertakan PCA dan gunakan DESeq2. (3) Klaim kausal ‘gen X menyebabkan kanker’ tidak didukung data observasional — mohon lunakkan menjadi ‘berasosiasi’ + usulkan validasi fungsional. Jika ketiga ini diperbaiki, studi ini layak dipertimbangkan.”</em><br />
        <strong>Interpretasi:</strong> review yang baik = <strong>spesifik + bisa ditindaklanjuti + adil</strong>. Tujuannya memperbaiki sains, bukan memenangkan argumen. Kemampuan ini membedakan senior dari junior — dan analis yang bisa mereview = analis yang bisa memimpin.</p>
      </details>

      <h3>Cacat #3: klaim kausal dari data observasional</h3>
      <p>“Gen X <strong>menyebabkan</strong> kanker” — dari korelasi ekspresi! Bisa jadi sebaliknya (kanker → gen X naik) atau confounder. Aturan bahasa: data observasional → <strong>“berasosiasi”</strong>; kausal butuh intervensi (knockout/knockdown) atau desain khusus.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Review karyamu sendiri</strong></p>
        <p>Sebelum submit capstone: <strong>jadilah reviewer kejam untuk laporanmu sendiri</strong> selama 1 jam. Cari 3 cacat seperti di atas. Setiap cacat yang kamu temukan sendiri = satu peluru reviewer yang berhasil dihindari. Laporan yang selamat dari review-diri = laporan yang siap dinilai.</p>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Langkah PERTAMA proyek DE yang benar?"
        options={["Jalankan DESeq2",
          "QC: PCA berlabel batch/kondisi + keputusan desain",
          "Buat volcano",
          "Tulis laporan"]}
        correct={1}
        explanation="Benar: pra-penerbangan. Desain dikunci sebelum hasil — mengubah setelahnya = p-hacking."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Batch seimbang antar kondisi. Tindakan?"
        options={["Abaikan",
          "Masukkan ke desain (~batch + kondisi)",
          "Buang data",
          "Tambah sampel"]}
        correct={1}
        explanation="Benar: koreksi valid bila tidak confounded. Bila confounded total → ulangi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kandidat validasi dipilih dengan…"
        options={["p-value terkecil saja",
          "Dua dimensi: |log2FC|>1 DAN padj<0,05",
          "Fold change saja",
          "Acak"]}
        correct={1}
        explanation="Benar: volcano dua dimensi. Satu dimensi = setengah informasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Outlier dibuang dengan benar ketika…"
        options={["Diam-diam",
          "Dicatat alasan + tunjukkan hasil dengan/tanpa outlier",
          "Tidak pernah dibuang",
          "Selalu dibuang"]}
        correct={1}
        explanation="Benar: jejak audit. Keputusan tanpa catatan = tidak profesional."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Nilai terbesar analis bioinformatika ada di tahap…"
        options={["Running tool",
          "Interpretasi + komunikasi (pathway, cerita, laporan)",
          "Download data",
          "Install software"]}
        correct={1}
        explanation="Benar: tool bisa otomatis; interpretasi + kejujuran = karir."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Keterbatasan yang diakui dalam laporan…"
        options={["Melemahkan",
          "MEMPERKUAT kredibilitas",
          "Dilarang",
          "Tidak dibaca"]}
        correct={1}
        explanation="Benar: reviewer percaya analis yang tahu batasnya. Kejujuran = strategi."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Alur profesional: <strong>QC → DE → interpretasi → laporan</strong>.</li>
          <li>Kunci desain <strong>sebelum</strong> lihat hasil (anti p-hacking).</li>
          <li>Metode benar: <strong>size factor, NB, FDR</strong>; kandidat dua dimensi.</li>
          <li>Interpretasi: <strong>pathway + literatur</strong>, bukan daftar gen.</li>
          <li>Catat <strong>setiap keputusan</strong> dengan alasan (jejak audit).</li>
          <li>Laporan 1 halaman: fakta + <strong>keterbatasan jujur</strong> + langkah lanjut.</li>
          <li>Terima review: standar kelulusan = definisi profesionalisme.</li>
          <li>Selamat — kamu kini berpikir seperti bioinformatikawan. Track 4 selesai!</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi17-reprodusibilitas" className="btn btn-secondary btn-sm">← BI17</Link>
        <Link href="/learn//" className="btn btn-primary btn-sm">Daftar Materi →</Link>
      </div>
    </div>
  );
}
