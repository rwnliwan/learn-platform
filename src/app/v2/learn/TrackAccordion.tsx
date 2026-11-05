"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Icon, { trackIconFor } from "../lib/icons";
import type { V2Lesson } from "../lib/types";
import { slugify } from "../lib/slug";

export interface TrackGroup {
  id: string;
  title: string;
  blurb: string;
  tracks: [string, V2Lesson[]][];
}

const LS_KEY = "v2:track-open";
/* Curriculum browser: tracks grouped by category, each track a collapsible
   accordion. Open state persists in localStorage; a ?track=<id> query param
   (dashboard deep-link) or #track-<id> anchor opens that track on load. */
export default function TrackAccordion({ groups }: { groups: TrackGroup[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();

  useEffect(() => {
    let initial: Record<string, boolean> = {};
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) initial = JSON.parse(raw);
    } catch {
      /* noop */
    }
    const hash = window.location.hash.replace(/^#/, "");
    const qp = new URLSearchParams(window.location.search).get("track") ?? "";
    // dashboard deep-links use ?track= (Next <Link> drops hash fragments on
    // client-side navigation); plain #track- anchors keep working too.
    const target = qp.startsWith("track-")
      ? qp
      : hash.startsWith("track-")
        ? hash
        : "";
    if (target) {
      initial = { ...initial, [target]: true };
      requestAnimationFrame(() => {
        document.getElementById(target)?.scrollIntoView({ block: "start" });
      });
    }
    setOpen(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  };

  return (
    <>
      {groups.map((g) => (
        <div key={g.id} className="tgroup">
          <div className="sec">
            <span>
              {g.title}{" "}
              <span className="muted">
                · {g.tracks.length} track ·{" "}
                {g.tracks.reduce((a, [, ls]) => a + ls.length, 0)} lesson
              </span>
            </span>
          </div>
          <p className="gblurb">{g.blurb}</p>
          {g.tracks.map(([track, ls]) => {
            const id = `track-${slugify(track)}`;
            const isOpen = !!open[id];
            const listBody = () => (
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Lesson</th>
                    <th className="num">Langkah</th>
                    <th className="num">Estimasi</th>
                  </tr>
                </thead>
                <tbody>
                  {ls.map((l) => (
                    <tr key={l.slug}>
                      <td>
                        <Link className="name rowlink" href={`/v2/learn/${l.slug}`}>
                          {l.title}
                        </Link>
                        <span className="sub">{l.module}</span>
                      </td>
                      <td className="num">{l.steps.length}</td>
                      <td className="num muted">±{l.estMinutes} mnt</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
            return (
              <section key={track} id={id} className="tacc">
                <button
                  className="tacc-h"
                  aria-expanded={isOpen}
                  aria-controls={`${id}-list`}
                  onClick={() => toggle(id)}
                >
                  <span className="tacc-ic" aria-hidden="true">
                    <Icon name={trackIconFor(track)} className="i ti" />
                  </span>
                  <span className="tacc-n">{track}</span>
                  <span className="muted">{ls.length} lesson</span>
                  <span className="chev" aria-hidden="true" />
                </button>
                {reduce ? (
                  isOpen && (
                    <div className="tblwrap" id={`${id}-list`}>
                      {listBody()}
                    </div>
                  )
                ) : (
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="list"
                        className="tacc-anim"
                        id={`${id}-list`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <div className="tblwrap">{listBody()}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </section>
            );
          })}
        </div>
      ))}
    </>
  );
}
