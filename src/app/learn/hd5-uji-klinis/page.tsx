"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd5UjiKlinisPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd5IttData = [{"x": ["Per-protocol (70 vs 100)", "ITT (100 vs 100)"], "y": [35, 8], "type": "bar", "marker": {"color": ["#e8a838", "#2a7de1"]}, "text": ["35%", "8%"], "textposition": "outside"}];
  const hd5IttDataLayout = {"xaxis": {"title": "Metode analisis"}, "yaxis": {"title": "Selisih keberhasilan (poin %)"}, "showlegend": false};

  const lab1Code = "import random, statistics as st\nrandom.seed(11)\nn = 1000  # coba 40!\ngenetik = [random.gauss(0, 1) for _ in range(n)]  # faktor TAK TERUKUR\nacak = genetik[:]; random.shuffle(acak)\nA, B = acak[:n//2], acak[n//2:]\nprint(f'n={n}: rata2 genetik A={st.mean(A):+.3f}, B={st.mean(B):+.3f}')\nprint(f'selisih = {abs(st.mean(A)-st.mean(B)):.3f} (mendekati 0 = seimbang)')\nprint()\n# tanpa randomisasi: dokter memberi obat baru ke yg lebih sehat\nterurut = sorted(genetik)\nA2, B2 = terurut[:n//2], terurut[n//2:]\nprint(f'TANPA acak (seleksi dokter): A={st.mean(A2):+.3f}, B={st.mean(B2):+.3f}')\nprint('-> selisih besar = confounding; obat terlihat manjur padahal tidak')";

  const lab2Code = "import math\np_kontrol, p_obat = 0.30, 0.40  # ubah sesukamu\nz_alpha, z_beta = 1.96, 0.84   # alpha 5%, power 80%\ndelta = abs(p_obat - p_kontrol)\np_bar = (p_kontrol + p_obat) / 2\nn = 2 * (z_alpha + z_beta)**2 * p_bar * (1 - p_bar) / delta**2\nprint(f'delta = {delta:.0%}, n per kelompok = {math.ceil(n)}')\nprint(f'total sampel = {math.ceil(n)*2}')\nprint()\nprint('Aturan: delta dibagi 2 -> n dikali ~4. Efek kecil = trial mahal.')\narr = abs(p_obat - p_kontrol)\nprint(f'NNT implisit = {1/arr:.0f} (lihat HD3)')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD5 &mdash; Health Data Scientist</span>
        <h1 className="display-title">RCT, ITT &amp; Non-Inferiority:<br />Statistik di Balik Uji Klinis</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Obat yang “Menang” karena Curang</a></li>
          <li><a href="#rct">RCT &amp; Randomisasi — Si Pengacak yang Adil</a></li>
          <li><a href="#itt">ITT vs Per-Protocol — Si Jujur vs Si Pilih-pilih</a></li>
          <li><a href="#ukuran">Ukuran Sampel, Interim &amp; Non-Inferiority</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simulasi Randomisasi</a></li>
          <li><a href="#lab2">🔬 Lab 2: Kalkulator Ukuran Sampel</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Trial Non-Inferiority</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Batas-Batas RCT</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Uji Klinis Vaksin Bandung</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Membaca Laporan Trial seperti Regulator</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan mengapa <strong>randomisasi</strong> menyeimbangkan confounder tak terukur (bukan sekadar “adil”).</li>
          <li>Membedakan <strong>ITT vs per-protocol</strong> dan memprediksi arah bias masing-masing.</li>
          <li>Menghitung <strong>ukuran sampel</strong> untuk perbandingan dua proporsi dan menjelaskan trade-off power vs biaya.</li>
          <li>Menafsirkan uji <strong>non-inferiority</strong> dan analisis <strong>interim</strong> tanpa terjebak klaim “tidak berbeda = sama”.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Obat yang “Menang” karena Curang</h2>
      <div className="story">
        <p>Uji klinis obat diabetes baru vs standar. Hasil: obat baru “menang” — gula darah turun lebih banyak. Sponsor merayakan. Lalu statistikawan independen membuka data: <strong>30% peserta kelompok obat baru drop-out</strong> (mual hebat), dan analisis hanya memakai yang bertahan (per-protocol). Yang tidak tahan obat — kemungkinan yang paling sakit — hilang dari hitungan.</p>
      <p>Analisis ITT (intention-to-treat, semua peserta dihitung sesuai kelompok awalnya) menunjukkan hasil <strong>tidak berbeda</strong>. Kemenangan itu artefak seleksi, bukan efikasi. Lesson ini membedah trik-trik statistik uji klinis — agar kamu bisa membedakan bukti dari sulap.</p>
      <p><strong>Twist-nya:</strong> obat itu tidak “menang” karena bekerja lebih baik — ia menang karena <strong>aturan mainnya diubah diam-diam</strong>: 30% peserta yang gagal dikeluarkan dari hitungan. Ini seperti lomba lari di mana pelari yang jatuh didiskualifikasi dari catatan waktu, lalu pemenangnya diklaim “tercepat”. ITT vs per-protocol bukan perdebatan teknis statistikawan — ia adalah <strong>pertanyaan moral tentang siapa yang berhak dihitung</strong>. Dan jawabannya menentukan apakah obat yang kamu telan benar-benar bekerja untuk orang sepertimu.</p>
      </div>

      <h2 id="rct">RCT &amp; Randomisasi — Si Pengacak yang Adil</h2>
      <p><strong>Definisi.</strong> <strong>RCT (Randomized Controlled Trial)</strong>: peserta diacak ke kelompok perlakuan vs kontrol. Randomisasi membuat kedua kelompok <strong>setara dalam semua hal kecuali perlakuan</strong> — termasuk faktor yang tidak kita ketahui.</p>
      <details className="worked">
        <summary>📐 Contoh: kenapa observasional bisa kalah oleh RCT</summary>
        <p>Observasional: pasien yang memilih obat mahal terlihat lebih sehat — karena mereka lebih kaya, gizi lebih baik (confounding sosioekonomi).<br /><strong>RCT:</strong> 1.000 pasien diacak: 500 obat baru, 500 standar. Kekayaan, gizi, genetik tersebar merata secara acak ke dua kelompok.<br />Selisih outcome kini hanya bisa dijelaskan oleh obatnya. Inilah “keajaiban” randomisasi: bukan keadilan moral, tapi <strong>keseimbangan statistik</strong>.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Randomisasi itu seperti mengocok kartu sebelum dibagikan: tidak menjamin tiap tangan sempurna, tapi menjamin tidak ada yang curang. Keajaibannya: ia mengontrol confounder yang <em>belum ditemukan sains</em> sekalipun.</p>
      <p><strong>Kapan memakai:</strong> Menguji efikasi intervensi baru (obat, vaksin, program) ketika etik dan logistik memungkinkan. Endpoint harus didefinisikan SEBELUM trial dimulai.</p>
      <div className="callout"><strong>Istilah kunci:</strong> <em>blinding</em> (peserta/peneliti tidak tahu kelompoknya → cegah bias perilaku), <em>placebo control</em> (pembanding netral), <em>endpoint primer</em> (satu outcome utama yang menentukan menang/kalah — didaftarkan sebelum mulai untuk cegah p-hacking).</div>

      <h2 id="itt">ITT vs Per-Protocol — Si Jujur vs Si Pilih-pilih</h2>
      <p><strong>Definisi.</strong> <strong>ITT (intention-to-treat)</strong>: analisis SEMUA peserta sesuai kelompok randomisasi, apapun yang terjadi (drop-out, pindah obat). <strong>Per-protocol</strong>: hanya yang menyelesaikan sesuai protokol.</p>
      <Tex math={String.raw`\text{Estimasi ITT} = \text{efek obat} \times \text{kepatuhan} + \text{bias drop-out yang dipertahankan}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\text{efek obat}`} />: efikasi biologis murni</li>
          <li><Tex math={String.raw`\text{kepatuhan}`} />: proporsi yang benar-benar minum obat (0–1)</li>
      </ul>
      <p><strong>Interpretasi:</strong> ITT mengukur efek <strong>kebijakan meresepkan</strong> di dunia nyata (efektivitas), bukan efek obat di dunia ideal. Ia konservatif: cenderung meremehkan, bukan melebih-lebihkan — dan itulah yang diinginkan regulator.</p>
      <details className="worked">
        <summary>📐 Contoh: ITT membatalkan kemenangan palsu</summary>
        <p>200 peserta: 100 obat baru, 100 standar. Di kelompok obat, 30 drop-out karena mual (mereka yang paling parah).<br /><strong>Per-protocol</strong> (70 vs 100): obat terlihat menang besar — yang gagal sudah dibuang!<br /><strong>ITT</strong> (100 vs 100, drop-out dihitung gagal): keunggulan hilang.<br />Regulator (BPOM/FDA) memakai ITT sebagai analisis utama justru karena ia <strong>anti-curang</strong>.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> ITT itu wasit yang menghitung semua pemain yang didaftarkan, termasuk yang cedera di tengah laga. Per-protocol itu suporter yang hanya menghitung gol timnya. Untuk klaim “obat ini bekerja”, dengarkan wasit.</p>
      <p><strong>Kapan memakai:</strong> Laporan utama efikasi → ITT. Analisis pendukung mekanisme biologis → per-protocol (dengan label jelas).</p>

      <PlotlyChart
        data={hd5IttData}
        title="Selisih Keberhasilan Obat Baru vs Standar: Dua Analisis, Dua Cerita"
        layout={hd5IttDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Dua batang: kuning = per-protocol (hanya yang bertahan), biru = ITT (semua peserta). Bandingkan tingginya.</p>
        <p><strong>Interpretasi:</strong> Per-protocol mengklaim keunggulan 35 poin — ITT menyusutkannya jadi 8 poin yang tidak signifikan. Batang kuning adalah ilusi seleksi: yang drop-out (dan gagal) disembunyikan. Inilah kenapa regulator mewajibkan ITT sebagai analisis primer.</p>
      </div>

      <h2 id="ukuran">Ukuran Sampel, Interim &amp; Non-Inferiority</h2>
      <p><strong>Definisi.</strong> <strong>Ukuran sampel</strong> dihitung dari: efek yang ingin dideteksi, power (biasanya 80%), dan alpha (5%). <strong>Analisis interim</strong>: intip data di tengah jalan (dengan penalti alpha). <strong>Non-inferiority</strong>: membuktikan obat baru <em>tidak lebih buruk</em> dari standar dalam batas margin — bukan membuktikan sama.</p>
      <Tex math={String.raw`n \approx \frac{2(z_{1-\alpha/2} + z_{1-\beta})^2 \bar{p}(1-\bar{p})}{\Delta^2}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`n`} />: sampel per kelompok</li>
          <li><Tex math={String.raw`z_{1-\alpha/2}`} />: nilai z untuk alpha (1,96 untuk alpha 5%)</li>
          <li><Tex math={String.raw`z_{1-\beta}`} />: nilai z untuk power (0,84 untuk power 80%)</li>
          <li><Tex math={String.raw`\bar{p}`} />: rata-rata proporsi kejadian dua kelompok</li>
          <li><Tex math={String.raw`\Delta`} />: selisih efek yang ingin dideteksi — makin kecil, n meledak</li>
      </ul>
      <p><strong>Interpretasi:</strong> Rumus ini menjelaskan ekonomi trial: mendeteksi efek kecil butuh sampel besar (n ∝ 1/Δ²). Menurunkan Δ separuhnya → butuh 4x sampel. Inilah kenapa trial mahal.</p>
      <details className="worked">
        <summary>📐 Contoh: n untuk beda 10% vs 5%</summary>
        <p>Kontrol 30% sembuh, obat ditarget 40% (Δ=10%): n ≈ 350 per kelompok.<br />Jika target hanya Δ=5% (30% vs 35%): n ≈ <strong>1.400</strong> per kelompok — 4x lipat.<br />Keputusan bisnis: apakah efek 5% layak dikejar dengan biaya 4x? Kadang jawabannya tidak — dan itu keputusan statistik yang valid.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Ukuran sampel itu anggaran kebenaran: terlalu kecil = trial buta (tidak bisa melihat efek yang ada); terlalu besar = bakar uang. Interim itu wasit yang boleh menghentikan pertandingan lebih awal kalau satu tim sudah menang telak (atau ada yang cedera parah). Non-inferiority itu bukan “seri” — melainkan “kalahnya tidak lebih dari selisih yang masih bisa diterima”.</p>
      <p><strong>Kapan memakai:</strong> Desain trial baru → hitung n dulu (jangan rekrut “secukupnya”). Obat generik/biosimilar vs orisinal → non-inferiority. Trial panjang/berisiko → rencanakan interim dengan alpha-spending.</p>
      <div className="callout callout-warning"><strong>Jebakan non-inferiority:</strong> “tidak terbukti berbeda” ≠ “ter bukti sama”. Trial kecil yang underpowered juga “tidak menemukan perbedaan” — karena buta, bukan karena setara. Non-inferiority yang valid butuh margin prasetel + power cukup + assay sensitivity (trialnya mampu mendeteksi beda jika ada).</div>

      <h2 id="pendalaman">🔍 Pendalaman: Membaca Laporan Trial seperti Regulator</h2>
      <details className="worked">
        <summary>📐 Worked example: ITT vs per-protocol mengubah “pemenang” (klik untuk buka)</summary>
        <p>Trial obat diabetes baru (n=400, 200 per kelompok). Outcome: HbA1c turun ≥1% dalam 6 bulan.</p>
        <p><strong>Langkah 1 — Data mentah.</strong> Kelompok obat baru: 60 dari 200 mencapai target (30%), tapi 60 peserta drop-out (mual). Kelompok standar: 50 dari 200 mencapai target (25%), 10 drop-out.</p>
        <p><strong>Langkah 2 — Analisis per-protocol (yang “menang”).</strong> Hanya yang menyelesaikan: obat baru 60/140 = <strong>42,9%</strong>; standar 50/190 = <strong>26,3%</strong>. Selisih 16,6 poin — terlihat meyakinkan, p &lt; 0,01.</p>
        <p><strong>Langkah 3 — Analisis ITT (yang jujur).</strong> Semua peserta dihitung sesuai kelompok awal; drop-out = gagal: obat baru 60/200 = <strong>30%</strong>; standar 50/200 = <strong>25%</strong>. Selisih 5 poin — tidak signifikan.</p>
        <p><strong>Langkah 4 — Tanya kenapa drop-out beda.</strong> 30% vs 5%: obat baru jelas lebih sulit ditoleransi. Per-protocol <em>menghadiahi</em> obat yang tidak bisa ditoleransi — karena yang menderita hilang dari pembilang <em>dan</em> penyebut.</p>
        <p><strong>Langkah 5 — Keputusan regulator.</strong> BPOM/FDA memakai ITT sebagai analisis primer <em>tepat karena alasan ini</em>: obat harus bekerja untuk pasien nyata yang diresepkan, bukan hanya untuk pasien “tahan banting”. Klaim efikasi dari analisis per-protocol saja = red flag.</p>
        <p><strong>Pelajaran:</strong> setiap kali membaca “uji klinis membuktikan…”, cari kalimat “analisis intention-to-treat”. Tidak ada? Anggap brosur, bukan bukti.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — ukuran sampel adalah “biaya kejujuran”:</strong> Rumus ukuran sampel trial pada intinya menjawab: “berapa banyak pasien harus kita libatkan agar <em>tidak tertipu oleh kebetulan</em>?” Trial kecil yang “positif” sering bukan bukti kuat — melainkan <em>filter pemenang</em>: dari 20 trial kecil obat yang tidak bekerja, 1 akan positif secara kebetulan (α=5%), dan hanya yang 1 itulah yang dipublikasikan. Inilah mengapa regulator menuntut <strong>replikasi</strong> dan mengapa analis harus selalu menanyakan “berapa trial <em>serupa</em> yang tidak dipublikasikan?” sebelum percaya satu hasil gemilang.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — membaca klaim vaksin DBD:</strong> Vaksin dengue (Qdenga) dilaporkan efikasi ~80% mencegah rawat inap. Tapi baca detail trial-nya: efikasi berbeda <strong>per status serologi awal</strong> (pernah vs belum pernah terinfeksi dengue) dan per serotipe. Untuk anak Indonesia yang belum pernah terinfeksi, angkanya bisa jauh lebih rendah — dan rekomendasi WHO pun mensyaratkan skrining pra-vaksinasi di beberapa konteks. Pelajarannya: <strong>“efikasi 80%” tanpa menyebut “pada siapa” adalah angka yatim piatu</strong> — selalu pasangkan angka efikasi dengan populasinya sebelum merekomendasikan ke Dinkes.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: RCT Itu Emas — Tapi Emas Pun Punya Batas</h2>
      <p>RCT adalah standar emas <em>validitas internal</em> (apakah efeknya nyata pada peserta trial). Tapi analis profesional tahu tiga batasnya — dan kapan harus melampauinya.</p>
      <p><strong>Batas 1 — Validitas eksternal: trial bukan dunia nyata.</strong> Peserta RCT disaring ketat: usia 18–65, tanpa komorbid berat, patuh minum obat. Pasienmu: 72 tahun, 5 komorbid, lupa minum obat 2× seminggu. Efek pada peserta trial (“efficacy”) <strong>melebih-lebihkan</strong> efek di populasi nyata (“effectiveness”). Solusi modern: <strong>pragmatic trial</strong> (kriteria longgar, setting klinik biasa) dan <strong>target trial emulation</strong> dari data observasional (HD10) untuk menjembatani.</p>
      <p><strong>Batas 2 — RCT tidak bisa menjawab semuanya.</strong> Tidak etis merandomisasi orang untuk <em>merokok</em>, <em>terpapar polusi</em>, atau <em>tidak divaksinasi</em> saat wabah. Untuk pertanyaan berbahaya/tidak etis/tidak praktis, <strong>observasional yang dirancang baik adalah satu-satunya jalan</strong> — dan jauh lebih baik daripada tidak ada bukti sama sekali. Hierarki bukti bukan “RCT atau sampah”; ia “RCT bila mungkin, observasional terbaik bila tidak”.</p>
      <p><strong>Batas 3 — Outcome trial ≠ outcome yang penting.</strong> Trial sering memakai <strong>surrogate endpoint</strong> (HbA1c turun, bukan komplikasi turun; tumor menyusut, bukan hidup lebih lama) karena lebih cepat &amp; murah. Tapi surrogate bisa menipu: obat yang menurunkan aritmia (CAST trial) ternyata <strong>menaikkan kematian</strong>. Selalu tanya: “endpoint ini <em>surrogate</em> atau <em>klinis</em>? Sudah divalidasi?” — Regulator (FDA/EMA/BPOM) kini menuntut bukti rantai surrogate→klinis makin ketat.</p>
      <div className="callout">
        <p><strong>Prinsip analis:</strong> puji RCT untuk <em>apa yang ia kuasai</em> (kausalitas internal), curigai untuk <em>apa yang ia klaim</em> (generalisasi, endpoint). Analis terbaik membaca trial dengan dua mata: <strong>mata statistikawan</strong> (apakah efeknya nyata?) dan <strong>mata klinisi</strong> (apakah efeknya <em>penting</em> untuk pasien saya?).</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;“Uji klinis gagal menemukan perbedaan = kedua obat sama efektif”&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Tidak. “Gagal menolak H0” bisa berarti (a) memang setara, atau (b) trial underpowered (sampel kecil, efek kecil). Kesetaraan butuh desain khusus: non-inferiority/equivalence dengan margin dan power yang cukup. Jangan biarkan “tidak signifikan” diterjemahkan jadi “sama”.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Analisis per-protocol lebih “murni” karena hanya memakai yang patuh&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Justru sebaliknya: membuang yang drop-out merusak randomisasi — yang bertahan bukan sampel acak lagi, melainkan subkelompok terseleksi (biasanya lebih sehat/patuh). “Kemurnian” ini adalah seleksi berkedok metodologi. ITT tetap analisis primer.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin besar sampel makin baik, selalu&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Sampel raksasa bisa mendeteksi beda yang <em>signifikan tapi tidak bermakna klinis</em> (mis. turun 0,1% gula darah, p&lt;0,001). Besar sampel menjawab “apakah beda?” — bukan “apakah bedanya penting?” Itu tugas effect size dan NNT (HD3).</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Membaca Trial Non-Inferiority</h2>
      <details className="worked">
        <summary>📐 Worked example: obat generik “tidak kalah” dari paten? (klik untuk buka)</summary>
        <p>Obat diabetes generik baru diuji <strong>non-inferiority</strong> vs obat paten: tujuannya bukan “lebih baik”, melainkan “tidak lebih buruk secara klinis bermakna” (dengan harga jauh lebih murah). Outcome: penurunan HbA1c. Margin non-inferiority (Δ) ditetapkan <strong>0,3%</strong> — selisih yang dianggap tidak bermakna klinis.</p>
        <p><strong>Langkah 1 — Pahami hipotesisnya (terbalik!).</strong> H0: generik <em>lebih buruk</em> ≥ 0,3% (inferior). H1: selisih &lt; 0,3% (non-inferior). <strong>Berbeda</strong> dari superiority trial — di sini “gagal menolak H0” berarti <em>gagal membuktikan</em> non-inferiority, bukan “terbukti sama”.</p>
        <p><strong>Langkah 2 — Baca confidence interval (kuncinya!).</strong> Hasil: selisih (generik − paten) = +0,1% (generik sedikit lebih buruk), 95% CI: <strong>−0,1% hingga +0,3%</strong>. Batas atas CI = +0,3% = <em>tepat</em> di margin. Keputusan: <strong>non-inferiority TIDAK terbukti</strong> (batas atas menyentuh/melebihi margin) — walau estimasi titiknya (+0,1%) terlihat “hampir sama”.</p>
        <p><strong>Langkah 3 — Bandingkan skenario.</strong> Jika CI: −0,2% hingga +0,15% (seluruhnya di bawah +0,3%) → <strong>non-inferior terbukti</strong>. Jika CI mencakup 0 <em>dan</em> seluruhnya di bawah margin → non-inferior (tapi belum tentu superior — butuh uji superiority terpisah untuk klaim “lebih baik”).</p>
        <p><strong>Langkah 4 — Waspada assay sensitivity.</strong> Non-inferiority hanya valid jika trial-nya <strong>mampu mendeteksi perbedaan bila ada</strong> (desain buruk yang “tidak menemukan beda” terlihat “non-inferior” palsu). Cek: apakah kontrol aktif (obat paten) bekerja seperti di trial historisnya? Jika tidak, seluruh kesimpulan runtuh.</p>
        <p><strong>Langkah 5 — ITT vs per-protocol di sini TERBALIK.</strong> Pada superiority, ITT konservatif. Pada non-inferiority, ITT (yang mengencerkan efek via drop-out) justru <strong>memudahkan</strong> klaim non-inferior palsu! Regulator menuntut <strong>keduanya</strong> (ITT + per-protocol) konsisten sebelum menyetujui.</p>
        <p><strong>Pelajaran:</strong> “tidak terbukti beda” ≠ “terbukti tidak beda”. Non-inferiority adalah klaim positif yang butuh bukti positif — CI seluruhnya di dalam margin.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Setiap kali membaca “obat generik setara”, cari <strong>margin Δ dan CI-nya</strong>. Tidak ada? Itu iklan, bukan bukti. Margin yang lebar (mis. Δ = 1,0% HbA1c) = standar yang diobral murah.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Saat membaca trial, cek urutan ini: <strong>apakah ITT primer? berapa drop-out per kelompok? apakah endpoint diganti di tengah?</strong> Tiga pertanyaan ini membongkar sebagian besar sulap.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Bedakan <strong>efikasi</strong> (dunia ideal, per-protocol) vs <strong>efektivitas</strong> (dunia nyata, ITT). Pembuat kebijakan butuh yang kedua; brosur obat suka menyajikan yang pertama.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Ingat ekonomi n ∝ 1/Δ²: klaim efek kecil dari trial kecil = hampir pasti noise atau p-hacking. Minta replikasi.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Randomisasi Menyeimbangkan yang Tak Terlihat</h2>
      <p>Simulasikan 1.000 pasien dengan faktor risiko tak terukur (genetik). Acak ke dua kelompok, lalu bandingkan rata-rata faktor itu. Ulangi dan lihat sebarannya menyempit.</p>
      <PyodideLab
        title="🔬 Lab 1: Randomisasi Menyeimbangkan yang Tak Terlihat"
        hint="Ubah n dari 1000 ke 40. Lihat: randomisasi pada sampel kecil bisa gagal seimbang! Itulah kenapa trial kecil memakai stratifikasi/blok."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Kalkulator Ukuran Sampel Trial</h2>
      <p>Implementasi rumus ukuran sampel dua proporsi. Coba berbagai selisih efek (Δ) dan lihat bagaimana n meledak saat efek yang dicari mengecil.</p>
      <PyodideLab
        title="🔬 Lab 2: Kalkulator Ukuran Sampel Trial"
        hint="Coba delta 0.15, 0.10, 0.05, 0.02. Perhatikan polanya: n naik ~4x setiap delta dibagi 2. Sekarang naikkan power ke 90% (z=1.28) — berapa tambahan biayanya?"
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Uji Klinis Vaksin di Bandung</h2>
      <p>Indonesia bukan hanya <em>konsumen</em> hasil trial — ia <em>pelaku</em>. Uji klinis fase 3 vaksin COVID-19 (Sinovac) di <strong>Bandung, 2020</strong> (1.620 relawan, FK Unpad) adalah salah satu trial terbesar yang pernah dijalankan Indonesia — dan pelajaran metodologinya relevan untuk setiap analis.</p>
      <p><strong>Yang dilakukan dengan benar:</strong> (1) <strong>Randomisasi double-blind</strong> vs plasebo — standar emas, bukan observasional. (2) <strong>Endpoint klinis</strong> (kasus COVID simptomatik terkonfirmasi), bukan sekadar antibodi (surrogate). (3) <strong>ITT sebagai analisis primer</strong> — semua relawan dihitung sesuai kelompok awalnya.</p>
      <p><strong>Kontroversi yang jadi pelajaran:</strong> efikasi dilaporkan <strong>65,3%</strong> — jauh di bawah angka Brasil (50,4% untuk kasus ringan) vs Turki (83,5%). <strong>Bukan</strong> karena trial-nya salah — melainkan karena <strong>populasi, definisi endpoint, dan latar epidemi berbeda</strong>: relawan Bandung adalah nakes muda sehat (risiko rendah), interval follow-up pendek, dan definisi “kasus” berbeda antar-negara. Pelajaran abadi: <strong>“efikasi 65%” tanpa konteks populasi &amp; endpoint adalah angka yatim</strong> — bandingkan apel dengan apel, atau jangan bandingkan.</p>
      <p><strong>Konteks Bio Farma &amp; kemandirian:</strong> Indonesia kini mengembangkan vaksin sendiri (Merah Putih/Inavac) — artinya <strong>kebutuhan biostatistikawan trial dalam negeri naik</strong>: desain protokol, perhitungan sampel, interim analysis, pelaporan CONSORT. Ini jalur karier nyata: “pernah terlibat analisis uji klinis” adalah kredensial langka dan mahal di Indonesia.</p>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Setiap kontroversi angka efikasi vaksin sebenarnya adalah <strong>ujian literasi trial publik</strong>. Analis yang bisa menjelaskan “kenapa 65% di Bandung vs 83% di Turki <em>bukan</em> berarti vaksinnya beda” dalam 3 kalimat adalah <strong>aset komunikasi krisis</strong> — skill yang Dinkes cari saat wabah berikutnya datang.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Laporan efikasi utama → ITT</h3>
        <p><strong>Kondisi:</strong> Klaim “obat ini bekerja” untuk regulator/publik.</p>
        <p><strong>Kenapa:</strong> Mempertahankan randomisasi; anti seleksi drop-out; mengukur efektivitas dunia nyata.</p>
        <p><strong>Contoh nyata:</strong> Hasil primer trial vaksin: ITT pada semua yang dirandomisasi.</p>
      </div>
      <div className="decision-card">
        <h3>2. Eksplorasi mekanisme biologis → Per-protocol (sekunder)</h3>
        <p><strong>Kondisi:</strong> Pertanyaan “apakah obatnya bekerja bila diminum?”</p>
        <p><strong>Kenapa:</strong> Valid sebagai analisis pendukung, dengan label dan caveat jelas.</p>
        <p><strong>Contoh nyata:</strong> Analisis sensitivitas: hasil konsisten antara ITT dan per-protocol = meyakinkan.</p>
      </div>
      <div className="decision-card">
        <h3>3. Obat baru vs standar yang sudah bagus → Non-inferiority</h3>
        <p><strong>Kondisi:</strong> Tujuan: lebih murah/aman/mudah, tidak harus lebih manjur.</p>
        <p><strong>Kenapa:</strong> Superiority tidak realistis; yang dibutuhkan bukti “tidak lebih buruk melewati margin”.</p>
        <p><strong>Contoh nyata:</strong> Biosimilar insulin vs orisinal; obat generik.</p>
      </div>
      <div className="decision-card">
        <h3>4. Trial panjang atau berisiko → Rencanakan interim</h3>
        <p><strong>Kondisi:</strong> Follow-up tahunan, atau ada risiko keamanan.</p>
        <p><strong>Kenapa:</strong> Etis: hentikan lebih awal jika sudah jelas menang/kalah/berbahaya; butuh alpha-spending agar tidak inflasi false positive.</p>
        <p><strong>Contoh nyata:</strong> Trial vaksin: interim saat separuh kasus terkumpul.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Analisis primer harus ITT — titik.</li>
          <li>Drop-out beda antar kelompok = lampu merah.</li>
          <li>“Tidak berbeda” ≠ “sama” (kecuali non-inferiority valid).</li>
          <li>n ∝ 1/Δ² — efek kecil butuh trial besar.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Vaksin DBD: Efikasi 80% atau 45%?</h2>
      <div className="callout">
        <p>Trial vaksin DBD 20.000 anak: kelompok vaksin vs plasebo, follow-up 2 tahun. Hasil <strong>per-protocol</strong>: efikasi 80%. Hasil <strong>ITT</strong>: efikasi 45%.</p>
      <p>Investigasi: 25% kelompok vaksin tidak melengkapi 3 dosis (jadwal sulit di daerah terpencil); kelompok plasebo drop-out hanya 5%. Tidak ada masalah keamanan serius.</p>
        <p><strong>Pertanyaan:</strong> Angka mana yang dipakai untuk keputusan program imunisasi nasional, dan apa implikasi kebijakannya?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Pakai ITT 45% untuk keputusan program — karena program nasional akan menghadapi kepatuhan lapangan yang sama buruknya (jadwal 3 dosis di daerah terpencil). Efikasi 80% hanya tercapai di dunia ideal. Implikasi: (1) hitung cost-effectiveness dengan 45%, bukan 80%; (2) investasikan pada sistem pengingat/logistik dosis lanjutan — menaikkan kepatuhan menggeser efektivitas mendekati 80%; (3) laporkan keduanya dengan jujur: 80% = potensi biologis, 45% = realita program. Analis yang menyajikan 80% ke Menteri sedang menjual harapan palsu.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Keajaiban utama randomisasi adalah…"
        options={["Membuat trial lebih murah",
          "Menyeimbangkan confounder terukur MAUPUN tak terukur antar kelompok",
          "Menjamin obatnya manjur",
          "Menghilangkan kebutuhan kontrol"]}
        correct={1}
        explanation="Benar: randomisasi menyebar semua faktor — termasuk yang belum ditemukan sains — secara acak. Bukan soal murah, soal keseimbangan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Analisis primer uji klinis menurut regulator (BPOM/FDA) adalah…"
        options={["Per-protocol",
          "ITT (intention-to-treat)",
          "Hanya yang patuh",
          "Yang dipilih sponsor"]}
        correct={1}
        explanation="Benar: ITT mempertahankan randomisasi dan anti-curang seleksi drop-out. Per-protocol hanya pendukung."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Trial kecil “tidak menemukan perbedaan” antara dua obat. Kesimpulan tepat?"
        options={["Kedua obat terbukti sama",
          "Belum tentu — bisa jadi underpowered; kesetaraan butuh desain non-inferiority",
          "Obat baru pasti lebih buruk",
          "Trialnya gagal total"]}
        correct={1}
        explanation="Benar: “gagal menolak H0” ≠ “H0 benar”. Buta (power rendah) juga menghasilkan “tidak signifikan”."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Selisih efek yang ingin dideteksi (Δ) dibagi 2. Ukuran sampel menjadi sekitar…"
        options={["2x lipat",
          "4x lipat",
          "Tetap",
          "Setengah"]}
        correct={1}
        explanation="Benar: n ∝ 1/Δ². Inilah ekonomi trial: efek kecil = biaya meledak."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Non-inferiority bertujuan membuktikan…"
        options={["Obat baru lebih manjur",
          "Obat baru tidak lebih buruk dari standar melewati margin yang disepakati",
          "Kedua obat identik",
          "Obat baru lebih murah"]}
        correct={1}
        explanation="Benar: “tidak lebih buruk melewati margin” — untuk obat yang menawarkan keunggulan lain (harga, keamanan, kemudahan)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Drop-out 30% di kelompok obat vs 5% di kontrol. Bahaya terbesar?"
        options={["Tidak ada, tinggal analisis yang bertahan",
          "Seleksi: yang bertahan bukan sampel acak lagi — ITT wajib, per-protocol menipu",
          "Trial harus diulang dari nol",
          "Obatnya pasti berbahaya"]}
        correct={1}
        explanation="Benar: drop-out diferensial merusak randomisasi. Analisis hanya-yang-bertahan = membandingkan apel pilihan dengan jeruk acak."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Randomisasi</strong> menyeimbangkan confounder tak terukur — keajaiban RCT.</li>
          <li><strong>ITT</strong> = analisis primer (semua peserta, sesuai acak). <strong>Per-protocol</strong> = pendukung saja.</li>
          <li>Drop-out diferensial antar kelompok = sinyal bahaya seleksi.</li>
          <li><strong>n ∝ 1/Δ²</strong>: efek kecil butuh trial besar; hitung sebelum rekrut.</li>
          <li><strong>Interim</strong> butuh alpha-spending; <strong>non-inferiority</strong> butuh margin + power.</li>
          <li>“Tidak signifikan” ≠ “sama”. “Tidak berbeda” ≠ “setara”.</li>
          <li>Bedakan <strong>efikasi</strong> (ideal) vs <strong>efektivitas</strong> (dunia nyata).</li>
          <li>Cek: ITT? drop-out? endpoint diganti? — tiga pertanyaan pembongkar sulap.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd4-desain-studi" className="btn btn-secondary btn-sm">← HD4</Link>
        <Link href="/learn/hd6-survival" className="btn btn-primary btn-sm">HD6 →</Link>
      </div>
    </div>
  );
}
