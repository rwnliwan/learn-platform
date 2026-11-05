"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd9UjiDiagnostikPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd9TradeData = [{"x": ["Sens 99% / Spes 70%", "Sens 90% / Spes 90%", "Sens 70% / Spes 99%"], "y": [99, 90, 70], "type": "bar", "name": "Sensitivitas", "marker": {"color": "#2a7de1"}, "text": ["99%", "90%", "70%"], "textposition": "outside"}, {"x": ["Sens 99% / Spes 70%", "Sens 90% / Spes 90%", "Sens 70% / Spes 99%"], "y": [70, 90, 99], "type": "bar", "name": "Spesifisitas", "marker": {"color": "#e8a838"}, "text": ["70%", "90%", "99%"], "textposition": "outside"}];
  const hd9TradeDataLayout = {"barmode": "group", "xaxis": {"title": "Pilihan threshold"}, "yaxis": {"title": "%", "range": [0, 115]}, "showlegend": true};

  const lab1Code = "sens, spes = 0.99, 0.99\nprint(f\"{'prevalensi':>10} {'PPV':>7} {'makna':>40}\")\nfor p in [0.5, 0.2, 0.05, 0.01, 0.001]:\n    ppv = (sens*p)/(sens*p + (1-spes)*(1-p))\n    fp_per_tp = (1-spes)*(1-p)/(sens*p)\n    print(f'{p:>9.1%} {ppv:>6.1%}  {fp_per_tp:>5.1f} positif palsu per 1 benar')\nprint()\nprint('Tes TIDAK berubah. Yang berubah: seberapa langka penyakitnya.')\nprint('Skrining massal penyakit langka -> banjir false positive.')";

  const lab2Code = "# (skor, sakit? 1/0)\ndata = [(0.95,1),(0.85,1),(0.75,0),(0.70,1),(0.60,0),\n        (0.55,1),(0.45,0),(0.30,1),(0.20,0),(0.10,0)]\nn_sakit = sum(s for _, s in data); n_sehat = len(data)-n_sakit\ntitik = []\nfor thr in [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0]:\n    tp = sum(1 for skor, s in data if s == 1 and skor >= thr)\n    fp = sum(1 for skor, s in data if s == 0 and skor >= thr)\n    sens = tp/n_sakit; fpr = fp/n_sehat\n    titik.append((fpr, sens))\n    print(f'threshold {thr:.1f}: sens={sens:.0%}  1-spes={fpr:.0%}')\n# AUC via trapesium pada titik terurut\ntitik.sort()\nauc = sum((x2-x1)*(y1+y2)/2 for (x1,y1),(x2,y2) in zip(titik, titik[1:]))\nprint(f'\\nAUC = {auc:.2f}')";

  const hd9PpvData = [{"x": ["0,1% (skrining massal)", "5% (klinik umum)", "20% (rujukan)", "40% (musim wabah)"], "y": [9, 50, 96, 99], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["9%", "50%", "96%", "99%"], "textposition": "outside"}];
  const hd9PpvDataLayout = {"xaxis": {"title": "Setting (prevalensi)"}, "yaxis": {"title": "PPV (%)", "range": [0, 115]}, "showlegend": false};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD9 &mdash; Health Data Scientist</span>
        <h1 className="display-title">Sensitivitas, Spesifisitas, ROC:<br />Seberapa Bagus Tes Diagnostik</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Tes 99% Akurat yang Menyesatkan</a></li>
          <li><a href="#sens">Sensitivitas &amp; Spesifisitas — Si Penangkap dan Si Penjaga</a></li>
          <li><a href="#ppv">PPV/NPV: Base Rate Mengubah Segalanya</a></li>
          <li><a href="#roc">ROC, AUC &amp; Likelihood Ratio</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: PPV vs Prevalensi</a></li>
          <li><a href="#lab2">🔬 Lab 2: Trade-off Sens-Spes &amp; Kurva ROC</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Threshold &amp; Harga Kesalahan</a></li>
          <li><a href="#wawasan">🧠 Wawasan: AUC Bukan Segalanya</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Tes Berurutan HIV &amp; TB</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Dari Tabel 2×2 ke Keputusan Skrining</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung <strong>sensitivitas, spesifisitas, PPV, NPV, LR+, LR−</strong> dari tabel 2×2.</li>
          <li>Menjelaskan mengapa <strong>PPV anjlok saat prevalensi rendah</strong> walau tesnya “akurat”.</li>
          <li>Membaca <strong>kurva ROC/AUC</strong> dan memilih threshold sesuai konteks klinis.</li>
          <li>Memilih metrik yang tepat untuk 4 skenario (skrining vs konfirmasi).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Tes 99% Akurat yang Menyesatkan</h2>
      <div className="story">
        <p>Sebuah startup menjual tes kanker darah: “<strong>99% akurat!</strong>” (sensitivitas 99%, spesifisitas 99%). Seorang pejabat tertarik untuk skrining massal 1 juta penduduk, prevalensi kanker 0,1% (1.000 penderita). Hitungannya: dari 1.000 penderita, 990 terdeteksi. Dari 999.000 sehat, 1% = <strong>9.990 positif palsu</strong>. Setiap hasil positif, peluang benar-benar kanker hanya 990/(990+9.990) = <strong>9%</strong>.</p>
      <p>“99% akurat” menghasilkan 10 orang panik untuk setiap 1 yang benar-benar sakit. Inilah base rate fallacy — dan alasan kenapa evaluasi tes diagnostik adalah salah satu skill paling praktis di lesson ini.</p>
      <p><strong>Twist-nya:</strong> tesnya <em>benar-benar</em> 99% akurat — dan tetap <em>benar-benar</em> menyesatkan. Tidak ada yang berbohong: sensitivitas 99%, spesifisitas 99%, semua terverifikasi lab. Yang menipu adalah <strong>konteksnya</strong>: akurasi adalah sifat <em>tes</em>, tapi kepercayaan adalah sifat <em>tes + populasi</em>. Di populasi langka, 99% akurat berarti 91% hasil positif adalah alarm palsu. <strong>Angka yang sama, populasi yang beda, kebenaran yang beda</strong> — dan lesson ini mengajarkanmu menghitung kebenaran yang kedua.</p>
      </div>

      <h2 id="sens">Sensitivitas &amp; Spesifisitas — Si Penangkap dan Si Penjaga</h2>
      <p><strong>Definisi.</strong> <strong>Sensitivitas</strong> = peluang tes positif bila benar-benar sakit (penangkap: jangan sampai lolos). <strong>Spesifisitas</strong> = peluang tes negatif bila benar-benar sehat (penjaga: jangan tuduh sembarangan). Keduanya <strong>sifat tes</strong>, tidak tergantung prevalensi.</p>
      <Tex math={String.raw`\text{Sens} = \frac{TP}{TP+FN} \quad ; \quad \text{Spes} = \frac{TN}{TN+FP}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`TP`} />: true positive: sakit dan tes positif</li>
          <li><Tex math={String.raw`FN`} />: false negative: sakit tapi tes negatif (yang lolos!)</li>
          <li><Tex math={String.raw`TN`} />: true negative: sehat dan tes negatif</li>
          <li><Tex math={String.raw`FP`} />: false positive: sehat tapi tes positif (tuduhan palsu)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Sens 99% = dari 100 orang sakit, 99 tertangkap, 1 lolos. Spes 99% = dari 100 sehat, 99 dibebaskan, 1 dituduh. Keduanya menjawab “seberapa bagus tesnya” — bukan “seberapa percaya hasil tes saya” (itu PPV/NPV).</p>
      <details className="worked">
        <summary>📐 Contoh: rapid test DBD</summary>
        <p>200 pasien demam: 100 benar DBD (NS1+PCR), 100 bukan.<br />Rapid: TP=90, FN=10, TN=85, FP=15.<br /><strong>Sens</strong> = 90/100 = <strong>90%</strong> (10% kasus lolos).<br /><strong>Spes</strong> = 85/100 = <strong>85%</strong> (15% sehat dituduh).<br />Untuk DBD yang berbahaya bila terlambat, sens 90% masih menyisakan 10% lolos — perlu tes konfirmasi.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Sensitivitas itu jaring ikan: makin rapat, makin sedikit ikan lolos — tapi makin banyak sampah ikut terjaring. Spesifisitas itu satpam: makin galak, makin sedikit penyusup lolos — tapi makin banyak tamu sah ditahan.</p>
      <p><strong>Kapan memakai:</strong> Skrining penyakit berbahaya/menular → utamakan sensitivitas (jangan sampai lolos). Tes konfirmasi sebelum terapi berisiko → utamakan spesifisitas (jangan tuduh sembarangan).</p>

      <PlotlyChart
        data={hd9TradeData}
        title="Trade-off Sensitivitas vs Spesifisitas (3 Threshold)"
        layout={hd9TradeDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Tiga pilihan threshold. Biru = sensitivitas, kuning = spesifisitas. Perhatikan: saat satu naik, yang lain turun.</p>
        <p><strong>Interpretasi:</strong> Tidak ada threshold yang memberi 99% keduanya — menaikkan sensitivitas (tangkap semua) selalu dibayar dengan spesifisitas (banyak tuduhan palsu). Memilih threshold = memilih <em>jenis kesalahan mana yang lebih bisa diterima</em> secara klinis.</p>
      </div>

      <h2 id="ppv">PPV/NPV: Base Rate Mengubah Segalanya</h2>
      <p><strong>Definisi.</strong> <strong>PPV</strong> = peluang benar-benar sakit bila tes positif. <strong>NPV</strong> = peluang benar-benar sehat bila tes negatif. Keduanya <strong>tergantung prevalensi</strong> — inilah yang dirasakan pasien.</p>
      <Tex math={String.raw`PPV = \frac{\text{Sens} \times P}{\text{Sens} \times P + (1-\text{Spes})(1-P)}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`P`} />: prevalensi (base rate) pada populasi yang dites</li>
          <li><Tex math={String.raw`\text{Sens}, \text{Spes}`} />: sifat tes (tetap)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Rumus Bayes ini menjelaskan cerita pembuka: Sens=Spes=99% tapi P=0,1% → PPV hanya 9%. Tes yang sama pada populasi berisiko tinggi (P=20%) → PPV 96%. <strong>Tes tidak berubah; audiensnya yang berubah.</strong></p>
      <details className="worked">
        <summary>📐 Contoh: PPV rapid DBD di dua setting</summary>
        <p>Sens 90%, Spes 85%.<br /><strong>Musim DBD</strong> (prevalensi 40%): PPV = (0,9×0,4)/(0,9×0,4 + 0,15×0,6) = 0,36/0,45 = <strong>80%</strong>.<br /><strong>Di luar musim</strong> (prevalensi 5%): PPV = (0,9×0,05)/(0,9×0,05 + 0,15×0,95) = 0,045/0,1875 = <strong>24%</strong>.<br />Tes yang sama, hasil positif yang sama — kepercayaan 80% vs 24%. Konteks adalah segalanya.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> PPV itu seperti nilai gosip: kebenarannya tergantung seberapa umum rumor itu beredar. Di musim DBD, “positif” kemungkinan besar benar; di luar musim, kemungkinan besar false alarm.</p>
      <p><strong>Kapan memakai:</strong> Komunikasi hasil ke pasien/klinisi: selalu pakai PPV/NPV (bukan sens/spes). Desain program skrining: hitung PPV pada prevalensi target dulu.</p>
      <div className="callout callout-warning"><strong>Mnemonic legendaris:</strong> <strong>SnNout</strong> — tes Sensitif tinggi, hasil Negatif menyingkirkan penyakit (rule OUT). <strong>SpPin</strong> — tes Spesifik tinggi, hasil Positif memastikan penyakit (rule IN).</div>

      <h2 id="roc">ROC, AUC &amp; Likelihood Ratio — Si Kurva Lengkap</h2>
      <p><strong>Definisi.</strong> <strong>Kurva ROC</strong>: plot sensitivitas vs (1−spesifisitas) di semua threshold. <strong>AUC</strong>: luas di bawahnya (0,5 = tebak koin, 1,0 = sempurna). <strong>LR+</strong> = Sens/(1−Spes): seberapa kali lipat hasil positif menaikkan odds penyakit.</p>
      <Tex math={String.raw`LR^+ = \frac{\text{Sens}}{1-\text{Spes}} \quad ; \quad \text{odds post} = LR \times \text{odds pre}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`LR^+`} />: likelihood ratio positif: kekuatan bukti dari hasil positif</li>
          <li><Tex math={String.raw`\text{odds pre}`} />: odds penyakit sebelum tes (dari prevalensi/klinik)</li>
          <li><Tex math={String.raw`\text{odds post}`} />: odds sesudah melihat hasil tes</li>
      </ul>
      <p><strong>Interpretasi:</strong> LR+ = 10: hasil positif membuat penyakit 10x lebih mungkin (odds). AUC 0,85 = jika ambil 1 sakit + 1 sehat acak, 85% skor si sakit lebih tinggi. AUC merangkum <em>diskriminasi di semua threshold</em>.</p>
      <details className="worked">
        <summary>📐 Contoh: memilih threshold dari ROC</summary>
        <p>Skor AI kanker kulit: threshold A → Sens 95%, Spes 80% (LR+ = 4,75). Threshold B → Sens 80%, Spes 95% (LR+ = 16).<br /><strong>Skrining</strong> (jangan sampai lolos): pilih A.<br /><strong>Konfirmasi sebelum operasi</strong> (jangan tuduh sembarangan): pilih B.<br />AUC keduanya sama (0,93) — AUC tidak memilihkan threshold untukmu; konteks klinislah yang memilih.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> ROC itu peta seluruh medan perang threshold; AUC itu nilai rapor keseluruhan. Tapi rapor tidak memenangkan pertempuran — komandan (konteks klinis) yang memilih posisi (threshold).</p>
      <p><strong>Kapan memakai:</strong> Bandingkan model/skor diagnostik → AUC. Terapkan ke pasien individual → LR + odds pre (Fagan nomogram). Pilih threshold → timbang biaya FN vs FP.</p>

      <h2 id="pendalaman">🔍 Pendalaman: Dari Tabel 2×2 ke Keputusan Skrining</h2>
      <details className="worked">
        <summary>📐 Worked example: skrining massal vs skrining berisiko (klik untuk buka)</summary>
        <p>Tes kanker darah: sensitivitas 99%, spesifisitas 99%. Dua skenario populasi, masing-masing 100.000 orang.</p>
        <p><strong>Langkah 1 — Skrining massal (prevalensi 0,1% = 100 penderita).</strong> True positive = 99. False positive = 1% × 99.900 = 999. PPV = 99/(99+999) = <strong>9,0%</strong>. Setiap 11 hasil positif, 10 alarm palsu → biaya follow-up (biopsi, kecemasan) raksasa.</p>
        <p><strong>Langkah 2 — Skrining kelompok berisiko (prevalensi 10% = 10.000 penderita).</strong> True positive = 9.900. False positive = 1% × 90.000 = 900. PPV = 9.900/(9.900+900) = <strong>91,7%</strong>. Tes yang <em>sama persis</em> kini bisa dipercaya.</p>
        <p><strong>Langkah 3 — Likelihood ratio.</strong> LR+ = sens/(1−spes) = 0,99/0,01 = 99. Artinya hasil positif membuat penyakit <strong>99× lebih mungkin</strong> dari dugaan awal (pre-test odds). LR mengubah <em>dugaan dokter sebelum tes</em> menjadi <em>keyakinan sesudah tes</em> — inilah cara klinisi berpikir, bukan via PPV tabel.</p>
        <p><strong>Langkah 4 — Keputusan kebijakan.</strong> Skrining massal dengan tes ini: <strong>tolak</strong> (PPV 9% = mesin pencetak kepanikan). Skrining terarah ke kelompok berisiko: <strong>pertimbangkan</strong> (PPV 92%). Tes tidak pernah “bagus” atau “jelek” sendirian — ia bagus <em>untuk populasi tertentu</em>.</p>
        <p><strong>Pelajaran:</strong> sebelum membeli alat tes, hitung PPV pada <em>prevalensi populasimu</em> — bukan prevalensi brosur vendor (yang selalu memakai populasi berisiko tinggi agar angkanya cantik).</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — trade-off sens/spes adalah pilihan moral, bukan teknis:</strong> Menggeser threshold tes menaikkan sensitivitas (menangkap lebih banyak yang sakit) <em>dengan mengorbankan</em> spesifisitas (lebih banyak alarm palsu). Tidak ada titik “optimal” universal: untuk <strong>skrining kanker</strong>, lewatkan satu kasus = kematian → prioritaskan sensitivitas, terima alarm palsu. Untuk <strong>tes konfirmasi sebelum kemoterapi toksik</strong>, alarm palsu = meracuni orang sehat → prioritaskan spesifisitas. Kurva ROC memetakan semua pilihan; <strong>nilai klinis</strong> memilih titiknya. Analis yang menyerahkan pilihan threshold ke “Youden index” tanpa bertanya konsekuensi klinisnya sedang mendelegasikan etika ke rumus.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — rapid test massal dan “positif palsu”:</strong> Pelajaran PPV ini nyata di Indonesia saat skrining massal COVID-19 dengan rapid antigen: pada populasi prevalensi rendah (mis. skrining rutin karyawan sehat, prevalensi 1%), PPV rapid test (~sens 80%, spes 97%) hanya sekitar <strong>21%</strong> — 4 dari 5 “positif” adalah palsu, memicu isolasi dan kepanikan yang tidak perlu. Kebijakan yang benar (dan akhirnya dipakai): <strong>konfirmasi PCR</strong> untuk setiap positif rapid pada populasi rendah-risiko — alias tes berurutan (serial testing) untuk menaikkan spesifisitas gabungan. Rumusnya sederhana: spesifisitas serial ≈ 1 − (1−sp1)(1−sp2).</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: AUC Bukan Segalanya (Kadang Menipu)</h2>
      <p>AUC 0,95 terdengar hebat. Tapi tiga keterbatasannya membuat analis senior tidak pernah menilai tes dari AUC saja.</p>
      <p><strong>1. AUC merata-ratakan wilayah yang tidak relevan.</strong> AUC = rata-rata sensitivitas di <em>seluruh</em> spesifisitas (0–100%). Tapi klinik hanya peduli <strong>wilayah operasional</strong>: untuk skrining, spesifisitas 90–100% (alarm palsu harus sedikit); untuk triase, sensitivitas 90–100%. Tes A (AUC 0,92) bisa <strong>kalah</strong> dari tes B (AUC 0,88) <em>di wilayah yang dipakai</em> — karena keunggulan A ada di wilayah ekstrem yang tak terpakai. Solusi: <strong>partial AUC</strong> (pAUC) pada rentang relevan, atau langsung bandingkan sens pada spesifisitas operasional yang ditetapkan.</p>
      <p><strong>2. Pada prevalensi rendah, pakai kurva PR — bukan ROC.</strong> ROC memakai spesifisitas (TN/(TN+FP)) — dengan 99.000 orang sehat, FP=999 masih memberi spesifisitas 99% yang “terlihat bagus”. Kurva <strong>Precision-Recall</strong> memakai presisi (= PPV): 9% — <strong>langsung menunjukkan masalahnya</strong>. Aturan: prevalensi &lt; 10% → laporkan PR-AUC berdampingan dengan ROC-AUC; jika keduanya jauh beda, percayai PR.</p>
      <p><strong>3. AUC tidak tahu harga kesalahan.</strong> Dua tes dengan AUC identik 0,90 bisa punya <strong>profil error beda</strong>: satu unggul di sensitivitas tinggi (cocok skrining), satu di spesifisitas tinggi (cocok konfirmasi). AUC menyamakan keduanya. Keputusan butuh <strong>titik operasional + harga</strong> (lihat studi kasus di atas), bukan satu angka ringkas.</p>
      <div className="callout">
        <p><strong>Checklist evaluasi tes diagnostik:</strong> ① Sens &amp; spes pada <strong>threshold operasional</strong> (bukan cuma AUC). ② PPV/NPV pada <strong>prevalensi populasimu</strong>. ③ Kurva PR jika prevalensi rendah. ④ Harga FN vs FP eksplisit. — Empat ini = evaluasi lengkap; AUC saja = brosur.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Tes dengan akurasi 99% pasti bisa dipakai skrining massal&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Akurasi (TP+TN)/total didominasi mayoritas sehat saat prevalensi rendah — 99% bisa berarti PPV 9% (cerita pembuka). Untuk skrining, hitung PPV pada prevalensi target dan biaya tindak lanjut false positive. Akurasi tanpa konteks prevalensi adalah angka hiburan.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;AUC tinggi = tes siap dipakai klinis&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> AUC mengukur diskriminasi, bukan utilitas klinis. Tes dengan AUC 0,9 bisa tidak berguna bila: threshold operasionalnya buruk, tidak ada terapi untuk yang terdeteksi, atau biaya false positive menghancurkan (lihat decision curve analysis — HD12). Validasi klinis &gt; angka diskriminasi.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Sensitivitas dan spesifisitas berubah-ubah tergantung rumah sakit&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Keduanya sifat tes (dengan catatan spektrum pasien mirip). Yang berubah antar setting adalah PPV/NPV — karena prevalensi beda. Kalau sens/spes terlihat beda antar RS, curigai spectrum bias (populasi terlalu beda) atau verification bias.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Memilih Threshold dengan Matematika Keputusan</h2>
      <details className="worked">
        <summary>📐 Worked example: threshold skor sepsis — tangkap semua vs hemat alarm (klik untuk buka)</summary>
        <p>Skor sepsis 0–100 untuk 1.000 pasien IGD; prevalensi sepsis 15% (150 kasus). Dua kandidat threshold:</p>
        <p><strong>Langkah 1 — Tabel konsekuensi tiap threshold.</strong> Threshold 30 (longgar): sens 95%, spes 60% → TP=143, FN=7, FP=340, TN=510. Threshold 60 (ketat): sens 70%, spes 90% → TP=105, FN=45, FP=85, TN=765.</p>
        <p><strong>Langkah 2 — Beri harga pada tiap sel.</strong> Tanya klinisi: “1 kasus sepsis terlewat (FN) setara berapa alarm palsu (FP)?” Jawaban: <strong>1 FN ≈ 20 FP</strong> (sepsis terlewat bisa mati; alarm palsu = 15 menit kerja perawat). Maka biaya total = 20×FN + 1×FP.</p>
        <p><strong>Langkah 3 — Hitung.</strong> Threshold 30: 20×7 + 340 = <strong>480</strong>. Threshold 60: 20×45 + 85 = <strong>985</strong>. <strong>Threshold longgar menang telak</strong> — walau “spesifisitasnya jelek” (60%).</p>
        <p><strong>Langkah 4 — Uji sensitivitas harga.</strong> Jika perawat protes “alarm palsu membuat kami abaikan semua” (alarm fatigue — biaya FP naik 5×): threshold 30 → 20×7 + 5×340 = 1.840; threshold 60 → 20×45 + 5×85 = 1.325 → <strong>kini threshold ketat menang</strong>. Keputusan <strong>bergantung harga yang hanya bisa ditentukan manusia</strong>, bukan ROC.</p>
        <p><strong>Langkah 5 — Sampaikan sebagai trade-off eksplisit.</strong> “Threshold 30: 7 kasus terlewat, 340 alarm palsu per 1.000 pasien. Threshold 60: 45 terlewat, 85 palsu. Pilih berdasarkan <strong>berapa nyawa vs berapa beban perawat</strong> yang bisa kita terima.” — Inilah analisis keputusan: bukan “threshold optimal”, melainkan <strong>pilihan sadar dengan harga terbuka</strong>.</p>
        <p><strong>Pelajaran:</strong> “Youden index” (maks sens+spes) mengasumsikan FN = FP — asumsi yang <strong>hampir tidak pernah benar</strong> di klinik. Selalu tanya harganya.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Kurva ROC menunjukkan <strong>semua</strong> trade-off yang tersedia; <strong>harga klinis</strong> memilih titiknya. Analis menyajikan kurva + 2–3 titik kandidat dengan konsekuensinya; <strong>dokter</strong> memilih. Jangan pernah serahkan pilihan threshold ke rumus buta.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Hafalkan <strong>SnNout/SpPin</strong> — dua kata ini menjawab 80% pertanyaan ujian dan visite tentang interpretasi tes.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Setiap kali vendor mengklaim akurasi, minta <strong>tabel 2×2 + prevalensi studi</strong>. Tanpa itu, klaim tidak bisa dinilai — dan penolakan memberi data adalah jawaban tersendiri.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk AI diagnostik: tanyakan <strong>threshold operasionalnya</strong>, bukan AUC-nya. Model dengan AUC 0,95 yang dioperasikan di threshold salah bisa lebih buruk dari model AUC 0,85 yang di-threshold benar.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: PPV Anjlok Saat Prevalensi Rendah</h2>
      <p>Hitung PPV untuk Sens=Spes=99% pada berbagai prevalensi. Saksikan sendiri base rate fallacy: tes yang sama, kepercayaan beda langit-bumi.</p>
      <PyodideLab
        title="🔬 Lab 1: PPV Anjlok Saat Prevalensi Rendah"
        hint="Cari prevalensi di mana PPV tepat 50% (hasil positif = lempar koin). Itulah titik di mana tes “99% akurat” menjadi tidak informatif untuk skrining."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Kurva ROC dari Skor (Manual)</h2>
      <p>Diberikan skor 10 pasien (5 sakit, 5 sehat), hitung Sens/Spes di tiap threshold, lalu estimasi AUC dengan aturan trapesium. Rasakan trade-off-nya.</p>
      <PyodideLab
        title="🔬 Lab 2: Kurva ROC dari Skor (Manual)"
        hint="Ubah skor pasien sehat #3 dari 0.75 menjadi 0.35 (kurangi overlap). Lihat AUC naik — itulah arti diskriminasi yang lebih baik."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Algoritma Tes Berurutan HIV &amp; TB di Indonesia</h2>
      <p>Indonesia memakai <strong>strategi tes berurutan (serial testing)</strong> untuk HIV — dan ini adalah penerapan langsung teori PPV lesson ini.</p>
      <p><strong>Algoritma 3 tes HIV (Kemenkes):</strong> Tes 1 (sensitivitas sangat tinggi, murah — mis. rapid): jika <strong>non-reaktif</strong> → selesai, negatif. Jika <strong>reaktif</strong> → lanjut Tes 2 (spesifisitas tinggi, prinsip berbeda): jika non-reaktif → negatif. Jika reaktif → Tes 3 (tie-breaker). <strong>Kenapa berurutan, bukan paralel?</strong> Matematikanya: pada prevalensi rendah (mis. populasi umum 0,3%), PPV tes tunggal dengan spes 98% hanya ~13% — <strong>7 dari 8 “positif” palsu</strong>. Tes berurutan: hanya yang reaktif di tes 1 yang lanjut — prevalensi <em>di antara yang dites kedua</em> kini jauh lebih tinggi → PPV gabungan &gt;99%. <strong>Urutan tes adalah cara “memanipulasi” prevalensi secara sah</strong> — dengan menyaring populasi dulu memakai tes murah.</p>
      <p><strong>Aturan desain algoritma:</strong> tes <strong>pertama</strong> = sensitivitas maksimal (jangan sampai ada yang lolos; alarm palsu tidak apa — masih ada tes berikut). Tes <strong>berikutnya</strong> = spesifisitas maksimal (pastikan yang positif benar-benar positif). <strong>Terbalik urutannya = bencana</strong>: tes spesifik dulu → banyak kasus terlewat di langkah 1, tidak pernah dites lagi.</p>
      <p><strong>Contoh TB:</strong> skrining gejala/batuk (sensitif, murah) → TCM/tes molekuler (spesifik, mahal) hanya untuk yang terduga. Inilah kenapa “tes mahal untuk semua orang” <strong>bukan</strong> kebijakan yang baik — algoritma berurutan memberi <strong>hasil setara dengan biaya sepersekian</strong>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kebijakan:</strong> Setiap program skrining nasional (HIV, TB, kanker serviks, thalassemia) pada dasarnya adalah <strong>masalah optimasi PPV-per-rupiah</strong>. Analis yang bisa menghitung “PPV gabungan algoritma A vs B” dan “biaya per kasus benar ditemukan” adalah <strong>perancang kebijakan</strong>, bukan sekadar penghitung.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Skrining (jangan sampai lolos) → Sensitivitas tinggi</h3>
        <p><strong>Kondisi:</strong> Penyakit berbahaya/menular; lolos = bencana; false positive bisa ditindaklanjuti murah.</p>
        <p><strong>Kenapa:</strong> FN mahal (kematian/penularan), FP murah (tes konfirmasi).</p>
        <p><strong>Contoh nyata:</strong> Skrining TB pada kontak erat; skrining HIV pada donor darah.</p>
      </div>
      <div className="decision-card">
        <h3>2. Konfirmasi (jangan tuduh sembarangan) → Spesifisitas tinggi</h3>
        <p><strong>Kondisi:</strong> Hasil positif memicu terapi berisiko/mahal atau stigma.</p>
      <PlotlyChart
        data={hd9PpvData}
        title="PPV Tes 99/99% pada Berbagai Prevalensi"
        layout={hd9PpvDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Empat setting dengan prevalensi naik. Tinggi batang = PPV: peluang benar-benar sakit bila tes positif.</p>
        <p><strong>Interpretasi:</strong> Tes yang sama persis: di skrining massal hanya 9% hasil positif yang benar, di klinik rujukan 96%. Inilah kenapa tes bagus bisa menjadi program buruk — PPV adalah sifat <em>tes + populasi</em>, bukan tes saja.</p>
      </div>
        <p><strong>Kenapa:</strong> FP mahal (operasi sia-sia, stigma HIV).</p>
        <p><strong>Contoh nyata:</strong> Western blot konfirmasi HIV; biopsi sebelum kemoterapi.</p>
      </div>
      <div className="decision-card">
        <h3>3. Bandingkan dua skor/AI → AUC + decision curve</h3>
        <p><strong>Kondisi:</strong> Memilih model diagnostik terbaik.</p>
        <p><strong>Kenapa:</strong> AUC untuk diskriminasi; decision curve untuk utilitas klinis (net benefit).</p>
        <p><strong>Contoh nyata:</strong> Skor AI vs skor klinis untuk prediksi sepsis.</p>
      </div>
      <div className="decision-card">
        <h3>4. Terapkan ke pasien individual → LR + pre-test odds</h3>
        <p><strong>Kondisi:</strong> Dokter menghadapi satu pasien dengan probabilitas awal tertentu.</p>
        <p><strong>Kenapa:</strong> LR menerjemahkan hasil tes menjadi update odds yang personal.</p>
        <p><strong>Contoh nyata:</strong> D-dimer positif pada pasien dengan skor Wells rendah vs tinggi.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Sens/spes = sifat tes; PPV/NPV = sifat tes + populasi.</li>
          <li>SnNout (rule out), SpPin (rule in).</li>
          <li>Skrining → sens; konfirmasi → spes.</li>
          <li>Minta tabel 2×2 + prevalensi sebelum percaya klaim.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: AI Kanker Kulit: AUC 0,95, Siap Deploy?</h2>
      <div className="callout">
        <p>Startup mengklaim AI deteksi melanoma: <strong>AUC 0,95</strong> pada 10.000 foto. Dinkes tertarik untuk skrining di puskesmas. Kamu diminta due diligence.</p>
      <p>Detail: dataset 50% melanoma (prevalensi artifisial!), foto dari klinik kulit tersier (kasus jelas), threshold operasional tidak dilaporkan, belum ada uji prospektif.</p>
        <p><strong>Pertanyaan:</strong> Sebutkan minimal 4 masalah dan syarat sebelum deploy.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(1) Prevalensi 50% artifisial → PPV studi tidak berlaku untuk puskesmas (prevalensi &lt;1%); hitung ulang PPV. (2) Spectrum bias: foto kasus jelas dari tersier → performa anjlok pada lesi samar di puskesmas. (3) Tanpa threshold operasional, AUC 0,95 tidak memberi tahu sens/spes yang dipakai. (4) Tanpa uji prospektif: belum tahu alur kerja, waktu baca, dan efek pada rujukan. Syarat: validasi eksternal prospektif di puskesmas, laporkan sens/spes pada threshold yang dipilih + PPV/NPV lokal, decision curve analysis, dan monitoring drift pasca-deploy (HD12).</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Tes: Sens 99%, Spes 99%, prevalensi 0,1%. PPV sekitar…"
        options={["99%",
          "50%",
          "9%",
          "0,1%"]}
        correct={2}
        explanation="Benar: (0,99×0,001)/(0,99×0,001+0,01×0,999) ≈ 9%. “99% akurat” → 9% kepercayaan. Base rate fallacy."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Untuk skrining donor darah (HIV), yang diutamakan?"
        options={["Spesifisitas",
          "Sensitivitas",
          "PPV",
          "Akurasi"]}
        correct={1}
        explanation="Benar (SnNout): jangan sampai ada yang lolos. False positive ditangani dengan tes konfirmasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Sebelum kemoterapi berdasarkan hasil tes, yang diutamakan?"
        options={["Sensitivitas",
          "Spesifisitas",
          "NPV",
          "Kecepatan"]}
        correct={1}
        explanation="Benar (SpPin): jangan tuduh sembarangan — terapi berisiko butuh kepastian."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. LR+ = 10 artinya…"
        options={["Peluang sakit 10%",
          "Hasil positif membuat odds penyakit 10x lipat dari sebelum tes",
          "Tes 10x lebih mahal",
          "10% false positive"]}
        correct={1}
        explanation="Benar: odds post = LR × odds pre. LR menerjemahkan hasil tes ke update keyakinan personal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. AUC = 0,5 artinya model…"
        options={["Sempurna",
          "Setara tebak koin",
          "Buruk tapi berguna",
          "Tidak bisa dihitung"]}
        correct={1}
        explanation="Benar: diagonal ROC = tidak ada diskriminasi. AUC 1,0 = sempurna."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Dua tes punya AUC sama (0,9). Untuk skrining dipilih yang…"
        options={["Sensitivitas lebih tinggi pada threshold operasional",
          "Spesifisitas lebih tinggi",
          "Lebih murah selalu",
          "AUC tidak relevan"]}
        correct={0}
        explanation="Benar: AUC sama ≠ threshold sama. Konteks memilih titik di kurva ROC — skrining butuh sens tinggi."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Sens</strong> = TP/(TP+FN) — sifat tes. <strong>Spes</strong> = TN/(TN+FP) — sifat tes.</li>
          <li><strong>PPV/NPV</strong> = yang dirasakan pasien; tergantung prevalensi (Bayes).</li>
          <li><strong>SnNout</strong>: sens tinggi untuk rule out. <strong>SpPin</strong>: spes tinggi untuk rule in.</li>
          <li><strong>ROC/AUC</strong>: diskriminasi di semua threshold; threshold dipilih oleh konteks.</li>
          <li><strong>LR</strong>: update odds pre → post untuk pasien individual.</li>
          <li>Akurasi tanpa prevalensi = angka hiburan. Minta tabel 2×2.</li>
          <li>Validasi AI diagnostik: prospektif, populasi target, threshold operasional, decision curve.</li>
          <li>Fondasi untuk HD12 (evaluasi model klinis) dan HD14 (NLP ekstraksi).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd8-missing-data" className="btn btn-secondary btn-sm">← HD8</Link>
        <Link href="/learn/hd10-kausal-observasional" className="btn btn-primary btn-sm">HD10 →</Link>
      </div>
    </div>
  );
}
