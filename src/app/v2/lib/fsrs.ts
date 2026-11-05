// FSRS spaced repetition for Learn v2.
//
// One "card" = one quiz question (`quiz:<slug>:<stepId>:<qIdx>`) or one lab
// (`lab:<slug>:<stepId>`). FSRS state lives in localStorage under
// `v2:fsrs:<cardId>` as structured JSON — the same localStorage-first pattern
// as progress.ts (single user). The JSON shape is versioned (`v: 1`) so it can
// be migrated to Neon later (a /api/fsrs mirror, same as /api/progress)
// without changing call sites.

import { FSRS, Rating, createEmptyCard, type Card, type Grade } from "ts-fsrs";

const PREFIX = "v2:fsrs:";

/** ts-fsrs is a pure-TS scheduling engine: safe to instantiate once. */
const sched = new FSRS({});

export type CardKind = "quiz" | "lab";
export { Rating };
export type FsrsGrade = Grade;

export interface StoredFsrsCard {
  v: 1;
  cardId: string;
  kind: CardKind;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number; // ts-fsrs State enum value
  due: string; // ISO
  last_review: string | null; // ISO
  updated_at: string; // ISO
}

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

/** Parse a cardId back into its components (slug/stepId may contain colons). */
export function parseCardId(cardId: string): { kind: CardKind; slug: string; stepId: string; qIdx?: number } | null {
  const parts = cardId.split(":");
  const kind = parts[0];
  if (kind !== "quiz" && kind !== "lab") return null;
  const slug = parts[1] ?? "";
  if (!slug) return null;
  if (kind === "lab") {
    const stepId = parts.slice(2).join(":");
    return stepId ? { kind, slug, stepId } : null;
  }
  const qIdx = Number(parts[parts.length - 1]);
  const stepId = parts.slice(2, -1).join(":");
  return Number.isInteger(qIdx) && stepId ? { kind, slug, stepId, qIdx } : null;
}

export const quizCardId = (slug: string, stepId: string, qIdx: number) => `quiz:${slug}:${stepId}:${qIdx}`;
export const labCardId = (slug: string, stepId: string) => `lab:${slug}:${stepId}`;

/** Diekspor untuk Gelombang F (Legacy Mode): proyeksi memakai mesin yang sama. */
export function toCard(s: StoredFsrsCard): Card {
  const c = createEmptyCard();
  c.stability = s.stability;
  c.difficulty = s.difficulty;
  c.elapsed_days = s.elapsed_days;
  c.scheduled_days = s.scheduled_days;
  c.learning_steps = s.learning_steps;
  c.reps = s.reps;
  c.lapses = s.lapses;
  c.state = s.state as Card["state"];
  c.due = new Date(s.due);
  if (s.last_review) c.last_review = new Date(s.last_review);
  return c;
}

function toStored(cardId: string, kind: CardKind, c: Card): StoredFsrsCard {
  return {
    v: 1,
    cardId,
    kind,
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state as number,
    due: c.due.toISOString(),
    last_review: c.last_review ? c.last_review.toISOString() : null,
    updated_at: new Date().toISOString(),
  };
}

/** Load a card's FSRS state; brand-new cards start due now. */
export function loadCardState(cardId: string): StoredFsrsCard | null {
  const raw = lsGet(PREFIX + cardId);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as StoredFsrsCard;
    if (s.v !== 1 || typeof s.due !== "string") return null;
    return s;
  } catch {
    return null;
  }
}

/**
 * Record one review. Grade mapping (1 pengguna, Septian):
 *   quiz: benar di klik pertama → Good(3), salah → Again(1)
 *   lab:  lolos → Good(3), gagal setelah ≥2 percobaan → Again(1)
 * Returns the persisted post-review state.
 */
export function recordReview(cardId: string, grade: Grade): StoredFsrsCard {
  const parsed = parseCardId(cardId);
  if (!parsed) throw new Error(`invalid card id: ${cardId}`);
  const stored = loadCardState(cardId);
  const card = stored ? toCard(stored) : createEmptyCard();
  const next = sched.next(card, new Date(), grade);
  const out = toStored(cardId, parsed.kind, next.card);
  lsSet(PREFIX + cardId, JSON.stringify(out));
  return out;
}

/** Card ids due at-or-before now, soonest first. */
export function getDueCards(limit = 50): string[] {
  const now = Date.now();
  const out: { cardId: string; due: number }[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      const cardId = k.slice(PREFIX.length);
      const s = loadCardState(cardId);
      if (!s) continue;
      const due = new Date(s.due).getTime();
      if (due <= now) out.push({ cardId, due });
    }
  } catch {
    /* noop */
  }
  return out
    .sort((a, b) => a.due - b.due)
    .slice(0, limit)
    .map((x) => x.cardId);
}

export interface FsrsStats {
  totalCards: number;
  dueCount: number;
  nextDueISO: string | null;
  /** mean predicted retrievability (0–100) over reviewed cards, null when none */
  avgRetention: number | null;
}

export function getStats(): FsrsStats {
  const now = Date.now();
  let total = 0;
  let due = 0;
  let nextDue: number | null = null;
  const rets: number[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      const s = loadCardState(k.slice(PREFIX.length));
      if (!s) continue;
      total++;
      const dueMs = new Date(s.due).getTime();
      if (dueMs <= now) due++;
      else if (nextDue === null || dueMs < nextDue) nextDue = dueMs;
      if (s.reps > 0) {
        const r = parseFloat(sched.get_retrievability(toCard(s), new Date()));
        if (Number.isFinite(r)) rets.push(r);
      }
    }
  } catch {
    /* noop */
  }
  return {
    totalCards: total,
    dueCount: due,
    nextDueISO: nextDue === null ? null : new Date(nextDue).toISOString(),
    avgRetention: rets.length ? Math.round((rets.reduce((a, b) => a + b, 0) / rets.length) * 10) / 10 : null,
  };
}

export const GRADE_LABEL: Record<Grade, string> = {
  [Rating.Again]: "Again",
  [Rating.Hard]: "Hard",
  [Rating.Good]: "Good",
  [Rating.Easy]: "Easy",
};

/**
 * Legacy Mode (Gelombang F — ide #45): proyeksi retrievability pada tanggal
 * horizon memakai mesin FSRS yang SAMA dengan review — bukan model baru.
 * Return persen 0..100 (parseFloat dari "67.24%", sama seperti getStats()),
 * null bila kartu tak bisa dibaca.
 */
export function retrievabilityAt(
  stored: StoredFsrsCard,
  at: Date
): number | null {
  try {
    const v = parseFloat(String(sched.get_retrievability(toCard(stored), at)));
    if (!Number.isFinite(v)) return null;
    return Math.min(100, Math.max(0, v));
  } catch {
    return null;
  }
}
