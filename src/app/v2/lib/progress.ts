// Client-side progress & activity helpers for Learn v2.
// Local state lives in localStorage; the Neon-backed /api/progress is the
// durable copy. Writes go to both; reads merge (server union local).

export interface ReviewItem {
  slug: string;
  stepId: string;
  attempts: number;
}

export interface NoteItem {
  key: string;
  slug: string;
  stepId: string;
  text: string;
}

const DONE_PREFIX = "v2:done:";
const STEP_PREFIX = "v2:step:";
const NOTE_PREFIX = "v2:note:";
const ACTIVITY_KEY = "v2:activity";
const SYNC_KEY = "v2:progress-synced-at";

function lsGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function lsSet(k: string, v: string) {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* noop */
  }
}
function lsDel(k: string) {
  try {
    localStorage.removeItem(k);
  } catch {
    /* noop */
  }
}

/* ---------- completion ---------- */
export function getLocalDone(): Set<string> {
  const out = new Set<string>();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(DONE_PREFIX)) out.add(k.slice(DONE_PREFIX.length));
    }
  } catch {
    /* noop */
  }
  return out;
}
export function markDoneLocal(slug: string) {
  lsSet(DONE_PREFIX + slug, new Date().toISOString());
}
export function unmarkDoneLocal(slug: string) {
  lsDel(DONE_PREFIX + slug);
}
export function isDoneLocal(slug: string): boolean {
  return lsGet(DONE_PREFIX + slug) !== null;
}

/* ---------- mastery (pilot practice-loop 2026-10-30) ---------- */
// "Dikuasai" = transfer check lolos tanpa petunjuk. Local-first seperti done;
// /api/progress adalah salinan durable-nya (kolom mastered_at).
const MASTERED_PREFIX = "v2:mastered:";
export function markMasteredLocal(slug: string) {
  lsSet(MASTERED_PREFIX + slug, new Date().toISOString());
}
export function isMasteredLocal(slug: string): boolean {
  return lsGet(MASTERED_PREFIX + slug) !== null;
}
export function getLocalMastered(): Set<string> {
  const out = new Set<string>();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(MASTERED_PREFIX)) out.add(k.slice(MASTERED_PREFIX.length));
    }
  } catch {
    /* noop */
  }
  return out;
}
export async function pullServerMastered(): Promise<Set<string>> {
  const out = new Set<string>();
  try {
    const res = await fetch("/api/progress");
    if (!res.ok) return out;
    const data = await res.json();
    for (const r of data.completed ?? []) {
      if (r.mastered_at) {
        out.add(r.lesson_slug);
        if (!isMasteredLocal(r.lesson_slug)) markMasteredLocal(r.lesson_slug);
      }
    }
  } catch {
    /* offline: local state stands alone */
  }
  return out;
}

/* ---------- server sync ---------- */
export async function pullServerProgress(): Promise<Set<string>> {
  const out = new Set<string>();
  try {
    const res = await fetch("/api/progress");
    if (!res.ok) return out;
    const data = await res.json();
    for (const r of data.completed ?? []) {
      out.add(r.lesson_slug);
      // server is durable: mirror locally so offline reads stay correct
      if (!isDoneLocal(r.lesson_slug)) lsSet(DONE_PREFIX + r.lesson_slug, r.completed_at);
    }
    lsSet(SYNC_KEY, new Date().toISOString());
  } catch {
    /* offline / no DATABASE_URL: local state stands alone */
  }
  return out;
}
export async function pushDone(slug: string): Promise<boolean> {
  markDoneLocal(slug);
  try {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
export async function pushUndone(slug: string): Promise<boolean> {
  unmarkDoneLocal(slug);
  try {
    const res = await fetch(`/api/progress?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

/* ---------- activity (for heatmap / "terakhir" / resume) ---------- */
export interface Visit {
  slug: string;
  ts: number;
}
export function logVisit(slug: string) {
  try {
    const raw = lsGet(ACTIVITY_KEY);
    const arr: Visit[] = raw ? JSON.parse(raw) : [];
    arr.push({ slug, ts: Date.now() });
    lsSet(ACTIVITY_KEY, JSON.stringify(arr.slice(-500)));
  } catch {
    /* noop */
  }
}
export function getActivity(): Visit[] {
  try {
    const raw = lsGet(ACTIVITY_KEY);
    return raw ? (JSON.parse(raw) as Visit[]) : [];
  } catch {
    return [];
  }
}
/** dayKey (YYYY-MM-DD, local) -> visit count, last 91 days */
export function activityByDay(): Map<string, number> {
  const m = new Map<string, number>();
  for (const v of getActivity()) {
    const d = new Date(v.ts);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    m.set(key, (m.get(key) ?? 0) + 1);
  }
  return m;
}

/* ---------- review candidates (real, from lab attempts) ---------- */
export function getReviewItems(): ReviewItem[] {
  const out: ReviewItem[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(STEP_PREFIX)) continue;
      // key: v2:step:<slug>:<stepId>  (stepId may contain colons? ids are simple)
      const rest = k.slice(STEP_PREFIX.length);
      const sep = rest.indexOf(":");
      if (sep < 0) continue;
      const slug = rest.slice(0, sep);
      const stepId = rest.slice(sep + 1);
      try {
        const s = JSON.parse(localStorage.getItem(k) ?? "{}");
        if (!s.passed && (s.attempts ?? 0) >= 2) out.push({ slug, stepId, attempts: s.attempts });
      } catch {
        /* noop */
      }
    }
  } catch {
    /* noop */
  }
  return out.sort((a, b) => b.attempts - a.attempts);
}

/* ---------- notes ---------- */
export function getNotes(): NoteItem[] {
  const out: NoteItem[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(NOTE_PREFIX)) continue;
      const rest = k.slice(NOTE_PREFIX.length);
      const sep = rest.indexOf(":");
      if (sep < 0) continue;
      const slug = rest.slice(0, sep);
      const stepId = rest.slice(sep + 1);
      const text = localStorage.getItem(k) ?? "";
      if (text.trim()) out.push({ key: k, slug, stepId, text });
    }
  } catch {
    /* noop */
  }
  return out;
}

/* ---------- export / wipe ---------- */
export function exportAll(): string {
  const data: Record<string, unknown> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("v2:")) data[k] = localStorage.getItem(k);
    }
  } catch {
    /* noop */
  }
  return JSON.stringify({ exported_at: new Date().toISOString(), data }, null, 2);
}
export function wipeV2Local() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("v2:") || k === "theme" || k === "v2:nav")) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* noop */
  }
}
