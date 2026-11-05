import type { V2Lesson } from "../lib/types";

// Piramida pembaca laporan risiko: semakin ke bawah semakin detail.
const FIG_AUDIENCE = `<svg viewBox=\"0 0 480 300\" role=\"img\" aria-label=\"Piramida empat lapis pembaca laporan risiko, dari direksi di puncak sampai regulator di dasar.\">
<g stroke=\"var(--chart-grid)\" stroke-width=\"1\">
<rect x=\"150\" y=\"20\" width=\"180\" height=\"52\" fill=\"var(--c1)\" opacity=\"0.85\"/>
<rect x=\"110\" y=\"84\" width=\"260\" height=\"52\" fill=\"var(--c2)\" opacity=\"0.85\"/>
<rect x=\"70\" y=\"148\" width=\"340\" height=\"52\" fill=\"var(--c3)\" opacity=\"0.85\"/>
<rect x=\"30\" y=\"212\" width=\"420\" height=\"52\" fill=\"var(--c4)\" opacity=\"0.85\"/>
</g>
<g fill=\"#fff\" font-size=\"13\" font-family=\"var(--font-ui)\" font-weight=\"600\" text-anchor=\"middle\">
<text x=\"240\" y=\"42\">Direksi</text><text x=\"240\" y=\"60\" font-weight=\"400\" font-size=\"11\">1 halaman · 5 menit</text>
<text x=\"240\" y=\"106\">Komite Risiko</text><text x=\"240\" y=\"124\" font-weight=\"400\" font-size=\"11\">ringkasan + temuan</text>
<text x=\"240\" y=\"170\">CRO &amp; tim risiko</text><text x=\"240\" y=\"188\" font-weight=\"400\" font-size=\"11\">detail + rekomendasi</text>
<text x=\"240\" y=\"234\">Regulator (OJK/BI)</text><text x=\"240\" y=\"252\" font-weight=\"400\" font-size=\"11\">konsistensi + definisi</text>
</g>
<text x=\"240\" y=\"290\" font-size=\"11\" fill=\"var(--chart-text)\" font-family=\"var(--font-ui)\" text-anchor=\"middle\">Semakin ke atas: semakin sedikit waktu, semakin besar keputusan.</text>
</svg>`;

export const rr1: V2Lesson = {
  slug: "rr1-lanskap",
  track: "Risk Reporting",
  module: "Fondasi Pelaporan",
  title: "RR1 — Lanskap Risk Reporting",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laporan 60 halaman yang menipu",
      prose: [
        "Bank Artha Dana menerbitkan laporan risiko bulanan setebal 60 halaman. Sampulnya rapi, grafiknya berwarna, angkanya konsisten dari halaman ke halaman. Headline bulan itu menggembirakan: NPL turun dari 3,2% ke 3,0%. Direksi mengangguk puas. Tidak ada pertanyaan.",
        "Tiga bulan kemudian, dua debitur besar gagal bayar hampir bersamaan. NPL melonjak ke 4,8%. Komite risiko membuka kembali laporan 60 halaman itu — dan menemukan, di lampiran halaman 47, dua baris yang selama ini tidak pernah dibahas: 20 debitur terbesar menguasai 45% total portofolio, dan coverage ratio turun dari 85% ke 70%. Sinyal bahayanya ada di dalam laporan. Tidak ada yang membacanya.",
        "Twist-nya: laporan itu tidak salah hitung. Semua angkanya benar. Ia menyesatkan bukan karena datanya salah, melainkan karena hal yang penting dikubur di halaman 47 sementara hal yang menenangkan dipajang di halaman 1. Inilah pekerjaan risk reporting: bukan membuat laporan yang rapi, melainkan memastikan hal yang penting tidak terlewatkan oleh orang yang mengambil keputusan.",
        "Setelah lesson ini kamu bisa: (1) menyebutkan empat pembaca utama laporan risiko dan kebutuhan masing-masing; (2) membedakan laporan periodik, adhoc, insiden, dan regulasi; (3) memilih tiga angka headline untuk satu halaman eksekutif dari data mentah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Laporan yang buruk tidak netral — ia aktif menghasilkan keputusan buruk. Direksi yang tenang karena headline menenangkan akan menyetujui ekspansi kredit tepat saat buffer menipis. Biaya laporan yang menyesatkan bukan kertasnya, melainkan keputusan yang ia picu.",
      },
      reference: "Laporan rapi ≠ laporan jujur. Yang penting harus di halaman 1, bukan halaman 47.",
    },
    {
      id: "pembaca",
      eyebrow: "Langkah 2 · Siapa membaca",
      title: "Empat pembaca, empat kebutuhan berbeda",
      prose: [
        "Direksi membaca 5 menit sebelum rapat. Mereka butuh satu halaman: apa yang berubah, apa risikonya, apa yang harus diputuskan. Komite risiko membaca lebih dalam: temuan, akar masalah, dan apakah tindak lanjut bulan lalu dikerjakan. CRO dan tim risiko butuh detail penuh plus rekomendasi teknis. Regulator (OJK/BI) tidak menilai gaya bahasamu — mereka menilai konsistensi angka antar laporan dan ketepatan definisi.",
        "Kesalahan klasik analis junior: menulis satu laporan untuk semua pembaca. Hasilnya laporan yang terlalu dangkal untuk CRO dan terlalu tebal untuk direksi — tidak memuaskan siapa pun. Praktik yang benar: satu sumber data, beberapa lapisan penyajian. Halaman 1 untuk direksi, 5–10 halaman untuk komite, lampiran detail untuk tim teknis, format baku untuk regulator.",
        "Cara membaca figur di bawah: tiap lapis piramida adalah satu pembaca; lebar lapis = kedalaman detail yang ia butuhkan; teks kecil = waktu dan format yang ia siapkan. Interpretasi: energimu sebagai analis harus terbagi mengikuti piramida ini — halaman 1 (puncak) justru butuh usaha paling besar karena setiap katanya dibaca pengambil keputusan.",
      ],
      figure: {
        svg: FIG_AUDIENCE,
        alt: "Piramida empat lapis pembaca laporan risiko, dari direksi di puncak sampai regulator di dasar.",
        caption: "Satu sumber data, empat lapisan penyajian. Puncak piramida = waktu baca tersingkat, taruhan keputusan tertinggi.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CSatu laporan untuk semua pembaca, biar efisien.\u201D Efisiensi semu. Direksi melewatkan 60 halaman dan hanya membaca headline; CRO kekurangan detail untuk bertindak. Satu dokumen boleh, tetapi ia harus berlapis: headline di depan, detail di belakang.",
      },
      hints: [
        "Uji sederhana: jika direksi hanya membaca halaman 1, apakah keputusan mereka tetap benar? Jika tidak, halaman 1-mu gagal.",
        "Regulator tidak peduli narasimu indah — mereka membandingkan angka laporanmu bulan ini dengan bulan lalu dan dengan laporan bank lain.",
      ],
      reference: "Tulis untuk keputusan, bukan untuk arsip. Kenali siapa membaca sebelum menulis apa.",
    },
    {
      id: "lab-headline",
      eyebrow: "Langkah 3 · Lab",
      title: "Tiga angka untuk halaman satu",
      prose: [
        "Halaman 1 hanya muat tiga angka. Tiga angka yang paling sering menyelamatkan direksi dari keputusan buta: posisi terakhir (di mana kita sekarang), perubahan bulan-ke-bulan dalam poin persentase (ke mana arahnya), dan titik ekstrem 12 bulan (seberapa luar biasa ini).",
        "Rumus perubahan di bawah memakai poin persentase (pp), bukan persen. NPL naik dari 3,2% ke 3,4% = naik 0,2 pp — bukan naik 6,25%. Untuk rasio dan suku bunga, pp adalah bahasa yang jujur; persen relatif membesar-besarkan gerakan kecil.",
      ],
      formula: String.raw`\text{MoM (pp)} = \text{NPL}_{t} - \text{NPL}_{t-1}`,
      formulaNote: "NPL_t = NPL bulan ini (%), NPL_{t-1} = NPL bulan lalu (%). Hasilnya dalam poin persentase: 3,4 − 3,2 = 0,2 pp. Interpretasi: angka positif = memburuk (kredit bermasalah bertambah).",
      tasks: [
        { id: "t1", text: "Isi `terakhir`, `mom`, dan `maks` dari data `npl`" },
        { id: "t2", text: "Jalankan dan pastikan tiga angka tercetak" },
      ],
      expected: "NPL=3.4%  MoM=+0.2pp  Max12=3.4%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CNPL naik 6,25%.\u201D Secara matematis benar ((3,4−3,2)/3,2), secara komunikasi menyesatkan — terdengar seperti krisis. Untuk rasio, selalu pakai poin persentase: \u201Cnaik 0,2 pp\u201D. Simpan persen relatif untuk angka absolut seperti laba atau total kredit.",
      },
      hints: [
        "terakhir = elemen terakhir list: npl[-1].",
        "mom = npl[-1] - npl[-2]; format {mom:+.1f} sudah menangani tanda plus.",
        "maks = max(npl). Tiga baris, lalu jalankan.",
      ],
      code: {
        starter: `# Data NPL 12 bulan terakhir (%). JANGAN UBAH baris ini.\nnpl = [2.8, 2.9, 2.7, 2.9, 3.0, 3.1, 3.0, 3.2, 3.1, 3.3, 3.2, 3.4]\n\n# TULIS KODEMU: tiga angka headline\nterakhir =\nmom =\nmaks =\n\nprint(f"NPL={terakhir}%  MoM={mom:+.1f}pp  Max12={maks}%")`,
        lockLines: 2,
        solution: `# Data NPL 12 bulan terakhir (%). JANGAN UBAH baris ini.\nnpl = [2.8, 2.9, 2.7, 2.9, 3.0, 3.1, 3.0, 3.2, 3.1, 3.3, 3.2, 3.4]\n\n# TULIS KODEMU: tiga angka headline\nterakhir = npl[-1]\nmom = npl[-1] - npl[-2]\nmaks = max(npl)\n\nprint(f"NPL={terakhir}%  MoM={mom:+.1f}pp  Max12={maks}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "terakhir", value: 3.4, tol: 1e-9, label: "`terakhir` = 3.4", msg: "Ambil elemen terakhir: npl[-1]." },
          { kind: "equal", task: "t1", name: "mom", value: 0.2, tol: 1e-9, label: "`mom` = 0.2", msg: "3.4 − 3.2 = 0.2 (poin persentase)." },
          { kind: "equal", task: "t1", name: "maks", value: 3.4, tol: 1e-9, label: "`maks` = 3.4", msg: "max(npl) dari 12 bulan." },
          { kind: "stdout_matches", task: "t2", pattern: "NPL=3\\.4%\\s+MoM=\\+0\\.2pp\\s+Max12=3\\.4%", label: "Tiga angka tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Halaman 1 = posisi terakhir + arah (pp) + konteks ekstrem. npl[-1], selisih, max().",
    },
    {
      id: "jenis",
      eyebrow: "Langkah 4 · Jenis laporan",
      title: "Empat jenis laporan, empat kecepatan",
      prose: [
        "Laporan periodik (harian/mingguan/bulanan) adalah denyut nadi: format tetap, terbit terjadwal, dibaca untuk memantau tren. Laporan adhoc lahir dari pertanyaan mendadak direksi — cepat lebih penting daripada sempurna. Laporan insiden ditulis saat sesuatu pecah: timeline, akar masalah, tindak lanjut. Laporan regulasi dikirim ke OJK/BI dengan format dan definisi baku — tidak ada ruang kreativitas.",
        "Keempatnya berbeda dalam tiga hal: pemicu (jadwal vs pertanyaan vs kejadian vs kewajiban), kecepatan (terjadwal vs hitungan jam vs segera vs deadline hukum), dan kebebasan format (tetap vs bebas vs terstruktur vs baku). Analis yang mencampuradukkan — misalnya menjawab permintaan adhoc dengan ketelitian laporan regulasi — akan selalu terlambat.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CLaporan yang baik = laporan yang lengkap.\u201D Lengkap tanpa tepat guna = arsip. Laporan adhoc 2 jam yang menjawab pertanyaan dengan satu angka + caveat jauh lebih berguna daripada analisis 3 hari yang datang setelah keputusan diambil.",
      },
      hints: [
        "Intuisi: tanyakan selalu \u201Ckeputusan apa yang akan diambil dari laporan ini?\u201D — jawabannya menentukan jenis, panjang, dan kecepatan.",
        "Laporan periodik yang tidak pernah memicu satu pun pertanyaan atau keputusan dalam 3 bulan = kandidat untuk dipangkas.",
      ],
      reference: "Periodik = pantau tren. Adhoc = jawab cepat. Insiden = perbaiki. Regulasi = patuhi format.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Pasangan metrik",
      title: "NPL yang \"membaik\" karena write-off",
      prose: [
        "NPL turun dari 3,4% ke 3,0% dalam satu kuartal — direksi senang. Lalu kamu membuka catatan hapus buku: write-off Rp120 miliar kuartal ini. Write-off menghapus kredit macet dari pembilang (kredit bermasalah) sekaligus penyebut (total kredit) — NPL turun tanpa satu pun debitur membayar. Inilah perbaikan kosmetik: angkanya membaik, risikonya tidak.",
        "Matematikanya sederhana. Awal kuartal: bermasalah Rp340 miliar dari total Rp10.000 miliar → NPL 3,4%. Akhir kuartal: total tumbuh ke Rp10.100 miliar, bermasalah tercatat Rp303 miliar → NPL 3,0%. Tetapi di tengahnya ada write-off Rp120 miliar. Uji kejujurannya: bagaimana NPL terlihat jika bank tidak menghapus apa pun? Jawab dengan NPL add-back = (303 + 120) / (10.100 + 120) = 4,1%. NPL sebenarnya NAIK dari 3,4% ke 4,1% — penurunan yang dilaporkan adalah ilusi akuntansi.",
        "Rumus add-back di bawah bukan pengganti NPL resmi — ia alat uji. Setiap kali tren NPL membaik, hitung add-back-nya: jika add-back ikut turun, perbaikan nyata; jika add-back naik sementara NPL turun, kamu sedang melihat kosmetik. Butuh 2 menit, menyelamatkan satu kuartal keputusan.",
        "Generalisasinya: setiap rasio punya 'jalan pintas' lewat pembilang atau penyebut. NPL bisa ditekan via write-off (pembilang) atau via ekspansi kredit agresif (penyebut tumbuh 20% menekan NPL walau nominal bermasalah tetap). Coverage bisa didongkrak dengan menambah CKPN tanpa memperbaiki kualitas. Itu sebabnya metrik selalu dibaca berpasangan: NPL dengan coverage, pertumbuhan kredit dengan NPL, laba dengan CKPN. Laba yang naik karena CKPN turun adalah laba dari cadangan — bukan dari bisnis.",
        "Aturan praktis sebelum merayakan penurunan NPL: tanyakan tiga hal — (1) berapa write-off kuartal ini? (2) coverage naik atau turun? (3) penyebut tumbuh berapa persen? Jika write-off besar, coverage turun, dan penyebut tumbuh cepat, maka 'perbaikan' itu tiga lapis kosmetik. Tiga jawaban, dua menit, satu laporan yang jujur.",
        "Skala fungsi risk reporting: bank BUKU 4 mempekerjakan 80–150 orang di divisi risiko, 15–25 di antaranya khusus reporting. Mereka menghasilkan 40–60 laporan rutin per bulan — harian (likuiditas), mingguan (kredit), bulanan (komite). Satu laporan direksi yang terlambat 1 hari bisa menunda keputusan Rp500 miliar.",
        "Gaji analis risk reporting junior Rp8–12 juta/bulan; lead Rp25–40 juta. Investasi bank pada fungsi ini ≈ Rp5–10 miliar/tahun — kecil dibanding satu keputusan kredit macet Rp100 miliar yang bisa dicegah laporan yang baik. Inilah proposisi nilai profesimu.",
      ],
      formula: String.raw`\text{NPL}_{\text{add-back}} = \frac{\text{Bermasalah}_{t} + \text{WO}_{t}}{\text{Total}_{t} + \text{WO}_{t}}`,
      formulaNote: "Bermasalah_t = kredit bermasalah akhir periode (Rp miliar), WO_t = write-off periode berjalan (Rp miliar), Total_t = total kredit akhir periode (Rp miliar). Contoh: (303 + 120) / (10.100 + 120) = 423 / 10.220 = 4,1%. Interpretasi: tanpa hapus buku, NPL sebenarnya 4,1% — naik dari 3,4%, bukan turun ke 3,0% seperti yang dilaporkan.",
      tasks: [
        { id: "t1", text: "Hitung `bermasalah_akhir`, `npl_addback`, dan `flag`" },
        { id: "t2", text: "Jalankan: pastikan hasil uji tercetak" },
      ],
      expected: "NPL reported 3.0% vs add-back 4.1% -> KOSMETIK",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“NPL turun = kualitas kredit membaik.” Belum tentu — bisa jadi write-off besar, penyebut tumbuh cepat, atau definisi berubah. NPL adalah rasio; rasio membaik karena pembilang mengecil ATAU penyebut membesar. Selalu bedah keduanya sebelum merayakan.",
      },
      hints: [
        "bermasalah_akhir = npl_akhir / 100 * total_akhir.",
        "npl_addback memakai rumus add-back: (bermasalah + wo) / (total + wo) * 100.",
      ],
      code: {
        starter: "# Data kuartal berjalan (Rp miliar). JANGAN UBAH dua baris ini.\ntotal_awal, npl_awal = 10000, 3.4\ntotal_akhir, npl_akhir = 10100, 3.0\nwo = 120  # write-off kuartal ini (Rp miliar)\n\n# TULIS KODEMU: uji kejujuran tren NPL\nbermasalah_akhir =\nnpl_addback =\nflag =  # \"KOSMETIK\" jika npl_addback > npl_awal, selain itu \"SEHAT\"\n\nprint(f\"NPL reported {npl_akhir}% vs add-back {npl_addback:.1f}% -> {flag}\")",
        lockLines: 4,
        solution: "# Data kuartal berjalan (Rp miliar). JANGAN UBAH dua baris ini.\ntotal_awal, npl_awal = 10000, 3.4\ntotal_akhir, npl_akhir = 10100, 3.0\nwo = 120  # write-off kuartal ini (Rp miliar)\n\n# TULIS KODEMU: uji kejujuran tren NPL\nbermasalah_akhir = npl_akhir / 100 * total_akhir\nnpl_addback = (bermasalah_akhir + wo) / (total_akhir + wo) * 100\nflag = \"KOSMETIK\" if npl_addback > npl_awal else \"SEHAT\"\n\nprint(f\"NPL reported {npl_akhir}% vs add-back {npl_addback:.1f}% -> {flag}\")",
        checks: [
          { kind: "equal", task: "t1", label: "`bermasalah_akhir` = 303.0", msg: "3,0% dari Rp10.100 miliar = Rp303 miliar.", name: "bermasalah_akhir", value: 303.0, tol: 1e-09 },
          { kind: "equal", task: "t1", label: "`npl_addback` = 4.14", msg: "(303+120)/(10100+120) x 100 = 4,14%.", name: "npl_addback", value: 4.138943, tol: 0.01 },
          { kind: "equal", task: "t1", label: "`flag` = KOSMETIK", msg: "4,14% > 3,4% (npl_awal) — tren naik yang ditutupi write-off.", name: "flag", value: "KOSMETIK" },
          { kind: "stdout_matches", task: "t2", label: "Hasil uji tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "NPL reported 3\\.0% vs add-back 4\\.1% -> KOSMETIK" }
        ],
      },
      reference: "NPL selalu dibaca dengan write-off + coverage. Add-back = uji kejujuran tren, 2 menit per kuartal.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Format apa untuk situasi apa",
      prose: [
        "Satu: direksi butuh update rutin → satu halaman eksekutif: 3 angka headline + 1 paragraf \u201Cjadi apa?\u201D + rekomendasi. Dua: komite risiko rapat bulanan → 5–10 halaman: temuan, tren 12 bulan, tindak lanjut periode lalu. Tiga: direksi bertanya mendadak 1 jam sebelum rapat → jawaban lisan/1 slide: angka + caveat eksplisit, janji analisis penuh besok. Empat: regulator meminta klarifikasi → dokumen formal: definisi, metodologi, rekonsiliasi angka.",
        "Aturan praktis 10 detik: (1) siapa pembaca? (2) keputusan apa? (3) kapan dibutuhkan? Tiga jawaban itu menentukan format sebelum kamu menulis satu kata pun. Menulis dulu, memikirkan pembaca belakangan = menulis ulang.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Uji ‘halaman 1’ untuk pasangan metrik: tutup semua halaman kecuali halaman 1, lalu tanya — bisakah direksi tahu NPL turun karena write-off Rp120 miliar? Jika tidak, halaman 1-mu menyembunyikan setengah cerita. Pasangan metrik (NPL + coverage + write-off) harus naik ke halaman 1 bersama-sama.",
      },
      reference: "Pembaca + keputusan + deadline = format. Tentukan ketiganya sebelum menulis.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Headline yang jujur untuk Bank Artha Dana",
      prose: [
        "Kembali ke Bank Artha Dana. Data bulan ini: NPL 3,0% (bulan lalu 3,2% — turun 0,2 pp, kabar baik). Coverage ratio 70% (tiga bulan lalu 85% — turun 15 pp). 20 debitur terbesar = 45% total portofolio (batas internal 40%). LCR 110% (kuartal lalu 135%). Draf headline analis junior: \u201CKualitas kredit membaik, NPL turun ke 3,0%.\u201D",
        "Pertanyaan: tulis ulang headline-nya dalam dua kalimat yang jujur. Klik run pada lab di Langkah 3 untuk mengingat cara menghitung perubahan dalam pp, lalu susun jawabanmu sebelum membuka pembahasan.",
        "Pembahasan: \u201CNPL turun 0,2 pp ke 3,0%, tetapi buffer menipis: coverage turun 15 pp ke 70% dan konsentrasi top-20 menembus batas 40% menjadi 45%.\u201D Risiko bukan membaik — ia berpindah bentuk, dari kredit bermasalah yang terlihat menjadi konsentrasi dan buffer yang menipis. Itulah kalimat yang seharusnya dibaca direksi di halaman 1, bukan di halaman 47.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "NPL turun sementara coverage turun = bank \u201Cmembersihkan\u201D NPL dengan hapus buku (write-off), bukan dengan perbaikan kualitas. Tanpa coverage, penurunan NPL adalah kosmetik. Selalu baca NPL berpasangan dengan coverage.",
      },
      reference: "Satu metrik tidak pernah cukup. Pasangan wajib: NPL + coverage, tren + konsentrasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi menjelaskan alasannya — baca why-nya bahkan untuk jawaban yang benar.",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "Sebelum merayakan penurunan NPL, minta tiga angka: write-off kuartal berjalan, coverage awal vs akhir, dan pertumbuhan penyebut. Tiga angka ini memisahkan perbaikan nyata dari kosmetik — dan hanya butuh dua menit untuk dihitung.",
      },

      summary: [
        "Laporan rapi ≠ laporan jujur; hal penting harus di halaman 1, bukan lampiran.",
        "Empat pembaca: direksi (1 halaman), komite (temuan), CRO (detail), regulator (konsistensi).",
        "Halaman 1 = posisi terakhir + arah dalam pp + konteks ekstrem.",
        "Empat jenis laporan: periodik, adhoc, insiden, regulasi — beda pemicu, kecepatan, format.",
        "NPL selalu dibaca berpasangan dengan coverage ratio.",
      ],
      next: { label: "RR2 — Anatomi Laporan Risiko yang Baik", href: "/learn/rr2-anatomi" },
      quiz: [
        {
          q: "Mengapa laporan 60 halaman Bank Artha Dana disebut \u201Cmenyesatkan\u201D padahal angkanya benar?",
          options: [
            { text: "Karena datanya salah hitung", why: "Tidak — semua angka dihitung dengan benar. Masalahnya bukan akurasi." },
            { text: "Karena informasi kritis dikubur di lampiran", why: "Tepat. Konsentrasi 45% dan coverage 70% ada di halaman 47; direksi hanya membaca headline halaman 1.", correct: true },
            { text: "Karena laporannya terlalu tebal", why: "Ketebalan bukan masalahnya — penempatan informasi penting yang salah." },
            { text: "Karena tidak ada grafik berwarna", why: "Grafiknya justru berwarna dan rapi. Presentasi bukan masalahnya." },
          ],
        },
        {
          q: "Direksi hanya punya 5 menit sebelum rapat. Format yang tepat?",
          options: [
            { text: "Laporan lengkap 60 halaman", why: "Tidak akan dibaca — hanya headline yang sampai ke pengambil keputusan." },
            { text: "Satu halaman: 3 angka headline + rekomendasi", why: "Benar. Direksi butuh posisi, arah, dan apa yang harus diputuskan — bukan detail.", correct: true },
            { text: "Slide deck 30 halaman", why: "Masih terlalu panjang untuk 5 menit." },
            { text: "Lampiran data mentah Excel", why: "Data mentah tanpa narasi = direksi menebak sendiri artinya." },
          ],
        },
        {
          q: "NPL naik dari 3,2% ke 3,4%. Penulisan yang jujur untuk laporan?",
          options: [
            { text: "\u201CNPL naik 6,25%\u201D", why: "Menyesatkan — persen relatif membesar-besarkan gerakan kecil pada rasio." },
            { text: "\u201CNPL naik 0,2 pp ke 3,4%\u201D", why: "Benar. Poin persentase adalah bahasa jujur untuk rasio dan suku bunga.", correct: true },
            { text: "\u201CNPL naik 0,2%\u201D", why: "Salah satuan — 0,2% berarti 0,002, bukan 0,2 poin persentase." },
          ],
        },
        {
          q: "Pasangan metrik yang wajib dibaca bersamaan dengan NPL?",
          options: [
            { text: "LCR", why: "LCR soal likuiditas, bukan kualitas kredit — penting tapi bukan pasangannya." },
            { text: "Coverage ratio", why: "Benar. NPL turun + coverage turun = write-off kosmetik, bukan perbaikan.", correct: true },
            { text: "Jumlah karyawan", why: "Tidak relevan dengan kualitas kredit." },
          ],
        },
        {
          q: "Permintaan mendadak direksi 1 jam sebelum rapat paling tepat dijawab dengan?",
          options: [
            { text: "Analisis lengkap 3 hari", why: "Keputusan diambil hari ini — analisis sempurna yang terlambat = tidak berguna." },
            { text: "Satu angka + caveat eksplisit, janji pendalaman besok", why: "Benar. Cepat dengan batasan yang jelas mengalahkan sempurna yang terlambat.", correct: true },
            { text: "Menolak karena waktu tidak cukup", why: "Menolak tanpa alternatif membuat direksi memutuskan tanpa data sama sekali." },
          ],
        },
      ],
    },
  ],
};
