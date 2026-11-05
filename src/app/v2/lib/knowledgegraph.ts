// Knowledge Graph Navigator — mesin graf ringan (Gelombang J, ide #42).
// Semua relasi dihitung dari data nyata: registry lesson (via kgData.json),
// jalur belajar (paths.ts), dan registry proyek (reg-proyek.ts). TIDAK ada
// relasi yang dikarang — setiap edge menyimpan alasannya agar bisa diaudit.
// Murni client-side; tidak ada backend maupun skema DB baru.

import kg from "./kgData.json";

export type KgNodeKind = "lesson" | "track" | "jalur" | "proyek" | "akar";

export interface KgNode {
  id: string; // lesson:<slug> | track:<nama> | jalur:<id> | proyek:<slug>
  kind: KgNodeKind;
  label: string;
  sub?: string; // konteks tambahan (track lesson, dst.)
  href: string;
}

export interface KgEdge {
  from: string;
  to: string;
  kind: "anggota" | "urutan" | "jalur" | "proyek";
  reason: string; // alasan relasi — SELALU ditampilkan di UI
}

type KgData = {
  lessons: Record<string, { t: string; tr: string }>;
  trackOrder: Record<string, string[]>;
  paths: { id: string; name: string; desc: string; tracks: string[] }[];
  proyek: { slug: string; t: string; tr: string; trDeclared: string; skills: string[] }[];
};

const D = kg as unknown as KgData;

export const FOUNDATION_TRACKS = new Set(["Statistika", "Probabilitas", "SQL", "Python"]);
// sama dengan definisi di src/app/v2/learn/page.tsx

function hrefFor(kind: KgNodeKind, ref: string): string {
  if (kind === "lesson") return `/v2/learn/${ref}`;
  if (kind === "proyek") return `/v2/proyek/${ref}`;
  if (kind === "jalur") return "/v2/mulai";
  if (kind === "akar") return "/v2/learn";
  return "/v2/learn";
}

const NODES = new Map<string, KgNode>();
const EDGES: KgEdge[] = [];
const ADJ = new Map<string, { edge: KgEdge; to: string }[]>();
const DIR = new Map<string, { edge: KgEdge; to: string }[]>(); // directed (untuk fan-out)

function addNode(id: string, kind: KgNodeKind, label: string, sub: string | undefined, href: string) {
  NODES.set(id, { id, kind, label, sub, href });
}

function addEdge(from: string, to: string, kind: KgEdge["kind"], reason: string) {
  const e: KgEdge = { from, to, kind, reason };
  EDGES.push(e);
  const push = (m: Map<string, { edge: KgEdge; to: string }[]>, a: string, b: string) => {
    const arr = m.get(a) ?? [];
    arr.push({ edge: e, to: b });
    m.set(a, arr);
  };
  // BFS jembatan memakai adjacency tak-berarah; analisis fan-out memakai berarah.
  push(ADJ, from, to);
  push(ADJ, to, from);
  push(DIR, from, to);
}

function build() {
  const lessonTitle = (slug: string) => D.lessons[slug]?.t ?? slug;
  // node akar: kurikulum — menjamin graf terhubung antar track peran yang
  // tidak tercakup jalur mana pun (relasi nyata: semua track bagian kurikulum)
  addNode("akar:kurikulum", "akar", "Kurikulum Learn v2", "25 track · 749 lesson", hrefFor("akar", ""));
  // node track (+ edge ke akar)
  for (const tr of Object.keys(D.trackOrder)) {
    addNode(`track:${tr}`, "track", tr, `${D.trackOrder[tr].length} lesson`, hrefFor("track", tr));
    addEdge(
      `track:${tr}`,
      "akar:kurikulum",
      "anggota",
      `Track ${tr} adalah bagian dari kurikulum Learn v2 (sumber: registry lesson).`,
    );
  }
  // node jalur
  for (const p of D.paths) {
    addNode(`jalur:${p.id}`, "jalur", p.name, p.desc, hrefFor("jalur", p.id));
  }
  // node proyek
  for (const p of D.proyek) {
    addNode(
      `proyek:${p.slug}`,
      "proyek",
      p.t,
      `Melatih: ${p.skills.slice(0, 3).join(" · ")}${p.skills.length > 3 ? "…" : ""}`,
      hrefFor("proyek", p.slug),
    );
  }
  // node lesson + edge lesson→track
  for (const [slug, l] of Object.entries(D.lessons)) {
    addNode(`lesson:${slug}`, "lesson", l.t, `Track ${l.tr}`, hrefFor("lesson", slug));
    addEdge(
      `lesson:${slug}`,
      `track:${l.tr}`,
      "anggota",
      `«${l.t}» terdaftar di track ${l.tr} (sumber: registry lesson).`,
    );
  }
  // edge urutan kurikulum dalam track (numeric-aware dari generator)
  for (const [tr, order] of Object.entries(D.trackOrder)) {
    for (let i = 0; i + 1 < order.length; i++) {
      addEdge(
        `lesson:${order[i]}`,
        `lesson:${order[i + 1]}`,
        "urutan",
        `Urutan kurikulum track ${tr}: «${lessonTitle(order[i])}» lalu «${lessonTitle(order[i + 1])}» (sumber: urutan track).`,
      );
    }
  }
  // edge track→jalur
  for (const p of D.paths) {
    for (const tr of p.tracks) {
      addEdge(
        `track:${tr}`,
        `jalur:${p.id}`,
        "jalur",
        `Track ${tr} tercakup dalam jalur «${p.name}» (sumber: paths.ts).`,
      );
    }
  }
  // edge track→proyek (deklarasi konten proyek; alias dicatat bila ada)
  for (const p of D.proyek) {
    const aliasNote =
      p.trDeclared !== p.tr ? ` (deklarasi konten: «${p.trDeclared}»)` : "";
    addEdge(
      `track:${p.tr}`,
      `proyek:${p.slug}`,
      "proyek",
      `Proyek «${p.t}» melatih track ${p.tr}${aliasNote} (sumber: reg-proyek.ts).`,
    );
  }
}

build();

export function kgNode(id: string): KgNode | undefined {
  return NODES.get(id);
}

export function allKgNodes(): KgNode[] {
  return [...NODES.values()];
}

/** Jembatan terpendek (BFS) antara dua node, tak-berarah. */
export function bridge(
  fromId: string,
  toId: string,
): { nodes: KgNode[]; reasons: string[] } | null {
  if (fromId === toId) {
    const n = NODES.get(fromId);
    return n ? { nodes: [n], reasons: [] } : null;
  }
  const prev = new Map<string, { via: string; edge: KgEdge }>();
  const q = [fromId];
  prev.set(fromId, { via: "", edge: null as unknown as KgEdge });
  while (q.length) {
    const cur = q.shift()!;
    if (cur === toId) break;
    for (const { edge, to } of ADJ.get(cur) ?? []) {
      if (prev.has(to)) continue;
      prev.set(to, { via: cur, edge });
      q.push(to);
    }
  }
  if (!prev.has(toId)) return null;
  const ids: string[] = [];
  const reasons: string[] = [];
  let cur = toId;
  while (cur !== fromId) {
    const p = prev.get(cur)!;
    ids.push(cur);
    reasons.unshift(p.edge.reason);
    cur = p.via;
  }
  ids.push(fromId);
  ids.reverse();
  return { nodes: ids.map((id) => NODES.get(id)!), reasons };
}

/** Fan-out berarah dari sebuah lesson: node lanjutan yang dibuka. */
export function fanout(lessonId: string): KgNode[] {
  const seen = new Set<string>([lessonId]);
  const q = [lessonId];
  const out: KgNode[] = [];
  while (q.length) {
    const cur = q.shift()!;
    for (const { to } of DIR.get(cur) ?? []) {
      if (seen.has(to)) continue;
      seen.add(to);
      q.push(to);
      out.push(NODES.get(to)!);
    }
  }
  return out;
}

export interface GatewayLesson {
  node: KgNode;
  fanoutCount: number;
  breakdown: string; // ringkasan jenis node yang dibuka
}

/** Lesson pembuka: lesson dengan fan-out terbesar (prasyarat terbanyak). */
export function gatewayLessons(limit = 12): GatewayLesson[] {
  const rows: GatewayLesson[] = [];
  for (const [slug] of Object.entries(D.lessons)) {
    const id = `lesson:${slug}`;
    const fo = fanout(id);
    const kinds = { track: 0, jalur: 0, proyek: 0, lesson: 0, akar: 0 };
    for (const n of fo) kinds[n.kind]++;
    rows.push({
      node: NODES.get(id)!,
      fanoutCount: fo.length,
      breakdown: `${kinds.lesson} lesson lanjutan · ${kinds.track} track · ${kinds.jalur} jalur · ${kinds.proyek} proyek`,
    });
  }
  rows.sort((a, b) => b.fanoutCount - a.fanoutCount);
  return rows.slice(0, limit);
}

/** Bottleneck: lesson pembuka yang belum selesai menurut progress lokal. */
export function bottlenecks(done: Set<string>, limit = 8): GatewayLesson[] {
  return gatewayLessons(40).filter((g) => {
    const slug = g.node.id.slice("lesson:".length);
    return !done.has(slug);
  }).slice(0, limit);
}

/** Pulau domain: Fondasi vs Track Peran. */
export function domainIslands(): { id: string; title: string; blurb: string; tracks: KgNode[] }[] {
  const all = [...NODES.values()].filter((n) => n.kind === "track");
  return [
    {
      id: "fondasi",
      title: "Pulau Fondasi",
      blurb: "Bekal teknis lintas peran — 4 track dasar.",
      tracks: all.filter((t) => FOUNDATION_TRACKS.has(t.label)).sort((a, b) => a.label.localeCompare(b.label)),
    },
    {
      id: "peran",
      title: "Pulau Track Peran",
      blurb: "Spesialisasi per peran dan domain.",
      tracks: all.filter((t) => !FOUNDATION_TRACKS.has(t.label)).sort((a, b) => a.label.localeCompare(b.label)),
    },
  ];
}

/* ── Tandai relasi (localStorage; pola Gelombang G) ─────────────────────── */

const FLAG_KEY = "v2:kg:flags";

export interface KgFlag {
  edgeKey: string; // dua id node diurutkan, dipisah "↔"
  at: number;
}

export function edgeKey(a: string, b: string): string {
  return [a, b].sort().join("↔");
}

export function findEdge(a: string, b: string): KgEdge | undefined {
  return EDGES.find(
    (e) =>
      (e.from === a && e.to === b) || (e.from === b && e.to === a),
  );
}

export function getFlags(): KgFlag[] {
  try {
    const raw = localStorage.getItem(FLAG_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function flagEdge(a: string, b: string): KgFlag[] {
  const flags = getFlags();
  const key = edgeKey(a, b);
  if (!flags.some((f) => f.edgeKey === key)) {
    flags.push({ edgeKey: key, at: Date.now() });
    localStorage.setItem(FLAG_KEY, JSON.stringify(flags));
  }
  return flags;
}

export function unflagEdge(edgeKey: string): KgFlag[] {
  const flags = getFlags().filter((f) => f.edgeKey !== edgeKey);
  localStorage.setItem(FLAG_KEY, JSON.stringify(flags));
  return flags;
}

export function flaggedEdgeNodes(flag: KgFlag): { a: KgNode | undefined; b: KgNode | undefined; edge: KgEdge | undefined } {
  const [a, b] = flag.edgeKey.split("↔");
  return { a: NODES.get(a), b: NODES.get(b), edge: findEdge(a, b) };
}
