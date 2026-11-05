// Portfolio Generator (Gelombang K — ide #4).
// Semua konten diekstrak dari file proyek yang sudah ada via pfData.json
// (scripts/gen-pf-data.mjs). Tidak ada backend, tidak ada penulisan ulang
// narasi: setiap bagian menampilkan sumber langkahnya. rr19 hanya dibaca.

import pf from "./pfData.json";

export interface PfCheck {
  label: string;
  value: unknown;
  tol: number | null;
  msg: string | null;
}

export interface PfStepNote {
  title: string;
  body: string;
  type: string;
}

export interface PfStep {
  id: string;
  eyebrow: string;
  title: string;
  prose: string[];
  tasks: string[];
  expected: string | null;
  note: PfStepNote | null;
  checks: PfCheck[];
  impostor: boolean;
}

export interface PfProject {
  slug: string;
  title: string;
  track: string;
  module: string;
  estMinutes: number;
  role: string;
  client: string;
  tagline: string;
  skills: string[];
  deliverable: string;
  steps: PfStep[];
}

const data = pf as unknown as { projects: PfProject[] };

/** Urutan kanonis 7 proyek flagship di halaman indeks. */
export const PF_ORDER = [
  "pj-audit-portofolio",
  "pj-scorecard-kredit",
  "pj-aml-monitoring",
  "pj-ips-portofolio",
  "pj-dbd-surveilans",
  "pj-vcf-varian",
  "rr19-audit-impostor",
];

export const PF_MAP: Record<string, PfProject> = {};
for (const p of data.projects) PF_MAP[p.slug] = p;
export const PF_LIST: PfProject[] = PF_ORDER.map((s) => PF_MAP[s]).filter(Boolean);

export function getPfProject(slug: string): PfProject | undefined {
  return PF_MAP[slug];
}

export type PfMode = "executive" | "deepdive";

export interface PfSectionDef {
  id: string;
  title: string;
  mode: PfMode;
  desc: string;
}

export const PF_SECTIONS: PfSectionDef[] = [
  { id: "ex-masalah", title: "Masalah", mode: "executive", desc: "Konteks & masalah yang dipecahkan proyek." },
  { id: "ex-pendekatan", title: "Pendekatan", mode: "executive", desc: "Skill yang dilatih & alur langkah proyek." },
  { id: "ex-hasil", title: "Hasil utama", mode: "executive", desc: "Angka kunci (ground truth) dari konten proyek." },
  { id: "ex-keterbatasan", title: "Keterbatasan", mode: "executive", desc: "Catatan risiko/jebakan dari konten proyek." },
  { id: "dd-langkah", title: "Langkah-langkah", mode: "deepdive", desc: "Seluruh langkah proyek + tugasnya." },
  { id: "dd-desain", title: "Keputusan desain", mode: "deepdive", desc: "Catatan keputusan dari konten proyek." },
  { id: "dd-groundtruth", title: "Ground truth", mode: "deepdive", desc: "Semua expected value + toleransinya." },
  { id: "dd-impostor", title: "Temuan impostor", mode: "deepdive", desc: "Langkah audit/debrief & suntikan impostor." },
];

const SECTION_IDS = new Set(PF_SECTIONS.map((s) => s.id));

/** Versi skema URL bagikan. Naikkan bila format berubah; parser lama tetap
 *  membuka tautan lama karena id yang tak dikenal diabaikan. */
export const PF_SHARE_VERSION = "1";

export const PF_REDACT_KEY = (slug: string) => `v2:pf:redact:${slug}`;

/** Parse query string mode bagikan → daftar id bagian tersembunyi (tervalidasi). */
export function parseShareHidden(search: string): string[] {
  const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const hide = (q.get("hide") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => SECTION_IDS.has(s));
  return [...new Set(hide)];
}

/** Bangun query string tautan bagikan: ?v=1[&hide=id,id]. */
export function buildShareQuery(hidden: string[]): string {
  const valid = [...new Set(hidden.filter((s) => SECTION_IDS.has(s)))];
  return valid.length > 0
    ? `?v=${PF_SHARE_VERSION}&hide=${valid.join(",")}`
    : `?v=${PF_SHARE_VERSION}`;
}

export function formatCheckValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "number") return String(v);
  return String(v);
}
