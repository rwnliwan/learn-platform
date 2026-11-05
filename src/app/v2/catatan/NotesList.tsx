"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getNotes } from "../lib/progress";

interface StepInfo {
  id: string;
  title: string;
}
interface IndexEntry {
  slug: string;
  title: string;
  track: string;
  steps: StepInfo[];
}

export default function NotesList({ index }: { index: IndexEntry[] }) {
  const [notes, setNotes] = useState<ReturnType<typeof getNotes> | null>(null);
  useEffect(() => {
    setNotes(getNotes());
  }, []);
  const bySlug = useMemo(() => new Map(index.map((l) => [l.slug, l])), [index]);

  if (notes === null) return <p className="muted">Memuat…</p>;
  if (notes.length === 0)
    return (
      <p className="muted">
        Belum ada catatan. Catatan ditulis dari tab “Catatan” di setiap lesson — semuanya terkumpul di
        sini.
      </p>
    );

  // newest first (localStorage order is arbitrary; sort by key for stability)
  const sorted = [...notes].sort((a, b) => b.key.localeCompare(a.key));
  return (
    <ul className="notelist">
      {sorted.map((n) => {
        const l = bySlug.get(n.slug);
        const step = l?.steps.find((s) => s.id === n.stepId);
        return (
          <li key={n.key}>
            <div className="nmeta">
              {l ? l.track : n.slug}
              {step ? ` · ${step.title}` : ""}
            </div>
            <div className="ntext">{n.text}</div>
            {l && (
              <div style={{ marginTop: 8 }}>
                <Link className="btn ghost" href={`/v2/learn/${n.slug}`}>
                  Buka lesson
                </Link>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
