"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR17Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const shapData = [
    {
      x: ["velocity_1h", "device_age", "z_user", "impossible_travel", "akun_age", "nominal", "jam_aneh", "merchant_baru"],
      y: [0.31, 0.22, 0.18, 0.12, 0.08, 0.05, 0.03, 0.01],
      type: "bar",
      orientation: "h",
      marker: { color: "#2a7de1" },
      text: ["0,31", "0,22", "0,18", "0,12", "0,08", "0,05", "0,03", "0,01"],
      textposition: "outside",
    },
  ];

  const audienceData = [
    {
      x: ["Investigator", "Nasabah", "Regulator/auditor", "Data scientist"],
      y: [85, 40, 95, 70],
      type: "bar",
      marker: { color: ["#e8a838", "#2a7de1", "#e05252", "#7bc96f"] },
      text: ["85%", "40%", "95%", "70%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# SHAP inti: kontribusi tiap fitur = 'berapa skor berubah karena fitur ini'
# Model mainan: skor = 0.1*velocity + 0.3*device_baru + 0.05*z_user (simplifikasi!).
# SHAP mengukur: jika fitur ini 'disembunyikan' (diganti rata-rata), skor berubah berapa?

# Rata-rata populasi (baseline)
baseline = {"velocity": 2.0, "device_baru": 0.2, "z_user": 0.5}
# Transaksi yang ditahan
trx = {"velocity": 12.0, "device_baru": 1.0, "z_user": 8.0}
bobot = {"velocity": 0.1, "device_baru": 0.3, "z_user": 0.05}

def skor(f):
    return sum(bobot[k] * f[k] for k in f)

skor_base = skor(baseline)
skor_trx = skor(trx)
print(f"Skor baseline (rata-rata orang) : {skor_base:.2f}")
print(f"Skor transaksi ini              : {skor_trx:.2f}")
print(f"Selisih yang dijelaskan         : {skor_trx - skor_base:.2f}")
print()
print("Kontribusi tiap fitur (SHAP 1D):")
for k in trx:
    kontribusi = bobot[k] * (trx[k] - baseline[k])
    pct = kontribusi / (skor_trx - skor_base) * 100
    bar = "█" * int(pct / 5)
    print(f"  {k:12s} +{kontribusi:.2f} ({pct:4.1f}%) {bar}")
print()
print("Reason code otomatis: 'ditahan karena velocity 12x (42%), device baru (38%),'")
print()
print("COBA UBAH: trx['velocity'] 12.0 -> 3.0.")
print("Kontribusi velocity menyusut, reason code BERUBAH.")
print("Pelajaran: penjelasan HARUS spesifik per keputusan —")
print("'skor tinggi' bukan penjelasan.")`;

  const lab2Code = `# Trade-off privasi: seberapa detail data boleh dipakai?
# Skenario: 3 level pengumpulan data perilaku. Hitung 'manfaat vs risiko'.
import math

level = [
    ("L1: agregat saja",       0.80,  1),   # (nama, AUC, risiko_privasi 1-10)
    ("L2: + pola sesi",        0.86,  4),
    ("L3: + keystroke/detik",  0.89,  9),
]

print(f"{'Level':24s} {'AUC':>5s} {'Risiko':>6s}  Gain/Risiko")
for nama, auc, risiko in level:
    gain = auc - 0.80
    rasio = gain / risiko if risiko else 0
    print(f"{nama:24s} {auc:.2f}  {risiko:6d}  {rasio:.3f}")
print()
print("COBA RENUNGKAN: L2->L3 menaikkan AUC 0.03 tapi risiko 4->9.")
print("Apakah 0.03 AUC sepadan dengan 'merekam tiap ketikan nasabah'?")
print("Pelajaran: privasi = KENDALA DESAIN, bukan renungan etis belakangan.")
print("Tanyakan SEBELUM kumpulkan: 'apakah gain-nya sepadan risikonya?'")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR17 — Fraud / ML Analytics</span>
        <h1 className="display-title">&ldquo;Kenapa Ditahan?&rdquo;:<br />Explainability yang Menyelamatkan Bisnis</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Nasabah yang Menang di Pengadilan</a></li>
          <li><a href="#mengapa">Mengapa Explainability Bukan Kemewahan</a></li>
          <li><a href="#shap">SHAP: Membagi Kredit (dan Kesalahan)</a></li>
          <li><a href="#reason">Reason Code: Penjelasan untuk Manusia</a></li>
          <li><a href="#audiens">4 Audiens, 4 Bahasa</a></li>
          <li><a href="#regulasi">Regulasi &amp; Privasi: Batas-Batasnya</a></li>
          <li><a href="#lab1">🔬 Lab 1: SHAP Sederhana + Reason Code</a></li>
          <li><a href="#lab2">🔬 Lab 2: Trade-off Privasi</a></li>
          <li><a href="#worked">📐 Worked Example: Membaca SHAP &amp; Menulis Reason Code</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Penjelasan adalah Produk</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Level Penjelasan per Situasi</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Metode untuk Tiap Kebutuhan</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Nasabah Protes ke OJK</a></li>

          <li><a href="#case">📋 Mini-Case: Blokir yang Berujung Somasi</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Explainability</a></li>

          <li><a href="#latihan">Latihan Mandiri: Menulis Penjelasan</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>mengapa explainability wajib</strong> (bisnis, regulasi, operasional) — bukan sekadar &ldquo;nice to have&rdquo;.</li>
          <li>Menghitung <strong>kontribusi fitur ala SHAP</strong> dan mengubahnya menjadi reason code.</li>
          <li>Menyesuaikan <strong>level penjelasan untuk 4 audiens</strong> (investigator, nasabah, regulator, data scientist).</li>
          <li>Mengidentifikasi <strong>batas regulasi &amp; privasi</strong> (data apa boleh dipakai, apa tidak).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Nasabah yang Menang di Pengadilan</h2>
      <div className="story">
        <p>2025, seorang pengusaha menggugat banknya: rekening bisnisnya <strong>dibekukan 14 hari</strong> tanpa penjelasan — &ldquo;terdeteksi mencurigakan oleh sistem&rdquo;. Omzetnya Rp800 juta hilang. Di pengadilan, bank tidak bisa menjelaskan <strong>mengapa</strong> sistem menandainya. &ldquo;Skor model 0,87&rdquo; bukan jawaban yang diterima hakim. <strong>Bank kalah.</strong> Ganti rugi + denda + berita utama.</p>
        <p>Ironisnya: sistem itu <em>benar</em> — polanya memang structuring (terbukti kemudian). Tapi <strong>kebenaran tanpa penjelasan = tidak bisa dipertahankan</strong>. Di ruang sidang, di depan regulator, di depan nasabah yang marah — &ldquo;model bilang begitu&rdquo; bukan argumen.</p>
        <p>Twist-nya: bank saingannya memakai model yang <strong>sedikit lebih lemah</strong> (AUC 0,89 vs 0,91) tapi setiap keputusan disertai <strong>reason code</strong> otomatis: &ldquo;ditahan karena 9 setoran di bawah ambang dalam 10 hari + profil mismatch&rdquo;. Saat digugat, mereka menunjukkan logika yang bisa diperdebatkan — dan menang. Lesson ini: <strong>model yang bisa dijelaskan mengalahkan model yang sedikit lebih akurat tapi bisu</strong>.</p>
      </div>

      <h2 id="mengapa">Mengapa Explainability Bukan Kemewahan</h2>
      <p>Empat alasan — masing-masing dengan &ldquo;harga&rdquo; jika diabaikan:</p>
      <ol>
        <li><strong>Operasional:</strong> investigator butuh <em>mulai dari mana</em> — &ldquo;skor 0,87&rdquo; tidak memberi petunjuk; &ldquo;velocity 12× + device baru&rdquo; memberi (FR14).</li>
        <li><strong>Nasabah:</strong> &ldquo;kenapa transaksi saya ditahan?&rdquo; — jawaban yang masuk akal = kepercayaan; &ldquo;sistem kami&rdquo; = churn + viral.</li>
        <li><strong>Regulasi:</strong> OJK/BI menuntut keputusan otomatis yang berdampak ke nasabah <strong>bisa dijelaskan &amp; diaudit</strong>.</li>
        <li><strong>Hukum:</strong> sengketa = butuh <strong>alasan yang bisa diperdebatkan</strong> di pengadilan.</li>
      </ol>

      <PlotlyChart
        data={audienceData}
        title="Seberapa Butuh Penjelasan? (tingkat kebutuhan per audiens, ilustrasi)"
        layout={{ xaxis: { title: "Audiens" }, yaxis: { title: "Tingkat kebutuhan (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = seberapa kritis penjelasan bagi audiens itu.</p>
        <p><strong>Interpretasi:</strong> regulator (95%) dan investigator (85%) = penjelasan <strong>wajib</strong>. Nasabah (40%) = penjelasan <strong>ringkas saat diminta</strong>. <strong>Pelajaran desain:</strong> bangun <em>lapisan</em> penjelasan — detail penuh untuk investigator/auditor, ringkas untuk nasabah. Satu penjelasan untuk semua = gagal untuk semua.</p>
      </div>

      <h2 id="shap">SHAP: Membagi Kredit (dan Kesalahan)</h2>
      <p><strong>Ide inti</strong> (satu kalimat): SHAP membagi <strong>selisih skor vs rata-rata</strong> ke tiap fitur secara <strong>adil</strong> (mengikuti teori permainan Shapley — tiap fitur &ldquo;dibayar&rdquo; sesuai kontribusi marginalnya).</p>
      <p>Untuk model linear sederhana, SHAP punya bentuk tertutup yang intuitif:</p>
      <Tex math={String.raw`\phi_i = w_i \cdot (x_i - \bar{x}_i)`} block />
      <ul>
        <li><Tex math={String.raw`\phi_i`} />: kontribusi fitur ke-<Tex math={String.raw`i`} /> (nilai SHAP).</li>
        <li><Tex math={String.raw`w_i`} />: bobot fitur di model.</li>
        <li><Tex math={String.raw`x_i - \bar{x}_i`} />: seberapa jauh fitur ini dari rata-rata populasi.</li>
        <li><strong>Sifat adil:</strong> <Tex math={String.raw`\sum_i \phi_i = f(x) - f(\text{baseline})`} /> — jumlah kontribusi = selisih skor yang dijelaskan. Tidak ada yang hilang, tidak ada yang ganda.</li>
      </ul>
      <p>Untuk XGBoost, ada <strong>TreeSHAP</strong> — algoritma eksak yang cepat untuk pohon. Praktik standar industri.</p>

      <PlotlyChart
        data={shapData}
        title="SHAP Global: Fitur Paling Berpengaruh (rata-rata |SHAP|, ilustrasi)"
        layout={{ xaxis: { title: "Rata-rata |nilai SHAP|" }, yaxis: { title: "Fitur" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang horizontal = rata-rata kontribusi absolut satu fitur di seluruh data.</p>
        <p><strong>Interpretasi:</strong> <strong>velocity (0,31)</strong> mendominasi — model &ldquo;bergantung&rdquo; padanya. <strong>Dua kegunaan:</strong> (1) validasi domain — &ldquo;apakah fitur teratas masuk akal?&rdquo; (jika &ldquo;id transaksi&rdquo; teratas = bocor!); (2) simplifikasi — fitur buntut (0,01) kandidat dibuang untuk kecepatan real-time (FR13).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> SHAP menjawab <em>&ldquo;mengapa skor ini?&rdquo;</em> — bukan <em>&ldquo;mengapa fraud?&rdquo;</em>. Bedanya penting: SHAP menjelaskan <strong>model</strong>, bukan <strong>dunia</strong>. Fitur &ldquo;jam malam&rdquo; berkontribusi besar ≠ &ldquo;transaksi malam = fraud&rdquo; (bisa jadi bias data!). Jangan tertukar antara <em>penjelasan model</em> dan <em>kebenaran kausal</em>.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;SHAP bilang fitur X penting, berarti X menyebabkan fraud.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> SHAP = <strong>atribusi model</strong>, bukan <strong>kausalitas dunia</strong>. Jika data training bias (mis. investigator hanya memeriksa transaksi malam), SHAP akan &ldquo;menjelaskan&rdquo; bias itu sebagai &ldquo;penting&rdquo;. SHAP menjelaskan <em>apa yang dipelajari model</em> — termasuk kesalahannya.</p>
      </div>

      <h2 id="reason">Reason Code: Penjelasan untuk Manusia</h2>
      <p><strong>Definisi.</strong> Reason code = <strong>terjemahan SHAP/rule menjadi bahasa manusia</strong>, maksimal 2–3 alasan teratas per keputusan. Contoh:</p>
      <ul>
        <li>❌ Buruk: &ldquo;Skor 0,87. Ditahan oleh model v3.2.&rdquo;</li>
        <li>✅ Baik: &ldquo;Ditahan karena: (1) 12 transaksi/jam (normal Anda: 2), (2) device baru pertama kali, (3) lokasi berbeda pulau dari biasa.&rdquo;</li>
      </ul>
      <p><strong>Aturan desain reason code:</strong></p>
      <ul>
        <li><strong>Spesifik + kontekstual:</strong> &ldquo;12× dari normal <em>Anda</em>&rdquo; &gt; &ldquo;velocity tinggi&rdquo;.</li>
        <li><strong>Maksimal 3:</strong> lebih dari itu = tidak dibaca.</li>
        <li><strong>Bisa ditindaklanjuti:</strong> nasabah/investigator tahu <em>langkah berikutnya</em> (&ldquo;verifikasi via OTP untuk lanjutkan&rdquo;).</li>
        <li><strong>Tercatat (audit trail):</strong> tiap keputusan + reason code + versi model tersimpan — untuk regulator &amp; sengketa.</li>
      </ul>

      <h2 id="audiens">4 Audiens, 4 Bahasa</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Audiens</th><th>Butuh</th><th>Contoh</th></tr></thead>
          <tbody>
            <tr><td><strong>Investigator</strong></td><td>Detail penuh + bukti</td><td>SHAP per fitur + riwayat + graph mini + &ldquo;mulai investigasi dari sini&rdquo;</td></tr>
            <tr><td><strong>Nasabah</strong></td><td>Ringkas + empatik + solusi</td><td>&ldquo;Kami menahan sementara karena pola tak biasa. Verifikasi via OTP untuk lanjutkan.&rdquo;</td></tr>
            <tr><td><strong>Regulator/auditor</strong></td><td>Lengkap + metodologi</td><td>Definisi fitur, versi model, validasi, audit trail keputusan</td></tr>
            <tr><td><strong>Data scientist</strong></td><td>Global + debugging</td><td>SHAP global, dependence plot, &ldquo;fitur mana yang rusak?&rdquo;</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="regulasi">Regulasi &amp; Privasi: Batas-Batasnya</h2>
      <p><strong>Regulasi (Indonesia):</strong></p>
      <ul>
        <li><strong>UU PDP (Perlindungan Data Pribadi):</strong> pengumpulan data perilaku (keystroke, lokasi presisi) butuh <strong>dasar hukum + persetujuan</strong>; nasabah berhak tahu data apa dipakai untuk keputusan otomatis tentangnya.</li>
        <li><strong>OJK:</strong> keputusan otomatis berdampak signifikan ke nasabah harus <strong>bisa dijelaskan &amp; digugat</strong> (hak sanggah).</li>
        <li><strong>Prinsip:</strong> kumpulkan <strong>minimal</strong> yang dibutuhkan (data minimization) — bukan &ldquo;semua yang bisa&rdquo;.</li>
      </ul>
      <p><strong>Privasi sebagai kendala desain</strong> (bukan renungan belakangan): sebelum menambah fitur invasif (rekam ketikan, baca kontak), tanyakan: (1) <strong>gain-nya berapa?</strong> (AUC +0,03?), (2) <strong>risikonya apa?</strong> (bocor = skandal; regulasi = denda), (3) <strong>ada alternatif?</strong> (agregat anonim sering cukup). Lihat Lab 2.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Selama untuk keamanan, data apa pun boleh dikumpulkan.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> &ldquo;keamanan&rdquo; bukan cek kosong — UU PDP tetap menuntut <strong>proporsionalitas</strong>. Merekam tiap ketikan nasabah untuk gain AUC 0,03 = tidak proporsional = pelanggaran. Keamanan yang melanggar privasi = bom waktu hukum.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: SHAP Sederhana + Reason Code</h2>
      <p>Hitung kontribusi fitur dan tulis reason code-nya.</p>
      <PyodideLab
        title="Lab 1 — Dari SHAP ke Reason Code"
        hint="Ubah trx['velocity'] 12 → 3. Lihat reason code berubah — buktikan penjelasan harus spesifik per keputusan."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Trade-off Privasi</h2>
      <PyodideLab
        title="Lab 2 — Gain vs Risiko Privasi"
        hint="Renungkan: pada gain berapa kamu berani merekam ketikan nasabah? Tidak ada jawaban benar — tapi harus ada jawabannya SEBELUM kumpulkan."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Dari Skor ke Cerita yang Bisa Dipertahankan</h2>
      <p>Explainability = <strong>menerjemahkan skor menjadi alasan</strong> yang dipahami manusia yang tepat. Dua contohnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: membaca SHAP force plot (angka konkret)</summary>
        <p>Transaksi Rp7,5jt mendapat skor fraud 0,87. Baseline model (rata-rata) = 0,12. SHAP memecah selisih 0,75 menjadi kontribusi fitur:</p>
        <p><strong>Kontribusi positif (mendorong ke fraud):</strong> velocity_1h_ratio = 200 → +0,34; device_baru = ya → +0,21; nominal/p95_nasabah = 8,2 → +0,14; jam 02.40 (deviasi pola) → +0,09. <strong>Kontribusi negatif (menahan):</strong> umur_akun 4 tahun → −0,02; tidak ada histori dispute → −0,01.</p>
        <p><strong>Langkah 1 — verifikasi konsistensi.</strong> 0,12 + 0,34 + 0,21 + 0,14 + 0,09 − 0,02 − 0,01 = <strong>0,87</strong> ✓ (SHAP bersifat aditif — jumlahnya harus pas).</p>
        <p><strong>Langkah 2 — baca ceritanya.</strong> &ldquo;Transaksi ini dicurigai <strong>terutama</strong> karena velocity 200× normal (+0,34) dan device baru (+0,21) — dua sinyal terkuat. Nominal besar hanya pendukung (+0,14). Akun yang berumur menahan sedikit kecurigaan (−0,02) tapi tidak cukup.&rdquo;</p>
        <p><strong>Langkah 3 — yang TIDAK boleh disimpulkan.</strong> SHAP menjelaskan <em>model</em>, bukan <em>dunia</em>: &ldquo;velocity berkontribusi +0,34 pada skor&rdquo; ≠ &ldquo;velocity <em>menyebabkan</em> fraud&rdquo;. Untuk investigator ini cukup; untuk klaim kausal butuh analisis terpisah. <strong>Jelaskan model dengan jujur, jangan lebihkan.</strong></p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: menulis reason code untuk tiga penonton</summary>
        <p>Satu keputusan (blokir transaksi Rp7,5jt di atas), tiga versi penjelasan:</p>
        <p><strong>Untuk investigator (teknis):</strong> &ldquo;Skor 0,87. Pemicu utama: velocity_1h 200× baseline (4 trx/15 mnt), device fingerprint baru, nominal 8,2× p95 nasabah. Penahan: akun 4 tahun, histori bersih. Rekomendasi: verifikasi via telepon sebelum lepas blokir.&rdquo;</p>
        <p><strong>Untuk nasabah (sederhana &amp; empatik):</strong> &ldquo;Kami menahan sementara transaksi ini karena pola yang tidak biasa: beberapa transaksi cepat dari perangkat baru pada jam tidak biasa. Ini untuk melindungi akun Anda. Hubungi kami untuk verifikasi 2 menit.&rdquo; — <em>tanpa</em> menyebut skor, SHAP, atau &ldquo;fraud&rdquo;.</p>
        <p><strong>Untuk regulator/auditor (formal):</strong> &ldquo;Keputusan blokir otomatis berdasarkan model v2.3 (dokumen validasi #...). Fitur penentu: velocity ternormalisasi, status device, deviasi nominal — ketiganya di atas ambang yang ditetapkan dalam risk appetite statement. Nasabah diberi jalur banding via CS 24 jam (SOP-...).&rdquo;</p>
        <p><strong>Pelajaran:</strong> <em>satu kebenaran, tiga bahasa</em>. Tim yang hanya bisa menjelaskan secara teknis akan kalah di meja regulator; yang hanya bisa bahasa regulator tidak bisa memperbaiki model. Dokumentasikan ketiganya sejak awal.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Penjelasan adalah Produk</h2>
      <p>Model tanpa penjelasan seperti <strong>vonis tanpa pertimbangan hakim</strong> — mungkin benar, tapi tidak bisa diterima. Di industri teregulasi, <strong>penjelasan bukan dokumentasi tambahan — ia bagian dari produk</strong>: tanpanya, keputusan tidak bisa dipertahankan ke nasabah, auditor, atau regulator. Anggaran explainability (SHAP serving, reason code, training CS) = anggaran <em>kepercayaan</em>.</p>
      <p>Intuisi kedua: <strong>penjelasan yang baik itu <em>kontrastif</em></strong> — ia menjawab &ldquo;kenapa <em>ini</em> dan bukan <em>itu</em>?&rdquo; &ldquo;Kenapa diblokir? Karena velocity 200x normal — <em>transaksi normalmu tidak seperti ini</em>.&rdquo; Manusia memahami lewat perbandingan, bukan lewat angka absolut. Reason code yang baik selalu mengandung <strong>pembanding implisit</strong>: &ldquo;tidak seperti biasanya&rdquo;.</p>
      <p><strong>Kapan explainability ini TIDAK perlu / berbahaya:</strong> (1) <strong>memberi terlalu banyak detail ke nasabah</strong> — &ldquo;velocity_1h_ratio=200 memicu ambang&rdquo; = memberi penjahat (yang menyamar jadi nasabah komplain) <em>blueprint</em> sistemmu; (2) <strong>untuk model yang inherently interpretable</strong> — jangan SHAP-kan logistic regression; koefisiennya <em>adalah</em> penjelasannya; (3) <strong>saat penjelasan palsu</strong> — surrogate yang tidak setia = kebohongan yang rapi. <strong>Kejujuran lebih penting dari kerapian.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> uji setiap penjelasan dengan <strong>&ldquo;tes 2 menit CS&rdquo;</strong>: bisakah CS menjelaskan keputusan ini ke nasabah yang marah dalam 2 menit, tanpa membuka dashboard teknis? Jika ya — sistemmu siap produksi. Jika tidak — penjelasanmu baru untuk <em>insinyur</em>, bukan untuk <em>manusia</em>.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Level Penjelasan per Situasi</h2>

      <div className="decision-card">
        <h3>1. Blokir/penahanan berdampak ke nasabah → <strong>reason code wajib + audit trail</strong></h3>
        <p><strong>Kenapa:</strong> sengketa &amp; regulasi. &ldquo;Skor 0,87&rdquo; bukan pertahanan hukum.</p>
      </div>

      <div className="decision-card">
        <h3>2. Investigator membuka kasus → <strong>SHAP detail + konteks + bukti</strong></h3>
        <p><strong>Kenapa:</strong> kecepatan investigasi = f(kualitas penjelasan). Mulai dari bukti, bukan dari nol.</p>
      </div>

      <div className="decision-card">
        <h3>3. Audit regulator → <strong>dokumentasi metodologi + validasi + versi</strong></h3>
        <p><strong>Kenapa:</strong> regulator menilai <em>proses</em>, bukan sekadar hasil.</p>
      </div>

      <div className="decision-card">
        <h3>4. Fitur invasif baru → <strong>uji proporsionalitas dulu</strong></h3>
        <p><strong>Kenapa:</strong> gain kecil + risiko besar = jangan. Privasi = kendala desain.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Setiap keputusan berdampak = <strong>reason code</strong> (maks 3, spesifik, bisa ditindaklanjuti).</li>
          <li>SHAP menjelaskan <strong>model</strong>, bukan dunia — jangan klaim kausalitas.</li>
          <li>4 audiens = 4 bahasa. Satu penjelasan untuk semua = gagal.</li>
          <li>Privasi = <strong>kendala desain</strong>: uji proporsionalitas sebelum kumpulkan.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: SHAP, Surrogate, atau Inheren?</h2>
      <p>Tiga pendekatan, tiga situasi:</p>
      <p><strong>Skenario A — butuh penjelasan per-keputusan, cepat.</strong> Pakai <strong>SHAP (TreeSHAP untuk GBM)</strong>: akurat, konsisten, cukup cepat untuk real-time (precompute). Cocok untuk: reason code investigator &amp; dashboard. Batasnya: mahal untuk model non-tree &amp; data besar — sampling diperlukan.</p>
      <p><strong>Skenario B — butuh &ldquo;aturan global&rdquo; yang bisa dicetak.</strong> Latih <strong>surrogate model</strong> (pohon keputusan dangkal) untuk meniru model kompleks — hasilnya 10–20 aturan &ldquo;jika-maka&rdquo; yang bisa ditempel di dinding ruang investigator. Akurasinya meniru ~90% model asli: cukup untuk <em>pemahaman</em>, tidak untuk <em>keputusan</em>. Cocok untuk: training investigator baru &amp; dokumentasi regulator.</p>
      <p><strong>Skenario C — regulasi menuntut model yang inherently interpretable.</strong> Di beberapa yurisdiksi/produk (skor kredit!), model black-box <em>dilarang</em>. Solusi: <strong>model yang memang transparan</strong> (logistic regression, GAM, scorecard) — terima AUC 2–3 poin lebih rendah sebagai <em>harga kepatuhan</em>. Ini bukan kekalahan teknis; ini <strong>biaya lisensi untuk beroperasi</strong>.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Model yang akurat tidak butuh dijelaskan — hasilnya yang penting.&rdquo;<br /><strong>Yang benar:</strong> di industri teregulasi, <strong>keputusan tanpa penjelasan = keputusan yang tidak bisa dipertahankan</strong> — di depan nasabah yang komplain, auditor yang memeriksa, dan regulator yang bertanya. Model yang tidak bisa dijelaskan bukan model yang buruk; ia <em>risiko hukum yang berjalan</em>.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: &ldquo;Kenapa Rekening Saya Diblokir?!&rdquo;</h2>
      <p>Skenario yang terjadi di beberapa bank Indonesia: nasabah UMKM — rekeningnya dipakai terima pembayaran supplier — tiba-tiba diblokir sistem AML karena pola <em>fan-in cepat</em> (banyak transfer masuk lalu langsung dibayar ke supplier = terlihat seperti layering mule!). Nasabah mengamuk di cabang, lalu mengadu ke OJK.</p>
      <p><strong>Yang membedakan respons baik vs buruk:</strong></p>
      <ol>
        <li><strong>Buruk:</strong> CS menjawab &ldquo;sistem yang memblokir, kami tidak tahu kenapa&rdquo; → nasabah makin marah → aduan OJK → bank diminta penjelasan tertulis → tidak bisa menjelaskan → sanksi administratif + reputasi.</li>
        <li><strong>Baik:</strong> CS membuka reason code: &ldquo;rekening Bapak menerima 47 transfer dalam 2 jam lalu meneruskannya — pola ini mirip penyalahgunaan rekening. Kami perlu verifikasi: boleh tunjukkan invoice supplier?&rdquo; → nasabah menunjukkan invoice → blokir dibuka 30 menit → nasabah justru <em>percaya</em> banknya protektif.</li>
      </ol>
      <p><strong>Pelajaran:</strong> explainability bukan sekadar &ldquo;fitur model&rdquo; — ia <strong>infrastruktur kepercayaan</strong>. Satu penjelasan yang baik mengubah insiden blokir menjadi momen loyalitas; satu &ldquo;tidak tahu&rdquo; mengubahnya menjadi aduan regulator. Investasi di reason code &amp; training CS <em>adalah</em> investasi risk management.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> uji explainability-mu dengan pertanyaan: <strong>&ldquo;bisakah CS menjelaskan keputusan ini ke nasabah yang marah dalam 2 menit?&rdquo;</strong> Jika tidak, sistemmu belum siap produksi — sebagus apa pun AUC-nya. Model yang baik menjawab &ldquo;berapa skornya&rdquo;; sistem yang baik menjawab &ldquo;kenapa&rdquo;.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Blokir yang Berujung Somasi</h2>
      <div className="callout">
        <p>Nasabah &ldquo;PT Maju Jaya&rdquo; (omzet Rp2 M/bulan): rekening dibekukan 10 hari karena &ldquo;sistem mendeteksi pola mencurigakan&rdquo;. Tidak ada penjelasan rinci. Ia melayangkan <strong>somasi</strong>: ganti rugi Rp300 juta (omzet hilang) + laporan ke OJK. Investigasi internal: polanya memang structuring (18 setoran Rp480–495 jt dalam 3 minggu) — sistem <strong>benar</strong>.</p>
        <p><strong>Pertanyaan:</strong> (a) Di mana kesalahan bank? (b) Tulis reason code + surat penjelasan yang seharusnya diberikan hari ke-1. (c) Kebijakan apa agar tak terulang?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Bukan deteksinya yang salah — komunikasinya.</strong> &ldquo;Sistem mendeteksi mencurigakan&rdquo; tanpa rincian = tidak bisa dipertahankan di depan nasabah/OJK/hakim. Kebenaran tanpa penjelasan = kalah.</p>
          <p>(b) <strong>Reason code hari ke-1:</strong> &ldquo;Penahanan sementara karena: (1) 18 setoran tunai Rp480–495 juta dalam 3 minggu — pola konsisten di bawah ambang pelaporan; (2) tidak sesuai profil usaha yang terdaftar. Kami wajib memverifikasi sesuai ketentuan APU-PPT. Estimasi verifikasi: 3 hari kerja. Hubungi [kontak] untuk mempercepat dengan dokumen pendukung.&rdquo; — <strong>spesifik, berdasar aturan, ada jalan keluar, ada estimasi waktu</strong>.</p>
          <p>(c) <strong>Kebijakan:</strong> (1) reason code otomatis wajib untuk tiap penahanan; (2) SLA komunikasi: nasabah diberitahu ≤24 jam dengan alasan + estimasi; (3) jalur eskalasi cepat untuk nasabah korporat (verifikasi dokumen, bukan sekadar tunggu). <strong>Pelajaran:</strong> explainability = <strong>asuransi hukum</strong> yang murah.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Explainability</h2>
      <details className="worked">
        <summary>Q1: SHAP terlalu lambat untuk real-time — solusinya?</summary>
        <p><strong>Tiga jurus:</strong> (1) <em>TreeSHAP</em> untuk GBM — cukup cepat untuk banyak kasus; (2) <em>precompute + cache</em> — penjelasan untuk pola umum dihitung offline; (3) <em>penjelasan bertingkat</em> — saat transaksi: 3 reason code sederhana; pasca-transaksi: SHAP penuh untuk review. <strong>Tidak semua keputusan butuh penjelasan penuh <em>saat itu juga</em></strong> — bedakan kebutuhan investigator vs nasabah.</p>
      </details>
      <details className="worked">
        <summary>Q2: Apakah regulator Indonesia mensyaratkan model yang bisa dijelaskan?</summary>
        <p><strong>Secara prinsip: ya.</strong> OJK/BI mensyaratkan bank <em>dapat menjelaskan</em> keputusan yang berdampak ke nasabah (termasuk pemblokiran) — dan UU PDP memberi hak nasabah atas <em>penjelasan logika</em> keputusan otomatis. Implementasinya berkembang, tapi arahnya jelas: <strong>&ldquo;komputer yang memutuskan&rdquo; bukan jawaban yang diterima.</strong> Bangun kapabilitas sekarang, bukan saat ditanya.</p>
      </details>
      <details className="worked">
        <summary>Q3: Trade-off akurasi vs interpretabilitas — harus pilih salah satu?</summary>
        <p><strong>Belum tentu.</strong> Di data tabular fraud, gap AUC antara GBM dan model interpretable sering hanya <strong>1-3 poin</strong> — harga kecil untuk kepatuhan dan kepercayaan. Dan teknik modern (explainable boosting, constrained models) mempersempit gap lebih jauh. <strong>Ukur dulu gap-nya</strong> sebelum mengorbankan salah satu — kebanyakan &ldquo;trade-off&rdquo; ternyata tidak sebesar yang ditakutkan.</p>
      </details>
      <details className="worked">
        <summary>Q4: Bagaimana menjelaskan model ke direksi yang non-teknis?</summary>
        <p><strong>Bahasa uang + contoh:</strong> bukan &ldquo;SHAP value velocity 0,34&rdquo; melainkan &ldquo;model ini menangkap Rp1,6 M/bulan fraud karena ia memperhatikan <em>kecepatan transaksi yang tidak wajar</em> — seperti satpam yang curiga melihat orang lari di mal.&rdquo; <strong>Satu analogi yang tepat mengalahkan sepuluh slide metrik.</strong> Dan selalu tutup dengan: keputusan akhir tetap di tangan manusia — model hanya memberi rekomendasi.</p>
      </details>

      <details className="worked">
        <summary>Q5: Bagaimana mengukur <em>kualitas</em> penjelasan (bukan kualitas model)?</summary>
        <p><strong>Tiga metrik:</strong> (1) <em>fidelity</em> — seberapa setia penjelasan pada model (surrogate accuracy); (2) <em>stabilitas</em> — input mirip → penjelasan mirip (jika tidak, penjelasanmu noise); (3) <em>kegunaan manusia</em> — uji dengan investigator sungguhan: apakah keputusan mereka <em>membaik</em> dengan penjelasan ini? <strong>Penjelasan yang tidak mengubah keputusan manusia = dekorasi.</strong></p>
      </details>
      <details className="worked">
        <summary>Q6: Apa itu counterfactual explanation — dan contohnya?</summary>
        <p><strong>&ldquo;Apa yang perlu berubah agar keputusan berbeda?&rdquo;</strong> Contoh: &ldquo;Transaksi ini ditahan karena velocity 200x normal. <em>Jika</em> hanya ada 2 transaksi/jam (bukan 40), ia akan disetujui.&rdquo; Ini penjelasan <em>paling actionable</em> bagi nasabah — ia memberi tahu <strong>jalan keluar</strong>, bukan sekadar alasan. Cocok untuk: banding &amp; edukasi. Batasnya: jangan sampai membocorkan ambang presisi ke penjahat.</p>
      </details>

      <h2 id="latihan">Latihan Mandiri: Menulis Penjelasan</h2>
      <p><strong>1.</strong> Skor 0,78, baseline 0,10. SHAP: velocity +0,30; device baru +0,20; nominal/p95=6x +0,12; jam aneh +0,08; akun 5 tahun -0,02. Verifikasi jumlahnya. Fitur mana yang <em>terutama</em> menjelaskan keputusan?</p>
      <p><strong>2.</strong> Tulis penjelasan untuk <strong>nasabah</strong> (2 kalimat, empatik, tanpa kata &ldquo;fraud&rdquo;/&ldquo;skor&rdquo;) dan untuk <strong>auditor</strong> (2 kalimat, formal, menyebut kontrol).</p>
      <p><strong>3.</strong> Nasabah protes: &ldquo;Jelaskan detail cara sistemmu menilaiku!&rdquo; Apa yang boleh dan tidak boleh kamu sampaikan? Kenapa?</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> 0,10+0,30+0,20+0,12+0,08-0,02 = <strong>0,78 cocok</strong>. Terutama: <strong>velocity (+0,30) dan device baru (+0,20)</strong> — 74% dari selisih di atas baseline.</p>
        <p><strong>2.</strong> Nasabah: &ldquo;Kami menahan sementara karena pola transaksi yang tidak biasa dari perangkat baru — demi keamanan akun Bapak. Verifikasi 2 menit via telepon akan membukanya.&rdquo; Auditor: &ldquo;Blokir otomatis model vX berdasarkan velocity ternormalisasi dan status device di atas ambang risk appetite; jalur banding tersedia 24 jam (SOP-...).&rdquo;</p>
        <p><strong>3.</strong> Boleh: <em>alasan umum</em> + <em>jalur banding</em>. Tidak boleh: <strong>detail fitur/ambang</strong> — itu blueprint bagi penjahat yang menyamar jadi nasabah komplain. <em>Transparansi secukupnya, bukan telanjang.</em></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Bank kalah di pengadilan walau sistemnya BENAR mendeteksi structuring. Mengapa?"
        options={[
          "Hakim tidak paham teknologi",
          "Bank tidak bisa menjelaskan MENGAPA — 'skor 0,87' bukan argumen hukum. Kebenaran tanpa penjelasan = tidak bisa dipertahankan",
          "Sistemnya salah",
          "Nasabah berbohong",
        ]}
        correct={1}
        explanation="Benar: explainability = asuransi hukum. Di ruang sidang/regulator, yang dinilai adalah alasan yang bisa diperdebatkan — bukan skor."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Apa yang dijelaskan SHAP?"
        options={[
          "Kebenaran kausal dunia — 'X menyebabkan fraud'",
          "Model — 'mengapa MODEL memberi skor ini' (atribusi). Jangan tertukar dengan kausalitas dunia",
          "Masa depan",
          "Tidak ada",
        ]}
        correct={1}
        explanation="Benar: SHAP = atribusi model. Jika data bias, SHAP menjelaskan bias itu sebagai 'penting'. Bedakan 'penjelasan model' dari 'kebenaran kausal'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Reason code yang baik untuk penahanan transaksi?"
        options={[
          "'Skor 0,87. Ditahan oleh model v3.2.'",
          "'Ditahan karena: (1) 12 trx/jam (normal Anda: 2), (2) device baru, (3) lokasi beda pulau.' — spesifik, kontekstual, ≤3 alasan",
          "'Sistem kami mendeteksi anomali.'",
          "Tidak perlu penjelasan",
        ]}
        correct={1}
        explanation="Benar: spesifik + kontekstual ('normal ANDA: 2') + maksimal 3 + bisa ditindaklanjuti. 'Skor 0,87' bukan penjelasan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Fitur 'rekam tiap ketikan' menaikkan AUC 0,03. Menurut UU PDP & proporsionalitas?"
        options={[
          "Boleh — demi keamanan",
          "Waspada: gain kecil vs risiko besar (pelanggaran privasi, denda) = tidak proporsional; cari alternatif agregat dulu",
          "Wajib dipakai",
          "Tidak ada aturan",
        ]}
        correct={1}
        explanation="Benar: proporsionalitas. 'Keamanan' bukan cek kosong — UU PDP menuntut dasar hukum + minimalisasi. Uji gain vs risiko SEBELUM kumpulkan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Untuk 4 audiens (investigator, nasabah, regulator, data scientist), strategi penjelasan?"
        options={[
          "Satu penjelasan teknis untuk semua",
          "Lapisan: detail penuh+ bukti (investigator), ringkas+solusi (nasabah), metodologi+audit trail (regulator), global+debugging (DS)",
          "Jangan jelaskan ke siapa pun",
          "Hanya ke regulator",
        ]}
        correct={1}
        explanation="Benar: 4 bahasa. Satu penjelasan untuk semua = gagal untuk semua — investigator butuh bukti, nasabah butuh empati+solusi, regulator butuh metodologi."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Explainability = asuransi</strong> operasional + bisnis + regulasi + hukum. Model bisu yang akurat &lt; model explainable yang sedikit lebih lemah.</li>
          <li><strong>SHAP:</strong> <Tex math={String.raw`\phi_i = w_i(x_i - \bar{x}_i)`} /> — atribusi adil <strong>model</strong>, bukan kausalitas dunia.</li>
          <li><strong>Reason code:</strong> ≤3 alasan, spesifik + kontekstual + bisa ditindaklanjuti + tercatat.</li>
          <li><strong>4 audiens, 4 bahasa</strong> — lapisan penjelasan, bukan satu template.</li>
          <li><strong>Privasi = kendala desain:</strong> uji proporsionalitas (gain vs risiko) sebelum kumpulkan data invasif.</li>
          <li>Kapan TIDAK butuh penjelasan dalam: monitoring internal tanpa dampak nasabah — tapi audit trail tetap wajib.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr16-anomali-time-series" className="btn btn-secondary btn-sm">← FR16</Link>
        <Link href="/learn/fr18-mlops" className="btn btn-primary btn-sm">Next: FR18 →</Link>
      </div>
    </div>
  );
}
