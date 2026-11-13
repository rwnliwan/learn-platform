// Deterministic per-question shuffle for v2 quiz options.
//
// MUST-1 fix (review Instinct Track MLF, 2026-11-14): the stored content has a
// systemic correct-answer position bias — 463 questions, correct at B in 279
// (60,3%). The v2 route already shuffled at render with Math.random() (pilot
// practice-loop, commit 7f8e1bd), but Math.random() is NOT deterministic: the
// order changed on every mount/navigation and could differ between SSR and
// client (hydration mismatch). This module makes the shuffle deterministic:
//
//   seed key = `${lessonSlug}:${stepId}:${questionIndex}`
//
// The same question always renders the same order (stable across reloads),
// while the correct answer's displayed position is ~uniform across questions
// (verified by qa-learn/check_quiz_rendered_positions.mjs, target max ≤35%).
//
// Answers keep storing ORIGINAL option indices (see QuizBlock), so stored
// answers, localStorage `v2:quiz:*` records, and spaced-repetition card ids
// (`quizCardId(slug, stepId, qi)`) stay correct under any display order.
// No quiz `why` text refers to option positions, and no option text reads
// "Opsi A/B/C" as a position label — verified by Chief 2026-11-14 — so
// shuffling cannot break a cross-reference.
//
// The legacy route needs no shuffle: MLF .md mirrors contain zero quiz
// blocks (verified: `grep -c "^### Kuis"` = 0 in all 49 files), so legacy
// MLF pages show no quiz to game.

/** FNV-1a 32-bit hash of the seed key. */
export function hashSeed(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — small fast seeded PRNG (32-bit state, deterministic). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle of indices [0..n), driven by the seeded PRNG.
 * Returns the display order: order[d] = original index shown at position d.
 */
export function shuffledOrder(n: number, seedKey: string): number[] {
  const rand = mulberry32(hashSeed(seedKey));
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

/** Displayed position (0-based) of the correct option under the seeded shuffle. */
export function shuffledCorrectPosition(n: number, correctOrig: number, seedKey: string): number {
  return shuffledOrder(n, seedKey).indexOf(correctOrig);
}
