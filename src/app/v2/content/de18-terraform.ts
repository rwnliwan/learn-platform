import type { V2Lesson } from "../lib/types";

// ── Figure: waktu deploy manual vs IaC + insiden drift ─────────────────────
const IAC_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Diagram batang waktu deploy dan insiden: manual vs Terraform">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="52" y1="206" x2="528" y2="206"/>
<line x1="52" y1="166" x2="528" y2="166"/><line x1="52" y1="126" x2="528" y2="126"/>
<line x1="52" y1="86" x2="528" y2="86"/><line x1="52" y1="46" x2="528" y2="46"/>
</g>
<g>
<rect x="110" y="66" width="60" height="140" fill="var(--chart-text)" opacity="0.5"/>
<text x="140" y="58" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">6 jam</text>
<text x="140" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Manual (klik)</text>
<rect x="250" y="186" width="60" height="20" fill="var(--c1)" opacity="0.9"/>
<text x="280" y="178" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">12 mnt</text>
<text x="280" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Terraform apply</text>
<rect x="390" y="106" width="60" height="100" fill="var(--chart-text)" opacity="0.5"/>
<text x="420" y="98" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">9/thn</text>
<text x="420" y="224" text-anchor="middle" font-size="11" fill="var(--text)">Insiden drift manual</text>
<rect x="470" y="196" width="30" height="10" fill="var(--c1)" opacity="0.9"/>
<text x="485" y="188" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">0</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="52" y="30">waktu deploy &amp; insiden per tahun (ilustrasi)</text>
</g>
</svg>`;

export const de18: V2Lesson = {
  slug: "de18-terraform",
  track: "Data Engineer",
  module: "Software Engineering untuk Data",
  title: "Terraform & IaC untuk Platform Data",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Environment staging yang tidak bisa direproduksi",
      prose: [
        "Tim data sebuah e-commerce butuh environment staging baru untuk menguji pipeline sebelum migrasi warehouse. Seorang engineer senior — yang membangun staging lama setahun lalu — mulai mengklik console cloud: membuat bucket, VPC, cluster Spark, antrean Kafka, role IAM... enam jam kemudian staging “jadi”. Dua minggu kemudian staging lama dihapus untuk hemat biaya, dan tim butuh membangunnya lagi untuk audit. Masalahnya: tidak ada yang mencatat persis apa yang diklik setahun lalu. Versi Spark-nya berapa? Berapa worker node? Aturan firewall-nya apa? Twist-nya: staging kedua yang dibangun “dari ingatan” berperilaku beda — pipeline yang lolos di staging gagal di produksi, dan butuh tiga minggu debugging untuk menemukan bahwa perbedaan satu flag kompresi Kafka adalah penyebabnya. Infrastruktur yang dibangun dengan klik tidak punya memori — dan ingatan manusia adalah dokumentasi terburuk.",
        "Solusinya adalah Infrastructure as Code (IaC): infrastruktur didefinisikan sebagai file teks berversi — bisa di-review, di-test, dan di-apply ulang menghasilkan hasil yang identik. Terraform adalah tool IaC paling populer untuk ini: satu bahasa (HCL) untuk mendefinisikan bucket, cluster, antrean, role, dan jadwal di hampir semua cloud. Catatan sudut pandang: lesson ini membahas IaC untuk PLATFORM DATA — warehouse, lake, orkestrasi, streaming. Lesson MLOps membahas IaC untuk infrastruktur ML (training cluster, model registry, serving) — sudutnya beda, prinsipnya sama.",
        "Di lesson ini kamu belajar alur kerja Terraform (write → plan → apply), konsep state, dan cara memodelkan komponen platform data — plus jebakan drift yang membuat “sudah pakai Terraform” tetap bisa kacau.",
      ],
      tasks: [],
      note: {
        title: "Kenapa data engineer wajib bisa IaC",
        type: "risk",
        body: "Platform data modern = puluhan komponen cloud yang saling terkait. Membangunnya manual berarti setiap environment (dev, staging, prod) adalah snowflake — dan bug “cuma terjadi di prod” biasanya perbedaan infrastruktur yang tidak tercatat. IaC mengubah infrastruktur menjadi kode yang bisa di-test seperti kode pipeline.",
      },
      reference: "IaC = infrastruktur sebagai file berversi. Sudut lesson ini: platform data (warehouse/lake/streaming/orchestration).",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan alur write → plan → apply dan kenapa plan harus selalu dibaca sebelum apply; (2) menjelaskan apa itu Terraform state dan kenapa state harus disimpan remote + terkunci; (3) memodelkan komponen platform data (bucket, warehouse, antrean, role) sebagai resource dan module; (4) mendeteksi dan menangani configuration drift.",
        "Rutenya: cerita → bekal ringkas → dua konsep inti (alur Terraform; state & modularisasi) → lab Python (simulator plan/apply + deteksi drift) → chart manual vs IaC → peta keputusan → mini-case migrasi cloud → kuis → rangkuman. Estimasi 55 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Dari cloud & DataOps: platform data berjalan di cloud sebagai kumpulan layanan terkelola (object storage, warehouse, antrean pesan, orkestrator) — tiap layanan punya puluhan parameter konfigurasi, dan konsistensi antar environment adalah prasyarat pipeline yang andal. Dari CI/CD untuk data: kode pipeline sudah melewati review dan automated test sebelum deploy — lesson ini menerapkan disiplin yang sama ke infrastrukturnya: tidak ada perubahan infra yang lolos tanpa review plan.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap file Terraform sebagai “resep masakan” infrastruktur — siapa pun yang mengikuti resep yang sama mendapat hidangan yang sama. Klik manual di console = memasak tanpa resep, mengandalkan ingatan koki.",
      ],
      reference: "Bekal: (1) platform data = banyak layanan cloud berparameter; (2) disiplin CI/CD berlaku juga untuk infrastruktur.",
    },
    {
      id: "konsep-alur",
      eyebrow: "Langkah 3 · Konsep",
      title: "Write → Plan → Apply — Si Trio Disiplin",
      prose: [
        "Definisi: alur kerja Terraform terdiri dari tiga langkah. Write: tulis definisi infrastruktur dalam HCL (HashiCorp Configuration Language) — resource apa yang diinginkan (desired state). Plan: Terraform membandingkan desired state dengan state terakhir + kondisi aktual cloud, lalu menampilkan RENCANA perubahan (tambah/ubah/hapus apa). Apply: eksekusi rencana setelah disetujui. Prinsipnya deklaratif: kamu menyatakan “saya mau bucket X dengan enkripsi Y”, bukan langkah-langkah membuatnya.",
        "Kepribadiannya: trio ini seperti pengajuan anggaran perusahaan. Write = proposal (“saya butuh ini”). Plan = rapat anggaran yang menampilkan dampaknya (“ini akan menambah 3 resource, mengubah 1, menghapus 0 — biayanya segini”). Apply = tanda tangan direktur. Orang yang meng-apply tanpa membaca plan sama dengan direktur yang tanda tangan tanpa membaca rapat anggaran — cepat, dan berbahaya. Plan adalah momen kebenaran: di sinilah kamu menangkap “kok mau menghapus database produksi?” SEBELUM terjadi.",
        "Kapan memakai: setiap perubahan infrastruktur — dari menambah bucket sampai mengubah ukuran cluster. Pengecualian darurat (insiden produksi) boleh lewat klik manual, TETAPI wajib diimpor kembali ke kode (terraform import) maksimal 1×24 jam — atau drift dimulai.",
      ],
      formula: String.raw`\text{waktu reproduksi} = \frac{\text{waktu klik manual}}{\text{reproducibility}} \to \infty`,
      formulaNote: "Sindiran matematis yang serius: waktu membangun ulang environment dari klik manual dibagi reproducibilitas (yang mendekati nol karena mengandalkan ingatan) menghasilkan waktu tak terhingga — praktisnya “tidak bisa direproduksi”. Dengan IaC, reproducibilitas = 1 (kode yang sama → hasil sama), sehingga waktu reproduksi = waktu apply: 12 menit, bukan 6 jam + 3 minggu debugging.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Sudah pakai Terraform, berarti infrastruktur aman”",
        type: "pitfall",
        body: "Yang benar: Terraform hanya seaman disiplin pemakainya. Klik manual di console setelah apply (drift), state yang disimpan lokal di laptop, dan apply tanpa baca plan adalah tiga cara klasik membuat Terraform tidak berguna. Tool tidak menggantikan disiplin — ia memperkuat disiplin yang ada.",
      },
      hints: [
        "💡 Intuisi: baca plan seperti membaca diff pull request — baris per baris, terutama yang bertanda “destroy” (hapus). Aturan tim yang baik: plan yang mengandung destroy butuh dua pasang mata.",
      ],
      reference: "Deklaratif: nyatakan desired state. Plan = momen kebenaran. Apply tanpa baca plan = tanda tangan tanpa baca.",
    },
    {
      id: "konsep-state",
      eyebrow: "Langkah 4 · Konsep",
      title: "State & Module — Si Buku Kas dan Si Cetakan Kue",
      prose: [
        "Definisi: state adalah file (terraform.tfstate) tempat Terraform mencatat resource apa yang sudah dibuat dan bagaimana kondisinya — peta antara kode dan dunia nyata. Karena state adalah sumber kebenaran, ia WAJIB disimpan remote (S3/GCS dengan versioning + enkripsi) dan dikunci saat apply (state locking via DynamoDB/GCS) agar dua engineer tidak apply bersamaan. Module adalah paket resource yang bisa dipakai ulang — mis. module `data-lake` berisi bucket + enkripsi + lifecycle + logging, dipakai untuk dev, staging, dan prod dengan parameter berbeda.",
        "Kepribadiannya: state seperti buku kas bendahara — kalau bukunya hilang atau dua orang mencatat bersamaan tanpa koordinasi, kasnya kacau walau uangnya ada. Menyimpan state di laptop = bendahara membawa buku kas di tas jinjing. Module seperti cetakan kue: satu cetakan (module) menghasilkan kue (environment) yang bentuknya konsisten — beda topping (parameter: nama, ukuran, region). Tanpa module, tiap environment ditulis ulang manual = resep yang perlahan menyimpang.",
        "Kapan memakai module: setiap pola infrastruktur yang muncul > 1 kali — bucket lake per environment, role IAM per tim, cluster Spark per workload. Kapan TIDAK: untuk resource yang benar-benar unik sekali pakai — over-modularisasi membuat kode sulit dibaca. Aturan: module untuk pola, resource langsung untuk yang unik.",
      ],
      formula: String.raw`\text{drift} = \text{aktual}_{\text{cloud}} - \text{desired}_{\text{kode}}`,
      formulaNote: "Configuration drift = selisih antara kondisi aktual di cloud dan desired state di kode — biasanya akibat klik manual darurat yang tidak diimpor kembali. `terraform plan` mendeteksi drift dengan menampilkannya sebagai perubahan tak direncanakan. Interpretasi: drift > 0 berarti kode berbohong tentang kenyataan; apply berikutnya bisa menimpa perbaikan darurat (atau menghapus resource penting) tanpa disadari.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “State cuma file cache, boleh dihapus dan dibuat ulang”",
        type: "pitfall",
        body: "Yang benar: menghapus state TIDAK menghapus resource di cloud — ia menghapus INGATAN Terraform tentang resource itu. Akibatnya: apply berikutnya akan mencoba MEMBUAT ULANG semuanya (duplikat!), atau lebih buruk, menganggap resource produksi sebagai “baru” dan menimpanya. State yang hilang = operasi transplantasi ingatan, bukan refresh cache.",
      },
      hints: [
        "💡 Intuisi: perlakukan state seperti database produksi — backup berversi, akses terbatas, tidak pernah diedit manual. Kalau terpaksa intervensi, pakai perintah resmi (import, state mv), bukan edit file.",
      ],
      reference: "State remote + terkunci + berversi. Module = cetakan untuk pola berulang. Drift = kode berbohong tentang kenyataan.",
    },
    {
      id: "lab-drift",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Simulator plan & deteksi drift",
      prose: [
        "Terraform tidak terinstal di lab ini — jadi kita simulasikan otaknya dalam Python. Di bawah ada desired state (kode), state terakhir, dan kondisi aktual cloud (sintetis). Tugasmu: tulis fungsi `plan()` yang membandingkan ketiganya dan mengklasifikasikan tiap resource: CREATE (di kode, belum di state), UPDATE (beda config), DELETE (di state, tidak di kode), DRIFT (aktual beda dari state = klik manual!), OK.",
        "Coba: setelah lolos, ubah satu resource aktual seolah “di-klik manual” (mis. ubah ukuran cluster di `aktual`) dan lihat klasifikasinya berubah menjadi DRIFT. Itulah yang dilihat engineer saat menjalankan `terraform plan` setelah insiden.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `plan()`: kembalikan dict {nama: status} untuk tiap resource di kode/state" },
        { id: "t2", text: "Hitung `jumlah_drift` = resource berstatus DRIFT" },
        { id: "t3", text: "Hitung `berbahaya` = True bila ada status DELETE (penghapusan butuh review ekstra)" },
        { id: "t4", text: "Kumpulkan `aksi` = daftar [nama, status] yang statusnya bukan OK (terurut)" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "drift terdeteksi: 1 resource\nada penghapusan: True\naksi non-OK: [['kafka_q', 'DELETE'], ['spark_c', 'DRIFT']]",
      code: {
        starter: `# Desired state (kode HCL disederhanakan) vs state vs aktual (SINTETIS)
kode = {
    "lake_bucket": {"size": "1TB", "enc": True},
    "spark_c": {"worker": 4, "ver": "3.5"},
    "wh_prod": {"size": "XL", "enc": True},
}
state = {
    "lake_bucket": {"size": "1TB", "enc": True},
    "spark_c": {"worker": 4, "ver": "3.5"},
    "wh_prod": {"size": "XL", "enc": True},
    "kafka_q": {"part": 6},
}
aktual = {
    "lake_bucket": {"size": "1TB", "enc": True},
    "spark_c": {"worker": 8, "ver": "3.5"},  # seseorang menaikkan worker via console!
    "wh_prod": {"size": "XL", "enc": True},
    "kafka_q": {"part": 6},
}

# TULIS KODEMU DI BAWAH INI
def plan():
    return

rencana = {}  # TODO: rencana = plan()

jumlah_drift = 0  # TODO: hitung status DRIFT

berbahaya = False  # TODO: True bila ada DELETE

aksi = []  # TODO: [[nama, st] for nama, st in rencana.items() if st != "OK"], terurut

print(f"drift terdeteksi: {jumlah_drift} resource")
print(f"ada penghapusan: {berbahaya}")
print(f"aksi non-OK: {aksi}")`,
        lockLines: 21,
        solution: `# Desired state (kode HCL disederhanakan) vs state vs aktual (SINTETIS)
kode = {
    "lake_bucket": {"size": "1TB", "enc": True},
    "spark_c": {"worker": 4, "ver": "3.5"},
    "wh_prod": {"size": "XL", "enc": True},
}
state = {
    "lake_bucket": {"size": "1TB", "enc": True},
    "spark_c": {"worker": 4, "ver": "3.5"},
    "wh_prod": {"size": "XL", "enc": True},
    "kafka_q": {"part": 6},
}
aktual = {
    "lake_bucket": {"size": "1TB", "enc": True},
    "spark_c": {"worker": 8, "ver": "3.5"},  # seseorang menaikkan worker via console!
    "wh_prod": {"size": "XL", "enc": True},
    "kafka_q": {"part": 6},
}

# TULIS KODEMU DI BAWAH INI
def plan():
    hasil = {}
    for nama in set(kode) | set(state):
        if nama not in state:
            hasil[nama] = "CREATE"
        elif nama not in kode:
            hasil[nama] = "DELETE"
        elif aktual.get(nama) != state.get(nama):
            hasil[nama] = "DRIFT"
        elif kode[nama] != state[nama]:
            hasil[nama] = "UPDATE"
        else:
            hasil[nama] = "OK"
    return hasil

rencana = plan()

jumlah_drift = sum(1 for st in rencana.values() if st == "DRIFT")

berbahaya = any(st == "DELETE" for st in rencana.values())

aksi = sorted([nama, st] for nama, st in rencana.items() if st != "OK")

print(f"drift terdeteksi: {jumlah_drift} resource")
print(f"ada penghapusan: {berbahaya}")
print(f"aksi non-OK: {aksi}")`,
        checks: [
          { kind: "equal", task: "t2", name: "jumlah_drift", value: 1, tol: 0, label: "`jumlah_drift` harus 1", msg: "spark_c: aktual (worker 8) beda dari state (worker 4) = klik manual." },
          { kind: "equal", task: "t3", name: "berbahaya", value: true, tol: 0, label: "`berbahaya` harus True", msg: "kafka_q ada di state tetapi tidak di kode = DELETE, butuh review ekstra." },
          { kind: "contains", task: "t4", name: "aksi", value: ["spark_c", "DRIFT"], label: "`aksi` memuat spark_c DRIFT", msg: "spark_c harus terklasifikasi DRIFT." },
          { kind: "stdout_matches", task: "t5", pattern: "drift terdeteksi: 1 resource", label: "Ringkasan drift tercetak", msg: "Baris pertama: 'drift terdeteksi: 1 resource'." },
          { kind: "stdout_matches", task: "t5", pattern: "ada penghapusan: True", label: "Peringatan penghapusan tercetak", msg: "Baris kedua: 'ada penghapusan: True'." },
        ],
      },
      reference: "Plan = bandingkan kode vs state vs aktual. DRIFT = klik manual. DELETE = bendera merah.",
    },
    {
      id: "chart-iac",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca chart manual vs IaC",
      prose: [
        "Chart di bawah membandingkan dua pendekatan membangun environment: klik manual vs Terraform apply (ilustrasi dari cerita pembuka).",
        "Cara membaca: dua batang pertama = waktu membangun satu environment (6 jam manual vs 12 menit apply). Dua batang berikutnya = insiden terkait perbedaan environment per tahun (9 insiden drift manual vs 0 dengan IaC yang disiplin).",
        "Interpretasi: keunggulan IaC bukan cuma kecepatan (30× lebih cepat) — melainkan eliminasi kelas masalah: insiden “beda di prod” hampir hilang karena semua environment lahir dari kode yang sama. Tetapi perhatikan: batang “0 insiden” bersyarat — ia hanya berlaku bila disiplinnya dijaga (tidak ada klik manual liar, state remote terkunci). Pelajaran chart ini: Terraform membeli konsistensi; disiplin membayar cicilannya.",
      ],
      figure: {
        svg: IAC_SVG,
        alt: "Diagram batang: bangun environment 6 jam manual vs 12 menit Terraform; insiden drift 9 per tahun vs 0.",
        caption: "Manual vs IaC: waktu deploy dan insiden drift per tahun (ilustrasi).",
      },
      tasks: [],
      reference: "IaC = kecepatan + konsistensi. Konsistensi hanya bertahan selama disiplin drift dijaga.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Perubahan infrastruktur datang — lewat jalur apa?",
      prose: [
        "Empat skenario keputusan IaC:",
        "Skenario 1 — Butuh bucket baru untuk landing zone. → Tulis resource di kode, buka pull request, baca plan di CI, apply setelah approve. Alasan: jalur normal — semua perubahan infra melewati review seperti kode pipeline.",
        "Skenario 2 — Produksi down, perlu menaikkan worker Spark SEKARANG via console. → Lakukan (nyawa produksi lebih penting), lalu dalam 1×24 jam: terraform import + sesuaikan kode + apply. Alasan: darurat membolehkan jalan pintas, tetapi jalan pintas yang tidak ditutup menjadi drift permanen.",
        "Skenario 3 — Plan menunjukkan “delete database produksi”. → STOP. Jangan apply. Investigasi: apakah resource terhapus dari kode tanpa sengaja? Apakah state rusak? Alasan: kata “destroy” pada resource stateful = potensi kehilangan data; tidak ada urgensi yang membenarkan apply buta.",
        "Skenario 4 — Tim baru butuh environment dev yang mirip staging. → Bungkus pola existing jadi module, panggil dengan parameter berbeda. Alasan: copy-paste file Terraform antar environment adalah drift yang direncanakan — module menjaga satu sumber kebenaran.",
        "Aturan praktis 10 detik: perubahan infra? → (1) tulis di kode; (2) baca plan — ada destroy? → minta review kedua; (3) apply; (4) darurat via console? → import kembali 1×24 jam.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menyimpan state di laptop “sementara” yang menjadi permanen. State lokal = tidak ada locking (tabrakan apply), tidak ada backup (hilang = transplantasi ingatan), tidak ada audit. Remote state adalah hari pertama, bukan “nanti”.",
      },
      reference: "Jalur normal: kode → PR → plan → apply. Darurat: console → import 1×24 jam. Destroy: selalu dua pasang mata.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Migrasi cloud: 47 komponen, 3 environment, 6 minggu",
      prose: [
        "Skenario (sintetis, untuk latihan): perusahaan memindahkan platform data (47 komponen: bucket, warehouse, antrean Kafka, cluster Spark, role IAM, scheduler) dari cloud A ke cloud B dalam 6 minggu, dengan 3 environment (dev, staging, prod). Tim terbagi: separuh mengusulkan “klik cepat di console, nanti didokumentasikan”, separuh mengusulkan Terraform module dari awal.",
        "Pertanyaan analisis: (1) Apa risiko pendekatan “klik dulu, dokumentasi nanti”? (2) Bagaimana struktur module yang masuk akal untuk 47 komponen? (3) Bagaimana memastikan prod = staging secara infrastruktur?",
        "Pembahasan: (1) Risikonya: dokumentasi “nanti” tidak pernah datang; 47 komponen × 3 environment = 141 konfigurasi yang hanya ada di ingatan; perbedaan kecil (satu flag kompresi) menjadi bug prod 3 minggu kemudian — persis cerita pembuka. (2) Struktur module: satu module per POLA (mis. `data-lake-bucket`, `spark-cluster`, `kafka-topic`, `iam-role`), bukan per environment; tiap environment = satu pemanggilan module dengan parameter (nama, ukuran, region). 47 komponen menjadi ~8 module yang dipakai ulang. (3) Jaminan kesetaraan: staging dan prod memanggil module yang SAMA dengan parameter berbeda (ukuran), plan di-CI untuk tiap environment, dan uji drift terjadwal (terraform plan berkala) yang memberi alert bila ada klik liar.",
        "Catatan biaya: menulis module di awal terasa lambat di minggu 1–2 — tetapi minggu 5–6 (saat environment ketiga dibangun) menjadi nyaris gratis. IaC adalah investasi yang BEP-nya di environment kedua.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Migrasi manual 141 konfigurasi tanpa kode adalah risiko operasional yang tidak terukur — tidak ada cara membuktikan ke auditor bahwa prod dibangun dengan benar. Dengan IaC, buktinya adalah repositori Git + riwayat plan/apply. Kepatuhan butuh artefak, bukan ingatan.",
      },
      reference: "Module per pola, bukan per environment. BEP IaC = environment kedua.",
    },
    {
      id: "pendalaman-state-produksi",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "State di produksi: locking, versioning modul, dan rahasia",
      prose: [
        "Remote backend yang benar — bukan 'nanti'. State WAJIB di remote sejak hari pertama: S3 dengan versioning + enkripsi + DynamoDB untuk locking, atau GCS (locking native), atau Terraform Cloud. Versioning bucket = riwayat state: salah apply bisa di-rollback ke versi state sebelumnya — tanpa versioning, tidak ada 'undo'. Enkripsi at rest bukan opsional: state MENYIMPAN nilai secret (password database, access key) dalam plaintext JSON! Migrasi state lokal→remote di tengah jalan adalah operasi berisiko (state mv antar backend sambil tim tetap apply) — alasan senior bersikeras backend dikonfigurasi sebelum resource pertama dibuat.",
        "Locking dan serialisasi apply. Lock memastikan hanya SATU apply berjalan pada satu state dalam satu waktu — tanpa lock, dua engineer apply bersamaan = tulis state balapan = state corrupt yang butuh operasi bedah. Praktik senior: CI/CD adalah SATU-SATUNYA applier — manusia tidak menjalankan terraform apply dari laptop (laptop = state lokal 'sementara', clock skew, dependensi tak terkontrol). Apply di-CI antre serial; plan artifact (file hasil terraform plan -out) di-pass antar job sehingga yang di-apply PERSIS yang di-review — bukan re-plan yang kondisinya mungkin sudah berubah.",
        "Disiplin plan artifact. terraform plan -out=plan.tfplan menyimpan rencana biner; terraform apply plan.tfplan mengeksekusi file itu — tanpa menghitung ulang. Kenapa ini penting: antara plan dan apply, dunia bisa berubah (seseorang mengubah console, auto-scaling menambah node) — re-plan diam-diam saat apply berarti keputusan dibuat dari informasi basi. Aturan kedaluwarsa: plan lebih tua dari 24 jam ATAU ada commit baru setelah plan → re-plan wajib. Stale plan = tanda tangan di atas rapat anggaran minggu lalu.",
        "Module versioning — reproducibility untuk infrastruktur. Panggil module dengan pin versi eksplisit: ?ref=v1.2.0 atau versi registry — JANGAN mengikuti branch main. Tanpa pin, apply hari ini dan apply besok memakai kode module BERBEDA = environment tidak reproducible = seluruh janji IaC batal. Praktik tim: semantic versioning untuk module internal + changelog; bump versi module di environment dev dulu, uji seminggu, baru naik ke staging lalu prod (canary bertingkat). Module yang di-pin tetapi tidak pernah di-update juga masalah (keamanan!) — jadwalkan review bump kuartalan.",
        "Drift detection otomatis. Jangan andalkan 'rajin menjalankan plan manual' — jadwalkan: terraform plan -detailed-exitcode di CI/cron tiap jam; exit code 2 = ada perubahan tak direncanakan → alert ke Slack/channel tim. Respons senior: drift BUKAN untuk di-auto-apply (apply buta bisa menimpa perbaikan darurat yang sah!) — drift adalah SINYAL untuk investigasi: siapa mengubah, kenapa, apakah darurat sah (lalu import ke kode) atau klik liar (lalu kembalikan). Bedakan keduanya; yang pertama ditutup dengan import 1×24 jam, yang kedua dengan edukasi + guardrail.",
        "Secret management — luka paling dalam Terraform. Fakta yang harus dihafal: SEMUA nilai sensitif (password DB, token, key) tersimpan PLAINTEXT di state file. Konsekuensinya: (a) enkripsi backend + akses bucket minimal (hanya CI role + segelintir admin); (b) secret JANGAN di-hardcode di .tf/.tfvars yang ter-commit ke Git — ambil dari Vault/AWS Secrets Manager via data source saat apply; (c) tandai variable dan output sensitif dengan sensitive = true agar tidak bocor ke log CI; (d) JANGAN output secret (output hanya untuk debugging — dan debugging tidak butuh password). Ingat: terraform show dan akses baca state = akses baca semua secret — perlakukan izin baca state seperti izin baca brankas.",
        "State corrupt — skenario nyata dan bedahnya. (a) Resource dihapus manual di console → state 'yatim' (mencatat yang tak ada): terraform state rm untuk melepas catatan, lalu terraform import untuk mencatat ulang yang benar — JANGAN edit file state manual dengan text editor. (b) Lock macet karena CI crash di tengah apply: terraform force-unlock HANYA setelah memastikan tidak ada apply lain berjalan (cek runner CI, cek proses!) — force-unlock buta saat apply lain aktif = dua writer = corrupt permanen. (c) State terlanjur kacau: terraform state pull → backup file-nya → perbaiki → state push. Aturan emas bedah state: backup DULU, operasi KEMUDIAN — state adalah database produksi, dan setiap operasi bedah tanpa backup adalah judi.",
        "Struktur repo skala tim. Pola yang bertahan: satu module per pola infrastruktur, lalu direktori per environment (envs/prod, envs/staging) yang memanggil module SAMA dengan parameter berbeda — jaminan kesetaraan. CODEOWNERS: perubahan envs/prod wajib di-approve pemilik platform — bukan sekadar 'dua pasang mata' generik. Untuk refactor tanpa recreate: block moved (Terraform 1.1+) memindahkan resource antar alamat state tanpa menghapus-membuat ulang — rename module yang aman. Tanpa moved, refactor = downtime yang 'tidak direncanakan'.",
      ],
      formula: String.raw`\text{jendela drift} = t_{\text{deteksi}} - t_{\text{klik liar}}`,
      formulaNote: "t_klik liar = saat perubahan manual terjadi di console; t_deteksi = saat plan terjadwal menangkapnya. Contoh: klik liar jam 10:00, plan per jam mendeteksi jam 11:00 → jendela 1 jam (kode 'berbohong' selama itu). Perkecil jendela dengan frekuensi deteksi — bukan dengan melarang darurat (darurat tetap boleh, asal diimpor 1×24 jam).",
      tasks: [],
      note: {
        title: "Intuisi: state adalah database, bukan cache",
        body: "Heuristik yang memisahkan junior dari senior: setiap kali kamu tergoda memperlakukan state seperti file sementara, ganti kata 'state' dengan 'database produksi' di kepalamu — 'hapus database produksi dan buat ulang' terdengar gila, dan memang gila. Bau masalah yang harus membuatmu berhenti: 'coba force-unlock aja' (tanpa cek apply lain), 'state di laptop dulu sementara' (sementara yang menjadi permanen), secret tertulis di .tfvars yang ter-commit, dan module mengikuti branch main. Ritual sehatnya: backend remote + terkunci + berversi sejak hari pertama; CI satu-satunya applier; plan artifact yang di-apply persis yang di-review; drift terdeteksi otomatis tiap jam; secret dari Vault bukan dari Git. Dan aturan darurat: console boleh saat produksi down, tetapi import kembali maksimal 1×24 jam — jalan pintas yang tidak ditutup menjadi jalan utama menuju drift permanen. Tanda lain kedewasaan: berani bilang 'tidak' pada apply Jumat sore — karena rollback state di akhir pekan adalah mimpi buruk yang bisa dicegah dengan kalender. Dan ingat, state menyimpan SEMUA output termasuk yang sensitif: audit berkala 'siapa membaca state' sama pentingnya dengan 'siapa mengubah kode'.",
      },
      reference: "Backend remote hari pertama. CI = satu-satunya applier. Plan artifact anti-stale. Module di-pin. Drift dideteksi otomatis, diinvestigasi manual. Secret di state = plaintext: enkripsi + Vault + sensitive.",
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
        "IaC = infrastruktur sebagai file berversi; alur write → plan → apply; plan selalu dibaca sebelum apply (terutama yang bertanda destroy).",
        "Terraform deklaratif: nyatakan desired state, bukan langkah pembuatan; sudut lesson ini = platform data.",
        "State = ingatan Terraform: wajib remote + terkunci + berversi; menghapus state ≠ menghapus resource.",
        "Module = cetakan untuk pola berulang (per pola, bukan per environment); drift = selisih aktual vs kode, dideteksi via plan.",
        "Darurat boleh via console, tetapi wajib diimpor kembali 1×24 jam — atau drift menjadi permanen.",
      ],
      quiz: [
        {
          q: "Fungsi utama `terraform plan` dalam alur kerja?",
          options: [
            { text: "Menampilkan rencana perubahan (tambah/ubah/hapus) sebelum dieksekusi — momen menangkap kesalahan", why: "Benar: plan adalah rapat anggaran sebelum tanda tangan; di sinilah “kok mau hapus database?” tertangkap.", correct: true },
            { text: "Mempercepat apply", why: "Salah: plan justru menambah langkah — kecepatannya dikorbankan untuk keamanan. Trade-off yang disengaja." },
            { text: "Menghapus resource yang tidak terpakai", why: "Salah: itu efek apply dari rencana, bukan fungsi plan. Plan hanya menampilkan, tidak mengeksekusi." },
            { text: "Membackup state otomatis", why: "Salah: backup state adalah urusan remote backend berversi, bukan tugas plan." },
          ],
        },
        {
          q: "Engineer menghapus file terraform.tfstate yang tersimpan lokal. Apa yang terjadi?",
          options: [
            { text: "Terraform kehilangan ingatan tentang resource — apply berikutnya bisa membuat duplikat atau menimpa yang ada", why: "Benar: state = peta kode↔realita. Tanpa peta, Terraform mengira semua resource “baru”. Resource di cloud tidak ikut terhapus.", correct: true },
            { text: "Semua resource di cloud ikut terhapus", why: "Salah: menghapus state tidak menyentuh cloud sama sekali — justru itu masalahnya: realita dan catatan berpisah." },
            { text: "Tidak apa-apa, state dibuat ulang otomatis dengan benar", why: "Salah: state baru = kosong = Terraform buta. “Dibuat ulang” tidak memulihkan ingatan." },
            { text: "Hanya perlu terraform init ulang", why: "Salah: init mengunduh provider, bukan memulihkan catatan resource. Masalahnya tetap ada." },
          ],
        },
        {
          q: "Produksi down dan satu-satunya jalan adalah mengubah config via console SEKARANG. Praktik yang benar?",
          options: [
            { text: "Perbaiki via console, lalu dalam 1×24 jam: terraform import + sesuaikan kode + apply", why: "Benar: nyawa produksi didahulukan, tetapi jalan pintas wajib ditutup — kalau tidak, drift permanen dimulai hari ini.", correct: true },
            { text: "Jangan pernah sentuh console — tunggu alur kode selesai", why: "Salah: kedisiplinan buta yang membiarkan produksi down berjam-jam demi kemurnian proses adalah kegagalan prioritas." },
            { text: "Perbaiki via console dan lupakan — yang penting produksi hidup", why: "Salah: “lupakan” = drift permanen + apply berikutnya bisa menimpa perbaikan darurat tanpa sadar." },
            { text: "Minta tim lain yang melakukannya agar tidak tercatat", why: "Salah: mengaburkan akuntabilitas memperburuk keadaan — insiden butuh jejak yang jelas, bukan kambing hitam." },
          ],
        },
        {
          q: "Kapan memakai Terraform module vs resource langsung?",
          options: [
            { text: "Module untuk pola infrastruktur yang berulang; resource langsung untuk yang benar-benar unik", why: "Benar: module = cetakan kue untuk pola; over-modularisasi yang unik justru menyulitkan dibaca.", correct: true },
            { text: "Selalu module untuk semuanya", why: "Salah: module untuk satu resource unik = abstraksi tanpa guna yang menambah kompleksitas." },
            { text: "Selalu resource langsung, module terlalu rumit", why: "Salah: tanpa module, 3 environment = 3 copy-paste yang perlahan menyimpang = drift yang direncanakan." },
            { text: "Module hanya untuk production", why: "Salah: justru dev/staging/prod harus memakai module yang SAMA agar setara — beda perlakuan merusak jaminan konsistensi." },
          ],
        },
        {
          q: "`terraform plan` menampilkan DRIFT pada cluster Spark (worker 8 di aktual, 4 di kode). Interpretasi dan respons?",
          options: [
            { text: "Seseorang mengubah via console tanpa update kode — investigasi siapa/kenapa, lalu selaraskan kode atau kembalikan", why: "Benar: drift = kode berbohong tentang kenyataan. Responsnya bukan apply buta (bisa menimpa perbaikan darurat), melainkan investigasi dulu.", correct: true },
            { text: "Langsung apply untuk “memperbaiki” drift", why: "Salah: apply akan mengembalikan worker ke 4 — mungkin menimpa perbaikan darurat yang menyelamatkan produksi. Investigasi dulu." },
            { text: "Abaikan — drift kecil tidak masalah", why: "Salah: drift kecil yang diabaikan menjadi preseden; drift adalah kondisi yang menumpuk, bukan insiden tunggal." },
            { text: "Hapus resource dari kode agar plan bersih", why: "Salah: menghapus dari kode = rencana DELETE = Terraform akan menghapus cluster produksi. “Membersihkan plan” dengan cara ini adalah bunuh diri." },
          ],
        },
        {
          q: "CI crash di tengah `terraform apply` dan lock state macet. Langkah pertama yang benar?",
          options: [
            { text: "Pastikan tidak ada apply lain yang berjalan (cek runner CI), baru force-unlock", why: "Benar: force-unlock aman hanya bila tidak ada writer aktif — force-unlock buta saat apply lain berjalan = dua writer = state corrupt.", correct: true },
            { text: "Langsung force-unlock agar cepat", why: "Salah: kecepatan tanpa verifikasi adalah cara tercepat merusak state — lock ada untuk alasan.", correct: false },
            { text: "Hapus file state lalu apply ulang", why: "Salah: menghapus state = transplantasi ingatan — apply berikutnya mengira semua resource 'baru' dan membuat duplikat.", correct: false },
            { text: "Tunggu 24 jam sampai lock kedaluwarsa sendiri", why: "Salah: lock Terraform tidak kedaluwarsa otomatis — menunggu hanya memperpanjang downtime tanpa menyelesaikan apa pun.", correct: false },
          ],
        },
        {
          q: "Password database ditulis sebagai default di `variables.tf` yang ter-commit ke Git. Apa masalahnya?",
          options: [
            { text: "Secret tersimpan plaintext di state DAN terekspos di riwayat Git — bocor dua lapis", why: "Benar: state menyimpan secret plaintext, dan Git menyimpan selamanya — rotasi password tidak menghapus riwayat commit.", correct: true },
            { text: "Tidak masalah selama tidak di-output", why: "Salah: output hanya satu jalur bocor — state file dan Git adalah dua jalur lain yang tetap terbuka.", correct: false },
            { text: "Terraform mengenkripsi otomatis nilai sensitif", why: "Salah: Terraform TIDAK mengenkripsi nilai di state — enkripsi adalah tugas backend storage.", correct: false },
            { text: "Hanya masalah bila repository publik", why: "Salah: repo privat tetap dibaca banyak orang + CI + backup — 'privat' bukan kontrol akses secret.", correct: false },
          ],
        },
      ],
    },
  ],
};
