// v2 content model — pragmatic implementation of DESIGN.md §10.
// Steps are authored as TypeScript data (no full Markdown parser in this phase).

export type CheckKind =
  | "defined"
  | "equal"
  | "contains"
  | "stdout_matches"
  | "uses"
  | "forbids";

export interface V2Check {
  kind: CheckKind;
  /** checklist task id this check ticks */
  task: string;
  /** short human label shown in the feedback list */
  label: string;
  /** variable name (defined/equal/contains) */
  name?: string;
  /** expected value (equal/contains) */
  value?: unknown;
  /** numeric tolerance (equal) */
  tol?: number;
  /** regex source (stdout_matches) */
  pattern?: string;
  /** AST token name (uses/forbids) */
  token?: string;
  /** "where to look" sentence shown on failure (§7.3) */
  msg: string;
}

export interface V2QuizOption {
  text: string;
  why: string;
  correct?: boolean;
}

export interface V2QuizItem {
  q: string;
  options: V2QuizOption[];
}

export interface V2StepTask {
  id: string;
  /** may contain `inline code` markup */
  text: string;
}

// ── Impostor audit (fitur flagship pilot 2026-10-14) ─────────────────────
// Satu klaim dalam dossier paket audit. `injected: true` = suntikan impostor
// (disembunyikan dari pelajar sampai debrief dibuka).
export interface ImpostorClaim {
  label: string;
  value: string;
  injected?: boolean;
}

// Satu baris dossier = satu hasil simulasi alpha dari snapshot Turso.
export interface ImpostorRow {
  /** id baris dossier (unik dalam paket; boleh beda dari id sim bila duplikat terselubung) */
  rowId: number;
  /** id simulasi asli di brain_sims */
  simId: number;
  family: string;
  sharpe: number;
  fitness: number;
  /** turnover sebagai fraksi, mis. 0.6297 */
  turnover: number;
  decay: number;
  region: string;
  status: string;
  claims: ImpostorClaim[];
}

// Satu suntikan impostor: deterministik per versi pilot.
export interface ImpostorInjection {
  key: string;
  /** rowId yang terdampak */
  rowIds: number[];
  title: string;
  /** petunjuk apa yang harus diperhatikan pelajar */
  clue: string;
  /** kenapa ini berbahaya di pekerjaan risiko nyata */
  danger: string;
}

export interface ImpostorAuditSpec {
  version: string;
  snapshotDate: string;
  rows: ImpostorRow[];
  injections: ImpostorInjection[];
}

// ── Lab SQL in-browser (sql.js; ITEM 3 program upgrade 2026-10-14) ───────
// Penilaian = bandingkan himpunan baris hasil query vs expectedRows
// (toleran urutan kecuali orderMatters; numerik pakai floatTol).
export interface SqlLabSpec {
  /** deskripsi tugas, tampil di atas editor */
  task: string;
  /** DDL (CREATE TABLE …) — ditampilkan sebagai referensi skema */
  schema: string;
  /** INSERT deterministik; dieksekusi sekali saat DB dibuat */
  seedData: string;
  /** isi awal editor SQL */
  starter: string;
  /** solusi referensi (tampil setelah 2 percobaan gagal) */
  solution: string;
  /** nama kolom yang diharapkan, berurutan */
  expectedColumns: string[];
  /** baris yang diharapkan: number | string | null */
  expectedRows: unknown[][];
  /** true = urutan baris ikut dinilai; default false */
  orderMatters?: boolean;
  /** toleransi absolut perbandingan numerik; default 1e-6 */
  floatTol?: number;
}

// ── ECharts figure (ITEM 4 program upgrade 2026-10-14) ──────────────────
export interface EChartSpec {
  /** ECharts option (series, xAxis, …) — dirender EChartFigure */
  option: unknown;
  /** caption di bawah chart */
  caption?: string;
}

// ── Misi (fitur proyek terpadu; pilot 2026-10-15) ─────────────────────────
// Langkah briefing: cerita pembuka + peran + klien + tujuan terukur +
// ringkasan prasyarat (F2: self-contained, bukan rujukan ke lesson lain).
export interface MissionBriefingSpec {
  /** paragraf cerita pembuka (F6) */
  story: string[];
  /** peran pelajar, mis. "Epidemiolog/auditor data Dinas Kesehatan" */
  role: string;
  /** siapa yang memberi tugas + stakes-nya */
  client: string;
  /** tujuan terukur */
  objectives: string[];
  /** ringkasan prasyarat 2–3 kalimat (F2) */
  prereqSummary: string;
  /** catatan dataset: sumber, lisensi, metode sampling, peringatan "data kotor disengaja" */
  datasetNote: string;
}

// ── Checkpoint keputusan bercabang ──────────────────────────────────────
export interface DecisionOption {
  id: string;
  label: string;
  /** alasan yang disajikan ke pelajar sebelum memilih */
  rationale: string;
  /** id langkah yang dibuka bila opsi ini dipilih (dalam misi yang sama) */
  nextStepId: string;
  /** konsekuensi yang terungkap SETELAH memilih (dinilai kualitas keputusannya) */
  consequenceNote: string;
}
export interface DecisionSpec {
  prompt: string;
  options: DecisionOption[];
}

// ── Deliverable akhir ber-rubrik ────────────────────────────────────────
export interface RubricCriterion {
  criterion: string;
  /** bobot persen, total = 100 */
  weight: number;
  /** deskripsi tiap level, mis. ["Belum ada", "Sebagian", "Lengkap & beralasan"] */
  levels: string[];
}
export interface DeliverableSpec {
  /** template draf yang diisi pelajar (paragraf panduan) */
  template: string[];
  rubric: RubricCriterion[];
}

// ── Dossier audit generik (generalisasi pola ImpostorAudit rr19) ─────────
// Baris tabular apa pun: cells = kolom → nilai string tampilan.
export interface AuditDossierRow {
  rowId: number;
  cells: Record<string, string>;
  claims: ImpostorClaim[];
}
export interface AuditDossierSpec {
  version: string;
  snapshotDate: string;
  /** teks pembuka misi audit (dossier diklaim berisi apa) */
  intro: string;
  /** header kolom tabel, berurutan */
  columns: string[];
  rows: AuditDossierRow[];
  injections: ImpostorInjection[];
}

export interface V2Step {
  id: string;
  eyebrow: string;
  /** Spesifikasi misi audit impostor; bila ada, Workspace me-render komponen ImpostorAudit. */
  impostor?: ImpostorAuditSpec;
  /** Pyodide package names to preload via loadPackage (DESIGN.md §11), e.g. ["pandas"] */
  requires?: string[];
  title: string;
  /** paragraphs; supports `code` inline markup */
  prose: string[];
  /** KaTeX source, display mode */
  formula?: string;
  formulaNote?: string;
  figure?: { svg: string; alt: string; caption: string };
  tasks: V2StepTask[];
  expected?: string;
  note?: { title: string; body: string; type?: "pitfall" | "risk" };
  hints?: string[];
  code?: {
    /** full starter; first `lockLines` lines are read-only */
    starter: string;
    lockLines: number;
    solution: string;
    checks: V2Check[];
  };
  /** Lab SQL in-browser (sql.js). Bila ada, Workspace me-render SqlLab. */
  sqlLab?: SqlLabSpec;
  /** ECharts figure; bila ada, Workspace me-render EChartFigure di panel instruksi. */
  echart?: EChartSpec;
  /** override langkah berikutnya (dipakai langkah cabang misi agar kembali ke alur utama) */
  goto?: string;
  quiz?: V2QuizItem[];
  summary?: string[];
  next?: { label: string; href: string };
  reference?: string;
  /* ── pilot practice-loop (2026-10-30; aditif) ── */
  /** "guided" (default) = latihan terpandu; "independent" = tanpa "Hasil yang
      diharapkan" di muka dan label cek disamarkan sampai lolos. */
  mode?: "guided" | "independent";
  /** "lesson" (default) atau "transfer" — transfer check: solusi terkunci
      sampai lolos; kelulusan pertama menandai lesson "Dikuasai". */
  kind?: "lesson" | "transfer";
  /** Nama variabel target yang tidak boleh di-hardcode angkanya. */
  noLiteral?: string[];
  /* ── field misi (pilot 2026-10-15; aditif, tidak mengubah lesson) ── */
  /** Briefing misi: peran + klien + cerita + ringkasan prasyarat */
  briefing?: MissionBriefingSpec;
  /** Checkpoint keputusan bercabang */
  decision?: DecisionSpec;
  /** Deliverable akhir ber-rubrik */
  deliverable?: DeliverableSpec;
  /** Dossier audit generik untuk suntikan impostor */
  auditDossier?: AuditDossierSpec;
}

export interface V2Lesson {
  slug: string;
  track: string;
  module: string;
  title: string;
  estMinutes: number;
  steps: V2Step[];
  /** Pilot practice-loop (2026-10-30; aditif): tampilkan panel pilihan
      "Mulai dari penjelasan" / "Langsung coba" di pembuka lesson. */
  tryFirst?: boolean;
}

/* ── Misi: V2Lesson + metadata misi (pilot 2026-10-15) ───────────────────
   V2Mission tetap assignable ke V2Lesson sehingga Workspace lesson
   bisa me-render misi tanpa perubahan breaking. */
export interface V2Mission extends V2Lesson {
  module: "Misi";
  /** peran pelajar, tampil di galeri */
  role: string;
  /** narasi klien satu baris, tampil di galeri */
  client: string;
  /** XP yang didapat saat misi selesai */
  xp: number;
}
