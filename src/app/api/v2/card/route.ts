import { NextRequest, NextResponse } from "next/server";
import { getCardLesson } from "@/app/v2/lib/cardRegistry";
import { parseCardId } from "@/app/v2/lib/fsrs";

export const runtime = "edge";

// Read-only card content endpoint for the /v2/review queue.
// No Neon/Turso: lesson content comes from the same static registry the
// lesson pages render. The client gates the answer behind "Tampilkan jawaban".

export async function GET(req: NextRequest) {
  const cardId = new URL(req.url).searchParams.get("cardId") ?? "";
  const parsed = parseCardId(cardId);
  if (!parsed) return NextResponse.json({ error: "cardId tidak valid" }, { status: 400 });

  const lesson = await getCardLesson(parsed.slug);
  if (!lesson) return NextResponse.json({ error: "lesson tidak ditemukan" }, { status: 404 });
  const step = lesson.steps.find((s) => s.id === parsed.stepId);
  if (!step) return NextResponse.json({ error: "step tidak ditemukan" }, { status: 404 });

  const base = {
    cardId,
    slug: lesson.slug,
    stepId: step.id,
    lessonTitle: lesson.title,
    lessonTrack: lesson.track,
    stepTitle: step.title,
  };

  if (parsed.kind === "quiz") {
    const q = step.quiz?.[parsed.qIdx ?? -1];
    if (!q) return NextResponse.json({ error: "soal tidak ditemukan" }, { status: 404 });
    return NextResponse.json({
      ...base,
      type: "quiz",
      qIdx: parsed.qIdx,
      q: q.q,
      options: q.options.map((o) => ({ text: o.text, why: o.why, correct: !!o.correct })),
    });
  }

  return NextResponse.json({
    ...base,
    type: "lab",
    tasks: step.tasks.map((t) => ({ id: t.id, text: t.text })),
    expected: step.expected ?? null,
  });
}
