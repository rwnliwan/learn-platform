"use client";
import { useState, useEffect, type ReactNode } from "react";
import Icon from "./icons";

// Collapsible dashboard sidenav: full (232px) <-> icon rail (56px).
// State persists in localStorage; labels are visually hidden in rail mode
// but stay in the DOM so screen readers keep announcing them.
const KEY = "v2:nav";

export default function Sidenav({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(KEY) === "rail");
    } catch {
      /* noop */
    }
  }, []);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(KEY, next ? "rail" : "full");
      } catch {
        /* noop */
      }
      return next;
    });
  }

  return (
    <aside className="sidenav" data-collapsed={collapsed ? "true" : "false"}>
      <div className="brand">
        <span className="nlbl">Learn</span>
        <i />
      </div>
      {children}
      <div className="navcollapse">
        <button
          type="button"
          className="navtoggle"
          onClick={toggle}
          aria-expanded={collapsed ? "false" : "true"}
          aria-label={collapsed ? "Perluas menu navigasi" : "Kecilkan menu navigasi"}
          title={collapsed ? "Perluas menu" : "Kecilkan menu"}
        >
          <Icon name={collapsed ? "right" : "left"} />
          <span className="nlbl">{collapsed ? "Perluas" : "Kecilkan"}</span>
        </button>
      </div>
    </aside>
  );
}
