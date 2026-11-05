import { notFound } from "next/navigation";
import { getProyek, proyekSlugs } from "../../lib/reg-proyek";
import Workspace from "../../learn/[slug]/Workspace";

export function generateStaticParams() {
  return proyekSlugs().map((slug) => ({ slug }));
}

export default async function V2ProyekPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proyek = getProyek(slug);
  if (!proyek) notFound();
  // V2Proyek extends V2Lesson → Workspace me-render proyek tanpa perubahan.
  return <Workspace lesson={proyek} />;
}
