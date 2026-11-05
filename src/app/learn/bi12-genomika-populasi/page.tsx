"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi12GenomikaPopulasiPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi12LdData = [{"z": [[1.0, 0.9, 0.7, 0.2], [0.9, 1.0, 0.8, 0.3], [0.7, 0.8, 1.0, 0.4], [0.2, 0.3, 0.4, 1.0]], "x": ["SNP1", "SNP2", "SNP3", "SNP4"], "y": ["SNP1", "SNP2", "SNP3", "SNP4"], "type": "heatmap", "colorscale": "Reds", "showscale": true}];
  const bi12LdDataLayout = {"xaxis": {"title": ""}, "yaxis": {"title": ""}, "showlegend": false};

  const bi12ManhData = [{"x": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100], "y": [2, 2, 4, 3, 1, 3, 4, 2, 2, 4, 3, 1, 3, 4, 2, 2, 4, 3, 1, 3, 4, 2, 14, 4, 3, 1, 3, 4, 2, 2, 4, 3, 1, 3, 4, 2, 2, 4, 3, 1, 3, 4, 2, 2, 10, 3, 1, 3, 4, 2, 2, 4, 3, 1, 3, 4, 2, 2, 4, 3, 1, 3, 4, 2, 2, 4, 15, 1, 3, 4, 2, 2, 4, 3, 1, 3, 4, 2, 2, 4, 3, 1, 3, 4, 2, 2, 4, 3, 1, 3, 4, 2, 2, 4, 3, 1, 3, 4, 2, 2], "type": "scatter", "mode": "markers", "marker": {"color": "#2a7de1", "size": 6}, "showlegend": false}];
  const bi12ManhDataLayout = {"xaxis": {"title": "Posisi genom"}, "yaxis": {"title": "-log10(p)"}, "showlegend": false, "shapes": [{"type": "line", "x0": 1, "x1": 100, "y0": 7.3, "y1": 7.3, "line": {"dash": "dash", "color": "#e8a838"}}]};

  const lab1Code = "obs = {'AA': 25, 'Aa': 50, 'aa': 25}  # ubah sesukamu\nn = sum(obs.values())\np = (2*obs['AA'] + obs['Aa']) / (2*n)\nq = 1 - p\nexp = {'AA': p**2*n, 'Aa': 2*p*q*n, 'aa': q**2*n}\nchi2 = sum((obs[g]-exp[g])**2/exp[g] for g in obs)\nprint(f'p={p:.3f}, q={q:.3f}')\nfor g in obs:\n    print(f'{g}: observasi={obs[g]}, ekspektasi HW={exp[g]:.1f}')\nprint(f'chi-square = {chi2:.2f} (df=1; kritis 3.84 untuk alpha 5%)')\nprint('LOLOS QC' if chi2 < 3.84 else 'GAGAL QC -> buang SNP ini')\nprint()\nprint('GWAS memakai ambang jauh lebih ketat (p<1e-6) karena')\nprint('jutaan SNP diuji. Satu SNP lolos di sini belum tentu lolos di sana.')";

  const lab2Code = "import random\nrandom.seed(31337)\ndata = []  # (populasi, alel_X, bisa_sumpit)\nfor _ in range(1000):\n    asia = random.random() < 0.5\n    alel = 1 if random.random() < (0.7 if asia else 0.2) else 0\n    sumpit = 1 if random.random() < (0.9 if asia else 0.1) else 0\n    data.append((asia, alel, sumpit))\n# asosiasi mentah: P(sumpit | alel)\na1 = [d for d in data if d[1]==1]; a0 = [d for d in data if d[1]==0]\nprint(f'mentah: P(sumpit|alel)={sum(d[2] for d in a1)/len(a1):.0%} vs '\n      f'P(sumpit|non)={sum(d[2] for d in a0)/len(a0):.0%}')\nprint('-> terlihat “gen sumpit”!')\n# terkoreksi populasi (stratifikasi)\nprint('per populasi:')\nfor asia, nama in [(True,'Asia'),(False,'Eropa')]:\n    sub = [d for d in data if d[0]==asia]\n    b1 = [d for d in sub if d[1]==1]; b0 = [d for d in sub if d[1]==0]\n    p1 = sum(d[2] for d in b1)/len(b1) if b1 else 0\n    p0 = sum(d[2] for d in b0)/len(b0) if b0 else 0\n    print(f'  {nama}: {p1:.0%} vs {p0:.0%} -> TIDAK ADA efek')\nprint()\nprint('Sinyal mentah 100% stratifikasi. Inilah kenapa GWAS wajib koreksi PCA.')";

  const bi12PrsData = [{"x": ["Rata-rata", "Top 10%", "Top 5%", "Top 1%"], "y": [1.0, 2.0, 3.0, 5.0], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["1x", "2x", "3x", "5x"], "textposition": "outside"}];
  const bi12PrsDataLayout = {"xaxis": {"title": "Kelompok PRS"}, "yaxis": {"title": "Risiko relatif"}, "showlegend": false};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI12 &mdash; Bioinformatics</span>
        <h1 className="display-title">GWAS &amp; Polygenic Score:<br />Genetika Populasi</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 1 Juta Orang, 1 Varian</a></li>
          <li><a href="#hw">Hardy-Weinberg &amp; LD</a></li>
          <li><a href="#gwas">GWAS: Manhattan Plot</a></li>
          <li><a href="#stratifikasi">Stratifikasi Populasi &amp; Koreksi</a></li>
          <li><a href="#prs">Polygenic Score &amp; eQTL</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Uji Hardy-Weinberg (Chi-square)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Stratifikasi Palsu</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Dari Satu Varian ke Skor Poligenik</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Konseling Skor Poligenik</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>Hardy-Weinberg</strong> sebagai QC dan <strong>LD</strong> sebagai dasar GWAS.</li>
          <li>Membaca <strong>Manhattan plot &amp; QQ plot</strong> dan menerapkan ambang 5e-8.</li>
          <li>Menjelaskan <strong>stratifikasi populasi</strong> dan koreksinya (PCA, mixed model).</li>
          <li>Menghitung <strong>polygenic score</strong> sederhana dan menjelaskan batasannya (+ eQTL).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 1 Juta Orang, 1 Varian</h2>
      <div className="story">
        <p>Studi 1 juta orang menemukan varian yang menaikkan risiko diabetes 1,15x. Media: “Gen diabetes ditemukan!” Realita: varian itu menjelaskan <strong>0,01%</strong> variasi — dan diabetes dipengaruhi 1.000+ varian serupa. Satu varian = setetes; yang penting adalah <strong>lautan poligenik</strong>.</p>
      <p>Genetika populasi adalah ilmu variasi antar manusia: kenapa kita beda, bagaimana memetakan varian ke sifat, dan bagaimana memakai ribuan varian kecil untuk prediksi. Lesson ini dari ekuilibrium klasik sampai polygenic score — topik yang menghubungkan evolusi, statistik, dan klinik.</p>
      <p>Twist-nya berlapis. <strong>Pertama</strong>: 1.000 varian × efek 1,15x = <em>polygenic score</em> yang memprediksi risiko diabetes sebaik faktor klinis — setetes demi setetes menjadi lautan yang bisa dipakai dokter. <strong>Kedua</strong>, dan ini yang pahit: skor yang dilatih pada 1 juta orang Eropa <strong>gagal total</strong> dipakai di populasi Asia atau Afrika (masalah <em>portability</em>). Skor “personal” yang tidak personal untuk 80% manusia. Genetika populasi bukan cuma soal evolusi masa lalu — ia menentukan <strong>siapa yang dilayani</strong> oleh kedokteran genomik masa depan.</p>
      </div>

      <h2 id="hw">Hardy-Weinberg &amp; LD — Si Keseimbangan dan Si Tetangga</h2>
      <p><strong>Definisi.</strong> <strong>Hardy-Weinberg</strong>: frekuensi genotipe = p², 2pq, q² bila populasi ideal (acak, besar, tanpa seleksi). Penyimpangan = sinyal genotyping error / seleksi / stratifikasi — dipakai untuk <strong>QC</strong>. <strong>LD (linkage disequilibrium)</strong>: alel tetangga diwariskan bersama (tidak acak) — dasar GWAS: genotyping SNP tag mewakili blok LD.</p>
      <Tex math={String.raw`p^2 + 2pq + q^2 = 1`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`p, q`} />: frekuensi alel A dan a (p+q=1)</li>
          <li><Tex math={String.raw`p^2, 2pq, q^2`} />: frekuensi genotipe AA, Aa, aa dalam ekuilibrium</li>
      </ul>
      <p><strong>Interpretasi:</strong> HW adalah “nol”-nya genetika populasi: seperti mengharapkan dadu adil. Bila dadu miring (penyimpangan HW), ada yang salah dengan dadu (genotyping) atau pemainnya (seleksi/stratifikasi).</p>
      <details className="worked">
        <summary>📐 Contoh: uji HW sebagai QC</summary>
        <p>SNP dengan 100 orang: AA=25, Aa=50, aa=25. p = (2×25+50)/200 = 0,5.<br />Ekspektasi: 25, 50, 25 → <strong>persis HW</strong> ✓.<br />Kasus bermasalah: AA=10, Aa=80, aa=10 → heterozigot berlebih → curigai <strong>genotyping error</strong> (atau duplikasi segmen). SNP ini dibuang dari GWAS.<br /><strong>LD:</strong> dua SNP 5kb apart dengan r²=0,9 — genotyping satu mewakili keduanya → array 500rb SNP mewakili 10 juta varian!</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> HW itu seperti neraca: diam saat semua beres, miring saat ada masalah. LD itu seperti tetangga gang: yang satu pindah, yang sebelah ikut-ikutan — genotyping satu, dapat info dua.</p>
      <p><strong>Kapan memakai:</strong> QC GWAS: buang SNP menyimpang HW (p&lt;1e-6). Desain array: pilih tag SNP per blok LD.</p>

      <PlotlyChart
        data={bi12LdData}
        title="Matriks LD (r²) 4 SNP"
        layout={bi12LdDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Heatmap korelasi antar SNP. Merah tua = LD tinggi (diwariskan bersama).</p>
        <p><strong>Interpretasi:</strong> SNP1-3 membentuk blok LD (merah) — satu tag SNP cukup mewakili ketiganya. SNP4 independen. Inilah cara array 500rb SNP “melihat” 10 juta varian: via blok-blok LD.</p>
      </div>

      <h2 id="gwas">GWAS: Manhattan Plot — Si Pencakar Langit</h2>
      <p><strong>Definisi.</strong> <strong>GWAS</strong>: uji asosiasi tiap SNP (jutaan!) dengan sifat. <strong>Manhattan plot</strong>: x = posisi genom, y = −log10(p). Puncak = lokus terkait. Ambang: <strong>5×10⁻⁸</strong> (Bonferroni untuk 1 juta uji independen).</p>
      <details className="worked">
        <summary>📐 Contoh: membaca Manhattan diabetes</summary>
        <p>Puncak di chr10 (TCF7L2), p=1e-40 → sinyal kuat, terreplikasi.<br />50 puncak lain p&lt;5e-8 → masing-masing OR 1,05–1,2 (kecil!).<br /><strong>QQ plot</strong>: titik mengikuti garis kecuali ekor atas → tidak ada inflasi sistematis (lambda ~1,0). Bila SEMUA titik di atas garis → stratifikasi belum terkoreksi!<br />Langkah lanjut: fine-mapping (SNP kausal dalam blok LD?) + replikasi populasi lain.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Manhattan plot itu seperti peta kota di malam hari: gedung-gedung (kromosom) dengan beberapa pencakar langit (sinyal) yang menonjol. Tapi ingat: pencakar itu menandai <em>blok LD</em>, bukan gen pasti — gen penyebabnya bisa tetangga sebelah.</p>
      <p><strong>Kapan memakai:</strong> Pemetaan varian untuk sifat kompleks. Butuh n besar (10rb–1jt) karena efek kecil.</p>

      <PlotlyChart
        data={bi12ManhData}
        title="Manhattan Plot (ilustratif)"
        layout={bi12ManhDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> X = posisi sepanjang genom, Y = signifikansi. Garis kuning = ambang 5e-8. Puncak di atas garis = sinyal.</p>
        <p><strong>Interpretasi:</strong> Dua pencakar langit menembus ambang = lokus terkait. Titik-titik di bawah = noise. Ingat: puncak menandai blok LD — butuh fine-mapping untuk menemukan varian/gen kausal sebenarnya.</p>
      </div>

      <h2 id="stratifikasi">Stratifikasi Populasi &amp; Koreksi — Si Pengacau</h2>
      <p><strong>Definisi.</strong> <strong>Stratifikasi populasi</strong>: subpopulasi beda frekuensi alel DAN beda prevalensi penyakit → asosiasi palsu (confounding genetik!). Koreksi: <strong>PCA</strong> (masukkan PC sebagai kovariat) atau <strong>mixed model</strong> (kinship).</p>
      <details className="worked">
        <summary>📐 Contoh klasik: chopstick gene</summary>
        <p>Studi “gen kemampuan menyumpit”: SNP terkait kuat! Ternyata sampel campur Asia (bisa menyumpit, alel X umum) + Eropa (tidak, alel X langka).<br />Setelah koreksi 10 PC: sinyal <strong>lenyap total</strong>.<br />Pelajaran: tanpa koreksi, GWAS menemukan “gen budaya” — bukan gen penyakit.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Stratifikasi itu seperti meneliti “gen suka sate” di Indonesia: orang Jawa lebih banyak makan sate DAN punya varian X lebih banyak — varian X “terkait” sate padahal cuma penanda suku. PCA adalah penerjemah yang membisikkan “hei, ini cuma soal suku”.</p>
      <p><strong>Kapan memakai:</strong> Setiap GWAS: selalu cek QQ plot + PCA; koreksi standar. Untuk Indonesia: keragaman etnis TINGGI → stratifikasi parah bila diabaikan.</p>
      <div className="callout callout-warning"><strong>Untuk Indonesia:</strong> 1.300+ suku dengan sejarah migrasi kompleks = stratifikasi ekstrem. GWAS Indonesia tanpa koreksi populasi yang cermat = pabrik temuan palsu. Ini juga alasan butuh referensi genomik nasional (BI2).</div>

      <h2 id="prs">Polygenic Score &amp; eQTL — Si Peramal dan Si Penghubung</h2>
      <p><strong>Definisi.</strong> <strong>PRS</strong> = Σ (efek SNP × jumlah alel): agregat ribuan varian kecil menjadi skor risiko individu. <strong>eQTL</strong>: varian yang memengaruhi EKSPRESI gen — jembatan dari “lokus terkait” ke “gen &amp; mekanisme”.</p>
      <Tex math={String.raw`PRS_i = \sum_{j} \hat{\beta}_j \cdot G_{ij}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\hat{\beta}_j`} />: efek SNP j dari GWAS</li>
          <li><Tex math={String.raw`G_{ij}`} />: genotipe individu i di SNP j (0/1/2 kopi alel)</li>
      </ul>
      <p><strong>Interpretasi:</strong> PRS menjumlahkan tetesan efek: satu SNP menjelaskan 0,01%, tapi 1 juta SNP menjelaskan 20–30% variasi. Individu top 5% PRS bisa berisiko 3–5x rata-rata — berguna untuk stratifikasi, bukan diagnosis.</p>
      <details className="worked">
        <summary>📐 Contoh: PRS penyakit jantung koroner</summary>
        <p>PRS dari 1 juta SNP. Distribusi normal di populasi.<br />Top desil: risiko 3x rata-rata → skrining kolesterol lebih awal.<br /><strong>Batasan:</strong> (1) transferabilitas: PRS dari Eropa berkinerja buruk di Asia/Afrika (LD &amp; frekuensi beda!); (2) bukan diagnosis — probabilitas, bukan vonis; (3) isu etik/keadilan (HD13).<br /><strong>eQTL:</strong> SNP GWAS diabetes ternyata eQTL untuk TCF7L2 di pankreas → mekanisme: mengatur ekspresi gen itu. Dari “blop LD” menjadi “cerita biologis”.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> PRS itu seperti nilai rapor dari 1 juta ulangan kecil: satu ulangan tidak berarti, tapi rata-ratanya memprediksi. eQTL itu seperti detektif yang melacak “puncak Manhattan itu sebenarnya mengatur gen tetangga lewat saklar ekspresi”.</p>
      <p><strong>Kapan memakai:</strong> PRS: stratifikasi risiko, riset — belum untuk diagnosis klinis rutin (validasi + etik). eQTL: interpretasi fungsional temuan GWAS.</p>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;GWAS menemukan “gen penyebab” penyakit&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> GWAS menemukan <em>lokus terkait</em> (blok LD). Gen kausal butuh fine-mapping + eQTL + fungsional. Puncak Manhattan = alamat kelurahan, bukan nomor rumah.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;PRS tinggi = pasti sakit&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> PRS = probabilitas, bukan vonis. Top 5% PRS jantung = risiko 3x — tapi 70%+ dari mereka tetap tidak sakit muda. PRS untuk stratifikasi populasi, bukan diagnosis individu. Komunikasi yang salah = fatalisme genetik.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Satu SNP signifikan = temuan besar&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> OR 1,1 menjelaskan nyaris nol variasi. Revolusi GWAS justru menunjukkan: sifat kompleks = ribuan varian kecil (poligenik). “Gen untuk X” tunggal adalah mitos media — kecuali penyakit Mendel.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu lihat <strong>QQ plot</strong> sebelum Manhattan. Inflasi genomik (lambda &gt;&gt;1) = ada yang salah (stratifikasi/kualitas) — jangan percaya puncak apa pun.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk replikasi: <strong>populasi berbeda</strong> adalah ujian emas. Sinyal yang hanya ada di satu populasi = curigai stratifikasi/kualitas.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Ingat <strong>aturan 5e-8</strong> untuk GWAS Eropa; untuk populasi/struktur beda, hitung ambang sendiri (permutasi). Angka magis tanpa konteks = cargo cult.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Uji Hardy-Weinberg (Chi-square)</h2>
      <p>Diberikan count genotipe, hitung frekuensi alel, ekspektasi HW, dan chi-square. Tentukan: lolos QC atau buang?</p>
      <PyodideLab
        title="🔬 Lab 1: Uji Hardy-Weinberg (Chi-square)"
        hint="Ubah count heterozigot jadi ekstrem (80). Lihat chi-square meledak — SNP seperti ini dibuang dari GWAS sebelum analisis."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Stratifikasi — Gen Sumpit Palsu</h2>
      <p>Simulasikan 2 subpopulasi (beda alel X + beda “kemampuan menyumpit”). Uji asosiasi mentah vs terkoreksi populasi. Saksikan sinyal palsu lenyap.</p>
      <PyodideLab
        title="🔬 Lab 2: Stratifikasi — Gen Sumpit Palsu"
        hint="Inilah confounding genetik (HD4/HD10 versi genomik). PCA pada data nyata melakukan “koreksi suku” ini secara otomatis."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. QC SNP → Uji Hardy-Weinberg</h3>
        <p><strong>Kondisi:</strong> Sebelum GWAS.</p>
        <p><strong>Kenapa:</strong> Buang genotyping error.</p>
        <p><strong>Contoh nyata:</strong> p HW &lt; 1e-6 → buang.</p>
      </div>
      <div className="decision-card">
        <h3>2. Pemetaan sifat kompleks → GWAS + 5e-8</h3>
        <p><strong>Kondisi:</strong> n besar, efek kecil.</p>
        <p><strong>Kenapa:</strong> Standar; replikasi wajib.</p>
        <p><strong>Contoh nyata:</strong> Diabetes, tinggi badan.</p>
      </div>
      <div className="decision-card">
        <h3>3. Ada struktur populasi → PCA/mixed model</h3>
        <p><strong>Kondisi:</strong> Selalu cek QQ plot.</p>
        <p><strong>Kenapa:</strong> Cegah temuan “gen budaya”.</p>
        <p><strong>Contoh nyata:</strong> GWAS multi-etnis Indonesia.</p>
      </div>
      <div className="decision-card">
        <h3>4. Dari lokus ke mekanisme → Fine-mapping + eQTL</h3>
        <p><strong>Kondisi:</strong> Punya puncak GWAS.</p>
      <PlotlyChart
        data={bi12PrsData}
        title="Risiko Relatif per Desil PRS (ilustratif, PJK)"
        layout={bi12PrsDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang = risiko relatif tiap kelompok PRS dibanding rata-rata populasi.</p>
        <p><strong>Interpretasi:</strong> Top 1% PRS = risiko 5x — setara mutasi monogenik! Tapi ingat: ini probabilitas populasi, bukan vonis individu. Dan PRS Eropa tidak otomatis berlaku untuk Indonesia (transferabilitas!).</p>
      </div>
        <p><strong>Kenapa:</strong> Blok LD → gen kausal.</p>
        <p><strong>Contoh nyata:</strong> SNP → eQTL TCF7L2 di pankreas.</p>
      </div>
      <div className="decision-card">
        <h3>5. Prediksi risiko → PRS (dengan caveat)</h3>
        <p><strong>Kondisi:</strong> Stratifikasi populasi, bukan diagnosis.</p>
        <p><strong>Kenapa:</strong> Agregat ribuan efek kecil.</p>
        <p><strong>Contoh nyata:</strong> Skrining dini kolesterol untuk top desil.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>HW untuk QC; LD untuk desain tag.</li>
          <li>Manhattan + QQ plot selalu berpasangan.</li>
          <li>5e-8 untuk GWAS; koreksi populasi wajib.</li>
          <li>PRS = probabilitas, bukan vonis.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: PRS Jantung “Siap Klinik”?</h2>
      <div className="callout">
        <p>Startup menjual tes PRS jantung: “Top 5% risiko 3x lipat!” Dokter bertanya padamu: boleh dipakai untuk keputusan statin?</p>
      <p>Fakta: PRS divalidasi di Eropa (AUC +0,03 di atas faktor klinis); belum divalidasi di Indonesia; tidak ada uji RCT bahwa PRS mengubah outcome; isu privasi/asuransi.</p>
        <p><strong>Pertanyaan:</strong> Rekomendasi berbasis bukti.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Belum untuk keputusan klinis rutin. (1) Tambahan AUC 0,03 kecil — faktor klinis (kolesterol, tekanan, rokok) jauh lebih menentukan dan bisa diubah. (2) Transferabilitas: PRS Eropa meragukan untuk Indonesia (LD/frek beda) — butuh validasi lokal. (3) Tanpa bukti bahwa mengetahui PRS mengubah outcome (RCT), ini skrining tanpa manfaat terbukti. (4) Risiko: fatalisme genetik + diskriminasi asuransi. Rekomendasi: pakai untuk RISET stratifikasi; untuk klinik, fokus pada faktor risiko yang bisa dimodifikasi. Uang pasien lebih baik untuk cek kolesterol rutin daripada tes PRS mahal. Pelajaran: prediksi ≠ utilitas klinis (lihat HD12 decision curve!).</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Dari Satu Varian ke Skor Poligenik</h2>
      <p>Genetika populasi bergerak dalam tiga era: <strong>satu gen</strong> (Mendel), <strong>satu varian</strong> (GWAS), <strong>ribuan varian</strong> (polygenic score). Tiap era punya matematika dan jebakan sendiri. Pendalaman ini memastikan kamu tidak memakai intuisi era-1 untuk masalah era-3.</p>

      <h3>1. Hardy-Weinberg: jam yang hampir selalu benar</h3>
      <Tex math={String.raw`p^2 + 2pq + q^2 = 1`} block />
      <p><strong>Artinya tiap simbol:</strong> p, q = frekuensi dua alel (p + q = 1); p² = frekuensi genotip homozigot AA; 2pq = heterozigot Aa; q² = homozigot aa — dalam populasi ideal (kawin acak, tanpa seleksi/migrasi/mutasi).</p>
      <details className="worked">
        <summary>📐 Contoh: dari frekuensi penyakit ke frekuensi pembawa</summary>
        <p>Fibrosis kistik (resesif): 1 dari 2.500 bayi Eropa → q² = 1/2500 → q = 1/50 = 0,02.<br />
        Frekuensi pembawa (heterozigot): 2pq ≈ 2 × 1 × 0,02 = <strong>1 dari 25</strong>!<br />
        <strong>Interpretasi:</strong> penyakit “langka” 1:2500 ternyata dibawa 1 dari 25 orang sehat. Inilah kenapa skrining pembawa (<em>carrier screening</em>) penting: risiko pasangan keduanya pembawa = (1/25)² = 1/625, dan anak mereka 1/4 sakit → 1/2500. Satu persamaan, seluruh logika konseling genetik.</p>
      </details>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: HW sebagai QC genotyping</strong></p>
        <p>SNP yang <strong>menyimpang jauh</strong> dari HW (p &lt; 10<sup>−6</sup>) di kontrol sehat biasanya bukan biologi menarik — melainkan <strong>error genotyping</strong> (probe gagal, delesi tersembunyi). Filter QC standar GWAS membuangnya. Pengecualian: di kasus penyakit, deviasi HW justru bisa menjadi sinyal asosiasi — konteks menentukan.</p>
      </div>

      <h3>2. GWAS: 1 juta orang, 10 juta uji, satu Manhattan plot</h3>
      <p>GWAS menguji tiap SNP terhadap sifat — 10 juta uji → ambang signifikansi <strong>genome-wide</strong> p &lt; 5×10<sup>−8</sup> (Bonferroni untuk ~1 juta blok haplotipe independen). Manhattan plot: sumbu X = posisi genom, Y = −log10(p); “pencakar langit” = lokus terkait.</p>
      <details className="worked">
        <summary>📐 Contoh: membaca Manhattan plot diabetes</summary>
        <p>Puncak tertinggi di chr10, −log10(p) = 42 (p = 10<sup>−42</sup>), di atas gen <em>TCF7L2</em> — lokus diabetes tipe 2 paling konsisten di semua populasi.<br />
        Tapi OR (odds ratio) varian top = <strong>1,15</strong> — menaikkan risiko 15% relatif. Risiko absolut: dari 10% menjadi ~11,5%.<br />
        <strong>Interpretasi:</strong> sangat signifikan secara statistik (n = 1 juta!), sangat kecil secara individu. GWAS menemukan <strong>biologi</strong> (pathway Wnt terlibat diabetes — petunjuk obat!), bukan ramalan nasib personal. Mencampuradukkan keduanya = kesalahan media di cerita pembuka.</p>
      </details>

      <h3>3. Stratifikasi populasi: confounder yang tampak seperti penemuan</h3>
      <p>Jika kasus direkrut di Jakarta dan kontrol di Surabaya, SNP apa pun yang frekuensinya beda antar kota tampak “terkait penyakit” — padahal hanya menandai <strong>asal geografis</strong>. Solusi: PCA genetik — 10 komponen utama menangkap struktur populasi; sertakan sebagai kovariat. Plot PCA yang menunjukkan kasus-kontrol terpisah = <strong>alarm merah</strong>, bukan penemuan.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Genomic control λ</strong></p>
        <p>λ (lambda) = median(χ² teramati) / 0,456. λ ≈ 1,0–1,05 = bersih. λ = 1,3 = ada inflasi sistematis (stratifikasi atau poligenisitas sejati pada n besar — bedakan dengan LD score regression!). Satu angka, diagnosis kualitas seluruh GWAS.</p>
      </div>

      <h3>4. Polygenic score: menjumlahkan setetes menjadi lautan</h3>
      <Tex math={String.raw`\text{PRS}_i = \sum_{j=1}^{m} \hat{\beta}_j \cdot G_{ij}`} block />
      <p><strong>Artinya tiap simbol:</strong> PRS<sub>i</sub> = skor individu i; β̂<sub>j</sub> = efek SNP j dari GWAS; G<sub>ij</sub> = jumlah alel risiko (0/1/2) yang dibawa individu i di SNP j; m = ribuan–jutaan SNP.</p>
      <details className="worked">
        <summary>📐 Contoh: PRS penyakit jantung koroner</summary>
        <p>PRS dari 6 juta SNP: 10% teratas memiliki risiko ~3x lipat dibanding rata-rata — setara dengan mutasi familial hiperkolesterolemia (yang hanya dimiliki 1:250 orang!). Bedanya: 10% populasi vs 0,4%.<br />
        <strong>Interpretasi:</strong> PRS mengidentifikasi <strong>banyak</strong> orang berisiko tinggi yang tidak terdeteksi skrining monogenik — kandidat nyata untuk intervensi dini (statin, gaya hidup). Tapi: (1) ia memprediksi <strong>risiko</strong>, bukan takdir (AUC ~0,8, bukan 1,0); (2) transferabilitas antar populasi buruk (twist cerita pembuka) — skor Eropa di populasi Asia bisa meleset total karena frekuensi alel &amp; LD beda.<br />
        Pelajaran etis: meluncurkan “tes DNA personal” berbasis PRS Eropa untuk populasi Indonesia = menjual ramalan yang tidak terkalibrasi untuk pembelinya.</p>
      </details>

      <h2 id="kasus2">🏥 Kasus Lapangan: Konseling Skor Poligenik</h2>
      <p>Pasien 40 tahun, tidak ada riwayat keluarga jantung, meminta interpretasi PRS jantung koroner dari tes DNA komersial: <strong>“skor Anda persentil 95”</strong>. Ia panik. Tugasmu: terjemahkan persentil menjadi <strong>risiko yang bisa dipahami dan ditindaklanjuti</strong> — tanpa menakuti, tanpa meremehkan.</p>

      <h3>Langkah 1: persentil → risiko absolut</h3>
      <details className="worked">
        <summary>📐 Contoh: dari 95 persentil ke angka nyata</summary>
        <p>Risiko populasi pria 40 tahun hingga usia 70: ~<strong>10%</strong>.<br />
        OR persentil 95 vs rata-rata ≈ <strong>2,5x</strong> (dari studi validasi PRS).<br />
        Risiko absolut ≈ 10% × 2,5 = <strong>~25%</strong> (perkiraan kasar, asumsi model log-aditif).<br />
        <strong>Interpretasi untuk pasien:</strong> “Dari 100 orang seperti Anda, ~25 akan mengalami kejadian jantung sebelum usia 70 — dibanding 10 dari 100 orang rata-rata. Artinya <strong>75 dari 100 TIDAK mengalaminya</strong>.”<br />
        Bingkai ganda ini penting: risiko relatif menakutkan (2,5x!), risiko absolut menenangkan sekaligus memotivasi (25% = 1 dari 4 — cukup untuk bertindak, tidak cukup untuk panik).</p>
      </details>

      <h3>Langkah 2: apa yang BISA diubah</h3>
      <p>PRS tidak bisa diubah — tapi <strong>risiko absolut bisa</strong>: statin menurunkan risiko ~25%, berhenti merokok ~35%, olahraga + diet signifikan. Pesan konseling: “Genetik Anda memberi <strong>alasan lebih kuat</strong> untuk intervensi yang memang bermanfaat bagi semua orang — bukan vonis.”</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Tiga kalimat konseling PRS</strong></p>
        <p>(1) “Skor ini tentang <strong>risiko</strong>, bukan takdir — sebagian besar orang dengan skor tinggi tetap sehat.” (2) “Skor ini <strong>tidak sempurna</strong> — ia tidak melihat gaya hidup, dan akurasinya lebih rendah untuk populasi non-Eropa.” (3) “Yang bisa kita lakukan: …” (tindakan konkret). Tanpa ketiganya, konseling = menakuti tanpa memberdayakan.</p>
      </div>

      <h3>Langkah 3: keterbatasan yang wajib diungkap</h3>
      <p>Pasien ini keturunan Indonesia; PRS dilatih di Eropa. Studi portabilitas: prediksi bisa <strong>melemah 2–5x</strong> di populasi Asia. Kejujuran profesional: “Angka 25% ini perkiraan <strong>optimistis presisinya</strong> — untuk populasi Anda, ketidakpastiannya lebih besar. Kami memakai ini sebagai sinyal kewaspadaan, bukan ramalan.” <strong>Ketidakpastian yang diungkap &gt; presisi palsu.</strong></p>

      <h3>Masa depan: PRS di klinik</h3>
      <p>Uji klinis (mis. HEART01) mulai memakai PRS untuk <strong>memprioritaskan skrining</strong>: skor tinggi → statin lebih dini, bukan menunggu kolesterol naik. Modelnya bukan “tes DNA menggantikan dokter” — melainkan <strong>stratifikasi risiko</strong> yang membuat pencegahan lebih tepat sasaran. Analis yang memahami matematika DAN komunikasi (seperti latihan ini) adalah jembatan yang dibutuhkan.</p>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Fungsi utama uji Hardy-Weinberg di GWAS?"
        options={["Menemukan gen",
          "QC: deteksi genotyping error/stratifikasi via penyimpangan",
          "Menghitung risiko",
          "Tidak ada"]}
        correct={1}
        explanation="Benar: HW = neraca. Miring = ada masalah dengan dadu atau pemainnya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. LD memungkinkan…"
        options={["Tanpa sekuensing",
          "Array 500rb SNP mewakili 10 juta varian via blok LD",
          "Tanpa statistik",
          "Kloning"]}
        correct={1}
        explanation="Benar: tetangga diwariskan bersama. Satu tag SNP = info satu blok."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Ambang signifikansi GWAS standar?"
        options={["0,05",
          "5×10⁻⁸ (Bonferroni ~1 juta uji)",
          "0,01",
          "1e-3"]}
        correct={1}
        explanation="Benar: koreksi jutaan uji. 0,05 mentah = 50.000 false positive ekspektasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. QQ plot menunjukkan SEMUA titik di atas garis diagonal. Artinya?"
        options={["Banyak penemuan",
          "Inflasi sistematis — curigai stratifikasi/kualitas, jangan percaya puncak",
          "Normal",
          "Power tinggi"]}
        correct={1}
        explanation="Benar: ekor atas saja yang boleh naik. Inflasi global = ada yang salah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. PRS top 1% risiko 5x. Interpretasi tepat?"
        options={["Pasti sakit",
          "Probabilitas populasi 5x — untuk stratifikasi, bukan vonis individu",
          "Tidak berguna",
          "Harus diobati"]}
        correct={1}
        explanation="Benar: 5x dari risiko kecil tetap kecil. Komunikasi yang salah = fatalisme."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. eQTL menjembatani GWAS ke biologi dengan…"
        options={["Menambah sampel",
          "Menghubungkan SNP ke perubahan EKSPRESI gen (mekanisme)",
          "Mengganti GWAS",
          "Tidak ada"]}
        correct={1}
        explanation="Benar: dari “blok LD terkait” ke “SNP ini mengatur gen X di jaringan Y”."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>HW</strong> (p²+2pq+q²=1): QC genotyping; <strong>LD</strong>: dasar tag SNP.</li>
          <li><strong>GWAS</strong>: jutaan uji; ambang <strong>5e-8</strong>; baca Manhattan + QQ.</li>
          <li><strong>Stratifikasi</strong> = confounding genetik; koreksi <strong>PCA/mixed model</strong>.</li>
          <li>Puncak = <strong>blok LD</strong>, bukan gen pasti — fine-mapping + eQTL.</li>
          <li><strong>PRS</strong> = Σ efek×alel: stratifikasi populasi, bukan diagnosis.</li>
          <li>Waspadai <strong>transferabilitas</strong> PRS lintas populasi.</li>
          <li>Sifat kompleks = <strong>poligenik</strong>: ribuan efek kecil.</li>
          <li>Untuk Indonesia: keragaman etnis = stratifikasi ekstrem + butuh referensi lokal.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi11-single-cell" className="btn btn-secondary btn-sm">← BI11</Link>
        <Link href="/learn/bi13-epigenomik" className="btn btn-primary btn-sm">BI13 →</Link>
      </div>
    </div>
  );
}
