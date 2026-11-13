#!/usr/bin/env node
/**
 * check_quiz_rendered_positions.mjs — MUST-1 guard (review Instinct 2026-11-14).
 *
 * The STORED content is biased (correct at B in 279/463 = 60,3% — see
 * qa-learn/check_quiz_position_bias.py). The v2 route fixes this at RENDER
 * with a deterministic per-question shuffle (src/app/v2/lib/quizShuffle.ts,
 * seed `${slug}:${stepId}:${qi}`). This guard simulates the EXACT render
 * order for every MLF quiz question (same code path as QuizBlock, via an
 * esbuild bundle of REG_MLF + quizShuffle) and asserts no displayed
 * position holds more than 35% of correct answers.
 *
 * NOTE: check_quiz_position_bias.py --fail measures the STORED distribution
 * and therefore still FAILs by design — it no longer gates MUST-1. This
 * script is the gate for the learner-facing property.
 *
 * Usage: node qa-learn/check_quiz_rendered_positions.mjs [--per-lesson]
 * Exit 0 = PASS (max share <= 35%, 0 anomalies); exit 1 = FAIL.
 */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ESBUILD = path.join(ROOT, "node_modules", ".bin", "esbuild");
const ENTRY = path.join(ROOT, "qa-learn", "quiz-shuffle-entry.ts");
const OUT = "/tmp/quiz-shuffle-bundle.mjs";

execFileSync(
  ESBUILD,
  [ENTRY, "--bundle", "--format=esm", `--outfile=${OUT}`, "--log-level=error"],
  { stdio: "inherit" }
);
const { renderedDistribution } = await import(OUT);
const { total, counts, perLesson, anomalies } = renderedDistribution();

console.log(`questions: ${total}  anomalies (no correct / != 4 options): ${anomalies}`);
for (let i = 0; i < 4; i++) {
  console.log(`  ${"ABCD"[i]}: ${counts[i]} (${((counts[i] / Math.max(total, 1)) * 100).toFixed(1)}%)`);
}
const worst = Math.max(...counts) / Math.max(total, 1);
console.log(`max position share: ${(worst * 100).toFixed(1)}%  (target <= 35%)`);
if (process.argv.includes("--per-lesson")) {
  console.log("\nper-lesson (n, A/B/C/D):");
  for (const [slug, c] of Object.entries(perLesson)) {
    console.log(`  ${slug}: ${c[0] + c[1] + c[2] + c[3]}  A=${c[0]} B=${c[1]} C=${c[2]} D=${c[3]}`);
  }
}
if (anomalies > 0 || worst > 0.35) {
  console.log("FAIL");
  process.exit(1);
}
console.log("PASS");
