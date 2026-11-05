import { notFound } from "next/navigation";
import { getV2Lesson, v2LessonSlugs } from "../../lib/registry";
import Workspace from "./Workspace";

export function generateStaticParams() {
  // Prerender only registered v2 lessons (avoids the [slug] shadowing trap
  // that bit the legacy route: never list a slug that also has a dedicated dir).
  return v2LessonSlugs().map((slug) => ({ slug }));
}

export default async function V2LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getV2Lesson(slug);
  if (!lesson) notFound();
  return <Workspace lesson={lesson} />;
}
