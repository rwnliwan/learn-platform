// Light gamification for /v2/karier — computed ONLY from real progress data
// (lib/progress.ts localStorage keys). No leaderboards/duels (single user).
//
// RUMUS XP (sederhana, didokumentasikan di UI + laporan):
//   XP = 10 x lesson selesai + 2 x jawaban kuis benar
//   - lesson selesai  = setiap key v2:done:<slug>                 -> +10 XP
//   - kuis benar      = setiap record v2:quiz:* dengan correct=true -> +2 XP
//     (UI kuis hanya mengizinkan 1x jawab per soal, jadi "benar" = "benar
//      di percobaan pertama/satu-satunya". Tidak ada pengurangan XP.)
// LEVEL: level = 1 + floor(XP / 100). Progress bar = sisa XP menuju level berikut.
// STREAK: hari beruntun (kalender lokal) dengan >=1 kunjungan lesson,
//   dihitung mundur dari hari ini; bila hari ini belum ada aktivitas tapi
//   kemarin ada, streak dihitung dari kemarin (tidak putus di tengah hari).
// BADGE (5, semua dari data nyata):
//   1. "Langkah pertama"   — >=1 lesson selesai
//   2. "7 hari beruntun"    — streak >= 7
//   3. "50 lesson"          — >=50 lesson selesai
//   4. "10 lab lolos"       — >=10 step lab dengan passed=true (v2:step:*:*)
//   5. "Semua peran"        — >=1 lesson selesai di tiap 4 peran karier

import { getLocalDone, activityByDay } from "./progress";
import { ROLES, getQuizRecords, type CareerLesson } from "./career";

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  earned: boolean;
}

export interface GamifyState {
  xp: number;
  level: number;
  levelPct: number;
  xpIntoLevel: number;
  streak: number;
  lessonsDone: number;
  labsPassed: number;
  quizCorrect: number;
  badges: Badge[];
}

const STEP_PREFIX = "v2:step:";

function countLabsPassed(): number {
  let n = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(STEP_PREFIX)) continue;
      try {
        const s = JSON.parse(localStorage.getItem(k) ?? "{}");
        if (s.passed) n += 1;
      } catch {
        /* noop */
      }
    }
  } catch {
    /* noop */
  }
  return n;
}

/** consecutive active days ending today (or yesterday if today is quiet so far) */
export function computeStreak(): number {
  const byDay = activityByDay();
  const dayKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = new Date();
  let cursor = new Date(today);
  if ((byDay.get(dayKey(cursor)) ?? 0) === 0) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  for (;;) {
    if ((byDay.get(dayKey(cursor)) ?? 0) > 0) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
}

export function computeGamify(lessons: CareerLesson[]): GamifyState {
  const done = getLocalDone();
  const lessonsDone = done.size;
  const quizRecs = getQuizRecords();
  const quizCorrect = quizRecs.filter((r) => r.correct).length;
  const labsPassed = countLabsPassed();
  const streak = computeStreak();

  const xp = lessonsDone * 10 + quizCorrect * 2;
  const level = 1 + Math.floor(xp / 100);
  const xpIntoLevel = xp % 100;

  const doneByTrack = new Map<string, boolean>();
  for (const slug of done) {
    const l = lessons.find((x) => x.slug === slug);
    if (l) doneByTrack.set(l.track, true);
  }
  const allRolesTouched = ROLES.every((r) => r.tracks.some((t) => doneByTrack.get(t)));

  const badges: Badge[] = [
    { id: "langkah-pertama", name: "Langkah pertama", desc: "Selesaikan 1 lesson", icon: "play", earned: lessonsDone >= 1 },
    { id: "streak-7", name: "7 hari beruntun", desc: "Belajar 7 hari berturut-turut", icon: "sun", earned: streak >= 7 },
    { id: "lesson-50", name: "50 lesson", desc: "Selesaikan 50 lesson", icon: "book", earned: lessonsDone >= 50 },
    { id: "lab-10", name: "10 lab lolos", desc: "Loloskan 10 langkah lab", icon: "flask", earned: labsPassed >= 10 },
    { id: "semua-peran", name: "Semua peran", desc: "Sentuh keempat peran karier", icon: "target", earned: allRolesTouched },
  ];

  return {
    xp,
    level,
    levelPct: Math.round((xpIntoLevel / 100) * 100),
    xpIntoLevel,
    streak,
    lessonsDone,
    labsPassed,
    quizCorrect,
    badges,
  };
}
