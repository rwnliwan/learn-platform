import { getChapter, getChapters, mdToHtml } from "@/lib/content";
import CompleteButton from "./CompleteButton";
import { notFound } from "next/navigation";
import Link from "next/link";

import fs from "node:fs";
import path from "node:path";

export function generateStaticParams() {
  // Only prerender slugs WITHOUT a dedicated page.tsx directory
  // (prevents [slug] from shadowing specific lesson pages)
  const learnDir = path.join(process.cwd(), "src/app/learn");
  const dedicated = new Set(
    fs.readdirSync(learnDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name !== "[slug]")
      .map((d) => d.name)
  );
  return getChapters()
    .filter((c) => !dedicated.has(c.slug))
    .map((c) => ({ slug: c.slug }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <Link href="/" className="text-small">
        ← Kembali
      </Link>
      <article
        style={{ marginTop: "var(--sp-6)" }}
        dangerouslySetInnerHTML={{ __html: mdToHtml(chapter.content) }}
      />
      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">
          ← Daftar Materi
        </Link>
        <CompleteButton slug={slug} />
      </div>
    </div>
  );
}
