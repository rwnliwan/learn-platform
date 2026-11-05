import { notFound } from "next/navigation";
import { getMission, missionSlugs } from "../../lib/missions";
import Workspace from "../../learn/[slug]/Workspace";

export function generateStaticParams() {
  return missionSlugs().map((slug) => ({ slug }));
}

export default async function V2MissionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mission = getMission(slug);
  if (!mission) notFound();
  // V2Mission extends V2Lesson → Workspace me-render misi tanpa perubahan.
  return <Workspace lesson={mission} />;
}
