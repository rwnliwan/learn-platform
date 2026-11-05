import type { V2Lesson } from "../lib/types";

// Alur system change untuk sistem pelaporan: setiap perubahan template/format
// melewati gerbang yang sama — tanpa pengecualian, sekecil apa pun perubahannya.
const FIG_UAT = `<svg viewBox="0 0 520 250" role="img" aria-label="Alur system change: permintaan, analisis dampak, test plan, UAT, sign-off, go-live, pantau.">
<g font-family="var(--font-ui)" text-anchor="middle">
<defs><marker id="ah3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--chart-text)"/></marker></defs>
<g stroke="var(--chart-text)" stroke-width="1.5" marker-end="url(#ah3)">
<line x1="92" y1="60" x2="128" y2="60"/><line x1="212" y1="60" x2="248" y2="60"/>
<line x1="332" y1="60" x2="368" y2="60"/><line x1="452" y1="60" x2="488" y2="60"/>
<line x1="260" y1="100" x2="260" y2="140"/><line x1="140" y1="100" x2="140" y2="140"/>
</g>
<rect x="12" y="34" width="80" height="52" rx="8" fill="var(--c1)" opacity="0.9"/><text x="52" y="56" font-size="10" font-weight="700" fill="#fff">Permintaan</text><text x="52" y="72" font-size="9" fill="#fff">perubahan</text>
<rect x="132" y="34" width="80" height="52" rx="8" fill="var(--c1)" opacity="0.9"/><text x="172" y="56" font-size="10" font-weight="700" fill="#fff">Analisis</text><text x="172" y="72" font-size="9" fill="#fff">dampak</text>
<rect x="252" y="34" width="80" height="52" rx="8" fill="var(--c2)" opacity="0.9"/><text x="292" y="56" font-size="10" font-weight="700" fill="#fff">Test plan</text><text x="292" y="72" font-size="9" fill="#fff">+ test case</text>
<rect x="372" y="34" width="80" height="52" rx="8" fill="var(--c2)" opacity="0.9"/><text x="412" y="56" font-size="10" font-weight="700" fill="#fff">UAT</text><text x="412" y="72" font-size="9" fill="#fff">regresi</text>
<rect x="452" y="120" width="60" height="52" rx="8" fill="var(--c3)" opacity="0.9"/><text x="482" y="142" font-size="10" font-weight="700" fill="#fff">Sign-</text><text x="482" y="158" font-size="10" font-weight="700" fill="#fff">off</text>
<rect x="200" y="150" width="120" height="52" rx="8" fill="var(--c3)" opacity="0.9"/><text x="260" y="172" font-size="10" font-weight="700" fill="#fff">Go-live</text><text x="260" y="188" font-size="9" fill="#fff">+ rollback plan</text>
<rect x="80" y="150" width="120" height="52" rx="8" fill="var(--c4)" opacity="0.9"/><text x="140" y="172" font-size="10" font-weight="700" fill="#fff">Pantau</text><text x="140" y="188" font-size="9" fill="#fff">14 hari pertama</text>
<text x="260" y="228" font-size="12" fill="var(--chart-text)">Setiap perubahan — sekecil apa pun — melewati semua gerbang.</text>
<text x="260" y="244" font-size="11" fill="var(--text-muted)">Melewati gerbang bukan birokrasi: ia adalah bukti audit.</text>
</g>
</svg>`;

export const rr29: V2Lesson = {
  slug: "rr29-uat-system-change",
  track: "Risk Reporting",
  module: "Kendali Perubahan Sistem",
  title: "RR29 — UAT & System Change: Jangan Biarkan Template Baru Merusak Laporan",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Lesson ini tentang momen paling berbahaya dalam hidup sebuah laporan: saat ia DIUBAH. Regulator mengganti template, IT memperbaiki query, bisnis meminta kolom baru — setiap perubahan adalah peluang angka bergeser tanpa ada yang sadar. Isi lesson: (1) siklus system change untuk sistem pelaporan, (2) cara menulis test case yang benar — positif, negatif, dan edge, (3) lab: paket test case yang menangkap regresi diam-diam, (4) sign-off, go-live, dan rollback plan.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan 7 gerbang system change untuk sistem pelaporan; (2) menulis test case positif, negatif, dan edge untuk satu perubahan laporan; (3) menjalankan paket regresi dan membaca ringkasannya; (4) menyebutkan 3 isi wajib sign-off UAT; (5) menjelaskan kapan rollback harus dieksekusi, bukan didiskusikan.",
      ],
      tasks: [],
      reference: "Perubahan tanpa UAT = laporan tanpa bukti kebenaran.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "40 test case lolos, 1 divisi kacau",
      prose: [
        "Dimas, reporting analyst di sebuah bank menengah, baru saja melewati minggu terbaiknya. Regulator mengubah format laporan likuiditas — satu kolom dipecah jadi dua, satu definisi diperketat. Tim IT mengerjakan perubahan dalam tiga hari. Dimas menulis 40 test case, semuanya LOLOS. UAT ditandatangani, go-live lancar, semua orang pulang tepat waktu.",
        "Dua hari kemudian telepon dari divisi treasury berdering. “Angka LCR kami beda dengan angka kalian.” Selisihnya kecil — 0,8 poin persen — tapi cukup untuk memicu pertanyaan dari direksi. Investigasi memakan dua minggu. Akar masalahnya? Template LAMA yang masih dipakai treasury tidak masuk dalam 40 test case Dimas. Perubahan itu benar untuk template baru — dan diam-diam merusak template lama.",
        "Twist-nya: 40 test case Dimas semuanya benar. Yang salah bukan kualitas test-nya — melainkan CAKUPANNYA. Ia menguji “apakah yang baru bekerja”, tapi tidak menguji “apakah yang lama tetap bekerja”. Itulah perbedaan antara test dan UAT yang sesungguhnya: UAT yang baik tidak hanya membuktikan yang baru benar, tapi membuktikan yang lama tidak rusak.",
      ],
      tasks: [],
      reference: "UAT = buktikan yang baru benar DAN yang lama tidak rusak.",
    },
    {
      id: "siklus",
      eyebrow: "Langkah 3 · Siklus",
      title: "7 gerbang system change untuk pelaporan",
      prose: [
        "Setiap perubahan pada sistem pelaporan — template regulator baru, perbaikan query, kolom tambahan — melewati 7 gerbang yang sama. (1) Permintaan perubahan: tertulis, dengan alasan dan tanggal efektif. (2) Analisis dampak: template/laporan/proses apa saja yang tersentuh — termasuk yang TIDAK berubah tapi memakai komponen yang sama. (3) Test plan: daftar test case tertulis SEBELUM coding selesai. (4) UAT: eksekusi paket test, termasuk paket REGRESI atas template lama. (5) Sign-off: persetujuan tertulis pemilik laporan, bukan lisan di koridor. (6) Go-live dengan rollback plan: tahu persis cara kembali ke versi lama bila gagal. (7) Pantau 14 hari pertama: bandingkan angka versi lama vs baru atas data yang sama.",
        "Gerbang ke-2 (analisis dampak) adalah tempat Dimas gagal. Ia memetakan template baru dengan sempurna, tapi tidak memetakan bahwa fungsi agregasi yang diubah juga dipakai template lama treasury. Aturan praktis: untuk setiap baris kode yang berubah, tanyakan “siapa lagi yang memanggil fungsi ini?” — jawabannya adalah daftar test regresi wajibmu.",
        "Gerbang ke-5 (sign-off) adalah bukti audit. Ketika regulator atau auditor internal bertanya “kenapa angka bulan ini beda dengan bulan lalu?”, jawaban yang benar bukan “kata IT sudah dicek” — melainkan dokumen sign-off bertanggal dengan paket test yang bisa dijalankan ulang. Tanpa itu, kamu tidak punya pembelaan.",
      ],
      figure: {
        svg: FIG_UAT,
        alt: "Diagram alur 7 gerbang system change untuk sistem pelaporan.",
        caption: "Cara membaca: baca dari kiri ke kanan — tiap kotak adalah gerbang yang harus dilewati berurutan; panah bawah menuju go-live dan pantau. Interpretasi: tidak ada jalan pintas — perubahan “kecil” yang melewati gerbang pun wajib melewati semuanya, karena gerbang itulah bukti auditmu.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Perubahannya kecil, cuma satu baris query — tidak usah UAT.” Satu baris yang mengubah `>` menjadi `>=` menggeser NPL dari 19,05% ke 33,33% di lab lesson ini. Ukuran perubahan tidak berkorelasi dengan ukuran dampak. Yang menentukan perlu-tidaknya UAT bukan besarnya perubahan, melainkan kritisnya laporan yang tersentuh.",
        type: "pitfall",
      },
      reference: "Petakan dampak dulu, baru tulis test case.",
    },
    {
      id: "testcase",
      eyebrow: "Langkah 4 · Test case",
      title: "Menulis test case: positif, negatif, edge",
      prose: [
        "Test case yang baik datang dalam tiga rasa. Kasus POSITIF: input normal menghasilkan output yang benar — “pinjaman lancar 0 hari dihitung sebagai performing”. Kasus NEGATIF: input salah ditolak dengan cara yang benar — “tanggal kosong tidak boleh lolos validasi diam-diam”. Kasus EDGE (tepi): nilai batas yang paling sering mematahkan logika — “tepat 90 hari: masuk NPL atau tidak?”",
        "Kasus tepi adalah tempat bug bersembunyi. Di lab lesson ini, seluruh regresi berpusat pada satu pinjaman: L04 dengan DPD tepat 90 hari. Versi lama menghitung `dpd > 90` (bukan NPL), versi baru menghitung `dpd >= 90` (NPL). Satu karakter, satu pinjaman tepi, selisih rasio NPL 14,28 poin persen. Setiap definisi yang memakai ambang (“lebih dari”, “sampai dengan”, “minimal”) WAJIB punya test case tepat di ambangnya.",
        "Paket REGRESI adalah koleksi test case atas perilaku LAMA yang tidak boleh berubah. Aturannya: setiap kali ada perubahan, jalankan seluruh paket regresi — bukan hanya test case untuk fitur baru. Cakupan UAT diukur sederhana:",
      ],
      formula: String.raw`\text{Cakupan UAT} = \frac{\text{kasus yang dieksekusi}}{\text{kasus yang seharusnya ada}}`,
      formulaNote: "Pembilang = test case yang benar-benar dijalankan (bukan yang direncanakan). Penyebut = semua test case yang seharusnya ada: kasus baru + paket regresi lama. Dimas punya 40/40 untuk template baru — tapi 40/80 untuk keseluruhan sistem, karena 40 kasus regresi template lama tidak pernah ditulis.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Test case = contoh input-output yang hasilnya benar.” Test case tanpa EXPECTED VALUE yang ditulis sebelum eksekusi bukan test — itu demonstrasi. Test yang sesungguhnya membandingkan hasil aktual dengan nilai yang sudah dihitung manual terlebih dahulu. Kalau expected-nya ditulis setelah melihat output, kamu hanya mendokumentasikan bug, bukan menemukannya.",
        type: "pitfall",
      },
      reference: "Tiap ambang definisi wajib punya test case tepat di ambangnya.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: tangkap regresi diam-diam",
      prose: [
        "Dua versi fungsi agregasi laporan di bawah. `agregasi_v1` adalah versi produksi yang sudah di-UAT dan di-sign-off. `agregasi_v2` adalah versi kandidat dari tim IT — “cuma perbaikan kecil”. Tugasmu: tulis paket test yang membandingkan keduanya atas data kunci, hitung berapa kasus lolos dan gagal, dan cetak vonis UAT.",
        "Perhatikan pinjaman L04: DPD tepat 90 hari. Itulah kasus tepi yang menentukan segalanya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `hasil_v1` dan `hasil_v2` dengan memanggil kedua fungsi atas `pinjaman`" },
        { id: "t2", text: "Bandingkan tiap kunci (`total`, `npl`, `rasio_npl`); kumpulkan yang berbeda ke `regresi`, hitung `lolos` dan `gagal`" },
        { id: "t3", text: "Cetak ringkasan; baris vonis harus diawali `UAT: GAGAL` bila ada regresi" },
      ],
      expected: "hasil_v1 = {'total': 525, 'npl': 100, 'rasio_npl': 19.05} — lolos = 1, gagal = 2 — UAT: GAGAL (regresi pada npl, rasio_npl)",
      hints: [
        "Bandingkan kunci per kunci dengan loop atas list ['total', 'npl', 'rasio_npl'] — jangan hardcode satu per satu.",
        "vonis dicetak dengan print yang kalimatnya diawali persis 'UAT: GAGAL' agar check pola cocok.",
      ],
      code: {
        starter: `# ── DATA KUNCI (JANGAN UBAH) ─────────────────────────────
pinjaman = [
    {"id": "L01", "dpd": 0,   "plafon": 100},
    {"id": "L02", "dpd": 15,  "plafon": 50},
    {"id": "L03", "dpd": 45,  "plafon": 200},
    {"id": "L04", "dpd": 90,  "plafon": 75},   # tepi: tepat 90 hari
    {"id": "L05", "dpd": 120, "plafon": 60},
    {"id": "L06", "dpd": 200, "plafon": 40},
]

def agregasi_v1(data):
    """Versi produksi saat ini (sudah di-UAT & sign-off)."""
    total = sum(p["plafon"] for p in data)
    npl = sum(p["plafon"] for p in data if p["dpd"] > 90)   # definisi resmi: > 90 hari
    return {"total": total, "npl": npl, "rasio_npl": round(npl / total * 100, 2)}

def agregasi_v2(data):
    """Versi kandidat: 'perbaikan' kecil dari tim IT."""
    total = sum(p["plafon"] for p in data)
    npl = sum(p["plafon"] for p in data if p["dpd"] >= 90)  # <-- berubah diam-diam
    return {"total": total, "npl": npl, "rasio_npl": round(npl / total * 100, 2)}

# ── TULIS KODEMU ─────────────────────────────────────────`,
        lockLines: 23,
        solution: `# ── DATA KUNCI (JANGAN UBAH) ─────────────────────────────
pinjaman = [
    {"id": "L01", "dpd": 0,   "plafon": 100},
    {"id": "L02", "dpd": 15,  "plafon": 50},
    {"id": "L03", "dpd": 45,  "plafon": 200},
    {"id": "L04", "dpd": 90,  "plafon": 75},   # tepi: tepat 90 hari
    {"id": "L05", "dpd": 120, "plafon": 60},
    {"id": "L06", "dpd": 200, "plafon": 40},
]

def agregasi_v1(data):
    """Versi produksi saat ini (sudah di-UAT & sign-off)."""
    total = sum(p["plafon"] for p in data)
    npl = sum(p["plafon"] for p in data if p["dpd"] > 90)   # definisi resmi: > 90 hari
    return {"total": total, "npl": npl, "rasio_npl": round(npl / total * 100, 2)}

def agregasi_v2(data):
    """Versi kandidat: 'perbaikan' kecil dari tim IT."""
    total = sum(p["plafon"] for p in data)
    npl = sum(p["plafon"] for p in data if p["dpd"] >= 90)  # <-- berubah diam-diam
    return {"total": total, "npl": npl, "rasio_npl": round(npl / total * 100, 2)}

# ── TULIS KODEMU ─────────────────────────────────────────
hasil_v1 = agregasi_v1(pinjaman)
hasil_v2 = agregasi_v2(pinjaman)

kunci = ["total", "npl", "rasio_npl"]
regresi = [k for k in kunci if hasil_v1[k] != hasil_v2[k]]
lolos = len(kunci) - len(regresi)
gagal = len(regresi)

print("hasil_v1 =", hasil_v1)
print("hasil_v2 =", hasil_v2)
print("lolos =", lolos, " gagal =", gagal)
print("UAT: GAGAL — regresi pada " + ", ".join(regresi))`,
        checks: [
          { kind: "equal", task: "t1", name: "hasil_v1", value: { total: 525, npl: 100, rasio_npl: 19.05 }, label: "`hasil_v1` sesuai versi produksi", msg: "total 525; npl hanya L05+L06 = 100; rasio 19,05%." },
          { kind: "equal", task: "t2", name: "gagal", value: 2, label: "`gagal` = 2", msg: "Yang bergeser: npl dan rasio_npl. total tetap 525." },
          { kind: "stdout_matches", task: "t3", pattern: "UAT: GAGAL", label: "Vonis UAT tercetak", msg: "Baris vonis harus diawali persis 'UAT: GAGAL'." },
        ],
      },
      note: {
        title: "Sering salah",
        body: "“Regresi cuma untuk rilis besar.” Regresi justru paling berharga untuk perubahan kecil — karena perubahan kecil tidak memicu kecurigaan siapa pun. Paket regresi yang dijalankan tiap perubahan adalah jaring pengaman termurah dalam pelaporan.",
        type: "pitfall",
      },
      reference: "Satu karakter (`>`→`>=`) = selisih NPL 14,28 poin. Itulah kenapa UAT ada.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: seberapa ketat UAT-nya?",
      prose: [
        "Skenario 1 — Template regulator berubah format: UAT PENUH. Tulis test case baru untuk semua kolom yang berubah + jalankan SELURUH paket regresi. Template lama yang masih dipakai divisi lain wajib masuk paket.",
        "Skenario 2 — Perbaikan bug kecil di query: UAT TERFOKUS + regresi. Test case untuk bug yang diperbaiki (positif + edge di sekitarnya) + paket regresi atas fungsi yang disentuh. “Kecil” bukan alasan melewati gerbang.",
        "Skenario 3 — Kolom baru atas permintaan bisnis (tidak mengubah kolom lama): UAT ADITIF. Test case untuk kolom baru + regresi ringan: buktikan kolom lama tidak bergeser. Ini skenario termurah — tapi tetap butuh sign-off.",
        "Skenario 4 — Perubahan mendesak (insiden produksi): UAT DIPADATKAN, bukan dilewati. Minimal: test case untuk perbaikan + regresi atas fungsi yang diubah + sign-off tertulis darurat + rollback plan siap. Dokumentasikan apa yang DIPADATKAN — itu bahan review pasca-insiden.",
        "Aturan praktis 10 detik: sebelum go-live, jawab tiga pertanyaan — (1) test case regresi sudah dijalankan? (2) siapa yang sign-off tertulis? (3) bagaimana cara rollback dalam 1 jam? Kalau satu saja tidak terjawab, belum boleh go-live.",
      ],
      tasks: [],
      reference: "Darurat memadatkan UAT, bukan menghilangkannya.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: LCR yang berbeda 0,8 poin",
      prose: [
        "Bank Cendana mengubah template laporan likuiditas mengikuti format regulator baru. Dimas menulis 40 test case untuk template baru — semua lolos. Go-live sukses. Dua hari kemudian treasury melaporkan angka LCR mereka berbeda 0,8 poin dari angka tim Dimas. Investigasi: fungsi agregasi yang diubah juga dipakai template lama treasury, dan template lama tidak masuk paket test.",
        "Pertanyaan 1: di gerbang mana kegagalan terjadi? (Jawaban: gerbang 2 — analisis dampak. Dimas tidak memetakan semua pemakai fungsi yang diubah.)",
        "Pertanyaan 2: test case seperti apa yang akan menangkap ini sebelum go-live? (Jawaban: paket regresi — jalankan template LAMA atas data yang sama sebelum dan sesudah perubahan, bandingkan angka per baris.)",
        "Pertanyaan 3: apa isi sign-off yang seharusnya menahan go-live? (Jawaban: daftar template/laporan yang diuji — kalau template lama tidak tercantum, sign-off tidak lengkap dan go-live harus ditahan.)",
        "Pelajaran yang dibawa pulang: selisih 0,8 poin tidak membunuh siapa pun hari itu — tapi ia membunuh kepercayaan direksi pada tim pelaporan selama dua minggu investigasi. Biaya UAT regresi = beberapa jam. Biaya kepercayaan yang hilang = tidak terhitung.",
      ],
      tasks: [],
      reference: "Yang diuji menentukan apa yang dipercaya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca alasannya bahkan untuk jawaban yang kamu pilih.",
      ],
      tasks: [],
      summary: [
        "7 gerbang system change: permintaan → analisis dampak → test plan → UAT → sign-off → go-live+rollback → pantau 14 hari.",
        "Analisis dampak = petakan SEMUA pemakai komponen yang berubah, bukan hanya yang diminta berubah.",
        "Test case tiga rasa: positif (normal), negatif (input salah), edge (tepat di ambang definisi).",
        "Paket regresi = test perilaku lama; dijalankan di SETIAP perubahan, sekecil apa pun.",
        "Sign-off tertulis + rollback plan + jawaban 3 pertanyaan 10-detik adalah syarat go-live.",
      ],
      next: { label: "RR30 — Pelaporan PPATK & goAML", href: "/v2/learn/rr30-ppatk-goaml" },
      quiz: [
        {
          q: "Perubahan satu baris query (`>` menjadi `>=`) pada fungsi agregasi laporan. Sikap yang benar?",
          options: [
            { text: "Lewati UAT — perubahannya terlalu kecil untuk diuji", why: "Salah: lab lesson ini membuktikan satu karakter menggeser NPL 14,28 poin. Kecilnya perubahan tidak berkorelasi dengan kecilnya dampak.", correct: false },
            { text: "UAT terfokus: test case untuk logika yang berubah + paket regresi fungsi yang disentuh", why: "Tepat: ini skenario 2 peta keputusan — test yang berubah plus bukti yang lama tidak rusak.", correct: true },
            { text: "Cukup minta IT menandatangani bahwa sudah dicek", why: "Salah: sign-off harus dari pemilik laporan atas paket test tertulis, bukan pernyataan lisan tim IT.", correct: false },
            { text: "Tunggu sampai ada komplain baru diperbaiki", why: "Salah: itu bukan UAT, itu pemadam kebakaran. Regulator tidak menerima 'nanti diperbaiki' sebagai kendali.", correct: false },
          ],
        },
        {
          q: "Definisi resmi: NPL = DPD > 90 hari. Test case edge yang WAJIB ada adalah…",
          options: [
            { text: "Pinjaman dengan DPD tepat 90 hari", why: "Tepat: nilai tepat di ambang adalah tempat `>` vs `>=` dibedakan. Tanpa kasus ini, regresi lab tidak akan tertangkap.", correct: true },
            { text: "Pinjaman dengan DPD 0 hari", why: "Itu kasus positif biasa — penting tapi tidak menguji ambang definisi.", correct: false },
            { text: "Pinjaman dengan DPD 1000 hari", why: "Itu kasus ekstrem, bukan edge. Ia lolos di kedua versi sehingga tidak bisa membedakan keduanya.", correct: false },
            { text: "Pinjaman tanpa data DPD", why: "Itu kasus negatif (data hilang) — penting untuk validasi, bukan untuk ambang definisi.", correct: false },
          ],
        },
        {
          q: "Apa fungsi paket regresi dalam UAT sistem pelaporan?",
          options: [
            { text: "Menguji fitur baru yang baru ditambahkan", why: "Salah: itu tugas test case baru. Regresi menguji yang sebaliknya.", correct: false },
            { text: "Membuktikan perilaku lama/template lama tidak berubah akibat perubahan baru", why: "Tepat: regresi = jaring pengaman untuk semua yang seharusnya tidak tersentuh.", correct: true },
            { text: "Mempercepat go-live dengan melewati test lama", why: "Salah total: regresi justru MENAMBAH test lama ke setiap perubahan, bukan melewatinya.", correct: false },
            { text: "Menggantikan kebutuhan sign-off tertulis", why: "Salah: regresi adalah bahan sign-off, bukan penggantinya.", correct: false },
          ],
        },
        {
          q: "Sebelum go-live, tiga pertanyaan 10-detik yang harus terjawab adalah…",
          options: [
            { text: "Siapa yang coding, berapa lama, berapa biayanya", why: "Salah: itu pertanyaan manajemen proyek, bukan kesiapan go-live.", correct: false },
            { text: "Regresi sudah dijalankan, siapa sign-off tertulis, bagaimana rollback dalam 1 jam", why: "Tepat: bukti test + akuntabilitas + jalan keluar darurat.", correct: true },
            { text: "Apakah direksi sudah tahu, apakah server cukup, apakah libur", why: "Salah: tidak satu pun dari ini membuktikan kebenaran angka.", correct: false },
            { text: "Berapa test case lolos, berapa persen, berapa jam", why: "Hampir — tapi tanpa sign-off tertulis dan rollback plan, angka lolos saja tidak cukup menahan risiko.", correct: false },
          ],
        },
        {
          q: "Dalam cerita Dimas, 40 test case semuanya lolos tapi laporan tetap bermasalah. Pelajaran utamanya?",
          options: [
            { text: "Test case harus lebih banyak — 40 tidak cukup", why: "Salah: masalahnya bukan jumlah, melainkan cakupan. 400 test case untuk template baru pun tidak akan menangkap kerusakan template lama.", correct: false },
            { text: "Kualitas test tidak penting, yang penting kecepatan", why: "Salah dan berbahaya: kecepatan tanpa cakupan = go-live buta.", correct: false },
            { text: "UAT harus menguji cakupan: yang baru benar DAN yang lama tidak rusak", why: "Tepat: test tanpa regresi = setengah UAT.", correct: true },
            { text: "Jangan pernah mengubah template regulator", why: "Salah: perubahan template tidak terhindarkan — yang harus diperbaiki adalah kendalinya, bukan menghindarinya.", correct: false },
          ],
        },
      ],
    },
  ],
};
