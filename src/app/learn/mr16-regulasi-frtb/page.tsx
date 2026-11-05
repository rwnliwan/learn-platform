"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function MR16Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Evolusi modal risiko pasar: Basel I -> 2.5 -> FRTB (ilustrasi)
  const evoData = [
    {
      x: ["Basel I (1996)", "Basel 2.5 (2009)", "FRTB SA", "FRTB IMA"],
      y: [100, 165, 140, 110],
      type: "bar",
      marker: { color: ["#94a3b8", "#e8a838", "#2a7de1", "#22c55e"] },
    },
  ];

  // ES 97.5% vs VaR 99%: untuk normal keduanya mirip
  const lab1Code = String.raw`# FRTB: ES 97.5% dengan liquidity horizon.
# ES dihitung per liquidity horizon bucket, lalu diskalakan:
# ES_total = sqrt( sum_j ES_j^2 )  (agregasi antar horizon)
# Kenapa 97.5%? Untuk distribusi NORMAL: ES(97.5%) ~= VaR(99%).
# Untuk ekor tebal: ES(97.5%) > VaR(99%) -- lebih menangkap tail risk.

import math

def norm_var_es(alpha, mu=0, sigma=1):
    # VaR & ES analitis untuk normal
    # z_alpha via aproksimasi
    def z(p):
        # Acklam approximation
        a=[-3.969683028665376e+01,2.209460984245205e+02,-2.759285104469687e+02,
           1.383577518672690e+02,-3.066479806614716e+01,2.506628277459239e+00]
        b=[-5.447609879822406e+01,1.615858368580409e+02,-1.556989798598866e+02,
           6.680131188771972e+01,-1.328068155288572e+01]
        c=[-7.784894002430293e-03,-3.223964580411365e-01,-2.400758277161838e+00,
           -2.549732539343734e+00,4.374664141464968e+00,2.938163982698783e+00]
        d=[7.784695709041462e-03,3.224671290700398e-01,2.445134137142996e+00,
           3.754408661907416e+00]
        plow, phigh = 0.02425, 1-0.02425
        if p < plow:
            q = math.sqrt(-2*math.log(p))
            return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)
        if p > phigh:
            q = math.sqrt(-2*math.log(1-p))
            return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)
        q = p - 0.5; r = q*q
        return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)
    za = z(alpha)
    var = mu + sigma * za
    es = mu + sigma * math.exp(-za*za/2) / (math.sqrt(2*math.pi) * (1-alpha))
    return var, es

v99, _ = norm_var_es(0.99)
_, e975 = norm_var_es(0.975)
print(f"Normal: VaR 99% = {v99:.3f} sigma, ES 97.5% = {e975:.3f} sigma")
print(f"Rasio ES975/VaR99 = {e975/v99:.3f} ~= 1 utk normal!")
print()
print("FRTB memilih 97.5% BUKAN 99% agar modal tidak melonjak vs Basel 2.5")
print("(kalibrasi ulang), TAPI untuk ekor tebal ES975 > VaR99 --")
print("perubahan yang 'diam-diam' menghukum portofolio berekor tebal.")`;

  const lab2Code = String.raw`# PLA TEST (FRTB IMA): korelasi Spearman RTPL vs HPL + uji KS.
# Syarat lolos IMA: model risiko (RTPL) harus menjelaskan P&L aktual (HPL).
# Jika korelasi rendah -> desk DITOLAK dari IMA -> kembali ke SA (lebih mahal).

import math, random
random.seed(16)

def spearman(x, y):
    def ranks(v):
        s = sorted(range(len(v)), key=lambda i: v[i])
        r = [0]*len(v)
        for pos, i in enumerate(s): r[i] = pos
        return r
    rx, ry = ranks(x), ranks(y)
    n = len(x)
    mx, my = sum(rx)/n, sum(ry)/n
    num = sum((a-mx)*(b-my) for a, b in zip(rx, ry))
    den = math.sqrt(sum((a-mx)**2 for a in rx) * sum((b-my)**2 for b in ry))
    return num/den if den else 0

# Skenario A: model BAGUS (RTPL ~ HPL + noise kecil)
# Skenario B: model BURUK (faktor hilang -> RTPL tak menjelaskan HPL)
for label, noise, missing in [("Model bagus", 0.3, 0.0), ("Model buruk (faktor hilang)", 0.3, 2.0)]:
    rtpl, hpl = [], []
    for _ in range(250):
        f1, f2 = random.gauss(0,1), random.gauss(0,1)
        rt = f1 + 0.5*f2                    # model hanya tahu f1, f2
        hp = f1 + 0.5*f2 + missing*random.gauss(0,1) + noise*random.gauss(0,1)
        rtpl.append(rt); hpl.append(hp)
    rho = spearman(rtpl, hpl)
    status = "LOLOS IMA" if rho > 0.8 else "GAGAL -> kembali ke SA!"
    print(f"{label}: Spearman = {rho:.3f} -> {status}")
print()
print("Pelajaran: PLA menguji apakah model risiko 'memahami' P&L.")
print("Model VaR yang bagus di backtest BISA GAGAL di PLA jika faktor hilang.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR16 — Market Risk Analytics</span>
        <h1 className="display-title">Regulasi Risiko Pasar:<br />Dari Basel 2.5 ke FRTB</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Aturan yang Ditulis dengan Darah</a></li>
          <li><a href="#basel25">Basel 2.5: Pelajaran dari 2008</a></li>
          <li><a href="#frtb">FRTB: Revolusi Fundamental</a></li>
          <li><a href="#sbm">SBM: Pendekatan Standar Berbasis Sensitivitas</a></li>
          <li><a href="#ima">IMA: Model Internal, ES, dan Ujian Kelulusan</a></li>
          <li><a href="#nmrf">NMRF: Faktor yang Tak Bisa Dimodelkan</a></li>
          <li><a href="#lab1">🔬 Lab 1: ES 97,5% vs VaR 99%</a></li>
          <li><a href="#lab2">🔬 Lab 2: Uji PLA (Spearman)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: 35 Tahun Basel — Mengapa Aturan Terus Berubah</a></li>
          <li><a href="#case">📋 Mini-Case: Desk yang Gagal Ujian IMA</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan evolusi regulasi modal risiko pasar: Basel I → 2.5 → FRTB — dan krisis apa yang melahirkan tiap lapis.</li>
          <li>Membedakan Stressed VaR (Basel 2.5) dari VaR biasa dan menjelaskan mengapa ia ditambahkan.</li>
          <li>Menjelaskan tiga pilar FRTB: boundary yang ketat, SBM, dan IMA — serta kapan bank memakai masing-masing.</li>
          <li>Menghitung logika ES 97,5% dengan liquidity horizon dan menjelaskan mengapa 97,5% dipilih.</li>
          <li>Menjelaskan NMRF dan capital charge-nya — serta mengapa faktor illiquid &ldquo;dihukum&rdquo;.</li>
          <li>Menjelaskan dua ujian kelulusan IMA: backtesting dan P&amp;L attribution (PLA).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Aturan yang Ditulis dengan Darah</h2>
      <div className="story">
        <p>2009. Asap krisis 2008 belum hilang. Regulator Basel berkumpul dan bertanya: <em>mengapa modal risiko pasar bank-bank runtuh begitu cepat?</em> Jawabannya pahit: (1) VaR dihitung dari <strong>data masa tenang</strong> — modal menyusut tepat sebelum krisis; (2) tidak ada capital charge untuk <strong>risiko kredit di trading book</strong> (IRC) — padahal sekuritisasi itulah yang meledak; (3) <strong>korelasi</strong> yang diasumsikan stabil ternyata melonjak ke 1.</p>
        <p>Lahirlah <strong>Basel 2.5</strong> — tambalan darurat: <em>stressed VaR</em> (hitung VaR dari periode krisis!), charge untuk risiko kredit trading book, dan standar yang lebih ketat. Tapi tambalan menumpuk di atas fondasi retak. Maka Basel meluncurkan proyek 7 tahun: <strong>FRTB (Fundamental Review of the Trading Book)</strong> — bukan tambalan, melainkan <em>bangun ulang total</em>: definisi ulang boundary (MR1!), ganti VaR → ES, dan ujian kelulusan model yang jauh lebih keras.</p>
        <p>Twist-nya: FRTB begitu kompleks sehingga implementasinya <strong>tertunda bertahun-tahun</strong> di berbagai yurisdiksi — bank menghabiskan miliaran dolar untuk kepatuhan. Regulasi bukan sekadar &ldquo;aturan&rdquo; — ia adalah <strong>arsitektur insentif</strong> yang membentuk perilaku seluruh industri. Memahami FRTB = memahami mengapa bank mengukur risiko dengan cara yang mereka pakai hari ini.</p>
      </div>

      <h2 id="basel25">Basel 2.5: Pelajaran dari 2008</h2>
      <p>Tiga tambahan utama Basel 2.5 (2009):</p>
      <ol>
        <li><strong>Stressed VaR:</strong> hitung VaR 99%/10-hari dari <strong>periode stres historis 12-bulan</strong> (bukan data kini!). Modal = VaR biasa + Stressed VaR (masing-masing × multiplier). <strong>Intuisi:</strong> &ldquo;jangan biarkan modal menyusut di masa tenang&rdquo; — komponen stres menjaga <em>lantai</em> modal.</li>
        <li><strong>IRC (Incremental Risk Charge):</strong> capital charge untuk <strong>risiko default &amp; migrasi rating</strong> di trading book (99,9%/1-tahun) — menutup lubang &ldquo;risiko kredit di trading book tidak kena charge&rdquo;.</li>
        <li><strong>Comprehensive Risk Measure:</strong> untuk portofolio korelasi kompleks (CDO) — dengan floor ke pendekatan standar.</li>
      </ol>
      <p><strong>Warisan:</strong> prinsip <strong>&ldquo;modal harus tahan krisis, bukan cuma masa tenang&rdquo;</strong> — yang kemudian disempurnakan FRTB via ES + liquidity horizon.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> Stressed VaR adalah <strong>obat untuk amnesia model</strong> (MR2): VaR biasa &ldquo;lupa&rdquo; krisis saat masa tenang; Stressed VaR <em>memaksa ingat</em> dengan mengunci periode stres sebagai jangkar. Setiap kali modelmu terlihat &ldquo;terlalu tenang&rdquo;, tanyakan: &ldquo;di mana komponen stresnya?&rdquo;</p>
      </div>

      <h2 id="frtb">FRTB: Revolusi Fundamental</h2>
      <p><strong>Definisi.</strong> <strong>FRTB</strong> (Fundamental Review of the Trading Book, Basel 2016+, implementasi bertahap) membangun ulang kerangka modal risiko pasar. Lima pilar revolusi:</p>
      <ol>
        <li><strong>Boundary ketat</strong> trading vs banking book (MR1) — daftar presumptive, anti-arbitrase.</li>
        <li><strong>VaR → ES:</strong> metrik modal beralih ke <strong>Expected Shortfall 97,5%</strong> (koheren + menangkap tail — MR5).</li>
        <li><strong>Liquidity horizon:</strong> bukan lagi 10-hari untuk semua — tiap kelas aset punya horizon sesuai likuiditasnya (10 s/d 120 hari).</li>
        <li><strong>Desk-level approval:</strong> izin model internal diberikan <strong>per trading desk</strong> (bukan per bank!) — desk yang gagal ujian kembali ke standar.</li>
        <li><strong>NMRF:</strong> faktor yang tak bisa dimodelkan kena charge terpisah yang mahal.</li>
      </ol>

      <PlotlyChart
        data={evoData}
        title="Evolusi Modal Risiko Pasar (indeks ilustratif: Basel I = 100)"
        layout={{ xaxis: { title: "Kerangka" }, yaxis: { title: "Modal (indeks)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang = tingkat modal ilustratif di tiap kerangka (bukan angka resmi — pola yang penting).</p>
        <p><strong>Interpretasi:</strong> Basel 2.5 <strong>melonjakkan</strong> modal (tambalan darurat). FRTB SA menurunkannya sedikit tapi <strong>lebih sensitif risiko</strong> (berbasis sensitivitas, bukan asal). FRTB IMA memberi <strong>diskon untuk model bagus</strong> — insentif untuk investasi model. <strong>Pesan:</strong> regulator tidak sekadar &ldquo;menaikkan modal&rdquo; — ia <strong>merancang insentif</strong>: model bagus = modal murah.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;FRTB hanya menaikkan modal bank.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> dampak agregat bervariasi — untuk portofolio sederhana &amp; likuid, FRTB bisa <em>menurunkan</em> modal vs Basel 2.5. Yang pasti berubah: <strong>struktur insentif</strong> (model bagus didiskon, faktor illiquid dihukum, desk dinilai sendiri-sendiri). FRTB = arsitektur insentif, bukan sekadar palu modal.</p>
      </div>

      <h2 id="sbm">SBM: Pendekatan Standar Berbasis Sensitivitas</h2>
      <p><strong>Definisi.</strong> <strong>SBM (Sensitivities-Based Method)</strong> = cara standar FRTB: hitung <strong>sensitivitas</strong> tiap posisi ke risk factor yang ditentukan regulator, lalu agregasikan dengan <strong>bobot risiko &amp; korelasi yang ditentukan</strong>:</p>
      <Tex math={String.raw`\text{Capital}_{SBM} = \sqrt{\sum_b K_b^2 + \sum_{b \ne c} \gamma_{bc} K_b K_c} + \text{DRC} + \text{RRAO}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`K_b`} />: capital charge per <strong>bucket</strong> (kelas risiko) — dari sensitivitas × bobot risiko</li>
        <li><Tex math={String.raw`\gamma_{bc}`} />: korelasi antar bucket <strong>yang ditetapkan regulator</strong> (bukan dari data bank!)</li>
        <li><Tex math={String.raw`DRC`} />: Default Risk Charge — untuk risiko default di trading book</li>
        <li><Tex math={String.raw`RRAO`} />: Residual Risk Add-On — untuk risiko eksotik yang tak tertangkap (misal gap risk)</li>
      </ul>
      <p><strong>Tiga komponen risiko dalam SBM:</strong> <strong>Delta</strong> (arah), <strong>Vega</strong> (volatilitas), <strong>Curvature</strong> (non-linearitas — versi regulator dari gamma/convexity!). Perhatikan: regulator <strong>memaksa</strong> pengukuran orde-2 (curvature) — pelajaran dari krisis yang diabaikan VaR linear.</p>
      <p><strong>Kapan dipakai:</strong> default untuk semua bank; <strong>wajib</strong> untuk desk yang gagal/tak punya IMA; dan sebagai <strong>floor</strong> pembanding.</p>

      <h2 id="ima">IMA: Model Internal, ES, dan Ujian Kelulusan</h2>
      <p><strong>Definisi.</strong> <strong>IMA (Internal Models Approach)</strong> = bank boleh pakai <strong>model internal</strong> (ES 97,5%) — <strong>jika lolos ujian</strong>. Komponen modal IMA:</p>
      <Tex math={String.raw`\text{Capital}_{IMA} = \max(\text{ES}_{t-1}, m_c \cdot \overline{\text{ES}}_{60}) + \text{NMRF} + \text{DRC}`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`m_c`} /> = multiplier (1,5 + add-on dari backtest — mirip traffic light MR6!); <Tex math={String.raw`\overline{\text{ES}}_{60}`} /> = rata-rata ES 60 hari; <strong>NMRF</strong> = charge faktor tak termodelkan (di bawah).</p>
      <p><strong>ES dengan liquidity horizon:</strong> ES dihitung per horizon likuiditas (10/20/40/60/120 hari sesuai kelas aset), lalu diagregasi:</p>
      <Tex math={String.raw`ES = \sqrt{ES_1^2 + \sum_{j \ge 2}\left(ES_j \sqrt{\tfrac{LH_j - LH_{j-1}}{10}}\right)^2}`} block />
      <p><strong>Intuisi:</strong> aset illiquid (LH=120 hari) memberi kontribusi <strong>lebih besar</strong> — &ldquo;hukuman&rdquo; otomatis untuk illiquiditas. Inilah versi regulasi dari LVaR (MR13).</p>
      <p><strong>Dua ujian kelulusan IMA (per desk!):</strong></p>
      <ol>
        <li><strong>Backtesting</strong> (MR6): VaR 99%/97,5% vs P&amp;L — zona merah = tendang dari IMA.</li>
        <li><strong>P&amp;L Attribution (PLA):</strong> model harus <em>menjelaskan</em> P&amp;L — dua uji:
          <ul>
            <li><strong>Spearman correlation</strong> RTPL vs HPL harus tinggi (arah benar).</li>
            <li><strong>Kolmogorov-Smirnov:</strong> distribusi RTPL vs HPL tidak boleh beda jauh (bentuk benar).</li>
          </ul>
        </li>
      </ol>
      <p><strong>Kenapa PLA penting:</strong> backtest hanya menguji <em>frekuensi</em> pelanggaran — model yang &ldquo;beruntung&rdquo; bisa lolos. PLA menguji apakah model <strong>benar-benar memahami</strong> risiko (jika RTPL tak berkorelasi dengan P&amp;L aktual, modelmu fiksi — walau backtest hijau!).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> PLA adalah <strong>ujian yang lebih jujur</strong> daripada backtest — ia bertanya &ldquo;apakah modelmu <em>mengerti</em> P&amp;L?&rdquo; bukan cuma &ldquo;apakah pelanggaranmu pas jumlahnya?&rdquo;. Desk dengan backtest hijau tapi PLA merah = model yang benar secara kebetulan. FRTB menendang model seperti itu kembali ke SA.</p>
      </div>

      <h2 id="nmrf">NMRF: Faktor yang Tak Bisa Dimodelkan</h2>
      <p><strong>Definisi.</strong> <strong>NMRF (Non-Modellable Risk Factor)</strong> = faktor risiko yang <strong>tidak memenuhi</strong> uji likuiditas data (kurang dari 24 observasi harga <em>real</em> per tahun, atau gap &gt; 1 bulan tanpa data). Contoh: harga obligasi eksotis yang jarang diperdagangkan, volatilitas implisit strike jauh.</p>
      <p><strong>Charge NMRF:</strong> dihitung via <strong>stress skenario</strong> (bukan ES!) — dan <strong>tidak boleh ada diversifikasi</strong> antar NMRF (dijumlah mentah!). Ini <strong>sengaja mahal</strong> — insentif untuk: (1) perbaiki data pasar, (2) kurangi eksposur ke faktor tak likuid, atau (3) terima charge mahal.</p>
      <p><strong>Implikasi praktis:</strong> sebelum FRTB, bank bisa &ldquo;memodelkan&rdquo; apa saja dengan interpolasi. Kini: <strong>tidak ada data real = tidak bisa model = bayar mahal</strong>. Data pasar menjadi <strong>aset regulasi</strong> — inilah kaitan langsung ke data lineage (MR18).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;NMRF hanya masalah teknis data.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> NMRF adalah <strong>senjata insentif</strong>: charge-nya dirancang <em>menyakitkan</em> agar bank memperbaiki kualitas data atau keluar dari posisi tak likuid. Bank yang mengabaikan &ldquo;masalah data&rdquo; membayarnya via modal — mahal dan permanen sampai data diperbaiki.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: ES 97,5% vs VaR 99%</h2>
      <p>Ubah distribusi (tambahkan skew via Lab MR5). Kapan ES 97,5% &ldquo;diam-diam&rdquo; lebih besar dari VaR 99%?</p>
      <PyodideLab
        title="Lab 1 — Mengapa 97,5%? (Kalibrasi FRTB)"
        hint="Untuk normal, ES975 ≈ VaR99 (sengaja dikalibrasi agar modal tak melonjak). Tapi untuk distribusi berekor tebal, ES975 > VaR99 — perubahan metrik yang menghukum tail risk."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Uji PLA (Spearman)</h2>
      <p>Ubah <code className="inline">missing</code> (besarnya faktor yang hilang). Pada titik mana korelasi jatuh di bawah ambang lolos?</p>
      <PyodideLab
        title="Lab 2 — P&L Attribution: Apakah Model Memahami P&L?"
        hint="Coba missing=1.0 (faktor hilang sedang): korelasi turun tapi mungkin masih lolos. Inilah zona abu-abu PLA — model 'agak buta' tapi belum ditendang."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Bank tanpa model internal / desk gagal ujian → <strong>SBM</strong></h3>
        <p><strong>Kondisi:</strong> default, atau IMA dicabut.</p>
        <p><strong>Alasan:</strong> standar, transparan, berbasis sensitivitas (delta/vega/curvature). Lebih mahal untuk portofolio kompleks — insentif untuk bangun model bagus.</p>
      </div>

      <div className="decision-card">
        <h3>2. Desk dengan model teruji → <strong>IMA (ES 97,5% + LH)</strong></h3>
        <p><strong>Kondisi:</strong> lolos backtest + PLA <strong>per desk</strong>.</p>
        <p><strong>Alasan:</strong> modal lebih rendah (diskon untuk kualitas) + ES menangkap tail. Harga: investasi validasi &amp; data berkelanjutan.</p>
      </div>

      <div className="decision-card">
        <h3>3. Faktor tanpa data real cukup → <strong>NMRF (stress charge, tanpa diversifikasi)</strong></h3>
        <p><strong>Kondisi:</strong> &lt; 24 harga real/tahun.</p>
        <p><strong>Alasan:</strong> bukan pilihan — kewajiban. Obatnya: perbaiki data, kurangi eksposur, atau bayar.</p>
      </div>

      <div className="decision-card">
        <h3>4. Menilai kualitas model internal → <strong>Backtest + PLA (keduanya!)</strong></h3>
        <p><strong>Kondisi:</strong> validasi berkala, review regulator.</p>
        <p><strong>Alasan:</strong> backtest = frekuensi; PLA = pemahaman. Model yang lolos keduanya = model yang boleh dipercaya untuk modal.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>SBM</strong> = standar (sensitivitas). <strong>IMA</strong> = model internal (ES, per desk, lolos 2 ujian).</li>
          <li><strong>ES 97,5%</strong> + <strong>liquidity horizon</strong> = inti modal FRTB.</li>
          <li><strong>NMRF</strong> = bayar mahal untuk data buruk — perbaiki data atau kurangi eksposur.</li>
          <li>Regulasi = <strong>arsitektur insentif</strong>: model bagus didiskon, illiquid dihukum.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: 35 Tahun Basel — Mengapa Aturan Terus Berubah</h2>
      <p>Setiap singkatan Basel (I, II, 2.5, III, FRTB) lahir dari <strong>krisis yang mengekspos lubang aturan sebelumnya</strong>. Memahami linimasanya = memahami <em>mengapa</em> aturan berbentuk seperti sekarang — dan menebak ke mana ia bergerak berikutnya.</p>

      <h3>Linimasa: krisis → aturan → celah → krisis</h3>
      <ul>
        <li><strong>1988 — Basel I:</strong> aturan modal pertama yang disepakati global. Sederhana: bobot risiko kasar (0/20/50/100%) × 8%. <strong>Celah:</strong> tidak mengenal risiko pasar sama sekali; bobot kasar memicu <em>arbitrage</em> (pilih aset berisiko tertinggi dalam tiap bobot).</li>
        <li><strong>1996 — Market Risk Amendment:</strong> VaR 99%/10-hari masuk sebagai dasar modal risiko pasar — <strong>kelahiran VaR regulasi</strong> (MR3). <strong>Celah:</strong> VaR dari data tenang + tanpa stressed component → bom waktu 2008.</li>
        <li><strong>2004 — Basel II:</strong> tiga pilar (modal minimum, review pengawas, disiplin pasar); model internal (IRB) untuk credit risk. <strong>Celah:</strong> model internal bank <em>terlalu optimis</em>; tidak ada aturan likuiditas; sekuritisasi diperlakukan ringan.</li>
        <li><strong>2008 — Krisis:</strong> VaR hijau di mana-mana, bank berjatuhan. <strong>Pelajaran:</strong> risiko pasar, kredit, dan likuiditas <em>tidak terpisah</em> saat krisis.</li>
        <li><strong>2009 — Basel 2.5:</strong> <strong>Stressed VaR</strong> (MR4) + incremental risk charge — respons cepat atas lubang 2008.</li>
        <li><strong>2010–2017 — Basel III:</strong> modal lebih banyak &amp; berkualitas (CET1), <strong>LCR/NSFR</strong> (MR13), leverage ratio, buffer konservasi &amp; countercyclical.</li>
        <li><strong>2016/2019 — FRTB:</strong> perombakan total risiko pasar: boundary diperketat, <strong>VaR → ES 97,5%</strong> (MR5), SA yang sensitif-risiko (SBM), IMA dengan ujian PLA + backtest, NMRF untuk faktor tak termodelkan.</li>
      </ul>
      <p><strong>Polanya jelas:</strong> regulator selalu <em>bereaksi</em> — tidak ada Basel yang lahir dari teori murni. Implikasinya untuk karirmu: <strong>aturan hari ini adalah fosil krisis kemarin</strong>. Memprediksi arah regulasi = bertanya &ldquo;krisis seperti apa yang <em>belum</em> tercakup aturan saat ini?&rdquo; (Kandidat: risiko iklim, risiko siber, AI model risk.)</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: modal SA-SBM sederhana (klik untuk buka)</summary>
        <p><strong>Skenario.</strong> Desk obligasi korporat, 2 bucket: bucket A (IG) sensitivitas <Tex math={String.raw`S_A = \text{Rp }800\text{ jt/bp}`} />, bucket B (HY) <Tex math={String.raw`S_B = \text{Rp }500\text{ jt/bp}`} />. Bobot risiko (risk weight): A = 2%, B = 8%. Korelasi antar bucket <Tex math={String.raw`\gamma = 0{,}5`} />.</p>
        <p><strong>Langkah 1 — capital per bucket:</strong> <Tex math={String.raw`K_A = 800\text{ jt} \times 0{,}02 = \text{Rp}16\text{ M}`} />; <Tex math={String.raw`K_B = 500\text{ jt} \times 0{,}08 = \text{Rp}40\text{ M}`} />.</p>
        <p><strong>Langkah 2 — agregasi dengan korelasi:</strong> <Tex math={String.raw`K = \sqrt{K_A^2 + K_B^2 + 2\gamma K_A K_B} = \sqrt{256 + 1600 + 2(0{,}5)(16)(40)} = \sqrt{2496} \approx \text{Rp }50\text{ M}`} />.</p>
        <p><strong>Langkah 3 — bandingkan tanpa diversifikasi</strong> (γ=1): 16 + 40 = Rp56 M. Dengan γ=0,5: Rp50 M — <strong>pengakuan diversifikasi Rp6 M</strong>.</p>
        <p><strong>Angka ini artinya:</strong> SBM memberi <em>sebagian</em> manfaat diversifikasi (tidak penuh seperti korelasi historis, tidak nol seperti penjumlahan mentah) — <strong>kompromi konservatif</strong> yang disengaja. Dan perhatikan: bobot risiko ditetapkan <strong>regulator</strong>, bukan model bank — SA tidak bisa &ldquo;dioptimasi&rdquo; dengan asumsi cerdik. Itulah daya tariknya bagi pengawas: <em>transparan dan tidak bisa dimanipulasi</em> — dengan harga: kurang sensitif ke risiko aktual portofolio spesifik.</p>
      </details>

      <h3>SA vs IMA: memilih kubu</h3>
      <p>Bank (per trading desk!) memilih antara <strong>SA</strong> (Standardised Approach) dan <strong>IMA</strong> (model internal):</p>
      <ul>
        <li><strong>SA:</strong> mahal modalnya (konservatif), murah operasionalnya (tidak perlu lolos ujian). Cocok untuk desk kecil/eksotik di mana biaya validasi model &gt; penghematan modal.</li>
        <li><strong>IMA:</strong> murah modalnya (jika model bagus), mahal operasionalnya — butuh infrastruktur data, validasi (MR18), dan <strong>lolos PLA + backtest tiap desk tiap kuartal</strong>. Gagal ujian = kembali ke SA (dengan modal melonjak).</li>
      </ul>
      <p><strong>Dinamika menariknya:</strong> karena ujian IMA keras, banyak bank <em>memilih</em> SA untuk sebagian desk — fenomena &ldquo;<strong>SA creep</strong>&rdquo;. Regulator justru senang: SA yang konservatif = modal lebih tebal = sistem lebih aman. FRTB dirancang agar <strong>kedua pilihan mengarah ke modal yang cukup</strong> — IMA lewat akurasi, SA lewat konservatisme.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;FRTB hanya urusan bank besar global.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> prinsip-prinsipnya <strong>merembes ke semua level</strong>: OJK mengadopsi kerangka Basel secara bertahap; bank menengah memakai logika SBM untuk <em>limit internal</em> (MR17); dan sebagai analis, kamu akan ditanya &ldquo;bagaimana FRTB memperlakukan ini?&rdquo; dalam wawancara risiko pasar <em>di mana pun</em>. Memahami FRTB = memahami <strong>bahasa standar industri</strong> — seperti akuntan memahami PSAK/IFRS.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci untuk wawancara:</strong> jika ditanya &ldquo;jelaskan FRTB dalam 2 menit&rdquo;, pakai kerangka ini: <em>(1) Masalah yang dipecahkan: VaR 99% dari data tenang + boundary longgar + model tak teruji = 2008. (2) Tiga pilar solusi: boundary diperketat (kamar dikunci), metrik diganti ES 97,5% + liquidity horizon (penggaris diganti), model internal wajib lulus ujian PLA + backtest per desk (SIM dicabut jika ugal-ugalan). (3) Hasil: modal lebih sensitif ke risiko aktual, terutama ekor dan illiquiditas.</em> Tiga kalimat, seluruh FRTB tercakup.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: PLA test — kapan model &ldquo;tidak mengerti&rdquo; P&amp;L-nya (klik untuk buka)</summary>
        <p><strong>Data desk (20 hari):</strong> RTPL (P&amp;L menurut model risiko) vs HPL (P&amp;L hipotetis aktual). Korelasi Spearman = <strong>0,55</strong>. Uji KS: p-value = 0,03 (distribusi beda signifikan pada 5%).</p>
        <p><strong>Hasil:</strong> <strong>GAGAL PLA</strong> — dua-duanya merah (korelasi &lt; 0,7; KS menolak).</p>
        <p><strong>Interpretasi:</strong> model hanya menjelaskan ~30% (0,55²) variasi P&amp;L — <strong>70% P&amp;L datang dari faktor yang tidak dimodelkan</strong>. Kemungkinan: desk trading produk dengan <strong>basis risk</strong> (MR12) atau <strong>skew</strong> (MR11) yang tidak ada di model; atau ada <strong>intraday trading</strong> yang tidak tertangkap HPL.</p>
        <p><strong>Konsekuensi:</strong> desk <strong>ditendang dari IMA ke SA</strong> — modal naik (misal dari Rp120 M ke Rp200 M). Biaya &ldquo;ketidakmengertian&rdquo; = <strong>Rp80 M modal tambahan</strong> — insentif finansial langsung untuk memperbaiki model. Inilah kejeniusan FRTB: <strong>ia membuat ketidaktahuan menjadi mahal</strong>, sehingga bank <em>ingin</em> memahaminya.</p>
      </details>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Desk: K_A=Rp16 M, K_B=Rp40 M, korelasi antar bucket γ=0,75. Hitung modal SBM. Bandingkan dengan γ=0,5 (contoh lesson). (klik untuk pembahasan)</summary>
        <p><Tex math={String.raw`K = \sqrt{16^2 + 40^2 + 2(0{,}75)(16)(40)} = \sqrt{256+1600+960} = \sqrt{2816} \approx \text{Rp}53{,}1\text{ M}`} />.</p>
        <p>Dengan γ=0,5: Rp50 M. <strong>Selisih Rp3,1 M</strong> — korelasi regulator yang lebih tinggi = pengakuan diversifikasi lebih kecil = modal lebih besar. Pelajaran: di SA, <strong>korelasi adalah parameter kebijakan</strong>, bukan estimasi statistik — bank tidak bisa &ldquo;mengoptimasi&rdquo; modal dengan asumsi korelasi rendah.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Urutkan: Basel I, Market Risk Amendment, Basel II, Basel 2.5, Basel III, FRTB — dan untuk masing-masing sebutkan SATU krisis/celah yang melahirkannya. (klik untuk pembahasan)</summary>
        <p><strong>Basel I (1988)</strong> — krisis utang Amerika Latin 1980-an (modal bank tidak cukup). <strong>Amendment (1996)</strong> — pertumbuhan trading &amp; derivatif tanpa aturan modal. <strong>Basel II (2004)</strong> — celah bobot kasar Basel I (arbitrage). <strong>Basel 2.5 (2009)</strong> — krisis 2008 (VaR masa tenang + sekuritisasi). <strong>Basel III (2010+)</strong> — 2008 lanjutan (kualitas modal + likuiditas: LCR/NSFR). <strong>FRTB (2016)</strong> — 2008 lanjutan (boundary, VaR→ES, model tak teruji). Pola: <strong>setiap Basel adalah fosil krisis sebelumnya</strong>.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Desk kecil (modal hemat Rp2 M/tahun jika pakai IMA) butuh biaya validasi + infrastruktur Rp3 M/tahun untuk lolos ujian IMA. Keputusan rasional? Jelaskan. (klik untuk pembahasan)</summary>
        <p><strong>Pilih SA.</strong> Penghematan modal (Rp2 M) &lt; biaya kepatuhan (Rp3 M) — IMA <em>merugi</em> Rp1 M/tahun, belum termasuk risiko <strong>gagal ujian</strong> (kembali ke SA dengan modal melonjak + biaya sudah terlanjur keluar). Inilah logika &ldquo;SA creep&rdquo;: untuk desk kecil/eksotik, SA yang konservatif justru <strong>lebih murah total</strong>. Keputusan model = <strong>analisis biaya-manfaat</strong>, bukan gengsi kuantitatif.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Desk yang Gagal Ujian IMA</h2>
      <div className="callout">
        <p>Desk kredit bank ABC memakai IMA. Hasil ujian tahunan:</p>
        <ul>
          <li><strong>Backtest:</strong> 6 pelanggaran/250 hari (VaR 99%) — <strong>zona kuning</strong>, masih lolos</li>
          <li><strong>PLA Spearman:</strong> 0,62 (ambang internal 0,80) — <strong>GAGAL</strong></li>
          <li><strong>PLA KS:</strong> distribusi RTPL vs HPL berbeda signifikan — <strong>GAGAL</strong></li>
          <li>Penyebab: model tidak memasukkan <strong>basis CDS-bond</strong> sebagai faktor risiko</li>
          <li>Akibat: desk <strong>ditendang ke SBM</strong> → modal naik <strong>Rp800 miliar</strong></li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Mengapa backtest lolos tapi PLA gagal? (b) Apa yang seharusnya dilakukan sebelum ujian? (c) Hitung &ldquo;biaya satu faktor yang hilang&rdquo;.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Backtest buta, PLA melihat.</strong> Backtest hanya menghitung pelanggaran — model yang &ldquo;beruntung&rdquo; (atau terlalu konservatif di satu sisi) bisa lolos. PLA menguji <em>pemahaman</em>: RTPL yang tak berkorelasi dengan HPL = model tidak menjelaskan P&amp;L — fiksi yang kebetulan lolos angka.</p>
          <p>(b) <strong>Sebelum ujian:</strong> jalankan <strong>PLA internal rutin</strong> (bukan cuma saat ujian!) — unexplained P&amp;L yang persisten (MR6) adalah sinyal dini faktor hilang. Tambahkan basis CDS-bond sebagai faktor, rekalibrasi, uji ulang. <strong>Ujian IMA seharusnya tidak pernah mengejutkan</strong> — jika mengejutkan, monitoring internalmu yang gagal.</p>
          <p>(c) <strong>Biaya satu faktor:</strong> Rp800 M modal tambahan. Dengan cost of capital 12% → <strong>Rp96 M/tahun</strong> biaya tahunan — untuk <em>satu faktor yang tidak dimodelkan</em>. Investasi memodelkannya (beberapa analis × beberapa bulan) tidak ada apa-apanya dibanding ini. <strong>Kualitas model = uang.</strong></p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Inovasi UTAMA Basel 2.5 dibanding Basel I/II untuk risiko pasar?"
        options={[
          "Menurunkan modal",
          "Stressed VaR (VaR dari periode krisis) + IRC — memaksa modal tahan krisis, bukan cuma masa tenang",
          "Menghapus VaR",
          "Melarang derivatif",
        ]}
        correct={1}
        explanation="Benar. Pelajaran 2008: VaR dari data tenang = modal menyusut sebelum krisis. Stressed VaR mengunci periode stres sebagai jangkar modal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa FRTB memilih ES 97,5% (bukan VaR 99%)?"
        options={[
          "Agar modal turun",
          "ES koheren + menangkap tail risk; 97,5% dikalibrasi agar ≈ VaR 99% untuk normal — tapi lebih besar untuk ekor tebal (menghukum tail risk diam-diam)",
          "VaR terlalu sulit",
          "Supaya terlihat modern",
        ]}
        correct={1}
        explanation="Benar. Pilihan 97,5% bukan acak — kalibrasi cerdas: tidak menggegerkan modal agregat, tapi mengubah INSENTIF terhadap tail risk."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Desk gagal PLA (Spearman 0,62) tapi backtest hijau. Konsekuensi FRTB?"
        options={[
          "Tidak apa-apa — backtest yang penting",
          "Desk ditendang dari IMA kembali ke SBM (modal naik) — PLA adalah ujian kelulusan yang setara dengan backtest",
          "Cukup perbaiki tahun depan",
          "Denda kecil",
        ]}
        correct={1}
        explanation="Benar. FRTB: dua ujian, dua-duanya wajib lolos PER DESK. PLA gagal = model tidak memahami P&L = tidak layak untuk modal internal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Faktor risiko dengan hanya 10 harga real per tahun. Perlakuan FRTB?"
        options={[
          "Boleh dimodelkan seperti biasa",
          "NMRF — tidak memenuhi uji 24 observasi → kena stress charge terpisah TANPA diversifikasi (sengaja mahal)",
          "Diabaikan",
          "Dilarang diperdagangkan",
        ]}
        correct={1}
        explanation="Benar. NMRF = 'bayar mahal untuk data buruk'. Tanpa diversifikasi antar NMRF — hukuman berlapis untuk mendorong perbaikan data/pengurangan eksposur."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dalam SBM, komponen 'curvature' mengukur?"
        options={[
          "Kelengkungan kurva yield",
          "Risiko non-linear (orde-2, versi regulator dari gamma/convexity) — pelajaran dari kegagalan VaR linear",
          "Biaya transaksi",
          "Risiko operasional",
        ]}
        correct={1}
        explanation="Benar. Regulator MEMAKSA pengukuran orde-2 di pendekatan standar — pengakuan resmi bahwa risiko non-linear tidak boleh diabaikan (lihat MR4/MR11)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Izin IMA diberikan per apa — dan mengapa itu penting?"
        options={[
          "Per bank — lebih sederhana",
          "Per trading desk — desk yang modelnya buruk tidak bisa 'bersembunyi' di balik bank yang besar; insentif kualitas per unit bisnis",
          "Per negara",
          "Per trader",
        ]}
        correct={1}
        explanation="Benar. Granularitas per desk = akuntabilitas. Desk dengan model jelek kembali ke SBM (mahal) sementara desk bagus tetap di IMA — insentif tepat sasaran."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Basel 2.5:</strong> Stressed VaR + IRC — modal harus tahan krisis, bukan cuma masa tenang.</li>
          <li><strong>FRTB:</strong> boundary ketat, VaR → <strong>ES 97,5%</strong>, <strong>liquidity horizon</strong> (10–120 hari), izin <strong>per desk</strong>.</li>
          <li><strong>SBM:</strong> berbasis sensitivitas (delta/vega/curvature) + DRC + RRAO; korelasi dari regulator.</li>
          <li><strong>IMA:</strong> ES internal + multiplier + NMRF + DRC; lolos <strong>backtest + PLA</strong> (Spearman &amp; KS).</li>
          <li><strong>NMRF:</strong> &lt; 24 harga real/tahun → stress charge tanpa diversifikasi — sengaja mahal.</li>
          <li>Regulasi = <strong>arsitektur insentif</strong>: model bagus didiskon, data buruk &amp; illiquid dihukum.</li>
          <li>Kualitas model = uang (contoh: satu faktor hilang = Rp800 M modal).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr15-model-stokastik" className="btn btn-secondary btn-sm">← MR15</Link>
        <Link href="/learn/mr17-limit-laporan" className="btn btn-primary btn-sm">Next: MR17 →</Link>
      </div>
    </div>
  );
}
