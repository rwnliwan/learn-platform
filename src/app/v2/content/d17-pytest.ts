import type { V2Lesson } from "../lib/types";

// ── Figure: biaya bug per tahap ditemukan ─────────────────────────────────
const BIAYA_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang biaya perbaikan bug: saat ditulis, saat di-review, saat laporan terbit, saat diaudit regulator">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="216" x2="500" y2="216"/>
<line x1="60" y1="176" x2="500" y2="176"/><line x1="60" y1="136" x2="500" y2="136"/>
<line x1="60" y1="96" x2="500" y2="96"/><line x1="60" y1="56" x2="500" y2="56"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="219">1x</text><text x="54" y="179">10x</text><text x="54" y="139">50x</text>
<text x="54" y="99">200x</text><text x="54" y="59">1000x</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="96" y="208" width="56" height="8" fill="var(--c1)" opacity="0.9"/>
<text x="124" y="200" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">1x</text>
<text x="124" y="232" text-anchor="middle" fill="var(--text)">saat</text>
<text x="124" y="246" text-anchor="middle" fill="var(--text)">ditulis</text>
<rect x="206" y="176" width="56" height="40" fill="var(--c1)" opacity="0.9"/>
<text x="234" y="168" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">10x</text>
<text x="234" y="232" text-anchor="middle" fill="var(--text)">saat</text>
<text x="234" y="246" text-anchor="middle" fill="var(--text)">di-review</text>
<rect x="316" y="116" width="56" height="100" fill="var(--c2)" opacity="0.85"/>
<text x="344" y="108" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">100x</text>
<text x="344" y="232" text-anchor="middle" fill="var(--text)">laporan</text>
<text x="344" y="246" text-anchor="middle" fill="var(--text)">terbit</text>
<rect x="426" y="56" width="56" height="160" fill="var(--c2)" opacity="0.85"/>
<text x="454" y="48" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">1000x</text>
<text x="454" y="232" text-anchor="middle" fill="var(--text)">diaudit</text>
<text x="454" y="246" text-anchor="middle" fill="var(--text)">regulator</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="60" y="30">biaya relatif perbaikan satu bug yang sama (ilustrasi aturan praktis industri)</text>
</g>
</svg>`;

const LAB_SETUP = `# Fungsi analis yang akan diuji (sudah benar — jangan diubah)
def npl_rate(n_macets, n_total):
    if n_total == 0:
        return 0.0
    return n_macets / n_total


# Mini-runner ala pytest: fungsi test_ + assert (pola 1:1 dengan pytest asli)
def jalankan(daftar_test):
    lolos = 0
    for nama, fn in daftar_test:
        try:
            fn()
            print("PASS", nama)
            lolos += 1
        except AssertionError as e:
            print("FAIL", nama, "-", e)
    print("Ringkasan:", str(lolos) + "/" + str(len(daftar_test)), "lolos")
    return lolos
`;

export const d17: V2Lesson = {
  slug: "d17-pytest",
  track: "Python",
  module: "Rekayasa",
  title: "pytest: Tes yang Melindungi Analisismu — Fixture & Parametrize untuk Fungsi Transformasi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu baris berubah, tiga bulan laporan salah — tanpa ada yang sadar",
      prose: [
        "Analis risiko sebuah multifinance mengubah satu baris di fungsi bucket_dpd: batas “telat” dari 90 hari menjadi 60 hari untuk segmen mikro — permintaan bisnis yang sah. Ia mengedit, menjalankan notebook, melihat angka berubah sesuai harapan, lalu commit. Tiga bulan kemudian audit internal menemukan NPL segmen mikro dilaporkan 2,1% padahal seharusnya 3,4% — selisih yang mengubah keputusan pencadangan. Penyebabnya: fungsi yang sama dipakai JUGA oleh segmen ritel (yang batasnya tetap 90) — perubahan untuk mikro merembes ke ritel tanpa ada yang menyadari.",
        "Twist-nya: analis itu tidak ceroboh — ia MENGUJI dengan matanya (menjalankan notebook, melihat output). Masalahnya: matanya hanya memeriksa kasus yang ia ubah (mikro), bukan kasus yang tidak ia sentuh (ritel). Bug-nya bukan di kode baru — melainkan di asumsi lama (“fungsi ini pasti masih benar untuk ritel”) yang tidak pernah DITULIS sebagai tes. Tiga bulan laporan salah bukan karena tidak ada testing — melainkan karena testing-nya tidak otomatis dan tidak lengkap.",
        "Solusinya bernama pytest: framework testing Python di mana kamu menulis fungsi test_ berisi assert — “saya MENYATAKAN bucket_dpd(91) harus 'macet'” — dan mesin menjalankannya tiap ada perubahan. Lesson ini tentang menulis tes untuk fungsi transformasi analis (bukan untuk aplikasi raksasa). Bekal ringkas dari dua lesson prasyarat (diringkas agar mandiri): dari Python dasar — fungsi def, if/elif/else, dan assert (pernyataan “harus benar, atau error”); dari struktur data — list dan dict untuk data uji.",
      ],
      tasks: [],
      note: {
        title: "Catatan kejujuran tentang lab lesson ini",
        type: "risk",
        body: "pytest ASLI berjalan di terminal (perintah: pytest test_keuangan.py -v) dan tidak tersedia sebagai paket resmi Pyodide — jadi lab di browser memakai mini-runner Python murni dengan POLA 1:1 pytest (fungsi test_, assert, parametrize via loop, fixture via fungsi setup). Salin kode lab ke file .py di laptop dan jalankan dengan pytest asli — tidak ada yang perlu diubah kecuali menghapus mini-runner-nya.",
      },
      reference: "Bug 3 bulan bukan karena tak ada testing — melainkan testing tak otomatis & tak lengkap. pytest = assert yang dijalankan mesin.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita 3 bulan laporan salah. (2) Peta ini. (3) Konsep: test sebagai jaring pengaman — Si Penjaga Gerbang. (4) Konsep: fixture & parametrize — Si Pabrik Skenario. (5) Konsep: kapan analis perlu ngetes (dan kapan tidak). (6) Lab: tulis fungsi + test ala pytest. (7) Chart: biaya bug per tahap ditemukan. (8) Peta keputusan: lima skenario testing. (9) Mini-case: membangun safety net pipeline NPL. (10) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menulis test pytest untuk fungsi transformasi (test_, assert dengan pesan); (2) memakai fixture untuk data uji bersama dan parametrize untuk banyak kasus; (3) memutuskan APA yang layak dites di pekerjaan analis (fungsi murni, bukan notebook utuh); (4) menjalankan pytest di terminal dan membaca laporannya.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: def nama_fungsi(arg): mendefinisikan fungsi; if/elif/else untuk cabang; assert kondisi, \"pesan\" — bila kondisi False, Python melempar AssertionError berisi pesan; list [(a,b)] untuk daftar kasus uji.",
        "Rutenya: cerita → peta → tiga konsep inti → lab → chart biaya → peta keputusan → mini-case → kuis. Estimasi 50 menit; lab ±12 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap setiap assert sebagai “janji tertulis” fungsimu kepada masa depan. Kode berubah (pasti), orang berganti (pasti) — janji tertulis inilah yang berteriak saat seseorang (termasuk kamu 6 bulan lagi) melanggarnya tanpa sadar.",
      ],
      reference: "Tujuan: test_ + assert + fixture + parametrize + kapan ngetes. Pola lab 1:1 dengan pytest asli.",
    },
    {
      id: "konsep-gerbang",
      eyebrow: "Langkah 3 · Konsep",
      title: "Test — Si Penjaga Gerbang",
      prose: [
        "Definisi: test adalah fungsi bernama test_ yang berisi ASSERT — pernyataan tentang perilaku yang HARUS benar. Contoh: def test_bucket_batas(): assert bucket_dpd(90) == \"telat\"; assert bucket_dpd(91) == \"macet\". pytest menemukan semua fungsi test_*, menjalankannya, dan melaporkan PASS/FAIL per fungsi. Filosofinya: bukan “membuktikan kode benar” (mustahil), melainkan “menangkap saat kode BERUBAH PERILAKU tanpa disadari” — persis kasus cerita pembuka.",
        "Kepribadiannya: test adalah penjaga gerbang yang memeriksa KTP setiap orang lewat — bukan sekali, melainkan SETIAP KALI. Kode boleh berubah (renovasi), orang boleh berganti (penghuni baru), tetapi siapa pun yang lewat gerbang harus menunjukkan KTP yang cocok dengan daftar (assert). Tanpa penjaga, penyusup (bug) masuk diam-diam dan baru ketahuan saat audit 3 bulan kemudian. Dengan penjaga, ia ditahan di gerbang — detik itu juga.",
        "Kapan memakai: untuk FUNGSI TRANSFORMASI MURNI analis — fungsi yang input → output deterministik tanpa efek samping: bucket_dpd, npl_rate, hitung_bunga, bersihkan_nama. Tiga aturan assert yang baik: (1) satu perilaku per assert (bukan 10 assert campur aduk tanpa pesan); (2) SELALU beri pesan — assert x == 2, \"dpd 90 harus telat\" — pesan adalah dokumentasi kegagalan; (3) uji BATAS (boundary): 30/31, 90/91 — bug paling sering sembunyi di perbatasan, bukan di tengah. Menjalankan: pytest test_keuangan.py -v — -v menampilkan tiap test PASS/FAIL satu per satu.",
      ],
      formula: String.raw`\text{nilai\_test} = \frac{\text{bug tertangkap di gerbang}}{\text{total perubahan perilaku}} \to 1`,
      formulaNote: "Bukan rumus hitung melainkan TARGET: pecahan perubahan perilaku yang tertangkap test harus mendekati 1 (semua). Interpretasi: setiap kali kamu mengubah fungsi dan SEMUA test tetap hijau, kamu mendapat BUKTI (bukan perasaan) bahwa perilaku yang dijanjikan tidak berubah. Contoh angka cerita: bila test_bucket_batas ada sebelum perubahan mikro, perubahan batas 90→60 akan membuat assert bucket_dpd(91) == \"macet\"... tetap lolos — tetapi test ritel assert bucket_dpd(61) == \"telat\" akan GAGAL merah detik itu juga, dan analis tahu ia merembes sebelum commit. Satu assert merah menghemat 3 bulan laporan salah.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Testing = menjalankan kode dan melihat outputnya”",
        type: "pitfall",
        body: "Yang benar: itu “testing dengan mata” — hanya memeriksa kasus yang kamu PIKIRKAN saat itu, dan tidak bisa diulang mesin. Test pytest = ekspektasi TERTULIS yang dijalankan OTOMATIS tiap ada perubahan, termasuk untuk kasus yang tidak kamu pikirkan hari ini. Mata lelah dan lupa; mesin tidak.",
      },
      hints: [
        "💡 Intuisi gerbang: tulis test SEBELUM mengubah fungsi yang sudah bekerja (atau sesaat sesudah menulis fungsi baru). Test yang ditulis setelah bug ditemukan hanya mendokumentasikan bug — test yang ditulis sebelum perubahan mencegahnya.",
      ],
      reference: "test_ + assert = janji tertulis yang diperiksa mesin tiap ada perubahan. Uji batas (30/31, 90/91).",
    },
    {
      id: "konsep-pabrik",
      eyebrow: "Langkah 4 · Konsep",
      title: "Fixture & Parametrize — Si Pabrik Skenario",
      prose: [
        "Definisi dua senjata pytest untuk analis: (1) FIXTURE — fungsi @pytest.fixture yang menyiapkan data/keadaan bersama untuk banyak test (koneksi, DataFrame contoh, config). Test memakainya cukup dengan menyebut namanya sebagai argumen: def test_x(df_contoh): — pytest menyuntikkannya otomatis. (2) PARAMETRIZE — @pytest.mark.parametrize(\"n_macets,n_total,harap\", [(6,8,0.75),(0,8,0.0),(8,8,1.0)]) menjalankan SATU fungsi test untuk BANYAK kasus — tiap kasus menjadi baris PASS/FAIL sendiri di laporan.",
        "Kepribadiannya: fixture adalah pabrik yang menyiapkan panggung sebelum tiap pertunjukan (test) — panggungnya selalu sama, selalu bersih, tanpa tiap sutradara (test) membangun sendiri. Parametrize adalah mesin fotokopi skenario — tulis logika pemeriksaan SEKALI, fotokopi untuk 20 kasus batas. Tanpa keduanya, test analis menjadi copy-paste 20 fungsi yang 90%-nya sama — dan copy-paste test sama berbahayanya dengan copy-paste query (satu kasus diperbarui, 19 lupa).",
        "Kapan memakai: fixture untuk data uji yang dipakai ≥3 test (df_transaksi_contoh, config batas_dpd); parametrize untuk tabel kasus batas — inilah pola EMAS analis: [(0,\"lancar\"),(30,\"lancar\"),(31,\"telat\"),(90,\"telat\"),(91,\"macet\")]. Contoh pytest asli (salin ke laptop): @pytest.fixture def df_kecil(): return pd.DataFrame({...}) — lalu def test_npl(df_kecil): .... Dan @pytest.mark.parametrize di atas untuk npl_rate. Aturan: fixture untuk APA yang disiapkan, parametrize untuk BERAPA BANYAK kasus — keduanya membuat test ringkas tetapi cakupannya luas.",
      ],
      formula: String.raw`\text{cakupan} = n_{\text{test}} \times n_{\text{kasus}} \quad\text{dengan} \quad \text{usaha} \approx n_{\text{test}} + n_{\text{kasus}}`,
      formulaNote: "Simbol: n_test = jumlah fungsi test, n_kasus = kasus per test (via parametrize). Interpretasi: TANPA parametrize, 5 fungsi × 4 kasus = 20 fungsi test yang ditulis manual (usaha ~20). DENGAN parametrize, 5 fungsi × 4 kasus = 5 fungsi + 20 baris kasus (usaha ~5+4). Cakupan sama (20 skenario diperiksa), usaha jauh lebih kecil — dan menambah kasus baru hanya menambah satu baris tuple, bukan satu fungsi. Inilah ekonomi pabrik skenario.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Fixture = variabel global, jadi sama saja”",
        type: "pitfall",
        body: "Yang benar: fixture dibuat ULANG (fresh) untuk tiap test secara default (scope=function) — test tidak bisa saling mengotori lewat fixture. Variabel global sebaliknya: test A mengubahnya, test B gagal misterius. Inilah bedanya “pabrik yang memproduksi baru tiap pesanan” vs “gudang bersama”.",
      },
      hints: [
        "💡 Intuisi pabrik: setiap kali kamu copy-paste satu fungsi test hanya untuk mengganti angkanya, berhentilah — itu parametrize yang belum lahir. Setiap kali 3 test membangun DataFrame contoh yang sama, berhentilah — itu fixture yang belum lahir.",
      ],
      reference: "Fixture = panggung bersih per test. Parametrize = satu logika, banyak kasus. Ekonomi: cakupan ×, usaha +.",
    },
    {
      id: "konsep-kapan",
      eyebrow: "Langkah 5 · Konsep",
      title: "Kapan Analis Perlu Ngetes — Piramida Mini",
      prose: [
        "Definisi piramida test versi analis (bukan software engineer): LAPISAN BAWAH (paling banyak) — test fungsi transformasi murni: bucket_dpd, npl_rate, hitung_bunga_efektif, parsing_tanggal. LAPISAN TENGAH (sedikit) — test integrasi kecil: query SQL atas database contoh menghasilkan angka yang diharapkan; pipeline 3 langkah atas data sintetis. LAPISAN ATAS (paling sedikit) — test ujung-ke-ujung: satu notebook/pipeline penuh atas data contoh berjalan tanpa error. Aturan alokasi: 70% usaha di lapisan bawah — di sanalah bug analis paling sering sembunyi dan paling murah ditangkap.",
        "Kepribadiannya: piramida ini seperti asuransi berlapis — asuransi dasar (fungsi) murah dan meng-cover 90% risiko; asuransi komprehensif (ujung-ke-ujung) mahal dan jarang klaim. Analis yang hanya punya lapisan atas (“notebook saya jalan”) seperti orang yang hanya punya asuransi jiwa tetapi tidak punya BPJS — saat sakit ringan (bug fungsi), tidak ada yang menanggung.",
        "Kapan TIDAK ngetes: eksplorasi sekali pakai di notebook (belum tahu apa yang dicari — test mengkristalkan tebakan prematur); visualisasi styling (test tidak bisa menilai “cantik”); kode yang akan dibuang besok. Kapan WAJIB ngetes: fungsi yang dipakai >1 tempat (inilah kasus cerita: dipakai mikro DAN ritel); fungsi yang angkanya masuk laporan/keputusan; fungsi yang pernah punya bug (bug yang kembali = regresi — test regresi menguncinya selamanya). Tes 10 detik: “bila fungsi ini diam-diam berubah perilaku, siapa yang tahu dan kapan?” — bila jawabannya “tidak ada yang tahu sampai audit”, tulis test-nya SEKARANG.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengetes notebook utuh 500 sel sebagai “test”. Notebook itu rapuh untuk dites (state antar-sel, output visual, waktu eksekusi menit). Pola yang benar: EKSTRAK logika ke fungsi di file .py, test fungsinya dengan pytest, notebook hanya memanggil fungsi. Notebook = etalase; fungsi = mesin — yang dites adalah mesin.",
      },
      hints: [
        "💡 Intuisi piramida: setiap bug yang kamu temukan manual, tanyakan “test lapisan apa yang SEHARUSNYA menangkap ini?” Lalu tulis test itu. Dalam 3 bulan, piramidamu tumbuh tepat di tempat bug-mu hidup — bukan di tempat tutorial menyuruh.",
      ],
      reference: "70% di fungsi murni; sedikit integrasi; sedikit ujung-ke-ujung. Wajib bila: dipakai >1 tempat, masuk laporan, pernah bug.",
    },
    {
      id: "lab-test",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Tulis fungsi + test ala pytest",
      prose: [
        "Waktunya praktik dengan pola 1:1 pytest. Fungsi npl_rate sudah disediakan; mini-runner jalankan() sudah disediakan (di pytest asli, perannya digantikan perintah pytest di terminal). Tugasmu: (1) lengkapi fungsi bucket_dpd — batas: ≤30 “lancar”, ≤90 “telat”, sisanya “macet”; (2) lengkapi test_bucket_batas dengan 5 assert batas (0, 30, 31, 90, 91) beserta pesannya; (3) jalankan dan pastikan 3/3 lolos.",
        "Perhatikan pola parametrize yang sudah dicontohkan di test_npl_parametrize: daftar kasus + loop + satu assert — inilah @pytest.mark.parametrize versi manual. Di laptop, polanya menjadi decorator; logikanya identik.",
        "Coba: setelah 3/3 lolos, SABOTASE fungsimu sendiri — ubah batas 90 menjadi 60 di bucket_dpd, jalankan ulang, dan lihat test mana yang merah. Itulah simulasi cerita pembuka: penjaga gerbang menangkap perubahan perilaku DALAM DETIK, bukan 3 bulan. Lalu kembalikan ke 90.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `bucket_dpd`: kembalikan 'lancar' bila dpd<=30, 'telat' bila dpd<=90, 'macet' bila lainnya" },
        { id: "t2", text: "Lengkapi 5 assert di `test_bucket_batas` untuk dpd 0, 30, 31, 90, 91 beserta pesannya" },
        { id: "t3", text: "Jalankan `jalankan([...])` dan pastikan ringkasan 3/3 lolos" },
      ],
      expected: "PASS test_bucket_batas | PASS test_npl_rate | PASS test_npl_parametrize | Ringkasan: 3/3 lolos",
      code: {
        starter:
          LAB_SETUP +
          `
def bucket_dpd(dpd):
    if dpd <= 30:
        return ...
    if dpd <= 90:
        return ...
    return ...


def test_bucket_batas():
    assert bucket_dpd(0) == ..., "dpd 0 harus lancar"
    assert bucket_dpd(30) == ..., "batas 30 masih lancar"
    assert bucket_dpd(31) == ..., "31 mulai telat"
    assert bucket_dpd(90) == ..., "batas 90 masih telat"
    assert bucket_dpd(91) == ..., "91 sudah macet"


def test_npl_rate():
    assert npl_rate(6, 8) == 0.75
    assert npl_rate(0, 8) == 0.0
    assert npl_rate(3, 0) == 0.0, "pembagi nol harus aman"


kasus_npl = [(6, 8, 0.75), (0, 8, 0.0), (8, 8, 1.0)]

def test_npl_parametrize():
    for n_macets, n_total, harap in kasus_npl:
        assert npl_rate(n_macets, n_total) == harap, "kasus macet/total"


lolos = jalankan([
    ("test_bucket_batas", test_bucket_batas),
    ("test_npl_rate", test_npl_rate),
    ("test_npl_parametrize", test_npl_parametrize),
])`,
        lockLines: 20,
        solution:
          LAB_SETUP +
          `
def bucket_dpd(dpd):
    if dpd <= 30:
        return "lancar"
    if dpd <= 90:
        return "telat"
    return "macet"


def test_bucket_batas():
    assert bucket_dpd(0) == "lancar", "dpd 0 harus lancar"
    assert bucket_dpd(30) == "lancar", "batas 30 masih lancar"
    assert bucket_dpd(31) == "telat", "31 mulai telat"
    assert bucket_dpd(90) == "telat", "batas 90 masih telat"
    assert bucket_dpd(91) == "macet", "91 sudah macet"


def test_npl_rate():
    assert npl_rate(6, 8) == 0.75
    assert npl_rate(0, 8) == 0.0
    assert npl_rate(3, 0) == 0.0, "pembagi nol harus aman"


kasus_npl = [(6, 8, 0.75), (0, 8, 0.0), (8, 8, 1.0)]

def test_npl_parametrize():
    for n_macets, n_total, harap in kasus_npl:
        assert npl_rate(n_macets, n_total) == harap, "kasus macet/total"


lolos = jalankan([
    ("test_bucket_batas", test_bucket_batas),
    ("test_npl_rate", test_npl_rate),
    ("test_npl_parametrize", test_npl_parametrize),
])`,
        checks: [
          { kind: "equal", task: "t3", name: "lolos", value: 3, tol: 0, label: "`lolos` = 3", msg: "Ketiga fungsi test harus PASS — periksa assert yang merah dan pesan kesalahannya." },
          { kind: "defined", task: "t2", name: "test_bucket_batas", label: "`test_bucket_batas` terdefinisi", msg: "Lengkapi 5 assert batas beserta pesannya." },
          { kind: "stdout_matches", task: "t3", pattern: "Ringkasan: 3/3 lolos", label: "Ringkasan 3/3 tercetak", msg: "Runner mencetak ringkasan di akhir — pastikan daftar test lengkap." },
          { kind: "stdout_matches", task: "t3", pattern: "PASS test_bucket_batas", label: "test_bucket_batas PASS", msg: "Lima assert batas (0/30/31/90/91) harus semuanya hijau." },
        ],
      },
      reference: "Pola pytest: test_ + assert + pesan. Di laptop: simpan sebagai test_keuangan.py, jalankan pytest -v.",
    },
    {
      id: "chart-biaya",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca biaya keterlambatan: 1×, 10×, 100×, 1000×",
      prose: [
        "Chart di bawah menunjukkan biaya relatif memperbaiki SATU bug yang sama, tergantung kapan ia ditemukan — aturan praktis industri perangkat lunak yang juga berlaku untuk analis.",
        "Cara membaca: sumbu Y = kelipatan biaya (skala non-linier: 1×, 10×, 50×, 200×, 1000×); tiap batang = tahap penemuan.",
        "Interpretasi: bug yang ditangkap test saat ditulis = 1× (perbaiki 5 menit). Lolos ke review = 10× (diskusi + revisi). Lolos ke laporan terbit = 100× (ralat laporan, jelaskan ke direksi — inilah cerita pembuka: 3 bulan). Lolos ke audit regulator = 1000× (denda, reputasi, investigasi forensik). Pelajaran chart: testing bukan biaya — ia adalah DISKON 99,9% atas biaya bug. Analis yang “tidak sempat ngetes” sedang memilih membayar 100× nanti daripada 1× sekarang.",
      ],
      figure: {
        svg: BIAYA_SVG,
        alt: "Diagram batang biaya perbaikan bug: saat ditulis 1x, saat di-review 10x, laporan terbit 100x, diaudit regulator 1000x.",
        caption: "Biaya relatif satu bug per tahap penemuan (ilustrasi). Testing = diskon 99,9% atas biaya bug.",
      },
      tasks: [],
      reference: "Semakin telat ditemukan, semakin mahal — eksponensial. Test menggeser penemuan ke kiri (termurah).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Kapan ngetes, kapan tidak — lima skenario",
      prose: [
        "Lima skenario keputusan testing untuk analis:",
        "Skenario 1 — Fungsi bucket_dpd dipakai 4 pipeline dan angkanya masuk laporan direksi. → Test penuh: batas + parametrize + regresi. Alasan: dipakai >1 tempat + masuk keputusan = wajib (kasus cerita pembuka).",
        "Skenario 2 — Notebook eksplorasi sekali pakai, belum tahu pola apa yang dicari. → JANGAN ngetes dulu. Alasan: test mengkristalkan tebakan prematur; eksplorasi butuh kebebasan. Test ditulis SETELAH pola ditemukan dan logika diekstrak ke fungsi.",
        "Skenario 3 — Fungsi pernah punya bug (mis. off-by-one di batas). → Test regresi yang mengunci kasus bug itu SELAMANYA. Alasan: bug yang kembali adalah bug termahal secara moral — test regresi adalah janji “tidak akan terulang”.",
        "Skenario 4 — Pipeline 3 langkah: baca DB → transform → tulis Parquet. → Test integrasi kecil atas data sintetis (10 baris contoh dengan jawaban yang dihitung manual). Alasan: lapisan tengah piramida — menangkap salah wiring antar-langkah yang tidak terlihat di test fungsi.",
        "Skenario 5 — Deadline 2 jam, fungsi baru 20 baris untuk laporan ad-hoc sekali pakai. → Test minimal: 2–3 assert untuk kasus utama + batas. Alasan: BUKAN “tidak sempat” — 3 assert butuh 3 menit dan melindungi dari salah ketik fatal. Tidak ada deadline yang menghalalkan nol test untuk kode yang angkanya dipakai orang.",
        "Aturan praktis 10 detik: dipakai >1 / masuk laporan / pernah bug → test penuh; eksplorasi sekali pakai → tunda; selalu: minimal 3 assert untuk fungsi baru; bug ditemukan → tulis test regresinya dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Nanti saja ngetesnya kalau sempat.” Nanti = tidak pernah — dan bug menunggu “nanti” itu. Test ditulis BERSAMAAN dengan fungsi (atau sebelum mengubah fungsi lama), bukan sebagai fase terpisah. Test adalah bagian dari “selesai”, bukan bonus.",
      },
      reference: "Test = bagian dari selesai, bukan bonus. Minimal 3 assert untuk fungsi baru.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Membangun safety net pipeline NPL dalam 1 sprint",
      prose: [
        "Skenario (sintetis, angka konkret): pipeline NPL multifinance: 6 fungsi transformasi (bucket_dpd, hitung_bunga_efektif, flag_restrukturisasi, agregasi_segmen, npl_rate, format_laporan), dijalankan mingguan, hasilnya masuk laporan direksi dan OJK. Riwayat: 2 insiden “angka berubah tanpa sebab jelas” dalam setahun (biaya investigasi ±Rp 120 juta total). Kamu diberi 1 sprint (2 minggu) untuk membangun safety net testing.",
        "Pertanyaan analisis: (1) Dengan 2 minggu, test apa yang kamu tulis DULU — urutkan 6 fungsi berdasarkan risiko? (2) Berapa banyak test cukup — kapan “cukup” tercapai? (3) Bagaimana memastikan tim TETAP menjalankan test 6 bulan kemudian?",
        "Pembahasan: (1) Urutan risiko = (dipakai di banyak tempat × masuk keputusan × pernah bermasalah): bucket_dpd (dipakai semua segmen + pernah insiden) → npl_rate (angka final laporan) → agregasi_segmen (wiring antar-langkah) → flag_restrukturisasi (aturan bisnis kompleks) → hitung_bunga_efektif (rumus stabil, jarang berubah) → format_laporan (kosmetik). Alokasi: 60% waktu untuk 3 teratas. (2) “Cukup” = setiap fungsi berisiko punya: kasus normal + semua batas + 1 kasus aneh (nol, negatif, null) — bukan 100% code coverage buta. Coverage 100% dengan assert lemah (assert True) adalah teater; 10 assert batas yang tajam mengalahkan 100 assert basa-basi. (3) Keberlangsungan: test dijalankan OTOMATIS tiap ada perubahan (CI sederhana: pytest tiap push/commit — tanpa otomatisasi, test mati dalam 2 bulan) + aturan tim: PR tanpa test untuk fungsi berisiko = ditolak review. Test yang tidak dijalankan otomatis = dokumentasi mati.",
        "Kaitan ke karier: “membangun safety net testing yang menurunkan insiden angka dari 2 menjadi 0 per tahun” adalah bukti rekayasa yang langka di kalangan analis — sebagian besar analis tidak pernah menulis test. Ini pembeda instan di interview.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dua insiden “angka berubah tanpa sebab” per tahun pada laporan OJK bukan sekadar malu — ia adalah temuan kepatuhan yang menunggu terjadi. Safety net testing adalah kontrol detektif (detective control) atas integritas angka — setara dengan rekonsiliasi di akuntansi, tetapi untuk logika kode.",
      },
      reference: "Urutkan test by risiko; cukup = normal + batas + aneh; otomatisasi + aturan review = hidup.",
    },
    {
      id: "advanced-numerik",
      eyebrow: "Langkah 10 · Advanced",
      title: "Advanced: testing kode numerik & stokastik — seed, toleransi, invarian",
      prose: [
        "Masalahnya: kode analis penuh angka acak dan float — assert hasil == 8.671555 adalah kerapuhan yang disengaja, karena run berikutnya memberi angka beda. Tiga teknik praktisi. Pertama, SEED DETERMINISM: tetapkan seed di test (rng = np.random.default_rng(123)), lalu assert nilai eksak — kamu tidak menguji \"keacakan\", kamu menguji \"dengan seed ini, pipeline menghasilkan golden output ini\"; bila output berubah, sesuatu dalam logika berubah. Kedua, TOLERANSI: untuk komputasi float, assert dengan batas — abs(a - b) < 1e-6 atau pytest.approx(8.671, abs=1e-3) — karena 0.1 + 0.2 != 0.3 di floating point, dan test yang gagal karena epsilon adalah test yang berbohong. Ketiga, INVARIAN — yang paling kuat: bukan nilai spesifik, melainkan sifat yang HARUS selalu benar: npl_rate selalu dalam [0,1]; jumlah baris output cleaning <= jumlah baris input; kolom hasil agregasi tidak boleh negatif; fungsi monotonik tetap monotonik.",
        "Naik satu level: PROPERTY-BASED TESTING (library hypothesis). Daripada memilih kasus manual [(6,8,0.75), (0,8,0.0)] — yang hanya menguji yang kamu pikirkan — kamu mendeklarasikan BENTUK input dan INVARIAN yang harus bertahan: @given(st.integers(0, 10**6), st.integers(1, 10**6)) lalu assert 0 <= npl_rate(a,b) <= 1. Framework membangkitkan ratusan kasus termasuk tepi adversarial yang tidak kamu pikirkan: 0, negatif, sangat besar. Untuk fungsi cleaning analis ini sempurna: \"tidak ada input yang boleh menghasilkan umur negatif\", \"tidak ada input yang boleh menambah baris\". Satu test properti menggantikan 20 test contoh — dan menemukan bug di kasus yang tidak pernah kamu bayangkan.",
        "Terakhir: CI untuk notebook dan script. Notebook TIDAK dites sebagai notebook — 500 sel dengan state antar-sel adalah mimpi buruk test. Polanya: ekstrak logika ke fungsi di file .py, test fungsinya dengan pytest, notebook hanya memanggil fungsi (etalase, bukan mesin). Lalu pasang CI (GitHub Actions: setiap push menjalankan pytest) — setiap perubahan fungsi transformasi otomatis diperiksa penjaga gerbangnya. Aturan keputusan: test APA yang dites — yang punya kontrak (fungsi, tahap pipeline, skema di batas pipeline); JANGAN test eksplorasi sekali pakai. Tes 10 detik yang tetap berlaku: \"bila tahap pipeline ini diam-diam berubah perilaku, siapa yang tahu dan kapan?\" — bila jawabannya \"tidak ada yang tahu sampai laporan terbit\", di sanalah test (dan CI) dipasang.",
      ],
      tasks: [],
      reference: "Stokastik: seed + toleransi + invarian. Property-based: deklarasikan bentuk input & invarian. Notebook: ekstrak fungsi, test .py-nya, CI menjalankannya.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 11 · Intuisi",
      title: "Intuisi: test kontraknya, bukan implementasinya",
      prose: [
        "Heuristik penutup: test yang paling berharga bukan yang paling banyak — melainkan yang menangkap perubahan perilaku paling mahal.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: test kontraknya, bukan implementasinya",
        body: "Test yang rapuh menguji IMPLEMENTASI (\"fungsi ini memanggil groupby lalu mean\") — ia merah saat kamu refactor padahal perilaku benar. Test yang kuat menguji KONTRAK (\"untuk input ini, outputnya ini\"; \"properti ini selalu bertahan\") — ia hijau saat refactor, merah hanya saat perilaku berubah. Heuristiknya: bila test-mu gagal setelah refactor yang benar, test-nya yang salah, bukan kodemu. Heuristik kedua: setiap bug yang kamu temukan manual WAJIB diabadikan sebagai test regresi — bug yang kembali adalah bug yang tidak divaksin; test regresi adalah vaksinnya. Heuristik ketiga, khusus analis: test DATA sama pentingnya dengan test KODE — assert skema di batas pipeline (kolom ada, tipe benar, tidak ada duplikat id) menangkap \"data hulu berubah format\" yang tidak akan pernah ditangkap test fungsi. Heuristik keempat: untuk kode stokastik, jangan pernah assert nilai eksak tanpa seed — assert sebaran (mean dalam 3 sigma), batas (0 sampai 1), atau determinisme ber-seed. Dan ukuran kedewasaan test suite bukan jumlah test, melainkan: berapa lama dari \"kode berubah perilaku\" sampai \"seseorang tahu\" — targetnya detik (CI), bukan kuartal (audit).",
      },
      reference: "Test kontrak bukan implementasi; bug manual → test regresi; test skema di batas pipeline; stokastik = sebaran/batas/seed.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "pytest = fungsi test_ + assert yang dijalankan mesin tiap ada perubahan — menangkap perubahan perilaku (bukan membuktikan kebenaran); uji batas (30/31, 90/91) karena bug sembunyi di perbatasan.",
        "Fixture = panggung bersih yang disiapkan ulang per test (bukan variabel global); parametrize = satu logika test untuk banyak kasus — ekonomi cakupan × dengan usaha +.",
        "Piramida analis: 70% di fungsi transformasi murni, sedikit integrasi, sedikit ujung-ke-ujung; notebook = etalase, fungsi .py = mesin yang dites.",
        "Wajib test bila: dipakai >1 tempat, angkanya masuk laporan/keputusan, pernah punya bug (test regresi); tunda untuk eksplorasi sekali pakai.",
        "Biaya bug eksponensial per tahap keterlambatan (1×→10×→100×→1000×) — testing adalah diskon 99,9%; test = bagian dari “selesai”, dijalankan otomatis.",
      ],
      next: { label: "D18 — FastAPI & REST API", href: "/v2/learn/d18-fastapi-rest-api" },
      quiz: [
        {
          q: "Akar masalah 3 bulan laporan NPL salah di cerita pembuka adalah…",
          options: [
            { text: "Tidak ada test otomatis yang mengunci perilaku fungsi untuk segmen yang TIDAK diubah — asumsi “pasti masih benar” tidak pernah ditulis sebagai assert", why: "Benar: analis menguji dengan mata hanya kasus yang diubah (mikro). Test pytest akan menangkap rembesan ke ritel dalam detik via assert yang merah.", correct: true },
            { text: "Analis tidak menjalankan kode sama sekali sebelum commit", why: "Salah: ia menjalankan notebook dan melihat output — “testing dengan mata”. Masalahnya bukan tidak menjalankan, melainkan tidak otomatis & tidak lengkap." },
            { text: "Bahasa Python tidak cocok untuk perhitungan NPL", why: "Salah: bahasanya tidak relevan — masalahnya metodologi verifikasi, bukan tool." },
            { text: "Fungsi bucket_dpd terlalu kompleks untuk dites", why: "Salah: fungsi 5 baris ini justru contoh IDEAL untuk dites — murni, deterministik, dipakai banyak tempat." },
          ],
        },
        {
          q: "Pola parametrize (satu test, banyak kasus) unggul dari 20 fungsi test copy-paste karena…",
          options: [
            { text: "Cakupan sama (20 skenario) dengan usaha jauh lebih kecil — tambah kasus = tambah satu baris tuple, bukan satu fungsi; dan tidak ada salinan yang lupa diperbarui", why: "Benar: ekonomi Langkah 4 — cakupan ×, usaha +. Copy-paste test = copy-paste query: satu diperbarui, 19 lupa.", correct: true },
            { text: "Parametrize berjalan lebih cepat secara komputasi", why: "Salah: kecepatan eksekusi bukan poinnya — poinnya ekonomi penulisan dan pemeliharaan." },
            { text: "pytest mewajibkan parametrize untuk semua test", why: "Salah: tidak wajib — ini pola untuk kasus banyak, bukan aturan." },
            { text: "Fungsi test copy-paste tidak bisa dijalankan pytest", why: "Salah: bisa dijalankan — masalahnya pemeliharaan, bukan eksekusi." },
          ],
        },
        {
          q: "Perbedaan fixture pytest dengan variabel global untuk data uji?",
          options: [
            { text: "Fixture dibuat ulang (fresh) untuk tiap test — test tidak bisa saling mengotori; variabel global bisa diubah test A dan merusak test B", why: "Benar: miskonsepsi Langkah 4 — pabrik per pesanan vs gudang bersama.", correct: true },
            { text: "Tidak ada beda — keduanya menyimpan data bersama", why: "Salah: beda pada lifecycle — fresh per test vs persisten. Beda ini menentukan flakiness." },
            { text: "Fixture lebih lambat sehingga sebaiknya dihindari", why: "Salah: overhead pembuatan ulang minimal untuk data uji kecil; keandalan jauh lebih berharga." },
            { text: "Variabel global lebih aman karena terlihat di semua test", why: "Salah: “terlihat di semua” = “bisa dirusak dari semua” — kebalikannya dari aman." },
          ],
        },
        {
          q: "Fungsi hitung_bunga dipakai 1 tempat, notebook eksplorasi sekali pakai. Keputusan testing tepat?",
          options: [
            { text: "Ekstrak fungsi ke .py bila akan dipakai ulang; untuk sekali pakai, test minimal 2–3 assert kasus utama + batas — bukan nol test", why: "Benar: skenario 5 peta keputusan — tidak ada deadline yang menghalalkan nol test untuk angka yang dipakai orang; tetapi jangan over-test eksplorasi.", correct: true },
            { text: "Tidak perlu test sama sekali — kan sekali pakai", why: "Salah: “sekali pakai” sering menjadi “dipakai selamanya” — dan 3 assert hanya butuh 3 menit." },
            { text: "Tulis 50 test komprehensif agar aman", why: "Salah: over-testing eksplorasi = mengkristalkan tebakan prematur + membuang waktu. Proporsional." },
            { text: "Test notebook utuh 500 sel sebagai pengganti", why: "Salah: notebook rapuh untuk dites — ekstrak logika ke fungsi dulu (miskonsepsi Langkah 5)." },
          ],
        },
        {
          q: "Bug ditemukan di produksi. Urutan respons yang benar menurut disiplin test?",
          options: [
            { text: "Tulis test regresi yang MEREPRODUKSI bug dulu (harus merah), perbaiki kode (jadi hijau), pastikan test lain tetap hijau", why: "Benar: test regresi mengunci bug selamanya — “tidak akan terulang” menjadi janji tertulis, bukan harapan.", correct: true },
            { text: "Perbaiki kode secepatnya; test menyusul kalau sempat", why: "Salah: “kalau sempat” = tidak pernah — dan tanpa test regresi, bug bisa kembali diam-diam." },
            { text: "Sembunyikan bug dari laporan agar tidak panik", why: "Salah: ini pelanggaran integritas — analis tidak menyembunyikan bug, ia menguncinya dengan test." },
            { text: "Tulis test yang langsung hijau tanpa mereproduksi bug", why: "Salah: test yang tidak pernah merah tidak membuktikan apa-apa — ia teater, bukan pengaman." },
          ],
        },
      ],
    },
  ],
};
