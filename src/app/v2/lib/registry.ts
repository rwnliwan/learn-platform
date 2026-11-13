import type { V2Lesson } from "./types";
import { REG_A1 } from "./reg-a1";
import { REG_A2 } from "./reg-a2";
import { REG_B } from "./reg-b";
import { REG_BI } from "./reg-bi";
import { REG_C } from "./reg-c";
import { REG_CR } from "./reg-cr";
import { REG_D } from "./reg-d";
import { REG_DM } from "./reg-dm";
import { REG_E } from "./reg-e";
import { REG_FR } from "./reg-fr";
import { REG_FDP } from "./reg-fdp";
import { REG_HD } from "./reg-hd";
import { REG_MK } from "./reg-mk";
import { REG_MR } from "./reg-mr";
import { REG_PM1 } from "./reg-pm1";
import { REG_PM2 } from "./reg-pm2";
import { REG_RR } from "./reg-rr";
import { REG_AAI } from "./reg-aai";
import { REG_AIE } from "./reg-aie";
import { REG_MLE } from "./reg-mle";
import { REG_DLE } from "./reg-dle";
import { REG_MLOPS } from "./reg-mlops";
import { REG_LLMOPS } from "./reg-llmops";
import { REG_BCD } from "./reg-bcd";
import { REG_BIZ } from "./reg-biz";
import { REG_DE } from "./reg-de";
import { REG_DBA } from "./reg-dba";
import { REG_WQB } from "./reg-wqb";
import { REG_MLF } from "./reg-mlf";

// TAHAP 3: all 294 lessons converted to v2 step format.
// Each REG_* is produced by the per-track conversion agent (see reg-<track>.ts).
const REGISTRY: Record<string, V2Lesson> = {
  ...REG_A1,
  ...REG_A2,
  ...REG_B,
  ...REG_BI,
  ...REG_C,
  ...REG_CR,
  ...REG_D,
  ...REG_DM,
  ...REG_E,
  ...REG_FR,
  ...REG_FDP,
  ...REG_HD,
  ...REG_MK,
  ...REG_MR,
  ...REG_PM1,
  ...REG_PM2,
  ...REG_RR,
  ...REG_AAI,
  ...REG_AIE,
  ...REG_MLE,
  ...REG_DLE,
  ...REG_MLOPS,
  ...REG_LLMOPS,
  ...REG_BCD,
  ...REG_BIZ,
  ...REG_DE,
  ...REG_DBA,
  ...REG_WQB,
  ...REG_MLF,
};

export function getV2Lesson(slug: string): V2Lesson | null {
  return REGISTRY[slug] ?? null;
}

export function v2LessonSlugs(): string[] {
  return Object.keys(REGISTRY);
}

export function getV2Lessons(): V2Lesson[] {
  return Object.values(REGISTRY);
}
