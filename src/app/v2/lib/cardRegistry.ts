import type { V2Lesson } from "./types";
import cardData from "./cardData.json";

// Sumber data /api/v2/card (edge). Registry utama (registry.ts) mengimpor
// statis seluruh 607 lesson — bundle-nya melampaui batas ukuran fungsi edge
// 4 MB setelah pendalaman Gelombang C (fungsi kartu mencapai 4,36 MB).
// Endpoint kartu hanya butuh judul/track + quiz/tasks per step, jadi ia
// membaca manifest ramping cardData.json (2,45 MB) yang digenerasi dari
// registry oleh scripts/gen-card-data.mjs. WAJIB regenerasi manifest itu
// setiap kali konten lesson berubah, sebelum deploy.

type SlimOption = [string, string, number];
type SlimStep = {
  id: string;
  ti: string;
  q?: { q: string; o: SlimOption[] }[];
  tk?: [string, string][];
  e?: string;
};
type SlimLesson = { t: string; tr: string; steps: SlimStep[] };

const DATA = cardData as unknown as Record<string, SlimLesson>;

export async function getCardLesson(slug: string): Promise<V2Lesson | null> {
  const slim = DATA[slug];
  if (!slim) return null;
  const lesson = {
    slug,
    title: slim.t,
    track: slim.tr,
    steps: slim.steps.map((s) => ({
      id: s.id,
      title: s.ti,
      quiz: s.q?.map((q) => ({
        q: q.q,
        options: q.o.map(([text, why, c]) => ({
          text,
          why,
          correct: c === 1,
        })),
      })),
      tasks: (s.tk ?? []).map(([id, text]) => ({ id, text })),
      expected: s.e,
    })),
  };
  return lesson as unknown as V2Lesson;
}
