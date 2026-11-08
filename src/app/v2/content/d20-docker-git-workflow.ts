import type { V2Lesson } from "../lib/types";

// ── Figure: waktu rebuild dengan vs tanpa layer cache ─────────────────────
const CACHE_SVG = `<svg viewBox="0 0 560 280" role="img" aria-label="Diagram batang waktu rebuild: urutan salah 320 detik, urutan benar 18 detik">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="64" y1="228" x2="536" y2="228"/>
<line x1="64" y1="178" x2="536" y2="178"/><line x1="64" y1="128" x2="536" y2="128"/>
<line x1="64" y1="78" x2="536" y2="78"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="58" y="231">0</text><text x="58" y="181">100 dtk</text>
<text x="58" y="131">200 dtk</text><text x="58" y="81">300 dtk</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="120" y="33" width="110" height="195" fill="var(--c4)" opacity="0.9"/>
<text x="175" y="25" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">320 dtk</text>
<text x="175" y="244" text-anchor="middle" fill="var(--text)">COPY . . dulu</text>
<text x="175" y="258" text-anchor="middle" fill="var(--text-muted)">install diulang tiap edit</text>
<rect x="330" y="217" width="110" height="11" fill="var(--c1)" opacity="0.9"/>
<text x="385" y="209" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">18 dtk</text>
<text x="385" y="244" text-anchor="middle" fill="var(--text)">requirements dulu</text>
<text x="385" y="258" text-anchor="middle" fill="var(--text-muted)">layer cache dipakai</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="64" y="28">waktu rebuild image setelah 1 baris kode berubah (contoh)</text>
</g>
</svg>`;

const LAB1_SETUP = `# Data: dua Dockerfile (sebagai list baris). Tugas: tulis audit_dockerfile.
CONTOH_BURUK = [
    "FROM python:latest",
    "COPY . .",
    "COPY requirements.txt .",
    "RUN pip install -r requirements.txt",
    "ADD data.csv /app/",
]
CONTOH_BAIK = [
    "FROM python:3.11-slim",
    "WORKDIR /app",
    "COPY requirements.txt .",
    "RUN pip install --no-cache-dir -r requirements.txt",
    "COPY . .",
    'CMD ["python", "skoring.py"]',
]
`;

const LAB2_SETUP = `# Mini-git: branch, commit, checkout, merge (pola 1:1 konsep Git asli)
# Git ASLI butuh terminal (git init/add/commit/branch/merge) — di sini kita
# simulasikan LOGIKANYA: pointer branch dan fast-forward.
riwayat = {"main": ["c1"]}   # branch -> list commit
HEAD = {"cabang": "main"}    # cabang aktif


def commit(pesan):
    riwayat[HEAD["cabang"]].append(pesan)


def branch(nama):
    riwayat[nama] = list(riwayat[HEAD["cabang"]])
`;

export const d20: V2Lesson = {
  slug: "d20-docker-git-workflow",
  track: "Python",
  module: "Rekayasa",
  title: "D20 — Docker & Git: Workflow Produksi Analis Python",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "“Di laptopku jalan” — tiga malam job gagal",
      prose: [
        "Dimas, analis risiko sebuah multifinance, menulis skrip skoring kredit yang sempurna di laptopnya: pandas 2.1, berjalan 40 menit, output rapi. Ia deploy ke server batch dengan satu perintah. Malam pertama: job gagal — server memakai pandas 1.5, dan baris pd.read_csv(..., dtype_backend=\"pyarrow\") tidak dikenal versi lama. Dimas menginstall pandas baru di server. Malam kedua: gagal lagi — numpy versi server bentrok dengan pandas baru. Malam ketiga: ia menyerah dan menjalankan skrip dari laptopnya yang menyala semalaman — “solusi” yang membuat tim IT ngeri.",
        "Twist-nya: Dimas SUDAH punya requirements.txt — file yang seharusnya mencegah ini. Isinya satu baris: “pandas”. Tanpa versi. Tiga bulan lalu saat ia menulis requirements itu, pip install pandas mengunduh 2.1; saat deploy, pip mengunduh 2.2 — yang menghapus argumen lama yang dipakai skripnya. File yang dimaksudkan sebagai “daftar belanja pasti” ternyata berisi “belikan buah” tanpa menyebut buah apa — dan tokonya mengganti stok setiap bulan.",
        "Masalah keduanya muncul seminggu kemudian: Dimas mengedit skrip langsung di server (“biar cepat”), lupa menyalin kembali ke laptop. Dua minggu kemudian laptop dan server punya DUA versi skrip yang berbeda, dan tidak ada yang tahu mana yang benar. Dua pelajaran satu cerita: (1) lingkungan harus DIRESEP dengan presisi (Docker + pin versi); (2) kode harus punya SATU sumber kebenaran berversi (Git). Lesson ini tentang keduanya.",
      ],
      tasks: [],
      note: {
        title: "Catatan kejujuran tentang lab lesson ini",
        type: "risk",
        body: "Docker ASLI (docker build/run) dan Git ASLI (git commit/branch/merge) berjalan di terminal — tidak tersedia di lab browser. Lab memakai simulasi Python murni dengan POLA 1:1: Lab 1 mem-parse Dockerfile baris per baris seperti docker build membaca instruksinya (aturan pin, urutan layer, CMD); Lab 2 memodelkan pointer branch dan fast-forward seperti .git di laptopmu. Di laptop: install Docker Desktop, tulis Dockerfile sungguhan, dan perintahnya (docker build -t skoring:1.0 .) mengikuti logika yang sama.",
      },
      reference: "“pandas” tanpa versi = bom waktu. Edit di server tanpa Git = dua sumber kebenaran. Solusi: Docker + pin + Git.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita tiga malam gagal. (2) Peta ini. (3) Konsep: image vs container — Si Cetakan Kue. (4) Konsep: Dockerfile baris per baris + layer caching. (5) Konsep: Git workflow — Si Mesin Waktu Berkolaborasi. (6) Lab 1: audit Dockerfile. (7) Lab 2: simulasi branch & merge. (8) Chart: 320 detik vs 18 detik rebuild. (9) Peta keputusan: kapan Docker, kapan venv, kapan Git flow. (10) Mini-case: deploy model skoring. (11) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) membaca Dockerfile baris per baris dan menemukan 5 kesalahan umum; (2) menjelaskan layer caching dan menyusun urutan instruksi yang benar; (3) memakai branch–merge–PR workflow tanpa takut menimpa kerja teman; (4) memutuskan kapan butuh Docker vs cukup venv.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: list untuk baris-baris teks; for loop + if; string methods (.strip(), .upper(), .startswith()); dict untuk pointer branch. Tidak perlu pengalaman Docker/Git.",
        "Rutenya: cerita → peta → tiga konsep inti → dua lab → chart cache → peta keputusan → mini-case → kuis. Estimasi 60 menit; dua lab ±16 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap laptopmu dan server sebagai DUA DAPUR berbeda. Tanpa resep tertulis yang presisi, koki server menebak-nebak bumbu (versi library) dan hasilnya beda. Dockerfile = resep yang presisi sampai merek bumbu dan takarannya. Git = buku catatan SEMUA versi resep yang pernah dicoba, siapa yang mengubah, dan kenapa.",
      ],
      reference: "Tujuan: baca Dockerfile + layer cache + Git branch/merge + kapan pakai apa. Pola lab 1:1 dengan tool asli.",
    },
    {
      id: "konsep-image",
      eyebrow: "Langkah 3 · Konsep",
      title: "Image vs Container — Si Cetakan Kue dan Kuenya",
      prose: [
        "Definisi: image adalah CETAKAN + resep yang read-only dan bisa dipakai ulang (Python 3.11 + pandas 2.1.4 + skripmu, dibekukan). Container adalah KUE yang dicetak dari cetakan itu — ia hidup (bisa dijalankan, bisa dihapus), tetapi cetakannya tetap utuh. Perintahnya: docker build -t skoring:1.0 . (membuat cetakan dari Dockerfile) → docker run skoring:1.0 (mencetak kue dan menjalankannya). Hapus container-nya? Cetakan tetap ada — cetak lagi kapan pun, hasilnya IDENTIK.",
        "Kepribadiannya: image adalah cetakan kue kuningan warisan nenek — tidak berubah, tidak bisa dimakan, tetapi setiap kue yang keluar bentuknya sama persis. Container adalah kue yang keluar dari cetakan — bisa dimakan (dijalankan), bisa basi (crash), bisa dibuang — tanpa merusak cetakan. Tragedi cerita pembuka: Dimas tidak punya cetakan — ia memanggang langsung di dua oven berbeda (laptop dan server) dengan “perkiraan” resep yang sama, lalu heran kenapa rasanya beda.",
        "Kapan memakai: image untuk SETIAP pekerjaan yang harus berjalan di >1 tempat (laptop → server, CI, laptop teman) atau diulang di masa depan (audit 6 bulan lagi harus bisa rerun). Tiga aturan cetakan: (1) beri TAG versi yang bermakna (skoring:1.0, bukan :latest — lihat Langkah 4); (2) image bersifat read-only — data hasil TULIS ke volume/mount, bukan ke dalam image; (3) satu image = satu tugas (skoring dan dashboard = dua image, bukan satu image berisi segalanya).",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Container = VM yang ringan”",
        type: "pitfall",
        body: "Yang benar: VM memvirtualisasi HARDWARE (tiap VM bawa OS sendiri, berat, start menitan); container berbagi KERNEL host dan hanya mengisolasi proses + filesystem (ringan, start detikan). Konsekuensinya: container Linux tidak bisa jalan native di kernel Windows tanpa VM perantara — dan image yang kamu build di laptop ARM (Mac M1) bisa gagal di server x86 kecuali di-build multi-arch. “Ringan” bukan berarti “tanpa syarat”.",
      },
      hints: [
        "💡 Intuisi tag: :latest adalah julukan “yang terbaru” — isinya BERUBAH setiap ada rilis. :1.0 atau :3.11-slim adalah NAMA TETAP — isinya sama selamanya. Audit dan reproduksibilitas butuh nama tetap, bukan julukan.",
      ],
      reference: "Image = cetakan read-only berversi; container = kue yang dijalankan. Satu image satu tugas; tag bermakna, bukan :latest.",
    },
    {
      id: "konsep-dockerfile",
      eyebrow: "Langkah 4 · Konsep",
      title: "Dockerfile Baris per Baris — dan Rahasia 320 vs 18 Detik",
      prose: [
        "Definisi: Dockerfile adalah resep tertulis — tiap baris = satu instruksi = satu LAYER image. Baca contoh kanonis: FROM python:3.11-slim (mulai dari cetakan dasar ber-tag pasti); WORKDIR /app (ruang kerja di dalam cetakan); COPY requirements.txt . (salin daftar belanja DULU); RUN pip install --no-cache-dir -r requirements.txt (belanja, tanpa menyimpan struk/cache); COPY . . (baru salin kode); CMD [\"python\", \"skoring.py\"] (perintah saat kue dicetak). Enam baris, nol tebakan — inilah resep yang mencegah tragedi Dimas.",
        "Kepribadian layer caching: Docker itu koki yang PELUPA TAPI PINTAR. Setiap layer diberi sidik jari dari isinya; saat rebuild, ia memeriksa dari atas: “layer ini sama seperti kemarin? pakai yang sudah jadi.” Begitu SATU layer berubah, semua layer DI BAWAHNYA dibangun ulang. Karena itu URUTAN adalah segalanya: requirements (jarang berubah) di-COPY dan di-install SEBELUM kode (sering berubah) → edit 1 baris kode hanya membangun ulang 2 layer terakhir (18 detik). Kebalikannya — COPY . . di atas — → setiap edit kode mengulang pip install 5 menit (320 detik). Chart Langkah 8 menunjukkan bedanya.",
        "Kapan memakai pola ini: SELALU untuk image Python — urutan “dependensi dulu, kode belakangan” adalah hukum, bukan saran. Empat larangan: (1) FROM python:latest — bom waktu versi (pelajaran cerita pembuka); pin sampai minor (3.11-slim); (2) ADD untuk file lokal — pakai COPY (ADD punya perilaku ajaib: ekstrak tar otomatis — kejutan yang tidak diinginkan); (3) lupa .dockerignore — tanpa itu, data.csv 2 GB dan folder .git ikut ter-COPY ke image; (4) menyimpan rahasia di image (API key di ENV) — image bisa dibaca siapa pun yang memegangnya; pakai secret/mount saat run.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “requirements.txt ada = reproduksibel”",
        type: "pitfall",
        body: "Yang benar: HANYA bila setiap baris ter-pin (pandas==2.1.4, bukan pandas). “pandas” tanpa versi = “belikan buah” — pip akan mengunduh versi TERBARU saat build, yang bisa berbeda dari saat kamu develop. Hasilkan pin dengan pip freeze > requirements.txt SETELAH versi teruji bekerja — dan commit file itu ke Git.",
      },
      hints: [
        "💡 Intuisi cache: susun Dockerfile dari yang PALING JARANG berubah (base image) ke yang PALING SERING berubah (kodemu). Setiap baris bertanya: “seberapa sering baris ini berubah?” — yang jarang di atas, yang sering di bawah.",
      ],
      reference: "Urutan = dependensi dulu, kode belakangan (18 vs 320 detik). Pin versi di FROM dan requirements; COPY bukan ADD; .dockerignore.",
    },
    {
      id: "konsep-git",
      eyebrow: "Langkah 5 · Konsep",
      title: "Git Workflow — Si Mesin Waktu Berkolaborasi",
      prose: [
        "Definisi: Git adalah mesin waktu untuk kode: setiap commit = foto keadaan kode + pesan + penulis + waktu. Branch = garis waktu alternatif (“coba ide tanpa merusak yang sudah jalan”). Merge = menggabungkan dua garis waktu. Alur tim standar: main = garis waktu suci (selalu bisa deploy); fitur baru di branch fitur-x; selesai → Pull Request (permintaan “tolong review sebelum gabung”); direview teman → merge ke main. Tragedi kedua Dimas (dua versi skrip) mustahil terjadi di alur ini — karena hanya ada SATU main, dan semua perubahan tercatat siapa-kapan-kenapa.",
        "Kepribadiannya: Git adalah pustakawan yang OBSESIF. Setiap buku (commit) yang masuk ia beri nomor, cap tanggal, catat siapa yang membawa, dan simpan SELAMANYA — bahkan buku yang “dibuang” (branch dihapus) masih bisa ditemukan di arsip (reflog) selama ~30 hari. Kamu bisa bertanya: “siapa yang mengubah baris ini dan kenapa?” (git blame) — dan ia menjawab dalam sedetik. Bandingkan dengan “solusi” Dimas: dua file skrip_final_v2_beneran.py tanpa catatan apa pun.",
        "Kapan memakai: SELALU untuk kode — bahkan proyek pribadi 1 orang (mesin waktu pribadimu 6 bulan lagi akan berterima kasih). Tiga aturan kolaborasi: (1) JANGAN commit langsung ke main — lewat branch + PR; (2) pesan commit menjelaskan KENAPA, bukan apa (“perbaiki batas DPD mikro 90→60 atas permintaan bisnis” bukan “update”); (3) file rahasia/data besar TIDAK masuk Git — .gitignore untuk .env dan data.csv (Git menyimpan selamanya; API key yang ter-commit = key yang harus dianggap BOCOR dan segera diganti).",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Merge conflict = Git rusak / saya merusak repo”",
        type: "pitfall",
        body: "Yang benar: conflict adalah Git BEKERJA DENGAN BENAR — ia menemukan dua orang mengubah baris yang SAMA dan menolak menebak (menebak = bug diam-diam). Conflict diselesaikan manusia dalam 5 menit: buka file, pilih versi yang benar (atau gabungkan), commit. Yang berbahaya bukan conflict — melainkan TIDAK ADA conflict padahal dua perubahan bertabrakan (itu artinya salah satunya menimpa diam-diam).",
      },
      hints: [
        "💡 Intuisi fast-forward: bila branch fitur dibuat dari main TERKINI dan main tidak berubah sejak itu, merge = tinggal majukan pointer main (fast-forward) — tanpa “commit gabungan”. Commit gabungan (merge commit) hanya muncul bila KEDUA sisi berubah — itulah jejak kolaborasinya.",
      ],
      reference: "main suci → branch → PR → review → merge. Pesan commit = KENAPA. Rahasia tidak masuk Git (bocor = ganti key).",
    },
    {
      id: "lab-1",
      eyebrow: "Langkah 6 · Lab 1",
      title: "Lab 1 — Audit Dockerfile seperti docker build",
      prose: [
        "Waktunya praktik. Dua Dockerfile contoh sudah disediakan (di Docker asli, docker build membaca instruksi yang sama baris per baris). Tugasmu: (1) lengkapi audit_dockerfile(baris) yang memeriksa 5 aturan — FROM ter-pin (ada tag dan bukan :latest), ada WORKDIR, requirements di-COPY SEBELUM kode (agar cache), ada CMD/ENTRYPOINT, tidak ada ADD untuk file lokal; kembalikan list temuan (kalimat); (2) jalankan audit untuk CONTOH_BURUK dan CONTOH_BAIK, cetak jumlah temuannya.",
        "Perhatikan: aturan “requirements sebelum kode” memakai indeks baris — inilah logika layer caching Langkah 4 yang diubah menjadi kode. CONTOH_BURUK sengaja meniru kesalahan klasik (termasuk tragedi Dimas: :latest).",
        "Coba: setelah lolos, buat CONTOH_KAMU sendiri — Dockerfile untuk skrip skoring Dimas yang BENAR (pin 3.11-slim, WORKDIR, urutan benar, CMD) — lalu audit dan pastikan 0 temuan.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `audit_dockerfile(baris)`: 5 aturan (FROM ter-pin, WORKDIR, requirements sebelum kode, CMD/ENTRYPOINT, tanpa ADD lokal); kembalikan list temuan" },
        { id: "t2", text: "Audit `CONTOH_BURUK` dan `CONTOH_BAIK`; cetak `BURUK: <n> temuan` dan `BAIK: <n> temuan`" },
      ],
      expected: "BURUK: 5 temuan\nBAIK: 0 temuan",
      code: {
        starter:
          LAB1_SETUP +
          `
def audit_dockerfile(baris):
    temuan = []
    froms = [b for b in baris if b.strip().upper().startswith("FROM")]
    if not froms:
        temuan.append("tidak ada FROM")
    else:
        bagian = froms[0].split(":")
        if len(bagian) < 2 or bagian[-1].strip().lower() == "latest":
            temuan.append("base image tidak ter-pin (pakai :latest atau tanpa tag)")
    if not any(b.strip().upper().startswith("WORKDIR") for b in baris):
        temuan.append("tidak ada WORKDIR")
    idx_req = next((i for i, b in enumerate(baris)
                    if "requirements" in b and b.strip().upper().startswith("COPY")), None)
    idx_kode = next((i for i, b in enumerate(baris)
                     if b.strip() == "COPY . ." or b.strip().upper().startswith("COPY . ")), None)
    if ...:
        temuan.append("requirements tidak di-copy terpisah")
    elif ...:
        temuan.append("COPY . . sebelum install requirements (cache rusak)")
    if not any(b.strip().upper().startswith(("CMD", "ENTRYPOINT")) for b in baris):
        temuan.append("tidak ada CMD/ENTRYPOINT")
    if any(b.strip().upper().startswith("ADD ") and "http" not in b.lower() for b in baris):
        temuan.append("pakai ADD untuk file lokal (pakai COPY)")
    return temuan


buruk = audit_dockerfile(CONTOH_BURUK)
baik = audit_dockerfile(CONTOH_BAIK)
print("BURUK:", len(buruk), "temuan")
print("BAIK:", len(baik), "temuan")`,
        lockLines: 15,
        solution:
          LAB1_SETUP +
          `
def audit_dockerfile(baris):
    temuan = []
    froms = [b for b in baris if b.strip().upper().startswith("FROM")]
    if not froms:
        temuan.append("tidak ada FROM")
    else:
        bagian = froms[0].split(":")
        if len(bagian) < 2 or bagian[-1].strip().lower() == "latest":
            temuan.append("base image tidak ter-pin (pakai :latest atau tanpa tag)")
    if not any(b.strip().upper().startswith("WORKDIR") for b in baris):
        temuan.append("tidak ada WORKDIR")
    idx_req = next((i for i, b in enumerate(baris)
                    if "requirements" in b and b.strip().upper().startswith("COPY")), None)
    idx_kode = next((i for i, b in enumerate(baris)
                     if b.strip() == "COPY . ." or b.strip().upper().startswith("COPY . ")), None)
    if idx_req is None:
        temuan.append("requirements tidak di-copy terpisah")
    elif idx_kode is not None and idx_req > idx_kode:
        temuan.append("COPY . . sebelum install requirements (cache rusak)")
    if not any(b.strip().upper().startswith(("CMD", "ENTRYPOINT")) for b in baris):
        temuan.append("tidak ada CMD/ENTRYPOINT")
    if any(b.strip().upper().startswith("ADD ") and "http" not in b.lower() for b in baris):
        temuan.append("pakai ADD untuk file lokal (pakai COPY)")
    return temuan


buruk = audit_dockerfile(CONTOH_BURUK)
baik = audit_dockerfile(CONTOH_BAIK)
print("BURUK:", len(buruk), "temuan")
print("BAIK:", len(baik), "temuan")`,
        checks: [
          { kind: "equal", task: "t2", name: "buruk", value: ["base image tidak ter-pin (pakai :latest atau tanpa tag)", "tidak ada WORKDIR", "COPY . . sebelum install requirements (cache rusak)", "tidak ada CMD/ENTRYPOINT", "pakai ADD untuk file lokal (pakai COPY)"], label: "5 temuan buruk terdeteksi", msg: "CONTOH_BURUK melanggar kelima aturan — pastikan tiap aturan diperiksa." },
          { kind: "equal", task: "t2", name: "baik", value: [], label: "0 temuan untuk contoh baik", msg: "CONTOH_BAIK harus lolos semua aturan." },
          { kind: "stdout_matches", task: "t2", pattern: "BURUK: 5 temuan", label: "cetak BURUK: 5 temuan", msg: "Cetak jumlah temuan persis seperti format yang diminta." },
          { kind: "stdout_matches", task: "t2", pattern: "BAIK: 0 temuan", label: "cetak BAIK: 0 temuan", msg: "Cetak jumlah temuan persis seperti format yang diminta." },
        ],
      },
      reference: "Audit Dockerfile = 5 aturan: pin FROM, WORKDIR, requirements sebelum kode, CMD, COPY bukan ADD.",
    },
    {
      id: "lab-2",
      eyebrow: "Langkah 7 · Lab 2",
      title: "Lab 2 — Simulasi branch & merge Git",
      prose: [
        "Lab kedua: logika Git. riwayat, HEAD, commit(), dan branch() sudah disediakan (di Git asli, ini adalah .git di laptopmu). Tugasmu: (1) lengkapi checkout(nama) — pindah HEAD ke branch yang ada (ValueError bila tidak ada); (2) lengkapi merge(nama) — gabungkan branch nama ke cabang aktif: bila semua commit cabang aktif SUDAH ADA di branch nama → fast-forward (majukan pointer, kembalikan \"fast-forward\"); bila tidak → buat commit gabungan \"MERGE\" (kembalikan \"merge-commit\"); (3) jalankan skenario: branch fitur dari main → commit c2 di fitur → checkout main → merge fitur (harusnya fast-forward); lalu branch hotfix dari main → commit c3 di hotfix → commit c4 di main → merge hotfix (harusnya merge-commit).",
        "Perhatikan: skenario ini persis alur PR tim — fitur yang tidak konflik di-merge mulus (fast-forward), hotfix yang dikembangkan paralel dengan main menghasilkan merge-commit sebagai jejak kolaborasi.",
        "Coba: setelah lolos, simulasikan CONFLICT — apa yang terjadi bila dua branch mengubah “baris yang sama”? (Jawaban: model sederhana ini tidak bisa mendeteksinya — dan itulah mengapa Git ASLI memeriksa per-BARIS, bukan per-commit. Model ini mengajarkan alurnya; Git asli menjaga detailnya.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `checkout(nama)`: pindah `HEAD[\"cabang\"]`; `raise ValueError` bila branch tidak ada" },
        { id: "t2", text: "Lengkapi `merge(nama)`: fast-forward bila semua commit aktif sudah ada di `nama`; jika tidak, append `\"MERGE\"`" },
        { id: "t3", text: "Jalankan skenario dua merge dan pastikan hasilnya `fast-forward` lalu `merge-commit`" },
      ],
      expected: "merge 1: fast-forward\nmerge 2: merge-commit\nmain: ['c1', 'c2', 'c4', 'MERGE']",
      code: {
        starter:
          LAB2_SETUP +
          `
def checkout(nama):
    if ...:
        raise ValueError("branch tidak ada")
    HEAD["cabang"] = nama


def merge(nama):
    aktif = HEAD["cabang"]
    if all(...):
        riwayat[aktif] = list(riwayat[nama])
        return "fast-forward"
    riwayat[aktif].append("MERGE")
    return "merge-commit"


branch("fitur")
checkout("fitur")
commit("c2")
checkout("main")
h1 = merge("fitur")
branch("hotfix")
checkout("hotfix")
commit("c3")
checkout("main")
commit("c4")
h2 = merge("hotfix")
print("merge 1:", h1)
print("merge 2:", h2)
print("main:", riwayat["main"])`,
        lockLines: 13,
        solution:
          LAB2_SETUP +
          `
def checkout(nama):
    if nama not in riwayat:
        raise ValueError("branch tidak ada")
    HEAD["cabang"] = nama


def merge(nama):
    aktif = HEAD["cabang"]
    if all(c in riwayat[nama] for c in riwayat[aktif]):
        riwayat[aktif] = list(riwayat[nama])
        return "fast-forward"
    riwayat[aktif].append("MERGE")
    return "merge-commit"


branch("fitur")
checkout("fitur")
commit("c2")
checkout("main")
h1 = merge("fitur")
branch("hotfix")
checkout("hotfix")
commit("c3")
checkout("main")
commit("c4")
h2 = merge("hotfix")
print("merge 1:", h1)
print("merge 2:", h2)
print("main:", riwayat["main"])`,
        checks: [
          { kind: "equal", task: "t3", name: "h1", value: "fast-forward", label: "merge 1 fast-forward", msg: "fitur dibuat dari main terkini dan main tak berubah → pointer tinggal maju." },
          { kind: "equal", task: "t3", name: "h2", value: "merge-commit", label: "merge 2 merge-commit", msg: "hotfix dan main SAMA-SAMA berubah (c3 vs c4) → butuh commit gabungan." },
          { kind: "equal", task: "t3", name: "riwayat", value: {"main": ["c1", "c2", "c4", "MERGE"], "fitur": ["c1", "c2"], "hotfix": ["c1", "c2", "c3"]}, label: "riwayat akhir benar", msg: "main = c1, c2 (fast-forward) + c4 + MERGE; fitur & hotfix tidak berubah." },
          { kind: "stdout_matches", task: "t3", pattern: "main: \\['c1', 'c2', 'c4', 'MERGE'\\]", label: "riwayat main tercetak", msg: "Cetak riwayat[\"main\"] persis setelah kedua merge." },
        ],
      },
      reference: "Git = pointer branch + commit. Fast-forward = tinggal maju; dua sisi berubah = merge-commit. Conflict = Git bekerja benar.",
    },
    {
      id: "chart-cache",
      eyebrow: "Langkah 8 · Chart",
      title: "Membaca 320 vs 18 detik: harga sebuah baris",
      prose: [
        "Chart di bawah membandingkan waktu REBUILD image setelah satu baris kode berubah (contoh) — dua urutan Dockerfile yang berbeda.",
        "Cara membaca: sumbu Y = detik (0–300+); batang kiri = Dockerfile yang COPY . . di atas (sebelum install); batang kanan = yang COPY requirements dulu.",
        "Interpretasi: 320 detik vs 18 detik — beda 17x, HANYA karena urutan dua baris. Batang kiri: setiap edit kode membatalkan cache layer install → pip mengunduh dan mengompilasi ulang semuanya (inilah “kok deploy lama banget”). Batang kanan: layer install tetap valid (sidik jarinya sama) → hanya 2 layer terakhir dibangun ulang. Kalikan dengan frekuensi deploy: tim yang deploy 5x sehari menghemat (320−18) × 5 = 25 menit TUNGGU per hari — atau 2 jam per minggu per developer. Pelajaran chart: di Docker, URUTAN adalah optimasi — dan optimasi termurah adalah yang tidak butuh kode baru, hanya baris yang dipindah.",
      ],
      figure: {
        svg: CACHE_SVG,
        alt: "Diagram batang: urutan salah 320 detik, urutan benar 18 detik untuk rebuild setelah 1 baris berubah.",
        caption: "Satu baris dipindah = 17x lebih cepat. Di Docker, urutan instruksi ADALAH optimasi.",
      },
      tasks: [],
      reference: "Susun dari jarang berubah ke sering berubah. 17x bukan dari kode baru — dari baris yang dipindah.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Kapan Docker, kapan venv, kapan Git flow — lima skenario",
      prose: [
        "Lima skenario keputusan produksi:",
        "Skenario 1 — Skrip sekali jalan di laptopmu sendiri, tidak akan diulang. → venv CUKUP. Alasan: Docker = biaya (menulis Dockerfile, build, registry) — untuk sekali jalan, biayanya tidak terbayar.",
        "Skenario 2 — Skrip harus jalan IDENTIK di laptop, server batch, dan laptop auditor 6 bulan lagi. → Docker + pin versi. Alasan: inilah kasus kanonis — reproduksibilitas lintas tempat dan lintas waktu (tragedi Dimas).",
        "Skenario 3 — Kamu dan 2 teman mengerjakan pipeline yang sama. → Git + branch + PR + review. Alasan: tanpa ini kamu mendapat “skrip_final_v2_beneran.py” × 3 orang. main terproteksi = selalu bisa deploy.",
        "Skenario 4 — Image-mu 2,1 GB dan deploy memakan 20 menit. → Kecilkan: base -slim, --no-cache-dir, .dockerignore, multi-stage bila perlu. Alasan: image gemuk = deploy lambat + permukaan serangan luas; sebagian besar gemuknya adalah cache dan file yang tidak dibutuhkan saat run.",
        "Skenario 5 — Kode butuh API key / password database. → JANGAN taruh di image atau Git; pakai secret/env saat run, dan .gitignore + .dockerignore. Alasan: image dan repo Git BISA dibaca banyak pihak dan menyimpan selamanya — key yang ter-commit = key yang bocor = harus diganti.",
        "Aturan praktis 10 detik: (1) Sekali jalan di 1 tempat → venv. (2) >1 tempat atau diulang masa depan → Docker + pin. (3) >1 orang → Git + PR. (4) Urutan Dockerfile: jarang berubah di atas. (5) Rahasia tidak pernah di image/repo.",
      ],
      tasks: [],
      reference: "venv = sekali jalan; Docker+pin = lintas tempat/waktu; Git+PR = kolaborasi. Rahasia di secret, bukan di image/repo.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Mini-case: deploy model skoring ke server batch",
      prose: [
        "Model skoring kreditmu (pandas + scikit-learn + skrip skoring.py 400 baris) harus jalan tiap malam di server batch. Dua opsi image: A = FROM python:3.11 (1,2 GB, build 9 menit); B = FROM python:3.11-slim (380 MB, build 3 menit). requirements.txt saat ini: “pandas\\nscikit-learn”. Tim 3 orang; deploy 2x seminggu; server batch juga dipakai tim lain. Malam pertama dengan opsi A: job gagal — scikit-learn versi server... eh, versi IMAGE (1.4) menghapus parameter yang dipakai skrip (ditulis saat 1.2).",
        "Pertanyaan analisis: (1) Tulis 6 baris Dockerfile kanonis untuk opsi B (urutan benar, pin versi — asumsikan versi teruji: pandas==2.1.4, scikit-learn==1.3.2). (2) Hitung penghematan waktu build per bulan opsi B vs A (deploy 2x/minggu, 4 minggu). (3) Selain ukuran, apa risiko opsi A (:3.11 tanpa -slim + tanpa pin)? (4) Seorang anggota tim mengusulkan “taruh API key database di ENV Dockerfile biar praktis” — responsmu?",
        "Pembahasan: (1) FROM python:3.11-slim / WORKDIR /app / COPY requirements.txt . / RUN pip install --no-cache-dir -r requirements.txt / COPY . . / CMD [\"python\", \"skoring.py\"] — dengan requirements ter-pin. (2) (9−3) × 2 × 4 = 48 menit/bulan — belum termasuk waktu tunggu yang memecah fokus. (3) Tanpa pin = bom waktu versi (kasus malam pertama — TERJADI walau sudah pakai Docker! Docker tanpa pin hanya mengunci OS, bukan library); image gemuk = deploy lambat + attack surface. (4) TOLAK — key di image = bocor ke semua yang bisa pull; pakai secret/env saat docker run (mis. --env-file yang tidak di-commit).",
      ],
      tasks: [],
      reference: "Docker tanpa pin = bom waktu yang lebih rapi. Kecilkan image; rahasia di secret, bukan ENV image.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah — dari layer cache hingga Git flow. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Apa beda image dan container?",
          options: [
            { text: "Image untuk Linux, container untuk Windows", why: "Salah — keduanya konsep yang sama di semua OS; bedanya BUKAN platform.", correct: false },
            { text: "Image = cetakan read-only berversi; container = hasil cetakan yang dijalankan (bisa dihapus tanpa merusak image)", why: "Benar (Langkah 3). docker build membuat cetakan; docker run mencetak kue. Hapus kue, cetakan tetap ada.", correct: true },
            { text: "Tidak ada beda — dua nama untuk hal yang sama", why: "Salah. Menyamakan keduanya = tidak paham mengapa menghapus container tidak menghilangkan image.", correct: false },
            { text: "Container lebih besar karena berisi OS lengkap", why: "Salah — itu definisi VM. Container berbagi kernel host (miskonsepsi Langkah 3).", correct: false },
          ],
        },
        {
          q: "Mengapa FROM python:latest berbahaya untuk pipeline produksi?",
          options: [
            { text: "Karena :latest selalu lebih lambat", why: "Salah — kecepatan bukan masalahnya.", correct: false },
            { text: "Karena isi :latest BERUBAH tiap rilis — build bulan depan bisa memakai versi berbeda dan merusak kode (tragedi Dimas)", why: "Benar. :latest adalah julukan, bukan nama tetap. Reproduksibilitas butuh tag pasti seperti 3.11-slim.", correct: true },
            { text: "Karena :latest tidak bisa di-push ke registry", why: "Salah secara teknis — :latest bisa di-push; masalahnya SEMANTIK (isinya berubah).", correct: false },
            { text: "Karena :latest hanya untuk development", why: "Kurang tepat — masalahnya bukan “zona”, melainkan ketidakpastian isi. Di dev pun berisiko bila butuh reproduksibilitas.", correct: false },
          ],
        },
        {
          q: "Mengapa COPY requirements.txt . harus SEBELUM COPY . . ?",
          options: [
            { text: "Karena Docker mewajibkannya — build gagal bila dibalik", why: "Salah. Docker tidak mewajibkan; build tetap sukses — hanya LAMBAT.", correct: false },
            { text: "Agar layer install ter-cache: edit kode tidak mengulang pip install (18 vs 320 detik)", why: "Benar (Langkah 4 + chart). Urutan = dari jarang berubah ke sering berubah.", correct: true },
            { text: "Karena requirements.txt harus dibaca manusia dulu", why: "Salah — alasan manusiawi, bukan alasan teknis layer caching.", correct: false },
            { text: "Tidak ada bedanya — hanya gaya penulisan", why: "Salah. Chart Langkah 8 membuktikan bedanya 17x waktu rebuild.", correct: false },
          ],
        },
        {
          q: "Kapan ADD lebih tepat daripada COPY untuk file lokal?",
          options: [
            { text: "Selalu — ADD lebih powerful", why: "Salah. “Powerful” = perilaku ajaib (ekstrak tar otomatis) yang menimbulkan kejutan.", correct: false },
            { text: "Tidak pernah untuk file lokal — pakai COPY; ADD hanya untuk URL/tar yang memang butuh diekstrak", why: "Benar (Langkah 4). Untuk file lokal, COPY eksplisit dan tidak mengejutkan.", correct: true },
            { text: "Saat file-nya besar agar lebih cepat", why: "Salah — ADD tidak lebih cepat untuk file lokal.", correct: false },
            { text: "Saat ingin file terkompresi otomatis", why: "Salah — ADD mengekstrak, bukan mengompresi; dan itu justru kejutan yang dihindari.", correct: false },
          ],
        },
        {
          q: "Branch fitur dibuat dari main terkini; main TIDAK berubah sejak itu; lalu fitur di-merge. Hasilnya?",
          options: [
            { text: "Merge conflict", why: "Salah. Conflict butuh DUA sisi berubah di baris yang sama — di sini main tidak berubah.", correct: false },
            { text: "Fast-forward — pointer main tinggal maju, tanpa commit gabungan", why: "Benar (Lab 2). Inilah merge termulus — alasan branch sebaiknya dibuat dari main terkini.", correct: true },
            { text: "Merge-commit selalu — Git tidak pernah fast-forward", why: "Salah. Fast-forward adalah perilaku default bila memungkinkan.", correct: false },
            { text: "Branch fitur dihapus otomatis tanpa jejak", why: "Salah. Merge tidak menghapus branch; dan jejak commit tetap ada selamanya.", correct: false },
          ],
        },
        {
          q: "File .env berisi API key database ikut ter-COPY ke image dan ter-commit ke Git. Respons yang tepat?",
          options: [
            { text: "Tidak masalah selama repo privat", why: "Salah dan berbahaya. Repo privat bisa bocor/di-share; image bisa di-pull; Git menyimpan SELAMANYA — key harus dianggap bocor.", correct: false },
            { text: "Anggap key BOCOR: ganti key, keluarkan dari image & repo, pakai secret/env saat run + .gitignore/.dockerignore", why: "Benar (Skenario 5). Sekali ter-commit = selamanya ada di history; satu-satunya respons aman adalah rotasi + cegah terulang.", correct: true },
            { text: "Hapus file .env dari commit terakhir saja", why: "Salah. History Git menyimpan SEMUA versi — menghapus dari commit terakhir tidak menghapus dari history.", correct: false },
            { text: "Enkripsi .env lalu commit hasil enkripsinya", why: "Kurang tepat — masih menyimpan rahasia di repo; kelola via secret manager/env saat run, bukan di repo.", correct: false },
          ],
        },
      ],
      summary: [
        "Image = cetakan read-only berversi; container = yang dijalankan; tag pasti (:3.11-slim), bukan :latest.",
        "Dockerfile: dependensi dulu, kode belakangan (layer cache: 18 vs 320 detik); pin versi; COPY bukan ADD; .dockerignore.",
        "Git: main suci → branch → PR → review → merge; fast-forward bila mulus; pesan commit = KENAPA.",
        "Keputusan: venv sekali jalan; Docker+pin lintas tempat/waktu; Git+PR untuk kolaborasi.",
        "Rahasia (API key) tidak pernah di image/repo — sekali ter-commit = bocor = ganti.",
      ],
      next: {
        label: "D21 — PySpark: Saat Pandas Menyerah",
        href: "/v2/learn/d21-pyspark",
      },
    },
  ],
};
