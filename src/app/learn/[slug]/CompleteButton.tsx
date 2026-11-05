"use client";
import { useEffect, useState } from "react";

// Replaces the previously dead "Tandai Selesai" button on legacy v1 lesson
// pages: persists completion to /api/progress (Neon) with a localStorage
// mirror, so it survives reloads even when the API is unreachable.
export default function CompleteButton({ slug }: { slug: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    let local = false;
    try {
      local = localStorage.getItem(`v2:done:${slug}`) !== null;
    } catch {
      /* noop */
    }
    setDone(local);
    (async () => {
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) return;
        const data = await res.json();
        const onServer = (data.completed ?? []).some(
          (r: { lesson_slug: string }) => r.lesson_slug === slug
        );
        if (onServer && !local) {
          try {
            localStorage.setItem(`v2:done:${slug}`, "1");
          } catch {
            /* noop */
          }
        }
        setDone(onServer || local);
      } catch {
        /* offline */
      }
    })();
  }, [slug]);

  async function toggle() {
    const key = `v2:done:${slug}`;
    if (done) {
      try {
        localStorage.removeItem(key);
      } catch {
        /* noop */
      }
      setDone(false);
      try {
        await fetch(`/api/progress?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
      } catch {
        /* noop */
      }
    } else {
      try {
        localStorage.setItem(key, new Date().toISOString());
      } catch {
        /* noop */
      }
      setDone(true);
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
      } catch {
        /* noop */
      }
    }
  }

  return (
    <button className="btn btn-primary btn-sm" onClick={toggle} aria-pressed={done}>
      {done ? "Selesai ✓ (klik untuk batalkan)" : "Tandai Selesai ✓"}
    </button>
  );
}
