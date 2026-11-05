import type { V2Lesson } from "../lib/types";

// ── Figure: skor DQA per faskes (completeness vs timeliness, sintetis) ───
const DQA_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang ganda completeness dan timeliness enam puskesmas">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="120" y1="30" x2="120" y2="200"/>
<line x1="120" y1="200" x2="500" y2="200"/>
</g>
<line x1="120" y1="104" x2="500" y2="104" stroke="var(--c3)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="496" y="96" text-anchor="end" font-size="11" fill="var(--c3)" font-family="var(--font-ui)">ambang 80%</text>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)">
<text x="110" y="108" text-anchor="end">80%</text>
<text x="110" y="156" text-anchor="end">40%</text>
<text x="110" y="204" text-anchor="end">0%</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text)">
<rect x="140" y="39" width="26" height="161" rx="3" fill="var(--c1)"/><rect x="170" y="55" width="26" height="145" rx="3" fill="var(--c2)"/><text x="168" y="218" text-anchor="middle" font-size="11">A</text>
<rect x="216" y="71" width="26" height="129" rx="3" fill="var(--c1)"/><rect x="246" y="47" width="26" height="153" rx="3" fill="var(--c2)"/><text x="244" y="218" text-anchor="middle" font-size="11">B</text>
<rect x="292" y="31" width="26" height="169" rx="3" fill="var(--c1)"/><rect x="322" y="133" width="26" height="67" rx="3" fill="var(--c4)"/><text x="320" y="218" text-anchor="middle" font-size="11">C</text>
<rect x="368" y="119" width="26" height="81" rx="3" fill="var(--c4)"/><rect x="398" y="71" width="26" height="129" rx="3" fill="var(--c2)"/><text x="396" y="218" text-anchor="middle" font-size="11">D</text>
<rect x="444" y="55" width="26" height="145" rx="3" fill="var(--c1)"/><rect x="474" y="63" width="26" height="137" rx="3" fill="var(--c2)"/><text x="472" y="218" text-anchor="middle" font-size="11">E</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<circle cx="140" cy="248" r="5" fill="var(--c1)"/><text x="150" y="252" fill="var(--text)">Completeness</text>
<circle cx="260" cy="248" r="5" fill="var(--c2)"/><text x="270" y="252" fill="var(--text)">Timeliness</text>
<rect x="380" y="243" width="10" height="10" fill="var(--c4)"/><text x="394" y="252" fill="var(--text)">di bawah ambang</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="470" y="232">data sintetis</text>
</g>
<text x="140" y="22" font-size="12" fill="var(--text)" font-family="var(--font-ui)">Completeness vs timeliness per faskes</text>
</svg>`;

export const hd29: V2Lesson = {
  slug: "hd29-dhis2-dqa",
  track: "Health Data Science",
  module: "Tooling & Tata Kelola Data",
  title: "DHIS2 & Data Quality Assessment: Dari Faskes ke Keputusan Nasional",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Cakupan 98% di kertas, 60% di lapangan",
      prose: [
        "Rapat evaluasi program imunisasi tingkat provinsi. Slide Kepala Dinas menampilkan angka membanggakan: cakupan imunisasi dasar lengkap 98% — di atas target nasional. Tepuk tangan. Lalu seorang dokter dari puskesmas pedalaman mengangkat tangan: “Di wilayah saya, dari 40 bayi yang seharusnya diimunisasi, yang tercatat lengkap baru 24. Itu 60%, Pak.” Ruangan hening. Angka provinsi 98%, angka lapangan 60% — keduanya “data resmi”.",
        "Twist-nya: tidak ada yang berbohong. Puskesmas-puskesmas yang tidak melaporkan tepat waktu “diisi” dengan angka bulan lalu oleh sistem agregat; puskesmas yang formulirnya tidak lengkap tetap dihitung 100% di kolom kelengkapan; dan tidak ada yang memeriksa apakah angka yang dilaporkan konsisten dengan register manual di bawahnya. Masalahnya bukan ketidakjujuran — melainkan kualitas data yang tidak pernah diaudit. Di sinilah DHIS2 (platform pencatatan kesehatan yang dipakai puluhan negara, termasuk alur agregat di Indonesia) bertemu Data Quality Assessment (DQA): disiplin menilai apakah angka yang mengalir dari faskes → kabupaten → provinsi → nasional layak dipercaya.",
        "Lesson ini mengajarkan anatomi DHIS2, empat dimensi DQA, cara mengaudit kualitas data faskes, dan — yang paling penting — cara menindaklanjuti temuan tanpa mengubah audit menjadi perburuan kesalahan.",
      ],
      tasks: [],
      note: {
        title: "Kenapa DQA adalah skill analis kesehatan Indonesia",
        type: "risk",
        body: "Hampir setiap keputusan kesehatan populasi di Indonesia — alokasi vaksin, penentuan KLB, evaluasi SPM — bertumpu pada data agregat berjenjang. Analis yang bisa menilai kualitas data sebelum menganalisisnya adalah penjaga gerbang terakhir sebelum angka buruk menjadi kebijakan buruk. Lowongan NGO dan Kemenkes mensyaratkan pemahaman DHIS2 dan DQA eksplisit; ini bukan teori, ini syarat kerja.",
      },
      reference: "Angka agregat tanpa audit kualitas = angka harapan. DQA = cara menilai apakah data layak dipercaya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan arsitektur aliran data DHIS2 — data element, org unit, period — dan perannya di sistem kesehatan Indonesia; (2) menilai empat dimensi DQA (completeness, timeliness, consistency, validity) pada laporan faskes; (3) menghitung skor DQA per faskes dan menentukan prioritas pembinaan; (4) merancang tindak lanjut audit yang memperbaiki sistem, bukan menghukum pelapor.",
        "Rutenya: cerita → tujuan + bekal → tiga konsep (DHIS2, empat dimensi DQA, audit & tindak lanjut) → lab Python (skor DQA enam faskes) → chart completeness vs timeliness dengan panduan baca → peta keputusan → mini-case alokasi tim pembinaan → kuis → rangkuman. Estimasi 60 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, data agregat berjenjang: faskes mencatat individu, melaporkan agregat (jumlah, bukan nama) ke kabupaten/kota, yang meneruskan ke provinsi lalu nasional — setiap jenjang bisa menambah error. Kedua, agregasi dari lesson SQL: completeness dan timeliness adalah rasio COUNT yang sudah kamu kuasai. Ketiga, intuisi “angka vs kenyataan” dari lesson dashboard: agregat bisa menutupi disparitas — di sini, agregat bisa menutupi kebusukan data.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: DQA bukan tentang “data benar vs salah” — melainkan “cukup baik untuk keputusan apa”. Data dengan completeness 70% mungkin cukup untuk deteksi sinyal wabah, tetapi tidak cukup untuk evaluasi kinerja kepala puskesmas. Kelayakan selalu relatif terhadap keputusan.",
      ],
      reference: "Bekal: (1) agregat berjenjang bisa menambah error tiap tingkat; (2) dimensi DQA = rasio COUNT; (3) kelayakan relatif terhadap keputusan.",
    },
    {
      id: "konsep-dhis2",
      eyebrow: "Langkah 3 · Konsep",
      title: "DHIS2 — sistem saraf data kesehatan",
      prose: [
        "Definisi: DHIS2 (District Health Information Software 2) adalah platform open-source untuk pencatatan dan agregasi data kesehatan, dipakai di puluhan negara. Tiga konsep intinya: data element (apa yang diukur — mis. “jumlah bayi diimunisasi BCG”), org unit (di mana — hierarki faskes → kecamatan → kabupaten/kota → provinsi → nasional), dan period (kapan — harian, mingguan, bulanan). Faskes menginput nilai data element per period; sistem mengagregasikan otomatis ke atas mengikuti hierarki org unit.",
        "Kepribadiannya: DHIS2 adalah sistem saraf — ia menghantarkan sinyal dari ujung jari (faskes) ke otak (pengambil kebijakan). Seperti sistem saraf, ia hanya seandal sensornya: kalau faskes tidak menginput (atau menginput asal-asalan), sinyal yang sampai ke otak adalah noise — dan otak akan mengambil keputusan berdasarkan noise. Tugas analis DQA adalah memeriksa kesehatan sarafnya, bukan menyalahkan otaknya.",
        "Peran di Indonesia: alur agregat faskes → kabupaten/kota → nasional untuk program-program prioritas (imunisasi, KIA, surveilans) berjalan di atas platform sejenis DHIS2; Kemenkes memakai hasilnya untuk evaluasi SPM dan alokasi program. Analis di Dinkes yang paham tiga konsep inti ini bisa membaca “di mana macetnya” ketika angka agregat terlihat janggal — apakah di input faskes, di agregasi jenjang, atau di definisi data element yang ambigu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Sudah pakai DHIS2 = data pasti berkualitas”",
        type: "pitfall",
        body: "Yang benar: DHIS2 adalah pipa — ia menghantarkan apa pun yang dimasukkan, termasuk sampah, dengan sangat efisien. Kualitas data ditentukan di ujung input (pencatatan faskes) dan dijaga lewat audit (DQA), bukan oleh softwarenya. Kabupaten yang “sudah DHIS2” tetapi tidak pernah audit DQA hanya punya sampah yang terorganisir rapi.",
      },
      hints: [
        "💡 Intuisi: saat angka agregat janggal, telusuri ke bawah mengikuti hierarki org unit — provinsi → kabupaten → faskes — sampai ketemu jenjang di mana anomali muncul. Sembilan dari sepuluh “misteri data” selesai di langkah ini tanpa statistik canggih.",
      ],
      reference: "DHIS2 = data element (apa) × org unit (di mana) × period (kapan). Pipa yang baik tetap butuh audit isinya.",
    },
    {
      id: "konsep-dqa",
      eyebrow: "Langkah 4 · Konsep",
      title: "Empat dimensi DQA — rapor untuk data",
      prose: [
        "Definisi: Data Quality Assessment menilai kualitas data lewat empat dimensi. Completeness (kelengkapan): proporsi laporan yang masuk dari yang seharusnya masuk — 10 faskes × 12 bulan = 120 laporan diharapkan; masuk 108 → 90%. Timeliness (ketepatan waktu): proporsi laporan yang masuk SEBELUM tenggat — masuk 108 tetapi hanya 80 tepat waktu → 74%. Consistency (konsistensi): angka yang dilaporkan selaras antar sumber/periode — cakupan imunisasi tidak mungkin turun dari 95% ke 40% lalu naik lagi tanpa kejadian luar biasa. Validity (validitas): nilai berada dalam rentang yang masuk akal dan mengikuti aturan — cakupan tidak boleh > 100%, tanggal tidak boleh di masa depan.",
        "Kepribadiannya: empat dimensi ini adalah rapor semester untuk data. Completeness = kehadiran; timeliness = tidak terlambat mengumpulkan PR; consistency = jawaban tidak berubah-ubah; validity = jawaban masuk akal. Seperti rapor siswa, satu nilai jelek belum vonis — tetapi pola (selalu terlambat + tidak lengkap) menceritakan masalah sistemik: beban kerja, formulir membingungkan, atau tidak ada umpan balik.",
        "Kapan memakai: completeness + timeliness dihitung otomatis tiap periode (inilah “skor DQA” rutin); consistency + validity diperiksa saat audit mendalam atau ketika angka agregat janggal. Keempatnya dilaporkan per faskes — karena perbaikan selalu terjadi di level faskes, bukan di level angka nasional.",
      ],
      formula: String.raw`\text{Skor DQA} = \frac{\text{Completeness} + \text{Timeliness}}{2}`,
      formulaNote: "Skor DQA rutin (versi sederhana, %). Completeness = laporan masuk / laporan diharapkan × 100%. Timeliness = laporan tepat waktu / laporan diharapkan × 100%. Contoh: completeness 96%, timeliness 92% → skor = (96 + 92)/2 = 94%. Ambang operasional umum: ≥ 80% baik, < 80% prioritas pembinaan. Ini versi operasional — audit mendalam menambahkan consistency dan validity yang dinilai kualitatif.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Completeness 100% = data bagus”",
        type: "pitfall",
        body: "Yang benar: completeness hanya mengukur ADA tidaknya laporan — bukan BENAR tidaknya isinya. Faskes bisa melaporkan 100% tepat waktu dengan angka karangan (validity jebol) atau angka bulan lalu yang disalin (consistency semu). Inilah kenapa DQA punya empat dimensi, bukan satu: dimensi yang mudah di-game (completeness) harus selalu dibaca bersama dimensi yang sulit di-game (consistency lintas sumber, validity).",
      },
      hints: [
        "💡 Intuisi: curigai kombinasi “completeness sempurna + consistency janggal”. Data yang terlalu rapi untuk ukuran lapangan hampir selalu menandakan pengisian demi kepatuhan, bukan pencatatan nyata. Data lapangan yang jujur itu sedikit berantakan.",
      ],
      reference: "Completeness = kehadiran; timeliness = ketepatan; consistency = keselarasan; validity = kewajaran. Baca keempatnya bersamaan.",
    },
    {
      id: "konsep-audit",
      eyebrow: "Langkah 5 · Konsep",
      title: "Audit DQA — dari temuan ke perbaikan",
      prose: [
        "Definisi: audit DQA adalah pemeriksaan terstruktur kualitas data faskes: (1) pilih sampel faskes (prioritaskan skor rendah + sampel acak sebagai kontrol); (2) bandingkan angka laporan vs sumber primer (register manual, kohort bayi) — selisih > 5% = temuan; (3) wawancara petugas: apakah definisi data element dipahami sama? apakah beban input wajar? (4) tulis rekomendasi yang SPESIFIK (siapa, apa, kapan) — bukan “tingkatkan kualitas data”.",
        "Kepribadiannya: auditor DQA yang baik adalah dokter, bukan hakim. Tujuannya mendiagnosis penyakit sistem (formulir membingungkan? tidak ada umpan balik? petugas rangkap tiga jabatan?) lalu meresepkan obat — bukan memvonis petugas. Faskes yang takut diaudit akan mempercantik data; faskes yang merasa dibantu akan melaporkan jujur. Kualitas data adalah fungsi dari kepercayaan, bukan ketakutan.",
        "Kapan memakai & tindak lanjut: temuan individual → pembinaan (pelatihan definisi, sederhanakan formulir); temuan sistemik (banyak faskes salah memahami satu data element) → perbaiki definisi/panduan di tingkat kabupaten; temuan berulang → eskalasi ke perencanaan (tambah petugas input, perbaiki insentif). Aturan emas: setiap audit WAJIB menghasilkan umpan balik tertulis ke faskes dalam 2 minggu — audit tanpa umpan balik adalah pajak waktu yang membuat faskes berikutnya semakin malas melaporkan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Tujuan DQA = menemukan siapa yang salah”",
        type: "pitfall",
        body: "Yang benar: tujuan DQA adalah menemukan APA yang salah pada sistem. Petugas yang salah mengisi karena definisi ambigu adalah korban, bukan pelaku — pelakunya adalah panduan yang tidak jelas. Audit yang berakhir dengan hukuman menghasilkan satu hal yang pasti: data yang lebih cantik dan lebih palsu pada periode berikutnya.",
      },
      hints: [
        "💡 Intuisi kedua: ukur keberhasilan DQA bukan dari “temuan berkurang” (bisa berarti faskes makin pandai menyembunyikan), melainkan dari “selisih laporan vs sumber primer mengecil” DAN “faskes proaktif bertanya saat ragu”. Indikator kedua tidak bisa dipalsukan.",
      ],
      reference: "Audit = diagnosis sistem, bukan vonis petugas. Wajib ada umpan balik tertulis ≤ 2 minggu.",
    },
    {
      id: "lab-dqa",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Skor DQA enam faskes",
      prose: [
        "Waktunya menjadi auditor. Di bawah ada data SINTETIS enam puskesmas: completeness dan timeliness laporan imunisasi satu semester (6 bulan × 1 laporan = 6 laporan diharapkan per faskes). Tugasmu: hitung skor DQA tiap faskes, tentukan prioritas pembinaan (skor < 80 ATAU ada dimensi < 80), dan identifikasi dimensi terlemah tingkat kabupaten.",
        "Coba: setelah lolos, ubah ambang menjadi 85 — faskes apa yang ikut ter-flag? Lalu bayangkan kamu hanya punya 2 tim pembinaan untuk 3 faskes prioritas: kriteria tambahan apa yang kamu pakai untuk memilih? (Petunjuk: lihat dimensi mana yang jebol — timeliness jebol vs completeness jebol butuh intervensi berbeda.)",
      ],
      tasks: [
        { id: "t1", text: "Isi `skor` = dict faskes → (completeness + timeliness) / 2" },
        { id: "t2", text: "Isi `prioritas` = list faskes yang skornya < 80 ATAU salah satu dimensinya < 80" },
        { id: "t3", text: "Isi `terlemah` = dimensi dengan rata-rata kabupaten terendah ('completeness' atau 'timeliness')" },
        { id: "t4", text: "Jalankan dan pastikan ringkasan + rekomendasi tercetak" },
      ],
      expected: "skor: A=94.0 B=91.5 C=80.5 D=80.0 E=91.5 F=61.5\nprioritas=C, D, F\nterlemah=timeliness (rata-rata 80.7%)",
      code: {
        starter: `# Data SINTETIS: completeness & timeliness laporan 6 puskesmas, satu semester (%)
# faskes: (completeness, timeliness)
dqa = {
    "A": (96, 92),
    "B": (88, 95),
    "C": (100, 61),
    "D": (72, 88),
    "E": (93, 90),
    "F": (65, 58),
}
AMBANG = 80.0

# TULIS KODEMU
skor =
prioritas =
terlemah =

print("skor: " + " ".join(f"{k}={v:.1f}" for k, v in skor.items()))
print("prioritas=" + ", ".join(prioritas))
print(f"terlemah={terlemah} (rata-rata {min(sum(v[0] for v in dqa.values())/len(dqa), sum(v[1] for v in dqa.values())/len(dqa)):.1f}%)")`,
        lockLines: 12,
        solution: `# Data SINTETIS: completeness & timeliness laporan 6 puskesmas, satu semester (%)
# faskes: (completeness, timeliness)
dqa = {
    "A": (96, 92),
    "B": (88, 95),
    "C": (100, 61),
    "D": (72, 88),
    "E": (93, 90),
    "F": (65, 58),
}
AMBANG = 80.0

# TULIS KODEMU
skor = {k: (c + t) / 2 for k, (c, t) in dqa.items()}
prioritas = sorted([k for k, (c, t) in dqa.items()
                    if (c + t) / 2 < AMBANG or c < AMBANG or t < AMBANG])
rata_c = sum(c for c, t in dqa.values()) / len(dqa)
rata_t = sum(t for c, t in dqa.values()) / len(dqa)
terlemah = "completeness" if rata_c < rata_t else "timeliness"

print("skor: " + " ".join(f"{k}={v:.1f}" for k, v in skor.items()))
print("prioritas=" + ", ".join(prioritas))
print(f"terlemah={terlemah} (rata-rata {min(rata_c, rata_t):.1f}%)")`,
        checks: [
          { kind: "equal", task: "t1", name: "skor", value: {"A": 94.0, "B": 91.5, "C": 80.5, "D": 80.0, "E": 91.5, "F": 61.5}, label: "`skor` tiap faskes benar", msg: "(c+t)/2 per faskes: A 94, B 91.5, C 80.5, D 80, E 91.5, F 61.5." },
          { kind: "equal", task: "t2", name: "prioritas", value: ["C", "D", "F"], label: "`prioritas` = C, D, F", msg: "C: timeliness 61 < 80; D: completeness 72 < 80; F: keduanya < 80. A, B, E aman." },
          { kind: "equal", task: "t3", name: "terlemah", value: "timeliness", label: "`terlemah` = timeliness", msg: "Rata-rata completeness 85.7% vs timeliness 80.7% — ketepatan waktu masalah kabupaten." },
          { kind: "stdout_matches", task: "t4", pattern: "prioritas=C, D, F", label: "Prioritas tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t4", pattern: "terlemah=timeliness", label: "Dimensi terlemah tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: skor adalah awal percakapan, bukan vonis",
        body: "Tiga kebiasaan auditor DQA senior. Pertama, jangan pernah mengirim daftar “faskes bermasalah” tanpa konteks — sertakan dimensinya: C jebol di timeliness (masalah proses), D jebol di completeness (masalah pencatatan), F jebol di keduanya (masalah sistemik). Intervensinya beda. Kedua, kunjungi satu faskes ber-skor BAIK juga — untuk belajar praktik baiknya, bukan hanya memotret yang buruk. Ketiga, simpan skor historis: faskes yang membaik 20 poin dalam dua semester adalah cerita sukses program pembinaanmu — dan bukti kerja yang bisa ditunjukkan ke pimpinan.",
      },
      reference: "Skor = (completeness + timeliness)/2. Prioritas = skor < 80 ATAU dimensi < 80. Intervensi mengikuti dimensi yang jebol.",
    },
    {
      id: "chart-dqa",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca peta masalah kualitas data",
      prose: [
        "Chart di bawah memvisualkan data lab-mu: completeness (biru) vs timeliness (hijau) per faskes, dengan garis ambang 80%. Batang merah menandai dimensi yang jebol. Inilah “peta masalah” yang dibawa auditor ke rapat — satu gambar yang langsung menunjukkan ke mana tim pembinaan harus pergi.",
        "Cara membaca: sumbu X = enam faskes (A–F); tiap faskes punya dua batang (kiri = completeness, kanan = timeliness); garis putus-putus = ambang 80%; batang merah = dimensi di bawah ambang.",
        "Interpretasi: tiga pola berbeda membutuhkan tiga intervensi berbeda. C: completeness sempurna tetapi timeliness jebol (61%) — masalah proses pelaporan (ingatkan tenggat, sederhanakan alur), bukan pencatatan. D: kebalikannya — completeness jebol (72%) tetapi tepat waktu: mereka melaporkan cepat tetapi tidak lengkap; cek beban kerja/formulir. F: keduanya jebol — kandidat kunjungan lapangan prioritas. A, B, E: sehat; B (88/95) bisa jadi contoh praktik baik untuk tetangganya. Satu chart, tiga resep intervensi — inilah kenapa dimensi dipisah, bukan dilebur jadi satu angka.",
      ],
      tasks: [],
      figure: { svg: DQA_SVG, alt: "Diagram batang ganda completeness dan timeliness enam puskesmas dengan ambang 80 persen", caption: "Completeness vs timeliness per faskes — tiga pola, tiga intervensi (data sintetis)." },
      hints: [
        "💡 Intuisi: chart DQA yang baik memisahkan dimensi, bukan menggabungkannya. Satu angka skor menyembunyikan diagnosis; dua batang menunjukkan obatnya.",
      ],
      reference: "Pisahkan dimensi di visual. Pola jebolnya = resep intervensinya.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Kapan data boleh dipakai — dan kapan harus dibina dulu",
      prose: [
        "Skenario 1 — “Skor ≥ 80 semua dimensi”: kondisi = faskes sehat. Keputusan: data boleh dipakai untuk analisis dan pelaporan; apresiasi faskes (umpan balik positif sama pentingnya). Alasan: kepercayaan yang diberi makan akan tumbuh.",
        "Skenario 2 — “Satu dimensi jebol”: kondisi = completeness ATAU timeliness < 80. Keputusan: data boleh dipakai dengan catatan kaki eksplisit tentang keterbatasannya; jadwalkan pembinaan terarah sesuai dimensi (C → manajemen tenggat; D → pendampingan pencatatan). Alasan: jangan buang data yang masih berguna, tetapi jangan sembunyikan cacatnya.",
        "Skenario 3 — “Dua dimensi jebol / skor < 70”: kondisi = masalah sistemik (faskes F). Keputusan: data DIKARANTINA dari agregat pengambilan keputusan sampai audit lapangan selesai; prioritaskan kunjungan. Alasan: satu faskes busuk bisa meracuni angka kabupaten — completeness 65% + timeliness 58% berarti hampir separuh realitas tidak tercatat.",
        "Skenario 4 — “Angka agregat janggal tiba-tiba”: kondisi = lonjakan/penurunan tajam tanpa penjelasan program. Keputusan: JANGAN analisis dulu — telusuri hierarki org unit ke bawah sampai ketemu jenjang anomalinya, lalu cek consistency vs sumber primer. Alasan: menganalisis data yang belum lolos DQA adalah membangun di atas pasir.",
        "Skenario 5 — “Banyak faskes salah memahami satu data element”: kondisi = pola kesalahan seragam lintas faskes. Keputusan: ini BUKAN masalah faskes — perbaiki definisi/panduan di tingkat kabupaten dan latih ulang serentak. Alasan: kesalahan sistemik butuh obat sistemik; membina faskes satu per satu adalah pemborosan.",
        "Aturan praktis 10 detik: skor per faskes → pisahkan dimensinya → tentukan boleh-dipakai / pakai-dengan-catatan / karantina → intervensi mengikuti dimensi → umpan balik tertulis ≤ 2 minggu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengumumkan peringkat faskes “terbaik vs terburuk” ke publik internal sebagai motivasi. Hasilnya: faskes bawah mempercantik data agar tidak malu — kualitas data justru runtuh. Publikasikan yang diperbolehkan: praktik baik dan perbaikan terbesar. Daftar prioritas pembinaan adalah dokumen kerja internal, bukan papan pengumuman.",
      },
      reference: "Hijau = pakai. Kuning = pakai dengan catatan + bina. Merah = karantina + kunjungan. Jangan publikasikan daftar malu.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Alokasi dua tim pembinaan",
      prose: [
        "Situasinya: kamu analis Dinkes. Hasil DQA semester ini: prioritas pembinaan = Puskesmas C, D, F (dari lab). Kamu hanya punya DUA tim pembinaan untuk dikirim bulan ini; tiap tim hanya bisa menangani satu faskes secara intensif. Kepala Dinas memintamu merekomendasikan dua faskes + alasan tertulis satu paragraf per faskes.",
        "Pertanyaan analisis: (a) dua faskes mana yang kamu pilih, dan kenapa? (b) Intervensi spesifik apa untuk masing-masing (berbeda, mengikuti dimensi yang jebol)? (c) Apa yang kamu lakukan terhadap faskes ketiga yang tidak kebagian tim bulan ini?",
        "Pembahasan: (a) Pilih F dan D. F karena keduanya jebol (risiko tertinggi meracuni agregat kabupaten) — ini triase medis: tangani yang paling kritis dulu. D karena completeness jebol berarti under-reporting — kasus yang tidak tercatat = program yang buta; lebih berbahaya daripada C yang hanya terlambat melapor (datanya ada, hanya telat). (b) F: kunjungan lapangan penuh — audit register vs laporan + wawancara beban kerja (diduga masalah sistemik). D: pendampingan pencatatan — sederhanakan formulir, latih definisi data element, cek apakah petugas rangkap jabatan. (c) C: intervensi ringan tanpa tim lapangan — surat peringatan tenggat + pendampingan daring penjadwalan pelaporan; datanya lengkap sehingga risikonya rendah; evaluasi bulan depan apakah timeliness membaik. Keputusan ini didokumentasikan dengan alasan — supaya bulan depan, saat C membaik dan D belum, alokasi bisa dipertahankan di depan Kepala Dinas.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Logika triase ini identik dengan alokasi modal risiko: sumber daya terbatas → prioritaskan eksposur terbesar (F), lalu risiko yang tak terlihat (under-reporting D), sambil memitigasi sisanya dengan biaya murah (C). Analis DQA yang bisa menulis “kenapa F dan D, bukan C” sedang berlatih membuat risk-based decision — skill yang sama dipakai credit committee saat memilih debitur mana yang diaudit duluan.",
      },
      reference: "Triase: kritis dulu (F), tak-terlihat kedua (D), ringan-daring ketiga (C). Dokumentasikan alasannya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "DHIS2 = data element (apa) × org unit (di mana) × period (kapan); pipa agregat faskes → nasional — kualitas ditentukan di input, bukan di software.",
        "DQA empat dimensi: completeness (kehadiran), timeliness (ketepatan), consistency (keselarasan), validity (kewajaran) — baca keempatnya bersamaan.",
        "Skor rutin = (completeness + timeliness)/2; ambang 80% — tetapi pisahkan dimensi untuk diagnosis.",
        "Audit = diagnosis sistem (bukan vonis petugas); temuan sistemik → perbaiki definisi; wajib umpan balik tertulis ≤ 2 minggu.",
        "Keputusan data: hijau = pakai; kuning = pakai dengan catatan + bina; merah = karantina + kunjungan lapangan.",
      ],
      quiz: [
        {
          q: "Faskes melaporkan 100% tepat waktu, tetapi angka imunisasinya sama persis dengan bulan lalu selama 4 bulan. Penilaian DQA?",
          options: [
            { text: "Completeness & timeliness bagus, tetapi consistency jebol — indikasi penyalinan angka; verifikasi ke register primer", why: "Benar: data lapangan yang jujur sedikit berfluktuasi; angka fotokopi 4 bulan adalah pola klasik pengisian demi kepatuhan.", correct: true },
            { text: "Data sempurna — jadikan contoh", why: "Salah: justru pola “terlalu rapi” adalah red flag; menjadikannya contoh menularkan praktik buruk." },
            { text: "Timeliness bagus berarti data valid", why: "Salah: ketepatan waktu tidak menjamin kebenaran isi — dimensi berbeda, jangan dicampur." },
            { text: "Hukum petugasnya", why: "Salah: vonis tanpa diagnosis sistem; audit yang menghukum menghasilkan data yang lebih cantik dan lebih palsu." },
          ],
        },
        {
          q: "Cakupan imunisasi agregat kabupaten 98%, tetapi audit sampel menemukan rata-rata lapangan 70%. Apa yang paling mungkin terjadi?",
          options: [
            { text: "Faskes tak-melapor diisi angka lama/estimasi dan tidak ada yang memverifikasi — kegagalan DQA di jenjang agregasi", why: "Benar: agregat menutupi kebusukan input; tanpa audit, angka harapan mengalir mulus ke atas.", correct: true },
            { text: "Sampel auditnya yang salah", why: "Salah: kemungkinan ini ada, tetapi pola sistematis 98 vs 70 menunjuk masalah pelaporan, bukan sampling — verifikasi dulu sebelum menyalahkan auditor." },
            { text: "Itu normal — agregat memang selalu lebih tinggi", why: "Salah: tidak ada alasan matematis agregat harus lebih tinggi; ini normalisasi kegagalan." },
            { text: "Naikkan target jadi 100%", why: "Salah: menaikkan target di atas data palsu hanya memperbesar kebohongan." },
          ],
        },
        {
          q: "Faskes C: completeness 100%, timeliness 61%. Intervensi yang tepat?",
          options: [
            { text: "Pembinaan manajemen tenggat & alur pelaporan — datanya lengkap, masalahnya proses; kunjungan lapangan intensif belum perlu", why: "Benar: intervensi mengikuti dimensi yang jebol. Datanya ada (lengkap), hanya terlambat — obatnya penjadwalan, bukan audit register.", correct: true },
            { text: "Audit register menyeluruh seperti faskes F", why: "Salah: buang sumber daya; completeness 100% menunjukkan pencatatan berjalan." },
            { text: "Karantina datanya dari agregat", why: "Salah: karantina untuk masalah sistemik (dua dimensi jebol); data C masih berguna dengan catatan." },
            { text: "Biarkan — completeness sempurna", why: "Salah: mengabaikan timeliness berarti keputusan selalu berbasis data basi." },
          ],
        },
        {
          q: "Setelah audit menemukan banyak faskes salah memahami definisi “bayi diimunisasi lengkap”, langkah tepat?",
          options: [
            { text: "Perbaiki definisi & panduan di tingkat kabupaten + latih ulang serentak — kesalahan sistemik butuh obat sistemik", why: "Benar: pola seragam lintas faskes = masalah definisi, bukan petugas. Membina satu per satu adalah pemborosan.", correct: true },
            { text: "Bina faskes satu per satu", why: "Salah: tidak efisien untuk masalah yang akarnya sama di semua tempat." },
            { text: "Ganti semua petugas input", why: "Salah: mengganti orang tanpa memperbaiki definisi mengulang kesalahan dengan pemain baru." },
            { text: "Hapus data element itu dari laporan", why: "Salah: menghilangkan indikator menghilangkan visibilitas masalah — bukan solusi." },
          ],
        },
        {
          q: "Apa indikator keberhasilan program DQA yang TIDAK bisa dipalsukan faskes?",
          options: [
            { text: "Selisih laporan vs sumber primer mengecil + faskes proaktif bertanya saat ragu definisi", why: "Benar: keduanya mengukur kejujuran proses, bukan angka akhir — tidak bisa dicapai dengan mempercantik laporan.", correct: true },
            { text: "Temuan audit berkurang", why: "Salah: bisa berarti faskes makin pandai menyembunyikan, bukan makin jujur." },
            { text: "Skor DQA naik", why: "Salah: skor bisa naik lewat pengisian asal-asalan yang tepat waktu." },
            { text: "Semua faskes 100%", why: "Salah: kesempurnaan seragam justru mencurigakan (lihat soal 1)." },
          ],
        },
        {
          q: "DHIS2 baru dipasang di kabupaten. Apa yang TIDAK boleh diharapkan darinya?",
          options: [
            { text: "Kualitas data otomatis membaik — DHIS2 adalah pipa, kualitas ditentukan input & audit (DQA)", why: "Benar: software menghantarkan apa pun yang dimasukkan, termasuk sampah, dengan efisien.", correct: true },
            { text: "Agregasi otomatis per jenjang", why: "Salah: ini justru fungsi inti DHIS2 — agregasi mengikuti hierarki org unit." },
            { text: "Standardisasi definisi data element", why: "Salah: DHIS2 memaksa definisi tunggal per data element — ini manfaat nyatanya." },
            { text: "Visibilitas keterlambatan pelaporan", why: "Salah: timeliness tracking adalah fitur bawaan yang berguna." },
          ],
        },
      ],
      next: {
        label: "Stata, SPSS & SAS untuk Analis Kesehatan",
        href: "/learn/hd30-stata-spss-sas",
      },
    },
  ],
};
