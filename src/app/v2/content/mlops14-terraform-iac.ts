import type { V2Lesson } from "../lib/types";

// Waktu rebuild cluster GPU: click-ops manual 40 jam vs Terraform 1,5 jam (sekali tulis, berkali-kali apply).
const FIG_REBUILD = `<svg viewBox="0 0 480 220" role="img" aria-label="Waktu rebuild cluster GPU: manual 40 jam, Terraform 1,5 jam.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="190" y1="30" x2="190" y2="180"/></g>
<g font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end">
<text x="182" y="84">Click-ops manual</text><text x="182" y="154">Terraform apply</text>
</g>
<rect x="190" y="60" width="250" height="30" rx="3" fill="var(--c4)"/>
<text x="448" y="80" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end">40 jam</text>
<rect x="190" y="130" width="10" height="30" rx="3" fill="var(--c1)"/>
<text x="212" y="150" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">1,5 jam</text>
<text x="335" y="200" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">waktu rebuild 1 cluster GPU dari nol — 27x lebih cepat</text>
</svg>`;

export const mlops14: V2Lesson = {
  slug: "mlops14-terraform-iac",
  track: "MLOps",
  module: "Fondasi Operasi",
  title: "MLOps14 — Infrastructure as Code: Terraform untuk ML",
  estMinutes: 54,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Cluster GPU yang cuma bisa dibangun ulang oleh satu orang",
      prose: [
        "Maret 2026. ArunaPay, fintech Indonesia, punya model fraud yang dilatih ulang tiap minggu di cluster GPU. Suatu Senin pagi, lead DevOps-nya, Budi, mengundurkan diri. Rabu malam, node GPU training mati total. Tim ML menatap channel Slack yang sepi: `cara rebuild clusternya gimana?` Jawabannya: tidak ada yang tahu. Cluster itu dibangun 8 bulan lalu lewat klik-klik di console cloud, dicatat setengah-setengah di Notion, dan separuh konfigurasinya `masih di kepala Budi`.",
        "Tiga minggu berikutnya adalah neraka: tim mencoba merekonstruksi cluster dari screenshot console dan ingatan. IAM role untuk training job salah permission → job gagal 4 hari. Bucket model registry ternyata tidak berversioning → model produksi tertimpa checkpoint eksperimen. Versi CUDA di node baru beda dari yang lama → training crash di epoch 3. Total downtime training: 19 hari. Estimasi kerugian: model fraud basi 3 minggu di tengah lonjakan transaksi Lebaran.",
        "Twist-nya: setelah insiden, engineer baru ArunaPay, Dinda, menulis ulang SELURUH infra sebagai kode Terraform dalam 2 minggu — cluster GPU, bucket registry, IAM role, network. Sejak itu: rebuild cluster = 1 perintah, 1,5 jam. Environment dev, staging, prod = file yang sama dengan variabel berbeda. Dan yang paling penting: tidak ada lagi `pengetahuan yang cuma ada di kepala satu orang` — infra bisa di-review seperti kode biasa.",
        "Prasyarat lesson ini (ringkas, 3 kalimat): kamu perlu paham dasar cloud (VM/GPU instance, bucket storage, IAM role — konsep `siapa boleh ngapain`) dan alur CI/CD (kode di-review lalu di-deploy otomatis; ringkasan MLOps5). Tidak perlu pernah menyentuh Terraform sebelumnya. Semua konsep Terraform dijelaskan dari nol dengan sudut pandang ML.",
        "⚠️ PEMBEDA SUDUT (anti-tumpang-tindih): lesson ini TENTANG IaC UNTUK INFRA ML — cluster GPU training, bucket model registry, IAM role training job, reproduksibilitas environment. Ia BUKAN tentang Terraform untuk platform data (itu ranah lesson de18: pipeline data, warehouse, orchestrator). Kalau de18 bertanya `bagaimana data mengalir`, lesson ini bertanya `di mana dan dengan izin apa model dilatih dan disimpan`.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menulis konfigurasi HCL untuk resource ML (cluster GPU, bucket, IAM); (2) menjelaskan peran state dan locking dalam kolaborasi tim; (3) menjalankan alur plan → apply dan membaca outputnya; (4) menyusun module reusable untuk 3 environment; (5) menghitung rasio drift infra dengan rumus; (6) memutuskan kapan Terraform vs alternatifnya.",
        "Durasi 54 menit · 1 lab simulator · 6 kuis · 1 chart · 1 mini-case. Daftar isi: 1) Cerita ArunaPay · 2) HCL: tulis niat, bukan perintah · 3) State: ingatan Terraform · 4) Module: satu cetak biru, banyak environment · 5) Lab: simulator terraform plan · 6) Reproduksibilitas: dev = staging = prod · 7) Peta keputusan · 8) Mini-case: hitungan ArunaPay · 9) Checkpoint.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `Terraform = script shell yang lebih rapi`",
        type: "pitfall",
        body: "Script shell = IMPERATIF: `jalankan perintah ini, lalu ini`. Kalau dijalankan 2x, hasilnya bisa beda (buat bucket yang sudah ada = error). Terraform = DEKLARATIF: kamu tulis KEADAAN AKHIR yang diinginkan (`bucket ini harus ada, versioning nyala`), Terraform yang menghitung langkahnya. Dijalankan 100x = hasil sama (idempotent). Inilah bedanya antara `instruksi memasak` dan `foto hidangan jadi` — Terraform bekerja dari fotonya.",
      },
      reference: "Infra yang diklik = pengetahuan di kepala orang. Infra sebagai kode = pengetahuan di repo.",
    },
    {
      id: "hcl",
      eyebrow: "Langkah 2 · Konsep",
      title: "HCL: tulis niat, bukan perintah",
      prose: [
        "HCL (HashiCorp Configuration Language) adalah bahasa deklaratif Terraform. Unit terkecilnya: RESOURCE BLOCK — `resource \"aws_s3_bucket\" \"model-registry\" { ... }`. Tiga bagian: tipe resource (apa yang dibuat), nama lokal (panggilan di kode), dan atribut (konfigurasinya). Contoh bucket registry: `versioning { enabled = true }` — satu baris yang mencegah tragedi `model tertimpa checkpoint` ArunaPay.",
        "Contoh cluster GPU training dalam HCL (disederhanakan): `resource \"aws_instance\" \"train\" { count = 4, instance_type = \"p4d.24xlarge\", ami = \"ami-0abc...\" }`. Perhatikan `ami` yang di-pin ke ID eksplisit — inilah obat untuk `CUDA beda versi` di cerita: image yang di-pin = environment yang sama persis setiap rebuild. `count = 4` = 4 node identik; ubah angka, apply, selesai — tanpa klik 4x di console.",
        "IAM ROLE untuk training job: `resource \"aws_iam_role\" \"training\" { name = \"training-job-role\" }` + policy attachment yang membatasi akses hanya ke bucket registry dan dataset. Prinsip least privilege sebagai kode: siapa pun bisa me-review `role ini boleh baca bucket X, tidak boleh hapus` di pull request — bukan menebak dari console. Inilah `izin training job` yang hilang 4 hari di ArunaPay, kini terdokumentasi abadi.",
        "ALUR CLI (dari docs resmi developer.hashicorp.com/terraform/docs): `terraform init` (unduh provider & module) → `terraform plan` (tampilkan RENCANA perubahan: +create, ~update, -delete — tanpa menyentuh apa pun) → `terraform apply` (eksekusi rencana). `plan` adalah superpower-nya: kamu me-review diff infra seperti me-review diff kode SEBELUM ada yang berubah. Tidak ada `oops, salah klik` — karena tidak ada klik.",
        "VARIABEL & OUTPUT: `variable \"gpu_count\" { default = 4 }` membuat konfigurasi bisa dipakai ulang; `output \"bucket_name\" { value = aws_s3_bucket.model-registry.id }` mengekspos hasil untuk dipakai konfigurasi lain. Variabel = parameter fungsi; output = return value. Terraform pada dasarnya `pemrograman untuk infra` — dengan review, testing, dan versioning.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: Terraform = resep yang bisa dieksekusi mesin",
        body: "Click-ops = masak dengan feeling (`tambahin garam secukupnya`) — hasilnya beda tiap orang. Script shell = resep imperatif (`panaskan, aduk 3x`) — gagal kalau dapurnya beda. Terraform = resep deklaratif + foto hidangan (`nasi goreng dengan 2 telur, kecap 1 sdm`) — mesin yang memastikan hidangannya sama persis, di dapur mana pun, oleh siapa pun.",
      },
      reference: "Resource block = niat. plan = pratinjau. apply = eksekusi. Variabel = parameter.",
    },
    {
      id: "state",
      eyebrow: "Langkah 3 · Konsep",
      title: "State: ingatan Terraform tentang dunia nyata",
      prose: [
        "STATE (`terraform.tfstate`) adalah file JSON tempat Terraform mencatat: resource apa yang sudah dibuat + ID-nya di cloud + atribut terakhirnya. Tanpa state, Terraform buta: tiap `plan` akan mengira SEMUA resource belum ada dan mencoba membuatnya lagi (duplikat cluster!). State = ingatan yang menghubungkan `kode yang kamu tulis` dengan `benda yang benar-benar ada di cloud`.",
        "Masalahnya: state di laptop = bencana kolaborasi. Dinda apply dari laptopnya, kamu plan dari laptopmu — dua ingatan berbeda, hasilnya chaos. Solusinya: REMOTE BACKEND — state disimpan di tempat bersama (S3/GCS bucket) dengan STATE LOCKING (DynamoDB/GCS lock) agar hanya satu `apply` yang jalan dalam satu waktu. Dua orang apply bersamaan tanpa lock = state corrupt = infra setengah jadi. Aturan keras: JANGAN PERNAH commit file .tfstate ke Git (ia berisi secret!), tapi SELALU pakai remote backend + lock untuk tim.",
        "DRIFT = perbedaan antara state/kode vs dunia nyata. Seseorang mengklik console (`naikkan GPU 2 → 4 biar cepat`) tanpa mengubah kode → drift. `terraform plan` mendeteksinya dan menawarkan mengembalikan ke keadaan yang diinginkan. Drift yang tidak terdeteksi = `kok training kemarin bisa, sekarang gagal?` yang misterius. Rasio drift bisa dihitung: D = N_drift / N_total — jumlah resource yang menyimpang dibagi total resource. Contoh ArunaPay pasca-insiden: 3 dari 4 resource menyimpang → D = 0,75 (75%!). Target tim yang sehat: D mendekati 0, dan satu-satunya cara mengubah infra = pull request.",
        "Perintah praktis: `terraform refresh` (sinkronkan state dengan dunia nyata, tanpa mengubah apa pun), `terraform plan -detailed-exitcode` (exit code 2 = ada perubahan — dipakai CI untuk memberi label otomatis di PR: `infra berubah`). Di ArunaPay, CI menolak merge PR infra yang plan-nya menunjukkan delete pada resource produksi tanpa label `approved-destroy`. Guardrail sebagai kode.",
      ],
      formula: String.raw`D = \frac{N_{drift}}{N_{total}}`,
      formulaNote: "D = rasio drift (0 sampai 1, tanpa satuan); N_drift = jumlah resource yang keadaannya menyimpang dari kode (update + delete yang tak direncanakan); N_total = total resource yang dikelola. Contoh: 3 dari 4 resource menyimpang → D = 3/4 = 0,75 = 75% infra `liar`. Interpretasi: D > 0,2 = tim mengubah infra lewat klik console; D ≈ 0 = semua perubahan lewat kode + review.",
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: `State cuma file cache — hapus saja kalau error`",
        type: "pitfall",
        body: "Menghapus .tfstate TIDAK menghapus resource di cloud — ia menghapus INGATAN Terraform tentang resource itu. Hasilnya: Terraform mengira resource belum ada dan mencoba membuat duplikatnya (2 cluster GPU = tagihan dobel!), sementara yang lama jadi `yatim` tak terkelola. State corrupt = operasi penyelamatan manual yang menyakitkan. Lindungi state seperti database produksi: remote backend + versioning + lock.",
      },
      reference: "State = ingatan. Remote backend + lock = ingatan bersama yang aman. Drift = ingatan vs kenyataan.",
    },
    {
      id: "modules",
      eyebrow: "Langkah 4 · Konsep",
      title: "Module: satu cetak biru, banyak environment",
      prose: [
        "MODULE = folder berisi konfigurasi Terraform yang bisa dipakai ulang — seperti fungsi. Module `gpu-cluster` menerima variabel (`gpu_count`, `instance_type`, `env`) dan membangun cluster lengkap: node + security group + IAM role. Dev pakai `gpu_count = 1, instance_type = \"g5.xlarge\"`; prod pakai `gpu_count = 4, instance_type = \"p4d.24xlarge\"` — kode SAMA, parameter beda.",
        "Struktur repo ArunaPay pasca-Dinda: `modules/gpu-cluster/` (cetak biru), `modules/model-registry/` (bucket + versioning + enkripsi), `envs/dev/`, `envs/staging/`, `envs/prod/` (masing-masing 20 baris: panggil module + isi variabel). Bug diperbaiki SEKALI di module → 3 environment ikut sembuh. Bandingkan dengan 3 cluster yang diklik manual: bug yang sama harus diperbaiki 3x, dan biasanya lupa 1.",
        "WORKSPACE vs FOLDER per env: dua pola. Folder per env (`envs/dev`, `envs/prod` — state terpisah per folder) = isolasi kuat, cocok untuk tim ML yang prod-nya sensitif. Workspace (`terraform workspace new prod` — state terpisah, kode sama) = ringan, cocok untuk eksperimen. Aturan praktis ArunaPay: folder per env untuk dev/staging/prod; workspace untuk eksperimen sementara data scientist (`workspace new eksperimen-rina`, hapus setelah selesai).",
        "HCP TERRAFORM (dulu Terraform Cloud, dari docs resmi): menjalankan `plan`/`apply` di server HashiCorp, bukan laptop — plus UI untuk review plan, riwayat run, dan policy check (Sentinel/OPA: `tolak apply yang membuat bucket tanpa enkripsi`). Untuk tim ML kecil, HCP gratis tier cukup; untuk enterprise, self-hosted runner + remote backend S3 juga sah. Prinsipnya sama: apply dari mesin yang terkontrol, bukan dari laptop siapa pun.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: module = cetakan kue, environment = adonan",
        body: "Tanpa module: tiap environment = kue yang diuleni manual — bentuknya mirip tapi tak pernah sama (dan yang prod gosong duluan). Dengan module: SATU cetakan (module), adonan beda (variabel dev/staging/prod) — kue keluar konsisten. Data scientist yang butuh cluster eksperimen? Tuang adonan baru ke cetakan yang sama: 10 menit, bukan 3 hari menunggu DevOps.",
      },
      reference: "Module = fungsi untuk infra. Folder per env = isolasi prod. HCP = apply yang terkontrol.",
    },
    {
      id: "lab-plan",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: simulator terraform plan",
      prose: [
        "SIMULASI — jujur: lab ini mensimulasikan LOGIKA DIFF Terraform (bukan Terraform asli — tidak ada cloud di sini): bandingkan desired state (kode) vs actual state (kenyataan), hasilkan rencana +create / ~update / -delete, dalam Python murni.",
        "Skenario ArunaPay: DESIRED (kode Dinda) = cluster train-a100 4 node, bucket model-registry dengan versioning NYALA, IAM role training-job-role. ACTUAL (kenyataan pasca klik manual) = cluster cuma 2 node, versioning MATI, plus bucket logs-lama yang tidak ada di kode. Tugasmu: implementasikan `key()`, `diff_attrs()`, dan `plan()` — persis cara Terraform berpikir.",
        "Cara membaca: tiap baris rencana diawali simbol aksi (+/~/-) persis output `terraform plan` asli. Interpretasi: 2 update = drift dari klik manual; 1 create = resource yang belum ada; 1 delete = sampah yang harus dibersihkan. Rasio drift D = 0,75 — 75% infra menyimpang dari kode!",
        "Coba eksplorasi: ubah ACTUAL agar versioning sudah True — apa yang berubah di rencana? (Petunjuk: update bucket hilang, D turun.) Tambah resource ke DESIRED — lihat create bertambah. Inilah yang Dinda review di tiap pull request.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `key(r)` → (type, name) dan `diff_attrs(d, a)` → daftar `attr: lama -> baru`" },
        { id: "t2", text: "Implementasikan `plan(desired, actual)` → list baris `+ create` / `~ update` / `- delete`" },
        { id: "t3", text: "Jalankan agregasi: baca ringkasan + rasio drift, cocokkan dengan ekspektasi" },
      ],
      expected: "ringkasan: create=1 update=2 delete=1 noop=0 · drift: 3 dari 4 menyimpang (D=0,75)",
      note: {
        title: "💡 Intuisi: plan = pratinjau sebelum menekan tombol merah",
        body: "Tombol `apply` tanpa `plan` = menandatangani kontrak tanpa membaca. Terraform memisahkan keduanya secara desain: plan = `inilah yang AKAN terjadi`, apply = `lakukan`. Di ArunaPay, CI menampilkan output plan langsung di pull request — reviewer melihat `~ update cluster [count: 2 -> 4]` SEBELUM ada yang berubah. Tidak ada kejutan di produksi.",
      },
      hints: [
        "key: kembalikan tuple (r[\"type\"], r[\"name\"]).",
        "diff_attrs: lewati key type/name; bandingkan tiap atribut; format \"attr: lama -> baru\".",
        "plan: untuk tiap desired — tidak ada di actual → \"+ create type/name\"; atribut beda → \"~ update type/name [daftar]\"; tiap actual yang tak ada di desired → \"- delete type/name\".",
      ],
      code: {
        starter: `DESIRED = [\n    {"type": "gpu_cluster", "name": "train-a100", "count": 4, "gpu": "a100"},\n    {"type": "bucket", "name": "model-registry", "versioning": True},\n    {"type": "iam_role", "name": "training-job-role"},\n]\nACTUAL = [\n    {"type": "gpu_cluster", "name": "train-a100", "count": 2, "gpu": "a100"},\n    {"type": "bucket", "name": "model-registry", "versioning": False},\n    {"type": "bucket", "name": "logs-lama", "versioning": False},\n]\n\n# TULIS KODEMU\ndef key(r):\n    ...\n\ndef diff_attrs(d, a):\n    ...\n\ndef plan(desired, actual):\n    ...\n\n# AGREGASI (jangan ubah)\naksi = plan(DESIRED, ACTUAL)\nfor a in aksi:\n    print(a)\nc = sum(1 for a in aksi if a.startswith("+"))\nu = sum(1 for a in aksi if a.startswith("~"))\nd = sum(1 for a in aksi if a.startswith("-"))\nprint(f"ringkasan: create={c} update={u} delete={d} noop={len(DESIRED)-c-u}")\ndrift = (u + d) / (len(DESIRED) + d)\nprint(f"drift: {u+d} dari {len(DESIRED)+d} sumber daya menyimpang (D={drift:.2f})".replace(".", ","))`,
        lockLines: 11,
        solution: `DESIRED = [\n    {"type": "gpu_cluster", "name": "train-a100", "count": 4, "gpu": "a100"},\n    {"type": "bucket", "name": "model-registry", "versioning": True},\n    {"type": "iam_role", "name": "training-job-role"},\n]\nACTUAL = [\n    {"type": "gpu_cluster", "name": "train-a100", "count": 2, "gpu": "a100"},\n    {"type": "bucket", "name": "model-registry", "versioning": False},\n    {"type": "bucket", "name": "logs-lama", "versioning": False},\n]\n\n# TULIS KODEMU\ndef key(r):\n    return (r["type"], r["name"])\n\ndef diff_attrs(d, a):\n    out = []\n    for k in d:\n        if k in ("type", "name"):\n            continue\n        if k not in a or a[k] != d[k]:\n            out.append(f"{k}: {a.get(k)} -> {d[k]}")\n    return out\n\ndef plan(desired, actual):\n    lines = []\n    a_map = {key(r): r for r in actual}\n    d_keys = set()\n    for d in desired:\n        k = key(d)\n        d_keys.add(k)\n        ks = f"{k[0]}/{k[1]}"\n        if k not in a_map:\n            lines.append(f"+ create {ks}")\n        else:\n            ch = diff_attrs(d, a_map[k])\n            if ch:\n                lines.append(f"~ update {ks} [{', '.join(ch)}]")\n    for a in actual:\n        k = key(a)\n        if k not in d_keys:\n            lines.append(f"- delete {k[0]}/{k[1]}")\n    return lines\n\n# AGREGASI (jangan ubah)\naksi = plan(DESIRED, ACTUAL)\nfor a in aksi:\n    print(a)\nc = sum(1 for a in aksi if a.startswith("+"))\nu = sum(1 for a in aksi if a.startswith("~"))\nd = sum(1 for a in aksi if a.startswith("-"))\nprint(f"ringkasan: create={c} update={u} delete={d} noop={len(DESIRED)-c-u}")\ndrift = (u + d) / (len(DESIRED) + d)\nprint(f"drift: {u+d} dari {len(DESIRED)+d} sumber daya menyimpang (D={drift:.2f})".replace(".", ","))`,
        checks: [
          { kind: "stdout_matches", task: "t3", label: "ringkasan plan", msg: "Rencana harus create=1 update=2 delete=1 noop=0.", pattern: "ringkasan: create=1 update=2 delete=1 noop=0" },
          { kind: "stdout_matches", task: "t3", label: "rasio drift 0,75", msg: "Drift harus 3 dari 4 (D=0,75).", pattern: "drift: 3 dari 4 sumber daya menyimpang \\(D=0,75\\)" },
          { kind: "stdout_matches", task: "t2", label: "detail update cluster", msg: "Harus ada baris update cluster train-a100 dengan perubahan count.", pattern: "~ update gpu_cluster/train-a100 \\[count: 2 -> 4\\]" },
        ],
      },
      reference: "Simulasi logika diff (bukan Terraform asli). Drift D=0,75 = 75% infra menyimpang.",
    },
    {
      id: "repro",
      eyebrow: "Langkah 6 · Pendalaman",
      title: "Reproducibilitas: dev = staging = prod",
      prose: [
        "Masalah ML yang paling mahal bukan `training gagal` — melainkan `training berhasil di tempat yang salah`. Model yang lolos evaluasi di dev tapi anjlok di prod, 90% penyebabnya BUKAN modelnya: versi CUDA beda, library beda, permission beda, data mount beda. Terraform menyerang akar masalahnya: environment = kode yang SAMA, sehingga `bedanya di mana?` selalu punya jawaban: diff variabel antar env.",
        "Tiga pilar reproduksibilitas infra ML: (1) IMAGE PINNING — AMI/container image di-pin ke digest eksplisit, bukan tag `latest` yang bergeser diam-diam; (2) VERSIONED REGISTRY — bucket model dengan versioning + lifecycle (checkpoint lama terarsip otomatis, bukan tertimpa); (3) IAM SEBAGAI KODE — role training job didefinisikan dengan policy eksplisit, sehingga `job gagal karena permission` bisa di-debug dari Git, bukan dari tebakan.",
        "Pola ArunaPay: `envs/dev` (1 GPU kecil, spot), `envs/staging` (mirror prod tapi 1 node), `envs/prod` (4×A100, on-demand). Data scientist menjalankan eksperimen di dev yang MURAH dengan keyakinan: kalau works di dev, apply ke staging = environment yang identik secara struktural. Kejutan `kok di prod beda?` turun dari mingguan menjadi hampir nol — karena bedanya hanya angka di variabel, bukan susunan infra.",
        "GITOPS UNTUK INFRA: merge ke main → CI menjalankan `terraform plan` → reviewer menyetujui → CD menjalankan `apply`. Riwayat infra = riwayat Git: `kapan GPU ditambah?` → git log. `siapa yang mematikan versioning?` → git blame. Insiden ArunaPay yang dulu butuh 3 minggu investigasi, kini butuh 10 menit `git log -- envs/prod`. Infra yang bisa di-blame = infra yang bisa diperbaiki.",
      ],
      figure: {
        svg: FIG_REBUILD,
        alt: "Waktu rebuild cluster GPU: manual 40 jam, Terraform 1,5 jam.",
        caption: "Cara membaca: panjang batang = waktu rebuild 1 cluster GPU dari nol (jam); dua batang = click-ops manual vs Terraform apply. Interpretasi: 27x bukan karena Terraform `lebih cepat mengetik` — melainkan karena tidak ada lagi fase `mencari tahu caranya` (3 minggu di cerita ArunaPay). Sekali ditulis, rebuild ke-2 sampai ke-100 = 1,5 jam yang sama.",
      },
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Single point of knowledge (Budi) = risiko operasional konsentrasi — sama berbahayanya dengan single point of failure teknis. Terraform memindahkan pengetahuan dari kepala ke repo: bus factor naik dari 1 ke seluruh tim. Untuk audit/regulator (OJK/BI di fintech): `tunjukkan siapa mengubah infra produksi kapan` = git log, bukan kesaksian lisan.",
      },
      reference: "Image pinning + versioned registry + IAM sebagai kode = training yang bisa diulang di mana pun.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Terraform, Pulumi, CloudFormation, atau klik saja?",
      prose: [
        "**Skenario 1 — Tim ML multi-cloud / butuh provider lengkap (AWS+GCP).** → Terraform. Registry provider terbesar; HCL deklaratif mudah di-review non-engineer.",
        "**Skenario 2 — Tim yang semuanya engineer Python/TS dan benci bahasa baru.** → Pulumi. Infra sebagai kode Python/TypeScript asli (loop, if, test unit sungguhan) — tapi state & konsepnya mirip Terraform, pelajarannya 80% transferable.",
        "**Skenario 3 — 100% AWS, tidak akan pindah cloud, tim kecil.** → CloudFormation/CDK boleh. Terintegrasi AWS dalam, tapi mengunci ke satu vendor — pindah ke GCP = tulis ulang.",
        "**Skenario 4 — Eksperimen 1-2 hari, akan dibuang.** → Klik console / script cepat BOLEH — dengan syarat: ada tanggal kedaluwarsa tertulis. `Sementara` yang tidak dijadwalkan hapus = permanen. Aturan ArunaPay: eksperimen > 2 minggu wajib jadi module.",
        "**Skenario 5 — Deploy aplikasi ke Kubernetes yang sudah ada.** → Helm/Kustomize untuk lapisan aplikasi; Terraform untuk lapisan cluster-nya. Jangan paksa Terraform me-manage deployment app yang berubah tiap jam — itu pekerjaan GitOps (ArgoCD).",
        "**Skenario 6 — Butuh guardrail `tidak boleh` (mis. bucket tanpa enkripsi dilarang).** → Terraform + HCP Sentinel / OPA policy check di pipeline plan. Kebijakan sebagai kode = ditolak SEBELUM apply, bukan ditemukan saat audit.",
        "Aturan praktis 10 detik: `infra ML yang harus hidup > 2 minggu?` → Terraform (atau Pulumi). `Cuma AWS selamanya?` → CloudFormation boleh. `Eksperimen buang?` → klik, tapi tulis tanggal hapusnya. `Policy otomatis?` → plan + policy check di CI.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: pilih perkakas sesuai umur infra",
        body: "Infra = tanaman. Kecambah 2 hari (eksperimen): siram manual (klik) cukup. Pohon yang harus hidup bertahun-tahun (cluster training prod): butuh sistem irigasi (Terraform) — mahal di awal, murah selamanya. Kesalahan klasik: menyiram pohon dengan gayung tiap hari selama 2 tahun, lalu heran kenapa tukang kebunnya resign.",
      },
      reference: ">2 minggu → Terraform/Pulumi. AWS-only → CloudFormation. Eksperimen → klik + tanggal hapus.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Hitungan ArunaPay: 3 minggu vs 2 minggu menulis kode",
      prose: [
        "Angka insiden: rebuild manual cluster oleh 2 engineer senior, 3 minggu (≈ 240 jam kerja total), tarif Rp500rb/jam → Rp120 juta biaya langsung. Downtime training 19 hari → model fraud basi; estimasi fraud lolos tambahan Rp450 juta (angka ilustratif dari tim risk). Total insiden ≈ Rp570 juta.",
        "Investasi Dinda: 2 minggu menulis Terraform (≈ 80 jam × Rp500rb = Rp40 juta) + 1 minggu migrasi state. Sejak itu: rebuild cluster = 1,5 jam engineer junior (Rp750rb). Environment baru (mis. region DR) = copy folder env + apply = 4 jam, bukan 3 minggu. Break-even: SATU insiden rebuild yang dihindari sudah membayar 14x lipat investasinya (Rp570jt / Rp40jt).",
        "Hitung sendiri: tim-mu punya 3 environment (dev/staging/prod). Tiap perubahan infra manual = 2 jam × 3 env = 6 jam, dengan peluang lupa 1 env = 30%. Dengan module Terraform: 0,5 jam (ubah module + plan 3 env) dan peluang lupa = 0% (apply menolak drift). Dalam 1 tahun dengan 50 perubahan: manual = 300 jam + ~15 insiden lupa; Terraform = 25 jam + 0. Selisih 275 jam ≈ Rp137,5 juta/tahun — untuk SATU tim kecil.",
        "Pembahasan: Terraform BUKAN penghemat `waktu mengetik` — ia penghemat `waktu mencari tahu` dan `biaya salah`. ROI-nya datang dari insiden yang TIDAK terjadi: drift yang tertangkap di plan, bukan di produksi jam 2 pagi. Inilah matematika yang meyakinkan CFO: Rp40 juta investasi vs Rp570 juta satu insiden.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model fraud yang basi 19 hari = risiko operasional yang TERUKUR (Rp450 juta). Terraform di sini bukan `best practice DevOps` — ia KONTROL RISIKO: mengurangi MTTR (mean time to recovery) infra dari 3 minggu menjadi 1,5 jam. Risk register ArunaPay kini mencatat `bus factor infra = N tim`, bukan `= 1 orang`.",
      },
      reference: "Rp40jt investasi vs Rp570jt satu insiden. Break-even = 1 insiden yang dihindari.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Akar masalah insiden ArunaPay (3 minggu rebuild) adalah?",
          options: [
            { text: "GPU-nya kurang — seharusnya beli lebih banyak", why: "GPU-nya ada; yang hilang adalah CARA membangunnya. Menambah GPU tanpa dokumentasi = menambah masalah." },
            { text: "Infra dibangun via click-ops tanpa kode: pengetahuan hanya di kepala Budi (bus factor 1)", why: "Tepat. Tidak ada kode = tidak ada review, tidak ada riwayat, tidak ada rebuild. Terraform memindahkan pengetahuan ke repo.", correct: true },
            { text: "Model fraud-nya terlalu kompleks", why: "Model tidak berubah selama insiden; yang rusak infrastrukturnya. Kompleksitas model ≠ kerapuhan infra." },
            { text: "Cloud provider-nya tidak andal", why: "Provider baik-baik saja; node mati adalah kejadian normal. Yang tidak normal = tidak bisa rebuild." },
          ],
        },
        {
          q: "Apa peran file terraform.tfstate?",
          options: [
            { text: "Template untuk membuat resource baru", why: "Itu peran file .tf (kode HCL). State bukan template — ia catatan hasil." },
            { text: "Ingatan: memetakan kode ke resource yang benar-benar ada di cloud (ID + atribut terakhir)", why: "Tepat. Tanpa state, Terraform buta dan akan membuat duplikat. Karena itu state = lindungi seperti database.", correct: true },
            { text: "Cache yang aman dihapus kapan saja", why: "Berbahaya: menghapus state ≠ menghapus resource — yang hilang ingatannya, resource jadi yatim tak terkelola + risiko duplikat." },
            { text: "Log audit siapa mengubah infra", why: "Itu peran Git history. State = keadaan terkini, bukan riwayat siapa." },
          ],
        },
        {
          q: "Desired vs actual di lab: 3 dari 4 resource menyimpang. Nilai D dan artinya?",
          options: [
            { text: "D = 0,25 — infra hampir sehat", why: "Terbalik: 3/4 = 0,75, bukan 0,25. Tiga perempat menyimpang = parah." },
            { text: "D = 0,75 — 75% infra liar (diubah di luar kode); target sehat ≈ 0", why: "Tepat. D = N_drift/N_total = 3/4. D > 0,2 = tim masih klik console; satu-satunya jalan ubah infra = pull request.", correct: true },
            { text: "D = 3 — tiga resource harus dihapus", why: "D adalah rasio (0–1), bukan hitungan. Dan yang menyimpang belum tentu dihapus — update juga dihitung." },
            { text: "D tidak bermakna tanpa tahu biayanya", why: "D mengukur KEPATUHAN terhadap kode, bukan biaya. Keduanya penting, tapi beda metrik." },
          ],
        },
        {
          q: "Tim ML butuh environment eksperimen baru tiap 2 hari, dibuang setelah seminggu. Pola terbaik?",
          options: [
            { text: "Folder env permanen per eksperimen di repo", why: "Repo akan penuh ratusan folder yatim. Eksperimen buang ≠ environment permanen." },
            { text: "Klik console saja, lebih cepat", why: "Cepat 10 menit, mahal 3 minggu saat ada yang lupa dihapus dan menagih tiap bulan. Tanpa tanggal hapus = permanen." },
            { text: "Workspace Terraform sementara (atau module + variabel), dihancurkan setelah selesai", why: "Tepat. Cetakan sama (module), adonan sementara (workspace), destroy terjadwal. Cepat DAN bersih.", correct: true },
            { text: "Pakai environment prod saja biar tidak duplikat", why: "Eksperimen di prod = risiko tertinggi. Isolasi adalah alasan environment ada." },
          ],
        },
        {
          q: "Kenapa `terraform plan` dijalankan di CI untuk setiap pull request infra?",
          options: [
            { text: "Agar apply berjalan lebih cepat", why: "Plan tidak mempercepat apply; ia menambah langkah. Nilainya = keamanan, bukan kecepatan." },
            { text: "Pratinjau diff (+create/~update/-delete) bisa di-review SEBELUM ada yang berubah; guardrail menolak yang berbahaya", why: "Tepat. Plan = `inilah yang akan terjadi`. CI bisa menolak otomatis (mis. delete resource prod tanpa label). Tidak ada kejutan.", correct: true },
            { text: "Untuk menghemat biaya penyimpanan state", why: "Plan justru MEMBACA state; tidak ada hubungannya dengan biaya penyimpanannya." },
            { text: "Karena apply tidak bisa dijalankan manual", why: "Apply bisa manual; yang tidak boleh = apply BUTA tanpa review plan." },
          ],
        },
        {
          q: "Bedakan sudut lesson ini vs lesson de18 (Terraform untuk platform data)?",
          options: [
            { text: "Tidak ada beda — Terraform ya Terraform", why: "Perkakasnya sama, PERTANYAANNYA beda: de18 = aliran data; lesson ini = tempat & izin komputasi ML. Sudut menentukan desain module." },
            { text: "de18 = bagaimana data mengalir (pipeline, warehouse); lesson ini = di mana & dengan izin apa model dilatih/disimpan (GPU cluster, registry bucket, IAM training job)", why: "Tepat. Inilah pembeda sudut yang ditulis eksplisit di Langkah 1: infra komputasi ML vs platform data.", correct: true },
            { text: "Lesson ini untuk pemula, de18 untuk expert", why: "Keduanya mandiri dan setara; bedanya domain, bukan level." },
            { text: "Lesson ini hanya teori, de18 yang praktik", why: "Lesson ini punya lab simulator plan + hitungan mini-case. Praktiknya nyata, domainnya ML infra." },
          ],
        },
      ],
      summary: [
        "Terraform = Infrastructure as Code deklaratif (HCL): tulis keadaan akhir yang diinginkan, bukan langkah perintah — idempotent, bisa di-review.",
        "Alur CLI: init → plan (pratinjau +create/~update/-delete) → apply; plan di CI = guardrail sebelum ada yang berubah.",
        "State (terraform.tfstate) = ingatan Terraform; wajib remote backend + locking untuk tim; jangan hapus sembarangan.",
        "Drift = kenyataan menyimpang dari kode; D = N_drift/N_total; target ≈ 0, satu-satunya jalan ubah infra = pull request.",
        "Module = cetak biru reusable; folder per env untuk isolasi prod; workspace untuk eksperimen sementara; HCP = apply terkontrol + policy check.",
        "Reproduksibilitas ML = image pinning + versioned registry + IAM sebagai kode; sudut lesson ini = infra komputasi ML (bukan platform data ala de18).",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
    },
  ],
};
