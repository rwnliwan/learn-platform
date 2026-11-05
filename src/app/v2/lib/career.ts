// Career-readiness mapping for /v2/karier.
// Pure functions over the v2 registry + real localStorage progress.
// Role <-> track mapping uses the verified `track` display names from the
// registry content files (equivalent to slug prefixes cr*/fr*/aml*/mr* and
// rr*/dm*/d*/c* — both verified to exist in reg-*.ts; track names are the
// more robust key because fr* and aml* slugs share one track).
// NEVER fabricate mastery scores: every number here derives from
// getLocalDone() (lessons finished) and v2:quiz:* records (quiz answers).

export interface CareerLesson {
  slug: string;
  title: string;
  track: string;
}

export interface RoleDef {
  id: "credit" | "fraud" | "market" | "reporting";
  name: string;
  desc: string;
  tracks: string[];
}

export const ROLES: RoleDef[] = [
  {
    id: "credit",
    name: "Credit Risk",
    desc: "Analis risiko kredit — penilaian kelayakan, PD/LGD/EAD, ECL & regulasi.",
    tracks: ["Credit Risk"],
  },
  {
    id: "fraud",
    name: "Fraud / AML",
    desc: "Deteksi fraud & anti-pencucian uang — pola transaksi, investigasi, kepatuhan.",
    tracks: ["Fraud & AML Analytics"],
  },
  {
    id: "market",
    name: "Market Risk",
    desc: "Risiko pasar — VaR, stress testing, valuasi & dinamika pasar.",
    tracks: ["Market Risk"],
  },
  {
    id: "reporting",
    name: "Risk Reporting",
    desc: "Pelaporan risiko — SQL, Python, manajemen data & dashboard.",
    tracks: ["Risk Reporting", "Data Management", "SQL", "Python"],
  },
];

export interface TrackStat {
  track: string;
  total: number;
  done: number;
  pct: number;
  nextLesson: CareerLesson | null;
}

export interface QuizStat {
  answered: number;
  correct: number;
  pct: number;
}

export interface RoleStat {
  role: RoleDef;
  tracks: TrackStat[];
  total: number;
  doneCount: number;
  pct: number;
  /** up to 3 tracks with the lowest completion = biggest gaps */
  gaps: TrackStat[];
  /** first unfinished lesson in the lowest-completion track that still has one */
  next: CareerLesson | null;
  quiz: QuizStat | null; // null = "belum ada data kuis"
}

/** numeric-aware lesson order: cr14a < cr14b < cr15 */
export function lessonSortKey(slug: string): [number, string, string] {
  const m = /^([a-z]+)(\d+)([a-z]*)/.exec(slug);
  if (!m) return [Number.MAX_SAFE_INTEGER, "", slug];
  return [parseInt(m[2], 10), m[3] || "", slug];
}
function cmpLesson(a: CareerLesson, b: CareerLesson): number {
  const ka = lessonSortKey(a.slug);
  const kb = lessonSortKey(b.slug);
  return ka[0] - kb[0] || (ka[1] < kb[1] ? -1 : ka[1] > kb[1] ? 1 : 0) || (ka[2] < kb[2] ? -1 : 1);
}

const QUIZ_PREFIX = "v2:quiz:";

export interface QuizRecord {
  slug: string;
  correct: boolean;
}

/** all persisted quiz answers (recorded by Workspace onAnswer hook). */
export function getQuizRecords(): QuizRecord[] {
  const out: QuizRecord[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(QUIZ_PREFIX)) continue;
      // key: v2:quiz:<slug>:<stepId>:<qi>  (slug/stepId contain no colons)
      const parts = k.slice(QUIZ_PREFIX.length).split(":");
      if (parts.length < 3) continue;
      parts.pop(); // qi
      parts.pop(); // stepId
      const slug = parts.join(":");
      try {
        const s = JSON.parse(localStorage.getItem(k) ?? "{}");
        out.push({ slug, correct: !!s.correct });
      } catch {
        /* noop */
      }
    }
  } catch {
    /* noop */
  }
  return out;
}

export function computeRoleStats(lessons: CareerLesson[], done: Set<string>): RoleStat[] {
  const byTrack = new Map<string, CareerLesson[]>();
  for (const l of lessons) {
    const arr = byTrack.get(l.track) ?? [];
    arr.push(l);
    byTrack.set(l.track, arr);
  }
  for (const arr of byTrack.values()) arr.sort(cmpLesson);

  const quizRecs = getQuizRecords();
  const correctBySlug = new Map<string, { answered: number; correct: number }>();
  for (const r of quizRecs) {
    const e = correctBySlug.get(r.slug) ?? { answered: 0, correct: 0 };
    e.answered += 1;
    if (r.correct) e.correct += 1;
    correctBySlug.set(r.slug, e);
  }

  return ROLES.map((role) => {
    const tracks: TrackStat[] = role.tracks
      .map((t) => {
        const ls = byTrack.get(t) ?? [];
        const doneCount = ls.filter((l) => done.has(l.slug)).length;
        const nextLesson = ls.find((l) => !done.has(l.slug)) ?? null;
        return {
          track: t,
          total: ls.length,
          done: doneCount,
          pct: ls.length ? Math.round((doneCount / ls.length) * 100) : 0,
          nextLesson,
        };
      })
      .sort((a, b) => a.pct - b.pct || b.total - a.total);

    const total = tracks.reduce((s, t) => s + t.total, 0);
    const doneCount = tracks.reduce((s, t) => s + t.done, 0);

    const roleSlugs = new Set<string>();
    for (const t of role.tracks) for (const l of byTrack.get(t) ?? []) roleSlugs.add(l.slug);
    let answered = 0;
    let correct = 0;
    for (const [slug, e] of correctBySlug) {
      if (roleSlugs.has(slug)) {
        answered += e.answered;
        correct += e.correct;
      }
    }

    const nextTrack = tracks.find((t) => t.nextLesson);
    return {
      role,
      tracks,
      total,
      doneCount,
      pct: total ? Math.round((doneCount / total) * 100) : 0,
      gaps: tracks.slice(0, 3),
      next: nextTrack ? nextTrack.nextLesson : null,
      quiz: answered > 0 ? { answered, correct, pct: Math.round((correct / answered) * 100) } : null,
    };
  });
}
