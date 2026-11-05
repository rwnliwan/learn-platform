"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E15Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const investorData = [
    {
      x: ["2020", "2021", "2022", "2023", "2024", "2025"],
      y: [3.9, 7.5, 10.3, 12.2, 14.8, 17.5],
      mode: "lines+markers",
      name: "Investor pasar modal (juta SID, ilustratif)",
      line: { color: "#2a7de1", width: 3 },
    },
  ];

  const ihsgData = [
    {
      x: ["2020", "2021", "2022", "2023", "2024", "2025"],
      y: [5979, 6581, 6850, 7272, 7130, 7600],
      mode: "lines+markers",
      name: "IHSG akhir tahun (ilustratif)",
      line: { color: "#2a7de1", width: 3 },
    },
  ];

  const sbnData = [
    {
      x: ["ORI", "Sukuk Ritel (SR)", "SBR (Savings)", "Sukuk Tabungan (ST)", "SDR/SBN lain"],
      y: [6.4, 6.6, 6.3, 6.5, 6.8],
      type: "bar",
      marker: { color: ["#2a7de1", "#5b9bd5", "#e8a838", "#5b9bd5", "#94a3b8"] },
      text: ["6,4%", "6,6%", "6,3%", "6,5%", "6,8%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1 — SBN vs deposito: duel setelah pajak & biaya
# Modal Rp100 jt, 2 tahun. SBN kupon 6,4% (PPh final 10%), deposito 5% (PPh 20%).
modal = 100_000_000
kupon_sbn, pph_sbn = 0.064, 0.10
bunga_dep, pph_dep = 0.05, 0.20
n = 2

neto_sbn = kupon_sbn * (1 - pph_sbn)
neto_dep = bunga_dep * (1 - pph_dep)
akhir_sbn = modal * (1 + neto_sbn) ** n
akhir_dep = modal * (1 + neto_dep) ** n

print(f"SBN     : kupon neto {neto_sbn*100:.2f}% -> Rp{akhir_sbn/1e6:.1f} jt")
print(f"Deposito: bunga neto {neto_dep*100:.2f}% -> Rp{akhir_dep/1e6:.1f} jt")
print(f"Selisih : Rp{(akhir_sbn-akhir_dep)/1e6:.1f} jt untuk SBN")
print()
print("TAPI: SBN bisa dijual kapan saja di harga pasar (risiko harga!).")
print("Deposito: pokok dijamin LPS (s.d. batas & syarat).")
print()
print("Coba: kupon_sbn = 0.058. Masih menang SBN?")`;

  const lab2Code = `# Lab 2 — Simulasi proteksi LPS
# LPS menjamin s.d. Rp2 M per nasabah per bank (syarat: bunga <= penjaminan, tercatat).
batas_lps = 2_000_000_000

def cek(simpanan, bunga_bank, bunga_penjaminan=0.0425):
    ok_bunga = bunga_bank <= bunga_penjaminan
    dijamin = min(simpanan, batas_lps) if ok_bunga else 0
    return dijamin, ok_bunga

for nama, sim, bunga in [("Deposito A", 1_500_000_000, 0.05),
                          ("Deposito B", 3_000_000_000, 0.04),
                          ("Deposito C", 500_000_000, 0.06)]:
    dijamin, ok = cek(sim, bunga)
    status = "AMAN" if dijamin == sim else ("SEBAGIAN" if dijamin > 0 else "TIDAK DIJAMIN!")
    print(f"{nama}: Rp{sim/1e9:.1f}M @ {bunga*100:.1f}% -> dijamin Rp{dijamin/1e9:.1f}M [{status}]")
print()
print("Pelajaran: 'dijamin LPS' ADA SYARATNYA — bunga di atas penjaminan = hangus!")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E15 — Financial Markets • Edisi Mendalam</span>
        <h1 className="display-title">Pasar Keuangan Indonesia:<br />Panduan Lengkap</h1>
        <div className="meta">60–75 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dari 3,9 Juta ke 17 Juta</a></li>
          <li><a href="#idx">IDX — Bursa Efek Indonesia</a></li>
          <li><a href="#sbn">SBN Ritel — Surat Utang Negara untuk Rakyat</a></li>
          <li><a href="#bi">Bank Indonesia — Tiga Senjata</a></li>
          <li><a href="#ojk">OJK — Wasit &amp; Pelindung</a></li>
          <li><a href="#lps">LPS — Penjamin Simpanan</a></li>
          <li><a href="#infrastruktur">Infrastruktur: KSEI, KPEI, Pefindo</a></li>
          <li><a href="#pajak">Pajak Investasi — Yang Sering Terlupakan</a></li>
          <li><a href="#lab1">🔬 Lab 1: SBN vs Deposito (Setelah Pajak)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Proteksi LPS</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Jalur Investasi Ritel Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Portofolio Pertama Rp50 Juta</a></li>
          <li><a href="#worked1">🔬 Worked Example: Pajak Kupon &amp; Dividen</a></li>
          <li><a href="#worked2">🔬 Worked Example: Simulasi Klaim LPS</a></li>
          <li><a href="#konteks">🌍 Konteks: 1998, Jiwasraya &amp; Binomo — Tiga Wajah Gagal</a></li>
          <li><a href="#ceklegal">🔧 Pendalaman: Cara Cek Legalitas 2 Menit</a></li>
          <li><a href="#kendaraan">🔧 Pendalaman: Memilih Kendaraan — Saham vs Reksa Dana vs ETF</a></li>
          <li><a href="#worked4">🔬 Worked Example: Rp10 Juta — Tiga Kendaraan, Tiga Hasil</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan struktur IDX (papan, indeks utama) dan cara investor ritel berpartisipasi.</li>
          <li>Membedakan seri SBN ritel (ORI, SR, SBR, ST) dan menghitung return setelah pajaknya.</li>
          <li>Menjelaskan peran BI (moneter, JISDOR, SRBI), OJK (pengawasan, perlindungan), dan LPS (penjaminan + syaratnya).</li>
          <li>Menghitung dampak pajak investasi dan memilih jalur investasi ritel sesuai tujuan.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Dari 3,9 Juta ke 17 Juta</h2>
      <div className="story">
        <p>Tahun 2020, investor pasar modal Indonesia cuma <strong>3,9 juta</strong> — di negara 270 juta jiwa. Lalu pandemi, aplikasi sekuritas semudah pesan ojek, dan SBN ritel bisa dibeli dari HP. Lima tahun kemudian: <strong>17+ juta investor</strong>. Salah satunya mungkin kamu.</p>
        <p>Tapi ada sisi gelapnya: lonjakan investor <em>tanpa</em> lonjakan literasi = ladang subur <strong>investasi bodong</strong> (kerugian triliunan rupiah per tahun), salah paham pajak, dan &ldquo;dijamin LPS&rdquo; yang ternyata <em>bersyarat</em>. Lesson ini = <strong>kit bertahan hidup</strong> investor Indonesia: lembaga, produk, pajak, dan jebakannya.</p>
        <p><strong>Twist-nya:</strong> 17 juta investor adalah <strong>kemenangan akses</strong> — dan <strong>ujian literasi</strong>. Aplikasi semudah pesan ojek membuat <em>membuka akun</em> butuh 10 menit; memahami <em>apa yang dibeli</em> butuh 10 jam — dan penipu tahu persis kesenjangan itu. Setiap fitur pasar modal Indonesia (pajak, penjaminan, perlindungan) punya <strong>versi asli dan versi palsu</strong> yang dijual penipu: &ldquo;dijamin LPS&rdquo;, &ldquo;diawasi OJK&rdquo;, &ldquo;pasti cuan&rdquo;. Lesson ini = kemampuan membedakan keduanya — <strong>sebelum</strong> uangmu yang menjadi biaya sekolahnya.</p>
      </div>

      <h2 id="idx">IDX — Bursa Efek Indonesia</h2>
      <p><strong>Definisi.</strong> PT Bursa Efek Indonesia = <strong>satu-satunya bursa saham</strong> Indonesia (hasil merger BES+BSJ 2007). Jam perdagangan: Senin–Jumat, sesi pagi &amp; siang (cek kalender bursa untuk libur).</p>
      <p><strong>Papan pencatatan:</strong></p>
      <ul>
        <li><strong>Papan Utama:</strong> emiten mapan, kapitalisasi besar, rekam jejak panjang.</li>
        <li><strong>Papan Pengembangan:</strong> emiten bertumbuh / lebih kecil.</li>
        <li><strong>Papan Ekonomi Baru:</strong> untuk perusahaan teknologi/startup (aturan pencatatan disesuaikan).</li>
        <li><strong>Papan Akselerasi:</strong> untuk UKM.</li>
      </ul>
      <p><strong>Indeks utama:</strong> <strong>IHSG</strong> (gabungan semua saham — <em>market-cap weighted</em>), <strong>LQ45</strong> (45 saham paling likuid), <strong>IDX30</strong>, <strong>IDX80</strong>, plus indeks sektoral &amp; syariah (ISSI, JII).</p>
      <p><strong>Cara ritel masuk:</strong> buka rekening di <strong>perusahaan sekuritas</strong> (terdaftar &amp; diawasi OJK) → dapat <strong>RDN</strong> (rekening dana nasabah) → beli via aplikasi. Cek legalitas sekuritas di situs OJK <em>sebelum</em> transfer sepeser pun.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;IHSG naik = semua saham naik / investasiku pasti untung.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> IHSG <em>market-cap weighted</em> — <strong>didominasi saham raksasa</strong> (bank BUMN, tambang). IHSG bisa naik 2% sementara 300 saham kecil <em>turun</em>. Portofoliomu ≠ IHSG kecuali kamu memegang ETF/reksa dana indeks. Selalu bandingkan kinerja dengan <strong>benchmark yang sesuai</strong> (E9: alpha!).</p>
      </div>

      <PlotlyChart
        data={investorData}
        title="Ledakan Investor Ritel Indonesia (juta SID, ilustratif)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "Juta investor" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis = jumlah investor pasar modal (saham, reksa dana, SBN) per tahun.</p>
        <p><strong>Interpretasi:</strong> <strong>4,5× lipat dalam 5 tahun</strong> — didorong digitalisasi &amp; SBN ritel online. Tapi penetrasi masih &lt;10% populasi (vs &gt;50% di AS). <strong>Dua sisi:</strong> peluang pendalaman pasar besar; tapi mayoritas pendatang baru = investor pemula yang rentan <em>herding</em> &amp; pom-pom (E16).</p>
      </div>

      <PlotlyChart
        data={ihsgData}
        title="IHSG 2020–2025: Naik Bertahap, Berosilasi (ilustratif)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "Indeks" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis = level IHSG akhir tahun.</p>
        <p><strong>Interpretasi:</strong> tren naik 5.979 → 7.600 (~27% dalam 5 tahun) <strong>dengan osilasi</strong> (2024 sempat turun). Pelajaran E7 berlaku: return ~5%/tahun dengan drawdown di tengah jalan. Investor yang masuk 2021 di puncak euforia lalu panik jual 2022 = rugi <em>meski</em> tren jangka panjang naik.</p>
      </div>

      <h2 id="sbn">SBN Ritel — Surat Utang Negara untuk Rakyat</h2>
      <p><strong>Definisi.</strong> <em>Surat Berharga Negara ritel</em> = obligasi pemerintah yang dijual <strong>langsung ke individu WNI</strong> via mitra distribusi (bank, sekuritas, fintech) — masa penawaran terbatas tiap seri. Dijamin <strong>UU</strong> (pembayaran kupon + pokok oleh negara).</p>
      <p><strong>Keluarga SBN ritel:</strong></p>
      <ul>
        <li><strong>ORI</strong> (Obligasi Negara Ritel): kupon tetap, <strong>bisa diperdagangkan</strong> di pasar sekunder.</li>
        <li><strong>SR</strong> (Sukuk Ritel): versi <strong>syariah</strong> (akad ijarah), bisa diperdagangkan.</li>
        <li><strong>SBR</strong> (Savings Bond Ritel): kupon <strong>mengambang</strong> (<em>floating with floor</em> — mengikuti BI-Rate, ada batas bawah), <strong>tidak</strong> bisa diperdagangkan (tapi bisa <em>early redemption</em>).</li>
        <li><strong>ST</strong> (Sukuk Tabungan): versi syariah SBR — tidak diperdagangkan.</li>
      </ul>
      <p><strong>Tradable vs non-tradable:</strong> ORI/SR = bisa jual kapan saja di harga pasar (ada <strong>risiko harga</strong> seperti E4!). SBR/ST = tidak bisa dijual, tapi bisa dicairkan awal (<em>early redemption</em>) maksimal 50% setelah 1 tahun — <strong>tanpa risiko harga</strong>, cocok untuk yang pasti pegang.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> pilih SBN ritel seperti pilih sepatu: <strong>ORI/SR</strong> = sepatu lari (fleksibel, bisa &ldquo;dijual&rdquo; kapan saja, tapi harga pasar naik-turun). <strong>SBR/ST</strong> = sepatu boots (kokoh dipegang, tidak goyang harga, tapi tidak bisa dilempar ke pasar). Horizon &lt; tenor &amp; mungkin butuh jual → ORI/SR. Pasti pegang sampai jatuh tempo → SBR/ST (tanpa pusing harga).</p>
      </div>

      <PlotlyChart
        data={sbnData}
        title="Kupon SBN Ritel per Seri (ilustratif, bisa berubah tiap penawaran)"
        layout={{ xaxis: { title: "Seri" }, yaxis: { title: "Kupon (%/tahun)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = kupon penawaran satu seri (angka ilustratif — kupon <strong>berbeda tiap masa penawaran</strong> mengikuti BI-Rate!).</p>
        <p><strong>Interpretasi:</strong> kupon SBN ritel <strong>mengikuti suku bunga acuan</strong>: saat BI-Rate tinggi, kupon penawaran baru lebih menggiurkan. <strong>Jangan bandingkan</strong> kupon ORI lama (terbit saat bunga rendah) dengan deposito kini — bandingkan <strong>YTM pasar sekunder</strong>-nya (E4!).</p>
      </div>

      <h2 id="bi">Bank Indonesia — Tiga Senjata</h2>
      <p><strong>Mandat:</strong> mencapai &amp; memelihara <strong>kestabilan nilai rupiah</strong> (inflasi + nilai tukar). Tiga fungsi (E12 + pendalaman):</p>
      <ol>
        <li><strong>Kebijakan moneter:</strong> BI-Rate, operasi pasar terbuka (termasuk <strong>SRBI</strong>), giro wajib minimum (GWM).</li>
        <li><strong>Sistem pembayaran:</strong> BI mengatur &amp; mengawasi — termasuk <strong>QRIS</strong> dan BI-FAST (transfer antar bank murah/cepat).</li>
        <li><strong>Stabilitas nilai tukar:</strong> acuan <strong>JISDOR</strong> tiap hari; intervensi valas (<em>triple intervention</em>: spot, forward/DNDF, SBN) saat rupiah bergejolak.</li>
      </ol>
      <p><strong>Kenapa penting bagimu:</strong> BI-Rate → bunga deposito/KPR-mu (E12); JISDOR → acuan kurs transaksimu; SRBI → alternatif parkir dana institusi yang memengaruhi likuiditas pasar.</p>

      <h2 id="ojk">OJK — Wasit &amp; Pelindung</h2>
      <p><strong>Mandat:</strong> mengatur &amp; mengawasi <strong>seluruh sektor jasa keuangan</strong>: perbankan, pasar modal, IKNB (asuransi, dana pensiun, fintech lending/P2P, dll.). Dua wajah:</p>
      <ul>
        <li><strong>Wasit industri:</strong> lisensi &amp; aturan main (bank, sekuritas, manajer investasi, fintech wajib berizin!).</li>
        <li><strong>Pelindung konsumen:</strong> edukasi, penanganan pengaduan, dan <strong>Satgas PASTI</strong> (dulu Waspada Investasi) — pemburu investasi bodong &amp; pinjol ilegal.</li>
      </ul>
      <p><strong>Aturan praktis:</strong> <strong>cek legalitas di OJK sebelum setor dana</strong> — &ldquo;terdaftar dan diawasi OJK&rdquo; adalah klaim yang <strong>wajib diverifikasi</strong> (banyak bodong memalsukannya). Prinsip 2L: <strong>Legal</strong> (izin OJK/Bappebti) dan <strong>Logis</strong> (return masuk akal — E2!).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;OJK menjamin investasiku tidak rugi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> OJK menjamin <strong>aturan mainnya adil &amp; transparan</strong> — BUKAN hasil investasimu. Saham/reksa dana berizin OJK <strong>bisa rugi</strong> (risiko pasar). Yang OJK berantas = <em>penipuan</em> (bodong, skema Ponzi), bukan <em>kerugian pasar yang wajar</em>. Bedakan &ldquo;ditipu&rdquo; vs &ldquo;rugi karena pasar turun&rdquo;.</p>
      </div>

      <h2 id="lps">LPS — Penjamin Simpanan</h2>
      <p><strong>Definisi.</strong> Lembaga Penjamin Simpanan menjamin simpanan nasabah bank <strong>s.d. Rp2 miliar per nasabah per bank</strong> — <strong>DENGAN SYARAT</strong>:</p>
      <ol>
        <li>Bunga simpanan <strong>tidak melebihi</strong> tingkat bunga penjaminan LPS;</li>
        <li>Simpanan <strong>tercatat</strong> di bank;</li>
        <li>Nasabah <strong>tidak</strong> ikut menyebabkan bank bermasalah (misal pemilik yang merugikan bank).</li>
      </ol>
      <p><strong>Yang TIDAK dijamin:</strong> saham, reksa dana, SBN, kripto, asuransi — <strong>hanya</strong> simpanan bank (tabungan, deposito, giro). &ldquo;Dijamin LPS&rdquo; untuk produk non-bank = <strong>kebohongan marketing</strong>.</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> bunga deposito <strong>di atas</strong> bunga penjaminan LPS = <strong>bendera merah ganda</strong>: (1) jaminan LPS <strong>hangus</strong>, (2) bank-nya mungkin bermasalah sehingga berani bayar mahal. Bunga tinggi + &ldquo;aman&rdquo; = tidak bisa dua-duanya (E2: tidak ada makan siang gratis).</p>
      </div>

      <h2 id="infrastruktur">Infrastruktur: KSEI, KPEI, Pefindo</h2>
      <p>Tiga nama yang jarang terdengar tapi menopang transaksimu:</p>
      <ul>
        <li><strong>KSEI</strong> (Kustodian Sentral Efek Indonesia): mencatat <strong>kepemilikan</strong> efekmu (saham/reksa dana/SBN) — buktinya <strong>SID</strong> &amp; sub-rekening efek. Sahammu &ldquo;ada&rdquo; karena tercatat di sini, bukan di aplikasi sekuritas.</li>
        <li><strong>KPEI / IDClear</strong> (Kliring Penjaminan Efek Indonesia): <strong>menjamin settlement</strong> — memastikan uang &amp; efek bertukar dengan benar (T+2). Jika sekuritasmu bermasalah, transaksimu tetap diselesaikan KPEI.</li>
        <li><strong>Pefindo</strong>: lembaga pemeringkat <strong>nasional</strong> (skala idAAA–idD) — rapor kredit emiten Indonesia (E5).</li>
      </ul>
      <p><strong>Kenapa penting:</strong> saat memilih sekuritas, yang melindungi asetmu = <strong>struktur kustodian + kliring ini</strong>, bukan janji marketing. Dana nasabah wajib dipisahkan (RDN) — bukan dicampur kas sekuritas.</p>

      <h2 id="pajak">Pajak Investasi — Yang Sering Terlupakan</h2>
      <p>Return <em>sebelum</em> pajak = ilusi. Tarif <strong>PPh final</strong> utama (verifikasi tarif terbaru ke DJP — berubah berkala):</p>
      <ul>
        <li><strong>Bunga deposito:</strong> 20%.</li>
        <li><strong>Kupon SBN:</strong> 10% (lebih ringan — insentif negara!).</li>
        <li><strong>Transaksi saham:</strong> 0,1% dari <strong>nilai transaksi</strong> (final, dipungut otomatis).</li>
        <li><strong>Dividen:</strong> ketentuan khusus (dividen dalam negeri yang diinvestasikan kembali dapat dikecualikan — cek aturan terbaru).</li>
      </ul>
      <p><strong>Dampaknya nyata:</strong> deposito 5% → neto 4%; SBN 6,4% → neto 5,76%. <strong>Selisihnya melebar setelah pajak</strong> — inilah yang dihitung di Lab 1.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Bandingin return pakai angka brosur saja cukup.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> brosur menampilkan <strong>bruto</strong>. Keputusan memakai <strong>neto setelah pajak</strong> (dan setelah inflasi = riil, E12). Produk dengan pajak 10% vs 20% = selisih 0,6–1% per tahun yang <em>compounding</em> (E3) — signifikan dalam 10 tahun.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: SBN vs Deposito (Setelah Pajak)</h2>
      <p>Duel yang adil: kupon vs bunga, <strong>setelah</strong> PPh final. Ubah angka dan lihat pemenangnya.</p>
      <PyodideLab
        title="Lab 1 — Kalkulator SBN vs Deposito Neto"
        hint="Coba: kupon_sbn = 0.058 (seri baru saat bunga turun). Lalu bunga_dep = 0.06 (bank agresif). Kapan deposito menang? (Jawab: jarang — pajak SBN lebih ringan.)"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Simulasi Proteksi LPS</h2>
      <p>Uji tiga deposito: mana yang benar-benar dijamin LPS?</p>
      <PyodideLab
        title="Lab 2 — Cek Syarat Jaminan LPS"
        hint="Ubah Deposito C: bunga 0.06 -> 0.04. Statusnya berubah total! Satu angka bunga menentukan 'dijamin' vs 'tidak dijamin'."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Jalur Investasi Ritel Indonesia</h2>

      <div className="decision-card">
        <h3>1. Dana darurat &amp; kas &lt; 1 tahun → <strong>Deposito / RDPU (reksa dana pasar uang)</strong></h3>
        <p><strong>Kondisi:</strong> pokok tidak boleh berkurang.</p>
        <p><strong>Kenapa:</strong> dijamin LPS (syarat terpenuhi) / nilai stabil. Cek bunga vs penjaminan LPS!</p>
        <p><strong>Jalur:</strong> bank (cek izin OJK) — transfer ke RDN jika via sekuritas.</p>
      </div>

      <div className="decision-card">
        <h3>2. Tujuan 2–5 tahun, konservatif → <strong>SBN ritel (ORI/SR/SBR/ST)</strong></h3>
        <p><strong>Kondisi:</strong> ingin di atas deposito, dijamin negara.</p>
        <p><strong>Kenapa:</strong> kupon &gt; deposito + pajak 10% + dijamin UU. Pilih tradable (ORI/SR) jika mungkin jual di tengah jalan.</p>
        <p><strong>Jalur:</strong> mitra distribusi resmi saat masa penawaran (bank/sekuritas/fintech terdaftar).</p>
      </div>

      <div className="decision-card">
        <h3>3. Tujuan 5+ tahun, siap belajar → <strong>Saham / ETF via sekuritas</strong></h3>
        <p><strong>Kondisi:</strong> horizon panjang, tahan volatilitas.</p>
        <p><strong>Kenapa:</strong> ekspektasi return tertinggi jangka panjang; mulai dari ETF indeks/blue chip.</p>
        <p><strong>Jalur:</strong> sekuritas berizin OJK → RDN → aplikasi. Verifikasi di situs OJK dulu!</p>
      </div>

      <div className="decision-card">
        <h3>4. Ditawari &ldquo;investasi&rdquo; return fantastis → <strong>Cek 2L dulu</strong></h3>
        <p><strong>Kondisi:</strong> return &gt; 2× deposito, &ldquo;dijamin&rdquo;, diajak via grup chat.</p>
        <p><strong>Kenapa:</strong> pola klasik bodong. <strong>Legal?</strong> (cek OJK/Bappebti) <strong>Logis?</strong> (E2: return tanpa risiko = mustahil).</p>
        <p><strong>Jalur:</strong> laporkan ke Satgas PASTI OJK jika mencurigakan.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>2L sebelum setor dana:</strong> Legal (cek OJK) + Logis (return masuk akal).</li>
          <li><strong>Bandingkan selalu NETO</strong> (setelah pajak) — bukan angka brosur.</li>
          <li><strong>&ldquo;Dijamin&rdquo; ada macamnya:</strong> LPS = simpanan bank bersyarat; SBN = dijamin UU; saham/reksa dana = TIDAK dijamin.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Portofolio Pertama Rp50 Juta</h2>
      <div className="callout">
        <p>Dinda, 28 tahun, punya Rp50 juta (di luar dana darurat yang sudah aman di deposito). Tujuan: DP rumah 4 tahun lagi. Ia tergoda: (A) &ldquo;all-in saham gorengan yang lagi viral&rdquo;, (B) deposito 5%, (C) ORI kupon 6,4%.</p>
        <p><strong>Pertanyaan:</strong> (a) Evaluasi tiap opsi untuk horizon 4 tahun. (b) Hitung perkiraan hasil neto (setelah pajak) opsi B vs C. (c) Rekomendasimu + satu peringatan untuk opsi terpilih.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>A: tolak</strong> — horizon 4 tahun terlalu pendek untuk saham spekulatif; risiko &gt;50% rugi tidak sepadan. <strong>B: aman tapi termurah</strong> — neto 4%. <strong>C: terbaik</strong> — dijamin negara, kupon di atas deposito, pajak lebih ringan.</p>
          <p>(b) B: 50 × (1,04)⁴ = Rp58,5 jt. C: 50 × (1+0,064×0,9)⁴ = 50 × (1,0576)⁴ = <strong>Rp61,9 jt</strong>. Selisih Rp3,4 jt — &ldquo;gratis&rdquo; dari pilihan cerdas.</p>
          <p>(c) <strong>Rekomendasi: ORI</strong> (tradable — bisa jual jika DP dimajukan). <strong>Peringatan:</strong> jika BI menaikkan bunga tajam, harga pasar ORI turun (E4!) — jadi <strong>niatkan pegang sampai jatuh tempo</strong> kecuali darurat; atau pilih SBR (non-tradable, tanpa risiko harga) jika yakin tidak butuh jual.</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Pajak — Berapa yang Benar-Benar Kamu Terima?</h2>
      <p>Kamu menerima <strong>kupon ORI Rp6 juta/tahun</strong> dan <strong>dividen saham Rp4 juta</strong>. Keduanya kena <strong>PPh final 10%</strong>. Berapa bersihnya — dan apa bedanya dengan &ldquo;pajak progresif&rdquo;?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Kupon:</strong> 6.000.000 × 10% = Rp600.000 pajak &rarr; bersih <strong>Rp5.400.000</strong>.</p>
        <p><strong>Langkah 2 — Dividen:</strong> 4.000.000 × 10% = Rp400.000 pajak &rarr; bersih <strong>Rp3.600.000</strong>.</p>
        <p><strong>Langkah 3 — Arti &ldquo;final&rdquo;:</strong> pajak 10% ini <strong>final</strong> — dipotong di sumber, tidak perlu dilaporkan lagi di SPT sebagai penghasilan kena pajak progresif. Beda dengan gaji (PPh 21 progresif 5–35%): makin besar penghasilanmu, makin besar tarifnya.</p>
        <p><strong>Implikasi perbandingan:</strong> deposito Rp1 M @ 4% = bunga Rp40 jt − PPh final 20% (deposito!) = <strong>Rp32 jt bersih</strong>. ORI Rp1 M @ 6% = Rp60 jt − 10% = <strong>Rp54 jt bersih</strong>. Perbandingan &ldquo;4% vs 6%&rdquo; terlihat selisih 2% — setelah pajak selisihnya <strong>2,2%</strong> (3,2% vs 5,4%). <strong>Selalu bandingkan return <em>setelah pajak</em></strong> — E7 mengajarkan tiga rasa return; pajak adalah bumbu keempat khas Indonesia.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Simulasi Klaim LPS — Kapan &ldquo;Dijamin&rdquo; Berlaku?</h2>
      <p>Bu Sari menyimpan <strong>Rp5 miliar</strong> di Bank Sehat (bunga 7%), dan Rp500 juta di Bank Kecil (bunga 4%, tercatat resmi). Bank Kecil dicabut izinnya. Berapa yang dijamin LPS?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Syarat LPS (tiga serangkai):</strong> (1) simpanan <strong>tercatat</strong> di bank; (2) bunga <strong>tidak melebihi</strong> tingkat penjaminan LPS; (3) tidak terindikasi <strong>fraud</strong>/rekayasa.</p>
        <p><strong>Langkah 1 — Batas nilai:</strong> penjaminan s.d. <strong>Rp2 miliar per nasabah per bank</strong> (pokok + bunga yang layak).</p>
        <p><strong>Langkah 2 — Kasus Bank Kecil:</strong> Rp500 juta &lt; Rp2 M, bunga 4% wajar, tercatat &rarr; <strong>dijamin penuh Rp500 juta</strong>. ✓</p>
        <p><strong>Langkah 3 — Kasus Bank Sehat (ilustrasi jika dicabut):</strong> Rp5 M &gt; Rp2 M &rarr; <strong>hanya Rp2 M dijamin</strong>, sisanya Rp3 M menjadi kreditor likuidasi (antre, bisa bertahun-tahun, bisa tidak kembali penuh). Plus: bunga 7% — jika melebihi tingkat penjaminan LPS saat itu, <strong>seluruhnya gugur</strong> dari penjaminan!</p>
        <p><strong>Intuisi:</strong> &ldquo;dijamin LPS&rdquo; = <strong>bersyarat &amp; berbatas</strong> — bukan mantra. Strategi praktis: pecah dana besar ke beberapa bank (tiap bank s.d. Rp2 M), pastikan bunga di bawah ambang LPS, dan simpan bukti tercatat. Penipu menjual versi <em>tanpa syaratnya</em> — sekarang kamu tahu syaratnya.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: Tiga Wajah Kegagalan — 1998, Jiwasraya, Binomo</h2>
      <ul>
        <li><strong>1998 — BLBI:</strong> krisis perbankan; pemerintah menggelontorkan <strong>Bantuan Likuiditas BI (Rp144+ triliun)</strong> ke bank-bank kolaps — sebagian diselewengkan pemiliknya. Lahirnya <strong>LPS</strong> (2004) &amp; kerangka resolusi bank justru dari trauma ini: agar krisis berikutnya tidak dibayar APBN membabi-buta.</li>
        <li><strong>Jiwasraya &amp; Asabri (2019–2020):</strong> BUMN asuransi gagal bayar polis <strong>puluhan triliun rupiah</strong> — produk &ldquo;asuransi + investasi&rdquo; (<em>bancassurance</em>) yang dijanjikan return tinggi ternyata diinvestasikan ke saham gorengan. Pelajaran: <strong>label &ldquo;BUMN&rdquo; ≠ jaminan</strong>; produk hibrida (asuransi rasa investasi) = instrumen yang <em>aturan mainnya</em> (E2!) tidak dipahami pembelinya.</li>
        <li><strong>Binomo/Quotex (2022):</strong> <em>binary option</em> berkedok &ldquo;trading&rdquo; — afiliator pamer Lamborghini, korban rugi miliaran. Bappebti menegaskan: <strong>ilegal</strong> (bukan pialang berjangka berizin). Pelajaran: <strong>ciri investasi bodong</strong> = return pasti + tinggi + &ldquo;rahasia sistem&rdquo; + afiliasi berjenjang + tekanan &ldquo;slot terbatas&rdquo;. Lima-limanya muncul = lari.</li>
      </ul>
      <p><strong>Benang merah:</strong> ketiganya mengeksploitasi <strong>asimetri informasi + kepercayaan pada label</strong> (&ldquo;bank&rdquo;, &ldquo;BUMN&rdquo;, &ldquo;trading&rdquo;). Pertahananmu = <strong>verifikasi independen</strong> (lihat Pendalaman) + pemahaman aturan main (E2) + skeptisisme pada &ldquo;pasti&rdquo; (E7).</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> peta wasit Indonesia — <strong>OJK</strong>: bank, pasar modal, asuransi, dana pensiun, fintech lending (perlindungan konsumen keuangan); <strong>BI</strong>: moneter, kurs, sistem pembayaran; <strong>Bappebti</strong>: berjangka komoditi, <em>aset kripto</em>; <strong>LPS</strong>: penjamin simpanan. Ditawari &ldquo;investasi kripto dijamin OJK&rdquo;? <strong>Salah alamat wasit</strong> = sinyal penipuan (kripto = Bappebti). Penipu mengandalkan kamu tidak tahu peta ini.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Sudah terdaftar di OJK = pasti aman &amp; pasti untung.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> izin OJK = <strong>legal beroperasi</strong>, bukan <strong>jaminan untung</strong> — apalagi jaminan pokok kembali. Reksa dana berizin OJK <em>bisa</em> rugi (risiko pasar!). &ldquo;Terdaftar OJK&rdquo; menjawab <em>&ldquo;apakah ini legal?&rdquo;</em> — bukan <em>&ldquo;apakah ini bagus?&rdquo;</em> Dua pertanyaan berbeda; penipu menjual jawaban pertanyaan pertama seolah menjawab yang kedua.</p>
      </div>

      <h2 id="ceklegal">🔧 Pendalaman: Cara Cek Legalitas dalam 2 Menit</h2>
      <p>Sebelum transfer <em>sepuluh ribu rupiah pun</em> ke platform investasi:</p>
      <ol>
        <li><strong>Cek daftar resmi:</strong> situs OJK (daftar perusahaan berizin), Bappebti (pialang berjangka &amp; pedagang kripto berizin). <strong>Nama mirip ≠ sama</strong> — penipu memakai nama &ldquo;PT Dana Investasi Berjangka&rdquo; yang mirip perusahaan asli.</li>
        <li><strong>Cek Satgas PASTI:</strong> OJK mempublikasikan daftar <strong>entitas ilegal</strong> yang dihentikan. Cari namanya di sana.</li>
        <li><strong>Uji lima ciri bodong:</strong> return pasti + tinggi? &ldquo;Sistem rahasia&rdquo;? Bonus rekrut anggota? Tekanan waktu? Testimoni kemewahan afiliator? <strong>Dua &ldquo;ya&rdquo; = jangan.</strong></li>
        <li><strong>Uji penarikan kecil:</strong> platform bodong sering <em>memperlancar</em> penarikan kecil (umpan!) lalu mengunci penarikan besar (&ldquo;bayar pajak dulu&rdquo;, &ldquo;upgrade VIP&rdquo;). Minta penarikan kecil <strong>bukan</strong> bukti legalitas.</li>
      </ol>
      <p><strong>Kalimat pamungkas:</strong> <em>&ldquo;Jika kamu tidak bisa menjelaskan dari mana untungnya dalam 3 kalimat (E2!), jangan taruh uangmu di sana.&rdquo;</em> — aturan ini saja sudah menyelamatkan dari 90% skema bodong.</p>


      <h2 id="kendaraan">🔧 Pendalaman: Memilih Kendaraan Investasi yang Tepat</h2>
      <p>Investor pemula Indonesia menghadapi tiga &ldquo;kendaraan&rdquo; utama ke pasar saham. Pilih dengan matriks ini:</p>
      <div style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead><tr><th>Aspek</th><th>Saham langsung</th><th>Reksa dana saham</th><th>ETF indeks</th></tr></thead>
        <tbody>
          <tr><td>Modal minimum</td><td>1 lot (~Rp5 rb–jutaan)</td><td>Rp10–100 rb</td><td>1 lot</td></tr>
          <tr><td>Biaya tahunan</td><td>Fee transaksi saja</td><td>1–3% (manajer + bank kustodian)</td><td>~0,1–0,5%</td></tr>
          <tr><td>Diversifikasi</td><td>Manual (butuh modal besar)</td><td>Otomatis</td><td>Otomatis (ikut indeks)</td></tr>
          <tr><td>Kontrol</td><td>Penuh</td><td>Nol (ikut manajer)</td><td>Ikut indeks</td></tr>
          <tr><td>Cocok untuk</td><td>Yang mau belajar analisis</td><td>Nabung rutin autopilot</td><td>Inti portofolio murah</td></tr>
        </tbody>
      </table>
      </div>
      <p><strong>Rekomendasi berlapis (bukan nasihat personal!):</strong> <strong>fondasi</strong> = ETF indeks berbiaya rendah (aritmetika fee E16!); <strong>satelit belajar</strong> = 1–3 saham pilihan untuk melatih analisis (E18!) dengan uang yang <em>rela hilang</em>; <strong>autopilot</strong> = reksa dana untuk nabung rutin jika tidak mau repot. Hindari: reksa dana saham berfee 3% <em>tanpa</em> alpha terbukti (E9!) — kamu membayar mahal untuk hasil indeks.</p>
      <h2 id="worked4">🔬 Worked Example: Rp10 Juta/Bulan, 10 Tahun — Biaya Menentukan Pemenang</h2>
      <p>Nabung <strong>Rp10 juta/bulan</strong> selama 10 tahun (total setor Rp1,2 M), return pasar kotor 10%/tahun. Bandingkan: (A) reksa dana aktif fee 2,5%; (B) ETF fee 0,3%.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Rumus nilai anuitas masa depan:</strong> <Tex math={String.raw`FV = PMT \times \frac{(1+r)^n - 1}{r}`} />, dengan PMT = 120 jt/tahun, r = return bersih, n = 10.</p>
        <p><strong>(A) fee 2,5%:</strong> r = 7,5%. (1,075)<sup>10</sup> ≈ 2,061 &rarr; FV = 120 × (1,061/0,075) = 120 × 14,147 = <strong>Rp1.698 juta</strong>.</p>
        <p><strong>(B) fee 0,3%:</strong> r = 9,7%. (1,097)<sup>10</sup> ≈ 2,522 &rarr; FV = 120 × (1,522/0,097) = 120 × 15,691 = <strong>Rp1.883 juta</strong>.</p>
        <p><strong>Selisih: Rp185 juta</strong> — dari &ldquo;hanya&rdquo; 2,2% fee! Dan ini <em>belum</em> termasuk: (a) <strong>pajak</strong> — reksa dana &amp; ETF sama-sama efisien (tidak ada dividen tunai berkala yang kena PPh 10% jika reinvestasi internal); (b) <strong>biaya transaksi</strong> beli/jual ETF (fee broker 0,15–0,25% — kecil untuk nabung rutin).</p>
        <p><strong>Intuisi penutup:</strong> Rp185 juta = <strong>1,5 tahun setoranmu</strong> — hilang menjadi fee. Sebelum memilih produk, hitung <em>total biaya 10 tahun</em> (bukan &ldquo;fee per tahun terlihat kecil&rdquo;). <strong>Biaya = satu-satunya &ldquo;return&rdquo; yang pasti negatif.</strong></p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Reksa dana = pasti lebih aman dari saham langsung.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> reksa dana saham = <strong>kumpulan saham</strong> — risikonya = risiko pasar sahamnya (bisa −30% juga!). Yang &ldquo;lebih aman&rdquo; hanya <strong>diversifikasinya</strong> (tidak all-in 1 saham) — bukan <em>perlindungan nilai</em>. &ldquo;Aman&rdquo; yang sesungguhnya hanya ada di: <strong>reksa dana pasar uang</strong> (risiko rendah, return rendah) dan <strong>deposito LPS</strong>. Jangan samakan &ldquo;dikelola profesional&rdquo; dengan &ldquo;dijamin&rdquo; — manajer profesional pun rugi saat pasar jatuh (E16: 90% kalah dari indeks!).</p>
      </div>


      <h2 id="quiz">✏️ Quiz — Kit Bertahan Hidup (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. IHSG naik 2% hari ini. Artinya…"
        options={[
          "Semua saham naik 2%",
          "Indeks gabungan (tertimbang kapitalisasi) naik — saham kecil bisa saja turun",
          "Portofolioku pasti naik 2%",
          "Ekonomi tumbuh 2%",
        ]}
        correct={1}
        explanation="Benar: IHSG didominasi saham raksasa. Kenaikan indeks ≠ semua saham naik. Bandingkan portofoliomu dengan benchmark yang sesuai."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Butuh dana 2 tahun lagi, tidak mau pusing harga pasar. Pilih?"
        options={[
          "ORI (tradable)",
          "SBR/ST (non-tradable, tanpa risiko harga pasar, bisa early redemption)",
          "Saham gorengan",
          "Kripto",
        ]}
        correct={1}
        explanation="Benar: SBR/ST. Non-tradable = tidak ada harga pasar yang naik-turun; early redemption memberi jalan keluar darurat. ORI cocok jika mungkin butuh jual di pasar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Deposito Rp3 M @4% di satu bank. Yang dijamin LPS?"
        options={[
          "Rp3 M penuh",
          "Rp2 M (batas per nasabah per bank), sisanya Rp1 M tidak dijamin",
          "Tidak dijamin sama sekali",
          "Rp3 M + bunganya",
        ]}
        correct={1}
        explanation="Benar: Rp2 M (dengan syarat bunga ≤ penjaminan & tercatat). Kelebihan Rp1 M = risiko sendiri. Solusi: pecah ke 2 bank."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. 'Investasi' menawarkan 5%/BULAN, 'dijamin', tanpa izin OJK yang jelas. Respons?"
        options={[
          "Ikut — mumpung",
          "Tolak: gagal 2L (tidak Legal, tidak Logis) — pola investasi bodong; laporkan ke Satgas PASTI",
          "Ikut kecil-kecilan",
          "Tanya teman dulu",
        ]}
        correct={1}
        explanation="Benar: 5%/bulan = 80%/tahun (E3: EAR!) — tidak logis; tanpa izin = tidak legal. Ini pola Ponzi klasik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Deposito 5% vs SBN 6,4%. Keunggulan pajak SBN?"
        options={[
          "Tidak ada bedanya",
          "PPh final SBN 10% vs deposito 20% — neto SBN 5,76% vs deposito 4,00%",
          "SBN bebas pajak",
          "Deposito lebih ringan pajaknya",
        ]}
        correct={1}
        explanation="Benar: selisih pajak melebarkan keunggulan SBN. Selalu bandingkan NETO setelah pajak, bukan angka brosur."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Saham/reksa danamu tercatat di mana sehingga aman meski sekuritas bermasalah?"
        options={[
          "Di aplikasi sekuritas",
          "Di KSEI (kustodian sentral) — tercatat atas namamu via SID; settlement dijamin KPEI",
          "Di OJK",
          "Tidak tercatat di mana-mana",
        ]}
        correct={1}
        explanation="Benar: KSEI mencatat kepemilikan efek (SID), KPEI menjamin settlement. Dana nasabah wajib terpisah di RDN — inilah infrastruktur yang melindungimu."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>IDX</strong>: satu-satunya bursa; papan Utama/Pengembangan/Ekonomi Baru/Akselerasi; IHSG = tertimbang kapitalisasi.</li>
          <li><strong>SBN ritel</strong>: ORI/SR (tradable) vs SBR/ST (non-tradable, tanpa risiko harga); kupon mengikuti BI-Rate; dijamin UU.</li>
          <li><strong>BI</strong>: moneter (BI-Rate, SRBI), sistem pembayaran (QRIS/BI-FAST), stabilitas kurs (JISDOR, intervensi).</li>
          <li><strong>OJK</strong>: wasit + pelindung; 2L (Legal, Logis); laporkan bodong ke Satgas PASTI.</li>
          <li><strong>LPS</strong>: jamin simpanan bank s.d. Rp2 M <strong>bersyarat</strong> (bunga ≤ penjaminan, tercatat).</li>
          <li><strong>KSEI/KPEI/Pefindo</strong> = infrastruktur kepemilikan, settlement, pemeringkatan.</li>
          <li>Bandingkan selalu <strong>neto setelah pajak</strong>: SBN 10% vs deposito 20%.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e14-money-market" className="btn btn-secondary btn-sm">← E14</Link>
        <Link href="/learn/e16-efisiensi-pasar" className="btn btn-primary btn-sm">Next: E16 →</Link>
      </div>
    </div>
  );
}
