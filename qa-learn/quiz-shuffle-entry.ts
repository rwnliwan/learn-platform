// Entry bundle KHUSUS untuk qa-learn/check_quiz_rendered_positions.mjs —
// BUKAN dipakai komponen runtime. Mengumpulkan REG_MLF + quizShuffle agar
// guard bisa mensimulasikan urutan render tiap soal kuis dengan seed yang
// SAMA persis dengan QuizBlock (Workspace.tsx).
// Pakai: ./node_modules/.bin/esbuild qa-learn/quiz-shuffle-entry.ts --bundle
//   --format=esm --outfile=/tmp/quiz-shuffle-bundle.mjs --log-level=error
import { REG_MLF } from "../src/app/v2/lib/reg-mlf";
import { shuffledOrder } from "../src/app/v2/lib/quizShuffle";
import type { V2Lesson } from "../src/app/v2/lib/types";

export function renderedDistribution() {
  const counts = [0, 0, 0, 0];
  let total = 0;
  let anomalies = 0;
  const perLesson: Record<string, [number, number, number, number]> = {};
  for (const lesson of Object.values(REG_MLF) as V2Lesson[]) {
    const c: [number, number, number, number] = [0, 0, 0, 0];
    for (const step of lesson.steps) {
      if (!step.quiz) continue;
      step.quiz.forEach((item, qi) => {
        const correctOrig = item.options.findIndex((o) => o.correct);
        if (correctOrig < 0 || item.options.length !== 4) {
          anomalies += 1;
          return;
        }
        const order = shuffledOrder(
          item.options.length,
          `${lesson.slug}:${step.id}:${qi}`
        );
        const pos = order.indexOf(correctOrig);
        counts[pos] += 1;
        c[pos] += 1;
        total += 1;
      });
    }
    perLesson[lesson.slug] = c;
  }
  return { total, counts, perLesson, anomalies };
}

export { REG_MLF };
