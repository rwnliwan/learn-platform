import type { V2Lesson } from "../lib/types";

// ── Figure: arsitektur database di Kubernetes ────────────────────────────
const K8S_SVG = `<svg viewBox="0 0 560 250" role="img" aria-label="Diagram arsitektur database di Kubernetes: control plane, operator, StatefulSet tiga pod, dan PVC per pod">
<g font-family="var(--font-ui)" font-size="11" fill="var(--text)" text-anchor="middle">
<rect x="200" y="8" width="160" height="40" rx="8" fill="var(--c1)" opacity="0.9"/>
<text x="280" y="32">Operator DB</text>
<rect x="60" y="70" width="120" height="44" rx="8" fill="var(--c2)" opacity="0.9"/>
<text x="120" y="89">pg-0</text><text x="120" y="104" font-size="9" fill="var(--text-muted)">primary</text>
<rect x="220" y="70" width="120" height="44" rx="8" fill="var(--c2)" opacity="0.9"/>
<text x="280" y="89">pg-1</text><text x="280" y="104" font-size="9" fill="var(--text-muted)">replica</text>
<rect x="380" y="70" width="120" height="44" rx="8" fill="var(--c2)" opacity="0.9"/>
<text x="440" y="89">pg-2</text><text x="440" y="104" font-size="9" fill="var(--text-muted)">replica</text>
<rect x="60" y="140" width="120" height="36" rx="8" fill="var(--c3)" opacity="0.9"/>
<text x="120" y="162" font-size="10">PVC pg-0</text>
<rect x="220" y="140" width="120" height="36" rx="8" fill="var(--c3)" opacity="0.9"/>
<text x="280" y="162" font-size="10">PVC pg-1</text>
<rect x="380" y="140" width="120" height="36" rx="8" fill="var(--c3)" opacity="0.9"/>
<text x="440" y="162" font-size="10">PVC pg-2</text>
<rect x="200" y="196" width="160" height="36" rx="8" fill="var(--c4)" opacity="0.9"/>
<text x="280" y="218" font-size="10">Backup → object storage</text>
</g>
<g stroke="var(--text-muted)" stroke-width="1.5" fill="none">
<line x1="280" y1="48" x2="120" y2="70"/><line x1="280" y1="48" x2="280" y2="70"/><line x1="280" y1="48" x2="440" y2="70"/>
<line x1="120" y1="114" x2="120" y2="140"/><line x1="280" y1="114" x2="280" y2="140"/><line x1="440" y1="114" x2="440" y2="140"/>
<line x1="280" y1="176" x2="280" y2="196" stroke-dasharray="5 4"/>
</g>
<g font-family="var(--font-ui)" font-size="10" fill="var(--text-muted)">
<text x="10" y="244">Tiap pod punya identitas stabil + PVC sendiri. Operator mengawasi ketiganya; backup keluar dari cluster.</text>
</g>
</svg>`;

export const dba23: V2Lesson = {
  slug: "dba23-database-kubernetes-iac",
  track: "Database Administrator",
  module: "Skala & Cloud",
  title: "DBA23 — Database di Kubernetes & IaC untuk DBA",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Tujuan, rute, dan bekal",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan perbedaan Deployment vs StatefulSet dan mengapa database wajib yang kedua; (2) menjelaskan peran operator database (contoh: failover dan backup otomatis); (3) membedakan storage ephemeral vs persistent (PVC) dan implikasinya pada backup; (4) membaca dan menilai konfigurasi Terraform untuk provisioning database; (5) menghitung RTO failover dari komponen-komponennya dan mengidentifikasi jebakan K8s untuk workload stateful.",
        "Rutenya: cerita pod restart yang menghapus data → StatefulSet → operator → storage & backup → Terraform/IaC → lab simulasi penjadwalan + failover → jebakan K8s → peta keputusan → mini-case RTO 50 detik → kuis → rangkuman. Estimasi 65 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Kubernetes (K8s) adalah orkestrator container: kamu mendeklarasikan keadaan yang diinginkan (“3 replika Postgres”), ia mewujudkannya di node-node cluster. Pod = unit terkecil (satu atau lebih container); node = mesin pekerja. Deployment cocok untuk aplikasi stateless (bisa dimatikan kapan saja tanpa kehilangan apa-apa). Database adalah stateful — datanya harus selamat dari restart pod. Terraform adalah tool Infrastructure as Code: infrastruktur ditulis sebagai file konfigurasi, lalu “di-apply” — bisa di-review, di-versioning, dan diulang.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: menaruh database di Deployment biasa seperti menyimpan arsip penting di kamar hotel — kamarnya nyaman, tetapi tiap check-out semua barang di dalamnya dibuang. StatefulSet adalah kontrakan dengan gudang pribadi: pindah kamar boleh, barang tetap ada.",
      ],
      reference: "Bekal: pod, node, Deployment (stateless), Terraform (IaC). Database = stateful.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Restart pod yang menghapus 3 jam transaksi",
      prose: [
        "Startup fintech itu bangga: “infrastruktur kami 100% Kubernetes”. Postgres-nya berjalan sebagai Deployment dengan 1 replika — “kan K8s otomatis restart kalau mati, jadi HA”. Suatu malam node mengalami tekanan memori; K8s meng-evict pod Postgres dan menjadwalkannya ulang di node lain. Pod baru menyala dalam 40 detik. Semua orang bernapas lega — sampai tim finance sadar 3 jam transaksi terakhir hilang.",
        "Penyebabnya dua lapis, dan keduanya klasik. Pertama: Deployment tidak menjamin identitas dan storage — pod baru adalah “orang asing” tanpa memori; datanya tersimpan di emptyDir yang ikut mati bersama pod lama. Kedua — dan ini yang lebih menyakitkan: backup cron mereka menulis ke volume yang sama dengan data. Twist-nya: tim mengira mereka punya HA (restart otomatis) dan backup (cron berjalan tiap jam) — padahal yang mereka punya adalah ilusi keduanya. Restart otomatis tanpa persistent storage = bunuh diri otomatis. Backup di volume yang sama = fotokopi yang ikut terbakar saat rumah kebakaran.",
        "Lesson ini tentang cara yang benar: StatefulSet + PVC untuk identitas dan data, operator untuk otomatisasi yang paham database, backup yang keluar dari cluster, dan Terraform agar semuanya terdokumentasi sebagai kode.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “sudah di Kubernetes = sudah HA dan sudah ada backup”",
        body: "Yang benar: K8s memberi restart otomatis — tetapi restart pod stateful tanpa PVC = data hilang otomatis. Dan CronJob backup yang menulis ke volume pod = bukan backup. HA dan backup adalah sifat yang harus dirancang (StatefulSet + PVC + backup eksternal), bukan hadiah bawaan platform.",
        type: "pitfall",
      },
    },
    {
      id: "konsep-statefulset",
      eyebrow: "Langkah 3 · Konsep",
      title: "StatefulSet — Si Penjaga Identitas",
      prose: [
        "Definisi: StatefulSet adalah controller K8s untuk workload stateful. Tiga bedanya dari Deployment: (1) identitas stabil — pod bernama pg-0, pg-1, pg-2 (bukan nama acak); restart tetap pg-0; (2) PVC template — tiap pod mendapat PersistentVolumeClaim sendiri yang menempel ulang ke pod yang sama; (3) startup/upgrade berurutan — pg-1 tidak dinyalakan sebelum pg-0 ready (penting untuk replikasi: primary dulu, baru replica).",
        "Kepribadiannya: Deployment memperlakukan pod seperti ternak — mati satu, ganti satu, tidak ada yang peduli. StatefulSet memperlakukan pod seperti hewan peliharaan bernama — pg-0 yang restart tetap pg-0, dengan kandang (PVC) dan riwayatnya. Database butuh diperlakukan sebagai peliharaan, bukan ternak.",
        "Waktu pulih saat node mati bisa dihitung dari komponennya — dan rumus inilah yang harus kamu pakai saat ditanya “berapa RTO kita?” (bukan “cepat kok”).",
      ],
      formula: String.raw`RTO = t_{deteksi} + t_{jadwal} + t_{restart} + t_{promosi}`,
      formulaNote: "RTO = recovery time objective, detik hingga layanan kembali (angka target, bukan janji); t_deteksi = waktu K8s menyadari node/pod mati (±30 detik); t_jadwal = waktu scheduler menempatkan pod pengganti (tergantung kapasitas & aturan anti-affinity); t_restart = waktu container + database menyala (±15 detik); t_promosi = waktu promosi replica menjadi primary (±20 detik, bila primary-nya yang mati). Di lab: 30 + 0 + 15 + 20 ≈ 50 detik — dengan satu pod yang bahkan tidak bisa dijadwalkan.",
      tasks: [],
      hints: [
        "💡 Intuisi: t_jadwal adalah komponen yang paling sering diremehkan. Scheduler K8s tidak menciptakan kapasitas — bila tidak ada node yang memenuhi syarat (CPU, memori, anti-affinity), pod menunggu selamanya dalam status Pending. RTO-mu = ∞ untuk pod itu.",
      ],
      reference: "StatefulSet = identitas stabil + PVC per pod + startup berurutan. RTO = deteksi + jadwal + restart + promosi.",
    },
    {
      id: "konsep-operator",
      eyebrow: "Langkah 4 · Konsep",
      title: "Operator — Si DBA Robot",
      prose: [
        "Definisi: operator adalah controller K8s kustom yang memahami SATU aplikasi secara mendalam. Polanya: CRD (Custom Resource Definition — “bahasa” deklaratif baru, mis. PostgresCluster) + control loop (perulangan: amati keadaan aktual → bandingkan dengan yang diinginkan → perbaiki). Operator Postgres (contoh: CloudNativePG, Crunchy, Zalando) tahu cara melakukan failover yang benar (promosikan replica paling segar, bukan yang acak), backup terjadwal ke object storage, dan rotasi sertifikat — hal-hal yang controller bawaan K8s tidak mengerti.",
        "Cara membaca chart di bawah: kotak atas (Operator DB) mengawasi tiga pod pg-0/pg-1/pg-2; tiap pod terikat ke PVC-nya sendiri (garis vertikal); garis putus-putus ke bawah adalah backup yang KELUAR dari cluster ke object storage. Interpretasi: perhatikan dua hal — (1) data tidak pernah “milik” pod, melainkan milik PVC; (2) backup tidak menyentuh PVC pod sama sekali, ia pergi ke tempat yang selamat bila cluster-nya sendiri mati.",
        "Kapan memakai operator vs StatefulSet manual: operator bila kamu menjalankan Postgres/Redis/MySQL produksi di K8s dan tidak ingin menulis ulang logika failover sendiri. StatefulSet manual cukup untuk dev/test. Yang tidak boleh: Deployment untuk database produksi — itu cerita pembuka lesson ini.",
      ],
      figure: {
        svg: K8S_SVG,
        alt: "Arsitektur database di Kubernetes: operator, StatefulSet tiga pod, PVC per pod, backup eksternal",
        caption: "Operator mengawasi cluster; tiap pod punya PVC sendiri; backup keluar dari cluster. Tiga lapisan pertahanan: identitas, persistensi, dan salinan eksternal.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: “pakai operator = tidak perlu paham database”",
        body: "Yang benar: operator mengotomasi prosedur, bukan pemahaman. Saat operator gagal (bug, edge case), yang dipanggil adalah DBA yang paham cara kerja replikasi — bukan yang hanya bisa kubectl apply. Operator memindahkan pekerjaanmu dari eksekusi ke pengawasan dan desain; ia tidak menghapus kebutuhan akan pemahaman.",
        type: "pitfall",
      },
      hints: [
        "💡 Intuisi: operator = runbook yang bisa jalan sendiri. Runbook yang buruk + otomasi = bencana yang berjalan sendiri. Uji failover operator-mu dengan chaos drill (matikan node sengaja) SEBELUM insiden asli datang.",
      ],
      reference: "Operator = CRD + control loop yang paham database (failover, backup). Uji dengan chaos drill.",
    },
    {
      id: "konsep-terraform",
      eyebrow: "Langkah 5 · Konsep",
      title: "Terraform — Si Cetak Biru",
      prose: [
        "Definisi: Terraform adalah tool Infrastructure as Code — infrastruktur ditulis sebagai file konfigurasi deklaratif (HCL), lalu perintah `plan` menunjukkan apa yang akan berubah dan `apply` mewujudkannya. State file mencatat keadaan aktual agar perubahan berikutnya bersifat incremental. Untuk DBA, Terraform relevan di dua tempat: (1) provisioning database managed (contoh: instance RDS, parameter group, subnet) — “database baru untuk staging” menjadi pull request, bukan tiket; (2) fondasi K8s-nya database (node pool, storage class).",
        "Contoh pola (konseptual, bukan untuk di-copy mentah): resource `aws_db_instance` dengan `engine = \"postgres\"`, `instance_class`, `allocated_storage`, `backup_retention_period = 7`, dan `multi_az = true` — lima baris ini MENDOKUMENTASIKAN keputusan arsitektur yang dulu hanya ada di kepala senior DBA. Inilah nilai sebenarnya: bukan otomasi klik, melainkan keputusan yang bisa di-review.",
        "Tiga jebakan Terraform untuk DBA: (1) state file adalah nyawa — hilang/rusak = Terraform buta terhadap infrastruktur yang ia kelola (simpan di remote backend terkunci, bukan laptop); (2) drift — seseorang mengubah via console, state tidak tahu → `plan` berikutnya bisa menghancurkan perubahan manual itu; (3) secret di file konfigurasi — password database tidak boleh plaintext di repo (pakai secret manager).",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “IaC = otomasi, jadi lebih cepat”",
        body: "Yang benar: kecepatan adalah efek samping. Nilai utama IaC adalah keputusan yang terdokumentasi, bisa di-review, dan bisa diulang identik. Tim yang memakai Terraform hanya untuk “lebih cepat” tanpa review process akan memproduksi kesalahan yang lebih cepat juga — misconfig yang ter-apply ke 10 environment dalam 2 menit.",
        type: "pitfall",
      },
      hints: [
        "💡 Intuisi: perlakukan file Terraform seperti kode aplikasi: pull request, review dua orang, dan pipeline. Database yang di-provision tanpa review = schema change tanpa review — hanya skalanya infrastruktur.",
      ],
      reference: "Terraform: plan → review → apply. State = nyawa (remote backend). Secret = secret manager, bukan repo.",
    },
    {
      id: "lab-failover",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Simulasi penjadwalan pod dan failover",
      prose: [
        "Waktunya menjadi scheduler K8s. Cluster SINTETIS: 3 node (n1/n2/n3) dan 4 pod (pg-primary, 2 replica, redis) dengan aturan anti-affinity — dua pod se-grup tidak boleh satu node. Tugasmu: lengkapi `muat` (cek kapasitas), `langgar_anti` (cek aturan), dan loop pemilihan node di `jadwalkan`. Lalu driver mensimulasikan node n1 mati: pod terdampak dijadwalkan ulang, replica dipromosikan bila primary tak bisa dijadwalkan.",
        "Coba: setelah lolos, ubah memori n3 dari 16 menjadi 4 dan jalankan ulang — apa yang berubah pada pod pending? Lalu kembalikan. Perhatikan: scheduler tidak menciptakan kapasitas; ia hanya menempatkan yang muat.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `muat`: True bila cpu DAN mem sisa cukup untuk pod" },
        { id: "t2", text: "Lengkapi `langgar_anti`: True bila ada pod se-grup di node itu" },
        { id: "t3", text: "Lengkapi loop di `jadwalkan`: pilih node pertama yang muat dan tidak melanggar anti-affinity" },
        { id: "t4", text: "Jalankan dan pastikan “Waktu pulih layanan: 50 dtk” tercetak" },
      ],
      expected: "Penjadwalan awal: pg-primary->n1, pg-replica-1->n2, pg-replica-2->n3, redis->n1\nNode n1 GAGAL. Pod terdampak: pg-primary, redis\nredis -> n2 (restart 15 dtk)\npg-replica-1 DIPROMOSIKAN menjadi primary (20 dtk)\npg-primary BARU: PENDING (anti-affinity)\nWaktu pulih layanan: 50 dtk | Pod pending: 1",
      code: {
        starter: `# Lab DBA23 — data SINTETIS, bukan cluster sungguhan
node = [  # JANGAN UBAH
    {"nama": "n1", "cpu": 8, "mem": 32},
    {"nama": "n2", "cpu": 8, "mem": 32},
    {"nama": "n3", "cpu": 4, "mem": 16},
]
pod = [  # JANGAN UBAH
    {"nama": "pg-primary", "cpu": 2, "mem": 8, "anti": "pg"},
    {"nama": "pg-replica-1", "cpu": 2, "mem": 8, "anti": "pg"},
    {"nama": "pg-replica-2", "cpu": 2, "mem": 8, "anti": "pg"},
    {"nama": "redis", "cpu": 1, "mem": 4, "anti": "redis"},
]

def muat(sisa_n, p):
    # TODO t1: True bila cpu dan mem sisa cukup untuk p
    return False

def langgar_anti(penempatan, nama_node, p):
    # TODO t2: True bila ada pod se-grup anti-affinity di node itu
    return False

def jadwalkan(nodes, pods, penempatan_awal=()):
    sisa = {n["nama"]: {"cpu": n["cpu"], "mem": n["mem"]} for n in nodes}
    for q in penempatan_awal:
        sisa[q["node"]]["cpu"] -= q["cpu"]
        sisa[q["node"]]["mem"] -= q["mem"]
    penempatan, pending = list(penempatan_awal), []
    for p in pods:
        taruh = None
        for n in nodes:
            # TODO t3: isi kondisi - pilih node bila muat DAN tidak langgar anti-affinity
            if False:
                taruh = n["nama"]
                break
        if taruh:
            sisa[taruh]["cpu"] -= p["cpu"]
            sisa[taruh]["mem"] -= p["mem"]
            penempatan.append({"pod": p["nama"], "node": taruh, "anti": p["anti"], "cpu": p["cpu"], "mem": p["mem"]})
        else:
            pending.append(p["nama"])
    return penempatan, pending

# --- driver: JANGAN UBAH di bawah ini ---
awal, _ = jadwalkan(node, pod)
print("Penjadwalan awal: " + ", ".join("%s->%s" % (q["pod"], q["node"]) for q in awal))
selamat = [n for n in node if n["nama"] != "n1"]
terdampak = [q["pod"] for q in awal if q["node"] == "n1"]
tetap = [q for q in awal if q["node"] != "n1"]
print("Node n1 GAGAL. Pod terdampak: " + ", ".join(terdampak))
peta_pod = {p["nama"]: p for p in pod}
ulang, pending = jadwalkan(selamat, [peta_pod[nm] for nm in terdampak], tetap)
waktu_pulih = 30
for nm in terdampak:
    if nm in pending:
        continue
    dest = [q["node"] for q in ulang if q["pod"] == nm][0]
    print("%s -> %s (restart 15 dtk)" % (nm, dest))
    waktu_pulih = max(waktu_pulih, 45)
if "pg-primary" in pending:
    print("pg-replica-1 DIPROMOSIKAN menjadi primary (20 dtk)")
    waktu_pulih = max(waktu_pulih, 50)
    print("pg-primary BARU: PENDING (anti-affinity)")
print("Waktu pulih layanan: %d dtk | Pod pending: %d" % (waktu_pulih, len(pending)))`,
        lockLines: 12,
        solution: `# Lab DBA23 — data SINTETIS, bukan cluster sungguhan
node = [  # JANGAN UBAH
    {"nama": "n1", "cpu": 8, "mem": 32},
    {"nama": "n2", "cpu": 8, "mem": 32},
    {"nama": "n3", "cpu": 4, "mem": 16},
]
pod = [  # JANGAN UBAH
    {"nama": "pg-primary", "cpu": 2, "mem": 8, "anti": "pg"},
    {"nama": "pg-replica-1", "cpu": 2, "mem": 8, "anti": "pg"},
    {"nama": "pg-replica-2", "cpu": 2, "mem": 8, "anti": "pg"},
    {"nama": "redis", "cpu": 1, "mem": 4, "anti": "redis"},
]

def muat(sisa_n, p):
    return sisa_n["cpu"] >= p["cpu"] and sisa_n["mem"] >= p["mem"]

def langgar_anti(penempatan, nama_node, p):
    for q in penempatan:
        if q["node"] == nama_node and q["anti"] == p["anti"]:
            return True
    return False

def jadwalkan(nodes, pods, penempatan_awal=()):
    sisa = {n["nama"]: {"cpu": n["cpu"], "mem": n["mem"]} for n in nodes}
    for q in penempatan_awal:
        sisa[q["node"]]["cpu"] -= q["cpu"]
        sisa[q["node"]]["mem"] -= q["mem"]
    penempatan, pending = list(penempatan_awal), []
    for p in pods:
        taruh = None
        for n in nodes:
            if muat(sisa[n["nama"]], p) and not langgar_anti(penempatan, n["nama"], p):
                taruh = n["nama"]
                break
        if taruh:
            sisa[taruh]["cpu"] -= p["cpu"]
            sisa[taruh]["mem"] -= p["mem"]
            penempatan.append({"pod": p["nama"], "node": taruh, "anti": p["anti"], "cpu": p["cpu"], "mem": p["mem"]})
        else:
            pending.append(p["nama"])
    return penempatan, pending

# --- driver: JANGAN UBAH di bawah ini ---
awal, _ = jadwalkan(node, pod)
print("Penjadwalan awal: " + ", ".join("%s->%s" % (q["pod"], q["node"]) for q in awal))
selamat = [n for n in node if n["nama"] != "n1"]
terdampak = [q["pod"] for q in awal if q["node"] == "n1"]
tetap = [q for q in awal if q["node"] != "n1"]
print("Node n1 GAGAL. Pod terdampak: " + ", ".join(terdampak))
peta_pod = {p["nama"]: p for p in pod}
ulang, pending = jadwalkan(selamat, [peta_pod[nm] for nm in terdampak], tetap)
waktu_pulih = 30
for nm in terdampak:
    if nm in pending:
        continue
    dest = [q["node"] for q in ulang if q["pod"] == nm][0]
    print("%s -> %s (restart 15 dtk)" % (nm, dest))
    waktu_pulih = max(waktu_pulih, 45)
if "pg-primary" in pending:
    print("pg-replica-1 DIPROMOSIKAN menjadi primary (20 dtk)")
    waktu_pulih = max(waktu_pulih, 50)
    print("pg-primary BARU: PENDING (anti-affinity)")
print("Waktu pulih layanan: %d dtk | Pod pending: %d" % (waktu_pulih, len(pending)))`,
        checks: [
          { kind: "equal", task: "t4", name: "waktu_pulih", value: 50, label: "`waktu_pulih` = 50 detik", msg: "30 deteksi + 20 promosi (restart redis 15 dtk tertutup olehnya)." },
          { kind: "equal", task: "t4", name: "pending", value: ["pg-primary"], label: "`pending` = [pg-primary]", msg: "Primary baru tak dapat node karena anti-affinity." },
          { kind: "stdout_matches", task: "t4", pattern: "DIPROMOSIKAN menjadi primary", label: "Promosi tercetak", msg: "Baris promosi replica harus tercetak." },
          { kind: "stdout_matches", task: "t4", pattern: "Waktu pulih layanan: 50 dtk", label: "RTO tercetak", msg: "Baris terakhir: waktu pulih 50 dtk." },
          { kind: "stdout_matches", task: "t4", pattern: "Pod pending: 1", label: "Pod pending tercetak", msg: "Satu pod tidak terjadwal." },
        ],
      },
      reference: "Scheduler menempatkan yang muat + taat anti-affinity; RTO = 30 + 15 + 20 = 50 dtk dengan 1 pod pending.",
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Empat jebakan K8s untuk database",
      prose: [
        "Jebakan 1 — storage lokal di cluster multi-node. Pod database memakai hostPath/local volume di n1; pod di-reschedule ke n2 dan datanya “hilang” (sebenarnya tertinggal di disk n1). Aturan: database di K8s wajib network storage (EBS, Ceph, dsb.) — local storage hanya untuk cache.",
        "Jebakan 2 — resource limit terlalu ketat. Limit memori dipasang rendah “agar efisien”; saat Postgres checkpoint, OOMKilled, restart, recovery, checkpoint lagi — siklus kematian. Aturan: limit memori database = request + headroom 20–30%, dan monitor OOM event seperti kamu monitor error log.",
        "Jebakan 3 — backup yang tidak pernah di-restore-test. CronJob backup hijau tiap malam selama setahun; saat dibutuhkan, ternyata backup korup sejak 4 bulan lalu (tidak ada yang pernah me-restore-nya). Aturan: restore test terjadwal adalah bagian dari backup — backup yang belum pernah di-restore = harapan, bukan rencana.",
        "Jebakan 4 — upgrade operator tanpa baca changelog. Operator baru mengubah default failover; cluster yang sehat tiba-tiba berperilaku beda setelah upgrade. Aturan: perlakukan operator seperti database itu sendiri — baca changelog, uji di staging, baru rolling ke produksi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “platform yang mengelola container = platform yang mengelola data”",
        body: "Yang benar: K8s mengelola SIKLUS HIDUP container (jadwal, restart, scaling) — ia tidak memahami SEMANTIK data (konsistensi, replikasi, backup). Semantik data tetap tanggung jawab lapisan database (operator/DBA). Menyerahkan keduanya ke “platform” adalah cara tercepat kehilangan keduanya saat insiden.",
        type: "pitfall",
      },
      reference: "Network storage; headroom memori; restore test; baca changelog operator.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan platform database",
      prose: [
        "Skenario 1 — Butuh Postgres/MySQL produksi tanpa tim platform K8s: managed database (RDS, Cloud SQL, Azure Database) — orang lain yang mengurus failover dan backup.",
        "Skenario 2 — Sudah punya cluster K8s matang + butuh kontrol penuh: StatefulSet + operator (CloudNativePG/dsb.) + backup ke object storage + chaos drill failover.",
        "Skenario 3 — Dev/test atau beban ringan: StatefulSet manual tanpa operator — cukup, jangan over-engineering.",
        "Skenario 4 — Provisioning dan perubahan infrastruktur: Terraform dengan remote backend + review pull request — untuk managed DB maupun fondasi K8s.",
        "Aturan praktis 10 detik: (1) Database produksi tidak pernah di Deployment. (2) Backup harus keluar dari cluster. (3) Tulis RTO dalam detik dari komponennya, bukan “cepat”. (4) Uji failover sebelum insiden mengujimu.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "RTO 50 detik: cukup atau tidak?",
      prose: [
        "E-commerce memproses rata-rata 40 order per menit di jam sibuk; rata-rata nilai order Rp350 ribu. Hasil lab: RTO 50 detik dengan 1 pod pending (kapasitas baca berkurang sampai pod ketiga kembali). Pertanyaan: (1) Berapa perkiraan nilai transaksi yang tertahan selama 50 detik outage tulis? (2) Bila pod pending membuat 1 dari 3 replica hilang selama 10 menit, apa risiko tambahannya? (3) Keputusan arsitektur apa yang menurunkan RTO di bawah 20 detik?",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "(1) 40/60 × 50 ≈ 33 order × Rp350 ribu ≈ Rp11,7 juta tertahan (bukan hilang — antre, tetapi checkout gagal = churn). (2) Kehilangan satu replica = margin failover berikutnya hilang; bila satu node lagi mati dalam 10 menit itu, tidak ada yang bisa dipromosikan — risiko outage penuh. Pod pending bukan “nanti saja”, ia adalah utang ketersediaan. (3) Opsi: node cadangan hangat (spare capacity) agar pod langsung terjadwal; atau managed database dengan failover bawaan < 20 detik. Pelajarannya: RTO bukan angka hiasan — ia dikalikan order per detik menjadi rupiah.",
        type: "risk",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      summary: [
        "Database di K8s wajib StatefulSet (identitas stabil + PVC per pod + startup berurutan) — bukan Deployment.",
        "Operator = runbook yang jalan sendiri (CRD + control loop); ia mengotomasi prosedur, bukan menggantikan pemahaman DBA.",
        "RTO = t_deteksi + t_jadwal + t_restart + t_promosi; t_jadwal bisa ∞ bila tak ada node yang memenuhi syarat.",
        "Backup harus keluar dari cluster dan pernah di-restore-test — cron hijau bukan bukti.",
        "Terraform: plan → review → apply; state di remote backend; secret di secret manager.",
        "Keputusan platform: managed DB tanpa tim platform; operator bila butuh kontrol; jangan over-engineering untuk dev.",
      ],
      next: { label: "DBA24 — ETL sebagai Kompetensi DBA", href: "/learn/dba24-etl-untuk-dba" },
      quiz: [
        {
          q: "Pod Postgres di Deployment di-evict dan datanya hilang. Akar masalahnya?",
          options: [
            { text: "Kubernetes tidak cocok untuk database sama sekali", why: "Salah: yang salah adalah controller-nya, bukan platformnya.", correct: false },
            { text: "Deployment tidak memberi identitas stabil dan storage persistent — pod baru adalah orang asing tanpa data", why: "Benar: butuh StatefulSet + PVC.", correct: true },
            { text: "Node-nya kurang besar", why: "Salah: node besar tidak menyelamatkan data di emptyDir.", correct: false },
            { text: "Replika terlalu sedikit", why: "Salah: replika Deployment tanpa PVC ikut kehilangan data dengan cara yang sama.", correct: false },
          ],
        },
        {
          q: "CronJob backup database menulis ke volume yang sama dengan data. Penilaianmu?",
          options: [
            { text: "Sudah benar — backup otomatis tiap jam", why: "Salah: fotokopi yang ikut terbakar bukan backup.", correct: false },
            { text: "Bukan backup yang sebenarnya: ia hilang bersama data saat node/volume mati — harus ke object storage eksternal dan pernah di-restore-test", why: "Benar: backup = salinan di tempat yang selamat dari kegagalan yang sama.", correct: true },
            { text: "Cukup — jarang ada kebakaran data center", why: "Salah: node mati jauh lebih sering dari kebakaran.", correct: false },
            { text: "Yang penting frekuensinya, bukan lokasinya", why: "Salah: backup tiap menit di tempat yang sama tetap hilang bersama.", correct: false },
          ],
        },
        {
          q: "Dalam lab, mengapa pg-primary baru berstatus PENDING?",
          options: [
            { text: "CPU cluster tidak cukup", why: "Salah: kapasitas total cukup — masalahnya aturan penempatan.", correct: false },
            { text: "Anti-affinity: semua node yang selamat sudah dihuni anggota grup pg", why: "Benar: scheduler taat aturan meski kapasitas ada — Pending adalah keputusan yang benar.", correct: true },
            { text: "Scheduler K8s sedang error", why: "Salah: scheduler bekerja persis sesuai aturan yang diberikan.", correct: false },
            { text: "pg-primary tidak diikutkan penjadwalan ulang", why: "Salah: ia ada di daftar terdampak dan dicoba dijadwalkan.", correct: false },
          ],
        },
        {
          q: "RTO hasil lab 50 detik. Komponen terbesarnya?",
          options: [
            { text: "Restart pod 15 detik", why: "Salah: 15 < 30.", correct: false },
            { text: "Deteksi kegagalan 30 detik — hampir dua pertiga RTO", why: "Benar: mempercepat deteksi (health check agresif) adalah tuas RTO termurah.", correct: true },
            { text: "Penjadwalan ulang", why: "Salah: dalam skenario ini 0 detik (langsung dapat node).", correct: false },
            { text: "Promosi replica 20 detik", why: "Salah: 20 < 30.", correct: false },
          ],
        },
        {
          q: "Seseorang mengubah instance database via console, bukan Terraform. Bahayanya?",
          options: [
            { text: "Tidak ada — yang penting hasilnya benar", why: "Salah: state Terraform kini buta terhadap perubahan itu.", correct: false },
            { text: "Drift: perubahan manual bisa dihancurkan apply berikutnya, dan audit kehilangan jejak siapa mengubah apa", why: "Benar: IaC hanya bekerja bila ia satu-satunya penulis.", correct: true },
            { text: "Console lebih aman dari Terraform", why: "Salah: console tidak punya review, versioning, dan jejak yang sama.", correct: false },
            { text: "Terraform otomatis mendeteksi dan mengadopsi", why: "Salah: ia mendeteksi drift, tetapi resolusinya bisa menimpa perubahan manual.", correct: false },
          ],
        },
        {
          q: "Tim kecil tanpa platform K8s butuh Postgres produksi. Rekomendasi?",
          options: [
            { text: "Bangun cluster K8s + operator agar modern", why: "Salah: mengoperasikan K8s tanpa tim platform = memindahkan risiko, bukan menghilangkannya.", correct: false },
            { text: "Managed database (RDS/Cloud SQL) — failover dan backup diurus penyedia; fokus tim ke aplikasi", why: "Benar: pilih beban operasional yang sesuai dengan tim yang ada.", correct: true },
            { text: "Postgres di laptop yang selalu menyala", why: "Salah: bukan strategi ketersediaan.", correct: false },
            { text: "Deployment satu replika di K8s gratisan", why: "Salah: itu cerita pembuka lesson ini.", correct: false },
          ],
        },
      ],
    },
  ],
};
