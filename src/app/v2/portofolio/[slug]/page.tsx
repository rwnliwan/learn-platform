import { notFound } from "next/navigation";
import { Suspense } from "react";
import DashboardNav from "../../lib/DashboardNav";
import PortfolioClient from "./PortfolioClient";
import { PF_LIST } from "../../lib/portfolio";
import "../portofolio.css";

export function generateStaticParams() {
  return PF_LIST.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PF_LIST.find((x) => x.slug === slug);
  return {
    title: p ? `${p.title} — Portofolio` : "Portofolio — Learn v2",
    description: p
      ? `Studi kasus ${p.title}: executive scan & technical deep dive dari konten proyek Learn v2.`
      : "Portfolio Generator: 7 proyek flagship sebagai studi kasus siap bagikan.",
  };
}

export default async function PortfolioSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PF_LIST.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <div className="shell">
      <DashboardNav active="portofolio" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Portofolio</h1>
            <span className="date">Studi kasus siap bagikan · dari konten proyek</span>
          </div>
          <Suspense fallback={<p className="pf-empty">Memuat…</p>}>
            <PortfolioClient slug={slug} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
