"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR19Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const signalData = [
    {
      x: ["URL mirip bank", "Lampiran APK", "Sense of urgency", "Minta OTP/kode", "Pengirim tak dikenal", "Typo/grammar", "Tawaran tak masuk akal"],
      y: [0.72, 0.85, 0.58, 0.90, 0.45, 0.30, 0.52],
      type: "bar",
      marker: { color: "#e05252" },
      text: ["0,72", "0,85", "0,58", "0,90", "0,45", "0,30", "0,52"],
      textposition: "outside",
    },
  ];

  const llmUseData = [
    {
      x: ["Ringkas kasus", "Draf narasi STR", "Klasifikasi pesan", "Tanya-jawab SOP", "Keputusan blokir otomatis", "Interogasi nasabah"],
      y: [90, 75, 80, 85, 15, 10],
      type: "bar",
      marker: { color: ["#7bc96f", "#7bc96f", "#7bc96f", "#7bc96f", "#e05252", "#e05252"] },
      text: ["90%", "75%", "80%", "85%", "15%", "10%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Detektor phishing berbasis TEKS: fitur linguistik sederhana
# Fitur: (1) kata urgensi, (2) minta kode/OTP, (3) URL mencurigakan, (4) pengirim asing
pesan = [
    ("Segera verifikasi akun Anda! Klik http://nusabank-verif.xyz dan masukkan kode OTP.", 1),
    ("Halo, ini Budi. Besok jadi futsal jam 7 ya?", 0),
    ("SELAMAT! Anda menang Rp100 juta! Kirim kode verifikasi ke nomor ini untuk klaim.", 1),
    ("Paket Anda tiba hari ini. Lacak di aplikasi resmi ya.", 0),
    ("Akun DANA Anda diblokir sementara. Unduh apk.dana-fix.com untuk buka blokir.", 1),
]

URGENSI = ["segera", "sekarang", "terakhir", "blokir", "selamat", "menang"]
MINTA_KODE = ["otp", "kode verifikasi", "kode", "pin"]

def fitur_teks(t):
    t = t.lower()
    f_urgensi = sum(1 for w in URGENSI if w in t)
    f_kode = sum(1 for w in MINTA_KODE if w in t)
    f_url = 1 if ("http" in t and not "resmi" in t) else 0
    f_apk = 1 if "apk" in t or ".xyz" in t else 0
    return f_urgensi, f_kode, f_url, f_apk

print(f"{'Pesan':8s} {'Urgensi':>7s} {'Kode':>4s} {'URL?':>4s} {'APK?':>4s}  Skor")
for i, (t, y) in enumerate(pesan):
    f = fitur_teks(t)
    skor = f[0]*1 + f[1]*3 + f[2]*2 + f[3]*4
    asli = "phishing" if y else "normal"
    vonis = "🚨 PHISHING" if skor >= 4 else "✅ normal"
    print(f"Pesan {i+1}: {f[0]:7d} {f[1]:4d} {f[2]:4d} {f[3]:4d}  skor={skor} {vonis} (asli: {asli})")
print()
print("COBA UBAH: tambah pesan phishing BARU dengan gaya berbeda.")
print("Apakah tertangkap? Pelajaran: rule teks RAPUH terhadap parafrase —")
print("penipu tinggal ganti kata. Inilah kenapa butuh model bahasa, bukan keyword.")`;

  const lab2Code = `# Batasan LLM: halusinasi pada 'fakta' investigasi
# Simulasi: LLM merangkum kasus. Kadang ia 'mengarang' detail yang meyakinkan.
import random
random.seed(59)

# Fakta kasus (ground truth)
fakta = {"nominal": "Rp4,4 M", "periode": "3-12 Okt", "n_setoran": 9, "tipologi": "structuring"}

# Simulasi 10 ringkasan LLM: 80% akurat, 20% ada 1 detail halusinasi
def ringkasan_llm():
    r = dict(fakta)
    if random.random() < 0.2:
        r["n_setoran"] = 12  # halusinasi: angka berubah, terlihat meyakinkan!
    return r

benar = 0
for i in range(10):
    r = ringkasan_llm()
    ok = r == fakta
    benar += ok
    print(f"Ringkasan {i+1:2d}: {r['n_setoran']} setoran, {r['nominal']}  {'✅' if ok else '❌ HALUSINASI'}")
print(f"\nAkurat: {benar}/10")
print()
print("Pelajaran PENTING: halusinasi LLM terlihat MEYAKINKAN (12 vs 9 —")
print("siapa yang mengecek?). Untuk narasi STR (FR15) = BAHAYA HUKUM.")
print("Aturan: LLM untuk DRAF, manusia untuk FAKTA. Verifikasi angka selalu.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR19 — Fraud / ML Analytics</span>
        <h1 className="display-title">Kata-Kata Penipu:<br />NLP Melawan Phishing &amp; Batasan LLM</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Undangan Nikah&rdquo; yang Menguras Rp800 Juta</a></li>
          <li><a href="#anatomi">Anatomi Pesan Phishing: 7 Sinyal Linguistik</a></li>
          <li><a href="#nlp">NLP untuk Deteksi: Dari Keyword ke Model Bahasa</a></li>
          <li><a href="#behavioral">Behavioral: Cara Mengetik Mengkhianati Bot</a></li>
          <li><a href="#llm">LLM untuk Operasional: Apa yang Boleh &amp; Tidak</a></li>
          <li><a href="#batasan">Batasan LLM: Halusinasi, Prompt Injection, Biaya</a></li>
          <li><a href="#lab1">🔬 Lab 1: Detektor Phishing Berbasis Teks</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Halusinasi LLM</a></li>
          <li><a href="#worked">📐 Worked Example: TF-IDF &amp; Rule Linguistik</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Bahasa adalah Senjata dan Tameng</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Tugas LLM yang Aman</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Teks, Metadata, atau Behavioral?</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: &ldquo;Paket Tertahan Bea Cukai&rdquo;</a></li>

          <li><a href="#case">📋 Mini-Case: 10.000 Pesan WA — Saring Ancaman</a></li>
          <li><a href="#faq">❓ Tanya Jawab: NLP &amp; Phishing</a></li>

          <li><a href="#latihan">Latihan Mandiri: Membaca Seperti Korban Tenang</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Mengidentifikasi <strong>7 sinyal linguistik phishing</strong> pada pesan teks.</li>
          <li>Menjelaskan evolusi <strong>deteksi teks</strong>: keyword → TF-IDF → model bahasa.</li>
          <li>Menjelaskan <strong>sinyal behavioral</strong> (keystroke, navigasi) untuk membedakan manusia vs bot.</li>
          <li>Menentukan <strong>tugas LLM yang aman vs berbahaya</strong> dalam operasi fraud, beserta batasannya.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;Undangan Nikah&rdquo; yang Menguras Rp800 Juta</h2>
      <div className="story">
        <p>Pesan WA itu sempurna: <em>&ldquo;Assalamualaikum, tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu ke pernikahan putri kami…&rdquo;</em> — dengan foto mempelai, nama jelas, tanggal jelas. Bahasa Indonesia yang <strong>sopan dan benar</strong>. Korban mengklik &ldquo;Lihat Undangan&rdquo; → unduh APK → 20 menit kemudian Rp800 juta hilang (kasus NusaBank, FR2).</p>
        <p>Yang mengerikan: <strong>tidak ada sinyal phishing klasik</strong>. Tidak ada typo. Tidak ada &ldquo;SELAMAT ANDA MENANG!!!&rdquo;. Tidak ada urgensi kasar. Filter keyword tim bank — yang mencari &ldquo;otp&rdquo;, &ldquo;menang&rdquo;, &ldquo;segera&rdquo; — <strong>melewatkannya tanpa suara</strong>.</p>
        <p>Twist-nya: pesan itu <strong>ditulis oleh LLM</strong> — penipu kini memakai AI untuk membuat phishing yang <em>lebih sopan dan lebih meyakinkan</em> daripada kebanyakan pesan asli. Perlombaan senjata telah berubah: <strong>AI melawan AI</strong>. Lesson ini: bagaimana NLP mendeteksi pesan jahat — dan bagaimana LLM bisa membantu operasi (dengan batas yang jelas!).</p>
      </div>

      <h2 id="anatomi">Anatomi Pesan Phishing: 7 Sinyal Linguistik</h2>
      <p>Phishing klasik meninggalkan jejak bahasa. Tujuh sinyal, dari terkuat:</p>

      <PlotlyChart
        data={signalData}
        title="Kekuatan Sinyal Linguistik Phishing (ilustrasi, information value)"
        layout={{ xaxis: { title: "Sinyal" }, yaxis: { title: "Information value" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = kekuatan satu sinyal teks memisahkan phishing vs normal.</p>
        <p><strong>Interpretasi:</strong> <strong>&ldquo;minta OTP/kode&rdquo; (0,90)</strong> dan <strong>lampiran APK (0,85)</strong> adalah raja — hampir tidak pernah muncul di pesan legit. Tapi perhatikan: <strong>typo/grammar (0,30) paling lemah</strong> — karena LLM kini menulis phishing tanpa typo! <strong>Pelajaran:</strong> sinyal yang dulu kuat (typo) sudah mati; sinyal perilaku (minta kode, kirim APK) yang bertahan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> phishing mengeksploitasi <strong>psikologi</strong>, bukan teknologi: urgensi (&ldquo;segera!&rdquo;), otoritas (&ldquo;dari bank&rdquo;), keserakahan (&ldquo;menang Rp100 jt&rdquo;), dan <strong>konteks sosial</strong> (&ldquo;undangan nikah&rdquo;). Sinyal linguistik terkuat = yang menuntut <strong>aksi berbahaya</strong> (klik link asing, instal APK, berikan kode) — bukan yang &ldquo;terdengar aneh&rdquo;.</p>
      </div>

      <h2 id="nlp">NLP untuk Deteksi: Dari Keyword ke Model Bahasa</h2>
      <p><strong>Evolusi tiga generasi:</strong></p>
      <ol>
        <li><strong>Keyword/blacklist</strong> (&ldquo;otp&rdquo;, &ldquo;menang&rdquo;): cepat, murah — <strong>rapuh</strong>. Penipu parafrase (&ldquo;k0de&rdquo;, &ldquo;h4diah&rdquo;) dan lolos. Kasus &ldquo;undangan nikah&rdquo; lolos total.</li>
        <li><strong>TF-IDF + classifier:</strong> bobot kata berdasarkan kelangkaan; &ldquo;verifikasi&rdquo; di pesan bank palsu = curiga. Lebih tahan parafrase sederhana, tapi buta <strong>konteks</strong> (&ldquo;klik link ini&rdquo; vs &ldquo;jangan klik link&rdquo;).</li>
        <li><strong>Model bahasa (BERT dkk.):</strong> paham konteks &amp; maksud — &ldquo;undangan nikah&rdquo; + &ldquo;unduh APK&rdquo; = kombinasi mematikan walau tiap kata &ldquo;normal&rdquo;. <strong>Generasi saat ini.</strong></li>
      </ol>
      <p><strong>Fitur teks untuk model fraud</strong> (bisa digabung ke FR7): skor phishing pesan, keberadaan URL asing, permintaan kredensial, urgensi linguistik — sebagai <strong>fitur</strong>, bukan vonis tunggal.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Filter keyword cukup untuk phishing.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> keyword = pertahanan generasi pertama melawan musuh generasi ketiga (LLM). Penipu kini <em>menguji</em> pesannya terhadap filter umum sebelum blast. Yang bertahan: <strong>analisis maksud</strong> (model bahasa) + <strong>sinyal aksi</strong> (apakah pesan meminta instal/klik/berikan kode?).</p>
      </div>

      <h2 id="behavioral">Behavioral: Cara Mengetik Mengkhianati Bot</h2>
      <p>Saat teks bisa dipalsukan sempurna oleh LLM, <strong>perilaku</strong> menjadi garis pertahanan:</p>
      <ul>
        <li><strong>Keystroke dynamics:</strong> kecepatan ketik, jeda antar tombol, pola hapus — manusia tidak konsisten; bot terlalu sempurna (atau terlalu acak).</li>
        <li><strong>Navigasi:</strong> manusia membaca-baca (scroll, jeda); bot langsung ke tombol &ldquo;transfer&rdquo; (atau penipu manusia terlalu lama membaca karena takut salah).</li>
        <li><strong>Copy-paste:</strong> nomor rekening di-paste (bukan diketik) = sinyal &ldquo;disuruh&rdquo; — khas korban APP scam yang didikte penipu via telepon!</li>
      </ul>
      <p><strong>Ingat FR17 (privasi):</strong> keystroke = data invasif. Kumpulkan <strong>agregat</strong> (kecepatan rata-rata sesi) bukan <strong>rekaman mentah</strong> (tiap tombol) — gain mirip, risiko jauh lebih kecil.</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> teks = <em>apa yang dikatakan</em> (bisa dipalsukan AI); perilaku = <em>bagaimana dilakukan</em> (jauh lebih sulit dipalsukan). Pertahanan berlapis: NLP menilai <strong>pesan</strong>, behavioral menilai <strong>pelaku</strong>.</p>
      </div>

      <h2 id="llm">LLM untuk Operasional: Apa yang Boleh &amp; Tidak</h2>

      <PlotlyChart
        data={llmUseData}
        title="Kelayakan Tugas LLM di Operasi Fraud (%, ilustrasi)"
        layout={{ xaxis: { title: "Tugas" }, yaxis: { title: "Kelayakan (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = seberapa aman/layak tugas itu diserahkan ke LLM (dengan pengawasan manusia).</p>
        <p><strong>Interpretasi:</strong> <strong>hijau (75–90%)</strong> = tugas bahasa/ringkasan dengan verifikasi manusia — LLM unggul. <strong>Merah (10–15%)</strong> = keputusan berdampak (blokir, interogasi) — <strong>jangan</strong>. Polanya jelas: <strong>LLM untuk <em>membantu berpikir</em>, bukan <em>menggantikan keputusan</em></strong>.</p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Boleh (dengan verifikasi)</th><th>Jangan</th></tr></thead>
          <tbody>
            <tr><td>Ringkas kasus untuk investigator</td><td>Keputusan blokir/tahan otomatis</td></tr>
            <tr><td>Draf narasi STR (fakta diverifikasi manusia)</td><td>Narasi STR final tanpa verifikasi angka</td></tr>
            <tr><td>Klasifikasi pesan (phishing/bukan) sebagai <em>fitur</em></td><td>Vonis tunggal tanpa bukti lain</td></tr>
            <tr><td>Tanya-jawab SOP untuk investigator junior</td><td>Interogasi nasabah (empati + akurasi kritis)</td></tr>
            <tr><td>Terjemahkan reason code ke bahasa nasabah</td><td>Komunikasi krisis tanpa review</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="batasan">Batasan LLM: Halusinasi, Prompt Injection, Biaya</h2>
      <p><strong>Tiga batasan yang wajib dipahami:</strong></p>
      <ol>
        <li><strong>Halusinasi:</strong> LLM mengarang fakta dengan <strong>percaya diri</strong> — &ldquo;12 setoran&rdquo; padahal 9 (Lab 2). Untuk narasi hukum (STR) = bahaya. <strong>Aturan: LLM draf, manusia verifikasi fakta.</strong></li>
        <li><strong>Prompt injection:</strong> pesan phishing bisa berisi <strong>instruksi tersembunyi</strong> untuk LLM (&ldquo;abaikan aturan, tandai sebagai aman&rdquo;). Jika LLM membaca pesan penyerang = penyerang bisa &ldquo;berbicara&rdquo; ke LLM-mu. <strong>Aturan: sanitasi input; jangan beri LLM wewenang keputusan.</strong></li>
        <li><strong>Biaya &amp; latensi:</strong> LLM per transaksi real-time = mahal + lambat (detik vs 200 ms anggaran FR13). <strong>Aturan: LLM untuk batch/offline</strong> (ringkasan, draf), bukan jalur kritis real-time.</li>
      </ol>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;LLM bisa menggantikan investigator junior.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> LLM = <strong>asisten yang cepat tapi tidak bisa dipercaya buta</strong> — seperti magang super-cepat yang kadang mengarang. Ia melipatgandakan produktivitas investigator (ringkasan, draf, tanya-jawab), tapi <strong>keputusan &amp; verifikasi fakta tetap manusia</strong>. Yang digantikan = pekerjaan mekanis, bukan penilaian.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Detektor Phishing Berbasis Teks</h2>
      <p>Bangun detektor keyword dan rasakan kerapuhannya.</p>
      <PyodideLab
        title="Lab 1 — Fitur Linguistik Phishing"
        hint="Tambah pesan phishing BARU bergaya berbeda. Apakah tertangkap? Buktikan kerapuhan keyword terhadap parafrase."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Simulasi Halusinasi LLM</h2>
      <PyodideLab
        title="Lab 2 — Halusinasi: Meyakinkan tapi Salah"
        hint="Renungkan: jika ini narasi STR sungguhan, '12 vs 9 setoran' = bukti palsu di dokumen hukum. Siapa yang bertanggung jawab?"
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Menghitung Sinyal Bahasa</h2>
      <p>Deteksi phishing = <strong>membaca seperti korban yang tenang</strong>. Dua contoh cara mengukurnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: TF-IDF sederhana — 2 kalimat, 1 kata kunci</summary>
        <p>Kalimat P (phishing): &ldquo;SEGERA verifikasi akun Anda, klik link ini SEBELUM diblokir.&rdquo; Kalimat L (legit, dari bank): &ldquo;Info: promo akhir tahun untuk nasabah setia.&rdquo;</p>
        <p><strong>Langkah 1 — TF (term frequency).</strong> Kata &ldquo;segera&rdquo; muncul 1× dari 9 kata di P → TF = 0,11. Di L: 0.</p>
        <p><strong>Langkah 2 — IDF (inverse document frequency).</strong> Dari korpus 10.000 pesan, &ldquo;segera&rdquo; muncul di 200 pesan → IDF = ln(10.000/200) = ln(50) ≈ <strong>3,91</strong>. Kata umum seperti &ldquo;info&rdquo; (muncul di 5.000 pesan): IDF = ln(2) ≈ 0,69.</p>
        <p><strong>Langkah 3 — skor.</strong> TF-IDF &ldquo;segera&rdquo; di P = 0,11 × 3,91 = <strong>0,43</strong> vs &ldquo;info&rdquo; di L = 0,11 × 0,69 = 0,08. Kata <em>urgency</em> yang jarang di pesan legit tapi sering di phishing mendapat bobot tinggi <strong>otomatis</strong> — tanpa ada yang memberi tahu model bahwa &ldquo;segera&rdquo; itu mencurigakan. Inilah keindahan TF-IDF: ia menemukan <em>kata-kata khas penjahat</em> dari data.</p>
        <p><strong>Langkah 4 — batasnya.</strong> Penjahat yang menulis &ldquo;s_e_g_e_r_a&rdquo; atau &ldquo;segera&rdquo; dalam gambar lolos dari TF-IDF teks. Maka deteksi phishing <strong>tidak boleh</strong> hanya teks — gabungkan metadata (pengirim, link, jam) &amp; behavioral (FR: lesson inti).</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: rule urgency — presisi vs cakupan</summary>
        <p>Rule: <em>flag jika pesan mengandung ≥ 2 kata dari daftar urgency</em> (segera, terakhir, blokir, verifikasi, hadiah, menang, klik, transfer).</p>
        <p><strong>Evaluasi di 50.000 pesan (500 phishing terkonfirmasi):</strong> rule mem-flag 2.300 pesan, 380 di antaranya phishing. Precision = 380/2.300 = <strong>16,5%</strong>. Recall = 380/500 = <strong>76%</strong>.</p>
        <p><strong>Analisis:</strong> recall tinggi (menangkap 3 dari 4 phishing!) tapi precision rendah — 1.920 pesan legit ter-flag, termasuk <strong>promo bank yang sah</strong> (&ldquo;SEGERA klaim HADIAH akhir tahun, KLIK link ini&rdquo; — bank sungguhan menulis seperti phisher!). Inilah ironi industri: <em>marketing legit meniru bahasa penjahat</em>.</p>
        <p><strong>Perbaikan:</strong> tambahkan <strong>lapis verifikasi pengirim</strong> — rule urgency hanya memicu <em>skor</em>, bukan vonis; vonis butuh pengirim tak dikenal + link mencurigakan. Precision naik ke 41%, recall turun ke 68% — trade-off yang benar untuk menghindari &ldquo;memblokir promo bank sendiri&rdquo;. Pelajaran: <strong>fitur linguistik = radar, bukan peluru</strong>.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Bahasa adalah Senjata dan Tameng</h2>
      <p>Phisher adalah <strong>penulis persuasif profesional</strong> — ia mempelajari urgensi, otoritas, dan rasa takut lebih dalam dari kebanyakan copywriter. Melawannya dengan sekadar &ldquo;filter kata&rdquo; = melawan penulis dengan kamus. <strong>Pertahanan yang benar membaca <em>strategi</em>, bukan <em>kata</em>:</strong> siapa pengirim sebenarnya? apa yang diminta? apa konsekuensinya jika benar? Tiga pertanyaan ini tidak bisa diakali dengan sinonim.</p>
      <p>Intuisi kedua: <strong>ironisnya, marketing yang sah meniru bahasa penjahat</strong> — &ldquo;SEGERA klaim HADIAH, klik SEKARANG!&rdquo; ditulis bank sungguhan setiap hari. Artinya deteksi berbasis teks <em>saja</em> pasti menghukum yang sah. Solusinya: <strong>teks = radar, identitas pengirim = vonis</strong>. Pisahkan &ldquo;pesan ini bernada phishing&rdquo; (skor) dari &ldquo;pengirim ini bukan yang ia klaim&rdquo; (fakta). Fakta mengalahkan nada.</p>
      <p><strong>Kapan deteksi linguistik TIDAK cukup:</strong> (1) <strong>spear-phishing personal</strong> — teksnya rapi, personal, tanpa kata urgency; yang mendeteksi = <em>metadata</em> (pengirim, link, pola); (2) <strong>phishing via gambar/suara</strong> (QR code, voice cloning) — butuh OCR/analisis media; (3) <strong>pasca-klik</strong> — korban sudah memberikan OTP; yang tersisa = <em>behavioral</em> (FR3). <strong>Pertahanan berlapis bukan slogan — ia arsitektur.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> edukasi pengguna dengan <strong>pola, bukan contoh</strong>: &ldquo;instansi resmi tidak menagih via WA plus link&rdquo; (aturan abadi) mengalahkan &ldquo;waspada SMS paket&rdquo; (basi bulan depan). <strong>Aturan yang diajarkan harus lebih tahan lama dari varian serangan.</strong></p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Tugas LLM yang Aman</h2>

      <div className="decision-card">
        <h3>1. Tugas bahasa + ada verifikasi manusia → <strong>pakai LLM (ringkas, draf, terjemahkan)</strong></h3>
        <p><strong>Kenapa:</strong> di sinilah LLM unggul 10× — dengan jaring pengaman verifikasi.</p>
      </div>

      <div className="decision-card">
        <h3>2. Keputusan berdampak (blokir, tahan, lapor) → <strong>jangan serahkan ke LLM</strong></h3>
        <p><strong>Kenapa:</strong> halusinasi + prompt injection + tidak bisa diaudit = bom hukum.</p>
      </div>

      <div className="decision-card">
        <h3>3. Jalur real-time (&lt;200 ms) → <strong>jangan pakai LLM</strong></h3>
        <p><strong>Kenapa:</strong> lambat + mahal. LLM = batch/offline; model kecil = real-time.</p>
      </div>

      <div className="decision-card">
        <h3>4. Input dari penyerang (pesan phishing) → <strong>sanitasi + tanpa wewenang keputusan</strong></h3>
        <p><strong>Kenapa:</strong> prompt injection — penyerang bisa &ldquo;berbicara&rdquo; ke LLM-mu lewat teks yang ia tulis.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Sinyal teks terkuat = <strong>tuntutan aksi berbahaya</strong> (klik, instal, berikan kode) — bukan typo.</li>
          <li>NLP: keyword → model bahasa; <strong>perilaku</strong> melapisi teks.</li>
          <li>LLM = <strong>asisten</strong> (draf, ringkas), bukan <strong>pengambil keputusan</strong>.</li>
          <li>Verifikasi fakta selalu — halusinasi terlihat meyakinkan.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Tiga Lapis Deteksi Phishing</h2>
      <p>Phishing modern menyerang tiga lapisan — pertahanan harus berlapis juga:</p>
      <p><strong>Skenario A — kapan keyword rule cukup.</strong> Untuk: SMS/WA blast generik (&ldquo;paket tertahan&rdquo;) dengan pola teks stabil. Rule murah, cepat, mudah di-update saat template baru muncul. Tidak cukup untuk: spear-phishing personal (teksnya unik &amp; rapi).</p>
      <p><strong>Skenario B — kapan butuh ML/LLM.</strong> Untuk: phishing yang <em>terlihat profesional</em> — bahasa Indonesia sempurna, logo benar, domain mirip (bank-verify.net vs bank.co.id). Di sini yang membedakan bukan kata-katanya, tapi <strong>kombinasi sinyal halus</strong>: usia domain 3 hari + pengirim baru + urgency implisit + link shortener. Model embedding + metadata menangkap ini; rule kata tidak.</p>
      <p><strong>Skenario C — kapan behavioral mengalahkan keduanya.</strong> Untuk: <strong>account takeover via phishing yang berhasil</strong> — korban <em>sudah</em> memberikan OTP. Teks tidak relevan lagi; yang tersisa adalah <em>perilaku pasca-klik</em>: device baru + ganti alamat + velocity (FR3, kasus ATO). Pertahanan berlapis artinya: <strong>gagal di lapis teks ≠ kalah</strong> — lapis behavioral masih bisa menangkap.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> phisher menulis untuk <strong>manusia yang panik</strong> — deteksi terbaik membaca seperti <strong>korban yang tenang</strong>: siapa pengirimnya <em>sebenarnya</em>? ke mana link ini <em>sebenarnya</em> pergi? apa yang <em>sebenarnya</em> diminta? Tiga pertanyaan ini mengalahkan semua model bahasa — karena ia menyerang <em>asumsi</em>, bukan <em>kata</em>.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Phishing Paket &amp; Kurir Palsu</h2>
      <p>Modus yang memakan korban terbanyak 2023–2025: SMS/WA &ldquo;Paket Anda tertahan di Bea Cukai, bayar Rp25.000 untuk rilis: [link]&rdquo; — atau varian &ldquo;kurir&rdquo; yang menelepon langsung (lihat FR3).</p>
      <p><strong>Anatomi serangan (pola umum):</strong></p>
      <ol>
        <li><strong>Umpan:</strong> pesan memakai nama &amp; alamat korban yang benar (dari data bocor) — membangun kepercayaan instan.</li>
        <li><strong>Link:</strong> situs tiruan jasa ekspedisi/bea cukai — meminta &ldquo;biaya rilis&rdquo; Rp25rb via transfer/QRIS ke rekening penampung.</li>
        <li><strong>Eskalasi:</strong> setelah Rp25rb masuk, korban diminta &ldquo;verifikasi&rdquo; dengan login e-banking di situs palsu → kredensial dicuri → <strong>drain penuh</strong> (Rp25rb hanyalah tiket masuk; target sebenarnya isi rekening).</li>
      </ol>
      <p><strong>Angka ilustratif:</strong> 1 juta SMS blast × 0,5% klik × 20% korban lanjut = <strong>1.000 korban</strong>. Rata-rata kerugian Rp3,2jt (bukan Rp25rb — karena eskalasi!) = <strong>Rp3,2 miliar per kampanye</strong> — dengan biaya blast &lt; Rp5jt. ROI penjahat: 640×.</p>
      <p><strong>Pertahanan berlapis yang benar:</strong> (1) <strong>edukasi pola, bukan contoh</strong> — &ldquo;instansi resmi tidak menagih via WA + link&rdquo; (aturan abadi) vs &ldquo;waspada SMS paket&rdquo; (basi bulan depan); (2) <strong>deteksi link</strong> di level operator/platform; (3) <strong>behavioral pasca-klik</strong> — bank menangkap drain-nya walau phishing-nya lolos. Korban yang diedukasi <em>pola</em> kebal terhadap <em>varian baru</em>; korban yang diedukasi <em>contoh</em> hanya kebal terhadap contoh itu.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Orang pintar tidak kena phishing.&rdquo;<br /><strong>Yang benar:</strong> phishing modern tidak menyerang <em>kecerdasan</em> — ia menyerang <strong>konteks</strong>: kamu <em>memang</em> menunggu paket, <em>memang</em> ada tagihan, <em>memang</em> dapat THR. Korbannya termasuk profesional &amp; teknisi. Pertahanan &ldquo;edukasi agar pintar&rdquo; gagal; pertahanan &ldquo;desain agar kesalahan tidak fatal&rdquo; (limit transfer, verifikasi berlapis) yang bekerja.</p>
      </div>

      <h2 id="case">📋 Mini-Case: 10.000 Pesan WA — Saring Ancaman</h2>
      <div className="callout">
        <p>Tim cyber &ldquo;NusaBank&rdquo; menerima <strong>10.000 pesan WA</strong> yang dilaporkan nasabah sebagai &ldquo;mencurigakan&rdquo; bulan ini. Kapasitas analis: 200 pesan/hari. Sebagian adalah phishing &ldquo;undangan nikah&rdquo; gaya baru (sopan, tanpa typo). Sebagian adalah pesan normal yang dilaporkan berlebihan.</p>
        <p><strong>Pertanyaan:</strong> rancang pipeline 3 lapis (otomatis → semi → manual) + peran LLM di tiap lapis + guardrail-nya.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Lapis 1 (otomatis, 10.000 → 1.000):</strong> model bahasa klasifikasi phishing (fitur: URL asing, permintaan APK/kode, urgensi) + deduplikasi (pesan blast yang sama = 1 kasus). <strong>Bukan keyword</strong> — kasus &ldquo;undangan nikah&rdquo; membuktikan keyword mati.</p>
          <p><strong>Lapis 2 (semi, 1.000 → 200):</strong> LLM <strong>merangkum cluster</strong> pesan serupa (&ldquo;300 pesan varian undangan nikah, pola: APK + nama acak&rdquo;) → analis verifikasi 1 ringkasan, bukan 300 pesan. <strong>LLM di sini = peringkas, bukan penilai.</strong></p>
          <p><strong>Lapis 3 (manual, 200):</strong> analis investigasi pola baru; temuan → rule/filter baru + edukasi nasabah.</p>
          <p><strong>Guardrail:</strong> (1) LLM tidak memutuskan blokir nomor — hanya merangkum; (2) angka di ringkasan diverifikasi analis sebelum jadi laporan; (3) pesan penyerang tidak pernah jadi prompt langsung ke LLM berwewenang. <strong>Pelajaran:</strong> arsitektur yang benar menempatkan AI di <em>posisi yang tepat</em> — bukan &ldquo;AI di mana-mana&rdquo;.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: NLP &amp; Phishing</h2>
      <details className="worked">
        <summary>Q1: Bisakah LLM dipakai untuk deteksi phishing?</summary>
        <p><strong>Bisa, dengan hati-hati.</strong> LLM hebat membaca <em>nuansa</em> (tekanan psikologis implisit, inkonsistensi identitas) yang luput dari keyword. Tapi: (1) <strong>biaya &amp; latensi</strong> — tidak untuk semua pesan real-time; pakai untuk <em>triage kedua</em>; (2) <strong>prompt injection</strong> — phisher bisa menulis teks yang &ldquo;menipu&rdquo; LLM pemeriksa; (3) <strong>konsistensi</strong> — output LLM tidak deterministik; butuh kalibrasi. Praktik: <strong>LLM sebagai analis kedua, bukan gerbang utama.</strong></p>
      </details>
      <details className="worked">
        <summary>Q2: Bagaimana dengan phishing bahasa daerah / bahasa gaul?</summary>
        <p><strong>Ini keunggulan lokal penjahat — dan harus jadi keunggulan pertahananmu.</strong> Model multilingual generik sering lemah di bahasa daerah; <em>fine-tune</em> dengan korpus lokal atau minimal pastikan keyword list mencakup varian lokal (&ldquo;cepetan&rdquo;, &ldquo;hadiah&rdquo; versi daerah). <strong>Tim lokal yang memahami bahasa = aset deteksi</strong> yang tidak bisa dibeli dari vendor global.</p>
      </details>
      <details className="worked">
        <summary>Q3: Phishing via gambar (screenshot teks, QR code) — bagaimana?</summary>
        <p><strong>OCR + analisis gambar sebagai lapis tambahan:</strong> ekstrak teks dari gambar lalu perlakukan seperti teks biasa; untuk QR code, <em>resolve &amp; periksa URL tujuan</em> (bukan gambarnya). Penjahat memakai gambar justru untuk <em>menghindari</em> filter teks — maka <strong>setiap kanal baru yang tidak difilter = pintu belakang</strong>. Tutup semua pintu, bukan cuma pintu depan.</p>
      </details>
      <details className="worked">
        <summary>Q4: Edukasi pengguna — masih relevan?</summary>
        <p><strong>Ya, tapi ubah caranya.</strong> Edukasi &ldquo;jangan klik link mencurigakan&rdquo; gagal 20 tahun — karena <em>manusia bukan firewall</em>. Yang bekerja: (1) <strong>edukasi pola abadi</strong> (bukan contoh); (2) <strong>desain yang memaafkan kesalahan</strong> — limit transfer, jeda verifikasi, konfirmasi berlapis; (3) <strong>simulasi phishing internal</strong> untuk staf (bukan untuk mempermalukan, tapi melatih). <strong>Asumsikan pengguna AKAN klik — rancang agar kliknya tidak fatal.</strong></p>
      </details>

      <h2 id="latihan">Latihan Mandiri: Membaca Seperti Korban Tenang</h2>
      <p><strong>1.</strong> Korpus 20.000 pesan; kata &ldquo;blokir&rdquo; muncul di 400 pesan. Hitung IDF-nya. Jika TF di sebuah pesan = 0,08, berapa TF-IDF? Apa artinya angka itu?</p>
      <p><strong>2.</strong> Rule urgency (≥2 kata urgency) di 100.000 pesan: flag 4.000, 500 di antaranya phishing terkonfirmasi (total phishing 800). Hitung precision &amp; recall. Apa perbaikan pertamamu?</p>
      <p><strong>3.</strong> Kamu menerima WA: &ldquo;Paket Bapak tertahan, klik link ini untuk bayar Rp25rb.&rdquo; Terapkan 3 pertanyaan &ldquo;korban tenang&rdquo; — tulis analisismu 3 baris.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> IDF = ln(20.000/400) = ln(50) ≈ <strong>3,91</strong>. TF-IDF = 0,08 x 3,91 ≈ <strong>0,31</strong> — kata ini <em>khas</em> (jarang di pesan biasa) sehingga bobotnya tinggi otomatis.</p>
        <p><strong>2.</strong> Precision = 500/4.000 = <strong>12,5%</strong>; recall = 500/800 = <strong>62,5%</strong>. Perbaikan: <strong>tambah lapis verifikasi pengirim</strong> — teks = radar, identitas pengirim = vonis. <em>Jangan blokir promo bank sendiri.</em></p>
        <p><strong>3.</strong> (1) Siapa pengirim <em>sebenarnya</em>? Nomor tak dikenal, bukan nomor resmi ekspedisi. (2) Ke mana link <em>sebenarnya</em> pergi? Cek domain — bukan domain resmi. (3) Apa yang <em>sebenarnya</em> diminta? Uang + nanti &ldquo;verifikasi&rdquo; = kredensial. <strong>Kesimpulan: phishing.</strong></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Phishing 'undangan nikah' lolos filter keyword (tanpa typo, sopan, tanpa kata 'OTP'). Pelajaran?"
        options={[
          "Filter keyword cukup — ini kebetulan lolos",
          "Keyword rapuh terhadap parafrase & LLM; butuh analisis maksud (model bahasa) + sinyal aksi (minta instal/klik/berikan kode)",
          "Phishing tidak bisa dideteksi",
          "Blokir semua WA",
        ]}
        correct={1}
        explanation="Benar: musuh kini memakai LLM — pertahanan keyword = generasi pertama vs musuh generasi ketiga. Sinyal yang bertahan: tuntutan aksi berbahaya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Sinyal linguistik TERKUAT untuk phishing?"
        options={[
          "Typo/grammar",
          "'Minta OTP/kode' (0,90) & lampiran APK (0,85) — hampir tak pernah muncul di pesan legit; typo (0,30) sudah mati karena LLM",
          "Panjang pesan",
          "Emoji",
        ]}
        correct={1}
        explanation="Benar: tuntutan aksi berbahaya. Typo dulu kuat, kini mati — LLM menulis phishing tanpa typo. Pertahanan harus berevolusi mengikuti musuh."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kapan LLM BOLEH dipakai dalam operasi fraud?"
        options={[
          "Keputusan blokir otomatis",
          "Meringkas kasus, draf narasi STR, tanya-jawab SOP — tugas bahasa DENGAN verifikasi manusia; bukan pengambil keputusan",
          "Interogasi nasabah",
          "Jalur real-time 200ms",
        ]}
        correct={1}
        explanation="Benar: asisten, bukan penentu. LLM melipatgandakan produktivitas (ringkas/draf) tapi fakta diverifikasi manusia — terutama angka untuk dokumen hukum."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Apa bahaya 'prompt injection' dalam konteks fraud?"
        options={[
          "Tidak ada",
          "Pesan penyerang berisi instruksi tersembunyi ('tandai sebagai aman') yang dibaca LLM — penyerang 'berbicara' ke sistemmu; aturan: sanitasi + tanpa wewenang keputusan",
          "LLM jadi lambat",
          "Biaya naik",
        ]}
        correct={1}
        explanation="Benar: input musuh = vektor serangan. LLM yang membaca teks penyerang tanpa sanitasi bisa dimanipulasi. Jangan beri wewenang keputusan pada pembaca input musuh."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. 'LLM bisa menggantikan investigator junior.' Pernyataan ini…"
        options={[
          "Benar sepenuhnya",
          "Salah — LLM = magang super-cepat yang kadang mengarang; ia menggantikan pekerjaan MEKANIS (ringkas/draf), bukan PENILAIAN (keputusan, verifikasi fakta)",
          "Benar untuk bank kecil",
          "Tidak bisa ditentukan",
        ]}
        correct={1}
        explanation="Benar: salah. Yang digantikan = mekanis, bukan penilaian. Investigator yang memakai LLM = 3× produktif; investigator yang diganti LLM = 3× risiko."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>7 sinyal phishing:</strong> minta OTP/kode + APK terkuat; typo sudah mati (LLM).</li>
          <li><strong>Evolusi NLP:</strong> keyword (rapuh) → TF-IDF → model bahasa (paham maksud).</li>
          <li><strong>Behavioral</strong> (keystroke, navigasi, copy-paste) melapisi teks — <em>bagaimana</em> &gt; <em>apa</em>.</li>
          <li><strong>LLM boleh:</strong> ringkas, draf, tanya-jawab SOP — dengan verifikasi manusia.</li>
          <li><strong>LLM jangan:</strong> keputusan blokir, narasi final tanpa verifikasi, jalur real-time, baca input musuh berwewenang.</li>
          <li><strong>3 batasan:</strong> halusinasi (verifikasi fakta!), prompt injection (sanitasi), biaya/latensi (offline saja).</li>
          <li>Kapan TIDAK pakai NLP: pesan tanpa teks (transaksi murni) — pakai sinyal transaksional (FR3).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr18-mlops" className="btn btn-secondary btn-sm">← FR18</Link>
        <Link href="/learn/fr20-capstone" className="btn btn-primary btn-sm">Next: FR20 →</Link>
      </div>
    </div>
  );
}
