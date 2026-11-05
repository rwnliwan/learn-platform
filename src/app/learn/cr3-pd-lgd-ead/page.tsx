"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr3Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const elWaterfallData = [
    {
      x: ["PD 2%", "× LGD 45%", "× EAD Rp 500 jt"],
      y: [0.02, 0.45, 500],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838", "#3aa655"] },
      text: ["2%", "45%", "Rp 500 jt"],
      textposition: "outside",
    },
  ];

  const elVsUlData = [
    {
      x: ["2019", "2020", "2021", "2022", "2023", "2024", "2025"],
      y: [12, 38, 15, 10, 9, 11, 10],
      type: "bar",
      name: "Kerugian aktual",
      marker: { color: "#94a3b8" },
    },
    {
      x: ["2019", "2020", "2021", "2022", "2023", "2024", "2025"],
      y: [12, 12, 12, 12, 12, 12, 12],
      type: "scatter",
      mode: "lines",
      name: "EL (ekspektasi)",
      line: { color: "#2a7de1", width: 3, dash: "dash" },
    },
  ];

  const capitalStackData = [
    {
      x: ["EL (cadangan)", "UL (modal)"],
      y: [12, 28],
      type: "bar",
      marker: { color: ["#e8a838", "#2a7de1"] },
      text: ["Rp 12 M (CKPN)", "Rp 28 M (Modal)"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Kalkulator EL — PD x LGD x EAD
# Ubah angka-angka di bawah, lalu jalankan.
pd  = 0.02    # 2% peluang gagal bayar setahun
lgd = 0.45    # 45% dari exposure hilang saat default
ead = 500     # juta Rp exposure saat default

el = pd * lgd * ead
print(f"PD  = {pd*100:.1f}%   (peluang macet)")
print(f"LGD = {lgd*100:.0f}%    (porsi yang hilang)")
print(f"EAD = Rp {ead} jt (exposure)")
print(f"EL  = {pd} x {lgd} x {ead} = Rp {el:.2f} jt")
print()
print("Coba 1: naikkan pd jadi 0.10 (nasabah berisiko). EL jadi?")
print("Coba 2: turunkan lgd jadi 0.20 (agunan bagus). EL jadi?")
print("Mana lebih ampuh menurunkan EL: PD turun separuh, atau LGD turun separuh?")
print("Jawabannya: SAMA — karena perkalian. Tapi biayanya beda!")`;

  const lab2Code = `# Lab 2: EL vs UL — ekspektasi vs kejutan
# Simulasi 7 tahun kerugian kredit (juta Rp). Jalankan berulang kali!
import random
random.seed(7)

el_tahunan = 12.0   # ekspektasi kerugian per tahun
print(f"{'Tahun':<6} {'Aktual':>8} {'vs EL':>10}")
total = 0
for th in range(2019, 2026):
    # tahun normal: sekitar EL; 2020 = krisis (lonjakan)
    if th == 2020:
        aktual = el_tahunan * random.uniform(2.5, 3.5)
    else:
        aktual = el_tahunan * random.uniform(0.7, 1.3)
    total += aktual
    print(f"{th:<6} {aktual:>7.1f}M {(aktual-el_tahunan):>+9.1f}M")
print("-" * 28)
print(f"Rata-rata aktual 7 thn: {total/7:.1f}M  (~ EL = {el_tahunan}M)")
print(f"Lonjakan 2020 vs EL   : {(total/7*0+38)-el_tahunan:.1f}M  <- ini yang ditutup MODAL, bukan cadangan")
print()
print("Pelajaran: cadangan (CKPN) menutup EL yang rutin;")
print("modal menutup 'kejutan' seperti 2020. Jalankan ulang dengan seed lain!")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR3 — Credit Risk Analyst</span>
        <h1 className="display-title">PD × LGD × EAD:<br />Tiga Angka Penentu Nasib Bank</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rp 4,5 Juta yang "Hilang" Setiap Tahun</a></li>
          <li><a href="#trio">Trio Maut: PD, LGD, EAD</a></li>
          <li><a href="#el">Expected Loss — Biaya Rutin Berbisnis Kredit</a></li>
          <li><a href="#ul">Unexpected Loss &amp; Modal — Bantal untuk Kejutan</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kalkulator EL</a></li>
          <li><a href="#lab2">🔬 Lab 2: EL vs UL — Ekspektasi vs Kejutan</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Tuas Mana yang Ditarik?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Dua Kredit, EL Sama, Risiko Beda</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan PD, LGD, EAD dengan bahasa sendiri dan menghitung Expected Loss (EL = PD × LGD × EAD).</li>
          <li>Membedakan Expected Loss (ditutup cadangan/CKPN) vs Unexpected Loss (ditutup modal) — serta konsekuensinya bagi laba bank.</li>
          <li>Mengidentifikasi tuas bisnis untuk menurunkan EL: seleksi (PD), agunan (LGD), limit (EAD).</li>
          <li>Menghitung EL portofolio sederhana dan menjelaskan mengapa dua kredit ber-EL sama bisa berisiko beda.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Rp 4,5 Juta yang "Hilang" Setiap Tahun</h2>
      <div className="story">
        <p>Bu Ani punya warung kelontong. Setiap tahun ia "mengikhlaskan" sekitar <strong>Rp 4,5 juta</strong> — uang bon tetangga yang tidak kembali. Ia tidak kaget, tidak panik. <em>"Sudah saya anggarkan,"</em> katanya. <em>"Namanya juga dagang."</em></p>
        <p>Tahun 2020, pandemi datang. Tiba-tiba Rp 30 juta bon macet sekaligus — tetangga-tetangga yang biasanya bayar ikut kesulitan. Anggaran Rp 4,5 juta jebol total. Untung Bu Ani punya <strong>tabungan Rp 50 juta</strong> — ia selamat, meski tabungannya terkuras.</p>
        <p>Bank bekerja persis seperti Bu Ani — hanya skalanya miliaran. <strong>Rp 4,5 juta</strong> itu namanya <strong>Expected Loss</strong> (sudah dianggarkan via cadangan/CKPN). <strong>Rp 30 juta</strong> itu <strong>Unexpected Loss</strong> (ditutup dari tabungan = modal bank). Bank yang tidak paham bedanya akan mengira "sudah ada cadangan, aman" — lalu kaget saat krisis datang.</p>
        <p><strong>Twist-nya:</strong> seluruh industri perbankan global — Basel, IFRS 9, OJK — berdiri di atas tiga huruf: <strong>PD, LGD, EAD</strong>. Lesson ini membedah ketiganya sampai ke akarnya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="trio">Trio Maut: PD, LGD, EAD</h2>
      <p>Setiap kredit bisa diringkas menjadi tiga pertanyaan. Jawab ketiganya, dan kamu tahu "harga" risikonya:</p>

      <h3>PD — Probability of Default: "Seberapa mungkin dia gagal?"</h3>
      <p><strong>Definisi.</strong> Peluang debitur <strong>gagal bayar dalam 1 tahun</strong> (untuk PD 12-bulan). Rentang 0–100%. PD 2% artinya: dari 100 debitur sejenis, ~2 diperkirakan macet setahun ke depan.</p>
      <p><strong>Kepribadian:</strong> PD adalah <strong>peramal</strong> — ia menebak masa depan dari masa lalu (data historis) dan masa kini (kondisi debitur). Peramal bisa salah, makanya PD harus divalidasi terus (CR19). PD tinggi = debitur "berpenyakit"; PD rendah = "atlet".</p>
      <p><strong>Contoh angka:</strong> KPR debitur PNS golongan IV: PD ~0,5%. Kartu kredit nasabah baru tanpa riwayat: PD ~8%. Beda 16× lipat — inilah mengapa bunga kartu kredit jauh lebih tinggi.</p>

      <h3>LGD — Loss Given Default: "Kalau gagal, berapa yang hilang?"</h3>
      <p><strong>Definisi.</strong> Porsi exposure yang <strong>tidak kembali</strong> setelah debitur default (setelah agunan dijual, ditagih, direstrukturisasi). LGD 45% artinya dari Rp 100 yang macet, Rp 45 hilang selamanya.</p>
      <p><strong>Kepribadian:</strong> LGD adalah <strong>tim penyelamat</strong> — ia bekerja SETELAH kecelakaan. Agunan bagus = tim penyelamat yang sigap (LGD kecil). Tanpa agunan = tidak ada tim penyelamat (LGD ~70–100%). Kebalikannya disebut <strong>recovery rate</strong> = 1 − LGD.</p>
      <p><strong>Contoh angka:</strong> KPR dengan rumah agunan: LGD ~15–25%. Kartu kredit tanpa agunan: LGD ~80–90%. Inilah jawaban kuantitatif atas miskonsepsi CR1 ("agunan tidak mengurangi peluang macet — tapi mengurangi kerugian SAAT macet").</p>

      <h3>EAD — Exposure at Default: "Saat dia gagal, berapa tagihan kita?"</h3>
      <p><strong>Definisi.</strong> Total outstanding (+ komitmen yang mungkin ditarik) <strong>pada saat</strong> debitur default. Untuk kredit angsuran biasa: EAD ≈ sisa pokok. Untuk kartu kredit/fasilitas revolving: EAD bisa <strong>lebih besar</strong> dari outstanding hari ini — debitur yang kesulitan cenderung <em>menarik limit sampai habis</em> sebelum macet (ini namanya CCF — CR13).</p>
      <p><strong>Kepribadian:</strong> EAD adalah <strong>fotografer</strong> — ia memotret "berapa besar taruhannya" tepat di momen kecelakaan. Kadang potretnya lebih besar dari yang terlihat hari ini.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan trio ini sebagai <strong>tiga pertanyaan berurutan</strong>: (1) <em>Apakah</em> dia akan gagal? → PD. (2) <em>Kalau</em> gagal, <em>berapa persen</em> yang hilang? → LGD. (3) <em>Berapa rupiah</em> yang dipertaruhkan saat itu? → EAD. Urutannya tidak bisa dibalik — seperti menembak: peluang kena → seberapa parah → sebesar apa targetnya.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "PD 2% artinya dari 100 debitur PASTI 2 yang macet."</strong></p>
        <p><strong>Yang benar:</strong> PD adalah <strong>ekspektasi</strong>, bukan ramalan pasti. Realisasinya bisa 0, bisa 5 — itulah <strong>risiko</strong>. Kalau PD selalu tepat, tidak ada yang namanya Unexpected Loss. Justru karena realisasi menyimpang dari ekspektasi, bank butuh modal (lihat bagian UL di bawah).</p>
      </div>

      <h2 id="el">Expected Loss — Biaya Rutin Berbisnis Kredit</h2>
      <p><strong>Definisi.</strong> Expected Loss = kerugian rata-rata yang <strong>diharapkan</strong> terjadi. Rumus paling terkenal di risiko kredit:</p>
      <Tex math={String.raw`\text{EL} = \text{PD} \times \text{LGD} \times \text{EAD}`} block />
      <p><strong>Artinya tiap simbol:</strong> PD = peluang gagal (desimal, mis. 0,02); LGD = porsi hilang (desimal, mis. 0,45); EAD = rupiah exposure (mis. Rp 500 jt). Hasilnya dalam <strong>rupiah</strong> — "biaya risiko" kredit tersebut.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>KPR Budi (CR1): PD = 2%, LGD = 45%, EAD = Rp 500 jt.</p>
        <p><strong>Langkah 1</strong> — ubah ke desimal: 0,02 × 0,45 × 500.<br />
        <strong>Langkah 2</strong> — kalikan: 0,02 × 0,45 = 0,009; 0,009 × 500 = <strong>Rp 4,5 jt</strong>.<br />
        <strong>Langkah 3</strong> — interpretasi: bank "menganggarkan" Rp 4,5 jt kerugian untuk KPR ini — persis seperti Bu Ani menganggarkan Rp 4,5 jt bon macet. Anggaran ini diwujudkan sebagai <strong>CKPN (cadangan)</strong> yang mengurangi laba tahun berjalan.</p>
      </details>

      <PlotlyChart
        data={elWaterfallData}
        title="Membedah EL Rp 4,5 Juta: Tiga Faktor Pembentuknya"
        layout={{ xaxis: { title: "Faktor" }, yaxis: { title: "Nilai" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga batang = tiga faktor pembentuk EL. Kalikan ketiganya: 0,02 × 0,45 × 500 = 4,5.</p>
        <p><strong>Interpretasi:</strong> EL kecil (Rp 4,5 jt dari Rp 500 jt) karena PD kecil. Tapi perhatikan: <strong>perkalian berarti tiap faktor sama pentingnya</strong> — menurunkan PD separuh = menurunkan LGD separuh = EL turun separuh. Di dunia nyata, "tuas" termurah berbeda per segmen (lihat Peta Keputusan).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "EL sudah dicadangkan, jadi bank aman dari risiko kredit."</strong></p>
        <p><strong>Yang benar:</strong> cadangan hanya menutup <strong>rata-rata</strong> kerugian. Tahun krisis, kerugian aktual bisa 3× EL (ingat Bu Ani: anggaran 4,5 jt, realisasi 30 jt). Selisih antara realisasi dan ekspektasi inilah <strong>Unexpected Loss</strong> — dan ia ditutup bukan dari cadangan, melainkan dari <strong>modal</strong>.</p>
      </div>

      <h2 id="ul">Unexpected Loss &amp; Modal — Bantal untuk Kejutan</h2>
      <p><strong>Definisi.</strong> Unexpected Loss (UL) = <strong>volatilitas</strong> kerugian di sekitar EL — seberapa jauh realisasi bisa menyimpang dari ekspektasi. Secara sederhana:</p>
      <Tex math={String.raw`\text{UL} \approx \text{Kerugian pada skenario buruk} - \text{EL}`} block />
      <p><strong>Artinya:</strong> kalau EL = Rp 12 M/tahun tapi pada skenario buruk (resesi) kerugian bisa Rp 40 M, maka UL ≈ Rp 28 M. Rp 28 M inilah yang harus disediakan sebagai <strong>modal</strong> (bukan cadangan).</p>
      <p><strong>Aturan mainnya (dan ini fundamental!):</strong></p>
      <ul>
        <li><strong>EL → ditutup CKPN (cadangan)</strong> → mengurangi <strong>laba</strong> tahun berjalan.</li>
        <li><strong>UL → ditutup modal</strong> → mengurangi <strong>kapasitas</strong> bank (modal terkunci, tidak bisa diputar jadi kredit baru).</li>
      </ul>
      <p><strong>Kepribadian:</strong> kalau EL adalah "anggaran belanja rutin", UL adalah "dana darurat". Orang yang hanya punya anggaran tanpa dana darurat akan panik saat atap bocor — bank yang hanya punya CKPN tanpa modal cukup akan kolaps saat krisis.</p>

      <PlotlyChart
        data={elVsUlData}
        title="EL vs Kerugian Aktual: 7 Tahun Simulasi (Rp M)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "Rp Miliar" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang abu-abu = kerugian aktual tiap tahun; garis biru putus-putus = EL (Rp 12 M, konstan sebagai ekspektasi).</p>
        <p><strong>Interpretasi:</strong> 6 dari 7 tahun, aktual ≈ EL — cadangan bekerja sempurna. Tapi <strong>2020 meledak ke Rp 38 M</strong>: selisih Rp 26 M di atas EL = Unexpected Loss, ditutup dari modal. Inilah alasan regulator (Basel, OJK) mewajibkan modal minimum — <strong>cadangan saja tidak cukup untuk krisis</strong>. Detail perhitungan modal: CR4.</p>
      </div>

      <PlotlyChart
        data={capitalStackData}
        title="Tumpukan Penutup Kerugian: Cadangan vs Modal"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Rp Miliar" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua batang = dua lapis pertahanan bank.</p>
        <p><strong>Interpretasi:</strong> lapis pertama (kuning, Rp 12 M) = CKPN menutup EL — "biaya rutin". Lapis kedua (biru, Rp 28 M) = modal menutup UL — "dana darurat". <strong>Total Rp 40 M</strong> inilah "harga" risiko kredit portofolio ini. Bank yang modalnya tipis = rumah tanpa dana darurat.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> setiap keputusan kredit bisa dibaca sebagai <strong>dua harga</strong>: (1) berapa EL-nya → menggerus laba via CKPN; (2) berapa UL-nya → mengunci modal via regulasi. Kredit "murah" (bunga rendah) dengan UL tinggi sebenarnya <strong>mahal</strong> — ia memakan modal yang bisa dipakai untuk 3 kredit lain. Inilah jembatan ke RAROC (CR21).</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Tiga Huruf yang Mengatur Gaji Direksi</h3>
      <p>PD × LGD × EAD terlihat seperti rumus ujian. Kenyataannya, tiga huruf ini <strong>mengalir ke setiap keputusan besar bank</strong>: EL menentukan CKPN (menggerus laba → menentukan bonus direksi), UL menentukan kebutuhan modal (menentukan seberapa agresif bank boleh tumbuh), dan keduanya menentukan harga kredit (CR21). Direksi yang menyetujui target pertumbuhan kredit 15% sesungguhnya sedang menyetujui implikasi PD/LGD/EAD dari pertumbuhan itu — meski mereka tidak menyebut rumusnya.</p>
      <p>Intuisi matematis yang jarang disadari: karena EL adalah <strong>perkalian</strong>, ia bekerja dalam skala logaritmik. Menurunkan PD dari 10% ke 5% (selisih 5 poin) efeknya SAMA dengan menurunkan dari 2% ke 1% (selisih 1 poin) — keduanya memangkas EL separuh. Artinya: <strong>perbaikan paling murah selalu ada di faktor yang paling buruk</strong>. Portofolio dengan PD 10% dan LGD 80%: perbaiki PD dulu. Portofolio PD 1% LGD 80%: perbaiki LGD (agunan) — PD-nya sudah tidak banyak ruang turun. Analis hebat membaca "ruang perbaikan", bukan sekadar angka.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> EL menjawab "berapa biayanya", UL menjawab "berapa modalnya". Bank yang hanya menghitung EL (lupa UL) seperti orang yang menghitung biaya bensin road trip tapi lupa membawa ban serep. Perjalanan 99% lancar — tapi 1% yang bocor menentukan apakah kamu sampai.</p>
      </div>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Kalkulator EL</h2>
      <p>Tiga angka masuk, satu harga risiko keluar. Rasakan sensitivitasnya.</p>
      <PyodideLab
        title="Lab 1 — EL = PD × LGD × EAD"
        hint="Coba: (1) pd=0.10 — EL naik berapa kali lipat? (2) Kembalikan pd, lalu lgd=0.20. Bandingkan: menurunkan PD vs menurunkan LGD — mana yang lebih 'murah' di dunia nyata?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: EL vs UL — Ekspektasi vs Kejutan</h2>
      <p>Simulasi 7 tahun: 6 tahun tenang, 1 tahun krisis. Lihat siapa yang menutup apa.</p>
      <PyodideLab
        title="Lab 2 — Simulasi EL vs UL"
        hint="Jalankan berulang dengan seed berbeda (ganti random.seed(7) jadi angka lain). Perhatikan: rata-rata 7 tahun selalu ≈ EL, tapi SELALU ada 1 tahun yang jebol. Itulah mengapa modal wajib ada."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Tuas Mana yang Ditarik?</h2>
      <p>EL = PD × LGD × EAD berarti ada <strong>tiga tuas</strong>. Tapi tuas termurah berbeda per situasi:</p>

      <div className="decision-card">
        <h3>1. PD terlalu tinggi → <strong>perketat seleksi / naikkan cut-off</strong></h3>
        <p><strong>Kondisi:</strong> segmen berisiko (nasabah baru, tanpa riwayat), underwriting longgar.</p>
        <p><strong>Kenapa tuas PD:</strong> menolak 10% aplikan terburuk bisa memangkas PD portofolio 30–40% (mereka yang paling mungkin macet). Alatnya: scorecard + cut-off (CR7).</p>
        <p><strong>Contoh nyata:</strong> kartu kredit menaikkan skor minimum dari 600 ke 650 — approval turun 15%, tapi NPL turun dari 9% ke 6%.</p>
      </div>

      <div className="decision-card">
        <h3>2. LGD terlalu tinggi → <strong>minta agunan / asuransi</strong></h3>
        <p><strong>Kondisi:</strong> kredit tanpa agunan, atau agunan yang nilainya meragukan.</p>
        <p><strong>Kenapa tuas LGD:</strong> KPR dengan LTV 70% (DP 30%) punya LGD ~20%; KPR LTV 95% LGD-nya bisa 40%+. Selisih agunan sedikit, selisih LGD besar.</p>
        <p><strong>Contoh nyata:</strong> KMK dengan jaminan persediaan + asuransi kredit — LGD turun dari 60% ke 35%.</p>
      </div>

      <div className="decision-card">
        <h3>3. EAD terlalu besar → <strong>kecilkan limit / pantau utilization</strong></h3>
        <p><strong>Kondisi:</strong> fasilitas revolving (kartu kredit, cerukan) dengan limit jumbo yang jarang dipakai.</p>
        <p><strong>Kenapa tuas EAD:</strong> limit Rp 100 jt yang utilization-nya 10% tetap berisiko: saat debitur kesulitan, ia akan tarik sampai habis <em>sebelum</em> macet (CCF — CR13). Menurunkan limit "tidur" memangkas EAD tanpa mengganggu nasabah sehat.</p>
        <p><strong>Contoh nyata:</strong> bank memangkas limit kartu yang tidak aktif 12 bulan — EAD portofolio turun 8%, keluhan nasabah ≈ 0.</p>
      </div>

      <div className="decision-card">
        <h3>4. UL terlalu tinggi (konsentrasi) → <strong>diversifikasi</strong></h3>
        <p><strong>Kondisi:</strong> portofolio menumpuk di satu sektor/debitur — EL wajar tapi UL raksasa.</p>
        <p><strong>Kenapa diversifikasi:</strong> 100 debitur Rp 1 M (tersebar) vs 1 debitur Rp 100 M — EL bisa sama, tapi UL beda langit-bumi. Satu gagal bayar di kasus kedua = bencana. Detail: CR15.</p>
      </div>

            <div className="decision-card">
        <h3>5. OJK bertanya "berapa PD portofoliomu?" → <strong>jawab per segmen, jangan satu angka</strong></h3>
        <p><strong>Kondisi:</strong> regulator/auditor meminta angka PD portofolio untuk laporan. Godaan: hitung rata-rata tertimbang semua kredit → "PD portofolio 2,1%".</p>
        <p><strong>Kenapa per segmen:</strong> satu angka menyembunyikan segalanya — PD 2,1% bisa berarti semua segmen ~2% (sehat merata) atau KPR 0,5% + kartu kredit 9% (dua dunia berbeda). Regulator yang baik akan langsung meminta breakdown; analis yang proaktif menyajikannya duluan. Sajikan: PD per segmen produk + tren 8 kuartal + perbandingan vs realisasi (backtesting). Satu angka = headline; breakdown = analisis.</p>
        <p><strong>Contoh nyata:</strong> "PD portofolio 2,1%" terdengar aman — sampai breakdown menunjukkan PD KMK naik dari 3% ke 5,5% dalam setahun sementara KPR turun. Agregatnya stabil karena KPR tumbuh lebih cepat (efek bauran). Masalah KMK hampir lolos tanpa breakdown.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>EL naik? Tanya dulu: PD, LGD, atau EAD-nya</strong> — jangan asal "perketat semua".</li>
          <li><strong>EL → laba (CKPN); UL → modal.</strong> Dua harga, dua dompet.</li>
          <li><strong>Perkalian = tiap tuas sama kuat secara matematis</strong> — pilih yang termurah secara bisnis.</li>
          <li><strong>UL besar = konsentrasi.</strong> Obatnya bukan seleksi lebih ketat, melainkan sebar risiko.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Matriks 3×3 Tuas EL</h3>
      <p>EL = PD × LGD × EAD memberi 3 tuas × 3 segmen = 9 sel strategi. Isi matriks ini untuk portofoliomu — sel yang kosong = peluang yang belum diambil.</p>
      <ol>
        <li><strong>Tuas PD — Ritel:</strong> — perketat cut-off scorecard, tolak 10% terbawah. Termurah dan tercepat untuk segmen massal.</li>
        <li><strong>Tuas PD — UKM:</strong> — verifikasi lapangan + kunjungan ulang. Data kertas UKM sering 'cantik' — kunjungan adalah auditnya.</li>
        <li><strong>Tuas PD — Korporasi:</strong> — covenant keuangan + monitoring kuartalan. Satu debitur besar = satu kegagalan besar; awasi personal.</li>
        <li><strong>Tuas LGD — Ritel:</strong> — turunkan LTV/FTV, wajibkan asuransi. DP 30% vs 10% = LGD beda 2× lipat.</li>
        <li><strong>Tuas LGD — UKM:</strong> — ikat agunan dengan sempurna (fidusia terdaftar!) + asuransi kredit. Agunan UKM yang tidak terikat = pajangan.</li>
        <li><strong>Tuas LGD — Korporasi:</strong> — struktur senioritas + jaminan induk (parent guarantee). Dalam PKPU, yang senior dibayar dulu.</li>
        <li><strong>Tuas EAD — Ritel:</strong> — pangkas limit tidur kartu/kredit revolving. Limit menganggur = EAD gratis yang menunggu ditarik.</li>
        <li><strong>Tuas EAD — UKM:</strong> — revolving dengan tinjauan tahunan — jangan perpanjang otomatis tanpa review kondisi.</li>
        <li><strong>Tuas EAD — Korporasi:</strong> — MAC clause di setiap fasilitas standby. Komitmen tanpa syarat = asuransi gratis yang diklaim saat badai.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> petakan portofoliomu ke 9 sel ini tiap kuartal. Sel yang 'tidak ada aksi' 2 kuartal berturut-turut = tuas yang menganggur.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ PD 0% — mungkinkah?</summary>
        <p>Tidak ada PD 0% di dunia nyata — bahkan obligasi pemerintah punya risiko (kecil sekali). PD '0%' di model = <strong>pembulatan atau data kurang</strong>. Praktik sehat: floor PD minimum (misal 0,03% ala Basel) — mengakui bahwa ketidakpastian tidak pernah nol.</p>
      </details>
      <details className="worked">
        <summary>❓ LGD bisa negatif (recovery &gt;100%)?</summary>
        <p>Bisa — jika recovery (termasuk denda, bunga tunggakan yang akhirnya dibayar) melebihi EAD. Tetapi untuk perhitungan modal/ECL, LGD umumnya di-floor di 0%. Konservatisme: jangan mengandalkan 'keuntungan dari default'.</p>
      </details>
      <details className="worked">
        <summary>❓ Mana yang lebih dulu diperbaiki: PD, LGD, atau EAD?</summary>
        <p>Ikuti <strong>ruang perbaikan</strong>: faktor yang paling buruk = perbaikan termurah (efek proporsional dari perkalian). PD 10% → perbaiki PD. PD 1% + LGD 80% → perbaiki LGD (agunan). EAD jumbo menganggur → pangkas limit. Jangan asal 'perketat semua' — mahal dan tidak fokus.</p>
      </details>
      <details className="worked">
        <summary>❓ EL untuk pricing vs EL untuk CKPN — sama?</summary>
        <p>Hampir — tetapi <strong>tidak identik</strong>. EL pricing boleh memakai PD PIT terkini + asumsi bisnis; EL CKPN wajib mengikuti PSAK 71 (staging, skenario, diskonto EIR). Perbedaannya harus terdokumentasi. Yang fatal: memakai EL CKPN untuk pricing tanpa penyesuaian — atau sebaliknya.</p>
      </details>

                        {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Rumus EL = PD × LGD × EAD bukan sekadar teori — ia adalah <strong>fondasi regulasi modal global</strong> dan praktik perbankan Indonesia.</p>

      <h3>Dari EL ke Modal: Rumus Basel IRB</h3>
      <p>Di bawah Basel II/III pendekatan IRB (CR4a), kebutuhan modal bank dihitung dari PD, LGD, EAD — plus dua bumbu: <strong>korelasi aset</strong> (seberapa serentak debitur gagal) dan <strong>maturity</strong>. Intinya: regulator tidak percaya EL saja; ia menghitung <strong>kerugian pada skenario buruk (99,9% confidence)</strong> lalu mengurangkan EL (yang sudah dicadangkan). Selisihnya = modal minimum.</p>
      <p>Implikasinya untuk Indonesia: mayoritas bank Indonesia memakai <strong>Standardised Approach</strong> (bobot tetap dari regulator), tetapi bank-bank besar membangun kapabilitas IRB — yang artinya membangun <strong>model PD, LGD, EAD internal</strong> (materi CR10–CR13). Tiga huruf lesson ini adalah fondasi karier modeling risiko kredit.</p>

      <h3>Praktik Indonesia: Siapa Menghitung Apa</h3>
      <p>Di bank umum Indonesia, PD/LGD/EAD dihitung oleh <strong>tim risk modeling / portofolio</strong>, dipakai oleh <strong>tim akuntansi</strong> untuk ECL PSAK 71 (CR14), dan diawasi <strong>OJK</strong> melalui laporan berkala. Satu set angka, tiga pengguna — maka definisinya harus konsisten. PD untuk pricing (CR21) boleh sedikit berbeda dari PD untuk modal (konsep <em>through-the-cycle</em> vs <em>point-in-time</em>, detail CR10), tetapi perbedaannya harus terdokumentasi dan bisa dijelaskan ke auditor.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: EL sama, modal beda (klik untuk buka)</summary>
        <p>Dua portofolio, masing-masing EAD total Rp 100 M:</p>
        <p><strong>Portofolio X (ritel tersebar):</strong> PD 3%, LGD 50% → EL = 0,03 × 0,5 × 100.000 = <strong>Rp 1.500 jt</strong>. Korelasi rendah → UL ≈ Rp 2.000 jt.</p>
        <p><strong>Portofolio Y (5 debitur korporasi):</strong> PD 3%, LGD 50% → EL = <strong>Rp 1.500 jt</strong> (sama!). Korelasi tinggi → UL ≈ Rp 12.000 jt.</p>
        <p><strong>Kesimpulan:</strong> CKPN keduanya sama (Rp 1,5 M — EL sama), tetapi Y mengunci modal <strong>6× lipat</strong>. Jika return keduanya sama, X jauh lebih menguntungkan bagi pemegang saham (RAROC X &gt;&gt; RAROC Y — CR21). Inilah mengapa bank besar rela "membayar mahal" untuk diversifikasi.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "EL kecil = kredit aman, boleh diberi bunga murah."</strong></p>
        <p><strong>Yang benar:</strong> bunga harus menutup <strong>EL + biaya dana + biaya operasional + biaya modal (untuk UL) + margin</strong>. Kredit ber-EL kecil tapi UL besar (terkonsentrasi) tetap "mahal" karena memakan modal. Pricing yang hanya melihat EL = memberi diskon atas biaya modal bank.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Dua Kredit, EL Sama, Risiko Beda</h2>
      <div className="callout">
        <p>Bank Nusantara punya dua opsi penyaluran Rp 1 M:</p>
        <ul>
          <li><strong>Opsi A — 100 KPR @Rp 10 jt? tidak — 20 KUR @Rp 50 jt:</strong> PD 4%, LGD 40%, EAD Rp 50 jt per debitur. EL total = 20 × 0,04 × 0,4 × 50 = <strong>Rp 16 jt</strong>.</li>
          <li><strong>Opsi B — 1 kredit korporasi Rp 1 M:</strong> PD 4%, LGD 40%, EAD Rp 1 M. EL = 0,04 × 0,4 × 1000 = <strong>Rp 16 jt</strong>.</li>
        </ul>
        <p>EL-nya <strong>persis sama</strong>: Rp 16 jt. Direksi bertanya: "Sama saja kan? Pilih yang operasionalnya lebih murah (Opsi B — cuma urus 1 debitur)."</p>
        <p><strong>Pertanyaan:</strong> setujukah kamu? Hitung skenario terburuk masing-masing dan jelaskan ke direksi mengapa EL sama ≠ risiko sama.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Tidak setuju — ini jebakan EL.</strong> Skenario terburuk: Opsi A — 20 debitur independen, peluang semuanya macet bersamaan ≈ 0 (sebaran binomial). Kerugian realistis berkisar Rp 0–40 jt. Opsi B — 1 debitur: kalau ia macet, langsung hilang Rp 400 jt (LGD 40% × 1 M) sekaligus!</p>
          <p>EL sama (Rp 16 jt) tapi <strong>UL Opsi B berkali-kali lipat Opsi A</strong> — Opsi B butuh modal jauh lebih besar (CR15: konsentrasi). Analogi: 20 warung vs 1 mal — omzet harian rata-rata sama, tapi kalau 1 mal kebakaran, habis semua. <strong>Pelajaran abadi: EL mengukur rata-rata; risiko sesungguhnya ada di sebaran.</strong></p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. KPR: PD 2%, LGD 45%, EAD Rp 500 jt. Berapa EL?"
        options={[
          "Rp 45 jt",
          "Rp 4,5 jt",
          "Rp 10 jt",
          "Rp 500 jt",
        ]}
        correct={1}
        explanation="Benar: 0,02 × 0,45 × 500 = Rp 4,5 jt. Ini 'anggaran' kerugian yang dicadangkan via CKPN — bukan ramalan pasti."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. EL ditutup dari ______, sedangkan UL ditutup dari ______."
        options={[
          "modal … cadangan (CKPN)",
          "cadangan (CKPN) … modal",
          "laba ditahan … utang bank",
          "utang bank … modal",
        ]}
        correct={1}
        explanation="Benar: EL → CKPN (mengurangi laba tahun berjalan); UL → modal (mengunci kapasitas). Tertukar = salah membaca laporan keuangan bank."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dua portofolio ber-EL sama persis. Mana yang pasti benar?"
        options={[
          "Risikonya sama — EL sudah merangkum semua",
          "Risiko bisa beda jauh — EL hanya rata-rata; sebaran (UL) ditentukan konsentrasi & korelasi",
          "Yang EL-nya sama pasti butuh modal sama",
          "Tidak ada bedanya bagi regulator",
        ]}
        correct={1}
        explanation="Benar: EL = ekspektasi (rata-rata). Risiko sesungguhnya = seberapa jauh realisasi bisa menyimpang (UL) — ditentukan konsentrasi, korelasi default, dan ekor distribusi. Inilah inti mini-case di atas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Bank ingin menurunkan EL portofolio kartu kredit (tanpa agunan). Tuas PALING efektif?"
        options={[
          "Minta agunan (turunkan LGD) — mustahil untuk kartu kredit",
          "Turunkan PD via seleksi/scorecard lebih ketat, dan kecilkan limit tidur (EAD)",
          "Naikkan bunga — bunga bukan bagian EL",
          "Perbanyak marketing agar penyebut besar",
        ]}
        correct={1}
        explanation="Benar: kartu kredit tidak punya agunan (tuas LGD buntu) — maka mainkan PD (seleksi) dan EAD (limit). Menaikkan bunga menaikkan pendapatan, bukan menurunkan EL — malah bisa menaikkan PD (adverse selection)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Tahun krisis, kerugian aktual 3× EL. Apa yang terjadi di laporan bank?"
        options={[
          "Tidak apa-apa — EL sudah mencakup semua skenario",
          "CKPN menutup sebesar EL; kelebihannya menggerus modal (dan bisa memicu pelanggaran KPMM)",
          "Bank otomatis bangkrut",
          "UL tidak ada hubungannya dengan modal",
        ]}
        correct={1}
        explanation="Benar: CKPN hanya menutup porsi EL. Kelebihan 2× EL memakan modal — kalau modal tipis, rasio KPMM jebol dan OJK turun tangan. Inilah mengapa Basel mewajibkan modal untuk UL (CR4)."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. PD turun dari 10% ke 5% vs PD turun dari 2% ke 1% (LGD & EAD tetap). Mana yang lebih besar efeknya ke EL?"
        options={[
          "Yang pertama — selisihnya 5 poin, jauh lebih besar",
          "Sama besar — keduanya memangkas EL separuh (perkalian bekerja proporsional)",
          "Yang kedua — angka kecil lebih sensitif",
          "Tidak bisa dibandingkan tanpa tahu EAD",
        ]}
        correct={1}
        explanation="Benar: sama. EL = perkalian, jadi yang penting rasio perubahannya, bukan selisih poinnya. Pelajaran praktis: perbaiki dulu faktor yang paling buruk (ruang perbaikan terbesar ada di sana)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Fasilitas kartu kredit: outstanding Rp 10 jt, limit Rp 50 jt. Saat debitur macet, EAD yang realistis adalah?"
        options={[
          "Rp 10 jt — EAD = outstanding hari ini",
          "Mendekati Rp 50 jt — debitur kesulitan cenderung menarik limit sampai habis sebelum macet",
          "Rp 0 — kartu langsung diblokir saat macet",
          "Rp 60 jt — outstanding + limit",
        ]}
        correct={1}
        explanation="Benar: mendekati limit. Fenomena ini (CCF — CR13) membuat EAD fasilitas revolving sistematis lebih besar dari outstanding. Model EAD yang memakai outstanding saja akan underestimate."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>PD</strong> = peluang gagal (peramal); <strong>LGD</strong> = porsi hilang saat gagal (tim penyelamat); <strong>EAD</strong> = rupiah dipertaruhkan (fotografer).</li>
          <li><strong>EL = PD × LGD × EAD</strong> — "biaya rutin" yang dicadangkan via CKPN dan menggerus laba.</li>
          <li><strong>UL</strong> = penyimpangan dari EL — ditutup <strong>modal</strong>, bukan cadangan.</li>
          <li><strong>Tiga tuas EL:</strong> seleksi (PD), agunan (LGD), limit (EAD) — pilih yang termurah per segmen.</li>
          <li><strong>EL sama ≠ risiko sama</strong> — konsentrasi menciptakan UL raksasa.</li>
          <li>Kapan TIDAK cukup mengandalkan EL: portofolio terkonsentrasi / berkorelasi tinggi — di sana UL yang menentukan hidup-mati bank.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr2-kolektibilitas" className="btn btn-secondary btn-sm">← CR2</Link>
        <Link href="/learn/cr4a-basel-rwa-kpmm" className="btn btn-primary btn-sm">Next: CR4a →</Link>
      </div>
    </div>
  );
}
